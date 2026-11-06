import React, { useEffect, useState } from 'react';
import { apiClient, AppStateResponse } from '../apiClient';
import { TaskCategory } from '../domain/types';
import { getEffectiveTodayIso } from '../domain/dates';

interface SessionsViewProps {
  state: AppStateResponse;
  activeWeek: number;
  onRefreshState: (nextState: AppStateResponse) => void;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  state,
  activeWeek,
  onRefreshState,
}) => {
  // Chronometre
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Formulaire de seance
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [weekNumber, setWeekNumber] = useState<number>(activeWeek);
  const [category, setCategory] = useState<TaskCategory>('certification');
  const [sessionDate, setSessionDate] = useState<string>(
    getEffectiveTodayIso(state.settings)
  );
  const [durationMin, setDurationMin] = useState<number>(45);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    setWeekNumber(activeWeek);
  }, [activeWeek]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (sec: number): string => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  };

  const handleStopAndSaveTimer = async () => {
    setTimerRunning(false);
    const computedMin = Math.max(1, Math.round(elapsedSeconds / 60));
    const nextState = await apiClient.addStudySession({
      task_id: selectedTaskId || null,
      week_number: weekNumber,
      category,
      date: sessionDate,
      duration_min: computedMin,
      mode: 'timer',
      notes: notes || `Séance chronométrée (${formatTimer(elapsedSeconds)})`,
    });
    setElapsedSeconds(0);
    setNotes('');
    onRefreshState(nextState);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextState = await apiClient.addStudySession({
      task_id: selectedTaskId || null,
      week_number: weekNumber,
      category,
      date: sessionDate,
      duration_min: durationMin,
      mode: 'manual',
      notes,
    });
    setNotes('');
    onRefreshState(nextState);
  };

  const totalRealMin = state.studySessions.reduce((acc, s) => acc + s.duration_min, 0);
  const certRealMin = state.studySessions
    .filter((s) => s.category === 'certification')
    .reduce((acc, s) => acc + s.duration_min, 0);
  const interviewRealMin = state.studySessions
    .filter((s) => s.category === 'interview')
    .reduce((acc, s) => acc + s.duration_min, 0);

  return (
    <div data-testid="sessions-view">
      <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
        {/* Chronometre simple */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Chronomètre de séance d'étude</h3>
          <div
            className="mono"
            data-testid="timer-display"
            style={{
              fontSize: '2.4rem',
              fontWeight: 700,
              textAlign: 'center',
              padding: '0.8rem',
              background: 'var(--bg-elevated)',
              borderRadius: '8px',
              marginBottom: '0.85rem',
            }}
          >
            {formatTimer(elapsedSeconds)}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!timerRunning ? (
              <button
                type="button"
                data-testid="btn-timer-start"
                className="btn btn-success"
                onClick={() => setTimerRunning(true)}
              >
                {elapsedSeconds > 0 ? 'Reprendre' : 'Démarrer le chronomètre'}
              </button>
            ) : (
              <button
                type="button"
                data-testid="btn-timer-pause"
                className="btn btn-warning"
                onClick={() => setTimerRunning(false)}
              >
                Pause
              </button>
            )}
            <button
              type="button"
              data-testid="btn-timer-save"
              className="btn btn-primary"
              disabled={elapsedSeconds === 0 && !timerRunning}
              onClick={handleStopAndSaveTimer}
            >
              Arrêter et enregistrer la séance
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setTimerRunning(false);
                setElapsedSeconds(0);
              }}
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Saisie manuelle rapide */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Saisie manuelle rapide d'une séance</h3>
          <form onSubmit={handleManualSubmit} data-testid="manual-session-form">
            <div className="grid-2" style={{ gap: '0.6rem', marginBottom: '0.6rem' }}>
              <label>
                Semaine :
                <select
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '0.2rem' }}
                >
                  {state.staticData.planningHebdo.weeks.map((w) => (
                    <option key={w.week} value={w.week}>
                      Semaine {w.week} ({w.start})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Volet :
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  style={{ width: '100%', marginTop: '0.2rem' }}
                >
                  <option value="certification">Certification (AWS / dbt)</option>
                  <option value="interview">Entretien technique (SQL / Python / Design)</option>
                </select>
              </label>
            </div>

            <div className="grid-2" style={{ gap: '0.6rem', marginBottom: '0.6rem' }}>
              <label>
                Tâche associée (optionnel) :
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  style={{ width: '100%', marginTop: '0.2rem' }}
                >
                  <option value="">-- Aucune tâche spécifique --</option>
                  {state.tasks
                    .filter((t) => t.target_week === weekNumber)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} : {t.title} ({t.effective_est_min}m)
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Durée réelle (minutes) :
                <input
                  type="number"
                  data-testid="session-duration-input"
                  min={1}
                  max={600}
                  value={durationMin}
                  onChange={(e) => setDurationMin(Number(e.target.value))}
                  required
                  style={{ width: '100%', marginTop: '0.2rem' }}
                />
              </label>
            </div>

            <div className="grid-2" style={{ gap: '0.6rem', marginBottom: '0.75rem' }}>
              <label>
                Date :
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  style={{ width: '100%', marginTop: '0.2rem' }}
                />
              </label>
              <label>
                Notes :
                <input
                  type="text"
                  data-testid="session-notes-input"
                  placeholder="Ex. 45 min sur le cours Merico leçons 128 à 145"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', marginTop: '0.2rem' }}
                />
              </label>
            </div>

            <button
              type="submit"
              data-testid="btn-add-manual-session"
              className="btn btn-primary"
            >
              Enregistrer la séance manuelle
            </button>
          </form>
        </div>
      </div>

      {/* Comparaison temps estime vs temps reel + Historique */}
      <div className="card">
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0 }}>
            Historique des séances d'étude ({state.studySessions.length})
          </h3>
          <div className="mono" style={{ fontSize: '0.88rem' }}>
            Total réel enregistré : <strong>{totalRealMin} min</strong> ({(totalRealMin / 60).toFixed(1)} h)
            | Certifications : <strong>{certRealMin} min</strong> | Entretiens :{' '}
            <strong>{interviewRealMin} min</strong>
          </div>
        </div>

        {state.studySessions.length === 0 ? (
          <p className="muted">
            Aucune séance d'étude enregistrée. (Aucun faux temps d'étude n'est pré-rempli par
            défaut.)
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Semaine</th>
                <th>Volet</th>
                <th>Tâche</th>
                <th>Durée réelle vs estimée</th>
                <th>Mode</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {state.studySessions.map((s) => {
                const linkedTask = state.tasks.find((t) => t.id === s.task_id);
                return (
                  <tr key={s.id}>
                    <td className="mono">{s.date}</td>
                    <td className="mono">S{s.week_number}</td>
                    <td>
                      <span className="badge badge-neutral">{s.category}</span>
                      {s.is_demo === 1 && (
                        <span className="badge badge-warning" style={{ marginLeft: '0.25rem' }}>
                          DÉMO
                        </span>
                      )}
                    </td>
                    <td className="mono">{s.task_id || '-'}</td>
                    <td className="mono">
                      <strong>{s.duration_min} min</strong>
                      {linkedTask ? ` (estimé : ${linkedTask.effective_est_min} min)` : ''}
                    </td>
                    <td>{s.mode === 'timer' ? 'Chronomètre' : 'Manuelle'}</td>
                    <td>{s.notes}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                          const next = await apiClient.deleteStudySession(s.id);
                          onRefreshState(next);
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
