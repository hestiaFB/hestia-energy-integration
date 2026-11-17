"""The home's energy, kept up to date: reports from the statistics every hour, the banner from the live states.

Two rhythms (README of the socle: nothing long on Home Assistant's loop):
- every hour (and when the Energy page changes), the statistics of the page's meters are read and the engine builds
  the reports in a worker thread: the whole year at the start and once a day, the last three days otherwise;
- on every change of a live entity (at most every 10 s) and every minute, the live arbiter and the banner.
Everything the entities, the interface and the websocket show is in `self.data`, one dict, never recomputed by them.
"""
from __future__ import annotations

import asyncio
import dataclasses
from datetime import date, datetime, timedelta
import logging
import re
from zoneinfo import ZoneInfo

from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import async_call_later, async_track_state_change_event, async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from . import hub_view, reader
from .const import DOMAIN
from .engine import advice, anomaly, baseline, cards, daily, health, heating, hub, solar, home as engine_home, live, phrases, report, sources, stats, tariff
from .engine.rows import Rows, merge as merge_rows

_LOGGER = logging.getLogger(__name__)
YEAR_DAYS = 400
RECENT_DAYS = 3
FULL_EVERY = timedelta(hours=24)
LIVE_MIN_S = 10
# The household's settings with their defaults (rule: what depends on the home is a setting, never a constant).
DEFAULTS = {"kva": None, "option": None, "margin": 0.1, "watched": {"seche_serviettes": 24}, "export_price": None,
            # the pellet bag (€), when Suivi Stock Pellet has no purchase to price the kilo from
            "bag_price": None,
            # the off-peak hours as typed (« 22:00-06:00 »), used when no meter shows them
            "offpeak": None,
            # 2.9: the reviews sent by a notify service of Home Assistant, at this hour; None: no notification (default)
            "notify_service": None, "notify_hour": 8,
            # The hub (INTERFACE.md § 5, H7): which reviews are sent, and the alerts sent at once.
            "notify_day": True, "notify_week": True, "notify_month": True, "notify_leak": True, "notify_forgot": True,
            # The price of a kWh: None reads the Energy page, « bleu » the regulated tariff, « autre » the prices typed
            # here (each falling back to the page's); the subscription a year with « autre ».
            "offer": None, "price_hp": None, "price_hc": None, "price_base": None, "subscription": None,
            # The water's price a cubic metre, when the Energy page has none or a wrong one.
            "water_price": None,
            # What a stove declared as gas in the Energy page burns: « pellets », « gas », or None (not said yet).
            "stove_fuel": None,
            # The Hestia Weather place that gives the cold of each day (its entry id); None: the only one, or the first.
            "weather_place": None,
            # The group of each device ({statistic: « chauffage »…}), when the guess from its name is wrong (H5).
            "groups": {},
            # Each extension used or not ({« tic »: False…}); absent means used (H8).
            "extensions": {}}


def _weather_updated() -> None:
    """Hestia Weather recomputed the place: nothing to do here (the cold is read at the hourly refresh)."""


