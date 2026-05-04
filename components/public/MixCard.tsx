"use client";

import { Play } from "lucide-react";
import { startPlayback } from "@/lib/player/startPlayback";
import { usePlayerStore } from "@/lib/store/playerStore";
import type { ProtonMix } from "@/types/mix";

const MIX_ARTWORK_FALLBACK = "/mix-artwork-fallback-dark-16x9.png";

interface MixCardProps {
  mix: ProtonMix;
  size?: "sm" | "md" | "lg";
}

export default function MixCard({ mix, size = "md" }: MixCardProps) {
  const currentMix = usePlayerStore((s) => s.currentMix);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const isActive = currentMix?.id === mix.id;
  const artworkSrc = (mix.artist.image?.url ?? MIX_ARTWORK_FALLBACK).trim();

  const titleSize = size === "sm" ? "text-xs" : "text-sm";
  const metaSize = size === "sm" ? "text-[11px]" : "text-xs";
  const artworkClass =
    "object-cover transition-transform duration-300 group-hover:scale-105";

  return (
    <article
      className="flex flex-col gap-2 group cursor-pointer"
      onClick={() => startPlayback(mix)}
    >
      {/* Artwork: siempre <img> — la API usa muchos hosts GCS/CDN y next/image exige allowlist */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artworkSrc}
          alt={mix.title}
          className={`absolute inset-0 h-full w-full ${artworkClass}`}
          loading="lazy"
          decoding="async"
        />

        {/* Play overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-accent)" }}
          >
            <Play size={18} className="text-white" fill="white" />
          </div>
        </div>

        {/* Active indicator */}
        {isActive && isPlaying && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold text-white"
            style={{ background: "var(--color-accent)" }}
          >
            PLAYING
          </div>
        )}

        {/* Duration badge */}
        {mix.duration && (
          <span
            className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
            style={{ background: "rgba(0,0,0,0.65)" }}
          >
            {mix.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <p
          className={`${titleSize} font-medium leading-snug line-clamp-2`}
          style={{ color: "var(--color-text-primary)" }}
        >
          {mix.title}
        </p>
        <p className={`${metaSize}`} style={{ color: "var(--color-text-secondary)" }}>
          {mix.artist.name}
          {mix.genre && ` · ${mix.genre}`}
        </p>
      </div>
    </article>
  );
}
