import fs from 'node:fs';
import path from 'node:path';
import { makeQDomain } from './question_builder.js';

const DOMAIN_4 = 'Domaine 4 : Sécurité, gouvernance et conformité (18 %)';
const makeQ = (idNum, topic_id, statement, options, correct_answer, expA, expB, expC, expD, source_url) =>
  makeQDomain(DOMAIN_4, idNum, topic_id, statement, options, correct_answer, expA, expB, expC, expD, source_url, 'dea', 'moyen', 120);

const questions = [];
let qNum = 247;

// ==========================================
// LAKE FORMATION (12 questions: 247-258)
// ==========================================

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Dans AWS Lake Formation, quel mécanisme de contrôle d'accès permet d'attribuer des autorisations de sécurité sur des centaines de tables et de colonnes de manière évolutive en utilisant des étiquettes métier (ex: 'Confidentialite=Prive') plutôt que d'énumérer chaque ressource individuellement ?",
  [
    "A) Le contrôle d'accès basé sur les balises Lake Formation (LF-TBAC : Lake Formation Tag-Based Access Control)",
    "B) Les politiques de compartiment S3 publiques",
    "C) Les listes de contrôle d'accès (ACL) POSIX",
    "D) Les groupes de sécurité VPC"
  ],
  "A",
  "LF-TBAC (Lake Formation Tag-Based Access Control) permet de définir et d'attacher des balises de gouvernance aux bases, tables et colonnes du catalogue, et d'accorder des permissions aux principaux IAM via des expressions logiques sur ces balises, simplifiant considérablement l'administration à grande échelle",
  "les politiques S3 publiques exposeraient les données à tous les utilisateurs d'Internet sans aucun contrôle d'accès fin",
  "les ACL POSIX s'appliquent aux fichiers d'un système de fichiers classique et ne s'intègrent pas à la gouvernance tabulaire du catalogue",
  "les groupes de sécurité opèrent au niveau réseau (adresses IP et ports) et ignorent les balises de données métier",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/TBAC-overview.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Une organisation souhaite masquer certaines lignes et exclure des colonnes sensibles (comme les salaires) d'une table du Data Lake pour un groupe d'analystes marketing, tout en laissant la table complète accessible aux contrôleurs de gestion. Quelle fonctionnalité d'AWS Lake Formation répond à ce besoin ?",
  [
    "A) Les filtres de données (Data Filters) offrant la sécurité au niveau des lignes, des colonnes et des cellules (Cell-level security)",
    "B) La réplication S3 vers un autre compartiment avec suppression manuelle",
    "C) L'interdiction d'accès à l'ensemble du compte AWS",
    "D) Le chiffrement de l'ordinateur de l'analyste avec BitLocker"
  ],
  "A",
  "les filtres de données (Data Filters) de Lake Formation permettent d'appliquer un filtrage granulaire au niveau des colonnes (sélection des attributs autorisés) et des lignes (clause WHERE déclarative), réalisant ainsi un contrôle précis au niveau de la cellule",
  "la réplication avec copie duplique les données, entraîne des coûts inutiles et génère des risques de désynchronisation",
  "bloquer l'accès au compte empêcherait les analystes de réaliser leurs tâches courantes",
  "BitLocker chiffre le disque local du poste de travail mais ne filtre aucune ligne ni colonne dans le Data Lake",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/data-filters-about.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Lors de la migration progressive d'un Data Lake géré par des politiques IAM directes vers AWS Lake Formation, quel mode d'accès permet de faire coexister les requêtes utilisant les anciennes permissions IAM et les nouvelles requêtes gouvernées par Lake Formation sans interruption ?",
  [
    "A) Le mode d'accès hybride (Hybrid Access Mode)",
    "B) Le mode de basculement brutal (Big Bang)",
    "C) La réinitialisation immédiate du catalogue Glue",
    "D) La désactivation définitive d'IAM"
  ],
  "A",
  "le mode d'accès hybride (Hybrid Access Mode) de Lake Formation permet d'accorder des permissions Lake Formation tout en conservant les autorisations IAM existantes via le groupe virtuel 'IAMAllowedPrincipals', garantissant une transition sans rupture",
  "un basculement brutal sans phase transitoire risque de briser immédiatement tous les jobs de production en cours",
  "réinitialiser le catalogue Glue détruirait l'ensemble des définitions de tables et métadonnées du lac de données",
  "IAM est le socle d'authentification central d'AWS et ne peut en aucun cas être désactivé",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/hybrid-access-mode.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Pour permettre à des analystes utilisant Amazon Athena d'interroger des données gérées par Lake Formation dans un compartiment Amazon S3, comment Lake Formation autorise-t-il l'accès physique aux objets S3 sous-jacents ?",
  [
    "A) Lake Formation enregistre le chemin S3 avec un rôle de service dédié et génère des identifiants temporaires à durée de vie limitée (Credential Vending) transmis au moteur Athena",
    "B) Lake Formation rend le compartiment S3 totalement public en lecture",
    "C) Chaque utilisateur individuel doit obligatoirement posséder une clé d'accès IAM permanente 'AdministratorAccess'",
    "D) Les analystes doivent copier manuellement les fichiers sur une clé USB physique"
  ],
  "A",
  "Lake Formation enregistre les emplacements de stockage S3 avec un rôle IAM de service; lorsqu'un utilisateur exécute une requête autorisée via Athena, Lake Formation distribue des identifiants temporaires STS d'accès à S3 (Credential Vending) sans exposer les autorisations S3 directes à l'utilisateur",
  "rendre le compartiment public violerait les règles fondamentales de sécurité et exposerait les données aux cyberattaques",
  "donner les droits AdministratorAccess viole le principe du moindre privilège et présente un danger critique",
  "le transfert sur clé USB physique est impossible sur le cloud et contraire à toute gouvernance d'entreprise",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/registration-role.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Quel rôle d'administration dans AWS Lake Formation est le seul habilité à enregistrer de nouveaux emplacements S3, accorder des droits administratifs et définir les paramètres de sécurité par défaut du catalogue ?",
  [
    "A) L'administrateur du Data Lake (Data Lake Administrator)",
    "B) L'utilisateur IAM invité non authentifié",
    "C) Le groupe de sécurité réseau du sous-réseau public",
    "D) Le rôle d'instance Amazon EC2 par défaut"
  ],
  "A",
  "l'administrateur du Data Lake (Data Lake Admin) détient les privilèges exclusifs pour enregistrer des chemins S3, déléguer des droits de gestion des métadonnées et configurer les paramètres de gouvernance globale dans Lake Formation",
  "un utilisateur non authentifié ne possède strictement aucun accès aux ressources AWS",
  "un groupe de sécurité réseau est un composant de couche réseau et n'a aucun statut d'administration dans Lake Formation",
  "le rôle EC2 par défaut ne dispose pas des droits d'administration de gouvernance du lac de données",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/lake-formation-permissions.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Comment AWS Lake Formation gère-t-il le partage de données de tables de Data Lake avec un compte AWS externe appartenant à une autre entité métier de l'entreprise ?",
  [
    "A) En utilisant AWS Resource Access Manager (AWS RAM) pour partager les ressources du catalogue ou les balises LF-TBAC entre comptes",
    "B) En créant des copies manuelles quotidiennes des fichiers S3 par FTP",
    "C) En configurant une clé d'accès IAM root partagée par courrier électronique",
    "D) En désactivant le pare-feu du compte cible"
  ],
  "A",
  "Lake Formation s'intègre nativement à AWS RAM (Resource Access Manager) pour partager des bases, des tables et des balises LF-TBAC avec des comptes AWS externes ou des unités organisationnelles AWS Organizations sans dupliquer les fichiers",
  "les copies manuelles par FTP démultiplient le stockage et créent des failles de sécurité de transfert",
  "partager des clés d'accès root est une faute de sécurité gravissime proscrite par AWS",
  "désactiver les pare-feux n'accorde aucun droit d'accès au catalogue de données",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/cross-account-prereqs.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Quelle permission Lake Formation permet à un utilisateur de déléguer à d'autres utilisateurs les mêmes droits que ceux qui lui ont été accordés sur une table ?",
  [
    "A) L'option 'Grantable' (avec option de délégation)",
    "B) L'action 'DenyAll'",
    "C) L'option 'ReadOnly'",
    "D) L'option 'MFA Required'"
  ],
  "A",
  "lorsqu'une permission Lake Formation est octroyée avec l'option 'Grantable', le bénéficiaire est autorisé à transmettre cette permission (ou un sous-ensemble) à d'autres principaux IAM du compte",
  "DenyAll refuse formellement tous les accès et empêche toute action",
  "ReadOnly limite l'accès à la consultation sans accorder de pouvoir d'administration ou de délégation",
  "l'option MFA impose une double authentification mais ne définit pas la transférabilité du droit",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/granting-lake-formation-permissions.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Pourquoi est-il nécessaire de révoquer les permissions du groupe 'IAMAllowedPrincipals' sur une table lorsqu'on souhaite appliquer une gouvernance stricte avec Lake Formation ?",
  [
    "A) Car 'IAMAllowedPrincipals' accorde un accès direct à tous les utilisateurs autorisés par les politiques IAM classiques, contournant les restrictions fines de Lake Formation",
    "B) Car ce groupe supprime automatiquement les tables du catalogue après 24 heures",
    "C) Car 'IAMAllowedPrincipals' chiffre les tables avec un mot de passe inconnu",
    "D) Car ce groupe empêche l'exécution de requêtes SQL sur Athena"
  ],
  "A",
  "la présence d'IAMAllowedPrincipals maintient la compatibilité descendante en déléguant l'accès aux seules politiques IAM; pour que les règles de filtrage (lignes/colonnes) de Lake Formation soient effectives, il faut révoquer ce groupe virtuel",
  "ce groupe ne supprime aucune ressource ni table du catalogue",
  "il n'applique aucun chiffrement par mot de passe secret",
  "sa révocation active précisément le contrôle d'accès fin lors des requêtes Athena sans les bloquer si les droits LF sont configurés",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/upgrade-glue-lake-formation.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Dans AWS Lake Formation, quelle action d'audit permet aux officiers de sécurité de suivre l'historique complet des accès aux données et des modifications de permissions sur le Data Lake ?",
  [
    "A) L'intégration avec AWS CloudTrail et l'historique d'audit Lake Formation",
    "B) L'affichage de l'historique de navigation du navigateur web",
    "C) La consultation des journaux DNS Route 53",
    "D) L'analyse des fichiers temporaires du système d'exploitation Windows"
  ],
  "A",
  "toutes les actions d'administration, les attributions de droits et les demandes de jetons d'accès aux données (Credential Vending) de Lake Formation sont consignées de manière immuable dans AWS CloudTrail",
  "l'historique local du navigateur ne fournit aucune garantie d'audit d'infrastructure cloud centralisée",
  "Route 53 n'enregistre que la résolution de noms de domaines et ignore les accès aux colonnes de données",
  "les fichiers temporaires Windows locaux n'ont aucun rapport avec la gouvernance du lac de données cloud",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/logging-using-cloudtrail.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Quelle fonctionnalité récente d'AWS Lake Formation permet de créer des règles d'accès S3 directement liées aux identités IAM sans devoir passer par des configurations de points d'accès multiples complexes ?",
  [
    "A) Lake Formation S3 Data Access Grants",
    "B) S3 Transfer Acceleration",
    "C) AWS Snowball Edge Vending",
    "D) Amazon RDS Multi-AZ Grants"
  ],
  "A",
  "S3 Data Access Grants s'intègre avec Lake Formation pour mapper directement les identités d'entreprise (via IAM Identity Center ou rôles IAM) à des préfixes S3 avec audit complet et distribution de jetons de session courts",
  "Transfer Acceleration optimise la vitesse réseau et ne gère pas les autorisations d'identités",
  "Snowball Edge est un équipement physique de migration",
  "RDS Multi-AZ Grants n'existe pas dans la terminologie des services de stockage d'AWS",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-grants.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Lors de l'utilisation d'un filtre de données (Data Filter) dans Lake Formation pour restreindre les lignes d'une table, quelle syntaxe standard utilise-t-on pour spécifier l'expression de prédicat de ligne autorisée ?",
  [
    "A) Une expression SQL conforme à la clause WHERE (ex: region = 'FR' AND statut = 'ACTIF')",
    "B) Une expression régulière Perl non standard",
    "C) Un script Python compilé en fichier .exe",
    "D) Une commande shell Bash avec awk"
  ],
  "A",
  "les filtres de lignes de Lake Formation utilisent des expressions prédicats conformes au standard SQL (clauses de type WHERE) évaluées dynamiquement par les moteurs analytiques supportés comme Athena ou EMR",
  "les expressions régulières Perl ne sont pas la syntaxe standard du moteur de filtrage déclaratif de Lake Formation",
  "Lake Formation n'exécute pas de binaires .exe personnalisés pour filtrer les lignes",
  "les commandes shell Bash ne sont pas interprétables par le moteur de métadonnées du lac de données",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/data-filters-about.html"
));

