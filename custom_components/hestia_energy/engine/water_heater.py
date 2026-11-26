"""The water heater driven by Hestia Energy (1.0.0b11): a heating plan for the next hours, made again every 5 minutes.

Hestia Energy commands nothing: it publishes « Chauffe-eau : chauffer » (on / off), and the household's automation
(the blueprint « Piloter le chauffe-eau avec Hestia Énergie ») switches the plug. In « Simulation », the default, the
same plan is made and shown, and the blueprint does nothing: nothing is commanded.

How it decides (docs/chauffe-eau.md, the proposal validated by Frank on 26 Nov. 2026):
1. The reserve of hot water, in kWh: full when the heater stops by itself (its plug on, 0 W), then less what the
   household draws (learned from the heater's energy of each day, spread over the hot-water hours) and the tank's
   losses; with a temperature probe, read from it.
2. The price of each quarter hour up to tomorrow evening: in the sun to spare, a kWh costs the resale lost; the rest the
   contract's price at that time (peak / off-peak, the Tempo colour). Above the breaker, forbidden.
3. Prudence with the sun: the sun forecast counts for less the further away it is (70 % the evening before).
4. The plan: the cheapest quarter hours that keep the reserve above its minimum at every moment, in runs of at least
   30 minutes, with few starts a day. The sun nearly free is taken while the tank is not full.
5. Hot water first: when nothing cheaper is left before the reserve runs short, the heater heats now, whatever the price.

Plain Python: no Home Assistant here. The coordinator gives the slots (prices, sun, house), the reserve and the settings.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, tzinfo
import math
import statistics

SLOT = timedelta(minutes=15)
SLOT_H = 0.25
HORIZON = timedelta(hours=36)
# The modes of the select « Chauffe-eau : mode ». Simulation first: nothing is commanded until the household says so.
SIMULATION, AUTO, OFFPEAK, AWAY = "simulation", "automatique", "heures_creuses", "vacances"
MODES = (SIMULATION, AUTO, OFFPEAK, AWAY)
# The settings of the water heater, with their defaults (a setting, never a constant, when it depends on the home).
DEFAULTS = {"mode": SIMULATION, "appareil": None, "prise": None, "sonde": None, "litres": None, "puissance_w": None,
            "heures": ["07:00", "20:00"], "reserve_min": 0.3, "demarrages": 4, "consigne": 60}
KWH_PER_LITRE_K = 4.186 / 3600     # heating one litre by one degree
COLD_WATER = 15                    # °C of the water coming in
LOSS_SHARE = 0.25                  # of the day's need, the tank's losses, spread over the whole day
DRAW_HOURS = 1.0                   # each hot-water time draws over this long
HYGIENE_DAYS = 7                   # a full heating at least once a week (the tank's thermostat cut reached)
LEARN_DAYS = 28
MIN_DAYS = 7
MIN_ON_KW = 0.3                    # the heater heats above this


def _prudence(lead: timedelta) -> float:
    """How much of the forecast sun counts: all of it measured now, less the further away (Frank, 26 Nov. 2026)."""
    hours = lead.total_seconds() / 3600
    return 1.0 if hours < 0.25 else 0.9 if hours < 3 else 0.8 if hours < 12 else 0.7


# --- what is learned (every hour, in a worker thread) -----------------------------------------------------------

@dataclass(frozen=True)
class Learned:
    power_kw: float | None             # its power when it heats
    need_week_kwh: float | None        # its energy a weekday (draws and losses), the median of the last 4 weeks
    need_weekend_kwh: float | None
    days: int                          # days the need was learned on
    base_kw: tuple[float, ...] = ()    # the rest of the home, each local hour (0 to 23), kW
    clear_kw: tuple[float, ...] = ()   # the panels by clear sky, each local hour (the best of the last 30 days), kW
    usual_kw: tuple[float, ...] = ()   # the panels on a usual day, each local hour (the median of the last 14 days), kW

    def need(self, day: date) -> float | None:
        weekend = day.weekday() >= 5
        found = self.need_weekend_kwh if weekend else self.need_week_kwh
        return found if found is not None else self.need_week_kwh if weekend else self.need_weekend_kwh

    def as_dict(self) -> dict:
        return {"puissance_kw": _round(self.power_kw, 2), "besoin_semaine_kwh": _round(self.need_week_kwh, 1),
                "besoin_week_end_kwh": _round(self.need_weekend_kwh, 1), "jours": self.days}


def _round(value: float | None, n: int = 2) -> float | None:
    return None if value is None else round(value, n)


def learn(heater: list[tuple[datetime, float]], home: list[tuple[datetime, float]], sun: list[tuple[datetime, float]],
          tz: tzinfo, now: datetime) -> Learned:
    """From the hours of the last weeks ((start, kWh), each hour once): the heater's power and need, the rest of the
    home by hour, the panels by clear sky. `home`: the whole home's use (bought + sun − sent), heater included."""
    today = now.astimezone(tz).date()
    since = now - timedelta(days=LEARN_DAYS + 1)
    days: dict[date, float] = {}
    hours: dict[date, int] = {}
    strong = []
    for start, kwh in heater:
        if start < since:
            continue
        day = start.astimezone(tz).date()
        if day >= today:
            continue
        days[day] = days.get(day, 0.0) + max(0.0, kwh)
        hours[day] = hours.get(day, 0) + 1
        if kwh >= MIN_ON_KW:
            strong.append(kwh)
    whole = {d: v for d, v in days.items() if hours[d] >= 23}
    week = [v for d, v in whole.items() if d.weekday() < 5 and v >= 0.2]
    weekend = [v for d, v in whole.items() if d.weekday() >= 5 and v >= 0.2]
    # A whole hour of heating is its power; the hours it stops in the middle are smaller: the strongest tenth.
    power = None
    if len(strong) >= 5:
        strong.sort()
        power = statistics.median(strong[int(len(strong) * 0.8):])
    used = len(week) + len(weekend)
    need_week = statistics.median(week) if len(week) >= 3 else None
    need_weekend = statistics.median(weekend) if len(weekend) >= 2 else None
    if used < MIN_DAYS:
        need_week = need_weekend = None
    by_hour = _rest_of_home(heater, home, tz, now - timedelta(days=14))
    clear = _clear_sky(sun, tz, now - timedelta(days=30))
    usual = _usual_sky(sun, tz, now - timedelta(days=14)) if clear else ()
    return Learned(power, need_week, need_weekend, used, by_hour, clear, usual)


