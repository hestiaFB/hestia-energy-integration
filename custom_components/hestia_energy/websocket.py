"""The websocket commands of the card and the tab (INTERFACE.md § 1.3). Read only, quick: everything is in the
coordinator already (socle rule: under 0.25 s a command); `periods` computes in a worker thread."""
from __future__ import annotations

from datetime import date

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

from . import hub_view
from .const import DOMAIN
from .engine import hub, report
from .engine import water_heater as wh

RUBRIQUES = ("soleil", "chauffage", "eau", "contrat", "appareils", "veille", "pointe", "chauffe_eau")
VIEW_VERSION = 1
# What the cards read (card/src/card.ts): the reports' findings, the sources, the extensions and the hub's figures stay
# out of their view (33 kB → about 10 kB; audit of 9 Nov. 2026).
CARD_KEYS = ("pret", "palier", "equipement", "direct", "jour", "hier", "mois", "mois_an_dernier", "projection", "jusqu_ici",
             "dernier_jour", "pistes", "veille", "veille_historique", "heures_creuses", "contrat", "heures", "eau",
             "chauffage", "panneaux", "soleil_jour", "appareils_jour", "pointe", "usage", "chauffe_eau", "cout_chauffage")


def _coordinator(hass):
    entry = next((e for e in hass.config_entries.async_entries(DOMAIN) if getattr(e, "runtime_data", None)), None)
    return entry.runtime_data if entry else None


def async_setup_websocket(hass) -> None:
    for command in (ws_view, ws_subscribe, ws_detail, ws_periods, ws_sources, ws_simulate, ws_hub, ws_settings, ws_set_settings, ws_heater_force):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command({vol.Required("type"): "hestia_energy/view"})
@callback
def ws_view(hass, connection, msg):
    """Everything the full card shows: the banner, « Maintenant », the reports, the level."""
    c = _coordinator(hass)
    if c is None:
        connection.send_error(msg["id"], "not_ready", "Hestia Énergie n'est pas activée.")
        return
    connection.send_result(msg["id"], {"version": 1, **c.data})


def card_view(data: dict) -> dict:
    return {k: data[k] for k in CARD_KEYS if k in data}


@websocket_api.websocket_command({vol.Required("type"): "hestia_energy/subscribe"})
@callback
def ws_subscribe(hass, connection, msg):
    """The cards' view, shared by every card of a dashboard (card/src/stream.ts): whole once, then only its parts that
    changed, as soon as they change (« en ce moment » every 10 s at most). Nine cards used to ask the whole 33 kB view
    each minute, each on its own (audit of 9 Nov. 2026). When the brick stops (reloaded), `reload`: the cards follow
    the new one a moment later."""
    c = _coordinator(hass)
    if c is None:
        connection.send_error(msg["id"], "not_ready", "Hestia Énergie n'est pas activée.")
        return
    sent: dict = {}

    @callback
    def send() -> None:
        view = card_view(c.data)
        before = sent.get("view")
        if before is not None:
            changed = {k: v for k, v in view.items() if before.get(k) != v}
            removed = [k for k in before if k not in view]
            if not changed and not removed:
                return
            sent["view"] = view
            connection.send_message(websocket_api.event_message(msg["id"], {"version": VIEW_VERSION, "changes": changed,
                                                                            "removed": removed}))
        else:
            sent["view"] = view
            connection.send_message(websocket_api.event_message(msg["id"], {"version": VIEW_VERSION, "view": view}))

    @callback
    def stopped() -> None:
        connection.send_message(websocket_api.event_message(msg["id"], {"version": VIEW_VERSION, "reload": True}))

    remove_view, remove_stop = c.add_listener(send), c.add_stop_listener(stopped)

    @callback
    def unsubscribe() -> None:
        remove_view()
        remove_stop()

    connection.subscriptions[msg["id"]] = unsubscribe
    connection.send_result(msg["id"])
    send()


