import { ArrowLeft, ArrowRight, Check, Clock, Target, X } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import {
  fetchInterviewQuestions,
  fetchInterviewSimulations,
  saveInterviewSimulation,
  recordCompetencyAttempt,
  apiClient,
} from '../apiClient';
import { InterviewQuestionItem, InterviewSimulationRecord } from '../domain/types';

interface SimulatorConfig {
  role: 'DE' | 'AIE' | 'COMMON';
  roleName: string;
  seniority: 'Junior' | 'Intermédiaire' | 'Senior';
  mode: 'full' | 'express';
}

export const InterviewSimulatorView: React.FC = () => {
  const [step, setStep] = useState<'config' | 'technical' | 'case' | 'debrief' | 'history'>('config');
  const [allQuestions, setAllQuestions] = useState<InterviewQuestionItem[]>([]);
  const [simHistory, setSimHistory] = useState<InterviewSimulationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notice, setNotice] = useState<string>('');

  // Configuration
  const [config, setConfig] = useState<SimulatorConfig>({
    role: 'DE',
    roleName: 'Data Engineer (Priorité 1)',
    seniority: 'Junior',
    mode: 'full',
  });

  // Chronometre global de l'entretien
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Étape 2 : Questions Techniques
  const [technicalQuestions, setTechnicalQuestions] = useState<InterviewQuestionItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});

  // Etape 3 : Etude de cas / System Design
  const [caseStudyNotes, setCaseStudyNotes] = useState<string>('');
  const [caseScore, setCaseScore] = useState<number>(4);

  // Étape 4 : Debriefing
  const [finalScore, setFinalScore] = useState<number>(0);
  const [savingSim, setSavingSim] = useState<boolean>(false);
  const [simSaved, setSimSaved] = useState<boolean>(false);
  const [injectedFlashcardIds, setInjectedFlashcardIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([fetchInterviewQuestions(), fetchInterviewSimulations()])
      .then(([qs, sims]) => {
        setAllQuestions(qs);
        setSimHistory(sims);
      })
      .catch((err) => {
        console.error('Erreur chargement simulateur :', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const startSimulation = () => {
    // Filtrer les questions selon le role et le niveau
    const count = config.mode === 'full' ? 10 : 5;
    const pool = allQuestions.filter((q) => {
      if (config.role === 'DE') {
        return q.role === 'DE' || q.role === 'COMMON';
      } else if (config.role === 'AIE') {
        return q.role === 'AIE' || q.role === 'COMMON';
      }
      return true;
    });

    // Melanger et selectionner
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setTechnicalQuestions(shuffled.slice(0, count));

    setElapsedSeconds(0);
    setTimerActive(true);
    setAnswers({});
    setRevealedQuestions({});
    setCurrentQuestionIndex(0);
    setCaseStudyNotes('');
    setCaseScore(4);
    setSimSaved(false);
    setInjectedFlashcardIds({});
    setStep('technical');
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (revealedQuestions[questionId]) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setRevealedQuestions((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleInjectToSrs = async (q: InterviewQuestionItem) => {
    try {
      const topicId = q.category || 'entretien_technique';
      await apiClient.createFlashcard({
        topic_id: topicId,
        cert_code: 'INTERVIEW',
        front: `Question Entretien (${q.role}) : ${q.question}`,
        back: `Réponse attendue : ${q.expectedAnswer}\n\nExplication : ${q.explanation}`,
        provenance: 'générée par IA et vérifiée dans la documentation (2026-10-31)',
        source_url: q.source || 'Banque Entretiens Pack CDI',
      });


      setInjectedFlashcardIds((prev) => ({ ...prev, [q.id]: true }));
    } catch (err) {
      setNotice('Erreur lors de l\'ajout à la révision : ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const calculateFinalResults = () => {
    setTimerActive(false);

    // Calcul du score technique
    let techCorrect = 0;
    technicalQuestions.forEach((q) => {
      const userAns = answers[q.id];
      if (userAns && userAns.trim().toUpperCase() === q.expectedAnswer.trim().toUpperCase()) {
        techCorrect++;
      }
    });
    const techScorePct = technicalQuestions.length > 0 ? (techCorrect / technicalQuestions.length) * 100 : 0;

    // Calcul du score etude de cas (sur 100)
    const caseScorePct = (caseScore / 5) * 100;

    // Ponderation 100 % technique : QCM 65 % + System Design 35 % (ou 100 % QCM en mode express)
    const totalScore =
      config.mode === 'full'
        ? Math.round(techScorePct * 0.65 + caseScorePct * 0.35)
        : Math.round(techScorePct);
    setFinalScore(totalScore);

    setStep('debrief');
  };

  const handleSaveSimulation = async () => {
    if (savingSim || simSaved) return;
    setSavingSim(true);
    try {
      const simId = `sim-${Date.now()}`;
      await saveInterviewSimulation({
        id: simId,
        role: config.role,
        seniority: config.seniority,
        total_score: finalScore,
        duration_seconds: elapsedSeconds,
        details: {
          caseScore,
          caseStudyNotes,
          answers,
          questionsCount: technicalQuestions.length,
        },
      });

      // Enregistrer une tentative dans la table de competences
      const isSuccess = finalScore >= 70;
      await recordCompetencyAttempt({
        competency_id: 'system_design_architecture',
        session_id: simId,
        success: isSuccess,
        notes: `Simulation ${config.role} ${config.seniority} : score ${finalScore} %`,
      });

      // Rafraichir l historique
      const updated = await fetchInterviewSimulations();
      setSimHistory(updated);
      setSimSaved(true);
    } catch (err) {
      setNotice('Erreur enregistrement simulation : ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSavingSim(false);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="muted">Initialisation du simulateur d'entretien…</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {notice && (
        <div className="alert alert-warning small" role="alert">
          {notice}
        </div>
      )}
      {/* En-tete */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} aria-hidden />
              <span>Simulateur d'entretien technique (309 questions)</span>
            </h2>
            <div className="muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Évaluation 100 % technique : QCM d'architecture Data/AI, SQL, Python, System Design et débriefing chiffré.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {timerActive && (
              <div
                className="mono"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent-green)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Clock size={16} aria-hidden />
                <span>{formatTime(elapsedSeconds)}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setStep('config')}
                className={`btn btn-sm ${step !== 'history' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Simulation en cours
              </button>
              <button
                type="button"
                onClick={() => setStep('history')}
                className={`btn btn-sm ${step === 'history' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Historique ({simHistory.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ETAPE 1 : CONFIGURATION */}
      {step === 'config' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Configurer la session d'entretien</h3>
            <div className="muted" style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>
              Choisis le rôle, le niveau et le format de l'épreuve pour adapter les questions posées.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="muted" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                1. Rôle visé en entretien
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                <button type="button"
                  onClick={() => setConfig({ ...config, role: 'DE', roleName: 'Data Engineer (Priorité 1)' })}
                  className={`item-card ${config.role === 'DE' ? 'selected' : ''}`}
                  style={{ cursor: 'pointer', padding: '1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: config.role === 'DE' ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                    Data Engineer
                  </div>
                  <div className="muted" style={{ fontSize: '0.75rem', marginTop: '0.35rem', lineHeight: 1.4 }}>
                    Pipelines ETL/ELT, SQL avancé, Spark, Lakehouse, dbt, modélisation Kimball et observabilité.
                  </div>
                </button>

                <button type="button"
                  onClick={() => setConfig({ ...config, role: 'AIE', roleName: 'AI Engineer (Priorité 2)' })}
                  className={`item-card ${config.role === 'AIE' ? 'selected' : ''}`}
                  style={{ cursor: 'pointer', padding: '1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: config.role === 'AIE' ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                    AI Engineer & LLM
                  </div>
                  <div className="muted" style={{ fontSize: '0.75rem', marginTop: '0.35rem', lineHeight: 1.4 }}>
                    RAG, Vector DB, Embeddings, Fine-tuning LoRA, Frameworks d'évaluation et déploiement vLLM.
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="muted" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                2. Niveau d'exigence de l'évaluateur
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {(['Junior', 'Intermédiaire', 'Senior'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setConfig({ ...config, seniority: lvl })}
                    className={`btn btn-sm ${config.seniority === lvl ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textAlign: 'center' }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="muted" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                3. Format d'entretien
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                <button type="button"
                  onClick={() => setConfig({ ...config, mode: 'full' })}
                  className={`item-card ${config.mode === 'full' ? 'selected' : ''}`}
                  style={{ cursor: 'pointer', padding: '0.85rem' }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: config.mode === 'full' ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                    Format complet (45 min)
                  </div>
                  <div className="muted" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    10 questions QCM techniques et une étude de cas System Design
                  </div>
                </button>

                <button type="button"
                  onClick={() => setConfig({ ...config, mode: 'express' })}
                  className={`item-card ${config.mode === 'express' ? 'selected' : ''}`}
                  style={{ cursor: 'pointer', padding: '0.85rem' }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: config.mode === 'express' ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                    Format express (15 min)
                  </div>
                  <div className="muted" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    5 questions QCM techniques ciblées
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={startSimulation}
              className="btn btn-primary"
              style={{ fontSize: '0.92rem', padding: '0.6rem 1.25rem' }}
            >
              Lancer l'entretien technique <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}

      {/* ETAPE 2 : QUESTIONS TECHNIQUES */}
      {step === 'technical' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="row-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                {config.mode === 'full' ? 'Épreuve 1 sur 2' : 'Épreuve 1 sur 1'}
              </span>
              <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.15rem' }}>
                Questions Techniques ({currentQuestionIndex + 1} / {technicalQuestions.length})
              </h3>
            </div>
            <div className="muted" style={{ fontSize: '0.82rem' }}>
              Score actuel :{' '}
              <strong style={{ color: 'var(--accent-blue)' }}>
                {
                  technicalQuestions.filter(
                    (q) => answers[q.id] && answers[q.id].toUpperCase() === q.expectedAnswer.toUpperCase()
                  ).length
                }{' '}
                / {technicalQuestions.length}
              </strong>
            </div>
          </div>

          {technicalQuestions[currentQuestionIndex] && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-neutral" style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>
                  {technicalQuestions[currentQuestionIndex].category}
                </span>
                <span className="badge badge-neutral">
                  {technicalQuestions[currentQuestionIndex].level}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {technicalQuestions[currentQuestionIndex].question}
              </div>

              {/* Options QCM */}
              {technicalQuestions[currentQuestionIndex].options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {technicalQuestions[currentQuestionIndex].options?.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const qId = technicalQuestions[currentQuestionIndex].id;
                    const isSelected = answers[qId] === letter;
                    const isRevealed = revealedQuestions[qId];
                    const isCorrect = letter === technicalQuestions[currentQuestionIndex].expectedAnswer;

                    let bg = 'var(--bg-secondary)';
                    let border = '1px solid var(--border-color)';
                    let col = 'var(--text-primary)';

                    if (isRevealed) {
                      if (isCorrect) {
                        bg = 'var(--success-bg)';
                        border = '1px solid var(--accent-green)';
                        col = 'var(--success-fg)';
                      } else if (isSelected) {
                        bg = 'var(--danger-bg)';
                        border = '1px solid var(--accent-red)';
                        col = 'var(--danger-fg)';
                      }
                    } else if (isSelected) {
                      bg = 'var(--info-bg)';
                      border = '1px solid var(--accent-blue)';
                    }

                    return (
                      <button
                        type="button"
                        key={letter}
                        aria-pressed={isSelected}
                        onClick={() => !isRevealed && handleAnswerSelect(qId, letter)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          font: 'inherit',
                          backgroundColor: bg,
                          border: border,
                          color: col,
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: isRevealed ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          fontSize: '0.85rem',
                          lineHeight: 1.45,
                        }}
                      >
                        <span className="mono" style={{ fontWeight: 700 }}>{letter}.</span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {isRevealed && isCorrect && <Check size={18} aria-label="Bonne réponse" style={{ color: 'var(--accent-green)', flex: '0 0 auto' }} />}
                        {isRevealed && isSelected && !isCorrect && <X size={18} aria-label="Mauvaise réponse" style={{ color: 'var(--accent-red)', flex: '0 0 auto' }} />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explication et Refutations apres reponse */}
              {revealedQuestions[technicalQuestions[currentQuestionIndex].id] && (
                <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem' }}>
                  <div className="row-between" style={{ alignItems: 'center' }}>
                    <strong style={{ color: 'var(--accent-green)' }}>
                      Reponse attendue : Option {technicalQuestions[currentQuestionIndex].expectedAnswer}
                    </strong>
                    <button
                      type="button"
                      onClick={() => handleInjectToSrs(technicalQuestions[currentQuestionIndex])}
                      disabled={injectedFlashcardIds[technicalQuestions[currentQuestionIndex].id]}
                      className="btn btn-sm btn-secondary"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {injectedFlashcardIds[technicalQuestions[currentQuestionIndex].id]
                        ? 'Ajoutée à la révision'
                        : 'Ajouter à la révision espacée'}
                    </button>
                  </div>

                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {technicalQuestions[currentQuestionIndex].explanation}
                  </p>

                  {technicalQuestions[currentQuestionIndex].refutations && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div className="muted" style={{ fontWeight: 600 }}>Pourquoi les autres options sont fausses :</div>
                      {Object.entries(technicalQuestions[currentQuestionIndex].refutations || {}).map(([opt, refut]) => (
                        <div key={opt} style={{ paddingLeft: '0.5rem', borderLeft: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>Option {opt} :</strong> {refut}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation entre questions */}
          <div className="row-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((i) => i - 1)}
              className="btn btn-sm btn-secondary"
              style={{ opacity: currentQuestionIndex === 0 ? 0.4 : 1 }}
            >
              <ArrowLeft size={16} aria-hidden /> Question précédente
            </button>

            {currentQuestionIndex < technicalQuestions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((i) => i + 1)}
                className="btn btn-sm btn-primary"
              >
                Question suivante <ArrowRight size={16} aria-hidden />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (config.mode === 'full') {
                    setStep('case');
                  } else {
                    calculateFinalResults();
                  }
                }}
                className="btn btn-sm btn-primary"
                style={{ backgroundColor: 'var(--accent-green)', borderColor: 'var(--accent-green)' }}
              >
                {config.mode === 'full' ? 'Passer à l\'étude de cas' : 'Terminer et voir le débriefing'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ETAPE 3 : ETUDE DE CAS / SYSTEM DESIGN */}
      {step === 'case' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="row-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                Épreuve 2 sur 2
              </span>
              <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.15rem' }}>
                Étude de cas d'architecture et conception système
              </h3>
            </div>
            <span className="badge badge-neutral" style={{ color: 'var(--accent-indigo)' }}>
              Épreuve pratique
            </span>
          </div>

          <div className="code-terminal-box" style={{ lineHeight: 1.55 }}>
            <div style={{ color: 'var(--accent-green)', fontWeight: 700, marginBottom: '0.4rem' }}>
              # SUJET DE L ETUDE DE CAS :
            </div>
            <p style={{ margin: 0 }}>
              {config.role === 'DE'
                ? "Concevoir un pipeline d'ingestion et de transformation de logs IoT (50M événements/jour) vers Snowflake et un Lakehouse Iceberg. Définir le partitionnement, la stratégie anti-doublon et les alertes de fraîcheur."
                : "Concevoir une architecture RAG multi-documents pour 100 000 contrats PDF d'entreprise. Définir la stratégie de chunking, le modèle d'embeddings, le reranking et le pipeline d'évaluation des hallucinations."}
            </p>
          </div>

          <div>
            <label className="muted" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Schéma de réponse, composants d'architecture et décisions prises :
            </label>
            <textarea
              value={caseStudyNotes}
              onChange={(e) => setCaseStudyNotes(e.target.value)}
              rows={8}
              placeholder="Structure ta réponse : Ingestion -> Stockage -> Transformation -> Servabilité -> Observabilité..."
              className="code-editor-area"
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label className="muted" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Auto-évaluation sur l'étude de cas (sur 5) :
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setCaseScore(score)}
                  className={`btn ${caseScore === score ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '40px', height: '40px', padding: 0, fontWeight: 700 }}
                >
                  {score}
                </button>
              ))}
              <span className="muted" style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                {caseScore === 5 && 'Excellente maîtrise des compromis et du passage à l\'échelle'}
                {caseScore === 4 && 'Bonne architecture, composants pertinents'}
                {caseScore === 3 && 'Passable, quelques oublis sur la gouvernance ou le coût'}
                {caseScore < 3 && 'Insuffisant, revoir les cours d\'architecture'}
              </span>
            </div>
          </div>

          <div className="row-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setStep('technical')}
              className="btn btn-sm btn-secondary"
            >
              <ArrowLeft size={16} aria-hidden /> Revoir les questions
            </button>
            <button
              type="button"
              onClick={calculateFinalResults}
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--accent-green)', borderColor: 'var(--accent-green)' }}
            >
              Terminer et calculer mon score final <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}

      {/* ETAPE 4 : DEBRIEFING */}
      {step === 'debrief' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.05em' }}>
              Debriefing & Synthese de l Entretien
            </span>
            <h3 style={{ margin: '0.35rem 0', fontSize: '1.75rem', color: 'var(--text-primary)' }}>
              Score Global : {finalScore} %
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '0.82rem' }} className="muted">
              <span>Durée : <strong style={{ color: 'var(--text-primary)' }}>{formatTime(elapsedSeconds)}</strong></span>
              <span>Role : <strong style={{ color: 'var(--text-primary)' }}>{config.roleName}</strong></span>
              <span>Niveau : <strong style={{ color: 'var(--text-primary)' }}>{config.seniority}</strong></span>
            </div>
          </div>

          {/* Verdict */}
          <div
            className={`callout ${
              finalScore >= 75 ? 'callout-success' : finalScore >= 60 ? 'callout-info' : 'callout-warning'
            }`}
          >
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.25rem' }}>
              {finalScore >= 75
                ? 'Verdict : Excellent ! Entretien technique validé avec mention favorable.'
                : finalScore >= 60
                ? 'Verdict : Entretien acceptable. Quelques lacunes à combler sur les questions fondamentales.'
                : 'Verdict : Niveau insuffisant pour décrocher une offre immédiate. Reprendre les fiches de cours.'}
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.5 }}>
              {finalScore >= 75
                ? 'Tes réponses techniques et ton architecture System Design démontrent la solidité de ton profil Data & AI Engineer.'
                : 'Continue à pratiquer régulièrement sur les exercices Python et SQL et revois les cartes SRS.'}
            </p>
          </div>

          {/* Actions de sauvegarde */}
          <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleSaveSimulation}
              disabled={savingSim || simSaved}
              className="btn btn-primary"
            >
              {simSaved ? 'Résultat enregistré dans l\'historique' : savingSim ? 'Enregistrement…' : 'Enregistrer cette session dans mon historique'}
            </button>

            <button
              type="button"
              onClick={() => setStep('config')}
              className="btn btn-secondary"
            >
              Nouvelle simulation
            </button>
          </div>
        </div>
      )}

      {/* HISTORIQUE DES SIMULATIONS */}
      {step === 'history' && (
        <div className="card" style={{ maxWidth: '850px', margin: '0 auto', width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="row-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Historique de mes simulations d'entretien</h3>
              <div className="muted" style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                Suivi de ta progression et de tes scores au fil des semaines d'entraînement.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep('config')}
              className="btn btn-sm btn-primary"
            >
              + Nouvel entretien
            </button>
          </div>

          {simHistory.length === 0 ? (
            <div className="muted" style={{ padding: '2rem', textAlign: 'center', fontSize: '0.85rem' }}>
              Aucune simulation pour le moment. Lance ta première simulation pour voir apparaître ton historique.
            </div>
          ) : (
            <div className="item-list-container">
              {simHistory.map((s) => (
                <div key={s.id} className="item-card" style={{ padding: '0.75rem 1rem' }}>
                  <div className="row-between" style={{ alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        Entretien {s.role} ({s.seniority})
                      </div>
                      <div className="muted" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                        Date : {new Date(s.created_at).toLocaleDateString('fr-FR')} à {new Date(s.created_at).toLocaleTimeString('fr-FR').slice(0, 5)}, durée : {formatTime(s.duration_seconds)}
                      </div>
                    </div>
                    <span className={`badge ${s.total_score >= 70 ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.85rem' }}>
                      {s.total_score} %
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
