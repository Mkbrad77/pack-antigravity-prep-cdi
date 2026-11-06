import { createRequire } from 'node:module';
import type { DatabaseSync as DatabaseSyncType } from 'node:sqlite';
import { getDatasetById, SqlDatasetDefinition } from '../domain/sqlDatasets';
import { compareSqlResults } from '../domain/sqlComparison';

const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite') as {
  DatabaseSync: typeof DatabaseSyncType;
};

export interface SqlSandboxParams {
  datasetId: 'ecommerce' | 'streaming_events' | 'hr_payroll' | 'banking_fraud' | 'none';
  userQuery: string;
  expectedQuery?: string;
  orderDependent?: boolean;
  maxRows?: number;
}

export interface QueryPlanNode {
  id: number;
  parent: number;
  notused: number;
  detail: string;
}

export interface SqlSandboxResult {
  success: boolean;
  error?: string;
  columns: string[];
  rows: Array<Record<string, unknown>>;
  totalRowCount: number;
  truncated: boolean;
  executionTimeMs: number;
  queryPlan?: QueryPlanNode[];
  comparison?: {
    passed: boolean;
    diffSummary: string;
  };
}

function sanitizeSql(sql: string): string {
  const trimmed = sql.trim();
  // Suppression des commentaires et points-virgules finaux superflus
  return trimmed.replace(/;+\s*$/, '');
}

function initInMemoryDb(dataset?: SqlDatasetDefinition): InstanceType<typeof DatabaseSync> {
  const db = new DatabaseSync(':memory:');
  if (dataset) {
    db.exec(dataset.schemaSql);
    db.exec(dataset.seedSql);
  }
  return db;
}

export function executeSqlSandbox(params: SqlSandboxParams): SqlSandboxResult {
  const startTime = performance.now();
  const maxRows = params.maxRows ?? 200;
  const cleanUserQuery = sanitizeSql(params.userQuery);

  if (!cleanUserQuery) {
    return {
      success: false,
      error: 'La requete SQL fournie est vide.',
      columns: [],
      rows: [],
      totalRowCount: 0,
      truncated: false,
      executionTimeMs: 0,
    };
  }

  const dataset = params.datasetId !== 'none' ? getDatasetById(params.datasetId) : undefined;
  if (params.datasetId !== 'none' && !dataset) {
    return {
      success: false,
      error: `Jeu de donnees introuvable : ${params.datasetId}`,
      columns: [],
      rows: [],
      totalRowCount: 0,
      truncated: false,
      executionTimeMs: 0,
    };
  }

  let userDb: InstanceType<typeof DatabaseSync> | null = null;
  try {
    userDb = initInMemoryDb(dataset);

    // Extraction du plan d'execution (EXPLAIN QUERY PLAN) si requete de selection
    let queryPlan: QueryPlanNode[] | undefined;
    const isSelectLike = /^\s*(WITH|SELECT|VALUES)\b/i.test(cleanUserQuery);

    if (isSelectLike) {
      try {
        const planStmt = userDb.prepare(`EXPLAIN QUERY PLAN ${cleanUserQuery}`);
        queryPlan = planStmt.all() as unknown as QueryPlanNode[];
      } catch {
        // En cas d'erreur de syntaxe, l'execution ci-dessous remontera le message precis
      }
    }

    // Execution de la requete utilisateur
    const stmt = userDb.prepare(cleanUserQuery);
    const allRows = stmt.all() as unknown as Array<Record<string, unknown>>;
    const endTime = performance.now();
    const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

    const totalRowCount = allRows.length;
    const truncated = totalRowCount > maxRows;
    const rows = truncated ? allRows.slice(0, maxRows) : allRows;

    // Extraction des colonnes
    let columns: string[] = [];
    if (allRows.length > 0) {
      columns = Object.keys(allRows[0]);
    } else {
      // Requete valide mais 0 resultat, on extrait les colonnes du premier objet si possible
      columns = [];
    }

    // Comparaison avec la requete attendue si fournie
    let comparison: { passed: boolean; diffSummary: string } | undefined;
    if (params.expectedQuery && params.expectedQuery.trim()) {
      let expectedDb: InstanceType<typeof DatabaseSync> | null = null;
      try {
        expectedDb = initInMemoryDb(dataset);
        const cleanExpected = sanitizeSql(params.expectedQuery);
        const expStmt = expectedDb.prepare(cleanExpected);
        const expRows = expStmt.all() as unknown as Array<Record<string, unknown>>;
        const expCols = expRows.length > 0 ? Object.keys(expRows[0]) : [];

        comparison = compareSqlResults(
          columns,
          allRows,
          expCols,
          expRows,
          params.orderDependent ?? false
        );
      } catch (expErr) {
        comparison = {
          passed: false,
          diffSummary: `Erreur d'execution de la requete de reference : ${expErr instanceof Error ? expErr.message : String(expErr)}`,
        };
      } finally {
        if (expectedDb) {
          expectedDb.close();
        }
      }
    }

    return {
      success: true,
      columns,
      rows,
      totalRowCount,
      truncated,
      executionTimeMs,
      queryPlan,
      comparison,
    };
  } catch (err) {
    const endTime = performance.now();
    const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Erreur SQL : ${msg}`,
      columns: [],
      rows: [],
      totalRowCount: 0,
      truncated: false,
      executionTimeMs,
    };
  } finally {
    if (userDb) {
      userDb.close();
    }
  }
}
