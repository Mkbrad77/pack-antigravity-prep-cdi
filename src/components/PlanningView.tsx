import React, { useMemo, useState } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { AppStateResponse, RescheduleApiResponse } from '../apiClient';
import { PodcastEpisode, UnifiedTask } from '../domain/types';
import { RescheduleTrigger } from '../domain/rescheduler';
import { TaskNavigationTarget } from '../domain/taskNavigation';
import { certColor } from '../ui/navigation';
import { TaskCard } from './TaskCard';

interface PlanningViewProps {
  state: AppStateResponse;
  currentWeek?: number;
  lastRescheduleReport: RescheduleApiResponse['rescheduleReport'] | null;
  onCompleteTask: (task: UnifiedTask) => Promise<void>;
  onReopenTask: (task: UnifiedTask) => Promise<void>;
  onEditTaskDuration: (task: UnifiedTask, newDurationMin: number) => Promise<void>;
  onSkipBonusTask: (task: UnifiedTask) => Promise<void>;
  onTriggerReschedule: (trigger: RescheduleTrigger) => Promise<void>;
  onNavigateToTarget: (target: TaskNavigationTarget) => void;
  todayDay?: number;
  activeEpisodeId?: string | null;
  onPlayQueue?: (episode: PodcastEpisode, queue: string[]) => void;
}

type PeriodFilter = 'ALL' | 'CLF' | 'DBT' | 'DEA' | 'RESERVE';
type CategoryFilter = 'ALL' | 'certification' | 'interview';
type PriorityFilter = 'ALL' | 'core' | 'bonus';

const PERIODS: Array<{ id: PeriodFilter; label: string; from: number; to: number; color?: string }> = [
  { id: 'ALL', label: 'Toutes', from: 1, to: 99 },
  { id: 'CLF', label: 'CLF-C02 (S1 à S3)', from: 1, to: 3, color: 'CLF-C02' },
  { id: 'DBT', label: 'dbt (S4 à S9)', from: 4, to: 9, color: 'DBT' },
  { id: 'DEA', label: 'DEA-C01 (S10 à S19)', from: 10, to: 19, color: 'DEA-C01' },
  { id: 'RESERVE', label: 'Réserve (S20 à S22)', from: 20, to: 99 },
];

function weekColor(week: number): string {
  if (week <= 3) return certColor('CLF-C02');
  if (week <= 9) return certColor('DBT');
  if (week <= 19) return certColor('DEA-C01');
  return 'var(--text-muted)';
}

function formatShortDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
      new Date(`${iso}T12:00:00Z`)
    );
  } catch {
    return iso;
  }
}

