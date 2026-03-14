export type UserRole = 'admin' | 'manager' | 'collaborateur';

export interface Collaborator {
  _id: string;
  nom: string;
  prenom: string;
  pseudo: string;
  email: string;
  role: UserRole;
  fonction?: string;
  cout_horaire?: number;
  manager?: string;
  date_creation?: string;
  date_derniere_modif?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  collaborator: Collaborator;
}

export interface LoginCredentials {
  pseudo: string;
  mot_de_passe: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { msg: string; path: string }[];
}
