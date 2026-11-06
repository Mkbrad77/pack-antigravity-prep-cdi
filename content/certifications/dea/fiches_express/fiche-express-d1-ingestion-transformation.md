# Fiche Express Domaine 1 : Ingestion et Transformation des Données (34 %)

## 1. Vue d'ensemble du Domaine 1
Le Domaine 1 représente le poids le plus lourd de l'examen DEA-C01 (34 %). Il évalue votre capacité à concevoir, déployer et optimiser des pipelines d'ingestion par lots et en continu (streaming), ainsi que les transformations distribuées.

## 2. Les 12 Chiffres et Limites Critiques à Retenir
1. Kinesis Data Streams (par Shard) : 1 Mo/s ou 1 000 enregistrements/s en écriture (PUT) ; 2 Mo/s en lecture (GET).
2. Taille maximale d'un enregistrement Kinesis : 1 Mo strictement (au-delà, utiliser S3 avec pointeur).
3. Rétention Kinesis Data Streams : 24 heures par défaut, configurable jusqu'à 365 jours.
4. Tampon Amazon Data Firehose : taille de 1 Mo à 128 Mo, intervalle de 60 secondes à 900 secondes (le premier atteint déclenche l'écriture).
5. Limite d'exécution AWS Lambda : 15 minutes (900 secondes) maximum strict ; mémoire de 128 Mo à 10 240 Mo (10 Go) ; disque `/tmp` de 512 Mo à 10 240 Mo.
6. Amazon SQS Standard : débit quasi illimité ; SQS FIFO : 300 messages/s (ou 3 000/s par lot de 10).
7. SQS Visibility Timeout : 30 secondes par défaut, configurable de 0 seconde à 12 heures ; rétention de 1 minute à 14 jours (4 jours par défaut).
8. SQS Long Polling : `WaitTimeSeconds` jusqu'à 20 secondes (recommandé pour réduire les coûts).
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
3. Firehose vers Redshift : Firehose ne fait pas d'insert direct en base ; il écrit des micro-lots dans S3 puis exécute automatiquement un `COPY` vers Redshift.
4. Coûts explosifs sous Athena : requêter des fichiers CSV bruts non partitionnés scanne tout le bucket S3. Solution : convertir en Apache Parquet compressé (Snappy/ZSTD) et partitionner.
5. Limite Lambda dépassée : un traitement de 20 minutes échoue obligatoirement sur Lambda. Ne jamais choisir Lambda si la tâche dépasse 15 minutes.
