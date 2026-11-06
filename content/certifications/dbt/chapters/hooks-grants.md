# Hooks et gestion des privilèges (Grants)

## 1. Objectifs d'apprentissage
Comprendre les différents types de hooks : on-run-start, on-run-end, pre-hook et post-hook.
Ordonnancer des actions SQL d'administration avant et après les builds de modèles.
Gérer les autorisations d'accès aux tables et vues via le bloc natif `grants`.
Éviter l'utilisation excessive de hooks pour des tâches gérées nativement par dbt.

## 2. Explication claire : quand choisir quoi
- **Pre-hooks et Post-hooks** : Instructions SQL exécutées immédiatement avant ou immédiatement après la construction d'un modèle spécifique. Typiquement utilisés pour créer des index, insérer des lignes de trace ou appeler des procédures stockées.
- **On-run-start et On-run-end** : Exécutés au début ou à la fin d'une commande dbt globale (`dbt run`, `dbt build`). Utilisés pour des vérifications globales de session ou l'enregistrement de logs d'audit.
- **Grants natifs** : Configuration déclarative recommandée pour attribuer les droits de lecture/écriture (`SELECT`, `INSERT`) aux rôles d'utilisateurs. **Bonne pratique moderne** : préférer toujours le bloc `grants` natif plutôt que des `GRANT SELECT` manuels dans des post-hooks.

## 3. Définitions des termes clés
- **Post-hook** : Bloc SQL exécuté après le commit du modèle dans la base de données.
- **Grants** : Mécanisme standard de dbt appliquant automatiquement les droits SQL après la création ou le remplacement d'une table ou vue.
- **Operations (dbt run-operation)** : Macros autonomes invoquées en ligne de commande pour des tâches de maintenance ponctuelle sans exécuter de modèle.

## 4. Exemple concret
Configuration des permissions avec le bloc `grants` dans `dbt_project.yml` :

```yaml
models:
  notre_projet:
    marts:
      +grants:
        select: ['role_analyste_bi', 'role_data_scientist']

    staging:
      +post-hook:
        - "ALTER TABLE {{ this }} SET TAG confidentialite = 'interne'"
```

Exécution d'une opération ponctuelle :
```bash
dbt run-operation vider_tables_temporaires --args '{schema_cible: staging_temp}'
```

## 5. Comparaisons et pièges d'examen
- **Variable {{ this }}** : Dans un pre-hook ou post-hook, `{{ this }}` fait référence à la relation de base de données courante (base.schema.table).
- **Post-hook contre Grants** : À l'examen, si la question demande la manière recommandée de donner des permissions de lecture à un groupe d'analystes, choisissez la fonctionnalité `grants` native plutôt qu'un post-hook.
- **Échec de transaction** : Si un pre-hook échoue, le modèle n'est pas exécuté. Si un post-hook échoue, le statut global du modèle est marqué en erreur (ERROR).

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, la fonctionnalité `grants` exécute des requêtes de type `GRANT SELECT ON TABLE ... TO ROLE ...` de manière idempotente, évitant les erreurs de droits lors des recréations complètes de tables.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 65, 66
- Cours secondaire Weigel : leçons 63 à 65
- Documentation officielle : https://docs.getdbt.com/docs/build/hooks-operations (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle fonctionnalité native de dbt doit être privilégiée pour attribuer des droits SELECT à des rôles au lieu d'utiliser des post-hooks ? (Réponse : La fonctionnalité grants)
2. Dans un post-hook, quelle variable Jinja référence la table en cours de construction ? (Réponse : {{ this }})
3. Quelle commande permet d'exécuter une macro administrative isolée sans lancer de modèles ? (Réponse : dbt run-operation)
