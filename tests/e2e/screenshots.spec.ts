import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test.describe('Captures d ecran completes pour audit visuel', () => {
  test('Capturer tous les onglets et sous-onglets', async ({ page }) => {
    const screenshotDir = path.resolve(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(1000);

    // 1. Dashboard
    await page.screenshot({ path: path.join(screenshotDir, '01_dashboard.png'), fullPage: false });

    // 2. Planning
    await page.getByTestId('nav-tab-planning').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '02_planning.png'), fullPage: false });

    // 3. Cours & Sujets
    await page.getByTestId('nav-tab-courses').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '03_courses.png'), fullPage: false });

    // 4. Certifications
    await page.getByTestId('nav-tab-certifications').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '04_certifications.png'), fullPage: false });

    // 5. Journal des seances
    await page.getByTestId('nav-tab-sessions').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '05_sessions.png'), fullPage: false });

    // 6. SRS
    await page.getByTestId('nav-tab-srs').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '06_srs.png'), fullPage: false });

    // 7. Settings
    await page.getByTestId('nav-tab-settings').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '07_settings.png'), fullPage: false });

    // 8. Entretiens techniques
    await page.getByTestId('nav-tab-interviews').click();
    await page.waitForTimeout(600);

    // 8.1 Cours
    await page.getByTestId('interview-subtab-courses').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '08_interview_courses.png'), fullPage: false });

    // 8.2 SQL
    await page.getByTestId('interview-subtab-sql').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '09_interview_sql.png'), fullPage: false });

    // 8.3 Python
    await page.getByTestId('interview-subtab-python').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '10_interview_python.png'), fullPage: false });

    // 8.4 Simulateur
    await page.getByTestId('interview-subtab-simulator').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '11_interview_simulator.png'), fullPage: false });

    // 8.5 Competences
    await page.getByTestId('interview-subtab-competencies').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '12_interview_competencies.png'), fullPage: false });

    // 8.6 Projets
    await page.getByTestId('interview-subtab-projects').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotDir, '13_interview_projects.png'), fullPage: false });
  });
});
