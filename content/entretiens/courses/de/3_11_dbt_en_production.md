# Chapitre 3.11 : dbt en production (Staging/Intermediate/Marts, Incremental, Snapshots, Tests, CI/CD)

**Tâches du planning associées :** `W14-I2` (`3.11`)  
**Durée de lecture estimée :** 15 min  
**Objectif entretien :** Savoir structurer un projet dbt à l'échelle industrielle, choisir la bonne stratégie incrémentale selon le moteur analytique (Snowflake, BigQuery, Databricks, Redshift), maîtriser les snapshots SCD Type 2, et concevoir un pipeline CI/CD Slim CI avec `state:modified+`.

---

## 1. Architecture en 3 couches : Staging, Intermediate, Marts

Les bonnes pratiques officielles de dbt Labs imposent un découpage strict du DAG en 3 couches :

| Couche | Préfixe | Matérialisation recommandée | Rôle exact et règles d'architecture |
|---|---|---|---|
| **Staging (`staging/`)** | `stg_<source>__<table_pluriel>` | `view` (ou `ephemeral` si très léger) | Relation **1:1 stricte** avec les tables sources (`{{ source('raw', 'orders') }}`). Renommage des colonnes en `snake_case`, cast des types (`CAST(id AS VARCHAR)`), conversions d'unités (centimes en euros, UTC), dédoublonnage basique (`QUALIFY ROW_NUMBER() = 1`). **Aucune jointure ni agrégation métier.** |
| **Intermediate (`intermediate/`)** | `int_<entite>_<verbe>s` | `ephemeral` ou `view` (parfois `table` pour casser un plan SQL trop complexe) | Logique de transformation intermédiaire réutilisée par plusieurs Marts : jointures techniques, pivotement, filtrage complexe, ré-agrégation à la bonne granularité. Non exposée aux outils BI. |
| **Marts (`marts/`)** | `fct_<processus>`, `dim_<entite>` | `table` ou `incremental` | Tables finales orientées métier (Finance, Marketing, Produit), modélisées en schéma en étoile (Kimball) ou tables larges dénormalisées (OBT) pour la BI et le Machine Learning. |

---

## 2. Les 5 Matérialisations dbt et quand les choisir

1. **`view` (par défaut)** : Crée une `CREATE VIEW AS SELECT`. Ne stocke aucune donnée sur disque, mais recalcule la requête à chaque lecture. Idéal pour `staging/` où le coût de stockage est évité et la fraîcheur est immédiate.
2. **`table`** : Exécute un `CREATE OR REPLACE TABLE AS SELECT` complet à chaque `dbt run`. Lectures BI très rapides, mais coût de calcul élevé si la table dépasse plusieurs dizaines de millions de lignes.
3. **`incremental`** : Lors du premier run (ou avec `--full-refresh`), crée la table complète. Lors des runs suivants (`is_incremental() == True`), ne traite et n'insère/met à jour que les lignes nouvelles ou modifiées.
4. **`ephemeral`** : Ne crée aucun objet dans l'entrepôt. dbt injecte le code SQL du modèle comme une **CTE (`WITH ...`)** dans tous les modèles avals qui font `{{ ref('mon_modele_ephemere') }}`. Attention : abuser d'ephemeral sur plus de 2 niveaux rend les requêtes compilées illisibles et empêche de déboguer les données intermédiaires.
5. **`materialized_view`** : Crée une vue matérialisée gérée nativement par le Cloud Data Warehouse (rafraîchissement automatique côté moteur).

---

## 3. Modèles Incrémentaux : Stratégies et Pièges (`is_incremental()`)

### 3.1. Structure type d'un modèle incrémental robuste (avec Late Arriving Facts)

```sql
{{
    config(
        materialized='incremental',
        unique_key='order_id',
        incremental_strategy='merge',
        on_schema_change='append_new_columns'
    )
}}

WITH source_orders AS (
    SELECT
        order_id,
        customer_id,
        order_status,
        amount_eur,
        updated_at
    FROM {{ ref('stg_stripe__orders') }}
    {% if is_incremental() %}
        -- Fenêtre glissante de sécurité (Lookback Window de 3 jours)
        -- pour capter les événements arrivés en retard (Late Arriving Data)
        WHERE updated_at >= (
            SELECT DATEADD(day, -3, MAX(updated_at)) FROM {{ this }}
        )
    {% endif %}
)

SELECT * FROM source_orders
```

### 3.2. Comparatif des `incremental_strategy` en entretien

