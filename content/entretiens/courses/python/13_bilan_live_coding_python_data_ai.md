# Chapitres 1.24 à 1.27 : Bilan Live Coding Python Data & AI : 5 patterns incontournables en 45 minutes

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâches associées :** `W10-I3` (Semaine 10 : 30 min, bonus) et `W21-I1` (Semaine 21 : 45 min, révision finale)  
**Exercices pratiques de la séance :** `py-003` (Recherche binaire avec rotation), `py-010` (Cache LRU en O(1)), `py-065` (Recherche vectorielle KNN Top-K), `py-069` (Chunking RAG avec overlap), `py-048` (Similarité Cosinus d'embeddings)

---

## 1. Méthodologie en 4 étapes pour réussir une épreuve de Live Coding en 45 minutes

En entretien technique, le recruteur n'évalue pas uniquement si le test passe : il évalue votre **démarche d'ingénieur**.

1. **Clarifier le contrat et les cas limites (Minutes 0 à 5) :**
   - Demander la volumétrie (tient en RAM ou flux streaming ?), le comportement attendu sur une entrée vide `[]`, les valeurs `None`, les doublons ou les dimensions nulles.
2. **Annoncer la complexité avant de coder (Minutes 5 à 8) :**
   - Énoncer en 2 phrases l'approche naïve (ex: $O(n^2)$) puis l'approche optimale retenue (ex: $O(n)$ avec dictionnaire ou $O(n \log k)$ avec `heapq`).
3. **Écrire un code modulaire, typé et idiomatique (Minutes 8 à 35) :**
   - Utiliser les Type Hints (`def chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:`), nommer clairement les variables et découper les sous-fonctions.
4. **Dérouler un test à la main (Dry Run) et les cas aux bornes (Minutes 35 à 45) :**
   - Vérifier la division par zéro (ex: vecteur nul dans la similarité cosinus), l'overflow numérique (ex: soustraction de `max(logits)` dans Softmax) et la complexité mémoire.

---

## 2. Les 5 classiques absolus Data & AI Engineer de cette séance

### 1. Cache LRU en $O(1)$ strict (`py-010`)
Combinaison d'une table de hachage et d'une liste doublement chaînée (ou `collections.OrderedDict` en Python grâce à `move_to_end(key)` et `popitem(last=False)`) permettant à `get(key)` et `put(key, val)` de s'exécuter en **$O(1)$**.

### 2. Recherche binaire en $O(\log n)$ sur tableau trié pivoté (`py-003`)
À chaque étape de dichotomie `[left, right]`, au moins l'une des deux moitiés `[left..mid]` ou `[mid..right]` est strictement triée. On vérifie si `target` se trouve dans la moitié triée pour diviser l'espace de recherche par 2 à chaque itération.

### 3. Similarité Cosinus avec protection contre le vecteur nul (`py-048`)
Base de toute recherche sémantique d'embeddings :
$$\text{cosine\_similarity}(\mathbf{u}, \mathbf{v}) = \frac{\sum_{i=1}^d u_i v_i}{\sqrt{\sum_{i=1}^d u_i^2} \cdot \sqrt{\sum_{i=1}^d v_i^2}}$$
- **Point de vigilance :** Si la norme de $\mathbf{u}$ ou $\mathbf{v}$ vaut $0.0$, retourner `0.0` (ou lever une erreur explicite) sans déclencher de `ZeroDivisionError`.

### 4. Recherche des $K$ plus proches voisins (KNN Vector Search, `py-065`)
Calculer la distance euclidienne (ou la similarité cosinus) entre le vecteur de requête `query` et chaque document du corpus, puis extraire le Top-$K$ en **$O(N \log K)$** avec `heapq.nsmallest(k, ...)` (sans trier tout le corpus).

### 5. Découpage de texte en Chunks avec chevauchement (RAG Chunking, `py-069`)
En RAG, découper un document par pas de `step = max(1, chunk_size - overlap)` garantit que les phrases situées à la frontière entre deux chunks conservent leur contexte sémantique lors de la vectorisation.

---

## 3. Sources officielles vérifiées
- Documentation officielle Python 3.12, *`collections.OrderedDict`* : https://docs.python.org/3/library/collections.html#collections.OrderedDict (consulté le 31 octobre 2026).
