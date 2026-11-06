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

# PROMPT 3 sur 4 : Contenu des certifications (CLF-C02, DEA-C01, dbt)

## Rappels issus de la relecture de la phase 1 (à respecter)
- Guide DEA-C01 version 1.1, publié le 12 décembre 2025 (source officielle : https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/dea-01-revisions.html). Services ajoutés : Amazon Bedrock, Amazon S3 Tables, Amazon Q, Amazon Aurora, Amazon Kendra, AWS Data Exchange. Services retirés : AWS Cloud9, AWS CodeCommit, AWS SCT. Nouvelles compétences : intégration de LLM pour le traitement des données (1.2.10), formats de tables ouverts dont Apache Iceberg (2.1.7), index vectoriels HNSW et IVF (2.1.8), catalogues de données métier comme SageMaker Catalog (2.2.6), concepts de vectorisation (2.4.6), domaines et projets SageMaker Unified Studio (4.1.7), gestion des accès via les projets SageMaker Catalog (4.5.6), cadres de gouvernance et partage de données (4.5.7). Chaque chapitre DEA couvre ces points.
- La section 3.4 de `docs/01_verification_examens.md` détaille des « points testés » (Titan Embeddings v2, ML Lineage Tracking, moteurs Faiss/nmslib, etc.) qui ne viennent pas du guide officiel. Re-vérifie chacun dans la documentation AWS avant d'en faire du contenu, sinon marque « non vérifié ».
- L'examen DEA-C01 n'existe qu'en anglais, japonais, coréen et chinois simplifié : l'aménagement ESL +30 minutes s'applique donc. Les chiffres de marché de `docs/02_analyse_marche.md` sont indicatifs et non vérifiés : ne les cite pas comme des faits dans les chapitres.


Tu agis comme une équipe de formateurs certifiés AWS et dbt et d'un contrôleur qualité. Ce prompt est la PHASE 3. L'application de base de la phase 2 existe : lis `docs/RAPPORT_PHASE_2.md` et `docs/ARCHITECTURE.md`, puis ajoute le contenu.

## Mission
Écrire le contenu pédagogique des trois certifications DANS l'application : fiches de chapitre, pièges d'examen, banque de questions et examens blancs. Ce contenu COMPLÈTE mes cours Udemy et AWS Skill Builder, il ne les remplace pas et ne les recopie pas. Il sert à comprendre les architectures et les cas d'usage (pas seulement mémoriser des noms de services), à relier AWS à ce que je connais déjà (SQL, Snowflake, Databricks), et à ne pas me tromper aux questions pièges.

