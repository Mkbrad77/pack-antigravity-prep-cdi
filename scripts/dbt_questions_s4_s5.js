// Banque de questions officielles et originales pour dbt Section 4 (23q) et Section 5 (22q)
// Générée et validée le 2026-10-31
export const dbtQuestionsS4 = [
  {
    "id": "dbt-q106",
    "statement": "Dans quel fichier dbt les informations sensibles de connexion à l'entrepôt (comptes, rôles, identifiants, entrepôts virtuels) sont-elles configurées, et pourquoi ce fichier ne doit-il jamais être versionné dans Git ?",
    "type": "single",
    "options": [
      "A) Dans profiles.yml, pour éviter d'exposer publiquement les secrets et mots de passe d'accès à la base de données",
      "B) Dans dbt_project.yml, car il contient la liste des modèles à compiler",
      "C) Dans manifest.json, car il est généré dynamiquement lors du build",
      "D) Dans selectors.yml, car il gère les exclusions de modèles"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car profiles.yml est conservé par défaut dans ~/.dbt/ en local pour empêcher toute fuite d'identifiants de production sur les dépôts de code partagés. L'option B est fausse car dbt_project.yml est versionné dans Git et ne doit pas contenir de mots de passe. L'option C est fausse car manifest.json est un artefact de compilation et non un fichier de configuration des connexions. L'option D est fausse car selectors.yml définit des groupes de modèles et ne gère pas la sécurité réseau.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "environnements",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q107",
    "statement": "Comment exécuter un projet dbt en ciblant explicitement la configuration de production définie sous la clé 'prod' dans profiles.yml ?",
    "type": "single",
    "options": [
      "A) dbt run --target prod (ou dbt run -t prod)",
      "B) dbt run --env prod",
      "C) dbt run --profile prod",
      "D) dbt run --destination prod"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le flag CLI officiel pour sélectionner une sortie cible (target output) est --target ou son alias court -t. L'option B est fausse car --env n'est pas un flag reconnu par la CLI dbt. L'option C est fausse car --profile sert à changer de nom de profil global et non de cible d'environnement au sein d'un profil. L'option D est fausse car --destination n'existe pas dans dbt.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "environnements",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/run#target",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q108",
    "statement": "À quoi correspond le paramètre de configuration 'threads' défini au sein d'un profil dans profiles.yml ?",
    "type": "single",
    "options": [
      "A) Au nombre maximal de modèles ou tests que dbt peut exécuter en parallèle sur des connexions concurrentes",
      "B) Au nombre de vCPU alloués au serveur de base de données",
      "C) Au délai d'expiration (timeout) d'une requête SQL en secondes",
      "D) Au nombre de tentatives automatiques en cas d'échec réseau"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le paramètre threads contrôle le degré de parallélisme de dbt, c'est-à-dire le nombre de requêtes SQL simultanées soumises à l'entrepôt pour les nœuds indépendants du DAG. L'option B est fausse car les vCPU de l'entrepôt sont dimensionnés au niveau du Cloud (ex: taille du Virtual Warehouse Snowflake). L'option C est fausse car le timeout est configuré par des paramètres spécifiques comme connect_timeout. L'option D est fausse car les tentatives réseau ne sont pas régies par le nombre de threads.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "environnements",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/threads",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q109",
    "statement": "Dans un modèle SQL, comment conditionner l'application d'un filtre pour restreindre le volume de données traitées uniquement lorsque le modèle s'exécute en environnement de développement local ?",
    "type": "single",
    "options": [
      "A) {% if target.name == 'dev' %} where date_creation >= current_date - 7 {% endif %}",
      "B) {% if env == 'development' %} where date_creation >= current_date - 7 {% endif %}",
      "C) {% if is_dev() %} where date_creation >= current_date - 7 {% endif %}",
      "D) -- dev: where date_creation >= current_date - 7"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'objet de contexte target.name expose le nom de la cible courante (ex: 'dev', 'prod'), permettant d'insérer dynamiquement des filtres limitant le calcul en dev. L'option B est fausse car la variable env n'est pas un objet contextuel natif de dbt. L'option C est fausse car la macro is_dev() n'existe pas nativement dans le cœur dbt (on teste target.name). L'option D est fausse car un commentaire SQL simple n'est pas interprété conditionnellement par Jinja.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "environnements",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/dbt-jinja-functions/target",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q110",
    "statement": "Pour éviter d'exposer des clés d'API et mots de passe en clair dans profiles.yml sur les machines des développeurs, quelle fonction Jinja doit être employée ?",
    "type": "single",
    "options": [
      "A) env_var('NOM_VARIABLE')",
      "B) get_secret('NOM_VARIABLE')",
      "C) var('NOM_VARIABLE')",
      "D) kms_decrypt('NOM_VARIABLE')"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la fonction env_var() lit directement les variables d'environnement de l'OS hôte au moment de l'exécution, gardant les fichiers YAML exempts de mots de passe en clair. L'option B est fausse car get_secret n'est pas une fonction Jinja native de dbt Core. L'option C est fausse car var() lit les variables du projet dbt et non les variables d'environnement système. L'option D est fausse car kms_decrypt n'est pas une fonction standard Jinja de dbt.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "environnements",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q111",
    "statement": "Par défaut, dans quel répertoire dbt recherche-t-il le fichier profiles.yml sur un poste de travail si la variable d'environnement DBT_PROFILES_DIR n'est pas définie ?",
    "type": "single",
    "options": [
      "A) Dans le dossier ~/.dbt/ du répertoire personnel de l'utilisateur",
      "B) Directement à la racine du projet dbt en cours",
      "C) Dans le dossier target/profiles/",
      "D) Dans le dossier dbt_packages/"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car par convention de sécurité, dbt recherche profiles.yml dans ~/.dbt/ (le répertoire personnel de l'utilisateur hôte) pour isoler les secrets hors des dépôts Git. L'option B est fausse car la racine du projet est inspectée pour dbt_project.yml mais pas par défaut pour profiles.yml. L'option C est fausse car target/ est un répertoire d'artefacts temporaires. L'option D est fausse car dbt_packages/ contient uniquement les bibliothèques tierces téléchargées.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "environnements",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml#advanced-profiles-settings",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q112",
    "statement": "Comment configurer dbt pour qu'en environnement de développement, chaque développeur écrive ses tables dans un schéma personnel isolé (ex: dbt_amoyo) sans écraser le travail de ses collègues ?",
    "type": "single",
    "options": [
      "A) En utilisant schema: \"dbt_{{ env_var('USER', 'dev') }}\" dans le profil de connexion dev",
      "B) En créant un projet dbt distinct pour chaque développeur",
      "C) En modifiant manuellement le nom de chaque modèle SQL chaque matin",
      "D) En désactivant la matérialisation table en environnement de test"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car injecter le nom d'utilisateur système via env_var('USER') dans la configuration du schéma du profil garantit une isolation parfaite des schémas de développement. L'option B est fausse car dupliquer les projets dbt créerait une dette de maintenance ingérable et des divergences de code. L'option C est fausse car renommer manuellement les modèles viole les principes d'automatisation et de gestion de code. L'option D est fausse car désactiver la matérialisation table empêcherait de tester convenablement le comportement réel des modèles.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "environnements",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/custom-schemas",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q113",
    "statement": "Quelle est la commande dbt emblématique utilisée dans les pipelines d'intégration continue (Slim CI) pour exécuter et tester uniquement les modèles modifiés et leurs dépendances en aval ?",
    "type": "single",
    "options": [
      "A) dbt build --select state:modified+ --defer --state path/to/prod/artifacts",
      "B) dbt run --select all --force",
      "C) dbt test --select changed_only",
      "D) dbt ci --pr-mode"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car cette commande constitue la formule consacrée de Slim CI : elle sélectionne ce qui a changé et ses enfants (state:modified+), résout les ancêtres non modifiés vers la prod (--defer) et compare avec le manifest de référence (--state). L'option B est fausse car dbt run --select all réexécuterait la totalité de l'entrepôt, anéantissant l'intérêt et la vitesse de Slim CI. L'option C est fausse car changed_only n'est pas un sélecteur dbt valide. L'option D est fausse car dbt ci n'est pas une commande de la CLI dbt.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "ci-slim-ci",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/deploy/slim-ci",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q114",
    "statement": "Pourquoi la commande dbt build est-elle systématiquement préférée à dbt run dans les workflows d'intégration continue (CI) ?",
    "type": "single",
    "options": [
      "A) Parce que dbt build exécute les modèles et leurs tests de manière entrelacée dans l'ordre du DAG, interrompant immédiatement le pipeline si un test amont échoue",
      "B) Parce que dbt build ne consomme aucun crédit cloud",
      "C) Parce que dbt build est écrit en C++ au lieu de Python",
      "D) Parce que dbt run ne supporte pas Snowflake"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt build ordonnance graines, modèles, snapshots et tests ; si le test d'un modèle parent échoue, les modèles enfants dépendants ne sont pas calculés (statut skipped), protégeant l'intégrité et économisant les ressources. L'option B est fausse car dbt build soumet des requêtes SQL réelles à l'entrepôt et consomme des ressources de calcul normales. L'option C est fausse car dbt build et dbt run partagent le même moteur d'exécution en Python. L'option D est fausse car dbt run supporte parfaitement Snowflake et tous les autres entrepôts.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "ci-slim-ci",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/build",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q115",
    "statement": "Dans un pipeline Slim CI, que fait l'argument --defer lorsqu'un modèle modifié fct_orders fait un ref('stg_orders') alors que stg_orders n'a pas été modifié et n'existe pas dans le schéma temporaire de test de la Pull Request ?",
    "type": "single",
    "options": [
      "A) dbt redirige automatiquement la référence de stg_orders vers la table correspondante située dans le schéma de production de référence",
      "B) dbt lève une erreur indiquant que la table stg_orders est introuvable",
      "C) dbt reconstruit stg_orders depuis zéro dans le schéma de test",
      "D) dbt annule la Pull Request sur GitHub"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'option --defer utilise le manifest d'état pour pointer vers l'environnement de production pour toutes les tables parentes non reconstruites dans l'environnement de test. L'option B est fausse car l'erreur de table manquante est justement évitée grâce à l'activation du mode defer. L'option C est fausse car dbt ne reconstruit pas stg_orders car il n'est pas sélectionné par state:modified+. L'option D est fausse car dbt ne gère pas directement l'API de rejet des Pull Requests GitHub.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "ci-slim-ci",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/defer",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q116",
    "statement": "Quel artefact doit obligatoirement être téléchargé depuis l'environnement de production et fourni via le flag --state pour permettre le fonctionnement de Slim CI ?",
    "type": "single",
    "options": [
      "A) manifest.json",
      "B) catalog.json",
      "C) dbt.log",
      "D) semantic_manifest.json"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car manifest.json est le fichier clé contenant la structure complète du graphe et les métadonnées de production indispensables à la comparaison d'état. L'option B est fausse car catalog.json documente les types de colonnes mais n'est pas utilisé par dbt pour comparer l'état du code. L'option C est fausse car dbt.log est un simple journal textuel. L'option D est fausse car semantic_manifest.json concerne la couche sémantique et ne remplace pas manifest.json.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "ci-slim-ci",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/deploy/slim-ci",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q117",
    "statement": "Quel est l'impact financier et opérationnel de la mise en place de Slim CI dans une grande entreprise disposant de plusieurs centaines de modèles dbt ?",
    "type": "single",
    "options": [
      "A) Réduction de 80 à 95 % des durées d'exécution et des coûts de calcul cloud sur les Pull Requests en ne testant que le strict nécessaire",
      "B) Augmentation des coûts de calcul de 50 % en raison de la complexité des algorithmes de graphe",
      "C) Suppression du besoin d'écrire des tests de données",
      "D) Obligation de souscrire à un hébergement sur serveur dédié AWS EC2"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car au lieu de reconstruire l'intégralité du projet à chaque commit (plusieurs heures de calcul coûteux), Slim CI ne valide que les modifications en quelques minutes. L'option B est fausse car l'analyse du graphe prend quelques secondes et réduit massivement les requêtes envoyées à l'entrepôt. L'option C est fausse car les tests de données restent essentiels et sont exécutés de manière ciblée sur les modèles modifiés. L'option D est fausse car Slim CI fonctionne sur n'importe quel runner de CI standard (GitHub Actions, GitLab CI) sans serveur dédié.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "ci-slim-ci",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/deploy/slim-ci",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q118",
    "statement": "Que sélectionne l'expression dbt build --select state:new ?",
    "type": "single",
    "options": [
      "A) Uniquement les nouveaux modèles créés dans la branche courante et qui n'existaient pas dans le manifest de production",
      "B) Les modèles dont les données sources ont moins de 24 heures",
      "C) Les modèles ayant échoué lors de la dernière exécution",
      "D) Les modèles qui n'ont encore jamais été exécutés en production"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le sélecteur state:new isole spécifiquement les nœuds qui sont totalement absents du manifest.json de référence (les nouveaux fichiers ajoutés par la PR). L'option B est fausse car la fraîcheur des données n'est pas évaluée par state:new. L'option C est fausse car les modèles en échec sont sélectionnés par result:error et non state:new. L'option D est fausse car dbt compare la présence dans le manifest de référence et non l'historique d'exécution de production.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "ci-slim-ci",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/state-comparison#new-method",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q119",
    "statement": "Quelle commande introduite dans dbt Core 1.6 permet de cloner rapidement des tables existantes depuis un environnement de référence vers un schéma de test sans recalculer les transformations SQL ?",
    "type": "single",
    "options": [
      "A) dbt clone --state path/to/artifacts",
      "B) dbt copy --state path/to/artifacts",
      "C) dbt replicate --source prod",
      "D) dbt duplicate-tables"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt clone permet d'exploiter les capacités de clonage logique des entrepôts de données pour reproduire l'état d'un schéma cible à partir d'un manifest de référence. L'option B est fausse car dbt copy n'est pas une commande de la CLI dbt. L'option C est fausse car dbt replicate n'existe pas dans le framework. L'option D est fausse car dbt duplicate-tables n'est pas une syntaxe reconnue.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "defer-clone",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/clone",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q120",
    "statement": "Sur Snowflake, quelle instruction SQL native la commande dbt clone exécute-t-elle pour répliquer une table sans dupliquer son stockage physique (Zero-Copy Clone) ?",
    "type": "single",
    "options": [
      "A) CREATE TABLE target_table CLONE source_table",
      "B) INSERT INTO target_table SELECT * FROM source_table",
      "C) CREATE TABLE target_table AS SELECT * FROM source_table",
      "D) COPY INTO target_table FROM @stage"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car Snowflake dispose de la clause native CLONE permettant de dupliquer instantanément les pointeurs de métadonnées sans copier les octets de micro-partitions. L'option B est fausse car INSERT INTO SELECT réalise une copie physique complète et consomme du compute et du stockage. L'option C est fausse car CREATE TABLE AS SELECT (CTAS) réécrit physiquement toutes les données. L'option D est fausse car COPY INTO charge des fichiers externes depuis un stage S3/Snowflake.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "defer-clone",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/clone#snowflake",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q121",
    "statement": "Quelle est la différence fondamentale entre les options --defer et dbt clone ?",
    "type": "single",
    "options": [
      "A) --defer ne crée aucune table dans la base locale et redirige simplement les requêtes SQL compilées vers la production, tandis que dbt clone crée physiquement les relations dans le schéma cible",
      "B) --defer est payant alors que dbt clone est gratuit",
      "C) --defer ne fonctionne qu'avec BigQuery alors que clone est exclusif à Postgres",
      "D) dbt clone supprime les tables de production après copie"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car --defer est un mécanisme de redirection au niveau compilation sans impact sur la base ; dbt clone crée de vrais objets de tables clonés dans le schéma de destination. L'option B est fausse car les deux fonctionnalités font partie de dbt Core open source et ne sont pas payantes. L'option C est fausse car les deux outils fonctionnent sur la plupart des grands entrepôts modernes supportant dbt. L'option D est fausse car dbt clone ne détruit jamais les tables sources de production.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "defer-clone",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/clone",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q122",
    "statement": "Si un développeur utilise dbt run --select fct_ventes --defer --state path, mais que le modèle stg_clients existe DÉJÀ dans son schéma de développement local, quelle table dbt choisira-t-il pour exécuter la transformation ?",
    "type": "single",
    "options": [
      "A) La table stg_clients présente localement dans son schéma de développement",
      "B) La table stg_clients de production issue du manifest",
      "C) dbt lèvera une erreur de conflit d'environnement",
      "D) dbt supprimera la table locale pour forcer l'usage de la production"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car par défaut avec --defer, si la relation existe déjà dans le schéma courant d'exécution, dbt privilégie la relation locale pour refléter les travaux en cours du développeur. L'option B est fausse car dbt ne se rabat sur la production que si la table est absente du schéma local cible. L'option C est fausse car la présence de la table locale est un cas nominal pris en charge sans conflit. L'option D est fausse car dbt ne supprime pas spontanément les tables existantes de l'utilisateur.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "defer-clone",
    "difficulty": "difficile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/defer#favor-state",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q123",
    "statement": "Quelle configuration déclarative introduite dans les versions récentes de dbt simplifie la gestion des privilèges d'accès utilisateur (RBAC) directement dans les fichiers de modèles ou dbt_project.yml ?",
    "type": "single",
    "options": [
      "A) Le bloc grants: associant des privilèges (select, update) à des rôles de base de données",
      "B) L'utilisation obligatoire de post-hooks SQL avec ALTER USER",
      "C) Le module security: users: dans profiles.yml",
      "D) Le fichier rbac.yml à la racine"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la fonctionnalité native grants: permet de déclarer sous forme de dictionnaire YAML les droits (ex: select: ['analyst_role']) appliqués automatiquement après la création de l'objet. L'option B est fausse car les post-hooks manuels étaient l'ancienne méthode désormais remplacée avantageusement par grants:. L'option C est fausse car profiles.yml ne contient pas de déclarations de privilèges d'accès par modèle. L'option D est fausse car rbac.yml n'est pas un fichier reconnu par le framework dbt.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "hooks-grants",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/resource-configs/grants",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q124",
    "statement": "Quelle est la différence entre un post-hook de modèle et un on-run-end hook dans un projet dbt ?",
    "type": "single",
    "options": [
      "A) Le post-hook s'exécute immédiatement après la matérialisation d'un modèle spécifique, tandis que on-run-end s'exécute une seule fois à la fin de toute la commande dbt",
      "B) Le post-hook tourne en local, on-run-end tourne sur Snowflake",
      "C) Le post-hook ne supporte pas de code SQL",
      "D) on-run-end ne s'exécute que si tous les modèles ont réussi"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les pre/post-hooks s'exécutent au niveau de chaque nœud individuel, tandis que on-run-start et on-run-end encadrent la session globale dbt run. L'option B est fausse car les deux types de hooks soumettent du SQL directement à l'entrepôt de données distant. L'option C est fausse car les post-hooks exécutent des requêtes SQL pures ou des macros Jinja. L'option D est fausse car on-run-end s'exécute toujours à la fin de la commande, quel que soit le succès ou l'échec des modèles.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "hooks-grants",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/hooks-operations",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q125",
    "statement": "Pour exécuter une requête d'audit ou de notification SQL à chaque démarrage d'une commande dbt run avant le premier modèle, quel hook doit être configuré dans dbt_project.yml ?",
    "type": "single",
    "options": [
      "A) on-run-start",
      "B) pre-hook",
      "C) on-init",
      "D) start-hook"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la directive on-run-start dans dbt_project.yml permet de définir des instructions exécutées au tout début du run global avant le lancement des transformations. L'option B est fausse car pre-hook s'exécuterait avant chaque modèle individuel et non une seule fois au début du job. L'option C est fausse car on-init n'est pas une clé valide de hook dans dbt. L'option D est fausse car start-hook n'existe pas dans la syntaxe dbt.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "hooks-grants",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/hooks-operations",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q126",
    "statement": "Où peut-on définir des post-hooks pour qu'ils s'appliquent automatiquement à l'ensemble des modèles situés dans le dossier models/marts/ ?",
    "type": "single",
    "options": [
      "A) Dans dbt_project.yml sous models: mon_projet: marts: +post-hook:",
      "B) Dans ~/.dbt/profiles.yml sous outputs: marts:",
      "C) Dans un fichier README.md placé dans models/marts/",
      "D) Dans target/manifest.json sous hooks:"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dans dbt_project.yml, l'arborescence des dossiers sous la clé models: permet d'appliquer des configurations hiérarchiques avec le préfixe + (ex: +post-hook:). L'option B est fausse car profiles.yml ne stocke pas de logique de hooks de modèles. L'option C est fausse car les fichiers Markdown ne configurent pas l'exécution de code SQL dbt. L'option D est fausse car manifest.json est un fichier en lecture seule généré à la compilation.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "hooks-grants",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/hooks-operations",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q127",
    "statement": "Comment révoquer automatiquement les accès obsolètes lors de la reconstruction d'une table avec la directive grants: ?",
    "type": "single",
    "options": [
      "A) dbt applique automatiquement une révocation des privilèges non listés dans le bloc grants: pour synchroniser les droits exacts avec le YAML",
      "B) Il faut écrire manuellement une instruction REVOKE ALL dans un pre-hook",
      "C) Il faut supprimer le compte utilisateur de la base de données",
      "D) dbt ne gère jamais la révocation de droits"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt compare les grants actuels de la table avec ceux déclarés dans le fichier YAML et applique les instructions GRANT et REVOKE nécessaires pour correspondre fidèlement à la définition. L'option B est fausse car l'intérêt de la fonctionnalité native grants: est justement d'éviter de devoir rédiger des instructions REVOKE manuelles dans des hooks. L'option C est fausse car supprimer l'utilisateur est destructeur et sans rapport avec la gestion des droits de table. L'option D est fausse car dbt supporte nativement la révocation dans son cycle de synchronisation des grants.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "hooks-grants",
    "difficulty": "difficile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/resource-configs/grants#how-grants-work",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q128",
    "statement": "Quel objet Jinja est mis à disposition dans les hooks on-run-end pour analyser le statut final et les temps d'exécution des modèles du run ?",
    "type": "single",
    "options": [
      "A) results",
      "B) run_status",
      "C) job_summary",
      "D) executed_nodes"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'objet results est une liste de RunResult exposée dans le contexte Jinja de on-run-end, permettant d'inspecter les statuts, messages d'erreurs et durées de chaque modèle. L'option B est fausse car run_status n'est pas le nom de la variable d'exécution de fin. L'option C est fausse car job_summary n'existe pas dans le contexte dbt. L'option D est fausse car executed_nodes n'est pas l'identifiant standard de cet objet.",
    "domain": "Section 4 : Deployment and orchestration",
    "topic_id": "hooks-grants",
    "difficulty": "difficile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/hooks-operations#on-run-end-context",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  }
];
export const dbtQuestionsS5 = [
  {
    "id": "dbt-q129",
    "statement": "Dans quel fichier déclare-t-on les packages externes open source (comme dbt-labs/dbt_utils) à importer dans un projet dbt ?",
    "type": "single",
    "options": [
      "A) packages.yml (ou dependencies.yml) à la racine du projet",
      "B) dbt_project.yml sous la clé import_plugins:",
      "C) profiles.yml sous la clé external_modules:",
      "D) requirements.txt dans models/"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les dépendances de packages dbt sont déclarées dans le fichier packages.yml (ou dependencies.yml) situé à la racine du projet dbt. L'option B est fausse car dbt_project.yml configure le projet lui-même et non la liste des packages distants à installer. L'option C est fausse car profiles.yml gère les connexions aux entrepôts et non les bibliothèques dbt. L'option D est fausse car requirements.txt est réservé aux dépendances de packages Python et non aux packages dbt Jinja/SQL.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "packages",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/packages",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q130",
    "statement": "Quelle commande en ligne télécharge et installe les packages définis dans packages.yml dans le répertoire local dbt_packages/ ?",
    "type": "single",
    "options": [
      "A) dbt deps",
      "B) dbt install",
      "C) dbt get-packages",
      "D) dbt download"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la commande officielle de gestion des dépendances dans dbt est dbt deps. L'option B est fausse car dbt install n'est pas une commande reconnue de la CLI dbt. L'option C est fausse car dbt get-packages n'existe pas dans le catalogue de commandes. L'option D est fausse car dbt download n'est pas supporté.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "packages",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/deps",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q131",
    "statement": "Que fait la commande dbt clean lorsqu'elle est exécutée à la racine d'un projet dbt ?",
    "type": "single",
    "options": [
      "A) Elle supprime les dossiers d'artefacts temporaires spécifiés dans clean-targets (par défaut target/ et dbt_packages/)",
      "B) Elle vide toutes les tables de la base de données Snowflake",
      "C) Elle reformate le code SQL selon les règles de style",
      "D) Elle supprime l'historique des commits Git locaux"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt clean nettoie l'environnement local en effaçant les dossiers définis dans clean-targets (typiquement target/ et dbt_packages/) pour repartir d'un état propre. L'option B est fausse car dbt clean ne supprime aucune donnée ni table dans l'entrepôt distant. L'option C est fausse car le formatage de code relève d'outils comme SQLFluff et non de dbt clean. L'option D est fausse car Git n'est pas impacté par dbt clean.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "packages",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/clean",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q132",
    "statement": "Comment épingler de manière sécurisée la version d'un package dbt dans packages.yml pour éviter des ruptures de compatibilité inattendues ?",
    "type": "single",
    "options": [
      "A) En renseignant le champ version: avec un numéro de version sémantique précis ou une plage compatible (ex: '1.2.0' ou '[>=1.2.0, <1.3.0]')",
      "B) En omettant la clé version pour toujours avoir la dernière version bêta",
      "C) En copiant le code du package à la main dans le dossier models/",
      "D) En verrouillant le fichier profiles.yml en lecture seule"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car spécifier une version exacte ou une contrainte de version sémantique protège le projet contre les changements d'API cassants lors d'un dbt deps. L'option B est fausse car omettre la version expose le pipeline aux risques de régressions lors des mises à jour majeures du package. L'option C est fausse car copier manuellement le code du package crée de la dette technique et empêche toute mise à jour sécurisée. L'option D est fausse car profiles.yml ne contrôle pas les versions des packages dbt.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "packages",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/packages#package-versions",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q133",
    "statement": "Quelle macro issue du package officiel dbt-labs/dbt_utils est couramment utilisée pour générer une clé de substitution (surrogate key) hachée à partir de plusieurs colonnes ?",
    "type": "single",
    "options": [
      "A) dbt_utils.generate_surrogate_key(['col1', 'col2'])",
      "B) dbt_utils.hash_key('col1', 'col2')",
      "C) dbt_utils.create_uuid('col1')",
      "D) dbt_utils.primary_hash(col1 + col2)"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car generate_surrogate_key prend une liste de colonnes et applique un hachage MD5 standardisé gérant nativement les valeurs nulles et les séparateurs. L'option B est fausse car hash_key n'est pas le nom de la macro officielle dans dbt_utils. L'option C est fausse car create_uuid ne crée pas de hachage déterministe sur un ensemble de colonnes. L'option D est fausse car primary_hash n'existe pas dans le package dbt_utils.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "packages",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://hub.getdbt.com/dbt-labs/dbt_utils/latest/",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q134",
    "statement": "Si un projet dbt contient une macro personnalisée locale portant exactement le même nom qu'une macro fournie par un package installé, quelle implémentation sera prioritaire par défaut lors de la compilation ?",
    "type": "single",
    "options": [
      "A) La macro personnalisée définie localement dans le dossier macros/ du projet racine",
      "B) La macro du package externe situé dans dbt_packages/",
      "C) dbt lève une erreur de collision de noms fatale",
      "D) Le choix est fait aléatoirement à chaque compilation"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dans la résolution dbt, les macros définies dans le projet racine ont la priorité la plus haute et surchargent les macros de même nom issues des packages tiers. L'option B est fausse car les packages externes ont une priorité inférieure à celle du projet principal. L'option C est fausse car dbt supporte la surcharge intentionnelle de macros sans générer d'erreur de collision. L'option D est fausse car la résolution dbt est parfaitement déterministe et n'a rien d'aléatoire.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "packages",
    "difficulty": "difficile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/jinja-macros#overriding-package-macros",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q135",
    "statement": "Quel paramètre obligatoire d'un modèle incrémental configuré avec incremental_strategy='microbatch' indique la colonne contenant l'horodatage de l'événement ?",
    "type": "single",
    "options": [
      "A) event_time",
      "B) timestamp_column",
      "C) date_part",
      "D) batch_key"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la directive event_time est obligatoirement requise pour indiquer à dbt la colonne temporelle servant à découper les micro-lots. L'option B est fausse car timestamp_column n'est pas le nom du paramètre dans la spécification microbatch. L'option C est fausse car date_part n'est pas le paramètre officiel. L'option D est fausse car batch_key n'est pas une clé de configuration valide.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "incremental-microbatch",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/incremental-microbatch#configuring-microbatch",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q136",
    "statement": "Quelles sont les valeurs courantes admises pour le paramètre batch_size dans un modèle incrémental microbatch ?",
    "type": "single",
    "options": [
      "A) 'hour' ou 'day'",
      "B) '1000_rows' ou '5000_rows'",
      "C) '10MB' ou '100MB'",
      "D) 'fast' ou 'slow'"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car batch_size définit la granularité temporelle de découpage des lots, typiquement configurée sur 'hour', 'day' ou 'month'. L'option B est fausse car microbatch partitionne par intervalles temporels calendaires et non par nombre fixe de lignes. L'option C est fausse car la taille en mégaoctets n'est pas une unité temporelle acceptée par batch_size. L'option D est fausse car fast et slow ne sont pas des paramètres dbt valides.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "incremental-microbatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/incremental-microbatch#batch_size",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q137",
    "statement": "Comment déclencher un recalcul ciblé (backfill) d'une période passée spécifique (du 1er au 10 octobre 2026) sur un modèle incrémental microbatch sans recharger tout l'historique ?",
    "type": "single",
    "options": [
      "A) dbt retry --start '2026-10-01' --end '2026-10-10' ou via des variables de plages d'exécution microbatch",
      "B) dbt run --full-refresh obligatoire",
      "C) En supprimant manuellement les lignes de la table avec un DELETE SQL",
      "D) Ce recalcul ciblé est impossible dans dbt Core"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la stratégie microbatch a été expressément conçue pour permettre le rejeu d'intervalles de dates spécifiques sans reconstruction complète. L'option B est fausse car le full-refresh effacerait tout l'historique au lieu de recalculer seulement 10 jours. L'option C est fausse car l'exécution manuelle d'un DELETE détruit la cohérence gérée par dbt. L'option D est fausse car dbt Core 1.9+ intègre nativement la gestion des backfills microbatch.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "incremental-microbatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q138",
    "statement": "Pourquoi la stratégie microbatch est-elle particulièrement adaptée aux pipelines d'ingestion de logs de clics ou de télémétrie IoT ?",
    "type": "single",
    "options": [
      "A) Parce que ces flux massifs arrivent de manière continue et ordonnée dans le temps, permettant un traitement incrémental étanche tranche par tranche",
      "B) Parce qu'elle empêche tout doublon sans nécessiter de clé unique",
      "C) Parce qu'elle transforme les données en fichiers CSV locaux",
      "D) Parce qu'elle ne nécessite aucune connexion réseau"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les données de séries temporelles se prêtent parfaitement au fenêtrage temporel indépendant qui garantit des coûts prévisibles et des reprises facilitées. L'option B est fausse car une unique_key reste nécessaire si des mises à jour rétroactives surviennent dans les fenêtres. L'option C est fausse car microbatch s'exécute sur l'entrepôt cloud et ne crée pas de fichiers CSV locaux. L'option D est fausse car une connexion à l'entrepôt est indispensable pour exécuter les modèles.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "incremental-microbatch",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q139",
    "statement": "Dans quel scénario le flag CLI --empty s'avère-t-il le plus utile lors du cycle de développement ou de CI ?",
    "type": "single",
    "options": [
      "A) Pour vérifier que la syntaxe SQL compile, que les adaptateurs fonctionnent et créer les relations physiques vides sans scanner de téraoctets de données payantes",
      "B) Pour supprimer toutes les tables de la base",
      "C) Pour tester la performance maximale en charge de Snowflake",
      "D) Pour exporter le projet sous forme d'archive zip"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car --empty permet de tester l'intégration de bout en bout de la structure de table et de la compilation sans encourir de frais de numérisation de gros volumes. L'option B est fausse car --empty ne supprime aucune table existante non ciblée. L'option C est fausse car tester sans données (0 ligne) ne permet pas de mesurer la performance en charge. L'option D est fausse car dbt ne crée pas d'archive zip via l'option --empty.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "empty-sample",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/run#run-empty-models",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q140",
    "statement": "Que fait concrètement dbt lorsqu'un modèle est exécuté avec l'option dbt run --empty ?",
    "type": "single",
    "options": [
      "A) Il injecte automatiquement une clause WHERE false (ou 1=0) dans les relations sources et modèles pour limiter le résultat à 0 enregistrement",
      "B) Il commente toutes les lignes du fichier SQL",
      "C) Il exécute un TRUNCATE TABLE sur la table de production",
      "D) Il simule une exécution en mémoire sans envoyer de requête SQL"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt interpole un prédicat toujours faux (WHERE false) qui force l'entrepôt à renvoyer zéro ligne tout en validant le schéma et en créant l'objet. L'option B est fausse car dbt ne modifie pas les fichiers sources physiques. L'option C est fausse car dbt ne tronque pas la table de production. L'option D est fausse car une vraie requête DDL/SELECT est bien soumise au moteur SQL distant.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "empty-sample",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/run#run-empty-models",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q141",
    "statement": "Pour valider rapidement la cohérence des jointures d'un modèle fct_ventes sur les 3 derniers jours de données sans traiter l'ensemble des 5 années d'historique, quelle commande utilise-t-on ?",
    "type": "single",
    "options": [
      "A) dbt run --select fct_ventes --sample 3d",
      "B) dbt run --select fct_ventes --days 3",
      "C) dbt run --select fct_ventes --quick",
      "D) dbt run --select fct_ventes --subset 3"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'option --sample 3d restreint la portée de lecture aux 3 derniers jours pour les modèles configurés pour supporter le fenêtrage d'échantillonnage. L'option B est fausse car --days n'est pas un paramètre supporté par dbt. L'option C est fausse car --quick n'existe pas dans la CLI. L'option D est fausse car --subset n'est pas une option reconnue.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "empty-sample",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/run#sample-data",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q142",
    "statement": "Quelle est la différence fondamentale entre les options --empty et --sample ?",
    "type": "single",
    "options": [
      "A) --empty retourne strictement 0 ligne (filtre WHERE false) pour valider le schéma, alors que --sample retourne un sous-ensemble réel de lignes sur une fenêtre d'échantillonnage pour tester les calculs",
      "B) --empty est réservé aux tests unitaires, --sample aux seeds",
      "C) --sample supprime la table après l'exécution",
      "D) --empty ne fonctionne que sous Linux"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car --empty teste la conformité structurelle sans aucune donnée ; --sample charge un échantillon représentatif réel pour évaluer la justesse des transformations. L'option B est fausse car les deux flags s'appliquent aux modèles de données et non spécifiquement aux seeds. L'option C est fausse car --sample persiste le résultat échantillonné dans le schéma cible sans supprimer la relation. L'option D est fausse car --empty fonctionne sur tous les systèmes d'exploitation (Windows, macOS, Linux).",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "empty-sample",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/run",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q143",
    "statement": "Quel est le format officiel de l'examen de certification dbt Certified Developer en termes de nombre de questions, de durée allouée et de seuil de réussite ?",
    "type": "single",
    "options": [
      "A) 65 questions, 120 minutes, environ 65 % de bonnes réponses requises",
      "B) 100 questions, 60 minutes, 90 % de réussite",
      "C) 40 questions, 180 minutes, 50 % de réussite",
      "D) 50 questions, 90 minutes, 75 % de réussite"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le standard officiel de l'examen dbt Developer comporte 65 questions pour une durée de 120 minutes (2 heures) avec un seuil de passage établi à environ 65 %. L'option B est fausse car 100 questions en 60 minutes ne laisserait pas le temps d'analyser le code YAML et SQL. L'option C est fausse car 40 questions en 3 heures ne correspond pas au format officiel. L'option D est fausse car ce format ne correspond pas aux spécifications d'examen de dbt Labs.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "nouveautes-examen-2026",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q144",
    "statement": "Quels sujets majeurs introduits dans les versions récentes de dbt Core sont désormais fortement testés dans le programme d'examen 2026 ?",
    "type": "single",
    "options": [
      "A) Les tests unitaires (unit_tests), les contrats de modèles (model contracts), le contrôle d'accès (model access) et la gouvernance multi-projets (dbt Mesh)",
      "B) L'installation de clusters Hadoop MapReduce",
      "C) La programmation d'interfaces graphiques React",
      "D) La configuration matérielle de serveurs de stockage NAS"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le programme moderne 2026 met l'accent sur la robustesse logicielle et la gouvernance d'entreprise : contrats de données, tests unitaires et architecture dbt Mesh. L'option B est fausse car Hadoop MapReduce est une technologie legacy qui n'est pas le cœur de dbt. L'option C est fausse car React est un framework frontend web hors du périmètre de l'analyste de données. L'option D est fausse car la gestion de serveurs NAS physiques ne relève pas de la modélisation analytique dbt.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "nouveautes-examen-2026",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/unit-tests",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q145",
    "statement": "Lors du passage de l'examen dbt en ligne surveillé, quelle stratégie de gestion du temps est la plus efficace face aux questions comportant des blocs de code YAML complexes ?",
    "type": "single",
    "options": [
      "A) Répondre en premier aux questions directes, marquer d'un drapeau (Flag) les questions de code longues ou ambiguës pour y revenir lors d'un second passage en fin d'épreuve",
      "B) Passer 15 minutes sur la première question difficile jusqu'à être certain de la réponse",
      "C) Laisser les questions incertaines sans réponse car les mauvaises réponses coûtent des points négatifs",
      "D) Fermer la fenêtre du navigateur pour suspendre le chronomètre"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car utiliser la fonctionnalité de marquage (Flag for review) permet de sécuriser tous les points rapides avant d'allouer le temps restant à l'analyse détaillée du code YAML. L'option B est fausse car bloquer 15 minutes sur une seule question compromet la complétion des 64 autres questions. L'option C est fausse car il n'y a aucune pénalité de points négatifs pour mauvaise réponse ; il faut impérativement répondre à toutes les questions. L'option D est fausse car fermer le navigateur invalide la session d'examen surveillé et ne suspend pas le temps.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "nouveautes-examen-2026",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q146",
    "statement": "Qu'est-ce qui distingue principalement une question à choix multiple (multiple-response) d'une question à choix unique dans l'interface de l'examen dbt ?",
    "type": "single",
    "options": [
      "A) Les questions à choix multiple utilisent des cases à cocher carrées et précisent explicitement le nombre de réponses attendues (ex: 'Sélectionnez 2 réponses')",
      "B) Les questions à choix multiple permettent de sélectionner toutes les options",
      "C) Les questions à choix multiple sont notées sur 10 points au lieu de 1 point",
      "D) Les questions à choix multiple sont toujours écrites en français"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'interface utilise des boutons radio ronds pour les choix uniques et des cases à cocher carrées pour les choix multiples avec la consigne explicite du nombre de réponses à cocher. L'option B est fausse car cocher toutes les options sans respecter la consigne invalide la réponse. L'option C est fausse car chaque question a la même pondération dans le score final. L'option D est fausse car l'examen officiel dbt est administré en anglais.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "nouveautes-examen-2026",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q147",
    "statement": "Quel est l'objectif premier de la couche sémantique de dbt (dbt Semantic Layer) dans une organisation orientée données ?",
    "type": "single",
    "options": [
      "A) Centraliser la définition des métriques et dimensions métier en un point unique pour garantir des calculs cohérents et identiques dans tous les outils de BI connectés",
      "B) Remplacer l'entrepôt de données Snowflake par une base locale",
      "C) Chiffrer les disques durs des postes clients",
      "D) Générer automatiquement des diapositives PowerPoint"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la couche sémantique permet de définir les métriques métier clés (ex: CA, churn, marge brute) une seule fois dans dbt et de les interroger avec constance via API depuis n'importe quel outil de restitution. L'option B est fausse car la couche sémantique pousse ses requêtes compilées vers Snowflake et ne le remplace pas. L'option C est fausse car le chiffrement matériel n'est pas le rôle de la couche sémantique. L'option D est fausse car dbt ne produit pas nativement de présentations PowerPoint.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "fusion",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-semantic-layer",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q148",
    "statement": "Quel moteur open source dbt Labs a-t-il développé pour propulser les requêtes de la couche sémantique et convertir les métriques YAML en SQL analytique optimisé ?",
    "type": "single",
    "options": [
      "A) MetricFlow",
      "B) SparkSQL",
      "C) PrestoDB",
      "D) CubeJS"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car MetricFlow est le moteur sémantique natif de dbt convertissant les définitions déclaratives de métriques en requêtes SQL adaptées à l'entrepôt cible. L'option B est fausse car SparkSQL est le moteur de requête d'Apache Spark. L'option C est fausse car PrestoDB est un moteur de requête distribué distinct. L'option D est fausse car CubeJS est un projet open source concurrent indépendant de dbt Labs.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "fusion",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/about-metricflow",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q149",
    "statement": "Dans une modélisation sémantique avec MetricFlow, quelles sont les trois entités conceptuelles fondamentales déclarées dans un modèle sémantique (semantic model) ?",
    "type": "single",
    "options": [
      "A) entities, dimensions, measures",
      "B) tables, columns, rows",
      "C) views, materialized_views, external_tables",
      "D) users, roles, privileges"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car un modèle sémantique dbt est structuré autour des entités (clés de jointure : primary, foreign, unique), des dimensions (attributs qualitatifs et temporels) et des mesures (agrégations numériques : sum, count, avg). L'option B est fausse car tables, columns, rows sont les objets relationnels classiques et non les concepts de la couche sémantique. L'option C est fausse car ce sont des objets de base de données physiques. L'option D est fausse car users, roles, privileges concernent la sécurité et les autorisations.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "fusion",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/semantic-models",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q150",
    "statement": "Quelle capacité de gouvernance visuelle permet d'identifier immédiatement toutes les colonnes en amont qui participent au calcul d'un indicateur clé affiché sur un tableau de bord exécutif ?",
    "type": "single",
    "options": [
      "A) Le lignage au niveau colonne (Column-Level Lineage)",
      "B) La compilation Jinja récursive",
      "C) L'audit de journaux syslog",
      "D) L'analyseur de requêtes EXPLAIN plan"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le lignage au niveau colonne (disponible dans dbt Explorer) trace le cheminement exact de chaque colonne individuelle depuis les sources brutes à travers tous les modèles intermédiaires jusqu'aux exposures finales. L'option B est fausse car la compilation Jinja génère le code SQL mais ne fournit pas d'interface visuelle de lignage colonne. L'option C est fausse car syslog enregistre les événements système de l'OS. L'option D est fausse car EXPLAIN plan détaille le coût d'exécution dans la base mais ne donne pas le graphe sémantique métier.",
    "domain": "Section 5 : Performance, optimization, and project maintenance",
    "topic_id": "fusion",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/collaborate/explore-projects",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  }
];
