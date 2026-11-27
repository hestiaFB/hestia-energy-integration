# Pour les développeurs

```sh
python -m unittest discover -s tests -p 'test_*.py'
cd frontend && npm ci && npm run validate
cd card && npm ci && npm run validate
```

Le moteur (`custom_components/hestia_energy/engine/`) n’importe rien de Home Assistant : il se teste seul, par rejeu de vraies statistiques. La table des tarifs se reconstruit avec `scripts/tarifs_cre.py` à chaque changement de prix (1er février, 1er août).

## Pour les autres briques

L’interface `hass.data["hestia_energy_api"]` (version 1) ne fait que s’agrandir : une méthode ajoutée ne change rien pour une brique qui ne la lit pas.

- `days(début, fin)` (1.0.1b7) : une liste, une entrée par jour (`day` est une date Python, pas un texte) : chaque jour entier, l’électricité consommée par la maison et, avec un compteur de gaz, le gaz (`gas_kwh`, `gas_quantity` dans `gas_unit`, « kWh » ou « m³ »), et si la journée est complète. 400 jours au plus. Hestia Chauffage s’en sert pour trouver la part du chauffage selon le froid : Énergie compte, Chauffage dit à quoi l’énergie a servi.
- `gas_price()` (1.0.1b7) : le prix d’un kWh de gaz, taxes comprises, en euros : celui de Réglages, sinon celui de la page Énergie (un prix au m³ divisé par les kWh d’un m³). `None` sans gaz ou sans prix, jamais zéro.
- `water_heater()` (1.0.1b1) : le chauffe-eau piloté (voir [le chauffe-eau](chauffe-eau.md)).

[← Retour au README](../README.md)
