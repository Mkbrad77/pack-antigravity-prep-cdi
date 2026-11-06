/**
 * Bac a sable SQL du mode cloud : SQLite compile en WebAssembly (sql.js),
 * expose avec le meme contrat SqlDb que node:sqlite. Meme moteur SQLite,
 * donc memes resultats que sur le PC.
 */
import initSqlJs from 'sql.js/dist/sql-wasm-browser.js';
import type { SqlJsStatic, Database } from 'sql.js';
// Module WebAssembly precompile, fourni par le bundler de Wrangler
import sqlWasmModule from 'sql.js/dist/sql-wasm-browser.wasm';
import type { SqlDb, SqlStatement } from '../src/server/sqlDb';

let sqlJsPromise: Promise<SqlJsStatic> | null = null;
let sqlJs: SqlJsStatic | null = null;

/** A appeler (await) avant toute requete du bac a sable. */
export async function ensureSqlJs(): Promise<SqlJsStatic> {
  if (sqlJs) return sqlJs;
  if (!sqlJsPromise) {
    // sql.js (build navigateur) lit self.location.href, absent dans un Worker Cloudflare
    const g = globalThis as { location?: { href: string } };
    if (!g.location) {
      try {
        g.location = { href: 'https://worker.invalid/' };
      } catch {
        // ignore
      }
    }
    sqlJsPromise = initSqlJs({
      instantiateWasm(imports: WebAssembly.Imports, onSuccess: (instance: WebAssembly.Instance) => void) {
        WebAssembly.instantiate(sqlWasmModule as WebAssembly.Module, imports).then((instance) =>
          onSuccess(instance)
        );
        return {};
      },
    } as never)
      .then((mod) => {
        sqlJs = mod;
        return mod;
      })
      .catch((err) => {
        sqlJsPromise = null;
        throw err;
      });
  }
  return sqlJsPromise;
}

function toBindable(params: unknown[]): (string | number | null | Uint8Array)[] {
  return params.map((p) => {
    if (p === undefined || p === null) return null;
    if (typeof p === 'boolean') return p ? 1 : 0;
    if (typeof p === 'bigint') return Number(p);
    return p as string | number | Uint8Array;
  });
}

class SqlJsDb implements SqlDb {
  constructor(private readonly db: Database) {}

  exec(script: string): void {
    this.db.exec(script);
  }

  prepare(query: string): SqlStatement {
    const db = this.db;
    const collect = (params: unknown[], limit = Infinity) => {
      const stmt = db.prepare(query);
      try {
        if (params.length) stmt.bind(toBindable(params));
        const rows: Record<string, unknown>[] = [];
        while (rows.length < limit && stmt.step()) rows.push(stmt.getAsObject());
        return rows;
      } finally {
        stmt.free();
      }
    };
    return {
      get: (...params: unknown[]) => collect(params, 1)[0],
      all: (...params: unknown[]) => collect(params),
      run: (...params: unknown[]) => {
        db.run(query, toBindable(params));
        const id = db.exec('SELECT last_insert_rowid()')[0]?.values[0]?.[0];
        return { changes: db.getRowsModified(), lastInsertRowid: Number(id ?? 0) };
      },
    };
  }

  close(): void {
    this.db.close();
  }
}

/** Fabrique synchrone (ensureSqlJs() doit avoir ete attendu avant). */
export function openSqlJsInMemory(): SqlDb {
  if (!sqlJs) throw new Error('Moteur SQL (sql.js) non initialise.');
  return new SqlJsDb(new sqlJs.Database());
}
