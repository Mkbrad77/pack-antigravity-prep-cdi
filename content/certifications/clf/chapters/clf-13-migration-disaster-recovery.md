# Chapitre 13 : Stratégies de Migration Cloud et Plans de Reprise après Sinistre

## 1. Objectifs d'apprentissage
- Maîtriser les 7R de migration (Rehost, Replatform, Refactor, Repurchase, Retain, Retire, Relocate).
- Connaître les services de transfert : Snowcone, Snowball Edge, Snowmobile et DataSync.
- Comprendre AWS Database Migration Service (DMS) avec CDC.
- Distinguer les 4 stratégies de reprise après sinistre (Disaster Recovery).

## 2. Explication claire : quand choisir quoi
Stratégies de migration (Les 7R) :
1. Rehost (Lift-and-Shift) : déplacer des serveurs vers EC2 sans changer le code.
2. Replatform : optimisations légères sans refonte (ex. déplacer Oracle sur EC2 vers RDS for Oracle).
3. Refactor : réécrire l'application en mode Cloud Native (Serverless, conteneurs, microservices).
4. Repurchase : passage à une solution SaaS managée.
5. Relocate : déplacer des machines virtuelles (ex. VMware Cloud on AWS) sans reconfiguration.
6. Retain : conserver l'application sur site temporairement.
7. Retire : décommissionner les applications inutilisées.

Transfert de gros volumes de données :
- AWS Snowcone : boîtier compact et renforcé (8 à 14 To).
- AWS Snowball Edge : boîtier sécurisé (jusqu'à 80 To) pour migrer des dizaines de To par voie postale.
- AWS Snowmobile : conteneur de transport jusqu'à 100 Po pour les datacenters entiers.
- AWS DataSync : transfert accéléré en ligne par le réseau entre stockage local (NFS, SMB) et S3, EFS ou FSx.
- AWS DMS : migration de bases de données avec réplication continue (Change Data Capture - CDC).

Les 4 stratégies de Disaster Recovery :
1. Sauvegarde et restauration (Backup & Restore) : économique, RTO et RPO élevés.
2. Veilleuse (Pilot Light) : données répliquées en continu, calcul provisionné uniquement en cas de sinistre.
3. Attente chaude (Warm Standby) : version réduite fonctionnant en permanence dans une autre région.
4. Multi-sites actif-actif : infrastructure complète traitant le trafic en temps réel sur plusieurs régions. Zéro interruption.

## 3. Définitions des termes clés
- RTO (Recovery Time Objective) : durée maximale acceptable pour rétablir le service après un sinistre.
- RPO (Recovery Point Objective) : volume maximal acceptable de données perdues exprimé en durée.
- CDC (Change Data Capture) : capture et réplication continue des écritures de base de données.

## 4. Exemple concret
Une entreprise doit migrer 60 To de données avec une liaison Internet saturée de 100 Mbit/s (plus de 60 jours en ligne). Elle utilise un Snowball Edge : copie locale en 24h et transfert physique vers S3 en quelques jours.

## 5. Comparaisons et pièges d'examen
- Rehost vs Refactor : Rehost ne modifie aucun code ; Refactor repense l'architecture en Serverless.
- Pilot Light vs Warm Standby : Pilot Light garde le calcul éteint jusqu'au sinistre ; Warm Standby maintient un calcul actif minimal.
- Snowball vs DataSync : bande passante suffisante = DataSync ; volume massif et réseau lent = Snowball.

## 6. Lien avec SQL, Snowflake et Databricks
AWS DMS réplique en continu des bases relationnelles vers S3 en fichiers Parquet, constituant le lac de données brut alimentant Snowflake ou Databricks.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 189 à 200.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quelle stratégie de migration consiste à déplacer une application vers le cloud sans modifier son code source ?
   - A) Rehost (Lift-and-Shift) (Bonne réponse).
   - B) Refactor.
   - C) Repurchase.
   - D) Retire.
2. Quelle stratégie de reprise après sinistre maintient une version minimale mais active de l'infrastructure dans une seconde région ?
   - A) Warm Standby (Attente chaude) (Bonne réponse).
   - B) Pilot Light.
   - C) Backup & Restore.
   - D) Multi-Site Active-Active.
