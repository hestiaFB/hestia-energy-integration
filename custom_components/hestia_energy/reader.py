"""What Hestia Energy reads in Home Assistant, and nothing else: the Energy page, the long-term statistics, the states.

Read only (principle 1): no statistic, entity or setting of Home Assistant is ever written here. Every Recorder read
runs in the Recorder's own thread; a Recorder that cannot answer gives empty rows, never an exception to the caller.
"""
from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
import re
import weakref

from homeassistant.components.recorder import get_instance, statistics
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er
from homeassistant.loader import async_get_integration, async_get_loaded_integration

from .engine.rows import Rows

_LOGGER = logging.getLogger(__name__)
# Units the statistics are read in, whatever the sensor's own (a meter in Wh comes in kWh).
UNITS = {"energy": "kWh", "power": "W", "volume": "L", "volume_flow_rate": "L/min", "mass": "kg"}


async def energy_prefs(hass: HomeAssistant) -> dict | None:
    """The Energy page as `energy/get_prefs` gives it, or None when it was never filled."""
    try:
        from homeassistant.components.energy.data import async_get_manager
        manager = await async_get_manager(hass)
    except Exception as err:  # noqa: BLE001 - no Energy page: the brick says what to do, it does not stop
        _LOGGER.debug("Energy page unavailable: %s", err)
        return None
    return dict(manager.data) if manager.data else None


async def listen_prefs(hass: HomeAssistant, callback) -> Callable[[], None]:
    """Call `callback` (a coroutine function) when the Energy page changes; returns what stops it.

    Home Assistant gives no way to stop listening: the page keeps the listener for good. So it gets a small relay that
    holds the brick only weakly, and is taken out of the page's list when it can be: a reloaded brick never stays in
    memory with its year of statistics, nor computes again for a page change (audit of 9 Nov. 2026)."""
    target = weakref.WeakMethod(callback) if hasattr(callback, "__self__") else (lambda: callback)
    stopped = False

    async def relay() -> None:
        found = target()
        if not stopped and found is not None:
            await found()

    manager = None
    try:
        from homeassistant.components.energy.data import async_get_manager
        manager = await async_get_manager(hass)
        manager.async_listen_updates(relay)
    except Exception as err:  # noqa: BLE001
        _LOGGER.debug("Energy page not followed: %s", err)

    def stop() -> None:
        nonlocal stopped
        stopped = True
        listeners = getattr(manager, "_update_listeners", None)
        if isinstance(listeners, list) and relay in listeners:
            listeners.remove(relay)
    return stop


async def metadata(hass: HomeAssistant, ids: set[str]) -> dict[str, dict]:
    if not ids:
        return {}
    try:
        found = await get_instance(hass).async_add_executor_job(lambda: statistics.get_metadata(hass, statistic_ids=ids))
    except Exception as err:  # noqa: BLE001
        _LOGGER.warning("Statistics metadata unavailable: %s", err)
        return {}
    return {sid: dict(meta) for sid, (_, meta) in found.items()}


async def hourly(hass: HomeAssistant, ids: set[str], start: datetime, end: datetime | None = None) -> dict[str, Rows]:
    """Each statistic's hours since `start`: {id: Rows of (start, mean, min, max, sum)}, in kWh, W, L. Kept compact
    (engine/rows.py): a year of a home's statistics in about 15 MB instead of 180."""
    if not ids:
        return {}

    def read():
        rows = statistics.statistics_during_period(hass, start, end, ids, "hour", UNITS, {"mean", "min", "max", "sum"})
        return {sid: Rows.of(values) for sid, values in rows.items()}

    try:
        return await get_instance(hass).async_add_executor_job(read)
    except Exception as err:  # noqa: BLE001 - no statistics: the reports say so, nothing is invented
        _LOGGER.warning("Statistics unavailable: %s", err)
        return {}


# --- What the home has besides the Energy page (extensions, F1, 8.3) --------------------------------------------

_PERIOD_STATE = re.compile(r"^(heures? (pleines?|creuses?)|h[pc](\b|\.\.))", re.I)
_TEMPO = re.compile(r"tempo", re.I)
_COLOURS = {"bleu": "bleu", "blue": "bleu", "blanc": "blanc", "white": "blanc", "rouge": "rouge", "red": "rouge"}
_KVA = re.compile(r"(\d{1,2}) ?kva", re.I)


