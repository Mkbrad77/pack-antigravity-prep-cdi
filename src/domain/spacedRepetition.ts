import { ALLOWED_PROVENANCE_TAGS, CertCode, Flashcard, ProvenanceTag } from './types';

export type ReviewGrade = 0 | 3 | 4 | 5;

export interface CardMasteryStatus {
  status: 'nouvelle' | 'en_apprentissage' | 'en_consolidation' | 'maitrisee';
  label: string;
  isMastered: boolean;
}

/**
 * Ajoute un nombre de jours a une date ISO YYYY-MM-DD (en UTC pur pour eviter les decalages horaires).
 */
export function addDaysIso(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, (m || 1) - 1, (d || 1) + days));
  return dt.toISOString().slice(0, 10);
}

/**
 * Regle non negociable : une notion n'est jamais maitrisee parce qu'un cours est termine.
 * Elle n'est maitrisee qu'apres au moins 3 reussites espacees consecutives ET un intervalle >= 14 jours.
 */
export function getCardMasteryStatus(card: Pick<Flashcard, 'repetitions' | 'interval_days'>): CardMasteryStatus {
  if (card.repetitions === 0) {
    return {
      status: 'nouvelle',
      label: 'À consolider (0 réussite)',
      isMastered: false,
    };
  }
  if (card.repetitions >= 3 && card.interval_days >= 14) {
    return {
      status: 'maitrisee',
      label: `Maîtrisée (${card.repetitions} réussites, intervalle ${card.interval_days} j)`,
      isMastered: true,
    };
  }
  if (card.repetitions >= 2) {
    return {
      status: 'en_consolidation',
      label: `En consolidation (${card.repetitions} réussites, intervalle ${card.interval_days} j)`,
      isMastered: false,
    };
  }
  return {
    status: 'en_apprentissage',
    label: `En apprentissage (${card.repetitions} réussite, intervalle ${card.interval_days} j)`,
    isMastered: false,
  };
}

/**
 * Algorithme SM-2 (SuperMemo 2) de repetition espacee.
 * Grades supportes :
 * - 0 : Oublie / A revoir (reset repetitions = 0, interval = 1 jour)
 * - 3 : Difficile (maintient la serie mais reduit le facteur de facilite)
 * - 4 : Correct (progression normale 1j -> 6j -> round(I * EF))
 * - 5 : Parfait / Facile (augmente le facteur de facilite)
 */
export function reviewFlashcardSM2(
  card: Flashcard,
  grade: ReviewGrade,
  reviewDateIso: string
): Flashcard {
  let { repetitions, interval_days, ease_factor } = card;

  if (grade < 3) {
    repetitions = 0;
    interval_days = 1;
  } else {
    if (repetitions === 0) {
      interval_days = 1;
    } else if (repetitions === 1) {
      interval_days = 6;
    } else {
      interval_days = Math.max(1, Math.round(interval_days * ease_factor));
    }
    repetitions += 1;
  }

  // Formule officielle SM-2 d'ajustement du facteur de facilite (EF >= 1.3)
  const q = grade;
  const nextEf = ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  ease_factor = Math.max(1.3, Math.round(nextEf * 100) / 100);

  const due_date = addDaysIso(reviewDateIso, interval_days);

  return {
    ...card,
    repetitions,
    interval_days,
    ease_factor,
    due_date,
    last_reviewed_at: reviewDateIso,
  };
}

/**
 * Filtre les cartes exigibles a la date courante ("A reviser aujourd'hui").
 */
export function getDueFlashcards(cards: Flashcard[], todayIso: string): Flashcard[] {
  return [...cards]
    .filter((c) => c.due_date <= todayIso)
    .sort((a, b) => {
      if (a.due_date !== b.due_date) return a.due_date.localeCompare(b.due_date);
      return a.id.localeCompare(b.id);
    });
}

/**
 * Cree une nouvelle carte en verifiant strictement l'etiquette de provenance obligatoire (Regle 2).
 */
export function createFlashcardInput(params: {
  id: string;
  topic_id: string;
  cert_code: CertCode | 'INTERVIEW';
  front: string;
  back: string;
  provenance: ProvenanceTag;
  source_url?: string;
  todayIso: string;
  is_demo?: number;
}): Flashcard {
  if (!params.front.trim() || !params.back.trim()) {
    throw new Error('La question (recto) et la réponse (verso) sont obligatoires.');
  }
  if (!ALLOWED_PROVENANCE_TAGS.includes(params.provenance)) {
    throw new Error(`Étiquette de provenance invalide : ${params.provenance}`);
  }
  return {
    id: params.id,
    topic_id: params.topic_id || 'general',
    cert_code: params.cert_code,
    front: params.front.trim(),
    back: params.back.trim(),
    provenance: params.provenance,
    source_url: (params.source_url || '').trim(),
    repetitions: 0,
    interval_days: 0,
    ease_factor: 2.5,
    due_date: params.todayIso,
    last_reviewed_at: null,
    is_demo: params.is_demo ? 1 : 0,
    created_at: new Date().toISOString(),
  };
}
