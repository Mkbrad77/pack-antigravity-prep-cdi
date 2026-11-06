import fs from 'node:fs';
import path from 'node:path';
import { makeQDomain } from './question_builder.js';

const DOMAIN_1 = 'Domaine 1 : Ingestion et transformation des données (34 %)';
const makeQ = (idNum, topic_id, statement, options, correct_answer, expA, expB, expC, expD, source_url) =>
  makeQDomain(DOMAIN_1, idNum, topic_id, statement, options, correct_answer, expA, expB, expC, expD, source_url, 'dea', 'moyen', 120);

const questions = [];
let qNum = 1;

// 1-14: KINESIS
questions.push(makeQ(
  qNum++, 'kinesis',
  "Une entreprise collecte 1 500 enregistrements par seconde d'une taille moyenne de 800 octets via un flux Amazon Kinesis Data Streams provisionné avec 1 shard. Les producteurs reçoivent fréquemment l'erreur ProvisionedThroughputExceededException. Quelle action résout ce problème de la manière la plus efficace ?",
  [
    "A) Effectuer un resharding du flux pour passer à au moins 2 shards afin d'absorber les 1 500 enregistrements/s",
    "B) Augmenter la taille du tampon Firehose à 128 Mo",
    "C) Réduire la durée de rétention des données de 24 heures à 12 heures",
    "D) Activer le chiffrement SSE-KMS sur le flux Kinesis"
  ],
  "A",
  "un shard Kinesis Data Streams supporte au maximum 1 000 enregistrements par seconde ou 1 Mo/s en écriture. Avec 1 500 enregistrements/s, passer à 2 shards fournit une capacité de 2 000 enregistrements/s",
  "Firehose est un service distinct et modifier son tampon ne modifie en rien la limite d'entrée du shard Kinesis Data Streams",
  "la durée de rétention contrôle le stockage historique des données et n'a aucun impact sur le débit d'ingestion maximal par seconde",
  "le chiffrement KMS renforce la sécurité des données au repos mais n'augmente pas le quota d'écriture du shard",
  "https://docs.aws.amazon.com/streams/latest/dev/kinesis-using-sdk-java-resharding.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Une application analytique doit livrer en continu des données de streaming vers un compartiment Amazon S3 au format Apache Parquet sans gérer d'infrastructure de calcul. Quel service configuré avec AWS Glue Data Catalog répond directement à ce besoin ?",
  [
    "A) Amazon Data Firehose avec conversion de format Parquet activée",
    "B) Amazon Kinesis Data Streams avec un consommateur Python sur EC2",
    "C) Amazon Managed Service for Apache Flink écrivant en CSV brut",
    "D) AWS DataSync avec tâche horaire programmée"
  ],
  "A",
  "Amazon Data Firehose est un service entièrement géré sans serveur capable de convertir des flux JSON entrants en format Apache Parquet en utilisant le schéma de table d'AWS Glue Data Catalog",
  "cette approche nécessite le développement, le dimensionnement et la maintenance manuelle d'instances EC2 et de code de sérialisation",
  "elle n'écrit pas nativement en Parquet sans développement de Sink complexe et demande la gestion d'une application Flink",
  "AWS DataSync est un service de transfert de fichiers réseau par lots et non un outil de streaming continu",
  "https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Un pipeline d'ingestion utilise Amazon Data Firehose configuré avec un tampon de 64 Mo et un intervalle de 300 secondes vers Amazon S3. Durant les heures creuses, le volume n'atteint que 5 Mo en 5 minutes. Quand les fichiers sont-ils livrés sur S3 ?",
  [
    "A) Toutes les 300 secondes, dès que la condition d'intervalle de temps est atteinte",
    "B) Uniquement lorsque le seuil de 64 Mo est atteint, quel que soit le délai",
    "C) Immédiatement à chaque arrivée d'enregistrement individuel",
    "D) Une fois par jour lors du cycle de maintenance nocturne AWS"
  ],
  "A",
  "Amazon Data Firehose évalue continuellement les deux critères de tampon et livre dès que le premier des deux seuils (taille ou intervalle) est atteint",
  "le paramètre d'intervalle évite de bloquer les données indéfiniment en cas de faible trafic",
  "Firehose fonctionne par micro-lots (near real-time) et ne livre jamais les événements unitairement",
  "Firehose ne retient jamais les données au-delà de son intervalle maximal configurable de 900 secondes",
  "https://docs.aws.amazon.com/firehose/latest/dev/buffering.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Une architecture de données doit analyser des flux de clics pour détecter des fraudes en moins de 100 ms et simultanément archiver tous les clics bruts sur Amazon S3. Quelle architecture répond le mieux à ce double besoin ?",
  [
    "A) Ingestion dans Kinesis Data Streams lu en parallèle par une fonction Lambda ultra-rapide et par un flux Amazon Data Firehose vers S3",
    "B) Envoi direct des clics vers S3 puis exécution d'un job AWS Glue toutes les minutes",
    "C) Stockage dans une base Amazon RDS avec réplique de lecture",
    "D) Utilisation d'Amazon SQS Standard avec un script cron périodique"
  ],
  "A",
  "Kinesis Data Streams permet à plusieurs consommateurs indépendants de lire simultanément le même flux : Lambda lit en temps réel (< 100 ms) pour la fraude et Firehose archive sur S3",
  "l'écriture sur S3 puis le déclenchement d'un job Glue induit une latence de plusieurs minutes, incompatible avec les 100 ms",
  "une base relationnelle RDS n'est pas adaptée à l'ingestion massive de flux de clics et ne garantit pas la latence sous les 100 ms",
  "SQS ne permet pas à plusieurs consommateurs indépendants de traiter en parallèle les mêmes messages sans duplication complexe",
  "https://docs.aws.amazon.com/streams/latest/dev/introduction.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Plusieurs applications consommatrices lisent un flux Kinesis Data Streams composé de 10 shards. Avec 5 consommateurs, les applications reçoivent des erreurs ReadThroughputExceededException. Quelle fonctionnalité native de Kinesis élimine ce goulot d'étranglement ?",
  [
    "A) Activer l'Enhanced Fan-Out (EFO) avec des consommateurs dédiés en HTTP/2",
    "B) Remplacer Kinesis Data Streams par Amazon SNS",
    "C) Augmenter la durée de rétention des données à 7 jours",
    "D) Réduire le nombre de shards de 10 à 5"
  ],
  "A",
  "l'Enhanced Fan-Out (EFO) attribue à chaque consommateur enregistré un débit dédié de 2 Mo/s par shard via des connexions push HTTP/2, éliminant la contention entre lecteurs multiples",
  "SNS ne conserve pas l'historique des données et n'offre pas la sémantique de streaming par partition",
  "la durée de rétention n'augmente pas la bande passante de lecture par seconde",
  "diviser par deux le nombre de shards réduirait le débit global de lecture au lieu de l'augmenter",
  "https://docs.aws.amazon.com/streams/latest/dev/enhanced-consumers.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Une équipe data souhaite exécuter des fenêtres de calcul glissantes de 10 minutes avec état (stateful) sur un flux continu de capteurs IoT. Quel service managé AWS est expressément conçu pour ce cas d'usage ?",
  [
    "A) Amazon Managed Service for Apache Flink",
    "B) Amazon Data Firehose avec transformation Lambda simple",
    "C) AWS Glue DataBrew",
    "D) Amazon Athena avec requêtes planifiées"
  ],
  "A",
  "Amazon Managed Service for Apache Flink permet d'exécuter des requêtes SQL et du code Java/Scala sur des flux continus avec gestion native de l'état en mémoire et fenêtres temporelles complexes",
  "les transformations Lambda dans Firehose sont sans état et limitées au traitement de micro-lots isolés",
  "Glue DataBrew est un outil visuel de préparation de données par lots pour jeux de données statiques",
  "Athena est un moteur de requêtes interactif sur données au repos dans S3 et non un moteur de calcul continu sur flux",
  "https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Dans Kinesis Data Streams, pourquoi est-il critique de choisir une clé de partition (Partition Key) présentant une cardinalité élevée lors de l'appel PutRecord ?",
  [
    "A) Pour distribuer uniformément les données à travers tous les shards et éviter les shards chauds (hot shards)",
    "B) Pour réduire automatiquement la taille des messages en mémoire",
    "C) Pour permettre le chiffrement asymétrique des enregistrements",
    "D) Pour forcer l'écriture séquentielle dans un unique shard"
  ],
  "A",
  "la clé de partition est hachée par MD5 pour assigner chaque enregistrement à un shard précis. Une faible cardinalité concentre tout le trafic sur un seul shard, provoquant des dépassements de quota",
  "la clé de partition ne compresse pas le corps du message",
  "le chiffrement KMS s'applique indépendamment de la clé de partition",
  "forcer l'écriture sur un seul shard crée un goulet d'étranglement majeur",
  "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Amazon Data Firehose doit charger des données directement dans une table Amazon Redshift. Comment Firehose procède-t-il techniquement pour réaliser cette opération ?",
  [
    "A) Firehose dépose d'abord les micro-lots dans un compartiment Amazon S3 intermédiaire, puis exécute automatiquement une commande COPY vers Redshift",
    "B) Firehose insère les lignes une par une via des instructions SQL INSERT directes",
    "C) Firehose synchronise la mémoire vive de son tampon avec le cache de Redshift",
    "D) Firehose utilise AWS DMS pour répliquer le journal des transactions"
  ],
  "A",
  "Firehose écrit d'abord les données dans un bucket S3 intermédiaire (staging bucket), puis déclenche une commande SQL COPY massive hautement optimisée vers Redshift",
  "des INSERT individuels ligne par ligne satureraient le Leader Node de Redshift et sont proscrits pour les chargements massifs",
  "il n'existe aucune mémoire partagée entre Firehose et les nœuds Redshift",
  "AWS DMS n'intervient pas dans le fonctionnement interne d'Amazon Data Firehose",
  "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html#redshift-delivery"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Quelle nouvelle fonctionnalité d'Amazon Data Firehose (mise en avant dans le guide DEA-C01 v1.1) permet de livrer directement des flux dans des tables ouvertes sans code de compaction complexe ?",
  [
    "A) La livraison directe vers des tables Apache Iceberg hébergées sur Amazon S3",
    "B) L'export automatique vers des disques EBS non montés",
    "C) Le streaming direct vers des tables SQLite locales",
    "D) La réplication synchrone vers AWS Cloud9"
  ],
  "A",
  "Amazon Data Firehose prend en charge la livraison directe vers des tables Apache Iceberg sur S3, intégrant la mise à jour des métadonnées de table et la gestion ACID sans nécessiter de pipeline Spark intermédiaire",
  "Firehose ne livre pas sur des disques blocs EBS isolés",
  "SQLite n'est pas une destination gérée par Firehose",
  "AWS Cloud9 est un IDE et non une destination de streaming de données",
  "https://docs.aws.amazon.com/firehose/latest/dev/iceberg-destination.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Une application utilisant la bibliothèque Kinesis Client Library (KCL) pour lire un flux Kinesis Data Streams doit suivre l'avancement de ses consommateurs. Quel service AWS KCL utilise-t-elle par défaut pour stocker ses checkpoints ?",
  [
    "A) Amazon DynamoDB",
    "B) Amazon ElastiCache for Redis",
    "C) Amazon S3 Glacier",
    "D) AWS Systems Manager Parameter Store"
  ],
  "A",
  "la bibliothèque KCL crée et maintient automatiquement une table Amazon DynamoDB pour suivre les shards attribués à chaque worker et mémoriser les numéros de séquence des derniers enregistrements traités",
  "KCL n'utilise pas Redis par défaut",
  "Glacier est un service d'archivage lent avec des délais de récupération incompatibles avec le streaming temps réel",
  "Parameter Store est conçu pour stocker des paramètres de configuration et non des états de streaming haute fréquence",
  "https://docs.aws.amazon.com/streams/latest/dev/shared-throughput-kcl-users.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Un ingénieur configure un flux Kinesis Data Streams en mode de capacité On-Demand. Quel est le comportement automatique du flux lors d'une hausse soudaine de trafic ?",
  [
    "A) Le flux ajuste automatiquement sa capacité en augmentant le nombre de shards sans intervention manuelle",
    "B) Le flux rejette tous les enregistrements excédentaires jusqu'à la fin de la journée",
    "C) Le flux bascule les données sur des disques magnétiques locaux",
    "D) Le flux convertit les données en fichiers PDF"
  ],
  "A",
  "le mode de capacité On-Demand de Kinesis Data Streams gère automatiquement le provisionnement et la mise à l'échelle des shards pour répondre aux pics de charge sans gestion manuelle de capacité",
  "le mode On-Demand s'adapte au trafic au lieu de rejeter les enregistrements excédentaires",
  "Kinesis ne stocke pas ses flux sur des disques magnétiques locaux",
  "Kinesis est un bus de données binaire et ne convertit jamais les données en PDF",
  "https://docs.aws.amazon.com/streams/latest/dev/how-do-i-size-a-stream.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Quelle est la durée maximale configurable de rétention des données dans un flux Amazon Kinesis Data Streams ?",
  [
    "A) 365 jours (1 an)",
    "B) 24 heures",
    "C) 7 jours",
    "D) Illimitée"
  ],
  "A",
  "la rétention par défaut dans Kinesis Data Streams est de 24 heures, mais elle peut être étendue jusqu'à un maximum strict de 365 jours (8 760 heures)",
  "24 heures est la durée de rétention par défaut, pas la limite maximale",
  "7 jours était une ancienne limite intermédiaire, désormais portée à 365 jours",
  "la rétention Kinesis n'est pas infinie et s'arrête à 365 jours",
  "https://docs.aws.amazon.com/streams/latest/dev/kinesis-extended-retention.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Dans Amazon Data Firehose, quel service de calcul sans serveur peut être invoqué à la volée pour transformer, enrichir ou filtrer les enregistrements avant leur livraison dans S3 ?",
  [
    "A) AWS Lambda",
    "B) Amazon EC2",
    "C) AWS Batch",
    "D) Amazon EKS"
  ],
  "A",
  "Amazon Data Firehose s'intègre nativement avec AWS Lambda pour appliquer des transformations sans serveur personnalisées (décompression, masquage, enrichissement) sur les micro-lots avant livraison",
  "Firehose n'invoque pas directement des instances EC2 pour la transformation de micro-lots",
  "AWS Batch est un planificateur de calcul par lots longs et non un mécanisme de transformation synchrone Firehose",
  "Amazon EKS est un orchestrateur Kubernetes non intégré nativement comme transformateur inline Firehose",
  "https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html"
));

