import fs from 'node:fs';
import path from 'node:path';

const CHAPTERS_DIR = path.join(process.cwd(), 'content', 'certifications', 'dea', 'chapters');

function clean(text) {
  return text.replace(/\u2014/g, ': ').replace(/\u2013/g, '-');
}

// 1. dea-05
const dea05 = `# Chapitre 5 : Traitement Big Data Massif avec Apache Spark sur Amazon EMR

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
\`\`\`python
from pyspark.sql.functions import broadcast

transactions = spark.read.parquet("s3://lake/transactions/")
pays = spark.read.parquet("s3://lake/referentiel_pays/")

resultat = transactions.join(broadcast(pays), "code_pays")
resultat.write.mode("overwrite").parquet("s3://lake/curated/transactions_enrichies/")
\`\`\`

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
`;

// 2. dea-13
const dea13 = `# Chapitre 13 : Formats de Tables Ouverts : Apache Iceberg et Amazon S3 Tables

## 1. Objectifs d'apprentissage
- Comprendre les principes du format ouvert Apache Iceberg (transactions ACID, time travel).
- Maîtriser le partitionnement caché (hidden partitioning) et l'évolution de schéma.
- Découvrir Amazon S3 Tables et sa maintenance automatisée (nouveauté DEA-C01 v1.1).
- Intégrer Iceberg avec AWS Glue Data Catalog, Athena, EMR et Redshift.

## 2. Explication claire : quand choisir quoi
Les Data Lakes classiques basés sur de simples fichiers Parquet manquent de transactions ACID et souffrent de lenteurs de listage. Apache Iceberg et Amazon S3 Tables résolvent ces défis :

1. Apache Iceberg :
- Format de table ouvert apportant aux Data Lakes les fonctionnalités d'entrepôt.
- Transactions ACID complètes : isolation par snapshot garantissant des lectures et écritures concurrentes fiables.
- Partitionnement caché (Hidden Partitioning) : le moteur déduit les partitions physiques utiles sans colonnes de partition artificielles dans la clause WHERE.
- Évolution de schéma : ajout, renommage ou suppression de colonnes sans réécrire les fichiers historiques.
- Voyage dans le temps (Time Travel) : interrogation de la table à un instant T passé ou à un identifiant de snapshot précis.

2. Amazon S3 Tables (Nouveauté majeure DEA-C01 v1.1) :
- Premier stockage d'objets cloud nativement conçu pour les tables Apache Iceberg.
- Performance multipliée jusqu'à 3 fois par rapport à un bucket S3 standard grâce à l'optimisation des métadonnées.
- Compaction continue automatisée : fusion automatique en arrière-plan des petits fichiers Parquet issus du streaming en fichiers optimisés de 128 à 512 Mo.
- Gestion autonome des snapshots : purge automatique des snapshots expirés et des fichiers orphelins sans jobs Glue manuels.

## 3. Définitions des termes clés
- Snapshot Iceberg : vue immuable de l'état de la table à un instant donné.
- Manifest List : fichier de métadonnées listant l'ensemble des manifestes composant un snapshot.
- Compaction : fusion et réécriture de petits fichiers Parquet en fichiers optimisés pour accélérer les scans.

## 4. Exemple concret
Requête SQL Athena sur table Iceberg avec Time Travel :
\`\`\`sql
SELECT code_client, solde_compte
FROM db_finance.comptes_clients
FOR SYSTEM_TIME AS OF TIMESTAMP '2026-10-20 12:00:00 UTC'
WHERE code_client = 'CL-98745';
\`\`\`

## 5. Comparaisons et pièges d'examen
- Iceberg vs Format Hive classique : Hive requiert le listage récursif des répertoires S3 sans support ACID ; Iceberg lit l'arborescence des métadonnées avec isolation complète.
- Problème des petits fichiers : en ingestion continue, des milliers de micro-fichiers sont créés. Sans S3 Tables ou sans optimisation régulière, les requêtes Athena ralentissent fortement.
- Compatibilité multi-moteurs : Iceberg est interrogé de manière transparente par Athena, EMR, Redshift, Snowflake et Databricks.

## 6. Lien avec SQL, Snowflake et Databricks
Apache Iceberg équivaut au format Delta Lake de Databricks. Snowflake prend en charge nativement les tables managées Iceberg stockées sur vos propres buckets S3.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 154 et 155.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quel avantage apporte le partitionnement caché (Hidden Partitioning) dans Apache Iceberg ?
   - A) Le filtrage s'applique automatiquement sans mentionner de colonnes de partition artificielles dans la clause WHERE (Bonne réponse).
   - B) Les données sont chiffrées avec une clé asymétrique unique.
   - C) La table devient immuable et non modifiable.
   - D) Les métadonnées sont supprimées après chaque transaction.
2. Quelle fonctionnalité fournie par Amazon S3 Tables supprime la dégradation de requêtage liée à l'ingestion continue ?
   - A) La compaction automatique des petits fichiers en arrière-plan sans scripts externes (Bonne réponse).
   - B) Le verrouillage strict en écriture mono-utilisateur.
   - C) La conversion obligatoire des données en texte CSV.
   - D) La suppression des index primaires.
`;

