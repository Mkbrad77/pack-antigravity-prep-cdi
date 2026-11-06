import fs from 'node:fs';
import path from 'node:path';
import { dbtQuestionsS1 } from './dbt_questions_s1.js';
import { dbtQuestionsS2 } from './dbt_questions_s2.js';
import { dbtQuestionsS3 } from './dbt_questions_s3.js';
import { dbtQuestionsS4, dbtQuestionsS5 } from './dbt_questions_s4_s5.js';

const allDbtQuestions = [
  ...dbtQuestionsS1,
  ...dbtQuestionsS2,
  ...dbtQuestionsS3,
  ...dbtQuestionsS4,
  ...dbtQuestionsS5
];

console.log(`Total dbt questions assembled: ${allDbtQuestions.length}`);
console.log(`- S1: ${dbtQuestionsS1.length}`);
console.log(`- S2: ${dbtQuestionsS2.length}`);
console.log(`- S3: ${dbtQuestionsS3.length}`);
console.log(`- S4: ${dbtQuestionsS4.length}`);
console.log(`- S5: ${dbtQuestionsS5.length}`);

// Target file
const targetFile = path.join(process.cwd(), 'content', 'certifications', 'dbt', 'questions.json');

// Stringify and clean any possible em-dash
let jsonContent = JSON.stringify(allDbtQuestions, null, 2);
jsonContent = jsonContent.replace(/[\u2014\u2015]/g, ': ').replace(/[\u2013\u2212]/g, '-');

fs.writeFileSync(targetFile, jsonContent, 'utf8');
console.log(`Wrote ${allDbtQuestions.length} questions to ${targetFile}`);
