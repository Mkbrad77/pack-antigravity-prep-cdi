# Chapitre 31 : Chiffrement des Données avec AWS KMS et Clés S3 Bucket

## 1. Objectifs d'apprentissage
- Différencier les mécanismes de chiffrement côté serveur : SSE-S3, SSE-KMS, SSE-C et client (CSE).
- Comprendre le fonctionnement des Clés KMS gérées par AWS et gérées par le client (CMK).
- Activer les Bucket Keys Amazon S3 pour réduire drastiquement les coûts KMS.
- Sécuriser les pipelines de données avec chiffrement en transit (TLS 1.2+).

## 2. Explication claire : quand choisir quoi
La sécurité des données au repos et en transit est un socle essentiel du Data Lake d'entreprise :

1. Options de chiffrement au repos Amazon S3 :
- SSE-S3 :
  - Chiffrement géré par AWS avec clé AES-256 sans surcoût.
  - Option par défaut sur tous les nouveaux buckets S3.
- SSE-KMS :
  - Chiffrement géré dans AWS KMS.
  - Offre un contrôle d'accès strict par politique de clé (Key Policy), une rotation automatique annuelle et une traçabilité d'audit complète dans CloudTrail.
  - Idéal pour la conformité réglementaire (RGPD, HIPAA).
- SSE-C :
  - Le client fournit et gère sa propre clé lors de chaque appel API HTTP. AWS ne stocke jamais la clé.
- Chiffrement côté client (CSE) :
  - Les données sont chiffrées localement par l'application avant envoi sur le réseau vers S3.

2. Amazon S3 Bucket Keys :
- Problème résolu : sans Bucket Key, chaque lecture de fichier Parquet par Athena ou EMR appelle KMS, générant des millions de requêtes facturées.
- Fonctionnement : génère une clé intermédiaire éphémère au niveau du bucket pour signer les opérations répétées.
- Bénéfice : réduit jusqu'à 99 % les coûts et les appels d'API vers KMS.

## 3. Définitions des termes clés
- CMK (Customer Managed Key) : clé cryptographique créée et administrée par le client dans KMS.
- Envelope Encryption : pratique consistant à chiffrer les données avec une clé de données (Data Key), elle-même chiffrée par une clé racine (KMS Key).
- Key Policy : document de politique IAM attaché à la clé KMS contrôlant qui a le droit de l'utiliser.

## 4. Exemple concret
Politique de bucket S3 imposant le chiffrement SSE-KMS :
```json
{
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:PutObject",
  "Resource": "arn:aws:s3:::mon-lake-securise/*",
  "Condition": {
    "StringNotEquals": {
      "s3:x-amz-server-side-encryption": "aws:kms"
    }
  }
}
```

## 5. Comparaisons et pièges d'examen
- Erreur d'accès KMS : un utilisateur ayant les droits complets sur S3 mais sans droit `kms:Decrypt` sur la clé KMS associée recevra une erreur HTTP 403 Access Denied.
- Débit KMS et limitation (Throttling) : les requêtes analytiques massives peuvent saturer le quota d'API KMS sans Bucket Keys. L'activation des S3 Bucket Keys élimine ce goulot.

## 6. Lien avec SQL, Snowflake et Databricks
Snowflake et Databricks utilisent le chiffrement enveloppe avec clés gérées ou Customer-Managed Keys (Tri-Secret Secure dans Snowflake).

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 261 à 275.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Un pipeline analytique Athena lisant des millions d'objets Parquet chiffrés avec SSE-KMS génère des coûts KMS exorbitants. Quelle configuration réduit ces frais jusqu'à 99 % ?
   - A) L'activation des Amazon S3 Bucket Keys sur le compartiment (Bonne réponse).
   - B) La désactivation du versioning S3.
   - C) Le passage au chiffrement SSE-C sans clé.
   - D) L'affectation d'un LSI à la table.
2. Un ingénieur dispose de permissions S3 complètes mais ne peut pas lire des fichiers déposés dans un compartiment chiffré. Quelle autorisation IAM/KMS manque-t-il ?
   - A) L'action kms:Decrypt dans la politique de la clé KMS (Bonne réponse).
   - B) L'action s3:ListAllMyBuckets.
   - C) Le droit d'écrire dans CloudTrail.
   - D) L'autorisation de créer un VPC.