class EnergyCoordinator:
    def __init__(self, hass: HomeAssistant, entry) -> None:
        self.hass = hass
        self.entry = entry
        self.tz = ZoneInfo(hass.config.time_zone)
        self.table: dict = {}
        self.store = Store(hass, 1, f"{DOMAIN}.settings")
        # Each past day's cold (degree-days from Hestia Weather): a past day never changes, so it is kept.
        self.cold_store = Store(hass, 1, f"{DOMAIN}.cold")
        # The Tempo colour of each day seen (the Recorder forgets them after ten days, the bills need them all).
        self.colour_store = Store(hass, 1, f"{DOMAIN}.tempo")
        self.colours: dict[date, str] = {}
        self.cold: dict[date, float] = {}
        self.weather_cold = "non"
        self.weather: dict = {"etat": "non", "lieu": None, "nom": None, "lieux": [], "choisi": False}
        self._cold_place: str | None = None          # the Weather place the kept cold was read from (None: not said)
        self._weather_stop = None                    # stops listening to that place
        self._sent_on: date | None = None
        self.panel_names: dict[str, str] = {}
        self.device_names: dict[str, str] = {}
        self.run_limits: dict[str, int] = {}     # 5.2: each device's learned « on for too long »
        self.run_hours: dict[str, int] = {}
        self.reference: dict[str, str] = {}
        self.home_raw: engine_home.Home | None = None   # the page's meters as they are, before following Enedis      # « achats » / « revente » → Enedis's statistic (HA Linky…)      # its whole hours on in a row, up to the last statistics hour
        self.inverter_silent: float | None = None
        self.settings = dict(DEFAULTS)
        self.page: sources.EnergyPage | None = None
        self.level: sources.Level | None = None
        self.extras: dict = {}
        self.rows: dict[str, Rows] = {}
        self._built_with = None          # what the home was last read from: the same again, it is not read again
        self.home: engine_home.Home | None = None
        self.offpeak: tariff.OffPeak | None = None
        self.offpeak_found: tariff.OffPeak | None = None   # learned from the meters, before the household's own hours
        self.found_extras: dict = {}                       # the extensions found, before those switched off (H8)
        self.page_prices: dict = {}                        # the prices the Energy page gives now
        self._alerted: set[str] = set()                    # the alerts already sent (leak, forgotten device)
        self.contract: tariff.Contract | None = None
        self.locality: dict[str, bool | None] = {}
        self.steady = advice.Steady()
        self.flow = live.Flow()
        self.data: dict = {"pret": False}
        self._listeners: list = []
        self._stop_listeners: list = []
        self._unsubs: list = []
        self._live_unsub = None
        self._last_full: datetime | None = None
        self._live_pending = None
        self._refreshing = asyncio.Lock()
        self._stopped = False
        self._retry = None
        self._failed = False
        # Each past day Hestia Weather could not give, with the day it was asked: asked again the next day only.
        self._cold_asked: dict[date, date] = {}

    # --- life ---------------------------------------------------------------------------------------------------

    async def async_prepare(self) -> None:
        """The Energy page and the extensions, read quickly before the entities are made: which ones exist (the level
        reached) is decided here; their values come with the first reports, in the background."""
        self.settings.update(await self.store.async_load() or {})
        kept = await self.cold_store.async_load() or {}
        # « lieu »: the Weather place the days were read from (absent before 17 Nov. 2026: kept for the place found first).
        self._cold_place = kept.get("lieu")
        self.cold = {date.fromisoformat(d): v for d, v in kept.items() if d != "lieu"}
        self.colours = {date.fromisoformat(d): c for d, c in (await self.colour_store.async_load() or {}).items()}
        # The regulated tariffs embedded in the brick: a file, read in a worker thread (never on the loop).
        self.table = await self.hass.async_add_executor_job(tariff.load_regulated)
        self.page = sources.read_page(await reader.energy_prefs(self.hass))
        self.extras = reader.detect(self.hass)
        self._switch_off()
        self.level = sources.equipment(self.page)
        self.data["source"] = self._source()
        periods = {m.period for m in self.page.imports}
        self.extras["prevision"] = any(m.forecasts for m in self.page.solar)
        self.data.update({"equipement": _level(self.level), "extensions": dict(self.extras), "marge": self.settings["margin"],
                          "contrat": {"option": self.settings.get("option") or ("hphc" if {"hp", "hc"} <= periods
                                                                                else "base" if self.page.imports else None)}})

    def _background(self, coro, name: str) -> None:
        """A task that ends with the entry: unloaded, nothing of it goes on (no live listener set again afterwards)."""
        if self._stopped:
            coro.close()
            return
        self.entry.async_create_background_task(self.hass, coro, name)

    async def async_start(self) -> None:
        self._unsubs.append(await reader.listen_prefs(self.hass, self._prefs_changed))
        # The meter's period (TIC), the inverters, the pellets come from integrations that may publish their entities
        # after this one starts: looked for again once Home Assistant has started, and five minutes later.
        fired = []

        async def again(_event=None) -> None:
            if _event is not None:
                fired.append(True)
            await self.async_refresh(full=False)

        if not self.hass.is_running:
            remove = self.hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, again)
            # a listener heard once is gone: removing it again at unload would be an error
            self._unsubs.append(lambda: None if fired else remove())
        self._unsubs.append(async_call_later(self.hass, 300, again))
        self._unsubs.append(async_track_time_interval(self.hass, self._hourly, timedelta(hours=1)))
        self._unsubs.append(async_track_time_interval(self.hass, self._minute, timedelta(minutes=1)))
        self._background(self.async_refresh(full=True), f"{DOMAIN}_first_reports")

    async def async_stop(self) -> None:
        self._stopped = True
        for stopped in list(self._stop_listeners):
            stopped()
        self._stop_listeners.clear()
        for unsub in self._unsubs:
            unsub()
        for cancel in (self._live_unsub, self._live_pending, self._retry):
            if cancel:
                cancel()
        self._live_unsub = self._live_pending = self._retry = None
        if self._weather_stop:
            self._weather_stop()
            self._weather_stop = None
        self._unsubs.clear()
        self._listeners.clear()

    def add_stop_listener(self, stopped):
        """Called once when the brick stops (unloaded, reloaded): the cards follow the new one."""
        self._stop_listeners.append(stopped)
        return lambda: self._stop_listeners.remove(stopped) if stopped in self._stop_listeners else None

    def add_listener(self, update):
        self._listeners.append(update)
        return lambda: self._listeners.remove(update) if update in self._listeners else None

    def _notify(self) -> None:
        for update in list(self._listeners):
            update()

    async def _prefs_changed(self) -> None:
        await self.async_refresh(full=True)

    async def _hourly(self, _now=None) -> None:
        full = self._last_full is None or dt_util.utcnow() - self._last_full >= FULL_EVERY
        await self.async_refresh(full=full)

    async def _minute(self, _now=None) -> None:
        self._update_live()
        await self._send_reviews()

    async def _send_reviews(self) -> None:
        """Every morning at the chosen hour: yesterday's review; on Mondays last week's too, on the 1st last month's.
        Only when the household chose a notify service; once a day; another integration's trouble never stops this one."""
        service = self.settings.get("notify_service")
        local = dt_util.now(self.tz)
        if not service or local.hour != self.settings.get("notify_hour", 8) or self._sent_on == local.date():
            return
        wanted = ({"hier"} if self.settings.get("notify_day", True) else set()) \
            | ({"semaine"} if local.weekday() == 0 and self.settings.get("notify_week", True) else set()) \
            | ({"mois"} if local.day == 1 and self.settings.get("notify_month", True) else set())
        reviews = [r for r in self.data.get("bilans") or [] if r["id"] in wanted]
        if not reviews:
            return
        self._sent_on = local.date()
        name = service.split(".", 1)[-1]
        for review in reviews:
            try:
                await self.hass.services.async_call("notify", name, {"title": review["titre"], "message": review["texte"]},
                                                    blocking=False)
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Review not sent by notify.%s: %s", name, err)
                return

    def used(self, key: str) -> bool:
        """An extension the household did not switch off in the hub (H8): « tic », « linky », « tempo », « opendtu »,
        « comwatt », « vt », « pellets », « meteo », « confort »."""
        return (self.settings.get("extensions") or {}).get(key, True) is not False

    def _switch_off(self) -> None:
        """What was found is kept for the hub; then the engine forgets the extensions switched off (H8). Nothing is
        uninstalled: switched on again, they are read again at the next refresh."""
        self.found_extras = dict(self.extras)
        if not self.used("tic"):
            self.extras["period"] = None
        if not self.used("tempo"):
            self.extras["tempo_today"] = self.extras["tempo_tomorrow"] = None
        if not self.used("opendtu"):
            self.extras["inverter"], self.extras["channels"] = None, []
        if not self.used("pellets"):
            self.extras["pellets"] = None
        if not self.used("comwatt") and self.page is not None and self.page.devices:
            found = reader.origins(self.hass, [m.stat for m in self.page.devices])
            self.page.devices = [m for m in self.page.devices if (found.get(m.stat) or {}).get("platform") != "comwatt"]

    @callback
    def _alert(self, banner: dict | None) -> None:
        """A water leak or a forgotten device, sent at once to the phone the household chose (H7), once each time it
        shows. Another integration's trouble never stops this one."""
        switch = {"fuite_eau": "notify_leak", "oublie": "notify_forgot"}
        key = f"{banner['id']}:{banner['titre']}" if banner and banner.get("id") in switch else None
        self._alerted &= {key} if key else set()
        service = self.settings.get("notify_service")
        if key is None or key in self._alerted or not service or not self.settings.get(switch[banner["id"]], True):
            return
        self._alerted.add(key)
        name = service.split(".", 1)[-1]

        async def send() -> None:
            try:
                await self.hass.services.async_call("notify", name, {"title": banner["titre"], "message": banner.get("pourquoi") or ""},
                                                    blocking=False)
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Alert not sent by notify.%s: %s", name, err)
        self.hass.async_create_task(send())

    async def async_save_settings(self, changes: dict, wait: bool = True) -> None:
        """Kept at once; the reports follow. From the hub (`wait=False`) the answer does not wait for them: a refresh
        may already be reading a year of statistics."""
        self.settings.update(changes)
        await self.store.async_save(self.settings)
        if wait:
            await self.async_refresh(full=False)
        else:
            self._background(self.async_refresh(full=False), f"{DOMAIN}_settings_saved")

    # --- the reports (every hour) -------------------------------------------------------------------------------

    async def async_refresh(self, full: bool) -> None:
        """The reports again. One that fails keeps the last figures, says so once in the log, and is tried again five
        minutes later (audit of 9 Nov. 2026: a first report failing left the cards « reading » for an hour, silently)."""
        if self._stopped:
            return
        try:
            async with self._refreshing:
                await self._refresh(full)
        except Exception:  # noqa: BLE001 - the brick goes on with its last figures
            if not self._failed:
                _LOGGER.exception("Hestia Énergie : bilans non refaits, les derniers chiffres restent ; nouvel essai dans 5 min")
            self._failed = True
            if self._retry is None and not self._stopped:
                self._retry = async_call_later(self.hass, 300, self._retry_due)
            return
        if self._failed:
            _LOGGER.info("Hestia Énergie : bilans de nouveau à jour")
        self._failed = False
        if not self._stopped:
            self._update_live()

    @callback
    def _retry_due(self, _now) -> None:
        self._retry = None
        self._background(self.async_refresh(full=self._last_full is None), f"{DOMAIN}_retry")

    async def _refresh(self, full: bool) -> None:
        prefs = await reader.energy_prefs(self.hass)
        before = self.rows
        self.page = sources.read_page(prefs)
        self.extras = reader.detect(self.hass)
        self.extras["prevision"] = any(m.forecasts for m in self.page.solar)
        # The other bricks, as Home Assistant has loaded them (never guessed from entity names).
        self.extras["meteo"] = "hestia_weather" in self.hass.config.components
        self.extras["confort"] = "hestia_comfort" in self.hass.config.components
        self._switch_off()
        self.data["source"] = self._source()
        ids = {m.stat for m in self.page.meters}
        ids |= {e for m in self.page.meters for e in m.power.entities}
        ids |= set(self.extras["channels"])
        if self.extras.get("pellets"):
            ids.add(self.extras["pellets"]["consumed"])
        # Enedis (fait foi) when HA Linky or MyElectricalData imports it, and it is not the page's own meter.
        in_page = {m.stat for m in self.page.meters}
        self.reference = {k: v for k, v in (await reader.reference_statistics(self.hass)).items() if v not in in_page}
        if not self.used("linky"):
            self.reference = {}
        ids |= set(self.reference.values())
        now = dt_util.utcnow()
        meta = await reader.metadata(self.hass, ids)
        self.level = sources.equipment(self.page, meta)
        start = now - timedelta(days=YEAR_DAYS if full or not self.rows else RECENT_DAYS)
        fresh = {sid: Rows.of(values) for sid, values in (await reader.hourly(self.hass, ids, start)).items()}
        self.rows = fresh if full or not self.rows else _merge(self.rows, fresh, start)
        if full:
            self._last_full = now
        kva = self.settings.get("kva") or self.extras.get("kva")
        first = now - timedelta(days=YEAR_DAYS)
        # The same statistics, page and extensions as the last time: the home read then still holds (HA Linky sends
        # once a day; at start, the two looks for a late extension). Only the reports below are made again
        # (audit of 9 Nov. 2026: each hour read the whole year again, 13 s on the lab).
        built_with = (prefs, kva, tuple(self.extras["channels"]), tuple(sorted(self.reference.items())),
                      repr(self.settings.get("extensions")), repr(self.settings.get("stove_fuel")))
        if full or self.home_raw is None or built_with != self._built_with or self.rows != before:
            raw = await self.hass.async_add_executor_job(
                engine_home.build, self.page, self.rows, self.tz, first, kva, self.extras["channels"])
            # Enedis fait foi (Frank, 7 Nov. 2026): the bills follow its day totals when HA Linky brings them; the
            # page's own meters are kept to be checked against it. Both set together: the live part and the other
            # bricks never see one without the other.
            followed = await self.hass.async_add_executor_job(self._follow_enedis, raw)
            self.home_raw, self.home = raw, followed
            self._built_with = built_with
        imports = self.home.of("import")
        peak = next((r.series for r in imports if r.meter.period == "hp"), None)
        offpeak = next((r.series for r in imports if r.meter.period == "hc"), None)
        self.offpeak_found = tariff.learn_offpeak(peak, offpeak, self.tz) if peak and offpeak else None
        # The off-peak hours the household typed come first (the bill may say a few minutes more or less, H7);
        # else those learned on the two meters.
        self.offpeak = tariff.parse_offpeak(self.settings.get("offpeak")) or self.offpeak_found
        # Hour by hour is proven by the statistics: HA Linky gives its older days in one step each (F1.2).
        if self.level and not self.level.hourly:
            self.level = dataclasses.replace(self.level, hourly=_hourly(imports, now))
        for meter in self.page.meters:
            for entity in meter.power.entities:
                if entity not in self.locality:
                    self.locality[entity] = await reader.is_local(self.hass, entity)
        if self.extras.get("inverter") and self.extras["inverter"] not in self.locality:
            self.locality[self.extras["inverter"]] = await reader.is_local(self.hass, self.extras["inverter"])
        self._follow_weather()
        await self._fetch_cold(now)
        await self._fetch_colours(now)
        prices, export_price = self._prices(), self._export_price()
        self.page_prices = dict(prices)
        self.panel_names = {c: solar.panel_name(_friendly(self.hass, c)) for c in self.extras["channels"]}
        self.device_names = {m.stat: _device_name(_friendly(self.hass, m.stat)) for m in self.page.devices if not m.name}
        self.inverter_silent = self._inverter_silent()
        if self._stopped:
            return
        self._follow_live()
        self.data.update(await self.hass.async_add_executor_job(self._reports, now, prices, export_price))
        self.data["pret"] = True

    async def _fetch_colours(self, now: datetime) -> None:
        """The Tempo days' colours: what the Recorder still has, added to those already kept."""
        entity = self.extras.get("tempo_today")
        if not entity:
            return
        found = await reader.colour_history(self.hass, entity, now - timedelta(days=11))
        new = {d: c for d, c in found.items() if self.colours.get(d) != c}
        if new:
            self.colours.update(new)
            await self.colour_store.async_save({d.isoformat(): c for d, c in self.colours.items()})

    def _follow_weather(self) -> None:
        """The Hestia Weather place that gives the cold (chosen in the settings, else the only or the first one), and
        listening to it, so that Weather shows Énergie linked to this place. Listened to again at each refresh: a place
        reloaded in Weather (its settings changed) has forgotten its listeners. Nothing is done when it updates: the
        cold is read at the hourly refresh, and Weather updates every minute."""
        self.weather = reader.weather_place(self.hass, self.settings.get("weather_place")) if self.used("meteo") \
            else {"etat": "non", "lieu": None, "nom": None, "lieux": [], "choisi": False}
        self.weather_cold = self.weather["etat"]
        if self._weather_stop:
            self._weather_stop()
            self._weather_stop = None
        if self.weather_cold == "oui" and not self._stopped:
            self._weather_stop = reader.weather_listen(self.hass, self.weather["lieu"], _weather_updated)

    async def _fetch_cold(self, now: datetime) -> None:
        """The degree-days of the year from Hestia Weather: the past days missing, and today (still a forecast)."""
        if self.weather_cold != "oui":
            return
        place = self.weather["lieu"]
        if self._cold_place is not None and self._cold_place != place:
            # Another place: the days kept are another place's cold, read again from the new one.
            self.cold.clear()
            self._cold_asked.clear()
        if self._cold_place != place:
            self._cold_place = place
            await self._save_cold(now.astimezone(self.tz).date())
        today = now.astimezone(self.tz).date()
        first = today - timedelta(days=YEAR_DAYS)
        wanted = [first + timedelta(days=i) for i in range((today - first).days + 1)]
        # A past day Weather could not give (before its station, a gap) is asked again the next day, not every hour.
        missing = [d for d in wanted if d == today or (d not in self.cold and self._cold_asked.get(d) != today)]
        found = await reader.degree_days(self.hass, missing, place)
        self._cold_asked.update({d: today for d in missing if d not in found and d < today})
        past = {d: v for d, v in found.items() if d < today and d not in self.cold}
        self.cold.update(found)
        if past:
            await self._save_cold(today)

    async def _save_cold(self, today: date) -> None:
        await self.cold_store.async_save({"lieu": self._cold_place, **{d.isoformat(): v for d, v in self.cold.items() if d < today}})

    def _source(self) -> dict:
        """The consumption source (D21): which meters the page buys with, where each comes from, and the official
        sources to show when there is none."""
        names = {s["type"]: s["nom"] for s in sources.OFFICIAL}
        found = reader.origins(self.hass, [m.stat for m in self.page.imports]) if self.page else {}
        meters = []
        for meter in self.page.imports if self.page else []:
            origin = found.get(meter.stat) or {}
            kind = sources.source_of(meter.stat, origin.get("platform"), origin.get("device"))
            meters.append({"type": kind, "stat": meter.stat, "periode": meter.period,
                           "nom": names.get(kind) or origin.get("maker") or origin.get("integration") or "Compteur de la page Énergie"})
        return {"compteurs": meters, "direct": bool(self.extras and self.extras.get("period")) or any(m["type"] == sources.TIC for m in meters),
                "officielles": list(sources.OFFICIAL)}

    def _heating(self, home, local: datetime, month, weather: str) -> dict:
        """The heating estimated from the cold (9.2): one figure for this month and one for last winter, or why not."""
        stove = self._stove(local)
        if weather != "oui":
            state = {"non": "sans_meteo", "ancienne": "meteo_ancienne", "incompatible": "meteo_incompatible",
                     "sans_lieu": "meteo_sans_lieu"}.get(weather, "sans_meteo")
            return {"etat": state, "poele": stove}
        if not any(d < local.date() for d in self.cold):
            # Weather is there but gives no past day: its place has no temperature sensor, or none old enough. Said,
            # never left « learning » for ever.
            return {"etat": "meteo_sans_donnees", "lieu": self.weather.get("nom"), "poele": stove}
        used = home.used_days()
        learned = heating.learn(used, self.cold)
        if learned is None:
            return {"etat": "apprend", "jours": sum(1 for d in used if d in self.cold), "poele": stove}
        if not learned.reliable:
            return {"etat": "peu_lie", "poele": stove}
        today = local.date()
        this_month = heating.over(learned, self.cold, today.replace(day=1), today, month.bought_kwh, month.energy_eur)
        # Last winter: October to April before this one (the heating season), at its own prices.
        year = today.year if today.month >= 10 else today.year - 1
        start, end = date(year - 1, 10, 1), date(year, 4, 30)
        winter_report = report.period(home, self.contract, self.table, tariff.day_bounds(start, self.tz)[0],
                                      tariff.day_bounds(end, self.tz)[1])
        winter = heating.over(learned, self.cold, start, end, winter_report.bought_kwh, winter_report.energy_eur)
        # The season so far (from 1 October, the card's one period): the radiators at the season's own average price.
        first = cards.season_start(today)
        season_report = report.period(home, self.contract, self.table, tariff.day_bounds(first, self.tz)[0], local)
        season = heating.over(learned, self.cold, first, today, season_report.bought_kwh, season_report.energy_eur)
        per_kwh = season.eur / season.kwh if season is not None and season.eur is not None and season.kwh > 0 else None
        return {"etat": "pret", "mois": None if this_month is None else this_month.as_dict(),
                "saison": None if season is None else {**season.as_dict(), "du": first.isoformat()},
                "euros_par_degre": None if per_kwh is None else round(learned.per_degree_kwh * per_kwh, 3),
                # A winter only shown nearly whole (9 days in 10): a part of it would look like a cheap winter.
                "hiver_dernier": None if winter is None or winter.days < 0.9 * ((end - start).days + 1) else {**winter.as_dict(), "du": start.isoformat(),
                                                                                    "au": end.isoformat()},
                "par_degre_kwh": round(learned.per_degree_kwh, 2), "poele": stove}

    def _stove(self, local: datetime) -> dict | None:
        """The pellet stove this month and this season (from October), in kilos and euros (9.1)."""
        found = self.extras.get("pellets") if self.extras else None
        if not found:
            return None
        rows = self.rows.get(found["consumed"])
        per_kg = heating.price_per_kg(found.get("spent_eur"), found.get("bought_kg"), self.settings.get("bag_price"),
                                      found.get("bag_kg"))
        now = local
        month_start = datetime.combine(now.date().replace(day=1), datetime.min.time(), self.tz)
        season_year = now.year if now.month >= 10 else now.year - 1
        season_start = datetime(season_year, 10, 1, tzinfo=self.tz)
        if rows:
            series = stats.energy(found["consumed"], rows)
            month = heating.pellets(stats.total(series, month_start, now).kwh, per_kg)
            season = heating.pellets(stats.total(series, season_start, now).kwh, per_kg)
        else:
            # No statistics kept for it: the season's total Suivi Stock Pellet shows (it starts again each October).
            month, season = None, heating.pellets(found.get("season_kg"), per_kg)
        if season is None:
            return None
        first = cards.season_start(now.date())
        return {"mois": None if month is None else month.as_dict(), "saison": season.as_dict(), "prix_kg": None if per_kg is None else round(per_kg, 3),
                "sac_kg": found.get("bag_kg"), "du": first.isoformat(),
                **(cards.stove_stock(found.get("stock_kg"), season.kg, found.get("days_used"), first, now.date()) or {})}

    def _prices(self) -> dict:
        """The prices the Energy page gives now (an entity or a number), per period."""
        prices = {}
        for meter in self.page.imports if self.page else []:
            value = _number(self.hass.states.get(meter.price.entity)) if meter.price.entity else meter.price.number
            if value is not None:
                prices[meter.period or ("base" if len(self.page.imports) == 1 else "hp")] = value
        return prices

    def _export_price(self) -> float | None:
        if self.settings.get("export_price") is not None:
            return self.settings["export_price"]
        for meter in self.page.exports if self.page else []:
            value = _number(self.hass.states.get(meter.price.entity)) if meter.price.entity else meter.price.number
            if value is not None:
                return value
        return None

    def _reports(self, now: datetime, prices: dict, export_price: float | None) -> dict:
        """Everything the reports say (worker thread: plain Python only, no state read)."""
        home = self.home
        kva = self.settings.get("kva") or self.extras.get("kva")
        # A home showing the Tempo colour is on Tempo unless the household says otherwise.
        option = self.settings.get("option") or (tariff.TEMPO if self.extras.get("tempo_today") else None)
        contract = report.contract_for(home, kva, self.offpeak, prices, export_price, option)
        contract.colors = dict(self.colours)
        local = now.astimezone(self.tz)
        # The offer the household chose (H7): the regulated tariff, or its own prices and subscription.
        offer = self.settings.get("offer")
        if offer == "autre":
            own = {k: self.settings.get(f"price_{k}") for k in ("hp", "hc", "base")}
            contract.prices = {**contract.prices, **{k: v for k, v in own.items() if v is not None}}
            contract.subscription_year = self.settings.get("subscription")
        # The page's prices are today's (Tarif EDF): on the regulated tariff, every past day keeps its own price.
        elif offer == "bleu" or tariff.regulated_today(contract, self.table, local.date()):
            contract.prices = {}
        # Set whole, never changed afterwards: the live part and Hestia Comfort read it meanwhile (audit, 9 Nov. 2026).
        self.contract = contract
        today = report.day(home, self.contract, self.table, local.date())
        yesterday = report.day(home, self.contract, self.table, local.date() - timedelta(days=1))
        # The month up to the last hour known (HA Linky: the day before): its forecast is not stretched over days not
        # sent yet (found on a Linky-only home, 9 Nov. 2026: « 80 € prévus » for a month heading to 120 €).
        known = report.known_until(home)
        month = report.month(home, self.contract, self.table, local.year, local.month, min(now, known) if known else now)
        # Seven nights hour by hour are enough (HA Linky keeps its last week so): the same figure as the advice « à froid ».
        base = baseline.baseload(home.bought, self.tz, min_nights=daily.MIN_NIGHTS) if home.bought else None
        rise = baseline.rise(home.bought, self.tz, local.date()) if home.bought and base else None
        self._learn_runs()
        heat = self._heating(home, local, month, self.weather_cold)
        panels = self._panels(local)
        if self.contract.option == tariff.HPHC:
            price = baseline.average_price(self._price_of("hp", now), self._price_of("hc", now))
        else:
            price = self._price_of("base", now)
        hours_today = _hours(home, local.date())
        nights = _baseloads(home, local.date())
        # What a kWh of sun kept saves: the daytime price (peak hours, or Base).
        avoided = self._price_of("hp" if self.contract.option == tariff.HPHC else "base", now) if self.contract.option != tariff.TEMPO else None
        channels = {c: self.rows[c] for c in self.extras.get("channels") or [] if self.rows.get(c)}
        return {
            "palier": self.level.level if self.level else 0, "equipement": _level(self.level),
            "extensions": dict(self.extras), "marge": self.settings["margin"],
            "jour": today.as_dict(), "hier": yesterday.as_dict(), "mois": month.as_dict(),
            # The same month a year ago, whole (2.2): its euros may be unknown (tariffs not in the table), its kWh not.
            "mois_an_dernier": report.month(home, self.contract, self.table, local.year - 1, local.month).as_dict(),
            "projection": report.projection(month, min(now, known) if known else now),
            "chauffage": heat,
            "bilans": report.reviews(home, self.contract, self.table, now),
            "jusqu_ici": report.so_far(home, self.contract, self.table, now),
            # The latest whole day (HA Linky sends yesterday the next day): what the tile shows without live data.
            "dernier_jour": report.last_whole_day(home, self.contract, self.table, now),
            "veille": None if base is None else {"w": base.watts, "nuits": base.nights,
                                                  "euros_par_an": baseline.yearly_euros(base.watts, price),
                                                  # the cards (INTERFACE.md § 4.2): who draws at night, and since the first night
                                                  "nuit": cards.night_devices(home, local.date(), base.watts, price, self.device_names),
                                                  "evolution": cards.night_drift(nights, price)},
            "veille_hausse": None if rise is None else {"w": rise.watts, "reference": rise.reference, "depuis": rise.since.isoformat()},
            "heures_creuses": None if self.offpeak is None else [r.label() for r in self.offpeak.ranges],
            "contrat": {"option": self.contract.option, "kva": self.contract.kva, "prix": self.contract.prices,
                        "revente": self.contract.export_price,
                        # what is only supposed, not read (one Linky meter): the cards ask to confirm it in Réglages
                        "a_confirmer": hub_view.contract_supposed(self),
                        **cards.contract_month(home, self.contract, self.table, now, month)},
            "constats": [_finding(f, now) for f in [*home.findings, *self._against_reference(self.home_raw or home)]],
            "heures": {"aujourdhui": hours_today, "hier": _hours(home, local.date() - timedelta(days=1))},
            "veille_historique": nights,
            "eau": _water(home, now, self.settings.get("water_price")),
            "panneaux": panels,
            # The detail cards, one period each (maquette des cartes 2): the sun today, the devices today, the peak today.
            "soleil_jour": {"plus_fort": cards.sun_today(hours_today), "prix_evite": avoided,
                            "groupes": cards.panel_groups(channels, self.panel_names, self.tz, local.date())},
            "appareils_jour": cards.devices_today(home, today, self.device_names),
            # The hub (INTERFACE.md § 5.2): each device last month, and the last twelve months.
            "appareils_mois": hub.devices_month(home, report.month(home, self.contract, self.table, *hub.last_month(now, self.tz))),
            "douze_mois": hub.twelve_months(home, self.contract, self.table, now),
            "pointe": cards.peak_today(hours_today, kva),
            # Advice « à froid » (engine/daily.py): habits and contract, with the euros a year at stake.
            "pistes": daily.advices(home, self.contract, self.table, now, self.cold, self.weather_cold == "oui", price,
                                    report.month(home, self.contract, self.table, local.year - 1, local.month),
                                    report.projection(month, min(now, known) if known else now)),
            "a_savoir": self._know(today, yesterday, month, rise, price, self._unusual(home, local), panels),
            "mis_a_jour": now.isoformat(),
        }

    def _unusual(self, home, local: datetime):
        """Yesterday, when it was an unusual day (5.1)."""
        used = home.used_days()
        learned = heating.learn(used, self.cold) if self.weather_cold == "oui" else None
        return anomaly.check(local.date() - timedelta(days=1), used, learned, self.cold)

    def _follow_enedis(self, home):
        for kind, key in (("import", "achats"), ("export", "revente")):
            stat = self.reference.get(key)
            if stat and self.rows.get(stat):
                home = engine_home.follow(home, kind, stats.energy(stat, self.rows[stat]))
        return home

    def _against_reference(self, home) -> list:
        """The page's meters against Enedis's, which the bill follows (« fait foi »)."""
        found = []
        for what, series in (("vos achats", home.bought), ("votre revente", home.sent)):
            stat = self.reference.get("achats" if "achats" in what else "revente")
            rows = self.rows.get(stat) if stat else None
            if series is None or not rows:
                continue
            reference = stats.days(stats.energy(stat, rows), self.tz)
            found += health.against_reference(stat, what, stats.days(series, self.tz), reference)
        return found

    def _learn_runs(self) -> None:
        limits, hours = {}, {}
        for meter in self.page.devices if self.page else []:
            rows = self.rows.get(meter.power.rate) if meter.power.rate else None
            if not rows or advice.kind_of(meter.name, meter.stat) == "chauffage":   # its thermostat decides
                continue
            name = meter.name or meter.stat
            if (limit := anomaly.run_limit(rows)) is not None:
                limits[name] = limit
            hours[name] = anomaly.trailing_hours(rows)
        self.run_limits, self.run_hours = limits, hours

    def _panels(self, local: datetime) -> dict | None:
        """Each panel yesterday, those behind their usual share (5.5), the inverter silent in daylight."""
        channels = {c: self.rows[c] for c in self.extras.get("channels") or [] if self.rows.get(c)}
        if not channels:
            return None
        days = solar.channel_days(channels, self.tz)
        yesterday = local.date() - timedelta(days=1)
        name = lambda c: self.panel_names.get(c) or c  # noqa: E731
        return {"hier": [{"nom": name(c), "kwh": round(k, 2)} for c, k in sorted((days.get(yesterday) or {}).items())],
                "en_retrait": [{"nom": name(b.channel), "pourcent_de_moins": round((1 - b.ratio) * 100)}
                               for b in solar.behind(days, yesterday)],
                "onduleur_muet_min": None if self.inverter_silent is None else round(self.inverter_silent)}

    def _inverter_silent(self) -> float | None:
        """Minutes the inverter has not answered while the sun is well up (30 min at least to be said)."""
        inverter = self.extras.get("inverter")
        state = self.hass.states.get(inverter) if inverter else None
        sun = self.hass.states.get("sun.sun")
        if state is None or sun is None:
            return None
        up = sun.state == "above_horizon" and (sun.attributes.get("elevation") or 0) > 10
        minutes = solar.silent_minutes(state.state, state.last_changed, dt_util.utcnow(), up)
        return minutes if minutes is not None and minutes >= 30 else None

    def _know(self, today, yesterday, month, rise, price, unusual=None, panels=None) -> list[dict]:
        """« À savoir »: one line per rubric at most, each a sentence of PHRASES.md § 3."""
        lines = []
        if self.offpeak and self.offpeak.ranges:
            labels = [x for r in self.offpeak.ranges[:2] for x in r.label()]
            values = dict(zip(("h1", "h2", "h3", "h4"), labels))
            lines.append({"rubrique": "geste", "id": "hc_plages", "texte": phrases.know("hc_plages", values)})
        behind = (panels or {}).get("en_retrait") or []
        if panels and panels.get("onduleur_muet_min"):
            minutes = panels["onduleur_muet_min"]
            duree = f"{minutes} min" if minutes < 120 else f"{round(minutes / 60)} h"
            lines.append({"rubrique": "surveiller", "id": "onduleur_muet", "texte": phrases.know("onduleur_muet", {"duree": duree})})
        elif behind:
            lines.append({"rubrique": "surveiller", "id": "panneau_retrait", "texte": phrases.know("panneau_retrait", {
                "nom": behind[0]["nom"], "pourcent": behind[0]["pourcent_de_moins"]})})
        elif rise is not None and price is not None:
            extra = baseline.yearly_euros(rise.watts - rise.reference, price)
            lines.append({"rubrique": "surveiller", "id": "veille_hausse", "texte": phrases.know("veille_hausse", {
                "logement": "la maison", "mois": phrases.month_name(rise.since.month), "euros": phrases.euros(extra)})})
        elif unusual is not None and unusual.more:
            per_kwh = yesterday.energy_eur / yesterday.bought_kwh if yesterday.energy_eur is not None and yesterday.bought_kwh else None
            values = {"kwh": phrases.number(unusual.used_kwh, 0), "ecart": phrases.number(unusual.gap_kwh, 0)}
            if per_kwh is not None:
                values["euros"] = phrases.euros(unusual.gap_kwh * per_kwh)
            key = "jour_plus_froid" if unusual.with_cold else "jour_plus"
            lines.append({"rubrique": "surveiller", "id": key, "texte": phrases.know(key, values)})
        elif any(f.id in phrases.TO_MEND for f in self.home.findings):
            lines.append({"rubrique": "surveiller", "id": "capteur_douteux", "texte": phrases.know("capteur_douteux", {})})
        if unusual is not None and not unusual.more:
            lines.append({"rubrique": "appris", "id": "jour_moins",
                          "texte": phrases.know("jour_moins", {"ecart": phrases.number(unusual.gap_kwh, 0)})})
        elif yesterday.sun_kept is not None:
            lines.append({"rubrique": "appris", "id": "soleil_garde",
                          "texte": phrases.know("soleil_garde", {"pourcent": round(yesterday.sun_kept * 100)})})
        for line in lines:
            line["titre"] = phrases.KNOW_TITLES[line["rubrique"]]
        return lines

    def _price_of(self, period: str, at: datetime) -> float | None:
        return tariff.price_at(self.contract, self.table, at, self.tz, None if period == "base" else period)

    # --- live (every change, at most every 10 s, and every minute) ----------------------------------------------

    def _follow_live(self) -> None:
        entities = set()
        for meter in self.page.meters:
            entities |= set(meter.power.entities)
        entities |= {e for e in (self.extras.get("period"), self.extras.get("tempo_today"), self.extras.get("tempo_tomorrow"),
                                 self.extras.get("inverter")) if e}
        if self._live_unsub:
            self._live_unsub()
        self._live_unsub = async_track_state_change_event(self.hass, sorted(entities), self._state_changed) if entities else None

    @callback
    def _state_changed(self, event: Event) -> None:
        if self._live_pending is None:
            self._live_pending = async_call_later(self.hass, LIVE_MIN_S, self._live_due)

    @callback
    def _live_due(self, _now) -> None:
        self._live_pending = None
        self._update_live()

    def _reading(self, entity_id: str | None) -> live.Reading | None:
        state = self.hass.states.get(entity_id) if entity_id else None
        if state is None:
            return None
        return live.Reading(entity_id, state.state, state.attributes.get("unit_of_measurement"), state.last_changed, state.last_reported)

    def _candidate(self, meters: list[sources.Meter], name: str, sign_of) -> live.Candidate | None:
        parts = []
        for meter in meters:
            for entity, sign in sign_of(meter):
                reading = self._reading(entity)
                if reading is None:
                    return None
                parts.append((reading, sign))
        if not parts:
            return None
        readings = [self.home.readings.get(m.stat) for m in meters] if self.home else []
        local = [self.locality.get(r.entity_id) for r, _ in parts]
        return live.Candidate(name, parts, local=all(local) if all(v is not None for v in local) else None,
                              late=any(r is not None and r.lag for r in readings))

    def _inverter(self) -> live.Candidate | None:
        reading = self._reading(self.extras.get("inverter"))
        if reading is None:
            return None
        return live.Candidate("Onduleurs (OpenDTU)", [(reading, 1)], local=self.locality.get(reading.entity_id))

    @callback
    def _update_live(self) -> None:
        if not self.page or not self.data.get("pret"):
            return
        now = dt_util.utcnow()

        def imports(m):
            if m.power.rate:
                return [(m.power.rate, -1 if m.power.inverted else 1)]
            return [(m.power.rate_from, 1)] if m.power.rate_from else []

        def exports(m):
            if m.power.rate:
                return [(m.power.rate, 1 if m.power.inverted else -1)]
            return [(m.power.rate_to, 1)] if m.power.rate_to else []

        grid = self._candidate(self.page.imports, "Page Énergie", imports)
        sent = self._candidate(self.page.exports, "Page Énergie", exports)
        sun = [c for c in (self._candidate(self.page.solar, "Page Énergie", lambda m: [(m.power.rate, 1)] if m.power.rate else []),
                           self._inverter()) if c is not None]
        verdicts = {"achat": live.judge("achat", [grid] if grid else [], now),
                    "revente": live.judge("revente", [sent] if sent else [], now),
                    "soleil": live.judge("soleil", sun, now)}
        bought = _positive(verdicts["achat"].value)
        exported = _positive(verdicts["revente"].value)
        produced = _positive(verdicts["soleil"].value)
        period = self._period(now)
        change = tariff.next_change(self.offpeak, now, self.tz) if self.offpeak else None
        running = []
        for meter in self.page.devices:
            reading = self._reading(meter.power.rate)
            watts = reading.watts if reading else None
            if watts is not None and watts >= 50:
                kind = advice.kind_of(meter.name, meter.stat)
                name = meter.name or meter.stat
                # On since: its whole hours in the statistics, plus the hour under way (it runs now).
                hours = self.run_hours.get(name, 0) + now.astimezone(self.tz).minute / 60
                running.append(advice.Running(name, kind, watts, hours))
        water = self.page.water[0] if self.page.water else None
        flow_reading = self._reading(water.power.rate) if water else None
        if flow_reading is not None:
            try:
                self.flow.update(float(flow_reading.state), now)
            except ValueError:
                pass
        kva = self.contract.kva if self.contract else None
        # The household's own limit for a kind (towel rail: 24 h), else the device's learned one (5.2).
        watched = {r.name: self.settings["watched"].get(r.kind) or self.run_limits.get(r.name) for r in running
                   if self.settings["watched"].get(r.kind) or self.run_limits.get(r.name)}
        colour_now = colour_next = None
        if self.extras.get("tempo_today"):
            colour_now = reader.colour_of(getattr(self.hass.states.get(self.extras["tempo_today"]), "state", None))
        if self.extras.get("tempo_tomorrow"):
            colour_next = reader.colour_of(getattr(self.hass.states.get(self.extras["tempo_tomorrow"]), "state", None))
        situation = advice.Situation(
            now=now, tz=self.tz, period=period, next_change=change,
            offpeak_end=change[0] if change and period == "hc" else None,
            bought_w=bought, sent_w=exported, sun_w=produced, subscribed_w=kva * 1000 if kva else None, running=running,
            export_price=self.contract.export_price if self.contract else None,
            offpeak_price=self._price_of("hc", now) if self.contract and self.contract.option == tariff.HPHC else None,
            water_leak_min=self.flow.minutes(now), water_litres_per_day=self.flow.litres_per_day if self.flow.since else None,
            watched=watched)
        banner = self.steady.update(advice.choose(situation), now)
        self._alert(banner)
        price = None
        if self.contract:
            price = tariff.price_at(self.contract, self.table, now, self.tz, None if period in (None, "base") else period, colour_now)
        heat_now = heating.now(reader.thermostats(self.hass) if self.used("vt") else [])
        self.data["direct"] = {
            "achat_w": bought, "revente_w": exported, "soleil_w": produced,
            "maison_w": None if bought is None else bought + (produced or 0.0) - (exported or 0.0),
            "periode": period, "prochain_changement": None if not change else {"a": change[0].isoformat(), "periode": change[1]},
            "prix": price, "couleur": colour_now, "couleur_demain": colour_next,
            "en_marche": [{"nom": r.name, "type": r.kind, "w": round(r.watts)} for r in running],
            "fuite": {"minutes": self.flow.minutes(now), "debit": self.flow.rate},
            "chauffage": None if heat_now is None else heat_now.as_dict(price),
            "bandeau": banner, "sources": {k: _verdict(v) for k, v in verdicts.items()}, "a": now.isoformat(),
        }
        self._notify()

    def _period(self, now: datetime) -> str | None:
        """The period from the meter (TIC) first, then the learned hours (3.1 arbiter)."""
        state = self.hass.states.get(self.extras["period"]) if self.extras.get("period") else None
        if state is not None and (period := reader.period_of(state.state)):
            return period
        if self.contract and self.contract.option == tariff.BASE:
            return "base"
        if self.offpeak is not None:
            return "hc" if self.offpeak.contains(now, self.tz) else "hp"
        return None


