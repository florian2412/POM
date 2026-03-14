import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { BudgetService } from '../../../core/services/budget.service';
import { SettingsService } from '../../../core/services/settings.service';
import { AuthService } from '../../../core/services/auth.service';
import { Project } from '../../../core/models/project.model';
import { Budget } from '../../../core/models/budget.model';
import { getDuration } from '../../../core/services/stats.utils';
import { TasksListComponent } from '../../tasks/list/tasks-list.component';

@Component({
  selector: 'app-projects-detail',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatChipsModule,
    DatePipe,
    DecimalPipe,
    TasksListComponent,
  ],
  template: `
    @if (loading()) {
      <div class="center"><mat-spinner /></div>
    } @else if (error()) {
      <div class="error-banner">{{ error() }}</div>
    } @else if (project()) {
      <div class="page-header">
        <div>
          <h2>{{ project()!.nom }}</h2>
          <code class="project-code">{{ project()!.code }}</code>
        </div>
        <div class="header-actions">
          @if (canEdit()) {
            @if (project()!.statut === 'En cours') {
              <button mat-stroked-button color="primary" (click)="closeProject()">
                <mat-icon>check_circle</mat-icon> Clôturer
              </button>
              <button mat-stroked-button (click)="archiveProject()">
                <mat-icon>archive</mat-icon> Archiver
              </button>
            }
          }
          <a mat-button routerLink="/projects">
            <mat-icon>arrow_back</mat-icon> Retour
          </a>
        </div>
      </div>

      <mat-tab-group animationDuration="200ms">
        <!-- ─── Onglet Informations ─────────────────────────────────────── -->
        <mat-tab label="Informations">
          <div class="tab-content">
            @if (formError()) {
              <div class="error-banner">{{ formError() }}</div>
            }
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Nom du projet *</mat-label>
                  <input matInput formControlName="nom" />
                </mat-form-field>
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Statut</mat-label>
                  <mat-select formControlName="statut" [disabled]="!canEdit()">
                    @for (s of statuts(); track s) {
                      <mat-option [value]="s">{{ s }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Date de début</mat-label>
                  <input matInput [matDatepicker]="pickerDebut" formControlName="date_debut"
                    [matDatepickerFilter]="workDayFilter" />
                  <mat-datepicker-toggle matIconSuffix [for]="pickerDebut" [disabled]="!canEdit()"></mat-datepicker-toggle>
                  <mat-datepicker #pickerDebut></mat-datepicker>
                </mat-form-field>
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Date de fin théorique</mat-label>
                  <input matInput [matDatepicker]="pickerFin" formControlName="date_fin_theorique"
                    [matDatepickerFilter]="workDayFilter" />
                  <mat-datepicker-toggle matIconSuffix [for]="pickerFin" [disabled]="!canEdit()"></mat-datepicker-toggle>
                  <mat-datepicker #pickerFin></mat-datepicker>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Ligne budgétaire</mat-label>
                <mat-select formControlName="budget_id" [disabled]="!canEdit()">
                  @for (b of budgets(); track b._id) {
                    <mat-option [value]="b._id">{{ b.libelle }} ({{ b.montant | number:'1.0-0' }} €)</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3" [readonly]="!canEdit()"></textarea>
              </mat-form-field>

              <p class="info-text">
                <strong>Durée théorique :</strong> {{ duration() }} jours ouvrés |
                <strong>Chef de projet :</strong> {{ chefProjet() }}
              </p>

              @if (canEdit()) {
                <div class="actions">
                  <button mat-raised-button color="primary" type="submit" [disabled]="saving()">
                    @if (saving()) { <mat-spinner diameter="20" /> } @else { Enregistrer }
                  </button>
                </div>
              }
            </form>
          </div>
        </mat-tab>

        <!-- ─── Onglet Tâches ──────────────────────────────────────────── -->
        <mat-tab label="Tâches ({{ taskCount() }})">
          <div class="tab-content">
            <app-tasks-list />
          </div>
        </mat-tab>
      </mat-tab-group>
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .header-actions { display: flex; gap: 8px; align-items: center; }
    .project-code { font-family: monospace; color: #666; font-size: 0.85rem; }
    .tab-content { padding: 20px 0; }
    .full-width { width: 100%; margin-bottom: 12px; }
    .half-width { width: calc(50% - 6px); margin-bottom: 12px; }
    .row { display: flex; gap: 12px; }
    .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
    .error-banner { background: #fdecea; color: #b00020; padding: 12px; border-radius: 4px; margin-bottom: 12px; }
    .center { display: flex; justify-content: center; padding: 40px; }
    .info-text { color: #666; font-size: 0.9rem; margin-bottom: 12px; }
  `],
})
export class ProjectsDetailComponent implements OnInit {
  readonly form: FormGroup;
  readonly project = signal<Project | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly formError = signal('');
  readonly statuts = signal<string[]>(['En cours', 'Annulé(e)']);
  readonly budgets = signal<Budget[]>([]);
  private projectId = '';

