import fs from 'node:fs';
import path from 'node:path';

const CLF_DIR = path.join(process.cwd(), 'content', 'certifications', 'clf');
const CHAPTERS_DIR = path.join(CLF_DIR, 'chapters');

// 1. Tighten clf-07-calcul-ec2.md
const clf07 = `# Chapitre 7 : Services de Calcul AWS et Modèles de Tarification EC2

## 1. Objectifs d'apprentissage
- Identifier les services de calcul : machines virtuelles (EC2), conteneurs (ECS, EKS, Fargate) et Serverless (Lambda).
- Maîtriser les 5 options d'achat EC2 (On-Demand, Savings Plans, Reserved Instances, Spot, Dedicated Hosts).
- Savoir choisir la bonne option tarifaire selon les contraintes de coût et d'interruption.
- Comprendre le rôle d'AWS Auto Scaling et d'Elastic Load Balancing (ELB).

## 2. Explication claire : quand choisir quoi
AWS propose une gamme de services de calcul adaptés à chaque niveau de contrôle :

Services de calcul :
- Amazon EC2 : serveurs virtuels offrant un contrôle total sur l'OS et les logiciels installés.
- AWS Lambda : calcul sans serveur exécutant du code par événement avec facturation à la milliseconde.
- Amazon ECS / EKS : orchestration de conteneurs Docker (ECS propriétaire, EKS basé sur Kubernetes).
- AWS Fargate : moteur sans serveur pour conteneurs (ECS ou EKS), éliminant la gestion des instances sous-jacentes.
- AWS Batch : exécution par lots de tâches de calcul distribuées.

Options d'achat Amazon EC2 :
1. À la demande (On-Demand) :
   - Facturation à la seconde sans engagement.
   - Idéal pour charges imprévisibles, développements courts ou tests.
2. Savings Plans :
   - Engagement d'utilisation flexible sur 1 ou 3 ans en dollars par heure (ex. 10 USD/h).
   - Réduction jusqu'à 72 %, applicable à EC2, Fargate et Lambda.
3. Instances Réservées (Reserved Instances) :
   - Engagement sur 1 ou 3 ans pour un type d'instance et une région.
   - Standard (non modifiable) ou Convertible (permet de changer de famille d'instance).
4. Instances Spot :
   - Utilisation de la capacité excédentaire avec jusqu'à 90 % de remise.
   - AWS peut récupérer l'instance avec un préavis de 2 minutes. Idéal pour batchs tolérants aux pannes.
5. Hôtes Dédiés (Dedicated Hosts) :
   - Serveur physique dédié pour licences logicielles par socket (BYOL) ou conformité stricte.

## 3. Définitions des termes clés
- AMI (Amazon Machine Image) : modèle préconfiguré pour lancer une instance EC2.
- Auto Scaling : ajustement automatique du nombre d'instances selon la charge réelle (CPU, requêtes).
- Elastic Load Balancing (ELB) : répartiteur distribuant le trafic entrant entre plusieurs instances multi-AZ.

## 4. Exemple concret
Une application Web combine :
- Compute Savings Plan sur 3 ans pour le socle permanent (économie 65 %).
- Instances À la demande avec Auto Scaling pour les pics de charge saisonniers.
- Instances Spot pour les batchs nocturnes de statistiques (économie 80 %).

## 5. Comparaisons et pièges d'examen
- Spot vs On-Demand : Spot ne doit jamais être choisi pour une base de données critique de production.
- Savings Plans vs Reserved Instances : Savings Plans offre une flexibilité supérieure à travers plusieurs familles, Fargate et Lambda.
- Hôtes dédiés vs Instances dédiées : l'Hôte Dédié donne la visibilité sur les sockets physiques pour les licences ; l'Instance Dédiée garantit seulement l'absence de colocation.

## 6. Lien avec SQL, Snowflake et Databricks
Dans Databricks, les nœuds de travail peuvent utiliser des instances Spot : si une instance est révoquée, Databricks relance la partition perdue sur un autre nœud sans faire échouer le job Spark.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 24 à 60.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quelle option d'achat EC2 permet d'obtenir jusqu'à 90 % de réduction pour des batchs supportant des interruptions ?
   - A) Les instances Spot (Bonne réponse).
   - B) Les instances à la demande.
   - C) Les instances réservées convertibles.
   - D) Les hôtes dédiés.
2. Quel service exécute du code sans gestion de serveurs ?
   - A) AWS Lambda (Bonne réponse).
   - B) Amazon EC2.
   - C) Amazon EMR.
   - D) AWS Outposts.
`;

