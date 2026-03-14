import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { Task } from '../../../core/models/task.model';
import { CATEGORY_COLORS, STATUS_COLORS } from '../../../core/services/stats.utils';

@Component({
  selector: 'app-tasks-list',
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
    MatDialogModule,
    MatSnackBarModule,
    DatePipe,
  ],
  template: `
    <div class="page-header">
      <h3>Tâches du projet</h3>
      @if (canEdit()) {
        <a mat-raised-button color="primary" [routerLink]="['create']">
          <mat-icon>add</mat-icon> Nouvelle tâche
        </a>
      }
    </div>

    @if (loading()) {
      <div class="center"><mat-spinner /></div>
    } @else if (error()) {
      <div class="error-banner">{{ error() }}</div>
    } @else {
      <mat-card>
        <table mat-table [dataSource]="tasks()" class="full-width">
          <ng-container matColumnDef="libelle">
            <th mat-header-cell *matHeaderCellDef>Libellé</th>
            <td mat-cell *matCellDef="let t">{{ t.libelle }}</td>
          </ng-container>
          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef>Code</th>
            <td mat-cell *matCellDef="let t"><code>{{ t.code }}</code></td>
          </ng-container>
          <ng-container matColumnDef="categorie">
            <th mat-header-cell *matHeaderCellDef>Catégorie</th>
            <td mat-cell *matCellDef="let t">
              <mat-chip [style.background-color]="getCategoryColor(t.categorie)" [style.color]="'#fff'">
                {{ t.categorie }}
              </mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="statut">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let t">
              <mat-chip [style.background-color]="getStatusColor(t.statut)" [style.color]="'#fff'">
                {{ t.statut }}
              </mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="date_debut">
            <th mat-header-cell *matHeaderCellDef>Début</th>
            <td mat-cell *matCellDef="let t">{{ t.date_debut | date:'dd/MM/yyyy' }}</td>
          </ng-container>
          <ng-container matColumnDef="date_fin">
            <th mat-header-cell *matHeaderCellDef>Fin théorique</th>
            <td mat-cell *matCellDef="let t">{{ t.date_fin_theorique | date:'dd/MM/yyyy' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let t">
              <a mat-icon-button [routerLink]="[t._id]" matTooltip="Voir le détail">
                <mat-icon>visibility</mat-icon>
              </a>
              @if (canEdit()) {
                <button mat-icon-button color="warn" (click)="deleteTask(t._id)" matTooltip="Supprimer">
                  <mat-icon>delete</mat-icon>
                </button>
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        @if (tasks().length === 0) {
          <div class="empty">Aucune tâche pour ce projet.</div>
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
    code { font-family: monospace; }
  `],
})
export class TasksListComponent implements OnInit {
  readonly displayedColumns = ['libelle', 'code', 'categorie', 'statut', 'date_debut', 'date_fin', 'actions'];
  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  private projectId = '';

  readonly canEdit = computed(() => {
    const role = this.auth.userRole();
    return role === 'admin' || role === 'manager';
  });

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAll(this.projectId).subscribe({
      next: (data) => { this.tasks.set(data); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message || 'Erreur de chargement'); this.loading.set(false); },
    });
  }

  deleteTask(taskId: string): void {
    if (!confirm('Supprimer cette tâche ?')) return;
    this.taskService.delete(this.projectId, taskId).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((t) => t._id !== taskId));
        this.snackBar.open('Tâche supprimée', 'OK', { duration: 3000 });
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Erreur', 'OK', { duration: 3000 }),
    });
  }

  getCategoryColor(cat: string): string {
    return CATEGORY_COLORS[cat] || '#9E9E9E';
  }

  getStatusColor(status: string): string {
    return STATUS_COLORS[status] || '#9E9E9E';
  }
}
