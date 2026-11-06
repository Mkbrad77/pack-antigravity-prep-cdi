# Chapitre 2.6 : CTE Modulaires vs Sous-requêtes Corrélées : Lisibilité, Matérialisation & Optimisation

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W04-I1` (Séance 1 de la Semaine 4 : 30 min)  
**Exercices pratiques de la séance :** `sql-031` (Top clients par CA via CTE), `sql-032` (Marge nette par commande via CTE chaînées), `sql-089` (Remplacement d'une sous-requête corrélée par un JOIN)

---

## 1. Pourquoi structurer ses requêtes en CTE chaînées (`WITH ... AS`)

En ingénierie analytique (et particulièrement avec **dbt**), les sous-requêtes imbriquées sur 4 niveaux sont considérées comme un anti-pattern majeur : elles se lisent de l'intérieur vers l'extérieur et sont impossibles à déboguer unitairement.  
Les **CTE (Common Table Expressions)** permettent d'écrire une transformation **de haut en bas** comme un pipeline de fonctions pures :

```sql
WITH order_costs AS (
    -- Étape 1 : Agréger le coût de revient au grain order_id
    SELECT
        oi.order_id,
        ROUND(SUM(p.cost_price * oi.quantity), 2) AS cout_total
    FROM order_items oi
    INNER JOIN products p ON oi.product_id = p.product_id
    WHERE oi.quantity > 0
    GROUP BY oi.order_id
)
-- Étape 2 : Réconcilier avec la table des commandes au même grain
SELECT
    o.order_id,
    o.order_date,
    o.total_amount,
    oc.cout_total,
    ROUND(o.total_amount - oc.cout_total, 2) AS marge_nette
FROM orders o
INNER JOIN order_costs oc ON o.order_id = oc.order_id
WHERE o.status = 'completed'
ORDER BY marge_nette DESC;
```

---

## 2. Le piège du *Fan-Out* (Multiplication des lignes lors d'une jointure 1-N)

Regardez attentivement l'exemple ci-dessus (`sql-032`) :
- Si vous aviez joint `orders`, `order_items` et `products` dans une seule requête plate en faisant `SUM(o.total_amount)`, le montant `o.total_amount` d'une commande contenant **3 articles** aurait été **compté 3 fois** !
- **Règle d'or en entretien :** Toujours pré-agréger la table de détail (`order_items`) dans une CTE au grain de la clé de jointure (`order_id`) **avant** de la joindre à la table d'en-tête (`orders`).

---

## 3. Matérialisation des CTE (Inlining vs Optimization Fence) & Sous-requêtes corrélées

### 3.1. Une CTE est-elle matérialisée en mémoire ?
- Dans la plupart des moteurs modernes (**PostgreSQL 12+**, **Snowflake**, **DuckDB**, **Spark SQL**), une CTE référencée **une seule fois** est automatiquement fusionnée (*inlined*) dans la requête principale, permettant le **Predicate Pushdown** des filtres du `WHERE` final vers la CTE.
- Si une CTE coûteuse est référencée **plusieurs fois** dans la requête, l'optimiseur peut choisir de la matérialiser une seule fois en table temporaire (sous PostgreSQL, on peut forcer ce comportement avec `WITH cte AS MATERIALIZED (...)` ou `NOT MATERIALIZED`).

### 3.2. Éliminer les sous-requêtes corrélées dans le `SELECT` (Exercice `sql-089`)
Une sous-requête corrélée dépend d'une colonne de la requête externe et s'exécute Conceptuellement **une fois par ligne externe ($O(N)$ requêtes)**. Remplacez-la systématiquement par un `LEFT JOIN` ou une CTE pré-agrégée.

---

## 4. Sources officielles vérifiées
- Documentation officielle PostgreSQL 17, *WITH Queries (Common Table Expressions & Materialization)* : https://www.postgresql.org/docs/current/queries-with.html (consulté le 31 octobre 2026).
