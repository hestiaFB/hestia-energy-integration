"""The banner's sentences, as written in PHRASES.md (§ 2): the engine picks a situation, it never writes a sentence.

Each id has its colour and its two lines (the gesture in bold, then why). `{…}` are filled by the engine; `[…]` parts
are said only when their values are known. English and German come with the translations (lot 8.7).
"""
from __future__ import annotations

import re

URGENT, GESTE, BENEFICE, RIEN = "rouge", "orange", "vert", "bleu"

BANNER = {
    "fuite_eau": (URGENT, "L'eau coule sans s'arrêter depuis {duree}.",
                  "Vérifiez les robinets et la chasse d'eau : {litres_par_jour} L par jour si ça continue."),
    "disjoncteur": (URGENT, "La maison est au bord du disjoncteur.",
                    "{appareils_en_marche} tournent ensemble : attendez avant d'en lancer un autre."),
    "jour_rouge_demain": (GESTE, "Demain jour rouge : préparez ce soir.",
                          "{appareils_decalables} cette nuit, en heures creuses."),
    "jour_rouge": (GESTE, "Jour rouge jusqu'à 22 h[ : l'électricité coûte {facteur} fois plus].",
                   "Les machines attendront ce soir."),
    "machines_ensemble": (GESTE, "Trop de machines en même temps : le soleil ne suit pas.",
                          "La prochaine fois, lancez-les l'une après l'autre."),
    "machine_sans_soleil": (GESTE, "Pas assez de soleil pour {machine}.",
                            "La prochaine fois, attendez vers {heure_pic}."),
    "machine_heures_pleines": (GESTE, "Heures pleines pour {machine}.",
                               "La prochaine fois, attendez les heures creuses ({heure_hc})."),
    "chauffe_eau_reseau": (GESTE, "Le chauffe-eau chauffe en partie au réseau.",
                           "Soleil d'abord, sinon les heures creuses[ : {euros} € par an à gagner]."),
    "oublie": (GESTE, "{appareil} est allumé depuis {duree}.", "Oublié ?"),
    "poele_moins_cher": (GESTE, "Le poêle chaufferait {facteur} fois moins cher que les radiateurs.",
                         "[Ce soir,] allumez-le plutôt."),
    "soleil_en_trop": (BENEFICE, "Bon moment pour lancer une machine : le soleil est en trop.",
                       "{surplus} kW partent au réseau pour presque rien."),
    "soleil_machine_ok": (BENEFICE, "Parfait : {machine} tourne au soleil.", ""),
    "soleil_chaleur": (BENEFICE, "Le soleil chauffe gratuitement : +1 °C maintenant, la maison le gardera ce soir.", ""),
    "rien_hc_bientot": (RIEN, "Rien à faire.", "Heures creuses à {heure_hc} : les machines après."),
    "rien_hc": (RIEN, "Rien à faire.", "Heures creuses jusqu'à {heure_fin} : c'est le bon moment pour les machines."),
    "rien_soleil_juste": (RIEN, "Rien à faire.", "Le soleil couvre la maison ; une machine de plus passerait au réseau."),
    "rien_soleil_petit": (RIEN, "Rien à faire.", "Un peu de soleil en trop : assez pour un petit appareil."),
    "rien_soleil_plus_tard": (RIEN, "Rien à faire.", "Soleil attendu vers {heure_pic} : gardez les machines pour ce moment."),
    "rien": (RIEN, "Rien à faire.", ""),
}

# « À froid » (Frank, 9 Nov. 2026): what to change in the habits or the contract, with the euros at stake; not the
# banner's gestures of the moment (engine/daily.py). Each: the gesture, then why, with its figure.
# The euros at stake are shown beside the gesture (maquette des cartes 3), « par an » or « par hiver ».
PISTES = {
    "jour_inhabituel": ("Regardez ce qui a tourné {jour}",
                        "La maison a consommé {kwh} kWh au lieu de {habitude}[ pour ce froid][, {euros} € de plus].", None),
    "contrat_base": ("Passez en option Base",
                     "Seulement {part} % de vos achats tombent en heures creuses ; elles rapportent à partir de {seuil} % "
                     "(mesuré sur {jours} jours).", "par an"),
    "veille_haute": ("Cherchez ce qui tourne la nuit", "Quand tout dort, la maison consomme encore {w} W.", "par an"),
    "budget_mois": ("Ce mois coûte plus que d'habitude",
                    "Au rythme actuel, environ {euros} € : {ecart} € de plus qu'en {mois} dernier.", None),
}
# « Pour économiser » as maquette D says it (Frank, 19 Nov. 2026): what is done today, then what would be better.
BETTER = {
    "veille_haute": ("Quand tout dort, la maison consomme encore {w} W, jour et nuit : {euros} € par an.",
                     "Faites le tour avec les prises : box, écrans en veille, appareils oubliés. Coupez ce qui ne sert pas la nuit."),
}
# The tile's chip (PHRASES.md § 4): « Rien à faire », « À revoir », « Bon moment », « Demain rouge », « Urgent ».
CHIP = {URGENT: "Urgent", GESTE: "À revoir", BENEFICE: "Bon moment", RIEN: "Rien à faire"}
CHIP_OF = {"jour_rouge_demain": "Demain rouge", "jour_rouge": "Jour rouge"}

