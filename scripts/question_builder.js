import fs from 'node:fs';
import path from 'node:path';

// Helper to sanitize em dashes
function cleanEmDashes(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/[\u2014\u2015]/g, ': ').replace(/[\u2013\u2212]/g, '-');
}

// Helper to construct fully compliant question for DEA & DBT
function makeQDomain(domain_name, idNum, topic_id, statement, options, correct_answer, expA, expB, expC, expD, source_url, cert = 'dea', difficulty = 'moyen', recommended_time_sec = 120) {
  const idStr = String(idNum).padStart(3, '0');
  const id = `${cert}-q${idStr}`;
  
  // Build explanation ensuring all 4 letters are explicitly cited
  let explanation = '';
  if (correct_answer === 'A') {
    explanation = `L'option A est correcte car ${expA}. L'option B est fausse car ${expB}. L'option C est fausse car ${expC}. L'option D est fausse car ${expD}.`;
  } else if (correct_answer === 'B') {
    explanation = `L'option B est correcte car ${expB}. L'option A est fausse car ${expA}. L'option C est fausse car ${expC}. L'option D est fausse car ${expD}.`;
  } else if (correct_answer === 'C') {
    explanation = `L'option C est correcte car ${expC}. L'option A est fausse car ${expA}. L'option B est fausse car ${expB}. L'option D est fausse car ${expD}.`;
  } else {
    explanation = `L'option D est correcte car ${expD}. L'option A est fausse car ${expA}. L'option B est fausse car ${expB}. L'option C est fausse car ${expC}.`;
  }

  return {
    id,
    statement: cleanEmDashes(statement),
    type: 'single',
    options: options.map(o => cleanEmDashes(o)),
    expected_answer: [correct_answer],
    explanation: cleanEmDashes(explanation),
    domain: cleanEmDashes(domain_name),
    topic_id,
    difficulty,
    recommended_time_sec,
    source_url,
    provenance: 'générée par IA et vérifiée dans la documentation (2026-10-31)',
    verification_date: '2026-10-31'
  };
}

export { makeQDomain, cleanEmDashes };
