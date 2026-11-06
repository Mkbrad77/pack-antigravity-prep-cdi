# Fiche Mémo 6.5 : Clean Code & Architecture Hexagonale en Data/IA

## 1. Pourquoi l'architecture hexagonale en Data ?
L'un des plus grands défauts des pipelines data débutants est d'entremêler la logique métier (calculs de marges, scoring client) avec les détails techniques d'infrastructure (connexion SQL SQLAlchemy, lecture de fichier S3, client API externe).

## 2. Ports et Adaptateurs (Architecture Ports & Adapters)
- **Cœur de domaine (Domain Core) :** Fonctions pures en Python sans dépendance externe lourde. Prend des structures de données simples en entrée et renvoie des résultats. Testable unitairement en quelques millisecondes sans base de données.
- **Ports (Interfaces) :** Contrats abstraits (ex. `DataRepositoryInterface`).
- **Adaptateurs (Adapters) :**
  - *Adaptateur de production :* Écrit dans la vraie table Snowflake.
  - *Adaptateur de test :* Stocke dans un dictionnaire en mémoire pour les tests unitaires locaux ultra-rapides.
