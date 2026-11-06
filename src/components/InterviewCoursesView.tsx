import React, { useEffect, useState } from 'react';
import {
  fetchInterviewCoursesManifest,
  fetchInterviewCourseContent,
  InterviewCoursesManifestResponse,
} from '../apiClient';
import { InterviewCourseMeta } from '../domain/types';
import { InterviewCourseCategory } from '../domain/taskNavigation';

const CATEGORY_ORDER: InterviewCourseCategory[] = [
  'python',
  'sql',
  'de',
  'aie',
  'fiches_ml',
  'fiches_software',
];

const CATEGORY_NAMES: Record<
  InterviewCourseCategory,
  { label: string; shortModule: string; icon: string; count: number }
> = {
  python: {
    label: 'Module 1 : Python Data & IA',
    shortModule: 'Module 1 : Python',
    icon: '🐍',
    count: 13,
  },
  sql: {
    label: 'Module 2 : SQL Avancé & Optimisation',
    shortModule: 'Module 2 : SQL Avancé',
    icon: '🗄️',
    count: 14,
  },
  de: {
    label: 'Module 3 : Data Engineering & System Design',
    shortModule: 'Module 3 : Data Eng.',
    icon: '🏗️',
    count: 12,
  },
  aie: {
    label: 'Module 4 : AI Engineering, LLM & RAG',
    shortModule: 'Module 4 : AI & LLM',
    icon: '🤖',
    count: 10,
  },
  fiches_ml: {
    label: 'Module 5 : Fiches ML Essentials',
    shortModule: 'Module 5 : ML',
    icon: '🧠',
    count: 5,
  },
  fiches_software: {
    label: 'Module 6 : Software Engineering & DevOps',
    shortModule: 'Module 6 : DevOps',
    icon: '⚙️',
    count: 5,
  },
};

interface InterviewCoursesViewProps {
  initialCategory?: InterviewCourseCategory;
  initialCourseId?: string;
  initialSearchQuery?: string;
}

