# Recensement des Sources Sérieuses pour Entretiens Data et AI

**Date de consultation et d'analyse :** 31 octobre 2026  
**Auteur :** Antigravity (Chef de projet pédagogique Data & AI Engineering)  
**Objectif :** Établir une base documentaire rigoureuse pour l'entraînement aux entretiens techniques (questions de cours, live coding, conception de systèmes et études de cas).

---

## 1. Répertoire des 20 Sources Sélectionnées

Toutes les sources ci-dessous ont été vérifiées le 31 octobre 2026. Conformément aux règles d'intégrité et de propriété intellectuelle, ces ressources sont destinées à être référencées, résumées ou utilisées pour vérifier des concepts avec nos propres mots, sans copie directe de contenus protégés.

### 1.1 Documentations Officielles et Références Techniques

#### Source 1 : Documentation Officielle Python (Python Software Foundation)
- **Nom :** Python Official Documentation (Library & Language Reference)
- **Sujet :** Structures de données internes, modèle de données (Data Model), générateurs, décorateurs, typage (`typing`), gestionnaires de contexte (`contextlib`), complexité.
- **Métier concerné :** Data Engineer, AI Engineer, ML Engineer, Data Scientist (Transversal).
- **Niveau :** Intermédiaire à Avancé.
- **URL :** `https://docs.python.org/3/`
- **Type de source :** Documentation officielle.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (référence absolue faisant autorité sur le comportement de CPython).
- **Intérêt en une phrase :** Permet de maîtriser les mécanismes internes du langage indispensables pour répondre sans hésitation aux pièges de live coding et de questions théoriques.
- **Conditions d'utilisation :** Licence libre PSF : citation, résumé et référence autorisés sans restriction commerciale.

#### Source 2 : Documentation Officielle PostgreSQL
- **Nom :** PostgreSQL Official Documentation
- **Sujet :** Moteur relationnel, fonctions de fenêtrage (Window Functions), CTE récursives, optimisation de requêtes (`EXPLAIN ANALYZE`), indexation (B-tree, GIN, GiST), niveaux d'isolation des transactions.
- **Métier concerné :** Data Engineer, Data Scientist.
- **Niveau :** Intermédiaire à Avancé.
- **URL :** `https://www.postgresql.org/docs/current/`
- **Type de source :** Documentation officielle open source.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (norme de facto pour le SQL standard et les mécanismes de bases relationnelles).
- **Intérêt en une phrase :** Référence incontournable pour comprendre comment le moteur exécute les requêtes et optimiser le coût des plans d'exécution en entretien.
- **Conditions d'utilisation :** Licence PostgreSQL (très permissive) : référencement et reformulation autorisés.

#### Source 3 : Documentation Officielle Apache Spark
- **Nom :** Apache Spark Documentation (Programming Guides & Architecture)
- **Sujet :** Moteur distribué, Spark SQL, DataFrames/Datasets, Catalyst Optimizer, Tungsten, partitionnement, shuffles, jointures distribuées (Broadcast Hash Join vs Sort-Merge Join).
- **Métier concerné :** Data Engineer, ML Engineer.
- **Niveau :** Avancé.
- **URL :** `https://spark.apache.org/docs/latest/`
- **Type de source :** Documentation officielle de la fondation Apache.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (documentation du projet open source officiel).
- **Intérêt en une phrase :** Fournit les concepts clés d'architecture distribuée nécessaires pour résoudre les questions de scalabilité et de débogage d'out of memory (OOM) en entretien.
- **Conditions d'utilisation :** Licence Apache 2.0 : référencement et extraction de principes autorisés.

#### Source 4 : Documentation Officielle Apache Kafka
- **Nom :** Apache Kafka Documentation
- **Sujet :** Systèmes de streaming temps réel, brokers, topics, partitions, consumer groups, sémantiques de livraison (at-most-once, at-least-once, exactly-once), rétention et compactage.
- **Métier concerné :** Data Engineer, AI Engineer (Event-driven RAG).
- **Niveau :** Intermédiaire à Avancé.
- **URL :** `https://kafka.apache.org/documentation/`
- **Type de source :** Documentation officielle de la fondation Apache.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (spécification officielle du standard de streaming).
- **Intérêt en une phrase :** Essentielle pour justifier des choix d'architecture de streaming temps réel et de gestion de charge en entretien système.
- **Conditions d'utilisation :** Licence Apache 2.0.

