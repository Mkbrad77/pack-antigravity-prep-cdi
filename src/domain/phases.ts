import { CertCode } from './types';

/**
 * Découpage du parcours en phases (D-25, planning recalé sur les vraies durées Udemy).
 * Examens : CLF-C02 le vendredi 11/12/2026 (S5), dbt le vendredi 22/01/2027 (S11),
 * DEA-C01 le vendredi 26/03/2027 (S20). Chaque nouvelle préparation démarre le week-end
 * qui suit l'examen précédent, d'où les semaines partagées S5 et S11.
 */
export interface CertPhase {
  code: CertCode;
  fromWeek: number;
  toWeek: number;
  examWeek: number;
  /** Libellé court affiché dans l'interface, par exemple « S1 à S5 ». */
  label: string;
}

export const CERT_PHASES: Record<CertCode, CertPhase> = {
  'CLF-C02': { code: 'CLF-C02', fromWeek: 1, toWeek: 5, examWeek: 5, label: 'S1 à S5' },
  DBT: { code: 'DBT', fromWeek: 5, toWeek: 11, examWeek: 11, label: 'S5 à S11' },
  'DEA-C01': { code: 'DEA-C01', fromWeek: 11, toWeek: 20, examWeek: 20, label: 'S11 à S20' },
};

/** Semaines de réserve après le dernier examen. */
export const RESERVE_PHASE = { fromWeek: 21, toWeek: 22, label: 'S21 à S22' };

/** Dates d'examen par défaut (réglages), alignées sur le planning. */
export const DEFAULT_EXAM_DATES: Record<CertCode, string> = {
  'CLF-C02': '2026-12-11',
  DBT: '2027-01-22',
  'DEA-C01': '2027-03-26',
};

/** Certification dont la préparation occupe la semaine (la semaine d'examen reste à l'examen en cours). */
export function certForWeek(week: number): CertCode {
  if (week <= CERT_PHASES['CLF-C02'].examWeek) return 'CLF-C02';
  if (week <= CERT_PHASES.DBT.examWeek) return 'DBT';
  return 'DEA-C01';
}

/** Ajoute des jours à une date ISO (AAAA-MM-JJ) sans dépendre du fuseau horaire. */
export function addDaysIso(dateIso: string, days: number): string {
  const [y, m, d] = dateIso.split('-').map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, (d || 1) + days)).toISOString().slice(0, 10);
}

/** Date au format « 22 janvier 2027 ». */
export function formatLongFrDate(dateIso: string): string {
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const [y, m, d] = dateIso.split('-').map(Number);
  return `${d} ${months[(m || 1) - 1]} ${y}`;
}
