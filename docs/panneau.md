# L’onglet Énergie du panneau Hestia-FB

Tout se règle dans le panneau **Hestia-FB** de la barre latérale, onglet **Énergie**. Pas de YAML, pas de nom d’entité à connaître.

- **Vue d’ensemble** : si tout fonctionne. Trois chiffres (les sources à jour, les entités qui ont une valeur, les jours d’historique lus), ce qui reste à régler, chaque source et quand elle a donné des nouvelles pour la dernière fois, ce qu’Énergie peut calculer avec votre équipement (et ce qu’il faudrait en plus), ce qu’Hestia a corrigé, et le dernier calcul.
- **Sources** : une ligne par chose mesurée (électricité achetée, revendue, soleil, poêle, eau), d’où elle vient, comparée à Enedis, et ce qu’Hestia a corrigé.
- **Appareils** : les appareils de la page Énergie, rangés par usage (modifiable), avec les euros du mois dernier. Cette page n’apparaît que si vous en avez.
- **Chauffe-eau** (1.0.0b11) : le plan de chauffe, le mode (Simulation par défaut), les réglages du chauffe-eau, le blueprint à importer, et ce qu’il a coûté chaque jour. Voir [le chauffe-eau](chauffe-eau.md). Cette page n’apparaît qu’avec un chauffe-eau (on y arrive aussi par Réglages).
- **Réglages** : le contrat, les prix, l’eau, les granulés, les notifications. Chaque valeur est pré-remplie, avec **Rétablir**.
- **Extensions** : une ligne et un interrupteur par extension.
- **Bilan** : les euros depuis le 1er, la prévision du mois, les derniers bilans, puis les 12 derniers mois en euros, le soleil et la revente, le chauffage et l’eau.
- **À propos** : les versions, la date des tarifs, les liens.

## Les notifications

Aucune par défaut. Dans **Réglages**, choisissez à qui les envoyer et à quelle heure (8 h par défaut), puis cochez celles que vous voulez :

- le bilan d’hier, chaque matin : « Hier : 3,72 € — 18 kWh · le soleil a couvert 17 % » ;
- le bilan de la semaine, le lundi ; celui du mois, le 1er ;
- la fuite d’eau et l’appareil oublié, envoyés tout de suite.

[← Retour au README](../README.md)
