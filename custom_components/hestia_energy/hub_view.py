"""The Énergie tab of the Hestia-FB hub (docs/maquette-hub-energie.html, INTERFACE.md § 5): its pages in one answer.

Everything comes from the coordinator's figures and Home Assistant's registries, read at the request: quick (socle
rule, under 0.25 s), nothing computed again. The sentences are the hub's own (H2 to H10); the tab only lays them out.
"""
from __future__ import annotations

from datetime import date

from . import reader
from .engine import hub, phrases, sources, tariff

# The extensions (H8): the other bricks first, then by theme. [key, group, name, what it brings, what happens without it
# (said without « Sans elle / Sans lui » : the page gives the title, Frank 9 Nov. 2026), link]
EXTENSIONS = (
    ("meteo", "Briques Hestia-FB", "Hestia Météo", "Le froid de chaque jour : votre chauffage comparé à la météo.",
     "Le chauffage est compté sans être comparé au froid de chaque jour.", "https://github.com/hestiaFB/hestia-weather-integration"),
    ("confort", "Briques Hestia-FB", "Hestia Confort", "Reçoit le prix de l’électricité : chaque geste de Confort en euros.",
     "Confort donne ses gestes sans leur prix.", "https://github.com/hestiaFB/hestia-comfort-integration"),
    ("tic", "Électricité", "Linky en direct (LiXee, linkytic)", "Le prix de l’heure, la pointe, le bon moment pour une machine.",
     "Énergie voit la maison le lendemain, pas en direct : aucun geste au bon moment.", "https://github.com/hekmon/linkytic"),
    ("linky", "Électricité", "HA Linky", "Les chiffres d’Enedis, qui font foi pour la facture.",
     "Vos euros suivent vos propres compteurs, pas ceux d’Enedis.", "https://github.com/bokub/ha-linky"),
    ("tempo", "Électricité", "RTE Tempo", "La couleur du jour et du lendemain, pour l’option Tempo.",
     "La couleur des jours n’est pas connue : l’option Tempo ne peut pas être comptée.", "https://github.com/hekmon/rtetempo"),
    ("opendtu", "Soleil", "OpenDTU", "Chaque panneau, et un secours quand la production manque.",
     "Un compteur de production qui se tait laisse un trou dans les bilans.", None),
    ("comwatt", "Appareils et chauffage", "Comwatt", "Les appareils et les pinces, mesurés en ligne.",
     "Énergie ne voit que les prises mesurées de la maison.", None),
    ("vt", "Appareils et chauffage", "Versatile Thermostat", "Le chauffage en direct, pièce par pièce ; reçoit la puissance pour délester.",
     "Le chauffage se lit seulement dans les bilans, et rien n’est délesté.", "https://github.com/jmcollin78/versatile_thermostat"),
    ("pellets", "Appareils et chauffage", "Suivi Stock Pellet", "Les sacs de granulés achetés et brûlés.",
     "Le poêle n’est pas compté.", None),
)
RUNNING_W = 50
# What keeps Hestia Weather from giving the cold of each day, by the state found (coordinator._follow_weather and
# _heating): [title, what to do]. Said in « À régler » and on Hestia Météo's page, never left silent.
WEATHER_PROBLEMS = {
    "incompatible": ("Hestia Météo n’a pas la même version",
                     "Elle parle une autre version que celle d’Énergie : mettez Hestia Énergie et Hestia Météo à jour ensemble."),
    "ancienne": ("Hestia Météo est trop ancienne", "Elle ne donne pas encore le froid de chaque jour : mettez-la à jour."),
    "sans_lieu": ("Hestia Météo n’a pas de lieu", "Ajoutez votre maison dans Hestia Météo : le froid de chaque jour vient d’elle."),
    "sans_donnees": ("Hestia Météo ne donne pas le froid des jours passés",
                     "Choisissez un capteur de température extérieure dans les réglages de Hestia Météo{lieu}. "
                     "En attendant, le chauffage n’est pas comparé au froid."),
}


