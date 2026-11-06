import React from 'react';

interface MarkdownViewerProps {
  content: string;
  /** Décalage des niveaux de titre : 1 signifie que « # » devient un h2 (le h1 est le titre de l'écran). */
  headingOffset?: number;
}

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'paragraph'; lines: string[] }
  | { kind: 'list'; ordered: boolean; start: number; items: Array<{ text: string; children: string[] }> }
  | { kind: 'quote'; tone: 'info' | 'tip' | 'warning'; lines: string[] }
  | { kind: 'code'; lang: string; code: string }
  | { kind: 'table'; header: string[]; rows: string[][] }
  | { kind: 'hr' };

const UL_RE = /^(\s*)[-*+]\s+(.*)$/;
const OL_RE = /^(\s*)(\d+)[.)]\s+(.*)$/;
const TABLE_SEP_RE = /^\|?(\s*:?-{2,}:?\s*\|)+\s*:?-*:?\s*\|?$/;

function splitRow(line: string): string[] {
  let t = line.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  return t.split('|').map((c) => c.trim());
}

function parse(content: string): Block[] {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Bloc de code
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i]);
        i++;
      }
      i++; // fermeture
      blocks.push({ kind: 'code', lang, code: code.join('\n') });
      continue;
    }

    // Titre
    const h = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      blocks.push({ kind: 'heading', level: h[1].length, text: h[2].replace(/\s+#+\s*$/, '') });
      i++;
      continue;
    }

    // Séparateur
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ kind: 'hr' });
      i++;
      continue;
    }

    // Tableau
    if (trimmed.startsWith('|') && i + 1 < lines.length && TABLE_SEP_RE.test(lines[i + 1].trim())) {
      const header = splitRow(trimmed);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ kind: 'table', header, rows });
      continue;
    }
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Tableau sans ligne de séparation : toutes les lignes en corps
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!TABLE_SEP_RE.test(lines[i].trim())) rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ kind: 'table', header: rows[0] || [], rows: rows.slice(1) });
      continue;
    }

    // Citation et encadrés [!NOTE] / [!TIP] / [!WARNING]
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const joined = quoteLines.join(' ');
      const tone: 'info' | 'tip' | 'warning' = /\[!(WARNING|CAUTION)\]/.test(joined)
        ? 'warning'
        : /\[!TIP\]/.test(joined)
          ? 'tip'
          : 'info';
      const cleaned = quoteLines
        .map((l) => l.replace(/\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/g, '').trim())
        .filter((l, idx, arr) => l.length > 0 || (idx > 0 && idx < arr.length - 1));
      blocks.push({ kind: 'quote', tone, lines: cleaned });
      continue;
    }

    // Listes (un niveau d'imbrication)
    const ulm = line.match(UL_RE);
    const olm = line.match(OL_RE);
    if (ulm || olm) {
      const ordered = Boolean(olm && !ulm);
      const baseIndent = (ulm ? ulm[1] : olm![1]).length;
      const start = olm && !ulm ? Number(olm[2]) : 1;
      const items: Array<{ text: string; children: string[] }> = [];
      while (i < lines.length) {
        const l = lines[i];
        if (!l.trim()) {
          // une ligne vide suivie d'un nouvel élément garde la même liste
          const nxt = lines[i + 1];
          if (nxt && (UL_RE.test(nxt) || OL_RE.test(nxt))) {
            i++;
            continue;
          }
          break;
        }
        const u = l.match(UL_RE);
        const o = l.match(OL_RE);
        const m = u || o;
        if (m) {
          const indent = m[1].length;
          const text = u ? u[2] : o![3];
          if (indent > baseIndent && items.length > 0) {
            items[items.length - 1].children.push(text);
          } else {
            if ((ordered && !o) || (!ordered && !u)) break;
            items.push({ text, children: [] });
          }
          i++;
          continue;
        }
        // ligne de continuation d'un élément
        if (/^\s{2,}\S/.test(l) && items.length > 0) {
          items[items.length - 1].text += ` ${l.trim()}`;
          i++;
          continue;
        }
        break;
      }
      blocks.push({ kind: 'list', ordered, start, items });
      continue;
    }

    // Paragraphe : lignes consécutives
    const para: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      const t = l.trim();
      if (
        !t ||
        t.startsWith('```') ||
        /^#{1,6}\s/.test(t) ||
        t.startsWith('>') ||
        t.startsWith('|') ||
        UL_RE.test(l) ||
        OL_RE.test(l) ||
        /^(-{3,}|\*{3,}|_{3,})$/.test(t)
      ) {
        break;
      }
      para.push(t);
      i++;
    }
    blocks.push({ kind: 'paragraph', lines: para });
  }

  return blocks;
}

