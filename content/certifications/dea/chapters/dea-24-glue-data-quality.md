# Chapitre 24 : Contrôle et Validation de Données avec AWS Glue Data Quality

## 1. Objectifs d'apprentissage
- Comprendre l'intégration d'AWS Glue Data Quality dans les pipelines de données (compétence clé DEA-C01).
- Maîtriser le langage de définition de règles de qualité DQDL (Data Quality Definition Language).
- Mettre en œuvre le profilage automatisé de données et la génération de règles.
- Bloquer conditionnellement l'exécution d'un pipeline ETL en cas de non-respect des seuils de qualité.

## 2. Explication claire : quand choisir quoi
Dans un Data Lake moderne, la qualité des données est indispensable pour éviter que des données corrompues ou incomplètes ne polluent les tableaux de bord décisionnels et les modèles d'apprentissage machine :

1. AWS Glue Data Quality :
- Qu'est-ce que c'est : une fonctionnalité managée sans serveur intégrée à AWS Glue (jobs ETL, Glue Studio et Glue Data Catalog) permettant de mesurer et surveiller la qualité des données au repos ou en transit.
- Fonctionnement :
  - Analyse vos tables ou DynamicFrames.
  - Recommande automatiquement un jeu de règles de qualité initial grâce au profilage statistique (Data Profiling).
  - Vous permet d'éditer ou d'enrichir ces règles via un langage déclaratif simple appelé DQDL.

2. Le langage DQDL (Data Quality Definition Language) :
- Syntaxe déclarative et lisible par des humains.
- Exemples de règles DQDL fréquentes :
  - `RowCount > 0` : vérifie que le fichier entrant n'est pas vide.
  - `IsComplete "id_client"` : vérifie qu'il n'y a aucune valeur nulle dans la clé primaire.
  - `IsUnique "id_transaction"` : vérifie l'absence absolue de doublons d'identifiants.
  - `ColumnValues "statut" in ["PAYE", "ANNULE", "EN_ATTENTE"]` : contrôle l'intégrité référentielle des valeurs autorisées.
  - `ColumnDataType "montant" = "Decimal"` : valide le type de données.

3. Actions conditionnelles dans les pipelines Glue :
- Deux nœuds de traitement dans Glue Studio :
  - Évaluation de la qualité (Evaluate Data Quality) : applique les règles DQDL sur le flux.
  - Filtrage conditionnel : permet d'acheminer les lignes valides vers la table cible Curated du Data Lake et d'isoler automatiquement les lignes rejetées dans un compartiment S3 de quarantaine (Dead Letter Storage) pour analyse.
- Publication des métriques vers Amazon CloudWatch : permet de suivre l'évolution du score de qualité dans le temps et de déclencher une alarme SNS en cas de dégradation.

## 3. Définitions des termes clés
- DQDL : langage standard ouvert développé par AWS pour exprimer des contraintes de qualité de données.
- Quarantaine (Data Quarantine) : stockage isolé accueillant les enregistrements violant les contraintes métier pour investigations ultérieures sans bloquer l'ingestion générale.
- Profiling : calcul statistique de la distribution des valeurs, des valeurs nulles, des min/max et de l'unicité d'une colonne.

## 4. Exemple concret
Jeu de règles DQDL typique pour une table de ventes :
```text
Rules = [
    RowCount > 100,
    IsComplete "id_commande",
    IsUnique "id_commande",
    ColumnValues "montant" >= 0,
    ColumnValues "devise" in ["EUR", "USD", "GBP"],
    Completeness "email_client" >= 0.95
]
```

## 5. Comparaisons et pièges d'examen
- Glue Data Quality vs Scripts de validation personnalisés en PySpark : coder soi-même des vérifications en Spark nécessite du temps de développement et de maintenance ; DQDL est déclaratif, géré sans serveur et s'intègre nativement avec CloudWatch et EventBridge sans code additionnel.
- Bloquer le pipeline ou router vers la quarantaine : pour l'examen, isoler les mauvaises données dans un dossier de quarantaine tout en laissant passer les données valides est généralement la recommandation privilégiée pour maintenir la disponibilité opérationnelle du système.

## 6. Lien avec SQL, Snowflake et Databricks
Glue Data Quality répond exactement aux mêmes objectifs que le framework open source Great Expectations, les attentes de données (Data Expectations) dans Databricks Delta Live Tables, ou les contraintes de table et politiques de qualité dans Snowflake.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 148 à 150.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Quel langage déclaratif est utilisé par AWS Glue Data Quality pour définir des règles telles que l'unicité des colonnes, l'absence de valeurs nulles et les plages de valeurs autorisées ?
   - A) DQDL (Data Quality Definition Language) (Bonne réponse).
   - B) SQL PL/pgSQL.
   - C) YAML Ansible.
   - D) JSON Schema v4.
2. Comment une équipe data peut-elle empêcher des enregistrements invalides de polluer un entrepôt de données tout en permettant au pipeline de continuer à traiter les enregistrements valides ?
   - A) Utiliser le nœud Evaluate Data Quality dans Glue pour router les enregistrements non conformes vers un compartiment S3 de quarantaine (Bonne réponse).
   - B) Supprimer la table de destination.
   - C) Réduire le nombre de DPU à zéro.
   - D) Désactiver la surveillance CloudWatch.