questions.push(makeQ(
  qNum++, 'kinesis',
  "Quel format de compression parmi les suivants est nativement supporté par Amazon Data Firehose lors de la livraison de fichiers sur Amazon S3 ?",
  [
    "A) GZIP, Snappy, Zip et ZSTD",
    "B) Uniquement RAR",
    "C) Uniquement 7z",
    "D) Aucun, la compression est interdite sur Firehose"
  ],
  "A",
  "Amazon Data Firehose prend en charge nativement la compression des données livrées sur S3 avec les formats GZIP, Snappy, Zip et Zstandard (ZSTD)",
  "le format RAR n'est pas un standard pris en charge par Firehose",
  "le format 7z n'est pas supporté par Firehose",
  "Firehose prend en charge plusieurs algorithmes de compression majeurs",
  "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html"
));

// 15-24: MSK / KAFKA
questions.push(makeQ(
  qNum++, 'msk',
  "Une banque migre ses flux Apache Kafka vers AWS. Ses messages atteignent 8 Mo. Pourquoi Amazon MSK est-il recommandé par rapport à Kinesis Data Streams ?",
  [
    "A) Amazon MSK supporte des messages volumineux configurables au-delà de la limite stricte de 1 Mo de Kinesis",
    "B) Amazon MSK est gratuit pour les banques",
    "C) Kinesis ne supporte aucun chiffrement",
    "D) Kinesis impose un arrêt hebdomadaire de maintenance"
  ],
  "A",
  "Kinesis Data Streams limite strictement chaque enregistrement à 1 Mo, alors qu'Amazon MSK basé sur Kafka permet de configurer la taille des messages à plusieurs dizaines de mégaoctets",
  "Amazon MSK est un service payant facturé selon les brokers ou le volume ingéré",
  "Kinesis supporte le chiffrement au repos via AWS KMS et en transit via TLS",
  "Kinesis est un service hautement disponible sans fenêtre d'interruption planifiée",
  "https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html"
));

questions.push(makeQ(
  qNum++, 'msk',
  "Une équipe souhaite capturer en continu les modifications d'une base MySQL sur site vers un topic Amazon MSK sans écrire de code applicatif. Quel composant géré répond à cette exigence ?",
  [
    "A) Amazon MSK Connect avec un connecteur source Debezium pour MySQL",
    "B) AWS Glue DataBrew",
    "C) Amazon Athena Federated Query",
    "D) AWS Snowball Edge"
  ],
  "A",
  "MSK Connect permet d'exécuter des connecteurs Kafka Connect entièrement gérés sans administrer de serveurs, notamment le connecteur Debezium pour capturer les écritures de bases de données (CDC)",
  "Glue DataBrew est un outil visuel de nettoyage de données par lots sans support de streaming CDC Kafka",
  "Athena Federated Query sert à exécuter des requêtes SQL interactives et non à capturer des flux d'événements",
  "Snowball Edge est un matériel physique de transfert hors ligne pour données statiques",
  "https://docs.aws.amazon.com/msk/latest/developerguide/msk-connect.html"
));

questions.push(makeQ(
  qNum++, 'msk',
  "Quel mode de déploiement d'Amazon MSK permet de traiter des flux de streaming variables sans dimensionner à l'avance les brokers ni le stockage EBS ?",
  [
    "A) Amazon MSK Serverless",
    "B) Amazon MSK Provisioned avec instances kafka.m5.large",
    "C) Un cluster Kafka déployé sur Amazon EC2",
    "D) Amazon EMR avec Apache Flink"
  ],
  "A",
  "Amazon MSK Serverless ajuste automatiquement la capacité de calcul, les partitions et le stockage selon le débit entrant réel, libérant l'équipe de toute gestion de serveurs",
  "le mode Provisioned exige de sélectionner manuellement le type d'instance, le nombre de brokers et la taille des volumes EBS",
  "déployer Kafka sur EC2 impose une charge opérationnelle maximale de maintenance d'OS et d'infrastructure",
  "EMR avec Flink demande la gestion et la surveillance d'un cluster complet",
  "https://docs.aws.amazon.com/msk/latest/developerguide/serverless.html"
));

questions.push(makeQ(
  qNum++, 'msk',
  "Quel mécanisme élimine le besoin d'administrer des nœuds de quorum Apache ZooKeeper dans les versions récentes d'Amazon MSK ?",
  [
    "A) Le mode Apache Kafka Raft (KRaft)",
    "B) L'intégration avec AWS Lake Formation",
    "C) Le proxy Amazon RDS",
    "D) L'agent CloudWatch Logs"
  ],
  "A",
  "le protocole KRaft remplace ZooKeeper en gérant les métadonnées directement à l'intérieur des nœuds Kafka, améliorant la montée en charge du nombre de partitions et simplifiant l'architecture",
  "Lake Formation gère la gouvernance et les permissions de données sur les Data Lakes S3 et non les métadonnées internes des topics Kafka",
  "RDS Proxy gère le pool de connexions pour les bases de données relationnelles",
  "l'agent CloudWatch Logs ne fait que collecter des fichiers de logs système",
  "https://docs.aws.amazon.com/msk/latest/developerguide/kraft.html"
));

questions.push(makeQ(
  qNum++, 'msk',
  "Comment sécuriser les communications entre les producteurs d'applications et les brokers d'un cluster Amazon MSK au sein d'un VPC ?",
  [
    "A) Activer le chiffrement en transit TLS et l'authentification mutuelle TLS (mTLS) ou IAM",
    "B) Désactiver les groupes de sécurité du VPC",
    "C) Rendre les sous-réseaux du cluster publics sur Internet",
    "D) Stocker les mots de passe Kafka en clair dans le code source"
  ],
  "A",
  "Amazon MSK prend en charge le chiffrement en transit TLS de bout en bout et offre plusieurs méthodes d'authentification robustes : mTLS avec certificats AWS Private CA, SASL/SCRAM avec Secrets Manager, ou l'authentification native IAM pour Kafka",
  "désactiver les groupes de sécurité supprimerait le pare-feu de protection des instances",
  "exposer les sous-réseaux sur Internet public constitue une violation grave des règles de sécurité réseau",
  "coder des mots de passe en clair dans les applications est une faille de sécurité majeure",
  "https://docs.aws.amazon.com/msk/latest/developerguide/security.html"
));

questions.push(makeQ(
  qNum++, 'msk',
  "Une entreprise doit répliquer des topics Kafka entre deux clusters Amazon MSK situés dans des régions AWS différentes pour assurer un plan de reprise. Quel outil géré par Kafka sur MSK réalise cette réplication ?",
  [
    "A) Apache Kafka MirrorMaker 2 (MM2) déployé via MSK Connect",
    "B) AWS Snowcone",
    "C) Amazon Redshift Spectrum",
    "D) AWS Glue Data Quality"
  ],
  "A",
  "MirrorMaker 2 (MM2) est l'outil standard pour la réplication bidirectionnelle ou active-passive de topics, de configurations et d'offsets entre clusters multi-régions, facilement exécutable sur MSK Connect",
  "Snowcone est un appareil physique de transfert de fichiers",
  "Redshift Spectrum est un moteur de requêtage SQL externe sur Amazon S3",
  "Glue Data Quality sert à mesurer la validité des données tabulaires et non à répliquer des flux de messages",
  "https://docs.aws.amazon.com/msk/latest/developerguide/migration.html"
));

questions.push(makeQ(
  qNum++, 'msk',
  "Quelle méthode permet de déverser automatiquement les messages d'un topic Amazon MSK dans un compartiment Amazon S3 au format Parquet sans coder de consommateur personnalisé ?",
  [
    "A) Déployer un connecteur Kafka Connect Amazon S3 Sink via MSK Connect",
    "B) Configurer une table DynamoDB globale",
    "C) Exécuter une commande VACUUM sur Redshift",
    "D) Utiliser AWS Direct Connect"
  ],
  "A",
  "le connecteur S3 Sink déployé dans MSK Connect lit en continu les partitions Kafka et génère automatiquement des fichiers Parquet partitionnés directement sur Amazon S3",
  "DynamoDB n'est pas un moteur d'export Parquet vers S3",
  "la commande VACUUM sert à réorganiser physiquement les tables locales dans Amazon Redshift",
  "Direct Connect est une connexion réseau physique dédiée et non un connecteur de données applicatif",
  "https://docs.aws.amazon.com/msk/latest/developerguide/msk-connect.html"
));

questions.push(makeQ(
  qNum++, 'msk',
  "Quel paramètre détermine la distribution des messages d'un topic Apache Kafka entre ses différentes partitions sur Amazon MSK ?",
  [
    "A) La clé du message (Message Key) fournie par le producteur",
    "B) La taille de la mémoire RAM du broker",
    "C) La politique de clé AWS KMS",
    "D) L'identifiant de la table Glue Catalog"
  ],
  "A",
  "le producteur Kafka calcule un hachage sur la clé du message (Message Key) pour assigner le message à une partition spécifique, garantissant que tous les messages ayant la même clé arrivent dans la même partition dans l'ordre strict",
  "la RAM du broker n'influence pas l'algorithme de partitionnement des messages",
  "la politique KMS gère les droits cryptographiques et non le routage des messages",
  "Glue Catalog n'intervient pas dans la publication interne de messages Kafka",
  "https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html"
));

questions.push(makeQ(
  qNum++, 'msk',
  "Dans Amazon MSK, quelle métrique CloudWatch permet de détecter qu'un groupe de consommateurs prend du retard par rapport aux messages produits dans un topic ?",
  [
    "A) ConsumerLag ou EstimatedMaxTimeLag",
    "B) CPUUtilization du broker",
    "C) MemoryFree",
    "D) VolumeWriteBytes"
  ],
  "A",
  "la métrique ConsumerLag mesure l'écart entre le dernier offset produit dans une partition et le dernier offset validé par le groupe de consommateurs, signalant un goulot d'étranglement de traitement",
  "la métrique CPUUtilization mesure la charge processeur des brokers sans refléter le retard spécifique d'un consommateur applicatif",
  "MemoryFree mesure la mémoire vive disponible sur l'instance de broker",
  "VolumeWriteBytes mesure le volume d'écritures disque EBS",
  "https://docs.aws.amazon.com/msk/latest/developerguide/metrics-monitor.html"
));

questions.push(makeQ(
  qNum++, 'msk',
  "Comment Amazon MSK assure-t-il la haute disponibilité et la durabilité des données au sein d'un cluster déployé dans une région AWS ?",
  [
    "A) En distribuant les brokers sur 2 ou 3 zones de disponibilité (AZ) avec un facteur de réplication de topic d'au moins 3",
    "B) En effectuant une copie quotidienne sur bande magnétique",
    "C) En verrouillant les écritures pendant la réplication",
    "D) En redémarrant le cluster après chaque message"
  ],
  "A",
  "Amazon MSK déploie les brokers sur plusieurs zones de disponibilité distinctes (multi-AZ) et réplique de manière synchrone les partitions entre brokers selon le facteur de réplication configuré",
  "MSK ne stocke pas de sauvegardes sur bande magnétique",
  "Kafka est conçu pour des écritures concurrentes continues sans verrouillage bloquant du cluster",
  "redémarrer le cluster après chaque message détruirait le débit et la disponibilité du service",
  "https://docs.aws.amazon.com/msk/latest/developerguide/msk-high-availability.html"
));

