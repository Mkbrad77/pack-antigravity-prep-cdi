import fs from 'node:fs';
import path from 'node:path';
import { makeQDomain } from './question_builder.js';

const DOMAIN_2 = 'Domaine 2 : Magasins de données et gestion du stockage (26 %)';
const makeQ = (idNum, topic_id, statement, options, correct_answer, expA, expB, expC, expD, source_url) =>
  makeQDomain(DOMAIN_2, idNum, topic_id, statement, options, correct_answer, expA, expB, expC, expD, source_url, 'dea', 'moyen', 120);

const questions = [];
let qNum = 103;

// ==========================================
// S3 (15 questions: 103-117)
// ==========================================

questions.push(makeQ(
  qNum++, 's3',
  "Une entreprise archive 50 To de données financières réglementaires par an dans Amazon S3. Ces données ne sont consultées qu'une fois tous les deux ou trois ans en cas d'audit fiscal. L'équipe d'audit exige un délai de restitution inférieur à 5 minutes pour chaque dossier. Quelle classe de stockage S3 offre le coût mensuel le plus bas tout en respectant ce SLA de récupération ?",
  [
    "A) S3 Glacier Flexible Retrieval avec option de récupération accélérée (Expedited Retrieval)",
    "B) S3 Glacier Deep Archive en récupération standard",
    "C) S3 Standard",
    "D) S3 One Zone-IA"
  ],
  "A",
  "S3 Glacier Flexible Retrieval offre un coût de stockage très bas et permet une récupération accélérée (Expedited) en 1 à 5 minutes pour les cas d'urgence, répondant au SLA de 5 minutes",
  "S3 Glacier Deep Archive demande un délai minimal de récupération de 12 heures en mode Standard et ne propose pas d'option de récupération accélérée",
  "S3 Standard entraîne un coût de stockage mensuel environ six fois plus élevé que Glacier pour des données consultées tous les trois ans",
  "S3 One Zone-IA stocke les données dans une seule zone de disponibilité, ce qui ne garantit pas la résilience requise pour des archives financières réglementaires",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Un Data Lake sur Amazon S3 subit une forte charge de requêtes analytiques distribuées atteignant 12 000 requêtes GET par seconde sur un préfixe unique 's3://lake/raw/'. Les requêtes reçoivent des erreurs HTTP 503 Slow Down. Quelle architecture résout ce problème de performance ?",
  [
    "A) Répartir les objets sur plusieurs préfixes distincts (par exemple par date ou hash) pour bénéficier de 5 500 requêtes GET/s par préfixe",
    "B) Déployer une instance AWS Storage Gateway devant le compartiment",
    "C) Réduire la taille des objets stockés sous 1 Mo",
    "D) Remplacer le compartiment S3 par un volume EBS gp3 partagé"
  ],
  "A",
  "chaque préfixe S3 distinct supporte indépendamment 5 500 requêtes GET/HEAD et 3 500 requêtes PUT/POST/DELETE par seconde; multiplier les préfixes permet d'absorber horizontalement 12 000 GET/s",
  "Storage Gateway est conçu pour les connexions hybrides sur site et ajouterait un goulot d'étranglement de bande passante réseau",
  "réduire la taille des objets augmente le nombre total de requêtes HTTP et aggrave le problème de limitation de débit par préfixe",
  "un volume EBS standard ne peut pas être partagé en lecture/écriture concurrente par des milliers de clients analytiques distribués comme S3",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Une application de streaming vidéo génère des fichiers de logs compressés de 8 Go chacun qui doivent être téléversés sur Amazon S3 via une connexion réseau sujette à des micro-coupures. Quelle recommandation AWS garantit un transfert fiable et performant ?",
  [
    "A) Utiliser l'API S3 Multipart Upload pour envoyer le fichier par blocs de 100 Mo en parallèle",
    "B) Utiliser une requête PUT simple standard avec un délai d'expiration allongé à 24 heures",
    "C) Convertir au préalable le fichier binaire en texte Base64",
    "D) Envoyer les octets un par un via un socket TCP brut vers l'API S3"
  ],
  "A",
  "l'API Multipart Upload est recommandée pour les fichiers de plus de 100 Mo (et obligatoire au-delà de 5 Go); elle permet le téléversement parallèle des blocs et reprend uniquement les fragments échoués sans réexpédier l'intégralité du fichier",
  "un PUT simple échoue complètement en cas de micro-coupure réseau et ne supporte pas d'objet dépassant 5 Go en un seul appel",
  "l'encodage en Base64 augmente inutilement la taille des données d'environ 33 % et ralentit le transfert",
  "l'envoi direct TCP brut ne respecte pas le protocole HTTP REST sécurisé d'Amazon S3",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Un Data Engineer configure une politique de cycle de vie (S3 Lifecycle) pour transférer des fichiers CSV vers S3 Standard-IA après 30 jours, puis vers S3 Glacier Flexible Retrieval après 90 jours. Quelle contrainte de facturation AWS doit être prise en compte concernant la taille minimale des objets ?",
  [
    "A) Les objets inférieurs à 128 Ko sont facturés pour un minimum de 128 Ko dans S3 Standard-IA",
    "B) Les objets de moins de 1 Mo sont automatiquement supprimés lors de la transition",
    "C) S3 Standard-IA ne facture aucun frais pour les requêtes de transition",
    "D) La durée minimale de rétention facturée pour S3 Glacier est de 3 jours"
  ],
  "A",
  "S3 Standard-IA applique une taille minimale facturée de 128 Ko par objet; les objets plus petits subissent des frais de capacité disproportionnés",
  "les politiques de cycle de vie ne suppriment jamais automatiquement les petits objets sauf règle d'expiration explicite",
  "chaque transition d'objet vers une classe de stockage inférieure entraîne des frais de requête de cycle de vie",
  "S3 Glacier Flexible Retrieval impose une durée minimale facturée de 90 jours et non de 3 jours",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Une organisation doit empêcher toute suppression accidentelle ou malveillante d'enregistrements historiques dans S3 par n'importe quel utilisateur, y compris l'utilisateur racine (root) du compte AWS, pendant une période légale stricte de 7 ans. Quelle fonctionnalité S3 répond à cette exigence WORM ?",
  [
    "A) Activer S3 Object Lock en mode Conformité (Compliance Mode) avec une période de rétention de 7 ans",
    "B) Activer S3 Object Lock en mode Gouvernance (Governance Mode)",
    "C) Définir une politique IAM refusant l'action s3:DeleteObject pour les rôles applicatifs",
    "D) Configurer un compartiment chiffré par une clé KMS gérée par le client (SSE-KMS)"
  ],
  "A",
  "le mode Conformité (Compliance Mode) de S3 Object Lock garantit qu'aucun utilisateur, y compris l'administrateur ou le compte root AWS, ne peut supprimer l'objet ou altérer sa période de rétention pendant la durée fixée",
  "le mode Gouvernance permet aux utilisateurs possédant des autorisations IAM spécifiques (s3:BypassGovernanceRetention) de supprimer les objets",
  "une politique IAM peut être modifiée ou contournée par un administrateur disposant des droits complets ou par le compte root",
  "le chiffrement KMS protège la confidentialité des données au repos mais n'empêche pas l'écrasement ou la suppression d'objets",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Dans un compartiment Amazon S3 avec gestion des versions (Versioning) activée, qu'advient-il lorsqu'un utilisateur exécute une commande DELETE simple sur un objet sans spécifier d'identifiant de version (Version ID) ?",
  [
    "A) Amazon S3 insère un marqueur de suppression (Delete Marker) avec un nouvel ID de version, et l'objet semble supprimé lors d'un GET standard",
    "B) L'objet et toutes ses versions antérieures sont définitivement et irréversiblement détruits",
    "C) L'opération DELETE est systématiquement rejetée avec un code d'erreur HTTP 403 Forbidden",
    "D) S3 conserve le fichier et déplace l'objet vers la corbeille locale AWS CloudShell"
  ],
  "A",
  "lorsqu'une suppression sans version ID est exécutée sur un compartiment versionné, S3 ajoute un marqueur de suppression devenant la version actuelle; l'objet peut être restauré en supprimant ce marqueur",
  "la destruction définitive nécessite la suppression explicite de chaque Version ID individuel ou une règle de cycle de vie",
  "l'opération réussit avec un code HTTP 204 et la création du marqueur si les autorisations IAM sont valides",
  "Amazon S3 ne possède pas de corbeille CloudShell; le versioning natif constitue le mécanisme de protection",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Une banque multinationale doit répliquer des données critiques de Paris (eu-west-3) vers Francfort (eu-central-1) dans un délai maximal contractuel de 15 minutes pour 99,9 % des nouveaux objets. Quel paramètre de réplication S3 permet de respecter et monitorer ce SLA ?",
  [
    "A) Activer S3 Replication Time Control (S3 RTC) sur la règle de réplication inter-régionale (CRR)",
    "B) Utiliser une tâche AWS DataSync programmée toutes les 15 minutes",
    "C) Configurer une fonction AWS Lambda déclenchée par S3 Event Notifications pour copier les objets",
    "D) Activer la réplication bidirectionnelle asynchrone sans options additionnelles"
  ],
  "A",
  "S3 RTC (Replication Time Control) est conçu spécifiquement pour garantir contractuellement la réplication de 99,9 % des objets en moins de 15 minutes, avec métriques CloudWatch et alarmes de dépassement SLA",
  "DataSync est un service de transfert par lots qui consomme des ressources de calcul et ne fournit pas de garantie de latence de 15 minutes au niveau objet S3",
  "Lambda peut subir des limites de concurrence, des dépassements de temps d'exécution sur de gros fichiers et demande une maintenance de code complexe",
  "la réplication CRR standard est asynchrone et sans engagement de délai d'exécution garanti (best-effort)",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-time-control.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Une application interroge un fichier CSV de 50 Go stocké sur S3 pour extraire uniquement les lignes correspondant au code postal '75001', ce qui représente environ 10 Mo de données. Quelle fonctionnalité S3 permet de filtrer ces données directement au niveau du stockage avant le transfert réseau ?",
  [
    "A) S3 Select",
    "B) S3 Transfer Acceleration",
    "C) S3 Multi-Region Access Points",
    "D) S3 Object Lambda"
  ],
  "A",
  "S3 Select permet d'exécuter des requêtes SQL simples directement sur des objets CSV, JSON ou Parquet stockés dans S3, renvoyant uniquement le sous-ensemble de données filtrées et réduisant drastiquement le trafic réseau et la charge de calcul cliente",
  "S3 Transfer Acceleration optimise la vitesse de transfert réseau via les points de présence CloudFront mais ne filtre pas le contenu des fichiers",
  "les points d'accès multi-régions routent le trafic vers le compartiment le plus proche sans effectuer de filtrage de données",
  "S3 Object Lambda permet de transformer les données à l'aide de code Python/Java personnalisé lors d'un GET, mais S3 Select est la fonctionnalité native sans code pour les requêtes SQL déclaratives",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/selecting-content-from-objects.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Pour optimiser les coûts de stockage d'un Data Lake hétérogène de plusieurs pétaoctets dont les modèles d'accès aux données sont totalement imprévisibles, quelle classe de stockage S3 déplace automatiquement les objets entre plusieurs niveaux d'accès sans frais de récupération ni pénalité opérationnelle ?",
  [
    "A) S3 Intelligent-Tiering",
    "B) S3 One Zone-IA",
    "C) S3 Glacier Instant Retrieval",
    "D) S3 Reduced Redundancy Storage (RRS)"
  ],
  "A",
  "S3 Intelligent-Tiering surveille les motifs d'accès et déplace automatiquement les objets entre les niveaux Frequent, Infrequent, Archive Instant, et optionnellement Deep Archive, sans frais de récupération de données",
  "S3 One Zone-IA impose des frais de récupération et nécessite une connaissance préalable de la fréquence d'accès",
  "S3 Glacier Instant Retrieval facture chaque gigaoctet extrait et convient aux accès connus et peu fréquents",
  "RRS est une classe obsolète et déconseillée qui n'offre aucune hiérarchisation automatique",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Quelle commande ou paramètre S3 permet d'annuler automatiquement les fragments orphelins de téléversements partitionnés non finalisés (Incomplete Multipart Uploads) afin d'éviter des coûts de stockage fantômes cumulés ?",
  [
    "A) Créer une règle de cycle de vie S3 avec l'action 'AbortIncompleteMultipartUpload'",
    "B) Exécuter quotidiennement un script AWS CLI appelant aws s3 rm --recursive",
    "C) Désactiver le versioning du compartiment S3",
    "D) Activer le chiffrement par défaut SSE-S3"
  ],
  "A",
  "la règle de cycle de vie avec l'action AbortIncompleteMultipartUpload permet de purger automatiquement les fragments de fichiers multipart abandonnés après un nombre défini de jours, libérant l'espace disque non référencé",
  "la commande s3 rm standard ne liste ni ne supprime les fragments en cours de téléversement multipart non finalisés",
  "désactiver le versioning n'a aucun effet sur les fragments de téléversements multipart en attente",
  "le chiffrement par défaut chiffre les fragments mais ne gère pas leur cycle de vie ni leur suppression",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Une architecture de traitement d'événements doit déclencher instantanément un workflow AWS Step Functions dès qu'un nouveau fichier JSON arrive dans un préfixe S3 spécifique. Quelle méthode d'intégration offre la plus grande fiabilité et un découplage recommandé par AWS ?",
  [
    "A) Activer les notifications d'événements Amazon EventBridge directement sur le compartiment S3 et router vers Step Functions",
    "B) Configurer un script cron sur une instance EC2 vérifiant toutes les 10 secondes le contenu du préfixe S3",
    "C) Utiliser S3 Batch Operations pour déclencher la machine à états",
    "D) Écrire une fonction Lambda exécutée en continu dans une boucle infinie"
  ],
  "A",
  "l'intégration native de S3 avec Amazon EventBridge permet d'envoyer des événements détaillés avec filtrage sur les préfixes et suffixes, offrant un routage déclaratif, fiable et découplé vers Step Functions sans code d'infrastructure",
  "le polling régulier par instance EC2 génère des coûts de requêtes LIST S3 superflus et introduit une latence de détection",
  "S3 Batch Operations est destiné au traitement par lots asynchrone de milliards d'objets existants et non à la capture d'événements en temps réel",
  "une boucle infinie dans Lambda est bloquée par la limite stricte de 15 minutes d'exécution et viole les bonnes pratiques cloud",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventBridge.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Quelle est la taille maximale d'un objet unique pouvant être stocké dans Amazon S3, et quelle est la taille maximale pouvant être téléversée via une seule opération PUT standard ?",
  [
    "A) Taille maximale de l'objet : 5 To; taille maximale d'un PUT simple : 5 Go",
    "B) Taille maximale de l'objet : 100 To; taille maximale d'un PUT simple : 10 Go",
    "C) Taille maximale de l'objet : 5 Go; taille maximale d'un PUT simple : 5 Go",
    "D) Taille maximale de l'objet : illimitée; taille maximale d'un PUT simple : 100 Mo"
  ],
  "A",
  "un objet S3 individuel peut atteindre jusqu'à 5 To, mais une seule opération HTTP PUT direct est limitée à 5 Go; au-delà de 5 Go, le recours à l'API Multipart Upload est impératif",
  "la limite maximale d'un objet S3 n'est pas de 100 To mais de 5 To",
  "un objet S3 peut dépasser 5 Go via le Multipart Upload jusqu'à 5 To",
  "la taille totale d'un compartiment est virtuellement illimitée, mais la taille d'un objet individuel est bornée à 5 To",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Une organisation souhaite auditer l'efficacité de ses coûts de stockage et identifier les compartiments ou préfixes n'appliquant pas de règles d'expiration sur les anciennes versions d'objets à l'échelle de l'organisation AWS Organizations. Quel outil AWS fournit ce tableau de bord analytique ?",
  [
    "A) Amazon S3 Storage Lens",
    "B) AWS Trusted Advisor",
    "C) AWS Cost Explorer",
    "D) Amazon Inspector"
  ],
  "A",
  "S3 Storage Lens fournit une visibilité globale à l'échelle d'une organisation sur l'utilisation du stockage, les métriques d'activité, les ratios de versioning et des recommandations d'optimisation des coûts avec export de métriques",
  "Trusted Advisor propose quelques vérifications globales mais n'offre pas l'analyse fine des préfixes et métriques d'activité détaillées fournies par S3 Storage Lens",
  "Cost Explorer affiche les montants financiers agrégés mais ne descend pas au niveau de la structure interne des objets et préfixes S3",
  "Amazon Inspector est un outil de sécurité pour détecter les vulnérabilités logicielles et les expositions réseau sur EC2 et ECR",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Lors de la configuration de la réplication S3 inter-régionale (CRR) entre un compte source A et un compte de destination B, quelle condition préalable obligatoire doit être satisfaite sur les compartiments source et cible ?",
  [
    "A) La gestion des versions (Versioning) doit être activée sur les deux compartiments source et de destination",
    "B) Les deux compartiments doivent porter exactement le même nom",
    "C) Le chiffrement SSE-C géré par le client doit obligatoirement être activé",
    "D) Les deux compartiments doivent résider dans la même région AWS"
  ],
  "A",
  "la réplication S3 (CRR comme SRR) exige impérativement que le versioning soit activé à la fois sur le compartiment source et sur le compartiment de destination afin de propager fidèlement les états et marqueurs de suppression",
  "les noms de compartiments S3 sont globalement uniques à l'échelle mondiale, deux compartiments ne peuvent donc jamais avoir le même nom",
  "les objets chiffrés avec SSE-C (clés fournies par le client) ne peuvent pas être répliqués par la réplication native S3",
  "la réplication CRR (Cross-Region Replication) nécessite par définition que les compartiments soient situés dans des régions AWS différentes",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-how-setup.html"
));

