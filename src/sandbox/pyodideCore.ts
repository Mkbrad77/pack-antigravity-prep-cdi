/**
 * Coeur d'execution d'un harnais Python avec Pyodide (Python compile en WebAssembly).
 * Utilise par le Web Worker du navigateur en mode cloud ; testable sous Node.
 */
export const PYODIDE_VERSION = '314.0.7';
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export interface PyodideLike {
  setStdout(opts: { batched: (s: string) => void }): void;
  setStderr(opts: { batched: (s: string) => void }): void;
  loadPackagesFromImports(code: string): Promise<unknown>;
  runPython(code: string, opts?: { globals?: unknown }): unknown;
  globals: { get(name: string): (...args: unknown[]) => { destroy?: () => void } };
}

export interface PyodideRawResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function runHarnessWithPyodide(py: PyodideLike, harness: string): Promise<PyodideRawResult> {
  let stdout = '';
  let stderr = '';
  py.setStdout({ batched: (s) => (stdout += `${s}\n`) });
  py.setStderr({ batched: (s) => (stderr += `${s}\n`) });

  // Espace de noms neuf a chaque execution (aucune variable ne fuit d'un essai a l'autre)
  const namespace = py.globals.get('dict')();
  let exitCode = 0;
  try {
    try {
      await py.loadPackagesFromImports(harness);
    } catch {
      // Paquet introuvable : l'erreur d'import remontera a l'execution
    }
    // Execution synchrone (comme `python -c`) : le mode asynchrone de Pyodide compile
    // differemment certains `nonlocal` ; on est dans un Web Worker, l'interface ne gele pas.
    py.runPython(harness, { globals: namespace });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const exit = /SystemExit:\s*(\d+)?/.exec(message);
    if (exit) {
      exitCode = exit[1] ? Number(exit[1]) : 0;
    } else {
      exitCode = 1;
      stderr += message;
    }
  } finally {
    namespace.destroy?.();
  }
  return { stdout, stderr, exitCode };
}
