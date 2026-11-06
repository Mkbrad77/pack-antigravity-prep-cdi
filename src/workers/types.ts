/**
 * Contrats d'architecture prepares dès la Phase 2 pour l'integration future (Phases 3 et 4)
 * de DuckDB-WASM (moteur SQL analytique local) et Pyodide (Python 3 en WebAssembly)
 * dans des Web Workers dédiés.
 */

export type SandboxEngineType = 'duckdb-wasm' | 'pyodide';

export interface WorkerInitRequest {
  type: 'INIT_ENGINE';
  engine: SandboxEngineType;
  datasets?: Array<{
    tableName: string;
    format: 'parquet' | 'csv' | 'json';
    urlOrContent: string;
  }>;
}

export interface SqlExecutionRequest {
  type: 'EXEC_SQL';
  requestId: string;
  query: string;
  timeoutMs?: number;
}

export interface PythonExecutionRequest {
  type: 'EXEC_PYTHON';
  requestId: string;
  code: string;
  testCode?: string;
  timeoutMs?: number;
}

export type SandboxWorkerRequest =
  | WorkerInitRequest
  | SqlExecutionRequest
  | PythonExecutionRequest;

export interface SqlExecutionResult {
  requestId: string;
  success: boolean;
  columns: string[];
  rows: Array<Record<string, unknown>>;
  executionTimeMs: number;
  explainPlan?: string;
  error?: string;
}

export interface PythonExecutionResult {
  requestId: string;
  success: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  passedAssertions?: number;
  totalAssertions?: number;
  error?: string;
}

export interface EngineStatusSummary {
  engine: SandboxEngineType;
  ready: boolean;
  phaseStatus: 'prepared_for_phase_3';
  descriptionFr: string;
}
