# 01 – Vue générale de l'application POM

## 1. Présentation

**POM** (Plan, Organize & Manage) est une application web de gestion de projets orientée équipe.
Elle permet de piloter des projets de bout en bout : création, planification, affectation d'équipe, suivi des tâches, contrôle budgétaire et analyse statistique.

## 2. Périmètre fonctionnel

| Module | Description |
|--------|-------------|
| Authentification | Connexion par pseudo/mot de passe, gestion de session |
| Tableau de bord | Vue personnalisée des tâches et projets en cours |
| Projets | Création, modification, archivage, clôture de projets |
| Tâches | Gestion des tâches dans chaque projet (CRUD + affectation) |
| Collaborateurs | Gestion des membres de l'équipe (CRUD + rôles) |
| Lignes budgétaires | Gestion des enveloppes financières par projet |
| Statistiques | Tableaux de bord graphiques (statuts, durées, coûts) |
| Aide | Documentation intégrée par thème |

## 3. Acteurs (rôles utilisateur)

| Rôle | Accès |
|------|-------|
| **admin** | Accès total : tous les modules y compris budgets, collaborateurs complets, projets de tous les utilisateurs |
| **manager** | Projets (voir/créer/modifier), tâches, collaborateurs de son équipe (créer, voir) |
| **collaborateur** | Tableau de bord, ses propres projets/tâches, son compte |
| **public** | Page de connexion uniquement |

## 4. Architecture technique

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT (Angular 21)                   │
│  ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌─────────────┐  │
│  │  Auth    │ │Projects │ │  Tasks   │ │Collaborators│  │
│  │Dashboard │ │  CRUD   │ │  CRUD    │ │   CRUD      │  │
│  │Statistics│ │  +tabs  │ │+code gen │ │  +budgets   │  │
│  └──────────┘ └─────────┘ └──────────┘ └─────────────┘  │
│              HTTP + JWT Bearer token                      │
└─────────────────────────┬────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────┐
│               API (Node.js / Express 5)                   │
│  /api/auth    /api/projects  /api/collaborators           │
│  /api/budgets /api/settings  /api/version                 │
│   + Helmet, CORS, Rate-limit, express-validator           │
└─────────────────────────┬────────────────────────────────┘
                          │ Mongoose 9
┌─────────────────────────▼────────────────────────────────┐
│                      MongoDB                              │
│  Collections: collaborateurs, projects, budgets           │
└──────────────────────────────────────────────────────────┘
```

## 5. Modèle de données

### Collaborateur
```
_id, nom, prenom, pseudo (unique), email (unique),
mot_de_passe (hash bcrypt), role (admin|manager|collaborateur),
manager (_id ref), fonction, cout_horaire,
date_creation, date_derniere_modif
```

### Project
```
_id, nom, code (ex: 2024P001), chef_projet (_id ref),
date_debut, date_fin_theorique, date_fin_reelle,
statut (Initial|En cours|Terminé(e)|Annulé(e)|Archivé),
collaborateurs [_id ref],
ligne_budgetaire { id: _id ref, montant_restant: Number },
description, taches [Task embedded],
date_creation, date_derniere_modif
```

### Task (embarquée dans Project)
```
_id, libelle, code (ex: 2024P001-T001), description,
categorie (Etude de projet|Spécification|Développement|Recette|Mise en production),
date_debut, date_fin_theorique, date_fin_reelle,
statut (Initial|En cours|Terminé(e)|Annulé(e)),
collaborateurs [_id ref], projet_id,
date_creation, date_derniere_modif
```

### Budget
```
_id, libelle, montant (€), description,
date_creation, date_derniere_modif
```

## 6. Flux principal

```
Connexion → Tableau de bord → [Projets] → Détail Projet → [Tâches]
                            → [Collaborateurs]
                            → [Budgets]  (admin seulement)
                            → [Statistiques]
```

## 7. Règles métier clés

1. **Code projet** : format `{ANNÉE}P{NNN}` auto-incrémenté par année (ex: `2024P001`)
2. **Code tâche** : format `{CODE_PROJET}T{NNN}` auto-incrémenté par projet (ex: `2024P001T001`)
3. **Archivage projet** : impossible si des tâches sont "En cours" ou "Initial"
4. **Clôture projet** : passe au statut "Terminé(e)" et enregistre `date_fin_reelle`
5. **Coût tâche** : `cout_horaire × 7 heures × durée_jours_ouvrés × nb_collaborateurs`
6. **Avancement projet** : % du budget consommé par les tâches
7. **Durée** : calculée en jours ouvrés uniquement (hors samedi et dimanche)
8. **Tâches urgentes** : fin théorique dans ≤ 3 jours ouvrés
9. **Tâches à venir** : début dans 1 à 6 jours ouvrés
