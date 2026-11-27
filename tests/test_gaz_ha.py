"""The gas in a running Home Assistant (invented home of test_chauffe_eau_ha, with a gas meter in m³): the panel's
figures, the three settings, and each day given to Hestia Heating through the interface (api.days)."""
from __future__ import annotations

from datetime import timedelta
import unittest

import test_chauffe_eau_ha as base
from test_chauffe_eau_ha import API_KEY, InventedHome, PREFS

GAS = "sensor.compteur_gaz"
GAS_PREFS = {**PREFS, "energy_sources": [*PREFS["energy_sources"],
                                         {"type": "gas", "stat_energy_from": GAS, "number_energy_price": 1.30}]}


class GasHome(InventedHome):
    """The water heater's tests run here too, with gas on the page: the gas changes nothing for them."""

    async def asyncSetUp(self):
        await super().asyncSetUp()
        # 1,5 m³ a day, spread over the hours, in litres as the statistics are read.
        total, rows = 0.0, []
        for row in self.rows["sensor.maison_hp"]:
            total += 1500 / 24
            rows.append({**row, "sum": total, "state": total})
        self.rows[GAS] = rows

    async def _prefs(self, hass):
        return GAS_PREFS

    async def _metadata(self, hass, ids):
        out = await super()._metadata(hass, ids)
        if GAS in ids:
            out[GAS] = {"statistic_id": GAS, "unit_class": "volume", "statistics_unit_of_measurement": "m³", "has_sum": True}
        return out

    async def test_the_gas_is_counted_like_the_electricity(self):
        _, c = await self.setup({"gas_subscription": 12.0})
        found = c.data["gaz"]
        self.assertEqual(found["unite"], "m³")
        self.assertAlmostEqual(found["prix"], 1.30)
        self.assertAlmostEqual(found["q_par_jour"], 1.5, places=1)
        self.assertIsNotNone(found["mois"]["euros"])
        self.assertNotIn("chauffe", found)

    async def test_the_price_typed_per_kwh_wins(self):
        _, c = await self.setup({"gas_price": 0.10, "gas_kwh_m3": 11.0})
        self.assertAlmostEqual(c.data["gaz"]["prix"], 1.10)

    async def test_each_day_goes_to_hestia_heating(self):
        _, c = await self.setup()
        api = self.hass.data[API_KEY]
        today = base.dt_util.now().date()
        days = api.days(today - timedelta(days=10), today - timedelta(days=1))
        self.assertEqual(len(days), 10)
        day = days[0]
        self.assertAlmostEqual(day["gas_quantity"], 1.5, places=2)
        self.assertAlmostEqual(day["gas_kwh"], 1.5 * 11.2, places=1)
        self.assertEqual(day["gas_unit"], "m³")
        self.assertGreater(day["electricity_kwh"], 0)
        self.assertEqual(api.days(today, today - timedelta(days=1)), [])
        self.assertEqual(api.days(today - timedelta(days=500), today), [])

    async def test_hestia_heating_reads_the_price_of_a_kwh(self):
        await self.setup()
        self.assertAlmostEqual(self.hass.data[API_KEY].gas_price(), 1.30 / 11.2, places=4)

    async def test_the_price_of_a_kwh_typed_in_reglages(self):
        await self.setup({"gas_price": 0.105, "gas_kwh_m3": 11.0})
        self.assertAlmostEqual(self.hass.data[API_KEY].gas_price(), 0.105, places=4)

    async def test_the_panel_finds_the_gas(self):
        from custom_components.hestia_energy import hub_view
        _, c = await self.setup()
        found = hub_view.found_settings(self.hass, c)
        self.assertTrue(found["a"]["gaz"])
        self.assertEqual(found["gas_unit"], "m³")
        self.assertAlmostEqual(found["gas_price"]["valeur"], round(1.30 / 11.2, 4))


if __name__ == "__main__":
    unittest.main()
