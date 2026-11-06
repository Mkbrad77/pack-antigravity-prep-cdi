import fs from 'node:fs';
import path from 'node:path';

function cleanEmDashes(text) {
  return text.replace(/\u2014/g, ': ').replace(/\u2013/g, '-');
}

// 102 rich, realistic scenarios for Domain 1 (Ingestion & Transformation)
export const d1Raw = [
  // KINESIS (1-10)
  {
    topic_id: 'kinesis',
    question: "Une entreprise collecte 1 500 enregistrements par seconde d'une taille moyenne de 800 octets via un flux Amazon Kinesis Data Streams provisionné avec 1 shard. Les producteurs reçoivent fréquemment l'erreur ProvisionedThroughputExceededException. Quelle action résout ce problème de la manière la plus efficace ?",
    options: [
      "A) Effectuer un resharding du flux pour passer à au moins 2 shards afin d'absorber les 1 500 enregistrements/s",
      "B) Augmenter la taille du tampon Firehose à 128 Mo",
      "C) Réduire la durée de rétention des données de 24 heures à 12 heures",
      "D) Activer le chiffrement SSE-KMS sur le flux Kinesis"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car un shard Kinesis Data Streams est limité à 1 000 enregistrements par seconde ou 1 Mo/s en écriture. Avec 1 500 enregistrements/s, la limite est dépassée : diviser le shard ou passer à 2 shards permet d'atteindre 2 000 enregistrements/s. L'option B est fausse car Firehose est un service distinct et modifier son tampon ne résout pas la limite d'entrée du shard Kinesis Data Streams. L'option C est fausse car la durée de rétention contrôle le stockage historique des données et n'a aucun impact sur le débit d'ingestion maximal par seconde. L'option D est fausse car le chiffrement KMS renforce la sécurité des données au repos mais n'augmente en rien le quota de débit d'écriture du shard.",
    source_url: "https://docs.aws.amazon.com/streams/latest/dev/kinesis-using-sdk-java-resharding.html"
  },
  {
    topic_id: 'kinesis',
    question: "Une application analytique doit livrer en continu des données de streaming vers un compartiment Amazon S3 au format Apache Parquet sans gérer d'infrastructure de calcul. Quel service configuré avec AWS Glue Data Catalog répond directement à ce besoin ?",
    options: [
      "A) Amazon Data Firehose avec conversion de format Parquet activée",
      "B) Amazon Kinesis Data Streams avec un consommateur Python sur EC2",
      "C) Amazon Managed Service for Apache Flink écrivant en CSV brut",
      "D) AWS DataSync avec tâche horaire programmée"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car Amazon Data Firehose est un service entièrement géré sans serveur capable de convertir nativement des flux JSON entrants en format Apache Parquet ou ORC en utilisant le schéma de table défini dans AWS Glue Data Catalog avant d'écrire sur S3. L'option B est fausse car elle nécessite le développement, le provisionnement et la maintenance manuelle d'instances EC2 et de code de sérialisation. L'option C est fausse car elle n'écrit pas en Parquet sans développement lourd de Sink et demande la gestion d'une application Flink. L'option D est fausse car AWS DataSync est un service de transfert de fichiers réseau par lots et non un outil de streaming en continu.",
    source_url: "https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html"
  },
  {
    topic_id: 'kinesis',
    question: "Un pipeline d'ingestion utilise Amazon Data Firehose configuré avec un tampon de 64 Mo et un intervalle de 300 secondes vers Amazon S3. Durant les heures creuses, le volume de données n'atteint que 5 Mo en 5 minutes. Quand les fichiers sont-ils livrés sur S3 ?",
    options: [
      "A) Toutes les 300 secondes, dès que la condition d'intervalle de temps est atteinte",
      "B) Uniquement lorsque le seuil de 64 Mo est atteint, quel que soit le délai",
      "C) Immédiatement à chaque arrivée d'enregistrement individuel",
      "D) Une fois par jour lors du cycle de maintenance nocturne AWS"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car Amazon Data Firehose évalue continuellement les deux critères de tampon (Buffer Size et Buffer Interval). La livraison sur la destination est déclenchée dès que le premier des deux seuils est atteint : ici, l'intervalle de 300 secondes expire avant que les 64 Mo ne soient remplis. L'option B est fausse car le paramètre d'intervalle empêche la rétention indéfinie des données en cas de faible trafic. L'option C est fausse car Firehose est un service de micro-lots (near real-time) et ne livre jamais les événements unitairement en temps réel strict. L'option D est fausse car Firehose ne retient jamais les données au-delà de son intervalle maximal configurable de 900 secondes.",
    source_url: "https://docs.aws.amazon.com/firehose/latest/dev/buffering.html"
  },
  {
    topic_id: 'kinesis',
    question: "Une architecture de données doit analyser des flux de clics pour détecter des fraudes en moins de 100 millisecondes et simultanément archiver tous les clics bruts sur Amazon S3 pour des analyses historiques. Quelle architecture répond le mieux à ce double besoin ?",
    options: [
      "A) Ingestion dans un flux Kinesis Data Streams lu en parallèle par une fonction Lambda ultra-rapide et par un flux Amazon Data Firehose vers S3",
      "B) Envoi direct des clics vers S3 puis exécution d'un job AWS Glue toutes les minutes",
      "C) Stockage dans une base Amazon RDS avec réplique de lecture",
      "D) Utilisation d'Amazon SQS Standard avec un script cron périodique"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car Kinesis Data Streams permet à plusieurs consommateurs indépendants de lire simultanément le même flux de données sans interférence : une fonction Lambda lit en temps réel (< 100 ms) pour la détection de fraude, tandis que Firehose accumule les micro-lots pour l'archivage économique sur S3. L'option B est fausse car l'écriture sur S3 puis le déclenchement d'un job Glue induit une latence de plusieurs minutes, incompatible avec le délai de 100 ms. L'option C est fausse car une base RDS relationnelle n'est pas adaptée à l'ingestion massive de flux de clics et ne garantit pas la latence sous les 100 ms. L'option D est fausse car SQS ne permet pas à plusieurs consommateurs de traiter indépendamment les mêmes messages sans duplication complexe.",
    source_url: "https://docs.aws.amazon.com/streams/latest/dev/introduction.html"
  },
  {
    topic_id: 'kinesis',
    question: "Plusieurs applications consommatrices lisent un flux Kinesis Data Streams composé de 10 shards. Avec 5 consommateurs standards, les applications reçoivent des erreurs ReadThroughputExceededException. Quelle fonctionnalité native de Kinesis élimine ce goulot d'étranglement ?",
    options: [
      "A) Activer l'Enhanced Fan-Out (EFO) avec des consommateurs dédiés en HTTP/2",
      "B) Remplacer Kinesis Data Streams par Amazon SNS",
      "C) Augmenter la durée de rétention des données à 7 jours",
      "D) Réduire le nombre de shards de 10 à 5"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car la lecture standard sur un shard Kinesis partage un débit maximal de 2 Mo/s entre tous les consommateurs. L'Enhanced Fan-Out (EFO) attribue à chaque consommateur enregistré un débit dédié de 2 Mo/s par shard via des connexions push HTTP/2, éliminant la contention entre lecteurs multiples. L'option B est fausse car SNS ne conserve pas l'historique des données et n'offre pas la sémantique de streaming par shard. L'option C est fausse car la durée de rétention n'augmente pas la bande passante de lecture par seconde. L'option D est fausse car diviser par deux le nombre de shards réduirait le débit global de lecture au lieu de l'augmenter.",
    source_url: "https://docs.aws.amazon.com/streams/latest/dev/enhanced-consumers.html"
  },
  {
    topic_id: 'kinesis',
    question: "Une équipe data souhaite exécuter des fenêtres de calcul glissantes de 10 minutes avec agrégations avec état (stateful) sur un flux continu de capteurs IoT. Quel service managé AWS est expressément conçu pour ce cas d'usage ?",
    options: [
      "A) Amazon Managed Service for Apache Flink",
      "B) Amazon Data Firehose avec transformation Lambda simple",
      "C) AWS Glue DataBrew",
      "D) Amazon Athena avec requêtes planifiées"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car Amazon Managed Service for Apache Flink permet d'exécuter des requêtes SQL et du code Java/Scala sur des flux continus avec gestion native de l'état en mémoire et fenêtres temporelles complexes (sliding, tumbling, session windows). L'option B est fausse car les transformations Lambda dans Firehose sont sans état et limitées au traitement de micro-lots isolés. L'option C est fausse car Glue DataBrew est un outil visuel de préparation de données par lots pour jeux de données statiques. L'option D est fausse car Athena est un moteur de requêtes interactif sur données au repos dans S3 et non un moteur de calcul continu sur flux.",
    source_url: "https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html"
  },
  {
    topic_id: 'kinesis',
    question: "Dans Kinesis Data Streams, pourquoi est-il critique de choisir une clé de partition (Partition Key) présentant une cardinalité élevée lors de l'appel PutRecord ?",
    options: [
      "A) Pour distribuer uniformément les données à travers tous les shards et éviter les shards chauds (hot shards)",
      "B) Pour réduire automatiquement la taille des messages en mémoire",
      "C) Pour permettre le chiffrement asymétrique des enregistrements",
      "D) Pour forcer l'écriture séquentielle dans un unique shard"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car la clé de partition est hachée par MD5 pour assigner chaque enregistrement à un shard précis. Une faible cardinalité (ex. code pays avec 90 % de valeurs identiques) concentre tout le trafic sur un seul shard, provoquant des dépassements de quota alors que les autres shards restent inoccupés. L'option B est fausse car la clé de partition ne compresse pas le corps du message. L'option C est fausse car le chiffrement KMS s'applique indépendamment de la clé de partition. L'option D est fausse car forcer l'écriture sur un seul shard est précisément le comportement néfaste que l'on cherche à éviter.",
    source_url: "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html"
  },
  {
    topic_id: 'kinesis',
    question: "Amazon Data Firehose doit charger des données directement dans une table Amazon Redshift. Comment Firehose procède-t-il techniquement pour réaliser cette opération ?",
    options: [
      "A) Firehose dépose d'abord les micro-lots dans un compartiment Amazon S3 intermédiaire, puis exécute automatiquement une commande COPY vers Redshift",
      "B) Firehose insère les lignes une par une via des instructions SQL INSERT directes",
      "C) Firehose synchronise la mémoire vive de son tampon avec le cache de Redshift",
      "D) Firehose utilise AWS DMS pour répliquer le journal des transactions"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car l'architecture de chargement de Firehose vers Redshift écrit d'abord les données dans un bucket S3 intermédiaire (staging bucket), puis déclenche une commande SQL COPY massive hautement optimisée pour charger les données dans Redshift en parallèle. L'option B est fausse car des INSERT individuels ligne par ligne satureraient le Leader Node de Redshift et sont proscrits pour les chargements massifs. L'option C est fausse car il n'existe aucune mémoire partagée entre Firehose et les nœuds Redshift. L'option D est fausse car AWS DMS n'intervient pas dans le fonctionnement interne d'Amazon Data Firehose.",
    source_url: "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html#redshift-delivery"
  },
  {
    topic_id: 'kinesis',
    question: "Quelle nouvelle fonctionnalité d'Amazon Data Firehose (mise en avant dans le guide DEA-C01 v1.1) permet de charger directement des données de streaming dans des tables de lac ouvertes sans passer par du code de compaction complexe ?",
    options: [
      "A) La livraison directe vers des tables Apache Iceberg hébergées sur Amazon S3",
      "B) L'export automatique vers des disques EBS non montés",
      "C) Le streaming direct vers des tables SQLite locales",
      "D) La réplication synchrone vers AWS Cloud9"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car Amazon Data Firehose prend désormais en charge la livraison directe vers des tables Apache Iceberg sur S3, intégrant la mise à jour des métadonnées de table et la gestion ACID sans nécessiter de pipeline Spark intermédiaire. L'option B est fausse car Firehose ne livre pas sur des disques blocs EBS isolés. L'option C est fausse car SQLite n'est pas une destination gérée par Firehose. L'option D est fausse car AWS Cloud9 est un IDE (retiré du guide DEA-C01 v1.1) et non une destination de streaming de données.",
    source_url: "https://docs.aws.amazon.com/firehose/latest/dev/iceberg-destination.html"
  },
  {
    topic_id: 'kinesis',
    question: "Une application utilisant la bibliothèque Kinesis Client Library (KCL) pour lire un flux Kinesis Data Streams doit suivre l'avancement de ses consommateurs. Quel service AWS la bibliothèque KCL utilise-t-elle par défaut pour stocker ses points de contrôle (checkpoints) ?",
    options: [
      "A) Amazon DynamoDB",
      "B) Amazon ElastiCache for Redis",
      "C) Amazon S3 Glacier",
      "D) AWS Systems Manager Parameter Store"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car la bibliothèque KCL crée et maintient automatiquement une table Amazon DynamoDB portant le nom de l'application pour suivre les shards attribués à chaque worker et mémoriser les numéros de séquence des derniers enregistrements traités (checkpoints). L'option B est fausse car KCL n'utilise pas Redis par défaut. L'option C est fausse car Glacier est un service d'archivage lent avec des délais de récupération incompatibles avec le suivi temps réel. L'option D est fausse car Parameter Store est conçu pour stocker des paramètres de configuration et non des états de streaming haute fréquence.",
    source_url: "https://docs.aws.amazon.com/streams/latest/dev/shared-throughput-kcl-users.html"
  },

  // MSK / KAFKA (11-18)
  {
    topic_id: 'msk',
    question: "Une grande banque souhaite migrer ses clusters Apache Kafka sur site vers AWS. Ses flux véhiculent des messages de 8 Mo contenant des transactions financières chiffrées. Pourquoi Amazon MSK est-il recommandé par rapport à Amazon Kinesis Data Streams ?",
    options: [
      "A) Amazon MSK supporte des messages volumineux configurables au-delà de la limite stricte de 1 Mo de Kinesis",
      "B) Amazon MSK est obligatoirement gratuit pour les banques",
      "C) Kinesis ne supporte aucun chiffrement",
      "D) Kinesis impose un arrêt hebdomadaire de maintenance"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car Kinesis Data Streams limite strictement la taille maximale d'un enregistrement à 1 Mo (1 048 576 octets). Amazon MSK, basé sur Apache Kafka standard, permet de configurer la taille maximale des messages (ex. via `message.max.bytes`) à plusieurs mégaoctets. L'option B est fausse car Amazon MSK est un service payant facturé selon les brokers ou le volume ingéré. L'option C est fausse car Kinesis supporte parfaitement le chiffrement au repos via AWS KMS et en transit via TLS. L'option D est fausse car Kinesis est un service managé hautement disponible multi-AZ sans aucune fenêtre d'interruption planifiée.",
    source_url: "https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html"
  },
  {
    topic_id: 'msk',
    question: "Une équipe data souhaite capturer en continu les modifications d'une base relationnelle MySQL sur site et les verser dans un topic Amazon MSK sans écrire de code personnalisé. Quel composant géré répond à cette exigence ?",
    options: [
      "A) Amazon MSK Connect avec un connecteur source Debezium pour MySQL",
      "B) AWS Glue DataBrew",
      "C) Amazon Athena Federated Query",
      "D) AWS Snowball Edge"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car MSK Connect permet d'exécuter des connecteurs Kafka Connect entièrement gérés sans administrer de serveurs, y compris le connecteur Debezium pour capturer les écritures de bases de données (CDC) vers Kafka. L'option B est fausse car Glue DataBrew est un outil visuel de nettoyage de données par lots sans support de streaming CDC Kafka. L'option C est fausse car Athena Federated Query sert à exécuter des requêtes SQL interactives et non à capturer des flux d'événements. L'option D est fausse car Snowball Edge est un matériel physique d'exportation hors ligne pour de gros volumes statiques.",
    source_url: "https://docs.aws.amazon.com/msk/latest/developerguide/msk-connect.html"
  },
  {
    topic_id: 'msk',
    question: "Quel mode de déploiement d'Amazon MSK permet de traiter des flux de streaming variables sans avoir à dimensionner à l'avance le nombre d'instances de brokers ni le volume de stockage EBS ?",
    options: [
      "A) Amazon MSK Serverless",
      "B) Amazon MSK Provisioned avec instances kafka.m5.large",
      "C) Un cluster Kafka déployé manuellement sur Amazon EC2",
      "D) Amazon EMR avec Apache Flink"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car Amazon MSK Serverless ajuste automatiquement la capacité de calcul, les partitions et le stockage selon le débit entrant réel, libérant l'équipe de toute gestion de brokers physiques ou de capacité disque. L'option B est fausse car le mode Provisioned exige de sélectionner le type d'instance, le nombre de brokers et la taille des volumes EBS. L'option C est fausse car elle impose une charge opérationnelle maximale de gestion d'OS et d'infrastructure. L'option D est fausse car EMR avec Flink demande la gestion et la surveillance d'un cluster complet.",
    source_url: "https://docs.aws.amazon.com/msk/latest/developerguide/serverless.html"
  },
  {
    topic_id: 'msk',
    question: "Dans les versions récentes d'Amazon MSK, quel mécanisme élimine le besoin d'administrer des nœuds de quorum Apache ZooKeeper pour gérer les métadonnées du cluster Kafka ?",
    options: [
      "A) Le mode Apache Kafka Raft (KRaft)",
      "B) L'intégration avec AWS Lake Formation",
      "C) Le proxy Amazon RDS",
      "D) L'agent CloudWatch Logs"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car le protocole KRaft (Kafka Raft Metadata) remplace ZooKeeper en gérant les métadonnées directement à l'intérieur des nœuds Kafka, améliorant la montée en charge du nombre de partitions et simplifiant l'architecture. L'option B est fausse car Lake Formation gère la gouvernance et les permissions de données sur les Data Lakes S3 et non les métadonnées internes des topics Kafka. L'option C est fausse car RDS Proxy gère le pool de connexions pour les bases de données relationnelles. L'option D est fausse car l'agent CloudWatch Logs ne fait que collecter des fichiers de logs système.",
    source_url: "https://docs.aws.amazon.com/msk/latest/developerguide/kraft.html"
  },
  {
    topic_id: 'msk',
    question: "Comment sécuriser les communications entre les producteurs d'applications d'entreprise et les brokers d'un cluster Amazon MSK au sein d'un VPC ?",
    options: [
      "A) Activer le chiffrement en transit TLS et l'authentification mutuelle TLS (mTLS) ou IAM",
      "B) Désactiver les groupes de sécurité du VPC",
      "C) Rendre les sous-réseaux du cluster publics sur Internet",
      "D) Stocker les mots de passe Kafka en clair dans le code source"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car Amazon MSK prend en charge le chiffrement en transit TLS de bout en bout et offre plusieurs méthodes d'authentification robustes : mTLS avec certificats AWS Private CA, SASL/SCRAM avec Secrets Manager, ou l'authentification native AWS IAM pour Kafka. L'option B est fausse car désactiver les groupes de sécurité supprimerait le pare-feu de protection des instances. L'option C est fausse car exposer les sous-réseaux sur Internet public constitue une violation grave des règles de sécurité réseau. L'option D est fausse car coder des mots de passe en clair dans les applications est une faille de sécurité majeure.",
    source_url: "https://docs.aws.amazon.com/msk/latest/developerguide/security.html"
  },
  {
    topic_id: 'msk',
    question: "Une entreprise doit répliquer des topics Kafka entre deux clusters Amazon MSK situés dans des régions AWS différentes pour assurer un plan de reprise d'activité. Quel outil géré par Apache Kafka sur MSK réalise cette réplication ?",
    options: [
      "A) Apache Kafka MirrorMaker 2 (MM2) déployé via MSK Connect",
      "B) AWS Snowcone",
      "C) Amazon Redshift Spectrum",
      "D) AWS Glue Data Quality"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car MirrorMaker 2 (MM2) est l'outil standard de l'écosystème Apache Kafka pour la réplication bidirectionnelle ou active-passive de topics, de configurations et de décalages de consommateurs (consumer offsets) entre clusters multi-régions, facilement exécutable sur MSK Connect. L'option B est fausse car Snowcone est un appareil physique de transfert de fichiers. L'option C est fausse car Redshift Spectrum est un moteur de requêtage SQL externe sur Amazon S3. L'option D est fausse car Glue Data Quality sert à mesurer la validité des données tabulaires et non à répliquer des flux de messages.",
    source_url: "https://docs.aws.amazon.com/msk/latest/developerguide/migration.html"
  },
  {
    topic_id: 'msk',
    question: "Quelle méthode permet de déverser automatiquement les messages d'un topic Amazon MSK dans un compartiment Amazon S3 au format Parquet sans coder de consommateur personnalisé ?",
    options: [
      "A) Déployer un connecteur Kafka Connect Amazon S3 Sink via MSK Connect",
      "B) Configurer une table DynamoDB globale",
      "C) Exécuter une commande VACUUM sur Redshift",
      "D) Utiliser AWS Direct Connect"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car le connecteur S3 Sink (open source de la communauté Confluent ou AWS) déployé dans MSK Connect lit en continu les partitions Kafka et génère automatiquement des fichiers Parquet partitionnés directement sur Amazon S3. L'option B est fausse car DynamoDB n'est pas un moteur d'export Parquet vers S3. L'option C est fausse car la commande VACUUM sert à réorganiser physiquement les tables locales dans Amazon Redshift. L'option D est fausse car Direct Connect est une connexion réseau physique dédiée et non un connecteur de données applicatif.",
    source_url: "https://docs.aws.amazon.com/msk/latest/developerguide/msk-connect.html"
  },
  {
    topic_id: 'msk',
    question: "Quel paramètre détermine la distribution des messages d'un topic Apache Kafka entre ses différentes partitions sur Amazon MSK ?",
    options: [
      "A) La clé du message (Message Key) fournie par le producteur",
      "B) La taille de la mémoire RAM du broker",
      "C) La politique de clé AWS KMS",
      "D) L'identifiant de la table Glue Catalog"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car le producteur Kafka calcule un hachage sur la clé du message (Message Key) pour assigner le message à une partition spécifique, garantissant que tous les messages ayant la même clé arrivent dans la même partition dans l'ordre strict d'émission. L'option B est fausse car la RAM du broker n'influence pas l'algorithme de partitionnement des messages. L'option C est fausse car la politique KMS gère les droits cryptographiques et non le routage des messages. L'option D est fausse car Glue Catalog n'intervient pas dans la publication interne de messages Kafka.",
    source_url: "https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html"
  },

  // GLUE ETL & CATALOG (19-32)
  {
    topic_id: 'glue',
    question: "Un job AWS Glue ETL quotidien traite des fichiers volumineux sur Amazon S3. Comment éviter que le job ne retraite l'intégralité des fichiers historiques à chaque exécution ?",
    options: [
      "A) Activer les Job Bookmarks sur le job Glue et appeler explicitement job.commit() dans le script",
      "B) Supprimer les fichiers sources S3 après chaque exécution",
      "C) Passer le worker type de G.1X à G.2X",
      "D) Désactiver le catalogue de métadonnées Glue"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car les Job Bookmarks mémorisent l'état d'avancement des données déjà traitées (dernière date de modification S3 ou clé incrémentale). L'appel à job.commit() est impératif pour enregistrer l'état à la fin de l'exécution réussie. L'option B est fausse car supprimer les fichiers sources détruirait l'historique brut de la couche Bronze du Data Lake, interdisant tout retraitement futur. L'option C est fausse car changer le type de worker alloue plus de vCPU et de RAM mais ne modifie pas la logique de lecture incrémentale. L'option D est fausse car le catalogue de métadonnées permet précisément d'organiser et de filtrer les tables.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/monitor-continuations.html"
  },
  {
    topic_id: 'glue',
    question: "Lors de l'ingestion d'un flux de fichiers JSON complexes contenant des types divergents (par exemple un champ contenant parfois un entier et parfois une chaîne de caractères), pourquoi l'ingénieur choisit-il un DynamicFrame AWS Glue plutôt qu'un DataFrame Apache Spark standard ?",
    options: [
      "A) Le DynamicFrame gère nativement les schémas non stricts et permet de résoudre les types conflictuels avec la transformation ResolveChoice",
      "B) Le DynamicFrame ne consomme aucun DPU lors des calculs",
      "C) Le DynamicFrame s'exécute uniquement sur des puces graphiques GPU",
      "D) Le DynamicFrame interdit l'écriture au format Apache Parquet"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car le DynamicFrame est une abstraction propriétaire de Glue conçue pour les schémas semi-structurés hétérogènes : les champs aux types mixtes sont représentés par des ChoiceTypes que l'on peut résoudre (caster, projeter) via ResolveChoice sans faire échouer le job. L'option B est fausse car l'exécution d'un DynamicFrame consomme des DPU exactement comme un DataFrame Spark. L'option C est fausse car les DynamicFrames s'exécutent sur les workers CPU standards G.1X et G.2X. L'option D est fausse car les DynamicFrames peuvent écrire directement en Parquet, ORC, CSV ou JSON.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-crawler-pyspark-extensions-dynamic-frame.html"
  },
  {
    topic_id: 'glue',
    question: "Un job Glue ETL doit lire une table partitionnée sur S3 par année et par mois représentant 10 To. Le job ne doit traiter que le mois d'octobre 2026. Quelle technique évite de charger l'intégralité des métadonnées et fichiers en mémoire ?",
    options: [
      "A) Utiliser un push_down_predicate dans create_dynamic_frame.from_catalog pour filtrer les partitions au niveau du catalogue",
      "B) Lire l'ensemble des 10 To puis appliquer un filtre Spark df.filter()",
      "C) Déplacer manuellement les fichiers d'octobre dans un autre bucket",
      "D) Désactiver le format colonnaire Parquet"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car le push_down_predicate évalue l'expression de filtrage directement sur les métadonnées du Glue Data Catalog, évitant à Spark de scanner et de lister les milliers de fichiers des autres partitions S3 non concernées. L'option B est fausse car df.filter() nécessite de lire d'abord les métadonnées et potentiellement les données de l'ensemble des 10 To avant de filtrer en mémoire, ce qui est extrêmement lent et coûteux. L'option C est fausse car déplacer manuellement des fichiers introduit une dette opérationnelle fragile. L'option D est fausse car désactiver le format Parquet aggraverait les temps de transfert.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-partitions.html"
  },
  {
    topic_id: 'glue',
    question: "Quelle est la définition exacte d'un DPU (Data Processing Unit) dans la tarification et le dimensionnement d'AWS Glue ETL ?",
    options: [
      "A) Une unité de capacité équivalente à 4 vCPU et 16 Go de mémoire RAM",
      "B) Une unité équivalente à 1 vCPU et 2 Go de mémoire RAM",
      "C) Un serveur physique complet comprenant 64 vCPU et 256 Go de RAM",
      "D) Une licence logicielle facturée par utilisateur mensuel"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car selon la documentation officielle AWS Glue, 1 DPU (Data Processing Unit) fournit une capacité de calcul de 4 vCPU et 16 Go de mémoire RAM. L'option B est fausse car 1 vCPU et 2 Go ne correspondent à aucun type de worker standard Glue. L'option C est fausse car un DPU est une mesure de calcul virtualisée et non un serveur physique de 64 vCPU. L'option D est fausse car Glue est un service facturé à la consommation à la seconde (DPU-heure) sans abonnement par utilisateur.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/add-job.html"
  },
  {
    topic_id: 'glue',
    question: "Un Crawler AWS Glue analyse un compartiment Amazon S3 contenant de nouvelles données chaque jour. Comment le Crawler détecte-t-il les modifications de structure de table (évolution de schéma) ?",
    options: [
      "A) Il compare le schéma déduit des fichiers avec la définition existante dans le Data Catalog et met à jour la table selon la politique configurée",
      "B) Il réécrit tous les fichiers S3 dans un nouveau format",
      "C) Il supprime systématiquement la table existante et la recrée de zéro",
      "D) Il envoie un message texte SMS à l'administrateur sans modifier le catalogue"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car le Crawler inspecte les formats et métadonnées des objets S3, compare la structure trouvée avec la table du Glue Data Catalog et applique l'action configurée (ajouter les nouvelles colonnes, ignorer le changement ou marquer la partition obsolète). L'option B est fausse car un Crawler ne modifie ni ne réécrit jamais les fichiers de données stockés sur S3. L'option C est fausse car écraser la table existante supprimerait l'historique des partitions enregistrées. L'option D est fausse car le Crawler met à jour le catalogue de façon autonome selon sa configuration sans exiger d'approbation manuelle par SMS.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html"
  },
  {
    topic_id: 'glue',
    question: "Une équipe data souhaite permettre à des analystes sans compétences en programmation de nettoyer, normaliser et profiler visuellement des jeux de données de ventes. Quel service AWS répond à ce besoin ?",
    options: [
      "A) AWS Glue DataBrew",
      "B) Amazon EMR avec commandes Scala",
      "C) AWS Lambda avec conteneurs C++",
      "D) AWS Systems Manager"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car AWS Glue DataBrew est un outil visuel de préparation de données sans code fournissant plus de 250 transformations préconfigurées et des fonctions d'analyse statistique et de profilage pour les utilisateurs métier. L'option B est fausse car programmer en Scala sur EMR requiert des compétences pointues d'ingénierie logicielle. L'option C est fausse car coder des fonctions Lambda en C++ nécessite une expertise poussée de développement. L'option D est fausse car Systems Manager sert à administrer l'infrastructure système et les correctifs d'OS.",
    source_url: "https://docs.aws.amazon.com/databrew/latest/dg/what-is.html"
  },
  {
    topic_id: 'glue',
    question: "Quelle transformation native de DynamicFrame permet d'extraire des champs imbriqués dans une structure JSON complexe et de les aplatir au premier niveau dans AWS Glue ?",
    options: [
      "A) Relationalize ou Unnest",
      "B) DropNullFields",
      "C) SelectFields",
      "D) Filter"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car la méthode Relationalize (ou Unnest) prend un DynamicFrame avec des hiérarchies JSON imbriquées ou des tableaux et produit un ensemble de tables aplaties prêtes pour les entrepôts relationnels. L'option B est fausse car DropNullFields supprime uniquement les colonnes contenant exclusivement des valeurs nulles. L'option C est fausse car SelectFields conserve uniquement une liste de champs spécifiés sans aplatir les structures complexes. L'option D est fausse car Filter applique une condition logique pour conserver ou rejeter des lignes.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-transforms-relationalize.html"
  },
  {
    topic_id: 'glue',
    question: "Un ingénieur configure un job AWS Glue Streaming pour lire des événements depuis un flux Amazon Kinesis. Quel paramètre garantit que le traitement reprendra sans perte ni doublon en cas de défaillance du worker ?",
    options: [
      "A) Configurer un répertoire de points de contrôle (Checkpoint Location) sur Amazon S3",
      "B) Utiliser des disques EBS éphémères non répliqués",
      "C) Réduire la durée de rétention Kinesis à 1 heure",
      "D) Désactiver le catalogue Glue"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car Spark Structured Streaming dans AWS Glue Streaming s'appuie sur le mécanisme de checkpointing stocké de manière persistante sur S3 pour enregistrer l'offset exact du flux traité pour chaque micro-lot. L'option B est fausse car un disque éphémère local perdrait son état lors du remplacement d'un nœud défaillant. L'option C est fausse car réduire la rétention Kinesis augmenterait le risque de perte définitive de données en cas de panne prolongée. L'option D est fausse car le catalogue Glue n'a pas d'impact négatif sur la tolérance aux pannes du streaming.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/add-job-streaming.html"
  },
  {
    topic_id: 'glue',
    question: "Quelle option de configuration d'AWS Glue ETL permet de réduire les coûts lorsque le volume de données à traiter varie fortement d'un jour à l'autre ?",
    options: [
      "A) Activer l'Auto Scaling dans les propriétés du job Glue",
      "B) Fixer manuellement le nombre de workers à 100 en permanence",
      "C) Remplacer Spark par un script Bash mono-thread",
      "D) Activer la journalisation détaillée niveau DEBUG sur CloudWatch"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car la fonction Auto Scaling d'AWS Glue ajoute et retire dynamiquement des workers (DPU) en fonction de la charge de calcul réelle des étapes Spark, évitant de payer pour des capacités inactives lors des jours à faible volume. L'option B est fausse car réserver 100 workers en permanence engendre une sur-facturation massive lors des jours creux. L'option C est fausse car un script Bash mono-thread ne peut pas traiter des volumes analytiques distribués et ralentirait excessivement les traitements. L'option D est fausse car les logs DEBUG augmentent la facture CloudWatch sans réduire les coûts de calcul.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/monitor-job-autoscaling.html"
  },
  {
    topic_id: 'glue',
    question: "Comment un script PySpark dans AWS Glue peut-il convertir un DynamicFrame nommé dyn_frame en un DataFrame Apache Spark standard pour exécuter des requêtes Spark SQL ?",
    options: [
      "A) En appelant dyn_frame.toDF()",
      "B) En appelant dyn_frame.castToDataFrame()",
      "C) En exportant vers un fichier CSV temporaire",
      "D) En redémarrant le cluster Spark"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car la méthode toDF() est la fonction officielle fournie par la bibliothèque AWS Glue pour convertir un DynamicFrame en DataFrame Apache Spark natif, permettant d'utiliser toutes les fonctions standard de pyspark.sql. L'option B est fausse car castToDataFrame n'est pas une méthode existante dans l'API AWS Glue. L'option C est fausse car sérialiser sur disque temporaire CSV dégraderait inutilement les performances. L'option D est fausse car un redémarrage de cluster n'a aucun lien avec la conversion de types d'objets en mémoire.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-crawler-pyspark-extensions-dynamic-frame.html"
  },
  {
    topic_id: 'glue',
    question: "Quel type de worker AWS Glue est recommandé pour les charges de travail intensives en mémoire nécessitant des jointures volumineuses et des opérations de déduplication lourdes ?",
    options: [
      "A) Le type G.2X (8 vCPU, 32 Go de mémoire)",
      "B) Le type Standard (ancien modèle déprécié à faible mémoire)",
      "C) Le type t2.micro",
      "D) Le type Nano"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car les workers G.2X fournissent le double de mémoire et de vCPU par rapport aux workers G.1X, offrant 32 Go de RAM et 128 Go d'espace disque par worker, ce qui prévient les erreurs OutOfMemory lors de jointures Spark complexes. L'option B est fausse car le type de worker Standard est obsolète et moins performant que la famille G. L'option C est fausse car les instances EC2 t2.micro ne font pas partie des types de workers configurables dans AWS Glue ETL. L'option D est fausse car le type Nano n'existe pas dans l'offre AWS Glue.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/add-job.html"
  },
  {
    topic_id: 'glue',
    question: "Quelle méthode permet à AWS Glue Data Catalog d'interdire à des utilisateurs d'accéder à certaines colonnes contenant des données confidentielles (PII) lors de requêtes exécutées via Amazon Athena ?",
    options: [
      "A) Configurer des permissions de sécurité au niveau de la colonne (Column-Level Access Control) dans AWS Lake Formation",
      "B) Chiffrer chaque colonne avec un mot de passe différent dans un fichier ZIP",
      "C) Supprimer les fichiers sous-jacents sur S3",
      "D) Créer un VPC par colonne"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car AWS Lake Formation s'intègre directement avec le Glue Data Catalog pour appliquer des filtres de sécurité fins au niveau de la colonne et de la cellule, masquant ou interdisant l'accès aux colonnes sensibles pour les rôles IAM non autorisés. L'option B est fausse car Parquet et Athena ne prennent pas en charge des fichiers ZIP chiffrés par colonne. L'option C est fausse car supprimer les fichiers S3 détruirait l'intégralité du jeu de données pour tous les utilisateurs. L'option D est fausse car les VPC isolent des réseaux et non des colonnes tabulaires.",
    source_url: "https://docs.aws.amazon.com/lake-formation/latest/dg/data-filters-about.html"
  },
  {
    topic_id: 'glue',
    question: "Un job Glue ETL échoue régulièrement avec l'erreur java.lang.OutOfMemoryError: Java heap space lors du traitement d'une jointure entre une table volumineuse et plusieurs petites tables de référence. Quelle optimisation résout cette erreur ?",
    options: [
      "A) Utiliser la fonction broadcast() sur les petites tables pour éliminer le shuffle en mémoire des exécuteurs",
      "B) Réduire la mémoire allouée au Driver Spark",
      "C) Remplacer le format Parquet par des fichiers texte JSON bruts",
      "D) Désactiver les Job Bookmarks"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car la diffusion d'une petite table de référence (broadcast join) envoie une copie complète à chaque exécuteur, éliminant la redistribution réseau massive (shuffle) et évitant la saturation de la mémoire tas Java (Java heap space) causée par le regroupement des partitions volumineuses. L'option B est fausse car réduire la mémoire du Driver aggraverait les problèmes d'allocation au lieu de les résoudre. L'option C est fausse car le format JSON est beaucoup plus volumineux en mémoire que le format binaire Parquet. L'option D est fausse car les Job Bookmarks contrôlent le périmètre des fichiers lus et n'impactent pas l'exécution de la jointure en mémoire.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/monitor-job-oom.html"
  },
  {
    topic_id: 'glue',
    question: "Quel paramètre dans un script Glue ETL permet de regrouper automatiquement de multiples petits fichiers S3 en blocs de taille optimale lors de la lecture afin d'améliorer les performances de traitement Spark ?",
    options: [
      "A) Le paramètre groupFiles et groupSize dans les options de connexion S3",
      "B) Le paramètre dropDuplicates()",
      "C) L'option strictSchema: true",
      "D) Le paramètre maxRetries: 0"
    ],
    correct_answer: "A",
    explanation: "L'option A est correcte car la fonctionnalité de regroupement de fichiers (groupFiles: 'inPartition', groupSize: '134217728' pour 128 Mo) de Glue permet de fusionner virtuellement les petits fichiers lors de la lecture S3 pour créer des partitions Spark équilibrées. L'option B est fausse car dropDuplicates sert à éliminer les lignes en double dans le jeu de données. L'option C est fausse car strictSchema impose une validation de structure mais ne résout pas le problème physique des petits fichiers. L'option D est fausse car maxRetries gère les tentatives en cas d'échec d'exécution.",
    source_url: "https://docs.aws.amazon.com/glue/latest/dg/grouping-input-files.html"
  }
];

console.log(`Loaded ${d1Raw.length} questions for Domain 1 (Part 1).`);
