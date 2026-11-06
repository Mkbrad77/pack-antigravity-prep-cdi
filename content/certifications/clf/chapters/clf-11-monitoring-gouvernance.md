# Chapitre 11 : Surveillance, Audit et Gouvernance : CloudWatch, CloudTrail et Config

## 1. Objectifs d'apprentissage
- Différencier nettement les rôles de CloudWatch (métriques, logs, alarmes), CloudTrail (audit des appels d'API) et AWS Config (conformité des configurations).
- Savoir qui a fait quoi, quand et depuis quelle adresse IP grâce à AWS CloudTrail.
- Configurer des alertes de facturation et de santé système avec Amazon CloudWatch.
- Comprendre les recommandations proactives d'AWS Trusted Advisor.

## 2. Explication claire : quand choisir quoi
Pour réussir l'examen, vous devez distinguer le trio fondamental de supervision AWS :

1. Amazon CloudWatch : Surveillance des performances et de la santé (Performance & Health)
- Qu'est-ce que c'est : le tableau de bord opérationnel d'AWS.
- Rôle : collecte les métriques (utilisation du CPU, entrées/sorties disque, trafic réseau), centralise les journaux applicatifs (CloudWatch Logs) et déclenche des alarmes automatiques (CloudWatch Alarms).
- Cas d'usage : avertir un administrateur par email via SNS si l'utilisation CPU d'une instance EC2 dépasse 80 % pendant 5 minutes, ou arrêter automatiquement une machine sous-utilisée pour réduire les coûts.

2. AWS CloudTrail : Audit et traçabilité des actions utilisateurs (Auditing & Governance)
- Qu'est-ce que c'est : l'enregistreur de vol de votre compte AWS.
- Rôle : journalise chaque appel d'API effectué dans le compte, que l'action provienne de la console de gestion AWS, de l'AWS CLI ou d'un SDK.
- Informations enregistrées : identité de l'auteur (qui), heure exacte (quand), nom du service et de l'action appelée (quoi), et adresse IP source (d'où).
- Cas d'usage : déterminer quel utilisateur a supprimé une table DynamoDB hier à 14h30 ou quelle clé d'accès compromise a lancé des instances non autorisées.

3. AWS Config : Évaluation et conformité des ressources (Configuration & Compliance)
- Qu'est-ce que c'est : le registre d'inventaire et de conformité des configurations.
- Rôle : enregistre les changements de configuration de vos ressources au fil du temps et compare ces configurations à des règles de conformité prédéfinies.
- Cas d'usage : signaler immédiatement si un compartiment S3 a été rendu public par mégarde ou si une instance EC2 est démarrée sans groupe de sécurité conforme.

4. AWS Trusted Advisor : Conseiller virtuel d'optimisation
- Rôle : analyse en temps réel votre compte AWS et formule des recommandations concrètes selon 5 piliers : optimisation des coûts, sécurité, tolérance aux pannes, performances, et quotas de service.

## 3. Définitions des termes clés
- Métrique CloudWatch : variable temporelle surveillée (ex. CPUUtilization, NetworkIn, EstimatedCharges).
- Événement CloudTrail : enregistrement d'une action de gestion ou d'accès aux données.
- Règle AWS Config : condition de conformité vérifiée en continu (ex. vérifier que tous les volumes EBS sont chiffrés).

## 4. Exemple concret
Une alerte de facturation inhabituelle se déclenche.
1. CloudWatch Alarms notifie l'administrateur que le budget prévisionnel est dépassé.
2. L'administrateur consulte AWS CloudTrail pour identifier qui a lancé 10 instances EC2 GPU coûteuses dans la nuit.
3. Il utilise AWS Config pour visualiser l'historique de configuration de ces instances et appliquer une règle de remédiation automatique.

## 5. Comparaisons et pièges d'examen
- CloudWatch vs CloudTrail : CloudWatch surveille la performance et l'état des ressources (combien de CPU, est-ce en panne ?) ; CloudTrail surveille les actions humaines et programmatiques (qui a créé ou supprimé cette ressource ?).
- CloudTrail vs Config : CloudTrail dit QUI a modifié la ressource à quel moment ; Config dit COMMENT la ressource est configurée et si elle viole une politique d'entreprise.
- Trusted Advisor : les recommandations de base de sécurité et de quotas sont accessibles à tous les comptes, mais l'accès à l'ensemble des contrôles (notamment optimisation des coûts et tolérance aux pannes) exige le plan de support Business ou Enterprise.

## 6. Lien avec SQL, Snowflake et Databricks
Dans un pipeline de données, CloudWatch surveille la durée d'exécution de vos scripts d'ingestion Python ou de vos tâches ETL, tandis que CloudTrail conserve la trace des autorisations accordées aux rôles de service qui exécutent ces pipelines.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 169 à 176.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel service devez-vous consulter pour découvrir quel utilisateur IAM a supprimé un compartiment S3 la semaine dernière ?
   - A) AWS CloudTrail (Bonne réponse).
   - B) Amazon CloudWatch.
   - C) AWS Config.
   - D) Amazon Inspector.
2. Quel service permet de vérifier en continu si tous les volumes EBS déployés dans le compte sont bien chiffrés conformément aux règles de l'entreprise ?
   - A) AWS Config (Bonne réponse).
   - B) Amazon CloudWatch.
   - C) AWS Artifact.
   - D) AWS Shield.
