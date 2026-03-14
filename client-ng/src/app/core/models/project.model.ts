import { Task } from './task.model';

export type ProjectStatus = 'Initial' | 'En cours' | 'Terminé(e)' | 'Annulé(e)' | 'Archivé';

export interface LigneBudgetaire {
  id: string;
  montant_restant: number;
}

export interface Project {
  _id: string;
  nom: string;
  code?: string;
  chef_projet?: { _id: string; nom: string; prenom: string; pseudo: string } | string;
  date_debut?: string;
  date_fin_theorique?: string;
  date_fin_reelle?: string;
  statut: ProjectStatus;
  collaborateurs?: Array<{ _id: string; nom: string; prenom: string; pseudo: string } | string>;
  ligne_budgetaire?: LigneBudgetaire;
  description?: string;
  taches?: Task[];
  date_creation?: string;
  date_derniere_modif?: string;
}
