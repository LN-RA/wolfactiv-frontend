import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types";

const AUTH_KEY = "wolfactiv_auth";

// Sauvegarde l'utilisateur dans localStorage (optionnel)
export function saveAuth(user: User): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

// Efface les données locales et déconnecte Supabase
export async function clearAuth(): Promise<void> {
  await supabase.auth.signOut();
  localStorage.removeItem(AUTH_KEY);
}

// ✅ Fonction principale : récupère l'utilisateur connecté
export async function getAuth(): Promise<User | null> {
  // 1. Essaye via Supabase
  const { data, error } = await supabase.auth.getUser();

  if (data?.user) {
    const user = data.user;
    return {
      id: user.id,
      email: user.email!,
      firstName: user.user_metadata?.firstName || "",
      lastName: user.user_metadata?.lastName || "",
    };
  }

  // 2. Fallback localStorage si Supabase échoue
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Pour vérifier rapidement en mode synchrone (optionnel)
export function isAuthenticated(): boolean {
  return !!localStorage.getItem(AUTH_KEY);
}
