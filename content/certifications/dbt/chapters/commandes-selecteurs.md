# Commandes dbt et syntaxe des sélecteurs

## 1. Objectifs d'apprentissage
Maîtriser les commandes d'exécution majeures : dbt run, test, build, compile, seed, snapshot.
Utiliser la syntaxe avancée des sélecteurs (`--select` et `--exclude`).
Comprendre les opérateurs de graphe : plus (`+`), arrobase (`@`), intersection (virgule) et exclusion.
Définir des sélecteurs réutilisables dans le fichier `selectors.yml`.

## 2. Explication claire : quand choisir quoi
- **dbt run** : Compile et exécute les modèles pour créer tables et vues. N'exécute aucun test.
- **dbt test** : Exécute uniquement les tests de données et tests unitaires sur les objets existants.
- **dbt build** : Commande reine recommandée en production. Elle exécute dans l'ordre du DAG les seeds, les modèles, les tests et les snapshots. Si un modèle ou un test amont échoue, l'exécution des nœuds descendants est immédiatement interrompue (skip).
- **Opérateurs de sélection du DAG** :
  - `mon_modele+` : Le modèle et tous ses descendants en aval (enfants).
  - `+mon_modele` : Le modèle et tous ses ancêtres en amont (parents).
  - `+mon_modele+` : Le modèle, tous ses ancêtres et tous ses descendants.
  - `@mon_modele` : Le modèle, tous ses descendants ET les ancêtres de ces descendants (toutes les dépendances requises pour tester les enfants).

## 3. Définitions des termes clés
- **dbt compile** : Génère le code SQL pur dans le dossier `target/compiled/` sans toucher à la base de données.
- **Intersection (virgule)** : `--select tag:finance,tag:daily` signifie les modèles qui ont à la fois le tag finance ET le tag daily.
- **Union (espace)** : `--select tag:finance tag:marketing` signifie les modèles qui ont le tag finance OU le tag marketing.

## 4. Exemple concret
Exemples de commandes de sélection en ligne de commande :

```bash
# Exécute tous les modèles du dossier marts/finance et leurs enfants
dbt run --select marts.finance+

# Exécute tout le projet sauf les modèles tagués 'slow'
dbt build --exclude tag:slow

# Exécute les modèles modifiés ainsi que leurs enfants immédiats (1 degré)
dbt run --select state:modified+1

# Teste un modèle et ses parents directs
dbt test --select +fct_orders
```

## 5. Comparaisons et pièges d'examen
- **dbt run contre dbt build** : `dbt run` ne lance JAMAIS de tests. Si une question d'examen mentionne qu'un test doit bloquer l'écriture des modèles enfants, la réponse est d'utiliser `dbt build`.
- **Sensibilité des chemins** : `path:models/staging` cible un répertoire physique, tandis que `tag:daily` cible une balise de configuration.
- **L'opérateur @** : Souvent piégeux à l'examen. Retenez que `@modele` inclut le modèle, ses descendants, et les parents de ces descendants pour garantir un build complet et autonome.

## 6. Lien avec SQL, Snowflake et Databricks
- Utiliser des sélecteurs fins (`--select tag:hourly`) permet d'orchestrer des fréquences d'actualisation distinctes dans Airflow sans surconsommer de ressources cloud.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 86 à 92
- Cours secondaire Weigel : leçons 40, 41, 44, 117 à 119
- Documentation officielle : https://docs.getdbt.com/reference/node-selection/syntax (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande exécute les seeds, les modèles, les tests et les snapshots dans l'ordre du DAG ? (Réponse : dbt build)
2. Que sélectionne l'expression --select +dim_clients ? (Réponse : Le modèle dim_clients et tous ses modèles et sources ancêtres en amont)
3. Comment exclure tous les modèles associés au tag 'hourly' lors d'un dbt run ? (Réponse : dbt run --exclude tag:hourly)
