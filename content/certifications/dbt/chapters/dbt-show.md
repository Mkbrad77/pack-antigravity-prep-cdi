# Commande dbt show

## 1. Objectifs d'apprentissage
Comprendre l'utilité et le fonctionnement de la commande dbt show introduite dans dbt Core 1.5.
Visualiser un aperçu instantané des résultats de transformation directement dans le terminal.
Utiliser dbt show avec du SQL ad-hoc sans créer de fichier de modèle persistant.
Contrôler le nombre de lignes prévisualisées via le flag --limit.

## 2. Explication claire : quand choisir quoi
Avant l'apparition de `dbt show`, pour voir le résultat d'un modèle dbt en cours d'écriture, les ingénieurs devaient compiler le modèle, copier le SQL depuis `target/compiled/` et le coller dans l'interface web de Snowflake ou Databricks.
- **dbt show** : Exécute la requête dans l'entrepôt et affiche directement un tableau ASCII des 5 premières lignes dans le terminal, sans créer ni modifier de vue ou de table physique dans la base de données.
- **Cas d'usage 1 : Vérification rapide d'un modèle** :
  `dbt show --select mon_nouveau_modele`
- **Cas d'usage 2 : Requête ad-hoc avec Jinja** :
  Grâce au paramètre `--inline`, vous pouvez tester une instruction SQL contenant des macros Jinja à la volée :
  `dbt show --inline "select * from {{ ref('stg_orders') }} limit 10"`

## 3. Définitions des termes clés
- **dbt show** : Commande CLI exécutant une requête et affichant le résultat tabulaire dans la console.
- **--inline "SQL"** : Option permettant de passer une requête SQL brute en ligne de commande sans fichier .sql.
- **--limit N** : Détermine le nombre maximal de lignes retournées et affichées (par défaut 5 lignes).

## 4. Exemple concret
Exécution de dbt show sur un modèle existant :

```bash
# Affiche un aperçu des 5 premières lignes de fct_ventes
dbt show --select fct_ventes

# Affiche les 10 premières lignes d'une requête dynamique Jinja
dbt show --limit 10 --inline "select customer_id, sum(amount) from {{ ref('fct_orders') }} group by 1"
```

Rendu dans le terminal :
```text
| customer_id | sum(amount) |
|-------------|-------------|
| 1001        | 450.50      |
| 1002        | 120.00      |
| 1003        | 899.99      |
```

## 5. Comparaisons et pièges d'examen
- **dbt show contre dbt compile** : `dbt compile` ne fait que générer le code SQL dans `target/` sans interroger les données. `dbt show` envoie la requête à l'entrepôt et ramène les résultats à l'écran.
- **dbt show contre dbt run** : `dbt run` crée ou remplace des tables/vues physiques dans la base. `dbt show` n'enregistre aucune table ni vue : il s'agit d'un simple SELECT éphémère d'aperçu.
- **Limite par défaut** : La limite par défaut de lignes affichées par `dbt show` est de 5 lignes.

## 6. Lien avec SQL, Snowflake et Databricks
- Exécute un `SELECT` avec clause `LIMIT` sur l'entrepôt, consommant un temps de calcul minimal pour un retour visuel immédiat.

## 7. Renvois aux cours et documentation
- Cours principal Toth : Non couvert
- Cours secondaire Weigel : leçon 121
- Documentation officielle : https://docs.getdbt.com/reference/commands/show (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel est le nombre par défaut de lignes retournées par la commande dbt show si le flag --limit n'est pas spécifié ? (Réponse : 5 lignes)
2. Quel paramètre permet d'exécuter une requête SQL ad-hoc directement depuis le terminal avec dbt show sans créer de fichier ? (Réponse : --inline)
3. Est-ce que dbt show crée une table ou une vue physique dans la base de données cible ? (Réponse : Non, aucune table ni vue n'est créée)
