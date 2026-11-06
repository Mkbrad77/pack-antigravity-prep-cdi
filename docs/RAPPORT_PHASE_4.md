# Rapport de Clôture : Phase 4 (Préparation aux Entretiens Techniques & Hub CDI)

**Date :** 31 octobre 2026  
**Auteur :** Antigravity (Équipe d'ingénierie logicielle et pédagogique)  
**Candidat :** Auren Moyo (Ingénieur EPITA, alternant Data & IA, fin de contrat le 2 avril 2027)  
**Objectif :** Décrocher un CDI (Priorité 1 : Data Engineer, Priorité 2 : AI Engineer, suivi de Machine Learning Engineer et Data Scientist)  
**Périmètre livré :** Lot A (Éditeur SQL & Datasets), Lot B (Sandbox Python & 70 Exercices), Lot C (29 Cours Condensés), Lot D (Banque de 309 Questions & Simulateur Complet), Lot E (Matrice de Compétences, Projets STAR, Hub Unifié 8. Entretiens techniques)

---

## 1. Résumé Exécutif

La Phase 4 parachève la plateforme de préparation intensive au CDI d'Auren en déployant un environnement complet d'entraînement aux entretiens techniques. Tous les lots prévus ont été intégralement conçus, testés et interconnectés avec l'application existante.

### Métriques Clés du Périmètre Livré
- **Lot A (SQL) :** 105 exercices interactifs avec exécution réelle, 4 datasets métiers réalistes avec anomalies et valeurs manquantes (`ecommerce`, `streaming_events`, `hr_payroll`, `banking_fraud`), validation multiset insensible à l'ordre des colonnes et des lignes (sauf si ORDER BY explicite requis), visualisation `EXPLAIN QUERY PLAN` et chronomètre intégré.
- **Lot B (Python) :** 70 exercices de programmation rigoureusement calibrés (11 catégories : algorithmique, manipulation de collections, parsing JSON/logs, décorateurs, générateurs, programmation orientée objet, concurrence asyncio/threading, requêtes API, manipulation Pandas, transformations Spark PySpark, pipelines RAG/embeddings), sandbox d'exécution isolée avec timeout de 4 secondes et validation unitaire par assertions (`check_assert`).
- **Lot C (Cours Condensés) :** 29 synthèses de haut niveau rédigées en Markdown dans `content/entretiens/courses/` (10 Data Engineering, 9 AI Engineering & LLM, 5 Fiches Machine Learning, 5 Fiches Génie Logiciel), indexées dynamiquement via `manifest.json` avec navigation par tags, recherche textuelle et estimation des temps de lecture.
- **Lot D (Questions & Simulateur) :** Banque de 309 questions d'entretien réparties selon les 4 cibles d'Auren (130 Data Engineer, 98 AI Engineer, 45 Machine Learning Engineer, 36 Data Scientist), chacune dotée d'options distinctes, d'explications détaillées et de réfutations systématiques pour chaque option fausse. Simulateur d'entretien technique complet en 5 étapes (configuration, pitch STAR chronométré, épreuve technique, cas pratique d'architecture, débriefing chiffré) avec injection en un clic dans le système de répétition espacée (SRS).
- **Lot E (Matrice, Projets & Hub) :** Matrice de 20 compétences clés avec jauge d'ancrage basée sur la règle stricte des 3 réussites sur au moins 2 sessions espacées, espace de rédaction de 3 fiches de projets STAR initialisées strictement vierges (aucune donnée fictive inventée à la place d'Auren), et intégration du 8e onglet principal `8. Entretiens techniques` dans la barre de navigation.
- **Contrôle Qualité :** 9 suites de tests unitaires Vitest (44 tests au total) validées à 100 % au vert en 8 secondes, compilation TypeScript `tsc --noEmit` à 0 erreur, et conformité typographique absolue (zéro tiret cadratin `\u2014` et zéro demi-cadratin `\u2013` sur l'intégralité du code et du contenu).

---

## 2. Détail Technique des 5 Lots Livrés

### Lot A : Éditeur SQL et Datasets Métiers
- **Datasets persistants en mémoire :** 4 bases relationnelles complètes initialisées dans `src/domain/sqlDatasets.ts` simulant des cas d'usage réels :
  1. `ecommerce` (clients, commandes, articles, paiements, retours) avec anomalies de doublons et statuts incohérents.
  2. `streaming_events` (sessions web, événements d'ingestion, clics) avec des horodatages désordonnés.
  3. `hr_payroll` (employés, départements, salaires historiques, primes) pour les calculs de fenêtrage et hiérarchies récursives.
  4. `banking_fraud` (comptes, transactions financières, alertes de risque) pour les jointures complexes et détections de seuils.
- **Moteur d'exécution et comparaison :** `src/server/sqlSandbox.ts` et `src/domain/sqlComparison.ts` fournissent un bac à sable SQLite sécurisé. Le comparateur compare les résultats attendus et réels selon une égalité multiset (indépendante de l'ordre d'affichage sauf consigne expresse), gère les types numériques avec tolérance décimale et renvoie le plan d'exécution `EXPLAIN QUERY PLAN` pour sensibiliser à l'optimisation des requêtes.
- **Protection pédagogique :** Les solutions des 105 exercices sont masquées dans l'API et ne sont consultables dans `src/components/SqlEditorView.tsx` qu'après au moins une soumission réelle du candidat.

### Lot B : Sandbox Python et 70 Exercices Pratiques
- **Exécution sous-processus sécurisée :** `src/server/pythonSandbox.ts` instancie un processus `python` isolé avec un plafond strict de 4 000 ms (protection anti-boucle infinie) et capture `stdout` et `stderr`.
- **Validation unitaire par assertions :** Chaque exercice intègre une fonction d'injection `check_assert(condition, message)` validant automatiquement les cas limites (listes vides, types inattendus, volumétrie).
- **Interface candidat (`src/components/PythonEditorView.tsx`) :**
  - Sélection par niveau (Débutant, Intermédiaire, Avancé) et par thématique (11 catégories).
  - Chronomètre de résolution avec alerte visuelle au-delà du temps recommandé.
  - Déblocage d'indices progressifs (3 indices par exercice) pour guider sans donner la solution.
  - Verrouillage de la solution jusqu'à la première tentative exécutée.

### Lot C : 29 Synthèses Techniques Condensées
- **Organisation du corpus (`content/entretiens/courses/`) :**
  - **10 fiches Data Engineering (`de/`) :** Modélisation dimensionnelle Kimball, SQL fenêtré et analytique, Architecture Lakehouse & formats ouverts (Iceberg, Delta Lake), dbt fondamentaux et patterns avancés, Ingestion en streaming (Kafka, Kinesis), Optimisation Spark & partitionnement, Orchestration moderne (Airflow, Dagster), Data Quality & Great Expectations, FinOps Cloud Data Warehouse (Snowflake, BigQuery), Data Governance & lineage.
  - **9 fiches AI Engineering & LLM (`aie/`) :** Architectures Transformer et mécanismes d'attention, Vector Databases et indexation (HNSW, IVF, pgvector), RAG avancé (Hybrid Search, Re-ranking, Self-RAG), Embeddings et représentations textuelles, Fine-tuning de LLM (LoRA, QLoRA, PEFT), Déploiement et inférence (vLLM, TGI, quantification AWQ/GPTQ), Évaluation de pipelines RAG (Ragas, TruLens), Agents autonomes et Function Calling, Sécurité LLM (Prompt Injection, Guardrails).
  - **5 fiches Machine Learning fondamentales (`fiches_ml/`) :** Algorithmes supervisés classiques, Algorithmes non-supervisés et clustering, Métriques d'évaluation et compromis biais-variance, Feature Engineering et réduction de dimension, Dérive de données et de concept (Data Drift, Concept Drift).
  - **5 fiches Génie Logiciel pour Data/IA (`fiches_software/`) :** Complexité algorithmique et notations Big O, Clean Code et principes SOLID en Python, Tests unitaires et d'intégration (pytest, mock), Conteneurisation Docker pour la data et l'IA, CI/CD et observabilité des pipelines.
- **Rendu dans l'application :** `src/components/InterviewCoursesView.tsx` intègre un lecteur Markdown avec coloration syntaxique des blocs de code, recherche instantanée par mot-clé et navigation hiérarchique par catégorie.

### Lot D : Banque de 309 Questions & Simulateur Technique
- **Corpus de questions (`content/entretiens/interview_questions.json`) :**
  - 309 questions réparties sur les rôles cibles d'Auren : 130 Data Engineer, 98 AI Engineer, 45 Machine Learning Engineer, 36 Data Scientist.
  - Niveaux d'exigence : Junior, Intermédiaire, Senior.
  - Structure rigoureuse : énoncé précis, 4 options identifiées (A, B, C, D), réponse exacte, explication conceptuelle et réfutation explicite de chaque mauvaise réponse, URL de référence et date de vérification.
- **Simulateur d'entretien (`src/components/InterviewSimulatorView.tsx`) :**
  - **Étape 1 (Configuration) :** Sélection du rôle cible, du niveau de séniorité attendu et du format (Express 15 min ou Complet 45 min).
  - **Étape 2 (Pitch STAR) :** Entraînement au pitch d'introduction ("Parlez-moi de vous") calibré pour le profil d'Auren (Ingénieur EPITA en alternance), avec chronomètre dédié et grille d'auto-évaluation en 5 critères.
  - **Étape 3 (Questions Fondamentales) :** Tirage aléatoire de QCMs techniques dans la banque de questions, affichage interactif des réponses, révélations des explications et réfutations.
  - **Étape 4 (Étude de Cas d'Architecture) :** Problématique de conception de système (ex. Pipeline Lakehouse événementiel ou Pipeline RAG multi-sources à faible latence) avec grille d'auto-notation.
  - **Étape 5 (Débriefing & Bilan Chiffré) :** Synthèse chiffrée avec score global sur 100 %, répartition des points, sauvegarde en base SQLite locale et bouton d'injection immédiate des questions échouées dans le deck de cartes mémoire SRS.

### Lot E : Matrice de Compétences, Fiches STAR et Hub Unifié
- **Matrice de compétences (`src/components/CompetencyMatrixView.tsx`) :**
  - Suivi de 20 compétences clés (SQL avancé, Modélisation Kimball, Snowflake, dbt, Spark/PySpark, Kafka/Kinesis, RAG, Embeddings, Docker, etc.).
  - **Règle absolue d'acquisition :** Une compétence n'est déclarée maîtrisée que si et seulement si elle totalise au moins 3 réussites réparties sur au moins 2 sessions distinctes dans le temps, garantissant une consolidation mémorielle durable.
- **Espace Projets STAR (`src/components/ProjectsView.tsx`) :**
  - 3 fiches de projet initialisées **strictement vides** (aucun projet fictif ou fait inventé).
  - Structure d'aide à la formulation selon les 4 piliers STAR (Situation, Tâche, Action, Résultat).
  - Sections dédiées : stack technique avec tags dynamiques, points d'architecture clés à défendre en entretien, et questions pièges avec argumentaires de réponse préparés.
  - Persistance transactionnelle dans la table SQLite `project_sheets`.
- **Hub d'onglets unifié (`src/components/InterviewsHubView.tsx`) :**
  - Regroupe au sein d'une même vue les 6 sous-modules : Simulateur d'Entretien, Éditeur SQL, Exercices Python, Cours & Fiches, Matrice de Compétences, Fiches Projets STAR.
  - Intégré dans la barre de navigation principale de `src/App.tsx` sous l'onglet `8. Entretiens techniques` avec un badge `CDI`.

---

## 3. Résultats des Tests et Contrôle Qualité

### A. Tests Automatisés Vitest (100 % Succès)
Commande d'exécution :
```bash
npm test
```
Résultats obtenus :
```text
 ✓ tests/unit/certificationsContent.test.ts (4 tests)
 ✓ tests/unit/progression.test.ts (3 tests)
 ✓ tests/unit/spacedRepetition.test.ts (3 tests)
 ✓ tests/unit/rescheduler.test.ts (7 tests)
 ✓ tests/unit/backupValidator.test.ts (3 tests)
 ✓ tests/unit/certificationsApi.test.ts (6 tests)
 ✓ tests/unit/sqlSandbox.test.ts (7 tests)
 ✓ tests/unit/interviewPreparation.test.ts (6 tests)
 ✓ tests/unit/pythonSandbox.test.ts (5 tests)

 Test Files  9 passed (9)
      Tests  44 passed (44)
   Duration  8.08s
```

### B. Contrôle de Compilation TypeScript
Commande d'exécution :
```bash
npx tsc --noEmit
```
Résultat : **Code de sortie 0, 0 erreur de typage.**

### C. Vérification Typographique Automatisée
Un scan complet de l'arborescence du projet (`src/`, `content/`, `tests/`, `docs/`, `data/`) a été exécuté par script Node.js.
Résultat : **0 caractère tiret cadratin (`\u2014`) et 0 demi-cadratin (`\u2013`). Conformité typographique à 100 %.**

---

## 4. Respect Strict des Engagements et Règles Permanentes

1. **Départ à 0 % sur les cours Udemy et certifications :**
   - Aucune tâche ou leçon n'est pré-validée.
   - La base de données SQLite locale démarre avec 0 % de complétion sur les 5 cours et les 3 certifications.
   - Les leçons 1 à 120 de Merico et 1 à 49 de Toth sont rigoureusement planifiées dès le départ dans l'application.
2. **Plafond d'heures hebdomadaires :**
   - Le budget global de 8 à 10 heures par semaine (480 à 600 minutes) est strictement sanctuarisé dans le planning.
   - Les modules de préparation aux entretiens sont intégrés de manière progressive sans surcharger la charge d'étude des certifications.
3. **Zéro contenu fictif ou inventé :**
   - Les 3 fiches de projet de l'espace STAR sont livrées strictement vierges de données inventées, conformément au respect de l'expérience réelle d'Auren.
4. **Honnêteté documentaire et droits d'auteur :**
   - Zéro braindump ou reproduction de questions propriétaires.
   - Chaque question d'entretien et de certification est accompagnée de sa source officielle vérifiée et de son étiquette de traçabilité.

---

## 5. Mode d'Emploi pour Démarrer la Préparation

1. **Lancement de l'application locale :**
   - Double-cliquez sur `demarrer.bat` ou lancez `npm run start` dans le terminal.
   - Rendez-vous sur `http://127.0.0.1:5173`.
2. **Accès au module Entretiens :**
   - Cliquez sur le 8e onglet **`8. Entretiens techniques`** dans la barre latérale ou l'en-tête.
   - Naviguez librement entre les 6 sous-modules :
     - **Simulateur :** Lancez une simulation express de 15 minutes pour vous échauffer.
     - **Éditeur SQL :** Pratiquez les requêtes fenêtrées et jointures complexes sur les 4 jeux de données métiers.
     - **Exercices Python :** Résolvez les défis d'algorithmique et de manipulation data en temps réel.
     - **Cours condensés :** Révisez les 29 fiches avant un entretien ciblé.
     - **Matrice de compétences :** Visualisez votre taux de rétention sur les 20 technologies évaluées.
     - **Fiches Projets STAR :** Remplissez vos fiches en amont de vos convocations pour structurer vos présentations orales.
