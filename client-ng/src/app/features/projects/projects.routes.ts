import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/auth.guard';

export const PROJECT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/projects-list.component').then((m) => m.ProjectsListComponent),
  },
  {
    path: 'create',
    canActivate: [roleGuard('admin', 'manager')],
    loadComponent: () =>
      import('./create/projects-create.component').then((m) => m.ProjectsCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./detail/projects-detail.component').then((m) => m.ProjectsDetailComponent),
  },
  {
    path: ':id/tasks',
    loadChildren: () =>
      import('../tasks/tasks.routes').then((m) => m.TASK_ROUTES),
  },
];
