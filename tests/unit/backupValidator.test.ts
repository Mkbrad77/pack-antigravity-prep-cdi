import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateBackupPayload } from '../../src/domain/backupValidator';
import { DEFAULT_READINESS_RULES } from '../../src/domain/readiness';
import { BackupPayload } from '../../src/domain/types';
import { LocalSqliteStore } from '../../src/server/db';

describe('Validation de sauvegarde et restauration JSON', () => {
  const validPayload: BackupPayload = {
    schema_version: 1,
    app: 'pack-antigravity-prep-cdi',
    exported_at: '2026-11-02T18:00:00.000Z',
    data: {
      lesson_progress: [
        { course_key: 'merico', item_index: 1, done: 1, updated_at: '2026-10-31T00:00:00Z' },
      ],
      task_states: [
        {
          task_id: 'W01-C1',
          status: 'done',
          target_week: 1,
          custom_duration_min: null,
          completed_at: '2026-11-02T17:00:00Z',
          notes: 'Terminé',
          updated_at: '2026-11-02T17:00:00Z',
        },
      ],
      task_history: [],
      study_sessions: [],
      mock_exams: [],
      error_journal: [],
      flashcards: [
        {
          id: 'fc-1',
          topic_id: 's3',
          cert_code: 'CLF-C02',
          front: 'Quel stockage objet AWS offre 11 neuf de durabilité ?',
          back: 'Amazon S3 Standard.',
          provenance: 'officielle',
          source_url: 'https://docs.aws.amazon.com/s3/',
          repetitions: 1,
          interval_days: 1,
          ease_factor: 2.5,
          due_date: '2026-11-03',
          last_reviewed_at: '2026-11-02',
          is_demo: 0,
          created_at: '2026-11-02T10:00:00Z',
        },
      ],
      settings: {
        max_weekly_minutes: 600,
        holiday_weekly_minutes: 360,
        weekly_cert_budget_default_min: 450,
        weekly_interview_budget_default_min: 120,
        compression_factor: 0.5,
        min_compressed_minutes: 15,
        max_compressed_minutes: 30,
        time_factors: { merico: 1.15, maarek: 1.4, nikolai: 1.3, toth: 1.4, weigel: 1.2 },
        exam_dates: { 'CLF-C02': '2026-11-20', 'DEA-C01': '2027-02-05', DBT: '2027-03-19' },
        readiness_rules: DEFAULT_READINESS_RULES,
        last_backup_at: '2026-11-02T18:00:00.000Z',
        active_week_override: 1,
        simulated_today: '2026-11-02',
      },
    },
  };

  it('accepte un fichier de sauvegarde JSON conforme au schéma v1', () => {
    const res = validateBackupPayload(validPayload);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it('rejette un fichier avec une version de schéma incompatible ou une provenance invalide', () => {
    const badVersion = { ...validPayload, schema_version: 99 };
    expect(validateBackupPayload(badVersion).valid).toBe(false);

    const badProvenance = {
      ...validPayload,
      data: {
        ...validPayload.data,
        flashcards: [
          {
            ...validPayload.data.flashcards[0],
            provenance: 'braindump interdit' as never,
          },
        ],
      },
    };
    const resProv = validateBackupPayload(badProvenance);
    expect(resProv.valid).toBe(false);
    expect(resProv.errors.join(' ')).toContain('provenance non autorisée');
  });

  it('effectue un aller-retour complet (export -> suppression totale -> restauration) dans SQLite', () => {
    const tmpDb = path.join(os.tmpdir(), `prep-cdi-test-${Date.now()}.sqlite`);
    const rootDir = path.resolve(process.cwd());
    const store = new LocalSqliteStore(tmpDb, rootDir);

    try {
      store.upsertTaskState({
        task_id: 'W01-C1',
        status: 'done',
        target_week: 1,
        notes: 'Test round-trip',
      });
      store.addMockExam({
        cert_code: 'CLF-C02',
        source: 'Blanc officiel CLF',
        date: '2026-11-10',
        score_pct: 84,
        raw_score: 840,
        domain_scores: { D1: 85, D2: 82 },
        notes: 'OK',
        is_demo: 0,
      });

      const exported = store.exportBackup();
      expect(
        exported.data.task_states.some((t) => t.task_id === 'W01-C1' && t.status === 'done')
      ).toBe(true);
      expect(exported.data.mock_exams).toHaveLength(1);

      store.resetAllUserData();
      expect(store.getMockExams()).toHaveLength(0);
      expect(store.getTaskStatesMap()['W01-C1']).toBeUndefined();

      store.importBackup(exported);
      expect(store.getMockExams()).toHaveLength(1);
      expect(store.getMockExams()[0].score_pct).toBe(84);
      expect(store.getTaskStatesMap()['W01-C1']?.status).toBe('done');
    } finally {
      store.close();
      if (fs.existsSync(tmpDb)) fs.unlinkSync(tmpDb);
    }
  });
});