def _rest_of_home(heater, home, tz, since) -> tuple[float, ...]:
    """The rest of the home each local hour: the median of the last two weeks, the heater taken out."""
    own = {start: kwh for start, kwh in heater}
    found: dict[int, list[float]] = {}
    for start, kwh in home:
        if start < since:
            continue
        rest = max(0.0, kwh - max(0.0, own.get(start, 0.0)))
        found.setdefault(start.astimezone(tz).hour, []).append(rest)
    if len(found) < 24:
        return ()
    return tuple(round(statistics.median(found[h]), 3) for h in range(24))


def _clear_sky(sun, tz, since) -> tuple[float, ...]:
    """The panels' production by clear sky each local hour: the second best of the last 30 days (one odd hour aside)."""
    found: dict[int, list[float]] = {}
    for start, kwh in sun:
        if start < since:
            continue
        found.setdefault(start.astimezone(tz).hour, []).append(max(0.0, kwh))
    if not found or max((max(v) for v in found.values()), default=0) <= 0.05:
        return ()
    out = []
    for h in range(24):
        values = sorted(found.get(h, []), reverse=True)
        out.append(round(values[1] if len(values) > 1 else values[0] if values else 0.0, 3))
    return tuple(out)


def _usual_sky(sun, tz, since) -> tuple[float, ...]:
    """The panels on a usual day of the last two weeks, each local hour: the forecast when there is no other."""
    found: dict[int, list[float]] = {}
    for start, kwh in sun:
        if start >= since:
            found.setdefault(start.astimezone(tz).hour, []).append(max(0.0, kwh))
    return tuple(round(statistics.median(found[h]), 3) if found.get(h) else 0.0 for h in range(24))


