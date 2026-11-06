export const deaFichesExpress = [
  {
    file: 'fiche-express-d1-ingestion-transformation.md',
    title: 'Fiche Express Domaine 1 : Ingestion et Transformation des Données (34 %)',
    content: `# Fiche Express Domaine 1 : Ingestion et Transformation des Données (34 %)

## 1. Vue d'ensemble du Domaine 1
Le Domaine 1 représente le poids le plus lourd de l'examen DEA-C01 (34 %). Il évalue votre capacité à concevoir, déployer et optimiser des pipelines d'ingestion par lots et en continu (streaming), ainsi que les transformations distribuées.

## 2. Les 12 Chiffres et Limites Critiques à Retenir
1. Kinesis Data Streams (par Shard) : 1 Mo/s ou 1 000 enregistrements/s en écriture (PUT) ; 2 Mo/s en lecture (GET).
2. Taille maximale d'un enregistrement Kinesis : 1 Mo strictement (au-delà, utiliser S3 avec pointeur).
3. Rétention Kinesis Data Streams : 24 heures par défaut, configurable jusqu'à 365 jours.
4. Tampon Amazon Data Firehose : taille de 1 Mo à 128 Mo, intervalle de 60 secondes à 900 secondes (le premier atteint déclenche l'écriture).
5. Limite d'exécution AWS Lambda : 15 minutes (900 secondes) maximum strict ; mémoire de 128 Mo à 10 240 Mo (10 Go) ; disque \`/tmp\` de 512 Mo à 10 240 Mo.
6. Amazon SQS Standard : débit quasi illimité ; SQS FIFO : 300 messages/s (ou 3 000/s par lot de 10).
7. SQS Visibility Timeout : 30 secondes par défaut, configurable de 0 seconde à 12 heures ; rétention de 1 minute à 14 jours (4 jours par défaut).
8. SQS Long Polling : \`WaitTimeSeconds\` jusqu'à 20 secondes (recommandé pour réduire les coûts).
9. AWS Glue DPU : 1 DPU = 4 vCPU et 16 Go de mémoire RAM (workers G.1X = 1 DPU, G.2X = 2 DPU).
10. Amazon Athena : facturation à 5 USD par téraoctet de données numérisées (scanned).
11. Limite CTAS Athena : partitionnement maximal sur 100 partitions simultanées par requête.
12. Amazon Titan Text Embeddings v2 : dimensions vectorielles sélectionnables de 256, 512 ou 1024 dimensions avec normalisation intégrée.

## 3. Matrice Décisionnelle d'Architecture : Quand Choisir Quoi
- Ingestion sans code vers S3/Redshift/OpenSearch : Amazon Data Firehose (near real-time, latence >= 60 s).
- Traitement de streaming sous la seconde avec rejeu multi-consommateurs : Amazon Kinesis Data Streams.
- Écosystème Kafka existant ou messages > 1 Mo : Amazon MSK (Managed Streaming for Apache Kafka).
- Analyse de flux avec fenêtrage temporel complexe (SQL/Java) : Amazon Managed Service for Apache Flink.
- Transformations lourdes distribuées sans serveur (Spark) : AWS Glue ETL (avec DynamicFrames pour schémas hétérogènes et Job Bookmarks pour l'incrémental).
- Nettoyage et préparation de données sans code pour analystes : AWS Glue DataBrew.
- Cluster Big Data personnalisé avec frameworks variés (HBase, Presto, Trino) : Amazon EMR.
- Ingestion événementielle ultra-rapide (< 15 min) : AWS Lambda déclenché par événement S3.
- Calcul batch conteneurisé long (> 15 min) avec instances Spot : AWS Batch.
- Orchestration de pipelines sans serveur AWS natifs : AWS Step Functions (Standard pour ETL, Express pour streaming).
- Orchestration de pipelines complexes multi-clouds en Python : Amazon MWAA (Apache Airflow).
- Réplication continue de bases de données transactionnelles (CDC) : AWS Database Migration Service (DMS).
- Découpage documentaire et vectorisation RAG managée : Amazon Bedrock Knowledge Bases avec Titan Text Embeddings v2.

## 4. Les 5 Pièges Majeurs d'Examen du Domaine 1
1. Kinesis ProvisionedThroughputExceededException : la cause principale est une mauvaise clé de partition créant un shard chaud (hot shard). Solution : resharding ou clé à forte cardinalité.
2. Oubli de job.commit() dans Glue : si cette instruction manque à la fin du script, les Job Bookmarks ne sont jamais persistés et le job retraite toutes les anciennes données.
3. Firehose vers Redshift : Firehose ne fait pas d'insert direct en base ; il écrit des micro-lots dans S3 puis exécute automatiquement un \`COPY\` vers Redshift.
4. Coûts explosifs sous Athena : requêter des fichiers CSV bruts non partitionnés scanne tout le bucket S3. Solution : convertir en Apache Parquet compressé (Snappy/ZSTD) et partitionner.
5. Limite Lambda dépassée : un traitement de 20 minutes échoue obligatoirement sur Lambda. Ne jamais choisir Lambda si la tâche dépasse 15 minutes.
`
  },
  {
    file: 'fiche-express-d2-gestion-magasins.md',
    title: 'Fiche Express Domaine 2 : Gestion des Magasins de Données (26 %)',
    content: `# Fiche Express Domaine 2 : Gestion des Magasins de Données (26 %)

## 1. Vue d'ensemble du Domaine 2
Le Domaine 2 compte pour 26 % de l'examen DEA-C01. Il teste la maîtrise du stockage objet (S3), des formats de tables ouverts (Apache Iceberg, S3 Tables), des entrepôts de données (Redshift), des bases NoSQL (DynamoDB) et des moteurs vectoriels (OpenSearch).

## 2. Les 12 Chiffres et Limites Critiques à Retenir
1. Durabilité Amazon S3 : 99,999999999 % (11 neufs) conçue pour tolérer la perte simultanée de 2 installations.
2. Débit S3 par préfixe : 3 500 requêtes PUT/POST/DELETE/s et 5 500 requêtes GET/s.
3. Taille maximale d'un objet S3 : 5 To (un seul PUT HTTP direct limité à 5 Go, au-delà multipart upload obligatoire).
4. S3 Glacier Deep Archive : récupération sous 12 heures (ou 48 heures en mode Bulk) ; coût de stockage le plus bas du cloud.
5. Durée minimale de rétention facturée S3 : Standard-IA = 30 jours ; Glacier Flexible = 90 jours ; Glacier Deep Archive = 180 jours.
6. Blocs de stockage Redshift : 1 Mo par bloc (stockage colonnaire avec Zone Maps min/max par bloc).
7. Redshift DISTSTYLE : AUTO (défaut), KEY (colonne de hachage), EVEN (round-robin), ALL (copie sur chaque nœud pour petites tables).
8. Redshift SORTKEY : COMPOUND (rapide si filtres sur préfixe gauche ordonné) vs INTERLEAVED (poids égal jusqu'à 8 dimensions).
9. Redshift Concurrency Scaling : 1 heure de crédit gratuit accumulée toutes les 24 heures de cluster actif.
10. DynamoDB : taille maximale d'un élément = 400 Ko ; 1 RCU = 4 Ko/s (lecture strongly consistent) ; 1 WCU = 1 Ko/s.
11. Index DynamoDB : LSI (Local) = créé uniquement à la création de la table, même PK, max 10 Go par partition ; GSI (Global) = créable à chaud à tout moment, PK différente, capacité propre.
12. Index Vectoriel OpenSearch : HNSW (haute précision, tout en RAM) vs IVF (partitionnement de Voronoï, empreinte RAM très faible pour gros volumes).

## 3. Matrice Décisionnelle d'Architecture : Quand Choisir Quoi
- Data Lake scalable avec transactions ACID et time travel : Apache Iceberg sur Amazon S3 Tables (compaction automatique).
- Data Warehouse décisionnel lourd avec jointures complexes et requêtes SQL analytiques : Amazon Redshift (nœuds RA3 avec RMS).
- Requêtage S3 direct depuis un cluster Redshift sans chargement COPY : Amazon Redshift Spectrum.
- Partage direct de données en direct entre plusieurs clusters sans duplication : Amazon Redshift Data Sharing.
- Magasin NoSQL clé-valeur avec latence sous 10 ms à toute échelle : Amazon DynamoDB.
- Journal CDC de modifications NoSQL : Amazon DynamoDB Streams (conservé 24h).
- Base transactionnelle relationnelle avec réplication Zero-ETL vers Redshift : Amazon Aurora MySQL / PostgreSQL.
- Recherche de texte intégral et recherche de similarité vectorielle sémantique : Amazon OpenSearch Service (plugin k-NN).
- Stockage de fichiers partagé NFS multi-AZ pour instances distribuées : Amazon EFS.
- Sauvegardes centralisées immuables et protégées contre ransomwares : AWS Backup Vault Lock.

## 4. Les 5 Pièges Majeurs d'Examen du Domaine 2
1. Small Files Problem sur Iceberg : sans compaction régulière ou sans Amazon S3 Tables, l'accumulation de millions de petits fichiers dégrade drastiquement les performances d'Athena et Spark.
2. Sous-provisionnement d'un GSI DynamoDB : si un GSI manque de WCU, il bloque et ralentit les écritures sur la table de base DynamoDB (throttling).
3. Data Skew sur Redshift DISTKEY : choisir une colonne de distribution à faible cardinalité ou avec beaucoup de NULL concentre toutes les données sur une seule slice physique.
4. Oublier VACUUM et ANALYZE sous Redshift : après des suppressions massives ou des COPY, le cluster reste encombré d'espace mort et le planificateur utilise des statistiques fausses.
5. Versioning et S3 CRR : la réplication cross-région échoue si le versioning n'est pas activé sur le bucket source ET sur le bucket de destination.
`
  },
  {
    file: 'fiche-express-d3-operations-support.md',
    title: 'Fiche Express Domaine 3 : Opérations et Support des Données (22 %)',
    content: `# Fiche Express Domaine 3 : Opérations et Support des Données (22 %)

## 1. Vue d'ensemble du Domaine 3
Le Domaine 3 représente 22 % de l'examen DEA-C01. Il valide les compétences opérationnelles : surveillance de la santé des flux, audit des configurations, mesure de la qualité des données (DQDL), automatisation CI/CD (IaC) et stratégies de reprise après sinistre (RTO/RPO).

## 2. Les 12 Chiffres et Limites Critiques à Retenir
1. Kinesis IteratorAgeMilliseconds : métrique critique mesurant l'écart temporel entre l'arrivée d'un message et sa lecture par le consommateur.
2. Redshift PercentageDiskSpaceUsed : alerte recommandée à 80 % (à 100 %, le cluster bascule automatiquement en mode lecture seule).
3. EMR IsIdle : métrique de détection d'inactivité du cluster pour déclencher l'arrêt automatique et éviter les coûts résiduels.
4. AWS Glue Heap Usage (\`jvm.heap.usage\`) : saturation mémoire de la JVM à surveiller pour anticiper les erreurs OutOfMemoryError.
5. Historique d'événements CloudTrail (Event History) : 90 jours conservés gratuitement par défaut pour les Management Events.
6. CloudTrail Data Events : nécessaires pour enregistrer les opérations au niveau objet (S3 GetObject/PutObject et Lambda invocations), payants à l'usage.
7. AWS Glue Data Quality : syntaxe déclarative DQDL (Data Quality Definition Language) pour profiler et filtrer les données corrompues.
8. Économie des instances Spot : jusqu'à 90 % de remise par rapport au prix à la demande, préavis de révocation de 2 minutes.
9. RTO (Recovery Time Objective) : temps maximal admissible pour rétablir le service opérationnel après une panne.
10. RPO (Recovery Point Objective) : quantité maximale admissible de données perdues exprimée en durée.
11. Règle des 4 stratégies DR : Backup & Restore (heures/jours, économique) -> Pilot Light (minutes, calcul éteint) -> Warm Standby (minutes, calcul réduit actif) -> Multi-Site Actif-Actif (instantané, coût double).
12. Amazon QuickSight SPICE : moteur de calcul en mémoire colonnaire éliminant les coûts de requêtage répétés sur Athena et Redshift.

## 3. Matrice Décisionnelle d'Architecture : Quand Choisir Quoi
- Détecter un retard d'application sur un flux en continu : CloudWatch Alarm sur \`GetRecords.IteratorAgeMilliseconds\` de Kinesis.
- Tracer quel utilisateur a supprimé ou téléchargé un fichier sensible dans S3 : AWS CloudTrail avec Data Events S3 activés.
- Vérifier en continu la conformité des ressources (ex. compartiments non chiffrés) et corriger automatiquement : AWS Config avec document d'automatisation SSM.
- Valider l'absence de doublons et de valeurs nulles dans un pipeline ETL sans code complexe : AWS Glue Data Quality (règles DQDL).
- Isoler les mauvaises lignes sans faire échouer l'ensemble du pipeline : routage conditionnel Glue vers un compartiment S3 de quarantaine.
- Réduire les coûts d'un cluster EMR exécutant des calculs Spark lourds : nœuds Task sur instances Spot (Master et Core sur On-Demand).
- Arrêter les coûts de calcul Redshift la nuit pour la pré-production : planification de pause et reprise du cluster (Cluster Pause and Resume).
- Infrastructure as Code versionnée dans Git avec déploiements atomiques : AWS CloudFormation ou AWS CDK (en Python/TypeScript).
- Centraliser des chemins et variables de pipeline sans les coder en dur : AWS Systems Manager Parameter Store.
- Reprise après sinistre avec RPO court et coût maîtrisé sans double cluster permanent : stratégie Pilot Light.
- Tableaux de bord décisionnels interactifs avec sécurité par utilisateur : Amazon QuickSight avec SPICE et Row-Level Security (RLS).

## 4. Les 5 Pièges Majeurs d'Examen du Domaine 3
1. Confondre CloudWatch et CloudTrail : CloudWatch surveille les métriques de performance et déclenche des alarmes ; CloudTrail consigne les appels d'API (qui a fait quoi).
2. Spot sur nœuds EMR Core : placer des nœuds Core sur instances Spot risque de corrompre HDFS en cas de résiliation brutale. Seuls les Task Nodes doivent être en Spot.
3. Requêtes Direct Query sous QuickSight : connecter des centaines d'utilisateurs en Direct Query sur Athena scanne le lac S3 à chaque clic, provoquant des factures massives. Préférer SPICE.
4. Règle DQDL bloquante vs Quarantaine : faire échouer un job complet pour une seule ligne corrompue viole la disponibilité opérationnelle ; la pratique recommandée est de router l'enregistrement en quarantaine.
5. Pilot Light vs Warm Standby : dans Pilot Light, les serveurs de calcul sont complètement éteints ; dans Warm Standby, un environnement de secours réduit tourne en permanence.
`
  },
  {
    file: 'fiche-express-d4-securite-gouvernance.md',
    title: 'Fiche Express Domaine 4 : Sécurité et Gouvernance des Données (18 %)',
    content: `# Fiche Express Domaine 4 : Sécurité et Gouvernance des Données (18 %)

## 1. Vue d'ensemble du Domaine 4
Le Domaine 4 représente 18 % de l'examen DEA-C01. Il valide l'expertise sur le contrôle d'accès (IAM, Lake Formation), le chiffrement (KMS), l'isolation réseau (VPC, PrivateLink), la détection de données sensibles (Macie), et la gouvernance unifiée (SageMaker Catalog, Unified Studio).

## 2. Les 12 Chiffres et Limites Critiques à Retenir
1. Règle d'évaluation des politiques IAM : un refus explicite (\`Deny\`) l'emporte TOUJOURS sur n'importe quel \`Allow\`. En l'absence de Deny et d'Allow, la décision est refusée par défaut.
2. Accès inter-comptes (Cross-Account) : requiert obligatoirement une autorisation dans la politique IAM du compte émetteur ET dans la politique de ressource du compte destinataire.
3. Rôles de service IAM : utilisation de \`sts:AssumeRole\` avec Trust Policy ciblant le service AWS (\`glue.amazonaws.com\`, \`lambda.amazonaws.com\`, \`redshift.amazonaws.com\`).
4. AWS Lake Formation : contrôle d'accès fin au niveau table, colonne, ligne (RLS) et cellule sans modifier les fichiers physiques sur S3.
5. Groupe par défaut Glue \`IAMAllowedPrincipals\` : doit obligatoirement être révoqué pour que les restrictions fines de Lake Formation soient actives.
6. Contrôle par balises Lake Formation (LF-TBAC) : gestion des permissions à grande échelle via des balises LF-tags attachées aux métadonnées.
7. Chiffrement S3 par défaut : SSE-S3 (AES-256) activé sans surcoût. SSE-KMS requis pour le contrôle des droits de déchiffrement et la traçabilité d'audit CloudTrail.
8. S3 Bucket Keys : réduit les appels d'API KMS de 99 % pour éviter le dépassement de quotas de requêtes lors des gros scans Athena.
9. VPC Gateway Endpoints : disponibles UNIQUEMENT pour Amazon S3 et Amazon DynamoDB ; entièrement GRATUITS et sans passerelle NAT.
10. VPC Interface Endpoints (AWS PrivateLink) : carte réseau virtuelle ENI avec IP privée déployée dans le sous-réseau ; payant à l'heure et au Go.
11. Amazon Macie : découverte automatique par apprentissage machine et regex de données sensibles PII (cartes bancaires, SSN, IBAN) sur S3.
12. AWS Secrets Manager : stockage sécurisé et rotation automatique périodique sans temps d'arrêt des identifiants de bases de données via fonction Lambda.

## 3. Matrice Décisionnelle d'Architecture : Quand Choisir Quoi
- Donner des droits à un job Glue sans stocker de clés d'accès : rôle IAM de service avec relation de confiance.
- Restreindre l'accès à certaines colonnes (sans salaire) et certaines lignes (pays=FR) pour un groupe d'analystes : AWS Lake Formation (Data Filters).
- Gérer les droits sur des centaines de tables sans politique individuelle : Lake Formation Tag-Based Access Control (LF-TBAC).
- Migrer vers Lake Formation sans casser les scripts existants basés sur IAM : Mode d'accès hybride (Hybrid Access Mode).
- Chiffrement avec clé dédiée dont le client gère la rotation et les droits d'audit : clé gérée par le client (CMK) dans AWS KMS.
- Répliquer un Data Lake chiffré KMS entre deux régions sans surcoût d'appels cross-régions : clés KMS Multi-Régions.
- Connecter un cluster EMR privé à S3 sans Internet et sans coût de transfert : VPC Gateway Endpoint pour Amazon S3.
- Empêcher l'exfiltration de données internes vers des buckets S3 externes : Endpoint Policy sur le VPC Endpoint S3.
- Détecter des fichiers de santé ou données bancaires non masqués dans le Data Lake : Amazon Macie.
- Renouveler les identifiants de connexion RDS tous les 30 jours sans interrompre les jobs ETL : AWS Secrets Manager avec rotation automatique.
- Protéger des emails dans un Data Lake ouvert sans risque d'attaque par tables arc-en-ciel : Hachage SHA-256 combiné à un sel secret (Salting).
- Éliminer le Data Skew lors d'une jointure Spark sur une clé asymétrique : salage de clés (Key Salting) en ajoutant un suffixe aléatoire.
- Découverte de données métier, catalogue unifié et suivi du lignage de données : Amazon SageMaker Catalog et Unified Studio (DEA-C01 v1.1).

## 4. Les 5 Pièges Majeurs d'Examen du Domaine 4
1. Oublier la politique de clé KMS : un utilisateur avec les droits \`AdministratorAccess\` ne peut pas lire un fichier S3 chiffré par une CMK KMS s'il n'est pas autorisé dans la Key Policy de la clé.
2. Fuite de données et Gateway Endpoints : un Gateway Endpoint S3 ouvre par défaut l'accès à TOUS les compartiments S3 AWS. Pour interdire l'exfiltration vers des comptes personnels, il faut définir une Endpoint Policy restrictive.
3. Hachage sans sel : un simple hachage SHA-256 sur des données prévisibles (codes postaux, sexes) est immédiatement cassable via des dictionnaires précalculés. Le salage secret est obligatoire.
4. Conflit IAM et Lake Formation : si \`IAMAllowedPrincipals\` conserve des droits sur la ressource, les restrictions Lake Formation sont ignorées par les utilisateurs disposant de droits S3.
5. Secrets Manager vs Parameter Store : pour une rotation automatique gérée des mots de passe RDS, seul Secrets Manager est valide.
`
  }
];
