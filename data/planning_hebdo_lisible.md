# Planning hebdomadaire détaillé : CLF-C02, DEA-C01, dbt (2 novembre 2026 au 2 avril 2027)

Ce planning remplace le fichier `plan-aws-clf-dea-dbt-nov2026-mars2027.md` envoyé plus tôt. Les dates des examens CLF (20 novembre) et DEA (4 ou 5 février) restent les mêmes. Deux changements : les thèmes hebdomadaires du DEA sont réordonnés selon les leçons réelles de tes cours, et l'examen dbt passe du 12 au 19 mars, car les deux cours dbt et le projet représentent environ 34 heures de travail.

## 1. Repères

| Examen | Date visée | Fenêtre de repli |
|---|---|---|
| AWS Cloud Practitioner CLF-C02 | vendredi 20 novembre 2026 | semaine du 23 novembre |
| AWS Certified Data Engineer Associate DEA-C01 | jeudi 4 ou vendredi 5 février 2027 | 12 puis 19 février |
| dbt Analytics Engineering | vendredi 19 mars 2027 | 26 mars puis 2 avril au plus tard |

Fin du contrat : 2 avril 2027.

## 2. Comment lire les durées

- Vidéo : durée affichée par Udemy ou Skill Builder, pour les leçons non terminées.
- Temps estimé : vidéo multipliée par un coefficient (CLF français 1,15 ; DEA principal 1,4 ; dbt principal 1,4 ; dbt examen 1,2) plus 10 à 30 minutes par quiz ou exercice. Il inclut les pauses, les notes et les laboratoires.
- Examens blancs : 190 minutes estimées pour un test de 65 questions (conditions réelles puis correction). Nombre de questions et durées à confirmer dans Udemy.
- Priorité « core » : à faire. Priorité « bonus » : première à sauter en cas de retard.

## 3. Cours utilisés

| Alias | Cours | Rôle |
|---|---|---|
| Udemy FR CLF (Merico) | AWS Certified Cloud Practitioner CLF-C02 2026 (en français) - Amadou Merico | CLF : cours principal (départ à 0 %, leçons 1 à 203) |
| Udemy DEA principal (Maarek et Kane) | AWS Certified Data Engineer Associate 2026 - Hands On! - Stéphane Maarek et Frank Kane | DEA : cours principal |
| Udemy DEA secondaire (Schuler) | Complete AWS Certified Data Engineer Associate - DEA-C01 - Nikolai Schuler | DEA : examen blanc et rattrapage ciblé seulement |
| Udemy dbt principal (Toth) | The Complete dbt Bootcamp: Zero to Hero + Certification Prep - Zoltan C. Toth | dbt : cours principal et pratique (départ à 0 %, leçons 1 à 123 et 162 à 164) |
| Udemy dbt examen (Weigel) | The Complete dbt Certification Course - Daniel Weigel | dbt : sujets absents du cours Toth et examen blanc |
| Udemy Practice Tests DEA | Practice Tests AWS Certified Data Engineer Associate (6 tests, 390 questions) | DEA : examens blancs |
| AWS Skill Builder | Exam Prep Overview, Domain Reviews, Official Practice Question Sets, micro-certifications | CLF et DEA : ressources officielles gratuites |

## 4. Totaux par phase

| Phase | Semaines | Heures core | Heures bonus |
|---|---|---|---|
| CLF | 1 à 3 | 22 h 10 | 3 h 45 |
| DEA | 4 à 14 | 60 h 20 | 14 h 50 |
| dbt | 15 à 20 | 34 h 10 | 1 h 55 |
| Réserve | 21 à 22 | 8 h | 0 h |

## 5. Budget entraînement aux entretiens (hors certifications)

Chaque semaine inclut un budget d'entraînement aux entretiens (ligne « Budget » de chaque semaine). La phase 1 de l'application affine les sujets. Répartition indicative :

