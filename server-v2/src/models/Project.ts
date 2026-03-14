import mongoose, { Document, Schema, Types } from 'mongoose';
import { TaskStatus, TaskCategory } from './Task';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectStatus = 'Initial' | 'En cours' | 'Terminé(e)' | 'Annulé(e)' | 'Archivé';

/** Sous-document représentant une tâche embarquée dans un projet. */
export interface IEmbeddedTask {
  _id: Types.ObjectId;
  libelle: string;
  code?: string;
  description?: string;
  categorie?: TaskCategory;
  date_debut?: Date;
  date_fin_theorique?: Date;
  date_fin_reelle?: Date;
  statut: TaskStatus;
  projet_id?: Types.ObjectId;
  collaborateurs: Types.ObjectId[];
  date_creation?: Date;
  date_derniere_modif?: Date;
}

/** Interface représentant les champs d'un projet en base. */
export interface IProject {
  nom: string;
  code?: string;
  chef_projet?: Types.ObjectId;
  date_debut?: Date;
  date_fin_theorique?: Date;
  date_fin_reelle?: Date;
  statut: ProjectStatus;
  collaborateurs: Types.ObjectId[];
  ligne_budgetaire?: {
    id: Types.ObjectId;
    montant_restant: number;
  };
  description?: string;
  /** Tâches embarquées dans le projet (embedded documents). */
  taches: Types.DocumentArray<IEmbeddedTask & Document>;
  date_creation?: Date;
  date_derniere_modif?: Date;
}

export interface IProjectDocument extends IProject, Document {}

// ─── Embedded task schema ─────────────────────────────────────────────────────

const embeddedTaskSchema = new Schema<IEmbeddedTask>(
  {
    libelle: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    description: { type: String, trim: true },
    categorie: {
      type: String,
      enum: [
        'Etude de projet',
        'Spécification',
        'Développement',
        'Recette',
        'Mise en production',
      ] satisfies TaskCategory[],
    },
    date_debut: Date,
    date_fin_theorique: Date,
    date_fin_reelle: Date,
    statut: {
      type: String,
      enum: ['Initial', 'En cours', 'Terminé(e)', 'Annulé(e)'] satisfies TaskStatus[],
      default: 'Initial',
    },
    projet_id: { type: Schema.Types.ObjectId, ref: 'Project' },
    collaborateurs: [{ type: Schema.Types.ObjectId, ref: 'Collaborateur' }],
  },
  {
    timestamps: { createdAt: 'date_creation', updatedAt: 'date_derniere_modif' },
  }
);

// ─── Project schema ───────────────────────────────────────────────────────────

const projectSchema = new Schema<IProjectDocument>(
  {
    nom: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    chef_projet: { type: Schema.Types.ObjectId, ref: 'Collaborateur' },
    date_debut: Date,
    date_fin_theorique: Date,
    date_fin_reelle: Date,
    statut: {
      type: String,
      enum: ['Initial', 'En cours', 'Terminé(e)', 'Annulé(e)', 'Archivé'] satisfies ProjectStatus[],
      default: 'Initial',
    },
    collaborateurs: [{ type: Schema.Types.ObjectId, ref: 'Collaborateur' }],
    ligne_budgetaire: {
      id: { type: Schema.Types.ObjectId, ref: 'Budget' },
      montant_restant: Number,
    },
    description: { type: String, trim: true },
    taches: [embeddedTaskSchema],
  },
  {
    timestamps: { createdAt: 'date_creation', updatedAt: 'date_derniere_modif' },
  }
);

export default mongoose.model<IProjectDocument>('Project', projectSchema);
