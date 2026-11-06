import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, ChevronDown, Database, Eye, Lightbulb, Pause, Play, RotateCcw, Search, Timer, Trash2 } from 'lucide-react';
import { MOBILE_QUERY, useMediaQuery } from '../ui/useMediaQuery';
import {
  executeSqlSandbox,
  fetchSqlDatasets,
  fetchSqlExercises,
  SqlDatasetSummary,
  SqlExerciseSummary,
  SqlSandboxResponse,
} from '../apiClient';

const CATEGORY_LABELS: Record<string, string> = {
  select_where: '1. SELECT & WHERE',
  group_by_having: '2. GROUP BY & HAVING',
  joins: '3. Jointures & Anti-Joins',
  cte: '4. CTE & Modularité',
  window_functions: '5. Fonctions de fenêtrage',
  case_when: '6. CASE WHEN & Pivot',
  dates: '7. Dates & Intervalles',
  deduplication: '8. Dédoublonnage de flux',
  transactions: '9. Transactions & SCD',
  index_explain: '10. Index & EXPLAIN',
  optimisation: '11. Optimisation de requêtes',
  modeling: '12. Modélisation Kimball',
  data_engineering: '13. Qualité & Observabilité',
};

interface SqlEditorViewProps {
  initialExerciseIds?: string[];
  activeTaskLabel?: string;
  navigationNonce?: number;
}

