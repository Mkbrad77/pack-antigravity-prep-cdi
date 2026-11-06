# Chapitre 8 : Services de Stockage AWS : S3, EBS, EFS et Glacier

## 1. Objectifs d'apprentissage
- Comprendre le stockage objet (S3), bloc (EBS) et fichier partagé (EFS).
- Connaître les classes de stockage Amazon S3 et leurs règles de cycle de vie.
- Identifier les caractéristiques des volumes EBS et des instantanés (Snapshots).
- Maîtriser l'archivage économique avec Amazon S3 Glacier.

## 2. Explication claire : quand choisir quoi
AWS propose 3 grands types de stockage :

1. Stockage Objet : Amazon S3 (Simple Storage Service)
- Stockage de données non structurées (fichiers jusqu'à 5 To dans des buckets).
- Durabilité de 99,999999999 % (11 neufs) multi-AZ.
- Classes de stockage :
  - S3 Standard : accès fréquent, latence milliseconde.
  - S3 Standard-IA : données moins fréquentes avec accès immédiat, frais de récupération par Go.
  - S3 One Zone-IA : stockage dans une seule AZ (20 % moins cher), pour données reproductibles.
  - S3 Glacier Flexible Retrieval : archivage, récupération de quelques minutes à quelques heures.
  - S3 Glacier Deep Archive : archivage le plus économique, récupération sous 12 heures.
  - S3 Intelligent-Tiering : déplace automatiquement les objets entre accès fréquent, peu fréquent et archive selon les motifs d'accès réels, sans frais de récupération.

2. Stockage Bloc : Amazon EBS (Elastic Block Store)
- Disque virtuel haute performance connecté en réseau à une seule instance EC2 dans la même zone de disponibilité.
- Utilisé pour le volume système (boot), bases relationnelles et fichiers à fortes IOPS.
- Sauvegardes incrémentielles stockées sur S3 via les Snapshots EBS.

3. Stockage Fichier : Amazon EFS (Elastic File System)
- Système de fichiers réseau géré (NFS) montable simultanément par des centaines d'instances multi-AZ.

## 3. Définitions des termes clés
- IOPS : opérations d'entrée/sortie par seconde.
- Règle de cycle de vie S3 : politique automatisée déplaçant les objets vers des classes plus froides ou les supprimant après X jours.
- Snapshots EBS : sauvegardes ponctuelles et incrémentielles sauvegardées sur S3.

## 4. Exemple concret
Une entreprise génère 50 Go de logs par jour :
- Jours 1 à 30 : dans S3 Standard pour les analyses opérationnelles.
- Jour 31 : règle de cycle de vie vers S3 Standard-IA.
- Jour 90 : transition automatique vers S3 Glacier.
- Jour 365 : purge définitive des logs.

## 5. Comparaisons et pièges d'examen
- S3 vs EBS : S3 est un stockage objet accessible via API HTTP depuis partout ; EBS est un disque virtuel bloc utilisable uniquement par une instance EC2 dans la même AZ.
- EBS vs EFS : EBS s'attache à une seule instance EC2 (sauf multi-attach io2) ; EFS est un partage de fichiers NFS partagé par des centaines d'instances à travers plusieurs AZ.
- S3 Intelligent-Tiering : réponse idéale d'examen pour optimiser les coûts quand les motifs d'accès sont inconnus ou changeants.

## 6. Lien avec SQL, Snowflake et Databricks
Amazon S3 est le socle des Data Lakes modernes : Snowflake y lit des fichiers externes via SQL (COPY INTO), et les tables Iceberg y enregistrent leurs fichiers Parquet.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 93 à 101.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quelle classe S3 optimise automatiquement les coûts sans frais de récupération lorsque les accès sont imprévisibles ?
   - A) S3 Intelligent-Tiering (Bonne réponse).
   - B) S3 Standard-IA.
   - C) S3 One Zone-IA.
   - D) S3 Glacier Deep Archive.
2. Quel service fournit un système de fichiers NFS montable simultanément par plusieurs instances EC2 multi-AZ ?
   - A) Amazon EFS (Bonne réponse).
   - B) Amazon EBS.
   - C) Amazon S3.
   - D) AWS Storage Gateway.