questions.push(makeQ(
  qNum++, 'lake-formation',
  "Quel est le rôle d'AWS Glue Data Catalog par rapport à AWS Lake Formation dans une architecture moderne de Data Lakehouse ?",
  [
    "A) Glue Data Catalog stocke les métadonnées techniques (schémas, partitions), tandis que Lake Formation apporte la couche de gouvernance et de contrôle d'accès fin par-dessus ce catalogue",
    "B) Lake Formation remplace et supprime définitivement le Glue Data Catalog",
    "C) Glue Data Catalog stocke les données physiques et Lake Formation stocke les sauvegardes",
    "D) Il n'existe aucun lien technique entre Glue Data Catalog et Lake Formation"
  ],
  "A",
  "Lake Formation s'appuie directement sur AWS Glue Data Catalog pour stocker les définitions de tables et schémas; Lake Formation agit comme une surcouche de sécurité enrichie gérant les permissions et les accès",
  "Lake Formation ne supprime pas Glue Data Catalog mais en étend les fonctionnalités de sécurité",
  "les données physiques résident sur Amazon S3 et non dans le catalogue de métadonnées",
  "les deux services sont étroitement intégrés et partagent les mêmes API de catalogue sous-jacentes",
  "https://docs.aws.amazon.com/lake-formation/latest/dg/how-it-works.html"
));

// ==========================================
// IAM & MOINDRE PRIVILÈGE (10 questions: 259-268)
// ==========================================

questions.push(makeQ(
  qNum++, 'iam',
  "Dans l'ordre d'évaluation logique des politiques IAM d'AWS, quel principe fondamental régit le comportement lorsqu'une politique contient une instruction 'Deny' explicite et qu'une autre politique contient un 'Allow' explicite sur la même action ?",
  [
    "A) L'instruction de refus explicite (Explicit Deny) l'emporte toujours sur toute autorisation (Explicit Allow)",
    "B) L'autorisation l'emporte toujours sur le refus",
    "C) L'action est autorisée uniquement si l'utilisateur possède une adresse IP française",
    "D) AWS tire au sort l'action avec une probabilité égale"
  ],
  "A",
  "le modèle d'évaluation IAM applique la règle stricte : en l'absence de politique, c'est un refus implicite (Default Deny); un Allow explicite accorde l'accès, mais un Deny explicite surpasse TOUJOURS toute règle d'autorisation",
  "l'autorisation ne surpasse jamais un refus explicite",
  "la localisation géographique ne modifie pas les règles de précédence d'évaluation d'IAM",
  "le moteur de sécurité IAM est entièrement déterministe et n'utilise aucun tirage aléatoire",
  "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"
));

questions.push(makeQ(
  qNum++, 'iam',
  "Quelle politique de contrôle d'organisation (Service Control Policy - SCP) dans AWS Organizations permet d'établir des barrières de sécurité (guardrails) préventives sur des comptes membres ?",
  [
    "A) Les SCP définissent les permissions maximales autorisées pour les comptes membres; elles n'accordent jamais de permissions directes mais agissent comme un filtre limitant",
    "B) Les SCP accordent automatiquement les droits complets AdministratorAccess à tous les utilisateurs",
    "C) Les SCP remplacent l'ensemble des politiques de compartiment S3",
    "D) Les SCP ne s'appliquent qu'aux utilisateurs invités anonymes"
  ],
  "A",
  "les SCP (Service Control Policies) fixent les frontières d'autorisation maximales pour les comptes d'une organisation; si une action n'est pas autorisée par la SCP (ou si elle est explicitement refusée), aucun utilisateur du compte ne peut l'exécuter, même l'administrateur root",
  "les SCP ne distribuent aucun droit d'accès positif direct sans politique IAM locale correspondante",
  "les SCP s'ajoutent aux politiques de ressources S3 sans les remplacer",
  "les SCP s'appliquent à toutes les identités IAM des comptes membres de l'organisation",
  "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"
));

