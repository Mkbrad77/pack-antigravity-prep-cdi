# Chapitre 2 : AWS Well-Architected Framework et ses 6 Piliers

## 1. Objectifs d'apprentissage
- Identifier et définir les 6 piliers officiels du Well-Architected Framework.
- Connaître les principes de conception directeurs pour chaque pilier.
- Savoir quel service AWS répond aux objectifs de chaque pilier lors d'un scénario d'examen.
- Utiliser l'outil AWS Well-Architected Tool pour mesurer les risques d'architecture.

## 2. Explication claire : quand choisir quoi
Le Well-Architected Framework fournit une méthode structurée pour évaluer et concevoir des architectures cloud fiables, sécurisées, performantes et économiques. Il repose sur 6 piliers fondamentaux :

1. Excellence Opérationnelle (Operational Excellence) :
   - Objectif : exécuter et surveiller les systèmes pour apporter de la valeur métier et améliorer continuellement les processus.
   - Principes clés : automatiser les opérations avec du code (IaC via CloudFormation), anticiper les pannes, effectuer de petits changements réversibles fréquents.
2. Sécurité (Security) :
   - Objectif : protéger les informations, les systèmes et les actifs tout en respectant la conformité.
   - Principes clés : appliquer le moindre privilège (IAM), sécuriser toutes les couches (défense en profondeur), chiffrer les données au repos et en transit, automatiser les contrôles de sécurité.
3. Fiabilité (Reliability) :
   - Objectif : garantir qu'une charge de travail fonctionne comme prévu et récupère rapidement des pannes.
   - Principes clés : tester les procédures de reprise, basculer automatiquement sur des ressources redondantes (Multi-AZ, Auto Scaling), concevoir des systèmes distribués tolérants aux pannes.
4. Efficacité des Performances (Performance Efficiency) :
   - Objectif : utiliser efficacement les ressources informatiques pour répondre aux exigences et maintenir cette efficacité face aux évolutions technologiques.
   - Principes clés : démocratiser les technologies avancées (IA managée, bases NoSQL), adopter des architectures sans serveur (Serverless), tester à l'échelle de la production.
5. Optimisation des Coûts (Cost Optimization) :
   - Objectif : exécuter les systèmes au coût le plus bas possible tout en apportant une valeur maximale.
   - Principes clés : mesurer l'efficacité globale, adopter un modèle de consommation souple (Savings Plans, Spot), analyser les dépenses avec Cost Explorer.
6. Durabilité (Sustainability) :
   - Objectif : minimiser l'impact environnemental des charges de travail cloud (empreinte carbone).
   - Principes clés : comprendre son impact, maximiser l'utilisation des ressources pour éviter le gaspillage, adopter de nouveaux processeurs économes en énergie (AWS Graviton).

## 3. Définitions des termes clés
- AWS Well-Architected Tool : service gratuit de la console AWS permettant de passer en revue ses charges de travail contre les questions des 6 piliers et de générer un plan d'action.
- Graviton : processeurs ARM conçus par AWS offrant jusqu'à 60 % de consommation énergétique en moins pour une performance supérieure.
- RPO (Recovery Point Objective) : volume maximal de données qu'une organisation peut tolérer de perdre lors d'un sinistre (exprimé en temps).
- RTO (Recovery Time Objective) : durée maximale admissible pour restaurer un service après une panne.

## 4. Exemple concret
Pour le pilier Fiabilité et Sécurité : une application Web critique déploie son groupe Auto Scaling sur 3 zones de disponibilité derrière un Application Load Balancer, ses données sur Amazon Aurora Multi-AZ avec réplication synchrone, et applique le chiffrement KMS avec des rôles IAM dédiés sans clés d'accès codées en dur.

## 5. Comparaisons et pièges d'examen
- Pilier Fiabilité vs Excellence Opérationnelle : la reprise après incident (Disaster Recovery) relève de la Fiabilité ; la gestion des déploiements sans interruption et l'automatisation des patchs relèvent de l'Excellence Opérationnelle.
- Pilier Optimisation des Coûts vs Efficacité des Performances : choisir une instance plus petite pour économiser est une question de Coût ; choisir un type d'instance optimisé pour la mémoire (famille R) pour accélérer une requête est une question de Performance.
- Durabilité : tout scénario mentionnant la réduction de l'empreinte carbone ou l'utilisation de Graviton cible le pilier Durabilité.

## 6. Lien avec SQL, Snowflake et Databricks
Le pilier Optimisation des coûts correspond aux règles de suspension automatique des entrepôts Snowflake (auto-suspend = 60 secondes). Le pilier Durabilité correspond au choix de clusters éphémères dans Databricks plutôt que de maintenir des machines allumées 24/7.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 197 à 199.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel pilier met l'accent sur l'anticipation des pannes et les petits changements réversibles ?
   - A) Excellence opérationnelle (Bonne réponse).
   - B) Sécurité.
   - C) Efficacité des performances.
   - D) Durabilité.
2. L'adoption des processeurs AWS Graviton pour réduire la consommation d'énergie soutient quel pilier ?
   - A) Durabilité (Bonne réponse).
   - B) Fiabilité.
   - C) Sécurité.
   - D) Excellence opérationnelle.