// 25-40: GLUE
questions.push(makeQ(
  qNum++, 'glue',
  "Un job AWS Glue ETL quotidien traite des fichiers volumineux sur S3. Comment éviter que le job ne retraite l'intégralité des fichiers historiques à chaque exécution ?",
  [
    "A) Activer les Job Bookmarks sur le job Glue et appeler explicitement job.commit() dans le script",
    "B) Supprimer les fichiers sources S3 après chaque exécution",
    "C) Passer le worker type de G.1X à G.2X",
    "D) Désactiver le catalogue de métadonnées Glue"
  ],
  "A",
  "les Job Bookmarks mémorisent l'état d'avancement des données déjà traitées et l'appel à job.commit() est impératif pour enregistrer l'état à la fin de l'exécution",
  "supprimer les fichiers sources détruirait l'historique brut de la couche Bronze du Data Lake",
  "changer le type de worker alloue plus de mémoire mais ne modifie pas la logique de lecture incrémentale",
  "le catalogue de métadonnées permet précisément d'organiser et de filtrer les tables",
  "https://docs.aws.amazon.com/glue/latest/dg/monitor-continuations.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Lors de l'ingestion d'un flux de fichiers JSON complexes contenant des types divergents (par exemple un champ contenant parfois un entier et parfois une chaîne), pourquoi l'ingénieur choisit-il un DynamicFrame Glue plutôt qu'un DataFrame Spark standard ?",
  [
    "A) Le DynamicFrame gère nativement les schémas non stricts et permet de résoudre les types conflictuels avec ResolveChoice",
    "B) Le DynamicFrame ne consomme aucun DPU lors des calculs",
    "C) Le DynamicFrame s'exécute uniquement sur des puces GPU",
    "D) Le DynamicFrame interdit l'écriture au format Apache Parquet"
  ],
  "A",
  "le DynamicFrame est une abstraction propriétaire de Glue conçue pour les schémas hétérogènes : les champs aux types mixtes sont représentés par des ChoiceTypes résolus via ResolveChoice sans faire échouer le job",
  "l'exécution d'un DynamicFrame consomme des DPU exactement comme un DataFrame Spark",
  "les DynamicFrames s'exécutent sur les workers standards G.1X et G.2X",
  "les DynamicFrames peuvent écrire directement en Parquet, ORC, CSV ou JSON",
  "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-crawler-pyspark-extensions-dynamic-frame.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Un job Glue ETL doit lire une table partitionnée sur S3 représentant 10 To. Le job ne doit traiter que le mois d'octobre 2026. Quelle technique évite de charger l'intégralité des métadonnées et fichiers en mémoire ?",
  [
    "A) Utiliser un push_down_predicate dans create_dynamic_frame.from_catalog pour filtrer les partitions au niveau du catalogue",
    "B) Lire l'ensemble des 10 To puis appliquer un filtre Spark df.filter()",
    "C) Déplacer manuellement les fichiers d'octobre dans un autre bucket",
    "D) Désactiver le format colonnaire Parquet"
  ],
  "A",
  "le push_down_predicate évalue l'expression de filtrage directement sur les métadonnées du Glue Data Catalog, évitant à Spark de scanner et de lister les milliers de fichiers des autres partitions S3",
  "df.filter() nécessite de lire d'abord les métadonnées et potentiellement les données de l'ensemble des 10 To avant de filtrer en mémoire, ce qui est extrêmement lent et coûteux",
  "déplacer manuellement des fichiers introduit une dette opérationnelle fragile",
  "désactiver le format Parquet aggraverait les temps de transfert",
  "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-partitions.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Quelle est la définition exacte d'un DPU (Data Processing Unit) dans la tarification et le dimensionnement d'AWS Glue ETL ?",
  [
    "A) Une unité de capacité équivalente à 4 vCPU et 16 Go de mémoire RAM",
    "B) Une unité équivalente à 1 vCPU et 2 Go de mémoire RAM",
    "C) Un serveur physique complet comprenant 64 vCPU et 256 Go de RAM",
    "D) Une licence logicielle facturée par utilisateur mensuel"
  ],
  "A",
  "selon la documentation officielle AWS Glue, 1 DPU fournit une capacité de calcul de 4 vCPU et 16 Go de mémoire RAM",
  "1 vCPU et 2 Go ne correspondent à aucun type de worker standard Glue",
  "un DPU est une mesure de calcul virtualisée et non un serveur physique de 64 vCPU",
  "Glue est un service facturé à la consommation à la seconde (DPU-heure) sans abonnement utilisateur",
  "https://docs.aws.amazon.com/glue/latest/dg/add-job.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Un Crawler AWS Glue analyse un compartiment Amazon S3 contenant de nouvelles données chaque jour. Comment le Crawler détecte-t-il les modifications de structure de table (évolution de schéma) ?",
  [
    "A) Il compare le schéma déduit des fichiers avec la définition existante dans le Data Catalog et met à jour la table selon la politique configurée",
    "B) Il réécrit tous les fichiers S3 dans un nouveau format",
    "C) Il supprime systématiquement la table existante et la recrée de zéro",
    "D) Il envoie un message texte SMS à l'administrateur sans modifier le catalogue"
  ],
  "A",
  "le Crawler inspecte les formats et métadonnées des objets S3, compare la structure trouvée avec la table du Glue Data Catalog et applique l'action configurée (ajouter les nouvelles colonnes, ignorer ou marquer obsolète)",
  "un Crawler ne modifie ni ne réécrit jamais les fichiers de données stockés sur S3",
  "écraser la table existante supprimerait l'historique des partitions enregistrées",
  "le Crawler met à jour le catalogue de façon autonome sans validation manuelle par SMS",
  "https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Une équipe data souhaite permettre à des analystes sans compétences en programmation de nettoyer, normaliser et profiler visuellement des jeux de données. Quel service AWS répond à ce besoin ?",
  [
    "A) AWS Glue DataBrew",
    "B) Amazon EMR avec commandes Scala",
    "C) AWS Lambda avec conteneurs C++",
    "D) AWS Systems Manager"
  ],
  "A",
  "AWS Glue DataBrew est un outil visuel de préparation de données sans code fournissant plus de 250 transformations préconfigurées et des fonctions de profilage statistique",
  "programmer en Scala sur EMR requiert des compétences pointues d'ingénierie logicielle",
  "coder des fonctions Lambda en C++ nécessite une expertise poussée de développement",
  "Systems Manager sert à administrer l'infrastructure système et les correctifs d'OS",
  "https://docs.aws.amazon.com/databrew/latest/dg/what-is.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Quelle transformation native de DynamicFrame permet d'extraire des champs imbriqués dans une structure JSON complexe et de les aplatir au premier niveau dans AWS Glue ?",
  [
    "A) Relationalize ou Unnest",
    "B) DropNullFields",
    "C) SelectFields",
    "D) Filter"
  ],
  "A",
  "la méthode Relationalize (ou Unnest) prend un DynamicFrame avec des hiérarchies JSON imbriquées ou des tableaux et produit un ensemble de tables aplaties prêtes pour les entrepôts relationnels",
  "DropNullFields supprime uniquement les colonnes contenant exclusivement des valeurs nulles",
  "SelectFields conserve uniquement une liste de champs spécifiés sans aplatir les structures complexes",
  "Filter applique une condition logique pour filtrer des lignes",
  "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-transforms-relationalize.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Un ingénieur configure un job AWS Glue Streaming pour lire des événements depuis un flux Amazon Kinesis. Quel paramètre garantit que le traitement reprendra sans perte ni doublon en cas de défaillance du worker ?",
  [
    "A) Configurer un répertoire de points de contrôle (Checkpoint Location) sur Amazon S3",
    "B) Utiliser des disques EBS éphémères non répliqués",
    "C) Réduire la durée de rétention Kinesis à 1 heure",
    "D) Désactiver le catalogue Glue"
  ],
  "A",
  "Spark Structured Streaming dans AWS Glue Streaming s'appuie sur le mécanisme de checkpointing stocké sur S3 pour enregistrer l'offset exact du flux traité pour chaque micro-lot",
  "un disque éphémère local perdrait son état lors du remplacement d'un nœud défaillant",
  "réduire la rétention Kinesis augmenterait le risque de perte définitive de données en cas de panne prolongée",
  "le catalogue Glue n'a pas d'impact négatif sur la tolérance aux pannes du streaming",
  "https://docs.aws.amazon.com/glue/latest/dg/add-job-streaming.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Quelle option de configuration d'AWS Glue ETL permet de réduire les coûts lorsque le volume de données à traiter varie fortement d'un jour à l'autre ?",
  [
    "A) Activer l'Auto Scaling dans les propriétés du job Glue",
    "B) Fixer manuellement le nombre de workers à 100 en permanence",
    "C) Remplacer Spark par un script Bash mono-thread",
    "D) Activer la journalisation détaillée niveau DEBUG sur CloudWatch"
  ],
  "A",
  "la fonction Auto Scaling d'AWS Glue ajoute et retire dynamiquement des workers (DPU) en fonction de la charge de calcul réelle des étapes Spark, évitant de payer pour des capacités inactives",
  "réserver 100 workers en permanence engendre une sur-facturation massive lors des jours creux",
  "un script Bash mono-thread ne peut pas traiter des volumes analytiques distribués et ralentirait excessivement les traitements",
  "les logs DEBUG augmentent la facture CloudWatch sans réduire les coûts de calcul",
  "https://docs.aws.amazon.com/glue/latest/dg/monitor-job-autoscaling.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Comment un script PySpark dans AWS Glue peut-il convertir un DynamicFrame nommé dyn_frame en un DataFrame Apache Spark standard pour exécuter des requêtes Spark SQL ?",
  [
    "A) En appelant dyn_frame.toDF()",
    "B) En appelant dyn_frame.castToDataFrame()",
    "C) En exportant vers un fichier CSV temporaire",
    "D) En redémarrant le cluster Spark"
  ],
  "A",
  "la méthode toDF() est la fonction officielle fournie par la bibliothèque AWS Glue pour convertir un DynamicFrame en DataFrame Apache Spark natif",
  "castToDataFrame n'est pas une méthode existante dans l'API AWS Glue",
  "sérialiser sur disque temporaire CSV dégraderait inutilement les performances",
  "un redémarrage de cluster n'a aucun lien avec la conversion de types d'objets en mémoire",
  "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-crawler-pyspark-extensions-dynamic-frame.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Quel type de worker AWS Glue est recommandé pour les charges de travail intensives en mémoire nécessitant des jointures volumineuses et des déduplications lourdes ?",
  [
    "A) Le type G.2X (8 vCPU, 32 Go de mémoire)",
    "B) Le type Standard (ancien modèle déprécié)",
    "C) Le type t2.micro",
    "D) Le type Nano"
  ],
  "A",
  "les workers G.2X fournissent le double de mémoire et de vCPU par rapport aux workers G.1X, offrant 32 Go de RAM et 128 Go d'espace disque par worker, ce qui prévient les erreurs OutOfMemory lors de jointures Spark complexes",
  "le type de worker Standard est obsolète et moins performant que la famille G",
  "les instances EC2 t2.micro ne font pas partie des types de workers configurables dans AWS Glue ETL",
  "le type Nano n'existe pas dans l'offre AWS Glue",
  "https://docs.aws.amazon.com/glue/latest/dg/add-job.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Quelle méthode permet à AWS Glue Data Catalog d'interdire à des utilisateurs d'accéder à certaines colonnes contenant des données confidentielles (PII) lors de requêtes exécutées via Amazon Athena ?",
  [
    "A) Configurer des permissions de sécurité au niveau de la colonne dans AWS Lake Formation",
    "B) Chiffrer chaque colonne avec un mot de passe différent dans un fichier ZIP",
    "C) Supprimer les fichiers sous-jacents sur S3",
    "D) Créer un VPC par colonne"
  ],
  "A",
  "AWS Lake Formation s'intègre directement avec le Glue Data Catalog pour appliquer des filtres de sécurité fins au niveau de la colonne et de la cellule, masquant les données sensibles pour les rôles IAM non autorisés",
  "Parquet et Athena ne prennent pas en charge des fichiers ZIP chiffrés par colonne",
  "supprimer les fichiers S3 détruirait l'intégralité du jeu de données pour tous les utilisateurs",
  "les VPC isolent des réseaux et non des colonnes tabulaires",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/data-filters-about.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Un job Glue ETL échoue régulièrement avec l'erreur java.lang.OutOfMemoryError: Java heap space lors du traitement d'une jointure entre une grande table et plusieurs petites tables. Quelle optimisation résout cette erreur ?",
  [
    "A) Utiliser la fonction broadcast() sur les petites tables pour éliminer le shuffle en mémoire des exécuteurs",
    "B) Réduire la mémoire allouée au Driver Spark",
    "C) Remplacer le format Parquet par des fichiers texte JSON bruts",
    "D) Désactiver les Job Bookmarks"
  ],
  "A",
  "la diffusion d'une petite table de référence (broadcast join) envoie une copie complète à chaque exécuteur, éliminant la redistribution réseau massive (shuffle) et évitant la saturation de la mémoire tas Java",
  "réduire la mémoire du Driver aggraverait les problèmes d'allocation",
  "le format JSON est beaucoup plus volumineux en mémoire que le format binaire Parquet",
  "les Job Bookmarks contrôlent le périmètre des fichiers lus et n'impactent pas l'exécution de la jointure en mémoire",
  "https://docs.aws.amazon.com/glue/latest/dg/monitor-job-oom.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Quel paramètre dans un script Glue ETL permet de regrouper automatiquement de multiples petits fichiers S3 en blocs de taille optimale lors de la lecture afin d'accélérer le traitement Spark ?",
  [
    "A) Le paramètre groupFiles et groupSize dans les options de connexion S3",
    "B) Le paramètre dropDuplicates()",
    "C) L'option strictSchema: true",
    "D) Le paramètre maxRetries: 0"
  ],
  "A",
  "la fonctionnalité de regroupement de fichiers (groupFiles: 'inPartition', groupSize: '134217728' pour 128 Mo) permet de fusionner virtuellement les petits fichiers lors de la lecture S3 pour créer des partitions Spark équilibrées",
  "dropDuplicates sert à éliminer les lignes en double dans le jeu de données",
  "strictSchema impose une validation de structure mais ne résout pas le problème physique des petits fichiers",
  "maxRetries gère les tentatives en cas d'échec d'exécution",
  "https://docs.aws.amazon.com/glue/latest/dg/grouping-input-files.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Quelle option de connexion AWS Glue permet de se connecter en toute sécurité à une base de données PostgreSQL hébergée dans un sous-réseau privé d'Amazon VPC sans passer par Internet ?",
  [
    "A) Créer une connexion réseau Glue de type JDBC associée aux sous-réseaux et groupes de sécurité privés du VPC",
    "B) Attribuer une adresse IP publique à la base de données PostgreSQL",
    "C) Ouvrir le port 5432 à 0.0.0.0/0",
    "D) Désactiver le mot de passe de la base"
  ],
  "A",
  "les connexions Glue JDBC dans un VPC créent des interfaces réseau élastiques (ENI) dans les sous-réseaux privés spécifiés, permettant à Glue d'atteindre les bases de données internes en toute sécurité sans traverser Internet",
  "attribuer une IP publique expose inutilement la base transactionnelle à Internet",
  "ouvrir le port à 0.0.0.0/0 constitue une faille de sécurité critique",
  "supprimer l'authentification viole les règles de sécurité fondamentales",
  "https://docs.aws.amazon.com/glue/latest/dg/setup-vpc-for-glue-access.html"
));

