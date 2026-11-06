# Chapitre 10 : Intégration LLM et Vectorisation pour la Data : Amazon Bedrock et RAG

## 1. Objectifs d'apprentissage
- Comprendre le rôle d'Amazon Bedrock pour l'intégration de modèles fondationnels dans les pipelines de données (compétence DEA-C01 v1.1).
- Maîtriser la vectorisation et la génération d'embeddings avec Amazon Titan Text Embeddings v2.
- Connaître les stratégies de découpage de texte (chunking) pour le prétraitement documentaire.
- Découvrir l'architecture RAG (Retrieval-Augmented Generation) avec Amazon Bedrock Knowledge Bases.

## 2. Explication claire : quand choisir quoi
La version 1.1 du guide d'examen DEA-C01 introduit l'intégration des LLM et la vectorisation au cœur des compétences de l'ingénieur de données moderne :

1. Amazon Bedrock :
- Qu'est-ce que c'est : un service entièrement managé offrant un accès unifié via API aux principaux modèles fondationnels (Anthropic Claude, Meta Llama, Amazon Titan, Mistral AI, Cohere) sans gérer d'infrastructure GPU.
- Cas d'usage Data Engineering :
  - Extraction d'informations structurées à partir de textes non structurés (contrats, emails, avis clients).
  - Résumé automatique et enrichissement de colonnes textuelles dans un pipeline de données.
  - Détection de sentiment et classification automatique de documents ingérés dans S3.
- Appel API programmatique : utilisation de l'API `InvokeModel` ou `Converse` depuis AWS Lambda ou AWS Glue.

2. Vectorisation et Embeddings (Amazon Titan Text Embeddings v2) :
- Embeddings : vecteurs numériques denses représentant le sens sémantique d'un texte dans un espace multidimensionnel (ex. 256, 512 ou 1024 dimensions pour Titan Text Embeddings v2).
- Normalisation : Titan v2 prend en charge la normalisation des vecteurs pour des calculs rapides de similarité cosinus ou distance euclidienne.

3. Stratégies de découpage (Chunking Strategies) :
- Avant de vectoriser un document volumineux (PDF de 50 pages), il doit être découpé en morceaux cohérents :
  - Fixed-size chunking : découpage par nombre fixe de tokens (ex. 500 tokens) avec un chevauchement (overlap, ex. 10 % ou 50 tokens) pour éviter de couper une phrase ou une idée en deux.
  - Hierarchical chunking : découpage en sous-morceaux enfants liés à des morceaux parents plus larges pour préserver le contexte global.
  - Semantic chunking : découpage basé sur les transitions thématiques naturelles du texte.

4. Amazon Bedrock Knowledge Bases (RAG managé) :
- Orchestre de bout en bout le pipeline RAG : lit les documents sur Amazon S3, les découpe selon la stratégie de chunking choisie, génère les embeddings via Titan, et les indexe dans une base vectorielle (Amazon OpenSearch Serverless, Amazon Aurora pgvector ou Pinecone).

## 3. Définitions des termes clés
- RAG (Retrieval-Augmented Generation) : architecture combinant la recherche documentaire vectorielle pour extraire des faits précis avec la génération d'un LLM pour répondre de manière exacte sans hallucination.
- Chunk Overlap : chevauchement de texte entre deux fragments consécutifs pour préserver la continuité sémantique aux frontières.
- Embedding : représentation vectorielle numérique de données textuelles ou multimodales.

## 4. Exemple concret
Pipeline d'ingestion et d'indexation vectorielle RAG :
```
[Documents PDF sur Amazon S3]
             |
             v
[Amazon Bedrock Knowledge Bases]
   |--> [Stratégie de Chunking : 512 tokens, 50 overlap]
   |--> [Modèle Titan Text Embeddings v2] -> [Vecteurs 1024-dim]
             |
             v
[Index Vectoriel Amazon OpenSearch Serverless (HNSW)]
```

## 5. Comparaisons et pièges d'examen
- Bedrock vs SageMaker : Bedrock fournit des modèles fondationnels prêts à l'emploi via une simple API sans gestion d'infrastructure ; SageMaker est destiné à l'entraînement complet, l'ajustement fin (fine-tuning) personnalisé et le déploiement sur conteneurs dédiés.
- Overlap de chunking : l'absence d'overlap peut faire perdre le sens des concepts situés exactement au point de coupure. Un overlap de 10 à 20 % est la bonne pratique standard recommandée.
- Gestion des coûts d'embeddings : Titan v2 permet de réduire la dimensionnalité du vecteur (de 1024 à 512 ou 256) pour diviser par deux ou quatre la taille de stockage de l'index vectoriel avec une perte minime de précision sémantique.

## 6. Lien avec SQL, Snowflake et Databricks
Cette architecture vectorielle correspond aux fonctions `SNOWFLAKE.CORTEX.EMBED_TEXT_768` dans Snowflake et aux Vector Search Endpoints associés aux modèles Foundation dans Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 276 à 285.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Un pipeline de données ingère des documents juridiques complexes sur S3 et doit alimenter une base vectorielle pour un assistant RAG. Quelle stratégie de découpage évite de tronquer le sens des concepts situés entre deux segments ?
   - A) Un découpage de taille fixe avec chevauchement (chunk overlap) de 10 à 20 % (Bonne réponse).
   - B) Un découpage strict sans aucun chevauchement.
   - C) Une compression gzip avant vectorisation.
   - D) L'indexation du document entier sous la forme d'un seul mot-clé.
2. Quel service managé permet d'intégrer des modèles de fondation comme Anthropic Claude ou Amazon Titan via une API sans provisionner de serveurs GPU dédiés ?
   - A) Amazon Bedrock (Bonne réponse).
   - B) Amazon EC2 g4dn.
   - C) Amazon QuickSight.
   - D) AWS DataSync.
