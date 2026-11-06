# Fiche Express : Domaine 3 - Technologies et Services Cloud (Pondération officielle : 34 %)

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
