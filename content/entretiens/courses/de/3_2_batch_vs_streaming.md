# Chapitre 3.2 : Batch vs Streaming : Quand passer au temps réel ?

## 1. La question classique posée en entretien
« Notre métier nous demande un tableau de bord en temps réel. Comment challengez-vous cette demande et quelle architecture proposez-vous ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre capacité à questionner le besoin métier réel (le métier a-t-il vraiment besoin d'une réaction à la seconde, ou d'une fraîcheur de 15 minutes ?).
- Votre maîtrise des coûts : le streaming continu nécessite une infrastructure active 24h/24, une gestion complexe des états (stateful processing) et une tolérance aux pannes accrue.
- Votre connaissance du compromis « Micro-batch » (ex. Spark Streaming à micro-batch de 1 minute ou dbt toutes les heures).

## 3. Réponse d'ingénieur senior

### A. Grille d'évaluation du besoin métier
1. **Temps réel opérationnel (< 1 seconde) :** Détection de fraude bancaire, alertes machines industrielles, recommandation temps réel en session e-commerce. Nécessite Apache Flink, Kafka Streams ou AWS Kinesis + Lambda.
2. **Quasi temps réel (1 à 15 minutes) :** Suivi logistique, monitoring de stocks. Le micro-batching Spark ou Snowpipe Streaming suffit largement.
3. **Analytique périodique (1h à 24h) :** Reporting de clôture financière, analyses de cohortes marketing. Le batch classique (Airflow + dbt) est le standard le plus robuste et économique.

### B. Comparatif architectural
- **Complexité algorithmique :** En streaming, la gestion des fenêtres temporelles (tumbling, sliding, session) et des données désynchronisées (late data) requiert des watermarks explicites.
- **Coût d'infrastructure :** En batch, les clusters de calcul s'allument à la demande et s'éteignent après exécution. En streaming, le cluster tourne en continu avec des garanties de reprise sur incident (checkpoints, state backends RocksDB).

## 4. Erreurs fatales à éviter absolument
- Valider du streaming pur pour un tableau de bord consulté une fois par matinée par les directeurs généraux.
- Négliger le surcoût de monitoring et d'astreinte 24/7 induit par un pipeline temps réel critique.
