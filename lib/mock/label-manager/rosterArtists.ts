import type { Artist } from "@/types/artist";

/** Minimal roster list for label-manager prototype filtering. */
export const mockRosterArtists: Artist[] = [
  {
    id: "naial",
    name: "Naial",
    slug: "naial",
    bio: "",
    avatarUrl: "",
    country: "Argentina",
    genres: ["Melodic House", "Progressive"],
    socialLinks: {},
  },
  {
    id: "gmj",
    name: "GMJ",
    slug: "gmj",
    bio: "",
    avatarUrl: "",
    country: "Australia",
    genres: ["Progressive", "Melodic House"],
    socialLinks: {},
  },
  {
    id: "matter",
    name: "Matter",
    slug: "matter",
    bio: "",
    avatarUrl: "",
    country: "UK",
    genres: ["Progressive", "Techno"],
    socialLinks: {},
  },
  {
    id: "emily",
    name: "Emily Underhill",
    slug: "emily-underhill",
    bio: "",
    avatarUrl: "",
    country: "USA",
    genres: ["Deep House", "Electronica"],
    socialLinks: {},
  },
];