questions.push(makeQ(
  qNum++, 's3',
  "Un client mondial souhaite accélérer le téléversement de fichiers multimédias volumineux vers un compartiment S3 centralisé situé en Virginie (us-east-1) depuis des filiales situées en Asie et en Europe. Quelle solution exploite le réseau mondial d'AWS sans modifier l'architecture applicative ?",
  [
    "A) Activer Amazon S3 Transfer Acceleration sur le compartiment",
    "B) Créer des tunnels VPN IPsec point à point vers chaque filiale",
    "C) Utiliser AWS Direct Connect entre chaque pays et la Virginie",
    "D) Déployer des instances EC2 intermédiaires avec rsync"
  ],
  "A",
  "S3 Transfer Acceleration exploite les points de présence périphériques mondiaux d'Amazon CloudFront pour acheminer le trafic entrant sur le réseau dorsal optimisé d'AWS jusqu'au compartiment S3 cible",
  "les tunnels VPN IPsec transitent par l'Internet public et sont limités en bande passante et sujets à la gigue intercontinentale",
  "AWS Direct Connect engendre des coûts de liaisons dédiées très élevés et des délais de déploiement de plusieurs mois, inadaptés pour du simple téléversement applicatif",
  "les instances EC2 intermédiaires nécessitent une gestion d'infrastructure, de disques relais et de maintenance superflue",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html"
));