// 3. dea-14
const dea14 = `# Chapitre 14 : Formats de Fichiers, Compression et Partitionnement dans le Data Lake

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
- Partitionner sur des colonnes à cardinalité modérée (ex. \`annee/mois/jour\`).
- Éviter le sur-partitionnement (ex. par identifiant client ou par minute) qui engendre des millions de petits fichiers saturant les API S3.
- Viser une taille de fichier unitaire entre 128 Mo et 512 Mo.

## 3. Définitions des termes clés
- Stockage colonnaire : organisation physique regroupant les valeurs d'une même colonne dans des blocs contigus.
- Partition Pruning : élimination des répertoires hors périmètre lors de l'exécution d'une requête SQL.
- Splittable : capacité d'un fichier compressé à être lu en parallèle par plusieurs exécuteurs Spark.

## 4. Exemple concret
Structure de préfixes S3 partitionnée pour requêtes Athena :
\`\`\`
s3://mon-datalake/curated/commandes/
  ├── annee=2026/mois=10/jour=30/fichier_001.snappy.parquet
  └── annee=2026/mois=10/jour=31/fichier_002.snappy.parquet
\`\`\`

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
`;

// 4. dea-15
const dea15 = `# Chapitre 15 : Architecture Amazon Redshift et Styles de Distribution des Tables

## 1. Objectifs d'apprentissage
- Comprendre l'architecture MPP de Redshift (Leader Node, Compute Nodes, Slices).
- Maîtriser les 4 styles de distribution : AUTO, KEY, EVEN, ALL.
- Éliminer le shuffle réseau lors des jointures volumineuses.
- Connaître les instances RA3 avec stockage managé séparé.

## 2. Explication claire : quand choisir quoi
Amazon Redshift est un entrepôt de données relationnel MPP colonnaire pour l'analytique à grande échelle :

Architecture du cluster Redshift :
1. Nœud Leader (Leader Node) :
   - Reçoit les requêtes SQL clientes, compile le code d'exécution et distribue le plan aux nœuds de calcul.
   - Aucun coût additionnel : inclus dans le cluster.
2. Nœuds de calcul (Compute Nodes) :
   - Exécutent le code compilé en parallèle et renvoient les résultats au Leader Node.
   - Chaque nœud est divisé en tranches (Slices) de calcul et de stockage.
   - Nœuds RA3 : séparent le calcul du stockage managé Redshift (RMS sur S3) avec cache SSD NVMe local.

Styles de distribution (DISTSTYLE) :
Le style de distribution détermine la répartition des lignes entre les slices :
1. KEY (DISTSTYLE KEY) :
   - Distribution par hachage d'une colonne spécifique.
   - À choisir pour les tables fréquemment jointes sur cette clé afin de forcer la colocalisation sur les mêmes tranches (colocated join, zéro shuffle).
2. ALL (DISTSTYLE ALL) :
   - Copie intégrale dupliquée sur le premier slice de chaque nœud.
   - Idéal pour les petites tables de dimension (< 2-3 millions de lignes). Élimine le shuffle lors des jointures.
3. EVEN (DISTSTYLE EVEN) :
   - Distribution circulaire (round-robin) uniforme sans tenir compte des valeurs.
   - À choisir sans clé de jointure évidente ou pour éviter le déséquilibre (skew).
4. AUTO (DISTSTYLE AUTO) :
   - Choix par défaut : Redshift commence en ALL pour les petites tables, puis bascule vers EVEN ou KEY selon l'évolution du volume.

## 3. Définitions des termes clés
- MPP : architecture où plusieurs nœuds exécutent simultanément des calculs sur des données réparties.
- Slice : fraction de nœud de calcul dotée de mémoire et de stockage dédiés.
- Collocated Join : jointure où les lignes des deux tables résident sur la même slice, sans transfert réseau.

## 4. Exemple concret
Déclaration SQL de distribution optimisée :
\`\`\`sql
CREATE TABLE dim_pays (
    code_pays VARCHAR(3) PRIMARY KEY,
    nom_pays VARCHAR(50)
) DISTSTYLE ALL;

CREATE TABLE faits_ventes (
    id_vente BIGINT,
    id_client INT,
    montant DECIMAL(10,2)
) DISTSTYLE KEY DISTKEY(id_client);
\`\`\`

## 5. Comparaisons et pièges d'examen
- Data Skew : une DISTKEY à faible cardinalité (ex. pays avec 90 % de 'FR') concentre les données sur un seul slice, ralentissant tout le cluster. Surveiller via \`SVV_TABLE_INFO\`.
- ALL sur table volumineuse : piège d'examen saturant inutilement l'espace disque du cluster.

## 6. Lien avec SQL, Snowflake et Databricks
Redshift demande une configuration explicite du placement physique (\`DISTKEY\`), tandis que Snowflake gère le micro-partitionnement de manière transparente sans distribution manuelle.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 54 à 75.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Deux tables volumineuses de 200 Go sont systématiquement jointes sur la colonne id_client. Quel style de distribution élimine le shuffle réseau lors des requêtes ?
   - A) DISTSTYLE KEY avec id_client comme DISTKEY sur les deux tables (Bonne réponse).
   - B) DISTSTYLE ALL sur les deux tables.
   - C) DISTSTYLE EVEN sur la première table et ALL sur la seconde.
   - D) DISTSTYLE AUTO sans clé.
2. Quel composant de l'architecture Redshift analyse les requêtes SQL, compile le code C++ et coordonne les nœuds de calcul ?
   - A) Le Leader Node (Bonne réponse).
   - B) Les Slices de stockage.
   - C) L'AWS Glue Data Catalog.
   - D) L'agent Kinesis.
`;

