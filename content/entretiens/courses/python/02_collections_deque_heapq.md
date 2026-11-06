# Chapitres 1.4 à 1.6 : Collections avancées (Counter, defaultdict, deque, heapq) & Algorithmes

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W01-I2` (Séance 2 de la Semaine 1 : 20 min)  
**Exercices pratiques de la séance :** `py-011` (Top-K avec Counter et heapq), `py-012` (Groupement avec defaultdict), `py-013` (Fenêtre glissante avec deque)

---

## 1. Pourquoi `collections` et `heapq` font la différence en entretien

En live coding, réimplémenter manuellement un compteur de fréquences, une initialisation de clé ou un tri complet pour trouver les $K$ meilleurs éléments fait perdre de précieuses minutes et dégrade la complexité algorithmique. La maîtrise de `collections` et `heapq` montre immédiatement un profil **Data / AI Engineer expérimenté**.

| Structure | Module | Cas d'usage idéal en Data / IA | Complexité clé |
| :--- | :--- | :--- | :--- |
| **`Counter`** | `collections` | Comptage de tokens NLP, fréquences d'erreurs HTTP, détection d'anomalies | Construction $O(n)$ |
| **`defaultdict`** | `collections` | Groupement clé-valeurs (`GROUP BY` en mémoire), listes d'adjacence de graphes | Insertion $O(1)$ sans `KeyError` |
| **`deque`** | `collections` | File FIFO de streaming, fenêtre glissante de taille fixe $K$, parcours BFS | `append` / `popleft` en **$O(1)$** |
| **`heapq`** | `heapq` | Recherche des Top-$K$ éléments sur flux massif, fusion de $M$ fichiers triés | Top-$K$ en **$O(n \log k)$** |

---

## 2. Les 3 structures indispensables expliquées avec code

### 2.1. `collections.Counter` et `heapq` pour le problème du Top-$K$ (Exercice `py-011`)
Trier toute une liste de $N$ éléments uniques prend $O(N \log N)$ en temps et $O(N)$ en mémoire.  
Si vous cherchez uniquement les **$K$ éléments les plus fréquents** (avec $K \ll N$, par exemple le Top 10 sur 10 millions d'événements), un **tas binaire (Min-Heap)** de taille $K$ maintient les $K$ meilleurs candidats en **$O(N \log K)$** !

```python
from collections import Counter
import heapq

def top_k_elements(items: list[str], k: int) -> list[str]:
    counts = Counter(items)  # O(N)
    # heapq.nlargest maintient un tas de taille k en O(N log k)
    # En cas d'égalité de fréquence, on trie par ordre alphabétique
    return heapq.nlargest(k, counts.keys(), key=lambda x: (counts[x], x))
```
> **Astuce `heapq` pour gérer un ordre personnalisé :** `heapq` en Python est uniquement un **Min-Heap** (le plus petit élément est en `heap[0]`). Pour inverser un tri numérique dans un tuple de comparaison, utilisez l'opposé `-freq` : `(-freq, word)`.

### 2.2. `collections.defaultdict` pour regrouper sans branchement `if/else` (Exercice `py-012`)
Au lieu d'écrire `if key not in d: d[key] = []`, `defaultdict(list)` ou `defaultdict(set)` instancie automatiquement le conteneur lors du premier accès à une clé manquante :

```python
from collections import defaultdict

def group_logs_by_user(logs: list[dict]) -> dict[str, list[str]]:
    grouped: dict[str, list[str]] = defaultdict(list)
    for row in logs:
        grouped[row["user_id"]].append(row["action"])
    return dict(grouped)
```

### 2.3. `collections.deque` avec `maxlen` pour les fenêtres glissantes en streaming (Exercice `py-013`)
Une `deque` (Double-Ended Queue) est implémentée en C sous forme de liste doublement chaînée de blocs mémoire.
- `popleft()` et `append()` s'exécutent en **$O(1)$ strict** (contre $O(n)$ pour `list.pop(0)`).
- L'argument `maxlen=k` évince automatiquement l'élément le plus ancien dès qu'un nouvel élément est ajouté au-delà de la capacité $k$.

```python
from collections import deque

def moving_averages(stream: list[float], window_size: int) -> list[float]:
    window = deque(maxlen=window_size)
     running_sum = 0.0
    result = []
    for val in stream:
        if len(window) == window_size:
            running_sum -= window[0]  # L'élément qui va sortir
        window.append(val)
        running_sum += val
        if len(window) == window_size:
            result.append(round(running_sum / window_size, 4))
    return result
```

---

## 3. Bonus Entretien : Fusionner $M$ fichiers triés avec `heapq.merge`

Question classique en entretien Data Engineer : *« Comment fusionner 50 fichiers de logs triés par timestamp totalisant 100 Go sur une machine disposant de 2 Go de RAM ? »*
- **Réponse attendue :** Ouvrir les 50 fichiers sous forme d'itérateurs paresseux (générateurs) et utiliser `heapq.merge(*iterators, key=lambda row: row.timestamp)`.
- `heapq.merge` ne charge qu'une seule ligne par fichier en mémoire dans un Min-Heap de taille $M=50$ et produit le flux global trié en **$O(N \log M)$** avec une consommation RAM constante $O(M)$.

---

## 4. Sources officielles vérifiées
- Documentation officielle Python 3.12, *`collections` : Container datatypes* : https://docs.python.org/3/library/collections.html (consulté le 31 octobre 2026).
- Documentation officielle Python 3.12, *`heapq` : Heap queue algorithm* : https://docs.python.org/3/library/heapq.html (consulté le 31 octobre 2026).