def weather_problem(hass, c) -> dict | None:
    """Why Hestia Weather, installed and used, gives no cold to Énergie ({titre, texte}); or, with several places and
    none chosen, which one is taken. None when all is well, or when Weather is not there (an extension, not a fault)."""
    if not c.used("meteo") or "hestia_weather" not in hass.config.components:
        return None
    state = c.weather_cold
    weather = c.weather or {}
    if state == "oui" and (c.data.get("chauffage") or {}).get("etat") == "meteo_sans_donnees":
        state = "sans_donnees"
    if state in WEATHER_PROBLEMS:
        title, text = WEATHER_PROBLEMS[state]
        return {"titre": title, "texte": text.format(lieu=f" (lieu « {weather['nom']} »)" if weather.get("nom") else "")}
    if state == "oui" and not weather.get("choisi"):
        return {"titre": "Quel lieu de Hestia Météo est la maison ?",
                "texte": f"Hestia Météo a {len(weather.get('lieux') or [])} lieux : Énergie prend « {weather.get('nom')} » "
                         "en attendant votre choix."}
    return None


def _friendly(hass, entity_id: str | None) -> str | None:
    state = hass.states.get(entity_id) if entity_id and "." in entity_id and ":" not in entity_id else None
    return state.attributes.get("friendly_name") if state else None


def _kwh(value: float | None) -> str | None:
    return None if value is None else f"{phrases.number(value, 1 if abs(value) < 10 else 0)} kWh"


def _eur(value: float | None) -> str | None:
    """To the cent under 100 €, to the euro above (as the hub's pages, maquette-hub-energie.html)."""
    if value is None:
        return None
    return f"{phrases.number(value, 2 if abs(value) < 100 else 0)} €"


def _stove(meter, c) -> bool:
    """A « gas » source of the page that is really the stove (D6), unless the household said it is gas."""
    if c.settings.get("stove_fuel") == "gas":
        return False
    return bool(sources._STOVE.search(sources._plain(f"{meter.name} {meter.stat}")))


def source_of(meter, c) -> str:
    """The tab's source for one meter of the page: achat, revente, soleil, poele, gaz, eau, batterie, or a device."""
    return {"import": "achat", "export": "revente", "solar": "soleil", "water": "eau", "battery_in": "batterie",
            "battery_out": "batterie"}.get(meter.kind) or ("poele" if meter.kind == "gas" and _stove(meter, c) else
                                                           "gaz" if meter.kind == "gas" else "appareil")


def _page_of(stat: str, c) -> str:
    for meter in c.page.meters if c.page else []:
        if meter.stat == stat:
            kind = source_of(meter, c)
            return f"appareils/{hub.device_id(stat)}" if kind == "appareil" else f"sources/{kind}"
    return "sources"


def _meter_name(hass, c, stat: str) -> str:
    meter = next((m for m in c.page.meters if m.stat == stat), None) if c.page else None
    return (meter.name if meter else None) or c.device_names.get(stat) or _friendly(hass, stat) or stat


# --- « À régler », « À améliorer » (H2, H6) -------------------------------------------------------------------------

def mend(f: dict, page) -> bool:
    """A finding only the household can mend. A live power without statistics is not one: the meter itself is read, only
    its checks by the power are lost (the maquette keeps it in « Corrigé par Hestia »)."""
    if f.get("niveau") != "regler":
        return False
    return not (f["id"] == "p_sans_statistiques" and page is not None and hub.owner(f, page) != f.get("stat"))


