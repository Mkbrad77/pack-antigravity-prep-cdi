# Registre des Hypothèses de Travail

**Date de création et de révision :** 31 octobre 2026  
**Auteur :** Antigravity (Chef de projet pédagogique Data & AI Engineering)  
**Projet :** Préparation Intensive Certifications & Recrutement CDI (Auren Moyo)

---

## 1. Hypothèses Générales et Contraintes du Candidat

### H-01 : Disponibilité Hebdomadaire et Gestion du Temps
- **Énoncé :** Auren dispose d'un budget temporel incompressible de 8 à 10 heures par semaine pour mener de front la préparation des certifications et l'entraînement aux entretiens.
- **Périodes particulières :** Les deux semaines de fêtes de fin d'année (semaine 8 du 21 au 27 décembre 2026 et semaine 9 du 28 décembre 2026 au 3 janvier 2027) ont un budget allégé fixé à 6 heures par semaine.
- **Conséquence :** Aucune semaine ne doit planifier plus de 10 heures de travail (ou 6 heures lors des semaines de fêtes). Aucun retard ne doit générer un cumul de dette de travail impossible à résorber.

### H-02 : Profil Technique Initial et Prérequis Validés
- **Énoncé :** Auren est ingénieur diplômé de l'EPITA, actuellement en alternance dans la data et l'intelligence artificielle jusqu'au 2 avril 2027. Il dispose d'un niveau d'anglais technique B2, de bonnes compétences en programmation Python et requêtage SQL, d'une maîtrise certifiée de Snowflake (SnowPro Core validée le 29 octobre 2026), ainsi que des bases de dbt (dbt Fundamentals), du Machine Learning et des LLM.
- **Règle absolue sur les cours :** Nonobstant ces acquis, Auren repart strictement de **0 %** sur tous les cours Udemy et toutes les certifications. Toutes les leçons démarrent dès la leçon numéro 1 (voir H-18 et D-13).
- **Conséquence :** Les notions élémentaires d'informatique (types de données primitifs, boucles élémentaires, requêtes SQL simples de type `SELECT ... FROM ... WHERE`, architecture de base de Snowflake) sont considérées comme acquises pour la partie entretiens, mais les cours vidéo Udemy sont repris dès la première leçon sans faire l'impasse sur aucun contenu.

