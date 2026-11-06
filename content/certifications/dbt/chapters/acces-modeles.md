# Accès aux modèles : groupes, privé, protégé et public

## 1. Objectifs d'apprentissage
Comprendre les niveaux de visibilité d'un modèle dbt : private, protected et public.
Assigner des modèles à des équipes propriétaires via la notion de group.
Sécuriser les interfaces d'échange entre projets dans une architecture dbt Mesh.
Identifier les erreurs de compilation liées à des violations d'accès (dbt access violation).

## 2. Explication claire : quand choisir quoi
Dans les organisations gérant des dizaines de développeurs ou plusieurs projets dbt fédérés (dbt Mesh), exposer tous les modèles à tout le monde conduit à du code spaghetti. La propriété `access` contrôle qui a le droit d'appeler un modèle via `ref()`.
- **private** : Le modèle ne peut être appelé que par des modèles appartenant au MÊME groupe (group). Idéal pour les tables intermédiaires internes à une équipe.
- **protected (par défaut)** : Le modèle peut être appelé par n'importe quel modèle au sein du MÊME projet ou package dbt. Il ne peut pas être appelé par d'autres projets dbt externes.
- **public** : Le modèle fait office de contrat d'API de données officiel. Il peut être appelé par des modèles d'autres projets dbt externes (dbt Mesh). Un modèle public requiert généralement la définition d'un contrat de schéma (`contract: enforced: true`).

## 3. Définitions des termes clés
- **access** : Propriété de configuration d'un modèle (valeurs : private, protected, public).
- **group** : Entité logique représentant l'équipe propriétaire du modèle (définie dans models.yml avec un propriétaire et un canal de contact).
- **dbt Mesh** : Architecture où plusieurs projets dbt collaborent en interrogeant les modèles publics des autres projets sans partager le même dépôt de code.

## 4. Exemple concret
Définition d'un groupe et de niveaux d'accès dans models/schema.yml :

```yaml
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
```

## 5. Comparaisons et pièges d'examen
- **Valeur par défaut** : Si vous ne spécifiez pas la propriété access, la valeur par défaut est protected.
- **Violation d'accès privé** : Si le modèle `fct_marketing` (groupe marketing) tente de faire un `ref('int_calcul_taxes')` (groupe finance, privé), la commande `dbt compile` échoue immédiatement avec une erreur de compilation.
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