def todos(hass, c) -> list[dict]:
    """What only the household can mend, each with its probable cause and the page where it is mended."""
    out: list[dict] = []
    page = c.page
    if page is None or page.empty:
        return [{"titre": "Ajoutez votre consommation", "page": "ha",
                 "texte": "Dans la page Énergie de Home Assistant : le Linky (HA Linky, sans matériel) ou un compteur."}]
    seen = set()
    for f in c.data.get("constats") or []:
        if not mend(f, page):
            continue
        stat = hub.owner(f, page) or ""
        values = f.get("valeurs") or {}
        if f["id"] == "p_fausse_source":
            if c.settings.get("stove_fuel") is None and "poele" not in seen:
                seen.add("poele")
                out.append({"titre": "Le poêle est déclaré en gaz", "texte": "Dans la page Énergie. Ce sont des granulés ?",
                            "page": "sources/poele"})
            continue
        if f["id"] == "p_somme_impossible":
            n = values.get("jours", 0)
            out.append({"titre": "Un compteur compte double", "page": "appareils",
                        "texte": f"{n} jour{'s' if n > 1 else ''}, les appareils ont dépassé la maison entière. Souvent une prise "
                                 "mesurée derrière une autre, ou un appareil déclaré deux fois."})
            continue
        if (f["id"], stat) in seen:
            continue
        seen.add((f["id"], stat))
        name = _meter_name(hass, c, stat)
        if f["id"] == "p_unite":
            out.append({"titre": f"{name} : compté en Wh", "page": _page_of(stat, c),
                        "texte": f"Hestia le divise par {phrases.number(values.get('facteur', 1000))} en attendant. "
                                 "À corriger dans Home Assistant."})
        elif f["id"] == "p_sans_statistiques":
            out.append({"titre": f"{name} : pas de statistiques", "page": _page_of(stat, c),
                        "texte": "Home Assistant ne le garde pas dans le temps : Hestia ne peut pas le compter."})
        elif f["id"] == "p_capteur_fige":
            out.append({"titre": f"{name} ne bouge plus", "page": _page_of(stat, c), "texte": f.get("court") or f.get("texte") or ""})
    # One Linky read by HA Linky says neither the option nor the power (palier 0): the household says it once.
    supposed = contract_supposed(c)
    option_missing, kva_missing = "option" in supposed, "kva" in supposed
    if option_missing or kva_missing:
        what = " et ".join(x for x, on in (("l’option (Base, heures creuses ou Tempo)", option_missing),
                                           ("la puissance souscrite", kva_missing)) if on)
        meanwhile = ", ".join(x for x, on in (("en Base", option_missing),
                                              (f"avec {c.contract.kva if c.contract else 6} kVA", kva_missing)) if on)
        out.append({"titre": "Dites-nous votre contrat", "page": "reglages",
                    "texte": f"{what[0].upper() + what[1:]} : c’est écrit sur votre facture. En attendant, Hestia compte {meanwhile}."})
    if problem := weather_problem(hass, c):
        out.append({**problem, "page": "extensions/meteo"})
    contract = c.contract
    if contract is not None and contract.option == tariff.HPHC and c.offpeak is None:
        out.append({"titre": "Indiquez vos heures creuses", "texte": "Un seul compteur : Hestia ne peut pas les lire.",
                    "page": "reglages"})
    return out


def better(hass, c, devices: list[dict]) -> list[dict]:
    """What one more thing would bring; nothing when it is all there."""
    level, out = c.level, []
    if c.page is None or c.page.empty:
        return out
    if level is not None and not level.live:
        out.append({"titre": "Voir la maison en direct", "page": "extensions/tic",
                    "texte": "Un module sur la prise du Linky : le prix de l’heure, la pointe, le bon moment pour une machine."})
    if level is not None and not level.devices:
        out.append({"titre": "Mesurer un premier appareil", "page": "appareils",
                    "texte": "Une prise mesurée sur le frigo ou le chauffe-eau dirait d’où vient la veille."})
    nameless = [d for d in devices if d["sans_nom"]]
    if nameless:
        n = len(nameless)
        out.append({"titre": f"{n} compteur{'s' if n > 1 else ''} sans nom", "page": f"appareils/{nameless[0]['id']}",
                    "texte": "Un nom donné dans Home Assistant les rend lisibles ici."})
    return out


