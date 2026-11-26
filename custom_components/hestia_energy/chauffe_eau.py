"""The water heater driven by Hestia Energy (1.0.1b1), the Home Assistant side: what is read, kept and published.

The decisions are in engine/water_heater.py (plain Python). Here:
- every hour (the reports): what is learned from the statistics, and the sun forecast (the Energy page's forecast, else
  Hestia Weather's clouds by `hestia_weather_api` version 1, never its settings);
- every minute and on every live change (at most every 10 s): the reserve moved on, the plan made again every 5 minutes
  (or at once when something changes), the decision now, the day's ledger.
Nothing is commanded from here: « Chauffe-eau : chauffer » is published, and the household's automation follows it
(not in « Simulation », the default: then the blueprint does nothing).
"""
from __future__ import annotations

from datetime import date, datetime, timedelta
import logging
import time

from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from . import reader
from .const import DOMAIN
from .engine import advice, tariff, water_heater as wh

_LOGGER = logging.getLogger(__name__)
REPLAN = timedelta(minutes=5)
MIN_SWITCH = timedelta(minutes=10)    # the plug kept in a state at least this long, unless hot water or the breaker
FULL_AFTER = timedelta(minutes=10)    # allowed to heat this long and drawing nothing for 5 minutes: the tank is full
IDLE_W = 50
BOOST_MAX = timedelta(hours=4)
NEAR_BREAKER = 0.95
LEDGER_DAYS = 35
SAVE_EVERY = timedelta(minutes=10)
DEFAULT_NEED_KWH = 5.0
DEFAULT_POWER_KW = 2.0


