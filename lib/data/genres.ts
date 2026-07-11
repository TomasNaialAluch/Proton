export interface ProtonGenre {
  slug: string;
  label: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
  count: number;
}

export const PROTON_GENRES: ProtonGenre[] = [
  { slug: "progressive",   label: "Progressive",  bgFrom: "#111827", bgTo: "#0a0f1a", accent: "#4f7fff", count: 9 },
  { slug: "electronica",   label: "Electronica",  bgFrom: "#110820", bgTo: "#080410", accent: "#c060ff", count: 7 },
  { slug: "deep-house",    label: "Deep House",   bgFrom: "#1c1008", bgTo: "#0e0804", accent: "#e08020", count: 5 },
  { slug: "techno",        label: "Techno",       bgFrom: "#1a0808", bgTo: "#0d0404", accent: "#ff4f4f", count: 4 },
  { slug: "melodic-house", label: "Melodic House", bgFrom: "#051a1a", bgTo: "#020e0e", accent: "#1abc9c", count: 3 },
  { slug: "ambient",       label: "Ambient",      bgFrom: "#081820", bgTo: "#040c10", accent: "#50b0e0", count: 2 },
  { slug: "idm",           label: "IDM",          bgFrom: "#081808", bgTo: "#040c04", accent: "#60e070", count: 1 },
  { slug: "dubstep",       label: "Dubstep",      bgFrom: "#150a28", bgTo: "#0a0514", accent: "#9060ff", count: 1 },
  { slug: "house",         label: "House",        bgFrom: "#1c1200", bgTo: "#0e0900", accent: "#ffa020", count: 1 },
  { slug: "hip-hop",       label: "Hip-Hop",      bgFrom: "#181200", bgTo: "#0c0900", accent: "#ffd040", count: 1 },
];

export function genreBySlug(slug: string): ProtonGenre | undefined {
  return PROTON_GENRES.find((g) => g.slug === slug);
}
