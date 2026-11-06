import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { LocalSqliteStore, normalizePodcastsCatalog } from '../../src/server/db';
import { handleApiRequest } from '../../src/server/api';
import type { ApiRuntime } from '../../src/server/apiRuntime';
import { createBundleContentSource, createNodeContentSource } from '../../src/server/contentSource';
import { openNodeSqlite } from '../../src/server/sqlDb';
import { getEffectiveTodayIso, PROGRAM_START_ISO } from '../../src/domain/dates';
import { splitSqlStatements } from '../../worker/durableSqlDb';

function bundleFromDisk(): Record<string, string> {
  const files: Record<string, string> = {};
  const walk = (rel: string) => {
    for (const entry of fs.readdirSync(rel, { withFileTypes: true })) {
      const child = `${rel}/${entry.name}`;
      if (entry.isDirectory()) walk(child);
      else if (/\.(json|md)$/.test(entry.name)) files[child] = fs.readFileSync(child, 'utf-8');
    }
  };
  walk('data');
  walk('content');
  return files;
}

function cloudLikeRuntime(audioKeys: string[]): ApiRuntime {
  const keys = new Set(audioKeys);
  return {
    mode: 'cloud',
    audioExists: (folder, filename) => keys.has(`${folder}/${filename}`),
    networkUrls: () => [],
    openInMemorySqlDb: () => openNodeSqlite(':memory:'),
  };
}

describe('Date de reference (calendrier reel)', () => {
  it('avant le depart, affiche le lundi 9 novembre 2026', () => {
    expect(getEffectiveTodayIso({ simulated_today: '' }, new Date('2026-11-06T12:00:00Z'))).toBe(PROGRAM_START_ISO);
  });
  it('apres le depart, suit la vraie date (fuseau Paris)', () => {
    expect(getEffectiveTodayIso({ simulated_today: '' }, new Date('2026-12-01T23:30:00Z'))).toBe('2026-12-02');
  });
  it('une date simulee reste prioritaire', () => {
    expect(getEffectiveTodayIso({ simulated_today: '2027-01-08' }, new Date('2026-12-01T10:00:00Z'))).toBe('2027-01-08');
  });
});

describe('Decoupage SQL pour le Durable Object', () => {
  it('respecte les chaines et ignore les commentaires', () => {
    const parts = splitSqlStatements("CREATE TABLE a (x TEXT DEFAULT 'a;b'); -- note ; ici\nINSERT INTO a VALUES ('it''s'); ");
    expect(parts).toEqual(["CREATE TABLE a (x TEXT DEFAULT 'a;b')", "INSERT INTO a VALUES ('it''s')"]);
  });
});

describe('Source de contenu embarquee (mode cloud)', () => {
  const bundle = createBundleContentSource(bundleFromDisk());
  const disk = createNodeContentSource(process.cwd());
  it('liste les memes chapitres que le disque', () => {
    const dir = 'content/certifications/clf/chapters';
    expect(bundle.list(dir).sort()).toEqual(disk.list(dir).filter((f) => f.endsWith('.md')).sort());
  });
  it('refuse les chemins qui remontent', () => {
    expect(bundle.exists('content/../package.json')).toBe(false);
  });
});

describe('Catalogue des podcasts', () => {
  it('derive nom de fichier, ordre et duree du format actuel sans modifier le fichier', () => {
    const raw = JSON.parse(fs.readFileSync(path.join('data', 'podcasts_catalog.json'), 'utf-8'));
    const norm = normalizePodcastsCatalog(raw);
    expect(norm.episodes).toHaveLength(44);
    for (const ep of norm.episodes) {
      expect(ep.filename).toMatch(/^(CLF|DBT|DEA)-AUDIO-\d{2}\.m4a$/);
      expect(ep.order).toBeGreaterThan(0);
    }
  });
});

describe('API en mode cloud (meme code metier, contenu embarque)', () => {
  const store = new LocalSqliteStore({
    db: openNodeSqlite(':memory:'),
    content: createBundleContentSource(bundleFromDisk()),
    dbLabel: 'test cloud',
  });
  const rt = cloudLikeRuntime(['clf-c02/CLF-AUDIO-01.m4a', 'dbt/DBT-AUDIO-03.m4a']);
  const call = (method: string, url: string, body: Record<string, unknown> = {}) =>
    handleApiRequest(store, rt, method, url, async () => body);

  it('GET /api/state : depart a 0 %, seuls les audios presents dans R2 sont disponibles', async () => {
    const res = await call('GET', '/api/state');
    expect(res.status).toBe(200);
    const state = res.payload as {
      runtimeMode: string;
      podcasts: { id: string; file_exists: boolean }[];
      tasks: { status: string }[];
      settings: { simulated_today: string; active_week_override: number | null };
    };
    expect(state.runtimeMode).toBe('cloud');
    expect(state.podcasts.filter((p) => p.file_exists).map((p) => p.id).sort()).toEqual(['CLF-AUDIO-01', 'DBT-AUDIO-03']);
    expect(state.tasks.every((t) => t.status !== 'done')).toBe(true);
    expect(state.settings.simulated_today).toBe('');
    expect(state.settings.active_week_override).toBeNull();
  });

  it('POST /api/sandbox/python : delegue l execution au navigateur', async () => {
    const res = await call('POST', '/api/sandbox/python', { userCode: 'print(1)' });
    expect(res.status).toBe(200);
    const payload = res.payload as { clientExecution?: { engine: string; harness: string } };
    expect(payload.clientExecution?.engine).toBe('pyodide');
    expect(payload.clientExecution?.harness).toContain('print(1)');
  });

  it('GET /api/certifications/dbt/chapters : contenu servi depuis le paquet embarque', async () => {
    const res = await call('GET', '/api/certifications/dbt/chapters');
    expect(res.status).toBe(200);
    expect((res.payload as unknown[]).length).toBeGreaterThan(0);
  });
});

describe('API en mode local', () => {
  it('GET /api/state repond 200 (regression catalogue podcasts)', async () => {
    const store = new LocalSqliteStore(':memory:');
    const res = await handleApiRequest(
      store,
      { ...cloudLikeRuntime([]), mode: 'local' },
      'GET',
      '/api/state',
      async () => ({})
    );
    expect(res.status).toBe(200);
  });
});
