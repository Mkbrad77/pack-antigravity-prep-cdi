import fs from 'node:fs';
import path from 'node:path';
import { deaChaptersD1 } from './dea_chapters_d1.js';
import { deaChaptersD2 } from './dea_chapters_d2.js';
import { deaChaptersD3 } from './dea_chapters_d3.js';
import { deaChaptersD4 } from './dea_chapters_d4.js';
import { deaFichesExpress } from './dea_fiches_express.js';

const ROOT_DIR = process.cwd();
const DEA_DIR = path.join(ROOT_DIR, 'content', 'certifications', 'dea');
const CHAPTERS_DIR = path.join(DEA_DIR, 'chapters');
const FICHES_DIR = path.join(DEA_DIR, 'fiches_express');

fs.mkdirSync(CHAPTERS_DIR, { recursive: true });
fs.mkdirSync(FICHES_DIR, { recursive: true });

function cleanEmDashes(text) {
  return text.replace(/\u2014/g, ': ').replace(/\u2013/g, '-');
}

function countWords(text) {
  const clean = text.replace(/^---[\s\S]*?---/, '').trim();
  const words = clean.match(/[\w\u00C0-\u017F'-]+/g);
  return words ? words.length : 0;
}

const allChapters = [
  ...deaChaptersD1,
  ...deaChaptersD2,
  ...deaChaptersD3,
  ...deaChaptersD4
];

console.log(`Writing ${allChapters.length} DEA chapters...`);
let chapterErrors = 0;
for (const ch of allChapters) {
  const filePath = path.join(CHAPTERS_DIR, ch.file);
  const cleaned = cleanEmDashes(ch.content.trim()) + '\n';
  fs.writeFileSync(filePath, cleaned, 'utf8');
  const words = countWords(cleaned);
  if (words > 800) {
    console.error(`[ERR] Chapitre trop long (${words} mots > 800): ${ch.file}`);
    chapterErrors++;
  } else if (words < 100) {
    console.error(`[ERR] Chapitre trop court (${words} mots < 100): ${ch.file}`);
    chapterErrors++;
  } else {
    console.log(`[OK] ${ch.file} : ${words} mots`);
  }
}

console.log(`\nWriting ${deaFichesExpress.length} DEA fiches express...`);
let fichesErrors = 0;
for (const fiche of deaFichesExpress) {
  const filePath = path.join(FICHES_DIR, fiche.file);
  const cleaned = cleanEmDashes(fiche.content.trim()) + '\n';
  fs.writeFileSync(filePath, cleaned, 'utf8');
  const words = countWords(cleaned);
  if (words > 800) {
    console.error(`[ERR] Fiche express trop longue (${words} mots > 800): ${fiche.file}`);
    fichesErrors++;
  } else {
    console.log(`[OK] ${fiche.file} : ${words} mots`);
  }
}

if (chapterErrors > 0 || fichesErrors > 0) {
  console.error(`Terminé avec des erreurs : ${chapterErrors} chapitres, ${fichesErrors} fiches express`);
  process.exit(1);
} else {
  console.log(`\n[SUCCÈS] Tous les 35 chapitres et 4 fiches express DEA sont générés et conformes !`);
}
