# Fiche Express Section 5 : Performance, optimisation et gouvernance (15 %)

## 1. Vue d'ensemble de la Section 5
La Section 5 évalue l'optimisation des temps de calcul, l'accélération des cycles de développement (--empty, --sample), la gouvernance inter-projets (dbt Mesh, accès, versions) et la gestion des dépendances (packages).

## 2. Les 12 Chiffres, Propriétés et Outils Critiques à Retenir
1. Flag `--empty` (dbt 1.8+) : injecte automatiquement un filtre `WHERE false` sur les sources et modèles pour valider la compilation et créer les schémas sans traiter aucune donnée.
2. Flag `--sample` : restreint l'ingestion à un échantillon temporel (ex: `--sample 3d` pour 3 jours).
3. 3 Niveaux de visibilité de modèle (`access:`) : `private` (même groupe uniquement), `protected` (même projet, valeur par défaut), `public` (accessible inter-projets via dbt Mesh).
4. Groupes (`groups:`) : structure logique associant des modèles à une équipe propriétaire responsable.
5. Versions de modèles (`versions:`) : permet de publier `v1` et `v2` en parallèle avec `latest_version` et `deprecation_date`.
6. Fichier `packages.yml` : liste les dépendances externes (ex: `dbt-utils`, `codegen`, `dbt-expectations`).
7. Commande `dbt deps` : télécharge et installe les packages définis dans `packages.yml` dans le dossier `dbt_packages/`.
8. Commande `dbt clean` : supprime les dossiers d'artefacts `target/` et de dépendances `dbt_packages/`.
9. Microbatch incremental : partitionne le calcul par fenêtres d'horodatage définies par `event_time` et `batch_size`.
10. Couche sémantique (dbt Semantic Layer) : centralise les métriques d'entreprise propulsée par le moteur MetricFlow.
11. Durée de l'examen dbt Developer : 120 minutes pour 65 questions (seuil de passage à 65 %).
12. Règles de nommage versionnées : les fichiers physiques s'appellent `nom_v1.sql` et `nom_v2.sql`, mais l'appel dans `ref()` utilise le nom générique avec l'argument `v`.

## 3. Matrice Décisionnelle de Gouvernance et Performance
- Valider que le SQL compile et que les tables se créent sans payer de calcul : `dbt run --empty`.
- Empêcher une équipe externe de dépendre d'une table intermédiaire interne : déclarer `access: private` avec un `group`.
- Offrir une table certifiée consommable par d'autres projets dbt : déclarer `access: public` avec contrat de modèle obligatoire.
- Modifier la signature d'un modèle central sans casser les tableaux de bord existants : publier une nouvelle version (`v2`) et renseigner une `deprecation_date` sur `v1`.
- Réutiliser des tests avancés ou des macros standardisées de la communauté : ajouter le package `dbt-labs/dbt_utils` via `packages.yml`.
- Réduire les coûts sur une table de faits de plusieurs milliards de lignes : basculer sur une stratégie incrémentale `microbatch`.

## 4. Les 5 Pièges Majeurs d'Examen de la Section 5
1. Modèle privé appelé hors de son groupe : provoque une erreur de compilation immédiate lors de la résolution du DAG.
2. Contrat obligatoire sur modèle public : dans une architecture dbt Mesh, un modèle marqué `access: public` doit obligatoirement avoir son contrat appliqué (`contract: enforced: true`).
3. Confusion entre `dbt deps` et `dbt run` : `dbt run` n'installe pas les packages. Si `dbt_packages/` est absent, vous devez impérativement exécuter `dbt deps` au préalable.
4. Effet de `dbt clean` : supprime entièrement `target/` et `dbt_packages/`. Si vous relancez `dbt build` sans avoir fait `dbt deps`, le projet échoue.
5. Gestion du temps à l'examen : 120 minutes pour 65 questions laisse moins de 2 minutes par question. Marquez (Flag) les questions de code YAML complexes pour les relire en fin de session.
