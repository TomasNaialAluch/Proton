import type { ProtonMix } from "@/types/mix";

/**
 * Builds a radio-style queue seeded from a mix: same artist first (most
 * relevant), then same genre, then random fill from the rest — never the
 * seed mix itself, never duplicates.
 */
export function buildRadioQueue(
  seedMix: ProtonMix,
  allMixes: ProtonMix[],
  targetCount: number
): ProtonMix[] {
  const pool = allMixes.filter((m) => m.id !== seedMix.id);

  const sameArtist = pool.filter((m) => m.artist.id === seedMix.artist.id);
  const sameArtistIds = new Set(sameArtist.map((m) => m.id));

  const sameGenre = pool.filter(
    (m) => m.genre === seedMix.genre && !sameArtistIds.has(m.id)
  );
  const sameGenreIds = new Set(sameGenre.map((m) => m.id));

  const rest = pool.filter(
    (m) => !sameArtistIds.has(m.id) && !sameGenreIds.has(m.id)
  );
  const shuffledRest = [...rest].sort(() => Math.random() - 0.5);

  return [...sameArtist, ...sameGenre, ...shuffledRest].slice(0, targetCount);
}
