# Fiche Mémo 5.3 : Surapprentissage, Régularisation & Fuite de données

## 1. L1 (Lasso) vs L2 (Ridge)
- **Régularisation L1 (Lasso) :** Ajoute la pénalité `lambda * sum(|w_i|)`. Force certains coefficients à zéro exact. Fait de la **sélection automatique de variables (sparse models)**.
- **Régularisation L2 (Ridge) :** Ajoute la pénalité `lambda * sum(w_i^2)`. Réduit l'amplitude des coefficients sans jamais les annuler totalement. Idéal en présence de colinéarité entre variables.
- **ElasticNet :** Combine les pénalités L1 et L2.

## 2. Éviter la fuite de données (Data Leakage)
- **Règle d'or absolue :** Tout prétraitement (imputation des valeurs manquantes, normalisation StandardScaler, encodage catégoriel) doit être calculé **uniquement** sur le jeu d'entraînement (Train Set) et simplement appliqué sur le jeu de test (Test Set).
- Utiliser impérativement les `Pipeline` scikit-learn pour garantir l'étanchéité lors de la validation croisée (`cross_val_score`).