questions.push(makeQ(
  qNum++, 'glue',
  "Comment planifier l'exécution d'un pipeline AWS Glue comprenant un Crawler puis un job ETL dès que le Crawler a terminé son analyse de schéma ?",
  [
    "A) Utiliser un déclencheur conditionnel (Conditional Trigger) dans AWS Glue ou orchestrer les étapes via AWS Step Functions",
    "B) Configurer un minuteur fixe sur un ordinateur portable",
    "C) Lancer manuellement les deux tâches en même temps",
    "D) Modifier le fichier /etc/crontab de la console AWS"
  ],
  "A",
  "AWS Glue Triggers supporte les déclencheurs basés sur des événements (ex. déclencher le job dès que le crawler passe à l'état SUCCEEDED), ou plus robuste encore, via une machine à états AWS Step Functions",
  "un minuteur local sur PC est fragile et incompatible avec les exigences de production",
  "lancer les deux en même temps risque de faire échouer le job si le catalogue n'est pas encore à jour",
  "la console AWS ne dispose pas de fichier /etc/crontab modifiable par les utilisateurs",
  "https://docs.aws.amazon.com/glue/latest/dg/trigger-job.html"
));

// 41-52: SPARK / EMR
questions.push(makeQ(
  qNum++, 'spark-emr',
  "Quelle configuration d'instances optimise les coûts d'un cluster Amazon EMR exécutant Spark sans risquer de corrompre le stockage HDFS ?",
  [
    "A) Nœuds Master et Core sur instances On-Demand, Nœuds Task sur instances Spot",
    "B) Tous les nœuds sur instances Spot",
    "C) Nœuds Master sur instances Spot et Nœuds Task sur On-Demand",
    "D) Nœuds Core sur instances Spot sans aucun nœud Task"
  ],
  "A",
  "les nœuds Master (pilote YARN) et Core (stockage HDFS) doivent être stables pour éviter la perte de données ou l'échec du cluster, tandis que les Task Nodes n'hébergent pas HDFS et peuvent utiliser des instances Spot à tarif très réduit",
  "avoir tous les nœuds sur Spot risque de résilier les nœuds Core et de détruire les données HDFS",
  "résilier le nœud Master entraîne l'arrêt immédiat et l'échec de l'ensemble du cluster EMR",
  "mettre les Core Nodes sur Spot expose le système de fichiers HDFS à une corruption en cas d'interruption",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-instances-guidelines.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Une requête Spark joignant une table de 500 Go et une table de 5 Mo souffre de lenteurs majeures dues au shuffle réseau. Quelle optimisation technique résout ce problème ?",
  [
    "A) Utiliser une jointure diffusée (Broadcast Join) sur la petite table de 5 Mo",
    "B) Augmenter la taille des blocs HDFS à 1 Go",
    "C) Désactiver l'Adaptive Query Execution (AQE)",
    "D) Convertir la table de faits au format CSV"
  ],
  "A",
  "le Broadcast Join envoie une copie complète de la table de dimension (5 Mo) à chaque exécuteur, éliminant totalement le shuffle réseau de la table de faits de 500 Go",
  "augmenter la taille des blocs HDFS n'élimine pas le shuffle réseau de la jointure",
  "désactiver l'AQE empêcherait Spark d'optimiser dynamiquement les requêtes",
  "convertir en CSV augmenterait massivement le volume de données scannées et aggraverait les temps de calcul",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-spark-performance.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Dans un calcul Spark sur EMR, une seule tâche (task) s'exécute pendant 45 minutes alors que toutes les autres tâches se terminent en moins de 30 secondes. Quel phénomène explique cette situation et comment le corriger ?",
  [
    "A) Un Data Skew causé par une clé de regroupement déséquilibrée, corrigible par salage de clé (salting) ou AQE",
    "B) Un manque de bande passante Internet sur le nœud primaire",
    "C) La présence d'un bucket S3 chiffré",
    "D) L'utilisation d'instances Spot sur les Task Nodes"
  ],
  "A",
  "l'asymétrie de données (Data Skew) se produit lorsqu'une partition concentre une part disproportionnée des enregistrements. Le salage de clé ajoute un préfixe aléatoire pour éclater la clé sur plusieurs exécuteurs",
  "le nœud primaire coordonne le cluster et ne traite pas les tâches de calcul distribuées",
  "le chiffrement S3 s'applique uniformément à tous les fichiers et ne crée pas de disparité entre tâches",
  "les Task Nodes Spot exécutent les tâches à la même vitesse que les instances On-Demand",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-spark-performance.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Quel système de fichiers permet aux clusters Amazon EMR d'interroger directement Amazon S3 comme couche de stockage persistant tout en autorisant l'extinction complète du cluster après le traitement ?",
  [
    "A) EMRFS (EMR File System)",
    "B) HDFS natif sur disques éphémères uniquement",
    "C) NFS v3",
    "D) FAT32"
  ],
  "A",
  "EMRFS est une extension d'Hadoop développée par AWS permettant aux applications EMR d'accéder directement à Amazon S3 comme un système de fichiers, découplant totalement le calcul du stockage persistant",
  "HDFS sur disques éphémères perd toutes ses données dès la terminaison du cluster",
  "NFS v3 n'est pas le connecteur de données distribué d'Amazon EMR pour S3",
  "FAT32 est un ancien système de fichiers de disques personnels sans rapport avec les Data Lakes distribués",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-file-systems.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Une équipe souhaite exécuter des applications Apache Spark sans provisionner, configurer ni administrer manuellement de clusters EC2. Quel mode de déploiement EMR répond exactement à cette exigence ?",
  [
    "A) Amazon EMR Serverless",
    "B) Amazon EMR sur EC2 avec 10 instances c5.xlarge",
    "C) Amazon EMR avec AMI personnalisée",
    "D) AWS OpsWorks"
  ],
  "A",
  "Amazon EMR Serverless permet d'exécuter des applications Spark et Hive sans gérer de serveurs ou de clusters, AWS ajustant automatiquement la mémoire et les processeurs requis pour chaque job",
  "EMR sur EC2 nécessite de configurer et d'administrer des instances virtuelles",
  "une AMI personnalisée augmente la charge de maintenance système",
  "AWS OpsWorks est un outil de gestion de configuration Puppet/Chef sans rapport avec le Serverless Big Data",
  "https://docs.aws.amazon.com/emr/latest/EMR-Serverless-UserGuide/emr-serverless.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Quelle fonctionnalité introduite dans Apache Spark 3.x et activée par défaut sur les versions récentes d'Amazon EMR ajuste dynamiquement le nombre de partitions de shuffle et convertit les jointures en broadcast à l'exécution ?",
  [
    "A) Adaptive Query Execution (AQE)",
    "B) Catalyst Optimizer statique",
    "C) Spark Streaming DStreams",
    "D) MapReduce v1"
  ],
  "A",
  "l'Adaptive Query Execution (AQE) ré-optimise les plans d'exécution Spark au moment de l'exécution en se basant sur les statistiques réelles des étapes terminées (coalescing de partitions, conversion en broadcast, gestion du skew)",
  "Catalyst statique génère le plan avant l'exécution sans ajustement dynamique aux données réelles",
  "les DStreams sont l'ancienne API de streaming dépréciée au profit de Structured Streaming",
  "MapReduce v1 est l'ancêtre d'Hadoop, bien antérieur à Spark",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-spark-aqe.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Quel composant logiciel d'un cluster Amazon EMR est chargé de planifier et d'allouer les ressources de processeur et de mémoire aux différentes applications distribuées ?",
  [
    "A) YARN (Yet Another Resource Negotiator)",
    "B) Apache Zeppelin",
    "C) Ganglia",
    "D) Hue"
  ],
  "A",
  "YARN est le gestionnaire de ressources distribué standard de l'écosystème Hadoop/EMR qui alloue les conteneurs de calcul aux applications Spark, MapReduce ou Tez",
  "Zeppelin est une interface de notebooks interactifs",
  "Ganglia est un outil de surveillance graphique des métriques système",
  "Hue est une interface utilisateur web pour interroger les bases Hive et HDFS",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-overview.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Lors de l'amorçage d'un cluster Amazon EMR, quel mécanisme permet d'installer automatiquement des bibliothèques Python tierces (comme pandas ou scikit-learn) sur tous les nœuds avant le démarrage de Spark ?",
  [
    "A) Les actions d'amorçage (Bootstrap Actions) pointant vers un script shell sur Amazon S3",
    "B) L'envoi d'emails via Amazon SES",
    "C) La modification manuelle par SSH de chaque worker après démarrage",
    "D) L'utilisation d'une règle de cycle de vie S3"
  ],
  "A",
  "les Bootstrap Actions exécutent des scripts personnalisés sur chaque instance du cluster pendant son provisionnement avant que les démons Hadoop et Spark ne soient lancés, permettant d'installer des dépendances uniformément",
  "Amazon SES est un service d'envoi d'emails transactionnels sans rapport avec l'installation de paquets",
  "se connecter manuellement par SSH à chaque worker est fastidieux, source d'erreurs et incompatible avec l'auto-scaling",
  "les règles de cycle de vie S3 gèrent l'archivage ou la suppression d'objets et n'exécutent pas de scripts sur EC2",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-bootstrap.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Comment arrêter automatiquement un cluster Amazon EMR lorsqu'aucun travail Spark n'a été soumis depuis plus de 30 minutes afin d'éviter des coûts inutiles ?",
  [
    "A) Activer la fonctionnalité d'arrêt automatique pour inactivité (Auto-termination / Idle Timeout)",
    "B) Supprimer le compartiment S3 de stockage",
    "C) Débrancher le câble réseau de la baie de serveurs",
    "D) Planifier une alarme CloudWatch qui supprime le compte AWS"
  ],
  "A",
  "Amazon EMR intègre une option d'auto-termination qui surveille l'activité du cluster et le termine automatiquement après une période d'inactivité configurable sans étape en cours",
  "supprimer le compartiment S3 détruirait les données persistantes et ne résilierait pas le cluster EMR",
  "débrancher un câble physique est impossible dans un cloud public managé",
  "supprimer le compte AWS détruirait l'ensemble de l'entreprise",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-auto-termination-policy.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Sur Amazon EMR, quelle différence fondamentale existe-t-il entre une transformation Spark de type 'narrow' (étroite) et une transformation de type 'wide' (large) ?",
  [
    "A) Une transformation narrow (ex. map, filter) s'exécute sur une seule partition sans déplacement réseau, tandis qu'une wide (ex. groupByKey, join) nécessite un shuffle réseau entre exécuteurs",
    "B) Les transformations narrow s'exécutent uniquement sur le Master Node",
    "C) Les transformations wide ne fonctionnent que sur des fichiers texte CSV",
    "D) Les transformations narrow exigent obligatoirement un GPU"
  ],
  "A",
  "les transformations narrow opèrent indépendamment au sein de chaque partition sans transfert de données entre workers, alors que les transformations wide nécessitent de redistribuer les données à travers le réseau (shuffle)",
  "les transformations narrow sont exécutées en parallèle par l'ensemble des exécuteurs de travail",
  "les transformations wide s'appliquent à tous les types de données et formats (Parquet, ORC, mémoire)",
  "les transformations Spark standards s'exécutent sur CPU standard sans exiger de GPU",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-spark-performance.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Quelle option permet d'exécuter des applications Spark sur un cluster Kubernetes géré existant partagé avec d'autres microservices d'entreprise ?",
  [
    "A) Amazon EMR sur Amazon EKS",
    "B) AWS Elastic Beanstalk",
    "C) Amazon RDS Multi-AZ",
    "D) AWS Storage Gateway"
  ],
  "A",
  "Amazon EMR sur Amazon EKS permet d'exécuter des frameworks Big Data open source conteneurisés sur une infrastructure Kubernetes partagée, optimisant l'utilisation des ressources de calcul de l'entreprise",
  "Elastic Beanstalk est une plateforme de déploiement d'applications web classiques",
  "Amazon RDS est un service de bases de données relationnelles gérées",
  "Storage Gateway est une passerelle de stockage hybride",
  "https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/what-is-emr-eks.html"
));

questions.push(makeQ(
  qNum++, 'spark-emr',
  "Pourquoi est-il fortement recommandé de compresser les sorties intermédiaires de map (map output) lors de gros jobs Spark sur Amazon EMR ?",
  [
    "A) Pour réduire la quantité de données transférées sur le réseau lors de la phase de shuffle et soulager les disques locaux",
    "B) Pour chiffrer les données avec une clé RSA 4096 bits",
    "C) Pour empêcher les nœuds de calcul d'accéder à Internet",
    "D) Pour supprimer les doublons dans le jeu de données"
  ],
  "A",
  "activer la compression des sorties de map (ex. avec l'algorithme rapide Snappy ou LZ4 via spark.shuffle.compress) diminue drastiquement le trafic I/O disque et réseau lors du shuffle",
  "la compression intermédiaire vise la rapidité de transfert et non le chiffrement asymétrique lourd",
  "la compression n'a aucun lien avec les restrictions d'accès réseau à Internet",
  "la compression physique ne modifie pas le contenu logique et ne supprime aucun doublon",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-spark-performance.html"
));

