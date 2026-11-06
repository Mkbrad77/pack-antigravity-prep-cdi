import React, { useEffect, useState, useRef } from 'react';
import {
  executePythonSandbox,
  fetchPythonExercises,
  recordCompetencyAttempt,
  PythonSandboxResponse,
} from '../apiClient';
import { PythonExercise } from '../domain/types';

const PYTHON_CATEGORY_LABELS: Record<string, string> = {
  algo_data: '1. Algorithmes & Structures de données',
  collections: '2. Collections (Counter, deque, defaultdict)',
  comprehensions_strings: '3. Compréhensions & Chaînes',
  generators: '4. Générateurs, yield & Streaming',
  oop_patterns: '5. POO, Protocol & Design Patterns',
  decorators: '6. Décorateurs & Context Managers',
  data_processing: '7. Traitement de données & Chunking',
  regex_parsing: '8. Parsing, Regex & Text Chunking',
  ml_metrics: '9. Métriques ML & Similarité Vectorielle',
  concurrency: '10. Concurrence, Asyncio & Rate Limiting',
  data_quality: '11. Validation de Schémas & Contrats',
  exceptions_typing_logging: '12. Résilience, Retry, Logs & Tool Calling',
};

interface PythonEditorViewProps {
  initialExerciseIds?: string[];
  activeTaskLabel?: string;
  navigationNonce?: number;
}

