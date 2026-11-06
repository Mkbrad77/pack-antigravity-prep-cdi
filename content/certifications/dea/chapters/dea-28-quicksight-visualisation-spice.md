# Chapitre 28 : Visualisation et Analytique Métier avec Amazon QuickSight

## 1. Objectifs d'apprentissage
- Comprendre l'architecture d'Amazon QuickSight et son moteur SPICE en mémoire.
- Différencier les requêtes directes (Direct Query) et l'ingestion en mémoire SPICE.
- Configurer la sécurité au niveau ligne (Row-Level Security - RLS) pour cloisonner les accès.
- Connecter QuickSight à Athena, Redshift, S3 et des bases relationnelles.

## 2. Explication claire : quand choisir quoi
Amazon QuickSight est le service de Business Intelligence (BI) sans serveur d'AWS permettant de créer et publier des tableaux de bord interactifs modernes :

1. Le moteur de calcul SPICE (Superfast, Parallel, In-memory Calculation Engine) :
- Qu'est-ce que c'est : un moteur en mémoire distribué et colonnaire conçu pour exécuter des calculs analytiques et des agrégations complexes en quelques fractions de seconde.
- SPICE vs Direct Query :
  - Ingestion SPICE : les données sont copiées et indexées dans la mémoire vive de QuickSight. Les tableaux de bord se chargent instantanément sans interroger la source sous-jacente. Protège la base opérationnelle (Athena ou Redshift) contre les milliers de requêtes générées par les utilisateurs métier. Permet des planifications de rafraîchissement régulières (horaires, quotidiennes).
  - Requête directe (Direct Query) : chaque interaction ou filtre sur le tableau de bord envoie une requête SQL directe à la base source (ex. Amazon Redshift ou Athena). Recommandé lorsque les données doivent être à jour à la seconde près ou que le jeu de données dépasse la taille maximale autorisée par SPICE.

2. Cloisonnement et sécurité : Row-Level Security (RLS) :
- Qu'est-ce que c'est : mécanisme permettant de restreindre les lignes d'un jeu de données visualisables par chaque utilisateur ou groupe d'utilisateurs.
- Mise en œuvre : création d'un jeu de données de contrôle d'accès dans QuickSight associant le nom d'utilisateur IAM ou l'adresse email à des filtres de valeurs (ex. l'utilisateur `jean@entreprise.com` ne voit que les lignes où `region = 'EMEA'`).
- Supporte également le Column-Level Security (CLS) pour masquer les colonnes sensibles (ex. numéro de carte bancaire, salaire).

3. Fonctionnalités avancées pour la Data :
- Amazon Q in QuickSight (nouveauté DEA-C01 v1.1) : permet aux utilisateurs métier de poser des questions en langage naturel (« Quel a été notre chiffre d'affaires le mois dernier par catégorie ? ») et génère automatiquement les visualisations et récits exécutifs correspondants.

## 3. Définitions des termes clés
- SPICE : moteur de stockage et de calcul en mémoire accélérant les tableaux de bord QuickSight.
- RLS (Row-Level Security) : filtrage dynamique des lignes selon l'identité de la session utilisateur.
- Direct Query : mode d'interrogation envoyant le SQL directement à la source de données sans mise en cache.

## 4. Exemple concret
Table de règles RLS pour restreindre les données par utilisateur :
```csv
UserName,CodePays
arn:aws:iam::123456789012:user/Alice,FR
arn:aws:iam::123456789012:user/Bob,DE
arn:aws:iam::123456789012:user/Charlie,UK
```
Lorsqu'Alice ouvre le tableau de bord, QuickSight filtre automatiquement les visualisations pour ne lui montrer que les lignes dont la colonne `CodePays` vaut 'FR'.

## 5. Comparaisons et pièges d'examen
- SPICE vs Direct Query pour les coûts Athena : si 100 utilisateurs consultent un tableau de bord connecté en Direct Query à Athena, chaque rafraîchissement scanne des gigaoctets de données sur S3, faisant exploser les coûts ; charger les données une fois par jour dans SPICE stabilise la facture à un montant prévisible dérisoire.
- Limites de capacité SPICE : chaque compte dispose de quotas de mémoire SPICE par utilisateur, extensibles par blocs de gigaoctets payants.

## 6. Lien avec SQL, Snowflake et Databricks
QuickSight s'intègre nativement comme outil de BI au-dessus de Snowflake et de Databricks SQL Warehouses via des connecteurs managés optimisés avec authentification IAM ou SSO.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 346 à 355.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Quel mécanisme d'Amazon QuickSight garantit que chaque responsable régional ne puisse visualiser que les données de ventes de sa propre zone géographique sur un tableau de bord partagé ?
   - A) La sécurité au niveau ligne (Row-Level Security - RLS) (Bonne réponse).
   - B) La duplication du tableau de bord en 50 versions distinctes.
   - C) La création de comptes AWS séparés pour chaque responsable.
   - D) L'activation d'Amazon Inspector.
2. Pour éviter de payer des frais d'analyse Amazon Athena répétés chaque fois qu'un utilisateur clique sur un filtre d'un tableau de bord de consultation fréquent, quel mode de données devez-vous privilégier ?
   - A) L'ingestion en mémoire SPICE avec rafraîchissement planifié (Bonne réponse).
   - B) Le mode Direct Query systématique.
   - C) L'écriture directe sur bande magnétique.
   - D) L'exécution de requêtes sans cache via l'API REST.
