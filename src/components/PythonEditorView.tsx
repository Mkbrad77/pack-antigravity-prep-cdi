import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, ChevronDown, Eye, Lightbulb, Pause, Play, RotateCcw, Search, Timer, XCircle } from 'lucide-react';
import { MOBILE_QUERY, useMediaQuery } from '../ui/useMediaQuery';
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [notice, setNotice] = useState<string>('');
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [filtersOpenAtStart] = useState<boolean>(() => !window.matchMedia(MOBILE_QUERY).matches);
  const [listOpen, setListOpen] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

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
    setUserCode(ex.starterCode || '# Écris ton code Python ici\n');
    setNotice('');
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
          notes: `Exercice réussi : ${currentExercise.title}`,
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
      setNotice('Erreur lors du déblocage de la solution : ' + (err instanceof Error ? err.message : String(err)));
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
        return <span className="badge badge-success">Débutant</span>;
      case 'intermediaire':
        return <span className="badge badge-warning">Intermédiaire</span>;
      case 'avance':
        return <span className="badge badge-danger">Avancé</span>;
      default:
        return <span className="badge badge-neutral">{diff}</span>;
    }
  };

  if (loading) {
    return (
      <div className="card" role="status">
        <p className="muted" style={{ margin: 0 }}>Chargement des exercices Python…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="callout callout-warning" role="alert">
        <strong>Erreur</strong>
        <p style={{ margin: '0.25rem 0 0' }}>{error}</p>
      </div>
    );
  }

  const allPassed = Boolean(
    sandboxResult && sandboxResult.success && sandboxResult.passedAssertions && sandboxResult.passedAssertions === sandboxResult.totalAssertions
  );

  const exerciseList = (
    <div className="stack-sm">
      <div className="row-between small">
        <strong>Exercices ({filteredExercises.length})</strong>
        <span className="badge badge-success mono">
          {Object.keys(passedMap).length}/{exercises.length} résolus
        </span>
      </div>
      <div className="item-list-container" role="list" aria-label="Exercices Python">
        {filteredExercises.length === 0 && <div className="empty-state small">Aucun exercice trouvé.</div>}
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
                  {getDifficultyBadge(ex.difficulty)}
                </span>
                <span style={{ fontWeight: isSelected ? 650 : 500, display: 'flex', gap: '0.35rem', alignItems: 'flex-start' }}>
                  {isPassed && <CheckCircle2 size={16} aria-label="Réussi" style={{ color: 'var(--accent-green)', flex: '0 0 auto', marginTop: '2px' }} />}
                  {ex.title}
                </span>
                <span className="muted small">{PYTHON_CATEGORY_LABELS[ex.category] || ex.category}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="stack">
      {sessionFilterIds && sessionFilterIds.length > 0 && (
        <div className="callout callout-info">
          <div className="row-between" style={{ alignItems: 'flex-start' }}>
            <div style={{ minWidth: 0 }}>
              <strong>Séance ciblée : {activeTaskLabel || 'exercices de ta tâche hebdomadaire'}</strong>
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
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Atelier Python</h2>
          <div className="muted small">70 exercices d'entretien, validés par des tests unitaires automatiques.</div>
        </div>
        <div className="cluster" role="group" aria-label="Chronomètre d'entretien">
          <span className="badge badge-neutral mono" style={{ fontSize: '0.88rem', padding: '0.3rem 0.65rem' }}>
            <Timer size={14} aria-hidden /> {formatTimer(seconds)}
          </span>
          <button type="button" className={`btn btn-sm ${timerRunning ? 'btn-warning' : 'btn-secondary'}`} onClick={() => setTimerRunning(!timerRunning)}>
            {timerRunning ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            {timerRunning ? 'Pause' : 'Démarrer'}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            aria-label="Réinitialiser le chronomètre"
            onClick={() => {
              setTimerRunning(false);
              setSeconds(0);
            }}
          >
            <RotateCcw size={16} aria-hidden />
          </button>
        </div>
      </div>

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
                placeholder="py-001, titre, tag…"
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
              {Object.entries(PYTHON_CATEGORY_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <div className="field" style={{ minWidth: 0 }}>
            <span id="py-difficulty-label">Difficulté</span>
            <div className="segmented" role="group" aria-labelledby="py-difficulty-label">
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
            <section className="card" aria-labelledby="py-ex-title">
              <div className="row-between" style={{ alignItems: 'flex-start' }}>
                <div style={{ minWidth: 0 }}>
                  <div className="eyebrow">{PYTHON_CATEGORY_LABELS[currentExercise.category] || currentExercise.category}</div>
                  <h3 id="py-ex-title" style={{ margin: '0.35rem 0 0', fontSize: '1.12rem' }}>
                    <span className="mono muted" style={{ fontWeight: 500, marginRight: '0.4rem' }}>{currentExercise.id}</span>
                    {currentExercise.title}
                  </h3>
                </div>
                {getDifficultyBadge(currentExercise.difficulty)}
              </div>
              <p className="text-secondary" style={{ margin: '0.75rem 0 0', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {currentExercise.description}
              </p>
              {currentExercise.tags && currentExercise.tags.length > 0 && (
                <div className="cluster" style={{ gap: '0.3rem', marginTop: '0.6rem' }}>
                  {currentExercise.tags.map((t) => (
                    <span key={t} className="tag-badge">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              {currentExercise.hints && currentExercise.hints.length > 0 && (
                <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <div className="row-between" style={{ marginBottom: '0.5rem' }}>
                    <span className="small" style={{ fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Lightbulb size={16} aria-hidden /> Indices d'entretien ({revealedHints}/{currentExercise.hints.length})
                    </span>
                    {revealedHints < currentExercise.hints.length && (
                      <button type="button" onClick={() => setRevealedHints((h) => h + 1)} className="btn btn-sm btn-secondary">
                        Révéler un indice
                      </button>
                    )}
                  </div>
                  {revealedHints > 0 && (
                    <div className="stack-sm">
                      {currentExercise.hints.slice(0, revealedHints).map((hint, idx) => (
                        <div key={idx} className="callout callout-warning small">
                          <strong>Indice {idx + 1} :</strong> {hint}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          <section className="card" style={{ padding: 0, overflow: 'hidden' }} aria-label="Éditeur Python">
            <div className="row-between" style={{ backgroundColor: 'var(--bg-inset)', borderBottom: '1px solid var(--border-color)', padding: '0.5rem 0.85rem' }}>
              <label htmlFor="py-editor" className="mono small" style={{ fontWeight: 650 }}>
                solution.py <span className="muted" style={{ fontWeight: 400 }}>Python 3</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  if (currentExercise) {
                    setUserCode(currentExercise.starterCode);
                    setSandboxResult(null);
                  }
                }}
                className="btn btn-sm btn-ghost"
              >
                <RotateCcw size={16} aria-hidden />
                Code de départ
              </button>
            </div>
            <textarea
              id="py-editor"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={isMobile ? 12 : 16}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="code-editor-area"
              style={{ border: 'none', borderRadius: 0, margin: 0, minHeight: isMobile ? '240px' : '320px', display: 'block' }}
              placeholder="# Saisis ta solution Python ici"
            />
            <div className="row-between" style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-inset)', borderTop: '1px solid var(--border-color)' }}>
              <div className="cluster">
                <button type="button" onClick={handleRunCode} disabled={running} className="btn btn-primary">
                  <Play size={16} aria-hidden />
                  {running ? 'Exécution…' : 'Lancer les tests'}
                </button>
                {attemptCount > 0 && !solutionRevealed && (
                  <button type="button" onClick={handleRevealSolution} disabled={revealing} className="btn btn-warning btn-sm">
                    <Eye size={16} aria-hidden />
                    {revealing ? 'Chargement…' : 'Voir la solution optimale'}
                  </button>
                )}
              </div>
              <span className="muted small">
                Tentatives : <strong className="mono" style={{ color: 'var(--text-primary)' }}>{attemptCount}</strong>
              </span>
            </div>
          </section>

          {notice && (
            <div className="alert alert-warning small" role="status">
              {notice}
            </div>
          )}

          {sandboxResult && (
            <section className="card stack-sm" aria-label="Résultat des tests">
              <div className="row-between">
                <span className={`badge ${allPassed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.7rem' }} role="status">
                  {allPassed ? <CheckCircle2 size={16} aria-hidden /> : <XCircle size={16} aria-hidden />}
                  {allPassed
                    ? `Tous les tests passent (${sandboxResult.passedAssertions}/${sandboxResult.totalAssertions})`
                    : `Tests en échec (${sandboxResult.passedAssertions || 0}/${sandboxResult.totalAssertions || 0})`}
                </span>
                <span className="muted mono small">{sandboxResult.executionTimeMs} ms</span>
              </div>
              {sandboxResult.error && (
                <div className="callout callout-warning mono small" style={{ whiteSpace: 'pre-wrap' }}>
                  {sandboxResult.error}
                </div>
              )}
              {sandboxResult.stderr && (
                <div>
                  <div className="small" style={{ fontWeight: 650, color: 'var(--danger-fg)', marginBottom: '0.3rem' }}>
                    Sortie d'erreur (stderr)
                  </div>
                  <pre className="code-terminal-box" style={{ whiteSpace: 'pre-wrap', margin: 0, borderColor: 'var(--danger-border)' }} tabIndex={0}>
                    {sandboxResult.stderr}
                  </pre>
                </div>
              )}
              {sandboxResult.stdout && (
                <div>
                  <div className="muted small" style={{ fontWeight: 650, marginBottom: '0.3rem' }}>
                    Sortie standard (stdout)
                  </div>
                  <pre className="code-terminal-box" style={{ whiteSpace: 'pre-wrap', margin: 0 }} tabIndex={0}>
                    {sandboxResult.stdout}
                  </pre>
                </div>
              )}
            </section>
          )}

          {solutionRevealed && revealedSolution && (
            <section className="card stack-sm" aria-labelledby="py-solution-title" style={{ borderColor: 'var(--success-border)' }}>
              <div className="row-between">
                <h3 id="py-solution-title" style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lightbulb size={18} aria-hidden /> Solution recommandée en entretien
                </h3>
                <span className="badge badge-success">Débloquée</span>
              </div>
              <pre className="code-terminal-box" style={{ whiteSpace: 'pre-wrap', margin: 0 }} tabIndex={0} aria-label="Code de la solution">
                {revealedSolution.code}
              </pre>
              <div className="callout">
                <strong className="small">Explication et complexité</strong>
                <p style={{ margin: '0.35rem 0 0', lineHeight: 1.6 }}>{revealedSolution.explanation}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
