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

**Ordre de priorité des certifications et organisation réelle du planning (D-25, recalé le 11 novembre 2026 sur les vraies durées Udemy) :**
Source de vérité : `data/planning_hebdo.json` et `src/domain/phases.ts`. Les durées viennent de `data/catalogue_formations.json` (vidéo x coefficient / vitesse de lecture, plus quiz et exercices). Progression réelle déclarée par Auren au 11/11/2026 : Merico leçons 1 à 35 terminées, tous les autres cours à 0 % (seule exception autorisée aux interdictions ci-dessus).
1. **Semaines 1 à 5 (`2026-11-09` au `2026-12-13`) : AWS Cloud Practitioner (`CLF-C02`)**, examen le **vendredi 11 décembre 2026**. Merico leçons 36 à 203 (vidéos en 1,25x), revues Skill Builder, 12 Podcasts CLF, examens pratiques en S5.
2. **Semaines 5 à 11 (`2026-12-12` au `2027-01-24`) : dbt Analytics Engineering (`DBT`)**, examen le **vendredi 22 janvier 2027**. Toth (blocs obligatoires, 1,25x) puis Weigel « The Complete dbt Certification Course » (leçons 66 à 130, 1,25x), modules learn.getdbt.com, 16 Podcasts dbt, Qanalabs. Semaines 7 et 8 (fêtes) limitées à 360 min.
3. **Semaines 11 à 20 (`2027-01-23` au `2027-03-28`) : AWS Certified Data Engineer Associate (`DEA-C01`)**, examen le **vendredi 26 mars 2027**. Maarek & Kane (blocs obligatoires), revues Skill Builder, tests d'entraînement séparés (S18, S19), 16 Podcasts DEA alignés sur les blocs Maarek.
4. **Semaines 21 et 22 :** Quickstarts finaux, Agents IA et sprint final CDI (contrat jusqu'au 2 avril 2027).
Blocs en bonus (planifiés seulement là où la semaine reste sous son plafond) : Toth (dbt-expectations, Fusion, Dagster, capstone, Power User), Weigel (installation, sources, macros de base, modèles Python), Maarek (conteneurs, OpenSearch/QuickSight, réseau, SageMaker, Bedrock, outils développeur, divers) et tout le cours Nikolai. Quickstart Snowflake ou dbt obligatoire chaque semaine de S1 à S21.

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

## 6. Interface : règles à préserver (refonte D-20)

- Navigation à 5 entrées (Aujourd'hui, Planning, Cours, Pratique, Podcasts) ; tout nouvel écran secondaire va dans le menu profil, pas dans la barre.
- Aucune couleur en dur dans les composants : utiliser les variables de `src/index.css`, qui existent en thème sombre et en thème clair.
- Aucun emoji dans les boutons, onglets ou badges : utiliser une icône `lucide-react` accompagnée d'un libellé texte. Les emoji restent autorisés dans les textes de cours.
- Pas de `<select>` pour moins de 6 options (utiliser `.segmented` ou `.chips`) ; toujours un libellé visible ou `aria-label` sur les champs.
- Cibles tactiles d'au moins 24 px, police d'au moins 12 px (`0.75rem`), libellés en français avec accents.
