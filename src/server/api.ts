import type { IncomingMessage, ServerResponse } from 'node:http';
import { LocalSqliteStore, loadStaticDatasets } from './db';
import {
  computeAllCertificationsProgress,
  getItemIndicesForLectureRange,
} from '../domain/progression';
import {
  buildUnifiedTasks,
  computeWeekLoadSummary,
  reschedulePlanning,
  RescheduleTrigger,
} from '../domain/rescheduler';
import { evaluateCertificationReadiness } from '../domain/readiness';
import {
  createFlashcardInput,
  getDueFlashcards,
  reviewFlashcardSM2,
  ReviewGrade,
} from '../domain/spacedRepetition';
import { validateBackupPayload } from '../domain/backupValidator';
import { sandboxBridge } from '../workers/sandboxBridge';
import { CertCode, CourseKey, PodcastEpisode } from '../domain/types';
import { executeSqlSandbox } from './sqlSandbox';
import { buildPythonHarness } from './pythonHarness';
import { ApiRuntime, getDefaultNodeRuntime } from './apiRuntime';
import { getEffectiveTodayIso } from '../domain/dates';
import { ALL_SQL_DATASETS } from '../domain/sqlDatasets';

async function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Corps de requête JSON invalide.'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export function buildFullAppStatePayload(store: LocalSqliteStore, rt: ApiRuntime = getDefaultNodeRuntime()) {
  store.runMigrations();
  const staticData = loadStaticDatasets(store.content);

  // Auto-renommage transparent des nouveaux fichiers audio deposes dans public/audios/ (mode local uniquement)
  rt.autoRenameAudios?.(staticData.podcastsCatalog);

  const settings = store.getSettings();
  const lessonDoneMap = store.getLessonProgressMap();
  const taskStatesMap = store.getTaskStatesMap();
  const tasks = buildUnifiedTasks(
    staticData.planningHebdo,
    staticData.planningEntretiens,
    taskStatesMap
  );

  const progress = computeAllCertificationsProgress(
    staticData.catalogue,
    lessonDoneMap,
    tasks,
    settings.time_factors
  );

  const mockExams = store.getMockExams();
  const readiness = {
    'CLF-C02': evaluateCertificationReadiness('CLF-C02', mockExams, settings.readiness_rules),
    'DEA-C01': evaluateCertificationReadiness('DEA-C01', mockExams, settings.readiness_rules),
    DBT: evaluateCertificationReadiness('DBT', mockExams, settings.readiness_rules),
  };

  const flashcards = store.getFlashcards();
  const dueFlashcards = getDueFlashcards(flashcards, getEffectiveTodayIso(settings));

  const weekSummaries: Record<number, ReturnType<typeof computeWeekLoadSummary>> = {};
  for (let w = 1; w <= 22; w++) {
    weekSummaries[w] = computeWeekLoadSummary(w, tasks, staticData.planningHebdo, settings);
  }

  const studySessions = store.getStudySessions();
  const errorJournal = store.getErrorJournal();
  const taskHistory = store.getTaskHistory();
  const podcastProgressMap = store.getPodcastProgressMap();

  const certFolderMap: Record<CertCode, string> = {
    'CLF-C02': 'clf-c02',
    DBT: 'dbt',
    'DEA-C01': 'dea-c01',
  };

  const podcasts: PodcastEpisode[] = staticData.podcastsCatalog.episodes.map((ep) => {
    const folder = certFolderMap[ep.cert_code];
    let actualFile = ep.filename;
    let exists = rt.audioExists(folder, ep.filename);
    if (!exists) {
      for (const ext of ['.m4a', '.mp3', '.wav', '.aac', '.ogg']) {
        const candidate = `${ep.id}${ext}`;
        if (rt.audioExists(folder, candidate)) {
          exists = true;
          actualFile = candidate;
          break;
        }
      }
    }
    const prog = podcastProgressMap[ep.id];
    return {
      ...ep,
      filename: actualFile,
      audio_url: `/audios/${folder}/${actualFile}`,
      file_exists: exists,
      listen_count: prog?.listen_count ?? 0,
      last_position_sec: prog?.last_position_sec ?? 0,
    };
  });

  const hasDemoData =
    studySessions.some((s) => s.is_demo === 1) ||
    mockExams.some((m) => m.is_demo === 1) ||
    errorJournal.some((e) => e.is_demo === 1) ||
    flashcards.some((f) => f.is_demo === 1);

  return {
    staticData: {
      planningHebdo: staticData.planningHebdo,
      planningEntretiens: staticData.planningEntretiens,
      carteDesSujets: staticData.carteDesSujets,
      skillBuilderAws: staticData.skillBuilderAws,
      snowflakeDbtResources: staticData.snowflakeDbtResources,
      podcastsCatalog: staticData.podcastsCatalog,
      catalogueMeta: staticData.catalogue.meta,
      awsSkillBuilderCatalogue: staticData.catalogue.aws_skill_builder,
    },
    settings,
    tasks,
    weekSummaries,
    progress,
    readiness,
    studySessions,
    mockExams,
    errorJournal,
    flashcards,
    dueFlashcards,
    taskHistory,
    podcasts,
    networkUrls: rt.networkUrls(),
    runtimeMode: rt.mode,
    hasDemoData,
    workersStatus: sandboxBridge.getEnginesStatus(),
    dbPath: store.dbPath,
  };
}

