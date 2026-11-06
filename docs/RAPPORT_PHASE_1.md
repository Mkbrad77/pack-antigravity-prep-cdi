# Rapport de Synthèse de la Phase 1 : Recherche, Vérification et Programme Pédagogique

**Date :** 31 octobre 2026  
**Auteur :** Antigravity (Chef de projet pédagogique Data & AI Engineering)  
**Destinataire :** Auren Moyo (Ingénieur EPITA, alternant Data & IA)

---

## 1. Travaux Réalisés (Les 6 Livrables de la Phase 1)

Tous les livrables documentaires de la Phase 1 ont été produits dans le dossier `docs/` sans aucune ligne de code applicatif, conformément aux règles d'intégrité et de traçabilité :

1. **Vérification Officielle des Examens (`docs/01_verification_examens.md`) :**
   - Analyse exhaustive des trois examens (AWS CLF-C02, AWS DEA-C01 v1.1, dbt Analytics Engineering).
   - Vérification des modalités officielles (durée, nombre de questions, seuil de passage, prix, validité, politiques de reprise).
   - Confirmation de l'aménagement AWS ESL +30 min (extension permanente accordée automatiquement) et du bon de réduction de 50 % obtenu dès la réussite de CLF-C02.
   - Validation et clarification des 6 hypothèses de planning.

2. **Analyse du Marché de l'Emploi CDI (`docs/02_analyse_marche.md`) :**
   - Étude terrain portant sur 120 offres de CDI en France (30 par métier : Data Engineer, AI Engineer, ML Engineer, Data Scientist) sur Welcome to the Jungle, Apec, Free-Work et LinkedIn (chiffres et fréquences étiquetés « non vérifié, indicatif »).
   - Profil du candidat clarifié : ingénieur EPITA déjà diplômé depuis avril 2026, actuellement en alternance data/IA jusqu'en avril 2027.
   - Tableau de fréquence indicatif sur 19 compétences clés.
   - Justification stratégique de l'ordre des certifications : DEA-C01 constitue le pivot central le plus recherché sur le marché du Data Engineering et des pipelines de données pour l'IA.

3. **Recensement des Sources Sérieuses pour Entretiens (`docs/03_sources_entretiens.md`) :**
   - Sélection de 24 sources d'autorité (documentations officielles dont Scikit-learn, plateformes d'exercices, blogs d'ingénierie reconnus et retours de candidats communautaires avec URLs vérifiées sur Reddit r/dataengineering, LeetCode Discuss et Reddit r/LocalLLaMA).
   - Distingue rigoureusement les questions attestées par retours de candidats des thèmes plausibles non attestés.
   - Conditions d'usage strictes : zéro copie directe, étiquetage obligatoire de l'origine.

4. **Programme Pédagogique d'Entraînement aux Entretiens (`docs/04_programme_pedagogique.md`) :**
   - Calibrage rigoureux sur le budget strict de 2 400 minutes (40 heures réparties sur 22 semaines) défini dans `data/planning_hebdo.json`.
   - Couverture intégrale des 52 chapitres retenus (aucun chapitre sacrifié, intégration de la modélisation dimensionnelle Kimball, du SCD2 et de la POO Python).
   - Concentration sur les compétences les plus éliminatoires : live coding (SQL fenêtré, structures de données Python), System Design (Spark, streaming Kafka, idempotence) et architectures RAG.
   - Conversion des modules secondaires 5 (ML) et 6 (Software Engineering) en 10 fiches mémos opérationnelles de 15 à 20 minutes (180 minutes au total).

5. **Planning Hebdomadaire d'Entretiens et Moteur de Replanification (`docs/05_planning_entretiens_et_replanification.md`) :**
   - Découpage semaine par semaine (semaines 1 à 22) aligné à la minute près sur `interview_budget_min` (totalisant exactement 2 400 minutes, avec semaine 2 recalibrée à 60 minutes).
   - Pseudo-code de l'algorithme de replanification respectant la règle d'or : aucune création de dette de travail impossible à rattraper, plafonnement strict à 10 h/semaine (6 h en période de fêtes).
   - Démonstration chiffrée de l'algorithme sur les 6 vrais scénarios modélisés dans le document 05 :
     1. *Scénario 1 : Séance d'entretien ratée (Semaine 5, 60 minutes perdues sur la déduplication SQL)* : absorption intégrale en Semaine 6 grâce à la marge disponible sans décalage.
     2. *Scénario 2 : Semaine entière ratée pour maladie (Semaine 6, 8 heures perdues)* : abandon ferme des bonus (micro-certifications), sauvetage des cours Core en S7 et étalement des entretiens SQL en fiches condensées sur S8 et S9 sans repousser le DEA.
     3. *Scénario 3 : Semaine d'examen (Semaine 14 du DEA-C01, fatigue le mercredi)* : annulation du blanc bonus, réduction de l'entretien à 20 min de relecture STAR et préservation de 40 min de repos.
     4. *Scénario 4 : Retard et score blanc DEA inférieur à 80 % (Semaine 13, score de 72 %)* : report d'une semaine du DEA (en Semaine 15) absorbé grâce aux 2 semaines de réserve finales sans impacter l'examen dbt.
     5. *Scénario 5 : Échec à l'examen DEA le 5 février (score de 690/1000)* : respect du délai de carence AWS de 14 jours, repassage le 19 février (Semaine 16) et bascule de la certification dbt sur la semaine de réserve 21 (26 mars) avant l'échéance du contrat.
     6. *Scénario 6 : Semaine de fêtes de fin d'année (Semaine 8, budget allégé à 6 heures / 360 min)* : suppression automatique des cours bonus (OpenSearch, conteneurs) et préservation du socle Core avec marge de repos.

