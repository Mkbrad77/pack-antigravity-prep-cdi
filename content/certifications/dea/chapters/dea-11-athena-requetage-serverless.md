# Chapitre 11 : Analytique SQL Sans Serveur sur S3 avec Amazon Athena

## 1. Objectifs d'apprentissage
- Comprendre le fonctionnement d'Amazon Athena (moteur Trino/Presto sans serveur).
- Maîtriser les techniques de réduction des coûts de requêtage (formats colonnaires, partitionnement).
- Utiliser la commande CTAS (CREATE TABLE AS SELECT) pour transformer et matérialiser des données.
- Configurer la projection de partitions (Partition Projection) pour éliminer les latences de métadonnées.

## 2. Explication claire : quand choisir quoi
Amazon Athena est un service SQL sans serveur analysant directement les données sur Amazon S3 via l'AWS Glue Data Catalog :

Quand choisir Amazon Athena :
- Pour explorer rapidement des données brutes déposées dans un Data Lake S3 avec des requêtes SQL ANSI standard.
- Pour des analyses ponctuelles (ad-hoc queries) ou des tableaux de bord interactifs sans payer de cluster fixe.
- Tarification : facturation au volume de données numérisées (scanned data) par la requête (5 USD par To analysé).

Optimisation des requêtes et réduction drastique des coûts :
1. Conversion en formats colonnaires (Apache Parquet ou ORC) :
   - Divise par 5 à 10 les volumes scannés en ne lisant que les colonnes requises depuis S3.
2. Compression des données :
   - La compression Snappy ou ZSTD réduit la taille des fichiers et accélère les transferts I/O.
3. Partitionnement des répertoires S3 :
   - Structurer les données par préfixes S3 hiérarchiques (`year=2026/month=10/day=31/`).
   - Le filtrage par date ne numérise que la partition ciblée, ignorant le reste.
4. Projection de partitions (Partition Projection) :
   - Évite d'interroger le Glue Catalog pour lister les milliers de partitions. Les plages de partitions sont configurées directement dans la table, rendant le requêtage quasi instantané.

Utilisation de CTAS (CREATE TABLE AS SELECT) :
- Permet de créer une nouvelle table dans Athena tout en transformant, filtrant, partitionnant et convertissant les données sources vers le format Parquet en une seule requête SQL.
- Limite CTAS : une requête CTAS peut écrire un maximum de 100 partitions simultanément.

## 3. Définitions des termes clés
- SerDe (Serializer/Deserializer) : composant logiciel indiquant à Athena comment interpréter les données d'un format de fichier spécifique (ex. LazySimpleSerDe pour CSV, OpenCSVSerDe, Parquet SerDe).
- CTAS : syntaxe SQL créant une nouvelle table et écrivant son contenu sous forme de fichiers optimisés sur S3.
- Workgroups Athena : espaces de travail permettant d'isoler les utilisateurs, de définir des limites maximales de volume numérisé par requête et d'acheminer les métriques vers CloudWatch.

## 4. Exemple concret
Requête CTAS transformant des logs bruts en Parquet partitionné :
```sql
CREATE TABLE curated_logs
WITH (
    format = 'PARQUET',
    parquet_compression = 'SNAPPY',
    external_location = 's3://mon-datalake/curated/logs/',
    partitioned_by = ARRAY['annee', 'mois']
) AS
SELECT
    id_utilisateur,
    action,
    montant,
    year(date_event) AS annee,
    month(date_event) AS mois
FROM raw_logs_csv
WHERE statut = 'CONFIRME';
```

## 5. Comparaisons et pièges d'examen
- Athena vs Redshift : Athena est sans serveur, facturé au To scanné et idéal pour les requêtes ponctuelles sur S3 ; Redshift est un entrepôt MPP permanent conçu pour les requêtes décisionnelles intensives, les jointures complexes et les milliers d'utilisateurs concurrents.
- Athena vs Redshift Spectrum : Redshift Spectrum permet à un cluster Redshift existant d'interroger les tables externes S3 ; Athena ne nécessite aucun cluster Redshift.
- Requêtes sur fichiers non partitionnés en CSV : piège d'examen classique où une requête scanne l'intégralité du compartiment S3, engendrant des coûts exorbitants et des temps d'attente prolongés.

## 6. Lien avec SQL, Snowflake et Databricks
Amazon Athena interrogeant S3 avec Glue Data Catalog fonctionne exactement comme les External Tables dans Snowflake ou les requêtes SQL Databricks exécutées sur des fichiers non managés dans un stockage cloud objet.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 152 à 165.
- Voir aussi : cours Nikolai Schuler, leçons 176 à 190.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Une équipe data exécute des requêtes SQL sur 50 To de logs bruts CSV stockés dans S3 et constate des coûts très élevés. Quelles deux actions conjointes réduisent le plus efficacement les coûts de requêtage Athena ?
   - A) Convertir les fichiers au format Apache Parquet et partitionner les données par date (Bonne réponse).
   - B) Migrer les fichiers vers S3 Glacier Deep Archive.
   - C) Augmenter la fréquence des requêtes pour exploiter le cache mémoire.
   - D) Remplacer les clés de partition par des fichiers JSON non compressés.
2. Quelle fonctionnalité d'Athena configure le moteur pour calculer dynamiquement les chemins de partitions sans appeler le catalogue de métadonnées Glue à chaque requête ?
   - A) La projection de partitions (Partition Projection) (Bonne réponse).
   - B) Les Workgroups de facturation.
   - C) La commande VACUUM REINDEX.
   - D) L'intégration avec AWS Secrets Manager.
