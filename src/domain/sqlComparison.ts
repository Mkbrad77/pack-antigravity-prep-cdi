/**
 * Comparateur intelligent de resultats SQL pour la validation d'exercices techniques.
 * Gere la tolerance sur l'ordre des lignes quand il n'est pas impose (multiset),
 * la tolerance sur les nombres flottants, et genere un diff explicatif en francais.
 */

export interface SqlComparisonResult {
  passed: boolean;
  diffSummary: string;
}

export function normalizeValue(val: unknown): unknown {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') {
    return Math.round(val * 1000) / 1000;
  }
  if (typeof val === 'string') {
    return val.trim();
  }
  return String(val);
}

function areValuesEqual(v1: unknown, v2: unknown): boolean {
  if (v1 === null && v2 === null) return true;
  if (v1 === null || v2 === null) return false;
  if (typeof v1 === 'number' && typeof v2 === 'number') {
    return Math.abs(v1 - v2) < 0.001;
  }
  return String(v1).trim().toLowerCase() === String(v2).trim().toLowerCase();
}

function rowToFingerprint(row: Record<string, unknown>, keys: string[]): string {
  return keys
    .map((k) => {
      const v = row[k];
      if (typeof v === 'number') return (Math.round(v * 100) / 100).toFixed(2);
      if (v === null || v === undefined) return '__NULL__';
      return String(v).trim().toLowerCase();
    })
    .join(' | ');
}

export function compareSqlResults(
  userCols: string[],
  userRows: Array<Record<string, unknown>>,
  expectedCols: string[],
  expectedRows: Array<Record<string, unknown>>,
  orderDependent: boolean
): SqlComparisonResult {
  // 1. Verification du nombre de colonnes
  if (userCols.length !== expectedCols.length) {
    return {
      passed: false,
      diffSummary: `Nombre de colonnes different : ${userCols.length} colonne(s) retournee(s) ([${userCols.join(', ')}]) au lieu de ${expectedCols.length} attendue(s) ([${expectedCols.join(', ')}]).`,
    };
  }

  // 2. Verification des noms de colonnes normalises
  const normalizedUserCols = userCols.map((c) => c.toLowerCase().trim());
  const normalizedExpectedCols = expectedCols.map((c) => c.toLowerCase().trim());

  // 3. Verification du nombre de lignes
  if (userRows.length !== expectedRows.length) {
    return {
      passed: false,
      diffSummary: `Nombre de lignes different : ${userRows.length} ligne(s) retournee(s) au lieu de ${expectedRows.length} attendue(s). Verifie tes clauses WHERE, GROUP BY ou conditions de jointure.`,
    };
  }

  if (userRows.length === 0 && expectedRows.length === 0) {
    return { passed: true, diffSummary: 'Resultat valide (ensemble vide attendu et obtenu).' };
  }

  // 4. Comparaison stricte avec ordre
  if (orderDependent) {
    for (let i = 0; i < userRows.length; i++) {
      const uRow = userRows[i];
      const eRow = expectedRows[i];
      for (let c = 0; c < normalizedExpectedCols.length; c++) {
        const uColKey = userCols[c];
        const eColKey = expectedCols[c];
        const uVal = uRow[uColKey];
        const eVal = eRow[eColKey];
        if (!areValuesEqual(uVal, eVal)) {
          return {
            passed: false,
            diffSummary: `Ecart a la ligne ${i + 1} pour la colonne '${eColKey}' : valeur obtenue = ${JSON.stringify(uVal)}, valeur attendue = ${JSON.stringify(eVal)}. L'ordre des lignes est strictement impose par la consigne (ORDER BY).`,
          };
        }
      }
    }
    return { passed: true, diffSummary: 'Requete executee avec succes : colonnes, lignes et ordre conformes.' };
  }

  // 5. Comparaison multiset sans contrainte d'ordre
  const expectedFingerprints: Record<string, number> = {};
  for (const r of expectedRows) {
    const fp = rowToFingerprint(r, expectedCols);
    expectedFingerprints[fp] = (expectedFingerprints[fp] || 0) + 1;
  }

  const userFingerprints: Record<string, number> = {};
  for (const r of userRows) {
    const fp = rowToFingerprint(r, userCols);
    userFingerprints[fp] = (userFingerprints[fp] || 0) + 1;
  }

  for (const [fp, expCount] of Object.entries(expectedFingerprints)) {
    const userCount = userFingerprints[fp] || 0;
    if (userCount !== expCount) {
      return {
        passed: false,
        diffSummary: `Lignes non concordantes : la combinaison de valeurs (${fp}) apparait ${userCount} fois dans ton resultat contre ${expCount} fois attendu.`,
      };
    }
  }

  return {
    passed: true,
    diffSummary: 'Requete executee avec succes : donnees rigoureusement conformes a la solution de reference (ordre libre).',
  };
}