#### Source 5 : Documentation Officielle dbt Labs
- **Nom :** dbt Docs (Best Practices & Reference Guides)
- **Sujet :** Modélisation analytique, matérialisations (table, view, incremental dont microbatch), tests génériques et unitaires, documentation, Jinja/macros, Slim CI (`state:modified`).
- **Métier concerné :** Data Engineer, Analytics Engineer.
- **Niveau :** Débutant à Avancé.
- **URL :** `https://docs.getdbt.com/docs/`
- **Type de source :** Documentation officielle de l'éditeur.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (créateur de la méthodologie et de l'outil).
- **Intérêt en une phrase :** Guide canonique des bonnes pratiques de modélisation moderne en couches (staging, intermediate, marts).
- **Conditions d'utilisation :** Contenu public en ligne : référencement et citation autorisés.

#### Source 6 : Documentation Officielle Snowflake
- **Nom :** Snowflake Documentation & Architecture Guides
- **Sujet :** Architecture multi-clusters découplée (stockage/calcul/services cloud), micro-partitionnement automatique, clustering keys, zero-copy cloning, Time Travel, Streams & Tasks, Snowpark.
- **Métier concerné :** Data Engineer.
- **Niveau :** Intermédiaire à Avancé.
- **URL :** `https://docs.snowflake.com/`
- **Type de source :** Documentation officielle constructeur.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (référence éditeur officielle).
- **Intérêt en une phrase :** Permet à Auren de valoriser sa certification SnowPro Core en détaillant le fonctionnement interne du warehouse en entretien.
- **Conditions d'utilisation :** Documentation publique en ligne : référencement libre.

#### Source 7 : Documentation Officielle Databricks
- **Nom :** Databricks Architecture & Delta Lake Guides
- **Sujet :** Architecture Lakehouse (médallion : bronze, argent, or), format Delta Lake (ACID, time travel, Z-order, optimize), Unity Catalog, Spark managé.
- **Métier concerné :** Data Engineer, ML Engineer.
- **Niveau :** Intermédiaire à Avancé.
- **URL :** `https://docs.databricks.com/`
- **Type de source :** Documentation officielle de l'éditeur.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (spécifications techniques de la plateforme leader lakehouse).
- **Intérêt en une phrase :** Crucial pour aborder les architectures de données hybrides et la gouvernance centralisée en entretien de conception.
- **Conditions d'utilisation :** Libre consultation et référencement.

