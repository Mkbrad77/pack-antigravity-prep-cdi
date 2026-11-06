# Chapitre 2.11 : Manipulation de Dates, Fuseaux Horaires, Intervalles & Analyse de Cohortes / Rétention

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W05-I2` (Séance 2 de la Semaine 5 : 30 min)  
**Exercices pratiques de la séance :** `sql-060` (Durée de session en secondes et minutes), `sql-066` (Délai en jours entre deux promotions via LAG), `sql-076` (Détection de chevauchement d'intervalles temporels)

---

## 1. Correspondance des fonctions temporelles entre dialectes SQL

En entretien, précisez toujours le dialecte SQL utilisé (Snowflake/PostgreSQL vs SQLite) :

| Opération | Snowflake / PostgreSQL / DuckDB | SQLite (Éditeur local de l'application) |
| :--- | :--- | :--- |
| **Tronquer au mois / jour** | `DATE_TRUNC('month', order_date)` | `strftime('%Y-%m', order_date)` |
| **Extraire l'année / jour de semaine** | `EXTRACT(YEAR FROM d)` / `EXTRACT(DOW FROM d)` | `strftime('%Y', d)` / `strftime('%w', d)` |
| **Différence entre deux timestamps** | `DATEDIFF('second', t1, t2)` | `(julianday(t2) - julianday(t1)) * 86400` |
| **Ajouter un intervalle** | `DATEADD('day', 7, d)` ou `d + INTERVAL '7 days'` | `date(d, '+7 days')` |

> **Bonne pratique d'architecture Data :** Stockez toujours les horodatages d'événements en **UTC (`TIMESTAMP_TZ` ou ISO-8601 UTC)** dans les couches Bronze et Silver, et ne convertissez vers le fuseau horaire métier (`Europe/Paris`) qu'au niveau de la couche Gold / BI.

---

## 2. Les 3 patterns temporels classiques en entretien

### Pattern 1 : Durée de session et filtrage des anomalies NTP (Exercice `sql-060`)
Dans les logs mobiles ou IoT, des horloges désynchronisées produisent parfois `end_time < start_time`. Avant de calculer la durée moyenne de session, filtrez toujours `WHERE end_time IS NOT NULL AND end_time >= start_time`.

### Pattern 2 : Délai écoulé entre deux événements consécutifs d'un même individu (Exercice `sql-066`)
En combinant `LAG(effective_date) OVER (PARTITION BY employee_id ORDER BY effective_date ASC)` dans une CTE et une différence de dates dans la requête principale, on mesure l'intervalle exact entre deux achats, deux connexions ou deux revalorisations salariales.

### Pattern 3 : Théorème de détection de chevauchement de deux intervalles `[Start1, End1]` et `[Start2, End2]` (Exercice `sql-076`)
Question classique pour auditer une table SCD Type 2 ou des abonnements : *« Comment détecter deux contrats d'un même client dont les périodes de validité se chevauchent ? »*
- Deux segments $[A, B]$ et $[C, D]$ se chevauchent **si et seulement si** :
  $$A \le D \quad \text{ET} \quad C \le B$$
- Si `end_date` peut être `NULL` (abonnement toujours actif aujourd'hui), remplacez-le par une date sentinelle infinie avec `COALESCE(end_date, '9999-12-31')` :

```sql
SELECT
    s1.user_id,
    s1.sub_id AS sub1_id, s1.plan_name AS plan1, s1.start_date AS start1, s1.end_date AS end1,
    s2.sub_id AS sub2_id, s2.plan_name AS plan2, s2.start_date AS start2
FROM subscriptions s1
INNER JOIN subscriptions s2
    ON s1.user_id = s2.user_id
   AND s1.sub_id < s2.sub_id  -- Évite de comparer une ligne avec elle-même ou en double (A,B) et (B,A)
WHERE s1.start_date <= COALESCE(s2.end_date, '9999-12-31')
  AND s2.start_date <= COALESCE(s1.end_date, '9999-12-31')
ORDER BY s1.user_id, sub1_id;
```

---

## 3. Sources officielles vérifiées
- Documentation officielle Snowflake, *Date & Time Functions* : https://docs.snowflake.com/en/sql-reference/functions-date-time (consulté le 31 octobre 2026).
- Documentation officielle SQLite, *Date And Time Functions (`strftime`, `julianday`)* : https://www.sqlite.org/lang_datefunc.html (consulté le 31 octobre 2026).
