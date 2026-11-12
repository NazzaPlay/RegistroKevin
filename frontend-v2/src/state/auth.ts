// src/state/auth.ts
// Estado global de autenticación (muy básico, usa módulos ES)

export interface User {
  id: number;
  email: string;
  displayName: string;
  role: 'ADMIN' | 'DRIVER';
}

let currentUser: User | null = null;

export function setUser(user: User | null) {
  currentUser = user;
}

export function getUser(): User | null {
  return currentUser;
}

export function isAuthenticated(): boolean {
  return currentUser !== null;
}

export function isAdmin(): boolean {
  return currentUser?.role === 'ADMIN';
}
