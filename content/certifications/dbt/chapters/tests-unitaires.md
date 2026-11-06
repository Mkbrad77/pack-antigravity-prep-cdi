# Tests unitaires dans dbt (Unit Tests)

## 1. Objectifs d'apprentissage
Comprendre la différence fondamentale entre un test de données (Data Test) et un test unitaire (Unit Test).
Déclarer des tests unitaires dans les fichiers YAML pour valider la logique de calcul dbt.
Créer des jeux de données d'entrée factices (mock data) pour simuler des cas aux limites.
Intégrer les tests unitaires dans un workflow de développement rapide et d'intégration continue.

## 2. Explication claire : quand choisir quoi
- **Data Tests** : Testent les données réelles de l'entrepôt. Ils répondent à la question : "Les données chargées aujourd'hui contiennent-elles des anomalies (doublons, valeurs nulles) ?".
- **Unit Tests** : Testent la logique SQL du modèle indépendamment des données de production. Ils répondent à la question : "Mon code SQL calcule-t-il correctement le résultat attendu pour un jeu d'entrée donné ?". Les tests unitaires permettent d'isoler des règles métier complexes (calcul de TVA, tranches d'âge, règles de déduplication) en injectant de faux enregistrements (mocked inputs) et en comparant le résultat au résultat théorique attendu.

## 3. Définitions des termes clés
- **Mock data** : Données fictives définies directement en YAML ou dans un fichier CSV seed utilisées exclusivement pour l'exécution du test.
- **given** : Bloc YAML spécifiant les entrées fictives associées à chaque `ref()` ou `source()` utilisé dans le modèle.
- **expect** : Bloc YAML déclarant les lignes exactes que le modèle doit produire.

## 4. Exemple concret
Déclaration d'un test unitaire dans `models/marts/schema.yml` :

```yaml
unit_tests:
  - name: test_calcul_remise_fidelite
    model: fct_commandes
    given:
      - input: ref('stg_clients')
        rows:
          - {client_id: 1, points_fidelite: 150}
          - {client_id: 2, points_fidelite: 20}
      - input: ref('stg_commandes')
        rows:
          - {commande_id: 101, client_id: 1, montant_brut: 100.0}
          - {commande_id: 102, client_id: 2, montant_brut: 100.0}
    expect:
      rows:
        - {commande_id: 101, montant_net: 90.0}
        - {commande_id: 102, montant_net: 100.0}
```

Commande d'exécution :
```bash
dbt test --select test_type:unit
```

## 5. Comparaisons et pièges d'examen
- **Performance** : Les tests unitaires sont très rapides car ils ne scannent aucune table de production, s'exécutant sur de petites tables temporaires en mémoire.
- **Nouveauté examen 2026** : Les Unit Tests constituent un sujet d'examen très récent. Souvenez-vous qu'ils s'exécutent avec `dbt test` et peuvent être ciblés avec le sélecteur `test_type:unit`.
- **Cas d'usage typique** : Utiliser un test unitaire lors du refactoring d'un modèle complexe pour garantir la non-régression de la logique métier.

## 6. Lien avec SQL, Snowflake et Databricks
- Les tests unitaires génèrent des clauses `SELECT ... UNION ALL` virtuelles simulant les tables en amont directement dans le dialecte SQL de votre entrepôt (Snowflake, BigQuery, Databricks).

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçon 44
- Cours secondaire Weigel : leçon 110
- Documentation officielle : https://docs.getdbt.com/docs/build/unit-tests (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande permet d'exécuter uniquement les tests unitaires du projet ? (Réponse : dbt test --select test_type:unit)
2. Quel mot-clé YAML définit les lignes attendues produites par le modèle dans un test unitaire ? (Réponse : expect)
3. Quel est l'avantage principal des tests unitaires par rapport aux tests de données classiques ? (Réponse : Ils valident la logique SQL sur des données simulées sans dépendre des données de production)
