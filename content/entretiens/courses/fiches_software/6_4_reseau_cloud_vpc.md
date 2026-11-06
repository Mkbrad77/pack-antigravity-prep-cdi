# Fiche Mémo 6.4 : Fondamentaux réseau cloud (VPC, Sous-réseaux, Sécurité)

## 1. Les briques incontournables d'un VPC sécurisé
- **Sous-réseau public (Public Subnet) :** Possède une route directe vers une passerelle Internet (Internet Gateway). Héberge les répartiteurs de charge (Load Balancers) publics et les passerelles NAT.
- **Sous-réseau privé (Private Subnet) :** Pas d'accès direct depuis l'extérieur. Héberge les bases de données (RDS, Redshift), les clusters Spark (EMR) et les workers de traitement.
- **Passerelle NAT (NAT Gateway) :** Située dans le sous-réseau public, elle permet aux serveurs du sous-réseau privé de sortir sur Internet (télécharger des mises à jour, appeler une API externe) sans jamais accepter de connexions entrantes directes.

## 2. Security Groups vs Network ACLs
- **Security Groups :** Pare-feu virtuel au niveau de l'instance. **Stateful** (si le trafic entrant est autorisé, la réponse sortante est automatiquement autorisée).
- **Network ACLs (NACL) :** Pare-feu au niveau du sous-réseau. **Stateless** (les règles entrantes et sortantes doivent être définies explicitement).
