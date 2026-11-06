# Instructions Permanentes pour Antigravity et les Agents

**Projet :** Pack Préparation Intensive CDI Data & AI (Auren Moyo)  
**Date de révision :** 6 novembre 2026 (Départ programmé le Lundi 9 novembre 2026)

---

## 1. RÈGLE CRITIQUE ET NON NÉGOCIABLE : DÉPART À 0 % SUR TOUS LES COURS UDEMY ET CERTIFICATIONS

**Consigne absolue :**
Auren repart strictement de **0 %** sur l'ensemble des 5 cours Udemy, des 3 certifications et des 44 Podcasts NotebookLM :
1. Cours Merico (AWS Cloud Practitioner CLF-C02) : départ à la **leçon 1**, 0 % initial.
2. Cours Zoltan C. Toth (dbt Complete Bootcamp) : départ à la **leçon 1**, 0 % initial.
3. Cours Daniel Weigel (dbt Certification Course) : départ à la **leçon 1**, 0 % initial.
4. Cours Maarek et Kane (AWS Data Engineer Associate DEA-C01) : départ à la **leçon 1**, 0 % initial.
5. Cours Nikolai Schuler (AWS DEA-C01 complément) : départ à la **leçon 1**, 0 % initial.

**Interdictions formelles :**
- Ne jamais présumer ou affirmer qu'un cours est « déjà commencé », « déjà avancé » ou « déjà fait ».
- Ne jamais pré-cocher de leçons ou de tâches dans le catalogue ou la base de données SQLite.
- Ne jamais exclure les premières leçons du planning hebdomadaire.

**Ordre de priorité des certifications et organisation réelle du planning (Départ Lundi 9 novembre 2026) :**
1. **Semaines 1 à 3 (`2026-11-09` au `2026-11-29`) : AWS Cloud Practitioner (`CLF-C02`) + 12 Podcasts CLF-C02** (examen cible : **Vendredi 27 novembre 2026**) :
   - **Semaine 1 (`09-15 nov.`) :** cours Merico leçons 1 à 120 + écoute des Podcasts `CLF-AUDIO-01` à `06`.
   - **Semaine 2 (`16-22 nov.`) :** cours Merico leçons 121 à 199 + écoute des Podcasts `CLF-AUDIO-07` à `12` + 2e écoute récursive `01-06`.
   - **Semaine 3 (`23-29 nov.`) :** cours Merico leçons 200 à 203 + examens blancs + passage `CLF-C02` le 27/11 + démarrage anticipé de `DBT` le week-end (activation Free Trial Snowflake 120j de Fred + Zoltan Toth leçons 1 à 16 + `DBT-AUDIO-01` et `02`).
