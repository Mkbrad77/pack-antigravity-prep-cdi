import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { DatabaseSync as DatabaseSyncType } from 'node:sqlite';

const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite') as {
  DatabaseSync: typeof DatabaseSyncType;
};
import {
  AppSettings,
  BackupPayload,
  CatalogueData,
  CarteDesSujetsData,
  CourseKey,
  ErrorJournalEntry,
  Flashcard,
  MockExam,
  PlanningEntretiensData,
  PlanningHebdoData,
  PodcastProgressRow,
  PodcastsCatalogData,
  SnowflakeDbtResourcesData,
  StudySession,
  TaskHistoryEntry,
  TaskStateRow,
} from '../domain/types';
import { DEFAULT_READINESS_RULES } from '../domain/readiness';

export interface StaticDatasetBundle {
  catalogue: CatalogueData;
  planningHebdo: PlanningHebdoData;
  planningEntretiens: PlanningEntretiensData;
  carteDesSujets: CarteDesSujetsData;
  skillBuilderAws: unknown;
  snowflakeDbtResources: SnowflakeDbtResourcesData;
  podcastsCatalog: PodcastsCatalogData;
}

let cachedCatalogue: CatalogueData | null = null;

export function loadStaticDatasets(rootDir = process.cwd()): StaticDatasetBundle {
  const dataDir = path.join(rootDir, 'data');

  if (!cachedCatalogue) {
    cachedCatalogue = JSON.parse(
      fs.readFileSync(path.join(dataDir, 'catalogue_formations.json'), 'utf-8')
    ) as CatalogueData;
  }
  const planningHebdo: PlanningHebdoData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'planning_hebdo.json'), 'utf-8')
  );
  const planningEntretiens: PlanningEntretiensData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'planning_entretiens.json'), 'utf-8')
  );
  const carteDesSujets: CarteDesSujetsData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'carte_des_sujets.json'), 'utf-8')
  );
  const skillBuilderAws: unknown = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'skillbuilder_aws.json'), 'utf-8')
  );
  const snowflakeDbtResources: SnowflakeDbtResourcesData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'snowflake_dbt_resources.json'), 'utf-8')
  );
  const podcastsCatalog: PodcastsCatalogData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'podcasts_catalog.json'), 'utf-8')
  );

  return {
    catalogue: cachedCatalogue,
    planningHebdo,
    planningEntretiens,
    carteDesSujets,
    skillBuilderAws,
    snowflakeDbtResources,
    podcastsCatalog,
  };
}

export function getDefaultSettings(catalogue: CatalogueData): AppSettings {
  return {
    max_weekly_minutes: 660,
    holiday_weekly_minutes: 360,
    weekly_cert_budget_default_min: 480,
    weekly_interview_budget_default_min: 120,
    compression_factor: 0.5,
    min_compressed_minutes: 15,
    max_compressed_minutes: 30,
    time_factors: { ...catalogue.meta.time_factors },
    exam_dates: {
      'CLF-C02': '2026-11-27',
      DBT: '2027-01-08',
      'DEA-C01': '2027-03-19',
    },
    readiness_rules: { ...DEFAULT_READINESS_RULES },
    last_backup_at: null,
    active_week_override: 1,
    simulated_today: '2026-11-09',
  };
}

export class LocalSqliteStore {
  public readonly db: DatabaseSyncType;
  public readonly dbPath: string;
  private readonly staticData: StaticDatasetBundle;

  constructor(customDbPath?: string, rootDir = process.cwd()) {
    this.staticData = loadStaticDatasets(rootDir);
    const storageDir = path.join(rootDir, 'storage');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    this.dbPath = customDbPath ?? path.join(storageDir, 'user_data.sqlite');
    this.db = new DatabaseSync(this.dbPath);
    this.db.exec('PRAGMA journal_mode = WAL;');
    this.db.exec('PRAGMA foreign_keys = ON;');
    this.runMigrations();
    this.ensureSeeded();
  }

