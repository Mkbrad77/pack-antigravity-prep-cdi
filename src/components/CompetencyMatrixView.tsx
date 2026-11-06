import React, { useEffect, useState } from 'react';
import { fetchCompetenciesStatus } from '../apiClient';
import { CompetencyStatus } from '../domain/types';

interface CompetencyDef {
  id: string;
  domain: 'DE' | 'AIE' | 'COMMON';
  name: string;
  description: string;
  recommendedCategory: string;
}

const ALL_COMPETENCIES: CompetencyDef[] = [
  // Data Engineering
  {
    id: 'sql_analytics',
    domain: 'DE',
    name: 'SQL Analytique & Fonctions de fenetrage',
    description: 'Maitrise des ROW_NUMBER, RANK, LAG/LEAD, agregation glissante et anti-joins.',
    recommendedCategory: 'sql',
  },
  {
    id: 'sql_modeling',
    domain: 'DE',
    name: 'Modelisation dimensionnelle & Kimball',
    description: 'Tables de faits, dimensions a variation lente (SCD Type 1/2), schemas en etoile.',
    recommendedCategory: 'sql',
  },
  {
    id: 'python_pandas_polars',
    domain: 'DE',
    name: 'Manipulation de donnees Python (Pandas & Polars)',
    description: 'Transformations vectorisees, groupby, gestion des types et de la memoire.',
    recommendedCategory: 'python_pandas_polars',
  },
  {
    id: 'python_distributed',
    domain: 'DE',
    name: 'Calcul distribue & Spark',
    description: 'Partitionnement, avoidance des shuffles, optimisation des joins broadcastees.',
    recommendedCategory: 'python_distributed',
  },
  {
    id: 'de_lakehouse',
    domain: 'DE',
    name: 'Architecture Lakehouse & Formats ouverts',
    description: 'Apache Iceberg, Delta Lake, Parquet, ACID transactions sur S3.',
    recommendedCategory: 'cours_de',
  },
  {
    id: 'de_dbt',
    domain: 'DE',
    name: 'Transformations dbt & Tests de donnees',
    description: 'Modeles ref(), sources, tests generiques, tests singuliers et snapshots.',
    recommendedCategory: 'cours_de',
  },
  {
    id: 'de_streaming',
    domain: 'DE',
    name: 'Ingestion en continu & Streaming (Kafka, Kinesis)',
    description: 'Semantiques de livraison (at-least-once, exactly-once), fenetrage temporel.',
    recommendedCategory: 'cours_de',
  },
  {
    id: 'de_data_quality',
    domain: 'DE',
    name: 'Data Quality & Circuit Breakers',
    description: 'Detection d anomalies en amont, circuit breakers, fraicheur des donnees.',
    recommendedCategory: 'cours_de',
  },
  {
    id: 'de_cloud_aws',
    domain: 'DE',
    name: 'Services Cloud AWS Data (S3, Glue, Athena, Redshift)',
    description: 'Architecture serveur, IAM, KMS, optimisation des requetes Athena/Redshift.',
    recommendedCategory: 'cours_de',
  },

  // AI Engineering & LLM
  {
    id: 'aie_rag',
    domain: 'AIE',
    name: 'Architecture RAG & Vector Search',
    description: 'Chunking adapte, recherche hybride (BM25 + Dense), reranking et recuperation.',
    recommendedCategory: 'python_rag_embeddings',
  },
  {
    id: 'aie_embeddings',
    domain: 'AIE',
    name: 'Modeles d Embeddings & Similarite semantique',
    description: 'Cosine similarity, dimensionnalite, index HNSW et compromis precision/latence.',
    recommendedCategory: 'python_rag_embeddings',
  },
  {
    id: 'aie_finetuning',
    domain: 'AIE',
    name: 'Fine-tuning & Adaptation de modeles (LoRA, QLoRA)',
    description: 'PEFT, adaptation par bas rang, quantification 4-bit, instruction tuning.',
    recommendedCategory: 'cours_aie',
  },
  {
    id: 'aie_serving',
    domain: 'AIE',
    name: 'Servabilite & Inference LLM (vLLM, PagedAttention)',
    description: 'KV Cache, continuous batching, quantisation FP8/AWQ, latence TTFT vs TPS.',
    recommendedCategory: 'cours_aie',
  },
  {
    id: 'aie_evaluation',
    domain: 'AIE',
    name: 'Evaluation des LLM (RAGAS, Hallucinations)',
    description: 'Fidelite, pertinence de la reponse, metriques semantiques sans verite terrain.',
    recommendedCategory: 'cours_aie',
  },
  {
    id: 'aie_guardrails',
    domain: 'AIE',
    name: 'Securite des LLM & Guardrails',
    description: 'Protection contre l injection de prompt, filtrage PII et controle des sorties.',
    recommendedCategory: 'cours_aie',
  },
  {
    id: 'aie_agents',
    domain: 'AIE',
    name: 'Agents autonomes & Function Calling (ReAct)',
    description: 'Boucle raisonnement-action, appel d outils JSON et gestion d etat.',
    recommendedCategory: 'cours_aie',
  },

  // Fondamentaux & Software Engineering
  {
    id: 'python_algo_data',
    domain: 'COMMON',
    name: 'Algorithmique & Structures de donnees Python',
    description: 'Complexite O(N), hash maps, tas (heap), deux pointeurs, parcours de graphes.',
    recommendedCategory: 'python_algo_data',
  },
  {
    id: 'python_concurrency',
    domain: 'COMMON',
    name: 'Concurrence & Asynchronisme (asyncio, threads)',
    description: 'Event loop, coroutines, thread pool pour I/O bound vs multi-process pour CPU.',
    recommendedCategory: 'python_concurrency',
  },
  {
    id: 'software_engineering',
    domain: 'COMMON',
    name: 'Pratiques Software Engineering (Tests, CI/CD, Git)',
    description: 'Tests unitaires, fixtures, typage strict, Clean Architecture et observabilite.',
    recommendedCategory: 'cours_software',
  },
  {
    id: 'system_design_architecture',
    domain: 'COMMON',
    name: 'System Design & Conception d Architecture Data/AI',
    description: 'Dimensionnement, arbitrages batch vs streaming, haute disponibilite, SLA, couts et gouvernance.',
    recommendedCategory: 'simulateur',
  },
];

