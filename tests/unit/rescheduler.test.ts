import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  AppSettings,
  PlanningEntretiensData,
  PlanningHebdoData,
} from '../../src/domain/types';
import {
  buildUnifiedTasks,
  computeWeekLoadSummary,
  reschedulePlanning,
} from '../../src/domain/rescheduler';
import { DEFAULT_READINESS_RULES } from '../../src/domain/readiness';

const rootDir = process.cwd();
const planningHebdo: PlanningHebdoData = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'data', 'planning_hebdo.json'), 'utf-8')
);
const planningEntretiens: PlanningEntretiensData = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'data', 'planning_entretiens.json'), 'utf-8')
);

const defaultSettings: AppSettings = {
  max_weekly_minutes: 660,
  holiday_weekly_minutes: 360,
  weekly_cert_budget_default_min: 480,
  weekly_interview_budget_default_min: 120,
  compression_factor: 0.5,
  min_compressed_minutes: 15,
  max_compressed_minutes: 30,
  time_factors: { merico: 1.15, maarek: 1.4, nikolai: 1.3, toth: 1.4, weigel: 1.2 },
  exam_dates: {
    'CLF-C02': '2026-12-11',
    DBT: '2027-01-22',
    'DEA-C01': '2027-03-26',
  },
  readiness_rules: DEFAULT_READINESS_RULES,
  last_backup_at: null,
  active_week_override: 1,
  simulated_today: '2026-11-09',
};

