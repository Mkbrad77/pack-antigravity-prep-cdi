import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { LocalSqliteStore } from '../../src/server/db';
import { InterviewQuestionItem } from '../../src/domain/types';

describe('Phase 4 : Preparation aux Entretiens Techniques', () => {
  let tempDbPath: string;
  let store: LocalSqliteStore;

  beforeEach(() => {
    tempDbPath = path.resolve(process.cwd(), `test_interview_${Date.now()}_${Math.random().toString(36).substring(7)}.sqlite`);
    store = new LocalSqliteStore(tempDbPath);
  });

  afterEach(() => {
    store.close();
    if (fs.existsSync(tempDbPath)) {
      try {
        fs.unlinkSync(tempDbPath);
      } catch {
        // Ignorer si verrouille temporairement
      }
    }
  });

  describe('1. Banque de Questions d Entretien (Lot D)', () => {
    const questionsPath = path.resolve(process.cwd(), 'content', 'entretiens', 'interview_questions.json');

    it('doit contenir au moins 300 questions rigoureusement etiquetees sans tiret cadratin', () => {
      expect(fs.existsSync(questionsPath)).toBe(true);
      const raw = fs.readFileSync(questionsPath, 'utf-8');

      // Verification typographique absolue : zero tiret cadratin
      expect((raw.match(/\u2014/g) || []).length).toBe(0);
      expect((raw.match(/\u2013/g) || []).length).toBe(0);

      const questions: InterviewQuestionItem[] = JSON.parse(raw);
      expect(questions.length).toBeGreaterThanOrEqual(300);

      // Verification de la structure de chaque question
      for (const q of questions) {
        expect(q.id).toBeDefined();
        expect(q.category).toBeDefined();
        expect(['DE', 'AIE', 'MLE', 'DS', 'COMMON']).toContain(q.role);
        expect(['Junior', 'Intermédiaire', 'Senior']).toContain(q.level);
        expect(q.question.trim().length).toBeGreaterThan(10);
        expect(['qcm', 'open', 'coding']).toContain(q.type);
        expect(q.expectedAnswer).toBeDefined();
        expect(q.explanation.trim().length).toBeGreaterThan(15);
        expect(q.source.trim().length).toBeGreaterThan(3);
        if (q.type === 'qcm') {
          expect(q.options).toBeDefined();
          expect(q.options?.length).toBeGreaterThanOrEqual(3);
        }
      }
    });
  });

  describe('2. Cours Condenses & Fiches Memo (Lot C)', () => {
    const manifestPath = path.resolve(process.cwd(), 'content', 'entretiens', 'courses', 'manifest.json');

    it('doit contenir un manifest valide referencant les 59 cours/fiches existants sur disque', () => {
      expect(fs.existsSync(manifestPath)).toBe(true);
      const raw = fs.readFileSync(manifestPath, 'utf-8');

      // Verification typographique absolue : zero tiret cadratin
      expect((raw.match(/\u2014/g) || []).length).toBe(0);
      expect((raw.match(/\u2013/g) || []).length).toBe(0);

      const manifest = JSON.parse(raw);
      expect(manifest.total_courses_count).toBe(59);
      expect(manifest.categories.python.length).toBe(13);
      expect(manifest.categories.sql.length).toBe(14);
      expect(manifest.categories.de.length).toBe(12);
      expect(manifest.categories.aie.length).toBe(10);
      expect(manifest.categories.fiches_ml.length).toBe(5);
      expect(manifest.categories.fiches_software.length).toBe(5);

      // Verifier que chaque fichier existe reellement sur le disque
      const cats = ['python', 'sql', 'de', 'aie', 'fiches_ml', 'fiches_software'] as const;
      for (const cat of cats) {
        for (const item of manifest.categories[cat]) {
          const filePath = path.resolve(process.cwd(), 'content', 'entretiens', 'courses', cat, `${item.id}.md`);
          expect(fs.existsSync(filePath)).toBe(true);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          expect(fileContent.length).toBeGreaterThan(100);

          // Zero tiret cadratin dans chaque cours markdown
          expect((fileContent.match(/\u2014/g) || []).length).toBe(0);
          expect((fileContent.match(/\u2013/g) || []).length).toBe(0);
        }
      }
    });
  });

  describe('3. Planning Entretiens 100 % Technique (Zero STAR / Zero Pitch Projet)', () => {
    it('ne doit contenir aucune reference a la methode STAR ou aux presentations de projets dans planning_entretiens.json', () => {
      const planningPath = path.resolve(process.cwd(), 'data', 'planning_entretiens.json');
      const raw = fs.readFileSync(planningPath, 'utf-8');
      expect(raw.toLowerCase()).not.toContain('cadrage star');
      expect(raw.toLowerCase()).not.toContain('pitch star');
      expect(raw.toLowerCase()).not.toContain('projet phare');

      const parsed = JSON.parse(raw);
      const w1 = parsed.weeks.find((w: { week: number }) => w.week === 1);
      expect(w1).toBeDefined();
      expect(w1.tasks.length).toBe(3);
      expect(w1.tasks[0].id).toBe('W01-I1');
      expect(w1.tasks[0].title).toContain('Structures de données Python');
      expect(w1.tasks[0].est_min).toBe(20);
      expect(w1.tasks[1].id).toBe('W01-I2');
      expect(w1.tasks[1].est_min).toBe(20);
      expect(w1.tasks[2].id).toBe('W01-I3');
      expect(w1.tasks[2].est_min).toBe(20);
    });
  });

  describe('4. Matrice de Competences & Regle de Maitrise (Lot E)', () => {
    it('ne doit marquer une competence comme maitrisee que si succes >= 3 ET sessions distinctes >= 2', () => {
      const compId = 'sql_analytics';

      // 1 seule reussite en session 1 -> Non maitrise
      store.recordCompetencyAttempt({
        competency_id: compId,
        session_id: 'sess-1',
        success: true,
      });

      let status = store.getCompetenciesStatus();
      expect(status[compId].successCount).toBe(1);
      expect(status[compId].distinctSessions).toBe(1);
      expect(status[compId].isMastered).toBe(false);

      // 2e et 3e reussites mais dans la MEME session 1 -> Non maitrise (distinctSessions = 1)
      store.recordCompetencyAttempt({
        competency_id: compId,
        session_id: 'sess-1',
        success: true,
      });
      store.recordCompetencyAttempt({
        competency_id: compId,
        session_id: 'sess-1',
        success: true,
      });

      status = store.getCompetenciesStatus();
      expect(status[compId].successCount).toBe(3);
      expect(status[compId].distinctSessions).toBe(1);
      expect(status[compId].isMastered).toBe(false);

      // 4e reussite dans une NOUVELLE session (sess-2) -> MAITRISEE (succes >= 3 ET sessions >= 2)
      store.recordCompetencyAttempt({
        competency_id: compId,
        session_id: 'sess-2',
        success: true,
      });

      status = store.getCompetenciesStatus();
      expect(status[compId].successCount).toBe(4);
      expect(status[compId].distinctSessions).toBe(2);
      expect(status[compId].isMastered).toBe(true);
    });
  });

  describe('5. Historique des Simulations d Entretien (Lot D & E)', () => {
    it('doit enregistrer et restituer les simulations d entretien', () => {
      store.saveInterviewSimulation({
        id: 'sim-test-1',
        role: 'DE',
        seniority: 'Junior',
        total_score: 85,
        duration_seconds: 1800,
        details_json: JSON.stringify({ pitchScore: 90, techScore: 80 }),
      });

      const sims = store.getInterviewSimulations();
      expect(sims.length).toBe(1);
      expect(sims[0].id).toBe('sim-test-1');
      expect(sims[0].role).toBe('DE');
      expect(sims[0].total_score).toBe(85);
      expect(sims[0].duration_seconds).toBe(1800);
    });
  });
});
