# Chapitre 20 : Recherche Textuelle et Vectorielle avec Amazon OpenSearch Service

## 1. Objectifs d'apprentissage
- Comprendre les cas d'usage d'Amazon OpenSearch Service pour l'analytique de logs et la recherche full-text.
- Différencier Amazon OpenSearch Managé et Amazon OpenSearch Serverless.
- Maîtriser la recherche vectorielle k-NN (k-Nearest Neighbors) pour les cas d'usage d'IA générative et RAG.
- Comparer les algorithmes d'indexation vectorielle HNSW et IVF (compétence DEA-C01 v1.1).

## 2. Explication claire : quand choisir quoi
Amazon OpenSearch Service (successeur managé d'Elasticsearch) est un moteur de recherche et d'analytique distribué permettant l'indexation de texte intégral, l'analyse de séries temporelles et la recherche de similarité vectorielle :

Modes de déploiement :
- OpenSearch Managé : clusters d'instances EC2 dédiées (Data Nodes, Master Nodes, UltraWarm pour l'archivage économique de logs). Contrôle précis sur le partitionnement (sharding) et les index.
- OpenSearch Serverless : collection sans serveur qui ajuste automatiquement la capacité de calcul (OCU : OpenSearch Compute Units) selon les volumes de requêtes sans gérer d'instances ni dimensionner de stockage.

Recherche Vectorielle k-NN et IA Générative (DEA-C01 v1.1) :
OpenSearch prend en charge le plugin k-NN pour rechercher les vecteurs les plus proches sémantiquement d'un vecteur de requête (embeddings générés par Bedrock ou SageMaker) :

Comparaison des algorithmes d'indexation vectorielle :
1. Algorithme HNSW (Hierarchical Navigable Small World) :
   - Structure : graphe hiérarchique à plusieurs couches reliant les vecteurs proches.
   - Performances : fournit un excellent rappel (recall, précision de la recherche) et une latence de requête ultra-faible en millisecondes.
   - Empreinte mémoire : stocke l'intégralité du graphe en mémoire vive (RAM). Consommation de mémoire très élevée, coût supérieur.
   - Quand le choisir : pour les applications RAG temps réel et les moteurs de recommandation interactifs où la vitesse et la pertinence priment.
2. Algorithme IVF (Inverted File Flat) :
   - Structure : partitionne l'espace vectoriel en clusters de Voronoï et associe chaque vecteur au centre de cluster le plus proche via une liste inversée.
   - Performances : recherche approximative légèrement moins précise que HNSW, mais temps de construction d'index plus rapide.
   - Empreinte mémoire : empreinte RAM considérablement réduite par rapport à HNSW, permettant d'indexer des centaines de millions de vecteurs sur disque à coût maîtrisé.
   - Quand le choisir : pour les très grands volumes de données vectorielles où la mémoire RAM est un facteur de coût limitant.

## 3. Définitions des termes clés
- k-NN (k-Nearest Neighbors) : méthode de recherche identifiant les `k` points les plus proches d'un vecteur cible.
- Distance Cosinus : mesure de similarité basée sur l'angle entre deux vecteurs, idéale pour comparer du texte indépendamment de la longueur du document.
- UltraWarm / Cold Storage : niveaux de stockage OpenSearch utilisant Amazon S3 pour réduire le coût de conservation des logs historiques jusqu'à 90 %.

## 4. Exemple concret
Configuration d'un index vectoriel OpenSearch avec méthode HNSW :
```json
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "vecteur_description": {
        "type": "knn_vector",
        "dimension": 1024,
        "method": {
          "name": "hnsw",
          "engine": "faiss",
          "space_type": "cosinesimil"
        }
      },
      "titre": { "type": "text" }
    }
  }
}
```

## 5. Comparaisons et pièges d'examen
- HNSW vs IVF : HNSW garantit la meilleure précision au prix d'une utilisation massive de mémoire vive ; IVF réduit la consommation mémoire au prix d'une recherche approximative.
- OpenSearch vs Athena : OpenSearch indexe chaque mot et vecteur pour des recherches textuelles et sémantiques en millisecondes ; Athena est conçu pour des requêtes analytiques relationnelles SQL de fond sur de gros volumes S3 avec des temps de réponse de quelques secondes à minutes.

## 6. Lien avec SQL, Snowflake et Databricks
OpenSearch vectoriel remplit exactement la même mission que l'extension `pgvector` sur PostgreSQL/Aurora, Snowflake Cortex Search ou les Databricks Vector Search Endpoints.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 286 à 295.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quel algorithme d'indexation vectorielle k-NN devez-vous choisir dans Amazon OpenSearch pour obtenir la latence de recherche la plus faible et la meilleure précision de rappel, sous réserve de disposer de suffisamment de mémoire RAM ?
   - A) L'algorithme HNSW (Hierarchical Navigable Small World) (Bonne réponse).
   - B) L'algorithme IVF (Inverted File).
   - C) Le hachage MD5 standard.
   - D) L'indexation inversée B-Tree.
2. Pour quelle raison un architecte data privilégierait-il l'algorithme vectoriel IVF plutôt que HNSW pour indexer 50 millions de documents vectorisés ?
   - A) Pour réduire considérablement l'empreinte mémoire vive (RAM) requise et limiter les coûts d'infrastructure (Bonne réponse).
   - B) Pour supprimer l'utilisation des embeddings.
   - C) Parce qu'IVF est le seul algorithme supporté par AWS Lambda.
   - D) Pour interdire les requêtes en langage naturel.
