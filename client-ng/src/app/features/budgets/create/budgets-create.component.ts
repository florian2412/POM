import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budgets-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Nouvelle ligne budgétaire</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (error()) {
          <div class="error-banner">{{ error() }}</div>
        }
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Libellé *</mat-label>
            <input matInput formControlName="libelle" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Montant *</mat-label>
            <input matInput formControlName="montant" type="number" min="0" />
            @if (form.get('montant')?.hasError('min')) {
              <mat-error>Le montant doit être positif</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3"></textarea>
          </mat-form-field>

          <div class="actions">
            <button mat-button type="button" routerLink="/budgets">Annuler</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="loading() || form.invalid">
              @if (loading()) { <mat-spinner diameter="20" /> } @else { Créer }
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 12px; }
    .actions { display: flex; gap: 12px; justify-content: flex-end; }
    .error-banner { background: #fdecea; color: #b00020; padding: 12px; border-radius: 4px; margin-bottom: 12px; }
  `],
})
export class BudgetsCreateComponent {
  readonly form: FormGroup;
  readonly loading = signal(false);
  readonly error = signal('');

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private router: Router
  ) {
    this.form = this.fb.group({
      libelle: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(0)]],
      description: [''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.budgetService.create(this.form.value).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/budgets']); },
      error: (err) => { this.loading.set(false); this.error.set(err.error?.message || 'Erreur'); },
    });
  }
}
