import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Headphones,
  Lightbulb,
  Pause,
  Play,
  Plus,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react';
import { apiClient, AppStateResponse } from '../apiClient';
import { PodcastEpisode } from '../domain/types';
import { certColor } from '../ui/navigation';

interface PodcastPlayerBarProps {
  episode: PodcastEpisode | null;
  allEpisodes: PodcastEpisode[];
  /** File d'écoute (ex. « Tout écouter » du jour) ; sinon ordre de la certification. */
  queue?: string[] | null;
  onSelectEpisode: (ep: PodcastEpisode) => void;
  onClose: () => void;
  onRefreshState: (nextState: AppStateResponse) => void;
}

const SPEEDS = [1.0, 1.25, 1.5, 1.75, 2.0];
const SPEED_STORAGE_KEY = 'prep-cdi-playback-rate';

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const totalSec = Math.floor(sec);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function readStoredSpeed(): number {
  try {
    const v = Number(window.localStorage.getItem(SPEED_STORAGE_KEY));
    return SPEEDS.includes(v) ? v : 1.0;
  } catch {
    return 1.0;
  }
}

export const PodcastPlayerBar: React.FC<PodcastPlayerBarProps> = ({
  episode,
  allEpisodes,
  queue,
  onSelectEpisode,
  onClose,
  onRefreshState,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSavedSecRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(() => (typeof window === 'undefined' ? 1 : readStoredSpeed()));
  const [expanded, setExpanded] = useState<boolean>(false);
  const [showTraps, setShowTraps] = useState<boolean>(false);

  const inQueue = Boolean(episode && queue && queue.includes(episode.id));
  const playableCertEpisodes = episode
    ? inQueue
      ? (queue as string[]).map((id) => allEpisodes.find((e) => e.id === id)).filter((e): e is PodcastEpisode => Boolean(e && e.file_exists))
      : allEpisodes.filter((e) => e.cert_code === episode.cert_code && e.file_exists)
    : [];
  const currentIdx = episode ? playableCertEpisodes.findIndex((e) => e.id === episode.id) : -1;
  const prevEpisode = currentIdx > 0 ? playableCertEpisodes[currentIdx - 1] : null;
  const nextEpisode =
    currentIdx >= 0 && currentIdx < playableCertEpisodes.length - 1 ? playableCertEpisodes[currentIdx + 1] : null;

  useEffect(() => {
    if (!episode || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = episode.audio_url;
    audio.playbackRate = playbackRate;
    const startSec = episode.last_position_sec && episode.last_position_sec > 5 ? episode.last_position_sec : 0;
    audio.currentTime = startSec;
    setCurrentTime(startSec);
    setDuration(0);
    lastSavedSecRef.current = startSec;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode?.id]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
    try {
      window.localStorage.setItem(SPEED_STORAGE_KEY, String(playbackRate));
    } catch {
      // ignore
    }
  }, [playbackRate]);

  // Fermeture du lecteur plein écran avec Échap, défilement de la page bloqué
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  useEffect(() => {
    if (!episode || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${episode.id} : ${episode.title}`,
        artist: `Podcast NotebookLM (${episode.cert_code})`,
        album: episode.course_lectures
          ? `Semaine ${episode.primary_week}, ${episode.course_lectures}`
          : `Semaine ${episode.primary_week}, ${episode.cert_code}`,
      });
      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
      });
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
      });
      navigator.mediaSession.setActionHandler('seekforward', () => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(audioRef.current.duration || 9999, audioRef.current.currentTime + 15);
        }
      });
      navigator.mediaSession.setActionHandler('previoustrack', prevEpisode ? () => onSelectEpisode(prevEpisode) : null);
      navigator.mediaSession.setActionHandler('nexttrack', nextEpisode ? () => onSelectEpisode(nextEpisode) : null);
    } catch {
      // MediaSession non supporté sur certains navigateurs anciens
    }
  }, [episode, prevEpisode, nextEpisode, onSelectEpisode]);

  if (!episode) return null;

  const savePosition = async (posSec: number, incrementListen = false) => {
    try {
      const nextState = await apiClient.updatePodcastProgress({
        episode_id: episode.id,
        last_position_sec: posSec,
        increment_listen: incrementListen,
      });
      onRefreshState(nextState);
    } catch {
      // erreur réseau ignorée pendant l'enregistrement en arrière-plan
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (Math.abs(audio.currentTime - lastSavedSecRef.current) >= 8) {
      lastSavedSecRef.current = audio.currentTime;
      savePosition(Math.floor(audio.currentTime), false);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
    audio.playbackRate = playbackRate;
  };

  const handleEnded = async () => {
    setIsPlaying(false);
    lastSavedSecRef.current = 0;
    await savePosition(0, true);
    if (nextEpisode) onSelectEpisode(nextEpisode);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
      savePosition(Math.floor(audio.currentTime), false);
    }
  };

  const seekBy = (deltaSec: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.max(0, Math.min(duration || 99999, audio.currentTime + deltaSec));
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const seekTo = (val: number) => {
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const cycleSpeed = () => {
    const nextIdx = (SPEEDS.indexOf(playbackRate) + 1) % SPEEDS.length;
    setPlaybackRate(SPEEDS[nextIdx]);
  };

  const listenCount = episode.listen_count || 0;
  const listenLabel =
    listenCount === 0 ? 'À découvrir' : listenCount === 1 ? 'Découvert' : listenCount === 2 ? 'Consolidé' : 'Maîtrisé';
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const colorStyle = { ['--cert-color' as string]: certColor(episode.cert_code) } as React.CSSProperties;
  const subtitle = inQueue
    ? `${episode.id}, ${currentIdx + 1} sur ${playableCertEpisodes.length} aujourd'hui`
    : `${episode.id}, semaine ${episode.primary_week}${episode.course_lectures ? `, ${episode.course_lectures}` : ''}`;

  const playPauseButton = (large = false) => (
    <button
      type="button"
      data-testid={large ? 'podcast-play-pause-btn-full' : 'podcast-play-pause-btn'}
      className={`play-btn ${large ? 'play-btn-lg' : ''}`}
      onClick={togglePlay}
      aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
    >
      {isPlaying ? <Pause size={large ? 32 : 22} aria-hidden /> : <Play size={large ? 32 : 22} aria-hidden />}
    </button>
  );

  const seekSlider = (id: string) => (
    <div className="player-time-row">
      <span className="player-time">{formatTime(currentTime)}</span>
      <label className="sr-only" htmlFor={id}>
        Position de lecture
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={duration > 0 ? duration : 100}
        step={1}
        value={currentTime}
        onChange={(e) => seekTo(Number(e.target.value))}
        aria-valuetext={`${formatTime(currentTime)} sur ${formatTime(duration)}`}
      />
      <span className="player-time">{formatTime(duration)}</span>
    </div>
  );

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Mini-lecteur persistant */}
      <div data-testid="podcast-player-bar" className="player-mini" style={colorStyle} role="region" aria-label="Lecteur audio">
        <div className="player-progress-thin" aria-hidden="true">
          <div style={{ width: `${pct}%` }} />
        </div>
        <div className="player-mini-inner">
          <button
            type="button"
            className="player-meta"
            onClick={() => setExpanded(true)}
            aria-label={`Ouvrir le lecteur : ${episode.title}`}
            data-testid="podcast-player-expand"
          >
            <span className="player-cover" aria-hidden="true">
              <Headphones size={20} />
            </span>
            <span className="player-titles">
              <span className="player-title">{episode.title}</span>
              <span className="player-sub">{subtitle}</span>
            </span>
          </button>

          <div className="player-desktop-extra">{seekSlider('seek-mini')}</div>

          <div className="player-controls">
            <button type="button" className="icon-btn hide-mobile" onClick={() => seekBy(-15)} aria-label="Reculer de 15 secondes">
              <RotateCcw size={20} aria-hidden />
            </button>
            {playPauseButton(false)}
            <button type="button" className="icon-btn hide-mobile" onClick={() => seekBy(15)} aria-label="Avancer de 15 secondes">
              <RotateCw size={20} aria-hidden />
            </button>
            <button
              type="button"
              data-testid="podcast-speed-btn"
              className="btn btn-ghost btn-sm speed-btn hide-mobile"
              onClick={cycleSpeed}
              aria-label={`Vitesse de lecture ${playbackRate}x, changer`}
            >
              {playbackRate}x
            </button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer le lecteur">
              <X size={20} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Lecteur plein écran */}
      {expanded && (
        <>
          <div className="player-sheet-backdrop" onClick={() => setExpanded(false)} aria-hidden="true" />
          <div
            className="player-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="player-sheet-title"
            style={colorStyle}
            data-testid="podcast-player-sheet"
          >
            <div className="sheet-handle" aria-hidden="true" />
            <div className="player-sheet-inner">
              <div className="row-between">
                <button type="button" className="icon-btn" onClick={() => setExpanded(false)} aria-label="Réduire le lecteur">
                  <ChevronDown size={24} aria-hidden />
                </button>
                <span className="eyebrow">Podcast {episode.cert_code === 'DBT' ? 'dbt' : episode.cert_code}</span>
                <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer le lecteur">
                  <X size={22} aria-hidden />
                </button>
              </div>

              <div className="player-art" aria-hidden="true">
                <Headphones size={72} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <h2 id="player-sheet-title" style={{ margin: 0, fontSize: '1.15rem' }}>
                  {episode.title}
                </h2>
                <div className="muted small" style={{ marginTop: '0.25rem' }}>
                  {subtitle}
                </div>
              </div>

              {seekSlider('seek-full')}

              <div className="player-big-controls">
                <button
                  type="button"
                  className="icon-btn"
                  disabled={!prevEpisode}
                  onClick={() => prevEpisode && onSelectEpisode(prevEpisode)}
                  aria-label="Épisode précédent"
                >
                  <SkipBack size={24} aria-hidden />
                </button>
                <button type="button" className="icon-btn" onClick={() => seekBy(-15)} aria-label="Reculer de 15 secondes">
                  <RotateCcw size={26} aria-hidden />
                </button>
                {playPauseButton(true)}
                <button type="button" className="icon-btn" onClick={() => seekBy(15)} aria-label="Avancer de 15 secondes">
                  <RotateCw size={26} aria-hidden />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  disabled={!nextEpisode}
                  onClick={() => nextEpisode && onSelectEpisode(nextEpisode)}
                  aria-label="Épisode suivant"
                >
                  <SkipForward size={24} aria-hidden />
                </button>
              </div>

              <div className="cluster" style={{ justifyContent: 'center' }}>
                <div className="segmented" role="group" aria-label="Vitesse de lecture">
                  {SPEEDS.map((s) => (
                    <button key={s} type="button" className="segment" aria-pressed={playbackRate === s} onClick={() => setPlaybackRate(s)} style={{ minWidth: '52px', justifyContent: 'center', padding: '0 0.6rem' }}>
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="card card-sm row-between">
                <span>
                  <strong>Écoutes : {listenCount}/3</strong> <span className="muted small">{listenLabel}</span>
                </span>
                <button type="button" className="btn btn-success btn-sm" onClick={() => savePosition(Math.floor(currentTime), true)}>
                  <Plus size={16} aria-hidden />
                  Compter une écoute
                </button>
              </div>

              {episode.key_traps && episode.key_traps.length > 0 && (
                <div className="card card-sm">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ padding: 0, minHeight: '36px' }}
                    aria-expanded={showTraps}
                    onClick={() => setShowTraps((v) => !v)}
                  >
                    <Lightbulb size={16} aria-hidden />
                    Pièges d'examen de l'épisode
                  </button>
                  {showTraps && (
                    <>
                      <p className="text-secondary small" style={{ margin: '0.5rem 0' }}>
                        {episode.summary}
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem' }} className="small">
                        {episode.key_traps.map((trap, i) => (
                          <li key={i} style={{ marginBottom: '0.25rem' }}>
                            {trap}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