def period_of(state: str | None) -> str | None:
    """« HEURE PLEINE », « HC.. », « heures creuses » → « hp » / « hc »."""
    text = (state or "").strip().lower()
    if "creuse" in text or text.startswith("hc"):
        return "hc"
    if "pleine" in text or text.startswith("hp"):
        return "hp"
    return None


def colour_of(state: str | None) -> str | None:
    return _COLOURS.get((state or "").strip().lower())


def detect(hass: HomeAssistant) -> dict:
    """What can be read beyond the page: the meter's period (TIC), the Tempo colours, the inverters' channels,
    the subscribed power written in an entity's name (« option_hphc_9kva »). Each found entity id, or None."""
    registry = er.async_get(hass)
    found = {"period": None, "tempo_today": None, "tempo_tomorrow": None, "inverter": None, "channels": [], "kva": None,
             "comwatt": False}
    # One pass over the registry, one over the sensors (audit of 9 Nov. 2026: three passes and a registry lookup per
    # sensor held Home Assistant's loop 0.13 s on the lab, at each hourly report).
    own = set()
    for entry in registry.entities.values():
        if entry.platform == "hestia_energy":
            own.add(entry.entity_id)
        if entry.platform == "opendtu" and entry.domain == "sensor":
            if re.search(r"_ch\d+_power$", entry.entity_id):
                found["channels"].append(entry.entity_id)
            elif entry.entity_id.endswith("_ac_power"):
                found["inverter"] = found["inverter"] or entry.entity_id
        if entry.platform == "comwatt":
            found["comwatt"] = True
        if found["kva"] is None and (match := _KVA.search(entry.entity_id)):
            found["kva"] = int(match.group(1))
    sensors = hass.states.async_all("sensor")
    for state in sensors:
        eid = state.entity_id
        # Never its own sensors: « Période » (hp/hc) would pass for the meter's own, and a home with HA Linky only
        # would look live (found on a Linky-only home, 9 Nov. 2026).
        if eid in own or eid.startswith("sensor.hestia_energy_"):
            continue
        tempo = _TEMPO.search(eid)
        if found["period"] is None and not tempo and _PERIOD_STATE.match(state.state or ""):
            found["period"] = eid
        if tempo and colour_of(state.state):
            key = "tempo_tomorrow" if re.search(r"demain|tomorrow|prochain|next", eid) else "tempo_today"
            found[key] = found[key] or eid
    if not found["inverter"]:
        # OpenDTU seen by its names only (a copy by Remote Home-Assistant, or entities without their registry entry).
        names = [s.entity_id for s in sensors]
        found["inverter"] = next((n for n in names if re.match(r"sensor\.opendtu_\w+_ac_power$", n)), None)
        if found["inverter"] and not found["channels"]:
            found["channels"] = [n for n in names if re.search(r"_ch\d+_power$", n)]
    found["channels"].sort()
    found["pellets"] = pellet_tracking(hass, sensors)
    return found


def pellet_tracking(hass: HomeAssistant, sensors: list | None = None) -> dict | None:
    """Suivi Stock Pellet (the pellet stove's extension): its sensors found by the role each one carries
    (`suivi_stock_pellet_key`), so a renamed entity, or a copy of it, is still found; the season's purchases and the
    bag's weight. None without it."""
    roles = {}
    for state in sensors if sensors is not None else hass.states.async_all("sensor"):
        key = state.attributes.get("suivi_stock_pellet_key")
        if key and key not in roles:
            roles[key] = state
    if "consomme_kg" not in roles:
        return None

    def number(role):
        try:
            return float(roles[role].state) if role in roles else None
        except (TypeError, ValueError):
            return None

    stock = roles.get("stock")
    return {"consumed": roles["consomme_kg"].entity_id, "season_kg": number("consomme_kg"), "spent_eur": number("depense"), "bought_kg": number("achete_kg"),
            "bag_kg": stock.attributes.get("poids_sac_kg") if stock else None,
            # what is left, and the days the stove was used this season (its pace)
            "stock_kg": number("stock"), "days_used": number("jours_utilisation")}


