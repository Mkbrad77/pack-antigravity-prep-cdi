# Chapitre 5 : Traitement Big Data Massif avec Apache Spark sur Amazon EMR

## 1. Objectifs d'apprentissage
- Comprendre l'architecture d'un cluster EMR (Primary, Core, Task Nodes).
- Distinguer les déploiements EMR : sur EC2, sur EKS et EMR Serverless.
- Maîtriser les concepts Spark fondamentaux : RDD, DataFrames, Shuffle, Data Skew.
- Optimiser les coûts d'un cluster EMR grâce aux instances Spot sur les Task Nodes.

## 2. Explication claire : quand choisir quoi
Amazon EMR est la plateforme Big Data managée d'AWS pour exécuter Spark, Hive, Presto, Trino et Flink à grande échelle :

Architecture d'un cluster EMR sur EC2 :
1. Nœud primaire (Primary Node) :
   - Coordonne le cluster, exécute le gestionnaire de ressources YARN et le pilote Spark (Driver).
   - Ne doit jamais être interrompu : toujours déployer sur instance On-Demand.
2. Nœuds centraux (Core Nodes) :
   - Exécutent les tâches Spark (Executors) et stockent les blocs sur HDFS.
   - Risque de perte de données HDFS en cas de résiliation : déployer sur On-Demand.
3. Nœuds de tâches (Task Nodes) :
   - Exécutent uniquement du calcul Spark sans stockage persistant HDFS.
   - Idéal pour les instances Spot : en cas d'interruption avec préavis de 2 minutes, aucune donnée n'est perdue et Spark relance la tâche perdue sur un autre nœud.

Modes de déploiement EMR :
- EMR sur EC2 : contrôle complet sur le matériel, les scripts d'amorçage (bootstrap actions) et les paramètres système. Idéal pour les clusters pérennes complexes.
- EMR sur EKS : exécution de Spark sur un cluster Kubernetes partagé.
- EMR Serverless : exécution d'applications Spark sans configurer ni gérer de clusters, avec mise à l'échelle automatique des vCPU et de la mémoire.

Optimisations Spark essentielles :
- Data Skew (asymétrie) : lorsqu'une clé concentre la majorité des données, saturant un exécuteur. Solutions : salage de clés (key salting) ou activation de l'Adaptive Query Execution (AQE).
- Broadcast Join : envoi d'une petite table (< 10 Mo) à chaque exécuteur pour éliminer le shuffle réseau lors des jointures.

## 3. Définitions des termes clés
- Driver Spark : processus central initialisant la SparkSession et distribuant les tâches aux exécuteurs.
- Executor : processus JVM sur les nœuds de travail effectuant les calculs.
- Shuffle : redistribution physique des données à travers le réseau lors de jointures ou regroupements.
- Broadcast Join : copie intégrale d'une table envoyée à chaque worker évitant le shuffle.

## 4. Exemple concret
Jointure optimisée avec broadcast en PySpark :
```python
from pyspark.sql.functions import broadcast

transactions = spark.read.parquet("s3://lake/transactions/")
pays = spark.read.parquet("s3://lake/referentiel_pays/")

resultat = transactions.join(broadcast(pays), "code_pays")
resultat.write.mode("overwrite").parquet("s3://lake/curated/transactions_enrichies/")
```

## 5. Comparaisons et pièges d'examen
- EMR vs AWS Glue : EMR donne un contrôle fin sur la version de Spark, les bibliothèques personnalisées et l'accès SSH ; Glue est 100 % sans serveur, facturé au DPU, parfait pour les ETL standards.
- Task Nodes vs Core Nodes : ne jamais affecter d'instances Spot aux Core Nodes en production à cause du risque de corruption HDFS.
- EMRFS : permet d'utiliser directement Amazon S3 comme stockage persistant à la place de HDFS, autorisant l'extinction complète du cluster après exécution.

## 6. Lien avec SQL, Snowflake et Databricks
EMR correspond directement aux clusters Databricks Runtime. La maîtrise du Driver, des Executors, du shuffle et du broadcast join est identique sur les deux plateformes.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 196 à 215.
- Voir aussi : cours Nikolai Schuler, leçons 161 à 175.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Quelle configuration d'instances optimise les coûts d'un cluster Amazon EMR exécutant Spark sans risquer de corrompre le stockage HDFS ?
   - A) Nœuds Master et Core sur instances On-Demand, Nœuds Task sur instances Spot (Bonne réponse).
   - B) Tous les nœuds sur instances Spot.
   - C) Nœuds Master sur instances Spot et Nœuds Task sur On-Demand.
   - D) Nœuds Core sur instances Spot sans aucun nœud Task.
2. Une requête Spark joignant une table de 500 Go et une table de 5 Mo souffre de lenteurs dues au shuffle réseau. Quelle optimisation technique résout ce problème ?
   - A) Utiliser une jointure diffusée (Broadcast Join) sur la petite table (Bonne réponse).
   - B) Augmenter la taille des blocs HDFS à 1 Go.
   - C) Désactiver l'Adaptive Query Execution.
   - D) Convertir la table de faits au format CSV.
