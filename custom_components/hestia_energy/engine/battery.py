"""The home battery, live (1.0.1b3, retour HACF du 26 nov. 2026): what it gives or takes now, its charge, and how long it
lasts at this pace.

Pure Python. The coordinator reads the power (the Energy page's own battery power, HA's convention: positive when the
battery discharges into the home, negative when it charges), the state of charge (a « battery » sensor in %, found on the
battery's device or chosen in the settings) and the battery's two meters (kWh charged, kWh given back). Its capacity is
the household's setting, else learned here: the kWh that went in (or out) over a swing of at least 15 points of charge.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta

SWING = 15.0          # points of charge before a capacity is learned
SWING_HOURS = 12      # a swing slower than this mixes too much (losses, standby): started again
KEEP = 5              # the last capacities learned, their median used
LOW = 10.0            # the charge most batteries keep for themselves: never counted as usable
ACTIVE_W = 30.0       # below this, the battery rests


@dataclass
class Swing:
    at: datetime
    soc: float
    charged: float
    given: float


@dataclass
class Battery:
    learned: list[float] = field(default_factory=list)
    _from: Swing | None = None

    def capacity(self, setting: float | None) -> float | None:
        if setting:
            return float(setting)
        if not self.learned:
            return None
        ordered = sorted(self.learned)
        return round(ordered[len(ordered) // 2], 1)

    def learn(self, now: datetime, soc: float | None, charged: float | None, given: float | None) -> bool:
        """One more reading. True when a capacity was learned (worth keeping)."""
        if soc is None or charged is None or given is None:
            return False
        start = self._from
        if start is None or now - start.at > timedelta(hours=SWING_HOURS) or charged < start.charged or given < start.given:
            self._from = Swing(now, soc, charged, given)
            return False
        moved = soc - start.soc
        if abs(moved) < SWING:
            return False
        # Charging: what went in, less what came out meanwhile (and the reverse). Losses make it a little large: fine.
        net = (charged - start.charged) - (given - start.given)
        self._from = Swing(now, soc, charged, given)
        if net == 0 or (net > 0) != (moved > 0):
            return False
        kwh = abs(net) / (abs(moved) / 100)
        if not 0.5 <= kwh <= 200:
            return False
        self.learned = [*self.learned, round(kwh, 2)][-KEEP:]
        return True


def now(power_w: float | None, soc: float | None, capacity: float | None, at: datetime) -> dict | None:
    """The battery as the card says it: its power each way, its charge, and, at this pace, until when it lasts (giving)
    or when it is full (charging). None without anything to say."""
    if power_w is None and soc is None:
        return None
    giving = max(0.0, power_w) if power_w is not None else None
    taking = max(0.0, -power_w) if power_w is not None else None
    out = {"decharge_w": None if giving is None else round(giving), "charge_w": None if taking is None else round(taking),
           "pourcent": None if soc is None else round(soc), "capacite_kwh": capacity, "reste_kwh": None,
           "jusqu_a": None, "pleine_a": None}
    if soc is None or not capacity:
        return out
    usable = max(0.0, (soc - LOW) / 100 * capacity)
    out["reste_kwh"] = round(usable, 1)
    if giving is not None and giving >= ACTIVE_W:
        out["jusqu_a"] = (at + timedelta(hours=usable / (giving / 1000))).isoformat()
    elif taking is not None and taking >= ACTIVE_W and soc < 99:
        out["pleine_a"] = (at + timedelta(hours=(100 - soc) / 100 * capacity / (taking / 1000))).isoformat()
    return out
