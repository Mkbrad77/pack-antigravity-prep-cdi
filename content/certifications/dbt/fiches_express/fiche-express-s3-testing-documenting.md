# Fiche Express Section 3 : Tester, documenter et publier (20 %)

## 1. Vue d'ensemble de la Section 3
La Section 3 évalue la mise en place de la qualité des données, la documentation vivante du projet, la gouvernance de schéma et les tests unitaires.

## 2. Les 12 Chiffres, Tests et Directives Critiques à Retenir
1. 4 Tests génériques natifs dbt : `unique`, `not_null`, `accepted_values`, `relationships`.
2. Emplacement des tests génériques : déclarés sous la clé `tests:` (ou `data_tests:` dans les versions récentes) dans les fichiers `schema.yml`.
3. Tests singuliers (Singular tests) : requêtes SQL autonomes placées dans `tests/` ; le test échoue si la requête renvoie une ou plusieurs lignes.
4. Niveaux de sévérité des tests : `warn` (affiche un avertissement et continue) et `error` (interrompt le pipeline si `dbt build` est utilisé).
5. Option `store_failures` : sauvegarde les lignes fautives dans une table dédiée de l'entrepôt pour faciliter l'audit.
6. Tests unitaires (`unit_tests:`) : valident la logique SQL interne d'un modèle avec des données simulées (mocks) sans interroger les vraies sources.
7. Blocs de documentation : déclarés avec la balise Jinja `{% docs nom_bloc %} ... {% enddocs %}` dans des fichiers `.md`.
8. Fonction `doc('nom_bloc')` : permet de réutiliser une description textuelle sur plusieurs colonnes ou modèles.
9. Commandes de documentation : `dbt docs generate` (crée `catalog.json`) et `dbt docs serve` (lance le serveur web local).
10. Exposures (`exposures:`) : déclarent les dépendances vers des consommateurs en aval (tableaux de bord Tableau, Looker, modèles ML).
11. Contrats de modèles (`contract: enforced: true`) : vérifient strictement que le SQL compilé respecte les noms et types de colonnes déclarés.
12. Fraîcheur des sources (`dbt source freshness`) : utilise `loaded_at_field` avec les seuils `warn_after` et `error_after`.

## 3. Matrice Décisionnelle Qualité : Quel Mécanisme Choisir
- Valider qu'un identifiant client n'est jamais nul et sans doublon : tests génériques `not_null` et `unique`.
- Valider qu'un code statut est parmi ('ACTIF', 'INACTIF', 'EN_ATTENTE') : test générique `accepted_values`.
- Valider l'intégrité référentielle entre une clé étrangère et une dimension : test générique `relationships`.
- Valider une règle métier complexe multi-tables (ex: solde toujours égal aux débits - crédits) : test singulier SQL dans `tests/`.
- Valider la logique d'un calcul complexe sur des cas limites (edge cases) avant le run : test unitaire (`unit_tests`).
- Protéger une table publique contre les régressions de colonnes : contrat de modèle (`contract: enforced: true`).
- Tracer l'impact d'une modification de modèle sur un rapport PowerBI : déclarer une `exposure`.

## 4. Les 5 Pièges Majeurs d'Examen de la Section 3
1. Confondre Data Tests et Unit Tests : les data tests s'exécutent sur les données réelles de la base ; les tests unitaires utilisent des données mockées en YAML.
2. Contrat de modèle et colonnes manquantes : si un contrat est activé (`enforced: true`), TOUTES les colonnes du SELECT doivent être explicitement typées dans le YAML, sinon le build échoue.
3. Test singulier qui passe : un test singulier dbt passe si et seulement si la requête retourne ZÉRO ligne. S'il renvoie des lignes, il est en échec.
4. Écrasement des tests par store_failures : à chaque exécution de test, dbt recrée ou vide la table de failures associée.
5. Emplacement des blocs de docs : les fichiers contenant des balises `{% docs %}` doivent avoir l'extension `.md` et être situés dans des dossiers scrutés par dbt.
