## 1.0.1b5 — Le chauffe-eau prêt avant chaque plage, votre vrai ballon en Simulation

### Nouveautés

- Chauffe-eau : **marche forcée**. Un bouton « Chauffer maintenant » dans la page Chauffe-eau et sur la carte : le chauffe-eau chauffe jusqu’au plein (4 heures au plus), puis le plan reprend. « Arrêter » l’interrompt. Pratique pour une eau chaude tout de suite, ou pour que Hestia voie le ballon plein. En Simulation, rien n’est commandé.

### Corrections

- Chauffe-eau : le ballon est prêt **avant** chaque plage d’eau chaude, comme promis. Avant, le plan ne gardait que le minimum (30 %) : il pouvait arriver au plus bas à 6 h 30 et chauffer pendant la douche. Maintenant, au début de chaque plage, il y a le minimum plus l’eau de la plage. Si le minimum tient déjà, ce complément ne se paie jamais en heures pleines : seulement en heures creuses ou au soleil.
- La nuit, une seule chauffe au lieu de deux : deux chauffes proches sont réunies, même pour quelques centimes de plus. Avant, un peu de soleil prévu à 8 h suffisait à repousser une partie de la chauffe dans la plage du matin.
- Le soir, quand il faut de l’eau pour 19 h, le soleil de midi est choisi s’il coûte moins cher que les heures creuses.
- En Simulation, la réserve montrée est celle de **votre ballon**, suivie d’après ce que le chauffe-eau consomme vraiment : plein quand il s’arrête tout seul en heures creuses, vidé par l’eau du jour. Avant, c’était le ballon que Hestia aurait eu en le pilotant : il ne voyait pas un soir sans eau chaude. Celui du plan reste affiché à côté.
- L’eau du jour est apprise sur une journée **chargée** (celle que 8 jours sur 10 ne dépassent pas), plus sur une journée moyenne : un soir avec plus de douches ne vide plus le ballon sans que Hestia l’ait prévu.

## 1.0.1b4 — Les plages d’eau chaude se règlent sans se mélanger

### Corrections

- Page Chauffe-eau : changer l’heure d’une plage ne change plus celle d’une autre ligne. Les plages restent dans l’ordre où on les a écrites.

## 1.0.1b3 — La batterie dans « En ce moment », des plages d’eau chaude

### Nouveautés

- **La batterie de la maison** dans « En ce moment » : un cercle sous la maison, avec sa charge en % en anneau, et ce qu’elle prend (en charge) ou donne à la maison. La phrase en parle : « Le soleil couvre toute la maison et charge la batterie : 0,4 kW. Elle est à 18 % : pleine vers 18 h 10 à ce rythme. » ou « Le soleil en couvre 27 %, la batterie le reste. Elle est à 78 % : à ce rythme, elle couvre les heures pleines jusqu’à 22 h. » Un jour rouge Tempo, elle dit si la batterie tiendra jusqu’à la fin des heures pleines.
- La charge en % est trouvée toute seule, sur l’appareil de la batterie (son onduleur). La capacité est apprise au fil des charges. Les deux se corrigent par l’action `hestia_energy.set_settings` (`battery_soc`, `battery_kwh`) si Hestia s’est trompée.

### Améliorations

- Chauffe-eau : les moments d’eau chaude deviennent des **plages** (par défaut de 6 h à 9 h et de 19 h à 23 h), réglées dans la page Chauffe-eau sous « Quand on tire l’eau chaude ». On ne sait jamais à la minute quand on prend sa douche : le ballon est assez chaud dès le début de chaque plage, et l’eau du jour est tirée tout au long de la plage. Une heure seule, réglée avant, compte comme une plage d’une heure.

- Carte Chauffe-eau refaite : le graphique se lit à toutes les largeurs (les textes gardent leur taille, plus rien ne se chevauche), les plages d’eau chaude sont des bandes, et la légende dit tout, ligne pointillée « jamais sous 30 % » comprise. Les prochaines chauffes tiennent sur deux lignes sans texte coupé (« demain, 14 h – 14 h 45 », « en partie au soleil »). Le bilan dit clairement « sans Hestia » et « avec le plan », jour par jour, avec l’écart en euros.

### Corrections

- La charge de la batterie n’est plus comptée dans « Maison » : avec 735 W de soleil et 449 W qui vont dans la batterie, la maison consomme 286 W, plus 735 W.
- Plus de « le reste vient du réseau : 0,00 € de l’heure » quand rien ne vient du réseau.
- Quand la revente ne rapporte rien (prix à 0 €), le surplus est dit « injecté » dans le réseau, plus « revendu », sur la carte et dans la carte Soleil.

## 1.0.1b2 — Choisir la prise et la sonde du chauffe-eau

