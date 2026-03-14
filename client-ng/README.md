# POM – Frontend Angular (client-ng)

Application Angular 21 + Angular Material + Chart.js pour la gestion de projets POM.

---

## 🛠 Développement local

```bash
npm install
npm start     # http://localhost:4200
```

> L'API doit être lancée sur `http://localhost:3000` (voir `server-v2/`).

---

## 📦 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Serveur de développement (port 4200, hot-reload) |
| `npm run build` | Build standard (utilisé par Dockerfile) |
| `npm run build:prod` | Build production avec injection de `API_URL` |
| `npm test` | Tests unitaires (Vitest) |
| `npm run watch` | Build en mode watch (développement) |

---

## ☁️ Déploiement sur Vercel

Le frontend peut être déployé gratuitement sur [Vercel](https://vercel.com) en quelques clics.

### Configuration Vercel (tableau de bord)

| Paramètre | Valeur |
|-----------|--------|
| **Root Directory** | `client-ng` |
| **Build Command** | `npm run build:prod` |
| **Output Directory** | `dist/client-ng/browser` |
| **Install Command** | `npm ci` |

### Variable d'environnement Vercel

| Nom | Valeur | Exemple |
|-----|--------|---------|
| `API_URL` | URL complète de votre API | `https://pom-api.onrender.com/api` |

> Sans `API_URL`, l'application utilise `/api` (mode Docker/Nginx).

### Déploiement via CLI

```bash
npm i -g vercel
vercel login

# Depuis ce dossier (client-ng/)
vercel --build-env API_URL=https://votre-api.onrender.com/api
```

📖 **Guide détaillé →** [`docs/deployment-vercel.md`](../docs/deployment-vercel.md)

---

## 🏗 Architecture du projet

```
src/
├── app/
│   ├── app.ts / app.routes.ts / app.config.ts
│   ├── core/
│   │   ├── guards/          # AuthGuard, RoleGuard
│   │   ├── interceptors/    # JWT Bearer interceptor
│   │   ├── models/          # Interfaces TypeScript (Project, Task, …)
│   │   └── services/        # AuthService, ProjectService, …
│   ├── features/            # Modules lazy-loaded par route
│   │   ├── auth/            # Login, reset-password
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── collaborators/
│   │   ├── budgets/
│   │   ├── statistics/
│   │   └── account/
│   └── shared/
│       └── components/      # Layout, Restricted
├── environments/
│   ├── environment.ts        # Développement (localhost:3000)
│   └── environment.prod.ts   # Production (généré par scripts/set-env.mjs)
└── styles.scss
```

---

## 🔧 Comment fonctionne l'injection d'URL d'API

Le script `scripts/set-env.mjs` génère `src/environments/environment.prod.ts`
en lisant la variable `API_URL` avant chaque build de production :

```
npm run build:prod
  └─ node scripts/set-env.mjs   → lit API_URL, génère environment.prod.ts
  └─ ng build --configuration=production
       └─ compile avec environment.prod.ts → bundle final contient l'URL de l'API
```
