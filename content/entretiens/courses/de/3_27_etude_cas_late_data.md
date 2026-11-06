# Chapitre 3.27 : Étude de cas : Gestion des événements en retard (Late Data)

## 1. La question classique posée en entretien
« Des terminaux mobiles envoient des événements de paiement avec du retard (tunnels sans réseau, appareils déconnectés pendant plusieurs heures). Comment calculez-vous un chiffre d'affaires horaire exact sans attendre indéfiniment les retardataires ? »

## 2. Ce que l'interviewer évalue vraiment
- La distinction cruciale entre **Event Time** (l'instant où l'action s'est produite) et **Processing Time** (l'instant où votre système reçoit l'événement).
- Le concept de **Watermark** en streaming (seuil de tolérance au retard).
- La stratégie de conciliation finale (deux couches : vue temps réel approximée + consolidation batch exacte).

## 3. Réponse d'ingénieur senior

### A. Le mécanisme de Watermark
Un watermark indique au moteur de streaming (Spark Structured Streaming ou Flink) que l'on considère comme close toute fenêtre temporelle antérieure à `max(event_time) - retard_max_toléré` (par exemple 30 minutes).
- Les événements arrivant dans la fenêtre de tolérance mettent à jour les agrégats de la fenêtre.
- Les événements arrivant *après* le watermark sont rejetés par la fenêtre temps réel et redirigés vers une table de réconciliation (Side Output).

### B. Architecture Kappa revisitée avec réconciliation
```text
Événement -> Kafka -> Spark Streaming (Watermark 30 min)
                          |--> Temps réel -> Table opérationnelle (Dashboards Live)
                          |--> Late Data (>30 min) -> Table des rejets S3
                                                        |
                                                        v
                                          dbt nightly batch (recalcul de la journée)
```
Le job batch nocturne relit l'ensemble des données de la veille (y compris les événements tardifs récupérés) et met à jour de façon idempotente la table financière définitive.

## 4. Erreurs fatales à éviter absolument
- Agréger les données en se basant sur le Processing Time, ce qui fausserait complètement l'analyse des ventes par tranche horaire.
- Fixer un watermark de plusieurs jours en streaming continu, ce qui provoquerait une explosion de l'état en mémoire (State Store OOM).
