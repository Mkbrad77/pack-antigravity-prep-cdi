# Modèles Python dans dbt

## 1. Objectifs d'apprentissage
Comprendre l'architecture et les cas d'usage des modèles Python dans dbt (Snowpark, Databricks, BigQuery).
Maîtriser la signature obligatoire de la fonction model(dbt, session) et le renvoi d'un DataFrame.
Distinguer ce que le SQL sait faire de ce qui nécessite obligatoirement Python (ML, NLP, parsing complexe).
Connaître les restrictions techniques et les matérialisations compatibles avec les modèles Python.

## 2. Explication claire : quand choisir quoi
dbt permet d'écrire des modèles en Python (.py) en complément du SQL (.sql). Le principe fondamental : le code Python ne tourne pas sur votre machine locale, mais directement sur l'infrastructure de calcul du Data Warehouse (par exemple Snowpark sur Snowflake, ou un cluster Spark sur Databricks).
- **Quand utiliser SQL** : Pour 90 % des transformations data : agrégations, jointures, nettoyages et calculs d'indicateurs métier. Le SQL est plus rapide, plus économique et plus lisible.
- **Quand utiliser Python** : Pour les bibliothèques scientifiques et statistiques (scikit-learn, numpy, scipy), le traitement du langage naturel (spaCy, nltk), le géocodage ou la prédiction inférentielle de Machine Learning directement dans le pipeline.
- **Matérialisations autorisées** : Seules les matérialisations table et incremental sont supportées pour les modèles Python. Les matérialisations view et ephemeral ne sont pas autorisées.

## 3. Définitions des termes clés
- **model(dbt, session)** : Point d'entrée obligatoire de tout script de modèle Python dans dbt.
- **dbt.ref() et dbt.source()** : Méthodes de l'objet dbt permettant de lire les modèles et sources sous forme de DataFrames.
- **dbt.config()** : Méthode permettant de configurer la matérialisation et les packages Python tiers requis.
- **DataFrame retourné** : La fonction doit obligatoirement retourner un DataFrame Snowpark, PySpark ou Pandas.

## 4. Exemple concret
Structure d'un modèle Python dbt pour Snowflake (Snowpark) :

```python
# models/marts/scoring_clients.py
import pandas as pd

def model(dbt, session):
    # Configuration du modèle
    dbt.config(
        materialized="table",
        packages=["scikit-learn", "numpy"]
    )

    # Référence vers un modèle dbt amont
    orders_df = dbt.ref("fct_orders")
    
    # Transformation via l'API DataFrame
    scored_df = orders_df.filter(orders_df["amount"] > 100)

    # Renvoi obligatoire du DataFrame final
    return scored_df
```

## 5. Comparaisons et pièges d'examen
- **Piège de la matérialisation vue** : Une question d'examen demandant de créer une vue (view) avec un modèle Python est fausse. Seules table et incremental sont possibles.
- **Exécution locale contre distante** : dbt ne fait qu'orchestrer et envoyer le code Python au moteur cible. Vous n'avez pas besoin d'installer Snowpark en local pour compiler le projet.
- **Gestion des packages** : Les packages tiers doivent être déclarés dans dbt.config(packages=[...]) pour être résolus par l'entrepôt.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, dbt Python exploite les Snowpark Stored Procedures et le runtime Anaconda intégré sécurisé.
- Dans **Databricks**, le modèle s'exécute comme un job PySpark natif connecté à Unity Catalog.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 93 à 96
- Cours secondaire Weigel : leçons 61 à 62
- Documentation officielle : https://docs.getdbt.com/docs/build/python-models (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelles sont les seules matérialisations supportées pour les modèles Python dans dbt ? (Réponse : table et incremental)
2. Quel est le nom de la fonction obligatoire que chaque fichier de modèle Python dbt doit définir ? (Réponse : model)
3. Où s'exécute le code d'un modèle Python dbt ? (Réponse : Dans l'entrepôt de données cible, ex. Snowflake ou Databricks, jamais sur le client local dbt)