  public runMigrations(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL
      );
    `);

    const row = this.db
      .prepare('SELECT MAX(version) as max_v FROM schema_migrations')
      .get() as { max_v: number | null } | undefined;
    const currentVersion = row?.max_v ?? 0;

    if (currentVersion < 1) {
      this.db.exec('BEGIN IMMEDIATE;');
      try {
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS lesson_progress (
            course_key TEXT NOT NULL,
            item_index INTEGER NOT NULL,
            done INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL,
            PRIMARY KEY (course_key, item_index)
          );

          CREATE TABLE IF NOT EXISTS task_states (
            task_id TEXT PRIMARY KEY,
            status TEXT NOT NULL DEFAULT 'todo',
            target_week INTEGER NOT NULL,
            custom_duration_min INTEGER,
            completed_at TEXT,
            notes TEXT NOT NULL DEFAULT '',
            updated_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS task_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT NOT NULL,
            action TEXT NOT NULL,
            from_week INTEGER NOT NULL,
            to_week INTEGER NOT NULL,
            old_duration_min INTEGER NOT NULL,
            new_duration_min INTEGER NOT NULL,
            reason TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS study_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT,
            week_number INTEGER NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            duration_min INTEGER NOT NULL,
            mode TEXT NOT NULL DEFAULT 'manual',
            notes TEXT NOT NULL DEFAULT '',
            is_demo INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS mock_exams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cert_code TEXT NOT NULL,
            source TEXT NOT NULL,
            date TEXT NOT NULL,
            score_pct REAL NOT NULL,
            raw_score INTEGER,
            domain_scores_json TEXT NOT NULL DEFAULT '{}',
            notes TEXT NOT NULL DEFAULT '',
            is_demo INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS error_journal (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cert_code TEXT NOT NULL,
            domain_id TEXT NOT NULL,
            topic_id TEXT NOT NULL,
            question_summary TEXT NOT NULL,
            root_cause TEXT NOT NULL,
            action_to_review TEXT NOT NULL,
            resolved INTEGER NOT NULL DEFAULT 0,
            is_demo INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS flashcards (
            id TEXT PRIMARY KEY,
            topic_id TEXT NOT NULL,
            cert_code TEXT NOT NULL,
            front TEXT NOT NULL,
            back TEXT NOT NULL,
            provenance TEXT NOT NULL,
            source_url TEXT NOT NULL DEFAULT '',
            repetitions INTEGER NOT NULL DEFAULT 0,
            interval_days INTEGER NOT NULL DEFAULT 0,
            ease_factor REAL NOT NULL DEFAULT 2.5,
            due_date TEXT NOT NULL,
            last_reviewed_at TEXT,
            is_demo INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value_json TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );
        `);

        this.db
          .prepare('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)')
          .run(1, 'v1_initial_schema', new Date().toISOString());

        this.db.exec('COMMIT;');
      } catch (err) {
        this.db.exec('ROLLBACK;');
        throw err;
      }
    }

    const v2Applied = this.db
      .prepare('SELECT version FROM schema_migrations WHERE version = 2')
      .get() as { version: number } | undefined;

    if (!v2Applied) {
      this.db.exec('BEGIN IMMEDIATE;');
      try {
        // Reinitialise les lecons pre-cochees afin que les 5 cours Udemy et les 3 certifications demarrent a 0 %
        this.db.exec('DELETE FROM lesson_progress;');
        this.db
          .prepare('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)')
          .run(2, 'v2_reset_zero_initial_progress', new Date().toISOString());
        this.db.exec('COMMIT;');
      } catch (err) {
        this.db.exec('ROLLBACK;');
        throw err;
      }
    }

    const v3Applied = this.db
      .prepare('SELECT version FROM schema_migrations WHERE version = 3')
      .get() as { version: number } | undefined;

    if (!v3Applied) {
      this.db.exec('BEGIN IMMEDIATE;');
      try {
        // Purge definitive de tout artefact de test residuel (taches, examens blancs, lecons)
        this.db.exec('DELETE FROM lesson_progress;');
        this.db.exec('DELETE FROM task_states;');
        this.db.exec('DELETE FROM task_history;');
        this.db.exec('DELETE FROM study_sessions;');
        this.db.exec('DELETE FROM mock_exams;');
        this.db.exec('DELETE FROM error_journal;');
        this.db.exec('DELETE FROM flashcards;');
        this.db
          .prepare('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)')
          .run(3, 'v3_force_zero_and_clean_test_artifacts', new Date().toISOString());
        this.db.exec('COMMIT;');
      } catch (err) {
        this.db.exec('ROLLBACK;');
        throw err;
      }
    }

    const v4Applied = this.db
      .prepare('SELECT version FROM schema_migrations WHERE version = 4')
      .get() as { version: number } | undefined;

    if (!v4Applied) {
      this.db.exec('BEGIN IMMEDIATE;');
      try {
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS interview_simulations (
            id TEXT PRIMARY KEY,
            role TEXT NOT NULL,
            seniority TEXT NOT NULL,
            total_score REAL NOT NULL,
            duration_seconds INTEGER NOT NULL,
            details_json TEXT NOT NULL,
            created_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS competency_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            competency_id TEXT NOT NULL,
            session_id TEXT NOT NULL,
            success INTEGER NOT NULL,
            notes TEXT NOT NULL DEFAULT '',
            recorded_at TEXT NOT NULL
          );
          CREATE INDEX IF NOT EXISTS idx_competency_lookup ON competency_records(competency_id, recorded_at);

          CREATE TABLE IF NOT EXISTS project_sheets (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            target_role TEXT NOT NULL,
            pitch_star_situation TEXT NOT NULL DEFAULT '',
            pitch_star_task TEXT NOT NULL DEFAULT '',
            pitch_star_action TEXT NOT NULL DEFAULT '',
            pitch_star_result TEXT NOT NULL DEFAULT '',
            tech_stack_json TEXT NOT NULL DEFAULT '[]',
            architecture_points_json TEXT NOT NULL DEFAULT '[]',
            trap_questions_json TEXT NOT NULL DEFAULT '[]',
            updated_at TEXT NOT NULL
          );
        `);

        const now = new Date().toISOString();
        this.db
          .prepare('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)')
          .run(4, 'v4_interview_prep_tables', now);
        this.db.exec('COMMIT;');
      } catch (err) {
        this.db.exec('ROLLBACK;');
        throw err;
      }
    }

    const v5Applied = this.db
      .prepare('SELECT version FROM schema_migrations WHERE version = 5')
      .get() as { version: number } | undefined;

    if (!v5Applied) {
      this.db.exec('BEGIN IMMEDIATE;');
      try {
        this.db.exec(`
          DROP TABLE IF EXISTS project_sheets;
          DELETE FROM competency_records WHERE competency_id = 'interview_pitch_star';
          UPDATE task_states
          SET custom_duration_min = NULL
          WHERE task_id IN (
            'W01-I1', 'W01-I2', 'W01-I3',
            'W02-I1', 'W02-I2',
            'W03-I1', 'W03-I2',
            'W20-I2', 'W21-I2', 'W22-I1'
          );
        `);
        const now = new Date().toISOString();
        this.db
          .prepare('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)')
          .run(5, 'v5_purge_star_and_refresh_interview_tasks', now);
        this.db.exec('COMMIT;');
      } catch (err) {
        this.db.exec('ROLLBACK;');
        throw err;
      }
    }

    const v6Applied = this.db
      .prepare('SELECT version FROM schema_migrations WHERE version = 6')
      .get() as { version: number } | undefined;

    if (!v6Applied) {
      this.db.exec('BEGIN IMMEDIATE;');
      try {
        // Nettoie les etats caches des taches de certification S4-S22 pour appliquer le nouveau planning priorisant dbt et les Quickstarts Snowflake
        this.db.exec(`
          DELETE FROM task_states
          WHERE task_id NOT LIKE 'W01-%'
            AND task_id NOT LIKE 'W02-%'
            AND task_id NOT LIKE 'W03-%'
            AND task_id NOT LIKE '%-I%';
        `);

        const settingsRow = this.db
          .prepare('SELECT value_json FROM settings WHERE key = ?')
          .get('app_settings') as { value_json: string } | undefined;

        if (settingsRow) {
          try {
            const parsed = JSON.parse(settingsRow.value_json) as AppSettings;
            parsed.max_weekly_minutes = 660;
            parsed.weekly_cert_budget_default_min = 480;
            parsed.exam_dates = {
              'CLF-C02': '2026-11-20',
              DBT: '2027-01-08',
              'DEA-C01': '2027-03-19',
            };
            this.db
              .prepare('UPDATE settings SET value_json = ?, updated_at = ? WHERE key = ?')
              .run(JSON.stringify(parsed), new Date().toISOString(), 'app_settings');
          } catch {
            // ignore parse error
          }
        }

        const now = new Date().toISOString();
        this.db
          .prepare('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)')
          .run(6, 'v6_prioritize_dbt_and_snowflake_quickstarts', now);
        this.db.exec('COMMIT;');
      } catch (err) {
        this.db.exec('ROLLBACK;');
        throw err;
      }
    }

    const v7Applied = this.db
      .prepare('SELECT version FROM schema_migrations WHERE version = 7')
      .get() as { version: number } | undefined;

    if (!v7Applied) {
      this.db.exec('BEGIN IMMEDIATE;');
      try {
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS podcast_progress (
            episode_id TEXT PRIMARY KEY,
            listen_count INTEGER NOT NULL DEFAULT 0,
            last_position_sec REAL NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL
          );

          DELETE FROM task_states;
          DELETE FROM lesson_progress;
        `);

        const settingsRow = this.db
          .prepare('SELECT value_json FROM settings WHERE key = ?')
          .get('app_settings') as { value_json: string } | undefined;

        if (settingsRow) {
          try {
            const parsed = JSON.parse(settingsRow.value_json) as AppSettings;
            parsed.max_weekly_minutes = 660;
            parsed.holiday_weekly_minutes = 360;
            parsed.active_week_override = 1;
            parsed.simulated_today = '2026-11-09';
            parsed.exam_dates = {
              'CLF-C02': '2026-11-27',
              DBT: '2027-01-08',
              'DEA-C01': '2027-03-19',
            };
            this.db
              .prepare('UPDATE settings SET value_json = ?, updated_at = ? WHERE key = ?')
              .run(JSON.stringify(parsed), new Date().toISOString(), 'app_settings');
          } catch {
            // ignore parse error
          }
        }

        const now = new Date().toISOString();
        this.db
          .prepare('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)')
          .run(7, 'v7_shift_start_nov09_and_podcasts', now);
        this.db.exec('COMMIT;');
      } catch (err) {
        this.db.exec('ROLLBACK;');
        throw err;
      }
    }
  }

  /**
   * Initialise l'etat de depart des lecons deja terminees dans catalogue_formations.json
   * si et seulement si la base vient d'etre creee.
   */
  public ensureSeeded(): void {
    const settingsRow = this.db
      .prepare('SELECT value_json FROM settings WHERE key = ?')
      .get('app_settings') as { value_json: string } | undefined;

    if (!settingsRow) {
      const defaults = getDefaultSettings(this.staticData.catalogue);
      this.saveSettings(defaults);
    }

    const seededFlag = this.db
      .prepare('SELECT value_json FROM settings WHERE key = ?')
      .get('catalog_seeded') as { value_json: string } | undefined;

    if (!seededFlag) {
      this.seedCatalogInitialDoneLessons();
      this.db
        .prepare('INSERT OR REPLACE INTO settings (key, value_json, updated_at) VALUES (?, ?, ?)')
        .run('catalog_seeded', JSON.stringify(true), new Date().toISOString());
    }
  }

  public seedCatalogInitialDoneLessons(): void {
    const now = new Date().toISOString();
    const insertStmt = this.db.prepare(`
      INSERT OR REPLACE INTO lesson_progress (course_key, item_index, done, updated_at)
      VALUES (?, ?, ?, ?)
    `);

    this.db.exec('BEGIN IMMEDIATE;');
    try {
      for (const course of this.staticData.catalogue.udemy_courses) {
        for (const item of course.items) {
          if (item.done) {
            insertStmt.run(course.key, item.i, 1, now);
          }
        }
      }
      this.db.exec('COMMIT;');
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
  }

  public getSettings(): AppSettings {
    const row = this.db
      .prepare('SELECT value_json FROM settings WHERE key = ?')
      .get('app_settings') as { value_json: string } | undefined;
    const defaults = getDefaultSettings(this.staticData.catalogue);
    if (!row) return defaults;
    try {
      return { ...defaults, ...JSON.parse(row.value_json) };
    } catch {
      return defaults;
    }
  }

  public saveSettings(settings: AppSettings): AppSettings {
    const now = new Date().toISOString();
    this.db
      .prepare('INSERT OR REPLACE INTO settings (key, value_json, updated_at) VALUES (?, ?, ?)')
      .run('app_settings', JSON.stringify(settings), now);
    return this.getSettings();
  }

  public getLessonProgressMap(): Record<string, boolean> {
    const rows = this.db
      .prepare('SELECT course_key, item_index, done FROM lesson_progress')
      .all() as Array<{ course_key: CourseKey; item_index: number; done: number }>;
    const map: Record<string, boolean> = {};
    for (const r of rows) {
      map[`${r.course_key}:${r.item_index}`] = r.done === 1;
    }
    return map;
  }

  public setLessonsDoneRange(
    courseKey: CourseKey,
    itemIndices: number[],
    done: boolean
  ): void {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO lesson_progress (course_key, item_index, done, updated_at)
      VALUES (?, ?, ?, ?)
    `);
    this.db.exec('BEGIN IMMEDIATE;');
    try {
      for (const idx of itemIndices) {
        stmt.run(courseKey, idx, done ? 1 : 0, now);
      }
      this.db.exec('COMMIT;');
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
  }

  public getTaskStatesMap(): Record<string, TaskStateRow> {
    const rows = this.db.prepare('SELECT * FROM task_states').all() as unknown as TaskStateRow[];
    const map: Record<string, TaskStateRow> = {};
    for (const r of rows) {
      map[r.task_id] = r;
    }
    return map;
  }

  public upsertTaskState(params: {
    task_id: string;
    status: TaskStateRow['status'];
    target_week: number;
    custom_duration_min?: number | null;
    completed_at?: string | null;
    notes?: string;
    history?: {
      action: TaskHistoryEntry['action'];
      from_week: number;
      to_week: number;
      old_duration_min: number;
      new_duration_min: number;
      reason: string;
    };
  }): void {
    const now = new Date().toISOString();
    const existing = this.db
      .prepare('SELECT * FROM task_states WHERE task_id = ?')
      .get(params.task_id) as unknown as TaskStateRow | undefined;

    const customDur =
      params.custom_duration_min !== undefined
        ? params.custom_duration_min
        : existing?.custom_duration_min ?? null;

    const completedAt =
      params.status === 'done'
        ? params.completed_at ?? existing?.completed_at ?? now
        : null;

    const notes = params.notes !== undefined ? params.notes : existing?.notes ?? '';

    this.db.exec('BEGIN IMMEDIATE;');
    try {
      this.db
        .prepare(`
          INSERT OR REPLACE INTO task_states
          (task_id, status, target_week, custom_duration_min, completed_at, notes, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
          params.task_id,
          params.status,
          params.target_week,
          customDur,
          completedAt,
          notes,
          now
        );

      if (params.history) {
        this.db
          .prepare(`
            INSERT INTO task_history
            (task_id, action, from_week, to_week, old_duration_min, new_duration_min, reason, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `)
          .run(
            params.task_id,
            params.history.action,
            params.history.from_week,
            params.history.to_week,
            params.history.old_duration_min,
            params.history.new_duration_min,
            params.history.reason,
            now
          );
      }
      this.db.exec('COMMIT;');
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
  }

  public getTaskHistory(taskId?: string): TaskHistoryEntry[] {
    if (taskId) {
      return this.db
        .prepare('SELECT * FROM task_history WHERE task_id = ? ORDER BY id DESC')
        .all(taskId) as unknown as TaskHistoryEntry[];
    }
    return this.db
      .prepare('SELECT * FROM task_history ORDER BY id DESC LIMIT 200')
      .all() as unknown as TaskHistoryEntry[];
  }

  public getStudySessions(): StudySession[] {
    return this.db
      .prepare('SELECT * FROM study_sessions ORDER BY date DESC, id DESC')
      .all() as unknown as StudySession[];
  }

  public addStudySession(input: Omit<StudySession, 'id' | 'created_at'>): StudySession {
    const now = new Date().toISOString();
    const res = this.db
      .prepare(`
        INSERT INTO study_sessions (task_id, week_number, category, date, duration_min, mode, notes, is_demo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        input.task_id ?? null,
        input.week_number,
        input.category,
        input.date,
        input.duration_min,
        input.mode,
        input.notes || '',
        input.is_demo ? 1 : 0,
        now
      );
    return this.db
      .prepare('SELECT * FROM study_sessions WHERE id = ?')
      .get(Number(res.lastInsertRowid)) as unknown as StudySession;
  }

  public deleteStudySession(id: number): void {
    this.db.prepare('DELETE FROM study_sessions WHERE id = ?').run(id);
  }

  public getMockExams(): MockExam[] {
    const rows = this.db
      .prepare('SELECT * FROM mock_exams ORDER BY date ASC, id ASC')
      .all() as Array<{
      id: number;
      cert_code: MockExam['cert_code'];
      source: string;
      date: string;
      score_pct: number;
      raw_score: number | null;
      domain_scores_json: string;
      notes: string;
      is_demo: number;
      created_at: string;
    }>;

    return rows.map((r) => ({
      id: r.id,
      cert_code: r.cert_code,
      source: r.source,
      date: r.date,
      score_pct: r.score_pct,
      raw_score: r.raw_score,
      domain_scores: JSON.parse(r.domain_scores_json || '{}'),
      notes: r.notes,
      is_demo: r.is_demo,
      created_at: r.created_at,
    }));
  }

  public addMockExam(input: Omit<MockExam, 'id' | 'created_at'>): MockExam {
    const now = new Date().toISOString();
    const res = this.db
      .prepare(`
        INSERT INTO mock_exams (cert_code, source, date, score_pct, raw_score, domain_scores_json, notes, is_demo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        input.cert_code,
        input.source,
        input.date,
        input.score_pct,
        input.raw_score ?? null,
        JSON.stringify(input.domain_scores || {}),
        input.notes || '',
        input.is_demo ? 1 : 0,
        now
      );

    const all = this.getMockExams();
    return all.find((e) => e.id === Number(res.lastInsertRowid))!;
  }

  public deleteMockExam(id: number): void {
    this.db.prepare('DELETE FROM mock_exams WHERE id = ?').run(id);
  }

  public getErrorJournal(): ErrorJournalEntry[] {
    return this.db
      .prepare('SELECT * FROM error_journal ORDER BY id DESC')
      .all() as unknown as ErrorJournalEntry[];
  }

  public addErrorJournalEntry(
    input: Omit<ErrorJournalEntry, 'id' | 'created_at'>
  ): ErrorJournalEntry {
    const now = new Date().toISOString();
    const res = this.db
      .prepare(`
        INSERT INTO error_journal
        (cert_code, domain_id, topic_id, question_summary, root_cause, action_to_review, resolved, is_demo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        input.cert_code,
        input.domain_id,
        input.topic_id,
        input.question_summary,
        input.root_cause,
        input.action_to_review,
        input.resolved ? 1 : 0,
        input.is_demo ? 1 : 0,
        now
      );
    return this.db
      .prepare('SELECT * FROM error_journal WHERE id = ?')
      .get(Number(res.lastInsertRowid)) as unknown as ErrorJournalEntry;
  }

  public toggleErrorResolved(id: number, resolved: boolean): void {
    this.db
      .prepare('UPDATE error_journal SET resolved = ? WHERE id = ?')
      .run(resolved ? 1 : 0, id);
  }

  public deleteErrorJournalEntry(id: number): void {
    this.db.prepare('DELETE FROM error_journal WHERE id = ?').run(id);
  }

  public getFlashcards(): Flashcard[] {
    return this.db
      .prepare('SELECT * FROM flashcards ORDER BY due_date ASC, id ASC')
      .all() as unknown as Flashcard[];
  }

  public upsertFlashcard(card: Flashcard): void {
    this.db
      .prepare(`
        INSERT OR REPLACE INTO flashcards
        (id, topic_id, cert_code, front, back, provenance, source_url, repetitions, interval_days, ease_factor, due_date, last_reviewed_at, is_demo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        card.id,
        card.topic_id,
        card.cert_code,
        card.front,
        card.back,
        card.provenance,
        card.source_url,
        card.repetitions,
        card.interval_days,
        card.ease_factor,
        card.due_date,
        card.last_reviewed_at,
        card.is_demo ? 1 : 0,
        card.created_at
      );
  }

  public deleteFlashcard(id: string): void {
    this.db.prepare('DELETE FROM flashcards WHERE id = ?').run(id);
  }

  /**
   * Exporte l'integralite des donnees utilisateur dans une enveloppe JSON datee (schema v1).
   */
  public exportBackup(): BackupPayload {
    const now = new Date().toISOString();
    const currentSettings = this.getSettings();
    const updatedSettings: AppSettings = {
      ...currentSettings,
      last_backup_at: now,
    };
    this.saveSettings(updatedSettings);

    const lessonRows = this.db
      .prepare('SELECT course_key, item_index, done, updated_at FROM lesson_progress')
      .all() as BackupPayload['data']['lesson_progress'];
    const taskStateRows = this.db
      .prepare('SELECT * FROM task_states')
      .all() as unknown as TaskStateRow[];
    const taskHistoryRows = this.db
      .prepare('SELECT * FROM task_history ORDER BY id ASC')
      .all() as unknown as TaskHistoryEntry[];

    return {
      schema_version: 1,
      app: 'pack-antigravity-prep-cdi',
      exported_at: now,
      data: {
        lesson_progress: lessonRows,
        task_states: taskStateRows,
        task_history: taskHistoryRows,
        study_sessions: this.getStudySessions(),
        mock_exams: this.getMockExams(),
        error_journal: this.getErrorJournal(),
        flashcards: this.getFlashcards(),
        settings: updatedSettings,
      },
    };
  }

  /**
   * Restaure de maniere transactionnelle une sauvegarde JSON validee.
   */
  public importBackup(payload: BackupPayload): void {
    this.db.exec('BEGIN IMMEDIATE;');
    try {
      this.db.exec(`
        DELETE FROM lesson_progress;
        DELETE FROM task_states;
        DELETE FROM task_history;
        DELETE FROM study_sessions;
        DELETE FROM mock_exams;
        DELETE FROM error_journal;
        DELETE FROM flashcards;
      `);

      const lessonStmt = this.db.prepare(`
        INSERT INTO lesson_progress (course_key, item_index, done, updated_at)
        VALUES (?, ?, ?, ?)
      `);
      for (const l of payload.data.lesson_progress) {
        lessonStmt.run(l.course_key, l.item_index, l.done ? 1 : 0, l.updated_at || payload.exported_at);
      }

      const taskStmt = this.db.prepare(`
        INSERT INTO task_states
        (task_id, status, target_week, custom_duration_min, completed_at, notes, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const t of payload.data.task_states) {
        taskStmt.run(
          t.task_id,
          t.status,
          t.target_week,
          t.custom_duration_min ?? null,
          t.completed_at ?? null,
          t.notes || '',
          t.updated_at || payload.exported_at
        );
      }

      const histStmt = this.db.prepare(`
        INSERT INTO task_history
        (task_id, action, from_week, to_week, old_duration_min, new_duration_min, reason, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const h of payload.data.task_history) {
        histStmt.run(
          h.task_id,
          h.action,
          h.from_week,
          h.to_week,
          h.old_duration_min,
          h.new_duration_min,
          h.reason || '',
          h.created_at || payload.exported_at
        );
      }

      const sessStmt = this.db.prepare(`
        INSERT INTO study_sessions
        (task_id, week_number, category, date, duration_min, mode, notes, is_demo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const s of payload.data.study_sessions) {
        sessStmt.run(
          s.task_id ?? null,
          s.week_number,
          s.category,
          s.date,
          s.duration_min,
          s.mode,
          s.notes || '',
          s.is_demo ? 1 : 0,
          s.created_at || payload.exported_at
        );
      }

      const examStmt = this.db.prepare(`
        INSERT INTO mock_exams
        (cert_code, source, date, score_pct, raw_score, domain_scores_json, notes, is_demo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const e of payload.data.mock_exams) {
        examStmt.run(
          e.cert_code,
          e.source,
          e.date,
          e.score_pct,
          e.raw_score ?? null,
          JSON.stringify(e.domain_scores || {}),
          e.notes || '',
          e.is_demo ? 1 : 0,
          e.created_at || payload.exported_at
        );
      }

      const errStmt = this.db.prepare(`
        INSERT INTO error_journal
        (cert_code, domain_id, topic_id, question_summary, root_cause, action_to_review, resolved, is_demo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const er of payload.data.error_journal) {
        errStmt.run(
          er.cert_code,
          er.domain_id,
          er.topic_id,
          er.question_summary,
          er.root_cause,
          er.action_to_review,
          er.resolved ? 1 : 0,
          er.is_demo ? 1 : 0,
          er.created_at || payload.exported_at
        );
      }

      const cardStmt = this.db.prepare(`
        INSERT INTO flashcards
        (id, topic_id, cert_code, front, back, provenance, source_url, repetitions, interval_days, ease_factor, due_date, last_reviewed_at, is_demo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const c of payload.data.flashcards) {
        cardStmt.run(
          c.id,
          c.topic_id,
          c.cert_code,
          c.front,
          c.back,
          c.provenance,
          c.source_url || '',
          c.repetitions,
          c.interval_days,
          c.ease_factor,
          c.due_date,
          c.last_reviewed_at ?? null,
          c.is_demo ? 1 : 0,
          c.created_at || payload.exported_at
        );
      }

      this.saveSettings(payload.data.settings);
      this.db
        .prepare('INSERT OR REPLACE INTO settings (key, value_json, updated_at) VALUES (?, ?, ?)')
        .run('catalog_seeded', JSON.stringify(true), new Date().toISOString());

      this.db.exec('COMMIT;');
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
  }

  /**
   * Supprime toutes les donnees utilisateur (reinitialisation complete) et recharge uniquement
   * les lecons cochees d'origine dans catalogue_formations.json.
   */
  public resetAllUserData(): void {
    this.db.exec('BEGIN IMMEDIATE;');
    try {
      this.db.exec(`
        DELETE FROM lesson_progress;
        DELETE FROM task_states;
        DELETE FROM task_history;
        DELETE FROM study_sessions;
        DELETE FROM mock_exams;
        DELETE FROM error_journal;
        DELETE FROM flashcards;
        DELETE FROM settings;
      `);
      this.db.exec('COMMIT;');
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
    this.ensureSeeded();
  }

  /**
   * Injecte un jeu d'essai clairement identifie par is_demo = 1 et "[DÉMO]" pour tester l'interface,
   * supprimable en un clic (Regle 4).
   */
  public loadDemoData(): void {
    this.clearDemoData();
    const now = new Date().toISOString();

    this.addStudySession({
      task_id: 'W01-C1',
      week_number: 1,
      category: 'certification',
      date: '2026-11-02',
      duration_min: 65,
      mode: 'timer',
      notes: '[DÉMO] Séance de démonstration sur Route 53 et CloudFront',
      is_demo: 1,
    });

    this.addMockExam({
      cert_code: 'CLF-C02',
      source: '[DÉMO] AWS Skill Builder Official Practice Question Set',
      date: '2026-11-02',
      score_pct: 82,
      raw_score: 820,
      domain_scores: {
        'Domaine 1 (Concepts Cloud)': 88,
        'Domaine 2 (Sécurité & Conformité)': 80,
        'Domaine 3 (Technologies & Services)': 82,
        'Domaine 4 (Facturation & Support)': 78,
      },
      notes: '[DÉMO] Résultat fictif de démonstration supprimable en un clic.',
      is_demo: 1,
    });

    this.addErrorJournalEntry({
      cert_code: 'CLF-C02',
      domain_id: 'Domaine 2 : Sécurité et conformité',
      topic_id: 'security_gov',
      question_summary: '[DÉMO] Confusion entre AWS WAF (couche 7) et AWS Shield Standard (couche 3/4).',
      root_cause: 'Lecture trop rapide des mots-clés SQL injection / Cross-Site Scripting.',
      action_to_review: 'Cours Amadou Merico : bloc M10 (leçons 164 à 185).',
      resolved: 0,
      is_demo: 1,
    });

    this.upsertFlashcard({
      id: 'demo-card-1',
      topic_id: 'lakehouse_iceberg',
      cert_code: 'DEA-C01',
      front: '[DÉMO] Quel mécanisme d’Apache Iceberg permet de changer le découpage temporel d’une table sans réécrire les fichiers Parquet existants ?',
      back: 'Le Partitionnement Caché (Hidden Partitioning) combiné à l’évolution de schéma de partition (Partition Evolution) dans les fichiers de métadonnées.',
      provenance: 'générée par IA et vérifiée dans la documentation (date)',
      source_url: 'https://iceberg.apache.org/docs/latest/partitioning/ (vérifié le 31/10/2026)',
      repetitions: 0,
      interval_days: 0,
      ease_factor: 2.5,
      due_date: '2026-11-02',
      last_reviewed_at: null,
      is_demo: 1,
      created_at: now,
    });
  }

  /**
   * Supprime en un clic toutes les donnees de demonstration (is_demo = 1).
   */
  public clearDemoData(): void {
    this.db.exec('BEGIN IMMEDIATE;');
    try {
      this.db.exec(`
        DELETE FROM study_sessions WHERE is_demo = 1;
        DELETE FROM mock_exams WHERE is_demo = 1;
        DELETE FROM error_journal WHERE is_demo = 1;
        DELETE FROM flashcards WHERE is_demo = 1;
      `);
      this.db.exec('COMMIT;');
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
  }

  // --- Méthodes pour la préparation aux entretiens (Phase 4) ---

  public saveInterviewSimulation(sim: {
    id: string;
    role: string;
    seniority: string;
    total_score: number;
    duration_seconds: number;
    details_json: string;
    created_at?: string;
  }): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO interview_simulations (
        id, role, seniority, total_score, duration_seconds, details_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      sim.id,
      sim.role,
      sim.seniority,
      sim.total_score,
      sim.duration_seconds,
      sim.details_json,
      sim.created_at || new Date().toISOString()
    );
  }

  public getInterviewSimulations(): Array<{
    id: string;
    role: string;
    seniority: string;
    total_score: number;
    duration_seconds: number;
    details_json: string;
    created_at: string;
  }> {
    return this.db
      .prepare('SELECT * FROM interview_simulations ORDER BY created_at DESC')
      .all() as any[];
  }

  public recordCompetencyAttempt(record: {
    competency_id: string;
    session_id: string;
    success: boolean;
    notes?: string;
    recorded_at?: string;
  }): void {
    const stmt = this.db.prepare(`
      INSERT INTO competency_records (
        competency_id, session_id, success, notes, recorded_at
      ) VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      record.competency_id,
      record.session_id,
      record.success ? 1 : 0,
      record.notes || '',
      record.recorded_at || new Date().toISOString()
    );
  }

  public getCompetenciesStatus(): Record<
    string,
    {
      totalAttempts: number;
      successCount: number;
      distinctSessions: number;
      isMastered: boolean;
      lastRecordedAt: string | null;
    }
  > {
    const rows = this.db
      .prepare(`
        SELECT
          competency_id,
          COUNT(*) as total_attempts,
          SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as success_count,
          COUNT(DISTINCT session_id) as distinct_sessions,
          MAX(recorded_at) as last_recorded
        FROM competency_records
        GROUP BY competency_id
      `)
      .all() as Array<{
        competency_id: string;
        total_attempts: number;
        success_count: number;
        distinct_sessions: number;
        last_recorded: string | null;
      }>;

    const result: Record<
      string,
      {
        totalAttempts: number;
        successCount: number;
        distinctSessions: number;
        isMastered: boolean;
        lastRecordedAt: string | null;
      }
    > = {};

    for (const r of rows) {
      // Règle de validation de compétence : au moins 3 réussites réparties sur au moins 2 sessions distinctes
      const isMastered = r.success_count >= 3 && r.distinct_sessions >= 2;
      result[r.competency_id] = {
        totalAttempts: Number(r.total_attempts),
        successCount: Number(r.success_count),
        distinctSessions: Number(r.distinct_sessions),
        isMastered,
        lastRecordedAt: r.last_recorded,
      };
    }
    return result;
  }

  public getPodcastProgressMap(): Record<string, PodcastProgressRow> {
    const rows = this.db
      .prepare('SELECT * FROM podcast_progress')
      .all() as unknown as PodcastProgressRow[];
    const map: Record<string, PodcastProgressRow> = {};
    for (const r of rows) {
      map[r.episode_id] = {
        episode_id: r.episode_id,
        listen_count: Number(r.listen_count || 0),
        last_position_sec: Number(r.last_position_sec || 0),
        updated_at: r.updated_at,
      };
    }
    return map;
  }

  public upsertPodcastProgress(params: {
    episode_id: string;
    listen_count?: number;
    increment_listen?: boolean;
    last_position_sec?: number;
  }): PodcastProgressRow {
    const now = new Date().toISOString();
    const existing = this.db
      .prepare('SELECT * FROM podcast_progress WHERE episode_id = ?')
      .get(params.episode_id) as unknown as PodcastProgressRow | undefined;

    const currentListenCount = Number(existing?.listen_count || 0);
    const nextListenCount =
      params.listen_count !== undefined
        ? Math.max(0, params.listen_count)
        : params.increment_listen
          ? currentListenCount + 1
          : currentListenCount;

    const nextPositionSec =
      params.last_position_sec !== undefined
        ? Math.max(0, params.last_position_sec)
        : Number(existing?.last_position_sec || 0);

    this.db
      .prepare(`
        INSERT OR REPLACE INTO podcast_progress
        (episode_id, listen_count, last_position_sec, updated_at)
        VALUES (?, ?, ?, ?)
      `)
      .run(params.episode_id, nextListenCount, nextPositionSec, now);

    return {
      episode_id: params.episode_id,
      listen_count: nextListenCount,
      last_position_sec: nextPositionSec,
      updated_at: now,
    };
  }

  public close(): void {
    this.db.close();
  }
}

