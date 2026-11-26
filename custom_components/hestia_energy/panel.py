"""Bundled tab and Lovelace card: one installation, nothing to declare by hand.

The settings live in the shared « Hestia-FB » panel (socle, see socle.py), as the « Énergie » tab, with the menu
fixed in the specification (CAHIER-DES-CHARGES.md, G4).
"""
import hashlib
from pathlib import Path

from aiohttp import web
from homeassistant.components.http import HomeAssistantView, StaticPathConfig
from homeassistant.util import dt as dt_util

from .const import DOMAIN, VERSION
from .socle import KEY as SOCLE_KEY, async_register_brick, async_register_card

ASSETS = "/hestia_energy-assets"
CARD_FILE = "hestia-energy-card.js"
CARD_URL = f"{ASSETS}/{CARD_FILE}"
# The tab's menu (socle 1.20): [path, label, icon]. Icons from the socle's hubIcon(); its own energy icons come with the tab.
# The page Contrat is gone: its settings are in Réglages (INTERFACE.md § 5, H1). Appareils is hidden without devices.
# Chauffe-eau (1.0.1b1) only for a home with a water heater (or its plug and power typed in the settings).
MENU = [["", "Vue d’ensemble", "home"], ["sources", "Sources", "entities"], ["appareils", "Appareils", "light"],
        ["chauffe-eau", "Chauffe-eau", "temperature"], ["reglages", "Réglages", "settings"], ["extensions", "Extensions", "extensions"],
        ["bilan", "Bilan", "review"], ["a-propos", "À propos", "info"]]
MENU_NO_DEVICES = [item for item in MENU if item[0] not in ("appareils", "chauffe-eau")]


def menu_for(coordinator) -> list:
    """The tab's menu for this home: Appareils with devices in the Energy page, Chauffe-eau with a water heater."""
    hidden = set()
    if not coordinator.page.devices:
        hidden.add("appareils")
    if not coordinator.heater.found():
        hidden.add("chauffe-eau")
    return [item for item in MENU if item[0] not in hidden]


class _LiveCardView(HomeAssistantView):
    """A beta's card at its usual address, always checked again by the browser: a beta is rebuilt often."""
    url = CARD_URL
    name = "hestia_energy:live_card"
    requires_auth = False

    async def get(self, request):
        return web.FileResponse(Path(__file__).parent / "frontend" / CARD_FILE, headers={"Cache-Control": "no-cache"})


def _fingerprint(path):
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()[:8]
    except OSError:
        return None


async def async_setup_panel(hass):
    if not hass.http or not hasattr(hass.http, "async_register_static_paths"):
        return  # Isolated tests and headless setups have no frontend.
    if not hass.data.get(DOMAIN + "_panel_asset"):
        beta = "b" in VERSION
        if beta:
            hass.http.register_view(_LiveCardView())
        await hass.http.async_register_static_paths([StaticPathConfig(ASSETS, str(Path(__file__).parent / "frontend"), not beta)])
        stamp = None if beta else await hass.async_add_executor_job(_fingerprint, Path(__file__).parent / "frontend" / CARD_FILE)
        await async_register_card(hass, CARD_URL, f"{VERSION}-{stamp}" if stamp else f"{VERSION}-dev" if beta else VERSION)
        hass.data[DOMAIN + "_panel_asset"] = True
    await async_register_brick(hass, {
        "domain": DOMAIN, "name": "Hestia Énergie", "slug": "energie", "tab": "Énergie", "version": VERSION,
        "icon": "mdi:lightning-bolt-outline", "navigation": 3, "menu": MENU,
        "module_url": f"{ASSETS}/panel.js?v={VERSION}", "element": "hestia-energy-setup", "status": energy_status,
    }, f"{ASSETS}/hestia-socle.js?v={VERSION}")


async def energy_status(hass, lang=None):
    """What the Hestia-FB home page says about Hestia Energy, from its own state only."""
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries:
        return {"level": "action", "summary": "Pas encore activée.", "details": [], "links": []}
    coordinator = getattr(entries[0], "runtime_data", None)
    data = coordinator.data if coordinator else {}
    # Appareils only when the Energy page has devices (H1): the socle reads the menu after asking the status.
    brick = hass.data.get(SOCLE_KEY, {}).get("bricks", {}).get(DOMAIN)
    if brick is not None and coordinator is not None and coordinator.page is not None:
        brick["menu"] = menu_for(coordinator)
    if not data.get("pret"):
        return {"level": "unknown", "summary": "Lecture de la page Énergie en cours.", "details": [], "links": []}
    if not (data.get("equipement") or {}).get("facture"):
        return {"level": "action", "summary": "La page Énergie de Home Assistant n’a pas encore de compteur.",
                "details": ["Ajoutez votre consommation dans Paramètres → Tableaux de bord → Énergie."], "links": []}
    # The hub's « À régler » (INTERFACE.md § 5, H2): the same list as the tab's overview; « palier » is no longer said.
    from . import hub_view
    from .engine import phrases
    mend = hub_view.todos(hass, coordinator)
    month = (data.get("mois") or {}).get("euros")
    first = phrases.month_name(dt_util.now().month)
    summary = f"{phrases.euros(month)} € depuis le 1er {first}." if month is not None else "Les euros arrivent avec les premiers bilans."
    if not mend:
        return {"level": "ok", "summary": summary, "details": [], "links": []}
    details = [t["titre"] for t in mend[:2]]
    if len(mend) > 2:
        details.append(f"Et {len(mend) - 2} autre{'s' if len(mend) > 3 else ''} dans l’onglet Énergie.")
    return {"level": "action", "summary": summary + f" {len(mend)} point{'s' if len(mend) > 1 else ''} à régler.",
            "details": details, "links": []}
