// Banque de questions officielles et originales pour dbt Section 1 (45 questions)
// Générée et validée le 2026-10-31
export const dbtQuestionsS1 = [
  {
    "id": "dbt-q001",
    "statement": "Un ingénieur analytique conçoit un modèle dbt intermédiaire lourd réalisant des calculs d'agrégation complexes consommés par plusieurs rapports métier. Quel type de matérialisation doit-il privilégier pour offrir les meilleures performances de lecture aux utilisateurs finaux ?",
    "type": "single",
    "options": [
      "A) Matérialisation table",
      "B) Matérialisation view",
      "C) Matérialisation ephemeral",
      "D) Matérialisation seed"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la matérialisation table stocke physiquement les résultats précalculés dans l'entrepôt, garantissant des temps de réponse rapides pour les consommateurs BI. L'option B est fausse car la matérialisation view réexécute l'intégralité du calcul à chaque consultation, provoquant des lenteurs inacceptables sur les modèles complexes. L'option C est fausse car la matérialisation ephemeral ne crée aucun objet persistant et injecte une CTE dans chaque requête dépendante, alourdissant chaque appel. L'option D est fausse car les seeds dbt sont conçus pour charger de petits fichiers CSV statiques de référence et ne peuvent pas exécuter de requêtes de transformation SQL.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "modeles-materialisations",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/materializations",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q002",
    "statement": "Dans un projet dbt, une équipe souhaite définir une logique de nettoyage légère partagée uniquement entre deux modèles de staging sans créer d'objet persistant dans l'entrepôt de données. Quelle matérialisation est spécifiquement conçue pour ce cas d'usage ?",
    "type": "single",
    "options": [
      "A) Ephemeral",
      "B) Incremental",
      "C) Table",
      "D) Snapshot"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la matérialisation ephemeral interpole directement le code SQL sous forme d'expression de table commune (CTE) sans créer de table ni de vue dans la base. L'option B est fausse car la matérialisation incremental crée et maintient une table physique persistante avec des insertions ou fusions progressives. L'option C est fausse car la matérialisation table crée une table physique persistante dans l'entrepôt de données. L'option D est fausse car les snapshots créent des tables physiques de type SCD Type 2 pour historiser les changements d'état au cours du temps.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "modeles-materialisations",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/materializations#ephemeral",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q003",
    "statement": "Un développeur souhaite exécuter directement la commande dbt run sur un modèle spécifique configuré avec materialized='ephemeral'. Quel sera le comportement de dbt lors de l'exécution de cette commande ?",
    "type": "single",
    "options": [
      "A) dbt n'exécute aucune requête DDL et ignore le modèle car un modèle éphémère ne produit aucun objet en base",
      "B) dbt convertit automatiquement le modèle en vue standard dans le schéma par défaut",
      "C) dbt crée une table temporaire supprimée à la fin de la session de terminal",
      "D) dbt lève une exception de syntaxe fatale interrompant tout le projet"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les modèles éphémères n'ont aucune existence physique dans l'entrepôt et ne peuvent donc pas être exécutés isolément via dbt run. L'option B est fausse car dbt ne modifie jamais implicitement la matérialisation configurée sans directive explicite. L'option C est fausse car dbt ne gère pas de tables temporaires de session utilisateur via les modèles éphémères. L'option D est fausse car dbt affiche simplement un avertissement ou informe qu'aucun nœud n'a été matérialisé sans planter le projet.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "modeles-materialisations",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/materializations#ephemeral",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q004",
    "statement": "Une équipe data configure la matérialisation par défaut sur view dans dbt_project.yml pour tout le dossier models/marts. Cependant, le fichier models/marts/fct_orders.sql contient {{ config(materialized='table') }}. Quelle matérialisation sera appliquée pour fct_orders ?",
    "type": "single",
    "options": [
      "A) Table, car la configuration définie dans le modèle individuel a la priorité sur dbt_project.yml",
      "B) View, car le fichier dbt_project.yml est prioritaire sur les fichiers SQL",
      "C) Une erreur de conflit de configuration empêchera la compilation du modèle",
      "D) Ephemeral, qui est la matérialisation de secours en cas de divergence"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dans la hiérarchie de configuration de dbt, le bloc config() placé au sein du modèle SQL l'emporte toujours sur les règles générales de dbt_project.yml. L'option B est fausse car dbt_project.yml définit des valeurs par défaut qui sont systématiquement surchargées par les fichiers de modèles locaux. L'option C est fausse car la hiérarchie dbt est conçue précisément pour résoudre ce type d'héritage sans générer de conflit ni d'erreur. L'option D est fausse car ephemeral n'est jamais sélectionné comme solution de repli implicite.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "modeles-materialisations",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/model-configs",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q005",
    "statement": "Pour réduire les coûts de stockage dans Snowflake tout en garantissant des données systématiquement à jour pour des requêtes très ponctuelles, quelle matérialisation dbt convient le mieux ?",
    "type": "single",
    "options": [
      "A) View",
      "B) Table",
      "C) Incremental",
      "D) Snapshot"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car une vue ne stocke aucune donnée sur disque, éliminant tout coût de stockage Snowflake et garantissant une fraîcheur immédiate à la lecture. L'option B est fausse car une table consomme de l'espace de stockage Snowflake et engendre des coûts de calcul réguliers lors de chaque dbt run. L'option C est fausse car la matérialisation incrémentale persiste des données physiques et génère des coûts de stockage continu. L'option D est fausse car un snapshot conserve l'historique complet des versions de lignes, augmentant significativement le volume de stockage.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "modeles-materialisations",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/materializations#view",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q006",
    "statement": "Quelle instruction DDL sous-jacente dbt exécute-t-il typiquement sur un entrepôt de données pour construire un modèle matérialisé en table lors d'un dbt run complet ?",
    "type": "single",
    "options": [
      "A) CREATE TABLE ... AS SELECT (ou CREATE OR REPLACE TABLE)",
      "B) INSERT INTO ... VALUES",
      "C) ALTER TABLE ... ADD CONSTRAINT",
      "D) MERGE INTO avec clause ON 1=0"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt transforme le SELECT du modèle en instruction CREATE OR REPLACE TABLE ou CREATE TABLE AS SELECT selon l'adaptateur. L'option B est fausse car INSERT INTO VALUES est utilisé pour injecter des valeurs statiques et non pour transformer des requêtes relationnelles. L'option C est fausse car ALTER TABLE ADD CONSTRAINT concerne l'application de contraintes relationnelles et non la création de la table. L'option D est fausse car le MERGE INTO est propre aux modèles incrémentaux et non à la création standard d'une table.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "modeles-materialisations",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/materializations#table",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q007",
    "statement": "Un modèle dbt référence un autre modèle via {{ ref('modele_ephemeral') }}. Lors de l'inspection du code compilé dans target/compiled/, comment apparaît le modèle éphémère ?",
    "type": "single",
    "options": [
      "A) Sous la forme d'une clause WITH (CTE) intégrée en début de requête SQL",
      "B) Sous la forme d'un nom de table temporaire dans la base de données",
      "C) Sous la forme d'un appel de procédure stockée distante",
      "D) Sous la forme d'une sous-requête corrélée dans la clause WHERE"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt compile les modèles éphémères en injectant leur code sous forme d'expressions de table commune (CTE WITH ... AS) dans la requête finale. L'option B est fausse car aucun objet temporaire n'est créé dans la base de données pour un modèle éphémère. L'option C est fausse car les modèles éphémères sont de pures expressions SQL et ne font aucunement appel à des procédures stockées. L'option D est fausse car dbt factorise le code en tête de requête dans le bloc WITH et non sous forme de sous-requête corrélée dans le WHERE.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "modeles-materialisations",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/materializations#ephemeral",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q008",
    "statement": "Dans quel cas précis l'utilisation d'une matérialisation view pose-t-elle un problème critique en production ?",
    "type": "single",
    "options": [
      "A) Lorsque la vue empile de multiples jointures et agrégations complexes et qu'elle est interrogée massivement par un tableau de bord",
      "B) Lorsque les données sources sont mises à jour plus d'une fois par semaine",
      "C) Lorsque le schéma de destination contient plus de 10 tables",
      "D) Lorsque le modèle utilise la fonction ref() vers un modèle de staging"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car si une vue très complexe est interrogée par des dizaines d'utilisateurs simultanés, chaque requête recalcule l'intégralité du traitement, entraînant des temps d'attente prohibitifs et une forte consommation de compute. L'option B est fausse car une fréquence de mise à jour élevée est au contraire un avantage pour une vue qui présente instantanément les dernières données. L'option C est fausse car le nombre de tables dans le schéma n'a aucun impact technique sur les performances d'une vue individuelle. L'option D est fausse car utiliser ref() vers un modèle de staging est la bonne pratique standard recommandée par dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "modeles-materialisations",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/materializations#view",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q009",
    "statement": "Quelle macro Jinja doit être impérativement utilisée pour référencer une table brute déclarée dans un fichier sources.yml afin de préserver le graphe de dépendances dbt ?",
    "type": "single",
    "options": [
      "A) {{ source('nom_source', 'nom_table') }}",
      "B) {{ ref('nom_source', 'nom_table') }}",
      "C) {{ table('nom_source.nom_table') }}",
      "D) {{ raw_source('nom_table') }}"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la macro source() prend en argument le nom du bloc source et le nom de la table, créant le lien amont dans le DAG. L'option B est fausse car la macro ref() ne prend qu'un argument de nom de modèle dbt (ou optionnellement une version) et ne référence pas les sources externes. L'option C est fausse car la macro table() n'existe pas dans le framework natif dbt. L'option D est fausse car la macro raw_source() n'est pas une fonction native dbt valide.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "sources-fraicheur",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/sources",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q010",
    "statement": "Une équipe data souhaite être alertée si les données de la table de clics n'ont pas été alimentées depuis plus de 6 heures par le pipeline d'ingestion. Quelle propriété doit être configurée dans le fichier YAML de source ?",
    "type": "single",
    "options": [
      "A) freshness avec les paramètres warn_after et loaded_at_field",
      "B) tests avec la règle not_null sur l'horodatage",
      "C) snapshot avec stratégie check",
      "D) config avec max_staleness='6 hours'"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le bloc freshness permet de définir loaded_at_field ainsi que les seuils temporels warn_after et error_after évalués par dbt source freshness. L'option B est fausse car un test not_null vérifie seulement l'absence de valeurs nulles dans une colonne sans comparer l'horodatage avec l'heure courante. L'option C est fausse car un snapshot historise les modifications de lignes et ne calcule pas de retard de chargement SLA. L'option D est fausse car le paramètre max_staleness n'est pas une propriété de configuration standard de source dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "sources-fraicheur",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/sources#source-freshness",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q011",
    "statement": "Quelle commande en ligne dbt permet de vérifier si les tables brutes respectent les SLA de fraîcheur déclarés dans les fichiers YAML sans exécuter les modèles SQL ?",
    "type": "single",
    "options": [
      "A) dbt source freshness",
      "B) dbt test --select source:*",
      "C) dbt check sources",
      "D) dbt freshness run"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt source freshness est la commande dédiée qui compare le champ loaded_at_field avec l'horloge système de l'entrepôt pour chaque source configurée. L'option B est fausse car dbt test valide les contraintes de données (not_null, unique, etc.) mais n'évalue pas les seuils de fraîcheur temporelle. L'option C est fausse car la commande dbt check sources n'existe pas dans la CLI dbt. L'option D est fausse car la commande dbt freshness run n'existe pas dans la CLI dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "sources-fraicheur",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/source",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q012",
    "statement": "Quel objet dbt convient le mieux pour importer un petit fichier CSV contenant la liste des codes ISO de pays et leurs taux de TVA respectifs directement dans l'entrepôt ?",
    "type": "single",
    "options": [
      "A) Seed dbt (dbt seed)",
      "B) Source externe Fivetran",
      "C) Modèle Python avec Pandas",
      "D) Snapshot dbt"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les seeds dbt permettent de versionner des fichiers CSV de référence dans Git sous le dossier seeds/ et de les charger via la commande dbt seed. L'option B est fausse car déployer un connecteur externe payant comme Fivetran pour un simple fichier de référence statique est disproportionné et coûteux. L'option C est fausse car écrire un modèle Python complet pour charger une liste statique est inutilement complexe comparé à dbt seed. L'option D est fausse car les snapshots historisent des données changeantes et ne sont pas adaptés au chargement initial de fichiers CSV.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "sources-fraicheur",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/seeds",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q013",
    "statement": "Pourquoi la documentation dbt déconseille-t-elle formellement d'utiliser dbt seed pour charger des tables contenant des millions de transactions clients ?",
    "type": "single",
    "options": [
      "A) Les seeds sont versionnés dans Git, ce qui alourdit le dépôt et dégrade les performances lors du chargement par lots",
      "B) Les seeds ne peuvent créer que des vues et non des tables physiques",
      "C) Les seeds ne fonctionnent qu'avec la base SQLite locale",
      "D) Les seeds ne supportent pas les colonnes de type numérique"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les fichiers CSV de seeds sont suivis dans Git ; y stocker des millions de lignes encombre le dépôt et dbt seed effectue des INSERT lents inadaptés aux gros volumes. L'option B est fausse car les seeds créent bel et bien des tables physiques dans la base de données cible. L'option C est fausse car les seeds fonctionnent sur tous les entrepôts de données supportés (Snowflake, BigQuery, Redshift, Databricks). L'option D est fausse car les seeds supportent parfaitement les types numériques, textes, dates et booléens.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "sources-fraicheur",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/seeds",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q014",
    "statement": "Dans une configuration de source, que signifie la directive error_after: {count: 12, period: hour} ?",
    "type": "single",
    "options": [
      "A) dbt source freshness renverra une erreur si la donnée la plus récente a plus de 12 heures",
      "B) Le pipeline tentera de charger les données 12 fois avant d'abandonner",
      "C) dbt supprimera les données de plus de 12 heures dans la source",
      "D) La source sera exclue des builds pendant une durée de 12 heures"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car cette directive configure le seuil d'erreur de fraîcheur à 12 heures par rapport au dernier enregistrement détecté dans loaded_at_field. L'option B est fausse car cette configuration ne contrôle pas le nombre de tentatives de reconnexion ou d'ingestion. L'option C est fausse car dbt n'a que des droits de lecture sur les sources et ne supprime jamais de données brutes. L'option D est fausse car cette directive ne suspend pas l'utilisation du modèle dans les builds ultérieurs.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "sources-fraicheur",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/sources#source-freshness",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q015",
    "statement": "Comment fait-on référence à un seed nommé 'pays_tva' dans un modèle de transformation SQL dbt ?",
    "type": "single",
    "options": [
      "A) {{ ref('pays_tva') }}",
      "B) {{ source('seeds', 'pays_tva') }}",
      "C) {{ seed('pays_tva') }}",
      "D) select * from raw_seeds.pays_tva"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les seeds dbt se comportent comme des modèles et sont référencés dans le code SQL exactement avec la même syntaxe ref(). L'option B est fausse car les seeds ne sont pas déclarés comme des sources et ne s'appellent pas avec source(). L'option C est fausse car la macro seed() n'est pas une fonction valide pour référencer une table dans dbt. L'option D est fausse car écrire le chemin en dur brise la portabilité multi-environnements et empêche dbt d'établir le lignage dans le DAG.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "sources-fraicheur",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/seeds",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q016",
    "statement": "Quel est le bénéfice majeur de centraliser les tables d'ingestion brute dans des blocs sources YAML plutôt que d'écrire leurs noms directement dans les requêtes FROM ?",
    "type": "single",
    "options": [
      "A) Permettre la traçabilité complète dans le DAG de lignage et documenter la provenance des données brutes en un point unique",
      "B) Accélérer de 50 % la vitesse d'exécution des requêtes sur Snowflake",
      "C) Transformer automatiquement les données au format Parquet lors de la lecture",
      "D) Empêcher toute écriture concurrente sur la base de données source"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car déclarer les sources permet à dbt d'afficher la source brute dans le graphe de lignage, d'auditer la fraîcheur et de centraliser les définitions. L'option B est fausse car la macro source() résout le nom de table à la compilation et ne modifie pas les performances natives du moteur SQL. L'option C est fausse car dbt ne réécrit pas le format de stockage physique des sources sous-jacentes. L'option D est fausse car dbt ne pose aucun verrou d'écriture sur les systèmes sources externes.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "sources-fraicheur",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/sources",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q017",
    "statement": "Quel patron de conception de modélisation de données (Data Warehouse pattern) les snapshots dbt implémentent-ils nativement ?",
    "type": "single",
    "options": [
      "A) SCD Type 2 (Slowly Changing Dimension de type 2)",
      "B) SCD Type 1 (Écrasement direct des anciennes valeurs)",
      "C) Modélisation Data Vault 2.0 (Hubs et Links)",
      "D) Star Schema pur sans historique"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les snapshots dbt ajoutent automatiquement des colonnes dbt_valid_from et dbt_valid_to pour historiser les changements d'état au format SCD Type 2. L'option B est fausse car le SCD Type 1 écrase la valeur existante sans conserver l'historique, ce qui est le comportement d'un update classique et non d'un snapshot. L'option C est fausse car bien que compatible, dbt snapshot n'implémente pas nativement l'architecture complète Hub/Link/Satellite de Data Vault. L'option D est fausse car l'objectif premier d'un snapshot est précisément d'enregistrer l'historique des modifications dans le temps.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "snapshots",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/snapshots",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q018",
    "statement": "Quelles sont les deux stratégies supportées par dbt pour détecter les modifications de lignes dans un snapshot ?",
    "type": "single",
    "options": [
      "A) timestamp et check",
      "B) hash et merge",
      "C) cdc et diff",
      "D) log et trigger"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt snapshot supporte la stratégie timestamp (s'appuie sur une colonne updated_at) et la stratégie check (compare une liste de colonnes). L'option B est fausse car hash et merge ne sont pas les noms des stratégies de détection de snapshot dans dbt. L'option C est fausse car cdc et diff ne correspondent pas aux options de configuration de la directive strategy. L'option D est fausse car dbt n'installe pas de triggers de base de données pour détecter les changements.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "snapshots",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/snapshots#snapshot-strategies",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q019",
    "statement": "Dans un snapshot utilisant la stratégie timestamp, quelle colonne de la table source doit obligatoirement être spécifiée dans la configuration ?",
    "type": "single",
    "options": [
      "A) updated_at",
      "B) created_at",
      "C) deleted_at",
      "D) snapshot_time"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la stratégie timestamp exige le paramètre updated_at pointant vers la colonne indiquant quand la ligne source a été modifiée pour la dernière fois. L'option B est fausse car created_at n'indique que la date de création initiale et ne permet pas de savoir si un statut client a changé ultérieurement. L'option C est fausse car deleted_at n'est renseigné que lors d'une suppression logique et ne suit pas les mises à jour régulières. L'option D est fausse car snapshot_time est une variable interne gérée par dbt et non la colonne temporelle de la table source.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "snapshots",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/snapshots#timestamp-strategy",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q020",
    "statement": "Quelles colonnes de métadonnées dbt ajoute-t-il automatiquement à la table de destination créée par un snapshot ?",
    "type": "single",
    "options": [
      "A) dbt_scd_id, dbt_updated_at, dbt_valid_from, dbt_valid_to",
      "B) id, created_at, updated_at, is_deleted",
      "C) row_hash, start_time, end_time, current_flag",
      "D) etl_id, batch_timestamp, status, version"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt injecte systématiquement dbt_scd_id (clé surrogate), dbt_updated_at, dbt_valid_from et dbt_valid_to. L'option B est fausse car ces noms sont des colonnes applicatives classiques et non les métadonnées techniques générées par dbt snapshot. L'option C est fausse car dbt utilise dbt_valid_from et dbt_valid_to plutôt que start_time/end_time ou un drapeau current_flag. L'option D est fausse car ce schéma ne correspond pas à la nomenclature interne standardisée de dbt snapshot.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "snapshots",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/snapshots",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q021",
    "statement": "Dans une table de snapshot dbt, comment identifie-t-on la version actuellement active (la plus récente) d'un enregistrement ?",
    "type": "single",
    "options": [
      "A) La colonne dbt_valid_to est NULL",
      "B) La colonne dbt_valid_to est égale à la date du jour",
      "C) La colonne dbt_scd_id a la valeur '9999-12-31'",
      "D) La colonne dbt_valid_from a la valeur maximale de la table"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dans la convention SCD Type 2 de dbt, la version active en cours possède toujours la valeur NULL dans la colonne dbt_valid_to. L'option B est fausse car si dbt_valid_to contient une date, cela signifie que cette version a été clôturée et remplacée par une nouvelle version. L'option C est fausse car dbt_scd_id est un identifiant de hachage unique généré par dbt et non une date limite. L'option D est fausse car dbt_valid_from maximale n'est pas la méthode standard pour filtrer l'enregistrement courant (la clause WHERE dbt_valid_to IS NULL est la référence).",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "snapshots",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/snapshots",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q022",
    "statement": "Quelle commande en ligne permet d'exécuter l'ensemble des fichiers de snapshots dbt configurés dans le projet ?",
    "type": "single",
    "options": [
      "A) dbt snapshot",
      "B) dbt run --snapshots",
      "C) dbt take snapshots",
      "D) dbt scd2 update"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la commande dédiée dbt snapshot analyse les sources et effectue les insertions et mises à jour SCD Type 2 dans les tables de snapshots cibles. L'option B est fausse car dbt run ignore par défaut les snapshots (seule la commande dbt build ou dbt snapshot les exécute). L'option C est fausse car la commande dbt take snapshots n'existe pas dans le framework. L'option D est fausse car la commande dbt scd2 update n'est pas une commande de la CLI dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "snapshots",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/snapshot",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q023",
    "statement": "Quand doit-on préférer la stratégie check plutôt que la stratégie timestamp dans un snapshot dbt ?",
    "type": "single",
    "options": [
      "A) Lorsque la table source ne possède aucune colonne d'horodatage de mise à jour fiable (updated_at)",
      "B) Lorsque la table source dépasse 100 millions de lignes",
      "C) Lorsque l'on souhaite écraser les anciennes données sans historiser",
      "D) Lorsque le schéma cible est hébergé sur PostgreSQL"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la stratégie check compare les valeurs d'une liste de colonnes sélectionnées (ou check_cols='all') quand le système source ne maintient pas de date de modification. L'option B est fausse car sur de très volumineuses tables, la stratégie check est plus coûteuse en calcul car elle doit hacher et comparer de nombreuses colonnes. L'option C est fausse car l'historisation SCD Type 2 est maintenue dans les deux cas ; elle n'écrase jamais les données. L'option D est fausse car le choix de stratégie dépend des colonnes sources disponibles et non de l'entrepôt de données sous-jacent.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "snapshots",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/snapshots#check-strategy",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q024",
    "statement": "Que se passe-t-il si un enregistrement existant dans la source disparaît complètement (suppression physique dans la source) lors du passage de dbt snapshot avec la configuration invalidate_hard_deletes=True ?",
    "type": "single",
    "options": [
      "A) dbt renseigne la colonne dbt_valid_to avec l'horodatage du snapshot, clôturant la ligne sans la supprimer de la table snapshot",
      "B) dbt supprime physiquement la ligne de la table de snapshot",
      "C) dbt lève une erreur d'intégrité et annule la transaction",
      "D) dbt ignore la suppression et laisse la ligne avec dbt_valid_to à NULL"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'option invalidate_hard_deletes clôture la version en fixant dbt_valid_to à l'heure courante, préservant la traçabilité de la suppression. L'option B est fausse car les snapshots ne suppriment jamais physiquement d'enregistrements historiques. L'option C est fausse car la suppression physique dans la source est un événement normal géré par cette directive sans générer d'erreur. L'option D est fausse car laisser dbt_valid_to à NULL est le comportement par défaut si invalidate_hard_deletes n'est pas activé.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "snapshots",
    "difficulty": "difficile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/snapshots#hard-deletes",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q025",
    "statement": "Dans le moteur de template Jinja utilisé par dbt, quelle syntaxe de délimiteurs permet d'évaluer une expression et d'en afficher le résultat dans le code SQL compilé ?",
    "type": "single",
    "options": [
      "A) {{ ... }}",
      "B) {% ... %}",
      "C) {# ... #}",
      "D) <% ... %>"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les doubles accolades {{ ... }} sont utilisées pour les expressions qui génèrent du texte ou appellent des fonctions/macros retournant une valeur. L'option B est fausse car la syntaxe {% ... %} est réservée aux structures de contrôle de flux comme les boucles for, conditions if et définitions de macros. L'option C est fausse car les délimiteurs {# ... #} sont réservés aux commentaires Jinja qui sont complètement retirés lors de la compilation. L'option D est fausse car la syntaxe <% ... %> est propre à d'autres moteurs de template (comme ERB ou ASP) et n'est pas valide en Jinja.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "jinja-macros",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/jinja-macros",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q026",
    "statement": "Où doivent être enregistrés les fichiers contenant des définitions de macros réutilisables ({% macro ... %}) dans l'arborescence standard d'un projet dbt ?",
    "type": "single",
    "options": [
      "A) Dans le dossier macros/",
      "B) Dans le dossier models/",
      "C) Dans le dossier analysis/",
      "D) Dans le dossier target/"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le dossier macros/ est le répertoire officiel scanné par dbt pour charger toutes les fonctions et macros personnalisées du projet. L'option B est fausse car le dossier models/ est réservé aux modèles de transformation SQL et Python. L'option C est fausse car le dossier analysis/ stocke des requêtes d'analyse ad-hoc qui ne sont pas matérialisées dans l'entrepôt. L'option D est fausse car le dossier target/ contient les artefacts générés automatiquement lors de la compilation et ne doit jamais être modifié manuellement.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "jinja-macros",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/jinja-macros",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q027",
    "statement": "Quelle fonction Jinja permet de lire une variable de projet avec une valeur de repli (fallback) si la variable n'a pas été fournie en ligne de commande ?",
    "type": "single",
    "options": [
      "A) var('nom_variable', 'valeur_par_defaut')",
      "B) env_var('nom_variable', 'valeur_par_defaut')",
      "C) config.get('nom_variable', 'valeur_par_defaut')",
      "D) get_var('nom_variable', default='valeur_par_defaut')"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la fonction var() accepte un deuxième argument optionnel qui sert de valeur par défaut si la variable de projet n'est pas définie. L'option B est fausse car env_var() lit les variables d'environnement du système d'exploitation hôte et non les variables configurées dans le projet dbt. L'option C est fausse car config.get() extrait les paramètres de configuration du modèle en cours et non les variables globales de projet. L'option D est fausse car get_var() n'est pas une fonction native standard du framework dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "variables",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/project-variables",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q028",
    "statement": "Comment surcharger la variable de projet date_limite avec la valeur '2026-11-01' lors de l'exécution de dbt run depuis le terminal ?",
    "type": "single",
    "options": [
      "A) dbt run --vars '{\"date_limite\": \"2026-11-01\"}'",
      "B) dbt run --set date_limite='2026-11-01'",
      "C) dbt run --variable date_limite='2026-11-01'",
      "D) dbt run --env date_limite='2026-11-01'"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'argument CLI officiel de dbt est --vars suivi d'une chaîne au format JSON ou YAML représentant le dictionnaire de variables. L'option B est fausse car --set n'est pas un paramètre supporté par la ligne de commande dbt. L'option C est fausse car --variable n'est pas une option reconnue par la CLI dbt. L'option D est fausse car --env n'est pas un argument valide pour surcharger des variables de projet dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "variables",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/project-variables",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q029",
    "statement": "Que fait le signe tiret dans la syntaxe Jinja {%- ou -%} lorsqu'il est accolé aux délimiteurs ?",
    "type": "single",
    "options": [
      "A) Il supprime les espaces blancs et sauts de ligne situés avant ou après le délimiteur dans le SQL généré",
      "B) Il commente l'instruction Jinja sans l'exécuter",
      "C) Il inverse la condition booléenne dans les instructions if",
      "D) Il indique que la macro doit s'exécuter en mode strict"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car en Jinja, l'ajout du tiret {%- ou -%} active le contrôle des blancs (whitespace trimming) pour éviter de générer de nombreuses lignes vides inutiles dans le fichier SQL compilé. L'option B est fausse car les commentaires Jinja utilisent exclusivement la syntaxe {# ... #}. L'option C est fausse car l'inversion logique s'effectue avec l'opérateur not et non avec un tiret. L'option D est fausse car le tiret n'a aucun impact sur le niveau de sévérité ou le mode strict d'exécution.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "jinja-macros",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/jinja-macros",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q030",
    "statement": "Quelle macro intégrée à dbt permet d'exécuter une requête SQL arbitraire pendant la phase de compilation et de charger les résultats sous forme de tableau exploitable en Jinja ?",
    "type": "single",
    "options": [
      "A) run_query(sql)",
      "B) execute_sql(sql)",
      "C) fetch_data(sql)",
      "D) select_raw(sql)"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la macro run_query() exécute la requête SQL fournie et renvoie un objet Agate Table manipulable dans les boucles Jinja. L'option B est fausse car execute_sql n'est pas une macro standard de dbt. L'option C est fausse car fetch_data n'est pas une fonction native dbt. L'option D est fausse car select_raw n'existe pas dans le catalogue de macros dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "jinja-macros",
    "difficulty": "difficile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/dbt-jinja-functions/run_query",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q031",
    "statement": "Où sont déclarées les variables de projet globales valables par défaut pour tous les modèles lorsqu'elles ne sont pas injectées en ligne de commande ?",
    "type": "single",
    "options": [
      "A) Dans le fichier dbt_project.yml sous la clé vars:",
      "B) Dans le fichier profiles.yml sous la clé variables:",
      "C) Dans le fichier manifest.json sous la clé default_vars:",
      "D) Dans un fichier models/vars.sql"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le bloc vars: à la racine de dbt_project.yml définit les variables globales du projet avec leurs valeurs par défaut. L'option B est fausse car profiles.yml gère les identifiants d'accès à l'entrepôt et ne contient pas de déclaration de variables métier. L'option C est fausse car manifest.json est un fichier d'artefact en lecture seule produit par dbt et non un fichier de configuration éditable. L'option D est fausse car les fichiers .sql dans models/ sont des modèles de données et non des dictionnaires de variables.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "variables",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/project-variables",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q032",
    "statement": "À quoi sert la variable booléenne Jinja spéciale execute dans le développement de macros dbt avancées ?",
    "type": "single",
    "options": [
      "A) Elle vaut true uniquement lors de la phase d'exécution réelle et false pendant la phase initiale de parsing du projet",
      "B) Elle indique si l'utilisateur possède les droits administrateur sur l'entrepôt",
      "C) Elle active le mode débogage pas à pas dans le terminal",
      "D) Elle signale si la commande précédente a réussi avec succès"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt analyse les modèles en deux temps : une passe de parsing (où execute est false) puis la passe d'exécution (où execute est true) ; utiliser if execute évite d'exécuter des requêtes à blanc lors du parsing. L'option B est fausse car execute n'a aucun lien avec les privilèges de sécurité RBAC de l'utilisateur. L'option C est fausse car le mode débogage est géré par le flag CLI --debug. L'option D est fausse car le statut de la commande précédente est stocké dans run_results.json et non dans execute.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "jinja-macros",
    "difficulty": "difficile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q033",
    "statement": "Dans un modèle configuré avec materialized='incremental', quelle macro conditionnelle Jinja doit englober le filtre SQL de sélection des nouvelles lignes à ingérer ?",
    "type": "single",
    "options": [
      "A) {% if is_incremental() %}",
      "B) {% if incremental_mode() %}",
      "C) {% if table_exists() %}",
      "D) {% if not full_refresh %}"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car is_incremental() est la macro officielle qui renvoie true quand la table cible existe déjà et qu'aucun rechargement complet n'est demandé. L'option B est fausse car incremental_mode() n'est pas une fonction reconnue par dbt. L'option C est fausse car table_exists() est une macro d'adaptateur interne mais ne prend pas en compte le flag full-refresh. L'option D est fausse car full_refresh n'est pas la macro standard à insérer directement dans les modèles incrémentaux.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "incremental-microbatch",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/incremental-models",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q034",
    "statement": "Quelle variable Jinja spéciale permet de faire référence à la table physique cible actuellement existante dans la base de données au sein d'un filtre incrémental ?",
    "type": "single",
    "options": [
      "A) this",
      "B) self",
      "C) target_table",
      "D) destination"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'objet this représente la relation de la table cible actuelle dans l'entrepôt, permettant d'écrire par exemple select max(updated_at) from {{ this }}. L'option B est fausse car self n'est pas une variable dbt Jinja pour désigner la table en cours. L'option C est fausse car target_table n'est pas une variable dbt reconnue. L'option D est fausse car destination n'est pas un mot-clé valide dans les modèles dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "incremental-microbatch",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/dbt-jinja-functions/this",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q035",
    "statement": "Quel paramètre de configuration doit être impérativement spécifié dans un modèle incrémental utilisant la stratégie 'merge' pour éviter la création de doublons lors des mises à jour ?",
    "type": "single",
    "options": [
      "A) unique_key",
      "B) primary_constraint",
      "C) merge_column",
      "D) dedup_field"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car unique_key indique la clé primaire fonctionnelle permettant à l'instruction MERGE d'identifier les lignes existantes à mettre à jour et les nouvelles à insérer. L'option B est fausse car primary_constraint n'est pas un paramètre de configuration d'un modèle incrémental. L'option C est fausse car merge_column n'est pas le paramètre dbt valide pour la clé unique. L'option D est fausse car dedup_field n'existe pas dans la syntaxe de configuration de dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "incremental-microbatch",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/incremental-models#what-is-a-unique_key",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q036",
    "statement": "Que fait le flag en ligne de commande --full-refresh lorsqu'il est passé à dbt run sur un modèle incrémental ?",
    "type": "single",
    "options": [
      "A) Il supprime la table existante dans l'entrepôt et la reconstruit entièrement depuis zéro à partir des données sources",
      "B) Il met à jour uniquement les lignes modifiées au cours des dernières 24 heures",
      "C) Il vide la table sans réinsérer aucune donnée",
      "D) Il force l'exécution de tous les tests sans exécuter le modèle SQL"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car --full-refresh force dbt à ignorer is_incremental(), supprimant la table cible pour exécuter un CREATE TABLE complet de toutes les données historiques. L'option B est fausse car traiter les dernières 24 heures est le fonctionnement d'un run incrémental normal et non d'un full refresh. L'option C est fausse car un full refresh reconstruit entièrement la table avec les données et ne la laisse pas vide. L'option D est fausse car l'exécution des tests est gérée par dbt test ou dbt build, pas par l'option --full-refresh.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "incremental-microbatch",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/run#refresh-incremental-models",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q037",
    "statement": "Un modèle incrémental en production voit son code modifié pour ajouter une nouvelle colonne 'statut_paiement'. Par défaut (on_schema_change='ignore'), que se passe-t-il lors du prochain dbt run incrémental ?",
    "type": "single",
    "options": [
      "A) La nouvelle colonne n'apparaît pas dans la table cible et les données associées sont ignorées",
      "B) La table est automatiquement supprimée et reconstruite avec la nouvelle colonne",
      "C) dbt lève une erreur bloquante immédiate de discordance de schéma",
      "D) La nouvelle colonne est ajoutée uniquement si elle contient des valeurs non nulles"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car avec la valeur par défaut on_schema_change='ignore', dbt n'exécute pas d'instruction ALTER TABLE ADD COLUMN et la nouvelle colonne n'est pas ajoutée à la table existante. L'option B est fausse car dbt ne déclenche jamais de reconstruction complète implicite sans demande explicite via --full-refresh. L'option C est fausse car une erreur n'est levée que si on_schema_change est configuré sur 'fail'. L'option D est fausse car dbt ne conditionne pas la modification de schéma au contenu des valeurs.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "incremental-microbatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/incremental-models#what-if-the-schema-changes",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q038",
    "statement": "Quelle valeur de on_schema_change doit être configurée pour que dbt ajoute automatiquement les nouvelles colonnes à la table cible existante sans la reconstruire intégralement ?",
    "type": "single",
    "options": [
      "A) append_new_columns",
      "B) add_columns_auto",
      "C) auto_alter",
      "D) update_schema"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la configuration on_schema_change='append_new_columns' déclenche un ALTER TABLE pour ajouter les colonnes supplémentaires détectées dans le SELECT. L'option B est fausse car add_columns_auto n'est pas une valeur reconnue par dbt. L'option C est fausse car auto_alter n'est pas une directive valide de la configuration dbt. L'option D est fausse car update_schema n'est pas un paramètre supporté par dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "incremental-microbatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/incremental-models#what-if-the-schema-changes",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q039",
    "statement": "Quel est l'avantage architectural déterminant de la stratégie incrémentale microbatch (dbt Core 1.9+) par rapport aux modèles incrémentaux classiques sur de volumineuses séries temporelles ?",
    "type": "single",
    "options": [
      "A) Elle partitionne le calcul en fenêtres temporelles indépendantes, permettant de réexécuter de façon ciblée et parallèle un lot horaire ou journalier précis en cas d'échec",
      "B) Elle ne nécessite aucune clé de partition temporelle ni date d'événement",
      "C) Elle remplace l'entrepôt de données distant par un moteur DuckDB local",
      "D) Elle supprime le besoin de définir un fichier profiles.yml"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la stratégie microbatch découpe le traitement en sous-lots d'intervalles temporels autonomes facilitant la reprise sur erreur et l'exécution concurrente. L'option B est fausse car la stratégie microbatch requiert au contraire expressément la définition du paramètre event_time. L'option C est fausse car microbatch s'exécute sur l'entrepôt de données configuré (Snowflake, BigQuery, etc.) et ne bascule pas sur DuckDB. L'option D est fausse car profiles.yml reste indispensable pour connecter dbt à l'entrepôt de données.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "incremental-microbatch",
    "difficulty": "difficile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q040",
    "statement": "Quelle est la signature obligatoire de la fonction point d'entrée que doit comporter tout fichier de modèle Python (.py) dans dbt ?",
    "type": "single",
    "options": [
      "A) def model(dbt, session):",
      "B) def run(spark, context):",
      "C) def main(dbt_context):",
      "D) def execute(table_name):"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car tout modèle Python dbt doit définir la fonction model(dbt, session) qui renvoie un DataFrame Snowflake Snowpark, PySpark ou Pandas. L'option B est fausse car def run n'est pas la convention de signature attendue par le runtime dbt Python. L'option C est fausse car def main n'est pas reconnu par le compilateur dbt pour les modèles Python. L'option D est fausse car def execute n'est pas la signature standard d'un modèle dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "modeles-python",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/python-models",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q041",
    "statement": "Quelles sont les seules matérialisations compatibles avec les modèles Python dans dbt ?",
    "type": "single",
    "options": [
      "A) table et incremental",
      "B) view et ephemeral",
      "C) view et table",
      "D) seed et snapshot"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les modèles Python dbt ne supportent que les matérialisations persistantes table et incremental ; view et ephemeral sont formellement rejetées. L'option B est fausse car view et ephemeral ne sont pas supportées pour les modèles Python car les moteurs d'entrepôt ne peuvent pas créer de vues SQL pures à partir de code impératif. L'option C est fausse car la matérialisation view n'est pas compatible avec Python dans dbt. L'option D est fausse car les seeds sont des fichiers CSV et les snapshots ne supportent pas Python.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "modeles-python",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/python-models#materializations",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q042",
    "statement": "Une équipe souhaite publier une nouvelle version d'un modèle dbt dim_clients sans casser immédiatement les requêtes des équipes utilisant l'ancienne version. Quel attribut YAML permet de définir la date d'obsolescence après laquelle l'utilisation de l'ancienne version génère un avertissement ?",
    "type": "single",
    "options": [
      "A) deprecation_date",
      "B) end_of_life",
      "C) expiration_timestamp",
      "D) retired_on"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la directive deprecation_date au format YYYY-MM-DD indique la date à partir de laquelle dbt avertira les utilisateurs que cette version de modèle est obsolète. L'option B est fausse car end_of_life n'est pas un mot-clé reconnu par la spécification de versionnement dbt. L'option C est fausse car expiration_timestamp n'est pas un paramètre supporté par dbt. L'option D est fausse car retired_on n'existe pas dans le schéma de modèle dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "versions",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/collaborate/govern/model-versions#deprecating-a-model-version",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q043",
    "statement": "Comment un modèle en aval peut-il faire référence de manière figée à la version 1 d'un modèle multi-versionné nommé dim_clients ?",
    "type": "single",
    "options": [
      "A) {{ ref('dim_clients', v=1) }}",
      "B) {{ ref('dim_clients_v1') }}",
      "C) {{ ref('dim_clients', version='latest') }}",
      "D) {{ version_ref('dim_clients', 1) }}"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt permet de spécifier le numéro de version souhaité via l'argument v= (ou version=) directement au sein de la macro ref(). L'option B est fausse car dim_clients_v1 est le nom du fichier SQL sur le disque, mais la macro ref() s'appelle toujours sur le nom générique du modèle déclaré dans le YAML. L'option C est fausse car version='latest' pointerait vers la version la plus récente et non de manière figée sur la version 1. L'option D est fausse car version_ref n'existe pas dans la syntaxe Jinja de dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "versions",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/collaborate/govern/model-versions#referencing-a-model-version",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q044",
    "statement": "Quel nouveau flag CLI (dbt Core 1.8+) permet de valider la syntaxe et de créer la structure des relations dans l'entrepôt sans traiter la moindre ligne de données en injectant un filtre 'WHERE false' ?",
    "type": "single",
    "options": [
      "A) --empty",
      "B) --dry-run",
      "C) --sample 0",
      "D) --no-data"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le flag --empty injecte un prédicat faux sur les sources et modèles pour limiter le résultat à 0 ligne, permettant de valider les schémas DDL sans coût de compute. L'option B est fausse car --dry-run n'est pas un flag standard de la CLI dbt Core. L'option C est fausse car --sample 0 n'est pas la syntaxe recommandée pour générer des tables vides. L'option D est fausse car --no-data n'est pas un argument supporté par la commande dbt build ou dbt run.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "empty-sample",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/run#run-empty-models",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q045",
    "statement": "Pour tester un modèle incrémental lourd en environnement de développement sur les 7 derniers jours seulement sans modifier le code source, quelle option CLI doit-on utiliser ?",
    "type": "single",
    "options": [
      "A) --sample 7d",
      "B) --limit 7",
      "C) --days 7",
      "D) --window 'last 7 days'"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le flag --sample permet de restreindre la fenêtre temporelle d'ingestion lors d'un build (ex: --sample 7d pour 7 jours) sur les modèles supportant une dimension temporelle. L'option B est fausse car --limit restreint le nombre total de lignes et non une fenêtre temporelle calendaire. L'option C est fausse car --days n'est pas un paramètre reconnu par la CLI dbt. L'option D est fausse car --window n'est pas une syntaxe d'argument CLI dbt.",
    "domain": "Section 1 : Developing dbt models",
    "topic_id": "empty-sample",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/run#sample-data",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  }
];