@websocket_api.websocket_command({vol.Required("type"): "hestia_energy/detail", vol.Required("rubrique"): vol.In(RUBRIQUES)})
@callback
def ws_detail(hass, connection, msg):
    """One detail card. What is not built yet says so (« bientot »), never an empty card that looks finished."""
    c = _coordinator(hass)
    if c is None:
        connection.send_error(msg["id"], "not_ready", "Hestia Énergie n'est pas activée.")
        return
    d, live = c.data, c.data.get("direct") or {}
    rubrique = msg["rubrique"]
    if rubrique == "veille":
        out = {"veille": d.get("veille"), "hausse": d.get("veille_hausse")}
    elif rubrique == "contrat":
        out = {"contrat": d.get("contrat"), "heures_creuses": d.get("heures_creuses"), "prix": live.get("prix"),
               "periode": live.get("periode"), "prochain_changement": live.get("prochain_changement"), "simulateur": "bientot"}
    elif rubrique == "pointe":
        out = {"achat_w": live.get("achat_w"), "kva": (d.get("contrat") or {}).get("kva"), "en_marche": live.get("en_marche")}
    elif rubrique == "soleil":
        out = {"jour": d.get("jour"), "hier": d.get("hier"), "soleil_w": live.get("soleil_w"), "revente_w": live.get("revente_w"),
               "sources": (live.get("sources") or {}).get("soleil"), "voies": "bientot"}
    elif rubrique == "eau":
        out = {"fuite": live.get("fuite"), "jour": "bientot"}
    elif rubrique == "appareils":
        out = {"en_marche": live.get("en_marche"), "repartition": "bientot"}
    elif rubrique == "chauffe_eau":
        out = {"chauffe_eau": d.get("chauffe_eau")}
    else:
        out = {"chauffage": d.get("chauffage"), "cout_chauffage": d.get("cout_chauffage")}
    connection.send_result(msg["id"], {"rubrique": rubrique, **out})


@websocket_api.websocket_command({vol.Required("type"): "hestia_energy/periods", vol.Required("du"): str, vol.Required("au"): str,
                                  vol.Required("pas"): vol.In(("jour", "semaine", "mois", "annee"))})
@websocket_api.async_response
async def ws_periods(hass, connection, msg):
    c = _coordinator(hass)
    if c is None or c.home is None or c.contract is None:
        connection.send_error(msg["id"], "not_ready", "Les bilans ne sont pas encore prêts.")
        return
    try:
        start, end = date.fromisoformat(msg["du"]), date.fromisoformat(msg["au"])
    except ValueError:
        connection.send_error(msg["id"], "invalid", "Dates attendues au format AAAA-MM-JJ.")
        return
    if end < start or (end - start).days > 800:
        connection.send_error(msg["id"], "invalid", "Une période de deux ans au plus.")
        return
    if msg["pas"] == "jour" and (end - start).days > 400:
        connection.send_error(msg["id"], "invalid", "Jour par jour : une année au plus.")
        return
    rows = await hass.async_add_executor_job(report.periods, c.home, c.contract, c.table, start, end, msg["pas"])
    connection.send_result(msg["id"], {"pas": msg["pas"], "periodes": [p.as_dict() for p in rows]})


@websocket_api.websocket_command({vol.Required("type"): "hestia_energy/sources"})
@callback
def ws_sources(hass, connection, msg):
    """The arbiter: each live quantity, its source and those set aside; the findings on the statistics."""
    c = _coordinator(hass)
    if c is None:
        connection.send_error(msg["id"], "not_ready", "Hestia Énergie n'est pas activée.")
        return
    page = c.page
    meters = [] if page is None else [{"type": m.kind, "stat": m.stat, "nom": m.name, "periode": m.period,
                                        "puissance": list(m.power.entities)} for m in page.meters]
    connection.send_result(msg["id"], {"direct": (c.data.get("direct") or {}).get("sources"), "constats": c.data.get("constats"),
                                       "compteurs": meters, "format_page": None if page is None else page.format,
                                       "extensions": c.data.get("extensions"), "equipement": c.data.get("equipement")})


@websocket_api.websocket_command({vol.Required("type"): "hestia_energy/simulate"})
@callback
def ws_simulate(hass, connection, msg):
    """The contract simulator (F3) comes with the first stable version."""
    connection.send_error(msg["id"], "not_supported", "Le simulateur de contrat arrive avec la première version stable.")


