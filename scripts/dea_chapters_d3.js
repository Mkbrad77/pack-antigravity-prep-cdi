export const deaChaptersD3 = [
  {
    file: 'dea-22-cloudwatch-metriques-alarmes-data.md',
    title: 'Supervision Opérationnelle des Pipelines avec Amazon CloudWatch',
    content: `# Chapitre 22 : Supervision Opérationnelle des Pipelines avec Amazon CloudWatch

## 1. Objectifs d'apprentissage
- Identifier les métriques critiques des services de données (Kinesis, Glue, EMR, Redshift, Lambda).
- Configurer Amazon CloudWatch Logs et CloudWatch Alarms avec notifications SNS.
- Détecter le ralentissement des consommateurs avec la métrique \`GetRecords.IteratorAgeMilliseconds\`.
- Comprendre les métriques de santé des clusters Redshift (CPU, HealthStatus, DiskSpace).

## 2. Explication claire : quand choisir quoi
Amazon CloudWatch est la tour de contrôle de la santé et des performances des architectures Data d'AWS :

1. Métriques clés par service de données à surveiller :
- Amazon Kinesis Data Streams :
  - \`GetRecords.IteratorAgeMilliseconds\` : mesure le retard (en millisecondes) du consommateur par rapport aux derniers enregistrements écrits dans le flux. Si cette valeur augmente régulièrement, cela signifie que le consommateur (Lambda ou KCL) est trop lent ou plante. Solution : augmenter le nombre de shards ou paralléliser les consommateurs.
  - \`WriteProvisionedThroughputExceeded\` : indique qu'un shard est saturé en écriture.
- AWS Glue ETL :
  - \`glue.driver.aggregate.elapsedTime\` : durée d'exécution totale du job.
  - \`glue.ALL.jvm.heap.usage\` : pourcentage de mémoire JVM consommé par les exécuteurs. Si cette valeur approche 100 %, le job risque d'échouer avec une erreur \`OutOfMemoryError\` (OOM). Solution : passer de G.1X à G.2X ou augmenter le nombre de DPU.
  - \`glue.driver.ExecutorAllocationManager.decommissionedExecutors\` : suivi de la mise à l'échelle dynamique.
- Amazon Redshift :
  - \`CPUUtilization\` : saturation du Leader ou des Compute Nodes.
  - \`PercentageDiskSpaceUsed\` : pourcentage d'espace disque utilisé. Alerte critique à déclencher à 80 % pour éviter le passage du cluster en mode lecture seule forcé.
  - \`HealthStatus\` : état de santé global du cluster.
- Amazon EMR :
  - \`IsIdle\` : indique si le cluster n'exécute aucune tâche Spark. Idéal pour déclencher l'arrêt automatique du cluster éphémère après 15 minutes d'inactivité.

2. CloudWatch Alarms et Actions automatisées :
- Déclenchement de notifications SNS pour avertir les ingénieurs par email/Slack.
- Déclenchement d'actions d'Auto Scaling (ex. ajout de nœuds Task EMR ou de workers Glue).
- Déclenchement d'automatisations via EventBridge ou arrêt de ressources en surcharge.

## 3. Définitions des termes clés
- IteratorAgeMilliseconds : métrique de décalage temporel d'un flux de streaming.
- CloudWatch Logs Insights : moteur de requêtes interactif pour analyser des gigaoctets de logs sans serveur avec syntaxe SQL/pipe.
- Metric Filter : règle extrayant des valeurs numériques ou comptant des occurrences de mots-clés dans les logs pour en faire une métrique CloudWatch.

## 4. Exemple concret
Alerte sur retard de consommation de streaming :
\`\`\`
[Kinesis Stream : Transactions]
              |
              v (Retard > 60 000 ms)
[Métrique IteratorAgeMilliseconds]
              |
              v
[CloudWatch Alarm (Seuil: > 1 min pendant 2 périodes)]
              |
              v
   [Action SNS : Alerte Équipe Data On-Call]
\`\`\`

## 5. Comparaisons et pièges d'examen
- IteratorAgeMilliseconds élevé : le réflexe d'examen est immédiatement d'identifier un problème côté consommateur (saturation CPU, erreur de boucle) ou un manque de shards de lecture.
- CloudWatch vs CloudTrail : CloudWatch surveille la performance et l'état opérationnel (combien de mémoire, temps de réponse) ; CloudTrail enregistre les appels d'API (qui a supprimé une table ou modifié un rôle).

## 6. Lien avec SQL, Snowflake et Databricks
La métrique IteratorAgeMilliseconds correspond au Lag Consumer dans Kafka ou à la table système \`EVENT_LOG\` dans Databricks Delta Live Tables indiquant le retard d'ingestion.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 296 à 305.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Quelle métrique Amazon CloudWatch devez-vous surveiller en priorité pour détecter qu'une application de streaming Kinesis accumule du retard par rapport au flux entrant de données ?
   - A) GetRecords.IteratorAgeMilliseconds (Bonne réponse).
   - B) PutRecord.Success.
   - C) IncomingBytes.
   - D) ReadProvisionedThroughputExceeded.
2. Un job AWS Glue ETL plante régulièrement avec une erreur OutOfMemoryError (OOM) lors d'une jointure massive. Quelle action de dimensionnement résout ce problème ?
   - A) Augmenter la capacité des workers de G.1X vers G.2X pour doubler la RAM par exécuteur (Bonne réponse).
   - B) Réduire le nombre de DPU à 2.
   - C) Désactiver les Job Bookmarks.
   - D) Remplacer Spark par un script bash.
`
  },
  {
    file: 'dea-23-cloudtrail-aws-config-audit.md',
    title: 'Audit de Sécurité et Conformité : AWS CloudTrail et AWS Config',
    content: `# Chapitre 23 : Audit de Sécurité et Conformité : AWS CloudTrail et AWS Config

## 1. Objectifs d'apprentissage
- Comprendre le rôle d'AWS CloudTrail pour la traçabilité intégrale des appels d'API.
- Distinguer les événements de gestion (Management Events) et les événements de données (Data Events).
- Utiliser AWS Config pour auditer en continu les configurations des ressources de données.
- Configurer la remédiation automatique des non-conformités de sécurité.

## 2. Explication claire : quand choisir quoi
La gouvernance des plateformes de données exige de savoir qui accède aux données et si les ressources respectent les règles de sécurité fixées par l'organisation :

1. AWS CloudTrail (L'enregistreur de vol API) :
- Enregistre chaque appel d'API effectué sur le compte AWS (via console, CLI, SDK ou services internes).
- Détails enregistrés : qui (identité IAM), quand (horodatage UTC), quoi (service et action), d'où (adresse IP source).
- Deux grandes catégories d'événements :
  - Événements de gestion (Management Events) : opérations sur le plan de contrôle (ex. création d'un bucket S3, modification d'une règle de sécurité, démarrage d'un cluster EMR). Activés gratuitement par défaut pour les 90 derniers jours (Event History).
  - Événements de données (Data Events) : opérations sur le plan de données (ex. requêtes \`GetObject\` / \`PutObject\` sur S3, invocations de fonctions Lambda). Désactivés par défaut en raison du volume massif de logs généré, facturés séparément. Essentiels pour tracer qui a lu un fichier sensible dans le Data Lake.
- CloudTrail Insights : détecte automatiquement les anomalies de volume d'appels d'API (ex. pics anormaux de requêtes IAM ou de démarrages d'instances).

2. AWS Config (L'auditeur continu de configuration) :
- Enregistre l'historique complet de configuration de vos ressources AWS et compare leur état à des règles de conformité.
- Règles gérées prédéfinies utiles en Data Engineering :
  - \`s3-bucket-public-read-prohibited\` : vérifie qu'aucun bucket S3 n'autorise la lecture publique.
  - \`s3-bucket-server-side-encryption-enabled\` : vérifie que tous les buckets S3 activent le chiffrement au repos.
  - \`redshift-cluster-encrypted\` : vérifie que tous les clusters Redshift sont chiffrés.
- Remédiation automatique : peut exécuter un document d'automatisation AWS Systems Manager (SSM) pour corriger immédiatement une ressource non conforme (ex. bloquer l'accès public S3 dès sa détection).

## 3. Définitions des termes clés
- Sentier CloudTrail (Trail) : configuration acheminant les événements d'une ou plusieurs régions vers un compartiment S3 sécurisé et vers CloudWatch Logs.
- Règle AWS Config : condition logique évaluant la conformité d'une configuration de ressource.
- Timeline de configuration : vue chronologique de chaque modification subie par une ressource depuis sa création.

## 4. Exemple concret
Détection et correction automatique d'un compartiment de Data Lake non chiffré :
\`\`\`
[Utilisateur crée s3://nouveau-datalake sans chiffrement KMS]
                        |
                        v
         [AWS Config détecte la non-conformité]
                        |
                        v
     [Document SSM Automation : Activer SSE-KMS]
                        |
                        v
       [Ressource redevient conforme en 30 sec]
\`\`\`

## 5. Comparaisons et pièges d'examen
- CloudTrail vs AWS Config : CloudTrail répond à la question « QUI a fait QUOI et QUAND » ; AWS Config répond à la question « COMMENT cette ressource est-elle configurée MAINTENANT et respecte-t-elle nos règles ? ».
- Data Events S3 : pour savoir quel utilisateur a téléchargé un fichier CSV confidentiel dans un bucket S3, vous devez obligatoirement activer les Data Events dans CloudTrail (les Management Events ne tracent pas les opérations GET/PUT d'objets).

## 6. Lien avec SQL, Snowflake et Databricks
CloudTrail correspond aux tables d'audit d'accès système dans Snowflake (\`ACCESS_HISTORY\` et \`QUERY_HISTORY\`) et à l'Audit Log d'Unity Catalog dans Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 306 à 315.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Un auditeur de sécurité vous demande de fournir la preuve de l'identité de l'utilisateur qui a téléchargé un fichier financier hautement confidentiel depuis un compartiment S3 hier soir. Quel service et type de journal devez-vous consulter ?
   - A) AWS CloudTrail avec les Data Events activés pour Amazon S3 (Bonne réponse).
   - B) AWS CloudTrail avec les Management Events uniquement.
   - C) Amazon CloudWatch Billing Alarms.
   - D) AWS Trusted Advisor.
2. Quel service AWS permet d'alerter automatiquement et de remédier en continu si un ingénieur démarre un cluster Redshift sans chiffrement de stockage ?
   - A) AWS Config avec une règle de conformité et une remédiation automatisée (Bonne réponse).
   - B) AWS Secrets Manager.
   - C) AWS Glue DataBrew.
   - D) Amazon Athena.
`
  },
  {
    file: 'dea-24-glue-data-quality.md',
    title: 'Contrôle et Validation de Données avec AWS Glue Data Quality',
    content: `# Chapitre 24 : Contrôle et Validation de Données avec AWS Glue Data Quality

## 1. Objectifs d'apprentissage
- Comprendre l'intégration d'AWS Glue Data Quality dans les pipelines de données (compétence clé DEA-C01).
- Maîtriser le langage de définition de règles de qualité DQDL (Data Quality Definition Language).
- Mettre en œuvre le profilage automatisé de données et la génération de règles.
- Bloquer conditionnellement l'exécution d'un pipeline ETL en cas de non-respect des seuils de qualité.

## 2. Explication claire : quand choisir quoi
Dans un Data Lake moderne, la qualité des données est indispensable pour éviter que des données corrompues ou incomplètes ne polluent les tableaux de bord décisionnels et les modèles d'apprentissage machine :

1. AWS Glue Data Quality :
- Qu'est-ce que c'est : une fonctionnalité managée sans serveur intégrée à AWS Glue (jobs ETL, Glue Studio et Glue Data Catalog) permettant de mesurer et surveiller la qualité des données au repos ou en transit.
- Fonctionnement :
  - Analyse vos tables ou DynamicFrames.
  - Recommande automatiquement un jeu de règles de qualité initial grâce au profilage statistique (Data Profiling).
  - Vous permet d'éditer ou d'enrichir ces règles via un langage déclaratif simple appelé DQDL.

2. Le langage DQDL (Data Quality Definition Language) :
- Syntaxe déclarative et lisible par des humains.
- Exemples de règles DQDL fréquentes :
  - \`RowCount > 0\` : vérifie que le fichier entrant n'est pas vide.
  - \`IsComplete "id_client"\` : vérifie qu'il n'y a aucune valeur nulle dans la clé primaire.
  - \`IsUnique "id_transaction"\` : vérifie l'absence absolue de doublons d'identifiants.
  - \`ColumnValues "statut" in ["PAYE", "ANNULE", "EN_ATTENTE"]\` : contrôle l'intégrité référentielle des valeurs autorisées.
  - \`ColumnDataType "montant" = "Decimal"\` : valide le type de données.

3. Actions conditionnelles dans les pipelines Glue :
- Deux nœuds de traitement dans Glue Studio :
  - Évaluation de la qualité (Evaluate Data Quality) : applique les règles DQDL sur le flux.
  - Filtrage conditionnel : permet d'acheminer les lignes valides vers la table cible Curated du Data Lake et d'isoler automatiquement les lignes rejetées dans un compartiment S3 de quarantaine (Dead Letter Storage) pour analyse.
- Publication des métriques vers Amazon CloudWatch : permet de suivre l'évolution du score de qualité dans le temps et de déclencher une alarme SNS en cas de dégradation.

## 3. Définitions des termes clés
- DQDL : langage standard ouvert développé par AWS pour exprimer des contraintes de qualité de données.
- Quarantaine (Data Quarantine) : stockage isolé accueillant les enregistrements violant les contraintes métier pour investigations ultérieures sans bloquer l'ingestion générale.
- Profiling : calcul statistique de la distribution des valeurs, des valeurs nulles, des min/max et de l'unicité d'une colonne.

## 4. Exemple concret
Jeu de règles DQDL typique pour une table de ventes :
\`\`\`text
Rules = [
    RowCount > 100,
    IsComplete "id_commande",
    IsUnique "id_commande",
    ColumnValues "montant" >= 0,
    ColumnValues "devise" in ["EUR", "USD", "GBP"],
    Completeness "email_client" >= 0.95
]
\`\`\`

## 5. Comparaisons et pièges d'examen
- Glue Data Quality vs Scripts de validation personnalisés en PySpark : coder soi-même des vérifications en Spark nécessite du temps de développement et de maintenance ; DQDL est déclaratif, géré sans serveur et s'intègre nativement avec CloudWatch et EventBridge sans code additionnel.
- Bloquer le pipeline ou router vers la quarantaine : pour l'examen, isoler les mauvaises données dans un dossier de quarantaine tout en laissant passer les données valides est généralement la recommandation privilégiée pour maintenir la disponibilité opérationnelle du système.

## 6. Lien avec SQL, Snowflake et Databricks
Glue Data Quality répond exactement aux mêmes objectifs que le framework open source Great Expectations, les attentes de données (Data Expectations) dans Databricks Delta Live Tables, ou les contraintes de table et politiques de qualité dans Snowflake.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 148 à 150.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Quel langage déclaratif est utilisé par AWS Glue Data Quality pour définir des règles telles que l'unicité des colonnes, l'absence de valeurs nulles et les plages de valeurs autorisées ?
   - A) DQDL (Data Quality Definition Language) (Bonne réponse).
   - B) SQL PL/pgSQL.
   - C) YAML Ansible.
   - D) JSON Schema v4.
2. Comment une équipe data peut-elle empêcher des enregistrements invalides de polluer un entrepôt de données tout en permettant au pipeline de continuer à traiter les enregistrements valides ?
   - A) Utiliser le nœud Evaluate Data Quality dans Glue pour router les enregistrements non conformes vers un compartiment S3 de quarantaine (Bonne réponse).
   - B) Supprimer la table de destination.
   - C) Réduire le nombre de DPU à zéro.
   - D) Désactiver la surveillance CloudWatch.
`
  },
  {
    file: 'dea-25-optimisation-couts-performance-data.md',
    title: 'Optimisation des Coûts et Performances des Plateformes de Données',
    content: `# Chapitre 25 : Optimisation des Coûts et Performances des Plateformes de Données

## 1. Objectifs d'apprentissage
- Identifier les principaux postes de coûts des architectures Data AWS.
- Optimiser les dépenses de calcul (EMR Spot, Glue DPU, Redshift Pausing).
- Réduire les coûts de stockage S3 grâce aux politiques de cycle de vie et S3 Intelligent-Tiering.
- Utiliser AWS Cost Explorer et AWS Budgets pour piloter la rentabilité des pipelines.

## 2. Explication claire : quand choisir quoi
L'ingénieur de données certifié DEA-C01 doit concevoir des architectures qui maximisent les performances tout en minimisant la facture cloud :

1. Optimisation du stockage :
- Éliminer les requêtes inutiles sur S3 : regrouper les petits fichiers (compaction), convertir en Apache Parquet ou Iceberg et partitionner pour réduire les volumes analysés par Athena et Redshift Spectrum (5 USD / To scanné).
- Cycle de vie automatisé : basculer les données brutes peu consultées vers S3 Standard-IA après 30 jours, puis vers S3 Glacier Flexible Retrieval ou Deep Archive pour l'archivage légal.
- Activer S3 Intelligent-Tiering pour tous les compartiments où les accès aux données ne suivent pas un motif prévisible, sans risque de frais de récupération.

2. Optimisation du calcul (Compute) :
- Amazon EMR :
  - Déployer les nœuds de tâches (Task Nodes) sur des instances Spot avec une économie pouvant atteindre 90 %.
  - Utiliser des clusters éphémères (transient clusters) qui démarrent, exécutent le job Spark et se terminent immédiatement, ou utiliser EMR Serverless pour ne payer que les secondes CPU/RAM consommées.
- AWS Glue ETL :
  - Ajuster le nombre maximal de DPU (\`MaxCapacity\` / \`NumberOfWorkers\`) pour éviter le sur-provisionnement.
  - Activer la mise à l'échelle automatique (Auto Scaling) de Glue pour que le service ajoute et retire des workers dynamiquement selon les étapes du job.
  - Utiliser le type de worker adéquat : G.1X par défaut, G.2X uniquement pour les gros jobs avec besoin important de RAM.
- Amazon Redshift :
  - Utiliser la suspension de cluster (Cluster Pause and Resume) pour les environnements de test et de développement arrêtés la nuit et le week-end.
  - Dimensionner avec des nœuds RA3 pour faire évoluer le stockage et le calcul de manière totalement indépendante.
  - Concurrency Scaling : exploiter les crédits gratuits accumulés chaque jour (1 heure de Concurrency Scaling offerte toutes les 24h d'exécution du cluster).

3. Suivi et gouvernance financière (FinOps) :
- Cost Allocation Tags : baliser systématiquement chaque ressource avec des balises \`Projet\`, \`Environnement\` et \`Proprietaire\`.
- AWS Budgets : configurer des alertes prédictives pour être notifié par email ou SNS dès que les dépenses estimées dépassent 80 % du budget alloué.

## 3. Définitions des termes clés
- FinOps : pratique opérationnelle alliant ingénieurs et financiers pour maximiser la valeur métier de chaque dollar dépensé dans le cloud.
- Cluster éphémère (Transient Cluster) : cluster informatique provisionné à la demande pour un calcul unique et détruit immédiatement après achèvement.
- DPU Scaling : ajustement dynamique du nombre d'unités de traitement Glue au cours de l'exécution.

## 4. Exemple concret
Calcul des gains d'optimisation d'un pipeline quotidien :
\`\`\`
Scénario initial (Fichiers CSV sur S3 + Requêtes Athena quotidiennes) :
- 10 To scannés par jour x 30 jours = 300 To/mois x 5 USD = 1 500 USD/mois

Scénario optimisé (Parquet compressé ZSTD + Partitionnement par date) :
- Volume scanné réduit de 90 % -> 1 To scanné par jour
- 30 To/mois x 5 USD = 150 USD/mois (Économie immédiate de 90 % soit 1 350 USD/mois)
\`\`\`

## 5. Comparaisons et pièges d'examen
- Spot sur EMR Master : ne JAMAIS placer le nœud Master ou les Core Nodes sur instances Spot. Seuls les Task Nodes doivent être configurés en Spot.
- S3 Intelligent-Tiering vs S3 Standard-IA : Intelligent-Tiering applique des frais mensuels minimes de surveillance par objet, mais ne facture aucun frais de récupération par Go ; Standard-IA applique des frais de récupération par Go lors de chaque lecture.

## 6. Lien avec SQL, Snowflake et Databricks
Ces pratiques FinOps s'appliquent identiquement à la gestion des crédits Snowflake (auto-suspend des Virtual Warehouses après 1 minute d'inactivité) et au dimensionnement des clusters Databricks avec Photon et pools d'instances Spot.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 316 à 325.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Quel changement d'architecture apporte la réduction de coût la plus drastique pour des requêtes analytiques récurrentes exécutées sous Amazon Athena sur un lac de données S3 ?
   - A) Convertir les fichiers de données de CSV vers Apache Parquet et partitionner par date (Bonne réponse).
   - B) Passer toutes les requêtes en mode synchrone JDBC.
   - C) Doubler le nombre de sous-réseaux VPC.
   - D) Stocker les données exclusivement sur des volumes EBS gp3.
2. Pour un environnement Amazon Redshift de pré-production utilisé uniquement du lundi au vendredi de 8h à 18h, quelle action élimine les coûts de calcul hors des heures ouvrées ?
   - A) Configurer la mise en pause et la reprise programmées du cluster (Cluster Pause and Resume) (Bonne réponse).
   - B) Activer Concurrency Scaling en continu.
   - C) Remplacer les disques RA3 par des disques magnétiques sc1.
   - D) Supprimer le nœud Leader chaque soir.
`
  },
  {
    file: 'dea-26-deploiement-ci-cd-cloudformation-cdk.md',
    title: 'Automatisation et Déploiement : CloudFormation, AWS CDK et SSM',
    content: `# Chapitre 26 : Automatisation et Déploiement : CloudFormation, AWS CDK et SSM

## 1. Objectifs d'apprentissage
- Comprendre l'Infrastructure as Code (IaC) avec AWS CloudFormation et AWS CDK.
- Déployer des architectures Data reproductibles (S3, Glue, Athena, Step Functions).
- Sécuriser et centraliser les variables de configuration avec AWS Systems Manager Parameter Store.
- Appliquer les bonnes pratiques CI/CD aux pipelines de données (environnements dev, test, prod).

## 2. Explication claire : quand choisir quoi
L'industrialisation des plateformes de données exige que toutes les infrastructures soient versionnées dans Git et déployées automatiquement sans action manuelle dans la console :

1. AWS CloudFormation :
- Qu'est-ce que c'est : le service d'IaC fondamental d'AWS permettant de décrire l'ensemble de vos ressources dans des fichiers modèles déclaratifs JSON ou YAML.
- Avantages : déploiements atomiques (tout réussit ou CloudFormation effectue un rollback automatique à l'état précédent), reproductibilité exacte entre environnements dev, test et prod, détection des dérives de configuration (Drift Detection).
- Exemples de ressources data gérées : tables Glue Catalog, compartiments S3, machines à états Step Functions, clusters Redshift, sujets SNS.

2. AWS Cloud Development Kit (AWS CDK) :
- Qu'est-ce que c'est : framework de développement open source permettant de définir votre infrastructure cloud en utilisant des langages de programmation modernes et familiers (TypeScript, Python, Java).
- Fonctionnement : le code CDK compile et synthétise des modèles AWS CloudFormation robustes.
- Avantages en Data Engineering : permet d'écrire des abstractions réutilisables (Constructs) encapsulant les bonnes pratiques de sécurité (ex. un Construct \`SecureDataLakeBucket\` activant automatiquement le chiffrement KMS, le blocage public et les règles de cycle de vie).

3. AWS Systems Manager Parameter Store (SSM) :
- Qu'est-ce que c'est : magasin sécurisé et hautement disponible de gestion des paramètres de configuration et secrets légers.
- Types de paramètres :
  - \`String\` : chaînes de caractères standards (ex. URLs d'API, noms de compartiments S3, chemins de données).
  - \`StringList\` : listes de valeurs séparées par des virgules.
  - \`SecureString\` : chaînes de caractères automatiquement chiffrées au repos via AWS KMS (ex. jetons d'accès, mots de passe).
- Cas d'usage Data : centraliser les chemins S3 et les identifiants d'environnements pour que les scripts Glue ou les fonctions Lambda n'aient jamais de valeurs en dur dans leur code source.

## 3. Définitions des termes clés
- Stack (Pile) : ensemble de ressources AWS gérées comme une unité unique par CloudFormation.
- Drift Detection : fonctionnalité comparant la configuration réelle des ressources avec le modèle CloudFormation pour repérer les modifications manuelles non tracées.
- Construct CDK : composant de base d'une application CDK représentant une ressource unique ou une architecture complète.

## 4. Exemple concret
Modèle CloudFormation déployant un compartiment S3 sécurisé et une table Glue :
\`\`\`yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Infrastructure Data Lake S3 et Glue
Resources:
  DataLakeRawBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "datalake-raw-\${AWS::AccountId}"
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256

  RawDatabase:
    Type: AWS::Glue::Database
    Properties:
      CatalogId: !Ref AWS::AccountId
      DatabaseInput:
        Name: raw_data_db
\`\`\`

## 5. Comparaisons et pièges d'examen
- CloudFormation vs CDK : CDK utilise du vrai code (Python, TypeScript) avec boucles et typage pour générer des modèles CloudFormation ; CloudFormation est le moteur d'exécution sous-jacent qui déploie les stacks.
- SSM Parameter Store vs Secrets Manager : SSM Parameter Store est idéal pour la configuration générale et les paramètres simples à faible coût ; Secrets Manager est spécialisé dans les secrets de bases de données avec rotation automatique native et chiffrement KMS obligatoire.

## 6. Lien avec SQL, Snowflake et Databricks
CloudFormation et CDK jouent le même rôle d'IaC que Terraform appliqué aux ressources Snowflake (création de warehouses, rôles et bases) ou aux workspaces Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 326 à 335.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Quel outil permet à un ingénieur data d'écrire son infrastructure de pipeline (S3, Glue, Lambda) directement en Python tout en bénéficiant de la tolérance aux pannes et des rollbacks automatiques de CloudFormation ?
   - A) AWS Cloud Development Kit (AWS CDK) (Bonne réponse).
   - B) AWS OpsWorks.
   - C) Amazon QuickSight.
   - D) Une commande curl manuelle.
2. Quel service AWS est le plus adapté et économique pour stocker et distribuer des paramètres de configuration de pipelines sans valeurs codées en dur dans les scripts Glue ?
   - A) AWS Systems Manager Parameter Store (Bonne réponse).
   - B) Amazon DynamoDB Accelerator (DAX).
   - C) Amazon FSx for Lustre.
   - D) Amazon S3 Glacier Deep Archive.
`
  },
  {
    file: 'dea-27-reprise-apres-sinistre-rto-rpo.md',
    title: 'Résilience et Reprise après Sinistre (Disaster Recovery) pour la Data',
    content: `# Chapitre 27 : Résilience et Reprise après Sinistre (Disaster Recovery) pour la Data

## 1. Objectifs d'apprentissage
- Comprendre les indicateurs RTO (Recovery Time Objective) et RPO (Recovery Point Objective).
- Maîtriser les 4 stratégies officielles de Disaster Recovery (DR) sur AWS.
- Mettre en place la réplication des données entre régions (S3 CRR, Redshift, Aurora).
- Concevoir des architectures résilientes aux pannes régionales majeures.

## 2. Explication claire : quand choisir quoi
La résilience garantit qu'une défaillance d'infrastructure ou la perte complète d'un centre de données ou d'une région AWS ne provoque pas de perte de données irrémédiable ni d'arrêt prolongé des activités :

1. Les deux métriques fondamentales de Disaster Recovery :
- RPO (Recovery Point Objective) : volume maximal admissible de données perdues en cas de sinistre, mesuré en durée. Exemple : un RPO de 15 minutes signifie que le système ne doit pas perdre plus de 15 minutes de transactions récentes.
- RTO (Recovery Time Objective) : durée maximale admissible pour restaurer le service opérationnel après le sinistre. Exemple : un RTO de 2 heures signifie que les utilisateurs doivent pouvoir réinterroger les bases dans les 2 heures suivant l'incident.

2. Les 4 stratégies de reprise après sinistre (du moins cher au plus résilient) :
1. Sauvegarde et restauration (Backup & Restore) :
   - Sauvegardes régulières stockées sur S3 et répliquées vers une autre région via AWS Backup.
   - En cas de sinistre : reconstruction complète de l'infrastructure via CloudFormation et restauration des données.
   - Coût : très faible. RPO : plusieurs heures. RTO : plusieurs heures à plusieurs jours.
2. Veilleuse (Pilot Light) :
   - Les données critiques sont répliquées en continu vers la région secondaire (ex. réplication S3 CRR et réplicas Aurora multi-régions).
   - Les serveurs de calcul (EMR, EC2, Glue) sont éteints ou réduits à zéro instance.
   - En cas de sinistre : les serveurs de calcul sont instanciés rapidement dans la région secondaire.
   - Coût : faible. RPO : quelques minutes. RTO : quelques dizaines de minutes.
3. Attente chaude (Warm Standby) :
   - Une version réduite mais totalement fonctionnelle de l'environnement tourne en permanence dans la région secondaire (ex. cluster Redshift sous-dimensionné).
   - En cas de sinistre : mise à l'échelle instantanée des instances secondaires pour absorber le trafic nominal.
   - Coût : modéré. RPO : quelques secondes. RTO : quelques minutes.
4. Multi-sites actif-actif (Multi-Site Active-Active) :
   - Deux environnements complets et identiques traitent le trafic simultanément dans deux régions distinctes.
   - Coût : le plus élevé (facture doublée). RPO : quasi nul. RTO : quasi instantané.

## 3. Définitions des termes clés
- RTO : temps nécessaire pour rétablir les opérations après un incident.
- RPO : délai maximal acceptable de perte de transactions.
- Failover (Basculement) : passage automatique ou manuel des opérations vers l'environnement de secours.

## 4. Exemple concret
Architecture de Disaster Recovery de type Pilot Light :
\`\`\`
Région Principale (eu-west-1)                   Région de Secours (eu-central-1)
[Data Lake S3 Principal] ------ (S3 CRR) -----> [Data Lake S3 Réplique]
[Aurora PostgreSQL Master] --- (Read Replica) -> [Aurora PostgreSQL Réplique]
[Clusters EMR / Glue Actifs]                    [Templates CloudFormation Prêts (Calcul Éteint)]
\`\`\`

## 5. Comparaisons et pièges d'examen
- Pilot Light vs Warm Standby : dans Pilot Light, le calcul est ÉTEINT et ne tourne pas jusqu'au sinistre ; dans Warm Standby, une infrastructure minimale tourne EN PERMANENCE et traite une portion du trafic ou est prête à encaisser la charge immédiatement.
- Arbitrage RTO/RPO vs Coût : plus les exigences de RTO et RPO approchent de zéro, plus les coûts augmentent de manière exponentielle.

## 6. Lien avec SQL, Snowflake et Databricks
Ce modèle correspond aux configurations de réplication multi-régions et multi-clouds de Snowflake (Replication and Failover Groups) garantissant qu'un compte secondaire peut prendre le relais instantanément en cas de panne AWS régionale.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 336 à 345.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Une entreprise exige un RPO de 5 minutes et un RTO de 30 minutes pour sa plateforme de données en cas de panne régionale, tout en évitant de payer un double cluster complet actif 24h/24. Quelle stratégie de Disaster Recovery est recommandée ?
   - A) La stratégie Pilot Light avec réplication continue des données et calcul provisionné au moment du sinistre (Bonne réponse).
   - B) Multi-Site Actif-Actif complet.
   - C) Sauvegarde hebdomadaire sur bande magnétique hors ligne.
   - D) La suppression des sauvegardes multi-régions.
2. Quelle métrique définit la quantité maximale acceptable de données perdues lors d'une panne d'infrastructure, exprimée en durée ?
   - A) Le RPO (Recovery Point Objective) (Bonne réponse).
   - B) Le RTO (Recovery Time Objective).
   - C) L'IOPS maximal.
   - D) Le temps de latence DNS.
`
  },
  {
    file: 'dea-28-quicksight-visualisation-spice.md',
    title: 'Visualisation et Analytique Métier avec Amazon QuickSight',
    content: `# Chapitre 28 : Visualisation et Analytique Métier avec Amazon QuickSight

## 1. Objectifs d'apprentissage
- Comprendre l'architecture d'Amazon QuickSight et son moteur SPICE en mémoire.
- Différencier les requêtes directes (Direct Query) et l'ingestion en mémoire SPICE.
- Configurer la sécurité au niveau ligne (Row-Level Security - RLS) pour cloisonner les accès.
- Connecter QuickSight à Athena, Redshift, S3 et des bases relationnelles.

## 2. Explication claire : quand choisir quoi
Amazon QuickSight est le service de Business Intelligence (BI) sans serveur d'AWS permettant de créer et publier des tableaux de bord interactifs modernes :

1. Le moteur de calcul SPICE (Superfast, Parallel, In-memory Calculation Engine) :
- Qu'est-ce que c'est : un moteur en mémoire distribué et colonnaire conçu pour exécuter des calculs analytiques et des agrégations complexes en quelques fractions de seconde.
- SPICE vs Direct Query :
  - Ingestion SPICE : les données sont copiées et indexées dans la mémoire vive de QuickSight. Les tableaux de bord se chargent instantanément sans interroger la source sous-jacente. Protège la base opérationnelle (Athena ou Redshift) contre les milliers de requêtes générées par les utilisateurs métier. Permet des planifications de rafraîchissement régulières (horaires, quotidiennes).
  - Requête directe (Direct Query) : chaque interaction ou filtre sur le tableau de bord envoie une requête SQL directe à la base source (ex. Amazon Redshift ou Athena). Recommandé lorsque les données doivent être à jour à la seconde près ou que le jeu de données dépasse la taille maximale autorisée par SPICE.

2. Cloisonnement et sécurité : Row-Level Security (RLS) :
- Qu'est-ce que c'est : mécanisme permettant de restreindre les lignes d'un jeu de données visualisables par chaque utilisateur ou groupe d'utilisateurs.
- Mise en œuvre : création d'un jeu de données de contrôle d'accès dans QuickSight associant le nom d'utilisateur IAM ou l'adresse email à des filtres de valeurs (ex. l'utilisateur \`jean@entreprise.com\` ne voit que les lignes où \`region = 'EMEA'\`).
- Supporte également le Column-Level Security (CLS) pour masquer les colonnes sensibles (ex. numéro de carte bancaire, salaire).

3. Fonctionnalités avancées pour la Data :
- Amazon Q in QuickSight (nouveauté DEA-C01 v1.1) : permet aux utilisateurs métier de poser des questions en langage naturel (« Quel a été notre chiffre d'affaires le mois dernier par catégorie ? ») et génère automatiquement les visualisations et récits exécutifs correspondants.

## 3. Définitions des termes clés
- SPICE : moteur de stockage et de calcul en mémoire accélérant les tableaux de bord QuickSight.
- RLS (Row-Level Security) : filtrage dynamique des lignes selon l'identité de la session utilisateur.
- Direct Query : mode d'interrogation envoyant le SQL directement à la source de données sans mise en cache.

## 4. Exemple concret
Table de règles RLS pour restreindre les données par utilisateur :
\`\`\`csv
UserName,CodePays
arn:aws:iam::123456789012:user/Alice,FR
arn:aws:iam::123456789012:user/Bob,DE
arn:aws:iam::123456789012:user/Charlie,UK
\`\`\`
Lorsqu'Alice ouvre le tableau de bord, QuickSight filtre automatiquement les visualisations pour ne lui montrer que les lignes dont la colonne \`CodePays\` vaut 'FR'.

## 5. Comparaisons et pièges d'examen
- SPICE vs Direct Query pour les coûts Athena : si 100 utilisateurs consultent un tableau de bord connecté en Direct Query à Athena, chaque rafraîchissement scanne des gigaoctets de données sur S3, faisant exploser les coûts ; charger les données une fois par jour dans SPICE stabilise la facture à un montant prévisible dérisoire.
- Limites de capacité SPICE : chaque compte dispose de quotas de mémoire SPICE par utilisateur, extensibles par blocs de gigaoctets payants.

## 6. Lien avec SQL, Snowflake et Databricks
QuickSight s'intègre nativement comme outil de BI au-dessus de Snowflake et de Databricks SQL Warehouses via des connecteurs managés optimisés avec authentification IAM ou SSO.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 346 à 355.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Quel mécanisme d'Amazon QuickSight garantit que chaque responsable régional ne puisse visualiser que les données de ventes de sa propre zone géographique sur un tableau de bord partagé ?
   - A) La sécurité au niveau ligne (Row-Level Security - RLS) (Bonne réponse).
   - B) La duplication du tableau de bord en 50 versions distinctes.
   - C) La création de comptes AWS séparés pour chaque responsable.
   - D) L'activation d'Amazon Inspector.
2. Pour éviter de payer des frais d'analyse Amazon Athena répétés chaque fois qu'un utilisateur clique sur un filtre d'un tableau de bord de consultation fréquent, quel mode de données devez-vous privilégier ?
   - A) L'ingestion en mémoire SPICE avec rafraîchissement planifié (Bonne réponse).
   - B) Le mode Direct Query systématique.
   - C) L'écriture directe sur bande magnétique.
   - D) L'exécution de requêtes sans cache via l'API REST.
`
  }
];
