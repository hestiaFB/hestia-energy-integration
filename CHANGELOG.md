# Journal des versions — Hestia Énergie

## 1.0.0b1 — en construction

Première préversion (paliers 0 et 1). Pas encore publiée.

### Le froid de chaque jour, avec plusieurs lieux dans Hestia Météo (17 nov. 2026)
- Corrigé : avec deux lieux ou plus dans Hestia Météo, Énergie ne recevait aucun degré-jour et le chauffage restait « en apprentissage » sans rien dire. Énergie demande maintenant le froid d'un lieu précis.
- Le lieu se choisit dans Extensions › Hestia Météo. En attendant, Énergie prend le premier lieu et le dit dans « À régler ».
- Énergie vérifie que Hestia Météo parle la même version de son interface (version 1), et se déclare auprès d'elle : les réglages de Hestia Météo montrent Énergie reliée à ce lieu.
- Quand le froid manque, Énergie dit pourquoi (Hestia Météo trop ancienne, d'une autre version, sans lieu, ou sans capteur de température pour les jours passés), dans « À régler », sur la page de l'extension et sur la carte Chauffage.
- Changer de lieu relit le froid de la nouvelle maison au lieu de mélanger les deux.

### Onglet Énergie refait (maquette du hub, 8 nov. 2026)
- Le même menu que Confort et Météo : Vue d'ensemble · Sources · Appareils · Réglages · Extensions · Bilan · À propos. La page Contrat disparaît : ses réglages sont dans Réglages. Appareils n'apparaît que s'il y en a.
- Vue d'ensemble : ce que fait Énergie avec un exemple tiré de la maison, ce qui reste à régler (avec sa cause probable), trois chiffres, ce qui apporterait plus, les derniers bilans. Le mot « palier » disparaît.
- Sources : une ligne par chose mesurée (électricité achetée, revendue, soleil, poêle, eau), d'où elle vient, comparée à Enedis, et ce qu'Hestia a corrigé.
- Appareils : rangés par usage (Chauffage, Eau chaude, Cuisine et linge, Le reste), devinés d'après leur nom et modifiables ; les euros du mois dernier et la puissance en direct.
- Réglages : chaque valeur pré-remplie par ce qu'Hestia a trouvé (« trouvée sur le compteur », « lu dans la page Énergie »), « Rétablir » une fois changée ; plusieurs plages d'heures creuses ; une autre offre que le Tarif Bleu ; prix du mètre cube d'eau ; notifications choisies une à une, avec l'alerte de fuite et d'appareil oublié envoyée tout de suite.
- Extensions : une ligne et un interrupteur par extension ; coupée, Énergie l'ignore sans rien désinstaller.
- Bilan : les 12 derniers mois en euros, le soleil et la revente, le chauffage et l'eau.

### Conseils « à froid » et cartes par palier (maquette des cartes 3, 9 nov. 2026)
- Deux sortes de conseils : « En ce moment » (un geste tout de suite, il faut le direct) et « Pour économiser » (changer une habitude ou le contrat, avec les euros en jeu).
- Les conseils à froid, dès un Linky seul : ce qui tourne la nuit (« 409 € par an »), un degré de chauffage en moins (avec Hestia Météo), l'option Base quand les heures creuses ne rapportent pas, le jour qui sort de l'ordinaire, le mois plus cher que l'an dernier.
- Carte complète : section « Pour économiser » (3 conseils au plus) ; pas de bandeau sans direct. Tuile : le meilleur conseil quand il n'y a rien à faire. Nouvelle carte « Conseils » (card: conseils), avec ce qu'un équipement de plus apporterait.
- Hub : les conseils dans « À améliorer », avec leurs euros.
- Avec un Linky seul, la prévision du mois ne compte plus les jours qu'Enedis n'a pas encore envoyés ; la veille se lit dès 7 nuits.

### Cartes refaites (maquette des cartes 2, 8 nov. 2026)
- Chaque carte de détail dit de quoi elle parle et quand (« Soleil · aujourd'hui »), répond en une phrase avec son chiffre, puis dit pourquoi.
- Une seule période par carte : Soleil, Appareils et Pointe aujourd'hui ; Eau et Contrat ce mois-ci ; Veille les 30 dernières nuits ; Chauffage depuis le 1er octobre.
- Carte complète : En ce moment · Aujourd'hui · Ce mois-ci, puis « En détail » ; « À savoir » part dans l'onglet.
- Listes en barres nommées : 5 lignes au plus, plus ce qui tourne, puis « Et N autres ».
- Avec un Linky seul (HA Linky) : la tuile et la carte complète montrent le dernier jour complet envoyé par Enedis (« Vendredi, la maison a coûté 3,53 € ») au lieu d'un « aujourd'hui » vide ; le Contrat dit ce qui est supposé (« Option Base (supposée) ») et mène aux Réglages.
- Énergie ne prend plus son propre capteur « Période » pour celui du compteur : une maison sans module sur le Linky ne se croit plus en direct.
- Nouveau dans la vue : production de chaque groupe de panneaux, radiateurs depuis le 1er octobre, prix d'un degré de froid, granulés restants, ce que chaque appareil tire la nuit, l'eau jour par jour, les appareils depuis minuit, la pointe du jour, la part des heures creuses et ce qu'aurait coûté l'option Base.
