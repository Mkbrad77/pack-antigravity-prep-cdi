# Mécanismes Defer et Clone

## 1. Objectifs d'apprentissage
Comprendre le fonctionnement et les prérequis de l'option --defer.
Éviter la duplication massive de données en environnement de développement local.
Maîtriser la commande dbt clone pour répliquer des tables à coût zéro (Zero-Copy Clone).
Distinguer quand combiner defer et clone dans les stratégies de rafraîchissement.

## 2. Explication claire : quand choisir quoi
Quand un développeur crée un nouveau modèle intermédiaire `int_ventes`, ce modèle dépend souvent de plusieurs tables de staging amont. Recréer toutes ces tables brutes dans son schéma personnel de dev prend du temps et pollue la base.
- **Defer (--defer)** :
  Permet d'exécuter un modèle dans un environnement cible (ex: le schéma personnel de dev) en résolvant les dépendances non construites vers un environnement de référence (ex: la production ou le staging partagé).
  Si la table `stg_clients` n'existe pas dans le schéma de dev, dbt redirige automatiquement la requête vers `prod.stg_clients`.
  Nécessite impérativement un `manifest.json` de référence passé via `--state`.
- **Clone (dbt clone)** :
  Crée une copie logique instantanée des relations d'une base de données source vers une base cible.
  Sur les entrepôts supportant le clonage sans copie physique (Zero-Copy Clone sur Snowflake, Clone sur Databricks Unity Catalog, ou BigQuery Table Clones), cette opération prend quelques secondes et ne consomme aucun stockage supplémentaire.

## 3. Définitions des termes clés
- **--defer** : Flag dbt indiquant au compilateur de router les appels ref() manquants vers le schéma source défini dans le manifest de comparaison.
- **dbt clone** : Commande introduite dans dbt Core 1.6 matérialisant des copies de tables existantes sans réexécuter les requêtes de transformation.
- **Zero-Copy Clone** : Fonctionnalité de stockage sous-jacente qui duplique uniquement les métadonnées de pointeurs sans copier les octets de données.

## 4. Exemple concret
Utilisation combinée de defer en développement local :

```bash
# Le développeur souhaite tester uniquement son modèle fct_reporting_ventes
# sans avoir à recalculer les tables de staging en amont
dbt run   --select fct_reporting_ventes   --defer   --state path/to/prod_artifacts
```

Création rapide d'un schéma de développement par clonage :
```bash
# Clone l'ensemble des tables de production vers le schéma personnel de développement
dbt clone --state path/to/prod_artifacts
```

## 5. Comparaisons et pièges d'examen
- **Différence majeure entre defer et clone** : `--defer` ne crée aucun objet physique dans la base de données : il modifie uniquement le SQL compilé pour pointer vers la table de production. `dbt clone` crée de vrais objets de tables dans la cible, mais sans recopier les données physiques.
- **Exigence de --defer** : `--defer` ne peut fonctionner sans l'argument `--state` indiquant l'emplacement du `manifest.json` de référence.
- **Droits d'accès** : Pour que `--defer` fonctionne en développement, l'utilisateur dbt doit disposer des droits de lecture (SELECT) sur les tables du schéma de production référencé.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, `dbt clone` traduit la commande en `CREATE TABLE target CLONE source`, opération instantanée à coût nul.
- Dans **Databricks**, Unity Catalog exploite le clonage superficiel (SHALLOW CLONE) des tables Delta Lake.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçon 116
- Cours secondaire Weigel : leçons 95 à 97
- Documentation officielle : https://docs.getdbt.com/reference/node-selection/defer (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel argument CLI est obligatoire pour pouvoir utiliser le flag --defer ? (Réponse : --state pointant vers un manifest.json)
2. Quelle commande permet de créer rapidement des tables de test sans relancer les requêtes SQL de transformation ? (Réponse : dbt clone)
3. Comment réagit --defer si une table dépendante existe déjà dans le schéma de développement local ? (Réponse : Il utilise la table locale et ne renvoie pas vers la production)
