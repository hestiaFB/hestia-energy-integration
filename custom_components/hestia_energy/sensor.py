"""The sensors of INTERFACE.md § 1.2: stable ids `<entry>_<clé>`, values read from the coordinator, never computed here.

A sensor whose level is not reached is not created (no Tempo, no Tempo sensors), decided on the Energy page alone at
start; a value not known is « unknown », never zero (principle 4).
"""
from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorEntityDescription, SensorStateClass
from homeassistant.const import UnitOfPower

from .entity import EnergyEntity


@dataclass(frozen=True, kw_only=True)
class EnergySensorDescription(SensorEntityDescription):
    value: Callable[[dict], object]
    attributes: Callable[[dict], dict] = lambda d: {}
    exists: Callable[[dict], bool] = lambda d: True


def _direct(d: dict) -> dict:
    return d.get("direct") or {}


def _banner(d: dict) -> dict:
    return _direct(d).get("bandeau") or {}


def _r(value, n=2):
    return None if value is None else round(value, n)


def _when(iso: str | None):
    return None if not iso else datetime.fromisoformat(iso)


def _max_w(d: dict):
    kva = (d.get("contrat") or {}).get("kva")
    return None if not kva else round(kva * 1000 * (1 - d.get("marge", 0.1)))


SENSORS = (
    EnergySensorDescription(
        key="puissance_maison", translation_key="puissance_maison", device_class=SensorDeviceClass.POWER,
        native_unit_of_measurement=UnitOfPower.WATT, state_class=SensorStateClass.MEASUREMENT,
        value=lambda d: _r(_direct(d).get("maison_w"), 0),
        attributes=lambda d: {"source": ((_direct(d).get("sources") or {}).get("achat") or {}).get("retenu"), "estime": False},
        exists=lambda d: (d.get("equipement") or {}).get("direct", False)),
    EnergySensorDescription(
        key="puissance_max_autorisee", translation_key="puissance_max_autorisee", device_class=SensorDeviceClass.POWER,
        native_unit_of_measurement=UnitOfPower.WATT, value=_max_w,
        attributes=lambda d: {"souscrite": (d.get("contrat") or {}).get("kva"), "marge": d.get("marge", 0.1), "heures_rouges": None},
        exists=lambda d: (d.get("equipement") or {}).get("direct", False)),
    EnergySensorDescription(
        key="prix_du_moment", translation_key="prix_du_moment", native_unit_of_measurement="EUR/kWh",
        value=lambda d: _r(_direct(d).get("prix"), 4),
        attributes=lambda d: {"periode": _direct(d).get("periode"), "couleur": _direct(d).get("couleur"),
                              "prochain_changement": (_direct(d).get("prochain_changement") or {}).get("a")}),
    EnergySensorDescription(
        key="periode", translation_key="periode", device_class=SensorDeviceClass.ENUM, options=["hp", "hc", "base"],
        value=lambda d: _direct(d).get("periode"), attributes=lambda d: {"heures_creuses": d.get("heures_creuses")}),
    EnergySensorDescription(
        key="cout_du_jour", translation_key="cout_du_jour", device_class=SensorDeviceClass.MONETARY,
        native_unit_of_measurement="EUR", value=lambda d: (d.get("jour") or {}).get("euros"),
        attributes=lambda d: {"kwh": (d.get("jour") or {}).get("kwh_achetes"), "revente": (d.get("jour") or {}).get("revendu_euros"),
                              "heures_inconnues": (d.get("jour") or {}).get("heures_inconnues")}),
    EnergySensorDescription(
        key="cout_du_mois", translation_key="cout_du_mois", device_class=SensorDeviceClass.MONETARY,
        native_unit_of_measurement="EUR", value=lambda d: (d.get("mois") or {}).get("euros"),
        attributes=lambda d: {"kwh": (d.get("mois") or {}).get("kwh_achetes"), "revente": (d.get("mois") or {}).get("revendu_euros"),
                              "projection": _r(d.get("projection"), 0)}),
    EnergySensorDescription(
        key="part_du_soleil", translation_key="part_du_soleil", native_unit_of_measurement="%",
        state_class=SensorStateClass.MEASUREMENT, value=lambda d: (d.get("jour") or {}).get("soleil_couvre"),
        attributes=lambda d: {"garde_hier": (d.get("hier") or {}).get("soleil_garde")},
        exists=lambda d: (d.get("equipement") or {}).get("soleil", False)),
    EnergySensorDescription(
        key="conseil", translation_key="conseil", value=lambda d: _banner(d).get("titre"),
        attributes=lambda d: {"id": _banner(d).get("id"), "couleur": _banner(d).get("couleur"),
                              "geste": _banner(d).get("pourquoi"), "pastille": _banner(d).get("pastille")}),
    EnergySensorDescription(
        key="couleur", translation_key="couleur", device_class=SensorDeviceClass.ENUM, options=["bleu", "vert", "orange", "rouge"],
        value=lambda d: _banner(d).get("couleur")),
    EnergySensorDescription(
        key="veille", translation_key="veille", device_class=SensorDeviceClass.POWER, native_unit_of_measurement=UnitOfPower.WATT,
        value=lambda d: (d.get("veille") or {}).get("w"),
        attributes=lambda d: {"euros_par_an": _r((d.get("veille") or {}).get("euros_par_an"), 0),
                              "nuits": (d.get("veille") or {}).get("nuits"), "hausse": d.get("veille_hausse")}),
    EnergySensorDescription(
        key="couleur_tempo", translation_key="couleur_tempo", device_class=SensorDeviceClass.ENUM, options=["bleu", "blanc", "rouge"],
        value=lambda d: _direct(d).get("couleur"), exists=lambda d: bool((d.get("extensions") or {}).get("tempo_today"))),
    EnergySensorDescription(
        key="couleur_tempo_demain", translation_key="couleur_tempo_demain", device_class=SensorDeviceClass.ENUM,
        options=["bleu", "blanc", "rouge"], value=lambda d: _direct(d).get("couleur_demain"),
        exists=lambda d: bool((d.get("extensions") or {}).get("tempo_tomorrow"))),
    # The water heater driven by Hestia (1.0.0b11, docs/chauffe-eau.md).
    EnergySensorDescription(
        key="chauffe_eau_reserve", translation_key="chauffe_eau_reserve", native_unit_of_measurement="%",
        state_class=SensorStateClass.MEASUREMENT, icon="mdi:water-percent",
        value=lambda d: (d.get("chauffe_eau") or {}).get("reserve"),
        attributes=lambda d: {k: (d.get("chauffe_eau") or {}).get(k) for k in ("reserve_kwh", "capacite_kwh", "besoin_kwh", "plein_le")},
        exists=lambda d: bool(d.get("chauffe_eau_trouve"))),
    EnergySensorDescription(
        key="chauffe_eau_prochaine", translation_key="chauffe_eau_prochaine", device_class=SensorDeviceClass.TIMESTAMP,
        value=lambda d: _when((d.get("chauffe_eau") or {}).get("prochaine_chauffe")),
        attributes=lambda d: {"plan": (d.get("chauffe_eau") or {}).get("plan")},
        exists=lambda d: bool(d.get("chauffe_eau_trouve"))),
)


async def async_setup_entry(hass, entry, async_add_entities):
    coordinator = entry.runtime_data
    async_add_entities(EnergySensor(coordinator, d) for d in SENSORS if d.exists(coordinator.data))


class EnergySensor(EnergyEntity, SensorEntity):
    entity_description: EnergySensorDescription

    @property
    def native_value(self):
        return self.entity_description.value(self.coordinator.data)

    @property
    def extra_state_attributes(self):
        return self.entity_description.attributes(self.coordinator.data)