### Corrections

- Page Chauffe-eau : la prise et la sonde se choisissent avec le sélecteur de Home Assistant, comme dans Hestia Confort, avec sa recherche. La liste ne montre plus que ce qui peut servir : pas les réglages ni les diagnostics des autres appareils (les options d’une caméra, par exemple), pas les entités masquées.

## 1.0.1b1 — Le chauffe-eau piloté

### Nouveautés

- Hestia Énergie sait piloter un chauffe-eau électrique branché sur une prise connectée. Toutes les 5 minutes, elle refait le plan des 36 prochaines heures : au soleil quand les panneaux en donneront, en heures creuses sinon, jamais quand la maison tire déjà beaucoup, et toujours assez d’eau chaude aux heures des douches. Le soir, elle regarde le temps de demain : beau, elle chauffe juste assez la nuit et garde le reste pour le soleil ; gris, elle remplit le ballon la nuit. Si les nuages arrivent en journée, la chauffe au soleil s’arrête et le manque est rattrapé plus tard, au moins cher.
- Elle ne commande jamais le chauffe-eau elle-même : un nouveau capteur, « Chauffe-eau : chauffer », dit quand chauffer, et c’est votre automatisation qui allume la prise. Un blueprint est fourni (« Piloter le chauffe-eau avec Hestia Énergie »).
- **Mode Simulation par défaut** : Hestia montre ce qu’elle ferait, et le blueprint ne touche à rien. On passe en Automatique quand on veut, dans l’onglet Énergie ou par l’entité « Chauffe-eau : mode ». Aussi : Heures creuses (comme un contacteur jour/nuit) et Vacances.
- La réserve d’eau chaude estimée (ou mesurée avec une sonde), la prochaine chauffe, et un bouton « Chauffer maintenant » jusqu’au plein.
- Une chauffe complète par semaine pour l’hygiène, au plus 4 démarrages par jour, jamais au-dessus du disjoncteur, et un jour rouge Tempo la chauffe attend la nuit.
- Le soleil prévu vient de la prévision de la page Énergie (Forecast.Solar, Solcast…), sinon des nuages annoncés par Hestia Météo, sinon du soleil de ces derniers jours.
- Une page **Chauffe-eau** dans l’onglet Énergie : la phrase du moment, le plan, le mode, les réglages (compteur, prise, contenance, puissance, sonde, heures d’eau chaude), le blueprint, et ce que le chauffe-eau a coûté chaque jour comparé au plan de Hestia.
- Un format **Chauffe-eau** pour la carte, avec le plan des prochaines heures dessiné à l’échelle.
- Pour les autres briques : `water_heater()` dans l’interface v1 (un ajout, rien ne change pour Hestia Chauffage).

- **Un seul coût du chauffage** : avec Hestia Chauffage 1.1 ou plus récente, la carte Chauffage et le Bilan montrent le coût du chauffage tel que Hestia Chauffage le compte (radiateurs au prix de chaque heure, poêle au prix de ses sacs) : aujourd’hui, hier et depuis le 1er du mois, avec ce que le poêle fait gagner. Énergie ne le recompte pas de son côté. Sans Hestia Chauffage, rien ne change : les radiateurs restent estimés d’après le froid.

### Améliorations

- Quand le chauffe-eau est piloté par Hestia, le conseil « programmez le chauffe-eau » disparaît : il n’a plus lieu d’être.

### Documentation

- Une page pour le chauffe-eau : [docs/chauffe-eau.md](docs/chauffe-eau.md).

## 1.0.0b10 — Les heures creuses tapées s’enregistrent

### Corrections

- Réglages, heures creuses : sans heures lues sur le compteur (un seul compteur, comme HA Linky), l’heure de début tapée s’effaçait dès qu’on passait à l’heure de fin, et le bouton Enregistrer n’apparaissait jamais. La plage reste maintenant à l’écran pendant qu’on la tape, et Enregistrer apparaît dès qu’elle est complète.

## 1.0.0b9 — Les jours rouges Tempo

### Nouveautés

- Avec l’option Tempo, le conseil du moment parle des jours rouges. La veille d’un jour rouge, dès que RTE a donné la couleur (vers 11 h) : « Demain jour rouge : préparez ce soir », avec les machines et le chauffe-eau à lancer cette nuit, en heures creuses. Le jour rouge, de 6 h à 22 h : « Jour rouge jusqu’à 22 h : l’électricité coûte 4,8 fois plus » (le prix des heures pleines d’un jour rouge, comparé à celui de la nuit). Le soleil en trop garde son conseil : une machine au soleil ne coûte rien, même un jour rouge. Avant, ces deux phrases existaient mais n’étaient jamais dites.
- La carte montre la couleur Tempo du jour et celle de demain, à côté du prix du kWh. Quand demain est rouge, c’est elle qui vient en premier.
- Dans l’onglet Énergie du panneau, la ligne « La couleur Tempo » dit les deux couleurs (« Aujourd’hui bleu · demain rouge »).

