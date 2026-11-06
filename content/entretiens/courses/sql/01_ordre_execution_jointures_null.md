# Chapitres 2.1 à 2.3 : Ordre d'exécution logique SQL, Jointures (INNER, LEFT, Anti-Join, Self-Join) & Pièges des NULL

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W02-I1` (Séance 1 de la Semaine 2 : 20 min)  
**Exercices pratiques de la séance :** `sql-004` (Clients avec email NULL ou vide), `sql-022` (Clients sans commande : Anti-Join), `sql-025` (Hiérarchie employés et managers : Self-Join)

---

## 1. Ordre d'exécution logique d'une requête SQL (Question reine d'entretien)

L'ordre dans lequel on **écrit** une requête SQL (`SELECT ... FROM ...`) n'est pas l'ordre dans lequel le moteur de base de données l'**évalue** :

1. **`FROM` & `JOIN` (`ON`)** : Assemblage des tables sources et application des prédicats de jointure.
2. **`WHERE`** : Filtrage des lignes individuelles **avant** toute agrégation ou fonction de fenêtrage.
3. **`GROUP BY`** : Regroupement des lignes par clés uniques.
4. **`HAVING`** : Filtrage des groupes agrégés (ex: `HAVING COUNT(*) >= 2`).
5. **Fonctions de fenêtrage (`OVER (...)`)** : Calculées après le `HAVING` et avant `DISTINCT`/`ORDER BY` !
6. **`SELECT`** : Projection des colonnes et création des alias.
7. **`DISTINCT`** : Élimination des lignes dupliquées projetées.
8. **`ORDER BY`** : Tri final du jeu de résultats (seule étape standard où l'on peut référencer un alias du `SELECT`).
9. **`LIMIT` / `OFFSET`** : Troncature du nombre de lignes retournées.

> **Conséquence directe en entretien :**
> - On ne peut pas utiliser un alias défini dans le `SELECT` à l'intérieur du `WHERE` (sauf extension propriétaire comme Snowflake).
> - On ne peut pas filtrer un `ROW_NUMBER() OVER (...)` dans le `WHERE` : il faut utiliser une **CTE** (ou la clause `QUALIFY` sur Snowflake/BigQuery/DuckDB).

---

## 2. Les Jointures de Production : Anti-Join, Self-Join et Condition dans `ON` vs `WHERE`

### 2.1. Le pattern `LEFT Anti-Join` (Exercice `sql-022`)
Pour trouver les enregistrements de la table $A$ qui n'ont **aucune correspondance** dans la table $B$ (ex: clients inscrits n'ayant jamais commandé, ou clés étrangères orphelines) :

```sql
SELECT c.customer_id, c.first_name, c.last_name, c.email
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL
ORDER BY c.customer_id;
```

### 2.2. Piège critique : Filtre dans le `ON` vs dans le `WHERE` sur un `LEFT JOIN`
```sql
-- FAUX si l'on veut garder tous les clients : le WHERE élimine les lignes où o.status est NULL !
-- Cela transforme silencieusement le LEFT JOIN en INNER JOIN.
SELECT c.customer_id, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'completed';

-- BON : placer le filtre de la table de droite directement dans la clause ON
SELECT c.customer_id, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'completed';
```

### 2.3. Le `Self-Join` pour modéliser une hiérarchie (Exercice `sql-025`)
Lorsqu'une table contient une clé étrangère pointant vers sa propre clé primaire (`manager_id -> employee_id`), on joint la table à elle-même avec deux alias distincts (`e` pour l'employé, `m` pour le manager) via un **`LEFT JOIN`** afin de ne pas exclure la Direction Générale (`manager_id IS NULL`).

---

## 3. Logique ternaire des `NULL` (`TRUE`, `FALSE`, `UNKNOWN`, Exercice `sql-004`)
- En SQL, `NULL` signifie « valeur inconnue ». Toute comparaison arithmétique ou d'égalité `col = NULL` ou `col != NULL` renvoie **`UNKNOWN`** (qui est rejeté par `WHERE`).
- Utilisez toujours `IS NULL`, `IS NOT NULL`, `COALESCE(col, 'defaut')` et pensez à nettoyer les chaînes constituées d'espaces avec `TRIM(email) = ''`.

---

## 4. Sources officielles vérifiées
- Documentation officielle PostgreSQL 17, *Table Expressions & Join Types* : https://www.postgresql.org/docs/current/queries-table-expressions.html (consulté le 31 octobre 2026).
- Documentation officielle Snowflake, *JOIN & NULL handling* : https://docs.snowflake.com/en/sql-reference/constructs/join (consulté le 31 octobre 2026).
