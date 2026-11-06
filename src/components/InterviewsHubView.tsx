import React, { useEffect, useState } from 'react';
import { SqlEditorView } from './SqlEditorView';
import { PythonEditorView } from './PythonEditorView';
import { InterviewCoursesView } from './InterviewCoursesView';
import { InterviewSimulatorView } from './InterviewSimulatorView';
import { CompetencyMatrixView } from './CompetencyMatrixView';

export type InterviewSubTab =
  | 'courses'
  | 'sql'
  | 'python'
  | 'simulator'
  | 'competencies';

interface InterviewsHubViewProps {
  initialSubTab?: InterviewSubTab;
  initialCategory?: 'python' | 'sql' | 'de' | 'aie' | 'fiches_ml' | 'fiches_software';
  initialCourseId?: string;
  initialSearchQuery?: string;
  initialExerciseIds?: string[];
  activeTaskLabel?: string;
  navigationNonce?: number;
}

export const InterviewsHubView: React.FC<InterviewsHubViewProps> = ({
  initialSubTab = 'courses',
  initialCategory,
  initialCourseId,
  initialSearchQuery,
  initialExerciseIds,
  activeTaskLabel,
  navigationNonce,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<InterviewSubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab, navigationNonce]);

  const subTabs: Array<{ id: InterviewSubTab; label: string; icon: string; countBadge?: string }> = [
    { id: 'courses', label: '1. Cours & Fiches mémo (Modules 1 à 6)', icon: '📚', countBadge: '59 cours' },
    { id: 'sql', label: '2. Entraînement SQL', icon: '🗄️', countBadge: '105 ex.' },
    { id: 'python', label: '3. Entraînement Python', icon: '🐍', countBadge: '70 ex.' },
    { id: 'simulator', label: '4. Simulateur Technique', icon: '🎯', countBadge: '309 questions' },
    { id: 'competencies', label: '5. Matrice de Compétences', icon: '📊', countBadge: '20 comp.' },
  ];

  return (
    <div className="interview-hub">
      {/* Barre de navigation des sous-onglets d'entretien */}
      <div className="interview-subnav">
        <div className="interview-subnav-tabs">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`interview-subtab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id)}
                className={`interview-subnav-btn ${isActive ? 'active' : ''}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.countBadge && (
                  <span className="interview-badge">
                    {tab.countBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="badge badge-neutral" style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}>
          Priorité 1 : Data Engineer | Priorité 2 : AI Engineer
        </div>
      </div>

      {/* Contenu actif */}
      <div>
        {activeSubTab === 'courses' && (
          <InterviewCoursesView
            initialCategory={initialCategory}
            initialCourseId={initialCourseId}
            initialSearchQuery={initialSearchQuery}
            navigationNonce={navigationNonce}
          />
        )}
        {activeSubTab === 'sql' && (
          <SqlEditorView
            initialExerciseIds={initialExerciseIds}
            activeTaskLabel={activeTaskLabel}
            navigationNonce={navigationNonce}
          />
        )}
        {activeSubTab === 'python' && (
          <PythonEditorView
            initialExerciseIds={initialExerciseIds}
            activeTaskLabel={activeTaskLabel}
            navigationNonce={navigationNonce}
          />
        )}
        {activeSubTab === 'simulator' && <InterviewSimulatorView />}
        {activeSubTab === 'competencies' && <CompetencyMatrixView />}
      </div>
    </div>
  );
};