def origins(hass: HomeAssistant, stats: list[str]) -> dict[str, dict]:
    """Where each statistic comes from: its integration and its device's maker and model (« Comwatt », « LiXee
    ZLinky »). An imported statistic (« linky:… ») has neither; its prefix says it."""
    entities, devices, areas = er.async_get(hass), dr.async_get(hass), ar.async_get(hass)
    out = {}
    for stat in stats:
        entry = entities.async_get(stat) if "." in stat and ":" not in stat else None
        device = devices.async_get(entry.device_id) if entry and entry.device_id else None
        # its room in Home Assistant: the entity's own, else its device's (the hub shows it, never uses it to sort)
        area_id = (entry.area_id if entry else None) or (device.area_id if device else None)
        area = areas.async_get_area(area_id) if area_id else None
        out[stat] = {"platform": entry.platform if entry else None, "area": area.name if area else None,
                     "device_name": (device.name_by_user or device.name) if device else None,
                     "maker": device.manufacturer if device else None,
                     "integration": _integration_name(hass, entry.platform) if entry else None,
                     "device": " ".join(x for x in (device.manufacturer, device.model) if x) if device else None}
    return out


def _integration_name(hass: HomeAssistant, domain: str) -> str | None:
    """The integration's own name (« Remote Home-Assistant »), never its technical domain; None for a template."""
    if domain in ("template", "utility_meter", "integration", "statistics", "sql"):
        return None
    try:
        return async_get_loaded_integration(hass, domain).name
    except Exception:  # noqa: BLE001
        return None


async def is_local(hass: HomeAssistant, entity_id: str) -> bool | None:
    """True when the entity's integration works locally (its `iot_class`), None when unknown (a template)."""
    entry = er.async_get(hass).async_get(entity_id)
    if entry is None or entry.platform in ("template", "utility_meter", "integration", "statistics", "sql"):
        return None
    try:
        integration = await async_get_integration(hass, entry.platform)
    except Exception:  # noqa: BLE001
        return None
    iot = integration.iot_class or ""
    return iot.startswith("local") if iot else None


# --- What the other Hestia bricks give (their public interfaces, never their insides) ----------------------------

WEATHER_API = "hestia_weather_api"
WEATHER_API_VERSION = 1      # the version of Hestia Weather's interface this brick speaks
BRICK = "hestia_energy"      # said to Hestia Weather when listening, so that its settings show this brick linked


def weather_api(hass: HomeAssistant):
    """Hestia Weather's interface when it speaks the version this brick knows, else None (absent or another version)."""
    api = hass.data.get(WEATHER_API)
    return api if api is not None and getattr(api, "version", None) == WEATHER_API_VERSION else None


def weather_place(hass: HomeAssistant, chosen: str | None = None) -> dict:
    """Which Hestia Weather place gives the cold of each day, and whether it can.

    `etat`: « oui »; « non » (not installed); « incompatible » (another version of its interface); « ancienne » (too old
    for the degree-days); « sans_lieu » (no place set up in it yet). `lieu` and `nom`: the place used; `lieux`: every
    place, for the settings. The place chosen in the settings when it still exists; else the only one; else the first
    set up (usually the home's), with `choisi` False so that the settings offer the choice. Never an error: another
    brick's trouble never stops this one."""
    out = {"etat": "non", "lieu": None, "nom": None, "lieux": [], "choisi": False}
    api = hass.data.get(WEATHER_API)
    if api is None:
        return out
    if getattr(api, "version", None) != WEATHER_API_VERSION:
        return {**out, "etat": "incompatible"}
    if not hasattr(api, "degree_days"):
        return {**out, "etat": "ancienne"}
    try:
        places = [{"entry_id": p["entry_id"], "title": p.get("title") or ""} for p in api.places()]
    except Exception as err:  # noqa: BLE001
        _LOGGER.debug("Hestia Weather's places unavailable: %s", err)
        places = []
    if not places:
        return {**out, "etat": "sans_lieu"}
    found = next((p for p in places if chosen and p["entry_id"] == chosen), None)
    place = found or places[0]
    return {"etat": "oui", "lieu": place["entry_id"], "nom": place["title"], "lieux": places,
            "choisi": found is not None or len(places) == 1}


def weather_listen(hass: HomeAssistant, place: str, update) -> Callable[[], None]:
    """Listens to this Hestia Weather place, saying who listens: Weather's settings then show Énergie linked to it."""
    api = weather_api(hass)
    if api is None or not place:
        return lambda: None
    try:
        return api.add_listener(place, update, brick=BRICK)
    except Exception as err:  # noqa: BLE001
        _LOGGER.debug("Hestia Weather not listened to: %s", err)
        return lambda: None


