import React, { useState, useEffect, useMemo } from 'react';
import {
  apiClient,
  AppStateResponse,
  CertChapterSummary,
  CertChapterDetail,
  CertFicheSummary,
  CertFicheDetail,
  CertQuestion,
} from '../apiClient';
import { CertCode } from '../domain/types';
import { MarkdownViewer } from './MarkdownViewer';

interface CertificationsViewProps {
  state: AppStateResponse;
  onRefreshState: (nextState: AppStateResponse) => void;
  initialCertCode?: CertCode;
  initialSubTab?: SubTab;
  navigationNonce?: number;
}

type SubTab = 'synthese' | 'chapitres' | 'fiches' | 'banque' | 'examen';

const OFFICIAL_CERT_SPECS: Record<
  CertCode,
  {
    name: string;
    officialPassScore: string;
    passScoreNumber: number;
    durationQuestions: string;
    standardMinutes: number;
    hasEslOption: boolean;
    verifiedSource: string;
    domains: Array<{ id: string; label: string; weight: string }>;
  }
> = {
  'CLF-C02': {
    name: 'AWS Certified Cloud Practitioner (CLF-C02)',
    officialPassScore: '700 / 1000 (~70 %)',
    passScoreNumber: 70,
    durationQuestions: '90 min | 65 questions (50 notées + 15 non notées)',
    standardMinutes: 90,
    hasEslOption: false,
    verifiedSource: 'Guide officiel AWS CLF-C02 (vérifié le 31/10/2026)',
    domains: [
      { id: 'D1', label: 'Domaine 1 : Concepts du Cloud', weight: '24 %' },
      { id: 'D2', label: 'Domaine 2 : Sécurité et conformité', weight: '30 %' },
      { id: 'D3', label: 'Domaine 3 : Technologies et services Cloud', weight: '34 %' },
      { id: 'D4', label: 'Domaine 4 : Facturation, tarification et support', weight: '12 %' },
    ],
  },
  'DEA-C01': {
    name: 'AWS Certified Data Engineer - Associate (DEA-C01)',
    officialPassScore: '720 / 1000 (~72 %)',
    passScoreNumber: 72,
    durationQuestions: '130 min | 65 questions (50 notées + 15 non notées)',
    standardMinutes: 130,
    hasEslOption: true,
    verifiedSource: 'Guide officiel AWS DEA-C01 v1.1 (vérifié le 31/10/2026)',
    domains: [
      { id: 'D1', label: 'Domaine 1 : Ingestion et transformation des données', weight: '34 %' },
      { id: 'D2', label: 'Domaine 2 : Gestion des magasins de données (Data Store)', weight: '26 %' },
      { id: 'D3', label: 'Domaine 3 : Opérations et support des données', weight: '22 %' },
      { id: 'D4', label: 'Domaine 4 : Sécurité et gouvernance des données', weight: '18 %' },
    ],
  },
  DBT: {
    name: 'dbt Analytics Engineering Certification',
    officialPassScore: '65 % (seuil officiel dbt Labs)',
    passScoreNumber: 65,
    durationQuestions: '120 min | ~65 questions (QCM, réponses multiples)',
    standardMinutes: 120,
    hasEslOption: false,
    verifiedSource: 'Guide d\'étude officiel dbt Labs (vérifié le 31/10/2026)',
    domains: [
      { id: 'S1', label: 'Section 1 : Developing dbt models', weight: '30 %' },
      { id: 'S2', label: 'Section 2 : Debugging data modeling errors', weight: '20 %' },
      { id: 'S3', label: 'Section 3 : Testing, documenting, and publishing dbt models', weight: '20 %' },
      { id: 'S4', label: 'Section 4 : Deployment and orchestration', weight: '15 %' },
      { id: 'S5', label: 'Section 5 : Performance, optimization, and project maintenance', weight: '15 %' },
    ],
  },
};

function sampleExamQuestions(bank: CertQuestion[], cert: CertCode): CertQuestion[] {
  const byDomain: Record<string, CertQuestion[]> = {};
  for (const q of bank) {
    if (!byDomain[q.domain]) byDomain[q.domain] = [];
    byDomain[q.domain].push(q);
  }
  function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => 0.5 - Math.random());
  }
  const selected: CertQuestion[] = [];

  if (cert === 'CLF-C02') {
    const targets: Record<string, number> = {
      'Domaine 1 : Concepts du Cloud': 16,
      'Domaine 2 : Sécurité et Conformité': 19,
      'Domaine 3 : Technologies et Services Cloud': 22,
      'Domaine 4 : Facturation, Tarification et Support': 8,
    };
    for (const [dom, count] of Object.entries(targets)) {
      const pool = shuffle(byDomain[dom] || []);
      selected.push(...pool.slice(0, count));
    }
  } else if (cert === 'DEA-C01') {
    const targets: Record<string, number> = {
      'Domaine 1 : Ingestion et transformation des données (34 %)': 22,
      'Domaine 2 : Magasins de données et gestion du stockage (26 %)': 17,
      'Domaine 3 : Opérations et support des données (22 %)': 14,
      'Domaine 4 : Sécurité, gouvernance et conformité (18 %)': 12,
    };
    for (const [dom, count] of Object.entries(targets)) {
      const pool = shuffle(byDomain[dom] || []);
      selected.push(...pool.slice(0, count));
    }
  } else {
    const targets: Record<string, number> = {
      'Section 1 : Developing dbt models': 20,
      'Section 2 : Debugging data modeling errors': 13,
      'Section 3 : Testing, documenting, and publishing dbt models': 13,
      'Section 4 : Deployment and orchestration': 10,
      'Section 5 : Performance, optimization, and project maintenance': 9,
    };
    for (const [dom, count] of Object.entries(targets)) {
      const pool = shuffle(byDomain[dom] || []);
      selected.push(...pool.slice(0, count));
    }
  }

  if (selected.length < 65) {
    const remaining = shuffle(bank.filter((q) => !selected.find((s) => s.id === q.id)));
    selected.push(...remaining.slice(0, 65 - selected.length));
  }

  return shuffle(selected).slice(0, 65);
}

