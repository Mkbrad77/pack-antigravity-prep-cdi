# Chapitres 2.4 à 2.5 : Fonctions de Fenêtrage (Window Functions) : ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD & Frames

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W02-I2` (Séance 2 de la Semaine 2 : 20 min)  
**Exercices pratiques de la séance :** `sql-040` (Classement DENSE_RANK par département), `sql-041` (Évolution salariale via LAG), `sql-044` (Moyenne mobile glissante avec ROWS BETWEEN)

---

## 1. Principe fondamental d'une Fonction de Fenêtrage

Contrairement à `GROUP BY` qui écrase les lignes détaillées en une seule ligne par groupe, une **Window Function** (`fonction() OVER (PARTITION BY ... ORDER BY ... ROWS BETWEEN ...)`) calcule un agrégat ou un rang **tout en conservant chaque ligne individuelle intacte**.

---

## 2. Les 3 familles de Window Functions à maîtriser absolument

### 2.1. Fonctions de classement : `ROW_NUMBER` vs `RANK` vs `DENSE_RANK` (Exercice `sql-040`)
Soit une partition de salaires décroissants : `[90000, 80000, 80000, 70000]`.

| Fonction | Résultat sur `[90k, 80k, 80k, 70k]` | Comportement sur les ex-aequo | Cas d'usage type |
| :--- | :--- | :--- | :--- |
| **`ROW_NUMBER()`** | `1, 2, 3, 4` | Attribue un numéro unique strict (arbitraire si pas de tie-breaker) | **Dédoublonnage déterministe (`rn = 1`)** |
| **`RANK()`** | `1, 2, 2, 4` | Même rang aux ex-aequo, **saute** le rang suivant (`3` est sauté) | Classement sportif / concours |
| **`DENSE_RANK()`** | `1, 2, 2, 3` | Même rang aux ex-aequo, **sans trou** dans la numérotation | **Top-$N$ niveaux de salaires ou prix distincts** |

### 2.2. Fonctions de décalage temporel : `LAG` et `LEAD` (Exercice `sql-041`)
Permettent d'accéder à la ligne précédente (`LAG`) ou suivante (`LEAD`) au sein de la même partition sans faire d'auto-jointure coûteuse :
- Syntaxe : `LAG(colonne, offset, default_value) OVER (PARTITION BY entity_id ORDER BY date_col ASC)`
- **Usages clés :** Calcul de variation période sur période ($\Delta = \text{salaire}_t - \text{salaire}_{t-1}$), calcul du temps passé entre deux clics d'une session, construction des bornes `[valid_from, valid_to]` d'une dimension SCD Type 2.

### 2.3. Cadres de fenêtre (`ROWS BETWEEN` vs `RANGE BETWEEN`) et Moyenne Mobile (Exercice `sql-044`)
Pour calculer un cumul mobile (*Running Total*) ou une moyenne glissante sur les $K$ dernières transactions :

```sql
SELECT
  account_id,
  tx_id,
  amount,
  ROUND(
    AVG(amount) OVER (
      PARTITION BY account_id
      ORDER BY tx_timestamp ASC, tx_id ASC
      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ),
    2
  ) AS moyenne_mobile_3tx
FROM transactions
WHERE amount > 0;
```
> **Piège d'entretien (`ROWS` vs `RANGE`) :**
> - Lorsqu'on écrit `SUM(amount) OVER (PARTITION BY account_id ORDER BY tx_date)` sans préciser le frame, le défaut SQL standard est **`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`**.
> - Si deux transactions ont exactement le même `tx_date`, `RANGE` les additionne ensemble d'un seul coup ! Pour un cumul strictement ligne par ligne ou une fenêtre glissante d'exactement $N$ événements, spécifiez toujours **`ROWS BETWEEN ...`** (et ajoutez la clé primaire `tx_id` dans l'`ORDER BY` pour le rendre déterministe).

---

## 3. Sources officielles vérifiées
- Documentation officielle PostgreSQL 17, *Window Functions* : https://www.postgresql.org/docs/current/tutorial-window.html (consulté le 31 octobre 2026).
- Documentation officielle Snowflake, *Window Frame Syntax and Usage* : https://docs.snowflake.com/en/sql-reference/functions-analytic (consulté le 31 octobre 2026).