// 5. dea-16
const dea16 = `# Chapitre 16 : Clés de Tri, Encodage et Optimisation des Performances Redshift

## 1. Objectifs d'apprentissage
- Différencier les clés de tri composées (Compound Sort Keys) et entrelacées (Interleaved Sort Keys).
- Maîtriser les encodages de compression de colonnes (AZ64, ZSTD).
- Utiliser les commandes VACUUM et ANALYZE pour préserver les performances.
- Comprendre la gestion de charge WLM (Workload Management) et la concurrence automatique.

## 2. Explication claire : quand choisir quoi
Les clés de tri fixent l'ordre physique des données dans les blocs de 1 Mo de Redshift, permettant de sauter des millions de lignes inutiles :

1. Clés de tri (SORTKEY) :
- Clé de tri composée (Compound Sort Key) :
  - Trie selon l'ordre strict de déclaration (colonne 1, puis 2).
  - Idéal lorsque les filtres utilisent systématiquement le préfixe des colonnes (ex. \`WHERE date_vente >= '2026-01-01'\`).
  - Option par défaut la plus rapide au chargement.
- Clé de tri entrelacée (Interleaved Sort Key) :
  - Donne un poids égal à chaque colonne triée.
  - Idéal si les requêtes filtrent sur différentes combinaisons de colonnes arbitraires sans ordre fixe (ex. filtre parfois sur pays, parfois sur catégorie).
  - Attention : réindexation très coûteuse lors du VACUUM.

2. Encodages de compression colonnaire :
- AZ64 : algorithme propriétaire AWS hautement performant, offrant une excellente compression et une vitesse de décompression record pour les entiers, décimaux et dates.
- ZSTD : fort taux de compression pour les chaînes de caractères et types variés.
- Analyser les encodages optimaux : la commande \`ANALYZE COMPRESSION nom_table\` suggère les meilleurs encodages.

3. Maintenance : VACUUM et ANALYZE :
- VACUUM : réorganise les données pour restaurer l'ordre de tri physique et libère l'espace des lignes supprimées.
- ANALYZE : met à jour les statistiques de distribution utilisées par l'optimiseur de requêtes.

4. WLM (Workload Management) :
- Isole les charges dans des files d'attente distinctes (ex. file dédiée aux rapports de direction prioritaires et file pour les batchs ETL lourds).
- Concurrency Scaling : ajoute automatiquement de la capacité de calcul sans serveur lors des pics de charge de requêtes en lecture.

## 3. Définitions des termes clés
- Zone Maps : métadonnées en mémoire stockant les valeurs min et max de chaque bloc de 1 Mo pour ignorer les blocs hors périmètre.
- Ghost Rows : lignes marquées supprimées occupant encore de l'espace physique avant le passage du VACUUM.
- WLM : régulateur allouant mémoire et créneaux de concurrence aux requêtes.

## 4. Exemple concret
Définition SQL avec encodage AZ64 et clé de tri composée :
\`\`\`sql
CREATE TABLE ventes (
    id_vente BIGINT ENCODE az64,
    date_vente DATE ENCODE az64,
    id_client INT ENCODE az64,
    montant DECIMAL(10,2) ENCODE az64
)
COMPOUND SORTKEY (date_vente, id_client);
\`\`\`

## 5. Comparaisons et pièges d'examen
- Compound vs Interleaved : Compound est presque toujours recommandé sauf si des colonnes variées sont filtrées sans préfixe commun.
- Ne pas encoder la clé de tri : la première colonne d'une Compound Sort Key ne doit jamais être compressée avec un encodage trop lourd (RAW ou AZ64 recommandé) pour que les Zone Maps restent performantes.
- VACUUM DELETE ONLY : libère l'espace des lignes supprimées sans réordonner toute la table.

## 6. Lien avec SQL, Snowflake et Databricks
Redshift utilise les Zone Maps et \`SORTKEY\`, tout comme Snowflake utilise les min/max des micro-partitions et le clustering keys pour le partition pruning.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 76 à 95.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quel type de clé de tri Redshift offre les meilleures performances lorsque les requêtes filtrent systématiquement sur une plage de dates en première condition ?
   - A) Compound Sort Key avec la date en première colonne (Bonne réponse).
   - B) Interleaved Sort Key.
   - C) DISTSTYLE ALL.
   - D) Hash Sort Key.
2. Quelle commande Redshift met à jour les statistiques de métadonnées pour permettre à l'optimiseur de requêtes de générer les plans d'exécution les plus efficaces ?
   - A) ANALYZE (Bonne réponse).
   - B) VACUUM REINDEX.
   - C) TRUNCATE.
   - D) ALTER TABLE RECLUSTER.
`;

