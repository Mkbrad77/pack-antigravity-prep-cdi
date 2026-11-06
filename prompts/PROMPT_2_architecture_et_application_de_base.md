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

# PROMPT 2 sur 4 : Architecture et application de base (planning, suivi, certifications)

## Rappels issus de la relecture de la phase 1 (à respecter)
- Source de vérité du planning : `data/planning_hebdo.json` pour les certifications, `docs/05_planning_entretiens_et_replanification.md` (planning hebdomadaire) pour les entretiens. Les durées par chapitre de `docs/04_programme_pedagogique.md` ne correspondent pas toujours aux durées planifiées en `docs/05` (exemple : le Module 4 totalise 440 minutes dans le tableau, 380 dans le planning) : utilise `docs/05` et signale l'écart dans ton rapport.
- Le pseudo-code de replanification de `docs/05` est incomplet : il n'applique pas son propre principe 2 (priorité à l'examen le plus proche), et il fixe arbitrairement à 15 minutes la durée d'un chapitre compressé. Corrige ces deux points dans ton implémentation et documente-le dans `docs/DECISIONS.md`.
- Les scénarios de test 1 et 2 de `docs/05` citent « la déduplication SQL en semaine 5 », alors qu'elle est en semaine 4 dans le planning final. Recalcule les 6 scénarios sur le planning réel avant d'écrire les tests.
- Stockage : les données utilisateur vont dans un fichier SQLite local (via un petit serveur local), pas seulement dans le navigateur, avec export JSON daté.


Tu agis comme un architecte logiciel senior et développeur full-stack. Ce prompt est la PHASE 2. Les documents de la phase 1 (`docs/`) ont été validés par moi : lis-les d'abord (`docs/RAPPORT_PHASE_1.md`, `docs/01_verification_examens.md`, `docs/05_planning_entretiens_et_replanification.md`). En cas de contradiction avec ce prompt, signale-la dans ton rapport.

## Mission
Construire une application locale, réellement utilisable dès demain, qui me guide semaine par semaine dans mon planning de certifications et mon suivi de progression. Ce n'est pas une maquette : chaque bouton agit, chaque pourcentage est calculé à partir de données réelles.
Le contenu de cours, les éditeurs SQL et Python, la banque de questions d'entretien et le simulateur viennent dans les prompts 3 et 4. Prépare l'architecture pour les accueillir, sans les construire ici.

## Étape A : architecture (`docs/ARCHITECTURE.md`, `docs/DECISIONS.md`)
Choisis la stack la plus simple et la plus robuste pour un usage local sur Windows, hors connexion. Piste recommandée (tu peux la modifier si tu justifies) : application web locale en TypeScript (React avec Vite), données utilisateur dans IndexedDB ou SQLite (via WebAssembly), aucun serveur obligatoire, démarrage par un fichier `demarrer.bat` ou `npm run start`. Prévois dès maintenant l'intégration future de DuckDB-WASM (SQL) et Pyodide (Python) dans des Web Workers.
Exigences :
- Les données STATIQUES (catalogue, planning, carte des sujets, contenu) sont séparées des données UTILISATEUR (progression, scores, journal). Une mise à jour des fichiers statiques ne doit jamais effacer ma progression.
- Schéma de données documenté (diagramme ou tableau) et versionné, avec migrations.
- Sauvegarde et restauration : export complet en un fichier JSON daté, import avec validation du schéma, rappel de sauvegarde hebdomadaire.
- Arborescence du projet expliquée.

