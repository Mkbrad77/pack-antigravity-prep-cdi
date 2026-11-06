# Chapitre 2.24 : Data Quality & Observabilité en SQL : Audits d'intégrité, Fraîcheur SLA & Modèle en Étoile

**Module :** Module 2 : SQL Avancé  
**Tâches associées :** `W06-I4` (Semaine 6 : 20 min, bonus) et `W21-I2` (Semaine 21 : 45 min, révision finale SQL)  
**Exercices pratiques de la séance :** `sql-096` (Table de faits Star Schema Kimball), `sql-101` (Audit de clés orphelines), `sql-102` (Taux de complétude non-NULL), `sql-104` (Fraîcheur SLA des données), `sql-105` (Pipeline ELT complet Staging vers Mart)

---

## 1. Les 4 piliers de l'Observabilité des Données (Data Observability) en SQL

Avant d'exposer une table `mart_*` ou `fact_*` aux équipes métier ou aux modèles de Machine Learning, un Data Engineer automatise **4 familles d'assertions SQL** (correspondant aux tests génériques et singuliers de **dbt**) :

| Pilier | Ce que l'on vérifie | Pattern SQL associé | Exercice |
| :--- | :--- | :--- | :--- |
| **1. Intégrité référentielle (`relationships`)** | Aucune clé étrangère de la table de faits ne pointe vers une dimension inexistante | `LEFT JOIN dim ON fact.fk = dim.pk WHERE dim.pk IS NULL` | `sql-101` |
| **2. Complétude (`not_null` / taux de remplissage)** | Pourcentage de valeurs renseignées par colonne critique | `ROUND(COUNT(col) * 100.0 / COUNT(*), 1)` (`COUNT(col)` ignore les `NULL`) | `sql-102` |
| **3. Fraîcheur (`source freshness` / SLA)** | Délai écoulé depuis le dernier événement ingéré ($\le$ seuil d'alerte) | `(julianday(now) - julianday(MAX(event_ts))) * 24.0` | `sql-104` |
| **4. Exactitude métier & Modèle en étoile** | Grain explicite, absence de quantités négatives, réconciliation Staging $\rightarrow$ Mart | Jointures en étoile + CTE modulaires | `sql-096`, `sql-105` |

---

## 2. Synthèse d'Entretien : Construire un Mart Analytique de bout en bout (Exercices `sql-096` et `sql-105`)

Lorsqu'un recruteur vous demande d'écrire une requête analytique complexe combinant plusieurs tables (ex: `user_sessions`, `events_stream`, `subscriptions`) :

1. **Définir le grain de la table de sortie en commentaire dès la ligne 1** (ex: `-- Grain : 1 ligne par user_id`).
2. **Isoler chaque agrégation 1-N dans sa propre CTE** (`user_events` agrégé par `user_id`, `active_subs` filtré sur `is_active = 1`) pour éviter toute explosion du nombre de lignes (*Fan-Out* / *Chasm Trap*).
3. **Assembler dans le `SELECT` final** à partir de la table maîtresse avec des `LEFT JOIN` et des `COALESCE(metric, 0)` pour que les utilisateurs sans événements apparaissent proprement avec `0` au lieu de `NULL`.

```sql
WITH user_events AS (
    SELECT user_id, COUNT(*) AS nb_events
    FROM events_stream
    GROUP BY user_id
),
active_subs AS (
    SELECT user_id, plan_name
    FROM subscriptions
    WHERE is_active = 1
)
SELECT
    s.user_id,
    COUNT(DISTINCT s.session_id) AS total_sessions,
    COALESCE(ue.nb_events, 0)    AS total_events,
    COALESCE(asub.plan_name, 'Aucun') AS plan_actuel
FROM user_sessions s
LEFT JOIN user_events ue  ON s.user_id = ue.user_id
LEFT JOIN active_subs asub ON s.user_id = asub.user_id
GROUP BY s.user_id, ue.nb_events, asub.plan_name
ORDER BY total_events DESC, s.user_id ASC;
```

---

## 3. Sources officielles vérifiées
- Documentation officielle dbt, *Add data tests to your DAG & Source Freshness* : https://docs.getdbt.com/docs/build/data-tests (consulté le 31 octobre 2026).
- Kimball Group, *Dimensional Modeling Techniques (Star Schema, Grain, Surrogate Keys)* : https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/ (consulté le 31 octobre 2026).
