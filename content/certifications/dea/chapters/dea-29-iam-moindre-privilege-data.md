# Chapitre 29 : Gestion des Accès et Moindre Privilège : Politiques et Rôles IAM

## 1. Objectifs d'apprentissage
- Comprendre la distinction entre politiques basées sur l'identité (IAM) et politiques basées sur les ressources.
- Configurer les rôles de service IAM pour AWS Glue, Lambda, EMR et Amazon Redshift.
- Appliquer rigoureusement le principe du moindre privilège aux pipelines de données.
- Gérer les accès inter-comptes avec la politique d'approbation (Trust Policy).

## 2. Explication claire : quand choisir quoi
AWS Identity and Access Management (IAM) est le système central de contrôle des accès aux ressources AWS. Dans les architectures Data, la majorité des accès sont effectués par des services et des applications plutôt que par des utilisateurs humains :

1. Politiques d'identité vs Politiques de ressources :
- Politiques basées sur l'identité (Identity-based policies) :
  - Attachées directement à un utilisateur, un groupe ou un rôle IAM.
  - Définissent les actions que cette entité peut exécuter (ex. autoriser le rôle Glue `MonRoleETL` à lire sur un bucket S3).
- Politiques basées sur les ressources (Resource-based policies) :
  - Attachées directement à la ressource protégée (ex. S3 Bucket Policy, clé KMS Key Policy, file d'attente SQS Policy).
  - Définissent QUI a le droit d'accéder à CETTE ressource spécifique, y compris des comptes AWS tiers (accès cross-account).
  - Règle d'or : pour qu'un accès inter-comptes fonctionne, l'action doit être explicitement autorisée dans la politique d'identité du compte appelant ET dans la politique de ressource du compte cible.

2. Rôles de service IAM pour les pipelines :
- Ne JAMAIS coder de clés d'accès IAM statiques (`AWS_ACCESS_KEY_ID` et `AWS_SECRET_ACCESS_KEY`) dans le code source d'un script PySpark ou d'une fonction Lambda.
- Utiliser systématiquement un rôle IAM avec une relation d'approbation (Trust Policy) permettant au service d'assumer ce rôle (`sts:AssumeRole`) :
  - Pour AWS Glue : le principal dans la relation d'approbation doit être `glue.amazonaws.com`.
  - Pour AWS Lambda : le principal doit être `lambda.amazonaws.com`.
  - Pour Amazon Redshift : le principal doit être `redshift.amazonaws.com`.

3. Principe du moindre privilège :
- Restreindre les permissions aux seules actions strictement indispensables (ex. `s3:GetObject` et `s3:PutObject` sur un préfixe donné, sans autoriser `s3:*` ni `s3:DeleteObject`).
- Éviter d'attacher la politique gérée globale `AdministratorAccess` ou `PowerUserAccess` à des rôles de production.

## 3. Définitions des termes clés
- Trust Policy (Politique d'approbation) : document JSON définissant quelles entités ou quels services AWS ont le droit d'assumer le rôle IAM.
- Permission Boundary (Limite de permissions) : mécanisme avancé définissant le plafond maximal de permissions qu'un rôle ou utilisateur peut recevoir.
- Least Privilege (Moindre privilège) : principe de sécurité n'octroyant que le strict minimum de droits nécessaires à l'accomplissement d'une tâche.

## 4. Exemple concret
Politique de confiance (Trust Policy) autorisant le service AWS Glue à assumer un rôle :
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "glue.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

## 5. Comparaisons et pièges d'examen
- Évaluation des politiques IAM : un refus explicite (`Deny`) l'emporte TOUJOURS sur toutes les autorisations (`Allow`). S'il n'y a ni Deny explicite ni Allow explicite, la requête est refusée par défaut (refus implicite).
- Politiques de clés KMS : même avec les droits administrateur complets (`AdministratorAccess`), un utilisateur ne peut pas déchiffrer un objet S3 si la clé KMS protégeant cet objet n'autorise pas explicitement l'utilisateur dans sa politique de clé (KMS Key Policy).

## 6. Lien avec SQL, Snowflake et Databricks
Ce principe de moindre privilège correspond au contrôle d'accès basé sur les rôles (RBAC) dans Snowflake et aux privilèges accordés aux Service Principals sur les catalogues dans Databricks Unity Catalog.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 356 à 365.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Quelle est la méthode sécurisée recommandée par AWS pour permettre à un job AWS Glue d'accéder aux données d'un compartiment Amazon S3 sans jamais stocker d'identifiants statiques dans le code ?
   - A) Assigner au job Glue un rôle IAM doté d'une politique de confiance autorisant le service glue.amazonaws.com (Bonne réponse).
   - B) Écrire la clé d'accès et le secret dans le script Python en dur.
   - C) Rendre le compartiment S3 public en lecture et écriture.
   - D) Désactiver l'authentification IAM sur le compte.
2. Si une politique de groupe IAM accorde `Allow` sur l'action `s3:GetObject` mais qu'une politique de bucket S3 spécifie `Deny` sur la même action pour cet utilisateur, que se passe-t-il lors de la requête ?
   - A) L'accès est refusé car un refus explicite (Deny) a toujours la priorité absolue (Bonne réponse).
   - B) L'accès est accordé car la politique IAM prime sur la politique de ressource.
   - C) Le fichier est téléchargé mais chiffré avec une clé aléatoire.
   - D) L'utilisateur est automatiquement déconnecté du compte AWS.
