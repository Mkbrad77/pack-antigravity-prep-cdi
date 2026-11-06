import { CertCode, CourseKey, UnifiedTask } from './types';

export type CertSubTab = 'synthese' | 'chapitres' | 'fiches' | 'banque' | 'examen';
export type InterviewCourseCategory =
  | 'python'
  | 'sql'
  | 'de'
  | 'aie'
  | 'fiches_ml'
  | 'fiches_software';
export type InterviewSubTabId =
  | 'courses'
  | 'sql'
  | 'python'
  | 'simulator'
  | 'competencies';

export type AppNavTab =
  | 'dashboard'
  | 'planning'
  | 'courses'
  | 'certifications'
  | 'sessions'
  | 'srs'
  | 'settings'
  | 'interviews';

export interface TaskNavigationTarget {
  tab: AppNavTab;
  label: string;
  externalUrl?: string;
  interviewSubTab?: InterviewSubTabId;
  interviewCategory?: InterviewCourseCategory;
  interviewCourseId?: string;
  interviewSearchQuery?: string;
  interviewExerciseIds?: string[];
  interviewTaskLabel?: string;
  courseKey?: CourseKey;
  coursesSubTab?: 'udemy' | 'snowflake_dbt' | 'podcasts';
  podcastCertFilter?: CertCode | 'ALL';
  certCode?: CertCode;
  certSubTab?: CertSubTab;
}

export interface TaskActionGuide {
  whereLabel: string;
  recommendedDay: string;
  steps: string[];
  exercisesBadgeList?: Array<{ id: string; title: string; type: 'python' | 'sql' }>;
  primaryButton: TaskNavigationTarget;
  secondaryButton?: TaskNavigationTarget;
}

interface ExactInterviewTaskPlan {
  recommendedDay: string;
  courseCategory: InterviewCourseCategory;
  courseId: string;
  courseChapterLabel: string;
  practiceType: 'python' | 'sql' | 'simulator';
  exercises?: Array<{ id: string; title: string }>;
  simulatorFocus?: string;
}

