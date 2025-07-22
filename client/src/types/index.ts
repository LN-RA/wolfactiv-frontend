export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'text';
  question: string;
  options?: string[];
}

export interface QuizAnswers {
  goûts: string[];
  questions_psy: string;
}

export interface Parfum {
  nom: string;
  marque: string;
  image: string;
  lien_achat: string;
  description?: string;
}

export interface RadarData {
  floral: number;
  boisé: number;
  épicé: number;
  frais: number;
  oriental: number;
  gourmand: number;
}

export interface OlfactoryProfile {
  profil_nom: string;
  citation: string;
  parfums: Parfum[];
  radar_data: RadarData;
}

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
