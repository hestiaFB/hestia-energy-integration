"""The blueprint « Piloter le chauffe-eau avec Hestia Énergie »: its templates rendered by a real Home Assistant.
Nothing is commanded in « Simulation »; the fallback only when asked and Hestia Energy silent for 15 minutes."""
from __future__ import annotations

from pathlib import Path
import tempfile
import time
import unittest

try:
    from homeassistant.components.blueprint import schemas
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers import frame
    from homeassistant.helpers.template import Template
    from homeassistant.util.yaml import load_yaml
except ImportError:
    raise unittest.SkipTest("Home Assistant is not installed")

BLUEPRINT = Path(__file__).resolve().parents[1] / "blueprints" / "automation" / "hestia_energy" / "piloter_chauffe_eau.yaml"
PILOT, MODE, PLUG = "binary_sensor.hestia_energy_chauffe_eau", "select.hestia_energy_chauffe_eau_mode", "switch.prise_chauffe_eau"


class Blueprint(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.hass = HomeAssistant(self.temp.name)
        frame.async_setup(self.hass)
        self.blueprint = load_yaml(BLUEPRINT)

    async def asyncTearDown(self):
        await self.hass.async_stop()
        self.temp.cleanup()

    def decide(self, mode, pilot, plug, repli=False, silent_s=0, offpeak_now=True):
        """What the automation would do: « on », « off », or nothing (None)."""
        stamp = time.time() - silent_s
        for entity in (MODE, PILOT):
            self.hass.states.async_remove(entity)
        self.hass.states.async_set(MODE, mode, timestamp=stamp)
        self.hass.states.async_set(PILOT, pilot, timestamp=stamp)
        self.hass.states.async_set(PLUG, plug)
        # The fallback's off-peak hours: the whole day, or none.
        ctx = {"pilote_entite": PILOT, "mode_entite": MODE, "prise_entite": PLUG, "repli": repli,
               "debut_hc": "00:00:00" if offpeak_now else "23:59:58", "fin_hc": "23:59:59"}
        variables = self.blueprint["variables"]
        for key in ("mode_actuel", "absent", "en_hc", "voulu"):
            ctx[key] = Template(str(variables[key]), self.hass).async_render(ctx)
        go = Template(self.blueprint["conditions"][0]["value_template"], self.hass).async_render(ctx)
        return ctx["voulu"] if go else None

    def test_it_is_a_valid_blueprint(self):
        self.assertEqual(schemas.BLUEPRINT_SCHEMA(self.blueprint)["blueprint"]["domain"], "automation")

    def test_nothing_in_simulation(self):
        self.assertIsNone(self.decide("simulation", "on", "off"))
        self.assertIsNone(self.decide("simulation", "off", "on"))

    def test_the_plug_follows_hestia_outside_simulation(self):
        self.assertEqual(self.decide("automatique", "on", "off"), "on")
        self.assertEqual(self.decide("automatique", "off", "on"), "off")
        self.assertEqual(self.decide("heures_creuses", "on", "off"), "on")
        self.assertIsNone(self.decide("automatique", "on", "on"))

    def test_no_fallback_unless_asked(self):
        self.assertIsNone(self.decide("unavailable", "unavailable", "off", repli=False, silent_s=3600))

    def test_the_fallback_waits_15_minutes_then_follows_the_off_peak_hours(self):
        self.assertIsNone(self.decide("unavailable", "unavailable", "off", repli=True, silent_s=300))
        self.assertEqual(self.decide("unavailable", "unavailable", "off", repli=True, silent_s=1200), "on")
        self.assertEqual(self.decide("unavailable", "unavailable", "on", repli=True, silent_s=1200, offpeak_now=False), "off")


if __name__ == "__main__":
    unittest.main()
