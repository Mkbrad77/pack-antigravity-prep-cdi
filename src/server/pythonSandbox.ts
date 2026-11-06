import { spawn } from 'node:child_process';
import { PythonExecutionResult } from '../workers/types';

export interface PythonSandboxParams {
  code: string;
  testCode?: string;
  timeoutMs?: number;
}

function stripAnsi(text: string): string {
  return text.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
}

export async function executePythonCode(params: PythonSandboxParams): Promise<PythonExecutionResult> {
  const startTime = performance.now();
  const timeoutMs = params.timeoutMs ?? 4000;

  const testHarness = `
import sys
import time

# Code candidat
${params.code}

# Execution des tests unitaires
${params.testCode ? `
_passed_tests = 0
_total_tests = 0

def check_assert(condition, desc=""):
    global _passed_tests, _total_tests
    _total_tests += 1
    assert condition, desc
    _passed_tests += 1

${params.testCode}

print(f"\\n__TEST_RESULTS__:{_passed_tests}/{_total_tests}")
` : ''}
`;

  return new Promise((resolve) => {
    // Essayer 'python' puis 'python3' ou 'py' selon le systeme
    const isWindows = process.platform === 'win32';
    const binary = isWindows ? 'python' : 'python3';

    let stdout = '';
    let stderr = '';
    let killedByTimeout = false;

    let child;
    try {
      child = spawn(binary, ['-c', testHarness], {
        env: {
          ...process.env,
          PYTHONUNBUFFERED: '1',
          PYTHONDONTWRITEBYTECODE: '1',
          PYTHON_COLORS: '0',
          PYTHONIOENCODING: 'utf-8',
        },
      });
    } catch (spawnErr) {
      const execTime = Math.round((performance.now() - startTime) * 100) / 100;
      resolve({
        requestId: `py-${Date.now()}`,
        success: false,
        stdout: '',
        stderr: '',
        executionTimeMs: execTime,
        error: `Impossible de lancer Python (${binary}) : ${spawnErr instanceof Error ? spawnErr.message : String(spawnErr)}. Verifiez que Python 3 est installe et accessible dans le PATH.`,
      });
      return;
    }

    const timer = setTimeout(() => {
      killedByTimeout = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      const execTime = Math.round((performance.now() - startTime) * 100) / 100;
      resolve({
        requestId: `py-${Date.now()}`,
        success: false,
        stdout,
        stderr: err.message,
        executionTimeMs: execTime,
        error: `Erreur d'execution Python : ${err.message}. Verifiez que Python est bien present dans votre variable d'environnement PATH.`,
      });
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      const execTime = Math.round((performance.now() - startTime) * 100) / 100;

      if (killedByTimeout) {
        resolve({
          requestId: `py-${Date.now()}`,
          success: false,
          stdout,
          stderr: `Timeout : Le script a depasse le delai limite de ${timeoutMs} ms (boucle infinie probable).`,
          executionTimeMs: execTime,
          error: `Execution interrompue : Temps d'execution superieur a ${timeoutMs} ms.`,
        });
        return;
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

      const success = code === 0 && (!params.testCode || (totalAssertions > 0 && passedAssertions === totalAssertions));

      const cleanedStdout = stripAnsi(stdout).trim();
      const cleanedStderr = stripAnsi(stderr).trim();

      resolve({
        requestId: `py-${Date.now()}`,
        success,
        stdout: cleanedStdout,
        stderr: cleanedStderr,
        executionTimeMs: execTime,
        passedAssertions,
        totalAssertions,
        error: code !== 0 ? (cleanedStderr || `Le script a quitte avec le code d'erreur ${code}`) : undefined,
      });
    });
  });
}
