"""« Chauffe-eau : chauffer maintenant » (1.0.0b11): until the tank is full (4 hours at most), then the plan again.
In « Simulation », the simulated tank is filled: nothing is commanded."""
from __future__ import annotations

from homeassistant.components.button import ButtonEntity, ButtonEntityDescription
from homeassistant.util import dt as dt_util

from .entity import EnergyEntity

DESCRIPTION = ButtonEntityDescription(key="chauffe_eau_boost", translation_key="chauffe_eau_boost", icon="mdi:water-boiler-alert")


async def async_setup_entry(hass, entry, async_add_entities):
    coordinator = entry.runtime_data
    if coordinator.data.get("chauffe_eau_trouve"):
        async_add_entities([HeaterBoost(coordinator, DESCRIPTION)])


class HeaterBoost(EnergyEntity, ButtonEntity):
    platform_domain = "button"

    async def async_press(self) -> None:
        self.coordinator.heater.boost(dt_util.utcnow())
        self.coordinator._update_live()
