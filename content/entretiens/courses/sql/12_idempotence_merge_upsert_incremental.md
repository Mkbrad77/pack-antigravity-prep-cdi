# Chapitre 2.21 : Idempotence des Pipelines SQL : MERGE (Upsert), INSERT OVERWRITE & Chargement Incrémental

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W06-I2` (Séance 2 de la Semaine 6 : 25 min)  
**Exercices pratiques de la séance :** `sql-068` (Dédoublonnage de flux Kafka at-least-once), `sql-071` (Dernier état connu / Current Snapshot), `sql-075` (Construction de table SCD Type 2 avec LEAD)

---

## 1. Qu'est-ce qu'un pipeline SQL idempotent ?

Un pipeline est **idempotent** si l'exécuter $1$ fois ou $5$ fois de suite sur la même fenêtre de données produit **exactement le même état final dans la table cible**, sans créer de doublons ni gonfler artificiellement les métriques financières.

> **Anti-pattern absolu :** Un job Airflow qui fait un simple `INSERT INTO fact_orders SELECT * FROM staging_orders WHERE order_date = CURRENT_DATE`. Si le job échoue à 90 % et est relancé (retry), les lignes sont insérées en double !

---

## 2. Les 3 stratégies d'écriture idempotente (Snowflake, Iceberg, Delta Lake, dbt)

| Stratégie | Mécanisme SQL | Avantages / Inconvénients |
| :--- | :--- | :--- |
| **1. `MERGE INTO` (Upsert)** | Joint la source et la cible sur la clé unique : `WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ...` | Précis pour mettre à jour des lignes individuelles modifiées tardivement (*late-arriving updates*), mais coûteux si la table cible est immense et non partitionnée |
| **2. `DELETE + INSERT` dans une transaction** | `BEGIN; DELETE FROM target WHERE dt = '2026-10-31'; INSERT INTO target SELECT ...; COMMIT;` | Très rapide si la colonne `dt` est clé de clustering/partitionnement, 100 % idempotent |
| **3. `INSERT OVERWRITE` par partition** | Remplace atomiquement la partition entière du jour ou du mois | Standard sur Spark / Iceberg / BigQuery (`incremental_strategy='insert_overwrite'` dans dbt) |

---

## 3. Du Streaming *At-Least-Once* au Modèle Historisé SCD Type 2

### 3.1. Dédoublonnage en entrée de `MERGE` (Exercice `sql-068`)
Les producteurs Kafka/Kinesis fonctionnent généralement en garantie **at-least-once** : en cas de timeout réseau, le même message est réémis.
- Si la table source d'une instruction `MERGE INTO` contient deux lignes avec la même clé primaire, Snowflake/PostgreSQL lève une erreur fatale : `Duplicate row detected during DML action`.
- **Règle d'or :** Toujours dédoublonner le lot entrant avec `ROW_NUMBER() OVER (PARTITION BY event_key ORDER BY ingested_at DESC) = 1` **avant** de l'envoyer dans le `MERGE`.

### 3.2. Snapshot d'état courant vs Historisation SCD Type 2 (Exercices `sql-071` et `sql-075`)
- **État courant (`sql-071`) :** Conserver uniquement la version la plus récente (`ORDER BY start_date DESC, sub_id DESC` avec `rn = 1`).
- **Historique complet SCD Type 2 (`sql-075`) :** Utiliser `LEAD(effective_date) OVER (PARTITION BY employee_id ORDER BY effective_date ASC)` pour calculer automatiquement la borne de fin de validité `valid_to` de chaque ligne et le drapeau `is_current` (`1` lorsque `valid_to IS NULL`, `0` sinon).

---

## 4. Sources officielles vérifiées
- Documentation officielle Snowflake, *MERGE command* : https://docs.snowflake.com/en/sql-reference/sql/merge (consulté le 31 octobre 2026).
- Documentation officielle dbt, *About incremental models & strategies* : https://docs.getdbt.com/docs/build/incremental-models (consulté le 31 octobre 2026).
