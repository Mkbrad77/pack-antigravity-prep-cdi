# Sources, seeds et fraîcheur des sources

## 1. Objectifs d'apprentissage
Déclarer des tables sources externes dans les fichiers YAML du projet dbt.
Exploiter la macro `source()` pour lier les tables brutes au graphe de lignage (DAG).
Surveiller la régularité des chargements de données avec `dbt source freshness`.
Gérer des fichiers de référence statiques via les seeds (`dbt seed`).

## 2. Explication claire : quand choisir quoi
- **Sources** : Données brutes chargées par des outils d'ingestion externes (Fivetran, Airbyte, Kafka, DMS). Elles sont déclarées dans des fichiers YAML sous la clé `sources:`. Elles ne sont jamais créées ni modifiées par dbt : dbt ne fait que les lire.
- **Seeds** : Fichiers CSV statiques placés dans le dossier `seeds/` et chargés dans l'entrepôt par la commande `dbt seed`. Idéal pour des tables de correspondances légères (codes postaux, mapping de devises, listes de pays). **Attention** : les seeds ne conviennent pas pour les gros volumes ou les données fréquemment modifiées.
- **Source Freshness** : Permet de vérifier si le processus d'ingestion en amont respecte ses SLA en comparant le timestamp de la colonne la plus récente avec l'heure courante.

## 3. Définitions des termes clés
- **Macro source()** : Fonction Jinja remplaçant les noms de tables brutes codés en dur par une référence traçable dans le catalogue.
- **loaded_at_field** : Colonne temporelle (ex: `loaded_at`, `created_at`) utilisée pour évaluer la fraîcheur des données.
- **warn_after / error_after** : Seuils de tolérance temporels (heures, jours) déclenchant des avertissements ou des erreurs lors du test de fraîcheur.

## 4. Exemple concret
Déclaration d'une source et de ses règles de fraîcheur :

```yaml
version: 2

sources:
  - name: shopify
    database: raw_data
    schema: shopify_landing
    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}
    loaded_at_field: _loaded_at
    tables:
      - name: orders
      - name: customers
```

Requête dans le modèle de staging :
```sql
select id, amount from {{ source('shopify', 'orders') }}
```

Commande de vérification :
```bash
dbt source freshness
```

## 5. Comparaisons et pièges d'examen
- **Source contre Ref** : On utilise `source('source_name', 'table_name')` pour des tables externes brutes, et `ref('model_name')` pour référencer d'autres modèles gérés par dbt.
- **Seeds contre Données volumineuses** : Ne jamais utiliser `dbt seed` pour charger des fichiers de données transactionnelles de plusieurs centaines de mégaoctets. Les seeds sont réservés aux données de référence statiques.
- **dbt run n'exécute pas source freshness** : La commande `dbt run` ne vérifie pas la fraîcheur des sources. Il faut explicitement exécuter `dbt source freshness`.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, les sources pointent vers les schémas de landing alimentés par Snowpipe ou des tables externes.
- Les seeds sont convertis en tables physiques dans Snowflake avec les types de colonnes inférés ou configurés dans `dbt_project.yml`.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 28 à 32
- Cours secondaire Weigel : leçons 15, 43, 52, 115
- Documentation officielle : https://docs.getdbt.com/docs/build/sources (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande permet d'évaluer le respect des SLA d'ingestion sur les tables externes ? (Réponse : dbt source freshness)
2. Quel type de fichier est utilisé pour stocker les seeds dans dbt ? (Réponse : Fichiers CSV)
3. Comment référence-t-on la table 'users' de la source 'stripe' dans un modèle ? (Réponse : {{ source('stripe', 'users') }})
