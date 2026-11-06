# Pack Antigravity : préparation CDI Data et AI (certifications + entretiens)

Ce pack remplace ton gros prompt unique par 4 prompts successifs, chacun avec un périmètre limité, un rapport de fin et un arrêt obligatoire. Il remplace aussi le premier plan de certifications (`plan-aws-clf-dea-dbt-nov2026-mars2027.md`) : le planning de référence est maintenant `data/planning_hebdo.json` (version lisible : `planning_hebdo_lisible.md`).

## Contenu du pack
- `prompts/PROMPT_1_recherche_et_programme.md` : recherche et vérification, aucun code d'application.
- `prompts/PROMPT_2_architecture_et_application_de_base.md` : architecture, planning, suivi, espaces certifications, répétition espacée.
- `prompts/PROMPT_3_contenu_certifications.md` : chapitres, banque de questions et examens blancs CLF, DEA, dbt.
- `prompts/PROMPT_4_entretiens_et_validation_finale.md` : éditeurs SQL et Python, cours Data et AI, questions d'entretien, simulateur, compétences, projets, validation finale.
- `data/` : catalogue des cours Udemy et AWS Skill Builder, planning hebdomadaire, carte des sujets, programme cible des entretiens.
- `planning_hebdo_lisible.md` : le planning semaine par semaine à lire toi-même.

Chaque prompt contient déjà le même bloc de contexte (qui tu es, ton budget d'heures, tes examens, tes cours, les règles). Tu n'as rien à coller en plus.

## Mise en place
1. Crée un dossier de projet vide (par exemple `data-ai-prep`).
2. Copie le dossier `data/` du pack à l'intérieur, tel quel.
3. Ouvre ce dossier dans Antigravity.
4. Lance le prompt 1 en le collant en entier. Ne lance pas les suivants avant d'avoir validé le rapport.

## Ordre et validation (à chaque étape)
| Prompt | Tu lances quand | Tu valides avant de continuer |
|---|---|---|
| 1 | Maintenant | `docs/RAPPORT_PHASE_1.md` lu. Vérifie surtout `01_verification_examens.md` (dates, durées, 30 min en plus, 50 % de réduction) et que le budget des entretiens tient. |
| 2 | Après validation du 1 | L'application démarre en une commande, ta semaine du 2 novembre s'affiche, reporter une tâche ne décale pas tout, sauvegarde puis restauration OK, tests exécutés (résultats joints). |
| 3 | Après validation du 2 | Chaque question a explication, source et étiquette. Examen blanc complet testé. Renvois vers tes leçons exacts (vérifie 3 ou 4 à la main). |
| 4 | Après validation du 3 | Une requête SQL et un code Python s'exécutent et sont corrigés automatiquement. Simulation d'entretien complète. Rien n'est « maîtrisé » sans réussites espacées. |

## Si Antigravity dérape
- Il code pendant le prompt 1 : réponds « Phase 1 uniquement, aucun code, reviens aux livrables docs/ ».
- Il saute les tests : réponds « Exécute les tests dans un vrai navigateur et joins les résultats avant de continuer ».
- Il fabrique des questions « réelles » ou des statistiques : demande la source et l'étiquette de provenance, supprime sinon.
- Il s'arrête à mi-chemin ou perd le fil : relance-le avec « Relis docs/RAPPORT_PHASE_N.md et la liste des critères de réussite, puis termine ce qui manque ».
- Il propose de changer ton planning : refuse, le planning de `data/` est la référence. Il peut seulement signaler des incohérences dans son rapport.
- Il oublie que tu repars de 0 % sur les cours Udemy : rappelle-lui la règle stricte de départ à 0 % (D-13, H-18, AGENTS.md), toutes les leçons commencent dès la numéro 1 sans exception.

## Rappels de planning (à ne pas perdre de vue)
- Départ strict à 0 % sur l'ensemble des 5 cours Udemy et des 3 certifications : toutes les leçons démarrent à la numéro 1 sans exception. Les leçons Merico 1 à 120 sont en Semaine 1, 121 à 199 en Semaine 2. Les leçons Toth 1 à 49 sont en Semaine 15.
- Examen CLF-C02 : vendredi 20 novembre 2026. Examen DEA-C01 : jeudi 4 ou vendredi 5 février 2027. Examen dbt : vendredi 19 mars 2027 (déplacé du 12 au 19 mars pour étaler le travail sur six semaines).
- Cours principal DEA : Maarek et Kane. Le cours Nikolai Schuler sert surtout pour son examen blanc. Pour dbt : Toth pour la pratique, Weigel pour les sujets absents chez Toth et le test final.
- Budget : 8 à 10 heures par semaine, certifications et entretiens compris. Les tâches « bonus » se sautent en premier.

## À vérifier toi-même (le prompt 1 les traite, mais sois attentif)
- Durées et nombres de questions des examens, coûts, version en vigueur (surtout DEA-C01 et le programme dbt de 2026).
- Les 30 minutes supplémentaires pour les non-anglophones et la réduction de 50 % sur le prochain examen AWS : à confirmer sur les pages officielles AWS.
- Le périmètre exact du DEA (Bedrock, SageMaker, OpenSearch, QuickSight) : les cours en parlent, le guide officiel tranche.
- Ces hypothèses du planning : coefficients de temps par cours, examens blancs Udemy DEA (65 questions par test, 190 minutes avec correction), composition du plan Skill Builder DEA.
- Les décomptes d'entêtes Udemy diffèrent légèrement de mes comptes de leçons pour les cours Toth (55 sur 196 contre 56 sur 206) et Weigel (136 contre 133) : documenté dans `catalogue_formations.json` (champ meta).
