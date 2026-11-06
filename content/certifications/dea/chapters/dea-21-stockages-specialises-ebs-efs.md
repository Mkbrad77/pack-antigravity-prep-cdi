# Chapitre 21 : Stockages Spécialisés et Sauvegarde : EBS, EFS et AWS Backup

## 1. Objectifs d'apprentissage
- Comprendre les caractéristiques d'Amazon EBS (stockage bloc pour EC2 et EMR).
- Connaître les volumes EBS ssd (gp3, io2 Block Express) et hdd (st1, sc1) et leurs métriques d'IOPS.
- Utiliser Amazon EFS comme système de fichiers partagé multi-instances POSIX.
- Centraliser la gouvernance des sauvegardes avec AWS Backup.

## 2. Explication claire : quand choisir quoi
Dans les architectures de données, le calcul temporaire ou distribué nécessite des stockages haute performance attachés localement :

1. Amazon EBS (Elastic Block Store) :
- Volumes connectés en réseau à une seule instance EC2 (dans la même AZ).
- Types de volumes :
  - gp3 (General Purpose SSD) : standard polyvalent, permet de dimensionner indépendamment les IOPS (jusqu'à 16 000) et le débit (jusqu'à 1 000 Mo/s) sans devoir augmenter la taille du disque. Idéal pour les nœuds de calcul EMR et les petites bases.
  - io2 / io2 Block Express : SSD ultra-haute performance pour bases de données critiques exigeant jusqu'à 256 000 IOPS et une durabilité de 99,999 %.
  - st1 (Throughput Optimized HDD) : disque dur magnétique économique optimisé pour les charges séquentielles lourdes (Big Data, EMR, logs volumineux). Ne peut pas servir de volume de démarrage (boot volume).
  - sc1 (Cold HDD) : stockage le plus économique pour les données rarement accédées.

2. Amazon EFS (Elastic File System) :
- Système de fichiers réseau géré compatible POSIX (protocole NFSv4) montable simultanément par des centaines d'instances EC2 ou conteneurs ECS/EKS à travers plusieurs zones de disponibilité.
- Évolue automatiquement en taille sans pré-provisionnement.
- Idéal pour partager des répertoires de données, des scripts communs ou des modèles d'apprentissage machine entre plusieurs workers distribués.

3. AWS Backup :
- Service centralisé et basé sur des politiques pour automatiser et gérer la sauvegarde de l'ensemble des données d'entreprise across AWS (EBS, EFS, RDS, DynamoDB, S3, Aurora, Redshift).
- Fonctionnalités clés :
  - Politiques de sauvegarde avec planification automatique (Backup Plans).
  - Transition automatique des sauvegardes vers le stockage à froid.
  - Sauvegardes immuables grâce à AWS Backup Vault Lock (protection contre les ransomwares et suppressions malveillantes).
  - Copies automatiques multi-comptes et multi-régions pour la reprise après sinistre.

## 3. Définitions des termes clés
- IOPS (Input/Output Operations Per Second) : nombre d'opérations d'écriture ou lecture de blocs par seconde.
- Bursting Throughput : capacité temporaire d'un volume à dépasser son débit de base pendant les pics de charge.
- Vault Lock : politique empêchant toute modification ou suppression anticipée des sauvegardes stockées dans le coffre AWS Backup.

## 4. Exemple concret
Architecture de traitement distribué partageant un stockage EFS :
```
[Workers EC2 / EKS dans AZ-1a] --\
[Workers EC2 / EKS dans AZ-1b] ---> [Montage NFS : Amazon EFS partagé (Multi-AZ)]
[Workers EC2 / EKS dans AZ-1c] --/           |
                                     (Sauvegarde quotidienne)
                                             v
                                  [AWS Backup Vault Lock]
```

## 5. Comparaisons et pièges d'examen
- EBS vs EFS : EBS est un volume bloc local à une seule AZ (sauf option io2 multi-attach limitée) ; EFS est un système de fichiers partagé élastique multi-AZ nativement concurrent.
- st1 vs gp3 pour EMR : pour les nœuds Core de clusters EMR traitant des flux séquentiels HDFS massifs, les volumes st1 offrent le meilleur coût par téraoctet par rapport aux SSD gp3.
- Snapshots EBS : les instantanés EBS sont incrémentiels et stockés de façon durable et chiffrée sur Amazon S3 en arrière-plan.

## 6. Lien avec SQL, Snowflake et Databricks
La gestion centralisée des politiques de sauvegarde avec AWS Backup correspond aux mécanismes de rétention Time Travel et Fail-safe dans Snowflake et aux politiques de sauvegarde des métastores dans Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 54 à 61.
- Voir aussi : cours Nikolai Schuler, leçons 74 à 79.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quel type de volume Amazon EBS offre le coût le plus faible pour les nœuds de travail d'un cluster Big Data exécutant des analyses séquentielles lourdes de gros volumes de données ?
   - A) Throughput Optimized HDD (st1) (Bonne réponse).
   - B) Provisioned IOPS SSD (io2).
   - C) General Purpose SSD (gp2).
   - D) Cold HDD (sc1) comme volume de boot.
2. Une entreprise doit garantir que ses sauvegardes de bases de données ne puissent être supprimées par aucun utilisateur, y compris par le compte administrateur racine (root), pour se prémunir contre les attaques de ransomware. Quel service configurez-vous ?
   - A) AWS Backup avec une politique de verrouillage Vault Lock en mode Compliance (Bonne réponse).
   - B) Un script de copie manuel vers un bucket S3 public.
   - C) Le renommage des volumes EBS.
   - D) L'activation d'Amazon Inspector.
