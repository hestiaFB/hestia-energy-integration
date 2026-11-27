"""Stable keys of Hestia Energy."""
DOMAIN = "hestia_energy"
# The released number, written here and not read from manifest.json: no file is opened when Home Assistant imports the
# module. The panel and the card are cached by their version, so tests/test_version.py checks it follows the manifest.
VERSION = "1.0.1b7"
# What Hestia Energy publishes for the other bricks (docs/INTERFACE.md): hass.data[API_KEY], version API_VERSION.
API_KEY = "hestia_energy_api"
API_VERSION = 1
# The one config entry: the home.
HOME_UNIQUE_ID = "hestia_energy_home"
