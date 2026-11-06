import React, { useState } from 'react';
import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  RotateCcw,
  SkipForward,
  Timer,
  Undo2,
} from 'lucide-react';
import { PodcastEpisode, UnifiedTask } from '../domain/types';
import { WeekListeningGrid } from './ListeningPlan';
import { getTaskActionGuide, TaskNavigationTarget } from '../domain/taskNavigation';
import { certColor } from '../ui/navigation';

export type TaskCardVariant = 'dashboard' | 'planning';

interface TaskCardProps {
  task: UnifiedTask;
  variant: TaskCardVariant;
  onComplete: (task: UnifiedTask) => void | Promise<void>;
  onReopen: (task: UnifiedTask) => void | Promise<void>;
  onPostpone: (task: UnifiedTask) => void | Promise<void>;
  onSkip: (task: UnifiedTask) => void | Promise<void>;
  onNavigate: (target: TaskNavigationTarget) => void;
  onEditDuration?: (task: UnifiedTask, minutes: number) => void | Promise<void>;
  postponeLabel?: string;
  defaultGuideOpen?: boolean;
  /** Pour les tâches podcast : programme d'écoute de la semaine. */
  podcasts?: PodcastEpisode[];
  todayWeek?: number;
  todayDay?: number;
  activeEpisodeId?: string | null;
  onPlayQueue?: (episode: PodcastEpisode, queue: string[]) => void;
}

const STATUS_LABELS: Record<string, string> = {
  todo: 'À faire',
  done: 'Terminée',
  skipped: 'Ignorée',
  postponed: 'Reportée',
  compressed: 'Comprimée',
};

