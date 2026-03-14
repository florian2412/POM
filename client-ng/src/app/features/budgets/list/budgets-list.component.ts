import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DecimalPipe } from '@angular/common';
import { BudgetService } from '../../../core/services/budget.service';
import { ProjectService } from '../../../core/services/project.service';
import { CollaboratorService } from '../../../core/services/collaborator.service';
import { Budget } from '../../../core/models/budget.model';
import { getDuration } from '../../../core/services/stats.utils';

interface BudgetWithConsumption extends Budget {
  consumptionPercent: number;
  costTotal: number;
}

@Component({
  selector: 'app-budgets-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSnackBarModule,
    DecimalPipe,
  ],
  template: `
    <div class="page-header">
      <h2>Lignes budgétaires</h2>
      <a mat-raised-button color="primary" routerLink="/budgets/create">
        <mat-icon>add</mat-icon> Nouvelle ligne
      </a>
    </div>

    @if (loading()) {
      <div class="center"><mat-spinner /></div>
    } @else if (error()) {
      <div class="error-banner">{{ error() }}</div>
    } @else {
      <mat-card>
        <table mat-table [dataSource]="budgets()" class="full-width">
          <ng-container matColumnDef="libelle">
            <th mat-header-cell *matHeaderCellDef>Libellé</th>
            <td mat-cell *matCellDef="let b">{{ b.libelle }}</td>
          </ng-container>
          <ng-container matColumnDef="montant">
            <th mat-header-cell *matHeaderCellDef>Montant</th>
            <td mat-cell *matCellDef="let b">{{ b.montant | number:'1.0-0' }} €</td>
          </ng-container>
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let b">{{ b.description || '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="consommation">
            <th mat-header-cell *matHeaderCellDef>Consommation</th>
            <td mat-cell *matCellDef="let b">
              <div class="progress-container">
                <mat-progress-bar mode="determinate" [value]="b.consumptionPercent"
                  [color]="b.consumptionPercent > 80 ? 'warn' : 'primary'" />
                <span>{{ b.costTotal | number:'1.0-0' }} € / {{ b.consumptionPercent | number:'1.0-1' }}%</span>
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let b">
              <button mat-icon-button color="warn" (click)="deleteBudget(b._id)" matTooltip="Supprimer">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        @if (budgets().length === 0) {
          <div class="empty">Aucune ligne budgétaire.</div>
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
    .progress-container { display: flex; flex-direction: column; gap: 4px; min-width: 150px; }
    .progress-container mat-progress-bar { border-radius: 4px; }
    .progress-container span { font-size: 0.8rem; color: #666; }
  `],
})
export class BudgetsListComponent implements OnInit {
  readonly displayedColumns = ['libelle', 'montant', 'description', 'consommation', 'actions'];
  readonly budgets = signal<BudgetWithConsumption[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(
    private budgetService: BudgetService,
    private projectService: ProjectService,
    private collaboratorService: CollaboratorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    let allBudgets: Budget[] = [];
    let collaboratorsMap: Record<string, number> = {};

    this.collaboratorService.getAll().subscribe({
      next: (collabs) => {
        for (const c of collabs) {
          collaboratorsMap[c._id] = c.cout_horaire ?? 0;
        }

        this.budgetService.getAll().subscribe({
          next: (budgets) => {
            allBudgets = budgets;

            this.projectService.getAll().subscribe({
              next: (projects) => {
                const withConsumption: BudgetWithConsumption[] = allBudgets.map((budget) => {
                  let totalCost = 0;

                  for (const project of projects) {
                    if (project.ligne_budgetaire?.id === budget._id) {
                      for (const task of (project.taches || [])) {
                        const duration = getDuration(
                          task.date_debut ?? '',
                          task.date_fin_theorique ?? ''
                        );
                        for (const collabId of (task.collaborateurs || [])) {
                          const rate = collaboratorsMap[collabId as string] ?? 0;
                          totalCost += rate * 7 * duration;
                        }
                      }
                    }
                  }

                  const percent = budget.montant > 0
                    ? Math.round((totalCost / budget.montant) * 100)
                    : 0;

                  return { ...budget, consumptionPercent: Math.min(percent, 100), costTotal: totalCost };
                });

                this.budgets.set(withConsumption);
                this.loading.set(false);
              },
              error: (err) => {
                this.error.set(err.error?.message || 'Erreur');
                this.loading.set(false);
              },
            });
          },
          error: (err) => {
            this.error.set(err.error?.message || 'Erreur');
            this.loading.set(false);
          },
        });
      },
    });
  }

  deleteBudget(id: string): void {
    if (!confirm('Supprimer cette ligne budgétaire ?')) return;
    this.budgetService.delete(id).subscribe({
      next: () => {
        this.budgets.update((bs) => bs.filter((b) => b._id !== id));
        this.snackBar.open('Ligne budgétaire supprimée', 'OK', { duration: 3000 });
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Erreur', 'OK', { duration: 3000 }),
    });
  }
}
