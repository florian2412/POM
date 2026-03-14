# POM – Plan, Organize & Manage
## Dossier de spécifications fonctionnelles et techniques

> **Version** : 2.0  
> **Date** : 2026  
> **Auteur** : Généré à partir de l'analyse complète du code source v1

---

## Table des matières

| # | Document | Description |
|---|----------|-------------|
| 01 | [Vue générale](./01-overview.md) | Architecture, périmètre, acteurs |
| 02 | [Authentification & RBAC](./02-authentication.md) | Login, JWT, rôles, guards |
| 03 | [Tableau de bord](./03-dashboard.md) | Dashboard, tâches critiques |
| 04 | [Projets](./04-projects.md) | CRUD, code auto, archivage, clôture |
| 05 | [Tâches](./05-tasks.md) | CRUD, catégories, code auto, validations |
| 06 | [Collaborateurs](./06-collaborators.md) | CRUD, rôles, affectation |
| 07 | [Lignes budgétaires](./07-budgets.md) | CRUD, consommation, calculs |
| 08 | [Statistiques](./08-statistics.md) | Graphiques, KPIs |
| 09 | [Paramétrage](./09-settings.md) | Référentiels dynamiques |
| 10 | [API REST](./10-api.md) | Documentation complète des endpoints |
| 11 | [Déploiement](./11-deployment.md) | Docker, variables d'environnement |

---

## Synthèse rapide

POM est une application de **gestion de projets** interne, conçue pour permettre à une équipe de :

- **Planifier** des projets avec des dates, un budget et une équipe
- **Organiser** les tâches par catégorie, statut et collaborateur
- **Gérer** les collaborateurs avec des rôles différenciés
- **Mesurer** l'avancement via des statistiques et des graphiques
- **Contrôler** les budgets via des lignes budgétaires partagées entre projets

## Stack technique v2

| Couche | Technologie |
|--------|------------|
| Frontend | Angular 21 + Angular Material 21 + Chart.js |
| Backend | Node.js 20 + Express 5 |
| Base de données | MongoDB 6+ (Mongoose 9) |
| Auth | JWT (jsonwebtoken 9) |
| Sécurité | Helmet, rate-limit, express-validator, bcrypt |
| Déploiement | Docker + docker-compose |
