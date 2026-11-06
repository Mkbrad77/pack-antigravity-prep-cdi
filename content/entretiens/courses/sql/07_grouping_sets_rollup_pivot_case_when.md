# Chapitre 2.8 : Agrégations avancées : GROUPING SETS, ROLLUP, CUBE & Pivotage conditionnel (CASE WHEN)

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W04-I3` (Séance 3 de la Semaine 4 : 30 min, bonus)  
**Exercices pratiques de la séance :** `sql-052` (Pivotage en colonnes par SUM CASE WHEN), `sql-014` (Clients récurrents WHERE + GROUP BY + HAVING), `sql-048` (Part en % du CA global avec SUM OVER)

---

## 1. Le Pivotage Universel en SQL : `SUM(CASE WHEN ...)` (Exercice `sql-052`)

Tous les moteurs SQL ne supportent pas l'opérateur propriétaire `PIVOT` de la même façon. En revanche, l'**agrégation conditionnelle (`SUM(CASE WHEN ...)` ou `COUNT(CASE WHEN ...)` / clause `FILTER`)** fonctionne sur **100 % des bases SQL** (PostgreSQL, Snowflake, BigQuery, Redshift, DuckDB, SQLite, Spark SQL) et est la méthode attendue en entretien :

```sql
SELECT
    customer_id,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS nb_completed,
    SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) AS nb_pending,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS nb_cancelled
FROM orders
WHERE customer_id != 999
GROUP BY customer_id
ORDER BY customer_id;
```

---

## 2. Calculer une part en pourcentage du total en un seul scan : `SUM(...) OVER ()` (Exercice `sql-048`)

Comment calculer pour chaque produit sa part en pourcentage du chiffre d'affaires global sans faire une sous-requête scalaire `SELECT SUM(...)` supplémentaire ?
- Une fonction de fenêtrage avec une clause **`OVER ()` vide** calcule la somme sur l'ensemble des lignes de l'étape d'agrégation :

```sql
WITH product_sales AS (
    SELECT
        product_id,
        ROUND(SUM(quantity * unit_price), 2) AS ca_produit
    FROM order_items
    WHERE quantity > 0
    GROUP BY product_id
)
SELECT
    p.product_id,
    p.name AS product_name,
    ps.ca_produit,
    ROUND((ps.ca_produit * 100.0) / SUM(ps.ca_produit) OVER (), 2) AS part_ca_pct
FROM product_sales ps
INNER JOIN products p ON ps.product_id = p.product_id
ORDER BY part_ca_pct DESC;
```
> **Piège de la division entière en SQL :** Toujours multiplier par **`100.0`** (flottant) avant de diviser, car `entier / entier` tronque les décimales à `0` dans de nombreux dialectes SQL !

---

## 3. Agrégations multi-dimensionnelles : `GROUPING SETS`, `ROLLUP` et `CUBE`

Au lieu d'empiler plusieurs `SELECT ... GROUP BY` avec des `UNION ALL` (ce qui oblige à scanner la table de faits plusieurs fois), les extensions OLAP calculent tous les sous-totaux en **un seul passage** :
- **`GROUP BY GROUPING SETS ((pays, mois), (pays), ())`** : Calcule exactement les regroupements listés.
- **`GROUP BY ROLLUP (annee, trimestre, mois)`** : Calcule les sous-totaux hiérarchiques descendants : `(annee, trimestre, mois)`, `(annee, trimestre)`, `(annee)` et le grand total `()`.
- **`GROUP BY CUBE (pays, categorie)`** : Calcule les $2^N$ combinaisons possibles de dimensions.

---

## 4. Sources officielles vérifiées
- Documentation officielle Snowflake, *GROUP BY ROLLUP, CUBE, and GROUPING SETS* : https://docs.snowflake.com/en/sql-reference/constructs/group-by-rollup (consulté le 31 octobre 2026).