const EXACT_INTERVIEW_PLANS: Record<string, ExactInterviewTaskPlan> = {
  // === SEMAINE 1 : MODULE 1 PYTHON (CHAPITRES 1.1 À 1.12) ===
  'W01-I1': {
    recommendedDay: 'Mercredi (soir, 20 min)',
    courseCategory: 'python',
    courseId: '01_structures_donnees_big_o',
    courseChapterLabel: 'Module 1 Python (Chap. 1.1 à 1.3)',
    practiceType: 'python',
    exercises: [
      { id: 'py-001', title: 'Déduplication avec préservation d\'ordre' },
      { id: 'py-016', title: 'Nettoyage et normalisation d\'emails (Compréhensions)' },
      { id: 'py-017', title: 'Inversion de dictionnaire par compréhension' },
    ],
  },
  'W01-I2': {
    recommendedDay: 'Samedi (matin, 20 min)',
    courseCategory: 'python',
    courseId: '02_collections_deque_heapq',
    courseChapterLabel: 'Module 1 Python (Chap. 1.4 à 1.6)',
    practiceType: 'python',
    exercises: [
      { id: 'py-011', title: 'Fréquences et Top-K éléments (Counter)' },
      { id: 'py-012', title: 'Regroupement multi-valeurs sans KeyError (defaultdict)' },
      { id: 'py-013', title: 'Buffer circulaire borné en O(1) (collections.deque)' },
    ],
  },
  'W01-I3': {
    recommendedDay: 'Dimanche (matin, 20 min)',
    courseCategory: 'python',
    courseId: '03_generateurs_decorateurs_context_managers',
    courseChapterLabel: 'Module 1 Python (Chap. 1.7 à 1.12)',
    practiceType: 'python',
    exercises: [
      { id: 'py-023', title: 'Découpage de flux en lots / batching (yield)' },
      { id: 'py-035', title: 'Décorateur de chronométrage d\'exécution (@wraps)' },
      { id: 'py-029', title: 'Gestionnaire de contexte de transaction (with / __exit__)' },
    ],
  },

  // === SEMAINE 2 : MODULE 2 SQL AVANCÉ (CHAPITRES 2.1 À 2.5) ===
  'W02-I1': {
    recommendedDay: 'Mercredi (soir, 30 min)',
    courseCategory: 'sql',
    courseId: '01_ordre_execution_jointures_null',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.1 à 2.3)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-004', title: 'Agrégation GROUP BY et filtrage HAVING sur commandes' },
      { id: 'sql-022', title: 'LEFT JOIN avec filtre temporel dans ON vs WHERE' },
      { id: 'sql-025', title: 'Prévention du Fan-out sur jointure 1-N multi-tables' },
    ],
  },
  'W02-I2': {
    recommendedDay: 'Samedi (matin, 30 min)',
    courseCategory: 'sql',
    courseId: '08_ensembles_not_exists_vs_not_in',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.4 et 2.5)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-005', title: 'Clients sans commande : Anti-Join NOT EXISTS vs NOT IN' },
      { id: 'sql-090', title: 'Consolidation multi-sources UNION ALL vs UNION' },
      { id: 'sql-091', title: 'Réconciliation d\'ensembles avec EXCEPT et INTERSECT' },
    ],
  },

  // === SEMAINE 3 : MODULE 2 SQL AVANCÉ (CHAPITRES 2.16 À 2.20) ===
  'W03-I1': {
    recommendedDay: 'Mercredi (soir, 30 min)',
    courseCategory: 'sql',
    courseId: '03_index_btree_covering_index',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.16 et 2.17)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-082', title: 'Réécriture de prédicat non-SARGable sur colonne indexée' },
      { id: 'sql-084', title: 'Optimisation par Index Composite et Covering Index' },
      { id: 'sql-087', title: 'Isolation transactionnelle et détection de conflits' },
    ],
  },
  'W03-I2': {
    recommendedDay: 'Samedi (matin, 30 min)',
    courseCategory: 'sql',
    courseId: '14_data_quality_observabilite_star_schema',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.18 à 2.20)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-096', title: 'Requête analytique sur Schéma en Étoile (Faits & Dimensions)' },
      { id: 'sql-101', title: 'Jointure temporelle Point-in-Time sur dimension SCD Type 2' },
      { id: 'sql-102', title: 'Audit d\'intégrité référentielle et détection d\'orphelins' },
    ],
  },

  // === SEMAINE 4 : MODULE 2 SQL AVANCÉ (CHAPITRES 2.6 À 2.8) ===
  'W04-I1': {
    recommendedDay: 'Mercredi (soir, 30 min)',
    courseCategory: 'sql',
    courseId: '05_cte_modulaires_vs_sous_requetes',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.6)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-031', title: 'Pipeline analytique modulaire à CTE chaînées' },
      { id: 'sql-032', title: 'Refactoring de sous-requêtes corrélées en CTE' },
      { id: 'sql-037', title: 'CTE récursive : hiérarchie managériale et niveaux' },
    ],
  },
  'W04-I2': {
    recommendedDay: 'Samedi (matin, 45 min)',
    courseCategory: 'sql',
    courseId: '02_window_functions_frames',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.7)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-040', title: 'Total cumulé (Running Total) par client et par mois' },
      { id: 'sql-041', title: 'Moyenne mobile sur 7 jours (ROWS BETWEEN 6 PRECEDING)' },
      { id: 'sql-044', title: 'Part de revenu produit par catégorie (SUM OVER PARTITION)' },
    ],
  },
  'W04-I3': {
    recommendedDay: 'Dimanche (matin, 45 min)',
    courseCategory: 'sql',
    courseId: '12_idempotence_merge_upsert_incremental',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.8)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-067', title: 'Déduplication idempotente avec ROW_NUMBER() = 1' },
      { id: 'sql-068', title: 'Extraction du dernier statut connu par entité (CDC)' },
      { id: 'sql-075', title: 'Simulation d\'Upsert incrémental sans doublons' },
    ],
  },

  // === SEMAINE 5 : MODULE 2 SQL AVANCÉ (CHAPITRES 2.9 À 2.14) ===
  'W05-I1': {
    recommendedDay: 'Mercredi (soir, 30 min)',
    courseCategory: 'sql',
    courseId: '11_patterns_dedoublonnage_top_n_gaps_islands',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.9)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-045', title: 'Top 3 des produits par catégorie avec DENSE_RANK' },
      { id: 'sql-073', title: 'Segmentation de clients en quartiles avec NTILE(4)' },
    ],
  },
  'W05-I2': {
    recommendedDay: 'Vendredi (soir, 30 min)',
    courseCategory: 'sql',
    courseId: '09_dates_intervalles_cohortes',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.11)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-060', title: 'Variation mensuelle du CA (MoM Growth) avec LAG()' },
      { id: 'sql-066', title: 'Analyse de rétention de cohortes M0, M1, M2' },
      { id: 'sql-076', title: 'Détection de churn et délai moyen entre deux achats (LEAD)' },
    ],
  },
  'W05-I3': {
    recommendedDay: 'Samedi (matin, 30 min)',
    courseCategory: 'sql',
    courseId: '07_grouping_sets_rollup_pivot_case_when',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.12)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-014', title: 'Pivot mensuel des revenus avec SUM(CASE WHEN ...)' },
      { id: 'sql-048', title: 'Taux de conversion par étape d\'entonnoir (Funnel SQL)' },
      { id: 'sql-052', title: 'Sous-totaux multi-dimensionnels et ratios conditionnels' },
    ],
  },
  'W05-I4': {
    recommendedDay: 'Dimanche (matin, 30 min)',
    courseCategory: 'sql',
    courseId: '10_json_semi_structure_flatten',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.14)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-069', title: 'Problème Gaps & Islands : séquences de jours consécutifs' },
      { id: 'sql-071', title: 'Sessionisation d\'événements avec seuil d\'inactivité de 30 min' },
      { id: 'sql-018', title: 'Extraction d\'attributs JSON et agrégation par événement' },
    ],
  },

  // === SEMAINE 6 : MODULE 2 SQL AVANCÉ (CHAPITRES 2.21 À 2.24) ===
  'W06-I1': {
    recommendedDay: 'Mercredi (soir, 40 min)',
    courseCategory: 'sql',
    courseId: '04_columnar_partitionnement_explain',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.21)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-085', title: 'Analyse de plan EXPLAIN : élimination d\'un Full Table Scan' },
      { id: 'sql-086', title: 'Optimisation de jointure lourde : pré-agrégation avant JOIN' },
    ],
  },
  'W06-I2': {
    recommendedDay: 'Samedi (matin, 40 min)',
    courseCategory: 'sql',
    courseId: '04_columnar_partitionnement_explain',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.23)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-093', title: 'Partition Pruning temporel et filtrage sur clés de clustering' },
      { id: 'sql-089', title: 'Réduction du volume scanné en architecture colonnaire' },
    ],
  },
  'W06-I3': {
    recommendedDay: 'Dimanche (matin, 40 min)',
    courseCategory: 'sql',
    courseId: '08_ensembles_not_exists_vs_not_in',
    courseChapterLabel: 'Module 2 SQL (Chap. 2.24)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-080', title: 'Piège du NOT IN en présence de valeurs NULL' },
      { id: 'sql-104', title: 'Différence exacte entre COUNT(*), COUNT(col) et COUNT(DISTINCT)' },
      { id: 'sql-105', title: 'Détection d\'anomalies Z-Score et contrôle qualité SQL' },
    ],
  },

  // === SEMAINE 7 : MODULE 1 PYTHON DATA (CHAPITRES 1.15 À 1.17) ===
  'W07-I1': {
    recommendedDay: 'Mercredi (soir, 40 min)',
    courseCategory: 'python',
    courseId: '12_algorithmique_fenetre_intervalles_dag',
    courseChapterLabel: 'Module 1 Python (Chap. 1.15)',
    practiceType: 'python',
    exercises: [
      { id: 'py-002', title: 'Fusion d\'intervalles temporels qui se chevauchent' },
      { id: 'py-004', title: 'Fenêtre glissante : moyenne mobile et maximum sur flux' },
      { id: 'py-008', title: 'Tri topologique d\'un DAG de tâches (Algorithme de Kahn)' },
    ],
  },
  'W07-I2': {
    recommendedDay: 'Samedi (matin, 40 min)',
    courseCategory: 'python',
    courseId: '06_memoire_gc_slots_profilage',
    courseChapterLabel: 'Module 1 Python (Chap. 1.16)',
    practiceType: 'python',
    exercises: [
      { id: 'py-024', title: 'Pipeline de transformation paresseux (Lazy Generator Chain)' },
      { id: 'py-031', title: 'Optimisation mémoire d\'objets avec __slots__' },
      { id: 'py-036', title: 'Fenêtre glissante en mémoire constante O(1) avec itertools' },
    ],
  },
  'W07-I3': {
    recommendedDay: 'Dimanche (matin, 40 min)',
    courseCategory: 'python',
    courseId: '11_serialisation_parquet_avro_arrow',
    courseChapterLabel: 'Module 1 Python (Chap. 1.17)',
    practiceType: 'python',
    exercises: [
      { id: 'py-027', title: 'Lecture et agrégation de JSONL volumineux par chunks' },
      { id: 'py-042', title: 'Conversion et typage strict de lots CSV vers structure colonnaire' },
      { id: 'py-046', title: 'Partitionnement de fichiers par date (Hive-style partitioning)' },
    ],
  },

  // === SEMAINE 8 : MODULE 1 PYTHON DATA (CHAPITRES 1.19 ET 1.20) ===
  'W08-I1': {
    recommendedDay: 'Mercredi (soir, 60 min)',
    courseCategory: 'python',
    courseId: '04_typage_pydantic_contrats',
    courseChapterLabel: 'Module 1 Python (Chap. 1.19)',
    practiceType: 'python',
    exercises: [
      { id: 'py-056', title: 'Validateur de contrat d\'événement et routage Dead-Letter Queue' },
      { id: 'py-057', title: 'Normalisation et coercition de types sur payloads JSON sales' },
      { id: 'py-070', title: 'Validation de schéma imbriqué avec règles métier strictes' },
    ],
  },
  'W08-I2': {
    recommendedDay: 'Samedi (matin, 60 min)',
    courseCategory: 'python',
    courseId: '09_packaging_clean_architecture_patterns',
    courseChapterLabel: 'Module 1 Python (Chap. 1.20)',
    practiceType: 'python',
    exercises: [
      { id: 'py-032', title: 'Connecteur générique d\'ingestion avec Protocol / ABC' },
      { id: 'py-033', title: 'Pattern Strategy et Factory pour sink de données multi-cibles' },
      { id: 'py-060', title: 'Injection de dépendances pour pipeline ETL testable' },
    ],
  },

  // === SEMAINE 9 : MODULE 1 PYTHON DATA (CHAPITRES 1.21 ET 1.22) ===
  'W09-I1': {
    recommendedDay: 'Mercredi (soir, 60 min)',
    courseCategory: 'python',
    courseId: '13_bilan_live_coding_python_data_ai',
    courseChapterLabel: 'Module 1 Python (Chap. 1.21)',
    practiceType: 'python',
    exercises: [
      { id: 'py-065', title: 'Décorateur @retry avec Exponential Backoff et Jitter' },
      { id: 'py-066', title: 'Circuit Breaker pour protéger une API externe fragile' },
      { id: 'py-069', title: 'Formateur de logs structurés JSON avec contexte d\'exécution' },
    ],
  },
  'W09-I2': {
    recommendedDay: 'Samedi (matin, 60 min)',
    courseCategory: 'python',
    courseId: '05_concurrence_gil_asyncio_multiprocessing',
    courseChapterLabel: 'Module 1 Python (Chap. 1.22)',
    practiceType: 'python',
    exercises: [
      { id: 'py-049', title: 'Exécution parallèle I/O avec contrôle de concurrence (Semaphore)' },
      { id: 'py-050', title: 'Ingestion paginée asynchrone tolérante aux pannes partielles' },
      { id: 'py-052', title: 'Découpage de calcul CPU-bound par lots parallèles' },
    ],
  },

  // === SEMAINE 10 : PYTHON DATA (1.23, 1.25) + MODULE 3 SYSTEM DESIGN (3.1) ===
  'W10-I1': {
    recommendedDay: 'Mercredi (soir, 45 min)',
    courseCategory: 'python',
    courseId: '07_pandas_polars_vectorisation',
    courseChapterLabel: 'Module 1 Python (Chap. 1.23)',
    practiceType: 'python',
    exercises: [
      { id: 'py-041', title: 'Agrégation vectorisée et nettoyage sans boucle iterrows' },
      { id: 'py-044', title: 'Jointure analytique et imputation de valeurs manquantes par groupe' },
      { id: 'py-045', title: 'Calcul de métriques glissantes et débruitage de séries' },
    ],
  },
  'W10-I2': {
    recommendedDay: 'Samedi (matin, 45 min)',
    courseCategory: 'python',
    courseId: '08_pytest_fixtures_mocking',
    courseChapterLabel: 'Module 1 Python (Chap. 1.25)',
    practiceType: 'python',
    exercises: [
      { id: 'py-055', title: 'Assertion d\'égalité de tables de données avec tolérance flottante' },
      { id: 'py-058', title: 'Isolation d\'appels externes par Mock / Stub déterministe' },
      { id: 'py-068', title: 'Vérificateur de contrat de schéma et tests paramétrés' },
    ],
  },
  'W10-I3': {
    recommendedDay: 'Dimanche (matin, 30 min)',
    courseCategory: 'de',
    courseId: '3_1_etl_vs_elt',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.1)',
    practiceType: 'simulator',
    simulatorFocus: 'Comparer OLTP (Aurora/Postgres) vs NoSQL (DynamoDB) vs OLAP (Redshift/Snowflake/Iceberg)',
  },

  // === SEMAINE 11 : MODULE 3 SYSTEM DESIGN & MODÉLISATION (CHAPITRES 3.2 À 3.5) ===
  'W11-I1': {
    recommendedDay: 'Mercredi (soir, 30 min)',
    courseCategory: 'de',
    courseId: '3_2_modelisation_kimball_star_schema',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.2)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-096', title: 'Modélisation et requête sur Schéma en Étoile (Faits & Dimensions)' },
      { id: 'sql-052', title: 'Agrégation multi-axes sur dimensions conformes' },
    ],
  },
  'W11-I2': {
    recommendedDay: 'Vendredi (soir, 30 min)',
    courseCategory: 'de',
    courseId: '3_11_dbt_en_production',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.3)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-101', title: 'Jointure Point-in-Time sur Dimension SCD Type 2 (valid_from / valid_to)' },
      { id: 'sql-075', title: 'Construction d\'un modèle incrémental idempotent' },
    ],
  },
  'W11-I3': {
    recommendedDay: 'Samedi (matin, 30 min)',
    courseCategory: 'de',
    courseId: '3_8_data_quality_circuit_breakers',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.4)',
    practiceType: 'simulator',
    simulatorFocus: 'Architecture Médaillon (Bronze, Silver, Gold), Contrats de données et Circuit Breakers',
  },
  'W11-I4': {
    recommendedDay: 'Dimanche (matin, 30 min)',
    courseCategory: 'de',
    courseId: '3_6_lakehouse_formats_ouverts',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.5)',
    practiceType: 'simulator',
    simulatorFocus: 'Formats Parquet vs Avro et tables ouvertes Apache Iceberg / Delta Lake (Time Travel, Compaction)',
  },

  // === SEMAINE 12 : MODULE 3 SPARK & STREAMING (CHAPITRES 3.6 À 3.8) ===
  'W12-I1': {
    recommendedDay: 'Mercredi (soir, 40 min)',
    courseCategory: 'de',
    courseId: '3_10_optimisation_spark',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.6)',
    practiceType: 'simulator',
    simulatorFocus: 'Architecture Apache Spark : Driver, Executors, DAG, Stages, Tasks et mémoire',
  },
  'W12-I2': {
    recommendedDay: 'Samedi (matin, 40 min)',
    courseCategory: 'de',
    courseId: '3_10_optimisation_spark',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.7)',
    practiceType: 'simulator',
    simulatorFocus: 'Optimisation PySpark : Shuffle, Broadcast Join, AQE et résolution du Data Skew par Salting',
  },
  'W12-I3': {
    recommendedDay: 'Dimanche (matin, 40 min)',
    courseCategory: 'de',
    courseId: '3_12_streaming_kafka',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.8)',
    practiceType: 'simulator',
    simulatorFocus: 'Streaming Kafka et Kinesis : Partitions, Consumer Groups, Offsets et Exactly-Once',
  },

  // === SEMAINE 13 : MODULE 3 IDEMPOTENCE & SYSTEM DESIGN 1 (CHAPITRES 3.11 ET 3.13) ===
  'W13-I1': {
    recommendedDay: 'Mercredi (soir, 60 min)',
    courseCategory: 'de',
    courseId: '3_17_idempotence_pipelines',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.11)',
    practiceType: 'simulator',
    simulatorFocus: 'Idempotence absolue, Backfill historique et gestion des Late-Arriving Data',
  },
  'W13-I2': {
    recommendedDay: 'Samedi (matin, 60 min)',
    courseCategory: 'de',
    courseId: '3_26_etude_cas_pipeline_10m',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.13)',
    practiceType: 'simulator',
    simulatorFocus: 'System Design n°1 : Pipeline e-commerce temps réel + analytique (10M lignes/jour)',
  },

  // === SEMAINE 14 : MODULE 3 SYSTEM DESIGN 2 (CHAPITRE 3.14) ===
  'W14-I1': {
    recommendedDay: 'Samedi (matin, 60 min)',
    courseCategory: 'de',
    courseId: '3_27_etude_cas_late_data',
    courseChapterLabel: 'Module 3 Data Engineering (Chap. 3.14)',
    practiceType: 'simulator',
    simulatorFocus: 'System Design n°2 : Plateforme de logs à haut débit, Watermarking et détection d\'anomalies',
  },

  // === SEMAINE 15 : MODULE 4 AI ENGINEERING (CHAPITRES 4.3 ET 4.6) ===
  'W15-I1': {
    recommendedDay: 'Mercredi (soir, 40 min)',
    courseCategory: 'aie',
    courseId: '4_6_embeddings_modeles_encodage',
    courseChapterLabel: 'Module 4 AI Engineering (Chap. 4.3)',
    practiceType: 'python',
    exercises: [
      { id: 'py-047', title: 'Calcul vectoriel de Similarité Cosinus et normalisation L2' },
      { id: 'py-048', title: 'Recherche des Top-K voisins les plus proches par score de similarité' },
    ],
  },
  'W15-I2': {
    recommendedDay: 'Samedi (matin, 40 min)',
    courseCategory: 'aie',
    courseId: '4_7_bases_vectorielles_hnsw_ivf',
    courseChapterLabel: 'Module 4 AI Engineering (Chap. 4.6)',
    practiceType: 'simulator',
    simulatorFocus: 'Bases vectorielles (pgvector, OpenSearch) : HNSW vs IVF-PQ et pré-filtrage metadata',
  },

  // === SEMAINE 16 : MODULE 4 RAG, CHUNKING & HYBRID SEARCH (CHAPITRES 4.7 À 4.9) ===
  'W16-I1': {
    recommendedDay: 'Mercredi (soir, 40 min)',
    courseCategory: 'aie',
    courseId: '4_8_systeme_rag_complet',
    courseChapterLabel: 'Module 4 AI Engineering (Chap. 4.7)',
    practiceType: 'simulator',
    simulatorFocus: 'Architecture RAG de bout en bout et pipeline d\'indexation documentaire idempotent',
  },
  'W16-I2': {
    recommendedDay: 'Samedi (matin, 40 min)',
    courseCategory: 'aie',
    courseId: '4_9_strategies_chunking',
    courseChapterLabel: 'Module 4 AI Engineering (Chap. 4.8)',
    practiceType: 'python',
    exercises: [
      { id: 'py-038', title: 'Découpage de texte (Chunking) avec recouvrement (Overlap)' },
      { id: 'py-039', title: 'Nettoyage et extraction structurée de documents Markdown' },
    ],
  },
  'W16-I3': {
    recommendedDay: 'Dimanche (matin, 40 min)',
    courseCategory: 'aie',
    courseId: '4_11_reranking_recherche_hybride',
    courseChapterLabel: 'Module 4 AI Engineering (Chap. 4.9)',
    practiceType: 'python',
    exercises: [
      { id: 'py-003', title: 'Fusion de classements par Reciprocal Rank Fusion (RRF)' },
      { id: 'py-010', title: 'Sélection Top-K hybride lexicale (BM25) + vectorielle' },
    ],
  },

  // === SEMAINE 17 : MODULE 4 ÉVALUATION RAG, AGENTS & PROD (CHAPITRES 4.11, 4.16, 4.19) ===
  'W17-I1': {
    recommendedDay: 'Mercredi (soir, 40 min)',
    courseCategory: 'aie',
    courseId: '4_16_evaluation_rag_ragas',
    courseChapterLabel: 'Module 4 AI Engineering (Chap. 4.11)',
    practiceType: 'simulator',
    simulatorFocus: 'Évaluation RAG : Recall@K, Precision@K, Faithfulness, Answer Relevance (Ragas)',
  },
  'W17-I2': {
    recommendedDay: 'Samedi (matin, 40 min)',
    courseCategory: 'aie',
    courseId: '4_2_inference_structured_outputs_tool_calling',
    courseChapterLabel: 'Module 4 AI Engineering (Chap. 4.16)',
    practiceType: 'python',
    exercises: [
      { id: 'py-067', title: 'Routeur d\'appel d\'outils (Tool Calling) avec validation stricte' },
      { id: 'py-051', title: 'Limiteur de débit (Token Bucket / Rate Limiter) pour appels LLM' },
    ],
  },
  'W17-I3': {
    recommendedDay: 'Dimanche (matin, 40 min)',
    courseCategory: 'aie',
    courseId: '4_19_securite_hallucinations_guardrails',
    courseChapterLabel: 'Module 4 AI Engineering (Chap. 4.19)',
    practiceType: 'simulator',
    simulatorFocus: 'Mise en production LLM : Latence TTFT, Cache sémantique, Coûts et Guardrails anti-injection',
  },

  // === SEMAINE 18 : MODULE 4 SYSTEM DESIGN IA & MODULE 5 ML ESSENTIALS ===
  'W18-I1': {
    recommendedDay: 'Mercredi (soir, 60 min)',
    courseCategory: 'aie',
    courseId: '4_24_etude_cas_assistant_entreprise',
    courseChapterLabel: 'Module 4 AI Engineering (Chap. 4.24)',
    practiceType: 'simulator',
    simulatorFocus: 'System Design IA : Assistant documentaire multi-tenant avec filtrage RBAC et masquage PII',
  },
  'W18-I2': {
    recommendedDay: 'Samedi (matin, 60 min)',
    courseCategory: 'fiches_ml',
    courseId: '5_1_algorithmes_supervises',
    courseChapterLabel: 'Module 5 ML Essentials (Fiches 5.1 à 5.5)',
    practiceType: 'simulator',
    simulatorFocus: 'Fondamentaux ML : Validation croisée sans Data Leakage, Précision/Rappel/PR-AUC, XGBoost et Drift',
  },

  // === SEMAINE 19 : MODULE 6 SOFTWARE ENGINEERING & SIMULATION 1 ===
  'W19-I1': {
    recommendedDay: 'Mercredi (soir, 60 min)',
    courseCategory: 'fiches_software',
    courseId: '6_1_dockerfile_robuste',
    courseChapterLabel: 'Module 6 Software & DevOps (Fiches 6.1 à 6.5)',
    practiceType: 'simulator',
    simulatorFocus: 'Industrialisation : Docker multi-stage, Git workflow, Slim CI dbt, Linux/Bash et Terraform',
  },
  'W19-I2': {
    recommendedDay: 'Samedi (matin, 40 min)',
    courseCategory: 'sql',
    courseId: '02_window_functions_frames',
    courseChapterLabel: 'Simulation Live Coding n°1 (SQL + Python)',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-045', title: '[Chrono 15 min] Top-N par catégorie avec DENSE_RANK' },
      { id: 'sql-069', title: '[Chrono 15 min] Détection de séquences (Gaps & Islands)' },
    ],
  },

  // === SEMAINE 20 : SIMULATIONS SYSTEM DESIGN DATA & AI ===
  'W20-I1': {
    recommendedDay: 'Mercredi (soir, 60 min)',
    courseCategory: 'de',
    courseId: '3_26_etude_cas_pipeline_10m',
    courseChapterLabel: 'Simulation n°2 : System Design Data Engineering',
    practiceType: 'simulator',
    simulatorFocus: 'Simulation System Design Data Engineering (45 min chrono + 15 min auto-évaluation)',
  },
  'W20-I2': {
    recommendedDay: 'Samedi (matin, 60 min)',
    courseCategory: 'aie',
    courseId: '4_24_etude_cas_assistant_entreprise',
    courseChapterLabel: 'Simulation n°3 : System Design AI / RAG',
    practiceType: 'simulator',
    simulatorFocus: 'Simulation System Design AI / RAG industriel (45 min chrono + 15 min auto-évaluation)',
  },

  // === SEMAINE 21 : SPRINT FINAL LIVE CODING & FASTAPI ===
  'W21-I1': {
    recommendedDay: 'Mercredi (soir, 90 min)',
    courseCategory: 'sql',
    courseId: '11_patterns_dedoublonnage_top_n_gaps_islands',
    courseChapterLabel: 'Sprint Final Live Coding SQL & Python',
    practiceType: 'sql',
    exercises: [
      { id: 'sql-067', title: 'Déduplication idempotente sur flux CDC' },
      { id: 'sql-066', title: 'Matrice de rétention de cohortes clients' },
      { id: 'sql-071', title: 'Sessionisation d\'événements par fenêtre d\'inactivité' },
      { id: 'sql-101', title: 'Jointure temporelle sur dimension SCD Type 2' },
    ],
  },
  'W21-I2': {
    recommendedDay: 'Samedi (matin, 90 min)',
    courseCategory: 'python',
    courseId: '10_fastapi_production_serving',
    courseChapterLabel: 'Module 1 Python (Chap. 1.24 à 1.27 : FastAPI & Debugging)',
    practiceType: 'python',
    exercises: [
      { id: 'py-056', title: 'Validation Pydantic et isolation Dead-Letter Queue' },
      { id: 'py-065', title: 'Résilience API avec Retry et Backoff exponentiel' },
      { id: 'py-067', title: 'Exécution sécurisée de routeur d\'endpoints / tools' },
    ],
  },

  // === SEMAINE 22 : RÉPÉTITION GÉNÉRALE ===
  'W22-I1': {
    recommendedDay: 'Mercredi (soir, 90 min)',
    courseCategory: 'de',
    courseId: '3_17_idempotence_pipelines',
    courseChapterLabel: 'Répétition Générale Technique (Data, AI, SQL, Python)',
    practiceType: 'simulator',
    simulatorFocus: 'Répétition générale multi-sujets : System Design Data/AI + Questions pièges SQL/Python/dbt/AWS',
  },
  'W22-I2': {
    recommendedDay: 'Samedi (matin, 90 min)',
    courseCategory: 'aie',
    courseId: '4_16_evaluation_rag_ragas',
    courseChapterLabel: 'Revue Finale avant prise de poste CDI',
    practiceType: 'simulator',
    simulatorFocus: 'Validation finale de la Matrice de Compétences et des Flashcards SM-2',
  },
};

