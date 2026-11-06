export type CertCode = 'CLF-C02' | 'DEA-C01' | 'DBT';
export type CourseKey = 'merico' | 'maarek' | 'nikolai' | 'toth' | 'weigel';
export type TaskPriority = 'core' | 'bonus';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'postponed' | 'skipped' | 'compressed';
export type TaskCategory = 'certification' | 'interview';

export type ProvenanceTag =
  | 'officielle'
  | 'communauté (URL)'
  | 'générée par IA et vérifiée dans la documentation (date)'
  | 'générée par IA non vérifiée';

export const ALLOWED_PROVENANCE_TAGS: ProvenanceTag[] = [
  'officielle',
  'communauté (URL)',
  'générée par IA et vérifiée dans la documentation (date)',
  'générée par IA non vérifiée',
];

export interface CourseBlock {
  id: string;
  label: string;
  first_lecture: number;
  last_lecture: number;
  priority: string;
  items: number;
  minutes_total: number;
  minutes_remaining: number;
}

export interface CourseItem {
  i: number;
  n: number | null;
  title: string;
  type: 'lec' | 'quiz' | 'ex' | 'exam' | string;
  minutes: number;
  done: boolean;
  block: string;
  hands_on: boolean;
}

export interface UdemyCourse {
  key: CourseKey;
  title: string;
  instructor: string;
  lang: string;
  role: string;
  header_progress: string;
  platform: string;
  stats: {
    items: number;
    done_items: number;
    minutes_total: number;
    minutes_remaining: number;
  };
  blocks: CourseBlock[];
  items: CourseItem[];
}

export interface SkillBuilderResource {
  exam: string;
  title: string;
  type: string;
  minutes: number;
  usage: string;
}

export interface CatalogueData {
  meta: {
    generated: string;
    note_durées: string;
    time_factors: Record<CourseKey, number>;
    quiz_minutes: Record<CourseKey, number>;
    exercise_minutes: Record<CourseKey, number>;
  };
  udemy_courses: UdemyCourse[];
  aws_skill_builder: SkillBuilderResource[];
}

export interface RawPlanningTask {
  id?: string;
  kind?: string;
  type?: string;
  course?: CourseKey;
  course_name?: string;
  resource?: string | null;
  first?: number;
  last?: number;
  lectures?: string | number;
  quizzes?: number;
  exercises?: number;
  label?: string;
  title?: string;
  priority: TaskPriority;
  video_min: number;
  est_min: number;
  note?: string;
  deliverable?: string;
  url?: string;
}

export interface RawPlanningWeek {
  week: number;
  start: string;
  end: string;
  phase: string;
  theme: string;
  cert_budget_min: number;
  interview_budget_min: number;
  light_week: boolean;
  exam: string | null;
  tasks: RawPlanningTask[];
  checkpoint: string;
  core_min: number;
  bonus_min: number;
  status: string;
}

export interface PlanningHebdoData {
  meta?: {
    generated?: string;
    timezone?: string;
    contract_end?: string;
    rules?: string[] | Record<string, string>;
    exams?: Array<{
      cert?: string;
      date?: string;
      window?: string;
      code?: string;
      name?: string;
      target_date?: string;
      priority?: string;
    }>;
  };
  metadata?: {
    title?: string;
    version?: string;
    updated_at?: string;
    author?: string;
    rules?: Record<string, unknown>;
    exams?: Array<{
      code?: string;
      name?: string;
      target_date?: string;
      week?: number;
      priority?: string;
    }>;
  };
  weeks: RawPlanningWeek[];
}

export interface RawInterviewTask {
  id: string;
  chapter: string;
  module: string;
  title: string;
  resource: string;
  lectures: string;
  objective: string;
  video_min: number;
  est_min: number;
  priority: TaskPriority;
  deliverable: string;
  topic_ids: string[];
}

export interface RawInterviewWeek {
  week: number;
  start: string;
  end: string;
  interview_budget_min: number;
  tasks: RawInterviewTask[];
}

export interface PlanningEntretiensData {
  meta: {
    generated: string;
    source: string;
    total_budget_min: number;
    weeks_count: number;
    note: string;
  };
  weeks: RawInterviewWeek[];
}

