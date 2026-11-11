import React from 'react';
import { AppStateResponse } from '../apiClient';
import { CertCode } from '../domain/types';
import { TaskNavigationTarget } from '../domain/taskNavigation';
import { CERT_PHASES } from '../domain/phases';
import { certColor, CoursSection } from '../ui/navigation';
import { CertificationsView } from './CertificationsView';
import { CoursesView } from './CoursesView';

interface CoursHubViewProps {
  state: AppStateResponse;
  section: CoursSection;
  onSectionChange: (section: CoursSection) => void;
  onRefreshState: (next: AppStateResponse) => void;
  navTarget: TaskNavigationTarget | null;
  navigationNonce: number;
}

const SECTIONS: Array<{ id: CoursSection; label: string; hint: string }> = [
  { id: 'CLF-C02', label: 'AWS CLF-C02', hint: CERT_PHASES['CLF-C02'].label },
  { id: 'DBT', label: 'dbt', hint: CERT_PHASES.DBT.label },
  { id: 'DEA-C01', label: 'AWS DEA-C01', hint: CERT_PHASES['DEA-C01'].label },
  { id: 'SNOWFLAKE', label: 'Snowflake', hint: 'Quickstarts' },
  { id: 'UDEMY', label: 'Udemy', hint: '5 cours' },
];

// Écran « Cours » : une page par certification, plus les ressources
// Snowflake/dbt et les 5 cours Udemy.
export const CoursHubView: React.FC<CoursHubViewProps> = ({
  state,
  section,
  onSectionChange,
  onRefreshState,
  navTarget,
  navigationNonce,
}) => {
  const isCert = section === 'CLF-C02' || section === 'DBT' || section === 'DEA-C01';

  return (
    <div data-testid="cours-view" className="stack">
      <div className="segmented" role="tablist" aria-label="Choisir un cours">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={section === s.id}
            className="segment"
            data-testid={`cours-section-${s.id}`}
            onClick={() => onSectionChange(s.id)}
            style={{ ['--cert-color' as string]: certColor(s.id) } as React.CSSProperties}
          >
            <span className="cert-dot" aria-hidden="true" />
            <span>{s.label}</span>
            <span className="segment-count hide-mobile">{s.hint}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {isCert && (
          <CertificationsView
            state={state}
            onRefreshState={onRefreshState}
            lockedCertCode={section as CertCode}
            initialSubTab={navTarget?.certCode === section ? navTarget?.certSubTab : undefined}
            navigationNonce={navigationNonce}
          />
        )}
        {section === 'SNOWFLAKE' && (
          <CoursesView mode="snowflake" state={state} onRefreshState={onRefreshState} navigationNonce={navigationNonce} />
        )}
        {section === 'UDEMY' && (
          <CoursesView
            mode="udemy"
            state={state}
            onRefreshState={onRefreshState}
            initialCourseKey={navTarget?.courseKey}
            navigationNonce={navigationNonce}
          />
        )}
      </div>
    </div>
  );
};
