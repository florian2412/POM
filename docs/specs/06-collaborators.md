# 06 – Collaborateurs

## 1. Liste des collaborateurs

**Route** : `/collaborators`  
**API** : `GET /api/collaborators`  
**Accès** : admin, manager

### Colonnes

| Colonne | Description |
|---------|-------------|
| Nom complet | Prénom + Nom |
| Pseudo | Login unique |
| Email | Adresse email |
| Fonction | Poste occupé |
| Rôle | admin / manager / collaborateur |
| Manager | Prénom + Nom du manager |
| Actions | Voir/Modifier, Supprimer |

---

## 2. Création d'un collaborateur

**Route** : `/collaborators/create`  
**API** : `POST /api/collaborators`  
**Accès** : admin, manager

### Champs

| Champ | Type | Règle |
|-------|------|-------|
| Prénom | text | Requis |
| Nom | text | Requis |
| Pseudo | text | Requis, unique |
| Email | email | Requis, unique, format valide |
| Mot de passe | password | Requis, ≥ 8 caractères |
| Rôle | select | Requis |
| Fonction | select | Optionnel |
| Coût horaire (€/h) | number | Optionnel, ≥ 0 |
| Manager | select | Optionnel |

### Règles par rôle créateur

| Rôle créateur | Rôles assignables | Manager auto |
|---------------|-------------------|--------------|
| admin | manager, collaborateur (pas admin) | Libre |
| manager | collaborateur uniquement | Manager connecté |

---

## 3. Détail et modification

**Route** : `/collaborators/:id`  
**API** : `GET /api/collaborators/:id`, `PUT /api/collaborators/:id`  
**Accès** : admin (tous), manager (son équipe)

### Champs modifiables

Mêmes champs que la création (sauf mot de passe via ce formulaire).

> Le changement de mot de passe se fait via **Mon profil** (`PUT /api/auth/change-password`).

---

## 4. Suppression

**API** : `DELETE /api/collaborators/:id`  
**Accès** : admin uniquement

---

## 5. Projets d'un collaborateur

**API** : `GET /api/collaborators/:id/projects`  
Retourne tous les projets où le collaborateur est dans le champ `collaborateurs[]`.

---

## 6. Fonctions disponibles

Définies dans `settings.fonctions` :

- Développeur
- Architecte
- Directeur
- Chef(fe) de projet technique
- Analyste-Programmeur
- Consultant(e)
- Administrateur réseaux
- Leader Technique
- Administrateur Base de données
- Webmaster
- Expert BI
- Chef(fe) de projet fonctionnel
- Expert ProLog

---

## 7. Mon profil (AccountComponent)

**Route** : `/account`  
**Accès** : tous les rôles

Affiche :
- Informations personnelles (lecture seule)
- Nom du manager (si défini)
- Formulaire de changement de mot de passe

### Changement de mot de passe

`PUT /api/auth/change-password`

| Champ | Règle |
|-------|-------|
| Mot de passe actuel | Requis, vérifié |
| Nouveau mot de passe | Requis, ≥ 8 caractères |
