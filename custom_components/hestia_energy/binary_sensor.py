"""The binary sensors of INTERFACE.md § 1.2: off-peak hours, surplus, peak near the breaker, doubtful data, and since
1.0.1b1 « Chauffe-eau : chauffer » (docs/chauffe-eau.md), which the household's automation follows."""
from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass

from homeassistant.components.binary_sensor import BinarySensorEntity, BinarySensorEntityDescription

from .entity import EnergyEntity

SURPLUS_W = 1000
NEAR_BREAKER = 0.95


@dataclass(frozen=True, kw_only=True)
class EnergyBinaryDescription(BinarySensorEntityDescription):
    value: Callable[[dict], bool | None]
    attributes: Callable[[dict], dict] = lambda d: {}
    exists: Callable[[dict], bool] = lambda d: True


def _direct(d: dict) -> dict:
    return d.get("direct") or {}


def _peak(d: dict) -> bool | None:
    bought, kva = _direct(d).get("achat_w"), (d.get("contrat") or {}).get("kva")
    return None if bought is None or not kva else bought >= NEAR_BREAKER * kva * 1000


def _doubtful(d: dict) -> list[dict]:
    """What the panel lists as doubtful: what « À régler » lists, and the sources set aside live."""
    live = [{"quoi": e["source"], "raison": e["raison"]} for v in (_direct(d).get("sources") or {}).values()
            for e in v.get("ecartes", []) if e["raison"] in ("fige", "muet", "indisponible")]
    return list(d.get("a_regler") or []) + live


def _heater(d: dict) -> dict:
    return d.get("chauffe_eau") or {}


def _heater_attributes(d: dict) -> dict:
    h = _heater(d)
    return {"mode": h.get("mode"), "simulation": h.get("simulation"), "raison": h.get("raison"), "phrase": h.get("phrase"),
            "jusqu_a": h.get("jusqu_a"), "prochaine_chauffe": h.get("prochaine_chauffe"), "reserve": h.get("reserve"),
            "plan": h.get("plan"), "kwh_prevus": h.get("kwh_prevus"), "cout_prevu": h.get("cout_prevu")}


BINARIES = (
    EnergyBinaryDescription(
        key="heures_creuses", translation_key="heures_creuses",
        value=lambda d: None if _direct(d).get("periode") is None else _direct(d)["periode"] == "hc",
        attributes=lambda d: {"fin": (_direct(d).get("prochain_changement") or {}).get("a") if _direct(d).get("periode") == "hc" else None},
        exists=lambda d: (d.get("contrat") or {}).get("option") != "base"),
    EnergyBinaryDescription(
        key="surplus", translation_key="surplus",
        value=lambda d: None if _direct(d).get("revente_w") is None else _direct(d)["revente_w"] >= SURPLUS_W,
        attributes=lambda d: {"w": _direct(d).get("revente_w"), "jusqu_a": None},
        exists=lambda d: (d.get("equipement") or {}).get("soleil", False)),
    EnergyBinaryDescription(
        key="pointe_proche", translation_key="pointe_proche", value=_peak,
        attributes=lambda d: {"w": _direct(d).get("achat_w"),
                              "max_w": None if not (d.get("contrat") or {}).get("kva") else d["contrat"]["kva"] * 1000},
        exists=lambda d: (d.get("equipement") or {}).get("direct", False)),
    EnergyBinaryDescription(
        key="donnee_douteuse", translation_key="donnee_douteuse", value=lambda d: bool(_doubtful(d)),
        attributes=lambda d: {"quoi": _doubtful(d)[:20], "nombre": len(_doubtful(d))}),
    # On in « Simulation » too (its history shows what Hestia would have done); the blueprint follows it only outside it.
    EnergyBinaryDescription(
        key="chauffe_eau", translation_key="chauffe_eau", icon="mdi:water-boiler",
        value=lambda d: None if not _heater(d) else bool(_heater(d).get("chauffer")),
        attributes=_heater_attributes, exists=lambda d: bool(d.get("chauffe_eau_trouve"))),
)


async def async_setup_entry(hass, entry, async_add_entities):
    coordinator = entry.runtime_data
    async_add_entities(EnergyBinary(coordinator, d) for d in BINARIES if d.exists(coordinator.data))


class EnergyBinary(EnergyEntity, BinarySensorEntity):
    entity_description: EnergyBinaryDescription
    platform_domain = "binary_sensor"

    @property
    def is_on(self):
        return self.entity_description.value(self.coordinator.data)

    @property
    def extra_state_attributes(self):
        return self.entity_description.attributes(self.coordinator.data)
