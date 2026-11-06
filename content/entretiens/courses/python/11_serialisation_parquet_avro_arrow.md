# Chapitre 1.23 : Sérialisation binaire & formats orientés colonnes : JSON, Parquet, Avro & Arrow

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W10-I1` (Séance 1 de la Semaine 10 : 30 min)  
**Exercices pratiques de la séance :** `py-046` (Aplatissement récursif de JSON imbriqué), `py-042` (Extraction structurée de logs par Regex), `py-027` (Compression Run-Length Encoding RLE)

---

## 1. Comparatif des formats de données (Ligne vs Colonne, Texte vs Binaire)

| Format | Organisation | Schéma | Cas d'usage optimal |
| :--- | :--- | :--- | :--- |
| **JSON / NDJSON** | Ligne (Texte) | Implicite (répété à chaque ligne) | Échanges d'API REST, payloads de webhooks, logs applicatifs |
| **Apache Avro** | **Ligne (Binaire)** | Explicite (JSON embarqué ou Schema Registry) | **Streaming Kafka / Kinesis**, écriture rapide ligne à ligne, évolution de schéma |
| **Apache Parquet** | **Colonne (Binaire sur disque)** | Explicite (dans le footer du fichier) | **Data Lakehouse (S3, Iceberg, Snowflake)**, requêtes analytiques OLAP |
| **Apache Arrow** | **Colonne (En mémoire RAM)** | Explicite | Échange **Zero-Copy** en RAM entre Python (Polars/Pandas), Spark et C++/Rust |

---

## 2. Comment Parquet compresse et accélère les lectures (Exercice `py-027`)

Un fichier **Parquet** est découpé horizontalement en **Row Groups** (ex: 128 Mo) et verticalement en **Column Chunks** :
1. **Statistiques Min/Max dans le Footer :** Le moteur (Athena, Spark, Snowflake) lit d'abord le pied de page (footer). Si votre requête filtre `WHERE year = 2026` et qu'un Row Group indique `min=2022, max=2024`, tout le bloc est ignoré sans être téléchargé (**Predicate Pushdown / Row Group Skipping**).
2. **Encodage par Dictionnaire (Dictionary Encoding) et RLE (Run-Length Encoding) :**
   - Dans une colonne triée comme `country` contenant $10\,000$ fois `'FRANCE'` à la suite, le **Run-Length Encoding (RLE)** stocke simplement `('FRANCE', 10000)` au lieu de répéter la chaîne $10\,000$ fois !

---

## 3. Normaliser les données brutes (Bronze $\rightarrow$ Silver) en Python

### 3.1. Aplatissement récursif de JSON imbriqué (Nested JSON Flattening, Exercice `py-046`)
Les API REST et les webhooks renvoient des dictionnaires profondément imbriqués (`{"user": {"address": {"city": "Paris"}}}`). Pour les charger dans une table relationnelle ou Parquet, on aplatit récursivement les clés avec un séparateur `_` (`user_address_city: "Paris"`) :

```python
def flatten_json(nested: dict, parent_key: str = "", sep: str = "_") -> dict:
    flat = {}
    for k, v in nested.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else str(k)
        if isinstance(v, dict) and v:
            flat.update(flatten_json(v, new_key, sep=sep))
        else:
            flat[new_key] = v
    return flat
```

### 3.2. Parsing de logs non structurés par expressions régulières nommées (Exercice `py-042`)
Pour transformer des lignes de logs serveurs brutes en dictionnaires typés, utilisez `re.compile` (compilé une seule fois hors de la boucle !) avec des **groupes nommés** `(?P<ip>\d+\.\d+\.\d+\.\d+)` et `.groupdict()`.

---

## 4. Sources officielles vérifiées
- Documentation officielle Apache Parquet, *File Format & Encodings (RLE, Dictionary)* : https://parquet.apache.org/docs/file-format/ (consulté le 31 octobre 2026).
- Documentation officielle Apache Arrow Python (`pyarrow`), *Columnar In-Memory Analytics* : https://arrow.apache.org/docs/python/ (consulté le 31 octobre 2026).
