# Fiche Mémo 5.1 : Algorithmes supervisés (Régression, Random Forest, XGBoost)

## 1. Tableau comparatif express pour entretien
| Algorithme | Famille | Points forts | Points faibles | Cas d'usage idéal |
| :--- | :--- | :--- | :--- | :--- |
| **Régression Logistique** | Modèle linéaire | Interprétable (coefficients/odds ratios), très rapide, robuste sur peu de données | Incapable de capturer des non-linéarités sans feature engineering manuel | Scoring de crédit bancaire, baseline rapide |
| **Random Forest** | Ensembling (Bagging) | Très robuste au surapprentissage, peu de réglages d'hyperparamètres, gère les valeurs manquantes | Modèle lourd en mémoire, inférence plus lente que les modèles linéaires | Données tabulaires hétérogènes, modélisation robuste |
| **XGBoost / LightGBM** | Ensembling (Boosting) | Performances état de l'art sur données tabulaires, gestion native du sparsity, optimiseur sur mesure | Plus sensible au surapprentissage, nécessite un tuning rigoureux (learning rate, early stopping) | Compétitions Kaggle, détection de fraude, prédiction de churn |

## 2. Bagging vs Boosting : La question piège
- **Bagging (Bootstrap Aggregating) :** Entraîne des arbres indépendants en parallèle sur des sous-échantillons avec remise. Objectif principal : **Réduire la variance** (limiter le surapprentissage).
- **Boosting :** Entraîne des arbres séquentiellement où chaque nouvel arbre apprend des erreurs résiduelles des arbres précédents. Objectif principal : **Réduire le biais**.
