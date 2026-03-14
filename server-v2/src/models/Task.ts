import mongoose, { Document, Schema, Types } from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TaskStatus = 'Initial' | 'En cours' | 'Terminé(e)' | 'Annulé(e)';
export type TaskCategory =
  | 'Etude de projet'
  | 'Spécification'
  | 'Développement'
  | 'Recette'
  | 'Mise en production';

/** Interface représentant une tâche (document autonome, collection séparée si nécessaire). */
export interface ITask {
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

export interface ITaskDocument extends ITask, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const taskSchema = new Schema<ITaskDocument>(
  {
    libelle: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    description: { type: String, trim: true },
    categorie: { type: String, trim: true },
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

export default mongoose.model<ITaskDocument>('Task', taskSchema);