def _merge(old: dict, fresh: dict, start: datetime) -> dict:
    return {sid: merge_rows(old.get(sid), fresh.get(sid), start) for sid in set(old) | set(fresh)}


def _number(state) -> float | None:
    try:
        return float(state.state) if state is not None else None
    except (TypeError, ValueError):
        return None


def _positive(value: float | None) -> float | None:
    return None if value is None else max(0.0, value)


def _level(level: sources.Level | None) -> dict:
    if level is None:
        return {}
    return {"facture": level.bill, "direct": level.live, "appareils": level.devices, "soleil": level.sun,
            "heure_par_heure": level.hourly, "manque": list(level.missing)}


def _plain(values: dict) -> dict:
    out = {}
    for key, value in values.items():
        if isinstance(value, (datetime, date)):
            out[key] = value.isoformat()
        elif isinstance(value, list):
            out[key] = [v.isoformat() if isinstance(v, (datetime, date)) else v for v in value]
        else:
            out[key] = value
    return out


def _finding(f, now: datetime | None = None) -> dict:
    values = _plain(f.values)
    ident = "p_capteur_fige_stats" if f.id == "p_capteur_fige" and "heures" in f.values else f.id
    shown = dict(values)
    if isinstance(f.values.get("date"), date):
        d = f.values["date"]
        shown["date"] = f"{d.day} {phrases.month_name(d.month)} {d.year}"
    for key in ("valeur", "facteur", "page", "enedis"):
        if isinstance(f.values.get(key), (int, float)):
            shown[key] = phrases.number(f.values[key], 0 if abs(f.values[key]) >= (10 if key in ("page", "enedis") else 100) else 1)
    mend = f.id in phrases.TO_MEND
    if f.id == "p_capteur_fige" and isinstance(f.values.get("debut"), datetime) and now is not None:
        # A sensor frozen long ago and moving again is history, not something to mend now.
        mend = now - f.values["debut"] < timedelta(days=7)
    return {"id": f.id, "stat": f.stat, "valeurs": values, "texte": phrases.panel(ident, shown),
            # the same, without the meter's name, in the hub's card of that source or device (H6)
            "court": phrases.short(ident, shown), "niveau": "regler" if mend else "info"}


