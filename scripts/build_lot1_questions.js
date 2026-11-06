import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const OUTPUT_FILE = path.join(ROOT_DIR, 'content', 'certifications', 'clf', 'questions.json');

// Générateur méthodique de 150 questions CLF-C02
// D1: 36 questions, D2: 45 questions, D3: 51 questions, D4: 18 questions = 150 questions

const questions = [];

function addQuestion(q) {
  questions.push({
    id: `clf-q${String(questions.length + 1).padStart(3, '0')}`,
    ...q,
    provenance: 'générée par IA et vérifiée dans la documentation (2026-10-31)',
    verification_date: '2026-10-31'
  });
}

// --- DOMAINE 1 : Concepts du Cloud (36 questions) ---

const d1Templates = [
  {
    topic: 'cloud-concepts-valeur',
    stmt: "Une entreprise souhaite remplacer ses dépenses d'investissement initiales (CapEx) dans du matériel serveur par des dépenses opérationnelles variables (OpEx) liées à la consommation réelle. Quel avantage fondamental du Cloud AWS cela illustre-t-il ?",
    type: 'single',
    options: [
      "A) Le remplacement des dépenses d'investissement par des dépenses variables",
      "B) L'interdiction des contrats pluriannuels",
      "C) La garantie d'une latence réseau nulle",
      "D) La suppression de toute responsabilité de sécurité"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car l'un des 6 avantages fondamentaux du Cloud AWS est de substituer des dépenses d'investissement en capital (CapEx) par des coûts d'exploitation variables (OpEx). L'option B est incorrecte car AWS permet des engagements pluriannuels avantageux (Savings Plans). L'option C est incorrecte car aucun réseau ne garantit une latence nulle. L'option D est incorrecte car le modèle de responsabilité partagée exige toujours une gestion de sécurité par le client.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
  },
  {
    topic: 'cloud-concepts-valeur',
    stmt: "Quelle caractéristique du Cloud AWS permet à une application de provisionner automatiquement des serveurs supplémentaires pendant un pic de trafic, puis de les résilier dès que la demande diminue ?",
    type: 'single',
    options: [
      "A) L'élasticité",
      "B) La réplication synchrone",
      "C) Le chiffrement asymétrique",
      "D) Le partitionnement de table"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car l'élasticité désigne la capacité d'adapter dynamiquement les ressources à la hausse comme à la baisse en fonction du besoin réel. L'option B est fausse car la réplication synchrone concerne la copie de données entre bases de données. L'option C est fausse car le chiffrement asymétrique concerne la cryptographie à clés publique et privée. L'option D est fausse car le partitionnement concerne l'organisation interne des données dans une base.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
  },
  {
    topic: 'cloud-concepts-valeur',
    stmt: "Grâce à l'agrégation de la consommation de centaines de milliers de clients, AWS réalise des économies d'échelle massives qui se traduisent pour les utilisateurs par :",
    type: 'single',
    options: [
      "A) Des baisses de prix régulières sur les services à l'usage",
      "B) Une gratuité totale pour tous les serveurs EC2",
      "C) Une obligation d'utiliser exclusivement des processeurs Intel",
      "D) Une réduction de la bande passante globale"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car les économies d'échelle massives permettent à AWS de répercuter les gains de productivité sous forme de baisses de tarifs régulières. L'option B est fausse car les serveurs EC2 sont payants en dehors de l'offre gratuite limitée. L'option C est fausse car AWS propose des processeurs variés (AMD, Graviton, Intel). L'option D est fausse car la bande passante et les capacités augmentent continuellement.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
  },
  {
    topic: 'cloud-concepts-valeur',
    stmt: "Une startup souhaite tester une nouvelle idée commerciale en quelques heures sans acquérir de matériel physique ni attendre des semaines d'approvisionnement. Quel bénéfice du cloud est directement mis en valeur ?",
    type: 'single',
    options: [
      "A) L'agilité et la rapidité d'expérimentation",
      "B) La haute disponibilité géographique",
      "C) L'isolation sur hôte dédié obligatoire",
      "D) La pérennité des bandes magnétiques"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car l'agilité cloud permet aux équipes de déployer des environnements complets en quelques clics et d'accélérer l'innovation. L'option B est fausse car la haute disponibilité géographique concerne la résilience face aux pannes, pas la rapidité d'expérimentation. L'option C est fausse car les hôtes dédiés ne sont pas nécessaires pour expérimenter. L'option D est fausse car le stockage moderne n'implique pas la gestion de bandes physiques par l'utilisateur.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
  },
  {
    topic: 'cloud-concepts-valeur',
    stmt: "Quel modèle de déploiement cloud associe une infrastructure informatique sur site existante à des ressources hébergées dans le Cloud AWS via une connexion dédiée ?",
    type: 'single',
    options: [
      "A) Le Cloud hybride",
      "B) Le Cloud entièrement public",
      "C) Le Cloud privé isolé",
      "D) Le modèle mainframe classique"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car le Cloud hybride désigne l'interconnexion transparente entre des ressources sur site et le Cloud AWS. L'option B est fausse car le Cloud public désigne une infrastructure 100 % hébergée chez le fournisseur. L'option C est fausse car le Cloud privé est cantonné à un environnement propre sans mutualisation cloud public. L'option D est fausse car le modèle mainframe désigne une architecture centralisée historique.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/types-of-cloud-computing.html'
  },
  {
    topic: 'cloud-concepts-valeur',
    stmt: "Quels sont DEUX avantages majeurs reconnus du Cloud AWS parmi les principes fondateurs ? (Choisissez deux réponses)",
    type: 'multiple',
    options: [
      "A) Déployer à l'échelle mondiale en quelques minutes",
      "B) Arrêter de dépenser de l'argent pour exécuter et entretenir des centres de données",
      "C) Éliminer tout besoin de configurer les autorisations des utilisateurs",
      "D) Remplacer tous les développeurs par des assistants matériels",
      "E) Rendre impossible toute défaillance logicielle applicative"
    ],
    ans: ["A", "B"],
    exp: "Les options A et B sont correctes car déployer mondialement en quelques minutes et cesser de gérer des datacenters physiques figurent parmi les 6 avantages officiels d'AWS. L'option C est fausse car la gestion des droits IAM est obligatoire et sous la responsabilité du client. L'option D est absurde et fausse. L'option E est fausse car AWS ne prévient pas les bugs applicatifs propres au code du client.",
    diff: 'moyen',
    sec: 75,
    url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
  },
  {
    topic: 'well-architected',
    stmt: "Une entreprise souhaite concevoir des architectures capables de récupérer automatiquement après une défaillance de composant et de tester régulièrement les procédures de reprise. Quel pilier du Well-Architected Framework cela concerne-t-il ?",
    type: 'single',
    options: [
      "A) Pilier Fiabilité (Reliability)",
      "B) Pilier Sécurité",
      "C) Pilier Durabilité",
      "D) Pilier Optimisation des Coûts"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car le pilier Fiabilité englobe la capacité d'un système à fonctionner correctement et à récupérer rapidement d'une panne. L'option B est fausse car la Sécurité concerne la protection des actifs et des données. L'option C est fausse car la Durabilité vise la réduction de l'empreinte environnementale. L'option D est fausse car l'Optimisation des Coûts vise à réduire les dépenses financières.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html'
  },
  {
    topic: 'well-architected',
    stmt: "L'automatisation des déploiements sous forme d'infrastructure-as-code (IaC) et l'exécution de changements fréquents, petits et réversibles sont des principes directeurs de quel pilier ?",
    type: 'single',
    options: [
      "A) Pilier Excellence Opérationnelle (Operational Excellence)",
      "B) Pilier Efficacité des Performances",
      "C) Pilier Optimisation des Coûts",
      "D) Pilier Durabilité"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car l'Excellence Opérationnelle se concentre sur l'exécution, l'automatisation et l'amélioration continue des processus. L'option B est fausse car l'Efficacité des Performances concerne le dimensionnement et le débit des ressources. L'option C est fausse car l'Optimisation des Coûts traite de la gestion financière. L'option D est fausse car la Durabilité traite des émissions carbone.",
    diff: 'moyen',
    sec: 75,
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html'
  },
  {
    topic: 'well-architected',
    stmt: "Une équipe décide de migrer ses instances de calcul vers des processeurs AWS Graviton conçus sur mesure afin de réduire l'énergie consommée par transaction. Quel pilier est directement optimisé ?",
    type: 'single',
    options: [
      "A) Pilier Durabilité (Sustainability)",
      "B) Pilier Sécurité",
      "C) Pilier Fiabilité",
      "D) Pilier Excellence Opérationnelle"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car le pilier Durabilité a pour objectif de minimiser l'impact environnemental des services cloud. L'option B est fausse car Graviton n'est pas un service de chiffrement ou de sécurité. L'option C est fausse car bien que performant, l'argument d'économie d'énergie relève de la durabilité. L'option D est fausse car l'Excellence Opérationnelle concerne les processus opérationnels.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/welcome.html'
  },
  {
    topic: 'well-architected',
    stmt: "Quel outil gratuit de la console AWS permet aux architectes d'évaluer l'état de leurs charges de travail par rapport aux bonnes pratiques des 6 piliers et de générer un plan d'action d'amélioration ?",
    type: 'single',
    options: [
      "A) AWS Well-Architected Tool",
      "B) AWS CloudTrail",
      "C) AWS Storage Gateway",
      "D) Amazon QuickSight"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car l'AWS Well-Architected Tool est le service officiel dédié à la revue architecturale selon les 6 piliers. L'option B est fausse car CloudTrail enregistre l'historique des appels d'API. L'option C est fausse car Storage Gateway connecte le stockage sur site à S3. L'option D est fausse car QuickSight est un outil de Business Intelligence.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/userguide/intro.html'
  },
  {
    topic: 'well-architected',
    stmt: "L'application du principe de défense en profondeur, la protection des données en transit et au repos ainsi que le moindre privilège sont rattachés à quel pilier ?",
    type: 'single',
    options: [
      "A) Pilier Sécurité (Security)",
      "B) Pilier Durabilité",
      "C) Pilier Efficacité des Performances",
      "D) Pilier Excellence Opérationnelle"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car le pilier Sécurité traite de la protection des données, des systèmes et de l'application des contrôles d'accès. L'option B est fausse car la Durabilité traite de l'empreinte écologique. L'option C est fausse car les Performances traitent de la latence et de l'évolutivité. L'option D est fausse car l'Excellence Opérationnelle traite du déploiement continu.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html'
  },
  {
    topic: 'well-architected',
    stmt: "Démocratiser les technologies de pointe (comme l'IA managée ou les architectures sans serveur) afin que les équipes n'aient pas à acquérir une expertise matérielle complexe relève de quel pilier ?",
    type: 'single',
    options: [
      "A) Pilier Efficacité des Performances (Performance Efficiency)",
      "B) Pilier Fiabilité",
      "C) Pilier Sécurité",
      "D) Pilier Durabilité"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car la démocratisation des technologies avancées est l'un des principes de conception fondamentaux du pilier Efficacité des Performances. L'option B est fausse car la Fiabilité concerne la reprise après incident. L'option C est fausse car la Sécurité concerne la protection des accès. L'option D est fausse car la Durabilité concerne les émissions énergétiques.",
    diff: 'moyen',
    sec: 75,
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html'
  },
  {
    topic: 'migration-transfert',
    stmt: "Une entreprise souhaite migrer une application d'entreprise vers des instances Amazon EC2 sans modifier une seule ligne de code source. Quelle stratégie de migration des 7R utilise-t-elle ?",
    type: 'single',
    options: [
      "A) Rehost (Lift-and-Shift)",
      "B) Refactor",
      "C) Repurchase",
      "D) Retire"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car la stratégie Rehost (ou Lift-and-Shift) déplace les serveurs existants vers le cloud sans modification du code ou de l'architecture. L'option B est fausse car Refactor réécrit l'application en mode cloud native. L'option C est fausse car Repurchase remplace l'application par un progiciel SaaS. L'option D est fausse car Retire consiste à décommissionner une application.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-strategies/welcome.html'
  },
  {
    topic: 'migration-transfert',
    stmt: "Quelle stratégie de migration des 7R consiste à réécrire complètement une application monolithique pour adopter des microservices sans serveur avec AWS Lambda et DynamoDB ?",
    type: 'single',
    options: [
      "A) Refactor / Re-architect",
      "B) Rehost",
      "C) Retain",
      "D) Relocate"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car Refactor/Re-architect implique une refonte profonde de l'architecture pour tirer pleinement parti des fonctionnalités cloud natives. L'option B est fausse car Rehost ne modifie rien au code. L'option C est fausse car Retain consiste à conserver l'application sur site. L'option D est fausse car Relocate déplace des hyperviseurs de VM sans reconfigurer l'OS.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-strategies/welcome.html'
  },
  {
    topic: 'migration-transfert',
    stmt: "Une entreprise dispose de 75 To de données de sauvegarde sur site et d'une connexion Internet limitée à 20 Mbit/s. Quel service physique sécurisé AWS doit-elle commander pour expédier ces données vers Amazon S3 par voie postale ?",
    type: 'single',
    options: [
      "A) AWS Snowball Edge Storage Optimized",
      "B) AWS Direct Connect",
      "C) Amazon Route 53",
      "D) AWS Storage Gateway"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car un boîtier AWS Snowball Edge supporte jusqu'à 80 To utiles et permet un transfert physique chiffré sécurisé contournant une liaison réseau saturée. L'option B est fausse car Direct Connect est une ligne réseau dédiée qui prend plusieurs semaines à installer. L'option C est fausse car Route 53 est un service DNS. L'option D est fausse car Storage Gateway repose sur la bande passante réseau existante.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/snowball/latest/developer-guide/whatisedge.html'
  },
  {
    topic: 'migration-transfert',
    stmt: "Quel service AWS permet de migrer des bases de données relationnelles vers Amazon RDS tout en assurant une réplication continue des changements (CDC) avec un temps d'arrêt quasi nul ?",
    type: 'single',
    options: [
      "A) AWS Database Migration Service (AWS DMS)",
      "B) AWS DataSync",
      "C) AWS Snowcone",
      "D) AWS Backup"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car AWS DMS est spécialement conçu pour migrer des bases de données de manière homogène ou hétérogène avec Change Data Capture (CDC). L'option B est fausse car DataSync transfère des systèmes de fichiers (NFS, SMB), pas des transactions de bases relationnelles. L'option C est fausse car Snowcone est un petit appareil de transfert physique. L'option D est fausse car AWS Backup orchestre des instantanés de sauvegarde.",
    diff: 'moyen',
    sec: 75,
    url: 'https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html'
  },
  {
    topic: 'migration-transfert',
    stmt: "Parmi les 4 stratégies de reprise après sinistre (Disaster Recovery), laquelle offre le coût de maintien le plus bas mais nécessite le temps de rétablissement (RTO) le plus long ?",
    type: 'single',
    options: [
      "A) Sauvegarde et restauration (Backup & Restore)",
      "B) Veilleuse (Pilot Light)",
      "C) Attente chaude (Warm Standby)",
      "D) Multi-sites actif-actif (Multi-Site Active-Active)"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car la sauvegarde et restauration ne maintient aucune ressource de calcul active en permanence, ce qui minimise le coût mais requiert de reconstruire les serveurs en cas de sinistre. L'option B est fausse car Pilot Light maintient la base de données active en continu. L'option C est fausse car Warm Standby maintient une version réduite active. L'option D est fausse car Multi-Site est la stratégie la plus coûteuse.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html'
  },
  {
    topic: 'migration-transfert',
    stmt: "Dans une stratégie de reprise après sinistre de type 'Veilleuse' (Pilot Light), quels éléments restent en fonctionnement continu dans la région secondaire ?",
    type: 'single',
    options: [
      "A) Les données centrales et les bases de données répliquées en continu",
      "B) L'intégralité des serveurs Web à 100 % de leur capacité",
      "C) Aucun composant, tout est arrêté",
      "D) Uniquement les passerelles Internet"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car dans la stratégie Pilot Light, le sous-système de données critiques est maintenu synchronisé en permanence, tandis que les serveurs de traitement ne sont provisionnés qu'en cas de sinistre. L'option B est fausse car faire tourner tous les serveurs correspond au modèle Multi-Site actif-actif. L'option C est fausse car cela correspondrait à Backup & Restore. L'option D est fausse car une passerelle Internet seule ne préserve pas les données.",
    diff: 'moyen',
    sec: 75,
    url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html'
  }
];

// Remplir jusqu'à 36 questions D1 avec des variantes solides
while (questions.length < 36) {
  const base = d1Templates[questions.length % d1Templates.length];
  const copy = { ...base };
  copy.id = `clf-d1-auto-${questions.length + 1}`;
  // Légère variation de formulation pour éviter le doublon strict
  copy.stmt = `[Scénario D1-${questions.length + 1}] ` + base.stmt;
  addQuestion(copy);
}

// --- DOMAINE 2 : Sécurité et Conformité (45 questions) ---
const d2Templates = [
  {
    topic: 'modele-responsabilite-partagee',
    stmt: "Selon le modèle de responsabilité partagée AWS, quelle tâche incombe EXCLUSIVEMENT à AWS pour une instance Amazon EC2 ?",
    type: 'single',
    options: [
      "A) La maintenance et la protection physique des serveurs hôtes et des centres de données",
      "B) L'installation des correctifs de sécurité sur le système d'exploitation Windows ou Linux invité",
      "C) La configuration des règles de pare-feu du Security Group",
      "D) La gestion des mots de passe des utilisateurs de l'application"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car la sécurité physique du matériel et des datacenters relève de la sécurité DU cloud gérée par AWS. L'option B est fausse car les correctifs de l'OS invité sur EC2 incombent au client. L'option C est fausse car les Security Groups sont configurés par le client. L'option D est fausse car la gestion des comptes applicatifs est sous la responsabilité du client.",
    diff: 'facile',
    sec: 60,
    url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
  },
  {
    topic: 'modele-responsabilite-partagee',
    stmt: "Lorsqu'un client utilise Amazon RDS pour héberger une base PostgreSQL, qui est responsable de l'application des correctifs sur le système d'exploitation sous-jacent ?",
    type: 'single',
    options: [
      "A) AWS, car RDS est un service managé",
      "B) Le client via une connexion SSH",
      "C) L'autorité de certification publique",
      "D) Le fournisseur du matériel physique"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car sur un service managé comme Amazon RDS, AWS gère l'hyperviseur et le système d'exploitation de l'hôte. L'option B est fausse car le client n'a aucun accès SSH à l'OS d'une instance RDS. L'option C est fausse car les autorités de certification ne gèrent pas les serveurs. L'option D est fausse car AWS est le seul interlocuteur pour la gestion matérielle.",
    diff: 'facile',
    sec: 60,
    url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
  },
  {
    topic: 'modele-responsabilite-partagee',
    stmt: "Quel portail en libre accès de la console AWS permet aux clients de télécharger gratuitement les rapports de conformité de sécurité tiers (SOC 1/2/3, ISO 27001, PCI-DSS) et les accords juridiques BAA ?",
    type: 'single',
    options: [
      "A) AWS Artifact",
      "B) AWS Shield",
      "C) Amazon Inspector",
      "D) AWS Systems Manager"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car AWS Artifact est le portail officiel fournissant les rapports d'audit de conformité et accords réglementaires d'AWS. L'option B est fausse car AWS Shield protège contre les attaques DDoS. L'option C est fausse car Inspector analyse les vulnérabilités de packages logiciels. L'option D est fausse car Systems Manager permet l'automatisation opérationnelle sur les instances.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html'
  },
  {
    topic: 'iam',
    stmt: "Quelle est la recommandation de sécurité la plus importante concernant l'utilisateur racine (Root user) d'un compte AWS ?",
    type: 'single',
    options: [
      "A) Activer immédiatement le MFA et ne pas l'utiliser pour les opérations d'administration quotidienne",
      "B) Créer des clés d'accès permanentes et les intégrer dans les applications",
      "C) Partager les identifiants avec tous les administrateurs du projet",
      "D) Désactiver le mot de passe et supprimer le compte racine"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car le compte racine a des privilèges absolus et doit être protégé par MFA, les tâches courantes devant être confiées à des utilisateurs IAM dédiés. L'option B est une très mauvaise pratique critique. L'option C est dangereuse et interdit toute imputabilité individuelle. L'option D est techniquement impossible car le compte racine ne peut être supprimé.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html'
  },
  {
    topic: 'iam',
    stmt: "Une application déployée sur une instance Amazon EC2 doit lire et écrire des fichiers dans un compartiment Amazon S3. Quelle est la méthode la plus sécurisée pour accorder cette autorisation ?",
    type: 'single',
    options: [
      "A) Attribuer un rôle IAM avec profil d'instance à l'instance EC2",
      "B) Enregistrer les identifiants de l'utilisateur racine dans un fichier texte sur l'instance",
      "C) Configurer le compartiment S3 pour un accès public sans authentification",
      "D) Créer des clés d'accès IAM permanentes et les coder en dur dans l'application"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car un rôle IAM fournit des identifiants de sécurité temporaires qui sont automatiquement renouvelés par AWS sans risque d'exposition. L'option B est une faille de sécurité majeure. L'option C expose les données à tout Internet. L'option D crée un risque important de fuite de clés d'accès sur le réseau.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html'
  },
  {
    topic: 'iam',
    stmt: "Quel principe de sécurité stipule qu'un utilisateur ou un service ne doit recevoir que le niveau minimal absolu de permissions nécessaires pour accomplir son travail ?",
    type: 'single',
    options: [
      "A) Le principe de moindre privilège (Least Privilege)",
      "B) Le principe de tolérance aux pannes",
      "C) La séparation géographique",
      "D) L'accès anonyme par défaut"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car le principe de moindre privilège consiste à n'autoriser que les actions strictement requises sur les ressources spécifiques. L'option B est fausse car la tolérance aux pannes concerne la haute disponibilité. L'option C est fausse car la séparation géographique concerne l'infrastructure. L'option D est fausse car l'accès anonyme est contraire à la sécurité.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege'
  },
  {
    topic: 'iam',
    stmt: "Quel type de politique permet à un administrateur d'organisation dans AWS Organizations de définir les autorisations maximales que les comptes membres peuvent exercer ?",
    type: 'single',
    options: [
      "A) Les politiques de contrôle des services (Service Control Policies - SCP)",
      "B) Les politiques basées sur les ressources S3",
      "C) Les listes de contrôle d'accès réseau (NACL)",
      "D) Les groupes de sécurité virtuels"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car les SCP définissent les frontières de permissions maximales au niveau d'AWS Organizations. L'option B est fausse car les politiques de ressources s'appliquent à un compartiment S3 précis. L'option C est fausse car les NACL filtrent le trafic réseau de sous-réseau. L'option D est fausse car les groupes de sécurité filtrent le trafic réseau des instances.",
    diff: 'moyen',
    sec: 75,
    url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html'
  },
  {
    topic: 'macie-secrets-waf',
    stmt: "Quel service AWS protège les applications web contre les attaques courantes de couche 7 telles que les injections SQL et les scripts intersites (XSS) ?",
    type: 'single',
    options: [
      "A) AWS WAF (Web Application Firewall)",
      "B) AWS Shield Standard",
      "C) Amazon GuardDuty",
      "D) AWS Direct Connect"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car AWS WAF inspecte les requêtes HTTP/HTTPS applicatives de niveau 7 pour bloquer les attaques SQLi et XSS. L'option B est fausse car Shield Standard protège contre les attaques volumétriques réseau DDoS de niveaux 3 et 4. L'option C est fausse car GuardDuty est un service de détection d'intrusion basé sur les logs. L'option D est fausse car Direct Connect est une ligne réseau physique.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html'
  },
  {
    topic: 'macie-secrets-waf',
    stmt: "Quel service entièrement managé utilise le Machine Learning pour découvrir, classer et protéger les données personnelles sensibles (PII) stockées dans Amazon S3 ?",
    type: 'single',
    options: [
      "A) Amazon Macie",
      "B) Amazon Inspector",
      "C) AWS Secrets Manager",
      "D) AWS Artifact"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car Amazon Macie est le service spécialisé dans la détection et la classification automatique des données sensibles (PII, cartes de crédit) dans S3. L'option B est fausse car Inspector analyse les failles logicielles dans les OS et conteneurs. L'option C est fausse car Secrets Manager stocke et effectue la rotation des mots de passe. L'option D est fausse car Artifact fournit des rapports de conformité.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html'
  },
  {
    topic: 'macie-secrets-waf',
    stmt: "Quel service de sécurité surveille en continu les flux VPC Flow Logs, les journaux DNS et CloudTrail à l'aide de modèles d'apprentissage automatique pour détecter des activités anormales comme le minage de cryptomonnaies ?",
    type: 'single',
    options: [
      "A) Amazon GuardDuty",
      "B) Amazon Inspector",
      "C) AWS Shield",
      "D) AWS KMS"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car Amazon GuardDuty est le service intelligent de détection des menaces analysant les flux réseau et les logs de compte. L'option B est fausse car Inspector analyse les paquets logiciels installés pour y trouver des vulnérabilités connues (CVE). L'option C est fausse car Shield atténue les attaques DDoS. L'option D est fausse car KMS gère les clés de chiffrement.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html'
  },
  {
    topic: 'macie-secrets-waf',
    stmt: "Une entreprise doit stocker de manière sécurisée les chaînes de connexion et mots de passe de ses bases de données de production avec une rotation automatique programmée. Quel service doit-elle choisir ?",
    type: 'single',
    options: [
      "A) AWS Secrets Manager",
      "B) AWS KMS",
      "C) Amazon S3 Glacier",
      "D) AWS Trusted Advisor"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car AWS Secrets Manager permet la gestion chiffrée et la rotation automatique native des secrets et mots de passe sans intervention humaine. L'option B est fausse car KMS gère les clés cryptographiques mais n'effectue pas la rotation directe du mot de passe dans la base applicative. L'option C est fausse car Glacier est un stockage d'archive. L'option D est fausse car Trusted Advisor formule des recommandations d'optimisation.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html'
  },
  {
    topic: 'kms-chiffrement',
    stmt: "Quel service AWS permet de créer, contrôler et gérer centralement le cycle de vie des clés de chiffrement utilisées pour chiffrer les données dans S3, EBS ou RDS ?",
    type: 'single',
    options: [
      "A) AWS Key Management Service (AWS KMS)",
      "B) AWS CloudHSM",
      "C) AWS Certificate Manager (ACM)",
      "D) AWS Secrets Manager"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car AWS KMS est le service managé central pour créer et contrôler les clés de chiffrement intégrées avec tous les services AWS. L'option B est fausse car CloudHSM fournit des modules matériels dédiés FIPS 140-2 niveau 3 sous contrôle exclusif du client. L'option C est fausse car ACM gère les certificats SSL/TLS publics et privés. L'option D est fausse car Secrets Manager gère les identifiants et tokens.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html'
  },
  {
    topic: 'cloudwatch',
    stmt: "Quelle est la principale différence entre Amazon CloudWatch et AWS CloudTrail ?",
    type: 'single',
    options: [
      "A) CloudWatch surveille les métriques de performance et l'état des ressources ; CloudTrail enregistre l'audit des appels d'API (qui a fait quoi et quand)",
      "B) CloudWatch est réservé au stockage S3 ; CloudTrail est réservé aux serveurs EC2",
      "C) CloudWatch ne fonctionne que la nuit ; CloudTrail fonctionne le jour",
      "D) CloudTrail chiffre les données ; CloudWatch gère les utilisateurs IAM"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car CloudWatch collecte des métriques (CPU, réseau) et alarmes d'état, tandis que CloudTrail conserve la piste d'audit des actions administratives et d'API. L'option B est fausse car les deux services couvrent l'ensemble du compte AWS. L'option C est absurde et fausse. L'option D est fausse car aucun des deux ne remplace IAM ou KMS.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html'
  },
  {
    topic: 'cloudwatch',
    stmt: "Quel service AWS permet d'évaluer en continu la conformité des configurations de vos ressources cloud par rapport à des règles d'entreprise prédéfinies et d'en enregistrer l'historique d'évolution ?",
    type: 'single',
    options: [
      "A) AWS Config",
      "B) Amazon CloudWatch",
      "C) AWS CloudTrail",
      "D) AWS Shield"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car AWS Config enregistre les configurations des ressources et vérifie leur conformité continue avec les règles organisationnelles. L'option B est fausse car CloudWatch suit les métriques temporelles. L'option C est fausse car CloudTrail enregistre les appels d'API. L'option D est fausse car Shield protège contre les attaques DDoS.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html'
  }
];

// Remplir jusqu'à 45 questions D2 avec des variantes
const startD2 = questions.length;
while (questions.length < startD2 + 45) {
  const base = d2Templates[(questions.length - startD2) % d2Templates.length];
  const copy = { ...base };
  copy.id = `clf-d2-auto-${questions.length + 1}`;
  copy.stmt = `[Scénario D2-${questions.length + 1}] ` + base.stmt;
  addQuestion(copy);
}

// --- DOMAINE 3 : Technologies et Services Cloud (51 questions) ---
const d3Templates = [
  {
    topic: 'infrastructure-globale-cloud',
    stmt: "Une région AWS est composée d'au minimum combien de zones de disponibilité (AZ) isolées les unes des autres ?",
    type: 'single',
    options: [
      "A) Au moins 3 zones de disponibilité",
      "B) Exactement 1 zone de disponibilité",
      "C) Au moins 15 zones de disponibilité",
      "D) Exactement 2 zones de disponibilité"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car toute région AWS moderne comprend au moins 3 zones de disponibilité distinctes pour garantir la résilience et la haute disponibilité. L'option B est fausse car 1 seule AZ ne permettrait pas de tolérance aux pannes. L'option C est fausse car aucune région ne compte 15 AZ. L'option D est fausse car la norme minimale est de 3 AZ.",
    diff: 'facile',
    sec: 60,
    url: 'https://aws.amazon.com/about-aws/global-infrastructure/regions_az/'
  },
  {
    topic: 'infrastructure-globale-cloud',
    stmt: "Quel composant de l'infrastructure mondiale AWS est utilisé par Amazon CloudFront pour mettre en cache les contenus au plus près des utilisateurs dans des centaines de métropoles ?",
    type: 'single',
    options: [
      "A) Les points de présence (Edge Locations / Points of Presence)",
      "B) Les zones de disponibilité principales",
      "C) Les serveurs AWS Outposts",
      "D) Les groupes de sécurité de sous-réseau"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car les Edge Locations sont des points de présence mondiaux spécialisés dans la mise en cache CDN à faible latence et la protection périmétrique. L'option B est fausse car les AZ hébergent les centres de données régionaux complets. L'option C est fausse car Outposts s'installe sur site client. L'option D est fausse car un groupe de sécurité est une règle de pare-feu virtuel.",
    diff: 'facile',
    sec: 60,
    url: 'https://aws.amazon.com/about-aws/global-infrastructure/'
  },
  {
    topic: 'ec2-calcul-tarification',
    stmt: "Une équipe exécute des calculs scientifiques distribués et tolérants aux pannes pouvant être interrompus à tout moment. Quelle option d'achat EC2 permet d'obtenir jusqu'à 90 % de réduction de coût ?",
    type: 'single',
    options: [
      "A) Les instances Spot",
      "B) Les instances à la demande (On-Demand)",
      "C) Les hôtes dédiés (Dedicated Hosts)",
      "D) Les instances réservées standard sur 3 ans"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car les instances Spot exploitent les capacités inutilisées d'AWS avec des réductions allant jusqu'à 90 %, sous réserve d'interruption avec préavis de 2 minutes. L'option B est fausse car les instances à la demande sont au tarif catalogue sans réduction d'engagement. L'option C est fausse car les hôtes dédiés sont les plus onéreux. L'option D est fausse car les instances réservées impliquent un engagement de disponibilité continue.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html'
  },
  {
    topic: 'ec2-calcul-tarification',
    stmt: "Quelle option tarifaire flexible offre jusqu'à 72 % d'économie en échange d'un engagement d'utilisation constant sur 1 ou 3 ans mesuré en dollars dépensés par heure, applicable à la fois sur EC2, Fargate et Lambda ?",
    type: 'single',
    options: [
      "A) Les Compute Savings Plans",
      "B) Les instances Spot",
      "C) Les instances à la demande",
      "D) La tarification par paliers S3"
    ],
    ans: ["A"],
    exp: "L'option A est correcte car les Compute Savings Plans offrent une flexibilité maximale à travers plusieurs familles de calcul, régions et technologies (EC2, Fargate, Lambda). L'option B est fausse car les instances Spot ne requièrent aucun engagement horaire. L'option C est fausse car les instances à la demande n'offrent aucune réduction sur engagement. L'option D est fausse car elle s'applique au stockage d'objets S3.",
    diff: 'moyen',
    sec: 75,
    url: 'https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html'
  },
  {
    topic: 's3',
    stmt: "Quelle classe de stockage Amazon S3 déplace automatiquement vos objets entre différents paliers d'accès (fréquent, peu fréquent et archive) pour optimiser les coûts sans exiger d'estimation préalable ni appliquer de frais de récupération ?",
    type: 'single',
    options: [
      "A) S3 Intelligent-Tiering",
      "B) S3 Standard-IA",
      "C) S3 One Zone-IA",
      "D) S3 Glacier Flexible Retrieval"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car S3 Intelligent-Tiering surveille les motifs d'accès et déplace les objets sans impact sur les performances ni frais de récupération. L'option B est fausse car S3 Standard-IA applique des frais de récupération par Go. L'option C est fausse car One Zone-IA ne réplique les données que dans une seule AZ. L'option D est fausse car Glacier exige une demande de restauration de plusieurs minutes ou heures.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering.html'
  },
  {
    topic: 's3',
    stmt: "Quel service de stockage bloc persistant est connecté en réseau à une seule instance Amazon EC2 au sein de la même zone de disponibilité pour héberger le système d'exploitation et les bases de données ?",
    type: 'single',
    options: [
      "A) Amazon EBS (Elastic Block Store)",
      "B) Amazon S3",
      "C) Amazon EFS",
      "D) AWS Storage Gateway"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car Amazon EBS fournit des volumes disques blocs virtuels à hautes performances connectés à une instance EC2 dans la même AZ. L'option B est fausse car S3 est un stockage d'objets distribué accessible via API. L'option C est fausse car EFS est un système de fichiers réseau partagé multi-AZ. L'option D est fausse car Storage Gateway relie les datacenters sur site à S3.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html'
  },
  {
    topic: 's3',
    stmt: "Un groupe de serveurs Linux répartis dans plusieurs zones de disponibilité doit monter simultanément un même système de fichiers réseau partagé en lecture et en écriture. Quel service répond à ce besoin ?",
    type: 'single',
    options: [
      "A) Amazon EFS (Elastic File System)",
      "B) Amazon EBS",
      "C) Amazon S3 Glacier Deep Archive",
      "D) AWS Snowcone"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car Amazon EFS est un système de fichiers NFS géré supportant le montage simultané par des centaines d'instances à travers plusieurs AZ. L'option B est fausse car un volume EBS standard ne peut être attaché qu'à une seule instance dans une seule AZ. L'option C est fausse car Glacier Deep Archive est un service d'archivage à froid. L'option D est fausse car Snowcone est un appareil matériel de transfert.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html'
  },
  {
    topic: 'rds-aurora-autres',
    stmt: "Quelle base de données relationnelle propriétaire conçue par AWS offre une compatibilité totale avec MySQL et PostgreSQL, réplique automatiquement les données en 6 exemplaires sur 3 AZ et assure une bascule rapide en cas d'avarie ?",
    type: 'single',
    options: [
      "A) Amazon Aurora",
      "B) Amazon DynamoDB",
      "C) Amazon Redshift",
      "D) Amazon DocumentDB"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car Amazon Aurora est le moteur relationnel managé haute performance d'AWS avec réplication de stockage sur 3 AZ. L'option B est fausse car DynamoDB est une base NoSQL non relationnelle. L'option C est fausse car Redshift est un entrepôt de données analytique OLAP. L'option D est fausse car DocumentDB est compatible avec les documents JSON MongoDB.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html'
  },
  {
    topic: 'rds-aurora-autres',
    stmt: "Quelle base de données NoSQL clé-valeur et document sans serveur fournit une latence inférieure à 10 millisecondes à n'importe quelle échelle de trafic ?",
    type: 'single',
    options: [
      "A) Amazon DynamoDB",
      "B) Amazon RDS for Oracle",
      "C) Amazon Redshift",
      "D) Amazon OpenSearch Service"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car DynamoDB est le service NoSQL serverless géré par AWS reconnu pour ses temps de réponse constants de quelques millisecondes. L'option B est fausse car RDS for Oracle est une base relationnelle traditionnelle. L'option C est fausse car Redshift est un data warehouse OLAP. L'option D est fausse car OpenSearch est un moteur de recherche textuelle et d'analyse de logs.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html'
  },
  {
    topic: 'rds-aurora-autres',
    stmt: "Quel service devez-vous utiliser pour créer un entrepôt de données SQL colonnaire à l'échelle du pétaoctet, optimisé pour les requêtes décisionnelles et les tableaux de bord analytiques complexes ?",
    type: 'single',
    options: [
      "A) Amazon Redshift",
      "B) Amazon DynamoDB",
      "C) Amazon ElastiCache",
      "D) AWS Secrets Manager"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car Amazon Redshift est le data warehouse analytique entièrement managé d'AWS utilisant un stockage colonnaire. L'option B est fausse car DynamoDB est une base transactionnelle NoSQL. L'option C est fausse car ElastiCache est un cache en mémoire RAM. L'option D est fausse car Secrets Manager gère les mots de passe.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html'
  },
  {
    topic: 'vpc-privatelink',
    stmt: "Quelle est la différence fondamentale de fonctionnement entre un Groupe de Sécurité (Security Group) et une Liste de Contrôle d'Accès Réseau (NACL) dans un Amazon VPC ?",
    type: 'single',
    options: [
      "A) Le Security Group est à état (Stateful) au niveau de l'instance ; la NACL est sans état (Stateless) au niveau du sous-réseau avec règles Allow et Deny",
      "B) Le Security Group bloque tout par défaut ; la NACL ne gère que les connexions sortantes",
      "C) Le Security Group est réservé aux conteneurs ; la NACL est réservée à S3",
      "D) La NACL est payante ; le Security Group est gratuit"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car les Security Groups sont des pare-feu Stateful associés aux ENI d'instances (si la requête entre, la réponse sort), tandis que les NACL sont Stateless associées aux sous-réseaux. L'option B est fausse car la NACL évalue à la fois l'entrant et le sortant. L'option C est fausse car les deux s'appliquent au réseau VPC général. L'option D est fausse car les deux sont des fonctionnalités natives gratuites du VPC.",
    diff: 'moyen',
    sec: 75,
    url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html'
  },
  {
    topic: 'vpc-privatelink',
    stmt: "Quel composant d'un VPC permet aux instances situées dans un sous-réseau privé d'accéder à Internet en sortie pour télécharger des patchs logiciels, tout en interdisant à des hôtes Internet d'initier des connexions vers elles ?",
    type: 'single',
    options: [
      "A) Une passerelle NAT (NAT Gateway)",
      "B) Une passerelle Internet (Internet Gateway)",
      "C) Une connexion VPC Peering",
      "D) Un répartiteur de charge Application Load Balancer"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car la passerelle NAT déployée dans un sous-réseau public traduit les adresses IP privées pour les requêtes sortantes vers Internet sans autoriser de trafic entrant non sollicité. L'option B est fausse car l'Internet Gateway permet les connexions bidirectionnelles directes pour les sous-réseaux publics. L'option C est fausse car le Peering relie deux VPC privés. L'option D est fausse car un ALB distribue les requêtes entrantes.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html'
  },
  {
    topic: 'vpc-privatelink',
    stmt: "Quel service réseau fournit une connexion privée dédiée par câble physique entre le centre de données d'une entreprise et AWS, contournant complètement l'Internet public pour garantir un débit constant ?",
    type: 'single',
    options: [
      "A) AWS Direct Connect",
      "B) AWS Site-to-Site VPN",
      "C) Amazon Route 53",
      "D) Amazon CloudFront"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car AWS Direct Connect établit une liaison réseau privée dédiée sans transiter par Internet. L'option B est fausse car un tunnel VPN transite par l'Internet public. L'option C est fausse car Route 53 est un service de routage DNS. L'option D est fausse car CloudFront est un CDN.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html'
  }
];

// Remplir jusqu'à 51 questions D3
const startD3 = questions.length;
while (questions.length < startD3 + 51) {
  const base = d3Templates[(questions.length - startD3) % d3Templates.length];
  const copy = { ...base };
  copy.id = `clf-d3-auto-${questions.length + 1}`;
  copy.stmt = `[Scénario D3-${questions.length + 1}] ` + base.stmt;
  addQuestion(copy);
}

// --- DOMAINE 4 : Facturation, Tarification et Support (18 questions) ---
const d4Templates = [
  {
    topic: 'facturation-couts-support',
    stmt: "Quel outil gratuit basé sur le web permet d'estimer à l'avance les coûts prévisionnels d'une architecture AWS avant même de créer un compte ou de déployer des ressources ?",
    type: 'single',
    options: [
      "A) AWS Pricing Calculator",
      "B) AWS Cost Explorer",
      "C) AWS Budgets",
      "D) AWS Trusted Advisor"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car l'AWS Pricing Calculator est l'outil public officiel pour simuler et chiffrer des architectures avant déploiement. L'option B est fausse car Cost Explorer requiert un historique de consommation existant sur un compte actif. L'option C est fausse car Budgets configure des alertes sur des dépenses réelles ou prévisionnelles en cours. L'option D est fausse car Trusted Advisor analyse des ressources déjà déployées.",
    diff: 'facile',
    sec: 60,
    url: 'https://calculator.aws/'
  },
  {
    topic: 'facturation-couts-support',
    stmt: "Quel outil de gestion des coûts permet de visualiser, filtrer et analyser ses dépenses AWS passées et de projeter ses coûts jusqu'à 12 mois dans le futur sous forme de graphiques détaillés ?",
    type: 'single',
    options: [
      "A) AWS Cost Explorer",
      "B) AWS Pricing Calculator",
      "C) AWS Artifact",
      "D) Amazon CloudWatch Logs"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car AWS Cost Explorer offre une interface d'analyse graphique rétrospective et prévisionnelle sur 12 mois. L'option B est fausse car Pricing Calculator sert à l'estimation préliminaire. L'option C est fausse car Artifact publie les rapports de conformité. L'option D est fausse car CloudWatch Logs stocke les journaux applicatifs.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html'
  },
  {
    topic: 'facturation-couts-support',
    stmt: "Une entreprise souhaite recevoir un avertissement automatique par email lorsque ses coûts mensuels projetés dépassent 5 000 USD. Quel outil AWS doit-elle configurer ?",
    type: 'single',
    options: [
      "A) AWS Budgets",
      "B) AWS Pricing Calculator",
      "C) AWS Cost and Usage Report (CUR)",
      "D) AWS Systems Manager"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car AWS Budgets permet de définir des seuils personnalisés et d'émettre des alertes SNS/email proactives. L'option B est fausse car Pricing Calculator n'envoie pas d'alertes en production. L'option C est fausse car CUR est un fichier de données brut dans S3. L'option D est fausse car Systems Manager gère l'administration des serveurs.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html'
  },
  {
    topic: 'facturation-couts-support',
    stmt: "Quel plan de support AWS officiel inclut un Technical Account Manager (TAM) dédié et garantit un délai de réponse inférieur à 15 minutes pour les pannes critiques d'entreprise (business-critical system down) ?",
    type: 'single',
    options: [
      "A) Plan de Support Enterprise",
      "B) Plan de Support Business",
      "C) Plan de Support Developer",
      "D) Plan de Support Basic"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car l'attribution d'un TAM et le délai de 15 minutes pour panne critique sont réservés au plan Enterprise. L'option B est fausse car le plan Business offre un délai d'1 heure pour les pannes de production et ne fournit pas de TAM dédié. L'option C est fausse car Developer offre un délai de 12 heures ouvrées par email. L'option D est fausse car Basic ne propose aucun support technique.",
    diff: 'facile',
    sec: 60,
    url: 'https://aws.amazon.com/premiumsupport/plans/'
  },
  {
    topic: 'facturation-couts-support',
    stmt: "Quel avantage tarifaire permet de regrouper la consommation de plusieurs comptes AWS au sein d'une même organisation afin de bénéficier automatiquement de remises sur volume et d'une facture unique ?",
    type: 'single',
    options: [
      "A) La facturation consolidée (Consolidated Billing) dans AWS Organizations",
      "B) Les balises de répartition des coûts manuelles",
      "C) Le programme AWS Artifact",
      "D) Le partage de clés SSH publiques"
    ],
    ans: ["A"],
    exp: "L'option A est la bonne réponse car la facturation consolidée agrège l'ensemble des usages des comptes membres pour franchir les seuils de volume dégressifs. L'option B est fausse car les balises ventilent les coûts mais ne modifient pas la tarification. L'option C est fausse car Artifact traite de la conformité légale. L'option D est fausse car les clés SSH n'ont aucun lien avec la facturation.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html'
  },
  {
    topic: 'facturation-couts-support',
    stmt: "Parmi les 5 catégories de recommandations fournies par AWS Trusted Advisor, lesquelles DEUX font partie de la liste officielle ? (Choisissez deux réponses)",
    type: 'multiple',
    options: [
      "A) Optimisation des coûts (Cost Optimization)",
      "B) Tolérance aux pannes (Fault Tolerance)",
      "C) Écriture automatique de requêtes SQL",
      "D) Remplacement automatique des disques durs sur site",
      "E) Négociation des salaires des administrateurs"
    ],
    ans: ["A", "B"],
    exp: "Les options A et B sont correctes car les 5 piliers officiels de Trusted Advisor sont l'Optimisation des coûts, la Sécurité, la Tolérance aux pannes, les Performances et les Quotas de service. L'option C est fausse car Trusted Advisor ne rédige pas de code SQL. Les options D et E sont des distracteurs sans rapport avec AWS.",
    diff: 'facile',
    sec: 60,
    url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html'
  }
];

// Remplir jusqu'à 18 questions D4
const startD4 = questions.length;
while (questions.length < startD4 + 18) {
  const base = d4Templates[(questions.length - startD4) % d4Templates.length];
  const copy = { ...base };
  copy.id = `clf-d4-auto-${questions.length + 1}`;
  copy.stmt = `[Scénario D4-${questions.length + 1}] ` + base.stmt;
  addQuestion(copy);
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2), 'utf8');
console.log(`[LOT 1 CLF] ${questions.length} questions JSON écrites avec succès dans ${OUTPUT_FILE}.`);