export const PlanningView: React.FC<PlanningViewProps> = ({
  state,
  currentWeek = 1,
  lastRescheduleReport,
  onCompleteTask,
  onReopenTask,
  onEditTaskDuration,
  onSkipBonusTask,
  onTriggerReschedule,
  onNavigateToTarget,
  todayDay,
  activeEpisodeId,
  onPlayQueue,
}) => {
  const [period, setPeriod] = useState<PeriodFilter>('ALL');
  const [category, setCategory] = useState<CategoryFilter>('ALL');
  const [priority, setPriority] = useState<PriorityFilter>('ALL');
  const [missedWeekInput, setMissedWeekInput] = useState<number>(currentWeek);
  // Contenu des semaines rendu à l'ouverture seulement (page légère)
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(() => new Set([currentWeek]));
  const setWeekOpen = (week: number, isOpen: boolean) =>
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(week);
      else next.delete(week);
      return next;
    });

  const weeks = state.staticData.planningHebdo.weeks;
  const periodDef = PERIODS.find((p) => p.id === period) || PERIODS[0];
  const visibleWeeks = weeks.filter((w) => w.week >= periodDef.from && w.week <= periodDef.to);

  const filterTask = (t: UnifiedTask): boolean => {
    if (category !== 'ALL' && t.category !== category) return false;
    if (priority !== 'ALL' && t.priority !== priority) return false;
    return true;
  };

  const tasksByWeek = useMemo(() => {
    const map: Record<number, UnifiedTask[]> = {};
    for (const t of state.tasks) {
      (map[t.target_week] ||= []).push(t);
    }
    return map;
  }, [state.tasks]);

  return (
    <div data-testid="planning-view" className="stack">
      {/* Filtres : puces visibles au lieu de menus déroulants */}
      <section className="card" aria-label="Filtres du planning">
        <div className="stack-sm" style={{ gap: '0.75rem' }}>
          <div>
            <div className="eyebrow" id="filter-period-label" style={{ marginBottom: '0.35rem' }}>Période</div>
            <div className="chips scroll" role="group" aria-labelledby="filter-period-label">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="chip"
                  aria-pressed={period === p.id}
                  onClick={() => setPeriod(p.id)}
                  style={p.color ? ({ ['--cert-color' as string]: certColor(p.color) } as React.CSSProperties) : undefined}
                >
                  {p.color && <span className="cert-dot" aria-hidden="true" />}
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <details className="disclosure" style={{ background: 'transparent' }}>
            <summary style={{ minHeight: '44px', padding: '0.4rem 0.75rem' }}>
              Plus de filtres
              {(category !== 'ALL' || priority !== 'ALL') && <span className="badge badge-info">actifs</span>}
              <ChevronDown size={18} className="chevron" aria-hidden />
            </summary>
            <div className="disclosure-body">
          <div className="cluster" style={{ gap: '1rem', alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow" id="filter-cat-label" style={{ marginBottom: '0.35rem' }}>Volet</div>
              <div className="segmented" role="group" aria-labelledby="filter-cat-label">
                {([
                  ['ALL', 'Tout'],
                  ['certification', 'Certifications'],
                  ['interview', 'Entretiens'],
                ] as Array<[CategoryFilter, string]>).map(([id, label]) => (
                  <button key={id} type="button" className="segment" aria-pressed={category === id} onClick={() => setCategory(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="eyebrow" id="filter-prio-label" style={{ marginBottom: '0.35rem' }}>Priorité</div>
              <div className="segmented" role="group" aria-labelledby="filter-prio-label">
                {([
                  ['ALL', 'Tout'],
                  ['core', 'Obligatoire'],
                  ['bonus', 'Bonus'],
                ] as Array<[PriorityFilter, string]>).map(([id, label]) => (
                  <button key={id} type="button" className="segment" aria-pressed={priority === id} onClick={() => setPriority(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
            </div>
          </details>
        </div>
      </section>

      {lastRescheduleReport && (
        <div data-testid="reschedule-explanation-box" className="alert alert-info" role="status">
          <strong>
            Dernière replanification ({lastRescheduleReport.changes.length} ajustement
            {lastRescheduleReport.changes.length > 1 ? 's' : ''}) :
          </strong>
          <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.25rem' }}>
            {lastRescheduleReport.explanationFr.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Les semaines : seule la semaine en cours est ouverte par défaut */}
      <section aria-labelledby="weeks-heading" className="stack-sm">
        <h2 id="weeks-heading" className="sr-only">Semaines du programme</h2>
        {visibleWeeks.map((week) => {
          const wSummary = state.weekSummaries[week.week];
          const allWeekTasks = tasksByWeek[week.week] || [];
          const activeTasks = allWeekTasks.filter((t) => t.status !== 'skipped');
          const completedMin = activeTasks
            .filter((t) => t.status === 'done')
            .reduce((sum, t) => sum + t.effective_est_min, 0);
          const plannedMin = wSummary?.totalActiveMinutes ?? 0;
          const pct = plannedMin > 0 ? Math.min(100, Math.round((completedMin / plannedMin) * 100)) : 0;
          const doneCount = activeTasks.filter((t) => t.status === 'done').length;
          const wTasks = allWeekTasks.filter(filterTask);
          const isCurrent = week.week === currentWeek;
          const isOver = Boolean(wSummary && wSummary.totalActiveMinutes > wSummary.maxMinutes);

          return (
            <details
              key={week.week}
              data-testid={`planning-week-card-${week.week}`}
              className="disclosure"
              open={openWeeks.has(week.week)}
              onToggle={(e) => setWeekOpen(week.week, (e.currentTarget as HTMLDetailsElement).open)}
              style={{ ['--cert-color' as string]: weekColor(week.week), borderLeft: '4px solid var(--cert-color)' } as React.CSSProperties}
            >
              <summary style={{ alignItems: 'flex-start', flexWrap: 'wrap', rowGap: '0.4rem' }}>
                <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: '1 1 260px', gap: '0.15rem' }}>
                  <span className="cluster" style={{ gap: '0.45rem' }}>
                    <strong>Semaine {week.week}</strong>
                    <span className="muted small" style={{ fontWeight: 500 }}>
                      {formatShortDate(week.start)} au {formatShortDate(week.end)}
                    </span>
                    {isCurrent && <span className="badge badge-info">En cours</span>}
                    {week.exam && <span className="badge badge-danger">Examen</span>}
                    {week.light_week && <span className="badge badge-warning">Allégée, 6 h max</span>}
                  </span>
                  <span className="text-secondary small" style={{ fontWeight: 500 }}>{week.phase}</span>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '150px', flex: '0 1 220px' }}>
                  <span className="row-between small" style={{ fontWeight: 500 }}>
                    <span className="mono">
                      {doneCount}/{activeTasks.length} tâches
                    </span>
                    <span className={`mono ${isOver ? '' : 'muted'}`} style={isOver ? { color: 'var(--danger-fg)' } : undefined}>
                      {plannedMin}/{wSummary?.maxMinutes ?? 600} min
                    </span>
                  </span>
                  <span className="progress-track" style={{ display: 'block', margin: 0 }} aria-hidden="true">
                    <span className="progress-fill" style={{ display: 'block', width: `${pct}%`, background: 'var(--accent-green)' }} />
                  </span>
                </span>
                <ChevronDown size={18} className="chevron" aria-hidden style={{ alignSelf: 'center' }} />
              </summary>
              {openWeeks.has(week.week) && (
              <div className="disclosure-body stack-sm">
                <p className="muted small" style={{ margin: 0 }}>
                  {week.theme}
                  {week.checkpoint ? `. Point de contrôle : ${week.checkpoint}` : ''}
                  {week.exam ? `. Examen : ${week.exam}` : ''}
                </p>
                {wTasks.length === 0 ? (
                  <div className="empty-state">Aucune tâche ne correspond aux filtres cette semaine.</div>
                ) : (
                  <div className="task-list">
                    {wTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        variant="planning"
                        onComplete={onCompleteTask}
                        onReopen={onReopenTask}
                        onPostpone={(t) =>
                          onTriggerReschedule({ type: 'postpone_task', taskId: t.id, fromWeek: t.target_week })
                        }
                        onSkip={onSkipBonusTask}
                        onNavigate={onNavigateToTarget}
                        onEditDuration={onEditTaskDuration}
                        podcasts={state.podcasts || []}
                        todayWeek={currentWeek}
                        todayDay={todayDay}
                        activeEpisodeId={activeEpisodeId}
                        onPlayQueue={onPlayQueue}
                      />
                    ))}
                  </div>
                )}
              </div>
              )}
            </details>
          );
        })}
      </section>

      {/* Replanification : outil occasionnel, replié par défaut */}
      <details className="disclosure" data-testid="reschedule-console">
        <summary>
          <RefreshCw size={18} aria-hidden />
          Replanifier en cas d'imprévu
          <ChevronDown size={18} className="chevron" aria-hidden />
        </summary>
        <div className="disclosure-body stack">
          <p className="text-secondary small" style={{ margin: 0 }}>
            Règles appliquées : plafond de 11 h par semaine (660 min), 6 h (360 min) en semaine allégée, les tâches bonus
            sont sacrifiées en premier, l'examen le plus proche est protégé (CLF-C02 en S3, dbt en S9, DEA-C01 en S19) et
            les tâches peuvent être comprimées à 50 %. Aucun effet domino sur les 22 semaines.
          </p>
          <div className="grid-2">
            <div className="card card-sm">
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.98rem' }}>Semaine manquée ou maladie</h3>
              <div className="cluster">
                <label className="sr-only" htmlFor="missed-week-select">Semaine manquée</label>
                <select
                  id="missed-week-select"
                  data-testid="missed-week-select"
                  value={missedWeekInput}
                  onChange={(e) => setMissedWeekInput(Number(e.target.value))}
                >
                  {weeks.map((w) => (
                    <option key={w.week} value={w.week}>
                      Semaine {w.week} ({formatShortDate(w.start)})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  data-testid="btn-trigger-missed-week"
                  className="btn btn-warning btn-sm"
                  onClick={() => onTriggerReschedule({ type: 'missed_week', week: missedWeekInput })}
                >
                  Replanifier S{missedWeekInput}
                </button>
              </div>
            </div>
            <div className="card card-sm">
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.98rem' }}>Scénarios d'examen dbt (S9) et fatigue</h3>
              <div className="cluster">
                <button
                  type="button"
                  data-testid="btn-postpone-clf-exam"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onTriggerReschedule({ type: 'low_mock_score', week: 9, certCode: 'DBT', scorePct: 72 })}
                >
                  Blanc dbt sous 80 % : examen décalé au 15 janv.
                </button>
                <button
                  type="button"
                  data-testid="btn-dea-retry-14d"
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    onTriggerReschedule({
                      type: 'exam_failure',
                      week: 10,
                      certCode: 'DBT',
                      rawScore: 62,
                      failedDateIso: '2027-01-08',
                    })
                  }
                >
                  Échec dbt : nouvelle tentative à J+14
                </button>
                <button
                  type="button"
                  data-testid="btn-exam-fatigue"
                  className="btn btn-warning btn-sm"
                  onClick={() => onTriggerReschedule({ type: 'exam_week_fatigue', week: 9 })}
                >
                  Fatigue en semaine d'examen dbt (S9)
                </button>
                <button
                  type="button"
                  data-testid="btn-enforce-light"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onTriggerReschedule({ type: 'enforce_light_week', week: 8 })}
                >
                  Forcer la semaine allégée (S8, 6 h max)
                </button>
              </div>
            </div>
          </div>
        </div>
      </details>

      {/* Historique */}
      <details className="disclosure">
        <summary>
          Historique des modifications
          <span className="badge badge-neutral">{state.taskHistory.length}</span>
          <ChevronDown size={18} className="chevron" aria-hidden />
        </summary>
        <div className="disclosure-body">
          {state.taskHistory.length === 0 ? (
            <p className="muted" style={{ margin: 0 }}>Aucune modification enregistrée pour le moment.</p>
          ) : (
            <div className="table-scroll" style={{ maxHeight: '320px' }} tabIndex={0} role="region" aria-label="Historique des modifications du planning">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Tâche</th>
                    <th scope="col">Action</th>
                    <th scope="col">Semaines</th>
                    <th scope="col">Durée</th>
                    <th scope="col">Motif</th>
                  </tr>
                </thead>
                <tbody>
                  {state.taskHistory.slice(0, 40).map((h) => (
                    <tr key={h.id}>
                      <td className="mono small">{h.created_at.slice(0, 16).replace('T', ' ')}</td>
                      <td className="mono">{h.task_id}</td>
                      <td>
                        <span className="badge badge-neutral">{h.action}</span>
                      </td>
                      <td className="mono">
                        S{h.from_week} vers S{h.to_week}
                      </td>
                      <td className="mono">
                        {h.old_duration_min} vers {h.new_duration_min} min
                      </td>
                      <td>{h.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </details>
    </div>
  );
};
