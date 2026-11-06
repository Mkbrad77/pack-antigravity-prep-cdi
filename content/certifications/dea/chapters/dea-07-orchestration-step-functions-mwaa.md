# Chapitre 7 : Orchestration de Pipelines : AWS Step Functions vs Amazon MWAA (Apache Airflow)

## 1. Objectifs d'apprentissage
- Comprendre les cas d'usage d'AWS Step Functions et ses machines à états (Standard vs Express).
- Découvrir Amazon Managed Workflows for Apache Airflow (MWAA) et son architecture de DAGs Python.
- Savoir choisir entre Step Functions et MWAA selon la complexité et les compétences de l'équipe.
- Maîtriser le Distributed Map de Step Functions pour le traitement hautement parallèle.

## 2. Explication claire : quand choisir quoi
L'orchestration coordonne les différentes étapes d'un pipeline de données (ingestion, validation, transformation Glue/EMR, chargement Redshift, notification) :

1. AWS Step Functions :
- Qu'est-ce que c'est : orchestrateur sans serveur basé sur des machines à états visuelles définies en JSON (Amazon States Language - ASL).
- Quand le choisir :
  - Pour des flux orientés événements hautement intégrés avec les services AWS natifs (Lambda, Glue, Athena, Batch, SNS, DynamoDB).
  - Pour orchestrer des workflows sans gérer la moindre infrastructure ni serveur web.
  - Pour paralléliser massivement le traitement de millions d'objets S3 grâce à l'état `Distributed Map`.
- Workflows Standard vs Express :
  - Standard : durée d'exécution jusqu'à 1 an, exécution exactement une fois (exactly-once), historique d'exécution complet visuel. Idéal pour les pipelines ETL critiques longs.
  - Express : durée d'exécution jusqu'à 5 minutes, exécution au moins une fois (at-least-once), débit élevé (> 100 000 exécutions/s), coût très faible. Idéal pour l'ingestion d'événements et le streaming IoT.

2. Amazon MWAA (Managed Workflows for Apache Airflow) :
- Qu'est-ce que c'est : service géré pour Apache Airflow, permettant d'exécuter des DAGs (Directed Acyclic Graphs) écrits entièrement en code Python.
- Quand le choisir :
  - Lorsque l'équipe dispose déjà d'une expertise Airflow ou de centaines de DAGs existants.
  - Pour orchestrer des pipelines multi-clouds ou hybrides impliquant des systèmes hors AWS (Snowflake, Databricks, Salesforce, bases sur site) grâce aux milliers d'opérateurs open source de la communauté Airflow.
  - Lorsque les dépendances entre tâches exigent des logiques dynamiques complexes exprimées en pur code Python.

## 3. Définitions des termes clés
- State Machine (Machine à états) : définition formelle d'un workflow dans Step Functions composée d'états (Task, Choice, Parallel, Map, Pass, Fail).
- Distributed Map : mode d'exécution Step Functions capable d'itérer en parallèle jusqu'à 10 000 exécutions concurrentes sur des fichiers stockés dans S3.
- DAG (Directed Acyclic Graph) : graphe orienté sans cycle représentant les dépendances de tâches dans Apache Airflow.

## 4. Exemple concret
Workflow Step Functions classique de pipeline de données :
```
[Start] -> [Valider fichier Lambda]
                 |
        {Fichier valide ?}
         /              \
     (Oui)             (Non) -> [Notifier SNS Alerte] -> [Fail]
       v
[Lancer Job Glue ETL]
       v
[Attendre fin du Job (sync)]
       v
[Exécuter requête SQL Athena]
       v
[Notifier succès SNS] -> [Success]
```

## 5. Comparaisons et pièges d'examen
- Step Functions vs MWAA : Step Functions est 100 % serverless, sans aucun temps d'initialisation ni maintenance de version ; MWAA nécessite le provisionnement d'un environnement Airflow avec des workers et une interface web dédiée.
- Gestion des erreurs et reprises : Step Functions intègre nativement des blocs `Retry` (avec backoff exponentiel) et `Catch` au niveau de chaque tâche sans code supplémentaire.
- Tâches synchrones (`.sync`) : dans Step Functions, ajouter le suffixe `.sync` à un appel de service (ex. `arn:aws:states:::glue:startJobRun.sync`) permet à Step Functions d'attendre la complétion effective du job Glue avant de passer à l'état suivant.

## 6. Lien avec SQL, Snowflake et Databricks
MWAA est l'outil privilégié des équipes Data pour orchestrer des transformations complexes combinant des modèles dbt, des tâches d'extraction Python, des rafraîchissements de tables dynamiques Snowflake et des notebooks Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 231 à 245.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Une équipe data doit orchestrer un pipeline ETL quotidien qui exécute un job Glue, attend sa terminaison, puis déclenche un rafraîchissement Redshift. Elle ne souhaite gérer aucun serveur ni infrastructure applicative. Quelle solution choisir ?
   - A) AWS Step Functions avec une machine à états de type Standard (Bonne réponse).
   - B) Amazon EC2 avec un démon cron Linux.
   - C) Amazon Managed Workflows for Apache Airflow avec taille de cluster maximale.
   - D) AWS CloudTrail avec alarmes CloudWatch.
2. Quelle fonctionnalité de Step Functions permet de diviser un fichier de métadonnées contenant 50 000 lignes et de lancer des traitements Lambda hautement parallèles jusqu'à 10 000 exécutions simultanées ?
   - A) L'état Distributed Map (Bonne réponse).
   - B) L'état Choice.
   - C) L'état Pass.
   - D) L'intégration avec AWS Secrets Manager.
