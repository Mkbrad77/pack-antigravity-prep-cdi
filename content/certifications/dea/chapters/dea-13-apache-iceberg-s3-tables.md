# Chapitre 13 : Formats de Tables Ouverts : Apache Iceberg et Amazon S3 Tables

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
```sql
SELECT code_client, solde_compte
FROM db_finance.comptes_clients
FOR SYSTEM_TIME AS OF TIMESTAMP '2026-10-20 12:00:00 UTC'
WHERE code_client = 'CL-98745';
```

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
