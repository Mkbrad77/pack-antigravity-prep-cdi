# Programme Pédagogique Adapté : Préparation aux Entretiens Data & AI

**Date de conception :** 31 octobre 2026  
**Auteur :** Antigravity (Chef de projet pédagogique Data & AI Engineering)  
**Candidat :** Auren (Ingénieur EPITA, alternant Data/IA, fin de contrat le 2 avril 2027)  
**Document de référence source :** `data/programme_cible_chapitres.md` et `data/planning_hebdo.json`

---

## 1. Cadrage et Équation Budgétaire Réelle

### 1.1 Le constat mathématique lucide
Le document cible initial `data/programme_cible_chapitres.md` listait 7 modules totalisant **141 chapitres**.  
Si chaque chapitre nécessitait une étude standard de 45 à 60 minutes, le volume théorique dépasserait **7 500 minutes (125 heures)**.

Or, le budget hebdomadaire d'entraînement aux entretiens fixé dans `data/planning_hebdo.json` (champ `interview_budget_min`) s'établit strictement comme suit sur les 22 semaines du programme :
- **Semaines 1 à 3 (Phase CLF) :** 3 x 60 min = 180 min (1 h / semaine)
- **Semaines 4 à 10 (Phase DEA - cours) :** 7 x 120 min = 840 min (2 h / semaine)
- **Semaines 11 à 14 (Phase DEA - examens blancs) :** 4 x 60 min = 240 min (1 h / semaine)
- **Semaines 15 à 19 (Phase dbt) :** 5 x 120 min = 600 min (2 h / semaine)
- **Semaine 20 (Phase dbt - examen) :** 1 x 60 min = 60 min (1 h / semaine)
- **Semaines 21 et 22 (Réserve et sprint final) :** 2 x 240 min = 480 min (4 h / semaine)  
**Budget total disponible pour les entretiens : exactement 2 400 minutes (soit 40 heures réelles).**

### 1.2 Les 4 leviers pédagogiques d'optimisation
Pour faire tenir le programme d'entretiens dans ces 2 400 minutes sans créer aucune dette :
1. **Valoriser les acquis d'Auren :** Auren est ingénieur EPITA, maîtrise déjà la syntaxe de base de Python et SQL, et possède la certification Snowflake SnowPro Core (obtenue le 29 octobre 2026). Les bases élémentaires font l'objet d'un **test diagnostic en Semaine 1** et sont immédiatement validées/sautées.
2. **Exploiter la double casquette Certifications / Entretiens :** La majorité des briques du Module 3 (Data Engineering) et du Module 2 (Data Warehouse) est apprise et manipulée dans le budget certifications (cours Maarek et Toth : plus de 80 heures de vidéos et labs). L'entraînement aux entretiens ne réapprend pas ces notions, mais s'exerce directement sur des études de cas et du live coding.
3. **Hiérarchisation stricte :** Les modules 1 (Python), 2 (SQL), 3 (Data Engineering) et 4 (AI Engineering) sont traités sous forme de chapitres d'entraînement ciblés.
4. **Allègement des modules 5 et 6 :** Le module 5 (Machine Learning) et le module 6 (Software Engineering) sont convertis en **fiches mémo de révision synthétique** (format condensé de 15 minutes par thème clé).

---

## 2. Matrice d'Articulation avec les Certifications (`carte_des_sujets.json`)

Pour éviter tout travail en double, les correspondances directes entre le programme d'entretiens et les cours de certification sont formalisées dans le tableau suivant :

