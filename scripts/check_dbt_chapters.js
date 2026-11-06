import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'content', 'certifications', 'dbt', 'chapters');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
console.log('Total dbt chapter files:', files.length);
let ok = true;
for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const words = content.trim().split(/\s+/).length;
  const hasEmDash = /[\u2013\u2014]/.test(content);
  console.log(`${f}: ${words} words (emDash: ${hasEmDash})`);
  if (words < 400 || words > 800 || hasEmDash) {
    console.log(`FAIL in ${f}: ${words} words, emDash=${hasEmDash}`);
    ok = false;
  }
}
if (ok) {
  console.log('SUCCESS: All 26 dbt chapters pass word count (400-800) and zero em dashes!');
} else {
  console.log('SOME CHAPTERS FAILED');
}
