"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchLabels } from "@/lib/api/labels";
import {
  DEMO_LABEL_TRACKS,
  LABEL_DEMO_CATALOG_NOTICE,
} from "@/lib/mock/labelDemoTracks";
import type { ProtonLabel } from "@/types/label";

export default function LabelDetailView() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug =
    typeof slugParam === "string"
      ? decodeURIComponent(slugParam)
      : Array.isArray(slugParam)
        ? decodeURIComponent(slugParam[0] ?? "")
        : "";

  const [labels, setLabels] = useState<ProtonLabel[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLabels().then((rows) => {
      if (!cancelled) setLabels(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const label =
    labels?.find((l) => l.slug.toLowerCase() === slug.toLowerCase()) ?? null;

  if (labels !== null && !label) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-6">
        <Link
          href="/labels"
          className="text-sm font-medium w-fit"
          style={{ color: "var(--color-accent)" }}
        >
          ← Labels
        </Link>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Label not found.
        </p>
      </div>
    );
  }

  if (labels === null || !label) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-8">
      <Link
        href="/labels"
        className="text-sm font-medium w-fit"
        style={{ color: "var(--color-accent)" }}
      >
        ← Labels
      </Link>

      <div
        className="rounded-lg border px-4 py-3 text-sm"
        style={{
          background: "rgba(243, 156, 18, 0.12)",
          borderColor: "rgba(243, 156, 18, 0.35)",
          color: "var(--color-text-primary)",
        }}
      >
        <span className="font-semibold">Prototype — </span>
        {LABEL_DEMO_CATALOG_NOTICE}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div
          className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
          style={{
            background: "rgba(26,188,156,0.12)",
            border: "1px solid rgba(26,188,156,0.2)",
          }}
        >
          {label.image?.url ? (
            <Image
              src={label.image.url}
              alt={label.name}
              width={80}
              height={80}
              className="object-contain"
            />
          ) : (
            <span
              className="text-2xl font-bold"
              style={{ color: "#1ABC9C", fontFamily: "var(--font-display)" }}
            >
              {label.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h1
            className="text-2xl md:text-3xl font-bold italic"
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
          >
            {label.name}
          </h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {label.artistCount !== undefined && (
              <span>{label.artistCount} artists</span>
            )}
            {label.genres && label.genres.length > 0 && (
              <span>{label.genres.join(" · ")}</span>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2
          className="text-sm font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Catalog (sample)
        </h2>
        <div
          className="flex items-center gap-3 px-3 pb-2 mb-1"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <span className="flex-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
            Track
          </span>
          <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-widest w-[140px]" style={{ color: "var(--color-text-secondary)" }}>
            Release
          </span>
          <span className="hidden md:block text-[11px] font-semibold uppercase tracking-widest w-28" style={{ color: "var(--color-text-secondary)" }}>
            Date
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest w-10 text-right" style={{ color: "var(--color-text-secondary)" }}>
            Time
          </span>
        </div>
        <ul className="flex flex-col">
          {DEMO_LABEL_TRACKS.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 px-3 py-3 text-sm border-b last:border-b-0"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                  {t.title}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
                  {t.artistName}
                </p>
              </div>
              <span
                className="hidden sm:block w-[140px] text-xs truncate"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t.releaseName}
              </span>
              <span className="hidden md:block w-28 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {t.releaseDate}
              </span>
              <span className="w-10 text-xs text-right tabular-nums" style={{ color: "var(--color-text-secondary)" }}>
                {t.duration}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
