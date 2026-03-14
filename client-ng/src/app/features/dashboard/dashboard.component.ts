import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { DatePipe } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { Task } from '../../core/models/task.model';
import { Project } from '../../core/models/project.model';
import {
  dateDiffWorkingDays, getDuration, STATUS_COLORS, CATEGORY_COLORS
} from '../../core/services/stats.utils';

interface TaskWithProject extends Task {
  projectId: string;
  projectNom: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatBadgeModule,
    DatePipe,
  ],
  template: `
    @if (loading()) {
      <div class="center"><mat-spinner /></div>
    } @else {
      <h2>Tableau de bord</h2>
      <p class="greeting">Bonjour, {{ userName() }} !</p>

      <!-- Compteurs de tâches -->
      <div class="counters-row">
        <mat-card class="counter-card counter-new">
          <mat-icon>fiber_new</mat-icon>
          <div class="counter-value">{{ newTasks().length }}</div>
          <div class="counter-label">Nouvelles</div>
        </mat-card>
        <mat-card class="counter-card counter-urgent">
          <mat-icon>priority_high</mat-icon>
          <div class="counter-value">{{ urgentTasks().length }}</div>
          <div class="counter-label">Urgentes</div>
        </mat-card>
        <mat-card class="counter-card counter-upcoming">
          <mat-icon>event_upcoming</mat-icon>
          <div class="counter-value">{{ upcomingTasks().length }}</div>
          <div class="counter-label">À venir</div>
        </mat-card>
        <mat-card class="counter-card counter-done">
          <mat-icon>check_circle</mat-icon>
          <div class="counter-value">{{ completedTasks().length }}</div>
          <div class="counter-label">Terminées</div>
        </mat-card>
        <mat-card class="counter-card counter-canceled">
          <mat-icon>cancel</mat-icon>
          <div class="counter-value">{{ canceledTasks().length }}</div>
          <div class="counter-label">Annulées</div>
        </mat-card>
      </div>

      <!-- Mes tâches -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Mes tâches ({{ allMyTasks().length }})</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="allMyTasks()" class="full-width">
            <ng-container matColumnDef="libelle">
              <th mat-header-cell *matHeaderCellDef>Tâche</th>
              <td mat-cell *matCellDef="let t">
                <a [routerLink]="['/projects', t.projectId, 'tasks', t._id]">{{ t.libelle }}</a>
              </td>
            </ng-container>
            <ng-container matColumnDef="project">
              <th mat-header-cell *matHeaderCellDef>Projet</th>
              <td mat-cell *matCellDef="let t">
                <a [routerLink]="['/projects', t.projectId]">{{ t.projectNom }}</a>
              </td>
            </ng-container>
            <ng-container matColumnDef="categorie">
              <th mat-header-cell *matHeaderCellDef>Catégorie</th>
              <td mat-cell *matCellDef="let t">
                <mat-chip [style.background-color]="getCategoryColor(t.categorie ?? '')" [style.color]="'#fff'" style="font-size:0.75rem">
                  {{ t.categorie }}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let t">
                <mat-chip [style.background-color]="getStatusColor(t.statut)" [style.color]="'#fff'" style="font-size:0.75rem">
                  {{ t.statut }}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="date_fin">
              <th mat-header-cell *matHeaderCellDef>Fin théorique</th>
              <td mat-cell *matCellDef="let t">{{ t.date_fin_theorique | date:'dd/MM/yyyy' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="taskColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: taskColumns;"></tr>
          </table>
          @if (allMyTasks().length === 0) {
            <div class="empty">Aucune tâche assignée.</div>
          }
        </mat-card-content>
      </mat-card>

      <!-- Mes projets -->
      <mat-card class="table-card" style="margin-top:16px">
        <mat-card-header>
          <mat-card-title>Mes projets ({{ projects().length }})</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="projects()" class="full-width">
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let p">
                <a [routerLink]="['/projects', p._id]">{{ p.nom }}</a>
              </td>
            </ng-container>
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let p">
                <mat-chip [style.background-color]="getStatusColor(p.statut)" [style.color]="'#fff'" style="font-size:0.75rem">
                  {{ p.statut }}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="date_debut">
              <th mat-header-cell *matHeaderCellDef>Début</th>
              <td mat-cell *matCellDef="let p">{{ p.date_debut | date:'dd/MM/yyyy' }}</td>
            </ng-container>
            <ng-container matColumnDef="date_fin">
              <th mat-header-cell *matHeaderCellDef>Fin théorique</th>
              <td mat-cell *matCellDef="let p">{{ p.date_fin_theorique | date:'dd/MM/yyyy' }}</td>
            </ng-container>
            <ng-container matColumnDef="taches">
              <th mat-header-cell *matHeaderCellDef>Tâches</th>
              <td mat-cell *matCellDef="let p">{{ p.taches?.length ?? 0 }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="projectColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: projectColumns;"></tr>
          </table>
          @if (projects().length === 0) {
            <div class="empty">Aucun projet trouvé.</div>
          }
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [`
    .center { display: flex; justify-content: center; padding: 40px; }
    .greeting { color: #666; margin-bottom: 16px; }
    .counters-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
    .counter-card { padding: 16px; text-align: center; min-width: 120px; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .counter-value { font-size: 2rem; font-weight: bold; }
    .counter-label { font-size: 0.85rem; color: #666; }
    .counter-new { border-left: 4px solid #2196F3; }
    .counter-urgent { border-left: 4px solid #F44336; }
    .counter-upcoming { border-left: 4px solid #FF9800; }
    .counter-done { border-left: 4px solid #4CAF50; }
    .counter-canceled { border-left: 4px solid #9E9E9E; }
    .table-card { margin-bottom: 16px; }
    .full-width { width: 100%; }
    .empty { padding: 24px; text-align: center; color: #666; }
    a { color: inherit; }
  `],
})
export class DashboardComponent implements OnInit {
  readonly taskColumns = ['libelle', 'project', 'categorie', 'statut', 'date_fin'];
  readonly projectColumns = ['nom', 'statut', 'date_debut', 'date_fin', 'taches'];

  readonly loading = signal(true);
  readonly projects = signal<Project[]>([]);
  readonly allMyTasks = signal<TaskWithProject[]>([]);
  readonly urgentTasks = signal<TaskWithProject[]>([]);
  readonly upcomingTasks = signal<TaskWithProject[]>([]);
  readonly newTasks = signal<TaskWithProject[]>([]);
  readonly completedTasks = signal<TaskWithProject[]>([]);
  readonly canceledTasks = signal<TaskWithProject[]>([]);

  readonly userName = () => {
    const u = this.auth.currentUser();
    return u ? `${u.prenom || ''} ${u.nom || ''}`.trim() || u.pseudo : '';
  };

  constructor(
    private projectService: ProjectService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.auth.currentUser();
    const userId = currentUser?._id;

    this.projectService.getAll().subscribe({
      next: (allProjects) => {
        // Filter projects where user is a collaborator
        const myProjects = allProjects.filter((p) => {
          const collaborateurs = (p.collaborateurs || []) as Array<{ _id: string } | string>;
          return collaborateurs.some((c) =>
            typeof c === 'string' ? c === userId : c._id === userId
          );
        });

        this.projects.set(myProjects.filter((p) => p.statut === 'En cours'));

        // Collect my tasks from active projects
        const allTasks: TaskWithProject[] = [];
        const urgent: TaskWithProject[] = [];
        const upcoming: TaskWithProject[] = [];
        const newT: TaskWithProject[] = [];
        const completed: TaskWithProject[] = [];
        const canceled: TaskWithProject[] = [];

        for (const p of myProjects.filter((x) => x.statut === 'En cours')) {
          for (const task of (p.taches || [])) {
            const collabs = (task.collaborateurs || []) as string[];
            if (!collabs.includes(userId ?? '')) continue;

            const enriched: TaskWithProject = {
              ...task,
              projectId: p._id,
              projectNom: p.nom,
            };
            allTasks.push(enriched);

            const now = new Date();
            if (task.date_fin_theorique) {
              const daysLeft = dateDiffWorkingDays(now, new Date(task.date_fin_theorique));
              if (task.statut === 'En cours' && daysLeft <= 3) urgent.push(enriched);
            }
            if (task.date_debut) {
              const daysToStart = dateDiffWorkingDays(now, new Date(task.date_debut));
              if (task.statut === 'Initial' && daysToStart >= 1 && daysToStart <= 6) {
                upcoming.push(enriched);
              }
            }

            switch (task.statut) {
              case 'Initial': newT.push(enriched); break;
              case 'Terminé(e)': completed.push(enriched); break;
              case 'Annulé(e)': canceled.push(enriched); break;
            }
          }
        }

        this.allMyTasks.set(allTasks);
        this.urgentTasks.set(urgent);
        this.upcomingTasks.set(upcoming);
        this.newTasks.set(newT);
        this.completedTasks.set(completed);
        this.canceledTasks.set(canceled);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getStatusColor(status: string): string { return STATUS_COLORS[status] || '#9E9E9E'; }
  getCategoryColor(cat: string): string { return CATEGORY_COLORS[cat] || '#9E9E9E'; }
}
