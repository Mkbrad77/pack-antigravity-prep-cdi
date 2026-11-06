# Chapitre 2.14 : Patterns SQL d'Entretien : Dédoublonnage (QUALIFY / ROW_NUMBER), Top-N par Groupe & Gaps and Islands

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W06-I1` (Séance 1 de la Semaine 6 : 25 min)  
**Exercices pratiques de la séance :** `sql-067` (Dédoublonnage des clients par email), `sql-073` (Dédoublonnage avec règle de complétude / Survivorship), `sql-045` (Top 1 salaire par département)

---

## 1. Pattern 1 : Le Dédoublonnage Déterministe (`ROW_NUMBER` + Survivorship)

C'est la question qui tombe dans **plus de 80 % des entretiens Data Engineer** : *« Comment dédoublonner une table de staging contenant plusieurs fiches pour le même email client ? »*

### 1.1. Conserver la fiche la plus ancienne ou la plus récente (Exercice `sql-067`)
```sql
WITH ranked_customers AS (
    SELECT
        customer_id,
        email,
        first_name,
        last_name,
        signup_date,
        ROW_NUMBER() OVER (
            PARTITION BY LOWER(email)
            ORDER BY signup_date ASC, customer_id ASC
        ) AS rn
    FROM customers
    WHERE email IS NOT NULL
)
SELECT customer_id, email, first_name, last_name, signup_date
FROM ranked_customers
WHERE rn = 1
ORDER BY customer_id;
```
> **Note Snowflake / BigQuery / DuckDB :** Vous pouvez mentionner en entretien la clause **`QUALIFY ROW_NUMBER() OVER (...) = 1`**, qui évite d'écrire la CTE englobante tout en produisant exactement le même plan d'exécution.

### 1.2. Règle de *Survivorship* multicritère (Conserver la fiche la plus complète, Exercice `sql-073`)
Que faire si la fiche la plus ancienne a un `country IS NULL`, alors qu'un doublon plus récent possède le pays renseigné ? On place un **`CASE WHEN` directement dans l'`ORDER BY` de la fonction `ROW_NUMBER()`** :
```sql
ROW_NUMBER() OVER (
    PARTITION BY LOWER(email)
    ORDER BY
        CASE WHEN country IS NOT NULL THEN 1 ELSE 0 END DESC,
        signup_date ASC,
        customer_id ASC
) AS rn
```

---

## 2. Pattern 2 : Top-$N$ par Groupe (Exercice `sql-045`)

Pour obtenir le $1^{\text{er}}$ (ou les $3$ premiers) éléments de chaque catégorie :
- Utiliser `ROW_NUMBER()` si l'on veut **exactement 1 ligne** par groupe (même en cas d'égalité).
- Utiliser `DENSE_RANK()` si l'on veut tous les ex-aequo du podium.
- Ne **jamais** utiliser `WHERE salary = (SELECT MAX(salary) ...)` qui échoue dès qu'on demande le Top 3 et force des scans multiples.

---

## 3. Pattern 3 : *Gaps and Islands* (Regrouper des séquences contiguës)

Comment identifier des séries de jours consécutifs de connexion d'un utilisateur ?
- **Astuce mathématique de la différence d'indices :** Si l'on soustrait le numéro de ligne `ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date)` à la date `login_date`, toutes les dates **consécutives** produisent exactement **la même date de référence constante (`island_id`)** ! Il suffit ensuite de faire un `GROUP BY user_id, island_id` pour obtenir `MIN(login_date)`, `MAX(login_date)` et la longueur de la série `COUNT(*)`.

---

## 4. Sources officielles vérifiées
- Documentation officielle Snowflake, *QUALIFY clause* : https://docs.snowflake.com/en/sql-reference/constructs/qualify (consulté le 31 octobre 2026).