| Chapitre du Module Entretien | Sujet technique | Référence cours DEA (Maarek) | Référence cours dbt (Toth/Weigel) | Économie de temps sur le budget entretien |
| :--- | :--- | :--- | :--- | :--- |
| **Module 3 - Chap. 4 & 15** | S3, Data Lake & formats (Parquet, Avro, ORC) | Leçons 22 à 61 (S3 et formats) | - | Théorie et labs faits en certification DEA (semaines 4 et 5). Entretien : focalisation sur les questions pièges. |
| **Module 3 - Chap. 10 & 11** | Spark, PySpark & EMR | Leçons 151 à 166 (Athena, Spark, EMR) | - | Architecture Spark étudiée en semaine 7. Entretien : questions sur le shuffle, skew et joins. |
| **Module 3 - Chap. 12** | Streaming, Kafka & Kinesis | Leçons 167 à 183 (Kinesis, MSK) | - | Différences Kinesis/Kafka étudiées en semaine 6. Entretien : dimensionnement et gestion des offsets. |
| **Module 3 - Chap. 13 & 18** | Orchestration (Airflow, Step Functions) | Leçons 193 à 206 (MWAA, Step Functions) | Toth leçons 138 à 144 (Dagster) | Orchestration vue en semaine 7. Entretien : conception de DAG robuste. |
| **Module 3 - Chap. 17 & 8** | Idempotence & Qualité des données | Leçon 144 (Glue Data Quality) | Toth leçons 37 à 49 (tests dbt) | Bonnes pratiques consolidées pendant le projet dbt. |
| **Module 2 - Chap. 20 à 23** | Modélisation dimensionnelle & Data Warehouse | Leçons 91 à 107 (Redshift) | Toth leçons 16 à 32 | Déjà acquis via SnowPro Core et approfondi avec Redshift et dbt. |
| **Module 3 - Chap. 25** | Transformation dbt (Snapshots, Jinja, CI) | - | Toth leçons 33 à 123 et Weigel | Pratique complète couverte lors du projet dbt en semaines 15 à 19. |

---

## 3. Détail du Programme par Module

### MODULE 1 : PYTHON TECHNIQUE ORIENTÉ ENTRETIENS (Budget alloué : 360 min)
- **Prérequis & Diagnostic :** Test diagnostic initial de 60 min en Semaine 1 pour valider les structures élémentaires.
- **Réintégration explicite :** Chapitre 1.10 (POO Python appliquée à la data, dataclasses, encapsulation).
- **Chapitres sautés / acquis :** Chapitres 1, 2, 3, 4, 8, 13, 20 (Syntaxe de base, boucles, manipulation de chaînes, exceptions simples déjà maîtrisées par un ingénieur EPITA).

