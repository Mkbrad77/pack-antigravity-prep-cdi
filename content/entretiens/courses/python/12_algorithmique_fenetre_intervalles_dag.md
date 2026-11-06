# Chapitre 1.25 : Algorithmique d'entretien : Deux pointeurs, Fenêtre glissante, Recherche binaire & Graphes

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W10-I2` (Séance 2 de la Semaine 10 : 30 min)  
**Exercices pratiques de la séance :** `py-002` (Sous-chaîne sans répétition : Fenêtre glissante), `py-004` (Fusion d'intervalles chevauchants), `py-008` (Tri topologique d'un DAG de tâches)

---

## 1. Les 4 patterns algorithmiques qui tombent en entretien Data & AI Engineer

Contrairement aux entretiens Software Généralistes qui posent parfois de la programmation dynamique ésotérique, les entretiens **Data Engineer et AI Engineer** ciblent **4 familles d'algorithmes directement liées aux moteurs de données et aux orchestrateurs** :

| Pattern algorithmique | Complexité cible | Cas concret en ingénierie Data & IA | Exercice de référence |
| :--- | :--- | :--- | :--- |
| **1. Fenêtre glissante dynamique (Sliding Window)** | Temps $O(n)$, Espace $O(k)$ | Calcul de sessions actives, détection de rafales d'événements, tokenisation | `py-002` |
| **2. Tri + Balayage d'intervalles (Merge Intervals)** | Temps $O(n \log n)$, Espace $O(n)$ | Compaction de plages temporelles SCD2, fusion de fenêtres de maintenance | `py-004` |
| **3. Recherche dichotomique (Binary Search / `bisect`)** | Temps $O(\log n)$, Espace $O(1)$ | Recherche dans un index trié, partition pruning, seuils de décision ML | `py-003` |
| **4. Graphes orientés acycliques (DAG / Tri topologique)** | Temps $O(V + E)$, Espace $O(V)$ | Résolution de l'ordre d'exécution d'un **DAG Airflow** ou du **lignage dbt** | `py-008` |

---

## 2. Explication détaillée des 3 patterns de la séance `W10-I2`

### Pattern 1 : Fenêtre glissante à deux pointeurs `[left, right]` (Exercice `py-002`)
Au lieu de tester toutes les sous-chaînes possibles en $O(n^2)$, le pointeur `right` étend la fenêtre d'un caractère à chaque étape, et le pointeur `left` avance uniquement lorsqu'une contrainte d'unicité est violée :

```python
def length_of_longest_substring(s: str) -> int:
    last_seen: dict[str, int] = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len
```

### Pattern 2 : Fusion d'intervalles chevauchants (Merge Intervals, Exercice `py-004`)
Très fréquent pour consolider des historiques de connexions ou des plages de validité :
1. **Trier les intervalles par borne de début croissante** (`intervals.sort(key=lambda x: x[0])`) en $O(n \log n)$.
2. Parcourir la liste triée : si `current[0] <= merged[-1][1]` (chevauchement), étendre la fin `merged[-1][1] = max(merged[-1][1], current[1])` ; sinon, ajouter `current` comme nouvel intervalle disjoint.

### Pattern 3 : Tri topologique de Kahn et détection de cycle dans un DAG (Exercice `py-008`)
Comment Airflow ou dbt détermine-t-il dans quel ordre exécuter des modèles dépendants et détecte-t-il une dépendance circulaire (`A -> B -> A`) ?
1. Calculer le **degré entrant (`in_degree`)** de chaque nœud (nombre de prérequis).
2. Placer tous les nœuds ayant `in_degree == 0` dans une file `deque`.
3. Défiler un nœud `u`, l'ajouter à l'ordre d'exécution, et décrémenter `in_degree[v]` pour chaque voisin aval `v`. Si `in_degree[v]` tombe à $0$, l'enfiler.
4. À la fin, si le nombre de nœuds visités est inférieur au nombre total de nœuds, **le graphe contient un cycle** (`ValueError`) !

---

## 3. Sources officielles vérifiées
- Documentation officielle Python 3.12, *`bisect` : Array bisection algorithm* : https://docs.python.org/3/library/bisect.html (consulté le 31 octobre 2026).
- Documentation officielle Python 3.12, *`graphlib` : Functionality to operate with graph-like structures* : https://docs.python.org/3/library/graphlib.html (consulté le 31 octobre 2026).
