# Chapitre 7 : Services de Calcul AWS et Modèles de Tarification EC2

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
