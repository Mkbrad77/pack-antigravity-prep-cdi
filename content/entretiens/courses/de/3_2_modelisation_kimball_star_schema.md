# Chapitre 3.2 : Modélisation Dimensionnelle (Kimball) : Faits, Dimensions, Grain, Schéma Étoile vs Flocon

**Tâches du planning associées :** `W11-I1` (`3.2`)  
**Durée de lecture estimée :** 25 min  
**Objectif entretien :** Définir sans ambiguïté la granularité (*grain*) d'une table de faits, distinguer les 3 types de tables de faits et de mesures, concevoir des dimensions conformes avec clés de substitution (*surrogate keys*), et justifier le choix entre 3NF (Inmon), Star Schema (Kimball) et One Big Table (OBT).

---

## 1. Les 4 étapes de conception méthodologique de Ralph Kimball

En entretien de System Design ou de modélisation SQL/dbt, toute conception d'un Data Mart analytique doit suivre dans l'ordre les **4 étapes de Kimball** :
1. **Choisir le processus métier** (ex: validation d'une commande e-commerce, passage en caisse, clic publicitaire, facturation mensuelle SaaS). Un processus = un événement métier générateur de métriques.
2. **Déclarer le Grain (Granularité)** : **L'étape la plus critique.** Le grain définit exactement *ce que représente une seule ligne de la table de faits* (ex: *"Une ligne par ligne de produit commandé dans un panier client"*). On ne mélange **jamais** deux grains différents dans la même table de faits.
3. **Identifier les Dimensions** : Elles répondent aux questions *Qui, Quoi, Où, Quand, Comment, Pourquoi* (`dim_customer`, `dim_product`, `dim_date`, `dim_store`, `dim_promotion`).
4. **Identifier les Faits (Mesures numériques)** : Les métriques quantitatives associées au grain (`quantity_ordered`, `unit_price_ht`, `discount_amount`, `net_revenue`).

---

## 2. Anatomie des Tables de Faits (`fct_`)

### 2.1. Les 3 catégories d'additivité des mesures
| Type de mesure | Définition | Exemple | Règle d'agrégation SQL |
|---|---|---|---|
| **Additive** | Peut être additionnée (`SUM`) selon **toutes** les dimensions (Date, Produit, Magasin, Client). | `montant_ht`, `quantite_vendue`, `frais_port` | `SUM(montant_ht)` est toujours exact. |
| **Semi-additive** | Peut être additionnée sur certaines dimensions (Produit, Entrepôt), mais **jamais sur la dimension Temps (`dim_date`)**. | `stock_fin_journee`, `solde_compte_bancaire`, `nombre_employes_actifs` | Additionner le solde bancaire du lundi et du mardi n'a aucun sens ! On utilise `AVG()` ou `LAST_VALUE()` sur le temps, et `SUM()` entre magasins à une date fixe. |
| **Non-additive** | Ne peut être additionnée sur **aucune** dimension. | `taux_marge_pct`, `prix_unitaire`, `ratio_conversion` | Ne jamais faire `SUM(taux_marge)` ni `AVG(taux_marge)`. Toujours stocker le numérateur et le dénominateur dans la table de faits, puis calculer `SUM(marge_eur) / NULLIF(SUM(ca_eur), 0)` au moment de la requête BI. |

### 2.2. Les 3 types de Tables de Faits
1. **Transaction Fact Table (Faits transactionnels)** : Grain au niveau de l'événement atomique (1 ligne = 1 paiement, 1 clic). Très volumineuse, insérée en `append` ou `incremental`.
2. **Periodic Snapshot Fact Table (Instantané périodique)** : Photographie de l'état à intervalle régulier (1 ligne par compte et par fin de mois, ou 1 ligne par produit/entrepôt par jour pour les stocks). Idéal pour les mesures semi-additives.
3. **Accumulating Snapshot Fact Table (Instantané récapitulatif de flux)** : 1 ligne par cycle de vie d'un processus à étapes fixes (ex: cycle d'une commande ou d'un dossier de prêt : `date_commande_sk`, `date_paiement_sk`, `date_expedition_sk`, `date_livraison_sk`). Contrairement aux faits transactionnels, **cette table est mise à jour (`UPDATE` / `MERGE`)** au fur et à mesure que la commande franchit les jalons, afin de mesurer les délais inter-étapes (`lag_expedition_hours`).

---

## 3. Anatomie des Tables de Dimensions (`dim_`)

- **Clé de substitution (*Surrogate Key*, `_sk` ou `_key`)** : Clé primaire technique propre à l'entrepôt (entier auto-incrémenté ou hash déterministe `dbt_utils.generate_surrogate_key(['customer_id', 'dbt_valid_from'])`).
  - *Pourquoi ne pas utiliser directement l'ID opérationnel (`natural key`) comme clé primaire de dimension ?*
    1. Pour supporter l'historisation **SCD Type 2** (plusieurs versions d'un même `customer_id` au fil du temps ont chacune leur propre `customer_sk`).
    2. Pour fusionner plusieurs systèmes sources (ERP A et CRM B) sans collision d'identifiants.
    3. Pour gérer les valeurs manquantes via une ligne par défaut (`customer_sk = -1` -> `'Inconnu / Non renseigné'`), ce qui permet d'utiliser des `INNER JOIN` rapides au lieu de `LEFT JOIN` coûteux.