def _said(f: dict, page, short: bool) -> str | None:
    """A finding in the card of its source or device."""
    if f["id"] == "p_sans_statistiques" and hub.owner(f, page) != f.get("stat"):
        return "Sa puissance n’a pas de statistiques : Hestia lit son compteur sans pouvoir le vérifier."
    return (f.get("court") if short else None) or f.get("texte")


# --- Sources (H3) -----------------------------------------------------------------------------------------------------

def _origin(meter, role: str, text: str, hass) -> dict:
    found = reader.origins(hass, [meter.stat]).get(meter.stat) or {}
    by = " · ".join(x for x in (found.get("device"), found.get("integration")) if x)
    return {"nom": meter.name or _friendly(hass, meter.stat) or meter.stat, "role": role, "texte": text, "entite": meter.stat,
            "par": by or None}


def _reference(c, key: str) -> dict | None:
    stat = c.reference.get(key)
    if not stat:
        return None
    by = "HA Linky" if stat.lower().startswith("linky") else "MyElectricalData" if "myelectricaldata" in stat.lower() else None
    return {"nom": f"Enedis, par {by}" if by else "Enedis", "role": "Fait foi", "texte": "Le total de chaque jour, le lendemain.",
            "entite": stat}


def _enedis(meter) -> dict | None:
    """The page's own meter when it is Enedis's, imported by HA Linky or MyElectricalData (palier 0)."""
    kind = sources.source_of(meter.stat)
    if kind not in (sources.HA_LINKY, sources.MYELECTRICALDATA):
        return None
    by = "HA Linky" if kind == sources.HA_LINKY else "MyElectricalData"
    return {"nom": f"Enedis, par {by}", "role": "Fait foi", "texte": "Le total de chaque jour, le lendemain ; jour par jour pour les mois passés.",
            "entite": meter.stat}


