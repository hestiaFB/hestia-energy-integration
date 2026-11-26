"""The home battery (1.0.1b3, retour HACF du 26 nov. 2026): its charge is not counted in « Maison », its power and its
charge go to the card, its capacity is learned from a swing of charge. Pure tests first, then an invented home in a real
Home Assistant core (no reading of any real house). The Home Assistant part is skipped without Home Assistant."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from custom_components.hestia_energy.engine import battery, sources  # noqa: E402

T0 = datetime(2026, 11, 26, 12, 0, tzinfo=timezone.utc)


class Pure(unittest.TestCase):
    def test_the_capacity_is_learned_from_a_swing(self):
        b = battery.Battery()
        self.assertFalse(b.learn(T0, 40, 100.0, 80.0))
        self.assertFalse(b.learn(T0 + timedelta(hours=1), 50, 101.0, 80.0))   # 10 points: not yet
        self.assertTrue(b.learn(T0 + timedelta(hours=2), 60, 102.0, 80.0))    # 20 points for 2 kWh: 10 kWh
        self.assertEqual(b.capacity(None), 10.0)
        self.assertEqual(b.capacity(7.5), 7.5)                                # the household's setting wins

    def test_a_slow_or_contradictory_swing_is_not_learned(self):
        b = battery.Battery()
        b.learn(T0, 40, 100.0, 80.0)
        self.assertFalse(b.learn(T0 + timedelta(hours=13), 70, 103.0, 80.0))  # too slow: started again
        self.assertFalse(b.learn(T0 + timedelta(hours=14), 90, 103.0, 85.0))  # charge up, energy out: nonsense
        self.assertIsNone(b.capacity(None))

    def test_until_when_it_lasts_and_when_it_is_full(self):
        giving = battery.now(1000, 60, 10, T0)
        self.assertEqual(giving["decharge_w"], 1000)
        self.assertEqual(giving["charge_w"], 0)
        self.assertEqual(giving["reste_kwh"], 5.0)                           # 10 % kept by the battery itself
        self.assertEqual(giving["jusqu_a"], (T0 + timedelta(hours=5)).isoformat())
        taking = battery.now(-2000, 60, 10, T0)
        self.assertEqual(taking["charge_w"], 2000)
        self.assertEqual(taking["pleine_a"], (T0 + timedelta(hours=2)).isoformat())
        self.assertIsNone(battery.now(None, None, None, T0))
        self.assertIsNone(battery.now(500, 60, None, T0)["jusqu_a"])        # no capacity: no time said

    def test_one_power_per_battery_in_the_page(self):
        page = sources.read_page({"energy_sources": [{"type": "battery", "stat_energy_from": "sensor.batterie_sortie",
                                                      "stat_energy_to": "sensor.batterie_entree",
                                                      "power_config": {"stat_rate": "sensor.batterie_w"}}]})
        self.assertEqual([m.power.rate for m in page.batteries_in + page.batteries_out], ["sensor.batterie_w"] * 2)


try:
    from homeassistant import loader
    from homeassistant.config_entries import ConfigEntries, ConfigEntry
    from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er, frame, issue_registry as ir
    from homeassistant.core import HomeAssistant
    from homeassistant.util import dt as dt_util
    HA = True
except ImportError:
    HA = False

PREFS = {"energy_sources": [
    {"type": "grid", "name": "Réseau", "stat_energy_from": "sensor.maison_achat", "stat_energy_to": "sensor.maison_injection",
     "number_energy_price": 0.25, "number_energy_price_export": 0, "power_config": {"stat_rate": "sensor.maison_reseau_w"}},
    {"type": "solar", "stat_energy_from": "sensor.panneaux_kwh", "power_config": {"stat_rate": "sensor.panneaux_w"}},
    {"type": "battery", "stat_energy_from": "sensor.batterie_sortie", "stat_energy_to": "sensor.batterie_entree",
     "power_config": {"stat_rate": "sensor.batterie_w"}}]}


@unittest.skipUnless(HA, "Home Assistant is not installed")
class InventedHomeWithABattery(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        from custom_components.hestia_energy import reader
        from custom_components.hestia_energy.const import DOMAIN
        self.DOMAIN = DOMAIN
        self.directory = tempfile.TemporaryDirectory()
        config = Path(self.directory.name)
        (config / "custom_components").mkdir()
        (config / "custom_components" / DOMAIN).symlink_to(ROOT / "custom_components" / DOMAIN)
        hass = HomeAssistant(str(config))
        await hass.config.async_set_time_zone("Europe/Paris")
        frame.async_setup(hass)
        loader.async_setup(hass)
        hass.config_entries = ConfigEntries(hass, {})
        await hass.config_entries.async_initialize()
        await ar.async_load(hass)
        dr.async_setup(hass)
        await dr.async_load(hass)
        await er.async_load(hass)
        await ir.async_load(hass)
        self.hass = hass
        # The battery's entities on one device, as an inverter's integration makes them; a phone's battery elsewhere.
        from homeassistant.config_entries import ConfigEntry as Entry
        inverter = Entry(domain="onduleur_invente", title="Onduleur", data={}, options={}, unique_id="onduleur", version=1,
                         minor_version=1, source="user", discovery_keys={}, subentries_data=None)
        hass.config_entries._entries[inverter.entry_id] = inverter
        device = dr.async_get(hass).async_get_or_create(config_entry_id=inverter.entry_id, identifiers={("onduleur_invente", "b1")})
        registry = er.async_get(hass)
        for object_id, device_class in (("batterie_w", "power"), ("batterie_charge", "battery")):
            registry.async_get_or_create("sensor", "onduleur_invente", object_id, suggested_object_id=object_id,
                                         config_entry=inverter, device_id=device.id, original_device_class=device_class)
        registry.async_get_or_create("sensor", "telephone", "batterie", suggested_object_id="telephone_batterie",
                                     original_device_class="battery")
        for entity, value, unit, cls in (("sensor.maison_reseau_w", 0, "W", "power"), ("sensor.panneaux_w", 735, "W", "power"),
                                         ("sensor.batterie_w", -449, "W", "power"), ("sensor.batterie_charge", 18, "%", "battery"),
                                         ("sensor.telephone_batterie", 90, "%", "battery"),
                                         ("sensor.batterie_entree", 100.0, "kWh", "energy"), ("sensor.batterie_sortie", 80.0, "kWh", "energy")):
            hass.states.async_set(entity, str(value), {"unit_of_measurement": unit, "device_class": cls})
        self.patches = [patch.object(reader, name, side) for name, side in (
            ("energy_prefs", self._prefs), ("metadata", self._metadata), ("hourly", self._hourly),
            ("listen_prefs", self._listen), ("is_local", self._local))]
        for p in self.patches:
            p.start()

    async def asyncTearDown(self):
        for p in self.patches:
            p.stop()
        await self.hass.async_stop()
        self.directory.cleanup()

    async def _prefs(self, hass):
        return PREFS

    async def _metadata(self, hass, ids):
        return {i: {"statistic_id": i, "unit_of_measurement": "kWh", "has_sum": True} for i in ids}

    async def _hourly(self, hass, ids, start, end=None):
        return {}

    async def _listen(self, hass, callback):
        return lambda: None

    async def _local(self, hass, entity_id):
        return True

    async def setup(self):
        from custom_components.hestia_energy import async_setup
        await async_setup(self.hass, {})
        entry = ConfigEntry(domain=self.DOMAIN, title="Maison inventée", data={}, options={}, unique_id="hestia_energy_home",
                            version=1, minor_version=1, source="user", discovery_keys={}, subentries_data=None)
        self.hass.config_entries._entries[entry.entry_id] = entry
        with patch("homeassistant.setup.async_process_deps_reqs", return_value=None):
            await self.hass.config_entries.async_setup(entry.entry_id)
        await self.hass.async_block_till_done()
        coordinator = entry.runtime_data
        await coordinator.async_refresh(full=True)
        await self.hass.async_block_till_done()
        coordinator.data["pret"] = True
        return coordinator

    async def test_the_charge_is_not_the_homes(self):
        c = await self.setup()
        self.assertEqual(c.extras["battery_soc"], "sensor.batterie_charge")   # its device's, never the phone's
        c._update_live()
        d = c.data["direct"]
        # The forum's case: 735 W of sun, nothing from the grid, 449 W into the battery: the home draws 286 W.
        self.assertEqual(round(d["maison_w"]), 286)
        self.assertEqual(d["batterie"]["charge_w"], 449)
        self.assertEqual(d["batterie"]["decharge_w"], 0)
        self.assertEqual(d["batterie"]["pourcent"], 18)

    async def test_the_battery_gives_to_the_home(self):
        c = await self.setup()
        self.hass.states.async_set("sensor.panneaux_w", "0", {"unit_of_measurement": "W"})
        self.hass.states.async_set("sensor.batterie_w", "1.2", {"unit_of_measurement": "kW"})
        self.hass.states.async_set("sensor.maison_reseau_w", "100", {"unit_of_measurement": "W"})
        c._update_live()
        d = c.data["direct"]
        self.assertEqual(round(d["maison_w"]), 1300)
        self.assertEqual(d["batterie"]["decharge_w"], 1200)

    async def test_a_chosen_sensor_wins(self):
        from homeassistant.helpers.storage import Store
        await Store(self.hass, 1, f"{self.DOMAIN}.settings").async_save({"battery_soc": "sensor.telephone_batterie", "battery_kwh": 10})
        c = await self.setup()
        self.assertEqual(c.extras["battery_soc"], "sensor.telephone_batterie")
        c._update_live()
        self.assertEqual(c.data["direct"]["batterie"]["capacite_kwh"], 10)
        self.assertIsNotNone(c.data["direct"]["batterie"]["pleine_a"])


if __name__ == "__main__":
    unittest.main()