## Étape B : données de départ
Importe les fichiers de `data/` sans les réécrire à la main :
- `catalogue_formations.json` : cours Udemy, leçons, durées, état initial (les leçons marquées terminées le sont dès l'import), blocs, ressources Skill Builder.
- `planning_hebdo.json` : semaines, tâches, priorités, examens.
- `carte_des_sujets.json` : correspondances sujets et leçons.
Les données de démonstration (si tu en ajoutes) sont étiquetées « DÉMO » et supprimables en un clic. Aucun faux résultat d'examen ni faux temps d'étude ne doit être pré-rempli.

## Étape C : fonctionnalités à livrer (toutes réelles)
1. **Tableau de bord** : tâches de la semaine en cours, temps étudié cette semaine face au budget (certification + entretiens), progression pondérée par les minutes pour CLF, DEA et dbt, trois comptes à rebours d'examens, prochaines échéances, tâches « bonus » à sauter si je suis en retard, éléments à réviser aujourd'hui.
2. **Planning** : vues semaine et mois. Chaque tâche affiche : ressource (nom du cours ou de la ressource AWS), plage de leçons (par exemple « cours Maarek et Kane, leçons 167 à 183 »), objectif, durée vidéo, durée estimée, priorité core ou bonus, résultat attendu. Actions : terminer, reporter, modifier la durée, ignorer (bonus), consulter l'historique.
3. **Moteur de replanification** (spécification de `docs/05_planning_entretiens_et_replanification.md`) : ne décale jamais tout le programme, replanifie seulement l'essentiel, plafonne la charge à 10 heures, sacrifie les « bonus » d'abord, et explique en clair ce qui a changé. Couvert par des tests unitaires sur les 6 scénarios chiffrés.
4. **Suivi des cours** : pour chacun des cinq cours Udemy, parcourir les blocs et les leçons, cocher les leçons terminées (ou une plage entière d'un coup), voir le temps restant par bloc. Le suivi manuel reflète ma progression sur Udemy (je coche ici ce que j'ai fini là-bas).
5. **Trois espaces de certification** (AWS Cloud Practitioner, AWS Data Engineer Associate, dbt Analytics Engineering). Chacun contient : programme officiel vérifié (depuis `docs/01_verification_examens.md`), chapitres reliés aux leçons via la carte des sujets, ressources officielles AWS Skill Builder, saisie des résultats d'examens blancs (source, date, score, détail par domaine), journal des erreurs (question, domaine, cause, à revoir), progression, date d'examen modifiable, indicateur de préparation. Règle d'indicateur proposée : CLF prêt si 80 % ou plus aux derniers blancs ; DEA prêt si 80 % ou plus deux fois de suite ; dbt prêt si 75 % ou plus (le seuil officiel est 65 %). Les règles sont modifiables dans les réglages.
6. **Journal des séances** : minuteur ou saisie manuelle, rattaché à une tâche, avec bilan hebdomadaire (planifié, réalisé, écart).
7. **Répétition espacée** (moteur générique, utilisable plus tard par le contenu des prompts 3 et 4) : cartes avec échéance, algorithme de type SM-2 ou Leitner, écran « À réviser aujourd'hui ». Je dois pouvoir créer moi-même une carte pour la tester. Une notion n'est jamais « maîtrisée » parce qu'un cours est terminé : seulement après plusieurs réussites espacées.
8. **Réglages** : budgets d'heures, coefficients de temps, règles d'indicateur de préparation, sauvegarde, restauration, suppression des données de démo.

## Étape D : qualité
- Design sobre, moderne, mode sombre, responsive (ordinateur et téléphone), navigation au clavier, textes en français.
- Tests unitaires : moteur de replanification, calcul de progression pondérée, répétition espacée, import/export.
- Tests de bout en bout dans un vrai navigateur (Playwright ou équivalent) : parcours complet « ouvrir, terminer une tâche, reporter, saisir un score, faire une sauvegarde, tout supprimer, restaurer ». Exécute-les réellement et joins les résultats.
- Performance : l'import du catalogue (environ 1 300 leçons) ne doit pas ralentir l'interface.

## Livrables
- L'application fonctionnelle et la commande de démarrage.
- `docs/GUIDE_UTILISATEUR.md` (installation sur Windows en moins de 10 lignes, usage quotidien, sauvegarde).
- `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/HYPOTHESES.md`.
- `docs/RAPPORT_PHASE_2.md` : fonctionnalités livrées avec preuve de test, limites connues, ce que tu proposes pour la phase 3.

## Critères de réussite de la phase 2
- [ ] Je démarre l'application en une commande et je vois ma semaine du 2 novembre avec les vraies tâches.
- [ ] Les progressions affichées viennent des données réelles (par exemple le cours français CLF apparaît déjà avancé).
- [ ] Reporter ou rater une séance replanifie sans tout décaler, et l'explique.
- [ ] Sauvegarder, tout effacer, restaurer : ma progression revient intacte.
- [ ] Les tests unitaires et de bout en bout ont été exécutés et sont verts (résultats joints).
- [ ] Aucune donnée fictive n'est présentée comme réelle.

Quand tout est terminé, écris `docs/RAPPORT_PHASE_2.md` puis ARRÊTE-TOI et attends ma validation.
