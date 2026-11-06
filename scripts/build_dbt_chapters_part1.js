import fs from 'node:fs';
import path from 'node:path';
import { cleanEmDashes } from './question_builder.js';

const CHAPTERS_DIR = path.join(process.cwd(), 'content', 'certifications', 'dbt', 'chapters');

const chaptersPart1 = [
  {
    id: "modeles-materialisations",
    title: "Modèles et matérialisations dbt",
    section: "Section 1 : Developing dbt models",
    toth: "leçons 16 à 27",
    weigel: "leçons 16 à 28",
    doc_url: "https://docs.getdbt.com/docs/build/materializations",
    content: `# Modèles et matérialisations dbt

## 1. Objectifs d'apprentissage
Comprendre les quatre principales matérialisations natives de dbt (view, table, incremental, ephemeral).
Maîtriser la syntaxe du bloc de configuration \`config()\` dans les fichiers de modèles SQL et dans le fichier \`dbt_project.yml\`.
Identifier la stratégie de matérialisation optimale selon la volumétrie, le coût de calcul et la fraîcheur exigée.
Éviter les pièges d'examen relatifs à la persistance physique et aux dépendances de code.

## 2. Explication claire : quand choisir quoi
dbt transforme les données dans le Data Warehouse via des instructions \`SELECT\` pures. La façon dont ce \`SELECT\` est exécuté et persisté dépend de la stratégie de matérialisation :
- **View (vue)** : Matérialisation par défaut. Idéale pour les modèles de staging et les transformations légères. Avantage : zéro coût de stockage, données toujours fraîches à la lecture. Inconvénient : requêtes lentes si la transformation est complexe.
- **Table** : Crée une table physique (\`CREATE TABLE AS SELECT\`). Recommandée pour les marts de données consommés par les outils de Business Intelligence et les modèles intermédiaires complexes. Avantage : requêtes ultra-rapides pour les analystes. Inconvénient : temps de reconstruction complet à chaque exécution.
- **Incremental** : Met à jour uniquement les nouvelles lignes ou les lignes modifiées. Indispensable sur les gros volumes de données (logs, événements IoT, transactions).
- **Ephemeral** : Ne crée aucun objet dans l'entrepôt. Le code SQL est interpolé comme une expression de table commune (CTE \`WITH ... AS\`) dans les modèles dépendants qui y font référence. Recommandé pour des modules de calcul très légers partagés par peu de modèles.

## 3. Définitions des termes clés
- **Modèle dbt** : Fichier contenant une unique instruction \`SELECT\` enregistrée dans le dossier \`models/\`.
- **DAG (Directed Acyclic Graph)** : Graphe orienté acyclique construit automatiquement par dbt en résolvant les fonctions \`ref()\` et \`source()\`.
- **Target database / schema** : Emplacement cible configuré dans \`profiles.yml\` où les tables et vues sont créées physiquement.

## 4. Exemple concret
Configuration locale d'une table dans un modèle SQL :

\`\`\`sql
-- models/marts/fct_orders.sql
{{ config(
    materialized='table',
    tags=['finance', 'daily']
) }}

with orders as (
    select * from {{ ref('stg_orders') }}
)
select
    order_id,
    customer_id,
    order_date,
    amount
from orders
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Piège dbt run et ephemeral** : Vous ne pouvez pas exécuter \`dbt run --select mon_modele_ephemeral\`. Comme il ne crée rien dans la base de données, dbt lève un avertissement ou une erreur.
- **Vues contre Tables** : À l'examen, si la question mentionne des utilisateurs finaux souffrant de lenteurs de tableaux de bord BI, la réponse est de passer d'une vue à une table.
- **Ordre de préséance des configurations** : La configuration dans le fichier SQL individuel (\`config()\`) prévaut toujours sur la configuration générale déclarée dans \`dbt_project.yml\`.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, une matérialisation \`table\` exécute un \`CREATE OR REPLACE TABLE\`, consommant des crédits d'entrepôt virtuel (Warehouse) lors du build.
- Dans **Databricks**, dbt crée des tables Delta Lake ou des vues Spark SQL gérées par Unity Catalog.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 16 à 27
- Cours secondaire Weigel : leçons 16 à 28
- Documentation officielle : https://docs.getdbt.com/docs/build/materializations (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle matérialisation n'enregistre aucun objet persistant dans l'entrepôt de données ? (Réponse : Ephemeral)
2. Quel fichier de configuration a la priorité la plus forte sur la matérialisation d'un modèle ? (Réponse : Le bloc config() dans le modèle SQL lui-même)
3. Quelle est la matérialisation par défaut dans dbt si aucune directive n'est fournie ? (Réponse : View)
`
  },
  {
    id: "sources-fraicheur",
    title: "Sources, seeds et fraîcheur des sources",
    section: "Section 1 : Developing dbt models",
    toth: "leçons 28 à 32",
    weigel: "leçons 15, 43, 52, 115",
    doc_url: "https://docs.getdbt.com/docs/build/sources",
    content: `# Sources, seeds et fraîcheur des sources

## 1. Objectifs d'apprentissage
Déclarer des tables sources externes dans les fichiers YAML du projet dbt.
Exploiter la macro \`source()\` pour lier les tables brutes au graphe de lignage (DAG).
Surveiller la régularité des chargements de données avec \`dbt source freshness\`.
Gérer des fichiers de référence statiques via les seeds (\`dbt seed\`).

## 2. Explication claire : quand choisir quoi
- **Sources** : Données brutes chargées par des outils d'ingestion externes (Fivetran, Airbyte, Kafka, DMS). Elles sont déclarées dans des fichiers YAML sous la clé \`sources:\`. Elles ne sont jamais créées ni modifiées par dbt : dbt ne fait que les lire.
- **Seeds** : Fichiers CSV statiques placés dans le dossier \`seeds/\` et chargés dans l'entrepôt par la commande \`dbt seed\`. Idéal pour des tables de correspondances légères (codes postaux, mapping de devises, listes de pays). **Attention** : les seeds ne conviennent pas pour les gros volumes ou les données fréquemment modifiées.
- **Source Freshness** : Permet de vérifier si le processus d'ingestion en amont respecte ses SLA en comparant le timestamp de la colonne la plus récente avec l'heure courante.

## 3. Définitions des termes clés
- **Macro source()** : Fonction Jinja remplaçant les noms de tables brutes codés en dur par une référence traçable dans le catalogue.
- **loaded_at_field** : Colonne temporelle (ex: \`loaded_at\`, \`created_at\`) utilisée pour évaluer la fraîcheur des données.
- **warn_after / error_after** : Seuils de tolérance temporels (heures, jours) déclenchant des avertissements ou des erreurs lors du test de fraîcheur.

## 4. Exemple concret
Déclaration d'une source et de ses règles de fraîcheur :

\`\`\`yaml
version: 2

sources:
  - name: shopify
    database: raw_data
    schema: shopify_landing
    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}
    loaded_at_field: _loaded_at
    tables:
      - name: orders
      - name: customers
\`\`\`

Requête dans le modèle de staging :
\`\`\`sql
select id, amount from {{ source('shopify', 'orders') }}
\`\`\`

Commande de vérification :
\`\`\`bash
dbt source freshness
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Source contre Ref** : On utilise \`source('source_name', 'table_name')\` pour des tables externes brutes, et \`ref('model_name')\` pour référencer d'autres modèles gérés par dbt.
- **Seeds contre Données volumineuses** : Ne jamais utiliser \`dbt seed\` pour charger des fichiers de données transactionnelles de plusieurs centaines de mégaoctets. Les seeds sont réservés aux données de référence statiques.
- **dbt run n'exécute pas source freshness** : La commande \`dbt run\` ne vérifie pas la fraîcheur des sources. Il faut explicitement exécuter \`dbt source freshness\`.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, les sources pointent vers les schémas de landing alimentés par Snowpipe ou des tables externes.
- Les seeds sont convertis en tables physiques dans Snowflake avec les types de colonnes inférés ou configurés dans \`dbt_project.yml\`.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 28 à 32
- Cours secondaire Weigel : leçons 15, 43, 52, 115
- Documentation officielle : https://docs.getdbt.com/docs/build/sources (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande permet d'évaluer le respect des SLA d'ingestion sur les tables externes ? (Réponse : dbt source freshness)
2. Quel type de fichier est utilisé pour stocker les seeds dans dbt ? (Réponse : Fichiers CSV)
3. Comment référence-t-on la table 'users' de la source 'stripe' dans un modèle ? (Réponse : {{ source('stripe', 'users') }})
`
  },
  {
    id: "snapshots",
    title: "Snapshots et historisation SCD Type 2",
    section: "Section 1 : Developing dbt models",
    toth: "leçons 33 à 36",
    weigel: "leçons 122 à 124",
    doc_url: "https://docs.getdbt.com/docs/build/snapshots",
    content: `# Snapshots et historisation SCD Type 2

## 1. Objectifs d'apprentissage
Comprendre le principe du Slow Changing Dimension Type 2 (SCD2) appliqué par les snapshots dbt.
Configurer les deux stratégies de détection de changements : stratégie \`timestamp\` et stratégie \`check\`.
Interpréter et exploiter les colonnes de métadonnées générées automatiquement par dbt.
Éviter les erreurs d'invalidation et de clés primaires dans la conception des snapshots.

## 2. Explication claire : quand choisir quoi
Les systèmes source écrasent souvent les données lors des mises à jour (ex: l'adresse d'un client dans une table relationnelle). Pour conserver l'historique de chaque état, dbt utilise des snapshots :
- **Stratégie timestamp** : Recommandée et privilégiée. Elle s'appuie sur une colonne horodatée fiable du système source (ex: \`updated_at\`) qui change à chaque modification de la ligne.
- **Stratégie check** : À utiliser uniquement si le système source ne propose pas de colonne de date de mise à jour. dbt compare les valeurs d'une liste de colonnes spécifiées (\`check_cols: ['status', 'email']\`) ou de toutes les colonnes (\`check_cols: 'all'\`).

## 3. Définitions des termes clés
- **SCD Type 2** : Méthode d'entrepôt de données qui historise chaque modification en fermant l'ancienne ligne et en insérant une nouvelle ligne avec de nouvelles dates de validité.
- **dbt_valid_from / dbt_valid_to** : Colonnes ajoutées par dbt indiquant l'intervalle de temps pendant lequel la version de l'enregistrement était active.
- **dbt_scd_id** : Clé de substitution unique générée par hachage de la clé primaire et de la date de validité.

## 4. Exemple concret
Déclaration d'un snapshot dans le dossier \`snapshots/orders_snapshot.sql\` :

\`\`\`sql
{% snapshot orders_snapshot %}

{{
    config(
      target_database='analytics',
      target_schema='snapshots',
      unique_key='id',
      strategy='timestamp',
      updated_at='updated_at',
      invalidate_hard_deletes=True
    )
}}

select * from {{ source('ecommerce', 'orders') }}

{% endsnapshot %}
\`\`\`

Commande d'exécution :
\`\`\`bash
dbt snapshot
\`\`\`

## 5. Comparaisons et pièges d'examen
- **dbt_valid_to null** : Pour la version active actuelle d'un enregistrement, la valeur de \`dbt_valid_to\` est \`NULL\`. C'est un point classique d'examen pour filtrer l'état courant (\`WHERE dbt_valid_to IS NULL\`).
- **unique_key obligatoire** : Une clé primaire ou composite unique est strictement obligatoire pour que dbt sache quelle ligne suivre.
- **Hard deletes** : Par défaut, si une ligne disparaît du système source, dbt ne modifie pas le snapshot. Pour fermer la validité des lignes supprimées, il faut activer \`invalidate_hard_deletes=True\`.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, les snapshots exploitent des requêtes de type \`MERGE\` optimisées.
- Cette approche remplace avantageusement les flux complexes de CDC faits main en écrivant directement une table historisée exploitable en SQL.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 33 à 36
- Cours secondaire Weigel : leçons 122 à 124
- Documentation officielle : https://docs.getdbt.com/docs/build/snapshots (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle est la valeur de la colonne dbt_valid_to pour la ligne actuellement active d'un client ? (Réponse : NULL)
2. Quelle stratégie de snapshot est recommandée si la source dispose d'une colonne updated_at fiable ? (Réponse : Stratégie timestamp)
3. Quel paramètre permet d'invalider une ligne lorsque celle-ci est physiquement effacée de la source ? (Réponse : invalidate_hard_deletes=True)
`
  },
  {
    id: "tests",
    title: "Tests génériques, singuliers et niveaux de sévérité",
    section: "Section 3 : Testing, documenting, and publishing dbt models",
    toth: "leçons 37 à 43, 46 à 48",
    weigel: "leçons 104 à 109, 111, 112, 116",
    doc_url: "https://docs.getdbt.com/docs/build/data-tests",
    content: `# Tests génériques, singuliers et niveaux de sévérité

## 1. Objectifs d'apprentissage
Comprendre le fonctionnement du moteur de test de dbt et la règle fondamentale d'échec (0 ligne renvoyée = succès).
Maîtriser les 4 tests génériques natifs : unique, not_null, accepted_values, relationships.
Développer des tests singuliers sur mesure dans le dossier \`tests/\`.
Configurer les niveaux de sévérité (\`warn\` et \`error\`) et les seuils de tolérance.

## 2. Explication claire : quand choisir quoi
dbt propose deux catégories complémentaires de tests de données (Data Tests) :
- **Tests génériques (Generic Tests)** : Déclarés dans les fichiers YAML sous la clé \`data_tests:\`. Ils appliquent des assertions prédéfinies sur une colonne (ex: pas de doublons, valeurs autorisées). Les 4 tests intégrés par défaut sont \`unique\`, \`not_null\`, \`accepted_values\`, et \`relationships\`. Des packages comme \`dbt-expectations\` en ajoutent des dizaines d'autres.
- **Tests singuliers (Singular Tests)** : Requêtes SQL personnalisées stockées dans des fichiers \`.sql\` du dossier \`tests/\`. À utiliser lorsque la logique de validation est spécifique au métier et fait intervenir des jointures complexes ou des calculs multi-colonnes.

## 3. Définitions des termes clés
- **Règle d'or d'un test dbt** : Un test est une requête \`SELECT\` qui renvoie les enregistrements qui ne respectent PAS la règle. Si la requête renvoie 0 ligne, le test réussit (PASS). Si elle renvoie 1 ligne ou plus, le test échoue (FAIL).
- **Severity** : Niveau de criticité d'un test (\`warn\` affiche un message sans bloquer le pipeline, \`error\` stoppe l'exécution ou marque le job en échec).
- **Store failures** : Configuration permettant de conserver les lignes fautives dans une table dédiée de l'entrepôt pour faciliter le débogage.

## 4. Exemple concret
Configuration dans le fichier YAML :

\`\`\`yaml
version: 2

models:
  - name: fct_orders
    columns:
      - name: order_id
        data_tests:
          - unique
          - not_null
      - name: status
        data_tests:
          - accepted_values:
              values: ['placed', 'shipped', 'delivered', 'returned']
              config:
                severity: warn
      - name: customer_id
        data_tests:
          - relationships:
              to: ref('dim_customers')
              field: customer_id
\`\`\`

Test singulier dans \`tests/assert_order_total_positive.sql\` :
\`\`\`sql
-- Renvoie les commandes dont le montant total est négatif (lignes en échec)
select
    order_id,
    total_amount
from {{ ref('fct_orders') }}
where total_amount < 0
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Que renvoie un test réussi ?** À l'examen, souvenez-vous impérativement qu'un test qui passe renvoie zéro enregistrement. S'il renvoie des lignes, ce sont les rejets.
- **Relationships et intégrité référentielle** : Le test \`relationships\` identifie les clés étrangères orphelines (valeurs présentes dans la table de faits mais introuvables dans la table de dimension).
- **Seuils d'alerte** : On peut tolérer un nombre absolu d'échecs (\`warn_if: ">10"\`) avant de déclencher l'alerte.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, chaque test génère une sous-requête exécutée sur votre entrepôt virtuel. Grouper ou cibler les tests (\`dbt test --select tag:daily\`) permet de maîtriser les coûts de crédits.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 37 à 43, 46 à 48
- Cours secondaire Weigel : leçons 104 à 109, 111, 112, 116
- Documentation officielle : https://docs.getdbt.com/docs/build/data-tests (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel résultat d'une requête SQL de test indique que la validation est un succès total ? (Réponse : 0 ligne renvoyée)
2. Quels sont les 4 tests génériques inclus nativement dans dbt Core ? (Réponse : unique, not_null, accepted_values, relationships)
3. Comment exécuter uniquement les tests associés au modèle dim_customers ? (Réponse : dbt test --select dim_customers)
`
  },
  {
    id: "tests-unitaires",
    title: "Tests unitaires dans dbt (Unit Tests)",
    section: "Section 3 : Testing, documenting, and publishing dbt models",
    toth: "leçon 44",
    weigel: "leçon 110",
    doc_url: "https://docs.getdbt.com/docs/build/unit-tests",
    content: `# Tests unitaires dans dbt (Unit Tests)

## 1. Objectifs d'apprentissage
Comprendre la différence fondamentale entre un test de données (Data Test) et un test unitaire (Unit Test).
Déclarer des tests unitaires dans les fichiers YAML pour valider la logique de calcul dbt.
Créer des jeux de données d'entrée factices (mock data) pour simuler des cas aux limites.
Intégrer les tests unitaires dans un workflow de développement rapide et d'intégration continue.

## 2. Explication claire : quand choisir quoi
- **Data Tests** : Testent les données réelles de l'entrepôt. Ils répondent à la question : "Les données chargées aujourd'hui contiennent-elles des anomalies (doublons, valeurs nulles) ?".
- **Unit Tests** : Testent la logique SQL du modèle indépendamment des données de production. Ils répondent à la question : "Mon code SQL calcule-t-il correctement le résultat attendu pour un jeu d'entrée donné ?". Les tests unitaires permettent d'isoler des règles métier complexes (calcul de TVA, tranches d'âge, règles de déduplication) en injectant de faux enregistrements (mocked inputs) et en comparant le résultat au résultat théorique attendu.

## 3. Définitions des termes clés
- **Mock data** : Données fictives définies directement en YAML ou dans un fichier CSV seed utilisées exclusivement pour l'exécution du test.
- **given** : Bloc YAML spécifiant les entrées fictives associées à chaque \`ref()\` ou \`source()\` utilisé dans le modèle.
- **expect** : Bloc YAML déclarant les lignes exactes que le modèle doit produire.

## 4. Exemple concret
Déclaration d'un test unitaire dans \`models/marts/schema.yml\` :

\`\`\`yaml
unit_tests:
  - name: test_calcul_remise_fidelite
    model: fct_commandes
    given:
      - input: ref('stg_clients')
        rows:
          - {client_id: 1, points_fidelite: 150}
          - {client_id: 2, points_fidelite: 20}
      - input: ref('stg_commandes')
        rows:
          - {commande_id: 101, client_id: 1, montant_brut: 100.0}
          - {commande_id: 102, client_id: 2, montant_brut: 100.0}
    expect:
      rows:
        - {commande_id: 101, montant_net: 90.0}
        - {commande_id: 102, montant_net: 100.0}
\`\`\`

Commande d'exécution :
\`\`\`bash
dbt test --select test_type:unit
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Performance** : Les tests unitaires sont très rapides car ils ne scannent aucune table de production, s'exécutant sur de petites tables temporaires en mémoire.
- **Nouveauté examen 2026** : Les Unit Tests constituent un sujet d'examen très récent. Souvenez-vous qu'ils s'exécutent avec \`dbt test\` et peuvent être ciblés avec le sélecteur \`test_type:unit\`.
- **Cas d'usage typique** : Utiliser un test unitaire lors du refactoring d'un modèle complexe pour garantir la non-régression de la logique métier.

## 6. Lien avec SQL, Snowflake et Databricks
- Les tests unitaires génèrent des clauses \`SELECT ... UNION ALL\` virtuelles simulant les tables en amont directement dans le dialecte SQL de votre entrepôt (Snowflake, BigQuery, Databricks).

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçon 44
- Cours secondaire Weigel : leçon 110
- Documentation officielle : https://docs.getdbt.com/docs/build/unit-tests (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande permet d'exécuter uniquement les tests unitaires du projet ? (Réponse : dbt test --select test_type:unit)
2. Quel mot-clé YAML définit les lignes attendues produites par le modèle dans un test unitaire ? (Réponse : expect)
3. Quel est l'avantage principal des tests unitaires par rapport aux tests de données classiques ? (Réponse : Ils valident la logique SQL sur des données simulées sans dépendre des données de production)
`
  },
  {
    id: "contrats-contraintes",
    title: "Contrats de modèle et contraintes de schéma",
    section: "Section 1 : Developing dbt models",
    toth: "leçons 45, 49",
    weigel: "leçons 68 à 70",
    doc_url: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts",
    content: `# Contrats de modèle et contraintes de schéma

## 1. Objectifs d'apprentissage
Comprendre l'intérêt des contrats de modèle (Model Contracts) pour la gouvernance et le Data Mesh.
Définir formellement les colonnes, les types de données et les contraintes obligatoires.
Distinguer les contraintes logiques dbt des contraintes physiques appliquées par le Warehouse.
Gérer les changements de structure et garantir la stabilité des APIs de données.

## 2. Explication claire : quand choisir quoi
Historiquement, dbt fonctionnait sur le principe de la liberté de schéma : le SQL déterminait les colonnes de sortie sans validation préalable. Les contrats de modèle inversent ce paradigme :
- Lorsqu'un contrat est imposé (\`contract: {enforced: true}\`), dbt valide avant l'exécution que la requête SQL renvoie rigoureusement la liste déclarée des colonnes avec leurs types exacts.
- Si une colonne est ajoutée, retirée ou si son type diffère de la spécification YAML, le build échoue immédiatement avant de modifier la table dans l'entrepôt.
- Recommandé pour les modèles exposés publiquement à d'autres équipes ou à des applications opérationnelles critiques.

## 3. Définitions des termes clés
- **Model Contract** : Accord formel déclarant les colonnes, leurs types et leurs contraintes qu'un modèle s'engage à respecter.
- **Contraintes supportées** : \`not_null\`, \`unique\`, \`primary_key\`, \`foreign_key\`, \`check\`.
- **Enforced** : Propriété booléenne activant la vérification stricte du contrat par le compilateur dbt.

## 4. Exemple concret
Configuration d'un modèle sous contrat dans son fichier YAML :

\`\`\`yaml
version: 2

models:
  - name: dim_utilisateurs
    config:
      contract:
        enforced: true
    columns:
      - name: user_id
        data_type: integer
        constraints:
          - type: not_null
          - type: primary_key
      - name: email
        data_type: varchar
        constraints:
          - type: not_null
      - name: cree_le
        data_type: timestamp
\`\`\`

Si le fichier \`dim_utilisateurs.sql\` omet la colonne \`email\` ou renvoie \`user_id\` sous forme de chaîne de caractères, la commande \`dbt run\` échoue avant toute écriture.

## 5. Comparaisons et pièges d'examen
- **Contrat contre Test not_null** : Un test \`not_null\` s'exécute après la construction de la table et n'empêche pas l'écriture. Une contrainte de contrat \`not_null\` est appliquée lors de la création de la table (DDL) ou avant l'écriture.
- **Toutes les colonnes doivent être listées** : Si le SELECT du modèle produit 10 colonnes mais que le YAML n'en décrit que 9, le contrat échoue. Chaque colonne renvoyée doit figurer dans le contrat.
- **Support selon les entrepôts** : Les contraintes comme \`primary_key\` sont déclaratives dans Snowflake, mais vérifiées physiquement dans PostgreSQL.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, dbt injecte les contraintes déclaratives dans l'instruction DDL (\`CREATE TABLE ... CONSTRAINT PRIMARY KEY\`), ce qui aide l'optimiseur de requêtes à concevoir de meilleurs plans d'exécution.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 45, 49
- Cours secondaire Weigel : leçons 68 à 70
- Documentation officielle : https://docs.getdbt.com/docs/collaborate/govern/model-contracts (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle directive YAML active la validation stricte d'un contrat de modèle ? (Réponse : contract: {enforced: true})
2. Qu'arrive-t-il lors du dbt run si un modèle sous contrat renvoie une colonne non décrite dans le fichier YAML ? (Réponse : Le build échoue immédiatement avec une erreur de contrat)
3. Les types de données des colonnes (data_type) sont-ils obligatoires lorsqu'un contrat est actif ? (Réponse : Oui, chaque colonne sous contrat doit déclarer son data_type)
`
  },
  {
    id: "jinja-macros",
    title: "Jinja et macros dans dbt",
    section: "Section 1 : Developing dbt models",
    toth: "leçons 50 à 56",
    weigel: "leçons 33 à 38",
    doc_url: "https://docs.getdbt.com/docs/build/jinja-macros",
    content: `# Jinja et macros dans dbt

## 1. Objectifs d'apprentissage
Maîtriser les trois délimiteurs Jinja essentiels de dbt : expressions, instructions et commentaires.
Développer des macros réutilisables dans le dossier \`macros/\`.
Exploiter les macros intégrées dbt (\`ref()\`, \`source()\`, \`config()\`, \`adapter\`).
Utiliser la macro \`run_query\` pour exécuter du SQL dynamique au moment de la compilation.

## 2. Explication claire : quand choisir quoi
dbt combine le SQL standard avec le moteur de templating Jinja. Cela permet de rendre le code SQL modulaire et d'éviter les copier-coller répétitifs (principe DRY : Don't Repeat Yourself) :
- **Délimiteur d'expression \`{{ ... }}\`** : Affiche du texte compilé dans le SQL (appels de macros, variables, fonctions \`ref()\`).
- **Délimiteur d'instruction \`{% ... %}\`** : Gère la logique de contrôle de flux (boucles \`for\`, conditions \`if/else\`, assignation de variables avec \`set\`).
- **Délimiteur de commentaire \`{# ... #}\`** : Commentaires Jinja ignorés à la compilation et non transmis au Data Warehouse.

## 3. Définitions des termes clés
- **Macro** : Fonction Jinja réutilisable acceptant des arguments et retournant du code SQL compilé, stockée dans \`macros/\`.
- **Target context** : Objet Jinja contenant des métadonnées d'exécution (\`target.name\`, \`target.schema\`).
- **Adapter** : Objet permettant d'écrire du code multi-entrepôts s'adaptant au dialecte SQL de la cible (\`adapter.dispatch\`).

## 4. Exemple concret
Création d'une macro dans \`macros/cents_to_dollars.sql\` :

\`\`\`sql
{% macro cents_to_dollars(column_name, decimal_places=2) -%}
    round(cast({{ column_name }} as numeric) / 100, {{ decimal_places }})
{%- endmacro %}
\`\`\`

Utilisation dans un modèle :
\`\`\`sql
select
    order_id,
    {{ cents_to_dollars('order_total_cents') }} as order_total_usd
from {{ ref('stg_payments') }}
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Compilation avant exécution** : Le moteur Jinja s'exécute sur le poste ou le serveur dbt lors de la compilation; il ne s'exécute pas dans l'entrepôt. Le résultat compilé envoyé au Warehouse est du pur SQL.
- **run_query et parsing** : Lorsqu'on utilise la macro \`run_query()\`, il faut toujours encapsuler l'appel dans \`{% if execute %}\` pour éviter que dbt tente d'exécuter la requête lors de la phase initiale d'analyse (parsing).
- **Tirets dans les balises \`{%- ... -%}\`** : Ils servent à supprimer les espaces et retours à la ligne superflus pour produire un code SQL propre.

## 6. Lien avec SQL, Snowflake et Databricks
- Les macros permettent d'abstraire les fonctions spécifiques aux dialectes (ex: différences de syntaxe de manipulation des dates entre Snowflake \`DATEADD\` et BigQuery \`DATE_ADD\`).

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 50 à 56
- Cours secondaire Weigel : leçons 33 à 38
- Documentation officielle : https://docs.getdbt.com/docs/build/jinja-macros (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel délimiteur Jinja permet d'afficher la valeur d'une variable ou le résultat d'une macro ? (Réponse : {{ ... }})
2. Pourquoi doit-on utiliser la condition {% if execute %} autour d'une macro exécutant du SQL ? (Réponse : Pour ne l'exécuter que lors de l'exécution réelle et non pendant la phase de parsing initiale)
3. Où sont obligatoirement enregistrées les macros créées par l'utilisateur ? (Réponse : Dans le dossier macros/ du projet)
`
  },
  {
    id: "packages",
    title: "Gestion des packages dbt",
    section: "Section 1 : Developing dbt models",
    toth: "leçon 57",
    weigel: "leçons 53 à 56",
    doc_url: "https://docs.getdbt.com/docs/build/packages",
    content: `# Gestion des packages dbt

## 1. Objectifs d'apprentissage
Comprendre l'écosystème des bibliothèques réutilisables dbt (dbt Hub et dépôts Git).
Déclarer les dépendances de packages dans \`packages.yml\` ou \`dependencies.yml\`.
Installer et mettre à jour les packages avec la commande \`dbt deps\`.
Exploiter les packages incontournables de la communauté (\`dbt_utils\`, \`codegen\`).

## 2. Explication claire : quand choisir quoi
Les packages dbt sont des projets dbt autonomes contenant des modèles, des macros et des tests que vous pouvez importer dans votre propre projet :
- **Packages de macros utilitaires (ex: \`dbt-labs/dbt_utils\`)** : Fournissent des fonctions avancées (clés de substitution \`generate_surrogate_key\`, pivots, tests de plages de dates).
- **Packages de modélisation métier (ex: \`fivetran/stripe\`, \`dbt-labs/snowplow\`)** : Fournissent des modèles de staging et de marts préconçus pour transformer directement les données d'outils SaaS courants.
- **Packages d'audit et de productivité (ex: \`dbt-labs/codegen\`)** : Génèrent automatiquement le code YAML de documentation ou le SQL de staging à partir des tables réelles.

## 3. Définitions des termes clés
- **packages.yml / dependencies.yml** : Fichier à la racine du projet recensant la liste des packages requis avec leurs versions.
- **dbt-package (dbt Hub)** : Registre public officiel d'hébergement des packages vérifiés (hub.getdbt.com).
- **dbt deps** : Commande qui télécharge les packages dans le dossier \`dbt_packages/\`.

## 4. Exemple concret
Configuration dans \`packages.yml\` :

\`\`\`yaml
packages:
  - package: dbt-labs/dbt_utils
    version: 1.3.0
  - git: "https://github.com/mon-organisation/dbt-custom-macros.git"
    revision: v1.0.2
\`\`\`

Installation en ligne de commande :
\`\`\`bash
dbt deps
\`\`\`

Utilisation d'une macro du package dans un modèle :
\`\`\`sql
select
    {{ dbt_utils.generate_surrogate_key(['client_id', 'date_commande']) }} as id_cle_unique,
    montant
from {{ ref('stg_commandes') }}
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Oubli de dbt deps** : À l'examen, si une erreur indique qu'une macro \`dbt_utils.*\` est introuvable (Compilation Error), la première vérification est de s'assurer que \`dbt deps\` a bien été exécuté dans l'environnement.
- **Dossier dbt_packages** : Le dossier contenant les packages téléchargés ne doit jamais être versionné dans Git; il doit figurer dans le fichier \`.gitignore\`.
- **Espaces de noms** : Pour appeler une macro issue d'un package, il faut toujours la préfixer avec le nom du package (\`dbt_utils.nom_macro\`).

## 6. Lien avec SQL, Snowflake et Databricks
- Les macros comme \`generate_surrogate_key\` de \`dbt_utils\` s'adaptent automatiquement : elles utilisent \`MD5\` sur Snowflake et \`SHA2\` sur d'autres plateformes en gérant les valeurs nulles de façon homogène.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçon 57
- Cours secondaire Weigel : leçons 53 à 56
- Documentation officielle : https://docs.getdbt.com/docs/build/packages (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande dbt est indispensable pour télécharger les dépendances définies dans packages.yml ? (Réponse : dbt deps)
2. Quel fichier doit contenir la règle pour ignorer le dossier dbt_packages/ lors des commits ? (Réponse : .gitignore)
3. Comment préfixe-t-on l'appel à une macro issue du package dbt_utils ? (Réponse : dbt_utils.nom_de_macro)
`
  },
  {
    id: "documentation",
    title: "Documentation et lignage de données (Data Lineage)",
    section: "Section 3 : Testing, documenting, and publishing dbt models",
    toth: "leçons 58 à 62",
    weigel: "leçons 42, 113",
    doc_url: "https://docs.getdbt.com/docs/collaborate/documentation",
    content: `# Documentation et lignage de données (Data Lineage)

## 1. Objectifs d'apprentissage
Rédiger la documentation des modèles et des colonnes dans les fichiers YAML.
Utiliser les blocs de documentation réutilisables (\`doc blocks\`) dans des fichiers Markdown.
Générer le site de documentation statique avec \`dbt docs generate\`.
Visualiser et interpréter le graphe de dépendances (DAG / Lineage Graph).

## 2. Explication claire : quand choisir quoi
La documentation dans dbt fait partie intégrante du cycle de vie du code. Elle vit aux côtés des modèles SQL :
- **Descriptions en ligne (YAML)** : Idéales pour des descriptions concises d'une ou deux phrases définissant le rôle d'un modèle ou d'une colonne.
- **Blocs de documentation (Doc Blocks)** : Indispensables pour les définitions longues, complexes ou partagées par plusieurs tables (ex: définition légale du chiffre d'affaires, calcul des statuts clients). Ils sont rédigés en Markdown dans des fichiers \`.md\` du dossier \`models/\` et référencés via la syntaxe \`{{ doc("nom_bloc") }}\`.
- **Graphe de lignage (DAG)** : Permet d'explorer visuellement le cheminement des données depuis les sources brutes jusqu'aux rapports finaux.

## 3. Définitions des termes clés
- **dbt docs generate** : Commande qui analyse le projet et produit les fichiers statiques de documentation (\`manifest.json\`, \`catalog.json\`, \`index.html\`).
- **dbt docs serve** : Démarre un serveur web local pour explorer la documentation et le DAG interactif.
- **Doc Block** : Balise Jinja spéciale \`{% docs nom %} ... {% enddocs %}\` encapsulant du texte Markdown enrichi.

## 4. Exemple concret
Création d'un doc block dans \`models/docs_finance.md\` :

\`\`\`markdown
{% docs statut_commande_description %}
Le statut opérationnel de la commande client :
- **placed** : Commande validée en attente de traitement bancaire.
- **shipped** : Colis expédié par notre plateforme logistique.
- **returned** : Article retourné par le client final.
{% enddocs %}
\`\`\`

Référence dans le fichier YAML :
\`\`\`yaml
version: 2

models:
  - name: fct_orders
    description: "Table de faits des transactions e-commerce."
    columns:
      - name: status
        description: "{{ doc('statut_commande_description') }}"
\`\`\`

Commandes :
\`\`\`bash
dbt docs generate
dbt docs serve --port 8080
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Catalog.json et métadonnées réelles** : La commande \`dbt docs generate\` interroge l'entrepôt de données pour extraire les types réels des colonnes et la taille des tables dans \`catalog.json\`.
- **Sens du graphe DAG** : Les nœuds situés à gauche sont les ancêtres (upstream/parents), les nœuds à droite sont les descendants (downstream/enfants).
- **Persistance des descriptions dans le Warehouse** : En configurant \`persist_docs: {relation: true, columns: true}\`, dbt injecte les descriptions sous forme de commentaires SQL (\`COMMENT ON TABLE / COLUMN\`) visibles directement dans l'interface Snowflake ou Databricks.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, \`persist_docs\` permet aux analystes interrogeant directement la base via DBeaver ou la console web de lire la documentation sans ouvrir dbt.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 58 à 62
- Cours secondaire Weigel : leçons 42, 113
- Documentation officielle : https://docs.getdbt.com/docs/collaborate/documentation (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelles sont les deux commandes nécessaires pour créer puis visualiser la documentation dbt en local ? (Réponse : dbt docs generate puis dbt docs serve)
2. Comment référence-t-on un bloc de documentation nommé 'info_client' dans un fichier YAML ? (Réponse : {{ doc('info_client') }})
3. Quelle configuration permet de propager les descriptions dbt comme commentaires SQL dans l'entrepôt ? (Réponse : persist_docs)
`
  },
  {
    id: "exposures",
    title: "Exposures et consommateurs avals",
    section: "Section 3 : Testing, documenting, and publishing dbt models",
    toth: "leçons 71, 72",
    weigel: "leçon 114",
    doc_url: "https://docs.getdbt.com/docs/build/exposures",
    content: `# Exposures et consommateurs avals

## 1. Objectifs d'apprentissage
Comprendre le concept d'Exposures pour cartographier les usages avals des modèles dbt.
Déclarer des expositions pour les tableaux de bord BI, les modèles de ML et les applications de Reverse ETL.
Analyser l'impact d'une modification de modèle sur les outils de restitution métier dans le DAG.
Exécuter et tester de manière ciblée les modèles alimentant une exposition spécifique.

## 2. Explication claire : quand choisir quoi
dbt transforme les données, mais ces données sont ensuite consommées par des outils extérieurs (Tableau, Power BI, Looker, modèles SageMaker, exports marketing). Les Exposures permettent de déclarer ces consommateurs avals dans dbt :
- Elles étendent le graphe de dépendances (DAG) au-delà des frontières de l'entrepôt.
- Elles permettent de savoir immédiatement qui contacter et quels rapports sont impactés en cas de changement de schéma ou de panne de pipeline.
- Elles permettent d'exécuter uniquement les modèles nécessaires pour rafraîchir un tableau de bord critique le matin.

## 3. Définitions des termes clés
- **Exposure** : Ressource dbt déclarée dans un fichier YAML sous la racine \`exposures:\`.
- **Types d'exposition supportés** : \`dashboard\`, \`notebook\`, \`analysis\`, \`ml\`, \`application\`.
- **Maturity** : Niveau de criticité opérationnelle (\`high\`, \`medium\`, \`low\`).
- **Owner** : Propriétaire du rapport (nom et e-mail) à notifier en cas d'incident.

## 4. Exemple concret
Déclaration d'une exposition dans \`models/exposures.yml\` :

\`\`\`yaml
version: 2

exposures:
  - name: tableau_bord_direction_financiere
    type: dashboard
    maturity: high
    url: https://bi.notre-entreprise.com/dashboards/finance-exec
    description: "Tableau de bord exécutif quotidien des revenus et marges."
    owner:
      name: "Équipe BI Finance"
      email: "finance-bi@notre-entreprise.com"
    depends_on:
      - ref('fct_revenus_mensuels')
      - ref('dim_centres_couts')
\`\`\`

Commandes de sélection ciblée :
\`\`\`bash
# Exécute tous les modèles amonts alimentant cette exposition
dbt run --select +exposure:tableau_bord_direction_financiere

# Teste tous les modèles amonts de l'exposition
dbt test --select +exposure:tableau_bord_direction_financiere
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Syntaxe du sélecteur** : Retenez la syntaxe \`+exposure:mon_exposition\`. Le signe plus placé à gauche (\`+\`) signifie : "sélectionne tous les parents/ancêtres de l'exposition".
- **Les exposures ne créent aucune table** : Une exposition est un nœud purement informatif dans le DAG. L'exécution de \`dbt run\` ne crée rien pour l'exposition elle-même.
- **Dépendances obligatoires** : Chaque exposition doit lister au moins une dépendance valide (\`ref()\` ou \`source()\`) dans son bloc \`depends_on\`.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans les architectures d'entreprise, les exposures permettent de sécuriser les contrats de service entre les Data Engineers et les équipes de restitution décisionnelle.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 71, 72
- Cours secondaire Weigel : leçon 114
- Documentation officielle : https://docs.getdbt.com/docs/build/exposures (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quel préfixe de commande permet de sélectionner tous les modèles alimentant une exposition nommée 'kpi_ventes' ? (Réponse : +exposure:kpi_ventes)
2. Les exposures créent-elles des tables ou vues physiques dans l'entrepôt de données ? (Réponse : Non, ce sont des nœuds purement déclaratifs de documentation dans le DAG)
3. Citez trois types d'expositions reconnus par la spécification dbt. (Réponse : dashboard, notebook, ml)
`
  },
  {
    id: "hooks-grants",
    title: "Hooks et gestion des privilèges (Grants)",
    section: "Section 4 : Deployment and orchestration",
    toth: "leçons 65, 66",
    weigel: "leçons 63 à 65",
    doc_url: "https://docs.getdbt.com/docs/build/hooks-operations",
    content: `# Hooks et gestion des privilèges (Grants)

## 1. Objectifs d'apprentissage
Comprendre les différents types de hooks : on-run-start, on-run-end, pre-hook et post-hook.
Ordonnancer des actions SQL d'administration avant et après les builds de modèles.
Gérer les autorisations d'accès aux tables et vues via le bloc natif \`grants\`.
Éviter l'utilisation excessive de hooks pour des tâches gérées nativement par dbt.

## 2. Explication claire : quand choisir quoi
- **Pre-hooks et Post-hooks** : Instructions SQL exécutées immédiatement avant ou immédiatement après la construction d'un modèle spécifique. Typiquement utilisés pour créer des index, insérer des lignes de trace ou appeler des procédures stockées.
- **On-run-start et On-run-end** : Exécutés au début ou à la fin d'une commande dbt globale (\`dbt run\`, \`dbt build\`). Utilisés pour des vérifications globales de session ou l'enregistrement de logs d'audit.
- **Grants natifs** : Configuration déclarative recommandée pour attribuer les droits de lecture/écriture (\`SELECT\`, \`INSERT\`) aux rôles d'utilisateurs. **Bonne pratique moderne** : préférer toujours le bloc \`grants\` natif plutôt que des \`GRANT SELECT\` manuels dans des post-hooks.

## 3. Définitions des termes clés
- **Post-hook** : Bloc SQL exécuté après le commit du modèle dans la base de données.
- **Grants** : Mécanisme standard de dbt appliquant automatiquement les droits SQL après la création ou le remplacement d'une table ou vue.
- **Operations (dbt run-operation)** : Macros autonomes invoquées en ligne de commande pour des tâches de maintenance ponctuelle sans exécuter de modèle.

## 4. Exemple concret
Configuration des permissions avec le bloc \`grants\` dans \`dbt_project.yml\` :

\`\`\`yaml
models:
  notre_projet:
    marts:
      +grants:
        select: ['role_analyste_bi', 'role_data_scientist']

    staging:
      +post-hook:
        - "ALTER TABLE {{ this }} SET TAG confidentialite = 'interne'"
\`\`\`

Exécution d'une opération ponctuelle :
\`\`\`bash
dbt run-operation vider_tables_temporaires --args '{schema_cible: staging_temp}'
\`\`\`

## 5. Comparaisons et pièges d'examen
- **Variable {{ this }}** : Dans un pre-hook ou post-hook, \`{{ this }}\` fait référence à la relation de base de données courante (base.schema.table).
- **Post-hook contre Grants** : À l'examen, si la question demande la manière recommandée de donner des permissions de lecture à un groupe d'analystes, choisissez la fonctionnalité \`grants\` native plutôt qu'un post-hook.
- **Échec de transaction** : Si un pre-hook échoue, le modèle n'est pas exécuté. Si un post-hook échoue, le statut global du modèle est marqué en erreur (ERROR).

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, la fonctionnalité \`grants\` exécute des requêtes de type \`GRANT SELECT ON TABLE ... TO ROLE ...\` de manière idempotente, évitant les erreurs de droits lors des recréations complètes de tables.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 65, 66
- Cours secondaire Weigel : leçons 63 à 65
- Documentation officielle : https://docs.getdbt.com/docs/build/hooks-operations (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle fonctionnalité native de dbt doit être privilégiée pour attribuer des droits SELECT à des rôles au lieu d'utiliser des post-hooks ? (Réponse : La fonctionnalité grants)
2. Dans un post-hook, quelle variable Jinja référence la table en cours de construction ? (Réponse : {{ this }})
3. Quelle commande permet d'exécuter une macro administrative isolée sans lancer de modèles ? (Réponse : dbt run-operation)
`
  },
  {
    id: "commandes-selecteurs",
    title: "Commandes dbt et syntaxe des sélecteurs",
    section: "Section 2 : Debugging data modeling errors",
    toth: "leçons 86 à 92",
    weigel: "leçons 40, 41, 44, 117 à 119",
    doc_url: "https://docs.getdbt.com/reference/node-selection/syntax",
    content: `# Commandes dbt et syntaxe des sélecteurs

## 1. Objectifs d'apprentissage
Maîtriser les commandes d'exécution majeures : dbt run, test, build, compile, seed, snapshot.
Utiliser la syntaxe avancée des sélecteurs (\`--select\` et \`--exclude\`).
Comprendre les opérateurs de graphe : plus (\`+\`), arrobase (\`@\`), intersection (virgule) et exclusion.
Définir des sélecteurs réutilisables dans le fichier \`selectors.yml\`.

## 2. Explication claire : quand choisir quoi
- **dbt run** : Compile et exécute les modèles pour créer tables et vues. N'exécute aucun test.
- **dbt test** : Exécute uniquement les tests de données et tests unitaires sur les objets existants.
- **dbt build** : Commande reine recommandée en production. Elle exécute dans l'ordre du DAG les seeds, les modèles, les tests et les snapshots. Si un modèle ou un test amont échoue, l'exécution des nœuds descendants est immédiatement interrompue (skip).
- **Opérateurs de sélection du DAG** :
  - \`mon_modele+\` : Le modèle et tous ses descendants en aval (enfants).
  - \`+mon_modele\` : Le modèle et tous ses ancêtres en amont (parents).
  - \`+mon_modele+\` : Le modèle, tous ses ancêtres et tous ses descendants.
  - \`@mon_modele\` : Le modèle, tous ses descendants ET les ancêtres de ces descendants (toutes les dépendances requises pour tester les enfants).

## 3. Définitions des termes clés
- **dbt compile** : Génère le code SQL pur dans le dossier \`target/compiled/\` sans toucher à la base de données.
- **Intersection (virgule)** : \`--select tag:finance,tag:daily\` signifie les modèles qui ont à la fois le tag finance ET le tag daily.
- **Union (espace)** : \`--select tag:finance tag:marketing\` signifie les modèles qui ont le tag finance OU le tag marketing.

## 4. Exemple concret
Exemples de commandes de sélection en ligne de commande :

\`\`\`bash
# Exécute tous les modèles du dossier marts/finance et leurs enfants
dbt run --select marts.finance+

# Exécute tout le projet sauf les modèles tagués 'slow'
dbt build --exclude tag:slow

# Exécute les modèles modifiés ainsi que leurs enfants immédiats (1 degré)
dbt run --select state:modified+1

# Teste un modèle et ses parents directs
dbt test --select +fct_orders
\`\`\`

## 5. Comparaisons et pièges d'examen
- **dbt run contre dbt build** : \`dbt run\` ne lance JAMAIS de tests. Si une question d'examen mentionne qu'un test doit bloquer l'écriture des modèles enfants, la réponse est d'utiliser \`dbt build\`.
- **Sensibilité des chemins** : \`path:models/staging\` cible un répertoire physique, tandis que \`tag:daily\` cible une balise de configuration.
- **L'opérateur @** : Souvent piégeux à l'examen. Retenez que \`@modele\` inclut le modèle, ses descendants, et les parents de ces descendants pour garantir un build complet et autonome.

## 6. Lien avec SQL, Snowflake et Databricks
- Utiliser des sélecteurs fins (\`--select tag:hourly\`) permet d'orchestrer des fréquences d'actualisation distinctes dans Airflow sans surconsommer de ressources cloud.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçons 86 à 92
- Cours secondaire Weigel : leçons 40, 41, 44, 117 à 119
- Documentation officielle : https://docs.getdbt.com/reference/node-selection/syntax (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande exécute les seeds, les modèles, les tests et les snapshots dans l'ordre du DAG ? (Réponse : dbt build)
2. Que sélectionne l'expression --select +dim_clients ? (Réponse : Le modèle dim_clients et tous ses modèles et sources ancêtres en amont)
3. Comment exclure tous les modèles associés au tag 'hourly' lors d'un dbt run ? (Réponse : dbt run --exclude tag:hourly)
`
  },
  {
    id: "empty-sample",
    title: "Drapeaux d'échantillonnage : --empty et --sample",
    section: "Section 2 : Debugging data modeling errors",
    toth: "leçon 88",
    weigel: "leçon 128",
    doc_url: "https://docs.getdbt.com/reference/commands/run#sampling",
    content: `# Drapeaux d'échantillonnage : --empty et --sample

## 1. Objectifs d'apprentissage
Comprendre le fonctionnement et le cas d'usage du drapeau dbt \`--empty\`.
Valider la compilation SQL, les schémas et les contrats sans manipuler de données réelles.
Exploiter l'option \`--sample\` pour restreindre l'exécution à un sous-ensemble de données temporelles.
Réduire drastiquement les coûts de calcul et les temps de cycle lors du développement et de la CI.

## 2. Explication claire : quand choisir quoi
Lors du développement ou dans les pipelines de validation d'intégration continue (CI), exécuter des transformations sur des téraoctets de données est lent et coûteux :
- **Drapeau \`--empty\`** : Intercepte les lectures de \`ref()\` et \`source()\` et leur injecte une clause \`WHERE false\` (ou \`LIMIT 0\`). Le modèle est exécuté par l'entrepôt pour valider la syntaxe SQL, la compatibilité des types et les contrats de schéma, mais sans lire ni écrire de données réelles (0 ligne traitée). Durée : quelques secondes au lieu de plusieurs heures.
- **Drapeau \`--sample\`** : Permet de filtrer automatiquement les modèles incrémentaux ou les sources sur une fenêtre temporelle restreinte (ex: les 3 derniers jours via \`--sample "3 days"\`), parfait pour tester le comportement d'un calcul sur des données représentatives récentes sans tout recharger.

## 3. Définitions des termes clés
- **Dry-run structurel** : Validation de la cohérence du DDL et de la syntaxe SQL sans coût d'IO sur les données physiques.
- **WHERE false** : Prédicat logique inséré automatiquement par dbt en mode \`--empty\` pour renvoyer une table vide conservant le schéma exact.

## 4. Exemple concret
Validation de l'ensemble du projet sans traiter aucune ligne de données :

\`\`\`bash
# Vérifie la syntaxe SQL et les contrats de tout le projet à coût quasi nul
dbt build --empty

# Échantillonne les données sur les 7 derniers jours pour tester un modèle incrémental
dbt run --select fct_evenements_analytics --sample "7 days"
\`\`\`

## 5. Comparaisons et pièges d'examen
- **--empty contre dbt compile** : \`dbt compile\` ne contacte le Warehouse que pour le catalogage et ne valide pas si la base de données accepte la requête. \`dbt build --empty\` envoie réellement le SQL au Warehouse avec un filtre vide pour valider les types et contraintes physiques.
- **Impact sur les tests** : Un test \`unique\` ou \`relationships\` exécuté avec \`--empty\` réussira toujours (puisqu'il y a 0 ligne), mais cela valide la structure de la requête de test.
- **Nouveauté examen 2026** : Ces options font partie des nouvelles questions d'examen sur l'optimisation des flux de travail de développement.

## 6. Lien avec SQL, Snowflake et Databricks
- Dans **Snowflake**, \`dbt build --empty\` permet aux pipelines de pull requests de vérifier que les migrations de code ne cassent pas les schémas sans sortir du forfait de crédits d'entrepôt gratuit.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçon 88
- Cours secondaire Weigel : leçon 128
- Documentation officielle : https://docs.getdbt.com/reference/commands/run#sampling (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Que fait le drapeau --empty lorsqu'il est passé à la commande dbt build ? (Réponse : Il insère un prédicat WHERE false pour valider la structure et les schémas sans charger de données)
2. Quelle option permet de limiter l'ingestion d'un modèle incrémental aux 3 derniers jours de données lors d'un test ? (Réponse : --sample "3 days")
3. Quel est l'avantage principal de --empty dans un pipeline de CI ? (Réponse : Il valide la validité du SQL et des contrats en quelques secondes avec une consommation de calcul quasi nulle)
`
  }
];

console.log(`Writing ${chaptersPart1.length} chapters (Part 1)...`);
for (const ch of chaptersPart1) {
  const filePath = path.join(CHAPTERS_DIR, `${ch.id}.md`);
  const sanitized = cleanEmDashes(ch.content.trim()) + '\n';
  fs.writeFileSync(filePath, sanitized, 'utf8');
  console.log(`Saved: ${ch.id}.md`);
}
