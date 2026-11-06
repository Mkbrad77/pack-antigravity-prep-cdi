# Chapitre 15 : Architecture Amazon Redshift et Styles de Distribution des Tables

## 1. Objectifs d'apprentissage
- Comprendre l'architecture MPP de Redshift (Leader Node, Compute Nodes, Slices).
- Maîtriser les 4 styles de distribution : AUTO, KEY, EVEN, ALL.
- Éliminer le shuffle réseau lors des jointures volumineuses.
- Connaître les instances RA3 avec stockage managé séparé.

## 2. Explication claire : quand choisir quoi
Amazon Redshift est un entrepôt de données relationnel MPP colonnaire pour l'analytique à grande échelle :

Architecture du cluster Redshift :
1. Nœud Leader (Leader Node) :
   - Reçoit les requêtes SQL clientes, compile le code d'exécution et distribue le plan aux nœuds de calcul.
   - Aucun coût additionnel : inclus dans le cluster.
2. Nœuds de calcul (Compute Nodes) :
   - Exécutent le code compilé en parallèle et renvoient les résultats au Leader Node.
   - Chaque nœud est divisé en tranches (Slices) de calcul et de stockage.
   - Nœuds RA3 : séparent le calcul du stockage managé Redshift (RMS sur S3) avec cache SSD NVMe local.

Styles de distribution (DISTSTYLE) :
Le style de distribution détermine la répartition des lignes entre les slices :
1. KEY (DISTSTYLE KEY) :
   - Distribution par hachage d'une colonne spécifique.
   - À choisir pour les tables fréquemment jointes sur cette clé afin de forcer la colocalisation sur les mêmes tranches (colocated join, zéro shuffle).
2. ALL (DISTSTYLE ALL) :
   - Copie intégrale dupliquée sur le premier slice de chaque nœud.
   - Idéal pour les petites tables de dimension (< 2-3 millions de lignes). Élimine le shuffle lors des jointures.
3. EVEN (DISTSTYLE EVEN) :
   - Distribution circulaire (round-robin) uniforme sans tenir compte des valeurs.
   - À choisir sans clé de jointure évidente ou pour éviter le déséquilibre (skew).
4. AUTO (DISTSTYLE AUTO) :
   - Choix par défaut : Redshift commence en ALL pour les petites tables, puis bascule vers EVEN ou KEY selon l'évolution du volume.

## 3. Définitions des termes clés
- MPP : architecture où plusieurs nœuds exécutent simultanément des calculs sur des données réparties.
- Slice : fraction de nœud de calcul dotée de mémoire et de stockage dédiés.
- Collocated Join : jointure où les lignes des deux tables résident sur la même slice, sans transfert réseau.

## 4. Exemple concret
Déclaration SQL de distribution optimisée :
```sql
CREATE TABLE dim_pays (
    code_pays VARCHAR(3) PRIMARY KEY,
    nom_pays VARCHAR(50)
) DISTSTYLE ALL;

CREATE TABLE faits_ventes (
    id_vente BIGINT,
    id_client INT,
    montant DECIMAL(10,2)
) DISTSTYLE KEY DISTKEY(id_client);
```

## 5. Comparaisons et pièges d'examen
- Data Skew : une DISTKEY à faible cardinalité (ex. pays avec 90 % de 'FR') concentre les données sur un seul slice, ralentissant tout le cluster. Surveiller via `SVV_TABLE_INFO`.
- ALL sur table volumineuse : piège d'examen saturant inutilement l'espace disque du cluster.

## 6. Lien avec SQL, Snowflake et Databricks
Redshift demande une configuration explicite du placement physique (`DISTKEY`), tandis que Snowflake gère le micro-partitionnement de manière transparente sans distribution manuelle.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 54 à 75.
- Revue officielle AWS Skill Builder : Domain 2 Review (DEA-C01) : gestion des stockages.

## 8. Mini-quiz du chapitre
1. Deux tables volumineuses de 200 Go sont systématiquement jointes sur la colonne id_client. Quel style de distribution élimine le shuffle réseau lors des requêtes ?
   - A) DISTSTYLE KEY avec id_client comme DISTKEY sur les deux tables (Bonne réponse).
   - B) DISTSTYLE ALL sur les deux tables.
   - C) DISTSTYLE EVEN sur la première table et ALL sur la seconde.
   - D) DISTSTYLE AUTO sans clé.
2. Quel composant de l'architecture Redshift analyse les requêtes SQL, compile le code C++ et coordonne les nœuds de calcul ?
   - A) Le Leader Node (Bonne réponse).
   - B) Les Slices de stockage.
   - C) L'AWS Glue Data Catalog.
   - D) L'agent Kinesis.