// ==========================================
// APACHE ICEBERG & S3 TABLES (14 questions: 118-131)
// ==========================================

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Quelle nouvelle ressource de stockage introduite dans le guide DEA-C01 v1.1 fournit des compartiments optimisés spécifiquement pour le format tabulaire Apache Iceberg, offrant jusqu'à 3x le débit de requêtes et une maintenance automatisée des tables ?",
  [
    "A) Amazon S3 Tables (Table Buckets)",
    "B) AWS Snowball Edge Storage Optimized",
    "C) Amazon FSx for OpenZFS",
    "D) Amazon Elastic Block Store (EBS) multi-attach"
  ],
  "A",
  "Amazon S3 Tables fournit des types de compartiments de tables spécialement conçus pour stocker des tables tabulaires ouvertes au format Apache Iceberg, avec gestion intégrée de la compaction et accélération de débit",
  "Snowball Edge est un dispositif physique de transport de données pour les migrations hors ligne",
  "FSx for OpenZFS est un système de fichiers POSIX et non un magasin d'objets tabulaire",
  "EBS est un stockage bloc attaché à des instances EC2 et non un service Data Lake ouvert",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables.html"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Dans l'architecture de métadonnées d'Apache Iceberg, quel fichier constitue le point d'entrée unique référencé par le catalogue (tel qu'AWS Glue Data Catalog) pour pointer vers l'état actuel de la table ?",
  [
    "A) Le fichier de métadonnées de table (metadata.json)",
    "B) Le fichier Manifest List (.avro)",
    "C) Le fichier Manifest individuel (.avro)",
    "D) Le fichier de données Parquet (.parquet)"
  ],
  "A",
  "le catalogue Iceberg pointe directement vers le dernier fichier metadata.json (contenant le schéma, les specs de partitionnement et la liste des snapshots); ce fichier référence à son tour le Manifest List de chaque snapshot",
  "le fichier Manifest List liste les fichiers manifestes mais est lui-même référencé à l'intérieur du metadata.json",
  "les fichiers manifestes listent les fichiers de données individuels et se trouvent au troisième niveau de la hiérarchie",
  "les fichiers Parquet contiennent les données brutes et ne gèrent pas le pointeur d'état de la table",
  "https://iceberg.apache.org/spec/#table-metadata-architecture"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Une application analytique utilisant Apache Iceberg effectue des flux continus de micro-insertions (streaming writes) toutes les 10 secondes. Au bout de quelques semaines, les performances des requêtes Athena se dégradent fortement. Quelle opération de maintenance Iceberg résout ce problème ?",
  [
    "A) Exécuter une procédure de compaction (rewrite_data_files) pour fusionner les petits fichiers de données en fichiers de 128 à 512 Mo",
    "B) Supprimer le fichier metadata.json le plus récent",
    "C) Réécrire manuellement l'intégralité de la table au format CSV",
    "D) Doubler la fréquence des micro-insertions pour forcer un rafraîchissement"
  ],
  "A",
  "la compaction via rewrite_data_files regroupe les petits fichiers générés par le streaming en fichiers Parquet de taille optimale (128-512 Mo), réduisant drastiquement l'overhead d'ouverture de fichiers et de lecture des métadonnées",
  "supprimer metadata.json corromprait la table et la rendrait totalement illisible par les moteurs d'interrogation",
  "le format CSV est non colonnaire, non typé et n'offre pas les capacités transactionnelles d'Iceberg",
  "augmenter la fréquence des insertions aggraverait immédiatement le problème de prolifération des petits fichiers",
  "https://iceberg.apache.org/docs/latest/maintenance/#compact-data-files"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Quel avantage clé apporte le partitionnement masqué (Hidden Partitioning) d'Apache Iceberg par rapport au partitionnement traditionnel basé sur les répertoires Hive dans AWS Glue ?",
  [
    "A) Les utilisateurs peuvent requêter la table avec des filtres sur la colonne source (ex: timestamp) sans devoir connaître la fonction de partitionnement appliquée (ex: jour)",
    "B) Les données sont chiffrées avec une clé asymétrique masquée dans le catalogue",
    "C) Toutes les données sont obligatoirement regroupées dans un unique fichier monolithique",
    "D) Le partitionnement ne fonctionne que sur des colonnes de type booléen"
  ],
  "A",
  "le partitionnement masqué évite aux utilisateurs de devoir écrire des clauses WHERE redondantes ou d'exposer la formule de transformation (comme date(ts)); le moteur Iceberg traduit automatiquement le prédicat pour élaguer les partitions (partition pruning)",
  "le terme masqué ne fait pas référence à un chiffrement cryptographique des métadonnées",
  "Iceberg distribue les données sur de multiples fichiers de données optimisés et non dans un fichier unique",
  "Iceberg supporte le partitionnement masqué sur les timestamps, dates, entiers (bucket, truncate) et chaînes",
  "https://iceberg.apache.org/docs/latest/partitioning/"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Une équipe d'ingénierie des données doit auditer une anomalie apparue dans une table Iceberg et souhaite exécuter une requête SQL pour voir l'état exact des données tel qu'il était hier à 14h00. Quelle fonctionnalité permet cette analyse sans restaurer de sauvegarde ?",
  [
    "A) Le Time Travel SQL en utilisant la clause FOR SYSTEM_TIME AS OF ou FOR SYSTEM_VERSION AS OF",
    "B) L'outil S3 Versioning Restore",
    "C) Le renommage manuel des dossiers S3 dans la console AWS",
    "D) La réinitialisation complète du cluster EMR"
  ],
  "A",
  "Apache Iceberg conserve un historique immuable des snapshots récents, permettant d'exécuter des requêtes de Time Travel via la clause standard FOR SYSTEM_TIME AS OF pour interroger la table dans un état antérieur",
  "S3 Versioning ne comprend pas la cohérence transactionnelle des snapshots répartis sur plusieurs fichiers de métadonnées et de données Iceberg",
  "renommer manuellement des dossiers S3 corromprait les pointeurs référencés dans les fichiers manifestes",
  "le cluster EMR est un moteur de calcul éphémère sans lien avec l'historique transactionnel de la table",
  "https://iceberg.apache.org/docs/latest/spark-queries/#time-travel"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Dans Apache Iceberg, quelle stratégie de gestion des suppressions (deletes) écrit les identifiants de lignes supprimées dans un fichier de suppression distinct (delete file) lors de l'écriture pour accélérer les opérations de modification sans réécrire immédiatement tout le fichier Parquet ?",
  [
    "A) Merge-on-Read (MoR)",
    "B) Copy-on-Write (CoW)",
    "C) Append-Only",
    "D) Write-Ahead Log (WAL) pur"
  ],
  "A",
  "Merge-on-Read (MoR) sépare les écritures de suppressions ou mises à jour dans des fichiers de suppression légers (positional ou equality delete files), différant la fusion à la lecture ou à la compaction future",
  "Copy-on-Write réécrit immédiatement l'intégralité du fichier de données Parquet contenant la ligne modifiée, ce qui est plus coûteux en écriture",
  "Append-Only n'autorise aucune suppression ni mise à jour et ne permet que l'ajout de nouveaux enregistrements",
  "WAL est un mécanisme interne de base de données relationnelle et non une stratégie de gestion de fichiers tabulaires Iceberg",
  "https://iceberg.apache.org/spec/#row-level-deletes"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Quelle tâche de maintenance régulière est indispensable dans un Data Lake Apache Iceberg pour éviter que les anciens snapshots et les fichiers de données associés ne consomment de l'espace disque S3 indéfiniment ?",
  [
    "A) Exécuter la procédure expire_snapshots",
    "B) Désactiver le catalogue AWS Glue",
    "C) Supprimer les rôles IAM de lecture",
    "D) Exécuter VACUUM FULL dans Amazon Redshift"
  ],
  "A",
  "la procédure expire_snapshots supprime les métadonnées des snapshots plus anciens qu'un seuil défini et libère l'espace de stockage S3 en supprimant les fichiers de données qui ne sont plus référencés par aucun snapshot valide",
  "désactiver le Glue Data Catalog rendrait les tables inaccessibles sans libérer aucun octet sur S3",
  "les rôles IAM gèrent les autorisations de sécurité et n'ont aucun rôle dans la gestion du cycle de vie des données de la table",
  "le VACUUM de Redshift opère sur les tables internes managées de Redshift et non sur le stockage externe Iceberg sur S3",
  "https://iceberg.apache.org/docs/latest/maintenance/#expire-snapshots"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Lors de l'utilisation d'Amazon S3 Tables pour gérer des tables Apache Iceberg, quelle fonction de maintenance est automatiquement exécutée par le service AWS sans nécessiter d'orchestrer des jobs Spark périodiques ?",
  [
    "A) La compaction automatique des petits fichiers et la suppression des fichiers non référencés",
    "B) La traduction automatique de toutes les colonnes en français",
    "C) L'inférence automatique de règles métier comptables",
    "D) La transformation des tables Iceberg en tables MySQL physiques"
  ],
  "A",
  "Amazon S3 Tables automatise les tâches de maintenance récurrentes d'Iceberg, notamment la compaction en continu des petits fichiers en fichiers optimisés et le nettoyage des fichiers obsolètes ou non référencés",
  "le service de stockage ne traduit pas linguistiquement le contenu des colonnes textuelles",
  "le service gère l'infrastructure de fichiers de tables mais n'infère pas de logique métier applicative",
  "S3 Tables maintient le format ouvert Iceberg et ne convertit pas les données vers un moteur relationnel OLTP MySQL",
  "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-table-maintenance.html"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Comment Apache Iceberg garantit-il l'atomicité lors de l'exécution simultanée de deux opérations d'écriture concurrentes (par exemple deux jobs Spark insérant des données dans la même table) ?",
  [
    "A) Par un mécanisme de validation optimiste (Optimistic Concurrency Control - OCC) vérifiant si le snapshot parent a changé avant de commiter",
    "B) En verrouillant l'ensemble du compartiment S3 en lecture seule",
    "C) En annulant systématiquement le premier job lancé",
    "D) En exigeant un cluster de consensus ZooKeeper dédié géré par le client"
  ],
  "A",
  "Apache Iceberg utilise le contrôle de concurrence optimiste (OCC): chaque transaction prépare ses fichiers et tente un commit atomique en vérifiant si le snapshot de base a été modifié entre-temps; en cas de conflit non chevauchant, un retry automatique tente de rebaser le commit",
  "Iceberg ne verrouille pas le compartiment S3, préservant la haute disponibilité et les lectures concurrentes",
  "la politique d'arbitrage ne pénalise pas le premier job; en cas de conflit bloquant, c'est le second job qui effectue un rollback ou un retry",
  "Iceberg délègue le commit atomique au catalogue sous-jacent (comme DynamoDB lock ou Glue Catalog) sans nécessiter de cluster ZooKeeper autonome",
  "https://iceberg.apache.org/spec/#concurrency"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Une entreprise souhaite faire évoluer le schéma d'une table Iceberg en renommant une colonne critique 'customer_id' en 'client_id' sans réécrire les téraoctets de fichiers Parquet existants sur S3. Comment Iceberg gère-t-il cette évolution de schéma ?",
  [
    "A) En utilisant des identifiants d'identification de colonnes uniques (Field IDs) indépendants du nom de la colonne dans les fichiers Parquet",
    "B) En exécutant un script Python qui renomme l'en-tête de chaque fichier Parquet",
    "C) En créant une copie intégrale de la table sous un nouveau nom",
    "D) L'évolution de schéma n'est pas supportée dans Iceberg sans réécriture complète"
  ],
  "A",
  "Iceberg associe à chaque colonne un Field ID immuable; les fichiers Parquet mappent les données sur ces Field IDs, ce qui permet de renommer, ajouter, supprimer ou réordonner des colonnes par simple mise à jour des métadonnées JSON sans réécrire les fichiers de données",
  "les fichiers Parquet sont immuables et ne possèdent pas d'en-tête modifiable indépendamment des données",
  "la duplication intégrale de la table est inutile et contraire aux principes de rentabilité du Data Lakehouse",
  "l'évolution complète et sans réécriture du schéma est l'une des fonctionnalités phares d'Apache Iceberg",
  "https://iceberg.apache.org/docs/latest/evolution/#schema-evolution"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Quel catalogue de métadonnées AWS entièrement géré fournit le support natif pour l'enregistrement et la gouvernance des tables Apache Iceberg avec intégration directe pour Amazon Athena et Amazon Redshift ?",
  [
    "A) AWS Glue Data Catalog",
    "B) AWS Secrets Manager",
    "C) Amazon RDS Proxy",
    "D) AWS Systems Manager Parameter Store"
  ],
  "A",
  "AWS Glue Data Catalog sert de catalogue central compatible Apache Iceberg, permettant d'enregistrer les pointeurs de tables et d'offrir une vue unifiée aux moteurs analytiques Athena, EMR et Redshift",
  "Secrets Manager stocke des identifiants et clés d'API mais ne gère pas de métadonnées de tables tabulaires",
  "RDS Proxy gère les pools de connexions vers des bases relationnelles RDS/Aurora",
  "Parameter Store stocke des paires clé-valeur de configuration et non des schémas de Data Lake",
  "https://docs.aws.amazon.com/glue/latest/dg/table-types-iceberg.html"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Dans Apache Iceberg, quelle est la fonction du fichier Manifest List (.avro) produit lors de chaque opération de commit ?",
  [
    "A) Il liste l'ensemble des fichiers manifestes qui composent le snapshot, avec leurs métadonnées de partition et statistiques de bornes",
    "B) Il stocke la clé de déchiffrement KMS de la table",
    "C) Il contient le résultat binaire des requêtes exécutées par les utilisateurs",
    "D) Il liste les adresses IP des serveurs de calcul autorisés à interroger la table"
  ],
  "A",
  "le Manifest List indexe chaque fichier manifeste du snapshot avec les plages de valeurs de partitions couvertes, ce qui permet au moteur d'élaguer des fichiers manifestes entiers avant même de les lire",
  "les clés KMS sont gérées par AWS Key Management Service et non dans les fichiers avro du Data Lake",
  "le Manifest List ne stocke aucun résultat de requête utilisateur",
  "la sécurité réseau et les IP sont administrées par les politiques IAM, Security Groups et VPC Endpoints",
  "https://iceberg.apache.org/spec/#manifest-lists"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Une procédure de maintenance Iceberg identifie des fichiers de données stockés dans S3 qui ne sont référencés par aucun fichier manifeste d'aucun snapshot de table. Quel utilitaire ou procédure permet de purger ces fichiers non référencés ?",
  [
    "A) remove_orphan_files",
    "B) s3 rm --all",
    "C) rollback_to_snapshot",
    "D) fast_forward"
  ],
  "A",
  "l'action remove_orphan_files compare les fichiers réels présents dans le stockage S3 aux fichiers référencés dans tous les snapshots valides et supprime physiquement les fichiers orphelins plus anciens qu'un délai de sécurité",
  "s3 rm --all détruirait indistinctement les fichiers de données légitimes et corromprait la table",
  "rollback_to_snapshot permet de revenir à un état antérieur de la table mais ne supprime pas les fichiers orphelins",
  "fast_forward permet d'avancer une branche de table vers un autre état sans gérer le nettoyage des fichiers",
  "https://iceberg.apache.org/docs/latest/maintenance/#remove-orphan-files"
));

questions.push(makeQ(
  qNum++, 'apache-iceberg',
  "Pourquoi le format Apache Iceberg est-il particulièrement adapté aux architectures Data Mesh modernes partagées entre plusieurs comptes AWS ?",
  [
    "A) Il fournit une sémantique ACID sur stockage objet S3 standard tout en permettant à différents moteurs (Athena, Spark, Redshift, Snowflake) de lire le même jeu de données sans copie",
    "B) Il oblige toutes les équipes à n'utiliser qu'un seul compte AWS centralisé",
    "C) Il convertit automatiquement toutes les requêtes SQL en code assembleur",
    "D) Il élimine totalement le besoin de définir des autorisations IAM"
  ],
  "A",
  "Iceberg est un standard ouvert supporté par de multiples moteurs de calcul indépendants; combiné avec S3 et Lake Formation, il permet le partage de données (Data Sharing) zéro-copie entre domaines métier",
  "le Data Mesh préconise au contraire la décentralisation par domaines sur des comptes AWS distincts",
  "Iceberg est un format de stockage sur disque et ne génère pas de code assembleur",
  "la gouvernance IAM et Lake Formation reste indispensable pour contrôler l'accès aux données",
  "https://aws.amazon.com/blogs/big-data/build-an-apache-iceberg-data-mesh-with-amazon-athena-and-aws-lake-formation/"
));

