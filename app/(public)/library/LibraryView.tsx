"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ListMusic, X } from "lucide-react";
import { fetchMixById } from "@/lib/api/mixes";
import { getLikedMixIds } from "@/lib/player/likes";
import { usePlayerStore } from "@/lib/store/playerStore";
import { usePublicDemoSession } from "@/lib/hooks/usePublicDemoSession";
import type { ProtonMix } from "@/types/mix";
import MixCard from "@/components/public/MixCard";
import MixCardSkeleton from "@/components/public/MixCardSkeleton";
import PlayerArtwork from "@/components/player/global-player/PlayerArtwork";

export default function LibraryView() {
  const signedIn = usePublicDemoSession();
  const queue = usePlayerStore((s) => s.queue);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const setQueue = usePlayerStore((s) => s.setQueue);

  const [likedMixes, setLikedMixes] = useState<ProtonMix[] | null>(null);

  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    const ids = getLikedMixIds();
    if (ids.length === 0) {
      setLikedMixes([]);
      return;
    }
    Promise.all(ids.map((id) => fetchMixById(id))).then((results) => {
      if (cancelled) return;
      setLikedMixes(results.filter((m): m is ProtonMix => m !== null));
    });
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  if (!signedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 flex flex-col items-center gap-3 text-center">
        <h1
          className="text-2xl font-bold italic"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
        >
          Your library
        </h1>
        <p className="text-sm max-w-sm" style={{ color: "var(--color-text-secondary)" }}>
          Sign in to see the mixes you&apos;ve liked and your current queue.
        </p>
        <Link
          href="/login?next=%2Flibrary"
          className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-accent transition-opacity hover:opacity-90"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-12">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold italic"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
        >
          Your library
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          Everything you&apos;ve liked and what&apos;s queued up next.
        </p>
        <p className="text-xs mt-2 max-w-md" style={{ color: "var(--color-text-secondary)" }}>
          Prototype only: this is where your full Proton Radio profile would eventually live —
          history, playlists, account details. For now, only Likes and Queue are wired up.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
          <Heart size={18} className="text-accent" />
          My Likes
        </h2>
        {likedMixes === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <MixCardSkeleton key={i} />
            ))}
          </div>
        ) : likedMixes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {likedMixes.map((mix) => (
              <MixCard key={mix.id} mix={mix} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)]">
            No likes yet — tap the heart on any mix to save it here.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
            <ListMusic size={18} className="text-accent" />
            Queue{queue.length > 0 ? ` (${queue.length})` : ""}
          </h2>
          {queue.length > 0 && (
            <button
              type="button"
              onClick={() => setQueue([])}
              className="text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              Clear
            </button>
          )}
        </div>
        {queue.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">Nothing queued yet.</p>
        ) : (
          <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
            {queue.map((mix) => (
              <div
                key={mix.id}
                className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-2.5 last:border-b-0"
                style={{ background: "var(--color-surface)" }}
              >
                <PlayerArtwork mix={mix} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                    {mix.title}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-secondary)]">
                    {mix.artist.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromQueue(mix.id)}
                  aria-label={`Remove ${mix.title} from queue`}
                  className="shrink-0 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
