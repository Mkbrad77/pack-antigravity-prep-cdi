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
- **Semaines 1 à 3 (`CLF-C02`, examen 27 nov. 2026) :** leçons Merico 1 à 120 en Semaine 1, 121 à 199 en Semaine 2, et 200 à 203 + examen en Semaine 3, avec écoute récursive des 12 Podcasts `CLF-AUDIO-01..12` et démarrage anticipé de `DBT` le week-end de Semaine 3 (28-29 nov.).
- **Semaines 4 à 9 (URGENCE N°1 : `DBT` Analytics Engineering, examen maintenu au 8 janv. 2027) :** Zoltan Toth (leçons 1 à 164), Daniel Weigel (leçons 1 à 58), `learn.getdbt.com`, Google Doc Devoteam, Qanalabs, Free Trial Snowflake 120j de Fred, Quickstart Snowflake ML #1 et 16 Podcasts `DBT-AUDIO-01..16`. Semaines 7 (Noël) et 8 (Nouvel An) strictement allégées (`290 min Core <= 360 min`).
- **Semaines 10 à 19 (`DEA-C01` + 15 Quickstarts Snowflake ML, examen 19 mars 2027) :** départ leçon 1 sur Maarek & Kane et Nikolai Schuler en Semaine 10, combinés avec les 16 Podcasts `DEA-AUDIO-01..16` et 1 à 2 Quickstarts Snowflake ML par semaine.
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