// 2. Tighten clf-08-stockage-s3-ebs.md
const clf08 = `# Chapitre 8 : Services de Stockage AWS : S3, EBS, EFS et Glacier

## 1. Objectifs d'apprentissage
- Comprendre le stockage objet (S3), bloc (EBS) et fichier partagé (EFS).
- Connaître les classes de stockage Amazon S3 et leurs règles de cycle de vie.
- Identifier les caractéristiques des volumes EBS et des instantanés (Snapshots).
- Maîtriser l'archivage économique avec Amazon S3 Glacier.

## 2. Explication claire : quand choisir quoi
AWS propose 3 grands types de stockage :

1. Stockage Objet : Amazon S3 (Simple Storage Service)
- Stockage de données non structurées (fichiers jusqu'à 5 To dans des buckets).
- Durabilité de 99,999999999 % (11 neufs) multi-AZ.
- Classes de stockage :
  - S3 Standard : accès fréquent, latence milliseconde.
  - S3 Standard-IA : données moins fréquentes avec accès immédiat, frais de récupération par Go.
  - S3 One Zone-IA : stockage dans une seule AZ (20 % moins cher), pour données reproductibles.
  - S3 Glacier Flexible Retrieval : archivage, récupération de quelques minutes à quelques heures.
  - S3 Glacier Deep Archive : archivage le plus économique, récupération sous 12 heures.
  - S3 Intelligent-Tiering : déplace automatiquement les objets entre accès fréquent, peu fréquent et archive selon les motifs d'accès réels, sans frais de récupération.

2. Stockage Bloc : Amazon EBS (Elastic Block Store)
- Disque virtuel haute performance connecté en réseau à une seule instance EC2 dans la même zone de disponibilité.
- Utilisé pour le volume système (boot), bases relationnelles et fichiers à fortes IOPS.
- Sauvegardes incrémentielles stockées sur S3 via les Snapshots EBS.

3. Stockage Fichier : Amazon EFS (Elastic File System)
- Système de fichiers réseau géré (NFS) montable simultanément par des centaines d'instances multi-AZ.

## 3. Définitions des termes clés
- IOPS : opérations d'entrée/sortie par seconde.
- Règle de cycle de vie S3 : politique automatisée déplaçant les objets vers des classes plus froides ou les supprimant après X jours.
- Snapshots EBS : sauvegardes ponctuelles et incrémentielles sauvegardées sur S3.

## 4. Exemple concret
Une entreprise génère 50 Go de logs par jour :
- Jours 1 à 30 : dans S3 Standard pour les analyses opérationnelles.
- Jour 31 : règle de cycle de vie vers S3 Standard-IA.
- Jour 90 : transition automatique vers S3 Glacier.
- Jour 365 : purge définitive des logs.

## 5. Comparaisons et pièges d'examen
- S3 vs EBS : S3 est un stockage objet accessible via API HTTP depuis partout ; EBS est un disque virtuel bloc utilisable uniquement par une instance EC2 dans la même AZ.
- EBS vs EFS : EBS s'attache à une seule instance EC2 (sauf multi-attach io2) ; EFS est un partage de fichiers NFS partagé par des centaines d'instances à travers plusieurs AZ.
- S3 Intelligent-Tiering : réponse idéale d'examen pour optimiser les coûts quand les motifs d'accès sont inconnus ou changeants.

## 6. Lien avec SQL, Snowflake et Databricks
Amazon S3 est le socle des Data Lakes modernes : Snowflake y lit des fichiers externes via SQL (COPY INTO), et les tables Iceberg y enregistrent leurs fichiers Parquet.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 93 à 101.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quelle classe S3 optimise automatiquement les coûts sans frais de récupération lorsque les accès sont imprévisibles ?
   - A) S3 Intelligent-Tiering (Bonne réponse).
   - B) S3 Standard-IA.
   - C) S3 One Zone-IA.
   - D) S3 Glacier Deep Archive.
2. Quel service fournit un système de fichiers NFS montable simultanément par plusieurs instances EC2 multi-AZ ?
   - A) Amazon EFS (Bonne réponse).
   - B) Amazon EBS.
   - C) Amazon S3.
   - D) AWS Storage Gateway.
`;

