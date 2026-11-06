import fs from 'node:fs';
import path from 'node:path';
import { cleanEmDashes } from './question_builder.js';

const CHAPTERS_DIR = path.join(process.cwd(), 'content', 'certifications', 'dbt', 'chapters');

const chaptersPart2 = [
  {
    id: "modeles-python",
    title: "Modèles Python dans dbt",
    section: "Section 1 : Developing dbt models",
    toth: "leçons 93 à 96",
    weigel: "leçons 61 à 62",
    doc_url: "https://docs.getdbt.com/docs/build/python-models",
    content: `# Modèles Python dans dbt

## 1. Objectifs d'apprentissage
Comprendre l'architecture et les cas d'usage des modèles Python dans dbt (Snowpark, Databricks, BigQuery).
Maîtriser la signature obligatoire de la fonction model(dbt, session) et le renvoi d'un DataFrame.
Distinguer ce que le SQL sait faire de ce qui nécessite obligatoirement Python (ML, NLP, parsing complexe).
Connaître les restrictions techniques et les matérialisations compatibles avec les modèles Python.

## 2. Explication claire : quand choisir quoi
dbt permet d'écrire des modèles en Python (.py) en complément du SQL (.sql). Le principe fondamental : le code Python ne tourne pas sur votre machine locale, mais directement sur l'infrastructure de calcul du Data Warehouse (par exemple Snowpark sur Snowflake, ou un cluster Spark sur Databricks).
- **Quand utiliser SQL** : Pour 90 % des transformations data : agrégations, jointures, nettoyages et calculs d'indicateurs métier. Le SQL est plus rapide, plus économique et plus lisible.
- **Quand utiliser Python** : Pour les bibliothèques scientifiques et statistiques (scikit-learn, numpy, scipy), le traitement du langage naturel (spaCy, nltk), le géocodage ou la prédiction inférentielle de Machine Learning directement dans le pipeline.
- **Matérialisations autorisées** : Seules les matérialisations table et incremental sont supportées pour les modèles Python. Les matérialisations view et ephemeral ne sont pas autorisées.

## 3. Définitions des termes clés
- **model(dbt, session)** : Point d'entrée obligatoire de tout script de modèle Python dans dbt.
- **dbt.ref() et dbt.source()** : Méthodes de l'objet dbt permettant de lire les modèles et sources sous forme de DataFrames.
- **dbt.config()** : Méthode permettant de configurer la matérialisation et les packages Python tiers requis.
- **DataFrame retourné** : La fonction doit obligatoirement retourner un DataFrame Snowpark, PySpark ou Pandas.

## 4. Exemple concret
Structure d'un modèle Python dbt pour Snowflake (Snowpark) :

\`\`\`python
# models/marts/scoring_clients.py
import pandas as pd

def model(dbt, session):
    # Configuration du modèle
    dbt.config(
        materialized="table",
        packages=["scikit-learn", "numpy"]
    )

    # Référence vers un modèle dbt amont
    orders_df = dbt.ref("fct_orders")
    
    # Transformation via l'API DataFrame
    scored_df = orders_df.filter(orders_df["amount"] > 100)

    # Renvoi obligatoire du DataFrame final
    return scored_df
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Piège de la matérialisation vue** : Une question d'examen demandant de créer une vue (view) avec un modèle Python est fausse. Seules table et incremental sont possibles.
- **Exécution locale contre distante** : dbt ne fait qu'orchestrer et envoyer le code Python au moteur cible. Vous n'avez pas besoin d'installer Snowpark en local pour compiler le projet.
- **Gestion des packages** : Les packages tiers doivent être déclarés dans dbt.config(packages=[...]) pour être résolus par l'entrepôt.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, dbt Python exploite les Snowpark Stored Procedures et le runtime Anaconda intégré sécurisé.
- Dans **Databricks**, le modèle s'exécute comme un job PySpark natif connecté à Unity Catalog.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 93 à 96
- Cours secondaire Weigel : leçons 61 à 62
- Documentation officielle : https://docs.getdbt.com/docs/build/python-models (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelles sont les seules matérialisations supportées pour les modèles Python dans dbt ? (Réponse : table et incremental)
2. Quel est le nom de la fonction obligatoire que chaque fichier de modèle Python dbt doit définir ? (Réponse : model)
3. Où s'exécute le code d'un modèle Python dbt ? (Réponse : Dans l'entrepôt de données cible, ex. Snowflake ou Databricks, jamais sur le client local dbt)
`
  },
  {
    id: "variables",
    title: "Variables dans dbt",
    section: "Section 1 : Developing dbt models",
    toth: "leçons 97 à 101",
    weigel: "leçon 50",
    doc_url: "https://docs.getdbt.com/docs/build/project-variables",
    content: `# Variables dans dbt

## 1. Objectifs d'apprentissage
Comprendre la portée et la déclaration des variables de projet dans dbt_project.yml.
Utiliser la fonction Jinja var() pour paramétrer dynamiquement les modèles SQL et les macros.
Surcharger les variables en ligne de commande via l'argument --vars.
Gérer les valeurs par défaut pour sécuriser l'exécution des requêtes.

## 2. Explication claire : quand choisir quoi
Les variables dbt permettent de paramétrer le code SQL sans le modifier en dur. Elles évitent la duplication de code et facilitent les exécutions modulaires.
- **Variables de projet dans dbt_project.yml** : Utilisées pour définir des constantes globales valables pour l'ensemble du projet (par exemple le fuseau horaire de référence, une liste de pays autorisés, ou un taux de TVA par défaut).
- **Surcharge en ligne de commande (--vars)** : Idéale pour des exécutions ponctuelles ou paramétrées par un orchestrateur (Airflow, Dagster). Par exemple, recalculer les données d'une date spécifique lors d'un backfill.
- **Syntaxe var()** : Prend en premier paramètre le nom de la variable, et en second paramètre optionnel une valeur par défaut. Il est fortement recommandé de toujours fournir une valeur par défaut pour éviter qu'un dbt compile n'échoue si la variable n'est pas passée.

## 3. Définitions des termes clés
- **var('nom_variable')** : Fonction Jinja extrayant la valeur d'une variable déclarée.
- **--vars '{"cle": "valeur"}'** : Argument CLI permettant d'injecter ou surcharger des variables au format JSON ou YAML.
- **dbt_project.yml (vars:)** : Bloc racine du fichier de configuration du projet stockant les variables par défaut.

## 4. Exemple concret
Déclaration dans le fichier dbt_project.yml :

\`\`\`yaml
# dbt_project.yml
name: 'mon_projet_dbt'
version: '1.0.0'

vars:
  date_debut_analyse: '2026-01-01'
  pays_inclus: ['FR', 'DE', 'ES']
\`\`\`

Utilisation dans un modèle SQL avec valeur de repli :

\`\`\`sql
-- models/marts/fct_ventes_europe.sql
select
    id_vente,
    pays,
    montant_ht
from {{ ref('stg_ventes') }}
where date_vente >= '{{ var("date_debut_analyse", "2025-01-01") }}'
  and pays in (
      {%- for p in var("pays_inclus") -%}
          '{{ p }}'{% if not loop.last %}, {% endif %}
      {%- endfor -%}
  )
\`\`\`

Surcharge en ligne de commande :
\`\`\`bash
dbt run --select fct_ventes_europe --vars '{"date_debut_analyse": "2026-10-01"}'
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Priorité de surcharge** : Les variables passées en CLI via --vars ont une priorité absolue sur les variables déclarées dans dbt_project.yml.
- **Variables d'environnement contre variables de projet** : env_var() lit des variables du système d'exploitation hôte (mots de passe, tokens d'authentification). var() gère la logique de transformation du projet data.
- **Gestion des types** : Attention au formatage YAML/JSON dans l'invite de commande Windows : échappez convenablement les guillemets.

## 6. Lien avec SQL, Snowflake et Databricks
- Les variables dbt sont résolues lors de la phase de compilation Jinja, avant que le SQL pur ne soit transmis à Snowflake ou Databricks.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 97 à 101
- Cours secondaire Weigel : leçon 50
- Documentation officielle : https://docs.getdbt.com/docs/build/project-variables (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle fonction Jinja permet de lire une variable de projet avec une valeur de secours ? (Réponse : var('nom', 'valeur_par_defaut'))
2. Quel paramètre CLI dbt a la priorité sur les variables configurées dans dbt_project.yml ? (Réponse : --vars)
3. Quelle est la différence fondamentale entre var() et env_var() ? (Réponse : var() manipule des variables applicatives dbt, alors que env_var() lit les variables du système d'exploitation)
`
  },
  {
    id: "incremental-microbatch",
    title: "Modèles incrémentaux et microbatch",
    section: "Section 1 : Developing dbt models",
    toth: "leçons 25 à 26, 101 à 103",
    weigel: "leçons 25 à 26, 125 à 127",
    doc_url: "https://docs.getdbt.com/docs/build/incremental-microbatch",
    content: `# Modèles incrémentaux et microbatch

## 1. Objectifs d'apprentissage
Comprendre le fonctionnement interne de la matérialisation incrémentale standard et la macro is_incremental().
Identifier les différentes stratégies incrémentales : merge, delete+insert, append, microbatch.
Maîtriser la stratégie moderne microbatch introduite dans dbt Core 1.9 pour le traitement par fenêtres temporelles.
Savoir diagnostiquer et réparer la dérive des données via l'option --full-refresh.

## 2. Explication claire : quand choisir quoi
Les modèles incrémentaux évitent de recalculer la totalité d'une table à chaque exécution de dbt run, réduisant considérablement la durée de traitement et la facture cloud.
- **Incrémental standard (macro is_incremental())** :
  Lors de la première exécution, la table est créée intégralement.
  Lors des exécutions suivantes, le bloc conditionnel \`{% if is_incremental() %}\` filtre les lignes source dont l'horodatage dépasse la valeur maximale déjà présente dans la table cible (\`this\`).
- **Stratégies incrémentales traditionnelles** :
  - **merge** : Idéal lorsque des lignes existantes peuvent être mises à jour ou insérées (requiert unique_key).
  - **delete+insert** : Alternative efficace sur les moteurs où le MERGE est coûteux.
  - **append** : Uniquement pour les journaux d'événements immuables sans dédoublonnage.
- **Stratégie Microbatch (nouveauté majeure)** :
  Conçue pour les très grands volumes de séries temporelles. Au lieu de filtrer sur une clause WHERE arbitraire, dbt découpe automatiquement le traitement en petits lots temporels indépendants (par exemple heure par heure ou jour par jour).
  Avantage majeur : si un lot échoue, seul ce lot précis est rejoué, facilitant les reprises et les calculs parallèles.

## 3. Définitions des termes clés
- **is_incremental()** : Macro Jinja renvoyant true si la table cible existe déjà et si aucun --full-refresh n'est demandé.
- **this** : Référence Jinja désignant la table cible actuelle dans l'entrepôt.
- **unique_key** : Colonne ou liste de colonnes identifiant de manière unique une ligne pour les jointures de mise à jour.
- **microbatch** : Stratégie native dbt partitionnant l'ingestion par intervalles d'horodatage définis par event_time et batch_size.

## 4. Exemple concret
Configuration d'un modèle incrémental moderne avec stratégie microbatch :

\`\`\`sql
-- models/marts/fct_evenements_iot.sql
{{ config(
    materialized='incremental',
    incremental_strategy='microbatch',
    unique_key='event_id',
    event_time='event_timestamp',
    batch_size='day',
    begin=modules.datetime.datetime(2026, 1, 1, tzinfo=modules.pytz.utc)
) }}

select
    event_id,
    device_id,
    event_timestamp,
    mesure_valeur
from {{ ref('stg_telemetrie') }}
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Piège de l'absence de unique_key** : Si vous utilisez merge sans définir unique_key, ou avec append, les réexécutions créeront des doublons dans la table cible.
- **Piège du changement de schéma** : Si vous ajoutez une colonne dans le modèle SQL, la table incrémentale existante ne recevra pas la colonne sauf si vous configurez on_schema_change='append_new_columns' ou 'sync_all_columns'.
- **Comportement de --full-refresh** : Force dbt à supprimer (drop) la table et à la reconstruire entièrement, ignorant la condition is_incremental().

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, la stratégie merge s'appuie sur la commande SQL native MERGE INTO hautement optimisée.
- Dans **Databricks**, Delta Lake utilise la commande MERGE native avec support du partition pruning.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 25 à 26, 101 à 103
- Cours secondaire Weigel : leçons 25 à 26, 125 à 127
- Documentation officielle : https://docs.getdbt.com/docs/build/incremental-microbatch (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Que retourne la macro is_incremental() lors d'une commande dbt run --full-refresh ? (Réponse : false)
2. Quel paramètre de configuration doit être défini pour qu'un modèle incrémental prenne en compte les nouvelles colonnes ? (Réponse : on_schema_change)
3. Quel est l'avantage principal de la stratégie incrémentale microbatch par rapport à un filtre classique ? (Réponse : Découpage automatique en fenêtres temporelles indépendantes facilitant les reprises et les recalculs ciblés)
`
  },
  {
    id: "versions",
    title: "Versions de modèles et dépréciation",
    section: "Section 1 : Developing dbt models",
    toth: "leçons 104 à 107",
    weigel: "leçons 71 à 72",
    doc_url: "https://docs.getdbt.com/docs/collaborate/govern/model-versions",
    content: `# Versions de modèles et dépréciation

## 1. Objectifs d'apprentissage
Comprendre l'intérêt du versionnage sémantique des modèles dans les projets dbt multi-équipes (dbt Mesh).
Déclarer des versions majeures (v1, v2) dans les fichiers YAML et nommer les fichiers SQL correspondants.
Gérer la dépréciation d'une version avec la directive deprecation_date.
Utiliser la fonction ref() avec l'argument de version explicite ou implicite.

## 2. Explication claire : quand choisir quoi
Dans une architecture d'entreprise, modifier la structure d'un modèle central (renommer une colonne, modifier une clé primaire) peut casser les tableaux de bord et les modèles en aval d'autres équipes.
- **Sans versionnage** : Toute modification majeure est bloquante et risquée.
- **Avec versionnage de modèle** : L'équipe responsable peut publier une nouvelle version (ex: v2) tout en maintenant la version actuelle (v1) active jusqu'à une date d'obsolescence convenue (deprecation_date).
- **Résolution par ref()** :
  - Par défaut, \`ref('mon_modele')\` pointe vers la version désignée comme dernière version stable (latest_version).
  - Un consommateur qui n'est pas encore prêt à migrer peut figer son appel en écrivant \`ref('mon_modele', v=1)\`.

## 3. Définitions des termes clés
- **latest_version** : Attribut YAML précisant la version retournée par défaut lorsqu'aucune version n'est spécifiée dans ref().
- **deprecation_date** : Date limite au format YYYY-MM-DD déclenchant un avertissement lors de la compilation si un modèle dépend encore de la version obsolète.
- **Suffixe de fichier** : Les fichiers SQL portent obligatoirement le suffixe de leur version (ex: \`dim_clients_v1.sql\`, \`dim_clients_v2.sql\`).

## 4. Exemple concret
Déclaration YAML des versions dans models/marts/schema.yml :

\`\`\`yaml
version: 2

models:
  - name: dim_clients
    latest_version: 2
    versions:
      - v: 1
        config:
          alias: dim_clients_v1
        deprecation_date: 2027-01-01
      - v: 2
        config:
          alias: dim_clients_v2
        columns:
          - name: client_id
            data_type: integer
          - name: code_client_unique
            data_type: text
\`\`\`

Fichiers SQL correspondants :
- \`models/marts/dim_clients_v1.sql\`
- \`models/marts/dim_clients_v2.sql\`

Appel dans un modèle dépendant :
\`\`\`sql
-- Utilise la version 2 (dernière version par défaut)
select * from {{ ref('dim_clients') }}

-- Fige la dépendance sur la version 1
select * from {{ ref('dim_clients', v=1) }}
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Piège du nom de fichier** : Le nom du fichier physique doit inclure le suffixe de version (\`nom_modele_v1.sql\`), alors que la clé YAML \`name\` reste le nom générique (\`dim_clients\`).
- **Comportement après la date de dépréciation** : Dépasser la date de dépréciation (deprecation_date) génère un avertissement (warning) à la compilation, mais ne bloque pas l'exécution sauf si le projet est configuré en mode strict.
- **Alias de table** : Si deux versions coexistent dans le même schéma, elles doivent avoir des alias distincts pour éviter d'écraser la même table dans la base de données.

## 6. Lien avec SQL, Snowflake et Databricks
- Permet de gérer les migrations de schémas sans interruption de service pour les outils BI connectés à Snowflake ou Databricks.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 104 à 107
- Cours secondaire Weigel : leçons 71 à 72
- Documentation officielle : https://docs.getdbt.com/docs/collaborate/govern/model-versions (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel argument de la macro ref() permet d'appeler une version spécifique d'un modèle ? (Réponse : ref('modele', v=1) ou ref('modele', version=1))
2. Que se passe-t-il si la date définie dans deprecation_date est dépassée ? (Réponse : dbt émet un message d'avertissement warning à la compilation)
3. Si un modèle possède deux versions (v1 et v2) et que latest_version est défini à 2, vers quelle version pointe ref('modele') ? (Réponse : Vers la version 2)
`
  },
  {
    id: "acces-modeles",
    title: "Accès aux modèles : groupes, privé, protégé et public",
    section: "Section 3 : Testing, documenting, and publishing dbt models",
    toth: "Non couvert dans Toth",
    weigel: "leçons 73 à 76",
    doc_url: "https://docs.getdbt.com/docs/collaborate/govern/model-access",
    content: `# Accès aux modèles : groupes, privé, protégé et public

## 1. Objectifs d'apprentissage
Comprendre les niveaux de visibilité d'un modèle dbt : private, protected et public.
Assigner des modèles à des équipes propriétaires via la notion de group.
Sécuriser les interfaces d'échange entre projets dans une architecture dbt Mesh.
Identifier les erreurs de compilation liées à des violations d'accès (dbt access violation).

## 2. Explication claire : quand choisir quoi
Dans les organisations gérant des dizaines de développeurs ou plusieurs projets dbt fédérés (dbt Mesh), exposer tous les modèles à tout le monde conduit à du code spaghetti. La propriété \`access\` contrôle qui a le droit d'appeler un modèle via \`ref()\`.
- **private** : Le modèle ne peut être appelé que par des modèles appartenant au MÊME groupe (group). Idéal pour les tables intermédiaires internes à une équipe.
- **protected (par défaut)** : Le modèle peut être appelé par n'importe quel modèle au sein du MÊME projet ou package dbt. Il ne peut pas être appelé par d'autres projets dbt externes.
- **public** : Le modèle fait office de contrat d'API de données officiel. Il peut être appelé par des modèles d'autres projets dbt externes (dbt Mesh). Un modèle public requiert généralement la définition d'un contrat de schéma (\`contract: enforced: true\`).

## 3. Définitions des termes clés
- **access** : Propriété de configuration d'un modèle (valeurs : private, protected, public).
- **group** : Entité logique représentant l'équipe propriétaire du modèle (définie dans models.yml avec un propriétaire et un canal de contact).
- **dbt Mesh** : Architecture où plusieurs projets dbt collaborent en interrogeant les modèles publics des autres projets sans partager le même dépôt de code.

## 4. Exemple concret
Définition d'un groupe et de niveaux d'accès dans models/schema.yml :

\`\`\`yaml
version: 2

groups:
  - name: finance
    owner:
      name: Equipe Comptable
      email: data-finance@entreprise.com

models:
  - name: int_calcul_taxes
    group: finance
    access: private
    description: "Modèle interne réservé à l'équipe finance"

  - name: fct_revenus_mensuels
    group: finance
    access: public
    config:
      contract:
        enforced: true
    description: "Données financières certifiées ouvertes aux autres projets"
    columns:
      - name: mois
        data_type: date
      - name: chiffre_affaires
        data_type: numeric
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Valeur par défaut** : Si vous ne spécifiez pas la propriété access, la valeur par défaut est protected.
- **Violation d'accès privé** : Si le modèle \`fct_marketing\` (groupe marketing) tente de faire un \`ref('int_calcul_taxes')\` (groupe finance, privé), la commande \`dbt compile\` échoue immédiatement avec une erreur de compilation.
- **Condition pour devenir public** : Un modèle public doit offrir des garanties de stabilité. Il est très vivement conseillé de lui associer des versions et un contrat formel.

## 6. Lien avec SQL, Snowflake et Databricks
- Les contrôles d'accès dbt régissent le graphe de dépendances (DAG) au moment de la compilation dbt, complétant les autorisations RBAC physiques (grants) sur Snowflake ou Databricks.

## 7. Renvois aux cours et documentation
- Cours principal Toth : Non couvert
- Cours secondaire Weigel : leçons 73 à 76
- Documentation officielle : https://docs.getdbt.com/docs/collaborate/govern/model-access (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel est le niveau d'accès par défaut d'un modèle dbt si aucun paramètre access n'est fourni ? (Réponse : protected)
2. Quel niveau d'accès autorise un modèle d'un autre projet dbt (dbt Mesh) à utiliser ref() ? (Réponse : public)
3. Qui peut faire référence à un modèle dont l'accès est défini sur private ? (Réponse : Uniquement les modèles appartenant au même group dbt)
`
  },
  {
    id: "environnements",
    title: "Environnements, cibles et variables d'environnement",
    section: "Section 4 : Deployment and orchestration",
    toth: "leçons 109 à 113",
    weigel: "leçons 66 à 67",
    doc_url: "https://docs.getdbt.com/docs/build/environment-variables",
    content: `# Environnements, cibles et variables d'environnement

## 1. Objectifs d'apprentissage
Configurer les environnements de travail (dev, staging, prod) dans profiles.yml.
Sélectionner la cible d'exécution via le flag --target (-t).
Sécuriser les identifiants et les paramètres sensibles avec la macro env_var().
Distinguer le schéma par défaut de développement des schémas d'entreprise en production.

## 2. Explication claire : quand choisir quoi
Un projet dbt unique doit pouvoir tourner sans modification de code sur la machine d'un développeur, sur un serveur d'intégration continue (CI) et en production.
- **Fichier profiles.yml** : Localisé hors du dépôt Git (dans ~/.dbt/ en local), il contient les profils de connexion et les cibles (targets).
- **Cibles (targets)** : Chaque profil définit une cible par défaut (default target) et plusieurs cibles nommées (ex: dev, prod). La commande \`dbt run --target prod\` permet de basculer instantanément de cible.
- **Variables d'environnement (env_var)** : Évitent d'écrire en clair les mots de passe, tokens et clés secrètes dans les fichiers YAML. La syntaxe supporte une valeur de repli optionnelle : \`{{ env_var('DBT_PASSWORD', 'fallback') }}\`.

## 3. Définitions des termes clés
- **target.name** : Variable de contexte Jinja contenant le nom de la cible actuelle (ex: 'dev' ou 'prod').
- **target.schema** : Nom du schéma de base de données associé à la cible courante.
- **env_var('VAR_NAME')** : Fonction Jinja extrayant la valeur d'une variable d'environnement de l'OS hôte.

## 4. Exemple concret
Configuration sécurisée dans ~/.dbt/profiles.yml :

\`\`\`yaml
mon_projet:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_ACCOUNT') }}"
      user: "{{ env_var('SNOWFLAKE_USER') }}"
      password: "{{ env_var('SNOWFLAKE_PASSWORD') }}"
      role: transformer_dev
      database: analytics_dev
      warehouse: dev_wh
      schema: "dbt_{{ env_var('USER', 'default') }}"
      threads: 4

    prod:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_ACCOUNT') }}"
      user: "{{ env_var('SNOWFLAKE_PROD_USER') }}"
      password: "{{ env_var('SNOWFLAKE_PROD_PASSWORD') }}"
      role: transformer_prod
      database: analytics_prod
      warehouse: prod_wh
      schema: public
      threads: 8
\`\`\`

Utilisation dans le code SQL pour isoler les tests :
\`\`\`sql
select *
from {{ ref('stg_paiements') }}
{% if target.name == 'dev' %}
where date_paiement >= current_date - interval '7 days'
{% endif %}
\`\`\`

## 5. Comparaisons et pièges d'examen
- **profiles.yml contre dbt_project.yml** : profiles.yml stocke les identifiants de connexion et ne doit JAMAIS être poussé dans Git. dbt_project.yml stocke la logique métier et est versionné dans Git.
- **Comportement de env_var sans valeur par défaut** : Si la variable d'environnement demandée n'existe pas et qu'aucune valeur de repli n'est fournie, dbt lève une erreur bloquante immédiate à l'analyse.
- **Threads** : Représente le nombre de requêtes SQL concurrentes que dbt envoie en parallèle au Data Warehouse.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, la cible configure le rôle (role), l'entrepôt virtuel (warehouse), la base de données et le schéma.
- Dans **Databricks**, la cible pointe vers un catalogue Unity Catalog et un cluster SQL Warehouse.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 109 à 113
- Cours secondaire Weigel : leçons 66 à 67
- Documentation officielle : https://docs.getdbt.com/docs/build/environment-variables (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel flag de commande en ligne permet de spécifier une cible de profil différente de celle par défaut ? (Réponse : --target ou -t)
2. Quel fichier dbt ne doit jamais être commité dans un dépôt de code public ou partagé pour des raisons de sécurité ? (Réponse : profiles.yml)
3. Comment écrire une variable d'environnement avec une valeur de repli sécurisée en Jinja ? (Réponse : {{ env_var('NOM_VARIABLE', 'valeur_par_defaut') }})
`
  },
  {
    id: "etat-retry",
    title: "État, manifest, run_results et dbt retry",
    section: "Section 2 : Debugging data modeling errors",
    toth: "leçons 114 à 115",
    weigel: "leçons 85 à 89",
    doc_url: "https://docs.getdbt.com/reference/node-selection/state-comparison",
    content: `# État, manifest, run_results et dbt retry

## 1. Objectifs d'apprentissage
Comprendre le rôle des artefacts dbt générés dans le dossier target/ (manifest.json, run_results.json).
Utiliser le sélecteur d'état state: pour comparer le code courant à une exécution de référence.
Maîtriser la commande dbt retry pour rejouer uniquement les nœuds en échec sans recalculer les succès.
Identifier les critères déterminant si un modèle est considéré comme modifié (state:modified).

## 2. Explication claire : quand choisir quoi
À chaque compilation ou exécution, dbt consigne l'état exact du projet dans des fichiers JSON stockés dans \`target/\`.
- **manifest.json** : L'artefact le plus complet. Il contient la représentation intégrale du graphe de dépendances (DAG), les définitions de colonnes, les tags, les tests et le code SQL compilé de chaque modèle.
- **run_results.json** : Résume le statut final de la dernière commande exécutée (success, error, fail, skipped, temps d'exécution).
- **dbt retry** : Commande extrêmement productive introduite dans dbt Core 1.6. Si un pipeline de 50 modèles échoue au 48e modèle, \`dbt retry\` réexécute directement le modèle 48 et les suivants, sans relancer les 47 premiers qui ont déjà réussi.
- **Comparaison d'état (state:)** : En fournissant un manifest de référence (généralement issu de la dernière exécution de production), dbt est capable d'identifier exactement ce qui a changé.

## 3. Définitions des termes clés
- **--state path/to/artifacts** : Argument CLI pointant vers le dossier contenant le \`manifest.json\` de référence.
- **state:modified** : Méthode de sélection isolant les modèles dont le code SQL, la configuration YAML ou les macros associées ont changé.
- **result:error / result:fail** : Sélecteur filtrant les nœuds qui étaient en échec dans le \`run_results.json\` de référence.

## 4. Exemple concret
Réexécution immédiate des échecs après correction d'un bug de syntaxe :

\`\`\`bash
# 1. Lancement du projet (échoue sur 2 modèles)
dbt build

# 2. Après correction du code SQL incriminé, rejouer uniquement les échecs
dbt retry
\`\`\`

Sélection des modèles modifiés par rapport à la production :
\`\`\`bash
dbt build --select state:modified --state path/to/prod/artifacts
\`\`\`

## 5. Comparaisons et pièges d'examen
- **dbt retry contre state:modified** : \`dbt retry\` lit directement le fichier \`target/run_results.json\` de la commande précédente dans le répertoire de travail actuel. \`--select state:modified\` requiert le paramètre \`--state\` et compare deux fichiers \`manifest.json\`.
- **Qu'est-ce qui déclenche state:modified ?** Une modification du fichier SQL, un changement dans la configuration YAML (ex: description, tag, matérialisation), ou une modification d'une macro appelée par le modèle.
- **Sous-sélecteurs utiles** : \`state:modified.body\` vérifie uniquement les modifications du code SQL du modèle en ignorant les métadonnées.

## 6. Lien avec SQL, Snowflake et Databricks
- Évite de gaspiller des crédits de calcul Snowflake et Databricks en ne recalculant que le strict nécessaire lors des cycles de développement et de CI.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 114 à 115
- Cours secondaire Weigel : leçons 85 à 89
- Documentation officielle : https://docs.getdbt.com/reference/node-selection/state-comparison (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande dbt permet de relancer automatiquement uniquement les modèles ayant échoué lors de la commande précédente ? (Réponse : dbt retry)
2. Quel fichier artefact contient la description exhaustive du DAG et des métadonnées du projet dbt ? (Réponse : manifest.json)
3. Quel sélecteur permet de cibler les modèles ayant subi une modification par rapport à un manifest antérieur ? (Réponse : state:modified)
`
  },
  {
    id: "ci-slim-ci",
    title: "CI/CD et Slim CI",
    section: "Section 4 : Deployment and orchestration",
    toth: "leçons 108, 118 à 123",
    weigel: "leçons 90 à 94, 98 à 103",
    doc_url: "https://docs.getdbt.com/docs/deploy/slim-ci",
    content: `# CI/CD et Slim CI

## 1. Objectifs d'apprentissage
Comprendre les principes de l'intégration continue (CI) appliqués aux projets de modélisation de données.
Mettre en œuvre le modèle Slim CI pour réduire les temps de build et les coûts d'infrastructure.
Combiner les sélecteurs d'état state:modified+ avec l'option --defer.
Automatiser les vérifications lors des Pull Requests GitHub ou GitLab.

## 2. Explication claire : quand choisir quoi
Dans une approche CI/CD traditionnelle, chaque Pull Request (PR) créée par un développeur déclenche un \`dbt build\` complet de tous les modèles dans un schéma temporaire de test. Dans un entrepôt comportant 500 modèles, ce test prendrait 2 heures et coûterait des centaines de crédits cloud.
- **Slim CI** : Approche moderne hautement optimisée. La CI télécharge le \`manifest.json\` issu du dernier build de production réussi, et ne construit que :
  1. Les modèles modifiés par la PR.
  2. Les modèles directement impactés en aval (enfants dépendants).
- **Formule consacrée de Slim CI** :
  \`dbt build --select state:modified+ --defer --state path/to/prod/artifacts\`
- **Résultat** : Un temps de pipeline réduit de plusieurs heures à quelques minutes, avec une garantie totale de non-régression.

## 3. Définitions des termes clés
- **Slim CI** : Pratique consistant à tester exclusivement le sous-ensemble de modèles créés ou modifiés par une branche de code.
- **state:modified+** : Sélecteur désignant tous les modèles modifiés ainsi que tous leurs descendants directs et indirects dans le graphe.
- **Environnement de PR (staging / sandbox)** : Schéma de base de données isolé créé pour la durée de validation de la Pull Request puis détruit.

## 4. Exemple concret
Workflow GitHub Actions simplifié pour Slim CI :

\`\`\`yaml
# .github/workflows/slim_ci.yml
name: Slim CI

on:
  pull_request:
    branches: [ main ]

jobs:
  dbt_ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Télécharger le manifest de production
        run: aws s3 cp s3://mon-bucket-dbt-prod/manifest.json ./prod_artifacts/manifest.json

      - name: Exécuter Slim CI
        run: |
          dbt build \
            --select state:modified+ \
            --state ./prod_artifacts \
            --defer \
            --target ci_pr_\${{ github.event.pull_request.number }}
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Rôle indispensable de --defer** : Si le modèle modifié \`fct_orders\` dépend de \`stg_orders\` (qui n'a PAS été modifié et n'a donc pas été reconstruit dans le schéma de test), \`--defer\` indique à dbt de lire \`stg_orders\` directement dans le schéma de production sans lever d'erreur de table manquante.
- **Pourquoi build plutôt que run ?** \`dbt build\` exécute à la fois les modèles, les tests, les snapshots et les seeds dans l'ordre du DAG. En CI, cela garantit que si un test échoue, les modèles dépendants ne sont pas calculés.
- **Gestion des dépendances en amont (+state:modified)** : Si vous ajoutez le signe + devant, vous testez aussi les parents, ce qui alourdit généralement la CI. Pour Slim CI, on privilégie \`state:modified+\` (les enfants).

## 6. Lien avec SQL, Snowflake et Databricks
- Permet de valider rapidement les changements dans Snowflake ou Databricks sans impacter les schémas de production ni dupliquer inutilement des téraoctets de données.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 108, 118 à 123
- Cours secondaire Weigel : leçons 90 à 94, 98 à 103
- Documentation officielle : https://docs.getdbt.com/docs/deploy/slim-ci (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande résume le modèle Slim CI en associant sélection modifiée, descendants et résolution différée ? (Réponse : dbt build --select state:modified+ --defer --state path)
2. Quel est l'avantage primordial de Slim CI par rapport à un build CI complet ? (Réponse : Réduction drastique des temps d'exécution et des coûts de calcul cloud en ne testant que ce qui change)
3. Quel artefact issu de la production est obligatoire pour faire fonctionner Slim CI ? (Réponse : manifest.json)
`
  },
  {
    id: "defer-clone",
    title: "Mécanismes Defer et Clone",
    section: "Section 4 : Deployment and orchestration",
    toth: "leçon 116",
    weigel: "leçons 95 à 97",
    doc_url: "https://docs.getdbt.com/reference/node-selection/defer",
    content: `# Mécanismes Defer et Clone

## 1. Objectifs d'apprentissage
Comprendre le fonctionnement et les prérequis de l'option --defer.
Éviter la duplication massive de données en environnement de développement local.
Maîtriser la commande dbt clone pour répliquer des tables à coût zéro (Zero-Copy Clone).
Distinguer quand combiner defer et clone dans les stratégies de rafraîchissement.

## 2. Explication claire : quand choisir quoi
Quand un développeur crée un nouveau modèle intermédiaire \`int_ventes\`, ce modèle dépend souvent de plusieurs tables de staging amont. Recréer toutes ces tables brutes dans son schéma personnel de dev prend du temps et pollue la base.
- **Defer (--defer)** :
  Permet d'exécuter un modèle dans un environnement cible (ex: le schéma personnel de dev) en résolvant les dépendances non construites vers un environnement de référence (ex: la production ou le staging partagé).
  Si la table \`stg_clients\` n'existe pas dans le schéma de dev, dbt redirige automatiquement la requête vers \`prod.stg_clients\`.
  Nécessite impérativement un \`manifest.json\` de référence passé via \`--state\`.
- **Clone (dbt clone)** :
  Crée une copie logique instantanée des relations d'une base de données source vers une base cible.
  Sur les entrepôts supportant le clonage sans copie physique (Zero-Copy Clone sur Snowflake, Clone sur Databricks Unity Catalog, ou BigQuery Table Clones), cette opération prend quelques secondes et ne consomme aucun stockage supplémentaire.

## 3. Définitions des termes clés
- **--defer** : Flag dbt indiquant au compilateur de router les appels ref() manquants vers le schéma source défini dans le manifest de comparaison.
- **dbt clone** : Commande introduite dans dbt Core 1.6 matérialisant des copies de tables existantes sans réexécuter les requêtes de transformation.
- **Zero-Copy Clone** : Fonctionnalité de stockage sous-jacente qui duplique uniquement les métadonnées de pointeurs sans copier les octets de données.

## 4. Exemple concret
Utilisation combinée de defer en développement local :

\`\`\`bash
# Le développeur souhaite tester uniquement son modèle fct_reporting_ventes
# sans avoir à recalculer les tables de staging en amont
dbt run \
  --select fct_reporting_ventes \
  --defer \
  --state path/to/prod_artifacts
\`\`\`

Création rapide d'un schéma de développement par clonage :
\`\`\`bash
# Clone l'ensemble des tables de production vers le schéma personnel de développement
dbt clone --state path/to/prod_artifacts
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Différence majeure entre defer et clone** : \`--defer\` ne crée aucun objet physique dans la base de données : il modifie uniquement le SQL compilé pour pointer vers la table de production. \`dbt clone\` crée de vrais objets de tables dans la cible, mais sans recopier les données physiques.
- **Exigence de --defer** : \`--defer\` ne peut fonctionner sans l'argument \`--state\` indiquant l'emplacement du \`manifest.json\` de référence.
- **Droits d'accès** : Pour que \`--defer\` fonctionne en développement, l'utilisateur dbt doit disposer des droits de lecture (SELECT) sur les tables du schéma de production référencé.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, \`dbt clone\` traduit la commande en \`CREATE TABLE target CLONE source\`, opération instantanée à coût nul.
- Dans **Databricks**, Unity Catalog exploite le clonage superficiel (SHALLOW CLONE) des tables Delta Lake.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçon 116
- Cours secondaire Weigel : leçons 95 à 97
- Documentation officielle : https://docs.getdbt.com/reference/node-selection/defer (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel argument CLI est obligatoire pour pouvoir utiliser le flag --defer ? (Réponse : --state pointant vers un manifest.json)
2. Quelle commande permet de créer rapidement des tables de test sans relancer les requêtes SQL de transformation ? (Réponse : dbt clone)
3. Comment réagit --defer si une table dépendante existe déjà dans le schéma de développement local ? (Réponse : Il utilise la table locale et ne renvoie pas vers la production)
`
  },
  {
    id: "debogage",
    title: "Débogage et dépannage dans dbt",
    section: "Section 2 : Debugging data modeling errors",
    toth: "leçons 82, 87",
    weigel: "leçons 77 à 84",
    doc_url: "https://docs.getdbt.com/docs/build/troubleshooting",
    content: `# Débogage et dépannage dans dbt

## 1. Objectifs d'apprentissage
Diagnostiquer les erreurs de compilation, de syntaxe SQL et de connectivité.
Utiliser les commandes dbt debug et dbt compile pour isoler les défaillances.
Inspecter les fichiers de logs (dbt.log) et le code SQL compilé dans target/compiled/.
Identifier et résoudre les dépendances circulaires dans le DAG.

## 2. Explication claire : quand choisir quoi
Face à une erreur dans un projet dbt, la méthode de diagnostic suit une hiérarchie stricte :
1. **Erreur de connexion ou d'environnement** :
   Exécutez \`dbt debug\`. Cette commande vérifie la présence de \`dbt_project.yml\`, \`profiles.yml\`, les variables d'environnement, la connexion réseau et les autorisations de lecture/écriture sur l'entrepôt de données.
2. **Erreur Jinja ou de compilation** :
   Exécutez \`dbt compile --select mon_modele\`. Si le Jinja contient une variable manquante ou une syntaxe incorrecte, l'erreur s'affiche sans exécuter la moindre requête SQL sur la base.
3. **Erreur d'exécution SQL (syntaxe ou typage)** :
   Inspectez le fichier SQL compilé généré dans \`target/compiled/mon_projet/models/...\`. Vous y trouverez la requête SQL pure débarrassée de Jinja, prête à être copiée/collée dans la console de votre entrepôt pour analyse directe.
4. **Erreurs détaillées** :
   Consultez le fichier \`logs/dbt.log\` pour lire la trace complète des échanges entre le client dbt et la base.

## 3. Définitions des termes clés
- **dbt debug** : Commande de vérification de l'intégrité de la configuration et de la liaison avec le Data Warehouse.
- **target/compiled/** : Dossier contenant le code SQL résolu après interprétation de toutes les macros Jinja.
- **target/run/** : Dossier contenant les instructions DDL et DML complètes envoyées à la base (ex: \`CREATE TABLE AS ...\`).
- **Dépendance circulaire (Circular Dependency)** : Erreur de graphe survenant lorsque le modèle A fait un \`ref('B')\` alors que B fait un \`ref('A')\`. dbt refuse de démarrer.

## 4. Exemple concret
Inspection d'un problème SQL compilé :

\`\`\`bash
# 1. Tester la connexion
dbt debug

# 2. Compiler un modèle spécifique
dbt compile --select stg_utilisateurs

# 3. Afficher le SQL compilé sur Windows PowerShell
cat target/compiled/mon_projet/models/staging/stg_utilisateurs.sql
\`\`\`

## 5. Comparaisons et pièges d'examen
- **dbt compile contre dbt run** : \`dbt compile\` valide le code et génère le SQL dans \`target/\` sans rien exécuter ni créer dans la base de données. \`dbt run\` compile ET exécute la transformation sur l'entrepôt.
- **Piège de la dépendance circulaire** : Si une question d'examen mentionne une erreur au tout début de la compilation indiquant \`Found a cycle in the DAG\`, la cause est un renvoi mutuel de fonctions \`ref()\`.
- **Niveaux de logs** : Vous pouvez augmenter la verbosité en ligne de commande via \`--debug\` (ex: \`dbt --debug run\`).

## 6. Lien avec SQL, Snowflake et Databricks
- Permet d'isoler rapidement si une lenteur ou une erreur provient du moteur dbt lui-même (compilation locale) ou de la base Snowflake/Databricks (plan d'exécution, verrous, manque de mémoire).

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 82, 87
- Cours secondaire Weigel : leçons 77 à 84
- Documentation officielle : https://docs.getdbt.com/docs/build/troubleshooting (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande dbt teste la validité du fichier profiles.yml et la connectivité à l'entrepôt de données ? (Réponse : dbt debug)
2. Où trouve-t-on le code SQL compilé sans Jinja après avoir lancé dbt compile ? (Réponse : Dans le dossier target/compiled/)
3. Quelle anomalie de modélisation provoque l'erreur bloquante 'Found a cycle in the DAG' ? (Réponse : Une dépendance circulaire où deux modèles font mutuellement référence l'un à l'autre via ref())
`
  },
  {
    id: "dbt-show",
    title: "Commande dbt show",
    section: "Section 2 : Debugging data modeling errors",
    toth: "Non couvert dans Toth",
    weigel: "leçon 121",
    doc_url: "https://docs.getdbt.com/reference/commands/show",
    content: `# Commande dbt show

## 1. Objectifs d'apprentissage
Comprendre l'utilité et le fonctionnement de la commande dbt show introduite dans dbt Core 1.5.
Visualiser un aperçu instantané des résultats de transformation directement dans le terminal.
Utiliser dbt show avec du SQL ad-hoc sans créer de fichier de modèle persistant.
Contrôler le nombre de lignes prévisualisées via le flag --limit.

## 2. Explication claire : quand choisir quoi
Avant l'apparition de \`dbt show\`, pour voir le résultat d'un modèle dbt en cours d'écriture, les ingénieurs devaient compiler le modèle, copier le SQL depuis \`target/compiled/\` et le coller dans l'interface web de Snowflake ou Databricks.
- **dbt show** : Exécute la requête dans l'entrepôt et affiche directement un tableau ASCII des 5 premières lignes dans le terminal, sans créer ni modifier de vue ou de table physique dans la base de données.
- **Cas d'usage 1 : Vérification rapide d'un modèle** :
  \`dbt show --select mon_nouveau_modele\`
- **Cas d'usage 2 : Requête ad-hoc avec Jinja** :
  Grâce au paramètre \`--inline\`, vous pouvez tester une instruction SQL contenant des macros Jinja à la volée :
  \`dbt show --inline "select * from {{ ref('stg_orders') }} limit 10"\`

## 3. Définitions des termes clés
- **dbt show** : Commande CLI exécutant une requête et affichant le résultat tabulaire dans la console.
- **--inline "SQL"** : Option permettant de passer une requête SQL brute en ligne de commande sans fichier .sql.
- **--limit N** : Détermine le nombre maximal de lignes retournées et affichées (par défaut 5 lignes).

## 4. Exemple concret
Exécution de dbt show sur un modèle existant :

\`\`\`bash
# Affiche un aperçu des 5 premières lignes de fct_ventes
dbt show --select fct_ventes

# Affiche les 10 premières lignes d'une requête dynamique Jinja
dbt show --limit 10 --inline "select customer_id, sum(amount) from {{ ref('fct_orders') }} group by 1"
\`\`\`

Rendu dans le terminal :
\`\`\`text
| customer_id | sum(amount) |
|-------------|-------------|
| 1001        | 450.50      |
| 1002        | 120.00      |
| 1003        | 899.99      |
\`\`\`

## 5. Comparaisons et pièges d'examen
- **dbt show contre dbt compile** : \`dbt compile\` ne fait que générer le code SQL dans \`target/\` sans interroger les données. \`dbt show\` envoie la requête à l'entrepôt et ramène les résultats à l'écran.
- **dbt show contre dbt run** : \`dbt run\` crée ou remplace des tables/vues physiques dans la base. \`dbt show\` n'enregistre aucune table ni vue : il s'agit d'un simple SELECT éphémère d'aperçu.
- **Limite par défaut** : La limite par défaut de lignes affichées par \`dbt show\` est de 5 lignes.

## 6. Lien avec SQL, Snowflake et Databricks
- Exécute un \`SELECT\` avec clause \`LIMIT\` sur l'entrepôt, consommant un temps de calcul minimal pour un retour visuel immédiat.

## 7. Renvois aux cours et documentation
- Cours principal Toth : Non couvert
- Cours secondaire Weigel : leçon 121
- Documentation officielle : https://docs.getdbt.com/reference/commands/show (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel est le nombre par défaut de lignes retournées par la commande dbt show si le flag --limit n'est pas spécifié ? (Réponse : 5 lignes)
2. Quel paramètre permet d'exécuter une requête SQL ad-hoc directement depuis le terminal avec dbt show sans créer de fichier ? (Réponse : --inline)
3. Est-ce que dbt show crée une table ou une vue physique dans la base de données cible ? (Réponse : Non, aucune table ni vue n'est créée)
`
  },
  {
    id: "nouveautes-examen-2026",
    title: "Nouveautés de l'examen dbt 2026 et stratégie de passage",
    section: "Section 5 : Performance, optimization, and project maintenance",
    toth: "leçon 164",
    weigel: "leçons 3, 120, 129 à 130",
    doc_url: "https://docs.getdbt.com/docs/build/unit-tests",
    content: `# Nouveautés de l'examen dbt 2026 et stratégie de passage

## 1. Objectifs d'apprentissage
Connaître le format exact et les conditions de passage de la certification dbt Certified Developer.
Identifier les sujets majeurs récemment introduits dans le programme d'examen (unit tests, contrats, microbatch, mesh).
Maîtriser la gestion du temps pour les 65 questions en 120 minutes.
Appliquer les techniques d'élimination des réponses pièges.

## 2. Explication claire : quand choisir quoi
L'examen officiel dbt Certified Developer (programme 2026) évalue la capacité à concevoir, tester, déployer et maintenir des projets dbt Core et dbt Cloud en environnement d'entreprise.
- **Format de l'examen** :
  - Nombre de questions : 65 questions à choix simple ou multiple.
  - Durée : 120 minutes (environ 1 minute 50 par question).
  - Note de passage : 65 % (environ 43 bonnes réponses requises).
  - Modalité : En ligne surveillé ou centre de test agréé.
- **Évolution du programme d'examen en 2026** :
  Historiquement centré sur les bases (ref, source, materializations, tests génériques), l'examen intègre désormais les fonctionnalités avancées de gouvernance et de performance :
  1. **Unit tests** : Validation unitaire de la logique SQL avec données mockées sans toucher aux sources réelles.
  2. **Model contracts** : Imposition stricte des types de données et contraintes d'intégrité lors de la compilation.
  3. **dbt Mesh et gouvernance** : Niveaux d'accès (private, protected, public), groupes et versions de modèles.
  4. **Microbatch et optimisation** : Stratégie incrémentale par fenêtres d'horodatage, flags \`--empty\` et \`--sample\`.
  5. **Slim CI et sélection fine** : Combinaison de \`state:modified+\` et \`--defer\` pour l'automatisation CI/CD.

## 3. Définitions des termes clés
- **dbt Certified Developer** : Titre officiel certifiant l'expertise dbt sur les standards de l'industrie.
- **Flag for review** : Fonctionnalité de l'interface d'examen permettant de marquer les questions incertaines pour y revenir en fin d'épreuve.
- **Single vs Multiple select** : Attention, les questions à choix multiple indiquent explicitement le nombre d'options attendues (ex: "Sélectionnez 2 réponses").

## 4. Exemple concret
Plan de gestion du temps recommandé pour les 120 minutes :

\`\`\`text
Phase 1 (0 à 75 min) : Premier passage rapide sur les 65 questions.
- Répondre immédiatement aux questions évidentes.
- En cas d'hésitation, éliminer les réponses absurdes, choisir la meilleure option et marquer la question (Flag).
- Viser un rythme de 1 minute 10 par question.

Phase 2 (75 à 110 min) : Deuxième passage sur les questions marquées (Flag).
- Relire attentivement le contexte et le code YAML/SQL.
- Vérifier les détails de syntaxe (deux-points, tirets, guillemets).

Phase 3 (110 à 120 min) : Relecture finale et soumission.
- S'assurer qu'aucune question n'a été laissée sans réponse (aucune pénalité pour mauvaise réponse).
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Attention au vocabulaire trompeur** : Ne confondez pas un test unitaire (\`unit_test\`) qui valide la logique SQL en amont, avec un test de données (\`singular / generic data test\`) qui valide l'état réel des tables dans la base.
- **Piège de syntaxe YAML** : Beaucoup de questions piègent sur l'indentation ou le placement d'une directive (par exemple placer \`contract:\` sous \`config:\` ou sous la racine du modèle).
- **Pas de pénalité de points négatifs** : Ne laissez jamais une question vierge.

## 6. Lien avec SQL, Snowflake et Databricks
- L'examen dbt teste la logique agnostique de dbt Core, mais les concepts (MERGE, Zero-Copy clone, rôles) s'appliquent directement sur Snowflake et Databricks.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçon 164
- Cours secondaire Weigel : leçons 3, 120, 129 à 130
- Documentation officielle : https://docs.getdbt.com/docs/build/unit-tests (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Combien de temps dure l'examen dbt Certified Developer et combien de questions comporte-t-il ? (Réponse : 120 minutes pour 65 questions)
2. Quel est le seuil approximatif de réussite à l'examen dbt ? (Réponse : 65 %)
3. Quelles sont les nouvelles fonctionnalités de gouvernance fréquemment testées dans le programme 2026 ? (Réponse : Les tests unitaires, les contrats de modèles, les niveaux d'accès public/privé, les versions de modèles et la stratégie microbatch)
`
  },
  {
    id: "fusion",
    title: "dbt Fusion et architectures d'entreprise",
    section: "Section 5 : Performance, optimization, and project maintenance",
    toth: "leçons 124 à 137",
    weigel: "Non couvert dans Weigel",
    doc_url: "https://docs.getdbt.com",
    content: `# dbt Fusion et architectures d'entreprise

## 1. Objectifs d'apprentissage
Comprendre l'évolution vers dbt Fusion et la convergence de l'orchestration, de la modélisation et du catalogue sémantique.
Appréhender la couche sémantique (dbt Semantic Layer) et les métriques métier unifiées.
Distinguer le périmètre de l'examen dbt Core des fonctionnalités avancées de la plateforme Cloud.
Positionner dbt au cœur d'une architecture moderne de données (Modern Data Stack).

## 2. Explication claire : quand choisir quoi
À mesure que les organisations data grandissent, la simple transformation SQL par lots devient insuffisante. dbt a étendu ses capacités pour répondre aux besoins d'alignement d'entreprise :
- **dbt Core vs dbt Cloud / Fusion** :
  - **dbt Core** : Moteur open source en ligne de commande centré sur la compilation, l'exécution et le test des modèles SQL et Python. C'est le cœur technique évalué par l'examen.
  - **dbt Semantic Layer (Couche sémantique)** : Permet de définir les métriques métier critiques (ex: Chiffre d'affaires récurrent mensuel MRR, Coût d'acquisition client) une seule fois dans dbt en YAML, et de les consommer de façon cohérente dans tous les outils de BI (Tableau, PowerBI, Hex) via une API standardisée.
  - **dbt Explorer** : Catalogue de données interactif offrant un graphe de lignage visuel au niveau colonne (Column-Level Lineage) et le suivi des performances d'exécution dans le temps.
- **Règle d'or pour l'examen** : Bien que ces fonctionnalités soient présentées dans les cours avancés de Toth, l'examen officiel porte en priorité sur la syntaxe, la gouvernance et le fonctionnement de dbt Core.

## 3. Définitions des termes clés
- **Semantic Layer** : Couche d'abstraction centralisant la logique des métriques et dimensions pour garantir des chiffres identiques entre tous les départements.
- **MetricFlow** : Moteur sémantique sous-jacent à dbt convertissant les définitions de métriques YAML en requêtes SQL d'agrégation hautement optimisées.
- **Column-Level Lineage** : Capacité à tracer l'origine et la transformation d'une colonne précise de la source brute jusqu'au rapport final.

## 4. Exemple concret
Définition conceptuelle d'une métrique sémantique dans models/marts/metrics.yml :

\`\`\`yaml
version: 2

semantic_models:
  - name: commandes_semantiques
    model: ref('fct_commandes')
    defaults:
      agg_time_dimension: date_commande
    entities:
      - name: commande
        type: primary
        key: id_commande
      - name: client
        type: foreign
        key: id_client
    dimensions:
      - name: date_commande
        type: time
        type_params:
          time_granularity: day
      - name: statut
        type: categorical
    measures:
      - name: total_montant
        agg: sum
        expr: montant_ht

metrics:
  - name: chiffre_affaires_total
    description: "Somme totale des montants hors taxes des commandes validées"
    type: simple
    type_params:
      measure: total_montant
    filter: |
      {{ Dimension('commande__statut') }} = 'termine'
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Périmètre d'examen** : Si une question porte sur un module payant ou propriétaire non disponible dans dbt Core, analysez s'il s'agit d'un concept général (comme la gouvernance multi-projets) ou d'une interface dbt Cloud. L'examen teste la syntaxe dbt standard.
- **Métriques contre vues classiques** : Une vue SQL précalcule une agrégation à un niveau fixe. Une métrique sémantique s'adapte dynamiquement aux dimensions demandées par l'utilisateur BI.

## 6. Lien avec SQL, Snowflake et Databricks
- La couche sémantique pousse les calculs compilés vers Snowflake ou Databricks sans extraire les données, maintenant la conformité et la performance.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 124 à 137
- Cours secondaire Weigel : Non couvert
- Documentation officielle : https://docs.getdbt.com (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel est l'objectif premier de la couche sémantique (dbt Semantic Layer) ? (Réponse : Définir les métriques métier une seule fois pour garantir la cohérence des chiffres dans tous les outils de restitution)
2. Quel moteur open source sous-jacent propulse la couche sémantique de dbt ? (Réponse : MetricFlow)
3. Quelle fonctionnalité de métadonnées permet de suivre le parcours d'un attribut de données spécifique à travers l'ensemble des transformations ? (Réponse : Le lignage au niveau colonne, ou Column-Level Lineage)
`
  }
];

console.log(`Writing ${chaptersPart2.length} chapters (Part 2)...`);
for (const chap of chaptersPart2) {
  const filePath = path.join(CHAPTERS_DIR, `${chap.id}.md`);
  const sanitizedContent = cleanEmDashes(chap.content.trim() + '\n');
  fs.writeFileSync(filePath, sanitizedContent, 'utf-8');
  console.log(`Saved: ${chap.id}.md`);
}
