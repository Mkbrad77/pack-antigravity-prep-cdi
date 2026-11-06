# Tests génériques, singuliers et niveaux de sévérité

## 1. Objectifs d'apprentissage
Comprendre le fonctionnement du moteur de test de dbt et la règle fondamentale d'échec (0 ligne renvoyée = succès).
Maîtriser les 4 tests génériques natifs : unique, not_null, accepted_values, relationships.
Développer des tests singuliers sur mesure dans le dossier `tests/`.
Configurer les niveaux de sévérité (`warn` et `error`) et les seuils de tolérance.

## 2. Explication claire : quand choisir quoi
dbt propose deux catégories complémentaires de tests de données (Data Tests) :
- **Tests génériques (Generic Tests)** : Déclarés dans les fichiers YAML sous la clé `data_tests:`. Ils appliquent des assertions prédéfinies sur une colonne (ex: pas de doublons, valeurs autorisées). Les 4 tests intégrés par défaut sont `unique`, `not_null`, `accepted_values`, et `relationships`. Des packages comme `dbt-expectations` en ajoutent des dizaines d'autres.
- **Tests singuliers (Singular Tests)** : Requêtes SQL personnalisées stockées dans des fichiers `.sql` du dossier `tests/`. À utiliser lorsque la logique de validation est spécifique au métier et fait intervenir des jointures complexes ou des calculs multi-colonnes.

## 3. Définitions des termes clés
- **Règle d'or d'un test dbt** : Un test est une requête `SELECT` qui renvoie les enregistrements qui ne respectent PAS la règle. Si la requête renvoie 0 ligne, le test réussit (PASS). Si elle renvoie 1 ligne ou plus, le test échoue (FAIL).
- **Severity** : Niveau de criticité d'un test (`warn` affiche un message sans bloquer le pipeline, `error` stoppe l'exécution ou marque le job en échec).
- **Store failures** : Configuration permettant de conserver les lignes fautives dans une table dédiée de l'entrepôt pour faciliter le débogage.

## 4. Exemple concret
Configuration dans le fichier YAML :

```yaml
version: 2

models:
  - name: fct_orders
    columns:
      - name: order_id
        data_tests:
          - unique
          - not_null
      - name: status
        data_tests:
          - accepted_values:
              values: ['placed', 'shipped', 'delivered', 'returned']
              config:
                severity: warn
      - name: customer_id
        data_tests:
          - relationships:
              to: ref('dim_customers')
              field: customer_id
```

Test singulier dans `tests/assert_order_total_positive.sql` :
```sql
-- Renvoie les commandes dont le montant total est négatif (lignes en échec)
select
    order_id,
    total_amount
from {{ ref('fct_orders') }}
where total_amount < 0
```

## 5. Comparaisons et pièges d'examen
- **Que renvoie un test réussi ?** À l'examen, souvenez-vous impérativement qu'un test qui passe renvoie zéro enregistrement. S'il renvoie des lignes, ce sont les rejets.
- **Relationships et intégrité référentielle** : Le test `relationships` identifie les clés étrangères orphelines (valeurs présentes dans la table de faits mais introuvables dans la table de dimension).
- **Seuils d'alerte** : On peut tolérer un nombre absolu d'échecs (`warn_if: ">10"`) avant de déclencher l'alerte.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, chaque test génère une sous-requête exécutée sur votre entrepôt virtuel. Grouper ou cibler les tests (`dbt test --select tag:daily`) permet de maîtriser les coûts de crédits.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 37 à 43, 46 à 48
- Cours secondaire Weigel : leçons 104 à 109, 111, 112, 116
- Documentation officielle : https://docs.getdbt.com/docs/build/data-tests (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel résultat d'une requête SQL de test indique que la validation est un succès total ? (Réponse : 0 ligne renvoyée)
2. Quels sont les 4 tests génériques inclus nativement dans dbt Core ? (Réponse : unique, not_null, accepted_values, relationships)
3. Comment exécuter uniquement les tests associés au modèle dim_customers ? (Réponse : dbt test --select dim_customers)
