# Chapitre 3 : Modèle de Responsabilité Partagée AWS

## 1. Objectifs d'apprentissage
- Comprendre la démarcation entre la sécurité DU cloud (AWS) et la sécurité DANS le cloud (Client).
- Identifier les responsabilités selon le type de service : IaaS (EC2), PaaS/Géré (RDS), SaaS/Serverless (S3, Lambda, DynamoDB).
- Savoir qui applique les correctifs du système d'exploitation invité vs de l'hyperviseur hôte.
- Connaître le rôle d'AWS Artifact pour consulter les rapports de conformité tiers.

## 2. Explication claire : quand choisir quoi
La règle d'or d'AWS stipule :
- Sécurité DU Cloud (Security OF the Cloud) : responsabilité exclusive d'AWS. Cela englobe la protection physique des centres de données (gardes, biométrie, caméras), le matériel informatique (serveurs physiques, disques défaillants détruits selon les normes NIST), l'infrastructure réseau sous-jacente et les logiciels d'hyperviseurs.
- Sécurité DANS le Cloud (Security IN the Cloud) : responsabilité du client. Cela inclut la gestion des identités et des accès (IAM, mots de passe, MFA), la configuration des pare-feu réseau (Security Groups, NACL), le chiffrement des données (au repos et en transit), et la mise à jour des logiciels applicatifs et des systèmes d'exploitation sur les instances gérées.

Variation selon les modèles de service :
- IaaS (ex. Amazon EC2) : responsabilité client maximale. Le client installe et met à jour l'OS, configure les correctifs de sécurité, gère les logiciels et les pare-feu. AWS gère l'hyperviseur et le matériel.
- PaaS / Services managés (ex. Amazon RDS) : responsabilité partagée équilibrée. AWS gère l'OS sous-jacent, applique les correctifs de la base de données et gère les sauvegardes automatisées. Le client configure les accès utilisateurs, les Security Groups et le chiffrement des tables.
- Serverless / Abstraction complète (ex. Amazon S3, DynamoDB, AWS Lambda) : responsabilité client minimale sur l'infrastructure. AWS gère tout le cycle de vie de l'environnement d'exécution et la tolérance aux pannes. Le client est uniquement responsable des données, des droits d'accès IAM et des politiques de compartiment.

## 3. Définitions des termes clés
- AWS Artifact : portail libre-service gratuit dans la console AWS fournissant un accès direct et confidentiel aux rapports de conformité de sécurité (SOC 1/2/3, ISO 27001, PCI-DSS) et aux accords juridiques (BAA HIPAA).
- Chiffrement côté client (Client-side encryption) : le client chiffre les données avant leur transmission vers AWS.
- Chiffrement côté serveur (Server-side encryption SSE) : AWS chiffre automatiquement les données dès réception sur ses disques avec une clé gérée par S3, KMS ou le client.

## 4. Exemple concret
Une entreprise déploie une base de données sur une instance EC2 personnalisée. Qui est responsable d'installer les patchs de sécurité Linux ? Le client, car EC2 est une offre IaaS. Si l'entreprise migre vers Amazon Aurora ou RDS, AWS devient automatiquement responsable des patchs de l'OS et de l'hyperviseur.

## 5. Comparaisons et pièges d'examen
- Correctifs du système d'exploitation : sur EC2, c'est le client ; sur RDS, c'est AWS ; sur Lambda, c'est AWS.
- Chiffrement des données dans un compartiment S3 : AWS fournit les mécanismes de chiffrement (SSE-S3, SSE-KMS), mais c'est le client qui doit configurer ou activer la règle de chiffrement par défaut.
- Destruction physique des disques défaillants : c'est 100 % la responsabilité d'AWS. Un client ne peut jamais visiter un centre de données AWS pour inspecter un disque.

## 6. Lien avec SQL, Snowflake et Databricks
Lorsque vous utilisez Snowflake sur AWS, vous opérez sur un modèle SaaS où la gestion du stockage S3 et des machines virtuelles EC2 sous-jacentes est entièrement déléguée à Snowflake et AWS. Vous n'avez que la responsabilité de vos schémas, requêtes SQL et droits RBAC.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 137 à 140.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Selon le modèle de responsabilité partagée, quelle tâche incombe TOUJOURS à AWS ?
   - A) La destruction physique des disques durs défaillants (Bonne réponse).
   - B) La mise à jour du système d'exploitation invité sur EC2.
   - C) La configuration des groupes de sécurité.
   - D) La gestion des comptes utilisateurs IAM.
2. Quel service permet de télécharger les rapports d'audit de conformité ISO et SOC d'AWS ?
   - A) AWS Artifact (Bonne réponse).
   - B) AWS Secrets Manager.
   - C) AWS Shield.
   - D) Amazon Inspector.
