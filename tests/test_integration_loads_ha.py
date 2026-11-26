"""The integration imports and answers under a real Home Assistant (skipped without it)."""
from pathlib import Path
import sys
import tempfile
from types import SimpleNamespace
import unittest

try:
    from homeassistant.core import HomeAssistant
except ImportError:
    raise unittest.SkipTest("Home Assistant is not installed")

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from custom_components.hestia_energy import config_flow, panel  # noqa: E402
import custom_components.hestia_energy as integration  # noqa: E402


class Loads(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.hass = HomeAssistant(self.temp.name)

    async def asyncTearDown(self):
        await self.hass.async_stop()
        self.temp.cleanup()

    async def test_setup_without_a_frontend_is_quiet(self):
        self.assertTrue(await integration.async_setup(self.hass, {}))

    async def test_the_hub_says_it_is_not_enabled_yet(self):
        self.hass.config_entries = SimpleNamespace(async_entries=lambda domain: [])
        status = await panel.energy_status(self.hass)
        self.assertEqual(status["level"], "action")

    def test_one_home_one_entry(self):
        self.assertEqual(config_flow.EnergyConfigFlow.VERSION, 1)
        # Contrat is gone (INTERFACE.md § 5, H1); Appareils is hidden without devices.
        self.assertEqual([m[0] for m in panel.MENU], ["", "sources", "appareils", "chauffe-eau", "reglages", "extensions", "bilan", "a-propos"])
        self.assertNotIn("appareils", [m[0] for m in panel.MENU_NO_DEVICES])
        self.assertNotIn("chauffe-eau", [m[0] for m in panel.MENU_NO_DEVICES])


if __name__ == "__main__":
    unittest.main()
