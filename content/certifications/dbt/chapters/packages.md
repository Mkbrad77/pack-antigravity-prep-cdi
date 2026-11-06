# Gestion des packages dbt

## 1. Objectifs d'apprentissage
Comprendre l'écosystème des bibliothèques réutilisables dbt (dbt Hub et dépôts Git).
Déclarer les dépendances de packages dans `packages.yml` ou `dependencies.yml`.
Installer et mettre à jour les packages avec la commande `dbt deps`.
Exploiter les packages incontournables de la communauté (`dbt_utils`, `codegen`).

## 2. Explication claire : quand choisir quoi
Les packages dbt sont des projets dbt autonomes contenant des modèles, des macros et des tests que vous pouvez importer dans votre propre projet :
- **Packages de macros utilitaires (ex: `dbt-labs/dbt_utils`)** : Fournissent des fonctions avancées (clés de substitution `generate_surrogate_key`, pivots, tests de plages de dates).
- **Packages de modélisation métier (ex: `fivetran/stripe`, `dbt-labs/snowplow`)** : Fournissent des modèles de staging et de marts préconçus pour transformer directement les données d'outils SaaS courants.
- **Packages d'audit et de productivité (ex: `dbt-labs/codegen`)** : Génèrent automatiquement le code YAML de documentation ou le SQL de staging à partir des tables réelles.

## 3. Définitions des termes clés
- **packages.yml / dependencies.yml** : Fichier à la racine du projet recensant la liste des packages requis avec leurs versions.
- **dbt-package (dbt Hub)** : Registre public officiel d'hébergement des packages vérifiés (hub.getdbt.com).
- **dbt deps** : Commande qui télécharge les packages dans le dossier `dbt_packages/`.

## 4. Exemple concret
Configuration dans `packages.yml` :

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: 1.3.0
  - git: "https://github.com/mon-organisation/dbt-custom-macros.git"
    revision: v1.0.2
```

Installation en ligne de commande :
```bash
dbt deps
```

Utilisation d'une macro du package dans un modèle :
```sql
select
    {{ dbt_utils.generate_surrogate_key(['client_id', 'date_commande']) }} as id_cle_unique,
    montant
from {{ ref('stg_commandes') }}
```

## 5. Comparaisons et pièges d'examen
- **Oubli de dbt deps** : À l'examen, si une erreur indique qu'une macro `dbt_utils.*` est introuvable (Compilation Error), la première vérification est de s'assurer que `dbt deps` a bien été exécuté dans l'environnement.
- **Dossier dbt_packages** : Le dossier contenant les packages téléchargés ne doit jamais être versionné dans Git; il doit figurer dans le fichier `.gitignore`.
- **Espaces de noms** : Pour appeler une macro issue d'un package, il faut toujours la préfixer avec le nom du package (`dbt_utils.nom_macro`).

## 6. Lien avec SQL, Snowflake et Databricks
- Les macros comme `generate_surrogate_key` de `dbt_utils` s'adaptent automatiquement : elles utilisent `MD5` sur Snowflake et `SHA2` sur d'autres plateformes en gérant les valeurs nulles de façon homogène.

## 7. Renvois aux cours et documentation
- Cours principal Toth : leçon 57
- Cours secondaire Weigel : leçons 53 à 56
- Documentation officielle : https://docs.getdbt.com/docs/build/packages (vérifié le 2026-10-31)

## 8. Mini-quiz
1. Quelle commande dbt est indispensable pour télécharger les dépendances définies dans packages.yml ? (Réponse : dbt deps)
2. Quel fichier doit contenir la règle pour ignorer le dossier dbt_packages/ lors des commits ? (Réponse : .gitignore)
3. Comment préfixe-t-on l'appel à une macro issue du package dbt_utils ? (Réponse : dbt_utils.nom_de_macro)
