# Chapitre 4.2 : Paramètres d'inférence (Temperature, Top-p), Sorties Structurées (JSON/Pydantic) et Tool Calling

**Tâches du planning associées :** `W16-I2` (`4.2`)  
**Durée de lecture estimée :** 15 min  
**Objectif entretien :** Expliquer mathématiquement le décodage auto-régressif (`temperature`, `top_p`, `top_k`), garantir à 100 % des sorties JSON conformes à un schéma Pydantic via le *Constrained Decoding* (CFG / FSM), et implémenter une boucle de *Function / Tool Calling* sécurisée.

---

## 1. Décodage Auto-Régressif : `temperature`, `top_p`, `top_k`

À chaque étape de génération, le LLM produit un vecteur de **logits** $z \in \mathbb{R}^{|V|}$ sur l'ensemble du vocabulaire $V$. La probabilité du token $i$ est obtenue par la fonction Softmax avec **température $T$** :

$$P(w_i \mid w_{<t}) = \frac{\exp(z_i / T)}{\sum_{j \in V} \exp(z_j / T)}$$

| Paramètre | Rôle mathématique | Valeur recommandée en production | Règle d'entretien |
|---|---|---|---|
| **`temperature`** ($T$) | Échelle appliquée aux logits avant le Softmax. Si $T \to 0$, la distribution converge vers un `argmax` déterministe (Greedy Decoding). Si $T > 1$, la distribution s'aplatit (plus d'aléatoire). | **`T = 0.0`** pour l'extraction de données, le SQL, le RAG factuel, le Tool Calling et la classification. `0.3 - 0.7` pour la rédaction créative. | Pourquoi `T = 0` n'est-il pas toujours 100 % déterministe sur les API cloud ? À cause du **non-déterminisme des opérations flottantes GPU** en batch dynamique (Mixture-of-Experts / FlashAttention). Utiliser le paramètre `seed` quand disponible. |
| **`top_p`** *(Nucleus Sampling)* | Trie les tokens par probabilité décroissante et ne conserve que le plus petit sous-ensemble dont la **somme cumulée des probabilités atteint $p$** (ex: `0.90`). | `1.0` si on règle déjà `temperature`, ou `0.9` avec `T = 1.0`. | **Recommandation officielle OpenAI / Anthropic** : modifier `temperature` **OU** `top_p`, mais **jamais les deux en même temps**. |
| **`top_k`** | Ne conserve que les $k$ tokens les plus probables (ex: $k = 40$). | `40 - 50` (utilisé sur Gemini, Claude, vLLM). | Moins adaptatif que `top_p` : si la distribution est très plate, $k=40$ coupe trop tôt ; si un seul token a 99 %, $k=40$ garde 39 tokens aberrants. |

---

## 2. Sorties Structurées (Structured Outputs) : Du Prompting au Constrained Decoding

Dans un pipeline Data ou un agent IA, recevoir du texte libre (`"Voici votre JSON : ```json ..."` ou un JSON mal formé) casse le code en aval. On distingue 3 niveaux de fiabilité :

1. **Prompting naïf** (*"Réponds uniquement en JSON"*) : **À proscrire en production**. Taux d'échec de 2 % à 10 % (virgules traînantes, clés manquantes, commentaires ajoutés).
2. **JSON Mode (`response_format={"type": "json_object"}`)** : Garantit un JSON syntaxiquement valide (`json.loads()` ne plante pas), **mais ne garantit pas le respect du schéma métier** (une clé obligatoire peut manquer ou avoir le mauvais type).
3. **Structured Outputs (`response_format=PydanticModel` / Constrained Decoding)** :
   - **Comment ça marche sous le capot (Outlines, vLLM, OpenAI Structured Outputs) ?** Le schéma JSON (dérivé du modèle Pydantic) est compilé en une **grammaire hors-contexte (CFG)** ou un **automate à états finis (FSM)**.
   - À chaque étape de génération de token, le moteur d'inférence applique un **masque de logits ($\text{logit\_bias} = -\infty$)** sur tous les tokens qui violeraient la grammaire JSON ou le schéma Pydantic à l'état courant.
   - **Résultat** : 100 % de conformité structurelle et de typage, zéro erreur de parsing syntaxique.

```python
from pydantic import BaseModel, Field
from typing import Literal

class SupportTicketExtraction(BaseModel):
    category: Literal["billing", "technical_bug", "feature_request", "account_access"]
    urgency_score: int = Field(ge=1, le=5, description="Score d'urgence de 1 (faible) à 5 (critique)")
    affected_service: str | None = Field(default=None, description="Nom du service impacté si mentionné")
    summary: str = Field(max_length=200)
```

---

## 3. Function Calling / Tool Calling : Architecture d'Exécution

### 3.1. Le piège classique en entretien
**Un LLM n'exécute JAMAIS de fonction ou d'API lui-même.** Le LLM ne fait que générer une **intention d'appel structurée** (le nom de l'outil et ses arguments JSON : `{"name": "get_customer_orders", "arguments": {"customer_id": "C-892"}}`). C'est **votre code applicatif (Orchestrateur Python)** qui intercepte cette sortie, valide les droits et les arguments, exécute réellement la fonction, puis renvoie le résultat au LLM dans un message de rôle `tool`.

### 3.2. Boucle complète de Tool Calling en production

```
[Utilisateur] ──► (1) Prompt + Schémas JSON des Tools disponibles ──► [LLM]
                                                                        │
                  (2) Stop reason = "tool_calls" :                      ▼
                      [{"id": "call_1", "name": "query_kpi", "args": {"metric": "mrr"}}]
                                                                        │
[Application Python] ◄──────────────────────────────────────────────────┘
   │  - Validation Pydantic des arguments + Contrôle RBAC (droits utilisateur)
   │  - Exécution de la fonction Python avec timeout & gestion d'erreur
   ▼
[Application Python] ──► (3) Message role="tool" (tool_call_id="call_1", content="142500 EUR") ──► [LLM]
                                                                                                      │
[Utilisateur] ◄───────── (4) Réponse finale synthétisée par le LLM ◄──────────────────────────────────┘
```

### 3.3. Bonnes pratiques d'ingénierie pour le Tool Calling
- **Descriptions d'outils ultra-précises** : La docstring de la fonction et les `Field(description=...)` Pydantic font partie intégrante du prompt système vu par le LLM. Indiquer clairement *quand* utiliser l'outil et *quand ne pas l'utiliser*.
- **Limiter le nombre d'outils (< 15 à 20 par appel)** : Au-delà de 20 outils simultanés dans le contexte, la précision de sélection chute et la consommation de tokens d'entrée explose. Si l'application possède 100 outils, utiliser un **routeur sémantique** en amont pour n'injecter que les 5 outils pertinents.
- **Sécurité et garde-fous** :
  - Toujours valider les arguments avec Pydantic avant exécution.
  - Ne jamais exposer un outil `execute_raw_sql(query: str)` avec des droits d'écriture (`DROP`, `UPDATE`) : utiliser un compte DB **Read-Only** avec `statement_timeout` de 5 secondes, ou préférer des outils paramétrés métier (`get_monthly_revenue(year: int, month: int)`).
  - Fixer une limite stricte d'itérations (`MAX_TOOL_ITERATIONS = 5`) dans la boucle `while` pour éviter les boucles infinies si le LLM échoue à appeler un outil.

---

*Source : générée par IA et vérifiée dans la documentation officielle OpenAI Structured Outputs, Anthropic Tool Use & Pydantic v2 (2026-10-31).*
