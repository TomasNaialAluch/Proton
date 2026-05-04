import type { ProtonLabel } from "@/types/label";
import type { ProtonMix } from "@/types/mix";

export type PublicSearchArtist = {
  id: string;
  name: string;
  image: { url: string } | null;
  href: string;
};

export type PublicSearchLabelRow = ProtonLabel & {
  href: string;
};

export type PublicSearchShowRow = ProtonMix & {
  href: string;
};

export type PublicSearchResults = {
  artists: PublicSearchArtist[];
  labels: PublicSearchLabelRow[];
  shows: PublicSearchShowRow[];
};

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/** Segmento de URL para `[artist-name]` (primer segmento del pathname). */
export function artistPathSegment(name: string): string {
  const s = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "artist";
}

/** Ruta `/shows/[genre]` alineada con `ShowsView` / `GenreChip`. */
export function genreToShowsHref(genre: string): string {
  const g = genre.trim();
  if (!g) return "/shows";
  const slug = g.toLowerCase().replace(/\s+/g, "-");
  return `/shows/${slug}`;
}

function mixMatchesQuery(mix: ProtonMix, q: string): boolean {
  const n = normalize(q);
  if (!n) return false;
  const hay = [
    mix.title,
    mix.artist.name,
    mix.genre,
    mix.date,
  ]
    .filter(Boolean)
    .map((x) => normalize(String(x)));
  return hay.some((h) => h.includes(n));
}

function labelMatchesQuery(label: ProtonLabel, q: string): boolean {
  const n = normalize(q);
  if (!n) return false;
  return (
    normalize(label.name).includes(n) ||
    normalize(label.slug).includes(n)
  );
}

/**
 * MVP: filtra en cliente sobre listas ya cargadas (últimos mixes + labels).
 * Artistas: únicos entre mixes que matchean el término (no hay índice global).
 */
export function searchPublicIndex(
  mixes: ProtonMix[],
  labels: ProtonLabel[],
  rawQuery: string
): PublicSearchResults {
  const q = rawQuery.trim();
  if (!q) {
    return { artists: [], labels: [], shows: [] };
  }

  const matchingMixes = mixes.filter((m) => mixMatchesQuery(m, q));

  const artistMap = new Map<string, PublicSearchArtist>();
  for (const mix of matchingMixes) {
    const id = mix.artist.id;
    if (!artistMap.has(id)) {
      artistMap.set(id, {
        id,
        name: mix.artist.name,
        image: mix.artist.image,
        href: `/${artistPathSegment(mix.artist.name)}`,
      });
    }
  }
  const artists = Array.from(artistMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const labelRows = labels
    .filter((l) => labelMatchesQuery(l, q))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      (l): PublicSearchLabelRow => ({
        ...l,
        href: "/labels",
      })
    );

  const shows = matchingMixes
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (mix): PublicSearchShowRow => ({
        ...mix,
        href: genreToShowsHref(mix.genre),
      })
    );

  return { artists, labels: labelRows, shows };
}
