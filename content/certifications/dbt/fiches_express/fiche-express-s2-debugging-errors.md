# Fiche Express Section 2 : Déboguer les erreurs de modélisation (20 %)

## 1. Vue d'ensemble de la Section 2
La Section 2 évalue la capacité à diagnostiquer rapidement les erreurs de configuration, les échecs de compilation Jinja, les erreurs d'exécution SQL et les dépendances circulaires dans le DAG.

## 2. Les 10 Chiffres, Commandes et Chemins Critiques à Retenir
1. Commande `dbt debug` : teste la validité des fichiers `dbt_project.yml`, `profiles.yml`, la connexion réseau et les autorisations de base de données.
2. Commande `dbt compile` : interprète Jinja et compile les fichiers SQL dans `target/compiled/` sans envoyer de requête de modification à l'entrepôt.
3. Commande `dbt show` : exécute la requête et affiche les premières lignes sous forme tabulaire dans le terminal (5 lignes par défaut).
4. Commande `dbt retry` : relance immédiatement les nœuds ayant échoué lors de la dernière commande sans recalculer les succès.
5. Fichier `target/manifest.json` : artefact JSON décrivant la totalité du graphe (DAG), les dépendances, tags et métadonnées.
6. Fichier `target/run_results.json` : artefact consignant le statut d'exécution (success, error, fail, skipped) et les durées de chaque modèle.
7. Fichier journal `logs/dbt.log` : conserve l'historique exhaustif des requêtes SQL et erreurs brutes renvoyées par l'entrepôt.
8. Dossier `target/compiled/projet/models/` : contient le SQL résolu (Jinja compilé en SQL pur).
9. Dossier `target/run/projet/models/` : contient les requêtes DDL/DML complètes (`CREATE TABLE AS SELECT ...`).
10. Flag `--limit N` de `dbt show` : permet de restreindre le nombre de lignes retournées (ex: `dbt show --limit 10`).

## 3. Matrice Décisionnelle de Dépannage : Quel Outil Selon l'Erreur
- Échec de connexion ou d'authentification au démarrage : exécuter `dbt debug` pour vérifier les identifiants et les variables d'environnement.
- Erreur de syntaxe Jinja ou variable manquante : exécuter `dbt compile --select modele` pour inspecter la compilation sans toucher à la base.
- Erreur de syntaxe SQL ou de typage colonne : ouvrir le fichier SQL dans `target/compiled/` et le tester directement dans la console Snowflake/Databricks.
- Dépendance circulaire (Found a cycle in the DAG) : inspecter les macros `ref()` pour supprimer la boucle entre les modèles A et B.
- Vérification rapide des données d'un modèle sans créer de table : lancer `dbt show --select modele`.
- Reprise rapide d'un pipeline planté sur 1 modèle parmi 100 : exécuter `dbt retry`.

## 4. Les 5 Pièges Majeurs d'Examen de la Section 2
1. Confondre `dbt compile` et `dbt show` : `dbt compile` ne se connecte pas pour exécuter le SELECT, il génère seulement les fichiers textes. `dbt show` interroge réellement la base pour afficher un échantillon.
2. Confondre `dbt retry` et `state:modified` : `dbt retry` se base sur `run_results.json` de la session précédente. `state:modified` compare deux `manifest.json` via `--state`.
3. Erreur circulaire dans le DAG : impossible à contourner par configuration ; seul un découpage de modèle ou l'utilisation d'une table intermédiaire résout la boucle.
4. Variable d'environnement manquante : si `env_var('CLE')` est appelée sans deuxième argument de repli et que la variable OS est absente, la compilation plante instantanément.
5. Incohérence de profil : exécuter dbt avec une mauvaise cible (`--target`) pointant vers un entrepôt ou une base inexistante génère des erreurs génériques d'accès.
