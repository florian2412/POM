import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
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
    <div class="container">
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>Réinitialisation du mot de passe</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          @if (successMessage()) {
            <div class="success-banner">{{ successMessage() }}</div>
          }
          @if (errorMessage()) {
            <div class="error-banner">{{ errorMessage() }}</div>
          }

          @if (!successMessage()) {
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Pseudo</mat-label>
                <input matInput formControlName="pseudo" />
                @if (form.get('pseudo')?.hasError('required') && form.get('pseudo')?.touched) {
                  <mat-error>Pseudo requis</mat-error>
                }
              </mat-form-field>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                class="full-width"
                [disabled]="loading() || form.invalid"
              >
                @if (loading()) {
                  <mat-spinner diameter="20" />
                } @else {
                  Réinitialiser le mot de passe
                }
              </button>
            </form>
          }
        </mat-card-content>

        <mat-card-actions>
          <a mat-button routerLink="/auth/login">Retour à la connexion</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }
    .card { width: 380px; padding: 16px; }
    .full-width { width: 100%; margin-bottom: 12px; }
    .success-banner { background: #e8f5e9; color: #1b5e20; padding: 10px 16px; border-radius: 4px; margin-bottom: 12px; }
    .error-banner { background: #fdecea; color: #b00020; padding: 10px 16px; border-radius: 4px; margin-bottom: 12px; }
  `],
})
export class ResetPasswordComponent {
  readonly form: FormGroup;
  readonly loading = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({ pseudo: ['', Validators.required] });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.resetPassword(this.form.value.pseudo).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.successMessage.set(res.message || 'Si ce pseudo existe, un email a été envoyé.');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
      },
    });
  }
}
