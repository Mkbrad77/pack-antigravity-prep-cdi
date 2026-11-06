# Planning Hebdomadaire des Entretiens et Moteur de Replanification

**Date d'établissement :** 31 octobre 2026  
**Auteur :** Antigravity (Chef de projet pédagogique Data & AI Engineering)  
**Période couverte :** Du 2 novembre 2026 au 2 avril 2027 (22 semaines)  
**Budget hebdomadaire d'entretiens :** Strictement synchronisé avec `data/planning_hebdo.json` (Total : 2 400 minutes / 40 heures).

---

## 1. Planning Semaine par Semaine de l'Entraînement aux Entretiens

Chaque semaine indique le budget alloué, les sujets précis traités, la répartition du temps et le livrable ou résultat attendu.

### Semaine 1 : 02/11/2026 au 08/11/2026 (Phase CLF)
- **Budget entretiens :** 60 min (Total semaine : cert 420 min + int 60 min = 480 min / 8 h)
- **Sujets :** Test Diagnostic Initial Python & SQL (Chapitre 1.0).
- **Activités :**  
  - Évaluation Python (30 min) : mutabilité, complexité de recherche dans dict vs list, portées de variables, list comprehensions.
  - Évaluation SQL (30 min) : 3 exercices d'écriture (jointure avec agrégation, filtrage WHERE vs HAVING, sous-requête simple).
- **Résultat attendu :** Score diagnostic formalisé, validation des bases et confirmation de la liste des chapitres élémentaires sautés.

### Semaine 2 : 09/11/2026 au 15/11/2026 (Phase CLF)
- **Budget entretiens :** 60 min (Total semaine : cert 420 min + int 60 min = 480 min / 8 h)
- **Sujets :** Python Fondations Entretien : Complexité Big O & HashMaps (Chapitres 1.6 & 1.5).
- **Activités :**  
  - Chapitre 1.6 : Analyse de complexité algorithmique temporelle et spatiale Big O (30 min).
  - Chapitre 1.5 : Tri, recherche & HashMaps, patterns Two Pointers (Two Sum en O(n)) (30 min).
- **Résultat attendu :** 2 fonctions écrites en direct et commentées avec justification de leur complexité Big O (respect strict du budget de 60 min).

### Semaine 3 : 16/11/2026 au 22/11/2026 (Phase CLF - Examen CLF-C02 le 20/11)
- **Budget entretiens :** 60 min (Total semaine : cert 420 min + int 60 min = 480 min / 8 h)
- **Sujets :** Python Objet & Générateurs (Chapitres 1.10 & 1.9).
- **Activités :**  
  - Chapitre 1.10 (Réintégré) : POO Python appliquée à la data (`dataclasses`, classes, encapsulation) (30 min).
  - Chapitre 1.9 : Générateurs, itérateurs et traitement de flux sans saturer la RAM (`yield`) (30 min).
- **Résultat attendu :** Script de pipeline avec classe métier propre et générateur de flux avec mesure d'empreinte mémoire.

### Semaine 4 : 23/11/2026 au 29/11/2026 (Phase DEA - Début)
- **Budget entretiens :** 120 min (Total semaine : cert 360 min + int 120 min = 480 min / 8 h)
- **Sujets :** SQL Analytique : CTE Complexes & Window Functions (Chapitres 2.6, 2.7 & 2.8).
- **Activités :**  
  - Chapitre 2.6 : CTE modulaires et récursives pour structurer les requêtes (30 min).
  - Chapitre 2.7 : Syntaxe des Window Functions (`OVER`, `PARTITION BY`, `ORDER BY`, `ROWS BETWEEN`) (45 min).
  - Chapitre 2.8 : `ROW_NUMBER` & Déduplication stricte sur horodatage (45 min).
- **Résultat attendu :** 4 requêtes analytiques résolues sur base de données d'entraînement.

