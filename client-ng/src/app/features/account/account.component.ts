import { Component, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <h2>Mon profil</h2>

    <mat-card class="profile-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>account_circle</mat-icon>
        <mat-card-title>{{ user()?.prenom }} {{ user()?.nom }}</mat-card-title>
        <mat-card-subtitle>{{ user()?.pseudo }} – {{ user()?.role }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p><strong>Email :</strong> {{ user()?.email }}</p>
        <p><strong>Fonction :</strong> {{ user()?.fonction || '—' }}</p>
      </mat-card-content>
    </mat-card>

    <mat-card class="password-card">
      <mat-card-header>
        <mat-card-title>Changer le mot de passe</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (pwError()) {
          <div class="error-banner">{{ pwError() }}</div>
        }
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mot de passe actuel</mat-label>
            <input matInput formControlName="current_password" type="password" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nouveau mot de passe</mat-label>
            <input matInput formControlName="new_password" type="password" />
            @if (passwordForm.get('new_password')?.hasError('minlength')) {
              <mat-error>Minimum 8 caractères</mat-error>
            }
          </mat-form-field>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="pwLoading() || passwordForm.invalid"
          >
            @if (pwLoading()) { <mat-spinner diameter="20" /> } @else { Modifier }
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .profile-card, .password-card { max-width: 500px; margin-bottom: 24px; }
    .full-width { width: 100%; margin-bottom: 12px; }
    .error-banner { background: #fdecea; color: #b00020; padding: 12px; border-radius: 4px; margin-bottom: 12px; }
  `],
})
export class AccountComponent {
  readonly user = computed(() => this.auth.currentUser());

  readonly passwordForm: FormGroup;
  readonly pwLoading = signal(false);
  readonly pwError = signal('');

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.pwLoading.set(true);
    this.pwError.set('');

    this.auth.changePassword(this.passwordForm.value).subscribe({
      next: (res) => {
        this.pwLoading.set(false);
        if (res.success) {
          this.passwordForm.reset();
          this.snackBar.open('Mot de passe mis à jour avec succès', 'OK', { duration: 3000 });
        } else {
          this.pwError.set(res.message || 'Erreur');
        }
      },
      error: (err) => {
        this.pwLoading.set(false);
        this.pwError.set(err.error?.message || 'Erreur lors de la modification');
      },
    });
  }
}
