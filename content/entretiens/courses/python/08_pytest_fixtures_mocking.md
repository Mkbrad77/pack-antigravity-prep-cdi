# Chapitre 1.20 : Tests unitaires professionnels avec pytest : Fixtures, Parametrize & Mocking

**Module :** Module 1 : Python pour la Data et l'IA  
**Tâche associée :** `W08-I2` (Séance 2 de la Semaine 8 : 30 min)  
**Exercices pratiques de la séance :** `py-068` (Simulateur d'API avec Mock offline et quota 429), `py-055` (Moteur de règles Data Quality), `py-058` (Parseur défensif avec journalisation des rejets)

---

## 1. Pourquoi les tests automatisés sont systématiquement évalués en entretien

Dans les tests techniques à emporter (take-home assignments) comme en live coding, un candidat Data ou AI Engineer qui structure son code pour qu'il soit **testable hors ligne (sans dépendre d'AWS S3, de Snowflake ou d'OpenAI)** se démarque immédiatement.

---

## 2. Les 3 piliers de `pytest` à connaître par cœur

### 2.1. `@pytest.fixture` et gestion du cycle de vie (`scope` + `yield`)
Une fixture injecte proprement les dépendances de test (base SQLite en mémoire, dossier temporaire `tmp_path`, client HTTP mocké) et nettoie les ressources après le test grâce à `yield` :

```python
import pytest
import sqlite3

@pytest.fixture(scope="function")
def in_memory_db():
    # Setup : création de la base isolée
    conn = sqlite3.connect(":memory:")
    conn.execute("CREATE TABLE users (id INT, email TEXT)")
    yield conn
    # Teardown : fermeture garantie même si le test échoue
    conn.close()
```
- **Scopes disponibles :** `function` (par défaut, recréé à chaque test), `class`, `module`, `session` (partagé sur toute la suite de tests).

### 2.2. `@pytest.mark.parametrize` : Couvrir tous les cas limites sans dupliquer le code
Pour tester une fonction de nettoyage ou un parseur défensif (Exercice `py-058`) sur des entrées nominales, vides, `None` ou malformées :

```python
@pytest.mark.parametrize(
    "raw_input,expected",
    [
        ("  FRANCE ", "france"),
        ("", "inconnu"),
        (None, "inconnu"),
    ],
)
def test_normalize_country(raw_input, expected):
    assert normalize_country(raw_input) == expected
```

### 2.3. Isolation des dépendances externes par Injection & Mocking (Exercice `py-068`)
Un test unitaire ne doit **jamais** appeler une vraie API externe payante ou soumise à des quotas réseau :
- Utilisez `unittest.mock.MagicMock`, `monkeypatch` ou injectez un **Client Mock déterministe** (Pattern Dependency Injection) qui simule à la fois les réponses `200 OK`, les erreurs `404 Not Found` et le dépassement de quota `429 Too Many Requests`.

---

## 3. Tester la Qualité des Données (Data Quality) et les Parseurs Défensifs (Exercices `py-055` et `py-058`)

En Data Engineering, on distingue deux niveaux de tests :
1. **Tests unitaires de logique de transformation (`pytest`) :** Vérifient sur un mini-jeu de données synthétique que la fonction gère les `NULL`, les divisions par zéro et les lignes corrompues (Dead Letter Queue).
2. **Tests de qualité des données sur les tables (Data Contracts / dbt tests) :** Vérifient sur la donnée réelle les invariants (`not_null`, `unique`, `accepted_values`, bornes min/max).

---

## 4. Sources officielles vérifiées
- Documentation officielle pytest, *How to use fixtures & parametrize* : https://docs.pytest.org/en/stable/how-to/fixtures.html (consulté le 31 octobre 2026).
- Documentation officielle Python 3.12, *`unittest.mock` : Mock object library* : https://docs.python.org/3/library/unittest.mock.html (consulté le 31 octobre 2026).
