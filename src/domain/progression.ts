import {
  CatalogueData,
  CertCode,
  CourseBlock,
  CourseItem,
  CourseKey,
  UdemyCourse,
  UnifiedTask,
} from './types';

export interface BlockProgressStats {
  blockId: string;
  label: string;
  priority: string;
  firstLecture: number;
  lastLecture: number;
  totalItems: number;
  doneItems: number;
  videoMinutesTotal: number;
  videoMinutesRemaining: number;
  estimatedMinutesTotal: number;
  estimatedMinutesDone: number;
  estimatedMinutesRemaining: number;
  weightedPercent: number;
}

export interface CourseProgressStats {
  courseKey: CourseKey;
  /** Vitesse de lecture retenue (1 = normale). */
  playbackSpeed: number;
  title: string;
  instructor: string;
  role: string;
  timeFactor: number;
  totalItems: number;
  doneItems: number;
  videoMinutesTotal: number;
  videoMinutesDone: number;
  videoMinutesRemaining: number;
  estimatedMinutesTotal: number;
  estimatedMinutesDone: number;
  estimatedMinutesRemaining: number;
  weightedPercent: number;
  indispensableWeightedPercent: number;
  blocks: BlockProgressStats[];
}

export interface CertWeightedProgress {
  certCode: CertCode;
  courseWeightedPercent: number;
  tasksWeightedPercent: number;
  combinedWeightedPercent: number;
  estimatedMinutesDone: number;
  estimatedMinutesTotal: number;
  estimatedMinutesRemaining: number;
  tasksDoneCount: number;
  tasksTotalCount: number;
}

/**
 * Calcule la duree estimee d'un element de cours Udemy en tenant compte du type
 * (video avec facteur multiplicateur, quiz forfaitaire ou exercice forfaitaire).
 */
export function computeItemEstimatedMinutes(
  item: CourseItem,
  courseKey: CourseKey,
  timeFactors: Record<CourseKey, number>,
  quizMinutes: Record<CourseKey, number>,
  exerciseMinutes: Record<CourseKey, number>,
  playbackSpeed: number = 1
): number {
  const factor = (timeFactors[courseKey] ?? 1.2) / (playbackSpeed > 0 ? playbackSpeed : 1);
  const type = item.type as string;
  if (type === 'quiz') {
    return quizMinutes[courseKey] ?? 15;
  }
  // Le catalogue note les exercices « exo » ; « ex » reste accepté.
  if (type === 'ex' || type === 'exo') {
    return exerciseMinutes[courseKey] ?? 20;
  }
  if (type === 'exam') {
    return item.minutes > 0 ? Math.round(item.minutes * factor) : 60;
  }
  const baseMin = Math.max(0, item.minutes || 0);
  return Math.round(baseMin * factor * 10) / 10;
}

/**
 * Calcule la progression ponderee par les minutes pour un cours Udemy et chacun de ses blocs.
 */
