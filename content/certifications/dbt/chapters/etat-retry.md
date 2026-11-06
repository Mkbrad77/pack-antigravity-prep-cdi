# État, manifest, run_results et dbt retry

## 1. Objectifs d'apprentissage
Comprendre le rôle des artefacts dbt générés dans le dossier target/ (manifest.json, run_results.json).
Utiliser le sélecteur d'état state: pour comparer le code courant à une exécution de référence.
Maîtriser la commande dbt retry pour rejouer uniquement les nœuds en échec sans recalculer les succès.
Identifier les critères déterminant si un modèle est considéré comme modifié (state:modified).

## 2. Explication claire : quand choisir quoi
À chaque compilation ou exécution, dbt consigne l'état exact du projet dans des fichiers JSON stockés dans `target/`.
- **manifest.json** : L'artefact le plus complet. Il contient la représentation intégrale du graphe de dépendances (DAG), les définitions de colonnes, les tags, les tests et le code SQL compilé de chaque modèle.
- **run_results.json** : Résume le statut final de la dernière commande exécutée (success, error, fail, skipped, temps d'exécution).
- **dbt retry** : Commande extrêmement productive introduite dans dbt Core 1.6. Si un pipeline de 50 modèles échoue au 48e modèle, `dbt retry` réexécute directement le modèle 48 et les suivants, sans relancer les 47 premiers qui ont déjà réussi.
- **Comparaison d'état (state:)** : En fournissant un manifest de référence (généralement issu de la dernière exécution de production), dbt est capable d'identifier exactement ce qui a changé.

## 3. Définitions des termes clés
- **--state path/to/artifacts** : Argument CLI pointant vers le dossier contenant le `manifest.json` de référence.
- **state:modified** : Méthode de sélection isolant les modèles dont le code SQL, la configuration YAML ou les macros associées ont changé.
- **result:error / result:fail** : Sélecteur filtrant les nœuds qui étaient en échec dans le `run_results.json` de référence.

## 4. Exemple concret
Réexécution immédiate des échecs après correction d'un bug de syntaxe :

```bash
# 1. Lancement du projet (échoue sur 2 modèles)
dbt build

# 2. Après correction du code SQL incriminé, rejouer uniquement les échecs
dbt retry
```

Sélection des modèles modifiés par rapport à la production :
```bash
dbt build --select state:modified --state path/to/prod/artifacts
```

## 5. Comparaisons et pièges d'examen
- **dbt retry contre state:modified** : `dbt retry` lit directement le fichier `target/run_results.json` de la commande précédente dans le répertoire de travail actuel. `--select state:modified` requiert le paramètre `--state` et compare deux fichiers `manifest.json`.
- **Qu'est-ce qui déclenche state:modified ?** Une modification du fichier SQL, un changement dans la configuration YAML (ex: description, tag, matérialisation), ou une modification d'une macro appelée par le modèle.
- **Sous-sélecteurs utiles** : `state:modified.body` vérifie uniquement les modifications du code SQL du modèle en ignorant les métadonnées.

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
