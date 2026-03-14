import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from "@angular/material/chips";
import { DecimalPipe } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '../../../core/services/project.service';
import { BudgetService } from '../../../core/services/budget.service';
import { CollaboratorService } from '../../../core/services/collaborator.service';
import { AuthService } from '../../../core/services/auth.service';
import { Budget } from '../../../core/models/budget.model';
import { Collaborator } from '../../../core/models/collaborator.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-projects-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    DecimalPipe,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Nouveau projet</mat-card-title>
        @if (generatedCode()) {
          <mat-card-subtitle>Code : <code>{{ generatedCode() }}</code></mat-card-subtitle>
        }
      </mat-card-header>
      <mat-card-content>
        @if (error()) {
          <div class="error-banner">{{ error() }}</div>
        }
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nom du projet *</mat-label>
            <input matInput formControlName="nom" />
            @if (form.get('nom')?.hasError('required') && form.get('nom')?.touched) {
              <mat-error>Nom requis</mat-error>
            }
          </mat-form-field>

          <div class="row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Date de début *</mat-label>
              <input matInput [matDatepicker]="pickerDebut" formControlName="date_debut"
                [min]="today" [matDatepickerFilter]="workDayFilter" />
              <mat-datepicker-toggle matIconSuffix [for]="pickerDebut"></mat-datepicker-toggle>
              <mat-datepicker #pickerDebut></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Date de fin théorique *</mat-label>
              <input matInput [matDatepicker]="pickerFin" formControlName="date_fin_theorique"
                [min]="today" [matDatepickerFilter]="workDayFilter" />
              <mat-datepicker-toggle matIconSuffix [for]="pickerFin"></mat-datepicker-toggle>
              <mat-datepicker #pickerFin></mat-datepicker>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Ligne budgétaire *</mat-label>
            <mat-select formControlName="budget_id">
              @for (b of budgets(); track b._id) {
                <mat-option [value]="b._id">{{ b.libelle }} ({{ b.montant | number:'1.0-0' }} €)</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3"></textarea>
          </mat-form-field>

          <div class="collaborators-section">
            <strong>Collaborateurs ({{ selectedCollaborators.length }} sélectionnés)</strong>
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
            <a mat-button routerLink="/projects">Annuler</a>
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
    code { font-family: monospace; }
  `],
})
export class ProjectsCreateComponent implements OnInit {
  readonly form: FormGroup;
  readonly loading = signal(false);
  readonly error = signal('');
  readonly budgets = signal<Budget[]>([]);
  readonly collaborators = signal<Collaborator[]>([]);
  readonly generatedCode = signal('');
  readonly today = new Date();

  selectedCollaborators: string[] = [];

  readonly workDayFilter = (date: Date | null): boolean => {
    if (!date) return true;
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private budgetService: BudgetService,
    private collaboratorService: CollaboratorService,
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      date_debut: [null, Validators.required],
      date_fin_theorique: [null, Validators.required],
      budget_id: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.budgetService.getAll().subscribe({ next: (b) => this.budgets.set(b) });

    this.collaboratorService.getAll().subscribe({
      next: (all) => {
        const currentId = this.auth.currentUser()?._id;
        // Exclude current user from the picker (they are auto-added)
        this.collaborators.set(all.filter((c) => c._id !== currentId));
      },
    });

    // Fetch auto-generated project code
    const year = new Date().getFullYear();
    this.http
      .get<{ code: string }>(`${environment.apiUrl}/projects/generate-code?year=${year}`)
      .subscribe({ next: (r) => this.generatedCode.set(r.code) });
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

    const currentId = this.auth.currentUser()?._id;
    const collaborateurs = currentId
      ? [currentId, ...this.selectedCollaborators.filter((id) => id !== currentId)]
      : this.selectedCollaborators;

    const { budget_id, ...rest } = this.form.value;
    const selectedBudget = this.budgets().find((b) => b._id === budget_id);

    const payload = {
      ...rest,
      code: this.generatedCode(),
      statut: 'Initial',
      chef_projet: currentId,
      collaborateurs,
      ligne_budgetaire: { id: budget_id, montant_restant: selectedBudget?.montant ?? 0 },
    };

    this.projectService.create(payload).subscribe({
      next: (p) => {
        this.loading.set(false);
        this.router.navigate(['/projects', p._id]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de la création');
      },
    });
  }
}
