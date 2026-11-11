import {
  AppSettings,
  CertCode,
  CourseKey,
  PlanningEntretiensData,
  PlanningHebdoData,
  TaskStateRow,
  UnifiedTask,
} from './types';
import { addDaysIso, CERT_PHASES, certForWeek, formatLongFrDate, RESERVE_PHASE } from './phases';

const CERT_NAMES: Record<CertCode, string> = { 'CLF-C02': 'CLF-C02', DBT: 'dbt Analytics Engineering', 'DEA-C01': 'DEA-C01' };

function findExamTask(tasks: UnifiedTask[], certCode: CertCode): UnifiedTask | undefined {
  return tasks.find((t) => t.category === 'certification' && t.cert_code === certCode && t.type === 'certification');
}

export type RescheduleTrigger =
  | {
      type: 'postpone_task';
      taskId: string;
      fromWeek: number;
      preferredTargetWeek?: number;
      reason?: string;
    }
  | {
      type: 'missed_week';
      week: number;
      reason?: string;
    }
  | {
      type: 'exam_week_fatigue';
      week: number;
      reason?: string;
    }
  | {
      type: 'low_mock_score';
      week: number;
      certCode: CertCode;
      scorePct: number;
      weakDomains?: string[];
    }
  | {
      type: 'exam_failure';
      week: number;
      certCode: CertCode;
      rawScore: number;
      failedDateIso: string;
    }
  | {
      type: 'enforce_light_week';
      week: number;
    };

export interface RescheduleChange {
  taskId: string;
  taskTitle: string;
  action: 'postpone' | 'skip' | 'compress' | 'promote';
  fromWeek: number;
  toWeek: number;
  oldDurationMin: number;
  newDurationMin: number;
  reason: string;
}

export interface WeekLoadSummary {
  week: number;
  maxMinutes: number;
  lightWeek: boolean;
  coreCertMinutes: number;
  bonusCertMinutes: number;
  interviewMinutes: number;
  totalActiveMinutes: number;
  remainingMarginMinutes: number;
}

export interface RescheduleResult {
  triggerType: RescheduleTrigger['type'];
  updatedTasks: UnifiedTask[];
  changes: RescheduleChange[];
  updatedExamDates: Record<CertCode, string>;
  weekSummaries: Record<number, WeekLoadSummary>;
  explanationFr: string[];
}

export function inferCertCodeFromWeekAndTask(
  week: number,
  taskId: string,
  resource: string | null | undefined
): CertCode {
  const resUpper = (resource ?? '').toUpperCase();
  if (resUpper.includes('CLF') || resUpper.includes('MERICO')) return 'CLF-C02';
  if (
    resUpper.includes('DBT') ||
    resUpper.includes('TOTH') ||
    resUpper.includes('WEIGEL') ||
    resUpper.includes('QANALABS') ||
    resUpper.includes('JINJA')
  ) {
    return 'DBT';
  }
  if (resUpper.includes('DEA') || resUpper.includes('MAAREK') || resUpper.includes('NIKOLAI')) return 'DEA-C01';
  return certForWeek(week);
}

/**
 * Construit la liste unifiee des taches (Certifications + Entretiens) sur les 22 semaines,
 * en appliquant les etats utilisateur persistés dans SQLite.
 */
