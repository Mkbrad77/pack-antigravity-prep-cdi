import React, { useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { MOBILE_QUERY, useMediaQuery } from '../ui/useMediaQuery';

export interface DocBrowserItem {
  id: string;
  title: string;
  meta?: string;
}

interface DocBrowserProps {
  listLabel: string;
  items: DocBrowserItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterPlaceholder?: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}

// Liste de documents + zone de lecture.
// PC : liste à gauche (collante), lecture à droite. Téléphone : liste repliable au-dessus.
export const DocBrowser: React.FC<DocBrowserProps> = ({
  listLabel,
  items,
  selectedId,
  onSelect,
  filterValue,
  onFilterChange,
  filterPlaceholder = 'Rechercher…',
  intro,
  children,
}) => {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [open, setOpen] = useState(false);
  const readerRef = useRef<HTMLElement | null>(null);
  const selected = items.find((i) => i.id === selectedId);
  const searchId = `doc-search-${listLabel.replace(/\W+/g, '-').toLowerCase()}`;

  const list = (
    <div className="stack-sm">
      {intro}
      {onFilterChange && (
        <div style={{ position: 'relative' }}>
          <label className="sr-only" htmlFor={searchId}>
            {filterPlaceholder}
          </label>
          <Search size={16} aria-hidden style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id={searchId}
            type="search"
            className="input"
            placeholder={filterPlaceholder}
            value={filterValue || ''}
            onChange={(e) => onFilterChange(e.target.value)}
            style={{ paddingLeft: '2.1rem' }}
          />
        </div>
      )}
      <div className="item-list-container" role="list" aria-label={listLabel}>
        {items.length === 0 && <div className="empty-state small">Aucun résultat.</div>}
        {items.map((it) => {
          const isSelected = it.id === selectedId;
          return (
            <div role="listitem" key={it.id}>
              <button
                type="button"
                className={`item-card ${isSelected ? 'selected' : ''}`}
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => {
                  onSelect(it.id);
                  if (isMobile) {
                    setOpen(false);
                    window.setTimeout(() => readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                  }
                }}
              >
                <span style={{ fontWeight: isSelected ? 650 : 500, lineHeight: 1.4 }}>{it.title}</span>
                {it.meta && <span className="muted small">{it.meta}</span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="interview-grid">
      {isMobile ? (
        <details className="disclosure" open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
          <summary>
            <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <span className="eyebrow">{listLabel}</span>
              <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selected ? selected.title : 'Choisir'}
              </span>
            </span>
            <span className="badge badge-neutral">{items.length}</span>
            <ChevronDown size={18} className="chevron" aria-hidden />
          </summary>
          <div className="disclosure-body">{list}</div>
        </details>
      ) : (
        <div className="card" style={{ position: 'sticky', top: 'calc(var(--topbar-height) + 1rem)' }}>
          <div className="eyebrow" style={{ marginBottom: '0.6rem' }}>
            {listLabel}
          </div>
          {list}
        </div>
      )}
      <article ref={readerRef} className="card" style={{ padding: isMobile ? '1.1rem' : '1.75rem', minWidth: 0, scrollMarginTop: '72px' }}>
        {children}
      </article>
    </div>
  );
};
