/**
 * Contrat minimal d'une base SQLite synchrone, partagé par :
 * - `node:sqlite` (DatabaseSync) en mode local sur PC,
 * - le stockage SQLite d'un Durable Object Cloudflare (mode cloud / mobile),
 * - sql.js (WebAssembly) pour le bac à sable SQL côté cloud.
 *
 * Les méthodes sont déclarées en syntaxe "méthode" pour rester compatibles
 * structurellement avec les types de `node:sqlite`.
 */
export interface SqlRunResult {
  changes: number | bigint;
  lastInsertRowid: number | bigint;
}

export interface SqlStatement {
  get(...params: any[]): unknown;
  all(...params: any[]): unknown[];
  run(...params: any[]): SqlRunResult;
}

export interface SqlDb {
  exec(sql: string): void;
  prepare(sql: string): SqlStatement;
  close?(): void;
}

/** Accès synchrone à un module natif Node sans import statique (le bundle Cloudflare reste sans dépendance Node). */
export function requireNodeBuiltin<T>(name: string): T {
  const proc = (globalThis as { process?: { getBuiltinModule?: (n: string) => unknown } }).process;
  if (!proc || typeof proc.getBuiltinModule !== 'function') {
    throw new Error(
      `Module ${name} indisponible : ce code doit tourner sous Node.js 22.3+ (mode local).`
    );
  }
  return proc.getBuiltinModule(name) as T;
}

/** Ouvre une base `node:sqlite` (mode local uniquement). */
export function openNodeSqlite(filePath: string): SqlDb {
  const { DatabaseSync } = requireNodeBuiltin<typeof import('node:sqlite')>('node:sqlite');
  return new DatabaseSync(filePath) as unknown as SqlDb;
}
