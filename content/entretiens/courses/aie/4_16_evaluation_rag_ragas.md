# Chapitre 4.16 : Évaluation de systèmes RAG (Ragas, TruLens)

## 1. La question classique posée en entretien
« Comment mesurez-vous de manière automatisée et reproductible la qualité d'un système RAG sans dépendre uniquement de relectures manuelles subjectives ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre connaissance du concept de **LLM-as-a-Judge** et de ses biais potentiels.
- Votre maîtrise de la triade d'évaluation standardisée du RAG :
  1. Pertinence du contexte (Context Relevance)
  2. Fidélité / Absence d'hallucination (Faithfulness / Groundedness)
  3. Pertinence de la réponse (Answer Relevance)
- Votre capacité à intégrer ces tests dans une chaîne CI/CD pour prévenir les régressions lors du changement d'un modèle d'embedding ou de prompt.

## 3. Réponse d'ingénieur senior

### A. Les métriques fondamentales de Ragas
1. **Context Precision & Recall :**
   - *Precision :* Les chunks pertinents sont-ils situés en tête des résultats ?
   - *Recall :* L'ensemble des faits nécessaires pour répondre à la question a-t-il été récupéré ?
2. **Faithfulness (Fidélité au contexte) :**
   Mesure si chaque assertion de la réponse générée peut être directement déduite du contexte fourni. C'est la métrique anti-hallucination par excellence.
3. **Answer Relevance :**
   Mesure si la réponse répond bien à la question initiale, sans digression superflue.

### B. Protocole de test de non-régression
Créer un jeu de données de référence (Golden Dataset) de 50 à 100 paires question-réponse validées par les experts métier. À chaque modification (ex. passage de GPT-4o-mini à Claude 3.5 Sonnet, ou ajustement de la taille de chunking), le banc de test ré-évalue les scores automatiquement.

## 4. Erreurs fatales à éviter absolument
- Se fier aux métriques traditionnelles du NLP comme BLEU ou ROUGE (qui mesurent le recouvrement textuel exact sans comprendre le sens).
- Déployer un RAG sans monitoring continu des requêtes utilisateurs en production.