const INLINE_RE = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g;

export function formatInline(text: string, keyPrefix = 'i'): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(INLINE_RE.source, 'g');

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;
    if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('__') && token.endsWith('__'))) {
      parts.push(<strong key={key}>{formatInline(token.slice(2, -2), key)}</strong>);
    } else if (token.startsWith('`')) {
      parts.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('[')) {
      const lm = token.match(/\[([^\]]+)\]\(([^)\s]+)\)/);
      if (lm) {
        parts.push(
          <a key={key} href={lm[2]} target="_blank" rel="noopener noreferrer">
            {lm[1]}
          </a>
        );
      }
    } else if (token.startsWith('*') || token.startsWith('_')) {
      // évite de prendre un identifiant snake_case pour de l'italique
      const prev = text[match.index - 1];
      if (token.startsWith('_') && prev && /\w/.test(prev)) {
        parts.push(token);
      } else {
        parts.push(<em key={key}>{token.slice(1, -1)}</em>);
      }
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return parts.length === 1 ? parts[0] : parts;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, headingOffset = 1 }) => {
  if (!content) return null;
  const blocks = parse(content);

  return (
    <div className="markdown-view">
      {blocks.map((b, idx) => {
        const key = `b-${idx}`;
        switch (b.kind) {
          case 'heading': {
            const level = Math.min(6, b.level + headingOffset);
            const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
            return (
              <Tag key={key} className={`md-h${Math.min(4, b.level)}`}>
                {formatInline(b.text, key)}
              </Tag>
            );
          }
          case 'paragraph':
            return (
              <p key={key}>
                {b.lines.map((l, li) => (
                  <React.Fragment key={li}>
                    {li > 0 && <br />}
                    {formatInline(l, `${key}-${li}`)}
                  </React.Fragment>
                ))}
              </p>
            );
          case 'list': {
            const items = b.items.map((it, ii) => (
              <li key={ii}>
                {formatInline(it.text, `${key}-${ii}`)}
                {it.children.length > 0 && (
                  <ul>
                    {it.children.map((c, ci) => (
                      <li key={ci}>{formatInline(c, `${key}-${ii}-${ci}`)}</li>
                    ))}
                  </ul>
                )}
              </li>
            ));
            return b.ordered ? (
              <ol key={key} start={b.start !== 1 ? b.start : undefined}>
                {items}
              </ol>
            ) : (
              <ul key={key}>{items}</ul>
            );
          }
          case 'quote':
            return (
              <blockquote key={key} className={b.tone === 'warning' ? 'md-warning' : b.tone === 'tip' ? 'md-tip' : undefined}>
                {b.lines.map((l, li) => (
                  <p key={li}>{formatInline(l, `${key}-${li}`)}</p>
                ))}
              </blockquote>
            );
          case 'code':
            return (
              <div key={key} className="md-code">
                {b.lang && <div className="md-code-lang">{b.lang}</div>}
                <pre tabIndex={0} aria-label={b.lang ? `Code ${b.lang}` : 'Bloc de code'}>
                  <code>{b.code}</code>
                </pre>
              </div>
            );
          case 'table':
            return (
              <div key={key} className="md-table table-scroll" tabIndex={0} role="region" aria-label="Tableau">
                <table>
                  {b.header.length > 0 && (
                    <thead>
                      <tr>
                        {b.header.map((c, ci) => (
                          <th key={ci} scope="col">
                            {formatInline(c, `${key}-h${ci}`)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((c, ci) => (
                          <td key={ci}>{formatInline(c, `${key}-${ri}-${ci}`)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'hr':
            return <hr key={key} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
