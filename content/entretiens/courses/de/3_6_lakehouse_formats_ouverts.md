# Chapitre 3.6 : Architecture Lakehouse & Formats Ouverts (Iceberg, Delta)

## 1. La question classique posée en entretien
« Qu'est-ce qu'une architecture Lakehouse et en quoi un format comme Apache Iceberg ou Delta Lake résout-il les limitations historiques du Data Lake bâti sur de simples fichiers Parquet dans S3 ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre compréhension de la couche de métadonnées (Metadata Layer) qui transforme un stockage d'objets passif en table relationnelle ACID.
- Votre maîtrise des fonctionnalités avancées : Time Travel, Hidden Partitioning, Schema Evolution, et Compaction.
- Votre capacité à expliquer l'interopérabilité multi-moteurs (une même table Iceberg lue par Spark, Snowflake, Trino et Athena sans duplication).

## 3. Réponse d'ingénieur senior

### A. Les faiblesses du Data Lake Parquet traditionnel
- **Pas de transactions ACID :** Si un job plante en cours d'écriture, des fichiers partiels corrompent les lectures concurrentes.
- **Partitionnement statique fragile :** Le partitionnement par répertoire (`year=2026/month=10/`) oblige l'utilisateur à connaître la structure physique pour ne pas déclencher un scan complet.
- **Lenteur des opérations de listage S3 :** Les requêtes nécessitaient des milliers d'appels `ListBucket`.

### B. Le rôle de la couche Apache Iceberg
1. **Arborescence de métadonnées :** Snapshot -> Manifest List -> Manifest Files -> Data Files (Parquet).
2. **Hidden Partitioning :** La table partitionne dynamiquement (ex. `days(timestamp)`) sans que l'utilisateur doive modifier sa clause WHERE (`WHERE ts >= '2026-10-01'`).
3. **Time Travel et Rollback :** Chaque écriture génère un nouveau snapshot immuable. On peut interroger la table telle qu'elle était hier à 14h00.
4. **Maintenance :** Nécessite des jobs périodiques d'optimisation : compaction des petits fichiers (Bin-packing) et purge des anciens snapshots (expire snapshots).

## 4. Erreurs fatales à éviter absolument
- Croire que Delta Lake ou Iceberg remplacent le format Parquet : ce sont des couches de gestion qui encapsulent des fichiers Parquet.
- Oublier la problématique des « petits fichiers » générés par les écritures streaming, qui dégradent les performances de lecture sans compaction.