_OPTIONAL = re.compile(r"\[([^\]]*)\]")
_FIELD = re.compile(r"\{(\w+)\}")


def fill(template: str, values: dict) -> str:
    """The sentence with its values. An optional part is said when its values are known; one without values (« [Ce
    soir,] ») only when the engine lists it in `values["avec"]`. A required value missing raises: never a hole."""
    def optional(match):
        part = match.group(1)
        fields = _FIELD.findall(part)
        keep = all(values.get(f) is not None for f in fields) if fields else part in values.get("avec", ())
        return part.format(**values) if keep else ""
    text = _OPTIONAL.sub(optional, template)
    missing = [f for f in _FIELD.findall(text) if values.get(f) is None]
    if missing:
        raise KeyError(f"valeurs manquantes : {', '.join(missing)}")
    text = " ".join(text.format(**values).split())
    return text[:1].upper() + text[1:]


def banner(id: str, values: dict | None = None) -> dict:
    colour, first, second = BANNER[id]
    values = values or {}
    return {"id": id, "couleur": colour, "pastille": CHIP_OF.get(id, CHIP[colour]), "titre": fill(first, values), "pourquoi": fill(second, values)}


# « À savoir » (PHRASES.md § 3): three rubrics, one line each at most.
KNOW = {
    "hc_plages": "Heures creuses de {h1} à {h2}[ et de {h3} à {h4}][ en semaine, toute la journée le week-end et les jours fériés].",
    "hc_dans": "Heures creuses dans {minutes} min.",
    "revente_vaut_peu": "Un kWh gardé vaut {facteur} fois un kWh revendu.",
    "veille_hausse": "La nuit, {logement} consomme plus qu'en {mois} : environ {euros} € de plus par an.",
    "capteur_douteux": "Un compteur est à régler : voir « À régler » dans l'onglet Énergie.",
    "budget": "Au rythme actuel, le mois finira à {euros} €.",
    "soleil_garde": "Hier, la maison a gardé {pourcent} % de son soleil.",
    "soleil_evite": "Ce mois, le soleil a évité {euros} € d'achats.",
    # 5.1: yesterday against the usual day (for its cold when the heating is known), the gap in kWh and euros.
    "jour_plus": "Hier, la maison a consommé {kwh} kWh : {ecart} de plus que d'habitude[, environ {euros} €].",
    "jour_plus_froid": "Hier, la maison a consommé {kwh} kWh : {ecart} de plus que d'habitude pour ce froid[, environ {euros} €].",
    "jour_moins": "Hier, la maison a consommé {ecart} kWh de moins que d'habitude.",
    # 5.5: the panels' health.
    "panneau_retrait": "Hier, le panneau {nom} a produit {pourcent} % de moins que d'habitude.",
    "onduleur_muet": "L'onduleur ne répond plus depuis {duree}, alors que le soleil est levé.",
}
KNOW_TITLES = {"geste": "Pour le geste", "surveiller": "À surveiller", "appris": "Appris"}

# The reviews of yesterday, last week, last month (2.9; PHRASES.md § 6 `n_bilan`): a title with the euros, one line.
REVIEW_TITLES = {"hier": "Hier : {euros} €", "semaine": "La semaine dernière : {euros} €", "mois": "{mois} : {euros} €"}
REVIEW_TITLES_KWH = {"hier": "Hier : {kwh} kWh", "semaine": "La semaine dernière : {kwh} kWh", "mois": "{mois} : {kwh} kWh"}
REVIEW_TEXT = "{kwh} kWh[ · le soleil a couvert {pourcent} %][ · {ecart} € de {sens} que {repere}]."
WEEKDAYS = ("lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche")

