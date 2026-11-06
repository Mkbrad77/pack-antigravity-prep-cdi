# Fiche Express Section 4 : Déploiement et orchestration (15 %)

## 1. Vue d'ensemble de la Section 4
La Section 4 évalue la gestion des environnements dbt, l'exécution en intégration continue (CI/CD), l'optimisation Slim CI, l'utilisation de `--defer` et `dbt clone`.

## 2. Les 10 Chiffres, Flags et Concepts Critiques à Retenir
1. Fichier `profiles.yml` : localisé par défaut dans `~/.dbt/` ; ne doit JAMAIS être suivi dans le dépôt Git.
2. Paramètre `--target` (ou `-t`) : spécifie la cible d'exécution définie dans `profiles.yml` (ex: `dbt run -t prod`).
3. Formule Slim CI canonique : `dbt build --select state:modified+ --defer --state path/to/prod/artifacts`.
4. Artefact obligatoire pour la comparaison d'état : `manifest.json` de la branche de production.
5. Flag `--defer` : route les appels `ref()` manquants vers les tables de l'environnement de référence au lieu d'exiger leur création locale.
6. Commande `dbt clone` : crée des copies de tables sans dupliquer les octets de données physiques (Zero-Copy Clone).
7. Sélecteur `state:modified+` : sélectionne tous les nœuds modifiés ET tous leurs descendants en aval.
8. Sélecteur `+state:modified` : sélectionne tous les nœuds modifiés ET tous leurs ancêtres en amont.
9. Paramètre `threads` : définit le nombre maximal de requêtes SQL concurrentes soumises à la base (ex: `threads: 8`).
10. Différence `dbt run` vs `dbt build` : `dbt run` ignore les tests et seeds ; `dbt build` exécute graines, modèles, snapshots et tests dans l'ordre strict du graphe.

## 3. Matrice Décisionnelle d'Orchestration : Quand Choisir Quoi
- Déployer une modification en production : `dbt build` complet avec tests bloquants.
- Valider une Pull Request de manière économique et rapide : Slim CI avec `state:modified+` et `--defer`.
- Initialiser un environnement de sandbox rapidement sans recalculer les données : `dbt clone --state path`.
- Développer localement un modèle isolé sans reconstruire tout l'amont : `dbt run --select mon_modele --defer --state path`.
- Automatiser les exécutions programmées : orchestrateur externe (Airflow, Dagster, Prefect) appelant la CLI ou dbt Cloud.

## 4. Les 5 Pièges Majeurs d'Examen de la Section 4
1. Oublier `--state` avec `--defer` : `--defer` ne peut pas deviner l'état de référence ; il exige obligatoirement l'argument `--state`.
2. Résolution des dépendances en développement : avec `--defer`, si une table existe DÉJÀ dans le schéma de développement local, dbt l'utilise en priorité et n'interroge pas la production.
3. Risque de sécurité `profiles.yml` : commiter ce fichier sur GitHub expose les identifiants d'accès au Data Warehouse.
4. Comportement de `dbt build` en cas d'erreur de test : si un test échoue avec la sévérité `error`, tous les modèles situés en aval dans le DAG sont automatiquement passés au statut `SKIPPED`.
5. Différence entre `state:modified.body` et `state:modified` : `state:modified.body` ne tient compte que du code SQL pur en ignorant les changements de documentation ou de tags YAML.
