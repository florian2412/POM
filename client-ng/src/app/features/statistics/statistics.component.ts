import {
  Component, OnInit, signal, AfterViewInit, ElementRef,
  ViewChild, NgZone
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { ProjectService } from '../../core/services/project.service';
import { CollaboratorService } from '../../core/services/collaborator.service';
import { BudgetService } from '../../core/services/budget.service';
import { Project } from '../../core/models/project.model';
import { countByTerm, getDuration, STATUS_COLORS, CATEGORY_COLORS } from '../../core/services/stats.utils';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, MatSelectModule, MatFormFieldModule, MatTabsModule, FormsModule],
  template: `
    <h2>Statistiques</h2>

    @if (loading()) {
      <div class="center"><mat-spinner /></div>
    } @else {
      <mat-tab-group animationDuration="200ms" (selectedIndexChange)="onTabChange($event)">

        <!-- ── Onglet 1: Vue globale ─────────────────────────────────── -->
        <mat-tab label="Vue globale des projets">
          <div class="tab-content">
            <div class="charts-grid">
              <mat-card>
                <mat-card-title>Répartition par statut</mat-card-title>
                <canvas #pieProjectStatus></canvas>
              </mat-card>
              <mat-card>
                <mat-card-title>Projets par statut</mat-card-title>
                <canvas #barProjectStatus></canvas>
              </mat-card>
              <mat-card class="wide">
                <mat-card-title>Statut des tâches par projet</mat-card-title>
                <canvas #barTasksByProject></canvas>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- ── Onglet 2: Zoom projet ─────────────────────────────────── -->
        <mat-tab label="Zoom sur un projet">
          <div class="tab-content">
            <mat-form-field appearance="outline">
              <mat-label>Sélectionner un projet</mat-label>
              <mat-select [(ngModel)]="selectedProjectId" (ngModelChange)="updateProjectCharts()">
                @for (p of projects(); track p._id) {
                  <mat-option [value]="p._id">{{ p.nom }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            @if (selectedProjectId) {
              <div class="charts-grid">
                <mat-card>
                  <mat-card-title>Statut des tâches</mat-card-title>
                  <canvas #pieTaskStatus></canvas>
                </mat-card>
                <mat-card>
                  <mat-card-title>Catégories des tâches</mat-card-title>
                  <canvas #pieTaskCategories></canvas>
                </mat-card>
                <mat-card>
                  <mat-card-title>Consommation budgétaire</mat-card-title>
                  <canvas #pieBudget></canvas>
                </mat-card>
              </div>
            }
          </div>
        </mat-tab>

      </mat-tab-group>
    }
  `,
  styles: [`
    .center { display: flex; justify-content: center; padding: 40px; }
    .tab-content { padding: 20px 0; }
    .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    mat-card { padding: 16px; }
    mat-card.wide { grid-column: 1 / -1; }
    canvas { max-height: 300px; }
    mat-form-field { min-width: 300px; margin-bottom: 16px; }
  `],
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('pieProjectStatus') pieProjectStatusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barProjectStatus') barProjectStatusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barTasksByProject') barTasksByProjectCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieTaskStatus') pieTaskStatusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieTaskCategories') pieTaskCategoriesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieBudget') pieBudgetCanvas!: ElementRef<HTMLCanvasElement>;

  readonly loading = signal(true);
  readonly projects = signal<Project[]>([]);
  selectedProjectId = '';

  private charts: Chart[] = [];
  private collaboratorsMap: Record<string, number> = {};
  private budgetsMap: Record<string, number> = {};

  constructor(
    private projectService: ProjectService,
    private collaboratorService: CollaboratorService,
    private budgetService: BudgetService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    let ready = 0;
    const checkReady = () => {
      ready++;
      if (ready === 3) this.loading.set(false);
    };

    this.collaboratorService.getAll().subscribe({
      next: (collabs) => {
        for (const c of collabs) this.collaboratorsMap[c._id] = c.cout_horaire ?? 0;
        checkReady();
      },
      error: () => checkReady(),
    });

    this.budgetService.getAll().subscribe({
      next: (budgets) => {
        for (const b of budgets) this.budgetsMap[b._id] = b.montant;
        checkReady();
      },
      error: () => checkReady(),
    });

    this.projectService.getAll().subscribe({
      next: (ps) => { this.projects.set(ps); checkReady(); },
      error: () => checkReady(),
    });
  }

  ngAfterViewInit(): void {
    // Charts are built after tab becomes visible (see onTabChange)
  }

  onTabChange(index: number): void {
    if (index === 0) {
      setTimeout(() => this.buildGlobalCharts(), 50);
    }
  }

  private buildGlobalCharts(): void {
    this.destroyCharts();
    const ps = this.projects();
    if (!ps.length) return;

    // Pie: project statuses
    if (this.pieProjectStatusCanvas) {
      const statuts = ps.map((p) => p.statut);
      const [labels, values] = countByTerm(statuts);
      const colors = labels.map((l) => STATUS_COLORS[l] || '#9E9E9E');
      this.buildChart(this.pieProjectStatusCanvas, 'pie', labels, values, colors);
    }

    // Bar: project statuses
    if (this.barProjectStatusCanvas) {
      const statuts = ps.map((p) => p.statut);
      const [labels, values] = countByTerm(statuts);
      const colors = labels.map((l) => STATUS_COLORS[l] || '#9E9E9E');
      this.buildChart(this.barProjectStatusCanvas, 'bar', labels, values, colors);
    }

    // Stacked bar: task statuses per project
    if (this.barTasksByProjectCanvas) {
      const taskStatuts = ['Initial', 'En cours', 'Terminé(e)', 'Annulé(e)'];
      const projectNames = ps.map((p) => p.nom);

      const datasets = taskStatuts.map((statut) => ({
        label: statut,
        data: ps.map((p) => (p.taches || []).filter((t) => t.statut === statut).length),
        backgroundColor: STATUS_COLORS[statut] || '#9E9E9E',
      }));

      const chart = new Chart(this.barTasksByProjectCanvas.nativeElement, {
        type: 'bar',
        data: { labels: projectNames, datasets },
        options: { responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } },
      });
      this.charts.push(chart);
    }
  }

  updateProjectCharts(): void {
    const project = this.projects().find((p) => p._id === this.selectedProjectId);
    if (!project) return;

    setTimeout(() => {
      // Pie: task statuses
      if (this.pieTaskStatusCanvas) {
        const statuts = (project.taches || []).map((t) => t.statut);
        const [labels, values] = countByTerm(statuts);
        this.buildChart(this.pieTaskStatusCanvas, 'pie', labels, values,
          labels.map((l) => STATUS_COLORS[l] || '#9E9E9E'));
      }

      // Pie: task categories
      if (this.pieTaskCategoriesCanvas) {
        const cats = (project.taches || []).map((t) => t.categorie ?? 'Inconnu');
        const [labels, values] = countByTerm(cats);
        this.buildChart(this.pieTaskCategoriesCanvas, 'pie', labels, values,
          labels.map((l) => CATEGORY_COLORS[l] || '#9E9E9E'));
      }

      // Pie: budget consumption
      if (this.pieBudgetCanvas) {
        const budgetId = project.ligne_budgetaire?.id;
        const totalBudget = budgetId ? (this.budgetsMap[budgetId] ?? 0) : 0;

        let totalCost = 0;
        for (const task of (project.taches || [])) {
          const dur = getDuration(task.date_debut ?? '', task.date_fin_theorique ?? '');
          for (const cId of (task.collaborateurs || [])) {
            totalCost += (this.collaboratorsMap[cId as string] ?? 0) * 7 * dur;
          }
        }
        const consumed = Math.min(totalCost, totalBudget);
        const remaining = Math.max(totalBudget - totalCost, 0);

        this.buildChart(this.pieBudgetCanvas, 'pie',
          ['Consommé', 'Restant'], [consumed, remaining], ['#F44336', '#4CAF50']);
      }
    }, 50);
  }

  private buildChart(
    canvasRef: ElementRef<HTMLCanvasElement>,
    type: 'pie' | 'bar',
    labels: string[],
    data: number[],
    colors: string[]
  ): void {
    const existing = this.charts.find(
      (c) => c.canvas === canvasRef.nativeElement
    );
    if (existing) existing.destroy();

    const chart = new Chart(canvasRef.nativeElement, {
      type,
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors }],
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
    });
    this.charts.push(chart);
  }

  private destroyCharts(): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }
}
