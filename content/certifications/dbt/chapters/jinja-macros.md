# Jinja et macros dans dbt

## 1. Objectifs d'apprentissage
Maîtriser les trois délimiteurs Jinja essentiels de dbt : expressions, instructions et commentaires.
Développer des macros réutilisables dans le dossier `macros/`.
Exploiter les macros intégrées dbt (`ref()`, `source()`, `config()`, `adapter`).
Utiliser la macro `run_query` pour exécuter du SQL dynamique au moment de la compilation.

## 2. Explication claire : quand choisir quoi
dbt combine le SQL standard avec le moteur de templating Jinja. Cela permet de rendre le code SQL modulaire et d'éviter les copier-coller répétitifs (principe DRY : Don't Repeat Yourself) :
- **Délimiteur d'expression `{{ ... }}`** : Affiche du texte compilé dans le SQL (appels de macros, variables, fonctions `ref()`).
- **Délimiteur d'instruction `{% ... %}`** : Gère la logique de contrôle de flux (boucles `for`, conditions `if/else`, assignation de variables avec `set`).
- **Délimiteur de commentaire `{# ... #}`** : Commentaires Jinja ignorés à la compilation et non transmis au Data Warehouse.

## 3. Définitions des termes clés
- **Macro** : Fonction Jinja réutilisable acceptant des arguments et retournant du code SQL compilé, stockée dans `macros/`.
- **Target context** : Objet Jinja contenant des métadonnées d'exécution (`target.name`, `target.schema`).
- **Adapter** : Objet permettant d'écrire du code multi-entrepôts s'adaptant au dialecte SQL de la cible (`adapter.dispatch`).

## 4. Exemple concret
Création d'une macro dans `macros/cents_to_dollars.sql` :

```sql
{% macro cents_to_dollars(column_name, decimal_places=2) -%}
    round(cast({{ column_name }} as numeric) / 100, {{ decimal_places }})
{%- endmacro %}
```

Utilisation dans un modèle :
```sql
select
    order_id,
    {{ cents_to_dollars('order_total_cents') }} as order_total_usd
from {{ ref('stg_payments') }}
```

## 5. Comparaisons et pièges d'examen
- **Compilation avant exécution** : Le moteur Jinja s'exécute sur le poste ou le serveur dbt lors de la compilation; il ne s'exécute pas dans l'entrepôt. Le résultat compilé envoyé au Warehouse est du pur SQL.
- **run_query et parsing** : Lorsqu'on utilise la macro `run_query()`, il faut toujours encapsuler l'appel dans `{% if execute %}` pour éviter que dbt tente d'exécuter la requête lors de la phase initiale d'analyse (parsing).
- **Tirets dans les balises `{%- ... -%}`** : Ils servent à supprimer les espaces et retours à la ligne superflus pour produire un code SQL propre.

## 6. Lien avec SQL, Snowflake et Databricks
- Les macros permettent d'abstraire les fonctions spécifiques aux dialectes (ex: différences de syntaxe de manipulation des dates entre Snowflake `DATEADD` et BigQuery `DATE_ADD`).

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 50 à 56
- Cours secondaire Weigel : leçons 33 à 38
- Documentation officielle : https://docs.getdbt.com/docs/build/jinja-macros (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel délimiteur Jinja permet d'afficher la valeur d'une variable ou le résultat d'une macro ? (Réponse : {{ ... }})
2. Pourquoi doit-on utiliser la condition {% if execute %} autour d'une macro exécutant du SQL ? (Réponse : Pour ne l'exécuter que lors de l'exécution réelle et non pendant la phase de parsing initiale)
3. Où sont obligatoirement enregistrées les macros créées par l'utilisateur ? (Réponse : Dans le dossier macros/ du projet)
