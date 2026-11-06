# Chapitre 2.12 : Données Semi-Structurées en SQL : JSON, VARIANT (Snowflake), LATERAL FLATTEN & UNNEST

**Module :** Module 2 : SQL Avancé  
**Tâche associée :** `W05-I3` (Séance 3 de la Semaine 5 : 30 min, bonus)  
**Exercices pratiques de la séance :** `sql-018` (Normalisation de taxonomie d'événements streaming), `sql-035` (Sessions à fort volume d'événements), `sql-047` (Détection de double-clics rapprochés via LAG)

---

## 1. Interroger et aplatir du JSON en Data Warehouse (Snowflake, BigQuery, PostgreSQL, SQLite)

Avec l'approche **ELT**, les payloads JSON issus d'API ou de Kafka/Kinesis sont chargés bruts en couche Bronze dans une colonne semi-structurée (`VARIANT` sous Snowflake, `JSONB` sous PostgreSQL), puis typés et aplatis en SQL dans la couche Silver (Staging dbt).

| Opération | Snowflake (`VARIANT`) | PostgreSQL (`JSONB`) | SQLite (`json_extract`) |
| :--- | :--- | :--- | :--- |
| **Extraire un champ scalaire** | `payload:user.id::INT` | `(payload->'user'->>'id')::INT` | `CAST(json_extract(payload, '$.user.id') AS INT)` |
| **Déplier un tableau JSON en lignes** | `LATERAL FLATTEN(input => payload:items)` | `CROSS JOIN LATERAL jsonb_array_elements(payload->'items')` | `json_each(payload, '$.items')` |

### Exemple Snowflake (très fréquent en entretien pour un profil certifié SnowPro Core) :
```sql
SELECT
    raw.event_id,
    raw.payload:user_id::STRING AS user_id,
    item.value:product_id::INT  AS product_id,
    item.value:qty::INT         AS quantity
FROM raw_events raw,
LATERAL FLATTEN(input => raw.payload:cart_items) item;
```
> **Piège d'entretien sur `LATERAL FLATTEN` :** Par défaut, si le tableau `cart_items` est vide `[]` ou `NULL`, la ligne parente disparaît (comportement `INNER JOIN`). Pour conserver l'événement parent même sans articles, passez l'argument **`OUTER => TRUE`** dans `FLATERAL FLATTEN(input => ..., OUTER => TRUE)`.

---

## 2. Nettoyage et Debouncing de flux d'événements Web / Mobile (Exercices `sql-018`, `sql-035`, `sql-047`)

Les flux d'événements analytiques (`events_stream`) présentent trois défis classiques en entretien :
1. **Taxonomie hétérogène (`sql-018`) :** Un même événement arrive sous les formes `'PAGE_VIEW'`, `'page_view'` ou `NULL`. On normalise systématiquement via `LOWER(COALESCE(event_type, 'inconnu'))`.
2. **Filtrage des sessions actives ou bots (`sql-035`) :** Pré-agréger le volume d'événements par `session_id` dans une CTE avant d'enrichir avec les dimensions d'appareils (`user_sessions`).
3. **Debouncing des double-clics (`sql-047`) :** Lorsqu'un utilisateur clique deux fois de suite sur le même bouton dans la même session, `LAG(event_type)` et `LAG(page_url)` permettent d'identifier et de filtrer les clics consécutifs redondants.

---

## 3. Sources officielles vérifiées
- Documentation officielle Snowflake, *Querying Semi-Structured Data & FLATTEN* : https://docs.snowflake.com/en/user-guide/querying-semistructured (consulté le 31 octobre 2026).
- Documentation officielle SQLite, *JSON Functions and Operators* : https://www.sqlite.org/json1.html (consulté le 31 octobre 2026).
