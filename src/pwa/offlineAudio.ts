/**
 * Telechargement des episodes pour une ecoute sans reseau (metro, avion...).
 * Les fichiers sont stockes dans le cache du navigateur, puis servis par le service worker.
 */
const AUDIO_CACHE = 'prep-audio-v1';

export function isOfflineAudioSupported(): boolean {
  return typeof window !== 'undefined' && 'caches' in window && 'serviceWorker' in navigator && window.isSecureContext;
}

export async function listOfflineAudioUrls(): Promise<Set<string>> {
  if (!isOfflineAudioSupported()) return new Set();
  const cache = await caches.open(AUDIO_CACHE);
  const keys = await cache.keys();
  return new Set(keys.map((req) => new URL(req.url).pathname));
}

export async function downloadAudioForOffline(audioUrl: string): Promise<void> {
  const cache = await caches.open(AUDIO_CACHE);
  const response = await fetch(audioUrl, { cache: 'no-store' });
  const type = response.headers.get('content-type') || '';
  if (!response.ok || response.redirected || !type.startsWith('audio/')) {
    throw new Error('Téléchargement impossible (connexion ou session expirée).');
  }
  await cache.put(audioUrl, response);
}

export async function removeOfflineAudio(audioUrl: string): Promise<void> {
  const cache = await caches.open(AUDIO_CACHE);
  await cache.delete(audioUrl);
}

/** Demande au navigateur de ne pas effacer ces fichiers en cas de manque de place. */
export async function requestPersistentStorage(): Promise<void> {
  try {
    await navigator.storage?.persist?.();
  } catch {
    // ignore
  }
}
