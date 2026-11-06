import React, { useMemo } from 'react';
import { CheckCircle2, ChevronDown, Circle, Headphones, ListMusic, Pause, Play } from 'lucide-react';
import { PodcastEpisode } from '../domain/types';
import {
  DAY_NAMES,
  DAY_SHORT,
  getTodayListening,
  isListenDone,
  LISTEN_GOAL,
  listenLabel,
  ScheduledListen,
  shortEpisodeLabel,
  summarizeTaskListening,
} from '../domain/podcastSchedule';
import { certColor } from '../ui/navigation';

interface RowProps {
  item: ScheduledListen;
  episodes: PodcastEpisode[];
  activeEpisodeId?: string | null;
  onPlay?: (ep: PodcastEpisode) => void;
  onMarkListened?: (ep: PodcastEpisode) => void;
  showWhen?: boolean;
}

const ListenRow: React.FC<RowProps> = ({ item, episodes, activeEpisodeId, onPlay, onMarkListened, showWhen }) => {
  const ep = episodes.find((e) => e.id === item.episodeId);
  if (!ep) return null;
  const done = isListenDone(item, episodes);
  const playing = activeEpisodeId === ep.id;
  const when = showWhen
    ? item.day === null
      ? `S${item.week}`
      : `${DAY_NAMES[item.day].toLowerCase()} S${item.week}`
    : '';
  return (
    <li
      className={`listen-row ${done ? 'is-done' : ''} ${playing ? 'is-playing' : ''}`}
      style={{ ['--cert-color' as string]: certColor(ep.cert_code) } as React.CSSProperties}
    >
      {ep.file_exists ? (
        <button
          type="button"
          className="episode-play"
          onClick={() => onPlay?.(ep)}
          aria-label={playing ? `En cours : ${ep.title}` : `Écouter ${ep.title}, ${listenLabel(item.listen)}`}
        >
          {playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
        </button>
      ) : (
        <span className="episode-play is-disabled" aria-hidden="true">
          <Headphones size={16} />
        </span>
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="listen-title">{ep.title}</div>
        <div className="episode-meta">
          <span className="mono">{shortEpisodeLabel(ep.id)}</span>
          <span>
            {listenLabel(item.listen)}
            {item.label ? ` (${item.label})` : ''}
            {item.bonus ? ' (rappel bonus)' : ''}
          </span>
          {when && <span>prévue {when}</span>}
          {ep.file_exists ? <span>{ep.duration_est_min} min</span> : <span className="badge badge-warning">Bientôt disponible</span>}
          {!done && (ep.last_position_sec || 0) > 5 && <span>reprise à {Math.floor((ep.last_position_sec || 0) / 60)} min</span>}
        </div>
      </div>
      {done ? (
        <CheckCircle2 size={22} aria-label="Écoute faite" style={{ color: 'var(--accent-green)', flex: '0 0 auto' }} />
      ) : (
        onMarkListened && (
          <button
            type="button"
            className="icon-btn"
            onClick={() => onMarkListened(ep)}
            aria-label={`J'ai fait la ${listenLabel(item.listen)} de ${ep.id} ailleurs : la compter`}
            title="Compter cette écoute"
          >
            <Circle size={22} aria-hidden />
          </button>
        )
      )}
    </li>
  );
};

// ============================================================================
// Carte « À écouter aujourd'hui » (écran Aujourd'hui)
// ============================================================================

interface TodayListeningCardProps {
  episodes: PodcastEpisode[];
  week: number;
  day: number;
  activeEpisodeId?: string | null;
  onPlayQueue: (episode: PodcastEpisode, queue: string[]) => void;
  onMarkListened: (episode: PodcastEpisode) => void;
  onOpenPodcasts: () => void;
}

export const TodayListeningCard: React.FC<TodayListeningCardProps> = ({
  episodes,
  week,
  day,
  activeEpisodeId,
  onPlayQueue,
  onMarkListened,
  onOpenPodcasts,
}) => {
  const data = useMemo(() => getTodayListening(episodes, week, day), [episodes, week, day]);
  const todayDone = data.today.filter((i) => isListenDone(i, episodes)).length;
  const toDo = [...data.today, ...data.overdue, ...data.flexible].filter((i) => !isListenDone(i, episodes));
  const playableQueue = Array.from(
    new Set(toDo.map((i) => i.episodeId).filter((id) => episodes.find((e) => e.id === id)?.file_exists))
  );
  const nothing = data.today.length === 0 && data.overdue.length === 0 && data.flexible.length === 0;

  const playFrom = (ep: PodcastEpisode) => {
    const q = playableQueue.includes(ep.id) ? playableQueue.slice(playableQueue.indexOf(ep.id)) : [ep.id];
    onPlayQueue(ep, q);
  };

  return (
    <section className="card" aria-labelledby="today-listening-heading" data-testid="today-listening-card">
      <div className="card-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h2 id="today-listening-heading" className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Headphones size={18} aria-hidden /> À écouter aujourd'hui
          </h2>
          <p className="muted small" style={{ margin: '0.15rem 0 0' }}>
            {data.today.length > 0
              ? `${todayDone} sur ${data.today.length} faite${todayDone > 1 ? 's' : ''}. Objectif : ${LISTEN_GOAL} écoutes par épisode.`
              : `Objectif : ${LISTEN_GOAL} écoutes par épisode, réparties sur la semaine.`}
          </p>
        </div>
        {playableQueue.length > 0 && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-testid="listen-play-all"
            onClick={() => {
              const first = episodes.find((e) => e.id === playableQueue[0]);
              if (first) onPlayQueue(first, playableQueue);
            }}
          >
            <ListMusic size={16} aria-hidden />
            Tout écouter
          </button>
        )}
      </div>

      {data.today.length > 0 ? (
        <ul className="listen-list">
          {data.today.map((item) => (
            <ListenRow
              key={`${item.episodeId}-${item.listen}`}
              item={item}
              episodes={episodes}
              activeEpisodeId={activeEpisodeId}
              onPlay={playFrom}
              onMarkListened={onMarkListened}
            />
          ))}
        </ul>
      ) : (
        <p className="text-secondary small" style={{ margin: 0 }}>
          {nothing ? 'Rien de prévu aujourd\'hui.' : 'Aucune nouvelle écoute prévue aujourd\'hui : profites-en pour rattraper ci-dessous.'}
          {data.nextPlanned &&
            ` Prochaine écoute : ${DAY_NAMES[data.nextPlanned.day as number].toLowerCase()}${data.nextPlanned.week !== week ? ` (S${data.nextPlanned.week})` : ''}, ${shortEpisodeLabel(data.nextPlanned.episodeId)} (${listenLabel(data.nextPlanned.listen)}).`}
        </p>
      )}

      {data.overdue.length > 0 && (
        <details className="disclosure" style={{ marginTop: '0.75rem' }}>
          <summary>
            À rattraper
            <span className="badge badge-warning">{data.overdue.length}</span>
            <ChevronDown size={18} className="chevron" aria-hidden />
          </summary>
          <div className="disclosure-body">
            <ul className="listen-list">
              {data.overdue.map((item) => (
                <ListenRow
                  key={`${item.episodeId}-${item.listen}`}
                  item={item}
                  episodes={episodes}
                  activeEpisodeId={activeEpisodeId}
                  onPlay={playFrom}
                  onMarkListened={onMarkListened}
                  showWhen
                />
              ))}
            </ul>
          </div>
        </details>
      )}

      {data.flexible.length > 0 && (
        <details className="disclosure" style={{ marginTop: '0.75rem' }}>
          <summary>
            Rappels à placer cette semaine
            <span className="badge badge-info">{data.flexible.length}</span>
            <ChevronDown size={18} className="chevron" aria-hidden />
          </summary>
          <div className="disclosure-body">
            <ul className="listen-list">
              {data.flexible.map((item) => (
                <ListenRow
                  key={`${item.episodeId}-${item.listen}`}
                  item={item}
                  episodes={episodes}
                  activeEpisodeId={activeEpisodeId}
                  onPlay={playFrom}
                  onMarkListened={onMarkListened}
                  showWhen
                />
              ))}
            </ul>
          </div>
        </details>
      )}

      <div style={{ marginTop: '0.75rem' }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onOpenPodcasts} style={{ paddingLeft: 0 }}>
          Tous les podcasts
        </button>
      </div>
    </section>
  );
};

// ============================================================================
// Calendrier d'écoute de la semaine (dans le guide d'une tâche podcast)
// ============================================================================

interface WeekListeningGridProps {
  episodes: PodcastEpisode[];
  taskText: string;
  week: number;
  todayWeek?: number;
  todayDay?: number;
  activeEpisodeId?: string | null;
  onPlayQueue?: (episode: PodcastEpisode, queue: string[]) => void;
}

export const WeekListeningGrid: React.FC<WeekListeningGridProps> = ({
  episodes,
  taskText,
  week,
  todayWeek,
  todayDay,
  activeEpisodeId,
  onPlayQueue,
}) => {
  const s = useMemo(() => summarizeTaskListening(episodes, taskText, week), [episodes, taskText, week]);
  if (!s) return null;
  const pct = s.weekTotal > 0 ? Math.round((s.weekDone / s.weekTotal) * 100) : 0;
  const weekComplete = s.weekTotal > 0 && s.weekDone >= s.weekTotal;

  const chip = (item: ScheduledListen) => {
    const ep = episodes.find((e) => e.id === item.episodeId);
    const done = isListenDone(item, episodes);
    const playing = activeEpisodeId === item.episodeId;
    const label = `${shortEpisodeLabel(item.episodeId)}, ${listenLabel(item.listen)}`;
    const canPlay = Boolean(ep?.file_exists && onPlayQueue);
    return (
      <button
        key={`${item.episodeId}-${item.listen}`}
        type="button"
        className={`listen-chip ${done ? 'is-done' : ''} ${playing ? 'is-playing' : ''}`}
        disabled={!canPlay}
        onClick={() => ep && onPlayQueue?.(ep, [ep.id])}
        aria-label={`${label}${done ? ', faite' : ''}${ep?.file_exists ? '' : ', bientôt disponible'}`}
        title={ep?.title}
        style={{ ['--cert-color' as string]: certColor(ep?.cert_code) } as React.CSSProperties}
      >
        {done ? <CheckCircle2 size={14} aria-hidden /> : <span className="cert-dot" aria-hidden="true" />}
        <span className="mono">{item.episodeId.split('-').pop()}</span>
        <span className="listen-chip-n">É{item.listen}</span>
      </button>
    );
  };

  return (
    <div className="week-listening" data-testid="week-listening-grid">
      <div className="row-between small" style={{ marginBottom: '0.35rem' }}>
        <strong>Programme d'écoute de la semaine</strong>
        <span className="mono">
          {s.weekDone}/{s.weekTotal} écoutes
        </span>
      </div>
      <div className="progress-track" role="progressbar" aria-label="Écoutes de la semaine" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--accent-green)' }} />
      </div>
      <ul className="week-days">
        {s.byDay.map((items, d) => {
          const isToday = todayWeek === week && todayDay === d;
          return (
            <li key={d} className={`week-day ${isToday ? 'is-today' : ''} ${items.length === 0 ? 'is-empty' : ''}`}>
              <span className="week-day-name">
                <span className="hide-mobile">{DAY_SHORT[d]}</span>
                <span className="show-mobile">{DAY_NAMES[d]}</span>
                {isToday && <span className="sr-only"> (aujourd'hui)</span>}
              </span>
              <span className="week-day-items">{items.length === 0 ? <span className="muted">Repos</span> : items.map(chip)}</span>
            </li>
          );
        })}
        {s.flexible.length > 0 && (
          <li className="week-day">
            <span className="week-day-name">Dans la semaine</span>
            <span className="week-day-items">{s.flexible.map(chip)}</span>
          </li>
        )}
      </ul>
      <p className="muted small" style={{ margin: '0.5rem 0 0' }}>
        Objectif {LISTEN_GOAL} écoutes par épisode : <strong className="mono">{s.goalDone}/{s.goalTotal}</strong>.
        {s.later.length > 0 &&
          ` ${s.later.length} écoute${s.later.length > 1 ? 's' : ''} de rappel prévue${s.later.length > 1 ? 's' : ''} plus tard (${Array.from(new Set(s.later.map((l) => `S${l.week}`))).join(', ')}).`}
      </p>
      {weekComplete && (
        <div className="alert alert-success small" role="status" style={{ marginTop: '0.5rem' }}>
          Toutes les écoutes de la semaine sont faites : tu peux marquer la tâche comme terminée.
        </div>
      )}
    </div>
  );
};

