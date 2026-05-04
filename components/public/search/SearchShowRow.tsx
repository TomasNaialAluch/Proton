"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { startPlayback } from "@/lib/player/startPlayback";
import type { PublicSearchShowRow } from "@/lib/search/publicSearch";
import HighlightedText from "./HighlightedText";

export default function SearchShowRow({
  row,
  query,
}: {
  row: PublicSearchShowRow;
  query: string;
}) {
  const artwork =
    (row.artist.image?.url ?? "/mix-artwork-fallback-dark-16x9.png").trim();

  return (
    <div
      className="flex gap-3 rounded-xl border p-3 transition-colors"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      <button
        type="button"
        className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-white/5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onClick={() => startPlayback(row)}
        aria-label={`Reproducir ${row.title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <Play size={22} className="text-white" fill="white" />
        </span>
      </button>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <p
          className="text-sm font-medium leading-snug line-clamp-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          <HighlightedText text={row.title} query={query} />
        </p>
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {row.artist.name}
          {row.genre ? ` · ${row.genre}` : ""}
          {row.date ? ` · ${row.date}` : ""}
        </p>
        <Link
          href={row.href}
          className="text-xs font-medium hover:underline w-fit"
          style={{ color: "var(--color-accent)" }}
        >
          Ver shows de este género
        </Link>
      </div>
    </div>
  );
}