export interface LectureRangeRef {
  first: number;
  last: number;
}

export interface AwsTopicMapping {
  id: string;
  label: string;
  dea_domain: string;
  maarek?: LectureRangeRef[];
  nikolai?: LectureRangeRef[];
  merico?: LectureRangeRef[];
  skillbuilder_review?: string | string[];
}

export interface DbtTopicMapping {
  id: string;
  label: string;
  toth?: LectureRangeRef[];
  weigel?: LectureRangeRef[];
}

export interface CarteDesSujetsData {
  meta: {
    usage?: string;
    description?: string;
    domains_dea: Record<string, string>;
    course_titles: Record<string, string>;
  };
  aws_topics: AwsTopicMapping[];
  dbt_topics: DbtTopicMapping[];
}

export interface UnifiedTask {
  id: string;
  original_week: number;
  target_week: number;
  category: TaskCategory;
  cert_code?: CertCode;
  course_key?: CourseKey;
  first_lecture?: number;
  last_lecture?: number;
  priority: TaskPriority;
  type: string;
  resource: string;
  lectures: string | null;
  title: string;
  objective: string;
  video_min: number;
  initial_est_min: number;
  effective_est_min: number;
  deliverable: string;
  status: TaskStatus;
  completed_at: string | null;
  notes: string;
  topic_ids: string[];
  url?: string;
}

export interface TaskStateRow {
  task_id: string;
  status: TaskStatus;
  target_week: number;
  custom_duration_min: number | null;
  completed_at: string | null;
  notes: string;
  updated_at: string;
}

export interface TaskHistoryEntry {
  id: number;
  task_id: string;
  action: 'complete' | 'reopen' | 'postpone' | 'compress' | 'skip' | 'edit_duration' | 'restore';
  from_week: number;
  to_week: number;
  old_duration_min: number;
  new_duration_min: number;
  reason: string;
  created_at: string;
}

export interface StudySession {
  id: number;
  task_id: string | null;
  week_number: number;
  category: TaskCategory;
  date: string;
  duration_min: number;
  mode: 'timer' | 'manual';
  notes: string;
  is_demo: number;
  created_at: string;
}

export interface MockExam {
  id: number;
  cert_code: CertCode;
  source: string;
  date: string;
  score_pct: number;
  raw_score: number | null;
  domain_scores: Record<string, number>;
  notes: string;
  is_demo: number;
  created_at: string;
}

export interface ErrorJournalEntry {
  id: number;
  cert_code: CertCode;
  domain_id: string;
  topic_id: string;
  question_summary: string;
  root_cause: string;
  action_to_review: string;
  resolved: number;
  is_demo: number;
  created_at: string;
}

export interface Flashcard {
  id: string;
  topic_id: string;
  cert_code: CertCode | 'INTERVIEW';
  front: string;
  back: string;
  provenance: ProvenanceTag;
  source_url: string;
  repetitions: number;
  interval_days: number;
  ease_factor: number;
  due_date: string;
  last_reviewed_at: string | null;
  is_demo: number;
  created_at: string;
}

export interface ReadinessRuleConfig {
  clf_min_pct: number;
  clf_consecutive: number;
  dea_min_pct: number;
  dea_consecutive: number;
  dbt_min_pct: number;
  dbt_consecutive: number;
}

export interface AppSettings {
  max_weekly_minutes: number;
  holiday_weekly_minutes: number;
  weekly_cert_budget_default_min: number;
  weekly_interview_budget_default_min: number;
  compression_factor: number;
  min_compressed_minutes: number;
  max_compressed_minutes: number;
  time_factors: Record<CourseKey, number>;
  exam_dates: Record<CertCode, string>;
  readiness_rules: ReadinessRuleConfig;
  last_backup_at: string | null;
  active_week_override: number | null;
  simulated_today: string;
}

