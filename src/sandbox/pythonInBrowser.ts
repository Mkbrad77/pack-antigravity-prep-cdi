/**
 * Execution du Python dans le navigateur quand le serveur ne peut pas lancer d'interpreteur
 * (mode cloud). Le resultat a exactement le meme format que le bac a sable local.
 */
import { interpretPythonRun } from '../server/pythonHarness';
import type { PythonExecutionResult } from '../workers/types';

export interface ClientExecutionRequest {
  engine: 'pyodide';
  harness: string;
  hasTests: boolean;
  timeoutMs: number;
}

const INIT_TIMEOUT_MS = 120_000;
let worker: Worker | null = null;
let readyPromise: Promise<void> | null = null;

function resetWorker(): void {
  worker?.terminate();
  worker = null;
  readyPromise = null;
}

function ensureWorker(): Promise<void> {
  if (worker && readyPromise) return readyPromise;
  worker = new Worker(new URL('./pyodide.worker.ts', import.meta.url), { type: 'module' });
  const w = worker;
  readyPromise = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      resetWorker();
      reject(new Error('Chargement de Python trop long : vérifie ta connexion puis réessaie.'));
    }, INIT_TIMEOUT_MS);
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'ready') {
        clearTimeout(timer);
        w.removeEventListener('message', onMessage);
        resolve();
      } else if (e.data?.type === 'fatal') {
        clearTimeout(timer);
        w.removeEventListener('message', onMessage);
        resetWorker();
        reject(new Error(`Impossible de charger Python (Pyodide) : ${e.data.error}`));
      }
    };
    w.addEventListener('message', onMessage);
    w.postMessage({ type: 'init' });
  });
  return readyPromise;
}

/** Precharge Python en arriere-plan (ouverture de l'editeur Python). */
export function warmUpPythonInBrowser(): void {
  ensureWorker().catch(() => undefined);
}

export async function runPythonInBrowser(req: ClientExecutionRequest): Promise<PythonExecutionResult> {
  try {
    await ensureWorker();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      requestId: `py-${Date.now()}`,
      success: false,
      stdout: '',
      stderr: message,
      executionTimeMs: 0,
      error: message,
    };
  }

  const w = worker!;
  const id = `py-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const start = performance.now();

  return new Promise<PythonExecutionResult>((resolve) => {
    const finish = (raw: { stdout: string; stderr: string; exitCode: number | null; killed: boolean }) => {
      w.removeEventListener('message', onMessage);
      clearTimeout(timer);
      if (/can't start new thread/.test(raw.stderr)) {
        raw.stderr +=
          '\n\nNote : Python dans le navigateur (version mobile) ne sait pas lancer de threads. ' +
          'Fais cet exercice de concurrence sur la version PC de l application.';
      }
      resolve(
        interpretPythonRun({
          stdout: raw.stdout,
          stderr: raw.stderr,
          exitCode: raw.exitCode,
          killedByTimeout: raw.killed,
          timeoutMs: req.timeoutMs,
          hasTests: req.hasTests,
          executionTimeMs: Math.round((performance.now() - start) * 100) / 100,
        })
      );
    };
    const onMessage = (e: MessageEvent) => {
      if (e.data?.id !== id) return;
      if (e.data.type === 'result') {
        finish({ stdout: e.data.stdout, stderr: e.data.stderr, exitCode: e.data.exitCode, killed: false });
      } else if (e.data.type === 'fatal') {
        finish({ stdout: '', stderr: e.data.error, exitCode: 1, killed: false });
      }
    };
    // Boucle infinie : on arrete le Worker (Python sera recharge au prochain essai)
    const timer = setTimeout(() => {
      resetWorker();
      finish({ stdout: '', stderr: '', exitCode: null, killed: true });
    }, req.timeoutMs);
    w.addEventListener('message', onMessage);
    w.postMessage({ type: 'run', id, harness: req.harness });
  });
}