// 6. dea-17
const dea17 = `# Chapitre 17 : Analytique Hybride : Redshift Spectrum et Redshift Data Sharing

## 1. Objectifs d'apprentissage
- Interroger les données d'un Data Lake S3 avec Redshift Spectrum sans ingestion locale.
- Maîtriser Redshift Data Sharing pour le partage inter-clusters sans copie de données.
- Utiliser Aurora Zero-ETL vers Redshift pour l'analytique quasi temps réel (DEA-C01 v1.1).
- Comparer Redshift Serverless et les clusters provisionnés.

## 2. Explication claire : quand choisir quoi
Amazon Redshift étend les requêtes SQL au-delà du stockage local du cluster :

1. Amazon Redshift Spectrum :
- Exécute des requêtes SQL directement sur des pétaoctets de données sur Amazon S3 sans aucun chargement préalable.
- S'appuie sur des milliers de nœuds de calcul managés indépendants pour projeter et filtrer les données S3 avant de transmettre les lignes utiles au cluster Redshift.
- Schéma Lakehouse : données chaudes et fréquentes sur le stockage local Redshift, historique froid sur S3.
- Utilise l'AWS Glue Data Catalog comme schéma externe (\`CREATE EXTERNAL SCHEMA\`).

2. Redshift Data Sharing :
- Partage instantané de données en lecture seule entre différents clusters Redshift (même compte, comptes distincts ou multi-régions) sans duplication physique.
- Isolation totale des charges : les requêtes du consommateur consomment ses propres ressources de calcul sans impacter le producteur.

3. Aurora Zero-ETL vers Redshift (Nouveauté majeure) :
- Réplication automatique quasi temps réel des transactions de bases Amazon Aurora MySQL ou PostgreSQL vers Redshift sans concevoir de pipelines ETL manuels.
- Les données transactionnelles sont prêtes pour l'analytique décisionnelle en quelques secondes.

## 3. Définitions des termes clés
- Schéma externe : structure Redshift pointant vers une base de métadonnées AWS Glue pour lire des fichiers S3.
- Datashare : objet de partage Redshift encapsulant des schémas, tables ou vues autorisés pour d'autres clusters.
- Zero-ETL : intégration native synchronisant les écritures opérationnelles directement vers l'entrepôt.

## 4. Exemple concret
Création d'un schéma Redshift Spectrum et requête conjointe :
\`\`\`sql
CREATE EXTERNAL SCHEMA lake_extern
FROM DATA CATALOG DATABASE 'glue_raw_db'
IAM_ROLE 'arn:aws:iam::123456789012:role/RedshiftSpectrumRole';

SELECT v.id_vente, v.montant, h.details
FROM ventes_locales v
JOIN lake_extern.historique_s3 h ON v.id_vente = h.id_vente
WHERE v.date_vente = CURRENT_DATE;
\`\`\`

## 5. Comparaisons et pièges d'examen
- Spectrum vs Athena : Spectrum exige un cluster Redshift actif et convient aux requêtes combinant tables locales et données S3 ; Athena est entièrement sans serveur sans infrastructure permanente.
- Tarification Spectrum : facturé 5 USD par To de données S3 scannées, exactement comme Athena.
- Data Sharing sans copie : aucune donnée n'est dupliquée, garantissant une cohérence immédiate des lectures.

## 6. Lien avec SQL, Snowflake et Databricks
Redshift Spectrum équivaut aux External Tables dans Snowflake. Redshift Data Sharing correspond trait pour trait au Snowflake Secure Data Sharing et à Delta Sharing de Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 96 à 115.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Un analyste doit joindre une table de dimension locale stockée sur Redshift avec un historique de 50 To au format Parquet stocké sur Amazon S3 sans charger les données. Quelle solution choisir ?
   - A) Utiliser Redshift Spectrum avec un schéma externe pointant vers AWS Glue Data Catalog (Bonne réponse).
   - B) Exécuter une commande COPY pour charger les 50 To sur le cluster.
   - C) Transférer les données locales vers DynamoDB.
   - D) Utiliser AWS DataSync en temps réel.
2. Quelle technologie permet de répliquer automatiquement des données transactionnelles d'une base Amazon Aurora vers Amazon Redshift en quasi temps réel sans coder de pipeline ETL ?
   - A) L'intégration Aurora Zero-ETL vers Redshift (Bonne réponse).
   - B) Un déclencheur SNS avec email.
   - C) La commande VACUUM FULL.
   - D) Une tâche cron sur instance EC2.
`;

