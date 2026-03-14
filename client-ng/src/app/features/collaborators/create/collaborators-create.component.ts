import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CollaboratorService } from '../../../core/services/collaborator.service';

@Component({
  selector: 'app-collaborators-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Nouveau collaborateur</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (error()) {
          <div class="error-banner">{{ error() }}</div>
        }
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Prénom *</mat-label>
              <input matInput formControlName="prenom" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Nom *</mat-label>
              <input matInput formControlName="nom" />
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Pseudo *</mat-label>
            <input matInput formControlName="pseudo" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email *</mat-label>
            <input matInput formControlName="email" type="email" />
            @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
              <mat-error>Email invalide</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mot de passe *</mat-label>
            <input matInput formControlName="mot_de_passe" type="password" />
            @if (form.get('mot_de_passe')?.hasError('minlength')) {
              <mat-error>Minimum 8 caractères</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Rôle *</mat-label>
            <mat-select formControlName="role">
              <mat-option value="collaborateur">Collaborateur</mat-option>
              <mat-option value="manager">Manager</mat-option>
              <mat-option value="admin">Administrateur</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Fonction</mat-label>
            <input matInput formControlName="fonction" />
          </mat-form-field>

          <div class="actions">
            <button mat-button type="button" routerLink="/collaborators">Annuler</button>
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
    .half-width { width: calc(50% - 6px); margin-bottom: 12px; }
    .row { display: flex; gap: 12px; }
    .actions { display: flex; gap: 12px; justify-content: flex-end; }
    .error-banner { background: #fdecea; color: #b00020; padding: 12px; border-radius: 4px; margin-bottom: 12px; }
  `],
})
export class CollaboratorsCreateComponent {
  readonly form: FormGroup;
  readonly loading = signal(false);
  readonly error = signal('');

  constructor(
    private fb: FormBuilder,
    private collaboratorService: CollaboratorService,
    private router: Router
  ) {
    this.form = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      pseudo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [Validators.required, Validators.minLength(8)]],
      role: ['collaborateur', Validators.required],
      fonction: [''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    this.collaboratorService.create(this.form.value).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.router.navigate(['/collaborators']);
        } else {
          this.error.set(res.message || 'Erreur lors de la création');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de la création');
      },
    });
  }
}