export const PythonEditorView: React.FC<PythonEditorViewProps> = ({
  initialExerciseIds,
  activeTaskLabel,
  navigationNonce,
}) => {
  const [exercises, setExercises] = useState<PythonExercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Filtres
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sessionFilterIds, setSessionFilterIds] = useState<string[] | null>(
    initialExerciseIds && initialExerciseIds.length > 0 ? initialExerciseIds : null
  );

  // Exercice selectionne
  const [currentExercise, setCurrentExercise] = useState<PythonExercise | null>(null);

  // Editeur Python
  const [userCode, setUserCode] = useState<string>('');
  const [running, setRunning] = useState<boolean>(false);
  const [sandboxResult, setSandboxResult] = useState<PythonSandboxResponse | null>(null);

  // Tentatives et solution
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [solutionRevealed, setSolutionRevealed] = useState<boolean>(false);
  const [revealedSolution, setRevealedSolution] = useState<{ code: string; explanation: string } | null>(null);
  const [revealing, setRevealing] = useState<boolean>(false);
  const [passedMap, setPassedMap] = useState<Record<string, boolean>>({});

  // Indices
  const [revealedHints, setRevealedHints] = useState<number>(0);

  // Chronometre d'entretien
  const [seconds, setSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPythonExercises()
      .then((exs) => {
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

  const selectExercise = (ex: PythonExercise) => {
    setCurrentExercise(ex);
    setUserCode(ex.starterCode || '# Ecris ton code Python ici\n');
    setSandboxResult(null);
    setAttemptCount(0);
    setSolutionRevealed(false);
    setRevealedSolution(null);
    setRevealedHints(0);
    setSeconds(0);
    setTimerRunning(false);
  };

  const handleRunCode = async () => {
    if (!currentExercise || running) return;
    setRunning(true);
    setAttemptCount((c) => c + 1);
    if (!timerRunning && seconds === 0) {
      setTimerRunning(true);
    }

    try {
      const res = await executePythonSandbox({
        exerciseId: currentExercise.id,
        userCode,
      });
      setSandboxResult(res);

      if (res.success && res.passedAssertions && res.passedAssertions === res.totalAssertions) {
        setPassedMap((prev) => ({ ...prev, [currentExercise.id]: true }));
        setTimerRunning(false);
        // Enregistrer la reussite de la competence
        await recordCompetencyAttempt({
          competency_id: `python_${currentExercise.category}`,
          session_id: `session_${new Date().toISOString().slice(0, 10)}`,
          success: true,
          notes: `Exercice reussi : ${currentExercise.title}`,
        });
      }
    } catch (err) {
      setSandboxResult({
        requestId: `py-err-${Date.now()}`,
        success: false,
        stdout: '',
        stderr: '',
        executionTimeMs: 0,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setRunning(false);
    }
  };

  const handleRevealSolution = async () => {
    if (!currentExercise || attemptCount === 0 || revealing) return;
    setRevealing(true);
    try {
      const res = await executePythonSandbox({
        exerciseId: currentExercise.id,
        userCode,
        revealSolution: true,
        userAttempted: true,
      });
      if (res.solution) {
        setRevealedSolution(res.solution);
        setSolutionRevealed(true);
      }
    } catch (err) {
      alert('Erreur lors du deblocage de la solution : ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setRevealing(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredExercises = exercises.filter((ex) => {
    if (sessionFilterIds && sessionFilterIds.length > 0) {
      return sessionFilterIds.includes(ex.id);
    }
    if (selectedCategory !== 'all' && ex.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchId = ex.id.toLowerCase().includes(term);
      const matchTitle = ex.title.toLowerCase().includes(term);
      const matchDesc = ex.description.toLowerCase().includes(term);
      const matchTags = ex.tags?.some((t) => t.toLowerCase().includes(term));
      if (!matchId && !matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'debutant':
        return <span className="badge badge-success">Debutant</span>;
      case 'intermediaire':
        return <span className="badge badge-warning">Intermediaire</span>;
      case 'avance':
        return <span className="badge badge-danger">Avance</span>;
      default:
        return <span className="badge badge-neutral">{diff}</span>;
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="muted">Chargement des exercices Python...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="callout callout-warning">
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Erreur</h3>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                🎯 Séance ciblée : {activeTaskLabel || 'Exercices de ta tâche hebdomadaire'}
              </div>
              <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Seuls les <strong>{sessionFilterIds.length} exercices au programme de cette séance</strong> sont affichés ci-dessous. Clique sur chacun pour les résoudre dans l'ordre :
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
              Afficher les {exercises.length} exercices du catalogue
            </button>
          </div>
        </div>
      )}

      {/* En-tete avec statistiques rapides */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🐍</span>
              <span>Editeur Python en Situation d Entretien</span>
            </h2>
            <div className="muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
              70 exercices rigoureux en sandbox reelle avec validation par tests unitaires automatises.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="badge badge-neutral" style={{ fontSize: '0.85rem', padding: '0.35rem 0.65rem' }}>
              <span className="muted" style={{ marginRight: '0.4rem' }}>Progression :</span>
              <strong style={{ color: 'var(--accent-blue)' }}>
                {Object.keys(passedMap).length} / {exercises.length} resolus
              </strong>
            </div>

            {/* Chronometre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div className="badge badge-neutral mono" style={{ fontSize: '0.88rem', padding: '0.35rem 0.65rem' }}>
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
                  setTimerRunning(false);
                  setSeconds(0);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Disposition principale : 2 colonnes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(420px, 1.45fr)',
          gap: '1rem',
          alignItems: 'start',
        }}
      >
        {/* Colonne de gauche : Catalogue & Enonce */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Filtres & Recherche */}
          <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Rechercher par ID (ex: py-001), titre, tag..."
              value={searchTerm}
              onChange={(e) => {
                setSessionFilterIds(null);
                setSearchTerm(e.target.value);
              }}
              className="input"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label className="muted" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  Categorie :
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSessionFilterIds(null);
                    setSelectedCategory(e.target.value);
                  }}
                  className="select"
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                  }}
                >
                  <option value="all">Toutes categories ({exercises.length})</option>
                  {Object.entries(PYTHON_CATEGORY_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="muted" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  Difficulte :
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSessionFilterIds(null);
                    setSelectedDifficulty(e.target.value);
                  }}
                  className="select"
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                  }}
                >
                  <option value="all">Toutes difficultes</option>
                  <option value="debutant">Debutant</option>
                  <option value="intermediaire">Intermediaire</option>
                  <option value="avance">Avance</option>
                </select>
              </div>
            </div>

            {/* Liste scrollable des exercices */}
            <div className="item-list-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {filteredExercises.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Aucun exercice trouve
                </div>
              ) : (
                filteredExercises.map((ex) => {
                  const isSelected = currentExercise?.id === ex.id;
                  const isPassed = passedMap[ex.id];
                  return (
                    <div
                      key={ex.id}
                      onClick={() => selectExercise(ex)}
                      className={`item-card ${isSelected ? 'selected' : ''}`}
                      style={{ cursor: 'pointer', padding: '0.6rem 0.8rem' }}
                    >
                      <div className="row-between" style={{ alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: isSelected ? 600 : 500,
                              color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {isPassed && <span style={{ color: 'var(--accent-green)' }}>✓</span>}
                            <span className="mono badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                              {ex.id}
                            </span>
                            <span>{ex.title}</span>
                          </div>
                          <div className="muted" style={{ fontSize: '0.72rem', marginTop: '0.2rem' }}>
                            {PYTHON_CATEGORY_LABELS[ex.category] || ex.category}
                          </div>
                        </div>
                        <div>{getDifficultyBadge(ex.difficulty)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Fiche d'enonce detaille */}
          {currentExercise && (
            <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '0.75rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--accent-blue)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {PYTHON_CATEGORY_LABELS[currentExercise.category] || currentExercise.category}
                  </div>
                  <h3 style={{ margin: '0.35rem 0 0 0', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {currentExercise.title}
                  </h3>
                </div>
                {getDifficultyBadge(currentExercise.difficulty)}
              </div>

              <div>
                <div
                  className="muted"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.4rem',
                  }}
                >
                  Enonce du probleme
                </div>
                <div
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {currentExercise.description}
                </div>
              </div>

              {currentExercise.tags && currentExercise.tags.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid var(--border-color)',
                  }}
                >
                  {currentExercise.tags.map((t) => (
                    <span key={t} className="badge badge-neutral mono" style={{ fontSize: '0.72rem' }}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Indices depliables */}
              {currentExercise.hints && currentExercise.hints.length > 0 && (
                <div style={{ paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)' }}>
                  <div className="row-between" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-amber)' }}>
                      💡 Indices d entretien ({revealedHints}/{currentExercise.hints.length})
                    </span>
                    {revealedHints < currentExercise.hints.length && (
                      <button
                        type="button"
                        onClick={() => setRevealedHints((h) => h + 1)}
                        className="btn btn-sm btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                      >
                        Reveler un indice
                      </button>
                    )}
                  </div>
                  {revealedHints > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {currentExercise.hints.slice(0, revealedHints).map((hint, idx) => (
                        <div key={idx} className="callout callout-warning" style={{ fontSize: '0.82rem', padding: '0.6rem 0.8rem' }}>
                          <strong>Indice {idx + 1} :</strong> {hint}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Colonne de droite : Editeur de code, execution et debriefing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Barre d'outils de l'editeur */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)',
                padding: '0.5rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="mono" style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                  solution.py
                </span>
                <span className="muted">|</span>
                <span className="muted">Python 3 (Sandbox sous-processus 4s)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentExercise) {
                    setUserCode(currentExercise.starterCode);
                    setSandboxResult(null);
                  }
                }}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              >
                Reinitialiser
              </button>
            </div>

            {/* Zone de code */}
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={16}
              spellCheck={false}
              className="code-editor-area"
              style={{ border: 'none', borderRadius: 0, margin: 0, width: '100%', minHeight: '320px' }}
              placeholder="# Saisis ta solution Python ici..."
            />

            {/* Actions sous l'editeur */}
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={running}
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem' }}
                >
                  {running ? 'Execution en cours...' : '▶ Executer les tests unitaires'}
                </button>

                {attemptCount > 0 && !solutionRevealed && (
                  <button
                    type="button"
                    onClick={handleRevealSolution}
                    disabled={revealing}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}
                  >
                    {revealing ? 'Chargement...' : '💡 Devoiler la solution optimale'}
                  </button>
                )}
              </div>

              <div className="muted" style={{ fontSize: '0.8rem' }}>
                Tentative(s) soumise(s) : <strong style={{ color: 'var(--text-primary)' }}>{attemptCount}</strong>
              </div>
            </div>
          </div>

          {/* Resultats d'execution & Tests unitaires */}
          {sandboxResult && (
            <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                className="row-between"
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '0.6rem',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Resultat des tests :</span>
                  {sandboxResult.success &&
                  sandboxResult.passedAssertions &&
                  sandboxResult.passedAssertions === sandboxResult.totalAssertions ? (
                    <span className="badge badge-success" style={{ fontWeight: 600 }}>
                      ✓ TOUS LES TESTS SONT VALIDES ({sandboxResult.passedAssertions}/{sandboxResult.totalAssertions})
                    </span>
                  ) : (
                    <span className="badge badge-danger" style={{ fontWeight: 600 }}>
                      ✗ ECHEC DES TESTS ({sandboxResult.passedAssertions || 0}/{sandboxResult.totalAssertions || 0})
                    </span>
                  )}
                </div>
                <div className="muted mono" style={{ fontSize: '0.78rem' }}>
                  {sandboxResult.executionTimeMs} ms
                </div>
              </div>

              {sandboxResult.error && (
                <div className="callout callout-warning mono" style={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>
                  {sandboxResult.error}
                </div>
              )}

              {sandboxResult.stderr && (
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-red)', marginBottom: '0.3rem' }}>
                    Sortie d erreur (stderr) :
                  </div>
                  <pre
                    className="code-terminal-box"
                    style={{
                      borderColor: 'rgba(239, 68, 68, 0.4)',
                      color: '#fca5a5',
                      whiteSpace: 'pre-wrap',
                      margin: 0,
                    }}
                  >
                    {sandboxResult.stderr}
                  </pre>
                </div>
              )}

              {sandboxResult.stdout && (
                <div>
                  <div className="muted" style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Sortie standard (stdout) :
                  </div>
                  <pre className="code-terminal-box" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                    {sandboxResult.stdout}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Solution et explications pedagogiques */}
          {solutionRevealed && revealedSolution && (
            <div className="callout callout-success" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="row-between" style={{ alignItems: 'center' }}>
                <strong style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>💡</span> Solution optimale recommandee en entretien
                </strong>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Debloquee</span>
              </div>

              <div>
                <div
                  className="muted"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginBottom: '0.3rem',
                  }}
                >
                  Code optimal :
                </div>
                <pre className="code-terminal-box" style={{ color: '#86efac', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {revealedSolution.code}
                </pre>
              </div>

              <div>
                <div
                  className="muted"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginBottom: '0.3rem',
                  }}
                >
                  Explication conceptuelle & Complexite :
                </div>
                <div
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    backgroundColor: 'rgba(11, 15, 25, 0.6)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {revealedSolution.explanation}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
