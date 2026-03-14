# 11 – Déploiement

## 1. Vue d'ensemble

POM peut être déployé via **Docker Compose** avec 3 services :

```
┌─────────────────────────────────────────┐
│              docker-compose             │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │ frontend │  │  backend │  │mongodb│ │
│  │ (nginx)  │  │(node.js) │  │ :27017│ │
│  │  :80     │  │  :3000   │  └───────┘ │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

Le frontend Angular est compilé en statique et servi par nginx.
nginx proxifie `/api/*` vers le backend.

---

## 2. Prérequis

- Docker ≥ 20.10
- Docker Compose ≥ 2.0
- (Optionnel) Node.js ≥ 20 pour le développement local

---

## 3. Démarrage rapide (production)

```bash
# 1. Cloner le dépôt
git clone <repo>

# 2. Configurer les variables d'environnement
cp server-v2/.env.example server-v2/.env
# Éditer server-v2/.env avec vos valeurs

# 3. Démarrer tous les services
docker-compose up -d

# 4. L'application est disponible sur http://localhost
```

---

## 4. Variables d'environnement requises

Fichier `server-v2/.env` :

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| NODE_ENV | ✅ | `production` ou `development` |
| PORT | ✅ | Port du serveur backend (défaut: 3000) |
| MONGODB_URI | ✅ | URI MongoDB complète |
| JWT_SECRET | ✅ | Secret JWT (min 64 caractères) |
| JWT_EXPIRES_IN | ❌ | Durée du token (défaut: `8h`) |
| CORS_ORIGINS | ✅ | Origines autorisées (ex: `http://localhost`) |
| MAILGUN_API_KEY | ❌ | Pour les emails de reset MDP |
| MAILGUN_DOMAIN | ❌ | Domaine Mailgun |
| MAILGUN_FROM | ❌ | Email expéditeur |

---

## 5. Développement local

### Backend
```bash
cd server-v2
cp .env.example .env
npm install
npm run dev    # node --watch app.js
```

### Frontend
```bash
cd client-ng
npm install
ng serve      # http://localhost:4200
```

> Assurez-vous que MongoDB est accessible à l'adresse configurée dans `MONGODB_URI`.

---

## 6. Construction manuelle

### Frontend
```bash
cd client-ng
ng build --configuration=production
# Résultat dans client-ng/dist/client-ng/browser/
```

### Backend
Pas de build nécessaire (Node.js pur).

---

## 7. Architecture nginx (production)

nginx sert :
- `/*` → fichiers statiques Angular
- `/api/*` → proxy vers le backend (port 3000)
- Gzip activé
- `index.html` pour toutes les routes SPA (support du routeur Angular)

---

## 8. Sauvegarde MongoDB

```bash
# Sauvegarde
docker-compose exec mongodb mongodump --db dbPOM --out /backup

# Restauration
docker-compose exec mongodb mongorestore --db dbPOM /backup/dbPOM
```

---

## 9. Mise à jour

```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```
