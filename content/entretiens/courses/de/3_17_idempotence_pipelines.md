# Chapitre 3.17 : Idempotence absolue des pipelines de données

## 1. La question classique posée en entretien
« Qu'est-ce qu'un pipeline de données idempotent ? Pourquoi est-ce le critère numéro 1 de qualité logicielle en Data Engineering ? »

## 2. Ce que l'interviewer évalue vraiment
- La définition mathématique appliquée à la data : `f(f(x)) = f(x)`. Exécuter un pipeline 10 fois pour le jour J doit produire exactement le même résultat qu'une seule exécution, sans doublons ni corruption.
- Votre maîtrise du backfilling (rattrapage d'historique) en toute sérénité.
- Vos techniques concrètes : tables partitionnées avec écrasement atomique (`INSERT OVERWRITE`), jointures sur snapshot immuable, et transactions dbt.

## 3. Réponse d'ingénieur senior

### A. Les anti-patterns non idempotents
- Les simples commandes `INSERT INTO table SELECT ...` : chaque ré-exécution rajoute des doublons.
- Les requêtes basées sur l'heure système actuelle (`CURRENT_TIMESTAMP` ou `NOW()`) plutôt que sur la date logique de traitement fournie par l'orchestrateur (`{{ ds }}` dans Airflow).
- L'effacement non transactionnel : un `DELETE FROM table WHERE date = '2026-10-31'` suivi d'un crash laisse la table vide pour la journée.

### B. Les 3 patrons d'architecture idempotents
1. **Insert Overwrite atomique par partition :**
   ```sql
   INSERT OVERWRITE TABLE marts_commandes
   PARTITION (date_commande = '2026-10-31')
   SELECT ... FROM staging_commandes WHERE date_commande = '2026-10-31';
   ```
2. **Stratégie Merge (Upsert) basée sur clé primaire métier :**
   ```sql
   MERGE INTO mart_clients AS target
   USING staged_clients AS source
   ON target.client_id = source.client_id
   WHEN MATCHED THEN UPDATE SET ...
   WHEN NOT MATCHED THEN INSERT ...;
   ```
3. **Tableau immuable avec déduplication en lecture :**
   Les événements bruts sont écrits en append-only avec un identifiant unique (UUID). La couche Silver applique une fenêtre analytique (`ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY received_at DESC)`) filtrée sur 1.

## 4. Erreurs fatales à éviter absolument
- Utiliser la date du jour système pour découper les données lors d'un rattrapage d'historique (backfill).
- Ne pas tester la ré-exécution d'un DAG de pipeline en environnement de pré-production.
