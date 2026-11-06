import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { executePythonCode } from '../../src/server/pythonSandbox';

describe('PythonSandbox & Exercises', () => {
  it('doit executer un code Python simple avec succes', async () => {
    const result = await executePythonCode({
      code: 'print("Hello from Python")',
    });
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('Hello from Python');
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('doit valider les assertions de tests unitaires via check_assert', async () => {
    const result = await executePythonCode({
      code: 'def add(a, b): return a + b',
      testCode: `
check_assert(add(2, 3) == 5, 'Cas simple')
check_assert(add(-1, 1) == 0, 'Zero')
`,
    });
    expect(result.success).toBe(true);
    expect(result.passedAssertions).toBe(2);
    expect(result.totalAssertions).toBe(2);
  });

  it('doit echouer proprement si une assertion est fausse', async () => {
    const result = await executePythonCode({
      code: 'def add(a, b): return a - b',
      testCode: `
check_assert(add(2, 3) == 5, 'Addition incorrecte')
`,
    });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('doit interrompre les boucles infinies via timeout', async () => {
    const result = await executePythonCode({
      code: 'while True: pass',
      timeoutMs: 1000,
    });
    expect(result.success).toBe(false);
    expect(result.stderr).toContain('Timeout');
  });

  it('doit verifier la validite des 70 exercices Python et l absence de tirets cadratins', async () => {
    const jsonPath = path.resolve(process.cwd(), 'content', 'entretiens', 'python_exercises.json');
    expect(fs.existsSync(jsonPath)).toBe(true);

    const raw = fs.readFileSync(jsonPath, 'utf-8');
    // Règle stricte : ZÉRO tiret cadratin ou demi-cadratin
    expect(raw).not.toContain('\u2014');
    expect(raw).not.toContain('\u2013');

    const exercises = JSON.parse(raw);
    expect(exercises.length).toBe(70);

    // Verifier que chaque exercice a les champs obligatoires
    for (const ex of exercises) {
      expect(ex.id).toBeDefined();
      expect(ex.title).toBeDefined();
      expect(ex.category).toBeDefined();
      expect(ex.difficulty).toBeDefined();
      expect(ex.description).toBeDefined();
      expect(ex.starterCode).toBeDefined();
      expect(ex.testCode).toBeDefined();
      expect(ex.solutionCode).toBeDefined();
      expect(ex.solutionExplanation).toBeDefined();
    }

    // Tester un echantillon représentatif de solutions d exercices
    const sampleIds = ['py-001', 'py-005', 'py-012', 'py-025', 'py-042', 'py-060', 'py-070'];
    for (const id of sampleIds) {
      const ex = exercises.find((item: { id: string }) => item.id === id);
      expect(ex).toBeDefined();
      const res = await executePythonCode({
        code: ex.solutionCode,
        testCode: ex.testCode,
      });
      if (!res.success) {
        throw new Error(`Exercice ${ex.id} (${ex.title}) a echoue : ${res.error}\nStdout : ${res.stdout}\nStderr : ${res.stderr}`);
      }
      expect(res.success).toBe(true);
      expect(res.passedAssertions).toBe(res.totalAssertions);
    }
  }, 15000);
});
