import { describe, expect, it } from 'vitest';
import planningHebdo from '../../data/planning_hebdo.json';
import planningEntretiens from '../../data/planning_entretiens.json';
import { PlanningEntretiensData, PlanningHebdoData } from '../../src/domain/types';
import { buildUnifiedTasks } from '../../src/domain/rescheduler';
import { getTaskActionGuide } from '../../src/domain/taskNavigation';

const tasks = buildUnifiedTasks(
  planningHebdo as unknown as PlanningHebdoData,
  planningEntretiens as unknown as PlanningEntretiensData
);

describe('formations AWS Skill Builder du planning', () => {
  it('place les revues officielles CLF-C02 (français) et DEA-C01 (anglais) aux semaines validées', () => {
    const sb = tasks.filter((t) => t.skillbuilder && t.priority === 'core');
    const where = (name: string) => sb.filter((t) => t.skillbuilder!.items.some((i) => i.name.startsWith(name))).map((t) => `${t.cert_code}:S${t.original_week}`);
    // D-25 : chaque revue suit les leçons du cours qui couvrent le domaine.
    expect(where('Domain 1 Review')).toEqual(['CLF-C02:S1', 'DEA-C01:S15']);
    expect(where('Domain 2 Review')).toEqual(['CLF-C02:S4', 'DEA-C01:S14']);
    expect(where('Domain 3 Review')).toEqual(['CLF-C02:S3', 'DEA-C01:S17']);
    expect(where('Domain 4 Review')).toEqual(['CLF-C02:S4', 'DEA-C01:S16']);
    for (const t of sb.filter((x) => x.type === 'skill_builder')) {
      expect(t.url).toBe('https://skillbuilder.aws/');
      expect(t.skillbuilder!.language).toBe(t.cert_code === 'CLF-C02' ? 'Français' : 'English');
    }
  });

  it('donne un guide avec le lien général, la page, les filtres et les titres exacts', () => {
    const d3 = tasks.find((t) => t.skillbuilder?.items.some((i) => i.name.startsWith('Domain 3 Review: AWS Certified Cloud Practitioner')))!;
    const g = getTaskActionGuide(d3);
    expect(g.primaryButton.externalUrl).toBe('https://skillbuilder.aws/');
    expect(g.steps.join(' ')).toContain('Gratuit');
    expect(g.steps.join(' ')).toContain('AWS Certified Cloud Practitioner (CLF-C02)');
    expect(d3.skillbuilder!.items.map((i) => i.name)).toEqual([
      'Domain 3 Review: AWS Certified Cloud Practitioner (CLF-C02 - Français)',
    ]);
  });

  it('les revues CLF-C02 sont toutes faites avant la semaine de l\'examen (S5)', () => {
    const clf = tasks.filter((t) => t.type === 'skill_builder' && t.cert_code === 'CLF-C02');
    expect(clf.length).toBe(4);
    for (const t of clf) expect(t.original_week, t.id).toBeLessThan(5);
  });

  it('aucune semaine ne dépasse le plafond de 11 h (660 min)', () => {
    const interview = new Map<number, number>();
    for (const w of (planningEntretiens as unknown as PlanningEntretiensData).weeks) {
      interview.set(w.week, w.tasks.reduce((a, t) => a + (t.est_min || 0), 0));
    }
    for (const w of (planningHebdo as unknown as PlanningHebdoData).weeks) {
      const cert = w.tasks.reduce((a, t) => a + t.est_min, 0);
      expect(cert + (interview.get(w.week) || 0), `S${w.week}`).toBeLessThanOrEqual(660);
    }
  });
});
