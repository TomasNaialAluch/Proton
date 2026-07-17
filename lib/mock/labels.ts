import type { ProtonLabel } from "@/types/label";

export const mockLabels: ProtonLabel[] = [
  {
    id: "1", name: "Proton Music", slug: "proton-music", image: null,
    artistCount: 48, genres: ["Progressive", "Deep House"],
    description: "The flagship Proton Radio imprint. Broad progressive and deep house catalog, open to both established and up-and-coming producers.",
    releaseCount: 420, lastReleaseDate: "2026-07-08", demoStatus: "open",
    demoGenres: ["Progressive", "Deep House"], featured: true, foundedYear: 2004,
    demoPolicy: {
      preferredFormat: "wav",
      estimatedResponseTime: "2–3 weeks",
      notes: "We listen to everything. No ghost-produced tracks — original work only.",
    },
  },
  {
    id: "2", name: "Sudbeat", slug: "sudbeat", image: null,
    artistCount: 32, genres: ["Progressive"],
    description: "Melodic, emotive progressive house with a strong focus on album-length storytelling. Known for long-term artist development.",
    releaseCount: 280, lastReleaseDate: "2026-07-01", demoStatus: "open",
    demoGenres: ["Progressive"], foundedYear: 2009,
    demoPolicy: {
      preferredFormat: "wav",
      estimatedResponseTime: "Responds to all within 4 weeks",
      notes: "Looking for album-length storytelling, not one-off club tracks.",
    },
    // demo-2 (Weightless, GMJ) and demo-3 (Fading Signal, Matter) — neither
    // artist has opted into remix requests yet (openToRemix: false in
    // lib/mock/label-manager/rosterArtists.ts), so both show "Awaiting
    // artist" until that changes. See docs/feature-contest-flow.md.
    activeContests: [
      {
        id: "contest-sudbeat-weightless",
        title: "Weightless — Remix Call",
        description: "Looking for a fresh take on \"Weightless\". Send us your version, and if it's good enough to release, we'll reach out.",
        trackId: "demo-2",
        deadline: "2026-08-01",
      },
      {
        id: "contest-sudbeat-fading-signal",
        title: "Fading Signal — Remix Call",
        description: "Open to remixes of \"Fading Signal\" — no restrictions on genre or approach.",
        trackId: "demo-3",
      },
    ],
  },
  {
    id: "3", name: "Bedrock", slug: "bedrock", image: null,
    artistCount: 27, genres: ["Progressive", "Techno"],
    description: "John Digweed's label. Deep, hypnotic progressive and techno for the peak-time floor. High bar for production quality.",
    releaseCount: 350, lastReleaseDate: "2026-05-15", demoStatus: "closed",
    featured: true, foundedYear: 1999,
    demoPolicy: {
      preferredFormat: "wav",
      notes: "Not accepting unsolicited demos right now — roster is set through 2026. Referrals only.",
    },
    // demo-4 (Open Horizons, Emily Underhill) — Emily has openToRemix: true,
    // so this is the one sample track where the full gate passes end to
    // end. See docs/feature-contest-flow.md.
    activeContests: [
      {
        id: "contest-bedrock-open-horizons",
        title: "Open Horizons — Remix Call",
        description: "Looking for a peak-time take on \"Open Horizons\". Send us your version, and if it's good enough to release, we'll reach out.",
        trackId: "demo-4",
        deadline: "2026-09-01",
        prize: "Possible official release on Bedrock",
      },
    ],
  },
  {
    id: "4", name: "Addictive Music", slug: "addictive-music", image: null,
    artistCount: 14, genres: ["Melodic House", "Progressive"],
    description: "Melodic house and progressive with a warm, festival-ready sound. Actively scouting new talent for compilation slots.",
    releaseCount: 85, lastReleaseDate: "2026-07-03", demoStatus: "open",
    demoGenres: ["Melodic House", "Progressive"], foundedYear: 2013,
  },
  {
    id: "5", name: "Outer Space Oasis", slug: "outer-space-oasis", image: null,
    artistCount: 8, genres: ["Progressive", "Electronica"],
    description: "Boutique progressive imprint with a cosmic, atmospheric identity. Small, curated roster — quality over volume.",
    releaseCount: 32, lastReleaseDate: "2026-04-20", demoStatus: "open",
    demoGenres: ["Progressive", "Electronica"], foundedYear: 2017,
  },
  {
    id: "6", name: "Toxic Astronaut", slug: "toxic-astronaut", image: null,
    artistCount: 6, genres: ["Melodic House", "Deep House"],
    description: "Independent melodic/deep house label built around a tight-knit group of artists. Hands-on A&R, direct communication.",
    releaseCount: 28, lastReleaseDate: "2026-06-10", demoStatus: "open",
    demoGenres: ["Melodic House", "Deep House"], foundedYear: 2016,
    // Own catalog track ("Living", id "2") — see docs/feature-contest-flow.md
    // for why a contest references a real trackId instead of free text.
    activeContests: [
      {
        id: "contest-toxic-living",
        title: "Living — Remix Call",
        description: "Looking for a fresh take on \"Living\". We're not running this as a ranked competition — send us your version, and if it's good enough to release, we'll reach out.",
        trackId: "2",
        deadline: "2026-08-15",
        prize: "Possible official release + label signing",
      },
    ],
  },
  {
    id: "7", name: "Hope Recordings", slug: "hope-recordings", image: null,
    artistCount: 22, genres: ["Progressive", "Deep House"],
    description: "Long-running progressive house institution. Consistent release schedule, strong DJ support network.",
    releaseCount: 190, lastReleaseDate: "2026-06-28", demoStatus: "unknown",
    foundedYear: 2005,
  },
  {
    id: "8", name: "Lost & Found", slug: "lost-and-found", image: null,
    artistCount: 19, genres: ["Progressive"],
    description: "Purist progressive house, rooted in the genre's classic sound. Prefers tracks with a strong groove over big drops.",
    releaseCount: 145, lastReleaseDate: "2026-05-20", demoStatus: "closed",
    foundedYear: 2008,
  },
  {
    id: "9", name: "Innervisions", slug: "innervisions", image: null,
    artistCount: 15, genres: ["Deep House", "Electronica"],
    description: "Dixon and Âme's label. Deep, organic house and electronica with an art-driven visual identity.",
    releaseCount: 120, lastReleaseDate: "2026-06-01", demoStatus: "closed",
    foundedYear: 2006,
  },
  {
    id: "10", name: "Natura Soundi", slug: "natura-soundi", image: null,
    artistCount: 11, genres: ["Progressive", "Ambient"],
    description: "Progressive and ambient-leaning electronic music. Focus on texture and atmosphere over dancefloor impact.",
    releaseCount: 55, lastReleaseDate: "2026-03-15", demoStatus: "open",
    demoGenres: ["Progressive", "Ambient"], foundedYear: 2015,
  },
  {
    id: "11", name: "Houndstooth", slug: "houndstooth", image: null,
    artistCount: 20, genres: ["Techno", "Electronica"],
    description: "Fabric's in-house label. Leftfield techno and electronica, often experimental in structure and sound design.",
    releaseCount: 110, lastReleaseDate: "2026-05-01", demoStatus: "unknown",
    foundedYear: 2012,
  },
  {
    id: "12", name: "Warp Records", slug: "warp", image: null,
    artistCount: 35, genres: ["Electronica", "IDM"],
    description: "Legendary electronica and IDM label. Extremely selective — prioritizes originality over genre convention.",
    releaseCount: 800, lastReleaseDate: "2026-07-05", demoStatus: "closed",
    featured: true, foundedYear: 1989,
  },
  {
    id: "13", name: "Hyperdub", slug: "hyperdub", image: null,
    artistCount: 18, genres: ["Electronica", "Dubstep"],
    description: "Bass-driven electronica and dubstep, born out of the UK underground. Home to genre-defining, boundary-pushing artists.",
    releaseCount: 175, lastReleaseDate: "2026-06-20", demoStatus: "unknown",
    foundedYear: 2004,
  },
  {
    id: "14", name: "Token", slug: "token", image: null,
    artistCount: 10, genres: ["Techno"],
    description: "Hard-edged, hypnotic techno for the club. Consistently dark, functional, DJ-tool-focused catalog.",
    releaseCount: 65, lastReleaseDate: "2026-05-10", demoStatus: "closed",
    foundedYear: 2011,
  },
  {
    id: "15", name: "Ghostly Int.", slug: "ghostly-international", image: null,
    artistCount: 24, genres: ["Electronica", "Ambient"],
    description: "Genre-spanning electronica and ambient imprint with strong design sensibility. Artist-first, long album cycles.",
    releaseCount: 220, lastReleaseDate: "2026-06-25", demoStatus: "unknown",
    foundedYear: 2000,
  },
  {
    id: "16", name: "Fabric", slug: "fabric", image: null,
    artistCount: 30, genres: ["Techno", "House"],
    description: "Techno and house tied to the London club of the same name. Floor-tested, DJ-friendly releases.",
    releaseCount: 300, lastReleaseDate: "2026-07-01", demoStatus: "closed",
    foundedYear: 1999,
  },
  {
    id: "17", name: "Steel City Dance", slug: "steel-city-dance", image: null,
    artistCount: 9, genres: ["Deep House"],
    description: "Small deep house label with a soulful, warm production style. Actively open to first-time signings.",
    releaseCount: 40, lastReleaseDate: "2026-04-30", demoStatus: "open",
    demoGenres: ["Deep House"], foundedYear: 2016,
  },
  {
    id: "18", name: "Ninja Tune", slug: "ninja-tune", image: null,
    artistCount: 40, genres: ["Electronica", "Hip-Hop"],
    description: "Independent label spanning electronica, hip-hop and everything adjacent. Known for backing distinctive artistic voices.",
    releaseCount: 600, lastReleaseDate: "2026-07-02", demoStatus: "closed",
    foundedYear: 1990,
  },
  {
    id: "19", name: "Dear Deer Music", slug: "dear-deer-music", image: null,
    artistCount: 12, genres: ["Melodic House", "Progressive"],
    description: "Kyiv-based melodic house and progressive label. Worldwide digital licensing deals, direct and artist-friendly.",
    releaseCount: 75, lastReleaseDate: "2026-07-04", demoStatus: "open",
    demoGenres: ["Melodic House", "Progressive"], foundedYear: 2013,
  },
];
