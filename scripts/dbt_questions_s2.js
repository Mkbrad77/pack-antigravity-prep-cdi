// Banque de questions officielles et originales pour dbt Section 2 (30 questions)
// Générée et validée le 2026-10-31
export const dbtQuestionsS2 = [
  {
    "id": "dbt-q046",
    "statement": "Un nouvel ingénieur data clone le dépôt du projet et tente d'exécuter dbt run, mais reçoit une erreur indiquant que la cible de base de données est inaccessible. Quelle commande doit-il lancer en priorité pour tester la configuration locale et la connectivité ?",
    "type": "single",
    "options": [
      "A) dbt debug",
      "B) dbt compile",
      "C) dbt test",
      "D) dbt status"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt debug teste la présence et la validité de dbt_project.yml et profiles.yml, les variables d'environnement nécessaires et la connectivité réseau à l'entrepôt. L'option B est fausse car dbt compile valide la syntaxe Jinja et SQL mais ne teste pas de manière exhaustive la configuration réseau du profil. L'option C est fausse car dbt test exécute des tests de données sur des modèles supposés déjà construits, ce qui échouera si la connexion est défaillante. L'option D est fausse car la commande dbt status n'existe pas dans la CLI dbt.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "debogage",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/debug",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q047",
    "statement": "Lors de la compilation d'un projet, dbt renvoie l'erreur fatale 'Found a cycle in the DAG'. Quelle est la cause sous-jacente de ce message d'erreur ?",
    "type": "single",
    "options": [
      "A) Une dépendance circulaire où deux modèles se référencent mutuellement via ref(), directement ou indirectement",
      "B) Une table source introuvable dans le catalogue de données",
      "C) Une variable de projet déclarée deux fois avec des types incompatibles",
      "D) Un test d'unicité ayant détecté des doublons dans une clé primaire"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le DAG dbt étant un graphe sans cycle (acyclique), une référence mutuelle (ex: A appelle B qui appelle A) empêche tout ordre d'exécution et provoque cette erreur. L'option B est fausse car une table manquante génère une erreur de relation inexistante ou de compilation de source, non une erreur de cycle. L'option C est fausse car les doublons de variables écrasent la valeur selon la priorité sans créer de boucle dans le DAG. L'option D est fausse car un test d'unicité en échec produit un FAIL lors de dbt test et ne bloque pas la résolution du DAG à la compilation.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "debogage",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/troubleshooting#cyclic-dependencies",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q048",
    "statement": "Un modèle SQL échoue lors de son exécution dans Snowflake avec une erreur de syntaxe complexe. Où le développeur peut-il récupérer la requête SQL brute exacte générée par dbt (sans code Jinja) pour la tester dans la console Snowflake ?",
    "type": "single",
    "options": [
      "A) Dans le dossier target/compiled/mon_projet/models/...",
      "B) Dans le dossier macros/",
      "C) Dans le fichier dbt_project.yml",
      "D) Dans le dossier seeds/"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le dossier target/compiled/ contient le code SQL pur compilé débarrassé de tout code Jinja, prêt à être copié-collé et exécuté dans la console de l'entrepôt. L'option B est fausse car le dossier macros/ contient uniquement les définitions réutilisables en Jinja et non le code compilé du modèle. L'option C est fausse car dbt_project.yml contient la configuration YAML du projet et aucun code SQL généré. L'option D est fausse car le dossier seeds/ ne stocke que les fichiers de données brutes CSV.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "debogage",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/troubleshooting#inspecting-compiled-sql",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q049",
    "statement": "Pour obtenir des informations de débogage détaillées et afficher l'intégralité des requêtes SQL transmises à l'entrepôt directement dans la sortie console, quel flag global doit être ajouté à la commande dbt ?",
    "type": "single",
    "options": [
      "A) --debug",
      "B) --verbose-all",
      "C) --trace-sql",
      "D) --log-level=high"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le flag global --debug configure le logger au niveau DEBUG et affiche l'intégralité des requêtes, des traces de piles et des temps de réponse. L'option B est fausse car --verbose-all n'est pas un flag reconnu par la CLI dbt. L'option C est fausse car --trace-sql n'existe pas dans dbt. L'option D est fausse car --log-level=high n'est pas la syntaxe valide dans dbt Core.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "debogage",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/global-configs/logs#debug",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q050",
    "statement": "Dans quel fichier dbt consigne-t-il l'ensemble des logs techniques, y compris les erreurs masquées et les requêtes SQL complètes envoyées par les threads en arrière-plan ?",
    "type": "single",
    "options": [
      "A) logs/dbt.log",
      "B) target/manifest.json",
      "C) ~/.dbt/history.log",
      "D) error.log à la racine"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt consigne par défaut l'intégralité de ses traces d'exécution horodatées dans le fichier logs/dbt.log. L'option B est fausse car manifest.json est un artefact d'état du graphe et ne contient pas de journaux d'exécution textuels. L'option C est fausse car ~/.dbt/ stocke la configuration profiles.yml et non les logs d'exécution des projets. L'option D est fausse car dbt n'écrit pas dans un fichier error.log à la racine.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "debogage",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/global-configs/logs",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q051",
    "statement": "Une commande dbt run échoue avec l'erreur 'Compilation Error: env_var: Environment variable 'DBT_WAREHOUSE' was not found'. Quelle est la cause et la meilleure correction pour sécuriser le code ?",
    "type": "single",
    "options": [
      "A) La variable d'environnement n'est pas définie sur la machine hôte ; ajouter une valeur de repli {{ env_var('DBT_WAREHOUSE', 'DEV_WH') }} pour éviter l'échec",
      "B) Le fichier profiles.yml a été corrompu par un encodage non UTF-8 ; supprimer profiles.yml",
      "C) La variable doit obligatoirement être déclarée dans dbt_project.yml sous la clé vars:",
      "D) L'entrepôt Snowflake a été mis en pause automatique par le compte administrateur"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car env_var lève une erreur fatale si la variable système est absente ; fournir un second paramètre par défaut assure un comportement prévisible en dev. L'option B est fausse car l'erreur indique explicitement une variable d'environnement manquante et non un problème d'encodage de fichier. L'option C est fausse car env_var lit les variables de l'OS et n'a pas besoin de déclaration sous la clé vars: de dbt_project.yml. L'option D est fausse car la mise en pause de l'entrepôt n'empêche pas dbt de résoudre ses variables lors de la phase de compilation.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "debogage",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q052",
    "statement": "Un développeur constate qu'un modèle dbt_utils.surrogate_key lève une erreur 'Macro not found'. Quelle étape de dépannage préalable a très probablement été oubliée ?",
    "type": "single",
    "options": [
      "A) Exécuter la commande dbt deps pour télécharger les packages listés dans packages.yml",
      "B) Redémarrer la machine de développement locale",
      "C) Déclarer la macro manuellement dans le fichier profiles.yml",
      "D) Convertir le modèle SQL en modèle Python"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les packages externes comme dbt_utils doivent être téléchargés dans le dossier dbt_packages/ via dbt deps avant de pouvoir utiliser leurs macros. L'option B est fausse car redémarrer l'ordinateur ne télécharge pas les dépendances Git requises. L'option C est fausse car profiles.yml ne sert qu'à la connexion réseau et ne contient pas de macros SQL. L'option D est fausse car la macro surrogate_key fonctionne en SQL pur ; la conversion en Python est hors sujet et non requise.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "debogage",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/packages",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q053",
    "statement": "Quelle est la différence fondamentale entre target/compiled/ et target/run/ lors du débogage d'un problème survenu lors d'un dbt run ?",
    "type": "single",
    "options": [
      "A) target/compiled/ contient le SELECT pur résultant du modèle, tandis que target/run/ contient l'instruction DDL d'encapsulation complète (ex: CREATE TABLE AS ...)",
      "B) target/compiled/ est utilisé uniquement pour les tests, target/run/ pour les seeds",
      "C) target/compiled/ est généré par Python, target/run/ par SQL",
      "D) target/compiled/ contient les erreurs, target/run/ contient les succès"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car target/compiled/ isole la requête analytique pure (SELECT) ; target/run/ montre le code exact exécuté sur l'entrepôt incluant la création de table ou de vue. L'option B est fausse car les deux dossiers couvrent l'ensemble des modèles, tests, snapshots et seeds. L'option C est fausse car les deux dossiers contiennent le SQL généré quel que soit le langage source. L'option D est fausse car les deux dossiers contiennent du code source compilé et non des résultats ou des statuts de run.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "debogage",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/troubleshooting#inspecting-compiled-sql",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q054",
    "statement": "Lors de la compilation d'un modèle contenant des boucles Jinja, dbt renvoie une erreur 'Unexpected end of template'. Quelle omission syntaxique est le plus souvent à l'origine de ce message ?",
    "type": "single",
    "options": [
      "A) L'oubli d'un bloc de clôture tel que {% endfor %} ou {% endif %}",
      "B) L'utilisation de guillemets simples au lieu de guillemets doubles",
      "C) L'absence d'une virgule à la fin de chaque colonne du SELECT",
      "D) Le manque du mot-clé RETURN à la fin du fichier"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le parseur Jinja signale 'unexpected end of template' lorsqu'un bloc de contrôle ouvert ({% for ... %} ou {% if ... %}) n'a pas été refermé par son {% endfor %} ou {% endif %} correspondant. L'option B est fausse car Jinja et SQL acceptent indifféremment les guillemets simples ou doubles selon le contexte. L'option C est fausse car une virgule manquante provoquerait une erreur de syntaxe SQL dans Snowflake mais pas une erreur Jinja de template. L'option D est fausse car les fichiers de modèles SQL dbt ne comportent jamais d'instruction RETURN.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "debogage",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/docs/build/jinja-macros",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q055",
    "statement": "Quelle est l'utilité principale de la commande dbt show introduite dans les versions modernes de dbt Core ?",
    "type": "single",
    "options": [
      "A) Prévisualiser un aperçu tabulaire des données d'un modèle directement dans le terminal sans créer de table ni de vue persistante",
      "B) Afficher le diagramme visuel du DAG dans le navigateur web",
      "C) Lister tous les utilisateurs ayant des droits d'accès sur l'entrepôt",
      "D) Comparer les différences Git de la branche courante"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt show exécute la requête SQL et retourne un tableau des premières lignes directement dans la sortie de commande sans enregistrer d'objet dans la base. L'option B est fausse car le diagramme du DAG est généré par dbt docs generate et visualisé via dbt docs serve. L'option C est fausse car dbt show n'administre pas les privilèges utilisateurs du serveur de base de données. L'option D est fausse car la comparaison Git est gérée par la commande git diff et non par dbt.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "dbt-show",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/show",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q056",
    "statement": "Combien de lignes la commande dbt show affiche-t-elle par défaut si aucun paramètre de limite n'est fourni ?",
    "type": "single",
    "options": [
      "A) 5 lignes",
      "B) 10 lignes",
      "C) 100 lignes",
      "D) 1 ligne"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car par défaut, dbt show restreint l'affichage aux 5 premiers enregistrements retournés par la requête. L'option B est fausse car 10 lignes n'est pas le paramètre par défaut (il faut passer --limit 10). L'option C est fausse car 100 lignes serait trop volumineux pour un affichage propre dans un terminal console. L'option D est fausse car 1 ligne ne permettrait pas d'apprécier la diversité des données.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "dbt-show",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/show#limit",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q057",
    "statement": "Comment tester rapidement une requête SQL ad-hoc contenant des macros Jinja via la commande dbt show sans créer de fichier .sql ?",
    "type": "single",
    "options": [
      "A) dbt show --inline \"select * from {{ ref('stg_orders') }} limit 10\"",
      "B) dbt show --query \"select * from {{ ref('stg_orders') }}\"",
      "C) dbt show --sql \"select * from stg_orders\"",
      "D) dbt run --ad-hoc \"select * from stg_orders\""
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le flag --inline permet de fournir directement une chaîne de requête Jinja/SQL à exécuter et visualiser. L'option B est fausse car --query n'est pas le paramètre reconnu par dbt show. L'option C est fausse car --sql n'est pas le nom de l'option CLI. L'option D est fausse car dbt run ne supporte pas d'option --ad-hoc pour prévisualiser des requêtes.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "dbt-show",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/show#inline",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q058",
    "statement": "Que se passe-t-il au niveau de l'entrepôt de données sous-jacent (ex: Snowflake) lors de l'exécution de dbt show --select mon_modele ?",
    "type": "single",
    "options": [
      "A) dbt exécute une simple requête SELECT avec une clause LIMIT sans exécuter de CREATE ou REPLACE",
      "B) dbt crée une table temporaire globale persistante pendant 24 heures",
      "C) dbt modifie les métadonnées de la table de production",
      "D) Aucun calcul n'est envoyé à l'entrepôt car dbt simule les données en mémoire locale"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt compile la requête et soumet un SELECT direct borné par LIMIT, garantissant une exécution rapide sans impacter le catalogue d'objets. L'option B est fausse car aucune table temporaire n'est persistée dans la base. L'option C est fausse car dbt show ne modifie aucune métadonnée d'aucun schéma. L'option D est fausse car la requête est bel et bien exécutée sur le moteur SQL de l'entrepôt distant.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "dbt-show",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/show",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q059",
    "statement": "Pourquoi la commande dbt show est-elle particulièrement recommandée lors de l'écriture d'une macro complexe ?",
    "type": "single",
    "options": [
      "A) Elle permet d'évaluer immédiatement le rendu SQL et les données retournées par la macro sans avoir à matérialiser un modèle complet",
      "B) Elle vérifie que le code de la macro ne contient aucun tiret cadratin",
      "C) Elle convertit automatiquement la macro SQL en code Python",
      "D) Elle enregistre la macro dans le registre public dbt Hub"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car combinée avec --inline, dbt show permet de tester les cas limites d'une macro en quelques secondes directement en console. L'option B est fausse car dbt show ne sert pas à analyser les caractères typographiques des fichiers. L'option C est fausse car dbt ne traduit pas le code SQL en code Python. L'option D est fausse car la publication sur dbt Hub requiert un processus de packaging distinct et non un simple dbt show.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "dbt-show",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/show",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q060",
    "statement": "Pour afficher précisément 20 lignes au lieu des 5 par défaut lors de la prévisualisation d'un modèle, quel argument doit être ajouté à dbt show ?",
    "type": "single",
    "options": [
      "A) --limit 20",
      "B) --rows 20",
      "C) --top 20",
      "D) -n 20"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'argument officiel de limitation d'affichage de dbt show est --limit suivi du nombre entier souhaité. L'option B est fausse car --rows n'est pas une option supportée. L'option C est fausse car --top n'est pas un paramètre dbt valide. L'option D est fausse car -n n'est pas le raccourci dbt pour la limite d'affichage.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "dbt-show",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/show#limit",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q061",
    "statement": "Un pipeline de transformation comportant 150 modèles s'est arrêté brutalement au 142e modèle en raison d'une faute de frappe dans un nom de colonne. Après avoir corrigé la faute, quelle commande permet de reprendre le traitement au modèle 142 sans recalculer les 141 premiers ?",
    "type": "single",
    "options": [
      "A) dbt retry",
      "B) dbt run --continue",
      "C) dbt resume",
      "D) dbt run --from-failure"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt retry inspecte le fichier run_results.json de la commande précédente et relance uniquement les modèles qui ont échoué ou qui ont été ignorés (skipped). L'option B est fausse car --continue n'est pas un paramètre de reprise de dbt run. L'option C est fausse car dbt resume n'existe pas dans la liste des commandes officielles. L'option D est fausse car --from-failure n'est pas une option reconnue de dbt run.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "etat-retry",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/retry",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q062",
    "statement": "Sur quel artefact stocké dans le répertoire target/ la commande dbt retry se base-t-elle pour identifier les modèles à relancer ?",
    "type": "single",
    "options": [
      "A) target/run_results.json",
      "B) target/manifest.json",
      "C) target/catalog.json",
      "D) target/sources.json"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car run_results.json consigne le résultat d'exécution (status: 'error', 'fail', 'skipped') de chaque nœud de la dernière commande. L'option B est fausse car manifest.json décrit la structure statique du projet et non le résultat dynamique d'une exécution particulière. L'option C est fausse car catalog.json contient les métadonnées de colonnes générées par dbt docs generate. L'option D est fausse car sources.json n'est pas un artefact standard généré par dbt.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "etat-retry",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/retry",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q063",
    "statement": "Comment sélectionner pour exécution tous les modèles qui étaient en échec lors de la dernière exécution enregistrée dans un manifest de référence ?",
    "type": "single",
    "options": [
      "A) dbt run --select result:error --state path/to/artifacts",
      "B) dbt run --select failed:true",
      "C) dbt run --errors-only",
      "D) dbt retry --state path/to/artifacts"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le sélecteur de méthode result:error (ou result:fail) combiné avec le flag --state permet de filtrer spécifiquement les modèles en échec d'après les run_results d'état. L'option B est fausse car failed:true n'est pas un sélecteur dbt valide. L'option C est fausse car --errors-only n'existe pas dans la syntaxe de dbt. L'option D est fausse car dbt retry ne prend pas en compte le drapeau --state (il s'applique uniquement à l'exécution locale immédiate).",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "etat-retry",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/state-comparison#result-method",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q064",
    "statement": "Quelle condition parmi les suivantes N'EST PAS considérée comme une modification justifiant la sélection d'un modèle par state:modified ?",
    "type": "single",
    "options": [
      "A) Une simple requête SELECT manuelle exécutée dans Snowflake sur la table cible",
      "B) Une modification du code SQL à l'intérieur du fichier du modèle",
      "C) Un ajout de tag ou de description dans la configuration YAML du modèle",
      "D) La modification du code source d'une macro Jinja appelée directement par le modèle"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt compare uniquement les artefacts manifest.json ; les requêtes ou consultations manuelles effectuées hors de dbt ne modifient pas le manifest. L'option B est fausse car changer le code SQL modifie le hash du modèle et déclenche state:modified. L'option C est fausse car changer la configuration YAML ou les métadonnées modifie le manifest et est détecté par state:modified. L'option D est fausse car si une macro amont change, tous les modèles dépendants sont marqués comme modifiés dans le nouvel état.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "etat-retry",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/state-comparison#modified-method",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q065",
    "statement": "Quel sous-sélecteur permet de cibler uniquement les modèles dont le corps de code SQL a été modifié, en ignorant les changements de commentaires, de tags ou de documentation YAML ?",
    "type": "single",
    "options": [
      "A) state:modified.body",
      "B) state:modified.sql_only",
      "C) state:code_change",
      "D) state:modified.strict"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la méthode fine state:modified.body restreint la détection de modification au code SQL effectif du fichier en ignorant les métadonnées. L'option B est fausse car sql_only n'est pas un qualificateur supporté par dbt. L'option C est fausse car code_change n'est pas une méthode reconnue. L'option D est fausse car strict n'est pas un sous-sélecteur d'état valide.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "etat-retry",
    "difficulty": "difficile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/state-comparison#sub-methods",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q066",
    "statement": "Lorsqu'on utilise dbt retry après un échec, dans quel ordre les modèles sont-ils exécutés ?",
    "type": "single",
    "options": [
      "A) Dans l'ordre topologique défini par le DAG pour respecter les dépendances parent-enfant",
      "B) Par ordre alphabétique des noms de fichiers",
      "C) Tous les modèles sont lancés simultanément sans ordonnancement",
      "D) Dans l'ordre inverse de l'échec initial"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt retry conserve l'ordonnancement topologique strict du DAG pour garantir que les modèles amont réussissent avant leurs dépendances en aval. L'option B est fausse car l'ordre alphabétique briserait les clés étrangères et dépendances entre tables. L'option C est fausse car dbt respecte la concurrence configurée par threads mais maintient les dépendances du graphe. L'option D est fausse car l'ordre inverse exécuterait les tables filles avant leurs tables mères, provoquant des erreurs relationnelles.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "etat-retry",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/retry",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q067",
    "statement": "Que se passe-t-il si un développeur lance dbt retry alors que la commande précédente s'est terminée avec un succès total (aucun échec ni test raté) ?",
    "type": "single",
    "options": [
      "A) dbt indique qu'aucun nœud n'est éligible pour un retry et termine sans rien exécuter",
      "B) dbt relance l'intégralité du projet depuis le début",
      "C) dbt supprime le dossier target/",
      "D) dbt lève une erreur système interrompant le terminal"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car run_results.json ne contenant aucun nœud en statut error ou fail, dbt retry détecte qu'il n'y a rien à rejouer et termine proprement. L'option B est fausse car dbt ne déclenche pas de relance complète imprévue en cas de succès antérieur. L'option C est fausse car target/ est préservé et n'est pas effacé. L'option D est fausse car ce n'est pas une erreur critique du terminal mais un simple message informatif de dbt.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "etat-retry",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/retry",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q068",
    "statement": "Quel fichier artefact est indispensable de fournir via le flag --state pour pouvoir comparer le projet actuel avec une version de référence ?",
    "type": "single",
    "options": [
      "A) manifest.json",
      "B) catalog.json",
      "C) schema.json",
      "D) graph.json"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le fichier manifest.json contient la représentation exhaustive du graphe de dépendances et de la configuration nécessaire à la comparaison d'état. L'option B est fausse car catalog.json est optionnel et sert uniquement à documenter les types de colonnes de l'entrepôt. L'option C est fausse car schema.json n'est pas un artefact généré par dbt. L'option D est fausse car graph.json n'est pas le nom de fichier utilisé par dbt pour l'état.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "etat-retry",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/state-comparison",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q069",
    "statement": "Quelle syntaxe de sélection permet d'exécuter le modèle fct_commandes ainsi que TOUS ses modèles parents (en amont dans le DAG) ?",
    "type": "single",
    "options": [
      "A) dbt run --select +fct_commandes",
      "B) dbt run --select fct_commandes+",
      "C) dbt run --select @fct_commandes",
      "D) dbt run --select *fct_commandes"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le signe plus placé avant le nom (+modele) indique à dbt de remonter le graphe pour exécuter le modèle et tous ses ancêtres en amont. L'option B est fausse car le signe plus placé après le nom (modele+) sélectionne le modèle et tous ses descendants en aval. L'option C est fausse car l'arobase (@modele) sélectionne le modèle, ses descendants et tous les ancêtres de ces descendants. L'option D est fausse car l'astérisque n'est pas le préfixe d'ascendance dans la syntaxe de sélection dbt.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "commandes-selecteurs",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q070",
    "statement": "Que sélectionne l'opérateur @ dans la commande dbt run --select @stg_utilisateurs ?",
    "type": "single",
    "options": [
      "A) Le modèle stg_utilisateurs, tous ses descendants en aval, ainsi que tous les ancêtres de ses descendants nécessaires à leur calcul",
      "B) Uniquement les modèles contenant le mot 'utilisateurs' dans leur nom",
      "C) Le modèle et uniquement ses parents directs de premier niveau",
      "D) Tous les tests associés au modèle stg_utilisateurs"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'opérateur @ (at operator) capture le modèle cible, tous ses enfants et tous les parents nécessaires pour construire ces enfants de manière autonome. L'option B est fausse car la sélection par nom textuel utilise des sélecteurs de chaîne et non l'arobase. L'option C est fausse car les parents directs de premier niveau s'expriment avec 1+stg_utilisateurs. L'option D est fausse car les tests sont exécutés par dbt test ou dbt build, pas spécifiquement ciblés par @ sur un dbt run.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "commandes-selecteurs",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/graph-operators#the-at-operator",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q071",
    "statement": "Quelle commande permet d'exécuter tous les modèles étiquetés avec le tag 'finance' SAUF le modèle spécifique 'fct_bilan_annuel' ?",
    "type": "single",
    "options": [
      "A) dbt run --select tag:finance --exclude fct_bilan_annuel",
      "B) dbt run --select tag:finance -not fct_bilan_annuel",
      "C) dbt run --select tag:finance ^fct_bilan_annuel",
      "D) dbt run --filter finance --skip fct_bilan_annuel"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la combinaison de --select (avec le sélecteur de tag tag:finance) et de --exclude permet d'exclure un modèle précis du sous-ensemble. L'option B est fausse car -not n'est pas un argument reconnu par la CLI dbt. L'option C est fausse car l'accent circonflexe n'est pas l'opérateur d'exclusion de dbt. L'option D est fausse car --filter et --skip ne sont pas des options de la commande dbt run.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "commandes-selecteurs",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/syntax#exclude-syntax",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q072",
    "statement": "Pour limiter l'exécution aux enfants directs (degré 1 uniquement en aval) d'un modèle sans aller chercher toute la chaîne dépendante, quelle syntaxe utilise-t-on ?",
    "type": "single",
    "options": [
      "A) dbt run --select mon_modele+1",
      "B) dbt run --select mon_modele++",
      "C) dbt run --select mon_modele.children",
      "D) dbt run --select mon_modele:depth(1)"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car ajouter un entier N après le signe plus (ex: modele+1) restreint l'expansion du graphe à N niveaux de dépendance. L'option B est fausse car la notation ++ n'est pas supportée dans la syntaxe des sélecteurs de graphe dbt. L'option C est fausse car .children n'est pas une méthode de sélection native dans la CLI dbt. L'option D est fausse car :depth(1) n'est pas la syntaxe standard dbt (la convention est +N ou N+).",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "commandes-selecteurs",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/graph-operators#graph-operators",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q073",
    "statement": "Où peut-on centraliser et nommer des règles de sélection complexes (par exemple réunir plusieurs tags et exclusions) pour les réutiliser facilement dans les commandes dbt ?",
    "type": "single",
    "options": [
      "A) Dans un fichier selectors.yml à la racine du projet",
      "B) Dans le fichier profiles.yml sous la clé shortcuts:",
      "C) Dans un script Bash externe obligatoirement",
      "D) Dans target/selectors.json"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le fichier officiel selectors.yml permet de définir des sélecteurs YAML nommés invocables ensuite via dbt run --selector nom_selecteur. L'option B est fausse car profiles.yml gère uniquement les connexions et ne définit pas de sélecteurs de modèles. L'option C est fausse car dbt intègre nativement cette fonctionnalité via selectors.yml sans dépendance à un script shell. L'option D est fausse car target/ est un dossier de compilation généré et non le lieu de définition des sélecteurs.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "commandes-selecteurs",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/yaml-selectors",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q074",
    "statement": "Quelle commande permet d'exécuter à la fois les tests, les seeds, les modèles et les snapshots associés au modèle fct_commandes dans un pipeline unifié ?",
    "type": "single",
    "options": [
      "A) dbt build --select fct_commandes",
      "B) dbt run --select fct_commandes --all-resources",
      "C) dbt execute --select fct_commandes",
      "D) dbt pipeline --select fct_commandes"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car dbt build est la commande universelle qui compile et exécute les seeds, modèles, snapshots et tests dans l'ordre strict du DAG. L'option B est fausse car --all-resources n'est pas un flag valide pour dbt run. L'option C est fausse car dbt execute n'existe pas dans le framework. L'option D est fausse car dbt pipeline n'est pas une commande de la CLI dbt.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "commandes-selecteurs",
    "difficulty": "facile",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/commands/build",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dbt-q075",
    "statement": "Que fait la commande dbt test --select source:nom_source+ ?",
    "type": "single",
    "options": [
      "A) Elle exécute les tests définis sur la source nom_source ainsi que tous les tests des modèles en aval de cette source",
      "B) Elle teste la connexion réseau vers la base de données source",
      "C) Elle vérifie uniquement les tests de fraîcheur de la source",
      "D) Elle convertit les tests de source en tests singuliers"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le préfixe source: cible la source brute et le suffixe + propage la sélection à tous les nœuds descendants dans le DAG et à leurs tests associés. L'option B est fausse car tester la connexion réseau est le rôle de dbt debug et non de dbt test. L'option C est fausse car les tests de fraîcheur relèvent de la commande distincte dbt source freshness. L'option D est fausse car dbt ne convertit pas les types de tests lors de l'exécution.",
    "domain": "Section 2 : Debugging data modeling errors",
    "topic_id": "commandes-selecteurs",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.getdbt.com/reference/node-selection/syntax",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  }
];
