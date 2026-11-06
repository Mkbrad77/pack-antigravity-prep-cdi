# Nouveautés de l'examen dbt 2026 et stratégie de passage

## 1. Objectifs d'apprentissage
Connaître le format exact et les conditions de passage de la certification dbt Certified Developer.
Identifier les sujets majeurs récemment introduits dans le programme d'examen (unit tests, contrats, microbatch, mesh).
Maîtriser la gestion du temps pour les 65 questions en 120 minutes.
Appliquer les techniques d'élimination des réponses pièges.

## 2. Explication claire : quand choisir quoi
L'examen officiel dbt Certified Developer (programme 2026) évalue la capacité à concevoir, tester, déployer et maintenir des projets dbt Core et dbt Cloud en environnement d'entreprise.
- **Format de l'examen** :
  - Nombre de questions : 65 questions à choix simple ou multiple.
  - Durée : 120 minutes (environ 1 minute 50 par question).
  - Note de passage : 65 % (environ 43 bonnes réponses requises).
  - Modalité : En ligne surveillé ou centre de test agréé.
- **Évolution du programme d'examen en 2026** :
  Historiquement centré sur les bases (ref, source, materializations, tests génériques), l'examen intègre désormais les fonctionnalités avancées de gouvernance et de performance :
  1. **Unit tests** : Validation unitaire de la logique SQL avec données mockées sans toucher aux sources réelles.
  2. **Model contracts** : Imposition stricte des types de données et contraintes d'intégrité lors de la compilation.
  3. **dbt Mesh et gouvernance** : Niveaux d'accès (private, protected, public), groupes et versions de modèles.
  4. **Microbatch et optimisation** : Stratégie incrémentale par fenêtres d'horodatage, flags `--empty` et `--sample`.
  5. **Slim CI et sélection fine** : Combinaison de `state:modified+` et `--defer` pour l'automatisation CI/CD.

## 3. Définitions des termes clés
- **dbt Certified Developer** : Titre officiel certifiant l'expertise dbt sur les standards de l'industrie.
- **Flag for review** : Fonctionnalité de l'interface d'examen permettant de marquer les questions incertaines pour y revenir en fin d'épreuve.
- **Single vs Multiple select** : Attention, les questions à choix multiple indiquent explicitement le nombre d'options attendues (ex: "Sélectionnez 2 réponses").

## 4. Exemple concret
Plan de gestion du temps recommandé pour les 120 minutes :

```text
Phase 1 (0 à 75 min) : Premier passage rapide sur les 65 questions.
- Répondre immédiatement aux questions évidentes.
- En cas d'hésitation, éliminer les réponses absurdes, choisir la meilleure option et marquer la question (Flag).
- Viser un rythme de 1 minute 10 par question.

Phase 2 (75 à 110 min) : Deuxième passage sur les questions marquées (Flag).
- Relire attentivement le contexte et le code YAML/SQL.
- Vérifier les détails de syntaxe (deux-points, tirets, guillemets).

Phase 3 (110 à 120 min) : Relecture finale et soumission.
- S'assurer qu'aucune question n'a été laissée sans réponse (aucune pénalité pour mauvaise réponse).
```

## 5. Comparaisons et pièges d'examen
- **Attention au vocabulaire trompeur** : Ne confondez pas un test unitaire (`unit_test`) qui valide la logique SQL en amont, avec un test de données (`singular / generic data test`) qui valide l'état réel des tables dans la base.
- **Piège de syntaxe YAML** : Beaucoup de questions piègent sur l'indentation ou le placement d'une directive (par exemple placer `contract:` sous `config:` ou sous la racine du modèle).
- **Pas de pénalité de points négatifs** : Ne laissez jamais une question vierge.

## 6. Lien avec SQL, Snowflake et Databricks
- L'examen dbt teste la logique agnostique de dbt Core, mais les concepts (MERGE, Zero-Copy clone, rôles) s'appliquent directement sur Snowflake et Databricks.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçon 164
- Cours secondaire Weigel : leçons 3, 120, 129 à 130
- Documentation officielle : https://docs.getdbt.com/docs/build/unit-tests (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Combien de temps dure l'examen dbt Certified Developer et combien de questions comporte-t-il ? (Réponse : 120 minutes pour 65 questions)
2. Quel est le seuil approximatif de réussite à l'examen dbt ? (Réponse : 65 %)
3. Quelles sont les nouvelles fonctionnalités de gouvernance fréquemment testées dans le programme 2026 ? (Réponse : Les tests unitaires, les contrats de modèles, les niveaux d'accès public/privé, les versions de modèles et la stratégie microbatch)
