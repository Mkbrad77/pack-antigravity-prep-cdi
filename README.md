# Pack Préparation Intensive CDI Data & AI (Auren Moyo)

Application locale de pilotage de préparation intensive aux certifications et entretiens de recrutement CDI (Data Engineer, AI Engineer).

---

## RÈGLE CRITIQUE ET FONDAMENTALE : DÉPART À 0 % SUR TOUS LES COURS ET CERTIFICATIONS

**Consigne absolue pour tous les agents Antigravity :**
Auren repart strictement de **0 %** sur l'ensemble des 5 cours Udemy et des 3 certifications :
1. Cours Merico (AWS Cloud Practitioner CLF-C02) : départ à la **leçon 1**, 0 % initial.
2. Cours Maarek et Kane (AWS Data Engineer Associate DEA-C01) : départ à la **leçon 1**, 0 % initial.
3. Cours Nikolai Schuler (AWS DEA-C01 complément) : départ à la **leçon 1**, 0 % initial.
4. Cours Zoltan C. Toth (dbt Complete Bootcamp) : départ à la **leçon 1**, 0 % initial.
5. Cours Daniel Weigel (dbt Certification Course) : départ à la **leçon 1**, 0 % initial.

**Interdictions :**
- Ne jamais présumer ou affirmer qu'un cours est « déjà commencé », « déjà avancé » ou « déjà fait ».
- Ne jamais pré-cocher de leçons ou de tâches dans le catalogue (`data/catalogue_formations.json`) ou la base SQLite (`storage/user_data.sqlite`).
- Toutes les premières leçons sont planifiées :
  - **Semaine 1 (CLF-C02, cours Merico) :** leçons 1 à 120 (540 min total).
  - **Semaine 2 (CLF-C02, cours Merico) :** leçons 121 à 199 (560 min total). Leçons 200 à 203 en Semaine 3.
  - **Semaine 15 (dbt, cours Toth) :** leçons 1 à 49 (470 min total).

**Synchronisation automatique :**
La validation d'une tâche de cours Udemy dans le planning (via `/api/tasks/update`) synchronise automatiquement la plage de leçons correspondante (`first` à `last`) dans la table `lesson_progress`.

---

## Démarrage Rapide

```powershell
# Installation des dépendances (si premier lancement)
npm install

# Démarrage de l'application locale
npm run start
# ou double-clic sur demarrer.bat

# Validation du contenu pédagogique
node scripts/validate_certification_content.js

# Exécution des tests unitaires
npm test
```

---

## Contraintes et Règles Non Négociables

1. **Budget temporel :** 8 à 10 heures par semaine au maximum (480 à 600 min). Semaines 8 et 9 allégées à 6 heures (360 min).
2. **Zéro tiret cadratin :** aucun tiret cadratin (le long tiret cadratin ou demi-cadratin) dans les textes, la documentation, le code ou les commentaires. Préférer les deux-points, les virgules ou les parenthèses.
3. **Persistance locale :** base de données SQLite locale stockée dans `storage/user_data.sqlite` via le module natif `node:sqlite` de Node.js v24.
4. **Honnêteté documentaire :** chaque question est étiquetée avec sa provenance, sa date de vérification (`2026-10-31`) et son URL source officielle, sans braindump ni copie de cours payants.

---

## Architecture de la Documentation

- `docs/DECISIONS.md` : registre des décisions architecturales et pédagogiques (D-01 à D-16).
- `docs/HYPOTHESES.md` : registre des hypothèses de travail (H-01 à H-18).
- `docs/GUIDE_UTILISATEUR.md` : guide d'utilisation de l'application et de ses modules.
- `docs/RAPPORT_PHASE_1.md` : rapport de la Phase 1 (Recherche et programme).
- `docs/RAPPORT_PHASE_2.md` : rapport de la Phase 2 (Architecture et application de base).
- `docs/RAPPORT_PHASE_3.md` : rapport de la Phase 3 (Contenu des certifications, 74 chapitres, 13 fiches express, 600 questions).
- `prompts/` : les 4 prompts successifs encadrant le cycle de développement.
