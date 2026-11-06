# Chapitres 2.18 à 2.20 : Stockage Orienté Colonnes (OLAP), Partitionnement, Clustering Snowflake & Lecture d'EXPLAIN

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W03-I2` (Séance 2 de la Semaine 3 : 20 min)  
**Exercices pratiques de la séance :** `sql-085` (Plan de jointure Nested Loop), `sql-086` (Allocation mémoire USE TEMP B-TREE sur GROUP BY), `sql-093` (Projection stricte en base orientée colonnes)

---

## 1. OLTP (Ligne) vs OLAP (Colonne : Snowflake, Redshift, BigQuery, Parquet)

| Caractéristique | Base OLTP orientée Lignes (PostgreSQL, RDS) | Entrepôt OLAP orienté Colonnes (Snowflake, Redshift) |
| :--- | :--- | :--- |
| **Stockage physique** | Lignes contiguës : `[id1, nom1, ca1], [id2, nom2, ca2]` | Colonnes contiguës : `[id1, id2, ...]`, `[ca1, ca2, ...]` |
| **Mécanisme d'accélération** | **Index B-Tree** pointant vers une ligne précise | **Zone Maps / Micro-partitions** (Min/Max par bloc de 16 Mo) |
| **Impact de `SELECT *`** | Faible (toute la ligne est déjà sur la même page) | **Catastrophique** (oblige à télécharger et décompresser toutes les colonnes sur S3) |
| **Opération idéale** | Lecture/écriture transactionnelle par `id` (< 10 ms) | Agrégation analytique sur 500 millions de lignes et 3 colonnes |

---

## 2. Micro-partitions et Clustering dans Snowflake / Redshift (Exercice `sql-093`)

Dans **Snowflake**, il n'existe **aucun index B-Tree**. Toutes les tables sont automatiquement découpées en **micro-partitions immuables** de 50 à 500 Mo non compressés (environ 16 Mo compressés) stockées en colonnes :
1. **Partition Pruning (Élagage) :** Les métadonnées de chaque micro-partition stockent le `MIN`, le `MAX`, le nombre de `NULL` et le nombre de valeurs distinctes de chaque colonne. Lorsqu'une requête filtre `WHERE event_date = '2026-10-31'`, Snowflake ignore 99 % des micro-partitions dès la compilation.
2. **Clustering Keys :** Sur des tables de plusieurs téraoctets (> 1 To) où les requêtes filtrent sur une colonne non corrélée à l'ordre d'ingestion, définir `CLUSTER BY (event_date, tenant_id)` réorganise les micro-partitions pour restaurer l'efficacité du pruning.

---

## 3. Lire un plan d'exécution (`EXPLAIN`) : Les 3 algorithmes de jointure et le tri mémoire

Lorsqu'un recruteur vous montre la sortie d'un `EXPLAIN` (ou le Query Profile Snowflake/Spark), cherchez immédiatement ces **3 opérateurs** :

1. **Nested Loop Join (`sql-085`) :** Pour chaque ligne de la table externe, parcourt la table interne. Rapide uniquement si la table externe est minuscule ou si la table interne possède un index sur la clé de jointure.
2. **Hash Join :** Construit une table de hachage en mémoire RAM sur la plus petite table (*Build*), puis sonde (*Probe*) avec la grande table. C'est l'algorithme roi en OLAP (Snowflake, Spark, DuckDB). **Danger :** Si la table de hachage dépasse la RAM du worker, elle déborde sur le disque (**Disk Spilling**), dégradant les performances d'un facteur $10\times$.
3. **Sort-Merge Join & Temp B-Tree (`sql-086`) :** Trie les deux entrées (ou alloue un arbre temporaire `USE TEMP B-TREE FOR GROUP BY / ORDER BY`) avant de les fusionner.

---

## 4. Sources officielles vérifiées
- Documentation officielle Snowflake, *Micro-partitions & Data Clustering* : https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions (consulté le 31 octobre 2026).
- Documentation officielle AWS Redshift, *Distribution Styles and Sort Keys* : https://docs.aws.amazon.com/redshift/latest/dg/c_choosing_dist_sort.html (consulté le 31 octobre 2026).
