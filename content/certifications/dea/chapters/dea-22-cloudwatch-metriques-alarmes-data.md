# Chapitre 22 : Supervision Opérationnelle des Pipelines avec Amazon CloudWatch

## 1. Objectifs d'apprentissage
- Identifier les métriques critiques des services de données (Kinesis, Glue, EMR, Redshift, Lambda).
- Configurer Amazon CloudWatch Logs et CloudWatch Alarms avec notifications SNS.
- Détecter le ralentissement des consommateurs avec la métrique `GetRecords.IteratorAgeMilliseconds`.
- Comprendre les métriques de santé des clusters Redshift (CPU, HealthStatus, DiskSpace).

## 2. Explication claire : quand choisir quoi
Amazon CloudWatch est la tour de contrôle de la santé et des performances des architectures Data d'AWS :

1. Métriques clés par service de données à surveiller :
- Amazon Kinesis Data Streams :
  - `GetRecords.IteratorAgeMilliseconds` : mesure le retard (en millisecondes) du consommateur par rapport aux derniers enregistrements écrits dans le flux. Si cette valeur augmente régulièrement, cela signifie que le consommateur (Lambda ou KCL) est trop lent ou plante. Solution : augmenter le nombre de shards ou paralléliser les consommateurs.
  - `WriteProvisionedThroughputExceeded` : indique qu'un shard est saturé en écriture.
- AWS Glue ETL :
  - `glue.driver.aggregate.elapsedTime` : durée d'exécution totale du job.
  - `glue.ALL.jvm.heap.usage` : pourcentage de mémoire JVM consommé par les exécuteurs. Si cette valeur approche 100 %, le job risque d'échouer avec une erreur `OutOfMemoryError` (OOM). Solution : passer de G.1X à G.2X ou augmenter le nombre de DPU.
  - `glue.driver.ExecutorAllocationManager.decommissionedExecutors` : suivi de la mise à l'échelle dynamique.
- Amazon Redshift :
  - `CPUUtilization` : saturation du Leader ou des Compute Nodes.
  - `PercentageDiskSpaceUsed` : pourcentage d'espace disque utilisé. Alerte critique à déclencher à 80 % pour éviter le passage du cluster en mode lecture seule forcé.
  - `HealthStatus` : état de santé global du cluster.
- Amazon EMR :
  - `IsIdle` : indique si le cluster n'exécute aucune tâche Spark. Idéal pour déclencher l'arrêt automatique du cluster éphémère après 15 minutes d'inactivité.

2. CloudWatch Alarms et Actions automatisées :
- Déclenchement de notifications SNS pour avertir les ingénieurs par email/Slack.
- Déclenchement d'actions d'Auto Scaling (ex. ajout de nœuds Task EMR ou de workers Glue).
- Déclenchement d'automatisations via EventBridge ou arrêt de ressources en surcharge.

## 3. Définitions des termes clés
- IteratorAgeMilliseconds : métrique de décalage temporel d'un flux de streaming.
- CloudWatch Logs Insights : moteur de requêtes interactif pour analyser des gigaoctets de logs sans serveur avec syntaxe SQL/pipe.
- Metric Filter : règle extrayant des valeurs numériques ou comptant des occurrences de mots-clés dans les logs pour en faire une métrique CloudWatch.

## 4. Exemple concret
Alerte sur retard de consommation de streaming :
```
[Kinesis Stream : Transactions]
              |
              v (Retard > 60 000 ms)
[Métrique IteratorAgeMilliseconds]
              |
              v
[CloudWatch Alarm (Seuil: > 1 min pendant 2 périodes)]
              |
              v
   [Action SNS : Alerte Équipe Data On-Call]
```

## 5. Comparaisons et pièges d'examen
- IteratorAgeMilliseconds élevé : le réflexe d'examen est immédiatement d'identifier un problème côté consommateur (saturation CPU, erreur de boucle) ou un manque de shards de lecture.
- CloudWatch vs CloudTrail : CloudWatch surveille la performance et l'état opérationnel (combien de mémoire, temps de réponse) ; CloudTrail enregistre les appels d'API (qui a supprimé une table ou modifié un rôle).

## 6. Lien avec SQL, Snowflake et Databricks
La métrique IteratorAgeMilliseconds correspond au Lag Consumer dans Kafka ou à la table système `EVENT_LOG` dans Databricks Delta Live Tables indiquant le retard d'ingestion.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 296 à 305.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Quelle métrique Amazon CloudWatch devez-vous surveiller en priorité pour détecter qu'une application de streaming Kinesis accumule du retard par rapport au flux entrant de données ?
   - A) GetRecords.IteratorAgeMilliseconds (Bonne réponse).
   - B) PutRecord.Success.
   - C) IncomingBytes.
   - D) ReadProvisionedThroughputExceeded.
2. Un job AWS Glue ETL plante régulièrement avec une erreur OutOfMemoryError (OOM) lors d'une jointure massive. Quelle action de dimensionnement résout ce problème ?
   - A) Augmenter la capacité des workers de G.1X vers G.2X pour doubler la RAM par exécuteur (Bonne réponse).
   - B) Réduire le nombre de DPU à 2.
   - C) Désactiver les Job Bookmarks.
   - D) Remplacer Spark par un script bash.
