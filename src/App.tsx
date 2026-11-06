import React, { useEffect, useState } from 'react';
import { apiClient, AppStateResponse, RescheduleApiResponse } from './apiClient';
import { PodcastEpisode, UnifiedTask } from './domain/types';
import { RescheduleTrigger } from './domain/rescheduler';
import { TaskNavigationTarget } from './domain/taskNavigation';
import { DashboardView } from './components/DashboardView';
import { PlanningView } from './components/PlanningView';
import { CoursesView } from './components/CoursesView';
import { CertificationsView } from './components/CertificationsView';
import { SessionsView } from './components/SessionsView';
import { SpacedRepetitionView } from './components/SpacedRepetitionView';
import { SettingsView } from './components/SettingsView';
import { InterviewsHubView } from './components/InterviewsHubView';
import { PodcastPlayerBar } from './components/PodcastPlayerBar';
import { getEffectiveTodayIso } from './domain/dates';

export type NavTab =
  | 'dashboard'
  | 'planning'
  | 'courses'
  | 'certifications'
  | 'sessions'
  | 'srs'
  | 'settings'
  | 'interviews';


function findWeekFromDate(dateIso: string, state: AppStateResponse): number {
  for (const w of state.staticData.planningHebdo.weeks) {
    if (dateIso >= w.start && dateIso <= w.end) {
      return w.week;
    }
  }
  return 1;
}

