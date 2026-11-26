# Le chauffe-eau piloté par Hestia Énergie

*Nouveau dans la 1.0.0b11. Il démarre en **Simulation** : rien n’est commandé tant que vous ne le décidez pas.*

Un chauffe-eau électrique (un cumulus) est souvent le plus gros consommateur de la maison après le chauffage. Le chauffer au bon moment fait économiser sans rien changer au confort : au soleil quand les panneaux en donnent, en heures creuses sinon, jamais au moment où la maison tire déjà beaucoup.

Hestia Énergie fait le plan. **Elle ne commande jamais le chauffe-eau elle-même** : elle allume ou éteint un capteur, `binary_sensor.hestia_energy_chauffe_eau` (« Chauffe-eau : chauffer »). C’est **votre automatisation** qui suit ce capteur et commande la prise. Un blueprint tout prêt est fourni.

## Ce qu’il faut

- Le chauffe-eau dans la page Énergie de Home Assistant (« Consommation individuelle »), avec sa consommation en kWh. Hestia le trouve par son nom (« chauffe-eau », « cumulus », « ballon »…), ou vous le choisissez dans l’onglet Énergie, page **Chauffe-eau**.
- Pour le piloter : une prise ou un contacteur connecté (`switch`, `input_boolean` ou `light`). Le chauffe-eau doit garder son thermostat : la prise ne fait qu’autoriser la chauffe.
- Facultatif : sa contenance (sur la plaque), et une sonde de température d’eau. Sans sonde, la réserve est estimée.

Sans chauffe-eau mesuré, indiquez sa prise et sa puissance dans la page Chauffe-eau : Hestia fait le plan avec ces deux chiffres.

## Comment Hestia décide

Toutes les 5 minutes, Hestia refait le plan des 36 prochaines heures, quart d’heure par quart d’heure. Elle cherche la façon la moins chère d’avoir assez d’eau chaude aux heures où vous en avez besoin (par défaut 7 h et 20 h).

Pour chaque quart d’heure, elle connaît :

- **le prix** : heures pleines, heures creuses, base, la couleur Tempo du jour ;
- **le soleil prévu** : la prévision de la page Énergie (Forecast.Solar, Solcast…), sinon les nuages annoncés par Hestia Météo et ce que vos panneaux produisent par beau temps, sinon le soleil habituel de ces derniers jours ;
- **le reste de la maison** : ce qu’elle consomme d’habitude à cette heure, appris sur 4 semaines, pour ne garder au chauffe-eau que le soleil en trop ;
- **le disjoncteur** : jamais de chauffe qui ferait dépasser la puissance souscrite, marge comprise.

Quelques exemples :

- **Le soir, demain s’annonce beau** : juste assez en heures creuses cette nuit, le reste au soleil demain. « Du soleil est prévu : d’abord juste assez en heures creuses (de 23 h à 0 h 30), puis le soleil fera le reste (demain de 12 h à 13 h 45). »
- **Le soir, demain s’annonce gris** : le ballon est rempli cette nuit, en heures creuses.
- **Pas de panneaux** : tout en heures creuses, à l’heure où la maison tire le moins.
- **Les nuages arrivent** : la chauffe au soleil s’arrête si le soleil mesuré tombe bien sous la prévision. Le plan est refait avec moins de soleil, et l’eau manquante est rattrapée en heures creuses. « Les nuages sont arrivés : la chauffe au soleil s’arrête. »
- **Il ne reste presque plus d’eau chaude avant la douche** : l’eau chaude passe d’abord, même en heures pleines. « Chauffe maintenant en heures pleines… »

La veille, Hestia ne compte que sur 70 % du soleil prévu (90 % dans les 3 prochaines heures) : une prévision trop belle ne laisse pas la maison sans eau chaude.

Les autres règles :