def build_sources(hass, c) -> list[dict]:
    d, page = c.data, c.page
    if page is None:
        return []
    month = d.get("mois") or {}
    findings = d.get("constats") or []
    owned = hub.by_meter(findings, page)
    todo_pages = {t["page"] for t in todos(hass, c)}

    def fixed(stats_: list[str], extra: tuple[str, ...] = ()) -> list[str]:
        texts = [_said(f, page, False) for s in stats_ for f in owned.get(s, [])
                 if not mend(f, page) and f["id"] != "p_fausse_source" and not f["id"].startswith("p_reference")]
        return [t for t in texts if t] + [f.get("texte") for f in findings if f["id"] in extra and f.get("texte")]

    out = []

    def add(key: str, group: str, name: str, use: str, meters: list, origin: list, chips: list, **more) -> None:
        stats_ = [m.stat for m in meters]
        out.append({"id": key, "groupe": group, "nom": name, "usage": use, "chiffres": [x for x in chips if x and x.get("texte")],
                    "origine": [o for o in origin if o], "corrige": more.pop("corrige", fixed(stats_)),
                    "etat": "todo" if f"sources/{key}" in todo_pages else "ok", **more})

    live = bool(c.level and c.level.live)
    if page.imports:
        ref = _reference(c, "achats")
        origin = [ref] + [_enedis(m) or _origin(m, "Page Énergie", "La forme heure par heure." if ref else
                                  "Les heures creuses." if m.period == "hc" else "Les heures pleines." if m.period == "hp"
                                  else "Vos achats, heure par heure.", hass) for m in page.imports]
        period = c.extras.get("period")
        if period:
            origin.append({"nom": _friendly(hass, period) or period, "role": "En direct", "texte": "Le prix de l’heure et la période.",
                           "entite": period})
        add("achat", "Électricité", "Électricité achetée",
            "Vos euros jour par jour, et en direct le prix de l’heure." if live else "Vos euros jour par jour, le lendemain.",
            page.imports, origin,
            [{"texte": f"{_kwh(month.get('kwh_achetes'))} ce mois" if month.get("kwh_achetes") is not None else None},
             {"texte": _eur(month.get("euros_energie"))}],
            enedis=hub.enedis_lines(findings, "vos achats"), suit_enedis=bool(ref))
    if page.exports:
        ref = _reference(c, "revente")
        add("revente", "Électricité", "Électricité revendue", "Ce que rapporte le soleil en trop.", page.exports,
            [_origin(m, "Page Énergie", "L’électricité envoyée au réseau.", hass) for m in page.exports] + [ref],
            [{"texte": f"{_kwh(month.get('revendu_kwh'))} ce mois" if month.get("revendu_kwh") is not None else None},
             {"texte": f"{_eur(month.get('revendu_euros'))} rapportés" if month.get("revendu_euros") is not None else None, "benefice": True}],
            enedis=hub.enedis_lines(findings, "votre revente"), suit_enedis=bool(ref))
    if page.solar:
        inverter = c.extras.get("inverter")
        channels = c.extras.get("channels") or []
        origin = [_origin(m, "Page Énergie", "La production des panneaux.", hass) for m in page.solar]
        if inverter:
            origin.append({"nom": "OpenDTU", "role": "Secours", "entite": inverter,
                           "texte": f"Les {len(channels)} voies des onduleurs, quand un compteur manque." if channels else
                           "Les onduleurs, quand un compteur manque."})
        add("soleil", "Électricité", "Soleil produit", "La part de la maison que fournissent les panneaux.", page.solar, origin,
            [{"texte": f"{_kwh(month.get('soleil_kwh'))} ce mois" if month.get("soleil_kwh") is not None else None},
             {"texte": f"{month['soleil_couvre']} % de la maison" if month.get("soleil_couvre") is not None else None}],
            corrige=fixed([m.stat for m in page.solar], ("p_soleil_onduleurs", "p_soleil_manquant")))
    if page.batteries_in or page.batteries_out:
        meters = [*page.batteries_in, *page.batteries_out]
        add("batterie", "Électricité", "Batterie", "Ce que la batterie garde et rend.", meters,
            [_origin(m, "Page Énergie", "La charge." if m.kind == "battery_in" else "La décharge.", hass) for m in meters], [])
    stove = [m for m in page.gas if _stove(m, c)]
    pellets = c.extras.get("pellets")
    if stove or pellets:
        season = ((d.get("chauffage") or {}).get("poele") or {}).get("saison") or {}
        declared = c.settings.get("stove_fuel") is None and any(f["id"] == "p_fausse_source" for f in findings)
        origin = [_origin(m, "Page Énergie · en gaz", "", hass) for m in stove]
        if pellets:
            origin.append({"nom": _friendly(hass, pellets["consumed"]) or "Suivi Stock Pellet", "role": "Extension",
                           "texte": "Les sacs achetés et brûlés.", "entite": pellets["consumed"]})
        kg = season.get("kg")
        add("poele", "Chaleur", "Poêle à granulés", "Les granulés brûlés et leur prix.", stove, origin,
            [{"texte": f"{phrases.number(kg)} kg cette saison" if kg is not None else None}, {"texte": _eur(season.get("eur"))}],
            gaz_declare=bool(stove), sous="Déclaré en gaz dans la page Énergie." if declared else None)
    gas = [m for m in page.gas if m not in stove]
    if gas:
        add("gaz", "Chaleur", "Gaz", "Le gaz consommé par la maison.", gas,
            [_origin(m, "Page Énergie", "", hass) for m in gas], [], gaz_declare=bool(c.settings.get("stove_fuel") == "gas"))
    if page.water:
        water = d.get("eau") or {}
        add("eau", "Eau", "Eau", "Les litres, les euros, et une fuite repérée vite.", page.water,
            [_origin(m, "Page Énergie", "Le compteur et son débit." if m.power.rate else "Le compteur.", hass) for m in page.water],
            [{"texte": f"{phrases.number(water['mois_l'])} L ce mois" if water.get("mois_l") is not None else None},
             {"texte": _eur(water.get("mois_euros"))}])
    return out


