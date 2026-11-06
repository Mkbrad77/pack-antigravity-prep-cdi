# Chapitre 6 : Infrastructure Globale AWS et Réseau de Diffusion

## 1. Objectifs d'apprentissage
- Comprendre la hiérarchie physique mondiale d'AWS : Régions, Zones de Disponibilité (AZ) et Points de Présence (Edge Locations).
- Connaître les critères de choix d'une Région AWS (conformité légale, latence utilisateur, coût, disponibilité des services).
- Maîtriser le rôle d'Amazon CloudFront et d'AWS Global Accelerator.
- Différencier Local Zones, AWS Wavelength et AWS Outposts pour les besoins spécifiques.

## 2. Explication claire : quand choisir quoi
L'infrastructure mondiale d'AWS est conçue pour offrir une haute disponibilité, une isolation stricte des pannes et une latence ultra-faible :

Région AWS :
- Zone géographique distincte dans le monde (ex. eu-west-3 à Paris, us-east-1 en Virginie).
- Chaque région est totalement isolée et indépendante des autres pour empêcher la propagation de sinistres majeurs.
- Une région contient au minimum 3 zones de disponibilité reliées par des liaisons fibre optique dédiées à très faible latence (< 1 à 2 ms).
- Les données ne quittent JAMAIS une région sans l'accord explicite et l'action du client (souveraineté des données).

Zone de Disponibilité (AZ - Availability Zone) :
- Composée d'un ou plusieurs centres de données physiques distincts, dotés d'alimentations électriques, de générateurs et de connexions réseau redondants.
- Les AZ au sein d'une même région sont séparées par une distance physique suffisante pour se prémunir des inondations ou des pannes d'énergie régionales.
- Déployer sur plusieurs AZ (Multi-AZ) garantit une haute disponibilité et une reprise automatique en cas de panne d'un centre de données.

Points de Présence (Edge Locations / PoP) :
- Réseau mondial de centaines de points relais situés dans les grandes métropoles mondiales.
- Utilisés par Amazon CloudFront (CDN) pour mettre en cache du contenu statique et dynamique au plus près des utilisateurs finaux, réduisant considérablement la latence.
- Utilisés par AWS Shield et AWS WAF pour filtrer les attaques au plus près de leur source, avant d'atteindre les serveurs d'origine.

Extensions d'infrastructure :
- AWS Outposts : baies matérielles physiques AWS installées directement dans le centre de données sur site du client pour une expérience cloud hybride identique.
- AWS Local Zones : extension des régions AWS plaçant le calcul et le stockage à proximité de grands centres industriels ou urbains nécessitant une latence inférieure à 10 ms.
- AWS Wavelength : déploiement d'équipements de calcul AWS dans les réseaux mobiles 5G des opérateurs pour les applications mobiles temps réel.

## 3. Définitions des termes clés
- Latence : temps nécessaire pour qu'un paquet de données voyage d'un émetteur vers un récepteur.
- CDN (Content Delivery Network) : réseau de distribution de contenu mettant en mémoire cache des fichiers au niveau des Edge Locations.
- Souveraineté des données : obligation légale imposant que certaines données de citoyens restent stockées sur le territoire national (ex. choisir la région Paris eu-west-3).

## 4. Exemple concret
Une entreprise de médias basée en France produit des vidéos stockées sur S3 à Paris (eu-west-3). Pour permettre aux utilisateurs d'Asie et des Amériques de visionner ces vidéos sans temps de chargement, l'entreprise active une distribution Amazon CloudFront. Les vidéos sont mises en cache dans les points de présence locaux de Tokyo et New York dès la première requête.

## 5. Comparaisons et pièges d'examen
- Région vs Zone de Disponibilité : une région est une zone géographique (ex. Paris) ; une zone de disponibilité est un groupe de datacenters isolés au sein de cette région (ex. eu-west-3a).
- Point de présence (Edge Location) vs Zone de disponibilité : les Edge Locations ne sont pas des datacenters complets pour héberger des instances EC2 classiques, ce sont des relais de mise en cache CloudFront et de routage DNS Route 53.
- AWS Outposts vs Local Zones : Outposts s'installe physiquement dans VOTRE datacenter privé ; Local Zones est géré par AWS dans une métropole proche.

## 6. Lien avec SQL, Snowflake et Databricks
Snowflake et Databricks s'appuient sur l'infrastructure des régions AWS : lorsque vous provisionnez un compte Snowflake à Paris, il s'exécute physiquement dans la région eu-west-3 sur plusieurs zones de disponibilité pour garantir que vos requêtes SQL continuent d'aboutir même si un datacenter rencontre une avarie.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 15 à 23 et 75 à 86.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel composant de l'infrastructure mondiale AWS est utilisé par Amazon CloudFront pour mettre le contenu en cache au plus près des utilisateurs ?
   - A) Les points de présence / Edge Locations (Bonne réponse).
   - B) Les zones de disponibilité.
   - C) Les groupes de sécurité.
   - D) Les passerelles Internet.
2. Combien de zones de disponibilité au minimum contient chaque région AWS moderne ?
   - A) Au moins 3 zones de disponibilité (Bonne réponse).
   - B) Exactement 1 zone de disponibilité.
   - C) Au moins 10 zones de disponibilité.
   - D) Exactement 2 zones de disponibilité.
