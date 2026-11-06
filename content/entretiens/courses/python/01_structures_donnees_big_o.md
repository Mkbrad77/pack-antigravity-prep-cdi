# Chapitres 1.1 à 1.3 : Structures de données natives (list, dict, set, tuple) & Complexité Big O

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W01-I1` (Séance 1 de la Semaine 1 : 25 min)  
**Exercices pratiques de la séance :** `py-001` (Two Sum en O(1)), `py-016` (Opérations ensemblistes sur Sets), `py-017` (Compréhension de liste et filtrage)

---

## 1. Tableau comparatif des complexités algorithmiques (Big O)

En entretien technique Data Engineer ou AI Engineer, la première question sur un bloc de code Python porte presque toujours sur sa **complexité temporelle et spatiale** lorsque le volume passe de $10^3$ à $10^7$ lignes.

| Opération | `list` (Tableau dynamique) | `dict` (Table de hachage) | `set` (Ensemble haché) | `tuple` (Séquence immuable) |
| :--- | :--- | :--- | :--- | :--- |
| **Accès par index / clé** | $O(1)$ (`l[i]`) | $O(1)$ amorti (`d[k]`) | Non applicable | $O(1)$ (`t[i]`) |
| **Recherche (`x in col`)** | **$O(n)$ (Piège fréquent !)** | **$O(1)$ amorti** | **$O(1)$ amorti** | $O(n)$ |
| **Insertion en fin** | $O(1)$ amorti (`append`) | $O(1)$ amorti | $O(1)$ amorti (`add`) | Immuable |
| **Insertion / Suppression en tête** | **$O(n)$ (`insert(0, x)`, `pop(0)`)** | $O(1)$ amorti (`pop(k)`) | $O(1)$ amorti (`remove`) | Immuable |
| **Empreinte mémoire** | Moyenne (sur-allocation ~12%) | Élevée (table éparse) | Élevée (table éparse) | **Faible (taille fixe)** |

---

## 2. Fonctionnement interne en CPython (Ce que le recruteur attend)

### 2.1. `list` : Tableau dynamique de pointeurs (`PyObject**`)
- Une liste Python ne stocke pas les valeurs de manière contiguë comme un tableau NumPy, mais un **tableau contigu de pointeurs** vers des objets `PyObject`.
- Lorsqu'on appelle `.append(x)` et que le tableau est plein, CPython réalloue un bloc légèrement plus grand (facteur d'environ $1.125\times$), ce qui garantit un coût **amorti en $O(1)$**.
- **Anti-pattern critique en entretien :** Utiliser `ma_liste.pop(0)` ou `ma_liste.insert(0, x)` dans une boucle pour simuler une file FIFO. Chaque appel décale tous les pointeurs en mémoire ($O(n)$), transformant une boucle en **$O(n^2)$**. Utilisez systématiquement `collections.deque` ($O(1)$ aux deux extrémités).

### 2.2. `dict` et `set` : Tables de hachage compactes (depuis Python 3.6+)
- Un `dict` calcule `hash(key)`, applique un masque binaire pour trouver un indice dans une table d'indices compacte, et résout les collisions par **adressage ouvert (open addressing)**.
- **Ordre d'insertion garanti :** Depuis Python 3.7, l'ordre d'insertion des clés dans un `dict` est garanti par la spécification du langage.
- **Condition de hachabilité :** Pour être clé d'un `dict` ou élément d'un `set`, un objet doit être **immuable** et implémenter `__hash__()` et `__eq__()`.
  - Un `tuple` composé uniquement d'éléments immuables (`(user_id, date_str)`) est hachable et constitue une excellente clé composite de partitionnement ou de dédoublonnage.
  - Une `list` ou un `dict` n'est pas hachable (`TypeError: unhashable type: 'list'`).

---

## 3. Les 3 patterns d'entretien à maîtriser pour la séance `W01-I1`

### Pattern 1 : Remplacer une double boucle $O(n^2)$ par une table de hachage $O(n)$ (Exercice `py-001`)
Lorsqu'on cherche une paire d'éléments vérifiant une relation (comme `a + b == target` ou une jointure entre deux flux), on mémorise les éléments déjà vus dans un `dict` `{valeur: index}` :

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}
    for idx, val in enumerate(nums):
        complement = target - val
        if complement in seen:  # Recherche en O(1) !
            return [seen[complement], idx]
        seen[val] = idx
    return []
```

### Pattern 2 : Réconciliation et dédoublonnage de flux avec `set` (Exercice `py-016`)
En Data Engineering, comparer des identifiants entre une table source et une table cible se fait en $O(n + m)$ avec les opérateurs ensemblistes :
- `set_a & set_b` : Intersection (identifiants présents dans les deux systèmes)
- `set_a | set_b` : Union (tous les identifiants uniques)
- `set_a - set_b` : Différence (identifiants présents dans A mais manquants dans B : détection d'orphelins)
- `set_a ^ set_b` : Différence symétrique (écarts dans un sens ou dans l'autre)

### Pattern 3 : Compréhensions de listes et aplatissement 2D (Exercice `py-017`)
Pour aplatir une liste de listes `matrix` tout en filtrant les valeurs :
```python
# Ordre des boucles : de la boucle externe vers la boucle interne
flat_even = [val for row in matrix for val in row if val % 2 == 0]
```
**Conseil mémoire :** Si le résultat aplati ne sert qu'à être itéré une seule fois (ex: `sum(...)` ou écriture disque), remplacez les crochets `[...]` par une expression génératrice `(...)` ou `itertools.chain.from_iterable(matrix)` pour maintenir une consommation RAM en $O(1)$.

---

## 4. Pièges classiques posés en entretien

1. **Arguments par défaut mutables :**
   ```python
   # MAUVAIS : la même liste est partagée entre tous les appels !
   def append_item(item, bucket=[]):
       bucket.append(item)
       return bucket

   # BON : utiliser None comme sentinelle
   def append_item(item, bucket: list | None = None) -> list:
       if bucket is None:
           bucket = []
       bucket.append(item)
       return bucket
   ```
2. **Copie superficielle (`shallow copy`) vs copie profonde (`deep copy`) :**
   `b = a[:]` ou `b = a.copy()` duplique uniquement la liste externe. Si `a` contient des dictionnaires ou des sous-listes, modifier `b[0]['status']` modifie aussi `a[0]['status']` ! Utilisez `copy.deepcopy(a)` pour isoler des structures imbriquées.

---

## 5. Sources officielles vérifiées
- Python Software Foundation, *TimeComplexity - Python Wiki* : https://wiki.python.org/moin/TimeComplexity (consulté le 31 octobre 2026).
- Documentation officielle Python 3.12, *Data Structures* : https://docs.python.org/3/tutorial/datastructures.html (consulté le 31 octobre 2026).
