# Prompt à donner à Antigravity (PC du bureau) pour mettre en ligne de nouveaux podcasts

Copier tout le bloc ci-dessous dans Antigravity, après avoir déposé les nouveaux fichiers `.m4a` exportés de NotebookLM.

---

```text
Contexte : projet "Pack Préparation Intensive CDI Data & AI" (dépôt pack-antigravity-prep-cdi).
L'application est en ligne sur Cloudflare : interface + API dans le Worker "prep-cdi",
podcasts dans le bucket R2 privé "prep-cdi-audios". L'application détecte toute seule les
fichiers présents dans R2 : il n'y a AUCUN code à modifier pour ajouter un podcast.

Règles du projet (AGENTS.md) : zéro tiret cadratin ou demi-cadratin, ne modifie aucun contenu
pédagogique ni data/podcasts_catalog.json, ne coche aucune leçon, ne touche pas au code.

Ta mission : mettre en ligne les nouveaux podcasts NotebookLM.

1. Mets le dépôt à jour : git pull (branche main, ou feat/cloud-mobile si elle n'est pas encore fusionnée), puis npm install.
2. Vérifie que les nouveaux fichiers .m4a sont bien dans le bon dossier :
   - AWS Cloud Practitioner : public/audios/clf-c02/
   - dbt Analytics Engineering : public/audios/dbt/
   - AWS Data Engineer Associate : public/audios/dea-c01/
   Les noms bruts de NotebookLM sont acceptés : le script les renomme (CLF-AUDIO-XX.m4a, DBT-AUDIO-XX.m4a, DEA-AUDIO-XX.m4a).
3. Authentification Cloudflare (une seule fois sur ce PC) :
   - soit "npx wrangler login" avec le compte moyobradley7@gmail.com,
   - soit, si le réseau de l'entreprise bloque la connexion navigateur, les variables
     CLOUDFLARE_API_TOKEN (jeton limité aux droits "Workers R2 Storage : Edit") et CLOUDFLARE_ACCOUNT_ID.
4. Simulation : npm run audios:upload -- --dry-run
   Montre-moi la liste des renommages et des fichiers qui seront envoyés.
   Si un renommage associe un fichier au mauvais épisode (compare le titre affiché avec le sujet
   du fichier), arrête-toi et demande-moi avant de continuer.
5. Envoi réel : npm run audios:upload
6. Donne-moi le bilan affiché (envoyés, déjà en ligne, échecs, épisodes encore manquants par certification).
7. Ne commite ni les fichiers audio ni .r2-uploads.json (ils sont déjà ignorés par Git).

Vérification : sur l'application en ligne, Studio Podcasts, les nouveaux épisodes passent de
"Bientôt disponible" à "Audio Prêt" en moins de 30 secondes (recharger la page).
```

---

**En cas de souci**

- `Authentication error` : refaire `npx wrangler login` ou vérifier le jeton API.
- Un épisode renommé avec le mauvais numéro : le renommer à la main dans `public/audios/<dossier>/`, puis relancer `npm run audios:upload` (seuls les fichiers nouveaux ou modifiés sont renvoyés). Pour remplacer un fichier déjà en ligne : `npm run audios:upload -- --force`.
