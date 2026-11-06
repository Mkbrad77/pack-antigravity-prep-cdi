import fs from 'node:fs';
import path from 'node:path';
import { deaQuestionsD1 } from './dea_questions_d1.js';
import { deaQuestionsD2 } from './dea_questions_d2.js';
import { deaQuestionsD3 } from './dea_questions_d3.js';
import { deaQuestionsD4 } from './dea_questions_d4.js';

const allDeaQuestions = [
  ...deaQuestionsD1,
  ...deaQuestionsD2,
  ...deaQuestionsD3,
  ...deaQuestionsD4
];

console.log(`Total DEA questions assembled: ${allDeaQuestions.length}`);
console.log(`- D1: ${deaQuestionsD1.length}`);
console.log(`- D2: ${deaQuestionsD2.length}`);
console.log(`- D3: ${deaQuestionsD3.length}`);
console.log(`- D4: ${deaQuestionsD4.length}`);

// Target file
const targetFile = path.join(process.cwd(), 'content', 'certifications', 'dea', 'questions.json');

// Stringify and clean any possible em-dash
let jsonContent = JSON.stringify(allDeaQuestions, null, 2);
jsonContent = jsonContent.replace(/[\u2014\u2015]/g, ': ').replace(/[\u2013\u2212]/g, '-');

fs.writeFileSync(targetFile, jsonContent, 'utf8');
console.log(`Wrote ${allDeaQuestions.length} questions to ${targetFile}`);
