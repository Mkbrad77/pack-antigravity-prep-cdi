# Chapitre 16 : Clés de Tri, Encodage et Optimisation des Performances Redshift

## 1. Objectifs d'apprentissage
- Différencier les clés de tri composées (Compound Sort Keys) et entrelacées (Interleaved Sort Keys).
- Maîtriser les encodages de compression de colonnes (AZ64, ZSTD).
- Utiliser les commandes VACUUM et ANALYZE pour préserver les performances.
- Comprendre la gestion de charge WLM (Workload Management) et la concurrence automatique.

## 2. Explication claire : quand choisir quoi
Les clés de tri fixent l'ordre physique des données dans les blocs de 1 Mo de Redshift, permettant de sauter des millions de lignes inutiles :

1. Clés de tri (SORTKEY) :
- Clé de tri composée (Compound Sort Key) :
  - Trie selon l'ordre strict de déclaration (colonne 1, puis 2).
  - Idéal lorsque les filtres utilisent systématiquement le préfixe des colonnes (ex. `WHERE date_vente >= '2026-01-01'`).
  - Option par défaut la plus rapide au chargement.
- Clé de tri entrelacée (Interleaved Sort Key) :
  - Donne un poids égal à chaque colonne triée.
  - Idéal si les requêtes filtrent sur différentes combinaisons de colonnes arbitraires sans ordre fixe (ex. filtre parfois sur pays, parfois sur catégorie).
  - Attention : réindexation très coûteuse lors du VACUUM.

2. Encodages de compression colonnaire :
- AZ64 : algorithme propriétaire AWS hautement performant, offrant une excellente compression et une vitesse de décompression record pour les entiers, décimaux et dates.
- ZSTD : fort taux de compression pour les chaînes de caractères et types variés.
- Analyser les encodages optimaux : la commande `ANALYZE COMPRESSION nom_table` suggère les meilleurs encodages.

3. Maintenance : VACUUM et ANALYZE :
- VACUUM : réorganise les données pour restaurer l'ordre de tri physique et libère l'espace des lignes supprimées.
- ANALYZE : met à jour les statistiques de distribution utilisées par l'optimiseur de requêtes.

4. WLM (Workload Management) :
- Isole les charges dans des files d'attente distinctes (ex. file dédiée aux rapports de direction prioritaires et file pour les batchs ETL lourds).
- Concurrency Scaling : ajoute automatiquement de la capacité de calcul sans serveur lors des pics de charge de requêtes en lecture.

## 3. Définitions des termes clés
- Zone Maps : métadonnées en mémoire stockant les valeurs min et max de chaque bloc de 1 Mo pour ignorer les blocs hors périmètre.
- Ghost Rows : lignes marquées supprimées occupant encore de l'espace physique avant le passage du VACUUM.
- WLM : régulateur allouant mémoire et créneaux de concurrence aux requêtes.

## 4. Exemple concret
Définition SQL avec encodage AZ64 et clé de tri composée :
```sql
CREATE TABLE ventes (
    id_vente BIGINT ENCODE az64,
    date_vente DATE ENCODE az64,
    id_client INT ENCODE az64,
    montant DECIMAL(10,2) ENCODE az64
)
COMPOUND SORTKEY (date_vente, id_client);
```

## 5. Comparaisons et pièges d'examen
- Compound vs Interleaved : Compound est presque toujours recommandé sauf si des colonnes variées sont filtrées sans préfixe commun.
- Ne pas encoder la clé de tri : la première colonne d'une Compound Sort Key ne doit jamais être compressée avec un encodage trop lourd (RAW ou AZ64 recommandé) pour que les Zone Maps restent performantes.
- VACUUM DELETE ONLY : libère l'espace des lignes supprimées sans réordonner toute la table.

## 6. Lien avec SQL, Snowflake et Databricks
Redshift utilise les Zone Maps et `SORTKEY`, tout comme Snowflake utilise les min/max des micro-partitions et le clustering keys pour le partition pruning.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 76 à 95.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quel type de clé de tri Redshift offre les meilleures performances lorsque les requêtes filtrent systématiquement sur une plage de dates en première condition ?
   - A) Compound Sort Key avec la date en première colonne (Bonne réponse).
   - B) Interleaved Sort Key.
   - C) DISTSTYLE ALL.
   - D) Hash Sort Key.
2. Quelle commande Redshift met à jour les statistiques de métadonnées pour permettre à l'optimiseur de requêtes de générer les plans d'exécution les plus efficaces ?
   - A) ANALYZE (Bonne réponse).
   - B) VACUUM REINDEX.
   - C) TRUNCATE.
   - D) ALTER TABLE RECLUSTER.
