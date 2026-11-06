import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CONTENT_DIR = path.join(ROOT_DIR, 'content', 'certifications');

const PROVENANCE_ALLOWED = new Set([
  'officielle',
  'communauté (URL)',
  'générée par IA et vérifiée dans la documentation (2026-10-31)',
  'générée par IA et vérifiée dans la documentation (date)',
  'générée par IA non vérifiée',
]);

function countWords(text) {
  // Enlève le frontmatter YAML ou métadonnées éventuelles
  const clean = text.replace(/^---[\s\S]*?---/, '').trim();
  const words = clean.match(/[\w\u00C0-\u017F'-]+/g);
  return words ? words.length : 0;
}

function checkEmDashes(text, filePath) {
  const errors = [];
  if (text.includes('\u2014')) {
    errors.push(`Présence de tiret cadratin interdit (\\u2014) dans ${filePath}`);
  }
  if (text.includes('\u2013')) {
    errors.push(`Présence de tiret demi-cadratin interdit (\\u2013) dans ${filePath}`);
  }
  return errors;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u00C0-\u017F]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function jaccardSimilarity(strA, strB) {
  const setA = new Set(tokenize(strA));
  const setB = new Set(tokenize(strB));
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function validateCertificationsContent() {
  const report = {
    valid: true,
    totalQuestions: 0,
    totalChapters: 0,
    totalFichesExpress: 0,
    certSummary: {},
    errors: [],
    warnings: [],
  };

  // 1. Charger la carte des sujets
  const cartePath = path.join(DATA_DIR, 'carte_des_sujets.json');
  if (!fs.existsSync(cartePath)) {
    report.errors.push(`Fichier introuvable : ${cartePath}`);
    report.valid = false;
    return report;
  }

  const carte = JSON.parse(fs.readFileSync(cartePath, 'utf8'));
  const validTopicIds = new Set();
  (carte.aws_topics || []).forEach((t) => validTopicIds.add(t.id));
  (carte.dbt_topics || []).forEach((t) => validTopicIds.add(t.id));

  // 2. Parcourir les trois certifications (clf, dea, dbt)
  const certCodes = ['clf', 'dea', 'dbt'];

  for (const cert of certCodes) {
    const certDir = path.join(CONTENT_DIR, cert);
    report.certSummary[cert] = {
      questionsCount: 0,
      domainsDistribution: {},
      chaptersCount: 0,
      fichesExpressCount: 0,
    };

    if (!fs.existsSync(certDir)) {
      report.warnings.push(`Dossier de certification non encore créé : ${certDir}`);
      continue;
    }

    // A. Validation des chapitres Markdown
    const chaptersDir = path.join(certDir, 'chapters');
    if (fs.existsSync(chaptersDir)) {
      const chapterFiles = fs.readdirSync(chaptersDir).filter((f) => f.endsWith('.md'));
      for (const file of chapterFiles) {
        const fullPath = path.join(chaptersDir, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        report.certSummary[cert].chaptersCount++;
        report.totalChapters++;

        // Vérifier tiret cadratin
        const emDashErrors = checkEmDashes(content, fullPath);
        if (emDashErrors.length > 0) {
          report.errors.push(...emDashErrors);
        }

        // Vérifier longueur (< 800 mots)
        const wordCount = countWords(content);
        if (wordCount > 800) {
          report.errors.push(
            `Chapitre trop long (${wordCount} mots > 800 mots max) : ${file}`
          );
        } else if (wordCount < 100) {
          report.errors.push(
            `Chapitre manifestement incomplet (${wordCount} mots < 100 mots) : ${file}`
          );
        }
      }
    }

    // B. Validation des fiches express
    const fichesDir = path.join(certDir, 'fiches_express');
    if (fs.existsSync(fichesDir)) {
      const fichesFiles = fs.readdirSync(fichesDir).filter((f) => f.endsWith('.md'));
      for (const file of fichesFiles) {
        const fullPath = path.join(fichesDir, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        report.certSummary[cert].fichesExpressCount++;
        report.totalFichesExpress++;

        // Vérifier tiret cadratin
        const emDashErrors = checkEmDashes(content, fullPath);
        if (emDashErrors.length > 0) {
          report.errors.push(...emDashErrors);
        }

        // Vérifier longueur (< 800 mots)
        const wordCount = countWords(content);
        if (wordCount > 800) {
          report.errors.push(
            `Fiche express trop longue (${wordCount} mots > 800 mots max) : ${file}`
          );
        }
      }
    }

    // C. Validation de la banque de questions JSON
    const questionsFile = path.join(certDir, 'questions.json');
    if (fs.existsSync(questionsFile)) {
      const qContentRaw = fs.readFileSync(questionsFile, 'utf8');
      const emDashErrors = checkEmDashes(qContentRaw, questionsFile);
      if (emDashErrors.length > 0) {
        report.errors.push(...emDashErrors);
      }

      let questions = [];
      try {
        questions = JSON.parse(qContentRaw);
      } catch (err) {
        report.errors.push(`JSON invalide dans ${questionsFile} : ${err.message}`);
        continue;
      }

      report.certSummary[cert].questionsCount = questions.length;
      report.totalQuestions += questions.length;

      const seenIds = new Set();
      const questionStatements = [];

      for (let idx = 0; idx < questions.length; idx++) {
        const q = questions[idx];
        const qRef = `${cert} Q#${idx + 1} (${q.id || 'sans id'})`;

        // 1. Champs obligatoires
        const requiredFields = [
          'id',
          'statement',
          'type',
          'options',
          'expected_answer',
          'explanation',
          'domain',
          'topic_id',
          'difficulty',
          'recommended_time_sec',
          'source_url',
          'provenance',
          'verification_date',
        ];

        for (const f of requiredFields) {
          if (q[f] === undefined || q[f] === null || q[f] === '') {
            report.errors.push(`Champ obligatoire manquant ou vide "${f}" pour ${qRef}`);
          }
        }

        // Unicité de l'ID
        if (q.id) {
          if (seenIds.has(q.id)) {
            report.errors.push(`ID en double "${q.id}" détecté pour ${qRef}`);
          }
          seenIds.add(q.id);
        }

        // Distribution de domaine
        if (q.domain) {
          report.certSummary[cert].domainsDistribution[q.domain] =
            (report.certSummary[cert].domainsDistribution[q.domain] || 0) + 1;
        }

        // 2. Options et réponses attendues
        if (!Array.isArray(q.options) || q.options.length < 4) {
          report.errors.push(`Moins de 4 options fournies pour ${qRef}`);
        }

        const validOptionKeys = (q.options || []).map((opt) => {
          if (typeof opt === 'string') {
            const match = opt.match(/^([A-Z])\)/);
            return match ? match[1] : opt;
          }
          return opt.id;
        });

        if (!Array.isArray(q.expected_answer) || q.expected_answer.length === 0) {
          report.errors.push(`expected_answer doit être un tableau non vide pour ${qRef}`);
        } else {
          for (const ans of q.expected_answer) {
            if (!validOptionKeys.includes(ans)) {
              report.errors.push(
                `Réponse attendue "${ans}" absente des options (${validOptionKeys.join(
                  ', '
                )}) pour ${qRef}`
              );
            }
          }
          if (q.type === 'single' && q.expected_answer.length !== 1) {
            report.errors.push(
              `Question type single avec plusieurs réponses attendues (${q.expected_answer.length}) pour ${qRef}`
            );
          }
          if (q.type === 'multiple' && q.expected_answer.length < 2) {
            report.errors.push(
              `Question type multiple avec moins de 2 réponses attendues pour ${qRef}`
            );
          }
        }

        // 3. Explication couvrant toutes les options
        if (q.explanation && typeof q.explanation === 'string') {
          // L'explication doit expliciter les options incorrectes
          const wrongKeys = validOptionKeys.filter(
            (k) => !q.expected_answer || !q.expected_answer.includes(k)
          );
          for (const wk of wrongKeys) {
            // Doit mentionner l'option (ex: "B", "Option B", "L'option B", "Le choix B")
            const re = new RegExp(`\\b(option\\s+)?${wk}\\b`, 'i');
            if (!re.test(q.explanation)) {
              report.errors.push(
                `L'explication ne couvre pas explicitement l'option incorrecte ${wk} pour ${qRef}`
              );
            }
          }
        }

        // 4. Source URL et Date
        if (q.source_url && !/^https?:\/\//i.test(q.source_url)) {
          report.errors.push(`URL source invalide "${q.source_url}" pour ${qRef}`);
        }
        if (q.verification_date && !/^\d{4}-\d{2}-\d{2}$/.test(q.verification_date)) {
          report.errors.push(
            `Date de vérification invalide "${q.verification_date}" (attendu YYYY-MM-DD) pour ${qRef}`
          );
        }

        // 5. Provenance
        if (q.provenance && !PROVENANCE_ALLOWED.has(q.provenance)) {
          report.errors.push(
            `Étiquette de provenance non autorisée "${q.provenance}" pour ${qRef}`
          );
        }

        // 6. Topic ID valide dans carte_des_sujets.json
        if (q.topic_id && !validTopicIds.has(q.topic_id)) {
          report.errors.push(
            `topic_id "${q.topic_id}" inexistant dans carte_des_sujets.json pour ${qRef}`
          );
        }

        // 7. Détection de similarité quasi identique
        if (q.statement) {
          for (const prev of questionStatements) {
            const sim = jaccardSimilarity(q.statement, prev.statement);
            if (sim > 0.82) {
              report.errors.push(
                `Questions quasi identiques détectées (similarité ${(sim * 100).toFixed(
                  1
                )}%) entre ${q.id} et ${prev.id}`
              );
            }
          }
          questionStatements.push({ id: q.id, statement: q.statement });
        }
      }
    }
  }

  report.valid = report.errors.length === 0;
  return report;
}

if (process.argv[1] && process.argv[1].endsWith('validate_certification_content.js')) {
  console.log('--- Exécution du script de validation du contenu des certifications ---');
  const res = validateCertificationsContent();
  console.log(`Statut global : ${res.valid ? 'VALIDE (VERT)' : 'ERREURS DETECTEES (ROUGE)'}`);
  console.log(`Total questions validées : ${res.totalQuestions}`);
  console.log(`Total chapitres : ${res.totalChapters}`);
  console.log(`Total fiches express : ${res.totalFichesExpress}`);
  console.log('Résumé par certification :');
  for (const [c, info] of Object.entries(res.certSummary)) {
    console.log(`  - ${c.toUpperCase()} : ${info.questionsCount} questions, ${info.chaptersCount} chapitres, ${info.fichesExpressCount} fiches express`);
    if (Object.keys(info.domainsDistribution).length > 0) {
      console.log(`    Répartition domaines :`, info.domainsDistribution);
    }
  }

  if (res.warnings.length > 0) {
    console.log('\nAvertissements :');
    res.warnings.forEach((w) => console.log('  [WARN]', w));
  }

  if (res.errors.length > 0) {
    console.log(`\nErreurs (${res.errors.length}) :`);
    res.errors.forEach((e) => console.log('  [ERR]', e));
    process.exit(1);
  } else {
    console.log('\nTous les critères de validation sont respectés !');
    process.exit(0);
  }
}
