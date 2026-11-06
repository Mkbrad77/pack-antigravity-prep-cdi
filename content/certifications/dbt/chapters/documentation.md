# Documentation et lignage de données (Data Lineage)

## 1. Objectifs d'apprentissage
Rédiger la documentation des modèles et des colonnes dans les fichiers YAML.
Utiliser les blocs de documentation réutilisables (`doc blocks`) dans des fichiers Markdown.
Générer le site de documentation statique avec `dbt docs generate`.
Visualiser et interpréter le graphe de dépendances (DAG / Lineage Graph).

## 2. Explication claire : quand choisir quoi
La documentation dans dbt fait partie intégrante du cycle de vie du code. Elle vit aux côtés des modèles SQL :
- **Descriptions en ligne (YAML)** : Idéales pour des descriptions concises d'une ou deux phrases définissant le rôle d'un modèle ou d'une colonne.
- **Blocs de documentation (Doc Blocks)** : Indispensables pour les définitions longues, complexes ou partagées par plusieurs tables (ex: définition légale du chiffre d'affaires, calcul des statuts clients). Ils sont rédigés en Markdown dans des fichiers `.md` du dossier `models/` et référencés via la syntaxe `{{ doc("nom_bloc") }}`.
- **Graphe de lignage (DAG)** : Permet d'explorer visuellement le cheminement des données depuis les sources brutes jusqu'aux rapports finaux.

## 3. Définitions des termes clés
- **dbt docs generate** : Commande qui analyse le projet et produit les fichiers statiques de documentation (`manifest.json`, `catalog.json`, `index.html`).
- **dbt docs serve** : Démarre un serveur web local pour explorer la documentation et le DAG interactif.
- **Doc Block** : Balise Jinja spéciale `{% docs nom %} ... {% enddocs %}` encapsulant du texte Markdown enrichi.

## 4. Exemple concret
Création d'un doc block dans `models/docs_finance.md` :

```markdown
{% docs statut_commande_description %}
Le statut opérationnel de la commande client :
- **placed** : Commande validée en attente de traitement bancaire.
- **shipped** : Colis expédié par notre plateforme logistique.
- **returned** : Article retourné par le client final.
{% enddocs %}
```

Référence dans le fichier YAML :
```yaml
version: 2

models:
  - name: fct_orders
    description: "Table de faits des transactions e-commerce."
    columns:
      - name: status
        description: "{{ doc('statut_commande_description') }}"
```

Commandes :
```bash
dbt docs generate
dbt docs serve --port 8080
```

## 5. Comparaisons et pièges d'examen
- **Catalog.json et métadonnées réelles** : La commande `dbt docs generate` interroge l'entrepôt de données pour extraire les types réels des colonnes et la taille des tables dans `catalog.json`.
- **Sens du graphe DAG** : Les nœuds situés à gauche sont les ancêtres (upstream/parents), les nœuds à droite sont les descendants (downstream/enfants).
- **Persistance des descriptions dans le Warehouse** : En configurant `persist_docs: {relation: true, columns: true}`, dbt injecte les descriptions sous forme de commentaires SQL (`COMMENT ON TABLE / COLUMN`) visibles directement dans l'interface Snowflake ou Databricks.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, `persist_docs` permet aux analystes interrogeant directement la base via DBeaver ou la console web de lire la documentation sans ouvrir dbt.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 58 à 62
- Cours secondaire Weigel : leçons 42, 113
- Documentation officielle : https://docs.getdbt.com/docs/collaborate/documentation (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelles sont les deux commandes nécessaires pour créer puis visualiser la documentation dbt en local ? (Réponse : dbt docs generate puis dbt docs serve)
2. Comment référence-t-on un bloc de documentation nommé 'info_client' dans un fichier YAML ? (Réponse : {{ doc('info_client') }})
3. Quelle configuration permet de propager les descriptions dbt comme commentaires SQL dans l'entrepôt ? (Réponse : persist_docs)
