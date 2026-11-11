# Guide d'utilisation quotidien : Cockpit Préparation CDI (Data & AI Engineer)

Ce guide explique comment démarrer et utiliser chaque jour votre application locale sur votre PC Windows, du 2 novembre 2026 au 2 avril 2027.

---


> **Navigation (depuis novembre 2026)** : 5 entrées en bas de l'écran sur téléphone (ou à gauche sur PC) : **Aujourd'hui**, **Planning**, **Cours**, **Pratique**, **Podcasts**. Révision espacée, Journal des séances, Compétences et Réglages sont dans le menu profil, en haut à droite. Le thème clair s'active depuis ce même menu.
>
> **Podcasts au quotidien** : la carte « À écouter aujourd'hui » de l'écran Aujourd'hui liste les épisodes du jour (objectif : 3 écoutes par épisode). « Tout écouter » les enchaîne ; chaque écoute terminée est comptée automatiquement. Le détail de la semaine est dans « Comment faire » de la tâche podcast.

## 1. Démarrage en une commande (100 % hors connexion)

Vous disposez de deux façons équivalentes pour lancer l'application :

1. **Double-clic sous Windows** : double-cliquez sur le fichier [`demarrer.bat`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/demarrer.bat) à la racine du dossier.
2. **En ligne de commande** : ouvrez un terminal dans le dossier du projet et lancez :
   ```bash
   npm run start
   ```

L'application démarre sur `http://127.0.0.1:5173`. Toutes vos données personnelles sont enregistrées automatiquement dans le fichier local `storage/user_data.sqlite` (mode WAL transactionnel).

---

## 2. Routine quotidienne recommandée (8h à 10h par semaine)

### A. Début de séance : écran « Aujourd'hui »
1. Vérifiez la **Semaine active** (Semaine 1 à partir du lundi 9 novembre 2026, calculée selon la date) ainsi que les **comptes à rebours** jusqu'à vos trois examens (D-25) :
   - **AWS CLF-C02** : vendredi 11 décembre 2026
   - **dbt Analytics Engineering** : vendredi 22 janvier 2027
   - **AWS DEA-C01** : vendredi 26 mars 2027
2. Consultez vos tâches de la semaine, séparées en deux colonnes (**Certifications** et **Entretiens Techniques**) et hiérarchisées par priorité :
   - **CORE (obligatoire)** : à traiter en priorité absolue.
   - **BONUS (sacrifiable)** : à faire uniquement si le bloc `core` est terminé et que la jauge hebdomadaire reste sous le plafond de 10h (600 min, ou 360 min en semaine de fêtes).
3. Chaque tâche indique le **nom exact du cours** et les **numéros de leçons** à suivre sur Udemy ou AWS Skill Builder (exemple : `Maarek & Kane (leçons 167 à 183)`).

### B. Pendant l'étude : « Cours > Udemy » et « Journal des séances » (menu profil)
1. Dans **5. Journal des séances**, lancez le **Chronomètre** en début de travail (ou saisissez manuellement votre durée en fin de séance, par exemple `45 min`).
2. Dans **3. Cours Udemy & Sujets** :
   - Cochez vos leçons au fil de l'eau, ou utilisez la **validation par plage de leçons** (« Cocher les leçons 128 à 176 d'un coup ») pour mettre à jour instantanément votre progression pondérée par les minutes.
   - Utilisez la **barre de recherche par sujet technique** (ex. `Glue`, `Kinesis`, `Athena`, `snapshots`) pour retrouver immédiatement les leçons correspondantes dans vos cours Udemy et AWS Skill Builder.
3. Si vous retenez un concept clé ou un piège technique pendant un cours, ouvrez **6. Répétition espacée (SM-2)** et créez une carte mémoire en sélectionnant son étiquette de provenance obligatoire.

