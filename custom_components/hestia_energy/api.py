"""What Hestia Energy publishes for the other bricks: `hass.data["hestia_energy_api"]`, version 1 (INTERFACE.md § 1.1).

One rule: within version 1, methods are added, never renamed or removed. Every method gives None (or an empty list)
when the data is missing: never an invented value. Euros TTC, kWh, W, aware datetimes.
"""
from __future__ import annotations

from datetime import date, datetime, timedelta

from homeassistant.util import dt as dt_util

from .const import API_VERSION
from .engine import report, tariff

SURPLUS_NOW_W = 300


class HestiaEnergyApi:
    version = API_VERSION

    def __init__(self, hass) -> None:
        self.hass = hass
        self.coordinator = None
        self.readers: dict[str, int] = {}
        self._listeners: list = []

    def attach(self, coordinator) -> None:
        self.coordinator = coordinator
        coordinator.add_listener(self._changed)

    def detach(self, coordinator) -> None:
        """The home unloaded: the other bricks get nothing rather than the figures of a brick that no longer runs."""
        if self.coordinator is coordinator:
            self.coordinator = None
            self._changed()

    def _changed(self) -> None:
        for update in list(self._listeners):
            update()

    def add_listener(self, update, brick: str | None = None):
        """Called when what this interface gives changes; `brick` names the reader, shown on both sides."""
        self._listeners.append(update)
        if brick:
            self.readers[brick] = self.readers.get(brick, 0) + 1

        def remove():
            if update in self._listeners:
                self._listeners.remove(update)
            if brick and self.readers.get(brick):
                self.readers[brick] -= 1
        return remove

    @property
    def _ready(self) -> bool:
        # Hestia Confort switched off in the hub (H8): the prices are no longer given, nothing is uninstalled.
        return self.coordinator is not None and self.coordinator.contract is not None and self.coordinator.used("confort")

    def _live(self) -> dict:
        return (self.coordinator.data.get("direct") or {}) if self.coordinator else {}

    def _period_at(self, at: datetime) -> str | None:
        c = self.coordinator
        if abs((at - dt_util.utcnow()).total_seconds()) < 60:
            return c._period(at)
        if c.contract.option == tariff.BASE:
            return "base"
        if c.offpeak is None:
            return None
        return "hc" if c.offpeak.contains(at, c.tz) else "hp"

    # --- the methods of version 1 -------------------------------------------------------------------------------

    def now(self) -> dict | None:
        live = self._live()
        if not live:
            return None
        used, sun, sent = live.get("maison_w"), live.get("soleil_w"), live.get("revente_w")
        share = None if not used or sun is None else max(0.0, min(1.0, (sun - (sent or 0)) / used))
        return {"production_w": sun, "consumption_w": used, "grid_w": live.get("achat_w"), "export_w": sent,
                "sun_share": share, "price": live.get("prix"), "period": live.get("periode"), "color": live.get("couleur"),
                "sources": {k: v.get("retenu") for k, v in (live.get("sources") or {}).items()}}

    def tariff(self, at: datetime | None = None) -> dict | None:
        if not self._ready:
            return None
        c = self.coordinator
        at = at or dt_util.utcnow()
        period = self._period_at(at)
        colour = self._live().get("couleur")
        price = tariff.price_at(c.contract, c.table, at, c.tz, None if period in (None, "base") else period, colour)
        change = tariff.next_change(c.offpeak, at, c.tz) if c.offpeak else None
        return {"price": price, "period": period, "color": colour,
                "next_change": change[0] if change else None, "next_period": change[1] if change else None}

    def cost(self, kwh: float, at: datetime | None = None) -> float | None:
        """€ of an energy used at that instant; covered by the sun in excess right now, it is worth the lost resale."""
        if not self._ready:
            return None
        at = at or dt_util.utcnow()
        if abs((at - dt_util.utcnow()).total_seconds()) < 900 and (self._live().get("revente_w") or 0) >= SURPLUS_NOW_W:
            resale = self.coordinator.contract.export_price
            return None if resale is None else kwh * resale
        price = (self.tariff(at) or {}).get("price")
        return None if price is None else kwh * price

    def cost_profile(self, power_w: float, start: datetime, minutes: float) -> float | None:
        """€ of a power held from `start` for `minutes`, hour by hour at each hour's price."""
        total, cursor, end = 0.0, start, start + timedelta(minutes=minutes)
        while cursor < end:
            following = min(end, (cursor + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0))
            euros = self.cost(power_w / 1000 * (following - cursor).total_seconds() / 3600, cursor)
            if euros is None:
                return None
            total += euros
            cursor = following
        return total

    def surplus(self, hours: int = 24) -> list[dict]:
        """The sun in excess: measured now (the forecast comes with level 3 in the second preview)."""
        live = self._live()
        if live.get("revente_w") is None:
            return []
        return [{"start": dt_util.utcnow(), "w": live["revente_w"], "confidence": "mesure"}]

    def best_window(self, kwh: float, minutes: float, before: datetime) -> dict | None:
        """The cheapest start before `before`, by quarter hours: {start, cost, reason}."""
        if not self._ready or minutes <= 0:
            return None
        now = dt_util.utcnow().replace(second=0, microsecond=0)
        power = kwh * 60 / minutes * 1000
        best, start = None, now
        while start + timedelta(minutes=minutes) <= before:
            euros = self.cost_profile(power, start, minutes)
            if euros is not None and (best is None or euros < best[1] - 1e-9):
                best = (start, euros)
            start += timedelta(minutes=15)
        if best is None:
            return None
        period = self._period_at(best[0])
        sunny = best[0] == now and (self._live().get("revente_w") or 0) >= SURPLUS_NOW_W
        return {"start": best[0], "cost": best[1], "reason": "soleil" if sunny else "heures_creuses" if period == "hc" else "prix"}

    def heat_price(self) -> list[dict]:
        """The heat sources from the cheapest (lot 9.8): with the first stable version."""
        return []

    def day(self, when: date | None = None) -> dict | None:
        if not self._ready or self.coordinator.home is None:
            return None
        c = self.coordinator
        p = report.day(c.home, c.contract, c.table, when or dt_util.now().date())
        return {"kwh": p.used_kwh, "cost": p.eur, "sun_share": p.sun_cover, "export_kwh": p.sent_kwh,
                "export_eur": p.sent_eur, "by_use": None}

    def room_heating(self, area_id: str, start: datetime, end: datetime) -> dict | None:
        """The heating of one room (Confort's Bilan): with the link to Hestia Comfort, after the first preview."""
        return None

    def water_heater(self) -> dict | None:
        """The water heater driven by Hestia (1.0.1b1): whether it heats now and why, its reserve (%), the next heating,
        the plan ({debut, fin, source, kwh, euros}), the mode (« simulation »: nothing is commanded). None without one."""
        if not self.coordinator:
            return None
        found = self.coordinator.data.get("chauffe_eau")
        if not found:
            return None
        return {"heating": found.get("chauffer"), "reason": found.get("raison"), "reserve": found.get("reserve"),
                "next": found.get("prochaine_chauffe"), "until": found.get("jusqu_a"), "plan": list(found.get("plan") or []),
                "mode": found.get("mode"), "simulation": found.get("simulation")}

    def days(self, start: date, end: date) -> list[dict]:
        """Each whole day's energy from `start` to `end` (both included, at most 400 days), for Hestia Heating to find
        the heating's share against the cold (1.0.1b7; Frank, 27 Nov. 2026: what concerns the heating is Hestia
        Heating's). Each: `day` (a date), `electricity_kwh` (the home's consumption) and `electricity_complete`;
        `gas_kwh`, `gas_quantity` (in `gas_unit`: « kWh » or « m³ ») and `gas_complete` when the home has gas.
        Quantities only, no use guessed: the heating, the cooking and the hot water are together. Empty without data."""
        if not self.coordinator or start > end or (end - start).days > 400:
            return []
        c = self.coordinator
        found = c.energy_days
        unit = ((c.data or {}).get("gaz") or {}).get("unite")
        out = []
        for day in sorted(d for d in found if start <= d <= end):
            entry = {"day": day, **found[day]}
            if "gas_kwh" in entry:
                entry["gas_unit"] = unit
            out.append(entry)
        return out

    def gas_price(self) -> float | None:
        """The price of a kWh of gas, taxes included, in euros (1.0.1b7): the household's from Réglages, else the
        Energy page's (a price per m³ divided by the kWh in a m³). None without gas or without a price: never free."""
        if not self.coordinator:
            return None
        found = (self.coordinator.data or {}).get("gaz") or {}
        price = found.get("prix")
        if price is None:
            return None
        return round(price / (found.get("kwh_par_m3") or 1.0), 5)

    def limits(self) -> dict | None:
        if not self.coordinator:
            return None
        data = self.coordinator.data
        kva = (data.get("contrat") or {}).get("kva")
        max_w = None if not kva else kva * 1000 * (1 - data.get("marge", 0.1))
        return {"power_w": self._live().get("achat_w"), "max_w": max_w, "max_red_w": None}
