const KEY = "newstore_bookmarks_v1";

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().includes(id);
}

export function toggleBookmark(id: string): string[] {
  const cur = new Set(getBookmarks());
  if (cur.has(id)) cur.delete(id);
  else cur.add(id);

  const next = Array.from(cur);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearBookmarks() {
  localStorage.removeItem(KEY);
}
