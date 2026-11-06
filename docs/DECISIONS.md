# Registre des Décisions Techniques et Pédagogiques

**Date de création et de révision :** 31 octobre 2026  
**Auteur :** Antigravity (Chef de projet pédagogique Data & AI Engineering)  
**Projet :** Préparation Intensive Certifications & Recrutement CDI (Auren Moyo)

---

## 1. Décision D-01 : Séquencement Chronologique des Trois Certifications

> **Remplacée par D-18** (ordre et dates en vigueur depuis le 6 novembre 2026).

- **Date :** 31 octobre 2026
- **Décision prise :** Maintenir l'ordre chronologique strict :
  1. AWS Certified Cloud Practitioner (CLF-C02) : examen le 20 novembre 2026.
  2. AWS Certified Data Engineer Associate (DEA-C01) : examen le 4 ou 5 février 2027.
  3. dbt Analytics Engineering : examen le 19 mars 2027 (ajustable/reportable).
- **Justification :**
  - *Pédagogique :* Le passage préalable de CLF-C02 fournit le socle global AWS (IAM, VPC, sécurité, facturation) nécessaire pour aborder sereinement les services data spécialisés de DEA-C01.
  - *Financière :* La réussite de CLF-C02 débloque immédiatement un bon de réduction officiel AWS de 50 % ("Exam Discount Benefit"), réduisant le coût d'inscription de DEA-C01 de 150 USD à 75 USD.
  - *Marché de l'emploi :* L'analyse de 120 offres de CDI démontre que DEA-C01 est la certification la plus demandée et valorisée pour les profils Data Engineer et AI Engineer. La certification dbt intervient ensuite en perfectionnement analytique.

---

## 2. Décision D-02 : Rationalisation du Programme d'Entretiens sur 2 400 Minutes

- **Date :** 31 octobre 2026
- **Décision prise :** Restructurer les 141 chapitres de `programme_cible_chapitres.md` pour respecter rigoureusement le volume de 2 400 minutes (40 heures réparties sur 22 semaines) alloué dans `planning_hebdo.json`.
- **Justification :**
  - Les 141 chapitres bruts auraient exigé plus de 7 500 minutes de travail, créant une surcharge de 300 % incompatible avec la contrainte absolue de 8 à 10 heures hebdomadaires (tâches de certification incluses).
  - Auren possède déjà une formation d'ingénieur EPITA, les bases de Python/SQL et la certification Snowflake SnowPro Core (obtenue le 29 octobre 2026).
  - 93 chapitres élémentaires ou redondants avec les cours de certification sont validés comme acquis ou révisés en synergie avec les cours Udemy/AWS. L'effort d'entraînement aux entretiens est concentré sur les compétences les plus éliminatoires : live coding (SQL fenêtré, structures de données Python), System Design data (idempotence, shuffles Spark, streaming Kafka) et architectures RAG.

---

## 3. Décision D-03 : Format "Fiches Mémos" pour les Modules 5 (ML) et 6 (Software Engineering)

- **Date :** 31 octobre 2026
- **Décision prise :** Condenser les modules secondaires 5 (Machine Learning & Deep Learning) et 6 (Software Engineering & Production) sous la forme de 10 fiches mémos de synthèse opérationnelle (180 minutes au total), au lieu de chapitres d'exercices longs.
- **Justification :**
  - La priorité numéro 1 d'Auren est le métier de Data Engineer, suivi d'AI Engineer.
  - En entretien Data Engineer, les questions de ML pur restent conceptuelles (évaluation de métriques, dérive de données). Les fiches mémos permettent de mémoriser les réponses attendues sans grever le temps alloué au SQL avancé, au code distribué et à l'infrastructure cloud.

---

## 4. Décision D-04 : Demande Systématique de l'Aménagement AWS ESL +30 Minutes

- **Date :** 31 octobre 2026
- **Décision prise :** Solliciter l'aménagement "ESL +30 MINUTES" sur le compte AWS Certification avant toute prise de rendez-vous d'examen.
- **Justification :**
  - Les examens AWS (en particulier DEA-C01) comportent des énoncés de scénarios longs et denses en anglais.
  - Bien qu'Auren possède un niveau B2, 30 minutes supplémentaires gratuites réduisent le stress de lecture, améliorent la relecture des questions à choix multiples complexes et augmentent le taux de réussite dès la première tentative.

---

