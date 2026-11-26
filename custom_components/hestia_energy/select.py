"""« Chauffe-eau : mode » (1.0.1b1, docs/chauffe-eau.md): Simulation (the default: nothing is commanded), Automatique,
Heures creuses seules, Vacances. A setting of Hestia Energy itself, kept with the others."""
from __future__ import annotations

from homeassistant.components.select import SelectEntity, SelectEntityDescription

from .engine import water_heater as wh
from .entity import EnergyEntity

DESCRIPTION = SelectEntityDescription(key="chauffe_eau_mode", translation_key="chauffe_eau_mode", icon="mdi:water-boiler-auto",
                                      options=list(wh.MODES))


async def async_setup_entry(hass, entry, async_add_entities):
    coordinator = entry.runtime_data
    if coordinator.data.get("chauffe_eau_trouve"):
        async_add_entities([HeaterMode(coordinator, DESCRIPTION)])


class HeaterMode(EnergyEntity, SelectEntity):
    platform_domain = "select"

    @property
    def current_option(self) -> str:
        return self.coordinator.heater.mode

    async def async_select_option(self, option: str) -> None:
        if option not in wh.MODES:
            return
        own = dict(self.coordinator.settings.get("chauffe_eau") or {})
        own["mode"] = option
        await self.coordinator.async_save_settings({"chauffe_eau": own}, wait=False)
        self.coordinator._update_live()