_PRICE = vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=5)))
_EXTENSIONS = tuple(e[0] for e in hub_view.EXTENSIONS)
SETTINGS = vol.Schema({
    vol.Optional("kva"): vol.Any(None, vol.All(int, vol.In((3, 6, 9, 12, 15, 18, 24, 30, 36)))),
    vol.Optional("margin"): vol.All(vol.Coerce(float), vol.Range(min=0, max=0.3)),
    vol.Optional("export_price"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=1))),
    vol.Optional("option"): vol.Any(None, vol.In(("base", "hphc", "tempo"))),
    vol.Optional("notify_service"): vol.Any(None, vol.All(str, vol.Match(r"^notify\.[a-z0-9_]+$"))),
    vol.Optional("notify_hour"): vol.All(vol.Coerce(int), vol.Range(min=0, max=23)),
    # one or more ranges « 00:14-08:19, 12:00-14:00 »; None: those read on the meters
    vol.Optional("offpeak"): vol.Any(None, vol.All(str, vol.Length(max=120), vol.Match(r"^\s*\d{1,2}[:h]\d{2}\s*-\s*\d{1,2}[:h]\d{2}(\s*,\s*\d{1,2}[:h]\d{2}\s*-\s*\d{1,2}[:h]\d{2})*\s*$"))),
    # weekends and public holidays: « tout » off-peak all day, « pareil » the same hours; None: what the meters show
    vol.Optional("offpeak_weekend"): vol.Any(None, vol.In(("tout", "pareil"))),
    vol.Optional("bag_price"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=100))),
    vol.Optional("offer"): vol.Any(None, vol.In(("bleu", "autre"))),
    vol.Optional("price_hp"): _PRICE, vol.Optional("price_hc"): _PRICE, vol.Optional("price_base"): _PRICE,
    vol.Optional("subscription"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=5000))),
    vol.Optional("water_price"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=50))),
    vol.Optional("stove_fuel"): vol.Any(None, vol.In(("pellets", "gas"))),
    # the Hestia Weather place (its entry id) that gives the cold; None: the only one, or the first
    vol.Optional("weather_place"): vol.Any(None, vol.All(str, vol.Length(min=1, max=64))),
    # 1.0.1b3: the home battery's charge sensor (%) and its usable kWh; None: found and learned by Hestia
    vol.Optional("battery_soc"): vol.Any(None, vol.All(str, vol.Match(r"^sensor\.[a-z0-9_]+$"))),
    vol.Optional("battery_kwh"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0.5, max=200))),
    **{vol.Optional(k): bool for k in ("notify_day", "notify_week", "notify_month", "notify_leak", "notify_forgot")},
    vol.Optional("groups"): {str: vol.In(hub.GROUPS)},
    vol.Optional("extensions"): {vol.In(_EXTENSIONS): bool},
    # The water heater driven by Hestia (1.0.1b1, docs/chauffe-eau.md): every key optional, None the default.
    vol.Optional("chauffe_eau"): vol.Schema({
        vol.Optional("mode"): vol.In(wh.MODES),
        vol.Optional("appareil"): vol.Any(None, vol.All(str, vol.Length(min=1, max=255))),
        vol.Optional("prise"): vol.Any(None, vol.All(str, vol.Match(r"^(switch|input_boolean|light)\.[a-z0-9_]+$"))),
        vol.Optional("sonde"): vol.Any(None, vol.All(str, vol.Match(r"^(sensor|water_heater)\.[a-z0-9_]+$"))),
        vol.Optional("litres"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=10, max=1000))),
        vol.Optional("puissance_w"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=300, max=12000))),
        vol.Optional("heures"): vol.All([vol.All(str, vol.Match(r"^\d{1,2}[:h]\d{2}(-\d{1,2}[:h]\d{2})?$"))], vol.Length(max=6)),
        vol.Optional("reserve_min"): vol.All(vol.Coerce(float), vol.Range(min=0, max=0.8)),
        vol.Optional("demarrages"): vol.All(vol.Coerce(int), vol.Range(min=1, max=12)),
        vol.Optional("consigne"): vol.All(vol.Coerce(float), vol.Range(min=40, max=85)),
    }),
})
KEYS = ("kva", "margin", "export_price", "option", "bag_price", "notify_service", "notify_hour", "offpeak", "offpeak_weekend", "offer", "price_hp",
        "price_hc", "price_base", "subscription", "water_price", "stove_fuel", "notify_day", "notify_week", "notify_month",
        "notify_leak", "notify_forgot", "groups", "extensions", "weather_place", "chauffe_eau",
        "battery_soc", "battery_kwh")


