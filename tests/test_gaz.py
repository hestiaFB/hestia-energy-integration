"""The gas of the Energy page, counted like the electricity (engine/gas.py): an invented home (no gas home in the
replay data) with two gas meters in m³, a boiler for the heating and the hot water. The heating's share is never
guessed here: it is Hestia Heating's (Frank, 27 Nov. 2026). Helpers after Yann Le Gall's tests (PR 23)."""
from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
import math
import unittest
from zoneinfo import ZoneInfo

from replay import ROOT  # noqa: F401 - puts the engine on the path
from engine import gas, stats
from engine.home import Reading
from engine.sources import GAS_ENERGY, GAS_VOLUME, Meter, Price, gas_unit

PARIS = ZoneInfo("Europe/Paris")
NOW = datetime(2026, 11, 25, 14, tzinfo=PARIS)
FIRST = date(2025, 11, 1)
HEATING, WATER = "sensor.gaz_chauffage", "sensor.gaz_eau_chaude"


def m3_heating(d: date) -> float:
    return round(max(0.0, 1.2 + 1.3 * math.cos(2 * math.pi * (d.timetuple().tm_yday - 15) / 365)), 3)


def series(stat: str, m3_of, gap: date | None = None) -> stats.Series:
    """The meter hour by hour, in litres as the statistics are read; `gap`: a day with an hour missing."""
    out = stats.Series(stat)
    at = datetime.combine(FIRST, datetime.min.time(), PARIS).astimezone(timezone.utc)
    while at < NOW:
        local = at.astimezone(PARIS)
        missing = gap is not None and local.date() == gap and local.hour == 12
        out.hours.append(stats.Hour(at, None if missing else m3_of(local.date()) * 1000 / 24))
        at += timedelta(hours=1)
    return out


def reading(stat: str, m3_of, gap=None) -> Reading:
    return Reading(Meter("gas", stat, stat, Price(number=1.25)), series(stat, m3_of, gap))


READINGS = [reading(HEATING, m3_heating), reading(WATER, lambda d: 0.6)]
UNITS = {HEATING: GAS_VOLUME, WATER: GAS_VOLUME}


class TheUnit(unittest.TestCase):
    def test_a_meter_says_its_unit(self):
        self.assertEqual(gas_unit({"unit_class": "volume", "statistics_unit_of_measurement": "m³"}), GAS_VOLUME)
        self.assertEqual(gas_unit({"unit_class": "energy", "statistics_unit_of_measurement": "kWh"}), GAS_ENERGY)
        self.assertEqual(gas_unit({"statistics_unit_of_measurement": "m3"}), GAS_VOLUME)
        self.assertIsNone(gas_unit({"statistics_unit_of_measurement": "°C"}))
        self.assertIsNone(gas_unit(None))

    def test_kwh_and_m3_are_never_added(self):
        self.assertIsNone(gas.unit_of([HEATING, WATER], {HEATING: GAS_VOLUME, WATER: GAS_ENERGY}))
        self.assertEqual(gas.days(READINGS, {HEATING: GAS_VOLUME, WATER: GAS_ENERGY}, PARIS, gas.Contract()), {})


class TheDays(unittest.TestCase):
    def test_each_day_adds_the_meters_and_converts_to_kwh(self):
        found = gas.days(READINGS, UNITS, PARIS, gas.Contract(kwh_per_m3=11.0))
        d = date(2026, 1, 15)
        self.assertAlmostEqual(found[d].quantity, m3_heating(d) + 0.6, places=2)
        self.assertAlmostEqual(found[d].kwh, (m3_heating(d) + 0.6) * 11.0, places=1)
        self.assertTrue(found[d].complete)

    def test_a_day_with_a_gap_is_not_complete(self):
        gap = date(2026, 2, 3)
        found = gas.days([reading(HEATING, m3_heating, gap)], {HEATING: GAS_VOLUME}, PARIS, gas.Contract())
        self.assertFalse(found[gap].complete)


