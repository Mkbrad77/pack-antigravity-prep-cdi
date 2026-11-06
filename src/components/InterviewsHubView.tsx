import React, { useEffect, useState } from 'react';
import { BookText, Database, FileCode2, Target } from 'lucide-react';
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
  onSubTabChange?: (tab: InterviewSubTab) => void;
  initialCategory?: 'python' | 'sql' | 'de' | 'aie' | 'fiches_ml' | 'fiches_software';
  initialCourseId?: string;
  initialSearchQuery?: string;
  initialExerciseIds?: string[];
  activeTaskLabel?: string;
  navigationNonce?: number;
}

const SUB_TABS: Array<{ id: InterviewSubTab; label: string; Icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>; count: string }> = [
  { id: 'courses', label: "Cours d'entretien", Icon: BookText, count: '59' },
  { id: 'sql', label: 'SQL', Icon: Database, count: '105' },
  { id: 'python', label: 'Python', Icon: FileCode2, count: '70' },
  { id: 'simulator', label: 'Simulateur', Icon: Target, count: '309' },
];

export const InterviewsHubView: React.FC<InterviewsHubViewProps> = ({
  initialSubTab = 'courses',
  onSubTabChange,
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

  const select = (tab: InterviewSubTab) => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
  };

  return (
    <div className="interview-hub" data-testid="pratique-view">
      <div className="interview-subnav">
        <div className="segmented" role="tablist" aria-label="Sections de la pratique">
          {SUB_TABS.map(({ id, label, Icon, count }) => {
            const isActive = activeSubTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-testid={`interview-subtab-${id}`}
                onClick={() => select(id)}
                className="segment"
              >
                <Icon size={18} aria-hidden />
                <span>{label}</span>
                <span className="segment-count">{count}</span>
              </button>
            );
          })}
        </div>
        <span className="muted small hide-mobile">Priorité 1 : Data Engineer, priorité 2 : AI Engineer</span>
      </div>

      <div role="tabpanel">
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
