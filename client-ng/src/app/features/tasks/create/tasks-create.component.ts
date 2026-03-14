import { Component, OnInit, signal } from '@angular/core';
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
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { SettingsService } from '../../../core/services/settings.service';
import { generateTaskCode } from '../../../core/services/stats.utils';
import { Collaborator } from '../../../core/models/collaborator.model';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-tasks-create',
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
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Nouvelle tâche</mat-card-title>
        @if (project()) {
          <mat-card-subtitle>Projet : {{ project()!.nom }}</mat-card-subtitle>
        }
      </mat-card-header>
      <mat-card-content>
        @if (error()) {
          <div class="error-banner">{{ error() }}</div>
        }
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Libellé *</mat-label>
            <input matInput formControlName="libelle" />
            @if (form.get('libelle')?.hasError('required') && form.get('libelle')?.touched) {
              <mat-error>Libellé requis</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Catégorie *</mat-label>
            <mat-select formControlName="categorie">
              @for (c of categories(); track c) {
                <mat-option [value]="c">{{ c }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3"></textarea>
          </mat-form-field>

          <div class="row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Date de début</mat-label>
              <input matInput [matDatepicker]="pickerDebut" formControlName="date_debut"
                [min]="minDate()" [max]="maxDate()" [matDatepickerFilter]="workDayFilter" />
              <mat-datepicker-toggle matIconSuffix [for]="pickerDebut"></mat-datepicker-toggle>
              <mat-datepicker #pickerDebut></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Date de fin théorique</mat-label>
              <input matInput [matDatepicker]="pickerFin" formControlName="date_fin_theorique"
                [min]="minDate()" [max]="maxDate()" [matDatepickerFilter]="workDayFilter" />
              <mat-datepicker-toggle matIconSuffix [for]="pickerFin"></mat-datepicker-toggle>
              <mat-datepicker #pickerFin></mat-datepicker>
            </mat-form-field>
          </div>

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

          <div class="actions">
            <a mat-button [routerLink]="['..']">Annuler</a>
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
    .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
    .error-banner { background: #fdecea; color: #b00020; padding: 12px; border-radius: 4px; margin-bottom: 12px; }
    .collaborators-section { margin-bottom: 16px; }
    .chips-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  `],
})
export class TasksCreateComponent implements OnInit {
  readonly form: FormGroup;
  readonly loading = signal(false);
  readonly error = signal('');
  readonly categories = signal<string[]>([]);
  readonly collaborators = signal<Collaborator[]>([]);
  readonly project = signal<Project | null>(null);
  readonly minDate = signal<Date | null>(null);
  readonly maxDate = signal<Date | null>(null);

  private projectId = '';
  private selectedCollaborators: string[] = [];

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
    private settingsService: SettingsService
  ) {
    this.form = this.fb.group({
      libelle: ['', Validators.required],
      categorie: ['', Validators.required],
      description: [''],
      date_debut: [new Date()],
      date_fin_theorique: [new Date()],
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';

    this.settingsService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
    });

    this.projectService.getById(this.projectId).subscribe({
      next: (p) => {
        this.project.set(p);
        this.minDate.set(p.date_debut ? new Date(p.date_debut) : null);
        this.maxDate.set(p.date_fin_theorique ? new Date(p.date_fin_theorique) : null);
        // Extract collaborator objects from the project
        const collabs = p.collaborateurs as unknown as Collaborator[];
        this.collaborators.set(collabs || []);
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
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const payload = {
      ...this.form.value,
      collaborateurs: this.selectedCollaborators,
    };

    this.taskService.create(this.projectId, payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de la création');
      },
    });
  }
}
