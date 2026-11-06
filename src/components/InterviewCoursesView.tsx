import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Clock, Search } from 'lucide-react';
import {
  fetchInterviewCoursesManifest,
  fetchInterviewCourseContent,
  InterviewCoursesManifestResponse,
} from '../apiClient';
import { InterviewCourseMeta } from '../domain/types';
import { InterviewCourseCategory } from '../domain/taskNavigation';
import { MarkdownViewer } from './MarkdownViewer';
import { MOBILE_QUERY, useMediaQuery } from '../ui/useMediaQuery';

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
  { label: string; shortModule: string; count: number }
> = {
  python: {
    label: 'Module 1 : Python Data & IA',
    shortModule: 'Module 1 : Python',
    count: 13,
  },
  sql: {
    label: 'Module 2 : SQL Avancé & Optimisation',
    shortModule: 'Module 2 : SQL Avancé',
    count: 14,
  },
  de: {
    label: 'Module 3 : Data Engineering & System Design',
    shortModule: 'Module 3 : Data Eng.',
    count: 12,
  },
  aie: {
    label: 'Module 4 : AI Engineering, LLM & RAG',
    shortModule: 'Module 4 : AI & LLM',
    count: 10,
  },
  fiches_ml: {
    label: 'Module 5 : Fiches ML Essentials',
    shortModule: 'Module 5 : ML',
    count: 5,
  },
  fiches_software: {
    label: 'Module 6 : Software Engineering & DevOps',
    shortModule: 'Module 6 : DevOps',
    count: 5,
  },
};

interface InterviewCoursesViewProps {
  initialCategory?: InterviewCourseCategory;
  initialCourseId?: string;
  initialSearchQuery?: string;
  /** Change a chaque navigation externe (lien depuis une autre vue) pour re-cibler le cours. */
  navigationNonce?: number;
}

export const InterviewCoursesView: React.FC<InterviewCoursesViewProps> = ({
  initialCategory = 'python',
  initialCourseId,
  initialSearchQuery = '',
  navigationNonce,
}) => {
  const [manifest, setManifest] = useState<InterviewCoursesManifestResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState<InterviewCourseCategory>(initialCategory);
  const [selectedCourse, setSelectedCourse] = useState<InterviewCourseMeta | null>(null);
  const [courseContent, setCourseContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [listOpen, setListOpen] = useState<boolean>(!initialCourseId);
  const readerRef = useRef<HTMLElement | null>(null);

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

  // Navigation externe alors que la vue est deja ouverte : on re-cible categorie et chapitre
  useEffect(() => {
    if (!manifest || navigationNonce === undefined) return;
    selectCategoryAndCourse(manifest, initialCategory || 'python', initialCourseId);
    if (initialSearchQuery) setSearchQuery(initialSearchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationNonce]);

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

  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="muted">Chargement des cours d'entretien…</p>
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

  const courseList = (
    <div className="stack-sm">
      <label className="sr-only" htmlFor="interview-course-search">Rechercher un chapitre</label>
      <div style={{ position: 'relative' }}>
        <Search size={16} aria-hidden style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          id="interview-course-search"
          type="search"
          placeholder="Chapitre (1.1, 2.7) ou tâche (W01-I1)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
          style={{ paddingLeft: '2.1rem' }}
        />
      </div>
      <div className="item-list-container" role="list" aria-label={`Chapitres : ${CATEGORY_NAMES[activeCategory]?.label}`}>
        {filteredCourses.length === 0 ? (
          <div className="empty-state small">Aucun chapitre trouvé pour ce filtre.</div>
        ) : (
          filteredCourses.map((c) => {
            const isSelected = selectedCourse?.id === c.id;
            const taskTags = (c.tags || []).filter((t) => /^W\d+-I\d+$/i.test(t));
            return (
              <div role="listitem" key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectCourse(c, activeCategory);
                    if (isMobile) {
                      setListOpen(false);
                      window.setTimeout(() => readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                    }
                  }}
                  className={`item-card ${isSelected ? 'selected' : ''}`}
                  aria-current={isSelected ? 'true' : undefined}
                >
                  <span className="row-between small" style={{ width: '100%' }}>
                    <span className="mono" style={{ fontWeight: 700, color: 'var(--accent-indigo)' }}>
                      Chap. {c.num}
                    </span>
                    <span className="cluster" style={{ gap: '0.35rem' }}>
                      {taskTags.map((tt) => (
                        <span key={tt} className="badge badge-info mono">
                          {tt}
                        </span>
                      ))}
                      <span className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={13} aria-hidden /> {c.durationMin} min
                      </span>
                    </span>
                  </span>
                  <span style={{ fontWeight: isSelected ? 650 : 500, lineHeight: 1.4 }}>{c.title}</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="stack">
      <div>
        <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem' }}>Cours d'entretien</h2>
        <p className="muted small" style={{ margin: '0 0 0.75rem' }}>
          59 chapitres alignés sur tes tâches hebdomadaires, en 6 modules.
        </p>
        <div className="chips scroll" role="group" aria-label="Modules">
          {CATEGORY_ORDER.map((cat) => {
            const info = CATEGORY_NAMES[cat];
            const isActive = activeCategory === cat;
            const dynamicCount = getCoursesForCategory(cat).length || info.count;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActiveCategory(cat);
                  setListOpen(true);
                  const first = getCoursesForCategory(cat)[0];
                  if (first) {
                    handleSelectCourse(first, cat);
                  }
                }}
                className="chip"
              >
                <span>{info.shortModule}</span>
                <span className="mono muted">{dynamicCount}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="interview-grid">
        {isMobile ? (
          <details className="disclosure" open={listOpen} onToggle={(e) => setListOpen((e.currentTarget as HTMLDetailsElement).open)}>
            <summary>
              {CATEGORY_NAMES[activeCategory]?.label}
              <span className="badge badge-neutral">{filteredCourses.length}</span>
              <ChevronDown size={18} className="chevron" aria-hidden />
            </summary>
            <div className="disclosure-body">{courseList}</div>
          </details>
        ) : (
          <div className="card" style={{ position: 'sticky', top: 'calc(var(--topbar-height) + 1rem)' }}>
            <div className="eyebrow" style={{ marginBottom: '0.6rem' }}>{CATEGORY_NAMES[activeCategory]?.label}</div>
            {courseList}
          </div>
        )}

        <article ref={readerRef} className="card" style={{ padding: isMobile ? '1.1rem' : '1.75rem', minHeight: '400px', scrollMarginTop: '72px' }}>
          {loadingContent ? (
            <p className="muted" role="status" style={{ padding: '2rem', textAlign: 'center' }}>Chargement du chapitre…</p>
          ) : selectedCourse ? (
            <div className="stack-sm">
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.9rem', marginBottom: '0.5rem' }}>
                <div className="row-between small" style={{ marginBottom: '0.4rem' }}>
                  <span className="eyebrow">
                    {CATEGORY_NAMES[activeCategory]?.shortModule}, chapitre {selectedCourse.num}
                  </span>
                  <span className="muted">
                    Niveau <strong style={{ color: 'var(--text-primary)' }}>{selectedCourse.level}</strong>, lecture{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>{selectedCourse.durationMin} min</strong>
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', lineHeight: 1.35 }}>{selectedCourse.title}</h3>
              </div>
              <MarkdownViewer content={courseContent} headingOffset={2} />
            </div>
          ) : (
            <p className="muted" style={{ padding: '2rem', textAlign: 'center' }}>
              Choisis un chapitre pour l'afficher.
            </p>
          )}
        </article>
      </div>
    </div>
  );
};
