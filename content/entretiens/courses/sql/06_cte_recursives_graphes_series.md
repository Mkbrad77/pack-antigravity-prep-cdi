# Chapitre 2.7 : CTE Récursives (WITH RECURSIVE) : Hiérarchies d'entreprise, Graphes de lignage & Séries de dates

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W04-I2` (Séance 2 de la Semaine 4 : 30 min)  
**Exercices pratiques de la séance :** `sql-037` (Arbre hiérarchique descendant via CTE récursive), `sql-038` (Analyse de rétention multi-mois par CTE)

---

## 1. Anatomie d'une CTE Récursive (`WITH RECURSIVE`)

Une CTE récursive permet de parcourir des **arbres de profondeur inconnue** (organigrammes RH, nomenclatures de produits, lignage de tables de données) ou de **générer des séquences** (calendrier de dates continu) directement en SQL standard.

Elle se compose toujours de **3 blocs obligatoires** :
1. **Le membre d'ancrage (Anchor Member) :** La requête de base non récursive qui initialise l'étape `level = 1` (ex: la PDG où `manager_id IS NULL`).
2. **L'opérateur `UNION ALL`** (ou `UNION` si l'on veut dédoublonner pour éviter des boucles).
3. **Le membre récursif (Recursive Member) :** Une requête qui joint la table source à la CTE elle-même (`org_chart`) et incrémente la profondeur (`o.level + 1`).

---

## 2. Exemple canonique d'entretien : Organigramme hiérarchique (Exercice `sql-037`)

```sql
WITH RECURSIVE org_chart AS (
    -- 1. Ancrage : racine de la hiérarchie (niveau 1)
    SELECT
        employee_id,
        full_name,
        manager_id,
        1 AS level
    FROM employees
    WHERE manager_id IS NULL
      AND termination_date IS NULL

    UNION ALL

    -- 2. Récursion : rattachement des subordonnés directs (niveau N + 1)
    SELECT
        e.employee_id,
        e.full_name,
        e.manager_id,
        o.level + 1 AS level
    FROM employees e
    INNER JOIN org_chart o ON e.manager_id = o.employee_id
    WHERE e.termination_date IS NULL
)
SELECT employee_id, full_name, manager_id, level
FROM org_chart
ORDER BY level ASC, employee_id ASC;
```

---

## 3. Deux autres cas d'usage fréquents en entretien Data Engineer

### 3.1. Générer un calendrier continu (Date Spine) pour combler les jours sans ventes
Lorsqu'une table `orders` n'a aucune vente le dimanche, un `GROUP BY order_date` omet complètement la ligne du dimanche. Pour afficher `0 EUR` les jours sans activité, on génère une CTE récursive de dates (`date_spine`) de `start_date` à `end_date`, puis on fait un `LEFT JOIN` vers `orders`.

### 3.2. Protection contre les boucles infinies dans un graphe cyclique
Si les données sources contiennent une anomalie où `A est manager de B` et `B est manager de A`, la CTE récursive boucle à l'infini :
- Toujours ajouter un garde-fou de profondeur maximale dans le `WHERE` du membre récursif : `WHERE o.level < 20`.

---

## 4. Sources officielles vérifiées
- Documentation officielle SQLite, *The WITH Clause and Recursive Common Table Expressions* : https://www.sqlite.org/lang_with.html (consulté le 31 octobre 2026).
- Documentation officielle PostgreSQL 17, *Recursive Queries* : https://www.postgresql.org/docs/current/queries-with.html#QUERIES-WITH-RECURSIVE (consulté le 31 octobre 2026).