function getRecommendedDayForTask(task: UnifiedTask): string {
  const id = task.id.toUpperCase();
  if (EXACT_INTERVIEW_PLANS[id]) {
    return EXACT_INTERVIEW_PLANS[id].recommendedDay;
  }
  if (task.category === 'certification') {
    if (task.priority === 'bonus') {
      return 'Optionnel (Dimanche si avance)';
    }
    if (id.endsWith('-C1')) return 'Lundi (soir)';
    if (id.endsWith('-C2')) return 'Mardi (soir)';
    if (id.endsWith('-C3')) return 'Jeudi (soir)';
    if (id.endsWith('-C4')) return 'Vendredi (soir) ou Samedi (matin)';
    if (id.endsWith('-C5')) return 'Samedi (après-midi)';
    return 'En semaine (Lundi à Vendredi)';
  } else {
    if (task.priority === 'bonus') {
      return 'Optionnel (Dimanche si avance)';
    }
    if (id.endsWith('-I1')) return 'Mercredi (soir)';
    if (id.endsWith('-I2')) return 'Samedi (matin)';
    if (id.endsWith('-I3')) return 'Dimanche (matin)';
    if (id.endsWith('-I4')) return 'Dimanche (après-midi)';
    return 'Week-end (Samedi / Dimanche)';
  }
}

