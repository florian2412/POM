import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-restricted',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-icon color="warn">lock</mat-icon>
          <mat-card-title>Accès refusé</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button color="primary" routerLink="/">Retour à l'accueil</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { display: flex; justify-content: center; padding: 40px; }
    mat-card { max-width: 400px; }
    mat-icon { font-size: 36px; margin-right: 12px; }
  `],
})
export class RestrictedComponent {}