### H-03 : Objectif de Recrutement CDI et Hiérarchie des Métiers
- **Énoncé :** L'objectif prioritaire absolu est de sécuriser un poste en CDI dès la fin de l'alternance (avril 2027).
- **Ordre de ciblage :**
  1. Priorité 1 : Data Engineer (cœur du marché, volume d'offres le plus important).
  2. Priorité 2 : AI Engineer (forte montée des demandes axées sur les LLM et le RAG).
  3. Poursuite secondaire : Machine Learning Engineer, puis Data Scientist.
- **Conséquence :** Les compétences de modélisation data, pipelines distribués, Cloud AWS, SQL avancé et déploiement de flux d'enrichissement d'IA sont priorisées par rapport aux mathématiques fondamentales du ML ou à l'entraînement de modèles lourds.

---

## 2. Hypothèses Liées aux Examens de Certification

### H-04 : Réduction Financière sur l'Examen DEA-C01
- **Énoncé :** L'obtention de la certification préliminaire AWS Certified Cloud Practitioner (CLF-C02) déclenche l'attribution d'un bon de réduction officiel AWS de 50 % utilisable pour l'examen suivant (DEA-C01).
- **Statut :** Confirmé le 31 octobre 2026 (disponible dans la section "Benefits" du compte AWS Certification dès la publication des résultats de CLF-C02).
- **Impact :** Réduction des frais d'inscription de DEA-C01 de 150 USD à 75 USD.

### H-05 : Prérequis Formels AWS
- **Énoncé :** La certification CLF-C02 n'est pas un prérequis administratif imposé par AWS pour passer DEA-C01.
- **Statut :** Confirmé le 31 octobre 2026. AWS a levé les prérequis formels sur ses examens Associate. Le passage de CLF-C02 reste toutefois retenu pour des raisons pédagogiques (socle cloud global) et financières (voucher 50 %).

### H-06 : Aménagement de Temps pour Candidats Non-Anglophones (ESL +30 Minutes)
- **Énoncé :** AWS accorde une extension permanente de 30 minutes d'examen pour les candidats passant un examen en anglais dans un pays non anglophone ou dont la langue maternelle n'est pas l'anglais.
- **Statut :** Confirmé le 31 octobre 2026. La demande s'effectue via l'option "Request Exam Accommodations" -> "ESL +30 MINUTES" sur le portail AWS Certification, avec approbation automatique immédiate. Elle doit impérativement être demandée avant la prise de rendez-vous sur Pearson VUE.
- **Impact :** CLF-C02 passe de 90 à 120 minutes. DEA-C01 passe de 130 à 160 minutes.

### H-07 : Évolution du Guide d'Examen AWS DEA-C01 (Version v1.1)
- **Énoncé :** Le guide officiel de l'examen DEA-C01 v1.1 intègre explicitement Amazon Bedrock pour l'enrichissement des données et les pipelines d'IA générative dans le domaine du Data Engineering, ainsi qu'OpenSearch, QuickSight et la conteneurisation (ECS/EKS) pour les traitements data.
- **Statut :** Confirmé le 31 octobre 2026.
- **Impact :** Les leçons bonus et modules dédiés à Bedrock et OpenSearch sont intégrés dans le programme de révision DEA-C01.

### H-08 : Conditions de Report de la Certification dbt Analytics Engineering
- **Énoncé :** La certification dbt Labs (passée via la plateforme Webassessor / Kryterion) permet le report de la date d'examen sans frais supplémentaires si la modification est effectuée au minimum 24 heures (ou 72 heures selon le mode en ligne ou en centre) avant l'épreuve.
- **Statut :** Partiellement vérifié le 31 octobre 2026. Le report gratuit au-delà de 24 heures (ou 72 heures en centre physique) est confirmé. En revanche, le montant exact des frais retenus en cas d'annulation tardive à moins de 24 heures et le délai de carence formel au-delà de deux échecs consécutifs restent non vérifiés avec certitude dans la documentation publique de dbt Labs (voir section 2 de RAPPORT_PHASE_1.md).
- **Impact :** La date cible du 19 mars 2027 sert de repère, mais constitue la variable d'ajustement principale en cas de retard sur la préparation de DEA-C01.

---

## 3. Hypothèses Pédagogiques et Environnement d'Exécution

### H-09 : Synergie entre Cours Vidéo et Préparation aux Entretiens
- **Énoncé :** Les cours Udemy (Stéphane Maarek, Zoltan Toth, Amadou Merico) fournissent l'explication théorique et les travaux pratiques d'outillage. L'application locale et les séances d'entretiens n'ont pas pour rôle de rejouer ces vidéos, mais d'exercer le candidat à la restitution active orale et écrite face à des recruteurs (mises en situation, live coding, justification de choix d'architecture).

### H-10 : Absence de Dépendance aux API Externes Payantes
- **Énoncé :** L'ensemble du dispositif pédagogique de l'application locale doit fonctionner sans coût récurrent, sans abonnement, sans modèle de langage externe obligatoire par API payante, et sans compte utilisateur centralisé.
- **Statut :** Conforme aux contraintes du projet. Toute fonctionnalité avancée d'IA dans les phases ultérieures devra être strictement optionnelle (par exemple via des modèles locaux ou l'environnement de développement local).

---

## 4. Hypothèses Techniques de la Phase 2 (Application de Base)

### H-11 : Environnement d'Exécution Local Node.js v24 sous Windows
- **Énoncé :** Le poste Windows d'Auren dispose de Node.js (v24.20.0 vérifié sur la machine) permettant d'exécuter le module natif `node:sqlite` sans chaîne de compilation C++ externe.
- **Statut :** Vérifié et confirmé le 31 octobre 2026.

### H-12 : Date de Référence par Défaut au Lancement du Planning
- **Énoncé :** Le planning débute le lundi 2 novembre 2026 (Semaine 1). Si l'application est ouverte avant le 2 novembre 2026 (par exemple le 31 octobre ou le 1er novembre 2026), elle affiche par défaut la **Semaine 1 (du 2 au 8 novembre 2026)** comme semaine active, tout en permettant de naviguer librement entre les 22 semaines ou de simuler n'importe quelle date courante.
- **Statut :** Implémenté pour garantir le critère de réussite (« je démarre l'application en une commande et je vois ma semaine du 2 novembre avec les vraies tâches »).

### H-13 : Règle de Maîtrise en Répétition Espacée (SM-2)
- **Énoncé :** Aucune notion technique n'est marquée comme « maîtrisée » automatiquement lorsqu'une leçon ou une tâche de cours est cochée. Une carte de révision nécessite au moins 3 répétitions réussies consécutives (`repetitions >= 3`) et un intervalle d'au moins 14 jours (`interval_days >= 14`) via l'algorithme SM-2 pour atteindre le statut « Maîtrisée ».
- **Statut :** Conforme aux exigences pédagogiques de l'Étape C.7.

### H-14 : Seuils d'Indicateurs de Préparation aux Examens (Modifiables)
- **Énoncé :** Les seuils par défaut déterminant le statut « Prêt pour l'examen » sont fixés à :
  - **CLF-C02 :** Score d'au moins **80 %** au dernier examen blanc (seuil officiel AWS : 700/1000).
  - **DEA-C01 :** Score d'au moins **80 %** sur **2 examens blancs consécutifs** (seuil officiel AWS : 720/1000).
  - **dbt Analytics Engineering :** Score d'au moins **75 %** au dernier examen blanc (seuil officiel dbt Labs : 65 %).
- **Statut :** Ces règles sont pré-configurées par défaut et intégralement modifiables par l'utilisateur dans l'écran Réglages.

---

## 5. Hypothèses Techniques et Pédagogiques de la Phase 3 (Contenu des Certifications)

### H-15 : Périmètre Officiel du Guide d'Examen AWS DEA-C01 Version 1.1 (12 décembre 2025)
- **Énoncé :** Le corpus pédagogique DEA-C01 intègre rigoureusement les nouveautés du guide officiel v1.1 : Amazon Bedrock (enrichissement LLM dans les pipelines data), Amazon S3 Tables (support managé Iceberg), Amazon Q Developer, Amazon Aurora (Serverless v2 et cluster data), Amazon Kendra, AWS Data Exchange, formats de tables ouverts (Apache Iceberg, Apache Hudi, Delta Lake), index vectoriels (HNSW, IVF sur OpenSearch et pgvector), et catalogues unifiés (SageMaker Catalog, Unified Studio). Les services dépréciés du guide (Cloud9, CodeCommit, SCT) sont exclus des questions de certification.
- **Statut :** Vérifié dans la documentation officielle AWS au 31 octobre 2026.

### H-16 : Traçabilité et Validation des Questions à Choix Multiples
- **Énoncé :** Chaque question de la banque (150 CLF, 300 DEA, 150 dbt) possède une documentation source officielle vérifiée au 31 octobre 2026. Toute affirmation n'ayant pas pu être directement vérifiée dans la documentation publique AWS ou dbt Labs est signalée « non vérifié ». Aucune question issue de braindump ou recopiée d'un cours payant n'est admise.
- **Statut :** Validé par le script de conformité et l'audit qualité par échantillonnage (100 % de conformité).

### H-17 : Modélisation des Scores d'Examens Blancs
- **Énoncé :** Pour les examens AWS (CLF-C02 et DEA-C01), le score est calculé et affiché à la fois en pourcentage exact et sur l'échelle officielle AWS de 100 à 1000 points (formule linéaire : `Score = 100 + 900 * (Bonnes réponses / Total)`). Pour dbt Analytics Engineering, le score est exprimé en pourcentage avec le seuil officiel de 65 % (et seuil de confiance visé à 75 %).
- **Statut :** Implémenté dans le composant `CertificationsView.tsx`.

### H-18 : Règle Fondamentale de Départ Strict à 0 % sur les Cours Udemy
- **Énoncé :** L'ensemble des 5 cours Udemy (Amadou Merico, Stéphane Maarek et Frank Kane, Nikolai Schuler, Zoltan C. Toth, Daniel Weigel) démarre à **0 % d'avancement**. Aucune leçon n'est pré-validée. Toutes les leçons démarrent dès la numéro 1 dans le catalogue (`data/catalogue_formations.json`), dans le planning hebdomadaire (`data/planning_hebdo.json`), et dans la base SQLite locale (`storage/user_data.sqlite`).
- **Statut :** Règle permanente gravée dans `docs/DECISIONS.md` (D-13), `AGENTS.md`, `GEMINI.md`, `README.md` et dans tous les fichiers `prompts/PROMPT_*.md`.