// 7. dea-18
const dea18 = `# Chapitre 18 : Modélisation NoSQL Haute Performance avec Amazon DynamoDB

## 1. Objectifs d'apprentissage
- Comprendre le modèle de données clé-valeur et document d'Amazon DynamoDB.
- Maîtriser les clés primaires simples (Partition Key) et composites (Partition + Sort Key).
- Différencier les index secondaires GSI et LSI.
- Utiliser DynamoDB Streams pour alimenter des architectures réactives et des Data Lakes.

## 2. Explication claire : quand choisir quoi
Amazon DynamoDB est une base NoSQL entièrement gérée offrant des latences sous les 10 ms à n'importe quelle échelle :

1. Clés primaires DynamoDB :
- Clé de partition simple (Partition Key / HASH) : hachage interne déterminant la partition physique. Requêtes d'accès direct par valeur exacte.
- Clé primaire composite (Partition Key + Sort Key / RANGE) : permet de stocker plusieurs éléments sous une même partition et d'effectuer des recherches par plage (\`begins_with\`, \`between\`, \`>\`, \`<\`).

2. Index secondaires :
- GSI (Global Secondary Index) :
  - Clé de partition et de tri différentes de la table de base.
  - Peut être créé ou supprimé à tout moment.
  - Écritures asynchrones avec cohérence éventuelle (eventual consistency).
- LSI (Local Secondary Index) :
  - Même clé de partition que la table de base, mais clé de tri différente.
  - Doit obligatoirement être créé lors de la création de la table.
  - Supporte la cohérence forte (strong consistency).

3. Modes de capacité :
- Mode On-Demand : mise à l'échelle automatique instantanée sans prévision de trafic, facturation à la requête lue/écrite.
- Mode Provisionné : réservation de RCU et WCU avec auto-scaling pour les charges stables et prévisibles.

4. DynamoDB Streams :
- Journal ordonné capturant chaque modification d'élément (INSERT, MODIFY, REMOVE) avec rétention de 24 heures.
- Déclenche des fonctions AWS Lambda ou alimente Kinesis/Firehose vers Amazon S3.

## 3. Définitions des termes clés
- RCU (Read Capacity Unit) : une lecture fortement cohérente par seconde pour un élément jusqu'à 4 Ko.
- WCU (Write Capacity Unit) : une écriture par seconde pour un élément jusqu'à 1 Ko.
- Hot Partition : saturation d'une partition physique due à une mauvaise cardinalité de clé de partition.

## 4. Exemple concret
Structure composite pour les commandes clients :
\`\`\`
Table : Commandes
- Partition Key : id_client (ex. "CLI-102")
- Sort Key : date_commande (ex. "2026-10-31T14:00:00Z")
Permet de récupérer instantanément toutes les commandes d'un client sur une période donnée.
\`\`\`

## 5. Comparaisons et pièges d'examen
- Scan vs Query : \`Query\` recherche par clé primaire ou index et est très véloce ; \`Scan\` parcourt l'intégralité de la table, consomme tous les RCU et doit être proscrit en production.
- Cohérence des lectures : par défaut, les lectures sont à cohérence éventuelle (coût 0,5 RCU) ; la cohérence forte consomme 1 RCU complet.
- LSI vs GSI : impossible d'ajouter un LSI après la création de la table ; les GSI sont ajoutés à chaud.

## 6. Lien avec SQL, Snowflake et Databricks
DynamoDB Streams couplé à Kinesis Firehose déverse en continu les événements opérationnels vers un Data Lake S3, où Snowflake ou Databricks les ingèrent pour analyse.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 116 à 135.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quelle opération DynamoDB est la plus efficace pour récupérer les enregistrements d'un utilisateur spécifique ordonnés par date sans saturer les RCU ?
   - A) L'opération Query sur une table avec clé composite (Partition Key + Sort Key) (Bonne réponse).
   - B) L'opération Scan avec filtre client.
   - C) La création d'un bucket S3 Tables.
   - D) L'activation d'AWS DataSync.
2. Quelle est la principale contrainte technique d'un index secondaire local (LSI) dans Amazon DynamoDB ?
   - A) Il doit obligatoirement être défini lors de la création de la table (Bonne réponse).
   - B) Il ne fonctionne qu'avec des nombres entiers.
   - C) Il impose le mode de capacité On-Demand.
   - D) Il ne peut pas dépasser 1 Ko au total.
`;