// ==========================================
// FORMATS DE STOCKAGE & COMPRESSION (9 questions: 132-140)
// ==========================================

questions.push(makeQ(
  qNum++, 'partitionnement-formats',
  "Pourquoi le format Apache Parquet est-il systématiquement privilégié par rapport au format CSV pour les requêtes analytiques sur de grands volumes de données dans Amazon Athena et Amazon EMR ?",
  [
    "A) Son organisation colonnaire permet la projection de colonnes et le saut de blocs de données grâce aux statistiques min/max par Row Group",
    "B) Il est lisible directement dans n'importe quel éditeur de texte brut sans outil additionnel",
    "C) Il ne supporte aucun algorithme de compression pour maximiser la vitesse d'écriture brute",
    "D) Il est conçu pour les écritures transactionnelles légères ligne par ligne (OLTP)"
  ],
  "A",
  "Parquet organise les données par colonnes au lieu de lignes; les moteurs analytiques ne lisent que les colonnes nécessaires (projection pruning) et sautent des blocs entiers grâce aux statistiques min/max stockées dans le footer",
  "Parquet est un format binaire complexe qui ne peut pas être lu dans un éditeur de texte brut comme le CSV",
  "Parquet compresse nativement les données à l'aide de Snappy, GZIP ou ZSTD pour réduire la taille sur disque",
  "Parquet est inadapté aux transactions OLTP ligne à ligne en raison du coût élevé de réécriture des colonnes",
  "https://docs.aws.amazon.com/athena/latest/ug/columnar-storage.html"
));

questions.push(makeQ(
  qNum++, 'partitionnement-formats',
  "Dans un pipeline de traitement distribué Apache Spark sur EMR, vous recevez des fichiers compressés volumineux de 20 Go chacun. Quel algorithme de compression brut appliqué à un fichier texte rend le fichier non découplable (non-splittable), forçant Spark à traiter chaque fichier sur un unique exécuteur ?",
  [
    "A) GZIP standard (.gz)",
    "B) Bzip2 (.bz2)",
    "C) Snappy encapsulé dans un conteneur Parquet",
    "D) Avro avec compression Deflate"
  ],
  "A",
  "un fichier texte brut compressé avec l'algorithme standard GZIP (.gz) ne contient pas de marqueurs de synchronisation périodiques, ce qui empêche Spark de découper le fichier en plusieurs blocs (splits) traités en parallèle",
  "Bzip2 fournit des blocs de synchronisation tous les 900 Ko permettant le découpage (splittable) en parallèle même sur du texte brut",
  "dans un conteneur Parquet, chaque Row Group est indépendant et peut être traité en parallèle même avec Snappy",
  "le format Avro inclut des marqueurs de synchronisation (sync markers) tous les quelques blocs, le rendant splittable quel que soit le codec",
  "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-file-formats.html"
));

questions.push(makeQ(
  qNum++, 'partitionnement-formats',
  "Une architecture de streaming temps réel ingère des événements télémétriques IoT hétérogènes dont le schéma évolue fréquemment avec l'ajout de nouvelles métriques. Quel format de données basé sur les lignes avec schéma JSON intégré est le plus adapté pour l'ingestion Kafka/MSK ?",
  [
    "A) Apache Avro",
    "B) Apache Parquet",
    "C) Apache ORC",
    "D) Fichiers binaires bruts sans schéma"
  ],
  "A",
  "Apache Avro est un format orienté lignes (row-based) compact et binaire qui sérialise les messages très rapidement avec validation de schéma centralisée (AWS Glue Schema Registry), idéal pour le streaming de messages individuels",
  "Parquet est orienté colonnes et requiert d'accumuler des centaines de milliers de lignes en mémoire avant de pouvoir écrire un Row Group",
  "ORC est également un format colonnaire conçu principalement pour les requêtes Hive/Presto et non pour l'envoi de messages de streaming individuels",
  "les binaires bruts sans schéma empêchent toute validation, rétrocompatibilité et gouvernance des données",
  "https://docs.aws.amazon.com/glue/latest/dg/schema-registry.html"
));

questions.push(makeQ(
  qNum++, 'partitionnement-formats',
  "Quel codec de compression moderne offre un excellent compromis entre un taux de compression proche de GZIP et une vitesse de décompression quasi équivalente à Snappy, recommandé pour le stockage à froid et intermédiaire dans les Data Lakes ?",
  [
    "A) Zstandard (zstd)",
    "B) LZO",
    "C) Zip classique",
    "D) TAR non compressé"
  ],
  "A",
  "Zstandard (zstd) développé par Meta offre des niveaux de compression ajustables combinant d'excellents ratios de compression (supérieurs ou égaux à GZIP) avec des vitesses de décompression exceptionnellement élevées",
  "LZO nécessite des étapes d'indexation complexes supplémentaires pour être splittable et compresse moins que zstd",
  "le format Zip classique n'est pas optimisé pour les calculs distribués analytiques de Data Lakes",
  "TAR regroupe simplement les fichiers sans appliquer aucun algorithme de réduction d'octets",
  "https://docs.aws.amazon.com/athena/latest/ug/compression-support.html"
));

questions.push(makeQ(
  qNum++, 'partitionnement-formats',
  "Dans un Data Lake Amazon S3 partitionné avec la convention Hive 's3://lake/orders/year=2026/month=10/day=31/', quel problème survient si les données sont sur-partitionnées par heure et par code client, créant des millions de fichiers de quelques kilo-octets ?",
  [
    "A) Le problème des petits fichiers (small files problem), provoquant une explosion des appels API S3 GET/LIST et une dégradation massive du temps d'exécution des requêtes",
    "B) Le blocage total du chiffrement KMS par dépassement de clés",
    "C) L'impossibilité physique pour S3 d'accueillir plus de 10 000 préfixes",
    "D) La suppression automatique des objets par les serveurs S3"
  ],
  "A",
  "le sur-partitionnement génère un trop grand nombre de petits fichiers; les moteurs de calcul passent plus de temps à négocier les métadonnées et requêtes HTTP S3 qu'à lire les données utiles, ruinant les performances",
  "le nombre de fichiers n'épuise pas le service KMS dès lors que les quotas de requêtes sont dimensionnés ou que Bucket Keys est activé",
  "S3 supporte un nombre virtuel illimité de préfixes sans restriction à 10 000",
  "S3 ne supprime jamais automatiquement des objets sans configuration explicite de règle de cycle de vie",
  "https://aws.amazon.com/blogs/big-data/top-10-performance-tuning-tips-for-amazon-athena/"
));

questions.push(makeQ(
  qNum++, 'partitionnement-formats',
  "Quelle est la taille de fichier Parquet généralement recommandée par AWS pour obtenir les meilleures performances lors des analyses avec Amazon Athena et Apache Spark sur Amazon EMR ?",
  [
    "A) Entre 128 Mo et 512 Mo",
    "B) Moins de 64 Ko",
    "C) Entre 100 Go et 500 Go",
    "D) Exactement 10 octets"
  ],
  "A",
  "une taille de fichier comprise entre 128 Mo et 512 Mo est idéale car elle correspond à la taille standard d'un bloc ou split de traitement HDFS/Spark, optimisant le parallélisme sans saturer la gestion des métadonnées",
  "des fichiers de 64 Ko aggravent le problème des petits fichiers et saturent les moteurs de calcul",
  "des fichiers de plusieurs centaines de gigaoctets empêchent un découpage efficace et peuvent générer des erreurs OutOfMemory lors du traitement",
  "10 octets ne permet même pas de stocker les métadonnées du footer Parquet",
  "https://docs.aws.amazon.com/athena/latest/ug/optimizing-performance.html"
));

questions.push(makeQ(
  qNum++, 'partitionnement-formats',
  "Dans un fichier Apache Parquet, comment appelle-t-on le regroupement logique horizontal de données comprenant toutes les colonnes découpées en blocs de données verticaux appelés Column Chunks ?",
  [
    "A) Row Group",
    "B) Shard",
    "C) Partition HDFS",
    "D) V-Slice"
  ],
  "A",
  "dans la structure interne de Parquet, un Row Group regroupe un ensemble horizontal de lignes (typiquement de 128 Mo à 1 Go en mémoire) où chaque colonne est stockée de manière contiguë dans un Column Chunk",
  "le terme Shard s'applique aux flux Kinesis ou aux bases de données distribuées et non à l'agencement interne Parquet",
  "une partition HDFS est un découpage physique de répertoires au niveau du système de fichiers",
  "le terme V-Slice n'existe pas dans la nomenclature officielle Apache Parquet",
  "https://parquet.apache.org/docs/file-format/"
));

questions.push(makeQ(
  qNum++, 'partitionnement-formats',
  "Quelle technique de codage employée par Apache Parquet remplace les valeurs de chaînes répétitives par de petits index numériques entiers pour réduire drastiquement l'espace de stockage et accélérer les comparaisons ?",
  [
    "A) L'encodage par dictionnaire (Dictionary Encoding)",
    "B) Le hachage SHA-256",
    "C) La tokenisation sémantique",
    "D) Le chiffrement asymétrique RSA"
  ],
  "A",
  "l'encodage par dictionnaire construit une table des valeurs uniques d'une colonne et remplace chaque occurrence dans les pages de données par son index entier, ce qui compresse fortement les données à faible cardinalité",
  "le hachage SHA-256 produit des empreintes fixes de 32 octets qui augmenteraient la taille des données au lieu de la réduire",
  "la tokenisation sémantique découpe du texte pour des modèles de langage de type LLM et non pour le stockage colonnaire de Data Lake",
  "le chiffrement RSA est un protocole de sécurité et non une méthode de compression par encodage de données",
  "https://parquet.apache.org/docs/file-format/data-pages/encodings/"
));

questions.push(makeQ(
  qNum++, 'partitionnement-formats',
  "Quelle méthode d'Amazon Athena permet de déclarer la structure des partitions d'une table via des plages prévisibles (ex: dates entre 2020 et 2026) dans les propriétés de métadonnées, éliminant totalement les appels lents à l'API 'GetPartitions' du Glue Data Catalog ?",
  [
    "A) Partition Projection",
    "B) MSCK REPAIR TABLE",
    "C) ANALYZE COMPRESSION",
    "D) S3 Select Pushdown"
  ],
  "A",
  "Partition Projection calcule en mémoire la liste des partitions valides à partir de règles déclaratives définies dans la table sans solliciter le Glue Data Catalog, divisant le temps de planification des requêtes complexes par dix",
  "MSCK REPAIR TABLE scanne au contraire récursivement tous les sous-dossiers S3 pour enregistrer les partitions dans le catalogue, ce qui est extrêmement lent sur des Data Lakes volumineux",
  "ANALYZE COMPRESSION est une commande interne Redshift pour recommander des encodages de colonnes",
  "S3 Select Pushdown filtre les octets au stockage mais ne gère pas la métadonnée des partitions dans Athena",
  "https://docs.aws.amazon.com/athena/latest/ug/partition-projection.html"
));

// ==========================================
// REDSHIFT (15 questions: 141-155)
// ==========================================

