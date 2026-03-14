import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { SettingsService } from '../../../core/services/settings.service';
import { AuthService } from '../../../core/services/auth.service';
import { Task } from '../../../core/models/task.model';
import { Collaborator } from '../../../core/models/collaborator.model';
import { getDuration } from '../../../core/services/stats.utils';

@Component({
  selector: 'app-tasks-detail',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  template: `
    @if (loading()) {
      <div class="center"><mat-spinner /></div>
    } @else if (error()) {
      <div class="error-banner">{{ error() }}</div>
    } @else if (task()) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ task()!.libelle }}</mat-card-title>
          <mat-card-subtitle><code>{{ task()!.code }}</code></mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          @if (formError()) {
            <div class="error-banner">{{ formError() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Libellé *</mat-label>
              <input matInput formControlName="libelle" [readonly]="!canEdit()" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Statut</mat-label>
              <mat-select formControlName="statut" [disabled]="!canEdit()">
                @for (s of statuts(); track s) {
                  <mat-option [value]="s">{{ s }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Catégorie</mat-label>
              <mat-select formControlName="categorie" [disabled]="!canEdit()">
                @for (c of categories(); track c) {
                  <mat-option [value]="c">{{ c }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" [readonly]="!canEdit()"></textarea>
            </mat-form-field>

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

            <mat-form-field appearance="outline" class="full-width" [style.display]="isTermine() ? 'block' : 'none'">
              <mat-label>Date de fin réelle</mat-label>
              <input matInput [matDatepicker]="pickerFinReelle" formControlName="date_fin_reelle"
                [matDatepickerFilter]="workDayFilter" />
              <mat-datepicker-toggle matIconSuffix [for]="pickerFinReelle" [disabled]="!canEdit()"></mat-datepicker-toggle>
              <mat-datepicker #pickerFinReelle></mat-datepicker>
            </mat-form-field>

            <p class="info-text">
              <strong>Durée théorique :</strong> {{ duration() }} jours ouvrés
            </p>

            @if (canEdit()) {
              <div class="collaborators-section">
                <strong>Collaborateurs affectés</strong>
                <div class="chips-row">
                  @for (c of collaborators(); track c._id) {
                    <mat-chip-option
                      [selected]="isSelected(c._id)"
                      (click)="toggleCollaborator(c._id)"
                    >
                      {{ c.prenom }} {{ c.nom }}
                    </mat-chip-option>
                  }
                </div>
              </div>
            }

            <div class="actions">
              <a mat-button [routerLink]="['..']">Retour</a>
              @if (canEdit()) {
                <button mat-raised-button color="primary" type="submit" [disabled]="saving() || form.invalid">
                  @if (saving()) { <mat-spinner diameter="20" /> } @else { Enregistrer }
                </button>
              }
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 12px; }
    .half-width { width: calc(50% - 6px); margin-bottom: 12px; }
    .row { display: flex; gap: 12px; }
    .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
    .error-banner { background: #fdecea; color: #b00020; padding: 12px; border-radius: 4px; margin-bottom: 12px; }
    .center { display: flex; justify-content: center; padding: 40px; }
    .collaborators-section { margin-bottom: 16px; }
    .chips-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .info-text { color: #666; font-size: 0.9rem; }
    code { font-family: monospace; }
  `],
})
export class TasksDetailComponent implements OnInit {
  readonly form: FormGroup;
  readonly task = signal<Task | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly formError = signal('');
  readonly statuts = signal<string[]>(['Initial', 'En cours', 'Terminé(e)', 'Annulé(e)']);
  readonly categories = signal<string[]>([]);
  readonly collaborators = signal<Collaborator[]>([]);

  private projectId = '';
  private taskId = '';
  private selectedCollaborators: string[] = [];

  readonly canEdit = computed(() => {
    const role = this.auth.userRole();
    return role === 'admin' || role === 'manager';
  });

  readonly isTermine = computed(() => this.form.get('statut')?.value === 'Terminé(e)');

  readonly duration = computed(() => {
    const d = this.form.get('date_debut')?.value;
    const f = this.form.get('date_fin_theorique')?.value;
    if (d && f) return getDuration(d, f);
    return 0;
  });

  readonly workDayFilter = (date: Date | null): boolean => {
    if (!date) return true;
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private projectService: ProjectService,
    private settingsService: SettingsService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      libelle: ['', Validators.required],
      statut: ['Initial'],
      categorie: [''],
      description: [''],
      date_debut: [null],
      date_fin_theorique: [null],
      date_fin_reelle: [null],
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.taskId = this.route.snapshot.paramMap.get('taskId') || '';

    this.settingsService.getCategories().subscribe({ next: (c) => this.categories.set(c) });

    this.taskService.getById(this.projectId, this.taskId).subscribe({
      next: (task) => {
        this.task.set(task);
        this.selectedCollaborators = [...(task.collaborateurs as string[] || [])];
        this.form.patchValue({
          libelle: task.libelle,
          statut: task.statut,
          categorie: task.categorie,
          description: task.description,
          date_debut: task.date_debut ? new Date(task.date_debut) : null,
          date_fin_theorique: task.date_fin_theorique ? new Date(task.date_fin_theorique) : null,
          date_fin_reelle: task.date_fin_reelle ? new Date(task.date_fin_reelle) : null,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Tâche introuvable');
        this.loading.set(false);
      },
    });

    // Load project collaborators for assignment
    this.projectService.getById(this.projectId).subscribe({
      next: (p) => {
        this.collaborators.set((p.collaborateurs as unknown as Collaborator[]) || []);
      },
    });
  }

  isSelected(id: string): boolean {
    return this.selectedCollaborators.includes(id);
  }

  toggleCollaborator(id: string): void {
    const idx = this.selectedCollaborators.indexOf(id);
    if (idx === -1) this.selectedCollaborators.push(id);
    else this.selectedCollaborators.splice(idx, 1);
  }

  onSubmit(): void {
    if (this.form.invalid || !this.canEdit()) return;
    this.saving.set(true);
    this.formError.set('');

    const payload: Partial<Task> = {
      ...this.form.value,
      collaborateurs: this.selectedCollaborators,
    };

    this.taskService.update(this.projectId, this.taskId, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open('Tâche mise à jour', 'OK', { duration: 3000 });
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(err.error?.message || 'Erreur lors de la mise à jour');
      },
    });
  }
}
