/*
 * Service worker du Pack Preparation CDI (mode cloud / mobile).
 *
 * - Interface : fonctionne hors ligne (derniere version chargee).
 * - Donnees (GET /api/*) : reseau d'abord, sinon derniere reponse connue (lecture seule).
 * - Audios : si l'episode a ete telecharge pour le hors ligne, il est lu depuis le cache,
 *   avec prise en charge des requetes Range (avance / retour rapide). Sinon : streaming normal.
 */
const VERSION = 'v1';
const SHELL_CACHE = `prep-shell-${VERSION}`;
const ASSETS_CACHE = `prep-assets-${VERSION}`;
const API_CACHE = `prep-api-${VERSION}`;
const AUDIO_CACHE = 'prep-audio-v1'; // jamais purge lors d'une mise a jour de l'appli

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(['/', '/manifest.webmanifest']))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const keep = new Set([SHELL_CACHE, ASSETS_CACHE, API_CACHE, AUDIO_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/audios/')) {
    event.respondWith(serveAudio(request, url));
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(navigation(request));
    return;
  }
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
  }
});

function isCacheable(response) {
  return response && response.ok && !response.redirected && response.type === 'basic';
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (isCacheable(response)) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (isCacheable(response)) cache.put(request, response.clone());
  return response;
}

async function navigation(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (isCacheable(response)) cache.put('/', response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match('/');
    if (cached) return cached;
    throw err;
  }
}

async function serveAudio(request, url) {
  const cache = await caches.open(AUDIO_CACHE);
  const cached = await cache.match(url.pathname);
  if (!cached) return fetch(request);

  const blob = await cached.blob();
  const size = blob.size;
  const type = cached.headers.get('content-type') || 'audio/mp4';
  const rangeHeader = request.headers.get('range');

  if (!rangeHeader) {
    return new Response(blob, {
      status: 200,
      headers: { 'Content-Type': type, 'Content-Length': String(size), 'Accept-Ranges': 'bytes' },
    });
  }

  const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  let start = 0;
  let end = size - 1;
  if (match) {
    if (match[1] === '' && match[2] !== '') {
      start = Math.max(0, size - Number(match[2]));
    } else {
      start = Number(match[1] || 0);
      if (match[2] !== '') end = Math.min(Number(match[2]), size - 1);
    }
  }
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  return new Response(blob.slice(start, end + 1, type), {
    status: 206,
    headers: {
      'Content-Type': type,
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
    },
  });
}
