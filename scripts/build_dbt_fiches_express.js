import fs from 'node:fs';
import path from 'node:path';
import { cleanEmDashes } from './question_builder.js';

const FICHES_DIR = path.join(process.cwd(), 'content', 'certifications', 'dbt', 'fiches_express');

const fiches = [
  {
    filename: 'fiche-express-s1-developing-models.md',
    title: "Section 1 : Développer des modèles dbt (30 %)",
    content: `# Fiche Express Section 1 : Développer des modèles dbt (30 %)

## 1. Vue d'ensemble de la Section 1
La Section 1 constitue le bloc le plus lourd de l'examen dbt Certified Developer (30 %). Elle évalue la capacité à structurer un projet dbt, sélectionner les matérialisations adéquates, utiliser Jinja et les macros, paramétrer les modèles incrémentaux et exploiter les sources et seeds.

## 2. Les 12 Chiffres, Seuils et Syntaxes Critiques à Retenir
1. 4 Matérialisations natives principales : \`view\` (défaut), \`table\`, \`incremental\`, \`ephemeral\`.
2. Seeds dbt : réservés aux fichiers CSV statiques de petite taille (< quelques mégaoctets, moins de 10 000 lignes) ; jamais pour les volumétries massives.
3. Syntaxe Jinja délimitée : \`{{ expression }}\` pour afficher une valeur ou appeler une fonction, \`{% contrôle %}\` pour boucles et conditions, \`{# commentaire #}\` pour commentaires non compilés.
4. Macro \`ref('modele')\` : crée automatiquement la dépendance dans le DAG et résout le nom de l'objet selon l'environnement (schéma/base).
5. Macro \`source('nom_source', 'nom_table')\` : déclare une dépendance vers une table brute non gérée par dbt.
6. Macro \`is_incremental()\` : renvoie \`true\` uniquement si la table cible existe déjà dans l'entrepôt, si la matérialisation est incrémentale et si \`--full-refresh\` n'est pas passé.
7. Stratégies incrémentales : \`merge\` (défaut sur Snowflake/BigQuery), \`delete+insert\`, \`append\`, \`microbatch\` (dbt 1.9+).
8. Paramètre \`unique_key\` : colonne ou liste de colonnes identifiant l'unicité de chaque ligne lors d'un \`merge\` incrémental.
9. Configuration \`on_schema_change\` : valeurs possibles \`ignore\` (défaut), \`fail\`, \`append_new_columns\`, \`sync_all_columns\`.
10. Modèles Python : prennent obligatoirement la signature \`def model(dbt, session):\` et doivent retourner un DataFrame.
11. Matérialisations supportées en Python : \`table\` et \`incremental\` exclusivement (\`view\` et \`ephemeral\` interdites).
12. Variables de projet : syntaxe \`var('cle', 'valeur_defaut')\`, surchargeable en CLI par \`--vars '{"cle": "valeur"}'\`.

## 3. Matrice Décisionnelle d'Architecture : Quand Choisir Quoi
- Tables de staging et vues intermédiaires légères : matérialisation \`view\` (zéro coût de stockage, fraîcheur temps réel).
- Tables de marts consommées par des tableaux de bord BI : matérialisation \`table\` (requêtes ultra-rapides, compute payé au build).
- Tables volumineuses de faits temporels ou logs : matérialisation \`incremental\` ou \`microbatch\`.
- Sous-requêtes SQL modulaires très simples partagées par 2 ou 3 modèles : matérialisation \`ephemeral\` (CTE injectée).
- Calculs statistiques avancés, inférence ML ou parsing NLP : modèles Python \`.py\` (exécutés via Snowpark ou Spark).
- Tables de mapping statiques (codes pays, catégories de produits) : \`dbt seed\` avec fichier CSV dans \`seeds/\`.

## 4. Les 5 Pièges Majeurs d'Examen de la Section 1
1. Tenter d'exécuter un modèle éphémère : la commande \`dbt run --select mon_modele_ephemeral\` ne crée aucun objet physique dans la base de données.
2. Oublier la macro \`ref()\` : si vous écrivez le nom de la table en dur dans le code SQL au lieu de \`{{ ref('stg_orders') }}\`, dbt ne peut pas construire le DAG et ordonner les exécutions.
3. Absence de \`unique_key\` sur un \`merge\` incrémental : sans clé unique, les réexécutions incrémentales génèrent des doublons ou provoquent une erreur SQL.
4. Priorité des configurations : le bloc \`config()\` dans le fichier \`.sql\` prévaut toujours sur les règles générales définies dans \`dbt_project.yml\`.
5. Modèle Python et vue : un modèle Python ne peut jamais être matérialisé en \`view\`. L'examen propose souvent cette option fausse.
`
  },
  {
    filename: 'fiche-express-s2-debugging-errors.md',
    title: "Section 2 : Déboguer les erreurs de modélisation (20 %)",
    content: `# Fiche Express Section 2 : Déboguer les erreurs de modélisation (20 %)

## 1. Vue d'ensemble de la Section 2
La Section 2 évalue la capacité à diagnostiquer rapidement les erreurs de configuration, les échecs de compilation Jinja, les erreurs d'exécution SQL et les dépendances circulaires dans le DAG.

## 2. Les 10 Chiffres, Commandes et Chemins Critiques à Retenir
1. Commande \`dbt debug\` : teste la validité des fichiers \`dbt_project.yml\`, \`profiles.yml\`, la connexion réseau et les autorisations de base de données.
2. Commande \`dbt compile\` : interprète Jinja et compile les fichiers SQL dans \`target/compiled/\` sans envoyer de requête de modification à l'entrepôt.
3. Commande \`dbt show\` : exécute la requête et affiche les premières lignes sous forme tabulaire dans le terminal (5 lignes par défaut).
4. Commande \`dbt retry\` : relance immédiatement les nœuds ayant échoué lors de la dernière commande sans recalculer les succès.
5. Fichier \`target/manifest.json\` : artefact JSON décrivant la totalité du graphe (DAG), les dépendances, tags et métadonnées.
6. Fichier \`target/run_results.json\` : artefact consignant le statut d'exécution (success, error, fail, skipped) et les durées de chaque modèle.
7. Fichier journal \`logs/dbt.log\` : conserve l'historique exhaustif des requêtes SQL et erreurs brutes renvoyées par l'entrepôt.
8. Dossier \`target/compiled/projet/models/\` : contient le SQL résolu (Jinja compilé en SQL pur).
9. Dossier \`target/run/projet/models/\` : contient les requêtes DDL/DML complètes (\`CREATE TABLE AS SELECT ...\`).
10. Flag \`--limit N\` de \`dbt show\` : permet de restreindre le nombre de lignes retournées (ex: \`dbt show --limit 10\`).

## 3. Matrice Décisionnelle de Dépannage : Quel Outil Selon l'Erreur
- Échec de connexion ou d'authentification au démarrage : exécuter \`dbt debug\` pour vérifier les identifiants et les variables d'environnement.
- Erreur de syntaxe Jinja ou variable manquante : exécuter \`dbt compile --select modele\` pour inspecter la compilation sans toucher à la base.
- Erreur de syntaxe SQL ou de typage colonne : ouvrir le fichier SQL dans \`target/compiled/\` et le tester directement dans la console Snowflake/Databricks.
- Dépendance circulaire (Found a cycle in the DAG) : inspecter les macros \`ref()\` pour supprimer la boucle entre les modèles A et B.
- Vérification rapide des données d'un modèle sans créer de table : lancer \`dbt show --select modele\`.
- Reprise rapide d'un pipeline planté sur 1 modèle parmi 100 : exécuter \`dbt retry\`.

## 4. Les 5 Pièges Majeurs d'Examen de la Section 2
1. Confondre \`dbt compile\` et \`dbt show\` : \`dbt compile\` ne se connecte pas pour exécuter le SELECT, il génère seulement les fichiers textes. \`dbt show\` interroge réellement la base pour afficher un échantillon.
2. Confondre \`dbt retry\` et \`state:modified\` : \`dbt retry\` se base sur \`run_results.json\` de la session précédente. \`state:modified\` compare deux \`manifest.json\` via \`--state\`.
3. Erreur circulaire dans le DAG : impossible à contourner par configuration ; seul un découpage de modèle ou l'utilisation d'une table intermédiaire résout la boucle.
4. Variable d'environnement manquante : si \`env_var('CLE')\` est appelée sans deuxième argument de repli et que la variable OS est absente, la compilation plante instantanément.
5. Incohérence de profil : exécuter dbt avec une mauvaise cible (\`--target\`) pointant vers un entrepôt ou une base inexistante génère des erreurs génériques d'accès.
`
  },
  {
    filename: 'fiche-express-s3-testing-documenting.md',
    title: "Section 3 : Tester, documenter et publier (20 %)",
    content: `# Fiche Express Section 3 : Tester, documenter et publier (20 %)

## 1. Vue d'ensemble de la Section 3
La Section 3 évalue la mise en place de la qualité des données, la documentation vivante du projet, la gouvernance de schéma et les tests unitaires.

## 2. Les 12 Chiffres, Tests et Directives Critiques à Retenir
1. 4 Tests génériques natifs dbt : \`unique\`, \`not_null\`, \`accepted_values\`, \`relationships\`.
2. Emplacement des tests génériques : déclarés sous la clé \`tests:\` (ou \`data_tests:\` dans les versions récentes) dans les fichiers \`schema.yml\`.
3. Tests singuliers (Singular tests) : requêtes SQL autonomes placées dans \`tests/\` ; le test échoue si la requête renvoie une ou plusieurs lignes.
4. Niveaux de sévérité des tests : \`warn\` (affiche un avertissement et continue) et \`error\` (interrompt le pipeline si \`dbt build\` est utilisé).
5. Option \`store_failures\` : sauvegarde les lignes fautives dans une table dédiée de l'entrepôt pour faciliter l'audit.
6. Tests unitaires (\`unit_tests:\`) : valident la logique SQL interne d'un modèle avec des données simulées (mocks) sans interroger les vraies sources.
7. Blocs de documentation : déclarés avec la balise Jinja \`{% docs nom_bloc %} ... {% enddocs %}\` dans des fichiers \`.md\`.
8. Fonction \`doc('nom_bloc')\` : permet de réutiliser une description textuelle sur plusieurs colonnes ou modèles.
9. Commandes de documentation : \`dbt docs generate\` (crée \`catalog.json\`) et \`dbt docs serve\` (lance le serveur web local).
10. Exposures (\`exposures:\`) : déclarent les dépendances vers des consommateurs en aval (tableaux de bord Tableau, Looker, modèles ML).
11. Contrats de modèles (\`contract: enforced: true\`) : vérifient strictement que le SQL compilé respecte les noms et types de colonnes déclarés.
12. Fraîcheur des sources (\`dbt source freshness\`) : utilise \`loaded_at_field\` avec les seuils \`warn_after\` et \`error_after\`.

## 3. Matrice Décisionnelle Qualité : Quel Mécanisme Choisir
- Valider qu'un identifiant client n'est jamais nul et sans doublon : tests génériques \`not_null\` et \`unique\`.
- Valider qu'un code statut est parmi ('ACTIF', 'INACTIF', 'EN_ATTENTE') : test générique \`accepted_values\`.
- Valider l'intégrité référentielle entre une clé étrangère et une dimension : test générique \`relationships\`.
- Valider une règle métier complexe multi-tables (ex: solde toujours égal aux débits - crédits) : test singulier SQL dans \`tests/\`.
- Valider la logique d'un calcul complexe sur des cas limites (edge cases) avant le run : test unitaire (\`unit_tests\`).
- Protéger une table publique contre les régressions de colonnes : contrat de modèle (\`contract: enforced: true\`).
- Tracer l'impact d'une modification de modèle sur un rapport PowerBI : déclarer une \`exposure\`.

## 4. Les 5 Pièges Majeurs d'Examen de la Section 3
1. Confondre Data Tests et Unit Tests : les data tests s'exécutent sur les données réelles de la base ; les tests unitaires utilisent des données mockées en YAML.
2. Contrat de modèle et colonnes manquantes : si un contrat est activé (\`enforced: true\`), TOUTES les colonnes du SELECT doivent être explicitement typées dans le YAML, sinon le build échoue.
3. Test singulier qui passe : un test singulier dbt passe si et seulement si la requête retourne ZÉRO ligne. S'il renvoie des lignes, il est en échec.
4. Écrasement des tests par store_failures : à chaque exécution de test, dbt recrée ou vide la table de failures associée.
5. Emplacement des blocs de docs : les fichiers contenant des balises \`{% docs %}\` doivent avoir l'extension \`.md\` et être situés dans des dossiers scrutés par dbt.
`
  },
  {
    filename: 'fiche-express-s4-deployment-orchestration.md',
    title: "Section 4 : Déploiement et orchestration (15 %)",
    content: `# Fiche Express Section 4 : Déploiement et orchestration (15 %)

## 1. Vue d'ensemble de la Section 4
La Section 4 évalue la gestion des environnements dbt, l'exécution en intégration continue (CI/CD), l'optimisation Slim CI, l'utilisation de \`--defer\` et \`dbt clone\`.

## 2. Les 10 Chiffres, Flags et Concepts Critiques à Retenir
1. Fichier \`profiles.yml\` : localisé par défaut dans \`~/.dbt/\` ; ne doit JAMAIS être suivi dans le dépôt Git.
2. Paramètre \`--target\` (ou \`-t\`) : spécifie la cible d'exécution définie dans \`profiles.yml\` (ex: \`dbt run -t prod\`).
3. Formule Slim CI canonique : \`dbt build --select state:modified+ --defer --state path/to/prod/artifacts\`.
4. Artefact obligatoire pour la comparaison d'état : \`manifest.json\` de la branche de production.
5. Flag \`--defer\` : route les appels \`ref()\` manquants vers les tables de l'environnement de référence au lieu d'exiger leur création locale.
6. Commande \`dbt clone\` : crée des copies de tables sans dupliquer les octets de données physiques (Zero-Copy Clone).
7. Sélecteur \`state:modified+\` : sélectionne tous les nœuds modifiés ET tous leurs descendants en aval.
8. Sélecteur \`+state:modified\` : sélectionne tous les nœuds modifiés ET tous leurs ancêtres en amont.
9. Paramètre \`threads\` : définit le nombre maximal de requêtes SQL concurrentes soumises à la base (ex: \`threads: 8\`).
10. Différence \`dbt run\` vs \`dbt build\` : \`dbt run\` ignore les tests et seeds ; \`dbt build\` exécute graines, modèles, snapshots et tests dans l'ordre strict du graphe.

## 3. Matrice Décisionnelle d'Orchestration : Quand Choisir Quoi
- Déployer une modification en production : \`dbt build\` complet avec tests bloquants.
- Valider une Pull Request de manière économique et rapide : Slim CI avec \`state:modified+\` et \`--defer\`.
- Initialiser un environnement de sandbox rapidement sans recalculer les données : \`dbt clone --state path\`.
- Développer localement un modèle isolé sans reconstruire tout l'amont : \`dbt run --select mon_modele --defer --state path\`.
- Automatiser les exécutions programmées : orchestrateur externe (Airflow, Dagster, Prefect) appelant la CLI ou dbt Cloud.

## 4. Les 5 Pièges Majeurs d'Examen de la Section 4
1. Oublier \`--state\` avec \`--defer\` : \`--defer\` ne peut pas deviner l'état de référence ; il exige obligatoirement l'argument \`--state\`.
2. Résolution des dépendances en développement : avec \`--defer\`, si une table existe DÉJÀ dans le schéma de développement local, dbt l'utilise en priorité et n'interroge pas la production.
3. Risque de sécurité \`profiles.yml\` : commiter ce fichier sur GitHub expose les identifiants d'accès au Data Warehouse.
4. Comportement de \`dbt build\` en cas d'erreur de test : si un test échoue avec la sévérité \`error\`, tous les modèles situés en aval dans le DAG sont automatiquement passés au statut \`SKIPPED\`.
5. Différence entre \`state:modified.body\` et \`state:modified\` : \`state:modified.body\` ne tient compte que du code SQL pur en ignorant les changements de documentation ou de tags YAML.
`
  },
  {
    filename: 'fiche-express-s5-performance-optimization.md',
    title: "Section 5 : Performance, optimisation et gouvernance (15 %)",
    content: `# Fiche Express Section 5 : Performance, optimisation et gouvernance (15 %)

## 1. Vue d'ensemble de la Section 5
La Section 5 évalue l'optimisation des temps de calcul, l'accélération des cycles de développement (--empty, --sample), la gouvernance inter-projets (dbt Mesh, accès, versions) et la gestion des dépendances (packages).

## 2. Les 12 Chiffres, Propriétés et Outils Critiques à Retenir
1. Flag \`--empty\` (dbt 1.8+) : injecte automatiquement un filtre \`WHERE false\` sur les sources et modèles pour valider la compilation et créer les schémas sans traiter aucune donnée.
2. Flag \`--sample\` : restreint l'ingestion à un échantillon temporel (ex: \`--sample 3d\` pour 3 jours).
3. 3 Niveaux de visibilité de modèle (\`access:\`) : \`private\` (même groupe uniquement), \`protected\` (même projet, valeur par défaut), \`public\` (accessible inter-projets via dbt Mesh).
4. Groupes (\`groups:\`) : structure logique associant des modèles à une équipe propriétaire responsable.
5. Versions de modèles (\`versions:\`) : permet de publier \`v1\` et \`v2\` en parallèle avec \`latest_version\` et \`deprecation_date\`.
6. Fichier \`packages.yml\` : liste les dépendances externes (ex: \`dbt-utils\`, \`codegen\`, \`dbt-expectations\`).
7. Commande \`dbt deps\` : télécharge et installe les packages définis dans \`packages.yml\` dans le dossier \`dbt_packages/\`.
8. Commande \`dbt clean\` : supprime les dossiers d'artefacts \`target/\` et de dépendances \`dbt_packages/\`.
9. Microbatch incremental : partitionne le calcul par fenêtres d'horodatage définies par \`event_time\` et \`batch_size\`.
10. Couche sémantique (dbt Semantic Layer) : centralise les métriques d'entreprise propulsée par le moteur MetricFlow.
11. Durée de l'examen dbt Developer : 120 minutes pour 65 questions (seuil de passage à 65 %).
12. Règles de nommage versionnées : les fichiers physiques s'appellent \`nom_v1.sql\` et \`nom_v2.sql\`, mais l'appel dans \`ref()\` utilise le nom générique avec l'argument \`v\`.

## 3. Matrice Décisionnelle de Gouvernance et Performance
- Valider que le SQL compile et que les tables se créent sans payer de calcul : \`dbt run --empty\`.
- Empêcher une équipe externe de dépendre d'une table intermédiaire interne : déclarer \`access: private\` avec un \`group\`.
- Offrir une table certifiée consommable par d'autres projets dbt : déclarer \`access: public\` avec contrat de modèle obligatoire.
- Modifier la signature d'un modèle central sans casser les tableaux de bord existants : publier une nouvelle version (\`v2\`) et renseigner une \`deprecation_date\` sur \`v1\`.
- Réutiliser des tests avancés ou des macros standardisées de la communauté : ajouter le package \`dbt-labs/dbt_utils\` via \`packages.yml\`.
- Réduire les coûts sur une table de faits de plusieurs milliards de lignes : basculer sur une stratégie incrémentale \`microbatch\`.

## 4. Les 5 Pièges Majeurs d'Examen de la Section 5
1. Modèle privé appelé hors de son groupe : provoque une erreur de compilation immédiate lors de la résolution du DAG.
2. Contrat obligatoire sur modèle public : dans une architecture dbt Mesh, un modèle marqué \`access: public\` doit obligatoirement avoir son contrat appliqué (\`contract: enforced: true\`).
3. Confusion entre \`dbt deps\` et \`dbt run\` : \`dbt run\` n'installe pas les packages. Si \`dbt_packages/\` est absent, vous devez impérativement exécuter \`dbt deps\` au préalable.
4. Effet de \`dbt clean\` : supprime entièrement \`target/\` et \`dbt_packages/\`. Si vous relancez \`dbt build\` sans avoir fait \`dbt deps\`, le projet échoue.
5. Gestion du temps à l'examen : 120 minutes pour 65 questions laisse moins de 2 minutes par question. Marquez (Flag) les questions de code YAML complexes pour les relire en fin de session.
`
  }
];

console.log(`Writing ${fiches.length} dbt fiches express...`);
for (const f of fiches) {
  const filePath = path.join(FICHES_DIR, f.filename);
  const sanitizedContent = cleanEmDashes(f.content.trim() + '\n');
  fs.writeFileSync(filePath, sanitizedContent, 'utf-8');
  const words = sanitizedContent.trim().split(/\s+/).length;
  console.log(`Saved: ${f.filename} (${words} words)`);
}