// 53-62: LAMBDA / BATCH
questions.push(makeQ(
  qNum++, 'lambda-batch',
  "Un script de traitement de données développé en Python prend entre 25 et 35 minutes pour analyser chaque fichier. Pourquoi ne peut-il pas être déployé tel quel dans une fonction AWS Lambda ?",
  [
    "A) La durée d'exécution maximale d'une fonction AWS Lambda est strictement limitée à 15 minutes (900 secondes)",
    "B) AWS Lambda ne supporte pas le langage Python",
    "C) AWS Lambda ne peut pas lire de données depuis Amazon S3",
    "D) AWS Lambda facture un forfait fixe de 1 000 USD par exécution"
  ],
  "A",
  "AWS Lambda impose un timeout maximal strict de 15 minutes (900 secondes). Tout traitement dépassant cette durée doit être migré vers AWS Batch, AWS Glue ou un conteneur ECS/EMR",
  "Python fait partie des runtimes supportés nativement par AWS Lambda depuis sa création",
  "Lambda s'intègre nativement avec S3 pour lire et écrire des fichiers d'objets",
  "Lambda est facturé à la milliseconde selon la mémoire et le temps consommé, sans aucun forfait fixe exorbitant",
  "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html"
));

questions.push(makeQ(
  qNum++, 'lambda-batch',
  "Quel service AWS de calcul par lots permet d'exécuter des conteneurs Docker de traitement de données durant plusieurs heures sur des instances EC2 Spot managées sans administrer de planificateur de tâches ?",
  [
    "A) AWS Batch",
    "B) AWS Lambda",
    "C) Amazon API Gateway",
    "D) Amazon DynamoDB"
  ],
  "A",
  "AWS Batch provisionne dynamiquement la quantité optimale de ressources de calcul (EC2 ou Fargate, avec support complet des instances Spot) en fonction du volume et des exigences des tâches conteneurisées soumises",
  "Lambda est limité à 15 minutes d'exécution par invocation",
  "API Gateway est une passerelle de gestion d'API HTTP/REST/WebSocket et non un moteur de calcul par lots",
  "DynamoDB est une base de données NoSQL et n'exécute pas de conteneurs Docker de calcul",
  "https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html"
));

questions.push(makeQ(
  qNum++, 'lambda-batch',
  "Comment dimensionner la puissance processeur (vCPU) allouée à une fonction AWS Lambda pour accélérer des calculs intensifs de transformation de données ?",
  [
    "A) En augmentant la mémoire RAM configurée, AWS allouant automatiquement une puissance vCPU proportionnelle",
    "B) En cochant manuellement une case vCPU dédiée dans la console",
    "C) En souscrivant un plan de support Business",
    "D) En ajoutant des commentaires de performance dans le code Python"
  ],
  "A",
  "dans le modèle de calcul AWS Lambda, la puissance processeur (vCPU) est strictement proportionnelle à la mémoire allouée (1 769 Mo de RAM équivalant exactement à 1 vCPU complet)",
  "il n'existe pas de réglage vCPU direct et isolé de la mémoire dans la configuration Lambda standard",
  "le plan de support offre une assistance technique humaine mais ne modifie pas les ressources des fonctions",
  "des commentaires textuels dans le code source n'ont aucun impact sur l'infrastructure physique allouée",
  "https://docs.aws.amazon.com/lambda/latest/dg/configuration-function-common.html"
));

questions.push(makeQ(
  qNum++, 'lambda-batch',
  "Quelle est la capacité maximale d'espace disque temporaire éphémère (/tmp) configurable sur une fonction AWS Lambda pour stocker des fichiers de travail pendant son exécution ?",
  [
    "A) 10 240 Mo (10 Go)",
    "B) 512 Mo strictement",
    "C) 1 To",
    "D) Illimitée"
  ],
  "A",
  "le stockage éphémère du répertoire /tmp dans AWS Lambda est configurable entre 512 Mo et un maximum de 10 240 Mo (10 Go), permettant de décompresser et manipuler des fichiers volumineux localement",
  "512 Mo est la valeur minimale par défaut, mais elle peut être augmentée jusqu'à 10 Go",
  "1 To dépasse la limite maximale du stockage éphémère Lambda (pour 1 To, utiliser Amazon EFS monté sur Lambda)",
  "le stockage temporaire Lambda n'est pas illimité",
  "https://docs.aws.amazon.com/lambda/latest/dg/configuration-ephemeral-storage.html"
));

questions.push(makeQ(
  qNum++, 'lambda-batch',
  "Une architecture réactive doit déclencher un traitement immédiat dès qu'un fichier de données est téléversé dans un compartiment Amazon S3. Quelle solution présente la plus faible latence et le coût d'infrastructure nul au repos ?",
  [
    "A) Configurer une notification d'événement Amazon S3 ObjectCreated ciblant directement une fonction AWS Lambda",
    "B) Exécuter une instance EC2 t3.medium en continu interrogeant l'API S3 toutes les secondes",
    "C) Planifier un cluster Amazon EMR permanent vérifiant le bucket",
    "D) Utiliser AWS Snowcone en mode hors ligne"
  ],
  "A",
  "les notifications d'événements S3 déclenchent de manière quasi instantanée (< 1 seconde) les fonctions AWS Lambda sans aucun serveur à provisionner ni coût lorsque aucun fichier n'arrive",
  "maintenir une instance EC2 active en boucle d'interrogation (polling) génère des coûts permanents et sature inutilement l'API S3",
  "un cluster EMR permanent est extrêmement onéreux pour surveiller l'arrivée de fichiers ponctuels",
  "Snowcone est un équipement physique pour des sites distants déconnectés et non un mécanisme de notification réactif",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html"
));

questions.push(makeQ(
  qNum++, 'lambda-batch',
  "Que devient un événement envoyé à une fonction AWS Lambda asynchrone si la fonction échoue après l'épuisement de toutes les tentatives automatiques de réessai ?",
  [
    "A) Il est dirigé vers une Dead-Letter Queue (DLQ) SQS/SNS ou un EventBridge On-Failure Destination si configuré",
    "B) Il est automatiquement supprimé sans aucune trace possible",
    "C) Il redémarre l'ensemble du compte AWS",
    "D) Il est transféré sur un disque dur physique envoyé par voie postale"
  ],
  "A",
  "AWS Lambda permet de configurer une Dead-Letter Queue (file d'attente SQS ou sujet SNS) ou une destination d'échec Lambda (On-Failure Destination) pour isoler et analyser les messages ayant échoué",
  "si une DLQ ou destination d'échec est configurée, le message n'est pas perdu",
  "un échec d'exécution Lambda n'a aucun impact sur l'état global du compte AWS",
  "AWS n'envoie pas de disques durs par la poste pour des erreurs d'invocation logicielle",
  "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html"
));

questions.push(makeQ(
  qNum++, 'lambda-batch',
  "Dans AWS Batch, quel composant définit l'image de conteneur Docker, les commandes à exécuter, les variables d'environnement et les limites de mémoire et de vCPU pour une tâche ?",
  [
    "A) La Job Definition (Définition de tâche)",
    "B) La Compute Environment",
    "C) La Job Queue",
    "D) La Gateway Route Table"
  ],
  "A",
  "la Job Definition spécifie comment la tâche conteneurisée doit être exécutée : l'image Docker dans ECR, la commande, les ressources vCPU/mémoire, les volumes montés et le rôle IAM d'exécution",
  "la Compute Environment définit le type d'infrastructure sous-jacente (EC2 On-Demand, Spot, Fargate)",
  "la Job Queue gère la priorité et l'ordonnancement des tâches avant leur exécution",
  "la Gateway Route Table est un composant de routage réseau du VPC sans rapport avec les spécifications Docker",
  "https://docs.aws.amazon.com/batch/latest/userguide/job_definitions.html"
));

questions.push(makeQ(
  qNum++, 'lambda-batch',
  "Une entreprise souhaite réduire de 70 à 80 % le coût d'exécution de ses tâches AWS Batch tolérantes aux interruptions. Quelle stratégie de calcul doit-elle adopter ?",
  [
    "A) Configurer un environnement de calcul utilisant des instances Spot avec le type SPOT_CAPACITY_OPTIMIZED",
    "B) Utiliser exclusivement des instances On-Demand surdimensionnées",
    "C) Désactiver la mise à l'échelle automatique de l'environnement",
    "D) Exécuter les calculs sur une base Amazon RDS"
  ],
  "A",
  "AWS Batch prend en charge nativement les instances Spot et la stratégie d'allocation SPOT_CAPACITY_OPTIMIZED sélectionne les familles d'instances présentant le plus faible risque d'interruption tout en réduisant les coûts de 70 à 90 %",
  "les instances On-Demand sont facturées au plein tarif sans la remise Spot",
  "désactiver l'auto-scaling empêche d'éteindre les serveurs inactifs après le calcul",
  "Amazon RDS est un moteur relationnel OLTP et non un environnement de conteneurs de calcul par lots",
  "https://docs.aws.amazon.com/batch/latest/userguide/compute_environment_parameters.html"
));

questions.push(makeQ(
  qNum++, 'lambda-batch',
  "Lors de l'utilisation d'AWS Lambda avec Amazon Kinesis Data Streams comme source d'événements, comment Lambda gère-t-il la lecture des enregistrements de chaque shard ?",
  [
    "A) Un poll continu des shards est assuré par le service Lambda via l'Event Source Mapping, qui invoque la fonction de manière synchrone par lots",
    "B) Kinesis ouvre une connexion SSH directe vers le conteneur Lambda",
    "C) Les shards écrivent les données sur un partage NFS partagé",
    "D) Les enregistrements sont envoyés par courrier électronique"
  ],
  "A",
  "l'Event Source Mapping interne à Lambda interroge (poll) activement les shards Kinesis, récupère les lots d'enregistrements (batch size) et invoque la fonction Lambda de manière synchrone",
  "Kinesis n'ouvre pas de connexions SSH vers l'environnement sans serveur de Lambda",
  "la transmission s'effectue via des appels d'API HTTPS sécurisés et non par un système de fichiers NFS",
  "aucun courrier électronique n'est utilisé dans le flux d'ingestion de données Kinesis/Lambda",
  "https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html"
));

questions.push(makeQ(
  qNum++, 'lambda-batch',
  "Quel paramètre de l'Event Source Mapping Lambda avec Kinesis permet de diviser un lot en deux sous-lots en cas d'erreur de traitement afin d'isoler l'enregistrement corrompu ?",
  [
    "A) BisectBatchOnFunctionError",
    "B) MaximumRecordAgeInSeconds",
    "C) ParallelizationFactor",
    "D) TumblingWindowInSeconds"
  ],
  "A",
  "l'option BisectBatchOnFunctionError divise automatiquement le lot défaillant en deux parties et réessaie chacune séparément, permettant d'isoler précisément le message corrompu qui fait échouer la fonction sans bloquer le shard indéfiniment",
  "MaximumRecordAgeInSeconds définit l'âge maximal des enregistrements avant leur rejet",
  "ParallelizationFactor augmente le nombre de fonctions Lambda concurrentes par shard",
  "TumblingWindowInSeconds permet d'agréger des fenêtres temporelles avant l'invocation",
  "https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html"
));

// 63-72: ORCHESTRATION (Step Functions / MWAA)
questions.push(makeQ(
  qNum++, 'orchestration',
  "Une équipe data doit orchestrer un pipeline ETL complexe comprenant un job Glue, une attente synchrone de fin, l'exécution d'une requête Athena puis une notification SNS. Elle refuse de gérer des serveurs. Quelle solution choisir ?",
  [
    "A) AWS Step Functions avec une machine à états de type Standard",
    "B) Un script cron déployé sur une instance EC2 t2.micro",
    "C) Amazon QuickSight",
    "D) AWS Storage Gateway"
  ],
  "A",
  "AWS Step Functions est un orchestrateur serverless visuel natif intégrant directement les services AWS (Glue, Athena, SNS) avec gestion automatisée des reprises et des états",
  "un cron sur EC2 réintroduit la gestion d'un serveur unique vulnérable aux pannes sans tolérance aux pannes",
  "QuickSight est un outil de visualisation et de tableaux de bord BI et non un orchestrateur ETL",
  "Storage Gateway est une passerelle de stockage de fichiers hybride",
  "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html"
));

questions.push(makeQ(
  qNum++, 'orchestration',
  "Quelle fonctionnalité de Step Functions permet de diviser un jeu de données de 100 000 fichiers sur Amazon S3 et de lancer jusqu'à 10 000 exécutions de calcul parallèles en simultané ?",
  [
    "A) L'état Distributed Map (Distributed Map state)",
    "B) L'état Choice",
    "C) L'état Pass",
    "D) L'intégration avec Amazon Route 53"
  ],
  "A",
  "le Distributed Map de Step Functions permet d'itérer à très grande échelle sur des millions d'objets stockés dans S3 en coordonnant jusqu'à 10 000 exécutions de tâches parallèles (Lambda, Batch)",
  "l'état Choice applique une logique conditionnelle de type if/then/else",
  "l'état Pass transmet simplement des données en sortie sans exécuter de calcul",
  "Route 53 est un service DNS et n'orchestre pas de traitements parallèles de données",
  "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-asl-use-map-state-distributed.html"
));

questions.push(makeQ(
  qNum++, 'orchestration',
  "Quelle différence fondamentale distingue les workflows Standard et Express dans AWS Step Functions ?",
  [
    "A) Les workflows Standard durent jusqu'à 1 an avec sémantique exactly-once ; les workflows Express durent jusqu'à 5 minutes avec sémantique at-least-once et très fort débit",
    "B) Les workflows Standard sont gratuits et les Express payants",
    "C) Les workflows Express ne peuvent pas invoquer AWS Lambda",
    "D) Les workflows Standard ne supportent pas le format JSON"
  ],
  "A",
  "les workflows Standard conviennent aux processus métier et pipelines longs (jusqu'à 1 an, exécution exactement une fois) ; les workflows Express sont conçus pour les charges événementielles massives et l'ingestion IoT (< 5 min, débit > 100 000/s)",
  "les deux types de workflows sont facturés selon des modèles adaptés à leur usage",
  "les workflows Express invoquent parfaitement les fonctions Lambda",
  "tous les états Step Functions manipulent nativement le format JSON",
  "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html"
));

