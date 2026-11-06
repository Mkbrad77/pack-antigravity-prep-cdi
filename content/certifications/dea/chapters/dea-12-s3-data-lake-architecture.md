# Chapitre 12 : Architecture Data Lake Moderne sur Amazon S3 et Cycle de Vie

## 1. Objectifs d'apprentissage
- Concevoir une architecture Data Lake à 3 couches (Raw, Cleaned, Curated) sur Amazon S3.
- Maîtriser les classes de stockage S3 et leurs politiques d'optimisation financière.
- Comprendre la réplication multi-régions (CRR) et les mécanismes de versioning.
- Optimiser les performances de requêtage S3 (préfixes aléatoires, parallélisme).

## 2. Explication claire : quand choisir quoi
Amazon S3 est le fondement incontournable du stockage objet dans le Cloud AWS, offrant une durabilité native de 99,999999999 % (11 neufs) :

Architecture multi-couches recommandée (Architecture Médaillon) :
1. Couche Brute (Raw / Bronze) :
   - Reçoit les données sources telles quelles (fichiers JSON, CSV, logs, flux Kinesis).
   - Données immuables, jamais écrasées, servant de source de vérité pour les retraitements historiques.
2. Couche Nettoyée (Cleaned / Silver) :
   - Données filtrées, dédupliquées, schématisées et converties en formats colonnaires (Apache Parquet).
   - Utilisée pour l'exploration analytique et les jointures inter-domaines.
3. Couche Métier (Curated / Gold) :
   - Tables agrégées et modélisées (schémas en étoile ou tables larges dénormalisées).
   - Destinée aux rapports décisionnels, tableaux de bord QuickSight et algorithmes de Machine Learning.

Optimisation du stockage par cycle de vie :
- S3 Standard : pour les couches Silver et Gold actives et les données de moins de 30 jours.
- S3 Standard-IA : pour les données brutes consultées occasionnellement après 30 jours.
- S3 Glacier Flexible Retrieval / Deep Archive : pour l'archivage légal ou fiscal à long terme (1 à 10 ans) avec des coûts dérisoires mais des délais de récupération de plusieurs minutes à 12 heures.
- S3 Intelligent-Tiering : obligatoire pour les jeux de données aux motifs d'accès inconnus ou changeants, sans risque de frais de récupération.

## 3. Définitions des termes clés
- S3 Versioning : conservation de plusieurs versions d'un même objet pour se prémunir contre les suppressions et écrasements accidentels.
- CRR (Cross-Region Replication) : réplication asynchrone automatique d'objets vers un bucket situé dans une autre région AWS pour la reprise après sinistre.
- S3 Object Lock : conformité WORM (Write Once, Read Many) empêchant toute suppression ou écrasement d'objet pendant une durée définie.

## 4. Exemple concret
Règle de cycle de vie S3 typique pour un Data Lake :
```
[Objet créé dans s3://data-lake-raw/]
       |
       |-- (Après 30 jours) --> Bascule automatique vers S3 Standard-IA
       |
       |-- (Après 90 jours) --> Transition vers S3 Glacier Flexible Retrieval
       |
       |-- (Après 365 jours) -> Transition vers S3 Glacier Deep Archive
       |
       |-- (Après 2555 jours / 7 ans) -> Suppression définitive de l'objet
```

## 5. Comparaisons et pièges d'examen
- S3 Versioning et CRR : pour activer la réplication multi-régions (CRR), le versioning DOIT obligatoirement être activé sur le bucket source ET sur le bucket cible.
- Frais de transition et de taille minimale : les classes S3 Glacier et Standard-IA imposent une durée minimale de rétention facturée (90 jours pour Glacier, 180 jours pour Deep Archive) et une taille minimale d'objet facturée (128 Ko). Ne jamais transitionner de très petits fichiers (< 128 Ko) fréquemment modifiés vers Glacier.
- Performance S3 : pour dépasser les quotas de débit par préfixe (3 500 requêtes PUT/POST/DELETE/s et 5 500 requêtes GET/s), il faut répartir les écritures sur plusieurs préfixes distincts.

## 6. Lien avec SQL, Snowflake et Databricks
Cette architecture sur S3 est directement transposable aux architectures Médaillon (Bronze, Silver, Gold) promues par Databricks et aux External Stages configurés dans Snowflake avec Storage Integrations sécurisées.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 25 à 53.
- Voir aussi : cours Nikolai Schuler, leçons 56 à 71.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quelle configuration est techniquement requise sur les compartiments Amazon S3 source et cible pour activer la réplication entre régions (CRR) ?
   - A) Le versioning doit être activé sur les deux compartiments (Bonne réponse).
   - B) Le chiffrement SSE-C doit être utilisé.
   - C) Les compartiments doivent porter exactement le même nom.
   - D) S3 Transfer Acceleration doit être configuré.
2. Une entreprise stocke des millions de petits fichiers JSON de 10 Ko sur S3 et souhaite réduire ses coûts d'archivage. Pourquoi est-il déconseillé de créer une règle de cycle de vie vers S3 Glacier pour ces fichiers ?
   - A) Chaque objet sera facturé pour une taille minimale de 128 Ko avec des frais de métadonnées supplémentaires (Bonne réponse).
   - B) Glacier refuse techniquement les fichiers inférieurs à 1 Mo.
   - C) Le format JSON ne peut pas être lu depuis Glacier.
   - D) Les fichiers de moins de 128 Ko sont automatiquement supprimés lors du transfert.