| Période | Semaines | Thèmes |
|---|---|---|
| 2 nov au 29 nov | 1 à 4 | Python (structures de données, générateurs, complexité) et SQL fondamental (jointures, agrégations, CTE) |
| 30 nov au 3 jan | 5 à 9 | SQL avancé (fonctions de fenêtre, déduplication, EXPLAIN) et Python (POO, concurrence, tests pytest) |
| 4 jan au 7 fév | 10 à 14 | System Design Data Engineering (idempotence, incrémental, batch vs streaming, Lakehouse Iceberg) |
| 8 fév au 21 mars | 15 à 20 | AI Engineering & LLM (RAG, chunking, recherche hybride, agents, évaluation RAGAS), ML Engineering et MLOps |
| 22 mars au 2 avril | 21 et 22 | Simulations complètes d'entretiens techniques chronométrés et consolidation System Design |

## 6. Semaine par semaine

### Semaine 1 : du 02/11/2026 au 08/11/2026 (CLF)
**CLF-C02 : fondamentaux cloud, calcul, réseau, stockage et bases de données (départ à 0 %)**

Budget : certification 8 h + entretiens 1 h = 9 h. Tâches core : 8 h. Bonus : 0 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Préparation | Compte AWS : alerte de facturation à 5 €, MFA sur le compte racine, réservation de l'examen CLF-C02 pour le vendredi 20 novembre, échéance dans le planificateur Udemy |  | 0 h 30 | Créer ou vérifier le compte AWS (leçon 14 du cours). |
| core | AWS Skill Builder | Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02 - English) : Panorama officiel de l'examen et des 4 domaines | 20 min | 0 h 20 |  |
| core | Udemy FR CLF (Merico) | leçons 1 à 60 : Fondamentaux du Cloud AWS, infrastructure globale, IAM de base, EC2, AMI, Security Groups, ELB et Auto Scaling (quiz 1 à 5) | 350 min | 3 h 10 | Priorité aux concepts et quiz 1 à 5 ; labs console en lecture accélérée x1.5. |
| core | Udemy FR CLF (Merico) | leçons 61 à 86 : Réseau AWS : VPC, sous-réseaux, connectivité hybride, Route 53, CloudFront, Global Accelerator, Outposts (quiz 6 à 8) | 195 min | 1 h 50 |  |
| core | Udemy FR CLF (Merico) | leçons 87 à 120 : Stockage (S3, EBS, EFS, FSx) et Bases de données (RDS, Aurora, DynamoDB, DMS, ElastiCache) (quiz 9 à 11) | 227 min | 2 h 10 | Inclut les fondamentaux S3 utiles pour la suite (DEA-C01). |

Point de contrôle : Fin de semaine : leçons 1 à 120 et quiz 1 à 11 du cours français terminés (fondamentaux, EC2, VPC, S3 et bases de données).

### Semaine 2 : du 09/11/2026 au 15/11/2026 (CLF)
**CLF-C02 : analytique, sécurité (30 %), surveillance, facturation et architecture**

