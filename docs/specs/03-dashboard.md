# 03 – Tableau de bord (Dashboard)

## 1. Description

Le tableau de bord est la page d'accueil après connexion. Il offre une **vue personnalisée** centrée sur le collaborateur connecté, avec ses tâches et ses projets en cours.

---

## 2. Données affichées

### 2.1 Compteurs de tâches

| Compteur | Règle de calcul |
|----------|-----------------|
| Nouvelles tâches | Tâches "Initial" du collaborateur, dans des projets "En cours" |
| Tâches urgentes | Tâches "En cours" dont `date_fin_theorique` est dans ≤ 3 jours ouvrés |
| Tâches à venir | Tâches "Initial" dont `date_debut` est dans 1 à 6 jours ouvrés |
| Tâches terminées | Tâches "Terminé(e)" du collaborateur |
| Tâches annulées | Tâches "Annulé(e)" du collaborateur |
| Total | Toutes les tâches du collaborateur dans les projets "En cours" |

### 2.2 Tableau des tâches

Affiche les **tâches de l'utilisateur courant** (toutes catégories confondues) :
- Libellé
- Catégorie (avec code couleur)
- Statut (avec code couleur)
- Date de début
- Date de fin théorique

Pagination : 10 éléments par page, filtres activables.

### 2.3 Tableau des projets

Affiche les **projets auxquels le collaborateur est affecté** :
- Nom du projet
- Chef de projet
- Statut
- Durée (jours ouvrés)
- Progression (% budget consommé)

---

## 3. Code couleur des catégories de tâches

| Catégorie | Couleur |
|-----------|---------|
| Etude de projet | Rouge |
| Spécification | Orange |
| Développement | Bleu |
| Recette | Jaune |
| Mise en production | Vert |

## 4. Code couleur des statuts

| Statut | Couleur |
|--------|---------|
| Initial | Bleu |
| En cours | Orange |
| Terminé(e) | Vert |
| Annulé(e) | Rouge |
| Archivé | Gris |

---

## 5. Calcul de l'urgence

```
URGENT = date_fin_theorique dans ≤ 3 jours ouvrés à partir d'aujourd'hui
À VENIR = date_debut dans 1 à 6 jours ouvrés
```

Les jours ouvrés excluent samedi et dimanche.

---

## 6. Chargement des données

À l'initialisation du composant :
1. `GET /api/collaborators` → liste des collaborateurs (pour résoudre les noms)
2. `GET /api/budgets` → lignes budgétaires (pour calculer l'avancement)
3. `GET /api/collaborators/:id/projects` → projets du collaborateur courant
4. Calcul des statistiques projet + classification des tâches

---

## 7. Accès

Accessible par tous les rôles authentifiés.