  readonly canEdit = computed(() => {
    const role = this.auth.userRole();
    return role === 'admin' || role === 'manager';
  });

  readonly duration = computed(() => {
    const d = this.form.get('date_debut')?.value;
    const f = this.form.get('date_fin_theorique')?.value;
    if (d && f) return getDuration(d, f);
    const p = this.project();
    if (p?.date_debut && p?.date_fin_theorique) return getDuration(p.date_debut, p.date_fin_theorique);
    return 0;
  });

  readonly chefProjet = computed(() => {
    const p = this.project();
    if (!p?.chef_projet) return '—';
    if (typeof p.chef_projet === 'object') {
      const cp = p.chef_projet as { prenom?: string; nom?: string };
      return `${cp.prenom || ''} ${cp.nom || ''}`.trim();
    }
    return String(p.chef_projet);
  });

  readonly taskCount = computed(() => this.project()?.taches?.length ?? 0);

  readonly workDayFilter = (date: Date | null): boolean => {
    if (!date) return true;
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private budgetService: BudgetService,
    private settingsService: SettingsService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      statut: [''],
      date_debut: [null],
      date_fin_theorique: [null],
      budget_id: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';

    this.budgetService.getAll().subscribe({ next: (b) => this.budgets.set(b) });

    this.projectService.getById(this.projectId).subscribe({
      next: (p) => {
        this.project.set(p);
        this.form.patchValue({
          nom: p.nom,
          statut: p.statut,
          date_debut: p.date_debut ? new Date(p.date_debut) : null,
          date_fin_theorique: p.date_fin_theorique ? new Date(p.date_fin_theorique) : null,
          budget_id: p.ligne_budgetaire?.id || '',
          description: p.description,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Projet introuvable');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.canEdit()) return;
    this.saving.set(true);
    this.formError.set('');

    const { budget_id, ...rest } = this.form.value;
    const selectedBudget = this.budgets().find((b) => b._id === budget_id);
    const payload: Partial<Project> = {
      ...rest,
      ligne_budgetaire: selectedBudget
        ? { id: budget_id, montant_restant: selectedBudget.montant }
        : undefined,
    };

    this.projectService.update(this.projectId, payload).subscribe({
      next: (p) => {
        this.saving.set(false);
        this.project.set(p);
        this.snackBar.open('Projet mis à jour', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(err.error?.message || 'Erreur lors de la mise à jour');
      },
    });
  }

  closeProject(): void {
    const tasks = this.project()?.taches || [];
    const openTasks = tasks.filter((t) => t.statut === 'En cours' || t.statut === 'Initial');
    if (openTasks.length > 0) {
      this.snackBar.open(
        `${openTasks.length} tâche(s) non terminée(s). Finalisez-les avant de clôturer.`,
        'OK',
        { duration: 5000 }
      );
      return;
    }

    this.projectService.update(this.projectId, {
      statut: 'Terminé(e)',
      date_fin_reelle: new Date().toISOString(),
    } as Partial<Project>).subscribe({
      next: () => {
        this.snackBar.open('Projet clôturé', 'OK', { duration: 3000 });
        this.router.navigate(['/projects']);
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Erreur', 'OK', { duration: 3000 }),
    });
  }

  archiveProject(): void {
    const tasks = this.project()?.taches || [];
    const openTasks = tasks.filter((t) => t.statut === 'En cours' || t.statut === 'Initial');
    if (openTasks.length > 0) {
      this.snackBar.open(
        `${openTasks.length} tâche(s) non terminée(s). Finalisez-les avant d'archiver.`,
        'OK',
        { duration: 5000 }
      );
      return;
    }

    this.projectService.update(this.projectId, { statut: 'Archivé' } as Partial<Project>).subscribe({
      next: () => {
        this.snackBar.open('Projet archivé', 'OK', { duration: 3000 });
        this.router.navigate(['/projects']);
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Erreur', 'OK', { duration: 3000 }),
    });
  }
}
