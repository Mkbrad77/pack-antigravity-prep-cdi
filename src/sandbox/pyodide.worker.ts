/// <reference lib="webworker" />
/**
 * Web Worker : Python dans le navigateur (mode cloud / mobile).
 * Pyodide est charge une seule fois depuis le CDN jsDelivr, puis reutilise.
 */
import { PYODIDE_INDEX_URL, PyodideLike, runHarnessWithPyodide } from './pyodideCore';

let pyodidePromise: Promise<PyodideLike> | null = null;

function getPyodide(): Promise<PyodideLike> {
  if (!pyodidePromise) {
    pyodidePromise = import(/* @vite-ignore */ `${PYODIDE_INDEX_URL}pyodide.mjs`)
      .then((mod: { loadPyodide: (o: { indexURL: string }) => Promise<PyodideLike> }) =>
        mod.loadPyodide({ indexURL: PYODIDE_INDEX_URL })
      )
      .catch((err) => {
        pyodidePromise = null;
        throw err;
      });
  }
  return pyodidePromise;
}

self.onmessage = async (event: MessageEvent) => {
  const msg = event.data as { type: 'init' } | { type: 'run'; id: string; harness: string };
  try {
    const py = await getPyodide();
    if (msg.type === 'init') {
      self.postMessage({ type: 'ready' });
      return;
    }
    const result = await runHarnessWithPyodide(py, msg.harness);
    self.postMessage({ type: 'result', id: msg.id, ...result });
  } catch (err) {
    self.postMessage({
      type: 'fatal',
      id: msg.type === 'run' ? msg.id : undefined,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
