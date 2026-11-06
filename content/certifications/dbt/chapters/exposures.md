# Exposures et consommateurs avals

## 1. Objectifs d'apprentissage
Comprendre le concept d'Exposures pour cartographier les usages avals des modèles dbt.
Déclarer des expositions pour les tableaux de bord BI, les modèles de ML et les applications de Reverse ETL.
Analyser l'impact d'une modification de modèle sur les outils de restitution métier dans le DAG.
Exécuter et tester de manière ciblée les modèles alimentant une exposition spécifique.

## 2. Explication claire : quand choisir quoi
dbt transforme les données, mais ces données sont ensuite consommées par des outils extérieurs (Tableau, Power BI, Looker, modèles SageMaker, exports marketing). Les Exposures permettent de déclarer ces consommateurs avals dans dbt :
- Elles étendent le graphe de dépendances (DAG) au-delà des frontières de l'entrepôt.
- Elles permettent de savoir immédiatement qui contacter et quels rapports sont impactés en cas de changement de schéma ou de panne de pipeline.
- Elles permettent d'exécuter uniquement les modèles nécessaires pour rafraîchir un tableau de bord critique le matin.

## 3. Définitions des termes clés
- **Exposure** : Ressource dbt déclarée dans un fichier YAML sous la racine `exposures:`.
- **Types d'exposition supportés** : `dashboard`, `notebook`, `analysis`, `ml`, `application`.
- **Maturity** : Niveau de criticité opérationnelle (`high`, `medium`, `low`).
- **Owner** : Propriétaire du rapport (nom et e-mail) à notifier en cas d'incident.

## 4. Exemple concret
Déclaration d'une exposition dans `models/exposures.yml` :

```yaml
version: 2

exposures:
  - name: tableau_bord_direction_financiere
    type: dashboard
    maturity: high
    url: https://bi.notre-entreprise.com/dashboards/finance-exec
    description: "Tableau de bord exécutif quotidien des revenus et marges."
    owner:
      name: "Équipe BI Finance"
      email: "finance-bi@notre-entreprise.com"
    depends_on:
      - ref('fct_revenus_mensuels')
      - ref('dim_centres_couts')
```

Commandes de sélection ciblée :
```bash
# Exécute tous les modèles amonts alimentant cette exposition
dbt run --select +exposure:tableau_bord_direction_financiere

# Teste tous les modèles amonts de l'exposition
dbt test --select +exposure:tableau_bord_direction_financiere
```

## 5. Comparaisons et pièges d'examen
- **Syntaxe du sélecteur** : Retenez la syntaxe `+exposure:mon_exposition`. Le signe plus placé à gauche (`+`) signifie : "sélectionne tous les parents/ancêtres de l'exposition".
- **Les exposures ne créent aucune table** : Une exposition est un nœud purement informatif dans le DAG. L'exécution de `dbt run` ne crée rien pour l'exposition elle-même.
- **Dépendances obligatoires** : Chaque exposition doit lister au moins une dépendance valide (`ref()` ou `source()`) dans son bloc `depends_on`.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans les architectures d'entreprise, les exposures permettent de sécuriser les contrats de service entre les Data Engineers et les équipes de restitution décisionnelle.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 71, 72
- Cours secondaire Weigel : leçon 114
- Documentation officielle : https://docs.getdbt.com/docs/build/exposures (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel préfixe de commande permet de sélectionner tous les modèles alimentant une exposition nommée 'kpi_ventes' ? (Réponse : +exposure:kpi_ventes)
2. Les exposures créent-elles des tables ou vues physiques dans l'entrepôt de données ? (Réponse : Non, ce sont des nœuds purement déclaratifs de documentation dans le DAG)
3. Citez trois types d'expositions reconnus par la spécification dbt. (Réponse : dashboard, notebook, ml)