### Semaine 5 : 30/11/2026 au 06/12/2026 (Phase DEA)
- **Budget entretiens :** 120 min (Total semaine : cert 360 min + int 120 min = 480 min / 8 h)
- **Sujets :** SQL Analytique Avancé & Fonctions Temporelles (Chapitres 2.9, 2.11, 2.12 & 2.14).
- **Activités :**  
  - Chapitre 2.9 : `RANK` vs `DENSE_RANK` pour classements Top-N avec égalités (30 min).
  - Chapitre 2.11 : `LAG` et `LEAD` pour calculs de deltas temporels (30 min).
  - Chapitre 2.12 : `CASE WHEN` avancé et pivot conditionnel de lignes en colonnes (30 min).
  - Chapitre 2.14 : Dates, fuseaux horaires et fenêtres glissantes (30 min).
- **Résultat attendu :** 4 requêtes business résolues (analyse de rétention, deltas de commandes, reporting pivoté).

### Semaine 6 : 07/12/2026 au 13/12/2026 (Phase DEA)
- **Budget entretiens :** 120 min (Total semaine : cert 360 min + int 120 min = 480 min / 8 h)
- **Sujets :** Modélisation Dimensionnelle, SCD2 & SQL Avancé (Chapitres 2.21, 2.23 & 2.24).
- **Activités :**  
  - Chapitre 2.21 (Réintégré) : Modélisation dimensionnelle de Kimball (Schéma en étoile vs flocon, tables de faits et dimensions) (40 min).
  - Chapitre 2.23 (Réintégré) : Slowly Changing Dimensions (SCD Type 1 et SCD Type 2 avec dates de validité) (40 min).
  - Chapitre 2.24 : SQL avancé pour Data Engineering : problème classique des îles et des trous (Gaps and Islands) (40 min).
- **Résultat attendu :** Modèle dimensionnel documenté avec requête SQL de gestion d'historique SCD2 et détection de sessions continues.

### Semaine 7 : 14/12/2026 au 20/12/2026 (Phase DEA)
- **Budget entretiens :** 120 min (Total semaine : cert 360 min + int 120 min = 480 min / 8 h)
- **Sujets :** SQL Performance : Indexation, Clés de Cluster & Optimisation (Chapitres 2.17, 2.18 & 2.19).
- **Activités :**  
  - Chapitre 2.17 : Indexation (B-Tree, Hash, GIN) et clés de partition/cluster Snowflake (30 min).
  - Chapitre 2.18 : Lecture d'un plan d'exécution (`EXPLAIN ANALYZE`), détection de Seq Scan et shuffles (45 min).
  - Chapitre 2.19 : Query Tuning, suppression de spillage disque et pushdown de filtres (45 min).
- **Résultat attendu :** Diagnostic d'une requête lente et réécriture démontrant un gain mesurable de temps d'exécution.

### Semaine 8 : 21/12/2026 au 27/12/2026 (Semaine de Fêtes Allégée)
- **Budget entretiens :** 120 min (Total semaine allégée : cert 240 min + int 120 min = 360 min / 6 h)
- **Sujets :** Python Pratique & Qualité Logicielle (Chapitres 1.11, 1.12, 1.14 & 1.16).
- **Activités :**  
  - Chapitre 1.11 : Décorateurs & Closures (retry automatique, timer) (30 min).
  - Chapitre 1.12 : Context Managers personnalisés (`with`, `__enter__`, `__exit__`) (30 min).
  - Chapitre 1.14 : Typage moderne et validation Pydantic (30 min).
  - Chapitre 1.16 : Tests unitaires avec `pytest`, fixtures et mocks de bases de données (30 min).
- **Résultat attendu :** Module utilitaire testé et validé répondant aux critères des tests techniques d'embauche.

### Semaine 9 : 28/12/2026 au 03/01/2027 (Semaine de Fêtes Allégée)
- **Budget entretiens :** 120 min (Total semaine allégée : cert 240 min + int 120 min = 360 min / 6 h)
- **Sujets :** Data Engineering : Architectures, Formats & Qualité (Chapitres 3.1, 3.2, 3.6 & 3.8).
- **Activités :**  
  - Chapitre 3.1 : ETL vs ELT : critères de choix et compromis architecturaux (30 min).
  - Chapitre 3.2 : Batch vs Streaming : critères de bascule vers le temps réel (30 min).
  - Chapitre 3.6 : Architecture Lakehouse & formats de tables ouverts (Apache Iceberg, Delta Lake, garanties ACID) (30 min).
  - Chapitre 3.8 : Data Quality : détection d'anomalies, Great Expectations et circuit breakers (30 min).
