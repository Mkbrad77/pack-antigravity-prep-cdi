# Chapitre 3.18 : Conception d'orchestration : Reprise sur panne et DAGs

## 1. La question classique posée en entretien
« Votre DAG Airflow quotidien échoue à la 5ème étape sur 8 à 3h du matin. Comment concevez-vous vos pipelines pour que la reprise soit automatique ou se fasse sans recalculer les 4 premières étapes ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre découpage granulaire des tâches (tâches modulaires vs gros script monolithique).
- Votre paramétrage des politiques de réessai (`retries`, `retry_delay`, backoff exponentiel).
- La gestion des alertes et du SLA (Service Level Agreement).

## 3. Réponse d'ingénieur senior

### A. Bonnes pratiques de conception de DAG
1. **Granularité unitaire :** Chaque tâche du DAG doit être atomique, idempotente et vérifier le principe de responsabilité unique (ex. Tâche 1 : Vérifier l'arrivée du fichier S3 via un Sensor ; Tâche 2 : Lancer le job Glue ; Tâche 3 : Exécuter dbt test).
2. **Gestion des retries avec backoff exponentiel :**
   Pour les pannes transitoires (latence réseau, quotas API temporaires), configurer :
   `retries: 3, retry_delay: timedelta(minutes=2), retry_exponential_backoff: True`.
3. **Reprise ciblée (Clear task instance) :**
   En cas d'échec définitif, Airflow permet de relancer la tâche en échec et ses descendantes (`downstream`), préservant les calculs déjà validés en amont.

### B. Séparation Orchestrateur vs Exécuteur de Calcul
L'orchestrateur (Airflow, Dagster, Prefect) ne doit jamais faire transiter de gros volumes de données en mémoire. Il se contente d'ordonnancer et de déclencher les calculs sur les moteurs dédiés (Spark, Snowflake, dbt Cloud).

## 4. Erreurs fatales à éviter absolument
- Télécharger un fichier CSV de 10 Go directement dans le conteneur du worker Airflow.
- Configurer des capteurs (Sensors) en mode bloquant (`poke`) qui monopolisent les slots d'exécution, au lieu d'utiliser le mode `reschedule`.