## 1.0.0b8 — Les offres à plusieurs registres, le week-end en heures creuses

### Nouveautés

- Le week-end et les jours fériés en heures creuses toute la journée (Enercoop « 2 saisons », par exemple). Hestia le voit seule sur les compteurs, ou on le choisit dans Réglages. Les onze jours fériés français sont connus. L’heure de la fin des heures creuses est alors juste le samedi (« lundi à 7 h »).
- Une action `hestia_energy.set_settings` pour régler le contrat depuis une automatisation : heures creuses, week-end, prix, option. Utile pour suivre les saisons d’une offre qu’Hestia ne connaît pas.

### Corrections

- Les offres avec un registre du Linky par saison et par période (comme Enercoop « 2 saisons » avec ses jours de pointe) : chaque registre garde son prix. Avant, Énergie ne gardait qu’un prix d’heures pleines et un d’heures creuses, ceux du dernier registre lu : en hiver, le prix d’été en heures creuses et le prix de pointe en heures pleines. Les euros des jours passés et le prix du moment sont maintenant justes.
- Le prix du moment et la période en cours suivent le registre qui compte en ce moment, et le libellé du Linky « H CREUSE HIVER », « H POINTE »… est maintenant reconnu.
- Les heures creuses apprises lisent tous les registres d’une période, pas seulement le premier.

### Documentation

- La page du contrat explique comment sont comptés les jours passés quand la page Énergie a un compteur par période.

## 1.0.0b7 — Une nouvelle page d’accueil Hestia-FB

### Améliorations

- La page d’accueil du panneau Hestia-FB est refaite. Chaque brique installée (Météo, Confort, Énergie) y a sa porte : sa couleur, son icône, son chiffre clé (par exemple « 75 € depuis le 1er novembre »), son état et sa version. Un clic sur la porte ouvre la brique. Un petit schéma montre les briques reliées entre elles.
- Les autres briques n’ont rien à changer : elles s’affichent dans ce nouvel accueil telles quelles.

## 1.0.0b6 — Une vue d’ensemble technique, et la documentation

### Améliorations

- La vue d’ensemble du panneau devient technique : elle dit si tout fonctionne. Trois chiffres (les sources à jour, les entités qui ont une valeur, les jours d’historique lus), chaque source avec l’heure de ses dernières nouvelles (« il y a 8 s », « en retard »), ce qu’Énergie peut calculer avec votre équipement, ce qu’Hestia a corrigé, et l’heure du dernier calcul. Une source qui se tait depuis plusieurs heures passe dans « À régler ».
- Les euros du mois et les derniers bilans passent dans la page Bilan. Les conseils pour économiser restent sur la carte.

### Documentation

- Une vraie documentation pour la première version stable, sur le modèle de Hestia Weather : un bandeau en haut de la page, une icône qui s’affiche dans le Marketplace, HACS et la page des intégrations, et des pages pour chaque sujet (installation pas à pas, la carte, l’onglet Énergie, le contrat, les extensions, les entités).

## 1.0.0b5 — Une frise par appareil

### Améliorations

- « Pour économiser » : une seule frise par appareil, à la manière de la frise des événements de Weather. La journée y est dessinée avec ses prix (heures creuses, soleil, heures pleines), l'icône de l'appareil marque ses départs habituels avec leur heure, et une pastille verte marque l'heure à viser. Sous la frise, une ligne dit sur quelle durée sont comptés les départs (les 2 derniers mois).
- « Aujourd'hui » devient « D'habitude » pour le chauffe-eau et les machines : ce sont des habitudes, pas la journée en cours.

## 1.0.0b4 — Des frises qui disent l'heure

### Améliorations

- « Pour économiser » : les frises disent l'heure. Un repère marque l'heure où l'appareil démarre le plus souvent (« Il démarre le plus souvent à 19 h ») et celle où le lancer (« Lancez-le à 0 h 30 ou au soleil »). Les heures où il tourne sont des blocs d'une seule couleur (rouge en heures pleines, bleu en heures creuses, jaune au soleil), et chaque bloc est dit en mots sous la frise (« de 19 h à 23 h, en heures pleines »).
- « En ce moment » ne liste plus ce qui est en marche : la carte Appareils le dit déjà.

## 1.0.0b3 — Pour économiser, en trois temps

### Améliorations

