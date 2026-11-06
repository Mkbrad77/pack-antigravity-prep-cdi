import fs from 'node:fs';
import path from 'node:path';
import { makeQDomain, cleanEmDashes } from './question_builder.js';

const DOMAIN_S3 = "Section 3 : Testing, documenting, and publishing dbt models";

// 30 questions for Section 3 (dbt-q076 to dbt-q105)
const qData = [
  // tests (q076 to q082)
  {
    topic: "tests",
    statement: "Quels sont les quatre tests génériques (generic tests) intégrés nativement dans dbt Core sans nécessiter l'installation de packages additionnels ?",
    options: [
      "A) unique, not_null, accepted_values, relationships",
      "B) primary_key, foreign_key, check, default",
      "C) is_positive, regex_match, row_count, schema_diff",
      "D) distinct, non_empty, valid_range, integrity"
    ],
    ans: "A",
    expA: "les quatre tests génériques standards livrés par défaut dans dbt sont unique, not_null, accepted_values et relationships",
    expB: "primary_key et check sont des contraintes de base de données relationnelles ou de model contracts et non les quatre tests génériques dbt",
    expC: "ces tests proviennent du package tiers dbt-expectations ou dbt-utils et ne sont pas intégrés nativement au cœur",
    expD: "cette liste ne correspond pas aux mots-clés réservés des tests génériques natifs de dbt",
    url: "https://docs.getdbt.com/docs/build/data-tests#generic-data-tests",
    diff: "facile"
  },
  {
    topic: "tests",
    statement: "Quelle condition sur le résultat de la requête SQL détermine qu'un test de données dbt (qu'il soit générique ou singulier) a réussi ?",
    options: [
      "A) La requête doit retourner exactement zéro ligne",
      "B) La requête doit retourner la valeur booléenne TRUE",
      "C) La requête doit retourner au moins une ligne d'affirmation",
      "D) Le code de retour HTTP de l'entrepôt doit être 200"
    ],
    ans: "A",
    expA: "dans la convention de test de dbt, la requête de test recherche les enregistrements fautifs (les échecs) ; si elle renvoie 0 ligne, le test est considéré comme un succès",
    expB: "dbt ne teste pas le retour d'un booléen direct mais compte le nombre d'enregistrements retournés par le SELECT",
    expC: "retourner une ou plusieurs lignes signifie qu'il y a des violations et entraîne un avertissement ou un échec",
    expD: "dbt évalue le résultat tabulaire SQL et non des codes de statut réseau HTTP",
    url: "https://docs.getdbt.com/docs/build/data-tests#singular-data-tests",
    diff: "facile"
  },
  {
    topic: "tests",
    statement: "Un ingénieur souhaite conserver les enregistrements qui violent un test de données dans une table de l'entrepôt pour faciliter l'audit par les équipes métier. Quelle option doit-il configurer ?",
    options: [
      "A) store_failures: true",
      "B) save_errors: true",
      "C) persist_fails: true",
      "D) dump_bad_rows: true"
    ],
    ans: "A",
    expA: "l'option store_failures: true indique à dbt de matérialiser les lignes échouées dans un schéma dédié (dbt_test__audit par défaut) sous forme de table interrogeable",
    expB: "save_errors n'est pas une directive de configuration valide de dbt",
    expC: "persist_fails n'existe pas dans le framework",
    expD: "dump_bad_rows n'est pas un paramètre supporté",
    url: "https://docs.getdbt.com/reference/resource-configs/store_failures",
    diff: "facile"
  },
  {
    topic: "tests",
    statement: "Quelle est la différence fondamentale entre les deux niveaux de sévérité d'un test dbt (warn et error) lorsqu'on utilise la commande dbt build ?",
    options: [
      "A) Le niveau warn affiche un message d'alerte et poursuit le build des modèles en aval, tandis que error interrompt immédiatement la chaîne dépendante",
      "B) Le niveau warn supprime les lignes fautives alors que error bloque l'accès à la base",
      "C) Le niveau warn est réservé aux seeds et error aux modèles SQL",
      "D) Le niveau warn envoie un email alors que error crée un ticket Jira"
    ],
    ans: "A",
    expA: "avec warn, le pipeline continue ; avec error, le test échoue et tous les modèles descendants dans le DAG sont automatiquement mis en statut skipped",
    expB: "dbt ne supprime jamais de données dans les tables testées",
    expC: "les deux niveaux de sévérité peuvent être configurés sur n'importe quelle ressource testée",
    expD: "les notifications email ou Jira relèvent de l'orchestrateur externe et non du comportement interne de la commande dbt build",
    url: "https://docs.getdbt.com/reference/resource-configs/severity",
    diff: "moyen"
  },
  {
    topic: "tests",
    statement: "Où doivent être enregistrés les tests singuliers (singular tests) composés de requêtes SQL personnalisées dans le projet ?",
    options: [
      "A) Dans le dossier tests/",
      "B) Dans le dossier models/tests/",
      "C) Dans le dossier macros/tests/",
      "D) Dans le fichier schema.yml sous la clé custom_queries:"
    ],
    ans: "A",
    expA: "les requêtes SQL de tests singuliers autonomes sont placées par défaut directement dans le répertoire tests/ à la racine du projet",
    expB: "models/ est réservé aux modèles de transformation et de staging",
    expC: "macros/ contient du code Jinja de modèles et macros réutilisables, pas des fichiers de tests singuliers",
    expD: "schema.yml héberge les tests génériques déclaratifs et non des requêtes SQL libres entières",
    url: "https://docs.getdbt.com/docs/build/data-tests#singular-data-tests",
    diff: "facile"
  },
  {
    topic: "tests",
    statement: "Pour vérifier qu'une clé étrangère client_id dans la table fct_orders pointe bien vers un identifiant valide existant dans la table dim_clients, quel test générique doit-on configurer ?",
    options: [
      "A) relationships avec l'argument to: ref('dim_clients') et field: client_id",
      "B) unique avec l'argument scope: dim_clients",
      "C) accepted_values avec une sous-requête SQL",
      "D) foreign_key_test dans dbt_project.yml"
    ],
    ans: "A",
    expA: "le test générique relationships valide l'intégrité référentielle entre deux relations en vérifiant que chaque valeur de la colonne existe dans le modèle et champ désignés",
    expB: "le test unique vérifie l'absence de doublons dans la colonne du modèle courant et ne fait pas de comparaison inter-tables",
    expC: "accepted_values prend une liste statique de valeurs admises et non une table distante dynamique",
    expD: "foreign_key_test n'est pas le nom du test générique dbt",
    url: "https://docs.getdbt.com/docs/build/data-tests#relationships",
    diff: "facile"
  },
  {
    topic: "tests",
    statement: "Quelle configuration permet à un test générique dbt d'autoriser jusqu'à 5 anomalies avant de déclencher un statut d'erreur bloquant ?",
    options: [
      "A) config: severity: error, error_if: \"> 5\"",
      "B) config: tolerance: 5",
      "C) config: max_allowed_failures: 5",
      "D) config: ignore_count: 5"
    ],
    ans: "A",
    expA: "les paramètres warn_if et error_if permettent de spécifier une expression conditionnelle (ex: \"> 5\") pour définir un seuil de tolérance avant l'échec",
    expB: "tolerance n'est pas un paramètre supporté par dbt pour la sévérité",
    expC: "max_allowed_failures n'est pas la clé officielle",
    expD: "ignore_count n'existe pas dans la syntaxe de configuration des tests",
    url: "https://docs.getdbt.com/reference/resource-configs/severity#custom-rules",
    diff: "difficile"
  },

  // tests-unitaires (q083 to q088)
  {
    topic: "tests-unitaires",
    statement: "Quelle est la principale différence entre un test de données classique (data test) et un test unitaire (unit test) introduit dans dbt Core 1.8+ ?",
    options: [
      "A) Le test de données valide les données réelles déjà chargées dans l'entrepôt, tandis que le test unitaire valide la logique interne de la requête SQL du modèle à l'aide de données d'entrée simulées (mocks) sans dépendre des vraies tables",
      "B) Le test unitaire est écrit en Python alors que le test de données est en SQL",
      "C) Le test de données s'exécute en local alors que le test unitaire tourne sur Snowflake",
      "D) Le test unitaire est payant et réservé à dbt Cloud Enterprise"
    ],
    ans: "A",
    expA: "les tests unitaires dbt permettent de tester la pure logique algorithmique (formules de calcul, CASE WHEN, regex) sur un jeu de données mocké en YAML, isolant le test des variations des sources de production",
    expB: "les tests unitaires sont déclarés en YAML avec des données de test pouvant être en SQL, CSV ou dictionnaires YAML",
    expC: "les deux types de tests exécutent du SQL sur l'entrepôt de données configuré",
    expD: "les tests unitaires font partie intégrante de dbt Core open source depuis la version 1.8",
    url: "https://docs.getdbt.com/docs/build/unit-tests",
    diff: "moyen"
  },
  {
    topic: "tests-unitaires",
    statement: "Dans quel fichier et sous quelle clé déclare-t-on généralement les tests unitaires pour un modèle dbt ?",
    options: [
      "A) Dans un fichier YAML du dossier models/ sous la clé unit_tests:",
      "B) Dans le dossier tests/unit/ dans des fichiers .sql",
      "C) Dans le fichier dbt_project.yml sous la clé unit_testing:",
      "D) Dans target/manifest.json sous la clé mocks:"
    ],
    ans: "A",
    expA: "les tests unitaires sont définis dans les fichiers YAML du dossier models/ (ou dbt_project) sous la clé de premier niveau unit_tests:",
    expB: "les tests unitaires ne sont pas de simples fichiers SQL isolés dans tests/unit/",
    expC: "dbt_project.yml ne contient pas les scénarios de tests unitaires individuels",
    expD: "manifest.json est un fichier généré automatiquement et non un lieu de configuration",
    url: "https://docs.getdbt.com/docs/build/unit-tests#defining-unit-tests",
    diff: "facile"
  },
  {
    topic: "tests-unitaires",
    statement: "Quels sont les deux blocs obligatoires que doit contenir la définition de chaque test unitaire dans un fichier YAML dbt ?",
    options: [
      "A) given: (définition des entrées mockées) et expect: (résultat attendu)",
      "B) input_data: et output_data:",
      "C) before: et after:",
      "D) fixture: et assert:"
    ],
    ans: "A",
    expA: "la syntaxe officielle d'un test unitaire dbt utilise le bloc given: pour simuler les lignes des modèles ou sources en amont et expect: pour définir la sortie attendue",
    expB: "input_data et output_data ne sont pas les mots-clés de la spécification YAML dbt",
    expC: "before et after ne correspondent pas à la syntaxe déclarative de test unitaire",
    expD: "fixture et assert sont des termes de frameworks Python (comme pytest) et non de dbt YAML",
    url: "https://docs.getdbt.com/docs/build/unit-tests#given-and-expect",
    diff: "facile"
  },
  {
    topic: "tests-unitaires",
    statement: "Quelle commande permet d'exécuter uniquement les tests unitaires du projet en ignorant les tests de données classiques ?",
    options: [
      "A) dbt test --select test_type:unit",
      "B) dbt unit-test",
      "C) dbt test --unit-only",
      "D) dbt run --tests-unit"
    ],
    ans: "A",
    expA: "le sélecteur test_type:unit permet de filtrer spécifiquement les tests unitaires lors de la commande dbt test",
    expB: "la commande dbt unit-test n'existe pas en tant que sous-commande principale de la CLI",
    expC: "--unit-only n'est pas un flag reconnu par la CLI dbt",
    expD: "dbt run ne prend pas de paramètre --tests-unit pour exécuter des tests",
    url: "https://docs.getdbt.com/docs/build/unit-tests#running-unit-tests",
    diff: "moyen"
  },
  {
    topic: "tests-unitaires",
    statement: "Lorsqu'un test unitaire est exécuté, comment dbt injecte-t-il les données simulées (mocks) définies dans le bloc given: ?",
    options: [
      "A) dbt remplace les macros ref() et source() par des clauses SELECT constantes ou UNION ALL simulant les lignes d'entrée en mémoire temporaire",
      "B) dbt insère physiquement les lignes de test dans les tables réelles de production",
      "C) dbt télécharge les données de test dans un bucket S3",
      "D) dbt crée un serveur PostgreSQL local virtuel"
    ],
    ans: "A",
    expA: "dbt compile la requête en substituant chaque référence de table par une sous-requête de valeurs en dur (mock), isolant totalement le test de l'état réel de la base",
    expB: "dbt ne touche jamais aux tables de données réelles pour y insérer des fausses lignes",
    expC: "aucun stockage cloud S3 n'est requis pour les tests unitaires",
    expD: "le test unitaire s'exécute sur le dialecte de l'entrepôt configuré sans déployer de serveur local PostgreSQL",
    url: "https://docs.getdbt.com/docs/build/unit-tests",
    diff: "difficile"
  },
  {
    topic: "tests-unitaires",
    statement: "Quel est le bénéfice majeur des tests unitaires par rapport aux tests de données dans une approche de développement piloté par les tests (TDD) avec dbt ?",
    options: [
      "A) Ils permettent de valider des cas limites rares (edge cases) avant même que les données réelles n'existent dans l'entrepôt de données",
      "B) Ils accélèrent de 10 fois le dbt run en production",
      "C) Ils dispensent de configurer un fichier profiles.yml",
      "D) Ils génèrent automatiquement le code SQL de la transformation"
    ],
    ans: "A",
    expA: "en permettant de simuler n'importe quelle combinaison de valeurs en amont, les tests unitaires garantissent que le code SQL réagira correctement face à des cas complexes ou inhabituels",
    expB: "les tests unitaires valident le code et ne modifient pas la vitesse intrinsèque du moteur SQL de production",
    expC: "la connexion à l'entrepôt configuré dans profiles.yml reste nécessaire pour exécuter la requête unitaire",
    expD: "le développeur doit toujours écrire le code SQL ; dbt ne génère pas de SQL magiquement sans instruction",
    url: "https://docs.getdbt.com/docs/build/unit-tests",
    diff: "moyen"
  },

  // contrats-contraintes (q089 to q094)
  {
    topic: "contrats-contraintes",
    statement: "Pour activer un contrat de schéma formel sur un modèle dbt garantissant les noms et les types de colonnes lors de la compilation, quelle directive YAML doit être configurée ?",
    options: [
      "A) config: contract: enforced: true",
      "B) schema_validation: strict",
      "C) constraints: verify_all",
      "D) dbt_contract: active"
    ],
    ans: "A",
    expA: "la directive contract: enforced: true active le contrat de modèle strict, exigeant que toutes les colonnes produites correspondent rigoureusement aux types et contraintes définis dans le YAML",
    expB: "schema_validation n'est pas un paramètre reconnu de dbt",
    expC: "constraints: verify_all n'est pas la syntaxe pour activer le contrat",
    expD: "dbt_contract n'existe pas dans le schéma YAML",
    url: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts",
    diff: "facile"
  },
  {
    topic: "contrats-contraintes",
    statement: "Que se passe-t-il lors de la compilation ou de l'exécution d'un modèle dbt si contract: enforced: true est activé mais qu'une colonne renvoyée par le SELECT n'a pas été déclarée dans le fichier YAML ?",
    options: [
      "A) dbt lève une erreur de compilation bloquante indiquant une violation de contrat",
      "B) dbt supprime silencieusement la colonne non déclarée de la table finale",
      "C) dbt renomme automatiquement la colonne avec le préfixe uncontracted_",
      "D) dbt ignore l'erreur et affiche un simple avertissement vert"
    ],
    ans: "A",
    expA: "un contrat appliqué est strict : chaque colonne produite par le SQL doit être déclarée avec son type de données dans le YAML sous peine de faire échouer immédiatement la compilation",
    expB: "dbt ne tronque ni ne filtre silencieusement des colonnes SQL à la volée",
    expC: "dbt ne modifie pas les noms de colonnes du SELECT",
    expD: "un contrat enforced provoque une erreur bloquante et non un simple avertissement",
    url: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts#breaking-changes",
    diff: "moyen"
  },
  {
    topic: "contrats-contraintes",
    statement: "Quelles contraintes physiques (constraints) peuvent être appliquées au niveau des colonnes d'un modèle dbt lorsque la base de données cible le supporte ?",
    options: [
      "A) not_null, primary_key, foreign_key, unique, check",
      "B) only_positive, must_match, accepted_set",
      "C) index_cluster, btree_dense, hash_bucket",
      "D) partition_by, cluster_by, sort_key"
    ],
    ans: "A",
    expA: "dbt supporte les contraintes DDL standards de base de données : not_null, primary_key, foreign_key, unique et check",
    expB: "ces termes ne correspondent pas aux noms de contraintes DDL standards",
    expC: "index_cluster et hash_bucket sont des caractéristiques d'indexation physique et non des contraintes d'intégrité",
    expD: "partition_by et cluster_by sont des configurations d'optimisation de table et non des contraintes de schéma",
    url: "https://docs.getdbt.com/reference/resource-properties/constraints",
    diff: "moyen"
  },
  {
    topic: "contrats-contraintes",
    statement: "Pourquoi est-il particulièrement recommandé d'imposer des contrats de modèles (model contracts) sur les modèles partagés entre plusieurs projets dans une architecture dbt Mesh ?",
    options: [
      "A) Pour garantir aux équipes consommatrices que la structure (noms et types de colonnes) ne changera pas de manière inattendue lors des prochaines mises en production",
      "B) Pour réduire automatiquement la facture de stockage de 50 %",
      "C) Pour empêcher les autres équipes de lire la documentation du modèle",
      "D) Pour forcer l'entrepôt à chiffrer les données avec une clé KMS personnalisée"
    ],
    ans: "A",
    expA: "le contrat de modèle agit comme une garantie d'interface d'API publique entre les producteurs et consommateurs de données, évitant les ruptures silencieuses de pipelines en aval",
    expB: "les contrats de modèles valident la conformité des schémas et n'ont pas d'incidence directe sur la compression du stockage",
    expC: "les contrats n'ont aucun rapport avec la visibilité de la documentation",
    expD: "le chiffrement KMS est géré au niveau de la plateforme cloud et non par les contrats de modèles dbt",
    url: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts",
    diff: "facile"
  },
  {
    topic: "contrats-contraintes",
    statement: "Dans la définition d'une colonne sous un modèle ayant un contrat actif, quel attribut est obligatoirement requis pour chaque colonne en plus de son nom ?",
    options: [
      "A) data_type",
      "B) description",
      "C) test",
      "D) format"
    ],
    ans: "A",
    expA: "l'attribut data_type spécifiant le type SQL exact de la colonne (ex: text, integer, date) est obligatoire pour valider la conformité du contrat",
    expB: "la description est une bonne pratique de documentation mais n'est pas syntaxiquement obligatoire pour l'application du contrat",
    expC: "les tests sont optionnels",
    expD: "format n'est pas la clé officielle de spécification de type dans dbt",
    url: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts#specifying-data_type",
    diff: "facile"
  },
  {
    topic: "contrats-contraintes",
    statement: "Sur Snowflake, que fait dbt lorsqu'une contrainte not_null est définie sous contract: enforced: true ?",
    options: [
      "A) dbt ajoute la contrainte NOT NULL dans l'instruction DDL CREATE TABLE",
      "B) dbt exécute un test de données générique séparé après la création de la table",
      "C) dbt remplace les valeurs NULL par des zéros en mémoire",
      "D) dbt refuse de créer la table et bascule en vue"
    ],
    ans: "A",
    expA: "les contraintes de contrat sont intégrées directement dans l'instruction DDL de création de table générée pour Snowflake",
    expB: "les tests génériques séparés correspondent à dbt test et non à l'application directe des contraintes DDL de contrat",
    expC: "dbt ne modifie pas les valeurs des colonnes pour masquer les valeurs nulles",
    expD: "dbt ne modifie pas la matérialisation d'une table en vue pour contourner une contrainte",
    url: "https://docs.getdbt.com/reference/resource-properties/constraints#snowflake",
    diff: "moyen"
  },

  // documentation & exposures & acces-modeles (q095 to q105)
  {
    topic: "documentation",
    statement: "Quelles deux commandes CLI dbt sont respectivement utilisées pour générer le site web de documentation statique du projet et pour démarrer le serveur web local de visualisation ?",
    options: [
      "A) dbt docs generate puis dbt docs serve",
      "B) dbt docs build puis dbt docs view",
      "C) dbt compile --docs puis dbt start web",
      "D) dbt documentation create puis dbt documentation run"
    ],
    ans: "A",
    expA: "dbt docs generate extrait les métadonnées et produit catalog.json et manifest.json, puis dbt docs serve démarre un serveur local sur le port 8080 pour naviguer dans le catalogue",
    expB: "dbt docs build et dbt docs view ne sont pas les syntaxes officielles de la CLI",
    expC: "dbt compile --docs n'est pas un flag valide",
    expD: "la sous-commande est docs et non documentation",
    url: "https://docs.getdbt.com/reference/commands/cmd-docs",
    diff: "facile"
  },
  {
    topic: "documentation",
    statement: "Comment déclarer un bloc de documentation textuel enrichi en Markdown réutilisable sur plusieurs colonnes et modèles ?",
    options: [
      "A) Dans un fichier .md avec les balises {% docs nom_bloc %} ... {% enddocs %}",
      "B) Dans dbt_project.yml avec la balise <markdown_doc>",
      "C) Dans un fichier textuel .txt sous macros/",
      "D) Dans un commentaire SQL /* doc: nom_bloc */"
    ],
    ans: "A",
    expA: "les blocs de documentation dbt sont écrits dans des fichiers .md en utilisant les balises Jinja {% docs nom_bloc %} et {% enddocs %}",
    expB: "<markdown_doc> n'est pas une balise YAML valide dans dbt",
    expC: "les fichiers .txt ne sont pas interprétés par le parseur de documentation dbt",
    expD: "les commentaires SQL standards ne créent pas de blocs de documentation réutilisables dans le catalogue",
    url: "https://docs.getdbt.com/docs/collaborate/documentation#using-docs-blocks",
    diff: "facile"
  },
  {
    topic: "documentation",
    statement: "Quelle fonction Jinja permet de faire référence à un bloc de documentation déclaré pour l'injecter dans la description d'une colonne dans un fichier schema.yml ?",
    options: [
      "A) '{{ doc(\"nom_bloc\") }}'",
      "B) '{{ get_doc(\"nom_bloc\") }}'",
      "C) '{{ ref_doc(\"nom_bloc\") }}'",
      "D) '{{ import_docs(\"nom_bloc\") }}'"
    ],
    ans: "A",
    expA: "la fonction doc('nom_bloc') injecte le texte Markdown du bloc déclaré dans le champ description de la ressource",
    expB: "get_doc n'est pas la syntaxe Jinja de dbt",
    expC: "ref_doc n'existe pas dans le framework",
    expD: "import_docs n'est pas une fonction native dbt",
    url: "https://docs.getdbt.com/docs/collaborate/documentation#using-docs-blocks",
    diff: "facile"
  },
  {
    topic: "exposures",
    statement: "À quoi servent principalement les objets 'exposures' dans un projet dbt ?",
    options: [
      "A) À documenter et visualiser dans le DAG les ressources consommatrices en aval (tableaux de bord Tableau/PowerBI, métriques ou modèles ML)",
      "B) À exposer des tables de données sensibles sur Internet sans mot de passe",
      "C) À planifier l'exécution horaire de dbt run via une API REST",
      "D) À tester la vulnérabilité réseau de l'entrepôt Snowflake"
    ],
    ans: "A",
    expA: "les exposures définissent les dépendances vers des outils externes en aval (dashboards, notebooks, exports), permettant d'analyser l'impact d'un changement de modèle sur les consommateurs finaux",
    expB: "les exposures n'ont aucun lien avec l'exposition réseau publique de données",
    expC: "l'orchestration planifiée relève de dbt Cloud ou d'Airflow et non des exposures",
    expD: "les exposures ne réalisent pas d'audit de sécurité ou de test de pénétration",
    url: "https://docs.getdbt.com/docs/build/exposures",
    diff: "facile"
  },
  {
    topic: "exposures",
    statement: "Quels types d'expositions (exposure type) sont officiellement supportés dans la déclaration d'une exposure YAML ?",
    options: [
      "A) dashboard, notebook, analysis, ml, application",
      "B) table, view, ephemeral, seed",
      "C) production, staging, development, sandbox",
      "D) raw, staging, intermediate, marts"
    ],
    ans: "A",
    expA: "les types officiels d'exposures sont dashboard, notebook, analysis, ml et application",
    expB: "table, view, ephemeral et seed sont des types de matérialisations de modèles et non des types d'expositions",
    expC: "production, staging, dev sont des cibles d'environnements",
    expD: "raw, staging, intermediate, marts sont des couches architecturales de modélisation",
    url: "https://docs.getdbt.com/docs/build/exposures#creating-an-exposure",
    diff: "moyen"
  },
  {
    topic: "exposures",
    statement: "Comment sélectionner pour exécution tous les modèles dbt dont dépend directement ou indirectement le tableau de bord d'exposition nommé 'kpi_ventes_hebdo' ?",
    options: [
      "A) dbt run --select +exposure:kpi_ventes_hebdo",
      "B) dbt run --select exposure:kpi_ventes_hebdo+",
      "C) dbt run --exposure kpi_ventes_hebdo",
      "D) dbt build --select @kpi_ventes_hebdo"
    ],
    ans: "A",
    expA: "le signe + placé devant exposure: (+exposure:nom) remonte le graphe de dépendances pour sélectionner tous les modèles parents nécessaires pour alimenter ce tableau de bord",
    expB: "mettre le + après l'exposition tenterait de sélectionner les descendants en aval d'une ressource qui est déjà en fin de chaîne",
    expC: "--exposure n'est pas un flag CLI de dbt run",
    expD: "@kpi_ventes_hebdo sans préfixe exposure: ne résoudrait pas l'exposition nommée",
    url: "https://docs.getdbt.com/reference/node-selection/syntax#exposures",
    diff: "moyen"
  },
  {
    topic: "acces-modeles",
    statement: "Quel est le niveau de visibilité (access) par défaut attribué à un modèle dbt si aucune propriété access n'est explicitement spécifiée dans le fichier YAML ?",
    options: [
      "A) protected",
      "B) private",
      "C) public",
      "D) internal"
    ],
    ans: "A",
    expA: "dans dbt, le niveau d'accès par défaut est protected, ce qui signifie que le modèle est accessible à tous les autres modèles du même projet ou package, mais masqué aux projets externes",
    expB: "private restreint l'accès aux seuls modèles appartenant au même group et n'est pas le comportement par défaut",
    expC: "public expose le modèle aux projets tiers (dbt Mesh) et doit être explicitement activé avec un contrat",
    expD: "internal n'est pas un mot-clé de niveau d'accès dans dbt",
    url: "https://docs.getdbt.com/docs/collaborate/govern/model-access",
    diff: "facile"
  },
  {
    topic: "acces-modeles",
    statement: "Que se passe-t-il si un modèle fct_marketing tente de faire ref('int_finance') alors que le modèle int_finance a été configuré avec access: private et appartient au groupe finance (alors que fct_marketing n'appartient pas à ce groupe) ?",
    options: [
      "A) La commande dbt compile échoue avec une erreur de violation d'accès (dbt access violation)",
      "B) dbt autorise l'accès mais affiche un simple message d'information",
      "C) Snowflake bloque la requête avec une erreur de droits RBAC",
      "D) Le modèle int_finance est automatiquement converti en table publique temporaire"
    ],
    ans: "A",
    expA: "dbt valide les règles de gouvernance d'accès au moment de la compilation et rejette fermement tout appel ref() vers un modèle privé issu d'un groupe différent",
    expB: "dbt ne se contente pas d'un avertissement ; il s'agit d'une erreur bloquante",
    expC: "l'erreur est interceptée par dbt dès la phase de compilation locale avant toute communication avec Snowflake",
    expD: "dbt ne modifie jamais les droits d'accès pour masquer une violation de gouvernance",
    url: "https://docs.getdbt.com/docs/collaborate/govern/model-access#access-levels",
    diff: "moyen"
  },
  {
    topic: "acces-modeles",
    statement: "Dans une architecture multi-projets (dbt Mesh), quel niveau d'accès doit être obligatoirement attribué à un modèle pour qu'il puisse être appelé via ref() par un autre projet dbt distinct ?",
    options: [
      "A) public",
      "B) protected",
      "C) private",
      "D) global"
    ],
    ans: "A",
    expA: "seuls les modèles déclarés avec access: public peuvent être importés et référencés par des projets dbt externes via le mécanisme Cross-Project ref",
    expB: "protected restreint l'usage au projet courant",
    expC: "private restreint l'usage au groupe interne du modèle",
    expD: "global n'est pas une valeur valide de la propriété access",
    url: "https://docs.getdbt.com/docs/collaborate/govern/model-access#public-access",
    diff: "facile"
  },
  {
    topic: "acces-modeles",
    statement: "Quel objet YAML permet d'associer un ensemble de modèles à une équipe propriétaire responsable au sein d'une organisation dbt ?",
    options: [
      "A) group (groups:)",
      "B) team (teams:)",
      "C) squad (squads:)",
      "D) department (departments:)"
    ],
    ans: "A",
    expA: "l'entité groups: permet de définir des équipes métier avec leur propriétaire (nom, email) et d'y rattacher des modèles dbt pour délimiter les frontières d'accès privé",
    expB: "teams n'est pas le mot-clé de spécification YAML de dbt",
    expC: "squads n'est pas reconnu par le framework dbt",
    expD: "departments n'est pas supporté",
    url: "https://docs.getdbt.com/docs/collaborate/govern/groups",
    diff: "facile"
  },
  {
    topic: "acces-modeles",
    statement: "Quelle condition technique stricte dbt impose-t-il généralement sur un modèle marqué access: public avant de permettre son exposition inter-projets ?",
    options: [
      "A) Il doit comporter un contrat de schéma formellement appliqué (contract: enforced: true)",
      "B) Il doit être écrit obligatoirement en Python",
      "C) Il doit être matérialisé en ephemeral",
      "D) Il ne doit contenir aucun test unitaire"
    ],
    ans: "A",
    expA: "pour garantir la stabilité des contrats de données entre équipes autonomes, un modèle public doit avoir ses colonnes et types garantis par un contrat strict",
    expB: "les modèles publics peuvent être écrits en SQL ou en Python",
    expC: "les modèles éphémères ne peuvent pas être exposés publiquement à des projets externes car ils n'existent pas physiquement",
    expD: "la présence de tests unitaires est au contraire hautement recommandée pour sécuriser le modèle public",
    url: "https://docs.getdbt.com/docs/collaborate/govern/model-access#model-contracts",
    diff: "moyen"
  }
];

console.log(`Generating ${qData.length} questions for Section 3...`);
const questionsS3 = qData.map((q, idx) => {
  const idNum = idx + 76; // dbt-q076 to dbt-q105
  return makeQDomain(
    DOMAIN_S3,
    idNum,
    q.topic,
    q.statement,
    q.options,
    q.ans,
    q.expA,
    q.expB,
    q.expC,
    q.expD,
    q.url,
    'dbt',
    q.diff,
    120
  );
});

const outPath = path.join(process.cwd(), 'scripts', 'dbt_questions_s3.js');
const fileContent = `// Banque de questions officielles et originales pour dbt Section 3 (30 questions)
// Générée et validée le 2026-10-31
export const dbtQuestionsS3 = ${JSON.stringify(questionsS3, null, 2)};
`;
fs.writeFileSync(outPath, cleanEmDashes(fileContent), 'utf-8');
console.log(`Saved ${questionsS3.length} questions to ${outPath}`);
