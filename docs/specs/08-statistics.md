# 08 – Statistiques

## 1. Description

La page de statistiques présente des **graphiques Highcharts/Chart.js** analysant les projets et les tâches. Elle est accessible à tous les rôles authentifiés.

---

## 2. Onglet 1 – Vue globale des projets

### 2.1 Pie chart – Répartition des projets par statut

```
Données : tous les projets
Calcul : countObjectsByTermFromNbTerm([p.statut for p in projets])
Résultat : { statut: count } ex: { "En cours": 3, "Initial": 2, "Terminé(e)": 5 }
```

### 2.2 Bar chart – Nombre de projets par statut

Même données, représentation en colonnes verticales.

### 2.3 Bar chart – Durée théorique vs réelle des projets

```
Données : tous les projets
Pour chaque projet :
  - Durée théorique = dateDiffWorkingDates(date_debut, date_fin_theorique)
  - Durée réelle = dateDiffWorkingDates(date_debut, date_fin_reelle) ou 0
```

### 2.4 Bar chart horizontal – Statut des tâches par projet

```
Pour chaque projet : nombre de tâches par statut
Représentation : séries empilées horizontales
```

---

## 3. Onglet 2 – Zoom sur un projet

L'utilisateur sélectionne un projet dans un menu déroulant.

### 3.1 Pie chart – Répartition des tâches par statut

Même logique que 2.1 mais pour les tâches du projet sélectionné.

### 3.2 Bar chart – Tâches par statut

### 3.3 Pie chart – Coût des tâches par tâche

```
Pour chaque tâche du projet :
  coût = cout_horaire × 7 × durée_jours_ouvrés × nb_collaborateurs
```

### 3.4 Pie chart – Consommation budget

```
consommation (%) = somme(coût_tâches) / montant_ligne_budgetaire × 100
```

### 3.5 Bar chart – Durée théorique vs réelle des tâches

```
Pour chaque tâche :
  - Durée théorique = dateDiffWorkingDates(date_debut, date_fin_theorique)
  - Durée réelle = dateDiffWorkingDates(date_debut, date_fin_reelle) ou 0
```

### 3.6 Bar chart – Répartition par catégorie

Nombre de tâches par catégorie.

---

## 4. Calculs utilitaires

### Durée en jours ouvrés

```javascript
function dateDiffWorkingDates(start, end) {
  let count = 0;
  let current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++; // exclure sam=6 et dim=0
    current.setDate(current.getDate() + 1);
  }
  return count;
}
```

### Temps passé (getSpentTime)

```
passedDuration = dateDiffWorkingDates(date_debut, today)
```

### Temps réel total (getTotalRealTime)

```
realDuration = dateDiffWorkingDates(date_debut, date_fin_reelle)
```

---

## 5. Données requises

À l'initialisation :
1. `GET /api/projects` – tous les projets avec leurs tâches
2. `GET /api/collaborators` – pour les coûts horaires
3. `GET /api/budgets` – pour les montants de ligne
4. `GET /api/settings/statuts` – liste des statuts
