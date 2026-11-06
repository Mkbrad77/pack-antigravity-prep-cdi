# Modèles incrémentaux et microbatch

## 1. Objectifs d'apprentissage
Comprendre le fonctionnement interne de la matérialisation incrémentale standard et la macro is_incremental().
Identifier les différentes stratégies incrémentales : merge, delete+insert, append, microbatch.
Maîtriser la stratégie moderne microbatch introduite dans dbt Core 1.9 pour le traitement par fenêtres temporelles.
Savoir diagnostiquer et réparer la dérive des données via l'option --full-refresh.

## 2. Explication claire : quand choisir quoi
Les modèles incrémentaux évitent de recalculer la totalité d'une table à chaque exécution de dbt run, réduisant considérablement la durée de traitement et la facture cloud.
- **Incrémental standard (macro is_incremental())** :
  Lors de la première exécution, la table est créée intégralement.
  Lors des exécutions suivantes, le bloc conditionnel `{% if is_incremental() %}` filtre les lignes source dont l'horodatage dépasse la valeur maximale déjà présente dans la table cible (`this`).
- **Stratégies incrémentales traditionnelles** :
  - **merge** : Idéal lorsque des lignes existantes peuvent être mises à jour ou insérées (requiert unique_key).
  - **delete+insert** : Alternative efficace sur les moteurs où le MERGE est coûteux.
  - **append** : Uniquement pour les journaux d'événements immuables sans dédoublonnage.
- **Stratégie Microbatch (nouveauté majeure)** :
  Conçue pour les très grands volumes de séries temporelles. Au lieu de filtrer sur une clause WHERE arbitraire, dbt découpe automatiquement le traitement en petits lots temporels indépendants (par exemple heure par heure ou jour par jour).
  Avantage majeur : si un lot échoue, seul ce lot précis est rejoué, facilitant les reprises et les calculs parallèles.

## 3. Définitions des termes clés
- **is_incremental()** : Macro Jinja renvoyant true si la table cible existe déjà et si aucun --full-refresh n'est demandé.
- **this** : Référence Jinja désignant la table cible actuelle dans l'entrepôt.
- **unique_key** : Colonne ou liste de colonnes identifiant de manière unique une ligne pour les jointures de mise à jour.
- **microbatch** : Stratégie native dbt partitionnant l'ingestion par intervalles d'horodatage définis par event_time et batch_size.

## 4. Exemple concret
Configuration d'un modèle incrémental moderne avec stratégie microbatch :

```sql
-- models/marts/fct_evenements_iot.sql
{{ config(
    materialized='incremental',
    incremental_strategy='microbatch',
    unique_key='event_id',
    event_time='event_timestamp',
    batch_size='day',
    begin=modules.datetime.datetime(2026, 1, 1, tzinfo=modules.pytz.utc)
) }}

select
    event_id,
    device_id,
    event_timestamp,
    mesure_valeur
from {{ ref('stg_telemetrie') }}
```

## 5. Comparaisons et pièges d'examen
- **Piège de l'absence de unique_key** : Si vous utilisez merge sans définir unique_key, ou avec append, les réexécutions créeront des doublons dans la table cible.
- **Piège du changement de schéma** : Si vous ajoutez une colonne dans le modèle SQL, la table incrémentale existante ne recevra pas la colonne sauf si vous configurez on_schema_change='append_new_columns' ou 'sync_all_columns'.
- **Comportement de --full-refresh** : Force dbt à supprimer (drop) la table et à la reconstruire entièrement, ignorant la condition is_incremental().

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, la stratégie merge s'appuie sur la commande SQL native MERGE INTO hautement optimisée.
- Dans **Databricks**, Delta Lake utilise la commande MERGE native avec support du partition pruning.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 25 à 26, 101 à 103
- Cours secondaire Weigel : leçons 25 à 26, 125 à 127
- Documentation officielle : https://docs.getdbt.com/docs/build/incremental-microbatch (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Que retourne la macro is_incremental() lors d'une commande dbt run --full-refresh ? (Réponse : false)
2. Quel paramètre de configuration doit être défini pour qu'un modèle incrémental prenne en compte les nouvelles colonnes ? (Réponse : on_schema_change)
3. Quel est l'avantage principal de la stratégie incrémentale microbatch par rapport à un filtre classique ? (Réponse : Découpage automatique en fenêtres temporelles indépendantes facilitant les reprises et les recalculs ciblés)
