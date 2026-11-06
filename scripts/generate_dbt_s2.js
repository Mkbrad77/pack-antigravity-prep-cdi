import fs from 'node:fs';
import path from 'node:path';
import { makeQDomain, cleanEmDashes } from './question_builder.js';

const DOMAIN_S2 = "Section 2 : Debugging data modeling errors";

// 30 questions for Section 2 (dbt-q046 to dbt-q075)
const qData = [
  // debogage (q046 to q054)
  {
    topic: "debogage",
    statement: "Un nouvel ingénieur data clone le dépôt du projet et tente d'exécuter dbt run, mais reçoit une erreur indiquant que la cible de base de données est inaccessible. Quelle commande doit-il lancer en priorité pour tester la configuration locale et la connectivité ?",
    options: [
      "A) dbt debug",
      "B) dbt compile",
      "C) dbt test",
      "D) dbt status"
    ],
    ans: "A",
    expA: "dbt debug teste la présence et la validité de dbt_project.yml et profiles.yml, les variables d'environnement nécessaires et la connectivité réseau à l'entrepôt",
    expB: "dbt compile valide la syntaxe Jinja et SQL mais ne teste pas de manière exhaustive la configuration réseau du profil",
    expC: "dbt test exécute des tests de données sur des modèles supposés déjà construits, ce qui échouera si la connexion est défaillante",
    expD: "la commande dbt status n'existe pas dans la CLI dbt",
    url: "https://docs.getdbt.com/reference/commands/debug",
    diff: "facile"
  },
  {
    topic: "debogage",
    statement: "Lors de la compilation d'un projet, dbt renvoie l'erreur fatale 'Found a cycle in the DAG'. Quelle est la cause sous-jacente de ce message d'erreur ?",
    options: [
      "A) Une dépendance circulaire où deux modèles se référencent mutuellement via ref(), directement ou indirectement",
      "B) Une table source introuvable dans le catalogue de données",
      "C) Une variable de projet déclarée deux fois avec des types incompatibles",
      "D) Un test d'unicité ayant détecté des doublons dans une clé primaire"
    ],
    ans: "A",
    expA: "le DAG dbt étant un graphe sans cycle (acyclique), une référence mutuelle (ex: A appelle B qui appelle A) empêche tout ordre d'exécution et provoque cette erreur",
    expB: "une table manquante génère une erreur de relation inexistante ou de compilation de source, non une erreur de cycle",
    expC: "les doublons de variables écrasent la valeur selon la priorité sans créer de boucle dans le DAG",
    expD: "un test d'unicité en échec produit un FAIL lors de dbt test et ne bloque pas la résolution du DAG à la compilation",
    url: "https://docs.getdbt.com/docs/build/troubleshooting#cyclic-dependencies",
    diff: "facile"
  },
  {
    topic: "debogage",
    statement: "Un modèle SQL échoue lors de son exécution dans Snowflake avec une erreur de syntaxe complexe. Où le développeur peut-il récupérer la requête SQL brute exacte générée par dbt (sans code Jinja) pour la tester dans la console Snowflake ?",
    options: [
      "A) Dans le dossier target/compiled/mon_projet/models/...",
      "B) Dans le dossier macros/",
      "C) Dans le fichier dbt_project.yml",
      "D) Dans le dossier seeds/"
    ],
    ans: "A",
    expA: "le dossier target/compiled/ contient le code SQL pur compilé débarrassé de tout code Jinja, prêt à être copié-collé et exécuté dans la console de l'entrepôt",
    expB: "le dossier macros/ contient uniquement les définitions réutilisables en Jinja et non le code compilé du modèle",
    expC: "dbt_project.yml contient la configuration YAML du projet et aucun code SQL généré",
    expD: "le dossier seeds/ ne stocke que les fichiers de données brutes CSV",
    url: "https://docs.getdbt.com/docs/build/troubleshooting#inspecting-compiled-sql",
    diff: "facile"
  },
  {
    topic: "debogage",
    statement: "Pour obtenir des informations de débogage détaillées et afficher l'intégralité des requêtes SQL transmises à l'entrepôt directement dans la sortie console, quel flag global doit être ajouté à la commande dbt ?",
    options: [
      "A) --debug",
      "B) --verbose-all",
      "C) --trace-sql",
      "D) --log-level=high"
    ],
    ans: "A",
    expA: "le flag global --debug configure le logger au niveau DEBUG et affiche l'intégralité des requêtes, des traces de piles et des temps de réponse",
    expB: "--verbose-all n'est pas un flag reconnu par la CLI dbt",
    expC: "--trace-sql n'existe pas dans dbt",
    expD: "--log-level=high n'est pas la syntaxe valide dans dbt Core",
    url: "https://docs.getdbt.com/reference/global-configs/logs#debug",
    diff: "facile"
  },
  {
    topic: "debogage",
    statement: "Dans quel fichier dbt consigne-t-il l'ensemble des logs techniques, y compris les erreurs masquées et les requêtes SQL complètes envoyées par les threads en arrière-plan ?",
    options: [
      "A) logs/dbt.log",
      "B) target/manifest.json",
      "C) ~/.dbt/history.log",
      "D) error.log à la racine"
    ],
    ans: "A",
    expA: "dbt consigne par défaut l'intégralité de ses traces d'exécution horodatées dans le fichier logs/dbt.log",
    expB: "manifest.json est un artefact d'état du graphe et ne contient pas de journaux d'exécution textuels",
    expC: "~/.dbt/ stocke la configuration profiles.yml et non les logs d'exécution des projets",
    expD: "dbt n'écrit pas dans un fichier error.log à la racine",
    url: "https://docs.getdbt.com/reference/global-configs/logs",
    diff: "facile"
  },
  {
    topic: "debogage",
    statement: "Une commande dbt run échoue avec l'erreur 'Compilation Error: env_var: Environment variable 'DBT_WAREHOUSE' was not found'. Quelle est la cause et la meilleure correction pour sécuriser le code ?",
    options: [
      "A) La variable d'environnement n'est pas définie sur la machine hôte ; ajouter une valeur de repli {{ env_var('DBT_WAREHOUSE', 'DEV_WH') }} pour éviter l'échec",
      "B) Le fichier profiles.yml a été corrompu par un encodage non UTF-8 ; supprimer profiles.yml",
      "C) La variable doit obligatoirement être déclarée dans dbt_project.yml sous la clé vars:",
      "D) L'entrepôt Snowflake a été mis en pause automatique par le compte administrateur"
    ],
    ans: "A",
    expA: "env_var lève une erreur fatale si la variable système est absente ; fournir un second paramètre par défaut assure un comportement prévisible en dev",
    expB: "l'erreur indique explicitement une variable d'environnement manquante et non un problème d'encodage de fichier",
    expC: "env_var lit les variables de l'OS et n'a pas besoin de déclaration sous la clé vars: de dbt_project.yml",
    expD: "la mise en pause de l'entrepôt n'empêche pas dbt de résoudre ses variables lors de la phase de compilation",
    url: "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    diff: "moyen"
  },
  {
    topic: "debogage",
    statement: "Un développeur constate qu'un modèle dbt_utils.surrogate_key lève une erreur 'Macro not found'. Quelle étape de dépannage préalable a très probablement été oubliée ?",
    options: [
      "A) Exécuter la commande dbt deps pour télécharger les packages listés dans packages.yml",
      "B) Redémarrer la machine de développement locale",
      "C) Déclarer la macro manuellement dans le fichier profiles.yml",
      "D) Convertir le modèle SQL en modèle Python"
    ],
    ans: "A",
    expA: "les packages externes comme dbt_utils doivent être téléchargés dans le dossier dbt_packages/ via dbt deps avant de pouvoir utiliser leurs macros",
    expB: "redémarrer l'ordinateur ne télécharge pas les dépendances Git requises",
    expC: "profiles.yml ne sert qu'à la connexion réseau et ne contient pas de macros SQL",
    expD: "la macro surrogate_key fonctionne en SQL pur ; la conversion en Python est hors sujet et non requise",
    url: "https://docs.getdbt.com/docs/build/packages",
    diff: "facile"
  },
  {
    topic: "debogage",
    statement: "Quelle est la différence fondamentale entre target/compiled/ et target/run/ lors du débogage d'un problème survenu lors d'un dbt run ?",
    options: [
      "A) target/compiled/ contient le SELECT pur résultant du modèle, tandis que target/run/ contient l'instruction DDL d'encapsulation complète (ex: CREATE TABLE AS ...)",
      "B) target/compiled/ est utilisé uniquement pour les tests, target/run/ pour les seeds",
      "C) target/compiled/ est généré par Python, target/run/ par SQL",
      "D) target/compiled/ contient les erreurs, target/run/ contient les succès"
    ],
    ans: "A",
    expA: "target/compiled/ isole la requête analytique pure (SELECT) ; target/run/ montre le code exact exécuté sur l'entrepôt incluant la création de table ou de vue",
    expB: "les deux dossiers couvrent l'ensemble des modèles, tests, snapshots et seeds",
    expC: "les deux dossiers contiennent le SQL généré quel que soit le langage source",
    expD: "les deux dossiers contiennent du code source compilé et non des résultats ou des statuts de run",
    url: "https://docs.getdbt.com/docs/build/troubleshooting#inspecting-compiled-sql",
    diff: "moyen"
  },
  {
    topic: "debogage",
    statement: "Lors de la compilation d'un modèle contenant des boucles Jinja, dbt renvoie une erreur 'Unexpected end of template'. Quelle omission syntaxique est le plus souvent à l'origine de ce message ?",
    options: [
      "A) L'oubli d'un bloc de clôture tel que {% endfor %} ou {% endif %}",
      "B) L'utilisation de guillemets simples au lieu de guillemets doubles",
      "C) L'absence d'une virgule à la fin de chaque colonne du SELECT",
      "D) Le manque du mot-clé RETURN à la fin du fichier"
    ],
    ans: "A",
    expA: "le parseur Jinja signale 'unexpected end of template' lorsqu'un bloc de contrôle ouvert ({% for ... %} ou {% if ... %}) n'a pas été refermé par son {% endfor %} ou {% endif %} correspondant",
    expB: "Jinja et SQL acceptent indifféremment les guillemets simples ou doubles selon le contexte",
    expC: "une virgule manquante provoquerait une erreur de syntaxe SQL dans Snowflake mais pas une erreur Jinja de template",
    expD: "les fichiers de modèles SQL dbt ne comportent jamais d'instruction RETURN",
    url: "https://docs.getdbt.com/docs/build/jinja-macros",
    diff: "facile"
  },

  // dbt-show (q055 to q060)
  {
    topic: "dbt-show",
    statement: "Quelle est l'utilité principale de la commande dbt show introduite dans les versions modernes de dbt Core ?",
    options: [
      "A) Prévisualiser un aperçu tabulaire des données d'un modèle directement dans le terminal sans créer de table ni de vue persistante",
      "B) Afficher le diagramme visuel du DAG dans le navigateur web",
      "C) Lister tous les utilisateurs ayant des droits d'accès sur l'entrepôt",
      "D) Comparer les différences Git de la branche courante"
    ],
    ans: "A",
    expA: "dbt show exécute la requête SQL et retourne un tableau des premières lignes directement dans la sortie de commande sans enregistrer d'objet dans la base",
    expB: "le diagramme du DAG est généré par dbt docs generate et visualisé via dbt docs serve",
    expC: "dbt show n'administre pas les privilèges utilisateurs du serveur de base de données",
    expD: "la comparaison Git est gérée par la commande git diff et non par dbt",
    url: "https://docs.getdbt.com/reference/commands/show",
    diff: "facile"
  },
  {
    topic: "dbt-show",
    statement: "Combien de lignes la commande dbt show affiche-t-elle par défaut si aucun paramètre de limite n'est fourni ?",
    options: [
      "A) 5 lignes",
      "B) 10 lignes",
      "C) 100 lignes",
      "D) 1 ligne"
    ],
    ans: "A",
    expA: "par défaut, dbt show restreint l'affichage aux 5 premiers enregistrements retournés par la requête",
    expB: "10 lignes n'est pas le paramètre par défaut (il faut passer --limit 10)",
    expC: "100 lignes serait trop volumineux pour un affichage propre dans un terminal console",
    expD: "1 ligne ne permettrait pas d'apprécier la diversité des données",
    url: "https://docs.getdbt.com/reference/commands/show#limit",
    diff: "facile"
  },
  {
    topic: "dbt-show",
    statement: "Comment tester rapidement une requête SQL ad-hoc contenant des macros Jinja via la commande dbt show sans créer de fichier .sql ?",
    options: [
      "A) dbt show --inline \"select * from {{ ref('stg_orders') }} limit 10\"",
      "B) dbt show --query \"select * from {{ ref('stg_orders') }}\"",
      "C) dbt show --sql \"select * from stg_orders\"",
      "D) dbt run --ad-hoc \"select * from stg_orders\""
    ],
    ans: "A",
    expA: "le flag --inline permet de fournir directement une chaîne de requête Jinja/SQL à exécuter et visualiser",
    expB: "--query n'est pas le paramètre reconnu par dbt show",
    expC: "--sql n'est pas le nom de l'option CLI",
    expD: "dbt run ne supporte pas d'option --ad-hoc pour prévisualiser des requêtes",
    url: "https://docs.getdbt.com/reference/commands/show#inline",
    diff: "moyen"
  },
  {
    topic: "dbt-show",
    statement: "Que se passe-t-il au niveau de l'entrepôt de données sous-jacent (ex: Snowflake) lors de l'exécution de dbt show --select mon_modele ?",
    options: [
      "A) dbt exécute une simple requête SELECT avec une clause LIMIT sans exécuter de CREATE ou REPLACE",
      "B) dbt crée une table temporaire globale persistante pendant 24 heures",
      "C) dbt modifie les métadonnées de la table de production",
      "D) Aucun calcul n'est envoyé à l'entrepôt car dbt simule les données en mémoire locale"
    ],
    ans: "A",
    expA: "dbt compile la requête et soumet un SELECT direct borné par LIMIT, garantissant une exécution rapide sans impacter le catalogue d'objets",
    expB: "aucune table temporaire n'est persistée dans la base",
    expC: "dbt show ne modifie aucune métadonnée d'aucun schéma",
    expD: "la requête est bel et bien exécutée sur le moteur SQL de l'entrepôt distant",
    url: "https://docs.getdbt.com/reference/commands/show",
    diff: "moyen"
  },
  {
    topic: "dbt-show",
    statement: "Pourquoi la commande dbt show est-elle particulièrement recommandée lors de l'écriture d'une macro complexe ?",
    options: [
      "A) Elle permet d'évaluer immédiatement le rendu SQL et les données retournées par la macro sans avoir à matérialiser un modèle complet",
      "B) Elle vérifie que le code de la macro ne contient aucun tiret cadratin",
      "C) Elle convertit automatiquement la macro SQL en code Python",
      "D) Elle enregistre la macro dans le registre public dbt Hub"
    ],
    ans: "A",
    expA: "combinée avec --inline, dbt show permet de tester les cas limites d'une macro en quelques secondes directement en console",
    expB: "dbt show ne sert pas à analyser les caractères typographiques des fichiers",
    expC: "dbt ne traduit pas le code SQL en code Python",
    expD: "la publication sur dbt Hub requiert un processus de packaging distinct et non un simple dbt show",
    url: "https://docs.getdbt.com/reference/commands/show",
    diff: "facile"
  },
  {
    topic: "dbt-show",
    statement: "Pour afficher précisément 20 lignes au lieu des 5 par défaut lors de la prévisualisation d'un modèle, quel argument doit être ajouté à dbt show ?",
    options: [
      "A) --limit 20",
      "B) --rows 20",
      "C) --top 20",
      "D) -n 20"
    ],
    ans: "A",
    expA: "l'argument officiel de limitation d'affichage de dbt show est --limit suivi du nombre entier souhaité",
    expB: "--rows n'est pas une option supportée",
    expC: "--top n'est pas un paramètre dbt valide",
    expD: "-n n'est pas le raccourci dbt pour la limite d'affichage",
    url: "https://docs.getdbt.com/reference/commands/show#limit",
    diff: "facile"
  },

  // etat-retry (q061 to q068)
  {
    topic: "etat-retry",
    statement: "Un pipeline de transformation comportant 150 modèles s'est arrêté brutalement au 142e modèle en raison d'une faute de frappe dans un nom de colonne. Après avoir corrigé la faute, quelle commande permet de reprendre le traitement au modèle 142 sans recalculer les 141 premiers ?",
    options: [
      "A) dbt retry",
      "B) dbt run --continue",
      "C) dbt resume",
      "D) dbt run --from-failure"
    ],
    ans: "A",
    expA: "dbt retry inspecte le fichier run_results.json de la commande précédente et relance uniquement les modèles qui ont échoué ou qui ont été ignorés (skipped)",
    expB: "--continue n'est pas un paramètre de reprise de dbt run",
    expC: "dbt resume n'existe pas dans la liste des commandes officielles",
    expD: "--from-failure n'est pas une option reconnue de dbt run",
    url: "https://docs.getdbt.com/reference/commands/retry",
    diff: "facile"
  },
  {
    topic: "etat-retry",
    statement: "Sur quel artefact stocké dans le répertoire target/ la commande dbt retry se base-t-elle pour identifier les modèles à relancer ?",
    options: [
      "A) target/run_results.json",
      "B) target/manifest.json",
      "C) target/catalog.json",
      "D) target/sources.json"
    ],
    ans: "A",
    expA: "run_results.json consigne le résultat d'exécution (status: 'error', 'fail', 'skipped') de chaque nœud de la dernière commande",
    expB: "manifest.json décrit la structure statique du projet et non le résultat dynamique d'une exécution particulière",
    expC: "catalog.json contient les métadonnées de colonnes générées par dbt docs generate",
    expD: "sources.json n'est pas un artefact standard généré par dbt",
    url: "https://docs.getdbt.com/reference/commands/retry",
    diff: "moyen"
  },
  {
    topic: "etat-retry",
    statement: "Comment sélectionner pour exécution tous les modèles qui étaient en échec lors de la dernière exécution enregistrée dans un manifest de référence ?",
    options: [
      "A) dbt run --select result:error --state path/to/artifacts",
      "B) dbt run --select failed:true",
      "C) dbt run --errors-only",
      "D) dbt retry --state path/to/artifacts"
    ],
    ans: "A",
    expA: "le sélecteur de méthode result:error (ou result:fail) combiné avec le flag --state permet de filtrer spécifiquement les modèles en échec d'après les run_results d'état",
    expB: "failed:true n'est pas un sélecteur dbt valide",
    expC: "--errors-only n'existe pas dans la syntaxe de dbt",
    expD: "dbt retry ne prend pas en compte le drapeau --state (il s'applique uniquement à l'exécution locale immédiate)",
    url: "https://docs.getdbt.com/reference/node-selection/state-comparison#result-method",
    diff: "moyen"
  },
  {
    topic: "etat-retry",
    statement: "Quelle condition parmi les suivantes N'EST PAS considérée comme une modification justifiant la sélection d'un modèle par state:modified ?",
    options: [
      "A) Une simple requête SELECT manuelle exécutée dans Snowflake sur la table cible",
      "B) Une modification du code SQL à l'intérieur du fichier du modèle",
      "C) Un ajout de tag ou de description dans la configuration YAML du modèle",
      "D) La modification du code source d'une macro Jinja appelée directement par le modèle"
    ],
    ans: "A",
    expA: "dbt compare uniquement les artefacts manifest.json ; les requêtes ou consultations manuelles effectuées hors de dbt ne modifient pas le manifest",
    expB: "changer le code SQL modifie le hash du modèle et déclenche state:modified",
    expC: "changer la configuration YAML ou les métadonnées modifie le manifest et est détecté par state:modified",
    expD: "si une macro amont change, tous les modèles dépendants sont marqués comme modifiés dans le nouvel état",
    url: "https://docs.getdbt.com/reference/node-selection/state-comparison#modified-method",
    diff: "moyen"
  },
  {
    topic: "etat-retry",
    statement: "Quel sous-sélecteur permet de cibler uniquement les modèles dont le corps de code SQL a été modifié, en ignorant les changements de commentaires, de tags ou de documentation YAML ?",
    options: [
      "A) state:modified.body",
      "B) state:modified.sql_only",
      "C) state:code_change",
      "D) state:modified.strict"
    ],
    ans: "A",
    expA: "la méthode fine state:modified.body restreint la détection de modification au code SQL effectif du fichier en ignorant les métadonnées",
    expB: "sql_only n'est pas un qualificateur supporté par dbt",
    expC: "code_change n'est pas une méthode reconnue",
    expD: "strict n'est pas un sous-sélecteur d'état valide",
    url: "https://docs.getdbt.com/reference/node-selection/state-comparison#sub-methods",
    diff: "difficile"
  },
  {
    topic: "etat-retry",
    statement: "Lorsqu'on utilise dbt retry après un échec, dans quel ordre les modèles sont-ils exécutés ?",
    options: [
      "A) Dans l'ordre topologique défini par le DAG pour respecter les dépendances parent-enfant",
      "B) Par ordre alphabétique des noms de fichiers",
      "C) Tous les modèles sont lancés simultanément sans ordonnancement",
      "D) Dans l'ordre inverse de l'échec initial"
    ],
    ans: "A",
    expA: "dbt retry conserve l'ordonnancement topologique strict du DAG pour garantir que les modèles amont réussissent avant leurs dépendances en aval",
    expB: "l'ordre alphabétique briserait les clés étrangères et dépendances entre tables",
    expC: "dbt respecte la concurrence configurée par threads mais maintient les dépendances du graphe",
    expD: "l'ordre inverse exécuterait les tables filles avant leurs tables mères, provoquant des erreurs relationnelles",
    url: "https://docs.getdbt.com/reference/commands/retry",
    diff: "facile"
  },
  {
    topic: "etat-retry",
    statement: "Que se passe-t-il si un développeur lance dbt retry alors que la commande précédente s'est terminée avec un succès total (aucun échec ni test raté) ?",
    options: [
      "A) dbt indique qu'aucun nœud n'est éligible pour un retry et termine sans rien exécuter",
      "B) dbt relance l'intégralité du projet depuis le début",
      "C) dbt supprime le dossier target/",
      "D) dbt lève une erreur système interrompant le terminal"
    ],
    ans: "A",
    expA: "run_results.json ne contenant aucun nœud en statut error ou fail, dbt retry détecte qu'il n'y a rien à rejouer et termine proprement",
    expB: "dbt ne déclenche pas de relance complète imprévue en cas de succès antérieur",
    expC: "target/ est préservé et n'est pas effacé",
    expD: "ce n'est pas une erreur critique du terminal mais un simple message informatif de dbt",
    url: "https://docs.getdbt.com/reference/commands/retry",
    diff: "facile"
  },
  {
    topic: "etat-retry",
    statement: "Quel fichier artefact est indispensable de fournir via le flag --state pour pouvoir comparer le projet actuel avec une version de référence ?",
    options: [
      "A) manifest.json",
      "B) catalog.json",
      "C) schema.json",
      "D) graph.json"
    ],
    ans: "A",
    expA: "le fichier manifest.json contient la représentation exhaustive du graphe de dépendances et de la configuration nécessaire à la comparaison d'état",
    expB: "catalog.json est optionnel et sert uniquement à documenter les types de colonnes de l'entrepôt",
    expC: "schema.json n'est pas un artefact généré par dbt",
    expD: "graph.json n'est pas le nom de fichier utilisé par dbt pour l'état",
    url: "https://docs.getdbt.com/reference/node-selection/state-comparison",
    diff: "facile"
  },

  // commandes-selecteurs (q069 to q075)
  {
    topic: "commandes-selecteurs",
    statement: "Quelle syntaxe de sélection permet d'exécuter le modèle fct_commandes ainsi que TOUS ses modèles parents (en amont dans le DAG) ?",
    options: [
      "A) dbt run --select +fct_commandes",
      "B) dbt run --select fct_commandes+",
      "C) dbt run --select @fct_commandes",
      "D) dbt run --select *fct_commandes"
    ],
    ans: "A",
    expA: "le signe plus placé avant le nom (+modele) indique à dbt de remonter le graphe pour exécuter le modèle et tous ses ancêtres en amont",
    expB: "le signe plus placé après le nom (modele+) sélectionne le modèle et tous ses descendants en aval",
    expC: "l'arobase (@modele) sélectionne le modèle, ses descendants et tous les ancêtres de ces descendants",
    expD: "l'astérisque n'est pas le préfixe d'ascendance dans la syntaxe de sélection dbt",
    url: "https://docs.getdbt.com/reference/node-selection/graph-operators",
    diff: "facile"
  },
  {
    topic: "commandes-selecteurs",
    statement: "Que sélectionne l'opérateur @ dans la commande dbt run --select @stg_utilisateurs ?",
    options: [
      "A) Le modèle stg_utilisateurs, tous ses descendants en aval, ainsi que tous les ancêtres de ses descendants nécessaires à leur calcul",
      "B) Uniquement les modèles contenant le mot 'utilisateurs' dans leur nom",
      "C) Le modèle et uniquement ses parents directs de premier niveau",
      "D) Tous les tests associés au modèle stg_utilisateurs"
    ],
    ans: "A",
    expA: "l'opérateur @ (at operator) capture le modèle cible, tous ses enfants et tous les parents nécessaires pour construire ces enfants de manière autonome",
    expB: "la sélection par nom textuel utilise des sélecteurs de chaîne et non l'arobase",
    expC: "les parents directs de premier niveau s'expriment avec 1+stg_utilisateurs",
    expD: "les tests sont exécutés par dbt test ou dbt build, pas spécifiquement ciblés par @ sur un dbt run",
    url: "https://docs.getdbt.com/reference/node-selection/graph-operators#the-at-operator",
    diff: "moyen"
  },
  {
    topic: "commandes-selecteurs",
    statement: "Quelle commande permet d'exécuter tous les modèles étiquetés avec le tag 'finance' SAUF le modèle spécifique 'fct_bilan_annuel' ?",
    options: [
      "A) dbt run --select tag:finance --exclude fct_bilan_annuel",
      "B) dbt run --select tag:finance -not fct_bilan_annuel",
      "C) dbt run --select tag:finance ^fct_bilan_annuel",
      "D) dbt run --filter finance --skip fct_bilan_annuel"
    ],
    ans: "A",
    expA: "la combinaison de --select (avec le sélecteur de tag tag:finance) et de --exclude permet d'exclure un modèle précis du sous-ensemble",
    expB: "-not n'est pas un argument reconnu par la CLI dbt",
    expC: "l'accent circonflexe n'est pas l'opérateur d'exclusion de dbt",
    expD: "--filter et --skip ne sont pas des options de la commande dbt run",
    url: "https://docs.getdbt.com/reference/node-selection/syntax#exclude-syntax",
    diff: "facile"
  },
  {
    topic: "commandes-selecteurs",
    statement: "Pour limiter l'exécution aux enfants directs (degré 1 uniquement en aval) d'un modèle sans aller chercher toute la chaîne dépendante, quelle syntaxe utilise-t-on ?",
    options: [
      "A) dbt run --select mon_modele+1",
      "B) dbt run --select mon_modele++",
      "C) dbt run --select mon_modele.children",
      "D) dbt run --select mon_modele:depth(1)"
    ],
    ans: "A",
    expA: "ajouter un entier N après le signe plus (ex: modele+1) restreint l'expansion du graphe à N niveaux de dépendance",
    expB: "la notation ++ n'est pas supportée dans la syntaxe des sélecteurs de graphe dbt",
    expC: ".children n'est pas une méthode de sélection native dans la CLI dbt",
    expD: ":depth(1) n'est pas la syntaxe standard dbt (la convention est +N ou N+)",
    url: "https://docs.getdbt.com/reference/node-selection/graph-operators#graph-operators",
    diff: "moyen"
  },
  {
    topic: "commandes-selecteurs",
    statement: "Où peut-on centraliser et nommer des règles de sélection complexes (par exemple réunir plusieurs tags et exclusions) pour les réutiliser facilement dans les commandes dbt ?",
    options: [
      "A) Dans un fichier selectors.yml à la racine du projet",
      "B) Dans le fichier profiles.yml sous la clé shortcuts:",
      "C) Dans un script Bash externe obligatoirement",
      "D) Dans target/selectors.json"
    ],
    ans: "A",
    expA: "le fichier officiel selectors.yml permet de définir des sélecteurs YAML nommés invocables ensuite via dbt run --selector nom_selecteur",
    expB: "profiles.yml gère uniquement les connexions et ne définit pas de sélecteurs de modèles",
    expC: "dbt intègre nativement cette fonctionnalité via selectors.yml sans dépendance à un script shell",
    expD: "target/ est un dossier de compilation généré et non le lieu de définition des sélecteurs",
    url: "https://docs.getdbt.com/reference/node-selection/yaml-selectors",
    diff: "moyen"
  },
  {
    topic: "commandes-selecteurs",
    statement: "Quelle commande permet d'exécuter à la fois les tests, les seeds, les modèles et les snapshots associés au modèle fct_commandes dans un pipeline unifié ?",
    options: [
      "A) dbt build --select fct_commandes",
      "B) dbt run --select fct_commandes --all-resources",
      "C) dbt execute --select fct_commandes",
      "D) dbt pipeline --select fct_commandes"
    ],
    ans: "A",
    expA: "dbt build est la commande universelle qui compile et exécute les seeds, modèles, snapshots et tests dans l'ordre strict du DAG",
    expB: "--all-resources n'est pas un flag valide pour dbt run",
    expC: "dbt execute n'existe pas dans le framework",
    expD: "dbt pipeline n'est pas une commande de la CLI dbt",
    url: "https://docs.getdbt.com/reference/commands/build",
    diff: "facile"
  },
  {
    topic: "commandes-selecteurs",
    statement: "Que fait la commande dbt test --select source:nom_source+ ?",
    options: [
      "A) Elle exécute les tests définis sur la source nom_source ainsi que tous les tests des modèles en aval de cette source",
      "B) Elle teste la connexion réseau vers la base de données source",
      "C) Elle vérifie uniquement les tests de fraîcheur de la source",
      "D) Elle convertit les tests de source en tests singuliers"
    ],
    ans: "A",
    expA: "le préfixe source: cible la source brute et le suffixe + propage la sélection à tous les nœuds descendants dans le DAG et à leurs tests associés",
    expB: "tester la connexion réseau est le rôle de dbt debug et non de dbt test",
    expC: "les tests de fraîcheur relèvent de la commande distincte dbt source freshness",
    expD: "dbt ne convertit pas les types de tests lors de l'exécution",
    url: "https://docs.getdbt.com/reference/node-selection/syntax",
    diff: "moyen"
  }
];

console.log(`Generating ${qData.length} questions for Section 2...`);
const questionsS2 = qData.map((q, idx) => {
  const idNum = idx + 46; // dbt-q046 to dbt-q075
  return makeQDomain(
    DOMAIN_S2,
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

const outPath = path.join(process.cwd(), 'scripts', 'dbt_questions_s2.js');
const fileContent = `// Banque de questions officielles et originales pour dbt Section 2 (30 questions)
// Générée et validée le 2026-10-31
export const dbtQuestionsS2 = ${JSON.stringify(questionsS2, null, 2)};
`;
fs.writeFileSync(outPath, cleanEmDashes(fileContent), 'utf-8');
console.log(`Saved ${questionsS2.length} questions to ${outPath}`);
