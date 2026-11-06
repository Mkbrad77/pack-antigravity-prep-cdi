# Chapitre 17 : Analytique Hybride : Redshift Spectrum et Redshift Data Sharing

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
- Utilise l'AWS Glue Data Catalog comme schéma externe (`CREATE EXTERNAL SCHEMA`).

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
```sql
CREATE EXTERNAL SCHEMA lake_extern
FROM DATA CATALOG DATABASE 'glue_raw_db'
IAM_ROLE 'arn:aws:iam::123456789012:role/RedshiftSpectrumRole';

SELECT v.id_vente, v.montant, h.details
FROM ventes_locales v
JOIN lake_extern.historique_s3 h ON v.id_vente = h.id_vente
WHERE v.date_vente = CURRENT_DATE;
```

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
