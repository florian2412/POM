import { Routes } from '@angular/router';

export const BUDGET_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/budgets-list.component').then((m) => m.BudgetsListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create/budgets-create.component').then((m) => m.BudgetsCreateComponent),
  },
];
