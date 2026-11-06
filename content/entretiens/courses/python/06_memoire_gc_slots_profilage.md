# Chapitre 1.17 : Gestion de la mémoire, Garbage Collector, `__slots__` & Profilage

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W07-I3` (Séance 3 de la Semaine 7 : 30 min, bonus)  
**Exercices pratiques de la séance :** `py-031` (Optimisation mémoire avec `__slots__`), `py-024` (Pipeline de générateurs chaînés), `py-036` (Cache LRU avec TTL)

---

## 1. Comment CPython gère la mémoire : Comptage de références + GC Générationnel

Contrairement à la JVM, CPython combine **deux mécanismes complémentaires** :

1. **Comptage de références (Reference Counting) :**
   - Chaque objet Python possède un compteur `ob_refcnt` (consultable via `sys.getrefcount(obj)`).
   - Dès que `ob_refcnt` tombe à $0$ (fin de portée d'une variable locale, `del`), la mémoire est **libérée immédiatement et de manière déterministe**.
2. **Ramasse-miettes générationnel (Generational Garbage Collector, module `gc`) :**
   - Le comptage de références seul ne peut pas libérer les **cycles de références** (ex: un nœud d'arbre `parent.child = node` et `node.parent = parent`, où le compteur reste à 1 même si plus aucune variable externe n'y pointe).
   - Le module `gc` classe les objets conteneurs en **3 générations (0, 1, 2)** selon leur survie aux cycles de collecte, et détecte périodiquement les îlots d'objets isolés.

---

## 2. Optimiser l'empreinte RAM d'un pipeline Python (3 techniques clés)

### Technique 1 : `__slots__` sur les classes instanciées des millions de fois (Exercice `py-031`)
Par défaut, chaque instance d'une classe Python stocke ses attributs dans un dictionnaire dynamique `self.__dict__`, qui consomme plus de **100 octets de surcharge par objet**.  
En déclarant `__slots__ = ('id', 'timestamp', 'value')`, CPython remplace `__dict__` par un descripteur de tableau statique compact (comme un `struct` C), **réduisant la consommation RAM de 40 % à 60 %** et accélérant l'accès aux attributs :

```python
class MetricPoint:
    __slots__ = ("sensor_id", "timestamp", "value")

    def __init__(self, sensor_id: str, timestamp: int, value: float):
        self.sensor_id = sensor_id
        self.timestamp = timestamp
        self.value = value
```

### Technique 2 : Pipelines de générateurs chaînés (Lazy Evaluation, Exercice `py-024`)
Au lieu de créer 3 listes intermédiaires de 5 millions d'éléments chacune (`raw_list -> filtered_list -> transformed_list`), chaînez des générateurs pour que chaque enregistrement traverse tout le pipeline **en un seul passage et en $O(1)$ mémoire** :

```python
def parse_lines(lines):
    for line in lines:
        if line.strip():
            yield line.strip().split(",")

def filter_valid(records):
    for rec in records:
        if len(rec) == 3 and float(rec[2]) > 0:
            yield (rec[0], float(rec[2]))
```

### Technique 3 : Éviter les fuites mémoire de cache infini (Exercice `py-036`)
- **Piège classique en production :** Décorer une méthode avec `@functools.cache` (ou `@lru_cache(maxsize=None)`) sur une fonction recevant des identifiants uniques de requêtes. Le dictionnaire de cache grossit indéfiniment jusqu'au crash **OOMKilled** du conteneur Docker/Kubernetes !
- **Bonne pratique :** Toujours borner `maxsize` (ex: `@lru_cache(maxsize=1024)`) et ajouter une expiration temporelle (**TTL : Time-To-Live**) pour les données susceptibles de changer.

---

## 3. Outils de profilage mémoire et CPU à citer en entretien
- **Mémoire :** `tracemalloc` (intégré à la bibliothèque standard pour comparer deux snapshots mémoire ligne par ligne) et **Memray** (profileur mémoire Bloomberg ultra-performant pour Python et extensions C).
- **CPU :** `cProfile` (déterministe) et **`py-spy`** (échantillonnage externe sans ralentissement, utilisable directement sur un processus de production).

---

## 4. Sources officielles vérifiées
- Documentation officielle Python 3.12, *Data model : `__slots__`* : https://docs.python.org/3/reference/datamodel.html#slots (consulté le 31 octobre 2026).
- Documentation officielle Python 3.12, *`tracemalloc` : Trace memory allocations* : https://docs.python.org/3/library/tracemalloc.html (consulté le 31 octobre 2026).
