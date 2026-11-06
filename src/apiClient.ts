import {
  AppSettings,
  BackupPayload,
  CarteDesSujetsData,
  CertCode,
  CourseKey,
  ErrorJournalEntry,
  Flashcard,
  MockExam,
  PlanningEntretiensData,
  PlanningHebdoData,
  PodcastEpisode,
  PodcastsCatalogData,
  ProvenanceTag,
  SkillBuilderResource,
  SnowflakeDbtResourcesData,
  StudySession,
  TaskCategory,
  TaskHistoryEntry,
  TaskStatus,
  UdemyCourse,
  UnifiedTask,
  PythonExercise,
  InterviewCourseMeta,
  InterviewCourseDetail,
  InterviewQuestionItem,
  InterviewSimulationRecord,
  CompetencyStatus,
} from './domain/types';
import { CertWeightedProgress, CourseProgressStats } from './domain/progression';
import { CertReadinessEvaluation } from './domain/readiness';
import { RescheduleChange, RescheduleTrigger, WeekLoadSummary } from './domain/rescheduler';
import { ReviewGrade } from './domain/spacedRepetition';
import { EngineStatusSummary, SandboxEngineType } from './workers/types';

export interface AppStateResponse {
  staticData: {
    planningHebdo: PlanningHebdoData;
    planningEntretiens: PlanningEntretiensData;
    carteDesSujets: CarteDesSujetsData;
    skillBuilderAws: unknown;
    snowflakeDbtResources?: SnowflakeDbtResourcesData;
    podcastsCatalog?: PodcastsCatalogData;
    catalogueMeta: {
      generated: string;
      note_durées: string;
      time_factors: Record<CourseKey, number>;
      quiz_minutes: Record<CourseKey, number>;
      exercise_minutes: Record<CourseKey, number>;
    };
    awsSkillBuilderCatalogue: SkillBuilderResource[];
  };
  settings: AppSettings;
  tasks: UnifiedTask[];
  weekSummaries: Record<number, WeekLoadSummary>;
  progress: {
    courses: Record<CourseKey, CourseProgressStats>;
    certifications: Record<CertCode, CertWeightedProgress>;
  };
  readiness: Record<CertCode, CertReadinessEvaluation>;
  studySessions: StudySession[];
  mockExams: MockExam[];
  errorJournal: ErrorJournalEntry[];
  flashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  taskHistory: TaskHistoryEntry[];
  podcasts?: PodcastEpisode[];
  networkUrls?: string[];
  hasDemoData: boolean;
  workersStatus: Record<SandboxEngineType, EngineStatusSummary>;
  dbPath: string;
}

export interface RescheduleApiResponse {
  rescheduleReport: {
    triggerType: RescheduleTrigger['type'];
    changes: RescheduleChange[];
    explanationFr: string[];
    updatedExamDates: Record<CertCode, string>;
  };
  state: AppStateResponse;
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    const details = Array.isArray(data?.details) ? ` (${data.details.join(' | ')})` : '';
    throw new Error(`${data?.error || 'Erreur API'}${details}`);
  }
  return data as T;
}

