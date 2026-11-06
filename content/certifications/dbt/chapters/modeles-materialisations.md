# Modèles et matérialisations dbt

## 1. Objectifs d'apprentissage
Comprendre les quatre principales matérialisations natives de dbt (view, table, incremental, ephemeral).
Maîtriser la syntaxe du bloc de configuration `config()` dans les fichiers de modèles SQL et dans le fichier `dbt_project.yml`.
Identifier la stratégie de matérialisation optimale selon la volumétrie, le coût de calcul et la fraîcheur exigée.
Éviter les pièges d'examen relatifs à la persistance physique et aux dépendances de code.

## 2. Explication claire : quand choisir quoi
dbt transforme les données dans le Data Warehouse via des instructions `SELECT` pures. La façon dont ce `SELECT` est exécuté et persisté dépend de la stratégie de matérialisation :
- **View (vue)** : Matérialisation par défaut. Idéale pour les modèles de staging et les transformations légères. Avantage : zéro coût de stockage, données toujours fraîches à la lecture. Inconvénient : requêtes lentes si la transformation est complexe.
- **Table** : Crée une table physique (`CREATE TABLE AS SELECT`). Recommandée pour les marts de données consommés par les outils de Business Intelligence et les modèles intermédiaires complexes. Avantage : requêtes ultra-rapides pour les analystes. Inconvénient : temps de reconstruction complet à chaque exécution.
- **Incremental** : Met à jour uniquement les nouvelles lignes ou les lignes modifiées. Indispensable sur les gros volumes de données (logs, événements IoT, transactions).
- **Ephemeral** : Ne crée aucun objet dans l'entrepôt. Le code SQL est interpolé comme une expression de table commune (CTE `WITH ... AS`) dans les modèles dépendants qui y font référence. Recommandé pour des modules de calcul très légers partagés par peu de modèles.

## 3. Définitions des termes clés
- **Modèle dbt** : Fichier contenant une unique instruction `SELECT` enregistrée dans le dossier `models/`.
- **DAG (Directed Acyclic Graph)** : Graphe orienté acyclique construit automatiquement par dbt en résolvant les fonctions `ref()` et `source()`.
- **Target database / schema** : Emplacement cible configuré dans `profiles.yml` où les tables et vues sont créées physiquement.

## 4. Exemple concret
Configuration locale d'une table dans un modèle SQL :

```sql
-- models/marts/fct_orders.sql
{{ config(
    materialized='table',
    tags=['finance', 'daily']
) }}

with orders as (
    select * from {{ ref('stg_orders') }}
)
select
    order_id,
    customer_id,
    order_date,
    amount
from orders
```

## 5. Comparaisons et pièges d'examen
- **Piège dbt run et ephemeral** : Vous ne pouvez pas exécuter `dbt run --select mon_modele_ephemeral`. Comme il ne crée rien dans la base de données, dbt lève un avertissement ou une erreur.
- **Vues contre Tables** : À l'examen, si la question mentionne des utilisateurs finaux souffrant de lenteurs de tableaux de bord BI, la réponse est de passer d'une vue à une table.
- **Ordre de préséance des configurations** : La configuration dans le fichier SQL individuel (`config()`) prévaut toujours sur la configuration générale déclarée dans `dbt_project.yml`.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, une matérialisation `table` exécute un `CREATE OR REPLACE TABLE`, consommant des crédits d'entrepôt virtuel (Warehouse) lors du build.
- Dans **Databricks**, dbt crée des tables Delta Lake ou des vues Spark SQL gérées par Unity Catalog.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 16 à 27
- Cours secondaire Weigel : leçons 16 à 28
- Documentation officielle : https://docs.getdbt.com/docs/build/materializations (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle matérialisation n'enregistre aucun objet persistant dans l'entrepôt de données ? (Réponse : Ephemeral)
2. Quel fichier de configuration a la priorité la plus forte sur la matérialisation d'un modèle ? (Réponse : Le bloc config() dans le modèle SQL lui-même)
3. Quelle est la matérialisation par défaut dans dbt si aucune directive n'est fournie ? (Réponse : View)
