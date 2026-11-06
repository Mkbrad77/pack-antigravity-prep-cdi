# Chapitre 2.23 : Transactions ACID, Niveaux d'Isolation (Read Committed, Serializable) & Verrouillage

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W06-I3` (Séance 3 de la Semaine 6 : 20 min)  
**Exercices pratiques de la séance :** `sql-069` (Détection de débits bancaires répétés), `sql-077` (Réconciliation comptable du solde initial), `sql-080` (Détection de virements suspects répétés)

---

## 1. Les 4 propriétés ACID et l'architecture MVCC (Multi-Version Concurrency Control)

1. **Atomicité (Atomicity) :** Tout ou rien (`COMMIT` ou `ROLLBACK`). Si un virement débite le compte A mais plante avant de créditer le compte B, le débit de A est annulé.
2. **Cohérence (Consistency) :** Toute transaction fait passer la base d'un état valide à un autre état valide respectant toutes les contraintes (`PRIMARY KEY`, `FOREIGN KEY`, `CHECK`).
3. **Isolation (Isolation) :** Les transactions concurrentes ne se corrompent pas mutuellement.
4. **Durabilité (Durability) :** Une fois acquittée, la transaction est persistée dans le **WAL (Write-Ahead Log)** sur disque, survivant à une coupure électrique.

> **Pourquoi les lectures ne bloquent pas les écritures dans PostgreSQL ou Snowflake ?**  
> Grâce au **MVCC (Multi-Version Concurrency Control)** : une mise à jour n'écrase pas la ligne sur place, elle crée une nouvelle version horodatée. Les lecteurs lisent une image cohérente (*Snapshot*) sans poser de verrou bloquant les écrivains.

---

## 2. Les 4 niveaux d'isolation SQL et les phénomènes de concurrence

| Niveau d'isolation | Dirty Read (Lecture non commitée) | Non-Repeatable Read (Ligne modifiée entre 2 lectures) | Phantom Read (Nouvelles lignes apparues) | Note pour Snowflake / PostgreSQL |
| :--- | :--- | :--- | :--- | :--- |
| **Read Uncommitted** | Possible | Possible | Possible | Non utilisé en pratique |
| **Read Committed** | **Impossible** | Possible | Possible | **Niveau par défaut de PostgreSQL et Snowflake** |
| **Repeatable Read** | **Impossible** | **Impossible** | Possible (Impossible sous PG via Snapshot Isolation) | Idéal pour exporter un rapport financier multi-tables cohérent |
| **Serializable** | **Impossible** | **Impossible** | **Impossible** | Isolation maximale (lève une erreur de sérialisation en cas de conflit d'écriture concurrent) |

---

## 3. Audit et Réconciliation Financière en SQL (Exercices `sql-069`, `sql-077`, `sql-080`)

Dans les systèmes bancaires et e-commerce, trois contrôles SQL sont exécutés quotidiennement :
1. **Détection des défauts d'idempotence (`sql-069`) :** Grouper par `(account_id, minute_horodatage, amount)` avec `HAVING COUNT(*) > 1` pour repérer les doubles débits causés par un retry de terminal de paiement sans clé d'idempotence (`Idempotency-Key`).
2. **Réconciliation comptable entre table d'état et table de flux (`sql-077`) :** Vérifier l'invariant $\text{Solde}_{\text{initial}} - \sum \text{Débits} = \text{Solde}_{\text{actuel}}$ à l'aide d'une CTE d'agrégation et d'un `LEFT JOIN` (avec `COALESCE(..., 0)` pour les comptes sans mouvement).
3. **Auto-jointure anti-blanchiment (`sql-080`) :** Détecter les virements fractionnés ou répétés au même montant via une jointure `t1.account_id = t2.account_id AND t1.amount = t2.amount AND t1.tx_id < t2.tx_id`.

---

## 4. Sources officielles vérifiées
- Documentation officielle PostgreSQL 17, *Transaction Isolation & MVCC* : https://www.postgresql.org/docs/current/transaction-iso.html (consulté le 31 octobre 2026).
- Documentation officielle Snowflake, *Transactions and Isolation Level* : https://docs.snowflake.com/en/sql-reference/transactions (consulté le 31 octobre 2026).