def _hours(home, day: date) -> list[dict]:
    """Each hour of a local day: bought, sun and sent (kWh), None where unknown."""
    start, end = tariff.day_bounds(day, home.tz)
    out = [{"h": h, "achat": None, "soleil": None, "revente": None} for h in range(24)]
    for key, series in (("achat", home.bought), ("soleil", home.sun), ("revente", home.sent)):
        for hour in series.between(start, end) if series else []:
            if hour.kwh is not None:
                out[hour.start.astimezone(home.tz).hour][key] = round(hour.kwh, 3)
    return out


def _baseloads(home, day: date, days: int = 30) -> list[dict]:
    if home.bought is None:
        return []
    out = []
    for k in range(days - 1, -1, -1):
        b = baseline.baseload(home.bought, home.tz, day - timedelta(days=k))
        if b is not None:
            out.append({"jour": b.end.isoformat(), "w": b.watts})
    return out


def _water(home, now: datetime, price_m3: float | None = None) -> dict | None:
    reading = next(iter(home.of("water")), None)
    if reading is None:
        return None
    local = now.astimezone(home.tz)
    start, _ = tariff.day_bounds(local.date(), home.tz)
    month = datetime(local.year, local.month, 1, tzinfo=home.tz)
    day_l, month_l = stats.total(reading.series, start, now).kwh, stats.total(reading.series, month, now).kwh
    price = price_m3 if price_m3 is not None else reading.meter.price.number
    return {"jour_l": round(day_l), "mois_l": round(month_l), "mois_euros": None if price is None else round(month_l / 1000 * price, 2),
            "prix_m3": price, **cards.water_days(reading.series, home.tz, now, price)}


