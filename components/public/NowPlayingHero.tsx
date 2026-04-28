"use client";

import { Play } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";
import type { ProtonMix } from "@/types/mix";

interface NowPlayingHeroProps {
  mix: ProtonMix;
}

export default function NowPlayingHero({ mix }: NowPlayingHeroProps) {
  const { play, isPlaying, currentMix } = usePlayerStore();

  const isActive = currentMix?.id === mix.id && isPlaying;
  const artwork = mix.artist.image?.url;

  return (
    <section
      className="relative w-full flex items-end min-h-[60vh] md:min-h-[70vh] overflow-hidden"
      style={{ background: "#0B0E14" }}
    >
      {/* Background image */}
      {artwork && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={artwork}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm scale-105"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 md:px-8 pb-12 md:pb-16">
        <div className="flex flex-col gap-4 max-w-xl">
          {/* Live badge */}
          <span
            className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-bold tracking-widest text-white uppercase"
            style={{ background: "var(--color-accent)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live Now
          </span>

          {/* Artist + Show name */}
          <div>
            <h1
              className="text-3xl md:text-5xl font-bold italic leading-tight"
              style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
            >
              {mix.artist.name}
            </h1>
            <p
              className="text-base md:text-xl mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {mix.title}
            </p>
          </div>

          {/* Play button */}
          <button
            onClick={() => play(mix)}
            className="inline-flex items-center gap-3 w-fit px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-accent)" }}
          >
            <Play size={16} fill="white" />
            {isActive ? "Now Playing" : "Play Live Stream"}
          </button>
        </div>
      </div>
    </section>
  );
}
