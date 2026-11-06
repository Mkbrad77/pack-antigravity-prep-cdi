# Chapitre 4.9 : Stratégies de Chunking

## 1. La question classique posée en entretien
« Comment découpez-vous vos documents (chunking) pour alimenter un système RAG et quelles sont les conséquences d'un mauvais dimensionnement des morceaux ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre compréhension du compromis de taille :
  - **Chunks trop petits (ex. 50 tokens) :** Perte du contexte global et de la cohérence de l'argumentaire.
  - **Chunks trop grands (ex. 2000 tokens) :** Dilution du signal vectoriel (l'embedding représente une moyenne vague du sujet) et gaspillage de fenêtre de contexte LLM.
- Votre maîtrise des techniques évoluées : Recursive Character Splitting, Document Structure-Aware Splitting, et Parent-Child Chunking.

## 3. Réponse d'ingénieur senior

### A. Les principales stratégies
1. **Recursive Character Chunking (Standard recommandé) :**
   Tente d'abord de découper par doubles sauts de ligne (`\n\n`, paragraphes), puis par simple saut de ligne (`\n`), puis par phrases (`.`), et enfin par mots. Préserve l'intégrité des paragraphes naturels.
2. **Chunking conscient de la structure (Markdown / HTML) :**
   Découpe selon les en-têtes (`#`, `##`, `<h3>`). Chaque chunk hérite du titre de sa section dans ses métadonnées, ce qui préserve le fil conducteur.
3. **Approche Parent-Child (Petits Chunks pour la recherche, Grands pour la génération) :**
   L'index vectoriel stocke de très petits chunks (ex. 128 tokens) hautement discriminants lors du matching sémantique. Une fois le chunk enfant trouvé, le système transmet au LLM le document parent complet (ex. 1024 tokens).

### B. Le rôle du chevauchement (Overlap)
Un overlap de 10 à 20 % (ex. 500 tokens de taille, 50 tokens de chevauchement) garantit qu'une idée clé ou une définition située à cheval sur deux blocs ne sera pas coupée au milieu d'une phrase.

## 4. Erreurs fatales à éviter absolument
- Découper brutalement par nombre de caractères arbitraire (ex. tous les 1 000 caractères) au milieu de mots ou de tableaux.
- Perdre les tableaux financiers en les traitant comme du texte brut au lieu de les formater en Markdown ou JSON.