export function buildUnifiedTasks(
  planningHebdo: PlanningHebdoData,
  planningEntretiens: PlanningEntretiensData,
  taskStatesMap: Record<string, TaskStateRow> = {}
): UnifiedTask[] {
  const unified: UnifiedTask[] = [];

  for (const w of planningHebdo.weeks) {
    let coreIdx = 1;
    let bonusIdx = 1;
    for (const t of w.tasks) {
      const weekPrefix = `W${String(w.week).padStart(2, '0')}`;
      const taskId =
        t.id ??
        (t.priority === 'bonus' ? `${weekPrefix}-B${bonusIdx++}` : `${weekPrefix}-C${coreIdx++}`);
      const state = taskStatesMap[taskId];

      const safeResource =
        t.course_name ??
        t.resource ??
        (t.kind === 'certification'
          ? 'Examen officiel'
          : t.kind === 'projet'
            ? 'Projet personnel dbt / Snowflake (Git)'
            : 'Révision / Pratique');

      const formattedLectures =
        typeof t.lectures === 'string' && t.lectures.trim().length > 0
          ? t.lectures
          : t.first !== undefined && t.last !== undefined
            ? t.first === t.last
              ? `leçon ${t.first}`
              : `leçons ${t.first} à ${t.last}`
            : null;

      const taskTitle = t.title ?? t.label ?? 'Tâche de certification';
      const taskType = t.type ?? t.kind ?? 'course';
      const taskDeliverable =
        t.deliverable ?? (t.note && t.note.trim().length > 0 ? t.note : w.checkpoint || 'Tâche validée');

      const certCode = inferCertCodeFromWeekAndTask(w.week, taskId, `${safeResource} ${taskTitle}`);
      const effectiveEst =
        state?.custom_duration_min !== null && state?.custom_duration_min !== undefined
          ? state.custom_duration_min
          : t.est_min;

      unified.push({
        id: taskId,
        original_week: w.week,
        target_week: state?.target_week ?? w.week,
        category: 'certification',
        cert_code: certCode,
        course_key: t.course as CourseKey | undefined,
        first_lecture: t.first,
        last_lecture: t.last,
        priority: t.priority,
        type: taskType,
        resource: safeResource,
        lectures: formattedLectures,
        title: taskTitle,
        objective: `Objectif de la semaine ${w.week} (${w.theme})`,
        video_min: t.video_min,
        initial_est_min: t.est_min,
        effective_est_min: effectiveEst,
        deliverable: taskDeliverable,
        status: state?.status ?? 'todo',
        completed_at: state?.completed_at ?? null,
        notes: state?.notes ?? '',
        topic_ids: [],
        url: t.url,
        recommended_day: t.recommended_day,
        skillbuilder: t.skillbuilder,
      });
    }
  }

  for (const iw of planningEntretiens.weeks) {
    for (const it of iw.tasks) {
      const state = taskStatesMap[it.id];
      const effectiveEst =
        state?.custom_duration_min !== null && state?.custom_duration_min !== undefined
          ? state.custom_duration_min
          : it.est_min;

      unified.push({
        id: it.id,
        original_week: iw.week,
        target_week: state?.target_week ?? iw.week,
        category: 'interview',
        priority: it.priority,
        type: 'interview',
        resource: it.resource,
        lectures: it.lectures,
        title: it.title,
        objective: it.objective,
        video_min: it.video_min,
        initial_est_min: it.est_min,
        effective_est_min: effectiveEst,
        deliverable: it.deliverable,
        status: state?.status ?? 'todo',
        completed_at: state?.completed_at ?? null,
        notes: state?.notes ?? '',
        topic_ids: it.topic_ids || [],
      });
    }
  }

  return unified;
}

/**
 * Calcule le plafond hebdomadaire d'une semaine (600 a 660 min par defaut, 360 min en semaine de fetes).
 */
export function getWeekMaxMinutes(
  weekNumber: number,
  planningHebdo: PlanningHebdoData,
  settings: Pick<AppSettings, 'max_weekly_minutes' | 'holiday_weekly_minutes'>
): { maxMinutes: number; lightWeek: boolean } {
  const weekMeta = planningHebdo.weeks.find((w) => w.week === weekNumber);
  const lightWeek = Boolean(weekMeta?.light_week);
  return {
    maxMinutes: lightWeek ? settings.holiday_weekly_minutes : settings.max_weekly_minutes,
    lightWeek,
  };
}

/**
 * Calcule la charge active detaillee d'une semaine donnee.
 */