export interface ApiResponse {
  status: number;
  payload: unknown;
}

/**
 * Coeur du routeur API, independant de Node : utilise par le middleware Vite (mode local)
 * et par le Durable Object Cloudflare (mode cloud / mobile).
 */
export async function handleApiRequest(
  store: LocalSqliteStore,
  rt: ApiRuntime,
  method: string,
  url: string,
  readBody: () => Promise<Record<string, unknown>>
): Promise<ApiResponse> {
  const pathname = url.split('?')[0];
  const contentSrc = store.content;
  const reply = (status: number, payload: unknown): ApiResponse => ({ status, payload });
  const fullState = () => buildFullAppStatePayload(store, rt);
  {
    try {
      // 1. Etat global de l'application
      if (pathname === '/api/state' && method === 'GET') {
        return reply(200, fullState());
      }

      // 2. Detail des lecons d'un cours Udemy (chargement rapide par cours)
      if (pathname.startsWith('/api/courses/') && method === 'GET') {
        const courseKey = pathname.replace('/api/courses/', '') as CourseKey;
        const staticData = loadStaticDatasets(contentSrc);
        const course = staticData.catalogue.udemy_courses.find((c) => c.key === courseKey);
        if (!course) {
          return reply(404, { error: `Cours introuvable : ${courseKey}` });
        }
        const lessonDoneMap = store.getLessonProgressMap();
        const itemsWithStatus = course.items.map((item) => ({
          ...item,
          done:
            lessonDoneMap[`${course.key}:${item.i}`] !== undefined
              ? lessonDoneMap[`${course.key}:${item.i}`]
              : Boolean(item.done),
        }));
        return reply(200, {
          ...course,
          items: itemsWithStatus,
        });
      }

      // 3. Cocher / decocher une lecon ou une plage entiere de lecons
      if (pathname === '/api/courses/lessons' && method === 'POST') {
        const body = await readBody();
        const courseKey = body.courseKey as CourseKey;
        const itemIndices = body.itemIndices as number[];
        const done = Boolean(body.done);

        if (!courseKey || !Array.isArray(itemIndices)) {
          return reply(400, { error: 'Paramètres courseKey et itemIndices requis.' });
        }

        store.setLessonsDoneRange(courseKey, itemIndices, done);
        return reply(200, fullState());
      }

      // 4. Actions sur une tache du planning (terminer, rouvrir, modifier la duree, ignorer bonus)
      if (pathname === '/api/tasks/update' && method === 'POST') {
        const body = await readBody();
        const taskId = String(body.taskId || '');
        const status = body.status as 'todo' | 'in_progress' | 'done' | 'postponed' | 'skipped' | 'compressed';
        const targetWeek = Number(body.targetWeek);
        const customDurationMin =
          body.customDurationMin !== undefined && body.customDurationMin !== null
            ? Number(body.customDurationMin)
            : undefined;
        const notes = body.notes !== undefined ? String(body.notes) : undefined;
        const reason = String(body.reason || '');

        const staticData = loadStaticDatasets(contentSrc);
        const currentTasks = buildUnifiedTasks(
          staticData.planningHebdo,
          staticData.planningEntretiens,
          store.getTaskStatesMap()
        );
        const existingTask = currentTasks.find((t) => t.id === taskId);
        if (!existingTask) {
          return reply(404, { error: `Tâche introuvable : ${taskId}` });
        }

        const finalTargetWeek = !Number.isNaN(targetWeek) && targetWeek > 0 ? targetWeek : existingTask.target_week;
        const finalDuration =
          customDurationMin !== undefined ? customDurationMin : existingTask.effective_est_min;

        let historyAction: 'complete' | 'reopen' | 'postpone' | 'compress' | 'skip' | 'edit_duration' = 'complete';
        if (status === 'done') historyAction = 'complete';
        else if (status === 'skipped') historyAction = 'skip';
        else if (customDurationMin !== undefined && customDurationMin !== existingTask.effective_est_min) {
          historyAction = 'edit_duration';
        } else if (finalTargetWeek !== existingTask.target_week) {
          historyAction = 'postpone';
        } else {
          historyAction = 'reopen';
        }

        const nextStatus = status || existingTask.status;

        store.upsertTaskState({
          task_id: taskId,
          status: nextStatus,
          target_week: finalTargetWeek,
          custom_duration_min: customDurationMin,
          notes,
          history: {
            action: historyAction,
            from_week: existingTask.target_week,
            to_week: finalTargetWeek,
            old_duration_min: existingTask.effective_est_min,
            new_duration_min: finalDuration,
            reason:
              reason ||
              (historyAction === 'complete'
                ? 'Tâche marquée comme terminée'
                : historyAction === 'skip'
                ? 'Tâche bonus ignorée volontairement'
                : historyAction === 'edit_duration'
                ? `Durée ajustée de ${existingTask.effective_est_min} min à ${finalDuration} min`
                : 'Mise à jour de la tâche'),
          },
        });

        if (
          existingTask.course_key &&
          existingTask.first_lecture !== undefined &&
          existingTask.last_lecture !== undefined &&
          (nextStatus === 'done' || nextStatus === 'todo')
        ) {
          const courseObj = staticData.catalogue.udemy_courses.find(
            (c) => c.key === existingTask.course_key
          );
          if (courseObj) {
            const itemIndices = getItemIndicesForLectureRange(
              courseObj,
              existingTask.first_lecture,
              existingTask.last_lecture
            );
            if (itemIndices.length > 0) {
              store.setLessonsDoneRange(
                existingTask.course_key,
                itemIndices,
                nextStatus === 'done'
              );
            }
          }
        }

        return reply(200, fullState());
      }

      // 5. Declencher le moteur de replanification dynamique
      if (pathname === '/api/reschedule' && method === 'POST') {
        const body = await readBody();
        const trigger = body.trigger as RescheduleTrigger;
        if (!trigger || !trigger.type) {
          return reply(400, { error: 'Le déclencheur de replanification (trigger) est requis.' });
        }

        const staticData = loadStaticDatasets(contentSrc);
        const settings = store.getSettings();
        const currentTasks = buildUnifiedTasks(
          staticData.planningHebdo,
          staticData.planningEntretiens,
          store.getTaskStatesMap()
        );

        const result = reschedulePlanning(
          currentTasks,
          staticData.planningHebdo,
          settings,
          trigger
        );

        // Persister chaque changement de tache et son historique dans SQLite
        for (const change of result.changes) {
          const updated = result.updatedTasks.find((t) => t.id === change.taskId);
          if (updated) {
            store.upsertTaskState({
              task_id: updated.id,
              status: updated.status,
              target_week: updated.target_week,
              custom_duration_min: updated.effective_est_min,
              history: {
                action:
                  change.action === 'skip'
                    ? 'skip'
                    : change.action === 'compress'
                    ? 'compress'
                    : 'postpone',
                from_week: change.fromWeek,
                to_week: change.toWeek,
                old_duration_min: change.oldDurationMin,
                new_duration_min: change.newDurationMin,
                reason: change.reason,
              },
            });
          }
        }

        // Mettre a jour les dates d'examens si modifiees par le scenario (Scenarios 4 et 5)
        if (
          JSON.stringify(result.updatedExamDates) !== JSON.stringify(settings.exam_dates)
        ) {
          store.saveSettings({
            ...settings,
            exam_dates: result.updatedExamDates,
          });
        }

        return reply(200, {
          rescheduleReport: {
            triggerType: result.triggerType,
            changes: result.changes,
            explanationFr: result.explanationFr,
            updatedExamDates: result.updatedExamDates,
          },
          state: fullState(),
        });
      }

      // 6. Journal des seances d'etude (ajout / suppression)
      if (pathname === '/api/sessions' && method === 'POST') {
        const body = await readBody();
        store.addStudySession({
          task_id: body.task_id ? String(body.task_id) : null,
          week_number: Number(body.week_number || 1),
          category: (body.category as 'certification' | 'interview') || 'certification',
          date: String(body.date || '2026-11-02'),
          duration_min: Math.max(1, Number(body.duration_min || 30)),
          mode: (body.mode as 'timer' | 'manual') || 'manual',
          notes: String(body.notes || ''),
          is_demo: 0,
        });
        return reply(200, fullState());
      }

      if (pathname.startsWith('/api/sessions/') && method === 'DELETE') {
        const id = Number(pathname.replace('/api/sessions/', ''));
        store.deleteStudySession(id);
        return reply(200, fullState());
      }

      // 7. Examens blancs (ajout / suppression)
      if (pathname === '/api/mock-exams' && method === 'POST') {
        const body = await readBody();
        store.addMockExam({
          cert_code: (body.cert_code as CertCode) || 'CLF-C02',
          source: String(body.source || 'Examen blanc'),
          date: String(body.date || '2026-11-02'),
          score_pct: Number(body.score_pct || 0),
          raw_score: body.raw_score !== undefined && body.raw_score !== null ? Number(body.raw_score) : null,
          domain_scores: (body.domain_scores as Record<string, number>) || {},
          notes: String(body.notes || ''),
          is_demo: 0,
        });
        return reply(200, fullState());
      }

      if (pathname.startsWith('/api/mock-exams/') && method === 'DELETE') {
        const id = Number(pathname.replace('/api/mock-exams/', ''));
        store.deleteMockExam(id);
        return reply(200, fullState());
      }

      // 8. Journal des erreurs (ajout / resolution / suppression)
      if (pathname === '/api/errors' && method === 'POST') {
        const body = await readBody();
        store.addErrorJournalEntry({
          cert_code: (body.cert_code as CertCode) || 'CLF-C02',
          domain_id: String(body.domain_id || 'Domaine général'),
          topic_id: String(body.topic_id || 's3'),
          question_summary: String(body.question_summary || ''),
          root_cause: String(body.root_cause || ''),
          action_to_review: String(body.action_to_review || ''),
          resolved: 0,
          is_demo: 0,
        });
        return reply(200, fullState());
      }

      if (pathname === '/api/errors/toggle' && method === 'POST') {
        const body = await readBody();
        store.toggleErrorResolved(Number(body.id), Boolean(body.resolved));
        return reply(200, fullState());
      }

      if (pathname.startsWith('/api/errors/') && method === 'DELETE') {
        const id = Number(pathname.replace('/api/errors/', ''));
        store.deleteErrorJournalEntry(id);
        return reply(200, fullState());
      }

      // 9. Repetition espacee SM-2 (creation de carte, revision SM-2, suppression)
      if (pathname === '/api/flashcards' && method === 'POST') {
        const body = await readBody();
        const settings = store.getSettings();
        const card = createFlashcardInput({
          id: `fc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          topic_id: String(body.topic_id || 's3'),
          cert_code: (body.cert_code as CertCode | 'INTERVIEW') || 'DEA-C01',
          front: String(body.front || ''),
          back: String(body.back || ''),
          provenance: body.provenance as never,
          source_url: String(body.source_url || ''),
          todayIso: getEffectiveTodayIso(settings),
          is_demo: 0,
        });
        store.upsertFlashcard(card);
        return reply(200, fullState());
      }

      if (pathname === '/api/flashcards/review' && method === 'POST') {
        const body = await readBody();
        const cardId = String(body.id || '');
        const grade = Number(body.grade) as ReviewGrade;
        const settings = store.getSettings();
        const existing = store.getFlashcards().find((c) => c.id === cardId);
        if (!existing) {
          return reply(404, { error: `Carte introuvable : ${cardId}` });
        }
        const updated = reviewFlashcardSM2(
          existing,
          grade,
          getEffectiveTodayIso(settings)
        );
        store.upsertFlashcard(updated);
        return reply(200, fullState());
      }

      if (pathname.startsWith('/api/flashcards/') && method === 'DELETE') {
        const id = decodeURIComponent(pathname.replace('/api/flashcards/', ''));
        store.deleteFlashcard(id);
        return reply(200, fullState());
      }

      // 10. Reglages (budgets, facteurs de temps, dates d'examens, seuils de preparation)
      if (pathname === '/api/settings' && method === 'POST') {
        const body = await readBody();
        const current = store.getSettings();
        const nextSettings = {
          ...current,
          ...body,
          time_factors: {
            ...current.time_factors,
            ...(body.time_factors as Record<string, number> | undefined),
          },
          exam_dates: {
            ...current.exam_dates,
            ...(body.exam_dates as Record<string, string> | undefined),
          },
          readiness_rules: {
            ...current.readiness_rules,
            ...(body.readiness_rules as Record<string, number> | undefined),
          },
        };
        store.saveSettings(nextSettings);
        return reply(200, fullState());
      }

      // 11. Sauvegarde JSON datee (Export)
      if (pathname === '/api/backup/export' && method === 'GET') {
        const backup = store.exportBackup();
        return reply(200, backup);
      }

      // 12. Restauration JSON avec validation du schema (Import)
      if (pathname === '/api/backup/import' && method === 'POST') {
        const body = await readBody();
        const validation = validateBackupPayload(body);
        if (!validation.valid || !validation.payload) {
          return reply(400, {
            error: 'Fichier de sauvegarde invalide.',
            details: validation.errors,
          });
        }
        store.importBackup(validation.payload);
        return reply(200, fullState());
      }

      // 13. Gestion des donnees DEMO (charger / supprimer en un clic)
      if (pathname === '/api/demo/load' && method === 'POST') {
        store.loadDemoData();
        return reply(200, fullState());
      }

      if (pathname === '/api/demo/clear' && method === 'POST') {
        store.clearDemoData();
        return reply(200, fullState());
      }

      // 14. Tout supprimer / Reinitialiser
      if (pathname === '/api/reset' && method === 'POST') {
        store.resetAllUserData();
        return reply(200, fullState());
      }

      // 15. Contenu des Certifications : Chapitres, Fiches Express et Questions
      if (pathname.startsWith('/api/certifications/')) {
        const parts = pathname.replace('/api/certifications/', '').split('/');
        const rawCert = parts[0] || '';
        const lowerCert = rawCert.toLowerCase();
        const certKey = lowerCert.includes('clf') ? 'clf' : lowerCert.includes('dea') ? 'dea' : lowerCert.includes('dbt') ? 'dbt' : null;

        if (!certKey) {
          return reply(400, { error: `Certification non reconnue : ${rawCert}` });
        }

        const certDir = `content/certifications/${certKey}`;

        // GET /api/certifications/:cert/chapters
        if (parts.length === 2 && parts[1] === 'chapters' && method === 'GET') {
          const chaptersDir = `${certDir}/chapters`;
          if (!contentSrc.exists(chaptersDir)) {
            return reply(200, []);
          }
          const files = contentSrc.list(chaptersDir).filter((f) => f.endsWith('.md')).sort();
          const items = files.map((filename) => {
            const fullPath = `${chaptersDir}/${filename}`;
            const content = contentSrc.read(fullPath);
            const lines = content.split('\n');
            const title = (lines[0] || '').replace(/^#\s*/, '').trim();
            const wordsCount = content.trim().split(/\s+/).filter(Boolean).length;
            const id = filename.replace(/\.md$/, '');
            return { id, filename, title, wordsCount };
          });
          return reply(200, items);
        }

        // GET /api/certifications/:cert/chapters/:id
        if (parts.length === 3 && parts[1] === 'chapters' && method === 'GET') {
          const safeId = parts[2].replace(/[^a-zA-Z0-9_-]/g, '');
          const filePath = `${certDir}/chapters/${safeId}.md`;
          if (!contentSrc.exists(filePath)) {
            return reply(404, { error: `Chapitre introuvable : ${safeId}` });
          }
          const content = contentSrc.read(filePath);
          const lines = content.split('\n');
          const title = (lines[0] || '').replace(/^#\s*/, '').trim();
          const wordsCount = content.trim().split(/\s+/).filter(Boolean).length;
          return reply(200, { id: safeId, filename: `${safeId}.md`, title, content, wordsCount });
        }

        // GET /api/certifications/:cert/fiches
        if (parts.length === 2 && parts[1] === 'fiches' && method === 'GET') {
          const fichesDir = `${certDir}/fiches_express`;
          if (!contentSrc.exists(fichesDir)) {
            return reply(200, []);
          }
          const files = contentSrc.list(fichesDir).filter((f) => f.endsWith('.md')).sort();
          const items = files.map((filename) => {
            const fullPath = `${fichesDir}/${filename}`;
            const content = contentSrc.read(fullPath);
            const lines = content.split('\n');
            const title = (lines[0] || '').replace(/^#\s*/, '').trim();
            const wordsCount = content.trim().split(/\s+/).filter(Boolean).length;
            const id = filename.replace(/\.md$/, '');
            return { id, filename, title, wordsCount };
          });
          return reply(200, items);
        }

        // GET /api/certifications/:cert/fiches/:id
        if (parts.length === 3 && parts[1] === 'fiches' && method === 'GET') {
          const safeId = parts[2].replace(/[^a-zA-Z0-9_-]/g, '');
          const filePath = `${certDir}/fiches_express/${safeId}.md`;
          if (!contentSrc.exists(filePath)) {
            return reply(404, { error: `Fiche express introuvable : ${safeId}` });
          }
          const content = contentSrc.read(filePath);
          const lines = content.split('\n');
          const title = (lines[0] || '').replace(/^#\s*/, '').trim();
          const wordsCount = content.trim().split(/\s+/).filter(Boolean).length;
          return reply(200, { id: safeId, filename: `${safeId}.md`, title, content, wordsCount });
        }

        // GET /api/certifications/:cert/questions
        if (parts.length === 2 && parts[1] === 'questions' && method === 'GET') {
          const questionsPath = `${certDir}/questions.json`;
          if (!contentSrc.exists(questionsPath)) {
            return reply(404, { error: `Banque de questions introuvable pour ${certKey}` });
          }
          const questionsRaw = contentSrc.read(questionsPath);
          const questions = JSON.parse(questionsRaw);
          return reply(200, questions);
        }
      }

      // 16. Entretien Technique : Datasets et Exercices SQL
      if (pathname === '/api/entretiens/sql/datasets' && method === 'GET') {
        const datasets = ALL_SQL_DATASETS.map((d) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          tables: d.tables,
          schemaSql: d.schemaSql,
        }));
        return reply(200, datasets);
      }

      if (pathname === '/api/entretiens/sql/exercises' && method === 'GET') {
        const exercisesPath = 'content/entretiens/sql_exercises.json';
        if (!contentSrc.exists(exercisesPath)) {
          return reply(200, []);
        }
        const exercisesRaw = contentSrc.read(exercisesPath);
        const exercises = JSON.parse(exercisesRaw);
        // Règle : Ne jamais révéler la solution dans le chargement de la liste
        const sanitized = exercises.map((ex: Record<string, unknown>) => ({
          id: ex.id,
          title: ex.title,
          category: ex.category,
          difficulty: ex.difficulty,
          datasetId: ex.datasetId,
          description: ex.description,
          instructions: ex.instructions,
          orderDependent: ex.orderDependent,
          hints: ex.hints,
          tags: ex.tags,
          hasSolution: true,
        }));
        return reply(200, sanitized);
      }

      // POST /api/sandbox/sql
      if (pathname === '/api/sandbox/sql' && method === 'POST') {
        const body = (await readBody()) as {
          exerciseId?: string;
          datasetId: 'ecommerce' | 'streaming_events' | 'hr_payroll' | 'banking_fraud' | 'none';
          userQuery: string;
          revealSolution?: boolean;
          userAttempted?: boolean;
        };

        let expectedQuery: string | undefined;
        let solutionExplanation: string | undefined;
        let orderDependent = false;

        if (body.exerciseId) {
          const exercisesPath = 'content/entretiens/sql_exercises.json';
          if (contentSrc.exists(exercisesPath)) {
            const exercises = JSON.parse(contentSrc.read(exercisesPath));
            const found = exercises.find((ex: { id: string }) => ex.id === body.exerciseId);
            if (found) {
              expectedQuery = found.expectedQuery;
              solutionExplanation = found.solutionExplanation;
              orderDependent = found.orderDependent ?? false;
            }
          }
        }

        const result = executeSqlSandbox({
          datasetId: body.datasetId || 'ecommerce',
          userQuery: body.userQuery || '',
          expectedQuery,
          orderDependent,
        }, rt.openInMemorySqlDb);

        // Solution révélée uniquement après tentative explicite de l'utilisateur
        const solution =
          body.revealSolution && body.userAttempted && expectedQuery
            ? {
                query: expectedQuery,
                explanation: solutionExplanation || '',
              }
            : undefined;

        return reply(200, {
          ...result,
          solution,
        });
      }

      // 17. Entretien Technique : Exercices et Sandbox Python
      if (pathname === '/api/entretiens/python/exercises' && method === 'GET') {
        const exercisesPath = 'content/entretiens/python_exercises.json';
        if (!contentSrc.exists(exercisesPath)) {
          return reply(200, []);
        }
        const exercisesRaw = contentSrc.read(exercisesPath);
        const exercises = JSON.parse(exercisesRaw);
        // Regle de securite pedagogique : ne jamais reveler les solutions lors du listing initial
        const sanitized = exercises.map((ex: Record<string, unknown>) => ({
          id: ex.id,
          title: ex.title,
          category: ex.category,
          difficulty: ex.difficulty,
          description: ex.description,
          starterCode: ex.starterCode,
          hints: ex.hints,
          tags: ex.tags,
          hasSolution: true,
        }));
        return reply(200, sanitized);
      }

      // POST /api/sandbox/python
      if (pathname === '/api/sandbox/python' && method === 'POST') {
        const body = (await readBody()) as {
          exerciseId?: string;
          userCode: string;
          revealSolution?: boolean;
          userAttempted?: boolean;
          timeoutMs?: number;
        };

        let testCode: string | undefined;
        let solutionCode: string | undefined;
        let solutionExplanation: string | undefined;

        if (body.exerciseId) {
          const exercisesPath = 'content/entretiens/python_exercises.json';
          if (contentSrc.exists(exercisesPath)) {
            const exercises = JSON.parse(contentSrc.read(exercisesPath));
            const found = exercises.find((ex: { id: string }) => ex.id === body.exerciseId);
            if (found) {
              testCode = found.testCode;
              solutionCode = found.solutionCode;
              solutionExplanation = found.solutionExplanation;
            }
          }
        }

        const solution =
          body.revealSolution && body.userAttempted && solutionCode
            ? {
                code: solutionCode,
                explanation: solutionExplanation || '',
              }
            : undefined;

        // Mode cloud : aucun interpreteur Python cote serveur, execution deleguee au navigateur (Pyodide)
        if (!rt.executePython) {
          return reply(200, {
            clientExecution: {
              engine: 'pyodide',
              harness: buildPythonHarness(body.userCode || '', testCode),
              hasTests: Boolean(testCode),
              timeoutMs: Math.max(body.timeoutMs || 4000, 15000),
            },
            solution,
          });
        }

        const result = await rt.executePython({
          code: body.userCode || '',
          testCode,
          timeoutMs: body.timeoutMs || 4000,
        });

        return reply(200, {
          ...result,
          solution,
        });
      }

      // 18. Entretien Technique : Cours et Fiches condensées
      if (pathname === '/api/entretiens/courses' && method === 'GET') {
        const manifestPath = 'content/entretiens/courses/manifest.json';
        if (!contentSrc.exists(manifestPath)) {
          return reply(404, { error: 'Manifest des cours d entretien introuvable' });
        }
        const raw = contentSrc.read(manifestPath);
        return reply(200, JSON.parse(raw));
      }

      if (pathname?.startsWith('/api/entretiens/courses/') && method === 'GET') {
        const cleanPath = pathname.replace('/api/entretiens/courses/', '');
        const parts = cleanPath.split('/');
        if (parts.length === 2) {
          const [cat, courseId] = parts;
          const courseFilePath = `content/entretiens/courses/${cat.replace(/[^a-zA-Z0-9_-]/g, '')}/${courseId.replace(/[^a-zA-Z0-9_.-]/g, '')}.md`;
          if (!contentSrc.exists(courseFilePath)) {
            return reply(404, { error: `Chapitre introuvable : ${cat}/${courseId}` });
          }
          const content = contentSrc.read(courseFilePath);
          return reply(200, {
            id: courseId,
            category: cat,
            content,
          });
        }
      }

      // 19. Entretien Technique : Banque de questions
      if (pathname === '/api/entretiens/questions' && method === 'GET') {
        const questionsPath = 'content/entretiens/interview_questions.json';
        if (!contentSrc.exists(questionsPath)) {
          return reply(200, []);
        }
        const raw = contentSrc.read(questionsPath);
        return reply(200, JSON.parse(raw));
      }

      // 20. Entretien Technique : Simulations d entretien
      if (pathname === '/api/entretiens/simulations' && method === 'GET') {
        const simulations = store.getInterviewSimulations();
        return reply(200, simulations);
      }

      if (pathname === '/api/entretiens/simulations' && method === 'POST') {
        const body = (await readBody()) as {
          id?: string;
          role: string;
          seniority: string;
          total_score: number;
          duration_seconds: number;
          details?: Record<string, unknown>;
          details_json?: string;
        };
        const simId = body.id || `sim-${Date.now()}`;
        const detailsJson = body.details_json || JSON.stringify(body.details || {});
        store.saveInterviewSimulation({
          id: simId,
          role: body.role,
          seniority: body.seniority,
          total_score: body.total_score,
          duration_seconds: body.duration_seconds,
          details_json: detailsJson,
        });
        return reply(200, { success: true, id: simId });
      }

      // 21. Entretien Technique : Competences
      if (pathname === '/api/entretiens/competencies' && method === 'GET') {
        const status = store.getCompetenciesStatus();
        return reply(200, status);
      }

      if (pathname === '/api/entretiens/competencies/record' && method === 'POST') {
        const body = (await readBody()) as {
          competency_id: string;
          session_id: string;
          success: boolean;
          notes?: string;
        };
        store.recordCompetencyAttempt({
          competency_id: body.competency_id,
          session_id: body.session_id,
          success: body.success,
          notes: body.notes,
        });
        const updated = store.getCompetenciesStatus();
        return reply(200, { success: true, competencies: updated });
      }

      // 22. Podcasts & Audios NotebookLM : progression d'ecoute recursive & auto-renommage
      if (pathname === '/api/podcasts/progress' && method === 'POST') {
        const body = await readBody();
        const episodeId = String(body.episode_id || '');
        if (!episodeId) {
          return reply(400, { error: 'episode_id requis.' });
        }
        store.upsertPodcastProgress({
          episode_id: episodeId,
          listen_count:
            body.listen_count !== undefined && body.listen_count !== null
              ? Number(body.listen_count)
              : undefined,
          increment_listen: Boolean(body.increment_listen),
          last_position_sec:
            body.last_position_sec !== undefined && body.last_position_sec !== null
              ? Number(body.last_position_sec)
              : undefined,
        });
        return reply(200, fullState());
      }

      if (pathname === '/api/podcasts/auto-rename' && method === 'POST') {
        const staticData = loadStaticDatasets(contentSrc);
        const renamed = rt.autoRenameAudios ? rt.autoRenameAudios(staticData.podcastsCatalog) : [];
        return reply(200, {
          renamed,
          state: fullState(),
        });
      }

      return reply(404, { error: `Route API inconnue : ${method} ${pathname}` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return reply(500, { error: msg });
    }
  }
}

/** Middleware Node (Vite dev / preview) : comportement historique du mode local. */
export function createApiMiddleware(store: LocalSqliteStore, rt: ApiRuntime = getDefaultNodeRuntime()) {
  return async (req: IncomingMessage, res: ServerResponse, next?: () => void) => {
    const url = req.url || '';
    if (!url.startsWith('/api/')) {
      if (next) next();
      return;
    }
    const result = await handleApiRequest(store, rt, req.method || 'GET', url, () => readJsonBody(req));
    sendJson(res, result.status, result.payload);
  };
}

