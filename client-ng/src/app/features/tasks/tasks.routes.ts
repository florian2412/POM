import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/auth.guard';

export const TASK_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/tasks-list.component').then((m) => m.TasksListComponent),
  },
  {
    path: 'create',
    canActivate: [roleGuard('admin', 'manager')],
    loadComponent: () =>
      import('./create/tasks-create.component').then((m) => m.TasksCreateComponent),
  },
  {
    path: ':taskId',
    loadComponent: () =>
      import('./detail/tasks-detail.component').then((m) => m.TasksDetailComponent),
  },
];
