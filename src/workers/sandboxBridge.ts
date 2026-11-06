import {
  EngineStatusSummary,
  PythonExecutionResult,
  SandboxEngineType,
  SqlExecutionResult,
} from './types';

/**
 * Pont d'orchestration des Web Workers pour DuckDB-WASM (SQL) et Pyodide (Python).
 * En Phase 2, ce module prepare les interfaces d'isolation de thread et la gestion de timeout
 * sans charger les binaires WASM lourds (prevus au Prompt 3).
 */
export class SandboxWorkerBridge {
  private readonly defaultTimeoutMs: number;

  constructor(defaultTimeoutMs = 5000) {
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  public getEnginesStatus(): Record<SandboxEngineType, EngineStatusSummary> {
    return {
      'duckdb-wasm': {
        engine: 'duckdb-wasm',
        ready: false,
        phaseStatus: 'prepared_for_phase_3',
        descriptionFr:
          'Architecture Web Worker prête pour DuckDB-WASM (activation prévue en Phase 3 : éditeur SQL et plans EXPLAIN).',
      },
      pyodide: {
        engine: 'pyodide',
        ready: false,
        phaseStatus: 'prepared_for_phase_3',
        descriptionFr:
          'Architecture Web Worker prête pour Pyodide Python 3 (activation prévue en Phase 3 : live coding Python et tests pytest).',
      },
    };
  }

  public async executeSqlStub(query: string): Promise<SqlExecutionResult> {
    return {
      requestId: `sql-${Date.now()}`,
      success: false,
      columns: [],
      rows: [],
      executionTimeMs: 0,
      error: `Le moteur DuckDB-WASM (timeout ${this.defaultTimeoutMs} ms) sera activé en Phase 3 pour exécuter : ${query.slice(0, 60)}`,
    };
  }

  public async executePythonStub(code: string): Promise<PythonExecutionResult> {
    return {
      requestId: `py-${Date.now()}`,
      success: false,
      stdout: '',
      stderr: '',
      executionTimeMs: 0,
      error: `Le moteur Pyodide (timeout ${this.defaultTimeoutMs} ms) sera activé en Phase 3 pour exécuter : ${code.slice(0, 60)}`,
    };
  }
}

export const sandboxBridge = new SandboxWorkerBridge();
