# Chapitre 35 : Gouvernance Moderne : Amazon SageMaker Catalog et Unified Studio

## 1. Objectifs d'apprentissage
- Comprendre le rôle d'Amazon SageMaker Catalog pour la découverte de données métier (compétence clé DEA-C01 v1.1).
- Découvrir Amazon SageMaker Unified Studio pour les espaces de travail collaboratifs de données et d'IA.
- Maîtriser le suivi du lignage des données et modèles (ML Lineage Tracking).
- Administrer la gouvernance des projets et des accès aux domaines de données.

## 2. Explication claire : quand choisir quoi
La révision version 1.1 du guide DEA-C01 met l'accent sur la convergence entre l'ingénierie des données et l'ingénierie de l'intelligence artificielle grâce aux nouveaux services unifiés :

1. Amazon SageMaker Catalog (DEA-C01 v1.1 - Compétence 2.2.6) :
- Qu'est-ce que c'est : un catalogue de données orienté métier qui enrichit les métadonnées techniques de l'AWS Glue Data Catalog avec du contexte organisationnel, des glossaires métier, des propriétaires de données et des statuts de qualité.
- Intégration transparente : se synchronise avec AWS Glue Data Catalog et AWS Lake Formation pour fournir une vue centralisée des actifs de données de l'entreprise (tables Iceberg, jeux de données S3, modèles d'embeddings, jeux de données de fonctionnalités Feature Store).

2. Amazon SageMaker Unified Studio (DEA-C01 v1.1 - Compétences 4.1.7 et 4.5.6) :
- Qu'est-ce que c'est : environnement de travail unique et collaboratif regroupant les outils d'ingénierie des données, d'analytique et de Machine Learning (remplaçant les interfaces fragmentées).
- Domaines et Projets :
  - Domaine (Domain) : périmètre organisationnel configuré au niveau de l'entreprise ou d'une direction (ex. Direction Data & IA), intégrant l'authentification d'entreprise (IAM Identity Center / SSO).
  - Projets (Projects) : espaces de travail isolés par équipe ou par cas d'usage associant des personnes, des ressources de calcul, des accès aux données et des règles de gouvernance strictes.
  - Gestion des accès simplifiée : l'accès aux données du catalogue est accordé directement au niveau du projet, éliminant la complexité de configurer manuellement des dizaines de rôles IAM individuels.

3. Traçabilité et Lignage (ML Lineage Tracking) :
- Enregistre l'arbre généalogique complet des données : quel fichier source S3 a été consommé par quel job Glue ETL, quelle table Iceberg a été produite, et quel modèle d'apprentissage machine ou base vectorielle a été entraîné avec cette version exacte de données.
- Indispensable pour la conformité réglementaire (ex. AI Act européen) et l'auditabilité des résultats d'inférence.

## 3. Définitions des termes clés
- ML Lineage : traçabilité de bout en bout des étapes de transformation de données, des artefacts et des modèles.
- SageMaker Feature Store : référentiel centralisé pour stocker, partager et servir des variables précalculées (features) pour l'entraînement et l'inférence temps réel.
- Data Product (Produit de données) : ensemble de données documenté, certifié et maintenu par une équipe métier spécifique au sein du catalogue.

## 4. Exemple concret
Cycle de vie de gouvernance dans SageMaker Unified Studio :
```
[Data Lake S3 / Tables Iceberg]
             |
   [Glue Data Catalog]
             |
   [SageMaker Catalog (Glossaire métier, Propriétaire, Score DQDL)]
             |
             v
[SageMaker Unified Studio (Domaine Data)]
   ├── [Projet Détection Fraude] -> Accès restreint aux transactions bancaires
   └── [Projet Recommandation E-commerce] -> Accès restreint aux clics Web
```

## 5. Comparaisons et pièges d'examen
- SageMaker Catalog vs Glue Data Catalog : Glue Data Catalog est le catalogue de métadonnées techniques (schémas, types de colonnes, partitions physiques) utilisé par les moteurs d'exécution (Athena, Spark, Redshift) ; SageMaker Catalog est la couche de gouvernance métier et d'exploration fonctionnelle partagée entre équipes data et IA.
- Partage de données : SageMaker Catalog et Lake Formation s'intègrent pour permettre le partage de données inter-projets sans réplication physique.

## 6. Lien avec SQL, Snowflake et Databricks
SageMaker Catalog et Unified Studio correspondent directement à l'expérience unifiée de Databricks Unity Catalog et aux fonctionnalités de Data Clean Rooms et d'Object Tagging de Snowflake Horizon.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 403 à 410.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Quelle plateforme unifiée introduite dans la révision DEA-C01 v1.1 permet d'organiser les espaces de travail par domaines et projets avec gestion centralisée des accès aux actifs de données et d'IA ?
   - A) Amazon SageMaker Unified Studio (Bonne réponse).
   - B) AWS Cloud9.
   - C) Amazon WorkSpaces classique.
   - D) AWS OpsWorks Stacks.
2. Quel composant permet de retracer avec précision quel jeu de données Amazon S3 et quel job d'ingestion ont servi à générer une table de caractéristiques analytiques pour un audit de conformité ?
   - A) Le suivi de lignage (ML Lineage Tracking) (Bonne réponse).
   - B) Les métriques de facturation AWS Budgets.
   - C) Le cache DynamoDB DAX.
   - D) Le fichier de configuration du VPC Internet Gateway.
