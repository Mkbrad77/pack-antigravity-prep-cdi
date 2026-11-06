# Chapitre 4.3 : Architecture Transformers & Mécanisme d'attention

## 1. La question classique posée en entretien
« Comment fonctionne le mécanisme d'attention (Scaled Dot-Product Attention) au cœur des Transformers et pourquoi a-t-il surclassé les RNN et LSTM pour le traitement du langage naturel ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre capacité à vulgariser la formule : `Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V`.
- L'explication concrète des vecteurs Query, Key, Value par analogie avec un moteur de recherche.
- L'avantage fondamental du parallélisme : les Transformers traitent toute la séquence de tokens simultanément, contrairement à la séquentialité stricte des RNN qui empêchait l'entraînement sur GPU à grande échelle.

## 3. Réponse d'ingénieur senior

### A. L'analogie Query, Key, Value
- **Query (Q) :** Ce que le token recherche comme contexte sémantique.
- **Key (K) :** L'étiquette de ce que chaque token de la phrase offre comme information.
- **Value (V) :** Le contenu informationnel réel du token qui sera agrégé si Query et Key correspondent bien (produit scalaire élevé).
- **Le facteur `1 / sqrt(d_k)` :** Facteur d'échelle évitant que pour de grandes dimensions, le produit scalaire ne devienne trop grand, ce qui saturerait le softmax et produirait des gradients quasi nuls.

### B. Multi-Head Attention (Attention multi-têtes)
Plutôt que d'effectuer une seule projection d'attention, le modèle projette Q, K, V dans plusieurs sous-espaces (ex. 8 ou 32 têtes). Cela permet à une tête de se focaliser sur la grammaire (accord sujet-verbe), à une autre sur les entités nommées, et à une autre sur le ton du texte.

## 4. Erreurs fatales à éviter absolument
- Oublier d'expliquer le rôle de l'encodage positionnel (Positional Encoding / RoPE), sans lequel le modèle considérerait la phrase comme un simple sac de mots non ordonné.
- Confondre modèle encodeur seul (BERT, pour l'extraction de représentations/embeddings) et décodeur auto-régressif (GPT, pour la génération token par token).
