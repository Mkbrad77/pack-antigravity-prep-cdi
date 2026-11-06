# Fiche Mémo 6.2 : Principes de CI/CD pour la Data

## 1. Le pipeline CI/CD moderne d'une équipe Data
- **Étape 1 : Linting & Qualité statique du code (Pré-commit / PR) :**
  - Python : `ruff` ou `flake8` + `black` + vérification de typage `mypy`.
  - SQL : `sqlfluff` (respect des conventions de style d'équipe).
- **Étape 2 : Tests unitaires logiques :**
  - Exécution des tests PyTest sur la logique métier pure en isolation (fonctions Python de nettoyage).
- **Étape 3 : Slim CI (Spécifique à dbt) :**
  - Ne tester dans le schéma temporaire de PR que les modèles modifiés et leurs dépendances aval directes via `dbt build --select state:modified+` en comparant avec le manifest de production (`manifest.json`), évitant de recalculer tout l'entrepôt.
- **Étape 4 : Déploiement automatisé :**
  - Merge sur main déclenchant le déploiement sur l'orchestrateur (Airflow / Astronomer / dbt Cloud).
