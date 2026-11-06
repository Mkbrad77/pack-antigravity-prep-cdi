# Fiche Express Domaine 2 : Gestion des Magasins de Données (26 %)

## 1. Vue d'ensemble du Domaine 2
Le Domaine 2 compte pour 26 % de l'examen DEA-C01. Il teste la maîtrise du stockage objet (S3), des formats de tables ouverts (Apache Iceberg, S3 Tables), des entrepôts de données (Redshift), des bases NoSQL (DynamoDB) et des moteurs vectoriels (OpenSearch).

## 2. Les 12 Chiffres et Limites Critiques à Retenir
1. Durabilité Amazon S3 : 99,999999999 % (11 neufs) conçue pour tolérer la perte simultanée de 2 installations.
2. Débit S3 par préfixe : 3 500 requêtes PUT/POST/DELETE/s et 5 500 requêtes GET/s.
3. Taille maximale d'un objet S3 : 5 To (un seul PUT HTTP direct limité à 5 Go, au-delà multipart upload obligatoire).
4. S3 Glacier Deep Archive : récupération sous 12 heures (ou 48 heures en mode Bulk) ; coût de stockage le plus bas du cloud.
5. Durée minimale de rétention facturée S3 : Standard-IA = 30 jours ; Glacier Flexible = 90 jours ; Glacier Deep Archive = 180 jours.
6. Blocs de stockage Redshift : 1 Mo par bloc (stockage colonnaire avec Zone Maps min/max par bloc).
7. Redshift DISTSTYLE : AUTO (défaut), KEY (colonne de hachage), EVEN (round-robin), ALL (copie sur chaque nœud pour petites tables).
8. Redshift SORTKEY : COMPOUND (rapide si filtres sur préfixe gauche ordonné) vs INTERLEAVED (poids égal jusqu'à 8 dimensions).
9. Redshift Concurrency Scaling : 1 heure de crédit gratuit accumulée toutes les 24 heures de cluster actif.
10. DynamoDB : taille maximale d'un élément = 400 Ko ; 1 RCU = 4 Ko/s (lecture strongly consistent) ; 1 WCU = 1 Ko/s.
11. Index DynamoDB : LSI (Local) = créé uniquement à la création de la table, même PK, max 10 Go par partition ; GSI (Global) = créable à chaud à tout moment, PK différente, capacité propre.
12. Index Vectoriel OpenSearch : HNSW (haute précision, tout en RAM) vs IVF (partitionnement de Voronoï, empreinte RAM très faible pour gros volumes).

## 3. Matrice Décisionnelle d'Architecture : Quand Choisir Quoi
- Data Lake scalable avec transactions ACID et time travel : Apache Iceberg sur Amazon S3 Tables (compaction automatique).
- Data Warehouse décisionnel lourd avec jointures complexes et requêtes SQL analytiques : Amazon Redshift (nœuds RA3 avec RMS).
- Requêtage S3 direct depuis un cluster Redshift sans chargement COPY : Amazon Redshift Spectrum.
- Partage direct de données en direct entre plusieurs clusters sans duplication : Amazon Redshift Data Sharing.
- Magasin NoSQL clé-valeur avec latence sous 10 ms à toute échelle : Amazon DynamoDB.
- Journal CDC de modifications NoSQL : Amazon DynamoDB Streams (conservé 24h).
- Base transactionnelle relationnelle avec réplication Zero-ETL vers Redshift : Amazon Aurora MySQL / PostgreSQL.
- Recherche de texte intégral et recherche de similarité vectorielle sémantique : Amazon OpenSearch Service (plugin k-NN).
- Stockage de fichiers partagé NFS multi-AZ pour instances distribuées : Amazon EFS.
- Sauvegardes centralisées immuables et protégées contre ransomwares : AWS Backup Vault Lock.

## 4. Les 5 Pièges Majeurs d'Examen du Domaine 2
1. Small Files Problem sur Iceberg : sans compaction régulière ou sans Amazon S3 Tables, l'accumulation de millions de petits fichiers dégrade drastiquement les performances d'Athena et Spark.
2. Sous-provisionnement d'un GSI DynamoDB : si un GSI manque de WCU, il bloque et ralentit les écritures sur la table de base DynamoDB (throttling).
3. Data Skew sur Redshift DISTKEY : choisir une colonne de distribution à faible cardinalité ou avec beaucoup de NULL concentre toutes les données sur une seule slice physique.
4. Oublier VACUUM et ANALYZE sous Redshift : après des suppressions massives ou des COPY, le cluster reste encombré d'espace mort et le planificateur utilise des statistiques fausses.
5. Versioning et S3 CRR : la réplication cross-région échoue si le versioning n'est pas activé sur le bucket source ET sur le bucket de destination.
