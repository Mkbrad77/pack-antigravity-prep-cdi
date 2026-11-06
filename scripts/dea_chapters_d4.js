export const deaChaptersD4 = [
  {
    file: 'dea-29-iam-moindre-privilege-data.md',
    title: 'Gestion des Accès et Moindre Privilège : Politiques et Rôles IAM',
    content: `# Chapitre 29 : Gestion des Accès et Moindre Privilège : Politiques et Rôles IAM

## 1. Objectifs d'apprentissage
- Comprendre la distinction entre politiques basées sur l'identité (IAM) et politiques basées sur les ressources.
- Configurer les rôles de service IAM pour AWS Glue, Lambda, EMR et Amazon Redshift.
- Appliquer rigoureusement le principe du moindre privilège aux pipelines de données.
- Gérer les accès inter-comptes avec la politique d'approbation (Trust Policy).

## 2. Explication claire : quand choisir quoi
AWS Identity and Access Management (IAM) est le système central de contrôle des accès aux ressources AWS. Dans les architectures Data, la majorité des accès sont effectués par des services et des applications plutôt que par des utilisateurs humains :

1. Politiques d'identité vs Politiques de ressources :
- Politiques basées sur l'identité (Identity-based policies) :
  - Attachées directement à un utilisateur, un groupe ou un rôle IAM.
  - Définissent les actions que cette entité peut exécuter (ex. autoriser le rôle Glue \`MonRoleETL\` à lire sur un bucket S3).
- Politiques basées sur les ressources (Resource-based policies) :
  - Attachées directement à la ressource protégée (ex. S3 Bucket Policy, clé KMS Key Policy, file d'attente SQS Policy).
  - Définissent QUI a le droit d'accéder à CETTE ressource spécifique, y compris des comptes AWS tiers (accès cross-account).
  - Règle d'or : pour qu'un accès inter-comptes fonctionne, l'action doit être explicitement autorisée dans la politique d'identité du compte appelant ET dans la politique de ressource du compte cible.

2. Rôles de service IAM pour les pipelines :
- Ne JAMAIS coder de clés d'accès IAM statiques (\`AWS_ACCESS_KEY_ID\` et \`AWS_SECRET_ACCESS_KEY\`) dans le code source d'un script PySpark ou d'une fonction Lambda.
- Utiliser systématiquement un rôle IAM avec une relation d'approbation (Trust Policy) permettant au service d'assumer ce rôle (\`sts:AssumeRole\`) :
  - Pour AWS Glue : le principal dans la relation d'approbation doit être \`glue.amazonaws.com\`.
  - Pour AWS Lambda : le principal doit être \`lambda.amazonaws.com\`.
  - Pour Amazon Redshift : le principal doit être \`redshift.amazonaws.com\`.

3. Principe du moindre privilège :
- Restreindre les permissions aux seules actions strictement indispensables (ex. \`s3:GetObject\` et \`s3:PutObject\` sur un préfixe donné, sans autoriser \`s3:*\` ni \`s3:DeleteObject\`).
- Éviter d'attacher la politique gérée globale \`AdministratorAccess\` ou \`PowerUserAccess\` à des rôles de production.

## 3. Définitions des termes clés
- Trust Policy (Politique d'approbation) : document JSON définissant quelles entités ou quels services AWS ont le droit d'assumer le rôle IAM.
- Permission Boundary (Limite de permissions) : mécanisme avancé définissant le plafond maximal de permissions qu'un rôle ou utilisateur peut recevoir.
- Least Privilege (Moindre privilège) : principe de sécurité n'octroyant que le strict minimum de droits nécessaires à l'accomplissement d'une tâche.

## 4. Exemple concret
Politique de confiance (Trust Policy) autorisant le service AWS Glue à assumer un rôle :
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "glue.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
\`\`\`

## 5. Comparaisons et pièges d'examen
- Évaluation des politiques IAM : un refus explicite (\`Deny\`) l'emporte TOUJOURS sur toutes les autorisations (\`Allow\`). S'il n'y a ni Deny explicite ni Allow explicite, la requête est refusée par défaut (refus implicite).
- Politiques de clés KMS : même avec les droits administrateur complets (\`AdministratorAccess\`), un utilisateur ne peut pas déchiffrer un objet S3 si la clé KMS protégeant cet objet n'autorise pas explicitement l'utilisateur dans sa politique de clé (KMS Key Policy).

## 6. Lien avec SQL, Snowflake et Databricks
Ce principe de moindre privilège correspond au contrôle d'accès basé sur les rôles (RBAC) dans Snowflake et aux privilèges accordés aux Service Principals sur les catalogues dans Databricks Unity Catalog.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 356 à 365.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Quelle est la méthode sécurisée recommandée par AWS pour permettre à un job AWS Glue d'accéder aux données d'un compartiment Amazon S3 sans jamais stocker d'identifiants statiques dans le code ?
   - A) Assigner au job Glue un rôle IAM doté d'une politique de confiance autorisant le service glue.amazonaws.com (Bonne réponse).
   - B) Écrire la clé d'accès et le secret dans le script Python en dur.
   - C) Rendre le compartiment S3 public en lecture et écriture.
   - D) Désactiver l'authentification IAM sur le compte.
2. Si une politique de groupe IAM accorde \`Allow\` sur l'action \`s3:GetObject\` mais qu'une politique de bucket S3 spécifie \`Deny\` sur la même action pour cet utilisateur, que se passe-t-il lors de la requête ?
   - A) L'accès est refusé car un refus explicite (Deny) a toujours la priorité absolue (Bonne réponse).
   - B) L'accès est accordé car la politique IAM prime sur la politique de ressource.
   - C) Le fichier est téléchargé mais chiffré avec une clé aléatoire.
   - D) L'utilisateur est automatiquement déconnecté du compte AWS.
`
  },
  {
    file: 'dea-30-lake-formation-gouvernance.md',
    title: 'Gouvernance Centralisée et Contrôle d Accès Fin avec AWS Lake Formation',
    content: `# Chapitre 30 : Gouvernance Centralisée et Contrôle d Accès Fin avec AWS Lake Formation

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
  - Niveau table : accorder \`SELECT\` sur toute la table.
  - Niveau colonne (Column-level security) : autoriser ou interdire des colonnes spécifiques (ex. exclure la colonne \`salaire\` pour le groupe Analystes).
  - Niveau ligne (Row-level security - RLS) : définir des filtres de données (Data Filters) pour n'afficher que certaines lignes (ex. \`pays = 'FR'\`).
  - Niveau cellule (Cell-level security) : combinaison du filtrage de lignes et de colonnes.

2. Contrôle d'accès basé sur des balises (LF-TBAC) :
- Au lieu d'assigner des permissions ressource par ressource, vous définissez des balises LF-tags (ex. \`Confidentialite=Haute\`, \`Departement=Finance\`).
- Vous assignez des LF-tags aux bases, tables et colonnes, puis vous autorisez les utilisateurs ou rôles IAM sur les valeurs de ces balises.
- Avantage : évolutivité infinie. Lorsqu'une nouvelle table est créée avec la balise \`Departement=Finance\`, tous les membres du département Finance y ont accès automatiquement sans modification de politique.

3. Mode d'accès hybride (Hybrid Access Mode - DEA-C01 v1.1) :
- Permet de migrer progressivement vers les permissions Lake Formation sans casser les permissions IAM existantes.
- Les utilisateurs disposant de permissions IAM directes sur S3 continuent de fonctionner, tandis que les nouveaux utilisateurs ou services sont régis par les permissions fines Lake Formation.

## 3. Définitions des termes clés
- Data Filter : objet Lake Formation spécifiant les colonnes visibles et la condition SQL de filtrage des lignes.
- LF-tag : clé-valeur de métadonnées de gouvernance rattachée à des ressources du catalogue de données.
- Principal Lake Formation : utilisateur IAM, rôle IAM ou utilisateur SAML recevant des privilèges de gouvernance.

## 4. Exemple concret
Architecture de gouvernance fine avec Lake Formation :
\`\`\`
                  [AWS Glue Data Catalog]
                             |
                [AWS Lake Formation Engine]
                             |
        +--------------------+--------------------+
        |                                         |
  [Groupe RH]                               [Groupe Ventes]
  - Colonnes : Toutes                       - Colonnes : Sans salaire ni SSN
  - Lignes : Tous pays                      - Lignes : Filtre pays = 'FR'
\`\`\`

## 5. Comparaisons et pièges d'examen
- Règle de révocation \`IAMAllowedPrincipals\` : par défaut, le catalogue Glue hérite d'un groupe spécial appelé \`IAMAllowedPrincipals\` qui court-circuite Lake Formation. Pour que les règles de sécurité fines de Lake Formation soient réellement appliquées, vous DEVEZ supprimer les permissions accordées à \`IAMAllowedPrincipals\` sur la table ou base de données.
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
`
  },
  {
    file: 'dea-31-kms-chiffrement-donnees.md',
    title: 'Gestion des Clés et Chiffrement des Données avec AWS KMS',
    content: `# Chapitre 31 : Gestion des Clés et Chiffrement des Données avec AWS KMS

## 1. Objectifs d'apprentissage
- Comprendre les différents types de clés dans AWS Key Management Service (AWS KMS).
- Différencier les mécanismes de chiffrement côté serveur : SSE-S3, SSE-KMS, SSE-C et client-side.
- Maîtriser la rotation des clés KMS et l'impact sur les performances des requêtes.
- Configurer les clés multi-régions (Multi-Region Keys) pour la réplication de Data Lake.

## 2. Explication claire : quand choisir quoi
AWS KMS permet de créer, contrôler et auditer les clés de chiffrement cryptographiques protégeant vos données au repos :

1. Les types de clés de chiffrement (KMS Keys) :
- Clés gérées par AWS (AWS Managed Keys) :
  - Créées automatiquement par les services AWS (ex. \`aws/s3\`, \`aws/redshift\`).
  - Gratuites à la création, rotation automatique tous les 1 an (ou 3 ans selon l'historique), non configurables par l'utilisateur (impossible de modifier leur politique).
- Clés gérées par le client (Customer Managed Keys - CMK) :
  - Créées et administrées entièrement par le client.
  - Vous contrôlez la politique de la clé, pouvez activer ou désactiver la clé, configurer la rotation annuelle automatique, et accorder l'accès à d'autres comptes AWS.
  - Recommandées pour toutes les architectures de production avec exigences de conformité strictes.

2. Modes de chiffrement au repos sur Amazon S3 :
- SSE-S3 (Server-Side Encryption with Amazon S3-Managed Keys) :
  - Chiffrement AES-256 transparent entièrement géré par S3 sans surcoût.
  - Activé par défaut pour tous les nouveaux objets S3.
- SSE-KMS (Server-Side Encryption with AWS KMS Keys) :
  - Chiffrement utilisant une clé KMS (gérée par AWS ou CMK).
  - Offre un contrôle d'accès strict (l'utilisateur doit avoir le droit sur l'objet S3 ET le droit \`kms:Decrypt\` sur la clé) et un audit complet dans CloudTrail de chaque opération de déchiffrement.
- SSE-C (Server-Side Encryption with Customer-Provided Keys) :
  - Le client fournit et gère sa propre clé cryptographique à chaque appel d'API HTTP ; AWS chiffre et jette la clé de la mémoire immédiatement. Non compatible avec de nombreux services managés comme Athena.
- Chiffrement côté client (Client-side encryption) :
  - Les données sont chiffrées sur la machine locale avant leur envoi vers AWS via le SDK AWS Encryption.

3. Clés KMS Multi-Régions (Multi-Region Keys) :
- Permettent de répliquer une même clé KMS dans plusieurs régions AWS avec le même identifiant de clé et le même matériau cryptographique.
- Cas d'usage idéal : réplication multi-régions S3 (CRR) avec chiffrement SSE-KMS, permettant aux applications de la région de secours de déchiffrer les objets répliqués localement sans appel réseau cross-région coûteux vers KMS.

## 3. Définitions des termes clés
- Envelope Encryption (Chiffrement par enveloppe) : pratique consistant à chiffrer les données avec une clé de données (Data Key), puis à chiffrer la clé de données avec une clé maîtresse (KMS Key).
- Key Policy (Politique de clé) : document JSON attaché à une clé KMS déterminant obligatoirement qui peut administrer et utiliser la clé. Sans autorisation dans la Key Policy, personne n'y accède.
- S3 Bucket Keys : fonctionnalité réduisant jusqu'à 99 % les coûts de requêtes KMS en utilisant une clé intermédiaire de compartiment pour déchiffrer plusieurs objets sans interroger KMS à chaque fichier.

## 4. Exemple concret
Réduction des coûts KMS avec les S3 Bucket Keys :
\`\`\`
Scénario standard (Sans S3 Bucket Keys) :
1 000 000 fichiers Parquet lus par Athena = 1 000 000 d'appels API KMS Decrypt

Scénario optimisé (Avec S3 Bucket Keys activé) :
S3 génère une clé de compartiment éphémère -> Réduction de 99 % des appels KMS Decrypt
\`\`\`

## 5. Comparaisons et pièges d'examen
- SSE-S3 vs SSE-KMS : si l'énoncé d'examen exige un journal d'audit démontrant chaque déchiffrement de fichier ou la possibilité de révoquer l'accès aux données sans toucher aux politiques S3, choisir impérativement SSE-KMS.
- Quotas KMS et S3 Bucket Keys : lors de l'exécution de requêtes Athena massives sur des millions de fichiers chiffrés avec SSE-KMS, vous risquez une erreur de throttling \`KMS ThrottlingException\`. L'activation des S3 Bucket Keys résout ce problème immédiatement.

## 6. Lien avec SQL, Snowflake et Databricks
La gestion des CMK KMS correspond aux fonctionnalités Bring Your Own Key (BYOK) ou Customer Managed Encryption Keys (CMEK) proposées par Snowflake Business Critical et Databricks pour protéger les données au repos avec les propres clés de l'entreprise.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 366 à 375.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Un pipeline analytique Amazon Athena exécutant des requêtes sur des millions de fichiers S3 chiffrés avec SSE-KMS commence à échouer avec des erreurs ThrottlingException de KMS. Quelle fonctionnalité activez-vous pour résoudre ce blocage sans modifier le chiffrement ?
   - A) Les clés de compartiment S3 (S3 Bucket Keys) (Bonne réponse).
   - B) Le passage de tous les fichiers en texte clair public.
   - C) La désactivation d'AWS CloudTrail.
   - D) L'augmentation de la taille des instances EC2 du client.
2. Pour quelle raison une organisation réglementée choisit-elle des clés gérées par le client (CMK) plutôt que les clés gérées par AWS par défaut dans AWS KMS ?
   - A) Pour pouvoir administrer la politique de clé, gérer la rotation manuellement et auditer l'utilisation (Bonne réponse).
   - B) Pour supprimer les coûts de stockage S3.
   - C) Parce que les clés gérées par AWS ne supportent pas le chiffrement AES-256.
   - D) Pour contourner l'obligation d'authentification IAM.
`
  },
  {
    file: 'dea-32-securite-reseau-vpc-privatelink.md',
    title: 'Isolation Réseau et Connexions Privées : VPC Endpoints et PrivateLink',
    content: `# Chapitre 32 : Isolation Réseau et Connexions Privées : VPC Endpoints et PrivateLink

## 1. Objectifs d'apprentissage
- Comprendre les mécanismes d'isolation réseau d'Amazon VPC pour les clusters de données.
- Différencier les points de terminaison de type Passerelle (Gateway) et Interface (PrivateLink).
- Connecter de manière étanche EMR, Redshift, Glue et Lambda sans passer par l'Internet public.
- Configurer les politiques d'endpoint (Endpoint Policies) pour restreindre les compartiments accessibles.

## 2. Explication claire : quand choisir quoi
Par mesure de sécurité stricte, les composants de données d'entreprise (clusters EMR, nœuds Redshift, bases RDS, jobs Glue) doivent être déployés dans des sous-réseaux privés sans adresse IP publique ni accès direct à l'Internet :

1. Les deux types de points de terminaison de VPC (VPC Endpoints) :
- Gateway Endpoints (Points de terminaison de passerelle) :
  - Disponibles pour DEUX services AWS uniquement : **Amazon S3** et **Amazon DynamoDB**.
  - Fonctionnement : ajout automatique d'une entrée de routage dans la table de routage du sous-réseau privé pointant vers l'identifiant de la passerelle.
  - Coût : entièrement GRATUIT, sans frais horaires ni frais de transfert de données.
  - Obligatoire : tout cluster EMR ou job Glue déployé dans un VPC privé doit avoir un Gateway Endpoint S3 configuré pour accéder aux scripts et aux données du Data Lake sans passer par une passerelle NAT payante.
- Interface Endpoints (Points de terminaison d'interface / AWS PrivateLink) :
  - Disponibles pour la quasi-totalité des autres services AWS (AWS Glue, Kinesis, Secrets Manager, CloudWatch, SageMaker, Athena) ainsi que pour des services tiers (ex. Snowflake sur AWS).
  - Fonctionnement : déploie une interface réseau virtuelle (ENI) avec une adresse IP privée directement au sein de votre sous-réseau VPC.
  - Coût : facturé à l'heure d'utilisation par zone de disponibilité plus frais au gigaoctet transféré.
  - Sécurité : filtré par les Groupes de Sécurité (Security Groups).

2. Politiques de points de terminaison (Endpoint Policies) :
- Document de contrôle d'accès JSON attaché au VPC Endpoint.
- Permet d'empêcher la fuite de données (Data Exfiltration) : vous pouvez configurer le Gateway Endpoint S3 pour n'autoriser les requêtes \`s3:PutObject\` QUE vers les compartiments appartenant à votre propre organisation, bloquant ainsi toute tentative d'exfiltration de données vers un compartiment S3 externe frauduleux.

## 3. Définitions des termes clés
- AWS PrivateLink : technologie réseau hautement disponible fournissant une connectivité privée et chiffrée entre VPCs et services AWS sans passer par Internet.
- ENI (Elastic Network Interface) : carte réseau virtuelle attachée à un sous-réseau de votre VPC possédant une adresse IP privée.
- Data Exfiltration : transfert non autorisé de données sensibles depuis un réseau interne sécurisé vers l'extérieur.

## 4. Exemple concret
Architecture de traitement Big Data entièrement privée sans Internet :
\`\`\`
[VPC Entreprise (10.0.0.0/16)]
  ├── [Sous-réseau Privé (10.0.1.0/24)]
  │     ├── [Cluster Amazon EMR Spark]
  │     └── [Job AWS Glue ETL]
  │
  ├── [Gateway Endpoint S3 (Gratuit)] ------> [Amazon S3 (Data Lake)]
  └── [Interface Endpoint Secrets Manager] -> [AWS Secrets Manager (Mots de passe BDD)]
\`\`\`

## 5. Comparaisons et pièges d'examen
- Gateway Endpoint vs Interface Endpoint pour S3 : bien qu'un Interface Endpoint pour S3 existe également pour des besoins de connectivité depuis des sites distants (on-premises via Direct Connect), la bonne pratique officielle pour les ressources situées dans le VPC reste le **Gateway Endpoint S3** en raison de sa gratuité totale et de son débit illimité.
- Oubli de la table de routage : lors de la création d'un Gateway Endpoint, il faut impérativement cocher les tables de routage associées à vos sous-réseaux privés pour que le routage interne prenne effet.

## 6. Lien avec SQL, Snowflake et Databricks
AWS PrivateLink est la méthode d'interconnexion privilégiée utilisée par les grandes banques et institutions pour connecter leur VPC AWS applicatif à Snowflake ou aux workspaces Databricks sans que les flux de requêtes SQL ne traversent l'Internet public.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 376 à 385.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Un cluster Amazon EMR tourne dans un sous-réseau privé sans connexion Internet. Quel composant réseau gratuit devez-vous configurer pour lui permettre de lire et écrire des pétaoctets de données sur Amazon S3 à très haut débit sans payer de frais de transfert NAT ?
   - A) Un VPC Gateway Endpoint pour Amazon S3 (Bonne réponse).
   - B) Une passerelle NAT managée avec IP Elastic.
   - C) Un tunnel VPN IPsec.
   - D) Une connexion peering avec un compte AWS public.
2. Comment pouvez-vous garantir techniquement que les instances de votre réseau privé ne puissent déposer des fichiers que sur le compartiment S3 de votre entreprise, empêchant toute fuite de données vers d'autres comptes ?
   - A) Attacher une politique de point de terminaison (Endpoint Policy) restreignant l'accès aux seuls ARN autorisés (Bonne réponse).
   - B) Désactiver le protocole TCP/IP.
   - C) Réduire la mémoire vive des instances EC2.
   - D) Modifier le fichier /etc/hosts de chaque machine manuellement.
`
  },
  {
    file: 'dea-33-macie-secrets-manager-protection.md',
    title: 'Protection des Données Sensibles : Amazon Macie et AWS Secrets Manager',
    content: `# Chapitre 33 : Protection des Données Sensibles : Amazon Macie et AWS Secrets Manager

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
  - Vos jobs Glue ETL ou fonctions Lambda interrogent Secrets Manager lors de l'exécution pour récupérer les identifiants à jour via l'API \`GetSecretValue\`, éliminant définitivement les pannes liées aux changements manuels de mots de passe.

## 3. Définitions des termes clés
- PII (Personally Identifiable Information) : informations permettant d'identifier directement ou indirectement une personne physique.
- Finding (Constat de sécurité) : rapport détaillé généré par Macie décrivant la ressource sensible localisée et son niveau de gravité.
- Rotation Lambda : script sans serveur orchestrant la modification sécurisée des identifiants entre Secrets Manager et le moteur de base de données.

## 4. Exemple concret
Pipeline sécurisé avec Secrets Manager et détection PII par Macie :
\`\`\`
[Fichiers clients déposés dans s3://lake-raw/]
                      |
                      v
            [Amazon Macie Scan]
       (Détection numéro de carte bancaire)
                      |
                      v
      [EventBridge Rule -> Alerte SNS Sécurité]

[Job AWS Glue ETL] ---> [Secrets Manager (GetSecretValue)] ---> [Connexion Amazon Redshift]
\`\`\`

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
`
  },
  {
    file: 'dea-34-anonymisation-masquage-salage.md',
    title: 'Techniques d Anonymisation, Masquage de Données et Salage de Clés',
    content: `# Chapitre 34 : Techniques d Anonymisation, Masquage de Données et Salage de Clés

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
  - La valeur originale est altérée définitivement dans la table cible (ex. remplacement de l'email par \`j***@domain.com\` ou du numéro de téléphone par \`+33 6 ** ** ** 12\`).
  - Idéal pour alimenter les environnements de test, de recette ou d'entraînement de modèles IA.
- Masquage dynamique (Dynamic Data Masking) :
  - La donnée brute reste intacte dans le stockage, mais la vue SQL ou la politique de sécurité (Lake Formation, Redshift, Snowflake) masque la valeur à la volée en fonction du rôle de l'utilisateur qui exécute la requête.
- Tokenisation (Tokenization) :
  - Remplacement d'une donnée sensible par un jeton aléatoire (token) non dérivable mathématiquement, avec une table de correspondance sécurisée (coffre-fort de tokens) accessible uniquement aux services autorisés.

2. Hachage et Salage cryptographique (Cryptographic Salting) :
- Hachage simple (ex. \`SHA-256(email)\`) : vulnérable aux attaques par dictionnaire ou tables arc-en-ciel (rainbow tables) : deux utilisateurs ayant le même mot de passe ou la même adresse génèrent exactement le même hash.
- Salage (Salting) : ajout d'une chaîne aléatoire secrète (le sel) à la donnée avant le hachage (\`SHA-256(email + secret_salt)\`). Rend le déchiffrement inverse et la corrélation statistique impossibles sans connaître le sel secret (stocké dans AWS Secrets Manager).

3. Salage pour la performance Big Data (Key Salting dans Spark) :
- Résout le problème du **Data Skew** (asymétrie de distribution) dans les jointures Spark sur EMR ou Glue :
  - Si une clé de jointure (ex. \`pays = 'FR'\`) concentre 80 % des données, un seul exécuteur Spark sature et ralentit tout le job.
  - Technique de salage Spark : on concatène un nombre aléatoire entre 1 et N à la clé (\`FR_1\`, \`FR_2\`, ..., \`FR_N\`), répartissant équitablement les données entre N exécuteurs distincts.

## 3. Définitions des termes clés
- Pseudonymisation : traitement de données personnelles de telle sorte qu'elles ne puissent plus être attribuées à une personne sans informations supplémentaires.
- Sel (Salt) : chaîne de données aléatoires combinée à une valeur avant hachage pour en garantir l'unicité et la robustesse.
- Rainbow Table : table précalculée associant des valeurs courantes à leurs empreintes de hachage.

## 4. Exemple concret
Masquage et hachage salé dans un script PySpark Glue :
\`\`\`python
from pyspark.sql.functions import sha2, concat, lit, regexp_replace

secret_salt = "cle_secrete_kms_987456"

df_anonymise = df_clients \\
    .withColumn("email_hashe", sha2(concat("email", lit(secret_salt)), 256)) \\
    .withColumn("telephone_masque", regexp_replace("telephone", "\\d{6}$", "******")) \\
    .drop("email", "nom", "adresse")
\`\`\`

## 5. Comparaisons et pièges d'examen
- Anonymisation irréversible vs Pseudonymisation : l'anonymisation détruit définitivement le lien d'identification (sort du champ d'application du RGPD) ; la pseudonymisation permet de réidentifier la personne si l'on possède la clé de correspondance ou le sel.
- Oublier le sel lors du hachage de clés à faible cardinalité : piège d'examen classique où un hachage direct d'un code postal ou d'un sexe biologique est trivialement cassé par énumération.

## 6. Lien avec SQL, Snowflake et Databricks
Cette approche correspond directement aux fonctions de masquage de données dynamiques (\`CREATE MASKING POLICY\`) dans Snowflake et aux filtres de masquage de colonnes gérés par Unity Catalog dans Databricks.

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
`
  },
  {
    file: 'dea-35-sagemaker-catalog-unified-studio.md',
    title: 'Gouvernance Moderne : Amazon SageMaker Catalog et Unified Studio',
    content: `# Chapitre 35 : Gouvernance Moderne : Amazon SageMaker Catalog et Unified Studio

## 1. Objectifs d'apprentissage
- Comprendre le rôle d'Amazon SageMaker Catalog pour la découverte de données métier (compétence clé DEA-C01 v1.1).
- Découvrir Amazon SageMaker Unified Studio pour les espaces de travail collaboratifs de données et d'IA.
- Maîtriser le suivi du lignage des données et modèles (ML Lineage Tracking).
- Administrer la gouvernance des projets et des accès aux domaines de données.

## 2. Explication claire : quand choisir quoi
La révision version 1.1 du guide DEA-C01 met l'accent sur la convergence entre l'ingénierie des données et l'ingénierie de l'intelligence artificielle grâce aux nouveaux services unifiés :

1. Amazon SageMaker Catalog (DEA-C01 v1.1 - Compétence 2.2.6) :
- Qu'est-ce que c'est : un catalogue de données orienté métier qui enrichit les métadonnées techniques de l'AWS Glue Data Catalog avec du contexte organisationnel, des glossaires métier, des propriétaires de données et des statuts de qualité.
- Intégration transparente : se synchronise avec AWS Glue Data Catalog et AWS Lake Formation pour fournir une vue centralisée des actifs de données de l'entreprise (tables Iceberg, jeux de données S3, modèles d'embeddings, jeux de données de fonctionnalités Feature Store).

2. Amazon SageMaker Unified Studio (DEA-C01 v1.1 - Compétences 4.1.7 et 4.5.6) :
- Qu'est-ce que c'est : environnement de travail unique et collaboratif regroupant les outils d'ingénierie des données, d'analytique et de Machine Learning (remplaçant les interfaces fragmentées).
- Domaines et Projets :
  - Domaine (Domain) : périmètre organisationnel configuré au niveau de l'entreprise ou d'une direction (ex. Direction Data & IA), intégrant l'authentification d'entreprise (IAM Identity Center / SSO).
  - Projets (Projects) : espaces de travail isolés par équipe ou par cas d'usage associant des personnes, des ressources de calcul, des accès aux données et des règles de gouvernance strictes.
  - Gestion des accès simplifiée : l'accès aux données du catalogue est accordé directement au niveau du projet, éliminant la complexité de configurer manuellement des dizaines de rôles IAM individuels.

3. Traçabilité et Lignage (ML Lineage Tracking) :
- Enregistre l'arbre généalogique complet des données : quel fichier source S3 a été consommé par quel job Glue ETL, quelle table Iceberg a été produite, et quel modèle d'apprentissage machine ou base vectorielle a été entraîné avec cette version exacte de données.
- Indispensable pour la conformité réglementaire (ex. AI Act européen) et l'auditabilité des résultats d'inférence.

## 3. Définitions des termes clés
- ML Lineage : traçabilité de bout en bout des étapes de transformation de données, des artefacts et des modèles.
- SageMaker Feature Store : référentiel centralisé pour stocker, partager et servir des variables précalculées (features) pour l'entraînement et l'inférence temps réel.
- Data Product (Produit de données) : ensemble de données documenté, certifié et maintenu par une équipe métier spécifique au sein du catalogue.

## 4. Exemple concret
Cycle de vie de gouvernance dans SageMaker Unified Studio :
\`\`\`
[Data Lake S3 / Tables Iceberg]
             |
   [Glue Data Catalog]
             |
   [SageMaker Catalog (Glossaire métier, Propriétaire, Score DQDL)]
             |
             v
[SageMaker Unified Studio (Domaine Data)]
   ├── [Projet Détection Fraude] -> Accès restreint aux transactions bancaires
   └── [Projet Recommandation E-commerce] -> Accès restreint aux clics Web
\`\`\`

## 5. Comparaisons et pièges d'examen
- SageMaker Catalog vs Glue Data Catalog : Glue Data Catalog est le catalogue de métadonnées techniques (schémas, types de colonnes, partitions physiques) utilisé par les moteurs d'exécution (Athena, Spark, Redshift) ; SageMaker Catalog est la couche de gouvernance métier et d'exploration fonctionnelle partagée entre équipes data et IA.
- Partage de données : SageMaker Catalog et Lake Formation s'intègrent pour permettre le partage de données inter-projets sans réplication physique.

## 6. Lien avec SQL, Snowflake et Databricks
SageMaker Catalog et Unified Studio correspondent directement à l'expérience unifiée de Databricks Unity Catalog et aux fonctionnalités de Data Clean Rooms et d'Object Tagging de Snowflake Horizon.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 403 à 410.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Quelle plateforme unifiée introduite dans la révision DEA-C01 v1.1 permet d'organiser les espaces de travail par domaines et projets avec gestion centralisée des accès aux actifs de données et d'IA ?
   - A) Amazon SageMaker Unified Studio (Bonne réponse).
   - B) AWS Cloud9.
   - C) Amazon WorkSpaces classique.
   - D) AWS OpsWorks Stacks.
2. Quel composant permet de retracer avec précision quel jeu de données Amazon S3 et quel job d'ingestion ont servi à générer une table de caractéristiques analytiques pour un audit de conformité ?
   - A) Le suivi de lignage (ML Lineage Tracking) (Bonne réponse).
   - B) Les métriques de facturation AWS Budgets.
   - C) Le cache DynamoDB DAX.
   - D) Le fichier de configuration du VPC Internet Gateway.
`
  }
];
