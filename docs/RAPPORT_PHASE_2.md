# Rapport de Livraison : Phase 2 (Architecture et Application de Base)

**Date de génération** : 31 octobre 2026  
**Candidat** : Auren (Ingénieur EPITA, alternance Data & IA, fin de contrat le 2 avril 2027)  
**Périmètre exécuté** : Prompt 2 sur 4 uniquement (Architecture, stockage SQLite local, tableau de bord, planning interactif des 22 semaines, moteur de replanification dynamique corrigé, suivi des 5 cours Udemy et de la carte des sujets, suivi des 3 certifications et examens blancs, journal des séances, moteur SM-2, réglages et sauvegarde JSON datée).

---

## 1. Commandes exactes pour démarrer et tester l'application

### A. Démarrer l'application au quotidien (Windows, hors connexion)
- **Option 1 (double-clic)** : double-cliquez sur [`demarrer.bat`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/demarrer.bat).
- **Option 2 (terminal)** :
  ```bash
  npm run start
  ```
  Puis ouvrez `http://127.0.0.1:5173`.

### B. Exécuter les tests automatisés (unitaires et bout en bout navigateur)
- **Tests unitaires (Vitest, 4 suites, 16 tests)** :
  ```bash
  npm test
  ```
- **Test de bout en bout dans le navigateur (Playwright Chromium/Edge)** :
  ```bash
  npm run test:e2e
  ```
- **Compilation de production (TypeScript + Vite)** :
  ```bash
  npm run build
  ```

---

## 2. Prise en compte des rappels et écarts signalés après la Phase 1

Conformément aux consignes du Prompt 2, voici le traitement exact des points de vigilance identifiés lors de la relecture de la Phase 1 :

1. **Source de vérité du planning et écarts de durées entre `docs/04` et `docs/05`** :
   - **Écart constaté et documenté** : les durées théoriques par chapitre dans [`docs/04_programme_pedagogique.md`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/docs/04_programme_pedagogique.md) ne correspondent pas toujours aux durées hebdomadaires planifiées dans [`docs/05_planning_entretiens_et_replanification.md`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/docs/05_planning_entretiens_et_replanification.md) (total de `2 465 min` en `docs/04` contre `2 400 min` soit `40h00` en `docs/05`). En particulier :
     - **Module 4 (Snowflake, dbt & Data Modeling)** : totalise `440 min` dans le tableau de `docs/04`, mais `380 min` dans le planning hebdomadaire de `docs/05` (`-60 min`, les chapitres `4.1` à `4.4` étant planifiés à `50 min` au lieu de `60 min` et `4.6` à `70 min` au lieu de `90 min` grâce aux acquis SnowPro Core et dbt Fundamentals).
     - **Module 1 (SQL)** : `475 min` en `docs/04` contre `495 min` en `docs/05` (`+20 min`).
     - **Module 3 (AWS)** : `435 min` en `docs/04` contre `425 min` en `docs/05` (`-10 min`).
     - **Module 7 (STAR & Rhétorique)** : `245 min` en `docs/04` contre `230 min` en `docs/05` (`-15 min`).
   - **Résolution appliquée** : l'application utilise exclusivement [`data/planning_hebdo.json`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/data/planning_hebdo.json) pour le volet certifications et [`data/planning_entretiens.json`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/data/planning_entretiens.json) (généré fidèlement depuis le tableau hebdomadaire de `docs/05`, soit exactement `2 400 min` sur 22 semaines) pour le volet entretiens.

2. **Corrections du moteur de replanification dynamique ([`src/domain/rescheduler.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/domain/rescheduler.ts) et [`docs/DECISIONS.md`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/docs/DECISIONS.md) D-08, D-09)** :
   - **Principe 2 (priorité à l'examen le plus proche)** : le pseudo-code de `docs/05` ne protégeait pas explicitement l'examen imminent. Notre implémentation calcule l'examen actif de chaque semaine (`CLF-C02` en S1..S3, `DEA-C01` en S4..S14, `DBT` en S15..S20). En cas de surcharge après le sacrifice des tâches `bonus`, ce sont les tâches d'entretien qui sont compressées ou reportées en priorité afin de sanctuariser 100 % des tâches `core` de la certification la plus proche.
   - **Compression proportionnelle (et non arbitraire à 15 min)** : au lieu d'écraser arbitrairement la durée d'un chapitre compressé à `15 min`, la fonction `computeCompressedMinutes()` applique un facteur proportionnel configurable de `0.5` (50 % de la durée initiale, arrondi aux 5 minutes les plus proches, borné entre `20 min` et `60 min`). Par exemple, une tâche de `80 min` passe à `40 min` (format « lecture synthèse + 1 exercice clé »).

3. **Recalcul des 6 scénarios de test sur le planning réel ([`tests/unit/rescheduler.test.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/tests/unit/rescheduler.test.ts) et D-10)** :
   - Les scénarios 1 et 2 de `docs/05` citaient par erreur la déduplication SQL (`Chapitre 1.2`) en Semaine 5 alors qu'elle est planifiée en **Semaine 4** (`W04-I1`, 80 min), tandis que la **Semaine 5** contient le `Chapitre 1.3 : Séries temporelles SQL` (`W05-I1`, 80 min).
   - Les 6 scénarios ont été recalculés sur les données réelles et vérifiés par 7 tests unitaires dédiés.

