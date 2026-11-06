/**
 * Partie pure (sans Node) du bac à sable Python : construction du harnais de test
 * et interprétation des résultats. Partagée entre l'exécution locale (sous-processus
 * `python`) et l'exécution navigateur (Pyodide) du mode cloud.
 */
import { PythonExecutionResult } from '../workers/types';

export function stripAnsi(text: string): string {
  return text.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
}

export function buildPythonHarness(code: string, testCode?: string): string {
  return `
import sys
import time

# Code candidat
${code}

# Execution des tests unitaires
${testCode ? `
_passed_tests = 0
_total_tests = 0

def check_assert(condition, desc=""):
    global _passed_tests, _total_tests
    _total_tests += 1
    assert condition, desc
    _passed_tests += 1

${testCode}

print(f"\\n__TEST_RESULTS__:{_passed_tests}/{_total_tests}")
` : ''}
`;
}

export interface RawPythonRun {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  killedByTimeout: boolean;
  timeoutMs: number;
  hasTests: boolean;
  executionTimeMs: number;
}

export function interpretPythonRun(run: RawPythonRun): PythonExecutionResult {
  const execTime = run.executionTimeMs;
  let stdout = run.stdout;

  if (run.killedByTimeout) {
    return {
      requestId: `py-${Date.now()}`,
      success: false,
      stdout,
      stderr: `Timeout : Le script a depasse le delai limite de ${run.timeoutMs} ms (boucle infinie probable).`,
      executionTimeMs: execTime,
      error: `Execution interrompue : Temps d'execution superieur a ${run.timeoutMs} ms.`,
    };
  }

  // Extraction des resultats de tests
  let passedAssertions = 0;
  let totalAssertions = 0;
  const testMarkerRegex = /__TEST_RESULTS__:(\d+)\/(\d+)/;
  const match = stdout.match(testMarkerRegex);

  if (match) {
    passedAssertions = parseInt(match[1], 10);
    totalAssertions = parseInt(match[2], 10);
    stdout = stdout.replace(testMarkerRegex, '').trim();
  }

  const code = run.exitCode;
  const success =
    code === 0 && (!run.hasTests || (totalAssertions > 0 && passedAssertions === totalAssertions));

  const cleanedStdout = stripAnsi(stdout).trim();
  const cleanedStderr = stripAnsi(run.stderr).trim();

  return {
    requestId: `py-${Date.now()}`,
    success,
    stdout: cleanedStdout,
    stderr: cleanedStderr,
    executionTimeMs: execTime,
    passedAssertions,
    totalAssertions,
    error: code !== 0 ? cleanedStderr || `Le script a quitte avec le code d'erreur ${code}` : undefined,
  };
}
