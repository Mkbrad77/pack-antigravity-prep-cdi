# Règle Absolue : Départ à 0 % sur les Cours Udemy et Certifications

Lors de chaque session, conversation ou action dans ce projet :

1. **Auren repart strictement de 0 % sur l'ensemble des 5 cours Udemy et des 3 certifications :**
   - Amadou Merico (AWS CLF-C02) : départ à la leçon 1 (Semaine 1).
   - Zoltan C. Toth (dbt Bootcamp) : départ à la leçon 1 (Semaine 4).
   - Daniel Weigel (dbt Certification) : départ à la leçon 1 (Semaine 6).
   - Stéphane Maarek et Frank Kane (AWS DEA-C01) : départ à la leçon 1 (Semaine 11).
   - Nikolai Schuler (AWS DEA-C01) : départ à la leçon 1 (Semaine 11).

2. **Interdictions formelles :**
   - Ne jamais affirmer ou supposer qu'un cours est « déjà commencé », « déjà avancé » ou « déjà fait ».
   - Ne jamais pré-cocher de cours ou leçons au lancement ou dans les données initiales.
   - Ne jamais omettre les leçons 1 à 120 de Merico ni les leçons 1 à 49 de Toth du planning.

3. **Planning hebdomadaire réel (dbt prioritaire dès Semaine 4 + 15 Quickstarts Snowflake ML) :**
   - Semaine 1 : leçons Merico 1 à 120 (540 min total avec budget entretiens).
   - Semaine 2 : leçons Merico 121 à 199 (560 min total). Leçons 200 à 203 en Semaine 3 (examen CLF-C02 le 20/11/2026).
   - Semaines 4 à 10 (Urgence N°1 : dbt Analytics Engineering, examen le 08/01/2027) : leçons Toth 1 à 49 dès Semaine 4, Weigel dès Semaine 6, parcours officiel `learn.getdbt.com`, ressources Devoteam et premiers Quickstarts Snowflake.
   - Semaines 11 à 20 (AWS DEA-C01 + 15 Quickstarts Snowflake ML, examen le 19/03/2027) : leçons Maarek 1 à 309 et Nikolai dès Semaine 11.

4. **Synchronisation :**
   - Valider une tâche Udemy dans le planning (`/api/tasks/update`) coche automatiquement la plage de leçons correspondante dans `lesson_progress`.
