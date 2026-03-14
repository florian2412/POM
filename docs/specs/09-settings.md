# 09 – Paramétrage (Settings)

## 1. Description

Le module de paramétrage expose des **référentiels dynamiques** utilisés partout dans l'application.
Ils sont définis côté serveur dans `settings.json` et exposés via l'API.

---

## 2. API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/settings` | Tout le paramétrage |
| `GET /api/settings/roles` | Rôles disponibles |
| `GET /api/settings/fonctions` | Fonctions/postes |
| `GET /api/settings/statuts` | Statuts (projets et tâches) |
| `GET /api/settings/categories` | Catégories de tâches |

**Accès** : authentifié uniquement

---

## 3. Valeurs de référence

### Rôles
```json
["admin", "manager", "collaborateur"]
```

### Statuts
```json
["Initial", "En cours", "Terminé(e)", "Annulé(e)", "Archivé"]
```

> Note : "Archivé" ne s'applique qu'aux projets, pas aux tâches.

### Catégories de tâches
```json
["Etude de projet", "Spécification", "Développement", "Recette", "Mise en production"]
```

### Fonctions
```json
[
  "Développeur", "Architecte", "Directeur",
  "Chef(fe) de projet technique", "Analyste-Programmeur", "Consultant(e)",
  "Administrateur réseaux", "Leader Technique",
  "Administrateur Base de données", "Webmaster",
  "Expert BI", "Chef(fe) de projet fonctionnel", "Expert ProLog"
]
```

---

## 4. Utilisation dans l'application

| Référentiel | Utilisé par |
|-------------|------------|
| statuts | Projet (formulaire), Tâche (formulaire), Statistiques |
| categories | Tâche (formulaire), Dashboard (code couleur), Statistiques |
| fonctions | Collaborateur (formulaire) |
| rôles | Collaborateur (formulaire), RBAC |