export interface BackupPayload {
  schema_version: number;
  app: 'pack-antigravity-prep-cdi';
  exported_at: string;
  data: {
    lesson_progress: Array<{
      course_key: CourseKey;
      item_index: number;
      done: number;
      updated_at: string;
    }>;
    task_states: TaskStateRow[];
    task_history: TaskHistoryEntry[];
    study_sessions: StudySession[];
    mock_exams: MockExam[];
    error_journal: ErrorJournalEntry[];
    flashcards: Flashcard[];
    settings: AppSettings;
  };
}

// --- Types Préparation aux Entretiens Techniques (Phase 4) ---

export interface PythonExercise {
  id: string;
  title: string;
  category: string;
  difficulty: 'debutant' | 'intermediaire' | 'avance';
  description: string;
  starterCode: string;
  hints: string[];
  tags: string[];
  hasSolution: boolean;
}

export interface InterviewCourseMeta {
  id: string;
  num: string;
  title: string;
  durationMin: number;
  level: string;
  tags: string[];
  category: 'de' | 'aie' | 'fiches_ml' | 'fiches_software';
}

export interface InterviewCourseDetail extends InterviewCourseMeta {
  content: string;
}

export interface InterviewQuestionItem {
  id: string;
  category: string;
  role: 'DE' | 'AIE' | 'MLE' | 'DS' | 'COMMON';
  level: 'Junior' | 'Intermédiaire' | 'Senior';
  question: string;
  type: 'qcm' | 'open' | 'coding';
  options?: string[];
  expectedAnswer: string;
  correct_answer?: string;
  seniority?: string;
  refutations?: Record<string, string>;
  explanation: string;
  source: string;
  tags: string[];
}

export interface InterviewSimulationRecord {
  id: string;
  role: string;
  seniority: string;
  total_score: number;
  duration_seconds: number;
  details_json: string;
  created_at: string;
}

export interface CompetencyStatus {
  totalAttempts: number;
  successCount: number;
  distinctSessions: number;
  isMastered: boolean;
  lastRecordedAt: string | null;
}

export interface SnowflakeFreeTrial {
  id: string;
  title: string;
  badge: string;
  url: string;
  description: string;
  when_to_activate: string;
  category: string;
}

export interface DevoteamCommunityLink {
  id: string;
  domain: string;
  type: string;
  title: string;
  url: string;
  description: string;
}

export interface DbtCertificationResourceItem {
  id: string;
  category: string;
  title: string;
  url: string;
  est_min: number;
  week: number;
  priority: TaskPriority;
  description: string;
}

export interface DbtSnowflakeQuickstartItem {
  id: string;
  title: string;
  level: string;
  url: string;
  est_min: number;
  week: number;
  priority: TaskPriority;
  description: string;
}

export interface SnowflakeMlQuickstartItem {
  id: string;
  number: number;
  category: string;
  title: string;
  level: string;
  url: string;
  est_min: number;
  week: number;
  priority: TaskPriority;
  description: string;
  deliverable: string;
}

export interface SnowflakeDbtResourcesData {
  metadata: {
    title: string;
    updated_at: string;
    description: string;
  };
  free_trials: SnowflakeFreeTrial[];
  devoteam_communities: DevoteamCommunityLink[];
  dbt_certification_resources: DbtCertificationResourceItem[];
  dbt_snowflake_quickstarts: DbtSnowflakeQuickstartItem[];
  snowflake_ml_quickstarts: SnowflakeMlQuickstartItem[];
}

export interface PodcastEpisode {
  id: string;
  cert_code: CertCode;
  order: number;
  filename: string;
  audio_url: string;
  title: string;
  level: string;
  domain: string;
  duration_est_min: number;
  primary_week: number;
  review_weeks: number[];
  schedule_days: string;
  course_lectures: string;
  keywords: string[];
  summary: string;
  key_traps: string[];
  file_exists?: boolean;
  listen_count?: number;
  last_position_sec?: number;
}

export interface PodcastProgressRow {
  episode_id: string;
  listen_count: number;
  last_position_sec: number;
  updated_at: string;
}

export interface PodcastsCatalogData {
  metadata: {
    title: string;
    updated_at: string;
    total_episodes: number;
    description: string;
  };
  episodes: PodcastEpisode[];
}