questions.push(makeQ(
  qNum++, 'iam',
  "Quel composant IAM permet à un travailleur Apache Spark s'exécutant sur un cluster Amazon EMR ou une fonction Lambda d'accéder à un compartiment S3 sans coder d'identifiants permanents (Access Keys) dans les scripts ?",
  [
    "A) Un rôle IAM (IAM Role) assumé temporairement par le service AWS",
    "B) Un utilisateur IAM avec mot de passe permanent codé en clair dans le code",
    "C) Une clé API stockée sur une page web publique",
    "D) Un compte root sans mot de passe"
  ],
  "A",
  "les rôles IAM permettent aux services AWS (comme Lambda, EMR ou EC2) d'obtenir automatiquement des jetons de sécurité temporaires via AWS Security Token Service (STS), éliminant tout besoin de stocker des identifiants permanents dans le code applicatif",
  "coder des clés permanentes en dur dans le code est une pratique dangereuse et formellement proscrite",
  "exposer des clés d'API publiquement conduit à la compromission immédiate du compte",
  "le compte root ne doit jamais être utilisé pour des charges de travail automatisées",
  "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html"
));

questions.push(makeQ(
  qNum++, 'iam',
  "Dans une politique basée sur l'identité IAM, quel bloc JSON est requis pour spécifier formellement les actions permises, les ressources visées et les conditions de validité ?",
  [
    "A) Une déclaration (Statement) comprenant les éléments Effect, Action, Resource et éventuellement Condition",
    "B) Un schéma XML avec balises DTD",
    "C) Une fonction JavaScript asynchrone",
    "D) Un tableau de nombres binaires hexadécimaux"
  ],
  "A",
  "les politiques IAM sont des documents JSON composés d'un tableau d'instructions 'Statement' contenant impérativement les clés Effect (Allow ou Deny), Action (liste des opérations d'API), Resource (ARN des cibles) et optionnellement Condition",
  "les politiques IAM n'utilisent pas le format XML",
  "le moteur IAM interprète du JSON déclaratif et n'exécute pas de code JavaScript",
  "les politiques s'écrivent en texte clair JSON structuré et non en hexadécimal binaire",
  "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html"
));

questions.push(makeQ(
  qNum++, 'iam',
  "Quelle fonctionnalité IAM permet d'utiliser une politique gérée pour définir le plafond absolu des autorisations qu'un rôle ou un utilisateur peut se voir accorder, empêchant l'escalade de privilèges lors de la création d'autres rôles ?",
  [
    "A) Une limite de permissions (Permission Boundary)",
    "B) Un groupe d'utilisateurs IAM",
    "C) Une clé d'accès rotative",
    "D) Un certificat X.509"
  ],
  "A",
  "une limite de permissions (Permission Boundary) est un mécanisme de gouvernance avancé fixant le périmètre d'action maximal d'une entité IAM, garantissant qu'un développeur délégué ne peut pas s'octroyer ou octroyer à un rôle créé des droits supérieurs à cette frontière",
  "un groupe IAM rassemble des utilisateurs pour leur attribuer des droits mais ne plafonne pas les délégations",
  "la rotation de clé est une mesure opérationnelle de sécurité et non un mécanisme de limitation de privilèges",
  "les certificats X.509 servent à l'authentification HTTPS/mTLS et non à encadrer les plafonds d'autorisations IAM",
  "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html"
));

questions.push(makeQ(
  qNum++, 'iam',
  "Quelle politique de ressource (Resource-Based Policy) s'attache directement à un compartiment Amazon S3 pour contrôler qui peut accéder aux objets stockés, indépendamment des politiques attachées aux utilisateurs ?",
  [
    "A) Une politique de compartiment S3 (S3 Bucket Policy)",
    "B) Une politique de groupe de travail Athena",
    "C) Une règle de pare-feu WAF",
    "D) Une table de routage VPC"
  ],
  "A",
  "une politique de compartiment (Bucket Policy) est un document JSON attaché directement au bucket S3 définissant les actions permises ou refusées pour des principaux IAM locaux ou provenant de comptes AWS tiers",
  "les politiques de workgroup Athena gèrent les requêtes SQL et non les règles d'accès directes au stockage d'objets S3",
  "AWS WAF filtre le trafic HTTP des applications web et n'est pas une politique de stockage S3",
  "une table de routage achemine des paquets réseau IP et ne valide aucune identité IAM",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-policies.html"
));

questions.push(makeQ(
  qNum++, 'iam',
  "Dans une politique IAM, quelle clé de condition permet de restreindre l'exécution d'une action uniquement aux appels provenant d'une plage d'adresses IP d'entreprise spécifique ?",
  [
    "A) aws:SourceIp avec l'opérateur IpAddress",
    "B) aws:UserAgent avec l'opérateur StringEquals",
    "C) aws:RequestedRegion",
    "D) aws:CurrentTime"
  ],
  "A",
  "la clé de condition globale 'aws:SourceIp' associée à l'opérateur de condition 'IpAddress' permet de filtrer strictement l'origine réseau de la requête pour n'autoriser que les adresses IP publiques autorisées",
  "aws:UserAgent vérifie la chaîne d'en-tête du navigateur ou SDK, facilement falsifiable",
  "aws:RequestedRegion valide la région cible de l'appel et non l'IP source du client",
  "aws:CurrentTime permet de restreindre des accès sur des plages horaires de calendrier",
  "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-sourceip"
));

questions.push(makeQ(
  qNum++, 'iam',
  "Quelle bonne pratique de sécurité AWS stipule que chaque utilisateur et application ne doit recevoir strictement que les autorisations minimales indispensables à l'accomplissement de ses fonctions ?",
  [
    "A) Le principe du moindre privilège (Principle of Least Privilege)",
    "B) Le principe de l'accès illimité par défaut",
    "C) La politique open-bar d'entreprise",
    "D) Le modèle de sécurité par l'obscurité"
  ],
  "A",
  "le principe du moindre privilège impose d'octroyer uniquement les droits nécessaires pour accomplir la tâche requise, réduisant drastiquement la surface d'attaque et l'impact potentiel d'une compromission ou d'une erreur humaine",
  "l'accès illimité par défaut constitue une infraction majeure aux standards de sécurité informatique",
  "le modèle open-bar est le contraire absolu des exigences de conformité professionnelle",
  "la sécurité par l'obscurité ne remplace pas une gestion stricte des autorisations cryptographiques et déclaratives",
  "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege"
));

questions.push(makeQ(
  qNum++, 'iam',
  "Comment un utilisateur authentifié dans un compte AWS A peut-il être autorisé à accéder temporairement à des ressources sensibles situées dans un compte AWS B de manière sécurisée et auditable ?",
  [
    "A) En assumant un rôle IAM dans le compte B via l'opération STS AssumeRole avec une relation d'approbation (Trust Policy) appropriée",
    "B) En créant un utilisateur et un mot de passe identiques dans les deux comptes",
    "C) En partageant par SMS le code d'authentification multifacteur (MFA)",
    "D) En désactivant le chiffrement sur le compte B"
  ],
  "A",
  "l'accès inter-comptes (Cross-Account Access) repose sur l'appel STS AssumeRole : le compte B définit un rôle avec une politique d'approbation (Trust Policy) désignant le compte A; l'utilisateur reçoit des identifiants temporaires limités",
  "dupliquer des identités manuelles complique la gouvernance et viole les pratiques de fédération",
  "partager des codes MFA compromet l'intégrité de l'authentification et ne résout pas la délégation technique de rôles",
  "désactiver le chiffrement détruit la sécurité sans accorder aucun droit inter-comptes",
  "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_aws-accounts.html"
));

