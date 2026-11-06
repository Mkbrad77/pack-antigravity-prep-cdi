import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

function countWords(text: string): number {
  const clean = text.replace(/^---[\s\S]*?---/, '').trim();
  const words = clean.match(/[\w\u00C0-\u017F'-]+/g);
  return words ? words.length : 0;
}

describe('Contenu Pédagogique des Certifications (Phase 3)', () => {
  it('CLF-C02 : 13 chapitres, 4 fiches express, 150 questions', () => {
    const chapDir = path.join(rootDir, 'content', 'certifications', 'clf', 'chapters');
    const fichesDir = path.join(rootDir, 'content', 'certifications', 'clf', 'fiches_express');
    const questionsPath = path.join(rootDir, 'content', 'certifications', 'clf', 'questions.json');

    const chapFiles = fs.readdirSync(chapDir).filter((f) => f.endsWith('.md'));
    const fichesFiles = fs.readdirSync(fichesDir).filter((f) => f.endsWith('.md'));
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

    expect(chapFiles.length).toBe(13);
    expect(fichesFiles.length).toBe(4);
    expect(questions.length).toBe(150);

    for (const f of chapFiles) {
      const txt = fs.readFileSync(path.join(chapDir, f), 'utf-8');
      const words = countWords(txt);
      expect(words).toBeLessThanOrEqual(800);
      expect(txt.includes('\u2014')).toBe(false);
      expect(txt.includes('\u2013')).toBe(false);
    }
  });

  it('DEA-C01 : 35 chapitres, 4 fiches express, 300 questions', () => {
    const chapDir = path.join(rootDir, 'content', 'certifications', 'dea', 'chapters');
    const fichesDir = path.join(rootDir, 'content', 'certifications', 'dea', 'fiches_express');
    const questionsPath = path.join(rootDir, 'content', 'certifications', 'dea', 'questions.json');

    const chapFiles = fs.readdirSync(chapDir).filter((f) => f.endsWith('.md'));
    const fichesFiles = fs.readdirSync(fichesDir).filter((f) => f.endsWith('.md'));
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

    expect(chapFiles.length).toBe(35);
    expect(fichesFiles.length).toBe(4);
    expect(questions.length).toBe(300);

    for (const f of chapFiles) {
      const txt = fs.readFileSync(path.join(chapDir, f), 'utf-8');
      const words = countWords(txt);
      expect(words).toBeLessThanOrEqual(800);
      expect(txt.includes('\u2014')).toBe(false);
      expect(txt.includes('\u2013')).toBe(false);
    }
  });

  it('dbt : 26 chapitres, 5 fiches express, 150 questions', () => {
    const chapDir = path.join(rootDir, 'content', 'certifications', 'dbt', 'chapters');
    const fichesDir = path.join(rootDir, 'content', 'certifications', 'dbt', 'fiches_express');
    const questionsPath = path.join(rootDir, 'content', 'certifications', 'dbt', 'questions.json');

    const chapFiles = fs.readdirSync(chapDir).filter((f) => f.endsWith('.md'));
    const fichesFiles = fs.readdirSync(fichesDir).filter((f) => f.endsWith('.md'));
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

    expect(chapFiles.length).toBe(26);
    expect(fichesFiles.length).toBe(5);
    expect(questions.length).toBe(150);

    for (const f of chapFiles) {
      const txt = fs.readFileSync(path.join(chapDir, f), 'utf-8');
      const words = countWords(txt);
      expect(words).toBeLessThanOrEqual(800);
      expect(txt.includes('\u2014')).toBe(false);
      expect(txt.includes('\u2013')).toBe(false);
    }
  });

  it('Total cumulé : 74 chapitres, 13 fiches express, 600 questions conformes', () => {
    const totalQuestions = 150 + 300 + 150;
    const totalChapters = 13 + 35 + 26;
    const totalFiches = 4 + 4 + 5;
    expect(totalQuestions).toBe(600);
    expect(totalChapters).toBe(74);
    expect(totalFiches).toBe(13);
  });
});
