export interface Budget {
  _id: string;
  libelle: string;
  montant: number;
  description?: string;
  date_creation?: string;
  date_derniere_modif?: string;
}
