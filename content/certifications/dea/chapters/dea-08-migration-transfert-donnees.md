# Chapitre 8 : Migration et Transfert de Données : AWS DMS, DataSync et Famille Snow

## 1. Objectifs d'apprentissage
- Maîtriser AWS Database Migration Service (DMS) pour le chargement initial et le CDC continu.
- Différencier AWS DMS et AWS DataSync selon le type de source (fichiers vs bases de données).
- Connaître les capacités de transfert physique de la famille AWS Snow (Snowcone, Snowball Edge, Snowmobile).
- Comprendre AWS Transfer Family pour les protocoles SFTP, FTPS et FTP.

## 2. Explication claire : quand choisir quoi
Le transfert vers AWS dépend de la nature des données (fichiers ou tables) et de la bande passante :

1. AWS Database Migration Service (AWS DMS) :
- Qu'est-ce que c'est : service géré de migration et de réplication continue de bases de données et magasins NoSQL.
- Fonctionnalités clés :
  - Chargement initial complet (Full Load).
  - Réplication continue des modifications (Change Data Capture - CDC) via les journaux de transactions (ex. binlog MySQL, wal PostgreSQL, redo log Oracle).
  - Migrations homogènes (ex. Oracle vers Oracle) ou hétérogènes (ex. Oracle vers Amazon Aurora PostgreSQL ou Amazon S3 en fichiers Parquet).
- Composants : instance de réplication, point de terminaison source (Source Endpoint), point de terminaison cible (Target Endpoint) et tâche de réplication.

2. AWS DataSync :
- Qu'est-ce que cest : service accéléré de synchronisation réseau de fichiers entre site local (NFS, SMB, HDFS) et AWS (S3, EFS, FSx).
- Avantages : protocole jusqu'à 10 fois plus rapide que rsync, avec chiffrement et contrôle d'intégrité automatique.

3. Famille AWS Snow (Transfert Physique Hors Ligne) :
- À utiliser quand : la bande passante réseau est trop faible ou le volume de données trop massif pour migrer par Internet.
- Appareils :
  - AWS Snowcone : compact et portable (8 To de stockage utilisable).
  - AWS Snowball Edge Storage Optimized : 80 To utiles (disponible avec options de calcul EC2 embarqué pour le prétraitement local).
  - AWS Snowmobile : camion sécurisé jusqu'à 100 Po pour les migrations de datacenters complets.

4. AWS Transfer Family :
- Permet à des partenaires externes d'échanger des fichiers via SFTP, FTPS ou FTP directement vers des compartiments Amazon S3 ou des systèmes EFS sans modifier leurs flux existants.

## 3. Définitions des termes clés
- CDC (Change Data Capture) : technique capturant en temps réel chaque insertion, mise à jour et suppression effectuée dans une base source.
- AWS SCT (Schema Conversion Tool) : outil desktop convertissant les schémas et procédures stockées lors de migrations de bases de données hétérogènes.
- Agent DataSync : machine virtuelle déployée sur site qui communique avec le service managé AWS DataSync via un tunnel TLS sécurisé.

## 4. Exemple concret
Réplication CDC continue d'une base de production vers un Data Lake :
```
[Base PostgreSQL sur site]
          |
    (Journaux WAL)
          v
[Instance de réplication AWS DMS (Tâche CDC)]
          |
    (Format Parquet)
          v
[Amazon S3 (Data Lake Brut)] -> [AWS Glue Data Catalog] -> [Amazon Athena]
```

## 5. Comparaisons et pièges d'examen
- DMS vs DataSync : DMS est conçu pour les bases de données (tables, transactions, CDC) ; DataSync est conçu pour les fichiers et répertoires de systèmes de fichiers (NFS, SMB, HDFS).
- Calcul du seuil Snowball : si le transfert par le réseau prend plus de 7 à 10 jours en saturant la ligne disponible, Snowball Edge est la recommandation d'examen économique et rapide.
- Endpoint S3 dans DMS : lors de l'utilisation d'Amazon S3 comme cible DMS, vous pouvez configurer DMS pour écrire directement en Apache Parquet avec compression Snappy.

## 6. Lien avec SQL, Snowflake et Databricks
AWS DMS écrivant en continu sur S3 est l'architecture classique utilisée pour alimenter les plateformes Snowflake ou Databricks à partir d'anciens ERP ou CRM sur site sans surcharger les bases transactionnelles opérationnelles.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 246 à 260.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Une entreprise doit répliquer en continu les transactions d'une base de données Oracle sur site vers un Data Lake S3 avec un temps d'arrêt minimal. Quel service configurez-vous ?
   - A) AWS Database Migration Service (DMS) avec une tâche Full Load + CDC (Bonne réponse).
   - B) AWS DataSync avec planification horaire.
   - C) AWS Snowball Edge Storage Optimized.
   - D) AWS Storage Gateway en mode Volume Gateway.
2. Un centre de recherche doit transférer 120 To de fichiers d'images satellites stockés sur un partage NFS local vers Amazon S3. La connexion Internet est limitée à 20 Mbit/s. Quelle est la solution la plus rapide ?
   - A) Commander deux boîtiers AWS Snowball Edge pour un transfert physique sécurisé (Bonne réponse).
   - B) Lancer un transfert direct via la console Web S3.
   - C) Utiliser AWS DataSync sur la liaison 20 Mbit/s existante.
   - D) Envoyer les données par email chiffré vers AWS Support.
