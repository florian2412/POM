import { Routes } from '@angular/router';
import { authGuard, roleGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Public: auth module
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // Protected: main layout
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/projects/projects.routes').then((m) => m.PROJECT_ROUTES),
      },
      {
        path: 'collaborators',
        canActivate: [roleGuard('admin', 'manager')],
        loadChildren: () =>
          import('./features/collaborators/collaborators.routes').then((m) => m.COLLABORATOR_ROUTES),
      },
      {
        path: 'budgets',
        canActivate: [roleGuard('admin')],
        loadChildren: () =>
          import('./features/budgets/budgets.routes').then((m) => m.BUDGET_ROUTES),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./features/account/account.component').then((m) => m.AccountComponent),
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./features/statistics/statistics.component').then((m) => m.StatisticsComponent),
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./features/help/help.component').then((m) => m.HelpComponent),
      },
      {
        path: 'restricted',
        loadComponent: () =>
          import('./shared/components/restricted/restricted.component').then((m) => m.RestrictedComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];