Budget : certification 8 h + entretiens 1 h = 9 h. Tâches core : 7 h 40. Bonus : 0 h 40.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy FR CLF (Merico) | leçons 121 à 136 : Analytique et IA/ML (Athena, Glue, EMR, Redshift, Kinesis, QuickSight) puis intégration SQS et SNS (quiz 12 à 14) | 84 min | 1 h 35 |  |
| core | Udemy FR CLF (Merico) | leçons 137 à 157 : Sécurité et conformité (30 % de l'examen) : responsabilité partagée, IAM, Organizations, Config, GuardDuty, Shield, WAF, KMS, Secrets Manager, Macie, Artifact (quiz 15 et 16) | 160 min | 2 h 45 |  |
| core | Udemy FR CLF (Merico) | leçons 169 à 188 : Surveillance (CloudWatch, CloudTrail, Trusted Advisor) et Tarification, Billing, Cost Explorer, Budgets, supports AWS (quiz 19 et 20) | 123 min | 1 h 55 |  |
| core | Udemy FR CLF (Merico) | leçons 189 à 199 : Stratégies de migration, Snow, Transfer Family, Disaster Recovery, Well-Architected Framework et CAF (quiz 21 et 22) | 77 min | 1 h 25 |  |
| bonus | Udemy FR CLF (Merico) | leçons 158 à 168 : Développer et déployer sur AWS (CloudFormation, CDK, CodePipeline) (2 quiz, 0 exercices) | 50 min | 0 h 40 |  |

Point de contrôle : Dimanche 15 novembre : tout le cours français (leçons 1 à 199, hors bonus) est terminé avant la semaine d'examens blancs.

### Semaine 3 : du 16/11/2026 au 22/11/2026 (CLF)
**CLF-C02 : examens blancs et passage de l'examen**

Budget : certification 7 h + entretiens 1 h = 8 h. Tâches core : 6 h 30. Bonus : 3 h 05. (EXAMEN le 20/11/2026)

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy FR CLF (Merico) | leçons 200 à 203 : Comment planifier l'examen, rappel du programme | 12 min | 0 h 15 |  |
| core | Examen blanc (Quiz 23 du cours Merico) | Examen pratique 1 (25 questions) du cours français, corrigé et erreurs notées |  | 0 h 55 |  |
| core | Examen blanc (Quiz 24 du cours Merico) | Examen pratique 2 (25 questions) et correction |  | 0 h 55 |  |
| core | Examen blanc (Quiz 25 du cours Merico) | Examen pratique 3 (25 questions) et correction |  | 0 h 55 |  |
| core | AWS Skill Builder | Official Practice Question Set: AWS Certified Cloud Practitioner (CLF-C02 - English) : Jeu officiel de questions d'entraînement CLF-C02 (référence la plus proche de l'examen réel) | 30 min | 1 h |  |
| core | Examen officiel | EXAMEN AWS CLOUD PRACTITIONER CLF-C02 : vendredi 20 novembre |  | 2 h 30 | Durée indicative, à confirmer sur la page officielle de l'examen. |
| bonus | Examen blanc (Quiz 26 du cours Merico) | Examen pratique 4 (25 questions) et correction |  | 0 h 55 |  |
| bonus | AWS Skill Builder | Domain 1 Review: AWS Certified Cloud Practitioner (CLF-C02 - English) : Revue du domaine le plus faible (choisir selon les erreurs : domaine 1, 2, 3 ou 4) | 65 min | 1 h 15 | Choisir un seul domaine, le plus faible. |
| bonus | Examen blanc (Quiz 27 du cours Merico) | Examen pratique 5 (25 questions), réserve en cas de score faible |  | 0 h 55 |  |

Point de contrôle : Seuil conseillé avant l'examen : 80 % ou plus sur les examens blancs. Sinon, décaler l'examen au vendredi 27 novembre au plus tard et prendre 2 heures de la semaine 4 pour le CLF (le DEA a de la marge grâce aux semaines allégées 8 et 9).

### Semaine 4 : du 23/11/2026 au 29/11/2026 (DEA)
**DEA-C01 : cadrage, fondamentaux data et S3**

Budget : certification 6 h + entretiens 2 h = 8 h. Tâches core : 5 h 05. Bonus : 0 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | AWS Skill Builder | Exam Prep Overview: AWS Certified Data Engineer - Associate (DEA-C01 - English) : Panorama officiel de l'examen DEA-C01 (les 4 domaines et leur poids) | 15 min | 0 h 15 |  |
| core | AWS Skill Builder | Exam Prep Plan Overview: AWS Certified Data Engineer - Associate (DEA-C01 - English) : Aperçu du plan d'étude officiel DEA-C01 | 15 min | 0 h 15 |  |
| core | Préparation | Fixer l'échéance DEA dans le planificateur Udemy (examen cible : semaine du 1er février) et réserver la date |  | 0 h 15 |  |
| core | Udemy DEA principal (Maarek et Kane) | leçons 1 à 21 : Vue d'ensemble, fondamentaux de la data engineering, SQL, Git (1 quiz, 0 exercices) | 98 min | 2 h 35 | Les 3 exercices de codage SQL sont facultatifs (bonus). |
| core | Udemy DEA principal (Maarek et Kane) | leçons 22 à 43 : Stockage S3 : bases, politiques, versioning, réplication, classes, cycle de vie, événements, performance | 74 min | 1 h 45 |  |

