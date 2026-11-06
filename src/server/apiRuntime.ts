/**
 * Contrat entre le routeur API et son hote d'execution :
 * - mode local : Vite + Node sur le PC (voir nodeRuntime.ts),
 * - mode cloud : Durable Object Cloudflare (voir worker/userDataObject.ts).
 */
import type { PodcastsCatalogData } from '../domain/types';
import type { PythonExecutionResult } from '../workers/types';
import type { SqlDb } from './sqlDb';
import type { AutoRenamedAudioEntry } from './nodeRuntime';
import { createNodeRuntime } from './nodeRuntime';

export interface ApiRuntime {
  mode: 'local' | 'cloud';
  /** Le fichier audio `<folder>/<filename>` est-il disponible (disque local ou bucket R2) ? */
  audioExists(folder: string, filename: string): boolean;
  /** Renommage automatique des exports NotebookLM (mode local uniquement). */
  autoRenameAudios?(catalog: PodcastsCatalogData): AutoRenamedAudioEntry[];
  networkUrls(): string[];
  /** Base SQLite vide en memoire pour le bac a sable SQL. */
  openInMemorySqlDb(): SqlDb;
  /** Absent en mode cloud : le Python s'execute alors dans le navigateur (Pyodide). */
  executePython?(params: { code: string; testCode?: string; timeoutMs?: number }): Promise<PythonExecutionResult>;
}

let defaultNodeRuntime: ApiRuntime | null = null;

export function getDefaultNodeRuntime(): ApiRuntime {
  if (!defaultNodeRuntime) defaultNodeRuntime = createNodeRuntime();
  return defaultNodeRuntime;
}
