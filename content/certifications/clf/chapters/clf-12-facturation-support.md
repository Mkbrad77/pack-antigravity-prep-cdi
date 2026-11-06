# Chapitre 12 : Facturation, Gestion des Coûts et Plans de Support AWS

## 1. Objectifs d'apprentissage
- Maîtriser les outils de coûts : Pricing Calculator, Cost Explorer, Budgets et Cost & Usage Report (CUR).
- Connaître les 4 plans de support (Basic, Developer, Business, Enterprise).
- Comprendre la facturation consolidée avec AWS Organizations.
- Identifier les avantages exclusifs Enterprise (TAM, réponse sous 15 min).

## 2. Explication claire : quand choisir quoi
Outils de gestion des coûts :
- AWS Pricing Calculator : estimation du coût d'une architecture avant déploiement.
- AWS Cost Explorer : visualisation et prévision des dépenses passées et futures (jusqu'à 12 mois).
- AWS Budgets : définition de seuils d'alerte budgétaire avec notifications email ou SNS.
- Cost and Usage Report (CUR) : fichier de facturation le plus détaillé, livré sur S3 en CSV ou Parquet.
- Facturation consolidée : regroupement de plusieurs comptes sous un compte payeur unique avec remises sur volume.

Les 4 niveaux de support AWS :
1. Support Basic :
   - Inclus gratuitement pour tous les comptes.
   - Support client 24/7 pour compte et facturation.
   - 7 contrôles de base dans Trusted Advisor. Pas d'ingénieurs techniques.
2. Support Developer :
   - Pour prototypage et tests.
   - Support technique par email en heures ouvrées (< 12h pour incident général).
3. Support Business :
   - Pour environnements de production.
   - Support 24/7 téléphone, chat et email avec ingénieurs Cloud Support.
   - Réponse < 1h pour production en panne. Accès complet à Trusted Advisor.
4. Support Enterprise :
   - Pour charges critiques d'entreprise.
   - Technical Account Manager (TAM) dédié et Infrastructure Event Management (IEM).
   - Réponse garantie < 15 min pour système critique arrêté (business-critical down).

## 3. Définitions des termes clés
- TAM (Technical Account Manager) : référent technique AWS dédié aux clients Enterprise.
- IEM (Infrastructure Event Management) : accompagnement d'experts AWS pour sécuriser les grands événements de charge.
- Balises de coûts (Cost Allocation Tags) : métadonnées clés-valeurs ventilant les dépenses par projet.

## 4. Exemple concret
Une entreprise déployant un site e-commerce critique souscrit au support Business pour avoir une assistance 24/7 par chat et téléphone avec garantie de réponse sous 1 heure en cas d'incident.

## 5. Comparaisons et pièges d'examen
- Pricing Calculator vs Cost Explorer : Pricing Calculator s'utilise avant le projet ; Cost Explorer s'utilise pendant et après avec les dépenses réelles.
- Cost Explorer vs Budgets : Cost Explorer sert à analyser des graphiques ; Budgets déclenche des alertes lors du franchissement de seuils.
- Plan Business vs Enterprise : Business offre 1h pour panne de production ; seul Enterprise offre 15 min pour panne critique avec TAM dédié.

## 6. Lien avec SQL, Snowflake et Databricks
Le rapport de coûts CUR déposé sur S3 peut être chargé et interrogé via SQL dans Snowflake pour analyser le coût précis des entrepôts de données.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 177 à 188.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel outil gratuit permet d'estimer le coût mensuel d'une infrastructure avant de créer les ressources ?
   - A) AWS Pricing Calculator (Bonne réponse).
   - B) AWS Cost Explorer.
   - C) AWS Budgets.
   - D) AWS Trusted Advisor.
2. Quel plan de support comprend un Technical Account Manager (TAM) dédié et un délai de réponse sous 15 minutes pour panne critique ?
   - A) Plan Enterprise (Bonne réponse).
   - B) Plan Business.
   - C) Plan Developer.
   - D) Plan Basic.
