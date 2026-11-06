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

  return (
    <div data-testid="spaced-repetition-view">
      {/* File de revision du jour */}
      <div className="card" style={{ marginBottom: '1rem', borderColor: 'var(--accent)' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>
              File de révision espacée SM-2 du jour ({state.dueFlashcards.length} carte(s) à
              réviser)
            </h2>
            <p className="muted" style={{ margin: '0.2rem 0 0 0', fontSize: '0.84rem' }}>
              Critère de maîtrise stricte : au moins 3 répétitions réussies consécutives et un
              intervalle supérieur ou égal à 14 jours ({masteredCount}/{state.flashcards.length}{' '}
              maîtrisées).
            </p>
          </div>
          <span className="mono badge badge-info">
            Date de référence : {state.settings.simulated_today}
          </span>
        </div>

        {state.dueFlashcards.length === 0 ? (
          <p className="muted" data-testid="no-due-cards-msg">
            Aucune carte échue à réviser aujourd'hui. Créez une nouvelle carte ci-dessous ou
            avancez la date de simulation pour tester les échéances SM-2.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {state.dueFlashcards.map((card) => {
              const isRevealed = Boolean(revealedIds[card.id]);
              return (
                <div
                  key={card.id}
                  data-testid={`due-card-${card.id}`}
                  className="card card-sm"
                >
                  <div className="row-between" style={{ marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className="badge badge-info">{card.cert_code}</span>
                      <span className="mono badge badge-neutral">{card.topic_id}</span>
                      <span className="badge badge-neutral">
                        Provenance : {card.provenance}
                      </span>
                      {card.is_demo === 1 && (
                        <span className="badge badge-warning">DÉMO</span>
                      )}
                    </div>
                    <span className="mono muted" style={{ fontSize: '0.78rem' }}>
                      Répétitions : {card.repetitions} | Intervalle : {card.interval_days} j | EF :{' '}
                      {card.ease_factor}
                    </span>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '0.96rem', marginBottom: '0.5rem' }}>
                    Question : {card.front}
                  </div>

                  {!isRevealed ? (
                    <button
                      type="button"
                      data-testid={`reveal-card-${card.id}`}
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        setRevealedIds((prev) => ({ ...prev, [card.id]: true }))
                      }
                    >
                      Afficher la réponse
                    </button>
                  ) : (
                    <div>
                      <div
                        style={{
                          padding: '0.6rem',
                          background: 'var(--bg-elevated)',
                          borderRadius: '6px',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <strong>Réponse :</strong> {card.back}
                        {card.source_url && (
                          <div className="muted" style={{ fontSize: '0.76rem', marginTop: '0.25rem' }}>
                            Source : {card.source_url}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className="muted" style={{ fontSize: '0.82rem' }}>
                          Auto-évaluation SM-2 :
                        </span>
                        {([0, 3, 4, 5] as ReviewGrade[]).map((grade) => (
                          <button
                            key={grade}
                            type="button"
                            data-testid={`grade-card-${card.id}-${grade}`}
                            className={`btn btn-sm ${
                              grade < 3
                                ? 'btn-danger'
                                : grade === 3
                                ? 'btn-warning'
                                : 'btn-success'
                            }`}
                            onClick={() => handleGradeCard(card.id, grade)}
                          >
                            {grade} (
                            {grade === 0
                              ? 'À revoir (0)'
                              : grade === 3
                              ? 'Difficile (3)'
                              : grade === 4
                              ? 'Correct (4)'
                              : 'Parfait (5)'}
                            )
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

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
                        <td style={{ fontSize: '0.76rem' }}>{c.provenance}</td>
                        <td className="mono" style={{ fontSize: '0.78rem' }}>
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
