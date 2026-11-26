"""The heating's cost read from Hestia Heating (its interface v1, `cout_chauffage`, from its 1.1.0b1) and shown as it
is: one cost of the heating (1.0.0b11). An invented home, no reading of any real house."""
from datetime import date, timedelta
from pathlib import Path
import sys
from types import SimpleNamespace
import unittest

try:
    import homeassistant  # noqa: F401
except ImportError:
    raise unittest.SkipTest("Home Assistant is not installed")

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from custom_components.hestia_energy import reader  # noqa: E402
from custom_components.hestia_energy.coordinator import heating_month_cost  # noqa: E402

TODAY = date(2026, 11, 26)


class Heating:
    version = 1

    def __init__(self, days: dict):
        self.days = days

    def cout_chauffage(self, jour=None):
        key = TODAY.isoformat() if jour is None else (jour.isoformat() if hasattr(jour, "isoformat") else jour)
        found = self.days.get(key)
        return None if found is None else {"jour": key, "prix": "energie", **found}


def day(eur_el, eur_pellets, kwh=4.0, kg=6.0):
    total = None if eur_el is None or eur_pellets is None else eur_el + eur_pellets
    return {"electrique_kwh": kwh, "electrique_eur": eur_el, "granules_kg": kg, "granules_eur": eur_pellets,
            "chauffage_eur": total, "gagne_eur": 0.5}


def hass_with(api):
    return SimpleNamespace(data={} if api is None else {"hestia_heating_api": api})


class HeatingCost(unittest.TestCase):
    def test_without_hestia_heating_nothing(self):
        self.assertIsNone(heating_month_cost(hass_with(None), TODAY))

    def test_an_older_hestia_heating_nothing(self):
        self.assertIsNone(heating_month_cost(hass_with(SimpleNamespace(version=1)), TODAY))

    def test_another_version_nothing(self):
        api = Heating({TODAY.isoformat(): day(1.0, 2.0)})
        api.version = 2
        self.assertIsNone(reader.heating_cost(hass_with(api)))

    def test_today_yesterday_and_the_month_as_it_counts_them(self):
        days = {(TODAY - timedelta(days=n)).isoformat(): day(1.0, 2.0) for n in range(26)}
        found = heating_month_cost(hass_with(Heating(days)), TODAY)
        self.assertEqual(found["aujourdhui"]["chauffage_eur"], 3.0)
        self.assertEqual(found["hier"]["jour"], "2026-11-25")
        self.assertEqual(found["mois"]["jours"], 26)
        self.assertEqual(found["mois"]["chauffage_eur"], 78.0)
        self.assertEqual(found["mois"]["granules_kg"], 156.0)
        self.assertEqual(found["mois"]["du"], "2026-11-01")

    def test_a_day_without_price_leaves_the_month_without_euros(self):
        days = {TODAY.isoformat(): day(1.0, 2.0), "2026-11-25": day(None, 2.0)}
        found = heating_month_cost(hass_with(Heating(days)), TODAY)
        self.assertIsNone(found["mois"]["electrique_eur"])
        self.assertIsNone(found["mois"]["chauffage_eur"])
        self.assertEqual(found["mois"]["granules_eur"], 4.0)

    def test_its_trouble_never_stops_energy(self):
        class Broken(Heating):
            def cout_chauffage(self, jour=None):
                raise RuntimeError("boom")
        self.assertIsNone(heating_month_cost(hass_with(Broken({})), TODAY))

    def test_only_numbers_are_kept(self):
        api = Heating({TODAY.isoformat(): {"electrique_kwh": "x", "chauffage_eur": True, "granules_kg": 3}})
        found = reader.heating_cost(hass_with(api))
        self.assertIsNone(found["electrique_kwh"])
        self.assertIsNone(found["chauffage_eur"])
        self.assertEqual(found["granules_kg"], 3.0)


if __name__ == "__main__":
    unittest.main()
