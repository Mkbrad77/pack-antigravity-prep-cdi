# Chapitre 9 : Découplage et Messagerie Asynchrone : SQS, SNS et Amazon EventBridge

## 1. Objectifs d'apprentissage
- Comprendre les différences entre files d'attente (SQS), publication/abonnement (SNS) et bus d'événements (EventBridge).
- Maîtriser les caractéristiques des files Amazon SQS Standard vs FIFO.
- Découvrir le modèle Fan-out (SNS vers plusieurs files SQS).
- Utiliser Amazon EventBridge Pipes et le filtrage d'événements sans code.

## 2. Explication claire : quand choisir quoi
Le découplage des architectures de données permet d'isoler les composants pour garantir qu'une panne ou un ralentissement en aval n'impacte pas l'ingestion en amont :

1. Amazon SQS (Simple Queue Service) :
- Qu'est-ce que c'est : service de file d'attente de messages distribuée (Pull model : les consommateurs interrogent la file).
- Files Standard :
  - Débit quasi illimité.
  - Distribution au moins une fois (at-least-once delivery) : de rares doublons sont possibles, l'application doit être idempotente.
  - Ordre au mieux (best-effort ordering).
- Files FIFO (First-In-First-Out) :
  - Ordre strictement garanti des messages.
  - Distribution exactement une fois (exactly-once processing) grâce à l'ID de déduplication de message.
  - Débit limité à 300 messages/s (ou 3 000 messages/s avec le mode haute performance par lot).
  - Le nom de la file doit obligatoirement se terminer par l'extension `.fifo`.

2. Amazon SNS (Simple Notification Service) :
- Qu'est-ce que c'est : service de publication/abonnement (Push model : les abonnés reçoivent les messages dès publication).
- Modèle Fan-out : un producteur publie un message sur un sujet SNS unique ; SNS le distribue instantanément et en parallèle à de multiples files SQS, fonctions Lambda, webhooks HTTP ou adresses email abonnées.

3. Amazon EventBridge :
- Qu'est-ce que c'est : bus d'événements sans serveur permettant de relier des applications en utilisant des règles de routage basées sur le contenu JSON des événements.
- EventBridge Pipes : permet de créer des intégrations point-à-point simples entre des sources (SQS, Kinesis, DynamoDB Streams) et des cibles avec filtrage, enrichissement et transformation optionnels sans écrire de code d'infrastructure.

## 3. Définitions des termes clés
- Visibility Timeout (SQS) : période pendant laquelle un message récupéré par un consommateur reste invisible pour les autres consommateurs pour éviter qu'il ne soit traité deux fois en parallèle (par défaut 30 secondes, configurable jusqu'à 12 heures).
- Dead Letter Queue (DLQ) : file isolant les messages qui n'ont pas pu être traités après un nombre d'essais maximal défini (`maxReceiveCount`).
- Long Polling : technique de lecture SQS attendant jusqu'à 20 secondes qu'un message arrive dans la file avant de renvoyer une réponse vide, réduisant drastiquement le nombre de requêtes vides et les coûts.

## 4. Exemple concret
Architecture Fan-out avec filtrage de messages :
```
                    [Producteur : Nouvelle commande]
                                  |
                                  v
                        [Sujet SNS : Commandes]
                       /                       \
             (Règle: Montant > 1000)       (Toutes commandes)
                     v                                 v
        [File SQS : Commandes VIP]         [File SQS : Traitement Logistique]
                     v                                 v
         [Lambda Notification VIP]           [Consommateur EC2 Batch]
```

## 5. Comparaisons et pièges d'examen
- SQS vs SNS : SQS est un système de tirage (Pull) avec persistance des messages en file jusqu'à 14 jours ; SNS est un système de poussée (Push) sans stockage durable des messages si aucun abonné n'est connecté.
- Kinesis vs SQS : Kinesis permet à de multiples consommateurs de lire les mêmes données de façon indépendante avec un pointeur (rejeu possible) ; dans SQS, une fois qu'un message est consommé et supprimé de la file, il disparaît pour toujours.
- Long Polling vs Short Polling : pour réduire la facture SQS, toujours configurer `WaitTimeSeconds > 0` (Long Polling, maximum 20 secondes).

## 6. Lien avec SQL, Snowflake et Databricks
Amazon SNS et SQS sont au cœur de l'ingestion événementielle dans Snowflake : la notification S3 ObjectCreated est publiée vers un sujet SNS ou une file SQS que Snowpipe écoute pour charger automatiquement chaque nouveau micro-lot de données.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 261 à 275.
- Revue officielle AWS Skill Builder : Domain 1 Review (DEA-C01) : ingestion et transformation.

## 8. Mini-quiz du chapitre
1. Un pipeline de traitement de transactions financières exige que chaque message soit traité exactement une fois et rigoureusement dans l'ordre d'arrivée. Quel service devez-vous choisir ?
   - A) Amazon SQS FIFO avec identifiants de déduplication (Bonne réponse).
   - B) Amazon SQS Standard.
   - C) Amazon SNS Standard.
   - D) Amazon EventBridge Default Bus.
2. Que se passe-t-il si un consommateur met 45 secondes pour traiter un message SQS alors que le Visibility Timeout de la file est configuré à 30 secondes ?
   - A) Le message redevient visible dans la file et un autre consommateur risque de le traiter en doublon (Bonne réponse).
   - B) Le message est définitivement supprimé de la file.
   - C) Le message est envoyé dans la Dead Letter Queue immédiatement.
   - D) Le consommateur est automatiquement terminé par AWS.
