"""The water heater driven by Hestia Energy in a real Home Assistant core, on an invented home (no real reading of any
house): two meters (peak, off-peak), panels, a 2,4 kW water heater on a plug, six weeks of statistics. Skipped
without Home Assistant."""
from __future__ import annotations

from datetime import datetime, timedelta
import math
from pathlib import Path
import sys
import tempfile
import time
import unittest
from unittest.mock import patch
from zoneinfo import ZoneInfo

try:
    from homeassistant import loader
    from homeassistant.config_entries import ConfigEntries, ConfigEntry
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er, frame, issue_registry as ir
    from homeassistant.util import dt as dt_util
except ImportError:
    raise unittest.SkipTest("Home Assistant is not installed")

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from custom_components.hestia_energy import reader  # noqa: E402
from custom_components.hestia_energy.const import API_KEY, DOMAIN  # noqa: E402

PARIS = ZoneInfo("Europe/Paris")
PREFS = {"energy_sources": [
    {"type": "grid", "name": "Heures pleines", "stat_energy_from": "sensor.maison_hp", "number_energy_price": 0.27,
     "power_config": {"stat_rate": "sensor.maison_reseau_w"}},
    {"type": "grid", "name": "Heures creuses", "stat_energy_from": "sensor.maison_hc", "number_energy_price": 0.2068},
    {"type": "grid", "name": "Revente", "stat_energy_to": "sensor.maison_revente", "number_energy_price_export": 0.04},
    {"type": "solar", "stat_energy_from": "sensor.panneaux_kwh", "stat_rate": "sensor.panneaux_w"}],
    "device_consumption": [{"stat_consumption": "sensor.chauffe_eau_kwh", "name": "Chauffe-eau", "stat_rate": "sensor.chauffe_eau_w"}]}


def invented_year(now: datetime) -> dict[str, list[dict]]:
    """Six weeks of an invented home: 0,5 kW all day, the water heater 2 hours each night (23 h - 1 h, 2,4 kW), panels
    of 3 kW peak one day in two."""
    start = (now - timedelta(days=42)).replace(minute=0, second=0, microsecond=0)
    sums = {k: 0.0 for k in ("sensor.maison_hp", "sensor.maison_hc", "sensor.maison_revente", "sensor.panneaux_kwh", "sensor.chauffe_eau_kwh")}
    rows: dict[str, list[dict]] = {k: [] for k in sums}
    hour = start
    while hour < now.replace(minute=0, second=0, microsecond=0):
        local = hour.astimezone(PARIS)
        t = local.hour + 0.5
        sun = 3.0 * math.sin(math.pi * (t - 8.5) / 8.5) ** 1.6 if 8.5 < t < 17 and local.toordinal() % 2 else 0.0
        heater = 2.4 if local.hour in (23, 0) else 0.0
        used = 0.5 + heater
        own = min(sun, used)
        bought, sent = used - own, sun - own
        offpeak = local.hour >= 22 or local.hour < 6
        sums["sensor.maison_hc" if offpeak else "sensor.maison_hp"] += bought
        sums["sensor.maison_revente"] += sent
        sums["sensor.panneaux_kwh"] += sun
        sums["sensor.chauffe_eau_kwh"] += heater
        for k, v in sums.items():
            rows[k].append({"start": hour, "sum": v, "state": v, "mean": None, "min": None, "max": None})
        hour += timedelta(hours=1)
    return rows