export const InterviewCoursesView: React.FC<InterviewCoursesViewProps> = ({
  initialCategory = 'python',
  initialCourseId,
  initialSearchQuery = '',
}) => {
  const [manifest, setManifest] = useState<InterviewCoursesManifestResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState<InterviewCourseCategory>(initialCategory);
  const [selectedCourse, setSelectedCourse] = useState<InterviewCourseMeta | null>(null);
  const [courseContent, setCourseContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  const selectCategoryAndCourse = (
    data: InterviewCoursesManifestResponse,
    cat: InterviewCourseCategory,
    targetCourseId?: string
  ) => {
    const catList = data.categories[cat] || data.categories.python || data.categories.de || [];
    setActiveCategory(cat);
    if (catList.length > 0) {
      const found = targetCourseId ? catList.find((c) => c.id === targetCourseId) : undefined;
      const chosen = found || catList[0];
      setSelectedCourse(chosen);
      loadContent(cat, chosen.id);
    }
  };

  useEffect(() => {
    fetchInterviewCoursesManifest()
      .then((data) => {
        setManifest(data);
        const startCat = initialCategory || 'python';
        selectCategoryAndCourse(data, startCat, initialCourseId);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (manifest && initialCategory) {
      selectCategoryAndCourse(manifest, initialCategory, initialCourseId);
    }
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialCategory, initialCourseId, initialSearchQuery, manifest]);

  const loadContent = async (category: string, id: string) => {
    setLoadingContent(true);
    try {
      const data = await fetchInterviewCourseContent(category, id);
      setCourseContent(data.content);
    } catch (err) {
      setCourseContent(
        `Erreur de chargement du cours : ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoadingContent(false);
    }
  };

  const handleSelectCourse = (course: InterviewCourseMeta, category: InterviewCourseCategory) => {
    setSelectedCourse(course);
    loadContent(category, course.id);
  };

  const getCoursesForCategory = (cat: InterviewCourseCategory): InterviewCourseMeta[] => {
    if (!manifest) return [];
    return manifest.categories[cat] || [];
  };

  const filteredCourses = getCoursesForCategory(activeCategory).filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.num.toLowerCase().includes(q) ||
      c.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Rendu Markdown enrichi avec support des tableaux et blocs de code
  const renderMarkdown = (md: string) => {
    if (!md) return null;
    const lines = md.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = '';
    let tableRows: string[][] = [];

    const flushTable = (keyIdx: number) => {
      if (tableRows.length === 0) return;
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(1).filter((r) => !r.every((cell) => /^[-:\s]+$/.test(cell)));
      elements.push(
        <div key={`table-${keyIdx}`} style={{ overflowX: 'auto', margin: '1rem 0' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.84rem',
              border: '1px solid var(--border-color)',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                {headerRow.map((cell, cIdx) => (
                  <th
                    key={cIdx}
                    style={{
                      padding: '0.55rem 0.75rem',
                      border: '1px solid var(--border-color)',
                      textAlign: 'left',
                      color: 'var(--accent-blue)',
                      fontWeight: 700,
                    }}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    backgroundColor: rIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Blocs de code
      if (line.trim().startsWith('```')) {
        flushTable(i);
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLang = line.trim().replace('```', '');
          codeBlockContent = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={`code-${i}`} style={{ margin: '1rem 0' }}>
              {codeBlockLang && (
                <div
                  className="mono"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderBottom: 'none',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    color: 'var(--accent-blue)',
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  }}
                >
                  {codeBlockLang}
                </div>
              )}
              <pre
                className="code-terminal-box"
                style={{
                  margin: 0,
                  borderRadius: codeBlockLang
                    ? '0 0 var(--radius-sm) var(--radius-sm)'
                    : 'var(--radius-sm)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {codeBlockContent.join('\n')}
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Tableaux Markdown
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const cells = line
          .trim()
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        tableRows.push(cells);
        continue;
      } else if (tableRows.length > 0) {
        flushTable(i);
      }

      // Titres
      if (line.startsWith('# ')) {
        elements.push(
          <h1
            key={i}
            style={{
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.5rem',
              marginTop: '1.25rem',
            }}
          >
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={i}
            style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span
              style={{
                width: '4px',
                height: '1.2rem',
                backgroundColor: 'var(--accent-indigo)',
                borderRadius: '2px',
                display: 'inline-block',
              }}
            ></span>
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} style={{ color: 'var(--accent-blue)', marginTop: '1rem' }}>
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={i}
            className="callout callout-info"
            style={{ margin: '0.75rem 0', fontStyle: 'italic' }}
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <li
            key={i}
            style={{
              marginLeft: '1.25rem',
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              color: 'var(--text-secondary)',
            }}
          >
            {line.trim().replace(/^[-*]\s+/, '')}
          </li>
        );
      } else if (/^\d+\.\s+/.test(line.trim())) {
        elements.push(
          <li
            key={i}
            style={{
              marginLeft: '1.25rem',
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              color: 'var(--text-secondary)',
            }}
          >
            {line.trim().replace(/^\d+\.\s+/, '')}
          </li>
        );
      } else if (line.trim() === '---') {
        elements.push(
          <hr key={i} style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />
        );
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={i} style={{ margin: '0.6rem 0', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            {line}
          </p>
        );
      }
    }

    flushTable(lines.length);
    return elements;
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="muted">Chargement des cours d entretien...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="callout callout-warning">
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Erreur</h3>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* En-tete */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>📚</span>
              <span>Programme Entretiens : Cours Complets & Fiches Mémo (Modules 1 à 6)</span>
            </h2>
            <div className="muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              59 chapitres alignés sur tes tâches hebdomadaires : Module 1 (Python), Module 2 (SQL
              Avancé), Module 3 (Data Engineering), Module 4 (AI & LLM), Module 5 (ML) et Module 6
              (Software & DevOps).
            </div>
          </div>

          {/* Onglets des 6 Modules */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {CATEGORY_ORDER.map((cat) => {
              const info = CATEGORY_NAMES[cat];
              const isActive = activeCategory === cat;
              const dynamicCount = getCoursesForCategory(cat).length || info.count;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    const first = getCoursesForCategory(cat)[0];
                    if (first) {
                      handleSelectCourse(first, cat);
                    }
                  }}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>{info.icon}</span>
                  <span>{info.shortModule}</span>
                  <span
                    className="badge badge-neutral"
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.35rem',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : undefined,
                    }}
                  >
                    {dynamicCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Disposition principale */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(310px, 1fr) minmax(480px, 2.1fr)',
          gap: '1rem',
          alignItems: 'start',
        }}
      >
        {/* Barre laterale de selection */}
        <div
          className="card"
          style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
            {CATEGORY_NAMES[activeCategory]?.icon} {CATEGORY_NAMES[activeCategory]?.label}
          </div>
          <input
            type="text"
            placeholder="Rechercher par chapitre (ex: 1.1, 2.7), tâche (W01-I1)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
            }}
          />

          <div
            className="item-list-container"
            style={{ maxHeight: 'calc(100vh - 280px)', minHeight: '420px' }}
          >
            {filteredCourses.length === 0 ? (
              <div
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                }}
              >
                Aucun chapitre trouvé pour ce filtre.
              </div>
            ) : (
              filteredCourses.map((c) => {
                const isSelected = selectedCourse?.id === c.id;
                const taskTags = (c.tags || []).filter((t) => /^W\d+-I\d+$/i.test(t));
                const otherTags = (c.tags || []).filter((t) => !/^W\d+-I\d+$/i.test(t));
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCourse(c, activeCategory)}
                    className={`item-card ${isSelected ? 'selected' : ''}`}
                    style={{ cursor: 'pointer', padding: '0.65rem 0.8rem' }}
                  >
                    <div
                      className="row-between"
                      style={{ fontSize: '0.78rem', marginBottom: '0.25rem' }}
                    >
                      <span
                        className="mono"
                        style={{ fontWeight: 700, color: 'var(--accent-blue)' }}
                      >
                        Chap. {c.num}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {taskTags.map((tt) => (
                          <span
                            key={tt}
                            className="badge badge-info mono"
                            style={{ fontSize: '0.68rem', padding: '0.05rem 0.35rem' }}
                          >
                            {tt}
                          </span>
                        ))}
                        <span className="muted">⏱️ {c.durationMin} min</span>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                        lineHeight: 1.35,
                      }}
                    >
                      {c.title}
                    </div>
                    {otherTags.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.3rem',
                          marginTop: '0.4rem',
                        }}
                      >
                        {otherTags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="badge badge-neutral mono"
                            style={{ fontSize: '0.68rem' }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Zone de lecture du cours */}
        <div className="card" style={{ padding: '1.5rem', minHeight: '500px' }}>
          {loadingContent ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p className="muted">Chargement du chapitre...</p>
            </div>
          ) : selectedCourse ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* En-tete du document */}
              <div
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '1rem',
                }}
              >
                <div
                  className="row-between"
                  style={{
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      color: 'var(--accent-blue)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {CATEGORY_NAMES[activeCategory]?.label} | Chapitre {selectedCourse.num}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="muted">
                    <span>
                      Niveau :{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>{selectedCourse.level}</strong>
                    </span>
                    <span>
                      Lecture :{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {selectedCourse.durationMin} min
                      </strong>
                    </span>
                  </div>
                </div>
                <h1 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                  {selectedCourse.title}
                </h1>
              </div>

              {/* Contenu Markdown */}
              <div className="markdown-view">{renderMarkdown(courseContent)}</div>
            </div>
          ) : (
            <div className="muted" style={{ padding: '3rem', textAlign: 'center' }}>
              Sélectionne un chapitre dans la colonne de gauche pour l afficher.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
