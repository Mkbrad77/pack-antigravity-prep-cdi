import { CertCode, MockExam, ReadinessRuleConfig } from './types';

export interface CertReadinessEvaluation {
  certCode: CertCode;
  isReady: boolean;
  statusLabel: string;
  ruleExplanation: string;
  attemptsCount: number;
  latestScorePct: number | null;
  requiredMinPct: number;
  requiredConsecutive: number;
  consecutivePassingCount: number;
  weakDomains: string[];
}

export const DEFAULT_READINESS_RULES: ReadinessRuleConfig = {
  clf_min_pct: 80,
  clf_consecutive: 1,
  dea_min_pct: 80,
  dea_consecutive: 2,
  dbt_min_pct: 75,
  dbt_consecutive: 1,
};

/**
 * Evalue si le candidat est pret pour un examen selon ses scores d'examens blancs
 * et les regles configurables :
 * - CLF-C02 : >= 80 % au dernier blanc (par defaut)
 * - DEA-C01 : >= 80 % deux fois de suite (par defaut)
 * - DBT : >= 75 % au dernier blanc (seuil officiel : 65 %)
 */
export function evaluateCertificationReadiness(
  certCode: CertCode,
  mockExams: MockExam[],
  rules: ReadinessRuleConfig = DEFAULT_READINESS_RULES
): CertReadinessEvaluation {
  const certExams = [...mockExams]
    .filter((e) => e.cert_code === certCode)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.id - b.id;
    });

  let requiredMinPct = rules.clf_min_pct;
  let requiredConsecutive = rules.clf_consecutive;
  let officialPassInfo = 'Seuil officiel AWS : 700/1000 (~70 %)';

  if (certCode === 'DEA-C01') {
    requiredMinPct = rules.dea_min_pct;
    requiredConsecutive = rules.dea_consecutive;
    officialPassInfo = 'Seuil officiel AWS : 720/1000 (~72 %)';
  } else if (certCode === 'DBT') {
    requiredMinPct = rules.dbt_min_pct;
    requiredConsecutive = rules.dbt_consecutive;
    officialPassInfo = 'Seuil officiel dbt Labs : 65 %';
  }

  const ruleExplanation =
    requiredConsecutive > 1
      ? `Prêt si >= ${requiredMinPct} % sur les ${requiredConsecutive} derniers examens blancs consécutifs (${officialPassInfo}).`
      : `Prêt si >= ${requiredMinPct} % au dernier examen blanc (${officialPassInfo}).`;

  if (certExams.length === 0) {
    return {
      certCode,
      isReady: false,
      statusLabel: 'Aucun examen blanc saisi',
      ruleExplanation,
      attemptsCount: 0,
      latestScorePct: null,
      requiredMinPct,
      requiredConsecutive,
      consecutivePassingCount: 0,
      weakDomains: [],
    };
  }

  // Compter combien des derniers examens blancs consecutifs atteignent requiredMinPct
  let consecutivePassingCount = 0;
  for (let i = certExams.length - 1; i >= 0; i--) {
    if (certExams[i].score_pct >= requiredMinPct) {
      consecutivePassingCount += 1;
    } else {
      break;
    }
  }

  const latest = certExams[certExams.length - 1];
  const isReady = consecutivePassingCount >= requiredConsecutive;

  const weakDomains: string[] = [];
  if (latest.domain_scores) {
    for (const [domain, score] of Object.entries(latest.domain_scores)) {
      if (typeof score === 'number' && score < requiredMinPct) {
        weakDomains.push(`${domain} (${score} %)`);
      }
    }
  }

  let statusLabel = '';
  if (isReady) {
    statusLabel = `PRÊT POUR L'EXAMEN (${latest.score_pct} % au dernier blanc)`;
  } else if (certExams.length < requiredConsecutive && consecutivePassingCount > 0) {
    statusLabel = `EN BONNE VOIE (${consecutivePassingCount}/${requiredConsecutive} blanc >= ${requiredMinPct} % validé)`;
  } else {
    statusLabel = `NON PRÊT : renforcement requis (dernier score : ${latest.score_pct} %, cible : ${requiredMinPct} %)`;
  }

  return {
    certCode,
    isReady,
    statusLabel,
    ruleExplanation,
    attemptsCount: certExams.length,
    latestScorePct: latest.score_pct,
    requiredMinPct,
    requiredConsecutive,
    consecutivePassingCount,
    weakDomains,
  };
}