class InventedHome(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
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
        self.rows = invented_year(dt_util.utcnow())
        for entity, value in (("sensor.maison_reseau_w", 600), ("sensor.panneaux_w", 0), ("sensor.chauffe_eau_w", 0)):
            hass.states.async_set(entity, str(value), {"unit_of_measurement": "W", "device_class": "power"})
        hass.states.async_set("switch.prise_chauffe_eau", "off")
        # The plug's own services: Hestia Energy must never call them.
        self.commands = []
        for service in ("turn_on", "turn_off", "toggle"):
            hass.services.async_register("switch", service, lambda call: self.commands.append(call))
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
        return {i: {"statistic_id": i, "unit_of_measurement": "kWh", "has_sum": True} for i in ids if i in self.rows}

    async def _hourly(self, hass, ids, start, end=None):
        return {i: [r for r in v if r["start"] >= start] for i, v in self.rows.items() if i in ids}

    async def _listen(self, hass, callback):
        return lambda: None

    async def _local(self, hass, entity_id):
        return True

    async def setup(self, settings: dict | None = None):
        from custom_components.hestia_energy import async_setup
        await async_setup(self.hass, {})
        entry = ConfigEntry(domain=DOMAIN, title="Maison inventée", data={}, options={}, unique_id="hestia_energy_home", version=1,
                            minor_version=1, source="user", discovery_keys={}, subentries_data=None)
        self.hass.config_entries._entries[entry.entry_id] = entry
        from homeassistant.helpers.storage import Store
        await Store(self.hass, 1, f"{DOMAIN}.settings").async_save({"offpeak": "22:00-06:00", "option": "hphc", "kva": 6,
                                                                     **(settings or {})})
        with patch("homeassistant.setup.async_process_deps_reqs", return_value=None):
            await self.hass.config_entries.async_setup(entry.entry_id)
        await self.hass.async_block_till_done()
        self.assertTrue(hasattr(entry, "runtime_data"), f"{entry.state} {entry.reason}")
        coordinator = entry.runtime_data
        await coordinator.async_refresh(full=True)
        await self.hass.async_block_till_done()
        return entry, coordinator

    async def test_its_entities_start_in_simulation(self):
        _, c = await self.setup()
        self.assertIsNotNone(self.hass.states.get("binary_sensor.hestia_energy_chauffe_eau"))
        self.assertEqual(self.hass.states.get("select.hestia_energy_chauffe_eau_mode").state, "simulation")
        self.assertIsNotNone(self.hass.states.get("button.hestia_energy_chauffe_eau_boost"))
        reserve = self.hass.states.get("sensor.hestia_energy_chauffe_eau_reserve")
        self.assertNotIn(reserve.state, ("unknown", "unavailable"))
        found = c.data["chauffe_eau"]
        self.assertTrue(found["simulation"])
        self.assertTrue(found["phrase"])
        self.assertAlmostEqual(found["puissance_kw"], 2.4, places=1)
        self.assertAlmostEqual(found["besoin_kwh"], 4.8, places=1)
        self.assertTrue(found["courbe"])
        attributes = self.hass.states.get("binary_sensor.hestia_energy_chauffe_eau").attributes
        self.assertTrue(attributes["simulation"])

    async def test_nothing_is_ever_commanded(self):
        _, c = await self.setup({"chauffe_eau": {"prise": "switch.prise_chauffe_eau"}})
        await self.hass.services.async_call("button", "press", {"entity_id": "button.hestia_energy_chauffe_eau_boost"}, blocking=True)
        await self.hass.services.async_call("select", "select_option", {"entity_id": "select.hestia_energy_chauffe_eau_mode",
                                                                        "option": "automatique"}, blocking=True)
        await self.hass.async_block_till_done()
        c._update_live()
        await self.hass.async_block_till_done()
        self.assertEqual(self.commands, [])
        self.assertEqual(c.heater.mode, "automatique")
        self.assertEqual(c.settings["chauffe_eau"]["prise"], "switch.prise_chauffe_eau")
        self.assertEqual(self.hass.states.get("binary_sensor.hestia_energy_chauffe_eau").state, "on")
        self.assertEqual(c.data["chauffe_eau"]["raison"], "boost")

    async def test_the_interface_gives_the_plan(self):
        _, c = await self.setup()
        found = self.hass.data[API_KEY].water_heater()
        self.assertIn(found["heating"], (True, False))
        self.assertEqual(found["mode"], "simulation")
        self.assertIsInstance(found["plan"], list)

    async def test_a_minute_is_quick(self):
        _, c = await self.setup()
        c.heater.replan()
        began = time.perf_counter()
        c._update_live()
        self.assertLess(time.perf_counter() - began, 0.05)

    async def test_the_advice_to_program_it_goes_once_driven(self):
        _, c = await self.setup({"chauffe_eau": {"mode": "automatique"}})
        self.assertFalse(any(p["id"] == "chauffe_eau_heures" for p in c.data.get("pistes") or []))

    async def test_in_simulation_the_household_tank_is_followed_from_the_heater(self):
        """Frank, 26 Nov. 2026: « hier soir plus d'eau chaude ». In Simulation the reserve shown is his own tank, full
        when the heater stops by itself in the off-peak hours, emptied by the day's draws; the plan's is apart."""
        _, c = await self.setup()
        h, tz = c.heater, c.tz
        night = datetime(2026, 11, 26, 23, 0, tzinfo=tz)
        h.real.kwh, h.real.at = 2.0, night
        h._follow_real(night, tz, 2400.0, 4.8, [(7 * 60, 60), (20 * 60, 60)], 10.0, None)
        for minute in range(1, 8):
            h._follow_real(night + timedelta(minutes=minute), tz, 0.0, 4.8, [(7 * 60, 60), (20 * 60, 60)], 10.0, None)
        self.assertGreater(h.real.kwh, 9.9)
        self.assertIsNotNone(h.real.full_at)
        # Stopped by the end of the off-peak hours (its contactor), not full.
        h.real.kwh, h.real.full_at = 4.0, None
        six = datetime(2026, 11, 27, 5, 55, tzinfo=tz)
        h.real.at = six
        h._follow_real(six, tz, 2400.0, 4.8, [(7 * 60, 60)], 10.0, None)
        for minute in range(6, 14):
            h._follow_real(six + timedelta(minutes=minute), tz, 0.0, 4.8, [(7 * 60, 60)], 10.0, None)
        self.assertLess(h.real.kwh, 10.0)
        self.assertIsNone(h.real.full_at)
        c._update_live()
        self.assertIn("reserve_reelle", c.data["chauffe_eau"])

    async def test_once_driven_there_is_no_second_tank(self):
        _, c = await self.setup({"chauffe_eau": {"mode": "automatique"}})
        self.assertIsNone(c.data["chauffe_eau"]["reserve_reelle"])

    async def test_the_forced_heating_starts_and_stops_from_the_panel(self):
        from custom_components.hestia_energy import websocket
        _, c = await self.setup({"chauffe_eau": {"prise": "switch.prise_chauffe_eau"}})

        class Connection:
            def __init__(self):
                self.results = []

            def send_result(self, _id, result):
                self.results.append(result)

            def send_error(self, _id, code, text):
                self.results.append({"erreur": code})
        handler = websocket.ws_heater_force.__wrapped__ if hasattr(websocket.ws_heater_force, "__wrapped__") else websocket.ws_heater_force
        conn = Connection()
        handler(self.hass, conn, {"id": 1, "type": "hestia_energy/chauffe_eau_force", "arret": False})
        self.assertIsNotNone(conn.results[-1]["force_jusqu_a"])
        self.assertEqual(c.data["chauffe_eau"]["raison"], "boost")
        handler(self.hass, conn, {"id": 2, "type": "hestia_energy/chauffe_eau_force", "arret": True})
        self.assertIsNone(conn.results[-1]["force_jusqu_a"])
        self.assertNotEqual(c.data["chauffe_eau"]["raison"], "boost")
        self.assertEqual(self.commands, [])

    async def test_the_forced_heating_is_counted_apart(self):
        """Frank, 26 Nov. 2026: a forced heating at peak price made « Ce que le plan a coûté » dearer than the off-peak
        hours. It is the household's choice: counted apart, never in the plan nor in its off-peak comparison."""
        _, c = await self.setup({"chauffe_eau": {"mode": "automatique"}})
        h = c.heater
        now = datetime(2026, 11, 26, 20, 0, tzinfo=c.tz)
        h.boost(now)
        h._ledger_at = now
        h._ledger(now + timedelta(minutes=15), 2400.0, 2400.0, {"prix": 0.27})
        day = h.ledger["2026-11-26"]
        self.assertAlmostEqual(day["force_kwh"], 0.6, places=3)
        self.assertAlmostEqual(day["force_eur"], 0.162, places=3)
        self.assertEqual(day["hestia_kwh"], 0.0)
        self.assertEqual(day["hc_eur"], 0.0)
        h.stop_boost()
        h._ledger(now + timedelta(minutes=30), 2400.0, 2400.0, {"prix": 0.27})
        self.assertAlmostEqual(h.ledger["2026-11-26"]["hestia_kwh"], 0.6, places=3)

    async def test_a_full_tank_is_not_kept_on(self):
        _, c = await self.setup({"chauffe_eau": {"mode": "automatique", "prise": "switch.prise_chauffe_eau"}})
        h = c.heater
        h.on = True
        h.tank.kwh = 1000.0     # above any capacity: full
        h.replan()
        c._update_live()
        self.assertNotEqual(c.data["chauffe_eau"]["raison"], "eau_chaude_d_abord")
        self.assertFalse(h.plan.on[0] and h.plan.energy[0] <= 0.01)

    async def test_learning_heats_off_peak_and_says_what_is_left(self):
        _, c = await self.setup({"chauffe_eau": {"mode": "apprentissage", "prise": "switch.prise_chauffe_eau"}})
        found = c.data["chauffe_eau"]
        self.assertFalse(found["simulation"])
        learning = found["apprentissage"]
        self.assertFalse(learning["plein_vu"])
        self.assertFalse(learning["pret"])
        self.assertIn("ballon plein", learning["phrase"])
        self.assertEqual(found["phrase"], learning["phrase"])
        c.heater.tank.full_at = dt_util.utcnow()
        c._update_live()
        self.assertTrue(c.data["chauffe_eau"]["apprentissage"]["pret"])
        self.assertIn("Automatique", c.data["chauffe_eau"]["phrase"])
        self.assertEqual(self.commands, [])


if __name__ == "__main__":
    unittest.main()