questions.push(makeQ(
  qNum++, 'iam',
  "Quelle politique de confiance (Trust Policy) est obligatoirement attachée à un rôle IAM pour définir quelle entité ou service est habilité à endosser ce rôle ?",
  [
    "A) La politique d'approbation de rôle (AssumeRole Policy Document)",
    "B) La politique de session utilisateur",
    "C) La politique de mot de passe du compte",
    "D) La liste des balises de facturation"
  ],
  "A",
  "un rôle IAM est obligatoirement associé à une politique d'approbation (Trust Policy) qui spécifie formellement le Principal autorisé à invoquer l'action sts:AssumeRole pour revêtir ce rôle",
  "les politiques de session restreignent les permissions d'une session temporaire déjà créée",
  "la politique de mot de passe dicte la complexité des mots de passe des utilisateurs humains",
  "les balises de facturation n'ont aucune fonction d'authentification ou d'approbation cryptographique",
  "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html"
));

// ==========================================
// KMS & CHIFFREMENT (8 questions: 269-276)
// ==========================================

questions.push(makeQ(
  qNum++, 'kms-chiffrement',
  "Dans Amazon S3, quelle fonctionnalité permet de réduire le volume d'appels d'API vers AWS Key Management Service (KMS) jusqu'à 99 % lors de l'écriture ou de la lecture massive de millions de fichiers chiffrés par une clé KMS gérée par le client (SSE-KMS) ?",
  [
    "A) Les clés de compartiment Amazon S3 (Amazon S3 Bucket Keys)",
    "B) Le chiffrement matériel BitLocker sur S3",
    "C) La compression Zip avant chiffrement",
    "D) L'abandon du chiffrement au profit du texte clair"
  ],
  "A",
  "les S3 Bucket Keys créent une clé au niveau du compartiment dérivée d'AWS KMS; S3 l'utilise pour négocier des clés intermédiaires locales, diminuant le nombre d'appels réseau à l'API KMS de 99 % et réduisant drastiquement la facture KMS",
  "BitLocker est un outil de chiffrement local Microsoft et ne s'applique pas au service cloud Amazon S3",
  "la compression Zip ne modifie pas le nombre de transactions cryptographiques par objet S3",
  "abandonner le chiffrement viole les exigences réglementaires et de sécurité d'un Data Lake d'entreprise",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html"
));

questions.push(makeQ(
  qNum++, 'kms-chiffrement',
  "Quelle instruction de politique de compartiment S3 permet d'imposer strictement le chiffrement en transit en refusant systématiquement toutes les requêtes qui n'utilisent pas le protocole HTTPS sécurisé ?",
  [
    "A) Une clause 'Effect': 'Deny' avec la condition 'Bool': {'aws:SecureTransport': 'false'}",
    "B) Une clause 'Effect': 'Allow' sur l'action 's3:PutObject' sans condition",
    "C) Une clause 'Effect': 'Deny' avec 'aws:SecureTransport': 'true'",
    "D) La désactivation des protocoles TCP sur le routeur"
  ],
  "A",
  "la clé de condition globale 'aws:SecureTransport' vaut true lorsque la requête transite par HTTPS (TLS); appliquer un 'Deny' explicite lorsque 'aws:SecureTransport' est false rejette immédiatement toute communication HTTP non sécurisée",
  "un Allow sans condition autoriserait les transferts en texte clair via HTTP non chiffré",
  "refuser quand SecureTransport est true bloquerait précisément le trafic légitime HTTPS et n'autoriserait que le trafic dangereux HTTP",
  "désactiver TCP couperait toutes les communications réseau de la machine",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html#enforce-encryption-in-transit"
));

questions.push(makeQ(
  qNum++, 'kms-chiffrement',
  "Quelle différence distingue une clé gérée par AWS (AWS Managed Key) d'une clé gérée par le client (Customer Managed Key - CMK) dans AWS KMS ?",
  [
    "A) Une clé gérée par le client permet à l'administrateur de définir la politique de clé, d'activer la rotation annuelle automatique ou sur demande, et de gérer sa suppression programmée, tandis qu'une clé gérée par AWS est administrée directement par AWS",
    "B) Les clés gérées par le client sont gratuites alors que les clés AWS sont payantes",
    "C) Une clé gérée par AWS ne chiffre jamais les données réelles",
    "D) Une clé gérée par le client ne supporte aucun chiffrement symétrique AES-256"
  ],
  "A",
  "les Customer Managed Keys (CMK) offrent un contrôle total (politique de clé, activation/désactivation, rotation, calendrier de destruction de 7 à 30 jours, alias); les AWS Managed Keys sont créées par les services AWS (ex: aws/s3) et leur politique ne peut pas être altérée",
  "les Customer Managed Keys coûtent 1 $ par mois par clé, alors que les clés AWS Managed Keys sont sans frais mensuels de stockage de clé",
  "les clés gérées par AWS chiffrent parfaitement les données au repos avec AES-256",
  "les CMK supportent nativement le chiffrement symétrique standard de pointe AES-256 GCM",
  "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-mgmt"
));

questions.push(makeQ(
  qNum++, 'kms-chiffrement',
  "Quelle technique de cryptographie à enveloppe (Envelope Encryption) est mise en œuvre par AWS KMS pour chiffrer efficacement des jeux de données volumineux sans surcharger le matériel de sécurité KMS ?",
  [
    "A) Les données sont chiffrées localement par une clé de données (Data Encryption Key - DEK), et cette clé de données est elle-même chiffrée par la clé racine KMS (KMS Key)",
    "B) L'intégralité du fichier de données de 50 Go est envoyée directement aux modules HSM physiques de KMS pour calcul",
    "C) Les données sont chiffrées en utilisant uniquement des fonctions de hachage SHA-1",
    "D) Les données sont envoyées par courrier postal dans une enveloppe physique scellée"
  ],
  "A",
  "le chiffrement d'enveloppe génère une clé de données (DEK) en local via l'API GenerateDataKey; la DEK chiffre le fichier en mémoire vive à pleine vitesse, puis seule la clé de données chiffrée est stockée aux côtés du fichier, épargnant l'envoi de gros fichiers sur le réseau KMS",
  "l'API KMS GenerateDataKey ou Encrypt impose une limite de 4 Ko de charge utile directe et ne peut pas recevoir des fichiers de 50 Go",
  "SHA-1 est une fonction de hachage unidirectionnelle obsolète et non un chiffrement réversible",
  "le terme enveloppe est une métaphore logicielle et non un courrier papier",
  "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#enveloping"
));

questions.push(makeQ(
  qNum++, 'kms-chiffrement',
  "Lorsque la rotation automatique des clés (Automatic Key Rotation) est activée pour une clé gérée par le client (CMK) dans AWS KMS, qu'advient-il des données historiques chiffrées avec les anciennes versions de la clé matérielle ?",
  [
    "A) AWS KMS conserve l'historique des anciennes versions de la clé de manière transparente pour continuer à déchiffrer les données existantes sans nécessiter de réécriture de fichiers",
    "B) Toutes les données historiques deviennent définitivement illisibles et perdues",
    "C) L'ensemble des données du Data Lake est immédiatement et obligatoirement réécrit sur S3",
    "D) L'administrateur doit retaper la clé manuellement sur chaque serveur"
  ],
  "A",
  "KMS conserve automatiquement les anciennes versions cryptographiques de la clé; lors d'une opération de déchiffrement, KMS identifie le matériel de clé ayant servi au chiffrement d'origine et déchiffre sans nécessiter de réécrire les données",
  "les données historiques restent parfaitement accessibles et déchiffrables",
  "aucune opération de réécriture (re-encrypt) massive immédiate n'est requise",
  "KMS est un service matériel managé où les clés privées ne sont jamais manipulées en clair par l'administrateur",
  "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html"
));

questions.push(makeQ(
  qNum++, 'kms-chiffrement',
  "Quel mode de chiffrement S3 implique que le client gère et fournisse lui-même sa propre clé de chiffrement dans les en-têtes HTTP de chaque requête, sans qu'AWS ne stocke jamais la clé dans KMS ?",
  [
    "A) SSE-C (Server-Side Encryption with Customer-Provided Keys)",
    "B) SSE-S3",
    "C) SSE-KMS",
    "D) AWS CloudHSM dédié"
  ],
  "A",
  "avec SSE-C, le client transmet la clé de chiffrement dans les en-têtes HTTP de chaque appel GET/PUT; S3 applique le chiffrement/déchiffrement en mémoire et purge immédiatement la clé sans la conserver sur ses disques",
  "SSE-S3 utilise des clés entièrement gérées par Amazon S3",
  "SSE-KMS délègue le stockage et la gestion du cycle de vie de la clé au service AWS KMS",
  "CloudHSM fournit une appliance matérielle dédiée dans le VPC du client",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html"
));

