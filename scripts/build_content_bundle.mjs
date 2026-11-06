/**
 * Genere worker/generated/content.json : tout le contenu pedagogique en lecture seule
 * (dossiers data/ et content/) embarque dans le Worker Cloudflare.
 * Le contenu n'est jamais modifie : il est copie tel quel.
 * Usage : node scripts/build_content_bundle.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const roots = ['data', 'content'];
const exts = new Set(['.json', '.md']);
const files = {};

function walk(relDir) {
  for (const entry of fs.readdirSync(path.join(root, relDir), { withFileTypes: true })) {
    const rel = `${relDir}/${entry.name}`;
    if (entry.isDirectory()) walk(rel);
    else if (exts.has(path.extname(entry.name).toLowerCase())) {
      files[rel] = fs.readFileSync(path.join(root, rel), 'utf-8');
    }
  }
}

for (const r of roots) walk(r);

const outDir = path.join(root, 'worker', 'generated');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'content.json');
fs.writeFileSync(out, JSON.stringify(files));
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`Paquet de contenu genere : ${Object.keys(files).length} fichiers, ${kb} Ko -> ${path.relative(root, out)}`);
