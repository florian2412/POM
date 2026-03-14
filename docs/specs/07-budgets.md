# 07 – Lignes budgétaires

## 1. Description

Les lignes budgétaires représentent les **enveloppes financières** allouées à des projets.
Un projet est associé à exactement une ligne budgétaire. Plusieurs projets peuvent partager la même ligne.

**Accès** : admin uniquement pour toutes les opérations.

---

## 2. Liste des budgets

**Route** : `/budgets`  
**API** : `GET /api/budgets`

### Colonnes

| Colonne | Description |
|---------|-------------|
| Libellé | Nom de la ligne budgétaire |
| Montant | Montant total en € |
| Description | Description libre |
| Consommation | % du budget consommé par les projets |
| Actions | Supprimer |

### Calcul de la consommation

```
consommation (%) = (coût_total_tâches_projets / montant_ligne) × 100

coût_total_tâches = Σ coût_tâche pour toutes les tâches
                    de tous les projets liés à cette ligne

coût_tâche = cout_horaire × 7 × durée_jours_ouvrés × nb_collaborateurs
```

---

## 3. Création d'une ligne budgétaire

**Route** : `/budgets/create`  
**API** : `POST /api/budgets`

### Champs

| Champ | Type | Règle |
|-------|------|-------|
| Libellé | text | Requis |
| Montant | number | Requis, ≥ 0 |
| Description | textarea | Optionnel |

---

## 4. Suppression

**API** : `DELETE /api/budgets/:id`  
**Accès** : admin uniquement

> ⚠️ Supprimer une ligne budgétaire utilisée par des projets peut rendre les projets invalides. Aucune contrainte d'intégrité référentielle n'est actuellement appliquée (amélioration possible).

---

## 5. Association projet ↔ budget

Dans le modèle Project :
```json
"ligne_budgetaire": {
  "id": "<budget_id>",
  "montant_restant": 50000
}
```

`montant_restant` est initialisé avec `montant` du budget à la création du projet.
