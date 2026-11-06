# Chapitre 5 : Services de Protection, Chiffrement et Sécurité Avancée

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
