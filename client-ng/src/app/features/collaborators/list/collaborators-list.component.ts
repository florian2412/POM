import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { CollaboratorService } from '../../../core/services/collaborator.service';
import { Collaborator } from '../../../core/models/collaborator.model';

@Component({
  selector: 'app-collaborators-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  template: `
    <div class="page-header">
      <h2>Collaborateurs</h2>
      <a mat-raised-button color="primary" routerLink="/collaborators/create">
        <mat-icon>person_add</mat-icon> Nouveau collaborateur
      </a>
    </div>

    @if (loading()) {
      <div class="center"><mat-spinner /></div>
    } @else if (error()) {
      <div class="error-banner">{{ error() }}</div>
    } @else {
      <mat-card>
        <table mat-table [dataSource]="collaborators()" class="full-width">
          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let c">{{ c.prenom }} {{ c.nom }}</td>
          </ng-container>
          <ng-container matColumnDef="pseudo">
            <th mat-header-cell *matHeaderCellDef>Pseudo</th>
            <td mat-cell *matCellDef="let c">{{ c.pseudo }}</td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let c">{{ c.email }}</td>
          </ng-container>
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Rôle</th>
            <td mat-cell *matCellDef="let c">
              <mat-chip>{{ c.role }}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let c">
              <a mat-icon-button [routerLink]="['/collaborators', c._id]">
                <mat-icon>visibility</mat-icon>
              </a>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .full-width { width: 100%; }
    .center { display: flex; justify-content: center; padding: 40px; }
    .error-banner { background: #fdecea; color: #b00020; padding: 12px; border-radius: 4px; }
  `],
})
export class CollaboratorsListComponent implements OnInit {
  readonly displayedColumns = ['nom', 'pseudo', 'email', 'role', 'actions'];
  readonly collaborators = signal<Collaborator[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(private collaboratorService: CollaboratorService) {}

  ngOnInit(): void {
    this.collaboratorService.getAll().subscribe({
      next: (data) => { this.collaborators.set(data); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message || 'Erreur de chargement'); this.loading.set(false); },
    });
  }
}