questions.push(makeQ(
  qNum++, 'orchestration',
  "Dans une définition de machine à états Step Functions, comment attendre la fin réelle d'un job AWS Glue avant de passer à l'étape suivante ?",
  [
    "A) Utiliser le modèle d'intégration de service synchrone en ajoutant le suffixe .sync (ex. arn:aws:states:::glue:startJobRun.sync)",
    "B) Insérer une boucle infinie de 24 heures",
    "C) Créer une table DynamoDB",
    "D) Déclencher une alarme de facturation"
  ],
  "A",
  "l'intégration synchrone (.sync) de Step Functions gère automatiquement la surveillance du job asynchrone AWS Glue et ne fait progresser la machine à états que lorsque le job s'est achevé avec succès",
  "une boucle infinie d'attente consomme des transitions inutilement et manque de robustesse",
  "une table DynamoDB n'est pas nécessaire pour synchroniser un appel natif Step Functions",
  "une alarme de facturation ne gère pas la synchronisation de tâches logiques",
  "https://docs.aws.amazon.com/step-functions/latest/dg/connect-sync.html"
));

questions.push(makeQ(
  qNum++, 'orchestration',
  "Une équipe d'ingénieurs data expérimentée en Python utilise des dizaines de DAGs Apache Airflow complexes avec des dépendances dbt et des connecteurs sur site. Quel service géré AWS permet de migrer cette infrastructure sans gérer de serveurs Airflow ?",
  [
    "A) Amazon Managed Workflows for Apache Airflow (Amazon MWAA)",
    "B) Amazon Lightsail",
    "C) AWS CodePipeline",
    "D) Amazon Kinesis Video Streams"
  ],
  "A",
  "Amazon MWAA est le service managé d'AWS pour Apache Airflow qui automatise l'installation, le dimensionnement des workers et la maintenance de la plateforme Airflow tout en conservant le code de DAGs Python existant",
  "Lightsail est une offre d'hébergement simplifiée de machines virtuelles pour petits sites",
  "CodePipeline est un service d'intégration et déploiement continu logiciel (CI/CD)",
  "Kinesis Video Streams est spécialisé dans l'ingestion de flux vidéo en direct",
  "https://docs.aws.amazon.com/mwaa/latest/userguide/what-is-mwaa.html"
));

questions.push(makeQ(
  qNum++, 'orchestration',
  "Comment les DAGs (Directed Acyclic Graphs) d'Apache Airflow sont-ils déployés et mis à jour dans un environnement Amazon MWAA ?",
  [
    "A) En déposant simplement les fichiers scripts Python dans le répertoire dags/ du compartiment Amazon S3 associé à l'environnement",
    "B) En recompilant le noyau Linux de l'instance MWAA",
    "C) En se connectant par SSH sur le serveur web Airflow",
    "D) En exécutant un script PowerShell sur chaque client"
  ],
  "A",
  "Amazon MWAA synchronise automatiquement son planificateur Airflow avec un compartiment Amazon S3 dédié : copier ou mettre à jour un script de DAG dans le dossier S3 configuré rend le nouveau DAG disponible sans redémarrage",
  "l'infrastructure MWAA est entièrement gérée et n'expose pas de noyau Linux à recompiler",
  "MWAA n'autorise pas l'accès SSH direct aux serveurs sous-jacents",
  "PowerShell sur les postes clients n'a aucun lien avec le déploiement interne de DAGs sur S3",
  "https://docs.aws.amazon.com/mwaa/latest/userguide/configuring-dag-folder.html"
));

questions.push(makeQ(
  qNum++, 'orchestration',
  "Comment spécifier des dépendances et bibliothèques Python supplémentaires (comme dbt-snowflake ou boto3) dans un environnement Amazon MWAA ?",
  [
    "A) En référençant un fichier requirements.txt stocké sur Amazon S3 dans la configuration de l'environnement MWAA",
    "B) En modifiant le registre Windows des serveurs",
    "C) En ouvrant un ticket au support AWS pour chaque bibliothèque",
    "D) En copiant le code source de toutes les bibliothèques dans chaque script de DAG",
    "A"
  ],
  "A",
  "Amazon MWAA lit un fichier requirements.txt standard déposé sur S3 et installe automatiquement les packages pip spécifiés sur le serveur web, le scheduler et l'ensemble des workers Airflow",
  "MWAA fonctionne sous Linux dans des conteneurs sécurisés sans aucun registre Windows",
  "l'installation de bibliothèques courantes est autonome via requirements.txt sans intervention du support AWS",
  "dupliquer le code des bibliothèques dans chaque DAG est une très mauvaise pratique de développement",
  "https://docs.aws.amazon.com/mwaa/latest/userguide/working-dags-dependencies.html"
));

questions.push(makeQ(
  qNum++, 'orchestration',
  "Dans AWS Step Functions, quel bloc permet de gérer automatiquement les défaillances transitoires d'un service (comme un ralentissement temporaire d'une API) avec un délai exponentiel entre les essais ?",
  [
    "A) Le bloc Retry avec le paramètre BackoffRate",
    "B) Le bloc Catch",
    "C) Le bloc Fail",
    "D) Le bloc Succeed"
  ],
  "A",
  "le bloc Retry dans Amazon States Language (ASL) permet de définir une liste d'erreurs interceptées, le nombre maximal de tentatives (MaxAttempts), l'intervalle initial (IntervalSeconds) et le multiplicateur de temporisation (BackoffRate)",
  "le bloc Catch capture une erreur définitive pour dérouter le flux vers un état de gestion d'erreur de secours",
  "le bloc Fail termine l'exécution de la machine à états en marquant l'exécution comme échouée",
  "le bloc Succeed termine l'exécution en marquant l'état comme réussi",
  "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html"
));

questions.push(makeQ(
  qNum++, 'orchestration',
  "Quand est-il préférable d'utiliser AWS Step Functions plutôt qu'Amazon MWAA (Apache Airflow) pour orchestrer un pipeline ?",
  [
    "A) Lorsque l'architecture est 100 % serverless, native AWS, réactive aux événements et ne nécessite aucune gestion d'environnement applicatif permanent",
    "B) Lorsque l'équipe exige une interface web open source hébergée sur site",
    "C) Lorsque le pipeline doit durer plus de 2 ans consécutifs",
    "D) Lorsque le pipeline nécessite un serveur FTP local"
  ],
  "A",
  "Step Functions est un service sans serveur natif AWS sans coût au repos et sans maintenance de serveurs web ou de workers, idéal pour les flux réactifs et l'intégration étroite avec les services AWS",
  "Step Functions est un service cloud propriétaire managé et non une application hébergée sur site",
  "la durée d'exécution maximale d'un workflow Standard Step Functions est de 1 an",
  "Step Functions n'exécute pas de démons FTP locaux",
  "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html"
));

questions.push(makeQ(
  qNum++, 'orchestration',
  "Dans Amazon MWAA, comment les workers Airflow sont-ils mis à l'échelle lorsque le nombre de tâches parallèles en attente dans la file Celery augmente fortement ?",
  [
    "A) MWAA utilise l'Auto Scaling pour ajouter dynamiquement des workers jusqu'au nombre maximal configuré dans l'environnement",
    "B) L'administrateur doit redémarrer manuellement l'environnement MWAA",
    "C) Les tâches excédentaires sont définitivement perdues",
    "D) Les workers supplémentaires doivent être loués auprès d'un autre fournisseur cloud"
  ],
  "A",
  "Amazon MWAA intègre un mécanisme d'auto-scaling natif qui surveille la file d'attente CeleryExecutor et ajuste automatiquement le nombre de workers Fargate entre le min et le max configurés",
  "l'auto-scaling s'effectue sans aucune interruption ni redémarrage de l'environnement",
  "les tâches en attente restent en file dans la file Celery sans être perdues",
  "MWAA provisionne ses capacités de calcul directement sur l'infrastructure AWS",
  "https://docs.aws.amazon.com/mwaa/latest/userguide/mwaa-autoscaling.html"
));

// 73-80: MIGRATION & TRANSFERT
questions.push(makeQ(
  qNum++, 'migration-transfert',
  "Une entreprise doit migrer une base de données de production Oracle sur site vers Amazon Aurora PostgreSQL tout en maintenant le service opérationnel pendant la transition. Quel service AWS assure le chargement initial et la réplication continue ?",
  [
    "A) AWS Database Migration Service (AWS DMS) avec Change Data Capture (CDC)",
    "B) AWS Snowcone envoi postal hebdomadaire",
    "C) Amazon S3 Glacier Select",
    "D) AWS DataSync"
  ],
  "A",
  "AWS DMS permet la migration de bases de données hétérogènes (Oracle vers PostgreSQL) en effectuant d'abord le chargement initial (Full Load), puis en répliquant en continu chaque modification via la capture des changements (CDC)",
  "Snowcone est un support physique hors ligne inadapté à la synchronisation continue de transactions actives",
  "Glacier Select sert à exécuter des requêtes SQL sur des archives froides et non à migrer des bases actives",
  "AWS DataSync est conçu pour transférer des fichiers et systèmes de fichiers (NFS, SMB) et non des transactions de bases de données",
  "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html"
));

questions.push(makeQ(
  qNum++, 'migration-transfert',
  "Pour convertir les schémas de tables, les déclencheurs et les procédures stockées PL/SQL complexes d'Oracle vers PostgreSQL lors d'une migration hétérogène, quel outil AWS doit être utilisé en amont d'AWS DMS ?",
  [
    "A) AWS Schema Conversion Tool (AWS SCT)",
    "B) AWS CloudFormation",
    "C) Amazon Inspector",
    "D) AWS Systems Manager"
  ],
  "A",
  "AWS Schema Conversion Tool (AWS SCT) analyse le code source de la base source, convertit automatiquement la grande majorité des schémas et objets vers le dialecte cible, et génère un rapport des éléments nécessitant une adaptation manuelle",
  "CloudFormation est un outil d'Infrastructure-as-Code pour déployer des ressources AWS",
  "Inspector est un scanner de vulnérabilités logicielles",
  "Systems Manager permet d'administrer des flottes de serveurs et d'appliquer des correctifs d'OS",
  "https://docs.aws.amazon.com/SchemaConversionTool/latest/userguide/CHAP_Welcome.html"
));

questions.push(makeQ(
  qNum++, 'migration-transfert',
  "Une entreprise dispose d'un système de fichiers NFS sur site contenant 50 To de données non structurées. Elle dispose d'une connexion réseau dédiée de 10 Gbit/s vers AWS et souhaite synchroniser ces données vers Amazon S3 rapidement avec vérification d'intégrité. Quel service utiliser ?",
  [
    "A) AWS DataSync",
    "B) AWS Snowmobile",
    "C) Une copie manuelle par FTP non sécurisé",
    "D) AWS Lambda avec boucle infinie"
  ],
  "A",
  "AWS DataSync est optimisé pour le transfert accéléré en ligne de gros volumes de fichiers depuis NFS/SMB vers S3 ou EFS, utilisant un protocole réseau parallèle propriétaire avec contrôle d'intégrité des données",
  "Snowmobile est un camion de transport physique réservé aux volumes colossaux (> 10-100 Po)",
  "un FTP manuel non sécurisé est lent, non résilient, non chiffré et sans validation d'intégrité automatique",
  "Lambda n'est pas conçu pour transférer 50 To de fichiers NFS en continu",
  "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"
));

questions.push(makeQ(
  qNum++, 'migration-transfert',
  "Un laboratoire de recherche dans un désert sans connexion réseau doit transférer 70 To de données sismiques vers Amazon S3. Quelle solution matérielle et sécurisée est la plus adaptée ?",
  [
    "A) Commander un appareil AWS Snowball Edge Storage Optimized, copier les données localement et le renvoyer à AWS",
    "B) Téléverser les données via une connexion satellite 56 kbit/s",
    "C) Attendre la construction d'une ligne de fibre optique",
    "D) Utiliser AWS Direct Connect"
  ],
  "A",
  "AWS Snowball Edge Storage Optimized offre 80 To d'espace utilisable sécurisé avec chiffrement matériel AES-256 pour déplacer physiquement des dizaines de téraoctets sans aucune connexion Internet",
  "une liaison satellite à 56 kbit/s nécessiterait plusieurs siècles pour transférer 70 To",
  "attendre une infrastructure physique retarderait indéfiniment le projet de recherche",
  "Direct Connect exige une liaison physique télécom dédiée impossible à mettre en place rapidement dans une zone désertique",
  "https://docs.aws.amazon.com/snowball/latest/developer-guide/whatisedge.html"
));

questions.push(makeQ(
  qNum++, 'migration-transfert',
  "Des partenaires commerciaux externes doivent déposer quotidiennement des fichiers comptables vers un compartiment Amazon S3 en utilisant le protocole SFTP sécurisé sans modifier leurs clients existants. Quel service managé AWS répond à ce besoin ?",
  [
    "A) AWS Transfer Family (protocole SFTP)",
    "B) Amazon Route 53",
    "C) Amazon DynamoDB Accelerator (DAX)",
    "D) Amazon VPC Peering"
  ],
  "A",
  "AWS Transfer Family fournit des points de terminaison SFTP, FTPS et FTP entièrement managés adossés directement au stockage Amazon S3 ou Amazon EFS sans gérer de serveurs SFTP",
  "Route 53 est un serveur DNS et ne gère pas de transferts SFTP",
  "DAX est un accélérateur de cache mémoire pour DynamoDB",
  "VPC Peering connecte deux réseaux virtuels AWS et ne fournit pas de passerelle SFTP pour clients tiers",
  "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html"
));

