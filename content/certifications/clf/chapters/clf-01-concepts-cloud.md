# Chapitre 1 : Concepts Fondamentaux du Cloud et Économie AWS

## 1. Objectifs d'apprentissage
- Comprendre la définition officielle du Cloud Computing selon le NIST et AWS.
- Maîtriser les 6 avantages majeurs du Cloud AWS (agilité, économies d'échelle, élasticité, etc.).
- Distinguer dépenses d'investissement (CapEx) et dépenses opérationnelles (OpEx).
- Identifier les modèles de déploiement (Public, Privé, Hybride) et de services (IaaS, PaaS, SaaS).

## 2. Explication claire : quand choisir quoi
Le Cloud Computing représente la mise à disposition à la demande de ressources informatiques (serveurs, stockage, bases de données, réseau) via Internet avec une tarification au paiement à l'usage.
Plutôt que d'investir des millions d'euros dans des centres de données physiques sans certitude sur la charge future (CapEx : Capital Expenditure), les organisations louent les capacités nécessaires et ne paient que ce qu'elles consomment à la seconde (OpEx : Operational Expenditure).

Quand choisir quel modèle :
- Modèle Cloud Public : pour les entreprises recherchant une évolutivité infinie, une haute disponibilité native et l'absence totale de gestion de matériel physique.
- Modèle Hybride : pour les organisations conservant des systèmes patrimoniaux ou des contraintes réglementaires sur site tout en étendant leurs applications via AWS Direct Connect ou AWS Storage Gateway.
- Modèle Cloud Privé (sur site) : pour les entités ayant des exigences souveraines strictes, sans mutualisation multi-locataires.

Les 6 avantages majeurs du cloud AWS à retenir pour l'examen :
1. Remplacer les dépenses d'investissement par des dépenses variables (trade capital expense for variable expense).
2. Bénéficier d'économies d'échelle massives grâce aux millions de clients AWS.
3. Arrêter de deviner la capacité nécessaire : élasticité automatique selon la demande réelle.
4. Augmenter la vitesse et l'agilité : déploiement en quelques clics en quelques minutes.
5. Cesser de dépenser de l'argent pour faire fonctionner des centres de données (foyer de coûts non différenciateur).
6. Déployer à l'échelle mondiale en quelques minutes grâce aux régions réparties sur tous les continents.

## 3. Définitions des termes clés
- Haute Disponibilité (High Availability) : capacité d'un système à rester opérationnel sans interruption notable, généralement par redondance multi-AZ.
- Élasticité (Elasticity) : capacité d'allouer ou de libérer dynamiquement des ressources en fonction de la charge (ex. Auto Scaling).
- Scalabilité / Évolutivité (Scalability) : capacité à absorber une charge croissante en montant en puissance (verticale) ou en nombre d'instances (horizontale).
- Tolérance aux pannes (Fault Tolerance) : capacité à continuer à fonctionner même en cas de défaillance d'un composant matériel ou réseau.

## 4. Exemple concret
Calculateur TCO / AWS Pricing Calculator :
Une entreprise hésite entre acheter 10 serveurs physiques (coût initial 80 000 USD, amortissement 3 ans, électricité, baie réseau, maintenance d'un technicien) et démarrer 10 instances EC2 m6i.large (facturées à l'heure, sans engagement, arrêtables la nuit). Avec AWS, l'arrêt des instances hors heures ouvrées réduit la facture de 60 % immédiatement.

## 5. Comparaisons et pièges d'examen
- Élasticité vs Scalabilité : l'élasticité est le caractère dynamique (croître ET décroître automatiquement) ; la scalabilité est la capacité globale d'un système à grandir.
- Haute disponibilité vs Tolérance aux pannes : la tolérance aux pannes garantit zéro temps d'arrêt (coût élevé, duplication stricte) ; la haute disponibilité tolère une dégradation mineure ou une bascule rapide de quelques secondes.
- Agilité vs Économies d'échelle : l'agilité concerne le temps de mise sur le marché d'une innovation (time to market) ; les économies d'échelle concernent la baisse continue des prix par AWS.

## 6. Lien avec SQL, Snowflake et Databricks
Dans Snowflake, la séparation totale du stockage et du calcul illustre parfaitement ce concept : vous pouvez démarrer un entrepôt virtuel X-Large pour exécuter une requête SQL lourde en 30 secondes, puis l'éteindre immédiatement pour ne payer que 30 secondes de calcul.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 1 à 13.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel avantage du Cloud permet d'arrêter de deviner la capacité requise ?
   - A) L'élasticité (Bonne réponse).
   - B) La réplication multi-régions.
   - C) Le chiffrement au repos.
   - D) L'adressage IP élastique.
2. Quelle expression décrit le passage d'investissements matériels lourds à des frais d'exploitation variables ?
   - A) Remplacement de CapEx par OpEx (Bonne réponse).
   - B) Remplacement d'OpEx par CapEx.
   - C) Modèle sans serveur (Serverless).
   - D) Amortissement dégressif.
