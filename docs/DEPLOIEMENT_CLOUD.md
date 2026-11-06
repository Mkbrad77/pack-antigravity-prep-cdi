# Mise en ligne de l'application (mobile 24h/24, PC éteint)

**Objectif :** ouvrir l'application et écouter les podcasts depuis le téléphone, en 4G/5G, même quand aucun PC n'est allumé. Coût : 0 € (offres gratuites Cloudflare).

## Architecture en une phrase

Un seul Worker Cloudflare (`prep-cdi`) sert l'interface, exécute l'API avec **le même code métier que le mode local** (base SQLite hébergée dans un Durable Object), lit les podcasts depuis le bucket privé R2 `prep-cdi-audios`, et tout est verrouillé par Cloudflare Access (ton e-mail uniquement).

| Élément | Mode local (PC) | Mode cloud (mobile) |
| :--- | :--- | :--- |
| Interface | Vite, `http://localhost:5173` | Worker Cloudflare, `https://prep-cdi.<ton-sous-domaine>.workers.dev` |
| Données | `storage/user_data.sqlite` | SQLite d'un Durable Object (même schéma, mêmes migrations) |
| Podcasts | `public/audios/...` | Bucket R2 `prep-cdi-audios` (mêmes dossiers, mêmes noms) |
| SQL (entretiens) | `node:sqlite` | sql.js (même moteur SQLite, 105/105 solutions validées) |
| Python (entretiens) | `python` du PC | Pyodide dans le navigateur (5 exercices à threads : PC uniquement) |

Le mode local continue de fonctionner exactement comme avant.

## Étapes (une seule fois)

Pré-requis : Node.js 22.3 ou plus récent, le projet à jour sur la branche `feat/cloud-mobile`.

1. **Installer les dépendances** : `npm install`
2. **Se connecter à Cloudflare** : `npx wrangler login` (ouvre le navigateur, compte moyobradley7@gmail.com).
3. **Déployer** : `npm run cloud:deploy`. La commande affiche l'adresse `https://prep-cdi.<ton-sous-domaine>.workers.dev`. En l'ouvrant, tu dois voir la page « Application verrouillée » : c'est normal, rien n'est accessible tant qu'Access n'est pas branché.
4. **Activer Cloudflare Access** : tableau de bord Cloudflare, Workers & Pages, `prep-cdi`, Settings, Domains & Routes, ligne `workers.dev`, **Enable Cloudflare Access**. Note les deux valeurs affichées : le *AUD tag* et le *team domain*.
   - Puis **Manage Cloudflare Access** : vérifie que la règle n'autorise que `moyobradley7@gmail.com`, et règle la durée de session sur 1 mois (sinon il faudra retaper un code souvent).
5. **Donner ces deux valeurs au Worker** :
   - `npx wrangler secret put POLICY_AUD` (colle le AUD tag)
   - `npx wrangler secret put TEAM_DOMAIN` (format `https://xxxx.cloudflareaccess.com`)
6. **Ouvrir sur le téléphone** l'adresse du Worker, saisir ton e-mail, puis le code reçu.
   - iPhone (Safari) : bouton Partager, puis « Sur l'écran d'accueil ».
   - Android (Chrome) : menu, puis « Installer l'application ».
7. **Reprendre ta progression** (si tu as déjà coché des choses en local) : sur l'appli locale, Réglages, *Exporter la sauvegarde JSON* ; sur l'appli en ligne, Réglages, *Importer*.
8. **Envoyer les podcasts déjà prêts** : depuis le PC où se trouvent les fichiers (PC du bureau), voir `docs/PROMPT_ANTIGRAVITY_AUDIOS.md`.

## Au quotidien

- **Nouveaux podcasts** : `npm run audios:upload` sur le PC qui a les fichiers. L'appli les affiche automatiquement en moins de 30 secondes, sans redéploiement.
- **Modification du code** : `npm run cloud:deploy` (tes données en ligne sont conservées).
- **Hors ligne** : dans Podcasts, ouvre le détail d'un épisode puis « Garder hors ligne », ou « Tout garder hors ligne » pour la liste affichée (filtre par semaine conseillé, environ 6 épisodes). Sans réseau, l'appli affiche les dernières données consultées en lecture seule.
- **Une seule source de vérité** : coche tes tâches sur la version en ligne (même depuis le PC, dans le navigateur). L'appli locale reste un secours ; ses données ne se synchronisent pas toutes seules (passer par Export / Import).

## Sécurité

- Sans `POLICY_AUD` et `TEAM_DOMAIN`, le Worker refuse tout (interface, API, audios).
- Chaque requête vérifie le jeton signé Cloudflare Access (`Cf-Access-Jwt-Assertion`), comme recommandé par Cloudflare.
- Le bucket R2 reste privé (accès public désactivé) : les audios ne passent que par le Worker.
- Pas d'URL de prévisualisation publique (`preview_urls: false`).

## Vérifications avant chaque déploiement

```bash
npm test                                   # tests unitaires (54)
npx tsc --noEmit -p worker/tsconfig.json   # typage du Worker
npx wrangler deploy --dry-run              # bundle sans import Node, taille < 3 Mo compressé
```

## Limites connues

- Python dans le navigateur ne lance pas de threads : py-049, py-050, py-051, py-053, py-054 sont à faire sur le PC.
- Premier lancement de Python sur mobile : quelques secondes (téléchargement de Pyodide depuis jsDelivr, puis mis en cache).
- iPhone, appli installée sur l'écran d'accueil : si la lecture ne reprend pas après une longue pause en arrière-plan, ouvre l'adresse dans un onglet Safari (bug WebKit connu).
