"use client";

import Link from "next/link";
import type { ProtonGenre } from "@/lib/data/genres";

export default function GenreTile({ genre }: { genre: ProtonGenre }) {
  return (
    <Link
      href={`/dashboard/labels/genre/${genre.slug}`}
      className="group relative overflow-hidden rounded-xl border border-white/5 transition-all duration-150 hover:scale-[1.02] hover:border-white/10 active:scale-[0.99]"
      style={{
        background: `linear-gradient(135deg, ${genre.bgFrom} 0%, ${genre.bgTo} 100%)`,
        minHeight: 88,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative flex flex-col gap-1 p-4">
        <span className="text-sm font-semibold text-white/90 leading-snug">{genre.label}</span>
        <span className="text-xs font-medium" style={{ color: genre.accent }}>
          {genre.count} {genre.count === 1 ? "label" : "labels"}
        </span>
      </div>
    </Link>
  );
}
