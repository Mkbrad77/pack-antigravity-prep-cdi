/**
 * Source de contenu en lecture seule (dossiers `data/` et `content/`).
 * Les chemins sont toujours relatifs à la racine du projet, au format POSIX
 * (ex. `content/certifications/clf/chapters`).
 *
 * - Mode local : lecture directe sur le disque (`createNodeContentSource`).
 * - Mode cloud : lecture dans un paquet JSON généré au build (`createBundleContentSource`).
 */
import { requireNodeBuiltin } from './sqlDb';

export interface ContentSource {
  exists(relPath: string): boolean;
  read(relPath: string): string;
  /** Noms des entrées directes d'un dossier (fichiers et sous-dossiers). */
  list(relDir: string): string[];
}

function normalizeRel(relPath: string): string {
  const cleaned = relPath.replace(/\\/g, '/').replace(/^\.?\/+/, '').replace(/\/+$/, '');
  if (cleaned.split('/').some((seg) => seg === '..')) {
    throw new Error(`Chemin refusé : ${relPath}`);
  }
  return cleaned;
}

export function createNodeContentSource(rootDir?: string): ContentSource {
  const fs = requireNodeBuiltin<typeof import('node:fs')>('node:fs');
  const path = requireNodeBuiltin<typeof import('node:path')>('node:path');
  const root = rootDir ?? (globalThis as { process: { cwd(): string } }).process.cwd();
  const abs = (rel: string) => path.join(root, ...normalizeRel(rel).split('/'));
  return {
    exists: (rel) => {
      try {
        return fs.existsSync(abs(rel));
      } catch {
        return false;
      }
    },
    read: (rel) => fs.readFileSync(abs(rel), 'utf-8'),
    list: (rel) => fs.readdirSync(abs(rel)),
  };
}

/** `files` : dictionnaire chemin relatif POSIX vers contenu texte. */
export function createBundleContentSource(files: Record<string, string>): ContentSource {
  const dirs = new Map<string, Set<string>>();
  for (const filePath of Object.keys(files)) {
    const segments = filePath.split('/');
    for (let i = 1; i <= segments.length; i++) {
      const parent = segments.slice(0, i - 1).join('/');
      if (!dirs.has(parent)) dirs.set(parent, new Set());
      dirs.get(parent)!.add(segments[i - 1]);
    }
  }
  return {
    exists: (rel) => {
      let key: string;
      try {
        key = normalizeRel(rel);
      } catch {
        return false;
      }
      return key in files || dirs.has(key);
    },
    read: (rel) => {
      const key = normalizeRel(rel);
      if (!(key in files)) throw new Error(`Fichier introuvable : ${rel}`);
      return files[key];
    },
    list: (rel) => Array.from(dirs.get(normalizeRel(rel)) ?? []),
  };
}
