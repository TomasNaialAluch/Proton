"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchLatestMixes } from "@/lib/api/mixes";
import type { ProtonMix } from "@/types/mix";
import MixCard from "@/components/public/MixCard";
import MixCardSkeleton from "@/components/public/MixCardSkeleton";
import NowPlayingHero from "@/components/public/NowPlayingHero";
import GenreGrid from "@/components/public/GenreGrid";
import Skeleton from "@/components/ui/Skeleton";

export default function HomeView() {
  const [mixes, setMixes] = useState<ProtonMix[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLatestMixes(12).then((rows) => {
      if (!cancelled) setMixes(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const nowPlaying = mixes?.[0];

  return (
    <div>
      {mixes === null ? (
        <>
          <div className="relative w-full min-h-[60vh] md:min-h-[70vh]">
            <Skeleton className="absolute inset-0 rounded-none" />
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col gap-14">
            <section>
              <div className="flex items-center justify-between mb-5">
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <MixCardSkeleton key={i} />
                ))}
              </div>
            </section>
          </div>
        </>
      ) : (
        <>
          {nowPlaying && <NowPlayingHero mix={nowPlaying} />}

          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col gap-14">
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Latest Shows
                </h2>
                <Link
                  href="/shows"
                  className="text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--color-accent)" }}
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {mixes.slice(0, 8).map((mix) => (
                  <MixCard key={mix.id} mix={mix} />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-2">
                <h2
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Explore On Demand
                </h2>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                  Stream any mix in the Proton library
                </p>
              </div>
              <div className="mt-4">
                <GenreGrid />
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