| Stratégie | Mécanisme SQL sous-jacent | Avantages | Inconvénients / Cas d'usage |
|---|---|---|---|
| **`append`** | `INSERT INTO target SELECT ...` | Très rapide, aucun scan de la table cible. | Ne gère pas les mises à jour. Crée des doublons en cas de re-run ! À réserver aux logs immuables purs. |
| **`merge`** | `MERGE INTO target USING source ON unique_key WHEN MATCHED UPDATE WHEN NOT MATCHED INSERT` | Gère proprement les `INSERT` et les `UPDATE` (Upsert idempotent). | Coûteux sur de très grandes tables si la table cible n'est pas bien clusterisée (`cluster_by`) ou si `incremental_predicates` n'est pas renseigné. |
| **`delete+insert`** | `DELETE FROM target WHERE unique_key IN (...)` puis `INSERT INTO` | Souvent plus performant que `MERGE` sur Redshift ou Snowflake quand peu de partitions sont touchées. | Nécessite une transaction atomique (`BEGIN ... COMMIT`). |
| **`insert_overwrite`** | Remplace atomiquement des **partitions entières** (`PARTITION BY DATE(event_ts)`). | **La meilleure stratégie sur BigQuery et Spark/Databricks** : zéro scan des lignes individuelles, remplacement atomique des partitions touchées. | Écrase toute la partition : le filtre `WHERE` doit obligatoirement inclure toutes les lignes des partitions réécrites. |
| **`microbatch`** *(dbt 1.9+)* | Découpe automatiquement les données temporelles par tranches (`event_time`, `batch_size='day'`, `lookback=3`). | Parallélise les backfills, simplifie la gestion des fenêtres glissantes sans écrire de sous-requête `SELECT MAX(...)`. | Uniquement adapté aux flux indexés par une colonne temporelle fiable. |

---

## 4. Snapshots dbt : Historisation SCD Type 2

Dans un système transactionnel (OLTP), une colonne `status` ou `address` est souvent écrasée sans garder l'historique (`SCD Type 1`). Les **Snapshots dbt** capturent l'état de la table source à intervalles réguliers et construisent une table **SCD Type 2** avec 4 colonnes métadonnées générées automatiquement :
- `dbt_scd_id` : clé technique unique de la version de ligne.
- `dbt_updated_at` : timestamp de mise à jour de la ligne source.
- `dbt_valid_from` : date de début de validité de cette version.
- `dbt_valid_to` : date de fin de validité (`NULL` pour la version courante active).

### Deux stratégies de Snapshot :
1. **`strategy='timestamp'` (recommandée)** : Surveille une colonne `updated_at` fiable. Si `updated_at` est plus récent que la dernière valeur connue, dbt ferme l'ancienne ligne (`dbt_valid_to = new_updated_at`) et insère la nouvelle (`dbt_valid_to = NULL`).
2. **`strategy='check'` (fallback)** : Si la table source n'a pas de colonne `updated_at` fiable, dbt calcule et compare un hash sur une liste de colonnes (`check_cols=['status', 'tier']` ou `check_cols='all'`). Plus coûteux en calcul.
- **Règle d'or en entretien** : on ne fait **jamais** de `dbt run --full-refresh` sur un snapshot, car l'historique capturé au fil du temps dans `snapshots/` ne peut pas être reconstruit si la source a écrasé ses anciennes valeurs !

---

## 5. Tests de Qualité des Données, Contrats et Gouvernance

1. **Tests génériques (Schema Tests dans `.yml`)** : `unique`, `not_null`, `accepted_values`, `relationships` (intégrité référentielle), enrichis par les packages `dbt_utils` (`unique_combination_of_columns`, `equal_rowcount`) et `dbt_expectations`.
2. **Tests singuliers (`tests/*.sql`)** : Requêtes SQL personnalisées qui **doivent retourner 0 ligne** pour passer (toute ligne retournée est une anomalie, ex : `SELECT order_id FROM {{ ref('fct_orders') }} WHERE amount_eur < 0`).
3. **Unit Tests (`unit_tests:` depuis dbt 1.8+)** : Permettent de tester la logique SQL d'un modèle complexe (regex, `CASE WHEN`, calculs financiers) avec des données d'entrée mockées statiques (`given`) et une sortie attendue (`expect`), **sans lire les vraies tables de production**.
4. **Model Contracts (`contract: { enforced: true }`)** : Oblige dbt à vérifier à la compilation et à l'exécution que chaque colonne respecte exactement le nom, le `data_type` et les contraintes (`not_null`) déclarés dans le fichier YAML. Protège les consommateurs en aval contre les *breaking changes*.

---

## 6. Déploiement Continu : Slim CI et `state:modified+`

Sur un projet de 800 modèles dbt, relancer `dbt build` complet à chaque Pull Request (PR) coûterait trop cher et prendrait des heures. On met en place le **Slim CI** :

```bash
# Dans le pipeline CI (GitHub Actions / GitLab CI) sur un schéma éphémère pr_142 :
dbt build --select state:modified+ --defer --state ./prod-manifest/
```

- **`--state ./prod-manifest/`** : Compare le code de la PR avec l'artefact `manifest.json` du dernier run de production.
- **`--select state:modified+`** : N'exécute et ne teste **que** les modèles qui ont été modifiés dans la PR ainsi que leurs dépendances en aval (`+`).
- **`--defer`** : Pour tous les modèles parents en amont qui n'ont **pas** été modifiés, dbt ne les recalcule pas dans le schéma de la PR : il pointe directement (`defer`) vers les tables de production existantes ! Gain de temps et de coût de 85 % à 95 %.

---

*Source : générée par IA et vérifiée dans la documentation officielle dbt Labs Best Practices, Incremental Models & Slim CI (2026-10-31).*
