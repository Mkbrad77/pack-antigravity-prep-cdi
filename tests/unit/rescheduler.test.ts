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
    'CLF-C02': '2026-11-27',
    DBT: '2027-01-08',
    'DEA-C01': '2027-03-19',
  },
  readiness_rules: DEFAULT_READINESS_RULES,
  last_backup_at: null,
  active_week_override: 1,
  simulated_today: '2026-11-09',
};

describe('Moteur de replanification dynamique (Départ Lundi 9 nov. 2026 + Podcasts NotebookLM + Fêtes allégées)', () => {
  it('Scénario 1A (Planning réel) : Séance Déduplication SQL (Chapitre 2.8, 35 min en Semaine 4) ratée -> absorbée en Semaine 5 (560/660 min) sans décalage en cascade', () => {
    const tasks = buildUnifiedTasks(planningHebdo, planningEntretiens);
    const w4Before = computeWeekLoadSummary(4, tasks, planningHebdo, defaultSettings);
    const w5Before = computeWeekLoadSummary(5, tasks, planningHebdo, defaultSettings);

    expect(w4Before.totalActiveMinutes).toBe(470); // 370 cert dbt + 100 interview
    expect(w5Before.totalActiveMinutes).toBe(525); // 425 cert dbt/Snowflake + 100 interview

    const result = reschedulePlanning(tasks, planningHebdo, defaultSettings, {
      type: 'postpone_task',
      taskId: 'W04-I3', // Chapitre 2.8 : ROW_NUMBER et deduplication (35 min)
      fromWeek: 4,
    });

    const movedTask = result.updatedTasks.find((t) => t.id === 'W04-I3')!;
    expect(movedTask.target_week).toBe(5);
    expect(movedTask.status).toBe('postponed');
    expect(result.weekSummaries[5].totalActiveMinutes).toBe(560);
    expect(result.weekSummaries[5].totalActiveMinutes).toBeLessThanOrEqual(660);
    expect(result.changes).toHaveLength(1);
    expect(result.explanationFr.join(' ')).toContain('Semaine 5');
  });

  it('Scénario 1B (Variante Semaine 5 -> Semaine 6) : 50 min de SQL (W05-I3 + W05-I4) ratées en Semaine 5 -> absorbées en Semaine 6 (650/660 min dans la marge disponible)', () => {
    const tasks = buildUnifiedTasks(planningHebdo, planningEntretiens);

    const step1 = reschedulePlanning(tasks, planningHebdo, defaultSettings, {
      type: 'postpone_task',
      taskId: 'W05-I3',
      fromWeek: 5,
    });
    const step2 = reschedulePlanning(step1.updatedTasks, planningHebdo, defaultSettings, {
      type: 'postpone_task',
      taskId: 'W05-I4',
      fromWeek: 5,
    });

    expect(step2.weekSummaries[6].totalActiveMinutes).toBe(650); // 600 initiales + 50 reportees = 650 <= 660
    expect(step2.weekSummaries[6].totalActiveMinutes).toBeLessThanOrEqual(660);
  });

  it('Scénario 2 : Semaine 5 entière ratée pour maladie -> purge des bonus (S6, les semaines de fêtes S7 et S8 n’en ont plus), sauvetage prioritaire des cours Core DBT (Principe 2), compression à 50 % des entretiens SQL et respect strict des plafonds de fêtes (S7 Noël <= 360m, S8 Nouvel An <= 360m)', () => {
    const tasks = buildUnifiedTasks(planningHebdo, planningEntretiens);

    const result = reschedulePlanning(tasks, planningHebdo, defaultSettings, {
      type: 'missed_week',
      week: 5,
      reason: 'Semaine 5 non réalisée pour cause de maladie',
    });

    // 1. Les bonus de S6 ont ete sacrifies (S7 et S8 n'ont plus de bonus depuis D-23)
    expect(result.updatedTasks.find((t) => t.id === 'W06-B1')!.status).toBe('skipped');
    expect(result.updatedTasks.find((t) => t.id === 'W06-B2')!.status).toBe('skipped');
    expect(result.updatedTasks.some((t) => [7, 8].includes(t.original_week) && t.priority === 'bonus')).toBe(false);

    // 2. Les chapitres d'entretien de S5 sont compresses
    const w05i1 = result.updatedTasks.find((t) => t.id === 'W05-I1')!;
    expect(w05i1.status).toBe('compressed');
    expect(w05i1.effective_est_min).toBe(15);

    // 3. Respect strict des plafonds hebdomadaires (S6 <= 660, S7 Noël <= 360, S8 Nouvel An <= 360)
    expect(result.weekSummaries[6].totalActiveMinutes).toBeLessThanOrEqual(660);
    expect(result.weekSummaries[7].totalActiveMinutes).toBeLessThanOrEqual(360);
    expect(result.weekSummaries[8].totalActiveMinutes).toBeLessThanOrEqual(360);

    // 4. La date de l'examen DBT reste intacte au 2027-01-08
    expect(result.updatedExamDates['DBT']).toBe('2027-01-08');
  });

  it('Scénario 3 : Semaine d’examen DBT (Semaine 9) avec fatigue -> aucun bonus à supprimer (Quickstart #5 obligatoire, conseillé après l’examen) et réduction de l’entretien à 20 min de relecture', () => {
    const tasks = buildUnifiedTasks(planningHebdo, planningEntretiens);

    const result = reschedulePlanning(tasks, planningHebdo, defaultSettings, {
      type: 'exam_week_fatigue',
      week: 9,
    });

    const w09i1 = result.updatedTasks.find((t) => t.id === 'W09-I1')!;
    expect(result.updatedTasks.find((t) => t.id === 'W09-C4')!.status).not.toBe('skipped');
    expect(w09i1.status).toBe('compressed');
    expect(w09i1.effective_est_min).toBe(20);
    expect(result.weekSummaries[9].totalActiveMinutes).toBeLessThanOrEqual(475);
  });

  it('Scénario 4 : Retard et score blanc DBT < 80 % en Semaine 8 (72 %) -> report de +7 jours de DBT en Semaine 10 et absorption via la Semaine 20 de réserve', () => {
    const tasks = buildUnifiedTasks(planningHebdo, planningEntretiens);

    const result = reschedulePlanning(tasks, planningHebdo, defaultSettings, {
      type: 'low_mock_score',
      week: 8,
      certCode: 'DBT',
      scorePct: 72,
    });

    expect(result.updatedExamDates['DBT']).toBe('2027-01-15');
    const examTask = result.updatedTasks.find((t) => t.id === 'W09-C3')!;
    const deaBonusTask = result.updatedTasks.find((t) => t.id === 'W10-B1')!;
    const deaStartTask = result.updatedTasks.find((t) => t.id === 'W10-C1')!;

    expect(examTask.target_week).toBe(10);
    // Plus aucun bonus dbt en S8 à S10 : aucune tâche DEA n'est promue à tort en remédiation dbt.
    expect(deaBonusTask.priority).toBe('bonus');
    expect(deaStartTask.target_week).toBe(20);
  });

  it('Scénario 5 : Échec à l’examen DBT le 8 janvier 2027 (62 %) -> délai de 14 jours (22 janvier, Semaine 11) et décalage de DEA-C01 sur la réserve (26 mars, Semaine 20)', () => {
    const tasks = buildUnifiedTasks(planningHebdo, planningEntretiens);

    const result = reschedulePlanning(tasks, planningHebdo, defaultSettings, {
      type: 'exam_failure',
      week: 9,
      certCode: 'DBT',
      rawScore: 62,
      failedDateIso: '2027-01-08',
    });

    expect(result.updatedExamDates['DBT']).toBe('2027-01-22');
    expect(result.updatedExamDates['DEA-C01']).toBe('2027-03-26');

    const dbtExamTask = result.updatedTasks.find((t) => t.id === 'W09-C3')!;
    const deaExamTask = result.updatedTasks.find((t) => t.id === 'W19-C3')!;
    expect(dbtExamTask.target_week).toBe(11);
    expect(deaExamTask.target_week).toBe(20);
  });

  it('Scénario 6 : Semaine de fêtes de Noël (Semaine 7, budget allégé à 360 min / 6 h) -> charge déjà sous le plafond (335 min Core avec le Quickstart ML court), rien à supprimer (marge de 25 min)', () => {
    const tasks = buildUnifiedTasks(planningHebdo, planningEntretiens);
    const before = computeWeekLoadSummary(7, tasks, planningHebdo, defaultSettings);
    expect(before.totalActiveMinutes).toBe(335);
    expect(before.maxMinutes).toBe(360);

    const result = reschedulePlanning(tasks, planningHebdo, defaultSettings, {
      type: 'enforce_light_week',
      week: 7,
    });

    expect(result.changes).toHaveLength(0);
    expect(result.weekSummaries[7].totalActiveMinutes).toBe(335);
    expect(result.weekSummaries[7].remainingMarginMinutes).toBe(25);
  });
});
