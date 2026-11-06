# Fiche Express Domaine 3 : Opérations et Support des Données (22 %)

## 1. Vue d'ensemble du Domaine 3
Le Domaine 3 représente 22 % de l'examen DEA-C01. Il valide les compétences opérationnelles : surveillance de la santé des flux, audit des configurations, mesure de la qualité des données (DQDL), automatisation CI/CD (IaC) et stratégies de reprise après sinistre (RTO/RPO).

## 2. Les 12 Chiffres et Limites Critiques à Retenir
1. Kinesis IteratorAgeMilliseconds : métrique critique mesurant l'écart temporel entre l'arrivée d'un message et sa lecture par le consommateur.
2. Redshift PercentageDiskSpaceUsed : alerte recommandée à 80 % (à 100 %, le cluster bascule automatiquement en mode lecture seule).
3. EMR IsIdle : métrique de détection d'inactivité du cluster pour déclencher l'arrêt automatique et éviter les coûts résiduels.
4. AWS Glue Heap Usage (`jvm.heap.usage`) : saturation mémoire de la JVM à surveiller pour anticiper les erreurs OutOfMemoryError.
5. Historique d'événements CloudTrail (Event History) : 90 jours conservés gratuitement par défaut pour les Management Events.
6. CloudTrail Data Events : nécessaires pour enregistrer les opérations au niveau objet (S3 GetObject/PutObject et Lambda invocations), payants à l'usage.
7. AWS Glue Data Quality : syntaxe déclarative DQDL (Data Quality Definition Language) pour profiler et filtrer les données corrompues.
8. Économie des instances Spot : jusqu'à 90 % de remise par rapport au prix à la demande, préavis de révocation de 2 minutes.
9. RTO (Recovery Time Objective) : temps maximal admissible pour rétablir le service opérationnel après une panne.
10. RPO (Recovery Point Objective) : quantité maximale admissible de données perdues exprimée en durée.
11. Règle des 4 stratégies DR : Backup & Restore (heures/jours, économique) -> Pilot Light (minutes, calcul éteint) -> Warm Standby (minutes, calcul réduit actif) -> Multi-Site Actif-Actif (instantané, coût double).
12. Amazon QuickSight SPICE : moteur de calcul en mémoire colonnaire éliminant les coûts de requêtage répétés sur Athena et Redshift.

## 3. Matrice Décisionnelle d'Architecture : Quand Choisir Quoi
- Détecter un retard d'application sur un flux en continu : CloudWatch Alarm sur `GetRecords.IteratorAgeMilliseconds` de Kinesis.
- Tracer quel utilisateur a supprimé ou téléchargé un fichier sensible dans S3 : AWS CloudTrail avec Data Events S3 activés.
- Vérifier en continu la conformité des ressources (ex. compartiments non chiffrés) et corriger automatiquement : AWS Config avec document d'automatisation SSM.
- Valider l'absence de doublons et de valeurs nulles dans un pipeline ETL sans code complexe : AWS Glue Data Quality (règles DQDL).
- Isoler les mauvaises lignes sans faire échouer l'ensemble du pipeline : routage conditionnel Glue vers un compartiment S3 de quarantaine.
- Réduire les coûts d'un cluster EMR exécutant des calculs Spark lourds : nœuds Task sur instances Spot (Master et Core sur On-Demand).
- Arrêter les coûts de calcul Redshift la nuit pour la pré-production : planification de pause et reprise du cluster (Cluster Pause and Resume).
- Infrastructure as Code versionnée dans Git avec déploiements atomiques : AWS CloudFormation ou AWS CDK (en Python/TypeScript).
- Centraliser des chemins et variables de pipeline sans les coder en dur : AWS Systems Manager Parameter Store.
- Reprise après sinistre avec RPO court et coût maîtrisé sans double cluster permanent : stratégie Pilot Light.
- Tableaux de bord décisionnels interactifs avec sécurité par utilisateur : Amazon QuickSight avec SPICE et Row-Level Security (RLS).

## 4. Les 5 Pièges Majeurs d'Examen du Domaine 3
1. Confondre CloudWatch et CloudTrail : CloudWatch surveille les métriques de performance et déclenche des alarmes ; CloudTrail consigne les appels d'API (qui a fait quoi).
2. Spot sur nœuds EMR Core : placer des nœuds Core sur instances Spot risque de corrompre HDFS en cas de résiliation brutale. Seuls les Task Nodes doivent être en Spot.
3. Requêtes Direct Query sous QuickSight : connecter des centaines d'utilisateurs en Direct Query sur Athena scanne le lac S3 à chaque clic, provoquant des factures massives. Préférer SPICE.
4. Règle DQDL bloquante vs Quarantaine : faire échouer un job complet pour une seule ligne corrompue viole la disponibilité opérationnelle ; la pratique recommandée est de router l'enregistrement en quarantaine.
5. Pilot Light vs Warm Standby : dans Pilot Light, les serveurs de calcul sont complètement éteints ; dans Warm Standby, un environnement de secours réduit tourne en permanence.