questions.push(makeQ(
  qNum++, 'migration-transfert',
  "Quelle est la capacité utile de stockage d'un appareil compact AWS Snowcone pour le transfert de données en environnement restreint ?",
  [
    "A) 8 To (ou 14 To sur modèle Snowcone SSD)",
    "B) 80 To",
    "C) 100 Po",
    "D) 500 Mo"
  ],
  "A",
  "l'appareil AWS Snowcone est conçu pour être ultra-portable (environ 2,1 kg) et fournit 8 To d'espace HDD ou 14 To sur le modèle Snowcone SSD pour la collecte de données sur le terrain",
  "80 To est la capacité du boîtier AWS Snowball Edge Storage Optimized",
  "100 Po est la capacité maximale d'un conteneur AWS Snowmobile",
  "500 Mo est une capacité dérisoire bien inférieure aux spécifications d'un Snowcone",
  "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snowcone-what-is.html"
));

questions.push(makeQ(
  qNum++, 'migration-transfert',
  "Lors de l'utilisation d'AWS DMS avec Amazon S3 comme point de terminaison cible (Target Endpoint), dans quel format de fichier optimisé pour l'analytique DMS peut-il écrire directement ?",
  [
    "A) Apache Parquet",
    "B) Microsoft Word .docx",
    "C) Fichiers binaires exécutables .exe",
    "D) Format audio MP3"
  ],
  "A",
  "AWS DMS prend en charge nativement l'écriture des données cibles sur Amazon S3 au format colonnaire Apache Parquet compressé avec Snappy, idéal pour une intégration directe avec Athena et Glue",
  "DMS est un outil de bases de données et ne produit pas de documents Word",
  "DMS n'écrit pas de binaires exécutables",
  "le format audio MP3 n'a aucun rapport avec les données relationnelles tabulaires",
  "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html"
));

questions.push(makeQ(
  qNum++, 'migration-transfert',
  "Pour répliquer en continu les écritures d'une base de données source PostgreSQL vers S3 avec AWS DMS, quel mécanisme interne du moteur de base de données PostgreSQL DMS lit-il ?",
  [
    "A) Les journaux de transactions Write-Ahead Logging (WAL)",
    "B) Les tables de statistiques de la base",
    "C) La corbeille du système d'exploitation",
    "D) L'historique des requêtes de la console web"
  ],
  "A",
  "AWS DMS s'appuie sur la réplication logique et la lecture des journaux de transactions WAL (Write-Ahead Logging) de PostgreSQL pour capturer chaque transaction validée sans surcharger le moteur",
  "les tables de statistiques décrivent la distribution des données et non les écritures en temps réel",
  "la corbeille système ne contient pas les transactions de base de données",
  "l'historique de console n'enregistre pas les modifications physiques de tables",
  "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.PostgreSQL.html"
));

// 81-88: SQS / SNS / EVENTBRIDGE
questions.push(makeQ(
  qNum++, 'sqs-sns',
  "Un pipeline de traitement de commandes bancaires exige un traitement strict dans l'ordre d'émission et l'interdiction absolue de traiter deux fois la même transaction. Quel service de file d'attente AWS répond à cette exigence ?",
  [
    "A) Amazon SQS FIFO",
    "B) Amazon SQS Standard",
    "C) Amazon SNS Standard",
    "D) Amazon Kinesis Video Streams"
  ],
  "A",
  "Amazon SQS FIFO garantit l'ordre strict de traitement premier entré premier sorti (First-In, First-Out) et offre une déduplication intégrée pour garantir le traitement exactement une fois",
  "SQS Standard garantit un ordre au mieux (best-effort) et une livraison au moins une fois (at-least-once) qui peut produire des doublons",
  "SNS Standard ne conserve pas les messages dans une file persistante ordonnée",
  "Kinesis Video Streams est conçu pour la diffusion vidéo et non pour des transactions bancaires tabulaires",
  "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html"
));

questions.push(makeQ(
  qNum++, 'sqs-sns',
  "Dans Amazon SQS Standard, que se passe-t-il pendant la durée définie par le délai de visibilité (Visibility Timeout) lorsqu'un consommateur récupère un message de la file ?",
  [
    "A) Le message reste dans la file mais devient invisible pour les autres consommateurs pour éviter qu'ils ne le traitent simultanément",
    "B) Le message est immédiatement détruit de la file",
    "C) Le message est copié dans tous les autres comptes AWS",
    "D) La file est verrouillée en écriture"
  ],
  "A",
  "le Visibility Timeout empêche les autres instances consommatrices de récupérer le même message pendant que le premier travailleur le traite. Si le consommateur ne supprime pas le message avant la fin du délai, il redevient visible",
  "le message n'est pas détruit : il doit être supprimé explicitement par l'application via DeleteMessage",
  "SQS n'envoie pas de copie dans d'autres comptes AWS",
  "les producteurs peuvent continuer à écrire de nouveaux messages sans interruption",
  "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"
));

questions.push(makeQ(
  qNum++, 'sqs-sns',
  "Quelle architecture de découplage permet d'envoyer une notification unique depuis un système de paiement et de la diffuser en parallèle vers plusieurs files SQS indépendantes (facturation, expédition, fidélité) ?",
  [
    "A) Le modèle Fan-Out (Amazon SNS souscrit par plusieurs files Amazon SQS)",
    "B) Un script cron appelant chaque consommateur l'un après l'autre",
    "C) L'écriture dans un fichier texte partagé sur Dropbox",
    "D) Une base SQLite mono-fichier"
  ],
  "A",
  "le patron d'architecture Fan-Out utilise un sujet Amazon SNS auquel sont abonnées plusieurs files Amazon SQS distinctes : chaque message publié sur SNS est immédiatement dupliqué et livré dans toutes les files abonnées en parallèle",
  "un script séquentiel crée une dépendance forte et ralentit le traitement global",
  "partager un fichier sur un stockage externe non géré est fragile et non sécurisé",
  "SQLite ne permet pas la montée en charge distribuée en écritures concurrentes",
  "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"
));

questions.push(makeQ(
  qNum++, 'sqs-sns',
  "Dans Amazon SQS FIFO, quel attribut du message permet de regrouper logiquement les messages (par exemple par identifiant client) afin de garantir l'ordre strict au sein d'un même groupe tout en parallélisant le traitement entre groupes distincts ?",
  [
    "A) MessageGroupId",
    "B) MessageDeduplicationId",
    "C) ReceiptHandle",
    "D) MD5OfBody"
  ],
  "A",
  "le MessageGroupId identifie le groupe logique auquel appartient le message : tous les messages partageant le même identifiant sont traités dans l'ordre strict par un seul consommateur à la fois, tandis que les messages de groupes distincts sont traités en parallèle",
  "MessageDeduplicationId sert à éliminer les messages identiques soumis plusieurs fois",
  "ReceiptHandle est un jeton d'accusé de réception renvoyé lors de la lecture d'un message",
  "MD5OfBody est une somme de contrôle vérifiant l'intégrité du corps du message",
  "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagegroupid-property.html"
));

questions.push(makeQ(
  qNum++, 'sqs-sns',
  "Quel service sans serveur AWS permet de router des événements système ou applicatifs complexes en utilisant des règles de filtrage avancées sur le contenu JSON des messages (Content-based filtering) vers des dizaines de cibles AWS ?",
  [
    "A) Amazon EventBridge",
    "B) AWS Direct Connect",
    "C) Amazon RDS",
    "D) AWS Shield"
  ],
  "A",
  "Amazon EventBridge est un bus d'événements sans serveur capable d'intercepter des événements provenant de services AWS, d'applications SaaS tierces ou de microservices et de les filtrer finement sur leur contenu JSON avant de les acheminer",
  "Direct Connect est une liaison réseau physique dédiée",
  "Amazon RDS est un service de bases de données relationnelles gérées",
  "AWS Shield est un service de protection contre les attaques par déni de service distribué (DDoS)",
  "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html"
));

questions.push(makeQ(
  qNum++, 'sqs-sns',
  "Quelle est la durée maximale de rétention d'un message dans une file d'attente Amazon SQS ?",
  [
    "A) 14 jours",
    "B) 24 heures",
    "C) 365 jours",
    "D) Illimitée"
  ],
  "A",
  "la durée de rétention des messages dans Amazon SQS est configurable entre 1 minute et un maximum strict de 14 jours (valeur par défaut de 4 jours)",
  "24 heures est la valeur par défaut de Kinesis, pas la limite de SQS",
  "365 jours est la rétention maximale de Kinesis Data Streams, pas de SQS",
  "les messages SQS ne peuvent pas être conservés indéfiniment sans être consommés ou expirés",
  "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-basic-architecture.html"
));

questions.push(makeQ(
  qNum++, 'sqs-sns',
  "Comment empêcher une file d'attente Amazon SQS de consommer des ressources inutiles en appels d'API vides lorsque peu de messages sont produits ?",
  [
    "A) Activer la réception par interrogation longue (Long Polling) en fixant WaitTimeSeconds entre 1 et 20 secondes",
    "B) Augmenter la taille du message à 2 Go",
    "C) Désactiver le chiffrement KMS",
    "D) Réduire le nombre de consommateurs à zéro"
  ],
  "A",
  "le Long Polling (ReceiveMessageWaitTimeSeconds > 0) maintient la connexion ouverte jusqu'à ce qu'un message arrive sur la file (jusqu'à 20 secondes), éliminant les réponses vides (Short Polling) et réduisant fortement les coûts d'appels d'API",
  "la taille maximale d'un message SQS standard est de 256 Ko (extensible à 2 Go avec S3 Extended Client) mais ne résout pas la fréquence de scrutation",
  "le chiffrement n'a aucun impact sur le mécanisme d'interrogation de la file",
  "supprimer les consommateurs empêcherait totalement le traitement des données",
  "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html"
));

questions.push(makeQ(
  qNum++, 'sqs-sns',
  "Dans une file SQS, qu'est-ce qu'une Dead-Letter Queue (DLQ) et quand est-elle déclenchée ?",
  [
    "A) Une file d'attente secondaire où sont automatiquement déplacés les messages ayant échoué à être traités avec succès après un nombre maximal de tentatives (maxReceiveCount)",
    "B) Une corbeille supprimant tous les messages sans avertissement",
    "C) Une file réservée aux messages de félicitations",
    "D) Un mécanisme de chiffrement par carte bancaire"
  ],
  "A",
  "une DLQ permet d'isoler les messages empoisonnés (poison pills) qui provoquent le plantage répété des consommateurs, protégeant le pipeline de blocages continus et permettant le débogage ultérieur",
  "les messages dans la DLQ sont conservés pour inspection et ne sont pas supprimés sans préavis",
  "la DLQ est dédiée aux anomalies et non aux messages de félicitations",
  "la DLQ n'a aucun lien avec les paiements par carte bancaire",
  "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html"
));

// 89-94: VECTORISATION & EMBEDDINGS
questions.push(makeQ(
  qNum++, 'vectorisation-embeddings',
  "Qu'est-ce qu'un vecteur dense d'embedding dans le traitement des données pour l'intelligence artificielle et la recherche sémantique ?",
  [
    "A) Un tableau ordonné de nombres réels (flottants) représentant la signification sémantique d'un texte ou d'une image dans un espace mathématique multidimensionnel",
    "B) Un fichier d'installation Windows .msi",
    "C) Un mot de passe chiffré stocké dans un cookie",
    "D) Une image vectorielle SVG destinée à l'affichage web"
  ],
  "A",
  "les embeddings vectoriels transforment des données non structurées (mots, phrases, documents) en vecteurs denses de dimension N où des concepts sémantiquement proches sont situés à proximité selon une distance mathématique (cosinus, produit scalaire)",
  "un embedding n'est pas un fichier exécutable d'installation Windows",
  "un embedding n'est pas un mot de passe ou un cookie web",
  "un embedding n'a aucun lien avec le format graphique SVG",
  "https://docs.aws.amazon.com/bedrock/latest/userguide/embeddings.html"
));

questions.push(makeQ(
  qNum++, 'vectorisation-embeddings',
  "Pourquoi est-il crucial d'appliquer une stratégie de chevauchement (chunk overlap) lors du découpage de documents longs avant de générer des embeddings vectoriels ?",
  [
    "A) Pour préserver le contexte sémantique situé aux frontières des segments et éviter de tronquer une idée entre deux chunks consécutifs",
    "B) Pour réduire la taille du fichier Parquet final sur S3",
    "C) Pour empêcher les requêtes SQL d'échouer sur Athena",
    "D) Pour chiffrer les données avec un sel cryptographique"
  ],
  "A",
  "le chevauchement (overlap, généralement de 10 à 20 %) garantit que les phrases et concepts situés en fin de bloc ne perdent pas leur sens en conservant une partie du contexte dans le bloc suivant",
  "le chevauchement augmente légèrement le nombre total de chunks et ne réduit pas la taille des fichiers",
  "le chevauchement concerne la préparation des embeddings et n'a aucun lien direct avec la syntaxe SQL Athena",
  "le chevauchement sémantique n'a pas de finalité de chiffrement cryptographique",
  "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-setup.html"
));

