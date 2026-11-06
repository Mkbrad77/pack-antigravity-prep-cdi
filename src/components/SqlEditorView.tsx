import React, { useEffect, useState, useRef } from 'react';
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
  cte: '4. CTE & Modularite',
  window_functions: '5. Fonctions de fenetrage',
  case_when: '6. CASE WHEN & Pivot',
  dates: '7. Dates & Intervalles',
  deduplication: '8. Dedoublonnage de flux',
  transactions: '9. Transactions & SCD',
  index_explain: '10. Index & EXPLAIN',
  optimisation: '11. Optimisation de requetes',
  modeling: '12. Modelisation Kimball',
  data_engineering: '13. Qualite & Observabilite',
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    setCurrentExercise(ex);
    setSelectedDatasetId(ex.datasetId);
    setUserQuery(`-- Exercice : ${ex.title}\n-- Jeu de donnees : ${ex.datasetId}\nSELECT * FROM \nLIMIT 20;`);
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
      alert('Regle de validation : Vous devez d\'abord executer au moins une tentative de requete avant de pouvoir afficher la solution.');
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
      alert(`Erreur lors de la recuperation de la solution : ${err instanceof Error ? err.message : String(err)}`);
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
      <div className="card" style={{ padding: '2rem' }}>
        Chargement des exercices SQL et du bac a sable SQLite in-memory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Erreur de chargement : {error}
      </div>
    );
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

  return (
    <div className="sql-editor-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Bandeau de séance ciblée si ouvert depuis une tâche du planning */}
      {sessionFilterIds && sessionFilterIds.length > 0 && (
        <div
          className="card"
          style={{
            padding: '0.85rem 1.15rem',
            borderLeft: '4px solid var(--accent-blue)',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
          }}
        >
          <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.95rem' }}>
                🎯 Séance ciblée : {activeTaskLabel || 'Exercices SQL de ta tâche hebdomadaire'}
              </div>
              <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Seuls les <strong>{sessionFilterIds.length} exercices SQL au programme de cette séance</strong> sont affichés ci-dessous. Clique sur chacun pour les résoudre dans l'ordre :
              </div>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.45rem' }}>
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
                      style={{ fontSize: '0.78rem' }}
                    >
                      {isDone ? '✓ ' : `${idx + 1}. `}
                      <span className="mono">{exId}</span> : {exObj ? exObj.title : exId}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSessionFilterIds(null)}
            >
              Afficher les {exercises.length} exercices SQL du catalogue
            </button>
          </div>
        </div>
      )}

      {/* En-tete du module SQL */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
              Editeur SQL Temps Reel : Entrainement Entretiens Data Engineer
            </h2>
            <div className="muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Moteur SQLite en memoire avec 4 jeux de donnees reels. Comparaison intelligente et plan EXPLAIN.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div className="badge badge-neutral mono" style={{ fontSize: '0.9rem', padding: '0.35rem 0.6rem' }}>
              Chrono : {formatTimer(seconds)}
            </div>
            <button
              type="button"
              className={`btn btn-sm ${timerRunning ? 'btn-warning' : 'btn-secondary'}`}
              onClick={() => setTimerRunning(!timerRunning)}
            >
              {timerRunning ? 'Pause' : 'Demarrer'}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setSeconds(0);
                setTimerRunning(false);
              }}
            >
              Reinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Barre de selection de jeu de donnees et filtres */}
      <div className="card" style={{ padding: '0.85rem 1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Dataset :</label>
            <select
              value={selectedDatasetId}
              onChange={(e) => setSelectedDatasetId(e.target.value)}
              className="select"
              style={{ width: 'auto', padding: '0.35rem 0.6rem' }}
            >
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.tables.join(', ')})
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowSchema(!showSchema)}
            >
              {showSchema ? 'Masquer le schema' : 'Inspecter le schema'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Categorie :</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSessionFilterIds(null);
                setSelectedCategory(e.target.value);
              }}
              className="select"
              style={{ width: 'auto', padding: '0.35rem 0.6rem' }}
            >
              <option value="all">Toutes les categories ({exercises.length})</option>
              {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Difficulte :</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSessionFilterIds(null);
                setSelectedDifficulty(e.target.value);
              }}
              className="select"
              style={{ width: 'auto', padding: '0.35rem 0.6rem' }}
            >
              <option value="all">Toutes</option>
              <option value="debutant">Debutant</option>
              <option value="intermediaire">Intermediaire</option>
              <option value="avance">Avance</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '180px' }}>
            <input
              type="text"
              placeholder="Rechercher par ID (ex: sql-004), mot-cle (CTE, RANK)..."
              value={searchTerm}
              onChange={(e) => {
                setSessionFilterIds(null);
                setSearchTerm(e.target.value);
              }}
              className="input"
              style={{ width: '100%', padding: '0.35rem 0.6rem' }}
            />
          </div>
        </div>

        {/* Panneau Schema detaille */}
        {showSchema && currentDataset && (
          <div style={{ marginTop: '0.75rem', padding: '0.85rem', background: 'var(--bg-input)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
              Schema SQL du jeu : {currentDataset.name}
            </div>
            <div className="muted" style={{ fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              {currentDataset.description}
            </div>
            <pre style={{ margin: 0, padding: '0.6rem', background: '#0d1117', color: '#f8fafc', borderRadius: '4px', fontSize: '0.82rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)' }}>
              {currentDataset.schemaSql.trim()}
            </pre>
          </div>
        )}
      </div>

      {/* Corps principal : Liste d'exercices a gauche + Editeur et Resultats a droite */}
      <div className="interview-grid">
        {/* Colonne Gauche : Liste des exercices */}
        <div className="card" style={{ padding: '0.75rem', maxHeight: '720px', overflowY: 'auto' }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Exercices ({filteredExercises.length})</span>
            <span className="mono badge badge-success" style={{ fontSize: '0.75rem' }}>
              {Object.keys(passedMap).length} reussis
            </span>
          </div>

          <div className="item-list-container">
            {filteredExercises.map((ex) => {
              const isSelected = currentExercise?.id === ex.id;
              const isPassed = passedMap[ex.id];

              return (
                <div
                  key={ex.id}
                  onClick={() => selectExercise(ex)}
                  className={`item-card ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="mono muted" style={{ fontSize: '0.75rem' }}>
                      {ex.id}
                    </span>
                    <span
                      className={`badge ${
                        ex.difficulty === 'avance'
                          ? 'badge-danger'
                          : ex.difficulty === 'intermediaire'
                          ? 'badge-warning'
                          : 'badge-neutral'
                      }`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {ex.difficulty}
                    </span>
                  </div>
                  <div style={{ fontWeight: isSelected ? 600 : 500, fontSize: '0.85rem', color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                    {isPassed ? 'OK ' : ''}{ex.title}
                  </div>
                  <div className="muted" style={{ fontSize: '0.75rem' }}>
                    {CATEGORY_LABELS[ex.category] || ex.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonne Droite : Enonce, Editeur et Resultats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentExercise && (
            <div className="card" style={{ padding: '1rem 1.25rem' }}>
              <div className="row-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="mono badge badge-neutral">{currentExercise.id}</span>
                    <span className="badge badge-info">{CATEGORY_LABELS[currentExercise.category]}</span>
                    <span className="badge badge-secondary">Table: {currentExercise.datasetId}</span>
                  </div>
                  <h3 style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                    {currentExercise.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {currentExercise.tags.map((t) => (
                    <span key={t} className="tag-badge">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentExercise.description}
              </p>

              <div className="callout" style={{ marginTop: '0.65rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>Instructions :</strong>
                <ul style={{ margin: '0.35rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                  {currentExercise.instructions.map((inst, idx) => (
                    <li key={idx} style={{ margin: '0.2rem 0' }}>{inst}</li>
                  ))}
                </ul>
              </div>

              {currentExercise.hints.length > 0 && (
                <details style={{ marginTop: '0.65rem', fontSize: '0.85rem' }}>
                  <summary style={{ cursor: 'pointer', color: 'var(--accent-indigo)', fontWeight: 500 }}>
                    Indice pour l entretien (cliquer pour reveler)
                  </summary>
                  <ul style={{ margin: '0.35rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                    {currentExercise.hints.map((h, idx) => (
                      <li key={idx} style={{ margin: '0.2rem 0' }}>{h}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}

          {/* Zone de saisie SQL */}
          <div className="card" style={{ padding: '0.75rem 1rem' }}>
            <div className="row-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                Requete SQL (SQLite en memoire) :
              </span>
              <span className="muted" style={{ fontSize: '0.75rem' }}>
                Raccourci : <strong>Ctrl + Entree</strong> pour executer | Tabulation active
              </span>
            </div>

            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={8}
              style={{
                width: '100%',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '0.9rem',
                lineHeight: 1.45,
                padding: '0.6rem',
                borderRadius: '4px',
                border: '1px solid #ced4da',
                background: '#1e1e1e',
                color: '#d4d4d4',
                resize: 'vertical',
              }}
            />

            <div className="row-between" style={{ marginTop: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRunQuery}
                  disabled={running}
                  style={{ minWidth: '150px' }}
                >
                  {running ? 'Execution...' : 'Executer la requete'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setUserQuery('')}
                >
                  Effacer
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="muted" style={{ fontSize: '0.8rem' }}>
                  Tentatives : <strong>{attemptCount}</strong>
                </span>

                <button
                  type="button"
                  className={`btn btn-sm ${attemptCount === 0 ? 'btn-secondary' : 'btn-warning'}`}
                  onClick={handleRevealSolution}
                  disabled={attemptCount === 0}
                  title={attemptCount === 0 ? 'Faites au moins une tentative avant de voir la solution' : 'Afficher la requete optimale et explication'}
                >
                  {solutionRevealed ? 'Voir la solution' : 'Reveler la solution'}
                </button>
              </div>
            </div>
          </div>

          {/* Onglets et resultats d'execution */}
          {sandboxResult && (
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${activeResultTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveResultTab('results')}
                >
                  Resultats ({sandboxResult.totalRowCount} lignes)
                </button>

                {sandboxResult.queryPlan && sandboxResult.queryPlan.length > 0 && (
                  <button
                    type="button"
                    className={`btn btn-sm ${activeResultTab === 'plan' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveResultTab('plan')}
                  >
                    Plan d'execution (EXPLAIN)
                  </button>
                )}

                {revealedSolution && (
                  <button
                    type="button"
                    className={`btn btn-sm ${activeResultTab === 'solution' ? 'btn-warning' : 'btn-secondary'}`}
                    onClick={() => setActiveResultTab('solution')}
                  >
                    Solution de reference
                  </button>
                )}

                <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                  Temps d'execution : <strong style={{ color: 'var(--accent-blue)' }}>{sandboxResult.executionTimeMs} ms</strong>
                </div>
              </div>

              {/* Statut de validation de l'exercice */}
              {sandboxResult.comparison && (
                <div
                  className={`alert ${sandboxResult.comparison.passed ? 'alert-success' : 'alert-warning'}`}
                  style={{ marginBottom: '0.75rem', padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                >
                  {sandboxResult.comparison.passed ? (
                    <div>
                      <strong>Felicitations !</strong> Votre requete retourne exactement le resultat attendu.
                    </div>
                  ) : (
                    <div>
                      <strong>Ecart detecte par rapport a la solution de reference :</strong>
                      <div style={{ marginTop: '0.2rem' }}>{sandboxResult.comparison.diffSummary}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Erreur SQL */}
              {!sandboxResult.success && (
                <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
                  {sandboxResult.error}
                </div>
              )}

              {/* Tableau de resultats */}
              {activeResultTab === 'results' && sandboxResult.success && (
                <div>
                  {sandboxResult.rows.length === 0 ? (
                    <div className="muted" style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                      Requete valide, mais aucune ligne retournee.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', maxHeight: '350px' }}>
                      <table className="table" style={{ fontSize: '0.82rem', width: '100%' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}>#</th>
                            {sandboxResult.columns.map((col) => (
                              <th key={col}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sandboxResult.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              <td className="muted mono" style={{ fontSize: '0.75rem' }}>{rIdx + 1}</td>
                              {sandboxResult.columns.map((col) => (
                                <td key={col} className="mono">
                                  {row[col] === null || row[col] === undefined ? (
                                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>NULL</span>
                                  ) : (
                                    String(row[col])
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {sandboxResult.truncated && (
                    <div className="muted" style={{ fontSize: '0.75rem', marginTop: '0.4rem', textAlign: 'right' }}>
                      Affichage tronque aux 200 premieres lignes (sur {sandboxResult.totalRowCount} au total).
                    </div>
                  )}
                </div>
              )}

              {/* Plan d'execution EXPLAIN */}
              {activeResultTab === 'plan' && sandboxResult.queryPlan && (
                <div style={{ fontSize: '0.85rem' }}>
                  <div className="muted" style={{ marginBottom: '0.5rem' }}>
                    Analyse de l'optimiseur de requetes SQLite (SCAN TABLE = parcours complet, SEARCH TABLE = utilisation d'index).
                  </div>
                  <table className="table" style={{ fontSize: '0.8rem', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>Id</th>
                        <th style={{ width: '50px' }}>Parent</th>
                        <th>Detail de l'operation de bas niveau</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sandboxResult.queryPlan.map((node, nIdx) => (
                        <tr key={nIdx}>
                          <td className="mono">{node.id}</td>
                          <td className="mono">{node.parent}</td>
                          <td className="mono" style={{ color: node.detail.includes('SCAN') ? '#f87171' : '#4ade80' }}>
                            {node.detail}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Onglet Solution revelee */}
              {activeResultTab === 'solution' && revealedSolution && (
                <div className="callout-warning" style={{ padding: '0.85rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#fde68a' }}>
                    Requete de reference officielle :
                  </div>
                  <pre style={{ margin: 0, padding: '0.65rem', background: '#0d1117', color: '#f8fafc', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                    {revealedSolution.query}
                  </pre>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Explication technique et conseils pour l entretien :</strong>
                    <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{revealedSolution.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
