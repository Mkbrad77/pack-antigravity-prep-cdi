# Chapitre 6 : Ingestion Orientée Événements avec AWS Lambda et Traitement par Lots avec AWS Batch

## 1. Objectifs d'apprentissage
- Comprendre les déclencheurs d'événements Lambda (notifications S3, Kinesis, SQS).
- Maîtriser les limites d'AWS Lambda (durée maximale de 15 minutes, mémoire, stockage éphémère `/tmp`).
- Savoir quand basculer d'AWS Lambda vers AWS Batch pour les calculs longs ou conteneurisés.
- Utiliser AWS Batch avec des environnements de calcul gérés et des instances Spot.

## 2. Explication claire : quand choisir quoi
AWS propose deux paradigmes complémentaires de calcul réactif et par lots :

1. AWS Lambda (Calcul Sans Serveur Réactif) :
- Qu'est-ce que c'est : exécution de code sans serveur en réponse directe à des événements système.
- Cas d'usage en Data Engineering :
  - Déclenchement sur nouvel objet S3 (ObjectCreated) pour validation, extraction de métadonnées ou lancement de Step Functions.
  - Consommation par micro-lots d'enregistrements provenant d'Amazon Kinesis Data Streams ou de files d'attente SQS.
- Limites critiques à mémoriser pour l'examen :
  - Temps d'exécution maximal strict : 15 minutes (900 s). Tout traitement plus long doit utiliser AWS Glue, Batch ou ECS/EMR.
  - Mémoire allouée : de 128 Mo à 10 240 Mo (10 Go). Le CPU est proportionnel à la mémoire allouée.
  - Disque temporaire `/tmp` : de 512 Mo à 10 240 Mo (10 Go).

2. AWS Batch (Orchestration de Calcul par Lots à Grande Échelle) :
- Qu'est-ce que c'est : planificateur de tâches de calcul par lots exécutant des conteneurs Docker sur des instances EC2 managées ou AWS Fargate.
- Quand le choisir : pour des tâches de traitement de données lourdes, scientifiques, ou des scripts Python/C++ complexes dont la durée d'exécution dépasse les 15 minutes de Lambda, sans vouloir configurer un cluster Spark ou EMR complet.
- Environnements de calcul (Compute Environments) :
  - Géré : AWS provisionne et met à l'échelle automatiquement les instances EC2 selon la file d'attente.
  - Support des instances Spot : exécution par lots avec jusqu'à 90 % d'économie.

## 3. Définitions des termes clés
- Event Source Mapping : composant interne à Lambda qui lit en continu des flux (Kinesis, DynamoDB Streams) ou des files (SQS) et invoque la fonction Lambda de manière synchrone.
- Job Definition (AWS Batch) : modèle décrivant l'image Docker, la commande à exécuter, les vCPU et la mémoire RAM nécessaires à une tâche Batch.
- Dead Letter Queue (DLQ) : file d'attente SQS ou sujet SNS recueillant les événements ayant échoué à être traités par Lambda après épuisement des tentatives de réessai.

## 4. Exemple concret
Pipeline d'ingestion par événement avec bascule vers Batch :
```
[Fichier client .zip déposé sur S3]
             |
             v
   [Événement S3 ObjectCreated]
             |
             v
[AWS Lambda (Vérification en 5 sec)]
   - Si fichier < 100 Mo -> Décompression et écriture directe sur S3
   - Si fichier > 100 Mo -> Soumission d'une tâche à AWS Batch (Conteneur Docker sur Fargate/EC2)
```

## 5. Comparaisons et pièges d'examen
- Lambda vs AWS Glue : Lambda est idéal pour les transformations unitaires événementielles ultra-rapides (< 15 min, fichiers légers) ; Glue est optimisé pour les transformations distribuées massives avec Apache Spark sur plusieurs gigaoctets ou téraoctets.
- Dimensionnement Lambda : augmenter la mémoire RAM allouée à une fonction Lambda augmente automatiquement la puissance vCPU allouée de manière linéaire, ce qui réduit souvent le temps d'exécution et peut même diminuer le coût total.
- Batch vs EMR : AWS Batch exécute des conteneurs Docker arbitraires indépendants ; EMR exécute des frameworks distribués Big Data (Spark, Hive) partageant un contexte d'exécution distribué.

## 6. Lien avec SQL, Snowflake et Databricks
Les fonctions AWS Lambda réactives jouent exactement le même rôle que les Cloud Functions déclenchant les Snowpipes dans Snowflake lors de l'arrivée d'un fichier S3, ou les webhooks de démarrage de jobs dans Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 216 à 230.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Un pipeline doit traiter chaque nuit des fichiers volumineux dont la transformation en Python prend entre 45 et 60 minutes par fichier. Quelle solution de calcul sans gestion manuelle de serveurs convient ?
   - A) AWS Batch avec un environnement de calcul géré exécutant un conteneur Docker (Bonne réponse).
   - B) AWS Lambda avec allocation de 10 Go de RAM.
   - C) Amazon API Gateway avec intégration synchrone.
   - D) Une instance EC2 t2.micro permanente sans arrêt.
2. Que se passe-t-il si un script d'ingestion de données s'exécutant dans une fonction AWS Lambda n'a pas terminé son traitement au bout de 15 minutes ?
   - A) La fonction est arrêtée de force par AWS avec une erreur de timeout (Bonne réponse).
   - B) AWS prolonge l'exécution de 15 minutes supplémentaires avec surcoût.
   - C) Le traitement est automatiquement transféré vers AWS Glue.
   - D) La mémoire RAM est doublée automatiquement.
