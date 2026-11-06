import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Code2,
  Headphones,
  History,
  Layers,
  Moon,
  Settings,
  Sun,
  Sunrise,
  UserRound,
  WifiOff,
  X,
} from 'lucide-react';
import { apiClient, AppStateResponse, RescheduleApiResponse } from './apiClient';
import { CertCode, PodcastEpisode, UnifiedTask } from './domain/types';
import { RescheduleTrigger } from './domain/rescheduler';
import { TaskNavigationTarget } from './domain/taskNavigation';
import { DashboardView } from './components/DashboardView';
import { PlanningView } from './components/PlanningView';
import { CoursesView } from './components/CoursesView';
import { CoursHubView } from './components/CoursHubView';
import { SessionsView } from './components/SessionsView';
import { SpacedRepetitionView } from './components/SpacedRepetitionView';
import { SettingsView } from './components/SettingsView';
import { InterviewsHubView } from './components/InterviewsHubView';
import { CompetencyMatrixView } from './components/CompetencyMatrixView';
import { PodcastPlayerBar } from './components/PodcastPlayerBar';
import { getEffectiveTodayIso } from './domain/dates';
import { weekdayIndex } from './domain/podcastSchedule';
import {
  certColor,
  CERT_SHORT_LABEL,
  CoursSection,
  Destination,
  DESTINATION_LABELS,
  PratiqueSection,
  PRIMARY_DESTINATIONS,
  resolveTarget,
} from './ui/navigation';
import { applyTheme, readStoredTheme, storeTheme, ThemeName } from './ui/theme';

// Conservé pour compatibilité avec les anciens imports
export type NavTab =
  | 'dashboard'
  | 'planning'
  | 'courses'
  | 'certifications'
  | 'sessions'
  | 'srs'
  | 'settings'
  | 'interviews';

const NAV_ICONS: Record<Destination, React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>> = {
  today: Sunrise,
  planning: CalendarDays,
  cours: BookOpen,
  pratique: Code2,
  podcasts: Headphones,
  competences: BarChart3,
  seances: History,
  revision: Layers,
  reglages: Settings,
};

function findWeekFromDate(dateIso: string, state: AppStateResponse): number {
  for (const w of state.staticData.planningHebdo.weeks) {
    if (dateIso >= w.start && dateIso <= w.end) {
      return w.week;
    }
  }
  return 1;
}

function daysBetween(fromIso: string, toIso: string): number {
  const d1 = new Date(`${fromIso}T00:00:00Z`).getTime();
  const d2 = new Date(`${toIso}T00:00:00Z`).getTime();
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}

