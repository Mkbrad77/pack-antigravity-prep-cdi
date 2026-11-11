import { PodcastEpisode } from './types';

// Programme d'écoute des podcasts, déduit du champ `schedule_days` du catalogue
// (data/podcasts_catalog.json). Aucune donnée n'est inventée : on ne fait que
// lire le texte existant ("Semaine 1 : Lundi (Écoute 1), Jeudi (Écoute 2)...").

/** Objectif retenu par Auren : 3 écoutes par épisode. */
export const LISTEN_GOAL = 3;

export const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
export const DAY_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

/** Jour de la veille de l'examen (examens le vendredi : CLF S5, dbt S11, DEA S20). */
const EXAM_EVE_DAY = 3; // jeudi

export interface ScheduledListen {
  episodeId: string;
  week: number;
  /** 0 = lundi ... 6 = dimanche ; null = « dans la semaine », jour libre. */
  day: number | null;
  /** Numéro de l'écoute (1, 2, 3, puis 4 pour un rappel supplémentaire). */
  listen: number;
  /** Écoute au-delà de l'objectif de 3 (rappel facultatif avant l'examen). */
  bonus: boolean;
  label: string;
}

const DAY_RE = /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/i;

export function parseScheduleDays(episode: Pick<PodcastEpisode, 'id' | 'schedule_days' | 'primary_week'>): ScheduledListen[] {
  const text = episode.schedule_days || '';
  const segments = text.split(/\s*(?:,|\+|&)\s*/).filter((s) => s.trim().length > 0);
  const out: ScheduledListen[] = [];
  let currentWeek = episode.primary_week;
  let nextListen = 1;

  for (const seg of segments) {
    const weekMatch = seg.match(/semaine\s+(\d{1,2})/i);
    if (weekMatch) currentWeek = Number(weekMatch[1]);
    const dayMatch = seg.match(DAY_RE);
    const listenMatch = seg.match(/[ée]coute\s+(\d)/i);
    const isEve = /veille/i.test(seg);
    const isReminder = /rappel/i.test(seg) || (!dayMatch && !listenMatch);

    if (!dayMatch && !listenMatch && !isEve && !isReminder) continue;

    let day: number | null = null;
    if (dayMatch) {
      day = DAY_NAMES.findIndex((d) => d.toLowerCase() === dayMatch[1].toLowerCase());
    } else if (isEve) {
      day = EXAM_EVE_DAY;
    }

    const listen = listenMatch ? Number(listenMatch[1]) : nextListen;
    nextListen = Math.max(nextListen, listen) + 1;

    out.push({
      episodeId: episode.id,
      week: currentWeek,
      day,
      listen,
      bonus: listen > LISTEN_GOAL,
      label: isEve ? "veille d'examen" : !dayMatch ? 'rappel' : '',
    });
  }
  return out;
}

export function buildListeningPlan(episodes: PodcastEpisode[]): ScheduledListen[] {
  return episodes.flatMap((ep) => parseScheduleDays(ep));
}

export function isListenDone(item: ScheduledListen, episodes: PodcastEpisode[]): boolean {
  const ep = episodes.find((e) => e.id === item.episodeId);
  return (ep?.listen_count || 0) >= item.listen;
}

/** Lundi = 0 ... dimanche = 6, à partir d'une date ISO (AAAA-MM-JJ). */
export function weekdayIndex(dateIso: string): number {
  const d = new Date(`${dateIso}T12:00:00Z`);
  return (d.getUTCDay() + 6) % 7;
}

export interface TodayListening {
  today: ScheduledListen[];
  overdue: ScheduledListen[];
  flexible: ScheduledListen[];
  nextPlanned: ScheduledListen | null;
}

