export interface Env {
  ASSETS: Fetcher;
  AUDIOS: R2Bucket;
  USER_DATA: DurableObjectNamespace;
  /** Tag d'audience (AUD) de l'application Cloudflare Access (secret). */
  POLICY_AUD?: string;
  /** Ex. https://mon-equipe.cloudflareaccess.com (secret). */
  TEAM_DOMAIN?: string;
  /** "true" uniquement en developpement local (fichier .dev.vars). */
  ALLOW_UNPROTECTED?: string;
}
