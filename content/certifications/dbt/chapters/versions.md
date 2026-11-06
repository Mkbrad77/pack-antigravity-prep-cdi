# Versions de modèles et dépréciation

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
  - Par défaut, `ref('mon_modele')` pointe vers la version désignée comme dernière version stable (latest_version).
  - Un consommateur qui n'est pas encore prêt à migrer peut figer son appel en écrivant `ref('mon_modele', v=1)`.

## 3. Définitions des termes clés
- **latest_version** : Attribut YAML précisant la version retournée par défaut lorsqu'aucune version n'est spécifiée dans ref().
- **deprecation_date** : Date limite au format YYYY-MM-DD déclenchant un avertissement lors de la compilation si un modèle dépend encore de la version obsolète.
- **Suffixe de fichier** : Les fichiers SQL portent obligatoirement le suffixe de leur version (ex: `dim_clients_v1.sql`, `dim_clients_v2.sql`).

## 4. Exemple concret
Déclaration YAML des versions dans models/marts/schema.yml :

```yaml
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
```

Fichiers SQL correspondants :
- `models/marts/dim_clients_v1.sql`
- `models/marts/dim_clients_v2.sql`

Appel dans un modèle dépendant :
```sql
-- Utilise la version 2 (dernière version par défaut)
select * from {{ ref('dim_clients') }}

-- Fige la dépendance sur la version 1
select * from {{ ref('dim_clients', v=1) }}
```

## 5. Comparaisons et pièges d'examen
- **Piège du nom de fichier** : Le nom du fichier physique doit inclure le suffixe de version (`nom_modele_v1.sql`), alors que la clé YAML `name` reste le nom générique (`dim_clients`).
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