questions.push(makeQ(
  qNum++, 'redshift',
  "Dans un entrepôt de données Amazon Redshift, quel composant architectural analyse les requêtes SQL soumises par les clients, optimise les plans d'exécution, compile le code C++ et coordonne la distribution du travail aux nœuds de calcul ?",
  [
    "A) Le Leader Node (nœud coordinateur)",
    "B) Les Slices de calcul",
    "C) Le cluster KMS",
    "D) Le bucket S3 sous-jacent"
  ],
  "A",
  "le Leader Node gère les connexions SQL entrantes, valide les autorisations, optimise les requêtes, compile le code d'exécution et répartit les segments de calcul aux différents Compute Nodes",
  "les Slices sont des partitions de mémoire et de disques au sein des Compute Nodes exécutant les calculs en parallèle",
  "KMS gère uniquement les clés cryptographiques et n'analyse aucun code SQL",
  "S3 est un magasin d'objets externe et ne coordonne pas l'exécution des requêtes du cluster Redshift",
  "https://docs.aws.amazon.com/redshift/latest/dg/c_high_level_system_architecture.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Une grande table de faits 'ventes' (10 milliards de lignes) est fréquemment jointe avec une table de dimension 'clients' (50 millions de lignes) sur la colonne 'client_id'. Quel style de distribution Redshift (DISTSTYLE) minimise les mouvements de données sur le réseau (redistribution) lors de ces jointures ?",
  [
    "A) Distribuer les deux tables avec DISTSTYLE KEY sur la colonne 'client_id'",
    "B) Distribuer la table 'ventes' en DISTSTYLE ALL et 'clients' en DISTSTYLE EVEN",
    "C) Utiliser DISTSTYLE EVEN sur les deux tables",
    "D) Désactiver la distribution pour conserver toutes les données sur le Leader Node"
  ],
  "A",
  "appliquer DISTSTYLE KEY sur la même clé de jointure ('client_id') colocalise les lignes appariées sur les mêmes tranches (slices) des nœuds de calcul, permettant d'exécuter la jointure localement sans transfert réseau",
  "DISTSTYLE ALL sur une table de 10 milliards de lignes saturerait immédiatement le stockage de tous les nœuds de calcul",
  "DISTSTYLE EVEN distribue les données de façon circulaire sans considération des valeurs, ce qui force une redistribution réseau massive lors de chaque jointure",
  "le Leader Node ne stocke aucune donnée utilisateur de table et n'exécute pas les requêtes de jointures massives",
  "https://docs.aws.amazon.com/redshift/latest/dg/c_choosing_dist_sort.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Pour une petite table de dimension 'devises' contenant 200 lignes consultée par presque toutes les requêtes décisionnelles de l'entreprise, quel style de distribution Redshift offre les meilleures performances de jointure ?",
  [
    "A) DISTSTYLE ALL",
    "B) DISTSTYLE KEY",
    "C) DISTSTYLE EVEN",
    "D) DISTSTYLE AUTO"
  ],
  "A",
  "DISTSTYLE ALL duplique l'intégralité de la petite table sur le premier slice de chaque nœud de calcul; ainsi, n'importe quelle jointure peut se faire localement sans aucun transfert réseau",
  "DISTSTYLE KEY disperserait inutilement les 200 lignes et exigerait des mouvements réseau lors des jointures sur d'autres clés",
  "DISTSTYLE EVEN diviserait les 200 lignes entre les nœuds et provoquerait des redistributions réseau systématiques",
  "bien qu'AUTO puisse initialement choisir ALL pour une petite table, spécifier explicitement ALL garantit la stabilité du comportement",
  "https://docs.aws.amazon.com/redshift/latest/dg/t_Distributing_data.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Quelle différence fondamentale distingue une clé de tri composée (Compound Sort Key) d'une clé de tri entrelacée (Interleaved Sort Key) dans Amazon Redshift ?",
  [
    "A) La clé composée privilégie l'ordre hiérarchique des colonnes définies et excelle sur les filtres préfixes (colonne 1, puis 1+2), tandis que la clé entrelacée accorde un poids égal à chaque colonne de tri",
    "B) La clé composée ne supporte qu'une seule colonne maximum",
    "C) La clé entrelacée accélère considérablement l'opération VACUUM par rapport à la clé composée",
    "D) La clé composée nécessite un redémarrage complet du cluster Redshift lors de son application"
  ],
  "A",
  "Compound Sort Key est le choix par défaut le plus performant: elle trie selon l'ordre strict des colonnes spécifiées; Interleaved donne un poids identique à chaque colonne mais engendre un coût de maintenance et de VACUUM beaucoup plus lourd",
  "la clé composée peut regrouper jusqu'à 8 colonnes hiérarchisées",
  "la clé entrelacée dégrade fortement les performances de VACUUM en raison de la complexité de l'algorithme d'organisation multidimensionnel",
  "l'application d'une clé de tri ne nécessite aucun redémarrage du cluster",
  "https://docs.aws.amazon.com/redshift/latest/dg/t_Sorting_data.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Un analyste constate qu'après de nombreuses opérations de suppression (DELETE) et de mise à jour (UPDATE) dans Redshift, l'espace disque n'est pas libéré et les performances de requêtes se dégradent. Quelle commande d'administration résout ces deux points ?",
  [
    "A) Exécuter la commande VACUUM (reclaim space et resort)",
    "B) Exécuter la commande DROP TABLE",
    "C) Redémarrer le cluster Redshift",
    "D) Augmenter la taille du volume EBS du Leader Node"
  ],
  "A",
  "dans Redshift, les suppressions sont logiques (soft delete); la commande VACUUM réclame l'espace disque libéré en purgeant les lignes marquées pour suppression et réorganise les données non triées dans les blocs de disque",
  "DROP TABLE détruirait définitivement la table et ses données utiles",
  "redémarrer le cluster ne réorganise pas les blocs de disques ni ne purge les lignes supprimées",
  "les Compute Nodes gèrent le stockage et la commande VACUUM est l'opération standard sans modification matérielle",
  "https://docs.aws.amazon.com/redshift/latest/dg/r_VACUUM_command.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Dans Amazon Redshift, quelle fonctionnalité permet d'interroger directement des téraoctets de données historiques stockées dans un Data Lake S3 aux formats Parquet ou ORC sans charger les données dans le stockage local du cluster ?",
  [
    "A) Redshift Spectrum",
    "B) Redshift Data Sharing",
    "C) S3 Cross-Region Replication",
    "D) AWS Glue Elastic Views"
  ],
  "A",
  "Redshift Spectrum permet d'interroger des données résidant directement sur S3 via des tables externes référencées dans un schéma externe lié au Glue Data Catalog, en utilisant la puissance de calcul parallèle des nœuds Redshift",
  "Data Sharing partage des données entre différents clusters Redshift managés et non directement depuis des fichiers S3 bruts",
  "la réplication S3 copie des fichiers entre régions mais n'exécute aucune requête SQL",
  "Glue Elastic Views était un service distinct et n'est pas le moteur de requêtage externe de Redshift",
  "https://docs.aws.amazon.com/redshift/latest/dg/c-using-spectrum.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Comment Amazon Redshift gère-t-il les pointes soudaines et temporaires de requêtes en lecture soumises par des centaines d'utilisateurs simultanés sans impacter la latence du cluster principal ?",
  [
    "A) Grâce à la fonctionnalité Concurrency Scaling qui provisionne automatiquement des clusters transitoires gérés par AWS",
    "B) En rejetant immédiatement 50 % des requêtes avec une erreur de dépassement de quota",
    "C) En basculant automatiquement toutes les requêtes vers une instance Amazon DynamoDB",
    "D) En forçant l'ensemble du cluster à redémarrer avec une taille d'instance supérieure"
  ],
  "A",
  "Concurrency Scaling alloue de manière transparente et dynamique de la capacité de calcul supplémentaire en lecture pour absorber les pics de concurrence imprévus, chaque cluster accumulant 1 heure gratuite de Concurrency Scaling par tranche de 24h d'activité",
  "Redshift met les requêtes en file d'attente (queuing) via le WLM au lieu de les rejeter brutalement",
  "DynamoDB est une base NoSQL clé-valeur incompatible avec le moteur d'exécution SQL OLAP complexe de Redshift",
  "redémarrer le cluster interromprait le service pendant plusieurs minutes et aggraverait la situation",
  "https://docs.aws.amazon.com/redshift/latest/dg/concurrency-scaling.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Quelle fonctionnalité de gestion de charge de travail (Workload Management - WLM) d'Amazon Redshift permet d'annuler ou de rétrograder automatiquement une requête en cours d'exécution qui consomme trop de temps CPU ou scanne un volume de données excessif ?",
  [
    "A) Les règles de surveillance des requêtes (Query Monitoring Rules - QMR)",
    "B) Les déclencheurs DDL",
    "C) Le protocole TCP KeepAlive",
    "D) L'optimiseur de coût AWS Budgets"
  ],
  "A",
  "les Query Monitoring Rules (QMR) permettent de définir des métriques de seuil (temps d'exécution, lignes scannées, ratio CPU) associées à des actions automatiques comme l'envoi d'une alerte, le changement de file d'attente ou l'annulation de la requête",
  "les déclencheurs DDL interceptent les modifications de structure de base et ne surveillent pas l'exécution des requêtes SQL",
  "TCP KeepAlive maintient les sockets réseau ouverts et n'a aucun pouvoir de gouvernance sur les requêtes longues",
  "AWS Budgets surveille la facturation globale du compte AWS sans visibilité granulaire au niveau requête SQL",
  "https://docs.aws.amazon.com/redshift/latest/dg/cm-c-wlm-query-monitoring-rules.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Une organisation souhaite partager en temps réel des données agrégées d'un cluster Redshift producteur vers plusieurs clusters Redshift consommateurs situés dans d'autres comptes AWS sans déplacer ni copier physiquement les données. Quelle fonctionnalité répond à ce besoin ?",
  [
    "A) Redshift Data Sharing",
    "B) Amazon Kinesis Data Firehose",
    "C) Tâches AWS Glue ETL quotidiennes avec écriture S3",
    "D) Restauration de snapshots Redshift multi-comptes"
  ],
  "A",
  "Redshift Data Sharing permet de partager des schémas, tables et vues en lecture seule de manière sécurisée et sans copie physique (zero-copy) entre clusters Redshift situés dans la même région ou dans des régions différentes",
  "Firehose est un service d'ingestion de flux de données et non une technologie de partage de tables entre entrepôts de données",
  "les jobs ETL Glue réguliers déplacent des téraoctets de données, créant des copies redondantes et des délais de fraîcheur",
  "la restauration de snapshots crée des clusters indépendants et duplique entièrement le stockage et les coûts de maintenance",
  "https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Dans Amazon Redshift Serverless, quelle métrique de capacité définit la puissance de calcul de base allouée et s'ajuste automatiquement selon la complexité des requêtes ?",
  [
    "A) Redshift Processing Units (RPU)",
    "B) Data Processing Units (DPU)",
    "C) ACU (Aurora Capacity Units)",
    "D) vCPU EC2"
  ],
  "A",
  "Redshift Serverless mesure et facture la capacité de calcul en Redshift Processing Units (RPU); l'administrateur définit une capacité de base (Base RPU) et une limite maximale pour encadrer les dépenses",
  "DPU est l'unité de mesure de calcul d'AWS Glue",
  "ACU est l'unité de calcul d'Amazon Aurora Serverless",
  "vCPU EC2 concerne les machines virtuelles individuelles et non le dimensionnement serverless abstrait de Redshift",
  "https://docs.aws.amazon.com/redshift/latest/mgmt/serverless-capacity.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Quelle vue Redshift pré-calcule et stocke physiquement le résultat d'une requête complexe avec jointures et agrégations, et peut être rafraîchie de manière incrémentale pour optimiser les performances des tableaux de bord décisionnels ?",
  [
    "A) Une vue matérialisée (Materialized View)",
    "B) Une vue standard (Standard View)",
    "C) Une table temporaire de session (#temp)",
    "D) Une fonction définie par l'utilisateur (UDF)"
  ],
  "A",
  "les vues matérialisées pré-calculent et enregistrent le jeu de données résultant; elles supportent le rafraîchissement incrémental (refreshing only newly appended rows) et la réécriture automatique des requêtes par l'optimiseur",
  "une vue standard réexécute l'intégralité du code SQL sous-jacent à chaque appel sans gain de pré-calcul",
  "une table temporaire n'est visible que pour la session en cours et disparaît dès la déconnexion du client",
  "une UDF encapsule une logique de calcul scalaire ou tabulaire personnalisée et ne stocke pas de données pré-agrégées",
  "https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-overview.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Pourquoi la commande COPY est-elle le mécanisme d'ingestion le plus performant pour charger des millions de lignes depuis S3 vers une table Amazon Redshift par rapport à des instructions INSERT SQL ?",
  [
    "A) COPY charge les données en parallèle en utilisant l'ensemble des tranches (slices) de tous les Compute Nodes du cluster",
    "B) COPY désactive de manière permanente tout besoin de sécurité réseau",
    "C) INSERT SQL est limité à 10 lignes par jour dans Redshift",
    "D) COPY convertit automatiquement la base Redshift en stockage NoSQL clé-valeur"
  ],
  "A",
  "la commande COPY exploite l'architecture massivement parallèle (MPP) de Redshift en faisant lire simultanément les fichiers multiples répartis sur S3 par chaque tranche de calcul de chaque nœud",
  "COPY respecte scrupuleusement les autorisations IAM, le chiffrement et la sécurité réseau",
  "INSERT SQL fonctionne mais traite les données de manière séquentielle sur le Leader Node, ce qui est extrêmement inefficace pour des volumes massifs",
  "COPY charge les données dans des tables relationnelles et ne convertit rien en NoSQL",
  "https://docs.aws.amazon.com/redshift/latest/dg/t_loading-tables-add-rows.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Lors de l'exécution de la commande ANALYZE dans Amazon Redshift, quel composant essentiel de la base de données est mis à jour pour permettre au planificateur de choisir les chemins de jointure les plus efficaces ?",
  [
    "A) Les métadonnées statistiques de distribution et de cardinalité des tables",
    "B) Le firmware matériel des disques NVMe",
    "C) Le mot de passe administrateur du cluster",
    "D) L'adresse IP publique de la passerelle Internet"
  ],
  "A",
  "la commande ANALYZE recalcule les statistiques de distribution des valeurs et de cardinalité des tables, permettant à l'optimiseur de requêtes fondé sur le coût (Cost-Based Optimizer) de concevoir les meilleurs plans d'exécution",
  "ANALYZE n'effectue aucune mise à jour de microcode physique sur les serveurs AWS",
  "les mots de passe utilisateurs sont gérés via des commandes ALTER USER ou IAM",
  "les adresses réseau dépendent de la configuration VPC et des sous-réseaux sans lien avec ANALYZE",
  "https://docs.aws.amazon.com/redshift/latest/dg/r_ANALYZE.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Quel encodage de compression de colonne est automatiquement et prioritairement appliqué par Redshift sur les colonnes déclarées comme clés de tri (Sort Keys) ?",
  [
    "A) RAW (aucune compression)",
    "B) ZSTD",
    "C) Runlength",
    "D) Text255"
  ],
  "A",
  "par défaut, Redshift applique l'encodage RAW (non compressé) sur la première colonne d'une clé de tri pour éviter que l'opération de recherche et de tri par plage ne soit pénalisée par le coût CPU de décompression",
  "ZSTD offre une forte compression mais peut être sous-optimal sur la première colonne d'une Sort Key selon les cas",
  "Runlength compresse les valeurs contiguës mais n'est pas le choix par défaut imposé aux clés de tri",
  "Text255 est un encodage pour les colonnes de texte de faible longueur et non le standard des Sort Keys",
  "https://docs.aws.amazon.com/redshift/latest/dg/c_Compression_encodings.html"
));