- une chauffe dure au moins 30 minutes, et le chauffe-eau démarre au plus 4 fois par jour (réglable) ;
- une fois par semaine, le ballon est chauffé jusqu’au plein (hygiène) ;
- un jour rouge Tempo, la chauffe attend la nuit ;
- si la maison approche du disjoncteur, la chauffe s’arrête tout de suite.

## La réserve

Hestia estime l’eau chaude qui reste, en kWh et en pourcentage : la chauffe la remplit, les douches et les pertes la vident. Le besoin de chaque jour (semaine et week-end) s’apprend sur les 4 dernières semaines de mesures du chauffe-eau.

Quand le chauffe-eau est piloté, Hestia voit aussi qu’il est **plein** : la prise est allumée depuis un moment mais il ne tire plus rien (son thermostat a coupé). Avec une sonde, la réserve vient de la température.

## Les modes

Le mode se choisit dans la page Chauffe-eau, ou par l’entité **Chauffe-eau : mode**.

| Mode | Ce qu’il fait |
| --- | --- |
| **Simulation** (par défaut) | Hestia montre ce qu’elle ferait. Le capteur suit le plan, mais le blueprint ne touche pas à la prise. Hestia continue de conseiller les heures du chauffe-eau. |
| **Automatique** | Hestia décide des chauffes ; votre automatisation allume et éteint la prise. |
| **Heures creuses** | Chauffe pendant les heures creuses, sans plan, comme un contacteur jour/nuit. |
| **Vacances** | Ne chauffe plus, sauf la chauffe complète de la semaine pour l’hygiène. |

Le bouton **Chauffe-eau : chauffer maintenant** demande une chauffe jusqu’au plein (4 heures au plus), puis le plan reprend.

Conseil : restez quelques jours en Simulation, regardez le plan et « Les derniers jours » (ce que le chauffe-eau a coûté, ce que le plan aurait coûté), puis passez en Automatique.

## Le blueprint

Dans la page Chauffe-eau, **Importer** ouvre le blueprint « Piloter le chauffe-eau avec Hestia Énergie ». Choisissez la prise, puis enregistrez l’automatisation. Elle :

- allume ou éteint la prise comme le dit `binary_sensor.hestia_energy_chauffe_eau` ;
- ne fait **rien** tant que le mode est sur Simulation ;
- vérifie toutes les 5 minutes et au démarrage de Home Assistant ;
- en option (éteinte par défaut), revient aux heures creuses que vous lui donnez si Hestia Énergie ne répond plus depuis 15 minutes.

Vous pouvez aussi écrire votre propre automatisation : suivez l’état du capteur, et son attribut `simulation`.

## Les entités

| Entité | Ce qu’elle dit |
| --- | --- |
| **Chauffe-eau : chauffer** | Oui quand le chauffe-eau doit chauffer. Attributs : la raison, la phrase, le mode, `simulation`, la fin de la chauffe, la prochaine chauffe, la réserve, le plan |
| **Chauffe-eau : réserve** | L’eau chaude qui reste, en % |
| **Chauffe-eau : prochaine chauffe** | L’heure de la prochaine chauffe prévue |
| **Chauffe-eau : mode** | Simulation, Automatique, Heures creuses, Vacances |
| **Chauffe-eau : chauffer maintenant** | Un bouton : une chauffe jusqu’au plein |

Ces entités n’existent que si Hestia a trouvé un chauffe-eau (ou sa prise et sa puissance).

## La carte

Le format **Chauffe-eau** de la carte Hestia Énergie montre la réserve, la phrase du moment, le plan des prochaines heures dessiné à l’échelle (la réserve, le soleil prévu, les chauffes par couleur, les heures d’eau chaude), les prochaines chauffes et le bilan des derniers jours.

```yaml
type: custom:hestia-energy-card
format: chauffe_eau
```

## Pour les autres briques

L’interface `hass.data["hestia_energy_api"]` (version 1) gagne `water_heater()` : chauffer ou non, la raison, la réserve, la prochaine chauffe, le plan, le mode. C’est un ajout : rien ne change pour Hestia Chauffage.

[← Retour au README](../README.md)
