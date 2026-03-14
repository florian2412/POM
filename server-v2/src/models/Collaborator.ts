import mongoose, { Document, Schema } from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'collaborateur';

/** Interface représentant les champs d'un collaborateur en base. */
export interface ICollaborator {
  nom: string;
  prenom: string;
  pseudo: string;
  /** Hash bcrypt — masqué par défaut dans les réponses. */
  mot_de_passe?: string;
  manager?: mongoose.Types.ObjectId | null;
  fonction?: string;
  cout_horaire: number;
  role: UserRole;
  email: string;
  date_creation?: Date;
  date_derniere_modif?: Date;
}

export interface ICollaboratorDocument extends ICollaborator, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const collaboratorSchema = new Schema<ICollaboratorDocument>(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    pseudo: { type: String, required: true, unique: true, trim: true, lowercase: true },
    mot_de_passe: { type: String, required: true, select: false },
    manager: { type: Schema.Types.ObjectId, ref: 'Collaborateur', default: null },
    fonction: { type: String, trim: true },
    cout_horaire: { type: Number, min: 0, default: 0 },
    role: {
      type: String,
      enum: ['admin', 'collaborateur', 'manager'] satisfies UserRole[],
      default: 'collaborateur',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
  },
  {
    timestamps: { createdAt: 'date_creation', updatedAt: 'date_derniere_modif' },
  }
);

// Ne jamais retourner le mot de passe dans les réponses JSON
collaboratorSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: unknown, ret: any): any => {
    delete ret.mot_de_passe;
    return ret;
  },
});

export default mongoose.model<ICollaboratorDocument>('Collaborateur', collaboratorSchema);
