export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'text' | 'contact' | 'image_selection' | 'memory';
  question: string;
  options?: string[];
  images?: string[];
  category: 'contact' | 'memory' | 'personality' | 'sensory' | 'feedback';
}

export interface QuizAnswers {
  // Contact info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  submittedAt: string;
  
  // Memory question
  hasStrongMemory: boolean;
  strongMemoryOdor?: string;
  
  // Personality questions (for MBTI inference)
  personalityAnswers: { [key: string]: string };
  
  // Sensory questions
  dislikedOdors: string[];
  happyMemoryOdor: string;
  happyMemoryAdjectives: string[];
  
  // Final feedback
  finalComment: string;
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
