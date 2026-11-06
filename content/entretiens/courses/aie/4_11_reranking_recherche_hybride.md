# Chapitre 4.11 : Reranking & Recherche Hybride (BM25 + Dense)

## 1. La question classique posée en entretien
« Pourquoi la recherche vectorielle pure échoue-t-elle souvent en milieu professionnel sur des références précises (codes d'erreur, références produits) et comment y remédiez-vous ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre lucidité sur les limites de la recherche vectorielle (faiblesse sur les correspondances exactes de mots rares ou d'acronymes).
- Votre maîtrise de la **Recherche Hybride** combinant recherche lexicale inversée (BM25) et recherche dense vectorielle.
- Votre implémentation de l'algorithme RRF (Reciprocal Rank Fusion) et des modèles de Reranking (Cross-Encoders comme Cohere Rerank ou BGE-Reranker).

## 3. Réponse d'ingénieur senior

### A. La complémentarité BM25 et Dense
- **Recherche Dense (Embeddings) :** Capture la proximité sémantique (`voiture` matche avec `automobile`, `erreur 404` matche avec `page introuvable`).
- **Recherche Lexicale (BM25) :** Capture les correspondances mot à mot exactes (`CVE-2026-4421`, `ID_CLIENT_99482`).

### B. Fusion des scores : Reciprocal Rank Fusion (RRF)
Pour combiner les résultats des deux moteurs sans normalisation fragile des scores :
```text
Score_RRF(doc) = 1 / (k + Rang_BM25(doc)) + 1 / (k + Rang_Vector(doc))
(avec constante k typiquement fixée à 60)
```

### C. Étape finale : Le Reranking par Cross-Encoder
Les embeddings utilisent un modèle bi-encodeur (rapide mais traite la question et le document séparément). Le **Cross-Encoder** prend simultanément la paire `(Question, Document)` en entrée et calcule leur degré de pertinence avec attention croisée.
- **Coût :** Plus lourd en calcul. On ne l'applique donc que sur les 20 à 30 meilleurs candidats pré-sélectionnés.
- **Bénéfice :** Augmentation spectaculaire de la précision du top-3 transmis au LLM.

## 4. Erreurs fatales à éviter absolument
- Appliquer un Cross-Encoder sur l'intégralité des 100 000 documents de la base (latence prohibitive).
- Se contenter d'additionner les scores de similarité bruts sans fusion de rangs.