export function computeCourseProgress(
  course: UdemyCourse,
  lessonDoneMap: Record<string, boolean>,
  timeFactors: Record<CourseKey, number>,
  quizMinutes: Record<CourseKey, number>,
  exerciseMinutes: Record<CourseKey, number>,
  playbackSpeed: number = 1
): CourseProgressStats {
  const factor = timeFactors[course.key] ?? 1.2;

  const blockMap = new Map<string, CourseBlock>();
  for (const b of course.blocks) {
    blockMap.set(b.id, b);
  }

  const blockAccum = new Map<
    string,
    {
      totalItems: number;
      doneItems: number;
      videoTotal: number;
      videoDone: number;
      estTotal: number;
      estDone: number;
    }
  >();

  for (const b of course.blocks) {
    blockAccum.set(b.id, {
      totalItems: 0,
      doneItems: 0,
      videoTotal: 0,
      videoDone: 0,
      estTotal: 0,
      estDone: 0,
    });
  }

  let totalItems = 0;
  let doneItems = 0;
  let videoMinutesTotal = 0;
  let videoMinutesDone = 0;
  let estimatedMinutesTotal = 0;
  let estimatedMinutesDone = 0;

  let indispEstTotal = 0;
  let indispEstDone = 0;

  for (const item of course.items) {
    const key = `${course.key}:${item.i}`;
    const isDone = lessonDoneMap[key] !== undefined ? lessonDoneMap[key] : Boolean(item.done);
    const videoMin = Math.max(0, item.minutes || 0);
    const estMin = computeItemEstimatedMinutes(
      item,
      course.key,
      timeFactors,
      quizMinutes,
      exerciseMinutes,
      playbackSpeed
    );

    totalItems += 1;
    videoMinutesTotal += videoMin;
    estimatedMinutesTotal += estMin;

    if (isDone) {
      doneItems += 1;
      videoMinutesDone += videoMin;
      estimatedMinutesDone += estMin;
    }

    const blockMeta = blockMap.get(item.block);
    const isIndispensable =
      !blockMeta ||
      blockMeta.priority.startsWith('indispensable') ||
      blockMeta.priority.startsWith('utile');

    if (isIndispensable) {
      indispEstTotal += estMin;
      if (isDone) {
        indispEstDone += estMin;
      }
    }

    const acc = blockAccum.get(item.block);
    if (acc) {
      acc.totalItems += 1;
      acc.videoTotal += videoMin;
      acc.estTotal += estMin;
      if (isDone) {
        acc.doneItems += 1;
        acc.videoDone += videoMin;
        acc.estDone += estMin;
      }
    }
  }

  const blocks: BlockProgressStats[] = course.blocks.map((b) => {
    const acc = blockAccum.get(b.id) ?? {
      totalItems: 0,
      doneItems: 0,
      videoTotal: 0,
      videoDone: 0,
      estTotal: 0,
      estDone: 0,
    };
    const estRemaining = Math.max(0, Math.round(acc.estTotal - acc.estDone));
    const vidRemaining = Math.max(0, Math.round(acc.videoTotal - acc.videoDone));
    const pct =
      acc.estTotal > 0 ? Math.min(100, Math.round((acc.estDone / acc.estTotal) * 1000) / 10) : 0;

    return {
      blockId: b.id,
      label: b.label,
      priority: b.priority,
      firstLecture: b.first_lecture,
      lastLecture: b.last_lecture,
      totalItems: acc.totalItems,
      doneItems: acc.doneItems,
      videoMinutesTotal: Math.round(acc.videoTotal),
      videoMinutesRemaining: vidRemaining,
      estimatedMinutesTotal: Math.round(acc.estTotal),
      estimatedMinutesDone: Math.round(acc.estDone),
      estimatedMinutesRemaining: estRemaining,
      weightedPercent: pct,
    };
  });

  const weightedPercent =
    estimatedMinutesTotal > 0
      ? Math.min(100, Math.round((estimatedMinutesDone / estimatedMinutesTotal) * 1000) / 10)
      : 0;

  const indispensableWeightedPercent =
    indispEstTotal > 0
      ? Math.min(100, Math.round((indispEstDone / indispEstTotal) * 1000) / 10)
      : weightedPercent;

  return {
    courseKey: course.key,
    title: course.title,
    instructor: course.instructor,
    role: course.role,
    timeFactor: factor,
    playbackSpeed,
    totalItems,
    doneItems,
    videoMinutesTotal: Math.round(videoMinutesTotal),
    videoMinutesDone: Math.round(videoMinutesDone),
    videoMinutesRemaining: Math.max(0, Math.round(videoMinutesTotal - videoMinutesDone)),
    estimatedMinutesTotal: Math.round(estimatedMinutesTotal),
    estimatedMinutesDone: Math.round(estimatedMinutesDone),
    estimatedMinutesRemaining: Math.max(
      0,
      Math.round(estimatedMinutesTotal - estimatedMinutesDone)
    ),
    weightedPercent,
    indispensableWeightedPercent,
    blocks,
  };
}