// 8. dea-25
const dea25 = `# Chapitre 25 : FinOps et Optimisation des Coûts et Performances Data

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
\`\`\`python
# Timeout réduit à 30 minutes et exécution auto-scalable
job.init("job_finops", {
    "NumberOfWorkers": 4,
    "WorkerType": "G.1X",
    "Timeout": 30
})
\`\`\`

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
`;

// 9. dea-31
const dea31 = `# Chapitre 31 : Chiffrement des Données avec AWS KMS et Clés S3 Bucket

## 1. Objectifs d'apprentissage
- Différencier les mécanismes de chiffrement côté serveur : SSE-S3, SSE-KMS, SSE-C et client (CSE).
- Comprendre le fonctionnement des Clés KMS gérées par AWS et gérées par le client (CMK).
- Activer les Bucket Keys Amazon S3 pour réduire drastiquement les coûts KMS.
- Sécuriser les pipelines de données avec chiffrement en transit (TLS 1.2+).

## 2. Explication claire : quand choisir quoi
La sécurité des données au repos et en transit est un socle essentiel du Data Lake d'entreprise :

1. Options de chiffrement au repos Amazon S3 :
- SSE-S3 :
  - Chiffrement géré par AWS avec clé AES-256 sans surcoût.
  - Option par défaut sur tous les nouveaux buckets S3.
- SSE-KMS :
  - Chiffrement géré dans AWS KMS.
  - Offre un contrôle d'accès strict par politique de clé (Key Policy), une rotation automatique annuelle et une traçabilité d'audit complète dans CloudTrail.
  - Idéal pour la conformité réglementaire (RGPD, HIPAA).
- SSE-C :
  - Le client fournit et gère sa propre clé lors de chaque appel API HTTP. AWS ne stocke jamais la clé.
- Chiffrement côté client (CSE) :
  - Les données sont chiffrées localement par l'application avant envoi sur le réseau vers S3.

2. Amazon S3 Bucket Keys :
- Problème résolu : sans Bucket Key, chaque lecture de fichier Parquet par Athena ou EMR appelle KMS, générant des millions de requêtes facturées.
- Fonctionnement : génère une clé intermédiaire éphémère au niveau du bucket pour signer les opérations répétées.
- Bénéfice : réduit jusqu'à 99 % les coûts et les appels d'API vers KMS.

## 3. Définitions des termes clés
- CMK (Customer Managed Key) : clé cryptographique créée et administrée par le client dans KMS.
- Envelope Encryption : pratique consistant à chiffrer les données avec une clé de données (Data Key), elle-même chiffrée par une clé racine (KMS Key).
- Key Policy : document de politique IAM attaché à la clé KMS contrôlant qui a le droit de l'utiliser.

## 4. Exemple concret
Politique de bucket S3 imposant le chiffrement SSE-KMS :
\`\`\`json
{
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:PutObject",
  "Resource": "arn:aws:s3:::mon-lake-securise/*",
  "Condition": {
    "StringNotEquals": {
      "s3:x-amz-server-side-encryption": "aws:kms"
    }
  }
}
\`\`\`

## 5. Comparaisons et pièges d'examen
- Erreur d'accès KMS : un utilisateur ayant les droits complets sur S3 mais sans droit \`kms:Decrypt\` sur la clé KMS associée recevra une erreur HTTP 403 Access Denied.
- Débit KMS et limitation (Throttling) : les requêtes analytiques massives peuvent saturer le quota d'API KMS sans Bucket Keys. L'activation des S3 Bucket Keys élimine ce goulot.

## 6. Lien avec SQL, Snowflake et Databricks
Snowflake et Databricks utilisent le chiffrement enveloppe avec clés gérées ou Customer-Managed Keys (Tri-Secret Secure dans Snowflake).

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 261 à 275.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Un pipeline analytique Athena lisant des millions d'objets Parquet chiffrés avec SSE-KMS génère des coûts KMS exorbitants. Quelle configuration réduit ces frais jusqu'à 99 % ?
   - A) L'activation des Amazon S3 Bucket Keys sur le compartiment (Bonne réponse).
   - B) La désactivation du versioning S3.
   - C) Le passage au chiffrement SSE-C sans clé.
   - D) L'affectation d'un LSI à la table.
2. Un ingénieur dispose de permissions S3 complètes mais ne peut pas lire des fichiers déposés dans un compartiment chiffré. Quelle autorisation IAM/KMS manque-t-il ?
   - A) L'action kms:Decrypt dans la politique de la clé KMS (Bonne réponse).
   - B) L'action s3:ListAllMyBuckets.
   - C) Le droit d'écrire dans CloudTrail.
   - D) L'autorisation de créer un VPC.
`;

