import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  CatalogueData,
  PlanningEntretiensData,
  PlanningHebdoData,
} from '../../src/domain/types';
import {
  computeAllCertificationsProgress,
  computeCourseProgress,
} from '../../src/domain/progression';
import { buildUnifiedTasks } from '../../src/domain/rescheduler';

const rootDir = process.cwd();
const catalogue: CatalogueData = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'data', 'catalogue_formations.json'), 'utf-8')
);
const planningHebdo: PlanningHebdoData = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'data', 'planning_hebdo.json'), 'utf-8')
);
const planningEntretiens: PlanningEntretiensData = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'data', 'planning_entretiens.json'), 'utf-8')
);

describe('Calcul de progression pondérée par les minutes (Données réelles, Merico 1 à 35 faites)', () => {
  it('part des leçons Merico 1 à 35 déjà faites (progression réelle au 11/11/2026)', () => {
    const merico = catalogue.udemy_courses.find((c) => c.key === 'merico')!;
    expect(merico).toBeDefined();

    const stats = computeCourseProgress(
      merico,
      {},
      catalogue.meta.time_factors,
      catalogue.meta.quiz_minutes,
      catalogue.meta.exercise_minutes
    );

    expect(stats.totalItems).toBe(237);
    expect(stats.doneItems).toBe(38);
    expect(stats.videoMinutesTotal).toBe(1512);
    expect(stats.videoMinutesRemaining).toBe(1512 - 253);

    const b1 = stats.blocks.find((b) => b.blockId === 'M01')!;
    const b4 = stats.blocks.find((b) => b.blockId === 'M04')!;
    expect(b1.weightedPercent).toBe(100);
    expect(b4.weightedPercent).toBe(0);
  });

  it('démarre à 0 % sur dbt et DEA-C01, CLF-C02 déjà entamée', () => {
    const tasks = buildUnifiedTasks(planningHebdo, planningEntretiens, {});
    const all = computeAllCertificationsProgress(catalogue, {}, tasks);

    expect(all.certifications['CLF-C02'].courseWeightedPercent).toBeGreaterThan(10);
    expect(all.certifications['CLF-C02'].courseWeightedPercent).toBeLessThan(25);
    expect(all.certifications['DEA-C01'].courseWeightedPercent).toBe(0);
    expect(all.certifications['DEA-C01'].combinedWeightedPercent).toBe(0);
    expect(all.certifications['DBT'].courseWeightedPercent).toBe(0);
    expect(all.certifications['DBT'].combinedWeightedPercent).toBe(0);
  });

  it('met à jour la progression pondérée lorsqu’une plage de leçons est cochée', () => {
    const maarek = catalogue.udemy_courses.find((c) => c.key === 'maarek')!;
    const lessonMap: Record<string, boolean> = {};

    // Cocher toutes les lecons du bloc K01
    for (const item of maarek.items) {
      if (item.block === 'K01') {
        lessonMap[`maarek:${item.i}`] = true;
      }
    }

    const stats = computeCourseProgress(
      maarek,
      lessonMap,
      catalogue.meta.time_factors,
      catalogue.meta.quiz_minutes,
      catalogue.meta.exercise_minutes
    );

    const k01 = stats.blocks.find((b) => b.blockId === 'K01')!;
    expect(k01.weightedPercent).toBe(100);
    expect(k01.videoMinutesRemaining).toBe(0);
    expect(stats.weightedPercent).toBeGreaterThan(5);
    expect(stats.weightedPercent).toBeLessThan(12);
  });
});

describe('Vitesse de lecture et exercices (D-25)', () => {
  it('applique la vitesse 1,25x aux vidéos et compte les exercices « exo »', () => {
    const toth = catalogue.udemy_courses.find((c) => c.key === 'toth')!;
    const normal = computeCourseProgress(toth, {}, catalogue.meta.time_factors, catalogue.meta.quiz_minutes, catalogue.meta.exercise_minutes, 1);
    const fast = computeCourseProgress(toth, {}, catalogue.meta.time_factors, catalogue.meta.quiz_minutes, catalogue.meta.exercise_minutes, 1.25);
    const exos = toth.items.filter((i) => (i.type as string) === 'exo').length;
    const quizzes = toth.items.filter((i) => i.type === 'quiz').length;
    const exams = toth.items.filter((i) => i.type === 'exam' && !i.minutes).length;
    const fixed = exos * catalogue.meta.exercise_minutes.toth + quizzes * catalogue.meta.quiz_minutes.toth + exams * 60;
    expect(exos).toBeGreaterThan(0);
    expect(Math.round((normal.estimatedMinutesTotal - fixed) / 1.25)).toBeCloseTo(fast.estimatedMinutesTotal - fixed, -1);
    expect(fast.playbackSpeed).toBe(1.25);
  });
});
