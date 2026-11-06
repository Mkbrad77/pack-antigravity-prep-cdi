import React, { useEffect, useRef, useState } from 'react';
import { apiClient, AppStateResponse } from '../apiClient';
import { PodcastEpisode } from '../domain/types';

interface PodcastPlayerBarProps {
  episode: PodcastEpisode | null;
  allEpisodes: PodcastEpisode[];
  onSelectEpisode: (ep: PodcastEpisode) => void;
  onClose: () => void;
  onRefreshState: (nextState: AppStateResponse) => void;
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const totalSec = Math.floor(sec);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const PodcastPlayerBar: React.FC<PodcastPlayerBarProps> = ({
  episode,
  allEpisodes,
  onSelectEpisode,
  onClose,
  onRefreshState,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSavedSecRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [expandedTraps, setExpandedTraps] = useState<boolean>(false);

  const playableCertEpisodes = episode
    ? allEpisodes.filter((e) => e.cert_code === episode.cert_code && e.file_exists)
    : [];

  const currentIdx = episode
    ? playableCertEpisodes.findIndex((e) => e.id === episode.id)
    : -1;

  const prevEpisode = currentIdx > 0 ? playableCertEpisodes[currentIdx - 1] : null;
  const nextEpisode =
    currentIdx >= 0 && currentIdx < playableCertEpisodes.length - 1
      ? playableCertEpisodes[currentIdx + 1]
      : null;

  useEffect(() => {
    if (!episode || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = episode.audio_url;
    audio.playbackRate = playbackRate;
    const startSec =
      episode.last_position_sec && episode.last_position_sec > 5
        ? episode.last_position_sec
        : 0;
    audio.currentTime = startSec;
    setCurrentTime(startSec);
    lastSavedSecRef.current = startSec;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [episode?.id]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (!episode || typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${episode.id} : ${episode.title}`,
        artist: `Podcast NotebookLM (${episode.cert_code})`,
        album: episode.course_lectures
          ? `Semaine ${episode.primary_week} | ${episode.course_lectures}`
          : `Semaine ${episode.primary_week} | ${episode.cert_code}`,
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
      });
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
        }
      });
      navigator.mediaSession.setActionHandler('seekforward', () => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(
            audioRef.current.duration || 9999,
            audioRef.current.currentTime + 15
          );
        }
      });
      navigator.mediaSession.setActionHandler(
        'previoustrack',
        prevEpisode ? () => onSelectEpisode(prevEpisode) : null
      );
      navigator.mediaSession.setActionHandler(
        'nexttrack',
        nextEpisode ? () => onSelectEpisode(nextEpisode) : null
      );
    } catch {
      // MediaSession non supporte sur certains navigateurs anciens
    }
  }, [episode, prevEpisode, nextEpisode]);

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
      // ignore network error during background save
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
    if (nextEpisode) {
      onSelectEpisode(nextEpisode);
    }
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

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 1.75, 2.0];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIdx]);
  };

  const listenCount = episode.listen_count || 0;
  const listenLabel =
    listenCount === 0
      ? '0/3 (À découvrir)'
      : listenCount === 1
        ? '1/3 (Découverte OK)'
        : listenCount === 2
          ? '2/3 (Consolidé)'
          : `${listenCount}/3 (Maîtrisé ✅)`;

  return (
    <div
      data-testid="podcast-player-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        borderTop: '3px solid #38bdf8',
        boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.45)',
        padding: '0.65rem 1rem',
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        preload="metadata"
      />

      {expandedTraps && episode.key_traps && episode.key_traps.length > 0 && (
        <div
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '0.6rem 0.85rem',
            marginBottom: '0.55rem',
            fontSize: '0.82rem',
          }}
        >
          <div className="row-between" style={{ marginBottom: '0.3rem' }}>
            <strong style={{ color: '#38bdf8' }}>
              🎯 Points clés & pièges d'examen à écouter dans {episode.id} :
            </strong>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setExpandedTraps(false)}
              style={{ padding: '0.15rem 0.45rem', fontSize: '0.75rem' }}
            >
              Réduire
            </button>
          </div>
          <div style={{ color: '#cbd5e1', marginBottom: '0.3rem' }}>{episode.summary}</div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#fde047' }}>
            {episode.key_traps.map((trap, i) => (
              <li key={i}>{trap}</li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Ligne 1 : Titre de l'episode + Barre de progression */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
            <span
              className="mono badge"
              style={{
                backgroundColor:
                  episode.cert_code === 'CLF-C02'
                    ? '#2563eb'
                    : episode.cert_code === 'DBT'
                      ? '#d97706'
                      : '#059669',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              🎧 {episode.id}
            </span>
            <strong style={{ fontSize: '0.92rem', color: '#ffffff' }}>{episode.title}</strong>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              ({episode.course_lectures ? `${episode.course_lectures} | ` : ''}Semaine {episode.primary_week})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              onClick={() => setExpandedTraps(!expandedTraps)}
            >
              {expandedTraps ? '🔽 Masquer pièges' : '💡 Pièges d\'examen'}
            </button>
            <button
              type="button"
              className="btn btn-success btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
              onClick={() => savePosition(Math.floor(currentTime), true)}
              title="Incrémenter le compteur d'écoutes récursives (Objectif : 3 écoutes)"
            >
              🔁 {listenLabel} (+1)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              onClick={onClose}
              title="Fermer le lecteur"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Ligne 2 : Controles tactiles Mobile-First + Curseur audio */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={!prevEpisode}
              onClick={() => prevEpisode && onSelectEpisode(prevEpisode)}
              title="Épisode précédent"
              style={{ minWidth: '36px', padding: '0.35rem 0.5rem' }}
            >
              ⏮
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => seekBy(-15)}
              title="Reculer de 15 secondes"
              style={{ minWidth: '44px', padding: '0.35rem 0.5rem', fontWeight: 700 }}
            >
              -15s
            </button>
            <button
              type="button"
              data-testid="podcast-play-pause-btn"
              className="btn btn-primary btn-sm"
              onClick={togglePlay}
              style={{
                minWidth: '88px',
                padding: '0.4rem 0.75rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                backgroundColor: isPlaying ? '#f59e0b' : '#38bdf8',
                color: '#0f172a',
                border: 'none',
              }}
            >
              {isPlaying ? '⏸ Pause' : '▶ Écouter'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => seekBy(15)}
              title="Avancer de 15 secondes"
              style={{ minWidth: '44px', padding: '0.35rem 0.5rem', fontWeight: 700 }}
            >
              +15s
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={!nextEpisode}
              onClick={() => nextEpisode && onSelectEpisode(nextEpisode)}
              title="Épisode suivant"
              style={{ minWidth: '36px', padding: '0.35rem 0.5rem' }}
            >
              ⏭
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
            <span className="mono" style={{ fontSize: '0.78rem', color: '#cbd5e1', minWidth: '38px' }}>
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 100}
              step={1}
              value={currentTime}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (audioRef.current) {
                  audioRef.current.currentTime = val;
                }
                setCurrentTime(val);
              }}
              style={{ flex: 1, cursor: 'pointer', accentColor: '#38bdf8' }}
            />
            <span className="mono" style={{ fontSize: '0.78rem', color: '#cbd5e1', minWidth: '38px' }}>
              {formatTime(duration)}
            </span>
          </div>

          <button
            type="button"
            data-testid="podcast-speed-btn"
            className="btn btn-secondary btn-sm mono"
            onClick={cycleSpeed}
            title="Changer la vitesse de lecture (1x, 1.25x, 1.5x, 1.75x, 2x)"
            style={{
              fontWeight: 700,
              backgroundColor: playbackRate > 1 ? '#0284c7' : '#334155',
              color: '#fff',
              border: 'none',
              padding: '0.35rem 0.65rem',
            }}
          >
            ⚡ {playbackRate}x
          </button>
        </div>
      </div>
    </div>
  );
};
