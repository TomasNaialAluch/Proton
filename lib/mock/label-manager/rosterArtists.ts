import type { Artist } from "@/types/artist";

/** Minimal roster list for label-manager prototype filtering. */
export const mockRosterArtists: Artist[] = [
  {
    id: "naial",
    name: "Naial",
    slug: "naial",
    bio: "Buenos Aires-rooted producer working across melodic house and progressive, with releases on Outer Space Oasis and Toxic Astronaut. Focused on long-form arrangements built for peak-time sets rather than quick club edits.",
    avatarUrl: "",
    country: "Argentina",
    genres: ["Melodic House", "Progressive"],
    socialLinks: {},
    openToCollab: true,
    openToRemix: true,
  },
  {
    id: "gmj",
    name: "GMJ",
    slug: "gmj",
    bio: "Melbourne producer blending progressive house with warmer, melodic textures. Regular collaborator, always looking for a second voice on a track rather than working solo.",
    avatarUrl: "",
    country: "Australia",
    genres: ["Progressive", "Melodic House"],
    socialLinks: {},
    openToCollab: true,
    openToRemix: false,
  },
  {
    id: "matter",
    name: "Matter",
    slug: "matter",
    bio: "UK-based producer working at the harder end of progressive and techno. Keeps a tight release schedule and a small, deliberate circle of collaborators.",
    avatarUrl: "",
    country: "UK",
    genres: ["Progressive", "Techno"],
    socialLinks: {},
    // Not open to either — proves the "request to collaborate" action is
    // conditional, not shown unconditionally like the old chip-expand UI.
    openToCollab: false,
    openToRemix: false,
  },
  {
    id: "emily",
    name: "Emily Underhill",
    slug: "emily-underhill",
    bio: "US producer moving between deep house and electronica, known for hardware-driven productions and hands-on live sets. Open to remixes and cross-genre collaborations.",
    avatarUrl: "",
    country: "USA",
    genres: ["Deep House", "Electronica"],
    socialLinks: {},
    openToCollab: true,
    openToRemix: true,
  },
];
