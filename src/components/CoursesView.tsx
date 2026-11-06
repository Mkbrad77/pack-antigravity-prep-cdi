import React, { useEffect, useState } from 'react';
import { apiClient, AppStateResponse } from '../apiClient';
import { CertCode, CourseKey, LectureRangeRef, PodcastEpisode, UdemyCourse } from '../domain/types';

interface CoursesViewProps {
  state: AppStateResponse;
  onRefreshState: (nextState: AppStateResponse) => void;
  initialCourseKey?: CourseKey;
  initialSubTab?: 'udemy' | 'snowflake_dbt' | 'podcasts';
  initialPodcastCertFilter?: CertCode | 'ALL';
  navigationNonce?: number;
  activeEpisodeId?: string | null;
  onPlayEpisode?: (episode: PodcastEpisode) => void;
}

const COURSE_KEYS: CourseKey[] = ['merico', 'toth', 'weigel', 'maarek', 'nikolai'];

function formatRanges(ranges?: LectureRangeRef[]): string {
  if (!ranges || ranges.length === 0) return 'Aucune leçon associée';
  return ranges
    .map((r) => (r.first === r.last ? `leçon ${r.first}` : `leçons ${r.first} à ${r.last}`))
    .join(', ');
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  state,
  onRefreshState,
  initialCourseKey,
  initialSubTab,
  initialPodcastCertFilter,
  navigationNonce,
  activeEpisodeId,
  onPlayEpisode,
}) => {
  const [activeHubTab, setActiveHubTab] = useState<
    'podcasts_studio' | 'snowflake_dbt_hub' | 'udemy_courses'
  >(
    initialSubTab === 'podcasts'
      ? 'podcasts_studio'
      : initialCourseKey || initialSubTab === 'udemy'
        ? 'udemy_courses'
        : 'podcasts_studio'
  );
  const [selectedCourseKey, setSelectedCourseKey] = useState<CourseKey>(
    initialCourseKey || 'merico'
  );
  const [courseDetail, setCourseDetail] = useState<UdemyCourse | null>(null);
  const [loadingCourse, setLoadingCourse] = useState<boolean>(false);
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(60);
  const [topicQuery, setTopicQuery] = useState<string>('');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('ALL');
  const [mlCategoryFilter, setMlCategoryFilter] = useState<string>('ALL');
  const [mlLevelFilter, setMlLevelFilter] = useState<string>('ALL');

  // Filtres Studio Podcasts NotebookLM
  const [podcastCertFilter, setPodcastCertFilter] = useState<CertCode | 'ALL'>(
    initialPodcastCertFilter || 'ALL'
  );
  const [podcastWeekFilter, setPodcastWeekFilter] = useState<number | 'ALL'>('ALL');
  const [podcastOnlyReady, setPodcastOnlyReady] = useState<boolean>(false);
  const [autoRenameBanner, setAutoRenameBanner] = useState<string>('');
  const [scanningAudios, setScanningAudios] = useState<boolean>(false);

  useEffect(() => {
    if (initialSubTab === 'podcasts') {
      setActiveHubTab('podcasts_studio');
      if (initialPodcastCertFilter) {
        setPodcastCertFilter(initialPodcastCertFilter);
      }
    } else if (initialCourseKey || initialSubTab === 'udemy') {
      if (initialCourseKey) setSelectedCourseKey(initialCourseKey);
      setActiveHubTab('udemy_courses');
    } else if (initialSubTab === 'snowflake_dbt') {
      setActiveHubTab('snowflake_dbt_hub');
    }
  }, [initialCourseKey, initialSubTab, initialPodcastCertFilter, navigationNonce]);

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
    loadCourse(selectedCourseKey);
  }, [selectedCourseKey]);

  const handleToggleSingleItem = async (itemIndex: number, done: boolean) => {
    const nextState = await apiClient.setLessonsDoneRange(selectedCourseKey, [itemIndex], done);
    onRefreshState(nextState);
    await loadCourse(selectedCourseKey);
  };

  const handleToggleRange = async (startIdx: number, endIdx: number, done: boolean) => {
    const lo = Math.min(startIdx, endIdx);
    const hi = Math.max(startIdx, endIdx);
    const indices: number[] = [];
    for (let i = lo; i <= hi; i++) {
      indices.push(i);
    }
    const nextState = await apiClient.setLessonsDoneRange(selectedCourseKey, indices, done);
    onRefreshState(nextState);
    await loadCourse(selectedCourseKey);
  };

  const handleScanAndAutoRename = async () => {
    setScanningAudios(true);
    setAutoRenameBanner('');
    try {
      const res = await apiClient.autoRenamePodcasts();
      onRefreshState(res.state);
      if (res.renamed.length > 0) {
        const listStr = res.renamed
          .map((r) => `${r.from} -> ${r.to} (${r.title})`)
          .join(' | ');
        setAutoRenameBanner(
          `✅ ${res.renamed.length} nouveau(x) fichier(s) audio détecté(s) et renommé(s) automatiquement : ${listStr}`
        );
      } else {
        setAutoRenameBanner(
          '✅ Scan terminé : tous les fichiers audio présents dans public/audios/ sont déjà correctement nommés et synchronisés.'
        );
      }
    } finally {
      setScanningAudios(false);
    }
  };

  const handleUpdateEpisodeListenCount = async (ep: PodcastEpisode, delta: number) => {
    const nextCount = Math.max(0, (ep.listen_count || 0) + delta);
    const nextState = await apiClient.updatePodcastProgress({
      episode_id: ep.id,
      listen_count: nextCount,
    });
    onRefreshState(nextState);
  };

  const courseStats = state.progress.courses[selectedCourseKey];
  const awsTopics = state.staticData.carteDesSujets.aws_topics.filter((t) => {
    if (!topicQuery.trim()) return true;
    const q = topicQuery.toLowerCase();
    return (
      t.label.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.dea_domain.toLowerCase().includes(q)
    );
  });

  const dbtTopics = state.staticData.carteDesSujets.dbt_topics.filter((t) => {
    if (!topicQuery.trim()) return true;
    const q = topicQuery.toLowerCase();
    return t.label.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
  });

  const visibleItems = (courseDetail?.items || []).filter((item) => {
    if (selectedBlockFilter !== 'ALL' && item.block !== selectedBlockFilter) return false;
    return true;
  });

  const hubData = state.staticData.snowflakeDbtResources;
  const mlCategories = Array.from(
    new Set((hubData?.snowflake_ml_quickstarts || []).map((q) => q.category))
  );

  const filteredMlQuickstarts = (hubData?.snowflake_ml_quickstarts || []).filter((q) => {
    if (mlCategoryFilter !== 'ALL' && q.category !== mlCategoryFilter) return false;
    if (mlLevelFilter !== 'ALL' && q.level !== mlLevelFilter) return false;
    return true;
  });

  const allPodcasts = state.podcasts || [];
  const clfReadyCount = allPodcasts.filter((p) => p.cert_code === 'CLF-C02' && p.file_exists).length;
  const dbtReadyCount = allPodcasts.filter((p) => p.cert_code === 'DBT' && p.file_exists).length;
  const deaReadyCount = allPodcasts.filter((p) => p.cert_code === 'DEA-C01' && p.file_exists).length;
  const totalReadyCount = clfReadyCount + dbtReadyCount + deaReadyCount;

  const filteredPodcasts = allPodcasts.filter((ep) => {
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
  });

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div data-testid="courses-view">
      {/* Barre de navigation interne : Podcasts NotebookLM vs Hub Snowflake & dbt vs Cours Udemy */}
      <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--accent-blue)' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
              📚 Hub Formations : 44 Podcasts NotebookLM (Mobile), Quickstarts Snowflake ML (15+) & 5 Cours Udemy
            </h2>
            <p className="muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.86rem' }}>
              Écoute tes podcasts NotebookLM sur mobile dans les transports (écoute récursive 3x), pratique sur Snowflake Free Trial (Fred) et suis tes 5 cours Udemy (départ 0 %).
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              data-testid="tab-podcasts-studio"
              className={`btn ${activeHubTab === 'podcasts_studio' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveHubTab('podcasts_studio')}
            >
              🎧 Studio Podcasts NotebookLM ({totalReadyCount}/44 Prêts)
            </button>
            <button
              type="button"
              data-testid="tab-hub-snowflake-dbt"
              className={`btn ${activeHubTab === 'snowflake_dbt_hub' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveHubTab('snowflake_dbt_hub')}
            >
              ❄️ Hub Snowflake Quickstarts, dbt Learn & Devoteam
            </button>
            <button
              type="button"
              data-testid="tab-udemy-courses"
              className={`btn ${activeHubTab === 'udemy_courses' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveHubTab('udemy_courses')}
            >
              🎬 Mes 5 Cours Udemy & Carte des Sujets
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 0 : STUDIO PODCASTS NOTEBOOKLM (44 EPISODES - MOBILE & ECOUTE RECURSIVE) */}
      {activeHubTab === 'podcasts_studio' && (
        <div data-testid="podcasts-studio-section" style={{ marginBottom: '1.25rem' }}>
          <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #38bdf8' }}>
            <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.12rem' }}>
                  🎧 Studio Audio Mobile & Écoute Récursive : 44 Podcasts NotebookLM (CLF-C02, dbt, DEA-C01)
                </h3>
                <p className="muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.84rem' }}>
                  <strong>Méthode des 3 Écoutes Récursives :</strong> 1re écoute le jour des leçons Udemy (découverte à 1x), 2e écoute à J+3 dans les transports (consolidation à 1.25x), 3e écoute la veille de l'examen blanc (maîtrise à 1.5x).
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  data-testid="btn-auto-rename-audios"
                  className="btn btn-primary btn-sm"
                  disabled={scanningAudios}
                  onClick={handleScanAndAutoRename}
                >
                  {scanningAudios
                    ? '🔄 Scan en cours...'
                    : '🔄 Scanner & Auto-Renommer les nouveaux audios'}
                </button>
              </div>
            </div>

            {autoRenameBanner && (
              <div className="alert alert-info" style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                {autoRenameBanner}
              </div>
            )}

            {/* Compteurs par certification + dossier de depot */}
            <div className="grid-3" style={{ gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div
                className="card card-sm"
                style={{
                  borderLeft: '4px solid #2563eb',
                  cursor: 'pointer',
                  backgroundColor: podcastCertFilter === 'CLF-C02' ? 'var(--bg-secondary)' : undefined,
                }}
                onClick={() => setPodcastCertFilter(podcastCertFilter === 'CLF-C02' ? 'ALL' : 'CLF-C02')}
              >
                <div className="row-between">
                  <strong>1. AWS CLF-C02 (S1 à S3)</strong>
                  <span className="badge badge-success">{clfReadyCount}/12 Prêts ✅</span>
                </div>
                <div className="muted" style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                  Dossier : <code>public/audios/clf-c02/</code> | Examen : <strong>27 nov. 2026</strong>
                </div>
              </div>

              <div
                className="card card-sm"
                style={{
                  borderLeft: '4px solid #d97706',
                  cursor: 'pointer',
                  backgroundColor: podcastCertFilter === 'DBT' ? 'var(--bg-secondary)' : undefined,
                }}
                onClick={() => setPodcastCertFilter(podcastCertFilter === 'DBT' ? 'ALL' : 'DBT')}
              >
                <div className="row-between">
                  <strong>2. dbt Analytics Eng. (S3 à S9)</strong>
                  <span className={`badge ${dbtReadyCount === 16 ? 'badge-success' : 'badge-warning'}`}>
                    {dbtReadyCount}/16 Prêts ({16 - dbtReadyCount} restants)
                  </span>
                </div>
                <div className="muted" style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                  Dossier : <code>public/audios/dbt/</code> | Dépose les 9 restants demain : renommage auto !
                </div>
              </div>

              <div
                className="card card-sm"
                style={{
                  borderLeft: '4px solid #059669',
                  cursor: 'pointer',
                  backgroundColor: podcastCertFilter === 'DEA-C01' ? 'var(--bg-secondary)' : undefined,
                }}
                onClick={() => setPodcastCertFilter(podcastCertFilter === 'DEA-C01' ? 'ALL' : 'DEA-C01')}
              >
                <div className="row-between">
                  <strong>3. AWS DEA-C01 (S10 à S19)</strong>
                  <span className={`badge ${deaReadyCount === 16 ? 'badge-success' : 'badge-info'}`}>
                    {deaReadyCount}/16 Prêts
                  </span>
                </div>
                <div className="muted" style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                  Dossier : <code>public/audios/dea-c01/</code> | Dépose tes fichiers : renommage auto !
                </div>
              </div>
            </div>

            {/* Barre de filtres */}
            <div
              style={{
                display: 'flex',
                gap: '0.6rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {(['ALL', 'CLF-C02', 'DBT', 'DEA-C01'] as const).map((cert) => (
                  <button
                    key={cert}
                    type="button"
                    className={`btn btn-sm ${podcastCertFilter === cert ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setPodcastCertFilter(cert)}
                  >
                    {cert === 'ALL' ? `Tous (${allPodcasts.length})` : cert}
                  </button>
                ))}
              </div>

              <label style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Semaine (1re écoute ou révision) :
                <select
                  value={podcastWeekFilter}
                  onChange={(e) =>
                    setPodcastWeekFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
                  }
                >
                  <option value="ALL">Toutes les semaines (S1 à S22)</option>
                  {Array.from({ length: 22 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>
                      Semaine {w}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={podcastOnlyReady}
                  onChange={(e) => setPodcastOnlyReady(e.target.checked)}
                />
                Afficher uniquement les audios prêts ({totalReadyCount})
              </label>
            </div>
          </div>

          {/* Grille des episodes de Podcast */}
          <div className="grid-2" style={{ gap: '0.85rem' }}>
            {filteredPodcasts.map((ep) => {
              const isPlayingThis = activeEpisodeId === ep.id;
              const listenCount = ep.listen_count || 0;
              return (
                <div
                  key={ep.id}
                  data-testid={`podcast-card-${ep.id}`}
                  className="card card-sm"
                  style={{
                    borderLeft: `4px solid ${
                      isPlayingThis
                        ? '#38bdf8'
                        : ep.file_exists
                          ? 'var(--accent-green)'
                          : 'var(--border)'
                    }`,
                    backgroundColor: isPlayingThis ? 'rgba(56, 189, 248, 0.08)' : undefined,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div className="row-between" style={{ gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="mono badge badge-info">{ep.id}</span>
                        <span className="badge badge-neutral">Semaine {ep.primary_week}</span>
                        {ep.review_weeks && ep.review_weeks.length > 0 && (
                          <span className="mono badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                            🔁 Rév: S{ep.review_weeks.join(', S')}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        {ep.file_exists ? (
                          <span className="badge badge-success">Audio Prêt (~{ep.duration_est_min} min)</span>
                        ) : (
                          <span className="badge badge-warning">À déposer ({ep.filename})</span>
                        )}
                      </div>
                    </div>

                    <strong style={{ fontSize: '0.96rem', display: 'block', marginBottom: '0.2rem' }}>
                      {ep.title}
                    </strong>

                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '0.3rem' }}>
                      📚 {ep.course_lectures} | 🗓️ {ep.schedule_days}
                    </div>

                    <div className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.45rem' }}>
                      {ep.summary}
                    </div>

                    {ep.key_traps && ep.key_traps.length > 0 && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: '6px',
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.76rem',
                          marginBottom: '0.6rem',
                        }}
                      >
                        <strong>⚠️ Pièges d'examen couverts :</strong>
                        <ul style={{ margin: '0.2rem 0 0 0', paddingLeft: '1.1rem' }}>
                          {ep.key_traps.map((trap, idx) => (
                            <li key={idx}>{trap}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div
                    className="row-between"
                    style={{
                      paddingTop: '0.5rem',
                      borderTop: '1px solid var(--border)',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span
                        className={`mono badge ${
                          listenCount >= 3
                            ? 'badge-success'
                            : listenCount >= 1
                              ? 'badge-info'
                              : 'badge-neutral'
                        }`}
                      >
                        🔁 Écoutes : {listenCount}/3
                      </span>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleUpdateEpisodeListenCount(ep, 1)}
                        title="Ajouter 1 écoute récursive"
                      >
                        +1
                      </button>
                      {listenCount > 0 && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleUpdateEpisodeListenCount(ep, -1)}
                          title="Retirer 1 écoute"
                        >
                          -1
                        </button>
                      )}
                    </div>

                    {ep.file_exists ? (
                      <button
                        type="button"
                        data-testid={`play-podcast-btn-${ep.id}`}
                        className={`btn btn-sm ${isPlayingThis ? 'btn-warning' : 'btn-primary'}`}
                        onClick={() => onPlayEpisode && onPlayEpisode(ep)}
                      >
                        {isPlayingThis
                          ? '🔊 En cours de lecture...'
                          : ep.last_position_sec && ep.last_position_sec > 5
                            ? `▶ Reprendre (${Math.floor(ep.last_position_sec / 60)}m${String(Math.floor(ep.last_position_sec % 60)).padStart(2, '0')}s)`
                            : '▶ Écouter sur le lecteur'}
                      </button>
                    ) : (
                      <span className="muted" style={{ fontSize: '0.76rem' }}>
                        Dépose l'audio dans <code>public/audios/{ep.cert_code === 'DBT' ? 'dbt' : ep.cert_code.toLowerCase()}/</code>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeHubTab === 'snowflake_dbt_hub' && hubData && (
        <div data-testid="snowflake-dbt-hub-section">
          {/* Section 1 : Les 2 Free Trials Snowflake de Fred + Accès Communautés Devoteam */}
          <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
              <div className="row-between" style={{ marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                  🎁 1. Tes 2 Comptes Free Trial Snowflake (Liens spéciaux de Fred)
                </h3>
                <span className="badge badge-success">800 $ de crédits cumulés</span>
              </div>
              <p className="muted" style={{ fontSize: '0.82rem', marginTop: 0, marginBottom: '0.75rem' }}>
                Ne les active pas tous en même temps : active le <strong>1er (120 jours + 400 $)</strong> en <strong>Semaine 4</strong> pour la certification dbt et les premiers Quickstarts ML, puis le <strong>2e (Cortex Code 30 jours)</strong> en <strong>Semaine 15</strong>.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {hubData.free_trials.map((trial) => (
                  <div
                    key={trial.id}
                    className="card card-sm"
                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                  >
                    <div className="row-between" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong>{trial.title}</strong>
                      <span className="badge badge-info">{trial.badge}</span>
                    </div>
                    <div className="muted" style={{ fontSize: '0.81rem', margin: '0.3rem 0' }}>
                      {trial.description}
                    </div>
                    <div className="row-between" style={{ marginTop: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span className="mono badge badge-warning" style={{ fontSize: '0.75rem' }}>
                        ⏰ Activation : {trial.when_to_activate}
                      </span>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => openExternal(trial.url)}
                      >
                        ❄️ Ouvrir le lien Free Trial ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
              <div className="row-between" style={{ marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                  🏢 2. Accès Internes Devoteam, Partner Portals & Communautés
                </h3>
                <span className="badge badge-info">Ressources Senior Devoteam</span>
              </div>
              <p className="muted" style={{ fontSize: '0.82rem', marginTop: 0, marginBottom: '0.75rem' }}>
                Liens internes Devoteam filtrés pour ton objectif (dbt Analytics Engineering + pratique Snowflake) :
              </p>
              <div style={{ maxHeight: '295px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {hubData.devoteam_communities.map((comm) => (
                  <div
                    key={comm.id}
                    className="card card-sm"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}
                  >
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{comm.domain}</span>
                        <strong style={{ fontSize: '0.86rem' }}>{comm.title}</strong>
                      </div>
                      <div className="muted" style={{ fontSize: '0.78rem', marginTop: '0.15rem' }}>
                        {comm.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openExternal(comm.url)}
                    >
                      🔗 Ouvrir ➔
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2 : Priorité Urgente N°1 - Certification dbt Analytics Engineering (Semaines 4 à 10) */}
          <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--warning)' }}>
            <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                  🎯 3. Priorité Urgente N°1 : Parcours Officiel Certification dbt Analytics Engineering (Semaines 4 à 10 : Examen 08/01/2027)
                </h3>
                <p className="muted" style={{ margin: '0.2rem 0 0 0', fontSize: '0.84rem' }}>
                  Tous les modules officiels <code>learn.getdbt.com</code>, le Study Guide officiel, le Google Doc de retours d'expérience Devoteam et les examens blancs Qanalabs, intégrés semaine par semaine dans ton planning :
                </p>
              </div>
              <span className="badge badge-warning">Semaines 4 à 10</span>
            </div>

            <div style={{ maxHeight: '340px', overflowY: 'auto', marginBottom: '1rem' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Semaine</th>
                    <th>Catégorie</th>
                    <th>Ressource Officielle dbt / Devoteam</th>
                    <th>Priorité</th>
                    <th>Durée</th>
                    <th>Action directe</th>
                  </tr>
                </thead>
                <tbody>
                  {hubData.dbt_certification_resources.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="mono badge badge-info">S{item.week}</span>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{item.category}</span>
                      </td>
                      <td>
                        <strong>{item.title}</strong>
                        <div className="muted" style={{ fontSize: '0.78rem' }}>{item.description}</div>
                      </td>
                      <td>
                        <span className={`badge ${item.priority === 'core' ? 'badge-core' : 'badge-bonus'}`}>
                          {item.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="mono">{item.est_min > 0 ? `${item.est_min} min` : 'Inclus'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => openExternal(item.url)}
                        >
                          🌐 Ouvrir ➔
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 style={{ margin: '0.5rem 0', fontSize: '0.98rem' }}>
              ❄️ Les 6 Quickstarts Officiels Conjoints dbt Cloud & Snowflake (Pratique SQL/Jinja/Iceberg/Cortex) :
            </h4>
            <div className="grid-3" style={{ gap: '0.65rem' }}>
              {hubData.dbt_snowflake_quickstarts.map((qs) => (
                <div key={qs.id} className="card card-sm">
                  <div className="row-between" style={{ gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span className="mono badge badge-info">Semaine {qs.week}</span>
                    <span className={`badge ${qs.priority === 'core' ? 'badge-core' : 'badge-bonus'}`}>
                      {qs.priority.toUpperCase()} ({qs.est_min} min)
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: '0.25rem' }}>
                    {qs.title}
                  </strong>
                  <div className="muted" style={{ fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                    {qs.description}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', fontWeight: 600 }}
                    onClick={() => openExternal(qs.url)}
                  >
                    ❄️ Lancer le Quickstart dbt + Snowflake ➔
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 : Les 15 Quickstarts Officiels Snowflake ML (+ 2 Quickstarts DE / Cortex Agents) */}
          <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--accent-blue)' }}>
            <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                  🚀 4. Catalogue Complet des 15 Quickstarts Officiels Snowflake ML (+ 2 Labs Cortex AI / Iceberg)
                </h3>
                <p className="muted" style={{ margin: '0.2rem 0 0 0', fontSize: '0.84rem' }}>
                  Source officielle :{' '}
                  <a
                    href="https://docs.snowflake.com/en/developer-guide/snowflake-ml/quickstart"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    docs.snowflake.com/en/developer-guide/snowflake-ml/quickstart
                  </a>{' '}
                  | Planifiés au rythme de 1 à 2 Quickstarts par semaine entre la Semaine 5 et la Semaine 22.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <label style={{ fontSize: '0.82rem' }}>
                  Catégorie :{' '}
                  <select
                    value={mlCategoryFilter}
                    onChange={(e) => setMlCategoryFilter(e.target.value)}
                  >
                    <option value="ALL">Toutes ({hubData.snowflake_ml_quickstarts.length})</option>
                    {mlCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>
                <label style={{ fontSize: '0.82rem' }}>
                  Niveau :{' '}
                  <select
                    value={mlLevelFilter}
                    onChange={(e) => setMlLevelFilter(e.target.value)}
                  >
                    <option value="ALL">Tous niveaux</option>
                    <option value="Beginner">Beginner (Débutant)</option>
                    <option value="Intermediate">Intermediate (Intermédiaire)</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="grid-3" style={{ gap: '0.75rem' }}>
              {filteredMlQuickstarts.map((qs) => (
                <div
                  key={qs.id}
                  data-testid={`ml-quickstart-card-${qs.number}`}
                  className="card card-sm"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderTop: `3px solid ${qs.level === 'Beginner' ? 'var(--accent-green)' : 'var(--accent-blue)'}`,
                  }}
                >
                  <div>
                    <div className="row-between" style={{ gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <span className="mono badge badge-neutral">#{qs.number} | S{qs.week}</span>
                      <span className={`badge ${qs.level === 'Beginner' ? 'badge-success' : 'badge-info'}`}>
                        {qs.level}
                      </span>
                      <span className={`badge ${qs.priority === 'core' ? 'badge-core' : 'badge-bonus'}`}>
                        {qs.priority.toUpperCase()} ({qs.est_min} min)
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '0.2rem' }}>
                      {qs.category}
                    </div>
                    <strong style={{ fontSize: '0.92rem', display: 'block', marginBottom: '0.3rem' }}>
                      {qs.title}
                    </strong>
                    <div className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                      {qs.description}
                    </div>
                    <div className="muted" style={{ fontSize: '0.76rem', marginBottom: '0.6rem' }}>
                      <strong>Livrable :</strong> {qs.deliverable}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => openExternal(qs.url)}
                  >
                    ❄️ Ouvrir le Quickstart #{qs.number} ➔
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recherche dans la carte des sujets + 5 cours Udemy */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>
              Carte des sujets techniques et correspondances leçons Udemy / AWS Skill Builder
            </h2>
            <p className="muted" style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem' }}>
              Recherchez un sujet (ex. Glue, Kinesis, S3, Athena, snapshots, incremental) pour
              identifier immédiatement les plages de leçons correspondantes dans vos cours.
            </p>
          </div>
          <input
            type="search"
            data-testid="topic-search-input"
            placeholder="Rechercher un sujet (ex. Glue, Kinesis, snapshots)..."
            value={topicQuery}
            onChange={(e) => setTopicQuery(e.target.value)}
            style={{ minWidth: '280px' }}
          />
        </div>

        <div className="grid-2" style={{ gap: '0.85rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', marginTop: 0 }}>
              Sujets dbt Analytics Engineering ({dbtTopics.length}) : Priorité S4-S10
            </h3>
            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Sujet dbt</th>
                    <th>Cours Zoltan C. Toth</th>
                    <th>Cours Daniel Weigel</th>
                  </tr>
                </thead>
                <tbody>
                  {dbtTopics.map((t) => (
                    <tr key={t.id} data-testid={`topic-row-${t.id}`}>
                      <td>
                        <strong>{t.label}</strong>
                      </td>
                      <td className="mono" style={{ fontSize: '0.78rem' }}>
                        {formatRanges(t.toth)}
                      </td>
                      <td className="mono" style={{ fontSize: '0.78rem' }}>
                        {formatRanges(t.weigel)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '0.95rem', marginTop: 0 }}>
              Sujets AWS Data Engineering ({awsTopics.length}) : S1-S3 (CLF) & S11-S20 (DEA)
            </h3>
            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Sujet</th>
                    <th>Domaine</th>
                    <th>Maarek & Kane</th>
                    <th>Nikolai / Merico</th>
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
                      <td className="mono" style={{ fontSize: '0.78rem' }}>
                        {formatRanges(t.maarek)}
                      </td>
                      <td className="mono" style={{ fontSize: '0.78rem' }}>
                        N: {formatRanges(t.nikolai)} | M: {formatRanges(t.merico)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Selecteur des 5 cours Udemy */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.15rem' }}>
          Suivi détaillé de mes 5 cours Udemy (départ 0 % sur chaque cours : Merico S1-S3, Toth & Weigel S4-S10, Maarek & Nikolai S11-S20)
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {COURSE_KEYS.map((key) => {
            const st = state.progress.courses[key];
            const isSelected = key === selectedCourseKey;
            return (
              <button
                key={key}
                type="button"
                data-testid={`select-course-${key}`}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCourseKey(key)}
              >
                {key.toUpperCase()} ({st?.doneItems ?? 0}/{st?.totalItems ?? 0} :{' '}
                {st?.weightedPercent ?? 0} %)
              </button>
            );
          })}
        </div>

        {courseStats && (
          <div className="card card-sm" style={{ marginBottom: '1rem' }}>
            <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{courseStats.title}</h3>
                <div className="muted" style={{ fontSize: '0.84rem' }}>
                  Formateur : <strong>{courseStats.instructor}</strong> | Rôle : {courseStats.role}{' '}
                  | Facteur temps : <span className="mono">x{courseStats.timeFactor}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  {courseStats.weightedPercent} % pondéré
                </div>
                <div className="muted" style={{ fontSize: '0.8rem' }}>
                  {courseStats.doneItems}/{courseStats.totalItems} éléments |{' '}
                  {courseStats.estimatedMinutesDone}/{courseStats.estimatedMinutesTotal} min
                  estimées
                </div>
              </div>
            </div>

            {/* Action rapide : cocher ou decocher une plage de lecons */}
            <div
              style={{
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '0.85rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              <strong>Validation par plage de leçons :</strong>
              <label>
                De n°{' '}
                <input
                  type="number"
                  data-testid="range-start-input"
                  min={1}
                  max={courseStats.totalItems}
                  value={rangeStart}
                  onChange={(e) => setRangeStart(Number(e.target.value))}
                  style={{ width: '75px' }}
                />
              </label>
              <label>
                à n°{' '}
                <input
                  type="number"
                  data-testid="range-end-input"
                  min={1}
                  max={courseStats.totalItems}
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(Number(e.target.value))}
                  style={{ width: '75px' }}
                />
              </label>
              <button
                type="button"
                data-testid="btn-check-range"
                className="btn btn-success btn-sm"
                onClick={() => handleToggleRange(rangeStart, rangeEnd, true)}
              >
                Cocher les leçons {rangeStart} à {rangeEnd} d'un coup
              </button>
              <button
                type="button"
                data-testid="btn-uncheck-range"
                className="btn btn-secondary btn-sm"
                onClick={() => handleToggleRange(rangeStart, rangeEnd, false)}
              >
                Décocher la plage
              </button>
            </div>
          </div>
        )}

        {/* Blocs thematiques du cours selectionne */}
        {courseStats && (
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Blocs thématiques du cours :</h4>
            <div className="grid-3" style={{ gap: '0.6rem' }}>
              {courseStats.blocks.map((b) => (
                <div key={b.blockId} className="card card-sm">
                  <div className="row-between">
                    <strong style={{ fontSize: '0.88rem' }}>{b.label}</strong>
                    <span className="mono badge badge-neutral">{b.weightedPercent} %</span>
                  </div>
                  <div className="muted" style={{ fontSize: '0.78rem', margin: '0.25rem 0' }}>
                    Leçons {b.firstLecture} à {b.lastLecture} ({b.doneItems}/{b.totalItems}) |
                    Priorité : <code>{b.priority}</code>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => handleToggleRange(b.firstLecture, b.lastLecture, true)}
                    >
                      Tout cocher ({b.firstLecture}-{b.lastLecture})
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        setSelectedBlockFilter(
                          selectedBlockFilter === b.blockId ? 'ALL' : b.blockId
                        )
                      }
                    >
                      {selectedBlockFilter === b.blockId ? 'Voir tout' : 'Filtrer'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liste des lecons individuelles */}
        {loadingCourse ? (
          <p className="muted">Chargement des leçons...</p>
        ) : (
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Fait</th>
                  <th>N°</th>
                  <th>Type</th>
                  <th>Titre de la leçon</th>
                  <th>Bloc</th>
                  <th>Durée vidéo</th>
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
                      />
                    </td>
                    <td className="mono">{item.i}</td>
                    <td>
                      <span className="badge badge-neutral">{item.type}</span>
                    </td>
                    <td>{item.title}</td>
                    <td className="mono" style={{ fontSize: '0.78rem' }}>
                      {item.block}
                    </td>
                    <td className="mono">{item.minutes} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ressources AWS Skill Builder gratuites */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          Ressources officielles AWS Skill Builder retenues (gratuites)
        </h3>
        <table className="table">
          <thead>
            <tr>
              <th>Examen</th>
              <th>Titre de la ressource officielle</th>
              <th>Type</th>
              <th>Durée</th>
              <th>Usage recommandé</th>
            </tr>
          </thead>
          <tbody>
            {state.staticData.awsSkillBuilderCatalogue.map((res, idx) => (
              <tr key={idx}>
                <td>
                  <span className="badge badge-info">{res.exam}</span>
                </td>
                <td>
                  <strong>{res.title}</strong>
                </td>
                <td>{res.type}</td>
                <td className="mono">{res.minutes} min</td>
                <td className="muted">{res.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