questions.push(makeQ(
  qNum++, 'redshift',
  "Dans Amazon Redshift, quelle commande SQL permet de vérifier l'alignement et la répartition physique des lignes entre les différentes tranches de calcul (slices) afin d'identifier un éventuel biais de distribution (data skew) ?",
  [
    "A) Interroger la vue système SVV_DISKUSAGE ou PG_STATISTIC",
    "B) Exécuter SELECT * FROM SYS_CLUSTER_HARDWARE",
    "C) Lancer un traceroute réseau vers le Leader Node",
    "D) Consulter l'historique des commits GitHub"
  ],
  "A",
  "les vues système de métadonnées telles que SVV_DISKUSAGE, SVV_TABLE_INFO ou STV_SLICES permettent d'inspecter précisément le nombre de blocs et de lignes par tranche pour détecter les distributions asymétriques préjudiciables aux performances",
  "la vue SYS_CLUSTER_HARDWARE n'existe pas dans le dictionnaire de données Redshift",
  "traceroute est un utilitaire réseau externe qui n'a aucune visibilité sur la répartition des lignes au sein du moteur de base de données",
  "GitHub stocke le code source applicatif et n'a aucune information d'exécution sur l'état des disques Redshift",
  "https://docs.aws.amazon.com/redshift/latest/dg/c_analyzing-table-design.html"
));

// ==========================================
// RDS, AURORA & BASES SPÉCIALISÉES (9 questions: 156-164)
// ==========================================

questions.push(makeQ(
  qNum++, 'rds-aurora-autres',
  "Quelle caractéristique majeure distingue l'architecture de stockage d'Amazon Aurora de celle d'un moteur Amazon RDS PostgreSQL traditionnel ?",
  [
    "A) Aurora sépare le calcul du stockage et réplique automatiquement 6 copies des données réparties sur 3 zones de disponibilité au sein d'un volume de stockage partagé distribué",
    "B) Aurora n'utilise aucun disque dur et stocke tout exclusivement dans la mémoire vive des clients",
    "C) RDS PostgreSQL réplique automatiquement les écritures sur 12 régions AWS par défaut",
    "D) Aurora exige que le Data Engineer gère lui-même les matrices RAID physiques"
  ],
  "A",
  "Amazon Aurora découple les nœuds de calcul (instances) d'une couche de stockage mutualisée SSD virtualisée qui réplique de façon synchrone 6 copies des données à travers 3 AZs avec un mécanisme de quorum d'écriture 4/6",
  "Aurora n'est pas une base purement in-memory volatile; son stockage distribué NVMe assure une durabilité extrême",
  "RDS PostgreSQL utilise des volumes EBS attachés standard et la réplication Multi-AZ se fait sur 2 zones de disponibilité d'une même région",
  "Aurora est un service géré (PaaS) sans aucune administration matérielle de disques ou matrices RAID",
  "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html"
));

questions.push(makeQ(
  qNum++, 'rds-aurora-autres',
  "Combien de répliques en lecture (Read Replicas) Amazon Aurora peut-il provisionner au maximum pour gérer la montée en charge des requêtes analytiques en lecture, et quelle est la latence de réplication typique grâce au stockage partagé ?",
  [
    "A) Jusqu'à 15 répliques avec une latence généralement inférieure à 10 millisecondes",
    "B) Au maximum 2 répliques avec une latence de 5 minutes",
    "C) 100 répliques avec une latence nulle garantie",
    "D) 1 seule réplique obligatoirement située sur le même serveur physique"
  ],
  "A",
  "Amazon Aurora supporte jusqu'à 15 répliques en lecture; comme toutes les répliques partagent le même volume de stockage distribué sous-jacent, le décalage de réplication (replica lag) est minime (typiquement inférieur à 10-20 ms)",
  "RDS classique est limité à 5 ou 15 selon le moteur, mais Aurora gère jusqu'à 15 répliques avec un lag de quelques millisecondes et non de 5 minutes",
  "100 répliques dépasse la limite native du cluster Aurora (plafonnée à 15)",
  "les répliques Aurora sont réparties sur plusieurs zones de disponibilité distinctes pour assurer la haute disponibilité",
  "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html"
));

questions.push(makeQ(
  qNum++, 'rds-aurora-autres',
  "Quelle nouvelle intégration native sans code introduite dans les examens AWS Data Engineer permet d'ingérer en continu les transactions transactionnelles d'une base Amazon Aurora vers Amazon Redshift pour de l'analyse en quasi temps réel ?",
  [
    "A) Aurora Zero-ETL integration with Amazon Redshift",
    "B) AWS Database Migration Service (DMS) avec capture CDC manuelle sur instance EC2",
    "C) Export quotidien vers S3 au format Parquet orchestré par cron",
    "D) AWS Data Pipeline"
  ],
  "A",
  "l'intégration Zero-ETL entre Aurora et Redshift est une fonctionnalité entièrement managée qui synchronise en quasi temps réel les modifications de schéma et les écritures transactionnelles vers Redshift sans concevoir de pipelines ETL",
  "AWS DMS nécessite la configuration, la surveillance et le coût d'une instance de réplication dédiée",
  "les exports quotidiens par lots n'offrent pas la fraîcheur en quasi temps réel requise et surchargent les pipelines",
  "AWS Data Pipeline est un service historique déprécié au profit d'AWS Step Functions et MWAA",
  "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/zero-etl.html"
));

questions.push(makeQ(
  qNum++, 'rds-aurora-autres',
  "Une charge de travail analytique présente une activité très fluctuante, passant de zéro requête la nuit à des centaines de requêtes analytiques complexes et imprévisibles le jour. Quelle option de déploiement Aurora permet d'ajuster instantanément la capacité par fractions de secondes sans interruption de service ?",
  [
    "A) Amazon Aurora Serverless v2",
    "B) Amazon RDS pour Oracle en licence BYOL",
    "C) Déploiement multi-région Aurora Global Database",
    "D) Instance EC2 réservée 3 ans fermes"
  ],
  "A",
  "Aurora Serverless v2 fait évoluer la puissance de calcul de manière granulaire (en incréments de 0,5 ACU) en quelques fractions de seconde en fonction de la pression CPU et mémoire sans provoquer aucune coupure de connexion",
  "RDS Oracle sous licence BYOL est une base relationnelle traditionnelle à dimensionnement d'instance fixe",
  "Aurora Global Database sert à la reprise d'activité inter-régionale et à la faible latence mondiale, et ne résout pas à lui seul l'élasticité fine locale",
  "une instance réservée 3 ans est un engagement financier rigide pour des charges de travail continues et prévisibles",
  "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html"
));

questions.push(makeQ(
  qNum++, 'rds-aurora-autres',
  "Quel service de base de données AWS entièrement géré est spécialement conçu pour stocker et interroger des données hautement connectées telles que des graphes de connaissances (Knowledge Graphs) ou des réseaux de détection des fraudes via Gremlin ou openCypher ?",
  [
    "A) Amazon Neptune",
    "B) Amazon DocumentDB",
    "C) Amazon RDS for MariaDB",
    "D) Amazon Timestream"
  ],
  "A",
  "Amazon Neptune est une base de données graphe rapide et gérée optimisée pour naviguer dans des milliards de relations en utilisant les modèles Property Graph (Gremlin, openCypher) ou W3C RDF (SPARQL)",
  "DocumentDB est une base de données orientée documents compatible MongoDB",
  "RDS MariaDB est un système relationnel tabulaire SQL standard inadapté aux requêtes de traversée de graphe complexes",
  "Timestream est une base de données temporelle conçue pour les métriques IoT",
  "https://docs.aws.amazon.com/neptune/latest/userguide/intro.html"
));

questions.push(makeQ(
  qNum++, 'rds-aurora-autres',
  "Quel magasin de données géré AWS compatible avec MongoDB permet d'exécuter des charges de travail documentaires JSON avec séparation du calcul et du stockage sur architecture Aurora distribuée ?",
  [
    "A) Amazon DocumentDB (with MongoDB compatibility)",
    "B) Amazon ElastiCache for Redis",
    "C) Amazon Keyspaces",
    "D) Amazon DynamoDB Accelerator (DAX)"
  ],
  "A",
  "Amazon DocumentDB est un service documentaire natif compatible avec l'API MongoDB qui s'appuie sur le moteur de stockage distribué, tolérant aux pannes et auto-extensible développé pour la plateforme Aurora",
  "ElastiCache Redis est un magasin clé-valeur in-memory en cache",
  "Amazon Keyspaces est un service compatible avec l'API Apache Cassandra pour les tables larges distribuées",
  "DAX est un accélérateur de cache mémoire dédié spécifiquement à Amazon DynamoDB",
  "https://docs.aws.amazon.com/documentdb/latest/developerguide/what-is.html"
));