// 3. Tighten clf-09-bases-donnees.md
const clf09 = `# Chapitre 9 : Services de Bases de Données AWS : RDS, DynamoDB et Redshift

## 1. Objectifs d'apprentissage
- Identifier les grands types de bases de données : Relationnelle (OLTP), NoSQL Clé-Valeur, Entrepôt (OLAP) et En mémoire.
- Connaître les moteurs gérés par Amazon RDS et les atouts d'Amazon Aurora.
- Comprendre les cas d'usage d'Amazon DynamoDB pour les données non relationnelles.
- Distinguer Amazon Redshift pour l'analytique et Amazon ElastiCache pour la mise en cache.

## 2. Explication claire : quand choisir quoi
AWS propose des bases spécialisées selon le modèle de données :

1. Bases relationnelles (OLTP) :
- Amazon RDS : service géré simplifiant patchs, sauvegardes et réplication Multi-AZ pour 6 moteurs (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, Aurora).
- Amazon Aurora : moteur relationnel compatible MySQL et PostgreSQL offrant jusqu'à 5 fois les performances de MySQL, avec réplication sur 6 copies dans 3 AZ et bascule en moins de 30 secondes.
- Quand choisir RDS/Aurora : pour transactions ACID, schémas relationnels et requêtes SQL complexes avec jointures.

2. Bases NoSQL (clé-valeur et documents) :
- Amazon DynamoDB : base NoSQL managée sans serveur offrant une latence inférieure à 10 millisecondes à toute échelle.
- Schéma flexible, auto-scaling et réplication multi-régions (Global Tables).
- Quand choisir DynamoDB : profils utilisateurs, paniers, sessions web, IoT et jeux vidéo.

3. Entrepôt de données analytique (OLAP) :
- Amazon Redshift : data warehouse SQL colonnaire à grande échelle pour analyser des pétaoctets de données et générer des tableaux de bord décisionnels.

4. Mise en cache en mémoire (In-Memory) :
- Amazon ElastiCache : cache mémoire compatible Redis et Memcached réduisant la latence des bases relationnelles en stockant les lectures fréquentes en RAM.

## 3. Définitions des termes clés
- Multi-AZ (RDS) : réplication synchrone vers une instance passive dans une autre AZ pour la haute disponibilité.
- Read Replicas : copies asynchrones pour décharger les lectures de l'instance principale.
- OLTP : transactions rapides et atomiques sur quelques lignes (ex. commande e-commerce).
- OLAP : requêtes analytiques complexes sur de gros volumes de colonnes (ex. CA annuel par région).

## 4. Exemple concret
Une boutique en ligne combine :
- Amazon Aurora Multi-AZ pour les commandes et paiements (ACID).
- Amazon DynamoDB pour les paniers et sessions à forte charge.
- Amazon Redshift pour le reporting BI quotidien.

## 5. Comparaisons et pièges d'examen
- RDS vs EC2 : sur EC2 le client gère OS, patchs et sauvegardes ; RDS automatise ces tâches.
- RDS Multi-AZ vs Read Replica : Multi-AZ sert à la haute disponibilité et la bascule en cas de panne ; Read Replica sert à la montée en charge des lectures.
- DynamoDB vs RDS : requêtes SQL relationnelles complexes = RDS ; latence sous 10 ms sans serveur et clé-valeur = DynamoDB.

## 6. Lien avec SQL, Snowflake et Databricks
Amazon Redshift est un entrepôt de données colonnaire similaire à Snowflake : tous deux optimisent les agrégations SQL (SUM, GROUP BY) par rapport aux bases OLTP.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 107 à 120.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel service NoSQL managé sans serveur offre une latence sous 10 ms pour du clé-valeur ?
   - A) Amazon DynamoDB (Bonne réponse).
   - B) Amazon RDS for MySQL.
   - C) Amazon Redshift.
   - D) Amazon Aurora.
2. Quelle est la fonction principale d'un déploiement Amazon RDS Multi-AZ ?
   - A) Assurer la haute disponibilité et la bascule automatique en cas de panne (Bonne réponse).
   - B) Accélérer les requêtes d'agrégation analytique.
   - C) Réduire le coût de facturation de 50 %.
   - D) Permettre des accès anonymes sans authentification IAM.
`;

