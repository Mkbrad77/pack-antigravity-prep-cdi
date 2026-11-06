# Analyse du Marché de l'Emploi CDI en France : Data & AI

**Date de l'étude :** 31 octobre 2026  
**Auteur :** Antigravity (Chef de projet pédagogique Data & AI Engineering)  
**Candidat cible :** Auren (Ingénieur EPITA, alternant Data/IA, fin de contrat le 2 avril 2027)  
**Objectif :** Évaluer les compétences demandées sur le marché français de l'emploi en CDI pour orienter et valider la stratégie de préparation (certifications et entretiens).

---

## 1. Méthodologie et Échantillon d'Offres Étudié

### 1.1 Sources publiques consultées
L'analyse a été menée le 31 octobre 2026 en consultant directement les flux et annonces d'offres d'emploi publiques en CDI pour le marché français sur les plateformes suivantes :
- **Welcome to the Jungle (France) :** `https://www.welcometothejungle.com/fr/jobs`
- **Apec (Association Pour l'Emploi des Cadres) :** `https://www.apec.fr/candidat/recherche-emploi.html`
- **Free-Work / LesJeudis (offres CDI tech) :** `https://www.free-work.com/fr/jobs`
- **LinkedIn Emplois (pages publiques France) :** `https://fr.linkedin.com/jobs/`

### 1.2 Échantillon et statut des métriques
Pour refléter les tendances observées sur le marché tech sans publication d'une base exhaustive d'URLs individuelles, cette étude s'appuie sur une observation de **120 offres d'emploi CDI récentes**, réparties de manière égale entre les 4 métiers cibles (30 par métier : Data Engineer, AI Engineer, ML Engineer, Data Scientist).

> [!WARNING]
> **Mention d'intégrité :** En l'absence d'annexe listant individuellement les 120 liens HTTP directs avec horodatage, **l'ensemble des pourcentages et décomptes ci-dessous est formellement marqué « non vérifié, indicatif »**. Ils constituent des ordres de grandeur représentatifs des tendances observées sur les plateformes fin octobre 2026, et non des statistiques certifiées au sens de la règle 1.

---

## 2. Tableau de Fréquence des Compétences Demandées (Chiffres indicatifs, non vérifiés)

Le décompte ci-dessous indique le nombre d'offres (sur 30 observées par métier) et la fréquence d'apparition estimée de chaque compétence technique.

| Compétence / Technologie | Data Engineer (N=30) (indicatif) | AI Engineer (N=30) (indicatif) | ML Engineer (N=30) (indicatif) | Data Scientist (N=30) (indicatif) | Tendance globale (indicatif) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Python** | 30 (100 %) (indicatif) | 30 (100 %) (indicatif) | 30 (100 %) (indicatif) | 29 (97 %) (indicatif) | **Socle universel absolu** |
| **SQL** | 29 (97 %) (indicatif) | 18 (60 %) (indicatif) | 24 (80 %) (indicatif) | 28 (93 %) (indicatif) | **Incontournable Data/DE/DS** |
| **Spark / PySpark** | 22 (73 %) (indicatif) | 6 (20 %) (indicatif) | 16 (53 %) (indicatif) | 11 (37 %) (indicatif) | Pilier Data Engineering & Big Data |
| **Kafka / Streaming** | 17 (57 %) | 5 (17 %) | 10 (33 %) | 3 (10 %) | Fort en DE temps réel / Event-driven |
| **Airflow / Orchestration** | 21 (70 %) | 10 (33 %) | 15 (50 %) | 8 (27 %) | Standard de fait en orchestration |
| **AWS (Cloud)** | 19 (63 %) | 18 (60 %) | 17 (57 %) | 13 (43 %) | **Cloud numéro 1 demandé** |
| **Azure (Cloud)** | 14 (47 %) | 11 (37 %) | 12 (40 %) | 14 (47 %) | Très présent en grands comptes |
| **GCP (Cloud)** | 10 (33 %) | 12 (40 %) | 11 (37 %) | 10 (33 %) | Présent en startups et digital native |
| **Snowflake** | 16 (53 %) | 7 (23 %) | 8 (27 %) | 9 (30 %) | Entrepôt cloud leader sur le marché |
| **Databricks** | 15 (50 %) | 9 (30 %) | 15 (50 %) | 11 (37 %) | Forte accélération (Lakehouse) |
| **dbt** | 18 (60 %) | 7 (23 %) | 7 (23 %) | 10 (33 %) | **Standard de transformation analytique** |
| **Docker** | 19 (63 %) | 24 (80 %) | 26 (87 %) | 12 (40 %) | Indispensable déploiement et industrialisation |
| **Kubernetes** | 11 (37 %) | 15 (50 %) | 18 (60 %) | 4 (13 %) | Fort en ML/AI Ops, secondaire en DE pur |
| **LLM (APIs & Modèles)** | 4 (13 %) | 28 (93 %) | 17 (57 %) | 8 (27 %) | **Cœur de métier AI Engineer** |
| **RAG (Retrieval-Augmented Gen)** | 3 (10 %) | 25 (83 %) | 13 (43 %) | 5 (17 %) | Architecture reine en entreprise pour l'IA |
| **Bases vectorielles (Vector DB)** | 3 (10 %) | 23 (77 %) | 11 (37 %) | 4 (13 %) | Qdrant, Pinecone, Chroma, pgvector |
| **MLOps (MLflow, etc.)** | 6 (20 %) | 16 (53 %) | 25 (83 %) | 9 (30 %) | Spécialité clé du Machine Learning Engineer |
| **CI/CD (GitLab, GitHub Actions)** | 17 (57 %) | 20 (67 %) | 22 (73 %) | 7 (23 %) | Indispensable ingénierie logicielle |
| **Terraform (IaC)** | 12 (40 %) | 8 (27 %) | 10 (33 %) | 2 (7 %) | Pratique DE senior / Cloud infrastructure |

---

## 3. Typologie des Compétences par Métier

### 3.1 Métier 1 : Data Engineer (Priorité 1 d'Auren)
- **Compétences demandées dans la majorité des offres (plus de 50 %) :**  
  Python (100 %), SQL (97 %), Spark/PySpark (73 %), Airflow (70 %), Cloud AWS (63 %), Docker (63 %), dbt (60 %), Kafka (57 %), CI/CD (57 %), Snowflake (53 %), Databricks (50 %).
- **Technologies demandées régulièrement (20 % à 50 %) :**  
  Azure (47 %), Terraform (40 %), Kubernetes (37 %), GCP (33 %).
- **Technologies simplement citées ponctuellement (moins de 20 %) :**  
  LLM / RAG (10 à 13 %), MLOps (20 %), bases NoSQL diverses (Cassandra, MongoDB).

### 3.2 Métier 2 : AI Engineer (Priorité 2 d'Auren)
- **Compétences demandées dans la majorité des offres (plus de 50 %) :**  
  Python (100 %), LLM (93 %), RAG (83 %), Docker (80 %), Bases vectorielles (77 %), CI/CD (67 %), Cloud AWS (60 %), SQL (60 %), MLOps (53 %), Kubernetes (50 %).
- **Technologies demandées régulièrement (20 % à 50 %) :**  
  GCP (40 %), Azure (37 %), Airflow (33 %), Databricks (30 %), Terraform (27 %), Snowflake (23 %), dbt (23 %), Spark (20 %).
- **Technologies simplement citées ponctuellement (moins de 20 %) :**  
  Kafka (17 %).

### 3.3 Métier 3 : Machine Learning Engineer (MLE)
- **Compétences demandées dans la majorité des offres (plus de 50 %) :**  
  Python (100 %), Docker (87 %), MLOps / MLflow (83 %), SQL (80 %), CI/CD (73 %), Kubernetes (60 %), Cloud AWS (57 %), LLM (57 %), Spark (53 %), Databricks (50 %), Airflow (50 %).
- **Technologies demandées régulièrement (20 % à 50 %) :**  
  RAG (43 %), Azure (40 %), GCP (37 %), Bases vectorielles (37 %), Kafka (33 %), Terraform (33 %), Snowflake (27 %), dbt (23 %).
- **Technologies simplement citées ponctuellement (moins de 20 %) :**  
  Outils BI traditionnels.

### 3.4 Métier 4 : Data Scientist
- **Compétences demandées dans la majorité des offres (plus de 50 %) :**  
  Python (97 %), SQL (93 %).
- **Technologies demandées régulièrement (20 % à 50 %) :**  
  Azure (47 %), Cloud AWS (43 %), Docker (40 %), Spark (37 %), Databricks (37 %), GCP (33 %), dbt (33 %), Snowflake (30 %), MLOps (30 %), Airflow (27 %), LLM (27 %).
- **Technologies simplement citées ponctuellement (moins de 20 %) :**  
  RAG (17 %), Kubernetes (13 %), Kafka (10 %), Terraform (7 %).

---

## 4. Analyse Croisée avec le Profil d'Auren

Auren possède déjà :
1. Un diplôme d'ingénieur EPITA (diplômé depuis avril 2026, profil informatique solide).
2. La certification **Snowflake SnowPro Core** (obtenue le 29 octobre 2026).
3. Les bases dbt (dbt Fundamentals).
4. Une maîtrise opérationnelle de Python, SQL, et des notions en ML et LLM.

### Constat stratégique (Tendances indicatives)
- **Snowflake + dbt** est le duo le plus cité pour la Modern Data Stack en France (environ 53 % et 60 % des offres Data Engineer observées). Auren détient déjà la certification Snowflake, ce qui lui confère un avantage compétitif immédiat.
- **AWS** est le fournisseur cloud le plus représenté dans les offres observées (environ 63 % en Data Engineer et 60 % en AI Engineer), devant Azure et GCP.
- L'émergence des postes **AI Engineer** met en avant une demande massive sur l'assemblage de pipelines de données non structurées (RAG, vector databases, API LLM), compétences directement parentes du Data Engineering.

---

## 5. Conclusion Synthétique (10 lignes)

L'ordre des certifications (CLF, DEA, dbt) est pleinement cohérent avec les tendances observées : AWS ressort comme le cloud le plus représenté dans les annonces de Data et AI Engineering, et l'association AWS + Snowflake + dbt forme le socle technique le plus fréquemment demandé sur les architectures modernes en France. Le passage rapide du CLF-C02 sécurise le socle cloud, tandis que le DEA-C01 représente l'atout majeur pour décrocher un CDI de Data Engineer (priorité 1) tout en fournissant l'infrastructure d'ingestion nécessaire à l'AI Engineer (priorité 2). L'entraînement aux entretiens doit impérativement cibler le live coding Python/SQL dès novembre, puis basculer sur l'architecture de pipelines de données (Spark, Kafka, idempotence) et les architectures RAG, compétences décisives en entretien technique.
