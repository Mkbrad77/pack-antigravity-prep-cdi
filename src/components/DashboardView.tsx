import React, { useMemo } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Layers,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import { AppStateResponse, RescheduleApiResponse } from '../apiClient';
import { CertCode, PodcastEpisode, UnifiedTask } from '../domain/types';
import { getTaskActionGuide, TaskNavigationTarget } from '../domain/taskNavigation';
import { getEffectiveTodayIso } from '../domain/dates';
import { certColor, CERT_SHORT_LABEL } from '../ui/navigation';
import { TaskCard } from './TaskCard';
import { TodayListeningCard } from './ListeningPlan';
import { weekdayIndex } from '../domain/podcastSchedule';
import { CERT_PHASES } from '../domain/phases';

interface DashboardViewProps {
  state: AppStateResponse;
  activeWeek: number;
  currentWeek?: number;
  setActiveWeek: (week: number) => void;
  lastRescheduleReport?: RescheduleApiResponse['rescheduleReport'] | null;
  onDismissRescheduleReport?: () => void;
  onCompleteTask: (task: UnifiedTask) => Promise<void>;
  onReopenTask: (task: UnifiedTask) => Promise<void>;
  onPostponeTask: (taskId: string, fromWeek: number) => Promise<void>;
  onSkipBonusTask: (task: UnifiedTask) => Promise<void>;
  onUpdateSimulatedDate: (dateIso: string) => Promise<void>;
  onNavigateToTarget: (target: TaskNavigationTarget) => void;
  onResumePodcast?: (episode: PodcastEpisode) => void;
  onPlayQueue?: (episode: PodcastEpisode, queue: string[]) => void;
  onMarkListened?: (episode: PodcastEpisode) => void;
  activeEpisodeId?: string | null;
}

const WEEKDAYS_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const CERT_ORDER: CertCode[] = ['CLF-C02', 'DBT', 'DEA-C01'];
const CERT_WEEKS: Record<CertCode, string> = {
  'CLF-C02': CERT_PHASES['CLF-C02'].label,
  DBT: CERT_PHASES.DBT.label,
  'DEA-C01': CERT_PHASES['DEA-C01'].label,
};

function daysBetween(fromIso: string, toIso: string): number {
  const d1 = new Date(`${fromIso}T00:00:00Z`).getTime();
  const d2 = new Date(`${toIso}T00:00:00Z`).getTime();
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}

function formatLongDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${iso}T12:00:00Z`));
  } catch {
    return iso;
  }
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

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  activeWeek,
  currentWeek,
  setActiveWeek,
  lastRescheduleReport,
  onDismissRescheduleReport,
  onCompleteTask,
  onReopenTask,
  onPostponeTask,
  onSkipBonusTask,
  onNavigateToTarget,
  onResumePodcast,
  onPlayQueue,
  onMarkListened,
  activeEpisodeId,
}) => {
  const todayIso = getEffectiveTodayIso(state.settings);
  const weeks = state.staticData.planningHebdo.weeks;
  const totalWeeks = weeks.length;
  const weekMeta = weeks.find((w) => w.week === activeWeek);
  const weekSummary = state.weekSummaries[activeWeek];
  const thisWeek = currentWeek ?? activeWeek;
  const isCurrentWeek = activeWeek === thisWeek;
  const todayWeekday = WEEKDAYS_FR[new Date(`${todayIso}T12:00:00Z`).getUTCDay()];
  const todayDayIndex = weekdayIndex(todayIso);
  const podcasts = state.podcasts || [];
  const playQueue = (ep: PodcastEpisode, queue: string[]) => (onPlayQueue ? onPlayQueue(ep, queue) : onResumePodcast?.(ep));
  const podcastProps = {
    podcasts,
    todayWeek: thisWeek,
    todayDay: todayDayIndex,
    activeEpisodeId,
    onPlayQueue: playQueue,
  };

  const weekTasks = state.tasks.filter((t) => t.target_week === activeWeek && t.status !== 'skipped');
  const openTasks = weekTasks.filter((t) => t.status !== 'done');
  const coreTasks = weekTasks.filter((t) => t.priority === 'core');
  const bonusTasks = weekTasks.filter((t) => t.priority === 'bonus');

  const completedTasksMin = weekTasks
    .filter((t) => t.status === 'done')
    .reduce((acc, t) => acc + t.effective_est_min, 0);
  const weekSessionsMin = state.studySessions
    .filter((s) => s.week_number === activeWeek)
    .reduce((acc, s) => acc + s.duration_min, 0);

  const capMin = weekSummary?.maxMinutes ?? 600;
  const plannedMin = weekSummary?.totalActiveMinutes ?? 0;
  const isOverloaded = Boolean(weekSummary && weekSummary.totalActiveMinutes > weekSummary.maxMinutes);
  const donePct = plannedMin > 0 ? Math.min(100, Math.round((completedTasksMin / plannedMin) * 100)) : 0;

  // « À faire maintenant » : d'abord la tâche conseillée aujourd'hui, sinon la prochaine tâche obligatoire
  const focus = useMemo(() => {
    if (openTasks.length === 0) return null;
    const scored = openTasks.map((t, idx) => {
      const day = getTaskActionGuide(t).recommendedDay.toLowerCase();
      const isToday = isCurrentWeek && day.includes(todayWeekday);
      return { t, score: (isToday ? 0 : 10) + (t.priority === 'core' ? 0 : 5) + idx / 1000, isToday };
    });
    scored.sort((a, b) => a.score - b.score);
    return scored[0];
  }, [openTasks, isCurrentWeek, todayWeekday]);

  const nextExamCode = CERT_ORDER.find((c) => daysBetween(todayIso, state.settings.exam_dates[c]) >= 0) || 'DEA-C01';

  const podcastToResume = useMemo(() => {
    const ready = (state.podcasts || []).filter((p) => p.file_exists);
    const inProgress = ready.find((p) => (p.last_position_sec || 0) > 5 && p.id !== activeEpisodeId);
    return inProgress ? { ep: inProgress, resume: true } : null;
  }, [state.podcasts, activeEpisodeId]);

  const contractEndDays = daysBetween(todayIso, '2027-04-02');
  const dueCards = state.dueFlashcards.length;

  const renderTask = (task: UnifiedTask) => (
    <TaskCard
      key={task.id}
      task={task}
      variant="dashboard"
      onComplete={onCompleteTask}
      onReopen={onReopenTask}
      onPostpone={(t) => onPostponeTask(t.id, activeWeek)}
      onSkip={onSkipBonusTask}
      onNavigate={onNavigateToTarget}
      postponeLabel={`Reporter en S${Math.min(totalWeeks, activeWeek + 1)}`}
      {...podcastProps}
    />
  );

  return (
    <div data-testid="dashboard-view" className="stack">
      {lastRescheduleReport && (
        <div data-testid="dashboard-reschedule-banner" className="alert alert-info" role="status">
          <div className="row-between">
            <strong>Planning ajusté automatiquement</strong>
            <button type="button" className="icon-btn" aria-label="Masquer l'explication" onClick={onDismissRescheduleReport}>
              <X size={18} aria-hidden />
            </button>
          </div>
          <ul style={{ margin: '0.35rem 0 0 0', paddingLeft: '1.25rem' }}>
            {lastRescheduleReport.explanationFr.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {/* En-tête de la semaine : date, navigation et progression */}
      <section className="hero-card" aria-labelledby="dashboard-week-heading">
        <div className="row-between" style={{ alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ minWidth: 0, flex: '1 1 320px' }}>
            <div className="eyebrow">
              {isCurrentWeek ? formatLongDate(todayIso) : `Du ${formatShortDate(weekMeta?.start || '')} au ${formatShortDate(weekMeta?.end || '')}`}
            </div>
            <h2 id="dashboard-week-heading" data-testid="dashboard-week-heading" style={{ margin: '0.3rem 0 0.2rem', fontSize: '1.35rem' }}>
              Semaine {activeWeek} <span className="muted" style={{ fontWeight: 500 }}>sur {totalWeeks}</span>
            </h2>
            <p className="text-secondary" style={{ margin: 0 }}>{weekMeta?.phase}</p>
            <span className="sr-only">
              Du {weekMeta?.start} au {weekMeta?.end}
            </span>
          </div>
          <div className="cluster">
            <div className="stepper" role="group" aria-label="Changer de semaine">
              <button
                type="button"
                className="icon-btn"
                aria-label="Semaine précédente"
                disabled={activeWeek <= 1}
                onClick={() => setActiveWeek(Math.max(1, activeWeek - 1))}
              >
                <ChevronLeft size={20} aria-hidden />
              </button>
              <span className="stepper-label" data-testid="week-selector" aria-live="polite">
                S{activeWeek}
              </span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Semaine suivante"
                disabled={activeWeek >= totalWeeks}
                onClick={() => setActiveWeek(Math.min(totalWeeks, activeWeek + 1))}
              >
                <ChevronRight size={20} aria-hidden />
              </button>
            </div>
            {!isCurrentWeek && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveWeek(thisWeek)}>
                Revenir à cette semaine
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: '1.1rem' }}>
          <div className="row-between small">
            <span>
              <strong className="mono" data-testid="week-completed-minutes">{completedTasksMin} min</strong>{' '}
              <span className="text-secondary">
                faites sur <span className="mono" data-testid="week-planned-minutes">{plannedMin} min</span> prévues
              </span>
            </span>
            <span className={`badge ${isOverloaded ? 'badge-danger' : weekSummary?.lightWeek ? 'badge-warning' : 'badge-neutral'}`}>
              {isOverloaded
                ? `Surcharge : plafond ${capMin} min`
                : weekSummary?.lightWeek
                  ? `Semaine allégée : ${capMin / 60} h max`
                  : `Plafond ${Math.round(capMin / 60)} h`}
            </span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Progression de la semaine"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={donePct}
            style={{ height: '10px' }}
          >
            <div className="progress-fill" style={{ width: `${donePct}%`, background: 'var(--accent-green)' }} />
          </div>
          <div className="muted small">
            {openTasks.length === 0
              ? 'Toutes les tâches de la semaine sont faites.'
              : `${openTasks.length} tâche${openTasks.length > 1 ? 's' : ''} restante${openTasks.length > 1 ? 's' : ''}`}
            {weekSessionsMin > 0 ? `, ${weekSessionsMin} min de séances enregistrées` : ''}
            {weekMeta?.checkpoint ? `. Objectif : ${weekMeta.checkpoint}` : ''}
          </div>
        </div>
      </section>

      <div className="layout-main-aside">
        <div className="stack" style={{ minWidth: 0 }}>
          {/* À faire maintenant */}
          {focus && (
            <section aria-labelledby="focus-heading">
              <div className="row-between" style={{ marginBottom: '0.5rem' }}>
                <h2 id="focus-heading" className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Sparkles size={18} aria-hidden style={{ color: 'var(--accent-indigo)' }} />
                  {focus.isToday ? 'À faire maintenant' : 'Prochaine tâche'}
                </h2>
              </div>
              <TaskCard
                task={focus.t}
                variant="dashboard"
                onComplete={onCompleteTask}
                onReopen={onReopenTask}
                onPostpone={(t) => onPostponeTask(t.id, activeWeek)}
                onSkip={onSkipBonusTask}
                onNavigate={onNavigateToTarget}
                postponeLabel={`Reporter en S${Math.min(totalWeeks, activeWeek + 1)}`}
                defaultGuideOpen
                {...podcastProps}
              />
            </section>
          )}

          {isCurrentWeek && (
            <TodayListeningCard
              episodes={podcasts}
              week={thisWeek}
              day={todayDayIndex}
              activeEpisodeId={activeEpisodeId}
              onPlayQueue={playQueue}
              onMarkListened={(ep) => onMarkListened?.(ep)}
              onOpenPodcasts={() => onNavigateToTarget({ tab: 'courses', coursesSubTab: 'podcasts', label: 'Podcasts' })}
            />
          )}

          {/* Tâches de la semaine */}
          <section aria-labelledby="week-tasks-heading">
            <h2 id="week-tasks-heading" className="section-title">
              Tâches de la semaine <span className="muted mono" style={{ fontWeight: 500 }}>{coreTasks.length + bonusTasks.length}</span>
            </h2>
            {coreTasks.length === 0 && bonusTasks.length === 0 && (
              <div className="empty-state">Aucune tâche prévue cette semaine.</div>
            )}
            <div className="task-list">
              {coreTasks.filter((t) => !focus || t.id !== focus.t.id).map(renderTask)}
            </div>
            {bonusTasks.filter((t) => !focus || t.id !== focus.t.id).length > 0 && (
              <details className="disclosure" style={{ marginTop: '0.75rem' }}>
                <summary>
                  Tâches bonus, sacrifiables en cas d'imprévu
                  <span className="badge badge-bonus">{bonusTasks.filter((t) => !focus || t.id !== focus.t.id).length}</span>
                  <ChevronDown size={18} className="chevron" aria-hidden />
                </summary>
                <div className="disclosure-body task-list">
                  {bonusTasks.filter((t) => !focus || t.id !== focus.t.id).map(renderTask)}
                </div>
              </details>
            )}
          </section>
        </div>

        <aside className="stack" aria-label="Examens et raccourcis">
          {/* Examens */}
          <section className="card" aria-labelledby="exams-heading">
            <h2 id="exams-heading" className="section-title">Examens</h2>
            <div className="stack-sm" style={{ gap: '0.9rem' }}>
              {CERT_ORDER.map((cert) => {
                const p = state.progress.certifications[cert];
                const r = state.readiness[cert];
                const days = daysBetween(todayIso, state.settings.exam_dates[cert]);
                const isNext = cert === nextExamCode;
                return (
                  <button
                    key={cert}
                    type="button"
                    className="item-card"
                    style={{ ['--cert-color' as string]: certColor(cert), gap: '0.4rem', padding: '0.75rem 0.85rem', background: isNext ? 'var(--bg-inset)' : 'transparent', borderColor: isNext ? 'var(--border-strong)' : 'var(--border-color)' } as React.CSSProperties}
                    onClick={() => onNavigateToTarget({ tab: 'certifications', certCode: cert, label: cert })}
                  >
                    <span className="row-between" style={{ width: '100%' }}>
                      <span className="cluster" style={{ gap: '0.45rem' }}>
                        <span className="cert-dot" aria-hidden="true" />
                        <strong>{CERT_SHORT_LABEL[cert]}</strong>
                        <span className="muted small">{CERT_WEEKS[cert]}</span>
                      </span>
                      <span className="mono" style={{ fontWeight: 750, fontSize: isNext ? '1.15rem' : '0.95rem' }}>
                        {days >= 0 ? `J-${days}` : 'Passé'}
                      </span>
                    </span>
                    <span className="progress-track" style={{ margin: '0.1rem 0', display: 'block' }} aria-hidden="true">
                      <span className="progress-fill" style={{ display: 'block', width: `${p.combinedWeightedPercent}%` }} />
                    </span>
                    <span className="row-between small" style={{ width: '100%' }}>
                      <span className="muted">
                        {formatShortDate(state.settings.exam_dates[cert])}, préparation{' '}
                        <strong className="mono" style={{ color: 'var(--text-primary)' }} data-testid={`cert-progress-pct-${cert}`}>
                          {p.combinedWeightedPercent} %
                        </strong>
                      </span>
                      <span
                        data-testid={`dashboard-readiness-${cert}`}
                        className={`badge ${r.isReady ? 'badge-success' : 'badge-neutral'}`}
                      >
                        {r.isReady ? 'Prêt' : 'En cours'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="muted small" style={{ margin: '0.85rem 0 0' }}>
              Fin du contrat d'alternance dans <strong className="mono">J-{contractEndDays}</strong> (2 avril 2027).
            </p>
          </section>

          {/* Reprise podcast */}
          {podcastToResume && (
            <section className="card" aria-labelledby="podcast-heading" style={{ ['--cert-color' as string]: certColor(podcastToResume.ep.cert_code) } as React.CSSProperties}>
              <h2 id="podcast-heading" className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Headphones size={18} aria-hidden /> {podcastToResume.resume ? 'Reprendre l\'écoute' : 'À écouter'}
              </h2>
              <div className="cluster" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
                <span className="player-cover" aria-hidden="true">
                  <Headphones size={20} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 650 }}>{podcastToResume.ep.title}</div>
                  <div className="muted small">
                    {podcastToResume.ep.id}, environ {podcastToResume.ep.duration_est_min} min
                  </div>
                </div>
              </div>
              <div className="cluster" style={{ marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => onResumePodcast?.(podcastToResume.ep)}>
                  <Play size={16} aria-hidden />
                  {podcastToResume.resume ? 'Reprendre' : 'Écouter'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => onNavigateToTarget({ tab: 'courses', coursesSubTab: 'podcasts', label: 'Podcasts' })}
                >
                  Tous les podcasts
                </button>
              </div>
            </section>
          )}

          {/* Révision espacée */}
          <section className="card" aria-labelledby="srs-heading">
            <h2 id="srs-heading" className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Layers size={18} aria-hidden /> Révision espacée
            </h2>
            <p className="text-secondary small" style={{ margin: '0 0 0.75rem' }}>
              {dueCards > 0
                ? `${dueCards} carte${dueCards > 1 ? 's' : ''} à revoir aujourd'hui.`
                : 'Aucune carte à revoir pour le moment.'}
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateToTarget({ tab: 'srs', label: 'Révision espacée' })}
            >
              Ouvrir la révision <ArrowRight size={16} aria-hidden />
            </button>
          </section>
        </aside>
      </div>

      {/* Mode d'emploi : replié par défaut */}
      <details className="disclosure">
        <summary>
          Mode d'emploi de la semaine
          <ChevronDown size={18} className="chevron" aria-hidden />
        </summary>
        <div className="disclosure-body text-secondary small">
          <ul style={{ margin: '0 0 0.75rem', paddingLeft: '1.2rem', lineHeight: 1.65 }}>
            <li>
              <strong>Lundi, mardi et jeudi soir :</strong> tâches certifications et Quickstarts Snowflake (
              <code>W{String(activeWeek).padStart(2, '0')}-C1</code> à <code>C4</code>) : cours Udemy, parcours learn.getdbt.com ou Quickstart Snowflake ML.
            </li>
            <li>
              <strong>Mercredi soir :</strong> première tâche entretiens (<code>W{String(activeWeek).padStart(2, '0')}-I1</code>) : cours puis 2 ou 3 exercices ciblés.
            </li>
            <li>
              <strong>Samedi matin :</strong> deuxième tâche entretiens (<code>W{String(activeWeek).padStart(2, '0')}-I2</code>) : Étape 1 (cours), puis Étape 2 (exercices déjà filtrés).
            </li>
            <li>
              <strong>Dimanche matin (tâche I3 ou bonus) :</strong> Quickstart Snowflake ML ou troisième tâche entretiens.
            </li>
          </ul>
          <p style={{ margin: '0 0 0.6rem' }}>
            Rythme : jusqu'à 11 h par semaine, 6 h maximum pendant les semaines allégées des fêtes (S7 et S8).
          </p>
          <div className="cluster">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigateToTarget({ tab: 'courses', coursesSubTab: 'snowflake_dbt', label: 'Snowflake' })}>
              Ressources Snowflake et dbt
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigateToTarget({ tab: 'interviews', interviewSubTab: 'courses', interviewCategory: 'python', label: 'Python' })}>
              Module 1 : Python
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigateToTarget({ tab: 'interviews', interviewSubTab: 'courses', interviewCategory: 'sql', label: 'SQL' })}>
              Module 2 : SQL
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigateToTarget({ tab: 'interviews', interviewSubTab: 'courses', interviewCategory: 'de', label: 'Data Engineering' })}>
              Module 3 : Data Engineering
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigateToTarget({ tab: 'interviews', interviewSubTab: 'courses', interviewCategory: 'aie', label: 'AI' })}>
              Module 4 : AI et RAG
            </button>
          </div>
        </div>
      </details>
    </div>
  );
};