// 10. dea-32
const dea32 = `# Chapitre 32 : Sécurité Réseau, Amazon VPC et Points de Terminaison VPC PrivateLink

## 1. Objectifs d'apprentissage
- Sécuriser les flux de données au sein d'un Amazon VPC privé.
- Différencier les points de terminaison VPC : Gateway Endpoints vs Interface Endpoints (PrivateLink).
- Maîtriser le routage et le filtrage (Security Groups, NACL).
- Éliminer l'exposition des pipelines de données à Internet public.

## 2. Explication claire : quand choisir quoi
Un Data Lake sécurisé isole le trafic au sein du réseau privé virtuel sans exposition à Internet public :

1. Points de terminaison VPC (VPC Endpoints) :
- Gateway Endpoints :
  - Supportés exclusivement pour deux services : **Amazon S3** et **Amazon DynamoDB**.
  - S'intègrent directement dans la table de routage du VPC.
  - Entièrement gratuits : aucun coût horaire ni frais de transfert de données.
  - Ne permettent pas l'accès depuis des réseaux sur site via Direct Connect ou VPN.
- Interface Endpoints (AWS PrivateLink) :
  - Créent une interface réseau élastique (ENI) avec une adresse IP privée locale dans votre sous-réseau.
  - Supportés pour la majorité des services AWS (Kinesis, Glue, Redshift, Athena, Secrets Manager).
  - Facturés à l'heure d'exécution et au volume de données transféré.
  - Accessibles depuis des réseaux d'entreprise sur site via AWS Direct Connect ou AWS VPN.

2. Politiques de points de terminaison (Endpoint Policies) :
- Documents JSON attachés au point de terminaison limitant quelles ressources externes peuvent être atteintes.
- Exemple : restreindre le Gateway Endpoint S3 pour qu'il autorise uniquement les écritures vers le bucket Data Lake officiel de l'entreprise, empêchant la fuite de données vers des comptes tiers.

## 3. Définitions des termes clés
- PrivateLink : technologie établissant des connexions privées entre VPC et services AWS sans passer par Internet.
- ENI (Elastic Network Interface) : carte réseau virtuelle attachée à un sous-réseau VPC disposant d'une IP privée.
- Gateway Endpoint : cible de routage VPC gratuite vers S3 et DynamoDB.

## 4. Exemple concret
Table de routage VPC avec Gateway Endpoint S3 :
\`\`\`
Destination       | Cible
10.0.0.0/16       | local
pl-63a5400a (S3)  | vpce-0a1b2c3d4e5f (Gateway Endpoint)
\`\`\`

## 5. Comparaisons et pièges d'examen
- Gateway Endpoint vs Interface Endpoint pour S3 : privilégier le Gateway Endpoint pour les accès au sein du VPC en raison de sa gratuité totale ; choisir l'Interface Endpoint si des serveurs sur site doivent accéder au bucket S3 via Direct Connect.
- NAT Gateway vs VPC Endpoint : utiliser un VPC Endpoint pour accéder aux services AWS plutôt qu'une passerelle NAT évite les coûts de traitement NAT et améliore la sécurité.

## 6. Lien avec SQL, Snowflake et Databricks
Snowflake Business Critical utilise AWS PrivateLink pour que les requêtes et transferts entre le VPC de l'entreprise et les serveurs Snowflake restent confinés sur le réseau privé AWS.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 286 à 300.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Quelle solution gratuite permet à des instances EC2 situées dans un sous-réseau privé d'accéder à un compartiment S3 sans passer par Internet ni configurer de passerelle NAT ?
   - A) Un VPC Gateway Endpoint configuré dans la table de routage (Bonne réponse).
   - B) Une passerelle Internet (IGW).
   - C) Un VPC Peering public.
   - D) Une instance EC2 bastion.
2. Une entreprise doit permettre à ses serveurs sur site d'accéder à Amazon S3 via une liaison AWS Direct Connect privée. Quel type de point de terminaison est requis ?
   - A) Un VPC Interface Endpoint (AWS PrivateLink) pour S3 (Bonne réponse).
   - B) Un VPC Gateway Endpoint pour S3.
   - C) Un connecteur AWS Snowball.
   - D) Une règle de routage NAT statique.
`;

