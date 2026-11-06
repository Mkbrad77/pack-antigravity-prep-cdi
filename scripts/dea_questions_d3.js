// Banque de questions officielles et originales pour DEA-C01 Domaine 3 (66 questions)
// Générée et validée le 2026-10-31
export const deaQuestionsD3 = [
  {
    "id": "dea-q181",
    "statement": "Dans AWS Glue Data Quality, quel langage déclaratif permet de définir des règles de contrôle de qualité des données telles que la vérification de complétude, de plages de valeurs ou d'unicité sur les tables du catalogue ?",
    "type": "single",
    "options": [
      "A) DQDL (Data Quality Definition Language)",
      "B) SQL DDL classique",
      "C) GraphQL Schema Language",
      "D) YAML Ansible"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car AWS Glue Data Quality utilise DQDL (Data Quality Definition Language), un langage spécifique et déclaratif permettant de formuler facilement des règles telles que 'Completeness', 'IsUnique', ou 'ColumnValues' sur des jeux de données. L'option B est fausse car le SQL DDL standard sert à créer ou modifier la structure des tables et ne fournit pas la syntaxe des règles déclaratives Glue DQDL. L'option C est fausse car GraphQL Schema Language définit les types et résolveurs d'API GraphQL et n'a aucun lien avec la qualité de données Glue. L'option D est fausse car YAML Ansible est un outil d'automatisation de configuration système et non un moteur de règles de données.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/dqdl.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q182",
    "statement": "Quelle règle DQDL vérifie qu'au moins 95 % des lignes d'un jeu de données possèdent une valeur non nulle dans la colonne obligatoire 'client_id' ?",
    "type": "single",
    "options": [
      "A) Completeness \"client_id\" >= 0.95",
      "B) ColumnValues \"client_id\" is not null",
      "C) RowCount >= 95",
      "D) IsUnique \"client_id\" >= 95 %"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la règle DQDL 'Completeness' mesure la proportion de valeurs non nulles d'une colonne cible et compare le ratio obtenu (entre 0.0 et 1.0) au seuil minimal spécifié (ici >= 0.95). L'option B est fausse car ColumnValues teste les valeurs autorisées par rapport à un ensemble ou une plage et n'exprime pas un pourcentage de complétude global. L'option C est fausse car RowCount compte le nombre absolu total de lignes dans le jeu de données sans analyser les valeurs nulles d'une colonne. L'option D est fausse car IsUnique valide l'absence de doublons dans la colonne et ne vérifie pas la présence de valeurs nulles.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/dqdl-completeness.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q183",
    "statement": "Dans un job AWS Glue ETL, un Data Engineer insère un nœud 'Evaluate Data Quality'. Il souhaite que les enregistrements corrompus ne fassent pas échouer l'exécution globale mais soient dirigés vers un compartiment S3 de quarantaine pour analyse ultérieure. Comment configure-t-il cette transformation ?",
    "type": "single",
    "options": [
      "A) En activant le routage conditionnel pour séparer le flux de données en deux flux de sortie : données conformes et données non conformes (quarantaine)",
      "B) En supprimant le nœud et en écrivant un script shell externe",
      "C) En configurant l'action d'arrêt immédiat 'Fail job'",
      "D) En désactivant le chiffrement KMS de la table de destination"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le transformateur Evaluate Data Quality permet de router conditionnellement les données en générant deux DataFrames distincts : l'un contenant les enregistrements validés transmis au pipeline principal, l'autre contenant les rejets envoyés vers un dossier de quarantaine S3. L'option B est fausse car un script shell externe ne s'intègre pas nativement dans le flux de données distribué DynamicFrame de Glue. L'option C est fausse car choisir 'Fail job' interrompt brutalement le traitement de l'ensemble du fichier dès la première anomalie. L'option D est fausse car le chiffrement KMS protège les données et n'a aucun rôle dans le routage des enregistrements invalides.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/data-quality-jobs.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q184",
    "statement": "Quelle fonctionnalité d'AWS Glue Data Quality analyse automatiquement une table du catalogue de métadonnées pour recommander un ensemble initial de règles DQDL pertinentes basées sur l'analyse statistique des données ?",
    "type": "single",
    "options": [
      "A) La génération automatique de règles (Recommendation run)",
      "B) L'outil AWS Glue Crawler standard",
      "C) L'analyseur de requêtes Amazon Athena Explain",
      "D) L'assistant AWS Support"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car AWS Glue Data Quality intègre un moteur de recommandation automatique qui profile les colonnes de la table et produit un jeu de règles DQDL suggérées (types, complétude, cardinalités) que l'ingénieur peut ensuite adapter. L'option B est fausse car le Crawler découvre le schéma et les types de données mais ne génère pas de règles DQDL de qualité applicative. L'option C est fausse car la commande Explain d'Athena affiche le plan d'exécution d'une requête SQL et ne produit aucune règle de qualité. L'option D est fausse car le Support AWS est un service d'assistance technique humaine et non un outil d'inférence de règles dans la console.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/data-quality-recommendations.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q185",
    "statement": "Quel service AWS permet d'intercepter les résultats d'évaluation d'un ensemble de règles AWS Glue Data Quality et de déclencher automatiquement une alerte SNS ou une fonction Lambda lorsque le score de qualité global passe sous un seuil critique ?",
    "type": "single",
    "options": [
      "A) Amazon EventBridge",
      "B) AWS CodeDeploy",
      "C) Amazon Route 53",
      "D) Amazon Kinesis Video Streams"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car AWS Glue publie nativement les événements d'évaluation de la qualité des données (Glue Data Quality Ruleset Evaluation Completed) vers Amazon EventBridge, permettant de déclencher des alertes SNS, des workflows ou des fonctions de remédiation. L'option B est fausse car CodeDeploy gère le déploiement applicatif de code sur des serveurs et non l'interception d'événements de données. L'option C est fausse car Route 53 est un serveur de noms DNS et n'administre pas les notifications de qualité de données. L'option D est fausse car Kinesis Video Streams est un service de flux multimédia sans lien avec les événements d'orchestration.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/data-quality-eventbridge.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q186",
    "statement": "Quelle règle DQDL permet de vérifier que toutes les valeurs de la colonne 'statut_commande' appartiennent obligatoirement à la liste fermée ['EN_ATTENTE', 'PAYEE', 'LIVREE', 'ANNULEE'] ?",
    "type": "single",
    "options": [
      "A) ColumnValues \"statut_commande\" in [\"EN_ATTENTE\", \"PAYEE\", \"LIVREE\", \"ANNULEE\"]",
      "B) ColumnValues \"statut_commande\" != null",
      "C) ColumnLength \"statut_commande\" <= 10",
      "D) RowCount in [\"EN_ATTENTE\", \"PAYEE\", \"LIVREE\", \"ANNULEE\"]"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la syntaxe 'ColumnValues <colonne> in [...]' permet de restreindre formellement les valeurs autorisées d'une colonne à une liste discrète énumérée. L'option B est fausse car tester != null vérifie uniquement la non-nullité et laisserait passer n'importe quelle chaîne invalide. L'option C est fausse car ColumnLength ne teste que la longueur en caractères et non l'appartenance à la liste autorisée. L'option D est fausse car RowCount vérifie le nombre de lignes du jeu de données et ne s'applique pas aux valeurs de chaînes.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/dqdl-column-values.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q187",
    "statement": "Comment AWS Glue Data Quality calcule-t-il le score de qualité global (Data Quality Score) d'un jeu de données évalué par un ensemble de règles (ruleset) ?",
    "type": "single",
    "options": [
      "A) Il calcule le pourcentage de règles du ruleset qui ont réussi (Pass) par rapport au nombre total de règles exécutées",
      "B) Il attribue une note pondérée en fonction de la taille totale en gigaoctets des données",
      "C) Il évalue le nombre d'utilisateurs IAM ayant approuvé la table",
      "D) Il applique un algorithme de deep learning opaque sans score numérique mesurable"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le score de qualité de données Glue est une valeur comprise entre 0 et 100 % calculée comme le ratio entre le nombre de règles validées avec succès et le nombre total de règles composant le ruleset. L'option B est fausse car la taille physique du jeu de données n'influence pas le calcul du score de qualité relatif. L'option C est fausse car les approbations d'utilisateurs IAM relèvent de la gouvernance administrative et non du score de données automatisé. L'option D est fausse car le calcul est déterministe, traçable et s'affiche clairement dans la console Glue Data Catalog.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/data-quality.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q188",
    "statement": "Quelle règle DQDL vérifie qu'aucun doublon n'existe sur la colonne 'email' de la table 'utilisateurs' ?",
    "type": "single",
    "options": [
      "A) IsUnique \"email\"",
      "B) Completeness \"email\" = 1.0",
      "C) ColumnDataType \"email\" = \"STRING\"",
      "D) Uniqueness \"email\" = 0"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la règle DQDL 'IsUnique \"colonne\"' vérifie que chaque valeur présente dans la colonne est strictement unique et signale un échec dès qu'un doublon est détecté. L'option B est fausse car Completeness vérifie l'absence de valeurs nulles mais tolère parfaitement des valeurs dupliquées. L'option C est fausse car ColumnDataType valide le type de données de la colonne et non l'unicité de son contenu. L'option D est fausse car fixer une unicité à 0 signifierait exiger des doublons, ce qui est contraire à la contrainte.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/dqdl-is-unique.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q189",
    "statement": "Dans quel emplacement AWS Glue Data Quality publie-t-il automatiquement des métriques d'historique de qualité exploitables pour créer des tableaux de bord de surveillance continue ?",
    "type": "single",
    "options": [
      "A) Amazon CloudWatch Metrics",
      "B) AWS Artifact",
      "C) Amazon Route 53 Resolver",
      "D) AWS Systems Manager Session Manager"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car AWS Glue Data Quality publie directement ses métriques de qualité (telles que le DataQualityRulesetEvaluationScore et les statuts des règles) dans Amazon CloudWatch, facilitant la création d'alarmes et de dashboards unifiés. L'option B est fausse car AWS Artifact est un portail de téléchargement de rapports de conformité et d'accords juridiques. L'option C est fausse car Route 53 Resolver est un service DNS interne au VPC sans métriques de qualité de données. L'option D est fausse car Session Manager permet des connexions SSH sécurisées aux instances EC2 sans clés.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/data-quality-cloudwatch.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q190",
    "statement": "Quelle règle DQDL s'assure qu'un fichier d'export journalier contient au minimum 1 000 000 de lignes avant de lancer les transformations avales dans un Data Lakehouse ?",
    "type": "single",
    "options": [
      "A) RowCount >= 1000000",
      "B) ColumnLength >= 1000000",
      "C) DistinctValuesCount >= 1000000",
      "D) ColumnValues >= 1000000"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la règle DQDL 'RowCount >= 1000000' valide que le volume total d'enregistrements du jeu de données satisfait le seuil minimal requis, protégeant les pipelines en aval contre des ingestions partielles ou tronquées. L'option B est fausse car ColumnLength mesure la taille en caractères d'une chaîne de texte dans une ligne individuelle. L'option C est fausse car DistinctValuesCount compte le nombre de valeurs distinctes d'une colonne spécifique et non le volume total de lignes. L'option D est fausse car ColumnValues teste les valeurs d'une colonne précise et requiert un nom de colonne.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/dqdl-row-count.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q191",
    "statement": "Un pipeline de données traite des colonnes contenant des codes postaux français qui doivent comporter exactement 5 caractères. Quelle règle DQDL applique cette validation ?",
    "type": "single",
    "options": [
      "A) ColumnLength \"code_postal\" = 5",
      "B) RowCount = 5",
      "C) IsUnique \"code_postal\"",
      "D) ColumnValues \"code_postal\" between 1 and 5"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la règle 'ColumnLength \"colonne\" = 5' vérifie que la longueur de la chaîne pour chaque enregistrement est égale à exactement 5 caractères. L'option B est fausse car RowCount = 5 imposerait que la table entière ne contienne que 5 lignes. L'option C est fausse car IsUnique empêcherait plusieurs clients d'habiter dans la même commune. L'option D est fausse car ColumnValues between 1 and 5 testerait la valeur numérique de la donnée et non le nombre de caractères de la chaîne.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/dqdl-column-length.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q192",
    "statement": "Quelle fonctionnalité de gouvernance centralisée permet d'appliquer et de visualiser les règles AWS Glue Data Quality directement au niveau des tables du lac de données sans modifier le code des jobs Spark ?",
    "type": "single",
    "options": [
      "A) L'onglet Data Quality d'AWS Glue Data Catalog",
      "B) L'éditeur de requêtes DynamoDB",
      "C) La console AWS Trusted Advisor",
      "D) L'outil AWS X-Ray Trace Console"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'onglet Data Quality intégré au Glue Data Catalog permet d'attacher des jeux de règles DQDL directement aux tables du catalogue et de planifier des vérifications autonomes sans toucher au code des applications Spark. L'option B est fausse car DynamoDB ne gère pas les métadonnées de tables de Data Lake du Glue Data Catalog. L'option C est fausse car Trusted Advisor fournit des conseils de sécurité et coûts globaux mais ne gère pas les règles DQDL spécifiques. L'option D est fausse car X-Ray trace les appels d'API microservices et ne profile pas les tables de données.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/data-quality-catalog.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q193",
    "statement": "Lorsqu'une règle DQDL échoue dans un job Glue ETL configuré avec l'action 'Fail job on quality failure', quel est le comportement immédiat du moteur Glue ?",
    "type": "single",
    "options": [
      "A) Le job Glue s'arrête en erreur, l'exécution est marquée Failed et les étapes d'écriture en aval sont annulées",
      "B) Le job continue silencieusement en supprimant les colonnes non conformes",
      "C) Le job convertit automatiquement les données en base NoSQL",
      "D) Le job envoie un message texte SMS sur le téléphone de l'administrateur sans interrompre le calcul"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'action 'Fail job' provoque l'arrêt immédiat et l'échec de la tâche Glue, empêchant toute écriture de données de mauvaise qualité dans le stockage cible. L'option B est fausse car le job ne supprime pas de colonnes de façon silencieuse en cas d'échec de règle. L'option C est fausse car Glue ne convertit jamais arbitrairement des tables en format NoSQL. L'option D est fausse car l'arrêt en erreur est géré par le plan d'exécution sans envoi direct de SMS sans configuration SNS préalable.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/data-quality-jobs.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q194",
    "statement": "Quelle règle DQDL vérifie que les montants de transactions dans la colonne 'montant' sont tous strictement positifs ?",
    "type": "single",
    "options": [
      "A) ColumnValues \"montant\" > 0",
      "B) Completeness \"montant\" > 0",
      "C) IsUnique \"montant\"",
      "D) RowCount > 0"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la règle 'ColumnValues \"montant\" > 0' impose que chaque valeur numérique de la colonne 'montant' soit supérieure à zéro. L'option B est fausse car Completeness teste le taux de valeurs non nulles et non leur positivité. L'option C est fausse car IsUnique imposerait que tous les montants soient différents, ce qui est aberrant pour des montants de transactions. L'option D est fausse car RowCount vérifie le nombre total de lignes de la table et non la valeur des cellules.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "glue-data-quality",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/glue/latest/dg/dqdl-column-values.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q195",
    "statement": "Dans Amazon CloudWatch, quelle fonctionnalité permet d'extraire des indicateurs chiffrés personnalisés (comme le nombre d'erreurs 'HTTP 500' ou des temps de réponse) à partir de fichiers journaux bruts pour déclencher des alarmes ?",
    "type": "single",
    "options": [
      "A) Les filtres de métriques de journaux (CloudWatch Logs Metric Filters)",
      "B) Les canaris CloudWatch Synthetics",
      "C) AWS CloudTrail Insights",
      "D) Les groupes de placement d'instances EC2"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les filtres de métriques de CloudWatch Logs scannent les flux de logs à la volée selon un motif de recherche défini (ex: [..., status_code = 500]) et incrémentent une métrique CloudWatch personnalisée sur laquelle on peut brancher des alarmes. L'option B est fausse car les canaris Synthetics simulent des interactions utilisateurs sur des applications web et ne filtrent pas les logs applicatifs. L'option C est fausse car CloudTrail Insights détecte des anomalies d'appels API AWS et non des événements dans les logs applicatifs. L'option D est fausse car les groupes de placement contrôlent la localisation physique des instances EC2 au sein des datacenters.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q196",
    "statement": "Quelle syntaxe de requête Amazon CloudWatch Logs Insights permet de filtrer les logs contenant le mot 'Exception', de calculer le nombre d'occurrences par intervalle de 5 minutes et d'afficher le résultat trié par volume décroissant ?",
    "type": "single",
    "options": [
      "A) fields @timestamp, @message | filter @message like /Exception/ | stats count() by bin(5m) | sort count() desc",
      "B) SELECT count(*) FROM logs WHERE message = 'Exception' GROUP BY 5m",
      "C) grep 'Exception' /var/log/* | sort -r",
      "D) cat logs.json | jq '.Exception' | count"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car CloudWatch Logs Insights utilise un langage de requête dédié basé sur des pipes (|) avec les commandes standards fields, filter, stats et sort avec la fonction temporelle bin(). L'option B est fausse car la syntaxe SQL standard SELECT n'est pas le langage natif de CloudWatch Logs Insights. L'option C est fausse car grep est une commande shell Linux locale et non la syntaxe d'interrogation de l'interface CloudWatch. L'option D est fausse car jq est un utilitaire en ligne de commande pour manipuler du JSON en local.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q197",
    "statement": "Une équipe souhaite réduire le bruit causé par de multiples alertes indépendantes et déclencher une notification PagerDuty uniquement lorsqu'à la fois le taux d'erreur dépasse 5 % ET que le CPU moyen du cluster dépasse 80 %. Quel composant CloudWatch permet d'agréger plusieurs alarmes avec des opérateurs booléens ?",
    "type": "single",
    "options": [
      "A) Une alarme composite (CloudWatch Composite Alarm)",
      "B) Une alarme standard avec filtre de métrique",
      "C) Une tâche AWS Batch",
      "D) Une règle de routage Route 53"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les alarmes composites de CloudWatch évaluent l'état d'autres alarmes à l'aide d'expressions logiques (AND, OR, NOT) pour n'alerter que lors de corrélations réelles d'incidents, réduisant la fatigue d'alerte. L'option B est fausse car une alarme standard ne surveille qu'une seule métrique ou expression mathématique directe et ne peut pas agréger des états d'alarmes multiples. L'option C est fausse car AWS Batch est un planificateur de calcul par lots et non un moteur de gestion d'alertes. L'option D est fausse car Route 53 gère le trafic DNS et ne combine pas d'alarmes opérationnelles.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q198",
    "statement": "Quelle fonctionnalité de calcul d'Amazon CloudWatch permet de combiner ou normaliser plusieurs métriques (par exemple diviser le nombre total d'erreurs par le nombre total de requêtes pour obtenir un taux d'échec) directement dans un graphique ?",
    "type": "single",
    "options": [
      "A) Le calcul métrique (CloudWatch Metric Math)",
      "B) AWS Glue DataBrew",
      "C) Amazon Athena CTAS",
      "D) Amazon QuickSight SPICE"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car Metric Math permet d'appliquer des formules mathématiques, des fonctions statistiques (RATE, AVG, SUM, FILL) et des opérations arithmétiques sur plusieurs métriques CloudWatch pour créer des indicateurs dérivés en temps réel. L'option B est fausse car Glue DataBrew est un outil visuel de nettoyage de données pour Data Lakes et non un calculateur de métriques CloudWatch. L'option C est fausse car Athena CTAS crée des tables externes à partir de requêtes SQL sur S3. L'option D est fausse car QuickSight SPICE est un moteur de visualisation décisionnelle BI et non le composant natif de graphes CloudWatch.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q199",
    "statement": "Par défaut, quelle est la fréquence d'échantillonnage de la surveillance standard (Basic Monitoring) pour les métriques d'instances Amazon EC2 dans CloudWatch, et à quel intervalle descend la surveillance détaillée (Detailed Monitoring) ?",
    "type": "single",
    "options": [
      "A) Surveillance standard : toutes les 5 minutes; surveillance détaillée : toutes les 1 minute",
      "B) Surveillance standard : toutes les 1 heure; surveillance détaillée : toutes les 10 secondes",
      "C) Surveillance standard : toutes les 1 seconde; surveillance détaillée : instantanée",
      "D) Surveillance standard : toutes les 24 heures; surveillance détaillée : toutes les 12 heures"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la surveillance de base (Basic Monitoring) fournie gratuitement par CloudWatch relève les métriques EC2 toutes les 5 minutes; l'activation de Detailed Monitoring permet de recueillir les métriques à une fréquence de 1 minute. L'option B est fausse car un relevé toutes les heures serait insuffisant pour gérer l'auto-scaling réactif. L'option C est fausse car la surveillance détaillée EC2 standard n'opère pas à la seconde (contrairement aux métriques personnalisées haute résolution). L'option D est fausse car un cycle de 24 heures correspondrait à des statistiques de facturation et non à de la télémétrie de serveurs.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q200",
    "statement": "Quelle classe de stockage CloudWatch Logs à bas coût a été introduite pour ingérer et conserver de volumineux journaux applicatifs ou d'audit rarement consultés avec une réduction de coût d'ingestion d'environ 50 % ?",
    "type": "single",
    "options": [
      "A) CloudWatch Logs Infrequent Access (Logs-IA)",
      "B) S3 Glacier Deep Archive direct stream",
      "C) CloudWatch MemStore",
      "D) EBS Cold HDD"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la classe CloudWatch Logs Infrequent Access (Logs-IA) permet d'ingérer des logs à un coût nettement réduit tout en conservant les capacités d'interrogation analytique avec CloudWatch Logs Insights. L'option B est fausse car CloudWatch ne diffuse pas directement les flux de logs entrants bruts dans Glacier Deep Archive sans passer par S3 ou Firehose. L'option C est fausse car CloudWatch MemStore n'existe pas dans le catalogue de services AWS. L'option D est fausse car EBS Cold HDD est un stockage bloc attaché à une instance et non une classe gérée de CloudWatch Logs.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q201",
    "statement": "Pour collecter des métriques au niveau du système d'exploitation d'une instance EC2 exécutant un worker Spark (telles que l'utilisation de la mémoire vive RAM et l'espace disque consommé), quel composant doit impérativement être installé sur l'hôte ?",
    "type": "single",
    "options": [
      "A) L'agent unifié Amazon CloudWatch (CloudWatch Agent)",
      "B) Le pilote JDBC PostgreSQL",
      "C) L'hyperviseur AWS Nitro",
      "D) Le client Git"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'hyperviseur EC2 n'a pas accès à la mémoire interne ni au système de fichiers de l'OS de l'instance pour des raisons d'isolation de sécurité; l'installation de l'agent CloudWatch sur le système d'exploitation invité est obligatoire pour publier la RAM et le disque. L'option B est fausse car un pilote JDBC sert aux connexions de bases de données relationnelles et ne collecte pas la mémoire système. L'option C est fausse car l'hyperviseur Nitro gère l'infrastructure sous-jacente AWS et ne transmet pas la mémoire interne des processus clients. L'option D est fausse car le client Git gère le code source et n'a aucun rôle de monitoring système.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q202",
    "statement": "Dans Amazon CloudWatch, quelle fonctionnalité permet de surveiller la performance, les taux d'erreur et les temps de réponse de conteneurs déployés sur Amazon ECS et Amazon EKS sans installer d'agents tiers complexes ?",
    "type": "single",
    "options": [
      "A) CloudWatch Container Insights",
      "B) Amazon Inspector Container Scanner",
      "C) AWS CodePipeline Build Monitor",
      "D) Amazon VPC Flow Logs"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car Container Insights collecte, agrège et synthétise automatiquement les métriques de diagnostic et d'utilisation (CPU, mémoire, réseau, stockage) pour les conteneurs orchestrés sur ECS, EKS et Kubernetes. L'option B est fausse car Amazon Inspector analyse les vulnérabilités de sécurité des images de conteneurs et non les performances en temps réel. L'option C est fausse car CodePipeline surveille les étapes d'intégration continue de code logiciel. L'option D est fausse car VPC Flow Logs capture les paquets réseau au niveau de l'interface réseau sans visibilité sur les conteneurs applicatifs.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q203",
    "statement": "Quelle fonctionnalité de CloudWatch simule en continu des requêtes d'utilisateurs finaux sur une API REST ou une application web à l'aide de scripts Node.js ou Python pour détecter des pannes avant que les clients ne soient impactés ?",
    "type": "single",
    "options": [
      "A) CloudWatch Synthetics (Canaries)",
      "B) AWS Shield Advanced",
      "C) AWS WAF Bot Control",
      "D) AWS Systems Manager Run Command"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les canaris CloudWatch Synthetics exécutent des scripts programmés simulant la navigation d'utilisateurs ou des appels d'API pour vérifier en permanence la disponibilité et la latence des services. L'option B est fausse car Shield Advanced protège contre les attaques par déni de service distribué (DDoS). L'option C est fausse car WAF Bot Control filtre le trafic de robots malveillants entrants sur les passerelles web. L'option D est fausse car Run Command exécute des commandes d'administration sur des parcs d'instances EC2.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q204",
    "statement": "Quelle durée de rétention maximale par défaut s'applique à un groupe de journaux (Log Group) CloudWatch Logs si aucune règle d'expiration n'est expressément configurée par l'administrateur ?",
    "type": "single",
    "options": [
      "A) Les journaux sont conservés indéfiniment (Never Expire)",
      "B) Les journaux sont purgés automatiquement après 30 jours",
      "C) Les journaux sont supprimés après 24 heures",
      "D) Les journaux sont écrasés dès que la taille du groupe atteint 1 Go"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car par défaut, CloudWatch Logs conserve les données de journalisation indéfiniment; il est recommandé de configurer une politique de rétention (ex: 30, 90 ou 365 jours) pour maîtriser les coûts de stockage. L'option B est fausse car CloudWatch ne purge pas les logs après 30 jours sauf configuration volontaire d'une politique d'expiration. L'option C est fausse car 24 heures est la durée de rétention de Kinesis Data Streams par défaut et non de CloudWatch Logs. L'option D est fausse car CloudWatch Logs n'a pas de limite de 1 Go et ne tronque pas les groupes de logs sur des critères de volume fixe.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q205",
    "statement": "Comment peut-on exporter efficacement et à moindre coût d'anciens groupes de logs CloudWatch vers un compartiment Amazon S3 pour un archivage à long terme conforme aux règles d'audit ?",
    "type": "single",
    "options": [
      "A) Utiliser la commande CreateExportTask vers un compartiment S3 ou configurer une règle d'abonnement (Subscription Filter) vers Amazon Data Firehose",
      "B) Copier-coller manuellement les logs depuis l'interface web de la console AWS",
      "C) Télécharger les logs en format PDF via AWS Artifact",
      "D) Exécuter une requête SELECT INTO sur CloudWatch Logs Insights"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car CloudWatch Logs propose les tâches d'export ponctuelles vers S3 (CreateExportTask) et les filtres d'abonnement en streaming vers Amazon Data Firehose pour acheminer en continu les logs vers un Data Lake S3. L'option B est fausse car le copier-coller manuel est impossible et impensable sur des gigaoctets de logs. L'option C est fausse car AWS Artifact ne sert qu'aux rapports de conformité légale AWS et ne manipule aucun log d'infrastructure. L'option D est fausse car Logs Insights ne dispose pas de commande d'écriture 'SELECT INTO'.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/S3Export.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q206",
    "statement": "Quel outil CloudWatch permet de détecter automatiquement les comportements anormaux d'une métrique de flux de données sans fixer manuellement de seuils d'alerte statiques ?",
    "type": "single",
    "options": [
      "A) La détection d'anomalies CloudWatch (CloudWatch Anomaly Detection)",
      "B) Les métriques de facturation AWS Billing",
      "C) Le moniteur d'événements EventBridge Archive",
      "D) L'analyseur de conformité AWS Config"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car CloudWatch Anomaly Detection applique des algorithmes de Machine Learning pour analyser l'historique d'une métrique, déterminer les motifs saisonniers ou horaires et tracer une bande de valeurs attendues; l'alarme se déclenche en cas de sortie anormale de bande. L'option B est fausse car les métriques de facturation ne surveillent que les coûts financiers globaux. L'option C est fausse car EventBridge Archive archive les bus d'événements et n'infère aucun modèle de ML prédictif. L'option D est fausse car AWS Config évalue la conformité des configurations de ressources et non les séries temporelles de métriques.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q207",
    "statement": "Quelle destination d'action peut être directement associée à une alarme CloudWatch lorsque celle-ci passe dans l'état ALARM ?",
    "type": "single",
    "options": [
      "A) Une rubrique Amazon SNS, une politique d'auto-scaling EC2 ou une action d'instance EC2 (Stop/Terminate/Reboot)",
      "B) L'envoi direct d'un e-mail non chiffré sans passer par aucun service intermédiaire",
      "C) L'arrêt immédiat du compte AWS entier",
      "D) La suppression physique de la zone de disponibilité"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car une alarme CloudWatch peut directement notifier une rubrique SNS (qui relaie ensuite par email, webhook, Slack ou SMS), déclencher une politique d'auto-scaling pour ajuster la flotte ou exécuter des actions d'arrêt/redémarrage sur l'instance EC2. L'option B est fausse car CloudWatch ne supporte pas d'envoi d'email direct sans passer par le service de notification Amazon SNS. L'option C est fausse car CloudWatch ne dispose pas d'action pour résilier ou fermer un compte AWS. L'option D est fausse car une zone de disponibilité est un datacenter physique d'Amazon qui ne peut pas être supprimé par un utilisateur.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q208",
    "statement": "Dans Amazon CloudWatch Logs, quelle est la structure hiérarchique standard d'organisation des journaux ?",
    "type": "single",
    "options": [
      "A) Un groupe de journaux (Log Group) qui regroupe plusieurs flux de journaux (Log Streams) représentant chacun une instance ou source distincte",
      "B) Une table DynamoDB regroupant des partitions",
      "C) Un dossier S3 regroupant des manifests Avro",
      "D) Un registre de schémas regroupant des versions de code"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car CloudWatch Logs organise les données en groupes de journaux (Log Groups) qui définissent les politiques de rétention et de contrôle d'accès; à l'intérieur, chaque processus ou conteneur émet vers son propre flux de journaux (Log Stream). L'option B est fausse car cette organisation est propre à DynamoDB et non à CloudWatch Logs. L'option C est fausse car cette organisation correspond à l'architecture de table Apache Iceberg. L'option D est fausse car cette définition correspond à AWS Glue Schema Registry.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudwatch",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q209",
    "statement": "Quelle différence essentielle distingue les événements de gestion (Management Events) des événements de données (Data Events) dans AWS CloudTrail ?",
    "type": "single",
    "options": [
      "A) Les événements de gestion enregistrent les opérations sur le plan de contrôle (ex: CreateBucket, TerminateInstances) et sont activés par défaut, alors que les événements de données tracent les actions sur le plan de données (ex: GetObject, PutObject, Invoke) et sont désactivés par défaut en raison de leur volume élevé",
      "B) Les événements de gestion ne fonctionnent que sur Windows",
      "C) Les événements de données sont totalement gratuits et conservés 100 ans par défaut",
      "D) Les événements de gestion tracent uniquement le code source des applications Spark"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car CloudTrail enregistre gratuitement les événements de gestion du plan de contrôle sur 90 jours dans le journal d'événements; les événements de données (accès aux objets S3 ou invocations Lambda) génèrent des volumes massifs et doivent être activés explicitement avec une tarification au million d'événements. L'option B est fausse car CloudTrail est indépendant du système d'exploitation et capture les appels d'API AWS sur l'ensemble de l'infrastructure. L'option C est fausse car les événements de données sont payants et ne sont conservés indéfiniment que si un trail avec écriture S3 est configuré. L'option D est fausse car les événements de gestion tracent les appels d'API de gestion d'infrastructure AWS et non la logique interne des scripts Spark.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudtrail-config",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q210",
    "statement": "Une exigence de conformité bancaire exige de prouver mathématiquement qu'aucun fichier journal CloudTrail stocké dans S3 n'a été altéré, tronqué ou supprimé depuis son écriture par le service AWS. Quelle fonctionnalité activez-vous ?",
    "type": "single",
    "options": [
      "A) La validation de l'intégrité des fichiers journaux (Log File Integrity Validation)",
      "B) Le chiffrement BitLocker",
      "C) L'analyseur de code statique SonarQube",
      "D) La désactivation des logs d'accès S3"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la validation de l'intégrité des fichiers CloudTrail génère toutes les heures des fichiers de synthèse (digest files) contenant les hashs cryptographiques SHA-256 et signatures numériques RSA des journaux livrés, permettant de certifier l'absence d'altération. L'option B est fausse car BitLocker est un outil de chiffrement de disque local sous Windows qui ne valide pas les signatures d'API CloudTrail. L'option C est fausse car SonarQube analyse la qualité du code source applicatif et non l'intégrité cryptographique des fichiers de log. L'option D est fausse car désactiver les logs réduirait la traçabilité au lieu de la sécuriser.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudtrail-config",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q211",
    "statement": "Quel service AWS surveille en continu la configuration des ressources déployées (comme les compartiments S3 ou les clusters Redshift), évalue leur conformité par rapport à des règles d'entreprise prédéfinies et enregistre l'historique de chaque modification ?",
    "type": "single",
    "options": [
      "A) AWS Config",
      "B) AWS CloudFormation",
      "C) Amazon Route 53",
      "D) AWS Data Pipeline"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car AWS Config enregistre l'historique détaillé des configurations de ressources (Configuration Items), évalue la conformité vis-à-vis de règles gérées (ex: s3-bucket-ssl-requests-only) et alerte lors de toute non-conformité. L'option B est fausse car CloudFormation provisionne l'infrastructure selon un modèle déclaratif mais n'audite pas en continu les dérives de configuration non managées. L'option C est fausse car Route 53 est un service de gestion DNS. L'option D est fausse car Data Pipeline est un orchestrateur de données hérité et déprécié.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudtrail-config",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q212",
    "statement": "Lorsqu'une règle AWS Config détecte qu'un nouveau compartiment S3 a été créé avec un accès public ouvert, comment peut-on remédier automatiquement à cette non-conformité sans intervention humaine ?",
    "type": "single",
    "options": [
      "A) Associer une action de remédiation automatique basée sur un document AWS Systems Manager Automation (runbook SSM)",
      "B) Envoyer un e-mail à l'ensemble du personnel pour demander la suppression manuelle",
      "C) Redémarrer la console de gestion AWS",
      "D) Supprimer l'ensemble du compte AWS"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car AWS Config permet d'attacher une action de remédiation automatique (Automatic Remediation) exécutant un document SSM Automation (ex: AWS-DisableS3BucketPublicReadWrite) dès qu'une ressource passe à l'état NON_COMPLIANT. L'option B est fausse car l'envoi d'e-mails manuels n'offre pas la réactivité instantanée exigée pour bloquer une fuite de données. L'option C est fausse car redémarrer la console ne modifie aucune configuration de sécurité sur le compartiment. L'option D est fausse car supprimer le compte est une réaction disproportionnée et destructrice.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudtrail-config",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/config/latest/developerguide/remediation.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q213",
    "statement": "Quelle fonctionnalité d'AWS CloudTrail utilise le Machine Learning pour analyser l'historique habituel des appels d'API et alerter en cas de pic anormal d'activité (par exemple un nombre inhabituel d'erreurs d'autorisation ou de suppressions de ressources) ?",
    "type": "single",
    "options": [
      "A) CloudTrail Insights",
      "B) Amazon Inspector",
      "C) AWS Trusted Advisor",
      "D) Amazon QuickSight Q"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car CloudTrail Insights applique des modèles statistiques pour identifier les anomalies opérationnelles et de sécurité sur les volumes d'appels API en écriture ou les taux d'erreurs d'autorisation (AccessDenied). L'option B est fausse car Amazon Inspector scanne les failles de sécurité dans les packages logiciels d'instances et de conteneurs. L'option C est fausse car Trusted Advisor fournit des conseils génériques d'optimisation et non une analyse en temps réel des anomalies d'API. L'option D est fausse car QuickSight Q est un moteur de requêtes décisionnelles en langage naturel pour tableaux de bord.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudtrail-config",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-insights-events-with-cloudtrail.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q214",
    "statement": "Dans AWS Config, comment s'appelle le regroupement structuré de règles AWS Config et d'actions de remédiation packagées ensemble pour vérifier la conformité avec un cadre réglementaire spécifique (ex: PCI-DSS ou HIPAA) ?",
    "type": "single",
    "options": [
      "A) Un paquet de conformité (Conformance Pack)",
      "B) Une pile CloudFormation standard",
      "C) Un VPC Peering",
      "D) Un ensemble de permissions IAM"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car un Conformance Pack est un modèle YAML géré déployant un ensemble coordonné de règles AWS Config et de remédiations pour auditer et appliquer la conformité d'une organisation à une norme légale. L'option B est fausse car une pile CloudFormation peut déployer des ressources mais le concept officiel de gouvernance de conformité AWS Config est le Conformance Pack. L'option C est fausse car le VPC Peering est une connexion réseau entre deux réseaux virtuels. L'option D est fausse car les permissions IAM définissent les droits d'accès des identités et non les règles d'audit de configuration.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudtrail-config",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q215",
    "statement": "Un auditeur de sécurité souhaite retrouver l'adresse IP source et l'identité IAM exacte qui a exécuté une commande 'DeleteTable' sur une table Redshift critique la semaine dernière. Quel service fournit cette information ?",
    "type": "single",
    "options": [
      "A) AWS CloudTrail Event History",
      "B) Amazon VPC Flow Logs",
      "C) Amazon CloudWatch Metric Filters",
      "D) AWS Trusted Advisor"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'historique des événements CloudTrail (Event History) journalise les 90 derniers jours d'appels d'API de gestion avec le nom de l'événement (DeleteTable), l'identité de l'appelant (userIdentity), l'adresse IP et le timestamp exact. L'option B est fausse car VPC Flow Logs montre les adresses IP et les ports réseau mais ne capture aucun nom d'événement d'API applicative. L'option C est fausse car les filtres de métriques agrègent des chiffres mais ne stockent pas le détail d'identité forensique des appels d'API. L'option D est fausse car Trusted Advisor ne fournit pas de journal d'audit des actions passées.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudtrail-config",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q216",
    "statement": "Pour s'assurer qu'un journal d'audit CloudTrail capture absolument tous les événements survenus dans toutes les régions actuelles et futures d'un compte AWS, quelle configuration est indispensable ?",
    "type": "single",
    "options": [
      "A) Créer un sentier multi-région (Multi-region trail)",
      "B) Créer manuellement un sentier séparé dans chaque région",
      "C) Activer uniquement la région us-east-1",
      "D) Utiliser AWS Direct Connect"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car un sentier multi-région (Multi-region trail) garantit que CloudTrail enregistre les événements sur toutes les régions AWS et s'active automatiquement dès qu'AWS ouvre une nouvelle région géographique. L'option B est fausse car gérer manuellement des sentiers distincts dans chaque région est une source d'oubli et complexifie la centralisation des fichiers de logs. L'option C est fausse car us-east-1 n'enregistre que les événements globaux et locaux à cette région et ignore les activités menées en Europe ou en Asie. L'option D est fausse car Direct Connect est une ligne réseau dédiée sans lien avec la collecte d'audit de sentiers d'API.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudtrail-config",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/receive-cloudtrail-log-files-from-multiple-regions.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q217",
    "statement": "Dans une grande organisation utilisant AWS Organizations, comment peut-on forcer la collecte des journaux CloudTrail sur l'ensemble des comptes membres sans que les administrateurs de comptes individuels ne puissent désactiver la journalisation ?",
    "type": "single",
    "options": [
      "A) Déployer un sentier d'organisation (Organization Trail) depuis le compte de gestion ou un compte administrateur délégué",
      "B) Envoyer une note de service demandant à chaque employé de ne pas toucher à CloudTrail",
      "C) Bloquer l'accès à la console AWS pour tous les comptes",
      "D) Installer un script Python local sur chaque poste de travail"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car un sentier d'organisation (Organization Trail) s'applique automatiquement à tous les comptes AWS membres existants et futurs; les administrateurs des comptes membres peuvent voir le sentier mais ne disposent pas des droits pour le modifier ou le supprimer. L'option B est fausse car les consignes informelles n'offrent aucune garantie technique contre les mauvaises manipulations ou la malveillance. L'option C est fausse car bloquer la console empêcherait le travail normal des équipes de développement. L'option D est fausse car un script local sur un poste ne peut pas administrer la conformité centralisée du cloud AWS.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudtrail-config",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q218",
    "statement": "Quel format de fichier AWS CloudTrail utilise-t-il pour stocker les enregistrements d'événements dans le compartiment Amazon S3 cible, et quel algorithme de compression est appliqué par défaut ?",
    "type": "single",
    "options": [
      "A) Fichiers JSON compressés au format GZIP (.json.gz)",
      "B) Fichiers Parquet compressés en Snappy",
      "C) Fichiers CSV bruts non compressés",
      "D) Fichiers XML compressés en ZIP"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car CloudTrail regroupe les événements par tranches d'environ 5 minutes et les enregistre sous forme de fichiers texte JSON compressés avec GZIP (.json.gz) dans le compartiment S3 configuré. L'option B est fausse car CloudTrail ne produit pas nativement de fichiers Parquet (bien qu'on puisse les convertir ensuite via Glue ou Athena). L'option C est fausse car les fichiers ne sont pas au format tabulaire CSV en raison de la nature imbriquée des métadonnées d'appels d'API. L'option D est fausse car CloudTrail n'utilise pas le format XML pour ses fichiers de logs livrés sur S3.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudtrail-config",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-examples.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q219",
    "statement": "Quel est le rôle du moteur SPICE (Super-fast, Parallel, In-memory Calculation Engine) dans Amazon QuickSight ?",
    "type": "single",
    "options": [
      "A) Accélérer les temps de réponse des tableaux de bord en chargeant les données en mémoire vive distribuée tout en évitant de surcharger la base de données source",
      "B) Traduire automatiquement les requêtes SQL en langage Python",
      "C) Chiffrer les disques durs des postes de travail des analystes",
      "D) Remplacer le catalogue AWS Glue Data Catalog"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car SPICE est le moteur de calcul en mémoire distribué de QuickSight qui ingère des gigaoctets de données pour offrir des visualisations interactives ultra-rapides sans soumettre de requêtes directes répétées à la base sous-jacente. L'option B est fausse car SPICE n'est pas un traducteur de code SQL vers Python. L'option C est fausse car SPICE réside sur l'infrastructure cloud AWS et ne gère pas le matériel des postes locaux. L'option D est fausse car SPICE est un cache décisionnel analytique et non un catalogue de métadonnées de tables.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "quicksight",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/quicksight/latest/user/spice.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q220",
    "statement": "Une entreprise souhaite restreindre la visibilité des données d'un tableau de bord de ventes QuickSight afin que chaque responsable régional ne puisse visualiser que les données correspondant à son propre pays. Quelle fonctionnalité native garantit cette séparation sans dupliquer le tableau de bord ?",
    "type": "single",
    "options": [
      "A) La sécurité au niveau des lignes (Row-Level Security - RLS) configurée via un jeu de données de règles d'autorisation",
      "B) La création d'un tableau de bord séparé pour chaque responsable régional",
      "C) Le masquage des colonnes dans S3 Select",
      "D) L'interdiction des connexions en dehors des heures de bureau"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la sécurité au niveau des lignes (RLS) permet d'appliquer des filtres de données dynamiques basés sur le nom de l'utilisateur ou son groupe en utilisant un dataset de permissions, garantissant qu'un tableau de bord unique présente des données filtrées sur mesure pour chaque profil. L'option B est fausse car dupliquer les tableaux de bord démultiplie la maintenance et introduit des risques de divergences. L'option C est fausse car S3 Select n'est pas le moteur de contrôle d'accès utilisateur de la plateforme décisionnelle QuickSight. L'option D est fausse car restreindre les horaires de connexion ne filtre pas le périmètre géographique des données.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "quicksight",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/quicksight/latest/user/restrict-access-to-a-data-set-using-row-level-security.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q221",
    "statement": "Quelle fonctionnalité d'Amazon QuickSight permet aux décideurs d'entreprise de poser des questions en langage naturel (ex: 'Quel a été le chiffre d'affaires en France le mois dernier ?') et d'obtenir instantanément des réponses visuelles précises ?",
    "type": "single",
    "options": [
      "A) Amazon QuickSight Q",
      "B) Amazon Kendra",
      "C) AWS Chatbot",
      "D) Amazon Lex"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car QuickSight Q utilise le traitement du langage naturel (NLP) et le Machine Learning pour comprendre les questions métier posées en langage courant et générer automatiquement des visualisations pertinentes sans exiger de compétences SQL. L'option B est fausse car Amazon Kendra est un moteur de recherche documentaire intelligent pour indexer des documents non structurés. L'option C est fausse car AWS Chatbot permet d'intégrer des alertes d'exploitation AWS dans Slack ou Microsoft Teams. L'option D est fausse car Amazon Lex sert à construire des interfaces conversationnelles (chatbots vocaux et textuels).",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "quicksight",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/quicksight/latest/user/quicksight-q.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q222",
    "statement": "Pour connecter de manière sécurisée Amazon QuickSight à une base de données Amazon Redshift déployée dans un sous-réseau privé d'un VPC sans exposer l'entrepôt de données à Internet, quel composant QuickSight devez-vous configurer ?",
    "type": "single",
    "options": [
      "A) Une connexion VPC (VPC Connection) QuickSight avec des sous-réseaux privés et des groupes de sécurité adaptés",
      "B) Une passerelle Internet (IGW) ouverte en 0.0.0.0/0",
      "C) Un serveur mandataire Squid public sur EC2",
      "D) Le service AWS Snowball Edge"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car une connexion VPC QuickSight crée des interfaces réseau élastiques (ENI) directement au sein des sous-réseaux privés du VPC client, permettant un routage réseau sécurisé et privé sans transiter par l'Internet public. L'option B est fausse car ouvrir une passerelle Internet publique exposerait la base de données privée à des risques majeurs de sécurité. L'option C est fausse car un proxy Squid public rajoute de la complexité et introduit une exposition inutile sur le réseau externe. L'option D est fausse car Snowball est un outil physique de transfert par camion et ne permet pas d'interrogation interactive en direct.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "quicksight",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/quicksight/latest/user/vpc-creating-a-connection-in-quicksight.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q223",
    "statement": "Quelle est la taille maximale de capacité de stockage en mémoire qu'un jeu de données individuel peut consommer dans le moteur SPICE d'Amazon QuickSight Enterprise Edition ?",
    "type": "single",
    "options": [
      "A) Jusqu'à 500 Go (ou 1 milliard de lignes selon les versions)",
      "B) 10 Mo au maximum",
      "C) Illimité sans aucune contrainte de mémoire",
      "D) Exactement 4 Ko"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car Amazon QuickSight Enterprise Edition permet d'allouer jusqu'à 500 Go ou 1 milliard de lignes de données par dataset SPICE pour absorber d'importantes volumétries analytiques en mémoire vive. L'option B est fausse car 10 Mo correspondrait à un simple fichier bureautique très restreint. L'option C est fausse car la mémoire vive des serveurs de calcul mutualisés est physique et ne peut pas être infinie sans limite. L'option D est fausse car 4 Ko est la taille d'un bloc DynamoDB et non une limite de dataset décisionnel.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "quicksight",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/quicksight/latest/user/spice.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q224",
    "statement": "Quelle fonctionnalité de sécurité d'Amazon QuickSight permet de masquer des colonnes sensibles (comme des salaires ou des numéros de carte bancaire) pour certains utilisateurs spécifiques tout en laissant la colonne accessible aux membres de l'équipe RH ?",
    "type": "single",
    "options": [
      "A) La sécurité au niveau des colonnes (Column-Level Security - CLS)",
      "B) Le hachage MD5 côté client dans le navigateur",
      "C) L'anonymisation des adresses IP",
      "D) La suppression de la colonne dans le fichier CSV source"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la sécurité au niveau des colonnes (CLS) permet de restreindre l'accès à des colonnes spécifiques d'un dataset à des utilisateurs ou groupes précis; les utilisateurs non autorisés ne voient pas la colonne dans leurs analyses ni dans les exports. L'option B est fausse car le masquage dans le navigateur est contournable et non sécurisé côté serveur. L'option C est fausse car l'anonymisation des adresses IP ne gère pas les droits d'accès aux colonnes d'entreprise comme les salaires. L'option D est fausse car supprimer la colonne priverait l'équipe RH légitime d'accéder aux données requises.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "quicksight",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/quicksight/latest/user/restrict-access-to-a-data-set-using-column-level-security.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q225",
    "statement": "Quels sont les deux modes de requête proposés par Amazon QuickSight pour interroger les sources de données telles qu'Amazon Athena, Amazon Redshift ou Snowflake ?",
    "type": "single",
    "options": [
      "A) Le mode SPICE (importation en cache mémoire) et le mode Requête directe (Direct Query)",
      "B) Le mode Batch quotidien et le mode Disquette",
      "C) Le mode Hors-ligne absolu et le mode FTP",
      "D) Le mode Webhook et le mode Polling continu"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car QuickSight propose le mode SPICE (les données sont pré-chargées en mémoire pour une réactivité maximale) et le mode Direct Query (la requête SQL est soumise en direct à la base de données source à chaque interaction utilisateur). L'option B est fausse car le mode disquette est obsolète et n'a jamais existé dans le cloud. L'option C est fausse car le mode FTP n'est pas un protocole de requêtage SQL analytique interactif. L'option D est fausse car les webhooks sont des notifications HTTP et non des modes d'interrogation de bases de données.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "quicksight",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/quicksight/latest/user/refreshing-imported-data.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q226",
    "statement": "Une équipe souhaite intégrer un tableau de bord QuickSight interactif directement au sein d'un portail applicatif interne pour ses clients professionnels, avec authentification unique via jeton fédéré. Comment s'appelle cette fonctionnalité ?",
    "type": "single",
    "options": [
      "A) L'intégration de tableaux de bord (Embedded Dashboards)",
      "B) La capture d'écran périodique par e-mail",
      "C) L'export au format PDF imprimé",
      "D) Le tunneling SSH brut"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car QuickSight Embedded Dashboards permet d'intégrer des visualisations, tableaux de bord ou la barre de recherche Q directement dans des applications d'entreprise via un SDK JavaScript avec authentification transparente. L'option B est fausse car les captures d'écran par e-mail sont statiques et ne permettent aucune exploration interactive des filtres. L'option C est fausse car le PDF est un support figé sans interactivité. L'option D est fausse car le tunneling SSH n'est pas une solution d'intégration de composants d'interface web utilisateur.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "quicksight",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/quicksight/latest/user/embedded-dashboards.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q227",
    "statement": "Quelle édition d'Amazon QuickSight est requise pour bénéficier des fonctionnalités d'authentification unique fédérée (SAML/SSO), de la sécurité au niveau des colonnes et de la connectivité aux bases de données déployées dans un VPC privé ?",
    "type": "single",
    "options": [
      "A) QuickSight Enterprise Edition",
      "B) QuickSight Standard Edition",
      "C) QuickSight Free Tier éternel",
      "D) QuickSight Community Edition"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'édition Entreprise (Enterprise Edition) de QuickSight est indispensable pour disposer des capacités avancées telles que la fédération d'identités SAML, le chiffrement personnalisé KMS, les connexions privées VPC, RLS/CLS et QuickSight Q. L'option B est fausse car la Standard Edition ne supporte pas les connexions privées dans les VPC ni la sécurité au niveau des colonnes. L'option C est fausse car l'offre gratuite d'évaluation ne constitue pas une édition permanente d'entreprise. L'option D est fausse car l'édition Community n'est pas une licence commerciale de produit QuickSight.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "quicksight",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/quicksight/latest/user/editions.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q228",
    "statement": "Comment peut-on automatiser le rafraîchissement d'un jeu de données SPICE après l'exécution réussie d'un pipeline de transformation de données AWS Step Functions ?",
    "type": "single",
    "options": [
      "A) En appelant l'action d'API CreateIngestion de QuickSight via une étape de la machine à états Step Functions",
      "B) En redémarrant le navigateur web du client",
      "C) En supprimant et recréant le compte AWS de l'entreprise",
      "D) En programmant une tâche cron locale sur le PC de l'ingénieur"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'appel à l'API 'CreateIngestion' d'Amazon QuickSight déclenche un rafraîchissement asynchrone des données dans SPICE; intégrer cet appel à la fin du workflow Step Functions garantit une synchronisation parfaite dès la fin des calculs ETL. L'option B est fausse car redémarrer le navigateur local ne déclenche aucun rafraîchissement du cache serveur SPICE. L'option C est fausse car supprimer le compte détruirait toute l'infrastructure d'entreprise. L'option D est fausse car un cron local sur un poste individuel est fragile et non intégré à l'orchestration cloud.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "quicksight",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/quicksight/latest/APIReference/API_CreateIngestion.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q229",
    "statement": "Dans un modèle d'infrastructure en tant que code AWS CloudFormation, quelle fonction intrinsèque permet d'extraire la valeur d'un attribut spécifique d'une ressource (comme l'ARN d'un flux Kinesis ou l'URL d'un point de terminaison) ?",
    "type": "single",
    "options": [
      "A) Fn::GetAtt (ou !GetAtt)",
      "B) Fn::Ref (ou !Ref)",
      "C) Fn::Base64",
      "D) Fn::Join"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la fonction intrinsèque Fn::GetAtt (syntaxe courte !GetAtt) renvoie la valeur d'un attribut particulier d'une ressource définie dans le modèle, comme son Amazon Resource Name (Arn). L'option B est fausse car Fn::Ref (!Ref) renvoie généralement l'identifiant physique de la ressource ou la valeur d'un paramètre, mais ne permet pas de cibler un attribut nommé spécifique. L'option C est fausse car Fn::Base64 encode une chaîne en Base64 (souvent utilisé pour UserData sur EC2). L'option D est fausse car Fn::Join concatène une liste de valeurs avec un délimiteur spécifié.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudformation-ssm-cdk",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q230",
    "statement": "Quelle fonctionnalité d'AWS CloudFormation permet de détecter les écarts lorsqu'une ressource gérée par une pile a été modifiée manuellement en dehors de CloudFormation (par exemple via la console AWS) ?",
    "type": "single",
    "options": [
      "A) La détection de dérive (Drift Detection)",
      "B) Les jeux de modifications (Change Sets)",
      "C) Les politiques de pile (Stack Policies)",
      "D) La protection contre la résiliation (Termination Protection)"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la détection de dérive (Drift Detection) compare la configuration déclarée dans le modèle CloudFormation avec la configuration réelle des ressources déployées pour signaler les modifications extérieures non tracées. L'option B est fausse car les Change Sets permettent de prévisualiser les impacts avant d'appliquer une mise à jour de pile. L'option C est fausse car les politiques de pile empêchent la mise à jour accidentelle de ressources critiques lors des déploiements. L'option D est fausse car la protection contre la résiliation empêche la suppression accidentelle de la pile entière.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudformation-ssm-cdk",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q231",
    "statement": "Avant d'appliquer une mise à jour à une pile CloudFormation de production contenant une base Redshift, quelle bonne pratique permet d'inspecter l'impact des modifications et de vérifier si la ressource sera remplacée ou mise à jour sur place ?",
    "type": "single",
    "options": [
      "A) Créer et examiner un jeu de modifications (Change Set)",
      "B) Exécuter directement cfn update-stack sans vérification",
      "C) Supprimer la base de production pour la recréer proprement",
      "D) Désactiver CloudTrail"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'examen d'un Change Set montre précisément les actions que CloudFormation entreprendra, en précisant si les ressources seront modifiées sur place ou subiront un remplacement (Replacement: True), ce qui évite les destructions imprévues de données. L'option B est fausse car mettre à jour sans Change Set expose à des remplacements d'instances ou de clusters destructeurs. L'option C est fausse car supprimer la base détruirait les données de production des utilisateurs. L'option D est fausse car désactiver CloudTrail supprime la traçabilité et n'apporte aucune aide à la validation du déploiement.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudformation-ssm-cdk",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q232",
    "statement": "Quel outil open-source d'AWS permet aux ingénieurs de définir leur infrastructure cloud en utilisant des langages de programmation modernes familiers (tels que TypeScript, Python, ou Java) avant de la synthétiser en modèles CloudFormation ?",
    "type": "single",
    "options": [
      "A) AWS Cloud Development Kit (AWS CDK)",
      "B) AWS SAM CLI pur",
      "C) AWS CodeArtifact",
      "D) AWS Systems Manager Fleet Manager"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car AWS CDK (Cloud Development Kit) permet de définir les architectures en utilisant des constructions orientées objet dans des langages standards, synthétisant ensuite du code JSON/YAML CloudFormation propre et réutilisable. L'option B est fausse car SAM CLI est axé sur le développement d'applications serverless et s'appuie sur une extension de syntaxe YAML. L'option C est fausse car CodeArtifact est un référentiel de packages logiciels sécurisé (npm, PyPI, Maven). L'option D est fausse car Fleet Manager administre les flottes de serveurs physiques et virtuels.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudformation-ssm-cdk",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/cdk/v2/guide/home.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q233",
    "statement": "Dans quel cas devez-vous privilégier AWS Secrets Manager plutôt qu'AWS Systems Manager Parameter Store pour gérer un mot de passe d'administrateur de base de données Amazon Redshift ?",
    "type": "single",
    "options": [
      "A) Lorsque la rotation automatique et planifiée des identifiants (Automatic Secret Rotation) est exigée sans développement de code personnalisé",
      "B) Lorsque le mot de passe ne change jamais et doit être stocké en texte clair",
      "C) Lorsque le budget mensuel pour le stockage des mots de passe doit être strictement de 0 dollar",
      "D) Lorsque le mot de passe est utilisé uniquement par un utilisateur physique sur son PC"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car AWS Secrets Manager intègre nativement la rotation automatique des mots de passe (avec des fonctions Lambda prédéfinies pour RDS, Redshift et DocumentDB), alors que Parameter Store exige le développement et l'orchestration manuelle de cette logique. L'option B est fausse car aucun mot de passe de production ne doit être stocké en texte clair. L'option C est fausse car Parameter Store Standard est gratuit, alors que Secrets Manager facture des frais par secret et par appel d'API. L'option D est fausse car les identifiants d'utilisateurs humains s'authentifient via IAM Identity Center et non via des mots de passe codés en dur.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudformation-ssm-cdk",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q234",
    "statement": "Comment un modèle CloudFormation peut-il récupérer de manière sécurisée la valeur chiffrée d'un mot de passe stocké dans SSM Parameter Store au moment du déploiement sans l'inscrire en clair dans le code du template ?",
    "type": "single",
    "options": [
      "A) En utilisant le type de paramètre dynamique 'resolve:ssm-secure:<parameter-name>'",
      "B) En écrivant le mot de passe directement en clair dans la section Parameters",
      "C) En faisant un appel curl depuis le script UserData",
      "D) En désactivant le chiffrement KMS sur le paramètre"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le modèle de résolution dynamique '{{resolve:ssm-secure:<parameter-name>}}' permet à CloudFormation d'extraire la valeur déchiffrée directement depuis SSM Parameter Store au moment de l'instanciation de la ressource sans jamais l'exposer dans les modèles ou les journaux. L'option B est fausse car écrire un secret en clair dans le code source viole les règles de sécurité fondamentales. L'option C est fausse car les appels curl nécessiteraient des clés d'accès exposées et une tuyauterie logicielle inutile. L'option D est fausse car désactiver le chiffrement exposerait les secrets de l'entreprise.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "cloudformation-ssm-cdk",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q235",
    "statement": "Dans le cadre de la conception d'un plan de reprise d'activité après sinistre (Disaster Recovery), que représente précisément l'objectif de point de reprise (Recovery Point Objective - RPO) pour un entrepôt de données ?",
    "type": "single",
    "options": [
      "A) La durée maximale acceptable de perte de données mesurée en temps (par exemple, tolérer la perte de 15 minutes de transactions)",
      "B) Le temps nécessaire pour restaurer les serveurs et rendre le système à nouveau opérationnel",
      "C) Le coût financier total des licences logicielles",
      "D) Le pourcentage de code couvert par les tests unitaires"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le RPO (Recovery Point Objective) quantifie le volume acceptable de données perdues en cas de panne, mesuré sous la forme de l'intervalle de temps séparant le sinistre de la dernière sauvegarde valide. L'option B est fausse car le temps nécessaire pour restaurer le service correspond au RTO (Recovery Time Objective). L'option C est fausse car le RPO est une mesure temporelle de perte de données et non une métrique comptable. L'option D est fausse car la couverture de tests unitaires relève de l'ingénierie logicielle et non du plan de continuité d'activité.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "well-architected",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/recovery-point-objective-rpo-and-recovery-time-objective-rto.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q236",
    "statement": "Parmi les stratégies de reprise d'activité (Disaster Recovery) sur AWS, laquelle offre le temps de reprise le plus rapide (RTO quasi nul) et la perte de données minimale (RPO quasi nul), mais avec le coût d'infrastructure le plus élevé ?",
    "type": "single",
    "options": [
      "A) Multi-site actif-actif (Multi-Region Active-Active)",
      "B) Sauvegarde et restauration (Backup and Restore)",
      "C) Veilleuse (Pilot Light)",
      "D) Veille active (Warm Standby)"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'architecture Multi-Site Actif-Actif déploie l'application et les données synchronisées en temps réel sur plusieurs régions AWS traitant le trafic simultanément; le basculement est instantané mais les coûts d'infrastructure sont maximaux. L'option B est fausse car Backup and Restore a le coût le plus faible mais des RTO/RPO de plusieurs heures. L'option C est fausse car Pilot Light maintient les données répliquées et une infrastructure minimale éteinte prête à démarrer. L'option D est fausse car Warm Standby maintient une version réduite mais active de l'infrastructure nécessitant un redimensionnement lors du sinistre.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "well-architected",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q237",
    "statement": "Quel pilier du cadre AWS Well-Architected Framework recommande d'automatiser les déploiements de pipelines de données via l'Infrastructure as Code (IaC), de surveiller les indicateurs clés et d'apprendre de chaque incident opérationnel ?",
    "type": "single",
    "options": [
      "A) Le pilier Excellence opérationnelle (Operational Excellence)",
      "B) Le pilier Sécurité",
      "C) Le pilier Efficacité des performances",
      "D) Le pilier Durabilité"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le pilier Excellence opérationnelle se concentre sur l'exécution et la surveillance des systèmes, l'automatisation des changements via le code et l'amélioration continue des processus opérationnels. L'option B est fausse car le pilier Sécurité traite de la protection des données, de la gestion des identités et du chiffrement. L'option C est fausse car le pilier Efficacité des performances optimise l'utilisation des ressources informatiques. L'option D est fausse car le pilier Durabilité minimise l'impact environnemental et l'empreinte carbone des charges de travail.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "well-architected",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q238",
    "statement": "Dans le pilier Optimisation des coûts (Cost Optimization) du Well-Architected Framework appliqué au Big Data, quelle pratique évite de payer pour des capacités de calcul inactives lors des traitements de nuit ?",
    "type": "single",
    "options": [
      "A) Utiliser des architectures sans serveur (Serverless) ou des clusters éphémères (EMR on EKS/EC2) qui s'arrêtent dès que le job est terminé",
      "B) Conserver des clusters surprovisionnés allumés 24h/24 au cas où des requêtes arriveraient",
      "C) Désactiver les sauvegardes de bases de données",
      "D) Supprimer les rôles IAM de sécurité"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'adoption de technologies serverless (Glue, Athena, Redshift Serverless) ou de clusters éphémères EMR terminés après exécution garantit que l'entreprise ne paie strictement que pour les ressources consommées pendant le calcul. L'option B est fausse car conserver des serveurs allumés en continu pour des traitements sporadiques engendre des gaspillages majeurs de budget. L'option C est fausse car désactiver les sauvegardes met en péril la résilience et viole le pilier Fiabilité. L'option D est fausse car supprimer les rôles IAM détruit la sécurité sans impacter directement les coûts.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "well-architected",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q239",
    "statement": "Comment l'approche de tolérance aux pannes (Fault Tolerance) est-elle mise en œuvre dans un pipeline de données distribué sur Amazon EMR selon le pilier Fiabilité (Reliability) ?",
    "type": "single",
    "options": [
      "A) En hébergeant les données persistantes sur Amazon S3 (découplage calcul/stockage) et en utilisant des nœuds principaux Multi-AZ avec basculement automatique",
      "B) En stockant toutes les données critiques uniquement sur le disque système de l'instance principale EMR",
      "C) En désactivant les retries Spark en cas d'erreur de tâche",
      "D) En utilisant un unique serveur physique pour tous les calculs"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car le découplage du calcul et du stockage (données conservées durablement sur S3) permet à un cluster EMR de perdre des nœuds de calcul sans risque de perte de données; les nœuds maîtres haute disponibilité Multi-AZ évitent le point unique de défaillance. L'option B est fausse car stocker les données sur le disque local de l'hôte principal entraîne la perte totale des données en cas de panne de l'instance. L'option C est fausse car désactiver les tentatives automatiques (retries) rend le pipeline extrêmement fragile à la moindre défaillance transitoire. L'option D est fausse car un unique serveur constitue un point de défaillance critique (SPOF).",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "well-architected",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q240",
    "statement": "Quelle lentille spécialisée du Well-Architected Framework fournit des recommandations architecturales dédiées à la conception de pipelines de données, de Data Lakes et de plateformes de streaming sur AWS ?",
    "type": "single",
    "options": [
      "A) La lentille Analytics (Data Analytics Lens)",
      "B) La lentille Jeux vidéo",
      "C) La lentille Militaire",
      "D) La lentille Télécom mobile"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car l'Analytics Lens du Well-Architected Framework détaille les meilleures pratiques pour concevoir, déployer et auditer des architectures analytiques (ingestion, stockage, traitement, visualisation et gouvernance) sur AWS. L'option B est fausse car la lentille jeux vidéo se concentre sur les serveurs de jeux multijoueurs à faible latence. L'option C est fausse car il n'existe pas de lentille militaire standard dans le catalogue public Well-Architected. L'option D est fausse car les architectures télécom se focalisent sur la 5G et la virtualisation des fonctions réseau.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "well-architected",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/wellarchitected/latest/analytics-lens/analytics-lens.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q241",
    "statement": "Quel outil AWS permet de créer des alertes budgétaires préventives et peut exécuter automatiquement des actions correctives (comme attacher une politique IAM restrictive ou arrêter des instances) lorsqu'un seuil prévisionnel de dépenses est dépassé ?",
    "type": "single",
    "options": [
      "A) AWS Budgets",
      "B) AWS Billing Conductor",
      "C) AWS Cost and Usage Report (CUR)",
      "D) AWS Marketplace"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car AWS Budgets permet de définir des budgets personnalisés avec seuils réels ou prévisionnels et supporte les actions automatiques (Budget Actions) pour appliquer des politiques de restriction ou arrêter des ressources hors budget. L'option B est fausse car Billing Conductor sert à personnaliser la facturation pour les revendeurs et filiales sans déclencher d'actions correctives de ressources. L'option C est fausse car CUR est un export de fichiers détaillés de facturation sur S3 sans déclenchement d'actions automatiques. L'option D est fausse car AWS Marketplace est une boutique d'achat de logiciels tiers.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "facturation-couts-support",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q242",
    "statement": "Pour attribuer précisément les coûts de calcul et de stockage AWS aux différents projets ou départements de l'entreprise dans AWS Cost Explorer, quelle méthode est recommandée ?",
    "type": "single",
    "options": [
      "A) Définir des balises d'allocation des coûts (Cost Allocation Tags) et les activer dans la console de gestion de facturation",
      "B) Demander à chaque développeur d'envoyer sa facture par courrier postal",
      "C) Utiliser un compte AWS différent pour chaque heure de la journée",
      "D) Désactiver le suivi des métriques dans CloudWatch"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car les balises d'allocation de coûts (Cost Allocation Tags) permettent d'étiqueter les ressources (ex: Projet, CentreDeCout) et d'agréger les dépenses correspondantes dans Cost Explorer et les rapports de facturation. L'option B est fausse car la gestion papier manuelle est irréaliste pour imputer des micro-consommations cloud à la seconde. L'option C est fausse car multiplier les comptes par heure de la journée est ingérable et absurde. L'option D est fausse car désactiver CloudWatch n'a aucun lien avec la ventilation des coûts par projet.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "facturation-couts-support",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/cost-management/latest/userguide/cost-alloc-tags.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q243",
    "statement": "Quelle option d'engagement financier AWS offre le plus de flexibilité pour réduire les coûts de calcul (jusqu'à 66 % d'économie) en s'appliquant automatiquement quelle que soit la famille d'instance, l'OS, la région AWS ou le service utilisé (EC2, Fargate, Lambda) ?",
    "type": "single",
    "options": [
      "A) Compute Savings Plans",
      "B) EC2 Instance Savings Plans",
      "C) Instances réservées standard régionales",
      "D) Instances Spot ponctuelles"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car Compute Savings Plans offre la plus grande flexibilité en réduisant automatiquement les coûts sur l'ensemble des usages de calcul EC2 (quelle que soit la famille, l'OS ou la région), AWS Fargate et AWS Lambda en échange d'un engagement d'un montant horaire fixe sur 1 ou 3 ans. L'option B est fausse car EC2 Instance Savings Plans est plus rigide et lié à une famille d'instances précise dans une région spécifique. L'option C est fausse car les instances réservées standard sont limitées à des types d'instances et des configurations fermes. L'option D est fausse car les instances Spot ne sont pas un plan d'engagement financier mais une offre excédentaire interruptible.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "facturation-couts-support",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q244",
    "statement": "Quel plan de support AWS donne accès à un gestionnaire de compte technique dédié (Technical Account Manager - TAM), à un support d'infrastructure proactif et à un temps de réponse garanti de moins de 15 minutes pour les pannes critiques pour l'entreprise (business-critical) ?",
    "type": "single",
    "options": [
      "A) AWS Enterprise Support",
      "B) AWS Business Support",
      "C) AWS Developer Support",
      "D) AWS Basic Support"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car seul le plan AWS Enterprise Support inclut un TAM désigné dédié à l'entreprise, des revues opérationnelles d'architecture et un délai de première réponse garanti inférieur à 15 minutes 24h/24 pour les incidents de niveau critique. L'option B est fausse car le plan Business Support garantit un délai de réponse sous 1 heure mais n'inclut pas de TAM dédié. L'option C est fausse car le plan Developer Support ne répond qu'aux heures de bureau avec un SLA de 12 heures pour les problèmes généraux. L'option D est fausse car le support Basic est gratuit et ne donne accès à aucun technicien d'assistance pour les pannes logicielles.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "facturation-couts-support",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://aws.amazon.com/premiumsupport/plans/",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q245",
    "statement": "Dans AWS Cost Explorer, quelle fonctionnalité permet d'anticiper les dépenses des 12 prochains mois sur la base des tendances historiques de consommation des services ?",
    "type": "single",
    "options": [
      "A) L'outil de prévision des dépenses (Cost Forecasting)",
      "B) L'estimateur de volume EBS",
      "C) La réinitialisation des quotas de service",
      "D) Le journal d'audit CloudTrail"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car Cost Forecasting dans AWS Cost Explorer modélise les consommations passées pour projeter les dépenses futures sur un horizon allant jusqu'à 12 mois, assorti d'un intervalle de confiance statistique. L'option B est fausse car l'estimateur EBS ne concerne que le dimensionnement technique des disques. L'option C est fausse car la réinitialisation des quotas ajuste les limites techniques d'API et ne prévoit aucun coût. L'option D est fausse car CloudTrail journalise les appels d'API sans produire de projection budgétaire financière.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "facturation-couts-support",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-forecast.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  },
  {
    "id": "dea-q246",
    "statement": "Quelle unité d'organisation AWS permet de consolider la facturation de centaines de comptes membres, d'obtenir des remises sur volume agrégées et de centraliser le partage des Savings Plans à l'échelle de l'entreprise ?",
    "type": "single",
    "options": [
      "A) AWS Organizations avec facturation consolidée (Consolidated Billing)",
      "B) Un groupe de sécurité réseau VPC",
      "C) Une passerelle VPN matérielle",
      "D) Un bucket S3 public"
    ],
    "expected_answer": [
      "A"
    ],
    "explanation": "L'option A est correcte car la facturation consolidée dans AWS Organizations regroupe toutes les consommations des comptes membres sous une seule facture mensuelle, permettant d'atteindre plus vite les paliers de remises sur volume et de partager les réductions de Savings Plans. L'option B est fausse car un Security Group est un pare-feu réseau au niveau instance et n'a aucun lien avec la comptabilité. L'option C est fausse car une passerelle VPN relie des réseaux physiques et ne gère pas de factures financières. L'option D est fausse car un bucket S3 public stocke des objets accessibles sans gérer de gouvernance de comptes multiples.",
    "domain": "Domaine 3 : Opérations et support des données (22 %)",
    "topic_id": "facturation-couts-support",
    "difficulty": "moyen",
    "recommended_time_sec": 120,
    "source_url": "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html",
    "provenance": "générée par IA et vérifiée dans la documentation (2026-10-31)",
    "verification_date": "2026-10-31"
  }
];