questions.push(makeQ(
  qNum++, 'rds-aurora-autres',
  "Une entreprise collecte des millions de métriques de capteurs industriels horodatées par minute et souhaite analyser les tendances temporelles à l'aide de fonctions de fenêtrage temporel sans gérer d'index de partitionnement complexes. Quel service AWS dédié répond à ce besoin ?",
  [
    "A) Amazon Timestream",
    "B) Amazon Aurora PostgreSQL",
    "C) Amazon Redshift Serverless",
    "D) Amazon S3 Glacier Flexible"
  ],
  "A",
  "Amazon Timestream est une base de données temporelle sans serveur conçue pour stocker et analyser des séries temporelles (IoT, métriques opérationnelles) avec gestion automatique des niveaux de stockage mémoire et magnétique",
  "Aurora PostgreSQL peut stocker des séries temporelles mais nécessite une gestion manuelle du partitionnement par date et du compactage",
  "Redshift Serverless est un entrepôt de données généraliste plus lourd à exploiter pour de l'ingestion brute de capteurs à haute fréquence",
  "S3 Glacier est un service d'archivage froid non interrogeable en temps réel par requête SQL interactive",
  "https://docs.aws.amazon.com/timestream/latest/developerguide/what-is-timestream.html"
));

questions.push(makeQ(
  qNum++, 'rds-aurora-autres',
  "Quelle fonctionnalité d'Amazon Aurora permet de créer instantanément un environnement de test isolé pour la validation de scripts de migration de données sans copier physiquement les téraoctets de données du cluster de production ?",
  [
    "A) Le clonage de base de données (Aurora Database Cloning)",
    "B) Le dump logique pg_dump via un script Bash",
    "C) La réplication logique DMS",
    "D) L'export vers S3 au format CSV"
  ],
  "A",
  "le clonage de base de données Aurora utilise le mécanisme de copie sur écriture (Copy-on-Write) pour créer en quelques minutes un cluster indépendant pointant vers le même stockage d'origine, n'allouant du nouveau stockage que pour les blocs modifiés ultérieurement",
  "pg_dump extrait chaque ligne sur le réseau, saturant la bande passante et prenant des heures sur de grands volumes",
  "DMS nécessite de provisionner une infrastructure de réplication continue et des instances cibles coûteuses",
  "l'export CSV implique une copie totale des données et ne crée pas une base relationnelle directement testable",
  "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html"
));

questions.push(makeQ(
  qNum++, 'rds-aurora-autres',
  "Quel service AWS géré permet d'exécuter des applications utilisant l'API Apache Cassandra sur une architecture NoSQL sans serveur sans avoir à gérer l'approvisionnement des nœuds, le gossip protocol ou la réparation de nœuds (nodetool repair) ?",
  [
    "A) Amazon Keyspaces (for Apache Cassandra)",
    "B) Amazon DynamoDB",
    "C) Amazon OpenSearch Service",
    "D) AWS Glue Studio"
  ],
  "A",
  "Amazon Keyspaces est un service de base de données compatible avec Apache Cassandra entièrement géré, sans serveur et scalable qui élimine les contraintes de maintenance des clusters Cassandra open-source",
  "DynamoDB utilise son propre modèle d'API propriétaire et n'est pas directement compatible avec le protocole CQL de Cassandra",
  "OpenSearch est un moteur d'indexation textuelle et vectorielle et non une base tabulaire Cassandra",
  "Glue Studio est un environnement visuel pour concevoir des jobs ETL et non une base de données NoSQL",
  "https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html"
));

// ==========================================
// DYNAMODB (8 questions: 165-172)
// ==========================================

questions.push(makeQ(
  qNum++, 'dynamodb',
  "Dans Amazon DynamoDB, quelle est la différence architecturale majeure entre un index secondaire global (Global Secondary Index - GSI) et un index secondaire local (Local Secondary Index - LSI) ?",
  [
    "A) Un GSI peut être créé ou supprimé à tout moment et peut avoir une clé de partition différente de la table, tandis qu'un LSI doit obligatoirement être créé lors de la création de la table et partage la même clé de partition",
    "B) Un LSI peut avoir un débit provisionné indépendant de la table principale",
    "C) Un GSI ne supporte que la cohérence forte (Strongly Consistent Reads)",
    "D) Un LSI peut contenir jusqu'à 100 clés de partition distinctes"
  ],
  "A",
  "un GSI permet de choisir une clé de partition et une clé de tri totalement différentes de la table et peut être ajouté ou supprimé à chaud; un LSI doit être défini à la création de la table et réutilise obligatoirement la clé de partition de base",
  "un LSI partage obligatoirement la capacité provisionnée (RCU/WCU) de la table hôte, alors qu'un GSI dispose de son propre dimensionnement de capacité",
  "les lectures sur un GSI sont uniquement à cohérence éventuelle (eventually consistent)",
  "un LSI ne possède qu'une seule clé de partition, qui est strictement identique à celle de la table principale",
  "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html"
));

questions.push(makeQ(
  qNum++, 'dynamodb',
  "Une application d'e-commerce doit enregistrer des paniers d'achat temporaires dans Amazon DynamoDB et s'assurer que les paniers inactifs sont supprimés automatiquement au bout de 7 jours sans consommer d'unités de capacité d'écriture (WCU) ni générer de coûts additionnels. Quelle fonctionnalité AWS activez-vous ?",
  [
    "A) Le mécanisme de durée de vie (Time to Live - TTL)",
    "B) Une fonction Lambda déclenchée toutes les minutes par EventBridge scannant la table",
    "C) Une commande cron appelant BatchWriteItem depuis un serveur EC2",
    "D) Une politique de cycle de vie S3 Lifecycle appliquée à DynamoDB"
  ],
  "A",
  "le TTL de DynamoDB supprime automatiquement les éléments arrivés à expiration (définis par un horodatage Unix en secondes) sans consommer aucune unité de capacité d'écriture (WCU) et sans frais supplémentaires",
  "un scan régulier de la table via Lambda consommerait des quantités massives d'unités de lecture (RCU) et saturerait la base",
  "BatchWriteItem consomme des WCU facturables et requiert l'administration d'un serveur d'orchestration",
  "les politiques de cycle de vie S3 Lifecycle s'appliquent uniquement au stockage objet Amazon S3 et non à DynamoDB",
  "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html"
));

questions.push(makeQ(
  qNum++, 'dynamodb',
  "Une application bancaire utilise DynamoDB pour enregistrer des transactions financières. Chaque modification (création, mise à jour, suppression) doit être immédiatement capturée dans l'ordre chronologique exact pour alimenter un lac de données S3 via une fonction Lambda. Quel composant fournit ce journal d'audit de modification ?",
  [
    "A) Amazon DynamoDB Streams",
    "B) AWS CloudTrail",
    "C) Les journaux VPC Flow Logs",
    "D) Amazon Kinesis Video Streams"
  ],
  "A",
  "DynamoDB Streams capture le flux ordonné dans le temps de toutes les modifications au niveau élément dans une table DynamoDB pendant 24 heures, fournissant les images avant et après modification à des consommateurs comme AWS Lambda",
  "CloudTrail enregistre les appels d'API de gestion du plan de contrôle (ex: CreateTable, DeleteTable) mais pas les modifications de données individuelles (PutItem, UpdateItem)",
  "VPC Flow Logs capture les flux de paquets réseau IP et non le contenu applicatif des bases de données",
  "Kinesis Video Streams est conçu pour ingérer des flux vidéo multimédias",
  "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html"
));

questions.push(makeQ(
  qNum++, 'dynamodb',
  "Pour une table DynamoDB en mode provisionné, comment calcule-t-on le nombre d'unités de capacité de lecture (Read Capacity Units - RCU) nécessaires pour effectuer 100 lectures fortement cohérentes (Strongly Consistent) par seconde sur des éléments d'une taille unitaire de 6 Ko ?",
  [
    "A) 200 RCU",
    "B) 100 RCU",
    "C) 50 RCU",
    "D) 600 RCU"
  ],
  "A",
  "une unité RCU fournit une lecture fortement cohérente par seconde pour des éléments jusqu'à 4 Ko; pour un élément de 6 Ko, on arrondit au multiple supérieur de 4 Ko, soit 8 Ko, ce qui équivaut à 2 RCU par lecture; 100 lectures x 2 RCU = 200 RCU",
  "100 RCU ne couvrirait que des éléments d'une taille maximale de 4 Ko",
  "50 RCU correspondrait à une lecture à cohérence éventuelle (eventually consistent) pour des éléments de 4 Ko",
  "600 RCU est un surdimensionnement injustifié par rapport aux règles de calcul officielles AWS",
  "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html"
));

questions.push(makeQ(
  qNum++, 'dynamodb',
  "Quel accélérateur de cache en mémoire entièrement géré peut être placé devant Amazon DynamoDB pour réduire la latence de lecture de la milliseconde à la microseconde sans modifier la logique applicative du code SDK ?",
  [
    "A) DynamoDB Accelerator (DAX)",
    "B) Amazon ElastiCache for Memcached",
    "C) AWS Global Accelerator",
    "D) Amazon CloudFront"
  ],
  "A",
  "DynamoDB Accelerator (DAX) est un cache en mémoire compatible avec les appels d'API SDK DynamoDB natifs qui fournit des temps de réponse en microsecondes pour les tables à très forte lecture répétitive",
  "ElastiCache Memcached nécessite une réécriture de code applicatif pour gérer la mise en cache et l'invalidation des clés",
  "Global Accelerator optimise le routage réseau Anycast vers des adresses IP fixes et n'est pas un cache de base de données",
  "CloudFront est un CDN pour du contenu web HTTP et non pour des appels d'API de tables DynamoDB internes",
  "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html"
));

questions.push(makeQ(
  qNum++, 'dynamodb',
  "Une nouvelle application de billetterie en ligne connaît une fréquentation imprévisible avec de longues périodes de calme plat suivies de pics brutaux et massifs de connexions lors de l'ouverture des ventes. Quel mode de tarification de capacité DynamoDB est le plus économique et adapté ?",
  [
    "A) Le mode de capacité à la demande (On-Demand Capacity Mode)",
    "B) Le mode de capacité provisionnée avec auto-scaling fixé à 10 000 WCU en permanence",
    "C) Les instances réservées DynamoDB sur 3 ans",
    "D) Le déploiement sur Amazon EC2 Spot"
  ],
  "A",
  "le mode On-Demand s'adapte instantanément aux variations imprévisibles de trafic sans planification de capacité et ne facture que les requêtes réellement exécutées, sans coût pendant les périodes d'inactivité",
  "fixer 10 000 WCU fixes en permanence engendrerait des coûts prohibitifs pendant les périodes creuses",
  "les instances réservées imposent un profil de consommation stable et continu sur plusieurs années",
  "DynamoDB est un service managé serverless qui ne s'installe pas sur des instances EC2 Spot",
  "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html"
));

questions.push(makeQ(
  qNum++, 'dynamodb',
  "Quelle propriété d'Amazon DynamoDB garantit qu'une clé de partition (Partition Key) distribue uniformément les éléments et les requêtes entre les différentes partitions physiques sous-jacentes pour éviter le phénomène de partition chaude (Hot Partition) ?",
  [
    "A) La haute cardinalité des valeurs de la clé de partition (ex: identifiants uniques ou combinaison d'attributs)",
    "B) Le choix d'une valeur fixe constante pour tous les enregistrements",
    "C) L'utilisation exclusive de dates au format 'AAAA-MM' comme clé de partition unique",
    "D) La désactivation du tri sur la clé secondaire"
  ],
  "A",
  "une clé de partition à forte cardinalité (comme des UUIDs ou des hashs combinés) assure une dispersion statistique équilibrée des données sur toutes les partitions matérielles, évitant la saturation d'un nœud physique unique",
  "une valeur constante concentrerait 100 % des écritures et lectures sur une seule et même partition, provoquant des erreurs de limitation de débit (throttling)",
  "utiliser une date comme clé de partition crée une partition chaude sur le mois en cours lors de l'ingestion",
  "la clé de tri (Sort Key) organise les éléments à l'intérieur d'une même partition et ne résout pas la dispersion de la Partition Key",
  "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html"
));

