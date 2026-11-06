# CONTEXTE COMMUN (à lire en entier avant toute action)

## 1. Qui je suis et ce que je veux
Je m'appelle Auren. Je suis ingénieur (EPITA), en alternance dans la data et l'IA. Mon contrat se termine le 2 avril 2027.
Objectif : décrocher un CDI. Priorité 1 : Data Engineer. Priorité 2 : AI Engineer. Ensuite : Machine Learning Engineer, puis Data Scientist.
Je ne suis pas débutant : je connais Python, SQL, Snowflake (SnowPro Core obtenue le 29 octobre 2026), les bases de dbt (dbt Fundamentals), du ML et des LLM. Mon anglais est de niveau B2 : écris tout en français, garde les termes techniques anglais usuels.

## 2. Mon temps (contrainte absolue)
Je dispose de 8 à 10 heures par semaine pour TOUT : certifications ET entraînement aux entretiens. Les semaines de fêtes sont allégées (6 heures).
Le détail semaine par semaine est dans `data/planning_hebdo.json` (budget certification + budget entretiens pour chaque semaine).
Ne crée jamais une dette de travail impossible à rattraper.

## 3. Mes trois certifications (ordre fixe)
1. AWS Certified Cloud Practitioner (CLF-C02) : examen visé le vendredi 20 novembre 2026.
2. AWS Certified Data Engineer Associate (DEA-C01) : examen visé le jeudi 4 ou vendredi 5 février 2027 (priorité très élevée, c'est la plus importante).
3. dbt Analytics Engineering : examen visé le vendredi 19 mars 2027, reportable sans conséquence.
Les certifications ne doivent jamais monopoliser tout mon temps : l'entraînement aux entretiens continue pendant les certifications.

## 4. Fichiers fournis (dossier `data/`)
- `catalogue_formations.json` : mes 5 cours Udemy (liste complète des leçons, durées, état d'avancement au 31 octobre 2026, blocs thématiques et priorités) et la liste des ressources AWS Skill Builder.
- `planning_hebdo.json` : le planning semaine par semaine du 2 novembre 2026 au 2 avril 2027 (tâches, plages de leçons, durées estimées, priorités core ou bonus, examens, points de contrôle).
- `carte_des_sujets.json` : correspondance entre chaque sujet technique (S3, Glue, Kinesis, snapshots dbt, etc.) et les leçons de mes cours.
- `skillbuilder_aws.json` : ressources officielles AWS Skill Builder retenues (revues de domaine, jeux de questions officiels, micro-certifications).
- `programme_cible_chapitres.md` : la liste des modules et chapitres que je veux pour la préparation aux entretiens.
- `planning_hebdo_lisible.md` : le même planning, lisible par un humain.
Ces fichiers sont ma référence. Si tu constates une incohérence entre eux, signale-la dans ton rapport au lieu de deviner.

## 5. Mes cours (je les suis chez eux, l'application ne les remplace pas)
- Udemy, cours principal CLF : « AWS Certified Cloud Practitioner CLF-C02 2026 (en français) » (Amadou Merico), départ strict à 0 % (toutes les leçons dès la numéro 1).
- Udemy, cours principal DEA : « AWS Certified Data Engineer Associate 2026 - Hands On! » (Stéphane Maarek et Frank Kane).
- Udemy, cours secondaire DEA : « Complete AWS Certified Data Engineer Associate - DEA-C01 » (Nikolai Schuler), utilisé surtout pour son examen blanc.
- Udemy, 6 examens blancs DEA-C01 (390 questions).
- Udemy, cours principal dbt : « The Complete dbt Bootcamp: Zero to Hero + Certification Prep » (Zoltan C. Toth), départ strict à 0 % (toutes les leçons dès la numéro 1).
- Udemy, cours dbt de complément : « The Complete dbt Certification Course » (Daniel Weigel).
- AWS Skill Builder (gratuit) : revues de domaine, jeux de questions officiels, micro-certifications.
Dans l'application, ces cours apparaissent par leur NOM et leurs NUMÉROS DE LEÇONS (par exemple « cette semaine : cours Maarek et Kane, leçons 167 à 183 »), jamais par des liens obligatoires. Quand un chapitre de l'application traite un sujet couvert par un cours, renvoie vers les leçons correspondantes (voir `carte_des_sujets.json`).

## 6. Contraintes techniques
- Application locale pour PC Windows, utilisable chaque jour, démarrage par une commande simple.
- Zéro budget : outils gratuits et open source, aucun abonnement, aucune API d'IA payante, aucun compte utilisateur.
- Données conservées localement, avec sauvegarde et restauration.
- Le contenu pédagogique fonctionne sans connexion à un modèle d'IA externe. Les fonctions IA éventuelles sont optionnelles.
- Interface en français, sobre, moderne, responsive, mode sombre, accessible.

## 7. Règles non négociables
1. Honnêteté des sources : toute affirmation technique importante a une source (URL et date de consultation). Sinon, marque-la « non vérifié ».
2. Ne présente jamais une question générée par toi comme une vraie question d'entretien ou d'examen. Chaque question porte une étiquette de provenance : `officielle`, `communauté (URL)`, `générée par IA et vérifiée dans la documentation (date)` ou `générée par IA non vérifiée`.
3. Droit d'auteur : ne copie pas les cours Udemy, le contenu AWS Skill Builder, les cours payants, les plateformes d'exercices ni de questions d'examen réelles (aucun « braindump »). Tu références (nom du cours, numéros de leçons), tu rédiges avec tes propres mots à partir de la documentation officielle.
4. Aucune donnée fictive présentée comme un vrai résultat. Les données de démonstration sont clairement identifiées et supprimables en un clic.
5. Chaque bouton fait une vraie action. Teste dans le navigateur. Ne considère jamais qu'une fonctionnalité est terminée parce que son interface existe, ni qu'un test passe sans l'avoir exécuté.
6. Vérifie les programmes d'examen et les versions sur les sites officiels au moment du travail, et note la date de vérification.
7. N'utilise jamais de tirets cadratins (le long tiret) dans les textes de l'application et de la documentation : préfère les deux-points, les virgules ou les parenthèses.
8. Respecte le périmètre de CE prompt uniquement. À la fin, écris le rapport demandé, puis ARRÊTE-TOI. Ne commence pas le prompt suivant.
9. Décisions techniques : tu es autorisé à les prendre sans me consulter. Documente les importantes dans `docs/DECISIONS.md` et chaque hypothèse dans `docs/HYPOTHESES.md`.
10. Si tu peux utiliser plusieurs agents spécialisés (recherche, pédagogie, développement, tests), fais-le et vérifie la cohérence de leurs livrables.
11. Règle absolue de départ à 0 % : je repars de 0 % sur l'intégralité des 5 cours Udemy (Merico, Maarek/Kane, Nikolai, Toth, Weigel) et des 3 certifications (CLF-C02, DEA-C01, dbt). Toutes les leçons démarrent dès la numéro 1 dans le catalogue, le planning et la base SQLite locale. Ne présume jamais qu'une leçon est déjà acquise, déjà commencée ou déjà avancée.


---

# PROMPT 4 sur 4 : Préparation aux entretiens (cours, éditeurs, questions, simulateur) et validation finale

## Rappels issus de la relecture de la phase 1 (à respecter)
- Provenance des questions : dans `docs/03_sources_entretiens.md`, les thèmes dits « attestés par retours de candidats » citent seulement des pages d'accueil (r/dataengineering, LeetCode Discuss, r/LocalLLaMA), sans lien vers un fil précis. Tant qu'un lien précis (URL du fil et date) n'existe pas pour une question, son étiquette est `générée par IA` ou `thème plausible, non attesté`, jamais `communauté`. Ne présente aucune question comme « réellement posée » sans ce lien.
- Les chiffres de `docs/02_analyse_marche.md` sont indicatifs et non vérifiés : l'application ne les affiche jamais comme des statistiques réelles.
- Le planning des entretiens de `docs/05` fait foi pour l'ordre des chapitres et les durées. Les durées de `docs/04` diffèrent parfois : signale l'écart.


Tu agis comme une équipe de développeurs, de formateurs et de recruteurs techniques Data et AI. Ce prompt est la PHASE 4. Les phases 1 à 3 sont validées : relis `docs/RAPPORT_PHASE_1.md` (surtout `04_programme_pedagogique.md` et `03_sources_entretiens.md`), `docs/RAPPORT_PHASE_2.md` et `docs/RAPPORT_PHASE_3.md`.

## Mission
Ajouter à l'application tout ce qui prépare mes entretiens techniques de Data Engineer et d'AI Engineer : cours, éditeurs SQL et Python qui exécutent vraiment du code, banque d'exercices, banque de questions, simulateur d'entretien, suivi de compétences, espace projets. Termine par une validation complète de l'ensemble.

## Méthode obligatoire (par lots, avec arrêt de contrôle à la fin de chacun)
Lot A : éditeur SQL et exercices SQL. Lot B : éditeur Python et exercices Python. Lot C : cours Data Engineering et AI Engineering. Lot D : banque de questions d'entretien et simulateur. Lot E : compétences, projets, validation finale.
À la fin de chaque lot : tests exécutés, mini-rapport dans `docs/RAPPORT_PHASE_4.md`, puis passe au lot suivant. Respecte le budget : mon entraînement aux entretiens représente seulement 1 à 2 heures par semaine pendant les certifications (voir `planning_hebdo.json`), donc le contenu doit être dense et priorisé, pas exhaustif.

## Lot A : SQL
- Éditeur SQL qui exécute vraiment les requêtes dans le navigateur (DuckDB-WASM, ou SQLite si c'est plus robuste ; justifie dans `docs/DECISIONS.md`).
- 4 jeux de données réalistes (par exemple : e-commerce, événements de streaming/produit, RH, transactions bancaires) avec des défauts volontaires (doublons, NULL, dates incohérentes) pour travailler le nettoyage.
- Banque de 100 à 150 exercices progressifs couvrant : SELECT/WHERE, GROUP BY/HAVING, jointures, UNION, sous-requêtes, CTE, fonctions de fenêtre (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, QUALIFY si le moteur le permet), CASE WHEN, dates, déduplication, transactions, index, EXPLAIN, optimisation, modélisation (étoile, flocon), SQL pour le Data Engineering (incrémental, SCD2, upsert).
- Chaque exercice : énoncé, énoncé de contexte, difficulté, temps recommandé, vérification automatique (comparaison des résultats avec tolérance sur l'ordre quand il n'est pas imposé), solution de référence, explication détaillée, erreurs fréquentes, indice optionnel. La solution n'est jamais montrée avant une tentative.
- Mode chronométré. Les exercices ratés alimentent la répétition espacée.
- Marque les exercices inspirés de sources recensées en phase 1 avec la source ; les exercices écrits par toi sont étiquetés « original ».

## Lot B : Python
- Éditeur Python qui exécute le code dans le navigateur (Pyodide dans un Web Worker) avec limite de temps (le worker est arrêté de force), limite de sortie, aucun accès réseau ni fichier de ma machine.
- Banque de 60 à 100 exercices : structures de données, listes/dictionnaires/ensembles, compréhensions, chaînes, tri et recherche, complexité Big O, fonctions avancées, générateurs et itérateurs, POO, décorateurs, gestionnaires de contexte, exceptions, typage, logging, tests unitaires, pandas, NumPy, JSON, appels d'API REST (simulés hors connexion), FastAPI (lecture de code et petits exercices), débogage.
- Chaque exercice : énoncé, tests unitaires cachés exécutés à la validation, solution de référence, comparaison de ma solution avec la référence, explication, complexité attendue.

## Lot C : cours Data Engineering et AI Engineering (condensés)
Base : `docs/04_programme_pedagogique.md`. Structure d'un chapitre : objectifs, explication claire, définitions, exemples concrets, exemples de code, erreurs fréquentes, questions d'entretien associées, exercices, correction détaillée, renvois « voir aussi » vers mes cours Udemy (leçons) et vers les chapitres de certification de la phase 3 pour éviter le doublon.
- Data Engineering (priorité 1) : ETL contre ELT, batch contre streaming, pipelines, lac, entrepôt, lakehouse, modélisation, qualité, gouvernance, Spark/PySpark, Kafka, Airflow, partitionnement, formats de fichiers, traitement incrémental, idempotence, orchestration, lineage, monitoring, sécurité, AWS, Snowflake, Databricks, dbt. Inclure des exercices de conception : pipeline de 10 millions de lignes par jour, gestion des doublons, pipeline incrémental, gestion des échecs, idempotence, batch contre streaming, optimisation Spark.
- AI Engineering (priorité 2) : bases du ML, réseaux de neurones, transformers, LLM, tokenisation, embeddings, bases vectorielles, RAG, découpage (chunking), recherche, reranking, fine-tuning, prompt engineering, LangChain, LangGraph, évaluation des RAG et des LLM, hallucinations, garde-fous, intégration d'API, déploiement, monitoring, coût, architecture d'IA en production. Inclure des cas pratiques d'architecture.
- Modules ML (5) et Software Engineering (6) : fiches de référence courtes seulement, sauf si la phase 1 a décidé autrement.
Les sources techniques sont des documentations officielles, citées avec URL et date. Aucun cours payant n'est recopié.

## Lot D : banque de questions et simulateur
- Banque d'au moins 300 questions d'entretien classées par métier, technologie, difficulté, thème et type (connaissances, architecture, live coding, défi SQL, défi Python, débogage, étude de cas, system design, comportemental, présentation de projet). Chaque question : énoncé, réponse attendue, explication détaillée, exemple pratique, temps recommandé, étiquette de provenance (règle 2 du contexte commun) et source quand elle existe.
- Seules les questions avec une source de type « communauté » ou « officielle » peuvent être dites réellement posées en entretien. Les autres sont étiquetées « générée par IA ».
- Aucune réponse affichée avant ma tentative.
- Simulateur d'entretien : choix du métier (Data Engineer, AI Engineer, ML Engineer, Data Scientist) et du niveau (junior, confirmé, senior : niveaux de DIFFICULTÉ des questions, qui ne prétendent pas que j'ai cette expérience). Une simulation mêle questions, exercice SQL ou Python chronométré, étude de cas, évaluation, correction et recommandations. Résultats enregistrés, erreurs envoyées en répétition espacée.

## Lot E : compétences, projets, validation finale
- Matrice de compétences : niveau initial, niveau actuel, exercices faits, taux de réussite, dernière et prochaine révision, niveau de maîtrise. Règle de maîtrise : jamais « maîtrisé » parce qu'un cours est terminé ; seulement après au moins 3 réussites réparties sur au moins 2 séances espacées.
- Espace projets : modèle de fiche (contexte, problème, architecture, technologies, choix techniques, difficultés, solutions, résultats, questions possibles du recruteur) avec un champ d'entraînement à l'oral. Livre des fiches VIDES : ne remplis rien à ma place, ne devine pas mes projets.
- Validation finale : tests unitaires et de bout en bout sur TOUTES les fonctionnalités (phases 2 à 4), vérification du contenu (script de la phase 3 étendu aux questions d'entretien), sauvegarde et restauration, responsive, performance, accessibilité de base. Fais tourner l'application dans un vrai navigateur et clique réellement chaque fonction.

## Livrables
- Application complète, commande de démarrage unique, guide d'installation et d'usage à jour (`docs/GUIDE_UTILISATEUR.md`).
- Contenu dans `content/entretiens/`.
- `docs/RAPPORT_PHASE_4.md` : liste des fonctionnalités livrées avec preuve de test, nombres d'exercices et de questions par catégorie, fonctionnalités non livrées et pourquoi, limites connues.

## Critères de réussite de la phase 4
- [ ] Je peux écrire une requête SQL et un code Python, les exécuter et voir un résultat vérifié automatiquement.
- [ ] Un exercice ne montre sa solution qu'après tentative.
- [ ] Une simulation d'entretien complète fonctionne de bout en bout et alimente la répétition espacée.
- [ ] Aucune question sans étiquette de provenance.
- [ ] La matrice de compétences ne marque rien « maîtrisé » sans les réussites espacées.
- [ ] Tous les tests ont été exécutés (résultats joints) et la sauvegarde/restauration fonctionne.

Quand tout est terminé, écris `docs/RAPPORT_PHASE_4.md` et présente la liste des limites. C'est la fin du projet.
