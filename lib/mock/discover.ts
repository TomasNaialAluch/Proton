import type { Track } from "@/types/track";
import type { FeedbackProducer } from "@/types/feedback";

export interface DiscoverTrack extends Track {
  producer: FeedbackProducer;
  label: string;
  /** When the producer opened this track to feedback — drives the "Newest" sort. Not `releaseDate`. */
  openedForFeedbackAt: string;
  /** How much feedback it already has — drives the "Most feedback" sort (data-driven stand-in for "featured"). */
  feedbackCount: number;
}

/**
 * Beatport-style genre taxonomy. Intentionally broad (~30) — niche electronic
 * producers expect this level of granularity, not 5 generic buckets. Most of
 * these won't have a matching mock track; the filter still lists them so the
 * UI demonstrates the real scale.
 */
export const BEATPORT_GENRES = [
  "140 / Deep Dubstep / Grime",
  "Afro House",
  "Amapiano",
  "Bass / Club",
  "Bassline / UK Garage",
  "Brazilian Funk",
  "Breaks / Breakbeat / UK Bass",
  "Dance / Pop",
  "Deep House",
  "DJ Tools",
  "Downtempo",
  "Drum & Bass",
  "Dubstep",
  "Electro (Classic / Detroit / Modern)",
  "Electronica",
  "Funky House",
  "Hard Dance / Hardcore",
  "Hard Techno",
  "House",
  "Indie Dance",
  "Jackin House",
  "Mainstage",
  "Melodic House & Techno",
  "Minimal / Deep Tech",
  "Nu Disco / Disco",
  "Organic House",
  "Progressive House",
  "Psy-Trance",
  "Tech House",
  "Techno (Peak Time / Driving)",
  "Techno (Raw / Deep / Hypnotic)",
  "Trance (Main Floor)",
  "Trap / Future Bass",
  "UK Garage",
] as const;

const PRODUCERS: { producer: FeedbackProducer; label: string; genres: string[] }[] = [
  { producer: { id: "lume", name: "Lume" }, label: "Outer Space", genres: ["Progressive House", "Melodic House & Techno"] },
  { producer: { id: "darko", name: "Darko" }, label: "Subterra Records", genres: ["Techno (Peak Time / Driving)", "Tech House", "Hard Techno"] },
  { producer: { id: "vesna", name: "Vesna" }, label: "Toxic Astronaut", genres: ["Melodic House & Techno", "Organic House"] },
  { producer: { id: "kaiser", name: "Kaiser" }, label: "Subterra Records", genres: ["Techno (Raw / Deep / Hypnotic)", "Minimal / Deep Tech"] },
  { producer: { id: "nadia-r", name: "Nadia R." }, label: "Deep Current", genres: ["Deep House", "Organic House"] },
  { producer: { id: "fenix", name: "Fenix" }, label: "Outer Space", genres: ["Progressive House", "Trance (Main Floor)"] },
  { producer: { id: "iris-moon", name: "Iris Moon" }, label: "Deep Current", genres: ["Afro House", "Amapiano"] },
  { producer: { id: "rook", name: "Rook" }, label: "Night Frequency", genres: ["Drum & Bass", "Breaks / Breakbeat / UK Bass"] },
];

const TITLE_ADJECTIVES = [
  "Static", "Concrete", "Low", "Afterglow", "Hollow", "Velvet", "Distant", "Sunken",
  "Faded", "Restless", "Inner", "Pale", "Drift", "Echo", "Wired", "Blurred",
];
const TITLE_NOUNS = [
  "Bloom", "Garden", "Orbit", "Signal", "Tide", "Static", "Horizon", "Pulse",
  "Mirage", "Current", "Fracture", "Shadow", "Spectrum", "Glass", "Voltage", "Drift",
];
const MIX_SUFFIXES = ["Original Mix", "Club Mix", "Dub Mix", "Extended Mix"];
const KEYS = ["A min", "C min", "D min", "E min", "F min", "G min", "F# min", "B min"];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildTrack(index: number): DiscoverTrack {
  const owner = PRODUCERS[index % PRODUCERS.length];
  const genre = owner.genres[index % owner.genres.length];
  const adjective = TITLE_ADJECTIVES[index % TITLE_ADJECTIVES.length];
  const noun = TITLE_NOUNS[(index * 7) % TITLE_NOUNS.length];
  const mix = MIX_SUFFIXES[index % MIX_SUFFIXES.length];
  const bpm = 118 + Math.floor(pseudoRandom(index + 1) * 18); // 118–136
  const key = KEYS[index % KEYS.length];

  const daysAgo = Math.floor(pseudoRandom(index + 101) * 30); // opened sometime in the last 30 days
  const openedForFeedbackAt = new Date(Date.now() - daysAgo * 86_400_000).toISOString();
  const feedbackCount = Math.floor(pseudoRandom(index + 211) * 40); // 0–39

  return {
    id: `disc-${index + 1}`,
    title: `${adjective} ${noun} (${mix})`,
    artistId: owner.producer.id,
    duration: 0,
    genre,
    releaseDate: "2026-06-01",
    status: "published",
    audioUrl: "",
    coverUrl: "",
    streams: 0,
    bpm,
    key,
    openForFeedback: true,
    producer: owner.producer,
    label: owner.label,
    openedForFeedbackAt,
    feedbackCount,
  };
}

/** ~60 open tracks — enough to make pagination matter, unlike a handful of hand-written entries. */
export const mockDiscoverTracks: DiscoverTrack[] = Array.from({ length: 60 }, (_, i) => buildTrack(i));

export function discoverGenres(): string[] {
  return [...BEATPORT_GENRES];
}

export function discoverLabels(): string[] {
  return Array.from(new Set(PRODUCERS.map((p) => p.label))).sort();
}
