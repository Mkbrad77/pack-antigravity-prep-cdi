# Chapitre 4 : Streaming avec Glue et Préparation Visuelle avec Glue DataBrew

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
```
[Transactions Kinesis] ------------------------> [Glue Streaming ETL]
                                                        ^
[Tables de référence clients sur Amazon S3] ------------|
                                                        v
                                            [Amazon S3 (Curated Iceberg)]
```

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
