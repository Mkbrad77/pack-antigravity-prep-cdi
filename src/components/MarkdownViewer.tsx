import React from 'react';

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = '';
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = (key: string) => {
    if (tableRows.length === 0) return;
    const header = tableRows[0];
    const body = tableRows.slice(1);
    elements.push(
      <div key={key} style={{ overflowX: 'auto', margin: '1rem 0' }}>
        <table className="table" style={{ width: '100%', fontSize: '0.88rem' }}>
          <thead>
            <tr>
              {header.map((col, idx) => (
                <th key={idx} style={{ padding: '0.5rem 0.75rem' }}>
                  {col.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((col, cIdx) => (
                  <td key={cIdx} style={{ padding: '0.45rem 0.75rem' }}>
                    {formatInline(col.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  const flushCodeBlock = (key: string) => {
    elements.push(
      <pre
        key={key}
        style={{
          backgroundColor: '#090d16',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          overflowX: 'auto',
          fontSize: '0.85rem',
          margin: '0.75rem 0',
          color: '#e2e8f0',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        }}
      >
        <code>{codeBlockContent.join('\n')}</code>
      </pre>
    );
    codeBlockContent = [];
    inCodeBlock = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock(`code-${i}`);
      } else {
        if (inTable) flushTable(`table-${i}`);
        inCodeBlock = true;
        codeBlockLang = line.trim().replace(/^```/, '');
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      // Ignore separator row like |---|---|
      if (line.match(/^\|(?:\s*:?-+:?\s*\|)+$/)) {
        continue;
      }
      inTable = true;
      const cols = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      tableRows.push(cols);
      continue;
    } else if (inTable) {
      flushTable(`table-${i}`);
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1
          key={`h1-${i}`}
          style={{
            fontSize: '1.45rem',
            margin: '1.25rem 0 0.75rem 0',
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.5rem',
          }}
        >
          {line.replace('# ', '')}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          style={{
            fontSize: '1.2rem',
            margin: '1.2rem 0 0.5rem 0',
            color: 'var(--accent-blue)',
          }}
        >
          {line.replace('## ', '')}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${i}`}
          style={{
            fontSize: '1.05rem',
            margin: '0.9rem 0 0.4rem 0',
            color: 'var(--text-secondary)',
          }}
        >
          {line.replace('### ', '')}
        </h3>
      );
      continue;
    }

    // Blockquotes & Alerts
    if (line.startsWith('> ')) {
      const q = line.replace('> ', '');
      const isNote = q.includes('[!NOTE]');
      const isTip = q.includes('[!TIP]');
      const isWarn = q.includes('[!WARNING]') || q.includes('[!CAUTION]');
      elements.push(
        <div
          key={`quote-${i}`}
          style={{
            borderLeft: `4px solid ${
              isWarn ? 'var(--accent-red)' : isTip ? 'var(--accent-green)' : 'var(--accent-blue)'
            }`,
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            padding: '0.5rem 0.85rem',
            margin: '0.6rem 0',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            fontSize: '0.88rem',
          }}
        >
          {formatInline(q.replace(/\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/, '').trim())}
        </div>
      );
      continue;
    }

    // Unordered lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const itemText = line.trim().replace(/^[-*]\s+/, '');
      elements.push(
        <div
          key={`ul-${i}`}
          style={{
            display: 'flex',
            gap: '0.5rem',
            margin: '0.25rem 0 0.25rem 0.75rem',
            fontSize: '0.9rem',
          }}
        >
          <span style={{ color: 'var(--accent-blue)' }}>•</span>
          <span>{formatInline(itemText)}</span>
        </div>
      );
      continue;
    }

    // Ordered lists
    const olMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      elements.push(
        <div
          key={`ol-${i}`}
          style={{
            display: 'flex',
            gap: '0.5rem',
            margin: '0.25rem 0 0.25rem 0.75rem',
            fontSize: '0.9rem',
          }}
        >
          <span className="mono" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
            {olMatch[1]}.
          </span>
          <span>{formatInline(olMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      continue;
    }

    // Regular paragraphs
    elements.push(
      <p
        key={`p-${i}`}
        style={{
          margin: '0.5rem 0',
          fontSize: '0.92rem',
          lineHeight: '1.6',
          color: 'var(--text-secondary)',
        }}
      >
        {formatInline(line)}
      </p>
    );
  }

  if (inTable) flushTable('table-end');
  if (inCodeBlock) flushCodeBlock('code-end');

  return <div className="markdown-body">{elements}</div>;
};

function formatInline(text: string): React.ReactNode {
  // Bold, inline code, links
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          style={{
            backgroundColor: '#0f172a',
            padding: '0.15rem 0.35rem',
            borderRadius: '4px',
            fontSize: '0.85em',
            color: 'var(--accent-blue)',
            border: '1px solid var(--border-color)',
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}
          >
            {linkMatch[1]}
          </a>
        );
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