## Méthode obligatoire (par lots, dans cet ordre)
Lot 1 : CLF-C02. Lot 2 : DEA-C01 (le plus important, le plus de soin). Lot 3 : dbt Analytics Engineering.
À la fin de chaque lot : lance le script de validation (voir plus bas), corrige, puis passe au lot suivant. Écris un mini-rapport par lot dans `docs/RAPPORT_PHASE_3.md`.
Chaque fait technique est rédigé avec tes mots à partir de la documentation officielle (docs.aws.amazon.com, docs.getdbt.com, guides d'examen). Garde l'URL et la date de consultation dans les métadonnées.

## Structure d'un chapitre (un chapitre par sujet de `carte_des_sujets.json` et par domaine officiel)
1. Objectifs d'apprentissage (3 à 5 lignes).
2. Explication claire, orientée « quand choisir quoi » (cas d'usage et architecture).
3. Définitions des termes clés.
4. Exemple concret (schéma textuel ou court exemple de configuration/commande).
5. Comparaisons et pièges d'examen (voir liste de départ ci-dessous).
6. Lien avec ce que je connais (SQL, Snowflake, Databricks) quand c'est pertinent.
7. Renvois automatiques : « Voir aussi : cours <nom>, leçons N à M », issus de `carte_des_sujets.json`, et la revue de domaine AWS Skill Builder correspondante.
8. Mini-quiz de 3 à 5 questions rattaché au chapitre.
Un chapitre fait environ 400 à 700 mots : dense, pas de remplissage.

## Liste de départ des pièges et confusions à traiter (à vérifier dans la documentation, ajoute les autres que tu trouveras)
DEA-C01 : Kinesis Data Streams contre Firehose contre MSK contre SQS contre SNS ; Firehose (tampon, destinations) contre Data Streams (rejeu, fan-out amélioré) ; Athena contre Redshift Spectrum contre Redshift ; Glue contre EMR contre Lambda pour une transformation ; Glue Data Catalog contre Lake Formation (permissions fines) ; classes de stockage S3 et règles de cycle de vie ; partitionnement et formats colonnes (Parquet) pour la performance Athena ; DynamoDB (clés, GSI contre LSI, capacité, chaud/froid) ; Redshift (styles de distribution, clés de tri, COPY, WLM, Serverless) ; Step Functions contre MWAA contre EventBridge pour l'orchestration ; DMS (CDC, rechargement complet) ; KMS (clés gérées par AWS ou par le client), Macie, Secrets Manager ; politiques IAM contre politiques de ressources ; CloudWatch contre CloudTrail contre Config ; idempotence et reprise sur erreur ; gestion des doublons en streaming.
CLF-C02 : modèle de responsabilité partagée (qui gère quoi selon le service) ; régions, zones de disponibilité, edge locations ; options d'achat EC2 (à la demande, Savings Plans, Spot, instances réservées) ; classes S3 ; IAM utilisateur contre rôle ; outils de coût (Cost Explorer, Budgets, Pricing Calculator, Trusted Advisor) ; niveaux de support ; piliers du Well-Architected Framework ; stratégies de migration.
dbt : matérialisations (view, table, incremental, ephemeral) et quand les choisir ; stratégies incrémentales et microbatch ; snapshots (timestamp contre check) ; tests génériques contre singuliers contre unitaires ; contrats, versions, accès aux modèles (public, protected, private) ; `state:modified`, `defer`, `clone`, `retry` ; Slim CI ; sélecteurs ; `dbt build` contre `run` + `test` ; exposures et fraîcheur des sources ; ce qui a changé dans l'examen en 2026 (vérifie dans la documentation et le guide d'étude).

## Banque de questions (originales, sourcées, vérifiées)
Cibles de départ (ajuste si tu justifies) : CLF-C02 environ 150 questions ; DEA-C01 environ 300 questions ; dbt environ 150 questions.
Règles :
- Questions ORIGINALES, écrites à partir de la documentation officielle. Aucune reproduction de questions d'examen réelles, de braindumps ou de questions de cours payants.
- Même style que l'examen réel : une réponse correcte parmi 4, ou plusieurs réponses (deux parmi cinq, par exemple), scénarios courts avec contraintes (coût, latence, sécurité, maintenance).
- Champs : énoncé, type (une réponse ou plusieurs), options, réponse(s) attendue(s), explication détaillée de la bonne réponse ET pourquoi chaque mauvaise option est fausse, domaine officiel, sujet (id de la carte des sujets), difficulté (facile, moyen, difficile), temps recommandé, URL de la documentation source, étiquette de provenance (voir règle 2 du contexte commun), date de vérification.
- Répartition par domaine conforme aux poids officiels (DEA : environ 34, 26, 22, 18 %).
- Ne montre JAMAIS la réponse avant que j'aie essayé.
- Contrôle qualité : pour chaque tranche de 50 questions, re-vérifie au moins 5 questions tirées au hasard contre la documentation et note le résultat dans le rapport. Supprime ou corrige toute question douteuse.

## Examens blancs dans l'application
- Un examen blanc par certification au format officiel vérifié en phase 1 (nombre de questions, durée), avec minuteur, marquage de questions à revoir, correction détaillée, score par domaine, et recommandation de chapitres à retravailler avec renvoi vers les leçons de mes cours.
- Les erreurs alimentent automatiquement le journal des erreurs et la répétition espacée de la phase 2.
- Mode « entraînement par domaine » (par chapitre, sans minuteur) et mode « examen complet ».
- Les résultats des examens blancs d'Udemy et d'AWS Skill Builder continuent de se saisir à la main (leurs questions ne sont pas copiées ici). L'application les compare aux examens blancs internes.

## Fiches express
Une fiche d'une page par domaine officiel (CLF : 4, DEA : 4, dbt : domaines vérifiés en phase 1) : les 10 à 15 points qui tombent le plus, les pièges, les chiffres à connaître (limites, valeurs par défaut) UNIQUEMENT s'ils sont vérifiés dans la documentation. Exportables en Markdown pour mes notes.

## Script de validation (à écrire et à exécuter à chaque lot)
Un script qui échoue si : un champ obligatoire est vide ; la réponse attendue n'est pas dans les options ; l'explication ne couvre pas toutes les options ; l'URL source ou la date manque ; deux questions sont quasi identiques ; un sujet n'existe pas dans la carte des sujets ; une fiche dépasse 800 mots. Joins ses résultats au rapport.

## Livrables
- Contenu dans `content/certifications/clf/`, `content/certifications/dea/`, `content/certifications/dbt/` (Markdown pour les chapitres, JSON pour les questions), chargé par l'application.
- Interface mise à jour : chapitres, quiz, examens blancs, fiches, renvois vers les leçons.
- `docs/RAPPORT_PHASE_3.md` : nombre de chapitres et de questions par certification et par domaine, résultats du script de validation, taux d'erreur trouvé au contrôle qualité, points que tu n'as pas pu vérifier, limites.

## Critères de réussite de la phase 3
- [ ] Chaque chapitre renvoie aux bonnes leçons de mes cours (vérifie quelques renvois à la main dans `catalogue_formations.json`).
- [ ] Aucune question sans explication, sans source et sans étiquette de provenance.
- [ ] Les examens blancs fonctionnent de bout en bout dans le navigateur (testé).
- [ ] Les erreurs d'un examen blanc apparaissent dans le journal et dans « À réviser aujourd'hui ».
- [ ] Le script de validation est vert.
- [ ] Aucun contenu de cours payant ni question d'examen réelle n'a été recopié.

Quand tout est terminé, écris `docs/RAPPORT_PHASE_3.md` puis ARRÊTE-TOI et attends ma validation.
