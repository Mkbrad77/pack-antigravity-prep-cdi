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

# PROMPT 1 sur 4 : Recherche, vérification et programme pédagogique

Tu agis comme un chef de projet pédagogique spécialisé en Data Engineering et AI Engineering, aidé d'agents de recherche. Ce prompt est la PHASE 1. Tu ne développes AUCUNE application dans ce prompt : tu produis des documents fiables dans le dossier `docs/`, que j'irai valider avant de lancer le prompt 2.

## Mission
Vérifier les faits sur mes trois examens, analyser le marché de l'emploi français, recenser des sources sérieuses sur les entretiens Data et AI, puis construire un programme pédagogique réaliste qui tient dans mon budget d'heures et s'articule avec mon planning de certifications.

## Livrable 1 : `docs/01_verification_examens.md`
Pour chacun des trois examens, vérifie sur les sites officiels (AWS Certification, docs.aws.amazon.com, dbt Labs / getdbt.com) puis consigne, avec URL et date de consultation :
- la version d'examen en vigueur et les changements récents (le cours Maarek parle d'une version 1.1 du DEA-C01 en 2026 ; les cours dbt parlent d'une mise à jour de l'examen en mai/juin 2026) ;
- les domaines et leur poids, le nombre de questions (notées et non notées), la durée, le score minimal, le coût, les langues, la validité ;
- la liste des services AWS dans le périmètre (DEA-C01 : y a-t-il Bedrock, SageMaker, OpenSearch, QuickSight, conteneurs ECS/EKS ? Dis ce qui est explicitement dans le guide officiel et ce qui ne l'est pas) ;
- la version de dbt couverte et les sujets de l'examen dbt (mon guide d'étude indique dbt Core 1.11, 65 questions, 2 heures, 65 % pour réussir, 200 dollars : confirme ou corrige) ;
- les conditions de repassage après un échec (délai d'attente) ;
- DEUX points que mes cours Udemy évoquent et que je veux vérifier : (a) la procédure pour obtenir 30 minutes supplémentaires à un examen AWS quand l'anglais n'est pas sa langue maternelle (mon anglais est B2) et (b) l'offre de réduction de 50 % sur le prochain examen AWS après en avoir réussi un. Décris les conditions exactes et la marche à suivre ;
- une section « Hypothèses de mon planning à confirmer » : examen CLF-C02 environ 65 questions et 90 minutes ; examen DEA-C01 environ 65 questions et 130 minutes ; examens blancs Udemy DEA de 65 questions (390 questions pour 6 tests) ; composition du plan « Exam Prep Plan DEA-C01 » d'AWS Skill Builder. Indique pour chacune : confirmée, corrigée ou non vérifiable.

## Livrable 2 : `docs/02_analyse_marche.md`
Analyse des offres d'emploi CDI récentes en France pour Data Engineer, AI Engineer, ML Engineer et Data Scientist.
- Méthode transparente : sources consultées (pages publiques d'offres), nombre d'offres analysées par métier, dates. Vise au moins 30 offres par métier si c'est faisable avec des pages publiques ; sinon dis combien tu as pu en analyser et ce que cela limite.
- Tableau de fréquence des compétences : Python, SQL, Spark, Kafka, Airflow, AWS, Azure, GCP, Snowflake, Databricks, dbt, Docker, Kubernetes, LLM, RAG, bases vectorielles, MLOps, CI/CD, Terraform.
- Distingue clairement : compétences « demandées dans la majorité des offres » et technologies « simplement citées dans quelques offres ».
- Conclusion en 10 lignes maximum : ce qui justifie (ou non) mon ordre de certifications (CLF, DEA, dbt) et ce que cela implique pour le temps d'entraînement aux entretiens.
Ne fabrique aucune statistique : si tu ne peux pas compter, dis-le.

## Livrable 3 : `docs/03_sources_entretiens.md`
Recense au moins 15 sources sérieuses pour préparer des entretiens Data et AI : documentation officielle (Python, PostgreSQL, Spark, Kafka, dbt, Snowflake, Databricks, scikit-learn, PyTorch, Hugging Face, Docker, FastAPI), plateformes d'exercices (LeetCode, HackerRank, DataLemur, NeetCode, SQLZoo, PGExercises), guides techniques d'entreprises, retours d'expérience de candidats (blogs, discussions publiques).
Pour chaque source : nom, sujet, métier concerné, niveau, URL, type de source, date de consultation, fiabilité (haute, moyenne, basse, avec la raison), intérêt en une phrase, conditions d'utilisation (on peut référencer ou résumer, pas copier).
Puis une synthèse par métier des THÈMES de questions qui reviennent, chaque thème avec au moins une source. Ne présente jamais une question inventée comme une question réellement posée.

## Livrable 4 : `docs/04_programme_pedagogique.md`
Construis le programme à partir de `data/programme_cible_chapitres.md` (modules 1 à 7), en l'adaptant à mon temps réel :
- Estime pour chaque chapitre une durée d'étude en minutes et un niveau d'entrée (je ne suis pas débutant : saute ce que je sais déjà et propose un test diagnostic).
- Classe chaque chapitre : indispensable, utile, optionnel. Les modules 1 (Python), 2 (SQL), 3 (Data Engineering) et 4 (AI Engineering) sont prioritaires. Les modules 5 (ML) et 6 (Software Engineering) deviennent des fiches de référence plus légères. Le module 7 (entretiens) est transversal.
- Calcule honnêtement si le programme tient dans mon budget entretiens (voir `planning_hebdo.json`, champ `interview_budget_min` de chaque semaine). S'il ne tient pas, propose ce qu'on coupe ou ce qu'on reporte après février, avec ta justification.
- Lie les chapitres qui recoupent mes certifications (par exemple : S3, Glue, Kinesis, Redshift, orchestration, idempotence, qualité des données, dbt, modélisation) à `carte_des_sujets.json` pour ne pas me faire travailler deux fois la même chose.

## Livrable 5 : `docs/05_planning_entretiens_et_replanification.md`
- Un planning hebdomadaire de l'entraînement aux entretiens, du 2 novembre 2026 au 2 avril 2027, qui utilise exactement les minutes `interview_budget_min` de chaque semaine du fichier `planning_hebdo.json`. Chaque semaine : sujets, durée, résultat attendu. Démarre par un test diagnostic Python et SQL en semaine 1.
- Une spécification précise du moteur de replanification (algorithme en pseudo-code) : si je rate une séance, ne décale PAS tout le programme ; identifie les priorités (examen le plus proche, tâches « core » avant « bonus ») ; replanifie seulement l'essentiel ; plafonne la charge de la semaine suivante (maximum 10 heures au total) ; sacrifie d'abord les tâches « bonus » ; signale clairement ce qui est abandonné. Donne 6 scénarios chiffrés de test (séance ratée, semaine entière ratée, semaine d'examen, retard sur le DEA, échec à un examen, semaine de fêtes).

## Livrable 6 : `docs/06_bibliotheque_ressources.json`
La bibliothèque de ressources de l'application, avec les champs : nom, sujet, métier associé, niveau, URL, type de source, date de consultation, fiabilité, résumé de l'intérêt. Privilégie les sources officielles pour les connaissances techniques.

## Livrable 7 : `docs/RAPPORT_PHASE_1.md`
Une page : ce que tu as fait, ce que tu n'as pas pu vérifier, les contradictions trouvées entre mes fichiers de `data/` et la réalité, les décisions que tu me demandes de valider avant la phase 2.

## Critères de réussite de la phase 1
- [ ] Chaque fait d'examen a une URL et une date de consultation.
- [ ] Les six hypothèses de planning sont marquées confirmée, corrigée ou non vérifiable.
- [ ] Aucune statistique de marché sans méthode ni comptage.
- [ ] Aucune question présentée comme réelle sans source.
- [ ] Le programme tient dans mon budget d'heures, ou la coupe est explicite.
- [ ] Le planning d'entretiens reprend exactement les budgets de `planning_hebdo.json`.
- [ ] Aucun code d'application n'a été écrit.

Quand tout est terminé, écris `docs/RAPPORT_PHASE_1.md` puis ARRÊTE-TOI et attends ma validation.
