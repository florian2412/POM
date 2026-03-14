# 02 – Authentification et contrôle d'accès (RBAC)

## 1. Authentification

### 1.1 Connexion

**Endpoint** : `POST /api/auth/login`

| Champ | Type | Règle |
|-------|------|-------|
| pseudo | string | Requis |
| mot_de_passe | string | Requis |

**Flux** :
1. L'utilisateur saisit son pseudo et son mot de passe
2. Le backend recherche le collaborateur par `pseudo` (insensible à la casse)
3. Compare le mot de passe fourni au hash bcrypt stocké
4. Si succès : génère un JWT signé (payload : `{ id, role }`) avec expiration configurable (défaut 8h)
5. Retourne le token et les informations du collaborateur (sans le mot de passe)
6. Le client stocke le token dans `localStorage` (clé `pom_jwt`)

**Réponse succès** :
```json
{
  "success": true,
  "token": "<jwt>",
  "collaborator": { "_id": "...", "pseudo": "admin", "role": "admin", ... }
}
```

**Réponse échec** :
```json
{ "success": false, "message": "Identifiants incorrects" }
```

> **Sécurité** : Le message d'erreur ne distingue pas "pseudo incorrect" de "mot de passe incorrect" pour éviter l'énumération de comptes.

### 1.2 Déconnexion

Côté client uniquement : suppression du `localStorage` + redirection vers `/auth/login`.

### 1.3 Réinitialisation de mot de passe

**Endpoint** : `POST /api/auth/reset-password`

1. L'utilisateur saisit son pseudo
2. Le backend génère un mot de passe aléatoire (16 caractères hex)
3. Hash le nouveau mot de passe et le stocke
4. Envoie l'email via Mailgun (si configuré)
5. Retourne **toujours** le même message (ne révèle pas si le compte existe)

### 1.4 Changement de mot de passe

**Endpoint** : `PUT /api/auth/change-password` (authentifié)

| Champ | Règle |
|-------|-------|
| current_password | Requis, vérifié contre le hash actuel |
| new_password | Requis, minimum 8 caractères |

### 1.5 Profil courant

**Endpoint** : `GET /api/auth/me` (authentifié)

Retourne les données du collaborateur connecté.

---

## 2. JWT (JSON Web Token)

| Paramètre | Valeur |
|-----------|--------|
| Algorithme | HS256 |
| Payload | `{ id: ObjectId, role: string, iat, exp }` |
| Durée | 8h (configurable via `JWT_EXPIRES_IN`) |
| Secret | Variable d'env `JWT_SECRET` (min 64 caractères recommandé) |
| Transport | Header `Authorization: Bearer <token>` |

**Interception côté client** : `authInterceptor` (Angular functional interceptor) ajoute automatiquement le header sur toutes les requêtes HTTP sortantes.

---

## 3. Rôles et permissions (RBAC)

### Matrice des accès

| Fonctionnalité | admin | manager | collaborateur |
|----------------|-------|---------|---------------|
| Tableau de bord | ✅ | ✅ | ✅ |
| Voir tous les projets | ✅ | ❌ (ses projets) | ❌ (ses projets) |
| Créer un projet | ✅ | ✅ | ❌ |
| Modifier un projet | ✅ | ✅ (ses projets) | ❌ |
| Archiver un projet | ✅ | ✅ | ❌ |
| Clôturer un projet | ✅ | ✅ | ❌ |
| Supprimer un projet | ✅ | ✅ | ❌ |
| Voir les tâches | ✅ | ✅ | ✅ (ses projets) |
| Créer une tâche | ✅ | ✅ | ❌ |
| Modifier une tâche | ✅ | ✅ | ❌ |
| Supprimer une tâche | ✅ | ✅ | ❌ |
| Voir les collaborateurs | ✅ | ✅ | ❌ |
| Créer un collaborateur | ✅ | ✅ (role collaborateur uniquement) | ❌ |
| Modifier un collaborateur | ✅ | ✅ (les siens) | ❌ |
| Supprimer un collaborateur | ✅ | ❌ | ❌ |
| Voir les budgets | ✅ | ❌ | ❌ |
| Créer/modifier un budget | ✅ | ❌ | ❌ |
| Supprimer un budget | ✅ | ❌ | ❌ |
| Voir les statistiques | ✅ | ✅ | ✅ |
| Modifier son compte | ✅ | ✅ | ✅ |

### Règle particulière pour le manager

- Ne peut créer que des collaborateurs avec le rôle `collaborateur`
- L'identifiant manager est automatiquement celui du manager connecté

---

## 4. Guards Angular

| Guard | Description |
|-------|-------------|
| `authGuard` | Redirige vers `/auth/login` si non authentifié |
| `roleGuard(...roles)` | Redirige vers `/restricted` si rôle insuffisant |
| `publicGuard` | Redirige vers `/` si déjà authentifié (page login) |

---

## 5. Middleware Express

| Middleware | Description |
|------------|-------------|
| `authMiddleware` | Vérifie le Bearer token JWT, injecte `req.user = { id, role }` |
| `requireRole(...roles)` | Vérifie que le rôle du token est dans la liste autorisée |

---

## 6. Rate limiting

| Zone | Limite |
|------|--------|
| Global API | 200 requêtes / 15 minutes |
| `/api/auth/*` | 20 requêtes / 15 minutes |