## 5. Décision D-05 : Règles de Replanification Dynamique à Capacité Constante

> **Plafonds et fusible mis à jour par D-18** (principes inchangés).

- **Date :** 31 octobre 2026
- **Décision prise :** Adopter un moteur de replanification stricte qui :
  1. Ne dépasse jamais 10 heures par semaine (6 heures en période de fêtes).
  2. Supprime en priorité les modules et leçons étiquetés `bonus`.
  3. Utilise l'examen dbt (19 mars 2027) comme fusible temporel en cas de retard sur DEA-C01.
- **Justification :**
  - La consigne stipule : "Ne crée jamais une dette de travail impossible à rattraper".
  - Les retards imprévus (charge professionnelle en alternance, impératifs personnels) ne doivent pas s'empiler en fin de parcours, mais être absorbés par l'élagage méthodique des éléments non indispensables.

---

## 6. Décision D-06 : Politique Anti-Plagiat et Traçabilité des Questions

- **Date :** 31 octobre 2026
- **Décision prise :** Bannir toute reproduction de contenus payants (Udemy, braindumps d'examen, énoncés commerciaux LeetCode). Chaque ressource ou question créée dans l'application doit porter un tag de provenance explicite (`officielle`, `communauté`, `générée par IA et vérifiée dans la documentation`, `générée par IA non vérifiée`).
- **Justification :**
  - Respect scrupuleux de la propriété intellectuelle et conformité légale.
  - Transparence totale pour le candidat afin qu'il sache exactement sur quelle base d'autorité repose chaque notion technique apprise.

---

## 7. Décision D-07 : Persistance SQLite Locale via `node:sqlite` (Phase 2)

- **Date :** 31 octobre 2026
- **Décision prise :** Utiliser une base de données SQLite locale stockée dans un fichier physique sur disque (`storage/user_data.sqlite`) via le module natif `node:sqlite` (`DatabaseSync` de Node.js v24), exposée à l'application React par un serveur local intégré à Vite (`vite.config.ts` / `server/standalone.ts`), et complétée par un export/import JSON daté.
- **Justification :**
  - *Fiabilité du stockage :* Le stockage uniquement dans le navigateur (`IndexedDB` / `localStorage`) est vulnérable au nettoyage du cache ou au changement de navigateur. Un fichier SQLite local garantit la persistance durable sur le disque Windows tout en permettant des transactions ACID atomiques.
  - *Simplicité d'installation sur Windows :* L'utilisation du module natif `node:sqlite` de Node.js v24 évite toute compilation C++ (`node-gyp` / `better-sqlite3`), garantissant un démarrage immédiat par `npm run start` ou `demarrer.bat`.

---

## 8. Décision D-08 : Arbitrage des Écarts de Durées entre `docs/04` et `docs/05` (Phase 2)

- **Date :** 31 octobre 2026
- **Décision prise :** Retenir exclusivement les durées hebdomadaires et par chapitre de `docs/05_planning_entretiens_et_replanification.md` (encodées dans `data/planning_entretiens.json`) comme source de vérité pour les entretiens, et `data/planning_hebdo.json` pour les certifications.
- **Justification :**
  - Une revue croisée a révélé des écarts de durées dans `docs/04_programme_pedagogique.md` : le détail des chapitres du Module 4 (AI Engineering) y totalise 440 minutes (ou 480 minutes avec le chapitre optionnel 4.14), le tableau récapitulatif en bas de `docs/04` affiche 360 minutes, tandis que le planning hebdomadaire de `docs/05` planifie exactement 380 minutes (Semaines 15 à 18 : 80 + 120 + 120 + 60 min). De même, les Modules 5 et 6 sont décrits à 90 minutes chacun dans le corps de `docs/04` mais planifiés à 60 minutes chacun en Semaines 18 et 19 dans `docs/05`.
  - Seul le découpage de `docs/05` respecte à la minute près les budgets `interview_budget_min` de chaque semaine de `data/planning_hebdo.json` pour un total exact de 2 400 minutes.

---

## 9. Décision D-09 : Correction des Deux Défauts du Pseudo-Code de Replanification de `docs/05` (Phase 2)

- **Date :** 31 octobre 2026
- **Décision prise :** Corriger dans l'implémentation (`src/domain/rescheduler.ts`) deux lacunes identifiées dans le pseudo-code de la section 2.2 de `docs/05_planning_entretiens_et_replanification.md` :
  1. **Application effective du Principe 2 (Priorité à l'examen le plus proche) :** Le pseudo-code initial traitait `taches_core_manquees` sans les trier par proximité d'examen. L'implémentation trie désormais les tâches Core par priorité stricte d'échéance : `CLF-C02` (20 nov 2026) > `DEA-C01` (5 fév 2027) > `Entretiens Core` > `dbt` (19 mars 2027). De plus, lorsqu'une semaine future manque de place pour absorber une tâche Core de l'examen le plus proche, le moteur sacrifie d'abord les tâches `bonus` de cette semaine cible, puis peut compresser les tâches d'entretien de la semaine cible afin de garantir que les leçons Core de certification ne prennent aucun retard.
  2. **Compression proportionnelle au lieu de la durée arbitraire de 15 minutes :** Le pseudo-code initial fixait arbitrairement `tache.duree_estimee = 15` pour tout chapitre d'entretien compressé, ce qui contredisait même le Scénario 2 de `docs/05` (qui condensait 120 minutes en deux séances de 30 minutes, soit 50 %). L'implémentation utilise désormais un facteur de compression proportionnel configurable (`compressionFactor = 0.5`, soit 50 % de la durée initiale, borné par un plancher de 15 minutes et un plafond de 30 minutes par fiche mémo).

---

## 10. Décision D-10 : Recalcul des 6 Scénarios de Test sur le Planning Réel (Phase 2)

- **Date :** 31 octobre 2026
- **Décision prise :** Recalculer les 6 scénarios de replanification sur les données exactes de `data/planning_hebdo.json` et `data/planning_entretiens.json` avant d'écrire la suite de tests unitaires (`tests/unit/rescheduler.test.ts`).
- **Justification :**
  - Les scénarios 1 et 2 de `docs/05` citaient « la déduplication SQL (`ROW_NUMBER`, Chapitre 2.8) en semaine 5 », alors que le Chapitre 2.8 (45 minutes) est planifié en **Semaine 4** (`W04-I3`), tandis que la Semaine 5 contient les chapitres 2.9, 2.11, 2.12 et 2.14.
  - Les tests unitaires vérifient désormais à la fois le report réel du Chapitre 2.8 de la Semaine 4 vers la Semaine 5 (charge passant de 410 à 455 minutes) et le report de 60 minutes de SQL de la Semaine 5 vers la Semaine 6 (charge Core passant de 380 à 440 minutes).

---

## 11. Décision D-11 : Calcul de Progression Pondérée par les Minutes Estimées (Phase 2)

- **Date :** 31 octobre 2026
- **Décision prise :** Calculer tous les pourcentages d'avancement des cours et des certifications en pondérant chaque élément (leçon vidéo, quiz, exercice pratique) par sa durée estimée (durée vidéo multipliée par le coefficient du cours `time_factors`, ou forfait `quiz_minutes` / `exercise_minutes`), et non par le simple nombre d'éléments cochés.
- **Justification :**
  - Une leçon de conclusion de 1 minute ne doit pas peser autant qu'un atelier pratique Glue ou Iceberg de 25 minutes. La pondération par les minutes reflète fidèlement l'effort réel restant à fournir.

---

## 12. Décision D-12 : Préparation de l'Architecture Web Workers pour DuckDB-WASM et Pyodide (Phase 2)

- **Date :** 31 octobre 2026
- **Décision prise :** Isoler dès la Phase 2 les contrats et le pont de communication asynchrone (`src/workers/types.ts` et `src/workers/sandboxBridge.ts`) pour l'exécution locale de SQL (DuckDB-WASM) et de Python (Pyodide) dans des Web Workers dédiés avec mécanisme d'expiration (timeout).
- **Justification :**
  - Permet d'accueillir les éditeurs SQL et Python des Phases 3 et 4 sans aucune refonte de l'architecture ni risque de blocage de l'interface React lors de l'exécution de requêtes ou de scripts utilisateur.

---

## 13. Décision D-13 : Remise à Zéro Intégrale (0 %) des Cours Udemy et Certifications & Synchronisation Tâches-Leçons

- **Date :** 31 octobre 2026
- **Décision prise :**
  1. Remettre à `0 %` (`done: false` sur toutes les leçons, `done_items: 0`) l'état initial des 5 cours Udemy (`merico`, `maarek`, `nikolai`, `toth`, `weigel`) dans `data/catalogue_formations.json` ainsi que dans la base SQLite locale via la migration `v2_reset_zero_initial_progress`.
  2. Ajuster les Semaines 1 et 2 (`CLF-C02`, cours `merico`) et la Semaine 15 (`dbt`, cours `toth`) dans `data/planning_hebdo.json` et `data/planning_hebdo_lisible.md` afin de planifier explicitement toutes les leçons depuis la leçon 1 (`merico` leçons 1 à 120 en Semaine 1, leçons 121 à 199 en Semaine 2, leçons 200 à 203 en Semaine 3 ; `toth` leçons 1 à 49 en Semaine 15) tout en respectant strictement le plafond de 10h/semaine (`540 min` en S1, `560 min` en S2 avec `40 min` de marge, `470 min` en S15).
  3. Synchroniser automatiquement la validation ou la réouverture d'une tâche hebdomadaire Udemy (`/api/tasks/update`) avec la plage de leçons correspondante (`first_lecture` à `last_lecture`) dans la table `lesson_progress`.
- **Justification :**
  - Lors de la copie initiale des plans de cours Udemy, certaines cases étaient pré-cochées par erreur dans les fichiers bruts alors qu'Auren souhaite repartir de zéro sur toutes ses certifications Udemy et suivre l'intégralité du programme dans le planning.
  - La synchronisation directe entre les tâches hebdomadaires Udemy et les leçons du catalogue évite toute double saisie entre le tableau de bord et la vue des cours.

---

## 14. Décision D-14 : Structuration du Contenu des Trois Certifications (Phase 3)

- **Date :** 31 octobre 2026
- **Décision prise :** Structurer l'ensemble du corpus pédagogique des trois certifications sous un format hybride Markdown (chapitres denses et fiches express) et JSON (banque de 600 questions) :
  1. 74 fiches de chapitres Markdown (13 CLF, 35 DEA, 26 dbt) d'une longueur comprise strictement entre 400 et 800 mots. Chaque fiche suit un canevas rigoureux : objectifs, guide de choix d'architecture ("Quand choisir quoi"), définitions clés, schéma textuel ASCII, pièges d'examen, ponts vers les compétences acquises (SQL, Snowflake, Databricks), renvois aux leçons de cours Udemy et AWS Skill Builder, et mini-quiz de 3 à 5 questions.
  2. 13 fiches express par domaine officiel (4 CLF, 4 DEA, 5 dbt) résumant en 10 à 15 points clés et chiffres vérifiés l'essentiel à mémoriser pour les révisions de dernière minute.
  3. Une banque de 600 questions à choix multiples au format JSON (150 CLF, 300 DEA, 150 dbt) couvrant l'ensemble des domaines officiels.
- **Justification :**
  - Ce format offre une lisibilité maximale pour l'étudiant, permet le rendu HTML natif avec coloration syntaxique et tableaux, tout en autorisant l'exportation ou la lecture hors ligne sans outil tiers.
  - La banque JSON structurée permet l'alimentation directe du moteur d'entraînement libre et des examens blancs minutés.

---

## 15. Décision D-15 : Réfutation Explicite de Chaque Option Fausse et Traçabilité des Sources (Phase 3)

- **Date :** 31 octobre 2026
- **Décision prise :** Imposer que 100 % des questions de la banque comportent :
  1. Une explication détaillée de la bonne réponse.
  2. Une réfutation explicite, argumentée et vérifiée pour chaque option incorrecte (lettres A, B, C, D, voire E).
  3. Une URL officielle vérifiée vers la documentation technique (AWS Documentation, guide officiel DEA-C01 v1.1, dbt Documentation) et la date de consultation fixée au 31 octobre 2026.
  4. L'étiquette de traçabilité stricte : `générée par IA et vérifiée dans la documentation (2026-10-31)`.
- **Justification :**
  - La simple indication de la bonne réponse est insuffisante pour un candidat ingénieur. Comprendre exactement pourquoi une option plausible est fausse (nuance de quota, service inadéquat, surcoût, complexité inutile) est la clé pour éliminer les pièges lors des examens AWS et dbt.
  - La traçabilité garantit l'intégrité intellectuelle et évite toute incertitude sur la véracité des faits techniques enseignés.

---

## 16. Décision D-16 : Simulateur d'Examen Blanc Interactif et Synergie SM-2 / Journal d'Erreurs (Phase 3)

- **Date :** 31 octobre 2026
- **Décision prise :** Implémenter un simulateur d'examen blanc complet reproduisant les conditions réelles :
  1. Tirage aléatoire de 65 questions selon les quotas officiels de chaque domaine.
  2. Chronomètre en temps réel avec durée officielle (CLF : 90 min, DEA : 130 min, dbt : 120 min) et option pour l'aménagement officiel non anglophone (DEA ESL +30 min, soit 160 min).
  3. Palette de navigation des 65 questions avec indicateurs visuels (répondue, non répondue, drapeau "Marquer pour révision").
  4. Bilan post-examen complet avec score global, statut succès/échec selon le seuil officiel, répartition par domaine avec alerte sur les domaines faibles, revue question par question et renvois automatiques vers les leçons des cours Udemy et AWS Skill Builder.
  5. Passerelle en un clic pour ajouter immédiatement les questions échouées au Journal des erreurs ou créer une flashcard SM-2.
- **Justification :**
  - La mise en situation sous contrainte de temps réduit le stress le jour J et permet d'ancrer immédiatement les notions manquées dans le cycle de révision espacée.

---

## 17. Décision D-17 : Clarification Visuelle du Badge Hebdomadaire et Calibrage Semaine 1 à 540 min

- **Date :** 31 octobre 2026
- **Décision prise :**
  1. Réviser l'affichage du badge de charge dans le Planning (`src/components/PlanningView.tsx`) pour remplacer le format brut `{totalActive} / {max} min` par une formulation explicite : `Prévu : {totalActive} min / plafond {max} min`, et ajouter un badge vert `Fait : {completedMin} min` dès qu'une tâche est terminée.
  2. Ajuster la Semaine 1 dans `data/planning_entretiens.json` à 60 minutes au lieu de 120 minutes (3 fiches STAR calibrées à 20 min chacune au lieu de 40 min), afin d'aligner parfaitement la Semaine 1 sur 540 minutes totales (480 min certif CLF + 60 min entretiens), laissant 1h de marge sous le plafond de 600 minutes (10h).
- **Justification :**
  - Le badge brut `600 / 600 min` créait une ambiguïté visuelle : l'utilisateur pouvait interpréter cela comme 600 minutes déjà accomplies (100 % terminé), alors qu'il repart de 0 % et qu'il s'agissait du ratio charge planifiée / plafond maximal.
  - La Semaine 1 dans `data/planning_hebdo.json` et la règle `AGENTS.md` prévoyaient expressément 540 minutes (9h00) pour la Semaine 1.

---

## 18. Décision D-18 : Ordre, Dates et Plafonds en Vigueur (Départ du 9 novembre 2026)

- **Date :** 6 novembre 2026
- **Décision prise :** Alignement de la documentation sur le planning réellement implémenté (`data/planning_hebdo.json`, `src/domain/rescheduler.ts`, `AGENTS.md`) :
  1. AWS Cloud Practitioner (`CLF-C02`) : semaines 1 à 3, examen le 27 novembre 2026.
  2. dbt Analytics Engineering (`DBT`, urgence n°1) : semaines 4 à 9, examen le 8 janvier 2027.
  3. AWS Data Engineer Associate (`DEA-C01`) + 15 Quickstarts Snowflake ML : semaines 10 à 19, examen le 19 mars 2027.
  4. Plafond : 660 min (11 h) par semaine ; semaines 7 (Noël) et 8 (Nouvel An) strictement allégées à 360 min (6 h).
- **Justification :** D-01 et D-05 décrivaient l'ordre initial (CLF, puis DEA, puis dbt) et un plafond de 10 h. L'ordre a été inversé pour faire de dbt la priorité n°1 avant les fêtes, et le code appliquait déjà ces valeurs : la documentation est mise en cohérence avec le code.

## 19. Décision D-19 : Version Mobile 24h/24 sur Cloudflare

- **Date :** 6 novembre 2026
- **Décision prise :** Héberger l'application sur Cloudflare (Worker + Durable Object SQLite + R2 + Access), sans frais récurrents, en conservant le mode local à l'identique.
- **Justification :** Accès au planning et aux podcasts en 4G/5G, PC éteint. Le Durable Object expose un SQLite synchrone, ce qui permet de réutiliser `src/server/db.ts` sans réécriture (contrairement à D1, asynchrone). Voir `docs/DEPLOIEMENT_CLOUD.md`.