// 4. Tighten clf-10-reseau-vpc.md
const clf10 = `# Chapitre 10 : Réseau Virtuel AWS et Sécurité Périmétrique (Amazon VPC)

## 1. Objectifs d'apprentissage
- Comprendre la structure d'Amazon VPC : sous-réseaux publics, privés et tables de routage.
- Distinguer les Groupes de Sécurité (Security Groups) et les NACL.
- Maîtriser le rôle des passerelles : Internet Gateway (IGW) et NAT Gateway.
- Connaître les options de connectivité hybride (Direct Connect, AWS VPN, VPC Peering).

## 2. Explication claire : quand choisir quoi
Amazon VPC permet de créer un réseau virtuel isolé avec une plage CIDR définie :

Composants d'un VPC :
- Sous-réseau public : relié à une Internet Gateway (IGW), permettant aux ressources d'avoir une IP publique et d'échanger avec Internet.
- Sous-réseau privé : isolé d'Internet sans accès entrant direct, pour les bases de données et serveurs applicatifs.
- Passerelle NAT (NAT Gateway) : située dans un sous-réseau public, elle permet aux instances privées d'accéder à Internet en sortie (mises à jour) sans accepter de connexions entrantes.
- Internet Gateway (IGW) : passerelle gérée hautement disponible reliant le VPC à Internet.

Sécurité réseau :
- Groupes de Sécurité (Security Groups) :
  - Pare-feu au niveau de l'instance (carte ENI).
  - À état (Stateful) : si le trafic entrant est autorisé, le trafic sortant de retour est automatiquement permis.
  - Règles d'autorisation uniquement (Allow rules).
- Listes de contrôle d'accès réseau (NACL) :
  - Pare-feu au niveau du sous-réseau entier.
  - Sans état (Stateless) : règles entrantes et sortantes requises.
  - Supporte les règles d'autorisation (Allow) et de refus (Deny), évaluées par ordre croissant.

Connectivité :
- AWS Direct Connect : liaison physique dédiée privée entre datacenter et AWS, évitant Internet.
- AWS Site-to-Site VPN : tunnel chiffré IPsec sur Internet public reliant un site à un VPC.
- Peering VPC : connexion directe privée entre deux VPC. Non transitif.

## 3. Définitions des termes clés
- Stateful : mémorise l'état de la connexion (Security Group).
- Stateless : ne mémorise rien, chaque paquet est filtré à l'entrée et à la sortie (NACL).
- Bloc CIDR : plage d'adresses IP attribuée au VPC (ex. 10.0.0.0/16).

## 4. Exemple concret
Architecture 3 tiers :
- Web tier : Load Balancer dans sous-réseau public relié à l'IGW.
- App tier : instances EC2 en sous-réseau privé communiquant via NAT Gateway.
- Data tier : base RDS en sous-réseau privé isolé, accessible uniquement depuis le Security Group applicatif.

## 5. Comparaisons et pièges d'examen
- Security Group vs NACL : Security Group opère au niveau de l'instance et est Stateful ; NACL opère au niveau du sous-réseau et est Stateless avec support de règles Deny.
- Direct Connect vs VPN : Direct Connect est une liaison physique dédiée ; VPN est un tunnel IPsec établi via Internet.
- NAT Gateway : doit impérativement être déployée dans un sous-réseau public.

## 6. Lien avec SQL, Snowflake et Databricks
AWS PrivateLink connecte votre VPC à un entrepôt Snowflake hébergé sur AWS sans transiter par Internet public, garantissant un transfert de données entièrement privé.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 61 à 74.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel pare-feu virtuel est à état (Stateful) et opère au niveau de l'instance EC2 ?
   - A) Le Groupe de Sécurité (Security Group) (Bonne réponse).
   - B) La liste de contrôle d'accès réseau (NACL).
   - C) La passerelle NAT.
   - D) Le routeur virtuel de sous-réseau.
2. Quel service fournit une liaison réseau physique dédiée privée sans passer par Internet ?
   - A) AWS Direct Connect (Bonne réponse).
   - B) AWS Site-to-Site VPN.
   - C) Amazon CloudFront.
   - D) AWS Storage Gateway.
`;

