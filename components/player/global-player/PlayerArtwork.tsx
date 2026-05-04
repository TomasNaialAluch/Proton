import type { ProtonMix } from "@/types/mix";

const SIZE_CLASS = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
} as const;

type SizeKey = keyof typeof SIZE_CLASS;

interface PlayerArtworkProps {
  mix: ProtonMix;
  size: SizeKey;
  rounded?: "default" | "full";
}

export default function PlayerArtwork({
  mix,
  size,
  rounded = "default",
}: PlayerArtworkProps) {
  const url = mix.artist.image?.url;
  const roundClass = rounded === "full" ? "rounded-full" : "rounded";

  return (
    <div
      className={`${SIZE_CLASS[size]} shrink-0 overflow-hidden bg-white/10 flex items-center justify-center ${roundClass}`}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-white/10" aria-hidden />
      )}
    </div>
  );
}
