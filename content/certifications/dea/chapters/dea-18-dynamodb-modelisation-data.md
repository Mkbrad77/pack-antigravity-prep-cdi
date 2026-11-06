# Chapitre 18 : Modélisation NoSQL Haute Performance avec Amazon DynamoDB

## 1. Objectifs d'apprentissage
- Comprendre le modèle de données clé-valeur et document d'Amazon DynamoDB.
- Maîtriser les clés primaires simples (Partition Key) et composites (Partition + Sort Key).
- Différencier les index secondaires GSI et LSI.
- Utiliser DynamoDB Streams pour alimenter des architectures réactives et des Data Lakes.

## 2. Explication claire : quand choisir quoi
Amazon DynamoDB est une base NoSQL entièrement gérée offrant des latences sous les 10 ms à n'importe quelle échelle :

1. Clés primaires DynamoDB :
- Clé de partition simple (Partition Key / HASH) : hachage interne déterminant la partition physique. Requêtes d'accès direct par valeur exacte.
- Clé primaire composite (Partition Key + Sort Key / RANGE) : permet de stocker plusieurs éléments sous une même partition et d'effectuer des recherches par plage (`begins_with`, `between`, `>`, `<`).

2. Index secondaires :
- GSI (Global Secondary Index) :
  - Clé de partition et de tri différentes de la table de base.
  - Peut être créé ou supprimé à tout moment.
  - Écritures asynchrones avec cohérence éventuelle (eventual consistency).
- LSI (Local Secondary Index) :
  - Même clé de partition que la table de base, mais clé de tri différente.
  - Doit obligatoirement être créé lors de la création de la table.
  - Supporte la cohérence forte (strong consistency).

3. Modes de capacité :
- Mode On-Demand : mise à l'échelle automatique instantanée sans prévision de trafic, facturation à la requête lue/écrite.
- Mode Provisionné : réservation de RCU et WCU avec auto-scaling pour les charges stables et prévisibles.

4. DynamoDB Streams :
- Journal ordonné capturant chaque modification d'élément (INSERT, MODIFY, REMOVE) avec rétention de 24 heures.
- Déclenche des fonctions AWS Lambda ou alimente Kinesis/Firehose vers Amazon S3.

## 3. Définitions des termes clés
- RCU (Read Capacity Unit) : une lecture fortement cohérente par seconde pour un élément jusqu'à 4 Ko.
- WCU (Write Capacity Unit) : une écriture par seconde pour un élément jusqu'à 1 Ko.
- Hot Partition : saturation d'une partition physique due à une mauvaise cardinalité de clé de partition.

## 4. Exemple concret
Structure composite pour les commandes clients :
```
Table : Commandes
- Partition Key : id_client (ex. "CLI-102")
- Sort Key : date_commande (ex. "2026-10-31T14:00:00Z")
Permet de récupérer instantanément toutes les commandes d'un client sur une période donnée.
```

## 5. Comparaisons et pièges d'examen
- Scan vs Query : `Query` recherche par clé primaire ou index et est très véloce ; `Scan` parcourt l'intégralité de la table, consomme tous les RCU et doit être proscrit en production.
- Cohérence des lectures : par défaut, les lectures sont à cohérence éventuelle (coût 0,5 RCU) ; la cohérence forte consomme 1 RCU complet.
- LSI vs GSI : impossible d'ajouter un LSI après la création de la table ; les GSI sont ajoutés à chaud.

## 6. Lien avec SQL, Snowflake et Databricks
DynamoDB Streams couplé à Kinesis Firehose déverse en continu les événements opérationnels vers un Data Lake S3, où Snowflake ou Databricks les ingèrent pour analyse.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 116 à 135.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Quelle opération DynamoDB est la plus efficace pour récupérer les enregistrements d'un utilisateur spécifique ordonnés par date sans saturer les RCU ?
   - A) L'opération Query sur une table avec clé composite (Partition Key + Sort Key) (Bonne réponse).
   - B) L'opération Scan avec filtre client.
   - C) La création d'un bucket S3 Tables.
   - D) L'activation d'AWS DataSync.
2. Quelle est la principale contrainte technique d'un index secondaire local (LSI) dans Amazon DynamoDB ?
   - A) Il doit obligatoirement être défini lors de la création de la table (Bonne réponse).
   - B) Il ne fonctionne qu'avec des nombres entiers.
   - C) Il impose le mode de capacité On-Demand.
   - D) Il ne peut pas dépasser 1 Ko au total.