questions.push(makeQ(
  qNum++, 'kms-chiffrement',
  "Pour supprimer définitivement une clé gérée par le client (CMK) dans AWS KMS, quel délai de sécurité minimal (période d'attente) est obligatoirement imposé pour éviter toute destruction irréversible accidentelle ?",
  [
    "A) Une période d'attente minimale de 7 jours (jusqu'à un maximum de 30 jours)",
    "B) La suppression est instantanée en 1 milliseconde",
    "C) Une période d'attente obligatoire de 10 ans",
    "D) Aucune clé ne peut jamais être supprimée dans AWS"
  ],
  "A",
  "AWS KMS impose une période d'attente obligatoire comprise entre 7 et 30 jours (ScheduleKeyDeletion) durant laquelle la clé passe à l'état Pending Deletion et ne peut plus chiffrer, laissant le temps à l'administrateur d'annuler l'opération en cas d'erreur",
  "la suppression instantanée n'est pas autorisée dans KMS afin de prévenir les catastrophes d'exploitation",
  "une période de 10 ans est disproportionnée par rapport aux cycles d'exploitation cloud",
  "les clés peuvent être supprimées dès lors que la procédure programmée arrive à échéance",
  "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html"
));

questions.push(makeQ(
  qNum++, 'kms-chiffrement',
  "Dans AWS KMS, quel paramètre optionnel passé lors du chiffrement lie cryptographiquement les données à un contexte métier (par exemple {'department': 'finance'}) pour se prémunir contre les attaques par rejeu dans un autre contexte ?",
  [
    "A) Le contexte de chiffrement (Encryption Context)",
    "B) Le hachage salé SHA-512",
    "C) L'adresse IP publique du sous-réseau",
    "D) L'identifiant de la carte mère du serveur"
  ],
  "A",
  "le contexte de chiffrement (Encryption Context) est un ensemble de paires clé-valeur de métadonnées additionnelles non secrètes qui est lié de manière cryptographique au texte chiffré; le même contexte exact doit être fourni lors du déchiffrement, sinon l'opération échoue",
  "le hachage salé est une méthode de protection de mots de passe et non un paramètre d'API KMS",
  "l'adresse IP n'est pas intégrée comme contexte cryptographique dans KMS",
  "les serveurs virtualisés cloud n'exposent pas d'identifiant de carte mère matérielle",
  "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#encrypt_context"
));

// ==========================================
// VPC & PRIVATELINK (8 questions: 277-284)
// ==========================================

questions.push(makeQ(
  qNum++, 'vpc-privatelink',
  "Quelle différence essentielle distingue un point de terminaison de passerelle (Gateway Endpoint) d'un point de terminaison d'interface (Interface Endpoint / AWS PrivateLink) pour accéder à Amazon S3 depuis un VPC privé ?",
  [
    "A) Le Gateway Endpoint est gratuit, sans interface réseau physique (ENI), et s'appuie sur une cible de table de routage VPC, tandis que l'Interface Endpoint déploie une ENI avec une adresse IP privée et facture des frais horaires et de transfert de données",
    "B) Le Gateway Endpoint est payant à 50 dollars de l'heure",
    "C) L'Interface Endpoint ne fonctionne que sur le protocole FTP",
    "D) Le Gateway Endpoint ne supporte que la base de données DynamoDB et aucun autre service"
  ],
  "A",
  "les Gateway Endpoints sont gratuits et routent le trafic vers S3 ou DynamoDB via les tables de routage des sous-réseaux sans passer par Internet; les Interface Endpoints (PrivateLink) créent des cartes réseau ENI privées dans les sous-réseaux et facturent le temps d'usage et les gigaoctets traités",
  "les Gateway Endpoints sont entièrement gratuits sans coût horaire",
  "Interface Endpoint prend en charge le trafic TCP sécurisé TLS/HTTPS standard",
  "Gateway Endpoint supporte Amazon S3 ET Amazon DynamoDB",
  "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"
));

questions.push(makeQ(
  qNum++, 'vpc-privatelink',
  "Une exigence de conformité de sécurité bancaire interdit formellement à un cluster Amazon Redshift hébergé dans un sous-réseau privé d'avoir une passerelle Internet (IGW) ou une passerelle NAT pour joindre Amazon S3. Quelle solution réseau répond à cette contrainte tout en conservant des coûts nuls ?",
  [
    "A) Créer un VPC Gateway Endpoint pour Amazon S3 et l'associer à la table de routage du sous-réseau privé",
    "B) Configurer une passerelle NAT managée avec IP élastique",
    "C) Déployer un serveur proxy inverse NGINX public",
    "D) Rendre le cluster Redshift public"
  ],
  "A",
  "le Gateway Endpoint pour S3 permet aux instances situées dans des sous-réseaux privés d'échanger directement avec S3 via le réseau fédérateur d'AWS de manière totalement privée et gratuite, sans passerelle Internet ni NAT",
  "la passerelle NAT achemine le trafic vers Internet et entraîne des coûts horaires et de traitement de données",
  "un proxy inverse public enfreint l'interdiction d'exposition à Internet",
  "rendre Redshift public expose la base de données de production sur l'Internet public",
  "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"
));

questions.push(makeQ(
  qNum++, 'vpc-privatelink',
  "Dans l'architecture réseau d'Amazon VPC, quelle est la principale différence de comportement de filtrage entre un groupe de sécurité (Security Group) et une liste de contrôle d'accès réseau (Network ACL) ?",
  [
    "A) Les groupes de sécurité sont avec état (stateful) et s'appliquent au niveau de l'interface réseau (ENI), tandis que les NACL sont sans état (stateless) et filtrent au niveau de la frontière du sous-réseau avec des règles numérotées",
    "B) Les groupes de sécurité s'appliquent uniquement aux sous-réseaux entiers",
    "C) Les NACL sont avec état et autorisent automatiquement le trafic retour",
    "D) Les groupes de sécurité prennent en charge des règles de refus (Deny) explicites"
  ],
  "A",
  "les Security Groups sont stateful (si une requête entrante est autorisée, la réponse sortante est automatiquement permise) et ne gèrent que des règles Allow; les NACL sont stateless (il faut ouvrir explicitement le trafic retour sur les ports éphémères) et supportent des règles Allow et Deny ordonnées",
  "les Security Groups sont attachés aux interfaces réseau (ENI) individuelles et non aux sous-réseaux",
  "les NACL sont rigoureusement sans état (stateless)",
  "les Security Groups ne permettent pas de formuler des règles de refus (Deny) explicites",
  "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html"
));

questions.push(makeQ(
  qNum++, 'vpc-privatelink',
  "Quelle technologie permet de connecter de façon privée un VPC client à un service de données hébergé par un tiers ou dans un autre compte AWS sans exposer les réseaux au risque de chevauchement de plages d'adresses IP privées (IP overlap) ?",
  [
    "A) AWS PrivateLink (VPC Endpoint Service)",
    "B) Le Peering VPC (VPC Peering)",
    "C) Le tunneling GRE non chiffré",
    "D) L'interconnexion par câble Ethernet physique direct"
  ],
  "A",
  "AWS PrivateLink établit une connexion point-à-point unidirectionnelle via un Network Load Balancer (NLB) et des ENI sans appairer l'ensemble du réseau, éliminant totalement les contraintes de conflits d'adresses CIDR / IP qui bloquent le VPC Peering",
  "le VPC Peering interdit strictement tout chevauchement de blocs CIDR entre les deux réseaux",
  "les tunnels GRE ne résolvent pas la gestion des services managés multi-comptes AWS",
  "les câbles physiques ne peuvent pas être tirés entre les infrastructures virtuelles cloud",
  "https://docs.aws.amazon.com/vpc/latest/privatelink/endpoint-service.html"
));

