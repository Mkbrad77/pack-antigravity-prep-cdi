import { describe, expect, it } from 'vitest';
import catalog from '../../data/podcasts_catalog.json';
import { PodcastEpisode } from '../../src/domain/types';
import {
  extractEpisodeIds,
  getTodayListening,
  parseScheduleDays,
  summarizeTaskListening,
  weekdayIndex,
} from '../../src/domain/podcastSchedule';

const episodes = (catalog as unknown as { episodes: PodcastEpisode[] }).episodes.map((e) => ({ ...e, listen_count: 0 }));

describe('programme d\'écoute des podcasts', () => {
  it('lit les jours et numéros d\'écoute du catalogue', () => {
    const ep = episodes.find((e) => e.id === 'CLF-AUDIO-03')!;
    const plan = parseScheduleDays(ep);
    expect(plan.map((p) => [p.week, p.day, p.listen])).toEqual([
      [1, 1, 1],
      [1, 4, 2],
      [5, null, 3],
    ]);
  });

  it('place la veille d\'examen le jeudi et marque les rappels au-delà de 3 comme bonus', () => {
    const p12 = parseScheduleDays(episodes.find((e) => e.id === 'CLF-AUDIO-12')!);
    expect(p12.map((p) => [p.week, p.day, p.listen])).toEqual([
      [4, 6, 1],
      [5, 1, 2],
      [5, 3, 3],
    ]);
    const p05 = parseScheduleDays(episodes.find((e) => e.id === 'DBT-AUDIO-05')!);
    expect(p05.map((p) => [p.week, p.day, p.listen])).toEqual([
      [6, 4, 1],
      [7, 0, 2],
      [11, null, 3],
    ]);
    const p16 = parseScheduleDays(episodes.find((e) => e.id === 'DEA-AUDIO-16')!);
    expect(p16[3]).toMatchObject({ week: 20, day: 3, listen: 4, bonus: true });
  });

  it('chaque épisode du catalogue a au moins 3 écoutes prévues', () => {
    for (const ep of episodes) {
      expect(parseScheduleDays(ep).filter((p) => !p.bonus).length, ep.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('extrait les épisodes cités par une tâche', () => {
    expect(extractEpisodeIds('CLF-AUDIO-01 à CLF-AUDIO-06 (Écoute 1)')).toHaveLength(6);
    expect(extractEpisodeIds('DEA-AUDIO-07, 09 & 10 (Écoute 1)')).toEqual(['DEA-AUDIO-07', 'DEA-AUDIO-09', 'DEA-AUDIO-10']);
    expect(extractEpisodeIds('3 modules dbt Learn + DBT-AUDIO-09 à 12')).toEqual(['DBT-AUDIO-09', 'DBT-AUDIO-10', 'DBT-AUDIO-11', 'DBT-AUDIO-12']);
    expect(extractEpisodeIds('DEA-AUDIO-06 & DEA-AUDIO-08')).toEqual(['DEA-AUDIO-06', 'DEA-AUDIO-08']);
    expect(extractEpisodeIds('leçons 200 à 203 + CLF-AUDIO-12')).toEqual(['CLF-AUDIO-12']);
  });

  it('donne les écoutes du lundi 9 novembre et les retards', () => {
    expect(weekdayIndex('2026-11-09')).toBe(0);
    const t = getTodayListening(episodes, 1, 0);
    expect(t.today.map((i) => i.episodeId)).toEqual(['CLF-AUDIO-01', 'CLF-AUDIO-02']);
    const wed = getTodayListening(episodes, 1, 2);
    expect(wed.overdue.map((i) => i.episodeId)).toEqual(['CLF-AUDIO-01', 'CLF-AUDIO-02', 'CLF-AUDIO-03']);
  });

  it('résume la semaine de la tâche W01-C4 (objectif 3 écoutes)', () => {
    const s = summarizeTaskListening(episodes, 'CLF-AUDIO-01 à CLF-AUDIO-06', 1)!;
    expect(s.weekTotal).toBe(14);
    expect(s.goalTotal).toBe(18);
    expect(s.later.length).toBe(4);
  });
});

describe('programme d\'écoute aligné sur le planning (D-25)', () => {
  it('écoute 1 de chaque épisode dans la semaine de la tâche qui le cite', async () => {
    const planning = (await import('../../data/planning_hebdo.json')).default as unknown as {
      weeks: Array<{ week: number; tasks: Array<{ type: string; title: string }> }>;
    };
    const firstWeek = new Map<string, number>();
    for (const w of planning.weeks) {
      for (const t of w.tasks) {
        if ((t.type === 'podcast' || t.type === 'dbt_learn') && t.title.includes('Podcasts')) {
          for (const id of extractEpisodeIds(t.title)) if (!firstWeek.has(id)) firstWeek.set(id, w.week);
        }
      }
    }
    for (const ep of episodes) {
      expect(firstWeek.get(ep.id), ep.id).toBe(ep.primary_week);
      expect(parseScheduleDays(ep)[0].week, ep.id).toBe(ep.primary_week);
    }
  });
});
