import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const CLF_DIR = path.join(ROOT_DIR, 'content', 'certifications', 'clf');
const CHAPTERS_DIR = path.join(CLF_DIR, 'chapters');
const FICHES_DIR = path.join(CLF_DIR, 'fiches_express');

fs.mkdirSync(CHAPTERS_DIR, { recursive: true });
fs.mkdirSync(FICHES_DIR, { recursive: true });

// --- 1. CHAPITRES CLF-C02 ---
const CHAPTERS = [
  {
    id: 'clf-01-concepts-cloud',
    title: 'Concepts Fondamentaux du Cloud et Économie AWS',
    domain: 'D1',
    topic_id: 'cloud-concepts-valeur',
    content: `# Chapitre 1 : Concepts Fondamentaux du Cloud et Économie AWS

## 1. Objectifs d'apprentissage
- Comprendre la définition officielle du Cloud Computing selon le NIST et AWS.
- Maîtriser les 6 avantages majeurs du Cloud AWS (agilité, économies d'échelle, élasticité, etc.).
- Distinguer dépenses d'investissement (CapEx) et dépenses opérationnelles (OpEx).
- Identifier les modèles de déploiement (Public, Privé, Hybride) et de services (IaaS, PaaS, SaaS).

## 2. Explication claire : quand choisir quoi
Le Cloud Computing représente la mise à disposition à la demande de ressources informatiques (serveurs, stockage, bases de données, réseau) via Internet avec une tarification au paiement à l'usage.
Plutôt que d'investir des millions d'euros dans des centres de données physiques sans certitude sur la charge future (CapEx : Capital Expenditure), les organisations louent les capacités nécessaires et ne paient que ce qu'elles consomment à la seconde (OpEx : Operational Expenditure).

Quand choisir quel modèle :
- Modèle Cloud Public : pour les entreprises recherchant une évolutivité infinie, une haute disponibilité native et l'absence totale de gestion de matériel physique.
- Modèle Hybride : pour les organisations conservant des systèmes patrimoniaux ou des contraintes réglementaires sur site tout en étendant leurs applications via AWS Direct Connect ou AWS Storage Gateway.
- Modèle Cloud Privé (sur site) : pour les entités ayant des exigences souveraines strictes, sans mutualisation multi-locataires.

Les 6 avantages majeurs du cloud AWS à retenir pour l'examen :
1. Remplacer les dépenses d'investissement par des dépenses variables (trade capital expense for variable expense).
2. Bénéficier d'économies d'échelle massives grâce aux millions de clients AWS.
3. Arrêter de deviner la capacité nécessaire : élasticité automatique selon la demande réelle.
4. Augmenter la vitesse et l'agilité : déploiement en quelques clics en quelques minutes.
5. Cesser de dépenser de l'argent pour faire fonctionner des centres de données (foyer de coûts non différenciateur).
6. Déployer à l'échelle mondiale en quelques minutes grâce aux régions réparties sur tous les continents.

## 3. Définitions des termes clés
- Haute Disponibilité (High Availability) : capacité d'un système à rester opérationnel sans interruption notable, généralement par redondance multi-AZ.
- Élasticité (Elasticity) : capacité d'allouer ou de libérer dynamiquement des ressources en fonction de la charge (ex. Auto Scaling).
- Scalabilité / Évolutivité (Scalability) : capacité à absorber une charge croissante en montant en puissance (verticale) ou en nombre d'instances (horizontale).
- Tolérance aux pannes (Fault Tolerance) : capacité à continuer à fonctionner même en cas de défaillance d'un composant matériel ou réseau.

## 4. Exemple concret
Calculateur TCO / AWS Pricing Calculator :
Une entreprise hésite entre acheter 10 serveurs physiques (coût initial 80 000 USD, amortissement 3 ans, électricité, baie réseau, maintenance d'un technicien) et démarrer 10 instances EC2 m6i.large (facturées à l'heure, sans engagement, arrêtables la nuit). Avec AWS, l'arrêt des instances hors heures ouvrées réduit la facture de 60 % immédiatement.

## 5. Comparaisons et pièges d'examen
- Élasticité vs Scalabilité : l'élasticité est le caractère dynamique (croître ET décroître automatiquement) ; la scalabilité est la capacité globale d'un système à grandir.
- Haute disponibilité vs Tolérance aux pannes : la tolérance aux pannes garantit zéro temps d'arrêt (coût élevé, duplication stricte) ; la haute disponibilité tolère une dégradation mineure ou une bascule rapide de quelques secondes.
- Agilité vs Économies d'échelle : l'agilité concerne le temps de mise sur le marché d'une innovation (time to market) ; les économies d'échelle concernent la baisse continue des prix par AWS.

## 6. Lien avec SQL, Snowflake et Databricks
Dans Snowflake, la séparation totale du stockage et du calcul illustre parfaitement ce concept : vous pouvez démarrer un entrepôt virtuel X-Large pour exécuter une requête SQL lourde en 30 secondes, puis l'éteindre immédiatement pour ne payer que 30 secondes de calcul.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 1 à 13.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel avantage du Cloud permet d'arrêter de deviner la capacité requise ?
   - A) L'élasticité (Bonne réponse).
   - B) La réplication multi-régions.
   - C) Le chiffrement au repos.
   - D) L'adressage IP élastique.
2. Quelle expression décrit le passage d'investissements matériels lourds à des frais d'exploitation variables ?
   - A) Remplacement de CapEx par OpEx (Bonne réponse).
   - B) Remplacement d'OpEx par CapEx.
   - C) Modèle sans serveur (Serverless).
   - D) Amortissement dégressif.
`
  },
  {
    id: 'clf-02-well-architected',
    title: 'AWS Well-Architected Framework et ses 6 Piliers',
    domain: 'D1',
    topic_id: 'well-architected',
    content: `# Chapitre 2 : AWS Well-Architected Framework et ses 6 Piliers

## 1. Objectifs d'apprentissage
- Identifier et définir les 6 piliers officiels du Well-Architected Framework.
- Connaître les principes de conception directeurs pour chaque pilier.
- Savoir quel service AWS répond aux objectifs de chaque pilier lors d'un scénario d'examen.
- Utiliser l'outil AWS Well-Architected Tool pour mesurer les risques d'architecture.

## 2. Explication claire : quand choisir quoi
Le Well-Architected Framework fournit une méthode structurée pour évaluer et concevoir des architectures cloud fiables, sécurisées, performantes et économiques. Il repose sur 6 piliers fondamentaux :

1. Excellence Opérationnelle (Operational Excellence) :
   - Objectif : exécuter et surveiller les systèmes pour apporter de la valeur métier et améliorer continuellement les processus.
   - Principes clés : automatiser les opérations avec du code (IaC via CloudFormation), anticiper les pannes, effectuer de petits changements réversibles fréquents.
2. Sécurité (Security) :
   - Objectif : protéger les informations, les systèmes et les actifs tout en respectant la conformité.
   - Principes clés : appliquer le moindre privilège (IAM), sécuriser toutes les couches (défense en profondeur), chiffrer les données au repos et en transit, automatiser les contrôles de sécurité.
3. Fiabilité (Reliability) :
   - Objectif : garantir qu'une charge de travail fonctionne comme prévu et récupère rapidement des pannes.
   - Principes clés : tester les procédures de reprise, basculer automatiquement sur des ressources redondantes (Multi-AZ, Auto Scaling), concevoir des systèmes distribués tolérants aux pannes.
4. Efficacité des Performances (Performance Efficiency) :
   - Objectif : utiliser efficacement les ressources informatiques pour répondre aux exigences et maintenir cette efficacité face aux évolutions technologiques.
   - Principes clés : démocratiser les technologies avancées (IA managée, bases NoSQL), adopter des architectures sans serveur (Serverless), tester à l'échelle de la production.
5. Optimisation des Coûts (Cost Optimization) :
   - Objectif : exécuter les systèmes au coût le plus bas possible tout en apportant une valeur maximale.
   - Principes clés : mesurer l'efficacité globale, adopter un modèle de consommation souple (Savings Plans, Spot), analyser les dépenses avec Cost Explorer.
6. Durabilité (Sustainability) :
   - Objectif : minimiser l'impact environnemental des charges de travail cloud (empreinte carbone).
   - Principes clés : comprendre son impact, maximiser l'utilisation des ressources pour éviter le gaspillage, adopter de nouveaux processeurs économes en énergie (AWS Graviton).

## 3. Définitions des termes clés
- AWS Well-Architected Tool : service gratuit de la console AWS permettant de passer en revue ses charges de travail contre les questions des 6 piliers et de générer un plan d'action.
- Graviton : processeurs ARM conçus par AWS offrant jusqu'à 60 % de consommation énergétique en moins pour une performance supérieure.
- RPO (Recovery Point Objective) : volume maximal de données qu'une organisation peut tolérer de perdre lors d'un sinistre (exprimé en temps).
- RTO (Recovery Time Objective) : durée maximale admissible pour restaurer un service après une panne.

## 4. Exemple concret
Pour le pilier Fiabilité et Sécurité : une application Web critique déploie son groupe Auto Scaling sur 3 zones de disponibilité derrière un Application Load Balancer, ses données sur Amazon Aurora Multi-AZ avec réplication synchrone, et applique le chiffrement KMS avec des rôles IAM dédiés sans clés d'accès codées en dur.

## 5. Comparaisons et pièges d'examen
- Pilier Fiabilité vs Excellence Opérationnelle : la reprise après incident (Disaster Recovery) relève de la Fiabilité ; la gestion des déploiements sans interruption et l'automatisation des patchs relèvent de l'Excellence Opérationnelle.
- Pilier Optimisation des Coûts vs Efficacité des Performances : choisir une instance plus petite pour économiser est une question de Coût ; choisir un type d'instance optimisé pour la mémoire (famille R) pour accélérer une requête est une question de Performance.
- Durabilité : tout scénario mentionnant la réduction de l'empreinte carbone ou l'utilisation de Graviton cible le pilier Durabilité.

## 6. Lien avec SQL, Snowflake et Databricks
Le pilier Optimisation des coûts correspond aux règles de suspension automatique des entrepôts Snowflake (auto-suspend = 60 secondes). Le pilier Durabilité correspond au choix de clusters éphémères dans Databricks plutôt que de maintenir des machines allumées 24/7.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 197 à 199.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel pilier met l'accent sur l'anticipation des pannes et les petits changements réversibles ?
   - A) Excellence opérationnelle (Bonne réponse).
   - B) Sécurité.
   - C) Efficacité des performances.
   - D) Durabilité.
2. L'adoption des processeurs AWS Graviton pour réduire la consommation d'énergie soutient quel pilier ?
   - A) Durabilité (Bonne réponse).
   - B) Fiabilité.
   - C) Sécurité.
   - D) Excellence opérationnelle.
`
  },
  {
    id: 'clf-03-responsabilite-partagee',
    title: 'Modèle de Responsabilité Partagée AWS',
    domain: 'D2',
    topic_id: 'modele-responsabilite-partagee',
    content: `# Chapitre 3 : Modèle de Responsabilité Partagée AWS

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
`
  },
  {
    id: 'clf-04-iam-acces',
    title: 'Gestion des Identités et des Accès (AWS IAM)',
    domain: 'D2',
    topic_id: 'iam',
    content: `# Chapitre 4 : Gestion des Identités et des Accès (AWS IAM)

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
\`\`\`json
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
\`\`\`

## 5. Comparaisons et pièges d'examen
- Utilisateur IAM vs Rôle IAM : pour un humain accédant à la console, créer un utilisateur avec mot de passe et MFA ; pour une application s'exécutant sur EC2 ou Lambda, TOUJOURS attribuer un rôle IAM avec des identifiants temporaires renouvelés automatiquement (jamais de clés d'accès codées en dur).
- Groupe IAM : un groupe ne peut pas contenir d'autres groupes (pas d'imbrication) et un groupe ne peut pas être désigné comme ressource principale dans une politique.
- SCP vs Politique IAM : une SCP ne donne pas de droits par elle-même, elle restreint les droits maximaux possibles. Si une SCP interdit \`s3:*\`, même l'administrateur du compte membre ne peut pas accéder à S3.

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
`
  },
  {
    id: 'clf-05-securite-services',
    title: 'Services de Protection, Chiffrement et Sécurité Avancée',
    domain: 'D2',
    topic_id: 'macie-secrets-waf',
    content: `# Chapitre 5 : Services de Protection, Chiffrement et Sécurité Avancée

## 1. Objectifs d'apprentissage
- Identifier les services de protection périmétrique et réseau (AWS WAF, AWS Shield Standard et Advanced).
- Comprendre la détection des menaces et l'analyse des vulnérabilités (Amazon GuardDuty, Amazon Inspector).
- Protéger les données sensibles et les identifiants (Amazon Macie, AWS Secrets Manager, AWS KMS).
- Reconnaître les cas d'usage de gestion des certificats et de détection automatique des anomalies.

## 2. Explication claire : quand choisir quoi
AWS propose une panoplie de services de sécurité spécialisés pour chaque périmètre de défense :

Protection périmétrique :
- AWS Shield Standard : protection automatique et gratuite contre les attaques DDoS courantes de couche 3 (réseau) et couche 4 (transport), active par défaut pour tous les clients.
- AWS Shield Advanced : protection payante renforcée contre les attaques DDoS volumineuses, avec accès 24/7 à l'équipe de réponse aux menaces (SRT) et protection financière contre les pics de coûts.
- AWS WAF (Web Application Firewall) : pare-feu applicatif de couche 7 filtrant les requêtes HTTP/HTTPS malveillantes (injections SQL, Cross-Site Scripting XSS, blocage par adresse IP ou pays).

Surveillance et détection :
- Amazon GuardDuty : service d'analyse des menaces utilisant le Machine Learning pour surveiller en continu les flux VPC Flow Logs, les journaux DNS et CloudTrail afin de repérer des activités suspectes (minage de cryptomonnaies, accès non autorisés).
- Amazon Inspector : scanner automatisé de vulnérabilités pour les instances EC2, les images de conteneurs dans ECR et les fonctions Lambda, identifiant les failles logicielles connues (CVE) et les expositions réseau accidentelles.
- Amazon Macie : service de sécurité et de confidentialité des données utilisant le ML pour découvrir, classer et protéger les données sensibles (PII, numéros de cartes de crédit, pièces d'identité) stockées dans Amazon S3.

Chiffrement et secrets :
- AWS KMS (Key Management Service) : création et gestion centralisée des clés cryptographiques pour chiffrer les données dans tous les services AWS.
- AWS Secrets Manager : stockage, chiffrement et rotation automatique des secrets applicatifs (mots de passe de base de données, tokens d'API), évitant tout mot de passe en clair.

## 3. Définitions des termes clés
- PII (Personally Identifiable Information) : données personnelles identifiantes protégées par le RGPD ou l'HIPAA (noms, emails, numéros de sécurité sociale).
- Rotation automatique des secrets : mécanisme natif de Secrets Manager déclenchant une fonction Lambda pour modifier périodiquement le mot de passe d'une base RDS sans interruption de service.
- DDoS (Distributed Denial of Service) : attaque visant à rendre un service indisponible en saturant ses ressources réseau ou serveur par une multitude d'hôtes compromis.

## 4. Exemple concret
Une application e-commerce subit des tentatives d'injections SQL sur son point d'entrée HTTP. L'ingénieur déploie AWS WAF devant l'Application Load Balancer avec une règle managée bloquant immédiatement les requêtes malveillantes avant qu'elles n'atteignent les serveurs EC2.

## 5. Comparaisons et pièges d'examen
- AWS WAF vs AWS Shield : Shield protège contre les attaques DDoS (couches 3 et 4) ; WAF protège contre les exploits applicatifs web (couche 7 : injections SQL, XSS).
- Amazon GuardDuty vs Amazon Inspector : GuardDuty surveille le comportement du réseau et des comptes (détection d'intrusion en temps réel) ; Inspector analyse les vulnérabilités logicielles statiques dans les OS et les conteneurs.
- Secrets Manager vs Systems Manager Parameter Store : Secrets Manager gère la rotation automatique et le chiffrement natif des secrets avec un coût par secret ; Parameter Store gère la configuration hiérarchique avec un niveau standard gratuit.
- Amazon Macie : s'applique exclusivement à l'analyse du contenu des compartiments Amazon S3.

## 6. Lien avec SQL, Snowflake et Databricks
Dans un projet Data Engineering avec Snowflake, Amazon Macie peut être utilisé en amont pour scanner le lac de données brut sur S3 et détecter si des numéros de carte de paiement ont été déposés par erreur avant leur chargement dans Snowflake.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 151 à 157.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel service devez-vous utiliser pour détecter automatiquement la présence de numéros de sécurité sociale dans vos compartiments S3 ?
   - A) Amazon Macie (Bonne réponse).
   - B) Amazon Inspector.
   - C) Amazon GuardDuty.
   - D) AWS WAF.
2. Quel service offre une rotation automatique des identifiants de connexion aux bases de données ?
   - A) AWS Secrets Manager (Bonne réponse).
   - B) AWS KMS.
   - C) AWS Artifact.
   - D) AWS Shield.
`
  },
  {
    id: 'clf-06-infrastructure-globale',
    title: 'Infrastructure Globale AWS et Réseau de Diffusion',
    domain: 'D3',
    topic_id: 'infrastructure-globale-cloud',
    content: `# Chapitre 6 : Infrastructure Globale AWS et Réseau de Diffusion

## 1. Objectifs d'apprentissage
- Comprendre la hiérarchie physique mondiale d'AWS : Régions, Zones de Disponibilité (AZ) et Points de Présence (Edge Locations).
- Connaître les critères de choix d'une Région AWS (conformité légale, latence utilisateur, coût, disponibilité des services).
- Maîtriser le rôle d'Amazon CloudFront et d'AWS Global Accelerator.
- Différencier Local Zones, AWS Wavelength et AWS Outposts pour les besoins spécifiques.

## 2. Explication claire : quand choisir quoi
L'infrastructure mondiale d'AWS est conçue pour offrir une haute disponibilité, une isolation stricte des pannes et une latence ultra-faible :

Région AWS :
- Zone géographique distincte dans le monde (ex. eu-west-3 à Paris, us-east-1 en Virginie).
- Chaque région est totalement isolée et indépendante des autres pour empêcher la propagation de sinistres majeurs.
- Une région contient au minimum 3 zones de disponibilité reliées par des liaisons fibre optique dédiées à très faible latence (< 1 à 2 ms).
- Les données ne quittent JAMAIS une région sans l'accord explicite et l'action du client (souveraineté des données).

Zone de Disponibilité (AZ - Availability Zone) :
- Composée d'un ou plusieurs centres de données physiques distincts, dotés d'alimentations électriques, de générateurs et de connexions réseau redondants.
- Les AZ au sein d'une même région sont séparées par une distance physique suffisante pour se prémunir des inondations ou des pannes d'énergie régionales.
- Déployer sur plusieurs AZ (Multi-AZ) garantit une haute disponibilité et une reprise automatique en cas de panne d'un centre de données.

Points de Présence (Edge Locations / PoP) :
- Réseau mondial de centaines de points relais situés dans les grandes métropoles mondiales.
- Utilisés par Amazon CloudFront (CDN) pour mettre en cache du contenu statique et dynamique au plus près des utilisateurs finaux, réduisant considérablement la latence.
- Utilisés par AWS Shield et AWS WAF pour filtrer les attaques au plus près de leur source, avant d'atteindre les serveurs d'origine.

Extensions d'infrastructure :
- AWS Outposts : baies matérielles physiques AWS installées directement dans le centre de données sur site du client pour une expérience cloud hybride identique.
- AWS Local Zones : extension des régions AWS plaçant le calcul et le stockage à proximité de grands centres industriels ou urbains nécessitant une latence inférieure à 10 ms.
- AWS Wavelength : déploiement d'équipements de calcul AWS dans les réseaux mobiles 5G des opérateurs pour les applications mobiles temps réel.

## 3. Définitions des termes clés
- Latence : temps nécessaire pour qu'un paquet de données voyage d'un émetteur vers un récepteur.
- CDN (Content Delivery Network) : réseau de distribution de contenu mettant en mémoire cache des fichiers au niveau des Edge Locations.
- Souveraineté des données : obligation légale imposant que certaines données de citoyens restent stockées sur le territoire national (ex. choisir la région Paris eu-west-3).

## 4. Exemple concret
Une entreprise de médias basée en France produit des vidéos stockées sur S3 à Paris (eu-west-3). Pour permettre aux utilisateurs d'Asie et des Amériques de visionner ces vidéos sans temps de chargement, l'entreprise active une distribution Amazon CloudFront. Les vidéos sont mises en cache dans les points de présence locaux de Tokyo et New York dès la première requête.

## 5. Comparaisons et pièges d'examen
- Région vs Zone de Disponibilité : une région est une zone géographique (ex. Paris) ; une zone de disponibilité est un groupe de datacenters isolés au sein de cette région (ex. eu-west-3a).
- Point de présence (Edge Location) vs Zone de disponibilité : les Edge Locations ne sont pas des datacenters complets pour héberger des instances EC2 classiques, ce sont des relais de mise en cache CloudFront et de routage DNS Route 53.
- AWS Outposts vs Local Zones : Outposts s'installe physiquement dans VOTRE datacenter privé ; Local Zones est géré par AWS dans une métropole proche.

## 6. Lien avec SQL, Snowflake et Databricks
Snowflake et Databricks s'appuient sur l'infrastructure des régions AWS : lorsque vous provisionnez un compte Snowflake à Paris, il s'exécute physiquement dans la région eu-west-3 sur plusieurs zones de disponibilité pour garantir que vos requêtes SQL continuent d'aboutir même si un datacenter rencontre une avarie.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 15 à 23 et 75 à 86.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel composant de l'infrastructure mondiale AWS est utilisé par Amazon CloudFront pour mettre le contenu en cache au plus près des utilisateurs ?
   - A) Les points de présence / Edge Locations (Bonne réponse).
   - B) Les zones de disponibilité.
   - C) Les groupes de sécurité.
   - D) Les passerelles Internet.
2. Combien de zones de disponibilité au minimum contient chaque région AWS moderne ?
   - A) Au moins 3 zones de disponibilité (Bonne réponse).
   - B) Exactement 1 zone de disponibilité.
   - C) Au moins 10 zones de disponibilité.
   - D) Exactement 2 zones de disponibilité.
`
  },
  {
    id: 'clf-07-calcul-ec2',
    title: 'Services de Calcul AWS et Modèles de Tarification EC2',
    domain: 'D3',
    topic_id: 'ec2-calcul-tarification',
    content: `# Chapitre 7 : Services de Calcul AWS et Modèles de Tarification EC2

## 1. Objectifs d'apprentissage
- Identifier les services de calcul : machines virtuelles (EC2), conteneurs (ECS, EKS, Fargate) et Serverless (Lambda).
- Maîtriser les 5 options d'achat EC2 (On-Demand, Savings Plans, Reserved Instances, Spot Instances, Dedicated Hosts).
- Savoir dimensionner et choisir la bonne option tarifaire selon les contraintes de coût et d'interruption.
- Comprendre le rôle d'AWS Auto Scaling et d'Elastic Load Balancing (ELB).

## 2. Explication claire : quand choisir quoi
AWS propose une gamme de services de calcul adaptés à chaque niveau de contrôle et d'automatisation :

Services de calcul :
- Amazon EC2 (Elastic Compute Cloud) : serveurs virtuels offrant un contrôle total sur l'OS, la configuration réseau et les logiciels installés.
- AWS Lambda : calcul sans serveur (Serverless) exécutant du code en réponse à des événements (requêtes API, fichiers déposés dans S3) avec facturation à la milliseconde sans gestion de serveur.
- Amazon ECS / EKS : orchestration de conteneurs Docker (ECS pour la simplicité propriétaire AWS, EKS pour les standards ouverts Kubernetes).
- AWS Fargate : moteur de calcul sans serveur pour conteneurs (ECS ou EKS), évitant d'avoir à gérer et patcher les instances EC2 sous-jacentes.
- AWS Batch : planification et exécution par lots de centaines de milliers de tâches de calcul distribuées.

Options d'achat Amazon EC2 :
1. À la demande (On-Demand) :
   - Facturation à la seconde sans aucun engagement ni frais initiaux.
   - Idéal pour les charges imprévisibles, les développements courts ou les tests de validation.
2. Savings Plans :
   - Engagement d'utilisation flexible sur 1 ou 3 ans mesuré en dollars dépensés par heure (ex. 10 USD/h).
   - Réduction jusqu'à 72 % par rapport au prix à la demande, applicable à EC2, Fargate et Lambda.
3. Instances Réservées (Reserved Instances - RI) :
   - Engagement sur 1 ou 3 ans pour un type d'instance et une région spécifiques.
   - Existe en version Standard (non modifiable) ou Convertible (permettant de changer de famille d'instance).
4. Instances Spot :
   - Utilisation de la capacité de calcul excédentaire et inutilisée d'AWS avec une remise atteignant jusqu'à 90 %.
   - Contrainte absolue : AWS peut récupérer l'instance avec un préavis d'avertissement de seulement 2 minutes. Idéal pour les traitements par lots tolérants aux pannes, le calcul scientifique ou le rendu vidéo.
5. Hôtes Dédiés (Dedicated Hosts) :
   - Serveur physique dédié à un seul client, permettant de respecter des exigences de conformité strictes ou d'utiliser ses propres licences logicielles par socket (BYOL).

## 3. Définitions des termes clés
- AMI (Amazon Machine Image) : modèle préconfiguré contenant le système d'exploitation, les logiciels et la configuration initiale pour lancer une instance EC2.
- Auto Scaling : service ajustant automatiquement le nombre d'instances EC2 en fonction de la charge réelle (CPU, requêtes).
- Elastic Load Balancing (ELB) : répartiteur de charge distribuant automatiquement le trafic entrant entre plusieurs instances réparties sur plusieurs zones de disponibilité.

## 4. Exemple concret
Une entreprise exécute une application Web :
- Pour le socle minimal permanent (tournant 24/7/365) : elle souscrit un Compute Savings Plan sur 3 ans (économie de 65 %).
- Pour les pics de charge saisonniers durant les soldes : elle utilise des instances À la demande avec Auto Scaling.
- Pour ses calculs de nuit non urgents de statistiques : elle utilise des instances Spot (économie de 80 %).

## 5. Comparaisons et pièges d'examen
- Spot vs On-Demand : Spot ne doit JAMAIS être choisi pour une base de données de production ou une tâche critique qui ne peut pas être interrompue.
- Savings Plans vs Reserved Instances : Savings Plans offre une flexibilité supérieure car il s'applique automatiquement à travers plusieurs familles d'instances et englobe Fargate et Lambda.
- Hôtes dédiés vs Instances dédiées : l'Hôte Dédié vous donne la visibilité sur les sockets physiques pour les licences logicielles serveur ; l'Instance Dédiée garantit seulement qu'aucun autre client ne partage le même matériel hôte.

## 6. Lien avec SQL, Snowflake et Databricks
Dans Databricks, le pool de calcul de nœuds de travail (worker nodes) peut être configuré avec des instances Spot AWS : si une instance Spot est révoquée par AWS, Databricks relance simplement le calcul de la partition perdue sur un autre nœud sans faire échouer l'ensemble du job Spark.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 24 à 60.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quelle option d'achat EC2 permet d'obtenir jusqu'à 90 % de réduction pour des tâches de traitement par lots pouvant supporter des interruptions imprévues ?
   - A) Les instances Spot (Bonne réponse).
   - B) Les instances à la demande.
   - C) Les instances réservées convertibles.
   - D) Les hôtes dédiés.
2. Quel service exécute du code en réponse à des événements sans exiger la gestion ou le provisionnement de serveurs ?
   - A) AWS Lambda (Bonne réponse).
   - B) Amazon EC2.
   - C) Amazon EMR.
   - D) AWS Outposts.
`
  },
  {
    id: 'clf-08-stockage-s3-ebs',
    title: 'Services de Stockage AWS : S3, EBS, EFS et Glacier',
    domain: 'D3',
    topic_id: 's3',
    content: `# Chapitre 8 : Services de Stockage AWS : S3, EBS, EFS et Glacier

## 1. Objectifs d'apprentissage
- Comprendre les différents types de stockage : stockage objet (S3), stockage bloc (EBS) et stockage fichier partagé (EFS).
- Connaître les classes de stockage Amazon S3 et leurs politiques de cycle de vie (Lifecycle rules).
- Identifier les caractéristiques des volumes EBS et des instantanés (Snapshots).
- Maîtriser les options d'archivage économique avec Amazon S3 Glacier et Glacier Deep Archive.

## 2. Explication claire : quand choisir quoi
AWS propose 3 grands paradigmes de stockage adaptés à des besoins distincts :

1. Stockage Objet : Amazon S3 (Simple Storage Service)
- Stockage de données non structurées (photos, vidéos, logs, sauvegardes, fichiers analytiques Parquet).
- Les fichiers (objets) jusqu'à 5 To sont stockés dans des conteneurs universels appelés compartiments (buckets).
- Durabilité exceptionnelle de 99,999999999 % (11 neufs) conçue pour survivre à la perte simultanée de données dans plusieurs installations physiques.
- Classes de stockage pour optimiser les coûts :
  - S3 Standard : accès fréquent, latence en millisecondes, haute disponibilité.
  - S3 Standard-IA (Infrequent Access) : données consultées moins souvent mais nécessitant un accès immédiat en cas de besoin, coût de stockage inférieur avec frais de récupération par Go.
  - S3 One Zone-IA : stockage dans une seule zone de disponibilité pour économiser 20 %, réservé aux données reproductibles sans criticité.
  - S3 Glacier Flexible Retrieval : archivage à froid, temps de récupération de quelques minutes à quelques heures.
  - S3 Glacier Deep Archive : archivage le plus économique du cloud AWS pour la conformité légale (7 à 10 ans), récupération sous 12 heures.
  - S3 Intelligent-Tiering : déplace automatiquement les objets entre les niveaux d'accès fréquent, peu fréquent et archive en fonction des motifs d'accès réels, sans aucun frais de récupération ni pénalité opérationnelle.

2. Stockage Bloc : Amazon EBS (Elastic Block Store)
- Disque dur virtuel haute performance connecté en réseau à une seule instance EC2 dans la même zone de disponibilité.
- Utilisé pour le volume système d'exploitation (boot volume), les bases de données relationnelles ou les fichiers temporaires nécessitant des entrées/sorties rapides (IOPS).
- Les données persistent même après l'arrêt de l'instance EC2.
- Sauvegardes incrémentielles stockées durablement sur S3 via les Snapshots EBS.

3. Stockage Fichier : Amazon EFS (Elastic File System)
- Système de fichiers réseau géré (NFS) pouvant être monté simultanément en lecture et écriture par des centaines d'instances EC2 réparties sur plusieurs zones de disponibilité.
- Évolue automatiquement en taille sans provisionnement préalable.

## 3. Définitions des termes clés
- IOPS (Input/Output Operations Per Second) : mesure du nombre d'opérations de lecture et d'écriture qu'un disque peut exécuter par seconde.
- Règle de cycle de vie S3 : politique automatisée déplaçant des objets vers une classe de stockage plus froide après X jours (ex. vers Glacier après 90 jours) ou les supprimant après 365 jours.
- Snapshots EBS : copies de sauvegarde ponctuelles et incrémentielles d'un volume EBS, sauvegardées en arrière-plan sur S3.

## 4. Exemple concret
Une entreprise génère 50 Go de journaux applicatifs par jour :
- Jours 1 à 30 : stockés dans S3 Standard pour les analyses opérationnelles quotidiennes.
- Jour 31 : une règle de cycle de vie S3 bascule automatiquement les fichiers vers S3 Standard-IA.
- Jour 90 : la règle déplace les fichiers vers S3 Glacier Flexible Retrieval.
- Jour 365 : les fichiers sont définitivement purgés pour éliminer tout coût résiduel.

## 5. Comparaisons et pièges d'examen
- S3 vs EBS : S3 est un stockage objet accessible via HTTP/API depuis n'importe où ; EBS est un disque virtuel bloc utilisable uniquement par une instance EC2 dans la même AZ.
- EBS vs EFS : EBS ne peut être attaché qu'à une seule instance EC2 à la fois (sauf option spécifique multi-attach sur io2) dans une seule AZ ; EFS est un partage de fichiers réseau montable par des centaines d'instances à travers plusieurs AZ.
- S3 Intelligent-Tiering : c'est la réponse idéale d'examen pour optimiser les coûts de stockage lorsque les motifs d'accès aux données sont imprévisibles ou changeants.

## 6. Lien avec SQL, Snowflake et Databricks
Amazon S3 est le fondement de tous les Data Lakes modernes : c'est là que Snowflake lit les fichiers CSV ou Parquet externes via la commande SQL \`COPY INTO\`, et c'est là que les tables Delta Lake ou Apache Iceberg enregistrent leurs fichiers de données sous-jacents.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 93 à 101.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quelle classe de stockage S3 est recommandée lorsque les motifs d'accès aux objets sont inconnus ou imprévisibles, afin d'optimiser automatiquement les coûts sans frais de récupération ?
   - A) S3 Intelligent-Tiering (Bonne réponse).
   - B) S3 Standard-IA.
   - C) S3 One Zone-IA.
   - D) S3 Glacier Deep Archive.
2. Quel service de stockage fournit un système de fichiers réseau (NFS) partageable simultanément entre plusieurs instances EC2 dans différentes zones de disponibilité ?
   - A) Amazon EFS (Bonne réponse).
   - B) Amazon EBS.
   - C) Amazon S3.
   - D) AWS Storage Gateway.
`
  },
  {
    id: 'clf-09-bases-donnees',
    title: 'Services de Bases de Données AWS : RDS, DynamoDB et Redshift',
    domain: 'D3',
    topic_id: 'rds-aurora-autres',
    content: `# Chapitre 9 : Services de Bases de Données AWS : RDS, DynamoDB et Redshift

## 1. Objectifs d'apprentissage
- Identifier les grands types de bases de données : Relationnelle (OLTP), NoSQL Clé-Valeur, Entrepôt de données (OLAP) et En mémoire (In-Memory).
- Connaître les moteurs gérés par Amazon RDS et les atouts d'Amazon Aurora.
- Comprendre les cas d'usage d'Amazon DynamoDB pour les données non relationnelles à latence milliseconde.
- Distinguer Amazon Redshift pour l'analytique et Amazon ElastiCache pour la mise en cache.

## 2. Explication claire : quand choisir quoi
AWS propose des bases de données spécialisées selon le modèle de données et la nature des requêtes (Purpose-built databases) :

1. Bases de données relationnelles (OLTP - transactions en ligne) :
- Amazon RDS (Relational Database Service) : service géré simplifiant l'installation, les patchs d'OS, les sauvegardes continues et la réplication Multi-AZ pour 6 moteurs populaires (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, Aurora).
- Amazon Aurora : moteur relationnel conçu par AWS compatible MySQL et PostgreSQL, offrant jusqu'à 5 fois les performances de MySQL classique, avec réplication native des données sur 6 copies réparties dans 3 zones de disponibilité et bascule automatique en moins de 30 secondes.
- Quand choisir RDS/Aurora : pour les applications d'entreprise traditionnelles, le e-commerce, les systèmes financiers exigeant des transactions ACID et des requêtes SQL complexes avec jointures.

2. Bases NoSQL (clé-valeur et documents) :
- Amazon DynamoDB : base de données NoSQL entièrement managée et sans serveur, offrant des performances constantes avec une latence inférieure à 10 millisecondes à n'importe quelle échelle de trafic.
- Caractéristiques : schéma flexible, passage à l'échelle automatique (auto-scaling), réplication multi-régions via les tables globales (Global Tables), pas de serveurs à administrer.
- Quand choisir DynamoDB : pour les profils utilisateurs, les paniers d'achat, les sessions Web, les classements de jeux vidéo ou l'IoT.

3. Entrepôt de données analytique (OLAP) :
- Amazon Redshift : data warehouse SQL colonnaire à très grande échelle permettant d'analyser des pétaoctets de données complexes et de générer des tableaux de bord décisionnels.
- Quand choisir Redshift : pour le décisionnel (BI), les agrégations massives sur des millions de lignes et l'analyse historique d'entreprise.

4. Mise en cache en mémoire (In-Memory) :
- Amazon ElastiCache : service de cache en mémoire compatible Redis et Memcached réduisant drastiquement la latence des bases relationnelles en stockant les requêtes fréquentes en RAM.

## 3. Définitions des termes clés
- Déploiement Multi-AZ (RDS) : réplication synchrone vers une instance secondaire passive dans une autre zone de disponibilité pour assurer la haute disponibilité et la reprise automatique sur sinistre.
- Réplicas en lecture (Read Replicas) : copies asynchrones d'une base de données permettant de soulager l'instance principale des requêtes de lecture et d'augmenter les performances globales.
- OLTP (Online Transaction Processing) : systèmes orientés transactions fréquentes, rapides et atomiques sur quelques lignes (ex. valider une commande).
- OLAP (Online Analytical Processing) : systèmes orientés requêtes analytiques complexes et agrégations sur de très gros volumes de colonnes (ex. chiffre d'affaires annuel par région).

## 4. Exemple concret
Une boutique en ligne gère ses fiches articles et ses paiements avec Amazon Aurora Multi-AZ pour garantir la cohérence transactionnelle SQL. Les sessions des visiteurs et leurs paniers temporaires sont stockés sur Amazon DynamoDB pour supporter des millions de clics sans ralentissement. Les données de ventes sont exportées chaque nuit vers Amazon Redshift pour alimenter les rapports de la direction.

## 5. Comparaisons et pièges d'examen
- RDS vs EC2 : héberger une base de données sur EC2 donne le contrôle total sur l'OS et les fichiers système mais oblige le client à gérer les sauvegardes, la réplication et les correctifs manuellement ; RDS automatise tout cela.
- RDS Multi-AZ vs Read Replica : Multi-AZ sert à la tolérance aux pannes et à la haute disponibilité (bascule automatique) ; Read Replica sert à améliorer les performances de lecture.
- DynamoDB vs RDS : si l'énoncé mentionne des schémas rigides avec jointures complexes SQL, choisir RDS ; s'il mentionne une latence inférieure à 10 ms sans serveur et un schéma flexible, choisir DynamoDB.

## 6. Lien avec SQL, Snowflake et Databricks
Amazon Redshift est le concurrent historique direct de Snowflake sur le créneau des Data Warehouses Cloud. Tous deux reposent sur un stockage colonnaire optimisé pour exécuter des requêtes d'agrégation SQL (SUM, AVG, GROUP BY) bien plus vite qu'un moteur relationnel transactionnel comme PostgreSQL.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 107 à 120.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel service de base de données entièrement managé et sans serveur offre une latence inférieure à 10 millisecondes pour un modèle de données clé-valeur ?
   - A) Amazon DynamoDB (Bonne réponse).
   - B) Amazon RDS for MySQL.
   - C) Amazon Redshift.
   - D) Amazon Aurora.
2. Pour quelle raison principale un architecte déploie-t-il une base Amazon RDS en mode Multi-AZ ?
   - A) Pour assurer la haute disponibilité et la bascule automatique en cas de panne (Bonne réponse).
   - B) Pour accélérer les requêtes d'agrégation analytique.
   - C) Pour réduire le coût de la facture de 50 %.
   - D) Pour permettre des accès anonymes sans authentification IAM.
`
  },
  {
    id: 'clf-10-reseau-vpc',
    title: 'Réseau Virtuel AWS et Sécurité Périmétrique (Amazon VPC)',
    domain: 'D3',
    topic_id: 'vpc-privatelink',
    content: `# Chapitre 10 : Réseau Virtuel AWS et Sécurité Périmétrique (Amazon VPC)

## 1. Objectifs d'apprentissage
- Comprendre la structure d'un Amazon Virtual Private Cloud (VPC) : sous-réseaux publics, privés et tables de routage.
- Distinguer les Groupes de Sécurité (Security Groups) et les Listes de Contrôle d'Accès Réseau (NACL).
- Maîtriser le rôle des passerelles : Passerelle Internet (IGW), passerelle NAT (NAT Gateway), Virtual Private Gateway (VPG).
- Connaître les options de connectivité hybride et privée (AWS Direct Connect, AWS VPN, VPC Peering).

## 2. Explication claire : quand choisir quoi
Amazon Virtual Private Cloud (Amazon VPC) permet de provisionner une section isolée du cloud AWS dans laquelle vous lancez vos ressources au sein d'un réseau virtuel que vous définissez (plages d'adresses IP CIDR).

Composants fondamentaux d'un VPC :
- Sous-réseau public (Public Subnet) : sous-réseau dont la table de routage possède une entrée vers une passerelle Internet (Internet Gateway - IGW), permettant aux ressources d'avoir une adresse IP publique et de communiquer directement avec le Web.
- Sous-réseau privé (Private Subnet) : sous-réseau isolé d'Internet sans accès entrant direct, réservé aux composants critiques comme les bases de données ou les serveurs d'application internes.
- Passerelle NAT (NAT Gateway) : déployée dans un sous-réseau public, elle permet aux instances d'un sous-réseau privé de télécharger des mises à jour ou d'accéder à Internet en sortie, tout en interdisant à des connexions entrantes depuis Internet d'atteindre ces instances privées.
- Passerelle Internet (Internet Gateway - IGW) : composant VPC hautement disponible permettant la communication bidirectionnelle entre le VPC et Internet.

Sécurité réseau :
- Groupes de Sécurité (Security Groups) :
  - Pare-feu virtuel au niveau de l'instance (de l'interface réseau ENI).
  - À état (Stateful) : si le trafic entrant est autorisé sur un port, la réponse sortante est automatiquement autorisée quel que soit le filtrage sortant.
  - Ne contient que des règles d'autorisation (Allow rules), tout le reste est refusé par défaut.
- Listes de contrôle d'accès réseau (NACL - Network Access Control List) :
  - Pare-feu au niveau du sous-réseau entier.
  - Sans état (Stateless) : le trafic entrant et le trafic sortant doivent être autorisés explicitement sur leurs ports respectifs.
  - Supporte les règles d'autorisation (Allow) et de refus explicite (Deny), évaluées par ordre numérique croissant de priorité.

Options de connectivité :
- AWS Direct Connect : connexion réseau dédiée physique et privée entre le datacenter d'une entreprise et AWS, contournant Internet pour une bande passante garantie et une latence ultra-stable.
- AWS Site-to-Site VPN : connexion chiffrée par tunnel IPsec passant par Internet public pour relier un site distant à un VPC.
- Peering VPC (VPC Peering) : connexion réseau directe entre deux VPC permettant la communication via des adresses IP privées comme s'ils faisaient partie du même réseau. Non transitif.

## 3. Définitions des termes clés
- Stateful (À état) : mémorise l'état de la connexion (ex. Security Group). Si une requête entre, la réponse sort sans règle additionnelle.
- Stateless (Sans état) : ne mémorise rien (ex. NACL). Il faut définir une règle entrante ET une règle sortante pour les ports éphémères.
- Bloc CIDR : notation décrivant la plage d'adresses IP attribuée au VPC (ex. 10.0.0.0/16).

## 4. Exemple concret
Architecture classique à 3 niveaux :
- Niveau Web : Load Balancer dans des sous-réseaux publics connectés à l'Internet Gateway.
- Niveau Application : serveurs EC2 dans des sous-réseaux privés pouvant sortir sur Internet via une passerelle NAT managée.
- Niveau Données : base Amazon RDS dans des sous-réseaux privés totalement isolés, dont le Security Group autorise uniquement le port 5432 provenant du Security Group applicatif.

## 5. Comparaisons et pièges d'examen
- Security Group vs NACL : Security Group opère au niveau de l'instance et est Stateful ; NACL opère au niveau du sous-réseau et est Stateless avec support des règles Deny explicites.
- Direct Connect vs Site-to-Site VPN : Direct Connect est une ligne physique dédiée (temps de mise en place de plusieurs semaines, débit élevé et constant) ; VPN s'établit rapidement via Internet public avec chiffrement IPsec.
- Passerelle NAT vs Passerelle Internet : une passerelle NAT doit TOUJOURS être positionnée dans un sous-réseau public pour fonctionner et ne permet QUE le trafic sortant depuis les réseaux privés.

## 6. Lien avec SQL, Snowflake et Databricks
AWS PrivateLink permet de connecter votre VPC applicatif à un entrepôt Snowflake hébergé sur AWS sans que le trafic ne transite jamais par l'Internet public : toutes les requêtes SQL et les données voyagent exclusivement sur le réseau privé d'AWS.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 61 à 74.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel pare-feu réseau virtuel est à état (Stateful) et opère directement au niveau de l'instance EC2 ?
   - A) Le Groupe de Sécurité (Security Group) (Bonne réponse).
   - B) La liste de contrôle d'accès réseau (NACL).
   - C) La passerelle NAT.
   - D) Le routeur virtuel de sous-réseau.
2. Quel service fournit une connexion réseau physique dédiée et privée entre votre centre de données d'entreprise et AWS, sans passer par Internet ?
   - A) AWS Direct Connect (Bonne réponse).
   - B) AWS Site-to-Site VPN.
   - C) Amazon CloudFront.
   - D) AWS Storage Gateway.
`
  },
  {
    id: 'clf-11-monitoring-gouvernance',
    title: 'Surveillance, Audit et Gouvernance : CloudWatch, CloudTrail et Config',
    domain: 'D2',
    topic_id: 'cloudwatch',
    content: `# Chapitre 11 : Surveillance, Audit et Gouvernance : CloudWatch, CloudTrail et Config

## 1. Objectifs d'apprentissage
- Différencier nettement les rôles de CloudWatch (métriques, logs, alarmes), CloudTrail (audit des appels d'API) et AWS Config (conformité des configurations).
- Savoir qui a fait quoi, quand et depuis quelle adresse IP grâce à AWS CloudTrail.
- Configurer des alertes de facturation et de santé système avec Amazon CloudWatch.
- Comprendre les recommandations proactives d'AWS Trusted Advisor.

## 2. Explication claire : quand choisir quoi
Pour réussir l'examen, vous devez distinguer le trio fondamental de supervision AWS :

1. Amazon CloudWatch : Surveillance des performances et de la santé (Performance & Health)
- Qu'est-ce que c'est : le tableau de bord opérationnel d'AWS.
- Rôle : collecte les métriques (utilisation du CPU, entrées/sorties disque, trafic réseau), centralise les journaux applicatifs (CloudWatch Logs) et déclenche des alarmes automatiques (CloudWatch Alarms).
- Cas d'usage : avertir un administrateur par email via SNS si l'utilisation CPU d'une instance EC2 dépasse 80 % pendant 5 minutes, ou arrêter automatiquement une machine sous-utilisée pour réduire les coûts.

2. AWS CloudTrail : Audit et traçabilité des actions utilisateurs (Auditing & Governance)
- Qu'est-ce que c'est : l'enregistreur de vol de votre compte AWS.
- Rôle : journalise chaque appel d'API effectué dans le compte, que l'action provienne de la console de gestion AWS, de l'AWS CLI ou d'un SDK.
- Informations enregistrées : identité de l'auteur (qui), heure exacte (quand), nom du service et de l'action appelée (quoi), et adresse IP source (d'où).
- Cas d'usage : déterminer quel utilisateur a supprimé une table DynamoDB hier à 14h30 ou quelle clé d'accès compromise a lancé des instances non autorisées.

3. AWS Config : Évaluation et conformité des ressources (Configuration & Compliance)
- Qu'est-ce que c'est : le registre d'inventaire et de conformité des configurations.
- Rôle : enregistre les changements de configuration de vos ressources au fil du temps et compare ces configurations à des règles de conformité prédéfinies.
- Cas d'usage : signaler immédiatement si un compartiment S3 a été rendu public par mégarde ou si une instance EC2 est démarrée sans groupe de sécurité conforme.

4. AWS Trusted Advisor : Conseiller virtuel d'optimisation
- Rôle : analyse en temps réel votre compte AWS et formule des recommandations concrètes selon 5 piliers : optimisation des coûts, sécurité, tolérance aux pannes, performances, et quotas de service.

## 3. Définitions des termes clés
- Métrique CloudWatch : variable temporelle surveillée (ex. CPUUtilization, NetworkIn, EstimatedCharges).
- Événement CloudTrail : enregistrement d'une action de gestion ou d'accès aux données.
- Règle AWS Config : condition de conformité vérifiée en continu (ex. vérifier que tous les volumes EBS sont chiffrés).

## 4. Exemple concret
Une alerte de facturation inhabituelle se déclenche.
1. CloudWatch Alarms notifie l'administrateur que le budget prévisionnel est dépassé.
2. L'administrateur consulte AWS CloudTrail pour identifier qui a lancé 10 instances EC2 GPU coûteuses dans la nuit.
3. Il utilise AWS Config pour visualiser l'historique de configuration de ces instances et appliquer une règle de remédiation automatique.

## 5. Comparaisons et pièges d'examen
- CloudWatch vs CloudTrail : CloudWatch surveille la performance et l'état des ressources (combien de CPU, est-ce en panne ?) ; CloudTrail surveille les actions humaines et programmatiques (qui a créé ou supprimé cette ressource ?).
- CloudTrail vs Config : CloudTrail dit QUI a modifié la ressource à quel moment ; Config dit COMMENT la ressource est configurée et si elle viole une politique d'entreprise.
- Trusted Advisor : les recommandations de base de sécurité et de quotas sont accessibles à tous les comptes, mais l'accès à l'ensemble des contrôles (notamment optimisation des coûts et tolérance aux pannes) exige le plan de support Business ou Enterprise.

## 6. Lien avec SQL, Snowflake et Databricks
Dans un pipeline de données, CloudWatch surveille la durée d'exécution de vos scripts d'ingestion Python ou de vos tâches ETL, tandis que CloudTrail conserve la trace des autorisations accordées aux rôles de service qui exécutent ces pipelines.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 169 à 176.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel service devez-vous consulter pour découvrir quel utilisateur IAM a supprimé un compartiment S3 la semaine dernière ?
   - A) AWS CloudTrail (Bonne réponse).
   - B) Amazon CloudWatch.
   - C) AWS Config.
   - D) Amazon Inspector.
2. Quel service permet de vérifier en continu si tous les volumes EBS déployés dans le compte sont bien chiffrés conformément aux règles de l'entreprise ?
   - A) AWS Config (Bonne réponse).
   - B) Amazon CloudWatch.
   - C) AWS Artifact.
   - D) AWS Shield.
`
  },
  {
    id: 'clf-12-facturation-support',
    title: 'Facturation, Gestion des Coûts et Plans de Support AWS',
    domain: 'D4',
    topic_id: 'facturation-couts-support',
    content: `# Chapitre 12 : Facturation, Gestion des Coûts et Plans de Support AWS

## 1. Objectifs d'apprentissage
- Maîtriser les outils de suivi des coûts : AWS Cost Explorer, AWS Budgets, AWS Pricing Calculator et Cost & Usage Report (CUR).
- Connaître les 4 niveaux de support officiels (Basic, Developer, Business, Enterprise).
- Comprendre la facturation consolidée (Consolidated Billing) avec AWS Organizations.
- Découvrir les fonctionnalités exclusives des plans Business et Enterprise (TAM, réponse sous 15 min, etc.).

## 2. Explication claire : quand choisir quoi
La maîtrise de la tarification et des coûts est un thème central du CLF-C02 :

Outils de gestion des coûts :
- AWS Pricing Calculator : outil web public gratuit permettant d'estimer le coût d'une architecture AWS AVANT de la construire ou de la déployer.
- AWS Cost Explorer : outil analytique permettant de visualiser, comprendre et prévoir ses dépenses AWS passées et futures (jusqu'à 12 mois dans le futur). Permet de filtrer par service, balise (tag) ou compte.
- AWS Budgets : outil permettant de définir des seuils de budget personnalisés (en coût ou en utilisation) et d'envoyer des alertes automatiques par email ou SNS lorsque les dépenses réelles ou prévisionnelles dépassent le seuil fixé.
- AWS Cost and Usage Report (CUR) : le fichier de données de facturation le plus granulaire et détaillé produit par AWS, livré sous forme de fichiers CSV ou Parquet dans un compartiment S3 pour analyse SQL approfondie.
- Facturation consolidée (Consolidated Billing) : fonctionnalité d'AWS Organizations regroupant les factures de plusieurs comptes sous un compte de gestion unique, permettant de mutualiser les volumes d'utilisation et d'obtenir des remises sur volume automatiques.

Les 4 niveaux de support AWS :
1. Support Basic :
   - Inclus gratuitement pour tous les comptes.
   - Accès 24/7 au service client pour la facturation et les questions de compte.
   - Accès aux 7 contrôles de base de sécurité et de quotas dans AWS Trusted Advisor.
   - Zéro accès aux ingénieurs du support technique.
2. Support Developer :
   - Recommandé pour l'expérimentation et le prototypage pré-production.
   - Accès technique par email pendant les heures ouvrées locales.
   - Délai de réponse pour incident général < 12h, incident affectant le système < 24h.
3. Support Business :
   - Recommandé pour les charges de travail en production.
   - Accès 24/7 par téléphone, chat et email à des ingénieurs Cloud Support.
   - Délai de réponse pour système de production en panne < 1 heure.
   - Accès complet à l'intégralité des recommandations d'AWS Trusted Advisor.
4. Support Enterprise :
   - Recommandé pour les charges de travail stratégiques et critiques pour l'entreprise.
   - Attribution d'un Technical Account Manager (TAM) dédié, guidant la stratégie cloud.
   - Délai de réponse garanti < 15 minutes pour les pannes critiques d'entreprise (business-critical system down).
   - Accès au programme Infrastructure Event Management (IEM) pour sécuriser les grands événements de lancement.

## 3. Définitions des termes clés
- TAM (Technical Account Manager) : conseiller technique dédié chez AWS qui accompagne les clients Enterprise dans l'architecture et les opérations.
- IEM (Infrastructure Event Management) : accompagnement structuré par des ingénieurs AWS pour anticiper les pics de trafic lors d'événements majeurs (ex. Black Friday).
- Balises de répartition des coûts (Cost Allocation Tags) : métadonnées clés-valeurs assignées aux ressources pour ventiler les dépenses par projet, client ou département.

## 4. Exemple concret
Une startup prévoit de lancer son site de production vendredi. Elle souscrit immédiatement au plan de Support Business pour bénéficier d'un support téléphonique 24/7 et d'une garantie de réponse sous 1 heure en cas d'incident grave sur sa base de données.

## 5. Comparaisons et pièges d'examen
- Cost Explorer vs Pricing Calculator : Pricing Calculator sert AVANT le projet (estimation prévisionnelle) ; Cost Explorer sert PENDANT et APRÈS (historique des dépenses réelles).
- Cost Explorer vs AWS Budgets : Cost Explorer sert à analyser et visualiser des graphiques ; Budgets sert à DÉCLENCHER des alertes quand un seuil est franchi.
- Plan Business vs Plan Enterprise : le plan Business offre un délai d'1h pour les pannes de production ; seul le plan Enterprise offre le délai de 15 minutes pour les pannes critiques et fournit un TAM dédié.

## 6. Lien avec SQL, Snowflake et Databricks
Les fichiers générés par l'AWS Cost and Usage Report (CUR) déposés sur S3 sont fréquemment ingérés dans Snowflake pour analyser le coût précis de chaque pipeline de données via des requêtes SQL d'agrégation.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 177 à 188.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel outil gratuit permet d'estimer le coût mensuel prévisionnel d'une architecture avant même de créer les ressources dans AWS ?
   - A) AWS Pricing Calculator (Bonne réponse).
   - B) AWS Cost Explorer.
   - C) AWS Budgets.
   - D) AWS Trusted Advisor.
2. Quel plan de support propose un Technical Account Manager (TAM) dédié et un délai de réponse garanti inférieur à 15 minutes pour les pannes critiques ?
   - A) Plan Enterprise (Bonne réponse).
   - B) Plan Business.
   - C) Plan Developer.
   - D) Plan Basic.
`
  },
  {
    id: 'clf-13-migration-disaster-recovery',
    title: 'Stratégies de Migration Cloud et Plans de Reprise après Sinistre',
    domain: 'D1',
    topic_id: 'migration-transfert',
    content: `# Chapitre 13 : Stratégies de Migration Cloud et Plans de Reprise après Sinistre

## 1. Objectifs d'apprentissage
- Maîtriser les stratégies de migration des 6R / 7R (Rehost, Replatform, Refactor, Repurchase, Retain, Retire, Relocate).
- Connaître les services de transfert physique et réseau : famille AWS Snow (Snowcone, Snowball, Snowmobile) et AWS DataSync.
- Différencier AWS Database Migration Service (DMS) pour la réplication avec CDC.
- Comprendre les 4 stratégies de reprise après sinistre (Disaster Recovery) et leur arbitrage coût vs RTO/RPO.

## 2. Explication claire : quand choisir quoi
La migration vers le cloud et la résilience face aux pannes catastrophiques obéissent à des cadres méthodologiques précis :

Stratégies de migration (Les 6R / 7R) :
1. Rehost (Lift-and-Shift) : déplacer l'application telle quelle vers le cloud sans modifier le code (ex. migrer des VM VMware vers EC2 via AWS Application Migration Service). Rapide et économique.
2. Replatform (Lift-Tinker-and-Shift) : apporter de légères optimisations cloud sans refondre l'architecture centrale (ex. migrer une base Oracle sur VM vers Amazon RDS for Oracle).
3. Refactor / Re-architect : réécrire et reconcevoir l'application pour adopter des technologies cloud natives (microservices, conteneurs, Serverless avec Lambda et DynamoDB). Coût initial élevé mais agilité maximale.
4. Repurchase (Drop-and-Shop) : abandonner un logiciel existant au profit d'un service SaaS managé (ex. passer à Salesforce ou AWS Marketplace).
5. Relocate : déplacer des serveurs virtualisés vers AWS sans modifier la configuration matérielle (ex. VMware Cloud on AWS).
6. Retain : conserver l'application sur site temporairement en raison de contraintes réglementaires ou techniques.
7. Retire : décommissionner les applications obsolètes qui ne sont plus utilisées.

Transfert de gros volumes de données :
- AWS Snowcone : appareil de transfert compact et renforcé (8 à 14 To de données).
- AWS Snowball Edge : boîtier sécurisé de taille intermédiaire (jusqu'à 80 To utiles) pour migrer des dizaines de téraoctets par voie postale lorsque la bande passante réseau est insuffisante.
- AWS Snowmobile : camion conteneur sécurisé transportant jusqu'à 100 pétaoctets de données pour les migrations massives de centres de données entiers.
- AWS DataSync : service d'accélération réseau en ligne automatisant le transfert de données entre le stockage sur site (NFS, SMB) et S3, EFS ou FSx.
- AWS DMS (Database Migration Service) : outil de migration de bases de données assurant la réplication continue (Change Data Capture - CDC) avec temps d'arrêt quasi nul.

Les 4 stratégies de reprise après sinistre (Disaster Recovery) :
1. Sauvegarde et restauration (Backup & Restore) : le plus économique, RTO et RPO élevés (plusieurs heures).
2. Veilleuse (Pilot Light) : les composants clés (base de données répliquée en continu) tournent au ralenti ; les serveurs de calcul ne sont instanciés qu'en cas de sinistre.
3. Veille active / Attente chaude (Warm Standby) : une version réduite mais fonctionnelle de l'environnement tourne en permanence dans une autre région.
4. Multi-sites actif-actif (Multi-Site Active-Active) : l'ensemble de l'infrastructure est entièrement déployé et traite le trafic simultanément dans au moins deux régions. Zéro interruption, coût le plus élevé.

## 3. Définitions des termes clés
- RTO (Recovery Time Objective) : temps maximum admissible pour rétablir le service après un sinistre.
- RPO (Recovery Point Objective) : quantité maximale admissible de données perdues (exprimée en durée).
- CDC (Change Data Capture) : réplication en continu des modifications de la base de données source vers la cible.

## 4. Exemple concret
Une entreprise possède une liaison Internet saturée de 100 Mbit/s et doit migrer 60 To de sauvegardes vers S3. Par le réseau, cela prendrait plus de 60 jours. Elle commande un boîtier AWS Snowball Edge, copie les données en local en 24h et le renvoie par transporteur sécurisé : les données sont disponibles sur S3 en moins d'une semaine.

## 5. Comparaisons et pièges d'examen
- Rehost vs Refactor : Rehost ne modifie aucun code (lift-and-shift rapide) ; Refactor réécrit l'application en mode Serverless/Cloud Native.
- Pilot Light vs Warm Standby : Pilot Light ne fait tourner que le cœur de données (le serveur de calcul est éteint) ; Warm Standby fait tourner une version complète mais sous-dimensionnée prête à monter en charge immédiatement.
- Snowball vs DataSync : si la bande passante réseau est bonne et le transfert continu, utiliser DataSync ; si le volume est de dizaines de To avec une connexion Internet trop lente, utiliser Snowball.

## 6. Lien avec SQL, Snowflake et Databricks
AWS DMS est fréquemment utilisé pour répliquer en continu des bases transactionnelles PostgreSQL ou SQL Server vers un stockage Amazon S3 au format Parquet, créant ainsi le lac de données brut qui alimente ensuite les tables d'analyse dans Snowflake ou Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 189 à 196.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quelle stratégie de migration consiste à déplacer une application vers le Cloud AWS sans apporter la moindre modification à son code ?
   - A) Rehost / Lift-and-Shift (Bonne réponse).
   - B) Refactor.
   - C) Repurchase.
   - D) Retire.
2. Quelle stratégie de reprise après sinistre offre le coût le plus faible mais le temps de reprise (RTO) le plus long ?
   - A) Sauvegarde et restauration (Backup and Restore) (Bonne réponse).
   - B) Veilleuse (Pilot Light).
   - C) Attente chaude (Warm Standby).
   - D) Multi-sites actif-actif.
`
  }
];

