# Chapitre 14 : Formats de Fichiers, Compression et Partitionnement dans le Data Lake

## 1. Objectifs d'apprentissage
- Comparer les formats de données : Parquet, ORC, Avro, JSON et CSV.
- Sélectionner le bon algorithme de compression (Snappy, GZIP, ZSTD, bzip2).
- Concevoir une stratégie de partitionnement évitant le problème des petits fichiers.
- Comprendre le partition pruning et la projection de partitions.

## 2. Explication claire : quand choisir quoi
Le format de stockage et le découpage constituent le levier clé de performance et de coût d'un Data Lake AWS :

1. Formats de fichiers :
- Apache Parquet : format colonnaire optimisé pour l'analytique (OLAP). Stocke les statistiques min/max dans son footer, permettant le saut de blocs et la lecture sélective de colonnes.
- Apache ORC : format colonnaire très performant, particulièrement optimisé pour l'écosystème Apache Hive et EMR.
- Apache Avro : format orienté ligne basé sur un schéma JSON strict. Idéal pour l'ingestion de flux de streaming (Kafka, Kinesis) et la sérialisation ligne par ligne.
- JSON / CSV : formats texte lisibles par l'humain mais très inefficaces pour les requêtes analytiques massives (scans intégraux coûteux).

2. Algorithmes de compression :
- Snappy : compression rapide avec décompression ultra-véloce. Idéal pour Parquet dans Athena, Glue et Spark (compromis optimal vitesse/CPU).
- GZIP : taux de compression élevé mais non découpable (non-splittable) si non indexé.
- ZSTD (Zstandard) : excellent ratio de compression et vitesse élevée, supporté par Parquet et Athena.
- bzip2 : très fort taux de compression et découpable, mais très gourmand en CPU.

3. Bonnes pratiques de partitionnement :
- Partitionner sur des colonnes à cardinalité modérée (ex. `annee/mois/jour`).
- Éviter le sur-partitionnement (ex. par identifiant client ou par minute) qui engendre des millions de petits fichiers saturant les API S3.
- Viser une taille de fichier unitaire entre 128 Mo et 512 Mo.

## 3. Définitions des termes clés
- Stockage colonnaire : organisation physique regroupant les valeurs d'une même colonne dans des blocs contigus.
- Partition Pruning : élimination des répertoires hors périmètre lors de l'exécution d'une requête SQL.
- Splittable : capacité d'un fichier compressé à être lu en parallèle par plusieurs exécuteurs Spark.

## 4. Exemple concret
Structure de préfixes S3 partitionnée pour requêtes Athena :
```
s3://mon-datalake/curated/commandes/
  ├── annee=2026/mois=10/jour=30/fichier_001.snappy.parquet
  └── annee=2026/mois=10/jour=31/fichier_002.snappy.parquet
```

## 5. Comparaisons et pièges d'examen
- Parquet vs Avro : Avro pour l'ingestion ligne par ligne en streaming ; Parquet pour les analyses SQL colonnaires avec agrégations.
- Fichiers non-splittables : un fichier CSV compressé en .gz de 10 Go ne peut être lu que par un seul worker Spark, formant un goulot d'étranglement majeur.
- Requêtes sur JSON brut : scanner 1 To de JSON coûte 5 USD par requête sur Athena, contre 0,20 USD une fois converti en Parquet partitionné.

## 6. Lien avec SQL, Snowflake et Databricks
Snowflake et Databricks convertissent tous deux les données ingérées dans leurs propres formats colonnaires propriétaires dérivés de Parquet (FND dans Snowflake, Delta Lake dans Databricks).

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 140 à 150.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quel format de fichier est le plus adapté à l'ingestion continue d'événements de streaming via Kafka avec gestion stricte de l'évolution de schéma ?
   - A) Apache Avro (Bonne réponse).
   - B) Apache Parquet.
   - C) Fichier texte CSV brut.
   - D) Fichier HTML.
2. Pourquoi déconseille-t-on de partitionner un Data Lake S3 par identifiant client unique lors de l'ingestion quotidienne ?
   - A) Cela crée des millions de petits fichiers dégradant les performances d'Athena et Glue (Bonne réponse).
   - B) L'API S3 limite le nombre total d'objets par bucket à 10 000.
   - C) Les clés de partition ne peuvent pas contenir de chiffres.
   - D) La compression Snappy est incompatible avec les chaînes de caractères.
