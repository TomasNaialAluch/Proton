import Link from "next/link";
import { fetchLatestMixes } from "@/lib/api/mixes";
import MixCard from "@/components/public/MixCard";
import NowPlayingHero from "@/components/public/NowPlayingHero";
import GenreGrid from "@/components/public/GenreGrid";

export default async function HomePage() {
  const mixes = await fetchLatestMixes(12);
  const nowPlaying = mixes[0]; // mock: el mix más reciente como "live"

  return (
    <div>
      {/* Hero — Now Playing */}
      {nowPlaying && <NowPlayingHero mix={nowPlaying} />}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col gap-14">

        {/* Latest Shows */}
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

        {/* Explore by Genre */}
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
    </div>
  );
}
