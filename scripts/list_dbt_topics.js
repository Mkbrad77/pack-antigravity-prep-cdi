import fs from 'node:fs';
const carte = JSON.parse(fs.readFileSync('data/carte_des_sujets.json', 'utf8'));
console.log('Total dbt_topics:', carte.dbt_topics ? carte.dbt_topics.length : 0);
(carte.dbt_topics || []).forEach((t, i) => {
  console.log((i + 1) + '. id: ' + t.id + ' | domain: ' + t.domain + ' | label: ' + t.label);
});
