# Chapitre 3 : Traitement de Données Distribué avec AWS Glue ETL et Job Bookmarks

## 1. Objectifs d'apprentissage
- Comprendre le fonctionnement d'AWS Glue ETL sans serveur (Spark sous-jacent).
- Maîtriser la différence fondamentale entre DynamicFrames et DataFrames Spark.
- Utiliser les Job Bookmarks pour le traitement incrémental sans doublons.
- Choisir les types de DPU (Data Processing Units) et optimiser les coûts d'exécution.

## 2. Explication claire : quand choisir quoi
AWS Glue ETL est un moteur sans serveur basé sur Apache Spark optimisé pour les pipelines ETL :

Quand choisir AWS Glue ETL :
- Transformations complexes par lots sur gros volumes sans administrer de clusters.
- Catalogue de métadonnées partagé avec Athena, Redshift Spectrum et EMR.

DynamicFrames vs Apache Spark DataFrames :
- DataFrame Spark classique : exige un schéma fixe et strict avant l'exécution. En cas de colonne imprévue ou de type mixte (entier dans une ligne, chaîne dans une autre), Spark échoue ou coerce la valeur à null.
- DynamicFrame AWS Glue : structure conçue pour les Data Lakes où chaque enregistrement est auto-descriptif. Les types divergents forment des `choice types` résolus via `ResolveChoice` sans perte de données.
- Conversion bidirectionnelle : `toDF()` et `fromDF()` permettent de passer instantanément de DynamicFrame à DataFrame pour utiliser les fonctions SQL Spark standards.

Job Bookmarks :
- Mécanisme suivant les données déjà traitées lors des exécutions précédentes.
- Fonctionnement : Glue mémorise la date de dernière modification ou la clé primaire incrémentale.
- Résultats : seules les nouvelles données sont ingérées, évitant les retraitements et doublons.

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
```python
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
```

## 5. Comparaisons et pièges d'examen
- `job.commit()` obligatoire : si vous utilisez les Job Bookmarks, vous DEVEZ appeler explicitement `job.commit()` à la fin du script, sinon l'état du marqueur n'est jamais sauvegardé et la prochaine exécution retraitera les mêmes fichiers.
- Glue ETL vs EMR : Glue est entièrement sans serveur avec démarrage en moins d'une minute et tarification à la seconde ; EMR est idéal pour les clusters Spark personnalisés à long terme avec composants spécifiques (HBase, Presto, Flink) ou instances Spot massives.
- Pushdown Predicates : pour filtrer les partitions S3 directement dans le catalogue Glue AVANT que Spark ne lise les fichiers, utilisez `push_down_predicate` (ex. `year='2026' AND month='10'`), ce qui évite de charger des téraoctets inutiles en mémoire.

## 6. Lien avec SQL, Snowflake et Databricks
Le DynamicFrame résout exactement le même problème que le type `VARIANT` dans Snowflake ou la gestion des schémas flexibles avec Auto Loader dans Databricks : traiter du JSON brut semi-structuré sans casser le pipeline en cas d'évolution de schéma.

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