def sun_from_clouds(clear_kw: tuple[float, ...], cover: float | None, condition: str | None, local_hour: int) -> float | None:
    """The panels' production expected from the clouds (Hestia Weather's hourly forecast), kW: the clear-sky production
    of that hour lessened by the cover (Kasten and Czeplak), None when neither cover nor sky is known."""
    if not clear_kw:
        return None
    if cover is None:
        cover = {"sunny": 5, "clear-night": 5, "partlycloudy": 50, "cloudy": 90, "fog": 95, "rainy": 95, "pouring": 100,
                 "lightning": 95, "lightning-rainy": 100, "snowy": 100, "snowy-rainy": 100, "hail": 100,
                 "windy": 30, "windy-variant": 60, "exceptional": 90}.get(condition or "")
    if cover is None:
        return None
    share = max(0.0, min(1.0, cover / 100))
    return clear_kw[local_hour] * (1 - 0.75 * share ** 3.4)


def capacity_kwh(litres: float | None, setpoint: float, learned: Learned | None) -> float:
    """What the full tank holds above the cold water, kWh: from its litres, else from the need (a tank holds about a
    day and a half of it), at least 3 kWh."""
    if litres:
        return litres * (setpoint - COLD_WATER) * KWH_PER_LITRE_K
    need = learned.need_week_kwh if learned else None
    return max(3.0, (need or 6.0) * 1.5)


def reserve_from_temperature(temp: float | None, setpoint: float, capacity: float) -> float | None:
    if temp is None or setpoint <= COLD_WATER:
        return None
    return max(0.0, min(capacity, capacity * (temp - COLD_WATER) / (setpoint - COLD_WATER)))


def parse_hours(values) -> list[int]:
    """The hot-water times (« 07:00 ») in minutes after midnight, in order; wrong ones left out."""
    out = []
    for text in values or []:
        try:
            h, m = str(text).replace("h", ":").split(":")
            minute = int(h) * 60 + int(m or 0)
        except ValueError:
            continue
        if 0 <= minute < 1440:
            out.append(minute)
    return sorted(set(out))


def draw_kw(local: datetime, need_kwh: float, times: list[int]) -> float:
    """What the household draws at that instant (kW): the losses all day long, and the rest over an hour after each
    hot-water time, shared out equally."""
    losses = need_kwh * LOSS_SHARE / 24
    if not times:
        return need_kwh / 24
    minute = local.hour * 60 + local.minute
    drawing = any(0 <= (minute - t) % 1440 < DRAW_HOURS * 60 for t in times)
    return losses + (need_kwh * (1 - LOSS_SHARE) / len(times) / DRAW_HOURS if drawing else 0.0)


# --- the reserve, followed minute by minute ---------------------------------------------------------------------

@dataclass
class Tank:
    """The reserve of hot water as Hestia follows it (kWh above the cold water)."""
    kwh: float | None = None
    at: datetime | None = None
    full_at: datetime | None = None     # the last time it was seen full (hygiene: once a week)
    heated_since: datetime | None = None  # heating without a stop since then (the cut of its thermostat seen after)

    def follow(self, now: datetime, tz: tzinfo, heated_kw: float, need_kwh: float, times: list[int], capacity: float,
               seen_full: bool = False) -> None:
        """Moves the reserve on to `now`: plus what was heated, less what was drawn. `seen_full`: the heater stopped by
        itself while allowed to heat, or its probe says so: full."""
        if self.kwh is None or self.at is None:
            # Not known yet: a tank is usually full after its night, and the first heating seen corrects it.
            self.kwh, self.at = capacity * 0.9, now
        hours = max(0.0, min(2.0, (now - self.at).total_seconds() / 3600))
        drawn = draw_kw(now.astimezone(tz), need_kwh, times) * hours
        self.kwh = max(0.0, min(capacity, self.kwh + heated_kw * hours - drawn))
        self.at = now
        if seen_full or self.kwh >= capacity - 1e-6:
            self.kwh = capacity
            self.full_at = now

    def as_dict(self) -> dict:
        return {"kwh": self.kwh, "a": self.at.isoformat() if self.at else None,
                "plein_le": self.full_at.isoformat() if self.full_at else None}

    @classmethod
    def from_dict(cls, data: dict | None) -> "Tank":
        data = data or {}

        def moment(key):
            try:
                return datetime.fromisoformat(data[key]) if data.get(key) else None
            except (TypeError, ValueError):
                return None
        kwh = data.get("kwh")
        return cls(kwh if isinstance(kwh, (int, float)) else None, moment("a"), moment("plein_le"))


