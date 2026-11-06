import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { executeSqlSandbox } from '../../src/server/sqlSandbox';
import { compareSqlResults } from '../../src/domain/sqlComparison';
import { ALL_SQL_DATASETS } from '../../src/domain/sqlDatasets';

describe('SqlSandbox & Datasets', () => {
  it('doit charger les 4 jeux de donnees sans erreur', () => {
    expect(ALL_SQL_DATASETS.length).toBe(4);
    const ids = ALL_SQL_DATASETS.map((d) => d.id);
    expect(ids).toContain('ecommerce');
    expect(ids).toContain('streaming_events');
    expect(ids).toContain('hr_payroll');
    expect(ids).toContain('banking_fraud');
  });

  it('doit executer une requete simple sur ecommerce', () => {
    const result = executeSqlSandbox({
      datasetId: 'ecommerce',
      userQuery: 'SELECT COUNT(*) AS total FROM customers;',
    });
    expect(result.success).toBe(true);
    expect(result.columns).toEqual(['total']);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].total).toBe(10);
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('doit extraire le plan d execution EXPLAIN QUERY PLAN', () => {
    const result = executeSqlSandbox({
      datasetId: 'ecommerce',
      userQuery: 'SELECT * FROM orders WHERE order_id = 1001;',
    });
    expect(result.success).toBe(true);
    expect(result.queryPlan).toBeDefined();
    expect(result.queryPlan!.length).toBeGreaterThan(0);
  });

  it('doit retourner une erreur explicite pour une requete syntaxiquement invalide', () => {
    const result = executeSqlSandbox({
      datasetId: 'ecommerce',
      userQuery: 'SELECT * FORM orders;',
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Erreur SQL');
  });

  it('doit comparer les resultats avec tolerance d ordre et flottants', () => {
    const res = compareSqlResults(
      ['id', 'score'],
      [{ id: 1, score: 99.9999 }, { id: 2, score: 50.0 }],
      ['id', 'score'],
      [{ id: 2, score: 50.0 }, { id: 1, score: 100.0 }],
      false
    );
    expect(res.passed).toBe(true);
  });

  it('doit echouer la comparaison si le nombre de colonnes differe', () => {
    const res = compareSqlResults(
      ['id'],
      [{ id: 1 }],
      ['id', 'name'],
      [{ id: 1, name: 'Alice' }],
      false
    );
    expect(res.passed).toBe(false);
    expect(res.diffSummary).toContain('Nombre de colonnes different');
  });

  it('doit valider la syntaxe et l execution des 105 exercices de sql_exercises.json', () => {
    const jsonPath = path.resolve(process.cwd(), 'content', 'entretiens', 'sql_exercises.json');
    expect(fs.existsSync(jsonPath)).toBe(true);

    const raw = fs.readFileSync(jsonPath, 'utf-8');
    // Verification stricte de l absence de tirets cadratins
    expect(raw).not.toContain('\u2014'); // Tiret cadratin em-dash
    expect(raw).not.toContain('\u2013'); // Tiret demi-cadratin en-dash

    const exercises = JSON.parse(raw);
    expect(exercises.length).toBe(105);

    // Tester chaque requete attendue pour verifier qu elle s execute parfaitement
    for (const ex of exercises) {
      const res = executeSqlSandbox({
        datasetId: ex.datasetId,
        userQuery: ex.expectedQuery,
        expectedQuery: ex.expectedQuery,
        orderDependent: ex.orderDependent,
      });

      if (!res.success) {
        throw new Error(`Exercice ${ex.id} (${ex.title}) a echoue : ${res.error}\nRequete : ${ex.expectedQuery}`);
      }
      expect(res.success).toBe(true);
      expect(res.comparison?.passed).toBe(true);
    }
  });
});