// 5. Tighten clf-12-facturation-support.md
const clf12 = `# Chapitre 12 : Facturation, Gestion des Coûts et Plans de Support AWS

## 1. Objectifs d'apprentissage
- Maîtriser les outils de coûts : Pricing Calculator, Cost Explorer, Budgets et Cost & Usage Report (CUR).
- Connaître les 4 plans de support (Basic, Developer, Business, Enterprise).
- Comprendre la facturation consolidée avec AWS Organizations.
- Identifier les avantages exclusifs Enterprise (TAM, réponse sous 15 min).

## 2. Explication claire : quand choisir quoi
Outils de gestion des coûts :
- AWS Pricing Calculator : estimation du coût d'une architecture avant déploiement.
- AWS Cost Explorer : visualisation et prévision des dépenses passées et futures (jusqu'à 12 mois).
- AWS Budgets : définition de seuils d'alerte budgétaire avec notifications email ou SNS.
- Cost and Usage Report (CUR) : fichier de facturation le plus détaillé, livré sur S3 en CSV ou Parquet.
- Facturation consolidée : regroupement de plusieurs comptes sous un compte payeur unique avec remises sur volume.

Les 4 niveaux de support AWS :
1. Support Basic :
   - Inclus gratuitement pour tous les comptes.
   - Support client 24/7 pour compte et facturation.
   - 7 contrôles de base dans Trusted Advisor. Pas d'ingénieurs techniques.
2. Support Developer :
   - Pour prototypage et tests.
   - Support technique par email en heures ouvrées (< 12h pour incident général).
3. Support Business :
   - Pour environnements de production.
   - Support 24/7 téléphone, chat et email avec ingénieurs Cloud Support.
   - Réponse < 1h pour production en panne. Accès complet à Trusted Advisor.
4. Support Enterprise :
   - Pour charges critiques d'entreprise.
   - Technical Account Manager (TAM) dédié et Infrastructure Event Management (IEM).
   - Réponse garantie < 15 min pour système critique arrêté (business-critical down).

## 3. Définitions des termes clés
- TAM (Technical Account Manager) : référent technique AWS dédié aux clients Enterprise.
- IEM (Infrastructure Event Management) : accompagnement d'experts AWS pour sécuriser les grands événements de charge.
- Balises de coûts (Cost Allocation Tags) : métadonnées clés-valeurs ventilant les dépenses par projet.

## 4. Exemple concret
Une entreprise déployant un site e-commerce critique souscrit au support Business pour avoir une assistance 24/7 par chat et téléphone avec garantie de réponse sous 1 heure en cas d'incident.

## 5. Comparaisons et pièges d'examen
- Pricing Calculator vs Cost Explorer : Pricing Calculator s'utilise avant le projet ; Cost Explorer s'utilise pendant et après avec les dépenses réelles.
- Cost Explorer vs Budgets : Cost Explorer sert à analyser des graphiques ; Budgets déclenche des alertes lors du franchissement de seuils.
- Plan Business vs Enterprise : Business offre 1h pour panne de production ; seul Enterprise offre 15 min pour panne critique avec TAM dédié.

## 6. Lien avec SQL, Snowflake et Databricks
Le rapport de coûts CUR déposé sur S3 peut être chargé et interrogé via SQL dans Snowflake pour analyser le coût précis des entrepôts de données.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 177 à 188.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel outil gratuit permet d'estimer le coût mensuel d'une infrastructure avant de créer les ressources ?
   - A) AWS Pricing Calculator (Bonne réponse).
   - B) AWS Cost Explorer.
   - C) AWS Budgets.
   - D) AWS Trusted Advisor.
2. Quel plan de support comprend un Technical Account Manager (TAM) dédié et un délai de réponse sous 15 minutes pour panne critique ?
   - A) Plan Enterprise (Bonne réponse).
   - B) Plan Business.
   - C) Plan Developer.
   - D) Plan Basic.
`;

