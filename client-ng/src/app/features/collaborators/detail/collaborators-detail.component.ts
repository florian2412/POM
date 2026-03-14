import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CollaboratorService } from '../../../core/services/collaborator.service';
import { Collaborator } from '../../../core/models/collaborator.model';

@Component({
  selector: 'app-collaborators-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  template: `
    @if (loading()) {
      <div class="center"><mat-spinner /></div>
    } @else if (error()) {
      <div class="error-banner">{{ error() }}</div>
    } @else if (collaborator()) {
      <div class="page-header">
        <h2>{{ collaborator()!.prenom }} {{ collaborator()!.nom }}</h2>
        <a mat-button routerLink="/collaborators">
          <mat-icon>arrow_back</mat-icon> Retour
        </a>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-list>
            <mat-list-item>
              <span matListItemTitle>Pseudo</span>
              <span matListItemLine>{{ collaborator()!.pseudo }}</span>
            </mat-list-item>
            <mat-list-item>
              <span matListItemTitle>Email</span>
              <span matListItemLine>{{ collaborator()!.email }}</span>
            </mat-list-item>
            <mat-list-item>
              <span matListItemTitle>Rôle</span>
              <span matListItemLine>
                <mat-chip>{{ collaborator()!.role }}</mat-chip>
              </span>
            </mat-list-item>
            <mat-list-item>
              <span matListItemTitle>Fonction</span>
              <span matListItemLine>{{ collaborator()!.fonction || '—' }}</span>
            </mat-list-item>
            <mat-list-item>
              <span matListItemTitle>Coût horaire</span>
              <span matListItemLine>{{ collaborator()!.cout_horaire ?? 0 }} €/h</span>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .center { display: flex; justify-content: center; padding: 40px; }
    .error-banner { background: #fdecea; color: #b00020; padding: 12px; border-radius: 4px; }
  `],
})
export class CollaboratorsDetailComponent implements OnInit {
  readonly collaborator = signal<Collaborator | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(
    private route: ActivatedRoute,
    private collaboratorService: CollaboratorService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.collaboratorService.getById(id).subscribe({
      next: (c) => { this.collaborator.set(c); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message || 'Collaborateur introuvable'); this.loading.set(false); },
    });
  }
}