2. **Semaines 4 à 9 (`2026-11-30` au `2027-01-10`) : PRIORITÉ URGENTE N°1 : dbt Analytics Engineering (`DBT`) + 16 Podcasts DBT + Premiers Quickstarts Snowflake** (examen cible maintenu au **Vendredi 8 janvier 2027**) :
   - **Semaines 4 à 6 (`30 nov. - 20 déc.`) :** compensation du décalage initial avant les fêtes (cours Zoltan Toth jusqu'à la fin leçon 164, cours Daniel Weigel leçons 1 à 40, parcours officiel `learn.getdbt.com`, Google Doc Devoteam, Qanalabs, Quickstart Snowflake ML #1 et Podcasts `DBT-AUDIO-01` à `14`).
   - **Semaines 7 et 8 (`21 déc. - 3 janv.`, Fêtes de Noël et Nouvel An) :** semaines **strictement allégées** (`<= 360 min / 6h`, soit `290 min Core`), aucune surcharge pendant les fêtes (fin Daniel Weigel 41 à 58, Podcasts `DBT-AUDIO-15` et `16`, révisions légères et examens blancs).
   - **Semaine 9 (`04-10 janv.`) :** sprint final, 3e écoute des podcasts critiques et passage de la certification `dbt Analytics Engineering` le **8 janvier 2027**.
3. **Semaines 10 à 19 (`2027-01-11` au `2027-03-21`) : AWS Certified Data Engineer Associate (`DEA-C01`) + 16 Podcasts DEA + 15 Quickstarts Snowflake ML** (examen cible : **Vendredi 19 mars 2027**) :
   - Cours Maarek & Kane (départ leçon 1 en Semaine 10, leçons 1 à 309) + Nikolai Schuler (départ leçon 1 en Semaine 10) + 16 Podcasts `DEA-AUDIO-01` à `16` + Quickstarts Snowflake ML #2 à #15.
4. **Semaines 20 à 22 (`2027-03-22` au `2027-04-09`) :** Semaine 20 de réserve, Quickstart Agents IA Cortex & Sprint final CDI (9 avril 2027).

**Auto-renommage des fichiers Audio NotebookLM :**
L'application scanne automatiquement `public/audios/clf-c02`, `public/audios/dbt` et `public/audios/dea-c01` à chaque chargement (`/api/state` et `/api/podcasts/auto-rename`) et renomme les fichiers bruts exportés de NotebookLM selon `data/podcasts_catalog.json` (`CLF-AUDIO-01..12`, `DBT-AUDIO-01..16`, `DEA-AUDIO-01..16`).

---

## 2. Contraintes de Temps et de Charge

- **Budget hebdomadaire :** 8 à 11 heures par semaine au maximum (soit 480 à 660 minutes par semaine) pour TOUT (certifications, Quickstarts Snowflake, podcasts ET préparation aux entretiens).
- **Période de fêtes :** Semaines 7 (Noël : 21-27 déc.) et 8 (Nouvel An : 28 déc. - 3 janv.) **strictement allégées à 6 heures par semaine maximum (360 minutes, 290 min Core)**. Ne jamais augmenter la charge de travail sur ces deux semaines.
- **Principe de replanification :** Ne jamais créer de dette de travail impossible à rattraper. En cas de retard, sacrifier d'abord les tâches `bonus`, puis compresser les révisions d'entretiens.

---

## 3. Règle Typographique Stricte : Zéro Tiret Cadratin

- **Interdiction :** N'utilise JAMAIS de tirets cadratins (le long tiret cadratin ou demi-cadratin) dans les textes de l'application, les fichiers markdown, le code source ou les commentaires.
- **Remplacement :** Utilise systématiquement les deux-points `:`, les virgules `,` ou les parenthèses `()`.

---

## 4. Honnêteté Documentaire et Droit d'Auteur

- Chaque question ou fait technique important doit avoir une source vérifiée avec URL officielle (AWS Documentation, dbt Documentation, Snowflake Documentation) et date de vérification.
- Ne jamais utiliser de braindumps ni copier de questions payantes.
- Chaque question porte son étiquette de traçabilité : `générée par IA et vérifiée dans la documentation (2026-10-31)`.
- Chaque option fausse doit avoir sa réfutation explicite argumentée dans l'explication.

---

## 5. Mode Cloud (Cloudflare) : invariants à préserver

L'application tourne aussi en ligne (Worker Cloudflare `prep-cdi`, voir `docs/DEPLOIEMENT_CLOUD.md`). Le même code métier sert les deux modes, donc :
- **Aucun import Node statique** (`node:fs`, `node:path`, `node:sqlite`, `node:child_process`, `node:os`) dans `src/server/db.ts`, `src/server/api.ts`, `src/server/sqlSandbox.ts` ou `src/domain/`. Utiliser `requireNodeBuiltin()` (`src/server/sqlDb.ts`) dans les fonctions propres au mode local, ou passer par `src/server/nodeRuntime.ts`.
- **Lecture du contenu** (`data/`, `content/`) uniquement via `store.content` (`ContentSource`), jamais via `fs` dans le routeur API.
- **Disponibilité des podcasts** : via `ApiRuntime.audioExists()` (disque en local, bucket R2 en ligne). Ajouter un podcast ne demande aucune modification de code : `npm run audios:upload`.
- **Date du jour** : toujours `getEffectiveTodayIso(settings)` (`src/domain/dates.ts`), jamais une date codée en dur.
- **Avant de livrer** : `npm test`, `npx tsc --noEmit -p worker/tsconfig.json` et `npx wrangler deploy --dry-run` doivent passer.