export const CompetencyMatrixView: React.FC = () => {
  const [competenciesStatus, setCompetenciesStatus] = useState<Record<string, CompetencyStatus>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [filterDomain, setFilterDomain] = useState<'ALL' | 'DE' | 'AIE' | 'COMMON'>('ALL');

  useEffect(() => {
    fetchCompetenciesStatus()
      .then((status) => {
        setCompetenciesStatus(status);
      })
      .catch((err) => {
        console.error('Erreur chargement competences :', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = ALL_COMPETENCIES.filter((c) => {
    if (filterDomain === 'ALL') return true;
    return c.domain === filterDomain;
  });

  // Calcul du taux de reussite
  const masteredCount = ALL_COMPETENCIES.filter((c) => competenciesStatus[c.id]?.isMastered).length;
  const inProgressCount = ALL_COMPETENCIES.filter((c) => {
    const s = competenciesStatus[c.id];
    return s && !s.isMastered && s.totalAttempts > 0;
  }).length;
  const notStartedCount = ALL_COMPETENCIES.length - masteredCount - inProgressCount;
  const masteredPercent = Math.round((masteredCount / ALL_COMPETENCIES.length) * 100);

  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="muted">Chargement de la matrice de competences...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* En-tete */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📊</span>
              <span>Matrice de Validation des Competences Cles</span>
            </h2>
            <div className="muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Suivi objectif de maitrise des 20 competences requises pour decrocher un CDI Data Engineer ou AI Engineer.
            </div>
          </div>

          {/* Indicateurs globaux */}
          <div className="badge badge-neutral" style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}>
            <span className="muted" style={{ marginRight: '0.4rem' }}>Progression globale :</span>
            <strong style={{ color: 'var(--accent-blue)' }}>
              {masteredCount} / {ALL_COMPETENCIES.length} validees ({masteredPercent} %)
            </strong>
          </div>
        </div>
      </div>

      {/* Regle absolue de validation */}
      <div className="callout callout-info" style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>
        <strong>Regle de validation des competences :</strong> Une competence est officiellement marquee comme{' '}
        <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Validee</span> uniquement si tu totalises{' '}
        <strong>au moins 3 reussites</strong> reparties sur <strong>au moins 2 sessions distinctes d entrainement</strong>.
        Cette exigence garantit un reel ancrage memoriel dans le temps, sans bachotage ephereme.
      </div>

      {/* Barre d onglets de filtrage */}
      <div className="card" style={{ padding: '0.75rem 1rem' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => setFilterDomain('ALL')}
              className={`btn btn-sm ${filterDomain === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Toutes ({ALL_COMPETENCIES.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterDomain('DE')}
              className={`btn btn-sm ${filterDomain === 'DE' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Data Engineering (9)
            </button>
            <button
              type="button"
              onClick={() => setFilterDomain('AIE')}
              className={`btn btn-sm ${filterDomain === 'AIE' ? 'btn-primary' : 'btn-secondary'}`}
            >
              AI Engineer & LLM (7)
            </button>
            <button
              type="button"
              onClick={() => setFilterDomain('COMMON')}
              className={`btn btn-sm ${filterDomain === 'COMMON' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Algorithmique, Software & System Design (4)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', display: 'inline-block' }}></span>
              <span className="muted">Validees : <strong style={{ color: 'var(--text-primary)' }}>{masteredCount}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-amber)', display: 'inline-block' }}></span>
              <span className="muted">En cours : <strong style={{ color: 'var(--text-primary)' }}>{inProgressCount}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', display: 'inline-block' }}></span>
              <span className="muted">A demarrer : <strong style={{ color: 'var(--text-primary)' }}>{notStartedCount}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Grille des competences */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filtered.map((comp) => {
          const status = competenciesStatus[comp.id];
          const isMastered = status?.isMastered ?? false;
          const attempts = status?.totalAttempts ?? 0;
          const successes = status?.successCount ?? 0;
          const sessions = status?.distinctSessions ?? 0;

          let cardBorder = '1px solid var(--border-color)';
          let cardBg = 'var(--bg-card)';
          if (isMastered) {
            cardBorder = '1px solid rgba(34, 197, 94, 0.4)';
            cardBg = 'rgba(34, 197, 94, 0.06)';
          } else if (attempts > 0) {
            cardBorder = '1px solid rgba(245, 158, 11, 0.4)';
            cardBg = 'rgba(245, 158, 11, 0.05)';
          }

          return (
            <div
              key={comp.id}
              className="card"
              style={{
                padding: '1.25rem',
                border: cardBorder,
                backgroundColor: cardBg,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div className="row-between" style={{ alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span
                    className="badge badge-neutral"
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: comp.domain === 'DE' ? 'var(--accent-blue)' : comp.domain === 'AIE' ? 'var(--accent-indigo)' : 'var(--text-muted)',
                    }}
                  >
                    {comp.domain === 'DE' ? 'Data Engineering' : comp.domain === 'AIE' ? 'AI Engineer' : 'Transverse'}
                  </span>

                  {isMastered ? (
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                      ✓ Validee
                    </span>
                  ) : attempts > 0 ? (
                    <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                      En cours ({successes}/3)
                    </span>
                  ) : (
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      A demarrer
                    </span>
                  )}
                </div>

                <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{comp.name}</h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{comp.description}</p>
              </div>

              {/* Jauge d ancrage memoriel */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem' }}>
                <div className="row-between" style={{ fontSize: '0.75rem' }}>
                  <span className="muted">Critere : 3 reussites sur 2 sessions</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {successes}/3 reussites | {sessions}/2 sessions
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    height: '6px',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: isMastered ? 'var(--accent-green)' : successes > 0 ? 'var(--accent-amber)' : 'transparent',
                      width: `${Math.min(100, Math.round(((Math.min(successes, 3) + Math.min(sessions, 2)) / 5) * 100))}%`,
                      transition: 'width 0.3s ease',
                    }}
                  ></div>
                </div>

                {status?.lastRecordedAt && (
                  <div className="muted" style={{ fontSize: '0.72rem' }}>
                    Derniere pratique : {new Date(status.lastRecordedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
