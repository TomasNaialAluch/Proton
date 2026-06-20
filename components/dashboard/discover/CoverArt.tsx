function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) % 360;
  return h;
}

/** Deterministic accent color per genre — same genre always renders the same hue. */
export function genreColor(genre: string): string {
  return `hsl(${hashString(genre)}, 70%, 55%)`;
}

/** Same hue as `genreColor`, low-alpha, for badge backgrounds. */
export function genreColorBg(genre: string): string {
  return `hsla(${hashString(genre)}, 70%, 55%, 0.12)`;
}

interface CoverArtProps {
  seed: string;
  className?: string;
}

/**
 * No real artwork in the mock catalog — renders a deterministic gradient tile
 * per track (same seed always produces the same look) instead of a blank box,
 * so the grid reads like a real release feed.
 */
export default function CoverArt({ seed, className = "" }: CoverArtProps) {
  const hue1 = hashString(seed);
  const hue2 = hashString(`${seed}-b`);
  return (
    <div
      className={`aspect-square rounded-lg shrink-0 ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue1}, 65%, 45%), hsl(${hue2}, 70%, 30%))`,
      }}
      aria-hidden
    />
  );
}
