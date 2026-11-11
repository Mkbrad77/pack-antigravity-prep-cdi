import { describe, expect, it } from 'vitest';
import planningHebdo from '../../data/planning_hebdo.json';
import planningEntretiens from '../../data/planning_entretiens.json';
import resources from '../../data/snowflake_dbt_resources.json';
import { PlanningEntretiensData, PlanningHebdoData, SnowflakeDbtResourcesData } from '../../src/domain/types';
import { buildUnifiedTasks } from '../../src/domain/rescheduler';
import { getTaskActionGuide } from '../../src/domain/taskNavigation';

const plan = planningHebdo as unknown as PlanningHebdoData;
const tasks = buildUnifiedTasks(plan, planningEntretiens as unknown as PlanningEntretiensData);
const hub = resources as unknown as SnowflakeDbtResourcesData;

const weekLoad = (week: number, coreOnly = false) =>
  tasks
    .filter((t) => t.original_week === week && (!coreOnly || t.priority === 'core'))
    .reduce((sum, t) => sum + t.effective_est_min, 0);

describe('Quickstarts Snowflake et dbt en continu (D-23)', () => {
  it('prévoit au moins un Quickstart obligatoire chaque semaine de S1 à S21', () => {
    for (let week = 1; week <= 21; week += 1) {
      const qs = tasks.filter((t) => t.original_week === week && t.priority === 'core' && /quickstart/i.test(t.type));
      expect(qs.length, `S${week}`).toBeGreaterThan(0);
    }
  });

  it('démarre en S1 avec l\'essai standard 30 jours et les guides Notebooks et UDF', () => {
    const s1 = tasks.filter((t) => t.original_week === 1 && /quickstart/i.test(t.type)).map((t) => t.url);
    expect(s1).toEqual([
      'https://quickstarts.snowflake.com/guide/getting_started_with_snowflake_notebooks/index.html',
      'https://quickstarts.snowflake.com/guide/getting_started_with_user_defined_sql_functions/index.html',
    ]);
    expect(tasks.find((t) => t.id === 'W04-B1')!.title).toMatch(/Devoteam/);
  });

  it('respecte le plafond de 660 min et les semaines allégées à 360 min', () => {
    for (const w of plan.weeks) {
      const cap = w.light_week ? 360 : 660;
      expect(weekLoad(w.week), `S${w.week}`).toBeLessThanOrEqual(cap);
    }
  });

  it('ne laisse aucun identifiant de tâche en double', () => {
    const ids = tasks.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('indique le bon compte Snowflake dans le guide selon la semaine', () => {
    const step = (id: string) => getTaskActionGuide(tasks.find((t) => t.id === id)!).steps[1];
    expect(step('W01-C6')).toContain('essai Snowflake standard 30 jours');
    expect(step('W06-C3')).toContain('120 jours');
    expect(step('W15-C3')).toContain('Cortex Code');
    expect(step('W21-C1')).toContain('2e essai Snowflake standard');
  });

  it('aligne les semaines de la page Snowflake sur le planning', () => {
    const byUrl = new Map<string, number>();
    const norm = (u: string) => u.split('?')[0].split('#')[0].replace(/\/$/, '');
    for (const t of tasks) if (t.url) byUrl.set(norm(t.url), t.original_week);
    for (const qs of [...hub.dbt_snowflake_quickstarts, ...hub.snowflake_ml_quickstarts, ...hub.dbt_certification_resources]) {
      const week = byUrl.get(norm(qs.url));
      if (week !== undefined) expect(qs.recommended_week, qs.id).toBe(week);
    }
    for (const trial of hub.free_trials) {
      expect(trial.recommended_week).toBeGreaterThan(0);
      expect(trial.activation_advice.length).toBeGreaterThan(0);
    }
    expect(hub.free_trials.map((t) => t.recommended_week)).toEqual([1, 3, 14, 20]);
  });
});
