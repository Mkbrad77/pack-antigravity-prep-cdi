import { test, expect } from '@playwright/test';

test.describe('Parcours utilisateur complet Phase 2 (E2E Navigateur + SQLite)', () => {
  test('Ouvrir, vérifier S1 (2 nov 2026) et départ à 0 % sur toutes les certifications, cocher tâche Udemy, reporter tâche, saisir examen blanc, sauvegarder, tout supprimer, restaurer et vérifier', async ({
    page,
    request,
  }) => {
    // Nettoyage initial pour partir d'un etat vierge reproductible (0 % partout)
    await request.post('/api/reset');

    // 1. Ouvrir l'application et verifier la Semaine 1 (2 novembre 2026) + progression initiale a 0 %
    await page.goto('/');
    await expect(page.getByTestId('dashboard-week-heading')).toContainText('Semaine 1');
    await expect(page.getByTestId('dashboard-week-heading')).toContainText('2026-11-02');

    const clfPctText = await page.getByTestId('cert-progress-pct-CLF-C02').textContent();
    const deaPctText = await page.getByTestId('cert-progress-pct-DEA-C01').textContent();
    const dbtPctText = await page.getByTestId('cert-progress-pct-DBT').textContent();
    expect(parseFloat(clfPctText || '0')).toBe(0);
    expect(parseFloat(deaPctText || '0')).toBe(0);
    expect(parseFloat(dbtPctText || '0')).toBe(0);

    // 2. Cocher (terminer) la tache W01-C3 (Merico lecons 1 a 60 : 190 min) et verifier que la progression CLF-C02 monte
    await expect(page.getByTestId('complete-task-W01-C3')).toBeVisible();
    await page.getByTestId('complete-task-W01-C3').click();
    await expect(page.getByTestId('reopen-task-W01-C3')).toBeVisible();
    await expect(page.getByTestId('week-completed-minutes')).toContainText('190 min');

    const updatedClfPctText = await page.getByTestId('cert-progress-pct-CLF-C02').textContent();
    expect(parseFloat(updatedClfPctText || '0')).toBeGreaterThan(15);

    // 3. Reporter une tache (W01-I1 : SQL joins & NULL traps) a la semaine suivante et verifier l'explication
    await expect(page.getByTestId('postpone-task-W01-I1')).toBeVisible();
    await page.getByTestId('postpone-task-W01-I1').click();
    await expect(page.getByTestId('dashboard-reschedule-banner')).toBeVisible();
    await expect(page.getByTestId('dashboard-reschedule-banner')).toContainText(
      'reportée de la Semaine 1 vers la Semaine 2'
    );
    await expect(page.getByTestId('dashboard-task-W01-I1')).toHaveCount(0);

    // 4. Saisir un score d'examen blanc (CLF-C02 : 85 %) et verifier que l'indicateur passe a PRET
    await page.getByTestId('nav-tab-cours').click();
    await expect(page.getByTestId('certifications-view')).toBeVisible();
    await expect(page.getByTestId('no-mock-exams-msg')).toBeVisible();

    await page.getByTestId('mock-exam-cert-select').selectOption('CLF-C02');
    await page.getByTestId('mock-exam-source-input').fill('AWS Skill Builder Official Practice Question Set');
    await page.getByTestId('mock-exam-score-input').fill('85');
    await page.getByTestId('mock-exam-notes-input').fill('Score supérieur au seuil de 80 %');
    await page.getByTestId('btn-submit-mock-exam').click();

    await expect(page.getByTestId('mock-exams-table')).toContainText('85 %');
    await expect(page.getByTestId('readiness-badge-CLF-C02')).toContainText('PRÊT POUR L\'EXAMEN');

    // 5. Tester la recherche de sujets dans l'onglet Cours & Sujets et la validation par plage
    await page.getByTestId('nav-tab-cours').click();
    await page.getByTestId('cours-section-UDEMY').click();
    await page.getByText('Carte des sujets').click();
    await expect(page.getByTestId('courses-view')).toBeVisible();
    await page.getByTestId('topic-search-input').fill('Kinesis');
    await expect(page.getByTestId('topic-row-kinesis')).toBeVisible();

    // 6. Tester la creation d'une carte SM-2 avec etiquette de provenance obligatoire
    await page.getByTestId('profile-menu-btn').click();
    await page.getByTestId('nav-tab-revision').click();
    await page.getByTestId('flashcard-front-input').fill('Quel est le rôle d\'AWS Glue Data Catalog ?');
    await page.getByTestId('flashcard-back-input').fill('Catalogue de métadonnées centralisé compatible Hive Metastore.');
    await page.getByTestId('btn-create-flashcard').click();
    await expect(page.getByTestId('spaced-repetition-view')).toContainText('Quel est le rôle d\'AWS Glue Data Catalog ?');

    // 7. Aller dans Reglages & Sauvegarde : Exporter la sauvegarde JSON datee
    await page.getByTestId('profile-menu-btn').click();
    await page.getByTestId('nav-tab-reglages').click();
    await expect(page.getByTestId('settings-view')).toBeVisible();
    await page.getByTestId('btn-export-backup').click();
    await expect(page.getByTestId('backup-success-msg')).toContainText(
      'Sauvegarde JSON datée exportée'
    );

    const exportedJson = await page.getByTestId('backup-json-textarea').inputValue();
    expect(exportedJson).toContain('"app": "pack-antigravity-prep-cdi"');
    expect(exportedJson).toContain('W01-C3');
    expect(exportedJson).toContain('AWS Skill Builder Official Practice Question Set');

    // 8. Tout supprimer (reinitialisation complete) et verifier que la tache, l'examen blanc et la carte ont disparu
    await page.getByTestId('btn-request-reset').click();
    await page.getByTestId('btn-confirm-reset').click();
    await expect(page.getByTestId('backup-success-msg')).toContainText('Toutes les données utilisateur ont été supprimées');

    await page.getByTestId('nav-tab-cours').click();
    await expect(page.getByTestId('no-mock-exams-msg')).toBeVisible();

    await page.getByTestId('nav-tab-today').click();
    await expect(page.getByTestId('complete-task-W01-C3')).toBeVisible();
    await expect(page.getByTestId('dashboard-task-W01-I1')).toBeVisible();
    const resetClfPctText = await page.getByTestId('cert-progress-pct-CLF-C02').textContent();
    expect(parseFloat(resetClfPctText || '0')).toBe(0);

    // 9. Restaurer la sauvegarde JSON et verifier que tout est revenu intact
    await page.getByTestId('profile-menu-btn').click();
    await page.getByTestId('nav-tab-reglages').click();
    await page.getByTestId('backup-json-textarea').fill(exportedJson);
    await page.getByTestId('btn-restore-from-textarea').click();
    await expect(page.getByTestId('backup-success-msg')).toContainText('Sauvegarde restaurée avec succès');

    // Verification finale sur le tableau de bord et les certifications
    await page.getByTestId('nav-tab-today').click();
    await expect(page.getByTestId('reopen-task-W01-C3')).toBeVisible();
    await expect(page.getByTestId('dashboard-task-W01-I1')).toHaveCount(0);

    await page.getByTestId('nav-tab-cours').click();
    await expect(page.getByTestId('mock-exams-table')).toContainText('85 %');
    await expect(page.getByTestId('readiness-badge-CLF-C02')).toContainText('PRÊT POUR L\'EXAMEN');

    // 10. Nettoyage final pour laisser l'environnement de test vierge a 0 %
    await request.post('/api/reset');
  });
});
