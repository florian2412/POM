# Déploiement du backend POM sur Render

> **Durée estimée : 10–20 minutes** (dont ~5 min pour créer la base MongoDB Atlas)
> Render est 100 % compatible avec le monorepo — **pas besoin d'un repo séparé**.
> Le backend sera accessible à une URL du type `https://pom-api.onrender.com`.

---

## Pas besoin d'un repo séparé

Render gère les **monorepos** nativement grâce au paramètre **Root Directory**.
Il suffit de pointer sur `server-v2/` lors de la création du service.
Les deux approches (tableau de bord ou Blueprint) sont décrites ci-dessous.

---

## Pré-requis

| Élément | Exigence |
|---------|----------|
| Compte Render | Gratuit – [render.com/register](https://render.com/register) |
| Repository GitHub connecté | `florian2412/POM` |
| Base de données MongoDB | MongoDB Atlas (gratuit) — voir étape 1 |

---

## Étape 1 – Créer la base MongoDB Atlas (gratuit)

1. Allez sur [cloud.mongodb.com](https://cloud.mongodb.com) → **Free** (M0)
2. Choisissez la région la plus proche (ex : `AWS / Paris`)
3. Notez le **username** et **password** de l'utilisateur de la base
4. Dans **Network Access** → **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`)
5. Dans **Database** → **Connect** → **Drivers** → copiez la chaîne de connexion :
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/dbPOM?retryWrites=true&w=majority
   ```

> Gardez cette URI sous la main — vous en aurez besoin à l'étape 3.

---

## Étape 2 – Déployer sur Render

### Option A – Via Blueprint (recommandée, déploiement en 1 clic)

Le fichier `render.yaml` à la racine du repo définit toute la configuration.

1. Connectez-vous sur [render.com](https://render.com)
2. **New** → **Blueprint**
3. Connectez votre repo GitHub `florian2412/POM`
4. Render détecte automatiquement `render.yaml` → cliquez **Apply**
5. Sur la page suivante, renseignez les variables **sync: false** :

   | Variable | Valeur |
   |----------|--------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/dbPOM?retryWrites=true&w=majority` |
   | `CORS_ORIGINS` | `https://pom-votrecompte.vercel.app` (l'URL de votre frontend Vercel) |
   | `MAILGUN_API_KEY` | Optionnel — laissez vide si vous n'utilisez pas les emails |
   | `MAILGUN_DOMAIN` | Optionnel |

6. Cliquez **Save and Deploy** 🚀

> `JWT_SECRET` est généré automatiquement par Render (`generateValue: true`).

---

### Option B – Via le tableau de bord Render (manuel)

1. **New** → **Web Service**
2. Connectez votre repo GitHub `florian2412/POM`
3. Configurez :

   | Paramètre | Valeur |
   |-----------|--------|
   | **Name** | `pom-api` |
   | **Root Directory** | `server-v2` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm ci && npm run build` |
   | **Start Command** | `npm start` |
   | **Plan** | Free (ou Starter pour always-on) |

4. **Environment Variables** — ajoutez :

   | Clé | Valeur |
   |-----|--------|
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `MONGODB_URI` | `mongodb+srv://...` |
   | `JWT_SECRET` | Générez avec : `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
   | `JWT_EXPIRES_IN` | `8h` |
   | `CORS_ORIGINS` | `https://pom-votrecompte.vercel.app` |

5. Cliquez **Create Web Service** 🚀

---

## Étape 3 – Connecter le frontend Vercel au backend Render

Après le déploiement, votre API est accessible à :
```
https://pom-api.onrender.com
```

### 3a — Mettre à jour la variable Vercel

Dans le tableau de bord Vercel de votre projet frontend :
- **Settings → Environment Variables**
- Modifiez `API_URL` :
  ```
  https://pom-api.onrender.com/api
  ```
- **Redéployez** depuis l'onglet **Deployments → Redeploy**

### 3b — Mettre à jour le CORS sur Render

Dans le tableau de bord Render → **Service pom-api → Environment** :
```
CORS_ORIGINS=https://pom-votrecompte.vercel.app
```
Render redémarre automatiquement le service.

---

## Vérification du déploiement

Une fois déployé, testez depuis votre navigateur ou terminal :

```bash
# Doit retourner {"api":"2.0.0"}
curl https://pom-api.onrender.com/api/version
```

---

## Note sur le Free tier Render

Le plan gratuit met le service **en veille** après 15 minutes d'inactivité.
La prochaine requête prend ~30 secondes pour "réveiller" le service.

**Pour éviter cela**, passez au plan **Starter** ($7/mois) qui garde le service toujours actif.

---

## Architecture complète déployée

```
Utilisateur
    │
    ▼
Vercel CDN (Angular SPA)
    │  API_URL=https://pom-api.onrender.com/api
    ▼
Render Web Service (Express API)
    │  MONGODB_URI=mongodb+srv://...
    ▼
MongoDB Atlas (M0 Free)
```

---

## Déploiements automatiques

Chaque `git push` sur la branche principale déclenche automatiquement :
- Un nouveau déploiement Render du backend
- Un nouveau déploiement Vercel du frontend

---

## Résolution des problèmes courants

### Erreur CORS (`Not allowed by CORS`)

➡️ Vérifiez que `CORS_ORIGINS` sur Render contient exactement l'URL Vercel avec `https://`.

### `Cannot connect to MongoDB`

➡️ Vérifiez que `MONGODB_URI` est correct et que `0.0.0.0/0` est autorisé dans Atlas Network Access.

### Build échoue — `tsc: command not found`

➡️ Assurez-vous que la Build Command est `npm ci && npm run build` (et non juste `npm start`).

### Service en veille (Free tier)

➡️ Le premier appel après inactivité peut prendre ~30s. C'est normal sur le plan gratuit.

---

## Référence des fichiers Render

| Fichier | Rôle |
|---------|------|
| `render.yaml` | Blueprint Render (infrastructure as code) |
| `server-v2/Dockerfile` | Utilisé si vous préférez déployer en mode Docker |
| `server-v2/.env.example` | Référence de toutes les variables d'environnement |
