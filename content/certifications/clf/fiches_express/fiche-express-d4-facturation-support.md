# Fiche Express : Domaine 4 - Facturation, Tarification et Support AWS (Pondération officielle : 12 %)

## 1. Outils de Gestion des Coûts AWS
- AWS Pricing Calculator : outil web public pour estimer le coût d'une architecture prévisionnelle AVANT déploiement.
- AWS Cost Explorer : outil interactif pour analyser, filtrer et projeter les dépenses réelles passées et futures (prévision à 12 mois).
- AWS Budgets : définition de plafonds budgétaires avec déclenchement d'alertes par email ou SMS en cas de dépassement réel ou prévu.
- AWS Cost and Usage Report (CUR) : fichier de données le plus exhaustif et détaillé sur la consommation horaire, exporté dans S3.
- Balises de répartition des coûts (Cost Allocation Tags) : métadonnées personnalisées pour attribuer les coûts à des projets ou centres de coût.
- Facturation consolidée (Consolidated Billing) : regroupement de plusieurs comptes au sein d'AWS Organizations pour mutualiser les paliers de volume et obtenir une facture unique.

## 2. Les 4 Niveaux de Support AWS Officiels
| Caractéristique | Basic | Developer | Business | Enterprise |
| :--- | :--- | :--- | :--- | :--- |
| **Coût** | Gratuit | À partir de 29 USD/mois | À partir de 100 USD/mois | À partir de 15 000 USD/mois |
| **Public cible** | Tous les comptes | Tests et prototypage | Charges en production | Systèmes critiques majeurs |
| **Canaux d'accès** | Service client uniquement | Email en heures ouvrées | 24/7 Téléphone, Chat, Email | 24/7 Téléphone, Chat, Email |
| **Ingénieurs Cloud** | Non | 1 contact principal | Contacts illimités | Contacts illimités |
| **Délai panne critique** | Aucun | < 12h (panne système) | < 1h (production en panne) | < 15 min (système critique en panne) |
| **Trusted Advisor** | 7 contrôles de base | 7 contrôles de base | Contrôles intégraux | Contrôles intégraux |
| **Accompagnement dédié** | Aucun | Aucun | Aucun | TAM (Technical Account Manager) dédié |
| **Événements majeurs** | Non | Non | Non | IEM (Infrastructure Event Management) |

## 3. AWS Trusted Advisor : Les 5 Catégories de Recommandations
1. Optimisation des coûts (Cost Optimization) : instances EC2 inactives, volumes EBS non attachés.
2. Sécurité (Security) : accès racine sans MFA, compartiments S3 publics, ports de sécurité grands ouverts (0.0.0.0/0).
3. Tolérance aux pannes (Fault Tolerance) : sauvegardes EBS obsolètes, absence de réplication RDS Multi-AZ.
4. Performances (Performance) : surcharge des règles de débit, provisionnement inadapté.
5. Quotas de service (Service Quotas) : utilisation approchant de la limite maximale autorisée sur le compte.

## 4. Pièges d'Examen et Distinctions Clés
- Calculateur de coûts vs Cost Explorer : Pricing Calculator = avant la création (estimation) ; Cost Explorer = après la création (suivi des dépenses réelles).
- Budgets vs Cost Explorer : Budgets = système d'alerte proactif ; Cost Explorer = visualisation et reporting analytique.
- TAM (Technical Account Manager) : EXCLUSIF au plan Enterprise. Si une question mentionne un conseiller technique dédié, la seule bonne réponse est Enterprise.
- Délai de réponse de 15 minutes : EXCLUSIF au plan Enterprise pour un cas d'incident critique d'entreprise (business-critical system down).

## 5. Chiffres Clés
- Nombre de contrôles Trusted Advisor de base gratuits : 7 contrôles dans le plan Basic et Developer.
- Période maximale de prévision dans Cost Explorer : jusqu'à 12 mois dans le futur.
- Facturation minimale Lambda : granularité par tranche de 1 milliseconde.

Source officielle : AWS Certified Cloud Practitioner Exam Guide CLF-C02 (vérifié le 31/10/2026).