6. **Bibliothèque de Ressources Structurée (`docs/06_bibliotheque_ressources.json`) :**
   - Formatage JSON strict des 24 sources documentaires sélectionnées (incluant Scikit-learn et les 3 retours communautaires) avec l'ensemble des métadonnées requises.

7. **Documents de Gouvernance (`docs/DECISIONS.md` et `docs/HYPOTHESES.md`) :**
   - Enregistrement des décisions clés et des 10 hypothèses de travail du projet.

---

## 2. Points Non Vérifiés avec Certitude

Conformément aux exigences de rigueur et d'honnêteté intellectuelle du projet, les points suivants sont explicitement répertoriés comme non vérifiés avec certitude :
1. **Données quantitatives de l'analyse du marché de l'emploi (`docs/02_analyse_marche.md`) :** En l'absence d'une base de données exhaustive des offres indexées avec URLs et dates individuelles archivées pour chaque offre, tous les chiffres, pourcentages et fréquences sont formellement étiquetés « non vérifié, indicatif ».
2. **Délai de carence exact après un deuxième échec consécutif à l'examen dbt Labs :** Si la politique Webassessor applique classiquement un délai de carence recommandé de 14 jours après une première tentative infructueuse, la documentation publique de dbt Labs ne détaille pas le délai obligatoire imposé au-delà de deux échecs (information accessible uniquement dans l'espace candidat après passage).
3. **Barème exact des frais d'annulation tardive dbt Labs à moins de 24 heures :** Le report est officiellement gratuit à plus de 24 heures (ou 72 heures en centre physique), mais le montant exact des frais retenus en cas d'annulation le jour même relève des conditions spécifiques du prestataire Kryterion au moment de l'inscription (non documenté publiquement de manière universelle).

---

## 3. Incohérences Relevées dans les Fichiers Fournis

1. **Intégration et validation de `planning_hebdo_lisible.md` :**
   - *Constat :* Le fichier a été déposé dans `data/` et analysé. Sa structure et ses volumes correspondent en tout point aux données de `data/planning_hebdo.json` (mêmes jalons du 20 nov, 4-5 fév et 19 mars, coefficients vidéo de 1,15 à 1,4, réserve en semaines 21-22).
   - *Statut :* Cohérence confirmée à 100 %.

2. **Écart de granularité sur les cours AWS Skill Builder :**
   - *Constat :* `catalogue_formations.json` mentionne globalement les ressources Skill Builder, tandis que `skillbuilder_aws.json` détaille 10 parcours spécifiques (Exam Prep Official Practice Question Sets, micro-certifications).
   - *Impact :* Minime sur le planning global.
   - *Recommandation :* Retenir `skillbuilder_aws.json` comme référence de contenu pour les révisions officielles AWS.

3. **Volume de `programme_cible_chapitres.md` vs Budget de `planning_hebdo.json` :**
   - *Constat :* La liste initiale de 141 chapitres représentait plus de 125 heures de travail (>7 500 minutes), alors que le budget d'entretiens alloué dans `planning_hebdo.json` est strictement fixé à 40 heures (2 400 minutes).
   - *Impact :* Risque majeur de surcharge cognitive et d'échec du planning si les 141 chapitres étaient traités avec la même granularité.
   - *Recommandation adoptée :* Valider la solution de `docs/04_programme_pedagogique.md` (filtrage des prérequis déjà maîtrisés et fiches mémos pour les modules 5 et 6).

---

## 4. Décisions Soumises à la Validation d'Auren pour le Lancement de la Phase 2

Avant de démarrer la Phase 2 (Architecture et conception technique de l'application locale), les 4 arbitrages suivants requièrent votre accord formel :

- **Validation 1 (Programme d'entretiens) :** Confirmez-vous le ciblage du budget de 2 400 minutes sur les compétences discriminantes (SQL live coding, structures Python, System Design data, RAG) et le traitement des modules 5 (ML) et 6 (Software Engineering) sous la forme de 10 fiches mémos opérationnelles ?
- **Validation 2 (Aménagement AWS) :** Validez-vous la démarche de solliciter l'extension "ESL +30 MINUTES" dans votre espace AWS Certification avant de planifier la session CLF-C02 du 20 novembre 2026 ?
- **Validation 3 (Variable d'ajustement) :** Confirmez-vous que la certification dbt (visée le 19 mars 2027) servira de variable d'ajustement prioritaire (report ou allègement) si la charge de révision de DEA-C01 exigeait un temps d'étude supplémentaire en janvier-février 2027 ?
- **Validation 4 (Orientation technique Phase 2) :** Êtes-vous en accord avec une architecture locale Windows autonome, zéro budget, basée sur des technologies web locales légères (ex. application web locale Python / Node.js avec stockage de données JSON ou SQLite local, sauvegarde/restauration en un clic), sans recours obligatoire à des API d'IA payantes ?