questions.push(makeQ(
  qNum++, 'vpc-privatelink',
  "Quelle politique de point de terminaison VPC (VPC Endpoint Policy) permet d'empêcher les employés d'utiliser les ressources réseau de l'entreprise pour exfiltrer des données vers des compartiments S3 personnels non autorisés ?",
  [
    "A) Attacher une Endpoint Policy au point de terminaison S3 restreignant l'accès aux seuls compartiments S3 appartenant à l'organisation de l'entreprise",
    "B) Bloquer tous les ports TCP du routeur",
    "C) Désactiver le service DNS AmazonRoute53",
    "D) Supprimer l'ensemble des politiques IAM des utilisateurs"
  ],
  "A",
  "une Endpoint Policy est une politique de ressource JSON attachée directement au point de terminaison VPC; elle permet de stipuler que seules les requêtes ciblant les ARN de compartiments S3 approuvés de l'entreprise sont autorisées à transiter par la passerelle",
  "bloquer tous les ports TCP couperait tout le fonctionnement du réseau de l'entreprise",
  "désactiver le DNS empêcherait la résolution des noms de domaines légitimes",
  "supprimer les politiques IAM empêcherait les collaborateurs de travailler sur les projets légitimes",
  "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html"
));

questions.push(makeQ(
  qNum++, 'vpc-privatelink',
  "Pour capturer les adresses IP sources, les adresses de destination et les décisions d'acceptation ou de rejet du trafic réseau circulant sur les interfaces d'un cluster EMR, quel outil AWS activez-vous au niveau du VPC ?",
  [
    "A) Amazon VPC Flow Logs",
    "B) AWS CloudTrail Data Events",
    "C) Amazon QuickSight Q",
    "D) AWS Systems Manager Inventory"
  ],
  "A",
  "VPC Flow Logs enregistre les métadonnées de trafic réseau IP (adresses source/dest, ports, protocoles, paquets, octets, statut ACCEPT ou REJECT) au niveau du VPC, du sous-réseau ou de l'interface réseau ENI",
  "CloudTrail trace les appels d'API de gestion et de données et n'a aucune visibilité sur les paquets réseau IP de bas niveau",
  "QuickSight Q est un outil de questions-réponses en langage naturel pour tableaux de bord décisionnels",
  "SSM Inventory collecte la liste des logiciels installés sur les systèmes d'exploitation",
  "https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html"
));

questions.push(makeQ(
  qNum++, 'vpc-privatelink',
  "Dans un sous-réseau privé sans accès à Internet, comment des instances de traitement peuvent-elles résoudre les noms DNS publics des services AWS tels que 's3.eu-west-3.amazonaws.com' ?",
  [
    "A) En utilisant le serveur DNS Amazon Route 53 Resolver (AmazonProvidedDNS) situé à l'adresse de base du réseau VPC plus deux (+2)",
    "B) En modifiant manuellement le fichier /etc/hosts à chaque seconde",
    "C) En contactant un serveur DNS public 8.8.8.8 via un modem téléphonique",
    "D) Les noms DNS ne peuvent pas être résolus dans un sous-réseau privé"
  ],
  "A",
  "le résolveur DNS géré d'AWS (AmazonProvidedDNS) réside sur l'adresse IP réservée du bloc CIDR du VPC (ex: 10.0.0.2 pour un VPC 10.0.0.0/16) et résout en interne les domaines AWS sans nécessiter d'accès à Internet",
  "la mise à jour manuelle permanente du fichier hosts est irréalisable et ingérable",
  "contacter un serveur DNS public nécessite un accès Internet, absent par définition d'un sous-réseau privé",
  "la résolution DNS privée est parfaitement supportée et active par défaut dans tous les VPC",
  "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html"
));

questions.push(makeQ(
  qNum++, 'vpc-privatelink',
  "Quel composant de passerelle réseau permet de connecter de façon centralisée des dizaines de VPC d'entreprise et des réseaux sur site (via VPN ou Direct Connect) selon une topologie en étoile (Hub and Spoke) hautement scalable ?",
  [
    "A) AWS Transit Gateway",
    "B) Un maillage de VPC Peering complet (Full Mesh)",
    "C) Une instance EC2 t2.micro avec routage iptables",
    "D) Un bucket S3 partagé"
  ],
  "A",
  "AWS Transit Gateway agit comme un routeur cloud régional centralisé qui interconnecte des milliers de VPC et des liaisons sur site avec un contrôle fin des tables de routage, éliminant la complexité ingérable d'un maillage point-à-point complet",
  "un maillage complet de VPC Peering exige N*(N-1)/2 connexions, devenant rapidement ingérable au-delà de quelques dizaines de réseaux",
  "une instance t2.micro créerait un goulot d'étranglement de performance critique et un point unique de défaillance",
  "un bucket S3 est un stockage de fichiers et ne route aucun trafic réseau IP",
  "https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html"
));

// ==========================================
// MACIE, SECRETS & GOUVERNANCE AVANCÉE (10 questions: 285-294)
// ==========================================

questions.push(makeQ(
  qNum++, 'macie-secrets-waf',
  "Quel service de sécurité AWS exploite le Machine Learning et la recherche par motifs pour analyser automatiquement les objets stockés dans Amazon S3 afin de détecter les données personnelles sensibles (PII), les numéros de cartes de crédit et les secrets d'authentification exposés ?",
  [
    "A) Amazon Macie",
    "B) Amazon GuardDuty",
    "C) AWS Shield",
    "D) Amazon Inspector"
  ],
  "A",
  "Amazon Macie est un service de sécurité de données entièrement géré qui utilise le Machine Learning et la correspondance de modèles pour découvrir, classifier et protéger les données sensibles stockées dans Amazon S3",
  "GuardDuty surveille les flux réseau et les journaux pour détecter les menaces et comportements suspects au niveau du compte",
  "AWS Shield protège les applications web contre les attaques par déni de service distribué (DDoS)",
  "Amazon Inspector analyse les vulnérabilités de packages logiciels sur EC2 et les conteneurs ECR",
  "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"
));

questions.push(makeQ(
  qNum++, 'macie-secrets-waf',
  "Lors de l'utilisation d'AWS Secrets Manager pour sécuriser les identifiants d'une base de données Amazon Redshift, comment le service assure-t-il la rotation automatique des mots de passe sans interruption applicative ?",
  [
    "A) Secrets Manager invoque une fonction AWS Lambda qui met à jour le mot de passe dans la base Redshift et met à jour la valeur du secret dans Secrets Manager selon une stratégie à deux phases",
    "B) Secrets Manager demande à l'administrateur de saisir un nouveau mot de passe chaque matin",
    "C) Secrets Manager redémarre physiquement les serveurs de la base de données",
    "D) Secrets Manager supprime la base de données pour en recréer une nouvelle"
  ],
  "A",
  "Secrets Manager utilise des modèles de fonctions Lambda de rotation préconçus qui exécutent une rotation en 4 étapes (createSecret, setSecret, testSecret, finishSecret) garantissant que les identifiants sont validés avant d'être promus version active",
  "la rotation automatique élimine précisément toute intervention humaine manuelle quotidienne",
  "la rotation ne nécessite aucun redémarrage physique des nœuds du cluster",
  "supprimer la base détruirait l'ensemble des données d'entreprise",
  "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_how.html"
));

questions.push(makeQ(
  qNum++, 'macie-secrets-waf',
  "Quel pare-feu applicatif web permet de protéger une API d'ingestion de données hébergée derrière Amazon API Gateway ou un Application Load Balancer contre les injections SQL (SQLi) et les attaques Cross-Site Scripting (XSS) ?",
  [
    "A) AWS WAF (Web Application Firewall)",
    "B) Un groupe de sécurité VPC",
    "C) Une liste de contrôle d'accès réseau (NACL)",
    "D) Le pare-feu local Windows Defender"
  ],
  "A",
  "AWS WAF inspecte les en-têtes et corps de requêtes HTTP/HTTPS entrantes sur les couches applicatives (Couche 7) pour bloquer les attaques courantes comme l'injection SQL, le cross-site scripting ou le flood de requêtes avec des règles managées",
  "les groupes de sécurité opèrent sur les couches 3 et 4 (IP/port) et sont incapables de lire ou d'intercepter des requêtes HTTP d'injections SQL",
  "les NACL filtrent uniquement les paquets IP et ignorent la charge utile applicative HTTP",
  "Windows Defender s'exécute sur le poste de travail individuel et ne protège pas une passerelle d'API cloud",
  "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html"
));

