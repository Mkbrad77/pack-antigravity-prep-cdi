# Fiche Mémo 5.5 : Cycle de vie MLOps et dérive (Drift)

## 1. Data Drift vs Concept Drift
- **Data Drift (Covariate Shift) :** La distribution des variables explicatives `P(X)` change dans le temps, mais la relation `P(Y|X)` reste identique.
  - *Exemple :* L'âge moyen des utilisateurs d'une application passe de 25 à 45 ans.
- **Concept Drift :** La relation entre les entrées et la cible `P(Y|X)` change fondamentalement.
  - *Exemple :* Une crise économique majeure modifie subitement les comportements de défaut de remboursement pour un même niveau de revenus.

## 2. Détection et remédiation en production
- **Tests statistiques de dérive :** Test de Kolmogorov-Smirnov (variables continues), Test du Chi-2 ou Population Stability Index (PSI).
- **Rôle de MLflow :**
  - Tracking des paramètres, métriques et artefacts d'entraînement.
  - Model Registry pour gérer les transitions de cycles de vie (Staging, Production, Archived).
