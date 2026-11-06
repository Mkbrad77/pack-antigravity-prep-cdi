import React, { useState } from 'react';
import { apiClient, AppStateResponse } from '../apiClient';
import { ALLOWED_PROVENANCE_TAGS, CertCode, ProvenanceTag } from '../domain/types';
import { getCardMasteryStatus, ReviewGrade } from '../domain/spacedRepetition';

interface SpacedRepetitionViewProps {
  state: AppStateResponse;
  onRefreshState: (nextState: AppStateResponse) => void;
}

export const SpacedRepetitionView: React.FC<SpacedRepetitionViewProps> = ({
  state,
  onRefreshState,
}) => {
  const [certCode, setCertCode] = useState<CertCode | 'INTERVIEW'>('DEA-C01');
  const [topicId, setTopicId] = useState<string>('s3');
  const [front, setFront] = useState<string>('');
  const [back, setBack] = useState<string>('');
  const [provenance, setProvenance] = useState<ProvenanceTag>(
    'générée par IA et vérifiée dans la documentation (date)'
  );
  const [sourceUrl, setSourceUrl] = useState<string>(
    'https://docs.aws.amazon.com/AmazonS3/latest/userguide/ (consulté le 31/10/2026)'
  );
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    const nextState = await apiClient.createFlashcard({
      topic_id: topicId,
      cert_code: certCode,
      front,
      back,
      provenance,
      source_url: sourceUrl,
    });
    setFront('');
    setBack('');
    onRefreshState(nextState);
  };

  const handleGradeCard = async (cardId: string, grade: ReviewGrade) => {
    const nextState = await apiClient.reviewFlashcard(cardId, grade);
    onRefreshState(nextState);
  };

  const masteredCount = state.flashcards.filter((c) => getCardMasteryStatus(c).isMastered).length;

  const dueCards = state.dueFlashcards;
  const currentCard = dueCards[0];
  const isRevealed = currentCard ? Boolean(revealedIds[currentCard.id]) : false;
  const GRADES: Array<{ grade: ReviewGrade; label: string; cls: string }> = [
    { grade: 0, label: 'À revoir', cls: 'btn-danger' },
    { grade: 3, label: 'Difficile', cls: 'btn-warning' },
    { grade: 4, label: 'Correct', cls: 'btn-success' },
    { grade: 5, label: 'Facile', cls: 'btn-success' },
  ];

  return (
    <div data-testid="spaced-repetition-view" className="stack">
      {/* Révision du jour : une carte à la fois */}
      <section className="card" aria-labelledby="srs-today" style={{ maxWidth: '760px', width: '100%' }}>
        <div className="row-between" style={{ marginBottom: '0.85rem' }}>
          <div>
            <h2 id="srs-today" style={{ margin: 0, fontSize: '1.15rem' }}>
              Révision du jour
            </h2>
            <p className="muted small" style={{ margin: '0.2rem 0 0' }}>
              {masteredCount}/{state.flashcards.length} cartes maîtrisées (3 réussites d'affilée et un intervalle de 14 jours ou plus).
            </p>
          </div>
          <span className="badge badge-info mono">
            {dueCards.length} à revoir
          </span>
        </div>

        {!currentCard ? (
          <div className="empty-state" data-testid="no-due-cards-msg">
            Aucune carte à revoir aujourd'hui. Crée une carte ci-dessous ou ajoute des questions depuis la banque et le simulateur.
          </div>
        ) : (
          <div key={currentCard.id} data-testid={`due-card-${currentCard.id}`} className="stack-sm">
            <div className="cluster" style={{ gap: '0.35rem' }}>
              <span className="badge badge-info">{currentCard.cert_code === 'DBT' ? 'dbt' : currentCard.cert_code}</span>
              <span className="mono badge badge-neutral">{currentCard.topic_id}</span>
              {currentCard.is_demo === 1 && <span className="badge badge-warning">Démo</span>}
              <span className="muted small mono" style={{ marginLeft: 'auto' }}>
                Carte 1 sur {dueCards.length}
              </span>
            </div>
            <div className="card card-sm" style={{ padding: '1.25rem', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5 }}>
              {currentCard.front}
            </div>

            {!isRevealed ? (
              <button
                type="button"
                data-testid={`reveal-card-${currentCard.id}`}
                className="btn btn-primary btn-lg btn-block"
                onClick={() => setRevealedIds((prev) => ({ ...prev, [currentCard.id]: true }))}
              >
                Afficher la réponse
              </button>
            ) : (
              <>
                <div className="callout" style={{ whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
                  {currentCard.back}
                  {currentCard.source_url && (
                    <div className="muted small" style={{ marginTop: '0.4rem', overflowWrap: 'anywhere' }}>
                      Source : {currentCard.source_url}
                    </div>
                  )}
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: '0.4rem' }}>
                    Comment ça s'est passé ?
                  </div>
                  <div className="grid-4" style={{ gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))' }}>
                    {GRADES.map(({ grade, label, cls }) => (
                      <button
                        key={grade}
                        type="button"
                        data-testid={`grade-card-${currentCard.id}-${grade}`}
                        className={`btn ${cls}`}
                        onClick={() => handleGradeCard(currentCard.id, grade)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="muted small mono">
                  Répétitions {currentCard.repetitions}, intervalle {currentCard.interval_days} j, facilité {currentCard.ease_factor}. Provenance : {currentCard.provenance}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Creation manuelle d'une carte et banque de cartes */}
      <div className="grid-2" style={{ gap: '1rem' }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            Créer une carte de révision (avec étiquette de provenance obligatoire)
          </h3>
          <form onSubmit={handleCreateCard} data-testid="create-flashcard-form">
            <div className="grid-2" style={{ gap: '0.6rem', marginBottom: '0.6rem' }}>
              <label>
                Cible :
                <select
                  value={certCode}
                  onChange={(e) => setCertCode(e.target.value as CertCode | 'INTERVIEW')}
                  style={{ width: '100%', marginTop: '0.2rem' }}
                >
                  <option value="CLF-C02">CLF-C02</option>
                  <option value="DEA-C01">DEA-C01</option>
                  <option value="DBT">DBT</option>
                  <option value="INTERVIEW">Entretiens techniques</option>
                </select>
              </label>

              <label>
                Sujet technique (`topic_id`) :
                <input
                  type="text"
                  data-testid="flashcard-topic-input"
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  required
                  style={{ width: '100%', marginTop: '0.2rem' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '0.6rem' }}>
              <label>
                Question (Recto) :
                <input
                  type="text"
                  data-testid="flashcard-front-input"
                  placeholder="Ex. Quelle est la taille cible recommandée des fichiers Parquet dans S3 pour Athena ?"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  required
                  style={{ width: '100%', marginTop: '0.2rem' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '0.6rem' }}>
              <label>
                Réponse synthétique (Verso) :
                <textarea
                  data-testid="flashcard-back-input"
                  rows={3}
                  placeholder="Ex. Entre 128 Mo et 512 Mo avec compression Snappy ou ZSTD pour maximiser le parallélisme de lecture..."
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  required
                  style={{ width: '100%', marginTop: '0.2rem' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '0.6rem' }}>
              <label>
                Étiquette de provenance obligatoire (Règle 2) :
                <select
                  data-testid="flashcard-provenance-select"
                  value={provenance}
                  onChange={(e) => setProvenance(e.target.value as ProvenanceTag)}
                  style={{ width: '100%', marginTop: '0.2rem' }}
                >
                  {ALLOWED_PROVENANCE_TAGS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label>
                URL de la documentation officielle et date de consultation :
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  style={{ width: '100%', marginTop: '0.2rem' }}
                />
              </label>
            </div>

            <button
              type="submit"
              data-testid="btn-create-flashcard"
              className="btn btn-primary"
            >
              Ajouter la carte SM-2
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            Toutes mes cartes SM-2 ({state.flashcards.length})
          </h3>
          {state.flashcards.length === 0 ? (
            <p className="muted">Aucune carte enregistrée dans votre base locale.</p>
          ) : (
            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Sujet</th>
                    <th>Question</th>
                    <th>Provenance</th>
                    <th>Échéance / État</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.flashcards.map((c) => {
                    const mastered = getCardMasteryStatus(c).isMastered;
                    return (
                      <tr key={c.id}>
                        <td>
                          <span className="badge badge-info">{c.cert_code}</span>{' '}
                          <span className="mono">{c.topic_id}</span>
                          {c.is_demo === 1 && (
                            <span className="badge badge-warning" style={{ marginLeft: '0.25rem' }}>
                              DÉMO
                            </span>
                          )}
                        </td>
                        <td>{c.front}</td>
                        <td style={{ fontSize: '0.75rem' }}>{c.provenance}</td>
                        <td className="mono" style={{ fontSize: '0.75rem' }}>
                          <div>Échéance : {c.due_date}</div>
                          <div>
                            {mastered ? (
                              <span className="badge badge-success">MAÎTRISÉE</span>
                            ) : (
                              <span>
                                Rép: {c.repetitions} | Int: {c.interval_days}j
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={async () => {
                              const next = await apiClient.deleteFlashcard(c.id);
                              onRefreshState(next);
                            }}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
