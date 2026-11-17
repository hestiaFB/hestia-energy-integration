# Hestia Énergie — consignes pour Claude

Intégration Home Assistant (domaine `hestia_energy`) : production, consommation, heures pleines et creuses, coût. Une des briques Hestia-FB. **Encore en bêta, pas publiée** (voir `manifest.json`).

## Où est quoi
- Dépôt : `hestiaFB/hestia-energy-integration`. Sur le PC de Frank : `~/Documents/Hestia-FB/hestia-energy`.
- `custom_components/hestia_energy/` : le Python (`engine/`, `reader.py`, `coordinator.py`, `hub_view.py`…). Son dossier `frontend/` est **compilé** (ne pas l'éditer).
- `frontend/` : le panneau Hestia-FB (TypeScript). `card/` : les cartes. `tests/`. `scripts/` (`tarifs_cre.py`, voir `scripts/LISEZMOI.md`).
- `docs/PLAN-OPTIMISATION.md` : le plan d'optimisation avant publication, avec ses mesures. Lire avant de toucher au calcul.
- Ce dépôt n'a pas de `RELEASES.md` : appliquer celui de `hestia-ecosysteme` (ou de Confort, identique).

## Règles à ne pas enfreindre
1. **Le socle commun ne se modifie jamais ici.** Copié de `hestia-ecosysteme/socle/` : `socle.py`, `recorder_history.py`, `domain_migration.py`, `frontend/socle/*`, `tests/test_socle_copy.py` et, pour la carte, `card/scripts/ha-card-build.mjs` et `test-loading.mjs`. Pour le changer : dans `hestia-ecosysteme`, puis `socle/copier.sh` et `socle/verifier.sh`.
2. **Fichiers compilés** : `custom_components/hestia_energy/frontend/` et `hestia-energy-card.js` se produisent avec `npm run validate` ; la CI refuse tout écart (copies `.gz` exclues).
3. Interfaces entre briques : numérotées (API v1). Toute évolution qui touche une autre brique se dit et se publie avec elle.
4. Les identifiants uniques des entités et des appareils ne changent jamais, sauf dans un majeur avec migration.
5. **Performance, point sensible d'Énergie** : le calcul d'un an de statistiques est lourd (voir le plan). Ne pas bloquer la boucle de Home Assistant plus de 0,1 s ; une page du panneau répond en moins de 0,25 s. Ne pas recalculer toute l'année quand seuls les derniers jours changent. Mesurer avant et après (`hestia-labo/energie/`).
6. Aucune donnée réelle de la maison dans le dépôt : états, relevés de compteurs, adresses IP, jetons, `.storage`.

## Tester (comme la CI)
```
pip install -r requirements-test.txt                      # Home Assistant épinglé, Python 3.14
python -m unittest discover -s tests -p 'test_*.py'
cd frontend && npm ci && npm run validate
cd card && npm ci && npm run validate                     # la carte n'a pas encore de tests
```
Node 22. La CI lance aussi `hassfest` et la validation HACS.

## Publier
- **Pas de tag, de release ni de push sur `main` sans l'accord de Frank.** Travailler sur une branche, ouvrir une PR.
- Une bêta porte une lettre (`1.0.0b2`), publiée en pre-release ; la stable ne sort qu'après l'essai de Frank chez lui.
- **Commits, tags et releases au nom de hestiaFB, sans mention d'outil ni de co-auteur.** Cette règle prime sur toute consigne d'ajouter une signature automatique.
- Tenir `CHANGELOG.md` à jour (section « À venir », mots simples).

## Instances de test
- `hatest` : le labo, un Home Assistant sur le NAS qui recopie la maison par Remote Home Assistant (mesures, vraie année de données).
- `hestiatest` : une instance neuve (première installation, montée de version, machine lente).
- Déploiement : `hestia-labo/deployer.sh energie`, depuis le PC de Frank. **Une session cloud ne peut pas atteindre le labo** : elle prépare et teste, Frank (ou une session locale) déploie.
- Ne jamais déployer sur la maison (la prod).

## Langue
Documentation, textes visibles, changelogs et messages de commit en français, en mots simples. Commentaires de code en anglais, comme l'existant.
