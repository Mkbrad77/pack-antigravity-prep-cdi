# Chapitre 1.19 : Manipulation de données tabulaires : Pandas vs Polars (Lazy API & Vectorisation)

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W08-I1` (Séance 1 de la Semaine 8 : 30 min)  
**Exercices pratiques de la séance :** `py-041` (Agrégation GroupBy multi-métriques), `py-044` (Hash Join en mémoire), `py-045` (Pivotage de table Long vers Wide)

---

## 1. Comparatif architectural : Pandas 2.x vs Polars

En entretien Data Engineer / AI Engineer, on vous demandera régulièrement quand utiliser **Pandas**, **Polars**, **DuckDB** ou **PySpark** sur un nœud unique avant de provisionner un cluster distribué.

| Critère | Pandas (1.x / 2.x) | Polars (Rust + Apache Arrow) |
| :--- | :--- | :--- |
| **Moteur d'exécution** | Mono-thread (NumPy / PyArrow) | **Multi-thread natif en Rust** (sans GIL) |
| **Modèle d'évaluation** | **Eager** (exécution immédiate ligne par ligne, copies mémoire fréquentes) | **Eager (`df`) ET Lazy (`lf = pl.scan_parquet(...)`)** avec optimiseur de requêtes |
| **Optimisations automatiques** | Aucune : l'ordre écrit par le développeur est exécuté tel quel | **Predicate Pushdown** (filtre au plus près du fichier) & **Projection Pushdown** (ne lit que les colonnes utiles) |
| **Consommation RAM** | $3\times$ à $5\times$ la taille du dataset en mémoire | Streaming out-of-core (`collect(streaming=True)`) permettant de traiter plus gros que la RAM |

---

## 2. Les 3 opérations tabulaires fondamentales sous le capot

Comprendre comment s'implémentent en Python pur un **GroupBy**, un **Hash Join** et un **Pivot** est l'exercice favori des recruteurs pour vérifier que vous comprenez ce que font réellement Pandas, Polars ou Spark :

### 2.1. Agrégation `GroupBy` multi-métriques en un seul passage (Exercice `py-041`)
Un moteur analytique parcourt la table en $O(n)$, regroupe les accumulateurs par clé de partitionnement, puis calcule les agrégats finaux (`count`, `sum`, `avg`, `min`, `max`).

### 2.2. Algorithme du `Hash Join` en $O(n + m)$ (Exercice `py-044`)
Comment joindre une table `orders` ($N$ lignes) et une table `customers` ($M$ lignes) sans faire une double boucle imbriquée en $O(N \times M)$ ?
1. **Phase Build ($O(M)$) :** Construire un dictionnaire de hachage (index en mémoire) sur la plus petite table (`customers`) indexé par la clé de jointure `customer_id`.
2. **Phase Probe ($O(N)$) :** Parcourir la grande table (`orders`) et rechercher chaque `customer_id` en $O(1)$ dans la table de hachage.

```python
def hash_inner_join(left: list[dict], right: list[dict], key: str) -> list[dict]:
    # 1. Build phase sur la table de droite : O(M)
    lookup: dict = {}
    for r_row in right:
        k = r_row.get(key)
        if k is not None:
            lookup.setdefault(k, []).append(r_row)

    # 2. Probe phase sur la table de gauche : O(N)
    joined = []
    for l_row in left:
        k = l_row.get(key)
        if k in lookup:
            for r_match in lookup[k]:
                joined.append({**l_row, **r_match})
    return joined
```

### 2.3. Pivotage `Long` vers `Wide` (Exercice `py-045`)
Transformer une table d'événements `(date, metric_name, value)` en une table large `(date, clicks, views, purchases)` consiste à indexer par clé primaire de ligne (`date`) et à affecter chaque `metric_name` comme clé de colonne avec une valeur par défaut `0`.

---

## 3. Règle d'or de performance en Pandas / Polars
- **Ne jamais utiliser `.iterrows()` ni `.apply(..., axis=1)` en Pandas** sur de grands volumes : cela réintroduit une boucle Python interprétée à chaque ligne ($100\times$ à $500\times$ plus lent).
- Privilégiez toujours les **opérations vectorisées** (`np.where`, expressions `pl.when(...).then(...).otherwise(...)`).

---

## 4. Sources officielles vérifiées
- Documentation officielle Polars, *Lazy API & Optimizations* : https://docs.pola.rs/user-guide/lazy/ (consulté le 31 octobre 2026).
- Documentation officielle Pandas 2.2, *Enhancing performance* : https://pandas.pydata.org/docs/user_guide/enhancingperf.html (consulté le 31 octobre 2026).