# --- Appareils (H4, H5) -------------------------------------------------------------------------------------------

_TODO_WORDS = {"p_unite": "Compté en Wh au lieu de kWh", "p_sans_statistiques": "Pas de statistiques",
               "p_capteur_fige": "Sa puissance ne bouge plus"}


def build_devices(hass, c) -> dict:
    page = c.page
    if page is None or not page.devices:
        return {"liste": [], "mois": None}
    month = c.data.get("appareils_mois") or {}
    figures = month.get("appareils") or {}
    owned = hub.by_meter(c.data.get("constats") or [], page)
    found = reader.origins(hass, [m.stat for m in page.devices])
    groups = c.settings.get("groups") or {}
    out = []
    for meter in page.devices:
        friendly = _friendly(hass, meter.stat)
        nameless = not meter.name and not friendly
        guess = hub.guess_group(meter.name or friendly, meter.stat)
        reading = c._reading(meter.power.rate) if meter.power.rate else None
        watts = reading.watts if reading else None
        own = owned.get(meter.stat, [])
        todo = next((f for f in own if mend(f, page)), None)
        fig = figures.get(meter.stat) or {}
        origin = found.get(meter.stat) or {}
        detail = None
        if todo is not None:
            detail = ("Hestia le divise par 1 000 en attendant ; corrigez l’unité dans Home Assistant." if todo["id"] == "p_unite"
                      else todo.get("court") or todo.get("texte"))
        out.append({
            "id": hub.device_id(meter.stat), "stat": meter.stat, "puissance": meter.power.rate,
            "nom": meter.stat if nameless else meter.name or c.device_names.get(meter.stat) or friendly,
            "sans_nom": nameless, "groupe": groups.get(meter.stat) or guess, "groupe_devine": guess,
            "kwh": fig.get("kwh"), "euros": fig.get("euros"),
            "w": round(watts) if watts is not None and watts >= RUNNING_W else None,
            "a_regler": None if todo is None else _TODO_WORDS.get(todo["id"], "À vérifier"), "a_regler_detail": detail,
            "via": origin.get("integration") or "Page Énergie",
            # Where its figures come from, one thing a line (H4): the device that measures, its two entities, its room.
            "mesure_par": origin.get("device") or origin.get("device_name"), "integration": origin.get("integration"),
            "piece": origin.get("area"), "nom_compteur": friendly or meter.stat,
            "nom_puissance": _friendly(hass, meter.power.rate) if meter.power.rate else None,
            "w_direct": None if watts is None else round(watts),
            "corrige": [t for t in (_said(f, page, True) for f in own if not mend(f, page)) if t],
            "dans": meter.included_in,
        })
    return {"liste": out, "mois": month.get("debut"), "part": month.get("part"), "prix_moyen": month.get("prix_moyen")}


# --- Extensions (H8) ------------------------------------------------------------------------------------------------

