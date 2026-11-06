# Chapitre 33 : Protection des Données Sensibles : Amazon Macie et AWS Secrets Manager

## 1. Objectifs d'apprentissage
- Identifier automatiquement les données personnelles (PII) et réglementées avec Amazon Macie.
- Configurer des alertes de sécurité lors de la découverte de données non chiffrées ou publiques.
- Sécuriser les identifiants de bases de données avec AWS Secrets Manager.
- Automatiser la rotation périodique des mots de passe sans interruption des pipelines ETL.

## 2. Explication claire : quand choisir quoi
La protection des données d'entreprise repose à la fois sur la détection des fuites de données confidentielles et sur la gestion étanche des identifiants d'accès :

1. Amazon Macie (Découverte et protection des données PII) :
- Qu'est-ce que c'est : un service de sécurité des données utilisant l'apprentissage machine et la correspondance de motifs (pattern matching) pour découvrir, classifier et protéger les données sensibles stockées sur Amazon S3.
- Données sensibles détectées automatiquement :
  - Données d'identification personnelle (PII : Personally Identifiable Information) : numéros de sécurité sociale, noms complets, dates de naissance, adresses postales, numéros de passeport.
  - Données financières : numéros de cartes de crédit, coordonnées bancaires (IBAN).
  - Secrets informatiques : clés privées SSH, clés d'accès AWS, certificats TLS.
- Analyse continue de la posture de sécurité S3 : évalue automatiquement si vos compartiments S3 sont rendus publics par erreur ou ne sont pas chiffrés.
- Intégration EventBridge : lorsqu'une violation critique est découverte (Finding), Macie déclenche un événement EventBridge pour alerter immédiatement l'équipe sécurité ou exécuter une fonction Lambda de remédiation (ex. verrouiller le bucket ou déplacer le fichier suspect en quarantaine).

2. AWS Secrets Manager (Gestion et rotation des identifiants) :
- Qu'est-ce que c'est : service managé conçu pour stocker, gérer et faire tourner les identifiants de bases de données (RDS, Aurora, Redshift), les clés d'API et les jetons OAuth.
- Rotation automatique sans temps d'arrêt :
  - Secrets Manager utilise une fonction AWS Lambda préconfigurée pour changer périodiquement le mot de passe sur la base de données cible (ex. tous les 30 ou 90 jours) et mettre à jour le secret dans le coffre de façon atomique.
  - Vos jobs Glue ETL ou fonctions Lambda interrogent Secrets Manager lors de l'exécution pour récupérer les identifiants à jour via l'API `GetSecretValue`, éliminant définitivement les pannes liées aux changements manuels de mots de passe.

## 3. Définitions des termes clés
- PII (Personally Identifiable Information) : informations permettant d'identifier directement ou indirectement une personne physique.
- Finding (Constat de sécurité) : rapport détaillé généré par Macie décrivant la ressource sensible localisée et son niveau de gravité.
- Rotation Lambda : script sans serveur orchestrant la modification sécurisée des identifiants entre Secrets Manager et le moteur de base de données.

## 4. Exemple concret
Pipeline sécurisé avec Secrets Manager et détection PII par Macie :
```
[Fichiers clients déposés dans s3://lake-raw/]
                      |
                      v
            [Amazon Macie Scan]
       (Détection numéro de carte bancaire)
                      |
                      v
      [EventBridge Rule -> Alerte SNS Sécurité]

[Job AWS Glue ETL] ---> [Secrets Manager (GetSecretValue)] ---> [Connexion Amazon Redshift]
```

## 5. Comparaisons et pièges d'examen
- Secrets Manager vs SSM Parameter Store : Parameter Store est moins cher et idéal pour les paramètres généraux simples de configuration ; Secrets Manager est le seul service proposant la rotation automatique native des mots de passe de bases de données et une intégration directe avec RDS/Redshift.
- Macie vs Amazon Inspector : Macie analyse le CONTENU des fichiers de données stockés sur S3 (détection de PII) ; Inspector analyse les VULNÉRABILITÉS logicielles des systèmes d'exploitation sur EC2, des images conteneurs ECR et du code des fonctions Lambda.

## 6. Lien avec SQL, Snowflake et Databricks
L'utilisation de Secrets Manager est indispensable pour stocker les jetons d'authentification API de Snowflake ou les tokens d'accès personnels (PAT) Databricks exploités par les scripts d'orchestration de données.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 386 à 395.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Quel service AWS devez-vous activer pour scanner automatiquement vos compartiments Amazon S3 et détecter la présence accidentelle de numéros de cartes de crédit ou de numéros de sécurité sociale non masqués ?
   - A) Amazon Macie (Bonne réponse).
   - B) Amazon Inspector.
   - C) AWS Shield Advanced.
   - D) AWS CloudFormation.
2. Une politique d'entreprise impose que les mots de passe de connexion des pipelines ETL vers Amazon Aurora PostgreSQL soient renouvelés automatiquement tous les 60 jours sans impacter les jobs en cours. Quel service configurez-vous ?
   - A) AWS Secrets Manager avec rotation automatique activée (Bonne réponse).
   - B) Un fichier texte stocké sur GitHub.
   - C) Une variable d'environnement statique dans le code source.
   - D) AWS Systems Manager Parameter Store en mode Standard.
