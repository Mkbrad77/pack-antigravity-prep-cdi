import { PythonExecutionResult } from '../workers/types';
import { buildPythonHarness, interpretPythonRun } from './pythonHarness';
import { requireNodeBuiltin } from './sqlDb';

export interface PythonSandboxParams {
  code: string;
  testCode?: string;
  timeoutMs?: number;
}

export async function executePythonCode(params: PythonSandboxParams): Promise<PythonExecutionResult> {
  const startTime = performance.now();
  const timeoutMs = params.timeoutMs ?? 4000;

  const testHarness = buildPythonHarness(params.code, params.testCode);

  const { spawn } = requireNodeBuiltin<typeof import('node:child_process')>('node:child_process');

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
      resolve(
        interpretPythonRun({
          stdout,
          stderr,
          exitCode: code,
          killedByTimeout,
          timeoutMs,
          hasTests: Boolean(params.testCode),
          executionTimeMs: execTime,
        })
      );
    });
  });
}
