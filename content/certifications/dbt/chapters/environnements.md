# Environnements, cibles et variables d'environnement

## 1. Objectifs d'apprentissage
Configurer les environnements de travail (dev, staging, prod) dans profiles.yml.
Sélectionner la cible d'exécution via le flag --target (-t).
Sécuriser les identifiants et les paramètres sensibles avec la macro env_var().
Distinguer le schéma par défaut de développement des schémas d'entreprise en production.

## 2. Explication claire : quand choisir quoi
Un projet dbt unique doit pouvoir tourner sans modification de code sur la machine d'un développeur, sur un serveur d'intégration continue (CI) et en production.
- **Fichier profiles.yml** : Localisé hors du dépôt Git (dans ~/.dbt/ en local), il contient les profils de connexion et les cibles (targets).
- **Cibles (targets)** : Chaque profil définit une cible par défaut (default target) et plusieurs cibles nommées (ex: dev, prod). La commande `dbt run --target prod` permet de basculer instantanément de cible.
- **Variables d'environnement (env_var)** : Évitent d'écrire en clair les mots de passe, tokens et clés secrètes dans les fichiers YAML. La syntaxe supporte une valeur de repli optionnelle : `{{ env_var('DBT_PASSWORD', 'fallback') }}`.

## 3. Définitions des termes clés
- **target.name** : Variable de contexte Jinja contenant le nom de la cible actuelle (ex: 'dev' ou 'prod').
- **target.schema** : Nom du schéma de base de données associé à la cible courante.
- **env_var('VAR_NAME')** : Fonction Jinja extrayant la valeur d'une variable d'environnement de l'OS hôte.

## 4. Exemple concret
Configuration sécurisée dans ~/.dbt/profiles.yml :

```yaml
mon_projet:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_ACCOUNT') }}"
      user: "{{ env_var('SNOWFLAKE_USER') }}"
      password: "{{ env_var('SNOWFLAKE_PASSWORD') }}"
      role: transformer_dev
      database: analytics_dev
      warehouse: dev_wh
      schema: "dbt_{{ env_var('USER', 'default') }}"
      threads: 4

    prod:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_ACCOUNT') }}"
      user: "{{ env_var('SNOWFLAKE_PROD_USER') }}"
      password: "{{ env_var('SNOWFLAKE_PROD_PASSWORD') }}"
      role: transformer_prod
      database: analytics_prod
      warehouse: prod_wh
      schema: public
      threads: 8
```

Utilisation dans le code SQL pour isoler les tests :
```sql
select *
from {{ ref('stg_paiements') }}
{% if target.name == 'dev' %}
where date_paiement >= current_date - interval '7 days'
{% endif %}
```

## 5. Comparaisons et pièges d'examen
- **profiles.yml contre dbt_project.yml** : profiles.yml stocke les identifiants de connexion et ne doit JAMAIS être poussé dans Git. dbt_project.yml stocke la logique métier et est versionné dans Git.
- **Comportement de env_var sans valeur par défaut** : Si la variable d'environnement demandée n'existe pas et qu'aucune valeur de repli n'est fournie, dbt lève une erreur bloquante immédiate à l'analyse.
- **Threads** : Représente le nombre de requêtes SQL concurrentes que dbt envoie en parallèle au Data Warehouse.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, la cible configure le rôle (role), l'entrepôt virtuel (warehouse), la base de données et le schéma.
- Dans **Databricks**, la cible pointe vers un catalogue Unity Catalog et un cluster SQL Warehouse.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 109 à 113
- Cours secondaire Weigel : leçons 66 à 67
- Documentation officielle : https://docs.getdbt.com/docs/build/environment-variables (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel flag de commande en ligne permet de spécifier une cible de profil différente de celle par défaut ? (Réponse : --target ou -t)
2. Quel fichier dbt ne doit jamais être commité dans un dépôt de code public ou partagé pour des raisons de sécurité ? (Réponse : profiles.yml)
3. Comment écrire une variable d'environnement avec une valeur de repli sécurisée en Jinja ? (Réponse : {{ env_var('NOM_VARIABLE', 'valeur_par_defaut') }})
