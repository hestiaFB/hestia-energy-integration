"""Hestia Energy: reads Home Assistant's Energy page and its statistics; commands nothing (the water heater is driven
by the household's automation following « Chauffe-eau : chauffer »)."""
from homeassistant.const import Platform
from homeassistant.helpers import config_validation as cv

from .api import HestiaEnergyApi
from .const import API_KEY, DOMAIN
from .coordinator import EnergyCoordinator
from .panel import CARD_URL, async_setup_panel
from .socle import async_remove_card
from .websocket import async_setup_services, async_setup_websocket

PLATFORMS = [Platform.SENSOR, Platform.BINARY_SENSOR, Platform.SELECT, Platform.BUTTON]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass, config):
    # What Hestia Energy publishes for the other bricks (INTERFACE.md § 1.1): there from the start, empty until ready.
    hass.data.setdefault(API_KEY, HestiaEnergyApi(hass))
    async_setup_websocket(hass)
    async_setup_services(hass)
    await async_setup_panel(hass)
    return True


async def async_setup_entry(hass, entry):
    await async_setup_panel(hass)
    coordinator = EnergyCoordinator(hass, entry)
    await coordinator.async_prepare()
    entry.runtime_data = coordinator
    hass.data.setdefault(API_KEY, HestiaEnergyApi(hass)).attach(coordinator)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await coordinator.async_start()
    return True


async def async_unload_entry(hass, entry):
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded and getattr(entry, "runtime_data", None):
        api = hass.data.get(API_KEY)
        if api is not None:
            api.detach(entry.runtime_data)
        await entry.runtime_data.async_stop()
    return unloaded


async def async_remove_entry(hass, entry):
    """The home removed: the card's dashboard resource goes with it."""
    await async_remove_card(hass, CARD_URL)
