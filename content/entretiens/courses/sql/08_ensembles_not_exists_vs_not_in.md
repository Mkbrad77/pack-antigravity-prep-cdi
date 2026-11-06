# Chapitre 2.9 : Opérateurs ensemblistes (UNION ALL vs UNION, INTERSECT, EXCEPT) & Logique Ternaire des NULL

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W05-I1` (Séance 1 de la Semaine 5 : 30 min)  
**Exercices pratiques de la séance :** `sql-005` (Statuts NULL ou invalides), `sql-090` (Sécurité de NOT EXISTS vs piège de NOT IN avec NULL), `sql-091` (EXISTS Semi-Join vs DISTINCT)

---

## 1. Le piège mortel de `NOT IN` en présence de valeurs `NULL` (Exercice `sql-090`)

C'est la question piège n°1 des entretiens SQL Data Engineer :
> *« Que retourne `SELECT * FROM customers WHERE customer_id NOT IN (SELECT customer_id FROM blacklist)` si la table `blacklist` contient les valeurs `(10, 20, NULL)` ? »*

- **Réponse : `0 ligne` (un résultat totalement vide) !**
- **Explication mathématique :** `x NOT IN (10, 20, NULL)` est réécrit par le moteur SQL comme :
  `x != 10 AND x != 20 AND x != NULL`
  Or, en logique ternaire SQL, `x != NULL` vaut **`UNKNOWN`**. Et `TRUE AND TRUE AND UNKNOWN` vaut **`UNKNOWN`**, ce qui filtre 100 % des lignes dans une clause `WHERE` !
- **Solution robuste :** Utilisez systématiquement **`NOT EXISTS`** (ou un `LEFT JOIN ... WHERE key IS NULL`), qui gère correctement les `NULL` et profite d'un plan d'exécution **Anti-Join** court-circuité :

```sql
SELECT c.customer_id, c.first_name, c.last_name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
)
ORDER BY c.customer_id;
```

---

## 2. Pourquoi remplacer `SELECT DISTINCT ... JOIN` par `EXISTS` (Semi-Join, Exercice `sql-091`)

Pour lister les clients ayant passé au moins une commande complétée :
- **Approche coûteuse (`SELECT DISTINCT c.* FROM customers c JOIN orders o ...`) :** Si un gros client a passé $50\,000$ commandes, le `JOIN` génère d'abord les $50\,000$ lignes dupliquées avant de trier et dédoublonner.
- **Approche optimale (`WHERE EXISTS (...)`) :** L'opérateur `EXISTS` exécute un **Semi-Join** : dès qu'il trouve la **première** commande valide du client, il arrête immédiatement de parcourir le reste des commandes de ce client !

---

## 3. Opérateurs ensemblistes : `UNION ALL` vs `UNION`, `INTERSECT` et `EXCEPT`

| Opérateur | Dédoublonne ? | Coût CPU / Mémoire | Usage recommandé en Data Engineering |
| :--- | :--- | :--- | :--- |
| **`UNION ALL`** | **Non** | **$O(N + M)$ (Streaming direct, zéro tri)** | Concaténation de partitions ou de tables de staging disjointes |
| **`UNION`** | Oui | $O((N+M) \log(N+M))$ (Tri/Hash global) | Uniquement si des doublons inter-tables doivent être purgés |
| **`EXCEPT` (ou `MINUS`)** | Oui | Élevé (Hash/Sort) | Tests de non-régression SQL : vérifier que `SELECT * FROM table_v1 EXCEPT SELECT * FROM table_v2` est vide |
| **`INTERSECT`** | Oui | Élevé (Hash/Sort) | Lignes strictement identiques entre deux tables |

> **Astuce comparative :** Contrairement à l'opérateur `=`, les opérateurs `EXCEPT` et `INTERSECT` considèrent deux valeurs `NULL` comme **égales entre elles** (`IS NOT DISTINCT FROM`), ce qui les rend parfaits pour comparer deux tables lors d'une migration de pipeline !

---

## 4. Sources officielles vérifiées
- Documentation officielle PostgreSQL 17, *Combining Queries (UNION, INTERSECT, EXCEPT)* : https://www.postgresql.org/docs/current/queries-union.html (consulté le 31 octobre 2026).