// 6. Tighten clf-13-migration-disaster-recovery.md
const clf13 = `# Chapitre 13 : Stratégies de Migration Cloud et Plans de Reprise après Sinistre

## 1. Objectifs d'apprentissage
- Maîtriser les 7R de migration (Rehost, Replatform, Refactor, Repurchase, Retain, Retire, Relocate).
- Connaître les services de transfert : Snowcone, Snowball Edge, Snowmobile et DataSync.
- Comprendre AWS Database Migration Service (DMS) avec CDC.
- Distinguer les 4 stratégies de reprise après sinistre (Disaster Recovery).

## 2. Explication claire : quand choisir quoi
Stratégies de migration (Les 7R) :
1. Rehost (Lift-and-Shift) : déplacer des serveurs vers EC2 sans changer le code.
2. Replatform : optimisations légères sans refonte (ex. déplacer Oracle sur EC2 vers RDS for Oracle).
3. Refactor : réécrire l'application en mode Cloud Native (Serverless, conteneurs, microservices).
4. Repurchase : passage à une solution SaaS managée.
5. Relocate : déplacer des machines virtuelles (ex. VMware Cloud on AWS) sans reconfiguration.
6. Retain : conserver l'application sur site temporairement.
7. Retire : décommissionner les applications inutilisées.

Transfert de gros volumes de données :
- AWS Snowcone : boîtier compact et renforcé (8 à 14 To).
- AWS Snowball Edge : boîtier sécurisé (jusqu'à 80 To) pour migrer des dizaines de To par voie postale.
- AWS Snowmobile : conteneur de transport jusqu'à 100 Po pour les datacenters entiers.
- AWS DataSync : transfert accéléré en ligne par le réseau entre stockage local (NFS, SMB) et S3, EFS ou FSx.
- AWS DMS : migration de bases de données avec réplication continue (Change Data Capture - CDC).

Les 4 stratégies de Disaster Recovery :
1. Sauvegarde et restauration (Backup & Restore) : économique, RTO et RPO élevés.
2. Veilleuse (Pilot Light) : données répliquées en continu, calcul provisionné uniquement en cas de sinistre.
3. Attente chaude (Warm Standby) : version réduite fonctionnant en permanence dans une autre région.
4. Multi-sites actif-actif : infrastructure complète traitant le trafic en temps réel sur plusieurs régions. Zéro interruption.

## 3. Définitions des termes clés
- RTO (Recovery Time Objective) : durée maximale acceptable pour rétablir le service après un sinistre.
- RPO (Recovery Point Objective) : volume maximal acceptable de données perdues exprimé en durée.
- CDC (Change Data Capture) : capture et réplication continue des écritures de base de données.

## 4. Exemple concret
Une entreprise doit migrer 60 To de données avec une liaison Internet saturée de 100 Mbit/s (plus de 60 jours en ligne). Elle utilise un Snowball Edge : copie locale en 24h et transfert physique vers S3 en quelques jours.

## 5. Comparaisons et pièges d'examen
- Rehost vs Refactor : Rehost ne modifie aucun code ; Refactor repense l'architecture en Serverless.
- Pilot Light vs Warm Standby : Pilot Light garde le calcul éteint jusqu'au sinistre ; Warm Standby maintient un calcul actif minimal.
- Snowball vs DataSync : bande passante suffisante = DataSync ; volume massif et réseau lent = Snowball.

## 6. Lien avec SQL, Snowflake et Databricks
AWS DMS réplique en continu des bases relationnelles vers S3 en fichiers Parquet, constituant le lac de données brut alimentant Snowflake ou Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 189 à 200.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quelle stratégie de migration consiste à déplacer une application vers le cloud sans modifier son code source ?
   - A) Rehost (Lift-and-Shift) (Bonne réponse).
   - B) Refactor.
   - C) Repurchase.
   - D) Retire.
2. Quelle stratégie de reprise après sinistre maintient une version minimale mais active de l'infrastructure dans une seconde région ?
   - A) Warm Standby (Attente chaude) (Bonne réponse).
   - B) Pilot Light.
   - C) Backup & Restore.
   - D) Multi-Site Active-Active.
`;

const updates = [
  { file: 'clf-07-calcul-ec2.md', content: clf07 },
  { file: 'clf-08-stockage-s3-ebs.md', content: clf08 },
  { file: 'clf-09-bases-donnees.md', content: clf09 },
  { file: 'clf-10-reseau-vpc.md', content: clf10 },
  { file: 'clf-12-facturation-support.md', content: clf12 },
  { file: 'clf-13-migration-disaster-recovery.md', content: clf13 },
];

for (const u of updates) {
  const p = path.join(CHAPTERS_DIR, u.file);
  fs.writeFileSync(p, u.content.trim() + '\n', 'utf8');
  const count = u.content.trim().split(/\s+/).length;
  console.log(`Updated ${u.file}: ${count} words`);
}
