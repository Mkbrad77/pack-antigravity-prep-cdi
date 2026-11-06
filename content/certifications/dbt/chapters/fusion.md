# dbt Fusion et architectures d'entreprise

## 1. Objectifs d'apprentissage
Comprendre l'évolution vers dbt Fusion et la convergence de l'orchestration, de la modélisation et du catalogue sémantique.
Appréhender la couche sémantique (dbt Semantic Layer) et les métriques métier unifiées.
Distinguer le périmètre de l'examen dbt Core des fonctionnalités avancées de la plateforme Cloud.
Positionner dbt au cœur d'une architecture moderne de données (Modern Data Stack).

## 2. Explication claire : quand choisir quoi
À mesure que les organisations data grandissent, la simple transformation SQL par lots devient insuffisante. dbt a étendu ses capacités pour répondre aux besoins d'alignement d'entreprise :
- **dbt Core vs dbt Cloud / Fusion** :
  - **dbt Core** : Moteur open source en ligne de commande centré sur la compilation, l'exécution et le test des modèles SQL et Python. C'est le cœur technique évalué par l'examen.
  - **dbt Semantic Layer (Couche sémantique)** : Permet de définir les métriques métier critiques (ex: Chiffre d'affaires récurrent mensuel MRR, Coût d'acquisition client) une seule fois dans dbt en YAML, et de les consommer de façon cohérente dans tous les outils de BI (Tableau, PowerBI, Hex) via une API standardisée.
  - **dbt Explorer** : Catalogue de données interactif offrant un graphe de lignage visuel au niveau colonne (Column-Level Lineage) et le suivi des performances d'exécution dans le temps.
- **Règle d'or pour l'examen** : Bien que ces fonctionnalités soient présentées dans les cours avancés de Toth, l'examen officiel porte en priorité sur la syntaxe, la gouvernance et le fonctionnement de dbt Core.

## 3. Définitions des termes clés
- **Semantic Layer** : Couche d'abstraction centralisant la logique des métriques et dimensions pour garantir des chiffres identiques entre tous les départements.
- **MetricFlow** : Moteur sémantique sous-jacent à dbt convertissant les définitions de métriques YAML en requêtes SQL d'agrégation hautement optimisées.
- **Column-Level Lineage** : Capacité à tracer l'origine et la transformation d'une colonne précise de la source brute jusqu'au rapport final.

## 4. Exemple concret
Définition conceptuelle d'une métrique sémantique dans models/marts/metrics.yml :

```yaml
version: 2

semantic_models:
  - name: commandes_semantiques
    model: ref('fct_commandes')
    defaults:
      agg_time_dimension: date_commande
    entities:
      - name: commande
        type: primary
        key: id_commande
      - name: client
        type: foreign
        key: id_client
    dimensions:
      - name: date_commande
        type: time
        type_params:
          time_granularity: day
      - name: statut
        type: categorical
    measures:
      - name: total_montant
        agg: sum
        expr: montant_ht

metrics:
  - name: chiffre_affaires_total
    description: "Somme totale des montants hors taxes des commandes validées"
    type: simple
    type_params:
      measure: total_montant
    filter: |
      {{ Dimension('commande__statut') }} = 'termine'
```

## 5. Comparaisons et pièges d'examen
- **Périmètre d'examen** : Si une question porte sur un module payant ou propriétaire non disponible dans dbt Core, analysez s'il s'agit d'un concept général (comme la gouvernance multi-projets) ou d'une interface dbt Cloud. L'examen teste la syntaxe dbt standard.
- **Métriques contre vues classiques** : Une vue SQL précalcule une agrégation à un niveau fixe. Une métrique sémantique s'adapte dynamiquement aux dimensions demandées par l'utilisateur BI.

## 6. Lien avec SQL, Snowflake et Databricks
- La couche sémantique pousse les calculs compilés vers Snowflake ou Databricks sans extraire les données, maintenant la conformité et la performance.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 124 à 137
- Cours secondaire Weigel : Non couvert
- Documentation officielle : https://docs.getdbt.com (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel est l'objectif premier de la couche sémantique (dbt Semantic Layer) ? (Réponse : Définir les métriques métier une seule fois pour garantir la cohérence des chiffres dans tous les outils de restitution)
2. Quel moteur open source sous-jacent propulse la couche sémantique de dbt ? (Réponse : MetricFlow)
3. Quelle fonctionnalité de métadonnées permet de suivre le parcours d'un attribut de données spécifique à travers l'ensemble des transformations ? (Réponse : Le lignage au niveau colonne, ou Column-Level Lineage)