for (const ch of CHAPTERS) {
  const filePath = path.join(CHAPTERS_DIR, `${ch.id}.md`);
  fs.writeFileSync(filePath, ch.content.trim() + '\n', 'utf8');
}
console.log(`[LOT 1 CLF] ${CHAPTERS.length} chapitres Markdown générés avec succès.`);

// --- 2. FICHES EXPRESS CLF-C02 ---
const FICHES_EXPRESS = [
  {
    id: 'fiche-express-d1-concepts-cloud',
    domain: 'D1',
    title: 'Fiche Express Domaine 1 : Concepts du Cloud (24 %)',
    content: `# Fiche Express : Domaine 1 - Concepts du Cloud AWS (Pondération officielle : 24 %)

## 1. Les 6 Avantages Majeurs du Cloud AWS (À connaître par cœur)
1. Remplacer les dépenses d'investissement par des dépenses variables (Trade CapEx for OpEx).
2. Bénéficier d'économies d'échelle massives (baisse continue des coûts unitaires).
3. Arrêter de deviner la capacité nécessaire (élasticité dynamique selon la charge).
4. Augmenter la vitesse et l'agilité (mise sur le marché en quelques minutes).
5. Cesser de dépenser de l'argent pour gérer des centres de données (foyer de coût non différenciateur).
6. Déployer à l'échelle mondiale en quelques minutes (infrastructure répartie sur tous les continents).

## 2. Modèles de Déploiement et de Service
- Cloud Public : 100 % hébergé et géré sur AWS, élasticité maximale.
- Cloud Hybride : interconnexion entre infrastructure sur site et AWS (via Direct Connect, Storage Gateway ou VPN).
- Cloud Privé : infrastructure dédiée sur site ou en colocation sans mutualisation.
- IaaS (Infrastructure as a Service) : contrôle maximal sur l'OS et le réseau (ex. EC2).
- PaaS (Platform as a Service) : gestion applicative sans souci d'OS ni de matériel (ex. Elastic Beanstalk, RDS).
- SaaS (Software as a Service) : logiciel complet consommé sur étagère (ex. applications d'entreprise, QuickSight).

## 3. Les 6 Piliers du Well-Architected Framework
- Excellence Opérationnelle : automatiser avec le code (IaC), changements fréquents et réversibles, anticiper les pannes.
- Sécurité : appliquer le moindre privilège, défense en profondeur, traçabilité totale, chiffrement partout.
- Fiabilité : tester la reprise après sinistre, reprise automatique sur panne, redondance Multi-AZ.
- Efficacité des Performances : adopter le sans serveur (Serverless), technologies avancées, expérimenter à l'échelle.
- Optimisation des Coûts : payer à l'usage, mesurer l'efficacité, utiliser Savings Plans et instances Spot.
- Durabilité : réduire l'empreinte carbone, optimiser l'utilisation des ressources, privilégier les processeurs AWS Graviton.

## 4. Stratégies de Migration (Les 7R)
- Rehost (Lift-and-Shift) : déplacer sans modification de code (le plus rapide).
- Replatform (Lift-Tinker-and-Shift) : optimiser quelques éléments sans toucher au cœur de code (ex. passer sur RDS).
- Refactor : réécrire en mode natif cloud (Serverless, microservices) pour une agilité maximale.
- Repurchase : remplacer par un progiciel SaaS.
- Relocate : transférer des machines virtuelles (VMware on AWS) sans reconfiguration.
- Retain : conserver sur site temporairement.
- Retire : désactiver les composants obsolètes inutiles.

## 5. Pièges d'Examen et Distinctions Clés
- Élasticité vs Évolutivité : l'élasticité s'adapte à la hausse ET à la baisse automatiquement (Auto Scaling) ; l'évolutivité (scalabilité) est la capacité à grandir.
- Haute Disponibilité vs Tolérance aux Pannes : la tolérance aux pannes garantit zéro interruption de service ; la haute disponibilité garantit un temps de rétablissement quasi imperceptible.
- Reprise après sinistre : classées du moins cher/plus lent au plus cher/immédiat : Backup & Restore -> Pilot Light -> Warm Standby -> Multi-Site Active-Active.

## 6. Chiffres et Limites à Retenir
- Règle Multi-AZ : au moins 3 zones de disponibilité par région AWS moderne.
- Distance entre AZ : séparées géographiquement mais à moins de 100 km avec une latence réseau inférieure à 2 millisecondes.
- Durabilité S3 Standard : conçue pour 99,999999999 % (11 neufs) par an.

Source officielle : AWS Certified Cloud Practitioner Exam Guide CLF-C02 (vérifié le 31/10/2026).
`
  },
  {
    id: 'fiche-express-d2-securite-conformite',
    domain: 'D2',
    title: 'Fiche Express Domaine 2 : Sécurité et Conformité (30 %)',
    content: `# Fiche Express : Domaine 2 - Sécurité et Conformité AWS (Pondération officielle : 30 %)

## 1. Modèle de Responsabilité Partagée (Le Cœur du Domaine 2)
- Responsabilité d'AWS (Sécurité DU Cloud) :
  - Infrastructure physique des centres de données (gardes, biométrie, alimentation redondante).
  - Destruction physique des disques défaillants selon les protocoles certifiés.
  - Matériel serveur, réseau mondial et hyperviseurs de virtualisation.
  - Sur RDS/Aurora : maintenance de l'OS hôte et application des correctifs du moteur de base de données.
- Responsabilité du Client (Sécurité DANS le Cloud) :
  - Gestion des identités et des accès (IAM, mots de passe forts, activation du MFA).
  - Données clients et chiffrement (au repos et en transit).
  - Configuration du pare-feu réseau (Groupes de sécurité, NACL, tables de routage).
  - Sur EC2 : installation, configuration et correctifs de sécurité du système d'exploitation invité.

## 2. Fondamentaux AWS IAM (Identity and Access Management)
- Compte racine (Root) : accès illimité. À verrouiller impérativement avec MFA. Ne jamais utiliser pour les opérations quotidiennes.
- Utilisateur IAM : identité pour une personne physique avec identifiants permanents.
- Groupe IAM : ensemble d'utilisateurs partageant des permissions communes (pas d'imbrication de groupes).
- Rôle IAM : identité temporaire sans mot de passe permanent, assumée par des ressources AWS (ex. instance EC2 accédant à S3) ou des utilisateurs externes (fédération SSO).
- Principe de Moindre Privilège : n'accorder que les actions strictement nécessaires sur les ressources cibles.
- Évaluation des politiques JSON : un refus explicite (Explicit Deny) l'emporte TOUJOURS sur une autorisation (Allow). Par défaut, tout est refusé implicitement.

## 3. Services de Protection et Détection
- AWS WAF : pare-feu applicatif de couche 7 filtrant les attaques Web (injections SQL, scripts XSS, blocage d'adresses IP malveillantes).
- AWS Shield Standard : protection DDoS automatique et gratuite active sur tous les points d'entrée AWS (couches 3 et 4).
- AWS Shield Advanced : protection DDoS étendue payante avec accès 24/7 à l'équipe de réponse spécialisée (SRT).
- Amazon GuardDuty : détection intelligente des intrusions et menaces via Machine Learning analysant les logs DNS, VPC Flow Logs et CloudTrail.
- Amazon Inspector : scanner automatisé de vulnérabilités logicielles (CVE) et d'exposition réseau pour instances EC2, images de conteneurs ECR et fonctions Lambda.
- Amazon Macie : découverte et classification automatisée des données personnelles sensibles (PII) dans Amazon S3 via ML.
- AWS Secrets Manager : stockage chiffré et rotation automatique programmée des identifiants et mots de passe de bases de données.
- AWS KMS : création et gestion centralisée des clés de chiffrement (clés gérées par AWS ou par le client).
- AWS Artifact : portail en libre accès pour télécharger les rapports de conformité et certifications officielles (SOC, ISO, PCI-DSS).

## 4. Pièges d'Examen et Distinctions Clés
- Rôle IAM vs Clés d'accès sur EC2 : ne JAMAIS stocker de clés d'accès sur une instance EC2 ; lui associer obligatoirement un profil d'instance avec rôle IAM.
- GuardDuty vs Inspector : GuardDuty analyse le comportement anormal en continu ; Inspector analyse les failles logicielles statiques dans les packages installés.
- WAF vs Shield : Shield bloque les attaques volumétriques DDoS réseau ; WAF inspecte le contenu applicatif des requêtes HTTP/HTTPS.

## 5. Chiffres et Limites Clés
- Validité des identifiants temporaires de rôle IAM : de 15 minutes à 12 heures (1 heure par défaut).
- Mot de passe racine : obligation de configurer au minimum 1 facteur MFA physique ou virtuel.

Source officielle : AWS Certified Cloud Practitioner Exam Guide CLF-C02 (vérifié le 31/10/2026).
`
  },
  {
    id: 'fiche-express-d3-technologies-services',
    domain: 'D3',
    title: 'Fiche Express Domaine 3 : Technologies et Services Cloud (34 %)',
    content: `# Fiche Express : Domaine 3 - Technologies et Services Cloud (Pondération officielle : 34 %)

## 1. Infrastructure Globale AWS
- Régions : emplacements géographiques séparés dans le monde, composés d'au moins 3 zones de disponibilité.
- Zones de Disponibilité (AZ) : un ou plusieurs datacenters discrets avec alimentation et connectivité indépendantes.
- Points de Présence (Edge Locations) : centaines de sites relais mondiaux pour le cache CloudFront et la protection Shield/WAF.
- AWS Outposts : serveurs AWS déployés directement dans votre datacenter sur site pour un fonctionnement hybride.

## 2. Calcul et Conteneurs
- Amazon EC2 : machines virtuelles avec contrôle complet de l'OS.
- AWS Lambda : calcul sans serveur (Serverless) facturé à la milliseconde, sans gestion d'infrastructure.
- Amazon ECS : orchestrateur de conteneurs Docker simplifié natif AWS.
- Amazon EKS : orchestrateur de conteneurs basé sur le standard ouvert Kubernetes.
- AWS Fargate : moteur d'exécution de conteneurs sans serveur pour ECS et EKS (supprime la gestion des instances EC2).

## 3. Options d'Achat Amazon EC2
- À la demande (On-Demand) : aucun engagement, paiement à la seconde, idéal pour charges de travail imprévisibles.
- Savings Plans : engagement d'utilisation sur 1 ou 3 ans en USD/heure, jusqu'à 72 % de remise, très flexible.
- Instances Réservées (RI) : engagement sur 1 ou 3 ans pour une région donnée (Standard ou Convertible).
- Instances Spot : jusqu'à 90 % de réduction sur la capacité excédentaire, révocable avec préavis de 2 minutes.
- Hôtes Dédiés (Dedicated Hosts) : serveur physique dédié permettant la conformité réglementaire et la gestion de licences BYOL par socket.

## 4. Stockage et Bases de Données
- Amazon S3 : stockage objet universel hautement durable (11 neufs).
  - S3 Intelligent-Tiering : optimisation automatique des coûts sans frais de récupération.
  - S3 Glacier / Deep Archive : archivage économique à froid (récupération de quelques minutes à 12 heures).
- Amazon EBS : stockage bloc pour instances EC2 au sein d'une seule AZ. Snapshots incrémentiels sur S3.
- Amazon EFS : système de fichiers réseau partagé (NFS) multi-AZ pour instances Linux.
- Amazon RDS : bases de données relationnelles gérées (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server).
- Amazon Aurora : moteur relationnel haute performance conçu par AWS, 6 répliques sur 3 AZ, bascule rapide.
- Amazon DynamoDB : base de données NoSQL clé-valeur sans serveur offrant une latence inférieure à 10 ms.
- Amazon Redshift : entrepôt de données analytique (data warehouse) colonnaire pour requêtes SQL massives.
- Amazon ElastiCache : mémoire cache en mémoire vive (Redis/Memcached) pour accélérer la lecture des données fréquentes.

## 5. Réseau et Connectivité
- Amazon VPC : réseau privé virtuel isolé dans le cloud.
- Security Group : pare-feu à état (Stateful) au niveau de l'instance (règles Allow uniquement).
- NACL : pare-feu sans état (Stateless) au niveau du sous-réseau (règles Allow et Deny).
- Passerelle Internet (IGW) : permet les échanges bidirectionnels avec Internet.
- Passerelle NAT : permet aux sous-réseaux privés d'accéder à Internet en sortie sans accepter de connexions entrantes.
- AWS Direct Connect : liaison physique dédiée privée de votre datacenter vers AWS (contourne Internet).

## 6. Surveillance et Traçabilité
- Amazon CloudWatch : métriques, tableaux de bord de santé, journaux et alarmes de performance.
- AWS CloudTrail : enregistrement d'audit de chaque appel d'API (qui a fait quoi, quand et d'où).
- AWS Config : inventaire des configurations et validation continue de la conformité des règles d'architecture.

Source officielle : AWS Certified Cloud Practitioner Exam Guide CLF-C02 (vérifié le 31/10/2026).
`
  },
  {
    id: 'fiche-express-d4-facturation-support',
    domain: 'D4',
    title: 'Fiche Express Domaine 4 : Facturation, Tarification et Support (12 %)',
    content: `# Fiche Express : Domaine 4 - Facturation, Tarification et Support AWS (Pondération officielle : 12 %)

## 1. Outils de Gestion des Coûts AWS
- AWS Pricing Calculator : outil web public pour estimer le coût d'une architecture prévisionnelle AVANT déploiement.
- AWS Cost Explorer : outil interactif pour analyser, filtrer et projeter les dépenses réelles passées et futures (prévision à 12 mois).
- AWS Budgets : définition de plafonds budgétaires avec déclenchement d'alertes par email ou SMS en cas de dépassement réel ou prévu.
- AWS Cost and Usage Report (CUR) : fichier de données le plus exhaustif et détaillé sur la consommation horaire, exporté dans S3.
- Balises de répartition des coûts (Cost Allocation Tags) : métadonnées personnalisées pour attribuer les coûts à des projets ou centres de coût.
- Facturation consolidée (Consolidated Billing) : regroupement de plusieurs comptes au sein d'AWS Organizations pour mutualiser les paliers de volume et obtenir une facture unique.

## 2. Les 4 Niveaux de Support AWS Officiels
| Caractéristique | Basic | Developer | Business | Enterprise |
| :--- | :--- | :--- | :--- | :--- |
| **Coût** | Gratuit | À partir de 29 USD/mois | À partir de 100 USD/mois | À partir de 15 000 USD/mois |
| **Public cible** | Tous les comptes | Tests et prototypage | Charges en production | Systèmes critiques majeurs |
| **Canaux d'accès** | Service client uniquement | Email en heures ouvrées | 24/7 Téléphone, Chat, Email | 24/7 Téléphone, Chat, Email |
| **Ingénieurs Cloud** | Non | 1 contact principal | Contacts illimités | Contacts illimités |
| **Délai panne critique** | Aucun | < 12h (panne système) | < 1h (production en panne) | < 15 min (système critique en panne) |
| **Trusted Advisor** | 7 contrôles de base | 7 contrôles de base | Contrôles intégraux | Contrôles intégraux |
| **Accompagnement dédié** | Aucun | Aucun | Aucun | TAM (Technical Account Manager) dédié |
| **Événements majeurs** | Non | Non | Non | IEM (Infrastructure Event Management) |

## 3. AWS Trusted Advisor : Les 5 Catégories de Recommandations
1. Optimisation des coûts (Cost Optimization) : instances EC2 inactives, volumes EBS non attachés.
2. Sécurité (Security) : accès racine sans MFA, compartiments S3 publics, ports de sécurité grands ouverts (0.0.0.0/0).
3. Tolérance aux pannes (Fault Tolerance) : sauvegardes EBS obsolètes, absence de réplication RDS Multi-AZ.
4. Performances (Performance) : surcharge des règles de débit, provisionnement inadapté.
5. Quotas de service (Service Quotas) : utilisation approchant de la limite maximale autorisée sur le compte.

## 4. Pièges d'Examen et Distinctions Clés
- Calculateur de coûts vs Cost Explorer : Pricing Calculator = avant la création (estimation) ; Cost Explorer = après la création (suivi des dépenses réelles).
- Budgets vs Cost Explorer : Budgets = système d'alerte proactif ; Cost Explorer = visualisation et reporting analytique.
- TAM (Technical Account Manager) : EXCLUSIF au plan Enterprise. Si une question mentionne un conseiller technique dédié, la seule bonne réponse est Enterprise.
- Délai de réponse de 15 minutes : EXCLUSIF au plan Enterprise pour un cas d'incident critique d'entreprise (business-critical system down).

## 5. Chiffres Clés
- Nombre de contrôles Trusted Advisor de base gratuits : 7 contrôles dans le plan Basic et Developer.
- Période maximale de prévision dans Cost Explorer : jusqu'à 12 mois dans le futur.
- Facturation minimale Lambda : granularité par tranche de 1 milliseconde.

Source officielle : AWS Certified Cloud Practitioner Exam Guide CLF-C02 (vérifié le 31/10/2026).
`
  }
];

for (const fe of FICHES_EXPRESS) {
  const filePath = path.join(FICHES_DIR, `${fe.id}.md`);
  fs.writeFileSync(filePath, fe.content.trim() + '\n', 'utf8');
}
console.log(`[LOT 1 CLF] ${FICHES_EXPRESS.length} fiches express générées avec succès.`);
