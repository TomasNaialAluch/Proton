function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) % 360;
  return h;
}

/**
 * No real avatar/logo in the mock data — renders a deterministic gradient
 * per entity (same id always produces the same look) with initials on
 * top, instead of a flat single-color box. Same idea as
 * components/dashboard/discover/CoverArt.tsx — circular for people
 * (default), square-ish for label logos via `shapeClassName` — see
 * docs/feature-track-detail.md and docs/feature-artist-detail.md for why
 * a specific, per-entity visual identity matters more than it might seem.
 */
export default function AvatarGradient({
  seed,
  initials,
  className = "",
  shapeClassName = "rounded-full",
}: {
  seed: string;
  initials: string;
  className?: string;
  shapeClassName?: string;
}) {
  const hue1 = hashString(seed);
  const hue2 = hashString(`${seed}-b`);
  return (
    <div
      className={`${shapeClassName} shrink-0 flex items-center justify-center font-bold text-white ${className}`}
      style={{ background: `linear-gradient(135deg, hsl(${hue1}, 65%, 45%), hsl(${hue2}, 70%, 30%))` }}
      aria-hidden
    >
      {initials}
    </div>
  );
}
