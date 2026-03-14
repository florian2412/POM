# POM – Plan, Organize & Manage

Application web de gestion de projets. Stack technique v2 :

| Couche | Technologie |
|--------|-------------|
| Frontend | Angular 21 + Angular Material + Chart.js |
| API | Node.js 20 + Express 5 + **TypeScript 5** |
| Base de données | MongoDB 6+ (Mongoose 9) |
| Auth | JWT (jsonwebtoken 9) |
| Sécurité | Helmet, CORS, Rate-limit, express-validator, bcrypt |
| Déploiement | Docker + Docker Compose · **Vercel** (frontend) · **Render** (backend) |

---

## 📁 Structure du dépôt

```
POM/
├── client-ng/          # Frontend Angular 21 (TypeScript)
├── server-v2/          # API REST Express 5 (TypeScript)
│   ├── src/
│   │   ├── app.ts              # Point d'entrée, config Express
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT middleware + requireRole
│   │   ├── models/
│   │   │   ├── Budget.ts
│   │   │   ├── Collaborator.ts
│   │   │   ├── Project.ts      # Contient les tâches embarquées
│   │   │   └── Task.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── budgets.ts
│   │   │   ├── collaborators.ts
│   │   │   ├── projects.ts
│   │   │   ├── settings.ts
│   │   │   ├── tasks.ts
│   │   │   └── version.ts
│   │   └── types/
│   │       └── express.d.ts    # Extension de Express.Request
│   ├── settings.json           # Référentiels (rôles, statuts, catégories…)
│   ├── tsconfig.json
│   └── Dockerfile              # Build multi-stage TypeScript → prod
├── docs/
│   ├── specs/                  # Spécifications fonctionnelles complètes (12 fichiers)
│   ├── deployment-vercel.md    # Guide de déploiement Vercel (frontend)
│   └── deployment-render.md    # Guide de déploiement Render (backend)
├── docker-compose.yml  # Orchestration complète (MongoDB + API + Frontend)
├── render.yaml         # Blueprint Render (infrastructure as code pour le backend)
└── .gitignore
```

---

## 🚀 Démarrage rapide (Docker – recommandé)

```bash
# 1. Configurer les variables d'environnement
cp server-v2/.env.example server-v2/.env
# Éditer .env : JWT_SECRET (min 64 chars), CORS_ORIGINS, etc.

# 2. Démarrer tous les services
docker-compose up -d

# Application disponible sur http://localhost
```

---

## 💻 Développement local

### API (TypeScript)

```bash
cd server-v2
cp .env.example .env
npm install
npm run dev        # ts-node avec rechargement auto (Node --watch)
```

**Autres commandes :**

| Commande | Description |
|----------|-------------|
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Lance `dist/app.js` (prod) |
| `npm run typecheck` | Vérifie les types sans compiler |

### Frontend (Angular)

```bash
cd client-ng
npm install
ng serve           # http://localhost:4200
```

**Commandes frontend :**

| Commande | Description |
|----------|-------------|
| `npm run start` | Serveur de développement local (port 4200) |
| `npm run build` | Build standard (pour Docker) |
| `npm run build:prod` | Build production avec injection de l'URL d'API via `API_URL` |
| `npm test` | Exécution des tests unitaires |

---

## ☁️ Déploiement frontend sur Vercel

Le frontend Angular peut être déployé gratuitement sur [Vercel](https://vercel.com).

**Configuration rapide :**

| Paramètre Vercel | Valeur |
|-----------------|--------|
| Root Directory | `client-ng` |
| Build Command | `npm run build:prod` |
| Output Directory | `dist/client-ng/browser` |
| Variable d'env | `API_URL=https://votre-api.onrender.com/api` |

📖 **Guide complet →** [`docs/deployment-vercel.md`](./docs/deployment-vercel.md)

---

## ☁️ Déploiement backend sur Render

Le backend Node.js/TypeScript peut être déployé gratuitement sur [Render](https://render.com).
**Pas besoin d'un repo séparé** — Render supporte les monorepos via le paramètre "Root Directory".

**Configuration rapide (tableau de bord Render) :**

| Paramètre Render | Valeur |
|-----------------|--------|
| Root Directory | `server-v2` |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/version` |
| Variable d'env | `MONGODB_URI=mongodb+srv://...` |
| Variable d'env | `JWT_SECRET=<64+ chars>` |
| Variable d'env | `CORS_ORIGINS=https://pom-votrecompte.vercel.app` |

Le fichier `render.yaml` à la racine du repo permet aussi un déploiement en **1 clic via Render Blueprint**.

📖 **Guide complet →** [`docs/deployment-render.md`](./docs/deployment-render.md)



Toutes les spécifications fonctionnelles et techniques sont dans [`docs/specs/`](./docs/specs/) :

- `01-overview.md` – Architecture, acteurs, modèles de données
- `02-authentication.md` – JWT, RBAC
- `03-dashboard.md` – Tableau de bord
- `04-projects.md` – Gestion des projets
- `05-tasks.md` – Gestion des tâches
- `06-collaborators.md` – Gestion des collaborateurs
- `07-budgets.md` – Lignes budgétaires
- `08-statistics.md` – Statistiques et graphiques
- `09-settings.md` – Référentiels
- `10-api.md` – Documentation API REST complète
- `11-deployment.md` – Déploiement Docker
- [`deployment-vercel.md`](./docs/deployment-vercel.md) – **Déploiement Vercel (frontend)**
- [`deployment-render.md`](./docs/deployment-render.md) – **Déploiement Render (backend)**

---

## 🔐 Variables d'environnement (server-v2/.env)

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `NODE_ENV` | ✅ | `production` ou `development` |
| `PORT` | ✅ | Port de l'API (défaut : 3000) |
| `MONGODB_URI` | ✅ | URI MongoDB |
| `JWT_SECRET` | ✅ | Secret JWT (min 64 caractères) |
| `JWT_EXPIRES_IN` | ❌ | Durée du token (défaut : `8h`) |
| `CORS_ORIGINS` | ✅ | Origines autorisées (virgule-séparées) |
| `MAILGUN_API_KEY` | ❌ | Pour les emails de réinitialisation |
| `MAILGUN_DOMAIN` | ❌ | Domaine Mailgun |
| `MAILGUN_FROM` | ❌ | Email expéditeur |