/**
 * Calcule la progression globale ponderee par les minutes pour chacune des 3 certifications
 * (CLF-C02, DEA-C01, DBT).
 */
export function computeAllCertificationsProgress(
  catalogue: CatalogueData,
  lessonDoneMap: Record<string, boolean>,
  tasks: UnifiedTask[],
  customTimeFactors?: Record<CourseKey, number>
): {
  courses: Record<CourseKey, CourseProgressStats>;
  certifications: Record<CertCode, CertWeightedProgress>;
} {
  const timeFactors = customTimeFactors ?? catalogue.meta.time_factors;
  const quizMinutes = catalogue.meta.quiz_minutes;
  const exerciseMinutes = catalogue.meta.exercise_minutes;

  const coursesMap = {} as Record<CourseKey, CourseProgressStats>;
  for (const c of catalogue.udemy_courses) {
    coursesMap[c.key] = computeCourseProgress(
      c,
      lessonDoneMap,
      timeFactors,
      quizMinutes,
      exerciseMinutes,
      catalogue.meta.playback_speed?.[c.key] ?? 1
    );
  }

  const buildCertStats = (certCode: CertCode, primaryCourseKey: CourseKey): CertWeightedProgress => {
    const courseStats = coursesMap[primaryCourseKey];
    const certTasks = tasks.filter(
      (t) => t.category === 'certification' && t.cert_code === certCode && t.status !== 'skipped'
    );

    let taskEstTotal = 0;
    let taskEstDone = 0;
    let tasksDoneCount = 0;

    for (const t of certTasks) {
      taskEstTotal += t.effective_est_min;
      if (t.status === 'done') {
        taskEstDone += t.effective_est_min;
        tasksDoneCount += 1;
      }
    }

    const tasksWeightedPercent =
      taskEstTotal > 0 ? Math.min(100, Math.round((taskEstDone / taskEstTotal) * 1000) / 10) : 0;

    const courseWeightedPercent = courseStats ? courseStats.weightedPercent : 0;

    // Toutes les certifications demarrent a 0 %. Des qu'une tache du planning est terminee,
    // on combine l'avancement reel du cours Udemy (70 %) et l'avancement des taches hebdomadaires (30 %).
    const combinedWeightedPercent =
      tasksDoneCount > 0
        ? Math.min(
            100,
            Math.round((courseWeightedPercent * 0.7 + tasksWeightedPercent * 0.3) * 10) / 10
          )
        : courseWeightedPercent;

    return {
      certCode,
      courseWeightedPercent,
      tasksWeightedPercent,
      combinedWeightedPercent,
      estimatedMinutesDone: courseStats ? courseStats.estimatedMinutesDone : 0,
      estimatedMinutesTotal: courseStats ? courseStats.estimatedMinutesTotal : 0,
      estimatedMinutesRemaining: courseStats ? courseStats.estimatedMinutesRemaining : 0,
      tasksDoneCount,
      tasksTotalCount: certTasks.length,
    };
  };

  return {
    courses: coursesMap,
    certifications: {
      'CLF-C02': buildCertStats('CLF-C02', 'merico'),
      'DEA-C01': buildCertStats('DEA-C01', 'maarek'),
      DBT: buildCertStats('DBT', 'toth'),
    },
  };
}

/**
 * Retourne les indices d'items (item.i) correspondant a une plage de lecons [firstLecture, lastLecture]
 * d'un cours Udemy, en incluant les quiz et exercices rattaches a cette plage.
 */
export function getItemIndicesForLectureRange(
  course: UdemyCourse,
  firstLecture: number,
  lastLecture: number
): number[] {
  const indices: number[] = [];
  let currentLectureNum = 0;
  for (const item of course.items) {
    if (typeof item.n === 'number') {
      currentLectureNum = item.n;
    }
    if (currentLectureNum >= firstLecture && currentLectureNum <= lastLecture) {
      indices.push(item.i);
    }
  }
  return indices;
}
