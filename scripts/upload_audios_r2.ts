/**
 * Envoi des podcasts NotebookLM vers le bucket Cloudflare R2 "prep-cdi-audios".
 *
 * 1. Renomme automatiquement les exports bruts de NotebookLM deposes dans
 *    public/audios/clf-c02, public/audios/dbt et public/audios/dea-c01
 *    (meme logique que l'application : CLF-AUDIO-XX.m4a, DBT-AUDIO-XX.m4a, DEA-AUDIO-XX.m4a).
 * 2. Envoie sur R2 uniquement les fichiers nouveaux ou modifies (memo local : .r2-uploads.json).
 * 3. Affiche les episodes encore manquants.
 *
 * Aucune modification du code n'est necessaire : l'application en ligne detecte toute seule
 * les nouveaux fichiers (sous 30 secondes) et les passe de "Bientot disponible" a "Pret".
 *
 * Usage :
 *   npm run audios:upload              (envoi reel)
 *   npm run audios:upload -- --dry-run (simulation, rien n'est envoye)
 *   npm run audios:upload -- --force   (renvoie tout)
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadStaticDatasets } from '../src/server/db';
import { autoRenameNewAudioFiles } from '../src/server/nodeRuntime';

const BUCKET = 'prep-cdi-audios';
const FOLDERS = ['clf-c02', 'dbt', 'dea-c01'] as const;
const CANONICAL = /^(CLF|DBT|DEA)-AUDIO-\d{2}\.(m4a|mp3|wav|aac|ogg)$/i;
const MIME: Record<string, string> = {
  m4a: 'audio/mp4',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  aac: 'audio/aac',
  ogg: 'audio/ogg',
};

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');
const manifestPath = path.join(root, '.r2-uploads.json');

type Manifest = Record<string, { size: number; mtimeMs: number; uploadedAt: string }>;
const manifest: Manifest = fs.existsSync(manifestPath)
  ? (JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as Manifest)
  : {};

const staticData = loadStaticDatasets(root);

// 1. Renommage automatique des exports NotebookLM
const renamed = autoRenameNewAudioFiles(staticData.podcastsCatalog, root);
for (const r of renamed) console.log(`Renomme : ${r.from}  ->  ${r.to}  (${r.title})`);

// 2. Envoi des fichiers nouveaux ou modifies
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
let uploaded = 0;
let skipped = 0;
let failed = 0;
const present = new Set<string>();

for (const folder of FOLDERS) {
  const dir = path.join(root, 'public', 'audios', folder);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).sort()) {
    if (!CANONICAL.test(file)) continue;
    const key = `${folder}/${file}`;
    const full = path.join(dir, file);
    const st = fs.statSync(full);
    present.add(file.replace(/\.[^.]+$/, '').toUpperCase());

    const known = manifest[key];
    if (!force && known && known.size === st.size && known.mtimeMs === st.mtimeMs) {
      skipped++;
      continue;
    }

    const ext = file.split('.').pop()!.toLowerCase();
    console.log(`${dryRun ? '[simulation] ' : ''}Envoi : ${key} (${(st.size / 1048576).toFixed(1)} Mo)`);
    if (dryRun) continue;

    const res = spawnSync(
      npx,
      ['wrangler', 'r2', 'object', 'put', `${BUCKET}/${key}`, '--file', full, '--content-type', MIME[ext] ?? 'application/octet-stream', '--remote'],
      { stdio: 'inherit', shell: process.platform === 'win32' }
    );
    if (res.status === 0) {
      manifest[key] = { size: st.size, mtimeMs: st.mtimeMs, uploadedAt: new Date().toISOString() };
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      uploaded++;
    } else {
      console.error(`Echec de l'envoi de ${key}. Verifie "npx wrangler login" puis relance.`);
      failed++;
    }
  }
}

// 3. Bilan
const missing = staticData.podcastsCatalog.episodes.filter((ep) => !present.has(ep.id.toUpperCase()));
console.log('');
console.log(`Bilan : ${uploaded} envoye(s), ${skipped} deja en ligne, ${failed} echec(s).`);
for (const cert of ['CLF-C02', 'DBT', 'DEA-C01']) {
  const total = staticData.podcastsCatalog.episodes.filter((e) => e.cert_code === cert).length;
  const miss = missing.filter((e) => e.cert_code === cert);
  console.log(`  ${cert} : ${total - miss.length}/${total} sur ce PC${miss.length ? ` (manquants : ${miss.map((e) => e.id).join(', ')})` : ''}`);
}
if (failed > 0) process.exit(1);
