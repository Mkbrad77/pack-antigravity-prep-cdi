import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  CloudDownload,
  CheckCircle2,
  ExternalLink,
  Gift,
  Headphones,
  Lightbulb,
  Loader2,
  Minus,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { apiClient, AppStateResponse } from '../apiClient';
import { CertCode, CourseKey, LectureRangeRef, PodcastEpisode, UdemyCourse } from '../domain/types';
import {
  downloadAudioForOffline,
  isOfflineAudioSupported,
  listOfflineAudioUrls,
  removeOfflineAudio,
  requestPersistentStorage,
} from '../pwa/offlineAudio';
import { certColor } from '../ui/navigation';

export type CoursesViewMode = 'podcasts' | 'snowflake' | 'udemy';

interface CoursesViewProps {
  state: AppStateResponse;
  onRefreshState: (nextState: AppStateResponse) => void;
  mode?: CoursesViewMode;
  initialCourseKey?: CourseKey;
  /** Ancien sélecteur d'onglet interne, conservé pour compatibilité. */
  initialSubTab?: 'udemy' | 'snowflake_dbt' | 'podcasts';
  initialPodcastCertFilter?: CertCode | 'ALL';
  navigationNonce?: number;
  activeEpisodeId?: string | null;
  onPlayEpisode?: (episode: PodcastEpisode) => void;
}

const COURSE_KEYS: CourseKey[] = ['merico', 'toth', 'weigel', 'maarek', 'nikolai'];
const COURSE_CERT: Record<CourseKey, string> = {
  merico: 'CLF-C02',
  toth: 'DBT',
  weigel: 'DBT',
  maarek: 'DEA-C01',
  nikolai: 'DEA-C01',
};

const PODCAST_CERTS: Array<{ code: CertCode; label: string; weeks: string; exam: string; total: number }> = [
  { code: 'CLF-C02', label: 'AWS CLF-C02', weeks: 'S1 à S3', exam: '27 nov. 2026', total: 12 },
  { code: 'DBT', label: 'dbt', weeks: 'S3 à S9', exam: '8 janv. 2027', total: 16 },
  { code: 'DEA-C01', label: 'AWS DEA-C01', weeks: 'S10 à S19', exam: '19 mars 2027', total: 16 },
];

function formatRanges(ranges?: LectureRangeRef[]): string {
  if (!ranges || ranges.length === 0) return 'Aucune leçon associée';
  return ranges
    .map((r) => (r.first === r.last ? `leçon ${r.first}` : `leçons ${r.first} à ${r.last}`))
    .join(', ');
}