# --- the plan ---------------------------------------------------------------------------------------------------

@dataclass(frozen=True)
class Slot:
    start: datetime
    price: float | None        # a kWh from the grid at that time, € (None: not known)
    sun_kw: float              # the sun to spare expected for the heater, prudence counted, kW
    base_kw: float             # the rest of the home, kW
    draw_kwh: float            # what the household draws during the slot
    offpeak: bool = False
    sun_forecast_kw: float = 0.0   # the sun to spare forecast, before prudence (for the card)


@dataclass(frozen=True)
class Settings:
    capacity: float
    power_kw: float
    min_kwh: float
    export_price: float | None
    limit_kw: float | None = None   # the breaker less its margin
    max_starts: int = 4
    hygiene_due: bool = False


@dataclass
class Plan:
    slots: list[Slot]
    on: list[bool]
    reserve: list[float]               # at the end of each slot, kWh
    energy: list[float]                # heated in each slot, kWh
    source: list[str | None]           # « soleil », « heures_creuses », « heures_pleines », « base »
    cost: list[float]
    short_at: datetime | None = None   # the reserve still runs short then: nothing could prevent it
    urgent: bool = False               # heating now is the only way to keep hot water (« eau chaude d'abord »)
    hygiene: bool = False

    @property
    def kwh(self) -> float:
        return sum(self.energy)

    @property
    def euros(self) -> float:
        return sum(self.cost)

    def runs(self) -> list[dict]:
        """The heatings planned, one per run of quarter hours of one source."""
        out: list[dict] = []
        for i, slot in enumerate(self.slots):
            if not self.on[i]:
                continue
            end = slot.start + SLOT
            last = out[-1] if out else None
            if last and last["_end"] == slot.start and last["source"] == self.source[i]:
                last["_end"] = end
                last["kwh"] += self.energy[i]
                last["euros"] += self.cost[i]
            else:
                out.append({"debut": slot.start, "_end": end, "source": self.source[i], "kwh": self.energy[i], "euros": self.cost[i]})
        return [{"debut": r["debut"].isoformat(), "fin": r["_end"].isoformat(), "source": r["source"],
                 "kwh": round(r["kwh"], 2), "euros": round(r["euros"], 3)} for r in out]


def _grid_price(slot: Slot, fallback: float) -> float:
    return slot.price if slot.price is not None else fallback


def _slot_cost(slot: Slot, s: Settings, energy: float, fallback: float) -> tuple[float, str]:
    """The euros of `energy` heated in that slot, and where it comes from."""
    sun = min(energy, min(s.power_kw, max(0.0, slot.sun_kw)) * SLOT_H)
    resale = s.export_price if s.export_price is not None else 0.0
    grid = _grid_price(slot, fallback)
    euros = sun * resale + (energy - sun) * grid
    if energy > 0 and sun >= energy / 2:
        source = "soleil"
    elif energy > 0 and sun >= energy / 5:
        source = "soleil_partiel"
    else:
        source = "heures_creuses" if slot.offpeak else "heures_pleines"
    return euros, source


def _simulate(slots: list[Slot], start_kwh: float, s: Settings, chosen: list[bool]) -> tuple[list[float], list[float]]:
    """The reserve at the end of each slot and the energy heated, with the tank's limit (its thermostat cuts when full).
    The reserve may go below zero here: a shortage, which the plan is made to avoid."""
    reserve, energy = [], []
    kwh = start_kwh
    full = s.power_kw * SLOT_H
    for slot, on in zip(slots, chosen):
        heat = min(full, max(0.0, s.capacity - kwh)) if on else 0.0
        kwh = kwh + heat - slot.draw_kwh
        energy.append(heat)
        reserve.append(kwh)
    return reserve, energy


