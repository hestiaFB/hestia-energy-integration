"""Advice « à froid » (engine/daily.py, Frank 9 Nov. 2026) on Frank's own HA Linky statistics: palier 0, one meter,
one value a day for the year, hour by hour for its last week. Each advice said with the euros a year at stake."""
from datetime import datetime, timezone
import unittest

from replay import HOME, degree_days, need
from engine import daily, report, tariff
from test_ha_linky import PARIS, linky_home

NOW = datetime(2026, 11, 7, 11, tzinfo=timezone.utc)    # the morning the statistics were taken


class AdviceFromTheDays(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        need(HOME / "ha-linky.json.gz")
        cls.home, _ = linky_home()
        cls.table = tariff.load_regulated()
        offpeak = tariff.parse_offpeak("00:14-08:19")
        cls.contract = report.contract_for(cls.home, 9, offpeak, {}, None, tariff.HPHC)
        cls.price = tariff.regulated_price(cls.table, NOW.date(), tariff.BASE, 9)

    def test_the_off_peak_hours_do_not_pay(self):
        found = daily.contract_option(self.home, self.contract, self.table, NOW)
        self.assertIsNotNone(found)
        self.assertEqual(found["rubrique"], "contrat")
        self.assertLess(int(found["pourquoi"].split(" % ")[0].split()[-1]), 25)    # « Seulement 22 % … »
        self.assertGreater(found["euros_an"], 15)

    def test_the_baseload_from_seven_nights(self):
        found = daily.baseload(self.home, self.price)
        self.assertIsNotNone(found)
        self.assertIn(" W.", found["pourquoi"])
        self.assertGreater(found["euros_an"], 200)

    def test_nothing_without_the_cold_nor_the_hours(self):
        base = report.contract_for(self.home, 9, None, {}, None, tariff.BASE)
        self.assertIsNone(daily.contract_option(self.home, base, self.table, NOW))

    def test_the_list_and_its_order(self):
        found = daily.advices(self.home, self.contract, self.table, NOW, degree_days(), True, self.price, None, None)
        print("\n".join(f"  {a['titre']} — {a['pourquoi']}" for a in found))
        money = [a["euros_an"] for a in found if a["id"] != "jour_inhabituel"]
        self.assertEqual(money, sorted(money, reverse=True))
        self.assertTrue({"contrat_base", "veille_haute"} <= {a["id"] for a in found})
        # The heating is Hestia Heating's: no advice on it here (Frank, 27 Nov. 2026).
        self.assertFalse(any(a.get("rubrique") == "chauffage" for a in found))


if __name__ == "__main__":
    unittest.main()
