# Drapeaux d'échantillonnage : --empty et --sample

## 1. Objectifs d'apprentissage
Comprendre le fonctionnement et le cas d'usage du drapeau dbt `--empty`.
Valider la compilation SQL, les schémas et les contrats sans manipuler de données réelles.
Exploiter l'option `--sample` pour restreindre l'exécution à un sous-ensemble de données temporelles.
Réduire drastiquement les coûts de calcul et les temps de cycle lors du développement et de la CI.

## 2. Explication claire : quand choisir quoi
Lors du développement ou dans les pipelines de validation d'intégration continue (CI), exécuter des transformations sur des téraoctets de données est lent et coûteux :
- **Drapeau `--empty`** : Intercepte les lectures de `ref()` et `source()` et leur injecte une clause `WHERE false` (ou `LIMIT 0`). Le modèle est exécuté par l'entrepôt pour valider la syntaxe SQL, la compatibilité des types et les contrats de schéma, mais sans lire ni écrire de données réelles (0 ligne traitée). Durée : quelques secondes au lieu de plusieurs heures.
- **Drapeau `--sample`** : Permet de filtrer automatiquement les modèles incrémentaux ou les sources sur une fenêtre temporelle restreinte (ex: les 3 derniers jours via `--sample "3 days"`), parfait pour tester le comportement d'un calcul sur des données représentatives récentes sans tout recharger.

## 3. Définitions des termes clés
- **Dry-run structurel** : Validation de la cohérence du DDL et de la syntaxe SQL sans coût d'IO sur les données physiques.
- **WHERE false** : Prédicat logique inséré automatiquement par dbt en mode `--empty` pour renvoyer une table vide conservant le schéma exact.

## 4. Exemple concret
Validation de l'ensemble du projet sans traiter aucune ligne de données :

```bash
# Vérifie la syntaxe SQL et les contrats de tout le projet à coût quasi nul
dbt build --empty

# Échantillonne les données sur les 7 derniers jours pour tester un modèle incrémental
dbt run --select fct_evenements_analytics --sample "7 days"
```

## 5. Comparaisons et pièges d'examen
- **--empty contre dbt compile** : `dbt compile` ne contacte le Warehouse que pour le catalogage et ne valide pas si la base de données accepte la requête. `dbt build --empty` envoie réellement le SQL au Warehouse avec un filtre vide pour valider les types et contraintes physiques.
- **Impact sur les tests** : Un test `unique` ou `relationships` exécuté avec `--empty` réussira toujours (puisqu'il y a 0 ligne), mais cela valide la structure de la requête de test.
- **Nouveauté examen 2026** : Ces options font partie des nouvelles questions d'examen sur l'optimisation des flux de travail de développement.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, `dbt build --empty` permet aux pipelines de pull requests de vérifier que les migrations de code ne cassent pas les schémas sans sortir du forfait de crédits d'entrepôt gratuit.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçon 88
- Cours secondaire Weigel : leçon 128
- Documentation officielle : https://docs.getdbt.com/reference/commands/run#sampling (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Que fait le drapeau --empty lorsqu'il est passé à la commande dbt build ? (Réponse : Il insère un prédicat WHERE false pour valider la structure et les schémas sans charger de données)
2. Quelle option permet de limiter l'ingestion d'un modèle incrémental aux 3 derniers jours de données lors d'un test ? (Réponse : --sample "3 days")
3. Quel est l'avantage principal de --empty dans un pipeline de CI ? (Réponse : Il valide la validité du SQL et des contrats en quelques secondes avec une consommation de calcul quasi nulle)
