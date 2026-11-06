# Variables dans dbt

## 1. Objectifs d'apprentissage
Comprendre la portée et la déclaration des variables de projet dans dbt_project.yml.
Utiliser la fonction Jinja var() pour paramétrer dynamiquement les modèles SQL et les macros.
Surcharger les variables en ligne de commande via l'argument --vars.
Gérer les valeurs par défaut pour sécuriser l'exécution des requêtes.

## 2. Explication claire : quand choisir quoi
Les variables dbt permettent de paramétrer le code SQL sans le modifier en dur. Elles évitent la duplication de code et facilitent les exécutions modulaires.
- **Variables de projet dans dbt_project.yml** : Utilisées pour définir des constantes globales valables pour l'ensemble du projet (par exemple le fuseau horaire de référence, une liste de pays autorisés, ou un taux de TVA par défaut).
- **Surcharge en ligne de commande (--vars)** : Idéale pour des exécutions ponctuelles ou paramétrées par un orchestrateur (Airflow, Dagster). Par exemple, recalculer les données d'une date spécifique lors d'un backfill.
- **Syntaxe var()** : Prend en premier paramètre le nom de la variable, et en second paramètre optionnel une valeur par défaut. Il est fortement recommandé de toujours fournir une valeur par défaut pour éviter qu'un dbt compile n'échoue si la variable n'est pas passée.

## 3. Définitions des termes clés
- **var('nom_variable')** : Fonction Jinja extrayant la valeur d'une variable déclarée.
- **--vars '{"cle": "valeur"}'** : Argument CLI permettant d'injecter ou surcharger des variables au format JSON ou YAML.
- **dbt_project.yml (vars:)** : Bloc racine du fichier de configuration du projet stockant les variables par défaut.

## 4. Exemple concret
Déclaration dans le fichier dbt_project.yml :

```yaml
# dbt_project.yml
name: 'mon_projet_dbt'
version: '1.0.0'

vars:
  date_debut_analyse: '2026-01-01'
  pays_inclus: ['FR', 'DE', 'ES']
```

Utilisation dans un modèle SQL avec valeur de repli :

```sql
-- models/marts/fct_ventes_europe.sql
select
    id_vente,
    pays,
    montant_ht
from {{ ref('stg_ventes') }}
where date_vente >= '{{ var("date_debut_analyse", "2025-01-01") }}'
  and pays in (
      {%- for p in var("pays_inclus") -%}
          '{{ p }}'{% if not loop.last %}, {% endif %}
      {%- endfor -%}
  )
```

Surcharge en ligne de commande :
```bash
dbt run --select fct_ventes_europe --vars '{"date_debut_analyse": "2026-10-01"}'
```

## 5. Comparaisons et pièges d'examen
- **Priorité de surcharge** : Les variables passées en CLI via --vars ont une priorité absolue sur les variables déclarées dans dbt_project.yml.
- **Variables d'environnement contre variables de projet** : env_var() lit des variables du système d'exploitation hôte (mots de passe, tokens d'authentification). var() gère la logique de transformation du projet data.
- **Gestion des types** : Attention au formatage YAML/JSON dans l'invite de commande Windows : échappez convenablement les guillemets.

## 6. Lien avec SQL, Snowflake et Databricks
- Les variables dbt sont résolues lors de la phase de compilation Jinja, avant que le SQL pur ne soit transmis à Snowflake ou Databricks.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 97 à 101
- Cours secondaire Weigel : leçon 50
- Documentation officielle : https://docs.getdbt.com/docs/build/project-variables (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle fonction Jinja permet de lire une variable de projet avec une valeur de secours ? (Réponse : var('nom', 'valeur_par_defaut'))
2. Quel paramètre CLI dbt a la priorité sur les variables configurées dans dbt_project.yml ? (Réponse : --vars)
3. Quelle est la différence fondamentale entre var() et env_var() ? (Réponse : var() manipule des variables applicatives dbt, alors que env_var() lit les variables du système d'exploitation)
