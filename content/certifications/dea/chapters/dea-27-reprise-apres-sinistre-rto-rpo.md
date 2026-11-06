# Chapitre 27 : Résilience et Reprise après Sinistre (Disaster Recovery) pour la Data

## 1. Objectifs d'apprentissage
- Comprendre les indicateurs RTO (Recovery Time Objective) et RPO (Recovery Point Objective).
- Maîtriser les 4 stratégies officielles de Disaster Recovery (DR) sur AWS.
- Mettre en place la réplication des données entre régions (S3 CRR, Redshift, Aurora).
- Concevoir des architectures résilientes aux pannes régionales majeures.

## 2. Explication claire : quand choisir quoi
La résilience garantit qu'une défaillance d'infrastructure ou la perte complète d'un centre de données ou d'une région AWS ne provoque pas de perte de données irrémédiable ni d'arrêt prolongé des activités :

1. Les deux métriques fondamentales de Disaster Recovery :
- RPO (Recovery Point Objective) : volume maximal admissible de données perdues en cas de sinistre, mesuré en durée. Exemple : un RPO de 15 minutes signifie que le système ne doit pas perdre plus de 15 minutes de transactions récentes.
- RTO (Recovery Time Objective) : durée maximale admissible pour restaurer le service opérationnel après le sinistre. Exemple : un RTO de 2 heures signifie que les utilisateurs doivent pouvoir réinterroger les bases dans les 2 heures suivant l'incident.

2. Les 4 stratégies de reprise après sinistre (du moins cher au plus résilient) :
1. Sauvegarde et restauration (Backup & Restore) :
   - Sauvegardes régulières stockées sur S3 et répliquées vers une autre région via AWS Backup.
   - En cas de sinistre : reconstruction complète de l'infrastructure via CloudFormation et restauration des données.
   - Coût : très faible. RPO : plusieurs heures. RTO : plusieurs heures à plusieurs jours.
2. Veilleuse (Pilot Light) :
   - Les données critiques sont répliquées en continu vers la région secondaire (ex. réplication S3 CRR et réplicas Aurora multi-régions).
   - Les serveurs de calcul (EMR, EC2, Glue) sont éteints ou réduits à zéro instance.
   - En cas de sinistre : les serveurs de calcul sont instanciés rapidement dans la région secondaire.
   - Coût : faible. RPO : quelques minutes. RTO : quelques dizaines de minutes.
3. Attente chaude (Warm Standby) :
   - Une version réduite mais totalement fonctionnelle de l'environnement tourne en permanence dans la région secondaire (ex. cluster Redshift sous-dimensionné).
   - En cas de sinistre : mise à l'échelle instantanée des instances secondaires pour absorber le trafic nominal.
   - Coût : modéré. RPO : quelques secondes. RTO : quelques minutes.
4. Multi-sites actif-actif (Multi-Site Active-Active) :
   - Deux environnements complets et identiques traitent le trafic simultanément dans deux régions distinctes.
   - Coût : le plus élevé (facture doublée). RPO : quasi nul. RTO : quasi instantané.

## 3. Définitions des termes clés
- RTO : temps nécessaire pour rétablir les opérations après un incident.
- RPO : délai maximal acceptable de perte de transactions.
- Failover (Basculement) : passage automatique ou manuel des opérations vers l'environnement de secours.

## 4. Exemple concret
Architecture de Disaster Recovery de type Pilot Light :
```
Région Principale (eu-west-1)                   Région de Secours (eu-central-1)
[Data Lake S3 Principal] ------ (S3 CRR) -----> [Data Lake S3 Réplique]
[Aurora PostgreSQL Master] --- (Read Replica) -> [Aurora PostgreSQL Réplique]
[Clusters EMR / Glue Actifs]                    [Templates CloudFormation Prêts (Calcul Éteint)]
```

## 5. Comparaisons et pièges d'examen
- Pilot Light vs Warm Standby : dans Pilot Light, le calcul est ÉTEINT et ne tourne pas jusqu'au sinistre ; dans Warm Standby, une infrastructure minimale tourne EN PERMANENCE et traite une portion du trafic ou est prête à encaisser la charge immédiatement.
- Arbitrage RTO/RPO vs Coût : plus les exigences de RTO et RPO approchent de zéro, plus les coûts augmentent de manière exponentielle.

## 6. Lien avec SQL, Snowflake et Databricks
Ce modèle correspond aux configurations de réplication multi-régions et multi-clouds de Snowflake (Replication and Failover Groups) garantissant qu'un compte secondaire peut prendre le relais instantanément en cas de panne AWS régionale.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 336 à 345.
- Revue officielle AWS Skill Builder : Domain 3 Review (DEA-C01) : opérations et support.

## 8. Mini-quiz du chapitre
1. Une entreprise exige un RPO de 5 minutes et un RTO de 30 minutes pour sa plateforme de données en cas de panne régionale, tout en évitant de payer un double cluster complet actif 24h/24. Quelle stratégie de Disaster Recovery est recommandée ?
   - A) La stratégie Pilot Light avec réplication continue des données et calcul provisionné au moment du sinistre (Bonne réponse).
   - B) Multi-Site Actif-Actif complet.
   - C) Sauvegarde hebdomadaire sur bande magnétique hors ligne.
   - D) La suppression des sauvegardes multi-régions.
2. Quelle métrique définit la quantité maximale acceptable de données perdues lors d'une panne d'infrastructure, exprimée en durée ?
   - A) Le RPO (Recovery Point Objective) (Bonne réponse).
   - B) Le RTO (Recovery Time Objective).
   - C) L'IOPS maximal.
   - D) Le temps de latence DNS.
