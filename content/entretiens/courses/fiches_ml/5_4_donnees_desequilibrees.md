# Fiche Mémo 5.4 : Gestion des données déséquilibrées

## 1. Les trois leviers d'action
1. **Au niveau des données (Resampling) :**
   - *Undersampling (Sous-échantillonnage de la classe majoritaire) :* Rapide, mais perte d'informations potentielles.
   - *SMOTE (Synthetic Minority Over-sampling Technique) :* Crée de nouveaux exemples synthétiques le long des segments reliant les k plus proches voisins de la classe minoritaire.
2. **Au niveau de l'algorithme (Cost-sensitive Learning) :**
   - Attribuer une pénalité plus élevée aux erreurs commises sur la classe minoritaire via le paramètre `class_weight='balanced'` (scikit-learn) ou `scale_pos_weight` (XGBoost).
   - Solution la plus propre et la plus recommandée en production car elle ne modifie pas artificiellement la distribution des données.
3. **Au niveau de la décision opérationnelle (Threshold Tuning) :**
   - Abaisser le seuil de décision de probabilité de 0.5 à 0.2 ou 0.1 pour maximiser le rappel selon le coût d'affaires d'un faux négatif.
