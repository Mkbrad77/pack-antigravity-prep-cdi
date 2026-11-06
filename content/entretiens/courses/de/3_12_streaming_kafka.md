# Chapitre 3.12 : Streaming Kafka : Sémantiques de livraison & Offsets

## 1. La question classique posée en entretien
« Quelle est la différence entre les sémantiques At-Most-Once, At-Least-Once et Exactly-Once dans Apache Kafka ? Comment garantit-on l'idempotence de bout en bout ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre compréhension du mécanisme de commit d'offset (`enable.auto.commit` vs commit synchrone/asynchrone manuel).
- Votre capacité à expliquer que l'Exactly-Once (EOS) de Kafka s'applique au sein du périmètre Kafka (Read-Process-Write), mais qu'avec un stockage externe (base de données), c'est la cible qui doit être idempotente (Upsert / Déduplication par clé).

## 3. Réponse d'ingénieur senior

### A. Les 3 garanties de livraison
1. **At-Most-Once :** Le consumer valide l'offset *avant* d'avoir fini de traiter le message. Si le worker plante, le message est perdu. Toléré uniquement pour de la télémétrie non critique.
2. **At-Least-Once (Standard de l'industrie) :** Le consumer traite le message puis commite l'offset. Si le worker plante avant le commit, le message sera retraité à la reprise. Risque de doublons.
3. **Exactly-Once Processing (EOS) :** Repose sur l'idempotence du producteur (`enable.idempotence=true`, séquence de messages + PID) et l'API transactionnelle Kafka coordonnée par le Transaction Coordinator.

### B. Idempotence vers le stockage externe
Pour obtenir une garantie finale Exactly-Once lors de l'écriture dans Snowflake, Postgres ou S3 :
- Utiliser un mécanisme de **Déduplication par clé naturelle** (ex. `MERGE INTO` avec ID transactionnel unique).
- Ou utiliser un stockage transactionnel supportant les commits atomiques (ex. format Delta / Iceberg avec commit de snapshot).

## 4. Erreurs fatales à éviter absolument
- Prétendre que l'Exactly-Once de Kafka résout magiquement les doublons dans une table PostgreSQL sans contrainte d'unicité ni clause ON CONFLICT.
- Sous-dimensionner le nombre de partitions Kafka par rapport au nombre d'instances de consommateurs prévues.