class TheBill(unittest.TestCase):
    def setUp(self):
        self.found = gas.days(READINGS, UNITS, PARIS, gas.Contract())

    def test_the_month_counts_the_subscription_for_its_part(self):
        out = gas.summary(self.found, GAS_VOLUME, 1.25, gas.Contract(subscription=12.0), NOW)
        month = out["mois"]
        burnt = sum(m3_heating(date(2026, 11, d)) + 0.6 for d in range(1, 25)) + (m3_heating(NOW.date()) + 0.6) * 14 / 24
        self.assertAlmostEqual(month["q"], burnt, delta=0.2)
        self.assertAlmostEqual(month["gaz_euros"], burnt * 1.25, delta=0.3)
        elapsed = (24 + 14 / 24) / 30
        self.assertAlmostEqual(month["abonnement_euros"], 12.0 * elapsed, delta=0.05)
        self.assertAlmostEqual(month["euros"], month["gaz_euros"] + month["abonnement_euros"], delta=0.01)
        # The month's end: the gas stretched to the 30th, the whole subscription.
        self.assertAlmostEqual(month["fin_de_mois"], month["gaz_euros"] / elapsed + 12.0, delta=0.05)

    def test_the_twelve_months_each_with_a_whole_subscription(self):
        out = gas.summary(self.found, GAS_VOLUME, 1.25, gas.Contract(subscription=12.0), NOW)
        months = out["douze_mois"]
        self.assertEqual(len(months), 12)
        self.assertEqual(months[0]["mois"], "2026-10-01")
        self.assertEqual(months[-1]["mois"], "2025-11-01")
        january = next(m for m in months if m["mois"] == "2026-01-01")
        q = sum(m3_heating(date(2026, 1, d)) + 0.6 for d in range(1, 32))
        self.assertAlmostEqual(january["euros"], q * 1.25 + 12.0, delta=0.3)
        self.assertAlmostEqual(out["douze_mois_euros"], sum(m["euros"] for m in months), delta=0.05)

    def test_the_price_typed_is_per_kwh(self):
        c = gas.Contract(price_kwh=0.11, kwh_per_m3=11.2)
        self.assertAlmostEqual(c.unit_price(GAS_VOLUME, 1.25), 0.11 * 11.2)
        self.assertAlmostEqual(c.unit_price(GAS_ENERGY, 0.13), 0.11)
        self.assertEqual(gas.Contract().unit_price(GAS_VOLUME, 1.25), 1.25)

    def test_without_a_price_quantities_only_never_free(self):
        out = gas.summary(self.found, GAS_VOLUME, None, gas.Contract(), NOW)
        self.assertIsNone(out["mois"]["euros"])
        self.assertIsNone(out["mois"]["fin_de_mois"])
        self.assertIsNone(out["douze_mois_euros"])
        self.assertGreater(out["mois"]["q"], 0)

    def test_no_end_of_month_before_the_third_day(self):
        early = datetime(2026, 11, 2, 10, tzinfo=PARIS)
        out = gas.summary(self.found, GAS_VOLUME, 1.25, gas.Contract(), early)
        self.assertIsNone(out["mois"]["fin_de_mois"])

    def test_the_biggest_day_is_a_whole_one(self):
        out = gas.summary(self.found, GAS_VOLUME, 1.25, gas.Contract(), NOW)
        self.assertNotEqual(out["plus_gros"]["jour"], NOW.date().isoformat())
        self.assertEqual(len(out["jours"]), 25)

    def test_nothing_without_gas(self):
        self.assertIsNone(gas.summary({}, GAS_VOLUME, 1.25, gas.Contract(), NOW))

    def test_no_heating_share_is_ever_said(self):
        out = gas.summary(self.found, GAS_VOLUME, 1.25, gas.Contract(), NOW)
        self.assertFalse({"chauffe", "chauffage", "par_degre"} & set(out))
