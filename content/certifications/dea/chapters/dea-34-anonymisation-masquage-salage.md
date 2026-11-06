# Chapitre 34 : Techniques d Anonymisation, Masquage de Données et Salage de Clés

## 1. Objectifs d'apprentissage
- Maîtriser les méthodes d'anonymisation et de pseudonymisation pour la conformité RGPD/HIPAA.
- Mettre en œuvre le masquage dynamique et statique de colonnes sensibles.
- Comprendre le hachage cryptographique (SHA-256) et l'importance cruciale du salage (salting).
- Utiliser le salage de clés pour résoudre l'asymétrie de données (Data Skew) dans Apache Spark.

## 2. Explication claire : quand choisir quoi
L'ingénieur de données manipule au quotidien des données personnelles et confidentielles qui nécessitent des transformations de protection avant mise à disposition dans les zones de reporting ou les environnements de test :

1. Masquage et Anonymisation de données :
- Masquage statique (Static Masking) :
  - Appliqué lors de la transformation ETL (ex. dans un job AWS Glue ou DataBrew).
  - La valeur originale est altérée définitivement dans la table cible (ex. remplacement de l'email par `j***@domain.com` ou du numéro de téléphone par `+33 6 ** ** ** 12`).
  - Idéal pour alimenter les environnements de test, de recette ou d'entraînement de modèles IA.
- Masquage dynamique (Dynamic Data Masking) :
  - La donnée brute reste intacte dans le stockage, mais la vue SQL ou la politique de sécurité (Lake Formation, Redshift, Snowflake) masque la valeur à la volée en fonction du rôle de l'utilisateur qui exécute la requête.
- Tokenisation (Tokenization) :
  - Remplacement d'une donnée sensible par un jeton aléatoire (token) non dérivable mathématiquement, avec une table de correspondance sécurisée (coffre-fort de tokens) accessible uniquement aux services autorisés.

2. Hachage et Salage cryptographique (Cryptographic Salting) :
- Hachage simple (ex. `SHA-256(email)`) : vulnérable aux attaques par dictionnaire ou tables arc-en-ciel (rainbow tables) : deux utilisateurs ayant le même mot de passe ou la même adresse génèrent exactement le même hash.
- Salage (Salting) : ajout d'une chaîne aléatoire secrète (le sel) à la donnée avant le hachage (`SHA-256(email + secret_salt)`). Rend le déchiffrement inverse et la corrélation statistique impossibles sans connaître le sel secret (stocké dans AWS Secrets Manager).

3. Salage pour la performance Big Data (Key Salting dans Spark) :
- Résout le problème du **Data Skew** (asymétrie de distribution) dans les jointures Spark sur EMR ou Glue :
  - Si une clé de jointure (ex. `pays = 'FR'`) concentre 80 % des données, un seul exécuteur Spark sature et ralentit tout le job.
  - Technique de salage Spark : on concatène un nombre aléatoire entre 1 et N à la clé (`FR_1`, `FR_2`, ..., `FR_N`), répartissant équitablement les données entre N exécuteurs distincts.

## 3. Définitions des termes clés
- Pseudonymisation : traitement de données personnelles de telle sorte qu'elles ne puissent plus être attribuées à une personne sans informations supplémentaires.
- Sel (Salt) : chaîne de données aléatoires combinée à une valeur avant hachage pour en garantir l'unicité et la robustesse.
- Rainbow Table : table précalculée associant des valeurs courantes à leurs empreintes de hachage.

## 4. Exemple concret
Masquage et hachage salé dans un script PySpark Glue :
```python
from pyspark.sql.functions import sha2, concat, lit, regexp_replace

secret_salt = "cle_secrete_kms_987456"

df_anonymise = df_clients \
    .withColumn("email_hashe", sha2(concat("email", lit(secret_salt)), 256)) \
    .withColumn("telephone_masque", regexp_replace("telephone", "\d{6}$", "******")) \
    .drop("email", "nom", "adresse")
```

## 5. Comparaisons et pièges d'examen
- Anonymisation irréversible vs Pseudonymisation : l'anonymisation détruit définitivement le lien d'identification (sort du champ d'application du RGPD) ; la pseudonymisation permet de réidentifier la personne si l'on possède la clé de correspondance ou le sel.
- Oublier le sel lors du hachage de clés à faible cardinalité : piège d'examen classique où un hachage direct d'un code postal ou d'un sexe biologique est trivialement cassé par énumération.

## 6. Lien avec SQL, Snowflake et Databricks
Cette approche correspond directement aux fonctions de masquage de données dynamiques (`CREATE MASKING POLICY`) dans Snowflake et aux filtres de masquage de colonnes gérés par Unity Catalog dans Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 396 à 402.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Pourquoi est-il indispensable d'ajouter un sel secret (salt) lors du hachage unidirectionnel d'adresses email clients destinées à être exposées dans un Data Lake partagé ?
   - A) Pour empêcher la réidentification par attaques par dictionnaire ou tables arc-en-ciel (Bonne réponse).
   - B) Pour convertir automatiquement les données au format Parquet.
   - C) Pour réduire la taille du fichier sur S3 de moitié.
   - D) Pour contourner l'obligation de chiffrement KMS.
2. Dans un job Apache Spark sur AWS Glue, un groupe d'exécuteurs plante régulièrement lors d'une jointure sur la colonne pays car 90 % des lignes contiennent la même valeur. Quelle technique résout ce problème de Data Skew ?
   - A) Le salage de clés (Key Salting) en ajoutant un suffixe aléatoire pour distribuer la charge entre exécuteurs (Bonne réponse).
   - B) La conversion de la table en CSV non compressé.
   - C) La suppression des nœuds de calcul.
   - D) L'activation d'Amazon Macie.