- **Résultat attendu :** Grille d'évaluation architecturale prête pour soutenir des choix techniques en entretien de System Design.

### Semaine 10 : 04/01/2027 au 10/01/2027 (Phase DEA)
- **Budget entretiens :** 120 min (Total semaine : cert 360 min + int 120 min = 480 min / 8 h)
- **Sujets :** Data Engineering Distribué : Spark, Kafka & Orchestration (Chapitres 3.10, 3.12 & 3.18).
- **Activités :**  
  - Chapitre 3.10 : Optimisation Spark : partitions, shuffles, data skew et Broadcast Hash Join (40 min).
  - Chapitre 3.12 : Streaming Kafka : sémantiques de livraison (At-Least-Once, Exactly-Once) et consumer groups (40 min).
  - Chapitre 3.18 : Conception d'orchestration : gestion des pannes dans Airflow, retries et backfilling (40 min).
- **Résultat attendu :** 3 cas pratiques de résolution d'incidents distribués résolus et documentés.

### Semaine 11 : 11/01/2027 au 17/01/2027 (Phase DEA - Examens Blancs)
- **Budget entretiens :** 60 min (Total semaine : cert 450 min + int 60 min = 510 min / 8 h 30)
- **Sujets :** Data Engineering : Idempotence Absolue des Pipelines (Chapitre 3.17).
- **Activités :** Conception de pipelines ré-exécutables sans effets de bord (stratégies d'upsert, partition overwriting, clés de déduplication).
- **Résultat attendu :** Schéma d'ingestion garantissant zéro doublon après trois crashs consécutifs.

### Semaine 12 : 18/01/2027 au 24/01/2027 (Phase DEA - Examens Blancs)
- **Budget entretiens :** 60 min (Total semaine : cert 480 min + int 60 min = 540 min / 9 h)
- **Sujets :** Data Engineering System Design 1 (Chapitre 3.26).
- **Activités :** Étude de cas type entretien : Concevoir un pipeline d'ingestion et de transformation de 10 millions d'événements par jour (dimensionnement des clusters, stockage S3/Iceberg, chargement Snowflake).
- **Résultat attendu :** Diagramme d'architecture complet soutenu à l'oral avec justification des trade-offs de coût et latence.

### Semaine 13 : 25/01/2027 au 31/01/2027 (Phase DEA - Dernière Ligne Droite)
- **Budget entretiens :** 60 min (Total semaine : cert 480 min + int 60 min = 540 min / 9 h)
- **Sujets :** Data Engineering System Design 2 (Chapitre 3.27).
- **Activités :** Étude de cas type entretien : Gestion des données arrivant en retard (Late Data), watermarking et tables de rejet (Dead Letter Queues).
- **Résultat attendu :** Stratégie documentée de réconciliation des flux temps réel et batch.

### Semaine 14 : 01/02/2027 au 07/02/2027 (Phase DEA - Examen DEA le 04 ou 05/02)
- **Budget entretiens :** 60 min (Total semaine : cert 480 min + int 60 min = 540 min / 9 h)
- **Sujets :** Entretien Comportemental & Pitch de Parcours (Module 7).
- **Activités :** Préparation du pitch professionnel de 3 minutes (diplôme ingénieur EPITA, alternance Data/IA, SnowPro Core, DEA-C01) et 4 histoires STAR structurées.
- **Résultat attendu :** Pitch fluide et réponses percutantes sur les situations de gestion de crise et de travail en équipe.

### Semaine 15 : 08/02/2027 au 14/02/2027 (Phase dbt - Lancement)
- **Budget entretiens :** 120 min (Total semaine : cert 360 min + int 120 min = 480 min / 8 h)
- **Sujets :** APIs & Fondations AI Engineering (Chapitres 1.22, 4.3 & 4.6).
- **Activités :**  
  - Chapitre 1.22 : FastAPI asynchrone (`async/await`) et streaming de réponses (40 min).
  - Chapitre 4.3 : Architecture Transformers & mécanisme de self-attention (40 min).
  - Chapitre 4.6 : Embeddings, distances vectorielles et espaces de projection (40 min).
- **Résultat attendu :** Mini-service API exposant un endpoint d'encodage de texte en vecteurs.

### Semaine 16 : 15/02/2027 au 21/02/2027 (Phase dbt)
- **Budget entretiens :** 120 min (Total semaine : cert 360 min + int 120 min = 480 min / 8 h)
- **Sujets :** AI Engineering : Indexation Vectorielle & Architecture RAG (Chapitres 4.7, 4.8 & 4.9).
- **Activités :**  
  - Chapitre 4.7 : Bases vectorielles et indexation approximative HNSW et IVF (40 min).
  - Chapitre 4.8 : Architecture RAG de bout en bout (ingestion, vectorisation, synthèse) (40 min).
  - Chapitre 4.9 : Stratégies de Chunking (fixe, glissant, sémantique) (40 min).
- **Résultat attendu :** Schéma d'architecture RAG prêt à être soutenu en entretien technique d'AI Engineer.

### Semaine 17 : 22/02/2027 au 28/02/2027 (Phase dbt)
- **Budget entretiens :** 120 min (Total semaine : cert 360 min + int 120 min = 480 min / 8 h)
- **Sujets :** AI Engineering : Reranking, Recherche Hybride & Guardrails (Chapitres 4.11, 4.16 & 4.19).
- **Activités :**  
  - Chapitre 4.11 : Recherche hybride (BM25 + Dense) et Cross-Encoder reranking (40 min).
  - Chapitre 4.16 : Évaluation quantitative RAG (Framework Ragas : fidélité, pertinence) (40 min).
  - Chapitre 4.19 : Sécurité des modèles, prompt injection et guardrails (NeMo, Llama Guard) (40 min).
- **Résultat attendu :** Pipeline de prompt engineering sécurisé avec métriques d'évaluation formalisées.

### Semaine 18 : 01/03/2027 au 07/03/2027 (Phase dbt)
- **Budget entretiens :** 120 min (Total semaine : cert 360 min + int 120 min = 480 min / 8 h)
- **Sujets :** AI Engineering en Production & Fiches Machine Learning (Chapitre 4.24 & Module 5).
- **Activités :**  
  - Chapitre 4.24 : Étude de cas System Design IA : Assistant documentaire d'entreprise en production (scale, cache sémantique, quotas) (60 min).
  - Module 5 (Fiches mémo 5.1 à 5.5) : Machine Learning Essentials (algorithmes supervisés, métriques critiques, surapprentissage, données déséquilibrées, dérive MLOps) (60 min).
- **Résultat attendu :** Dossier d'architecture IA complet et validation des réponses types aux 10 questions classiques de ML.

### Semaine 19 : 08/03/2027 au 14/03/2027 (Phase dbt)
- **Budget entretiens :** 120 min (Total semaine : cert 360 min + int 120 min = 480 min / 8 h)
- **Sujets :** Software Engineering Essentials & Live Coding Python (Module 6 & Module 7).
- **Activités :**  
  - Module 6 (Fiches mémo 6.1 à 6.5) : Software Engineering Essentials (Dockerfile multi-stage, CI/CD data, logging JSON, réseau VPC, clean code) (60 min).
  - Module 7 (Format B) : Live Coding Python chronométré (parsing de flux, algorithmes sur chaînes et dictionnaires) (60 min).
- **Résultat attendu :** 2 exercices de code validés sous contrainte de temps et maîtrise des fiches d'ingénierie logicielle.

### Semaine 20 : 15/03/2027 au 21/03/2027 (Phase dbt - Examen dbt le 19/03)
- **Budget entretiens :** 60 min (Total semaine : cert 480 min + int 60 min = 540 min / 9 h)
- **Sujets :** Valorisation du Projet dbt pour les Entretiens Techniques (Module 7).
- **Activités :** Préparation de la soutenance technique du projet GitHub dbt sur Snowflake (staging, intermediate, marts, tests dbt, documentation, Slim CI).
- **Résultat attendu :** Support de présentation du projet et réponses prêtes aux 5 questions pièges sur dbt en entretien.

### Semaine 21 : 22/03/2027 au 28/03/2027 (Réserve 1 - Sprint Final Entretiens)
- **Budget entretiens :** 240 min (Total semaine : marge cert 240 min + int 240 min = 480 min / 8 h)
- **Sujets :** Grand Chelem Live Coding & System Design Data (Module 7).
- **Activités :**  
  - Session 1 (80 min) : Live Coding SQL intensif (3 requêtes complexes de niveau Hard sur DataLemur).
  - Session 2 (80 min) : Live Coding Python intensif (structures avancées, générateurs, programmation objet).
  - Session 3 (80 min) : System Design Data & IA : conception au tableau blanc d'une architecture globale.
- **Résultat attendu :** Automatismes parfaits et vitesse d'exécution consolidée en conditions réelles.

### Semaine 22 : 29/03/2027 au 04/04/2027 (Réserve 2 - Veille Fin de Contrat le 02/04)
- **Budget entretiens :** 240 min (Total semaine : 240 min = 4 h pour finaliser le départ et les candidatures)
- **Sujets :** Simulation d'Entretiens Finaux & Négociation CDI.
- **Activités :**  
  - Simulation d'un entretien technique complet de 60 minutes avec debrief immédiat (90 min).
  - Revue des candidatures envoyées, préparation des questions au manager/recruteur (90 min).
  - Négociation salariale et positionnement du profil ingénieur EPITA certifié (60 min).
- **Résultat attendu :** Candidat 100 % opérationnel, confiant et prêt pour les entretiens finaux d'embauche.

---

## 2. Spécification Formelle du Moteur de Replanification

### 2.1 Principes directeurs non négociables
1. **Zéro effet domino :** Une séance ratée ne décale JAMAIS l'ensemble du planning sur les 22 semaines.
2. **Priorité absolue à l'examen le plus proche :** Les révisions de certification en phase critique priment sur l'entraînement d'entretiens.
3. **Plafond hebdomadaire strict :** La charge d'une semaine de rattrapage ne peut JAMAIS dépasser **10 heures réelles (600 minutes)** au total.
4. **Sacrifice méthodique du « bonus » avant le « core » :** Les tâches facultatives sont supprimées immédiatement sans être reportées.
5. **Transparence totale des abandons :** Tout élément non rattrapé est archivé avec un avertissement explicite.

### 2.2 Algorithme de replanification (Pseudo-code formel)

```text
ALGORITHME ReplanifierSemaine(SemaineCourante, TachesNonRealisees, ProchaineSemaine) :
    ENTRÉES :
        SemaineCourante : Objet { semaine_id, date_fin, tasks_done, tasks_missed }
        TachesNonRealisees : Liste de Tâches non effectuées
        ProchaineSemaine : Objet { semaine_id, cert_budget_min, interview_budget_min, tasks }
    CONSTANTES :
        PLAFOND_MAX_MINUTES = 600  // 10 heures maximum par semaine
        SEMAINE_FETES_MAX = 360     // 6 heures maximum en semaine de fêtes

    DÉBUT
        // 1. Catégorisation et filtrage immédiat des tâches non réalisées
        TachesCoreARattraper = []
        TachesBonusAbandonnees = []

        POUR CHAQUE tache DANS TachesNonRealisees FAIRE
            SI tache.priorite == "bonus" ALORS
                tache.statut = "ABANDONNÉE"
                tache.motif = "Suppression automatique pour préserver le budget temps"
                AJOUTER tache A TachesBonusAbandonnees
            SINON SI tache.priorite == "core" ALORS
                AJOUTER tache A TachesCoreARattraper
            FIN SI
        FIN POUR

        // 2. Calcul du budget disponible dans la prochaine semaine
        PlafondSemaine = ProchaineSemaine.est_semaine_fetes ? SEMAINE_FETES_MAX : PLAFOND_MAX_MINUTES
        ChargeInitiale = CalculerMinutesTotales(ProchaineSemaine.tasks)
        MargeDisponible = PlafondSemaine - ChargeInitiale

        // 3. Absorption prioritaire des tâches Core
        TachesReplanifiees = []
        TachesCoreSacrifiees = []

        POUR CHAQUE tache DANS TachesCoreARattraper FAIRE
            SI tache.duree_estimee <= MargeDisponible ALORS
                tache.statut = "REPLANIFIÉE"
                tache.semaine_cible = ProchaineSemaine.semaine_id
                AJOUTER tache A ProchaineSemaine.tasks
                MargeDisponible = MargeDisponible - tache.duree_estimee
                AJOUTER tache A TachesReplanifiees
            SINON
                // Si la prochaine semaine est déjà à saturation (ex. révision d'examen)
                // Chercher si la tâche est une certification ou un entretien
                SI tache.type == "entretien" ALORS
                    // On compresse le chapitre en fiche mémo ou on le reporte en semaines de réserve (S21/S22)
                    tache.statut = "COMPRESSÉE_EN_FICHE"
                    tache.duree_estimee = 15 // Réduction à une fiche mémo express
                    SI tache.duree_estimee <= MargeDisponible ALORS
                        AJOUTER tache A ProchaineSemaine.tasks
                        MargeDisponible = MargeDisponible - tache.duree_estimee
                        AJOUTER tache A TachesReplanifiees
                    SINON
                        tache.statut = "RESERVEE_SEMAINE_21"
                        AJOUTER tache A TachesCoreSacrifiees
                    FIN SI
                SINON
                    // Pour une tâche de certification Core indispensable
                    // On sacrifie une tâche bonus de la ProchaineSemaine pour libérer de la marge
                    TacheBonusASacrifier = TrouverTacheBonus(ProchaineSemaine.tasks)
                    SI TacheBonusASacrifier != NUL ALORS
                        RETIRER TacheBonusASacrifier DE ProchaineSemaine.tasks
                        AJOUTER TacheBonusASacrifier A TachesBonusAbandonnees
                        MargeDisponible = MargeDisponible + TacheBonusASacrifier.duree_estimee
                        AJOUTER tache A ProchaineSemaine.tasks
                        MargeDisponible = MargeDisponible - tache.duree_estimee
                        AJOUTER tache A TachesReplanifiees
                    SINON
                        // Alerte critique : décalage d'examen recommandé
                        SIGNALER_ALERTE_DECALAGE_EXAMEN(tache)
                    FIN SI
                FIN SI
            FIN SI
        FIN POUR

        // 4. Génération du rapport de replanification
        RAPPORT = {
            "charge_reelle_prochaine_semaine": PlafondSemaine - MargeDisponible,
            "taches_replanifiees": TachesReplanifiees,
            "taches_abandonnees": TachesBonusAbandonnees,
            "taches_differees_reserve": TachesCoreSacrifiees
        }
        RETOURNER RAPPORT
    FIN
```

---

## 3. Les 6 Scénarios Chiffrés de Test du Moteur

### Scénario 1 : Séance d'entretien ratée (Semaine 5, 60 minutes perdues)
- **Situation initiale :** En semaine 5, imprévu professionnel le jeudi soir. La séance de 60 min sur la déduplication SQL n'a pas pu être faite.
- **Budget prévu S6 :** Cert 360 min + Entretien 120 min = 480 min (8 h). Plafond max = 600 min (marge de 120 min).
- **Application du moteur :**
  1. La tâche est de priorité « Core » (déduplication SQL essentielle).
  2. Marge disponible en S6 = 600 - 480 = 120 min.
  3. La séance de 60 min est injectée en Semaine 6 sans rien supprimer.
  4. Nouvelle charge S6 = 540 min (9 h). Respect strict du plafond de 10 h.
- **Verdict :** Résolu sans aucun sacrifice ni décalage global.

### Scénario 2 : Semaine entière ratée pour maladie (Semaine 6, 8 heures perdues)
- **Situation initiale :** Grippe en Semaine 6 : zéro heure travaillée. Tâches manquées : cours Kinesis/MSK (260 min Core), micro-cert streaming (150 min Bonus), entretien SQL (120 min Core).
- **Application du moteur :**
  1. Sacrifice immédiat : la micro-certification Skill Builder streaming (150 min Bonus) est **définitivement abandonnée**.
  2. Tâches Core à sauver : Kinesis/MSK (260 min) et SQL (120 min). Total = 380 min.
  3. Analyse de Semaine 7 : charge initiale = 455 min (335 cert core + 120 int). Marge sur 600 min = 145 min.
  4. En S7, la micro-certification lakehouse de S7 (120 min Bonus) est **immédiatement supprimée**, libérant 120 min supplémentaires (marge totale = 265 min).
  5. Les 260 min de Kinesis/MSK de S6 sont intégrées en S7. La charge S7 passe à 600 min (10 h tout pile).
  6. Les 120 min d'entretien SQL de S6 sont réparties en 2 fiches condensées de 30 min réinjectées en Semaines 8 et 9 (semaines de fêtes allégées qui disposaient de marge).
- **Verdict :** Aucun décalage de la date du DEA-C01. Les bonus ont sauté, le cœur est sauvé.

### Scénario 3 : Semaine d'examen (Semaine 14 du DEA-C01)
- **Situation initiale :** Semaine 14, examen DEA-C01 fixé au vendredi 5 février. Charge cert prévue = 475 min, entretien prévu = 60 min. Total = 535 min. Fatigue ressentie le mercredi.
- **Application du moteur :**
  1. Priorité absolue : Réussite de l'examen DEA-C01.
  2. L'examen blanc de Nikolai Schuler (190 min Bonus) prévu en réserve est verrouillé à « Annulé ».
  3. La séance d'entretien comportemental de 60 min est réduite à une relecture légère des fiches STAR de 20 min la veille au soir. Les 40 min restantes sont transformées en repos complet.
- **Verdict :** Le candidat arrive frais à l'examen sans culpabilité de travail en retard.

### Scénario 4 : Retard sur le DEA et score aux blancs inférieur à 80 % (Semaine 13)
- **Situation initiale :** En semaine 13, Auren obtient 72 % au test blanc Maarek v1.0 (seuil cible fixé à 80 %).
- **Application du moteur :**
  1. Déclenchement de la clause de sauvegarde DEA prévue dans `planning_hebdo.json`.
  2. L'examen DEA est décalé d'une semaine (du vendredi 5 février au vendredi 12 février, semaine 15).
  3. L'examen dbt n'est pas impacté car il bénéficie de 2 semaines de réserve en fin de parcours (semaines 21 et 22).
  4. Les 120 min d'entretien de la semaine 15 sont temporairement gelées pour absorber le repassage des tests blancs DEA.
- **Verdict :** La priorité 1 (DEA) est sécurisée sans désorganiser la suite grâce à la réserve.

### Scénario 5 : Échec à un examen de certification (Simulation échec DEA le 5 février)
- **Situation initiale :** Échec au DEA-C01 avec un score de 690/1000 (seuil à 720).
- **Application du moteur :**
  1. Application de la politique officielle AWS : 14 jours d'attente obligatoire avant toute nouvelle tentative (repassage possible dès le vendredi 19 février).
  2. Le début de la phase dbt (semaines 15 et 16) est réorganisé :
     - 4 heures par semaine sont allouées au ciblage des faiblesses DEA identifiées sur le score report.
     - Les cours dbt continuent à hauteur de 4 heures par semaine (le projet dbt est légèrement resserré).
  3. Nouveau passage du DEA le vendredi 19 février (semaine 16).
  4. Décalage de l'examen dbt au vendredi 26 mars (semaine 21, sur la première semaine de réserve).
- **Verdict :** Le contrat se terminant le 2 avril (semaine 22), l'ensemble des 3 certifications reste obtenu avant l'échéance du contrat d'alternance.

### Scénario 6 : Semaine de fêtes de fin d'année (Semaine 8, budget allégé à 6 heures)
- **Situation initiale :** Semaine du 21 au 27 décembre. Repas de famille, temps de travail contraint à 360 min (6 h).
- **Application du moteur :**
  1. Charge programmée : Révisions fiches DEA (90 min Core), Questions officielles Skill Builder (80 min Core), OpenSearch/QuickSight (105 min Bonus), Conteneurs ECS/EKS (80 min Bonus), Entretien Python (120 min Core). Total brut théorique = 475 min (dépassement de 115 min du plafond de 360 min).
  2. Filtrage automatique :
     - Les cours OpenSearch/QuickSight (105 min Bonus) et Conteneurs (80 min Bonus) sont **supprimés du planning hebdomadaire** et basculés en simple lecture de documentation si du temps libre apparaît.
  3. Charge Core restante : 90 min (révision) + 80 min (diagnostic Skill Builder) + 120 min (entretien) = 290 min.
  4. Marge résiduelle = 360 - 290 = 70 min de temps tampon ou de repos supplémentaire.
- **Verdict :** Zéro stress, respect strict de la pause familiale et consolidation essentielle réussie.
