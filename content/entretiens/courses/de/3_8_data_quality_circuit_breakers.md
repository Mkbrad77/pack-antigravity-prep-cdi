# Chapitre 3.8 : Data Quality : Détection d'anomalies & Circuit Breakers

## 1. La question classique posée en entretien
« Comment empêchez-vous des données corrompues ou incomplètes d'atteindre les tableaux de bord de vos décideurs métier sans pour autant bloquer tout le pipeline de l'entreprise ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre mise en place du concept de **Circuit Breaker** (coupe-circuit) dans les architectures modernes.
- La différenciation entre erreurs bloquantes (tests d'intégrité référentielle, clé primaire nulle) et alertes statistiques (dérive de distribution, volume inhabituel).
- Votre maîtrise des outils de test (dbt test, Great Expectations, AWS Glue Data Quality).

## 3. Réponse d'ingénieur senior

### A. La stratégie des trois barrières de test
1. **En amont (Ingestion / Staging) :** Tests de schéma stricts (types de données, absence de nulls sur les identifiants clés). Si un test échoue, la ligne est déroutée vers une table de quarantaine (Dead Letter Table) et le pipeline continue.
2. **Au niveau de l'orchestration (Coupe-circuit) :** Dans dbt, utilisation de la sévérité :
   - `severity: error` : stoppe net l'exécution des modèles aval dépendants.
   - `severity: warn` : envoie une notification Slack/Teams mais permet la livraison des agrégats.
3. **En aval (Couche Marts / Exposition) :** Vérification de la volumétrie relative (ex. le nombre de commandes du jour ne doit pas varier de plus de 30 % par rapport à la moyenne des 7 derniers jours).

### B. Exemple d'architecture avec table de quarantaine
```text
Source S3 -> Glue Job (validation schéma)
               |--> Valide -> Table Silver -> dbt Transform -> Table Gold
               |--> Invalide -> Table Quarantaine (Dead Letter) -> Alerte PagerDuty
```

## 4. Erreurs fatales à éviter absolument
- Bloquer entièrement le pipeline quotidien pour 3 lignes orphelines non critiques sur 10 millions.
- Ne pas historiser les erreurs de qualité de données, ce qui empêche d'identifier les causes racines chez les fournisseurs de données.