### C. Fin de séance : validation ou replanification
1. Retournez sur **Aujourd'hui** et cliquez sur **Terminer** en face de la tâche achevée.
2. Si vous manquez de temps pour finir une tâche cette semaine, cliquez sur **Reporter** : le **moteur de replanification dynamique** déplace la tâche sans décaler vos 22 semaines, sacrifie d'abord les tâches `bonus` si le plafond de 600 min est atteint, ou comprime proportionnellement à 50 % un chapitre d'entretien en protégeant l'examen le plus proche.
3. Si vous avez eu un imprévu majeur (semaine entière manquée, report d'examen CLF-C02, ou re-tentative DEA-C01 à J+14) ou au contraire de l'avance, ouvrez **2. Planning & Replanification** et cliquez sur le bouton du scénario correspondant : un encadré vous explique en détail chaque décision prise par l'algorithme.

---

## 3. Examens blancs et indicateur « Prêt pour l'examen »

Dans **Cours**, choisissez la certification (CLF-C02, dbt ou DEA-C01) :
1. Après chaque examen blanc (AWS Skill Builder, Nikolai Schuler, 6 Practice Exams Udemy, etc.), saisissez la date, la source, le score global en `%` et, si disponible, vos scores par domaine (`D1` à `D4`).
2. L'application met à jour automatiquement l'indicateur **« Prêt pour l'examen »** :
   - **CLF-C02** : prêt dès `>= 80 %` au dernier examen blanc (seuil officiel AWS : `700/1000`).
   - **DEA-C01** : prêt dès `>= 80 %` sur **2 examens blancs consécutifs** (seuil officiel AWS : `720/1000`).
   - **dbt** : prêt dès `>= 75 %` au dernier examen blanc (seuil officiel dbt Labs : `65 %`).
3. Tout domaine sous le seuil est signalé en rouge. Notez chaque question ratée dans le **Journal de mes erreurs** en bas de page pour planifier la relecture des leçons correspondantes.

---

## 4. Sauvegarde hebdomadaire et restauration (menu profil > Réglages)

Une fois par semaine (par exemple le dimanche soir) :
1. Ouvrez **7. Réglages & Sauvegarde** et cliquez sur **Exporter mes données (JSON daté)**.
2. Un fichier `sauvegarde-prep-cdi-YYYY-MM-DD.json` est téléchargé et affiché. Conservez-le sur une clé USB ou un dossier externe.
3. En cas de besoin, vous pouvez importer ce fichier JSON à tout moment : l'application valide son schéma (`schema_version: 1`) avant de restaurer l'intégralité de votre progression.
4. Si vous chargez des données d'exemple via le bouton **Charger des données [DÉMO]**, un bouton **Supprimer les données [DÉMO] en un clic** apparaît dans l'en-tête pour les effacer instantanément sans toucher à votre vraie progression.

---

## 5. Règle Fondamentale : Départ à 0 % et Synchronisation Tâches - Leçons

1. **Départ strict à 0 %** :
   - L'application, le catalogue et la base SQLite locale démarrent strictement à **0 %** sur les 5 cours Udemy (Merico, Maarek/Kane, Nikolai, Toth, Weigel) et les 3 certifications.
   - Toutes les premières leçons sont planifiées : leçons 1 à 120 de Merico en Semaine 1, leçons 121 à 199 en Semaine 2, et leçons 1 à 49 de Toth en Semaine 15.
   - Aucune leçon n'est considérée comme pré-acquise ou pré-cochée.
2. **Synchronisation automatique** :
   - Lorsque vous validez une tâche hebdomadaire de cours Udemy sur l'écran Aujourd'hui ou dans le Planning (par exemple `W01-C3` couvrant les leçons 1 à 60 de Merico), l'application coche automatiquement toutes les leçons correspondantes dans le catalogue (`lesson_progress`) et actualise immédiatement votre taux d'avancement pondéré.

---

## 6. Préparation aux Entretiens Techniques (écran « Pratique »)

L'écran **Pratique** regroupe vos outils d'entraînement intensif pour réussir les entretiens techniques en Data Engineering et AI Engineering :

### A. Simulateur d'Entretien Complet
1. Configurez votre simulation : rôle visé (Data Engineer ou AI Engineer), niveau d'exigence (Junior, Intermédiaire, Senior) et durée (Express 15 min ou Complet 45 min).
2. Entraînez-vous à l'oral sur le **Pitch STAR** ("Parlez-moi de vous") avec le chronomètre intégré et validez votre auto-évaluation en 5 points.
3. Répondez au **QCM technique interactif** extrait de la banque de 309 questions officielles avec réfutations immédiates des pièges.
4. Traitez le **cas pratique d'architecture** pour défendre vos choix de conception.
5. Obtenez votre débriefing chiffré et injectez en un clic les questions ratées dans votre deck de répétition espacée (SRS).

### B. Éditeur SQL en conditions réelles
1. Pratiquez sur 4 jeux de données métiers réels (`ecommerce`, `streaming_events`, `hr_payroll`, `banking_fraud`) contenant des valeurs manquantes et des cas limites.
2. Résolvez les 105 exercices progressifs (filtrage, agrégations, jointures complexes, fonctions fenêtrées, CTEs récursives).
3. Testez vos requêtes avec le comparateur multiset et inspectez le plan d'exécution `EXPLAIN QUERY PLAN` pour optimiser vos requêtes.
4. Les solutions restent masquées jusqu'à votre première tentative réelle.

### C. Exercices de Programmation Python
1. Résolvez les 70 exercices couvrant 11 catégories (algorithmes, structures de données, décorateurs, générateurs, programmation orientée objet, concurrence, requêtes API, manipulations Pandas, transformations Spark PySpark et pipelines RAG).
2. Exécutez votre code dans la sandbox sécurisée locale (timeout strict de 4 secondes anti-boucle).
3. Les cas limites sont validés par la suite d'assertions unitaires (`check_assert`).
4. Débloquez les indices progressifs si vous êtes bloqué sans compromettre l'effort de recherche.

### D. Cours Condensés & Fiches de Révision
1. Consultez les 29 fiches de cours synthétiques réparties en 4 catégories : 10 Data Engineering, 9 AI Engineering & LLM, 5 Fiches Machine Learning et 5 Fiches Génie Logiciel.
2. Utilisez la barre de recherche et les tags pour retrouver instantanément un concept clé avant un entretien.

### E. Matrice de Compétences
1. Suivez votre niveau de maîtrise sur les 20 compétences clés requises pour un poste de Data/AI Engineer.
2. Respectez la **règle des 3 réussites sur au moins 2 sessions distinctes** pour valider durablement l'ancrage mémoriel d'une compétence.

### F. Espace Projets STAR
1. Rédigez vos 3 fiches de projets personnels ou d'alternance selon la méthode STAR (Situation, Tâche, Action, Résultat).
2. Listez les technologies de votre stack, les points d'architecture clés à défendre et anticipez les questions pièges des recruteurs avec vos réponses préparées.
3. Les 3 fiches sont livrées vierges de toute donnée fictive pour refléter fidèlement vos réalisations réelles.


