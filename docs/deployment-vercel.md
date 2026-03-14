# Déploiement du frontend POM sur Vercel

> **Durée estimée : 5–10 minutes**
> Vercel est une plateforme 100 % compatible avec les applications Angular (SPA statique).
> Le frontend sera accessible à une URL publique du type `https://pom-<votre-compte>.vercel.app`.

---

## Pré-requis

| Élément | Exigence |
|---------|----------|
| Compte Vercel | Gratuit – [vercel.com/signup](https://vercel.com/signup) |
| CLI Vercel (optionnel) | `npm i -g vercel` |
| Backend déployé | URL de votre API en HTTPS (ex : Render, Railway, Fly.io) |
| Repository GitHub connecté | Ou déploiement manuel via CLI |

---

## Architecture du déploiement

```
Navigateur
    │
    ▼
Vercel CDN (frontend Angular)
    │  /api/* → NON géré par Vercel
    │  → le frontend appelle directement le backend via variable d'env
    ▼
Votre API (Render / Railway / VPS / Docker)
    │
    ▼
MongoDB Atlas / VPS
```

> **Remarque :** Contrairement au mode Docker/Nginx, Vercel ne proxifie pas `/api/*`.
> Le frontend construit sa propre URL d'API grâce à la variable `API_URL` injectée lors du build.

---

## Étape 1 – Déployer votre API (backend)

Avant de déployer le frontend, votre API doit être accessible sur internet.

**Options recommandées :**

| Plateforme | Free tier | Instructions |
|------------|-----------|--------------|
| **Render** | ✅ | 📖 [Guide complet → docs/deployment-render.md](./deployment-render.md) |
| **Railway** | ✅ | [railway.app](https://railway.app) |
| **Fly.io** | ✅ | `flyctl launch` dans `server-v2/` |

> Une fois votre API déployée, notez son URL, ex : `https://pom-api.onrender.com`

---

## Étape 2 – Déployer le frontend sur Vercel

### Option A – Via GitHub (recommandée)

1. Connectez-vous sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New Project"** → **"Import Git Repository"**
3. Sélectionnez votre repo `florian2412/POM`
4. Configurez le projet :

   | Paramètre | Valeur |
   |-----------|--------|
   | **Framework Preset** | `Other` (ou Angular) |
   | **Root Directory** | `client-ng` |
   | **Build Command** | `npm run build:prod` |
   | **Output Directory** | `dist/client-ng/browser` |
   | **Install Command** | `npm ci` |

5. Ajoutez la variable d'environnement **AVANT** de cliquer sur Deploy :

   | Nom | Valeur |
   |-----|--------|
   | `API_URL` | `https://votre-api.onrender.com/api` |

   > ⚠️ Remplacez `https://votre-api.onrender.com/api` par l'URL réelle de votre backend.

6. Cliquez sur **"Deploy"** 🚀

---

### Option B – Via la CLI Vercel

```bash
# 1. Installation de la CLI
npm i -g vercel

# 2. Depuis le dossier client-ng
cd client-ng

# 3. Connexion à Vercel
vercel login

# 4. Déploiement (première fois — répond aux questions)
vercel \
  --build-env API_URL=https://votre-api.onrender.com/api

# 5. Pour les déploiements suivants
vercel --prod \
  --build-env API_URL=https://votre-api.onrender.com/api
```

---

## Étape 3 – Configurer le CORS sur votre API

Votre API doit autoriser les requêtes venant du domaine Vercel.

Dans le fichier `server-v2/.env` (ou les variables d'environnement de votre hébergeur) :

```dotenv
CORS_ORIGINS=https://pom-votrecompte.vercel.app
```

Si vous avez plusieurs URLs (preview + production) :

```dotenv
CORS_ORIGINS=https://pom-votrecompte.vercel.app,https://votre-domaine-custom.com
```

---

## Étape 4 – Domaine personnalisé (optionnel)

Dans le tableau de bord Vercel → **"Domains"** :
1. Ajoutez votre domaine (ex : `pom.exemple.com`)
2. Configurez le DNS chez votre registrar avec un enregistrement CNAME → `cname.vercel-dns.com`

---

## Comment fonctionne l'injection d'URL

Le fichier `scripts/set-env.mjs` est exécuté **avant** le build Angular :

```
Vercel lance : npm run build:prod
    │
    ├── node scripts/set-env.mjs
    │       └── Lit API_URL depuis les env vars Vercel
    │       └── Génère src/environments/environment.prod.ts
    │
    └── ng build --configuration=production
            └── Utilise environment.prod.ts généré
```

Résultat : le bundle JavaScript final contient l'URL de votre API intégrée au moment du build.

---

## Déclenchement automatique des déploiements

Avec l'intégration GitHub, chaque `git push` sur la branche principale déclenche automatiquement un nouveau déploiement Vercel.

| Branche | URL |
|---------|-----|
| `main` / `master` | Déploiement de **production** |
| Toute autre branche | Déploiement de **preview** (URL unique temporaire) |

---

## Résolution des problèmes courants

### Page blanche / 404 sur refresh

✅ Le fichier `vercel.json` inclut déjà la règle de réécriture SPA :
```json
{ "source": "/((?!favicon\\.ico|assets/.*).*)", "destination": "/index.html" }
```

### Erreur CORS au login

➡️ Vérifiez que `CORS_ORIGINS` dans votre backend inclut l'URL Vercel exacte (avec `https://`).

### `API_URL` pas prise en compte

➡️ Dans le tableau de bord Vercel → **Settings → Environment Variables** → vérifiez que `API_URL` est définie pour l'environnement `Production`.
➡️ Redéclenchez un déploiement depuis **Deployments → "Redeploy"**.

### Build échoue — module manquant

➡️ Vercel utilise Node 20 par défaut. Si besoin, ajoutez dans `vercel.json` :
```json
{ "build": { "env": { "NODE_VERSION": "20" } } }
```

---

## Référence des fichiers Vercel

| Fichier | Rôle |
|---------|------|
| `client-ng/vercel.json` | Configuration Vercel (build, output, rewrites, cache headers) |
| `client-ng/scripts/set-env.mjs` | Génère `environment.prod.ts` depuis `API_URL` |
| `client-ng/package.json` → `build:prod` | Commande de build utilisée par Vercel |