questions.push(makeQ(
  qNum++, 'vectorisation-embeddings',
  "Quelle métrique mathématique est la plus couramment utilisée pour mesurer la similarité sémantique entre deux vecteurs d'embeddings normalisés ?",
  [
    "A) La similarité cosinus (Cosine Similarity)",
    "B) Le test du Chi-carré",
    "C) La dérivée seconde de Riemann",
    "D) L'écart-type de Student"
  ],
  "A",
  "la similarité cosinus mesure le cosinus de l'angle entre deux vecteurs dans l'espace multidimensionnel, produisant un score entre -1 et 1 (ou 0 et 1 pour des vecteurs normalisés) indépendant de la magnitude",
  "le test du Chi-carré est un test statistique d'indépendance de variables catégorielles",
  "la dérivée seconde de Riemann n'est pas une mesure d'angle de similarité vectorielle",
  "l'écart-type mesure la dispersion d'une distribution et non l'alignement directionnel de deux vecteurs",
  "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/knn.html"
));

questions.push(makeQ(
  qNum++, 'vectorisation-embeddings',
  "Quel modèle d'embedding proposé par AWS sur Amazon Bedrock permet de choisir dynamiquement la taille du vecteur de sortie (256, 512 ou 1024 dimensions) pour optimiser les compromis précision/coût de stockage ?",
  [
    "A) Amazon Titan Text Embeddings V2",
    "B) Claude 3.5 Sonnet",
    "C) Amazon Polly",
    "D) Amazon Rekognition"
  ],
  "A",
  "Amazon Titan Text Embeddings V2 prend en charge des dimensions de sortie flexibles (256, 512 ou 1024 dimensions) avec normalisation unitaire, permettant de réduire l'espace de stockage des index vectoriels jusqu'à 4 fois",
  "Claude 3.5 Sonnet est un modèle de génération de texte et de raisonnement complexe (LLM) et non un modèle d'embedding vectoriel dédié",
  "Amazon Polly est un service de synthèse vocale (Text-to-Speech)",
  "Amazon Rekognition est un service d'analyse d'images et de vidéos par vision artificielle",
  "https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html"
));

questions.push(makeQ(
  qNum++, 'vectorisation-embeddings',
  "Comment un pipeline Big Data sous Apache Spark ou AWS Glue peut-il vectoriser des millions de descriptions de produits de façon distribuée ?",
  [
    "A) En exécutant des appels d'API par lots vers Amazon Bedrock ou en utilisant un modèle HuggingFace conteneurisé exécuté via une UDF Spark vectorisée",
    "B) En exécutant une commande VACUUM sur Redshift",
    "C) En partitionnant le bucket S3 par nom de fichier",
    "D) En désactivant le réseau VPC"
  ],
  "A",
  "Spark peut distribuer l'inférence d'embeddings sur ses workers soit via des micro-lots invoquant Bedrock (InvokeModel), soit en chargeant un modèle local en mémoire GPU/CPU via des fonctions utilisateur Spark (UDFs) optimisées",
  "la commande VACUUM sert à réordonner les tables Redshift et ne produit aucun vecteur",
  "le partitionnement S3 structure les répertoires mais ne calcule pas d'embeddings",
  "désactiver le réseau empêcherait toute communication avec le service de vectorisation",
  "https://docs.aws.amazon.com/bedrock/latest/userguide/api-methods-run.html"
));

questions.push(makeQ(
  qNum++, 'vectorisation-embeddings',
  "Dans le stockage d'index vectoriels, quelle différence technique fondamentale existe-t-il entre un index HNSW (Hierarchical Navigable Small World) et un index IVF (Inverted File) ?",
  [
    "A) HNSW construit un graphe hiérarchique en mémoire vive offrant une recherche ultra-rapide et précise mais très gourmand en RAM ; IVF partitionne l'espace en clusters centroïdes, plus économique en mémoire mais légèrement moins précis",
    "B) HNSW fonctionne uniquement sur disques magnétiques et IVF en mémoire",
    "C) IVF ne supporte pas la similarité cosinus",
    "D) HNSW est réservé aux fichiers audio"
  ],
  "A",
  "HNSW crée une structure de graphe à plusieurs couches en mémoire vive qui excelle pour les requêtes à faible latence au prix d'une forte empreinte mémoire ; IVF regroupe les vecteurs par quantification de Voronoi sur disque pour réduire l'empreinte mémoire",
  "HNSW s'exécute quasi exclusivement en mémoire vive pour des performances optimales",
  "IVF supporte parfaitement les distances cosinus, euclidienne et produit scalaire",
  "HNSW est un algorithme mathématique universel indépendant du type de média d'origine",
  "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/knn.html"
));

// 95-98: BEDROCK & RAG
questions.push(makeQ(
  qNum++, 'bedrock-rag',
  "Quelle est l'API Amazon Bedrock standard utilisée pour envoyer une invite (prompt) et recevoir une réponse d'un modèle de fondation tel qu'Anthropic Claude ou Amazon Titan ?",
  [
    "A) InvokeModel (ou InvokeModelWithResponseStream pour le streaming de tokens)",
    "B) PutRecord",
    "C) CreateTable",
    "D) StartJobRun"
  ],
  "A",
  "l'action InvokeModel de l'API Amazon Bedrock exécute l'inférence synchrone sur un modèle de fondation spécifié, tandis qu'InvokeModelWithResponseStream permet de recevoir la réponse au fil de l'eau",
  "PutRecord est l'appel d'écriture d'enregistrement dans Kinesis Data Streams",
  "CreateTable est l'opération de création de table dans DynamoDB ou Redshift",
  "StartJobRun est l'appel déclenchant un job de traitement dans AWS Glue ou EMR",
  "https://docs.aws.amazon.com/bedrock/latest/userguide/api-methods-run.html"
));

questions.push(makeQ(
  qNum++, 'bedrock-rag',
  "Dans une architecture RAG (Retrieval-Augmented Generation) d'entreprise, quel est le rôle précis de la base de connaissances (Knowledge Base) connectée à Amazon Bedrock ?",
  [
    "A) Récupérer les passages documentaires pertinents via une recherche vectorielle pour les injecter dans le contexte du prompt transmis au LLM afin de fonder ses réponses sur des faits réels",
    "B) Réécrire le code source du modèle de fondation",
    "C) Supprimer les données confidentielles d'Amazon S3",
    "D) Remplacer le pare-feu réseau du VPC"
  ],
  "A",
  "le modèle RAG enrichit dynamiquement l'invite utilisateur avec des extraits précis et sourcés provenant de la documentation de l'entreprise, réduisant les hallucinations et évitant le réentraînement coûteux du modèle",
  "un modèle de fondation propriétaire sur Bedrock ne voit jamais son code source réécrit par une base de connaissances",
  "la base de connaissances lit les données et ne supprime pas les fichiers S3 de l'entreprise",
  "la sécurité périmétrique réseau reste assurée par les Security Groups et NACL du VPC",
  "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html"
));

questions.push(makeQ(
  qNum++, 'bedrock-rag',
  "Quels magasins de données vectorielles managés peuvent être configurés comme banque vectorielle native pour les bases de connaissances Amazon Bedrock ?",
  [
    "A) Amazon OpenSearch Serverless, Amazon Aurora PostgreSQL avec extension pgvector, ou Pinecone",
    "B) Amazon S3 Glacier Flexible Retrieval",
    "C) Amazon Simple Storage Service sans index",
    "D) Disquettes magnétiques virtuelles"
  ],
  "A",
  "Amazon Bedrock Knowledge Bases s'intègre nativement avec Amazon OpenSearch Serverless (collection vectorielle), Amazon Aurora PostgreSQL (avec pgvector), Amazon Neptune Analytics et des solutions tierces managées",
  "Glacier est un stockage d'archive froid avec des temps de récupération de plusieurs minutes incompatibles avec les millisecondes d'une recherche vectorielle",
  "un compartiment S3 standard stocke des objets bruts mais ne dispose pas d'algorithme d'indexation vectorielle k-NN natif",
  "les disquettes magnétiques virtuelles n'existent pas dans l'offre AWS moderne",
  "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-setup.html"
));

questions.push(makeQ(
  qNum++, 'bedrock-rag',
  "Une entreprise souhaite masquer automatiquement les informations personnelles sensibles (PII comme les numéros de sécurité sociale) dans les requêtes et réponses échangées avec les modèles de fondation sur Amazon Bedrock. Quelle fonctionnalité native configure-t-elle ?",
  [
    "A) Amazon Bedrock Guardrails",
    "B) AWS WAF uniquement",
    "C) Amazon Route 53 Resolver",
    "D) AWS Snowball Edge"
  ],
  "A",
  "Amazon Bedrock Guardrails permet de définir des filtres de contenu personnalisés, de bloquer des sujets indésirables et d'anonymiser ou masquer automatiquement les PII dans les invites d'entrée et les réponses générées",
  "AWS WAF protège contre les attaques web de couche 7 (SQLi, XSS) mais n'analyse pas la sémantique conversationnelle des LLM",
  "Route 53 Resolver gère les résolutions DNS hybrides et n'a aucun regard sur le contenu des invites",
  "Snowball Edge est un matériel physique d'exportation de données hors ligne",
  "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html"
));

// 99-102: ATHENA
questions.push(makeQ(
  qNum++, 'athena',
  "Quelle commande SQL dans Amazon Athena permet de transformer, filtrer et matérialiser le résultat d'une requête directement sur Amazon S3 sous forme de fichiers Apache Parquet partitionnés en une seule opération ?",
  [
    "A) CTAS (CREATE TABLE AS SELECT) avec la clause WITH (format = 'PARQUET', partitioned_by = ARRAY[...])",
    "B) UPDATE table SET format = 'PARQUET'",
    "C) INSERT INTO local_disk",
    "D) DROP DATABASE cascade"
  ],
  "A",
  "la commande CTAS dans Athena crée une nouvelle table dans le Glue Data Catalog tout en écrivant physiquement les données filtrées au format Apache Parquet compressé et partitionné sur Amazon S3",
  "UPDATE ne permet pas de convertir physiquement le format de stockage d'une table externe existante",
  "Athena est un moteur de requêtes managé sans accès à un disque local utilisateur",
  "DROP DATABASE supprimerait la base de données et l'ensemble de ses métadonnées",
  "https://docs.aws.amazon.com/athena/latest/ug/ctas.html"
));

questions.push(makeQ(
  qNum++, 'athena',
  "Quelle limite stricte s'applique au nombre de partitions qu'une requête CTAS (CREATE TABLE AS SELECT) peut générer et écrire simultanément dans Amazon Athena ?",
  [
    "A) Un maximum de 100 partitions créées par requête CTAS",
    "B) 1 000 000 de partitions",
    "C) Aucune limite, le partitionnement est infini",
    "D) 1 seule partition obligatoirement"
  ],
  "A",
  "selon les spécifications officielles d'Amazon Athena, une requête CTAS échoue si elle tente d'écrire dans plus de 100 partitions cibles distinctes en une seule exécution (limite nécessitant de découper les écritures par blocs de partitions)",
  "1 000 000 de partitions dépasserait de très loin le quota d'écriture simultané d'Athena",
  "le partitionnement en écriture simultanée est strictement borné pour éviter d'épuiser les descripteurs de fichiers",
  "une requête CTAS peut écrire dans plusieurs dizaines de partitions jusqu'au seuil de 100",
  "https://docs.aws.amazon.com/athena/latest/ug/ctas-considerations-limits.html"
));

questions.push(makeQ(
  qNum++, 'athena',
  "Dans Amazon Athena, quel mécanisme évite d'interroger en permanence l'API du Glue Data Catalog pour lister les milliers de partitions de dates S3, accélérant l'exécution des requêtes sur les Data Lakes à forte cardinalité ?",
  [
    "A) La projection de partitions (Partition Projection) configurée dans les propriétés de la table SerDe",
    "B) L'indexation manuelle des fichiers CSV",
    "C) La suppression des clés primaires",
    "D) Le redémarrage hebdomadaire du service Athena"
  ],
  "A",
  "la projection de partitions permet à Athena de calculer dynamiquement les valeurs et chemins de partitions à partir de règles déclaratives (plages de dates, entiers) sans faire d'appels API répétitifs au Glue Data Catalog",
  "l'indexation manuelle de CSV n'est pas supportée nativement par Athena sans passer par des formats colonnaires",
  "Athena n'utilise pas de clés primaires imposées comme une base relationnelle OLTP",
  "Athena est un service managé multi-tenant sans redémarrage administrable par le client",
  "https://docs.aws.amazon.com/athena/latest/ug/partition-projection.html"
));

questions.push(makeQ(
  qNum++, 'athena',
  "Quel composant d'Amazon Athena permet de séparer les requêtes de l'équipe marketing de celles de l'équipe data science, de plafonner les volumes de données scannées autorisés par heure et de ventiler les coûts CloudWatch ?",
  [
    "A) Les Workgroups Athena",
    "B) Les passerelles NAT",
    "C) Les compartiments S3 Glacier",
    "D) Les clusters EMR"
  ],
  "A",
  "les Workgroups Athena permettent d'isoler les utilisateurs et charges de travail, de fixer des limites strictes de données scannées par requête ou par période, et d'acheminer les métriques de coût et d'utilisation vers CloudWatch",
  "les passerelles NAT sont des équipements réseau et ne gèrent pas les requêtes SQL d'Athena",
  "S3 Glacier est une classe d'archivage froid et n'administre pas les quotas d'analyse SQL",
  "les clusters EMR constituent une plateforme de calcul distincte et ne gèrent pas la gouvernance d'Athena",
  "https://docs.aws.amazon.com/athena/latest/ug/workgroups.html"
));

console.log(`Generated ${questions.length} questions for Domain 1.`);

// Write dea_questions_d1.js
const outPath = path.join(process.cwd(), 'scripts', 'dea_questions_d1.js');
const fileContent = `// Banque de questions officielles et originales pour DEA-C01 Domaine 1 (102 questions)
// Générée et validée le 2026-10-31
export const deaQuestionsD1 = ${JSON.stringify(questions, null, 2)};
`;
fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`Saved to ${outPath}`);
