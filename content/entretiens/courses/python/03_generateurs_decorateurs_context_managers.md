# Chapitres 1.7 à 1.12 : Itérateurs, Générateurs (yield), Décorateurs & Context Managers

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W01-I3` (Séance 3 de la Semaine 1 : 15 min, bonus)  
**Exercices pratiques de la séance :** `py-023` (Générateur de lecture par lots / Chunking), `py-035` (Décorateur de Retry avec Backoff), `py-029` (Context Manager de ressources)

---

## 1. Itérateurs et Générateurs (`yield`) : Traiter des flux infinis en $O(1)$ mémoire

### 1.1. Protocole d'itération (`__iter__` et `__next__`)
En Python, tout objet sur lequel on peut boucler (`for x in obj`) est un **Iterable** qui renvoie un **Iterator** via `iter(obj)`. L'itérateur produit les valeurs une par une via `next(it)` jusqu'à lever l'exception `StopIteration`.

### 1.2. Fonction génératrice avec `yield` (Exercice `py-023`)
Dès qu'une fonction contient le mot-clé `yield`, son appel ne l'exécute pas immédiatement : il renvoie un objet **generator**. À chaque appel de `next()`, l'exécution reprend exactement là où elle s'était suspendue en conservant son état local en mémoire.

```python
from typing import Iterator, Any

def chunk_stream(iterable: list[Any], batch_size: int) -> Iterator[list[Any]]:
    """Découpe un flux de données en lots de taille batch_size sans dupliquer tout le dataset."""
    batch = []
    for item in iterable:
        batch.append(item)
        if len(batch) == batch_size:
            yield batch
            batch = []
    if batch:
        yield batch
```
**Pourquoi c'est indispensable en Data Engineering :** Lorsqu'on ingère un fichier S3 de 20 Go vers Snowflake ou PostgreSQL, un générateur de chunks permet d'envoyer des lots de $10\,000$ lignes avec une empreinte RAM constante de quelques mégaoctets, évitant tout `MemoryError` (OOM).

---

## 2. Décorateurs (`@decorator`) et `functools.wraps` (Exercice `py-035`)

Un décorateur est une **fonction d'ordre supérieur** (prenant une fonction en argument et retournant une fonction enveloppée `wrapper`) qui permet d'injecter un comportement transversal : **Retry sur erreur réseau, chronométrage, cache, contrôle d'accès ou journalisation**.

### Structure d'un décorateur paramétré de production (ex: `@retry(max_attempts=3)`)
Lorsqu'un décorateur accepte des paramètres, on imbrique **3 niveaux de fonctions** :
1. La fabrique `retry(max_attempts)` qui reçoit les paramètres de configuration.
2. Le décorateur `decorator(func)` qui reçoit la fonction cible.
3. Le `wrapper(*args, **kwargs)` qui s'exécute à chaque appel.

```python
from functools import wraps
import time

def with_retry(max_attempts: int = 3):
    def decorator(func):
        @wraps(func)  # Préserve __name__, __doc__ et la signature de func !
        def wrapper(*args, **kwargs):
            last_error = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    last_error = exc
                    if attempt == max_attempts:
                        raise last_error
            raise last_error
        return wrapper
    return decorator
```
> **Question piège d'entretien :** *« Pourquoi doit-on toujours utiliser `@functools.wraps(func)` ? »*  
> Sans `@wraps(func)`, la fonction décorée perd son nom (`func.__name__` devient `'wrapper'`), sa docstring (`__doc__`) et ses annotations de types, ce qui casse l'introspection de frameworks comme **FastAPI**, **Pydantic** ou **pytest**.

---

## 3. Context Managers (`with`) : Gestion sûre des ressources (Exercice `py-029`)

En ingénierie des données, toute ressource externe (connexion base de données, transaction SQL, fichier ouvert, session HTTP, verrou distribué) doit être **systématiquement libérée**, même si une exception survient au milieu du traitement.

### Approche 1 : Par classe (`__enter__` et `__exit__`)
```python
class DatabaseTransaction:
    def __init__(self, conn):
        self.conn = conn

    def __enter__(self):
        self.conn.begin()
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None:
            self.conn.commit()
        else:
            self.conn.rollback()
        # Retourner False propage l'exception appelante après le rollback
        return False
```

### Approche 2 : Par générateur avec `@contextlib.contextmanager`
Plus concise et très appréciée en entretien :
```python
from contextlib import contextmanager
import time

@contextmanager
def timer_block(label: str):
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed_ms = (time.perf_counter() - start) * 1000
        print(f"[{label}] exécuté en {elapsed_ms:.2f} ms")
```

---

## 4. Sources officielles vérifiées
- Documentation officielle Python 3.12, *`functools` : Higher-order functions* : https://docs.python.org/3/library/functools.html (consulté le 31 octobre 2026).
- Documentation officielle Python 3.12, *`contextlib` : Utilities for with-statement contexts* : https://docs.python.org/3/library/contextlib.html (consulté le 31 octobre 2026).
