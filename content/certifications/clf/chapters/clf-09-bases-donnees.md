# Chapitre 9 : Services de Bases de Données AWS : RDS, DynamoDB et Redshift

## 1. Objectifs d'apprentissage
- Identifier les grands types de bases de données : Relationnelle (OLTP), NoSQL Clé-Valeur, Entrepôt (OLAP) et En mémoire.
- Connaître les moteurs gérés par Amazon RDS et les atouts d'Amazon Aurora.
- Comprendre les cas d'usage d'Amazon DynamoDB pour les données non relationnelles.
- Distinguer Amazon Redshift pour l'analytique et Amazon ElastiCache pour la mise en cache.

## 2. Explication claire : quand choisir quoi
AWS propose des bases spécialisées selon le modèle de données :

1. Bases relationnelles (OLTP) :
- Amazon RDS : service géré simplifiant patchs, sauvegardes et réplication Multi-AZ pour 6 moteurs (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, Aurora).
- Amazon Aurora : moteur relationnel compatible MySQL et PostgreSQL offrant jusqu'à 5 fois les performances de MySQL, avec réplication sur 6 copies dans 3 AZ et bascule en moins de 30 secondes.
- Quand choisir RDS/Aurora : pour transactions ACID, schémas relationnels et requêtes SQL complexes avec jointures.

2. Bases NoSQL (clé-valeur et documents) :
- Amazon DynamoDB : base NoSQL managée sans serveur offrant une latence inférieure à 10 millisecondes à toute échelle.
- Schéma flexible, auto-scaling et réplication multi-régions (Global Tables).
- Quand choisir DynamoDB : profils utilisateurs, paniers, sessions web, IoT et jeux vidéo.

3. Entrepôt de données analytique (OLAP) :
- Amazon Redshift : data warehouse SQL colonnaire à grande échelle pour analyser des pétaoctets de données et générer des tableaux de bord décisionnels.

4. Mise en cache en mémoire (In-Memory) :
- Amazon ElastiCache : cache mémoire compatible Redis et Memcached réduisant la latence des bases relationnelles en stockant les lectures fréquentes en RAM.

## 3. Définitions des termes clés
- Multi-AZ (RDS) : réplication synchrone vers une instance passive dans une autre AZ pour la haute disponibilité.
- Read Replicas : copies asynchrones pour décharger les lectures de l'instance principale.
- OLTP : transactions rapides et atomiques sur quelques lignes (ex. commande e-commerce).
- OLAP : requêtes analytiques complexes sur de gros volumes de colonnes (ex. CA annuel par région).

## 4. Exemple concret
Une boutique en ligne combine :
- Amazon Aurora Multi-AZ pour les commandes et paiements (ACID).
- Amazon DynamoDB pour les paniers et sessions à forte charge.
- Amazon Redshift pour le reporting BI quotidien.

## 5. Comparaisons et pièges d'examen
- RDS vs EC2 : sur EC2 le client gère OS, patchs et sauvegardes ; RDS automatise ces tâches.
- RDS Multi-AZ vs Read Replica : Multi-AZ sert à la haute disponibilité et la bascule en cas de panne ; Read Replica sert à la montée en charge des lectures.
- DynamoDB vs RDS : requêtes SQL relationnelles complexes = RDS ; latence sous 10 ms sans serveur et clé-valeur = DynamoDB.

## 6. Lien avec SQL, Snowflake et Databricks
Amazon Redshift est un entrepôt de données colonnaire similaire à Snowflake : tous deux optimisent les agrégations SQL (SUM, GROUP BY) par rapport aux bases OLTP.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 107 à 120.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel service NoSQL managé sans serveur offre une latence sous 10 ms pour du clé-valeur ?
   - A) Amazon DynamoDB (Bonne réponse).
   - B) Amazon RDS for MySQL.
   - C) Amazon Redshift.
   - D) Amazon Aurora.
2. Quelle est la fonction principale d'un déploiement Amazon RDS Multi-AZ ?
   - A) Assurer la haute disponibilité et la bascule automatique en cas de panne (Bonne réponse).
   - B) Accélérer les requêtes d'agrégation analytique.
   - C) Réduire le coût de facturation de 50 %.
   - D) Permettre des accès anonymes sans authentification IAM.
