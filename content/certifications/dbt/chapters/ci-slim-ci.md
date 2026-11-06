# CI/CD et Slim CI

## 1. Objectifs d'apprentissage
Comprendre les principes de l'intégration continue (CI) appliqués aux projets de modélisation de données.
Mettre en œuvre le modèle Slim CI pour réduire les temps de build et les coûts d'infrastructure.
Combiner les sélecteurs d'état state:modified+ avec l'option --defer.
Automatiser les vérifications lors des Pull Requests GitHub ou GitLab.

## 2. Explication claire : quand choisir quoi
Dans une approche CI/CD traditionnelle, chaque Pull Request (PR) créée par un développeur déclenche un `dbt build` complet de tous les modèles dans un schéma temporaire de test. Dans un entrepôt comportant 500 modèles, ce test prendrait 2 heures et coûterait des centaines de crédits cloud.
- **Slim CI** : Approche moderne hautement optimisée. La CI télécharge le `manifest.json` issu du dernier build de production réussi, et ne construit que :
  1. Les modèles modifiés par la PR.
  2. Les modèles directement impactés en aval (enfants dépendants).
- **Formule consacrée de Slim CI** :
  `dbt build --select state:modified+ --defer --state path/to/prod/artifacts`
- **Résultat** : Un temps de pipeline réduit de plusieurs heures à quelques minutes, avec une garantie totale de non-régression.

## 3. Définitions des termes clés
- **Slim CI** : Pratique consistant à tester exclusivement le sous-ensemble de modèles créés ou modifiés par une branche de code.
- **state:modified+** : Sélecteur désignant tous les modèles modifiés ainsi que tous leurs descendants directs et indirects dans le graphe.
- **Environnement de PR (staging / sandbox)** : Schéma de base de données isolé créé pour la durée de validation de la Pull Request puis détruit.

## 4. Exemple concret
Workflow GitHub Actions simplifié pour Slim CI :

```yaml
# .github/workflows/slim_ci.yml
name: Slim CI

on:
  pull_request:
    branches: [ main ]

jobs:
  dbt_ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Télécharger le manifest de production
        run: aws s3 cp s3://mon-bucket-dbt-prod/manifest.json ./prod_artifacts/manifest.json

      - name: Exécuter Slim CI
        run: |
          dbt build             --select state:modified+             --state ./prod_artifacts             --defer             --target ci_pr_${{ github.event.pull_request.number }}
```

## 5. Comparaisons et pièges d'examen
- **Rôle indispensable de --defer** : Si le modèle modifié `fct_orders` dépend de `stg_orders` (qui n'a PAS été modifié et n'a donc pas été reconstruit dans le schéma de test), `--defer` indique à dbt de lire `stg_orders` directement dans le schéma de production sans lever d'erreur de table manquante.
- **Pourquoi build plutôt que run ?** `dbt build` exécute à la fois les modèles, les tests, les snapshots et les seeds dans l'ordre du DAG. En CI, cela garantit que si un test échoue, les modèles dépendants ne sont pas calculés.
- **Gestion des dépendances en amont (+state:modified)** : Si vous ajoutez le signe + devant, vous testez aussi les parents, ce qui alourdit généralement la CI. Pour Slim CI, on privilégie `state:modified+` (les enfants).

## 6. Lien avec SQL, Snowflake et Databricks
- Permet de valider rapidement les changements dans Snowflake ou Databricks sans impacter les schémas de production ni dupliquer inutilement des téraoctets de données.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 108, 118 à 123
- Cours secondaire Weigel : leçons 90 à 94, 98 à 103
- Documentation officielle : https://docs.getdbt.com/docs/deploy/slim-ci (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande résume le modèle Slim CI en associant sélection modifiée, descendants et résolution différée ? (Réponse : dbt build --select state:modified+ --defer --state path)
2. Quel est l'avantage primordial de Slim CI par rapport à un build CI complet ? (Réponse : Réduction drastique des temps d'exécution et des coûts de calcul cloud en ne testant que ce qui change)
3. Quel artefact issu de la production est obligatoire pour faire fonctionner Slim CI ? (Réponse : manifest.json)
