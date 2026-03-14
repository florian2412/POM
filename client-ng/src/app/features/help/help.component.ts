import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [MatCardModule, MatExpansionModule],
  template: `
    <h2>Aide</h2>
    <mat-accordion>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Comment créer un projet ?</mat-panel-title>
        </mat-expansion-panel-header>
        <p>Cliquez sur "Projets" dans le menu latéral, puis sur "Nouveau projet".</p>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Comment gérer les collaborateurs ?</mat-panel-title>
        </mat-expansion-panel-header>
        <p>Les rôles Admin et Manager peuvent accéder à la section "Collaborateurs".</p>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Comment changer mon mot de passe ?</mat-panel-title>
        </mat-expansion-panel-header>
        <p>Allez dans "Mon profil" en cliquant sur l'icône en haut à droite.</p>
      </mat-expansion-panel>
    </mat-accordion>
  `,
})
export class HelpComponent {}
