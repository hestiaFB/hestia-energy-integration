# Hestia Énergie — intégration

[![release](https://img.shields.io/github/v/release/hestiaFB/hestia-energy-integration?include_prereleases&cacheSeconds=3600)](https://github.com/hestiaFB/hestia-energy-integration/releases)
[![Validate](https://github.com/hestiaFB/hestia-energy-integration/actions/workflows/validate.yml/badge.svg)](https://github.com/hestiaFB/hestia-energy-integration/actions/workflows/validate.yml)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange)](https://hacs.xyz)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/hestiaFB)
[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-frankblemont-FFDD00?logo=buymeacoffee&logoColor=black)](https://www.buymeacoffee.com/frankblemont)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-00457C?logo=paypal&logoColor=white)](https://paypal.me/frankblemont)

**Le conseiller énergie de la maison.** Hestia Énergie lit ce que votre Home Assistant sait déjà de votre consommation. Elle dit en euros où part l’argent de l’électricité et de l’eau, ce qui tourne la nuit, et ce qui ferait économiser.

> **Préversion (bêta) 1.0.0b1.** Elle tourne chaque jour sur une vraie maison depuis début novembre 2026. Certains cas n’ont pas encore pu être vérifiés : voir [les limites de cette bêta](#les-limites-de-cette-bêta).

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
- En plus, si vous en avez : des prises mesurées, des panneaux solaires, un compteur d’eau, un poêle à granulés suivi par Suivi Stock Pellet. Voir [les extensions](#les-extensions).

## Installation

### 1. Ajouter le dépôt

Ajoutez le dépôt personnalisé `https://github.com/hestiaFB/hestia-energy-integration`, catégorie **Intégration** :

- Home Assistant 2026.11 ou plus récent : dans le **Marketplace** (Paramètres → Marketplace). Il demande d’abord de relier un compte GitHub.
- Avant 2026.11 : dans HACS, ⋮ → **Dépôts personnalisés**.

[![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=hestiaFB&repository=hestia-energy-integration&category=integration)

**Résultat** : **Hestia Energy** (son nom dans HACS) apparaît dans la liste.

### 2. Installer, puis redémarrer

Installez **Hestia Energy**. C’est une préversion : cochez d’abord **Afficher les versions bêta** dans la fenêtre de téléchargement. Puis redémarrez Home Assistant.

**Résultat** : après le redémarrage, rien ne change encore à l’écran. C’est normal.

### 3. Vérifier la source de consommation

Ouvrez **Paramètres → Tableaux de bord → Énergie** (la page Énergie de Home Assistant). Dans **Réseau électrique**, il faut au moins un compteur de consommation.

- Il y en a un : passez à l’étape 4.
- Il n’y en a pas : installez d’abord HA Linky (le plus simple, sans rien acheter), déclarez-le dans la page Énergie, puis revenez.

Hestia Énergie lit cette page telle qu’elle est. Les sources se déclarent toujours là, jamais dans Hestia.

### 4. Ajouter l’intégration

**Paramètres → Appareils et services → Ajouter une intégration → Hestia Energy**, puis **Valider**.

**Résultat** : une entrée « Ma maison » est créée. Le panneau **Hestia-FB** apparaît dans la barre latérale, avec l’onglet **Énergie**.

Pas de source à l’étape 3 ? L’assistant refuse et montre les trois chemins les plus courts. Ajoutez une source, puis validez de nouveau.

### 5. Relire le contrat

Ouvrez **Hestia-FB → Énergie → Réglages**. Chaque valeur est déjà remplie par ce qu’Hestia a trouvé, avec sa provenance (« trouvée sur le compteur », « lu dans la page Énergie ») :

- l’option : Base, heures pleines / heures creuses, ou Tempo ;
- les plages d’heures creuses, par exemple de 0 h 15 à 8 h 15 ;
- la puissance souscrite, par exemple 9 kVA ;
- les prix : ceux du Tarif Bleu d’EDF, ou ceux d’une autre offre.

Comparez avec votre facture et corrigez si besoin. **Rétablir** remet la valeur trouvée.

**Résultat** : les euros de la **Vue d’ensemble** suivent votre contrat. Exemple : « Depuis le 1er : 29 € ».

### 6. Ajouter une carte

Sur un tableau de bord : **Modifier → Ajouter une carte → Hestia Énergie**. Choisissez le format (voir [les cartes](#les-cartes)), puis **Enregistrer**.

La carte est fournie par l’intégration : rien d’autre à installer.

**Résultat** : la carte montre tout de suite ce que la maison a coûté. Avec un Linky seul, c’est le dernier jour envoyé par Enedis : « Vendredi, la maison a coûté 3,53 € ».

### Quand les chiffres arrivent

- **Tout de suite** : les euros du jour, du mois et des douze derniers mois, si l’historique existe déjà dans Home Assistant.
- **Après 7 nuits** mesurées heure par heure : ce qui tourne la nuit, et le conseil sur l’option du contrat.
- **Avec Hestia Météo, après quelques semaines d’hiver** : le prix d’un degré de chauffage en moins.

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

## Les cartes

Une seule carte, **Hestia Énergie**, en plusieurs formats. Chacun répond à une question, sur une seule période :

| Format | Ce qu’il montre |
| --- | --- |
| **Complète** (par défaut) | En ce moment, aujourd’hui, ce mois-ci, puis « En détail » : un appui sur un encart ouvre sa carte de détail. Jusqu’à 3 conseils « Pour économiser ». |
| **Tuile** | En ce moment : une phrase, un chiffre. « La maison consomme 1,3 kW. » Quand il n’y a rien à faire, le meilleur conseil. |
| **Conseils** | Ce qui ferait économiser, en euros par an, du plus rentable au moins rentable. |
| **Soleil** | Ce que les panneaux ont produit aujourd’hui, groupe par groupe. |
| **Chauffage** | Ce qu’a coûté la saison, depuis le 1er octobre : radiateurs et poêle. |
| **Veille** | Ce qui tourne la nuit, sur les 30 dernières nuits, et ce que ça coûte par an. |
| **Eau** | Les litres et les euros du mois, jour par jour. |
| **Appareils** | Ce que chaque appareil a consommé aujourd’hui, en kWh et en euros. |
| **Pointe** | La plus forte puissance prise aujourd’hui, face à votre abonnement. |
| **Contrat** | Vos heures creuses et vos prix ce mois-ci, et ce qu’aurait coûté l’option Base. |

Une carte de détail répond d’abord en une phrase, avec son chiffre en gras, puis dit pourquoi. Exemple, la carte Veille : « Quand tout dort, la maison consomme 190 W. Cela fait environ 330 € par an. »

Un format que votre maison ne peut pas remplir le dit simplement : sans panneaux, la carte Soleil n’a rien à montrer.

En YAML, si vous préférez :

```yaml
type: custom:hestia-energy-card
card: tuile
```

`card` vaut `complete`, `tuile`, `conseils`, `soleil`, `chauffage`, `veille`, `eau`, `appareils`, `pointe` ou `contrat`. `name` (facultatif) change le titre.

La couleur dit s’il y a quelque chose à faire :

- **bleu** : rien à faire, tout va bien ;
- **vert** : un bénéfice à saisir (le soleil produit, c’est le bon moment) ;
- **orange** : un geste conseillé maintenant ;
- **rouge** : urgent (l’eau coule sans s’arrêter).

## L’onglet Énergie du panneau Hestia-FB

Tout se règle dans le panneau **Hestia-FB** de la barre latérale, onglet **Énergie**. Pas de YAML, pas de nom d’entité à connaître.

- **Vue d’ensemble** : ce que fait Énergie, avec un exemple tiré de votre maison ; ce qui reste à régler et sa cause probable ; trois chiffres (depuis le 1er, prévu ce mois-ci, part du soleil) ; ce qui ferait économiser ; les derniers bilans.
- **Sources** : une ligne par chose mesurée (électricité achetée, revendue, soleil, poêle, eau), d’où elle vient, comparée à Enedis, et ce qu’Hestia a corrigé.
- **Appareils** : les appareils de la page Énergie, rangés par usage (modifiable), avec les euros du mois dernier. Cette page n’apparaît que si vous en avez.
- **Réglages** : le contrat, les prix, l’eau, les granulés, les notifications. Chaque valeur est pré-remplie, avec **Rétablir**.
- **Extensions** : une ligne et un interrupteur par extension.
- **Bilan** : les 12 derniers mois en euros, le soleil et la revente, le chauffage et l’eau.
- **À propos** : les versions, la date des tarifs, les liens.

### Les notifications

Aucune par défaut. Dans **Réglages**, choisissez à qui les envoyer et à quelle heure (8 h par défaut), puis cochez celles que vous voulez :

- le bilan d’hier, chaque matin : « Hier : 3,72 € — 18 kWh · le soleil a couvert 17 % » ;
- le bilan de la semaine, le lundi ; celui du mois, le 1er ;
- la fuite d’eau et l’appareil oublié, envoyés tout de suite.

## Le contrat et les prix

- **Les tarifs réglementés (Tarif Bleu d’EDF) sont dans l’intégration** : Base, heures pleines / heures creuses et Tempo, abonnements compris, tels que la Commission de régulation de l’énergie les publie depuis 2012. Chaque jour passé est compté au prix de son époque. Cette version a les tarifs du 1er août 2026 ; ils sont mis à jour avec chaque nouvelle version.
- **Une autre offre ?** Dans **Réglages → Prix du kWh**, choisissez **Une autre offre** et recopiez les prix de votre facture.
- **Les heures creuses** sont lues sur le compteur quand c’est possible, sinon apprises sur la courbe de la maison. Vous pouvez ajouter plusieurs plages.
- **Une maison qui revend** : le prix de revente se règle aussi.

Un prix inconnu reste inconnu : Énergie n’invente jamais un euro.

## Les extensions

Hestia Énergie fonctionne avec la seule page Énergie. Chaque extension installée ajoute des réponses. Elles sont reconnues toutes seules et se coupent une à une dans **Énergie → Extensions** : coupée, une extension est ignorée, sans rien désinstaller.

| Extension | Ce qu’elle apporte |
| --- | --- |
| [Hestia Météo](https://github.com/hestiaFB/hestia-weather-integration) (3.3.0 ou plus récent) | Le froid de chaque jour : votre chauffage comparé à la météo, et le prix d’un degré en moins |
| [HA Linky](https://github.com/bokub/ha-linky) | Les chiffres d’Enedis, qui font foi pour la facture |
| [Linky en direct](https://github.com/hekmon/linkytic) (LiXee, linkytic) | Le prix de l’heure, la pointe, le bon moment pour une machine |
| [RTE Tempo](https://github.com/hekmon/rtetempo) | La couleur du jour et du lendemain, pour l’option Tempo |
| OpenDTU | Chaque panneau, et un secours quand la production manque |
| Comwatt | Les appareils et les pinces mesurés en ligne |
| [Versatile Thermostat](https://github.com/jmcollin78/versatile_thermostat) | Le chauffage en direct, pièce par pièce |
| Suivi Stock Pellet | Les sacs de granulés achetés et brûlés : le poêle en euros |

Hestia Énergie ne commande aucune de ces extensions : elle les lit.

[Hestia Confort](https://github.com/hestiaFB/hestia-comfort-integration) est reconnu, mais ne lit pas encore les prix d’Énergie : ses gestes en euros viendront plus tard.

## Pour vos automatisations

Les entités disent ce que dit la carte. Une entité n’est créée que si votre équipement permet de la remplir : sans Tempo, pas de couleur Tempo.

| Entité | Ce qu’elle dit |
| --- | --- |
| **Coût du jour**, **Coût du mois** | Les euros depuis minuit, depuis le 1er |
| **Prix du moment**, **Période** | Le prix du kWh en ce moment, en euros ; heures pleines, heures creuses ou Base |
| **Heures creuses** | Oui ou non, et l’heure de fin |
| **Puissance de la maison**, **Puissance maximale autorisée** | En direct, en W ; la limite à ne pas dépasser, marge comprise |
| **Pointe proche du disjoncteur** | Oui quand la maison approche de la limite |
| **Veille de nuit** | Ce que tire la maison quand tout dort, en W, et son coût par an |
| **Part du soleil**, **Soleil en trop** | La part de la consommation couverte par les panneaux ; oui quand ils produisent plus que la maison ne consomme |
| **Conseil**, **Couleur du conseil** | Le titre et la couleur de la carte, prête pour une lumière |
| **Couleur Tempo**, **Couleur Tempo de demain** | Bleu, blanc ou rouge |
| **Donnée douteuse** | Oui quand un compteur dit quelque chose d’impossible |

Par exemple : lancer le chauffe-eau quand **Soleil en trop** passe à oui, ou couper un radiateur quand **Pointe proche du disjoncteur** s’allume.

## Noms techniques

Le nom technique de l’intégration est `hestia_energy` : la carte `custom:hestia-energy-card`, les entités `sensor.hestia_energy_…` et `binary_sensor.hestia_energy_…`, l’onglet `/hestia/energie`.

Hestia Énergie partage le panneau **Hestia-FB** et la même charte qu’Hestia Météo et Hestia Confort.

## Langues

Cette bêta parle **français**. L’assistant d’installation et les noms des entités existent aussi en anglais ; les cartes et l’onglet Énergie sont en français pour l’instant.

Les valeurs des entités (Conseil, Période…) restent en français, pour que vos automatisations ne changent pas avec la langue.

> **In English.** Hestia Energy is a home energy advisor for Home Assistant, made for French homes: it reads your Energy page and your Linky meter, and explains your bill in euros. This beta speaks French; the setup and entity names are also in English.

## Les limites de cette bêta

Hestia Énergie conseille. Elle n’allume, n’éteint et ne règle rien.

Pas encore vérifié sur une vraie maison :

- **Tempo** : les couleurs et leurs prix sont comptés, mais aucune maison en Tempo n’a encore servi d’essai.
- **Gaz, bois, fioul** : pas encore comptés. Le poêle à granulés l’est, avec Suivi Stock Pellet.
- **Pompe à chaleur** : sa consommation est comptée avec le reste de l’électricité, mais aucune maison équipée n’a encore servi d’essai.

À savoir aussi :

- **Le conseil « Passez en option Base »** se décide sur les 7 derniers jours connus heure par heure (HA Linky n’en garde pas plus). Prenez-le comme une piste et comparez avec votre facture avant de changer de contrat.
- **Avec un Linky seul**, Énergie voit la maison le lendemain, jamais en direct : pas de geste « en ce moment ».
- **Avec une autre offre que le Tarif Bleu**, les jours passés sont comptés aux prix d’aujourd’hui, faute d’en connaître l’historique.

Prévu pour la 2ᵉ préversion :

- la prévision de production des panneaux, recalée sur ce qu’ils produisent vraiment ;
- la répartition de la consommation par usage ;
- le simulateur de contrat : ce que vous auriez payé avec une autre option.

Un souci, une idée ? [Ouvrez une issue](https://github.com/hestiaFB/hestia-energy-integration/issues).

## Pour les développeurs

```sh
python -m unittest discover -s tests -p 'test_*.py'
cd frontend && npm ci && npm run validate
cd card && npm ci && npm run validate
```

Le moteur (`custom_components/hestia_energy/engine/`) n’importe rien de Home Assistant : il se teste seul, par rejeu de vraies statistiques. La table des tarifs se reconstruit avec `scripts/tarifs_cre.py` à chaque changement de prix (1er février, 1er août).

## Licence

[MIT](LICENSE) — hestiaFB.
