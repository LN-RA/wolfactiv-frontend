import { User } from "@/types";

const AUTH_KEY = "wolfactiv_auth";

export function saveAuth(user: User): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function getAuth(): User | null {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getAuth() !== null;
}