export const apiClient = {
  fetchState: () => requestJson<AppStateResponse>('/api/state'),

  updatePodcastProgress: (params: {
    episode_id: string;
    listen_count?: number;
    increment_listen?: boolean;
    last_position_sec?: number;
  }) =>
    requestJson<AppStateResponse>('/api/podcasts/progress', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  autoRenamePodcasts: () =>
    requestJson<{
      renamed: Array<{
        certCode: CertCode;
        from: string;
        to: string;
        episodeId: string;
        title: string;
      }>;
      state: AppStateResponse;
    }>('/api/podcasts/auto-rename', {
      method: 'POST',
    }),

  fetchCourseDetails: (courseKey: CourseKey) =>
    requestJson<UdemyCourse>(`/api/courses/${courseKey}`),

  setLessonsDoneRange: (courseKey: CourseKey, itemIndices: number[], done: boolean) =>
    requestJson<AppStateResponse>('/api/courses/lessons', {
      method: 'POST',
      body: JSON.stringify({ courseKey, itemIndices, done }),
    }),

  updateTask: (params: {
    taskId: string;
    status?: TaskStatus;
    targetWeek?: number;
    customDurationMin?: number;
    notes?: string;
    reason?: string;
  }) =>
    requestJson<AppStateResponse>('/api/tasks/update', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  triggerReschedule: (trigger: RescheduleTrigger) =>
    requestJson<RescheduleApiResponse>('/api/reschedule', {
      method: 'POST',
      body: JSON.stringify({ trigger }),
    }),

  addStudySession: (params: {
    task_id?: string | null;
    week_number: number;
    category: TaskCategory;
    date: string;
    duration_min: number;
    mode: 'timer' | 'manual';
    notes: string;
  }) =>
    requestJson<AppStateResponse>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  deleteStudySession: (id: number) =>
    requestJson<AppStateResponse>(`/api/sessions/${id}`, { method: 'DELETE' }),

  addMockExam: (params: {
    cert_code: CertCode;
    source: string;
    date: string;
    score_pct: number;
    raw_score?: number | null;
    domain_scores?: Record<string, number>;
    notes?: string;
  }) =>
    requestJson<AppStateResponse>('/api/mock-exams', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  deleteMockExam: (id: number) =>
    requestJson<AppStateResponse>(`/api/mock-exams/${id}`, { method: 'DELETE' }),

  addErrorEntry: (params: {
    cert_code: CertCode;
    domain_id: string;
    topic_id: string;
    question_summary: string;
    root_cause: string;
    action_to_review: string;
  }) =>
    requestJson<AppStateResponse>('/api/errors', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  toggleErrorResolved: (id: number, resolved: boolean) =>
    requestJson<AppStateResponse>('/api/errors/toggle', {
      method: 'POST',
      body: JSON.stringify({ id, resolved }),
    }),

  deleteErrorEntry: (id: number) =>
    requestJson<AppStateResponse>(`/api/errors/${id}`, { method: 'DELETE' }),

  createFlashcard: (params: {
    topic_id: string;
    cert_code: CertCode | 'INTERVIEW';
    front: string;
    back: string;
    provenance: ProvenanceTag;
    source_url: string;
  }) =>
    requestJson<AppStateResponse>('/api/flashcards', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  reviewFlashcard: (id: string, grade: ReviewGrade) =>
    requestJson<AppStateResponse>('/api/flashcards/review', {
      method: 'POST',
      body: JSON.stringify({ id, grade }),
    }),

  deleteFlashcard: (id: string) =>
    requestJson<AppStateResponse>(`/api/flashcards/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  saveSettings: (partialSettings: Partial<AppSettings>) =>
    requestJson<AppStateResponse>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(partialSettings),
    }),

  exportBackup: () => requestJson<BackupPayload>('/api/backup/export'),

  importBackup: (payload: unknown) =>
    requestJson<AppStateResponse>('/api/backup/import', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  loadDemoData: () => requestJson<AppStateResponse>('/api/demo/load', { method: 'POST' }),

  clearDemoData: () => requestJson<AppStateResponse>('/api/demo/clear', { method: 'POST' }),

  resetAllData: () => requestJson<AppStateResponse>('/api/reset', { method: 'POST' }),

  fetchCertificationChapters: (certCode: string) =>
    requestJson<CertChapterSummary[]>(`/api/certifications/${certCode}/chapters`),

  fetchCertificationChapterContent: (certCode: string, chapterId: string) =>
    requestJson<CertChapterDetail>(
      `/api/certifications/${certCode}/chapters/${encodeURIComponent(chapterId)}`
    ),

  fetchCertificationFiches: (certCode: string) =>
    requestJson<CertFicheSummary[]>(`/api/certifications/${certCode}/fiches`),

  fetchCertificationFicheContent: (certCode: string, ficheId: string) =>
    requestJson<CertFicheDetail>(
      `/api/certifications/${certCode}/fiches/${encodeURIComponent(ficheId)}`
    ),

  fetchCertificationQuestions: async (certCode: string): Promise<CertQuestion[]> => {
    const list = await requestJson<any[]>(`/api/certifications/${certCode}/questions`);
    return list.map((q) => {
      const expArr: string[] = Array.isArray(q.expected_answer)
        ? q.expected_answer
        : q.expected_answer
        ? [String(q.expected_answer)]
        : Array.isArray(q.correct_answer)
        ? q.correct_answer
        : [String(q.correct_answer || '')].filter(Boolean);
      const corrStr =
        typeof q.correct_answer === 'string'
          ? q.correct_answer
          : expArr.length > 0
          ? expArr[0]
          : '';
      return {
        ...q,
        statement: q.statement || q.question || '',
        question: q.question || q.statement || '',
        expected_answer: expArr,
        correct_answer: corrStr,
        source_url: q.source_url || q.source_doc || '',
        source_doc: q.source_doc || q.source_url || '',
        doc_date: q.doc_date || q.verification_date || '',
        verification_date: q.verification_date || q.doc_date || '',
      };
    });
  },
};

export interface CertChapterSummary {
  id: string;
  filename: string;
  title: string;
  wordsCount: number;
}

export interface CertChapterDetail {
  id: string;
  filename: string;
  title: string;
  content: string;
  wordsCount: number;
}

export interface CertFicheSummary {
  id: string;
  filename: string;
  title: string;
  wordsCount: number;
}

export interface CertFicheDetail {
  id: string;
  filename: string;
  title: string;
  content: string;
  wordsCount: number;
}

export interface CertQuestion {
  id: string;
  statement: string;
  question: string;
  type: 'single' | 'multiple';
  options: string[];
  expected_answer: string[];
  correct_answer: string;
  explanation: string;
  domain: string;
  topic_id: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  recommended_time_sec: number;
  source_url: string;
  source_doc: string;
  provenance: string;
  verification_date: string;
  doc_date: string;
  course_recommendation?: string;
}

export interface SqlDatasetSummary {
  id: 'ecommerce' | 'streaming_events' | 'hr_payroll' | 'banking_fraud';
  name: string;
  description: string;
  tables: string[];
  schemaSql: string;
}

export interface SqlExerciseSummary {
  id: string;
  title: string;
  category: string;
  difficulty: 'debutant' | 'intermediaire' | 'avance';
  datasetId: 'ecommerce' | 'streaming_events' | 'hr_payroll' | 'banking_fraud';
  description: string;
  instructions: string[];
  orderDependent: boolean;
  hints: string[];
  tags: string[];
  hasSolution: boolean;
}

export interface SqlSandboxResponse {
  success: boolean;
  error?: string;
  columns: string[];
  rows: Array<Record<string, unknown>>;
  totalRowCount: number;
  truncated: boolean;
  executionTimeMs: number;
  queryPlan?: Array<{ id: number; parent: number; notused: number; detail: string }>;
  comparison?: {
    passed: boolean;
    diffSummary: string;
  };
  solution?: {
    query: string;
    explanation: string;
  };
}

export async function fetchSqlDatasets(): Promise<SqlDatasetSummary[]> {
  const res = await fetch('/api/entretiens/sql/datasets');
  if (!res.ok) throw new Error('Impossible de charger les jeux de données SQL.');
  return res.json();
}

export async function fetchSqlExercises(): Promise<SqlExerciseSummary[]> {
  const res = await fetch('/api/entretiens/sql/exercises');
  if (!res.ok) throw new Error('Impossible de charger les exercices SQL.');
  return res.json();
}

export async function executeSqlSandbox(params: {
  exerciseId?: string;
  datasetId: 'ecommerce' | 'streaming_events' | 'hr_payroll' | 'banking_fraud' | 'none';
  userQuery: string;
  revealSolution?: boolean;
  userAttempted?: boolean;
}): Promise<SqlSandboxResponse> {
  const res = await fetch('/api/sandbox/sql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Erreur de communication avec le sandbox SQL.');
  return res.json();
}

// --- API Client pour Python ---

export interface PythonSandboxResponse {
  requestId: string;
  success: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  passedAssertions?: number;
  totalAssertions?: number;
  error?: string;
  solution?: {
    code: string;
    explanation: string;
  };
}

export async function fetchPythonExercises(): Promise<PythonExercise[]> {
  const res = await fetch('/api/entretiens/python/exercises');
  if (!res.ok) throw new Error('Impossible de charger les exercices Python.');
  return res.json();
}

export async function executePythonSandbox(params: {
  exerciseId?: string;
  userCode: string;
  revealSolution?: boolean;
  userAttempted?: boolean;
  timeoutMs?: number;
}): Promise<PythonSandboxResponse> {
  const res = await fetch('/api/sandbox/python', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Erreur de communication avec le sandbox Python.');
  return res.json();
}

// --- API Client pour Cours Condenses ---

export interface InterviewCoursesManifestResponse {
  generated_at: string;
  total_courses_count: number;
  categories: {
    python?: InterviewCourseMeta[];
    sql?: InterviewCourseMeta[];
    de: InterviewCourseMeta[];
    aie: InterviewCourseMeta[];
    fiches_ml: InterviewCourseMeta[];
    fiches_software: InterviewCourseMeta[];
  };
}

export async function fetchInterviewCoursesManifest(): Promise<InterviewCoursesManifestResponse> {
  const res = await fetch('/api/entretiens/courses');
  if (!res.ok) throw new Error('Impossible de charger le sommaire des cours.');
  return res.json();
}

export async function fetchInterviewCourseContent(
  category: string,
  id: string
): Promise<{ id: string; category: string; content: string }> {
  const res = await fetch(`/api/entretiens/courses/${encodeURIComponent(category)}/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Impossible de charger le cours ${category}/${id}.`);
  return res.json();
}

// --- API Client pour Banque de Questions ---

export async function fetchInterviewQuestions(): Promise<InterviewQuestionItem[]> {
  const res = await fetch('/api/entretiens/questions');
  if (!res.ok) throw new Error('Impossible de charger la banque de questions d entretien.');
  return res.json();
}

// --- API Client pour Simulations d Entretien ---

export async function fetchInterviewSimulations(): Promise<InterviewSimulationRecord[]> {
  const res = await fetch('/api/entretiens/simulations');
  if (!res.ok) throw new Error('Impossible de charger l historique des simulations.');
  return res.json();
}

export async function saveInterviewSimulation(data: {
  id?: string;
  role: string;
  seniority: string;
  total_score: number;
  duration_seconds: number;
  details: Record<string, unknown>;
}): Promise<{ success: boolean; id: string }> {
  const res = await fetch('/api/entretiens/simulations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Impossible de sauvegarder la simulation d entretien.');
  return res.json();
}

// --- API Client pour Competences ---

export async function fetchCompetenciesStatus(): Promise<Record<string, CompetencyStatus>> {
  const res = await fetch('/api/entretiens/competencies');
  if (!res.ok) throw new Error('Impossible de charger le statut des competences.');
  return res.json();
}

export async function recordCompetencyAttempt(data: {
  competency_id: string;
  session_id: string;
  success: boolean;
  notes?: string;
}): Promise<{ success: boolean; competencies: Record<string, CompetencyStatus> }> {
  const res = await fetch('/api/entretiens/competencies/record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Impossible d enregistrer la tentative de competence.');
  return res.json();
}
