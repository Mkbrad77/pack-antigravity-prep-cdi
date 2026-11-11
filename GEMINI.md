# Règles Permanentes du Projet (Antigravity & Gemini)

**Projet :** Pack Préparation Intensive CDI Data & AI (Auren Moyo)  
**Date :** 6 novembre 2026 (Départ programmé le Lundi 9 novembre 2026)

---

## RÈGLE CRITIQUE : DÉPART À 0 % SUR TOUS LES COURS UDEMY ET CERTIFICATIONS

**Consigne absolue :**
Auren repart strictement de **0 %** sur l'ensemble des 5 cours Udemy, des 3 certifications et des 44 Podcasts NotebookLM :
1. Cours Merico (AWS Cloud Practitioner CLF-C02) : départ à la **leçon 1**, 0 % initial.
2. Cours Zoltan C. Toth (dbt Complete Bootcamp) : départ à la **leçon 1**, 0 % initial.
3. Cours Daniel Weigel (dbt Certification Course) : départ à la **leçon 1**, 0 % initial.
4. Cours Maarek et Kane (AWS Data Engineer Associate DEA-C01) : départ à la **leçon 1**, 0 % initial.
5. Cours Nikolai Schuler (AWS DEA-C01 complément) : départ à la **leçon 1**, 0 % initial.

**Interdictions formelles :**
- Ne jamais présumer ou affirmer qu'un cours est « déjà commencé », « déjà avancé » ou « déjà fait ».
- Ne jamais pré-cocher de leçons ou de tâches dans le catalogue (`data/catalogue_formations.json`) ou la base SQLite locale (`storage/user_data.sqlite`).
- Ne jamais exclure les premières leçons du planning hebdomadaire.

**Ordre des certifications et planning hebdomadaire réel (Départ Lundi 9 novembre 2026) :**
- **Planning D-25 (recalé le 11/11/2026 sur les vraies durées Udemy, voir `src/domain/phases.ts`) :** `CLF-C02` en S1 à S5 (examen vendredi 11/12/2026, Merico 1 à 35 déjà faites), `DBT` en S5 à S11 (examen vendredi 22/01/2027, Toth puis Weigel « The Complete dbt Certification Course »), `DEA-C01` en S11 à S20 (examen vendredi 26/03/2027, Maarek & Kane, Nikolai en bonus), S21 et S22 en réserve.
- **Semaines 20 à 22 :** Réserve, Quickstart Agents IA Cortex & Sprint final CDI (9 avril 2027).

**Synchronisation automatique & Auto-renommage Audio :**
- La validation d'une tâche hebdomadaire Udemy coche automatiquement la plage de leçons correspondante dans `lesson_progress`.
- Tout fichier audio déposé dans `public/audios/clf-c02`, `public/audios/dbt` ou `public/audios/dea-c01` est automatiquement identifié et renommé au format officiel (`CLF-AUDIO-XX.m4a`, `DBT-AUDIO-XX.m4a`, `DEA-AUDIO-XX.m4a`).

---

## Contraintes de Temps et de Charge

- Jusqu'à 11 heures par semaine maximum (660 min) lorsque nécessaire.
- **6 heures par semaine maximum pendant les semaines des fêtes de décembre (Semaines 7 Noël et 8 Nouvel An : 360 min max, 290 min Core)**. Ne jamais augmenter la charge de travail sur ces semaines.
- Ne jamais créer de dette de travail impossible à rattraper.

---

## Règle Typographique Stricte : Zéro Tiret Cadratin

- N'utilise JAMAIS de tirets cadratins (le long tiret cadratin ou demi-cadratin). Préfère les deux-points `:`, les virgules `,` ou les parenthèses `()`.

---

## Sources et Droits d'Auteur

- Sources officielles requises (AWS Documentation, dbt Documentation, Snowflake Documentation).
- Zéro braindump, zéro copie de cours payants.
- Étiquette obligatoire : `générée par IA et vérifiée dans la documentation (2026-10-31)`.
- Réfutation explicite obligatoire pour chaque option incorrecte.

---

## Mode Cloud (Cloudflare)

L'application est aussi déployée en ligne (Worker `prep-cdi`, bucket R2 `prep-cdi-audios`). Avant toute modification du serveur, lire la section 5 de `AGENTS.md` (aucun import Node statique dans le code partagé). Pour ajouter des podcasts : `docs/PROMPT_ANTIGRAVITY_AUDIOS.md` (aucun code à modifier).
