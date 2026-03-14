import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/auth.guard';

export const COLLABORATOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/collaborators-list.component').then((m) => m.CollaboratorsListComponent),
  },
  {
    path: 'create',
    canActivate: [roleGuard('admin', 'manager')],
    loadComponent: () =>
      import('./create/collaborators-create.component').then((m) => m.CollaboratorsCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./detail/collaborators-detail.component').then((m) => m.CollaboratorsDetailComponent),
  },
];
