# Chapitre 4 : Gestion des Identités et des Accès (AWS IAM)

## 1. Objectifs d'apprentissage
- Différencier compte racine (Root user), utilisateurs IAM, groupes d'utilisateurs et rôles IAM.
- Appliquer les règles de sécurité fondamentales (MFA, clé d'accès programmatique vs mot de passe console).
- Comprendre les politiques IAM (documents JSON) et le principe de moindre privilège.
- Utiliser AWS Organizations et les politiques de contrôle des services (SCP) pour la gouvernance multi-comptes.

## 2. Explication claire : quand choisir quoi
AWS Identity and Access Management (IAM) est le service central et gratuit permettant de contrôler qui est authentifié et autorisé à utiliser les ressources dans un compte AWS.

Les composants clés d'IAM :
- Utilisateur racine (Root user) : créé lors de la création du compte avec une adresse email et un mot de passe. Il dispose d'un accès absolu non restreint. Bonne pratique absolue : verrouiller le compte racine avec l'authentification multi-facteurs (MFA), ne pas créer de clés d'accès pour la racine, et ne jamais l'utiliser pour les tâches d'administration quotidienne.
- Utilisateur IAM : identité représentant une personne ou une application nécessitant un accès régulier à AWS.
- Groupe d'utilisateurs IAM : ensemble d'utilisateurs partageant les mêmes fonctions (ex. groupe Développeurs, groupe Administrateurs) facilitant l'attribution des permissions collectives.
- Rôle IAM : identité temporaire sans mot de passe permanent, pouvant être assumée par une ressource AWS (ex. une instance EC2 qui doit lire dans un compartiment S3) ou par un utilisateur fédéré externe (Single Sign-On).
- Politique IAM (Policy) : document JSON accordant explicitement des permissions selon la syntaxe Effect (Allow/Deny), Action, Resource et Condition. En l'absence d'autorisation explicite, tout accès est refusé par défaut (Implicit Deny). Un Deny explicite l'emporte toujours sur un Allow.

## 3. Définitions des termes clés
- MFA (Multi-Factor Authentication) : mécanisme exigeant au moins deux facteurs d'authentification (mot de passe + code éphémère sur application mobile ou clé FIDO matérielle).
- Moindre Privilège (Principle of Least Privilege) : principe de sécurité accordant strictement le minimum de permissions nécessaires pour accomplir une mission donnée.
- Clés d'accès (Access Key ID et Secret Access Key) : identifiants utilisés pour signer les requêtes vers l'AWS CLI, les SDKs ou les APIs REST, ne devant jamais être partagés ni publiés sur GitHub.
- SCP (Service Control Policies) : politiques de gouvernance dans AWS Organizations définissant les permissions maximales autorisées pour les comptes membres d'une organisation.

## 4. Exemple concret
Politique IAM accordant un accès en lecture seule à un compartiment S3 spécifique :
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::mon-data-lake-auren",
        "arn:aws:s3:::mon-data-lake-auren/*"
      ]
    }
  ]
}
```

## 5. Comparaisons et pièges d'examen
- Utilisateur IAM vs Rôle IAM : pour un humain accédant à la console, créer un utilisateur avec mot de passe et MFA ; pour une application s'exécutant sur EC2 ou Lambda, TOUJOURS attribuer un rôle IAM avec des identifiants temporaires renouvelés automatiquement (jamais de clés d'accès codées en dur).
- Groupe IAM : un groupe ne peut pas contenir d'autres groupes (pas d'imbrication) et un groupe ne peut pas être désigné comme ressource principale dans une politique.
- SCP vs Politique IAM : une SCP ne donne pas de droits par elle-même, elle restreint les droits maximaux possibles. Si une SCP interdit `s3:*`, même l'administrateur du compte membre ne peut pas accéder à S3.

## 6. Lien avec SQL, Snowflake et Databricks
Dans Snowflake, le concept de rôle (ACCOUNTADMIN, SYSADMIN, DATA_ENGINEER) est similaire aux rôles IAM : les utilisateurs ne reçoivent jamais de privilèges directs sur les tables, mais héritent de permissions via leurs rôles attribués.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 141 à 150.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quelle est la méthode recommandée pour permettre à une instance EC2 d'écrire des fichiers dans S3 en toute sécurité ?
   - A) Attribuer un rôle IAM à l'instance EC2 (Bonne réponse).
   - B) Enregistrer la clé d'accès secrète de la racine dans le code de l'application.
   - C) Ouvrir le compartiment S3 au public en écriture anonyme.
   - D) Créer un utilisateur IAM pour chaque requête HTTP.
2. Si une politique IAM autorise l'accès à une table DynamoDB mais qu'une SCP de l'organisation applique un Deny sur DynamoDB, quelle est l'issue ?
   - A) L'accès est refusé, car un refus explicite l'emporte toujours (Bonne réponse).
   - B) L'accès est autorisé car la politique locale est prioritaire.
   - C) L'accès est différé de 24 heures.
   - D) Une alerte CloudWatch est levée et l'accès est accordé en lecture seule.