/** Écoutes du jour, en retard et « dans la semaine » pour la semaine et le jour donnés. */
export function getTodayListening(
  episodes: PodcastEpisode[],
  week: number,
  day: number
): TodayListening {
  const plan = buildListeningPlan(episodes).filter((i) => !i.bonus || i.week === week);
  const notDone = (i: ScheduledListen) => !isListenDone(i, episodes);
  const order = (a: ScheduledListen, b: ScheduledListen) =>
    a.week - b.week || (a.day ?? 7) - (b.day ?? 7) || a.episodeId.localeCompare(b.episodeId);

  const today = plan.filter((i) => i.week === week && i.day === day).sort(order);
  const overdue = plan
    .filter((i) => i.day !== null && (i.week < week || (i.week === week && (i.day as number) < day)))
    .filter((i) => !i.bonus)
    .filter(notDone)
    .sort(order);
  const flexible = plan
    .filter((i) => (i.day === null && i.week === week) || (i.day === null && i.week < week && !i.bonus))
    .filter(notDone)
    .sort(order);
  const nextPlanned =
    plan
      .filter((i) => i.day !== null && (i.week > week || (i.week === week && (i.day as number) > day)))
      .filter(notDone)
      .sort(order)[0] || null;

  return { today, overdue, flexible, nextPlanned };
}

/** Épisodes cités par une tâche (« CLF-AUDIO-01 à CLF-AUDIO-06 », « DEA-AUDIO-07, 09 & 10 »...). */
export function extractEpisodeIds(text: string): string[] {
  const ids: string[] = [];
  const re = /(CLF|DBT|DEA)-AUDIO-(\d{1,2})/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const prefix = m[1].toUpperCase();
    let last = Number(m[2]);
    ids.push(`${prefix}-AUDIO-${String(last).padStart(2, '0')}`);
    // Suite éventuelle : « à 06 », « , 09 & 10 », « & DEA-AUDIO-08 »
    const rest = text.slice(re.lastIndex);
    const tail = rest.match(/^((?:\s*(?:à|a|,|&|et)\s*(?:(?:CLF|DBT|DEA)-AUDIO-)?\d{1,2})*)/i)?.[1] || '';
    const tokens = [...tail.matchAll(/\s*(à|a|,|&|et)\s*(?:(?:CLF|DBT|DEA)-AUDIO-)?(\d{1,2})/gi)];
    for (const t of tokens) {
      const n = Number(t[2]);
      if (/^(à|a)$/i.test(t[1])) {
        for (let k = last + 1; k <= n; k++) ids.push(`${prefix}-AUDIO-${String(k).padStart(2, '0')}`);
      } else {
        ids.push(`${prefix}-AUDIO-${String(n).padStart(2, '0')}`);
      }
      last = n;
    }
    re.lastIndex += tail.length;
  }
  return Array.from(new Set(ids));
}

export interface WeekListeningSummary {
  episodeIds: string[];
  /** Écoutes prévues dans la semaine de la tâche, par jour (index 0 à 6), plus « jour libre ». */
  byDay: ScheduledListen[][];
  flexible: ScheduledListen[];
  /** Écoutes prévues plus tard (rappels) pour ces épisodes. */
  later: ScheduledListen[];
  weekDone: number;
  weekTotal: number;
  goalDone: number;
  goalTotal: number;
}

export function summarizeTaskListening(
  episodes: PodcastEpisode[],
  taskText: string,
  week: number
): WeekListeningSummary | null {
  const ids = extractEpisodeIds(taskText).filter((id) => episodes.some((e) => e.id === id));
  if (ids.length === 0) return null;
  const plan = buildListeningPlan(episodes.filter((e) => ids.includes(e.id))).filter((i) => !i.bonus);
  const inWeek = plan.filter((i) => i.week === week);
  const byDay: ScheduledListen[][] = DAY_NAMES.map((_, d) => inWeek.filter((i) => i.day === d));
  const flexible = inWeek.filter((i) => i.day === null);
  const later = plan.filter((i) => i.week > week);
  const weekDone = inWeek.filter((i) => isListenDone(i, episodes)).length;
  const goalDone = ids.reduce((acc, id) => {
    const ep = episodes.find((e) => e.id === id);
    return acc + Math.min(LISTEN_GOAL, ep?.listen_count || 0);
  }, 0);
  return {
    episodeIds: ids,
    byDay,
    flexible,
    later,
    weekDone,
    weekTotal: inWeek.length,
    goalDone,
    goalTotal: ids.length * LISTEN_GOAL,
  };
}

export function shortEpisodeLabel(id: string): string {
  return id.replace(/-AUDIO-/, ' ');
}

export function listenLabel(n: number): string {
  return n === 1 ? '1re écoute' : `${n}e écoute`;
}
