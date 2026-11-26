# Hestia Énergie — intégration

[![release](https://img.shields.io/github/v/release/hestiaFB/hestia-energy-integration?include_prereleases&cacheSeconds=3600)](https://github.com/hestiaFB/hestia-energy-integration/releases)
[![Validate](https://github.com/hestiaFB/hestia-energy-integration/actions/workflows/validate.yml/badge.svg)](https://github.com/hestiaFB/hestia-energy-integration/actions/workflows/validate.yml)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange)](https://hacs.xyz)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/hestiaFB)
[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-frankblemont-FFDD00?logo=buymeacoffee&logoColor=black)](https://www.buymeacoffee.com/frankblemont)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-00457C?logo=paypal&logoColor=white)](https://paypal.me/frankblemont)

<img src="docs/images/icon.png" alt="" width="96" align="right">

**Le conseiller énergie de la maison.** Hestia Énergie lit ce que votre Home Assistant sait déjà de votre consommation. Elle dit en euros où part l’argent de l’électricité et de l’eau, ce qui tourne la nuit, et ce qui ferait économiser.

Elle donne le résultat à **sa carte**, fournie avec elle, et à vos automatisations.

> **Préversion (bêta) 1.0.1b4.** Elle tourne chaque jour sur une vraie maison depuis début novembre 2026. Certains cas n’ont pas encore pu être vérifiés : voir [les limites de cette bêta](#limites).

![Hestia Énergie — l’électricité de la maison, expliquée en euros : la carte complète avec son horloge de la journée, la frise du lave-linge, entre « En ce moment » et « Ce mois-ci »](docs/images/hestia-energy-banner.png)

## Pourquoi

Votre compteur donne des kWh. Votre facture arrive tous les deux mois. Entre les deux, on ne sait pas ce qui coûte.

Hestia Énergie répond aux questions de tous les jours :

- **Combien ?** « Hier, la maison a coûté 3,72 €. » « Ce mois-ci, 64 € prévus. »
- **Où part l’argent ?** Le chauffage, l’eau chaude, les appareils, ce qui tourne la nuit.
- **Qu’est-ce qui cloche ?** Une journée bien plus chère que d’habitude, une fuite d’eau, un appareil oublié.
- **Comment payer moins ?** « Quand tout dort, la maison consomme encore 190 W : environ 330 € par an. »

Elle part de votre contrat et de ce qu’Enedis mesure. Elle conseille ; elle ne commande jamais rien.

## Ce qu’il faut

- Home Assistant **2026.7** ou plus récent.
- **Une source de consommation électrique** dans la page Énergie de Home Assistant. C’est la seule chose obligatoire. Les plus courantes :
  - [HA Linky](https://github.com/bokub/ha-linky) ou [MyElectricalData](https://www.myelectricaldata.fr/) : sans matériel, la consommation de la veille, envoyée par Enedis ;
  - [un module sur le Linky](https://github.com/hekmon/linkytic) (LiXee / ZLinky, linkytic) : la consommation en direct ;
  - tout autre compteur déjà déclaré dans la page Énergie (Shelly EM, pince, onduleur…).
- En plus, si vous en avez : des prises mesurées, des panneaux solaires, un compteur d’eau, un poêle à granulés suivi par Suivi Stock Pellet. Voir [les extensions](docs/extensions.md).

## Installation

1. Ajoutez le dépôt personnalisé `https://github.com/hestiaFB/hestia-energy-integration`, catégorie **Intégration** :
   - Home Assistant 2026.11 ou plus récent : dans le **Marketplace** (Paramètres → Marketplace). Il demande d’abord de relier un compte GitHub.
   - Avant 2026.11 : dans HACS, ⋮ → **Dépôts personnalisés**.
2. Installez **Hestia Energy** (son nom dans HACS), puis redémarrez Home Assistant.
3. Vérifiez que la page Énergie de Home Assistant (**Paramètres → Tableaux de bord → Énergie**) a au moins un compteur de consommation dans **Réseau électrique**.
4. **Paramètres → Appareils et services → Ajouter une intégration → Hestia Energy**, puis **Valider**.
5. Relisez votre contrat dans **Hestia-FB → Énergie → Réglages** : tout est déjà rempli, vous comparez avec votre facture.
6. Sur un tableau de bord : **Ajouter une carte → Hestia Énergie**. La carte est fournie par l’intégration : rien d’autre à installer.

[![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=hestiaFB&repository=hestia-energy-integration&category=integration)

Chaque étape, avec ce que vous devez voir à la fin : [l’installation pas à pas](docs/installation.md).

**Quand les chiffres arrivent** : les euros du jour, du mois et de l’année tout de suite, si l’historique existe déjà dans Home Assistant ; ce qui tourne la nuit et le conseil sur l’option du contrat après 7 nuits mesurées heure par heure ; le prix d’un degré de chauffage en moins après quelques semaines d’hiver, avec Hestia Weather.

## Ce qu’Énergie fait selon votre équipement

Énergie se contente de ce que vous avez. Chaque équipement de plus ajoute des réponses ; le panneau dit lesquelles.

| Vous avez | Énergie vous dit |
| --- | --- |
| **Un Linky lu par HA Linky ou MyElectricalData** (sans matériel) | Les euros de chaque jour, de chaque mois, de l’année. Ce qui tourne la nuit. La journée qui sort de l’ordinaire. Le mois plus cher que l’an dernier. Si l’option heures creuses vous rapporte vraiment. |
| **Un compteur en direct** (module sur le Linky, Shelly EM, pince…) | En plus : ce que consomme la maison en ce moment, le prix de l’heure, le prochain passage en heures creuses, la pointe proche du disjoncteur. |
| **Des prises mesurées** | En plus : chaque appareil en euros, rangé par usage (chauffage, eau chaude, cuisine et linge, le reste), et l’appareil oublié allumé. |
| **Des panneaux solaires** | En plus : la part du soleil, ce qu’il a fait économiser, la revente, et un panneau qui produit moins que d’habitude. |
| **Un compteur d’eau** | En plus : les litres et les euros, jour par jour, et la fuite d’eau. |

Enedis fait foi : quand HA Linky ou MyElectricalData est là, les bilans sont calés sur ses chiffres, même si vos propres compteurs disent un peu autre chose.

## Configuration

Tout se règle dans le panneau **Hestia-FB** de la barre latérale, onglet **Énergie**. Pas de YAML, pas de nom d’entité à connaître. Chaque valeur est déjà remplie avec ce que Home Assistant connaît, et dit d’où elle vient : vous vérifiez, vous corrigez si besoin, **Rétablir** remet la valeur trouvée.

- **Vue d’ensemble** : si tout fonctionne. Ce qui reste à régler, chaque source et quand elle a donné des nouvelles, ce qu’Énergie peut calculer avec votre équipement.
- **Sources** : chaque chose mesurée, d’où elle vient, comparée à Enedis.
- **Bilan** : les euros du mois, les derniers bilans, les 12 derniers mois.
- **Appareils**, **Extensions**, **À propos**.
- **Réglages** : le contrat (Base, heures creuses ou Tempo), les plages d’heures creuses, la puissance, les prix, l’eau, les granulés, les notifications.

Les tarifs réglementés d’EDF (Tarif Bleu) sont dans l’intégration, depuis 2012 : chaque jour passé est compté au prix de son époque. Une autre offre ? Recopiez les prix de votre facture. Un prix inconnu reste inconnu : Énergie n’invente jamais un euro. [L’onglet Énergie en détail](docs/panneau.md) · [Le contrat et les prix](docs/contrat.md).

## La carte

Une seule carte, **Hestia Énergie**, en onze formats : la **complète**, la **tuile**, les **conseils**, et une carte de détail par question (soleil, chauffage, veille, eau, appareils, pointe, contrat, chauffe-eau). Chaque carte répond d’abord en une phrase, avec son chiffre en gras, puis dit pourquoi : « Quand tout dort, la maison consomme 190 W. Cela fait environ 330 € par an. »

Dans la carte complète, **Pour économiser** range les conseils du plus rentable au moins rentable. Le chauffe-eau et chaque machine y ont leur frise de la journée : les heures creuses, le soleil et les heures pleines, l’icône de l’appareil à ses départs habituels, et l’heure à viser. [La carte en détail : formats, frise, couleurs, YAML](docs/cartes.md).

![Hestia Énergie — les formats : la carte complète sur un téléphone, les conseils, la tuile et la carte Pointe](docs/images/hestia-energy-cartes.png)

## Les capteurs et les automatisations

Les entités disent ce que dit la carte : coût du jour et du mois, prix du moment, heures creuses, puissance de la maison, pointe proche du disjoncteur, veille de nuit, part du soleil, soleil en trop, conseil et sa couleur, couleur Tempo. Une entité n’est créée que si votre équipement permet de la remplir.

Par exemple : lancer le chauffe-eau quand **Soleil en trop** passe à oui, ou couper un radiateur quand **Pointe proche du disjoncteur** s’allume. [Toutes les entités](docs/entites.md).

## Le chauffe-eau piloté

Nouveau dans la 1.0.1b1 : Hestia fait le plan de chauffe d’un chauffe-eau sur une prise connectée. Au soleil quand il y en aura, en heures creuses sinon, selon le temps de demain, sans jamais manquer d’eau chaude. Elle ne le commande pas elle-même : un capteur dit quand chauffer, et votre automatisation (un blueprint est fourni) allume la prise. Il démarre en **Simulation** : rien n’est commandé tant que vous ne passez pas en Automatique. [Le chauffe-eau en détail](docs/chauffe-eau.md).

Hestia Énergie reconnaît seule HA Linky, linkytic, RTE Tempo, OpenDTU, Comwatt, Versatile Thermostat, Suivi Stock Pellet et Hestia Weather. Elle les lit, ne les commande jamais, et chacune se coupe d’un interrupteur. [Les extensions](docs/extensions.md).

## Langues

Cette bêta parle **français**. L’assistant d’installation et les noms des entités existent aussi en anglais ; les cartes et l’onglet Énergie sont en français pour l’instant.

Les valeurs des entités (Conseil, Période…) restent en français, pour que vos automatisations ne changent pas avec la langue.

> **In English.** Hestia Energy is a home energy advisor for Home Assistant, made for French homes: it reads your Energy page and your Linky meter, and explains your bill in euros. This beta speaks French; the setup and entity names are also in English.

## Documentation

| Page | Ce qu’elle explique |
| --- | --- |
| [L’installation pas à pas](docs/installation.md) | Les six étapes et ce que vous devez voir à chacune, quand les chiffres arrivent, ce qu’Énergie fait selon votre équipement |
| [La carte](docs/cartes.md) | les onze formats, la carte complète de haut en bas, la frise d’un appareil, les couleurs, le YAML |
| [L’onglet Énergie](docs/panneau.md) | Les pages du panneau Hestia-FB et les notifications |
| [Le contrat et les prix](docs/contrat.md) | Le Tarif Bleu intégré, une autre offre, les heures creuses, la revente |
| [Les extensions](docs/extensions.md) | Ce que chaque intégration reconnue apporte |
| [Le chauffe-eau piloté](docs/chauffe-eau.md) | Le plan de chauffe, les modes, le blueprint, les entités |
| [Les entités](docs/entites.md) | Chaque entité et ce qu’elle dit, pour vos automatisations |
| [Pour les développeurs](docs/technique.md) | Les tests, le moteur, la table des tarifs |
| [Le plan d’optimisation](docs/PLAN-OPTIMISATION.md) | Les mesures sur un vrai Home Assistant et ce qui a été allégé |

## Limites

Hestia Énergie conseille. Elle n’allume, n’éteint et ne règle rien : même pour le chauffe-eau, c’est votre automatisation qui commande la prise.

Pas encore vérifié sur une vraie maison :

- **Le chauffe-eau piloté** (1.0.1b1) : il démarre en Simulation, pour regarder ses plans avant de lui confier la prise.
- **Tempo** : les couleurs et leurs prix sont comptés, mais aucune maison en Tempo n’a encore servi d’essai.
- **Gaz, bois, fioul** : pas encore comptés. Le poêle à granulés l’est, avec Suivi Stock Pellet.
- **Pompe à chaleur** : sa consommation est comptée avec le reste de l’électricité, mais aucune maison équipée n’a encore servi d’essai.

À savoir aussi :

- **Le conseil « Passez en option Base »** se décide sur les 7 derniers jours connus heure par heure (HA Linky n’en garde pas plus). Prenez-le comme une piste et comparez avec votre facture avant de changer de contrat.
- **Avec un Linky seul**, Énergie voit la maison le lendemain, jamais en direct : pas de geste « en ce moment ».
- **Avec une autre offre que le Tarif Bleu**, les jours passés sont comptés aux prix d’aujourd’hui, faute d’en connaître l’historique.

Prévu ensuite :

- la prévision de production des panneaux, recalée sur ce qu’ils produisent vraiment ;
- la répartition de la consommation par usage ;
- le simulateur de contrat : ce que vous auriez payé avec une autre offre (aujourd’hui, seule l’option Base est comparée).

Un souci, une idée ? [Ouvrez une issue](https://github.com/hestiaFB/hestia-energy-integration/issues).

## Noms techniques

Le nom technique de l’intégration est `hestia_energy` : la carte `custom:hestia-energy-card`, les entités `sensor.hestia_energy_…` et `binary_sensor.hestia_energy_…`, l’onglet `/hestia/energie`.

Hestia Énergie partage le panneau **Hestia-FB** et la même charte qu’Hestia Weather et Hestia Confort.

## Licence

[MIT](LICENSE) — hestiaFB.