export function computeWeekLoadSummary(
  weekNumber: number,
  tasks: UnifiedTask[],
  planningHebdo: PlanningHebdoData,
  settings: Pick<AppSettings, 'max_weekly_minutes' | 'holiday_weekly_minutes'>
): WeekLoadSummary {
  const { maxMinutes, lightWeek } = getWeekMaxMinutes(weekNumber, planningHebdo, settings);
  const weekTasks = tasks.filter((t) => t.target_week === weekNumber && t.status !== 'skipped');

  let coreCertMinutes = 0;
  let bonusCertMinutes = 0;
  let interviewMinutes = 0;

  for (const t of weekTasks) {
    if (t.category === 'certification') {
      if (t.priority === 'core') coreCertMinutes += t.effective_est_min;
      else bonusCertMinutes += t.effective_est_min;
    } else {
      interviewMinutes += t.effective_est_min;
    }
  }

  const totalActiveMinutes = coreCertMinutes + bonusCertMinutes + interviewMinutes;
  const remainingMarginMinutes = Math.max(0, maxMinutes - totalActiveMinutes);

  return {
    week: weekNumber,
    maxMinutes,
    lightWeek,
    coreCertMinutes,
    bonusCertMinutes,
    interviewMinutes,
    totalActiveMinutes,
    remainingMarginMinutes,
  };
}

/**
 * Calcule la duree compressee proportionnelle d'un chapitre d'entretien
 * (Correction du defaut n°2 de docs/05 : pas de 15 min fixe arbitraire, mais facteur proportionnel).
 */
export function computeProportionalCompressedDuration(
  initialDurationMin: number,
  settings: Pick<AppSettings, 'compression_factor' | 'min_compressed_minutes' | 'max_compressed_minutes'>
): number {
  const raw = Math.round(initialDurationMin * settings.compression_factor);
  return Math.max(
    settings.min_compressed_minutes,
    Math.min(settings.max_compressed_minutes, raw)
  );
}

/**
 * Ordre de priorite stricte pour l'application du Principe 2 (Priorite a l'examen le plus proche).
 * Ordre officiel (D-25, voir src/domain/phases.ts) :
 * 1. S1-S5 : AWS CLF-C02 (examen 11 déc. 2026), démarrage dbt le week-end de S5
 * 2. S5-S11 : dbt Analytics Engineering (examen 22 janv. 2027)
 * 3. S11-S20 : AWS DEA-C01 + Quickstarts Snowflake ML (examen 26 mars 2027)
 */
export function getTaskExamPriorityRank(task: UnifiedTask, currentWeek: number): number {
  if (task.priority === 'bonus') return 100;

  if (currentWeek <= CERT_PHASES['CLF-C02'].examWeek) {
    if (task.category === 'certification' && task.cert_code === 'CLF-C02') return 1;
    if (task.category === 'certification' && task.cert_code === 'DBT') return 2;
    if (task.category === 'interview') return 3;
    return 4;
  }

  if (currentWeek <= CERT_PHASES.DBT.examWeek) {
    if (task.category === 'certification' && task.cert_code === 'DBT') return 1;
    if (task.category === 'interview') return 2;
    if (task.category === 'certification' && task.cert_code === 'DEA-C01') return 3;
    return 4;
  }

  if (task.category === 'certification' && task.cert_code === 'DEA-C01') return 1;
  if (task.category === 'interview') return 2;
  return 3;
}

/**
 * Execute le moteur de replanification dynamique selon l'evenement declencheur.
 */
