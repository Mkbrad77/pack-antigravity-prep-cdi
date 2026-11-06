# Débogage et dépannage dans dbt

## 1. Objectifs d'apprentissage
Diagnostiquer les erreurs de compilation, de syntaxe SQL et de connectivité.
Utiliser les commandes dbt debug et dbt compile pour isoler les défaillances.
Inspecter les fichiers de logs (dbt.log) et le code SQL compilé dans target/compiled/.
Identifier et résoudre les dépendances circulaires dans le DAG.

## 2. Explication claire : quand choisir quoi
Face à une erreur dans un projet dbt, la méthode de diagnostic suit une hiérarchie stricte :
1. **Erreur de connexion ou d'environnement** :
   Exécutez `dbt debug`. Cette commande vérifie la présence de `dbt_project.yml`, `profiles.yml`, les variables d'environnement, la connexion réseau et les autorisations de lecture/écriture sur l'entrepôt de données.
2. **Erreur Jinja ou de compilation** :
   Exécutez `dbt compile --select mon_modele`. Si le Jinja contient une variable manquante ou une syntaxe incorrecte, l'erreur s'affiche sans exécuter la moindre requête SQL sur la base.
3. **Erreur d'exécution SQL (syntaxe ou typage)** :
   Inspectez le fichier SQL compilé généré dans `target/compiled/mon_projet/models/...`. Vous y trouverez la requête SQL pure débarrassée de Jinja, prête à être copiée/collée dans la console de votre entrepôt pour analyse directe.
4. **Erreurs détaillées** :
   Consultez le fichier `logs/dbt.log` pour lire la trace complète des échanges entre le client dbt et la base.

## 3. Définitions des termes clés
- **dbt debug** : Commande de vérification de l'intégrité de la configuration et de la liaison avec le Data Warehouse.
- **target/compiled/** : Dossier contenant le code SQL résolu après interprétation de toutes les macros Jinja.
- **target/run/** : Dossier contenant les instructions DDL et DML complètes envoyées à la base (ex: `CREATE TABLE AS ...`).
- **Dépendance circulaire (Circular Dependency)** : Erreur de graphe survenant lorsque le modèle A fait un `ref('B')` alors que B fait un `ref('A')`. dbt refuse de démarrer.

## 4. Exemple concret
Inspection d'un problème SQL compilé :

```bash
# 1. Tester la connexion
dbt debug

# 2. Compiler un modèle spécifique
dbt compile --select stg_utilisateurs

# 3. Afficher le SQL compilé sur Windows PowerShell
cat target/compiled/mon_projet/models/staging/stg_utilisateurs.sql
```

## 5. Comparaisons et pièges d'examen
- **dbt compile contre dbt run** : `dbt compile` valide le code et génère le SQL dans `target/` sans rien exécuter ni créer dans la base de données. `dbt run` compile ET exécute la transformation sur l'entrepôt.
- **Piège de la dépendance circulaire** : Si une question d'examen mentionne une erreur au tout début de la compilation indiquant `Found a cycle in the DAG`, la cause est un renvoi mutuel de fonctions `ref()`.
- **Niveaux de logs** : Vous pouvez augmenter la verbosité en ligne de commande via `--debug` (ex: `dbt --debug run`).

## 6. Lien avec SQL, Snowflake et Databricks
- Permet d'isoler rapidement si une lenteur ou une erreur provient du moteur dbt lui-même (compilation locale) ou de la base Snowflake/Databricks (plan d'exécution, verrous, manque de mémoire).

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 82, 87
- Cours secondaire Weigel : leçons 77 à 84
- Documentation officielle : https://docs.getdbt.com/docs/build/troubleshooting (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande dbt teste la validité du fichier profiles.yml et la connectivité à l'entrepôt de données ? (Réponse : dbt debug)
2. Où trouve-t-on le code SQL compilé sans Jinja après avoir lancé dbt compile ? (Réponse : Dans le dossier target/compiled/)
3. Quelle anomalie de modélisation provoque l'erreur bloquante 'Found a cycle in the DAG' ? (Réponse : Une dépendance circulaire où deux modèles font mutuellement référence l'un à l'autre via ref())
