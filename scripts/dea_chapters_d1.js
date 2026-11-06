export const deaChaptersD1 = [
  {
    file: 'dea-01-ingestion-kinesis-streams-firehose.md',
    title: 'Ingestion en Temps Réel : Kinesis Data Streams vs Firehose vs Managed Flink',
    content: `# Chapitre 1 : Ingestion en Temps Réel : Kinesis Data Streams vs Firehose vs Managed Flink

## 1. Objectifs d'apprentissage
- Différencier l'architecture et les cas d'usage de Kinesis Data Streams et Kinesis Data Firehose.
- Comprendre les mécanismes de mise en mémoire tampon (buffer size et buffer interval) de Firehose.
- Savoir quand ajouter Amazon Managed Service for Apache Flink pour les fenêtres temporelles complexes.
- Maîtriser le partitionnement par Shard et le dimensionnement de débit.

## 2. Explication claire : quand choisir quoi
L'écosystème Amazon Kinesis traite les flux de données en continu à grande échelle :

1. Amazon Kinesis Data Streams (KDS) :
- Qu'est-ce que c'est : un bus d'événements persistant en temps réel à faible latence (70 ms à 200 ms).
- Quand le choisir : lorsque plusieurs consommateurs indépendants doivent lire le même flux en parallèle, lorsqu'un traitement personnalisé temps réel est requis (via Lambda ou KCL), ou lorsqu'un rejeu des données sur 24 heures à 365 jours est indispensable.
- Capacité : géré par Shards (1 Mo/s en entrée, 2 Mo/s en sortie par shard) ou en mode On-Demand (mise à l'échelle automatique).

2. Amazon Data Firehose (anciennement Kinesis Data Firehose) :
- Qu'est-ce que c'est : un service entièrement managé de livraison sans serveur vers des destinations spécifiques (S3, Redshift, OpenSearch, Splunk, tables Apache Iceberg).
- Quand le choisir : pour ingérer des flux directement dans un Data Lake ou un entrepôt sans coder de consommateur personnalisé.
- Tampon obligatoire : Firehose accumule les données avant écriture selon deux seuils : taille du tampon (1 Mo à 128 Mo) ou intervalle de temps (60 s à 900 s). Le premier seuil atteint déclenche la livraison. Firehose ne permet donc pas du temps réel strict sous la seconde (near real-time).
- Transformation à la volée : peut invoquer une fonction AWS Lambda pour transformer les enregistrements (décompression, enrichissement, conversion JSON vers Apache Parquet/ORC via AWS Glue).

3. Amazon Managed Service for Apache Flink :
- Quand le choisir : pour exécuter des requêtes SQL ou du code Java/Scala sur des flux continus avec fenêtrage temporel glissant (sliding/tumbling windows) ou détection d'anomalies avec état (stateful stream processing).

## 3. Définitions des termes clés
- Shard : unité de débit de base dans Kinesis Data Streams (1 000 enregistrements/s ou 1 Mo/s en écriture).
- Partition Key : clé déterminant dans quel shard un enregistrement est écrit (hachage MD5).
- KCL (Kinesis Client Library) : bibliothèque gérant la répartition des shards entre plusieurs instances de calcul consommatrices via DynamoDB pour le suivi des points de contrôle (checkpoints).

## 4. Exemple concret
Flux de clics Web haute fréquence :
\`\`\`
[Clients Web] -> [Kinesis Data Streams]
                      |--> [Lambda (alertes fraudes < 1s)]
                      |--> [Firehose] -> [Buffer: 60s / 64 Mo] -> [Format Parquet] -> [Amazon S3]
\`\`\`

## 5. Comparaisons et pièges d'examen
- Firehose vers Redshift : Firehose ne charge pas directement dans Redshift ligne par ligne : il écrit d'abord des micro-lots dans un compartiment S3 intermédiaire, puis exécute automatiquement une commande \`COPY\` vers Redshift.
- Kinesis Data Streams vs Firehose : Firehose n'a pas de concept de rejeu de flux (les données livrées sont purgées) et a un délai minimal de 60 secondes pour les conversions Parquet. KDS conserve les données de 1 à 365 jours et permet la lecture sous la seconde.
- Erreur ProvisionedThroughputExceededException : survient lorsqu'un shard dépasse 1 Mo/s ou 1 000 écritures/s. Solution : augmenter le nombre de shards (resharding) ou utiliser une clé de partition à forte cardinalité pour éviter les shards chauds (hot shards).

## 6. Lien avec SQL, Snowflake et Databricks
Firehose vers S3 joue exactement le rôle d'ingestion continue qui alimente Snowpipe dans Snowflake ou Auto Loader dans Databricks : les fichiers Parquet consolidés toutes les 60 secondes arrivent sur S3 et déclenchent l'ingestion automatique en table.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 167 à 183.
- Voir aussi : cours Nikolai Schuler, leçons 33 à 53.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Une entreprise doit ingérer des logs de serveurs et les stocker au format Apache Parquet sur Amazon S3 avec le minimum de code et de gestion d'infrastructure. Quel service répond à ce besoin ?
   - A) Amazon Data Firehose avec conversion de format activée via AWS Glue Data Catalog (Bonne réponse).
   - B) Amazon Kinesis Data Streams avec un consommateur EC2 personnalisé.
   - C) Amazon Managed Service for Apache Flink écrivant directement sur EBS.
   - D) Amazon SQS avec un script cron périodique.
2. Pourquoi un pipeline Kinesis Data Streams déclenche-t-il une exception ProvisionedThroughputExceededException malgré une utilisation moyenne de 50 % de la capacité globale du flux ?
   - A) La clé de partition choisie a une faible cardinalité, créant un shard chaud qui dépasse 1 Mo/s (Bonne réponse).
   - B) Le chiffrement SSE-KMS est activé sur le flux.
   - C) La durée de rétention du flux dépasse 24 heures.
   - D) Le consommateur utilise KCL au lieu de l'API standard.
`
  },
  {
    file: 'dea-02-ingestion-msk-kafka.md',
    title: 'Streaming Distribué d Entreprise : Amazon MSK (Managed Streaming for Apache Kafka)',
    content: `# Chapitre 2 : Streaming Distribué d Entreprise : Amazon MSK (Managed Streaming for Apache Kafka)

## 1. Objectifs d'apprentissage
- Comprendre l'architecture d'Amazon MSK (Brokers, ZooKeeper / KRaft, Topics, Partitions).
- Différencier Amazon MSK Provisioned et Amazon MSK Serverless.
- Maîtriser l'intégration avec Kafka Connect (MSK Connect) pour l'ingestion sans code.
- Savoir quand privilégier Amazon MSK par rapport à Amazon Kinesis Data Streams.

## 2. Explication claire : quand choisir quoi
Amazon MSK est un service entièrement managé pour Apache Kafka, permettant d'exécuter des applications basées sur Kafka sans gérer l'infrastructure de serveurs :

Quand choisir Amazon MSK plutôt que Kinesis :
- Vous possédez déjà une infrastructure ou des applications d'entreprise basées sur l'écosystème Apache Kafka (MirrorMaker, Kafka Connect, Schema Registry Confluent).
- Vos flux nécessitent des messages d'une taille supérieure à 1 Mo (Kinesis est limité strictement à 1 Mo par enregistrement, alors que Kafka peut être configuré pour des messages de plusieurs dizaines de Mo).
- Vous recherchez une portabilité multi-cloud évitant le verrouillage propriétaire AWS.

Les deux modes de déploiement d'Amazon MSK :
1. MSK Provisioned :
   - Vous choisissez le type d'instances de brokers (ex. kafka.m5.large) et le volume EBS par broker.
   - Vous contrôlez les versions de Kafka, le nombre de partitions par topic et les configurations fines (compression, rétention).
   - Idéal pour les charges de travail prévisibles avec de gros volumes continus.
2. MSK Serverless :
   - Mise à l'échelle automatique de la capacité de calcul et de stockage selon le volume de streaming entrant.
   - Tarification basée sur le volume de données ingérées et traitées par heure.
   - Idéal pour les charges imprévisibles ou variables sans besoin de gérer les brokers.

MSK Connect :
- Permet de déployer des connecteurs Kafka Connect managés sans gérer de clusters de workers.
- Exemple typique : connecteur Debezium pour capturer les écritures de bases de données (CDC) ou connecteur Amazon S3 Sink pour verser les topics Kafka dans un Data Lake S3.

## 3. Définitions des termes clés
- Broker : serveur Kafka recevant les messages des producteurs et les servant aux consommateurs.
- Topic : catégorie ou flux nommé auquel les enregistrements sont publiés.
- Partition : division ordonnée et immuable d'un topic permettant le parallélisme horizontal.
- Consumer Group : ensemble de consommateurs collaborant pour lire les partitions d'un topic.

## 4. Exemple concret
Configuration d'ingestion Kafka Connect vers S3 :
\`\`\`
[Producteurs Kafka] -> [Topics MSK (Partitions 1..12)]
                            |
                   [MSK Connect (S3 Sink)]
                            |
                     [Amazon S3 (Format Parquet)]
\`\`\`

## 5. Comparaisons et pièges d'examen
- MSK vs Kinesis Data Streams : Kinesis est une solution native AWS sans serveur nativement intégrée avec IAM et CloudWatch sans gestion de brokers ; MSK est le standard Apache Kafka pour les écosystèmes existants ou les messages > 1 Mo.
- Authentification et Sécurité dans MSK : MSK supporte l'authentification mutuelle TLS (mTLS), SASL/SCRAM, et l'authentification IAM pour Kafka.
- ZooKeeper vs KRaft : les versions récentes d'Amazon MSK supportent le mode KRaft (Kafka Raft Metadata) qui élimine le besoin de nœuds ZooKeeper séparés.

## 6. Lien avec SQL, Snowflake et Databricks
Les clusters MSK sont fréquemment connectés aux connecteurs Snowflake Kafka Connector ou Databricks Structured Streaming pour charger les topics directement dans des tables Delta Lake ou Snowflake en quasi-temps réel.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 184 à 195.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Une équipe data doit migrer un cluster Apache Kafka sur site vers AWS. Les messages individuels atteignent régulièrement 8 Mo et l'équipe utilise des connecteurs Kafka Connect existants. Quelle solution AWS est la plus adaptée ?
   - A) Amazon MSK Provisioned avec MSK Connect (Bonne réponse).
   - B) Amazon Kinesis Data Streams.
   - C) Amazon Data Firehose.
   - D) Amazon SQS Standard.
2. Quel composant d'Amazon MSK permet d'ingérer automatiquement des données vers Amazon S3 sans écrire de code applicatif personnalisé ?
   - A) MSK Connect avec un connecteur S3 Sink (Bonne réponse).
   - B) AWS Glue DataBrew.
   - C) Amazon Athena Federated Query.
   - D) AWS DataSync.
`
  },
  {
    file: 'dea-03-glue-etl-jobs.md',
    title: 'Traitement de Données Distribué avec AWS Glue ETL et Job Bookmarks',
    content: `# Chapitre 3 : Traitement de Données Distribué avec AWS Glue ETL et Job Bookmarks

## 1. Objectifs d'apprentissage
- Comprendre le fonctionnement d'AWS Glue ETL sans serveur (Spark sous-jacent).
- Maîtriser la différence fondamentale entre DynamicFrames et DataFrames Spark.
- Utiliser les Job Bookmarks pour le traitement incrémental sans doublons.
- Choisir les types de DPU (Data Processing Units) et optimiser les coûts d'exécution.

## 2. Explication claire : quand choisir quoi
AWS Glue ETL est un moteur de traitement de données sans serveur basé sur Apache Spark, optimisé pour les pipelines d'extraction, de transformation et de chargement (ETL) :

Quand choisir AWS Glue ETL :
- Pour exécuter des transformations complexes par lots sur de gros volumes (Go à To) sans administrer de clusters Spark.
- Pour bénéficier d'un catalogue de métadonnées centralisé (AWS Glue Data Catalog) partagé nativement avec Athena, Redshift Spectrum et EMR.

DynamicFrames vs Apache Spark DataFrames :
- DataFrame Spark classique : exige un schéma fixe et strict avant l'exécution. En cas de colonne imprévue ou de type mixte (entier dans une ligne, chaîne dans une autre), Spark échoue ou coerce la valeur à null.
- DynamicFrame AWS Glue : structure de données propriétaire conçue pour la réalité des Data Lakes. Chaque enregistrement est auto-descriptif avec son propre schéma. Un champ ayant des types divergents est géré sous forme de \`choice type\`, permettant de résoudre les incohérences via la transformation \`ResolveChoice\` sans perdre de données.
- Conversion bidirectionnelle : \`toDF()\` et \`fromDF()\` permettent de passer instantanément de DynamicFrame à DataFrame pour utiliser les fonctions SQL Spark standards.

Job Bookmarks :
- Mécanisme d'état interne à Glue permettant de suivre les données déjà traitées lors des exécutions précédentes.
- Fonctionnement : lors de la lecture d'une source S3 ou JDBC, Glue mémorise la date de dernière modification des fichiers ou la clé primaire incrémentale.
- Résultats : seules les nouvelles données arrivées depuis le dernier job sont ingérées, évitant de retraiter l'historique et éliminant les écritures en double.

Types de workers Glue :
- G.1X : 1 DPU (4 vCPU, 16 Go de RAM, 64 Go de disque) pour les jobs standards de transformation.
- G.2X : 2 DPU (8 vCPU, 32 Go de RAM, 128 Go de disque) pour les transformations lourdes en mémoire, l'enrichissement et les jointures volumineuses.
- G.4X / G.8X : pour les charges de travail d'ingestion et d'apprentissage machine intensives.

## 3. Définitions des termes clés
- DPU (Data Processing Unit) : unité de mesure de capacité de calcul Glue (4 vCPU et 16 Go de mémoire).
- Job Bookmark : marqueur d'état persistant prévenant le retraitement de données anciennes dans Glue.
- DynamicFrame : extension Glue du DataFrame Spark avec prise en charge des schémas semi-structurés hétérogènes.

## 4. Exemple concret
Script Glue PySpark avec DynamicFrame et ResolveChoice :
\`\`\`python
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

glueContext = GlueContext(SparkContext.getOrCreate())
job = Job(glueContext)
job.init("MonJob", getResolvedOptions(sys.argv, ['JOB_NAME']))

dyn_frame = glueContext.create_dynamic_frame.from_catalog(
    database="raw_db", table_name="sales_raw",
    transformation_ctx="datasource"
)
resolved = dyn_frame.resolveChoice(specs=[("montant", "cast:double")])
glueContext.write_dynamic_frame.from_options(
    frame=resolved, connection_type="s3",
    connection_options={"path": "s3://lake/curated/sales/"}, format="parquet"
)
job.commit()
\`\`\`

## 5. Comparaisons et pièges d'examen
- \`job.commit()\` obligatoire : si vous utilisez les Job Bookmarks, vous DEVEZ appeler explicitement \`job.commit()\` à la fin du script, sinon l'état du marqueur n'est jamais sauvegardé et la prochaine exécution retraitera les mêmes fichiers.
- Glue ETL vs EMR : Glue est entièrement sans serveur avec démarrage en moins d'une minute et tarification à la seconde ; EMR est idéal pour les clusters Spark personnalisés à long terme avec composants spécifiques (HBase, Presto, Flink) ou instances Spot massives.
- Pushdown Predicates : pour filtrer les partitions S3 directement dans le catalogue Glue AVANT que Spark ne lise les fichiers, utilisez \`push_down_predicate\` (ex. \`year='2026' AND month='10'\`), ce qui évite de charger des téraoctets inutiles en mémoire.

## 6. Lien avec SQL, Snowflake et Databricks
Le DynamicFrame résout exactement le même problème que le type \`VARIANT\` dans Snowflake ou la gestion des schémas flexibles avec Auto Loader dans Databricks : traiter du JSON brut semi-structuré sans casser le pipeline en cas d'évolution de schéma.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 118 à 150.
- Voir aussi : cours Nikolai Schuler, leçons 136 à 160.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Quelle fonctionnalité d'AWS Glue ETL empêche un job quotidien de retraiter les fichiers S3 qui ont déjà été traités lors des exécutions précédentes ?
   - A) Les Job Bookmarks avec appel obligatoire à job.commit() (Bonne réponse).
   - B) Les balises LF-tags dans Lake Formation.
   - C) La commande VACUUM.
   - D) L'activation de la réplication multi-régions S3.
2. Pourquoi un ingénieur data utilise-t-il un DynamicFrame plutôt qu'un DataFrame Apache Spark standard lors de l'ingestion de fichiers JSON hétérogènes ?
   - A) Le DynamicFrame gère nativement les schémas mixtes et divergents sans planter via les types Choice (Bonne réponse).
   - B) Le DynamicFrame s'exécute uniquement sur GPU.
   - C) Le DynamicFrame ne supporte pas l'écriture au format Parquet.
   - D) Le DynamicFrame ne consomme aucun DPU.
`
  },
  {
    file: 'dea-04-glue-streaming-databrew.md',
    title: 'Streaming avec Glue et Préparation Visuelle avec Glue DataBrew',
    content: `# Chapitre 4 : Streaming avec Glue et Préparation Visuelle avec Glue DataBrew

## 1. Objectifs d'apprentissage
- Comprendre le fonctionnement d'AWS Glue Streaming ETL basé sur Spark Structured Streaming.
- Configurer les sources de streaming (Kinesis Data Streams, Apache Kafka, MSK) dans Glue.
- Découvrir AWS Glue DataBrew pour le nettoyage et la préparation de données sans code.
- Différencier l'usage de Glue DataBrew et de Glue Studio.

## 2. Explication claire : quand choisir quoi
AWS Glue propose deux solutions spécialisées pour des cas d'usage complémentaires :

1. AWS Glue Streaming ETL :
- Qu'est-ce que c'est : un job Glue exécuté en continu basé sur Spark Structured Streaming, consommant des événements en temps réel depuis Kinesis Data Streams ou Apache Kafka / MSK.
- Quand le choisir : lorsque vous devez appliquer des transformations complexes (jointures avec des tables de référence dans S3, nettoyage, enrichissement) sur des flux en continu et écrire le résultat dans un Data Lake S3 ou une base de données avec une latence de quelques secondes.
- Avantage clé : accès complet à l'écosystème Glue (Catalog, connecteurs S3, formats Parquet/Iceberg) et exécution sans serveur sans administrer de cluster Spark permanent.

2. AWS Glue DataBrew :
- Qu'est-ce que c'est : un outil visuel de nettoyage et d'enrichissement de données sans code (point-and-click).
- Quand le choisir : pour les analystes de données ou les data scientists qui souhaitent profiler des jeux de données, détecter les valeurs manquantes, anonymiser des colonnes sensibles (hachage, masquage PII), normaliser des formats de date sans écrire une seule ligne de code Python ou SQL.
- Recettes (Recipes) : ensemble de plus de 250 transformations visuelles préconfigurées. Une recette peut être publiée et orchestrée dans un job DataBrew récurrent automatisé.

## 3. Définitions des termes clés
- Spark Structured Streaming : moteur de traitement de flux avec tolérance aux pannes basé sur le modèle de micro-lots (ou traitement continu) de Spark.
- Fenêtrage (Windowing) : agrégation de données de flux sur des intervalles temporels (tumbling, sliding ou session windows).
- Recette DataBrew (Recipe) : suite d'étapes de transformation visuelle reproductibles appliquée à un jeu de données.
- Profilage DataBrew (Data Profile) : analyse statistique d'un jeu de données (distribution, cardinalité, valeurs nulles, anomalies).

## 4. Exemple concret
Architecture de traitement de flux avec enrichissement :
\`\`\`
[Transactions Kinesis] ------------------------> [Glue Streaming ETL]
                                                        ^
[Tables de référence clients sur Amazon S3] ------------|
                                                        v
                                            [Amazon S3 (Curated Iceberg)]
\`\`\`

## 5. Comparaisons et pièges d'examen
- Glue Streaming vs Firehose : Firehose est une solution d'ingestion directe sans code limitée à des transformations simples via Lambda ; Glue Streaming permet des jointures distribuées complexes entre flux et tables de référence S3 à grande échelle.
- Glue DataBrew vs Glue Studio : Glue Studio est une interface visuelle pour concevoir des jobs Spark exécutant du code Python/Scala destiné aux Data Engineers ; Glue DataBrew est un outil d'exploration et de préparation sans code destiné aux analystes métier.
- Checkpointing dans Glue Streaming : pour garantir la sémantique de traitement exactement une fois (exactly-once), Glue Streaming utilise un répertoire de points de contrôle (checkpoint location) sur Amazon S3.

## 6. Lien avec SQL, Snowflake et Databricks
Glue Streaming correspond à Spark Structured Streaming dans Databricks lisant des flux Delta Live Tables. Glue DataBrew correspond aux fonctionnalités visuelles de préparation de données que l'on retrouve dans Trifacta ou les dashboards de profiling dans Snowflake Snowsight.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 151 à 166.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Un analyste métier non développeur a besoin d'explorer un jeu de données S3, de nettoyer les valeurs aberrantes et d'anonymiser les adresses email sans écrire de script. Quel service recommandez-vous ?
   - A) AWS Glue DataBrew avec une recette de transformation (Bonne réponse).
   - B) AWS Glue ETL avec script PySpark personnalisé.
   - C) Amazon EMR avec Apache Spark.
   - D) AWS Lambda avec conteneur Docker.
2. Quel mécanisme permet à un job AWS Glue Streaming de reprendre son exécution sans perte de données ni doublons en cas de redémarrage imprévu ?
   - A) Le checkpointing stocké sur un chemin Amazon S3 dédié (Bonne réponse).
   - B) L'activation d'Amazon Inspector.
   - C) L'utilisation d'un volume EBS non chiffré.
   - D) La suppression des Job Bookmarks.
`
  },
  {
    file: 'dea-05-spark-emr-serverless.md',
    title: 'Traitement Big Data Massif avec Apache Spark sur Amazon EMR',
    content: `# Chapitre 5 : Traitement Big Data Massif avec Apache Spark sur Amazon EMR

## 1. Objectifs d'apprentissage
- Comprendre l'architecture d'un cluster Amazon EMR (Primary Node, Core Nodes, Task Nodes).
- Distinguer les modes de déploiement d'EMR : sur EC2, sur EKS et EMR Serverless.
- Maîtriser les concepts Spark fondamentaux : RDD, DataFrames, Shuffle, Partitions, Skew.
- Optimiser les coûts d'un cluster EMR grâce aux instances Spot sur les Task Nodes.

## 2. Explication claire : quand choisir quoi
Amazon EMR (Elastic MapReduce) est la plateforme Big Data managée d'AWS pour exécuter des frameworks open source distribués (Apache Spark, Hive, Presto, Trino, Flink, HBase) :

Architecture d'un cluster Amazon EMR sur EC2 :
1. Nœud primaire (Primary / Master Node) :
   - Coordonne le cluster, exécute le gestionnaire de ressources YARN et le pilote Spark (Driver).
   - Ne doit JAMAIS être interrompu : toujours déployer sur une instance On-Demand.
2. Nœuds centraux (Core Nodes) :
   - Exécutent les tâches Spark (Executors) ET stockent des données sur HDFS (Hadoop Distributed File System).
   - Risque de perte de données HDFS en cas de terminaison : généralement déployés sur instances On-Demand.
3. Nœuds de tâches (Task Nodes) :
   - Exécutent uniquement du calcul Spark sans stocker de données HDFS persistantes.
   - Idéal pour les instances Spot : si AWS révoque une instance Spot avec un préavis de 2 minutes, aucune donnée n'est perdue et Spark réexécute simplement la tâche perdue sur un autre nœud.

Modes de déploiement EMR :
- EMR sur EC2 : contrôle complet sur le matériel, la configuration réseau et les scripts d'amorçage (bootstrap actions). Idéal pour les clusters pérennes ou personnalisés.
- EMR sur EKS : exécution de Spark sur un cluster Kubernetes partagé avec d'autres microservices d'entreprise.
- EMR Serverless : exécution d'applications Spark ou Hive sans configurer, dimensionner ni gérer de clusters. AWS alloue et désalloue automatiquement la mémoire et le calcul nécessaires.

Optimisation des performances Spark :
- Gestion du Data Skew (asymétrie de distribution) : survient lorsqu'une clé de jointure ou d'agrégation concentre 80 % des données, saturant un seul exécuteur alors que les autres sont inactifs. Solutions : salage de clés (key salting) ou activation de l'Adaptive Query Execution (AQE) de Spark 3.x.
- Réduction du Shuffle : minimiser les réorganisations réseau lourdes en remplaçant les jointures de tri-fusion par des jointures diffusées (\`broadcast join\`) lorsque l'une des deux tables est petite (< 10 Mo par défaut).

## 3. Définitions des termes clés
- Driver Spark : processus central initialisant la SparkSession, créant le plan d'exécution logique et distribuant les tâches aux exécuteurs.
- Executor : processus JVM tournant sur les nœuds de travail exécutant le calcul et conservant les données en mémoire cache.
- Shuffle : redistribution physique des données à travers le réseau entre différentes partitions lors de jointures ou de \`groupBy\`.
- Broadcast Join : envoi d'une petite table en copie intégrale à chaque exécuteur pour éviter le shuffle complet de la grande table.

## 4. Exemple concret
Calcul de jointure optimisé avec broadcast en PySpark :
\`\`\`python
from pyspark.sql.functions import broadcast

# Grande table de transactions (100 millions de lignes)
transactions = spark.read.parquet("s3://lake/transactions/")
# Petite table de référence pays (200 lignes)
pays = spark.read.parquet("s3://lake/referentiel_pays/")

# Jointure sans shuffle réseau grâce au broadcast
resultat = transactions.join(broadcast(pays), "code_pays")
resultat.write.mode("overwrite").parquet("s3://lake/curated/transactions_enrichies/")
\`\`\`

## 5. Comparaisons et pièges d'examen
- EMR vs AWS Glue : EMR donne le contrôle total sur la version de Spark, les bibliothèques C++, le monitoring YARN et le cluster Hadoop ; Glue est entièrement sans serveur avec facturation au DPU. Pour exécuter Presto/Trino ou des versions spécifiques de bibliothèques tierces, choisir EMR.
- Task Nodes vs Core Nodes : ne jamais mettre des Core Nodes sur instances Spot dans un cluster de production sensible à cause du risque de corruption HDFS ; les instances Spot doivent être réservées aux Task Nodes.
- EMRFS (EMR File System) : permet aux clusters EMR d'utiliser directement Amazon S3 comme couche de stockage persistant à la place de HDFS, permettant d'arrêter complètement le cluster après l'exécution du calcul.

## 6. Lien avec SQL, Snowflake et Databricks
EMR est l'équivalent direct des clusters Spark administrés sur Databricks (Databricks Runtime). La compréhension du Driver, des Executors, du Shuffle et du broadcast join s'applique à l'identique entre AWS EMR et les plateformes Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 196 à 215.
- Voir aussi : cours Nikolai Schuler, leçons 161 à 175.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Quelle configuration d'instances permet d'optimiser au maximum les coûts d'un cluster Amazon EMR exécutant des calculs Spark intensifs sans risquer de corrompre le système de fichiers HDFS ?
   - A) Nœuds Master et Core sur instances On-Demand, Nœuds Task sur instances Spot (Bonne réponse).
   - B) Tous les nœuds sur instances Spot.
   - C) Nœuds Master sur instances Spot et Nœuds Task sur instances On-Demand.
   - D) Nœuds Core sur instances Spot sans aucun nœud Task.
2. Une requête Spark exécutant une jointure entre une table de faits de 500 Go et une table de dimension de 5 Mo souffre de lenteurs majeures dues au shuffle réseau. Quelle optimisation technique résout ce problème ?
   - A) Utiliser une jointure diffusée (Broadcast Join) sur la table de dimension (Bonne réponse).
   - B) Augmenter la taille des blocs HDFS à 1 Go.
   - C) Désactiver l'Adaptive Query Execution.
   - D) Convertir la table de faits au format CSV.
`
  },
  {
    file: 'dea-06-lambda-event-driven-batch.md',
    title: 'Ingestion Orientée Événements avec AWS Lambda et Traitement par Lots avec AWS Batch',
    content: `# Chapitre 6 : Ingestion Orientée Événements avec AWS Lambda et Traitement par Lots avec AWS Batch

## 1. Objectifs d'apprentissage
- Comprendre les déclencheurs d'événements Lambda (notifications S3, Kinesis, SQS).
- Maîtriser les limites d'AWS Lambda (durée maximale de 15 minutes, mémoire, stockage éphémère \`/tmp\`).
- Savoir quand basculer d'AWS Lambda vers AWS Batch pour les calculs longs ou conteneurisés.
- Utiliser AWS Batch avec des environnements de calcul gérés et des instances Spot.

## 2. Explication claire : quand choisir quoi
Pour l'ingestion et le traitement léger ou asynchrone, AWS propose deux paradigmes complémentaires :

1. AWS Lambda (Calcul Sans Serveur Réactif) :
- Qu'est-ce que c'est : exécution de code sans serveur en réponse directe à des événements système.
- Cas d'usage en Data Engineering :
  - Déclenchement automatique lorsqu'un nouveau fichier atterrit dans un compartiment S3 (ObjectCreated notification) pour valider son format, extraire des métadonnées ou déclencher une machine à états Step Functions.
  - Consommation par micro-lots d'enregistrements provenant d'Amazon Kinesis Data Streams ou de files d'attente SQS.
- Limites critiques à mémoriser pour l'examen :
  - Temps d'exécution maximal strict : 15 minutes (900 secondes). Tout traitement dépassant 15 minutes doit impérativement utiliser AWS Glue, AWS Batch ou Amazon ECS/EMR.
  - Mémoire allouée : de 128 Mo à 10 240 Mo (10 Go). Le CPU est proportionnel à la mémoire allouée.
  - Disque temporaire \`/tmp\` : de 512 Mo à 10 240 Mo (10 Go).

2. AWS Batch (Orchestration de Calcul par Lots à Grande Échelle) :
- Qu'est-ce que c'est : planificateur de tâches de calcul par lots exécutant des conteneurs Docker sur des instances EC2 managées ou AWS Fargate.
- Quand le choisir : pour des tâches de traitement de données lourdes, scientifiques, ou des scripts Python/C++ complexes dont la durée d'exécution dépasse les 15 minutes de Lambda, sans vouloir configurer un cluster Spark ou EMR complet.
- Environnements de calcul (Compute Environments) :
  - Géré (Managed) : AWS provisionne, met à l'échelle et termine automatiquement les instances EC2 en fonction de la file d'attente des jobs.
  - Support natif des instances Spot : permet d'exécuter des milliers de tâches de calcul par lots avec jusqu'à 90 % de réduction de coût.

## 3. Définitions des termes clés
- Event Source Mapping : composant interne à Lambda qui lit en continu des flux (Kinesis, DynamoDB Streams) ou des files (SQS) et invoque la fonction Lambda de manière synchrone.
- Job Definition (AWS Batch) : modèle décrivant l'image Docker, la commande à exécuter, les vCPU et la mémoire RAM nécessaires à une tâche Batch.
- Dead Letter Queue (DLQ) : file d'attente SQS ou sujet SNS recueillant les événements ayant échoué à être traités par Lambda après épuisement des tentatives de réessai.

## 4. Exemple concret
Pipeline d'ingestion par événement avec bascule vers Batch :
\`\`\`
[Fichier client .zip déposé sur S3]
             |
             v
   [Événement S3 ObjectCreated]
             |
             v
[AWS Lambda (Vérification en 5 sec)]
   - Si fichier < 100 Mo -> Décompression et écriture directe sur S3
   - Si fichier > 100 Mo -> Soumission d'une tâche à AWS Batch (Conteneur Docker sur Fargate/EC2)
\`\`\`

## 5. Comparaisons et pièges d'examen
- Lambda vs AWS Glue : Lambda est idéal pour les transformations unitaires événementielles ultra-rapides (< 15 min, fichiers légers) ; Glue est optimisé pour les transformations distribuées massives avec Apache Spark sur plusieurs gigaoctets ou téraoctets.
- Dimensionnement Lambda : augmenter la mémoire RAM allouée à une fonction Lambda augmente automatiquement la puissance vCPU allouée de manière linéaire, ce qui réduit souvent le temps d'exécution et peut même diminuer le coût total.
- Batch vs EMR : AWS Batch exécute des conteneurs Docker arbitraires indépendants ; EMR exécute des frameworks distribués Big Data (Spark, Hive) partageant un contexte d'exécution distribué.

## 6. Lien avec SQL, Snowflake et Databricks
Les fonctions AWS Lambda réactives jouent exactement le même rôle que les Cloud Functions déclenchant les Snowpipes dans Snowflake lors de l'arrivée d'un fichier S3, ou les webhooks de démarrage de jobs dans Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 216 à 230.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Un pipeline doit traiter chaque nuit des fichiers volumineux dont la transformation en Python prend entre 45 et 60 minutes par fichier. Quelle solution de calcul sans gestion manuelle de serveurs convient ?
   - A) AWS Batch avec un environnement de calcul géré exécutant un conteneur Docker (Bonne réponse).
   - B) AWS Lambda avec allocation de 10 Go de RAM.
   - C) Amazon API Gateway avec intégration synchrone.
   - D) Une instance EC2 t2.micro permanente sans arrêt.
2. Que se passe-t-il si un script d'ingestion de données s'exécutant dans une fonction AWS Lambda n'a pas terminé son traitement au bout de 15 minutes ?
   - A) La fonction est arrêtée de force par AWS avec une erreur de timeout (Bonne réponse).
   - B) AWS prolonge l'exécution de 15 minutes supplémentaires avec surcoût.
   - C) Le traitement est automatiquement transféré vers AWS Glue.
   - D) La mémoire RAM est doublée automatiquement.
`
  },
  {
    file: 'dea-07-orchestration-step-functions-mwaa.md',
    title: 'Orchestration de Pipelines : AWS Step Functions vs Amazon MWAA (Apache Airflow)',
    content: `# Chapitre 7 : Orchestration de Pipelines : AWS Step Functions vs Amazon MWAA (Apache Airflow)

## 1. Objectifs d'apprentissage
- Comprendre les cas d'usage d'AWS Step Functions et ses machines à états (Standard vs Express).
- Découvrir Amazon Managed Workflows for Apache Airflow (MWAA) et son architecture de DAGs Python.
- Savoir choisir entre Step Functions et MWAA selon la complexité et les compétences de l'équipe.
- Maîtriser le Distributed Map de Step Functions pour le traitement hautement parallèle.

## 2. Explication claire : quand choisir quoi
L'orchestration coordonne les différentes étapes d'un pipeline de données (ingestion, validation, transformation Glue/EMR, chargement Redshift, notification) :

1. AWS Step Functions :
- Qu'est-ce que c'est : orchestrateur sans serveur basé sur des machines à états visuelles définies en JSON (Amazon States Language - ASL).
- Quand le choisir :
  - Pour des flux orientés événements hautement intégrés avec les services AWS natifs (Lambda, Glue, Athena, Batch, SNS, DynamoDB).
  - Pour orchestrer des workflows sans gérer la moindre infrastructure ni serveur web.
  - Pour paralléliser massivement le traitement de millions d'objets S3 grâce à l'état \`Distributed Map\`.
- Workflows Standard vs Express :
  - Standard : durée d'exécution jusqu'à 1 an, exécution exactement une fois (exactly-once), historique d'exécution complet visuel. Idéal pour les pipelines ETL critiques longs.
  - Express : durée d'exécution jusqu'à 5 minutes, exécution au moins une fois (at-least-once), débit élevé (> 100 000 exécutions/s), coût très faible. Idéal pour l'ingestion d'événements et le streaming IoT.

2. Amazon MWAA (Managed Workflows for Apache Airflow) :
- Qu'est-ce que c'est : service géré pour Apache Airflow, permettant d'exécuter des DAGs (Directed Acyclic Graphs) écrits entièrement en code Python.
- Quand le choisir :
  - Lorsque l'équipe dispose déjà d'une expertise Airflow ou de centaines de DAGs existants.
  - Pour orchestrer des pipelines multi-clouds ou hybrides impliquant des systèmes hors AWS (Snowflake, Databricks, Salesforce, bases sur site) grâce aux milliers d'opérateurs open source de la communauté Airflow.
  - Lorsque les dépendances entre tâches exigent des logiques dynamiques complexes exprimées en pur code Python.

## 3. Définitions des termes clés
- State Machine (Machine à états) : définition formelle d'un workflow dans Step Functions composée d'états (Task, Choice, Parallel, Map, Pass, Fail).
- Distributed Map : mode d'exécution Step Functions capable d'itérer en parallèle jusqu'à 10 000 exécutions concurrentes sur des fichiers stockés dans S3.
- DAG (Directed Acyclic Graph) : graphe orienté sans cycle représentant les dépendances de tâches dans Apache Airflow.

## 4. Exemple concret
Workflow Step Functions classique de pipeline de données :
\`\`\`
[Start] -> [Valider fichier Lambda]
                 |
        {Fichier valide ?}
         /              \\
     (Oui)             (Non) -> [Notifier SNS Alerte] -> [Fail]
       v
[Lancer Job Glue ETL]
       v
[Attendre fin du Job (sync)]
       v
[Exécuter requête SQL Athena]
       v
[Notifier succès SNS] -> [Success]
\`\`\`

## 5. Comparaisons et pièges d'examen
- Step Functions vs MWAA : Step Functions est 100 % serverless, sans aucun temps d'initialisation ni maintenance de version ; MWAA nécessite le provisionnement d'un environnement Airflow avec des workers et une interface web dédiée.
- Gestion des erreurs et reprises : Step Functions intègre nativement des blocs \`Retry\` (avec backoff exponentiel) et \`Catch\` au niveau de chaque tâche sans code supplémentaire.
- Tâches synchrones (\`.sync\`) : dans Step Functions, ajouter le suffixe \`.sync\` à un appel de service (ex. \`arn:aws:states:::glue:startJobRun.sync\`) permet à Step Functions d'attendre la complétion effective du job Glue avant de passer à l'état suivant.

## 6. Lien avec SQL, Snowflake et Databricks
MWAA est l'outil privilégié des équipes Data pour orchestrer des transformations complexes combinant des modèles dbt, des tâches d'extraction Python, des rafraîchissements de tables dynamiques Snowflake et des notebooks Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 231 à 245.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Une équipe data doit orchestrer un pipeline ETL quotidien qui exécute un job Glue, attend sa terminaison, puis déclenche un rafraîchissement Redshift. Elle ne souhaite gérer aucun serveur ni infrastructure applicative. Quelle solution choisir ?
   - A) AWS Step Functions avec une machine à états de type Standard (Bonne réponse).
   - B) Amazon EC2 avec un démon cron Linux.
   - C) Amazon Managed Workflows for Apache Airflow avec taille de cluster maximale.
   - D) AWS CloudTrail avec alarmes CloudWatch.
2. Quelle fonctionnalité de Step Functions permet de diviser un fichier de métadonnées contenant 50 000 lignes et de lancer des traitements Lambda hautement parallèles jusqu'à 10 000 exécutions simultanées ?
   - A) L'état Distributed Map (Bonne réponse).
   - B) L'état Choice.
   - C) L'état Pass.
   - D) L'intégration avec AWS Secrets Manager.
`
  },
  {
    file: 'dea-08-migration-transfert-donnees.md',
    title: 'Migration et Transfert de Données : AWS DMS, DataSync et Famille Snow',
    content: `# Chapitre 8 : Migration et Transfert de Données : AWS DMS, DataSync et Famille Snow

## 1. Objectifs d'apprentissage
- Maîtriser AWS Database Migration Service (DMS) pour le chargement initial et le CDC continu.
- Différencier AWS DMS et AWS DataSync selon le type de source (fichiers vs bases de données).
- Connaître les capacités de transfert physique de la famille AWS Snow (Snowcone, Snowball Edge, Snowmobile).
- Comprendre AWS Transfer Family pour les protocoles SFTP, FTPS et FTP.

## 2. Explication claire : quand choisir quoi
Le déplacement de données vers AWS dépend du type de données (fichiers ou tables relationnelles) et de la bande passante réseau disponible :

1. AWS Database Migration Service (AWS DMS) :
- Qu'est-ce que c'est : service géré de migration et de réplication continue de bases de données relationnelles, entrepôts et magasins NoSQL.
- Fonctionnalités clés :
  - Chargement initial complet (Full Load).
  - Réplication continue des modifications (Change Data Capture - CDC) via les journaux de transactions (ex. binlog MySQL, wal PostgreSQL, redo log Oracle).
  - Migrations homogènes (ex. Oracle vers Oracle) ou hétérogènes (ex. Oracle vers Amazon Aurora PostgreSQL ou Amazon S3 en fichiers Parquet).
- Composants : instance de réplication, point de terminaison source (Source Endpoint), point de terminaison cible (Target Endpoint) et tâche de réplication.

2. AWS DataSync :
- Qu'est-ce que cest : service d'accélération de transfert réseau en ligne pour synchroniser des téraoctets ou pétaoctets de fichiers entre des systèmes sur site (NFS, SMB, HDFS) et AWS (S3, EFS, FSx).
- Avantages : protocole de transfert propriétaire jusqu'à 10 fois plus rapide que les outils open source comme rsync, avec chiffrement et vérification d'intégrité automatique des données.

3. Famille AWS Snow (Transfert Physique Hors Ligne) :
- À utiliser quand : la bande passante réseau est trop faible ou le volume de données trop massif pour migrer par Internet.
- Appareils :
  - AWS Snowcone : compact et portable (8 To de stockage utilisable).
  - AWS Snowball Edge Storage Optimized : 80 To utiles (disponible avec options de calcul EC2 embarqué pour le prétraitement local).
  - AWS Snowmobile : camion sécurisé jusqu'à 100 Po pour les migrations de datacenters complets.

4. AWS Transfer Family :
- Permet à des partenaires externes d'échanger des fichiers via SFTP, FTPS ou FTP directement vers des compartiments Amazon S3 ou des systèmes EFS sans modifier leurs flux existants.

## 3. Définitions des termes clés
- CDC (Change Data Capture) : technique capturant en temps réel chaque insertion, mise à jour et suppression effectuée dans une base source.
- AWS SCT (Schema Conversion Tool) : outil desktop convertissant les schémas et procédures stockées lors de migrations de bases de données hétérogènes.
- Agent DataSync : machine virtuelle déployée sur site qui communique avec le service managé AWS DataSync via un tunnel TLS sécurisé.

## 4. Exemple concret
Réplication CDC continue d'une base de production vers un Data Lake :
\`\`\`
[Base PostgreSQL sur site]
          |
    (Journaux WAL)
          v
[Instance de réplication AWS DMS (Tâche CDC)]
          |
    (Format Parquet)
          v
[Amazon S3 (Data Lake Brut)] -> [AWS Glue Data Catalog] -> [Amazon Athena]
\`\`\`

## 5. Comparaisons et pièges d'examen
- DMS vs DataSync : DMS est conçu pour les bases de données (tables, transactions, CDC) ; DataSync est conçu pour les fichiers et répertoires de systèmes de fichiers (NFS, SMB, HDFS).
- Calcul du seuil Snowball : si le transfert par le réseau prend plus de 7 à 10 jours en saturant la ligne disponible, Snowball Edge est la recommandation d'examen économique et rapide.
- Endpoint S3 dans DMS : lors de l'utilisation d'Amazon S3 comme cible DMS, vous pouvez configurer DMS pour écrire directement en Apache Parquet avec compression Snappy.

## 6. Lien avec SQL, Snowflake et Databricks
AWS DMS écrivant en continu sur S3 est l'architecture classique utilisée pour alimenter les plateformes Snowflake ou Databricks à partir d'anciens ERP ou CRM sur site sans surcharger les bases transactionnelles opérationnelles.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 246 à 260.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Une entreprise doit répliquer en continu les transactions d'une base de données Oracle sur site vers un Data Lake S3 avec un temps d'arrêt minimal. Quel service configurez-vous ?
   - A) AWS Database Migration Service (DMS) avec une tâche Full Load + CDC (Bonne réponse).
   - B) AWS DataSync avec planification horaire.
   - C) AWS Snowball Edge Storage Optimized.
   - D) AWS Storage Gateway en mode Volume Gateway.
2. Un centre de recherche doit transférer 120 To de fichiers d'images satellites stockés sur un partage NFS local vers Amazon S3. La connexion Internet est limitée à 20 Mbit/s. Quelle est la solution la plus rapide ?
   - A) Commander deux boîtiers AWS Snowball Edge pour un transfert physique sécurisé (Bonne réponse).
   - B) Lancer un transfert direct via la console Web S3.
   - C) Utiliser AWS DataSync sur la liaison 20 Mbit/s existante.
   - D) Envoyer les données par email chiffré vers AWS Support.
`
  },
  {
    file: 'dea-09-decouplage-sqs-sns-eventbridge.md',
    title: 'Découplage et Messagerie Asynchrone : SQS, SNS et Amazon EventBridge',
    content: `# Chapitre 9 : Découplage et Messagerie Asynchrone : SQS, SNS et Amazon EventBridge

## 1. Objectifs d'apprentissage
- Comprendre les différences entre files d'attente (SQS), publication/abonnement (SNS) et bus d'événements (EventBridge).
- Maîtriser les caractéristiques des files Amazon SQS Standard vs FIFO.
- Découvrir le modèle Fan-out (SNS vers plusieurs files SQS).
- Utiliser Amazon EventBridge Pipes et le filtrage d'événements sans code.

## 2. Explication claire : quand choisir quoi
Le découplage des architectures de données permet d'isoler les composants pour garantir qu'une panne ou un ralentissement en aval n'impacte pas l'ingestion en amont :

1. Amazon SQS (Simple Queue Service) :
- Qu'est-ce que c'est : service de file d'attente de messages distribuée (Pull model : les consommateurs interrogent la file).
- Files Standard :
  - Débit quasi illimité.
  - Distribution au moins une fois (at-least-once delivery) : de rares doublons sont possibles, l'application doit être idempotente.
  - Ordre au mieux (best-effort ordering).
- Files FIFO (First-In-First-Out) :
  - Ordre strictement garanti des messages.
  - Distribution exactement une fois (exactly-once processing) grâce à l'ID de déduplication de message.
  - Débit limité à 300 messages/s (ou 3 000 messages/s avec le mode haute performance par lot).
  - Le nom de la file doit obligatoirement se terminer par l'extension \`.fifo\`.

2. Amazon SNS (Simple Notification Service) :
- Qu'est-ce que c'est : service de publication/abonnement (Push model : les abonnés reçoivent les messages dès publication).
- Modèle Fan-out : un producteur publie un message sur un sujet SNS unique ; SNS le distribue instantanément et en parallèle à de multiples files SQS, fonctions Lambda, webhooks HTTP ou adresses email abonnées.

3. Amazon EventBridge :
- Qu'est-ce que c'est : bus d'événements sans serveur permettant de relier des applications en utilisant des règles de routage basées sur le contenu JSON des événements.
- EventBridge Pipes : permet de créer des intégrations point-à-point simples entre des sources (SQS, Kinesis, DynamoDB Streams) et des cibles avec filtrage, enrichissement et transformation optionnels sans écrire de code d'infrastructure.

## 3. Définitions des termes clés
- Visibility Timeout (SQS) : période pendant laquelle un message récupéré par un consommateur reste invisible pour les autres consommateurs pour éviter qu'il ne soit traité deux fois en parallèle (par défaut 30 secondes, configurable jusqu'à 12 heures).
- Dead Letter Queue (DLQ) : file isolant les messages qui n'ont pas pu être traités après un nombre d'essais maximal défini (\`maxReceiveCount\`).
- Long Polling : technique de lecture SQS attendant jusqu'à 20 secondes qu'un message arrive dans la file avant de renvoyer une réponse vide, réduisant drastiquement le nombre de requêtes vides et les coûts.

## 4. Exemple concret
Architecture Fan-out avec filtrage de messages :
\`\`\`
                    [Producteur : Nouvelle commande]
                                  |
                                  v
                        [Sujet SNS : Commandes]
                       /                       \\
             (Règle: Montant > 1000)       (Toutes commandes)
                     v                                 v
        [File SQS : Commandes VIP]         [File SQS : Traitement Logistique]
                     v                                 v
         [Lambda Notification VIP]           [Consommateur EC2 Batch]
\`\`\`

## 5. Comparaisons et pièges d'examen
- SQS vs SNS : SQS est un système de tirage (Pull) avec persistance des messages en file jusqu'à 14 jours ; SNS est un système de poussée (Push) sans stockage durable des messages si aucun abonné n'est connecté.
- Kinesis vs SQS : Kinesis permet à de multiples consommateurs de lire les mêmes données de façon indépendante avec un pointeur (rejeu possible) ; dans SQS, une fois qu'un message est consommé et supprimé de la file, il disparaît pour toujours.
- Long Polling vs Short Polling : pour réduire la facture SQS, toujours configurer \`WaitTimeSeconds > 0\` (Long Polling, maximum 20 secondes).

## 6. Lien avec SQL, Snowflake et Databricks
Amazon SNS et SQS sont au cœur de l'ingestion événementielle dans Snowflake : la notification S3 ObjectCreated est publiée vers un sujet SNS ou une file SQS que Snowpipe écoute pour charger automatiquement chaque nouveau micro-lot de données.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 261 à 275.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Un pipeline de traitement de transactions financières exige que chaque message soit traité exactement une fois et rigoureusement dans l'ordre d'arrivée. Quel service devez-vous choisir ?
   - A) Amazon SQS FIFO avec identifiants de déduplication (Bonne réponse).
   - B) Amazon SQS Standard.
   - C) Amazon SNS Standard.
   - D) Amazon EventBridge Default Bus.
2. Que se passe-t-il si un consommateur met 45 secondes pour traiter un message SQS alors que le Visibility Timeout de la file est configuré à 30 secondes ?
   - A) Le message redevient visible dans la file et un autre consommateur risque de le traiter en doublon (Bonne réponse).
   - B) Le message est définitivement supprimé de la file.
   - C) Le message est envoyé dans la Dead Letter Queue immédiatement.
   - D) Le consommateur est automatiquement terminé par AWS.
`
  },
  {
    file: 'dea-10-llm-bedrock-vectorisation.md',
    title: 'Intégration LLM et Vectorisation pour la Data : Amazon Bedrock et RAG',
    content: `# Chapitre 10 : Intégration LLM et Vectorisation pour la Data : Amazon Bedrock et RAG

## 1. Objectifs d'apprentissage
- Comprendre le rôle d'Amazon Bedrock pour l'intégration de modèles fondationnels dans les pipelines de données (compétence DEA-C01 v1.1).
- Maîtriser la vectorisation et la génération d'embeddings avec Amazon Titan Text Embeddings v2.
- Connaître les stratégies de découpage de texte (chunking) pour le prétraitement documentaire.
- Découvrir l'architecture RAG (Retrieval-Augmented Generation) avec Amazon Bedrock Knowledge Bases.

## 2. Explication claire : quand choisir quoi
La version 1.1 du guide d'examen DEA-C01 introduit l'intégration des LLM et la vectorisation au cœur des compétences de l'ingénieur de données moderne :

1. Amazon Bedrock :
- Qu'est-ce que c'est : un service entièrement managé offrant un accès unifié via API aux principaux modèles fondationnels (Anthropic Claude, Meta Llama, Amazon Titan, Mistral AI, Cohere) sans gérer d'infrastructure GPU.
- Cas d'usage Data Engineering :
  - Extraction d'informations structurées à partir de textes non structurés (contrats, emails, avis clients).
  - Résumé automatique et enrichissement de colonnes textuelles dans un pipeline de données.
  - Détection de sentiment et classification automatique de documents ingérés dans S3.
- Appel API programmatique : utilisation de l'API \`InvokeModel\` ou \`Converse\` depuis AWS Lambda ou AWS Glue.

2. Vectorisation et Embeddings (Amazon Titan Text Embeddings v2) :
- Embeddings : vecteurs numériques denses représentant le sens sémantique d'un texte dans un espace multidimensionnel (ex. 256, 512 ou 1024 dimensions pour Titan Text Embeddings v2).
- Normalisation : Titan v2 prend en charge la normalisation des vecteurs pour des calculs rapides de similarité cosinus ou distance euclidienne.

3. Stratégies de découpage (Chunking Strategies) :
- Avant de vectoriser un document volumineux (PDF de 50 pages), il doit être découpé en morceaux cohérents :
  - Fixed-size chunking : découpage par nombre fixe de tokens (ex. 500 tokens) avec un chevauchement (overlap, ex. 10 % ou 50 tokens) pour éviter de couper une phrase ou une idée en deux.
  - Hierarchical chunking : découpage en sous-morceaux enfants liés à des morceaux parents plus larges pour préserver le contexte global.
  - Semantic chunking : découpage basé sur les transitions thématiques naturelles du texte.

4. Amazon Bedrock Knowledge Bases (RAG managé) :
- Orchestre de bout en bout le pipeline RAG : lit les documents sur Amazon S3, les découpe selon la stratégie de chunking choisie, génère les embeddings via Titan, et les indexe dans une base vectorielle (Amazon OpenSearch Serverless, Amazon Aurora pgvector ou Pinecone).

## 3. Définitions des termes clés
- RAG (Retrieval-Augmented Generation) : architecture combinant la recherche documentaire vectorielle pour extraire des faits précis avec la génération d'un LLM pour répondre de manière exacte sans hallucination.
- Chunk Overlap : chevauchement de texte entre deux fragments consécutifs pour préserver la continuité sémantique aux frontières.
- Embedding : représentation vectorielle numérique de données textuelles ou multimodales.

## 4. Exemple concret
Pipeline d'ingestion et d'indexation vectorielle RAG :
\`\`\`
[Documents PDF sur Amazon S3]
             |
             v
[Amazon Bedrock Knowledge Bases]
   |--> [Stratégie de Chunking : 512 tokens, 50 overlap]
   |--> [Modèle Titan Text Embeddings v2] -> [Vecteurs 1024-dim]
             |
             v
[Index Vectoriel Amazon OpenSearch Serverless (HNSW)]
\`\`\`

## 5. Comparaisons et pièges d'examen
- Bedrock vs SageMaker : Bedrock fournit des modèles fondationnels prêts à l'emploi via une simple API sans gestion d'infrastructure ; SageMaker est destiné à l'entraînement complet, l'ajustement fin (fine-tuning) personnalisé et le déploiement sur conteneurs dédiés.
- Overlap de chunking : l'absence d'overlap peut faire perdre le sens des concepts situés exactement au point de coupure. Un overlap de 10 à 20 % est la bonne pratique standard recommandée.
- Gestion des coûts d'embeddings : Titan v2 permet de réduire la dimensionnalité du vecteur (de 1024 à 512 ou 256) pour diviser par deux ou quatre la taille de stockage de l'index vectoriel avec une perte minime de précision sémantique.

## 6. Lien avec SQL, Snowflake et Databricks
Cette architecture vectorielle correspond aux fonctions \`SNOWFLAKE.CORTEX.EMBED_TEXT_768\` dans Snowflake et aux Vector Search Endpoints associés aux modèles Foundation dans Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 276 à 285.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Un pipeline de données ingère des documents juridiques complexes sur S3 et doit alimenter une base vectorielle pour un assistant RAG. Quelle stratégie de découpage évite de tronquer le sens des concepts situés entre deux segments ?
   - A) Un découpage de taille fixe avec chevauchement (chunk overlap) de 10 à 20 % (Bonne réponse).
   - B) Un découpage strict sans aucun chevauchement.
   - C) Une compression gzip avant vectorisation.
   - D) L'indexation du document entier sous la forme d'un seul mot-clé.
2. Quel service managé permet d'intégrer des modèles de fondation comme Anthropic Claude ou Amazon Titan via une API sans provisionner de serveurs GPU dédiés ?
   - A) Amazon Bedrock (Bonne réponse).
   - B) Amazon EC2 g4dn.
   - C) Amazon QuickSight.
   - D) AWS DataSync.
`
  },
  {
    file: 'dea-11-athena-requetage-serverless.md',
    title: 'Analytique SQL Sans Serveur sur S3 avec Amazon Athena',
    content: `# Chapitre 11 : Analytique SQL Sans Serveur sur S3 avec Amazon Athena

## 1. Objectifs d'apprentissage
- Comprendre le fonctionnement d'Amazon Athena (moteur Trino/Presto sans serveur).
- Maîtriser les techniques de réduction des coûts de requêtage (formats colonnaires, partitionnement).
- Utiliser la commande CTAS (CREATE TABLE AS SELECT) pour transformer et matérialiser des données.
- Configurer la projection de partitions (Partition Projection) pour éliminer les latences de métadonnées.

## 2. Explication claire : quand choisir quoi
Amazon Athena est un service interactif de requêtes SQL sans serveur qui analyse directement les données stockées dans Amazon S3 en utilisant les métadonnées définies dans l'AWS Glue Data Catalog :

Quand choisir Amazon Athena :
- Pour explorer rapidement des données brutes déposées dans un Data Lake S3 avec des requêtes SQL ANSI standard.
- Pour des analyses ponctuelles (ad-hoc queries) ou des tableaux de bord interactifs sans payer de cluster fixe.
- Tarification : facturation au volume de données numérisées (scanned data) par la requête (5 USD par To analysé).

Optimisation des requêtes et réduction drastique des coûts :
1. Conversion en formats colonnaires (Apache Parquet ou ORC) :
   - Divise par 5 à 10 le volume de données numérisées car seules les colonnes mentionnées dans la clause \`SELECT\` et \`WHERE\` sont lues depuis S3.
2. Compression des données :
   - Compresser les fichiers Parquet avec Snappy ou ZSTD réduit la taille des blocs S3 et accélère les transferts I/O.
3. Partitionnement des répertoires S3 :
   - Structurer les données par préfixes S3 hiérarchiques (ex. \`year=2026/month=10/day=31/\`).
   - Une requête filtrant sur une date ne numérise que la partition ciblée, ignorant le reste du Data Lake.
4. Projection de partitions (Partition Projection) :
   - Évite à Athena d'interroger l'API du Glue Data Catalog pour lister les milliers de partitions de dates. Les clés de partition et leurs plages sont configurées directement dans les propriétés de la table SerDe, rendant l'exécution des requêtes quasi instantanée.

Utilisation de CTAS (CREATE TABLE AS SELECT) :
- Permet de créer une nouvelle table dans Athena tout en transformant, filtrant, partitionnant et convertissant les données sources vers le format Parquet en une seule requête SQL.
- Limite CTAS : une requête CTAS peut écrire un maximum de 100 partitions simultanément.

## 3. Définitions des termes clés
- SerDe (Serializer/Deserializer) : composant logiciel indiquant à Athena comment interpréter les données d'un format de fichier spécifique (ex. LazySimpleSerDe pour CSV, OpenCSVSerDe, Parquet SerDe).
- CTAS : syntaxe SQL créant une nouvelle table et écrivant son contenu sous forme de fichiers optimisés sur S3.
- Workgroups Athena : espaces de travail permettant d'isoler les utilisateurs, de définir des limites maximales de volume numérisé par requête et d'acheminer les métriques vers CloudWatch.

## 4. Exemple concret
Requête CTAS transformant des logs bruts en Parquet partitionné :
\`\`\`sql
CREATE TABLE curated_logs
WITH (
    format = 'PARQUET',
    parquet_compression = 'SNAPPY',
    external_location = 's3://mon-datalake/curated/logs/',
    partitioned_by = ARRAY['annee', 'mois']
) AS
SELECT
    id_utilisateur,
    action,
    montant,
    year(date_event) AS annee,
    month(date_event) AS mois
FROM raw_logs_csv
WHERE statut = 'CONFIRME';
\`\`\`

## 5. Comparaisons et pièges d'examen
- Athena vs Redshift : Athena est sans serveur, facturé au To scanné et idéal pour les requêtes ponctuelles sur S3 ; Redshift est un entrepôt MPP permanent conçu pour les requêtes décisionnelles intensives, les jointures complexes et les milliers d'utilisateurs concurrents.
- Athena vs Redshift Spectrum : Redshift Spectrum permet à un cluster Redshift existant d'interroger les tables externes S3 ; Athena ne nécessite aucun cluster Redshift.
- Requêtes sur fichiers non partitionnés en CSV : piège d'examen classique où une requête scanne l'intégralité du compartiment S3, engendrant des coûts exorbitants et des temps d'attente prolongés.

## 6. Lien avec SQL, Snowflake et Databricks
Amazon Athena interrogeant S3 avec Glue Data Catalog fonctionne exactement comme les External Tables dans Snowflake ou les requêtes SQL Databricks exécutées sur des fichiers non managés dans un stockage cloud objet.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 152 à 165.
- Voir aussi : cours Nikolai Schuler, leçons 176 à 190.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Une équipe data exécute des requêtes SQL sur 50 To de logs bruts CSV stockés dans S3 et constate des coûts très élevés. Quelles deux actions conjointes réduisent le plus efficacement les coûts de requêtage Athena ?
   - A) Convertir les fichiers au format Apache Parquet et partitionner les données par date (Bonne réponse).
   - B) Migrer les fichiers vers S3 Glacier Deep Archive.
   - C) Augmenter la fréquence des requêtes pour exploiter le cache mémoire.
   - D) Remplacer les clés de partition par des fichiers JSON non compressés.
2. Quelle fonctionnalité d'Athena configure le moteur pour calculer dynamiquement les chemins de partitions sans appeler le catalogue de métadonnées Glue à chaque requête ?
   - A) La projection de partitions (Partition Projection) (Bonne réponse).
   - B) Les Workgroups de facturation.
   - C) La commande VACUUM REINDEX.
   - D) L'intégration avec AWS Secrets Manager.
`
  }
];
