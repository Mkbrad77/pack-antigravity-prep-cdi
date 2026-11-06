import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test.describe('Captures d ecran interactions detaillees', () => {
  test('Interactions SQL, Python et Simulateur', async ({ page }) => {
    const screenshotDir = path.resolve(process.cwd(), 'screenshots');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(1000);

    // 1. SQL: Ouvrir modal schema, executer requete, afficher solution
    await page.getByTestId('nav-tab-interviews').click();
    await page.getByTestId('interview-subtab-sql').click();
    await page.waitForTimeout(500);

    // Clic schema
    await page.getByText('Inspecter le schema').click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '09b_sql_schema_modal.png') });

    // Masquer schema
    await page.getByText('Masquer le schema').click();
    await page.waitForTimeout(300);

    // Executer la requete SQL par defaut
    await page.getByText('Executer la requete').click();
    await page.waitForTimeout(1000);

    // Afficher la solution
    await page.getByRole('button', { name: /solution/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '09c_sql_executed_and_solution.png') });

    // 2. Python: Executer code, voir solution
    await page.getByTestId('interview-subtab-python').click();
    await page.waitForTimeout(500);
    await page.getByText('▶ Executer les tests unitaires').click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: /solution/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '10b_python_executed_and_solution.png') });

    // 3. Simulateur: Lancer la simulation
    await page.getByTestId('interview-subtab-simulator').click();
    await page.waitForTimeout(500);
    await page.getByText('Lancer l entretien technique →').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '11b_simulator_pitch.png') });

    // Passer au QCM
    await page.getByRole('button', { name: /Passer aux Questions Techniques/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '11c_simulator_qcm.png') });
  });
});
