/**
 * Durable Object qui heberge TA base SQLite en ligne (progression, taches, sessions,
 * flashcards, ecoutes de podcasts...). Il execute exactement le meme code metier que
 * le mode local (src/server/db.ts + src/server/api.ts).
 */
import { DurableObject } from 'cloudflare:workers';
import { LocalSqliteStore } from '../src/server/db';
import { handleApiRequest } from '../src/server/api';
import type { ApiRuntime } from '../src/server/apiRuntime';
import { createBundleContentSource } from '../src/server/contentSource';
import contentFiles from './generated/content.json';
import { DurableSqlDb } from './durableSqlDb';
import { ensureSqlJs, openSqlJsInMemory } from './sqljsDb';
import type { Env } from './env';

const AUDIO_INDEX_TTL_MS = 30_000;
const contentSource = createBundleContentSource(contentFiles as Record<string, string>);

export class UserDataObject extends DurableObject<Env> {
  private readonly store: LocalSqliteStore;
  private audioKeys = new Set<string>();
  private audioIndexAt = 0;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    const storage = ctx.storage;
    const db = new DurableSqlDb(storage.sql);
    // Migrations et initialisation dans une transaction atomique
    const rawStore = storage.transactionSync(
      () => new LocalSqliteStore({ db, content: contentSource, dbLabel: 'Cloudflare (Durable Object SQLite)' })
    );
    this.store = wrapInTransactions(rawStore, (fn) => storage.transactionSync(fn));
  }

  /** Liste des fichiers presents dans le bucket R2 (cache 30 s). */
  private async refreshAudioIndex(force = false): Promise<void> {
    if (!force && Date.now() - this.audioIndexAt < AUDIO_INDEX_TTL_MS) return;
    const keys = new Set<string>();
    let cursor: string | undefined;
    do {
      const page = await this.env.AUDIOS.list({ cursor, limit: 1000 });
      for (const obj of page.objects) keys.add(obj.key);
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
    this.audioKeys = keys;
    this.audioIndexAt = Date.now();
  }

  private runtime(): ApiRuntime {
    return {
      mode: 'cloud',
      audioExists: (folder, filename) => this.audioKeys.has(`${folder}/${filename}`),
      networkUrls: () => [],
      openInMemorySqlDb: openSqlJsInMemory,
      // executePython absent : le Python s'execute dans le navigateur (Pyodide)
    };
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    try {
      await this.refreshAudioIndex(url.pathname === '/api/podcasts/auto-rename');
    } catch {
      // R2 indisponible : on continue, les episodes apparaitront "non disponibles"
    }
    if (url.pathname === '/api/sandbox/sql') await ensureSqlJs();

    const bodyText = request.method === 'GET' || request.method === 'HEAD' ? '' : await request.text();
    const readBody = async (): Promise<Record<string, unknown>> => {
      if (!bodyText.trim()) return {};
      try {
        return JSON.parse(bodyText) as Record<string, unknown>;
      } catch {
        throw new Error('Corps de requête JSON invalide.');
      }
    };

    const result = await handleApiRequest(this.store, this.runtime(), request.method, path, readBody);
    return new Response(JSON.stringify(result.payload), {
      status: result.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }
}

/**
 * Enveloppe chaque appel de methode du store dans une transaction SQLite du Durable Object :
 * si une methode leve une erreur, toutes ses ecritures sont annulees (equivalent du ROLLBACK local).
 */
function wrapInTransactions<T extends object>(target: T, runInTx: <R>(fn: () => R) => R): T {
  let depth = 0;
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver);
      if (typeof value !== 'function') return value;
      return function (this: unknown, ...args: unknown[]) {
        if (depth > 0) return value.apply(receiver, args);
        depth++;
        try {
          return runInTx(() => value.apply(receiver, args));
        } finally {
          depth--;
        }
      };
    },
  });
}
