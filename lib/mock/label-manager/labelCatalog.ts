import type { ProtonLabel } from "@/types/label";

export type LabelReleaseStatus = "draft" | "qa" | "scheduled" | "delivered" | "live";
export type LabelIssueSeverity = "warn" | "blocker";

export type LabelIssue = {
  code: "missing_assets" | "metadata_error" | "missing_report";
  severity: LabelIssueSeverity;
  label: string;
};

export type LabelCatalogTrack = {
  id: string;
  title: string;
  artistId: string;
  isrc: string;
  durationSec: number;
  genre: string;
};

export type LabelCatalogRelease = {
  id: string;
  title: string;
  artistId: string;
  labelId: ProtonLabel["id"];
  upc: string;
  releaseDate: string; // YYYY-MM-DD
  status: LabelReleaseStatus;
  tracks: LabelCatalogTrack[];
  issues: LabelIssue[];
};

export const mockLabelCatalog: LabelCatalogRelease[] = [
  {
    id: "rel_001",
    title: "Emotional Damage EP",
    artistId: "naial",
    labelId: "1",
    upc: "505500000001",
    releaseDate: "2026-03-21",
    status: "live",
    tracks: [
      { id: "trk_001", title: "Emotional Damage", artistId: "naial", isrc: "QZ-AAA-26-00001", durationSec: 420, genre: "Progressive" },
      { id: "trk_002", title: "Tied Inside", artistId: "naial", isrc: "QZ-AAA-26-00002", durationSec: 392, genre: "Progressive" },
    ],
    issues: [],
  },
  {
    id: "rel_002",
    title: "Living (Single)",
    artistId: "naial",
    labelId: "2",
    upc: "505500000002",
    releaseDate: "2026-05-05",
    status: "delivered",
    tracks: [{ id: "trk_003", title: "Living", artistId: "naial", isrc: "QZ-AAA-26-00003", durationSec: 388, genre: "Melodic House" }],
    issues: [
      { code: "metadata_error", severity: "warn", label: "Writer splits don’t sum to 100%" },
    ],
  },
  {
    id: "rel_003",
    title: "Under Neon Skies",
    artistId: "gmj",
    labelId: "1",
    upc: "505500000003",
    releaseDate: "2026-06-14",
    status: "scheduled",
    tracks: [
      { id: "trk_004", title: "Under Neon Skies", artistId: "gmj", isrc: "QZ-AAA-26-00004", durationSec: 405, genre: "Progressive" },
      { id: "trk_005", title: "Afterglow (Dub)", artistId: "gmj", isrc: "QZ-AAA-26-00005", durationSec: 376, genre: "Progressive" },
    ],
    issues: [
      { code: "missing_assets", severity: "blocker", label: "Artwork not uploaded" },
    ],
  },
  {
    id: "rel_004",
    title: "Matter of Time",
    artistId: "matter",
    labelId: "3",
    upc: "505500000004",
    releaseDate: "2026-04-02",
    status: "live",
    tracks: [{ id: "trk_006", title: "Matter of Time", artistId: "matter", isrc: "QZ-AAA-26-00006", durationSec: 447, genre: "Techno" }],
    issues: [],
  },
  {
    id: "rel_005",
    title: "Glasshouse Sessions",
    artistId: "emily",
    labelId: "9",
    upc: "505500000005",
    releaseDate: "2026-07-09",
    status: "qa",
    tracks: [
      { id: "trk_007", title: "Glasshouse", artistId: "emily", isrc: "QZ-AAA-26-00007", durationSec: 361, genre: "Deep House" },
      { id: "trk_008", title: "Soft Focus", artistId: "emily", isrc: "QZ-AAA-26-00008", durationSec: 334, genre: "Electronica" },
    ],
    issues: [
      { code: "missing_assets", severity: "warn", label: "Master WAV pending" },
    ],
  },
];