| N° | Titre du chapitre | Niveau d'entrée | Priorité | Durée est. | Objectif opérationnel pour l'entretien |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **1.0** | **Test Diagnostic Python & SQL** | Intermédiaire | Indispensable | 60 min | Bilan initial des forces et ciblage des révisions en Semaine 1 |
| **1.6** | Complexité algorithmique Big O & Profiling | Intermédiaire | Indispensable | 30 min | Savoir analyser et exprimer la complexité temporelle/spatiale en live coding |
| **1.5** | Tri, recherche & HashMaps (Patterns Two Pointers) | Intermédiaire | Indispensable | 30 min | Résolution des patterns classiques d'entretiens (Two Sum, sliding window) |
| **1.10**| POO Python appliquée à la data (`dataclasses`, classes) | Intermédiaire | Indispensable | 30 min | Modélisation d'objets métiers, encapsulation et structure logicielle propre |
| **1.9** | Generators, Iterators & `yield` | Intermédiaire | Indispensable | 30 min | Traitement de flux volumineux sans saturer la mémoire vive |
| **1.11**| Decorators & Closures | Intermédiaire | Indispensable | 30 min | Écriture de décorateurs utilitaires (mesure de temps, retry, logging d'API) |
| **1.12**| Context Managers (`with`, `__enter__`, `__exit__`) | Intermédiaire | Utile | 30 min | Gestion sécurisée des connexions aux bases et fichiers temporaires |
| **1.14**| Typing moderne & Pydantic | Intermédiaire | Indispensable | 30 min | Écriture de code propre, typé et validé pour les pipelines et APIs |
| **1.16**| Unit Testing (`pytest`, fixtures, mocks) | Intermédiaire | Utile | 30 min | Structurer des tests unitaires rapides lors d'un test technique |
| **1.22**| FastAPI & Asynchronisme (`async/await`) | Intermédiaire | Indispensable | 40 min | Exposer un service de données ou un endpoint IA avec streaming |
| *1.17*| *Pandas & NumPy pour la manipulation analytique* | Intermédiaire | Utile (intégré) | 20 min | Opérations vectorisées et groupements express |

---

### MODULE 2 : SQL ANALYTIQUE, MODÉLISATION & OPTIMISATION (Budget alloué : 480 min)
- **Prérequis & Diagnostic :** Auren est certifié Snowflake SnowPro Core. Les requêtes élémentaires (SELECT, WHERE, JOIN simples, GROUP BY) sont acquises.
- **Réintégration explicite :** Modélisation dimensionnelle de Kimball (Chapitres 2.21 & 2.22) et Slowly Changing Dimensions SCD2 (Chapitre 2.23).
- **Focalisation :** SQL avancé de fenêtrage, modélisation de warehouse et optimisation de plans d'exécution.

| N° | Titre du chapitre | Niveau d'entrée | Priorité | Durée est. | Objectif opérationnel pour l'entretien |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **2.6** | CTE complexes & CTE récursives | Intermédiaire | Indispensable | 30 min | Structuration de requêtes lisibles et parcours d'arbres hiérarchiques |
| **2.7** | Window Functions (Syntaxe `OVER (PARTITION BY ... ORDER BY ...)`) | Intermédiaire | Indispensable | 45 min | Maîtrise complète de la clause de partitionnement et du frame `ROWS BETWEEN` |
| **2.8** | `ROW_NUMBER` & Déduplication robuste | Intermédiaire | Indispensable | 45 min | Extraction de la dernière version d'un enregistrement (dédoublonnage strict) |
| **2.9** | `RANK` vs `DENSE_RANK` | Intermédiaire | Indispensable | 30 min | Résolution des problèmes de Top-N avec ex-aequo (ex. salaires, scores) |
| **2.11**| `LAG` et `LEAD` (Analyses temporelles) | Intermédiaire | Indispensable | 30 min | Calcul de deltas entre événements consécutifs, churn, rétention |
| **2.12**| `CASE WHEN` avancé & Pivot conditionnel | Intermédiaire | Utile | 30 min | Transformation de lignes en colonnes sans fonction de pivot propriétaire |
| **2.14**| Dates, Timezones & Fonctions temporelles | Intermédiaire | Utile | 30 min | Gestion des fuseaux horaires, fenêtres glissantes et jours ouvrés |
| **2.21**| Modélisation dimensionnelle de Kimball (Étoile vs Flocon) | Intermédiaire | Indispensable | 40 min | Concevoir tables de faits et tables de dimensions pour entrepôt de données |
| **2.23**| Slowly Changing Dimensions (SCD Type 1 & Type 2) | Intermédiaire | Indispensable | 40 min | Gestion d'historique avec dates de validité (`valid_from`, `valid_to`) |
| **2.24**| SQL avancé pour Data Engineering (Surge, Gaps and Islands) | Avancé | Utile | 40 min | Résolution du problème classique des îles et des trous (sessions continues) |
| **2.17**| Indexation (B-Tree, Hash, GIN) & Clés de cluster | Intermédiaire | Indispensable | 30 min | Justifier l'impact d'un index vs clustering key Snowflake sur la performance |
| **2.18**| Lecture d'un plan d'exécution (`EXPLAIN ANALYZE`) | Avancé | Indispensable | 45 min | Détecter les Seq Scans, spillage sur disque et shuffles coûteux |
| **2.19**| Optimisation de requêtes (Query Tuning) | Avancé | Indispensable | 45 min | Éliminer les jointures cartésiennes, pushdown de prédicats et CTE matérialisées |

---

### MODULE 3 : DATA ENGINEERING & CONCEPTION DE SYSTÈMES (Budget alloué : 420 min)
- **Articulation :** La théorie des outils AWS (S3, Glue, Kinesis, Redshift) est acquise via la certification DEA. Le budget entretien est consacré aux **défis d'architecture, de live design, d'idempotence et d'optimisation distribuée**.
- **Couverture exhaustive :** Tous les 10 chapitres retenus (3.1, 3.2, 3.6, 3.8, 3.10, 3.12, 3.17, 3.18, 3.26, 3.27) sont explicitement placés dans le planning hebdomadaire.

| N° | Titre du chapitre | Niveau d'entrée | Priorité | Durée est. | Objectif opérationnel pour l'entretien |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **3.1** | ETL vs ELT : Critères de choix et compromis | Intermédiaire | Indispensable | 30 min | Argumenter le passage au ELT moderne sur cloud warehouse |
| **3.2** | Batch vs Streaming : Quand passer au temps réel ? | Intermédiaire | Indispensable | 30 min | Analyser le ratio coût/bénéfice entre micro-batch et streaming pur |
| **3.6** | Architecture Lakehouse & Formats ouverts (Iceberg/Delta) | Intermédiaire | Indispensable | 30 min | Expliquer les garanties ACID, le Time Travel et le compaction de fichiers |
| **3.8** | Data Quality : Détection d'anomalies & Circuit Breakers | Intermédiaire | Indispensable | 30 min | Bloquer un pipeline avant corruption des marts aval |
| **3.10**| Optimisation Spark : Partitionnement, Shuffles & Skew | Avancé | Indispensable | 40 min | Résoudre le déséquilibre de partitions et configurer `spark.sql.shuffle.partitions` |
| **3.12**| Streaming Kafka : Sémantiques de livraison & Offsets | Avancé | Indispensable | 40 min | Choix entre At-Least-Once et Exactly-Once, gestion du consumer group |
| **3.17**| Idempotence absolue des pipelines de données | Avancé | Indispensable | 60 min | Concevoir un pipeline ré-exécutable à volonté sans effets de bord |
| **3.18**| Conception d'orchestration (Reprise sur panne & Retry) | Intermédiaire | Indispensable | 40 min | Gestion des dépendances de DAGs, backfilling et alertes |
| **3.26**| Étude de cas 1 : Pipeline de 10 millions de lignes/jour | Avancé | Indispensable | 60 min | Exercice type System Design d'ingénierie de données |
| **3.27**| Étude de cas 2 : Gestion des événements en retard (Late Data) | Avancé | Indispensable | 60 min | Utilisation de fenêtres de tolérance (watermarking) et tables de rejet |
| *3.15*| *Formats colonnaires (Parquet vs ORC vs Avro)* | Intermédiaire | Utile (fusionné) | 30 min | Compression, schéma évolutif et pushdown de projections |
| *3.19*| *Data Lineage & Traçabilité des transformations* | Intermédiaire | Utile | 30 min | Auditer l'impact d'une modification de schéma en amont |

---

### MODULE 4 : AI ENGINEERING & ARCHITECTURES RAG (Budget alloué : 480 min)
- **Positionnement :** Traité principalement à partir de la semaine 15 (après l'obtention du DEA-C01), afin de préparer la priorité 2 (AI Engineer).

| N° | Titre du chapitre | Niveau d'entrée | Priorité | Durée est. | Objectif opérationnel pour l'entretien |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **4.3** | Architecture Transformers & Mécanisme d'attention | Intermédiaire | Indispensable | 45 min | Expliquer simplement le self-attention et la génération auto-régressive |
| **4.6** | Embeddings & Modèles d'encodage | Intermédiaire | Indispensable | 45 min | Espaces vectoriels, distances (cosinus, euclidienne), choix du modèle |
| **4.7** | Bases vectorielles & Indexation (HNSW, IVF) | Intermédiaire | Indispensable | 50 min | Comprendre le compromis précision/latence dans la recherche de voisins |
| **4.8** | Conception d'un système RAG complet | Intermédiaire | Indispensable | 60 min | Dessiner l'architecture : ingestion, découpage, indexation, génération |
| **4.9** | Stratégies de Chunking (Fixe, Sémantique, Hiérarchique) | Intermédiaire | Indispensable | 45 min | Adapter la taille des chunks à la granularité des questions posées |
| **4.11**| Reranking & Recherche Hybride (BM25 + Dense) | Avancé | Indispensable | 45 min | Améliorer significativement la précision du top-k retourné au LLM |
| **4.16**| Évaluation de systèmes RAG (Frameworks Ragas, TruLens) | Avancé | Indispensable | 55 min | Calculer la pertinence du contexte, la fidélité et la réponse |
| **4.19**| Sécurité, Hallucinations & Guardrails (NeMo, Llama Guard) | Intermédiaire | Indispensable | 45 min | Détection de fuites de données, injections de prompt et réponses hors sujet |
| **4.24**| Étude de cas : Assistant documentaire d'entreprise en production | Avancé | Indispensable | 50 min | Architecture complète incluant cache sémantique, quotas et monitoring |
| *4.14*| *Agents IA & LangGraph (Notions clés)* | Intermédiaire | Utile | 40 min | Cycles de décision, utilisation d'outils et persistance de l'état |

---

### MODULES 5 & 6 : FICHES MÉMO DE RÉFÉRENCE RAPIDE (Budget alloué : 180 min)
Au lieu de cours extensifs, ces modules sont condensés en **10 fiches de révision de 15 à 20 minutes chacune**, idéales pour réviser avant un entretien technique.

#### Module 5 : Machine Learning Essentials (90 min au total)
- **Fiche 5.1 :** Algorithmes supervisés (Régression logistique, Random Forest, XGBoost) : forces, faiblesses, hypothèses (20 min).
- **Fiche 5.2 :** Métriques d'évaluation et choix critique (Précision, Rappel, F1, ROC-AUC, PR-AUC) (20 min).
- **Fiche 5.3 :** Surapprentissage, Régularisation (L1/L2) et Validation Croisée sans fuite (20 min).
- **Fiche 5.4 :** Gestion des données déséquilibrées (Oversampling, SMOTE, pondération de classes) (15 min).
- **Fiche 5.5 :** Cycle de vie MLOps et dérive (Data Drift, Concept Drift, MLflow) (15 min).

#### Module 6 : Software Engineering Essentials (90 min au total)
- **Fiche 6.1 :** Dockerfile robuste et optimisation de build (multi-stage, cache layers, taille d'image) (20 min).
- **Fiche 6.2 :** Principes de CI/CD pour la Data (Git workflow, tests automatisés en PR, linting) (20 min).
- **Fiche 6.3 :** Observabilité : Métriques, Logs structurés (JSON), Tracing et Alertes (20 min).
- **Fiche 6.4 :** Fondamentaux réseau cloud (VPC, sous-réseaux privés, Security Groups, passerelle NAT) (15 min).
- **Fiche 6.5 :** Principes de Clean Code et Architecture Hexagonale en Data/IA (15 min).

---

### MODULE 7 : ENTRAÎNEMENT AUX FORMATS D'ENTRETIENS (Transversal : 240 min)
Ce module est filé sur l'ensemble du planning à raison de sessions dédiées lors des semaines 10, 14, 21 et 22 :
- **Format A : Live Coding SQL (60 min) :** Résolution chronométrée de 3 requêtes de fenêtrage sous contrainte de temps (type LeetCode Medium).
- **Format B : Live Coding Python (60 min) :** Manipulation algorithmique de structures et parsing de flux sans bibliothèques externes.
- **Format C : Architecture System Design (60 min) :** Conception au tableau blanc d'un pipeline de collecte et d'ingestion résilient.
- **Format D : Entretien RH & Présentation de Projets (60 min) :** Pitch du parcours, présentation du projet dbt et valorisation de l'alternance selon la méthode STAR (Situation, Tâche, Action, Résultat).

---

## 4. Bilan et Équilibre Budgétaire

| Module | Statut | Nombre de chapitres retenus | Temps total estimé | Pourcentage du budget |
| :--- | :--- | :---: | :---: | :---: |
| **Module 1 : Python Technique** | Prioritaire | 10 chapitres clés + diagnostic | 360 min | 15,0 % |
| **Module 2 : SQL Analytique & Modélisation** | Prioritaire | 13 chapitres avancés | 480 min | 20,0 % |
| **Module 3 : Data Engineering** | Priorité 1 | 10 études de cas & concepts | 420 min | 17,5 % |
| **Module 4 : AI Engineering** | Priorité 2 | 9 chapitres RAG/LLM | 360 min | 15,0 % |
| **Module 5 : ML Essentials** | Fiches mémo | 5 fiches synthétiques | 60 min | 2,5 % |
| **Module 6 : Software Eng.** | Fiches mémo | 5 fiches synthétiques | 60 min | 2,5 % |
| **Module 7 : Formats Entretiens & Simulations**| Transversal | Grand chelem & simulations | 660 min | 27,5 % |
| **TOTAL GÉNÉRAL** | - | **52 chapitres / fiches ciblés** | **2 400 min** | **100,0 %** |

**Conclusion de faisabilité :**  
Le programme adapté s'inscrit **exactement** dans les 2 400 minutes disponibles, sans créer de dette hebdomadaire. Les 93 chapitres redondants ou trop élémentaires ont été filtrés de manière transparente.
