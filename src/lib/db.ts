import { Store } from "./stores";

const KEY = "newstore_map_stores_v1";

function safeParse<T>(text: string | null, fallback: T): T {
  try {
    if (!text) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export function loadStores(fallback: Store[]): Store[] {
  if (typeof window === "undefined") return fallback;
  const data = safeParse<Store[]>(localStorage.getItem(KEY), fallback);
  return Array.isArray(data) ? data : fallback;
}

export function saveStores(stores: Store[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(stores));
}

export function addStore(stores: Store[], newStore: Store): Store[] {
  const next = [newStore, ...stores];
  saveStores(next);
  return next;
}

export function updateStore(stores: Store[], updated: Store): Store[] {
  const next = stores.map((s) => (s.id === updated.id ? updated : s));
  saveStores(next);
  return next;
}

export function deleteStore(stores: Store[], id: string): Store[] {
  const next = stores.filter((s) => s.id !== id);
  saveStores(next);
  return next;
}
