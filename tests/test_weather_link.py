"""The link with Hestia Weather (its interface `hestia_weather_api`, version 1): which place gives the cold, the
version checked, Énergie said linked to that place, and every reason for no cold said instead of left silent.

Hestia Weather is played by a fake that answers like its interface: with several places and no place asked, no
degree-days (the fault of 17 Nov. 2026). Skipped without Home Assistant.
"""
from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from pathlib import Path
import sys
from types import SimpleNamespace
import unittest

try:
    import homeassistant  # noqa: F401
except ImportError:
    raise unittest.SkipTest("Home Assistant is not installed")

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from custom_components.hestia_energy import coordinator as coordinator_module, hub_view, reader  # noqa: E402
from custom_components.hestia_energy.websocket import KEYS, SETTINGS  # noqa: E402

TODAY = date(2026, 11, 17)


class Weather:
    """Hestia Weather's interface as it answers (api.py): a place found by its entry id, or the only one."""

    version = 1

    def __init__(self, places=("maison",), cold=None):
        self._places = list(places)
        self.cold = cold if cold is not None else {p: 5.0 for p in places}
        self.asked: list = []
        self.links: dict = {}

    def places(self):
        return [{"entry_id": p, "title": p.capitalize()} for p in self._places]

    def _entry(self, entry_id):
        if entry_id:
            return entry_id if entry_id in self._places else None
        return self._places[0] if len(self._places) == 1 else None

    async def degree_days(self, day, entry_id=None):
        self.asked.append((day, entry_id))
        place = self._entry(entry_id)
        value = self.cold.get(place) if place else None
        return None if value is None else {"entry_id": place, "heating": value}

    def add_listener(self, entry_id, update, brick=None):
        place = self._entry(entry_id)
        if place is None:
            return lambda: None
        key = (place, brick or "")
        self.links[key] = self.links.get(key, 0) + 1

        def stop():
            self.links[key] -= 1
        return stop


def _hass(api=None, components=("hestia_weather",)):
    return SimpleNamespace(data={} if api is None else {reader.WEATHER_API: api},
                           config=SimpleNamespace(components=set(components)))


class WhichPlace(unittest.TestCase):
    def test_without_weather(self):
        self.assertEqual(reader.weather_place(_hass())["etat"], "non")

    def test_another_version_is_not_used(self):
        api = Weather()
        api.version = 2
        self.assertEqual(reader.weather_place(_hass(api))["etat"], "incompatible")
        self.assertIsNone(reader.weather_api(_hass(api)))

    def test_too_old_for_the_degree_days(self):
        class Old:
            version = 1

            def places(self):
                return [{"entry_id": "maison", "title": "Maison"}]
        self.assertEqual(reader.weather_place(_hass(Old()))["etat"], "ancienne")

    def test_no_place_set_up(self):
        self.assertEqual(reader.weather_place(_hass(Weather(places=())))["etat"], "sans_lieu")

    def test_the_only_place(self):
        found = reader.weather_place(_hass(Weather()))
        self.assertEqual((found["etat"], found["lieu"], found["nom"], found["choisi"]), ("oui", "maison", "Maison", True))

    def test_several_places_the_first_until_one_is_chosen(self):
        hass = _hass(Weather(places=("maison", "chalet")))
        found = reader.weather_place(hass)
        self.assertEqual((found["lieu"], found["choisi"], len(found["lieux"])), ("maison", False, 2))
        found = reader.weather_place(hass, "chalet")
        self.assertEqual((found["lieu"], found["nom"], found["choisi"]), ("chalet", "Chalet", True))
        # A place chosen then removed from Weather: the first again, and the choice offered again.
        found = reader.weather_place(hass, "parti")
        self.assertEqual((found["lieu"], found["choisi"]), ("maison", False))


class TheDegreeDays(unittest.IsolatedAsyncioTestCase):
    async def test_asked_for_the_place_even_with_several(self):
        """The fault: with two places, a day asked without its place gave nothing. Asked with it, it is given."""
        api = Weather(places=("maison", "chalet"), cold={"maison": 6.2, "chalet": 11.0})
        days = [TODAY - timedelta(days=i) for i in range(3)]
        self.assertIsNone(await api.degree_days(days[0]))       # what Énergie asked before
        found = await reader.degree_days(_hass(api), days, "chalet")
        self.assertEqual(found, {d: 11.0 for d in days})
        self.assertTrue(all(place == "chalet" for _, place in api.asked[1:]))

    async def test_nothing_asked_without_a_place_or_another_version(self):
        api = Weather()
        self.assertEqual(await reader.degree_days(_hass(api), [TODAY], None), {})
        api.version = 2
        self.assertEqual(await reader.degree_days(_hass(api), [TODAY], "maison"), {})
        self.assertEqual(api.asked, [])


class Listening(unittest.TestCase):
    def test_said_linked_to_the_place(self):
        api = Weather(places=("maison", "chalet"))
        stop = reader.weather_listen(_hass(api), "chalet", lambda: None)
        self.assertEqual(api.links, {("chalet", "hestia_energy"): 1})
        stop()
        self.assertEqual(api.links[("chalet", "hestia_energy")], 0)

    def test_not_listened_with_another_version(self):
        api = Weather()
        api.version = 2
        reader.weather_listen(_hass(api), "maison", lambda: None)()
        self.assertEqual(api.links, {})


class _Store:
    def __init__(self):
        self.saved = None

    async def async_save(self, data):
        self.saved = data