export function reschedulePlanning(
  tasksInput: UnifiedTask[],
  planningHebdo: PlanningHebdoData,
  settings: AppSettings,
  trigger: RescheduleTrigger
): RescheduleResult {
  const tasks: UnifiedTask[] = tasksInput.map((t) => ({ ...t }));
  const changes: RescheduleChange[] = [];
  const explanationFr: string[] = [];
  const updatedExamDates: Record<CertCode, string> = { ...settings.exam_dates };

  const skipBonusTasksInWeek = (weekNum: number, reasonText: string): number => {
    let freed = 0;
    for (const t of tasks) {
      if (t.target_week === weekNum && t.priority === 'bonus' && t.status !== 'done' && t.status !== 'skipped') {
        const oldDur = t.effective_est_min;
        t.status = 'skipped';
        freed += oldDur;
        changes.push({
          taskId: t.id,
          taskTitle: t.title,
          action: 'skip',
          fromWeek: weekNum,
          toWeek: weekNum,
          oldDurationMin: oldDur,
          newDurationMin: 0,
          reason: reasonText,
        });
      }
    }
    return freed;
  };

  if (trigger.type === 'enforce_light_week') {
    const w = trigger.week;
    const summaryBefore = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
    if (summaryBefore.totalActiveMinutes > summaryBefore.maxMinutes) {
      const freed = skipBonusTasksInWeek(
        w,
        `Semaine allégée (plafond ${summaryBefore.maxMinutes} min / 6 h) : suppression automatique des tâches bonus.`
      );
      const summaryAfter = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
      explanationFr.push(
        `Semaine ${w} (semaine allégée plafonnée à ${summaryBefore.maxMinutes} min) : la charge initiale (${summaryBefore.totalActiveMinutes} min) dépassait le budget de fêtes.`,
        `Les tâches bonus de la Semaine ${w} (${freed} min) ont été automatiquement ignorées (Principe 3).`,
        `Nouvelle charge de la Semaine ${w} : ${summaryAfter.totalActiveMinutes} min (marge de repos préservée : ${summaryAfter.remainingMarginMinutes} min).`
      );
    } else {
      explanationFr.push(
        `Semaine ${w} : la charge (${summaryBefore.totalActiveMinutes} min) respecte déjà le plafond de ${summaryBefore.maxMinutes} min.`
      );
    }
  } else if (trigger.type === 'postpone_task') {
    const task = tasks.find((t) => t.id === trigger.taskId);
    if (!task) {
      throw new Error(`Tâche introuvable : ${trigger.taskId}`);
    }

    const fromWeek = task.target_week;
    if (task.priority === 'bonus') {
      const oldDur = task.effective_est_min;
      task.status = 'skipped';
      changes.push({
        taskId: task.id,
        taskTitle: task.title,
        action: 'skip',
        fromWeek,
        toWeek: fromWeek,
        oldDurationMin: oldDur,
        newDurationMin: 0,
        reason: trigger.reason || 'Tâche bonus sacrifiée en priorité pour éviter toute dette de planning.',
      });
      explanationFr.push(
        `La tâche « ${task.title} » (${oldDur} min) étant de priorité BONUS, elle est marquée comme ignorée au lieu d'alourdir les semaines suivantes.`
      );
    } else {
      const startCandidate = trigger.preferredTargetWeek ?? Math.min(22, fromWeek + 1);
      let placed = false;

      // Essai 1 : Trouver une semaine candidate (a partir de startCandidate) ayant de la marge directe sans toucher aux bonus
      for (let w = startCandidate; w <= 22; w++) {
        const load = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
        if (load.totalActiveMinutes + task.effective_est_min <= load.maxMinutes) {
          task.target_week = w;
          task.status = 'postponed';
          const newLoad = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
          changes.push({
            taskId: task.id,
            taskTitle: task.title,
            action: 'postpone',
            fromWeek,
            toWeek: w,
            oldDurationMin: task.effective_est_min,
            newDurationMin: task.effective_est_min,
            reason:
              trigger.reason ||
              `Report absorbé dans la marge disponible de la Semaine ${w} (${newLoad.totalActiveMinutes}/${newLoad.maxMinutes} min).`,
          });
          explanationFr.push(
            `Tâche Core « ${task.title} » (${task.effective_est_min} min) reportée de la Semaine ${fromWeek} vers la Semaine ${w}.`,
            `Charge de la Semaine ${w} après absorption : ${newLoad.totalActiveMinutes} min sur un plafond de ${newLoad.maxMinutes} min (aucun décalage en cascade sur les autres semaines).`
          );
          placed = true;
          break;
        }
      }

      // Essai 2 : Si aucune semaine n'avait de marge brute, sacrifier les bonus de la semaine cible
      if (!placed) {
        for (let w = startCandidate; w <= 22; w++) {
          const load = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
          const corePlusInterview = load.coreCertMinutes + load.interviewMinutes;
          if (corePlusInterview + task.effective_est_min <= load.maxMinutes) {
            const freed = skipBonusTasksInWeek(
              w,
              `Libération de capacité en Semaine ${w} pour absorber la tâche Core ${task.id}.`
            );
            task.target_week = w;
            task.status = 'postponed';
            const newLoad = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
            changes.push({
              taskId: task.id,
              taskTitle: task.title,
              action: 'postpone',
              fromWeek,
              toWeek: w,
              oldDurationMin: task.effective_est_min,
              newDurationMin: task.effective_est_min,
              reason: `Report en Semaine ${w} après suppression de ${freed} min de bonus.`,
            });
            explanationFr.push(
              `Suppression de ${freed} min de tâches bonus en Semaine ${w} (Principe 3).`,
              `Tâche Core « ${task.title} » (${task.effective_est_min} min) placée en Semaine ${w} (nouvelle charge : ${newLoad.totalActiveMinutes}/${newLoad.maxMinutes} min).`
            );
            placed = true;
            break;
          }
        }
      }

      // Essai 3 : Compression proportionnelle si c'est une tache d'entretien
      if (!placed && task.category === 'interview') {
        const compressedMin = computeProportionalCompressedDuration(task.initial_est_min, settings);
        for (let w = startCandidate; w <= 22; w++) {
          skipBonusTasksInWeek(w, `Purge des bonus en Semaine ${w} avant compression d'entretien.`);
          const load = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
          if (load.totalActiveMinutes + compressedMin <= load.maxMinutes) {
            const oldDur = task.effective_est_min;
            task.target_week = w;
            task.effective_est_min = compressedMin;
            task.status = 'compressed';
            changes.push({
              taskId: task.id,
              taskTitle: task.title,
              action: 'compress',
              fromWeek,
              toWeek: w,
              oldDurationMin: oldDur,
              newDurationMin: compressedMin,
              reason: `Chapitre d'entretien compressé proportionnellement (${oldDur} -> ${compressedMin} min, fiche mémo) en Semaine ${w}.`,
            });
            explanationFr.push(
              `Chapitre d'entretien « ${task.title} » compressé en format fiche mémo (${oldDur} min -> ${compressedMin} min) et affecté en Semaine ${w}.`
            );
            placed = true;
            break;
          }
        }
      }
    }
  } else if (trigger.type === 'missed_week') {
    const missedWeek = trigger.week;

    // 1. Sacrifier immediatement les bonus de la semaine manquee
    const freedInMissed = skipBonusTasksInWeek(
      missedWeek,
      `Semaine ${missedWeek} non réalisée : abandon immédiat des tâches bonus (Principe 3).`
    );
    if (freedInMissed > 0) {
      explanationFr.push(
        `Étape 1 (Sacrifice des bonus) : ${freedInMissed} min de tâches bonus en Semaine ${missedWeek} ont été annulées définitivement.`
      );
    }

    // Recuperer toutes les taches Core non terminees de la semaine manquee
    const missedCoreTasks = tasks
      .filter((t) => t.target_week === missedWeek && t.priority === 'core' && t.status !== 'done' && t.status !== 'skipped')
      .sort((a, b) => {
        const rankDiff = getTaskExamPriorityRank(a, missedWeek) - getTaskExamPriorityRank(b, missedWeek);
        if (rankDiff !== 0) return rankDiff;
        return b.effective_est_min - a.effective_est_min;
      });

    // Purger les bonus des 3 semaines suivantes pour degager la capacite d'absorption maximale
    let freedInNextWeeks = 0;
    for (let w = missedWeek + 1; w <= Math.min(22, missedWeek + 3); w++) {
      freedInNextWeeks += skipBonusTasksInWeek(
        w,
        `Libération préventive de capacité en Semaine ${w} pour absorber le retard de la Semaine ${missedWeek}.`
      );
    }
    if (freedInNextWeeks > 0) {
      explanationFr.push(
        `Étape 2 (Libération de capacité) : ${freedInNextWeeks} min de bonus supprimées sur les Semaines ${missedWeek + 1} à ${Math.min(22, missedWeek + 3)}.`
      );
    }

    // 2. Affecter les taches Core de certification (Priorite 1 : examen le plus proche, sans les compresser)
    const certCoreTasks = missedCoreTasks.filter((t) => t.category === 'certification');
    const interviewCoreTasks = missedCoreTasks.filter((t) => t.category === 'interview');

    for (const certTask of certCoreTasks) {
      for (let w = missedWeek + 1; w <= 22; w++) {
        const load = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
        if (load.totalActiveMinutes + certTask.effective_est_min <= load.maxMinutes) {
          certTask.target_week = w;
          certTask.status = 'postponed';
          const updatedLoad = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
          changes.push({
            taskId: certTask.id,
            taskTitle: certTask.title,
            action: 'postpone',
            fromWeek: missedWeek,
            toWeek: w,
            oldDurationMin: certTask.effective_est_min,
            newDurationMin: certTask.effective_est_min,
            reason: `Priorité examen le plus proche (${certTask.cert_code}) : report intégral en Semaine ${w} (${updatedLoad.totalActiveMinutes}/${updatedLoad.maxMinutes} min).`,
          });
          explanationFr.push(
            `Certification Core [${certTask.id}] « ${certTask.title} » (${certTask.effective_est_min} min) reportée intégralement en Semaine ${w} (nouvelle charge S${w} : ${updatedLoad.totalActiveMinutes}/${updatedLoad.maxMinutes} min).`
          );
          break;
        }
      }
    }

    // 3. Affecter les taches d'entretiens Core de la semaine manquee en les compressant proportionnellement (50%)
    for (const intTask of interviewCoreTasks) {
      const compressedMin = computeProportionalCompressedDuration(intTask.initial_est_min, settings);
      const oldDur = intTask.effective_est_min;

      for (let w = missedWeek + 1; w <= 22; w++) {
        const load = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
        if (load.totalActiveMinutes + compressedMin <= load.maxMinutes) {
          intTask.target_week = w;
          intTask.effective_est_min = compressedMin;
          intTask.status = 'compressed';
          const updatedLoad = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
          changes.push({
            taskId: intTask.id,
            taskTitle: intTask.title,
            action: 'compress',
            fromWeek: missedWeek,
            toWeek: w,
            oldDurationMin: oldDur,
            newDurationMin: compressedMin,
            reason: `Rattrapage de semaine manquée : chapitre d'entretien condensé à ${Math.round(settings.compression_factor * 100)} % (${oldDur} -> ${compressedMin} min) en Semaine ${w}.`,
          });
          explanationFr.push(
            `Entretien Core [${intTask.id}] « ${intTask.title} » condensé en fiche mémo (${oldDur} min -> ${compressedMin} min) et absorbé en Semaine ${w} (charge S${w} : ${updatedLoad.totalActiveMinutes}/${updatedLoad.maxMinutes} min).`
          );
          break;
        }
      }
    }
  } else if (trigger.type === 'exam_week_fatigue') {
    const examWeek = trigger.week;
    const freedBonus = skipBonusTasksInWeek(
      examWeek,
      `Semaine d'examen (Semaine ${examWeek}) avec fatigue : annulation immédiate des tâches bonus pour préserver la fraîcheur cognitive.`
    );

    const weekInterviews = tasks.filter(
      (t) => t.target_week === examWeek && t.category === 'interview' && t.status !== 'done' && t.status !== 'skipped'
    );

    for (const intTask of weekInterviews) {
      const oldDur = intTask.effective_est_min;
      const lightReviewMin = 20;
      intTask.effective_est_min = lightReviewMin;
      intTask.status = 'compressed';
      changes.push({
        taskId: intTask.id,
        taskTitle: intTask.title,
        action: 'compress',
        fromWeek: examWeek,
        toWeek: examWeek,
        oldDurationMin: oldDur,
        newDurationMin: lightReviewMin,
        reason: `Veille d'examen : séance d'entretien réduite à ${lightReviewMin} min de relecture légère (zéro nouveau problème complexe).`,
      });
    }

    const afterLoad = computeWeekLoadSummary(examWeek, tasks, planningHebdo, settings);
    explanationFr.push(
      `Protection veille d'examen en Semaine ${examWeek} : ${freedBonus} min de bonus annulées.`,
      `Les séances d'entretiens de la Semaine ${examWeek} sont réduites à 20 min de relecture légère afin de préserver le repos avant l'épreuve.`,
      `Nouvelle charge totale de la Semaine ${examWeek} : ${afterLoad.totalActiveMinutes} min (sur ${afterLoad.maxMinutes} min).`
    );
  } else if (trigger.type === 'low_mock_score') {
    const { certCode, scorePct, week } = trigger;
    if (certCode === 'DBT' || certCode === 'DEA-C01') {
      const examTask = findExamTask(tasks, certCode);
      const examWeek = examTask?.target_week ?? CERT_PHASES[certCode].examWeek;
      const newDate = addDaysIso(settings.exam_dates[certCode], 7);
      updatedExamDates[certCode] = newDate;

      // Séance de remédiation : premier bonus restant de la certification avant l'examen (D-23, D-25).
      const remediation = tasks.find(
        (t) =>
          t.category === 'certification' &&
          t.cert_code === certCode &&
          t.priority === 'bonus' &&
          t.status !== 'done' &&
          t.target_week >= week &&
          t.target_week <= examWeek
      );
      if (remediation) {
        const bWeek = remediation.target_week;
        remediation.priority = 'core';
        remediation.status = 'todo';
        changes.push({
          taskId: remediation.id,
          taskTitle: remediation.title,
          action: 'promote',
          fromWeek: bWeek,
          toWeek: bWeek,
          oldDurationMin: remediation.effective_est_min,
          newDurationMin: remediation.effective_est_min,
          reason: `Score blanc ${CERT_NAMES[certCode]} de ${scorePct} % (< 80 %) : séance bonus promue en tâche Core de remédiation en Semaine ${bWeek}.`,
        });
      }

      if (examTask) {
        const oldWeek = examTask.target_week;
        examTask.target_week = oldWeek + 1;
        examTask.status = 'postponed';
        changes.push({
          taskId: examTask.id,
          taskTitle: examTask.title,
          action: 'postpone',
          fromWeek: oldWeek,
          toWeek: oldWeek + 1,
          oldDurationMin: examTask.effective_est_min,
          newDurationMin: examTask.effective_est_min,
          reason: `Report de sécurité de +7 jours de l'examen ${CERT_NAMES[certCode]} (nouvelle date : ${formatLongFrDate(newDate)}, Semaine ${oldWeek + 1}).`,
        });
      }

      explanationFr.push(
        `Alerte de préparation en Semaine ${week} : score blanc ${CERT_NAMES[certCode]} à ${scorePct} % (inférieur au seuil de sécurité de 80 %).`,
        `L'examen ${CERT_NAMES[certCode]} est décalé d'une semaine au vendredi ${formatLongFrDate(newDate)} (Semaine ${examWeek + 1}).`
      );

      if (certCode === 'DBT') {
        // Effet domino : le bloc DEA-C01 recule d'une semaine grâce à la réserve.
        const deaDate = addDaysIso(settings.exam_dates['DEA-C01'], 7);
        updatedExamDates['DEA-C01'] = deaDate;
        const deaStartTask = tasks
          .filter((t) => t.category === 'certification' && t.cert_code === 'DEA-C01' && t.priority === 'core' && t.type === 'udemy')
          .sort((x, y) => x.target_week - y.target_week)[0];
        if (deaStartTask) {
          const oldDeaWeek = deaStartTask.target_week;
          deaStartTask.target_week = RESERVE_PHASE.fromWeek;
          deaStartTask.status = 'postponed';
          changes.push({
            taskId: deaStartTask.id,
            taskTitle: deaStartTask.title,
            action: 'postpone',
            fromWeek: oldDeaWeek,
            toWeek: RESERVE_PHASE.fromWeek,
            oldDurationMin: deaStartTask.effective_est_min,
            newDurationMin: deaStartTask.effective_est_min,
            reason: `Utilisation de la Semaine ${RESERVE_PHASE.fromWeek} de réserve pour absorber le décalage d'une semaine du bloc DEA-C01.`,
          });
        }
        explanationFr.push(
          `La Semaine ${RESERVE_PHASE.fromWeek} de réserve absorbe le décalage : examen DEA-C01 reporté au vendredi ${formatLongFrDate(deaDate)}.`
        );
      }
    }
  } else if (trigger.type === 'exam_failure') {
    const { certCode, rawScore, failedDateIso } = trigger;
    const retakeDate = addDaysIso(failedDateIso, 14);

    if (certCode === 'DBT' || certCode === 'DEA-C01') {
      updatedExamDates[certCode] = retakeDate;
      const examTask = findExamTask(tasks, certCode);
      const examWeek = examTask?.target_week ?? CERT_PHASES[certCode].examWeek;
      const retakeWeek = examWeek + 2;

      if (certCode === 'DBT') {
        const deaDate = addDaysIso(settings.exam_dates['DEA-C01'], 7);
        updatedExamDates['DEA-C01'] = deaDate;
        const nextWeek = examWeek + 1;
        const nextWeekDeaTasks = tasks.filter(
          (t) => t.target_week === nextWeek && t.category === 'certification' && t.cert_code === 'DEA-C01'
        );
        for (const t of nextWeekDeaTasks) {
          if (t.priority === 'bonus') {
            t.status = 'skipped';
            changes.push({
              taskId: t.id,
              taskTitle: t.title,
              action: 'skip',
              fromWeek: nextWeek,
              toWeek: nextWeek,
              oldDurationMin: t.effective_est_min,
              newDurationMin: 0,
              reason: `Sacrifice du bonus S${nextWeek} pour libérer le plan de remédiation dbt.`,
            });
          } else {
            t.target_week = RESERVE_PHASE.fromWeek;
            t.status = 'postponed';
            changes.push({
              taskId: t.id,
              taskTitle: t.title,
              action: 'postpone',
              fromWeek: nextWeek,
              toWeek: RESERVE_PHASE.fromWeek,
              oldDurationMin: t.effective_est_min,
              newDurationMin: t.effective_est_min,
              reason: `Plan de repassage dbt (délai 14 jours) : bascule vers la Semaine ${RESERVE_PHASE.fromWeek} de réserve.`,
            });
          }
        }
        const deaExamTask = findExamTask(tasks, 'DEA-C01');
        if (deaExamTask) {
          const oldDeaWeek = deaExamTask.target_week;
          deaExamTask.target_week = oldDeaWeek + 1;
          deaExamTask.status = 'postponed';
          changes.push({
            taskId: deaExamTask.id,
            taskTitle: deaExamTask.title,
            action: 'postpone',
            fromWeek: oldDeaWeek,
            toWeek: oldDeaWeek + 1,
            oldDurationMin: deaExamTask.effective_est_min,
            newDurationMin: deaExamTask.effective_est_min,
            reason: `Report de l'examen DEA-C01 au ${formatLongFrDate(deaDate)} (Semaine ${oldDeaWeek + 1}), fin du contrat le 2 avril 2027.`,
          });
        }
        explanationFr.push(
          `Échec dbt enregistré le ${failedDateIso} (score ${rawScore}%). Nouvelle date de passage fixée au ${retakeDate} (Semaine ${retakeWeek}).`,
          `La Semaine ${nextWeek} est réallouée à la remédiation ciblée dbt (Jinja, YAML, tests et architectures Snowflake).`,
          `Le bloc DEA-C01 utilise la Semaine ${RESERVE_PHASE.fromWeek} de réserve (examen DEA-C01 décalé au ${formatLongFrDate(deaDate)}).`
        );
      } else {
        explanationFr.push(
          `Échec DEA-C01 enregistré le ${failedDateIso} (${rawScore}/1000 < 720). Application du délai AWS de 14 jours : nouvelle date de passage fixée au ${retakeDate} (Semaine ${retakeWeek}).`,
          `Les semaines de réserve sont consacrées à la remédiation ciblée DEA-C01 (attention : fin du contrat le 2 avril 2027).`
        );
      }

      if (examTask) {
        const oldWeek = examTask.target_week;
        examTask.target_week = retakeWeek;
        examTask.status = 'postponed';
        changes.push({
          taskId: examTask.id,
          taskTitle: examTask.title,
          action: 'postpone',
          fromWeek: oldWeek,
          toWeek: retakeWeek,
          oldDurationMin: examTask.effective_est_min,
          newDurationMin: examTask.effective_est_min,
          reason: `Repassage ${CERT_NAMES[certCode]} planifié au ${retakeDate} (Semaine ${retakeWeek}).`,
        });
      }
    }
  }

  const weekSummaries: Record<number, WeekLoadSummary> = {};
  for (let w = 1; w <= 22; w++) {
    weekSummaries[w] = computeWeekLoadSummary(w, tasks, planningHebdo, settings);
  }

  return {
    triggerType: trigger.type,
    updatedTasks: tasks,
    changes,
    updatedExamDates,
    weekSummaries,
    explanationFr,
  };
}