questions.push(makeQ(
  qNum++, 'moindre-privilege-masquage',
  "Dans un pipeline de données traitant des informations de cartes de paiement, quelle technique cryptographique consiste à remplacer le numéro de carte bancaire réel par un identifiant aléatoire de substitution non réversible mathématiquement sans accéder à une table de correspondance sécurisée isolée ?",
  [
    "A) La tokenisation (Tokenization)",
    "B) Le chiffrement réversible standard DES",
    "C) La compression GZIP",
    "D) L'encodage Base64"
  ],
  "A",
  "la tokenisation remplace les données sensibles par des jetons aléatoires dénués de signification intrinsèque; contrairement au chiffrement qui utilise une clé mathématique réversible, le jeton ne peut être résolu qu'en interrogeant un coffre-fort de tokens sécurisé (Token Vault)",
  "le chiffrement DES est obsolète, vulnérable et repose sur un calcul mathématique et non sur des jetons de substitution",
  "la compression GZIP réduit la taille du fichier sans masquer la lisibilité des données une fois décompressé",
  "l'encodage Base64 est un simple format de représentation textuelle immédiatement réversible sans aucune clé",
  "https://docs.aws.amazon.com/whitepapers/latest/pci-dss-compliance/tokenization.html"
));

questions.push(makeQ(
  qNum++, 'moindre-privilege-masquage',
  "Pourquoi est-il indispensable d'ajouter un sel cryptographique aléatoire unique (Cryptographic Salt) avant de hacher des mots de passe ou des identifiants sensibles avec un algorithme comme SHA-256 dans un pipeline de données ?",
  [
    "A) Pour empêcher les attaques par tables précalculées (Rainbow Tables) et garantir que deux utilisateurs ayant le même identifiant obtiennent des empreintes de hachage différentes",
    "B) Pour réduire la taille de la chaîne de sortie à 2 caractères",
    "C) Pour permettre aux utilisateurs de retrouver facilement leur mot de passe en cas d'oubli",
    "D) Pour accélérer le temps de calcul des fonctions de hachage sur GPU"
  ],
  "A",
  "le salage associe une chaîne aléatoire unique à la donnée brute avant le hachage; cela rend inefficaces les dictionnaires d'empreintes précalculées (Rainbow Tables) et garantit que deux valeurs identiques ne produiront pas le même hash visible",
  "le salage ne modifie pas la taille fixe de sortie standard du hash SHA-256 (qui reste de 256 bits / 64 caractères hexadécimaux)",
  "le hachage reste une fonction à sens unique non réversible par conception",
  "le sel n'a pas pour objectif d'accélérer les calculs des attaquants",
  "https://docs.aws.amazon.com/whitepapers/latest/secure-storage-of-passwords/salting.html"
));

questions.push(makeQ(
  qNum++, 'sagemaker-ml',
  "Quelle nouveauté majeure introduite dans le guide DEA-C01 v1.1 fournit un environnement d'ingénierie des données et d'analyse unifié pour gouverner, explorer et partager des ressources de données à travers des projets et des domaines avec SageMaker Catalog ?",
  [
    "A) Amazon SageMaker Unified Studio",
    "B) AWS Cloud9 for Data",
    "C) AWS CodeCommit Notebooks",
    "D) Amazon QuickSight Reader"
  ],
  "A",
  "Amazon SageMaker Unified Studio regroupe les outils de développement de données, d'analytique et de Machine Learning au sein d'une interface unifiée, permettant de collaborer au travers de projets et de gouverner les accès aux actifs de données via SageMaker Catalog",
  "AWS Cloud9 a été retiré du programme de l'examen DEA-C01 v1.1",
  "AWS CodeCommit a également été déprécié et retiré du périmètre de certification DEA-C01 v1.1",
  "QuickSight Reader est une licence de visualisation décisionnelle et non un environnement de développement unifié d'ingénierie",
  "https://docs.aws.amazon.com/sagemaker/latest/dg/unified-studio.html"
));

questions.push(makeQ(
  qNum++, 'sagemaker-ml',
  "Dans une architecture Machine Learning d'entreprise sur AWS, quel magasin de caractéristiques entièrement géré permet d'enregistrer, partager et servir des attributs de données (features) avec des latences de lecture inférieures à 10 millisecondes pour l'inférence temps réel ?",
  [
    "A) Amazon SageMaker Feature Store (Online Store)",
    "B) Amazon S3 Glacier Deep Archive",
    "C) AWS Storage Gateway Tape Gateway",
    "D) Amazon Athena Workgroups"
  ],
  "A",
  "SageMaker Feature Store propose un magasin en ligne (Online Store) à très faible latence pour servir les caractéristiques lors des prédictions temps réel, synchronisé avec un magasin hors ligne (Offline Store sur S3) pour l'entraînement de modèles par lots",
  "Glacier Deep Archive a des délais de restitution de plusieurs heures incompatibles avec l'inférence en temps réel",
  "Tape Gateway simule des bandes magnétiques physiques d'archivage",
  "Athena Workgroups gère les limites de requêtes SQL interactives et n'est pas un cache de features ML",
  "https://docs.aws.amazon.com/sagemaker/latest/dg/feature-store.html"
));

questions.push(makeQ(
  qNum++, 'sagemaker-ml',
  "Quelle fonctionnalité de gouvernance intégrée à SageMaker Unified Studio et SageMaker Catalog assure le suivi complet du lignage des données (ML Lineage Tracking), depuis les fichiers sources S3 jusqu'aux jeux de test et modèles déployés ?",
  [
    "A) Le suivi de lignage SageMaker ML (SageMaker ML Lineage Tracking)",
    "B) Le journal des modifications GitHub",
    "C) La table des partitions Hive",
    "D) L'annuaire Active Directory"
  ],
  "A",
  "SageMaker ML Lineage Tracking enregistre et relie visuellement les entités (données sources, artefacts de prétraitement, paramètres d'entraînement, modèles enregistrés) pour satisfaire aux exigences de conformité et de reproductibilité des modèles",
  "GitHub trace le code source applicatif mais ne stocke pas les métadonnées de lignage des jeux de données volumineux",
  "la table des partitions Hive organise les chemins de fichiers sans tracer le cycle de vie des modèles ML",
  "Active Directory est un service d'annuaire d'utilisateurs sans connaissance du cycle de vie des données d'entraînement",
  "https://docs.aws.amazon.com/sagemaker/latest/dg/lineage-tracking.html"
));

questions.push(makeQ(
  qNum++, 'sagemaker-ml',
  "Quel outil visuel sans code d'Amazon SageMaker permet aux ingénieurs de données de charger, nettoyer, transformer et profiler des jeux de données tabulaires volumineux avec plus de 300 transformations intégrées ?",
  [
    "A) Amazon SageMaker Data Wrangler",
    "B) Amazon Redshift Query Editor v2",
    "C) AWS CodeBuild",
    "D) Amazon Textract"
  ],
  "A",
  "SageMaker Data Wrangler est conçu spécifiquement pour accélérer la préparation des données pour l'apprentissage automatique, offrant un canevas visuel interactif pour profiler, transformer et exporter du code de préparation vers des pipelines de production",
  "Redshift Query Editor v2 est une interface web pour exécuter des requêtes SQL sur des entrepôts Redshift",
  "CodeBuild compile et teste du code applicatif dans des conteneurs éphémères",
  "Textract extrait du texte et des tableaux depuis des documents scannés ou images PDF",
  "https://docs.aws.amazon.com/sagemaker/latest/dg/data-wrangler.html"
));

questions.push(makeQ(
  qNum++, 'moindre-privilege-masquage',
  "Dans un pipeline de traitement de données de santé soumis au RGPD et à la réglementation HIPAA, quelle est la différence essentielle entre l'anonymisation et la pseudonymisation des données de patients ?",
  [
    "A) L'anonymisation détruit définitivement et irréversiblement tout lien permettant de ré-identifier la personne, tandis que la pseudonymisation remplace les identifiants directs par des pseudonymes pouvant être ré-associés à l'aide d'informations supplémentaires conservées séparément",
    "B) L'anonymisation est temporaire alors que la pseudonymisation est définitive",
    "C) La pseudonymisation consiste à supprimer l'ensemble de la base de données",
    "D) Il n'y a aucune différence technique entre ces deux termes"
  ],
  "A",
  "l'anonymisation élimine de façon irréversible la possibilité d'identifier un individu (les données anonymisées sortent du champ du RGPD); la pseudonymisation sépare les données d'identité des attributs de santé, conservant la capacité de ré-identification via une clé de correspondance sécurisée",
  "l'anonymisation est par nature permanente et irréversible, non temporaire",
  "la pseudonymisation préserve l'utilité analytique des données sans supprimer la base",
  "la distinction juridique et technique entre anonymisation et pseudonymisation est capitale dans la gouvernance des données",
  "https://docs.aws.amazon.com/whitepapers/latest/navigating-gdpr-compliance/anonymization-and-pseudonymization.html"
));

