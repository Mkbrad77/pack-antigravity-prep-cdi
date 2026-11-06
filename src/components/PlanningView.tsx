import React, { useState } from 'react';
import { AppStateResponse, RescheduleApiResponse } from '../apiClient';
import { CertCode, TaskPriority, UnifiedTask } from '../domain/types';
import { RescheduleTrigger } from '../domain/rescheduler';
import { getTaskActionGuide, TaskNavigationTarget } from '../domain/taskNavigation';

interface PlanningViewProps {
  state: AppStateResponse;
  lastRescheduleReport: RescheduleApiResponse['rescheduleReport'] | null;
  onCompleteTask: (task: UnifiedTask) => Promise<void>;
  onReopenTask: (task: UnifiedTask) => Promise<void>;
  onEditTaskDuration: (task: UnifiedTask, newDurationMin: number) => Promise<void>;
  onSkipBonusTask: (task: UnifiedTask) => Promise<void>;
  onTriggerReschedule: (trigger: RescheduleTrigger) => Promise<void>;
  onNavigateToTarget: (target: TaskNavigationTarget) => void;
}

export const PlanningView: React.FC<PlanningViewProps> = ({
  state,
  lastRescheduleReport,
  onCompleteTask,
  onReopenTask,
  onEditTaskDuration,
  onSkipBonusTask,
  onTriggerReschedule,
  onNavigateToTarget,
}) => {
  const [phaseFilter, setPhaseFilter] = useState<string>('ALL');
  const [certFilter, setCertFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const [missedWeekInput, setMissedWeekInput] = useState<number>(8);
  const [editingDurationId, setEditingDurationId] = useState<string | null>(null);
  const [durationDraft, setDurationDraft] = useState<number>(60);

  const phases = Array.from(
    new Set(state.staticData.planningHebdo.weeks.map((w) => w.phase))
  );

  const filteredWeeks = state.staticData.planningHebdo.weeks.filter((w) => {
    if (phaseFilter !== 'ALL' && w.phase !== phaseFilter) return false;
    return true;
  });

  const filterTask = (t: UnifiedTask): boolean => {
    if (certFilter !== 'ALL') {
      if (certFilter === 'INTERVIEW' && t.category !== 'interview') return false;
      if (certFilter !== 'INTERVIEW' && t.cert_code !== (certFilter as CertCode)) return false;
    }
    if (priorityFilter !== 'ALL' && t.priority !== (priorityFilter as TaskPriority)) {
      return false;
    }
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) {
      return false;
    }
    return true;
  };

  return (
    <div data-testid="planning-view">
      {/* Console du moteur de replanification dynamique */}
      <div className="card" style={{ marginBottom: '1rem', borderColor: 'var(--accent)' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.15rem' }}>
          Moteur de replanification dynamique (sans effet domino sur les 22 semaines)
        </h2>
        <p className="muted" style={{ fontSize: '0.88rem', marginBottom: '0.8rem' }}>
          Règles appliquées : plafond jusqu'à 11h/semaine (660 min) ou 6h (360 min) en semaine
          allégée, sacrifice des tâches <code>bonus</code> en premier, protection absolue de
          l'examen le plus proche (1. CLF-C02 S3 ➔ 2. DBT S10 ➔ 3. DEA-C01 S20), et compression proportionnelle à 50 %.
        </p>

        <div className="grid-3" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div className="card card-sm">
            <strong>Scénario : Semaine manquée / maladie</strong>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
              <select
                data-testid="missed-week-select"
                value={missedWeekInput}
                onChange={(e) => setMissedWeekInput(Number(e.target.value))}
              >
                {state.staticData.planningHebdo.weeks.map((w) => (
                  <option key={w.week} value={w.week}>
                    Semaine {w.week} ({w.start})
                  </option>
                ))}
              </select>
              <button
                type="button"
                data-testid="btn-trigger-missed-week"
                className="btn btn-warning btn-sm"
                onClick={() =>
                  onTriggerReschedule({ type: 'missed_week', week: missedWeekInput })
                }
              >
                Replanifier S{missedWeekInput}
              </button>
            </div>
          </div>

          <div className="card card-sm">
            <strong>Scénarios d'examens (dbt S10 / DEA S20) & fatigue</strong>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                data-testid="btn-postpone-clf-exam"
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  onTriggerReschedule({
                    type: 'low_mock_score',
                    week: 9,
                    certCode: 'DBT',
                    scorePct: 72,
                  })
                }
              >
                Score blanc dbt &lt; 80% (Report S11)
              </button>
              <button
                type="button"
                data-testid="btn-dea-retry-14d"
                className="btn btn-danger btn-sm"
                onClick={() =>
                  onTriggerReschedule({
                    type: 'exam_failure',
                    week: 10,
                    certCode: 'DBT',
                    rawScore: 62,
                    failedDateIso: '2027-01-08',
                  })
                }
              >
                Simuler échec dbt (Re-tentative J+14)
              </button>
              <button
                type="button"
                data-testid="btn-exam-fatigue"
                className="btn btn-warning btn-sm"
                onClick={() =>
                  onTriggerReschedule({
                    type: 'exam_week_fatigue',
                    week: 10,
                  })
                }
              >
                Fatigue semaine d'examen dbt (S10)
              </button>
              <button
                type="button"
                data-testid="btn-enforce-light"
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  onTriggerReschedule({
                    type: 'enforce_light_week',
                    week: 8,
                  })
                }
              >
                Forcer semaine allégée (S8, max 6h)
              </button>
            </div>
          </div>
        </div>

        {/* Rapport d'explication de la derniere replanification */}
        {lastRescheduleReport && (
          <div
            data-testid="reschedule-explanation-box"
            className="alert alert-info"
            style={{ marginTop: '0.75rem' }}
          >
            <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>
              Explication du moteur de replanification ({lastRescheduleReport.changes.length}{' '}
              ajustement(s)) :
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {lastRescheduleReport.explanationFr.map((line, idx) => (
                <li key={idx} style={{ marginBottom: '0.2rem' }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Filtres des 22 semaines */}
      <div className="card card-sm" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <strong>Filtres (22 semaines) :</strong>
          <label>
            Phase :{' '}
            <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}>
              <option value="ALL">Toutes les phases</option>
              {phases.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label>
            Volet :{' '}
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="ALL">Certifications + Quickstarts + Entretiens</option>
              <option value="certification">Certifications & Quickstarts uniquement</option>
              <option value="interview">Entretiens uniquement</option>
            </select>
          </label>
          <label>
            Certification :{' '}
            <select value={certFilter} onChange={(e) => setCertFilter(e.target.value)}>
              <option value="ALL">Toutes</option>
              <option value="CLF-C02">1. CLF-C02 (S1-S3)</option>
              <option value="DBT">2. DBT Analytics Eng. (Urgence S4-S10)</option>
              <option value="DEA-C01">3. DEA-C01 + Snowflake ML (S11-S20)</option>
              <option value="INTERVIEW">Entretiens</option>
            </select>
          </label>
          <label>
            Priorité :{' '}
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="ALL">Core + Bonus</option>
              <option value="core">Core (obligatoire)</option>
              <option value="bonus">Bonus (sacrifiable)</option>
            </select>
          </label>
        </div>
      </div>

      {/* Liste des 22 semaines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredWeeks.map((week) => {
          const wSummary = state.weekSummaries[week.week];
          const allWeekTasks = state.tasks.filter((t) => t.target_week === week.week);
          const completedMin = allWeekTasks
            .filter((t) => t.status === 'done')
            .reduce((sum, t) => sum + t.effective_est_min, 0);
          const wTasks = allWeekTasks.filter(filterTask);

          return (
            <div
              key={week.week}
              data-testid={`planning-week-card-${week.week}`}
              className="card"
            >
              <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                    Semaine {week.week} ({week.start} au {week.end}) : {week.phase}
                  </h3>
                  <div className="muted" style={{ fontSize: '0.84rem' }}>
                    {week.theme} | Point de contrôle : {week.checkpoint}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {week.light_week && (
                    <span className="badge badge-warning">Semaine allégée (plafond 360 min)</span>
                  )}
                  {week.exam && <span className="badge badge-danger">EXAMEN : {week.exam}</span>}
                  {completedMin > 0 && (
                    <span className="mono badge badge-success">
                      Fait : {completedMin} min
                    </span>
                  )}
                  <span
                    className={`mono badge ${
                      (wSummary && wSummary.totalActiveMinutes > wSummary.maxMinutes) ? 'badge-danger' : 'badge-neutral'
                    }`}
                  >
                    Prévu : {wSummary?.totalActiveMinutes ?? 0} min / plafond {wSummary?.maxMinutes ?? 600} min
                  </span>
                </div>
              </div>

              {wTasks.length === 0 ? (
                <p className="muted" style={{ margin: 0 }}>
                  Aucune tâche correspondant aux filtres sur cette semaine.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {wTasks.map((task) => {
                    const isDone = task.status === 'done';
                    const isSkipped = task.status === 'skipped';
                    const guide = getTaskActionGuide(task);
                    return (
                      <div
                        key={task.id}
                        data-testid={`planning-task-${task.id}`}
                        className="card card-sm"
                        style={{
                          opacity: isDone || isSkipped ? 0.65 : 1,
                          borderLeft: `4px solid ${
                            isSkipped
                              ? 'var(--danger)'
                              : task.priority === 'core'
                              ? 'var(--accent)'
                              : 'var(--warning)'
                          }`,
                        }}
                      >
                        <div className="row-between" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: '240px' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span className="mono badge badge-neutral">{task.id}</span>
                              <span
                                className={`badge ${
                                  task.category === 'certification'
                                    ? 'badge-info'
                                    : 'badge-neutral'
                                }`}
                              >
                                {task.category === 'certification'
                                  ? task.cert_code || 'CERT'
                                  : 'ENTRETIEN'}
                              </span>
                              <span
                                className={`badge ${
                                  task.priority === 'core' ? 'badge-core' : 'badge-bonus'
                                }`}
                              >
                                {task.priority.toUpperCase()}
                              </span>
                              <span className="badge badge-neutral">
                                📅 {guide.recommendedDay}
                              </span>
                              <span className="badge badge-neutral">Statut : {task.status}</span>
                              {task.original_week !== task.target_week && (
                                <span className="badge badge-warning">
                                  Déplacée (S{task.original_week} vers S{task.target_week})
                                </span>
                              )}
                            </div>
                            <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>
                              {task.title}
                            </div>
                            <div className="muted" style={{ fontSize: '0.82rem' }}>
                              {task.resource} ({task.lectures}) | Durée estimée :{' '}
                              <strong className="mono">{task.effective_est_min} min</strong>
                              {task.initial_est_min !== task.effective_est_min && (
                                <span> (initiale : {task.initial_est_min} min)</span>
                              )}
                            </div>
                            <div className="muted" style={{ fontSize: '0.79rem', marginTop: '0.2rem', color: 'var(--accent-blue)' }}>
                              🧭 <strong>Où aller :</strong> {guide.whereLabel}
                            </div>
                            {guide.exercisesBadgeList && guide.exercisesBadgeList.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', marginTop: '0.3rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)' }}>
                                  🎯 Exercices de la séance :
                                </span>
                                {guide.exercisesBadgeList.map((ex) => (
                                  <span key={ex.id} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                                    <strong className="mono" style={{ color: 'var(--accent-blue)' }}>{ex.id}</strong> : {ex.title}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => onNavigateToTarget(guide.primaryButton)}
                            >
                              {guide.primaryButton.label} ➔
                            </button>
                            {guide.secondaryButton && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', fontWeight: 600 }}
                                onClick={() => onNavigateToTarget(guide.secondaryButton!)}
                              >
                                {guide.secondaryButton.label} ➔
                              </button>
                            )}
                            {task.url && !guide.primaryButton.externalUrl && !guide.secondaryButton?.externalUrl && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => window.open(task.url, '_blank', 'noopener,noreferrer')}
                              >
                                🌐 Lien officiel ➔
                              </button>
                            )}

                            {editingDurationId === task.id ? (
                              <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                                <input
                                  type="number"
                                  min={10}
                                  max={360}
                                  value={durationDraft}
                                  onChange={(e) => setDurationDraft(Number(e.target.value))}
                                  style={{ width: '68px' }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={async () => {
                                    await onEditTaskDuration(task, durationDraft);
                                    setEditingDurationId(null);
                                  }}
                                >
                                  OK
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => setEditingDurationId(null)}
                                >
                                  Annuler
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                  setEditingDurationId(task.id);
                                  setDurationDraft(task.effective_est_min);
                                }}
                              >
                                Durée
                              </button>
                            )}

                            {!isDone && !isSkipped && (
                              <>
                                <button
                                  type="button"
                                  data-testid={`planning-complete-${task.id}`}
                                  className="btn btn-success btn-sm"
                                  onClick={() => onCompleteTask(task)}
                                >
                                  Terminer
                                </button>
                                <button
                                  type="button"
                                  data-testid={`planning-postpone-${task.id}`}
                                  className="btn btn-secondary btn-sm"
                                  onClick={() =>
                                    onTriggerReschedule({
                                      type: 'postpone_task',
                                      taskId: task.id,
                                      fromWeek: task.target_week,
                                    })
                                  }
                                >
                                  Reporter
                                </button>
                                {task.priority === 'bonus' && (
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => onSkipBonusTask(task)}
                                  >
                                    Ignorer
                                  </button>
                                )}
                              </>
                            )}
                            {(isDone || isSkipped) && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => onReopenTask(task)}
                              >
                                Rouvrir
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Historique horodate des modifications du planning */}
      <div className="card" style={{ marginTop: '1.25rem' }}>
        <h3 style={{ marginTop: 0 }}>
          Historique horodaté des modifications du planning ({state.taskHistory.length})
        </h3>
        {state.taskHistory.length === 0 ? (
          <p className="muted">Aucune modification enregistrée pour le moment.</p>
        ) : (
          <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Horodatage</th>
                  <th>Tâche</th>
                  <th>Action</th>
                  <th>Semaines</th>
                  <th>Durée</th>
                  <th>Motif / Explication</th>
                </tr>
              </thead>
              <tbody>
                {state.taskHistory.slice(0, 40).map((h) => (
                  <tr key={h.id}>
                    <td className="mono" style={{ fontSize: '0.78rem' }}>
                      {h.created_at.slice(0, 19).replace('T', ' ')}
                    </td>
                    <td className="mono">{h.task_id}</td>
                    <td>
                      <span className="badge badge-neutral">{h.action}</span>
                    </td>
                    <td className="mono">
                      S{h.from_week} vers S{h.to_week}
                    </td>
                    <td className="mono">
                      {h.old_duration_min}m vers {h.new_duration_min}m
                    </td>
                    <td>{h.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
