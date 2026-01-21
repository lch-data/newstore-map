"use client";

export type AuthUser = {
  username: string;
  name: string;
  role: "admin" | "user";
};

const KEY = "mvp:user";

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function saveAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearAuthUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin";
}