Point de contrôle : Livrable : fiche d'une page « S3 pour data engineer » (classes de stockage, cycle de vie, événements, partitionnement).

### Semaine 5 : du 30/11/2026 au 06/12/2026 (DEA)
**DEA-C01 : fin du stockage, Glue et Lake Formation**

Budget : certification 6 h + entretiens 2 h = 8 h. Tâches core : 4 h 50. Bonus : 0 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy DEA principal (Maarek et Kane) | leçons 44 à 61 : S3 chiffrement, Access Points, S3 Tables/Iceberg, Storage Lens, EBS, EFS, Backup (1 quiz, 0 exercices) | 85 min | 2 h 15 |  |
| core | Udemy DEA principal (Maarek et Kane) | leçons 136 à 150 : Analytique : Glue (jobs, catalogue, bookmarks, qualité), DataBrew, Workflows, Lake Formation | 66 min | 1 h 35 |  |
| core | Laboratoire | Mini-lab : S3 vers Glue Crawler vers Athena sur un petit CSV, puis suppression des ressources |  | 1 h | Suivre les leçons « Hands On » du cours, rester dans l'offre gratuite. |

Point de contrôle : Livrable : schéma d'un data lake simple (S3 brut, Glue Catalog, Athena) avec le rôle de chaque service.

### Semaine 6 : du 07/12/2026 au 13/12/2026 (DEA)
**DEA-C01 : ingestion en streaming et calcul serverless**

Budget : certification 6 h + entretiens 2 h = 8 h. Tâches core : 4 h 20. Bonus : 2 h 30.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy DEA principal (Maarek et Kane) | leçons 167 à 183 : Kinesis Data Streams, Firehose, Managed Flink, MSK, comparaison Kinesis et MSK | 91 min | 2 h 10 |  |
| core | Udemy DEA principal (Maarek et Kane) | leçons 117 à 127 : EC2 pour le big data, Lambda, SAM, Batch (1 quiz, 0 exercices) | 45 min | 1 h 20 |  |
| core | Udemy DEA principal (Maarek et Kane) | leçons 108 à 116 : Migration et transfert : DMS, DataSync, Snow, Data Exchange, Transfer Family (1 quiz, 0 exercices) | 25 min | 0 h 50 |  |
| bonus | AWS Skill Builder (micro-certification) | AWS Data Streaming Demonstrated : Micro-certification officielle sur le streaming (bonus, utile pour le CV) | 140 min | 2 h 30 |  |

Point de contrôle : Livrable : tableau « Kinesis Data Streams / Firehose / MSK / SQS : quand choisir quoi ».

### Semaine 7 : du 14/12/2026 au 20/12/2026 (DEA)
**DEA-C01 : orchestration, Athena, Spark et EMR**

