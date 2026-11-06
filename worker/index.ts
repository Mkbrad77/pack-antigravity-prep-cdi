/**
 * Point d'entree Cloudflare du Pack Preparation CDI (mode cloud / mobile).
 *
 * - /api/*    : API de l'application, executee dans le Durable Object (SQLite en ligne)
 * - /audios/* : podcasts NotebookLM servis depuis le bucket R2 prive, avec prise en
 *               charge des requetes Range (avance / retour rapide sur mobile)
 * - le reste  : interface React (fichiers statiques du dossier dist/)
 */
import type { Env } from './env';
import { checkAccess } from './access';
export { UserDataObject } from './userDataObject';

const AUDIO_TYPES: Record<string, string> = {
  m4a: 'audio/mp4',
  mp4: 'audio/mp4',
  aac: 'audio/aac',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const access = await checkAccess(request, env);
    if (!access.ok) return access.response;

    if (url.pathname.startsWith('/api/')) {
      const stub = env.USER_DATA.get(env.USER_DATA.idFromName('auren-moyo'));
      return stub.fetch(request);
    }

    if (url.pathname.startsWith('/audios/')) {
      return serveAudio(request, env, url);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function serveAudio(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Methode non autorisee', { status: 405 });
  }
  const key = decodeURIComponent(url.pathname.replace(/^\/audios\//, ''));
  if (!/^(clf-c02|dbt|dea-c01)\/[A-Za-z0-9._-]+$/.test(key)) {
    return new Response('Fichier audio introuvable', { status: 404 });
  }

  const rangeHeader = request.headers.get('range');
  const object =
    request.method === 'HEAD'
      ? await env.AUDIOS.head(key)
      : await env.AUDIOS.get(key, rangeHeader ? { range: request.headers } : {});
  if (!object) return new Response('Fichier audio introuvable', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  const ext = key.split('.').pop()?.toLowerCase() ?? '';
  if (!headers.get('content-type') || headers.get('content-type') === 'application/octet-stream') {
    headers.set('content-type', AUDIO_TYPES[ext] ?? 'application/octet-stream');
  }
  headers.set('etag', object.httpEtag);
  headers.set('accept-ranges', 'bytes');
  headers.set('cache-control', 'private, max-age=86400');

  if (request.method === 'HEAD' || !('body' in object)) {
    headers.set('content-length', String(object.size));
    return new Response(null, { status: 200, headers });
  }

  const body = (object as R2ObjectBody).body;
  const range = (object as R2ObjectBody).range as
    | { offset?: number; length?: number; suffix?: number }
    | undefined;

  if (rangeHeader && range) {
    let start: number;
    let length: number;
    if (range.suffix !== undefined) {
      length = Math.min(range.suffix, object.size);
      start = object.size - length;
    } else {
      start = range.offset ?? 0;
      length = range.length ?? object.size - start;
    }
    const end = start + length - 1;
    headers.set('content-range', `bytes ${start}-${end}/${object.size}`);
    headers.set('content-length', String(length));
    return new Response(body, { status: 206, headers });
  }

  headers.set('content-length', String(object.size));
  return new Response(body, { status: 200, headers });
}