describe('Moteur de replanification dynamique (planning D-25 : CLF 11/12, dbt 22/01, DEA 26/03)', () => {
  const tasks = () => buildUnifiedTasks(planningHebdo, planningEntretiens);
  const capOf = (w: number) => (w === 7 || w === 8 ? 360 : 660);

  it('Scénario 1 : séance d\'entretien ratée en S4 -> reportée sur la première semaine qui a la place, sans dépasser aucun plafond', () => {
    const result = reschedulePlanning(tasks(), planningHebdo, defaultSettings, {
      type: 'postpone_task',
      taskId: 'W04-I3',
      fromWeek: 4,
    });
    const moved = result.updatedTasks.find((t) => t.id === 'W04-I3')!;
    expect(moved.status).toBe('postponed');
    expect(moved.target_week).toBeGreaterThan(4);
    // Les semaines de préparation sont pleines : seule la réserve (S21) peut l'accueillir.
    expect(moved.target_week).toBe(21);
    expect(result.changes).toHaveLength(1);
    for (let w = 1; w <= 22; w++) {
      expect(result.weekSummaries[w].totalActiveMinutes, `S${w}`).toBeLessThanOrEqual(capOf(w));
    }
  });

  it('Scénario 2 : semaine 6 entière ratée -> entretiens compressés, cours dbt reportés sans dépasser les plafonds (fêtes comprises)', () => {
    const result = reschedulePlanning(tasks(), planningHebdo, defaultSettings, {
      type: 'missed_week',
      week: 6,
      reason: 'Semaine 6 non réalisée pour cause de maladie',
    });
    const w06i1 = result.updatedTasks.find((t) => t.id === 'W06-I1')!;
    expect(w06i1.status).toBe('compressed');
    expect(w06i1.effective_est_min).toBeLessThanOrEqual(30);
    const movedCore = result.changes.filter((c) => c.action === 'postpone');
    expect(movedCore.length).toBeGreaterThan(0);
    for (const c of movedCore) expect(c.toWeek).toBeGreaterThan(6);
    expect(result.weekSummaries[7].totalActiveMinutes).toBeLessThanOrEqual(360);
    expect(result.weekSummaries[8].totalActiveMinutes).toBeLessThanOrEqual(360);
    for (let w = 1; w <= 22; w++) {
      expect(result.weekSummaries[w].totalActiveMinutes, `S${w}`).toBeLessThanOrEqual(capOf(w));
    }
    expect(result.updatedExamDates['DBT']).toBe('2027-01-22');
  });

  it('Scénario 3 : semaine d\'examen dbt (S11) avec fatigue -> entretiens réduits à 20 min de relecture', () => {
    const result = reschedulePlanning(tasks(), planningHebdo, defaultSettings, {
      type: 'exam_week_fatigue',
      week: 11,
    });
    const w11i1 = result.updatedTasks.find((t) => t.id === 'W11-I1')!;
    expect(w11i1.status).toBe('compressed');
    expect(w11i1.effective_est_min).toBe(20);
    expect(result.weekSummaries[11].totalActiveMinutes).toBeLessThan(
      computeWeekLoadSummary(11, tasks(), planningHebdo, defaultSettings).totalActiveMinutes
    );
  });

  it('Scénario 4 : score blanc dbt < 80 % en S10 -> examen dbt +7 jours (29/01), DEA reportée au 02/04 via la réserve', () => {
    const result = reschedulePlanning(tasks(), planningHebdo, defaultSettings, {
      type: 'low_mock_score',
      week: 10,
      certCode: 'DBT',
      scorePct: 72,
    });
    expect(result.updatedExamDates['DBT']).toBe('2027-01-29');
    expect(result.updatedExamDates['DEA-C01']).toBe('2027-04-02');
    const exam = result.updatedTasks.find((t) => t.type === 'certification' && t.cert_code === 'DBT')!;
    expect(exam.target_week).toBe(12);
    const promoted = result.changes.find((c) => c.action === 'promote');
    if (promoted) {
      const t = result.updatedTasks.find((x) => x.id === promoted.taskId)!;
      expect(t.cert_code).toBe('DBT');
      expect(t.priority).toBe('core');
    }
    const deaStart = result.changes.find((c) => c.toWeek === 21);
    expect(deaStart).toBeDefined();
    expect(result.updatedTasks.find((t) => t.id === deaStart!.taskId)!.cert_code).toBe('DEA-C01');
  });

  it('Scénario 5 : échec à l\'examen dbt du 22/01 -> repassage à J+14 (05/02, S13) et DEA décalée d\'une semaine', () => {
    const result = reschedulePlanning(tasks(), planningHebdo, defaultSettings, {
      type: 'exam_failure',
      week: 11,
      certCode: 'DBT',
      rawScore: 62,
      failedDateIso: '2027-01-22',
    });
    expect(result.updatedExamDates['DBT']).toBe('2027-02-05');
    expect(result.updatedExamDates['DEA-C01']).toBe('2027-04-02');
    const dbtExam = result.updatedTasks.find((t) => t.type === 'certification' && t.cert_code === 'DBT')!;
    const deaExam = result.updatedTasks.find((t) => t.type === 'certification' && t.cert_code === 'DEA-C01')!;
    expect(dbtExam.target_week).toBe(13);
    expect(deaExam.target_week).toBe(21);
  });

  it('Scénario 6 : semaine de Noël (S7, 6 h) -> déjà sous le plafond, rien à supprimer', () => {
    const before = computeWeekLoadSummary(7, tasks(), planningHebdo, defaultSettings);
    expect(before.maxMinutes).toBe(360);
    expect(before.totalActiveMinutes).toBeLessThanOrEqual(360);
    const result = reschedulePlanning(tasks(), planningHebdo, defaultSettings, { type: 'enforce_light_week', week: 7 });
    expect(result.changes).toHaveLength(0);
    expect(result.weekSummaries[7].totalActiveMinutes).toBe(before.totalActiveMinutes);
  });

  it('Scénario 7 : score blanc DEA-C01 < 80 % -> examen DEA +7 jours (02/04, fin du contrat)', () => {
    const result = reschedulePlanning(tasks(), planningHebdo, defaultSettings, {
      type: 'low_mock_score',
      week: 19,
      certCode: 'DEA-C01',
      scorePct: 70,
    });
    expect(result.updatedExamDates['DEA-C01']).toBe('2027-04-02');
    expect(result.updatedTasks.find((t) => t.type === 'certification' && t.cert_code === 'DEA-C01')!.target_week).toBe(21);
  });
});
