/**
 * Date de reference de l'application.
 *
 * - Par defaut : la vraie date du jour (fuseau Europe/Paris), donc l'appli avance seule
 *   de semaine en semaine, sur PC comme sur mobile.
 * - Avant le depart du parcours (lundi 9 novembre 2026), on affiche le jour du depart.
 * - Si une date simulee est renseignee dans les Reglages, elle est prioritaire (mode test).
 */
export const PROGRAM_START_ISO = '2026-11-09';

export function getRealTodayIso(now: Date = new Date()): string {
  try {
    // Le format fr-CA donne directement AAAA-MM-JJ
    return new Intl.DateTimeFormat('fr-CA', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

export function getEffectiveTodayIso(
  settings: { simulated_today?: string | null } | null | undefined,
  now: Date = new Date()
): string {
  const simulated = settings?.simulated_today?.trim();
  if (simulated && /^\d{4}-\d{2}-\d{2}$/.test(simulated)) return simulated;
  const real = getRealTodayIso(now);
  return real < PROGRAM_START_ISO ? PROGRAM_START_ISO : real;
}
