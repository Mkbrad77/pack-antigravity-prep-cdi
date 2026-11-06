# Chapitre 32 : Sécurité Réseau, Amazon VPC et Points de Terminaison VPC PrivateLink

## 1. Objectifs d'apprentissage
- Sécuriser les flux de données au sein d'un Amazon VPC privé.
- Différencier les points de terminaison VPC : Gateway Endpoints vs Interface Endpoints (PrivateLink).
- Maîtriser le routage et le filtrage (Security Groups, NACL).
- Éliminer l'exposition des pipelines de données à Internet public.

## 2. Explication claire : quand choisir quoi
Un Data Lake sécurisé isole le trafic au sein du réseau privé virtuel sans exposition à Internet public :

1. Points de terminaison VPC (VPC Endpoints) :
- Gateway Endpoints :
  - Supportés exclusivement pour deux services : **Amazon S3** et **Amazon DynamoDB**.
  - S'intègrent directement dans la table de routage du VPC.
  - Entièrement gratuits : aucun coût horaire ni frais de transfert de données.
  - Ne permettent pas l'accès depuis des réseaux sur site via Direct Connect ou VPN.
- Interface Endpoints (AWS PrivateLink) :
  - Créent une interface réseau élastique (ENI) avec une adresse IP privée locale dans votre sous-réseau.
  - Supportés pour la majorité des services AWS (Kinesis, Glue, Redshift, Athena, Secrets Manager).
  - Facturés à l'heure d'exécution et au volume de données transféré.
  - Accessibles depuis des réseaux d'entreprise sur site via AWS Direct Connect ou AWS VPN.

2. Politiques de points de terminaison (Endpoint Policies) :
- Documents JSON attachés au point de terminaison limitant quelles ressources externes peuvent être atteintes.
- Exemple : restreindre le Gateway Endpoint S3 pour qu'il autorise uniquement les écritures vers le bucket Data Lake officiel de l'entreprise, empêchant la fuite de données vers des comptes tiers.

## 3. Définitions des termes clés
- PrivateLink : technologie établissant des connexions privées entre VPC et services AWS sans passer par Internet.
- ENI (Elastic Network Interface) : carte réseau virtuelle attachée à un sous-réseau VPC disposant d'une IP privée.
- Gateway Endpoint : cible de routage VPC gratuite vers S3 et DynamoDB.

## 4. Exemple concret
Table de routage VPC avec Gateway Endpoint S3 :
```
Destination       | Cible
10.0.0.0/16       | local
pl-63a5400a (S3)  | vpce-0a1b2c3d4e5f (Gateway Endpoint)
```

## 5. Comparaisons et pièges d'examen
- Gateway Endpoint vs Interface Endpoint pour S3 : privilégier le Gateway Endpoint pour les accès au sein du VPC en raison de sa gratuité totale ; choisir l'Interface Endpoint si des serveurs sur site doivent accéder au bucket S3 via Direct Connect.
- NAT Gateway vs VPC Endpoint : utiliser un VPC Endpoint pour accéder aux services AWS plutôt qu'une passerelle NAT évite les coûts de traitement NAT et améliore la sécurité.

## 6. Lien avec SQL, Snowflake et Databricks
Snowflake Business Critical utilise AWS PrivateLink pour que les requêtes et transferts entre le VPC de l'entreprise et les serveurs Snowflake restent confinés sur le réseau privé AWS.

## 7. Renvois automatiques
- Voir aussi : cours Maarek et Kane, leçons 286 à 300.
- Revue officielle AWS Skill Builder : Domain 4 Review (DEA-C01) : sécurité et gouvernance.

## 8. Mini-quiz du chapitre
1. Quelle solution gratuite permet à des instances EC2 situées dans un sous-réseau privé d'accéder à un compartiment S3 sans passer par Internet ni configurer de passerelle NAT ?
   - A) Un VPC Gateway Endpoint configuré dans la table de routage (Bonne réponse).
   - B) Une passerelle Internet (IGW).
   - C) Un VPC Peering public.
   - D) Une instance EC2 bastion.
2. Une entreprise doit permettre à ses serveurs sur site d'accéder à Amazon S3 via une liaison AWS Direct Connect privée. Quel type de point de terminaison est requis ?
   - A) Un VPC Interface Endpoint (AWS PrivateLink) pour S3 (Bonne réponse).
   - B) Un VPC Gateway Endpoint pour S3.
   - C) Un connecteur AWS Snowball.
   - D) Une règle de routage NAT statique.
