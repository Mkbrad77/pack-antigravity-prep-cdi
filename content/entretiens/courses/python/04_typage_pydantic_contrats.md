# Chapitre 1.15 : Typage statique (Type Hints, Protocol) & Validation Pydantic v2

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W07-I1` (Séance 1 de la Semaine 7 : 30 min)  
**Exercices pratiques de la séance :** `py-057` (Validation de payload style Pydantic), `py-056` (Exceptions métier personnalisées), `py-070` (Détection de dérive de schéma / Schema Drift)

---

## 1. Pourquoi les contrats de données (Data Contracts) reposent sur le typage et Pydantic

Dans une stack moderne Data & AI (FastAPI, LangChain/LlamaIndex, sorties structurées de LLM, connecteurs d'ingestion), deux outils complémentaires coexistent :
1. **Type Hints (`typing`, `mypy`, `pyright`) :** Vérification **statique** avant l'exécution (CI/CD). N'impose aucune validation au runtime.
2. **Pydantic v2 (`BaseModel`, `Field`, `@field_validator`) :** Validation et coercition **dynamique au runtime** avec cœur écrit en Rust (`pydantic-core`), garantissant qu'aucune donnée corrompue ne pénètre dans le pipeline.

---

## 2. Typage statique moderne en Python 3.10+

| Concept | Syntaxe moderne (Python 3.10+) | Usage en Data / AI Engineering |
| :--- | :--- | :--- |
| **Union de types** | `int \| float \| None` | Remplace `Optional[Union[int, float]]` |
| **Collections génériques** | `list[dict[str, Any]]` | Plus besoin d'importer `List`, `Dict` depuis `typing` |
| **Dictionnaire typé** | `class Event(TypedDict): ...` | Typer un payload JSON sans coût d'instanciation d'objet |
| **Sous-typage structurel** | `class Sink(Protocol): ...` | Duck typing vérifié statiquement (interfaces de connecteurs) |
| **Génériques (`TypeVar`)** | `T = TypeVar('T')` | Typer des fonctions de transformation ou de pagination génériques |

### Exemple de `Protocol` (Duck Typing statique pour pipelines)
Plutôt que d'imposer un héritage rigide `ABC`, `typing.Protocol` vérifie simplement qu'un objet possède les bonnes méthodes :
```python
from typing import Protocol

class VectorStore(Protocol):
    def upsert(self, doc_id: str, vector: list[float]) -> None: ...
    def search(self, query: list[float], k: int) -> list[str]: ...
```

---

## 3. Validation au runtime avec Pydantic v2 & Gestion du Schema Drift

### 3.1. Modèle Pydantic v2 avec validation métier (Exercice `py-057`)
En ingestion d'événements ou en **Structured Outputs LLM**, un schéma valide les types, les bornes numériques et les invariants croisés entre champs :

```python
from pydantic import BaseModel, Field, field_validator, model_validator

class TransactionPayload(BaseModel):
    tx_id: str = Field(..., min_length=3)
    amount: float = Field(..., gt=0)
    currency: str = Field(default="EUR", pattern="^[A-Z]{3}$")

    @field_validator("currency")
    @classmethod
    def check_supported_currency(cls, v: str) -> str:
        if v not in {"EUR", "USD", "GBP"}:
            raise ValueError(f"Devise non supportée : {v}")
        return v
```

### 3.2. Détection de dérive de schéma (Schema Drift) et Dead Letter Queue (Exercices `py-056` et `py-070`)
Lorsqu'une API partenaire modifie un champ sans prévenir (renommage de colonne, chaîne `"N/A"` envoyée dans un champ numérique `price`), un pipeline robuste ne doit pas crasher silencieusement :
1. Il compare le lot entrant au **schéma attendu** (`missing`, `extra`, `type_mismatch`).
2. Il route les enregistrements invalides vers une **Dead Letter Queue (DLQ)** (table d'erreurs S3/Snowflake) accompagnés d'une exception typée (`DataValidationError`).

---

## 4. Sources officielles vérifiées
- Documentation officielle Python 3.12, *`typing` : Support for type hints* : https://docs.python.org/3/library/typing.html (consulté le 31 octobre 2026).
- Documentation officielle Pydantic v2, *Models and Validators* : https://docs.pydantic.dev/latest/concepts/models/ (consulté le 31 octobre 2026).
