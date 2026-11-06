# Fiche Express : Domaine 1 - Concepts du Cloud AWS (Pondération officielle : 24 %)

## 1. Les 6 Avantages Majeurs du Cloud AWS (À connaître par cœur)
1. Remplacer les dépenses d'investissement par des dépenses variables (Trade CapEx for OpEx).
2. Bénéficier d'économies d'échelle massives (baisse continue des coûts unitaires).
3. Arrêter de deviner la capacité nécessaire (élasticité dynamique selon la charge).
4. Augmenter la vitesse et l'agilité (mise sur le marché en quelques minutes).
5. Cesser de dépenser de l'argent pour gérer des centres de données (foyer de coût non différenciateur).
6. Déployer à l'échelle mondiale en quelques minutes (infrastructure répartie sur tous les continents).

## 2. Modèles de Déploiement et de Service
- Cloud Public : 100 % hébergé et géré sur AWS, élasticité maximale.
- Cloud Hybride : interconnexion entre infrastructure sur site et AWS (via Direct Connect, Storage Gateway ou VPN).
- Cloud Privé : infrastructure dédiée sur site ou en colocation sans mutualisation.
- IaaS (Infrastructure as a Service) : contrôle maximal sur l'OS et le réseau (ex. EC2).
- PaaS (Platform as a Service) : gestion applicative sans souci d'OS ni de matériel (ex. Elastic Beanstalk, RDS).
- SaaS (Software as a Service) : logiciel complet consommé sur étagère (ex. applications d'entreprise, QuickSight).

## 3. Les 6 Piliers du Well-Architected Framework
- Excellence Opérationnelle : automatiser avec le code (IaC), changements fréquents et réversibles, anticiper les pannes.
- Sécurité : appliquer le moindre privilège, défense en profondeur, traçabilité totale, chiffrement partout.
- Fiabilité : tester la reprise après sinistre, reprise automatique sur panne, redondance Multi-AZ.
- Efficacité des Performances : adopter le sans serveur (Serverless), technologies avancées, expérimenter à l'échelle.
- Optimisation des Coûts : payer à l'usage, mesurer l'efficacité, utiliser Savings Plans et instances Spot.
- Durabilité : réduire l'empreinte carbone, optimiser l'utilisation des ressources, privilégier les processeurs AWS Graviton.

## 4. Stratégies de Migration (Les 7R)
- Rehost (Lift-and-Shift) : déplacer sans modification de code (le plus rapide).
- Replatform (Lift-Tinker-and-Shift) : optimiser quelques éléments sans toucher au cœur de code (ex. passer sur RDS).
- Refactor : réécrire en mode natif cloud (Serverless, microservices) pour une agilité maximale.
- Repurchase : remplacer par un progiciel SaaS.
- Relocate : transférer des machines virtuelles (VMware on AWS) sans reconfiguration.
- Retain : conserver sur site temporairement.
- Retire : désactiver les composants obsolètes inutiles.

## 5. Pièges d'Examen et Distinctions Clés
- Élasticité vs Évolutivité : l'élasticité s'adapte à la hausse ET à la baisse automatiquement (Auto Scaling) ; l'évolutivité (scalabilité) est la capacité à grandir.
- Haute Disponibilité vs Tolérance aux Pannes : la tolérance aux pannes garantit zéro interruption de service ; la haute disponibilité garantit un temps de rétablissement quasi imperceptible.
- Reprise après sinistre : classées du moins cher/plus lent au plus cher/immédiat : Backup & Restore -> Pilot Light -> Warm Standby -> Multi-Site Active-Active.

## 6. Chiffres et Limites à Retenir
- Règle Multi-AZ : au moins 3 zones de disponibilité par région AWS moderne.
- Distance entre AZ : séparées géographiquement mais à moins de 100 km avec une latence réseau inférieure à 2 millisecondes.
- Durabilité S3 Standard : conçue pour 99,999999999 % (11 neufs) par an.

Source officielle : AWS Certified Cloud Practitioner Exam Guide CLF-C02 (vérifié le 31/10/2026).
