"""The websocket commands of the card and the tab (INTERFACE.md § 1.3). Read only, quick: everything is in the
coordinator already (socle rule: under 0.25 s a command); `periods` computes in a worker thread."""
from __future__ import annotations

from datetime import date

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import callback

from . import hub_view
from .const import DOMAIN
from .engine import hub, report

RUBRIQUES = ("soleil", "chauffage", "eau", "contrat", "appareils", "veille", "pointe")
VIEW_VERSION = 1
# What the cards read (card/src/card.ts): the reports' findings, the sources, the extensions and the hub's figures stay
# out of their view (33 kB → about 10 kB; audit of 9 Nov. 2026).
CARD_KEYS = ("pret", "palier", "equipement", "direct", "jour", "hier", "mois", "mois_an_dernier", "projection", "jusqu_ici",
             "dernier_jour", "pistes", "veille", "veille_historique", "heures_creuses", "contrat", "heures", "eau",
             "chauffage", "panneaux", "soleil_jour", "appareils_jour", "pointe")


def _coordinator(hass):
    entry = next((e for e in hass.config_entries.async_entries(DOMAIN) if getattr(e, "runtime_data", None)), None)
    return entry.runtime_data if entry else None


def async_setup_websocket(hass) -> None:
    for command in (ws_view, ws_subscribe, ws_detail, ws_periods, ws_sources, ws_simulate, ws_hub, ws_settings, ws_set_settings):
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
    else:
        out = {"chauffage": d.get("chauffage")}
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
    vol.Optional("bag_price"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=100))),
    vol.Optional("offer"): vol.Any(None, vol.In(("bleu", "autre"))),
    vol.Optional("price_hp"): _PRICE, vol.Optional("price_hc"): _PRICE, vol.Optional("price_base"): _PRICE,
    vol.Optional("subscription"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=5000))),
    vol.Optional("water_price"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=50))),
    vol.Optional("stove_fuel"): vol.Any(None, vol.In(("pellets", "gas"))),
    # the Hestia Weather place (its entry id) that gives the cold; None: the only one, or the first
    vol.Optional("weather_place"): vol.Any(None, vol.All(str, vol.Length(min=1, max=64))),
    **{vol.Optional(k): bool for k in ("notify_day", "notify_week", "notify_month", "notify_leak", "notify_forgot")},
    vol.Optional("groups"): {str: vol.In(hub.GROUPS)},
    vol.Optional("extensions"): {vol.In(_EXTENSIONS): bool},
})
KEYS = ("kva", "margin", "export_price", "option", "bag_price", "notify_service", "notify_hour", "offpeak", "offer", "price_hp",
        "price_hc", "price_base", "subscription", "water_price", "stove_fuel", "notify_day", "notify_week", "notify_month",
        "notify_leak", "notify_forgot", "groups", "extensions", "weather_place")


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
