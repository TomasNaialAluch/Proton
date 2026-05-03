/** Mock data for dashboard widgets described in docs/README-dashboard-widgets.md */

export const mockListenersStats = {
  total: 128_400,
  delta7d: "+4.2%",
  delta28d: "+11%",
  series7: [118_200, 119_400, 120_100, 121_800, 123_500, 125_900, 128_400],
};

export const mockTopTerritories = [
  { code: "AR", name: "Argentina", pct: 34 },
  { code: "MX", name: "Mexico", pct: 22 },
  { code: "ES", name: "Spain", pct: 14 },
  { code: "US", name: "United States", pct: 12 },
  { code: "CO", name: "Colombia", pct: 10 },
];

export const mockPlaySources = [
  { label: "Playlists", pct: 41, color: "bg-accent" },
  { label: "Artist profile", pct: 28, color: "bg-violet-500" },
  { label: "Search", pct: 18, color: "bg-sky-500" },
  { label: "Radio & discovery", pct: 13, color: "bg-emerald-500" },
];

export const mockRisingTracks = [
  { title: "Midnight Run", delta: "+62%" },
  { title: "Neon Static", delta: "+38%" },
  { title: "Low Orbit", delta: "+21%" },
];

export const mockUpcomingReleases = [
  { title: "Summer EP", type: "EP" as const, date: "2026-06-12", status: "In review" },
  { title: "Single — Glass Floor", type: "Single" as const, date: "2026-05-20", status: "Scheduled" },
  { title: "Remix pack", type: "Album" as const, date: "2026-07-01", status: "Draft" },
];

export const mockDistributionRows = [
  { name: "Summer EP", store: "All stores", state: "In review" as const },
  { name: "Glass Floor", store: "Spotify, Apple", state: "Live" as const },
  { name: "Old demos", store: "—", state: "Rejected" as const },
];

export const mockCatalogCodes = {
  isrc: "QM-XXX-24-00042",
  upc: "198765432101",
  releaseName: "Latest release",
};

export const mockRoyaltiesByStore = [
  { store: "Spotify", amount: 412.33 },
  { store: "Apple Music", amount: 198.12 },
  { store: "YouTube", amount: 87.4 },
  { store: "Others", amount: 54.2 },
];

export const mockPayoutHistory = [
  { id: "1", date: "2026-03-01", amount: 320.0, status: "Paid" as const },
  { id: "2", date: "2026-01-28", amount: 285.5, status: "Paid" as const },
  { id: "3", date: "2025-11-15", amount: 410.0, status: "Paid" as const },
];

export const mockPendingTasks = [
  { id: "t1", label: "Upload cover art — Summer EP", due: "May 8" },
  { id: "t2", label: "Confirm featured artist credits", due: "May 12" },
  { id: "t3", label: "Sign distribution addendum", due: "May 20" },
];

export const mockNotifications = [
  { id: "n1", kind: "payment" as const, text: "Statement #44 is ready for review.", time: "2h ago" },
  { id: "n2", kind: "strike" as const, text: "No issues — weekly scan completed.", time: "1d ago" },
  { id: "n3", kind: "approval" as const, text: "Glass Floor approved for streaming.", time: "3d ago" },
];

export const mockSmartLinks = [
  { label: "Pre-save — Glass Floor", clicks: 1840, ctr: "3.1%" },
  { label: "Bio link", clicks: 920, ctr: "5.4%" },
];

export const mockSocialOverview = [
  { platform: "Instagram", posts: 3, scheduled: 1 },
  { platform: "TikTok", posts: 5, scheduled: 0 },
];

export const mockAudioMetadata = [
  { track: "Midnight Run", lufs: "-13.8", issue: null as string | null },
  { track: "Neon Static", lufs: "-10.2", issue: "Louder than recommended" },
  { track: "Low Orbit", lufs: "-14.1", issue: "Missing genre" },
];