class WaterHeater:
    def __init__(self, coordinator) -> None:
        self.c = coordinator
        self.hass = coordinator.hass
        self.store = Store(self.hass, 1, f"{DOMAIN}.chauffe_eau")
        self.tank = wh.Tank()
        # In Simulation, the household's own tank, followed from what the heater really takes (its own contactor
        # drives it): the reserve shown is this one, not the plan's (Frank, 26 Nov. 2026: « hier soir plus d'eau chaude »).
        self.real = wh.Tank()
        self._real_on_at: datetime | None = None
        self._real_idle_since: datetime | None = None
        self.learned: wh.Learned | None = None
        self.forecast: dict[datetime, float] = {}   # the panels' production expected each hour (UTC start), kW
        self.forecast_from: str | None = None       # « prevision » (Energy page), « nuages » (Hestia Weather), None
        self.ledger: dict[str, dict] = {}            # each local day: what the heater really took, what Hestia would
        self.plan: wh.Plan | None = None
        self._planned_at: datetime | None = None
        self.on = False
        self._changed_at: datetime | None = None
        self._idle_since: datetime | None = None
        self._boost_until: datetime | None = None
        self._ratio: float | None = None
        self._clouds = False
        self._saved_at: datetime | None = None
        self._dirty = False
        self._ledger_at: datetime | None = None
        self._mode_planned: str | None = None

    # --- settings and what is found ---------------------------------------------------------------------------

    @property
    def settings(self) -> dict:
        own = self.c.settings.get("chauffe_eau") or {}
        return {**wh.DEFAULTS, **{k: v for k, v in own.items() if k in wh.DEFAULTS}}

    @property
    def mode(self) -> str:
        mode = self.settings["mode"]
        return mode if mode in wh.MODES else wh.SIMULATION

    def meter(self):
        """The water heater of the Energy page: the one chosen in the settings, else the first one named so."""
        page = self.c.page
        if page is None:
            return None
        chosen = self.settings.get("appareil")
        devices = page.devices
        if chosen:
            return next((m for m in devices if m.stat == chosen), None)
        return next((m for m in devices if advice.kind_of(m.name or self.c.device_names.get(m.stat), m.stat) == "chauffe_eau"), None)

    def found(self) -> bool:
        s = self.settings
        return self.meter() is not None or bool(s.get("prise") and s.get("puissance_w"))

    async def async_load(self) -> None:
        kept = await self.store.async_load() or {}
        self.tank = wh.Tank.from_dict(kept.get("reserve"))
        self.real = wh.Tank.from_dict(kept.get("reserve_reelle"))
        self.ledger = {d: v for d, v in (kept.get("jours") or {}).items() if isinstance(v, dict)}

    async def async_save(self) -> None:
        self._dirty = False
        await self.store.async_save({"reserve": self.tank.as_dict(), "reserve_reelle": self.real.as_dict(), "jours": self.ledger})

    # --- every hour --------------------------------------------------------------------------------------------

    def learn(self, now: datetime) -> None:
        """Worker thread (plain Python on the home already read): power, need, the rest of the home, clear sky."""
        home = self.c.home
        meter = self.meter()
        if home is None:
            return
        reading = home.readings.get(meter.stat) if meter else None
        since = now - timedelta(days=wh.LEARN_DAYS + 2)
        heater = [(h.start, h.kwh) for h in reading.series.between(since, now) if h.kwh is not None and h.hours == 1] if reading else []
        sums: dict[datetime, float] = {}
        complete: dict[datetime, int] = {}
        parts = ((home.bought, 1), (home.sun, 1), (home.sent, -1)) if home.sun is not None else ((home.bought, 1),)
        for series, sign in parts:
            if series is None:
                continue
            for h in series.between(now - timedelta(days=15), now):
                if h.kwh is None or h.hours != 1:
                    continue
                sums[h.start] = sums.get(h.start, 0.0) + sign * h.kwh
                complete[h.start] = complete.get(h.start, 0) + 1
        used = [(t, v) for t, v in sums.items() if complete[t] == sum(1 for s, _ in parts if s is not None)]
        sun = [(h.start, h.kwh) for h in home.sun.between(now - timedelta(days=31), now)
               if h.kwh is not None and h.hours == 1] if home.sun is not None else []
        self.learned = wh.learn(heater, used, sun, self.c.tz, now)

    async def async_forecast(self, now: datetime) -> None:
        """The panels' production expected, hour by hour: the Energy page's forecast (Forecast.Solar, Solcast…), else
        Hestia Weather's clouds over the panels' clear-sky production learned here."""
        page = self.c.page
        if page is None or not page.solar:
            self.forecast, self.forecast_from = {}, None
            return
        entries = sorted({e for m in page.solar for e in m.forecasts})
        found = await reader.solar_forecast(self.hass, entries) if entries else {}
        if found:
            self.forecast, self.forecast_from = found, "prevision"
            return
        clear = self.learned.clear_kw if self.learned else ()
        hours = reader.weather_hours(self.hass, (self.c.weather or {}).get("lieu")) if self.c.used("meteo") else []
        out = {}
        for hour in hours:
            local = hour["time"].astimezone(self.c.tz)
            kw = wh.sun_from_clouds(clear, hour.get("cloud_coverage"), hour.get("condition"), local.hour)
            if kw is not None:
                out[hour["time"].astimezone(dt_util.UTC).replace(minute=0, second=0, microsecond=0)] = kw
        if not out and self.learned and self.learned.usual_kw:
            # Neither a forecast nor Hestia Weather: the panels' usual day of the last two weeks, hour by hour.
            usual = self.learned.usual_kw
            start = now.astimezone(self.c.tz).replace(minute=0, second=0, microsecond=0)
            for h in range(48):
                at = start + timedelta(hours=h)
                out[at.astimezone(dt_util.UTC)] = usual[at.hour]
            self.forecast, self.forecast_from = out, "habitude"
            return
        self.forecast, self.forecast_from = out, ("nuages" if out else None)

    def _sun_at(self, at: datetime) -> float | None:
        if not self.forecast:
            return None
        hour = at.astimezone(dt_util.UTC).replace(minute=0, second=0, microsecond=0)
        return self.forecast.get(hour, 0.0)

    # --- every minute ------------------------------------------------------------------------------------------

    def _number(self, entity: str | None) -> float | None:
        state = self.hass.states.get(entity) if entity else None
        if state is None:
            return None
        try:
            return float(state.state)
        except (TypeError, ValueError):
            if entity.startswith("water_heater."):
                value = state.attributes.get("current_temperature")
                return float(value) if isinstance(value, (int, float)) else None
            return None

    def _plug(self) -> str | None:
        entity = self.settings.get("prise")
        state = self.hass.states.get(entity) if entity else None
        return None if state is None else state.state

    def _price_at(self, now: datetime):
        c = self.c
        contract, live = c.contract, c.data.get("direct") or {}
        today_tempo = (now.astimezone(c.tz) - timedelta(hours=6)).date()

        def price(at: datetime) -> float | None:
            if contract is None:
                return None
            colour = None
            if contract.option == tariff.TEMPO:
                day = (at.astimezone(c.tz) - timedelta(hours=6)).date()
                colour = live.get("couleur") if day == today_tempo else live.get("couleur_demain") if day == today_tempo + timedelta(days=1) else None
                colour = colour or "bleu"    # a colour not known yet: planned as a blue day, made again when it is
            period = None if contract.option == tariff.BASE else (tariff.HC if self._offpeak(at) else tariff.HP)
            return tariff.price_at(contract, c.table, at, c.tz, period, colour)
        return price

    def _offpeak(self, at: datetime) -> bool:
        c = self.c
        if c.contract is not None and c.contract.option == tariff.BASE:
            return False
        return bool(c.offpeak and c.offpeak.contains(at, c.tz))

    def update(self, now: datetime) -> dict | None:
        """Moves everything on to `now` (Home Assistant's loop, a few milliseconds) and gives what is published."""
        if not self.found():
            return None
        s = self.settings
        tz = self.c.tz
        mode = self.mode
        live = self.c.data.get("direct") or {}
        learned = self.learned or wh.Learned(None, None, None, 0)
        meter = self.meter()
        reading = self.c._reading(meter.power.rate) if meter and meter.power.rate else None
        heater_w = reading.watts if reading is not None else None
        power_kw = (s.get("puissance_w") or 0) / 1000 or learned.power_kw or DEFAULT_POWER_KW
        setpoint = float(s.get("consigne") or 60)
        capacity = wh.capacity_kwh(s.get("litres"), setpoint, learned)
        times = wh.parse_ranges(s.get("heures"))
        away = mode == wh.AWAY

        def need_at(day: date) -> float:
            return 0.0 if away else learned.need(day) or DEFAULT_NEED_KWH

        local = now.astimezone(tz)
        real = mode != wh.SIMULATION
        # The reserve moved on: heated by the heater itself when Hestia drives it, by the plan in Simulation.
        heated = (heater_w / 1000 if heater_w is not None else (power_kw if self.on else 0.0)) if real else (power_kw if self.on else 0.0)
        seen_full = False
        if real:
            plug = self._plug()
            allowed = self.on and plug != "off"
            if allowed and heater_w is not None and heater_w < IDLE_W and self._changed_at and now - self._changed_at >= FULL_AFTER:
                self._idle_since = self._idle_since or now
                seen_full = now - self._idle_since >= timedelta(minutes=5)
            else:
                self._idle_since = None
        room = capacity - (self.tank.kwh if self.tank.kwh is not None else capacity * 0.9)
        self.tank.follow(now, tz, heated, need_at(local.date()), times, capacity, seen_full)
        probe = wh.reserve_from_temperature(self._number(s.get("sonde")), setpoint, capacity)
        if probe is not None and real:
            self.tank.kwh = probe
            if probe >= capacity - 0.05:
                self.tank.full_at = now
        if not real:
            self._follow_real(now, tz, heater_w, need_at(local.date()), times, capacity, probe)
        self._ledger(now, heater_w, power_kw * 1000 if self.on and room > 0.05 else 0.0, live)

        # The sun measured against the forecast: the clouds come (or go) before the forecast says so.
        sun_w, house_w = live.get("soleil_w"), live.get("maison_w")
        expected = self._sun_at(now)
        if sun_w is not None and expected is not None and expected >= 0.5:
            ratio = max(0.0, min(1.5, sun_w / 1000 / expected))
            self._ratio = ratio if self._ratio is None else 0.7 * self._ratio + 0.3 * ratio
        elif expected is None or expected < 0.2:
            self._ratio = None
        spare = None
        if sun_w is not None and house_w is not None:
            # The sun left once the rest of the home is served (the heater's own use given back).
            spare = max(0.0, sun_w - (house_w - (heater_w or 0.0))) / 1000
        elif live.get("revente_w") is not None:
            spare = live["revente_w"] / 1000

        kva = self.c.contract.kva if self.c.contract else None
        limit_kw = kva * (1 - self.c.settings.get("margin", 0.1)) if kva else None
        bought = live.get("achat_w")
        near_breaker = bool(kva and bought is not None and bought >= NEAR_BREAKER * kva * 1000)
        hygiene_due = self.tank.full_at is None or now - self.tank.full_at >= timedelta(days=wh.HYGIENE_DAYS)
        min_kwh = 0.0 if away else capacity * float(s.get("reserve_min") or 0.3)

        if self.plan is None or self._planned_at is None or now - self._planned_at >= REPLAN or mode != self._mode_planned:
            began = time.perf_counter()
            slots = wh.build_slots(now, tz, self._price_at(now), self._offpeak, self._sun_at, learned, need_at, times,
                                   spare, self._ratio)
            settings = wh.Settings(capacity, power_kw, min_kwh, self.c.contract.export_price if self.c.contract else None,
                                   limit_kw, int(s.get("demarrages") or 4), hygiene_due)
            previous = self.plan
            self.plan = wh.make_plan(slots, self.tank.kwh or 0.0, settings, keep_on=self.on and not near_breaker)
            self._clouds = bool(previous and previous.on and previous.on[0] and previous.source[0] in ("soleil", "soleil_partiel")
                                and not self.plan.on[0] and self._ratio is not None and self._ratio < 0.5)
            self._planned_at, self._mode_planned = now, mode
            took = time.perf_counter() - began
            if took > 0.05:
                _LOGGER.debug("Water heater plan made in %.3f s", took)

        full = (self.tank.kwh or 0) >= capacity - 0.05
        reason, wanted = self._decide(now, mode, full, near_breaker)
        if wanted != self.on and self._changed_at and now - self._changed_at < MIN_SWITCH \
                and reason not in ("eau_chaude_d_abord", "delestage", "plein", "boost"):
            wanted = self.on
            reason = "attente" if not wanted else reason
        if wanted != self.on:
            self.on, self._changed_at = wanted, now
            self._idle_since = None
        elif self._changed_at is None:
            self._changed_at = now
        if self._dirty and (self._saved_at is None or now - self._saved_at >= SAVE_EVERY):
            self._saved_at = now
            self.c._background(self.async_save(), f"{DOMAIN}_chauffe_eau_saved")
        return self._published(now, mode, reason, full, capacity, power_kw, learned, near_breaker)

    def _follow_real(self, now: datetime, tz, heater_w: float | None, need: float, times, capacity: float,
                     probe: float | None) -> None:
        """Simulation: the household's own tank, from what the heater really takes. Full when it stops by itself: it was
        heating, then draws nothing for 5 minutes while its contactor still lets it (off-peak hours, or all day on a
        base contract), not at the end of the off-peak hours. A temperature probe, when there is one, says it."""
        if heater_w is None:
            return      # no measure of the heater: nothing to follow
        seen_full = False
        if heater_w >= wh.MIN_ON_KW * 1000:
            self._real_on_at, self._real_idle_since = now, None
        elif heater_w < IDLE_W and self._real_on_at and now - self._real_on_at <= timedelta(minutes=10):
            contract = self.c.contract
            allowed = (contract is None or contract.option == tariff.BASE
                       or (self._offpeak(now) and self._offpeak(self._real_on_at) and self._offpeak(now + timedelta(minutes=10))))
            if allowed:
                self._real_idle_since = self._real_idle_since or now
                seen_full = now - self._real_idle_since >= timedelta(minutes=5)
            else:
                self._real_idle_since = None
        self.real.follow(now, tz, heater_w / 1000, need, times, capacity, seen_full)
        if seen_full:
            self._real_on_at = self._real_idle_since = None
        if probe is not None:
            self.real.kwh = probe
            if probe >= capacity - 0.05:
                self.real.full_at = now

    def _decide(self, now: datetime, mode: str, full: bool, near_breaker: bool) -> tuple[str, bool]:
        if near_breaker:
            return "delestage", False
        if self._boost_until is not None:
            if full or now >= self._boost_until:
                self._boost_until = None
            else:
                return "boost", True
        if mode == wh.OFFPEAK:
            offpeak = self._offpeak(now)
            return ("heures_creuses" if offpeak else "attente"), offpeak
        plan = self.plan
        if plan is None or not plan.on:
            return "attente", False
        if plan.on[0]:
            if plan.urgent:
                return "eau_chaude_d_abord", True
            if plan.hygiene and plan.source[0] not in ("soleil", "soleil_partiel"):
                return "hygiene", True
            return plan.source[0] or "heures_creuses", True
        return ("plein" if full else "attente"), False

    def boost(self, now: datetime) -> None:
        """« Chauffer maintenant » (the forced heating): until the tank is full (at most 4 hours), then the plan again."""
        self._boost_until = now + BOOST_MAX
        self._planned_at = None

    def stop_boost(self) -> None:
        """The forced heating stopped by hand: the plan again."""
        self._boost_until = None
        self._planned_at = None

    def replan(self) -> None:
        self._planned_at = None

    def _ledger(self, now: datetime, heater_w: float | None, hestia_w: float, live: dict) -> None:
        """Each day: the energy and euros the heater really took, and those of Hestia's plan (the same in Automatique;
        in Simulation, what it would have taken). The sun used is priced at the resale lost."""
        last, self._ledger_at = self._ledger_at, now
        if last is None:
            return
        hours = (now - last).total_seconds() / 3600
        if hours <= 0 or hours > 0.5:
            return
        price = live.get("prix")
        resale = self.c.contract.export_price if self.c.contract and self.c.contract.export_price is not None else 0.0
        sun_w, house_w = live.get("soleil_w"), live.get("maison_w")
        day = now.astimezone(self.c.tz).date().isoformat()
        entry = self.ledger.setdefault(day, {"reel_kwh": 0.0, "reel_eur": 0.0, "hestia_kwh": 0.0, "hestia_eur": 0.0,
                                             "hc_eur": 0.0, "prix_inconnu": False})

        def euros(watts: float, others_w: float | None) -> float | None:
            sun = 0.0
            if sun_w is not None and others_w is not None:
                sun = min(watts, max(0.0, sun_w - others_w))
            if price is None and watts - sun > 1:
                return None
            return (sun * resale + (watts - sun) * (price or 0.0)) / 1000 * hours

        others = None if house_w is None else house_w - (heater_w or 0.0)
        if heater_w is not None:
            e = euros(heater_w, others)
            entry["reel_kwh"] += heater_w / 1000 * hours
            if e is None:
                entry["prix_inconnu"] = True
            else:
                entry["reel_eur"] += e
        if hestia_w > 0:
            e = euros(hestia_w, others)
            entry["hestia_kwh"] += hestia_w / 1000 * hours
            if e is not None:
                entry["hestia_eur"] += e
            # The same energy at the off-peak price: what a plain off-peak contactor would have paid.
            hc = self.c._price_of("hc", now) if self.c.contract and self.c.contract.option == tariff.HPHC else price
            if hc is not None:
                entry["hc_eur"] += hestia_w / 1000 * hours * hc
        for old in sorted(self.ledger)[:-LEDGER_DAYS]:
            del self.ledger[old]
        self._dirty = True

    # --- what is published -------------------------------------------------------------------------------------

    def _published(self, now, mode, reason, full, capacity, power_kw, learned, near_breaker) -> dict:
        tz = self.c.tz
        plan = self.plan
        runs = plan.runs() if plan else []
        current = runs[0] if runs and plan.on and plan.on[0] else None
        following = next((r for r in runs if r is not current), None)
        pct = None if self.tank.kwh is None else round(self.tank.kwh / capacity * 100)
        panels = bool(self.c.page and self.c.page.solar)
        sentence = wh.say(plan, now, tz, full, panels, self._clouds, mode, "delestage" if near_breaker else None) if plan else ""
        if reason == "boost":
            sentence = "Chauffe demandée : jusqu'au plein, puis le plan reprend."
        elif mode == wh.OFFPEAK:
            sentence = "Heures creuses seules : le chauffe-eau chauffe pendant les heures creuses, sans plan."
        curve = []
        if plan:
            for i in range(0, len(plan.slots), 2):        # every half hour: enough for the card's drawing
                slot = plan.slots[i]
                on = plan.on[i] or (i + 1 < len(plan.on) and plan.on[i + 1])
                src = plan.source[i] or (plan.source[i + 1] if i + 1 < len(plan.source) else None)
                curve.append([slot.start.isoformat(), round(max(0.0, plan.reserve[i]) / capacity * 100),
                              round(slot.sun_forecast_kw, 2), None if slot.price is None else round(slot.price, 4),
                              1 if slot.offpeak else 0, src if on else None])
        days = sorted(self.ledger)[-7:]
        bilan = [{"jour": d, **{k: round(v, 3) if isinstance(v, float) else v for k, v in self.ledger[d].items()}} for d in days]
        missing = []
        if self.meter() is None:
            missing.append("appareil")
        if learned.need_week_kwh is None:
            missing.append("besoin")
        if not self.settings.get("litres"):
            missing.append("litres")
        if mode != wh.SIMULATION and not self.settings.get("prise"):
            missing.append("prise")
        return {
            "mode": mode, "simulation": mode == wh.SIMULATION, "chauffer": self.on, "raison": reason, "phrase": sentence,
            "jusqu_a": current["fin"] if current and self.on else None,
            "prochaine_chauffe": following["debut"] if following else (current["debut"] if current and not self.on else None),
            "reserve": pct, "reserve_kwh": None if self.tank.kwh is None else round(self.tank.kwh, 2),
            "force_jusqu_a": self._boost_until.isoformat() if self._boost_until else None,
            # Simulation: the household's own tank (the plan's is `reserve`); None when Hestia drives the heater.
            "reserve_reelle": None if mode != wh.SIMULATION or self.real.kwh is None else round(self.real.kwh / capacity * 100),
            "reserve_reelle_kwh": None if mode != wh.SIMULATION or self.real.kwh is None else round(self.real.kwh, 2),
            "sonde": bool(self.settings.get("sonde")),
            "capacite_kwh": round(capacity, 2), "puissance_kw": round(power_kw, 2),
            "besoin_kwh": round(learned.need(now.astimezone(tz).date()) or DEFAULT_NEED_KWH, 1),
            "plan": runs[:8], "kwh_prevus": round(plan.kwh, 2) if plan else None, "cout_prevu": round(plan.euros, 2) if plan else None,
            "manque_a": plan.short_at.isoformat() if plan and plan.short_at else None,
            "courbe": curve, "soleil_prevu": self.forecast_from, "plein_le": self.tank.full_at.isoformat() if self.tank.full_at else None,
            "heures": wh.parse_hours(self.settings.get("heures")),
            "plages": [[start, (start + length) % 1440] for start, length in wh.parse_ranges(self.settings.get("heures"))], "reserve_min": float(self.settings.get("reserve_min") or 0.3),
            "bilan": bilan, "appris": learned.as_dict(), "manque": missing,
            "prise": self.settings.get("prise"), "prise_etat": self._plug(),
            "suit": None if mode == wh.SIMULATION or not self.settings.get("prise") or self._plug() not in ("on", "off")
            else (self._plug() == "on") == self.on or (self._changed_at is not None and now - self._changed_at < timedelta(minutes=5)),
        }
