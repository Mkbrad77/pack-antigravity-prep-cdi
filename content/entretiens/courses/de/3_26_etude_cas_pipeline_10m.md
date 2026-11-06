# Chapitre 3.26 : Étude de cas : Pipeline de 10 millions de lignes/jour

## 1. Énoncé de l'exercice d'architecture en entretien
« Vous devez concevoir de zéro l'architecture data pour une application de covoiturage qui génère 10 millions d'événements de géolocalisation et de réservation par jour. Présentez votre schéma d'ingestion, stockage, transformation et restitution. »

## 2. Démarche attendue par le jury (Méthode en 5 étapes)
1. **Clarification des volumétries et contraintes :**
   - 10 millions d'événements/jour = ~115 événements/sec en moyenne, pics à 1 000/sec.
   - Poids moyen d'un événement JSON : 1 Ko -> ~10 Go bruts par jour.
   - Fraîcheur requise : Suivi des courses en quasi temps réel (< 2 min), reporting analytique quotidien à J+1.
2. **Couche Ingestion (Streaming Buffer) :**
   - Amazon Kinesis Data Streams (ou Apache Kafka / MSK). 4 shards suffisent largement (1 shard = 1 Mo/s en entrée).
   - Tamponnement automatique vers Amazon S3 via Kinesis Firehose au format Parquet avec fenêtrage de 60 secondes.
3. **Couche Stockage (Medallion Lakehouse) :**
   - **Bronze (S3) :** Données brutes immuables en Parquet partitionnées par `year=YYYY/month=MM/day=DD`.
   - **Silver (Snowflake ou Iceberg S3) :** Données nettoyées, dédupliquées, schéma validé.
   - **Gold :** Métriques d'affaires (chiffre d'affaires par zone, taux d'occupation des chauffeurs).
4. **Couche Transformation :**
   - Pipeline de transformation avec dbt pour la modélisation dimensionnelle (tables de faits `fct_courses` et dimensions `dim_chauffeurs`, `dim_utilisateurs`).
5. **Monitoring et Gouvernance :**
   - Alertes de volumétrie, tests dbt automatiques, et tableau de bord de performance Snowflake.

## 3. Points clés qui font la différence en entretien
- Calculer explicitement les ordres de grandeur de volume et de coût devant l'interviewer.
- Proposer une politique de cycle de vie S3 (transition vers S3 Standard-IA à 30 jours, Glacier à 90 jours).