export const SqlEditorView: React.FC<SqlEditorViewProps> = ({
  initialExerciseIds,
  activeTaskLabel,
  navigationNonce,
}) => {
  const [datasets, setDatasets] = useState<SqlDatasetSummary[]>([]);
  const [exercises, setExercises] = useState<SqlExerciseSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Filtres
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sessionFilterIds, setSessionFilterIds] = useState<string[] | null>(
    initialExerciseIds && initialExerciseIds.length > 0 ? initialExerciseIds : null
  );

  // Exercice et jeu de donnees selectionnes
  const [currentExercise, setCurrentExercise] = useState<SqlExerciseSummary | null>(null);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('ecommerce');
  const [showSchema, setShowSchema] = useState<boolean>(false);

  // Editeur SQL
  const [userQuery, setUserQuery] = useState<string>('');
  const [running, setRunning] = useState<boolean>(false);
  const [sandboxResult, setSandboxResult] = useState<SqlSandboxResponse | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'results' | 'plan' | 'solution'>('results');

  // Suivi de tentative et solution
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [solutionRevealed, setSolutionRevealed] = useState<boolean>(false);
  const [revealedSolution, setRevealedSolution] = useState<{ query: string; explanation: string } | null>(null);
  const [passedMap, setPassedMap] = useState<Record<string, boolean>>({});

  // Chronometre d'entretien
  const [seconds, setSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [notice, setNotice] = useState<string>('');
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [filtersOpenAtStart] = useState<boolean>(() => !window.matchMedia(MOBILE_QUERY).matches);
  const [listOpen, setListOpen] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Promise.all([fetchSqlDatasets(), fetchSqlExercises()])
      .then(([ds, exs]) => {
        setDatasets(ds);
        setExercises(exs);
        if (initialExerciseIds && initialExerciseIds.length > 0) {
          const target = exs.find((e) => e.id === initialExerciseIds[0]) || exs[0];
          if (target) selectExercise(target);
        } else if (exs.length > 0) {
          selectExercise(exs[0]);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (initialExerciseIds && initialExerciseIds.length > 0) {
      setSessionFilterIds(initialExerciseIds);
      setSelectedCategory('all');
      setSelectedDifficulty('all');
      setSearchTerm('');
      if (exercises.length > 0) {
        const firstEx = exercises.find((e) => e.id === initialExerciseIds[0]);
        if (firstEx) {
          selectExercise(firstEx);
        }
      }
    }
  }, [initialExerciseIds, navigationNonce, exercises]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const selectExercise = (ex: SqlExerciseSummary) => {
    setNotice('');
    setCurrentExercise(ex);
    setSelectedDatasetId(ex.datasetId);
    setUserQuery(`-- Exercice : ${ex.title}\n-- Jeu de données : ${ex.datasetId}\nSELECT * FROM \nLIMIT 20;`);
    setSandboxResult(null);
    setAttemptCount(0);
    setSolutionRevealed(false);
    setRevealedSolution(null);
    setActiveResultTab('results');
    setSeconds(0);
    setTimerRunning(false);
  };

  const handleRunQuery = async () => {
    if (!userQuery.trim() || running) return;
    setRunning(true);
    setAttemptCount((prev) => prev + 1);

    try {
      const res = await executeSqlSandbox({
        exerciseId: currentExercise?.id,
        datasetId: (selectedDatasetId as any) || 'ecommerce',
        userQuery,
        userAttempted: true,
      });
      setSandboxResult(res);

      if (currentExercise && res.comparison?.passed) {
        setPassedMap((prev) => ({ ...prev, [currentExercise.id]: true }));
      }
    } catch (err) {
      setSandboxResult({
        success: false,
        error: err instanceof Error ? err.message : String(err),
        columns: [],
        rows: [],
        totalRowCount: 0,
        truncated: false,
        executionTimeMs: 0,
      });
    } finally {
      setRunning(false);
    }
  };

  const handleRevealSolution = async () => {
    if (attemptCount === 0) {
      setNotice('Exécute au moins une tentative de requête avant d\'afficher la solution.');
      return;
    }

    if (solutionRevealed && revealedSolution) {
      setActiveResultTab('solution');
      return;
    }

    try {
      const res = await executeSqlSandbox({
        exerciseId: currentExercise?.id,
        datasetId: (selectedDatasetId as any) || 'ecommerce',
        userQuery,
        revealSolution: true,
        userAttempted: true,
      });

      if (res.solution) {
        setRevealedSolution(res.solution);
        setSolutionRevealed(true);
        setActiveResultTab('solution');
      }
    } catch (err) {
      setNotice(`Erreur lors de la récupération de la solution : ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuery();
    }
    // Gestion de l'indentation par tabulation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      setUserQuery(val.substring(0, start) + '  ' + val.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="card" role="status">
        Chargement des exercices SQL et du bac à sable…
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">Erreur de chargement : {error}</div>;
  }

  const filteredExercises = exercises.filter((ex) => {
    if (sessionFilterIds && sessionFilterIds.length > 0) {
      return sessionFilterIds.includes(ex.id);
    }
    if (selectedCategory !== 'all' && ex.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const inId = ex.id.toLowerCase().includes(term);
      const inTitle = ex.title.toLowerCase().includes(term);
      const inDesc = ex.description.toLowerCase().includes(term);
      const inTags = ex.tags.some((t) => t.toLowerCase().includes(term));
      if (!inId && !inTitle && !inDesc && !inTags) return false;
    }
    return true;
  });

  const currentDataset = datasets.find((d) => d.id === selectedDatasetId);
  const difficultyLabel = (d: string) => (d === 'avance' ? 'Avancé' : d === 'intermediaire' ? 'Intermédiaire' : 'Débutant');

  const exerciseList = (
    <div className="stack-sm">
      <div className="row-between small">
        <strong>Exercices ({filteredExercises.length})</strong>
        <span className="badge badge-success mono">{Object.keys(passedMap).length} réussis</span>
      </div>
      <div className="item-list-container" role="list" aria-label="Exercices SQL">
        {filteredExercises.length === 0 && <div className="empty-state small">Aucun exercice pour ces filtres.</div>}
        {filteredExercises.map((ex) => {
          const isSelected = currentExercise?.id === ex.id;
          const isPassed = passedMap[ex.id];
          return (
            <div role="listitem" key={ex.id}>
              <button
                type="button"
                onClick={() => {
                  selectExercise(ex);
                  if (isMobile) {
                    setListOpen(false);
                    window.setTimeout(() => editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                  }
                }}
                className={`item-card ${isSelected ? 'selected' : ''}`}
                aria-current={isSelected ? 'true' : undefined}
              >
                <span className="row-between small" style={{ width: '100%' }}>
                  <span className="mono muted">{ex.id}</span>
                  <span className={`badge ${ex.difficulty === 'avance' ? 'badge-danger' : ex.difficulty === 'intermediaire' ? 'badge-warning' : 'badge-neutral'}`}>
                    {difficultyLabel(ex.difficulty)}
                  </span>
                </span>
                <span style={{ fontWeight: isSelected ? 650 : 500, display: 'flex', gap: '0.35rem', alignItems: 'flex-start' }}>
                  {isPassed && <CheckCircle2 size={16} aria-label="Réussi" style={{ color: 'var(--accent-green)', flex: '0 0 auto', marginTop: '2px' }} />}
                  {ex.title}
                </span>
                <span className="muted small">{CATEGORY_LABELS[ex.category] || ex.category}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="sql-editor-container stack">
      {sessionFilterIds && sessionFilterIds.length > 0 && (
        <div className="callout callout-info">
          <div className="row-between" style={{ alignItems: 'flex-start' }}>
            <div style={{ minWidth: 0 }}>
              <strong>Séance ciblée : {activeTaskLabel || 'exercices SQL de ta tâche hebdomadaire'}</strong>
              <div className="small" style={{ marginTop: '0.2rem' }}>
                Seuls les {sessionFilterIds.length} exercices de cette séance sont affichés. Résous-les dans l'ordre :
              </div>
              <div className="cluster" style={{ marginTop: '0.5rem' }}>
                {sessionFilterIds.map((exId, idx) => {
                  const exObj = exercises.find((e) => e.id === exId);
                  const isCurrent = currentExercise?.id === exId;
                  const isDone = passedMap[exId];
                  return (
                    <button
                      key={exId}
                      type="button"
                      onClick={() => exObj && selectExercise(exObj)}
                      className={`btn btn-sm ${isCurrent ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {isDone ? <CheckCircle2 size={16} aria-label="Réussi" /> : <span className="mono">{idx + 1}.</span>}
                      <span className="mono">{exId}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSessionFilterIds(null)}>
              Voir les {exercises.length} exercices
            </button>
          </div>
        </div>
      )}

      <div className="row-between" style={{ alignItems: 'flex-end' }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Atelier SQL</h2>
          <div className="muted small">Moteur SQLite en mémoire, 4 jeux de données réels, correction automatique et plan EXPLAIN.</div>
        </div>
        <div className="cluster" role="group" aria-label="Chronomètre d'entretien">
          <span className="badge badge-neutral mono" style={{ fontSize: '0.88rem', padding: '0.3rem 0.65rem' }} aria-live="off">
            <Timer size={14} aria-hidden /> {formatTimer(seconds)}
          </span>
          <button type="button" className={`btn btn-sm ${timerRunning ? 'btn-warning' : 'btn-secondary'}`} onClick={() => setTimerRunning(!timerRunning)}>
            {timerRunning ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            {timerRunning ? 'Pause' : 'Démarrer'}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => {
              setSeconds(0);
              setTimerRunning(false);
            }}
            aria-label="Réinitialiser le chronomètre"
          >
            <RotateCcw size={16} aria-hidden />
          </button>
        </div>
      </div>

      {/* Filtres */}
      <details className="disclosure" open={filtersOpenAtStart}>
        <summary>
          <Search size={18} aria-hidden />
          Filtrer les exercices
          {(searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all') && <span className="badge badge-info">actifs</span>}
          <ChevronDown size={18} className="chevron" aria-hidden />
        </summary>
        <div className="disclosure-body">
        <div className="cluster" style={{ gap: '0.75rem', alignItems: 'flex-end' }}>
          <label className="field" style={{ flex: '1 1 200px', minWidth: 0 }}>
            Rechercher
            <span style={{ position: 'relative', display: 'block' }}>
              <Search size={16} aria-hidden style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="search"
                placeholder="sql-004, CTE, RANK…"
                value={searchTerm}
                onChange={(e) => {
                  setSessionFilterIds(null);
                  setSearchTerm(e.target.value);
                }}
                className="input"
                style={{ paddingLeft: '2.1rem' }}
              />
            </span>
          </label>
          <label className="field" style={{ flex: '1 1 200px', minWidth: 0 }}>
            Catégorie
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSessionFilterIds(null);
                setSelectedCategory(e.target.value);
              }}
              className="select"
            >
              <option value="all">Toutes ({exercises.length})</option>
              {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <div className="field" style={{ minWidth: 0 }}>
            <span id="sql-difficulty-label">Difficulté</span>
            <div className="segmented" role="group" aria-labelledby="sql-difficulty-label">
              {([
                ['all', 'Toutes'],
                ['debutant', 'Débutant'],
                ['intermediaire', 'Intermédiaire'],
                ['avance', 'Avancé'],
              ] as Array<[string, string]>).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className="segment"
                  aria-pressed={selectedDifficulty === id}
                  onClick={() => {
                    setSessionFilterIds(null);
                    setSelectedDifficulty(id);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>
      </details>

      <div className="interview-grid">
        {isMobile ? (
          <details className="disclosure" open={listOpen} onToggle={(e) => setListOpen((e.currentTarget as HTMLDetailsElement).open)}>
            <summary>
              <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span className="eyebrow">Exercice</span>
                <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentExercise ? `${currentExercise.id} : ${currentExercise.title}` : 'Choisir'}
                </span>
              </span>
              <span className="badge badge-neutral">{filteredExercises.length}</span>
              <ChevronDown size={18} className="chevron" aria-hidden />
            </summary>
            <div className="disclosure-body">{exerciseList}</div>
          </details>
        ) : (
          <div className="card" style={{ position: 'sticky', top: 'calc(var(--topbar-height) + 1rem)' }}>{exerciseList}</div>
        )}

        <div ref={editorRef} className="stack" style={{ minWidth: 0, scrollMarginTop: '72px' }}>
          {currentExercise && (
            <section className="card" aria-labelledby="sql-ex-title">
              <div className="cluster" style={{ gap: '0.35rem' }}>
                <span className="mono badge badge-neutral">{currentExercise.id}</span>
                <span className="badge badge-info">{CATEGORY_LABELS[currentExercise.category] || currentExercise.category}</span>
                <span className="badge badge-neutral">Jeu : {currentExercise.datasetId}</span>
              </div>
              <h3 id="sql-ex-title" style={{ margin: '0.5rem 0 0.35rem', fontSize: '1.12rem' }}>
                {currentExercise.title}
              </h3>
              <p className="text-secondary" style={{ margin: '0.25rem 0 0.6rem', lineHeight: 1.6 }}>
                {currentExercise.description}
              </p>
              <div className="callout">
                <strong className="small">Consignes</strong>
                <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.2rem' }} className="small">
                  {currentExercise.instructions.map((inst, idx) => (
                    <li key={idx} style={{ margin: '0.2rem 0' }}>
                      {inst}
                    </li>
                  ))}
                </ul>
              </div>
              {currentExercise.tags.length > 0 && (
                <div className="cluster" style={{ gap: '0.3rem', marginTop: '0.6rem' }}>
                  {currentExercise.tags.map((t) => (
                    <span key={t} className="tag-badge">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              {currentExercise.hints.length > 0 && (
                <details className="disclosure" style={{ marginTop: '0.75rem' }}>
                  <summary>
                    <Lightbulb size={16} aria-hidden /> Indices pour l'entretien
                    <ChevronDown size={18} className="chevron" aria-hidden />
                  </summary>
                  <ul className="disclosure-body small" style={{ margin: 0, paddingLeft: '2.2rem' }}>
                    {currentExercise.hints.map((h, idx) => (
                      <li key={idx} style={{ margin: '0.2rem 0' }}>
                        {h}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          )}

          {/* Éditeur */}
          <section className="card" aria-label="Éditeur SQL">
            <div className="row-between" style={{ marginBottom: '0.5rem' }}>
              <label htmlFor="sql-editor" style={{ fontWeight: 650 }}>
                Requête SQL
              </label>
              <div className="cluster small" style={{ gap: '0.5rem' }}>
                <label className="sr-only" htmlFor="sql-dataset">Jeu de données</label>
                <select
                  id="sql-dataset"
                  value={selectedDatasetId}
                  onChange={(e) => setSelectedDatasetId(e.target.value)}
                  className="select"
                  style={{ width: 'auto', maxWidth: '220px' }}
                >
                  {datasets.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <button type="button" className="btn btn-ghost btn-sm" aria-expanded={showSchema} onClick={() => setShowSchema(!showSchema)}>
                  <Database size={16} aria-hidden />
                  Schéma
                </button>
              </div>
            </div>

            {showSchema && currentDataset && (
              <div className="card card-sm" style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 650 }}>
                  {currentDataset.name} <span className="muted small mono">({currentDataset.tables.join(', ')})</span>
                </div>
                <div className="muted small" style={{ margin: '0.25rem 0 0.5rem' }}>
                  {currentDataset.description}
                </div>
                <pre className="code-terminal-box" style={{ margin: 0, maxHeight: '200px' }} tabIndex={0} aria-label="Schéma SQL">
                  {currentDataset.schemaSql.trim()}
                </pre>
              </div>
            )}

            <textarea
              id="sql-editor"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={isMobile ? 7 : 9}
              className="code-editor-area"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
            <div className="muted small hide-mobile" style={{ marginTop: '0.35rem' }}>
              Ctrl + Entrée pour exécuter, Tab pour indenter.
            </div>

            {notice && (
              <div className="alert alert-warning small" role="status" style={{ marginTop: '0.6rem' }}>
                {notice}
              </div>
            )}

            <div className="row-between" style={{ marginTop: '0.75rem' }}>
              <div className="cluster">
                <button type="button" className="btn btn-primary" onClick={handleRunQuery} disabled={running}>
                  <Play size={16} aria-hidden />
                  {running ? 'Exécution…' : 'Exécuter'}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setUserQuery('')}>
                  <Trash2 size={16} aria-hidden />
                  Effacer
                </button>
              </div>
              <div className="cluster">
                <span className="muted small">
                  Tentatives : <strong className="mono">{attemptCount}</strong>
                </span>
                <button
                  type="button"
                  className={`btn btn-sm ${attemptCount === 0 ? 'btn-secondary' : 'btn-warning'}`}
                  onClick={handleRevealSolution}
                  disabled={attemptCount === 0}
                  title={attemptCount === 0 ? 'Fais au moins une tentative avant de voir la solution' : 'Afficher la requête optimale et son explication'}
                >
                  <Eye size={16} aria-hidden />
                  {solutionRevealed ? 'Voir la solution' : 'Révéler la solution'}
                </button>
              </div>
            </div>
          </section>

          {sandboxResult && (
            <section className="card" aria-label="Résultat de la requête">
              <div className="row-between" style={{ marginBottom: '0.75rem' }}>
                <div className="segmented" role="tablist" aria-label="Affichage du résultat">
                  <button type="button" role="tab" aria-selected={activeResultTab === 'results'} className="segment" onClick={() => setActiveResultTab('results')}>
                    Résultats <span className="segment-count">{sandboxResult.totalRowCount}</span>
                  </button>
                  {sandboxResult.queryPlan && sandboxResult.queryPlan.length > 0 && (
                    <button type="button" role="tab" aria-selected={activeResultTab === 'plan'} className="segment" onClick={() => setActiveResultTab('plan')}>
                      Plan EXPLAIN
                    </button>
                  )}
                  {revealedSolution && (
                    <button type="button" role="tab" aria-selected={activeResultTab === 'solution'} className="segment" onClick={() => setActiveResultTab('solution')}>
                      Solution
                    </button>
                  )}
                </div>
                <span className="muted small">
                  Exécution : <strong className="mono" style={{ color: 'var(--text-primary)' }}>{sandboxResult.executionTimeMs} ms</strong>
                </span>
              </div>

              {sandboxResult.comparison && (
                <div className={`alert ${sandboxResult.comparison.passed ? 'alert-success' : 'alert-warning'} small`} role="status" style={{ marginBottom: '0.75rem' }}>
                  {sandboxResult.comparison.passed ? (
                    <span>
                      <strong>Bravo !</strong> Ta requête retourne exactement le résultat attendu.
                    </span>
                  ) : (
                    <div>
                      <strong>Écart avec la solution de référence :</strong>
                      <div style={{ marginTop: '0.2rem' }}>{sandboxResult.comparison.diffSummary}</div>
                    </div>
                  )}
                </div>
              )}

              {!sandboxResult.success && (
                <div className="alert alert-danger small mono" role="alert" style={{ whiteSpace: 'pre-wrap' }}>
                  {sandboxResult.error}
                </div>
              )}

              {activeResultTab === 'results' && sandboxResult.success && (
                <div>
                  {sandboxResult.rows.length === 0 ? (
                    <div className="empty-state small">Requête valide, mais aucune ligne retournée.</div>
                  ) : (
                    <div className="table-scroll" style={{ maxHeight: '380px' }} tabIndex={0} role="region" aria-label="Lignes retournées">
                      <table className="table" style={{ fontSize: '0.84rem' }}>
                        <thead>
                          <tr>
                            <th scope="col" style={{ width: '40px' }}>#</th>
                            {sandboxResult.columns.map((col) => (
                              <th key={col} scope="col">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sandboxResult.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              <td className="muted mono">{rIdx + 1}</td>
                              {sandboxResult.columns.map((col) => (
                                <td key={col} className="mono" style={{ whiteSpace: 'nowrap' }}>
                                  {row[col] === null || row[col] === undefined ? <span className="badge badge-neutral">NULL</span> : String(row[col])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {sandboxResult.truncated && (
                    <div className="muted small" style={{ marginTop: '0.4rem', textAlign: 'right' }}>
                      Affichage limité aux 200 premières lignes (sur {sandboxResult.totalRowCount}).
                    </div>
                  )}
                </div>
              )}

              {activeResultTab === 'plan' && sandboxResult.queryPlan && (
                <div className="small">
                  <p className="muted" style={{ marginTop: 0 }}>
                    Plan de l'optimiseur SQLite : SCAN TABLE = parcours complet, SEARCH TABLE = utilisation d'un index.
                  </p>
                  <div className="table-scroll" tabIndex={0} role="region" aria-label="Plan d'exécution">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col" style={{ width: '50px' }}>Id</th>
                          <th scope="col" style={{ width: '60px' }}>Parent</th>
                          <th scope="col">Opération</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sandboxResult.queryPlan.map((node, nIdx) => (
                          <tr key={nIdx}>
                            <td className="mono">{node.id}</td>
                            <td className="mono">{node.parent}</td>
                            <td className="mono">
                              <span className={`badge ${node.detail.includes('SCAN') ? 'badge-danger' : 'badge-success'}`} style={{ marginRight: '0.4rem' }}>
                                {node.detail.includes('SCAN') ? 'Scan' : 'Index'}
                              </span>
                              {node.detail}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeResultTab === 'solution' && revealedSolution && (
                <div className="stack-sm">
                  <strong>Requête de référence</strong>
                  <pre className="code-terminal-box" style={{ margin: 0 }} tabIndex={0} aria-label="Requête de référence">
                    {revealedSolution.query}
                  </pre>
                  <div className="callout callout-warning">
                    <strong>Explication et conseils pour l'entretien</strong>
                    <p style={{ margin: '0.35rem 0 0', lineHeight: 1.6 }}>{revealedSolution.explanation}</p>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
