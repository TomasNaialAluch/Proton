export interface ChartEntry {
  position: number;
  track: {
    id: string;
    title: string;
    artist: { name: string };
    label: { name: string };
    release: { date: string };
    duration: string;
    artwork?: string;
  };
}

const makeChart = (genre: string): ChartEntry[] => {
  const data: Omit<ChartEntry, "position">[] = {
    progressive: [
      { track: { id: "p1",  title: "Midnight Drive",        artist: { name: "Naial" },            label: { name: "Addictive" },        release: { date: "2026-04-22" }, duration: "6:05" } },
      { track: { id: "p2",  title: "Weightless",            artist: { name: "Andy Green" },        label: { name: "Proton Music" },     release: { date: "2026-04-18" }, duration: "7:12" } },
      { track: { id: "p3",  title: "Fading Signal",         artist: { name: "Henry Saiz" },        label: { name: "Natura Soundi" },    release: { date: "2026-04-14" }, duration: "8:00" } },
      { track: { id: "p4",  title: "Open Horizons",         artist: { name: "Hernan Cattaneo" },   label: { name: "Sudbeat" },          release: { date: "2026-04-10" }, duration: "7:45" } },
      { track: { id: "p5",  title: "Pulse of the Earth",    artist: { name: "Guy J" },             label: { name: "Lost & Found" },     release: { date: "2026-04-08" }, duration: "9:10" } },
      { track: { id: "p6",  title: "Wandering Soul",        artist: { name: "Nick Warren" },       label: { name: "Hope Recordings" },  release: { date: "2026-04-05" }, duration: "7:30" } },
      { track: { id: "p7",  title: "Inner Light",           artist: { name: "Naial" },             label: { name: "Outer Space Oasis" }, release: { date: "2026-04-02" }, duration: "6:50" } },
      { track: { id: "p8",  title: "Stardust",              artist: { name: "Sasha" },             label: { name: "Last Night…" },      release: { date: "2026-03-28" }, duration: "8:22" } },
      { track: { id: "p9",  title: "Eclipse",               artist: { name: "John Digweed" },      label: { name: "Bedrock" },          release: { date: "2026-03-25" }, duration: "7:55" } },
      { track: { id: "p10", title: "Tidal Forces",          artist: { name: "Chaim" },             label: { name: "Proton Music" },     release: { date: "2026-03-20" }, duration: "6:40" } },
    ],
    "deep-house": [
      { track: { id: "d1",  title: "Soft Rain",             artist: { name: "Âme" },               label: { name: "Innervisions" },     release: { date: "2026-04-20" }, duration: "7:20" } },
      { track: { id: "d2",  title: "Blue Hours",            artist: { name: "Moodymann" },          label: { name: "KDJ" },              release: { date: "2026-04-15" }, duration: "6:55" } },
      { track: { id: "d3",  title: "Morning Ritual",        artist: { name: "Larry Heard" },        label: { name: "Alleviated" },       release: { date: "2026-04-10" }, duration: "8:30" } },
      { track: { id: "d4",  title: "Depth Charge",          artist: { name: "Kerri Chandler" },     label: { name: "Madhouse" },         release: { date: "2026-04-05" }, duration: "7:10" } },
      { track: { id: "d5",  title: "Solace",                artist: { name: "Recondite" },          label: { name: "Ghostly Int." },     release: { date: "2026-04-01" }, duration: "6:45" } },
      { track: { id: "d6",  title: "Driftwood",             artist: { name: "Mall Grab" },          label: { name: "Steel City" },       release: { date: "2026-03-28" }, duration: "5:50" } },
      { track: { id: "d7",  title: "Harbour Lights",        artist: { name: "Floating Points" },    label: { name: "Pluto" },            release: { date: "2026-03-24" }, duration: "8:05" } },
      { track: { id: "d8",  title: "Ocean Floor",           artist: { name: "Jayda G" },            label: { name: "Ninja Tune" },       release: { date: "2026-03-20" }, duration: "6:30" } },
      { track: { id: "d9",  title: "Sacred Space",          artist: { name: "DJ Stingray" },        label: { name: "Micron" },           release: { date: "2026-03-15" }, duration: "7:40" } },
      { track: { id: "d10", title: "Velvet Underground",    artist: { name: "Huerco S." },          label: { name: "West Mineral" },     release: { date: "2026-03-10" }, duration: "9:00" } },
    ],
    techno: [
      { track: { id: "t1",  title: "Iron Grid",             artist: { name: "Blawan" },             label: { name: "Ternesc" },          release: { date: "2026-04-22" }, duration: "7:00" } },
      { track: { id: "t2",  title: "Volt",                  artist: { name: "Paula Temple" },       label: { name: "Noise Manifesto" },  release: { date: "2026-04-18" }, duration: "6:15" } },
      { track: { id: "t3",  title: "Concrete Jungle",       artist: { name: "DVS1" },               label: { name: "Houndstooth" },      release: { date: "2026-04-12" }, duration: "8:45" } },
      { track: { id: "t4",  title: "Pressure Point",        artist: { name: "SPFDJ" },              label: { name: "Alignment" },        release: { date: "2026-04-08" }, duration: "7:30" } },
      { track: { id: "t5",  title: "Machine Ritual",        artist: { name: "Headless Horseman" },  label: { name: "HH Records" },       release: { date: "2026-04-03" }, duration: "9:20" } },
      { track: { id: "t6",  title: "Deadweight",            artist: { name: "Phase" },              label: { name: "Token" },            release: { date: "2026-03-30" }, duration: "8:10" } },
      { track: { id: "t7",  title: "Resistance",            artist: { name: "Oscar Mulero" },       label: { name: "Warm Up" },          release: { date: "2026-03-25" }, duration: "7:55" } },
      { track: { id: "t8",  title: "Foundry",               artist: { name: "Function" },           label: { name: "Infrastructure" },   release: { date: "2026-03-20" }, duration: "8:30" } },
      { track: { id: "t9",  title: "Collapse",              artist: { name: "Surgeon" },            label: { name: "Counterbalance" },   release: { date: "2026-03-15" }, duration: "6:50" } },
      { track: { id: "t10", title: "System Failure",        artist: { name: "Adam X" },             label: { name: "Sonic Groove" },     release: { date: "2026-03-10" }, duration: "7:20" } },
    ],
    electronica: [
      { track: { id: "e1",  title: "Signal Path",           artist: { name: "Autechre" },           label: { name: "Warp" },             release: { date: "2026-04-20" }, duration: "6:30" } },
      { track: { id: "e2",  title: "Neural",                artist: { name: "Burial" },             label: { name: "Hyperdub" },         release: { date: "2026-04-15" }, duration: "5:45" } },
      { track: { id: "e3",  title: "Glass City",            artist: { name: "Four Tet" },           label: { name: "Text" },             release: { date: "2026-04-10" }, duration: "7:00" } },
      { track: { id: "e4",  title: "Amber Light",           artist: { name: "Jon Hopkins" },        label: { name: "Domino" },           release: { date: "2026-04-05" }, duration: "6:15" } },
      { track: { id: "e5",  title: "Recursion",             artist: { name: "Aphex Twin" },         label: { name: "Warp" },             release: { date: "2026-04-01" }, duration: "8:40" } },
    ],
  }[genre] ?? [];

  return data.map((entry, i) => ({ ...entry, position: i + 1 }));
};

export const mockCharts: Record<string, ChartEntry[]> = {
  progressive: makeChart("progressive"),
  "deep-house": makeChart("deep-house"),
  techno: makeChart("techno"),
  electronica: makeChart("electronica"),
};
