import { fetchLatestMixes } from "@/lib/api/mixes";
import MixCard from "@/components/public/MixCard";
import GenreChip from "@/components/public/GenreChip";

const GENRES = [
  "All",
  "Breaks",
  "Downtempo",
  "Deep House",
  "Electro",
  "Electronica",
  "Progressive",
  "Tech House",
  "Techno",
];

interface ShowsPageProps {
  searchParams: Promise<{ genre?: string }>;
}

export default async function ShowsPage({ searchParams }: ShowsPageProps) {
  const { genre } = await searchParams;
  const activeGenre = genre ?? "all";

  const mixes = await fetchLatestMixes(48, activeGenre === "all" ? undefined : activeGenre);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold italic"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
        >
          Shows
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          Episodes from the Proton library, sorted by date.
        </p>
      </div>

      {/* Genre filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-none">
        {GENRES.map((g) => {
          const slug = g.toLowerCase().replace(/\s+/g, "-");
          const isActive = activeGenre === slug || (g === "All" && activeGenre === "all");
          return (
            <GenreChip
              key={g}
              label={g}
              active={isActive}
              href={g === "All" ? "/shows" : `/shows?genre=${slug}`}
            />
          );
        })}
      </div>

      {/* Grid */}
      {mixes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {mixes.map((mix) => (
            <MixCard key={mix.id} mix={mix} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            No shows found for this genre.
          </p>
          <GenreChip label="View all shows" href="/shows" />
        </div>
      )}

    </div>
  );
}