#### Source 8 : Documentation Officielle Hugging Face
- **Nom :** Hugging Face Documentation (Transformers, Datasets, PEFT, TGI)
- **Sujet :** Modèles de fondation, tokenization, embeddings, pipelines d'inférence, quantification (bitsandbytes, AWQ, GPTQ), LoRA / QLoRA, serving de LLM.
- **Métier concerné :** AI Engineer, ML Engineer.
- **Niveau :** Intermédiaire à Avancé.
- **URL :** `https://huggingface.co/docs`
- **Type de source :** Documentation officielle du standard open source IA.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (écosystème de référence pour l'IA open source).
- **Intérêt en une phrase :** Guide pratique indispensable pour maîtriser le déploiement local ou managé de LLM et la manipulation des tenseurs et embeddings.
- **Conditions d'utilisation :** Licence open source (Apache 2.0 / MIT) : référencement libre.

#### Source 9 : Documentation Officielle FastAPI
- **Nom :** FastAPI Documentation & Tutorial
- **Sujet :** Développement d'APIs REST asynchrones performantes (`async/await`), validation des données avec Pydantic, dépendances, middlewares, documentation interactive OpenAPI/Swagger.
- **Métier concerné :** AI Engineer, Data Engineer, Software Engineer.
- **Niveau :** Débutant à Intermédiaire.
- **URL :** `https://fastapi.tiangolo.com/`
- **Type de source :** Documentation officielle du framework.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (documentation exhaustive et maintenue avec exemples précis).
- **Intérêt en une phrase :** Standard incontournable pour exposer des modèles d'IA ou des endpoints de transformation de données en production.
- **Conditions d'utilisation :** Licence MIT : référencement libre.

#### Source 10 : Documentation Officielle Docker
- **Nom :** Docker Docs (Get Started, Dockerfile Best Practices & Compose)
- **Sujet :** Conteneurisation, structure optimale de Dockerfile (multi-stage builds, mise en cache des layers, réduction de taille), Docker Compose, mise en réseau et volumes.
- **Métier concerné :** Transversal (DE, AI, MLE, Software Engineering).
- **Niveau :** Débutant à Intermédiaire.
- **URL :** `https://docs.docker.com/`
- **Type de source :** Documentation officielle.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (standard industriel de la conteneurisation).
- **Intérêt en une phrase :** Permet de démontrer en entretien sa capacité à industrialiser et packager des applications data/IA propres et légères.
- **Conditions d'utilisation :** Documentation publique en libre accès.

---

### 1.2 Plateformes d'Exercices Techniques Reconnues

#### Source 11 : DataLemur
- **Nom :** DataLemur (Plateforme spécialisée d'entretiens SQL & Data)
- **Sujet :** Questions réelles de SQL posées par les entreprises tech (FAANG, scale-ups), questions de statistiques, Python et Machine Learning pour la data.
- **Métier concerné :** Data Engineer, Data Scientist.
- **Niveau :** Tous niveaux (Facile, Moyen, Difficile).
- **URL :** `https://datalemur.com/`
- **Type de source :** Plateforme d'entraînement technique interactive.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (fondée par Nick Singh, auteur de *Ace the Data Science Interview*, questions basées sur des retours d'entretiens réels).
- **Intérêt en une phrase :** Meilleure plateforme actuelle pour s'entraîner aux questions SQL de fenêtrage et d'agrégation complexe typiques des recruteurs data.
- **Conditions d'utilisation :** Questions en libre accès sur le site : référencer le titre du problème sans reproduire les énoncés propriétaires.

#### Source 12 : NeetCode
- **Nom :** NeetCode (NeetCode 150 & Algorithms Guide)
- **Sujet :** Algorithmes et structures de données indispensables (Tableaux, HashMaps, Two Pointers, Arbres, Graphes, Heap, Dynamic Programming), complexité temporelle et spatiale Big O.
- **Métier concerné :** Data Engineer, AI Engineer, Software Engineer.
- **Niveau :** Intermédiaire.
- **URL :** `https://neetcode.io/`
- **Type de source :** Feuille de route d'exercices algorithmiques structurée avec vidéos explicatives.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (sélection très rigoureuse et mondialement reconnue des problèmes LeetCode essentiels).
- **Intérêt en une phrase :** Évite de s'éparpiller dans des milliers de problèmes en ciblant les 75 à 150 algorithmes clés fréquemment posés en test de code.
- **Conditions d'utilisation :** Libre accès public : référencement par identifiant de problème.

#### Source 13 : LeetCode (Sections Database & Concurrency)
- **Nom :** LeetCode (Database Problem Set)
- **Sujet :** Défis de requêtage SQL (jointures multiples, déduplication, requêtes hiérarchiques, optimisations de fenêtrage).
- **Métier concerné :** Data Engineer, Software Engineer.
- **Niveau :** Tous niveaux.
- **URL :** `https://leetcode.com/problemset/database/`
- **Type de source :** Plateforme d'évaluation technique standardisée.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (référence internationale des tests techniques préliminaires).
- **Intérêt en une phrase :** Fournit un environnement automatisé avec cas de tests limites (corner cases) pour tester la robustesse de son code SQL.
- **Conditions d'utilisation :** Utilisation personnelle et référencement : interdiction de copier-coller les énoncés commerciaux.

#### Source 14 : PGExercises
- **Nom :** PGExercises (Interactive PostgreSQL Exercises)
- **Sujet :** Pratique interactive ciblée sur PostgreSQL : agrégations, jointures, sous-requêtes, modélisation de dates et fenêtrage sur une base de données de club de sport réaliste.
- **Métier concerné :** Data Engineer, Data Scientist.
- **Niveau :** Débutant à Avancé.
- **URL :** `https://pgexercises.com/`
- **Type de source :** Plateforme pédagogique interactive gratuite.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (créée par un ingénieur d'infrastructure, très didactique).
- **Intérêt en une phrase :** Idéale pour consolider rapidement la syntaxe des fonctions de fenêtrage et des CTE sur un schéma relationnel propre.
- **Conditions d'utilisation :** Site gratuit : référencement libre.

---

### 1.3 Guides Techniques d'Entreprises et Retours d'Expérience Professionnels

#### Source 15 : Netflix Technology Blog
- **Nom :** Netflix TechBlog (Data & ML Platform Architecture)
- **Sujet :** Conception de pipelines de données massifs, architecture de data lakehouse sur Apache Iceberg, ordonnancement distribué (Meson/Maestro), traitement temps réel avec Apache Flink.
- **Métier concerné :** Data Engineer, ML Engineer.
- **Niveau :** Avancé.
- **URL :** `https://netflixtechblog.com/`
- **Type de source :** Blog d'ingénierie d'entreprise (Enterprise Tech Blog).
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (retours concrets de production sur des systèmes traitant des pétaoctets de données).
- **Intérêt en une phrase :** Source d'inspiration de premier plan pour argumenter les entretiens de System Design avec des choix architecturaux éprouvés à grande échelle.
- **Conditions d'utilisation :** Articles publics en libre lecture : citation et synthèse d'architecture autorisées.

#### Source 16 : Uber Engineering Blog
- **Nom :** Uber Engineering Blog (Big Data & Streaming Systems)
- **Sujet :** Architecture de streaming temps réel avec Apache Kafka et Flink, stockage analytique (Apache Pinot, Apache Hudi), gestion de la consistance et de l'idempotence.
- **Métier concerné :** Data Engineer, AI Engineer.
- **Niveau :** Avancé.
- **URL :** `https://www.uber.com/blog/engineering/`
- **Type de source :** Blog d'ingénierie d'entreprise.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (référence industrielle sur les flux à très haute fréquence et faible latence).
- **Intérêt en une phrase :** Permet d'illustrer concrètement la résolution des défis de gestion des doublons et de traitement streaming en entretien.
- **Conditions d'utilisation :** Publication publique en libre accès.

#### Source 17 : Ouvrage & Guides de Chip Huyen (Designing Machine Learning Systems)
- **Nom :** Machine Learning System Design & Real-Time ML Patterns (Chip Huyen)
- **Sujet :** Conception de systèmes ML et IA en production, Feature Stores, data streaming pour le ML, monitoring de modèles (data drift, concept drift), boucles de rétroaction.
- **Métier concerné :** AI Engineer, ML Engineer.
- **Niveau :** Intermédiaire à Avancé.
- **URL :** `https://huyenchip.com/` et `https://github.com/chiphuyen/machine-learning-systems-design`
- **Type de source :** Guide technique et pédagogique d'experte reconnue (ancienne de Stanford et Snorkel AI).
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (considéré comme le guide de référence mondiale pour le design de systèmes ML).
- **Intérêt en une phrase :** Structure méthodologique indispensable pour mener pas à pas un entretien de conception de système d'IA.
- **Conditions d'utilisation :** Matériel de cours et articles de blog en open access : citation et concepts réutilisables.

#### Source 18 : The Seattle Data Guy (Ben Rogojan)
- **Nom :** The Seattle Data Guy (Articles et Newsletters techniques Data Engineering)
- **Sujet :** Bonnes pratiques d'architecture Data, entreposage, comparaison des outils modernes (Snowflake vs Databricks vs Redshift), retours d'entretiens techniques pour Data Engineers.
- **Métier concerné :** Data Engineer.
- **Niveau :** Débutant à Avancé.
- **URL :** `https://www.theseattledataguy.com/` et `https://theseattledataguy.substack.com/`
- **Type de source :** Blog et analyses techniques de consultant indépendant.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Moyenne à Haute (expérience terrain riche, avis pragmatique sur les attentes réelles des recruteurs).
- **Intérêt en une phrase :** Donne une vision claire des compromis architecturaux (trade-offs) et des questions de bon sens posées par les responsables data.
- **Conditions d'utilisation :** Articles publics : référencement et reformulation.

#### Source 19 : Zach Wilson (DataExpert.io / Data Engineering Community)
- **Nom :** DataExpert.io (Data Engineering Interview Frameworks)
- **Sujet :** Frameworks d'entretiens Data Engineering (SQL avancé, modélisation dimensionnelle de Kimball, pipelines distribués Spark, gestion de la qualité des données).
- **Métier concerné :** Data Engineer.
- **Niveau :** Intermédiaire à Avancé.
- **URL :** `https://www.dataexpert.io/`
- **Type de source :** Retours d'expérience et contenus pédagogiques d'un ancien tech lead (Netflix, Airbnb, Facebook).
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (très forte légitimité technique dans le domaine du Data Engineering).
- **Intérêt en une phrase :** Fournit la grille d'évaluation exacte utilisée par les recruteurs seniors pour juger la maturité d'un data engineer.
- **Conditions d'utilisation :** Publications publiques et newsletters : référencement autorisé.

#### Source 20 : Pinecone Learning Center & Guides RAG
- **Nom :** Pinecone Architecture Guides & Vector Search Basics
- **Sujet :** Indexation vectorielle (HNSW, IVF, distance cosinus, produit scalaire), architectures RAG avancées, stratégies de chunking, filtrage hybride (keyword + semantic search), reranking.
- **Métier concerné :** AI Engineer.
- **Niveau :** Intermédiaire.
- **URL :** `https://www.pinecone.io/learn/`
- **Type de source :** Base de connaissances technique éditeur.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (pionnier et leader des bases de données vectorielles managées).
- **Intérêt en une phrase :** Référence technique incontournable pour expliquer en détail les mécanismes de recherche sémantique et d'évaluation d'un RAG en entretien.
- **Conditions d'utilisation :** Articles pédagogiques en libre accès : référencement libre.

#### Source 21 : Documentation Officielle Scikit-learn
- **Nom :** Scikit-learn User Guide & API Reference
- **Sujet :** Prétraitement de données (StandardScaler, OneHotEncoder), prévention du data leakage (Pipelines), métriques d'évaluation (ROC-AUC, Precision-Recall, F1-score), validation croisée (TimeSeriesSplit).
- **Métier concerné :** Data Scientist, ML Engineer, Data Engineer.
- **Niveau :** Intermédiaire.
- **URL :** `https://scikit-learn.org/stable/`
- **Type de source :** Documentation officielle open source.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Haute (bibliothèque standard de référence pour le machine learning tabulaire en Python).
- **Intérêt en une phrase :** Fournit les définitions mathématiques et algorithmiques exactes des transformations et métriques d'évaluation posées en entretien.
- **Conditions d'utilisation :** Licence BSD nouvelle (3-clause) : référencement libre.

---

### 1.4 Sources Communautaires et Retours d'Expérience de Candidats (Attestation Terrain)

#### Source 22 : Communauté Reddit r/dataengineering
- **Nom :** Reddit r/dataengineering (Retours d'entretiens et retours d'expérience candidats)
- **Sujet :** Témoignages réels de candidats sur les processus de recrutement (tests techniques en direct, questions d'architecture de pipelines, pièges SQL, pièges d'évaluation live coding).
- **Métier concerné :** Data Engineer.
- **Niveau :** Tous niveaux (Junior à Staff).
- **URL :** `https://www.reddit.com/r/dataengineering/`
- **Type de source :** Communauté technique et retours d'expérience de candidats.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Moyenne (témoignages individuels anonymes de candidats, mais représentatifs des questions réellement posées en entretien en 2026).
- **Intérêt en une phrase :** Permet d'attester de la réalité du terrain et des questions posées lors des entretiens de Data Engineering récents.
- **Conditions d'utilisation :** Discussions publiques sur forum : citation thématique sans reproduction intégrale de posts nominatifs.

#### Source 23 : LeetCode Discuss (Section Interview Experience)
- **Nom :** LeetCode Discuss (Interview Experience & Database Sub-forum)
- **Sujet :** Débriefings détaillés de candidats post-entretiens techniques pour des postes Data / Software (énoncés synthétisés de live coding SQL, complexité algorithmique, questions de reprise sur panne).
- **Métier concerné :** Data Engineer, AI Engineer, Software Engineer.
- **Niveau :** Intermédiaire à Avancé.
- **URL :** `https://leetcode.com/discuss/interview-experience/`
- **Type de source :** Forum communautaire de candidats tech.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Moyenne à Haute (nombreux retours précis et recoupés sur les questions de tests techniques éliminatoires).
- **Intérêt en une phrase :** Atteste précisément de la typologie des questions de live coding et de modélisation réellement soumises aux candidats par les recruteurs.
- **Conditions d'utilisation :** Plateforme publique : référencement du sujet et synthèse thématique.

#### Source 24 : Communauté Reddit r/LocalLLaMA
- **Nom :** Reddit r/LocalLLaMA (Engineering & Deployment Discussions)
- **Sujet :** Retours de développeurs et candidats sur l'ingénierie des LLM (déploiement local, quantification GGUF/AWQ/vLLM, architectures RAG, indexation vectorielle, pièges de latence).
- **Métier concerné :** AI Engineer, ML Engineer.
- **Niveau :** Intermédiaire à Avancé.
- **URL :** `https://www.reddit.com/r/LocalLLaMA/`
- **Type de source :** Communauté de praticiens et candidats spécialisés IA générative.
- **Date de consultation :** 31 octobre 2026.
- **Fiabilité :** Moyenne (retours communautaires de praticiens confirmés).
- **Intérêt en une phrase :** Atteste des problématiques techniques réelles rencontrées et interrogées en entretien pour les postes d'AI Engineer.
- **Conditions d'utilisation :** Discussions ouvertes : référencement et synthèse des axes techniques.

---

## 2. Synthèse des Thèmes de Questions Récurrents en Entretien

Conformément à la règle de rigueur sur la provenance :
- Les thèmes validés par des témoignages réels de candidats sont étiquetés : `Questions attestées par retours de candidats (Source)`.
- Les thèmes déduits des documentations et guides théoriques sans retour de candidat explicite sont étiquetés : `Thèmes plausibles, non attestés`.

### 2.1 Métier : Data Engineer

1. **Thème 1 : Fonctions de fenêtrage et requêtage SQL analytique**
   - *Statut et questions :* Questions attestées par retours de candidats (LeetCode Discuss & Reddit r/dataengineering) : Identifier les doublons dans une table d'événements, calculer une moyenne mobile sur 7 jours glissants, trouver les 3 premiers salaires ou ventes par département (`DENSE_RANK` vs `RANK` vs `ROW_NUMBER`), analyser des parcours utilisateurs (`LAG` et `LEAD`).
   - *Sources attestant de la récurrence :* LeetCode Discuss (Interview Experience), Reddit r/dataengineering, DataLemur (section SQL Questions) et PGExercises.
2. **Thème 2 : Architecture de pipeline, Idempotence et Reprise sur erreur**
   - *Statut et questions :* Questions attestées par retours de candidats (Reddit r/dataengineering) : Comment garantir qu'un pipeline réexécuté 3 fois après un crash ne crée aucun doublon ? Comment concevoir une stratégie de partitionnement par date pour du traitement incrémental ? Quel format choisir entre Parquet, Avro et JSON selon l'usage ?
   - *Sources :* Reddit r/dataengineering (retours de candidats), Netflix TechBlog, Zach Wilson (DataExpert.io) et Uber Engineering Blog.
3. **Thème 3 : Optimisation et débogage de calcul distribué (Spark / PySpark)**
   - *Statut et questions :* Questions attestées par retours de candidats (Reddit r/dataengineering & LeetCode Discuss) : Qu'est-ce que le data skew et comment le corriger (salting, broadcast join) ? Pourquoi mon job Spark génère-t-il une erreur OOM (Out Of Memory) sur l'exécuteur ? Différence entre transformation `narrow` (map, filter) et `wide` (groupBy, join).
   - *Sources :* Reddit r/dataengineering, LeetCode Discuss, Apache Spark Official Documentation et Seattle Data Guy.
4. **Thème 4 : Modélisation dimensionnelle et compromis d'entrepôt**
   - *Statut et questions :* Questions attestées par retours de candidats (Reddit r/dataengineering) : Schéma en étoile vs schéma en flocon. Quand dénormaliser dans un warehouse moderne (Snowflake/BigQuery) ? Comment gérer une dimension à changement lent (SCD type 2 avec dbt snapshots) ?
   - *Sources :* Reddit r/dataengineering, dbt Docs et Snowflake Documentation.

### 2.2 Métier : AI Engineer

1. **Thème 1 : Architecture RAG de bout en bout (Retrieval-Augmented Generation)**
   - *Statut et questions :* Questions attestées par retours de candidats (Reddit r/LocalLLaMA & LeetCode Discuss) : Comment concevoir un assistant documentaire sur 100 000 fichiers PDF ? Quelle stratégie de découpage (chunking) adopter ? Comment gérer le compromis entre taille de fenêtre de contexte et précision ? Comment fonctionne un index HNSW ?
   - *Sources :* Reddit r/LocalLLaMA, LeetCode Discuss, Pinecone Learning Center et Chip Huyen ML System Design.
2. **Thème 2 : Évaluation et fiabilisation des réponses de LLM (Hallucinations & Guardrails)**
   - *Statut et questions :* Thèmes plausibles, non attestés : Comment mesurer quantitativement la fidélité (faithfulness) et la pertinence (relevance) d'un RAG en production (frameworks Ragas, TruLens) ? Comment mettre en place des filtres de sécurité et de détection de prompt injection ?
   - *Sources d'inspiration :* Hugging Face Documentation et Articles techniques Chip Huyen.
3. **Thème 3 : Déploiement et serving d'APIs IA performantes**
   - *Statut et questions :* Questions attestées par retours de candidats (Reddit r/LocalLLaMA) : Pourquoi utiliser `async/await` dans FastAPI pour appeler des APIs LLM ? Comment gérer le streaming de tokens via Server-Sent Events (SSE) ? Comment gérer les quotas et la mise en cache sémantique des requêtes ?
   - *Sources :* Reddit r/LocalLLaMA, FastAPI Official Documentation et Docker Docs.

### 2.3 Métier : Machine Learning Engineer & Data Scientist

1. **Thème 1 : Détection de Data Leakage et validation de modèles**
   - *Statut et questions :* Thèmes plausibles, non attestés : À quelle étape du pipeline doit-on appliquer le standard scaling pour éviter toute fuite de données ? Différence entre Cross-Validation temporelle et K-Fold aléatoire sur des séries temporelles.
   - *Sources d'inspiration :* Chip Huyen (Designing ML Systems), Scikit-learn Documentation et DataLemur.
2. **Thème 2 : Gestion des jeux de données déséquilibrés et métriques d'évaluation**
   - *Statut et questions :* Thèmes plausibles, non attestés : Pourquoi la métrique Accuracy est-elle trompeuse pour la détection de fraude à 0,1 % de positifs ? Quand privilégier le Precision-Recall AUC par rapport au ROC-AUC ? Compromis F1-score vs coût métier des faux négatifs.
   - *Sources d'inspiration :* DataLemur et Scikit-learn Official Documentation.
