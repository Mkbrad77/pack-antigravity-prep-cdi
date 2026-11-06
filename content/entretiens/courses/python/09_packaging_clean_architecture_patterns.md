# Chapitre 1.21 : Packaging moderne (pyproject.toml, uv, Poetry) & Architecture Clean Code

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W09-I1` (Séance 1 de la Semaine 9 : 30 min)  
**Exercices pratiques de la séance :** `py-032` (Pattern Factory pour connecteurs Data), `py-033` (Pattern Strategy pour partitionnement), `py-060` (Masquage des PII dans les logs structurés)

---

## 1. Packaging Python moderne : `pyproject.toml` (PEP 621) et fichiers de verrouillage

Fini les fichiers disparates (`setup.py`, `setup.cfg`, `requirements.txt` non verrouillé) : le standard officiel Python est le fichier unique **`pyproject.toml`** combiné à un gestionnaire à résolution déterministe (**`uv`** ou **Poetry**).

### Pourquoi un lockfile (`uv.lock` / `poetry.lock`) est critique en production Data/IA ?
`requirements.txt` avec `pandas>=2.0` n'épingle pas les **dépendances transitives** (les sous-dépendances de vos bibliothèques). Sans fichier de verrouillage contenant les hashes cryptographiques exacts de chaque roue (`.whl`), un déploiement Docker le vendredi peut installer une sous-version cassante différente de celle testée en staging.

```toml
[project]
name = "data-ingestion-pipeline"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "pydantic>=2.7,<3.0",
    "polars>=1.0",
    "httpx>=0.27",
]

[project.optional-dependencies]
dev = ["pytest>=8.0", "ruff>=0.6", "mypy>=1.10"]
```

---

## 2. Design Patterns essentiels pour structurer un projet Data & AI

En entretien, inutile de réciter les 23 patterns du Gang of Four. En revanche, **3 patterns architecturaux** reviennent dans tous les projets Data/IA de production :

### 2.1. Pattern Factory (Fabrique de connecteurs, Exercice `py-032`)
Permet d'instancier dynamiquement la bonne source ou destination (`S3Connector`, `SnowflakeConnector`, `PostgresConnector`) à partir d'une configuration YAML/JSON sans multiplier les `if/elif` dans tout le code métier :

```python
class ConnectorFactory:
    _registry: dict[str, type] = {}

    @classmethod
    def register(cls, name: str, connector_cls: type) -> None:
        cls._registry[name] = connector_cls

    @classmethod
    def create(cls, name: str, **config):
        if name not in cls._registry:
            raise ValueError(f"Connecteur inconnu : {name}")
        return cls._registry[name](**config)
```

### 2.2. Pattern Strategy (Politiques interchangeables, Exercice `py-033`)
Permet d'injecter dynamiquement un algorithme (ex: stratégie de chunking RAG, stratégie de partitionnement S3 par date ou par hash, politique de retry) dans un pipeline sans modifier la classe orchestratrice.

### 2.3. Journalisation structurée JSON & Masquage RGPD des PII (Exercice `py-060`)
En production sur AWS CloudWatch ou Datadog :
- On n'utilise **jamais `print()`**, mais des **logs structurés au format JSON** incluant `timestamp`, `level`, `service`, `trace_id`.
- Conformément au RGPD, les données personnelles (**PII** : emails, numéros de carte bancaire, téléphones, jetons API) doivent être **automatiquement masquées** (`a***@domaine.com`) par un filtre de journalisation avant toute écriture disque.

---

## 3. Sources officielles vérifiées
- Python Packaging Authority (PyPA), *Writing your `pyproject.toml`* : https://packaging.python.org/en/latest/guides/writing-pyproject-toml/ (consulté le 31 octobre 2026).
- Documentation officielle Python 3.12, *`logging` : Logging facility for Python* : https://docs.python.org/3/library/logging.html (consulté le 31 octobre 2026).
