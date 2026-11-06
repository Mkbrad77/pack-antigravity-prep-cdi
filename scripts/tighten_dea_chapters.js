import fs from 'node:fs';
import path from 'node:path';

const CHAPTERS_DIR = path.join(process.cwd(), 'content', 'certifications', 'dea', 'chapters');

function countWords(text) {
  const clean = text.replace(/^---[\s\S]*?---/, '').trim();
  const words = clean.match(/[\w\u00C0-\u017F'-]+/g);
  return words ? words.length : 0;
}

const files = fs.readdirSync(CHAPTERS_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(CHAPTERS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let words = countWords(content);
  
  if (words > 800) {
    console.log(`Tightening ${file} (currently ${words} words)...`);
    
    // Perform targeted concision replacements without removing technical concepts
    if (file === 'dea-01-ingestion-kinesis-streams-firehose.md') {
      content = content.replace("un bus d'événements persistant en temps réel à faible latence (70 ms à 200 ms).", "bus d'événements temps réel à faible latence (70 à 200 ms).")
        .replace("lorsque plusieurs consommateurs indépendants doivent lire le même flux en parallèle, lorsqu'un traitement personnalisé temps réel est requis (via Lambda ou KCL), ou lorsqu'un rejeu des données sur 24 heures à 365 jours est indispensable.", "lecture multi-consommateurs en parallèle, traitement temps réel personnalisé (Lambda, KCL), ou rejeu des données (24h à 365j).")
        .replace("un service entièrement managé de livraison sans serveur vers des destinations spécifiques (S3, Redshift, OpenSearch, Splunk, tables Apache Iceberg).", "service sans serveur de livraison managée vers S3, Redshift, OpenSearch, Splunk et Apache Iceberg.")
        .replace("pour ingérer des flux directement dans un Data Lake ou un entrepôt sans coder de consommateur personnalisé.", "ingestion directe dans un Data Lake ou entrepôt sans coder de consommateur.")
        .replace("Firehose accumule les données avant écriture selon deux seuils : taille du tampon (1 Mo à 128 Mo) ou intervalle de temps (60 s à 900 s). Le premier seuil atteint déclenche la livraison. Firehose ne permet donc pas du temps réel strict sous la seconde (near real-time).", "Firehose accumule les données selon deux seuils : taille (1 à 128 Mo) ou intervalle (60 à 900 s). Le premier seuil atteint déclenche la livraison (near real-time).")
        .replace("peut invoquer une fonction AWS Lambda pour transformer les enregistrements (décompression, enrichissement, conversion JSON vers Apache Parquet/ORC via AWS Glue).", "peut invoquer AWS Lambda pour transformer les données (décompression, enrichissement, conversion JSON en Parquet/ORC via Glue Catalog).");
    }

    if (file === 'dea-03-glue-etl-jobs.md') {
      content = content.replace("AWS Glue ETL est un moteur de traitement de données sans serveur basé sur Apache Spark, optimisé pour les pipelines d'extraction, de transformation et de chargement (ETL) :", "AWS Glue ETL est un moteur sans serveur basé sur Apache Spark optimisé pour les pipelines ETL :")
        .replace("Pour exécuter des transformations complexes par lots sur de gros volumes (Go à To) sans administrer de clusters Spark.", "Transformations complexes par lots sur gros volumes sans administrer de clusters.")
        .replace("Pour bénéficier d'un catalogue de métadonnées centralisé (AWS Glue Data Catalog) partagé nativement avec Athena, Redshift Spectrum et EMR.", "Catalogue de métadonnées partagé avec Athena, Redshift Spectrum et EMR.")
        .replace("structure de données propriétaire conçue pour la réalité des Data Lakes. Chaque enregistrement est auto-descriptif avec son propre schéma. Un champ ayant des types divergents est géré sous forme de `choice type`, permettant de résoudre les incohérences via la transformation `ResolveChoice` sans perdre de données.", "structure conçue pour les Data Lakes où chaque enregistrement est auto-descriptif. Les types divergents forment des `choice types` résolus via `ResolveChoice` sans perte de données.")
        .replace("Mécanisme d'état interne à Glue permettant de suivre les données déjà traitées lors des exécutions précédentes.", "Mécanisme suivant les données déjà traitées lors des exécutions précédentes.")
        .replace("lors de la lecture d'une source S3 ou JDBC, Glue mémorise la date de dernière modification des fichiers ou la clé primaire incrémentale.", "Glue mémorise la date de dernière modification ou la clé primaire incrémentale.")
        .replace("seules les nouvelles données arrivées depuis le dernier job sont ingérées, évitant de retraiter l'historique et éliminant les écritures en double.", "seules les nouvelles données sont ingérées, évitant les retraitements et doublons.");
    }

    if (file === 'dea-05-spark-emr-serverless.md') {
      content = content.replace("Amazon EMR (Elastic MapReduce) est la plateforme Big Data managée d'AWS pour exécuter des frameworks open source distribués (Apache Spark, Hive, Presto, Trino, Flink, HBase) :", "Amazon EMR est la plateforme Big Data managée d'AWS pour exécuter Spark, Hive, Presto, Trino et Flink :")
        .replace("Coordonne le cluster, exécute le gestionnaire de ressources YARN et le pilote Spark (Driver).", "Coordonne le cluster, exécute YARN et le pilote Spark (Driver).")
        .replace("Ne doit JAMAIS être interrompu : toujours déployer sur une instance On-Demand.", "Ne doit jamais être interrompu : toujours déployer sur On-Demand.")
        .replace("Exécutent les tâches Spark (Executors) ET stockent des données sur HDFS (Hadoop Distributed File System).", "Exécutent les tâches Spark (Executors) et stockent les données HDFS.")
        .replace("Risque de perte de données HDFS en cas de terminaison : généralement déployés sur instances On-Demand.", "Risque de perte de données HDFS : déployer sur instances On-Demand.")
        .replace("Exécutent uniquement du calcul Spark sans stocker de données HDFS persistantes.", "Exécutent uniquement du calcul Spark sans stockage HDFS persistant.")
        .replace("Idéal pour les instances Spot : si AWS révoque une instance Spot avec un préavis de 2 minutes, aucune donnée n'est perdue et Spark réexécute simplement la tâche perdue sur un autre nœud.", "Idéal pour les instances Spot : en cas d'interruption avec préavis de 2 minutes, aucune donnée n'est perdue et Spark relance la tâche ailleurs.")
        .replace("survient lorsqu'une clé de jointure ou d'agrégation concentre 80 % des données, saturant un seul exécuteur alors que les autres sont inactifs. Solutions : salage de clés (key salting) ou activation de l'Adaptive Query Execution (AQE) de Spark 3.x.", "une clé concentre la majorité des données, saturant un exécuteur. Solutions : salage de clés (key salting) ou Adaptive Query Execution (AQE).")
        .replace("minimiser les réorganisations réseau lourdes en remplaçant les jointures de tri-fusion par des jointures diffusées (`broadcast join`) lorsque l'une des deux tables est petite (< 10 Mo par défaut).", "minimiser les transferts réseau en remplaçant les jointures shuffle par des jointures diffusées (`broadcast join`) si une table est petite (< 10 Mo).");
    }

    if (file === 'dea-06-lambda-event-driven-batch.md') {
      content = content.replace("Pour l'ingestion et le traitement léger ou asynchrone, AWS propose deux paradigmes complémentaires :", "AWS propose deux paradigmes complémentaires de calcul réactif et par lots :")
        .replace("Déclenchement automatique lorsqu'un nouveau fichier atterrit dans un compartiment S3 (ObjectCreated notification) pour valider son format, extraire des métadonnées ou déclencher une machine à états Step Functions.", "Déclenchement sur nouvel objet S3 (ObjectCreated) pour validation, extraction de métadonnées ou lancement de Step Functions.")
        .replace("Temps d'exécution maximal strict : 15 minutes (900 secondes). Tout traitement dépassant 15 minutes doit impérativement utiliser AWS Glue, AWS Batch ou Amazon ECS/EMR.", "Temps d'exécution maximal strict : 15 minutes (900 s). Tout traitement plus long doit utiliser AWS Glue, Batch ou ECS/EMR.")
        .replace("Géré (Managed) : AWS provisionne, met à l'échelle et termine automatiquement les instances EC2 en fonction de la file d'attente des jobs.", "Géré : AWS provisionne et met à l'échelle automatiquement les instances EC2 selon la file d'attente.")
        .replace("Support natif des instances Spot : permet d'exécuter des milliers de tâches de calcul par lots avec jusqu'à 90 % de réduction de coût.", "Support des instances Spot : exécution par lots avec jusqu'à 90 % d'économie.");
    }

    if (file === 'dea-08-migration-transfert-donnees.md') {
      content = content.replace("Le déplacement de données vers AWS dépend du type de données (fichiers ou tables relationnelles) et de la bande passante réseau disponible :", "Le transfert vers AWS dépend de la nature des données (fichiers ou tables) et de la bande passante :")
        .replace("service géré de migration et de réplication continue de bases de données relationnelles, entrepôts et magasins NoSQL.", "service géré de migration et de réplication continue de bases de données et magasins NoSQL.")
        .replace("service d'accélération de transfert réseau en ligne pour synchroniser des téraoctets ou pétaoctets de fichiers entre des systèmes sur site (NFS, SMB, HDFS) et AWS (S3, EFS, FSx).", "service accéléré de synchronisation réseau de fichiers entre site local (NFS, SMB, HDFS) et AWS (S3, EFS, FSx).")
        .replace("protocole de transfert propriétaire jusqu'à 10 fois plus rapide que les outils open source comme rsync, avec chiffrement et vérification d'intégrité automatique des données.", "protocole jusqu'à 10 fois plus rapide que rsync, avec chiffrement et contrôle d'intégrité automatique.");
    }

    if (file === 'dea-11-athena-requetage-serverless.md') {
      content = content.replace("Amazon Athena est un service interactif de requêtes SQL sans serveur qui analyse directement les données stockées dans Amazon S3 en utilisant les métadonnées définies dans l'AWS Glue Data Catalog :", "Amazon Athena est un service SQL sans serveur analysant directement les données sur Amazon S3 via l'AWS Glue Data Catalog :")
        .replace("Divise par 5 à 10 le volume de données numérisées car seules les colonnes mentionnées dans la clause `SELECT` et `WHERE` sont lues depuis S3.", "Divise par 5 à 10 les volumes scannés en ne lisant que les colonnes requises depuis S3.")
        .replace("Compresser les fichiers Parquet avec Snappy ou ZSTD réduit la taille des blocs S3 et accélère les transferts I/O.", "La compression Snappy ou ZSTD réduit la taille des fichiers et accélère les transferts I/O.")
        .replace("Structurer les données par préfixes S3 hiérarchiques (ex. `year=2026/month=10/day=31/`).", "Structurer les données par préfixes S3 hiérarchiques (`year=2026/month=10/day=31/`).")
        .replace("Une requête filtrant sur une date ne numérise que la partition ciblée, ignorant le reste du Data Lake.", "Le filtrage par date ne numérise que la partition ciblée, ignorant le reste.")
        .replace("Évite à Athena d'interroger l'API du Glue Data Catalog pour lister les milliers de partitions de dates. Les clés de partition et leurs plages sont configurées directement dans les propriétés de la table SerDe, rendant l'exécution des requêtes quasi instantanée.", "Évite d'interroger le Glue Catalog pour lister les milliers de partitions. Les plages de partitions sont configurées directement dans la table, rendant le requêtage quasi instantané.");
    }

    if (file === 'dea-13-apache-iceberg-s3-tables.md') {
      content = content.replace("Format de table ouvert pour les lacs de données apportant des fonctionnalités de niveau entrepôt : transactions ACID (commit atomique), évolution de schéma et de partitionnement sans réécriture, voyage dans le temps (Time Travel) et compaction de petits fichiers.", "Format de table ouvert apportant aux Data Lakes les transactions ACID, l'évolution de schéma et de partitionnement sans réécriture, le Time Travel et la compaction.")
        .replace("Type de compartiment S3 spécialement optimisé pour les tables Iceberg, offrant une vitesse de traitement jusqu'à 3 fois supérieure et une maintenance entièrement automatisée (compaction, suppression des snapshots expirés, nettoyage des fichiers orphelins sans script externe).", "Type de compartiment S3 optimisé pour Iceberg, offrant jusqu'à 3x plus de vitesse et une maintenance automatisée (compaction, purge des snapshots expirés et des fichiers orphelins).")
        .replace("Le fichier de métadonnées pointe vers les fichiers manifestes, qui pointent vers les fichiers de données Parquet réels. Les écritures créent un nouvel arbre de métadonnées et basculent le pointeur atomiquement.", "Le fichier de métadonnées pointe vers les manifestes qui référencent les fichiers Parquet. Les écritures créent un nouvel arbre et basculent le pointeur de façon atomique.");
    }

    if (file === 'dea-14-partitionnement-formats-optimisation.md') {
      content = content.replace("Le choix du format de stockage et de la stratégie de découpage est le levier numéro un de performance et d'économie dans un Data Lake AWS :", "Le format de stockage et le découpage constituent le levier clé de performance et de coût d'un Data Lake AWS :")
        .replace("Format colonnaire binaire hautement optimisé pour l'analytique (OLAP). Stocke les métadonnées (statistiques min/max par bloc) dans le pied de page (footer). Permet le saut de blocs (block pruning) et la lecture sélective de colonnes sans charger les autres colonnes.", "Format colonnaire binaire pour l'analytique (OLAP). Stocke les statistiques min/max dans le pied de page (footer), permettant le saut de blocs et la lecture sélective de colonnes.")
        .replace("Créer trop de partitions (ex. partitionner par heure ou par identifiant client à forte cardinalité) engendre des millions de petits fichiers de quelques kilo-octets. Cela sature l'API S3 (requêtes GET/LIST) et dégrade fortement les performances de Glue, Athena et Spark.", "Créer trop de partitions (forte cardinalité) génère des millions de petits fichiers, saturant l'API S3 et ralentissant Glue, Athena et Spark.")
        .replace("Taille idéale des fichiers dans S3 pour l'analytique : visez des fichiers entre 128 Mo et 512 Mo pour maximiser le parallélisme des moteurs de requête.", "Taille idéale des fichiers S3 : visez entre 128 Mo et 512 Mo pour optimiser le parallélisme de lecture.");
    }

    if (file === 'dea-15-redshift-architecture-distribution.md') {
      content = content.replace("Amazon Redshift est un entrepôt de données relationnel à traitement massivement parallèle (MPP) conçu pour l'analytique à l'échelle du pétaoctet :", "Amazon Redshift est un entrepôt de données relationnel MPP colonnaire pour l'analytique à grande échelle :")
        .replace("Reçoit les requêtes SQL des applications clientes, analyse, compile le code d'exécution C++ et distribue le plan d'exécution aux nœuds de calcul.", "Reçoit les requêtes SQL clientes, compile le code d'exécution et distribue le plan aux nœuds de calcul.")
        .replace("Exécutent le code compilé en parallèle et renvoient les résultats intermédiaires au Leader Node. Chaque nœud de calcul est divisé en tranches (Slices) de calcul et de stockage.", "Exécutent le code compilé en parallèle et renvoient les résultats au Leader Node. Chaque nœud est divisé en tranches (Slices).")
        .replace("Les lignes sont distribuées de manière égale selon un algorithme de hachage sur une colonne spécifique. À choisir pour les grandes tables de faits et de dimensions fréquemment jointes sur cette clé pour forcer la colocalisation des données sur les mêmes tranches (colocated join, zéro shuffle).", "Distribution par hachage d'une colonne. À choisir pour les tables fréquemment jointes sur cette clé afin de forcer la colocalisation sur les mêmes tranches (colocated join, zéro shuffle).")
        .replace("Une copie intégrale de la table est dupliquée sur le premier nœud de chaque tranche. Idéal pour les petites tables de dimension (< 2-3 millions de lignes) changeant peu. Élimine le shuffle lors des jointures.", "Copie intégrale dupliquée sur chaque nœud. Idéal pour les petites tables de dimension (< 2-3 millions de lignes). Élimine le shuffle.")
        .replace("Distribution circulaire uniforme sans tenir compte des valeurs. À choisir pour les tables sans jointures évidentes ou lorsqu'aucune clé ne se démarque sans créer de déséquilibre (skew).", "Distribution circulaire uniforme. À choisir sans clé de jointure évidente ou pour éviter le déséquilibre (skew).");
    }

    if (file === 'dea-16-redshift-cles-tri-performances.md') {
      content = content.replace("Les clés de tri déterminent l'ordre physique d'enregistrement des lignes dans les blocs de stockage de 1 Mo de Redshift :", "Les clés de tri fixent l'ordre physique des données dans les blocs de 1 Mo de Redshift :")
        .replace("Trie les données selon les colonnes définies dans l'ordre strict de déclaration (colonne 1, puis colonne 2). Idéal si les requêtes filtrent systématiquement sur la première colonne (ex. plage de dates `date_id`).", "Trie les données selon l'ordre strict de déclaration (colonne 1 puis colonne 2). Idéal si les filtres ciblent systématiquement la première colonne (dates).")
        .replace("Donne un poids égal à chaque colonne de la clé de tri. Très puissant lorsque les requêtes filtrent sur différentes combinaisons de colonnes (ex. `ville`, `categorie`, `produit`), mais processus de chargement plus lourd.", "Donne un poids égal à chaque colonne. Idéal si les requêtes combinent différentes colonnes (`ville`, `categorie`), avec un surcoût au chargement.")
        .replace("Réorganise les lignes pour rétablir l'ordre de tri physique et libère l'espace disque des lignes supprimées ou mises à jour.", "Réorganise les lignes pour rétablir l'ordre de tri et libère l'espace disque des lignes supprimées.")
        .replace("Met à jour les métadonnées statistiques utilisées par l'optimiseur de requêtes pour choisir le meilleur plan d'exécution.", "Met à jour les statistiques utilisées par l'optimiseur pour choisir le plan d'exécution optimal.")
        .replace("Permet d'isoler des groupes d'utilisateurs et de requêtes dans des files d'attente distinctes avec des allocations de mémoire et de concurrence dédiées.", "Isole les requêtes dans des files d'attente distinctes avec mémoire et concurrence dédiées.");
    }

    if (file === 'dea-17-redshift-spectrum-data-sharing.md') {
      content = content.replace("Amazon Redshift propose des architectures modernes permettant d'étendre les requêtes au-delà du stockage local du cluster :", "Amazon Redshift étend les requêtes SQL au-delà du stockage local du cluster :")
        .replace("Permet à un cluster Redshift d'exécuter des requêtes SQL directement sur des téraoctets ou pétaoctets de données stockées dans Amazon S3 sans aucun chargement préalable.", "Permet d'exécuter des requêtes SQL directement sur les données S3 sans chargement préalable.")
        .replace("S'appuie sur des milliers de nœuds de calcul gérés par AWS pour filtrer et projeter les données S3 avant de transmettre uniquement les lignes utiles aux nœuds du cluster Redshift.", "Utilise des nœuds de calcul managés pour filtrer les données S3 avant transmission au cluster.")
        .replace("Idéal pour le pattern Lakehouse : conserver les données chaudes et fréquentes sur le stockage local Redshift, et interroger l'historique froid sur S3.", "Idéal pour le pattern Lakehouse : données chaudes sur stockage local, historique froid sur S3.")
        .replace("Fonctionnalité permettant de partager instantanément des données en lecture seule entre différents clusters Redshift (même compte, comptes différents, ou régions différentes) sans copier ni déplacer physiquement les données.", "Partage instantané en lecture seule entre clusters Redshift sans copie physique de données.")
        .replace("Les requêtes du consommateur utilisent ses propres ressources de calcul sans impacter la performance du cluster producteur.", "Les requêtes consommatrices utilisent leurs propres ressources sans impacter le producteur.");
    }

    if (file === 'dea-18-dynamodb-modelisation-data.md') {
      content = content.replace("Amazon DynamoDB est une base de données NoSQL gérée offrant des performances constantes à latence milliseconde à n'importe quelle échelle :", "Amazon DynamoDB est une base NoSQL gérée offrant une latence sous les 10 ms à toute échelle :")
        .replace("Clé de partition (Partition Key / HASH) : détermine la partition physique où l'élément est stocké via une fonction de hachage interne.", "Partition Key (HASH) : détermine la partition physique de stockage via hachage.")
        .replace("Clé de tri (Sort Key / RANGE) : permet de trier les éléments partageant la même clé de partition et d'exécuter des recherches par plage (`between`, `<`, `>`).", "Sort Key (RANGE) : trie les éléments d'une même partition et permet des recherches par plage.")
        .replace("GSI (Global Secondary Index) : index avec une clé de partition et une clé de tri différentes de la table de base. Peut être créé ou supprimé à tout moment. Écritures asynchrones avec cohérence éventuelle.", "GSI : index avec partition key et sort key différentes de la table de base. Créable à tout moment, écritures asynchrones à cohérence éventuelle.")
        .replace("LSI (Local Secondary Index) : même clé de partition que la table de base mais clé de tri différente. Doit impérativement être créé lors de la création de la table. Cohérence forte ou éventuelle.", "LSI : même partition key mais sort key différente. Doit être créé à la création de la table. Cohérence forte ou éventuelle.")
        .replace("Journal ordonné dans le temps capturant les modifications au niveau des éléments (Insert, Modify, Remove) avec une rétention de 24 heures.", "Journal capturant les modifications d'éléments (Insert, Modify, Remove) avec rétention de 24 heures.");
    }

    if (file === 'dea-25-optimisation-couts-performance-data.md') {
      content = content.replace("L'optimisation des coûts (FinOps) et des performances est une composante majeure de l'examen DEA-C01 :", "L'optimisation des coûts et des performances est un pilier majeur de l'examen DEA-C01 :")
        .replace("Les requêtes GET/PUT et les millions de petits fichiers génèrent des coûts d'API S3 élevés. Solution : compacter les fichiers (128 à 512 Mo) avec Glue ou EMR.", "Les millions de petits fichiers génèrent des coûts d'API S3 élevés. Solution : compacter les fichiers (128 à 512 Mo).")
        .replace("Activer S3 Intelligent-Tiering ou des règles de cycle de vie pour basculer les données froides vers Glacier Instant Retrieval ou Deep Archive.", "Activer S3 Intelligent-Tiering ou des règles de cycle de vie vers Glacier Instant Retrieval ou Deep Archive.")
        .replace("Facturé à la seconde (minimum 1 minute) avec minimum 2 DPU pour Glue Spark. Configurer `Auto Scaling` pour ajuster dynamiquement le nombre de DPUs. Définir un timeout d'exécution court (ex. 60 min au lieu des 2880 min par défaut).", "Facturé au DPU à la seconde (min 1 min). Activer Auto Scaling et fixer un timeout court (ex. 60 min au lieu de 2880 min).")
        .replace("Utiliser les instances Spot pour les Task Nodes EMR afin d'obtenir jusqu'à 80-90 % de remise.", "Utiliser des instances Spot sur les Task Nodes EMR (80-90 % de remise).")
        .replace("Amazon Redshift Serverless ajuste automatiquement la capacité (RPU) selon la charge, avec seuils d'utilisation quotidienne pour plafonner les dépenses.", "Redshift Serverless ajuste la capacité (RPU) selon la charge avec plafonnement des dépenses.");
    }

    if (file === 'dea-31-kms-chiffrement-donnees.md') {
      content = content.replace("La sécurité des données au repos et en transit est au cœur de l'architecture d'un Data Lake d'entreprise :", "La sécurité des données au repos et en transit est un socle essentiel du Data Lake d'entreprise :")
        .replace("Gérée entièrement par AWS sans frais supplémentaires pour la clé. Chiffrement transparent côté serveur avec AES-256.", "Gérée par AWS sans frais pour la clé. Chiffrement côté serveur AES-256 transparent.")
        .replace("Clé gérée par le client ou AWS dans KMS. Permet le contrôle d'accès granulaire via la politique de clé (Key Policy), la rotation automatique annuelle et la journalisation CloudTrail de chaque opération de déchiffrement.", "Clé gérée dans KMS. Contrôle granulaire par politique de clé, rotation automatique et journalisation CloudTrail de chaque déchiffrement.")
        .replace("Le client fournit et gère sa propre clé cryptographique lors de chaque requête HTTP API vers S3. AWS ne stocke jamais la clé.", "Le client fournit sa clé lors de chaque requête HTTP vers S3. AWS ne stocke jamais la clé.")
        .replace("Réduit jusqu'à 99 % les appels d'API vers KMS en générant une clé intermédiaire au niveau du bucket pour les requêtes répétées, diminuant drastiquement les coûts de déchiffrement lors des lectures massives par Athena ou EMR.", "Réduit jusqu'à 99 % les appels KMS en générant une clé intermédiaire au niveau du bucket, réduisant drastiquement les coûts lors des lectures massives par Athena ou EMR.");
    }

    if (file === 'dea-32-securite-reseau-vpc-privatelink.md') {
      content = content.replace("Un Data Lake sécurisé isole le trafic de données au sein du réseau privé virtuel sans exposer les flux à Internet public :", "Un Data Lake sécurisé isole le trafic au sein du réseau privé virtuel sans exposition à Internet public :")
        .replace("Permet aux instances d'accéder à S3 ou DynamoDB via la table de routage du VPC sans coût supplémentaire.", "Permet d'accéder à S3 ou DynamoDB via la table de routage du VPC sans coût supplémentaire.");
    }

    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
    const newWords = countWords(content);
    console.log(`-> ${file} tightened to ${newWords} words`);
  }
}

console.log('\nTightening completed. Verifying all chapters...');
let errors = 0;
for (const file of files) {
  const filePath = path.join(CHAPTERS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const words = countWords(content);
  if (words > 800) {
    console.error(`[FAIL] ${file} is still > 800 words (${words})`);
    errors++;
  } else if (words < 100) {
    console.error(`[FAIL] ${file} is < 100 words (${words})`);
    errors++;
  } else {
    console.log(`[PASS] ${file} : ${words} words`);
  }
}

if (errors > 0) {
  process.exit(1);
} else {
  console.log('\n[SUCCESS] All 35 DEA chapters are strictly between 100 and 800 words!');
}
