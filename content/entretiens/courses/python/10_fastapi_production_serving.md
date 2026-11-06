# Chapitre 1.22 : Conception d'API RESTful de production avec FastAPI (Depends, Lifespan, Statuts)

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W09-I2` (Séance 2 de la Semaine 9 : 30 min)  
**Exercices pratiques de la séance :** `py-066` (Endpoint de prédiction avec validation 422), `py-067` (Middleware d'injection de X-Request-ID), `py-051` (Circuit Breaker contre les pannes d'API aval)

---

## 1. Pourquoi FastAPI est le standard du serving ML et AI Engineering

FastAPI repose sur **Starlette** (serveur ASGI asynchrone) et **Pydantic v2** (validation et sérialisation en Rust). Il génère automatiquement le schéma **OpenAPI (Swagger)** et gère nativement les routes asynchrones (appels LLM, bases vectorielles) et synchrones.

---

## 2. Les 4 questions incontournables sur FastAPI en entretien

### 2.1. `async def` vs `def` dans une route FastAPI (Piège classique !)
- Si votre route appelle des bibliothèques **asynchrones** (`await httpx_client.post(...)`, `await asyncpg_conn.fetch(...)`), déclarez la route avec **`async def`**. Elle s'exécute directement sur l'Event Loop principale.
- Si votre route exécute du code **bloquant ou CPU-bound** (inférence locale Scikit-Learn/XGBoost, client synchrone `boto3`), déclarez-la avec **`def` (sans `async`)** ou déléguez via `run_in_executor`.
  - *Pourquoi ?* Une route `async def` qui exécute un appel synchrone bloquant **gèle l'intégralité de l'Event Loop** et bloque toutes les autres requêtes concurrentes du worker Uvicorn !

### 2.2. Chargement de modèles ML/LLM au démarrage avec `lifespan`
Ne rechargez **jamais** les poids d'un modèle ML ou un client de connexion à chaque requête HTTP. Utilisez le gestionnaire de cycle de vie `lifespan` pour charger le modèle **une seule fois au démarrage** du worker :

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Exécuté une seule fois au démarrage du serveur
    ml_models["churn"] = load_heavy_model()
    yield
    # Nettoyage à l'arrêt du serveur
    ml_models.clear()

app = FastAPI(lifespan=lifespan)
```

### 2.3. Injection de dépendances avec `Depends(...)`
`Depends()` permet d'injecter une session de base de données, de vérifier un jeton JWT ou d'appliquer un Rate Limiter par route, tout en permettant de remplacer la dépendance en 1 ligne pendant les tests unitaires via `app.dependency_overrides[get_db] = get_mock_db`.

### 2.4. Codes HTTP, Middlewares de traçabilité et Circuit Breaker (Exercices `py-066`, `py-067`, `py-051`)
- **Codes HTTP précis :**
  - `200 OK` / `201 Created` : Succès synchrone.
  - `202 Accepted` : Tâche longue mise en file d'attente (pattern asynchrone Celery/SQS + polling).
  - `422 Unprocessable Entity` : Payload JSON syntaxiquement valide mais violant le contrat Pydantic (ex: liste `features` vide).
  - `429 Too Many Requests` : Quota d'appels dépassé.
  - `503 Service Unavailable` : Dépendance aval hors service (Circuit Breaker ouvert).
- **Middleware `X-Request-ID` (`py-067`) :** Injecte un identifiant unique de corrélation dans chaque requête et réponse pour tracer un appel de bout en bout à travers les microservices.
- **Pattern Circuit Breaker (`py-051`) :** Après $N$ échecs consécutifs d'un service externe (ex: API d'embeddings en panne), le disjoncteur passe à l'état `OPEN` et échoue immédiatement (`fast-fail`) pendant un délai de récupération, évitant d'engorger tous les workers.

---

## 3. Sources officielles vérifiées
- Documentation officielle FastAPI, *Concurrency and async / await & Lifespan Events* : https://fastapi.tiangolo.com/async/ (consulté le 31 octobre 2026).
