# Installer Hestia Énergie, pas à pas

Six étapes, chacune avec ce que vous devez voir à la fin. Comptez dix minutes, sans redémarrage en dehors de l’étape 2.

## 1. Ajouter le dépôt

Ajoutez le dépôt personnalisé `https://github.com/hestiaFB/hestia-energy-integration`, catégorie **Intégration** :

- Home Assistant 2026.11 ou plus récent : dans le **Marketplace** (Paramètres → Marketplace). Il demande d’abord de relier un compte GitHub.
- Avant 2026.11 : dans HACS, ⋮ → **Dépôts personnalisés**.

[![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=hestiaFB&repository=hestia-energy-integration&category=integration)

**Résultat** : **Hestia Energy** (son nom dans HACS) apparaît dans la liste.

## 2. Installer, puis redémarrer

Installez **Hestia Energy**. C’est une préversion : cochez d’abord **Afficher les versions bêta** dans la fenêtre de téléchargement. Puis redémarrez Home Assistant.

**Résultat** : après le redémarrage, rien ne change encore à l’écran. C’est normal.

## 3. Vérifier la source de consommation

Ouvrez **Paramètres → Tableaux de bord → Énergie** (la page Énergie de Home Assistant). Dans **Réseau électrique**, il faut au moins un compteur de consommation.

- Il y en a un : passez à l’étape 4.
- Il n’y en a pas : installez d’abord HA Linky (le plus simple, sans rien acheter), déclarez-le dans la page Énergie, puis revenez.

Hestia Énergie lit cette page telle qu’elle est. Les sources se déclarent toujours là, jamais dans Hestia.

## 4. Ajouter l’intégration

**Paramètres → Appareils et services → Ajouter une intégration → Hestia Energy**, puis **Valider**.

**Résultat** : une entrée « Ma maison » est créée. Le panneau **Hestia-FB** apparaît dans la barre latérale, avec l’onglet **Énergie**.

Pas de source à l’étape 3 ? L’assistant refuse et montre les trois chemins les plus courts. Ajoutez une source, puis validez de nouveau.

## 5. Relire le contrat

Ouvrez **Hestia-FB → Énergie → Réglages**. Chaque valeur est déjà remplie par ce qu’Hestia a trouvé, avec sa provenance (« trouvée sur le compteur », « lu dans la page Énergie ») :

- l’option : Base, heures pleines / heures creuses, ou Tempo ;
- les plages d’heures creuses, par exemple de 0 h 15 à 8 h 15 ;
- la puissance souscrite, par exemple 9 kVA ;
- les prix : ceux du Tarif Bleu d’EDF, ou ceux d’une autre offre.

Comparez avec votre facture et corrigez si besoin. **Rétablir** remet la valeur trouvée.

**Résultat** : les euros de la **Vue d’ensemble** suivent votre contrat. Exemple : « Depuis le 1er : 29 € ».

## 6. Ajouter une carte

Sur un tableau de bord : **Modifier → Ajouter une carte → Hestia Énergie**. Choisissez le format (voir [les cartes](cartes.md)), puis **Enregistrer**.

La carte est fournie par l’intégration : rien d’autre à installer.

**Résultat** : la carte montre tout de suite ce que la maison a coûté. Avec un Linky seul, c’est le dernier jour envoyé par Enedis : « Vendredi, la maison a coûté 3,53 € ».

## Quand les chiffres arrivent

- **Tout de suite** : les euros du jour, du mois et des douze derniers mois, si l’historique existe déjà dans Home Assistant.
- **Après 7 nuits** mesurées heure par heure : ce qui tourne la nuit, et le conseil sur l’option du contrat.
- **Avec Hestia Chauffage** : ce qu’a coûté le chauffage, qu’elle compte elle-même.

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

[← Retour au README](../README.md)
