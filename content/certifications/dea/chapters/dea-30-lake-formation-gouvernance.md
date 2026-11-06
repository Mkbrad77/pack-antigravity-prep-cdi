# Chapitre 30 : Gouvernance Centralisée et Contrôle d Accès Fin avec AWS Lake Formation

## 1. Objectifs d'apprentissage
- Comprendre le rôle d'AWS Lake Formation au-dessus de l'AWS Glue Data Catalog.
- Configurer le contrôle d'accès granulaire au niveau colonne, ligne (RLS) et cellule.
- Maîtriser le contrôle d'accès basé sur des balises (LF-TBAC : Lake Formation Tag-Based Access Control).
- Exploiter le mode d'accès hybride (Hybrid Access Mode) pour les migrations sans rupture (DEA-C01 v1.1).

## 2. Explication claire : quand choisir quoi
Avant AWS Lake Formation, sécuriser un Data Lake exigeait de gérer des politiques de buckets S3 et des préfixes complexes. Lake Formation simplifie et centralise la gouvernance de données :

1. AWS Lake Formation :
- Qu'est-ce que c'est : un service de gouvernance unifiée qui applique des permissions fines sur les bases et tables du catalogue Glue sans toucher aux fichiers S3.
- Niveaux de granularité du contrôle d'accès :
  - Niveau table : accorder `SELECT` sur toute la table.
  - Niveau colonne (Column-level security) : autoriser ou interdire des colonnes spécifiques (ex. exclure la colonne `salaire` pour le groupe Analystes).
  - Niveau ligne (Row-level security - RLS) : définir des filtres de données (Data Filters) pour n'afficher que certaines lignes (ex. `pays = 'FR'`).
  - Niveau cellule (Cell-level security) : combinaison du filtrage de lignes et de colonnes.

2. Contrôle d'accès basé sur des balises (LF-TBAC) :
- Au lieu d'assigner des permissions ressource par ressource, vous définissez des balises LF-tags (ex. `Confidentialite=Haute`, `Departement=Finance`).
- Vous assignez des LF-tags aux bases, tables et colonnes, puis vous autorisez les utilisateurs ou rôles IAM sur les valeurs de ces balises.
- Avantage : évolutivité infinie. Lorsqu'une nouvelle table est créée avec la balise `Departement=Finance`, tous les membres du département Finance y ont accès automatiquement sans modification de politique.

3. Mode d'accès hybride (Hybrid Access Mode - DEA-C01 v1.1) :
- Permet de migrer progressivement vers les permissions Lake Formation sans casser les permissions IAM existantes.
- Les utilisateurs disposant de permissions IAM directes sur S3 continuent de fonctionner, tandis que les nouveaux utilisateurs ou services sont régis par les permissions fines Lake Formation.

## 3. Définitions des termes clés
- Data Filter : objet Lake Formation spécifiant les colonnes visibles et la condition SQL de filtrage des lignes.
- LF-tag : clé-valeur de métadonnées de gouvernance rattachée à des ressources du catalogue de données.
- Principal Lake Formation : utilisateur IAM, rôle IAM ou utilisateur SAML recevant des privilèges de gouvernance.

## 4. Exemple concret
Architecture de gouvernance fine avec Lake Formation :
```
                  [AWS Glue Data Catalog]
                             |
                [AWS Lake Formation Engine]
                             |
        +--------------------+--------------------+
        |                                         |
  [Groupe RH]                               [Groupe Ventes]
  - Colonnes : Toutes                       - Colonnes : Sans salaire ni SSN
  - Lignes : Tous pays                      - Lignes : Filtre pays = 'FR'
```

## 5. Comparaisons et pièges d'examen
- Règle de révocation `IAMAllowedPrincipals` : par défaut, le catalogue Glue hérite d'un groupe spécial appelé `IAMAllowedPrincipals` qui court-circuite Lake Formation. Pour que les règles de sécurité fines de Lake Formation soient réellement appliquées, vous DEVEZ supprimer les permissions accordées à `IAMAllowedPrincipals` sur la table ou base de données.
- Moteurs compatibles avec Lake Formation : Amazon Athena, Amazon Redshift Spectrum, AWS Glue ETL et Amazon EMR (avec intégration spécifique) supportent tous nativement l'application des règles Lake Formation.

## 6. Lien avec SQL, Snowflake et Databricks
Lake Formation joue exactement le même rôle centralisateur que Databricks Unity Catalog ou le système de balises et de politiques de masquage de données (Tag-based Masking Policies) dans Snowflake.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 140 à 147.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Vous devez vous assurer que les analystes d'un département Marketing puissent interroger une table de clients sous Amazon Athena sans pouvoir visualiser les colonnes contenant le numéro de sécurité sociale et l'adresse email. Quel service et fonctionnalité devez-vous configurer ?
   - A) AWS Lake Formation avec des permissions au niveau de la colonne (Column-Level Security) (Bonne réponse).
   - B) Une règle de cycle de vie Amazon S3.
   - C) Un groupe de sécurité VPC sans passerelle Internet.
   - D) Une alerte métrique Amazon CloudWatch.
2. Pour que les permissions d'accès fines définies dans AWS Lake Formation s'appliquent effectivement à une table du catalogue, quelle action préalable est impérative ?
   - A) Révoquer les permissions attribuées au groupe par défaut IAMAllowedPrincipals sur la ressource (Bonne réponse).
   - B) Supprimer définitivement le compartiment S3 sous-jacent.
   - C) Réinstaller les drivers ODBC de chaque client.
   - D) Arrêter le moteur Redshift.
