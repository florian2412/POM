# 10 – Documentation de l'API REST

## Base URL

```
http://localhost:3000/api
```

## Authentification

Toutes les routes (sauf `/api/auth/login` et `/api/auth/reset-password`) nécessitent :
```
Authorization: Bearer <jwt_token>
```

---

## /api/auth

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| POST | /auth/login | ❌ | public | Connexion |
| POST | /auth/reset-password | ❌ | public | Réinitialisation MDP par email |
| GET | /auth/me | ✅ | tous | Profil courant |
| PUT | /auth/change-password | ✅ | tous | Changer son MDP |

### POST /api/auth/login
```json
// Request body
{ "pseudo": "admin", "mot_de_passe": "password123" }

// Response 200
{
  "success": true,
  "token": "<jwt>",
  "collaborator": { "_id": "...", "pseudo": "admin", "role": "admin", "nom": "...", ... }
}

// Response 401
{ "success": false, "message": "Identifiants incorrects" }
```

---

## /api/collaborators

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| GET | / | ✅ | admin, manager | Liste tous |
| GET | /:id | ✅ | tous | Un collaborateur |
| GET | /role/:role | ✅ | admin, manager | Par rôle |
| GET | /:id/projects | ✅ | tous | Projets d'un collaborateur |
| POST | / | ✅ | admin, manager | Créer |
| PUT | /:id | ✅ | admin, manager | Modifier |
| DELETE | /:id | ✅ | admin | Supprimer |

### POST /api/collaborators (body)
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "pseudo": "jdupont",
  "email": "jean@example.com",
  "mot_de_passe": "password123",
  "role": "collaborateur",
  "fonction": "Développeur",
  "cout_horaire": 60
}
```

---

## /api/projects

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| GET | / | ✅ | tous | Tous les projets |
| GET | /:id | ✅ | tous | Un projet (avec tâches) |
| POST | / | ✅ | admin, manager | Créer |
| PUT | /:id | ✅ | admin, manager | Modifier |
| DELETE | /:id | ✅ | admin, manager | Supprimer |

### Modèle Project (réponse)
```json
{
  "_id": "...",
  "nom": "Projet Alpha",
  "code": "2024P001",
  "statut": "En cours",
  "chef_projet": { "_id": "...", "nom": "...", "prenom": "..." },
  "date_debut": "2024-01-15T00:00:00.000Z",
  "date_fin_theorique": "2024-06-30T00:00:00.000Z",
  "date_fin_reelle": null,
  "collaborateurs": [{ "_id": "...", "nom": "...", "prenom": "..." }],
  "ligne_budgetaire": { "id": "...", "montant_restant": 50000 },
  "description": "...",
  "taches": [
    {
      "_id": "...",
      "libelle": "Tâche 1",
      "code": "2024P001T001",
      "categorie": "Développement",
      "statut": "Initial",
      "collaborateurs": ["<id1>", "<id2>"],
      "date_debut": "2024-01-15T00:00:00.000Z",
      "date_fin_theorique": "2024-02-28T00:00:00.000Z"
    }
  ]
}
```

---

## /api/budgets

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| GET | / | ✅ | admin | Liste tous |
| GET | /:id | ✅ | admin | Un budget |
| POST | / | ✅ | admin | Créer |
| PUT | /:id | ✅ | admin | Modifier |
| DELETE | /:id | ✅ | admin | Supprimer |

---

## /api/settings

| Méthode | Endpoint | Auth | Rôle | Description |
|---------|----------|------|------|-------------|
| GET | / | ✅ | tous | Tout le paramétrage |
| GET | /roles | ✅ | tous | Rôles |
| GET | /fonctions | ✅ | tous | Fonctions |
| GET | /statuts | ✅ | tous | Statuts |
| GET | /categories | ✅ | tous | Catégories de tâches |

---

## /api/version

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | / | ❌ | Version de l'API |

---

## Codes d'erreur

| Code HTTP | Description |
|-----------|-------------|
| 200 | Succès |
| 201 | Ressource créée |
| 401 | Non authentifié ou token invalide/expiré |
| 403 | Accès refusé (rôle insuffisant) |
| 404 | Ressource introuvable |
| 409 | Conflit (ex: pseudo déjà utilisé) |
| 422 | Données invalides (validation échouée) |
| 429 | Trop de requêtes (rate limiting) |
| 500 | Erreur serveur interne |

---

## Format de réponse d'erreur

```json
{
  "success": false,
  "message": "Description de l'erreur"
}
```

## Format de réponse de validation

```json
{
  "success": false,
  "errors": [
    { "msg": "Email invalide", "path": "email" }
  ]
}
```