def make_plan(slots: list[Slot], start_kwh: float, s: Settings, keep_on: bool = False) -> Plan:
    """The cheapest heatings that keep the reserve above its minimum (see the module's doc)."""
    n = len(slots)
    chosen = [False] * n
    full = s.power_kw * SLOT_H
    known = [x.price for x in slots if x.price is not None]
    fallback = max(known) if known else 0.25
    allowed = [s.limit_kw is None or x.base_kw + s.power_kw <= s.limit_kw for x in slots]
    unit = []      # € a kWh in each slot, heating the whole quarter hour
    for slot in slots:
        euros, _ = _slot_cost(slot, s, full, fallback)
        unit.append(euros / full if full > 0 else math.inf)
    if n == 0 or full <= 0:
        return Plan(slots, chosen, [], [], [], [])

    # The sun nearly free, while the tank is not full (« il en profite »): at most a third of the grid's cheapest price.
    cheapest_grid = min((_grid_price(x, fallback) for x in slots), default=fallback)
    for i in sorted(range(n), key=lambda k: unit[k]):
        if unit[i] > cheapest_grid / 3 or slots[i].sun_kw < MIN_ON_KW or not allowed[i]:
            continue
        chosen[i] = True
    reserve, energy = _simulate(slots, start_kwh, s, chosen)
    # Sun slots that heated nothing (the tank already full then) are let go.
    chosen = [c and e > 0.01 for c, e in zip(chosen, energy)]

    # The reserve kept above its minimum: at each first moment it runs short, the cheapest quarter hour before it.
    short_at = None
    for _ in range(4 * n):
        reserve, energy = _simulate(slots, start_kwh, s, chosen)
        low = next((i for i, r in enumerate(reserve) if r < s.min_kwh - 1e-6), None)
        if low is None:
            break
        best, best_value = None, math.inf
        # Going back from the shortage: heating in slot j raises the reserve at the shortage by what fits in the tank
        # then, less what a later heating already planned can no longer add (its thermostat cuts when full).
        room = math.inf     # the least room left after a heating already planned, between j and the shortage
        for j in range(low, -1, -1):
            if j < low and chosen[j + 1]:
                room = min(room, s.capacity - reserve[j + 1])
            if chosen[j]:
                continue
            before = reserve[j - 1] if j > 0 else start_kwh
            heat = min(full, max(0.0, s.capacity - before))
            gain = min(heat, room)
            if gain <= 0.01:
                continue
            # € for each kWh that reaches the shortage (what the tank cannot keep is paid for nothing).
            value = (unit[j] if allowed[j] else unit[j] + 1.0) * heat / gain
            # Equal prices: next to a heating already planned (one run, not three); then, at night, the latest (the
            # water waits less in the tank), by day the earliest (hot water sooner rather than at the last minute).
            beside = (j > 0 and chosen[j - 1]) or (j + 1 < n and chosen[j + 1])
            value += (0.0 if beside else 1e-4) + (-j if slots[j].offpeak else j) * 1e-7
            if value < best_value - 1e-9:
                best, best_value = j, value
        if best is None:
            short_at = slots[low].start
            break
        chosen[best] = True

    # Hygiene: once a week, a heating up to the tank's cut, on the cheapest quarter hours.
    hygiene = False
    if s.hygiene_due:
        for _ in range(n):
            reserve, energy = _simulate(slots, start_kwh, s, chosen)
            if max(reserve, default=0) >= s.capacity - 0.05:
                hygiene = True
                break
            order = sorted((j for j in range(n) if not chosen[j] and allowed[j]), key=lambda k: unit[k])
            if not order:
                break
            chosen[order[0]] = True

    # A quarter hour that heats (nearly) nothing, the tank full by then, is no heating: only its losses topped up.
    for _ in range(3):
        _, energy = _simulate(slots, start_kwh, s, chosen)
        idle = [i for i in range(n) if chosen[i] and energy[i] <= 0.15 * full]
        if not idle:
            break
        for i in idle:
            chosen[i] = False
    chosen = _runs_of_two(slots, start_kwh, s, chosen, unit)
    chosen = _few_starts(slots, start_kwh, s, chosen, unit)
    if keep_on and n and not chosen[0] and allowed[0]:
        # Just switched on: a few minutes more rather than a flicker of the plug (the coordinator decides when).
        chosen[0] = True
    reserve, energy = _simulate(slots, start_kwh, s, chosen)
    costs, sources = [], []
    for slot, e, on in zip(slots, energy, chosen):
        euros, source = _slot_cost(slot, s, e, fallback)
        costs.append(euros if on else 0.0)
        sources.append(source if on else None)
    if short_at is None:
        low = next((i for i, r in enumerate(reserve) if r < s.min_kwh - 1e-6), None)
        short_at = slots[low].start if low is not None and reserve[low] < 0 else None
    # The plan only takes the peak price when nothing cheaper is left before the reserve runs short: hot water first.
    urgent = bool(chosen and chosen[0] and sources[0] == "heures_pleines")
    return Plan(slots, chosen, reserve, energy, sources, costs, short_at, urgent, hygiene)


