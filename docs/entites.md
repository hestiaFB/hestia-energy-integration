# Les entités et vos automatisations

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
| **Chauffe-eau : chauffer**, **réserve**, **prochaine chauffe**, **mode**, **chauffer maintenant** | Le chauffe-eau piloté : quand chauffer, l’eau chaude qui reste, la prochaine chauffe, le mode (Simulation par défaut), une chauffe jusqu’au plein. [En détail](chauffe-eau.md) |
| **Donnée douteuse** | Oui quand un compteur dit quelque chose d’impossible |

Par exemple : lancer le chauffe-eau quand **Soleil en trop** passe à oui, ou couper un radiateur quand **Pointe proche du disjoncteur** s’allume.

[← Retour au README](../README.md)
