import { CertCode } from '../domain/types';
import { InterviewSubTabId, TaskNavigationTarget } from '../domain/taskNavigation';

// Les 5 destinations principales (barre du bas sur téléphone, rail sur PC)
// et les écrans secondaires rangés dans le menu profil.
export type Destination =
  | 'today'
  | 'planning'
  | 'cours'
  | 'pratique'
  | 'podcasts'
  | 'competences'
  | 'seances'
  | 'revision'
  | 'reglages';

export const PRIMARY_DESTINATIONS: Destination[] = ['today', 'planning', 'cours', 'pratique', 'podcasts'];

export const DESTINATION_LABELS: Record<Destination, string> = {
  today: "Aujourd'hui",
  planning: 'Planning',
  cours: 'Cours',
  pratique: 'Pratique',
  podcasts: 'Podcasts',
  competences: 'Compétences',
  seances: 'Journal des séances',
  revision: 'Révision espacée',
  reglages: 'Réglages',
};

export type CoursSection = CertCode | 'SNOWFLAKE' | 'UDEMY';
export type PratiqueSection = Exclude<InterviewSubTabId, 'competencies'>;

export interface ResolvedTarget {
  dest: Destination;
  coursSection?: CoursSection;
  pratiqueSection?: PratiqueSection;
}

// Traduit une cible de tâche (format historique, utilisé par le moteur de
// guidage) vers la nouvelle navigation à 5 entrées.
export function resolveTarget(target: TaskNavigationTarget): ResolvedTarget {
  switch (target.tab) {
    case 'dashboard':
      return { dest: 'today' };
    case 'planning':
      return { dest: 'planning' };
    case 'sessions':
      return { dest: 'seances' };
    case 'srs':
      return { dest: 'revision' };
    case 'settings':
      return { dest: 'reglages' };
    case 'certifications':
      return { dest: 'cours', coursSection: target.certCode || 'CLF-C02' };
    case 'courses':
      if (target.coursesSubTab === 'podcasts') return { dest: 'podcasts' };
      if (target.courseKey || target.coursesSubTab === 'udemy') {
        return { dest: 'cours', coursSection: 'UDEMY' };
      }
      return { dest: 'cours', coursSection: 'SNOWFLAKE' };
    case 'interviews':
      if (target.interviewSubTab === 'competencies') return { dest: 'competences' };
      return { dest: 'pratique', pratiqueSection: target.interviewSubTab || 'courses' };
    default:
      return { dest: 'today' };
  }
}

export const CERT_COLOR_VAR: Record<string, string> = {
  'CLF-C02': 'var(--cert-clf)',
  DBT: 'var(--cert-dbt)',
  'DEA-C01': 'var(--cert-dea)',
  SNOWFLAKE: 'var(--cert-snow)',
  UDEMY: 'var(--cert-udemy)',
  INTERVIEW: 'var(--cert-interview)',
};

export const CERT_SHORT_LABEL: Record<CertCode, string> = {
  'CLF-C02': 'AWS CLF-C02',
  DBT: 'dbt',
  'DEA-C01': 'AWS DEA-C01',
};

export function certColor(code?: string | null): string {
  if (!code) return 'var(--primary)';
  return CERT_COLOR_VAR[code] || 'var(--primary)';
}
