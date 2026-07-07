const STORAGE_KEY = "proton-liked-mixes";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function getLikedMixIds(): string[] {
  return readIds();
}

export function isLiked(mixId: string): boolean {
  return readIds().includes(mixId);
}

/** Toggles the like state for a mix and returns the new state. */
export function toggleLike(mixId: string): boolean {
  const ids = readIds();
  const alreadyLiked = ids.includes(mixId);
  const next = alreadyLiked ? ids.filter((id) => id !== mixId) : [...ids, mixId];
  writeIds(next);
  return !alreadyLiked;
}