# The contract's settings an automation may change (issue 18: an offer Hestia does not know, its hours and prices
# set by the household's own automation). The same checks as the hub's.
SERVICE_KEYS = ("option", "offer", "offpeak", "offpeak_weekend", "price_hp", "price_hc", "price_base", "subscription",
                "kva", "export_price", "battery_soc", "battery_kwh")
SERVICE_SCHEMA = vol.Schema({
    **{vol.Optional(k): SETTINGS.schema[vol.Optional(k)] for k in SERVICE_KEYS},
    # an automation's number may come as « 9 » or 9.0
    vol.Optional("kva"): vol.Any(None, vol.All(vol.Coerce(int), vol.In((3, 6, 9, 12, 15, 18, 24, 30, 36)))),
})


def async_setup_services(hass) -> None:
    async def set_settings(call) -> None:
        c = _coordinator(hass)
        if c is None:
            raise HomeAssistantError("Hestia Énergie n'est pas activée.")
        await c.async_save_settings(dict(call.data), wait=False)

    hass.services.async_register(DOMAIN, "set_settings", set_settings, schema=SERVICE_SCHEMA)


@websocket_api.websocket_command({vol.Required("type"): "hestia_energy/settings"})
@websocket_api.require_admin
@callback
def ws_settings(hass, connection, msg):
    """The household's settings with what Hestia found by itself (the value used when a setting is left empty)."""
    c = _coordinator(hass)
    if c is None:
        connection.send_error(msg["id"], "not_ready", "Hestia Énergie n'est pas activée.")
        return
    connection.send_result(msg["id"], {"reglages": {k: c.settings.get(k) for k in KEYS}, "trouve": hub_view.found_settings(hass, c)})


@websocket_api.websocket_command({vol.Required("type"): "hestia_energy/hub"})
@websocket_api.require_admin
@callback
def ws_hub(hass, connection, msg):
    """The Énergie tab of the hub (INTERFACE.md § 5): its pages, from the figures already made."""
    c = _coordinator(hass)
    if c is None:
        connection.send_error(msg["id"], "not_ready", "Hestia Énergie n'est pas activée.")
        return
    if not c.data.get("pret"):
        connection.send_result(msg["id"], {"pret": False})
        return
    connection.send_result(msg["id"], hub_view.build(hass, c))


@websocket_api.websocket_command({vol.Required("type"): "hestia_energy/chauffe_eau_force", vol.Optional("arret", default=False): bool})
@websocket_api.require_admin
@callback
def ws_heater_force(hass, connection, msg):
    """The forced heating of the water heater (the button « Chauffe-eau : chauffer maintenant »), from the panel or the
    card: until the tank is full, at most 4 hours; `arret` stops it. Hestia still commands nothing itself: the
    household's automation follows the binary sensor, and in Simulation it does nothing."""
    c = _coordinator(hass)
    if c is None or c.heater is None:
        connection.send_error(msg["id"], "not_ready", "Hestia Énergie n'est pas activée.")
        return
    if msg["arret"]:
        c.heater.stop_boost()
    else:
        c.heater.boost(dt_util.utcnow())
    c._update_live()
    connection.send_result(msg["id"], {"force_jusqu_a": (c.data.get("chauffe_eau") or {}).get("force_jusqu_a")})


@websocket_api.websocket_command({vol.Required("type"): "hestia_energy/set_settings", vol.Required("reglages"): dict})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_set_settings(hass, connection, msg):
    c = _coordinator(hass)
    if c is None:
        connection.send_error(msg["id"], "not_ready", "Hestia Énergie n'est pas activée.")
        return
    try:
        changes = SETTINGS(msg["reglages"])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    await c.async_save_settings(changes, wait=False)
    connection.send_result(msg["id"], {"enregistre": True})