const chapters = [
  { file: 'dea-05-spark-emr-serverless.md', content: dea05 },
  { file: 'dea-13-apache-iceberg-s3-tables.md', content: dea13 },
  { file: 'dea-14-partitionnement-formats-optimisation.md', content: dea14 },
  { file: 'dea-15-redshift-architecture-distribution.md', content: dea15 },
  { file: 'dea-16-redshift-cles-tri-performances.md', content: dea16 },
  { file: 'dea-17-redshift-spectrum-data-sharing.md', content: dea17 },
  { file: 'dea-18-dynamodb-modelisation-data.md', content: dea18 },
  { file: 'dea-25-optimisation-couts-performance-data.md', content: dea25 },
  { file: 'dea-31-kms-chiffrement-donnees.md', content: dea31 },
  { file: 'dea-32-securite-reseau-vpc-privatelink.md', content: dea32 },
];

for (const ch of chapters) {
  const p = path.join(CHAPTERS_DIR, ch.file);
  const text = clean(ch.content.trim()) + '\n';
  fs.writeFileSync(p, text, 'utf8');
  const count = (text.replace(/^---[\s\S]*?---/, '').trim().match(/[\w\u00C0-\u017F'-]+/g) || []).length;
  console.log(`Updated ${ch.file}: ${count} words`);
}
