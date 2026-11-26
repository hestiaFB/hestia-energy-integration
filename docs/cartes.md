# Les cartes

![Les formats de la carte Hestia Énergie : la carte complète sur un téléphone, les conseils, la tuile et une carte de détail (Pointe)](images/hestia-energy-cartes.png)

Une seule carte, **Hestia Énergie**, en plusieurs formats. Chacun répond à une question, sur une seule période :

| Format | Ce qu’il montre |
| --- | --- |
| **Complète** (par défaut) | Tout sur une carte : l’horloge de la journée, en ce moment, aujourd’hui, ce mois-ci, votre contrat bien utilisé, les conseils « Pour économiser », puis « En détail » : un appui sur un encart ouvre sa carte de détail. Voir [ci-dessous](#la-carte-complète). |
| **Tuile** | En ce moment : une phrase, un chiffre. « La maison consomme 1,3 kW. » Quand il n’y a rien à faire, le meilleur conseil. |
| **Conseils** | Ce qui ferait économiser, en euros par an, du plus rentable au moins rentable. |
| **Soleil** | Ce que les panneaux ont produit aujourd’hui, groupe par groupe. |
| **Chauffage** | Ce qu’a coûté la saison, depuis le 1er octobre : radiateurs et poêle. Avec Hestia Chauffage 1.1 ou plus récente : le coût qu’elle compte, aujourd’hui, hier et ce mois-ci (un seul coût du chauffage). |
| **Veille** | Ce qui tourne la nuit, sur les 30 dernières nuits, et ce que ça coûte par an. |
| **Eau** | Les litres et les euros du mois, jour par jour. |
| **Appareils** | Ce que chaque appareil a consommé aujourd’hui, en kWh et en euros. |
| **Pointe** | La plus forte puissance prise aujourd’hui, face à votre abonnement. |
| **Contrat** | Vos heures creuses et vos prix ce mois-ci, et ce qu’aurait coûté l’option Base. |
| **Chauffe-eau** | Le chauffe-eau piloté (1.0.1b1) : sa réserve, son plan des prochaines heures, ses chauffes et ce qu’elles ont coûté. Voir [le chauffe-eau](chauffe-eau.md). |

## La carte complète

De haut en bas :

- **L’horloge de la journée** : un trait par heure, de 0 h en haut à 12 h en bas. Sa couleur dit ce qui a été acheté et quand : rouge en heures pleines, bleu en heures creuses, jaune pour le soleil, gris pour hier aux heures à venir. L’aiguille marque l’heure qu’il est. À côté, le conseil du moment, la couleur Tempo du jour et de demain (avec l’option Tempo), le prix du kWh maintenant, l’heure la plus chargée et ce que les panneaux ont produit. Un appui sur une heure donne ses chiffres.
- **En ce moment** : trois cercles, la production, la maison, le réseau, reliés par ce qui passe de l’un à l’autre (« 829 W revendus »). Une phrase le redit en mots. Il faut un compteur en direct.
- **Aujourd’hui** et **Ce mois-ci** : les euros depuis minuit et depuis le 1er, comparés à hier à la même heure et à l’an dernier.
- **Votre contrat, bien utilisé** (en heures creuses) : sur 12 mois, la part de vos achats tombée la nuit, à partir de quand l’option rapporte, et ce que vous auriez payé en Base.
- **Pour économiser** : un conseil par ligne, du plus rentable au moins rentable. Chacun dit ce qui se passe d’habitude, ce qui serait mieux, et ce que ça rapporte par an.
- **En détail** : un encart par carte de détail (Soleil, Eau, Pointe, Contrat…). Un appui l’ouvre.

### La frise d’un appareil

Pour le chauffe-eau et chaque machine (lave-linge, sèche-linge, lave-vaisselle), le conseil a sa frise de 24 heures, de 0 h à 24 h :

- **la bande du bas** dit le prix de chaque moment de la journée : bleu pour les heures creuses, jaune pour le soleil (les heures où vos panneaux produisent le plus), rouge pour les heures pleines ;
- **l’icône de l’appareil**, au-dessus, marque ses départs habituels, avec leur heure ;
- **la pastille verte** marque l’heure à viser.

Les départs habituels sont comptés sur vos derniers mois (la ligne sous la frise dit combien). Pour le chauffe-eau, la frise ne montre que les heures creuses et pleines : son conseil porte sur les mois sans soleil.

## Les cartes de détail

Une carte de détail répond d’abord en une phrase, avec son chiffre en gras, puis dit pourquoi. Exemple, la carte Veille : « Quand tout dort, la maison consomme 190 W. Cela fait environ 330 € par an. »

Un format que votre maison ne peut pas remplir le dit simplement : sans panneaux, la carte Soleil n’a rien à montrer.

## En YAML

Si vous préférez :

```yaml
type: custom:hestia-energy-card
card: tuile
```

`card` vaut `complete`, `tuile`, `conseils`, `soleil`, `chauffage`, `veille`, `eau`, `appareils`, `pointe`, `contrat` ou `chauffe_eau`. `name` (facultatif) change le titre.

## Les couleurs

La couleur dit s’il y a quelque chose à faire :

- **bleu** : rien à faire, tout va bien ;
- **vert** : un bénéfice à saisir (le soleil produit, c’est le bon moment) ;
- **orange** : un geste conseillé maintenant (avec l’option Tempo : la veille d’un jour rouge, et le jour rouge jusqu’à 22 h) ;
- **rouge** : urgent (l’eau coule sans s’arrêter).

[← Retour au README](../README.md)
