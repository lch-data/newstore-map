"use client";

export type AuthUser = {
  username: string;
  name: string;
  role: "admin" | "user" | "store";
  storeId?: string;
};

const AUTH_USER_KEY = "mvp:user";
const ALL_USERS_KEY = "mvp:users";

export function getAllUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ALL_USERS_KEY);
    return raw ? (JSON.parse(raw) as AuthUser[]) : [];
  } catch {
    return [];
  }
}

export function saveAllUsers(users: AuthUser[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function saveAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin";
}
