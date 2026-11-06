# Chapitre 1 : Ingestion en Temps Réel : Kinesis Data Streams vs Firehose vs Managed Flink

## 1. Objectifs d'apprentissage
- Différencier l'architecture et les cas d'usage de Kinesis Data Streams et Kinesis Data Firehose.
- Comprendre les mécanismes de mise en mémoire tampon (buffer size et buffer interval) de Firehose.
- Savoir quand ajouter Amazon Managed Service for Apache Flink pour les fenêtres temporelles complexes.
- Maîtriser le partitionnement par Shard et le dimensionnement de débit.

## 2. Explication claire : quand choisir quoi
L'écosystème Amazon Kinesis traite les flux de données en continu à grande échelle :

1. Amazon Kinesis Data Streams (KDS) :
- Qu'est-ce que c'est : bus d'événements temps réel à faible latence (70 à 200 ms).
- Quand le choisir : lecture multi-consommateurs en parallèle, traitement temps réel personnalisé (Lambda, KCL), ou rejeu des données (24h à 365j).
- Capacité : géré par Shards (1 Mo/s en entrée, 2 Mo/s en sortie par shard) ou en mode On-Demand (mise à l'échelle automatique).

2. Amazon Data Firehose (anciennement Kinesis Data Firehose) :
- Qu'est-ce que c'est : service sans serveur de livraison managée vers S3, Redshift, OpenSearch, Splunk et Apache Iceberg.
- Quand le choisir : ingestion directe dans un Data Lake ou entrepôt sans coder de consommateur.
- Tampon obligatoire : Firehose accumule les données selon deux seuils : taille (1 à 128 Mo) ou intervalle (60 à 900 s). Le premier seuil atteint déclenche la livraison (near real-time).
- Transformation à la volée : peut invoquer AWS Lambda pour transformer les données (décompression, enrichissement, conversion JSON en Parquet/ORC via Glue Catalog).

3. Amazon Managed Service for Apache Flink :
- Quand le choisir : pour exécuter des requêtes SQL ou du code Java/Scala sur des flux continus avec fenêtrage temporel glissant (sliding/tumbling windows) ou détection d'anomalies avec état (stateful stream processing).

## 3. Définitions des termes clés
- Shard : unité de débit de base dans Kinesis Data Streams (1 000 enregistrements/s ou 1 Mo/s en écriture).
- Partition Key : clé déterminant dans quel shard un enregistrement est écrit (hachage MD5).
- KCL (Kinesis Client Library) : bibliothèque gérant la répartition des shards entre plusieurs instances de calcul consommatrices via DynamoDB pour le suivi des points de contrôle (checkpoints).

## 4. Exemple concret
Flux de clics Web haute fréquence :
```
[Clients Web] -> [Kinesis Data Streams]
                      |--> [Lambda (alertes fraudes < 1s)]
                      |--> [Firehose] -> [Buffer: 60s / 64 Mo] -> [Format Parquet] -> [Amazon S3]
```

## 5. Comparaisons et pièges d'examen
- Firehose vers Redshift : Firehose ne charge pas directement dans Redshift ligne par ligne : il écrit d'abord des micro-lots dans un compartiment S3 intermédiaire, puis exécute automatiquement une commande `COPY` vers Redshift.
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
