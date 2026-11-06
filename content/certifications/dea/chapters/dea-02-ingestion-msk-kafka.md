# Chapitre 2 : Streaming Distribué d Entreprise : Amazon MSK (Managed Streaming for Apache Kafka)

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
```
[Producteurs Kafka] -> [Topics MSK (Partitions 1..12)]
                            |
                   [MSK Connect (S3 Sink)]
                            |
                     [Amazon S3 (Format Parquet)]
```

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
