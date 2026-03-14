# 05 – Tâches

## 1. Contexte

Les tâches sont **embarquées dans le document Project** (MongoDB embedded documents).
Elles sont accessibles via les routes projets : `GET /api/projects/:id` retourne le projet avec son tableau `taches`.

---

## 2. Liste des tâches d'un projet

**Route Angular** : `/projects/:id/tasks`  
**API** : `GET /api/projects/:id` (champ `taches`)

### Colonnes

| Colonne | Description |
|---------|-------------|
| Libellé | Nom de la tâche |
| Code | Ex: `2024P001T001` |
| Catégorie | Avec code couleur |
| Statut | Avec code couleur |
| Date début | Format DD/MM/YYYY |
| Date fin théorique | Format DD/MM/YYYY |
| Actions | Voir, Supprimer |

---

## 3. Création d'une tâche

**Route Angular** : `/projects/:id/tasks/create`  
**API** : `PUT /api/projects/:id` (ajout au tableau `taches`)  
**Accès** : admin, manager

### Champs

| Champ | Type | Règle |
|-------|------|-------|
| Libellé | text | Requis |
| Code | auto | Généré automatiquement |
| Catégorie | select | Requis |
| Description | textarea | Optionnel |
| Date début | date | Requis, jours ouvrés, ≥ date_debut du projet |
| Date fin théorique | date | Requis, jours ouvrés, ≤ date_fin_theorique du projet |
| Collaborateurs | dialog | Sélection parmi les collaborateurs du projet |

### Génération automatique du code tâche

```
Format : {CODE_PROJET}T{NNN}
Exemple : 2024P001T001, 2024P001T002

Algorithme :
1. Récupérer toutes les tâches existantes du projet
2. Extraire les numéros (positions 9 à 12 du code)
3. Prendre le maximum + 1
4. Formater avec zéros de remplissage sur 3 chiffres
```

### Comportement

- Statut initial : "Initial"
- `date_derniere_modif` = date de création

---

## 4. Détail et modification d'une tâche

**Route Angular** : `/projects/:id/tasks/:taskId`  
**API** : `PUT /api/projects/:id` (mise à jour du projet avec tâche modifiée)  
**Accès** : Lecture = tous, Écriture = admin, manager

### Champs modifiables

| Champ | Règle |
|-------|-------|
| Libellé | Requis |
| Description | Optionnel |
| Statut | Initial, En cours, Terminé(e), Annulé(e) |
| Date début | Requis, ≥ date_debut projet |
| Date fin théorique | Requis, ≤ date_fin_theorique projet |
| Date fin réelle | Disponible seulement si statut = "Terminé(e)" |
| Collaborateurs | Sélection parmi les collaborateurs du projet |

### Règle spéciale

La **date de fin réelle** n'est saisie que lorsque le statut passe à "Terminé(e)".
Si le statut n'est pas "Terminé(e)", ce champ est désactivé.

---

## 5. Suppression d'une tâche

**Action** : Bouton dans la liste des tâches  
**API** : Récupération du projet, suppression de la tâche du tableau `taches`, `PUT /api/projects/:id`  
**Accès** : admin, manager

---

## 6. Statuts de tâche

| Statut | Description |
|--------|-------------|
| Initial | Créée, pas démarrée |
| En cours | En cours d'exécution |
| Terminé(e) | Terminée avec date_fin_reelle |
| Annulé(e) | Annulée |

> Note : "Archivé" n'est pas un statut de tâche (seulement de projet).

---

## 7. Catégories de tâches

| Catégorie | Code couleur |
|-----------|-------------|
| Etude de projet | Rouge |
| Spécification | Orange |
| Développement | Bleu |
| Recette | Jaune |
| Mise en production | Vert |

---

## 8. Calcul du coût d'une tâche

```
coût_total = Σ (cout_horaire[collaborateur_i] × 7 × durée_jours_ouvrés)

durée_jours_ouvrés = nombre de jours ouvrés entre date_debut et date_fin_theorique
cout_horaire = champ cout_horaire du collaborateur (€/h)
7 = heures par jour de travail
```

---

## 9. Statistiques tâche

Selon le statut :

| Statut | leftDuration | realDuration | advancement |
|--------|-------------|--------------|-------------|
| Initial | = duration | 0 | 0% |
| En cours | duration - passedDuration | passedDuration | (nowCost/totalCost)×100 |
| Terminé(e) | 0 | getTotalRealTime() | (nowCost/totalCost)×100 |
| Annulé(e) | 0 | 0 | 0% |
