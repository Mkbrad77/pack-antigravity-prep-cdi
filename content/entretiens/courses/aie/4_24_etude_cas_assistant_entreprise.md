# Chapitre 4.24 : Étude de cas : Assistant documentaire d'entreprise

## 1. Énoncé de l'exercice d'architecture en entretien
« Concevez pour 5 000 collaborateurs un assistant IA interne capable de répondre aux questions RH et juridiques à partir de 200 000 documents PDF d'entreprise. Vous disposez d'un budget cloud maîtrisé et devez garantir la confidentialité des données. »

## 2. Architecture de référence en production
1. **Ingestion & Sécurité des données :**
   - Ingestion depuis SharePoint / Google Drive via connecteurs avec synchronisation différentielle quotidienne.
   - Tagging systématique des métadonnées d'habilitation (département, pays, niveau de confidentialité).
2. **Optimisation des coûts : Cache sémantique (GPTCache / Redis) :**
   - ~30 % des questions RH posées sont quasi identiques (congés payés, mutuelle, télétravail).
   - Une requête dont la similarité vectorielle dépasse 0.95 avec une question déjà traitée est renvoyée immédiatement depuis le cache, réduisant la latence à < 50 ms et économisant les appels LLM.
3. **Recherche & Génération :**
   - Moteur hybride pgvector + BM25 avec filtre strict sur les droits de l'utilisateur connecté (JWT claims).
   - Reranker léger local pour retenir les 3 meilleurs passages.
   - Modèle LLM hébergé en environnement privé (Azure OpenAI Service avec contrat Zéro Retention de données ou AWS Bedrock).
4. **Observabilité & Feedback loop :**
   - Boutons Pouce Vert / Pouce Rouge sur chaque réponse. Les réponses mal notées sont enregistrées pour analyse humaine et enrichissement continu de la documentation.

## 3. Chiffrage et dimensionnement type
- 200 000 documents = ~2 millions de chunks vectoriels -> ~6 Go de RAM pour l'index pgvector.
- Coût d'infrastructure estimé : < 800 € / mois pour 5 000 utilisateurs grâce au cache sémantique et au filtrage amont.