export const CertificationsView: React.FC<CertificationsViewProps> = ({
  state,
  onRefreshState,
  initialCertCode,
  initialSubTab,
  navigationNonce,
}) => {
  // Navigation globale
  const [selectedCert, setSelectedCert] = useState<CertCode>(initialCertCode || 'CLF-C02');
  const [activeTab, setActiveTab] = useState<SubTab>(initialSubTab || 'synthese');

  useEffect(() => {
    if (initialCertCode) {
      setSelectedCert(initialCertCode);
    }
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialCertCode, initialSubTab, navigationNonce]);

  // Donnees chargees via API
  const [chaptersList, setChaptersList] = useState<CertChapterSummary[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [chapterDetail, setChapterDetail] = useState<CertChapterDetail | null>(null);
  const [chapterFilter, setChapterFilter] = useState<string>('');

  const [fichesList, setFichesList] = useState<CertFicheSummary[]>([]);
  const [selectedFicheId, setSelectedFicheId] = useState<string>('');
  const [ficheDetail, setFicheDetail] = useState<CertFicheDetail | null>(null);

  const [questionsBank, setQuestionsBank] = useState<CertQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);

  // Filtres banque de questions
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Mode Entrainement libre
  const [trainingCount, setTrainingCount] = useState<number>(10);
  const [trainingModeImmediate, setTrainingModeImmediate] = useState<boolean>(true);
  const [trainingActive, setTrainingActive] = useState<boolean>(false);
  const [trainingQuestions, setTrainingQuestions] = useState<CertQuestion[]>([]);
  const [trainingAnswers, setTrainingAnswers] = useState<Record<string, string>>({});
  const [trainingSubmitted, setTrainingSubmitted] = useState<boolean>(false);

  // Simulation Examen Blanc
  const [eslExtendedTime, setEslExtendedTime] = useState<boolean>(true);
  const [examActive, setExamActive] = useState<boolean>(false);
  const [examQuestions, setExamQuestions] = useState<CertQuestion[]>([]);
  const [examCurrentIndex, setExamCurrentIndex] = useState<number>(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examFlagged, setExamFlagged] = useState<Record<string, boolean>>({});
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(0);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [savedToHistory, setSavedToHistory] = useState<boolean>(false);

  // Formulaire d'ajout manuel de score d'examen
  const [examSource, setExamSource] = useState<string>('Examen blanc officiel AWS Skill Builder');
  const [examDate, setExamDate] = useState<string>(state.settings.simulated_today || '2026-11-02');
  const [scorePct, setScorePct] = useState<number>(85);
  const [rawScore, setRawScore] = useState<string>('850');
  const [examNotes, setExamNotes] = useState<string>('');
  const [domainScoresDraft, setDomainScoresDraft] = useState<Record<string, string>>({});

  // Formulaire d'ajout manuel d'erreur
  const [errCert, setErrCert] = useState<CertCode>('DEA-C01');
  const [errDomain, setErrDomain] = useState<string>('D1');
  const [errTopic, setErrTopic] = useState<string>('glue');
  const [errSummary, setErrSummary] = useState<string>('');
  const [errRootCause, setErrRootCause] = useState<string>('');
  const [errAction, setErrAction] = useState<string>('');

  // Chargement des chapitres et fiches quand selectedCert change
  useEffect(() => {
    let isMounted = true;
    const certParam = selectedCert.toLowerCase();

    apiClient.fetchCertificationChapters(certParam).then((res) => {
      if (isMounted) {
        setChaptersList(res);
        if (res.length > 0) {
          setSelectedChapterId(res[0].id);
        }
      }
    });

    apiClient.fetchCertificationFiches(certParam).then((res) => {
      if (isMounted) {
        setFichesList(res);
        if (res.length > 0) {
          setSelectedFicheId(res[0].id);
        }
      }
    });

    setLoadingQuestions(true);
    apiClient.fetchCertificationQuestions(certParam).then((res) => {
      if (isMounted) {
        setQuestionsBank(res);
        setLoadingQuestions(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCert]);

  // Chargement du detail du chapitre selectionne
  useEffect(() => {
    if (!selectedChapterId) return;
    let isMounted = true;
    apiClient
      .fetchCertificationChapterContent(selectedCert.toLowerCase(), selectedChapterId)
      .then((res) => {
        if (isMounted) setChapterDetail(res);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedCert, selectedChapterId]);

  // Chargement du detail de la fiche selectionnee
  useEffect(() => {
    if (!selectedFicheId) return;
    let isMounted = true;
    apiClient
      .fetchCertificationFicheContent(selectedCert.toLowerCase(), selectedFicheId)
      .then((res) => {
        if (isMounted) setFicheDetail(res);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedCert, selectedFicheId]);

  // Chronometre Examen Blanc
  useEffect(() => {
    if (!examActive || examSubmitted || examSecondsLeft <= 0) return;
    const timer = setInterval(() => {
      setExamSecondsLeft((prev) => {
        if (prev <= 1) {
          setExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examActive, examSubmitted, examSecondsLeft]);

  // Telechargement de fichier Markdown
  const downloadMarkdownFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtrage des chapitres
  const filteredChapters = useMemo(() => {
    if (!chapterFilter.trim()) return chaptersList;
    const q = chapterFilter.toLowerCase();
    return chaptersList.filter(
      (c) => c.title.toLowerCase().includes(q) || c.filename.toLowerCase().includes(q)
    );
  }, [chaptersList, chapterFilter]);

  // Filtrage des questions
  const filteredQuestions = useMemo(() => {
    return questionsBank.filter((q) => {
      if (filterDomain !== 'all' && q.domain !== filterDomain) return false;
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
      if (searchKeyword.trim()) {
        const k = searchKeyword.toLowerCase();
        const matchesText =
          q.question.toLowerCase().includes(k) ||
          q.explanation.toLowerCase().includes(k) ||
          q.topic_id.toLowerCase().includes(k);
        if (!matchesText) return false;
      }
      return true;
    });
  }, [questionsBank, filterDomain, filterDifficulty, searchKeyword]);

  // Demarrage d'un entrainement libre
  const handleStartTraining = () => {
    const pool = [...filteredQuestions].sort(() => 0.5 - Math.random());
    setTrainingQuestions(pool.slice(0, Math.min(trainingCount, pool.length)));
    setTrainingAnswers({});
    setTrainingSubmitted(false);
    setTrainingActive(true);
  };

  // Demarrage d'un Examen Blanc Officiel
  const handleStartMockExam = () => {
    if (questionsBank.length === 0) return;
    const spec = OFFICIAL_CERT_SPECS[selectedCert];
    let totalMinutes = spec.standardMinutes;
    if (spec.hasEslOption && eslExtendedTime) {
      totalMinutes += 30; // +30 minutes ESL
    }
    const questions = sampleExamQuestions(questionsBank, selectedCert);
    setExamQuestions(questions);
    setExamCurrentIndex(0);
    setExamAnswers({});
    setExamFlagged({});
    setExamSecondsLeft(totalMinutes * 60);
    setExamSubmitted(false);
    setSavedToHistory(false);
    setExamActive(true);
  };

  // Calcul du score d'examen blanc
  const examStats = useMemo(() => {
    if (!examSubmitted || examQuestions.length === 0) return null;
    let correct = 0;
    const domainTotal: Record<string, number> = {};
    const domainCorrect: Record<string, number> = {};

    examQuestions.forEach((q) => {
      const userAns = examAnswers[q.id];
      const isRight = userAns === q.correct_answer;
      if (isRight) correct++;

      domainTotal[q.domain] = (domainTotal[q.domain] || 0) + 1;
      if (isRight) {
        domainCorrect[q.domain] = (domainCorrect[q.domain] || 0) + 1;
      } else if (!domainCorrect[q.domain]) {
        domainCorrect[q.domain] = 0;
      }
    });

    const scorePercent = Math.round((correct / examQuestions.length) * 1000) / 10;
    const spec = OFFICIAL_CERT_SPECS[selectedCert];
    const isPassed = scorePercent >= spec.passScoreNumber;
    const rawScoreCalc = Math.round((scorePercent / 100) * 1000);

    const domainScoresPercent: Record<string, number> = {};
    const weakDomains: string[] = [];

    for (const [dom, tot] of Object.entries(domainTotal)) {
      const cor = domainCorrect[dom] || 0;
      const pct = Math.round((cor / tot) * 100);
      domainScoresPercent[dom] = pct;
      if (pct < spec.passScoreNumber) {
        weakDomains.push(dom);
      }
    }

    return {
      correctCount: correct,
      totalCount: examQuestions.length,
      scorePercent,
      rawScoreCalc,
      isPassed,
      domainScoresPercent,
      weakDomains,
    };
  }, [examSubmitted, examQuestions, examAnswers, selectedCert]);

  // Ajouter un examen blanc a l'historique
  const handleSaveExamResult = async () => {
    if (!examStats || savedToHistory) return;
    const spec = OFFICIAL_CERT_SPECS[selectedCert];
    const nextState = await apiClient.addMockExam({
      cert_code: selectedCert,
      source: `Simulation Examen Blanc Officiel (${examStats.totalCount} questions)`,
      date: state.settings.simulated_today || new Date().toISOString().slice(0, 10),
      score_pct: examStats.scorePercent,
      raw_score: selectedCert !== 'DBT' ? examStats.rawScoreCalc : null,
      domain_scores: examStats.domainScoresPercent,
      notes: examStats.isPassed
        ? `Examen réussi (seuil officiel ${spec.passScoreNumber} % atteint)`
        : `Ajourné : domaines faibles détectés (${examStats.weakDomains.join(', ')})`,
    });
    onRefreshState(nextState);
    setSavedToHistory(true);
  };

  // Ajouter rapidement une erreur depuis une question
  const handleQuickAddError = async (q: CertQuestion, userAnswer: string) => {
    const nextState = await apiClient.addErrorEntry({
      cert_code: selectedCert,
      domain_id: q.domain.slice(0, 30),
      topic_id: q.topic_id,
      question_summary: q.question.slice(0, 150),
      root_cause: `Choix de l'option ${userAnswer || 'aucune'} au lieu de ${q.correct_answer}.`,
      action_to_review: q.course_recommendation || 'Revoir la fiche de chapitre correspondante',
    });
    onRefreshState(nextState);
    alert(`Question ajoutée avec succès au Journal des erreurs !`);
  };

  // Creer une flashcard en un clic depuis une question
  const handleQuickCreateFlashcard = async (q: CertQuestion) => {
    const nextState = await apiClient.createFlashcard({
      cert_code: selectedCert,
      topic_id: q.topic_id,
      front: q.question,
      back: `Bonne réponse : ${q.correct_answer}\n\nExplication :\n${q.explanation}\n\nDocumentation :\n${q.source_doc}`,
      provenance: q.provenance as never,
      source_url: q.source_doc,
    });
    onRefreshState(nextState);
    alert(`Flashcard SM-2 créée avec succès !`);
  };

  // Gestion formulaire manuel examen
  const handleAddMockExam = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDomains: Record<string, number> = {};
    for (const [k, v] of Object.entries(domainScoresDraft)) {
      const n = Number(v);
      if (v.trim() !== '' && !Number.isNaN(n)) {
        parsedDomains[k] = n;
      }
    }

    const nextState = await apiClient.addMockExam({
      cert_code: selectedCert,
      source: examSource,
      date: examDate,
      score_pct: scorePct,
      raw_score: rawScore.trim() ? Number(rawScore) : null,
      domain_scores: parsedDomains,
      notes: examNotes,
    });
    onRefreshState(nextState);
    setExamNotes('');
    setDomainScoresDraft({});
  };

  // Gestion formulaire manuel erreur
  const handleAddError = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errSummary.trim()) return;
    const nextState = await apiClient.addErrorEntry({
      cert_code: errCert,
      domain_id: errDomain,
      topic_id: errTopic,
      question_summary: errSummary,
      root_cause: errRootCause,
      action_to_review: errAction,
    });
    onRefreshState(nextState);
    setErrSummary('');
    setErrRootCause('');
    setErrAction('');
  };

  const currentSpec = OFFICIAL_CERT_SPECS[selectedCert];

  return (
    <div data-testid="certifications-view">
      {/* Barre de selection de la certification */}
      <div
        className="card"
        style={{
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Certification :</span>
          {(['CLF-C02', 'DEA-C01', 'DBT'] as CertCode[]).map((code) => {
            const isSelected = selectedCert === code;
            return (
              <button
                key={code}
                type="button"
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontWeight: isSelected ? 700 : 500 }}
                onClick={() => {
                  setSelectedCert(code);
                  setExamActive(false);
                  setTrainingActive(false);
                }}
              >
                {code}
              </button>
            );
          })}
        </div>
        <div className="muted" style={{ fontSize: '0.85rem' }}>
          <strong>{currentSpec.name}</strong> ({currentSpec.durationQuestions})
        </div>
      </div>

      {/* Barre des 5 sous-onglets */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1rem',
          paddingBottom: '0.4rem',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'synthese' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('synthese')}
        >
          Vue d'ensemble & Suivi
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'chapitres' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('chapitres')}
        >
          Fiches de Chapitres ({chaptersList.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'fiches' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('fiches')}
        >
          Fiches Express Domaines ({fichesList.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'banque' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('banque')}
        >
          Banque & Entraînement ({questionsBank.length} questions)
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'examen' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('examen')}
          style={{
            backgroundColor: activeTab === 'examen' ? 'var(--accent-purple)' : undefined,
            borderColor: activeTab === 'examen' ? 'var(--accent-purple)' : undefined,
          }}
        >
          Simulation Examen Blanc (65 questions)
        </button>
      </div>

      {/* SOUS-ONGLET 1 : SYNTHESE & SUIVI */}
      {activeTab === 'synthese' && (
        <div>
          {/* Les 3 cartes de certification */}
          <div className="grid-3" style={{ gap: '0.85rem', marginBottom: '1rem' }}>
            {(['CLF-C02', 'DEA-C01', 'DBT'] as CertCode[]).map((code) => {
              const spec = OFFICIAL_CERT_SPECS[code];
              const readiness = state.readiness[code];
              const prog = state.progress.certifications[code];
              return (
                <div
                  key={code}
                  data-testid={`cert-card-${code}`}
                  className="card"
                  style={{
                    borderTop: `4px solid ${
                      readiness.isReady ? 'var(--accent-green)' : 'var(--accent-blue)'
                    }`,
                  }}
                >
                  <div className="row-between" style={{ marginBottom: '0.35rem' }}>
                    <span className="mono badge badge-info">{code}</span>
                    <span
                      data-testid={`readiness-badge-${code}`}
                      className={`badge ${
                        readiness.isReady ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {readiness.statusLabel}
                    </span>
                  </div>
                  <h3 style={{ margin: '0.25rem 0', fontSize: '1rem' }}>{spec.name}</h3>
                  <div className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    <div>Date visée : {state.settings.exam_dates[code]}</div>
                    <div>Format : {spec.durationQuestions}</div>
                    <div>Seuil officiel : {spec.officialPassScore}</div>
                    <div>{spec.verifiedSource}</div>
                  </div>

                  <div
                    className="alert alert-info"
                    style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                  >
                    <strong>Règle Prêt pour l'examen :</strong> {readiness.ruleExplanation}
                    {readiness.weakDomains.length > 0 && (
                      <div style={{ color: 'var(--accent-red)', marginTop: '0.25rem' }}>
                        Domaines faibles détectés : {readiness.weakDomains.join(', ')}
                      </div>
                    )}
                  </div>

                  <h4 style={{ fontSize: '0.85rem', margin: '0.6rem 0 0.3rem 0' }}>
                    Domaines officiels :
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem' }}>
                    {spec.domains.map((d) => (
                      <li key={d.id} style={{ marginBottom: '0.15rem' }}>
                        {d.label} : <strong>{d.weight}</strong>
                      </li>
                    ))}
                  </ul>

                  <div className="muted" style={{ fontSize: '0.8rem', marginTop: '0.6rem' }}>
                    Progression cours : <strong>{prog.combinedWeightedPercent} %</strong> (
                    {readiness.attemptsCount} examen(s) blanc(s) enregistré(s))
                  </div>
                </div>
              );
            })}
          </div>

          {/* Saisie d'examen manuel + Historique */}
          <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Saisir un résultat d'examen blanc externe</h3>
              <form onSubmit={handleAddMockExam} data-testid="mock-exam-form">
                <div className="grid-3" style={{ gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <label>
                    Certification :
                    <select
                      data-testid="mock-exam-cert-select"
                      value={selectedCert}
                      onChange={(e) => setSelectedCert(e.target.value as CertCode)}
                      style={{ width: '100%', marginTop: '0.2rem' }}
                    >
                      <option value="CLF-C02">AWS CLF-C02</option>
                      <option value="DEA-C01">AWS DEA-C01</option>
                      <option value="DBT">dbt Analytics</option>
                    </select>
                  </label>
                  <label>
                    Date de passage :
                    <input
                      type="date"
                      data-testid="mock-exam-date-input"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      style={{ width: '100%', marginTop: '0.2rem' }}
                    />
                  </label>
                  <label>
                    Source :
                    <input
                      type="text"
                      data-testid="mock-exam-source-input"
                      value={examSource}
                      onChange={(e) => setExamSource(e.target.value)}
                      required
                      style={{ width: '100%', marginTop: '0.2rem' }}
                    />
                  </label>
                </div>

                <div className="grid-2" style={{ gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <label>
                    Score global (%) :
                    <input
                      type="number"
                      data-testid="mock-exam-score-input"
                      min={0}
                      max={100}
                      step={0.5}
                      value={scorePct}
                      onChange={(e) => setScorePct(Number(e.target.value))}
                      required
                      style={{ width: '100%', marginTop: '0.2rem' }}
                    />
                  </label>
                  <label>
                    Score échelle /1000 :
                    <input
                      type="number"
                      min={100}
                      max={1000}
                      value={rawScore}
                      onChange={(e) => setRawScore(e.target.value)}
                      style={{ width: '100%', marginTop: '0.2rem' }}
                    />
                  </label>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label>
                    Notes et observations :
                    <input
                      type="text"
                      data-testid="mock-exam-notes-input"
                      value={examNotes}
                      onChange={(e) => setExamNotes(e.target.value)}
                      placeholder="Gestion du temps, pièges rencontrés..."
                      style={{ width: '100%', marginTop: '0.2rem' }}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  data-testid="btn-submit-mock-exam"
                  className="btn btn-primary"
                >
                  Enregistrer ce score
                </button>
              </form>
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0 }}>
                Historique des examens blancs ({state.mockExams.length})
              </h3>
              {state.mockExams.length === 0 ? (
                <p className="muted" data-testid="no-mock-exams-msg">
                  Aucun examen blanc enregistré pour le moment.
                </p>
              ) : (
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  <table className="table" data-testid="mock-exams-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Cert.</th>
                        <th>Source</th>
                        <th>Score</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.mockExams.map((m) => (
                        <tr key={m.id} data-testid={`mock-exam-row-${m.id}`}>
                          <td className="mono">{m.date}</td>
                          <td>
                            <span className="badge badge-info">{m.cert_code}</span>
                            {m.is_demo === 1 && (
                              <span className="badge badge-warning" style={{ marginLeft: '0.25rem' }}>
                                DÉMO
                              </span>
                            )}
                          </td>
                          <td>
                            <div>{m.source}</div>
                            {m.notes && (
                              <div className="muted" style={{ fontSize: '0.76rem' }}>
                                {m.notes}
                              </div>
                            )}
                          </td>
                          <td className="mono" style={{ fontWeight: 700 }}>
                            {m.score_pct} % {m.raw_score ? `(${m.raw_score})` : ''}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={async () => {
                                const next = await apiClient.deleteMockExam(m.id);
                                onRefreshState(next);
                              }}
                            >
                              X
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Journal des erreurs */}
          <div className="card">
            <h3 style={{ marginTop: 0 }}>
              Journal de mes erreurs aux questions d'examen ({state.errorJournal.length})
            </h3>
            <form
              onSubmit={handleAddError}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.6rem',
                marginBottom: '1rem',
                alignItems: 'end',
              }}
            >
              <label>
                Certification :
                <select
                  value={errCert}
                  onChange={(e) => setErrCert(e.target.value as CertCode)}
                  style={{ width: '100%' }}
                >
                  <option value="CLF-C02">CLF-C02</option>
                  <option value="DEA-C01">DEA-C01</option>
                  <option value="DBT">DBT</option>
                </select>
              </label>
              <label>
                Domaine / Sujet :
                <input
                  type="text"
                  value={errTopic}
                  onChange={(e) => setErrTopic(e.target.value)}
                  placeholder="ex. kinesis, s3, glue"
                  style={{ width: '100%' }}
                />
              </label>
              <label>
                Question / Concept raté :
                <input
                  type="text"
                  data-testid="error-summary-input"
                  placeholder="Ex. Différence Kinesis Firehose vs Data Streams"
                  value={errSummary}
                  onChange={(e) => setErrSummary(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </label>
              <label>
                Cause de l'erreur :
                <input
                  type="text"
                  placeholder="Confusion sur le buffer de 60 secondes..."
                  value={errRootCause}
                  onChange={(e) => setErrRootCause(e.target.value)}
                  style={{ width: '100%' }}
                />
              </label>
              <label>
                Action corrective :
                <input
                  type="text"
                  placeholder="Revoir Maarek leçons 84 à 96"
                  value={errAction}
                  onChange={(e) => setErrAction(e.target.value)}
                  style={{ width: '100%' }}
                />
              </label>
              <button type="submit" data-testid="btn-add-error" className="btn btn-primary">
                Noter l'erreur
              </button>
            </form>

            {state.errorJournal.length === 0 ? (
              <p className="muted">Aucune erreur notée dans le journal pour l'instant.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Statut</th>
                    <th>Cert.</th>
                    <th>Sujet</th>
                    <th>Question / Concept</th>
                    <th>Cause</th>
                    <th>Action</th>
                    <th>Suppr.</th>
                  </tr>
                </thead>
                <tbody>
                  {state.errorJournal.map((err) => (
                    <tr key={err.id} style={{ opacity: err.resolved ? 0.6 : 1 }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={Boolean(err.resolved)}
                          onChange={async (e) => {
                            const next = await apiClient.toggleErrorResolved(
                              err.id,
                              e.target.checked
                            );
                            onRefreshState(next);
                          }}
                        />
                      </td>
                      <td>
                        <span className="badge badge-info">{err.cert_code}</span>
                      </td>
                      <td className="mono">{err.topic_id}</td>
                      <td>
                        <strong>{err.question_summary}</strong>
                      </td>
                      <td>{err.root_cause}</td>
                      <td>{err.action_to_review}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={async () => {
                            const next = await apiClient.deleteErrorEntry(err.id);
                            onRefreshState(next);
                          }}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* SOUS-ONGLET 2 : FICHES DE CHAPITRES */}
      {activeTab === 'chapitres' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1rem' }}>
          {/* Liste des chapitres */}
          <div className="card" style={{ height: 'fit-content', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
              Chapitres {selectedCert} ({chaptersList.length})
            </h3>
            <input
              type="text"
              placeholder="Rechercher un chapitre..."
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              style={{ width: '100%', marginBottom: '0.75rem' }}
            />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {filteredChapters.map((chap) => {
                const isSelected = selectedChapterId === chap.id;
                return (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => setSelectedChapterId(chap.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                      backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                      color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.84rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                    }}
                  >
                    <div style={{ fontWeight: isSelected ? 600 : 400 }}>{chap.title}</div>
                    <div className="muted" style={{ fontSize: '0.75rem' }}>
                      {chap.wordsCount} mots | {chap.filename}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Affichage du contenu du chapitre */}
          <div className="card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {chapterDetail ? (
              <div>
                <div className="row-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-info">{selectedCert}</span>
                    <span className="muted" style={{ marginLeft: '0.5rem', fontSize: '0.82rem' }}>
                      {chapterDetail.wordsCount} mots (dense, synthèse officielle)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => downloadMarkdownFile(chapterDetail.filename, chapterDetail.content)}
                  >
                    Télécharger la fiche (.md)
                  </button>
                </div>
                <MarkdownViewer content={chapterDetail.content} />
              </div>
            ) : (
              <p className="muted">Sélectionnez un chapitre dans la liste de gauche pour afficher son contenu.</p>
            )}
          </div>
        </div>
      )}

      {/* SOUS-ONGLET 3 : FICHES EXPRESS PAR DOMAINE */}
      {activeTab === 'fiches' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>
          {/* Liste des fiches express */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
              Fiches Express {selectedCert}
            </h3>
            <p className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
              Synthèse ultra-rapide par domaine : 10 à 15 points clés, métriques, limites et règles d'or.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {fichesList.map((fiche) => {
                const isSelected = selectedFicheId === fiche.id;
                return (
                  <button
                    key={fiche.id}
                    type="button"
                    onClick={() => setSelectedFicheId(fiche.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                      backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                      color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.84rem',
                    }}
                  >
                    <div style={{ fontWeight: isSelected ? 600 : 400 }}>{fiche.title}</div>
                    <div className="muted" style={{ fontSize: '0.75rem' }}>{fiche.wordsCount} mots</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenu de la fiche express */}
          <div className="card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {ficheDetail ? (
              <div>
                <div className="row-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-info">{selectedCert}</span>
                    <span className="muted" style={{ marginLeft: '0.5rem', fontSize: '0.82rem' }}>
                      Fiche Express Domaine ({ficheDetail.wordsCount} mots)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => downloadMarkdownFile(ficheDetail.filename, ficheDetail.content)}
                  >
                    Exporter la fiche (.md)
                  </button>
                </div>
                <MarkdownViewer content={ficheDetail.content} />
              </div>
            ) : (
              <p className="muted">Sélectionnez une fiche express pour afficher les points clés du domaine.</p>
            )}
          </div>
        </div>
      )}

      {/* SOUS-ONGLET 4 : BANQUE DE QUESTIONS ET ENTRAINEMENT LIBRE */}
      {activeTab === 'banque' && (
        <div>
          {/* Mode entrainement libre actif */}
          {trainingActive ? (
            <div className="card">
              <div className="row-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>Session d'entraînement libre ({trainingQuestions.length} questions)</h3>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setTrainingActive(false)}
                >
                  Quitter l'entraînement
                </button>
              </div>

              {trainingQuestions.map((q, idx) => {
                const userAns = trainingAnswers[q.id];
                const isAnswered = Boolean(userAns);
                const isCorrect = userAns === q.correct_answer;
                const showExplanation = trainingSubmitted || (trainingModeImmediate && isAnswered);

                return (
                  <div
                    key={q.id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      marginBottom: '1rem',
                      backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    }}
                  >
                    <div className="row-between" style={{ marginBottom: '0.5rem' }}>
                      <span className="badge badge-info">Question {idx + 1} / {trainingQuestions.length}</span>
                      <span className="muted" style={{ fontSize: '0.8rem' }}>
                        {q.domain} | Difficulté : {q.difficulty}
                      </span>
                    </div>

                    <p style={{ fontWeight: 600, fontSize: '0.96rem', margin: '0.5rem 0 1rem 0' }}>
                      {q.question}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem' }}>
                      {Object.entries(q.options).map(([letter, text]) => {
                        const isChosen = userAns === letter;
                        let optionStyle = {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.6rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          backgroundColor: isChosen ? 'var(--bg-card-hover)' : 'transparent',
                        };

                        if (showExplanation) {
                          if (letter === q.correct_answer) {
                            optionStyle.border = '1px solid var(--accent-green)';
                            optionStyle.backgroundColor = 'rgba(34, 197, 94, 0.15)';
                          } else if (isChosen && !isCorrect) {
                            optionStyle.border = '1px solid var(--accent-red)';
                            optionStyle.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                          }
                        }

                        return (
                          <div
                            key={letter}
                            style={optionStyle}
                            onClick={() => {
                              if (!trainingSubmitted) {
                                setTrainingAnswers({ ...trainingAnswers, [q.id]: letter });
                              }
                            }}
                          >
                            <span className="mono" style={{ fontWeight: 700, minWidth: '24px' }}>
                              [{letter}]
                            </span>
                            <span>{text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <div
                        style={{
                          backgroundColor: '#090d16',
                          border: `1px solid ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.85rem',
                          fontSize: '0.88rem',
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: '0.35rem', color: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                          {isCorrect ? 'Bonne réponse !' : `Incorrect (votre réponse : ${userAns || 'aucune'})`} - Option correcte : {q.correct_answer}
                        </div>
                        <p style={{ margin: '0.4rem 0', whiteSpace: 'pre-line' }}>{q.explanation}</p>
                        {q.course_recommendation && (
                          <div style={{ color: 'var(--accent-amber)', fontSize: '0.82rem', marginTop: '0.4rem' }}>
                            <strong>Recommandation cours :</strong> {q.course_recommendation}
                          </div>
                        )}
                        <div className="muted" style={{ fontSize: '0.76rem', marginTop: '0.4rem' }}>
                          Source officielle : <a href={q.source_doc} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)' }}>{q.source_doc}</a> ({q.doc_date})
                        </div>

                        {!isCorrect && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleQuickAddError(q, userAns)}
                            >
                              Ajouter au Journal des erreurs
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleQuickCreateFlashcard(q)}
                            >
                              Créer Flashcard SM-2
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {!trainingSubmitted && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setTrainingSubmitted(true)}
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  Valider et terminer la session d'entraînement
                </button>
              )}
            </div>
          ) : (
            <div>
              {/* Panneau de configuration de l'entrainement libre */}
              <div className="card" style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginTop: 0 }}>Lancer une session d'entraînement libre</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  <label>
                    Nombre de questions :
                    <select
                      value={trainingCount}
                      onChange={(e) => setTrainingCount(Number(e.target.value))}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      <option value={5}>5 questions</option>
                      <option value={10}>10 questions</option>
                      <option value={15}>15 questions</option>
                      <option value={20}>20 questions</option>
                      <option value={30}>30 questions</option>
                      <option value={50}>50 questions</option>
                    </select>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                      type="checkbox"
                      checked={trainingModeImmediate}
                      onChange={(e) => setTrainingModeImmediate(e.target.checked)}
                    />
                    Correction immédiate après chaque clic
                  </label>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleStartTraining}
                    disabled={filteredQuestions.length === 0}
                  >
                    Démarrer l'entraînement ({Math.min(trainingCount, filteredQuestions.length)} q.)
                  </button>
                </div>
              </div>

              {/* Filtres de recherche dans la banque */}
              <div className="card" style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginTop: 0 }}>
                  Explorer la banque de questions {selectedCert} ({filteredQuestions.length} / {questionsBank.length})
                </h3>
                <div className="grid-3" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <label>
                    Domaine officiel :
                    <select
                      value={filterDomain}
                      onChange={(e) => setFilterDomain(e.target.value)}
                      style={{ width: '100%', marginTop: '0.2rem' }}
                    >
                      <option value="all">Tous les domaines</option>
                      {currentSpec.domains.map((d) => (
                        <option key={d.id} value={d.label}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Difficulté :
                    <select
                      value={filterDifficulty}
                      onChange={(e) => setFilterDifficulty(e.target.value)}
                      style={{ width: '100%', marginTop: '0.2rem' }}
                    >
                      <option value="all">Toutes les difficultés</option>
                      <option value="facile">Facile</option>
                      <option value="moyen">Moyen</option>
                      <option value="difficile">Difficile</option>
                    </select>
                  </label>

                  <label>
                    Recherche par mot-clé ou sujet :
                    <input
                      type="text"
                      placeholder="ex. kinesis, s3, glue, jinja..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      style={{ width: '100%', marginTop: '0.2rem' }}
                    />
                  </label>
                </div>
              </div>

              {/* Liste paginee ou deroulante des questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredQuestions.slice(0, 40).map((q) => (
                  <div key={q.id} className="card" style={{ padding: '0.85rem 1rem' }}>
                    <div className="row-between" style={{ marginBottom: '0.35rem' }}>
                      <span className="mono badge badge-info">{q.id}</span>
                      <span className="muted" style={{ fontSize: '0.78rem' }}>
                        {q.domain} | Topic : {q.topic_id} | Difficulté : {q.difficulty}
                      </span>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: '0.94rem', margin: '0.35rem 0 0.6rem 0' }}>
                      {q.question}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.4rem', marginBottom: '0.6rem' }}>
                      {Object.entries(q.options).map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            fontSize: '0.84rem',
                            padding: '0.35rem 0.5rem',
                            border: `1px solid ${k === q.correct_answer ? 'var(--accent-green)' : 'var(--border-color)'}`,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: k === q.correct_answer ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                          }}
                        >
                          <strong className="mono">[{k}]</strong> {v}
                        </div>
                      ))}
                    </div>
                    <details style={{ fontSize: '0.84rem', marginTop: '0.5rem' }}>
                      <summary style={{ cursor: 'pointer', color: 'var(--accent-blue)', fontWeight: 500 }}>
                        Afficher l'explication complète et les réfutations
                      </summary>
                      <div style={{ marginTop: '0.5rem', padding: '0.6rem', backgroundColor: '#090d16', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ whiteSpace: 'pre-line' }}>{q.explanation}</div>
                        {q.course_recommendation && (
                          <div style={{ color: 'var(--accent-amber)', marginTop: '0.4rem', fontSize: '0.8rem' }}>
                            <strong>Recommandation :</strong> {q.course_recommendation}
                          </div>
                        )}
                        <div className="muted" style={{ fontSize: '0.75rem', marginTop: '0.4rem' }}>
                          Source : <a href={q.source_doc} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)' }}>{q.source_doc}</a> ({q.doc_date})
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleQuickAddError(q, '')}
                          >
                            Ajouter au Journal des erreurs
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleQuickCreateFlashcard(q)}
                          >
                            Créer Flashcard SM-2
                          </button>
                        </div>
                      </div>
                    </details>
                  </div>
                ))}
                {filteredQuestions.length > 40 && (
                  <p className="muted" style={{ textAlign: 'center' }}>
                    Affichage limité aux 40 premières questions. Utilisez la recherche pour affiner.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SOUS-ONGLET 5 : SIMULATION EXAMEN BLANC REEL */}
      {activeTab === 'examen' && (
        <div>
          {!examActive ? (
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ marginTop: 0 }}>Simulation d'Examen Blanc Officiel : {currentSpec.name}</h2>
              <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
                <div><strong>Conditions réelles de passage :</strong></div>
                <div>• Format : 65 questions tirées au sort respectant les quotas officiels de chaque domaine.</div>
                <div>• Durée standard : {currentSpec.standardMinutes} minutes.</div>
                {currentSpec.hasEslOption && (
                  <div style={{ marginTop: '0.35rem', color: 'var(--accent-green)' }}>
                    • Aménagement ESL disponible : +30 minutes accordées pour les candidats non anglophones natifs (DEA-C01 étant uniquement en anglais, japonais, coréen et chinois).
                  </div>
                )}
                <div>• Seuil de réussite officiel : <strong>{currentSpec.officialPassScore}</strong>.</div>
                <div>• Outils disponibles : drapeau Marquer pour révision, chronomètre, bilan complet et renvois de cours.</div>
              </div>

              {currentSpec.hasEslOption && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={eslExtendedTime}
                      onChange={(e) => setEslExtendedTime(e.target.checked)}
                    />
                    <span>Activer l'aménagement officiel ESL (+30 min pour langue non maternelle, soit 160 minutes au total)</span>
                  </label>
                </div>
              )}

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStartMockExam}
                style={{ fontSize: '1rem', padding: '0.75rem 1.5rem', width: '100%' }}
              >
                Démarrer la simulation de l'examen blanc (65 questions)
              </button>
            </div>
          ) : !examSubmitted ? (
            <div>
              {/* Barre superieure d'examen avec chrono et statut */}
              <div
                className="card"
                style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                <div>
                  <span className="mono badge badge-info">{selectedCert}</span>
                  <span style={{ fontWeight: 600, marginLeft: '0.75rem' }}>
                    Question {examCurrentIndex + 1} / {examQuestions.length}
                  </span>
                  <span className="muted" style={{ marginLeft: '0.75rem', fontSize: '0.85rem' }}>
                    ({Object.keys(examAnswers).length} répondue(s) sur {examQuestions.length})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: examSecondsLeft < 600 ? 'var(--accent-red)' : 'var(--text-primary)',
                    }}
                  >
                    Temps restant : {Math.floor(examSecondsLeft / 3600).toString().padStart(2, '0')}:
                    {Math.floor((examSecondsLeft % 3600) / 60).toString().padStart(2, '0')}:
                    {(examSecondsLeft % 60).toString().padStart(2, '0')}
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (confirm('Voulez-vous vraiment soumettre votre examen maintenant ?')) {
                        setExamSubmitted(true);
                      }
                    }}
                  >
                    Terminer et soumettre
                  </button>
                </div>
              </div>

              {/* Question courante et options */}
              {examQuestions[examCurrentIndex] && (
                <div className="card" style={{ marginBottom: '1rem' }}>
                  {(() => {
                    const q = examQuestions[examCurrentIndex];
                    const isFlagged = Boolean(examFlagged[q.id]);
                    const currentAnswer = examAnswers[q.id] || '';

                    return (
                      <div>
                        <div className="row-between" style={{ marginBottom: '0.75rem' }}>
                          <span className="badge badge-secondary">{q.domain}</span>
                          <button
                            type="button"
                            className={`btn btn-sm ${isFlagged ? 'btn-danger' : 'btn-secondary'}`}
                            onClick={() => setExamFlagged({ ...examFlagged, [q.id]: !isFlagged })}
                          >
                            {isFlagged ? '🚩 Marqué pour révision' : '🏳️ Marquer pour révision'}
                          </button>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0 1.25rem 0', lineHeight: 1.5 }}>
                          {q.question}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                          {Object.entries(q.options).map(([letter, text]) => {
                            const isChosen = currentAnswer === letter;
                            return (
                              <div
                                key={letter}
                                onClick={() => setExamAnswers({ ...examAnswers, [q.id]: letter })}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  padding: '0.85rem 1rem',
                                  borderRadius: 'var(--radius-sm)',
                                  border: `2px solid ${isChosen ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                                  backgroundColor: isChosen ? 'var(--bg-card-hover)' : 'transparent',
                                  cursor: 'pointer',
                                }}
                              >
                                <span
                                  className="mono"
                                  style={{
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    color: isChosen ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                  }}
                                >
                                  [{letter}]
                                </span>
                                <span style={{ fontSize: '0.94rem' }}>{text}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Navigation entre questions */}
                        <div className="row-between">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            disabled={examCurrentIndex === 0}
                            onClick={() => setExamCurrentIndex(examCurrentIndex - 1)}
                          >
                            ← Question précédente
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={examCurrentIndex === examQuestions.length - 1}
                            onClick={() => setExamCurrentIndex(examCurrentIndex + 1)}
                          >
                            Question suivante →
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Grille de navigation des 65 questions */}
              <div className="card">
                <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Palette de navigation (65 questions)</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {examQuestions.map((q, idx) => {
                    const isCurrent = idx === examCurrentIndex;
                    const isAnswered = Boolean(examAnswers[q.id]);
                    const isFlagged = Boolean(examFlagged[q.id]);

                    let bg = 'var(--bg-input)';
                    let border = 'var(--border-color)';
                    if (isAnswered) {
                      bg = 'rgba(56, 189, 248, 0.2)';
                      border = 'var(--accent-blue)';
                    }
                    if (isFlagged) {
                      border = 'var(--accent-amber)';
                    }
                    if (isCurrent) {
                      border = '2px solid #ffffff';
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setExamCurrentIndex(idx)}
                        style={{
                          width: '38px',
                          height: '34px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: bg,
                          border,
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          color: isFlagged ? 'var(--accent-amber)' : 'var(--text-primary)',
                          fontWeight: isCurrent ? 700 : 400,
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ECRAN DE RESULTAT ET BILAN COMPLET */
            examStats && (
              <div>
                <div
                  className="card"
                  style={{
                    marginBottom: '1rem',
                    borderTop: `6px solid ${examStats.isPassed ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                    textAlign: 'center',
                    padding: '1.5rem',
                  }}
                >
                  <h2 style={{ margin: '0 0 0.5rem 0' }}>
                    {examStats.isPassed ? 'Félicitations ! Examen réussi' : 'Ajourné : score insuffisant'}
                  </h2>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0', color: examStats.isPassed ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    {examStats.scorePercent} %
                    {selectedCert !== 'DBT' && (
                      <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                        ({examStats.rawScoreCalc} / 1000)
                      </span>
                    )}
                  </div>
                  <p className="muted" style={{ fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                    Seuil de passage officiel : {currentSpec.officialPassScore}. Vous avez répondu correctement à {examStats.correctCount} question(s) sur {examStats.totalCount}.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveExamResult}
                      disabled={savedToHistory}
                    >
                      {savedToHistory ? 'Score enregistré dans l\'historique' : 'Enregistrer ce résultat dans mon historique officiel'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setExamActive(false)}
                    >
                      Retourner aux certifications
                    </button>
                  </div>
                </div>

                {/* Performance par domaine */}
                <div className="card" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ marginTop: 0 }}>Résultats détaillés par domaine officiel</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {Object.entries(examStats.domainScoresPercent).map(([dom, pct]) => {
                      const isWeak = pct < currentSpec.passScoreNumber;
                      return (
                        <div
                          key={dom}
                          style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${isWeak ? 'var(--accent-red)' : 'var(--border-color)'}`,
                            backgroundColor: isWeak ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                          }}
                        >
                          <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{dom}</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0.25rem 0', color: isWeak ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                            {pct} %
                          </div>
                          {isWeak && (
                            <div style={{ color: 'var(--accent-red)', fontSize: '0.76rem' }}>
                              Domaine faible : à retravailler en priorité
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Revue detaillee question par question */}
                <div className="card">
                  <h3 style={{ marginTop: 0 }}>Revue détaillée des 65 questions avec réfutations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {examQuestions.map((q, idx) => {
                      const userAns = examAnswers[q.id];
                      const isCorrect = userAns === q.correct_answer;

                      return (
                        <div
                          key={q.id}
                          style={{
                            border: `1px solid ${isCorrect ? 'var(--border-color)' : 'var(--accent-red)'}`,
                            borderRadius: 'var(--radius-sm)',
                            padding: '1rem',
                            backgroundColor: isCorrect ? 'transparent' : 'rgba(239, 68, 68, 0.05)',
                          }}
                        >
                          <div className="row-between" style={{ marginBottom: '0.4rem' }}>
                            <span className="badge badge-secondary">Question {idx + 1}</span>
                            <span
                              className={`badge ${isCorrect ? 'badge-success' : 'badge-danger'}`}
                            >
                              {isCorrect ? 'Correcte' : `Incorrecte (choisi : ${userAns || 'aucun'})`}
                            </span>
                          </div>

                          <p style={{ fontWeight: 600, fontSize: '0.94rem', margin: '0.4rem 0 0.75rem 0' }}>
                            {q.question}
                          </p>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                            {Object.entries(q.options).map(([letter, text]) => {
                              const isRightOpt = letter === q.correct_answer;
                              const isUserOpt = letter === userAns;
                              return (
                                <div
                                  key={letter}
                                  style={{
                                    fontSize: '0.88rem',
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '4px',
                                    border: `1px solid ${
                                      isRightOpt
                                        ? 'var(--accent-green)'
                                        : isUserOpt
                                        ? 'var(--accent-red)'
                                        : 'var(--border-color)'
                                    }`,
                                    backgroundColor: isRightOpt
                                      ? 'rgba(34, 197, 94, 0.15)'
                                      : isUserOpt
                                      ? 'rgba(239, 68, 68, 0.15)'
                                      : 'transparent',
                                  }}
                                >
                                  <strong>[{letter}]</strong> {text}
                                </div>
                              );
                            })}
                          </div>

                          <div style={{ backgroundColor: '#090d16', padding: '0.75rem', borderRadius: '4px', fontSize: '0.84rem' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--accent-blue)' }}>
                              Explication complète :
                            </div>
                            <div style={{ whiteSpace: 'pre-line' }}>{q.explanation}</div>

                            {q.course_recommendation && (
                              <div style={{ color: 'var(--accent-amber)', marginTop: '0.4rem', fontSize: '0.82rem' }}>
                                <strong>Leçon(s) à réviser :</strong> {q.course_recommendation}
                              </div>
                            )}

                            <div className="muted" style={{ fontSize: '0.74rem', marginTop: '0.4rem' }}>
                              Documentation : <a href={q.source_doc} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)' }}>{q.source_doc}</a> ({q.doc_date})
                            </div>

                            {!isCorrect && (
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => handleQuickAddError(q, userAns)}
                                >
                                  Ajouter au Journal des erreurs
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => handleQuickCreateFlashcard(q)}
                                >
                                  Créer Flashcard SM-2
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
