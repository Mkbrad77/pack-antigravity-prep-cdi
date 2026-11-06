# Chapitres 2.16 à 2.17 : Architecture interne des SGBD : Pages, B-Tree, Index Composites & Covering Index

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W03-I1` (Séance 1 de la Semaine 3 : 20 min)  
**Exercices pratiques de la séance :** `sql-082` (SCAN TABLE vs SEARCH TABLE par clé primaire), `sql-084` (Impact de LIKE '%terme' sur un B-Tree), `sql-087` (Index Couvrant / Covering Index)

---

## 1. Comment un SGBD relationnel stocke et recherche les données : Heap Pages & B-Tree

Dans une base OLTP (PostgreSQL, MySQL, SQLite) :
- La table est stockée sous forme de **pages de taille fixe** (8 Ko dans PostgreSQL, 4 Ko dans SQLite).
- Sans index pertinent, le moteur effectue un **Sequential Scan (`SCAN TABLE`)** en $O(N)$ : il lit chaque page disque du début à la fin.
- Un **Index B-Tree (Balanced Tree)** maintient un arbre équilibré trié dont les feuilles pointent vers l'adresse physique des lignes (`rowid` ou `ctid`), abaissant la recherche d'égalité ou d'intervalle à **$O(\log N)$** (`SEARCH TABLE ... USING INDEX`).

---

## 2. Les 4 règles d'indexation testées en entretien

### Règle 1 : Règle du préfixe gauche sur un Index Composite `(A, B, C)`
Un index composite `CREATE INDEX idx_orders_cust_date ON orders(customer_id, order_date)` est trié d'abord par `customer_id`, puis, à `customer_id` égal, par `order_date`.
- Il accélère `WHERE customer_id = 42` et `WHERE customer_id = 42 AND order_date >= '2026-01-01'`.
- Il **n'accélère pas** une requête qui filtre uniquement sur la 2e colonne `WHERE order_date = '2026-01-01'` (sans mentionner `customer_id`).

### Règle 2 : Pourquoi `LIKE '%@example.com'` désactive l'index B-Tree (Exercice `sql-084`)
Un index B-Tree sur du texte trie les chaînes de gauche à droite par ordre alphabétique :
- `WHERE email LIKE 'alex%'` utilise l'index (recherche d'intervalle `email >= 'alex' AND email < 'aley'`).
- `WHERE email LIKE '%@example.com'` commence par un joker `%` : la première lettre étant inconnue, l'arbre B-Tree est inutilisable et le moteur retombe sur un **Full Table Scan**.
  - *Astuce d'entretien pour corriger ce problème :* Stocker une colonne calculée `email_domain` indexée, ou créer un index sur `REVERSE(email)` (ou un index trigramme `GIN pg_trgm` sous PostgreSQL).

### Règle 3 : Fonctions sur colonne indexée = Non-SARGable
Écrire `WHERE LOWER(email) = 'a@b.com'` ou `WHERE YEAR(order_date) = 2026` empêche d'utiliser un index standard sur `email` ou `order_date`.
- **Correction :** Créer un **Index Fonctionnel** `CREATE INDEX idx_lower_email ON customers(LOWER(email))`, ou réécrire le prédicat sur une plage brute : `WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'`.

### Règle 4 : Le Covering Index (Index-Only Scan, Exercice `sql-087`)
Si toutes les colonnes présentes dans le `SELECT`, le `WHERE` et l'`ORDER BY` sont contenues dans l'index lui-même (ex: via `CREATE INDEX idx ON orders(customer_id) INCLUDE (total_amount)`), le moteur répond à la requête **uniquement en lisant l'index**, sans jamais faire d'accès disque aléatoire vers les pages de la table principale (**Index-Only Scan**).

---

## 3. Sources officielles vérifiées
- Documentation officielle PostgreSQL 17, *Indexes (B-Tree, Multicolumn, Index-Only Scans)* : https://www.postgresql.org/docs/current/indexes.html (consulté le 31 octobre 2026).
- Documentation officielle SQLite, *The SQLite Query Planner* : https://www.sqlite.org/optoverview.html (consulté le 31 octobre 2026).