function ids(variant: TaskCardVariant, id: string) {
  if (variant === 'dashboard') {
    return {
      card: `dashboard-task-${id}`,
      complete: `complete-task-${id}`,
      postpone: `postpone-task-${id}`,
      skip: `skip-task-${id}`,
      reopen: `reopen-task-${id}`,
      open: `open-task-target-${id}`,
    };
  }
  return {
    card: `planning-task-${id}`,
    complete: `planning-complete-${id}`,
    postpone: `planning-postpone-${id}`,
    skip: `planning-skip-${id}`,
    reopen: `planning-reopen-${id}`,
    open: `planning-open-${id}`,
  };
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  variant,
  onComplete,
  onReopen,
  onPostpone,
  onSkip,
  onNavigate,
  onEditDuration,
  postponeLabel = 'Reporter',
  defaultGuideOpen = false,
  podcasts,
  todayWeek,
  todayDay,
  activeEpisodeId,
  onPlayQueue,
}) => {
  const guide = getTaskActionGuide(task);
  const t = ids(variant, task.id);
  const isDone = task.status === 'done';
  const isSkipped = task.status === 'skipped';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<number>(task.effective_est_min);
  const accent = task.category === 'interview' ? certColor('INTERVIEW') : certColor(task.cert_code);
  const showExternal = task.url && !guide.primaryButton.externalUrl && !guide.secondaryButton?.externalUrl;
  const [copied, setCopied] = useState<string | null>(null);
  const copyTitle = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      // presse-papiers indisponible : le titre reste sélectionnable à la main
    }
  };
  const formatMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${String(m % 60).padStart(2, '0')}` : ''}` : `${m} min`);

  return (
    <article
      data-testid={t.card}
      className={`task-card ${isDone ? 'is-done' : ''} ${isSkipped ? 'is-skipped' : ''}`}
      style={{ ['--cert-color' as string]: accent } as React.CSSProperties}
      aria-label={`${task.title}${isDone ? ' (terminée)' : ''}`}
    >
      <div className="cluster" style={{ gap: '0.35rem' }}>
        <span className="badge badge-cert" style={{ ['--cert-color' as string]: accent } as React.CSSProperties}>
          {task.category === 'interview' ? 'Entretien' : task.cert_code === 'DBT' ? 'dbt' : task.cert_code || 'Certification'}
        </span>
        <span className={`badge ${task.priority === 'core' ? 'badge-core' : 'badge-bonus'}`}>
          {task.priority === 'core' ? 'Obligatoire' : 'Bonus'}
        </span>
        {task.status !== 'todo' && (
          <span className={`badge ${isDone ? 'badge-success' : isSkipped ? 'badge-neutral' : 'badge-warning'}`}>
            {STATUS_LABELS[task.status] || task.status}
          </span>
        )}
        {task.original_week !== task.target_week && (
          <span className="badge badge-warning">Déplacée de S{task.original_week}</span>
        )}
        <span className="mono muted small" style={{ marginLeft: 'auto' }}>
          {task.id}
        </span>
      </div>

      <h3 className="task-title" style={{ margin: '0.45rem 0 0' }}>
        {task.title}
      </h3>

      <div className="task-meta">
        <span className="meta-item">
          <CalendarClock size={15} aria-hidden /> {guide.recommendedDay}
        </span>
        <span className="meta-item mono">
          <Clock size={15} aria-hidden /> {task.effective_est_min} min
          {task.initial_est_min !== task.effective_est_min && (
            <span className="muted"> (prévu {task.initial_est_min})</span>
          )}
        </span>
      </div>

      <div className="task-actions">
        {!isDone && !isSkipped && (
          <button
            type="button"
            data-testid={t.open}
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate(guide.primaryButton)}
          >
            {guide.primaryButton.externalUrl && <ExternalLink size={16} aria-hidden />}
            <span>{guide.primaryButton.label}</span>
            {!guide.primaryButton.externalUrl && <ArrowRight size={16} aria-hidden />}
          </button>
        )}
        {!isDone && !isSkipped ? (
          <>
            <button
              type="button"
              data-testid={t.complete}
              className="btn btn-success btn-sm"
              onClick={() => onComplete(task)}
            >
              <Check size={16} aria-hidden />
              Terminer
            </button>
            <button
              type="button"
              data-testid={t.postpone}
              className="btn btn-ghost btn-sm"
              onClick={() => onPostpone(task)}
            >
              <SkipForward size={16} aria-hidden />
              {postponeLabel}
            </button>
            {task.priority === 'bonus' && (
              <button
                type="button"
                data-testid={t.skip}
                className="btn btn-ghost btn-sm"
                onClick={() => onSkip(task)}
              >
                Ignorer
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            data-testid={t.reopen}
            className="btn btn-secondary btn-sm"
            onClick={() => onReopen(task)}
          >
            <Undo2 size={16} aria-hidden />
            Rouvrir
          </button>
        )}
        {onEditDuration && !editing && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setDraft(task.effective_est_min);
              setEditing(true);
            }}
          >
            <Timer size={16} aria-hidden />
            Durée
          </button>
        )}
        {onEditDuration && editing && (
          <span className="cluster" style={{ gap: '0.35rem' }}>
            <label className="sr-only" htmlFor={`duration-${task.id}`}>
              Nouvelle durée en minutes pour {task.title}
            </label>
            <input
              id={`duration-${task.id}`}
              type="number"
              min={10}
              max={360}
              value={draft}
              onChange={(e) => setDraft(Number(e.target.value))}
              style={{ width: '88px' }}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={async () => {
                await onEditDuration(task, draft);
                setEditing(false);
              }}
            >
              Enregistrer
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
              <RotateCcw size={16} aria-hidden />
              Annuler
            </button>
          </span>
        )}
      </div>

      <details className="task-guide" open={defaultGuideOpen}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', minHeight: '28px', listStyle: 'none' }}>
          <ChevronDown size={16} aria-hidden />
          Comment faire
        </summary>
        <p style={{ margin: '0.5rem 0 0.25rem' }}>
          <strong>Où aller : </strong>
          {guide.whereLabel}
        </p>
        <p style={{ margin: '0.25rem 0' }}>
          <strong>Ressource : </strong>
          {task.resource}
          {task.lectures ? ` (${task.lectures})` : ''}
          {task.video_min > 0 ? `, vidéo ${task.video_min} min` : ''}
        </p>
        <ol>
          {guide.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
        {task.skillbuilder && (
          <div className="skillbuilder-box" data-testid={`skillbuilder-${task.id}`}>
            <div className="small" style={{ fontWeight: 650, marginBottom: '0.4rem' }}>
              À retrouver sur skillbuilder.aws
            </div>
            <div className="cluster" style={{ gap: '0.35rem', marginBottom: '0.6rem' }}>
              <span className="badge badge-neutral">Page : {task.skillbuilder.exam_page}</span>
              <span className="badge badge-info">Niveau d'accès : {task.skillbuilder.access}</span>
              <span className="badge badge-info">Langue : {task.skillbuilder.language}</span>
            </div>
            <ol className="skillbuilder-list">
              {task.skillbuilder.items.map((it) => (
                <li key={it.name}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="skillbuilder-name">{it.name}</div>
                    <div className="muted small">
                      {it.kind}, {formatMinutes(it.minutes)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => copyTitle(it.name)}
                    aria-label={`Copier le titre : ${it.name}`}
                  >
                    <Copy size={16} aria-hidden />
                    {copied === it.name ? 'Copié' : 'Copier'}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
        {podcasts && (
          <WeekListeningGrid
            episodes={podcasts}
            taskText={`${task.lectures || ''} ${task.title}`}
            week={task.original_week}
            todayWeek={todayWeek}
            todayDay={todayDay}
            activeEpisodeId={activeEpisodeId}
            onPlayQueue={onPlayQueue}
          />
        )}
        {guide.exercisesBadgeList && guide.exercisesBadgeList.length > 0 && (
          <div className="cluster" style={{ gap: '0.35rem', marginTop: '0.5rem' }}>
            <span className="small" style={{ fontWeight: 600 }}>Exercices de la séance :</span>
            {guide.exercisesBadgeList.map((ex) => (
              <span key={ex.id} className="badge badge-neutral">
                <strong className="mono">{ex.id}</strong> {ex.title}
              </span>
            ))}
          </div>
        )}
        {task.deliverable && (
          <p style={{ margin: '0.5rem 0 0' }}>
            <strong>Livrable attendu : </strong>
            {task.deliverable}
          </p>
        )}
        {(guide.secondaryButton || showExternal) && (
          <div className="cluster" style={{ marginTop: '0.65rem' }}>
            {guide.secondaryButton && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate(guide.secondaryButton!)}
              >
                <span>{guide.secondaryButton.label}</span>
                <ArrowRight size={16} aria-hidden />
              </button>
            )}
            {showExternal && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => window.open(task.url, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink size={16} aria-hidden />
                Lien externe
              </button>
            )}
          </div>
        )}
      </details>
    </article>
  );
};
