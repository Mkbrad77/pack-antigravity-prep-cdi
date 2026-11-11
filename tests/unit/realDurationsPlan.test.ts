import { describe, expect, it } from 'vitest';
import planningHebdo from '../../data/planning_hebdo.json';
import planningEntretiens from '../../data/planning_entretiens.json';
import catalogueJson from '../../data/catalogue_formations.json';
import { CatalogueData, CourseKey, PlanningEntretiensData, PlanningHebdoData } from '../../src/domain/types';
import { buildUnifiedTasks } from '../../src/domain/rescheduler';
import { CERT_PHASES, DEFAULT_EXAM_DATES } from '../../src/domain/phases';

const plan = planningHebdo as unknown as PlanningHebdoData;
const catalogue = catalogueJson as unknown as CatalogueData;
const tasks = buildUnifiedTasks(plan, planningEntretiens as unknown as PlanningEntretiensData);
const course = (k: CourseKey) => catalogue.udemy_courses.find((c) => c.key === k)!;

/** Leçons couvertes par les tâches Udemy (priorité donnée) d'un cours. */
function covered(k: CourseKey, priority: 'core' | 'bonus') {
  const seen = new Map<number, number>();
  for (const t of tasks) {
    if (t.course_key !== k || t.priority !== priority || t.first_lecture === undefined || t.last_lecture === undefined) continue;
    for (let n = t.first_lecture; n <= t.last_lecture; n++) seen.set(n, (seen.get(n) || 0) + 1);
  }
  return seen;
}

function lessonsOf(k: CourseKey, blocks?: string[]) {
  return course(k)
    .items.filter((i) => i.type === 'lec' && (!blocks || blocks.includes(i.block)))
    .map((i) => i.n as number);
}

describe('Planning recalé sur les vraies durées Udemy (D-25)', () => {
  it('place les 3 examens en S5, S11 et S20 aux dates par défaut des réglages', () => {
    const exams = tasks.filter((t) => t.type === 'certification');
    expect(exams.map((t) => `${t.cert_code}:S${t.original_week}`)).toEqual(['CLF-C02:S5', 'DBT:S11', 'DEA-C01:S20']);
    for (const t of exams) expect(t.original_week).toBe(CERT_PHASES[t.cert_code!].examWeek);
    expect(DEFAULT_EXAM_DATES).toEqual({ 'CLF-C02': '2026-12-11', DBT: '2027-01-22', 'DEA-C01': '2027-03-26' });
  });

  it('commence par la progression réelle : Merico leçons 1 à 35 dans W01-C1', () => {
    const c1 = tasks.find((t) => t.id === 'W01-C1')!;
    expect([c1.course_key, c1.first_lecture, c1.last_lecture]).toEqual(['merico', 1, 35]);
    const done = course('merico').items.filter((i) => i.done && i.type === 'lec').map((i) => i.n);
    expect(done).toEqual(Array.from({ length: 35 }, (_, i) => i + 1));
  });

  it('couvre chaque leçon obligatoire une seule fois, avant l\'examen correspondant', () => {
    const required: Array<[CourseKey, number[], number]> = [
      ['merico', lessonsOf('merico').filter((n) => n <= 203), 5],
      ['toth', lessonsOf('toth', ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T08', 'T09', 'T10', 'T11', 'T12', 'T17', 'T18']), 11],
      ['weigel', lessonsOf('weigel', ['W05', 'W06', 'W07', 'W08', 'W09', 'W10', 'W11']), 11],
      ['maarek', lessonsOf('maarek', ['K01', 'K02', 'K03', 'K04', 'K05', 'K07a', 'K07b', 'K07c', 'K08', 'K09', 'K11', 'K16']), 20],
    ];
    for (const [k, lessons, examWeek] of required) {
      const seen = covered(k, 'core');
      for (const n of lessons) expect(seen.get(n), `${k} leçon ${n}`).toBeGreaterThanOrEqual(1);
      const late = tasks.filter((t) => t.course_key === k && t.priority === 'core' && t.original_week > examWeek);
      expect(late, k).toHaveLength(0);
    }
  });

  it('ne cite que des leçons qui existent dans les cours, et Nikolai uniquement en bonus', () => {
    for (const t of tasks) {
      if (!t.course_key || t.first_lecture === undefined) continue;
      const max = Math.max(...lessonsOf(t.course_key));
      expect(t.last_lecture!, t.id).toBeLessThanOrEqual(max);
    }
    expect(tasks.filter((t) => t.course_key === 'nikolai' && t.priority === 'core')).toHaveLength(0);
  });

  it('calcule les minutes à partir du catalogue (vidéo x coefficient / vitesse, plus quiz et exercices)', () => {
    const speed = catalogue.meta.playback_speed!;
    expect(speed).toMatchObject({ merico: 1.25, toth: 1.25, weigel: 1.25, maarek: 1 });
    const t = tasks.find((x) => x.course_key === 'maarek' && x.first_lecture === 167)!;
    const items = course('maarek').items;
    let last = 0;
    let est = 0;
    for (const i of items) {
      if (i.type === 'lec') last = i.n as number;
      if (last < t.first_lecture! || last > t.last_lecture!) continue;
      if (i.type === 'lec') est += i.minutes * catalogue.meta.time_factors.maarek;
      else if (i.type === 'quiz') est += catalogue.meta.quiz_minutes.maarek;
    }
    expect(Math.abs(t.initial_est_min - est)).toBeLessThanOrEqual(2);
  });

  it('garde toutes les semaines sous leur plafond (11 h, 6 h pendant les fêtes)', () => {
    const interviews = new Map<number, number>();
    for (const w of (planningEntretiens as unknown as PlanningEntretiensData).weeks) {
      interviews.set(w.week, w.tasks.reduce((a, t) => a + (t.est_min || 0), 0));
    }
    for (const w of plan.weeks) {
      const total = w.tasks.reduce((a, t) => a + t.est_min, 0) + (interviews.get(w.week) || 0);
      expect(total, `S${w.week}`).toBeLessThanOrEqual(w.light_week ? 360 : 660);
    }
  });
});
