# Chapitre 3.1 : ETL vs ELT : Critères de choix et compromis d'architecture

## 1. La question classique posée en entretien
« Quelle est la différence fondamentale entre ETL et ELT, et dans quelles situations précises recommanderiez-vous encore une approche ETL aujourd'hui face à un Modern Data Stack ? »

## 2. Ce que l'interviewer évalue vraiment
- Votre compréhension historique de l'évolution des infrastructures data (serveurs dédiés vs clusters MPP cloud élastiques).
- Votre capacité à arbitrer selon des critères objectifs : coût de calcul, sécurité / conformité (RGPD, données de santé), latence et gouvernance.
- Votre maturité : ne pas tomber dans le piège binaire « l'ETL est mort, vive l'ELT ».

## 3. Réponse d'ingénieur senior

### A. Définition et rupture architecturale
- **ETL (Extract, Transform, Load) :** Les données brutes sont extraites, transformées en vol sur un moteur de calcul intermédiaire (ex. cluster Spark dédié, machine Informatica/Talend), puis chargées sous forme structurée dans la base cible.
- **ELT (Extract, Load, Transform) :** Les données brutes sont extraites puis chargées directement dans le stockage de destination (Data Lake S3 ou Data Warehouse Snowflake/BigQuery), avant que les transformations ne soient exécutées in-engine (SQL, dbt).

### B. Matrice de décision en entretien
| Critère | Privilégier ETL | Privilégier ELT |
| :--- | :--- | :--- |
| **Sécurité & RGPD** | Données hautement sensibles devant être anonymisées avant tout stockage cloud | Gouvernance unifiée via RBAC/ABAC au sein de l'entrepôt |
| **Moteurs de calcul** | Entrepôt cible peu évolutif ou facturé à la licence volumétrique rigide | Entrepôt cloud à scalabilité horizontale découplée (Snowflake, BigQuery, Redshift Serverless) |
| **Compétences équipe** | Équipes maîtrisant Python / Scala / Spark | Équipes analytiques très compétentes en SQL (Analytics Engineers) |
| **Évolution du besoin** | Règles métier figées et immuables | Itérations rapides, besoin de conserver l'historique brut pour rejouer les calculs |

### C. Exemple concret en production
Dans une fintech gérant des données de cartes bancaires (norme PCI-DSS), un ETL léger tokenise et masque le numéro de carte (PAN) en vol via un service sécurisé avant ingestion dans Snowflake, où les jointures et agrégations analytiques sont ensuite opérées en ELT avec dbt.

## 4. Erreurs fatales à éviter absolument (Red Flags)
- Affirmer que l'ETL est toujours obsolète (ignorer la conformité et le masquage amont des PII).
- Oublier que l'ELT conserve l'historique brut, ce qui permet le « replay » complet des pipelines en cas de bug de transformation.
- Confondre transformation de structure (nettoyage) et transformation métier (indicateurs d'aide à la décision).
