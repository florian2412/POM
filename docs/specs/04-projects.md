# 04 – Projets

## 1. Liste des projets

**Route** : `/projects`  
**API** : `GET /api/projects` (admin) ou `GET /api/collaborators/:id/projects`

### Colonnes du tableau

| Colonne | Description |
|---------|-------------|
| Nom | Nom du projet |
| Code | Code auto-généré (ex: `2024P001`) |
| Chef de projet | Prénom + Nom |
| Statut | Avec code couleur |
| Date début | Format DD/MM/YYYY |
| Date fin théorique | Format DD/MM/YYYY |
| Actions | Voir, Archiver, Supprimer |

### Filtres

Filtrage par colonne activable. Pagination 10 éléments.

### Différence par rôle

| Rôle | Projets visibles |
|------|-----------------|
| admin | Tous les projets |
| manager | Projets où il est affecté |
| collaborateur | Projets où il est affecté |

---

## 2. Création d'un projet

**Route** : `/projects/create`  
**API** : `POST /api/projects`  
**Accès** : admin, manager

### Champs

| Champ | Type | Règle |
|-------|------|-------|
| Nom | text | Requis |
| Code | auto | Généré automatiquement (YYYY-PXXX) |
| Date de début | date | Requis, jours ouvrés uniquement |
| Date de fin théorique | date | Requis, ≥ date début |
| Description | textarea | Optionnel |
| Ligne budgétaire | select | Requis, choisie dans la liste des budgets |
| Collaborateurs | dialog | Sélection multiple via popup |

### Génération automatique du code projet

```
Format : {ANNÉE}P{NNN}
Exemple : 2024P001, 2024P002, 2025P001

Algorithme :
1. Récupérer tous les projets de l'année en cours
2. Trier par code décroissant
3. Incrémenter le numéro du dernier code
4. Si aucun projet cette année : {ANNÉE}P001
```

### Comportement

- Le créateur est automatiquement chef de projet et ajouté aux collaborateurs
- Statut initial : "Initial"
- `date_derniere_modif` = date de création

---

## 3. Détail et modification d'un projet

**Route** : `/projects/:id/info`  
**API** : `GET /api/projects/:id`, `PUT /api/projects/:id`  
**Accès** : Lecture = tous, Écriture = admin, manager

### Onglets de navigation

| Onglet | Route |
|--------|-------|
| Informations | `/projects/:id/info` |
| Tâches | `/projects/:id/tasks` |

### Champs modifiables

| Champ | Règle |
|-------|-------|
| Nom | Requis |
| Statut | En cours, Annulé(e) (pas Initial ni Terminé(e) via ce formulaire) |
| Date début | Requis |
| Date fin théorique | Requis, ≥ date début |
| Ligne budgétaire | Requis |
| Collaborateurs | Sélection multiple via popup |
| Description | Optionnel |

### Informations affichées en lecture seule

- Code projet
- Chef de projet
- Durée en jours ouvrés = `dateDiff(date_debut, date_fin_theorique)`

---

## 4. Clôture d'un projet

**Action** : Bouton "Clôturer le projet" dans le détail  
**API** : `PUT /api/projects/:id` avec `{ statut: "Terminé(e)", date_fin_reelle: now }`  
**Accès** : admin, manager

### Validation

Avant de clôturer, **vérifier que toutes les tâches** sont dans l'état "Terminé(e)" ou "Annulé(e)".

Si des tâches sont "En cours" ou "Initial" → afficher un dialog d'erreur :
> "Vous devez finaliser toutes les tâches associées au projet avant de pouvoir le terminer."

---

## 5. Archivage d'un projet

**Action** : Bouton "Archiver" dans la liste des projets  
**API** : `PUT /api/projects/:id` avec `{ statut: "Archivé" }`  
**Accès** : admin, manager

### Validation

Même règle que la clôture : aucune tâche "En cours" ou "Initial".

---

## 6. Suppression d'un projet

**API** : `DELETE /api/projects/:id`  
**Accès** : admin, manager

---

## 7. Statuts projet

| Statut | Description |
|--------|-------------|
| Initial | Créé, pas encore démarré |
| En cours | En cours d'exécution |
| Terminé(e) | Clôturé avec date de fin réelle |
| Annulé(e) | Annulé |
| Archivé | Archivé après clôture de toutes les tâches |

---

## 8. Calcul de l'avancement

```
Avancement = (coût total des tâches / montant ligne budgétaire) × 100
```

Où le coût d'une tâche = `cout_horaire × 7h × durée_ouvrée × nb_collaborateurs`