// ==========================================
// MODÈLE DE RESPONSABILITÉ PARTAGÉE (4 questions: 295-300: 6 questions to hit 54)
// ==========================================

questions.push(makeQ(
  qNum++, 'modele-responsabilite-partagee',
  "Selon le modèle de responsabilité partagée d'AWS (Shared Responsibility Model), quelle responsabilité incombe entièrement au client lors de l'utilisation d'une instance Amazon EC2 pour exécuter un cluster Spark ?",
  [
    "A) L'application des correctifs de sécurité du système d'exploitation invité, la gestion du pare-feu applicatif et le chiffrement des données au repos et en transit",
    "B) La maintenance physique des serveurs et des baies de stockage dans les centres de données",
    "C) Le remplacement des disques durs défectueux dans les locaux d'AWS",
    "D) La mise à jour du microprogramme (firmware) de l'hyperviseur physique AWS Nitro"
  ],
  "A",
  "dans un modèle IaaS (comme EC2), le client est responsable de la sécurité DANS le cloud (Security IN the Cloud), incluant les correctifs de l'OS invité, la configuration du pare-feu hôte, les comptes utilisateurs et le chiffrement des données applicatives",
  "la maintenance des locaux et baies physiques relève exclusivement de la responsabilité d'AWS (Security OF the Cloud)",
  "le remplacement du matériel défaillant est assuré de façon transparente par le personnel d'AWS",
  "la maintenance et les correctifs de l'hyperviseur Nitro incombent totalement à AWS",
  "https://aws.amazon.com/compliance/shared-responsibility-model/"
));

questions.push(makeQ(
  qNum++, 'modele-responsabilite-partagee',
  "Dans le cadre de l'utilisation d'un service de traitement de données sans serveur entièrement géré comme AWS Glue ETL, quelle responsabilité est prise en charge par AWS ?",
  [
    "A) La gestion de l'infrastructure sous-jacente, le provisionnement des serveurs, l'application des correctifs sur le système d'exploitation et la maintenance du runtime Spark",
    "B) La rédaction et la correction des scripts de transformation métier de l'entreprise",
    "C) La classification de la sensibilité des données stockées dans S3",
    "D) La décision des droits d'accès des employés au catalogue de métadonnées"
  ],
  "A",
  "pour les services gérés (serverless comme Glue), AWS assume la responsabilité de la gestion de l'infrastructure physique, de l'environnement d'exécution, de l'isolation multi-tenant et des correctifs du système et du moteur Spark",
  "le client conserve l'entière responsabilité de son code métier, de ses algorithmes et de ses scripts de données",
  "la classification de la sensibilité des données relève toujours de la gouvernance du client",
  "le paramétrage des politiques IAM et des autorisations d'accès aux données reste sous la responsabilité du client",
  "https://aws.amazon.com/compliance/shared-responsibility-model/"
));

questions.push(makeQ(
  qNum++, 'modele-responsabilite-partagee',
  "Lors de l'utilisation d'Amazon S3 pour stocker un lac de données, quelle tâche incombe formellement au client d'après le modèle de responsabilité partagée ?",
  [
    "A) La configuration des politiques de compartiment, la gestion du chiffrement côté client ou serveur et l'activation du blocage des accès publics (S3 Block Public Access)",
    "B) La réparation des unités d'alimentation électrique des centres de données d'AWS",
    "C) La réplication matérielle des disques durs sous-jacents sur plusieurs zones de disponibilité",
    "D) La protection physique des bâtiments contre les intrusions extérieures"
  ],
  "A",
  "le client est pleinement responsable de la sécurité de ses données dans S3 : configuration des politiques d'accès (Bucket Policies, IAM), gestion des clés de chiffrement et activation des sécurités anti-exposition publique",
  "l'alimentation électrique des datacenters relève de la responsabilité d'AWS",
  "la durabilité physique de 99,999999999 % (11 9's) et la redondance des blocs sous-jacents sont gérées par AWS",
  "la sécurité physique des installations (gardes, biométrie, caméras) est assurée par AWS",
  "https://aws.amazon.com/compliance/shared-responsibility-model/"
));

questions.push(makeQ(
  qNum++, 'modele-responsabilite-partagee',
  "Dans le modèle de responsabilité partagée appliqué à Amazon Redshift (service managé de base de données), quelle responsabilité reste à la charge du client ?",
  [
    "A) La création des utilisateurs de la base, l'attribution des droits SQL (GRANT/REVOKE), la conception des clés de tri et de distribution, et la gestion des sauvegardes manuelles",
    "B) Le remplacement des ventilateurs et des barrettes de mémoire physique des serveurs",
    "C) La sécurité périmétrique des centres de données où sont installés les nœuds Redshift",
    "D) La maintenance du réseau de fibre optique sous-marin reliant les régions AWS"
  ],
  "A",
  "même sur un service managé comme Redshift, le client contrôle la gouvernance applicative interne : gestion des comptes et privilèges SQL, modélisation physique des tables, chiffrement des données et déclenchement de snapshots manuels",
  "le matériel serveur interne est maintenu par AWS",
  "la sécurité physique du centre de données relève d'AWS",
  "l'infrastructure mondiale de câbles et de fibres est entièrement gérée par AWS",
  "https://aws.amazon.com/compliance/shared-responsibility-model/"
));

questions.push(makeQ(
  qNum++, 'modele-responsabilite-partagee',
  "Quel document public ou portail en libre-service d'AWS permet aux entreprises et aux auditeurs de télécharger les rapports de conformité de sécurité d'AWS (tels que les certifications SOC 1/2/3, ISO 27001 et PCI-DSS) pour prouver la conformité des infrastructures ?",
  [
    "A) AWS Artifact",
    "B) AWS CodeArtifact",
    "C) Amazon Athena Query Editor",
    "D) AWS Systems Manager Parameter Store"
  ],
  "A",
  "AWS Artifact est le portail centralisé fournissant un accès à la demande aux rapports d'audit de sécurité et aux accords juridiques d'AWS (BAA, conformité SOC, ISO, etc.) indispensables aux audits d'entreprise",
  "CodeArtifact est un référentiel de packages logiciels de code (npm, PyPI) et non un portail de rapports d'audit",
  "Athena Query Editor permet d'exécuter du SQL sur S3",
  "SSM Parameter Store stocke des secrets et variables de configuration applicative",
  "https://aws.amazon.com/artifact/"
));

questions.push(makeQ(
  qNum++, 'modele-responsabilite-partagee',
  "Selon les préconisations du Well-Architected Framework et du modèle de sécurité AWS, pourquoi l'utilisation des identifiants de l'utilisateur racine (Account Root User) doit-elle être strictement bannie pour les opérations quotidiennes d'ingénierie des données ?",
  [
    "A) Parce que l'utilisateur root dispose de privilèges absolus et irrévocables qui ne peuvent être restreints par aucune politique IAM, ce qui crée un risque catastrophique en cas de compromission",
    "B) Parce que le compte root coûte 1 000 dollars à chaque connexion",
    "C) Parce que les requêtes exécutées par l'utilisateur root sont bridées à 1 ligne par minute",
    "D) Parce que l'utilisateur root ne peut pas utiliser la console web AWS"
  ],
  "A",
  "le compte root possède un contrôle total et sans restriction sur toutes les ressources du compte; AWS recommande de verrouiller le compte root avec une authentification MFA forte et d'utiliser exclusivement des identités IAM fédérées au quotidien",
  "les connexions au compte root ne font l'objet d'aucun surcoût tarifaire",
  "les requêtes ne subissent aucun bridage artificiel à une ligne par minute",
  "le compte root peut parfaitement utiliser la console web, c'est précisément pourquoi son accès régulier est proscrit",
  "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html"
));

console.log(`Generated ${questions.length} questions for Domain 4.`);

// Write dea_questions_d4.js
const outPath = path.join(process.cwd(), 'scripts', 'dea_questions_d4.js');
const fileContent = `// Banque de questions officielles et originales pour DEA-C01 Domaine 4 (54 questions)
// Générée et validée le 2026-10-31
export const deaQuestionsD4 = ${JSON.stringify(questions, null, 2)};
`;
fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`Saved to ${outPath}`);