- **Dimensions Conformes (*Conformed Dimensions*)** : Dimensions partagées à l'identique entre plusieurs tables de faits (`dim_date`, `dim_customer`, `dim_product`). Elles permettent le **Drill-Across** : croiser dans un même rapport les ventes (`fct_sales`) et les tickets support (`fct_support_tickets`) par client et par mois.
- **Dimension Dégénérée (*Degenerate Dimension*)** : Identifiant métier (ex: `numero_facture`, `order_id`) stocké directement dans la table de faits sans table de dimension dédiée, car tous ses attributs descriptifs ont déjà été extraits dans d'autres dimensions.
- **Junk Dimension (Dimension fourre-tout)** : Regroupe plusieurs petits drapeaux booléens ou statuts à faible cardinalité (`is_gift`, `payment_method`, `channel_type`) dans une seule petite dimension combinatoire pour éviter de polluer la table de faits avec 10 clés étrangères.

---

## 4. Comparatif d'Architecture : 3NF vs Star Schema vs Snowflake vs OBT

| Critère | 3NF (Modèle OLTP / Inmon) | Star Schema (Schéma en Étoile Kimball) | Snowflake Schema (Schéma en Flocon) | One Big Table (OBT Dénormalisée) |
|---|---|---|---|---|
| **Structure** | Très normalisée (15 à 50 tables), zéro redondance. | 1 table de faits centrale entourée de dimensions dénormalisées à 1 seul niveau. | Comme l'étoile, mais les dimensions sont normalisées en sous-dimensions (`dim_product` -> `dim_category` -> `dim_department`). | 1 seule table plate géante pré-jointe (Faits + toutes les colonnes des Dimensions). |
| **Nombre de `JOIN` en lecture** | Élevé (6 à 12 jointures). | Faible (1 à 4 jointures simples étoile). | Moyen (jointures en cascade). | **0 jointure** (`SELECT ... FROM obt_sales`). |
| **Performance OLAP** | Médiocre sur gros volumes. | **Excellente** (optimisée pour les moteurs MPP et outils BI comme Power BI / Looker). | Moins bonne que l'étoile (coût CPU des jointures supplémentaires pour un gain disque négligeable). | **Maximale en scan pur** sur moteurs colonnaires (BigQuery, Snowflake, DuckDB) grâce au *column pruning*. |
| **Maintenance & SCD2** | Mises à jour unitaires rapides. | **Très propre** : modifier un attribut de dimension ou gérer un SCD2 ne touche pas la table de faits. | Complexe à maintenir et à requêter pour les analystes métier. | **Coûteuse en réécriture** : si la hiérarchie d'un produit change, il faut réécrire toute la table OBT de 5 milliards de lignes ! |

### Réponse type en entretien : *"Faut-il encore faire du Star Schema avec Snowflake / BigQuery ou passer à One Big Table (OBT) ?"*
> *"L'approche industrielle moderne dans dbt consiste à modéliser le cœur des **Marts en Star Schema (`fct_` et `dim_`)** pour garantir la gouvernance, les dimensions conformes et la maintenance peu coûteuse des SCD Type 2. Si un tableau de bord critique ou un pipeline ML exige zéro jointure à la lecture, on ajoute au-dessus une couche finale d'exposition OBT matérialisée ou vue, générée automatiquement à partir du Star Schema."*

---

*Source : générée par IA et vérifiée dans The Data Warehouse Toolkit (Kimball) & dbt Labs Dimensional Modeling Guide (2026-10-31).*