async def degree_days(hass: HomeAssistant, days: list, place: str | None) -> dict:
    """Each day's heating degree-days from this Hestia Weather place ({date: DJU}); a day it cannot give is left out.
    Without a place nothing is asked: with several places, Weather answers none without being told which."""
    api = weather_api(hass)
    out = {}
    if api is None or not place or not hasattr(api, "degree_days"):
        return out
    for n, day in enumerate(days):
        if n % 10 == 9:
            await asyncio.sleep(0)   # a year asked at start: the loop breathes between days (0.19 s held at once before)
        try:
            found = await api.degree_days(day, place)
        except Exception as err:  # noqa: BLE001 - another brick's trouble never stops this one
            _LOGGER.debug("Degree-days of %s unavailable: %s", day, err)
            continue
        if found and found.get("heating") is not None:
            out[day] = float(found["heating"])
    return out


_STOVE_NAME = re.compile(r"po[eê]le|pellet|granul|bois|wood|stove|insert", re.I)


def thermostats(hass: HomeAssistant) -> list:
    """The home's thermostats as Hestia Energy needs them (9.5): heating or not, and the power drawn when heating —
    Versatile Thermostat's own figure (the heater's power × its share of the cycle). A thermostat of a stove (by its
    name) heats without electricity to count. Vents and copies without a room temperature are left out."""
    from .engine.heating import Thermostat
    out = []
    for state in hass.states.async_all("climate"):
        a = state.attributes
        if state.state in ("unavailable", "unknown") or a.get("current_temperature") is None:
            continue
        name = a.get("friendly_name") or state.entity_id
        power = (a.get("power_manager") or {}) if isinstance(a.get("power_manager"), dict) else {}
        watts = power.get("mean_cycle_power")
        if watts is None and power.get("device_power") is not None and a.get("on_percent") is not None:
            watts = power["device_power"] * a["on_percent"]
        try:
            watts = None if watts is None else float(watts)
        except (TypeError, ValueError):
            watts = None
        out.append(Thermostat(name=name, heating=a.get("hvac_action") == "heating", watts=watts,
                              stove=bool(_STOVE_NAME.search(f"{state.entity_id} {name}"))))
    return out


async def colour_history(hass: HomeAssistant, entity_id: str, start: datetime) -> dict:
    """The Tempo colour of each day the Recorder still keeps for `entity_id` ({date: « bleu »…}), read at the day's
    noon (a Tempo day runs from 6 h to 6 h). The Recorder keeps about ten days; the brick keeps them afterwards."""
    from homeassistant.components.recorder import history
    from homeassistant.util import dt as dt_util

    def read():
        return history.state_changes_during_period(hass, start, None, entity_id, include_start_time_state=True)

    try:
        found = await get_instance(hass).async_add_executor_job(read)
    except Exception as err:  # noqa: BLE001
        _LOGGER.debug("Tempo history unavailable: %s", err)
        return {}
    states = found.get(entity_id, [])
    return colours_by_day([(dt_util.as_local(x.last_changed), x.state) for x in states], dt_util.now())


def colours_by_day(changes: list, now: datetime) -> dict:
    """Each Tempo day whose noon falls while a colour was shown ({date: colour}); a colour kept for days counts for
    each of them. `changes`: (local time, state) in order."""
    out = {}
    for (since, state), following in zip(changes, [*[c[0] for c in changes[1:]], now]):
        colour = colour_of(state)
        if not colour:
            continue
        day = (since - timedelta(hours=6)).date()
        while True:
            noon = since.replace(year=day.year, month=day.month, day=day.day, hour=12, minute=0, second=0, microsecond=0)
            if noon >= following:
                break
            if noon >= since:
                out[day] = colour
            day += timedelta(days=1)
    return out


async def reference_statistics(hass: HomeAssistant) -> dict:
    """The bill's own meter (Enedis) when HA Linky or MyElectricalData imports it, even outside the Energy page:
    {« achats »: statistic id, « revente »: statistic id}; empty without it."""
    def read():
        return statistics.list_statistic_ids(hass)

    try:
        found = await get_instance(hass).async_add_executor_job(read)
    except Exception as err:  # noqa: BLE001
        _LOGGER.debug("Statistics list unavailable: %s", err)
        return {}
    out = {}
    for item in found:
        sid, source = item.get("statistic_id", ""), (item.get("source") or "").lower()
        head = sid.split(":", 1)[0].lower() if ":" in sid else ""
        if head == "linky" or source == "linky":
            out.setdefault("achats", sid)
        elif head == "linky_prod" or source == "linky_prod":
            out.setdefault("revente", sid)
        elif "myelectricaldata" in head or "myelectricaldata" in source:
            out.setdefault("revente" if "production" in sid.lower() else "achats", sid)
    return out