function formatResume(sec: number): string {
  return `${Math.floor(sec / 60)} min ${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  state,
  onRefreshState,
  mode: modeProp,
  initialCourseKey,
  initialSubTab,
  initialPodcastCertFilter,
  navigationNonce,
  activeEpisodeId,
  onPlayEpisode,
}) => {
  const mode: CoursesViewMode =
    modeProp ||
    (initialSubTab === 'podcasts' ? 'podcasts' : initialSubTab === 'snowflake_dbt' ? 'snowflake' : 'udemy');

  const [offlineUrls, setOfflineUrls] = useState<Set<string>>(new Set());
  const [offlineBusy, setOfflineBusy] = useState<Record<string, boolean>>({});
  const [offlineError, setOfflineError] = useState<string>('');

  useEffect(() => {
    if (mode !== 'podcasts') return;
    listOfflineAudioUrls()
      .then(setOfflineUrls)
      .catch(() => undefined);
  }, [mode]);

  const [selectedCourseKey, setSelectedCourseKey] = useState<CourseKey>(initialCourseKey || 'merico');
  const [courseDetail, setCourseDetail] = useState<UdemyCourse | null>(null);
  const [loadingCourse, setLoadingCourse] = useState<boolean>(false);
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(60);
  const [topicQuery, setTopicQuery] = useState<string>('');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('ALL');
  const [mlCategoryFilter, setMlCategoryFilter] = useState<string>('ALL');
  const [mlLevelFilter, setMlLevelFilter] = useState<string>('ALL');

  const [podcastCertFilter, setPodcastCertFilter] = useState<CertCode | 'ALL'>(initialPodcastCertFilter || 'ALL');
  const [podcastWeekFilter, setPodcastWeekFilter] = useState<number | 'ALL'>('ALL');
  const [podcastOnlyReady, setPodcastOnlyReady] = useState<boolean>(false);
  const [openEpisodeId, setOpenEpisodeId] = useState<string | null>(null);

  useEffect(() => {
    if (initialPodcastCertFilter) setPodcastCertFilter(initialPodcastCertFilter);
    if (initialCourseKey) setSelectedCourseKey(initialCourseKey);
  }, [initialCourseKey, initialPodcastCertFilter, navigationNonce]);

  const loadCourse = async (key: CourseKey) => {
    setLoadingCourse(true);
    try {
      const detail = await apiClient.fetchCourseDetails(key);
      setCourseDetail(detail);
      setSelectedBlockFilter('ALL');
    } finally {
      setLoadingCourse(false);
    }
  };

  useEffect(() => {
    if (mode === 'udemy') loadCourse(selectedCourseKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseKey, mode]);

  const handleToggleSingleItem = async (itemIndex: number, done: boolean) => {
    const nextState = await apiClient.setLessonsDoneRange(selectedCourseKey, [itemIndex], done);
    onRefreshState(nextState);
    await loadCourse(selectedCourseKey);
  };

  const handleToggleRange = async (startIdx: number, endIdx: number, done: boolean) => {
    const lo = Math.min(startIdx, endIdx);
    const hi = Math.max(startIdx, endIdx);
    const indices: number[] = [];
    for (let i = lo; i <= hi; i++) indices.push(i);
    const nextState = await apiClient.setLessonsDoneRange(selectedCourseKey, indices, done);
    onRefreshState(nextState);
    await loadCourse(selectedCourseKey);
  };

  const handleUpdateEpisodeListenCount = async (ep: PodcastEpisode, delta: number) => {
    const nextCount = Math.max(0, (ep.listen_count || 0) + delta);
    const nextState = await apiClient.updatePodcastProgress({ episode_id: ep.id, listen_count: nextCount });
    onRefreshState(nextState);
  };

  const courseStats = state.progress.courses[selectedCourseKey];
  const awsTopics = state.staticData.carteDesSujets.aws_topics.filter((t) => {
    if (!topicQuery.trim()) return true;
    const q = topicQuery.toLowerCase();
    return t.label.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.dea_domain.toLowerCase().includes(q);
  });
  const dbtTopics = state.staticData.carteDesSujets.dbt_topics.filter((t) => {
    if (!topicQuery.trim()) return true;
    const q = topicQuery.toLowerCase();
    return t.label.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
  });

  const visibleItems = (courseDetail?.items || []).filter(
    (item) => selectedBlockFilter === 'ALL' || item.block === selectedBlockFilter
  );

  const hubData = state.staticData.snowflakeDbtResources;
  const mlCategories = Array.from(new Set((hubData?.snowflake_ml_quickstarts || []).map((q) => q.category)));
  const filteredMlQuickstarts = (hubData?.snowflake_ml_quickstarts || []).filter((q) => {
    if (mlCategoryFilter !== 'ALL' && q.category !== mlCategoryFilter) return false;
    if (mlLevelFilter !== 'ALL' && q.level !== mlLevelFilter) return false;
    return true;
  });

  const allPodcasts = state.podcasts || [];
  const readyCount = (code: CertCode) => allPodcasts.filter((p) => p.cert_code === code && p.file_exists).length;
  const totalReadyCount = allPodcasts.filter((p) => p.file_exists).length;

  const filteredPodcasts = useMemo(
    () =>
      allPodcasts.filter((ep) => {
        if (podcastCertFilter !== 'ALL' && ep.cert_code !== podcastCertFilter) return false;
        if (podcastOnlyReady && !ep.file_exists) return false;
        if (
          podcastWeekFilter !== 'ALL' &&
          ep.primary_week !== podcastWeekFilter &&
          !(ep.review_weeks || []).includes(podcastWeekFilter)
        ) {
          return false;
        }
        return true;
      }),
    [allPodcasts, podcastCertFilter, podcastOnlyReady, podcastWeekFilter]
  );

  const isCloud = state.runtimeMode === 'cloud';
  const offlineAvailable = isCloud && isOfflineAudioSupported();

  const handleToggleOffline = async (ep: PodcastEpisode) => {
    if (!ep.audio_url) return;
    setOfflineBusy((prev) => ({ ...prev, [ep.id]: true }));
    setOfflineError('');
    try {
      if (offlineUrls.has(ep.audio_url)) {
        await removeOfflineAudio(ep.audio_url);
      } else {
        await requestPersistentStorage();
        await downloadAudioForOffline(ep.audio_url);
      }
      setOfflineUrls(await listOfflineAudioUrls());
    } catch (err) {
      setOfflineError(err instanceof Error ? err.message : String(err));
    } finally {
      setOfflineBusy((prev) => ({ ...prev, [ep.id]: false }));
    }
  };

  const handleDownloadVisibleForOffline = async () => {
    const targets = filteredPodcasts.filter((ep) => ep.file_exists && ep.audio_url && !offlineUrls.has(ep.audio_url));
    for (const ep of targets) {
      // eslint-disable-next-line no-await-in-loop
      await handleToggleOffline(ep);
    }
  };

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ==========================================================================
  // PODCASTS
  // ==========================================================================
  if (mode === 'podcasts') {
    return (
      <div data-testid="courses-view" className="stack">
        <div data-testid="podcasts-studio-section" className="stack">
          <div className="segmented" role="group" aria-label="Filtrer par certification">
            <button type="button" className="segment" aria-pressed={podcastCertFilter === 'ALL'} onClick={() => setPodcastCertFilter('ALL')}>
              Tous <span className="segment-count">{totalReadyCount}/{allPodcasts.length}</span>
            </button>
            {PODCAST_CERTS.map((c) => (
              <button
                key={c.code}
                type="button"
                className="segment"
                aria-pressed={podcastCertFilter === c.code}
                onClick={() => setPodcastCertFilter(c.code)}
                style={{ ['--cert-color' as string]: certColor(c.code) } as React.CSSProperties}
              >
                <span className="cert-dot" aria-hidden="true" />
                {c.label}
                <span className="segment-count">
                  {readyCount(c.code)}/{c.total}
                </span>
              </button>
            ))}
          </div>

          {podcastCertFilter !== 'ALL' && (() => {
            const c = PODCAST_CERTS.find((x) => x.code === podcastCertFilter)!;
            const ready = readyCount(c.code);
            return (
              <div className="card card-sm" style={{ ['--cert-color' as string]: certColor(c.code) } as React.CSSProperties}>
                <div className="row-between small">
                  <span>
                    <strong>{ready} épisode{ready > 1 ? 's' : ''} prêt{ready > 1 ? 's' : ''}</strong> sur {c.total}
                  </span>
                  <span className="muted">
                    {c.weeks}, examen le {c.exam}
                  </span>
                </div>
                <div className="progress-track" aria-hidden="true">
                  <div className="progress-fill" style={{ width: `${Math.round((ready / c.total) * 100)}%` }} />
                </div>
              </div>
            );
          })()}

          <div className="cluster" style={{ gap: '0.75rem' }}>
            <label className="cluster small" style={{ gap: '0.4rem', fontWeight: 600 }}>
              Semaine
              <select
                aria-label="Filtrer par semaine d'écoute"
                value={podcastWeekFilter}
                onChange={(e) => setPodcastWeekFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              >
                <option value="ALL">Toutes</option>
                {Array.from({ length: 22 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    S{w}
                  </option>
                ))}
              </select>
            </label>
            <label className="check-row">
              <input type="checkbox" checked={podcastOnlyReady} onChange={(e) => setPodcastOnlyReady(e.target.checked)} />
              Prêts uniquement
            </label>
            {offlineAvailable && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-testid="download-visible-offline"
                onClick={handleDownloadVisibleForOffline}
              >
                <CloudDownload size={16} aria-hidden />
                Tout garder hors ligne
              </button>
            )}
          </div>
          {offlineError && (
            <div className="alert alert-warning small" role="alert">
              {offlineError}
            </div>
          )}

          <details className="disclosure">
            <summary>
              <Lightbulb size={18} aria-hidden />
              Méthode des 3 écoutes
              <ChevronDown size={18} className="chevron" aria-hidden />
            </summary>
            <div className="disclosure-body text-secondary small">
              Première écoute le jour des leçons Udemy (découverte à 1x), deuxième écoute à J+3 dans les transports
              (consolidation à 1,25x), troisième écoute la veille de l'examen blanc (maîtrise à 1,5x).
            </div>
          </details>

          <ul className="episode-list" aria-label="Épisodes">
            {filteredPodcasts.length === 0 && <li className="empty-state">Aucun épisode pour ces filtres.</li>}
            {filteredPodcasts.map((ep) => {
              const isPlayingThis = activeEpisodeId === ep.id;
              const listenCount = ep.listen_count || 0;
              const isOpen = openEpisodeId === ep.id;
              const isOffline = ep.audio_url ? offlineUrls.has(ep.audio_url) : false;
              const hasResume = (ep.last_position_sec || 0) > 5;
              return (
                <li
                  key={ep.id}
                  data-testid={`podcast-card-${ep.id}`}
                  className={`episode-row ${isPlayingThis ? 'is-playing' : ''} ${ep.file_exists ? '' : 'is-unavailable'}`}
                  style={{ ['--cert-color' as string]: certColor(ep.cert_code) } as React.CSSProperties}
                >
                  <div className="episode-main">
                    {ep.file_exists ? (
                      <button
                        type="button"
                        data-testid={`play-podcast-btn-${ep.id}`}
                        className="episode-play"
                        onClick={() => onPlayEpisode && onPlayEpisode(ep)}
                        aria-label={
                          isPlayingThis
                            ? `En cours de lecture : ${ep.title}`
                            : hasResume
                              ? `Reprendre ${ep.title} à ${formatResume(ep.last_position_sec || 0)}`
                              : `Écouter ${ep.title}`
                        }
                      >
                        {isPlayingThis ? <Pause size={20} aria-hidden /> : <Play size={20} aria-hidden />}
                      </button>
                    ) : (
                      <span className="episode-play is-disabled" aria-hidden="true">
                        <Headphones size={18} />
                      </span>
                    )}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="episode-title">{ep.title}</div>
                      <div className="episode-meta">
                        <span className="mono">{ep.id}</span>
                        <span>S{ep.primary_week}</span>
                        {ep.file_exists ? (
                          <span>{ep.duration_est_min} min</span>
                        ) : (
                          <span className="badge badge-warning">Bientôt disponible</span>
                        )}
                        <span className={listenCount >= 3 ? 'episode-done' : undefined}>
                          {listenCount >= 3 && <CheckCircle2 size={14} aria-hidden />}
                          {listenCount}/3 écoutes
                        </span>
                        {hasResume && !isPlayingThis && <span>reprise à {formatResume(ep.last_position_sec || 0)}</span>}
                        {isOffline && <span className="badge badge-success">Hors ligne</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-expanded={isOpen}
                      aria-label={isOpen ? `Masquer les détails de ${ep.id}` : `Voir les détails de ${ep.id}`}
                      onClick={() => setOpenEpisodeId(isOpen ? null : ep.id)}
                    >
                      <ChevronDown size={20} aria-hidden style={{ transform: isOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
                    </button>
                  </div>
                  {isOpen && (
                    <div className="episode-details">
                      {(ep.course_lectures || ep.schedule_days) && (
                        <p className="small" style={{ margin: 0, fontWeight: 600 }}>
                          {[ep.course_lectures, ep.schedule_days].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {ep.review_weeks && ep.review_weeks.length > 0 && (
                        <p className="muted small" style={{ margin: 0 }}>
                          Révision en S{ep.review_weeks.join(', S')}
                        </p>
                      )}
                      <p className="text-secondary small" style={{ margin: 0 }}>
                        {ep.summary}
                      </p>
                      {ep.key_traps && ep.key_traps.length > 0 && (
                        <div className="callout callout-warning small">
                          <strong>Pièges d'examen couverts :</strong>
                          <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.1rem' }}>
                            {ep.key_traps.map((trap, idx) => (
                              <li key={idx}>{trap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="cluster">
                        <span className="small" style={{ fontWeight: 600 }}>
                          Écoutes
                        </span>
                        <button
                          type="button"
                          className="icon-btn"
                          style={{ width: 40, height: 40, border: '1px solid var(--border-strong)' }}
                          disabled={listenCount === 0}
                          onClick={() => handleUpdateEpisodeListenCount(ep, -1)}
                          aria-label={`Retirer une écoute à ${ep.id}`}
                        >
                          <Minus size={18} aria-hidden />
                        </button>
                        <span className="mono" aria-live="polite">
                          {listenCount}/3
                        </span>
                        <button
                          type="button"
                          className="icon-btn"
                          style={{ width: 40, height: 40, border: '1px solid var(--border-strong)' }}
                          onClick={() => handleUpdateEpisodeListenCount(ep, 1)}
                          aria-label={`Ajouter une écoute à ${ep.id}`}
                        >
                          <Plus size={18} aria-hidden />
                        </button>
                        {ep.file_exists && offlineAvailable && ep.audio_url && (
                          <button
                            type="button"
                            data-testid={`offline-podcast-btn-${ep.id}`}
                            className="btn btn-secondary btn-sm"
                            disabled={Boolean(offlineBusy[ep.id])}
                            onClick={() => handleToggleOffline(ep)}
                          >
                            {offlineBusy[ep.id] ? (
                              <>
                                <Loader2 size={16} aria-hidden /> Téléchargement…
                              </>
                            ) : isOffline ? (
                              <>
                                <Trash2 size={16} aria-hidden /> Retirer du hors ligne
                              </>
                            ) : (
                              <>
                                <CloudDownload size={16} aria-hidden /> Garder hors ligne
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      {!ep.file_exists && (
                        <p className="muted small" style={{ margin: 0 }}>
                          L'audio apparaîtra automatiquement dès son ajout.
                        </p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // SNOWFLAKE & DBT
  // ==========================================================================
  if (mode === 'snowflake') {
    if (!hubData) {
      return <div className="empty-state">Ressources Snowflake indisponibles.</div>;
    }
    return (
      <div data-testid="courses-view" className="stack">
        <div data-testid="snowflake-dbt-hub-section" className="stack">
          <section className="card card-accent" style={{ ['--cert-color' as string]: 'var(--cert-snow)' } as React.CSSProperties}>
            <div className="card-header">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Gift size={18} aria-hidden /> Tes 2 comptes Free Trial Snowflake
              </h2>
              <span className="badge badge-success">800 $ de crédits au total</span>
            </div>
            <p className="text-secondary small" style={{ marginTop: 0 }}>
              Ne les active pas en même temps : le premier (120 jours, 400 $) en semaine 4 pour la certification dbt et
              les premiers Quickstarts ML, le second (Cortex Code, 30 jours) en semaine 15.
            </p>
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              {hubData.free_trials.map((trial) => (
                <div key={trial.id} className="card card-sm stack-sm">
                  <div className="row-between">
                    <strong>{trial.title}</strong>
                    <span className="badge badge-info">{trial.badge}</span>
                  </div>
                  <div className="text-secondary small">{trial.description}</div>
                  <div className="row-between">
                    <span className="badge badge-warning">Activation : {trial.when_to_activate}</span>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => openExternal(trial.url)}>
                      Ouvrir l'essai <ExternalLink size={16} aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card card-accent" style={{ ['--cert-color' as string]: 'var(--cert-dbt)' } as React.CSSProperties}>
            <div className="card-header">
              <div>
                <h2 className="card-title">Parcours officiel dbt Analytics Engineering</h2>
                <p className="muted small" style={{ margin: '0.2rem 0 0' }}>
                  Semaines 4 à 9, examen le 8 janvier 2027 : modules learn.getdbt.com, guide d'étude, retours Devoteam et examens blancs.
                </p>
              </div>
              <span className="badge badge-warning">Urgence n°1</span>
            </div>
            <ul className="resource-list">
              {hubData.dbt_certification_resources.map((item) => (
                <li key={item.id} className="resource-row">
                  <span className="mono badge badge-info">S{item.week}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div className="muted small">{item.description}</div>
                    <div className="cluster small" style={{ marginTop: '0.3rem', gap: '0.35rem' }}>
                      <span className="badge badge-neutral">{item.category}</span>
                      <span className={`badge ${item.priority === 'core' ? 'badge-core' : 'badge-bonus'}`}>
                        {item.priority === 'core' ? 'Obligatoire' : 'Bonus'}
                      </span>
                      <span className="mono muted">{item.est_min > 0 ? `${item.est_min} min` : 'Inclus'}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => openExternal(item.url)}
                    aria-label={`Ouvrir ${item.title}`}
                  >
                    Ouvrir <ExternalLink size={16} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            <h3 style={{ margin: '1.25rem 0 0.6rem', fontSize: '1rem' }}>Les 6 Quickstarts dbt Cloud et Snowflake</h3>
            <div className="grid-3" style={{ gap: '0.65rem' }}>
              {hubData.dbt_snowflake_quickstarts.map((qs) => (
                <div key={qs.id} className="card card-sm stack-sm">
                  <div className="cluster" style={{ gap: '0.35rem' }}>
                    <span className="mono badge badge-info">S{qs.week}</span>
                    <span className={`badge ${qs.priority === 'core' ? 'badge-core' : 'badge-bonus'}`}>
                      {qs.priority === 'core' ? 'Obligatoire' : 'Bonus'}, {qs.est_min} min
                    </span>
                  </div>
                  <strong>{qs.title}</strong>
                  <div className="muted small">{qs.description}</div>
                  <button type="button" className="btn btn-secondary btn-sm btn-block" onClick={() => openExternal(qs.url)}>
                    Lancer le Quickstart <ExternalLink size={16} aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="card card-accent" style={{ ['--cert-color' as string]: 'var(--cert-snow)' } as React.CSSProperties}>
            <div className="card-header">
              <div>
                <h2 className="card-title">Les 15 Quickstarts officiels Snowflake ML</h2>
                <p className="muted small" style={{ margin: '0.2rem 0 0' }}>
                  Plus 2 labs Cortex AI et Iceberg, à raison de 1 à 2 par semaine entre S5 et S22. Source :{' '}
                  <a href="https://docs.snowflake.com/en/developer-guide/snowflake-ml/quickstart" target="_blank" rel="noopener noreferrer">
                    docs.snowflake.com
                  </a>
                </p>
              </div>
            </div>
            <div className="stack-sm" style={{ marginBottom: '0.85rem' }}>
              <div className="chips scroll" role="group" aria-label="Catégorie de Quickstart">
                <button type="button" className="chip" aria-pressed={mlCategoryFilter === 'ALL'} onClick={() => setMlCategoryFilter('ALL')}>
                  Toutes ({hubData.snowflake_ml_quickstarts.length})
                </button>
                {mlCategories.map((cat) => (
                  <button key={cat} type="button" className="chip" aria-pressed={mlCategoryFilter === cat} onClick={() => setMlCategoryFilter(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="segmented" role="group" aria-label="Niveau" style={{ alignSelf: 'flex-start' }}>
                {([
                  ['ALL', 'Tous niveaux'],
                  ['Beginner', 'Débutant'],
                  ['Intermediate', 'Intermédiaire'],
                ] as Array<[string, string]>).map(([id, label]) => (
                  <button key={id} type="button" className="segment" aria-pressed={mlLevelFilter === id} onClick={() => setMlLevelFilter(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid-3" style={{ gap: '0.75rem' }}>
              {filteredMlQuickstarts.map((qs) => (
                <div key={qs.id} data-testid={`ml-quickstart-card-${qs.number}`} className="card card-sm stack-sm" style={{ justifyContent: 'space-between' }}>
                  <div className="stack-sm">
                    <div className="cluster" style={{ gap: '0.35rem' }}>
                      <span className="mono badge badge-neutral">
                        n°{qs.number}, S{qs.week}
                      </span>
                      <span className={`badge ${qs.level === 'Beginner' ? 'badge-success' : 'badge-info'}`}>
                        {qs.level === 'Beginner' ? 'Débutant' : 'Intermédiaire'}
                      </span>
                      <span className={`badge ${qs.priority === 'core' ? 'badge-core' : 'badge-bonus'}`}>{qs.est_min} min</span>
                    </div>
                    <div className="eyebrow">{qs.category}</div>
                    <strong>{qs.title}</strong>
                    <div className="muted small">{qs.description}</div>
                    <div className="muted small">
                      <strong>Livrable :</strong> {qs.deliverable}
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => openExternal(qs.url)}>
                    Ouvrir le Quickstart n°{qs.number} <ExternalLink size={16} aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <details className="disclosure">
            <summary>
              Accès internes Devoteam et communautés
              <span className="badge badge-neutral">{hubData.devoteam_communities.length}</span>
              <ChevronDown size={18} className="chevron" aria-hidden />
            </summary>
            <div className="disclosure-body">
              <ul className="resource-list">
                {hubData.devoteam_communities.map((comm) => (
                  <li key={comm.id} className="resource-row">
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="cluster" style={{ gap: '0.35rem' }}>
                        <span className="badge badge-neutral">{comm.domain}</span>
                        <strong>{comm.title}</strong>
                      </div>
                      <div className="muted small" style={{ marginTop: '0.2rem' }}>
                        {comm.description}
                      </div>
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => openExternal(comm.url)} aria-label={`Ouvrir ${comm.title}`}>
                      Ouvrir <ExternalLink size={16} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // UDEMY
  // ==========================================================================
  return (
    <div data-testid="courses-view" className="stack">
      <div className="chips scroll" role="group" aria-label="Choisir un cours Udemy">
        {COURSE_KEYS.map((key) => {
          const st = state.progress.courses[key];
          return (
            <button
              key={key}
              type="button"
              data-testid={`select-course-${key}`}
              className="chip"
              aria-pressed={key === selectedCourseKey}
              onClick={() => setSelectedCourseKey(key)}
              style={{ ['--cert-color' as string]: certColor(COURSE_CERT[key]) } as React.CSSProperties}
            >
              <span className="cert-dot" aria-hidden="true" />
              <span style={{ textTransform: 'capitalize' }}>{key}</span>
              <span className="mono muted">{st?.weightedPercent ?? 0} %</span>
            </button>
          );
        })}
      </div>

      {courseStats && (
        <section className="card card-accent" style={{ ['--cert-color' as string]: certColor(COURSE_CERT[selectedCourseKey]) } as React.CSSProperties}>
          <div className="row-between" style={{ alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ minWidth: 0, flex: '1 1 260px' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{courseStats.title}</h2>
              <div className="muted small" style={{ marginTop: '0.25rem' }}>
                {courseStats.instructor}, {courseStats.role}, facteur temps <span className="mono">x{courseStats.timeFactor}</span>
              </div>
            </div>
            <div className="cluster" style={{ gap: '0.75rem', flexWrap: 'nowrap' }}>
              <div className="ring" style={{ ['--pct' as string]: courseStats.weightedPercent } as React.CSSProperties} aria-hidden="true">
                {courseStats.weightedPercent}%
              </div>
              <div className="small">
                <div>
                  <strong className="mono">{courseStats.doneItems}</strong>/{courseStats.totalItems} éléments
                </div>
                <div className="muted mono">
                  {courseStats.estimatedMinutesDone}/{courseStats.estimatedMinutesTotal} min
                </div>
              </div>
            </div>
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: '1rem 0 0', borderTop: '1px solid var(--border-color)', paddingTop: '0.9rem' }}>
            <legend className="small" style={{ fontWeight: 650, padding: 0, marginBottom: '0.5rem', float: 'left', width: '100%' }}>
              Valider une plage de leçons
            </legend>
            <div className="cluster" style={{ clear: 'both' }}>
              <label className="cluster small" style={{ gap: '0.35rem' }}>
                De
                <input
                  type="number"
                  data-testid="range-start-input"
                  min={1}
                  max={courseStats.totalItems}
                  value={rangeStart}
                  onChange={(e) => setRangeStart(Number(e.target.value))}
                  style={{ width: '84px' }}
                />
              </label>
              <label className="cluster small" style={{ gap: '0.35rem' }}>
                à
                <input
                  type="number"
                  data-testid="range-end-input"
                  min={1}
                  max={courseStats.totalItems}
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(Number(e.target.value))}
                  style={{ width: '84px' }}
                />
              </label>
              <button
                type="button"
                data-testid="btn-check-range"
                className="btn btn-success btn-sm"
                onClick={() => handleToggleRange(rangeStart, rangeEnd, true)}
              >
                Cocher {rangeStart} à {rangeEnd}
              </button>
              <button
                type="button"
                data-testid="btn-uncheck-range"
                className="btn btn-ghost btn-sm"
                onClick={() => handleToggleRange(rangeStart, rangeEnd, false)}
              >
                Décocher
              </button>
            </div>
          </fieldset>
        </section>
      )}

      {courseStats && (
        <section aria-labelledby="blocks-heading">
          <h2 id="blocks-heading" className="section-title">
            Blocs du cours
          </h2>
          <div className="grid-3" style={{ gap: '0.6rem' }}>
            {courseStats.blocks.map((b) => (
              <div key={b.blockId} className="card card-sm stack-sm">
                <div className="row-between">
                  <strong className="small">{b.label}</strong>
                  <span className="mono badge badge-neutral">{b.weightedPercent} %</span>
                </div>
                <div className="muted small">
                  Leçons {b.firstLecture} à {b.lastLecture} ({b.doneItems}/{b.totalItems}), priorité {b.priority}
                </div>
                <div className="cluster">
                  <button type="button" className="btn btn-success btn-sm" onClick={() => handleToggleRange(b.firstLecture, b.lastLecture, true)}>
                    Tout cocher
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-pressed={selectedBlockFilter === b.blockId}
                    onClick={() => setSelectedBlockFilter(selectedBlockFilter === b.blockId ? 'ALL' : b.blockId)}
                  >
                    {selectedBlockFilter === b.blockId ? 'Voir tout' : 'Voir ce bloc'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="card" aria-labelledby="lessons-heading">
        <div className="card-header">
          <h2 id="lessons-heading" className="card-title">
            Leçons {selectedBlockFilter !== 'ALL' ? 'du bloc' : ''}
          </h2>
          <span className="muted small mono">{visibleItems.length}</span>
        </div>
        {loadingCourse ? (
          <p className="muted" role="status">
            Chargement des leçons…
          </p>
        ) : (
          <div className="table-scroll" style={{ maxHeight: '520px' }} tabIndex={0} role="region" aria-label="Liste des leçons">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Fait</th>
                  <th scope="col">N°</th>
                  <th scope="col">Leçon</th>
                  <th scope="col" className="hide-mobile">Bloc</th>
                  <th scope="col">Durée</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr key={item.i} data-testid={`lesson-row-${selectedCourseKey}-${item.i}`}>
                    <td>
                      <input
                        type="checkbox"
                        data-testid={`lesson-checkbox-${selectedCourseKey}-${item.i}`}
                        checked={Boolean(item.done)}
                        onChange={(e) => handleToggleSingleItem(item.i, e.target.checked)}
                        aria-label={`Leçon ${item.i} terminée : ${item.title}`}
                      />
                    </td>
                    <td className="mono">{item.i}</td>
                    <td>
                      <span className="badge badge-neutral" style={{ marginRight: '0.4rem' }}>
                        {item.type}
                      </span>
                      {item.title}
                    </td>
                    <td className="mono small hide-mobile">{item.block}</td>
                    <td className="mono small" style={{ whiteSpace: 'nowrap' }}>
                      {item.minutes} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <details className="disclosure">
        <summary>
          <Search size={18} aria-hidden />
          Carte des sujets et correspondance avec les leçons
          <ChevronDown size={18} className="chevron" aria-hidden />
        </summary>
        <div className="disclosure-body stack">
          <div>
            <label className="field" htmlFor="topic-search-input">
              Rechercher un sujet (Glue, Kinesis, S3, Athena, snapshots, incremental…)
              <input
                id="topic-search-input"
                type="search"
                data-testid="topic-search-input"
                placeholder="Ex. Kinesis"
                value={topicQuery}
                onChange={(e) => setTopicQuery(e.target.value)}
              />
            </label>
          </div>
          <div className="grid-2">
            <div>
              <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem' }}>
                Sujets dbt <span className="muted mono">{dbtTopics.length}</span>
              </h3>
              <div className="table-scroll" style={{ maxHeight: '280px' }} tabIndex={0} role="region" aria-label="Sujets dbt">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Sujet</th>
                      <th scope="col">Toth</th>
                      <th scope="col">Weigel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbtTopics.map((t) => (
                      <tr key={t.id} data-testid={`topic-row-${t.id}`}>
                        <td>
                          <strong>{t.label}</strong>
                        </td>
                        <td className="mono small">{formatRanges(t.toth)}</td>
                        <td className="mono small">{formatRanges(t.weigel)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem' }}>
                Sujets AWS <span className="muted mono">{awsTopics.length}</span>
              </h3>
              <div className="table-scroll" style={{ maxHeight: '280px' }} tabIndex={0} role="region" aria-label="Sujets AWS">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Sujet</th>
                      <th scope="col">Domaine</th>
                      <th scope="col">Maarek et Kane</th>
                      <th scope="col">Nikolai, Merico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awsTopics.map((t) => (
                      <tr key={t.id} data-testid={`topic-row-${t.id}`}>
                        <td>
                          <strong>{t.label}</strong>
                        </td>
                        <td>
                          <span className="mono badge badge-info">{t.dea_domain}</span>
                        </td>
                        <td className="mono small">{formatRanges(t.maarek)}</td>
                        <td className="mono small">
                          N : {formatRanges(t.nikolai)}, M : {formatRanges(t.merico)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </details>

      <details className="disclosure">
        <summary>
          Ressources AWS Skill Builder gratuites
          <span className="badge badge-neutral">{state.staticData.awsSkillBuilderCatalogue.length}</span>
          <ChevronDown size={18} className="chevron" aria-hidden />
        </summary>
        <div className="disclosure-body">
          <ul className="resource-list">
            {state.staticData.awsSkillBuilderCatalogue.map((res, idx) => (
              <li key={idx} className="resource-row">
                <span className="badge badge-info">{res.exam}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{res.title}</div>
                  <div className="muted small">
                    {res.type}, <span className="mono">{res.minutes} min</span> : {res.usage}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
};