---

## 3. Ce qui a été construit et vérifié en Phase 2

| Composant | Fichiers principaux | État et vérification |
| :--- | :--- | :--- |
| **Architecture & Décisions** | [`docs/ARCHITECTURE.md`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/docs/ARCHITECTURE.md), [`docs/DECISIONS.md`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/docs/DECISIONS.md), [`docs/HYPOTHESES.md`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/docs/HYPOTHESES.md) | Séparation stricte statique (`data/` en lecture seule) vs utilisateur (`storage/user_data.sqlite`). Schéma v1/v2 documenté et versionné (`schema_migrations`). |
| **Stockage SQLite local & API** | [`src/server/db.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/server/db.ts), [`src/server/api.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/server/api.ts) | Basé sur le module natif `node:sqlite` (Node >= 22.5, zéro compilation C++). Départ intégral à `0 %` sur les 5 cours Udemy et les 3 certifications (`CLF-C02`, `DEA-C01`, `DBT`), avec synchronisation automatique entre les tâches Udemy hebdomadaires et les plages de leçons. |
| **1. Tableau de bord du jour** | [`src/components/DashboardView.tsx`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/components/DashboardView.tsx) | Affiche la Semaine 1 (2 nov. 2026) par défaut ou toute semaine/date choisie, les comptes à rebours J-X vers les 3 examens et le 2 avril 2027, la jauge hebdomadaire (plafond 600 min / 360 min), les barres de progression pondérées et les tâches `core`/`bonus`. |
| **2. Planning 22 semaines & Replanification** | [`src/domain/rescheduler.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/domain/rescheduler.ts), [`src/components/PlanningView.tsx`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/components/PlanningView.tsx) | Planification intégrale depuis la leçon 1 (`merico` leçons 1 à 203 sur S1-S3, `maarek` sur S4-S14, `toth` leçons 1 à 123 + 162 à 164 sur S15-S18). Filtres par phase, volet, certification et priorité. Actions directes sur chaque tâche + console des scénarios avec explication en français. |
| **3. Cours Udemy & Carte des sujets** | [`src/domain/progression.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/domain/progression.ts), [`src/components/CoursesView.tsx`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/components/CoursesView.tsx) | Suivi des 5 cours Udemy par blocs (tous initialisés à `0 %`), cases à cocher par leçon et par plage (« Cocher les leçons X à Y d'un coup »), recherche instantanée dans `carte_des_sujets.json` et liste AWS Skill Builder. |
| **4. Certifications, Examens blancs & Erreurs** | [`src/domain/readiness.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/domain/readiness.ts), [`src/components/CertificationsView.tsx`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/components/CertificationsView.tsx) | Pondérations officielles vérifiées, saisie des scores d'examens blancs (globaux et par domaine), détection automatique des domaines faibles, indicateur « Prêt pour l'examen » modifiable, et journal des erreurs. |
| **5. Journal des séances d'étude** | [`src/components/SessionsView.tsx`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/components/SessionsView.tsx) | Chronomètre interactif (démarrer, pause, arrêter et enregistrer) + saisie manuelle rapide + comparaison temps réel vs temps estimé. |
| **6. Répétition espacée SM-2** | [`src/domain/spacedRepetition.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/domain/spacedRepetition.ts), [`src/components/SpacedRepetitionView.tsx`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/components/SpacedRepetitionView.tsx) | Algorithme SM-2 complet, création manuelle de cartes avec validation stricte des 4 étiquettes de provenance (Règle 2), notation `0, 3, 4, 5` et règle de maîtrise (`repetitions >= 3 && interval_days >= 14`). |
| **7. Réglages, Sauvegarde JSON & Web Workers** | [`src/domain/backupValidator.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/domain/backupValidator.ts), [`src/components/SettingsView.tsx`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/components/SettingsView.tsx), [`src/workers/sandboxBridge.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/workers/sandboxBridge.ts) | Export JSON daté, import JSON avec validation du schéma v1, chargement/suppression en un clic des données `[DÉMO]`, réinitialisation complète avec confirmation, et ponts Web Worker prêts pour DuckDB-WASM et Pyodide. |

---

## 4. Résultats d'exécution réelle des tests

### A. Tests unitaires (`npm test` : 16/16 passés)
- `tests/unit/progression.test.ts` (3 tests passés) : vérifie que les 5 cours Udemy et les 3 certifications démarrent à `0 %` (`0` leçon terminée), et vérifie la pondération par les minutes lors du cochage d'une plage de leçons (`merico` leçons 1 à 60 ou `maarek` leçons 1 à 25).
- `tests/unit/rescheduler.test.ts` (7 tests passés) : vérifie les 6 scénarios recalculés sur le planning réel (`W04-I1` déduplication SQL en S4, `W05-I1` séries temporelles en S5, semaine 8 manquée, report CLF-C02, re-tentative DEA-C01 à J+14, pull-forward en S6) ainsi que le respect strict des plafonds `600 min` / `360 min`.
- `tests/unit/spacedRepetition.test.ts` (3 tests passés) : vérifie la progression SM-2, le critère de maîtrise stricte (`>= 3` répétitions et `>= 14` jours) et le rejet de toute étiquette de provenance non conforme.
- `tests/unit/backupValidator.test.ts` (3 tests passés) : vérifie la validation du schéma JSON v1 et le cycle complet SQLite `exportBackup -> resetAllUserData -> importBackup`.

### B. Test de bout en bout dans le navigateur (`npm run test:e2e` : 1/1 passé en 7.0s)
- Exécuté dans un vrai navigateur Chromium/Edge via Playwright ([`tests/e2e/app.spec.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/tests/e2e/app.spec.ts)) :
  1. Ouverture de l'application sur `http://127.0.0.1:5173`, vérification de l'affichage de la **Semaine 1 (2026-11-02)** et du départ à **`0 %`** sur les 3 certifications (`CLF-C02`, `DEA-C01`, `DBT`).
  2. Validation de la tâche Udemy `W01-C3` (`merico` leçons 1 à 60, `190 min`), vérification de la jauge hebdomadaire (`190 min` réalisées) et de la hausse immédiate de la progression `CLF-C02` (`> 15 %`) grâce à la synchronisation automatique tâches-leçons.
  3. Report de la tâche `W01-I1` vers la Semaine 2 et vérification du bandeau d'explication du moteur de replanification.
  4. Saisie d'un examen blanc `CLF-C02` à `85 %` et vérification du passage immédiat de l'indicateur à **`PRÊT POUR L'EXAMEN`**.
  5. Recherche du sujet `Kinesis` dans la carte des sujets et création d'une carte mémoire SM-2 sur `AWS Glue Data Catalog`.
  6. Export de la sauvegarde JSON datée, suppression totale des données utilisateur (vérification de la remise à zéro à `0 %`), puis restauration de la sauvegarde JSON et vérification que la tâche terminée (`190 min`), la progression `CLF-C02` (`> 15 %`), la tâche reportée et le score d'examen blanc à `85 %` sont intégralement revenus.

---

## 5. Ce qui est prêt à accueillir les Prompts 3 et 4

- Le pont d'isolation Web Worker ([`src/workers/sandboxBridge.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/workers/sandboxBridge.ts) et [`src/workers/types.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/workers/types.ts)) est en place pour intégrer **DuckDB-WASM** (éditeur SQL et plans `EXPLAIN`) et **Pyodide** (exécution Python et tests unitaires) au Prompt 3.
- Le moteur SM-2 ([`src/domain/spacedRepetition.ts`](file:///c:/Users/auren.moyo/Documents/FORMATION/application%20formation%20et%20entretien/pack-antigravity-prep-cdi/src/domain/spacedRepetition.ts)) et la table SQLite `flashcards` sont prêts à recevoir les cartes mémoire et la banque de questions d'entretien des Prompts 3 et 4.
