import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer mode="side" opened class="sidenav">
        <mat-toolbar color="primary">
          <span>POM</span>
        </mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Tableau de bord</span>
          </a>
          <a mat-list-item routerLink="/projects" routerLinkActive="active-link">
            <mat-icon matListItemIcon>folder</mat-icon>
            <span matListItemTitle>Projets</span>
          </a>
          @if (canSeeCollaborators()) {
            <a mat-list-item routerLink="/collaborators" routerLinkActive="active-link">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Collaborateurs</span>
            </a>
          }
          @if (isAdmin()) {
            <a mat-list-item routerLink="/budgets" routerLinkActive="active-link">
              <mat-icon matListItemIcon>account_balance_wallet</mat-icon>
              <span matListItemTitle>Budgets</span>
            </a>
          }
          <a mat-list-item routerLink="/statistics" routerLinkActive="active-link">
            <mat-icon matListItemIcon>bar_chart</mat-icon>
            <span matListItemTitle>Statistiques</span>
          </a>
          <a mat-list-item routerLink="/help" routerLinkActive="active-link">
            <mat-icon matListItemIcon>help_outline</mat-icon>
            <span matListItemTitle>Aide</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="drawer.toggle()" matTooltip="Menu">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-title">{{ pageTitle }}</span>
          <span class="spacer"></span>
          <a mat-icon-button routerLink="/account" matTooltip="Mon profil">
            <mat-icon>account_circle</mat-icon>
          </a>
          <button mat-icon-button (click)="logout()" matTooltip="Se déconnecter">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>

        <main class="content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }
    .sidenav { width: 220px; }
    .content { padding: 16px; }
    .spacer { flex: 1 1 auto; }
    .active-link { background: rgba(255,255,255,.15); }
    .toolbar-title { font-size: 1.1rem; }
  `],
})
export class LayoutComponent {
  constructor(private auth: AuthService) {}

  readonly pageTitle = 'POM – Plan, Organize & Manage';

  readonly canSeeCollaborators = computed(() => {
    const role = this.auth.userRole();
    return role === 'admin' || role === 'manager';
  });

  readonly isAdmin = computed(() => this.auth.userRole() === 'admin');

  logout(): void {
    this.auth.logout();
  }
}