- « Pour économiser » dit chaque conseil en trois temps : ce qui se fait aujourd'hui, ce qui serait mieux, et ce que ça rapporte. Le chauffe-eau et chaque machine y ont leur ligne, rangée par euros avec la veille et le chauffage.
- Pour le chauffe-eau et les machines, une frise de 24 heures montre quand ils tournent aujourd'hui, et quand ils tourneraient mieux.
- Le chauffe-eau : Hestia voit s'il est programmé à heure fixe et à quelle heure. Avec des panneaux, elle dit les mois où le soleil ne l'atteint pas et conseille la nuit pour ces mois-là seulement.
- Les machines : l'heure où elles démarrent le plus souvent, combien de cycles sur 10 tombent au prix fort, et le gain par lavage ou par séchage. Un départ différé déjà utilisé est salué.
- La veille : le gain est dit pour 50 W coupés, pas pour toute la veille.
- « Votre contrat, bien utilisé » garde la jauge des heures creuses et le verdict de l'option.
- « En ce moment » : les flux redessinés d'après le modèle de Frank. Un léger halo de couleur entoure chaque cercle, plus vif quand la puissance monte : jaune orangé pour la production, et pour la maison et le réseau la couleur de l'heure (rouge en heures pleines, bleu en heures creuses). Sur chaque trait, des bulles grossissent au milieu, et elles vont plus vite quand la puissance monte. La tuile garde la hauteur des deux autres colonnes : l'eau du jour tient en une petite ligne sous la maison.

### Corrections

- Le soleil pris par un appareil : quand le chauffe-eau mange tout le surplus des panneaux, la maison ne revend plus rien. Hestia comptait alors ces heures en heures pleines. Elle compte maintenant le soleil qu'il y aurait eu sans l'appareil.

## 1.0.0b2 — Votre contrat, bien utilisé

### Nouveautés

- « Votre contrat, bien utilisé », dans la carte complète : sur les 12 derniers mois, la part de vos achats en heures creuses face à la part à partir de laquelle elles rapportent, et si votre option est la bonne (ce qu'aurait coûté la Base). Jamais sur un seul mois : en hiver, la part des heures creuses baisse.
- Pour le chauffe-eau et les machines (lave-linge, lave-vaisselle, sèche-linge) : ce qu'ils prennent au soleil, la nuit et en heures pleines, et ce que rapporterait de décaler les heures pleines, en euros par an. Avec des panneaux, le conseil dit « au soleil d'abord, sinon la nuit ».
- La puissance souscrite : chaque jour, la plus forte pointe achetée sur 12 mois, face à la puissance juste en dessous. Hestia dit de la garder, ou ce que la puissance plus basse ferait gagner sur l'abonnement.
- Dans la carte Contrat : « Quand tournent vos machines », et les jours de chaque mois où le soleil en trop suffit pour une machine.
- Le bandeau « Le chauffe-eau chauffe en partie au réseau » dit ce qu'il y a à gagner par an.

### Corrections

- « Un compteur compte double » ne parle plus d'un jour ancien : un saut de compteur passé dans l'historique ne se corrige pas. Le message n'apparaît que si les appareils dépassent la maison au moins 3 jours sur les 30 derniers.
- Quand il apparaît, il dit le dernier jour en chiffres et le compteur à regarder (deux appareils qui comptent pareil, ou les plus gros ce jour-là), et il ouvre la page Énergie de Home Assistant, où cela se corrige. Avant, il renvoyait vers la page où on était déjà.
- La nuit, les panneaux à 0 W qui se taisent ne sont plus pris pour un capteur en panne : « Donnée douteuse » ne s'allume plus chaque nuit.
- La carte ne dit plus « Un capteur ne répond plus » pour un point déjà réglé (le poêle déclaré en granulés) ou qu'on ne peut pas régler. Elle renvoie vers « À régler » seulement quand il y a vraiment quelque chose à faire.
- Quand la revente dépasse la production (une partie de la production n'a pas été mesurée), la part du soleil n'est plus affichée à 0 % : la carte dit que la production manque.

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
- La carte complète s’ouvre sur l’horloge de la journée : un trait par heure, ce que la maison a acheté (heures pleines et creuses) et ce que le soleil a donné, une aiguille sur l’heure, et à côté le prix du moment, l’heure la plus chargée et le soleil du jour. Avec un Linky lu le lendemain, elle montre la veille.
- L’onglet Énergie du panneau Hestia-FB : vue d’ensemble, sources, appareils, réglages, extensions, bilan, à propos.
- Les bilans d’hier, de la semaine et du mois, et les alertes, en notification si vous le voulez (aucune par défaut).
- Des entités pour vos automatisations : coût du jour et du mois, prix du moment, heures creuses, veille de nuit, soleil en trop, pointe proche, conseil et sa couleur.
