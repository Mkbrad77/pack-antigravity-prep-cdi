# Chapitre 4.6 : Embeddings & Modèles d'encodage

## 1. La question classique posée en entretien
« Comment choisissez-vous votre modèle d'embedding pour une application RAG d'entreprise en français ? Quelle métrique de distance recommandez-vous et pourquoi ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre connaissance du benchmark MTEB (Massive Text Embedding Benchmark) pour comparer objectivement les modèles (ex. modèles multilingues BGE-M3, Cohere, OpenAI text-embedding-3).
- La compréhension des métriques de similarité : Similarité Cosinus, Distance Euclidienne (L2), et Produit Scalaire (Dot Product).
- L'impact de la dimensionnalité (ex. 384 vs 1024 vs 1536 dimensions) sur le coût de stockage en RAM et la latence d'inférence.

## 3. Réponse d'ingénieur senior

### A. Choix des métriques de distance
- **Similarité Cosinus :** Mesure l'angle entre deux vecteurs, indépendamment de leur magnitude. Idéal pour comparer des textes de longueurs variables.
- **Produit Scalaire normalisé :** Si les embeddings sont préalablement normalisés à la norme 1, le produit scalaire est strictement équivalent à la similarité cosinus tout en étant beaucoup plus rapide à calculer sur matériel vectorisé (instructions SIMD / AVX-512).

### B. Critères de sélection en production
1. **Support multilingue robuste :** Pour le français, privilégier des modèles entraînés sur des corpus multilingues denses (ex. `bge-multilingual-gemma2` ou `multilingual-e5-large`).
2. **Longueur maximale de contexte (Token context window) :** Les modèles classiques tronquent à 512 tokens. Des modèles récents acceptent jusqu'à 8 192 tokens, évitant de découper des passages sémantiques cohérents.
3. **Matryoshka Representation Learning (MRL) :** Permet de tronquer un vecteur de 1536 à 256 dimensions avec une perte minime de précision (< 2 %), divisant par 6 les coûts de mémoire de l'index vectoriel.

## 4. Erreurs fatales à éviter absolument
- Comparer des embeddings générés par deux modèles différents (ils vivent dans des espaces géométriques totalement incompatibles).
- Ne pas normaliser les vecteurs avant d'utiliser le produit scalaire comme fonction de distance.
