# Fiche Mémo 5.2 : Métriques d'évaluation et choix critique

## 1. La matrice de confusion en un coup d'œil
- **Précision (Precision) :** `TP / (TP + FP)`. Parmi tous les cas prédits positifs, quelle proportion était réellement positive ?
  - *Priorité :* Quand un faux positif coûte très cher (ex. classer un email légitime en spam, recommander une sanction abusive).
- **Rappel (Recall / Sensibilité) :** `TP / (TP + FN)`. Parmi tous les cas réellement positifs, quelle proportion le modèle a-t-il détectée ?
  - *Priorité :* Quand rater un positif est inacceptable (ex. détection de tumeur maligne, détection de fraude financière).
- **F1-Score :** Moyenne harmonique de la précision et du rappel : `2 * (P * R) / (P + R)`. Équilibre optimal sur données asymétriques.

## 2. ROC-AUC vs PR-AUC : Le piège des données déséquilibrées
- **ROC-AUC (Receiver Operating Characteristic) :** Mesure la séparation globale entre les classes.
  - *Attention :* Donne une illusion de performance sur les classes ultra-minoritaires (ex. 0.1 % de fraude) car le taux de faux positifs reste artificiellement bas.
- **PR-AUC (Precision-Recall AUC) :** À utiliser **impérativement** sur les données fortement déséquilibrées. Se focalise exclusivement sur la détection de la classe minoritaire d'intérêt.
