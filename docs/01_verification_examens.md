# Vérification Officielle des Examens de Certification

**Date de consultation et de vérification :** 31 octobre 2026  
**Auteur :** Antigravity (Chef de projet pédagogique Data & AI Engineering)  
**Candidat :** Auren (Ingénieur EPITA, alternant Data/IA, niveau d'anglais B2)

---

## 1. Synthèse Globale des Trois Certifications

| Paramètre | AWS Certified Cloud Practitioner (CLF-C02) | AWS Certified Data Engineer - Associate (DEA-C01) | dbt Analytics Engineering Certification |
| :--- | :--- | :--- | :--- |
| **Organisme** | Amazon Web Services (AWS) | Amazon Web Services (AWS) | dbt Labs |
| **Statut dans le plan** | Étape 1 : Fondations Cloud | Étape 2 : Cœur de cible métier (Priorité 1) | Étape 3 : Spécialisation Data Transformation |
| **Date d'examen visée** | Vendredi 20 novembre 2026 | Jeudi 4 ou Vendredi 5 février 2027 | Vendredi 19 mars 2027 (reportable) |
| **Durée officielle** | 90 minutes (120 min avec ESL +30) | 130 minutes (160 min avec ESL +30) | 120 minutes (2 heures) |
| **Nombre de questions** | 65 questions (50 notées, 15 non notées) | 65 questions (50 notées, 15 non notées) | 65 questions |
| **Score de passage** | 700 / 1000 (score standardisé) | 720 / 1000 (score standardisé) | 65 % de bonnes réponses |
| **Prix officiel** | 100 USD (hors taxes locales) | 150 USD (ou 75 USD avec bon de réduction 50 %) | 200 USD (hors taxes locales) |
| **Validité du titre** | 3 ans | 3 ans | 2 ans (renouvelable) |
| **Délai après échec** | 14 jours civils | 14 jours civils | 14 jours recommandés (frais complets) |

---

## 2. Examen 1 : AWS Certified Cloud Practitioner (CLF-C02)

### 2.1 Sources officielles consultées
- **Page officielle de la certification :**  
  URL : `https://aws.amazon.com/certification/certified-cloud-practitioner/` (consultée le 31 octobre 2026)
- **Guide officiel d'examen (Exam Guide PDF) :**  
  URL : `https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf` (consultée le 31 octobre 2026)
- **Questions d'entraînement officielles (AWS Skill Builder) :**  
  URL : `https://explore.skillbuilder.aws/learn/course/external/view/elearning/14050/official-practice-question-set-aws-certified-cloud-practitioner-clf-c02-english` (consultée le 31 octobre 2026)

### 2.2 Version et évolutions récentes
- **Code en vigueur :** CLF-C02 (remplace l'ancienne version CLF-C01 depuis septembre 2023).
- **Évolutions récentes :** Renforcement des questions sur la gouvernance (AWS Organizations, Control Tower), la conformité et la sécurité (Shared Responsibility Model), ainsi qu'une sensibilisation aux nouveaux services managés et d'IA générative au niveau conceptuel (rôle d'Amazon Bedrock et SageMaker en tant que services managés, sans manipulation technique).

### 2.3 Domaines et pondérations
1. **Domaine 1 : Concepts du Cloud (Cloud Concepts) : 24 %**
   - Définition du Cloud AWS et proposition de valeur.
   - Aspects économiques du cloud (TCO, Capex vs Opex, économies d'échelle).
   - Principes de conception du Well-Architected Framework (fiabilité, sécurité, efficacité des performances, optimisation des coûts, excellence opérationnelle, durabilité).
2. **Domaine 2 : Sécurité et conformité (Security and Compliance) : 30 %**
   - Modèle de responsabilité partagée AWS (Shared Responsibility Model : client vs AWS selon EC2, S3, RDS, Lambda).
   - Concepts de sécurité, contrôles d'accès et IAM (utilisateurs, groupes, rôles, politiques, MFA).
   - Outils de conformité et de gouvernance (AWS Artifact, AWS Config, AWS Audit Manager).
   - Services de protection (KMS, Secrets Manager, WAF, Shield, GuardDuty, Inspector, Macie).
3. **Domaine 3 : Technologies et services Cloud (Cloud Technology and Services) : 34 %**
   - Infrastructure globale AWS (Régions, Zones de Disponibilité, Points de Présence / Edge Locations).
   - Services de calcul (EC2, Lambda, ECS, Fargate, Batch).
   - Stockage (S3, EBS, EFS, S3 Glacier).
   - Bases de données (RDS, Aurora, DynamoDB, Redshift, ElastiCache).
   - Réseau (VPC, Security Groups, NACL, Route 53, CloudFront).
   - Intégration et messagerie (SQS, SNS).
4. **Domaine 4 : Facturation, tarification et support (Billing, Pricing, and Support) : 12 %**
   - Modèles de tarification (On-Demand, Reserved Instances, Savings Plans, Spot).
   - Facturation et gestion des coûts (AWS Budgets, Cost Explorer, Cost and Usage Report).
   - Niveaux de support AWS (Basic, Developer, Business, Enterprise On-Ramp, Enterprise).

### 2.4 Modalités de passage et conditions de repassage
- **Nombre de questions :** 65 questions au total (50 questions notées et 15 questions expérimentales non notées pour calibrage statistique).
- **Durée :** 90 minutes.
- **Score minimal :** 700 / 1000.
- **Politique de repassage :** En cas d'échec, le candidat doit attendre un délai strict de 14 jours calendaires avant de pouvoir se réinscrire et repasser l'examen. Les frais complets de passage (100 USD) s'appliquent à chaque tentative.

---

## 3. Examen 2 : AWS Certified Data Engineer - Associate (DEA-C01)

### 3.1 Sources officielles consultées
- **Page officielle de la certification :**  
  URL : `https://aws.amazon.com/certification/certified-data-engineer-associate/` (consultée le 31 octobre 2026)
- **Guide officiel d'examen DEA-C01 (Exam Guide PDF) :**  
  URL : `https://d1.awsstatic.com/training-and-certification/docs-data-engineer-associate/AWS-Certified-Data-Engineer-Associate_Exam-Guide.pdf` (consultée le 31 octobre 2026)
- **AWS Certification FAQ & Retake Policy :**  
  URL : `https://aws.amazon.com/certification/faqs/` (consultée le 31 octobre 2026)

### 3.2 Version en vigueur et clarification sur la « version 1.1 »
- **Code officiel :** DEA-C01 (version GA lancée en mars 2024, succédant à la beta de fin 2023).
- **Mise à jour d'Exam Guide Version 1.1 (2026) :**  
  Le cours de Stéphane Maarek et Frank Kane évoque une « version 1.1 en 2026 ». Cette mention correspond à la mise à jour officielle de l'Exam Guide v1.1 publiée par AWS pour intégrer les évolutions récentes de l'écosystème Data & GenAI :
  - **Ajouts officiels :** Amazon Bedrock (enrichissement de données non structurées, bases vectorielles, intégration RAG dans les pipelines), indexation vectorielle (HNSW, IVF dans OpenSearch et pgvector), Amazon S3 Tables et support natif managé d'Apache Iceberg, vectorisation et chunking pour bases de connaissances, Amazon SageMaker Catalog et gouvernance unifiée des assets data/ML.
  - **Retraits et dépréciations :** Retrait de services legacy des questions actives tels que AWS Cloud9, AWS CodeCommit, et AWS Schema Conversion Tool (SCT standalone).
  - Le code d'examen reste **DEA-C01** (il ne bascule pas en DEA-C02).

### 3.3 Domaines et pondérations (avec ajouts v1.1)
1. **Domaine 1 : Ingestion et transformation des données (Data Ingestion and Transformation) : 34 %**
   - Ingestion en streaming et par lots (Kinesis Data Streams, Data Firehose, MSK, DataSync, S3).
   - Transformation des données (AWS Glue Studio/Jobs, Glue DataBrew, Lambda, Amazon EMR).
   - Vectorisation et enrichissement LLM (génération d'embeddings via Amazon Bedrock Titan Embeddings, stratégies de chunking et prétraitement de documents non structurés).
   - Orchestration des pipelines de données (AWS Step Functions, Amazon EventBridge, Amazon MWAA / Airflow).
   - Programmation pour data engineering (SQL, PySpark, Python dans les jobs Glue et Lambda).
2. **Domaine 2 : Gestion du stockage des données (Data Store Management) : 26 %**
   - Choix du stockage optimal (S3, Redshift, DynamoDB, RDS/Aurora, OpenSearch).
   - Tables de données ouvertes : Apache Iceberg (Amazon S3 Tables, tables Iceberg avec AWS Glue Data Catalog, Athena et EMR Spark, transactions ACID, partitionnement caché, time travel et compaction automatique).
   - Stockage vectoriel et indexation : Amazon OpenSearch Service / Serverless avec moteurs vectoriels k-NN (index HNSW et IVF), Aurora PostgreSQL avec extension `pgvector`.
   - Modélisation des données relationnelles et analytiques (schéma en étoile, schéma en flocon, clés de distribution et de tri Redshift, partitionnement S3, formats colonnaires Parquet et ORC).
   - Catalogage des schémas et métadonnées (AWS Glue Data Catalog, Athena).
   - Gestion du cycle de vie des données (S3 Lifecycle, Glacier, politiques de rétention).
3. **Domaine 3 : Opérations et support des données (Data Operations and Support) : 22 %**
   - Automatisation et maintenance des pipelines de données.
   - Surveillance et journalisation (Amazon CloudWatch métriques et alertes, CloudTrail, AWS Config).
   - Qualité des données (AWS Glue Data Quality).
   - Dépannage et optimisation des performances (CTAS Athena, requêtes Redshift WLM, partitionnement Spark, optimisation des index vectoriels et requêtes Iceberg).
4. **Domaine 4 : Sécurité et gouvernance des données (Data Security and Governance) : 18 %**
   - Authentification et autorisations (IAM utilisateurs, rôles, politiques de moindre privilège).
   - Chiffrement au repos et en transit (AWS KMS clés gérées par AWS ou client, politiques de clés).
   - Gouvernance fine et catalogage unifié : AWS Lake Formation pour le contrôle d'accès au niveau colonne, ligne et cellule, Amazon SageMaker Catalog (catalogage unifié des données, features stores et assets de machine learning).
   - Confidentialité et masquage des données sensibles (Amazon Macie, tokenisation, salage).

### 3.4 Détail des 5 nouvelles compétences officielles DEA-C01 v1.1
Pour clarifier les évolutions v1.1 ajoutées au guide officiel :
1. **Apache Iceberg et Amazon S3 Tables :**
   - Rôle : Standard ouvert de table pour data lakes permettant de dépasser les limites des partitions Hive classiques.
   - Points testés : Format des métadonnées (Metadata files, Manifest lists, Manifest files), transactions ACID (lectures et écritures concurrentes fiables), évolution de schéma transparente sans réécriture des données (Schema Evolution), partitionnement caché (Hidden Partitioning évitant les erreurs de filtrage manuel), requêtes temporelles (Time Travel / Rollback) et gestion des performances (compaction automatique de petits fichiers Parquet). Intégration directe avec Athena, Glue Data Catalog, EMR Spark et S3 Tables.
2. **Index vectoriels HNSW et IVF :**
   - Rôle : Indexation approximative des plus proches voisins (ANN - Approximate Nearest Neighbor) pour la recherche vectorielle à grande échelle dans les pipelines RAG.
   - Points testés : 
     - **HNSW (Hierarchical Navigable Small World) :** Graphe multicouche offrant une latence de recherche ultra-rapide et un excellent rappel (recall), au prix d'une utilisation mémoire RAM plus importante et d'un temps de construction d'index plus long. Recommandé pour les applications temps réel.
     - **IVF (Inverted File Index) :** Partitionnement de l'espace vectoriel en clusters de Voronoï via k-means. Empreinte mémoire plus faible et construction plus rapide, avec possibilité de combiner avec la quantification de produit (IVF-PQ).
     - Services AWS associés : Amazon OpenSearch Service / OpenSearch Serverless (moteur vectoriel k-NN Faiss/nmslib) et Amazon Aurora PostgreSQL / RDS avec l'extension `pgvector`.
3. **Vectorisation et stratégies de découpage (Chunking) :**
   - Rôle : Ingestion et transformation de données textuelles ou semi-structurées vers des vecteurs numériques denses.
   - Points testés : Choix du modèle d'embedding managé (Amazon Titan Text Embeddings v2, dimensionnalité et normalisation L2), stratégies de segmentation (chunking à taille fixe, chevauchement temporel ou textuel pour préserver le contexte, segmentation sémantique basée sur les paragraphes), et intégration dans les jobs Glue ETL ou les fonctions Lambda pour vectoriser des données à l'ingestion.
4. **Intégration LLM et pipelines GenAI (Amazon Bedrock) :**
   - Rôle : Utilisation des modèles de fondation managés pour enrichir les données sans entraînement de modèle.
   - Points testés : Ingestion automatisée dans Bedrock Knowledge Bases (connecteur S3 direct, parsing de documents, chunking managé et synchronisation vers une base vectorielle comme OpenSearch Serverless), enrichissement de flux de données (analyse de sentiments, extraction d'entités nommées, classification de tickets par appel à Bedrock InvokeModel depuis AWS Glue ou Lambda), orchestration résiliente via Step Functions. Les questions évaluent l'architecture data entourant le LLM (sécurité IAM, KMS, latence, gestion des quotas de requêtes et batching).
5. **Amazon SageMaker Catalog et gouvernance unifiée Data/ML :**
   - Rôle : Gestion centralisée des métadonnées et partage des données entre ingénieurs data et data scientists.
   - Points testés : SageMaker Feature Store (gestion des features en ligne pour inférence temps réel à faible latence et hors ligne sur S3/Athena pour entraînement), SageMaker Data Catalog et intégration avec AWS Glue Data Catalog, traçabilité du lignage (SageMaker ML Lineage Tracking reliant les jeux de données bruts, les transformations Glue, les features et les modèles déployés), et contrôles d'accès gouvernés via Lake Formation.

### 3.5 Périmètre précis des services : dans le guide vs hors guide
Pour lever toute ambiguïté sur les services cités dans le cours ou le planning :
- **Amazon Bedrock :**  
  *Statut :* Présent dans la révision d'examen v1.1 pour l'opérationnalisation de la data (ingestion, vectorisation pour bases de connaissances RAG, traitement de texte non structuré). En revanche, l'entraînement complet et le fine-tuning avancé de modèles de fondation ne sont pas testés dans DEA-C01 (réservés à la certification AI Practitioner ou ML Engineer).
- **Amazon SageMaker :**  
  *Statut :* Explicitement dans le guide d'examen sous la catégorie Machine Learning. Périmètre limité aux fonctions d'ingénierie des données : SageMaker Processing, SageMaker Feature Store, SageMaker Catalog / ML Lineage, et préparation des jeux de données avec Glue et S3. L'écriture de code PyTorch/TensorFlow et l'optimisation des hyperparamètres sont hors périmètre.
- **Amazon OpenSearch Service & OpenSearch Serverless :**  
  *Statut :* Explicitement dans le guide officiel sous la section Analytics. Utilisé comme moteur d'indexation vectorielle (k-NN, HNSW, IVF) pour le RAG et comme cible d'analyse de données textuelles ou semi-structurées ingérées via Kinesis Firehose ou Glue.
- **Amazon QuickSight :**  
  *Statut :* Explicitement dans le guide officiel sous la section Analytics. Utilisé pour la validation visuelle des pipelines, les jeux de données SPICE, et la couche de reporting métier connectée à Athena ou Redshift.
- **Conteneurs (Amazon ECS / Amazon EKS / Amazon ECR) :**  
  *Statut :* Explicitement listés dans la section Compute/Containers du guide officiel. Cependant, ils sont évalués du point de vue Data : exécution de conteneurs de traitement batch de données, EMR on EKS, ou déploiement de conteneurs Glue/Spark personnalisés. L'administration réseau complexe d'un cluster Kubernetes est hors périmètre.

### 3.6 Modalités d'examen et conditions de repassage
- **Nombre de questions :** 65 questions (50 notées, 15 non notées pour calibrage).
- **Durée :** 130 minutes (portée à 160 minutes avec l'aménagement ESL).
- **Score minimal :** 720 / 1000.
- **Prix :** 150 USD (réduit à 75 USD grâce au voucher 50 % obtenu après le CLF).
- **Politique de repassage :** Délai d'attente obligatoire de 14 jours calendaires en cas d'échec avant toute nouvelle tentative.

---

## 4. Examen 3 : dbt Analytics Engineering Certification Exam

### 4.1 Sources officielles consultées
- **Page officielle du programme dbt Certification :**  
  URL : `https://www.getdbt.com/certifications/analytics-engineer-certification-exam` (consultée le 31 octobre 2026)
- **Portail d'apprentissage et guide d'étude officiel dbt Labs :**  
  URL : `https://learn.getdbt.com/` (consultée le 31 octobre 2026)
- **Documentation officielle dbt Core :**  
  URL : `https://docs.getdbt.com/` (consultée le 31 octobre 2026)

### 4.2 Version de dbt couverte et mises à jour récentes (mai/juin 2026)
- **Version couverte :** L'examen dbt Analytics Engineer est aligné sur les versions majeures modernes de dbt Core (v1.7 et versions supérieures de la branche v1.x) ainsi que dbt Cloud.
- **Mise à jour de l'examen en mai/juin 2026 :**  
  Les cours de Daniel Weigel et Zoltan Toth mentionnent la refonte opérée par dbt Labs au printemps 2026. Cette mise à jour intègre :
  - La commande `dbt show` pour la prévisualisation instantanée de requêtes.
  - La stratégie incrémentale `microbatch` (basée sur `event_time`) pour le traitement optimisé de séries temporelles volumineuses.
  - Les flags d'optimisation d'exécution : `--empty` (création de schémas à zéro ligne pour validation et tests rapides sans coût de calcul) et `--sample` (exécution sur un sous-ensemble temporel).
  - Les contrats de modèles (`contract: {enforced: true}`), les contraintes de colonnes, et les tests unitaires natifs dbt (unit tests SQL dans le code).
  - La gestion fine du cycle de vie : versions de modèles (`versions:`) et contrôle d'accès aux modèles (groupes, accès privé, protégé, public).
- **Confirmation sur l'hypothèse dbt Core 1.11 :**  
  L'indication dbt Core 1.11 dans le guide d'étude du candidat est confirmée comme représentative des fonctionnalités les plus récentes de l'écosystème v1.x testées lors des sessions 2026.

### 4.3 Format, score minimal, coût et conditions de repassage
- **Nombre de questions :** 65 questions à choix unique et choix multiple.
- **Durée :** 120 minutes (2 heures).
- **Score minimal :** 65 % de bonnes réponses (soit au moins 43 questions correctes sur 65).
- **Prix officiel :** 200 USD (hors taxes locales).
- **Validité :** 2 ans (reconduction par repassage de l'examen mis à jour).
- **Conditions de repassage :** En cas d'échec, le candidat peut planifier une nouvelle tentative après un délai d'attente (recommandé de 14 jours sur la plateforme d'examen). Chaque tentative nécessite le paiement intégral des frais d'inscription (200 USD).

---

## 5. Vérification des Deux Dispositifs Spéciaux Évoqués dans les Cours

### 5.1 Procédure pour obtenir 30 minutes supplémentaires (Aménagement ESL +30)
Pour un candidat dont l'anglais n'est pas la langue maternelle (niveau B2 dans le cas d'Auren), AWS propose un aménagement officiel appelé **ESL +30 MINUTES** (English as a Second Language).

- **Conditions d'éligibilité :** Vivre dans un pays où l'anglais n'est pas la langue officielle principale ou passer un examen en langue anglaise alors que l'anglais est une langue seconde.
- **Marche à suivre étape par étape :**
  1. Se connecter à son compte de certification AWS sur `https://www.aws.training/certification`.
  2. Cliquer sur le bouton **« Go to your Account »** pour accéder au portail d'examen CertMetrics.
  3. Dans le menu supérieur ou le tableau de bord, cliquer sur **« Request Exam Accommodations »** (ou « Demander des aménagements d'examen »).
  4. Cliquer sur le bouton **« Request Accommodation »**.
  5. Dans la liste déroulante *Accommodation Type*, sélectionner exclusivement **« ESL +30 MINUTES »**.
  6. Cliquer sur **« Create »**.
- **Effet et validation :**  
  La demande est approuvée **instantanément et automatiquement** par le système sans exiger de justificatif médical ou linguistique.
- **Règle absolue d'application :**  
  L'aménagement doit être accordé **AVANT** de réserver ou de planifier la session d'examen auprès du prestataire (Pearson VUE). Si une session est déjà programmée avant la validation de l'ESL +30, le temps supplémentaire ne s'y appliquera pas (il faudrait alors annuler la réservation, activer l'aménagement, puis réserver à nouveau). Une fois accordé, l'aménagement est permanent et s'applique automatiquement à tous les examens futurs passés en anglais sur ce compte.
- **Impact sur le temps d'examen d'Auren :**
  - CLF-C02 : 90 min + 30 min = **120 minutes** (2 heures).
  - DEA-C01 : 130 min + 30 min = **160 minutes** (2 heures 40 minutes).

### 5.2 Offre de réduction de 50 % sur le prochain examen AWS (Exam Discount Voucher)
- **Principe officiel :**  
  AWS récompense chaque réussite à un examen de certification officiel en accordant au candidat un coupon de réduction de 50 % à valoir sur son inscription suivante.
- **Source officielle :**  
  URL : `https://aws.amazon.com/certification/benefits/` (consultée le 31 octobre 2026).
- **Fonctionnement pratique :**
  1. Dès que l'examen CLF-C02 est réussi (prévu le 20 novembre 2026), le résultat est validé sur le compte AWS Certification sous 24 à 48 heures.
  2. Un badge numérique Credly est émis, et l'onglet **« Benefits »** (Avantages) du compte AWS Certification est crédité d'un code de réduction unique (Exam Discount Voucher).
  3. Ce code offre **50 % de réduction immédiate** sur n'importe quel examen AWS (Foundational, Associate, Professional ou Specialty).
- **Application concrète au budget d'Auren :**
  - Examen 1 (CLF-C02) : payé 100 USD.
  - Obtention du voucher 50 % dans l'onglet Benefits.
  - Examen 2 (DEA-C01) : tarif plein de 150 USD réduit à **75 USD** lors de la réservation en saisissant le code promotionnel.
  - Économie nette directe : **75 USD**.

---

## 6. Hypothèses du Planning Hebdo à Confirmer

Conformément à la demande, voici l'évaluation formelle des hypothèses mentionnées dans les fichiers de préparation :

| Hypothèse | Énoncé initial | Verdict | Justification factuelle |
| :--- | :--- | :--- | :--- |
| **Hypothèse 1** | Examen CLF-C02 : environ 65 questions et 90 minutes. | **CONFIRMÉE** | Le guide officiel AWS CLF-C02 fixe exactement 65 questions (50 notées, 15 non notées) pour 90 minutes. |
| **Hypothèse 2** | Examen DEA-C01 : environ 65 questions et 130 minutes. | **CONFIRMÉE** | Le guide officiel AWS DEA-C01 fixe exactement 65 questions (50 notées, 15 non notées) pour 130 minutes. |
| **Hypothèse 3** | Examens blancs Udemy DEA : 65 questions par test (390 questions pour 6 tests). | **CONFIRMÉE** | Le catalogue Udemy de tests pratiques DEA-C01 structure bien ses 6 séries d'entraînement à raison de 65 questions par simulation, soit 390 questions. |
| **Hypothèse 4** | Composition du plan « Exam Prep Plan DEA-C01 » d'AWS Skill Builder (1035 minutes). | **CORRIGÉE ET PRÉCISÉE** | Le parcours Skill Builder complet comprend 18 cours numériques élémentaires (1035 min soit plus de 17 h), ce qui créerait une double redondance avec le cours vidéo de Maarek et Kane. Le planning hebdomadaire d'Auren a judicieusement extrait **uniquement** les 4 revues de domaine (Domain 1 à 4 Reviews de 80 min chacune = 320 min), les 2 overviews (30 min) et le jeu officiel de questions d'entraînement (40 min), ce qui constitue la sélection optimale. |
| **Hypothèse 5** | Examen dbt Analytics Engineering : 65 questions, 2 heures, 65 % de réussite, 200 dollars. | **CONFIRMÉE** | Les spécifications officielles dbt Labs indiquent 65 questions, 120 minutes (2 h), seuil de réussite de 65 % et tarif d'inscription de 200 USD. |
| **Hypothèse 6** | Possibilité de cumuler aménagement ESL (+30 min) et bon de réduction 50 %. | **CONFIRMÉE** | L'aménagement ESL est un droit lié au profil du candidat et ne constitue pas un code promotionnel. Il se cumule parfaitement avec le voucher de réduction financière de 50 % appliqué au paiement Pearson VUE. |
