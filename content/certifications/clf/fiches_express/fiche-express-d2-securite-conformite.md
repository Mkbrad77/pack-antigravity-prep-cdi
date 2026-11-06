# Fiche Express : Domaine 2 - Sécurité et Conformité AWS (Pondération officielle : 30 %)

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