def _coordinator(hass, settings=None, cold=None, kept_place=None):
    """The coordinator's Weather part only: its own state, without starting the brick."""
    c = coordinator_module.EnergyCoordinator.__new__(coordinator_module.EnergyCoordinator)
    c.hass, c.tz, c.cold_store = hass, timezone.utc, _Store()
    c.settings = {**coordinator_module.DEFAULTS, **(settings or {})}
    c.cold, c._cold_asked, c._cold_place = dict(cold or {}), {}, kept_place
    c.weather, c.weather_cold, c._weather_stop, c._stopped = {}, "non", None, False
    c.data = {}
    return c


class TheCoordinator(unittest.IsolatedAsyncioTestCase):
    NOW = datetime(2026, 11, 17, 12, tzinfo=timezone.utc)

    async def test_the_chosen_place_gives_the_cold_and_is_linked(self):
        api = Weather(places=("maison", "chalet"), cold={"maison": 6.0, "chalet": 11.0})
        c = _coordinator(_hass(api), {"weather_place": "chalet"})
        c._follow_weather()
        self.assertEqual(c.weather_cold, "oui")
        self.assertEqual(api.links, {("chalet", "hestia_energy"): 1})
        await c._fetch_cold(self.NOW)
        self.assertEqual(set(c.cold.values()), {11.0})
        self.assertEqual(c.cold_store.saved["lieu"], "chalet")
        # Listened to again at the next refresh, never twice at once.
        c._follow_weather()
        self.assertEqual(api.links, {("chalet", "hestia_energy"): 1})

    async def test_another_place_reads_the_cold_again(self):
        api = Weather(places=("maison", "chalet"), cold={"maison": 6.0, "chalet": 11.0})
        c = _coordinator(_hass(api), {"weather_place": "maison"}, cold={TODAY - timedelta(days=5): 11.0}, kept_place="chalet")
        c._follow_weather()
        await c._fetch_cold(self.NOW)
        self.assertEqual(set(c.cold.values()), {6.0})
        self.assertEqual(c.cold_store.saved["lieu"], "maison")

    async def test_cold_kept_before_the_place_was_said_is_kept(self):
        """Kept before 17 Nov. 2026 (no « lieu »): adopted for the place found, not read again."""
        api = Weather(cold={"maison": None})
        old = {TODAY - timedelta(days=5): 9.0}
        c = _coordinator(_hass(api), cold=old)
        c._follow_weather()
        await c._fetch_cold(self.NOW)
        self.assertEqual(c.cold, old)
        self.assertEqual(c.cold_store.saved, {"lieu": "maison", (TODAY - timedelta(days=5)).isoformat(): 9.0})

    async def test_switched_off_nothing_is_read_nor_linked(self):
        api = Weather()
        c = _coordinator(_hass(api), {"extensions": {"meteo": False}})
        c._follow_weather()
        await c._fetch_cold(self.NOW)
        self.assertEqual((c.weather_cold, api.asked, api.links), ("non", [], {}))

    def test_the_heating_says_why_there_is_no_cold(self):
        local = self.NOW
        c = _coordinator(_hass(Weather()))
        c._stove = lambda _local: None
        c.weather = {"nom": "Maison"}
        for state, said in (("non", "sans_meteo"), ("ancienne", "meteo_ancienne"), ("incompatible", "meteo_incompatible"),
                            ("sans_lieu", "meteo_sans_lieu")):
            self.assertEqual(c._heating(None, local, None, state)["etat"], said)
        # Weather there, but no past day given (no temperature sensor at that place): said, not « learning » for ever.
        c.cold = {TODAY: 5.0}
        self.assertEqual(c._heating(None, local, None, "oui")["etat"], "meteo_sans_donnees")


class TheHub(unittest.TestCase):
    def _c(self, state, weather=None, heating=None, used=True):
        return SimpleNamespace(weather_cold=state, weather=weather or {}, data={"chauffage": heating} if heating else {},
                               used=lambda key: used)

    def test_each_fault_is_said(self):
        hass = _hass(Weather())
        for state in ("incompatible", "ancienne", "sans_lieu"):
            self.assertEqual(hub_view.weather_problem(hass, self._c(state))["titre"], hub_view.WEATHER_PROBLEMS[state][0])
        found = hub_view.weather_problem(hass, self._c("oui", {"nom": "Maison", "choisi": True}, {"etat": "meteo_sans_donnees"}))
        self.assertIn("« Maison »", found["texte"])

    def test_several_places_not_chosen(self):
        weather = {"nom": "Maison", "choisi": False, "lieux": [{}, {}]}
        found = hub_view.weather_problem(_hass(Weather()), self._c("oui", weather, {"etat": "pret"}))
        self.assertIn("« Maison »", found["texte"])
        self.assertIsNone(hub_view.weather_problem(_hass(Weather()), self._c("oui", {**weather, "choisi": True}, {"etat": "pret"})))

    def test_nothing_said_without_weather_or_switched_off(self):
        self.assertIsNone(hub_view.weather_problem(_hass(components=()), self._c("non")))
        self.assertIsNone(hub_view.weather_problem(_hass(Weather()), self._c("sans_lieu", used=False)))

    def test_the_place_is_a_setting(self):
        self.assertIn("weather_place", KEYS)
        self.assertEqual(SETTINGS({"weather_place": "abc123"}), {"weather_place": "abc123"})
        self.assertEqual(SETTINGS({"weather_place": None}), {"weather_place": None})


if __name__ == "__main__":
    unittest.main()