def _verdict(v: live.Verdict) -> dict:
    return {"retenu": None if v.chosen is None else v.chosen.name, "valeur": v.value,
            "ecartes": [{"source": c.name, "raison": why, "valeurs": _plain(values)} for c, why, values in v.set_aside]}


def _friendly(hass, entity_id: str) -> str:
    """An entity's own name (« Sud CH1 Power » → the name the household gave), never its id when a name exists."""
    state = hass.states.get(entity_id)
    return (state.attributes.get("friendly_name") if state else None) or entity_id.split(".", 1)[-1]


def _device_name(name: str) -> str:
    """« Salon prise TV Énergie » → « Salon prise TV »: the device, without the meter's word."""
    text = re.sub(r"[\s_-]*(énergie|energie|energy|consommation|conso|total)$", "", name.strip(), flags=re.I).replace("_", " ")
    return (text[:1].upper() + text[1:]) if text else name


def _hourly(imports, now: datetime) -> bool:
    """At least a week of whole hours among the last four weeks (HA Linky: its last seven days come by the half-hour)."""
    days = set()
    for reading in imports:
        for hour in reading.series.hours:
            if hour.hours == 1 and hour.kwh is not None and now - hour.start <= timedelta(days=28):
                days.add(hour.start.date())
    return len(days) >= 7
