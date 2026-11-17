"""Hestia Energy in a real Home Assistant core, fed with Frank's real home: his Energy page, his year of statistics and
a snapshot of his live states (7 Nov. 2026, 13 h 15). Nothing of his home is touched: the Recorder's reads are given
the replay data, the states are set in a Home Assistant that lives only in memory. Skipped without Home Assistant.
"""
from __future__ import annotations

from datetime import timedelta
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

try:
    from homeassistant import loader
    from homeassistant.config_entries import ConfigEntries, ConfigEntry
    from homeassistant.core import CoreState, HomeAssistant
    from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er, frame, issue_registry as ir
    from homeassistant.util import dt as dt_util
except ImportError:
    raise unittest.SkipTest("Home Assistant is not installed")

from replay import HOME, description, hourly, need

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from custom_components.hestia_energy import reader  # noqa: E402
from custom_components.hestia_energy.const import API_KEY, DOMAIN  # noqa: E402

LOCAL = {"opendtu": True, "lixee": True, "puissance_soutirage": True, "echange_reseau": False, "panneaux_": False}
REAL_DETECT = reader.detect


class FranksHome(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        need(HOME / "etats-direct.json")
        self.snapshot = json.loads((HOME / "etats-direct.json").read_text(encoding="utf-8"))
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
        self._states()
        self.patches = [patch.object(reader, name, side) for name, side in (
            ("energy_prefs", self._prefs), ("metadata", self._metadata), ("hourly", self._hourly),
            ("listen_prefs", self._listen), ("is_local", self._local), ("detect", self._detect))]
        for p in self.patches:
            p.start()

    async def asyncTearDown(self):
        for p in self.patches:
            p.stop()
        self.hass.set_state(CoreState.running)
        await self.hass.async_stop()
        self.directory.cleanup()

    # --- Frank's home, as Home Assistant would give it --------------------------------------------------------

    def _states(self):
        """The snapshot's states, each as old as it was when taken (« changed 12 h 40 ago » stays so)."""
        taken = dt_util.parse_datetime(self.snapshot["pris_le"])
        now = dt_util.utcnow()
        for s in self.snapshot["etats"]:
            changed = dt_util.parse_datetime(s["last_changed"])
            self.hass.states.async_set(s["entity_id"], s["state"], s["attributes"], timestamp=(now - (taken - changed)).timestamp())

    async def _prefs(self, hass):
        return description()["page_energie"]

    async def _metadata(self, hass, ids):
        return {i: m for i, m in description()["statistiques"].items() if i in ids}

    async def _hourly(self, hass, ids, start, end=None):
        # The replay's year ends on 7 Nov. 2026 at 8 h: moved by whole days so that it ends before now, each hour
        # keeping its hour of the day (the night stays the night).
        rows = hourly()
        last = max(r["start"] for v in rows.values() for r in v)
        shift = timedelta(days=(dt_util.utcnow() - last).days)
        return {i: [{**r, "start": r["start"] + shift} for r in v if r["start"] + shift >= start] for i, v in rows.items() if i in ids}

    async def _listen(self, hass, callback):
        return lambda: None

    async def _local(self, hass, entity_id):
        return next((v for k, v in LOCAL.items() if k in entity_id), None)

    def _detect(self, hass):
        found = REAL_DETECT(hass)
        # What the entity registry would add (OpenDTU's channels and inverter, tarif_edf's « option_hphc_9kva »).
        found["channels"] = sorted(k for k in hourly() if k.endswith(("_ch1_power", "_ch2_power")))
        found["inverter"] = "sensor.opendtu_8298a8_ac_power"
        found["kva"] = 9
        return found

    async def setup(self):
        from custom_components.hestia_energy import async_setup
        await async_setup(self.hass, {})
        entry = ConfigEntry(domain=DOMAIN, title="Ma maison", data={}, options={}, unique_id="hestia_energy_home", version=1,
                            minor_version=1, source="user", discovery_keys={}, subentries_data=None)
        self.hass.config_entries._entries[entry.entry_id] = entry
        with patch("homeassistant.setup.async_process_deps_reqs", return_value=None):
            await self.hass.config_entries.async_setup(entry.entry_id)
        await self.hass.async_block_till_done()
        self.assertTrue(hasattr(entry, "runtime_data"), f"{entry.state} {entry.reason}")
        coordinator = entry.runtime_data
        await coordinator.async_refresh(full=True)
        await self.hass.async_block_till_done()
        return entry, coordinator

    def state(self, entity_id):
        return self.hass.states.get(entity_id)

    # --- what Frank would see -----------------------------------------------------------------------------------

    async def test_the_entities_of_a_level_3_home(self):
        _, coordinator = await self.setup()
        self.assertEqual(coordinator.data["palier"], 3)
        ids = sorted(s.entity_id for s in self.hass.states.async_all() if s.entity_id.split(".")[1].startswith("hestia_energy_"))
        self.assertIn("sensor.hestia_energy_conseil", ids)
        self.assertIn("binary_sensor.hestia_energy_surplus", ids)
        self.assertNotIn("sensor.hestia_energy_couleur_tempo", ids)   # no Tempo at Frank's

    async def test_the_banner_at_13_h_15(self):
        await self.setup()
        # 1.1 kW sent to the grid, the dryer at 539 W (not a machine yet, under 800 W): the sun is in excess.
        conseil = self.state("sensor.hestia_energy_conseil")
        self.assertEqual(conseil.attributes["id"], "soleil_en_trop")
        self.assertEqual(conseil.attributes["geste"], "1,1 kW partent au réseau pour presque rien.")
        self.assertEqual(self.state("sensor.hestia_energy_couleur").state, "vert")

    async def test_the_period_and_the_price_come_from_the_meter(self):
        await self.setup()
        self.assertEqual(self.state("sensor.hestia_energy_periode").state, "hp")
        self.assertAlmostEqual(float(self.state("sensor.hestia_energy_prix_du_moment").state), 0.2142)
        self.assertEqual(self.state("binary_sensor.hestia_energy_heures_creuses").state, "off")

    async def test_the_arbiter_prefers_opendtu_to_the_late_clamps(self):
        _, coordinator = await self.setup()
        sun = coordinator.data["direct"]["sources"]["soleil"]
        self.assertEqual(sun["retenu"], "Onduleurs (OpenDTU)")
        self.assertAlmostEqual(sun["valeur"], 2083.1)

    async def test_the_reports_and_the_doubts(self):
        await self.setup()
        self.assertEqual(self.state("sensor.hestia_energy_veille").state, "190")
        self.assertEqual(self.state("binary_sensor.hestia_energy_donnee_douteuse").state, "on")
        self.assertNotEqual(self.state("sensor.hestia_energy_cout_du_mois").state, "unknown")

    async def test_the_interface_answers(self):
        await self.setup()
        api = self.hass.data[API_KEY]
        self.assertEqual(api.version, 1)
        self.assertEqual(api.now()["period"], "hp")
        self.assertEqual(api.tariff()["next_period"], "hc")
        self.assertAlmostEqual(api.cost(1.0), 0.1276)                 # sun in excess now: worth the lost resale
        self.assertEqual(api.limits()["max_w"], 8100)
        window = api.best_window(1.0, 120, dt_util.utcnow() + timedelta(hours=20))
        self.assertIn(window["reason"], ("soleil", "heures_creuses"))


    async def test_the_websocket_of_the_card(self):
        await self.setup()
        from custom_components.hestia_energy import websocket

        class Connection:
            def __init__(self):
                self.results, self.errors = {}, {}

            def send_result(self, ident, result):
                self.results[ident] = result

            def send_error(self, ident, code, message):
                self.errors[ident] = code

        connection = Connection()
        websocket.ws_view(self.hass, connection, {"id": 1, "type": "hestia_energy/view"})
        self.assertEqual(connection.results[1]["direct"]["bandeau"]["id"], "soleil_en_trop")
        websocket.ws_detail(self.hass, connection, {"id": 2, "type": "hestia_energy/detail", "rubrique": "veille"})
        self.assertEqual(connection.results[2]["veille"]["w"], 190)
        websocket.ws_sources(self.hass, connection, {"id": 3, "type": "hestia_energy/sources"})
        self.assertEqual(connection.results[3]["format_page"], "2026")
        self.assertTrue(any(c["id"] == "p_unite" for c in connection.results[3]["constats"]))
        websocket.ws_simulate(self.hass, connection, {"id": 4, "type": "hestia_energy/simulate"})
        self.assertEqual(connection.errors[4], "not_supported")

    async def test_the_cards_follow_one_subscription(self):
        """Lot 4 of the audit (9 Nov. 2026): the cards' view whole once, then only what changed, and `reload` when the
        brick stops; the reports' findings stay out of it."""
        entry, coordinator = await self.setup()
        from custom_components.hestia_energy import websocket

        class Connection:
            def __init__(self):
                self.subscriptions, self.events, self.results = {}, [], {}

            def send_result(self, ident, result=None):
                self.results[ident] = result

            def send_message(self, message):
                self.events.append(message["event"])

        connection = Connection()
        websocket.ws_subscribe(self.hass, connection, {"id": 7, "type": "hestia_energy/subscribe"})
        first = connection.events[0]["view"]
        self.assertTrue(first["pret"])
        self.assertNotIn("constats", first)
        self.assertLess(len(json.dumps(first)), len(json.dumps(coordinator.data)) / 2)
        coordinator._notify()                       # nothing changed: nothing sent
        self.assertEqual(len(connection.events), 1)
        coordinator.data["direct"] = {**coordinator.data["direct"], "achat_w": 1234.0}
        coordinator._notify()
        self.assertEqual(set(connection.events[1]["changes"]), {"direct"})
        self.assertTrue(await self.hass.config_entries.async_unload(entry.entry_id))
        self.assertEqual(connection.events[-1], {"version": 1, "reload": True})
        connection.subscriptions[7]()

    async def test_the_hub_tab(self):
        """The Énergie tab of the hub (INTERFACE.md § 5): Frank's sources, devices, settings found, things to mend."""
        import os
        from types import SimpleNamespace
        _, coordinator = await self.setup()
        from custom_components.hestia_energy import websocket

        class Connection:
            user = SimpleNamespace(is_admin=True)

            def __init__(self):
                self.results, self.errors = {}, {}

            def send_result(self, ident, result):
                self.results[ident] = result

            def send_error(self, ident, code, message):
                self.errors[ident] = code

        connection = Connection()
        websocket.ws_hub(self.hass, connection, {"id": 1, "type": "hestia_energy/hub"})
        tab = connection.results[1]
        if os.environ.get("HESTIA_HUB_DUMP"):
            Path(os.environ["HESTIA_HUB_DUMP"]).write_text(json.dumps(tab, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
        ids = [s["id"] for s in tab["sources"]]
        self.assertEqual(ids[:3], ["achat", "revente", "soleil"])
        self.assertIn("eau", ids)
        achat = tab["sources"][0]
        self.assertEqual(achat["groupe"], "Électricité")
        self.assertTrue(achat["origine"])
        devices = {d["nom"]: d for d in tab["appareils"]["liste"]}
        heater = next(d for d in devices.values() if "chauffe" in d["nom"].lower() and "eau" in d["nom"].lower())
        self.assertEqual(heater["groupe"], "eau_chaude")
        washer = next(d for d in devices.values() if "lave" in d["nom"].lower() and "linge" in d["nom"].lower())
        self.assertEqual(washer["a_regler"], "Compté en Wh au lieu de kWh")
        self.assertTrue(any(t["titre"].endswith("compté en Wh") for t in tab["a_regler"]))
        self.assertTrue(all(t.get("page") for t in [*tab["a_regler"], *tab["a_ameliorer"]]))
        self.assertEqual([e["id"] for e in tab["extensions"]][:2], ["meteo", "confort"])
        # A device moved to another group, then the settings found by Hestia.
        await coordinator.async_save_settings({"groups": {heater["stat"]: "reste"}, "offpeak": "00:14-08:19, 12:00-14:00",
                                                "water_price": 4.1})
        websocket.ws_hub(self.hass, connection, {"id": 3, "type": "hestia_energy/hub"})
        moved = next(d for d in connection.results[3]["appareils"]["liste"] if d["stat"] == heater["stat"])
        self.assertEqual((moved["groupe"], moved["groupe_devine"]), ("reste", "eau_chaude"))
        self.assertEqual(len(coordinator.offpeak.ranges), 2)
        websocket.ws_settings(self.hass, connection, {"id": 4, "type": "hestia_energy/settings"})
        found = connection.results[4]["trouve"]
        self.assertEqual(found["option"]["valeur"], "hphc")
        self.assertTrue(found["offpeak"]["valeur"])
        self.assertEqual(connection.results[4]["reglages"]["water_price"], 4.1)

    async def test_the_consumption_source_is_required(self):
        """D21: no consumption meter in the Energy page, no installation (the paths are shown); Frank's home goes on."""
        from custom_components.hestia_energy.config_flow import EnergyConfigFlow

        def flow():
            f = EnergyConfigFlow()
            f.hass, f.context, f.handler, f.flow_id = self.hass, {"source": "user"}, DOMAIN, "test"
            return f

        with patch.object(reader, "energy_prefs", return_value={"energy_sources": [], "device_consumption": []}):
            result = await flow().async_step_user({})
        self.assertEqual(result["type"], "form")
        self.assertEqual(result["errors"], {"base": "no_source"})
        self.assertIn("ha_linky", result["description_placeholders"])
        result = await flow().async_step_user({})
        self.assertEqual(result["type"], "create_entry")
        _, coordinator = await self.setup()
        source = coordinator.data["source"]
        self.assertEqual(len(source["compteurs"]), 2)
        self.assertTrue(source["direct"])        # the LiXee's period is read live
        self.assertEqual(len(source["officielles"]), 3)


    async def test_the_heating_estimated_from_the_cold(self):
        """9.2: with Hestia Weather's degree-days (the station's, moved like the statistics), a figure for this month;
        without Hestia Weather, the rubric says what to add."""
        from replay import degree_days
        rows = hourly()
        last = max(r["start"] for v in rows.values() for r in v)
        shift = timedelta(days=(dt_util.utcnow() - last).days)
        cold = {d + shift: v for d, v in degree_days().items()}

        class Weather:
            version = 1

            def places(self):
                return [{"entry_id": "maison", "title": "Maison"}]

            def add_listener(self, entry_id, update, brick=None):
                return lambda: None

            async def degree_days(self, day, entry_id=None):
                return None if day not in cold or entry_id != "maison" else {"heating": cold[day]}

        _, coordinator = await self.setup()
        self.assertEqual(coordinator.data["chauffage"]["etat"], "sans_meteo")
        self.hass.data["hestia_weather_api"] = Weather()
        await coordinator.async_refresh(full=True)
        heat = coordinator.data["chauffage"]
        self.assertEqual(heat["etat"], "pret")
        self.assertAlmostEqual(heat["par_degre_kwh"], 1.67, delta=0.1)
        self.assertIsNotNone(heat["mois"])
        # The replay's year starts on 7 Nov. 2025: last winter is known from November only, so it is not shown.
        self.assertIsNone(heat["hiver_dernier"])
        # The card's one period: the season, from 1 October; and what a degree of cold costs a day.
        self.assertTrue(heat["saison"]["du"].endswith("-10-01"))
        self.assertGreaterEqual(heat["saison"]["kwh"], heat["mois"]["kwh"])
        self.assertGreater(heat["euros_par_degre"], 0.2)

    async def test_what_the_detail_cards_read(self):
        """Maquette des cartes 2 (INTERFACE.md § 4.2): one period per card, every figure from the view."""
        _, coordinator = await self.setup()
        d = coordinator.data
        # The sun: the strongest hour today, each group of panels (an inverter's two channels together).
        self.assertIsNotNone(d["soleil_jour"]["plus_fort"])
        self.assertEqual(len(d["soleil_jour"]["groupes"]), 5)
        # The night: the measured devices at the quietest hours, and the rest that no plug measures.
        night = d["veille"]["nuit"]
        self.assertTrue(night["appareils"])
        self.assertLessEqual(night["mesure_w"], d["veille"]["w"] + 30)
        self.assertIsNotNone(d["veille"]["evolution"])
        # The contract this month: off-peak share, the Base option's euros, the break-even share.
        c = d["contrat"]
        self.assertTrue(0 < c["part_hc"] < 1)
        self.assertIsNotNone(c["base_euros"])
        self.assertTrue(0 < c["seuil_hc"] < 1)
        # The peak today, against the 9 kVA.
        self.assertLess(d["pointe"]["part"], 1)
        # The devices today: never more than the whole home.
        a = d["appareils_jour"]
        self.assertLessEqual(a["mesure_kwh"], a["maison_kwh"] + 0.1)
        self.assertFalse(any(r["nom"].startswith("sensor.") for r in a["appareils"]))

    async def test_the_reviews_are_sent_only_when_asked(self):
        """2.9: no notify service chosen, nothing sent; chosen, yesterday's review once at the chosen hour."""
        sent = []

        async def notify(call):
            sent.append(dict(call.data))

        self.hass.services.async_register("notify", "telephone", notify)
        _, coordinator = await self.setup()
        self.assertTrue(coordinator.data["bilans"])
        await coordinator._send_reviews()
        self.assertEqual(sent, [])
        hour = dt_util.now(coordinator.tz).hour
        await coordinator.async_save_settings({"notify_service": "notify.telephone", "notify_hour": hour})
        await coordinator._send_reviews()
        await coordinator._send_reviews()            # the same day: once
        await self.hass.async_block_till_done()
        self.assertGreaterEqual(len(sent), 1)
        self.assertTrue(sent[0]["title"].startswith("Hier : "))

    async def test_the_bills_follow_enedis(self):
        """Decided on 7 Nov. 2026: with HA Linky's statistics (outside the page), the bills follow Enedis's days."""
        import gzip
        import json
        from datetime import datetime as dt, timezone as tz
        from replay import HOME
        need(HOME / "ha-linky.json.gz")
        raw = json.load(gzip.open(HOME / "ha-linky.json.gz", "rt"))
        sid = next(k for k in raw["lignes"] if k.split(":")[0] == "linky")
        linky = [{"start": dt.fromtimestamp(r["start"] / 1000, tz.utc), "sum": r["sum"], "mean": None, "min": None, "max": None}
                 for r in raw["lignes"][sid]]
        page_hourly = self._hourly

        async def with_linky(hass, ids, start, end=None):
            found = await page_hourly(hass, ids, start, end)
            if "linky:test" in ids:
                rows = hourly()
                last = max(r["start"] for v in rows.values() for r in v)
                shift = timedelta(days=(dt_util.utcnow() - last).days)
                found["linky:test"] = [{**r, "start": r["start"] + shift} for r in linky if r["start"] + shift >= start]
            return found

        async def reference(hass):
            return {"achats": "linky:test"}

        with patch.object(reader, "hourly", with_linky), patch.object(reader, "reference_statistics", reference):
            _, coordinator = await self.setup()
            followed = coordinator.home
            raw_home = coordinator.home_raw
        from engine import stats
        from zoneinfo import ZoneInfo
        days_f, days_r = stats.days(followed.bought, ZoneInfo("Europe/Paris")), stats.days(raw_home.bought, ZoneInfo("Europe/Paris"))
        common = [d for d in days_f if d in days_r and days_r[d].complete]
        self.assertGreater(sum(days_f[d].kwh for d in common), sum(days_r[d].kwh for d in common) * 1.02)
        self.assertTrue(any(c["id"] == "p_reference_ecart" for c in coordinator.data["constats"]))

    async def test_an_unloaded_home_leaves_nothing_behind(self):
        """Audit of 9 Nov. 2026: unloaded, the brick stops listening, gives the other bricks nothing, and a report still
        under way never follows the live entities again."""
        entry, coordinator = await self.setup()
        api = self.hass.data[API_KEY]
        self.assertIs(api.coordinator, coordinator)
        self.assertIsNotNone(coordinator._live_unsub)
        self.assertTrue(await self.hass.config_entries.async_unload(entry.entry_id))
        self.assertIsNone(api.coordinator)
        self.assertIsNone(api.tariff())
        self.assertIsNone(coordinator._live_unsub)
        self.assertEqual(coordinator._listeners, [])
        await coordinator.async_refresh(full=False)
        self.assertIsNone(coordinator._live_unsub)

    async def test_a_failing_report_keeps_the_last_figures(self):
        """A report that fails (an unforeseen value) keeps what was shown, and is tried again five minutes later."""
        from custom_components.hestia_energy.engine import home as engine_home
        _, coordinator = await self.setup()
        shown = coordinator.data["mois"]
        with patch.object(engine_home, "build", side_effect=ValueError("donnée imprévue")), \
                self.assertLogs("custom_components.hestia_energy.coordinator", "ERROR"):
            await coordinator.async_refresh(full=True)
        self.assertTrue(coordinator.data["pret"])
        self.assertEqual(coordinator.data["mois"], shown)
        self.assertIsNotNone(coordinator._retry)
        await coordinator.async_refresh(full=False)
        self.assertFalse(coordinator._failed)


class EnergyPageListener(unittest.IsolatedAsyncioTestCase):
    """The Energy page keeps its listeners for good: the brick's relay holds it weakly and leaves the list at unload."""

    async def test_the_listener_goes_with_the_brick(self):
        import gc

        class Manager:
            def __init__(self):
                self._update_listeners = []

            def async_listen_updates(self, listener):
                self._update_listeners.append(listener)

        class Brick:
            def __init__(self):
                self.calls = 0

            async def changed(self):
                self.calls += 1

        manager, brick = Manager(), Brick()

        async def get_manager(hass):
            return manager

        with patch("homeassistant.components.energy.data.async_get_manager", get_manager):
            stop = await reader.listen_prefs(None, brick.changed)
        await manager._update_listeners[0]()
        self.assertEqual(brick.calls, 1)
        relay = manager._update_listeners[0]
        stop()
        self.assertEqual(manager._update_listeners, [])
        await relay()
        self.assertEqual(brick.calls, 1)
        # Even left in the list, the relay never keeps the brick alive.
        with patch("homeassistant.components.energy.data.async_get_manager", get_manager):
            await reader.listen_prefs(None, Brick().changed)
        gc.collect()
        await manager._update_listeners[0]()


if __name__ == "__main__":
    unittest.main()
