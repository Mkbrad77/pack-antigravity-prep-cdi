# Chapitre 3.10 : Optimisation Spark : Partitionnement, Shuffles & Skew

## 1. La question classique posée en entretien
« Vous observez un job Spark dont 99 tâches se terminent en 30 secondes, mais la 100ème met 45 minutes et finit en OutOfMemory. Quel est le problème et comment le résolvez-vous ? »

## 2. Ce que l'interviewer évalue vraiment
- Le diagnostic immédiat du phénomène de **Data Skew** (asymétrie de distribution sur la clé de partitionnement ou de jointure).
- Votre compréhension physique des opérations de **Shuffle** (échange réseau lourd de données entre exécuteurs).
- Vos techniques de remédiation : Salting, Broadcast Join, Adaptive Query Execution (AQE).

## 3. Réponse d'ingénieur senior

### A. Diagnostic du Data Skew
Une clé particulière (ex. ID client par défaut `0` ou client géant e-commerce) concentre une proportion démesurée de lignes. Lors du shuffle de jointure (`SortMergeJoin`), toutes ces lignes sont dirigées vers le même exécuteur Spark.

### B. Solutions techniques éprouvées
1. **Activer l'AQE (Adaptive Query Execution, actif par défaut en Spark 3.x) :**
   - `spark.sql.adaptive.enabled = true`
   - `spark.sql.adaptive.skewJoin.enabled = true`
   Spark détecte automatiquement les partitions asymétriques et les scinde en sous-partitions avant la jointure.
2. **Broadcast Hash Join :**
   Si l'une des tables fait moins de 10 Mo (paramètre `spark.sql.autoBroadcastJoinThreshold`, configurable à 50-100 Mo), forcer le broadcast (`broadcast(small_df)`). Aucun shuffle n'est effectué : la petite table est copiée en mémoire de chaque exécuteur.
3. **Technique du Salting (salage de clé) :**
   Ajouter un suffixe aléatoire de 0 à K à la clé de la table asymétrique, et dupliquer les lignes correspondantes dans la table de référence.

### C. Réglage des partitions de shuffle
Par défaut, `spark.sql.shuffle.partitions` est fixé à 200. Sur un gros volume (plusieurs centaines de Go), il faut calibrer pour que chaque partition en mémoire pèse entre 100 et 200 Mo.

## 4. Erreurs fatales à éviter absolument
- Augmenter bêtement la RAM de la machine sans comprendre la cause sous-jacente du déséquilibre.
- Faire un `repartition(1)` pour écrire un seul fichier et provoquer un goulot d'étranglement complet sur le cluster.
