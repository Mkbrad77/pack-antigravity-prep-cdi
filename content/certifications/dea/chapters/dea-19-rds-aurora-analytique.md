# Chapitre 19 : Bases Relationnelles pour la Data : Amazon RDS, Aurora et Zero-ETL

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
```
[Transactions E-commerce] -> [Amazon Aurora PostgreSQL (OLTP)]
                                          |
                         (Intégration Zero-ETL managée AWS)
                                          v
                              [Amazon Redshift (OLAP)]
                                          |
                               [Dashboards QuickSight]
```

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