# The panel (PHRASES.md § 7): Hestia speaks of what it does with the data.
PANEL = {
    "p_capteur_fige": "« {capteur} » reste à {valeur} depuis {duree} alors que {preuve}. Hestia l'a écarté et lit {autre}.",
    "p_capteur_fige_stats": "« {capteur} » est resté à {valeur} {unite} pendant {heures} h alors que son compteur avançait.",
    "p_compteur_saut": "« {capteur} » a sauté jusqu'à {valeur} kWh en une heure ({fois} fois). Hestia écarte ces heures et lit le reste de ses statistiques.",
    "p_fausse_source": "La source « {nom} » est déclarée en gaz dans la page Énergie. Est-ce du gaz, ou des granulés ?",
    "p_cloud_retard": "{source} arrive avec {duree_h} h de retard dans ses statistiques : écartée pour le direct, gardée pour les bilans.",
    "p_unite": "« {capteur} » compte en Wh, pas en kWh : Hestia le divise par {facteur}.",
    "p_depuis": "« {capteur} » n'existe que depuis le {date} : ses bilans commencent ce jour-là.",
    "p_sans_statistiques": "« {nom} » n'a pas de statistiques : Home Assistant ne le garde pas dans le temps.",
    "p_somme_impossible": "Les appareils mesurés ont dépassé la maison entière {jours} jour(s) : un compteur compte double.",
    "p_reference_ecart": "{source}, qui fait foi pour la facture, compte {pourcent} % de {sens} que vos compteurs pour {quoi} ({jours} jours comparés).",
    "p_reference_jours": "{jours} jour(s) où vos compteurs s'écartent nettement d'Enedis pour {quoi}, dont le {date} : {page} kWh contre {enedis}.",
    "p_soleil_onduleurs": "La production de la page Énergie manquait {heures} h : Hestia a lu les onduleurs à la place.",
    "p_soleil_manquant": "La production n'a pas été mesurée {jours} jour(s) alors que les panneaux produisaient : ces jours-là n'ont pas de bilan complet.",
}

# The same, in the hub's card of the source or device it is about (H6): its name is the card's title, not repeated.
SHORT = {
    "p_capteur_fige_stats": "Sa puissance est restée à {valeur} {unite} pendant {heures} h alors que son compteur avançait.",
    "p_compteur_saut": "A sauté jusqu'à {valeur} kWh en une heure, {fois} fois : ces heures sont écartées.",
    "p_cloud_retard": "Arrive avec {duree_h} h de retard : gardé pour les bilans, pas pour le direct.",
    "p_unite": "Compte en Wh, pas en kWh : Hestia le divise par {facteur}.",
    "p_depuis": "N'existe que depuis le {date} : ses bilans commencent ce jour-là.",
    "p_sans_statistiques": "N'a pas de statistiques : Home Assistant ne le garde pas dans le temps.",
}
_MONTHS = ("janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre")


# What only the household can mend (« À régler »); the rest Hestia mends by itself and shows in « Sources ».
TO_MEND = {"p_fausse_source", "p_unite", "p_sans_statistiques", "p_somme_impossible", "p_capteur_fige"}


def number(value: float, digits: int = 0) -> str:
    """« 1 078 », « 5 484,4 »: French digits (narrow no-break space between thousands)."""
    text = f"{value:,.{digits}f}".replace(",", "\u202f").replace(".", ",")
    return text


def month_name(number: int) -> str:
    return _MONTHS[number - 1]


def euros(value: float) -> str:
    """PHRASES.md rule 7: € to the cent under 10 €, to the euro above."""
    text = f"{value:.2f}" if abs(value) < 10 else f"{value:.0f}"
    return text.replace(".", ",")


def short(id: str, values: dict) -> str | None:
    """The finding in the card of its source or device, else its panel sentence."""
    template = SHORT.get(id)
    if template is None:
        return panel(id, values)
    try:
        return fill(template, values)
    except (KeyError, ValueError, IndexError):
        return panel(id, values)


def panel(id: str, values: dict) -> str | None:
    template = PANEL.get(id)
    if template is None:
        return None
    try:
        return fill(template, values)
    except (KeyError, ValueError, IndexError):
        return None


def know(id: str, values: dict) -> str:
    return fill(KNOW[id], values)
