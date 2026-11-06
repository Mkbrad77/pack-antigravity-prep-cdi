# Snapshots et historisation SCD Type 2

## 1. Objectifs d'apprentissage
Comprendre le principe du Slow Changing Dimension Type 2 (SCD2) appliqué par les snapshots dbt.
Configurer les deux stratégies de détection de changements : stratégie `timestamp` et stratégie `check`.
Interpréter et exploiter les colonnes de métadonnées générées automatiquement par dbt.
Éviter les erreurs d'invalidation et de clés primaires dans la conception des snapshots.

## 2. Explication claire : quand choisir quoi
Les systèmes source écrasent souvent les données lors des mises à jour (ex: l'adresse d'un client dans une table relationnelle). Pour conserver l'historique de chaque état, dbt utilise des snapshots :
- **Stratégie timestamp** : Recommandée et privilégiée. Elle s'appuie sur une colonne horodatée fiable du système source (ex: `updated_at`) qui change à chaque modification de la ligne.
- **Stratégie check** : À utiliser uniquement si le système source ne propose pas de colonne de date de mise à jour. dbt compare les valeurs d'une liste de colonnes spécifiées (`check_cols: ['status', 'email']`) ou de toutes les colonnes (`check_cols: 'all'`).

## 3. Définitions des termes clés
- **SCD Type 2** : Méthode d'entrepôt de données qui historise chaque modification en fermant l'ancienne ligne et en insérant une nouvelle ligne avec de nouvelles dates de validité.
- **dbt_valid_from / dbt_valid_to** : Colonnes ajoutées par dbt indiquant l'intervalle de temps pendant lequel la version de l'enregistrement était active.
- **dbt_scd_id** : Clé de substitution unique générée par hachage de la clé primaire et de la date de validité.

## 4. Exemple concret
Déclaration d'un snapshot dans le dossier `snapshots/orders_snapshot.sql` :

```sql
{% snapshot orders_snapshot %}

{{
    config(
      target_database='analytics',
      target_schema='snapshots',
      unique_key='id',
      strategy='timestamp',
      updated_at='updated_at',
      invalidate_hard_deletes=True
    )
}}

select * from {{ source('ecommerce', 'orders') }}

{% endsnapshot %}
```

Commande d'exécution :
```bash
dbt snapshot
```

## 5. Comparaisons et pièges d'examen
- **dbt_valid_to null** : Pour la version active actuelle d'un enregistrement, la valeur de `dbt_valid_to` est `NULL`. C'est un point classique d'examen pour filtrer l'état courant (`WHERE dbt_valid_to IS NULL`).
- **unique_key obligatoire** : Une clé primaire ou composite unique est strictement obligatoire pour que dbt sache quelle ligne suivre.
- **Hard deletes** : Par défaut, si une ligne disparaît du système source, dbt ne modifie pas le snapshot. Pour fermer la validité des lignes supprimées, il faut activer `invalidate_hard_deletes=True`.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, les snapshots exploitent des requêtes de type `MERGE` optimisées.
- Cette approche remplace avantageusement les flux complexes de CDC faits main en écrivant directement une table historisée exploitable en SQL.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 33 à 36
- Cours secondaire Weigel : leçons 122 à 124
- Documentation officielle : https://docs.getdbt.com/docs/build/snapshots (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle est la valeur de la colonne dbt_valid_to pour la ligne actuellement active d'un client ? (Réponse : NULL)
2. Quelle stratégie de snapshot est recommandée si la source dispose d'une colonne updated_at fiable ? (Réponse : Stratégie timestamp)
3. Quel paramètre permet d'invalider une ligne lorsque celle-ci est physiquement effacée de la source ? (Réponse : invalidate_hard_deletes=True)