Budget : certification 6 h + entretiens 2 h = 8 h. Tâches core : 5 h 35. Bonus : 2 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy DEA principal (Maarek et Kane) | leçons 193 à 206 : SQS, SNS, Step Functions, AppFlow, EventBridge, MWAA (1 quiz, 0 exercices) | 61 min | 1 h 45 |  |
| core | Udemy DEA principal (Maarek et Kane) | leçons 151 à 166 : Athena (performance, CTAS, fédération), Spark, EMR, Iceberg | 98 min | 2 h 20 |  |
| core | AWS Skill Builder | Domain 1 Review: AWS Certified Data Engineer - Associate (DEA-C01 - English) : Revue officielle du Domaine 1 : ingestion et transformation (34 % de l'examen) | 80 min | 1 h 30 |  |
| bonus | AWS Skill Builder (micro-certification) | AWS Data Lakehouse Demonstrated : Micro-certification officielle lakehouse (bonus) | 110 min | 2 h |  |

Point de contrôle : Livrable : schéma d'un pipeline orchestré (déclencheur, ingestion, transformation, reprise sur erreur).

### Semaine 8 : du 21/12/2026 au 27/12/2026 (DEA)
**DEA-C01 : consolidation et premier diagnostic (semaine allégée)**

Budget : certification 4 h + entretiens 2 h = 6 h. Tâches core : 2 h 50. Bonus : 3 h 05. (semaine allégée)

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Révision | Relire les fiches des semaines 4 à 7 et refaire les quiz ratés des sections S3, Glue, Kinesis, Athena |  | 1 h 30 |  |
| core | AWS Skill Builder | Official Practice Question Set: AWS Certified Data Engineer - Associate (DEA-C01 - English) : Jeu officiel de questions d'entraînement DEA-C01 : premier diagnostic, noter les domaines faibles | 40 min | 1 h 20 |  |
| bonus | Udemy DEA principal (Maarek et Kane) | leçons 184 à 192 : OpenSearch et QuickSight (rapide, culture générale) (1 quiz, 0 exercices) | 63 min | 1 h 45 |  |
| bonus | Udemy DEA principal (Maarek et Kane) | leçons 128 à 135 : Conteneurs : Docker, ECS, ECR, EKS (rapide) (1 quiz, 0 exercices) | 43 min | 1 h 20 |  |

Point de contrôle : Semaine de fêtes : si une séance saute, ne rien rattraper. Seul le diagnostic officiel est indispensable.

### Semaine 9 : du 28/12/2026 au 03/01/2027 (DEA)
**DEA-C01 : DynamoDB (semaine allégée)**

Budget : certification 4 h + entretiens 2 h = 6 h. Tâches core : 2 h. Bonus : 0 h 55. (semaine allégée)

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy DEA principal (Maarek et Kane) | leçons 62 à 79 : DynamoDB : clés, index, streams, capacité, TTL, sécurité | 84 min | 2 h |  |
| bonus | Udemy DEA principal (Maarek et Kane) | leçons 80 à 90 : RDS, Aurora et autres bases AWS | 36 min | 0 h 55 |  |

Point de contrôle : Semaine de fêtes : DynamoDB en priorité, RDS/Aurora reportés si besoin.

### Semaine 10 : du 04/01/2027 au 10/01/2027 (DEA)
**DEA-C01 : Redshift et modélisation**

Budget : certification 6 h + entretiens 2 h = 8 h. Tâches core : 5 h. Bonus : 0 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy DEA principal (Maarek et Kane) | leçons 80 à 107 : RDS/Aurora (si non fait), bases NoSQL AWS, Redshift complet (architecture, distribution, COPY, WLM, Spectrum, Serverless, hands-on) (1 quiz, 0 exercices) | 139 min | 3 h 30 |  |
| core | AWS Skill Builder | Domain 2 Review: AWS Certified Data Engineer - Associate (DEA-C01 - English) : Revue officielle du Domaine 2 : gestion des stockages (26 %) | 80 min | 1 h 30 |  |

Point de contrôle : Livrable : tableau « Redshift / Athena / Snowflake : usages » (utilise ton avantage Snowflake).

### Semaine 11 : du 11/01/2027 au 17/01/2027 (DEA)
**DEA-C01 : opérations, supervision, qualité**

Budget : certification 7 h 30 + entretiens 1 h = 8 h 30. Tâches core : 7 h 10. Bonus : 0 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy DEA principal (Maarek et Kane) | leçons 246 à 265 : CloudWatch, CloudTrail, Config, CloudFormation, SSM, Well-Architected (1 quiz, 0 exercices) | 96 min | 2 h 30 |  |
| core | AWS Skill Builder | Domain 3 Review: AWS Certified Data Engineer - Associate (DEA-C01 - English) : Revue officielle du Domaine 3 : opérations et support (22 %) | 80 min | 1 h 30 |  |
| core | Examen blanc (Practice Tests DEA-C01 (390 questions, 6 tests)) | Udemy Practice Test #1 (65 questions) en conditions réelles puis correction |  | 3 h 10 | Durée et nombre de questions à confirmer dans Udemy. |

Point de contrôle : Livrable : fiche « Quel service pour surveiller ou auditer quoi ? » (CloudWatch, CloudTrail, Config, Glue Data Quality).

### Semaine 12 : du 18/01/2027 au 24/01/2027 (DEA)
**DEA-C01 : sécurité et gouvernance**

Budget : certification 8 h + entretiens 1 h = 9 h. Tâches core : 7 h 45. Bonus : 0 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy DEA principal (Maarek et Kane) | leçons 207 à 231 : Moindre privilège, masquage, salage, IAM, KMS, Macie, Secrets Manager, WAF, Shield (1 quiz, 0 exercices) | 97 min | 2 h 35 |  |
| core | Udemy DEA principal (Maarek et Kane) | leçons 233 à 237 : VPC, groupes de sécurité, NACL, PrivateLink (notions utiles à la sécurité des pipelines) | 20 min | 0 h 30 |  |
| core | AWS Skill Builder | Domain 4 Review: AWS Certified Data Engineer - Associate (DEA-C01 - English) : Revue officielle du Domaine 4 : sécurité et gouvernance (18 %) | 80 min | 1 h 30 |  |
| core | Examen blanc (Practice Tests DEA-C01 (390 questions, 6 tests)) | Udemy Practice Test #2 (65 questions) et correction |  | 3 h 10 |  |

Point de contrôle : Après les 4 revues de domaine : classer les erreurs par domaine et choisir 2 sujets à retravailler.

### Semaine 13 : du 25/01/2027 au 31/01/2027 (DEA)
**DEA-C01 : examens blancs et correction ciblée**

Budget : certification 8 h + entretiens 1 h = 9 h. Tâches core : 7 h 50. Bonus : 3 h 10.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Examen blanc (Exercice pratique 1 du cours Maarek) | Examen blanc Maarek et Kane v1.0 en conditions réelles puis correction |  | 3 h 10 |  |
| core | Examen blanc (Practice Tests DEA-C01 (390 questions, 6 tests)) | Udemy Practice Test #3 (65 questions) et correction |  | 3 h 10 |  |
| core | Révision | Reprise ciblée des 2 sujets faibles avec les leçons concernées (voir carte des sujets) |  | 1 h 30 |  |
| bonus | Examen blanc (Practice Tests DEA-C01) | Udemy Practice Test #4 (réserve si les scores restent sous 80 %) |  | 3 h 10 |  |

Point de contrôle : Objectif : plus de 80 % deux fois de suite avant de passer l'examen. Sinon, décaler l'examen d'une semaine (réserve).

### Semaine 14 : du 01/02/2027 au 07/02/2027 (DEA)
**DEA-C01 : dernière révision et examen**

Budget : certification 8 h + entretiens 1 h = 9 h. Tâches core : 7 h 55. Bonus : 3 h 10. (EXAMEN le 05/02/2027)

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy DEA principal (Maarek et Kane) | leçons 309 à 317 : Conclusion, relecture du guide d'examen, conseils d'examen | 32 min | 0 h 45 |  |
| core | Examen blanc (Exercice pratique 2 du cours Maarek) | Examen blanc Maarek et Kane v1.1 (2026) en conditions réelles puis correction |  | 3 h 10 |  |
| core | Révision | Relecture des fiches d'erreurs, repos la veille de l'examen |  | 1 h |  |
| core | Examen officiel | EXAMEN AWS CERTIFIED DATA ENGINEER ASSOCIATE DEA-C01 : jeudi 4 ou vendredi 5 février |  | 3 h | Durée indicative, à confirmer sur la page officielle. |
| bonus | Examen blanc (Réserve) | Examen blanc Nikolai Schuler (réserve) ou Udemy Practice Tests #5 et #6 |  | 3 h 10 |  |

Point de contrôle : Si le score aux blancs est inférieur à 80 %, reporter l'examen au 12 février, puis 19 février au plus tard.

### Semaine 15 : du 08/02/2027 au 14/02/2027 (dbt)
**dbt : fondations, snapshots, tests, contrats et début du projet (départ à 0 %)**

Budget : certification 6 h + entretiens 2 h = 8 h. Tâches core : 5 h 50. Bonus : 0 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy dbt principal (Toth) | leçons 1 à 49 : Fondations dbt sur Snowflake, matérialisations, seeds, sources, fraîcheur, snapshots, tests génériques, singuliers et unitaires, contrats de données et contraintes (3 quiz, 6 exercices) | 196 min | 3 h 50 | Leçons 1 à 32 en vitesse accélérée (acquis SnowPro Core et dbt Fundamentals) puis focus sur snapshots, tests unitaires et contrats (leçons 33 à 49). |
| core | Projet dbt | Projet dbt sur Snowflake : dépôt Git, déclaration des sources, couche staging |  | 2 h |  |

Point de contrôle : Livrable : dépôt GitHub du projet dbt avec sources et staging propres.

### Semaine 16 : du 15/02/2027 au 21/02/2027 (dbt)
**dbt : Jinja, macros, documentation, hooks, exposures**

Budget : certification 6 h + entretiens 2 h = 8 h. Tâches core : 5 h 25. Bonus : 1 h 55.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy dbt principal (Toth) | leçons 50 à 72 : Jinja, macros, packages, documentation et lineage, analyses, hooks, grants, exposures (3 quiz, 2 exercices) | 90 min | 3 h 55 | Les leçons 68 à 70 (BI Preset) sont facultatives. |
| core | Projet dbt | Projet dbt : couche intermediate, macros utiles, documentation des modèles |  | 1 h 30 |  |
| bonus | Udemy dbt principal (Toth) | leçons 73 à 82 : dbt-expectations et débogage de tests (intérêt entretien, hors programme probable de l'examen) (1 quiz, 1 exercices) | 49 min | 1 h 55 |  |

Point de contrôle : Livrable : modèles intermediate documentés et testés.

### Semaine 17 : du 22/02/2027 au 28/02/2027 (dbt)
**dbt : commandes, sélecteurs, Python, incrémental, versions**

Budget : certification 6 h + entretiens 2 h = 8 h. Tâches core : 5 h 05. Bonus : 0 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy dbt principal (Toth) | leçons 83 à 107 : Logs, commandes avancées, --empty et --sample, tags, sélecteurs, modèles Python, variables, microbatch, versions (2 quiz, 1 exercices) | 89 min | 3 h 05 |  |
| core | Projet dbt | Projet dbt : marts, un modèle incrémental (microbatch si pertinent), tests |  | 2 h |  |

Point de contrôle : Livrable : marts finaux avec au moins un modèle incrémental.

### Semaine 18 : du 01/03/2027 au 07/03/2027 (dbt)
**dbt : Slim CI, état, débogage, contrats et accès**

Budget : certification 6 h + entretiens 2 h = 8 h. Tâches core : 4 h 45. Bonus : 0 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy dbt principal (Toth) | leçons 108 à 123 : Slim CI, cibles, variables d'environnement, defer, retry, GitHub Actions | 79 min | 1 h 55 |  |
| core | Udemy dbt examen (Weigel) | leçons 66 à 76 : Environnements, contrats, versions, accès aux modèles (groupes, privé, protégé) : sujet absent du cours Toth | 68 min | 1 h 25 |  |
| core | Udemy dbt examen (Weigel) | leçons 77 à 84 : Débogage : logs, erreurs d'exécution, de compilation, de base, fichiers compilés, correctifs | 40 min | 0 h 50 |  |
| core | Udemy dbt examen (Weigel) | leçons 85 à 89 : État : manifest, run_results, state:modified, sélecteurs de résultat, retry | 26 min | 0 h 35 |  |

Point de contrôle : Livrable : pipeline GitHub Actions qui lance dbt build sur un environnement de test.

### Semaine 19 : du 08/03/2027 au 14/03/2027 (dbt)
**dbt : tests avancés, fraîcheur, nouveautés de l'examen 2026**

Budget : certification 6 h + entretiens 2 h = 8 h. Tâches core : 5 h 05. Bonus : 0 h.

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Udemy dbt examen (Weigel) | leçons 104 à 112 : Tests : singuliers, génériques, personnalisés, unitaires, sévérité, sélection indirecte | 55 min | 1 h 10 |  |
| core | Udemy dbt examen (Weigel) | leçons 113 à 119 : Documentation, exposures, fraîcheur des sources, sélecteurs et espaces de noms avancés | 41 min | 0 h 50 |  |
| core | Udemy dbt examen (Weigel) | leçons 120 à 130 : Nouveautés de l'examen mai-juin 2026, dbt show, snapshots, microbatch, --sample, conseils finaux | 56 min | 1 h 10 |  |
| core | Udemy dbt principal (Toth) | leçons 162 à 164 : Guide de préparation à la certification, entretien conseil, réflexion 2026 et examen exemple | 47 min | 1 h 10 |  |
| core | Projet dbt | Projet dbt : finaliser README, tests et documentation, publier sur GitHub |  | 0 h 45 |  |

Point de contrôle : Livrable : dépôt GitHub final du projet dbt (utile en entretien).

### Semaine 20 : du 15/03/2027 au 21/03/2027 (dbt)
**dbt : examens blancs et passage de l'examen**

Budget : certification 8 h + entretiens 1 h = 9 h. Tâches core : 8 h. Bonus : 0 h. (EXAMEN le 19/03/2027)

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Examen blanc (Exercice pratique 2 : Final Test du cours Weigel) | Examen blanc Weigel (65 questions, 2 h) puis correction |  | 3 h |  |
| core | Examen blanc (Exercice pratique 1 du cours Toth) | Examen exemple du cours Toth (Knowledge Check / Certification Exam Sample) |  | 1 h 30 |  |
| core | Révision | Relecture ciblée des erreurs |  | 1 h |  |
| core | Examen officiel | EXAMEN dbt ANALYTICS ENGINEERING : vendredi 19 mars |  | 2 h 30 | 65 questions, 2 heures, 65 % pour réussir, dbt Core 1.11 selon le guide d'étude consulté. À reconfirmer sur la page dbt. |

Point de contrôle : Si les blancs sont sous 65 %, décaler l'examen d'une à deux semaines (réserve jusqu'au 2 avril).

### Semaine 21 : du 22/03/2027 au 28/03/2027 (Réserve)
**Réserve 1 : rattrapage ou repassage d'un examen, ou consolidation entretiens**

Budget : certification 4 h + entretiens 4 h = 8 h. Tâches core : 4 h. Bonus : 0 h. (semaine allégée)

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Réserve | Marge de sécurité : repasser un examen raté, rattraper un retard ou renforcer les entretiens |  | 4 h |  |

Point de contrôle : Aucun nouveau contenu obligatoire.

### Semaine 22 : du 29/03/2027 au 04/04/2027 (Réserve)
**Réserve 2 (fin du contrat le 2 avril 2027)**

Budget : certification 4 h + entretiens 4 h = 8 h. Tâches core : 4 h. Bonus : 0 h. (semaine allégée)

| Priorité | Ressource | Leçons ou contenu | Vidéo | Estimé | Note |
|---|---|---|---|---|---|
| core | Réserve | Marge de sécurité : repasser un examen raté, rattraper un retard ou renforcer les entretiens |  | 4 h |  |

Point de contrôle : Aucun nouveau contenu obligatoire.