export function getTaskActionGuide(task: UnifiedTask): TaskActionGuide {
  const idUpper = task.id.toUpperCase();
  const recommendedDay = getRecommendedDayForTask(task);
  const titleLower = task.title.toLowerCase();

  // =========================================================================
  // 1. TÂCHES PRÉPARATION AUX ENTRETIENS TECHNIQUES (AVEC PLAN EXACT PAR ID)
  // =========================================================================
  if (task.category === 'interview') {
    const exactPlan = EXACT_INTERVIEW_PLANS[idUpper];
    if (exactPlan) {
      const courseBtn: TaskNavigationTarget = {
        tab: 'interviews',
        interviewSubTab: 'courses',
        interviewCategory: exactPlan.courseCategory,
        interviewCourseId: exactPlan.courseId,
        label: `📚 Étape 1 : Lire le Cours (${exactPlan.courseChapterLabel})`,
      };

      if (exactPlan.practiceType === 'python' && exactPlan.exercises) {
        const exIds = exactPlan.exercises.map((e) => e.id);
        const exSummary = exactPlan.exercises.map((e) => `${e.id} (${e.title})`).join(' + ');
        return {
          whereLabel: `Onglet 8. Entretiens techniques > 1. Cours (${exactPlan.courseChapterLabel}) puis 3. Atelier Python`,
          recommendedDay: exactPlan.recommendedDay,
          exercisesBadgeList: exactPlan.exercises.map((e) => ({ ...e, type: 'python' })),
          steps: [
            `Étape 1 (Cours, ~10 min) : Clique sur "Étape 1 : Lire le Cours" ci-dessous pour ouvrir directement le chapitre "${exactPlan.courseChapterLabel}".`,
            `Étape 2 (Pratique, ~${Math.max(10, task.effective_est_min - 10)} min) : Clique sur "Étape 2 : Pratiquer les ${exIds.length} exercices Python" pour ouvrir l'Atelier pré-filtré sur : ${exSummary}.`,
            `Étape 3 (Validation) : Une fois les ${exIds.length} exercices validés par les tests unitaires, clique sur "Terminer" sur cette carte.`,
          ],
          primaryButton: courseBtn,
          secondaryButton: {
            tab: 'interviews',
            interviewSubTab: 'python',
            interviewExerciseIds: exIds,
            interviewTaskLabel: `${task.id} : ${task.title}`,
            label: `🐍 Étape 2 : Pratiquer les ${exIds.length} ex. (${exIds.join(', ')})`,
          },
        };
      }

      if (exactPlan.practiceType === 'sql' && exactPlan.exercises) {
        const exIds = exactPlan.exercises.map((e) => e.id);
        const exSummary = exactPlan.exercises.map((e) => `${e.id} (${e.title})`).join(' + ');
        return {
          whereLabel: `Onglet 8. Entretiens techniques > 1. Cours (${exactPlan.courseChapterLabel}) puis 2. Atelier SQL`,
          recommendedDay: exactPlan.recommendedDay,
          exercisesBadgeList: exactPlan.exercises.map((e) => ({ ...e, type: 'sql' })),
          steps: [
            `Étape 1 (Cours, ~10 min) : Clique sur "Étape 1 : Lire le Cours" ci-dessous pour ouvrir directement le chapitre "${exactPlan.courseChapterLabel}".`,
            `Étape 2 (Pratique, ~${Math.max(15, task.effective_est_min - 10)} min) : Clique sur "Étape 2 : Pratiquer les ${exIds.length} exercices SQL" pour ouvrir l'Atelier SQL pré-filtré sur : ${exSummary}.`,
            `Étape 3 (Validation) : Compare tes requêtes avec le corrigé optimal, puis clique sur "Terminer" sur cette carte.`,
          ],
          primaryButton: courseBtn,
          secondaryButton: {
            tab: 'interviews',
            interviewSubTab: 'sql',
            interviewExerciseIds: exIds,
            interviewTaskLabel: `${task.id} : ${task.title}`,
            label: `🗄️ Étape 2 : Pratiquer les ${exIds.length} ex. (${exIds.join(', ')})`,
          },
        };
      }

      // Cas System Design / AI / Fiches + Simulateur
      return {
        whereLabel: `Onglet 8. Entretiens techniques > 1. Cours (${exactPlan.courseChapterLabel}) puis 4. Simulateur d'Entretien`,
        recommendedDay: exactPlan.recommendedDay,
        steps: [
          `Étape 1 (Cours, ~20 min) : Clique sur "Étape 1 : Lire le Cours" pour étudier le chapitre exact "${exactPlan.courseChapterLabel}".`,
          `Étape 2 (Entraînement oral/écrit, ~${Math.max(15, task.effective_est_min - 20)} min) : ${exactPlan.simulatorFocus || 'Réponds à 3-5 questions d\'entretien sur ce thème dans le Simulateur.'}`,
          `Étape 3 (Validation) : Auto-évalue ta réponse face au corrigé détaillé et clique sur "Terminer".`,
        ],
        primaryButton: courseBtn,
        secondaryButton: {
          tab: 'interviews',
          interviewSubTab: 'simulator',
          label: '🎯 Étape 2 : S\'entraîner sur le Simulateur',
        },
      };
    }

    // Fallback générique si une tâche interview personnalisée est créée
    return {
      whereLabel: 'Onglet 8. Entretiens techniques > 1. Cours & Fiches mémo + Ateliers pratiques',
      recommendedDay,
      steps: [
        'Étape 1 : Consulte le cours correspondant dans "1. Cours & Fiches mémo".',
        'Étape 2 : Pratique sur l\'Atelier SQL, l\'Atelier Python ou le Simulateur d\'Entretien.',
        'Étape 3 : Clique sur "Terminer" une fois la séance accomplie.',
      ],
      primaryButton: {
        tab: 'interviews',
        interviewSubTab: 'courses',
        interviewCategory: 'python',
        label: '📚 Ouvrir les Cours Entretiens (Modules 1 à 6)',
      },
      secondaryButton: {
        tab: 'interviews',
        interviewSubTab: 'simulator',
        label: '🎯 Ouvrir le Simulateur',
      },
    };
  }

  // =========================================================================
  // 2. TÂCHES CERTIFICATIONS, PODCASTS NOTEBOOKLM, QUICKSTARTS SNOWFLAKE & DBT
  // =========================================================================
  const certCode: CertCode = task.cert_code || 'CLF-C02';

  // Cas 2.0 : Écoute de Podcasts NotebookLM (Écoute récursive sur mobile / transports)
  if (task.type === 'podcast' || titleLower.includes('podcast')) {
    return {
      whereLabel: `Onglet 3. Cours Udemy, Podcasts & Snowflake > 🎧 Studio Podcasts NotebookLM (${certCode})`,
      recommendedDay: 'Quotidien (Matin / Soir dans les transports ou marche, écoute récursive 1.25x)',
      steps: [
        `Étape 1 (Ouverture Mobile / PC) : Clique sur "🎧 Ouvrir le Studio Podcasts (${certCode})" ci-dessous pour lancer le lecteur audio intégré avec contrôle écran verrouillé.`,
        `Étape 2 (Écoute Récursive Active) : Écoute les épisodes au programme (${task.lectures || task.title}) une 1re fois le jour des leçons, puis réécoute-les à 1.25x ou 1.5x pour ancrer chaque piège d'examen.`,
        `Étape 3 (Validation) : Une fois les épisodes écoutés et marqués dans le Studio Audio, clique sur "Terminer".`,
      ],
      primaryButton: {
        tab: 'courses',
        coursesSubTab: 'podcasts',
        podcastCertFilter: certCode,
        label: `🎧 Ouvrir le Studio Podcasts (${certCode})`,
      },
      secondaryButton: {
        tab: 'certifications',
        certCode,
        certSubTab: 'fiches',
        label: `📑 Voir les Fiches Mémo ${certCode}`,
      },
    };
  }

  // Cas 2A : Quickstart Snowflake ML ou Quickstart dbt + Snowflake
  if (task.type === 'quickstart' || titleLower.includes('quickstart')) {
    return {
      whereLabel: `1) Guide Officiel Quickstart (${task.resource}) | 2) Onglet 3. Cours Udemy, Snowflake & Devoteam`,
      recommendedDay,
      steps: [
        `Étape 1 (Ouverture du Lab) : Clique sur "❄️ Ouvrir le Quickstart Officiel" ci-dessous pour lancer le guide pas-à-pas dans un nouvel onglet (${task.url || task.resource}).`,
        `Étape 2 (Exécution Hands-On, ~${task.effective_est_min} min) : Exécute le Notebook / SQL dans ton compte Snowflake Free Trial (120j / 400$ AWS us-west-2 ou Cortex 30j) ou dbt Cloud.`,
        `Étape 3 (Livrable & Validation) : Vérifie le livrable attendu ("${task.deliverable}") puis clique sur "Terminer".`,
      ],
      primaryButton: task.url
        ? {
            tab: 'courses',
            externalUrl: task.url,
            label: '❄️ Ouvrir le Quickstart Officiel (Lien direct)',
          }
        : {
            tab: 'courses',
            label: '❄️ Ouvrir le Hub Snowflake & dbt (Onglet 3)',
          },
      secondaryButton: {
        tab: 'courses',
        label: '🌐 Voir tous les Quickstarts & Essais Snowflake (Onglet 3)',
      },
    };
  }

  // Cas 2B : Parcours Officiel dbt Learn ou Ressource Interne Devoteam (Fred)
  if (task.type === 'dbt_learn' || task.type === 'devoteam') {
    return {
      whereLabel: `1) Ressource officielle / Devoteam (${task.resource}) | 2) Onglet 3. Hub Snowflake & Devoteam + Onglet 4. Certifications (${certCode})`,
      recommendedDay,
      steps: [
        `Étape 1 (Accès direct) : Clique sur "🔗 Ouvrir la Ressource (${task.resource})" ci-dessous pour ouvrir le cours officiel learn.getdbt.com ou le document interne Devoteam.`,
        `Étape 2 (Étude & Pratique, ~${task.effective_est_min} min) : Réalise le module et valide le livrable : "${task.deliverable}".`,
        `Étape 3 (Consolidation) : Consulte les Chapitres & Fiches ${certCode} dans l'onglet 4, puis clique sur "Terminer".`,
      ],
      primaryButton: task.url
        ? {
            tab: 'courses',
            externalUrl: task.url,
            label: `🔗 Ouvrir ${task.type === 'devoteam' ? 'la Ressource Devoteam' : 'dbt Learn Officiel'} (Nouvel onglet)`,
          }
        : {
            tab: 'courses',
            label: '🌐 Ouvrir le Hub Ressources (Onglet 3)',
          },
      secondaryButton: {
        tab: 'certifications',
        certCode,
        certSubTab: 'chapitres',
        label: `📖 Lire les Chapitres & Fiches ${certCode}`,
      },
    };
  }

  // Cas 2C : Examen blanc ou quiz d'évaluation (Qanalabs, Study Guide, Simulateur interne)
  if (
    task.type === 'exam_blanc' ||
    titleLower.includes('examen blanc') ||
    titleLower.includes('practice exam') ||
    titleLower.includes('qanalabs') ||
    titleLower.includes('diagnostic')
  ) {
    return {
      whereLabel: task.url
        ? `1) Lien direct (${task.resource}) | 2) Onglet 4. Certifications & Blancs (${certCode}) > Simulation & Saisie Score`
        : `Onglet 4. Certifications & Blancs (${certCode}) > Sous-onglet Simulation Examen Blanc / Saisie Score`,
      recommendedDay,
      steps: [
        task.url
          ? `Étape 1 : Clique sur "🌐 Ouvrir la Plateforme d'Examen Blanc" (${task.resource}) ou lance le simulateur de 65 questions dans l'onglet 4.`
          : `Étape 1 : Passe le test blanc sur la plateforme indiquée (${task.resource}) ou lance directement le simulateur de 65 questions dans l'onglet 4. Certifications & Blancs.`,
        'Étape 2 : Enregistre ton score (%) et tes scores par domaine dans l\'onglet "4. Certifications & Blancs" et note tes erreurs dans le Journal d\'erreurs.',
        'Étape 3 : Reviens ici et clique sur "Terminer".',
      ],
      primaryButton: task.url
        ? {
            tab: 'certifications',
            externalUrl: task.url,
            label: `🌐 Ouvrir ${task.resource} (Lien direct)`,
          }
        : {
            tab: 'certifications',
            certCode,
            certSubTab: 'examen',
            label: `📝 Ouvrir l'Examen Blanc ${certCode}`,
          },
      secondaryButton: {
        tab: 'certifications',
        certCode,
        certSubTab: 'examen',
        label: `📝 Simulateur & Saisie Score (${certCode})`,
      },
    };
  }

  // Cas 2D : Cours vidéo Udemy (Merico, Maarek, Nikolai, Toth, Weigel)
  if (task.course_key) {
    const rangeText =
      task.first_lecture && task.last_lecture
        ? `leçons ${task.first_lecture} à ${task.last_lecture}`
        : task.lectures || 'leçons du bloc';
    return {
      whereLabel: `1) Sur Udemy : regarder ${task.resource} (${rangeText}) | 2) Dans l'application : Onglet 4. Certifications (${certCode}) & Onglet 3. Cours Udemy`,
      recommendedDay,
      steps: [
        `Étape 1 : Regarde les vidéos (${rangeText}) sur ton compte Udemy${task.url ? ' (clique sur le bouton Udemy si besoin)' : ''} et fais les manipulations importantes.`,
        `Étape 2 : Ouvre "4. Certifications & Blancs" (${certCode}) pour relire la Fiche de révision et le Chapitre d'étude correspondant aux leçons vues.`,
        `Étape 3 : Clique sur "Terminer" : cela cochera automatiquement les ${rangeText} dans l'onglet 3 et mettra à jour ton % de certification.`,
      ],
      primaryButton: {
        tab: 'certifications',
        certCode,
        certSubTab: 'chapitres',
        label: `📖 Lire les Chapitres & Fiches ${certCode}`,
      },
      secondaryButton: {
        tab: 'courses',
        courseKey: task.course_key,
        label: `🎬 Voir le détail des ${rangeText}`,
      },
    };
  }

  // Cas 2E : Autres tâches certification (Examen officiel, Setup AWS, lab pratique, révision générale)
  return {
    whereLabel: `Onglet 4. Certifications & Blancs (${certCode}) + Onglet 6. Répétition espacée (Flashcards)`,
    recommendedDay,
    steps: [
      `Étape 1 : Réalise l'action demandée : "${task.title}" (${task.resource}).`,
      `Étape 2 : Consulte les fiches de synthèse ${certCode} dans l'onglet "4. Certifications & Blancs" ou révise tes cartes dans "6. Répétition espacée".`,
      'Étape 3 : Clique sur "Terminer" une fois l\'étape validée.',
    ],
    primaryButton: task.url
      ? {
          tab: 'certifications',
          externalUrl: task.url,
          label: `🔗 Ouvrir le Lien Officiel (${certCode})`,
        }
      : {
          tab: 'certifications',
          certCode,
          certSubTab: 'fiches',
          label: `📑 Ouvrir les Fiches Mémo ${certCode}`,
        },
    secondaryButton: {
      tab: 'srs',
      label: '🧠 Réviser mes Flashcards (SM-2)',
    },
  };
}