questions.push(makeQ(
  qNum++, 'dynamodb',
  "Une application financière nécessite d'exécuter des opérations atomiques tout-ou-rien sur plusieurs tables DynamoDB (par exemple débiter un compte et créditer un autre de façon indissociable). Quelle API DynamoDB répond à cette exigence ACID ?",
  [
    "A) TransactWriteItems",
    "B) BatchWriteItem",
    "C) PutItem avec écriture conditionnelle",
    "D) ExecuteStatement en mode non coordonné"
  ],
  "A",
  "l'opération TransactWriteItems fournit des transactions ACID garantissant que l'ensemble des modifications réussit ou que l'intégralité est annulée en cas d'échec sur l'une des actions, jusqu'à un maximum de 100 actions",
  "BatchWriteItem regroupe les écritures pour l'efficacité réseau mais n'offre aucune garantie transactionnelle atomique (certaines peuvent réussir alors que d'autres échouent)",
  "une écriture conditionnelle vérifie l'état d'un seul élément et ne coordonne pas de transaction multi-tables atomique",
  "les instructions non coordonnées ne fournissent pas de garanties ACID distribuées",
  "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html"
));

// ==========================================
// INDEX VECTORIELS HNSW vs IVF & OPENSEARCH (4 questions: 173-176)
// ==========================================

questions.push(makeQ(
  qNum++, 'index-vectoriels-hnsw-ivf',
  "Dans les applications d'IA générative et de recherche sémantique (RAG) sur AWS, quelle est la caractéristique principale qui distingue l'index vectoriel HNSW (Hierarchical Navigable Small World) de l'index vectoriel IVF (Inverted File) dans Amazon OpenSearch Service ?",
  [
    "A) HNSW construit un graphe hiérarchique offrant un rappel (recall) élevé et une faible latence de requête mais consomme une quantité importante de mémoire RAM, alors qu'IVF divise l'espace en clusters Voronoi et est plus économe en mémoire vive",
    "B) HNSW ne fonctionne que sur des disques magnétiques lents",
    "C) IVF est un algorithme exact qui garantit un rappel de 100 % sur tous les jeux de données",
    "D) HNSW est limité à 2 dimensions vectorielles au maximum"
  ],
  "A",
  "HNSW organise les vecteurs sous forme de graphes à plusieurs couches pour une navigation ultra-rapide au prix d'une forte occupation RAM; IVF clusterise les vecteurs avec des centroïdes, nécessitant moins de mémoire et permettant de traiter de plus grands volumes sur disque",
  "HNSW nécessite que l'ensemble de la structure de graphe réside en mémoire vive (RAM) pour garantir ses performances de recherche",
  "IVF est également un algorithme de recherche approchée (Approximate k-NN) et ne garantit pas un rappel absolu de 100 %",
  "HNSW gère des espaces vectoriels de plusieurs centaines à plusieurs milliers de dimensions (ex: 1 536 dimensions pour Titan)",
  "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/knn.html"
));

questions.push(makeQ(
  qNum++, 'index-vectoriels-hnsw-ivf',
  "Quelle métrique de distance vectorielle devez-vous configurer dans Amazon OpenSearch Service ou pgvector lors de la comparaison d'embeddings textuels générés par un modèle comme Amazon Titan Text Embeddings V2 ?",
  [
    "A) La similarité Cosinus (Cosine Similarity)",
    "B) La distance de Hamming sur texte brut",
    "C) Le code de redondance cyclique CRC32",
    "D) La distance de Levenshtein au niveau caractère"
  ],
  "A",
  "la similarité Cosinus mesure l'angle entre deux vecteurs indépendamment de leur magnitude, ce qui en fait la métrique de prédilection pour évaluer la proximité sémantique de vecteurs d'embeddings textuels",
  "la distance de Hamming compte les différences entre chaînes binaires de même longueur et ne s'applique pas aux vecteurs de réels continus d'embeddings",
  "CRC32 est un algorithme de détection d'erreurs de transmission réseau et non une mesure de similarité",
  "Levenshtein mesure le nombre d'éditions de caractères dans une chaîne lexicale et ignore la sémantique vectorielle latente",
  "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/knn-approximate.html"
));

questions.push(makeQ(
  qNum++, 'index-vectoriels-hnsw-ivf',
  "Une équipe d'ingénierie déploie un système de recherche documentaire d'entreprise. Pour obtenir les résultats les plus pertinents, elle souhaite combiner une recherche par mots-clés traditionnelle (BM25) avec une recherche sémantique par vecteurs d'embeddings. Comment s'appelle cette approche dans Amazon OpenSearch Service ?",
  [
    "A) La recherche hybride (Hybrid Search) combinant scores textuels et vectoriels avec normalisation",
    "B) Le scan séquentiel S3",
    "C) L'analyse morphosyntaxique statique",
    "D) Le partitionnement par hachage MD5"
  ],
  "A",
  "la recherche hybride (Hybrid Search) d'OpenSearch combine les scores de pertinence lexicale (BM25) et de similarité vectorielle (k-NN) via un pipeline de recherche de normalisation pour produire les meilleurs résultats de classement",
  "le scan séquentiel ne produit aucun classement de pertinence et est prohibitif en temps",
  "l'analyse morphologique seule ne capture pas la proximité conceptuelle apportée par les embeddings neuronaux",
  "le partitionnement MD5 distribue les données sur le réseau et ne combine aucun score de pertinence",
  "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/hybrid-search.html"
));

questions.push(makeQ(
  qNum++, 'index-vectoriels-hnsw-ivf',
  "Quel moteur de base de données relationnelle AWS entièrement géré supporte nativement l'extension open-source 'pgvector' pour stocker des vecteurs d'embeddings et exécuter des requêtes de plus proches voisins directement en SQL ?",
  [
    "A) Amazon Aurora PostgreSQL et Amazon RDS for PostgreSQL",
    "B) Amazon RDS for SQL Server",
    "C) Amazon DocumentDB",
    "D) Amazon RDS for DB2"
  ],
  "A",
  "Amazon Aurora PostgreSQL et RDS PostgreSQL intègrent nativement l'extension 'pgvector', permettant de créer des colonnes de type vector, des index HNSW ou IVFFlat, et d'exécuter des recherches sémantiques en SQL avec l'opérateur <=> (distance cosinus)",
  "RDS SQL Server ne supporte pas nativement l'extension communautaire pgvector de PostgreSQL",
  "DocumentDB est une base documentaire NoSQL et n'exécute pas le dialecte d'extensions PostgreSQL",
  "RDS DB2 est un moteur relationnel IBM qui n'intègre pas le projet open-source pgvector",
  "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/postgresql-pgvector.html"
));

// ==========================================
// EBS, EFS & AWS BACKUP (4 questions: 177-180)
// ==========================================

questions.push(makeQ(
  qNum++, 'ebs-efs-backup',
  "Quelle solution de stockage de fichiers réseau partagé basée sur le protocole POSIX (NFSv4) permet à des centaines d'instances de calcul ou de conteneurs AWS d'accéder simultanément aux mêmes répertoires de données à travers plusieurs zones de disponibilité ?",
  [
    "A) Amazon Elastic File System (Amazon EFS)",
    "B) Amazon Elastic Block Store (Amazon EBS) gp3",
    "C) Stockage d'instance éphémère (Instance Store)",
    "D) Volume EBS st1"
  ],
  "A",
  "Amazon EFS est un système de fichiers POSIX élastique et entièrement géré accessible simultanément par des centaines d'instances EC2 et conteneurs ECS/EKS à travers plusieurs AZs via des points de montage NFS",
  "un volume EBS standard est attaché à une unique instance dans une unique AZ (sauf option io2 Multi-Attach limitée à une même AZ)",
  "l'Instance Store est un stockage éphémère physique directement attaché au châssis serveur de l'instance",
  "EBS st1 est un volume bloc magnétique séquentiel rattaché à une seule instance",
  "https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html"
));

questions.push(makeQ(
  qNum++, 'ebs-efs-backup',
  "Un cluster d'entraînement de Machine Learning distribué haute performance sur EMR et EC2 requiert un système de fichiers partagé capable de fournir des débits de plusieurs centaines de gigaoctets par seconde avec une latence inférieure à la milliseconde directement synchronisé avec Amazon S3. Quel service est expressément conçu pour cette tâche ?",
  [
    "A) Amazon FSx for Lustre",
    "B) Amazon S3 Glacier Deep Archive",
    "C) Amazon EFS en mode General Purpose",
    "D) Passerelle de fichiers AWS Storage Gateway"
  ],
  "A",
  "FSx for Lustre est optimisé pour les calculs intensifs (HPC, ML, big data), offrant des débits massifs et des millions d'IOPS avec une liaison bidirectionnelle transparente vers les compartiments Amazon S3",
  "Glacier Deep Archive est un archivage à froid inaccessible aux charges de travail haute performance interactives",
  "EFS General Purpose n'atteint pas les débits extrêmes de centaines de Go/s offerts par l'architecture parallèle Lustre",
  "Storage Gateway est destiné aux environnements hybrides et introduit une latence de passerelle inadaptée au ML distribué",
  "https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html"
));

questions.push(makeQ(
  qNum++, 'ebs-efs-backup',
  "Quel type de volume Amazon EBS de nouvelle génération permet de configurer indépendamment la capacité de stockage (Gio) et le débit (Mio/s) ainsi que les IOPS sans devoir surprovisionner la taille du disque pour obtenir des performances accrues ?",
  [
    "A) EBS General Purpose SSD (gp3)",
    "B) EBS General Purpose SSD (gp2)",
    "C) EBS Throughput Optimized HDD (st1)",
    "D) EBS Cold HDD (sc1)"
  ],
  "A",
  "les volumes gp3 permettent d'ajuster séparément les IOPS et le débit indépendamment de la taille allouée du volume, offrant un coût au gigaoctet jusqu'à 20 % inférieur aux anciens volumes gp2",
  "les volumes gp2 lient strictement la performance (3 IOPS par Gio) à la taille du disque, obligeant à surprovisionner la capacité pour obtenir des IOPS",
  "st1 est un disque magnétique pour les charges séquentielles sans ajustement d'IOPS indépendant",
  "sc1 est un disque magnétique pour les données froides",
  "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html"
));

questions.push(makeQ(
  qNum++, 'ebs-efs-backup',
  "Une organisation financière doit mettre en œuvre une politique de sauvegarde centralisée automatisant la création, la réplication inter-régionale et la rétention immuable (WORM) de sauvegardes pour EBS, RDS, DynamoDB et S3. Quel service permet de gérer cette gouvernance sans scripts personnalisés ?",
  [
    "A) AWS Backup configuré avec Backup Vault Lock",
    "B) Tâches cron AWS DataSync",
    "C) Fonctions Lambda exécutées par Amazon EventBridge",
    "D) Snapshots manuels périodiques dans la console"
  ],
  "A",
  "AWS Backup centralise et automatise les plans de protection des données pour de multiples services AWS, et sa fonctionnalité Vault Lock empêche toute suppression ou altération des sauvegardes avant l'échéance de la politique légale",
  "DataSync copie des fichiers réseau mais ne gère pas de politique de snapshots transactionnels ni d'immuabilité WORM",
  "des scripts Lambda personnalisés sont complexes à maintenir, faillibles et ne bénéficient pas de la certification Vault Lock native",
  "les opérations manuelles sont incompatibles avec les exigences d'audit et de continuité de service d'une entreprise financière",
  "https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html"
));

console.log(`Generated ${questions.length} questions for Domain 2.`);

// Write dea_questions_d2.js
const outPath = path.join(process.cwd(), 'scripts', 'dea_questions_d2.js');
const fileContent = `// Banque de questions officielles et originales pour DEA-C01 Domaine 2 (78 questions)
// Générée et validée le 2026-10-31
export const deaQuestionsD2 = ${JSON.stringify(questions, null, 2)};
`;
fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`Saved to ${outPath}`);
