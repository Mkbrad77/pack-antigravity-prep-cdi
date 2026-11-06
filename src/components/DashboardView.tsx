import React, { useState } from 'react';
import { AppStateResponse } from '../apiClient';
import { CertCode, UnifiedTask } from '../domain/types';
import { getTaskActionGuide, TaskNavigationTarget } from '../domain/taskNavigation';
import { getEffectiveTodayIso } from '../domain/dates';

interface DashboardViewProps {
  state: AppStateResponse;
  activeWeek: number;
  setActiveWeek: (week: number) => void;
  onCompleteTask: (task: UnifiedTask) => Promise<void>;
  onReopenTask: (task: UnifiedTask) => Promise<void>;
  onPostponeTask: (taskId: string, fromWeek: number) => Promise<void>;
  onSkipBonusTask: (task: UnifiedTask) => Promise<void>;
  onUpdateSimulatedDate: (dateIso: string) => Promise<void>;
  onNavigateToTarget: (target: TaskNavigationTarget) => void;
}

function daysBetween(fromIso: string, toIso: string): number {
  const d1 = new Date(`${fromIso}T00:00:00Z`).getTime();
  const d2 = new Date(`${toIso}T00:00:00Z`).getTime();
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  activeWeek,
  setActiveWeek,
  onCompleteTask,
  onReopenTask,
  onPostponeTask,
  onSkipBonusTask,
  onUpdateSimulatedDate,
  onNavigateToTarget,
}) => {
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const todayIso = getEffectiveTodayIso(state.settings);
  const weekMeta = state.staticData.planningHebdo.weeks.find((w) => w.week === activeWeek);
  const weekSummary = state.weekSummaries[activeWeek];

  const weekTasks = state.tasks.filter(
    (t) => t.target_week === activeWeek && t.status !== 'skipped'
  );
  const certCoreTasks = weekTasks.filter(
    (t) => t.category === 'certification' && t.priority === 'core'
  );
  const certBonusTasks = weekTasks.filter(
    (t) => t.category === 'certification' && t.priority === 'bonus'
  );
  const interviewCoreTasks = weekTasks.filter(
    (t) => t.category === 'interview' && t.priority === 'core'
  );
  const interviewBonusTasks = weekTasks.filter(
    (t) => t.category === 'interview' && t.priority === 'bonus'
  );

  // Heures realisees cette semaine : somme des seances d'etude de la semaine + taches marquees terminees si aucune seance
  const weekSessionsMin = state.studySessions
    .filter((s) => s.week_number === activeWeek)
    .reduce((acc, s) => acc + s.duration_min, 0);

  const completedTasksMin = weekTasks
    .filter((t) => t.status === 'done')
    .reduce((acc, t) => acc + t.effective_est_min, 0);

  const capMin = weekSummary?.maxMinutes ?? 600;
  const plannedMin = weekSummary?.totalActiveMinutes ?? 0;
  const loadPct = capMin > 0 ? Math.min(100, Math.round((plannedMin / capMin) * 100)) : 0;

  const clfDays = daysBetween(todayIso, state.settings.exam_dates['CLF-C02']);
  const deaDays = daysBetween(todayIso, state.settings.exam_dates['DEA-C01']);
  const dbtDays = daysBetween(todayIso, state.settings.exam_dates.DBT);
  const contractEndDays = daysBetween(todayIso, '2027-04-02');

  const renderTaskRow = (task: UnifiedTask) => {
    const isDone = task.status === 'done';
    const guide = getTaskActionGuide(task);
    return (
      <div
        key={task.id}
        data-testid={`dashboard-task-${task.id}`}
        className={`card card-sm ${isDone ? 'task-done' : ''}`}
        style={{
          marginBottom: '0.75rem',
          borderLeft: `4px solid ${
            task.priority === 'core' ? 'var(--accent)' : 'var(--warning)'
          }`,
          opacity: isDone ? 0.72 : 1,
        }}
      >
        <div className="row-between" style={{ gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span className="mono badge badge-neutral">{task.id}</span>
              <span
                className={`badge ${
                  task.priority === 'core' ? 'badge-core' : 'badge-bonus'
                }`}
              >
                {task.priority === 'core' ? 'CORE (obligatoire)' : 'BONUS (sacrifiable)'}
              </span>
              {task.cert_code && <span className="badge badge-info">{task.cert_code}</span>}
              <span className="badge badge-neutral" style={{ backgroundColor: 'rgba(59, 130, 246, 0.14)', color: 'var(--accent-blue)' }}>
                📅 Conseillé : {guide.recommendedDay}
              </span>
              {task.status === 'compressed' && (
                <span className="badge badge-warning">Comprimé (50 %)</span>
              )}
              {task.status === 'postponed' && (
                <span className="badge badge-warning">Reporté depuis S{task.original_week}</span>
              )}
            </div>
            <div style={{ fontWeight: 600, marginTop: '0.4rem', fontSize: '0.98rem' }}>
              {task.title}
            </div>
            <div className="muted" style={{ fontSize: '0.84rem', marginTop: '0.2rem' }}>
              <strong>Ressource :</strong> {task.resource} ({task.lectures}) |{' '}
              <strong>Durée estimée :</strong>{' '}
              <span className="mono">{task.effective_est_min} min</span>
              {task.video_min > 0 ? ` (vidéo : ${task.video_min} min)` : ''}
            </div>
            {task.deliverable && (
              <div className="muted" style={{ fontSize: '0.8rem', marginTop: '0.15rem' }}>
                <strong>Livrable attendu :</strong> {task.deliverable}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {!isDone ? (
              <>
                <button
                  type="button"
                  data-testid={`complete-task-${task.id}`}
                  className="btn btn-success btn-sm"
                  onClick={() => onCompleteTask(task)}
                >
                  ✓ Terminer
                </button>
                <button
                  type="button"
                  data-testid={`postpone-task-${task.id}`}
                  className="btn btn-secondary btn-sm"
                  onClick={() => onPostponeTask(task.id, activeWeek)}
                >
                  Reporter (S{Math.min(22, activeWeek + 1)})
                </button>
                {task.priority === 'bonus' && (
                  <button
                    type="button"
                    data-testid={`skip-task-${task.id}`}
                    className="btn btn-danger btn-sm"
                    onClick={() => onSkipBonusTask(task)}
                  >
                    Ignorer bonus
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                data-testid={`reopen-task-${task.id}`}
                className="btn btn-secondary btn-sm"
                onClick={() => onReopenTask(task)}
              >
                Rouvrir
              </button>
            )}
          </div>
        </div>

        {/* Encadré de guidage pas-à-pas et boutons d'action directe en 1 clic */}
        <div
          style={{
            marginTop: '0.65rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '0.3rem' }}>
            🧭 Où aller : <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{guide.whereLabel}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18rem', color: 'var(--text-secondary)', marginBottom: '0.55rem' }}>
            {guide.steps.map((step, idx) => (
              <div key={idx}>{step}</div>
            ))}
          </div>
          {guide.exercisesBadgeList && guide.exercisesBadgeList.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.35rem',
                alignItems: 'center',
                marginBottom: '0.6rem',
                padding: '0.4rem 0.55rem',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '0.76rem', color: 'var(--accent-blue)' }}>
                🎯 Exercices précis de cette séance :
              </span>
              {guide.exercisesBadgeList.map((ex) => (
                <span
                  key={ex.id}
                  className="badge badge-neutral"
                  style={{ fontSize: '0.74rem', border: '1px solid var(--border-color)' }}
                >
                  <strong className="mono" style={{ color: 'var(--accent-blue)' }}>{ex.id}</strong> : {ex.title}
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              data-testid={`open-task-target-${task.id}`}
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
                🌐 Ouvrir le lien externe ➔
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div data-testid="dashboard-view">
      {/* Bandeau de selection de semaine et date de simulation */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }} data-testid="dashboard-week-heading">
              Semaine {activeWeek} ({weekMeta?.start} au {weekMeta?.end}) : {weekMeta?.phase}
            </h2>
            <p className="muted" style={{ margin: '0.25rem 0 0 0' }}>
              Thème : <strong>{weekMeta?.theme}</strong> | Point de contrôle :{' '}
              {weekMeta?.checkpoint}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowGuide((prev) => !prev)}
            >
              {showGuide ? 'Masquer le mode d\'emploi' : '🧭 Afficher le mode d\'emploi'}
            </button>
            <label style={{ fontSize: '0.85rem' }}>
              Semaine affichée :{' '}
              <select
                data-testid="week-selector"
                value={activeWeek}
                onChange={(e) => setActiveWeek(Number(e.target.value))}
                style={{ marginLeft: '0.35rem' }}
              >
                {state.staticData.planningHebdo.weeks.map((w) => (
                  <option key={w.week} value={w.week}>
                    S{w.week} ({w.start}) - {w.phase}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ fontSize: '0.85rem' }}>
              Date du jour (simulation) :{' '}
              <input
                type="date"
                data-testid="simulated-date-input"
                value={todayIso}
                onChange={(e) => onUpdateSimulatedDate(e.target.value)}
                style={{ marginLeft: '0.35rem' }}
              />
              {state.settings.simulated_today ? (
                <button
                  type="button"
                  className="btn"
                  data-testid="reset-simulated-date"
                  onClick={() => onUpdateSimulatedDate('')}
                  style={{ marginLeft: '0.35rem', fontSize: '0.75rem' }}
                  title="Revenir à la date réelle du jour"
                >
                  Aujourd'hui
                </button>
              ) : null}
            </label>
          </div>
        </div>
      </div>

      {/* Mode d'emploi rapide : Où aller et comment organiser sa semaine */}
      {showGuide && (
        <div
          className="card"
          style={{
            marginBottom: '1rem',
            borderLeft: '4px solid var(--accent-blue)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span>🧭</span>
              <span>Mode d'emploi rapide : Comment travailler chaque jour (Certifications + Quickstarts Snowflake + Entretiens) ?</span>
            </h3>
            <span className="badge badge-info">Étape 1 : Lire le cours / Ouvrir le lien | Étape 2 : Pratiquer & valider</span>
          </div>

          <div className="grid-2" style={{ gap: '0.85rem' }}>
            <div className="card card-sm">
              <strong style={{ color: 'var(--accent-blue)', display: 'block', marginBottom: '0.35rem' }}>
                📅 Ton rythme quotidien (jusqu'à 11h/semaine max, 6h aux fêtes) :
              </strong>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.83rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                <li>
                  <strong>Lundi, Mardi & Jeudi soir :</strong> Tâches <code>Certifications & Quickstarts Snowflake</code> (<code>W{String(activeWeek).padStart(2, '0')}-C1</code> à <code>C4</code>) : cours Udemy, parcours <code>learn.getdbt.com</code> ou Quickstart Snowflake ML en 1 clic.
                </li>
                <li>
                  <strong>Mercredi soir :</strong> 1re tâche <code>Entretiens Techniques</code> (<code>W{String(activeWeek).padStart(2, '0')}-I1</code>) : cours + 2 ou 3 exercices ciblés.
                </li>
                <li>
                  <strong>Samedi matin :</strong> 2e tâche <code>Entretiens Techniques</code> (<code>W{String(activeWeek).padStart(2, '0')}-I2</code>) : clique sur <strong>Étape 1 (Cours)</strong> puis <strong>Étape 2 (Exercices pré-filtrés)</strong>.
                </li>
                <li>
                  <strong>Dimanche matin (si tâche I3 / Bonus) :</strong> Quickstart Snowflake ML ou 3e tâche Entretiens.
                </li>
              </ul>
            </div>

            <div className="card card-sm">
              <strong style={{ color: 'var(--accent-green)', display: 'block', marginBottom: '0.35rem' }}>
                🎯 Accès rapide aux Hubs (Snowflake, dbt, Devoteam & Cours Entretiens) :
              </strong>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                Sur chaque tâche ci-dessous, le bouton principal ouvre directement le lien officiel (<code>learn.getdbt.com</code>, Quickstart Snowflake, Doc Devoteam) ou le bon chapitre de cours :
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onNavigateToTarget({ tab: 'courses', label: 'Hub Snowflake & dbt' })}
                >
                  ❄️ Hub 15 Quickstarts Snowflake ML + dbt + Devoteam
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigateToTarget({ tab: 'interviews', interviewSubTab: 'courses', interviewCategory: 'python', label: 'Cours Module 1 Python' })}
                >
                  🐍 Module 1 : Cours Python
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigateToTarget({ tab: 'interviews', interviewSubTab: 'courses', interviewCategory: 'sql', label: 'Cours Module 2 SQL' })}
                >
                  🗄️ Module 2 : Cours SQL
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigateToTarget({ tab: 'interviews', interviewSubTab: 'courses', interviewCategory: 'de', label: 'Cours Module 3 DE' })}
                >
                  🏗️ Module 3 : Cours Data Eng.
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigateToTarget({ tab: 'interviews', interviewSubTab: 'courses', interviewCategory: 'aie', label: 'Cours Module 4 AI' })}
                >
                  🤖 Module 4 : Cours AI &amp; RAG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comptes a rebours examens et fin de contrat */}
      <div className="grid-4" style={{ marginBottom: '1rem' }}>
        <div className="card card-sm">
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            1. AWS CLF-C02 (S1-S3 : max fin nov.)
          </div>
          <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.25rem 0' }}>
            {clfDays >= 0 ? `J-${clfDays}` : `Passé (${Math.abs(clfDays)} j)`}
          </div>
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            Cible : {state.settings.exam_dates['CLF-C02']}
          </div>
        </div>

        <div className="card card-sm" style={{ borderColor: 'var(--accent)' }}>
          <div className="muted" style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>
            2. URGENCE N°1 : dbt Analytics Eng. (S4-S10)
          </div>
          <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.25rem 0' }}>
            {dbtDays >= 0 ? `J-${dbtDays}` : `Passé (${Math.abs(dbtDays)} j)`}
          </div>
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            Cible : {state.settings.exam_dates.DBT}
          </div>
        </div>

        <div className="card card-sm">
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            3. AWS DEA-C01 + Snowflake ML (S11-S20)
          </div>
          <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.25rem 0' }}>
            {deaDays >= 0 ? `J-${deaDays}` : `Passé (${Math.abs(deaDays)} j)`}
          </div>
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            Cible : {state.settings.exam_dates['DEA-C01']}
          </div>
        </div>

        <div className="card card-sm">
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            Fin de contrat alternance (Objectif CDI)
          </div>
          <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.25rem 0' }}>
            J-{contractEndDays}
          </div>
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            Échéance : 2027-04-02
          </div>
        </div>
      </div>

      {/* Jauge du budget hebdomadaire + Progression des 3 certifications */}
      <div className="grid-2" style={{ marginBottom: '1rem' }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            Jauge du budget hebdomadaire (Semaine {activeWeek})
          </h3>
          <div className="row-between" style={{ marginBottom: '0.4rem' }}>
            <span>
              Planifié cette semaine :{' '}
              <strong className="mono" data-testid="week-planned-minutes">
                {plannedMin} min
              </strong>{' '}
              ({(plannedMin / 60).toFixed(1)} h) / Plafond{' '}
              <strong className="mono">{capMin} min</strong> ({(capMin / 60).toFixed(0)} h)
            </span>
            <span
              className={`badge ${
                (weekSummary && weekSummary.totalActiveMinutes > weekSummary.maxMinutes) ? 'badge-danger' : 'badge-success'
              }`}
            >
              {weekSummary && weekSummary.totalActiveMinutes > weekSummary.maxMinutes
                ? 'ALERTE SURCHARGE (> plafond)'
                : weekSummary?.lightWeek
                ? 'Semaine allégée (max 6h)'
                : `Charge nominale (<= ${(capMin / 60).toFixed(0)}h)`}
            </span>
          </div>
          <div className="progress-track" style={{ height: '12px', marginBottom: '0.6rem' }}>
            <div
              className="progress-fill"
              style={{
                width: `${loadPct}%`,
                background: (weekSummary && weekSummary.totalActiveMinutes > weekSummary.maxMinutes) ? 'var(--danger)' : 'var(--accent)',
              }}
            />
          </div>
          <div className="muted" style={{ fontSize: '0.85rem' }}>
            <div>
              Répartition prévue : Certifications & Quickstarts{' '}
              <strong className="mono">{weekSummary ? (weekSummary.coreCertMinutes + weekSummary.bonusCertMinutes) : 0} min</strong> |
              Entretiens{' '}
              <strong className="mono">{weekSummary?.interviewMinutes ?? 0} min</strong>{' '}
              (dont Core : {weekSummary?.coreCertMinutes ?? 0} min, Bonus :{' '}
              {weekSummary?.bonusCertMinutes ?? 0} min)
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              Tâches validées cette semaine :{' '}
              <strong className="mono" data-testid="week-completed-minutes">
                {completedTasksMin} min
              </strong>{' '}
              | Séances chronométrées / saisies :{' '}
              <strong className="mono">{weekSessionsMin} min</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            Progression pondérée des 3 certifications (ordre : CLF-C02 ➔ DBT ➔ DEA-C01)
          </h3>
          {(['CLF-C02', 'DBT', 'DEA-C01'] as CertCode[]).map((cert) => {
            const p = state.progress.certifications[cert];
            const r = state.readiness[cert];
            return (
              <div key={cert} style={{ marginBottom: '0.75rem' }}>
                <div className="row-between" style={{ fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                  <span>
                    <strong>{cert}</strong>{' '}
                    <span className="muted">
                      ({p.estimatedMinutesDone} / {p.estimatedMinutesTotal} min estimées cours)
                    </span>
                  </span>
                  <span
                    className="mono"
                    style={{ fontWeight: 700 }}
                    data-testid={`cert-progress-pct-${cert}`}
                  >
                    {p.combinedWeightedPercent} %
                  </span>
                </div>
                <div className="progress-track" style={{ height: '9px' }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${p.combinedWeightedPercent}%` }}
                  />
                </div>
                <div
                  className="row-between muted"
                  style={{ fontSize: '0.78rem', marginTop: '0.15rem' }}
                >
                  <span>
                    Cours Udemy : {p.courseWeightedPercent} % | Tâches planning :{' '}
                    {p.tasksDoneCount}/{p.tasksTotalCount} ({p.tasksWeightedPercent} %)
                  </span>
                  <span
                    data-testid={`dashboard-readiness-${cert}`}
                    style={{
                      color: r.isReady ? 'var(--success)' : 'var(--text-muted)',
                      fontWeight: r.isReady ? 700 : 400,
                    }}
                  >
                    {r.isReady ? 'PRÊT' : r.statusLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Taches de la semaine : Certifications et Entretiens */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            Tâches Certifications : Semaine {activeWeek} ({certCoreTasks.length + certBonusTasks.length})
          </h3>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>
            Priorité CORE (obligatoires : {certCoreTasks.length})
          </h4>
          {certCoreTasks.length === 0 ? (
            <p className="muted">Aucune tâche certification core cette semaine.</p>
          ) : (
            certCoreTasks.map(renderTaskRow)
          )}

          {certBonusTasks.length > 0 && (
            <>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--warning)', margin: '0.8rem 0 0.4rem' }}>
                Priorité BONUS (sacrifiables si imprévu : {certBonusTasks.length})
              </h4>
              {certBonusTasks.map(renderTaskRow)}
            </>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            Tâches Entretiens Techniques : Semaine {activeWeek} (
            {interviewCoreTasks.length + interviewBonusTasks.length})
          </h3>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>
            Priorité CORE (obligatoires : {interviewCoreTasks.length})
          </h4>
          {interviewCoreTasks.length === 0 ? (
            <p className="muted">Aucune tâche entretien core cette semaine.</p>
          ) : (
            interviewCoreTasks.map(renderTaskRow)
          )}

          {interviewBonusTasks.length > 0 && (
            <>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--warning)', margin: '0.8rem 0 0.4rem' }}>
                Priorité BONUS (sacrifiables si imprévu : {interviewBonusTasks.length})
              </h4>
              {interviewBonusTasks.map(renderTaskRow)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
