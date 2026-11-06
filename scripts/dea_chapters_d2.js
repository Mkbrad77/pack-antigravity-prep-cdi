export const deaChaptersD2 = [
  {
    file: 'dea-12-s3-data-lake-architecture.md',
    title: 'Architecture Data Lake Moderne sur Amazon S3 et Cycle de Vie',
    content: `# Chapitre 12 : Architecture Data Lake Moderne sur Amazon S3 et Cycle de Vie

## 1. Objectifs d'apprentissage
- Concevoir une architecture Data Lake à 3 couches (Raw, Cleaned, Curated) sur Amazon S3.
- Maîtriser les classes de stockage S3 et leurs politiques d'optimisation financière.
- Comprendre la réplication multi-régions (CRR) et les mécanismes de versioning.
- Optimiser les performances de requêtage S3 (préfixes aléatoires, parallélisme).

## 2. Explication claire : quand choisir quoi
Amazon S3 est le fondement incontournable du stockage objet dans le Cloud AWS, offrant une durabilité native de 99,999999999 % (11 neufs) :

Architecture multi-couches recommandée (Architecture Médaillon) :
1. Couche Brute (Raw / Bronze) :
   - Reçoit les données sources telles quelles (fichiers JSON, CSV, logs, flux Kinesis).
   - Données immuables, jamais écrasées, servant de source de vérité pour les retraitements historiques.
2. Couche Nettoyée (Cleaned / Silver) :
   - Données filtrées, dédupliquées, schématisées et converties en formats colonnaires (Apache Parquet).
   - Utilisée pour l'exploration analytique et les jointures inter-domaines.
3. Couche Métier (Curated / Gold) :
   - Tables agrégées et modélisées (schémas en étoile ou tables larges dénormalisées).
   - Destinée aux rapports décisionnels, tableaux de bord QuickSight et algorithmes de Machine Learning.

Optimisation du stockage par cycle de vie :
- S3 Standard : pour les couches Silver et Gold actives et les données de moins de 30 jours.
- S3 Standard-IA : pour les données brutes consultées occasionnellement après 30 jours.
- S3 Glacier Flexible Retrieval / Deep Archive : pour l'archivage légal ou fiscal à long terme (1 à 10 ans) avec des coûts dérisoires mais des délais de récupération de plusieurs minutes à 12 heures.
- S3 Intelligent-Tiering : obligatoire pour les jeux de données aux motifs d'accès inconnus ou changeants, sans risque de frais de récupération.

## 3. Définitions des termes clés
- S3 Versioning : conservation de plusieurs versions d'un même objet pour se prémunir contre les suppressions et écrasements accidentels.
- CRR (Cross-Region Replication) : réplication asynchrone automatique d'objets vers un bucket situé dans une autre région AWS pour la reprise après sinistre.
- S3 Object Lock : conformité WORM (Write Once, Read Many) empêchant toute suppression ou écrasement d'objet pendant une durée définie.

## 4. Exemple concret
Règle de cycle de vie S3 typique pour un Data Lake :
\`\`\`
[Objet créé dans s3://data-lake-raw/]
       |
       |-- (Après 30 jours) --> Bascule automatique vers S3 Standard-IA
       |
       |-- (Après 90 jours) --> Transition vers S3 Glacier Flexible Retrieval
       |
       |-- (Après 365 jours) -> Transition vers S3 Glacier Deep Archive
       |
       |-- (Après 2555 jours / 7 ans) -> Suppression définitive de l'objet
\`\`\`

## 5. Comparaisons et pièges d'examen
- S3 Versioning et CRR : pour activer la réplication multi-régions (CRR), le versioning DOIT obligatoirement être activé sur le bucket source ET sur le bucket cible.
- Frais de transition et de taille minimale : les classes S3 Glacier et Standard-IA imposent une durée minimale de rétention facturée (90 jours pour Glacier, 180 jours pour Deep Archive) et une taille minimale d'objet facturée (128 Ko). Ne jamais transitionner de très petits fichiers (< 128 Ko) fréquemment modifiés vers Glacier.
- Performance S3 : pour dépasser les quotas de débit par préfixe (3 500 requêtes PUT/POST/DELETE/s et 5 500 requêtes GET/s), il faut répartir les écritures sur plusieurs préfixes distincts.

## 6. Lien avec SQL, Snowflake et Databricks
Cette architecture sur S3 est directement transposable aux architectures Médaillon (Bronze, Silver, Gold) promues par Databricks et aux External Stages configurés dans Snowflake avec Storage Integrations sécurisées.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 25 à 53.
- Voir aussi : cours Nikolai Schuler, leçons 56 à 71.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quelle configuration est techniquement requise sur les compartiments Amazon S3 source et cible pour activer la réplication entre régions (CRR) ?
   - A) Le versioning doit être activé sur les deux compartiments (Bonne réponse).
   - B) Le chiffrement SSE-C doit être utilisé.
   - C) Les compartiments doivent porter exactement le même nom.
   - D) S3 Transfer Acceleration doit être configuré.
2. Une entreprise stocke des millions de petits fichiers JSON de 10 Ko sur S3 et souhaite réduire ses coûts d'archivage. Pourquoi est-il déconseillé de créer une règle de cycle de vie vers S3 Glacier pour ces fichiers ?
   - A) Chaque objet sera facturé pour une taille minimale de 128 Ko avec des frais de métadonnées supplémentaires (Bonne réponse).
   - B) Glacier refuse techniquement les fichiers inférieurs à 1 Mo.
   - C) Le format JSON ne peut pas être lu depuis Glacier.
   - D) Les fichiers de moins de 128 Ko sont automatiquement supprimés lors du transfert.
`
  },
  {
    file: 'dea-13-apache-iceberg-s3-tables.md',
    title: 'Formats de Tables Ouverts : Apache Iceberg et Amazon S3 Tables',
    content: `# Chapitre 13 : Formats de Tables Ouverts : Apache Iceberg et Amazon S3 Tables

## 1. Objectifs d'apprentissage
- Comprendre les principes du format de table ouvert Apache Iceberg (transactions ACID, time travel).
- Maîtriser le partitionnement caché (hidden partitioning) et l'évolution de schéma.
- Découvrir Amazon S3 Tables et sa gestion automatisée de maintenance et de compaction (nouveauté DEA-C01 v1.1).
- Intégrer Iceberg avec AWS Glue Data Catalog, Amazon Athena, EMR et Amazon Redshift.

## 2. Explication claire : quand choisir quoi
Les architectures Data Lake classiques basées sur de simples fichiers Parquet souffrent de limites majeures : manque de transactions ACID, lenteurs de listage des partitions et risque de lectures incohérentes pendant les écritures. Apache Iceberg et Amazon S3 Tables révolutionnent cette approche :

1. Apache Iceberg :
- Qu'est-ce que c'est : un format de table ouvert et performant conçu pour les Data Lakes massifs.
- Transactions ACID complètes : garantit que les lectures et écritures concurrentes ne se parasitent jamais (isolation par snapshot). Les insertions, mises à jour (UPDATE) et suppressions (DELETE) sont gérées proprement.
- Partitionnement caché (Hidden Partitioning) : l'utilisateur n'a plus besoin d'ajouter manuellement les colonnes de partition dans sa clause SQL \`WHERE\` (ex. \`year(date_event)\`). Iceberg traduit automatiquement la requête pour ne scanner que les partitions physiques nécessaires.
- Évolution de schéma et de partitionnement : vous pouvez renommer, ajouter ou supprimer des colonnes sans réécrire les fichiers de données historiques sous-jacents.
- Voyage dans le temps (Time Travel) : permet d'interroger la table telle qu'elle existait à un instant T passé ou à un identifiant de snapshot précis (idéal pour les audits et le débogage).

2. Amazon S3 Tables (Nouveauté majeure DEA-C01 v1.1) :
- Qu'est-ce que c'est : le premier stockage d'objets cloud nativement conçu pour les tables analytiques au format Apache Iceberg.
- Avantages décisifs :
  - Fournit jusqu'à 3 fois les performances de requêtage par rapport à un bucket S3 standard grâce à l'optimisation des requêtes de métadonnées.
  - Compaction continue automatisée : fusionne automatiquement les petits fichiers Parquet créés par les flux d'ingestion en gros fichiers optimisés, sans nécessiter de jobs Glue d'optimisation manuels.
  - Gestion automatique des snapshots : purge automatique des anciens snapshots et fichiers orphelins pour réduire les coûts de stockage.

## 3. Définitions des termes clés
- Snapshot Iceberg : vue immuable de l'état de la table à un instant donné, référençant l'ensemble des fichiers de données actifs.
- Manifest List : fichier de métadonnées répertoriant tous les fichiers manifestes constituant un snapshot.
- Compaction : processus de regroupement et réécriture de multiples petits fichiers de données en fichiers de taille optimale (souvent 128 Mo à 512 Mo) pour accélérer les scans.

## 4. Exemple concret
Requête SQL Athena sur table Iceberg avec Time Travel :
\`\`\`sql
-- Interrogation de la table telle qu'elle existait le 20 octobre 2026
SELECT code_client, solde_compte
FROM db_finance.comptes_clients
FOR SYSTEM_TIME AS OF TIMESTAMP '2026-10-20 12:00:00 UTC'
WHERE code_client = 'CL-98745';
\`\`\`

## 5. Comparaisons et pièges d'examen
- Apache Iceberg vs Hive Format classique : le format Hive traditionnel nécessite l'exploration récursive des répertoires S3 pour chaque requête et ne supporte pas les transactions ACID ; Iceberg lit directement l'arborescence des fichiers de métadonnées, rendant les scans quasi instantanés.
- Problème des petits fichiers (Small Files Problem) : lors de l'ingestion en streaming dans Iceberg, des milliers de micro-fichiers sont créés chaque minute. Sans Amazon S3 Tables ou sans exécution régulière de la commande \`OPTIMIZE / VACUUM\`, les performances d'Athena et d'EMR s'effondrent rapidement.
- Prise en charge des moteurs : Iceberg est un format universel supporté nativement par Athena, AWS Glue, Amazon EMR, Amazon Redshift Spectrum, mais aussi Snowflake et Databricks.

## 6. Lien avec SQL, Snowflake et Databricks
Apache Iceberg est l'équivalent direct du format Delta Lake de Databricks. De plus, Snowflake prend en charge nativement les tables gérées Iceberg (Iceberg Tables avec stockage sur votre propre bucket S3), permettant un partage universel sans duplication de données.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 154 et 155.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quel bénéfice clé offre le partitionnement caché (Hidden Partitioning) dans Apache Iceberg par rapport aux tables Hive classiques sur Amazon S3 ?
   - A) Les requêtes SQL filtrent automatiquement les données sans que l'utilisateur n'ait à manipuler des colonnes de partition artificielles dans la clause WHERE (Bonne réponse).
   - B) Les fichiers de données sont obligatoirement chiffrés avec une clé asymétrique.
   - C) La table ne peut plus être modifiée une fois créée.
   - D) Les métadonnées sont supprimées après chaque écriture.
2. Quelle fonctionnalité fournie par Amazon S3 Tables élimine la dégradation des performances de requêtage liée aux ingestions fréquentes en continu ?
   - A) La compaction automatique des petits fichiers en arrière-plan sans maintenance manuelle (Bonne réponse).
   - B) L'interdiction d'utiliser le format Apache Iceberg.
   - C) La conversion obligatoire des données en fichiers texte CSV.
   - D) L'obligation de redémarrer le cluster Redshift chaque nuit.
`
  },
  {
    file: 'dea-14-partitionnement-formats-optimisation.md',
    title: 'Formats de Fichiers Analytiques et Stratégies de Partitionnement',
    content: `# Chapitre 14 : Formats de Fichiers Analytiques et Stratégies de Partitionnement

## 1. Objectifs d'apprentissage
- Comparer les formats orientés colonnes (Apache Parquet, ORC) et orientés lignes (CSV, JSON, Avro).
- Comprendre les mécanismes d'élagage de partitions (Partition Pruning) et de projection de colonnes.
- Maîtriser le partitionnement (Partitioning) et le découpage par seau (Bucketing).
- Choisir les bons algorithmes de compression (Snappy, GZIP, ZSTD, BZIP2) selon le ratio vitesse/taille.

## 2. Explication claire : quand choisir quoi
Le choix du format de fichier et de la structure de répertoires conditionne directement les performances de requêtage et les coûts de transfert I/O dans AWS :

1. Formats de stockage :
- Formats orientés colonnes (Apache Parquet, Apache ORC) :
  - Idéaux pour l'analytique décisionnelle (OLAP), Athena, Redshift Spectrum et Spark.
  - Projection de colonnes (Column Projection) : si une table compte 100 colonnes et que la requête ne demande que \`SELECT nom, chiffre_affaires\`, seules les deux colonnes ciblées sont lues depuis S3. Les 98 autres ne sont jamais transférées.
  - Statistiques intégrées (Min/Max, Bloom filters) dans les métadonnées de fichier permettant d'ignorer des blocs entiers de données (Data Skipping).
- Formats orientés lignes (Apache Avro, CSV, JSON) :
  - Apache Avro : format binaire avec schéma JSON rigide, idéal pour l'ingestion de flux de streaming (Kafka, Kinesis) car les écritures ligne par ligne sont ultra-rapides.
  - CSV / JSON : formats textuels universels mais verbeux, non compressibles nativement sans perte de parallélisme (sauf avec indexation), réservés à l'ingestion brute.

2. Partitionnement vs Bucketing :
- Partitionnement :
  - Divise les données dans des dossiers S3 distincts selon les valeurs d'une ou plusieurs colonnes (ex. \`annee=2026/pays=FR/\`).
  - Élagage de partitions (Partition Pruning) : les requêtes filtrant sur l'année et le pays ne lisent que le sous-dossier concerné.
  - Règle d'or : ne partitionnez que sur des colonnes à cardinalité modérée (dates, pays, régions). Partitionner sur une clé à forte cardinalité (ex. ID client avec 10 millions de valeurs) crée des millions de dossiers contenant des micro-fichiers, ruinant les performances.
- Bucketing (Découpage par seau) :
  - Distribue les enregistrements dans un nombre fixe de fichiers (buckets) basé sur une fonction de hachage d'une colonne (ex. \`bucket_id = hash(id_client) % 32\`).
  - Idéal pour accélérer les jointures lourdes entre deux grandes tables partitionnées sur la même clé, car Spark ou Athena n'associent que les buckets de même numéro sans shuffle réseau.

3. Algorithmes de compression :
- Snappy : compression par défaut de Parquet, excellent compromis entre vitesse de décompression et ratio de taille.
- GZIP : très bon taux de compression mais non splittable (sauf si Parquet encapsule les blocs compressés).
- ZSTD : standard moderne offrant un ratio de compression supérieur à Snappy tout en restant extrêmement rapide.

## 3. Définitions des termes clés
- Column Projection : capacité du moteur de requête à ne lire que les colonnes nécessaires.
- Predicate Pushdown : évaluation des filtres (\`WHERE\`) au niveau le plus bas du stockage pour éliminer les blocs avant transfert en mémoire.
- Splittable Compression : format de compression permettant à Spark ou EMR de diviser un gros fichier compressé en plusieurs tâches exécutées en parallèle.

## 4. Exemple concret
Structure d'un Data Lake partitionné et converti en Parquet compressé Snappy :
\`\`\`
s3://mon-datalake-curated/ventes/
  ├── annee=2026/
  │    ├── mois=10/
  │    │    ├── part-00000-c000.snappy.parquet (Contient min_id=1, max_id=50000)
  │    │    └── part-00001-c000.snappy.parquet (Contient min_id=50001, max_id=100000)
\`\`\`

## 5. Comparaisons et pièges d'examen
- Parquet vs CSV : pour une requête analytique typique sous Athena, Parquet réduit la quantité de données numérisées de 80 à 90 % par rapport à CSV, diminuant la facture d'autant.
- Sur-partitionnement (Over-partitioning) : piège fréquent d'architecture consistant à créer trop de niveaux de partitions (ex. \`annee/mois/jour/heure/minute/client_id\`), ce qui génère des millions de fichiers de quelques kilo-octets et sature le catalogue Glue.

## 6. Lien avec SQL, Snowflake et Databricks
Snowflake et Databricks utilisent tous deux des variantes internes de formats colonnaires compressés (fichiers FDM propriétaires dans Snowflake, Apache Parquet dans Delta Lake). La maîtrise du Pruning et du Data Skipping est transversale à tous ces outils.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 11 et 153.
- Voir aussi : cours Nikolai Schuler, leçons 32, 54 et 55.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quel format de fichier est le plus performant pour stocker des données volumineuses destinées à des requêtes analytiques décisionnelles complexes avec Amazon Athena ?
   - A) Apache Parquet avec compression Snappy (Bonne réponse).
   - B) Fichiers CSV bruts non compressés.
   - C) Documents JSON indentés.
   - D) Fichiers XML hiérarchiques.
2. Pourquoi est-il déconseillé de choisir un identifiant client unique (10 millions de clients) comme clé de partitionnement pour des dossiers Amazon S3 ?
   - A) Cela génère un sur-partitionnement avec des millions de micro-fichiers, dégradant les temps de scan et surchargeant le catalogue (Bonne réponse).
   - B) Amazon S3 refuse de créer plus de 1 000 dossiers.
   - C) Le format Parquet interdit l'utilisation d'identifiants numériques.
   - D) Le catalogue Glue ne supporte que les dates comme clés de partition.
`
  },
  {
    file: 'dea-15-redshift-architecture-distribution.md',
    title: 'Architecture Amazon Redshift et Styles de Distribution des Tables',
    content: `# Chapitre 15 : Architecture Amazon Redshift et Styles de Distribution des Tables

## 1. Objectifs d'apprentissage
- Comprendre l'architecture MPP d'Amazon Redshift (Leader Node, Compute Nodes, Slices).
- Maîtriser les 4 styles de distribution de tables (AUTO, KEY, EVEN, ALL).
- Concevoir des schémas de distribution éliminant le shuffle réseau lors des jointures volumineuses.
- Connaître les familles de nœuds Redshift (RA3 avec stockage managé séparé).

## 2. Explication claire : quand choisir quoi
Amazon Redshift est un entrepôt de données décisionnel (Data Warehouse) relationnel hautement distribué reposant sur une architecture de traitement massivement parallèle (MPP) et un stockage colonnaire :

Architecture du cluster Redshift :
1. Nœud Leader (Leader Node) :
   - Reçoit les connexions clients SQL (JDBC/ODBC), analyse et analyse syntaxiquement les requêtes, génère le plan d'exécution optimisé et coordonne le travail des nœuds de calcul.
   - Ne facture pas de coût additionnel : inclus dans le cluster.
2. Nœuds de calcul (Compute Nodes) :
   - Exécutent le calcul réel des requêtes et stockent les données.
   - Chaque nœud est divisé en tranches de calcul indépendantes appelées **Slices** (généralement 2, 4 ou plus par nœud selon la taille de l'instance).
   - Nœuds RA3 modernes : séparent totalement le calcul du stockage. Les données sont persistées sur le stockage managé Redshift (RMS reposant sur S3) et mises en cache localement sur des disques SSD NVMe rapides.

Les 4 styles de distribution des tables (DISTSTYLE) :
Le style de distribution détermine comment les lignes d'une table sont réparties entre les différentes Slices du cluster :

1. Distribution KEY (\`DISTSTYLE KEY\`) :
   - Les lignes sont distribuées entre les slices en fonction de la valeur de hachage d'une colonne spécifique (ex. \`DISTKEY (client_id)\`).
   - Cas d'usage idéal : lorsque deux très grandes tables sont fréquemment jointes sur cette colonne. En plaçant les lignes ayant le même \`client_id\` sur la même slice physique, la jointure s'effectue en mémoire locale sans aucun déplacement réseau (zéro shuffle / redistribution).
2. Distribution ALL (\`DISTSTYLE ALL\`) :
   - Une copie intégrale de la table est dupliquée sur le premier slice de CHAQUE nœud de calcul.
   - Cas d'usage idéal : pour les petites tables de dimensions (ex. moins de 3 millions de lignes, tables de codes postaux, devises, statuts). Les jointures avec n'importe quelle table de faits sont 100 % locales.
   - Inconvénient : augmente l'empreinte de stockage disque et allonge le temps d'écriture lors des \`INSERT / UPDATE\`.
3. Distribution EVEN (\`DISTSTYLE EVEN\`) :
   - Les lignes sont distribuées de façon circulaire (round-robin) équitablement entre toutes les slices, indépendamment des valeurs contenues.
   - Cas d'usage : quand la table ne participe à aucune jointure majeure ou qu'aucune clé de jointure évidente n'émerge.
4. Distribution AUTO (\`DISTSTYLE AUTO\`) :
   - Choix par défaut de Redshift. Redshift démarre la table avec \`DISTSTYLE ALL\` quand elle est petite, puis la bascule automatiquement vers \`DISTSTYLE EVEN\` lorsqu'elle grossit (ou \`KEY\` si des motifs de jointure sont détectés).

## 3. Définitions des termes clés
- MPP (Massively Parallel Processing) : architecture où plusieurs processeurs exécutent simultanément des calculs coordonnés sur des partitions de données distinctes.
- Slice : fraction de nœud de calcul disposant de sa propre mémoire et de son propre espace de traitement.
- Collocated Join : jointure où les lignes des deux tables se trouvent déjà sur la même slice, éliminant tout transfert réseau.

## 4. Exemple concret
Déclaration SQL de tables de faits et de dimensions avec styles de distribution optimisés :
\`\`\`sql
-- Petite table dimension pays : distribution ALL
CREATE TABLE dim_pays (
    code_pays VARCHAR(3) PRIMARY KEY,
    nom_pays VARCHAR(50)
)
DISTSTYLE ALL;

-- Grande table de faits ventes : distribution KEY sur id_client
CREATE TABLE faits_ventes (
    id_vente BIGINT,
    id_client INT,
    montant DECIMAL(10,2),
    date_vente DATE
)
DISTSTYLE KEY
DISTKEY(id_client);
\`\`\`

## 5. Comparaisons et pièges d'examen
- Erreur de Data Skew (asymétrie) : si vous choisissez une \`DISTKEY\` ayant une faible cardinalité ou de nombreuses valeurs nulles (ex. 90 % des clients ont le pays 'FR'), une seule slice recevra 90 % des données, ralentissant l'ensemble du cluster. Toujours vérifier la répartition avec \`SVV_TABLE_INFO\`.
- Allouer ALL à une grande table : piège classique provoquant la saturation de l'espace disque du cluster lors des chargements massifs.

## 6. Lien avec SQL, Snowflake et Databricks
Redshift gère explicitement le placement physique des données via \`DISTKEY\`, là où Snowflake gère la micro-partitionnement de manière entièrement transparente et automatique sans nécessiter de définition manuelle de distribution.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 91 à 107.
- Voir aussi : cours Nikolai Schuler, leçons 99 à 115.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Deux tables de 200 Go chacune sont quotidiennement jointes sur la colonne \`id_compte\`. Quelle configuration de distribution élimine le shuffle réseau lors de cette jointure sous Amazon Redshift ?
   - A) Configurer les deux tables avec DISTSTYLE KEY et DISTKEY(id_compte) (Bonne réponse).
   - B) Configurer les deux tables avec DISTSTYLE ALL.
   - C) Configurer les deux tables avec DISTSTYLE EVEN.
   - D) Laisser une table en DISTSTYLE EVEN et l'autre en DISTSTYLE ALL.
2. Pour quelle catégorie de tables le style de distribution DISTSTYLE ALL est-il le plus approprié dans un entrepôt de données Amazon Redshift ?
   - A) Les petites tables de dimensions modérément modifiées de moins de 3 millions de lignes (Bonne réponse).
   - B) Les tables de faits de télémétrie de plusieurs téraoctets.
   - C) Les tables temporaires de streaming Kinesis.
   - D) Les tables stockant des fichiers binaires volumineux.
`
  },
  {
    file: 'dea-16-redshift-cles-tri-performances.md',
    title: 'Optimisation Redshift : Clés de Tri, VACUUM et Gestion de Charge WLM',
    content: `# Chapitre 16 : Optimisation Redshift : Clés de Tri, VACUUM et Gestion de Charge WLM

## 1. Objectifs d'apprentissage
- Choisir entre clés de tri composées (COMPOUND) et entrelacées (INTERLEAVED).
- Maîtriser le rôle des commandes de maintenance \`VACUUM\` et \`ANALYZE\`.
- Comprendre la gestion de charge de travail (Workload Management - WLM) automatique et manuelle.
- Configurer l'élasticité de concurrence (Concurrency Scaling) pour absorber les pics de requêtes.

## 2. Explication claire : quand choisir quoi
Dans Amazon Redshift, les performances de requêtage dépendent du tri physique des données sur disque et de la régulation de la charge concurrente :

1. Clés de tri (SORTKEY) :
Les blocs de données Redshift (de 1 Mo) stockent les métadonnées de valeurs minimales et maximales de chaque colonne dans la table système. Lors d'une requête, Redshift compare ces bornes avec la clause \`WHERE\` pour éliminer les blocs entiers non pertinents (Zone Maps) sans les lire :
- Clés de tri composées (COMPOUND SORTKEY) :
  - Clé de tri par défaut. Trie les données selon l'ordre strict des colonnes spécifiées (ex. \`SORTKEY(annee, mois, client_id)\`).
  - Extrêmement rapide lorsque les requêtes filtrent sur la première colonne du préfixe (\`annee\`), ou les premières colonnes combinées (\`annee AND mois\`).
  - Si une requête ne filtre QUE sur la deuxième ou troisième colonne sans la première (ex. filtre uniquement sur \`client_id\`), l'accélération de tri est inopérante.
- Clés de tri entrelacées (INTERLEAVED SORTKEY) :
  - Accorde un poids égal à chaque colonne mentionnée dans la clé de tri (jusqu'à 8 colonnes).
  - Idéale pour les tables d'analyse où les utilisateurs filtrent sur des combinaisons arbitraires et imprévisibles de critères (ex. filtrer parfois par produit, parfois par région, parfois par tranche d'âge).
  - Inconvénient : temps de chargement et de maintenance \`VACUUM REINDEX\` beaucoup plus longs.

2. Maintenance de la base : VACUUM et ANALYZE
- \`VACUUM\` :
  - Dans Redshift, les opérations \`DELETE\` ne libèrent pas l'espace disque immédiatement : elles marquent simplement les lignes comme supprimées. De même, les \`INSERT\` ajoutent les lignes dans une zone non triée (unsorted region).
  - \`VACUUM FULL\` réorganise physiquement les données selon la clé de tri et récupère l'espace disque des lignes supprimées.
  - \`VACUUM DELETE ONLY\` libère l'espace sans retrier.
  - \`VACUUM SORT ONLY\` trie les nouvelles données sans purger l'espace.
  - Redshift exécute désormais un VACUUM automatique en arrière-plan pendant les périodes de faible activité.
- \`ANALYZE\` :
  - Met à jour les statistiques de distribution des données utilisées par le planificateur de requêtes du nœud Leader. Exécuter impérativement après un chargement massif (\`COPY\`).

3. Workload Management (WLM) et Concurrency Scaling :
- Auto WLM : utilise l'apprentissage machine pour allouer dynamiquement la mémoire et la concurrence selon les requêtes.
- Queues de requêtes dédiées : permet d'isoler les requêtes critiques de la direction (queue prioritaire avec mémoire garantie) des requêtes lourdes d'extraction ETL.
- Concurrency Scaling : lance automatiquement des clusters Redshift secondaires éphémères en quelques secondes pour absorber les pics de charge en lecture sans ralentir les utilisateurs.

## 3. Définitions des termes clés
- Zone Maps : métadonnées en mémoire associées à chaque bloc de 1 Mo stockant la valeur minimale et maximale de chaque colonne.
- Short Query Acceleration (SQA) : algorithme faisant passer en priorité les requêtes courtes et légères devant les longues requêtes analytiques pour éviter les blocages.

## 4. Exemple concret
Optimisation d'une table avec clé de tri et commande de maintenance :
\`\`\`sql
CREATE TABLE ventes_quotidiennes (
    date_vente DATE NOT NULL,
    id_magasin INT,
    montant DECIMAL(10,2)
)
DISTSTYLE KEY
DISTKEY(id_magasin)
COMPOUND SORTKEY(date_vente, id_magasin);

-- Après ingestion massive de fin de mois :
VACUUM FULL ventes_quotidiennes;
ANALYZE ventes_quotidiennes;
\`\`\`

## 5. Comparaisons et pièges d'examen
- COMPOUND vs INTERLEAVED : si les requêtes filtrent toujours sur une date en premier, choisir COMPOUND ; si les requêtes filtrent de manière équitable sur plusieurs dimensions indépendantes, choisir INTERLEAVED.
- Oublier ANALYZE après COPY : piège classique où un cluster Redshift devient très lent après un chargement car le planificateur se base sur des statistiques obsolètes estimant que la table est vide.

## 6. Lien avec SQL, Snowflake et Databricks
La commande \`VACUUM\` de Redshift réalise le même travail de réorganisation et de purge des anciens fichiers que la commande \`VACUUM\` dans Delta Lake / Databricks ou le clustering automatique dans Snowflake.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 108 à 117.
- Voir aussi : cours Nikolai Schuler, leçons 116 à 127.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quelle commande devez-vous exécuter immédiatement après un chargement massif de 10 millions de lignes dans une table Redshift pour vous assurer que le planificateur choisisse le plan d'exécution optimal ?
   - A) ANALYZE sur la table pour mettre à jour les statistiques de distribution (Bonne réponse).
   - B) DROP TABLE en cascade.
   - C) ALTER TABLE DISABLE ROW ACCESS.
   - D) REBOOT CLUSTER en mode forcé.
2. Une table est filtrée par les utilisateurs de manière totalement imprévisible, tantôt par référence produit, tantôt par ville, tantôt par catégorie, sans hiérarchie fixe. Quel type de clé de tri est le plus adapté ?
   - A) Une clé de tri entrelacée (INTERLEAVED SORTKEY) (Bonne réponse).
   - B) Une clé de tri composée (COMPOUND SORTKEY).
   - C) La désactivation des Zone Maps.
   - D) L'absence totale de clé de tri avec format CSV.
`
  },
  {
    file: 'dea-17-redshift-spectrum-data-sharing.md',
    title: 'Architecture Hybride Redshift : Redshift Spectrum et Data Sharing',
    content: `# Chapitre 17 : Architecture Hybride Redshift : Redshift Spectrum et Data Sharing

## 1. Objectifs d'apprentissage
- Comprendre le fonctionnement d'Amazon Redshift Spectrum pour le requêtage direct de données sur S3.
- Joindre des tables locales Redshift avec des tables externes du Data Lake sans chargement préalable.
- Maîtriser Redshift Data Sharing pour partager des données entre clusters indépendants sans copie physique.
- Découvrir l'intégration de Redshift avec AWS Lake Formation.

## 2. Explication claire : quand choisir quoi
Amazon Redshift permet d'étendre la puissance d'analyse décisionnelle au-delà du stockage interne du cluster :

1. Amazon Redshift Spectrum :
- Qu'est-ce que c'est : une couche de calcul massivement parallèle sans serveur intégrée à Redshift permettant d'interroger directement des fichiers stockés sur Amazon S3 (fichiers Parquet, ORC, CSV, JSON) sans avoir à les charger au préalable via une commande \`COPY\`.
- Comment cela fonctionne :
  - Les métadonnées des tables externes sont enregistrées dans l'AWS Glue Data Catalog.
  - Lorsqu'une requête SQL est lancée, le Leader Node de Redshift distribue la charge de lecture et de filtrage à une flotte élastique de milliers de nœuds Spectrum gérés par AWS.
  - Seules les lignes filtrées et agrégées sont renvoyées aux nœuds de calcul Redshift.
- Quand le choisir :
  - Pour interroger des données historiques froides (ex. données de plus de 2 ans) conservées sur S3 tout en conservant les données chaudes de l'année en cours sur les disques locaux du cluster.
  - Pour exécuter des requêtes de jointure hybrides directes entre une table locale de clients et des pétaoctets de transactions brutes sur S3.

2. Amazon Redshift Data Sharing :
- Qu'est-ce que c'est : une fonctionnalité permettant de partager des données (tables, vues, schémas entiers) en direct entre différents clusters Redshift au sein du même compte ou entre comptes AWS différents, sans déplacer ni copier physiquement les données.
- Architecture Producer-Consumer :
  - Cluster Producteur (Producer) : crée un datashare et accorde l'accès à des objets spécifiques.
  - Cluster Consommateur (Consumer) : monte le datashare comme une base de données locale en lecture seule et exécute des requêtes instantanément.
- Avantage décisif : isolation totale de la charge de travail (Workload Isolation). L'équipe Marketing peut avoir son propre cluster Redshift pour exécuter des requêtes analytiques lourdes sans jamais consommer le CPU ou la mémoire du cluster principal de production financière.

## 3. Définitions des termes clés
- Schéma externe (External Schema) : schéma Redshift pointant vers une base de données AWS Glue Data Catalog pour référencer des tables S3.
- Datashare : entité nommée dans Redshift encapsulant les tables et vues partagées avec des clusters consommateurs.
- Workload Isolation : principe d'architecture séparant les ressources de calcul de différents départements tout en partageant une couche de données unique.

## 4. Exemple concret
Création d'un schéma externe Spectrum et requête hybride :
\`\`\`sql
-- Création du schéma externe pointant sur le catalogue Glue
CREATE EXTERNAL SCHEMA lake_ventes
FROM DATA CATALOG DATABASE 'analytics_glue_db'
IAM_ROLE 'arn:aws:iam::123456789012:role/MonRoleRedshiftSpectrum'
CREATE EXTERNAL DATABASE IF NOT EXISTS;

-- Jointure hybride entre table locale clients et table externe S3 Parquet
SELECT c.nom_client, SUM(v.montant) AS total_depense
FROM dim_clients_local c
JOIN lake_ventes.transactions_historiques_s3 v ON c.id_client = v.id_client
WHERE v.annee = 2026
GROUP BY c.nom_client;
\`\`\`

## 5. Comparaisons et pièges d'examen
- Redshift Spectrum vs Amazon Athena : Spectrum nécessite un cluster Redshift actif pour être utilisé et s'intègre dans son plan d'exécution SQL ; Athena est un outil 100 % autonome sans cluster. Si l'entreprise ne possède pas de cluster Redshift, choisir Athena.
- Coûts de Spectrum : facturé 5 USD par téraoctet de données numérisées sur S3, exactement comme Athena. D'où l'importance capitale d'utiliser Parquet et des préfixes partitionnés.
- Redshift Data Sharing vs Sauvegardes/Restaurations : Data Sharing offre un accès en direct sans aucune latence de copie de données et sans surcoût de stockage pour le consommateur.

## 6. Lien avec SQL, Snowflake et Databricks
Redshift Data Sharing est le pendant direct du Snowflake Secure Data Sharing (partage sans copie entre comptes Snowflake) et du Delta Sharing dans l'écosystème Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 103 à 106.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Deux équipes d'une même entreprise (Ventes et Finance) ont besoin d'interroger la même table de faits Redshift de 50 To. La direction exige que les requêtes lourdes de l'équipe Ventes ne ralentissent à aucun moment le cluster de la Finance, sans duplication de données. Quelle solution mettez-vous en place ?
   - A) Amazon Redshift Data Sharing entre deux clusters dédiés (Bonne réponse).
   - B) Une tâche cron exportant la table en CSV chaque heure.
   - C) La fusion des deux équipes sur un seul petit cluster sans WLM.
   - D) Une réplication physique par AWS DMS de cluster à cluster.
2. Quel composant AWS stocke la définition des métadonnées (schéma, colonnes, types) des tables Amazon S3 interrogées par Amazon Redshift Spectrum ?
   - A) L'AWS Glue Data Catalog (Bonne réponse).
   - B) Amazon DynamoDB Accelerator (DAX).
   - C) Amazon EBS gp3.
   - D) AWS CloudTrail.
`
  },
  {
    file: 'dea-18-dynamodb-modelisation-data.md',
    title: 'Modélisation NoSQL Haute Performance avec Amazon DynamoDB',
    content: `# Chapitre 18 : Modélisation NoSQL Haute Performance avec Amazon DynamoDB

## 1. Objectifs d'apprentissage
- Comprendre les clés primaires DynamoDB (Partition Key seule vs Partition Key + Sort Key).
- Différencier les index secondaires locaux (LSI) et les index secondaires globaux (GSI).
- Maîtriser les modes de capacité : Provisionné (avec Auto Scaling) vs On-Demand.
- Exploiter DynamoDB Streams pour capturer les modifications et alimenter les Data Lakes.

## 2. Explication claire : quand choisir quoi
Amazon DynamoDB est une base de données NoSQL clé-valeur et document entièrement managée, conçue pour délivrer des performances stables avec une latence inférieure à 10 millisecondes à n'importe quelle échelle :

1. Conception des clés primaires :
- Clé de partition simple (Partition Key / PK) :
  - La valeur de la PK est passée dans une fonction de hachage interne pour déterminer la partition physique où l'enregistrement est stocké.
  - Idéale pour les accès directs par identifiant unique (ex. \`user_id = 'U123'\`).
- Clé primaire composite (Partition Key + Sort Key / PK + SK) :
  - Les éléments ayant la même PK sont stockés ensemble sur la même partition physique, triés par ordre de la Sort Key.
  - Permet des requêtes de type 1-à-N avec des opérateurs de comparaison sur la SK (ex. \`PK = 'CLIENT#10' AND SK BETWEEN '2026-01-01' AND '2026-10-31'\`).

2. Index secondaires : LSI vs GSI (Point clé d'examen) :
- Index secondaire local (Local Secondary Index - LSI) :
  - Conserve la MÊME Partition Key que la table de base, mais définit une Sort Key différente.
  - Contrainte absolue : un LSI DOIT être créé lors de la création de la table. Il ne peut JAMAIS être ajouté, modifié ou supprimé a posteriori sur une table existante.
  - Partage la capacité de lecture et d'écriture provisionnée de la table de base.
  - Limite de taille de 10 Go par valeur de partition key pour l'ensemble table + LSI.
- Index secondaire global (Global Secondary Index - GSI) :
  - Peut définir une Partition Key DIFFÉRENTE et une Sort Key différente de la table de base.
  - Flexibilité totale : un GSI peut être créé, mis à jour ou supprimé à chaud à n'importe quel moment sur une table existante.
  - Possède sa propre capacité de lecture et d'écriture indépendante de la table de base. Si un GSI est sous-provisionné, les écritures sur la table de base peuvent être bloquées (throttling).

3. Modes de capacité DynamoDB :
- Mode Sur demande (On-Demand) : s'adapte instantanément aux pics de charge sans planification de capacité. Idéal pour les charges de travail imprévisibles ou les applications naissantes.
- Mode Provisionné : vous allouez un nombre d'unités de capacité de lecture (RCU) et d'écriture (WCU) fixes avec Auto Scaling. Recommandé pour les charges de travail prévisibles et stables (30 à 50 % moins cher que le mode On-Demand).

4. DynamoDB Streams :
- Journal ordonné chronologique des modifications apportées aux éléments de la table (INSERT, MODIFY, REMOVE) conservé pendant 24 heures.
- Cas d'usage Data : déclenche une fonction AWS Lambda pour répliquer en temps réel chaque modification vers un Data Lake S3 ou une base OpenSearch.

## 3. Définitions des termes clés
- RCU (Read Capacity Unit) : 1 lecture fortement cohérente par seconde pour un élément jusqu'à 4 Ko (ou 2 lectures finalement cohérentes).
- WCU (Write Capacity Unit) : 1 écriture par seconde pour un élément jusqu'à 1 Ko.
- Throttling : rejet d'une requête avec l'erreur \`ProvisionedThroughputExceededException\` lorsque le débit consommé dépasse la capacité allouée.

## 4. Exemple concret
Structure d'une table avec GSI et flux de streaming :
\`\`\`
Table : Commandes
  ├── PK : id_client (ex. "CLI-450")
  ├── SK : date_commande (ex. "2026-10-31#CMD-9988")
  └── GSI1 :
        ├── PK_GSI : statut (ex. "EN_ATTENTE_LIVRAISON")
        └── SK_GSI : date_commande

DynamoDB Streams activé -> AWS Lambda -> Conversion Parquet -> Amazon S3
\`\`\`

## 5. Comparaisons et pièges d'examen
- Scan vs Query : l'opération \`Query\` recherche efficacement des éléments partageant une PK spécifique et est très économique ; l'opération \`Scan\` parcourt l'intégralité de la table ligne par ligne, sature les RCU et doit être évitée en production.
- Règle LSI vs GSI : souvenez-vous que si la question d'examen mentionne l'ajout d'un index sur une table existante en production, la réponse est OBLIGATOIREMENT un GSI.

## 6. Lien avec SQL, Snowflake et Databricks
DynamoDB Streams est la source idéale pour alimenter en continu des tables de type CDC dans Snowflake ou Databricks via EventBridge Pipes ou AWS Glue Streaming.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 63 à 79.
- Voir aussi : cours Nikolai Schuler, leçons 80 à 98.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Vous devez ajouter un index secondaire sur une table Amazon DynamoDB existante en production afin de permettre des recherches par adresse email client. Quel type d'index devez-vous créer ?
   - A) Un index secondaire global (GSI) car il peut être ajouté à chaud après la création de la table (Bonne réponse).
   - B) Un index secondaire local (LSI).
   - C) Un index composite B-Tree relationnel.
   - D) Une réplication synchrone sur Amazon Redshift.
2. Pourquoi une écriture sur une table DynamoDB peut-elle subir un ralentissement (throttling) alors que la table de base dispose de WCU largement suffisantes ?
   - A) Un Global Secondary Index (GSI) associé est sous-provisionné en WCU et bloque la réplication asynchrone (Bonne réponse).
   - B) La table utilise le mode On-Demand.
   - C) La taille des éléments est inférieure à 1 Ko.
   - D) Le chiffrement KMS est désactivé.
`
  },
  {
    file: 'dea-19-rds-aurora-analytique.md',
    title: 'Bases Relationnelles pour la Data : Amazon RDS, Aurora et Zero-ETL',
    content: `# Chapitre 19 : Bases Relationnelles pour la Data : Amazon RDS, Aurora et Zero-ETL

## 1. Objectifs d'apprentissage
- Comprendre le rôle d'Amazon RDS et d'Amazon Aurora dans les pipelines de données.
- Différencier Amazon RDS Multi-AZ (haute disponibilité) et Read Replicas (mise à l'échelle des lectures).
- Découvrir Aurora Serverless v2 pour les charges de travail analytiques variables.
- Maîtriser l'intégration Zero-ETL d'Amazon Aurora vers Amazon Redshift (compétence DEA-C01 v1.1).

## 2. Explication claire : quand choisir quoi
Amazon RDS et Aurora sont les solutions relationnelles gérées d'AWS pour héberger les sources transactionnelles (OLTP) qui alimentent les architectures Data :

1. Amazon RDS (Relational Database Service) :
- Supporte 6 moteurs : PostgreSQL, MySQL, MariaDB, Oracle, SQL Server et Aurora.
- Automatise les tâches chronophages : sauvegardes automatiques en continu sur S3, application des correctifs d'OS, bascule en cas de panne matérielle.
- Multi-AZ : réplication synchrone vers une instance passive dans une autre zone de disponibilité. Sert exclusivement à la haute disponibilité et au basculement automatique sans perte de données. Ne peut pas être interrogé en lecture.
- Read Replicas : réplication asynchrone jusqu'à 5 ou 15 copies. Utilisés pour décharger les requêtes de lecture et les extractions ETL de la base principale.

2. Amazon Aurora :
- Moteur propriétaire AWS compatible MySQL et PostgreSQL offrant un débit jusqu'à 5 fois supérieur à MySQL et 3 fois supérieur à PostgreSQL.
- Couche de stockage distribuée : les données sont répliquées en 6 copies réparties sur 3 zones de disponibilité.
- Aurora Serverless v2 : ajuste instantanément la capacité de calcul (mesurée en ACU : Aurora Capacity Units) en fractions de seconde selon la charge réelle, sans interruption des connexions.

3. Intégration Zero-ETL Aurora vers Redshift (Nouveauté clé DEA-C01 v1.1) :
- Qu'est-ce que c'est : réplication entièrement managée et quasi temps réel des données transactionnelles d'Aurora vers Amazon Redshift sans aucun script ETL, sans fonction Lambda et sans instance DMS.
- Comment ça marche :
  - Les modifications validées dans la couche de stockage d'Aurora sont automatiquement répliquées vers Redshift en quelques secondes.
  - Les analystes peuvent exécuter des requêtes décisionnelles complexes sous Redshift sur des données transactionnelles quasi temps réel sans impacter le CPU ni la mémoire de la base de production transactionnelle Aurora.

## 3. Définitions des termes clés
- ACU (Aurora Capacity Unit) : unité de mesure de capacité combinant environ 2 Go de mémoire vive, du vCPU et de la bande passante réseau.
- Zero-ETL : intégration native gérée par AWS synchronisant les données entre un magasin transactionnel et un entrepôt décisionnel sans développement de pipeline.
- Binlog / WAL : journaux de modifications servant de source à la réplication CDC et aux réplicas de lecture.

## 4. Exemple concret
Architecture Zero-ETL moderne :
\`\`\`
[Transactions E-commerce] -> [Amazon Aurora PostgreSQL (OLTP)]
                                          |
                         (Intégration Zero-ETL managée AWS)
                                          v
                              [Amazon Redshift (OLAP)]
                                          |
                               [Dashboards QuickSight]
\`\`\`

## 5. Comparaisons et pièges d'examen
- RDS Multi-AZ vs Read Replicas : Multi-AZ est synchrone et sert à la reprise après panne (DR) ; les Read Replicas sont asynchrones et servent à absorber les lectures de rapports et d'ETL.
- Zero-ETL vs AWS DMS : Zero-ETL est une fonctionnalité native sans serveur ne nécessitant aucune gestion d'instance de réplication pour le couple Aurora/Redshift ; AWS DMS est nécessaire si la source est Oracle, SQL Server ou sur site, ou si la cible est un Data Lake S3 en Parquet.

## 6. Lien avec SQL, Snowflake et Databricks
L'intégration Zero-ETL d'AWS répond au même besoin que les connecteurs d'ingestion directe Snowflake pour Postgres ou les pipelines Delta Live Tables connectés aux bases opérationnelles.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 80 à 90.
- Voir aussi : cours Nikolai Schuler, leçons 128 à 135.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Une équipe data souhaite analyser en temps réel les données de ventes stockées dans Amazon Aurora MySQL sous Amazon Redshift sans créer ni maintenir de pipelines d'extraction avec AWS DMS ou Glue. Quelle solution officielle répond à ce besoin ?
   - A) L'intégration native Amazon Aurora Zero-ETL vers Amazon Redshift (Bonne réponse).
   - B) Un script cron exportant des fichiers CSV sur S3.
   - C) La création d'un cluster Amazon EMR avec Apache Flink.
   - D) Une machine virtuelle EC2 avec un script rsync.
2. Pour exécuter un traitement ETL d'extraction nocturne de 3 heures sans risquer de ralentir les transactions des utilisateurs sur la base de données principale Amazon RDS PostgreSQL, quelle ressource devez-vous cibler ?
   - A) Un réplica en lecture (Read Replica) dédié (Bonne réponse).
   - B) L'instance secondaire passive du déploiement Multi-AZ.
   - C) Le snapshot de sauvegarde S3 directement via SSH.
   - D) La table système pg_database.
`
  },
  {
    file: 'dea-20-opensearch-recherche-vectorielle.md',
    title: 'Recherche Textuelle et Vectorielle avec Amazon OpenSearch Service',
    content: `# Chapitre 20 : Recherche Textuelle et Vectorielle avec Amazon OpenSearch Service

## 1. Objectifs d'apprentissage
- Comprendre les cas d'usage d'Amazon OpenSearch Service pour l'analytique de logs et la recherche full-text.
- Différencier Amazon OpenSearch Managé et Amazon OpenSearch Serverless.
- Maîtriser la recherche vectorielle k-NN (k-Nearest Neighbors) pour les cas d'usage d'IA générative et RAG.
- Comparer les algorithmes d'indexation vectorielle HNSW et IVF (compétence DEA-C01 v1.1).

## 2. Explication claire : quand choisir quoi
Amazon OpenSearch Service (successeur managé d'Elasticsearch) est un moteur de recherche et d'analytique distribué permettant l'indexation de texte intégral, l'analyse de séries temporelles et la recherche de similarité vectorielle :

Modes de déploiement :
- OpenSearch Managé : clusters d'instances EC2 dédiées (Data Nodes, Master Nodes, UltraWarm pour l'archivage économique de logs). Contrôle précis sur le partitionnement (sharding) et les index.
- OpenSearch Serverless : collection sans serveur qui ajuste automatiquement la capacité de calcul (OCU : OpenSearch Compute Units) selon les volumes de requêtes sans gérer d'instances ni dimensionner de stockage.

Recherche Vectorielle k-NN et IA Générative (DEA-C01 v1.1) :
OpenSearch prend en charge le plugin k-NN pour rechercher les vecteurs les plus proches sémantiquement d'un vecteur de requête (embeddings générés par Bedrock ou SageMaker) :

Comparaison des algorithmes d'indexation vectorielle :
1. Algorithme HNSW (Hierarchical Navigable Small World) :
   - Structure : graphe hiérarchique à plusieurs couches reliant les vecteurs proches.
   - Performances : fournit un excellent rappel (recall, précision de la recherche) et une latence de requête ultra-faible en millisecondes.
   - Empreinte mémoire : stocke l'intégralité du graphe en mémoire vive (RAM). Consommation de mémoire très élevée, coût supérieur.
   - Quand le choisir : pour les applications RAG temps réel et les moteurs de recommandation interactifs où la vitesse et la pertinence priment.
2. Algorithme IVF (Inverted File Flat) :
   - Structure : partitionne l'espace vectoriel en clusters de Voronoï et associe chaque vecteur au centre de cluster le plus proche via une liste inversée.
   - Performances : recherche approximative légèrement moins précise que HNSW, mais temps de construction d'index plus rapide.
   - Empreinte mémoire : empreinte RAM considérablement réduite par rapport à HNSW, permettant d'indexer des centaines de millions de vecteurs sur disque à coût maîtrisé.
   - Quand le choisir : pour les très grands volumes de données vectorielles où la mémoire RAM est un facteur de coût limitant.

## 3. Définitions des termes clés
- k-NN (k-Nearest Neighbors) : méthode de recherche identifiant les \`k\` points les plus proches d'un vecteur cible.
- Distance Cosinus : mesure de similarité basée sur l'angle entre deux vecteurs, idéale pour comparer du texte indépendamment de la longueur du document.
- UltraWarm / Cold Storage : niveaux de stockage OpenSearch utilisant Amazon S3 pour réduire le coût de conservation des logs historiques jusqu'à 90 %.

## 4. Exemple concret
Configuration d'un index vectoriel OpenSearch avec méthode HNSW :
\`\`\`json
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "vecteur_description": {
        "type": "knn_vector",
        "dimension": 1024,
        "method": {
          "name": "hnsw",
          "engine": "faiss",
          "space_type": "cosinesimil"
        }
      },
      "titre": { "type": "text" }
    }
  }
}
\`\`\`

## 5. Comparaisons et pièges d'examen
- HNSW vs IVF : HNSW garantit la meilleure précision au prix d'une utilisation massive de mémoire vive ; IVF réduit la consommation mémoire au prix d'une recherche approximative.
- OpenSearch vs Athena : OpenSearch indexe chaque mot et vecteur pour des recherches textuelles et sémantiques en millisecondes ; Athena est conçu pour des requêtes analytiques relationnelles SQL de fond sur de gros volumes S3 avec des temps de réponse de quelques secondes à minutes.

## 6. Lien avec SQL, Snowflake et Databricks
OpenSearch vectoriel remplit exactement la même mission que l'extension \`pgvector\` sur PostgreSQL/Aurora, Snowflake Cortex Search ou les Databricks Vector Search Endpoints.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 286 à 295.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quel algorithme d'indexation vectorielle k-NN devez-vous choisir dans Amazon OpenSearch pour obtenir la latence de recherche la plus faible et la meilleure précision de rappel, sous réserve de disposer de suffisamment de mémoire RAM ?
   - A) L'algorithme HNSW (Hierarchical Navigable Small World) (Bonne réponse).
   - B) L'algorithme IVF (Inverted File).
   - C) Le hachage MD5 standard.
   - D) L'indexation inversée B-Tree.
2. Pour quelle raison un architecte data privilégierait-il l'algorithme vectoriel IVF plutôt que HNSW pour indexer 50 millions de documents vectorisés ?
   - A) Pour réduire considérablement l'empreinte mémoire vive (RAM) requise et limiter les coûts d'infrastructure (Bonne réponse).
   - B) Pour supprimer l'utilisation des embeddings.
   - C) Parce qu'IVF est le seul algorithme supporté par AWS Lambda.
   - D) Pour interdire les requêtes en langage naturel.
`
  },
  {
    file: 'dea-21-stockages-specialises-ebs-efs.md',
    title: 'Stockages Spécialisés et Sauvegarde : EBS, EFS et AWS Backup',
    content: `# Chapitre 21 : Stockages Spécialisés et Sauvegarde : EBS, EFS et AWS Backup

## 1. Objectifs d'apprentissage
- Comprendre les caractéristiques d'Amazon EBS (stockage bloc pour EC2 et EMR).
- Connaître les volumes EBS ssd (gp3, io2 Block Express) et hdd (st1, sc1) et leurs métriques d'IOPS.
- Utiliser Amazon EFS comme système de fichiers partagé multi-instances POSIX.
- Centraliser la gouvernance des sauvegardes avec AWS Backup.

## 2. Explication claire : quand choisir quoi
Dans les architectures de données, le calcul temporaire ou distribué nécessite des stockages haute performance attachés localement :

1. Amazon EBS (Elastic Block Store) :
- Volumes connectés en réseau à une seule instance EC2 (dans la même AZ).
- Types de volumes :
  - gp3 (General Purpose SSD) : standard polyvalent, permet de dimensionner indépendamment les IOPS (jusqu'à 16 000) et le débit (jusqu'à 1 000 Mo/s) sans devoir augmenter la taille du disque. Idéal pour les nœuds de calcul EMR et les petites bases.
  - io2 / io2 Block Express : SSD ultra-haute performance pour bases de données critiques exigeant jusqu'à 256 000 IOPS et une durabilité de 99,999 %.
  - st1 (Throughput Optimized HDD) : disque dur magnétique économique optimisé pour les charges séquentielles lourdes (Big Data, EMR, logs volumineux). Ne peut pas servir de volume de démarrage (boot volume).
  - sc1 (Cold HDD) : stockage le plus économique pour les données rarement accédées.

2. Amazon EFS (Elastic File System) :
- Système de fichiers réseau géré compatible POSIX (protocole NFSv4) montable simultanément par des centaines d'instances EC2 ou conteneurs ECS/EKS à travers plusieurs zones de disponibilité.
- Évolue automatiquement en taille sans pré-provisionnement.
- Idéal pour partager des répertoires de données, des scripts communs ou des modèles d'apprentissage machine entre plusieurs workers distribués.

3. AWS Backup :
- Service centralisé et basé sur des politiques pour automatiser et gérer la sauvegarde de l'ensemble des données d'entreprise across AWS (EBS, EFS, RDS, DynamoDB, S3, Aurora, Redshift).
- Fonctionnalités clés :
  - Politiques de sauvegarde avec planification automatique (Backup Plans).
  - Transition automatique des sauvegardes vers le stockage à froid.
  - Sauvegardes immuables grâce à AWS Backup Vault Lock (protection contre les ransomwares et suppressions malveillantes).
  - Copies automatiques multi-comptes et multi-régions pour la reprise après sinistre.

## 3. Définitions des termes clés
- IOPS (Input/Output Operations Per Second) : nombre d'opérations d'écriture ou lecture de blocs par seconde.
- Bursting Throughput : capacité temporaire d'un volume à dépasser son débit de base pendant les pics de charge.
- Vault Lock : politique empêchant toute modification ou suppression anticipée des sauvegardes stockées dans le coffre AWS Backup.

## 4. Exemple concret
Architecture de traitement distribué partageant un stockage EFS :
\`\`\`
[Workers EC2 / EKS dans AZ-1a] --\\
[Workers EC2 / EKS dans AZ-1b] ---> [Montage NFS : Amazon EFS partagé (Multi-AZ)]
[Workers EC2 / EKS dans AZ-1c] --/           |
                                     (Sauvegarde quotidienne)
                                             v
                                  [AWS Backup Vault Lock]
\`\`\`

## 5. Comparaisons et pièges d'examen
- EBS vs EFS : EBS est un volume bloc local à une seule AZ (sauf option io2 multi-attach limitée) ; EFS est un système de fichiers partagé élastique multi-AZ nativement concurrent.
- st1 vs gp3 pour EMR : pour les nœuds Core de clusters EMR traitant des flux séquentiels HDFS massifs, les volumes st1 offrent le meilleur coût par téraoctet par rapport aux SSD gp3.
- Snapshots EBS : les instantanés EBS sont incrémentiels et stockés de façon durable et chiffrée sur Amazon S3 en arrière-plan.

## 6. Lien avec SQL, Snowflake et Databricks
La gestion centralisée des politiques de sauvegarde avec AWS Backup correspond aux mécanismes de rétention Time Travel et Fail-safe dans Snowflake et aux politiques de sauvegarde des métastores dans Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 54 à 61.
- Voir aussi : cours Nikolai Schuler, leçons 74 à 79.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quel type de volume Amazon EBS offre le coût le plus faible pour les nœuds de travail d'un cluster Big Data exécutant des analyses séquentielles lourdes de gros volumes de données ?
   - A) Throughput Optimized HDD (st1) (Bonne réponse).
   - B) Provisioned IOPS SSD (io2).
   - C) General Purpose SSD (gp2).
   - D) Cold HDD (sc1) comme volume de boot.
2. Une entreprise doit garantir que ses sauvegardes de bases de données ne puissent être supprimées par aucun utilisateur, y compris par le compte administrateur racine (root), pour se prémunir contre les attaques de ransomware. Quel service configurez-vous ?
   - A) AWS Backup avec une politique de verrouillage Vault Lock en mode Compliance (Bonne réponse).
   - B) Un script de copie manuel vers un bucket S3 public.
   - C) Le renommage des volumes EBS.
   - D) L'activation d'Amazon Inspector.
`
  }
];
