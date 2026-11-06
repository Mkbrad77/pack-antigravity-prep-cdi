import { describe, expect, it } from 'vitest';
import {
  createFlashcardInput,
  getCardMasteryStatus,
  getDueFlashcards,
  reviewFlashcardSM2,
} from '../../src/domain/spacedRepetition';

describe('Moteur de répétition espacée SM-2 et règles d’intégrité', () => {
  it('exige une étiquette de provenance valide et crée une carte initialement non maîtrisée', () => {
    const card = createFlashcardInput({
      id: 'card-iceberg-1',
      topic_id: 'lakehouse_iceberg',
      cert_code: 'DEA-C01',
      front: 'Quelle est la différence entre un Manifest File et un Manifest List dans Apache Iceberg ?',
      back: 'Le Manifest File liste des fichiers de données Parquet/ORC avec leurs statistiques de colonnes ; la Manifest List regroupe les Manifest Files d’un snapshot.',
      provenance: 'générée par IA et vérifiée dans la documentation (date)',
      source_url: 'https://iceberg.apache.org/spec/ (consulté le 31/10/2026)',
      todayIso: '2026-11-02',
    });

    expect(card.repetitions).toBe(0);
    expect(card.interval_days).toBe(0);
    expect(card.due_date).toBe('2026-11-02');
    expect(getCardMasteryStatus(card).isMastered).toBe(false);
  });

  it('ne marque jamais une carte comme maîtrisée avant au moins 3 réussites espacées et un intervalle >= 14 jours', () => {
    let card = createFlashcardInput({
      id: 'card-sql-dedup',
      topic_id: 'athena',
      cert_code: 'INTERVIEW',
      front: 'Comment dédupliquer une table d’événements en conservant uniquement la ligne la plus récente par user_id ?',
      back: 'Utiliser ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_ts DESC) rn dans une CTE (ou QUALIFY rn = 1).',
      provenance: 'officielle',
      todayIso: '2026-11-02',
    });

    // 1re reussite (grade 4) -> intervalle = 1 jour, non maitrisee
    card = reviewFlashcardSM2(card, 4, '2026-11-02');
    expect(card.repetitions).toBe(1);
    expect(card.interval_days).toBe(1);
    expect(card.due_date).toBe('2026-11-03');
    expect(getCardMasteryStatus(card).isMastered).toBe(false);

    // 2e reussite (grade 4) -> intervalle = 6 jours, non maitrisee
    card = reviewFlashcardSM2(card, 4, '2026-11-03');
    expect(card.repetitions).toBe(2);
    expect(card.interval_days).toBe(6);
    expect(card.due_date).toBe('2026-11-09');
    expect(getCardMasteryStatus(card).isMastered).toBe(false);

    // 3e reussite (grade 4) -> intervalle = round(6 * 2.5) = 15 jours >= 14 -> MAITRISEE
    card = reviewFlashcardSM2(card, 4, '2026-11-09');
    expect(card.repetitions).toBe(3);
    expect(card.interval_days).toBe(15);
    expect(card.due_date).toBe('2026-11-24');
    expect(getCardMasteryStatus(card).isMastered).toBe(true);

    // En cas d'oubli ulterieur (grade 0), la maitrise est revoquee immediatement
    card = reviewFlashcardSM2(card, 0, '2026-11-24');
    expect(card.repetitions).toBe(0);
    expect(card.interval_days).toBe(1);
    expect(getCardMasteryStatus(card).isMastered).toBe(false);
  });

  it('filtre correctement les cartes « À réviser aujourd’hui »', () => {
    const c1 = createFlashcardInput({
      id: 'c1',
      topic_id: 's3',
      cert_code: 'CLF-C02',
      front: 'Q1',
      back: 'R1',
      provenance: 'officielle',
      todayIso: '2026-11-02',
    });
    const c2 = reviewFlashcardSM2(c1, 4, '2026-11-02'); // due 2026-11-03

    const dueNov2 = getDueFlashcards([c1, { ...c2, id: 'c2' }], '2026-11-02');
    expect(dueNov2.map((c) => c.id)).toEqual(['c1']);

    const dueNov3 = getDueFlashcards([c1, { ...c2, id: 'c2' }], '2026-11-03');
    expect(dueNov3.map((c) => c.id)).toEqual(['c1', 'c2']);
  });
});
