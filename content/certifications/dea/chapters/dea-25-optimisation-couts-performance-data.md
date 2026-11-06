# Chapitre 25 : FinOps et Optimisation des Coûts et Performances Data

## 1. Objectifs d'apprentissage
- Identifier les leviers de réduction des coûts de stockage, calcul et requêtage.
- Optimiser les dépenses Glue, EMR, Athena et Redshift.
- Utiliser S3 Storage Lens et Cost Allocation Tags pour le suivi analytique.
- Appliquer les mécanismes d'auto-scaling et d'instances Spot aux charges data.

## 2. Explication claire : quand choisir quoi
L'optimisation des coûts et des performances est un pilier majeur de l'examen DEA-C01 :

1. Optimisation du stockage S3 :
- Compacter les fichiers (128 à 512 Mo) pour réduire les coûts d'appels d'API S3 (PUT/GET).
- Activer S3 Intelligent-Tiering ou des règles de cycle de vie vers Glacier Instant Retrieval ou Deep Archive.
- Activer les Bucket Keys KMS pour réduire de 99 % les frais de requêtes cryptographiques.

2. Optimisation du calcul ETL (Glue & EMR) :
- AWS Glue : facturé au DPU à la seconde (minimum 1 minute). Activer Auto Scaling et fixer un timeout court (ex. 60 min au lieu des 2880 min par défaut).
- Amazon EMR : exploiter les instances Spot pour les Task Nodes (80-90 % d'économie) et arrêter automatiquement les clusters inactifs.

3. Optimisation des requêtes (Athena & Redshift) :
- Athena : convertir systématiquement en Parquet et partitionner pour réduire les données scannées (5 USD/To).
- Redshift Serverless : définir des seuils d'utilisation RPU journaliers pour plafonner les dépenses lors des pics.

## 3. Définitions des termes clés
- DPU-Hour : unité de calcul facturée pour AWS Glue.
- S3 Storage Lens : outil d'analyse et de visualisation de l'utilisation du stockage à l'échelle de l'organisation.
- Spot Interruption : préavis de 2 minutes émis par AWS avant de récupérer une instance Spot.

## 4. Exemple concret
Configuration d'un job Glue optimisé pour le coût :
```python
# Timeout réduit à 30 minutes et exécution auto-scalable
job.init("job_finops", {
    "NumberOfWorkers": 4,
    "WorkerType": "G.1X",
    "Timeout": 30
})
```

## 5. Comparaisons et pièges d'examen
- Timeout par défaut de Glue : par défaut, un job Glue sans timeout explicite peut tourner 48 heures (2880 minutes) en boucle infinie en cas de blocage, générant une facture astronomique. Toujours configurer un timeout réaliste.
- Coûts Athena sur CSV vs Parquet : Parquet compressé divise souvent la facture par 10 à 50 par rapport au CSV brut.
- Instances Spot sur nœuds de calcul : toujours autorisées sur les Task Nodes, proscrites sur le Master Node.

## 6. Lien avec SQL, Snowflake et Databricks
Cette approche correspond aux réglages de crédits des Virtual Warehouses dans Snowflake (auto-suspend court, resource monitors) et aux clusters single-user ou Spot dans Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 301 à 315.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Un job AWS Glue non surveillé a tourné inutilement pendant 48 heures à la suite d'un blocage réseau. Quel paramètre de configuration aurait évité cette facturation excessive ?
   - A) La configuration d'un paramètre de timeout explicite sur le job (Bonne réponse).
   - B) L'utilisation d'une clé de tri composite.
   - C) L'activation d'Amazon Inspector.
   - D) L'affectation d'un LSI à la table.
2. Quelle stratégie conjointe permet de réduire au maximum la facture des requêtes SQL interactives sur Amazon Athena ?
   - A) La conversion des données en Apache Parquet compressé et le partitionnement des tables (Bonne réponse).
   - B) L'augmentation de la taille des fichiers CSV à 50 Go.
   - C) La suppression des schémas dans Glue Data Catalog.
   - D) L'utilisation de volumes EBS non provisionnés.
