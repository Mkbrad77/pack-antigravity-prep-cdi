# Fiche Express Domaine 4 : Sécurité et Gouvernance des Données (18 %)

## 1. Vue d'ensemble du Domaine 4
Le Domaine 4 représente 18 % de l'examen DEA-C01. Il valide l'expertise sur le contrôle d'accès (IAM, Lake Formation), le chiffrement (KMS), l'isolation réseau (VPC, PrivateLink), la détection de données sensibles (Macie), et la gouvernance unifiée (SageMaker Catalog, Unified Studio).

## 2. Les 12 Chiffres et Limites Critiques à Retenir
1. Règle d'évaluation des politiques IAM : un refus explicite (`Deny`) l'emporte TOUJOURS sur n'importe quel `Allow`. En l'absence de Deny et d'Allow, la décision est refusée par défaut.
2. Accès inter-comptes (Cross-Account) : requiert obligatoirement une autorisation dans la politique IAM du compte émetteur ET dans la politique de ressource du compte destinataire.
3. Rôles de service IAM : utilisation de `sts:AssumeRole` avec Trust Policy ciblant le service AWS (`glue.amazonaws.com`, `lambda.amazonaws.com`, `redshift.amazonaws.com`).
4. AWS Lake Formation : contrôle d'accès fin au niveau table, colonne, ligne (RLS) et cellule sans modifier les fichiers physiques sur S3.
5. Groupe par défaut Glue `IAMAllowedPrincipals` : doit obligatoirement être révoqué pour que les restrictions fines de Lake Formation soient actives.
6. Contrôle par balises Lake Formation (LF-TBAC) : gestion des permissions à grande échelle via des balises LF-tags attachées aux métadonnées.
7. Chiffrement S3 par défaut : SSE-S3 (AES-256) activé sans surcoût. SSE-KMS requis pour le contrôle des droits de déchiffrement et la traçabilité d'audit CloudTrail.
8. S3 Bucket Keys : réduit les appels d'API KMS de 99 % pour éviter le dépassement de quotas de requêtes lors des gros scans Athena.
9. VPC Gateway Endpoints : disponibles UNIQUEMENT pour Amazon S3 et Amazon DynamoDB ; entièrement GRATUITS et sans passerelle NAT.
10. VPC Interface Endpoints (AWS PrivateLink) : carte réseau virtuelle ENI avec IP privée déployée dans le sous-réseau ; payant à l'heure et au Go.
11. Amazon Macie : découverte automatique par apprentissage machine et regex de données sensibles PII (cartes bancaires, SSN, IBAN) sur S3.
12. AWS Secrets Manager : stockage sécurisé et rotation automatique périodique sans temps d'arrêt des identifiants de bases de données via fonction Lambda.

## 3. Matrice Décisionnelle d'Architecture : Quand Choisir Quoi
- Donner des droits à un job Glue sans stocker de clés d'accès : rôle IAM de service avec relation de confiance.
- Restreindre l'accès à certaines colonnes (sans salaire) et certaines lignes (pays=FR) pour un groupe d'analystes : AWS Lake Formation (Data Filters).
- Gérer les droits sur des centaines de tables sans politique individuelle : Lake Formation Tag-Based Access Control (LF-TBAC).
- Migrer vers Lake Formation sans casser les scripts existants basés sur IAM : Mode d'accès hybride (Hybrid Access Mode).
- Chiffrement avec clé dédiée dont le client gère la rotation et les droits d'audit : clé gérée par le client (CMK) dans AWS KMS.
- Répliquer un Data Lake chiffré KMS entre deux régions sans surcoût d'appels cross-régions : clés KMS Multi-Régions.
- Connecter un cluster EMR privé à S3 sans Internet et sans coût de transfert : VPC Gateway Endpoint pour Amazon S3.
- Empêcher l'exfiltration de données internes vers des buckets S3 externes : Endpoint Policy sur le VPC Endpoint S3.
- Détecter des fichiers de santé ou données bancaires non masqués dans le Data Lake : Amazon Macie.
- Renouveler les identifiants de connexion RDS tous les 30 jours sans interrompre les jobs ETL : AWS Secrets Manager avec rotation automatique.
- Protéger des emails dans un Data Lake ouvert sans risque d'attaque par tables arc-en-ciel : Hachage SHA-256 combiné à un sel secret (Salting).
- Éliminer le Data Skew lors d'une jointure Spark sur une clé asymétrique : salage de clés (Key Salting) en ajoutant un suffixe aléatoire.
- Découverte de données métier, catalogue unifié et suivi du lignage de données : Amazon SageMaker Catalog et Unified Studio (DEA-C01 v1.1).

## 4. Les 5 Pièges Majeurs d'Examen du Domaine 4
1. Oublier la politique de clé KMS : un utilisateur avec les droits `AdministratorAccess` ne peut pas lire un fichier S3 chiffré par une CMK KMS s'il n'est pas autorisé dans la Key Policy de la clé.
2. Fuite de données et Gateway Endpoints : un Gateway Endpoint S3 ouvre par défaut l'accès à TOUS les compartiments S3 AWS. Pour interdire l'exfiltration vers des comptes personnels, il faut définir une Endpoint Policy restrictive.
3. Hachage sans sel : un simple hachage SHA-256 sur des données prévisibles (codes postaux, sexes) est immédiatement cassable via des dictionnaires précalculés. Le salage secret est obligatoire.
4. Conflit IAM et Lake Formation : si `IAMAllowedPrincipals` conserve des droits sur la ressource, les restrictions Lake Formation sont ignorées par les utilisateurs disposant de droits S3.
5. Secrets Manager vs Parameter Store : pour une rotation automatique gérée des mots de passe RDS, seul Secrets Manager est valide.
