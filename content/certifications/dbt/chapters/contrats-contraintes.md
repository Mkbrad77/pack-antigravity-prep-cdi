# Contrats de modèle et contraintes de schéma

## 1. Objectifs d'apprentissage
Comprendre l'intérêt des contrats de modèle (Model Contracts) pour la gouvernance et le Data Mesh.
Définir formellement les colonnes, les types de données et les contraintes obligatoires.
Distinguer les contraintes logiques dbt des contraintes physiques appliquées par le Warehouse.
Gérer les changements de structure et garantir la stabilité des APIs de données.

## 2. Explication claire : quand choisir quoi
Historiquement, dbt fonctionnait sur le principe de la liberté de schéma : le SQL déterminait les colonnes de sortie sans validation préalable. Les contrats de modèle inversent ce paradigme :
- Lorsqu'un contrat est imposé (`contract: {enforced: true}`), dbt valide avant l'exécution que la requête SQL renvoie rigoureusement la liste déclarée des colonnes avec leurs types exacts.
- Si une colonne est ajoutée, retirée ou si son type diffère de la spécification YAML, le build échoue immédiatement avant de modifier la table dans l'entrepôt.
- Recommandé pour les modèles exposés publiquement à d'autres équipes ou à des applications opérationnelles critiques.

## 3. Définitions des termes clés
- **Model Contract** : Accord formel déclarant les colonnes, leurs types et leurs contraintes qu'un modèle s'engage à respecter.
- **Contraintes supportées** : `not_null`, `unique`, `primary_key`, `foreign_key`, `check`.
- **Enforced** : Propriété booléenne activant la vérification stricte du contrat par le compilateur dbt.

## 4. Exemple concret
Configuration d'un modèle sous contrat dans son fichier YAML :

```yaml
version: 2

models:
  - name: dim_utilisateurs
    config:
      contract:
        enforced: true
    columns:
      - name: user_id
        data_type: integer
        constraints:
          - type: not_null
          - type: primary_key
      - name: email
        data_type: varchar
        constraints:
          - type: not_null
      - name: cree_le
        data_type: timestamp
```

Si le fichier `dim_utilisateurs.sql` omet la colonne `email` ou renvoie `user_id` sous forme de chaîne de caractères, la commande `dbt run` échoue avant toute écriture.

## 5. Comparaisons et pièges d'examen
- **Contrat contre Test not_null** : Un test `not_null` s'exécute après la construction de la table et n'empêche pas l'écriture. Une contrainte de contrat `not_null` est appliquée lors de la création de la table (DDL) ou avant l'écriture.
- **Toutes les colonnes doivent être listées** : Si le SELECT du modèle produit 10 colonnes mais que le YAML n'en décrit que 9, le contrat échoue. Chaque colonne renvoyée doit figurer dans le contrat.
- **Support selon les entrepôts** : Les contraintes comme `primary_key` sont déclaratives dans Snowflake, mais vérifiées physiquement dans PostgreSQL.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, dbt injecte les contraintes déclaratives dans l'instruction DDL (`CREATE TABLE ... CONSTRAINT PRIMARY KEY`), ce qui aide l'optimiseur de requêtes à concevoir de meilleurs plans d'exécution.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 45, 49
- Cours secondaire Weigel : leçons 68 à 70
- Documentation officielle : https://docs.getdbt.com/docs/collaborate/govern/model-contracts (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle directive YAML active la validation stricte d'un contrat de modèle ? (Réponse : contract: {enforced: true})
2. Qu'arrive-t-il lors du dbt run si un modèle sous contrat renvoie une colonne non décrite dans le fichier YAML ? (Réponse : Le build échoue immédiatement avec une erreur de contrat)
3. Les types de données des colonnes (data_type) sont-ils obligatoires lorsqu'un contrat est actif ? (Réponse : Oui, chaque colonne sous contrat doit déclarer son data_type)
