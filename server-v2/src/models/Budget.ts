import mongoose, { Document, Schema } from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Interface représentant les champs d'une ligne budgétaire en base. */
export interface IBudget {
  libelle: string;
  montant: number;
  description?: string;
  date_creation?: Date;
  date_derniere_modif?: Date;
}

export interface IBudgetDocument extends IBudget, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const budgetSchema = new Schema<IBudgetDocument>(
  {
    libelle: { type: String, required: true, trim: true },
    montant: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: 'date_creation', updatedAt: 'date_derniere_modif' },
  }
);

export default mongoose.model<IBudgetDocument>('Budget', budgetSchema);