def _runs_of_two(slots, start_kwh, s, chosen, unit) -> list[bool]:
    """At least 30 minutes each time: a lone quarter hour takes its cheaper neighbour."""
    chosen = list(chosen)
    n = len(chosen)
    for i in range(n):
        if not chosen[i] or (i > 0 and chosen[i - 1]) or (i + 1 < n and chosen[i + 1]):
            continue
        neighbours = [j for j in (i - 1, i + 1) if 0 <= j < n]
        if neighbours:
            chosen[min(neighbours, key=lambda k: unit[k])] = True
    return chosen


def _few_starts(slots, start_kwh, s, chosen, unit) -> list[bool]:
    """At most `max_starts` heatings a day: the shortest gaps between two of them filled, the cheapest first."""
    chosen = list(chosen)
    n = len(chosen)
    if s.max_starts <= 0:
        return chosen
    for _ in range(n):
        starts: dict[date, list[int]] = {}
        for i in range(n):
            if chosen[i] and (i == 0 or not chosen[i - 1]):
                starts.setdefault(slots[i].start.date(), []).append(i)
        crowded = [d for d, found in starts.items() if len(found) > s.max_starts]
        if not crowded:
            break
        day = crowded[0]
        gaps = []
        for i in starts[day][1:]:
            j = i - 1
            while j >= 0 and not chosen[j]:
                j -= 1
            gap = list(range(j + 1, i))
            if gap:
                gaps.append((sum(unit[k] for k in gap), gap))
        if not gaps:
            break
        for k in min(gaps)[1]:
            chosen[k] = True
    return chosen


# --- what the card and the entities say -------------------------------------------------------------------------

def clock(at: datetime, tz: tzinfo) -> str:
    local = at.astimezone(tz)
    return f"{local.hour} h {local.minute:02d}" if local.minute else f"{local.hour} h"


SOURCE_WORDS = {"soleil": "au soleil", "soleil_partiel": "en partie au soleil", "heures_creuses": "en heures creuses",
                "heures_pleines": "en heures pleines", "base": "au prix de base"}


def _run_words(r: dict, now: datetime, tz: tzinfo, with_source: bool = True) -> str:
    start, end = datetime.fromisoformat(r["debut"]), datetime.fromisoformat(r["fin"])
    local = start.astimezone(tz)
    today = now.astimezone(tz).date()
    day = "" if local.date() == today or (local.date() == today + timedelta(days=1) and local.hour < 6) else \
        "demain " if local.date() == today + timedelta(days=1) else f"le {local.day} "
    text = f"{day}de {clock(start, tz)} à {clock(end, tz)}"
    return f"{text} {SOURCE_WORDS.get(r['source'], '')}".strip() if with_source else text


