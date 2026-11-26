"""Real data for the replay tests (the rule of Hestia Comfort: real data, defects included, never invented cases).

The data of Frank's home stays outside the repository (hestia-energie/donnees-test, never published): the tests that
need it are skipped where it is absent (GitHub). HESTIA_ENERGY_DATA may point elsewhere.
"""
from __future__ import annotations

import csv
import gzip
import json
import os
from datetime import datetime
from functools import lru_cache
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
# At the end of the path: the brick's own select.py must never hide the standard library's select.
sys.path.append(str(ROOT / "custom_components" / "hestia_energy"))
DATA = Path(os.environ.get("HESTIA_ENERGY_DATA", ROOT.parent / "hestia-energie" / "donnees-test"))
HOME = DATA / "maison-frank"
LEVEL0 = DATA / "palier-0"


def need(path: Path = HOME):
    if not path.exists():
        raise unittest.SkipTest(f"données réelles absentes : {path}")


@lru_cache(maxsize=1)
def description() -> dict:
    need()
    return json.loads((HOME / "description.json").read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def hourly() -> dict[str, list[dict]]:
    """Every statistic's hours, in order: {id: [{start, mean, min, max, state, sum}]} (start: aware datetime, UTC)."""
    need()
    rows: dict[str, list[dict]] = {}
    with gzip.open(HOME / "statistiques-horaires.csv.gz", "rt", newline="") as f:
        for r in csv.DictReader(f):
            row = {"start": datetime.fromisoformat(r["debut_utc"])}
            for key in ("mean", "min", "max", "state", "sum"):
                row[key] = float(r[key]) if r[key] not in ("", None) else None
            rows.setdefault(r["statistic_id"], []).append(row)
    for values in rows.values():
        values.sort(key=lambda row: row["start"])
    return rows


def situations(home, rows, offpeak, start, end, kva=9, export_price=None, offpeak_price=None):
    """One banner situation per hour from the statistics, as the live states would have shown it on average.

    A device runs in an hour when its power reached 800 W and averaged 200 W at least; its power is that peak.
    The hour is read at its middle (half past): its period, the next change.
    """
    from datetime import timedelta
    from engine import advice, tariff
    tz = home.tz
    by = lambda series: {h.start: h.kwh for h in series.hours} if series else {}  # noqa: E731
    bought, sent, sun = by(home.bought), by(home.sent), by(home.sun)
    devices = []
    for reading in home.of("device"):
        power = rows.get(reading.meter.power.rate or "", [])
        devices.append((reading.meter.name or reading.meter.stat, advice.kind_of(reading.meter.name, reading.meter.stat),
                        {r["start"]: r for r in power}, reading.lag or 0))
    out = []
    t = start
    while t < end:
        middle = t + timedelta(minutes=30)
        running = []
        for name, kind, power, lag in devices:
            r = power.get(t)
            if r and r.get("max") is not None and r["max"] >= 800 and (r.get("mean") or 0) >= 200:
                running.append(advice.Running(name, kind, r["max"]))
        change = tariff.next_change(offpeak, middle, tz)
        period = ("hc" if offpeak.contains(middle, tz) else "hp") if offpeak else None
        kwh = lambda d: None if d.get(t) is None else d[t] * 1000  # noqa: E731
        out.append(advice.Situation(
            now=middle, tz=tz, period=period, next_change=change,
            offpeak_end=change[0] if change and period == "hc" else None,
            bought_w=kwh(bought), sent_w=kwh(sent), sun_w=kwh(sun), subscribed_w=kva * 1000, running=running,
            export_price=export_price, offpeak_price=offpeak_price))
        t += timedelta(hours=1)
    return out


@lru_cache(maxsize=1)
def live_snapshot() -> tuple[datetime, dict]:
    """A real snapshot of the live states of Frank's home (7 Nov. 2026, 13 h 15), read-only: {entity_id: Reading}."""
    from engine.live import Reading
    path = HOME / "etats-direct.json"
    need(path)
    data = json.loads(path.read_text(encoding="utf-8"))
    states = {}
    for s in data["etats"]:
        states[s["entity_id"]] = Reading(s["entity_id"], s["state"], s["attributes"].get("unit_of_measurement"),
                                         datetime.fromisoformat(s["last_changed"]), datetime.fromisoformat(s.get("last_reported") or s["last_updated"]))
    return datetime.fromisoformat(data["pris_le"]), states


def degree_days(stat: str = "sensor.gw2000a_outdoor_temperature") -> dict:
    """Each day's heating degree-days from the station's hourly statistics, counted as Hestia Weather counts them
    (degree_days(): (high + low) / 2, base 18 °C, at least 20 hours that day)."""
    from collections import defaultdict
    from zoneinfo import ZoneInfo
    paris, seen = ZoneInfo("Europe/Paris"), defaultdict(list)
    for row in hourly().get(stat, []):
        if row.get("min") is not None and row.get("max") is not None:
            seen[row["start"].astimezone(paris).date()].append((row["min"], row["max"]))
    return {d: round(max(0.0, 18 - (min(lo for lo, _ in v) + max(hi for _, hi in v)) / 2), 1)
            for d, v in seen.items() if len(v) >= 20}