def build_extensions(hass, c, devices: list[dict]) -> list[dict]:
    found, components = c.found_extras or c.extras or {}, hass.config.components
    reference = c.reference
    page_imports = c.page.imports if c.page else []
    tic_meter = any(m.get("type") == sources.TIC for m in (c.data.get("source") or {}).get("compteurs") or [])
    comwatt_n = sum(1 for d in devices if d["via"].lower() == "comwatt")
    heaters = len(reader.thermostats(hass)) if "versatile_thermostat" in components else 0
    installed = {
        "meteo": "hestia_weather" in components, "confort": "hestia_comfort" in components,
        "tic": bool(found.get("period")) or tic_meter,
        "linky": "linky" in components or bool(reference) or any(sources.source_of(m.stat) == sources.HA_LINKY for m in page_imports),
        "tempo": bool(found.get("tempo_today")), "opendtu": bool(found.get("inverter")),
        "comwatt": bool(found.get("comwatt")), "vt": "versatile_thermostat" in components, "pellets": bool(found.get("pellets")),
    }
    where = {
        "meteo": ["Bilan · le chauffage", "Les cartes · Chauffage"], "confort": ["Confort · le prix de chaque aération"],
        "tic": ["Électricité achetée", "Délestage"],
        "linky": [x for x, on in (("Électricité achetée", bool(reference.get("achats")) or any(sources.source_of(m.stat) == sources.HA_LINKY for m in page_imports)),
                                  ("Électricité revendue", bool(reference.get("revente")) and bool(c.page and c.page.exports))) if on],
        "tempo": ["Le prix de chaque jour"] if c.contract is not None and c.contract.option == tariff.TEMPO else [],
        "opendtu": ["Soleil produit"], "comwatt": [f"{comwatt_n} appareil{'s' if comwatt_n > 1 else ''}"] if comwatt_n else [],
        "vt": ([f"{heaters} chauffage{'s' if heaters > 1 else ''}"] if heaters else []) + ["Délestage"],
        "pellets": ["Poêle à granulés"],
    }
    problem = weather_problem(hass, c)
    weather = c.weather or {}
    out = [{"id": key, "groupe": group, "nom": name, "usage": use, "sans": without, "lien": link,
            "installee": installed[key], "utilisee": c.used(key), "ou": where[key], "probleme": None}
           for key, group, name, use, without, link in EXTENSIONS]
    for ext in out:
        if ext["id"] == "meteo":
            # The place that gives the cold, and the others to choose from (several places in Weather).
            ext.update({"probleme": problem, "lieu": weather.get("lieu"), "lieu_nom": weather.get("nom"),
                        "lieux": [{"id": p["entry_id"], "nom": p["title"]} for p in weather.get("lieux") or []]})
    return out


# --- The whole tab ----------------------------------------------------------------------------------------------------

def build(hass, c) -> dict:
    d = c.data
    devices = build_devices(hass, c)
    level = c.level
    return {
        "pret": bool(d.get("pret")),
        "soleil": bool(level and level.sun), "direct": bool(level and level.live),
        "vide": c.page is None or c.page.empty,
        "a_regler": todos(hass, c), "a_ameliorer": better(hass, c, devices["liste"]),
        "veille": None if not d.get("veille") else {k: d["veille"].get(k) for k in ("w", "euros_par_an")},
        "mois": d.get("mois"), "projection": d.get("projection"), "mois_an_dernier": d.get("mois_an_dernier"),
        "douze_mois": d.get("douze_mois"), "bilans": d.get("bilans") or [],
        # advice « à froid » (engine/daily.py): shown in « À améliorer » with the euros at stake
        "pistes": d.get("pistes") or [],
        "chauffage": d.get("chauffage"), "eau": d.get("eau"),
        "sources": build_sources(hass, c), "appareils": devices,
        "extensions": build_extensions(hass, c, devices["liste"]),
        "groupes": [[k, hub.GROUP_NAMES[k]] for k in hub.GROUPS],
        "mis_a_jour": d.get("mis_a_jour"), "tarifs": (c.table or {}).get("version"),
        "notifie": bool(c.settings.get("notify_service")),
    }


# --- The settings and what Hestia found (H7) -----------------------------------------------------------------------

def _hhmm(minute: int) -> str:
    h, m = divmod(minute % 1440, 60)
    return f"{h:02d}:{m:02d}"


def _number(hass, entity_id: str | None) -> float | None:
    state = hass.states.get(entity_id) if entity_id else None
    try:
        return float(state.state) if state is not None else None
    except (TypeError, ValueError):
        return None


