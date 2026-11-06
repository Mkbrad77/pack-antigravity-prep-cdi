/**
 * Verrou de securite : aucune donnee ni aucun audio n'est servi sans jeton
 * Cloudflare Access valide (methode recommandee par Cloudflare).
 */
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Env } from './env';

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
let jwksDomain = '';

export type AccessCheck = { ok: true } | { ok: false; response: Response };

export async function checkAccess(request: Request, env: Env): Promise<AccessCheck> {
  if (env.ALLOW_UNPROTECTED === 'true') return { ok: true };

  if (!env.POLICY_AUD || !env.TEAM_DOMAIN) {
    return { ok: false, response: setupPage() };
  }

  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token) {
    return { ok: false, response: textResponse(403, 'Acces refuse : connexion Cloudflare Access requise.') };
  }

  const teamDomain = env.TEAM_DOMAIN.replace(/\/+$/, '');
  if (!jwks || jwksDomain !== teamDomain) {
    jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
    jwksDomain = teamDomain;
  }

  try {
    await jwtVerify(token, jwks, { issuer: teamDomain, audience: env.POLICY_AUD });
    return { ok: true };
  } catch {
    return { ok: false, response: textResponse(403, 'Acces refuse : jeton Cloudflare Access invalide ou expire.') };
  }
}

function textResponse(status: number, text: string): Response {
  return new Response(text, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}

function setupPage(): Response {
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prep CDI : configuration requise</title>
<style>body{font-family:system-ui,sans-serif;background:#0b0d12;color:#e6e8ee;max-width:640px;margin:3rem auto;padding:0 1.25rem;line-height:1.6}code{background:#1a1e27;padding:.1rem .35rem;border-radius:4px}h1{font-size:1.3rem}</style></head>
<body><h1>Application verrouillee : Cloudflare Access n'est pas encore configure</h1>
<p>Par securite, l'application ne sert aucune donnee tant que l'acces n'est pas protege.</p>
<ol>
<li>Tableau de bord Cloudflare : Workers &amp; Pages, puis le Worker <code>prep-cdi</code>, puis Settings, puis Domains &amp; Routes.</li>
<li>Sur la ligne <code>workers.dev</code> : <strong>Enable Cloudflare Access</strong>. Note le <em>AUD tag</em> et le <em>team domain</em> affiches.</li>
<li>Dans un terminal, dans le dossier du projet :<br><code>npx wrangler secret put POLICY_AUD</code><br><code>npx wrangler secret put TEAM_DOMAIN</code> (format https://xxx.cloudflareaccess.com)</li>
<li>Recharge cette page.</li>
</ol></body></html>`;
  return new Response(html, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
