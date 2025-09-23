// src/lib/storage.ts
export type RecentCase = { slug: string; name: string; ts: number };
const KEY = "ghigus:recents";
const MAX = 8;

export function getRecentCases(): RecentCase[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as RecentCase[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addRecentCase(slug: string, name: string) {
  const now = Date.now();
  const list = getRecentCases().filter((x) => x.slug !== slug);
  list.unshift({ slug, name, ts: now });
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
}
