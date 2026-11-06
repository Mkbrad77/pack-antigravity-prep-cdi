# Chapitre 26 : Automatisation et Déploiement : CloudFormation, AWS CDK et SSM

## 1. Objectifs d'apprentissage
- Comprendre l'Infrastructure as Code (IaC) avec AWS CloudFormation et AWS CDK.
- Déployer des architectures Data reproductibles (S3, Glue, Athena, Step Functions).
- Sécuriser et centraliser les variables de configuration avec AWS Systems Manager Parameter Store.
- Appliquer les bonnes pratiques CI/CD aux pipelines de données (environnements dev, test, prod).

## 2. Explication claire : quand choisir quoi
L'industrialisation des plateformes de données exige que toutes les infrastructures soient versionnées dans Git et déployées automatiquement sans action manuelle dans la console :

1. AWS CloudFormation :
- Qu'est-ce que c'est : le service d'IaC fondamental d'AWS permettant de décrire l'ensemble de vos ressources dans des fichiers modèles déclaratifs JSON ou YAML.
- Avantages : déploiements atomiques (tout réussit ou CloudFormation effectue un rollback automatique à l'état précédent), reproductibilité exacte entre environnements dev, test et prod, détection des dérives de configuration (Drift Detection).
- Exemples de ressources data gérées : tables Glue Catalog, compartiments S3, machines à états Step Functions, clusters Redshift, sujets SNS.

2. AWS Cloud Development Kit (AWS CDK) :
- Qu'est-ce que c'est : framework de développement open source permettant de définir votre infrastructure cloud en utilisant des langages de programmation modernes et familiers (TypeScript, Python, Java).
- Fonctionnement : le code CDK compile et synthétise des modèles AWS CloudFormation robustes.
- Avantages en Data Engineering : permet d'écrire des abstractions réutilisables (Constructs) encapsulant les bonnes pratiques de sécurité (ex. un Construct `SecureDataLakeBucket` activant automatiquement le chiffrement KMS, le blocage public et les règles de cycle de vie).

3. AWS Systems Manager Parameter Store (SSM) :
- Qu'est-ce que c'est : magasin sécurisé et hautement disponible de gestion des paramètres de configuration et secrets légers.
- Types de paramètres :
  - `String` : chaînes de caractères standards (ex. URLs d'API, noms de compartiments S3, chemins de données).
  - `StringList` : listes de valeurs séparées par des virgules.
  - `SecureString` : chaînes de caractères automatiquement chiffrées au repos via AWS KMS (ex. jetons d'accès, mots de passe).
- Cas d'usage Data : centraliser les chemins S3 et les identifiants d'environnements pour que les scripts Glue ou les fonctions Lambda n'aient jamais de valeurs en dur dans leur code source.

## 3. Définitions des termes clés
- Stack (Pile) : ensemble de ressources AWS gérées comme une unité unique par CloudFormation.
- Drift Detection : fonctionnalité comparant la configuration réelle des ressources avec le modèle CloudFormation pour repérer les modifications manuelles non tracées.
- Construct CDK : composant de base d'une application CDK représentant une ressource unique ou une architecture complète.

## 4. Exemple concret
Modèle CloudFormation déployant un compartiment S3 sécurisé et une table Glue :
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Infrastructure Data Lake S3 et Glue
Resources:
  DataLakeRawBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "datalake-raw-${AWS::AccountId}"
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256

  RawDatabase:
    Type: AWS::Glue::Database
    Properties:
      CatalogId: !Ref AWS::AccountId
      DatabaseInput:
        Name: raw_data_db
```

## 5. Comparaisons et pièges d'examen
- CloudFormation vs CDK : CDK utilise du vrai code (Python, TypeScript) avec boucles et typage pour générer des modèles CloudFormation ; CloudFormation est le moteur d'exécution sous-jacent qui déploie les stacks.
- SSM Parameter Store vs Secrets Manager : SSM Parameter Store est idéal pour la configuration générale et les paramètres simples à faible coût ; Secrets Manager est spécialisé dans les secrets de bases de données avec rotation automatique native et chiffrement KMS obligatoire.

## 6. Lien avec SQL, Snowflake et Databricks
CloudFormation et CDK jouent le même rôle d'IaC que Terraform appliqué aux ressources Snowflake (création de warehouses, rôles et bases) ou aux workspaces Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 326 à 335.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Quel outil permet à un ingénieur data d'écrire son infrastructure de pipeline (S3, Glue, Lambda) directement en Python tout en bénéficiant de la tolérance aux pannes et des rollbacks automatiques de CloudFormation ?
   - A) AWS Cloud Development Kit (AWS CDK) (Bonne réponse).
   - B) AWS OpsWorks.
   - C) Amazon QuickSight.
   - D) Une commande curl manuelle.
2. Quel service AWS est le plus adapté et économique pour stocker et distribuer des paramètres de configuration de pipelines sans valeurs codées en dur dans les scripts Glue ?
   - A) AWS Systems Manager Parameter Store (Bonne réponse).
   - B) Amazon DynamoDB Accelerator (DAX).
   - C) Amazon FSx for Lustre.
   - D) Amazon S3 Glacier Deep Archive.
