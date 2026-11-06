# Chapitre 10 : Réseau Virtuel AWS et Sécurité Périmétrique (Amazon VPC)

## 1. Objectifs d'apprentissage
- Comprendre la structure d'Amazon VPC : sous-réseaux publics, privés et tables de routage.
- Distinguer les Groupes de Sécurité (Security Groups) et les NACL.
- Maîtriser le rôle des passerelles : Internet Gateway (IGW) et NAT Gateway.
- Connaître les options de connectivité hybride (Direct Connect, AWS VPN, VPC Peering).

## 2. Explication claire : quand choisir quoi
Amazon VPC permet de créer un réseau virtuel isolé avec une plage CIDR définie :

Composants d'un VPC :
- Sous-réseau public : relié à une Internet Gateway (IGW), permettant aux ressources d'avoir une IP publique et d'échanger avec Internet.
- Sous-réseau privé : isolé d'Internet sans accès entrant direct, pour les bases de données et serveurs applicatifs.
- Passerelle NAT (NAT Gateway) : située dans un sous-réseau public, elle permet aux instances privées d'accéder à Internet en sortie (mises à jour) sans accepter de connexions entrantes.
- Internet Gateway (IGW) : passerelle gérée hautement disponible reliant le VPC à Internet.

Sécurité réseau :
- Groupes de Sécurité (Security Groups) :
  - Pare-feu au niveau de l'instance (carte ENI).
  - À état (Stateful) : si le trafic entrant est autorisé, le trafic sortant de retour est automatiquement permis.
  - Règles d'autorisation uniquement (Allow rules).
- Listes de contrôle d'accès réseau (NACL) :
  - Pare-feu au niveau du sous-réseau entier.
  - Sans état (Stateless) : règles entrantes et sortantes requises.
  - Supporte les règles d'autorisation (Allow) et de refus (Deny), évaluées par ordre croissant.

Connectivité :
- AWS Direct Connect : liaison physique dédiée privée entre datacenter et AWS, évitant Internet.
- AWS Site-to-Site VPN : tunnel chiffré IPsec sur Internet public reliant un site à un VPC.
- Peering VPC : connexion directe privée entre deux VPC. Non transitif.

## 3. Définitions des termes clés
- Stateful : mémorise l'état de la connexion (Security Group).
- Stateless : ne mémorise rien, chaque paquet est filtré à l'entrée et à la sortie (NACL).
- Bloc CIDR : plage d'adresses IP attribuée au VPC (ex. 10.0.0.0/16).

## 4. Exemple concret
Architecture 3 tiers :
- Web tier : Load Balancer dans sous-réseau public relié à l'IGW.
- App tier : instances EC2 en sous-réseau privé communiquant via NAT Gateway.
- Data tier : base RDS en sous-réseau privé isolé, accessible uniquement depuis le Security Group applicatif.

## 5. Comparaisons et pièges d'examen
- Security Group vs NACL : Security Group opère au niveau de l'instance et est Stateful ; NACL opère au niveau du sous-réseau et est Stateless avec support de règles Deny.
- Direct Connect vs VPN : Direct Connect est une liaison physique dédiée ; VPN est un tunnel IPsec établi via Internet.
- NAT Gateway : doit impérativement être déployée dans un sous-réseau public.

## 6. Lien avec SQL, Snowflake et Databricks
AWS PrivateLink connecte votre VPC à un entrepôt Snowflake hébergé sur AWS sans transiter par Internet public, garantissant un transfert de données entièrement privé.

## 7. Renvois automatiques
- Voir aussi : cours Amadou Merico, leçons 61 à 74.
- Revue officielle AWS Skill Builder : Exam Prep Overview: AWS Certified Cloud Practitioner (CLF-C02).

## 8. Mini-quiz du chapitre
1. Quel pare-feu virtuel est à état (Stateful) et opère au niveau de l'instance EC2 ?
   - A) Le Groupe de Sécurité (Security Group) (Bonne réponse).
   - B) La liste de contrôle d'accès réseau (NACL).
   - C) La passerelle NAT.
   - D) Le routeur virtuel de sous-réseau.
2. Quel service fournit une liaison réseau physique dédiée privée sans passer par Internet ?
   - A) AWS Direct Connect (Bonne réponse).
   - B) AWS Site-to-Site VPN.
   - C) Amazon CloudFront.
   - D) AWS Storage Gateway.
