# Fiche Mémo 6.3 : Observabilité : Logs structurés, Métriques et Alertes

## 1. Les trois piliers de l'observabilité appliqués à la Data
1. **Logs structurés en JSON :**
   Bannir les simples `print("Job terminé")`. Utiliser un formateur JSON qui inclut systématiquement des métadonnées contextuelles :
   ```json
   {"timestamp": "2026-10-31T18:00:00Z", "level": "INFO", "pipeline": "commandes", "execution_id": "job-842", "duration_sec": 42.5, "rows_processed": 1050000}
   ```
   Permet l'indexation et la recherche instantanée dans Datadog, CloudWatch ou Grafana Loki.
2. **Métriques d'ingénierie de données (SLI / SLO) :**
   - *Fraîcheur des données (Data Freshness) :* Heure courante moins le timestamp de la dernière ligne ingérée.
   - *Taux de conformité qualité :* Nombre de lignes rejetées en quarantaine / Total.
3. **Alerting intelligent :**
   Éviter la fatigue d'alerte (Alert Fatigue). Ne pager l'astreinte que si un SLA métier est en péril immédiat, et regrouper les avertissements dans un canal d'information secondaire.
