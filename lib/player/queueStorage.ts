const STORAGE_KEY = "proton-player-queue";

/** Solo ids — no objetos `ProtonMix` completos, para no quedar con datos stale
 *  si la API real cambia título/artwork/etc. de un mix entre sesiones. */
export function readQueueMixIds(): string[] {
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

export function writeQueueMixIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}
