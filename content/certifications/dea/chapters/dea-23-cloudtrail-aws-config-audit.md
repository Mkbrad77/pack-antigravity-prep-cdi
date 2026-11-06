# Chapitre 23 : Audit de Sécurité et Conformité : AWS CloudTrail et AWS Config

## 1. Objectifs d'apprentissage
- Comprendre le rôle d'AWS CloudTrail pour la traçabilité intégrale des appels d'API.
- Distinguer les événements de gestion (Management Events) et les événements de données (Data Events).
- Utiliser AWS Config pour auditer en continu les configurations des ressources de données.
- Configurer la remédiation automatique des non-conformités de sécurité.

## 2. Explication claire : quand choisir quoi
La gouvernance des plateformes de données exige de savoir qui accède aux données et si les ressources respectent les règles de sécurité fixées par l'organisation :

1. AWS CloudTrail (L'enregistreur de vol API) :
- Enregistre chaque appel d'API effectué sur le compte AWS (via console, CLI, SDK ou services internes).
- Détails enregistrés : qui (identité IAM), quand (horodatage UTC), quoi (service et action), d'où (adresse IP source).
- Deux grandes catégories d'événements :
  - Événements de gestion (Management Events) : opérations sur le plan de contrôle (ex. création d'un bucket S3, modification d'une règle de sécurité, démarrage d'un cluster EMR). Activés gratuitement par défaut pour les 90 derniers jours (Event History).
  - Événements de données (Data Events) : opérations sur le plan de données (ex. requêtes `GetObject` / `PutObject` sur S3, invocations de fonctions Lambda). Désactivés par défaut en raison du volume massif de logs généré, facturés séparément. Essentiels pour tracer qui a lu un fichier sensible dans le Data Lake.
- CloudTrail Insights : détecte automatiquement les anomalies de volume d'appels d'API (ex. pics anormaux de requêtes IAM ou de démarrages d'instances).

2. AWS Config (L'auditeur continu de configuration) :
- Enregistre l'historique complet de configuration de vos ressources AWS et compare leur état à des règles de conformité.
- Règles gérées prédéfinies utiles en Data Engineering :
  - `s3-bucket-public-read-prohibited` : vérifie qu'aucun bucket S3 n'autorise la lecture publique.
  - `s3-bucket-server-side-encryption-enabled` : vérifie que tous les buckets S3 activent le chiffrement au repos.
  - `redshift-cluster-encrypted` : vérifie que tous les clusters Redshift sont chiffrés.
- Remédiation automatique : peut exécuter un document d'automatisation AWS Systems Manager (SSM) pour corriger immédiatement une ressource non conforme (ex. bloquer l'accès public S3 dès sa détection).

## 3. Définitions des termes clés
- Sentier CloudTrail (Trail) : configuration acheminant les événements d'une ou plusieurs régions vers un compartiment S3 sécurisé et vers CloudWatch Logs.
- Règle AWS Config : condition logique évaluant la conformité d'une configuration de ressource.
- Timeline de configuration : vue chronologique de chaque modification subie par une ressource depuis sa création.

## 4. Exemple concret
Détection et correction automatique d'un compartiment de Data Lake non chiffré :
```
[Utilisateur crée s3://nouveau-datalake sans chiffrement KMS]
                        |
                        v
         [AWS Config détecte la non-conformité]
                        |
                        v
     [Document SSM Automation : Activer SSE-KMS]
                        |
                        v
       [Ressource redevient conforme en 30 sec]
```

## 5. Comparaisons et pièges d'examen
- CloudTrail vs AWS Config : CloudTrail répond à la question « QUI a fait QUOI et QUAND » ; AWS Config répond à la question « COMMENT cette ressource est-elle configurée MAINTENANT et respecte-t-elle nos règles ? ».
- Data Events S3 : pour savoir quel utilisateur a téléchargé un fichier CSV confidentiel dans un bucket S3, vous devez obligatoirement activer les Data Events dans CloudTrail (les Management Events ne tracent pas les opérations GET/PUT d'objets).

## 6. Lien avec SQL, Snowflake et Databricks
CloudTrail correspond aux tables d'audit d'accès système dans Snowflake (`ACCESS_HISTORY` et `QUERY_HISTORY`) et à l'Audit Log d'Unity Catalog dans Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 306 à 315.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Un auditeur de sécurité vous demande de fournir la preuve de l'identité de l'utilisateur qui a téléchargé un fichier financier hautement confidentiel depuis un compartiment S3 hier soir. Quel service et type de journal devez-vous consulter ?
   - A) AWS CloudTrail avec les Data Events activés pour Amazon S3 (Bonne réponse).
   - B) AWS CloudTrail avec les Management Events uniquement.
   - C) Amazon CloudWatch Billing Alarms.
   - D) AWS Trusted Advisor.
2. Quel service AWS permet d'alerter automatiquement et de remédier en continu si un ingénieur démarre un cluster Redshift sans chiffrement de stockage ?
   - A) AWS Config avec une règle de conformité et une remédiation automatisée (Bonne réponse).
   - B) AWS Secrets Manager.
   - C) AWS Glue DataBrew.
   - D) Amazon Athena.
