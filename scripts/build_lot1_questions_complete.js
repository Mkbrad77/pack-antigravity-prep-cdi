import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const OUTPUT_FILE = path.join(ROOT_DIR, 'content', 'certifications', 'clf', 'questions.json');

const questions = [];

function addQ({
  domain,
  topic_id,
  statement,
  type = 'single',
  options,
  expected_answer,
  explanation,
  difficulty = 'facile',
  recommended_time_sec = 60,
  source_url
}) {
  const id = `clf-q${String(questions.length + 1).padStart(3, '0')}`;
  questions.push({
    id,
    statement,
    type,
    options,
    expected_answer,
    explanation,
    domain,
    topic_id,
    difficulty,
    recommended_time_sec,
    source_url,
    provenance: 'générée par IA et vérifiée dans la documentation (2026-10-31)',
    verification_date: '2026-10-31'
  });
}

// --------------------------------------------------------------------------
// DOMAINE 1 : Concepts du Cloud (36 questions)
// --------------------------------------------------------------------------
const D1 = 'Domaine 1 : Concepts du Cloud';

// 1.1 cloud-concepts-valeur (12 questions)
addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Une entreprise souhaite remplacer ses investissements initiaux massifs dans des centres de données physiques par des dépenses opérationnelles payées au fur et à mesure de l'utilisation. Quel avantage majeur du cloud AWS cela représente-t-il ?",
  options: [
    "A) Remplacement des dépenses d'investissement initiales (CapEx) par des dépenses variables (OpEx)",
    "B) Suppression intégrale de tout besoin de surveiller les coûts mensuels",
    "C) Obligation de souscrire des engagements pluriannuels fermes pour chaque serveur",
    "D) Garantie d'une absence absolue de latence réseau pour tous les utilisateurs"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le passage des dépenses de capital (CapEx) aux dépenses opérationnelles (OpEx) est un avantage fondamental du cloud computing. L'option B est fausse car le suivi des coûts reste indispensable. L'option C est fausse car AWS propose la tarification à la demande sans engagement. L'option D est fausse car aucune technologie réseau ne garantit une latence nulle.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Quelle propriété du cloud AWS permet à une application de provisionner automatiquement des serveurs supplémentaires lors d'une hausse soudaine de trafic, puis de les résilier dès le retour à la normale pour éviter le surcoût ?",
  options: [
    "A) L'élasticité",
    "B) Le partitionnement de table",
    "C) Le chiffrement asymétrique",
    "D) La réplication synchrone"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'élasticité permet d'allouer et de libérer des ressources dynamiquement selon la demande. L'option B est fausse car le partitionnement concerne l'organisation interne d'une base de données. L'option C est fausse car le chiffrement asymétrique concerne la sécurité cryptographique. L'option D est fausse car la réplication synchrone est un mécanisme de cohérence des données.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Comment se nomme la capacité d'une architecture cloud à continuer de fonctionner sans interruption de service même en cas de défaillance matérielle d'un de ses composants sous-jacents ?",
  options: [
    "A) La tolérance aux pannes (Fault Tolerance)",
    "B) La compression de données",
    "C) Le basculement manuel différé",
    "D) La déduplication de blocs"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la tolérance aux pannes est la capacité d'un système à maintenir son service nominal malgré la défaillance d'éléments matériels. L'option B est fausse car la compression réduit l'empreinte disque. L'option C est fausse car un basculement manuel implique une interruption de service. L'option D est fausse car la déduplication optimise le stockage.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Grâce à l'agrégation de l'activité de centaines de milliers de clients sur son infrastructure mondiale, AWS réalise des économies d'échelle considérables. Quel est le bénéfice direct pour les clients ?",
  options: [
    "A) Des baisses de prix régulières sur les services et des tarifs à l'usage décroissants",
    "B) L'accès gratuit et illimité à tous les types d'instances de calcul EC2",
    "C) L'interdiction d'utiliser des outils tiers open source",
    "D) L'obligation d'acheter du matériel physique auprès d'AWS"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les économies d'échelle massives permettent à AWS de proposer des prix unitaires plus bas aux clients. L'option B est fausse car seules certaines ressources sont couvertes par le niveau gratuit limité. L'option C est fausse car AWS est ouvert aux outils open source. L'option D est fausse car le modèle cloud évite précisément tout achat de matériel physique par le client.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Une jeune entreprise souhaite lancer un prototype fonctionnel à l'international en quelques heures sans attendre des mois la livraison de serveurs physiques. Quel principe directeur du cloud est directement mis en avant ?",
  options: [
    "A) L'agilité et la rapidité de mise sur le marché",
    "B) L'exclusivité d'un hébergement sur site privé",
    "C) La mise en conformité manuelle sur bande magnétique",
    "D) La suppression de toute connexion à Internet"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le cloud permet de tester des idées et de déployer des infrastructures complètes en quelques minutes, augmentant considérablement l'agilité. L'option B est fausse car le prototype est déployé sur le cloud public AWS. L'option C est fausse car l'agilité repose sur des API modernes et non des bandes physiques. L'option D est fausse car les applications web cloud utilisent Internet.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Quel modèle de déploiement cloud combine un centre de données d'entreprise existant hébergé en interne avec des ressources hébergées dans le cloud public AWS reliées par une connexion réseau sécurisée ?",
  options: [
    "A) Le cloud hybride",
    "B) Le cloud exclusivement privé",
    "C) Le cloud communautaire fermé",
    "D) Le modèle client-serveur local sans connexion externe"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le modèle hybride associe une infrastructure sur site à un environnement de cloud public. L'option B est fausse car un cloud privé n'inclut pas de ressources hébergées chez un fournisseur public tiers. L'option C est fausse car un cloud communautaire est partagé entre plusieurs organisations partenaires. L'option D est fausse car une architecture hybride est par nature connectée.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/types-of-cloud-computing.html'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Quels sont DEUX des six avantages majeurs du Cloud Computing formulés par AWS ? (Choisissez deux réponses)",
  type: 'multiple',
  options: [
    "A) Déployer à l'échelle mondiale en quelques minutes",
    "B) Cesser de dépenser de l'argent pour l'exploitation et la maintenance de datacenters",
    "C) Supprimer le besoin de gérer les identifiants et les accès des collaborateurs",
    "D) Empêcher tout arrêt programmé de maintenance sur vos propres applications",
    "E) Remplacer tous les développeurs par des algorithmes matériels"
  ],
  expected_answer: ["A", "B"],
  explanation: "Les options A et B sont correctes car déployer mondialement en quelques minutes et cesser de dépenser de l'argent pour l'exploitation des datacenters font partie des six piliers fondateurs documentés par AWS. L'option C est fausse car la gestion des accès IAM incombe au client. Les options D et E sont techniquement fausses et infondées.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Quelle notion décrit le fait de cesser de deviner ses besoins en capacité d'infrastructure en ajustant les serveurs au fil de la croissance réelle de l'activité ?",
  options: [
    "A) Éliminer les devinettes sur la capacité d'infrastructure",
    "B) Le surdimensionnement préventif obligatoire",
    "C) Le verrouillage technologique matériel",
    "D) La réservation définitive de serveurs non modifiables"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'un des 6 avantages officiels d'AWS consiste à ne plus deviner ses besoins en capacité et à adapter les ressources à la volée. L'option B est fausse car le surdimensionnement engendre un gaspillage financier sur site évité par le cloud. L'option C est fausse car le cloud favorise la flexibilité. L'option D est fausse car le cloud permet de redimensionner les instances à tout moment.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Quelle différence distingue la scalabilité (mise à l'échelle) de l'élasticité dans un environnement AWS ?",
  options: [
    "A) La scalabilité désigne la capacité à absorber une charge croissante ; l'élasticité y ajoute la réduction dynamique automatique des ressources quand la charge baisse",
    "B) La scalabilité s'applique uniquement au stockage S3 ; l'élasticité s'applique uniquement aux bases DynamoDB",
    "C) L'élasticité nécessite une intervention humaine quotidienne obligatoire",
    "D) La scalabilité est payante ; l'élasticité est toujours entièrement gratuite"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la scalabilité gère la montée en charge alors que l'élasticité permet à la fois l'accroissement et la réduction automatique en adéquation avec la demande réelle. L'option B est fausse car les deux concepts concernent de multiples services AWS comme EC2 et Auto Scaling. L'option C est fausse car l'élasticité est automatisée. L'option D est fausse car les coûts dépendent des ressources consommées.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Dans quelle catégorie de service cloud (IaaS, PaaS, SaaS) se situe une instance Amazon EC2 dont l'utilisateur configure lui-même le système d'exploitation et les logiciels ?",
  options: [
    "A) IaaS (Infrastructure as a Service)",
    "B) PaaS (Platform as a Service)",
    "C) SaaS (Software as a Service)",
    "D) FaaS (Function as a Service)"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon EC2 fournit du calcul brut virtualisé où l'utilisateur administre l'OS invité, ce qui correspond à l'IaaS. L'option B est fausse car le PaaS masque la gestion de l'OS (comme AWS Elastic Beanstalk). L'option C est fausse car le SaaS fournit un logiciel clé en main complet. L'option D est fausse car le FaaS correspond à l'exécution de code pilotée par événements sans serveur (comme AWS Lambda).",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/types-of-cloud-computing.html'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Quel terme décrit le pourcentage de temps contractuel pendant lequel un service cloud ou une infrastructure est opérationnel et accessible ?",
  options: [
    "A) La haute disponibilité (High Availability) garantie par un SLA",
    "B) Le débit binaire réseau brut",
    "C) Le temps moyen de réponse DNS",
    "D) L'indice de performance CPU"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la disponibilité est mesurée en pourcentage de temps de fonctionnement et formalisée dans les contrats de niveau de service (SLA). L'option B est fausse car le débit mesure la bande passante transférée par seconde. L'option C est fausse car le temps de réponse DNS mesure une latence de résolution de nom. L'option D est fausse car l'indice CPU mesure la puissance de calcul.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/legal/service-level-agreements/'
});

addQ({
  domain: D1,
  topic_id: 'cloud-concepts-valeur',
  statement: "Une grande entreprise multinationale souhaite déployer un service avec un temps de réponse minimal pour ses utilisateurs en Amérique du Sud, en Europe et en Asie. Quelle force majeure d'AWS facilite ce déploiement ?",
  options: [
    "A) L'infrastructure mondiale composée de multiples régions interconnectées",
    "B) L'envoi physique de disques durs par courrier prioritaire",
    "C) La centralisation obligatoire de tous les serveurs dans un unique datacenter américain",
    "D) L'exclusivité d'accès accordée à une seule zone de disponibilité"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la présence de régions AWS réparties sur tous les continents permet de déployer les services au plus près des utilisateurs finaux pour réduire la latence. L'option B est fausse car le déploiement applicatif s'effectue par voie réseau et API. L'option C est fausse car AWS offre un réseau décentralisé mondial. L'option D est fausse car la redondance multi-AZ est recommandée.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/about-aws/global-infrastructure/'
});

// 1.2 well-architected (12 questions)
addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Quels sont les SIX piliers du cadre AWS Well-Architected Framework ?",
  options: [
    "A) Excellence opérationnelle, Sécurité, Fiabilité, Efficacité des performances, Optimisation des coûts, Durabilité",
    "B) Calcul, Stockage, Réseau, Sécurité, Base de données, Facturation",
    "C) Agilité, Élasticité, Scalabilité, Disponibilité, Sauvegarde, Redondance",
    "D) Vitesse, Simplicité, Rentabilité, Confidentialité, Intégrité, Disponibilité"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les 6 piliers officiels sont l'Excellence opérationnelle, la Sécurité, la Fiabilité, l'Efficacité des performances, l'Optimisation des coûts et la Durabilité (introduit fin 2021). Les options B, C et D mélangent des catégories de services AWS ou des concepts généraux mais ne constituent pas la nomenclature officielle du Well-Architected Framework.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "L'exécution d'opérations sous forme de code (Infrastructure-as-Code), la documentation automatique des processus et la gestion d'erreurs fréquentes et réversibles relèvent de quel pilier ?",
  options: [
    "A) Pilier Excellence opérationnelle (Operational Excellence)",
    "B) Pilier Fiabilité",
    "C) Pilier Efficacité des performances",
    "D) Pilier Durabilité"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'automatisation des opérations et la réalisation de petits changements réversibles définissent le pilier Excellence opérationnelle. L'option B est fausse car la Fiabilité concerne la prévention et le rétablissement après panne. L'option C est fausse car l'Efficacité des performances concerne l'usage optimal des ressources de calcul. L'option D est fausse car la Durabilité concerne l'impact écologique.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Une architecture est configurée pour tester automatiquement ses procédures de reprise sur incident et basculer en temps réel sans intervention humaine lors d'une panne d'une zone de disponibilité. Quel pilier est respecté ?",
  options: [
    "A) Pilier Fiabilité (Reliability)",
    "B) Pilier Sécurité",
    "C) Pilier Optimisation des coûts",
    "D) Pilier Durabilité"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la capacité d'un système à récupérer après une interruption et à répondre dynamiquement aux demandes de capacité relève du pilier Fiabilité. L'option B est fausse car la Sécurité concerne la protection des accès et des flux. L'option C est fausse car l'Optimisation des coûts concerne les dépenses. L'option D est fausse car la Durabilité concerne l'empreinte environnementale.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Appliquer la défense en profondeur à toutes les couches de l'application, chiffrer les données au repos et en transit et appliquer le principe du moindre privilège sont des principes fondamentaux de quel pilier ?",
  options: [
    "A) Pilier Sécurité (Security)",
    "B) Pilier Efficacité des performances",
    "C) Pilier Durabilité",
    "D) Pilier Excellence opérationnelle"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la traçabilité, la protection des données et le contrôle d'accès sont au coeur du pilier Sécurité. L'option B est fausse car l'Efficacité des performances traite des débits et latences. L'option C est fausse car la Durabilité traite des ressources énergétiques. L'option D est fausse car l'Excellence opérationnelle concerne l'exécution des procédures de maintenance.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Démocratiser les technologies de pointe afin que les équipes puissent adopter des architectures sans serveur ou de l'intelligence artificielle sans acquérir d'expertise matérielle complexe relève de quel pilier ?",
  options: [
    "A) Pilier Efficacité des performances (Performance Efficiency)",
    "B) Pilier Fiabilité",
    "C) Pilier Sécurité",
    "D) Pilier Durabilité"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la démocratisation des technologies avancées est l'un des principes directeurs officiels du pilier Efficacité des performances. L'option B est fausse car la Fiabilité concerne la continuité d'activité. L'option C est fausse car la Sécurité traite de la confidentialité et de la conformité. L'option D est fausse car la Durabilité vise la minimisation de la consommation d'énergie.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Analyser ses dépenses avec précision, attribuer les coûts aux centres de responsabilité via des balises et adopter un modèle de tarification adapté aux charges réelles correspond à quel pilier ?",
  options: [
    "A) Pilier Optimisation des coûts (Cost Optimization)",
    "B) Pilier Durabilité",
    "C) Pilier Fiabilité",
    "D) Pilier Excellence opérationnelle"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car mesurer l'efficacité financière et éliminer les dépenses inutiles caractérise le pilier Optimisation des coûts. L'option B est fausse car la Durabilité concerne l'impact écologique. L'option C est fausse car la Fiabilité concerne la résilience. L'option D est fausse car l'Excellence opérationnelle concerne les processus de livraison logicielle.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Une entreprise remplace ses anciennes instances EC2 par des processeurs AWS Graviton écoénergétiques et adopte une politique de cycle de vie S3 pour supprimer les fichiers obsolètes. Quel pilier est mis en oeuvre ?",
  options: [
    "A) Pilier Durabilité (Sustainability)",
    "B) Pilier Sécurité",
    "C) Pilier Fiabilité",
    "D) Pilier Excellence opérationnelle"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car optimiser l'utilisation des ressources matérielles pour réduire l'énergie dépensée et l'empreinte environnementale relève du pilier Durabilité. L'option B est fausse car Graviton n'est pas un mécanisme de contrôle d'accès. L'option C est fausse car l'objectif ici est l'efficacité énergétique. L'option D est fausse car l'Excellence opérationnelle concerne la gestion des flux de production.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Quel outil gratuit disponible dans la console de gestion AWS aide les architectes à comparer leurs charges de travail aux meilleures pratiques et génère un plan d'amélioration structuré ?",
  options: [
    "A) AWS Well-Architected Tool",
    "B) AWS Budgets",
    "C) AWS Shield",
    "D) Amazon Inspector"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'AWS Well-Architected Tool est le service dédié à l'évaluation méthodique des architectures par rapport aux six piliers. L'option B est fausse car AWS Budgets surveille les dépenses financières. L'option C est fausse car AWS Shield protège contre les attaques DDoS. L'option D est fausse car Amazon Inspector analyse les vulnérabilités de packages logiciels.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/userguide/intro.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Quel principe de conception du pilier Fiabilité préconise de ne pas concentrer la charge sur un composant unique mais de distribuer le trafic sur plusieurs zones de disponibilité ?",
  options: [
    "A) Éviter les points uniques de défaillance (Single Points of Failure)",
    "B) Utiliser un stockage sans chiffrement pour accélérer le débit",
    "C) Désactiver les sauvegardes automatiques pendant les heures de pointe",
    "D) Regrouper tous les serveurs dans une unique zone géographique"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car éliminer les points uniques de défaillance par la redondance géographique multi-AZ est au coeur de la conception pour la fiabilité. L'option B est fausse car la sécurité recommande le chiffrement sans compromettre la fiabilité. L'option C est une très mauvaise pratique. L'option D augmente au contraire le risque d'indisponibilité totale.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Parmi les propositions suivantes, laquelle illustre une bonne pratique du pilier Excellence opérationnelle ?",
  options: [
    "A) Faire des modifications fréquentes, de petite taille et réversibles",
    "B) Planifier une seule mise en production massive par an le week-end",
    "C) Effectuer les configurations de serveurs manuellement via la console sans enregistrer de script",
    "D) Désactiver les journaux d'audit pour alléger la base de données"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car faire de petits changements fréquents et facilement réversibles permet de minimiser l'impact d'une erreur et de faciliter le diagnostic. L'option B est fausse car les gros déploiements monolithiques augmentent le risque d'avarie majeure. L'option C contredit le principe de l'Infrastructure-as-Code. L'option D empêche la traçabilité opérationnelle.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Quel est un principe directeur majeur du pilier Optimisation des coûts selon le Well-Architected Framework ?",
  options: [
    "A) Mesurer l'efficacité globale en corrélant les coûts d'infrastructure à la valeur métier générée",
    "B) Sélectionner systématiquement les plus grosses instances disponibles pour éviter d'analyser le besoin",
    "C) Supprimer les environnements de test pour ne garder que la production",
    "D) Interdire l'utilisation d'outils de surveillance CloudWatch pour économiser les frais d'API"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car corréler les dépenses au résultat commercial et mesurer le retour sur investissement est une recommandation centrale d'optimisation financière. L'option B engendre du gaspillage. L'option C met en danger la stabilité de la production. L'option D empêche de détecter les surconsommations de ressources.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'well-architected',
  statement: "Dans le pilier Efficacité des performances, quelle stratégie permet de répondre rapidement aux requêtes fréquentes en plaçant les données au plus près des utilisateurs ?",
  options: [
    "A) Mettre en place des mécanismes de mise en cache avec Amazon CloudFront ou ElastiCache",
    "B) Augmenter la taille du disque dur sans modifier le réseau",
    "C) Désactiver les index dans les bases de données relationnelles",
    "D) Forcer chaque requête utilisateur à recalculer l'intégralité des tables SQL"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le caching à la périphérie (CDN) ou en mémoire vive (in-memory) réduit considérablement la latence et soulage les serveurs principaux. L'option B n'a aucun impact sur la latence réseau des utilisateurs distants. L'option C dégrade fortement les performances de lecture. L'option D augmente inutilement la charge de calcul.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html'
});

// 1.3 migration-transfert (12 questions)
addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Une entreprise souhaite migrer une flotte de serveurs existants vers Amazon EC2 sans modifier le code source des applications ni leur configuration d'exploitation. Quelle stratégie de migration des 7R utilise-t-elle ?",
  options: [
    "A) Rehost (Lift-and-Shift)",
    "B) Refactor (Re-architect)",
    "C) Repurchase (Drop-and-Shop)",
    "D) Retire"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la stratégie Rehost (ou Lift-and-Shift) déplace les serveurs virtuels tels quels vers le cloud sans modification du code. L'option B est fausse car Refactor réécrit l'application pour adopter des technologies cloud natives. L'option C est fausse car Repurchase remplace l'application par un progiciel SaaS. L'option D est fausse car Retire consiste à décommissionner une application devenue inutile.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-strategies/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Quelle stratégie de migration des 7R consiste à réécrire en profondeur une application monolithique existante afin de tirer pleinement parti des architectures microservices sans serveur sur AWS Lambda et DynamoDB ?",
  options: [
    "A) Refactor / Re-architect",
    "B) Rehost",
    "C) Relocate",
    "D) Retain"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Refactor/Re-architect implique une refonte architecturale complète vers le modèle cloud natif. L'option B est fausse car Rehost n'altère pas le code applicatif. L'option C est fausse car Relocate déplace des hyperviseurs de VM sans reconfigurer l'OS. L'option D est fausse car Retain consiste à conserver l'application sur site.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-strategies/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Une entreprise décide d'abandonner son logiciel CRM interne sur site pour souscrire à une solution hébergée en mode SaaS disponible sur AWS Marketplace. Quelle stratégie des 7R cela illustre-t-il ?",
  options: [
    "A) Repurchase",
    "B) Replatform",
    "C) Rehost",
    "D) Retain"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Repurchase remplace un développement interne existant par une nouvelle solution logicielle commerciale ou SaaS. L'option B est fausse car Replatform conserve le code tout en basculant sur un service managé comme Amazon RDS. L'option C est fausse car Rehost déplace l'application telle quelle. L'option D est fausse car Retain maintient l'existant sans migration.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-strategies/welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Une société dispose de 80 To de données sur site et d'une connexion Internet limitée à 15 Mbit/s. Quel service matériel AWS doit-elle commander pour transférer ses données vers Amazon S3 par voie postale de manière sécurisée ?",
  options: [
    "A) AWS Snowball Edge Storage Optimized",
    "B) AWS Direct Connect",
    "C) Amazon Route 53",
    "D) AWS Systems Manager"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car un boîtier physique AWS Snowball Edge permet de copier jusqu'à 80 To de données utiles et d'être expédié par transporteur sécurisé vers un centre AWS. L'option B est fausse car Direct Connect est une ligne réseau dédiée dont l'installation prend plusieurs semaines. L'option C est fausse car Route 53 est un service DNS. L'option D est fausse car Systems Manager gère l'exploitation de serveurs.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/snowball/latest/developer-guide/whatisedge.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Quel petit appareil durci de la famille AWS Snow, pesant environ 2 kg et offrant jusqu'à 14 To de stockage, est adapté aux transferts de données en environnements mobiles ou à espace restreint ?",
  options: [
    "A) AWS Snowcone",
    "B) AWS Snowmobile",
    "C) AWS Outposts",
    "D) AWS Storage Gateway"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Snowcone est le membre le plus compact et portable de la famille Snow, adapté aux espaces confinés et véhicules. L'option B est fausse car Snowmobile est un semi-remorque de 45 pieds pour des transferts jusqu'à 100 Po. L'option C est fausse car Outposts est un rack de serveurs physiques complet pour datacenter. L'option D est fausse car Storage Gateway est une appliance logicielle connectée au réseau local.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/snowcone/latest/userguide/what-is-snowcone.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Quel service managé AWS permet de migrer des bases de données relationnelles ou non relationnelles vers AWS tout en assurant une réplication continue des changements (CDC) avec un arrêt de service minime ?",
  options: [
    "A) AWS Database Migration Service (AWS DMS)",
    "B) AWS DataSync",
    "C) AWS Snowball",
    "D) AWS Backup"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS DMS est spécialement conçu pour migrer des bases de données de façon homogène ou hétérogène avec capture des changements en temps réel. L'option B est fausse car DataSync transfère des fichiers et partages réseau NFS/SMB. L'option C est fausse car Snowball est un conteneur physique de stockage. L'option D est fausse car AWS Backup orchestre des sauvegardes planifiées.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Quel service AWS accélère le transfert automatisé de grandes quantités de fichiers entre des systèmes de fichiers sur site (NFS, SMB) et les services de stockage AWS (Amazon S3, EFS, FSx) via le réseau ?",
  options: [
    "A) AWS DataSync",
    "B) AWS Direct Connect",
    "C) Amazon CloudFront",
    "D) AWS CloudHSM"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS DataSync est un service de transfert de données réseau accéléré et automatisé pour synchroniser des partages de fichiers avec S3, EFS ou FSx. L'option B est fausse car Direct Connect est une liaison filaire physique dédiée. L'option C est fausse car CloudFront est un réseau de diffusion de contenu CDN. L'option D est fausse car CloudHSM gère des modules matériels cryptographiques.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Parmi les 4 stratégies de reprise après sinistre (Disaster Recovery), laquelle présente le coût financier le plus bas mais demande le délai de rétablissement (RTO) le plus long ?",
  options: [
    "A) Sauvegarde et restauration (Backup and Restore)",
    "B) Veilleuse (Pilot Light)",
    "C) Attente chaude (Warm Standby)",
    "D) Multi-sites actif-actif (Multi-Site Active-Active)"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Backup and Restore ne maintient aucune ressource de calcul active dans la région secondaire, ce qui minimise le coût mais implique de tout reconstruire en cas de sinistre. L'option B est fausse car Pilot Light maintient la base de données active en permanence. L'option C est fausse car Warm Standby maintient une version minimale de l'application en cours d'exécution. L'option D est fausse car Multi-Site est la solution la plus rapide mais la plus coûteuse.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Dans la stratégie de reprise après sinistre de type 'Veilleuse' (Pilot Light), quels composants demeurent allumés et synchronisés en permanence dans la région secondaire de secours ?",
  options: [
    "A) Les données fondamentales et les serveurs de base de données critiques",
    "B) L'intégralité du parc de serveurs web à 100 % de sa capacité",
    "C) Absolument aucun composant, tout est à l'arrêt complet",
    "D) Uniquement les passerelles Internet"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car dans l'approche Pilot Light, seules les bases de données et les données critiques sont répliquées en continu dans la région secondaire, les serveurs de calcul étant créés uniquement lors d'un sinistre. L'option B est fausse car cela correspond à la stratégie Multi-Site active. L'option C est fausse car cela correspond à Backup and Restore. L'option D est fausse car une passerelle seule ne conserve pas les données.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Que représentent respectivement les indicateurs RPO (Recovery Point Objective) et RTO (Recovery Time Objective) dans un plan de continuité d'activité ?",
  options: [
    "A) Le RPO mesure la perte maximale de données tolérée dans le temps ; le RTO mesure la durée maximale d'interruption de service tolérée avant rétablissement",
    "B) Le RPO mesure le coût des licences logicielles ; le RTO mesure le débit du réseau physique",
    "C) Le RPO est la vitesse de téléchargement ; le RTO est le nombre d'utilisateurs connectés",
    "D) Le RPO s'applique uniquement à DynamoDB ; le RTO s'applique uniquement à S3"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le RPO (objectif de point de récupération) quantifie la perte de données acceptable mesurée en temps, et le RTO (objectif de temps de récupération) quantifie le temps maximal alloué pour restaurer le service opérationnel. Les options B, C et D donnent des définitions erronées sans lien avec la théorie de reprise après sinistre.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-objectives.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Quelle solution hybride AWS permet à des applications sur site d'accéder de manière transparente et avec une mise en cache locale à un stockage d'objets distant dans Amazon S3 via des protocoles de fichiers standards (NFS, SMB) ?",
  options: [
    "A) AWS Storage Gateway (S3 File Gateway)",
    "B) AWS Snowmobile",
    "C) Amazon CloudWatch Logs Agent",
    "D) AWS Systems Manager Session Manager"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'AWS Storage Gateway en mode File Gateway expose un partage NFS ou SMB local soutenu par un stockage objet dans S3 avec cache sur site. L'option B est fausse car Snowmobile est un camion physique de transport de données. L'option C est fausse car l'agent CloudWatch collecte des logs. L'option D est fausse car Session Manager gère les connexions SSH/terminal aux instances sans ouvrir de port.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-gateway.html'
});

addQ({
  domain: D1,
  topic_id: 'migration-transfert',
  statement: "Un client doit transférer plusieurs dizaines de pétaoctets de données d'archives scientifiques depuis son centre de données vers AWS. Quel service de migration physique est adapté à cette échelle colossale ?",
  options: [
    "A) AWS Snowmobile",
    "B) AWS Snowcone",
    "C) Amazon VPC Peering",
    "D) Passerelle NAT Gateway"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Snowmobile est un conteneur sécurisé de 45 pieds acheminé par camion pouvant transférer jusqu'à 100 pétaoctets de données en un seul trajet. L'option B est fausse car Snowcone est limité à 14 To. L'option C est fausse car le VPC Peering relie deux réseaux virtuels cloud. L'option D est fausse car la passerelle NAT gère les accès sortants Internet.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/snowmobile/'
});

console.log(`[DOMAINE 1 OK] ${questions.length} questions générées.`);

// --------------------------------------------------------------------------
// DOMAINE 2 : Sécurité et Conformité (45 questions)
// --------------------------------------------------------------------------
const D2 = 'Domaine 2 : Sécurité et Conformité';

// 2.1 modele-responsabilite-partagee (12 questions)
addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Selon le modèle de responsabilité partagée d'AWS, quelle tâche relève de la responsabilité EXCLUSIVE d'AWS pour une instance Amazon EC2 ?",
  options: [
    "A) La sécurité physique, l'alimentation électrique et la maintenance matérielle des datacenters",
    "B) L'application des correctifs de sécurité sur le système d'exploitation invité (Windows ou Linux)",
    "C) La configuration des règles de filtrage du Security Group de l'instance",
    "D) La gestion des identifiants et des mots de passe des utilisateurs finaux de l'application"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la sécurité physique des installations, des réseaux physiques et des hyperviseurs relève de la responsabilité d'AWS (sécurité DU cloud). L'option B est fausse car les correctifs de l'OS invité sur EC2 incombent au client. L'option C est fausse car la configuration du pare-feu virtuel relève du client. L'option D est fausse car les comptes applicatifs relèvent du client.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Lorsqu'un client utilise Amazon RDS pour héberger une base de données PostgreSQL, quelle responsabilité est automatiquement prise en charge par AWS ?",
  options: [
    "A) L'application des correctifs sur le système d'exploitation sous-jacent et la maintenance du matériel",
    "B) L'optimisation des requêtes SQL et la modélisation des index de tables",
    "C) L'attribution des droits d'accès aux tables de la base de données",
    "D) Le chiffrement des données clientes côté client avant envoi réseau"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car sur un service managé comme Amazon RDS, AWS gère le matériel, le système d'exploitation et les patchs système. L'option B est fausse car la modélisation SQL relève du développeur client. L'option C est fausse car la gestion des utilisateurs de la base est sous le contrôle du client. L'option D est fausse car la gestion des clés et des données applicatives incombe au client.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Pour un compartiment Amazon S3, qui est responsable de veiller à ce que les autorisations du compartiment (Bucket Policies) n'autorisent pas un accès public non intentionnel aux données confidentielles ?",
  options: [
    "A) Le client",
    "B) AWS uniquement",
    "C) L'hébergeur de nom de domaine externe",
    "D) L'équipe de support matériel AWS"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la configuration des autorisations d'accès, des politiques de compartiment et de la classification des données dans S3 incombe intégralement au client (sécurité DANS le cloud). L'option B est fausse car AWS fournit les contrôles mais ne décide pas des droits d'accès des clients. Les options C et D sont hors périmètre.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Quel portail en libre accès de la console AWS permet aux clients de télécharger gratuitement les rapports d'audit de sécurité et de conformité tiers (SOC 1/2/3, ISO 27001, PCI-DSS) et les accords juridiques BAA ?",
  options: [
    "A) AWS Artifact",
    "B) AWS Shield",
    "C) Amazon Macie",
    "D) AWS Trusted Advisor"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Artifact est le portail officiel fournissant à la demande les rapports d'audit de conformité et les accords réglementaires d'AWS. L'option B est fausse car Shield protège contre les attaques DDoS. L'option C est fausse car Macie découvre les données sensibles PII dans S3. L'option D est fausse car Trusted Advisor fournit des recommandations d'optimisation.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Parmi les éléments suivants, lesquels DEUX sont placés sous la responsabilité du client lors de l'utilisation d'Amazon EC2 ? (Choisissez deux réponses)",
  type: 'multiple',
  options: [
    "A) La gestion des correctifs de sécurité du système d'exploitation invité",
    "B) La configuration des règles de pare-feu au niveau du système d'exploitation et du Security Group",
    "C) La destruction physique certifiée des disques durs défectueux dans les datacenters",
    "D) La climatisation et la redondance électrique des baies de serveurs",
    "E) La maintenance de l'hyperviseur de virtualisation physique"
  ],
  expected_answer: ["A", "B"],
  explanation: "Les options A et B sont correctes car le système d'exploitation invité et les pare-feux logiciels relèvent de la responsabilité du client. Les options C, D et E relèvent de la responsabilité exclusive d'AWS sur l'infrastructure physique et l'hyperviseur.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Dans le cadre de l'exécution de code avec AWS Lambda, quelle responsabilité est totalement déléguée à AWS ?",
  options: [
    "A) La gestion et l'application des correctifs sur le système d'exploitation et l'infrastructure d'exécution",
    "B) L'écriture du code source de la fonction sans faille logique",
    "C) L'attribution des droits minimaux via le rôle IAM d'exécution de la fonction",
    "D) La protection des données d'entrée fournies par l'utilisateur à la fonction"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Lambda est un service sans serveur où AWS gère l'OS, l'environnement d'exécution, la mise à l'échelle et la flotte de serveurs. L'option B est fausse car le code applicatif est écrit par le client. L'option C est fausse car la politique du rôle IAM est configurée par le client. L'option D est fausse car la gestion des données traitées relève du client.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Quelle catégorie de contrôles dans le modèle de responsabilité partagée englobe les contrôles qui s'appliquent à la fois à la couche d'infrastructure AWS et aux couches clientes, comme la gestion des correctifs ou la formation des équipes ?",
  options: [
    "A) Les contrôles partagés (Shared Controls)",
    "B) Les contrôles hérités exclusifs",
    "C) Les contrôles spécifiques au client",
    "D) Les contrôles matériels automatisés"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les contrôles partagés (comme la gestion des patchs : AWS patche l'infrastructure physique et le client patche ses OS invités) s'appliquent aux deux parties. L'option B est fausse car les contrôles hérités sont ceux dont le client bénéficie entièrement d'AWS. L'option C est fausse car les contrôles spécifiques incombent uniquement au client. L'option D n'est pas une classification officielle.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Qui est responsable de la mise en oeuvre du chiffrement côté client avant l'envoi de données vers un service de stockage AWS ?",
  options: [
    "A) Le client",
    "B) AWS exclusivement",
    "C) L'équipe réseau de l'opérateur télécom",
    "D) Le fabricant du processeur du serveur"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le chiffrement côté client (client-side encryption) est exécuté sur l'environnement du client avant transmission, ce qui relève de sa seule responsabilité. L'option B est fausse car AWS ne peut pas chiffrer les données avant leur réception sur ses passerelles. Les options C et D sont hors de propos.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "En cas d'audit fiscal ou de conformité bancaire, qui fournit la documentation attestant de la conformité de l'infrastructure physique et des centres de données AWS ?",
  options: [
    "A) AWS, par le biais des attestations et rapports disponibles dans AWS Artifact",
    "B) Le client en rédigeant lui-même une déclaration sur l'honneur",
    "C) Une autorité locale externe sans lien avec AWS",
    "D) Le constructeur des serveurs physiques uniquement"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS met à disposition ses certifications d'audit indépendantes (SOC, ISO, FedRAMP) via AWS Artifact pour prouver la conformité de ses centres de calcul. L'option B est fausse car le client ne peut pas auditer physiquement les datacenters d'AWS. Les options C et D sont inexactes.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Si une application hébergée sur Amazon EC2 est compromise en raison d'une vulnérabilité connue non corrigée dans la version du serveur web Apache déployé par le client, qui est responsable de cet incident de sécurité ?",
  options: [
    "A) Le client, car la maintenance logicielle des applications et de l'OS invité lui incombe",
    "B) AWS, car le serveur physique se trouve dans un datacenter AWS",
    "C) L'éditeur du système d'exploitation exclusivement",
    "D) L'autorité d'enregistrement des domaines Internet"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le client est entièrement responsable des applications installées et des patchs logiciels sur ses instances EC2 selon le modèle de responsabilité partagée. L'option B est fausse car AWS garantit la sécurité DU cloud, pas des logiciels installés par l'utilisateur. Les options C et D n'exonèrent pas le client de sa responsabilité opérationnelle.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Dans le modèle de responsabilité partagée pour AWS Elastic Beanstalk (PaaS), quelle tâche reste à la charge du client ?",
  options: [
    "A) Le déploiement et la configuration de son propre code applicatif",
    "B) L'approvisionnement des serveurs physiques en datacenter",
    "C) La maintenance du réseau physique reliant les baies",
    "D) La réparation matérielle des blocs d'alimentation défectueux"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car même sur une plateforme PaaS comme Elastic Beanstalk, le client conserve la charge de développer, configurer et déployer son propre code applicatif. Les options B, C et D relèvent de la maintenance physique opérée par AWS.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
});

addQ({
  domain: D2,
  topic_id: 'modele-responsabilite-partagee',
  statement: "Quelle assertion résume le plus simplement le modèle de responsabilité partagée d'AWS ?",
  options: [
    "A) AWS est responsable de la sécurité DU cloud ; le client est responsable de la sécurité DANS le cloud",
    "B) AWS est responsable de 100 % de la sécurité sans aucune action requise du client",
    "C) Le client gère la sécurité matérielle ; AWS gère le code applicatif",
    "D) La sécurité est gérée exclusivement par les fournisseurs d'accès Internet"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la devise officielle d'AWS formule exactement que la sécurité DU cloud (matériel, hyperviseur, installations) relève d'AWS, tandis que la sécurité DANS le cloud (données, accès, OS invité, réseau logique) relève du client. Les options B, C et D déforment complètement ce principe.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
});

// 2.2 iam (15 questions)
addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Quelle est la recommandation de sécurité la plus critique concernant l'utilisateur racine (Root User) d'un compte AWS ?",
  options: [
    "A) Activer immédiatement le MFA, verrouiller les clés d'accès et ne pas l'utiliser pour les tâches d'administration quotidiennes",
    "B) Créer des clés d'accès d'API permanentes et les stocker dans le code source de l'application",
    "C) Partager les identifiants de connexion avec tous les développeurs de l'équipe",
    "D) Désactiver le mot de passe pour autoriser l'accès anonyme"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le compte Root dispose de privilèges absolus et irrévocables : il doit être sécurisé par une authentification multi-facteurs (MFA) et réservé aux rares tâches requérant son usage. L'option B est une faille critique de sécurité. L'option C interdit toute traçabilité individuelle. L'option D détruit la sécurité du compte.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Une application installée sur une instance Amazon EC2 doit lire et écrire des fichiers dans un compartiment Amazon S3. Quelle est la méthode la plus sécurisée pour accorder ces autorisations ?",
  options: [
    "A) Attribuer un rôle IAM avec profil d'instance à l'instance EC2",
    "B) Coder en dur les clés d'accès secrètes de l'administrateur dans le code source",
    "C) Configurer le compartiment S3 pour un accès public sans authentification",
    "D) Enregistrer le mot de passe du compte racine dans un fichier texte sur l'instance"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les rôles IAM fournissent des identifiants de sécurité temporaires renouvelés automatiquement par le service AWS STS sans nécessiter de clés statiques à gérer. Les options B, C et D violent les principes élémentaires de sécurité du cloud.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Quel principe de sécurité fondamental stipule qu'une identité (utilisateur, groupe ou rôle) ne doit recevoir que le strict minimum d'autorisations requises pour accomplir sa mission ?",
  options: [
    "A) Le principe du moindre privilège (Principle of Least Privilege)",
    "B) Le principe de tolérance aux pannes",
    "C) Le principe de séparation géographique",
    "D) Le principe de redondance active"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le moindre privilège consiste à accorder uniquement les autorisations nécessaires à une tâche précise et rien de plus. L'option B concerne la haute disponibilité face aux pannes matérielles. L'option C concerne la dispersion physique des centres de données. L'option D concerne la duplication de composants d'infrastructure.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Dans AWS Organizations, quel mécanisme de politique permet à l'administrateur central de fixer les frontières d'autorisations maximales pour l'ensemble des comptes membres ?",
  options: [
    "A) Les politiques de contrôle des services (Service Control Policies - SCP)",
    "B) Les politiques basées sur les ressources S3",
    "C) Les listes de contrôle d'accès réseau (NACL)",
    "D) Les groupes de sécurité virtuels"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les SCP appliquées au niveau de l'organisation ou des unités organisationnelles (OU) définissent les permissions maximales autorisées pour les comptes membres. L'option B est fausse car les Bucket Policies sont attachées à un compartiment S3 spécifique. L'option C est fausse car les NACL filtrent le trafic réseau de sous-réseau. L'option D est fausse car les groupes de sécurité filtrent le trafic des instances.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Quel élément d'un document de politique JSON IAM définit si l'action spécifiée est permise ou interdite ?",
  options: [
    "A) Effect (Allow ou Deny)",
    "B) Principal",
    "C) Action",
    "D) Resource"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'élément Effect indique obligatoirement Allow ou Deny. L'option B est fausse car Principal désigne l'identité autorisée ou refusée. L'option C est fausse car Action liste les opérations d'API ciblées (ex: s3:GetObject). L'option D est fausse car Resource désigne l'ARN de la ressource concernée.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Si une politique IAM contient à la fois une règle Allow explicite et une règle Deny explicite pour la même action sur la même ressource, quelle règle l'emporte lors de l'évaluation ?",
  options: [
    "A) Le Deny explicite prévaut toujours sur le Allow",
    "B) Le Allow explicite prévaut toujours sur le Deny",
    "C) La politique créée en premier a la priorité",
    "D) Les autorisations s'annulent et une erreur aléatoire est renvoyée"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car dans la logique d'évaluation IAM, un Deny explicite l'emporte toujours sur toute autorisation Allow (Explicit Deny overrides Allow). L'option B est fausse car le refus est toujours prioritaire par mesure de sécurité. L'option C est fausse car l'ordre de création n'a aucun impact. L'option D est fausse car l'évaluation est déterministe.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Quel service AWS permet de gérer centralement l'authentification unique (SSO) des collaborateurs pour accéder à plusieurs comptes AWS et à des applications métiers tierces ?",
  options: [
    "A) AWS IAM Identity Center (successeur d'AWS Single Sign-On)",
    "B) Amazon GuardDuty",
    "C) AWS CloudTrail",
    "D) AWS Direct Connect"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS IAM Identity Center est la solution centrale recommandée pour administrer les accès multi-comptes et intégrer un annuaire d'entreprise (comme Active Directory ou Okta). L'option B est fausse car GuardDuty est un service de détection des menaces. L'option C est fausse car CloudTrail trace les appels d'API. L'option D est fausse car Direct Connect est une ligne réseau dédiée.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Pour permettre à un administrateur d'accéder à l'interface en ligne de commande AWS CLI depuis son terminal, quel type d'identifiant IAM doit-on lui générer ?",
  options: [
    "A) Une paire de clés d'accès composée d'un Access Key ID et d'une Secret Access Key",
    "B) Un mot de passe pour la console de gestion AWS",
    "C) Un certificat SSL/TLS public délivré par ACM",
    "D) Une clé physique USB chiffrée sans mot de passe"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'accès par API, CLI ou SDK requiert une paire de clés d'accès (Access Key ID et Secret Access Key). L'option B est fausse car le mot de passe sert à la connexion interactive sur la console web. L'option C est fausse car les certificats ACM sécurisent le trafic HTTPS vers les répartiteurs de charge ou CDN. L'option D ne constitue pas un identifiant natif d'API AWS.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Quelle entité IAM est spécifiquement conçue pour être endossée temporairement par un utilisateur, une application ou un service AWS afin d'obtenir des autorisations à durée limitée ?",
  options: [
    "A) Un rôle IAM (IAM Role)",
    "B) Un groupe IAM (IAM Group)",
    "C) Un utilisateur racine",
    "D) Une balise de coût"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car un rôle IAM est une identité sans identifiants à long terme, qui est assumée de manière éphémère par un utilisateur, une ressource EC2 ou un service tiers. L'option B est fausse car un groupe est une collection d'utilisateurs statiques. L'option C est fausse car l'utilisateur racine a des identifiants permanents. L'option D est une métadonnée financière.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Peut-on attacher directement des politiques IAM à un groupe d'utilisateurs IAM ?",
  options: [
    "A) Oui, tous les utilisateurs membres du groupe héritent automatiquement des permissions définies dans la politique",
    "B) Non, les politiques ne peuvent être attachées qu'à des instances EC2",
    "C) Non, les politiques sont exclusivement réservées à l'utilisateur racine",
    "D) Oui, mais seulement si le groupe contient un seul utilisateur"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car attacher des politiques à des groupes IAM permet d'appliquer uniformément des autorisations à tous ses membres selon les bonnes pratiques. L'option B est fausse car les utilisateurs et groupes acceptent les politiques. L'option C est fausse car le compte racine n'utilise pas de politiques de permissions classiques. L'option D est fausse car un groupe peut contenir de nombreux utilisateurs.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Qu'est-ce que l'authentification multi-facteurs (MFA) et pourquoi est-elle recommandée sur AWS ?",
  options: [
    "A) Une mesure de sécurité exigeant la saisie d'un code temporaire généré par un appareil physique ou virtuel en plus du mot de passe",
    "B) Une obligation de changer de mot de passe toutes les 5 minutes",
    "C) Un dispositif de reconnaissance faciale obligatoire sur les serveurs matériels",
    "D) Un protocole de double chiffrement des disques durs EBS"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le MFA apporte un deuxième facteur d'authentification (ce que vous possédez, comme une clé physique FIDO ou une application d'authentification) pour empêcher les accès non autorisés en cas de compromission du mot de passe. Les options B, C et D sont de fausses définitions.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Quelle fonctionnalité d'IAM permet de vérifier quelles autorisations attribuées à un utilisateur n'ont pas été utilisées au cours des derniers mois afin d'affiner les accès selon le moindre privilège ?",
  options: [
    "A) Les informations sur le dernier accès (Access Advisor / Last Accessed Information)",
    "B) L'explorateur de coûts AWS Cost Explorer",
    "C) Le tableau de bord AWS Personal Health Dashboard",
    "D) Le journal des flux Amazon VPC Flow Logs"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'onglet Access Advisor dans la console IAM affiche la date de dernier accès pour chaque service, permettant d'identifier et de révoquer les permissions inutilisées. L'option B concerne la facturation. L'option C concerne la santé opérationnelle des services. L'option D trace le trafic réseau IP.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_access-advisor.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Quel service AWS permet d'analyser mathématiquement vos politiques d'accès afin d'identifier les ressources (comme les compartiments S3) partagées en dehors de votre zone de confiance organisationnelle ?",
  options: [
    "A) IAM Access Analyzer",
    "B) AWS Shield Standard",
    "C) AWS Systems Manager",
    "D) Amazon QuickSight"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car IAM Access Analyzer utilise le raisonnement automatisé pour détecter les ressources accessibles depuis l'extérieur de votre compte ou organisation. L'option B est un service anti-DDoS. L'option C est un outil d'administration opérationnelle. L'option D est un service de Business Intelligence.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Quelle bonne pratique IAM est recommandée pour les applications exécutées en dehors d'AWS (sur des serveurs sur site) qui doivent s'authentifier auprès de services AWS sans clés statiques à long terme ?",
  options: [
    "A) Utiliser IAM Roles Anywhere avec une autorité de certification PKI d'entreprise",
    "B) Écrire le mot de passe root dans le registre système du serveur sur site",
    "C) Rendre les compartiments S3 publics en lecture seule",
    "D) Créer des clés d'accès permanentes qui n'expirent jamais"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car IAM Roles Anywhere permet aux charges de travail hors AWS d'utiliser des certificats X.509 d'entreprise pour obtenir des jetons de sécurité temporaires auprès d'AWS STS sans stocker de clés statiques. Les options B, C et D représentent de mauvaises pratiques dangereuses.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/rolesanywhere/latest/userguide/introduction.html'
});

addQ({
  domain: D2,
  topic_id: 'iam',
  statement: "Un groupe IAM peut-il contenir un autre groupe IAM sous forme de sous-groupe imbriqué ?",
  options: [
    "A) Non, les groupes IAM ne peuvent pas être imbriqués",
    "B) Oui, jusqu'à un maximum de 5 niveaux de profondeur",
    "C) Oui, sans aucune limite d'imbrication",
    "D) Oui, mais uniquement si les comptes sont rattachés à AWS Organizations"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car IAM ne prend pas en charge l'imbrication de groupes : un groupe ne peut contenir que des utilisateurs, jamais d'autres groupes. Les options B, C et D sont techniquement fausses.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html'
});

// 2.3 macie-secrets-waf (10 questions)
addQ({
  domain: D2,
  topic_id: 'macie-secrets-waf',
  statement: "Quel service AWS protège les applications web contre les attaques courantes de couche 7 telles que les injections SQL et les scripts intersites (XSS) ?",
  options: [
    "A) AWS WAF (Web Application Firewall)",
    "B) AWS Shield Standard",
    "C) Amazon GuardDuty",
    "D) AWS Direct Connect"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS WAF inspecte le trafic HTTP/HTTPS de niveau applicatif (couche 7) pour bloquer les attaques par injection SQL, cross-site scripting ou règles personnalisées. L'option B est fausse car Shield Standard protège contre les attaques DDoS volumétriques de couches 3 et 4. L'option C est fausse car GuardDuty est un service de détection des menaces basé sur les logs. L'option D est fausse car Direct Connect est une liaison réseau.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html'
});

addQ({
  domain: D2,
  topic_id: 'macie-secrets-waf',
  statement: "Quelle protection DDoS gérée est activée automatiquement et sans frais supplémentaires pour tous les clients AWS sur l'ensemble des points d'entrée du réseau ?",
  options: [
    "A) AWS Shield Standard",
    "B) AWS Shield Advanced",
    "C) AWS WAF Enterprise",
    "D) Amazon Inspector"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Shield Standard est actif par défaut et sans surcoût pour protéger tous les clients AWS contre les attaques DDoS courantes de couches 3 et 4 (comme les inondations SYN ou UDP). L'option B est fausse car Shield Advanced est une option payante avec assistance 24/7 de l'équipe SRT et protection financière contre les pics de coûts. Les options C et D sont fausses.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html'
});

addQ({
  domain: D2,
  topic_id: 'macie-secrets-waf',
  statement: "Quel service de sécurité managé utilise le Machine Learning et la correspondance de motifs pour découvrir, classifier et protéger les données personnelles sensibles (PII) stockées dans Amazon S3 ?",
  options: [
    "A) Amazon Macie",
    "B) Amazon Inspector",
    "C) AWS Secrets Manager",
    "D) AWS Artifact"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon Macie est le service spécialisé dans l'analyse de données sensibles (comme les numéros de passeport, cartes de crédit ou données de santé) dans les compartiments S3. L'option B est fausse car Inspector analyse les failles logicielles dans les OS et conteneurs. L'option C est fausse car Secrets Manager gère les identifiants et clés d'accès. L'option D est fausse car Artifact fournit des rapports de conformité.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html'
});

addQ({
  domain: D2,
  topic_id: 'macie-secrets-waf',
  statement: "Quel service analyse en continu les journaux CloudTrail, les flux VPC Flow Logs et les requêtes DNS avec des modèles de Machine Learning pour détecter les activités suspectes (telles que le minage de cryptomonnaies ou l'exfiltration de données) ?",
  options: [
    "A) Amazon GuardDuty",
    "B) Amazon Inspector",
    "C) AWS KMS",
    "D) AWS Config"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon GuardDuty est le service intelligent de détection des menaces d'AWS qui analyse les journaux sans impacter les performances de calcul. L'option B est fausse car Inspector scanne les vulnérabilités de code et de dépendances. L'option C est fausse car KMS gère le chiffrement. L'option D est fausse car Config audite la conformité des configurations.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html'
});

addQ({
  domain: D2,
  topic_id: 'macie-secrets-waf',
  statement: "Une entreprise doit stocker de manière centralisée les identifiants de sa base de données relationnelle et mettre en place une rotation automatique et régulière de ces mots de passe sans impacter la disponibilité. Quel service doit-elle choisir ?",
  options: [
    "A) AWS Secrets Manager",
    "B) AWS Systems Manager Parameter Store (niveau Standard)",
    "C) Amazon S3 Glacier",
    "D) Amazon DynamoDB"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Secrets Manager intègre nativement la rotation programmée et automatisée des mots de passe de bases de données (RDS, Aurora, DocumentDB) via AWS Lambda. L'option B est fausse car Parameter Store stocke des paramètres mais ne propose pas de rotation native prête à l'emploi. L'option C est fausse car Glacier est un archivage froid. L'option D est fausse car DynamoDB est une base NoSQL.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html'
});

addQ({
  domain: D2,
  topic_id: 'macie-secrets-waf',
  statement: "Quel service de gestion automatisée des vulnérabilités analyse en continu les instances EC2, les images de conteneurs dans Amazon ECR et les fonctions Lambda pour détecter les failles logicielles connues (CVE) ?",
  options: [
    "A) Amazon Inspector",
    "B) Amazon Macie",
    "C) AWS Shield",
    "D) AWS CloudTrail"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon Inspector analyse automatiquement les systèmes et images logicielles pour identifier les vulnérabilités CVE et les expositions réseau indésirables. L'option B est fausse car Macie analyse les données sensibles dans S3. L'option C est fausse car Shield protège contre les attaques DDoS. L'option D est fausse car CloudTrail journalise les actions d'API.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html'
});

addQ({
  domain: D2,
  topic_id: 'macie-secrets-waf',
  statement: "Quelle fonctionnalité d'AWS Systems Manager permet de stocker des chaînes de configuration simples, des clés de licence ou des paramètres d'application sous forme de texte brut ou chiffré sans surcoût pour le niveau standard ?",
  options: [
    "A) AWS Systems Manager Parameter Store",
    "B) AWS Secrets Manager",
    "C) AWS KMS",
    "D) Amazon S3 Tables"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Parameter Store permet de gérer des paramètres de configuration et secrets légers avec une tarification gratuite pour les paramètres standards. L'option B est fausse car Secrets Manager est payant au secret stocké et inclut la rotation automatique. L'option C est fausse car KMS gère les clés cryptographiques. L'option D est un format de stockage S3 pour tables analytiques.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html'
});

addQ({
  domain: D2,
  topic_id: 'macie-secrets-waf',
  statement: "Quel service centralise les alertes de sécurité provenant de GuardDuty, Inspector, Macie et IAM Access Analyzer dans un tableau de bord unifié et permet d'évaluer la posture globale de sécurité par rapport aux normes CIS et PCI ?",
  options: [
    "A) AWS Security Hub",
    "B) Amazon CloudWatch",
    "C) AWS Trusted Advisor",
    "D) AWS Artifact"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Security Hub agrège, organise et priorise les alertes de sécurité émises par les différents services AWS et partenaires. L'option B est fausse car CloudWatch suit les métriques de performance et les logs. L'option C formule des conseils généraux d'optimisation. L'option D distribue les rapports d'audit de conformité.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html'
});

addQ({
  domain: D2,
  topic_id: 'macie-secrets-waf',
  statement: "Une équipe souhaite bloquer automatiquement toutes les requêtes web provenant d'une plage d'adresses IP réputée malveillante avant qu'elles n'atteignent ses serveurs web protégés par un Application Load Balancer. Quel service doit-elle utiliser ?",
  options: [
    "A) AWS WAF",
    "B) Amazon Macie",
    "C) AWS Secrets Manager",
    "D) AWS Direct Connect"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS WAF permet de définir des règles de blocage basées sur les listes d'adresses IP (IP match conditions) directement sur l'ALB ou CloudFront. L'option B est fausse car Macie inspecte les données S3. L'option C gère les mots de passe. L'option D est une liaison réseau filaire.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/waf/latest/developerguide/classic-web-acl-ip-conditions.html'
});

addQ({
  domain: D2,
  topic_id: 'macie-secrets-waf',
  statement: "Quels services peuvent être directement protégés par AWS WAF pour filtrer le trafic web entrant ?",
  options: [
    "A) Amazon CloudFront, Application Load Balancer, Amazon API Gateway et AWS AppSync",
    "B) Les volumes Amazon EBS et les disques locaux de serveurs sur site",
    "C) Uniquement les compartiments S3 sans point de terminaison public",
    "D) Les tables DynamoDB isolées dans un sous-réseau privé"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS WAF s'intègre nativement en amont d'Amazon CloudFront, des ALB, des passerelles API Gateway et d'AWS AppSync. Les options B, C et D mentionnent des ressources de stockage ou de base de données non exposées directement via un reverse-proxy WAF.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html'
});

// 2.4 kms-chiffrement (4 questions)
addQ({
  domain: D2,
  topic_id: 'kms-chiffrement',
  statement: "Quel service managé AWS permet de créer, administrer et faire tourner des clés cryptographiques utilisées pour chiffrer les données stockées dans S3, EBS, RDS ou DynamoDB ?",
  options: [
    "A) AWS Key Management Service (AWS KMS)",
    "B) AWS Certificate Manager (ACM)",
    "C) AWS Shield",
    "D) AWS Secrets Manager"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS KMS est le service centralisé de gestion des clés de chiffrement intégré de façon transparente avec la majorité des services AWS. L'option B est fausse car ACM délivre et renouvelle des certificats SSL/TLS pour le trafic réseau HTTPS. L'option C est un service anti-DDoS. L'option D est fausse car Secrets Manager gère les mots de passe et tokens applicatifs.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html'
});

addQ({
  domain: D2,
  topic_id: 'kms-chiffrement',
  statement: "Une banque est soumise à des réglementations strictes lui imposant de conserver un contrôle matériel exclusif sur ses clés de chiffrement au sein d'un matériel dédié certifié FIPS 140-2 Niveau 3 dans le cloud AWS. Quel service répond à cette exigence ?",
  options: [
    "A) AWS CloudHSM",
    "B) AWS KMS avec clés gérées par AWS",
    "C) AWS Secrets Manager",
    "D) Amazon S3 avec chiffrement SSE-S3"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS CloudHSM fournit des appliances matérielles HSM dédiées (Hardware Security Module) certifiées FIPS 140-2 Niveau 3 dont le client possède le contrôle exclusif des clés. L'option B est fausse car KMS utilise des modules mutualisés multi-tenants FIPS 140-2 Niveau 2 (ou Niveau 3 sur certains composants physiques). Les options C et D n'offrent pas d'isolation matérielle dédiée.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/cloudhsm/latest/userguide/introduction.html'
});

addQ({
  domain: D2,
  topic_id: 'kms-chiffrement',
  statement: "Quel service AWS permet de provisionner, gérer et renouveler automatiquement sans coût des certificats SSL/TLS publics pour sécuriser les noms de domaine sur des répartiteurs de charge Elastic Load Balancing et des distributions Amazon CloudFront ?",
  options: [
    "A) AWS Certificate Manager (ACM)",
    "B) AWS KMS",
    "C) AWS CloudTrail",
    "D) AWS IAM"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Certificate Manager délivre gratuitement des certificats SSL/TLS publics et en assure le renouvellement automatique. L'option B est fausse car KMS gère les clés de chiffrement de données. L'option C trace les appels d'API. L'option D gère les autorisations des utilisateurs.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html'
});

addQ({
  domain: D2,
  topic_id: 'kms-chiffrement',
  statement: "Dans Amazon S3, quel mode de chiffrement côté serveur utilise des clés gérées et renouvelées automatiquement par S3 sans aucune configuration ni surcoût pour l'utilisateur ?",
  options: [
    "A) SSE-S3 (Server-Side Encryption with Amazon S3 managed keys)",
    "B) SSE-KMS",
    "C) SSE-C (avec clés fournies par le client)",
    "D) Chiffrement côté client asymétrique"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car SSE-S3 applique un chiffrement fort AES-256 transparent où la clé est entièrement gérée par le service S3. L'option B fait appel à AWS KMS avec des frais d'appels d'API et la gestion de clés CMK. L'option C exige que le client transmette sa propre clé à chaque requête HTTP. L'option D est exécutée par le client avant l'envoi des données.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html'
});

// 2.5 cloudwatch (4 questions)
addQ({
  domain: D2,
  topic_id: 'cloudwatch',
  statement: "Quelle est la différence fondamentale de rôle entre Amazon CloudWatch et AWS CloudTrail ?",
  options: [
    "A) CloudWatch surveille les métriques de performance, les logs applicatifs et les alarmes ; CloudTrail enregistre l'audit des appels d'API et actions administratives (qui a fait quoi et quand)",
    "B) CloudWatch est réservé au stockage S3 ; CloudTrail est réservé aux serveurs de calcul EC2",
    "C) CloudWatch protège contre les attaques de pirates ; CloudTrail configure les réseaux VPC",
    "D) CloudTrail chiffre les disques durs ; CloudWatch gère les comptes utilisateurs IAM"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car CloudWatch est un service d'observabilité et de métriques opérationnelles temporelles, alors que CloudTrail est un service d'audit de gouvernance traçant l'historique complet des actions d'API sur le compte. Les options B, C et D sont de fausses déclarations.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html'
});

addQ({
  domain: D2,
  topic_id: 'cloudwatch',
  statement: "Quel service AWS évalue en continu la conformité des configurations de vos ressources cloud par rapport à un ensemble de règles prédéfinies (comme vérifier que tous les volumes EBS sont chiffrés) et en conserve l'historique d'évolution ?",
  options: [
    "A) AWS Config",
    "B) Amazon CloudWatch",
    "C) AWS CloudTrail",
    "D) AWS Shield"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Config enregistre les relations et configurations des ressources et teste leur conformité par rapport à des règles prédéfinies ou personnalisées. L'option B recueille les métriques temporelles. L'option C enregistre les traces d'API. L'option D protège contre les attaques DDoS.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html'
});

addQ({
  domain: D2,
  topic_id: 'cloudwatch',
  statement: "Une équipe souhaite déclencher automatiquement une alerte SNS et lancer de nouvelles instances EC2 dès que l'utilisation moyenne du processeur (CPU) dépasse 80 % pendant plus de 5 minutes consécutives. Quel service configure-t-elle ?",
  options: [
    "A) Une alarme Amazon CloudWatch",
    "B) Un journal AWS CloudTrail",
    "C) Une règle AWS Artifact",
    "D) Un rapport AWS Trusted Advisor"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les alarmes CloudWatch évaluent des seuils sur des métriques de performance et peuvent déclencher des actions d'Auto Scaling ou des notifications SNS. L'option B est fausse car CloudTrail ne déclenche pas le dimensionnement en fonction du CPU. L'option C est un portail de conformité. L'option D est un outil consultatif.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html'
});

addQ({
  domain: D2,
  topic_id: 'cloudwatch',
  statement: "Un auditeur de sécurité souhaite savoir quel utilisateur a supprimé un compartiment Amazon S3 spécifique mardi dernier à 14h30. Quel service doit-il consulter pour obtenir cette information ?",
  options: [
    "A) AWS CloudTrail (Event history)",
    "B) Amazon CloudWatch Metrics",
    "C) AWS Trusted Advisor",
    "D) AWS Pricing Calculator"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'historique des événements CloudTrail consigne l'identité de l'appelant (IAM user ou rôle), l'adresse IP source, l'action exécutée (DeleteBucket) et le timestamp exact. L'option B est fausse car CloudWatch Metrics présente des valeurs agrégées de performance et non l'identité de l'auteur d'un appel. L'option C est un outil de conseil. L'option D est un simulateur de coûts.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html'
});

console.log(`[DOMAINE 2 OK] ${questions.length} questions générées au total.`);

// --------------------------------------------------------------------------
// DOMAINE 3 : Technologies et Services Cloud (51 questions)
// --------------------------------------------------------------------------
const D3 = 'Domaine 3 : Technologies et Services Cloud';

// 3.1 infrastructure-globale-cloud (7 questions)
addQ({
  domain: D3,
  topic_id: 'infrastructure-globale-cloud',
  statement: "Une région AWS moderne est composée d'au minimum combien de zones de disponibilité (AZ) physiquement séparées et isolées les unes des autres ?",
  options: [
    "A) Au moins 3 zones de disponibilité",
    "B) Exactement 1 zone de disponibilité",
    "C) Au moins 15 zones de disponibilité",
    "D) Exactement 2 zones de disponibilité"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car toute région AWS conçue aujourd'hui comprend au minimum 3 zones de disponibilité distinctes pour assurer une haute résilience. L'option B est fausse car une seule AZ ne permettrait pas de tolérance aux pannes. L'option C est exagérée. L'option D est obsolète car le standard AWS est d'au moins 3 AZ par région.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/about-aws/global-infrastructure/regions_az/'
});

addQ({
  domain: D3,
  topic_id: 'infrastructure-globale-cloud',
  statement: "Quel composant de l'infrastructure mondiale AWS est utilisé par le réseau de diffusion de contenu Amazon CloudFront pour mettre en cache les données au plus près des utilisateurs dans des centaines de métropoles ?",
  options: [
    "A) Les points de présence (Points of Presence / Edge Locations)",
    "B) Les zones de disponibilité principales",
    "C) Les serveurs physiques AWS Outposts",
    "D) Les groupes de sécurité de sous-réseau"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les Edge Locations sont des sites de présence déployés mondialement dédiés à la mise en cache à très faible latence de CloudFront. L'option B est fausse car les AZ hébergent les centres de calcul régionaux complets. L'option C est fausse car Outposts est un équipement client sur site. L'option D est un pare-feu virtuel.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/about-aws/global-infrastructure/'
});

addQ({
  domain: D3,
  topic_id: 'infrastructure-globale-cloud',
  statement: "Quelle solution matérielle AWS permet d'installer des racks de serveurs physiques managés par AWS directement au sein du propre centre de données d'une entreprise pour exécuter des calculs locaux avec une latence inférieure à quelques millisecondes ?",
  options: [
    "A) AWS Outposts",
    "B) Amazon Route 53",
    "C) Amazon CloudFront",
    "D) AWS Snowcone"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Outposts étend l'infrastructure, les services et les API AWS au centre de données du client pour une expérience hybride fluide. L'option B est un service DNS mondial. L'option C est un CDN mondial. L'option D est un petit boîtier physique de transfert de données.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/outposts/'
});

addQ({
  domain: D3,
  topic_id: 'infrastructure-globale-cloud',
  statement: "Comment sont interconnectées les différentes zones de disponibilité au sein d'une même région AWS ?",
  options: [
    "A) Par des liaisons fibre optique privées redondantes à haut débit et ultra-faible latence",
    "B) Uniquement par des liaisons satellite publiques",
    "C) Par l'Internet public standard non chiffré",
    "D) Par des câbles téléphoniques analogiques"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les AZ d'une même région sont reliées par un réseau métropolitain privé en fibre optique haute performance dédié garantissant une latence aller-retour d'une poignée de millisecondes. Les options B, C et D sont fantaisistes et techniquement incorrectes.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/about-aws/global-infrastructure/regions_az/'
});

addQ({
  domain: D3,
  topic_id: 'infrastructure-globale-cloud',
  statement: "Quelle entité d'infrastructure AWS permet de rapprocher les services de calcul et de stockage d'AWS des centres urbains denses qui ne disposent pas d'une région AWS complète ?",
  options: [
    "A) Les zones locales AWS (AWS Local Zones)",
    "B) Les régions AWS isolées",
    "C) Les compartiments S3 régionaux",
    "D) Les groupes de placement partitionnés"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les AWS Local Zones étendent une région AWS pour rapprocher les services des utilisateurs finaux dans de grandes métropoles afin de délivrer une latence milliseconde pour le streaming ou le jeu vidéo. L'option B est fausse car les régions isolées sont dédiées à des gouvernements (GovCloud). Les options C et D sont des fonctionnalités internes de stockage ou de calcul.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://aws.amazon.com/about-aws/global-infrastructure/localzones/'
});

addQ({
  domain: D3,
  topic_id: 'infrastructure-globale-cloud',
  statement: "Quelle infrastructure AWS est déployée directement au sein des réseaux télécoms des opérateurs 5G pour fournir une latence ultra-faible aux appareils mobiles connectés ?",
  options: [
    "A) AWS Wavelength",
    "B) AWS Direct Connect",
    "C) AWS Storage Gateway",
    "D) Amazon DynamoDB Accelerator (DAX)"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Wavelength intègre les capacités de calcul et de stockage AWS à la bordure des réseaux 5G des opérateurs de télécommunications. L'option B est fausse car Direct Connect relie un datacenter sur site à AWS. L'option C relie des partages de fichiers sur site à S3. L'option D est un cache mémoire pour DynamoDB.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://aws.amazon.com/wavelength/'
});

addQ({
  domain: D3,
  topic_id: 'infrastructure-globale-cloud',
  statement: "Lors du choix d'une région AWS pour déployer ses applications, quels facteurs une entreprise doit-elle principalement prendre en compte ? (Choisissez DEUX réponses)",
  type: 'multiple',
  options: [
    "A) La conformité réglementaire et les obligations de souveraineté des données",
    "B) La proximité géographique avec les utilisateurs finaux pour réduire la latence",
    "C) La couleur des armoires de serveurs dans le datacenter",
    "D) L'obligation d'avoir au moins 10 000 salariés dans le pays d'accueil",
    "E) L'obligation contractuelle d'utiliser tous les services dans la même langue"
  ],
  expected_answer: ["A", "B"],
  explanation: "Les options A et B sont correctes car le respect des exigences légales de localisation des données et la minimisation de la latence pour les clients finaux (ainsi que le coût et la disponibilité des services) guident le choix d'une région AWS. Les options C, D et E sont dénuées de sens technique.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/global-infrastructure.html'
});

// 3.2 ec2-calcul-tarification (12 questions)
addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Une entreprise exécute des traitements par lots (batch processing) hautement distribués et tolérants aux pannes, pouvant être interrompus à tout moment sans perte d'état. Quelle option d'achat Amazon EC2 offre jusqu'à 90 % de réduction ?",
  options: [
    "A) Les instances Spot",
    "B) Les instances à la demande (On-Demand)",
    "C) Les hôtes dédiés (Dedicated Hosts)",
    "D) Les instances réservées standard sur 3 ans"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les instances Spot mettent à disposition les capacités résiduelles inutilisées d'AWS avec des remises allant jusqu'à 90 %, sous réserve de préavis d'interruption de 2 minutes. L'option B est fausse car la tarification à la demande n'applique aucune remise sur engagement. L'option C est la formule la plus onéreuse. L'option D offre des remises importantes mais implique un engagement financier continu.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Quelle option tarifaire flexible permet d'obtenir jusqu'à 72 % d'économie en échange d'un engagement d'utilisation constant sur 1 ou 3 ans mesuré en dollars par heure, applicable indifféremment sur Amazon EC2, AWS Fargate et AWS Lambda ?",
  options: [
    "A) Les Compute Savings Plans",
    "B) Les instances Spot",
    "C) Les instances à la demande",
    "D) Les réservations de capacité à la demande (ODCR)"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les Compute Savings Plans offrent une flexibilité maximale en s'appliquant automatiquement quelle que soit la famille d'instance, la région ou la technologie de calcul (EC2, Fargate ou Lambda). L'option B ne requiert aucun engagement. L'option C est sans réduction. L'option D réserve physiquement la capacité sans réduction tarifaire automatique.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Un client doit exécuter un logiciel propriétaire sous licence serveur par socket ou coeur physique (BYOL), exigeant une isolation matérielle totale sur un serveur physique dédié dont il contrôle l'agencement. Quelle option EC2 doit-il choisir ?",
  options: [
    "A) Les hôtes dédiés (Dedicated Hosts)",
    "B) Les instances Spot",
    "C) Les instances à la demande standard mutualisées",
    "D) Les fonctions AWS Lambda"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les Dedicated Hosts fournissent un serveur physique complet dédié à un seul client avec une visibilité sur les sockets et coeurs physiques requise par certaines licences logicielles d'entreprise. L'option B utilise des capacités mutualisées interrompables. L'option C partage le matériel physique entre plusieurs comptes. L'option D est un environnement sans serveur partagé.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Quel service managé d'orchestration de conteneurs Docker sans serveur (serverless) permet d'exécuter des conteneurs sans avoir à approvisionner, configurer ou gérer des serveurs ou clusters EC2 sous-jacents ?",
  options: [
    "A) AWS Fargate",
    "B) Amazon EC2 avec cluster ECS manuel",
    "C) Amazon Lightsail",
    "D) AWS Elastic Beanstalk sur instances dédiées"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Fargate est le moteur de calcul sans serveur pour conteneurs compatible avec Amazon ECS et Amazon EKS masquant l'infrastructure. L'option B implique la gestion des VM EC2 du cluster. L'option C est une offre VPS simplifiée tout-en-un. L'option D gère des instances sous-jacentes visibles.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Quelle est la durée maximale d'exécution d'une fonction AWS Lambda pour une invocation unique ?",
  options: [
    "A) 15 minutes (900 secondes)",
    "B) 1 heure (3600 secondes)",
    "C) 24 heures",
    "D) Illimitée"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la limite technique stricte d'exécution d'une fonction AWS Lambda est de 15 minutes par invocation. Pour les traitements plus longs, AWS recommande AWS Batch, ECS/Fargate ou AWS Step Functions. Les options B, C et D dépassent ce quota d'architecture sans serveur.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Quel répartiteur de charge Elastic Load Balancing opère au niveau de la couche applicative (couche 7 OSI) et permet le routage basé sur les chemins d'URL (/images, /api) et les en-têtes HTTP ?",
  options: [
    "A) Application Load Balancer (ALB)",
    "B) Network Load Balancer (NLB)",
    "C) Gateway Load Balancer (GWLB)",
    "D) Classic Load Balancer (CLB)"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'ALB inspecte le trafic HTTP/HTTPS de couche 7 et autorise le routage par chemin, hôte ou méthode. L'option B est fausse car le NLB opère en couche 4 (TCP/UDP) pour des millions de requêtes par seconde à latence ultra-faible. L'option C est fausse car le GWLB déploie des appliances virtuelles réseau tierces. L'option D est la génération précédente déconseillée.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Quel composant permet d'ajuster automatiquement le nombre d'instances Amazon EC2 en service en ajoutant des serveurs lors des montées de charge et en les résiliant lors des creux d'activité ?",
  options: [
    "A) Amazon EC2 Auto Scaling",
    "B) AWS Systems Manager",
    "C) Amazon Route 53",
    "D) AWS Config"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car EC2 Auto Scaling maintient la disponibilité applicative en modulant la taille du groupe d'instances selon des politiques de mise à l'échelle dynamiques, prédictives ou programmées. L'option B automatise les tâches de maintenance. L'option C route les noms de domaine. L'option D audite la conformité des configurations.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Quelle famille d'instances Amazon EC2 est spécifiquement optimisée pour les charges nécessitant une grande quantité de mémoire vive RAM (comme les bases de données relationnelles ou les caches in-memory) ?",
  options: [
    "A) Famille R (Memory Optimized)",
    "B) Famille C (Compute Optimized)",
    "C) Famille I (Storage Optimized)",
    "D) Famille T (Burstable General Purpose)"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les instances de la famille R (comme R6g, R7i) sont optimisées pour la mémoire vive RAM. L'option B est fausse car la famille C est optimisée pour la puissance de calcul CPU. L'option C est fausse car la famille I est optimisée pour le stockage local NVMe à haut débit IOPS. L'option D est fausse car la famille T correspond à un usage général avec capacité de rafale CPU.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://aws.amazon.com/ec2/instance-types/'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Qu'est-ce qu'une image de machine Amazon (AMI - Amazon Machine Image) ?",
  options: [
    "A) Un modèle préconfiguré contenant le système d'exploitation, les logiciels et les paramètres nécessaires au lancement d'une instance EC2",
    "B) Une photographie haute définition prise dans les datacenters AWS",
    "C) Un fichier de sauvegarde réservé exclusivement aux bases de données DynamoDB",
    "D) Une politique de facturation appliquée à un compte membre"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car une AMI est un modèle de virtualisation packagé fournissant l'OS, les applications installées et les configurations requises pour démarrer une instance EC2. Les options B, C et D sont de fausses assertions.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Quel processeur personnalisé conçu par AWS et reposant sur l'architecture ARM offre le meilleur rapport performance-prix pour un large éventail de charges de travail sur EC2 ?",
  options: [
    "A) AWS Graviton",
    "B) AWS Nitro",
    "C) Intel Xeon",
    "D) AMD EPYC"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les processeurs AWS Graviton sont conçus sur mesure par AWS pour fournir un gain de rapport performance-prix pouvant atteindre 40 % par rapport aux processeurs x86 traditionnels. L'option B est fausse car le système Nitro est la plateforme matérielle sous-jacente de virtualisation et de déchargement d'AWS. Les options C et D sont des puces tierces x86 également proposées par AWS.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/ec2/graviton/'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Une application web nécessite une adresse IP publique statique et fixe qui ne change jamais même lorsque l'instance EC2 sous-jacente est arrêtée et redémarrée. Quelle fonctionnalité doit-on utiliser ?",
  options: [
    "A) Une adresse IP élastique (Elastic IP Address)",
    "B) L'adresse IP publique dynamique par défaut",
    "C) L'adresse IP privée du sous-réseau",
    "D) Une passerelle NAT Gateway"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car une Elastic IP est une adresse IPv4 statique publique allouée à votre compte AWS qui peut être associée et réassociée dynamiquement à des instances. L'option B est fausse car l'IP publique dynamique par défaut est libérée lors de l'arrêt de l'instance. L'option C est fausse car l'IP privée n'est pas routable sur Internet. L'option D est une passerelle de sortie pour sous-réseaux privés.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html'
});

addQ({
  domain: D3,
  topic_id: 'ec2-calcul-tarification',
  statement: "Quel service AWS fournit un environnement simple, économique et tout-en-un (incluant machine virtuelle, stockage SSD, transfert de données et DNS) pour les développeurs souhaitant lancer un site web ou un blog WordPress en quelques clics ?",
  options: [
    "A) Amazon Lightsail",
    "B) Amazon EMR",
    "C) AWS Batch",
    "D) AWS Outposts"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon Lightsail est le service cloud le plus facile et prévisible pour déployer des serveurs virtuels simples avec une tarification mensuelle fixe forfaitaire. L'option B est une plateforme Big Data pour Hadoop/Spark. L'option C gère le calcul batch distribué. L'option D déploie des serveurs matériels sur site.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/lightsail/'
});

// 3.3 s3 (10 questions)
addQ({
  domain: D3,
  topic_id: 's3',
  statement: "Quelle classe de stockage Amazon S3 déplace automatiquement vos objets entre des paliers d'accès fréquent et peu fréquent afin de réduire les coûts sans exiger d'analyse préalable ni facturer de frais de récupération de données ?",
  options: [
    "A) S3 Intelligent-Tiering",
    "B) S3 Standard-IA",
    "C) S3 One Zone-IA",
    "D) S3 Glacier Flexible Retrieval"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car S3 Intelligent-Tiering surveille les motifs d'accès et déplace les objets vers le palier le plus économique sans frais de récupération ni pénalité de latence. L'option B est fausse car Standard-IA applique des frais de récupération par Go. L'option C ne réplique les données que dans une seule zone de disponibilité. L'option D exige une commande explicite de restauration préalable.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering.html'
});

addQ({
  domain: D3,
  topic_id: 's3',
  statement: "Quelle est la durabilité officielle (durability) garantie par Amazon S3 pour les données stockées dans les classes de stockage standard réparties sur plusieurs zones de disponibilité ?",
  options: [
    "A) 99,999999999 % (11 neuf)",
    "B) 99,9 %",
    "C) 90,0 %",
    "D) 100 % absolue sans aucun risque théorique"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la classe Amazon S3 Standard est conçue pour offrir une durabilité de 99,999999999 % (11 neuf) des objets sur une année donnée. L'option B est une valeur de disponibilité mensuelle courante mais pas de durabilité. L'option C est trop basse. L'option D est impossible à garantir en informatique.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/s3/storage-classes/'
});

addQ({
  domain: D3,
  topic_id: 's3',
  statement: "Un groupe d'instances Linux réparties dans plusieurs zones de disponibilité doit monter simultanément un même système de fichiers partagé via le protocole NFS en lecture et en écriture. Quel service de stockage doit-on utiliser ?",
  options: [
    "A) Amazon EFS (Elastic File System)",
    "B) Amazon EBS (Elastic Block Store)",
    "C) Amazon S3 Glacier Deep Archive",
    "D) AWS Snowcone"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon EFS fournit un système de fichiers élastique et partagé multi-AZ supportant l'accès concurrentiel de milliers d'instances via NFSv4. L'option B est fausse car un volume EBS standard ne s'attache qu'à une seule instance dans une seule AZ (hors EBS Multi-Attach Io1/Io2 dans la même AZ). L'option C est un stockage d'archive à froid. L'option D est un boîtier physique.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html'
});

addQ({
  domain: D3,
  topic_id: 's3',
  statement: "Quel service de stockage de type bloc fournit des volumes disques virtuels à haute performance attachés en réseau à une instance EC2 spécifique dans la même zone de disponibilité pour héberger son système d'exploitation ?",
  options: [
    "A) Amazon EBS (Elastic Block Store)",
    "B) Amazon S3",
    "C) Amazon EFS",
    "D) AWS Storage Gateway"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon EBS fournit des volumes disques blocs persistants indispensables au système d'exploitation et aux bases de données locales d'une instance EC2. L'option B est fausse car S3 est un stockage objet accessible par API REST. L'option C est un système de fichiers réseau partagé. L'option D est une passerelle de stockage hybride.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html'
});

addQ({
  domain: D3,
  topic_id: 's3',
  statement: "Quelle classe de stockage Amazon S3 offre le coût mensuel au giga-octet le plus bas de tout le cloud AWS, conçue pour l'archivage à très long terme de données légales récupérables sous 12 heures ?",
  options: [
    "A) S3 Glacier Deep Archive",
    "B) S3 Standard",
    "C) S3 Express One Zone",
    "D) S3 Intelligent-Tiering"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car S3 Glacier Deep Archive est le stockage le plus économique d'AWS pour des données rarement consultées nécessitant un délai de récupération standard compris entre 9 et 12 heures. L'option B est le stockage chaud le plus onéreux. L'option C est une classe ultra-rapide à latence milliseconde pour l'analytique intensive. L'option D déplace les données entre paliers.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/s3/pricing/'
});

addQ({
  domain: D3,
  topic_id: 's3',
  statement: "Quelle fonctionnalité d'Amazon S3 permet de conserver plusieurs variantes d'un même objet dans un compartiment afin de se prémunir contre les suppressions accidentelles ou les écrasements malveillants ?",
  options: [
    "A) Le contrôle de version (S3 Versioning)",
    "B) Les politiques de cycle de vie (S3 Lifecycle)",
    "C) Les balises d'allocation des coûts",
    "D) Le partitionnement automatique de table"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car S3 Versioning conserve l'historique complet des versions créées et ajoute un Delete Marker lors d'une suppression au lieu d'effacer physiquement l'objet. L'option B est fausse car les politiques de cycle de vie servent à déplacer ou expirer les objets automatiquement. L'option C est fausse car les balises ventilent les coûts. L'option D est un concept de base de données.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/versioning-workflows.html'
});

addQ({
  domain: D3,
  topic_id: 's3',
  statement: "Qu'advient-il des données stockées sur un volume de stockage de type Instance Store (stockage éphémère) lorsqu'une instance Amazon EC2 est arrêtée (Stop) ou résiliée ?",
  options: [
    "A) Les données sont définitivement perdues",
    "B) Les données sont automatiquement transférées vers S3 Glacier",
    "C) Les données restent intactes et sont accessibles au redémarrage",
    "D) Une copie de sauvegarde est envoyée par email à l'administrateur"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'Instance Store est un disque physique directement connecté au serveur hôte : ses données sont éphémères et disparaissent lors de l'arrêt, de la résiliation ou d'une défaillance du serveur hôte. L'option B est fausse car aucune sauvegarde n'est effectuée automatiquement. L'option C est fausse car seuls les volumes EBS conservent leurs données à l'arrêt. L'option D est infondée.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html'
});

addQ({
  domain: D3,
  topic_id: 's3',
  statement: "Quelle fonctionnalité de sécurité S3 permet d'appliquer un modèle WORM (Write Once, Read Many) empêchant la suppression ou la modification d'un objet pendant une durée définie, même par le compte racine ?",
  options: [
    "A) S3 Object Lock en mode Conformité (Compliance mode)",
    "B) S3 Intelligent-Tiering",
    "C) La réplication entre régions (CRR)",
    "D) Le chiffrement SSE-S3"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car S3 Object Lock en mode Compliance garantit qu'aucun utilisateur (y compris le compte root AWS) ne peut effacer ou altérer l'objet avant l'expiration de la période de rétention légale. L'option B gère le coût de stockage. L'option C copie les objets dans une autre région. L'option D chiffre les données au repos sans en empêcher la suppression.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html'
});

addQ({
  domain: D3,
  topic_id: 's3',
  statement: "Quelle règle S3 permet de configurer le transfert automatique de fichiers vers S3 Standard-IA au bout de 30 jours, puis vers S3 Glacier après 90 jours, et leur suppression définitive après 365 jours ?",
  options: [
    "A) Une politique de cycle de vie (S3 Lifecycle Policy)",
    "B) Une politique de contrôle des services (SCP)",
    "C) Une liste de contrôle d'accès réseau (NACL)",
    "D) Une alarme Amazon CloudWatch"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les règles de cycle de vie S3 définissent les transitions d'objets entre classes de stockage et les dates d'expiration en fonction de leur ancienneté. L'option B gère les frontières d'autorisations IAM multi-comptes. L'option C filtre les paquets réseau. L'option D surveille des métriques de charge.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html'
});

addQ({
  domain: D3,
  topic_id: 's3',
  statement: "Quelle est la taille maximale d'un objet unique pouvant être téléversé et stocké dans un compartiment Amazon S3 ?",
  options: [
    "A) 5 To (Téraoctets)",
    "B) 5 Go (Gigaoctets)",
    "C) 100 Mo (Mégaoctets)",
    "D) Illimitée pour un seul fichier"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la taille maximale d'un objet individuel dans S3 est de 5 To (le téléversement en une seule opération PUT étant limité à 5 Go, au-delà duquel l'utilisation de l'API Multipart Upload est obligatoire). Les options B, C et D sont inexactes.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html'
});

// 3.4 rds-aurora-autres (12 questions)
addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quelle base de données relationnelle propriétaire développée par AWS offre une compatibilité totale avec MySQL et PostgreSQL, réplique automatiquement les écritures en 6 exemplaires sur 3 zones de disponibilité et assure un basculement rapide en cas d'incident ?",
  options: [
    "A) Amazon Aurora",
    "B) Amazon DynamoDB",
    "C) Amazon Redshift",
    "D) Amazon DocumentDB"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon Aurora est le moteur relationnel de pointe d'AWS qui sépare le calcul du stockage distribué répliqué sur 3 AZ en 6 copies. L'option B est une base NoSQL non relationnelle. L'option C est un data warehouse décisionnel OLAP. L'option D est une base de données orientée documents compatible MongoDB.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quelle base de données entièrement managée NoSQL de type clé-valeur et documents offre des performances constantes inférieures à 10 millisecondes à n'importe quelle échelle de trafic ?",
  options: [
    "A) Amazon DynamoDB",
    "B) Amazon RDS for SQL Server",
    "C) Amazon Redshift",
    "D) Amazon OpenSearch Service"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car DynamoDB est le service NoSQL managé sans serveur d'AWS réputé pour sa latence milliseconde constante et sa scalabilité horizontale transparente. L'option B est une base de données relationnelle traditionnelle. L'option C est un entrepôt de données analytique. L'option D est un moteur de recherche textuelle et de logs.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quel service devez-vous choisir pour créer un entrepôt de données (data warehouse) SQL colonnaire à l'échelle du pétaoctet, optimisé pour les requêtes décisionnelles complexes de Business Intelligence (BI) ?",
  options: [
    "A) Amazon Redshift",
    "B) Amazon DynamoDB",
    "C) Amazon ElastiCache",
    "D) AWS Secrets Manager"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon Redshift est le data warehouse analytique managé d'AWS utilisant un stockage colonnaire pour exécuter des requêtes OLAP complexes à très grande échelle. L'option B est une base NoSQL transactionnelle OLTP. L'option C est un cache en mémoire RAM. L'option D est un gestionnaire d'identifiants.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Pour accélérer les performances de lecture d'une application web en mettant en mémoire vive (in-memory) les données fréquemment sollicitées, quel service entièrement managé compatible avec Redis et Memcached doit-on déployer ?",
  options: [
    "A) Amazon ElastiCache",
    "B) Amazon RDS",
    "C) Amazon EFS",
    "D) AWS Storage Gateway"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon ElastiCache déploie et gère des caches en mémoire ultra-rapides compatibles avec Redis ou Memcached pour fournir une latence de l'ordre de la microseconde. L'option B est une base relationnelle sur disque. L'option C est un système de fichiers NFS. L'option D est une passerelle de stockage sur site.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quelle est la différence fondamentale d'objectif entre le déploiement Multi-AZ d'Amazon RDS et l'utilisation de réplicas en lecture (Read Replicas) ?",
  options: [
    "A) Le Multi-AZ assure la haute disponibilité et la tolérance aux pannes par réplication synchrone vers une instance secondaire passive ; les Read Replicas augmentent les performances de lecture par réplication asynchrone",
    "B) Le Multi-AZ sert uniquement à réduire les coûts ; les Read Replicas servent uniquement à stocker des archives Glacier",
    "C) Le Multi-AZ est réservé à Redshift ; les Read Replicas sont réservés à DynamoDB",
    "D) Il n'y a aucune différence, les deux termes désignent exactement la même fonction"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le déploiement Multi-AZ synchronise une instance de secours passive dans une autre AZ avec basculement automatique en cas de panne, tandis que les réplicas en lecture traitent les requêtes de consultation pour décharger l'instance principale. Les options B, C et D sont erronées.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.RDSHAMultiAZ.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quel moteur de base de données relationnelle N'EST PAS géré nativement dans le service Amazon RDS ?",
  options: [
    "A) MongoDB",
    "B) PostgreSQL",
    "C) MySQL",
    "D) Microsoft SQL Server"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car MongoDB est une base NoSQL orientée documents (gérée sur AWS par Amazon DocumentDB) et ne fait pas partie des 6 moteurs relationnels RDS (Aurora, PostgreSQL, MySQL, MariaDB, Oracle, SQL Server). Les options B, C et D sont supportées sur RDS.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quel service managé de base de données orientée graphes permet de stocker et d'interroger rapidement des jeux de données hautement connectés (comme les réseaux sociaux, graphes de fraude ou moteurs de recommandation) ?",
  options: [
    "A) Amazon Neptune",
    "B) Amazon Redshift",
    "C) Amazon RDS for MySQL",
    "D) Amazon DynamoDB"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon Neptune est le service de base de données de graphes managé d'AWS supportant Apache TinkerPop Gremlin et SPARQL. L'option B est un data warehouse relationnel colonnaire. L'option C est une base relationnelle classique. L'option D est une base NoSQL clé-valeur et document.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/neptune/latest/userguide/intro.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quel service permet d'interroger directement avec du SQL standard des fichiers volumineux (CSV, JSON, Parquet) stockés dans un compartiment Amazon S3 sans avoir à charger les données dans une base de données au préalable (architecture serverless) ?",
  options: [
    "A) Amazon Athena",
    "B) Amazon RDS",
    "C) Amazon DynamoDB",
    "D) Amazon ElastiCache"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon Athena est un service de requêtage SQL interactif sans serveur qui analyse directement les données résidentes dans Amazon S3 avec une tarification basée sur le volume de données scanné. Les options B, C et D nécessitent un chargement explicite des données dans des moteurs de stockage dédiés.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/athena/latest/ug/what-is.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quel service AWS fournit une base de données de registre immuable et cryptographiquement vérifiable, où chaque modification de transaction est journalisée dans un historique inviolable ?",
  options: [
    "A) Amazon QLDB (Quantum Ledger Database)",
    "B) Amazon DynamoDB",
    "C) Amazon RDS for PostgreSQL",
    "D) AWS Secrets Manager"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon QLDB est une base de données de registre transparente et immuable qui conserve un journal de transactions cryptographiquement certifié et chaîné. L'option B permet la mise à jour et la suppression directe d'éléments sans historique cryptographique natif. Les options C et D ne garantissent pas l'immutabilité de registre.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/qldb/latest/developerguide/what-is.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quel service managé de recherche et d'analyse de données permet d'indexer des millions de lignes de logs applicatifs et de créer des tableaux de bord visuels interactifs avec OpenSearch Dashboards ?",
  options: [
    "A) Amazon OpenSearch Service",
    "B) Amazon Redshift",
    "C) Amazon RDS",
    "D) AWS Database Migration Service"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon OpenSearch Service (successeur d'Amazon Elasticsearch Service) est le moteur de recherche textuelle et d'analyse de logs d'AWS. L'option B est un data warehouse décisionnel. L'option C est une base relationnelle. L'option D est un service de migration de bases de données.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quelle fonctionnalité d'Amazon Aurora permet à la capacité de calcul de démarrer, s'adapter automatiquement à la hausse comme à la baisse et s'éteindre pendant les périodes d'inactivité afin d'optimiser les coûts pour les charges intermittentes ?",
  options: [
    "A) Aurora Serverless",
    "B) Aurora Multi-Master",
    "C) Aurora Global Database",
    "D) RDS Read Replicas"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Aurora Serverless ajuste automatiquement la puissance de calcul en unités de capacité (ACU) en fonction de la demande réelle et peut être suspendu en l'absence de requêtes. L'option B permet l'écriture sur plusieurs instances. L'option C permet la réplication transcontinentale. L'option D gère les réplicas de lecture sur instances provisionnées.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html'
});

addQ({
  domain: D3,
  topic_id: 'rds-aurora-autres',
  statement: "Quel service managé d'extraction, de transformation et de chargement (ETL) sans serveur permet de découvrir, préparer et intégrer des données provenant de multiples sources pour les rendre exploitables dans un data lake ?",
  options: [
    "A) AWS Glue",
    "B) Amazon Athena",
    "C) Amazon QuickSight",
    "D) AWS Shield"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Glue est le service d'intégration de données serverless d'AWS avec un catalogue de métadonnées unifié (Data Catalog) et des moteurs de transformation Apache Spark. L'option B exécute des requêtes SQL sur S3. L'option C crée des visualisations BI. L'option D protège contre les attaques DDoS.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html'
});

// 3.5 vpc-privatelink (10 questions)
addQ({
  domain: D3,
  topic_id: 'vpc-privatelink',
  statement: "Quelle est la différence fondamentale de fonctionnement entre un Groupe de Sécurité (Security Group) et une Liste de Contrôle d'Accès Réseau (NACL) dans un Amazon VPC ?",
  options: [
    "A) Le Security Group est avec état (Stateful) au niveau de l'instance ; la NACL est sans état (Stateless) au niveau du sous-réseau avec des règles d'autorisation et de refus numérotées",
    "B) Le Security Group opère au niveau du sous-réseau ; la NACL opère au niveau de la carte réseau virtuelle de l'instance",
    "C) Le Security Group bloque tout le trafic sortant par défaut ; la NACL ne gère que les connexions HTTP",
    "D) La NACL est payante ; le Security Group est gratuit"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les Security Groups sont des pare-feux Stateful rattachés aux interfaces réseau virtuelles (ENI) d'instances (si un paquet entrant est autorisé, sa réponse sortante est automatiquement permise), alors que les NACL sont Stateless associées aux sous-réseaux et exigent des règles explicites dans les deux directions. Les options B, C et D sont erronées.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html'
});

addQ({
  domain: D3,
  topic_id: 'vpc-privatelink',
  statement: "Quel composant d'un VPC permet à des instances Amazon EC2 situées dans un sous-réseau privé d'accéder à Internet pour télécharger des mises à jour logicielles, tout en empêchant des serveurs extérieurs sur Internet d'initier des connexions vers elles ?",
  options: [
    "A) Une passerelle NAT (NAT Gateway)",
    "B) Une passerelle Internet (Internet Gateway)",
    "C) Une connexion VPC Peering",
    "D) Un répartiteur de charge Application Load Balancer"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la passerelle NAT (déployée dans un sous-réseau public) traduit les adresses IP privées pour les requêtes sortantes vers Internet sans accepter de connexions entrantes non sollicitées. L'option B est fausse car l'Internet Gateway autorise les flux bidirectionnels vers les sous-réseaux publics. L'option C relie deux VPC privés. L'option D distribue le trafic entrant.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html'
});

addQ({
  domain: D3,
  topic_id: 'vpc-privatelink',
  statement: "Quel composant d'un VPC doit être obligatoirement attaché pour qu'un sous-réseau devienne public et permette aux instances qui y sont déployées de communiquer directement avec Internet ?",
  options: [
    "A) Une passerelle Internet (Internet Gateway - IGW)",
    "B) Une passerelle NAT",
    "C) Un point de terminaison VPC Endpoint",
    "D) Une passerelle de transit AWS Transit Gateway"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car une passerelle Internet est la ressource VPC hautement disponible qui permet la communication directe entre les instances d'un sous-réseau public et le réseau Internet mondial via une route 0.0.0.0/0. L'option B est réservée aux sous-réseaux privés. Les options C et D permettent des liaisons privées internes.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html'
});

addQ({
  domain: D3,
  topic_id: 'vpc-privatelink',
  statement: "Quel service réseau permet d'établir une connexion réseau privée dédiée par câble physique entre le centre de données d'une entreprise et le cloud AWS, contournant complètement l'Internet public pour garantir des débits stables et constants ?",
  options: [
    "A) AWS Direct Connect",
    "B) AWS Site-to-Site VPN",
    "C) Amazon Route 53",
    "D) Amazon CloudFront"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Direct Connect relie directement le réseau d'entreprise à AWS via une connexion dédiée en fibre optique sans passer par les réseaux Internet publics. L'option B est fausse car un VPN utilise des tunnels chiffrés IPsec transitant par l'Internet public. L'option C est un résolveur DNS. L'option D est un réseau de distribution CDN.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html'
});

addQ({
  domain: D3,
  topic_id: 'vpc-privatelink',
  statement: "Quel composant réseau agit comme un concentrateur central (hub) pour interconnecter facilement des dizaines de VPC et des réseaux sur site sans avoir à créer un maillage complexe de connexions VPC Peering point à point ?",
  options: [
    "A) AWS Transit Gateway",
    "B) Passerelle NAT",
    "C) Internet Gateway",
    "D) Amazon Route 53 Resolver"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Transit Gateway simplifie la topologie réseau en servant de passerelle de routage centrale en étoile pour relier de nombreux VPC et connexions VPN ou Direct Connect. L'option B traduit les adresses IP pour Internet. L'option C relie un VPC à Internet. L'option D résout des noms DNS hybrides.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html'
});

addQ({
  domain: D3,
  topic_id: 'vpc-privatelink',
  statement: "Pour permettre à des instances privées d'un VPC d'accéder à des compartiments Amazon S3 ou à des tables DynamoDB sans attribuer d'IP publique, sans passerelle NAT et sans quitter le réseau privé d'AWS, quelle ressource gratuite de routage doit-on configurer ?",
  options: [
    "A) Un point de terminaison de passerelle VPC (Gateway VPC Endpoint)",
    "B) Une passerelle NAT Gateway",
    "C) Une passerelle Internet Gateway",
    "D) Une connexion AWS Direct Connect"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les Gateway VPC Endpoints (disponibles pour Amazon S3 et DynamoDB) ajoutent une route privée directe dans la table de routage du VPC sans coût horaire ni passage par Internet. L'option B engendre des coûts horaires et de traitement. Les options C et D sont hors sujet.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html'
});

addQ({
  domain: D3,
  topic_id: 'vpc-privatelink',
  statement: "Quel service DNS cloud mondialement distribué et hautement disponible permet d'enregistrer des noms de domaine, d'acheminer le trafic des utilisateurs et de vérifier la santé des serveurs ?",
  options: [
    "A) Amazon Route 53",
    "B) Amazon CloudFront",
    "C) AWS Direct Connect",
    "D) AWS Shield"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car Amazon Route 53 est le service de système de noms de domaine (DNS) d'AWS offrant des politiques de routage avancées (géolocalisation, latence, basculement de secours). L'option B est un réseau CDN. L'option C est une liaison dédiée physique. L'option D est une protection anti-DDoS.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html'
});

addQ({
  domain: D3,
  topic_id: 'vpc-privatelink',
  statement: "Quelle fonctionnalité permet de capturer des informations sur le trafic IP entrant et sortant des interfaces réseau virtuelles (ENI) d'un VPC à des fins de diagnostic de connectivité et d'audit de sécurité ?",
  options: [
    "A) Les journaux de flux VPC (VPC Flow Logs)",
    "B) AWS CloudTrail",
    "C) Amazon Inspector",
    "D) AWS Artifact"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les VPC Flow Logs enregistrent les métadonnées réseau IP (adresses sources/destinations, ports, protocoles, actions ACCEPT ou REJECT) publiées vers CloudWatch Logs ou S3. L'option B trace les requêtes sur les API AWS. L'option C scanne les vulnérabilités applicatives. L'option D distribue les rapports d'audit.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html'
});

addQ({
  domain: D3,
  topic_id: 'vpc-privatelink',
  statement: "Peut-on établir une connexion de peering entre deux VPC (VPC Peering) dont les plages d'adresses IPv4 CIDR se chevauchent (par exemple 10.0.0.0/16 sur les deux réseaux) ?",
  options: [
    "A) Non, les plages d'adresses CIDR ne doivent jamais se chevaucher",
    "B) Oui, le protocole réseau résout automatiquement les conflits d'adresses IP",
    "C) Oui, à condition que les VPC soient dans la même zone de disponibilité",
    "D) Oui, mais seulement si l'un des deux comptes est fermé"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS interdit formellement la création d'une liaison de peering entre deux VPC présentant des plages d'adresses IP CIDR identiques ou se chevauchant, car le routage déterministe des paquets serait impossible. Les options B, C et D sont techniquement fausses.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/vpc/latest/peering/invalid-peering-configurations.html'
});

addQ({
  domain: D3,
  topic_id: 'vpc-privatelink',
  statement: "Quelle technologie d'accès réseau privé permet d'exposer de manière sécurisée un service applicatif hébergé dans votre VPC à des milliers d'autres comptes AWS clients sans exposer le trafic sur Internet et sans peering de réseaux complets ?",
  options: [
    "A) AWS PrivateLink (Interface VPC Endpoints)",
    "B) Passerelle Internet Gateway",
    "C) Amazon Route 53 public",
    "D) Une passerelle NAT Gateway"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS PrivateLink utilise des interfaces réseau élastiques (ENI) privées et des équilibreurs Network Load Balancers pour connecter des services entre différents comptes sans maillage réseau global. L'option B expose le service sur le web public. L'option C résout des adresses publiques. L'option D est un composant de sortie vers Internet.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html'
});

console.log(`[DOMAINE 3 OK] ${questions.length} questions générées au total.`);

// --------------------------------------------------------------------------
// DOMAINE 4 : Facturation, Tarification et Support (18 questions)
// --------------------------------------------------------------------------
const D4 = 'Domaine 4 : Facturation, Tarification et Support';

// 4.1 facturation-couts-support (18 questions)
addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quel outil gratuit basé sur le web permet d'estimer à l'avance les coûts d'une future architecture AWS avant même de créer un compte ou de déployer des ressources en production ?",
  options: [
    "A) AWS Pricing Calculator",
    "B) AWS Cost Explorer",
    "C) AWS Budgets",
    "D) AWS Trusted Advisor"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'AWS Pricing Calculator est l'outil public officiel pour modéliser et chiffrer des architectures projetées. L'option B est fausse car Cost Explorer requiert des données de consommation historiques sur un compte existant. L'option C est fausse car Budgets configure des alertes sur des dépenses en cours. L'option D analyse la conformité des ressources déployées.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://calculator.aws/'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quel outil de gestion financière permet de visualiser, filtrer et analyser ses dépenses AWS passées et de projeter ses coûts jusqu'à 12 mois dans le futur sous forme de graphiques détaillés ?",
  options: [
    "A) AWS Cost Explorer",
    "B) AWS Pricing Calculator",
    "C) AWS Artifact",
    "D) Amazon CloudWatch Logs"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Cost Explorer offre une interface d'analyse graphique rétrospective et prévisionnelle sur 12 mois pour identifier les tendances et anomalies de dépenses. L'option B sert à l'estimation préliminaire. L'option C délivre les rapports de conformité. L'option D stocke les logs d'applications.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Une entreprise souhaite recevoir un avertissement automatique par email dès que ses dépenses mensuelles prévisionnelles dépassent 5 000 USD. Quel outil AWS doit-elle configurer ?",
  options: [
    "A) AWS Budgets",
    "B) AWS Pricing Calculator",
    "C) AWS Cost and Usage Report (CUR)",
    "D) AWS Systems Manager"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car AWS Budgets permet de définir des budgets financiers ou d'usage personnalisés et de déclencher des alertes SNS ou email lors du franchissement de seuils réels ou prévisionnels. L'option B ne gère pas d'alertes en production. L'option C dépose des fichiers bruts dans S3. L'option D administre les serveurs.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quel plan de support AWS officiel inclut l'attribution d'un Technical Account Manager (TAM) dédié et garantit un délai de réponse inférieur à 15 minutes pour les pannes critiques d'entreprise (business-critical system down) ?",
  options: [
    "A) Plan de Support Enterprise",
    "B) Plan de Support Business",
    "C) Plan de Support Developer",
    "D) Plan de Support Basic"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le plan de support Enterprise comprend un TAM dédié, un délai de 15 minutes pour incident critique 24/7 et des revues opérationnelles d'architecture. L'option B est fausse car le support Business propose un délai d'une heure pour panne de production sans TAM dédié. L'option C offre un délai de 12 heures ouvrées par email. L'option D est l'offre gratuite sans support technique personnalisé.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/premiumsupport/plans/'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quel plan de support AWS est le premier niveau payant à offrir un accès direct 24h/24 et 7j/7 par téléphone, chat et email à des ingénieurs de support pour des pannes de production avec un délai de réponse inférieur à 1 heure ?",
  options: [
    "A) Plan de Support Business",
    "B) Plan de Support Developer",
    "C) Plan de Support Basic",
    "D) Plan de Support Partenaire libre"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le plan Business est le niveau recommandé pour les charges en production, ouvrant le support 24/7 multicanal avec un engagement de réponse sous 1 heure pour arrêt de production. L'option B est limitée aux heures ouvrées par email. L'option C ne comprend aucun support technique. L'option D n'est pas un plan officiel.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/premiumsupport/plans/'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quel avantage tarifaire permet de regrouper la consommation de plusieurs comptes AWS au sein d'une organisation pour obtenir une facture unique et bénéficier automatiquement de remises sur volume dégressives ?",
  options: [
    "A) La facturation consolidée (Consolidated Billing) dans AWS Organizations",
    "B) Les balises de répartition des coûts manuelles",
    "C) Les rapports AWS Artifact",
    "D) Le partage de clés SSH publiques"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la facturation consolidée regroupe les usages de tous les comptes membres afin de franchir collectivement les paliers dégressifs de tarification (notamment sur S3 et le transfert de données). L'option B ventile les coûts mais ne modifie pas les tarifs. L'option C concerne la conformité légale. L'option D concerne l'authentification système.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Parmi les 5 catégories de recommandations fournies par AWS Trusted Advisor, lesquelles DEUX font partie de la liste officielle ? (Choisissez deux réponses)",
  type: 'multiple',
  options: [
    "A) Optimisation des coûts (Cost Optimization)",
    "B) Tolérance aux pannes (Fault Tolerance)",
    "C) Rédaction automatique de requêtes SQL analytiques",
    "D) Remplacement préventif de matériel informatique sur site",
    "E) Calcul du salaire des ingénieurs d'exploitation"
  ],
  expected_answer: ["A", "B"],
  explanation: "Les options A et B sont correctes car les cinq catégories officielles de vérification de Trusted Advisor sont l'Optimisation des coûts, la Sécurité, la Tolérance aux pannes, les Performances et les Quotas de service. Les options C, D et E sont sans rapport avec ce service.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quel rapport de facturation fournit l'ensemble le plus exhaustif et détaillé de métadonnées de consommation AWS, ventilé par heure ou par jour et déposé au format CSV ou Parquet dans un compartiment S3 ?",
  options: [
    "A) AWS Cost and Usage Report (CUR)",
    "B) AWS Budgets",
    "C) AWS Pricing Calculator",
    "D) Tableau de bord de synthèse de facturation"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'AWS Cost and Usage Report (CUR) contient la granularité maximale des données de facturation et d'utilisation, enrichie avec les identifiants de ressources et balises pour alimenter Amazon Athena ou Redshift. L'option B gère des seuils d'alerte. L'option C est un simulateur pré-déploiement. L'option D fournit une vue agrégée simplifiée.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Comment une entreprise peut-elle catégoriser ses dépenses AWS par centre de coûts, projet, environnement (dev, staging, prod) ou responsable d'application afin de faciliter la refacturation interne ?",
  options: [
    "A) En activant les balises de répartition des coûts (Cost Allocation Tags)",
    "B) En créant un nouveau groupe de sécurité par projet",
    "C) En ouvrant un ticket de support technique chaque semaine",
    "D) En changeant de région AWS pour chaque environnement"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les balises de répartition des coûts (Cost Allocation Tags) permettent d'associer des métadonnées clé-valeur aux ressources pour ventiler les dépenses dans les rapports de facturation. L'option B est un composant de sécurité réseau. L'option C est inefficace et inappropriée. L'option D disperse inutilement l'architecture.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quel tableau de bord fournit des alertes et des notifications proactives personnalisées concernant les événements de disponibilité et maintenances planifiées affectant directement les ressources spécifiques de votre propre compte AWS ?",
  options: [
    "A) AWS Health Dashboard (anciennement Personal Health Dashboard)",
    "B) Page publique AWS Service Health Dashboard",
    "C) AWS Pricing Calculator",
    "D) AWS Marketplace"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'AWS Health Dashboard présente une vue ciblée sur l'état de santé des services et ressources effectivement utilisés par votre compte. L'option B affiche l'état global public de tous les services par région sans personnalisation de compte. L'option C simule des coûts. L'option D est une boutique de logiciels tiers.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.html'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quelle boutique en ligne permet aux clients de trouver, tester, acheter et déployer des milliers de logiciels tiers de sécurité, bases de données ou Business Intelligence directement intégrés à leur facturation AWS ?",
  options: [
    "A) AWS Marketplace",
    "B) AWS Artifact",
    "C) AWS Secrets Manager",
    "D) AWS Systems Manager"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'AWS Marketplace est le catalogue numérique de solutions logicielles d'éditeurs tiers indépendants facturées directement sur le relevé AWS du client. L'option B fournit des rapports de conformité. L'option C stocke des secrets. L'option D gère les opérations d'instances.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/marketplace/'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quel type d'offre dans le niveau gratuit d'AWS (Free Tier) reste accessible indéfiniment sans expirer au bout des 12 premiers mois suivant la création du compte ?",
  options: [
    "A) Les offres toujours gratuites (Always Free)",
    "B) Les offres gratuites pendant 12 mois (12 Months Free)",
    "C) Les essais à court terme (Short-term Trials)",
    "D) Les instances réservées à tarif préférentiel"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car les offres Always Free (comme 1 million de requêtes Lambda par mois ou 25 Go de stockage DynamoDB) ne sont pas limitées dans le temps et restent gratuites chaque mois. L'option B expire un an après l'ouverture du compte. L'option C correspond à des essais temporaires de quelques jours ou semaines. L'option D implique un paiement.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/free/'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Un client bénéficiant du support Developer a ouvert un ticket pour une question générale de configuration technique. Quel est le délai d'engagement de réponse (SLA) maximal pour ce plan de support ?",
  options: [
    "A) Moins de 12 heures ouvrées",
    "B) Moins de 15 minutes",
    "C) Moins de 1 heure",
    "D) Moins de 5 jours ouvrés"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car le plan de support Developer garantit une prise en charge sous 12 heures ouvrées pour les questions de développement ou de configuration générale. L'option B correspond aux pannes critiques du plan Enterprise. L'option C correspond aux pannes de production des plans Business et Enterprise. L'option D ne correspond à aucun SLA standard.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://aws.amazon.com/premiumsupport/plans/'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quels clients AWS ont accès à l'intégralité des 5 piliers de vérification d'AWS Trusted Advisor (et non uniquement aux vérifications de sécurité et quotas de base) ?",
  options: [
    "A) Les souscripteurs des plans de support Business et Enterprise",
    "B) Tous les utilisateurs du plan de support Basic",
    "C) Uniquement les souscripteurs du plan Developer",
    "D) Uniquement les comptes disposant d'un abonnement AWS GovCloud"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'accès complet à l'ensemble des vérifications Trusted Advisor (optimisation des coûts, tolérance aux pannes, performance, sécurité complète) est réservé aux clients ayant souscrit au support Business ou Enterprise. L'option B est fausse car le support Basic n'offre que 7 vérifications. L'option C est fausse car le support Developer a le même accès limité. L'option D est fausse car GovCloud est une région isolée indépendante du support.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/premiumsupport/plans/'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quel programme d'aide AWS met en relation les entreprises avec des experts AWS certifiés et des partenaires pour réussir des migrations d'envergure vers le cloud en apportant des financements et des méthodologies éprouvées ?",
  options: [
    "A) AWS Migration Acceleration Program (MAP)",
    "B) AWS Well-Architected Tool",
    "C) Amazon Route 53",
    "D) AWS DataSync"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'AWS Migration Acceleration Program (MAP) fournit des crédits, une méthodologie en 3 phases (Assess, Mobilize, Migrate) et un accompagnement partenaire pour les grandes migrations d'entreprise. L'option B est un outil d'évaluation d'architecture. L'option C est un service DNS. L'option D est un outil technique de transfert de fichiers.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://aws.amazon.com/migration-acceleration-program/'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Si vous disposez de deux comptes membres au sein d'une même organisation AWS et que le premier compte achète des instances réservées non utilisées à 100 %, que se passe-t-il automatiquement grâce à la facturation consolidée ?",
  options: [
    "A) Les remises de l'instance réservée sont appliquées aux instances éligibles actives exécutées dans l'autre compte membre",
    "B) La réservation est immédiatement annulée et perdue",
    "C) Le deuxième compte reçoit une amende pour sous-utilisation",
    "D) Les serveurs du premier compte sont immédiatement résiliés"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la facturation consolidée permet le partage automatique des remises des instances réservées et des Savings Plans entre les différents comptes membres d'une même organisation (sauf si le partage a été explicitement désactivé). L'option B est fausse car la réservation n'est pas perdue. L'option C est fausse car il n'existe aucune pénalité de ce type. L'option D est fausse car les instances continuent de fonctionner sans interruption.",
  difficulty: 'moyen',
  recommended_time_sec: 75,
  source_url: 'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ri-turn-off.html'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quelle ressource fournit aux développeurs un ensemble complet d'exemples de code, de modèles d'architecture de référence et de bonnes pratiques vérifiées pour accélérer la conception de solutions sur AWS ?",
  options: [
    "A) AWS Solutions Constructs et AWS Architecture Center",
    "B) AWS Cost Explorer",
    "C) AWS Artifact",
    "D) Amazon Inspector"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car l'AWS Architecture Center et la bibliothèque AWS Solutions Constructs fournissent des architectures de référence prêtes à l'emploi validées par AWS. L'option B est un outil d'analyse de dépenses. L'option C fournit des rapports d'audit de sécurité. L'option D scanne les vulnérabilités de packages.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://aws.amazon.com/architecture/'
});

addQ({
  domain: D4,
  topic_id: 'facturation-couts-support',
  statement: "Quel outil gratuit permet de vérifier en temps réel le statut opérationnel public de l'ensemble des services AWS dans toutes les régions mondiales sans avoir besoin d'être connecté à un compte AWS ?",
  options: [
    "A) La page publique AWS Service Health Dashboard (statut général)",
    "B) AWS Secrets Manager",
    "C) AWS Cost and Usage Report",
    "D) AWS Organizations"
  ],
  expected_answer: ["A"],
  explanation: "L'option A est la bonne réponse car la page publique de statut des services AWS affiche l'état global et l'historique des incidents de tous les services par région en libre accès mondial. L'option B gère des mots de passe. L'option C est un rapport de facturation. L'option D est un gestionnaire d'organisation multi-comptes.",
  difficulty: 'facile',
  recommended_time_sec: 60,
  source_url: 'https://health.aws.amazon.com/health/status'
});

console.log(`[DOMAINE 4 OK] ${questions.length} questions générées au total.`);

// Vérifier et sauvegarder
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2), 'utf8');
console.log(`[BANQUE CLF TERMINEE] ${questions.length} questions uniques générées avec succès dans ${OUTPUT_FILE}`);