export const App: React.FC = () => {
  const [state, setState] = useState<AppStateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [dest, setDest] = useState<Destination>('today');
  const [coursSection, setCoursSection] = useState<CoursSection>('CLF-C02');
  const [pratiqueSection, setPratiqueSection] = useState<PratiqueSection>('courses');
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [theme, setTheme] = useState<ThemeName>(() => (typeof window === 'undefined' ? 'dark' : readStoredTheme()));
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  const [lastRescheduleReport, setLastRescheduleReport] = useState<
    RescheduleApiResponse['rescheduleReport'] | null
  >(null);
  const [navTarget, setNavTarget] = useState<TaskNavigationTarget | null>(null);
  const [navNonce, setNavNonce] = useState<number>(0);
  const [activePodcastEpisodeId, setActivePodcastEpisodeId] = useState<string | null>(null);
  const [playQueue, setPlayQueue] = useState<string[] | null>(null);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

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

  // Fermeture du menu profil au clic extérieur ou avec Échap
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    apiClient
      .fetchState()
      .then((initialState) => {
        setState(initialState);
        const realWeek = findWeekFromDate(getEffectiveTodayIso(initialState.settings), initialState);
        setCurrentWeek(realWeek);
        setActiveWeek(initialState.settings.active_week_override || realWeek);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const goTo = (next: Destination) => {
    setDest(next);
    setMenuOpen(false);
    setNavTarget(null);
    window.scrollTo({ top: 0 });
  };

  const handleNavigateToTarget = (target: TaskNavigationTarget) => {
    if (target.externalUrl) {
      window.open(target.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const resolved = resolveTarget(target);
    setNavTarget(target);
    setNavNonce((prev) => prev + 1);
    if (resolved.coursSection) setCoursSection(resolved.coursSection);
    if (resolved.pratiqueSection) setPratiqueSection(resolved.pratiqueSection);
    setDest(resolved.dest);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const nextExam = useMemo(() => {
    if (!state) return null;
    const todayIso = getEffectiveTodayIso(state.settings);
    const order: CertCode[] = ['CLF-C02', 'DBT', 'DEA-C01'];
    for (const code of order) {
      const days = daysBetween(todayIso, state.settings.exam_dates[code]);
      if (days >= 0) return { code, days };
    }
    return null;
  }, [state]);

  if (loading) {
    return (
      <div className="app" style={{ display: 'grid', placeItems: 'center', padding: '2rem' }}>
        <div className="stack-sm" style={{ alignItems: 'center' }}>
          <div className="brand-mark" aria-hidden="true">CDI</div>
          <p className="muted" role="status">Chargement de ton espace de préparation…</p>
        </div>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="app" style={{ padding: '2rem' }}>
        <div className="alert alert-danger" role="alert">
          Erreur de chargement : {error || 'état introuvable'}
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
    setCurrentWeek(matchedWeek);
    setActiveWeek(matchedWeek);
  };

  const playEpisode = (ep: PodcastEpisode, queue: string[] | null = null) => {
    setPlayQueue(queue);
    setActivePodcastEpisodeId(ep.id);
  };

  const markListened = async (ep: PodcastEpisode) => {
    const nextState = await apiClient.updatePodcastProgress({
      episode_id: ep.id,
      listen_count: (ep.listen_count || 0) + 1,
    });
    setState(nextState);
  };

  const toggleTheme = () => {
    const next: ThemeName = theme === 'dark' ? 'light' : 'dark';
    storeTheme(next);
    setTheme(next);
  };

  const allPodcasts = state.podcasts || [];
  const readyPodcastsCount = allPodcasts.filter((p) => p.file_exists).length;
  const activePodcastEpisode: PodcastEpisode | null =
    allPodcasts.find((p) => p.id === activePodcastEpisodeId) || null;
  const dueCount = state.dueFlashcards.length;

  const primaryCounts: Partial<Record<Destination, string>> = {
    planning: `S${currentWeek}`,
    podcasts: `${readyPodcastsCount}/${allPodcasts.length}`,
  };

  const secondaryItems: Array<{ id: Destination; hint?: string }> = [
    { id: 'revision', hint: dueCount > 0 ? `${dueCount} à revoir` : undefined },
    { id: 'seances', hint: state.studySessions.length > 0 ? String(state.studySessions.length) : undefined },
    { id: 'competences' },
    { id: 'reglages' },
  ];

  const renderNavButton = (id: Destination, variant: 'rail' | 'bottom') => {
    const Icon = NAV_ICONS[id];
    const isActive = dest === id;
    if (variant === 'bottom') {
      return (
        <button
          key={id}
          type="button"
          className="bottom-nav-item"
          data-testid={`bottom-nav-${id}`}
          aria-current={isActive ? 'page' : undefined}
          onClick={() => goTo(id)}
        >
          <span className="nav-icon-wrap">
            <Icon size={22} aria-hidden />
          </span>
          <span>{DESTINATION_LABELS[id]}</span>
        </button>
      );
    }
    return (
      <button
        key={id}
        type="button"
        className="rail-item"
        data-testid={`nav-tab-${id}`}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => goTo(id)}
      >
        <Icon size={22} aria-hidden />
        <span>{DESTINATION_LABELS[id]}</span>
        {primaryCounts[id] && <span className="rail-count">{primaryCounts[id]}</span>}
      </button>
    );
  };

  const playerVisible = Boolean(activePodcastEpisode);

  return (
    <div
      className="app"
      style={{ ['--player-height' as string]: playerVisible ? '72px' : '0px' } as React.CSSProperties}
    >
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <nav className="rail" aria-label="Navigation principale">
        <button type="button" className="rail-brand" onClick={() => goTo('today')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <span className="brand-mark" aria-hidden="true">CDI</span>
          <span className="brand-text">
            <strong>Prépa CDI</strong>
            <span>Data &amp; AI Engineer</span>
          </span>
        </button>
        <div className="rail-nav">{PRIMARY_DESTINATIONS.map((id) => renderNavButton(id, 'rail'))}</div>
      </nav>

      <div className="app-body">
        {!isOnline && (
          <div role="status" data-testid="offline-banner" className="app-banner">
            <WifiOff size={18} aria-hidden />
            <span>Hors ligne : tu consultes les dernières données et les épisodes téléchargés. Les modifications reprendront au retour du réseau.</span>
          </div>
        )}

        <header className="topbar">
          <h1 className="topbar-title">{DESTINATION_LABELS[dest]}</h1>
          <div className="topbar-actions">
            {nextExam && (
              <span
                className="exam-chip"
                style={{ ['--cert-color' as string]: certColor(nextExam.code) } as React.CSSProperties}
                title={`Prochain examen : ${CERT_SHORT_LABEL[nextExam.code]} le ${state.settings.exam_dates[nextExam.code]}`}
              >
                <span className="cert-dot" aria-hidden="true" />
                <span className="exam-chip-label">{CERT_SHORT_LABEL[nextExam.code]}</span>
                <strong>J-{nextExam.days}</strong>
              </span>
            )}
            <button
              type="button"
              className="icon-btn hide-mobile"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
              title={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
            >
              {theme === 'dark' ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
            </button>
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className="icon-btn"
                data-testid="profile-menu-btn"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Menu profil : compétences, séances, révision, réglages"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <UserRound size={22} aria-hidden />
              </button>
              {menuOpen && (
                <div className="menu-popover" role="menu" aria-label="Menu profil">
                  <div className="menu-label">Auren</div>
                  {secondaryItems.map(({ id, hint }) => {
                    const Icon = NAV_ICONS[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        role="menuitem"
                        className="menu-item"
                        data-testid={`nav-tab-${id}`}
                        aria-current={dest === id ? 'page' : undefined}
                        onClick={() => goTo(id)}
                      >
                        <Icon size={20} aria-hidden />
                        <span>{DESTINATION_LABELS[id]}</span>
                        {hint && <span className="menu-hint">{hint}</span>}
                      </button>
                    );
                  })}
                  <div className="menu-separator" role="separator" />
                  <button type="button" role="menuitem" className="menu-item" onClick={toggleTheme} data-testid="theme-toggle">
                    {theme === 'dark' ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
                    <span>{theme === 'dark' ? 'Thème clair' : 'Thème sombre'}</span>
                  </button>
                  {state.hasDemoData && (
                    <button
                      type="button"
                      role="menuitem"
                      className="menu-item"
                      data-testid="header-clear-demo-btn"
                      onClick={async () => {
                        const next = await apiClient.clearDemoData();
                        setState(next);
                        setMenuOpen(false);
                      }}
                    >
                      <X size={20} aria-hidden />
                      <span>Supprimer les données de démo</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <main id="contenu" ref={mainRef} className="app-main" tabIndex={-1}>
          {dest === 'today' && (
            <DashboardView
              state={state}
              activeWeek={activeWeek}
              currentWeek={currentWeek}
              setActiveWeek={setActiveWeek}
              lastRescheduleReport={lastRescheduleReport}
              onDismissRescheduleReport={() => setLastRescheduleReport(null)}
              onCompleteTask={handleCompleteTask}
              onReopenTask={handleReopenTask}
              onPostponeTask={handlePostponeTaskFromDashboard}
              onSkipBonusTask={handleSkipBonusTask}
              onUpdateSimulatedDate={handleUpdateSimulatedDate}
              onNavigateToTarget={handleNavigateToTarget}
              onResumePodcast={(ep) => playEpisode(ep)}
              onPlayQueue={playEpisode}
              onMarkListened={markListened}
              activeEpisodeId={activePodcastEpisodeId}
            />
          )}

          {dest === 'planning' && (
            <PlanningView
              state={state}
              currentWeek={currentWeek}
              lastRescheduleReport={lastRescheduleReport}
              onCompleteTask={handleCompleteTask}
              onReopenTask={handleReopenTask}
              onEditTaskDuration={handleEditTaskDuration}
              onSkipBonusTask={handleSkipBonusTask}
              onTriggerReschedule={handleTriggerReschedule}
              onNavigateToTarget={handleNavigateToTarget}
              todayDay={weekdayIndex(getEffectiveTodayIso(state.settings))}
              activeEpisodeId={activePodcastEpisodeId}
              onPlayQueue={playEpisode}
            />
          )}

          {dest === 'cours' && (
            <CoursHubView
              state={state}
              section={coursSection}
              onSectionChange={setCoursSection}
              onRefreshState={setState}
              navTarget={navTarget}
              navigationNonce={navNonce}
            />
          )}

          {dest === 'pratique' && (
            <InterviewsHubView
              initialSubTab={pratiqueSection}
              onSubTabChange={(s) => setPratiqueSection(s as PratiqueSection)}
              initialCategory={navTarget?.interviewCategory}
              initialCourseId={navTarget?.interviewCourseId}
              initialSearchQuery={navTarget?.interviewSearchQuery}
              initialExerciseIds={navTarget?.interviewExerciseIds}
              activeTaskLabel={navTarget?.interviewTaskLabel}
              navigationNonce={navNonce}
            />
          )}

          {dest === 'podcasts' && (
            <CoursesView
              mode="podcasts"
              state={state}
              onRefreshState={setState}
              initialPodcastCertFilter={navTarget?.podcastCertFilter}
              navigationNonce={navNonce}
              activeEpisodeId={activePodcastEpisodeId}
              onPlayEpisode={(ep) => playEpisode(ep)}
            />
          )}

          {dest === 'competences' && <CompetencyMatrixView />}

          {dest === 'seances' && (
            <SessionsView state={state} activeWeek={activeWeek} onRefreshState={setState} />
          )}

          {dest === 'revision' && <SpacedRepetitionView state={state} onRefreshState={setState} />}

          {dest === 'reglages' && (
            <SettingsView
              state={state}
              onRefreshState={setState}
              theme={theme}
              onToggleTheme={toggleTheme}
              onUpdateSimulatedDate={handleUpdateSimulatedDate}
            />
          )}
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Navigation principale (mobile)">
        {PRIMARY_DESTINATIONS.map((id) => renderNavButton(id, 'bottom'))}
      </nav>

      <PodcastPlayerBar
        episode={activePodcastEpisode}
        allEpisodes={allPodcasts}
        queue={playQueue}
        onSelectEpisode={(ep) => setActivePodcastEpisodeId(ep.id)}
        onClose={() => {
          setActivePodcastEpisodeId(null);
          setPlayQueue(null);
        }}
        onRefreshState={setState}
      />
    </div>
  );
};
