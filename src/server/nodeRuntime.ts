/**
 * Runtime du mode local (PC sous Node.js) : fichiers audio dans public/audios,
 * renommage automatique des exports NotebookLM, sous-processus Python, IP du Wi-Fi.
 * Aucun import Node statique : les modules sont charges a la demande, ce qui garde
 * le bundle Cloudflare propre.
 */
import type { CertCode, PodcastsCatalogData } from '../domain/types';
import type { ApiRuntime } from './apiRuntime';
import { openNodeSqlite, requireNodeBuiltin } from './sqlDb';
import { executePythonCode } from './pythonSandbox';

function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export interface AutoRenamedAudioEntry {
  certCode: CertCode;
  from: string;
  to: string;
  episodeId: string;
  title: string;
}

export function autoRenameNewAudioFiles(
  podcastsCatalog: PodcastsCatalogData,
  rootDir = process.cwd()
): AutoRenamedAudioEntry[] {
  const fs = requireNodeBuiltin<typeof import('node:fs')>('node:fs');
  const path = requireNodeBuiltin<typeof import('node:path')>('node:path');
  const renamed: AutoRenamedAudioEntry[] = [];
  const certFolders: Record<CertCode, string> = {
    'CLF-C02': 'clf-c02',
    DBT: 'dbt',
    'DEA-C01': 'dea-c01',
  };

  for (const certCode of ['CLF-C02', 'DBT', 'DEA-C01'] as CertCode[]) {
    const folderName = certFolders[certCode];
    const dirPath = path.join(rootDir, 'public', 'audios', folderName);
    if (!fs.existsSync(dirPath)) {
      try {
        fs.mkdirSync(dirPath, { recursive: true });
      } catch {
        continue;
      }
    }

    let allFiles: string[] = [];
    try {
      allFiles = fs.readdirSync(dirPath);
    } catch {
      continue;
    }

    const audioRegex = /\.(m4a|mp3|wav|aac|ogg)$/i;
    const canonicalRegex = /^(CLF|DBT|DEA)-AUDIO-\d{2}\.(m4a|mp3|wav|aac|ogg)$/i;

    const unrenamedFiles = allFiles
      .filter((f) => audioRegex.test(f) && !canonicalRegex.test(f))
      .map((f) => {
        const full = path.join(dirPath, f);
        let timeMs = 0;
        try {
          const st = fs.statSync(full);
          timeMs = st.birthtimeMs && st.birthtimeMs > 0 ? st.birthtimeMs : st.mtimeMs;
        } catch {
          timeMs = 0;
        }
        return { name: f, full, timeMs };
      })
      .sort((a, b) => a.timeMs - b.timeMs || a.name.localeCompare(b.name));

    if (unrenamedFiles.length === 0) continue;

    const certEpisodes = podcastsCatalog.episodes
      .filter((ep) => ep.cert_code === certCode)
      .sort((a, b) => a.order - b.order);

    const existingCanonicalIds = new Set(
      allFiles
        .filter((f) => canonicalRegex.test(f))
        .map((f) => f.replace(/\.[^.]+$/, '').toUpperCase())
    );

    const missingEpisodes = certEpisodes.filter(
      (ep) => !existingCanonicalIds.has(ep.id.toUpperCase())
    );

    for (const fileObj of unrenamedFiles) {
      if (missingEpisodes.length === 0) break;

      const normFile = normalizeForMatch(fileObj.name.replace(/\.[^.]+$/, ''));
      const fileWords = new Set(normFile.split(/\s+/).filter((w) => w.length >= 3));

      // Chercher si un episode manquant a une correspondance forte par mots-cles (>= 3 points)
      let bestIdx = 0;
      let bestScore = -1;
      for (let i = 0; i < missingEpisodes.length; i++) {
        const ep = missingEpisodes[i];
        let score = 0;
        for (const kw of ep.keywords || []) {
          const normKw = normalizeForMatch(kw);
          if (normKw && normFile.includes(normKw)) {
            score += 2;
          } else if (normKw && fileWords.has(normKw)) {
            score += 1;
          }
        }
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }

      // Si aucun mot-cle tres specifique ne se demarque (score < 4), on suit l'ordre chronologique strict (missingEpisodes[0])
      const chosenIdx = bestScore >= 4 ? bestIdx : 0;
      const targetEp = missingEpisodes.splice(chosenIdx, 1)[0];
      const ext = path.extname(fileObj.name) || '.m4a';
      const targetFilename = `${targetEp.id}${ext}`;
      const targetFull = path.join(dirPath, targetFilename);

      try {
        if (!fs.existsSync(targetFull)) {
          fs.renameSync(fileObj.full, targetFull);
          renamed.push({
            certCode,
            from: fileObj.name,
            to: targetFilename,
            episodeId: targetEp.id,
            title: targetEp.title,
          });
        }
      } catch {
        // ignore rename error if file locked
      }
    }
  }

  return renamed;
}

export function getLocalNetworkUrls(port = 5173): string[] {
  const urls: string[] = [];
  const os = requireNodeBuiltin<typeof import('node:os')>('node:os');
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          urls.push(`http://${iface.address}:${port}`);
        }
      }
    }
  } catch {
    // ignore
  }
  return urls;
}

export function createNodeRuntime(rootDir?: string): ApiRuntime {
  const root = rootDir ?? process.cwd();
  const fs = requireNodeBuiltin<typeof import('node:fs')>('node:fs');
  const path = requireNodeBuiltin<typeof import('node:path')>('node:path');
  return {
    mode: 'local',
    audioExists: (folder, filename) => fs.existsSync(path.join(root, 'public', 'audios', folder, filename)),
    autoRenameAudios: (catalog) => autoRenameNewAudioFiles(catalog, root),
    networkUrls: () => getLocalNetworkUrls(5173),
    openInMemorySqlDb: () => openNodeSqlite(':memory:'),
    executePython: executePythonCode,
  };
}