export const App: React.FC = () => {
  const [state, setState] = useState<AppStateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);
  const [lastRescheduleReport, setLastRescheduleReport] = useState<
    RescheduleApiResponse['rescheduleReport'] | null
  >(null);
  const [navTarget, setNavTarget] = useState<TaskNavigationTarget | null>(null);
  const [navNonce, setNavNonce] = useState<number>(0);
  const [activePodcastEpisodeId, setActivePodcastEpisodeId] = useState<string | null>(null);
  const [showMobileAccessPanel, setShowMobileAccessPanel] = useState<boolean>(false);

  const handleNavigateToTarget = (target: TaskNavigationTarget) => {
    if (target.externalUrl) {
      window.open(target.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setNavTarget(target);
    setNavNonce((prev) => prev + 1);
    setActiveTab(target.tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    apiClient
      .fetchState()
      .then((initialState) => {
        setState(initialState);
        const w =
          initialState.settings.active_week_override ||
          findWeekFromDate(getEffectiveTodayIso(initialState.settings), initialState);
        setActiveWeek(w);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app-shell" style={{ padding: '2rem' }}>
        Chargement de votre espace local SQLite (Auren : Préparation CDI Data & AI Engineer)...
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="app-shell" style={{ padding: '2rem' }}>
        <div className="alert alert-danger">
          Erreur de chargement : {error || 'État introuvable'}
        </div>
      </div>
    );
  }

  const handleCompleteTask = async (task: UnifiedTask) => {
    const nextState = await apiClient.updateTask({
      taskId: task.id,
      status: 'done',
      targetWeek: task.target_week,
      reason: 'Tâche marquée comme terminée par l\'utilisateur',
    });
    setState(nextState);
  };

  const handleReopenTask = async (task: UnifiedTask) => {
    const nextState = await apiClient.updateTask({
      taskId: task.id,
      status: 'todo',
      targetWeek: task.target_week,
      reason: 'Tâche réouverte',
    });
    setState(nextState);
  };

  const handleSkipBonusTask = async (task: UnifiedTask) => {
    const nextState = await apiClient.updateTask({
      taskId: task.id,
      status: 'skipped',
      targetWeek: task.target_week,
      reason: 'Tâche bonus ignorée volontairement',
    });
    setState(nextState);
  };

  const handleEditTaskDuration = async (task: UnifiedTask, newDurationMin: number) => {
    const nextState = await apiClient.updateTask({
      taskId: task.id,
      status: task.status,
      targetWeek: task.target_week,
      customDurationMin: newDurationMin,
      reason: `Durée personnalisée à ${newDurationMin} min`,
    });
    setState(nextState);
  };

  const handleTriggerReschedule = async (trigger: RescheduleTrigger) => {
    const res = await apiClient.triggerReschedule(trigger);
    setLastRescheduleReport(res.rescheduleReport);
    setState(res.state);
  };

  const handlePostponeTaskFromDashboard = async (taskId: string, fromWeek: number) => {
    await handleTriggerReschedule({
      type: 'postpone_task',
      taskId,
      fromWeek,
    });
  };

  const handleUpdateSimulatedDate = async (dateIso: string) => {
    const nextState = await apiClient.saveSettings({ simulated_today: dateIso });
    setState(nextState);
    const matchedWeek = findWeekFromDate(getEffectiveTodayIso(nextState.settings), nextState);
    setActiveWeek(matchedWeek);
  };

  const allPodcasts = state.podcasts || [];
  const readyPodcastsCount = allPodcasts.filter((p) => p.file_exists).length;
  const activePodcastEpisode: PodcastEpisode | null =
    allPodcasts.find((p) => p.id === activePodcastEpisodeId) || null;

  const navItems: Array<{ id: NavTab; label: string; badge?: string | number }> = [
    { id: 'dashboard', label: '1. Tableau de bord', badge: `S${activeWeek}` },
    { id: 'planning', label: '2. Planning & Replanification', badge: '22 sem.' },
    {
      id: 'courses',
      label: '3. Podcasts (44), Snowflake & Udemy',
      badge: `${readyPodcastsCount}/44 🎧`,
    },
    {
      id: 'certifications',
      label: '4. Certifications & Blancs',
      badge: state.mockExams.length,
    },
    { id: 'sessions', label: '5. Journal des séances', badge: state.studySessions.length },
    {
      id: 'srs',
      label: '6. Répétition espacée (SM-2)',
      badge: state.dueFlashcards.length,
    },
    { id: 'settings', label: '7. Réglages & Sauvegarde' },
    { id: 'interviews', label: '8. Entretiens techniques', badge: 'CDI' },
  ];

  const networkUrls = state.networkUrls || [];

  return (
    <div className="app-shell" style={{ paddingBottom: activePodcastEpisode ? '120px' : undefined }}>
      {!isOnline && (
        <div
          role="status"
          data-testid="offline-banner"
          className="badge badge-warning"
          style={{ display: 'block', textAlign: 'center', marginBottom: '0.5rem', padding: '0.45rem' }}
        >
          Hors ligne : consultation des dernières données et des épisodes téléchargés. Les modifications reprendront au retour du réseau.
        </div>
      )}
      <header className="app-header">
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.3rem' }}>
              Cockpit Préparation CDI : Data & AI Engineer (Auren, Devoteam / EPITA)
            </h1>
            <div className="muted" style={{ fontSize: '0.82rem', marginTop: '0.15rem' }}>
              Départ Lundi 9 nov. 2026 | 1. AWS CLF-C02 (27/11/2026) | 2. URGENCE N°1 : dbt Analytics Engineering (08/01/2027) |
              3. AWS DEA-C01 + 15 Quickstarts Snowflake ML (19/03/2027) | Fêtes déc. allégées (6h max)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              data-testid="header-podcasts-quick-btn"
              className="btn btn-primary btn-sm"
              onClick={() =>
                handleNavigateToTarget({
                  tab: 'courses',
                  coursesSubTab: 'podcasts',
                  label: 'Studio Podcasts',
                })
              }
            >
              🎧 Studio Podcasts ({readyPodcastsCount}/44)
            </button>
            <button
              type="button"
              data-testid="header-mobile-access-btn"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowMobileAccessPanel(!showMobileAccessPanel)}
            >
              📱 Accès Mobile Wi-Fi
            </button>
            {state.hasDemoData && (
              <button
                type="button"
                data-testid="header-clear-demo-btn"
                className="btn btn-warning btn-sm"
                onClick={async () => {
                  const next = await apiClient.clearDemoData();
                  setState(next);
                }}
              >
                Supprimer les données [DÉMO] en un clic
              </button>
            )}
            <span className="mono badge badge-neutral">SQLite local : actif</span>
          </div>
        </div>

        {showMobileAccessPanel && (
          <div
            data-testid="mobile-access-panel"
            className="card card-sm"
            style={{
              marginTop: '0.75rem',
              borderLeft: '4px solid #38bdf8',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <strong>📱 Ouvrir l'application et écouter tes Podcasts sur ton Smartphone :</strong>
                <div className="muted" style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                  Connecte ton téléphone au même réseau Wi-Fi (ou partage de connexion) que ce PC, puis ouvre l'une des adresses ci-dessous dans Safari / Chrome Mobile :
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.45rem' }}>
                  {networkUrls.length > 0 ? (
                    networkUrls.map((u) => (
                      <code
                        key={u}
                        style={{
                          padding: '0.3rem 0.6rem',
                          backgroundColor: '#0f172a',
                          color: '#38bdf8',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      >
                        {u}
                      </code>
                    ))
                  ) : (
                    <code style={{ padding: '0.3rem 0.6rem' }}>http://&lt;IP-DE-TON-PC&gt;:5173</code>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowMobileAccessPanel(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        <nav className="nav-tabs" aria-label="Navigation principale" style={{ marginTop: '0.85rem' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              data-testid={`nav-tab-${item.id}`}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="mono badge badge-neutral" style={{ marginLeft: '0.4rem' }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        {/* Bandeau d'explication en cas de replanification recente */}
        {lastRescheduleReport && activeTab === 'dashboard' && (
          <div
            data-testid="dashboard-reschedule-banner"
            className="alert alert-info"
            style={{ marginBottom: '1rem' }}
          >
            <div className="row-between">
              <strong>Dernière replanification dynamique appliquée :</strong>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setLastRescheduleReport(null)}
              >
                Masquer
              </button>
            </div>
            <ul style={{ margin: '0.35rem 0 0 0', paddingLeft: '1.25rem' }}>
              {lastRescheduleReport.explanationFr.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            state={state}
            activeWeek={activeWeek}
            setActiveWeek={setActiveWeek}
            onCompleteTask={handleCompleteTask}
            onReopenTask={handleReopenTask}
            onPostponeTask={handlePostponeTaskFromDashboard}
            onSkipBonusTask={handleSkipBonusTask}
            onUpdateSimulatedDate={handleUpdateSimulatedDate}
            onNavigateToTarget={handleNavigateToTarget}
          />
        )}

        {activeTab === 'planning' && (
          <PlanningView
            state={state}
            lastRescheduleReport={lastRescheduleReport}
            onCompleteTask={handleCompleteTask}
            onReopenTask={handleReopenTask}
            onEditTaskDuration={handleEditTaskDuration}
            onSkipBonusTask={handleSkipBonusTask}
            onTriggerReschedule={handleTriggerReschedule}
            onNavigateToTarget={handleNavigateToTarget}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesView
            state={state}
            onRefreshState={setState}
            initialCourseKey={navTarget?.courseKey}
            initialSubTab={navTarget?.coursesSubTab}
            initialPodcastCertFilter={navTarget?.podcastCertFilter}
            navigationNonce={navNonce}
            activeEpisodeId={activePodcastEpisodeId}
            onPlayEpisode={(ep) => setActivePodcastEpisodeId(ep.id)}
          />
        )}

        {activeTab === 'certifications' && (
          <CertificationsView
            state={state}
            onRefreshState={setState}
            initialCertCode={navTarget?.certCode}
            initialSubTab={navTarget?.certSubTab}
            navigationNonce={navNonce}
          />
        )}

        {activeTab === 'sessions' && (
          <SessionsView
            state={state}
            activeWeek={activeWeek}
            onRefreshState={setState}
          />
        )}

        {activeTab === 'srs' && (
          <SpacedRepetitionView state={state} onRefreshState={setState} />
        )}

        {activeTab === 'settings' && (
          <SettingsView state={state} onRefreshState={setState} />
        )}

        {activeTab === 'interviews' && (
          <InterviewsHubView
            initialSubTab={navTarget?.interviewSubTab}
            initialCategory={navTarget?.interviewCategory}
            initialCourseId={navTarget?.interviewCourseId}
            initialSearchQuery={navTarget?.interviewSearchQuery}
            initialExerciseIds={navTarget?.interviewExerciseIds}
            activeTaskLabel={navTarget?.interviewTaskLabel}
            navigationNonce={navNonce}
          />
        )}
      </main>

      <PodcastPlayerBar
        episode={activePodcastEpisode}
        allEpisodes={allPodcasts}
        onSelectEpisode={(ep) => setActivePodcastEpisodeId(ep.id)}
        onClose={() => setActivePodcastEpisodeId(null)}
        onRefreshState={setState}
      />
    </div>
  );
};

