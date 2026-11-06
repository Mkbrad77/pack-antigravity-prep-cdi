# Fiche Express Section 1 : Développer des modèles dbt (30 %)

## 1. Vue d'ensemble de la Section 1
La Section 1 constitue le bloc le plus lourd de l'examen dbt Certified Developer (30 %). Elle évalue la capacité à structurer un projet dbt, sélectionner les matérialisations adéquates, utiliser Jinja et les macros, paramétrer les modèles incrémentaux et exploiter les sources et seeds.

## 2. Les 12 Chiffres, Seuils et Syntaxes Critiques à Retenir
1. 4 Matérialisations natives principales : `view` (défaut), `table`, `incremental`, `ephemeral`.
2. Seeds dbt : réservés aux fichiers CSV statiques de petite taille (< quelques mégaoctets, moins de 10 000 lignes) ; jamais pour les volumétries massives.
3. Syntaxe Jinja délimitée : `{{ expression }}` pour afficher une valeur ou appeler une fonction, `{% contrôle %}` pour boucles et conditions, `{# commentaire #}` pour commentaires non compilés.
4. Macro `ref('modele')` : crée automatiquement la dépendance dans le DAG et résout le nom de l'objet selon l'environnement (schéma/base).
5. Macro `source('nom_source', 'nom_table')` : déclare une dépendance vers une table brute non gérée par dbt.
6. Macro `is_incremental()` : renvoie `true` uniquement si la table cible existe déjà dans l'entrepôt, si la matérialisation est incrémentale et si `--full-refresh` n'est pas passé.
7. Stratégies incrémentales : `merge` (défaut sur Snowflake/BigQuery), `delete+insert`, `append`, `microbatch` (dbt 1.9+).
8. Paramètre `unique_key` : colonne ou liste de colonnes identifiant l'unicité de chaque ligne lors d'un `merge` incrémental.
9. Configuration `on_schema_change` : valeurs possibles `ignore` (défaut), `fail`, `append_new_columns`, `sync_all_columns`.
10. Modèles Python : prennent obligatoirement la signature `def model(dbt, session):` et doivent retourner un DataFrame.
11. Matérialisations supportées en Python : `table` et `incremental` exclusivement (`view` et `ephemeral` interdites).
12. Variables de projet : syntaxe `var('cle', 'valeur_defaut')`, surchargeable en CLI par `--vars '{"cle": "valeur"}'`.

## 3. Matrice Décisionnelle d'Architecture : Quand Choisir Quoi
- Tables de staging et vues intermédiaires légères : matérialisation `view` (zéro coût de stockage, fraîcheur temps réel).
- Tables de marts consommées par des tableaux de bord BI : matérialisation `table` (requêtes ultra-rapides, compute payé au build).
- Tables volumineuses de faits temporels ou logs : matérialisation `incremental` ou `microbatch`.
- Sous-requêtes SQL modulaires très simples partagées par 2 ou 3 modèles : matérialisation `ephemeral` (CTE injectée).
- Calculs statistiques avancés, inférence ML ou parsing NLP : modèles Python `.py` (exécutés via Snowpark ou Spark).
- Tables de mapping statiques (codes pays, catégories de produits) : `dbt seed` avec fichier CSV dans `seeds/`.

## 4. Les 5 Pièges Majeurs d'Examen de la Section 1
1. Tenter d'exécuter un modèle éphémère : la commande `dbt run --select mon_modele_ephemeral` ne crée aucun objet physique dans la base de données.
2. Oublier la macro `ref()` : si vous écrivez le nom de la table en dur dans le code SQL au lieu de `{{ ref('stg_orders') }}`, dbt ne peut pas construire le DAG et ordonner les exécutions.
3. Absence de `unique_key` sur un `merge` incrémental : sans clé unique, les réexécutions incrémentales génèrent des doublons ou provoquent une erreur SQL.
4. Priorité des configurations : le bloc `config()` dans le fichier `.sql` prévaut toujours sur les règles générales définies dans `dbt_project.yml`.
5. Modèle Python et vue : un modèle Python ne peut jamais être matérialisé en `view`. L'examen propose souvent cette option fausse.
