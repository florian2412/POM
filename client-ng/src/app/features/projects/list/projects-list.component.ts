import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { Project } from '../../../core/models/project.model';
import { STATUS_COLORS } from '../../../core/services/stats.utils';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    DatePipe,
  ],
  template: `
    <div class="page-header">
      <h2>Projets</h2>
      @if (canCreate()) {
        <a mat-raised-button color="primary" routerLink="/projects/create">
          <mat-icon>add</mat-icon> Nouveau projet
        </a>
      }
    </div>

    @if (loading()) {
      <div class="center"><mat-spinner /></div>
    } @else if (error()) {
      <div class="error-banner">{{ error() }}</div>
    } @else {
      <mat-card>
        <table mat-table [dataSource]="projects()" class="full-width">
          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let p">
              <a [routerLink]="['/projects', p._id]">{{ p.nom }}</a>
            </td>
          </ng-container>
          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef>Code</th>
            <td mat-cell *matCellDef="let p"><code>{{ p.code }}</code></td>
          </ng-container>
          <ng-container matColumnDef="chef_projet">
            <th mat-header-cell *matHeaderCellDef>Chef de projet</th>
            <td mat-cell *matCellDef="let p">{{ formatChef(p.chef_projet) }}</td>
          </ng-container>
          <ng-container matColumnDef="statut">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let p">
              <mat-chip [style.background-color]="getStatusColor(p.statut)" [style.color]="'#fff'">
                {{ p.statut }}
              </mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="date_debut">
            <th mat-header-cell *matHeaderCellDef>Début</th>
            <td mat-cell *matCellDef="let p">{{ p.date_debut | date:'dd/MM/yyyy' }}</td>
          </ng-container>
          <ng-container matColumnDef="date_fin_theorique">
            <th mat-header-cell *matHeaderCellDef>Fin théorique</th>
            <td mat-cell *matCellDef="let p">{{ p.date_fin_theorique | date:'dd/MM/yyyy' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let p">
              <a mat-icon-button [routerLink]="['/projects', p._id]" matTooltip="Voir le détail">
                <mat-icon>visibility</mat-icon>
              </a>
              @if (canCreate()) {
                <button mat-icon-button (click)="archiveProject(p)" matTooltip="Archiver"
                  [disabled]="p.statut === 'Archivé' || p.statut === 'Terminé(e)'">
                  <mat-icon>archive</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteProject(p._id)" matTooltip="Supprimer">
                  <mat-icon>delete</mat-icon>
                </button>
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        @if (projects().length === 0) {
          <div class="empty">Aucun projet trouvé.</div>
        }
      </mat-card>
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .full-width { width: 100%; }
    .center { display: flex; justify-content: center; padding: 40px; }
    .error-banner { background: #fdecea; color: #b00020; padding: 12px; border-radius: 4px; }
    .empty { padding: 24px; text-align: center; color: #666; }
    code { font-family: monospace; font-size: 0.85rem; }
    a[mat-icon-button] { text-decoration: none; }
  `],
})
export class ProjectsListComponent implements OnInit {
  readonly displayedColumns = ['nom', 'code', 'chef_projet', 'statut', 'date_debut', 'date_fin_theorique', 'actions'];
  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly canCreate = computed(() => {
    const role = this.auth.userRole();
    return role === 'admin' || role === 'manager';
  });

  constructor(
    private projectService: ProjectService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    const currentUser = this.auth.currentUser();
    const isAdmin = currentUser?.role === 'admin';

    // Admin sees all projects; others see their own
    this.projectService.getAll().subscribe({
      next: (data) => {
        if (isAdmin) {
          this.projects.set(data);
        } else {
          this.projects.set(
            data.filter((p) => {
              const collaborateurs = p.collaborateurs as unknown as Array<{ _id: string } | string>;
              return collaborateurs?.some((c) =>
                typeof c === 'string' ? c === currentUser?._id : c._id === currentUser?._id
              );
            })
          );
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur de chargement');
        this.loading.set(false);
      },
    });
  }

  archiveProject(project: Project): void {
    const tasks = project.taches || [];
    const openTasks = tasks.filter((t) => t.statut === 'En cours' || t.statut === 'Initial');
    if (openTasks.length > 0) {
      this.snackBar.open(
        `${openTasks.length} tâche(s) non terminée(s) — impossible d'archiver.`,
        'OK',
        { duration: 5000 }
      );
      return;
    }
    if (!confirm(`Archiver le projet "${project.nom}" ?`)) return;

    this.projectService.update(project._id, { statut: 'Archivé' } as Partial<Project>).subscribe({
      next: () => {
        this.snackBar.open('Projet archivé', 'OK', { duration: 3000 });
        this.loadProjects();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Erreur', 'OK', { duration: 3000 }),
    });
  }

  deleteProject(id: string): void {
    if (!confirm('Supprimer définitivement ce projet ?')) return;
    this.projectService.delete(id).subscribe({
      next: () => {
        this.projects.update((ps) => ps.filter((p) => p._id !== id));
        this.snackBar.open('Projet supprimé', 'OK', { duration: 3000 });
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Erreur', 'OK', { duration: 3000 }),
    });
  }

  getStatusColor(status: string): string {
    return STATUS_COLORS[status] || '#9E9E9E';
  }

  formatChef(chef: unknown): string {
    if (!chef) return '—';
    if (typeof chef === 'object') {
      const c = chef as { prenom?: string; nom?: string };
      return `${c.prenom || ''} ${c.nom || ''}`.trim();
    }
    return String(chef);
  }
}