def option_found(c) -> tuple[str | None, str | None]:
    """The contract's option as the home shows it, and where; (None, None) when nothing says (one Linky meter read by
    HA Linky: the same kWh whatever the option, the household must say it, palier 0)."""
    page, extras = c.page, c.extras or {}
    periods = {m.period for m in page.imports} if page else set()
    if extras.get("tempo_today"):
        return tariff.TEMPO, "trouvée sur le compteur"
    if {"hp", "hc"} <= periods or c.offpeak_found is not None:
        return tariff.HPHC, "trouvée sur le compteur"
    if extras.get("period"):
        return tariff.BASE, "trouvée sur le compteur"
    return None, None


def contract_supposed(c) -> list[str]:
    """What the contract's figures take by default because nothing read it: « option », « kva »."""
    out = []
    if c.settings.get("option") is None and option_found(c)[0] is None:
        out.append("option")
    if not c.settings.get("kva") and not (c.extras or {}).get("kva"):
        out.append("kva")
    return out


def found_settings(hass, c) -> dict:
    """Each household setting's value found by Hestia, and where it was found: the value used while it is left alone."""
    page, extras = c.page, c.extras or {}
    periods = {m.period for m in page.imports} if page else set()
    option, option_from = option_found(c)
    kva = extras.get("kva")
    chosen_option = c.settings.get("option") or option or tariff.BASE
    chosen_kva = c.settings.get("kva") or kva or 6
    today = date.today()
    keys = () if chosen_option == tariff.TEMPO else ("base",) if chosen_option == tariff.BASE else ("hp", "hc")
    regulated = {k: tariff.regulated_price(c.table, today, chosen_option, chosen_kva, None if k == "base" else k) for k in keys}
    page_prices = dict(c.page_prices)
    on_page = bool(page_prices) and all(regulated.get(k) is not None and abs(regulated[k] - v) <= 0.0005
                                        for k, v in page_prices.items() if k in regulated)
    export = None
    for meter in page.exports if page else []:
        export = _number(hass, meter.price.entity) if meter.price.entity else meter.price.number
        if export is not None:
            break
    water = next((m.price.number for m in page.water if m.price.number is not None), None) if page else None
    pellets = (c.found_extras or {}).get("pellets")
    learned = c.offpeak_found
    services = sorted(n for n in (hass.services.async_services().get("notify") or {}) if n not in ("send_message", "notify"))
    return {
        "option": {"valeur": option, "source": option_from},
        "offpeak": {"valeur": None if learned is None else [[_hhmm(r.start), _hhmm(r.end)] for r in learned.ranges],
                    "source": None if learned is None else "lues sur le compteur"},
        "kva": {"valeur": kva, "source": "trouvée sur le compteur" if kva else None},
        "offer": {"valeur": "autre" if page_prices and not on_page else "bleu",
                  "source": "lu dans la page Énergie" if page_prices else None},
        "tarif_bleu": {**regulated, "abonnement": tariff.regulated_subscription(c.table, today, chosen_option, chosen_kva)},
        "prix_page": page_prices,
        "export_price": {"valeur": export, "source": "lu dans la page Énergie" if export is not None else None},
        "water_price": {"valeur": water, "source": "lu dans la page Énergie" if water is not None else None},
        "margin": {"valeur": 0.1, "source": "par défaut"},
        "sac_kg": (pellets or {}).get("bag_kg"),
        "notify": [{"id": f"notify.{n}", "nom": n.replace("mobile_app_", "").replace("_", " ").capitalize()} for n in services],
        "a": {"revente": bool(page and page.exports), "eau": bool(page and page.water),
              "poele": bool(pellets) or any(_stove(m, c) for m in (page.gas if page else [])),
              "delestage": "versatile_thermostat" in hass.config.components and c.used("vt"),
              "un_compteur": bool(page) and not {"hp", "hc"} <= periods},
    }
