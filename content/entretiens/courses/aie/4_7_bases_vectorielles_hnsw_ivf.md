# Chapitre 4.7 : Bases vectorielles & Indexation (HNSW, IVF)

## 1. La question classique posée en entretien
« Comment fonctionne un index HNSW (Hierarchical Navigable Small World) par rapport à une recherche exacte k-NN, et quels compromis impose-t-il entre latence, mémoire et rappel ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre compréhension du passage de la recherche exacte (O(N), infaisable à l'échelle de millions de vecteurs) à la recherche approximative des plus proches voisins (ANN - Approximate Nearest Neighbors).
- Le fonctionnement des deux grands types d'index : HNSW (graphes multicouches) et IVF (partitionnement de Voronoï par centroïdes).
- Votre expérience sur les moteurs réels (pgvector, Qdrant, Milvus, OpenSearch Vector Engine).

## 3. Réponse d'ingénieur senior

### A. Algorithme HNSW (Graphe Navigable Petit Monde)
Inspiré des structures en Skip-List :
- **Couches supérieures :** Graphes clairsemés avec des liens longue distance permettant de traverser rapidement l'espace vectoriel vers la région d'intérêt.
- **Couches inférieures :** Graphes de plus en plus denses reliant les voisins immédiats pour affiner la recherche.
- **Avantages :** Excellent rappel (> 95 %), latence de requête ultra-faible (quelques millisecondes).
- **Inconvénient :** Consommation mémoire importante en RAM pour maintenir la structure de graphe.

### B. Algorithme IVF (Inverted File Index)
- Découpe l'espace en k cellules de Voronoï autour de centroïdes (via k-means).
- Lors de la requête, l'algorithme identifie les `nprobe` centroïdes les plus proches et ne recherche que dans ces cellules.
- **Avantage :** Empreinte mémoire plus faible, construction d'index plus rapide.
- **Inconvénient :** Risque de rater des voisins proches situés juste de l'autre côté d'une frontière de Voronoï si `nprobe` est trop faible.

### C. Panorama des solutions
Pour un projet d'entreprise débutant avec moins de 500 000 documents, `pgvector` sur une base PostgreSQL existante est la recommandation la plus pragmatique (zéro nouvelle infrastructure à maintenir, support des transactions relationnelles et des jointures de métadonnées).

## 4. Erreurs fatales à éviter absolument
- Déployer un cluster vectoriel spécialisé coûteux alors qu'une simple extension `pgvector` couvrait largement les besoins.
- Oublier de quantifier les vecteurs (Scalar / Product Quantization) lorsque l'index dépasse la RAM disponible.
