## 1.0.0b1 — Le conseiller énergie de la maison

### Nouveautés

- Première préversion d’Hestia Énergie, la troisième brique d’Hestia-FB, avec Hestia Météo et Hestia Confort.
- Il suffit d’une source de consommation dans la page Énergie de Home Assistant : HA Linky, MyElectricalData, un module sur le Linky ou tout autre compteur. Sans elle, l’assistant montre les trois chemins les plus courts.
- Les euros de chaque jour, de chaque mois et des 12 derniers mois, même avec un Linky seul. Quand Enedis est lu, il fait foi.
- Les tarifs réglementés (Tarif Bleu d’EDF : Base, heures pleines / heures creuses, Tempo) sont dans l’intégration, depuis 2012 : chaque jour passé est compté au prix de son époque.
- Le contrat est trouvé tout seul : option, heures creuses lues sur le compteur ou apprises sur la courbe, puissance souscrite. Tout reste modifiable, avec « Rétablir ».
- Des conseils pour économiser, avec les euros en jeu : ce qui tourne la nuit, un degré de chauffage en moins (avec Hestia Météo), l’option Base quand les heures creuses ne rapportent pas, la journée qui sort de l’ordinaire, le mois plus cher que l’an dernier.
- Avec Hestia Météo, le froid de chaque jour pour le chauffage. Avec plusieurs lieux, celui de la maison se choisit dans Extensions › Hestia Météo ; si le froid manque, Énergie dit pourquoi dans « À régler ».
- Avec un compteur en direct : ce que consomme la maison, le prix de l’heure, le prochain passage en heures creuses, la pointe proche du disjoncteur.
- La fuite d’eau et l’appareil oublié allumé sont signalés.
- Le soleil : la part couverte par les panneaux, la revente, et un panneau qui produit moins que d’habitude.
- Le chauffage de la saison : radiateurs, et poêle à granulés avec Suivi Stock Pellet.
- La carte Hestia Énergie : complète, tuile, conseils, et sept cartes de détail (soleil, chauffage, veille, eau, appareils, pointe, contrat). Chacune répond en une phrase, sur une seule période.
- L’onglet Énergie du panneau Hestia-FB : vue d’ensemble, sources, appareils, réglages, extensions, bilan, à propos.
- Les bilans d’hier, de la semaine et du mois, et les alertes, en notification si vous le voulez (aucune par défaut).
- Des entités pour vos automatisations : coût du jour et du mois, prix du moment, heures creuses, veille de nuit, soleil en trop, pointe proche, conseil et sa couleur.