def say(plan: Plan, now: datetime, tz: tzinfo, full: bool, panels: bool, clouds: bool = False,
        mode: str = SIMULATION, blocked: str | None = None) -> str:
    """The card's sentence: what it does now and why, then what comes next (at most two heatings)."""
    runs = plan.runs()
    if blocked == "delestage":
        return "La maison approche du disjoncteur : le chauffe-eau attend un peu."
    if mode == AWAY and not runs:
        return "Vacances : le chauffe-eau ne chauffe que pour l'hygiène, une fois par semaine."
    now_on = bool(plan.on and plan.on[0])
    parts = []
    if clouds and not now_on:
        parts.append("Les nuages sont arrivés : la chauffe au soleil s'arrête.")
    if now_on and runs:
        first = runs.pop(0)
        end = clock(datetime.fromisoformat(first["fin"]), tz)
        if plan.urgent:
            parts.append(f"Chauffe maintenant en heures pleines, jusqu'à {end} : sinon l'eau chaude manquerait avant une heure moins chère.")
        elif plan.hygiene and first["source"] not in ("soleil", "soleil_partiel"):
            parts.append(f"Chauffe complète de la semaine, {SOURCE_WORDS[first['source']]}, jusqu'à {end}.")
        else:
            parts.append(f"Chauffe {SOURCE_WORDS[first['source']]} jusqu'à {end}.")
    elif full:
        parts.append("Le ballon est plein.")
    if not runs:
        if not parts:
            parts.append("La réserve suffit : pas de chauffe prévue d'ici demain soir.")
        return " ".join(parts)
    sunny = [r for r in runs if r["source"] == "soleil"]
    night = runs[0] if runs[0]["source"] == "heures_creuses" else None
    if not now_on and night and sunny and sunny[0]["debut"] > night["debut"]:
        parts.append(f"Du soleil est prévu : d'abord juste assez en heures creuses ({_run_words(night, now, tz, False)}), "
                     f"puis le soleil fera le reste ({_run_words(sunny[0], now, tz, False)}).")
    else:
        lead = "Peu de soleil prévu. " if panels and not sunny and not parts else ""
        following = [_run_words(r, now, tz) for r in runs[:2]]
        label = "Ensuite" if now_on else "Prochaines chauffes" if len(following) > 1 else "Prochaine chauffe"
        parts.append(f"{lead}{label} : {following[0]}" + (f", puis {following[1]}." if len(following) > 1 else "."))
    return " ".join(parts)


def build_slots(now: datetime, tz: tzinfo, price_at, offpeak_at, sun_at, learned: Learned, need_at, times: list[int],
                live_spare_kw: float | None = None, sun_ratio: float | None = None, horizon: timedelta = HORIZON) -> list[Slot]:
    """The quarter hours from now to the horizon. `price_at(at)`, `offpeak_at(at)`: the contract; `sun_at(at)`: the
    panels' production forecast (kW, None: no forecast); `need_at(day)`: the day's need (kWh); `live_spare_kw`: the sun
    to spare measured now (what is sent to the grid, plus what the heater takes of it); `sun_ratio`: the sun measured
    against the forecast this last half hour, applied to the next hours and fading over three hours (the clouds come)."""
    start = now.replace(second=0, microsecond=0)
    start -= timedelta(minutes=start.minute % 15)
    out = []
    at = start
    while at < now + horizon:
        local = at.astimezone(tz)
        middle = at + SLOT / 2
        produced = sun_at(middle)
        lead = at - start
        if produced is not None and sun_ratio is not None:
            fade = max(0.0, 1 - lead.total_seconds() / 10800)
            produced *= sun_ratio * fade + (1 - fade)
        base = learned.base_kw[local.hour] if learned.base_kw else 0.4
        forecast = max(0.0, (produced or 0.0) - base)
        spare = forecast * _prudence(lead)
        if at == start and live_spare_kw is not None:
            spare = max(0.0, live_spare_kw)
        need = need_at(local.date()) or 0.0
        drawn = sum(draw_kw(local + timedelta(minutes=m), need, times) for m in (0, 5, 10)) / 3 * SLOT_H
        out.append(Slot(at, price_at(middle), spare, base, drawn, bool(offpeak_at(middle)), forecast))
        at += SLOT
    return out
