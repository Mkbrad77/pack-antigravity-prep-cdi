# Chapitre 1.16 : Concurrence en Python : GIL, asyncio, threading & multiprocessing

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W07-I2` (Séance 2 de la Semaine 7 : 30 min)  
**Exercices pratiques de la séance :** `py-049` (Exécution concurrente par lots), `py-050` (Rate Limiter Token Bucket), `py-052` (Map-Reduce parallèle par partitions)

---

## 1. Le GIL (Global Interpreter Lock) et l'arbre de décision en entretien

Le **GIL** de CPython est un mutex global qui empêche plusieurs threads natifs d'exécuter du **bytecode Python** simultanément au sein d'un même processus (pour protéger le comptage de références mémoire `Py_INCREF`/`Py_DECREF`).

| Nature de la tâche | Exemples concrets en Data / IA | Outil recommandé | Pourquoi ? |
| :--- | :--- | :--- | :--- |
| **I/O-Bound à très haute concurrence** (100 à $10\,000$ appels réseau) | Appels API LLM (OpenAI, Bedrock), requêtes HTTP asynchrones, scraping | **`asyncio`** (`TaskGroup`, `Semaphore`, `httpx`) | Un seul thread, zéro coût de changement de contexte OS, contrôle fin du Rate Limiting |
| **I/O-Bound avec bibliothèques bloquantes** (5 à 50 connexions) | SDK `boto3` S3, drivers JDBC/ODBC historiques, lecture disque | **`concurrent.futures.ThreadPoolExecutor`** | Le GIL est **relâché pendant les appels système I/O réseau/disque** ! |
| **CPU-Bound pur Python** | Parsing complexe de texte/JSON, hachage, calculs numériques Python | **`concurrent.futures.ProcessPoolExecutor`** | Crée un processus par cœur CPU (chacun possède son propre GIL) |
| **CPU-Bound natif C/Rust** | NumPy, Polars, PyTorch, FAISS | **Vectorisation native** (sans `multiprocessing`) | Ces bibliothèques relâchent le GIL en interne (`Py_BEGIN_ALLOW_THREADS`) |

---

## 2. Contrôler la concurrence vers des API LLM ou Data : Semaphore & Token Bucket

### 2.1. Limiter le parallélisme avec `asyncio.Semaphore` (Exercice `py-049`)
Lancer $1\,000$ requêtes simultanées avec `asyncio.gather` sans limite déclenche immédiatement des erreurs **HTTP 429 (Too Many Requests)** ou épuise les sockets. On protège toujours l'appel par un sémaphore ou un découpage en lots :

```python
import asyncio

async def fetch_with_limit(urls: list[str], max_concurrent: int = 10):
    sem = asyncio.Semaphore(max_concurrent)

    async def safe_get(url: str):
        async with sem:
            # Maximum 10 coroutines entrent dans ce bloc en même temps
            return await call_external_api(url)

    return await asyncio.gather(*(safe_get(u) for u in urls))
```

### 2.2. Algorithme du Token Bucket pour le Rate Limiting (Exercice `py-050`)
En entretien System Design ou Python, l'algorithme **Token Bucket** est la référence pour lisser le débit d'appels vers une API externe (ex: 60 requêtes/minute avec capacité de burst) :
- Le seau contient au maximum `capacity` jetons.
- Il se remplit en continu à la vitesse `refill_rate` jetons par seconde : `tokens = min(capacity, tokens + elapsed * refill_rate)`.
- Chaque requête consomme 1 jeton si disponible, ou est rejetée / mise en attente sinon.

### 2.3. Parallélisation Map-Reduce par partitions (Exercice `py-052`)
Pour agréger un grand volume de données sur plusieurs workers CPU :
1. **Split / Partition :** Découper la liste d'entrée en $P$ sous-listes équilibrées.
2. **Map :** Appliquer la transformation et le pré-comptage local sur chaque partition indépendante.
3. **Reduce :** Fusionner les dictionnaires intermédiaires en un résultat consolidé.

---

## 3. Sources officielles vérifiées
- Documentation officielle Python 3.12, *`asyncio` : Asynchronous I/O* : https://docs.python.org/3/library/asyncio.html (consulté le 31 octobre 2026).
- Documentation officielle Python 3.12, *`concurrent.futures` : Launching parallel tasks* : https://docs.python.org/3/library/concurrent.futures.html (consulté le 31 octobre 2026).
