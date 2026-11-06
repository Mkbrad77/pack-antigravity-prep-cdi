# Chapitre 4.8 : Conception d'un système RAG complet

## 1. La question classique posée en entretien
« Décrivez-moi l'architecture complète d'un système RAG (Retrieval-Augmented Generation) de production, de la phase d'ingestion hors-ligne jusqu'au serving en ligne. »

## 2. Ce que l'interviewer évalue vraiment
- Votre capacité à structurer clairement les deux pipelines : **Pipeline d'ingestion (asynchrone)** et **Pipeline de requête (synchrone / streaming)**.
- Votre prise en compte des étapes intermédiaires qui font la différence en production (nettoyage, enrichissement des métadonnées, reranking, injection dans le template de prompt avec garde-fous).

## 3. Réponse d'ingénieur senior

### A. Pipeline d'ingestion (Hors-ligne / Asynchrone)
1. **Extraction de documents :** Parsing de formats hétérogènes (PDF, Word, Markdown, HTML) avec préservation de la hiérarchie des titres.
2. **Nettoyage & Découpage (Chunking) :** Découpage avec chevauchement (overlap) pour ne pas casser les phrases.
3. **Enrichissement de métadonnées :** Ajout de tags cruciaux (auteur, date de publication, niveau de confidentialité, chemin de fichier).
4. **Vectorisation & Indexation :** Génération des embeddings et insertion dans la base vectorielle.

### B. Pipeline de requête (En ligne / Temps réel)
1. **Pré-traitement de la requête :** Reformulation de la question (Query Rewriting / HyDE) pour combler le manque de contexte de la question utilisateur.
2. **Recherche hybride :** Récupération conjointe des 20 meilleurs chunks par recherche sémantique (vecteurs) et recherche lexicale (BM25).
3. **Reranking :** Passage des candidats dans un Cross-Encoder pour retenir les 3 à 5 passages les plus pertinents.
4. **Génération contrôlée :** Construction du prompt avec consignes d'ancrage strictes (`Réponds uniquement en te basant sur le contexte fourni ci-dessous...`) et streaming de la réponse au client.

```text
Utilisateur -> Query Rewriter -> Hybrid Search (Vector + BM25)
                                          |
                                          v
                               Top 20 Chunks -> Reranker -> Top 4 Chunks -> LLM -> Réponse
```

## 4. Erreurs fatales à éviter absolument
- Envoyer aveuglément 20 chunks bruts dans le contexte du LLM (phénomène « Lost in the Middle »).
- Négliger la sécurité et les droits d'accès aux documents (un utilisateur ne doit jamais voir de contexte auquel son profil n'a pas accès).
