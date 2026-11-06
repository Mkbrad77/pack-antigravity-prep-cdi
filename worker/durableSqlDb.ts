/**
 * Adaptateur : stockage SQLite d'un Durable Object Cloudflare -> contrat SqlDb
 * (le meme que node:sqlite). Permet de reutiliser src/server/db.ts sans le reecrire.
 *
 * Transactions : les Durable Objects interdisent BEGIN / COMMIT / ROLLBACK en SQL.
 * Ces instructions sont donc ignorees ici, et l'atomicite est assuree a un niveau
 * superieur : chaque appel de methode du store est execute dans
 * `ctx.storage.transactionSync()` (voir userDataObject.ts). Si une erreur est levee,
 * tout ce que l'appel a ecrit est annule.
 */
import type { SqlDb, SqlRunResult, SqlStatement } from '../src/server/sqlDb';

/** Decoupe un script SQL en instructions, en respectant les chaines et les commentaires. */
export function splitSqlStatements(script: string): string[] {
  const out: string[] = [];
  let current = '';
  let i = 0;
  let quote: string | null = null;
  while (i < script.length) {
    const c = script[i];
    const next = script[i + 1];
    if (quote) {
      current += c;
      if (c === quote) {
        if (next === quote) {
          current += next;
          i += 2;
          continue;
        }
        quote = null;
      }
      i++;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      quote = c;
      current += c;
      i++;
      continue;
    }
    if (c === '-' && next === '-') {
      while (i < script.length && script[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && next === '*') {
      const end = script.indexOf('*/', i + 2);
      i = end < 0 ? script.length : end + 2;
      continue;
    }
    if (c === ';') {
      if (current.trim()) out.push(current.trim());
      current = '';
      i++;
      continue;
    }
    current += c;
    i++;
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

const TRANSACTION_CONTROL = /^(BEGIN|COMMIT|END|ROLLBACK|SAVEPOINT|RELEASE)\b/i;
const IGNORED_PRAGMAS = /^PRAGMA\s+(journal_mode|foreign_keys|synchronous)\b/i;

function normalizeParams(params: unknown[]): unknown[] {
  return params.map((p) => {
    if (p === undefined) return null;
    if (typeof p === 'boolean') return p ? 1 : 0;
    if (typeof p === 'bigint') return Number(p);
    return p;
  });
}

/** Sous-ensemble de l'API SqlStorage des Durable Objects utilise ici. */
export interface SqlStorageLike {
  exec(query: string, ...bindings: unknown[]): { toArray(): unknown[]; readonly rowsWritten: number };
}

export class DurableSqlDb implements SqlDb {
  constructor(private readonly sql: SqlStorageLike) {}

  exec(script: string): void {
    for (const stmt of splitSqlStatements(script)) {
      if (TRANSACTION_CONTROL.test(stmt) || IGNORED_PRAGMAS.test(stmt)) continue;
      this.sql.exec(stmt).toArray();
    }
  }

  prepare(query: string): SqlStatement {
    const sql = this.sql;
    return {
      get(...params: unknown[]) {
        const rows = sql.exec(query, ...normalizeParams(params)).toArray();
        return rows[0];
      },
      all(...params: unknown[]) {
        return sql.exec(query, ...normalizeParams(params)).toArray();
      },
      run(...params: unknown[]): SqlRunResult {
        const cursor = sql.exec(query, ...normalizeParams(params));
        cursor.toArray();
        const changes = cursor.rowsWritten;
        const row = sql.exec('SELECT last_insert_rowid() AS id').toArray()[0] as { id?: number } | undefined;
        return { changes, lastInsertRowid: Number(row?.id ?? 0) };
      },
    };
  }
}
