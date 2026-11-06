import fs from 'node:fs';

const c = JSON.parse(fs.readFileSync('data/carte_des_sujets.json', 'utf8'));
console.log('Total aws_topics:', c.aws_topics.length);
c.aws_topics.forEach((t, i) => {
  console.log(`${i+1}. id: ${t.id} | domain: ${t.dea_domain} | label: ${t.label.slice(0, 60)}`);
});
