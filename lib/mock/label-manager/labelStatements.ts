import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";

export type StatementPeriod = "2026 Q2" | "2026 Q1" | "2025 Q4";

export type LabelStatementLine = {
  artistId: string;
  artistName: string;
  releases: number;
  streams: number;
  grossUsd: number;
  netUsd: number;
  status: "pending" | "approved" | "paid";
};

export type LabelStatementRun = {
  period: StatementPeriod;
  dateRange: string;
  lines: LabelStatementLine[];
};

function seeded(n: number) {
  return (Math.sin(n) + 1) / 2;
}

function money(n: number) {
  return Math.round(n * 100) / 100;
}

export const mockLabelStatementRuns: LabelStatementRun[] = [
  {
    period: "2026 Q2",
    dateRange: "Apr 1 – Jun 30, 2026",
    lines: mockRosterArtists.map((a, i) => {
      const base = 1200 + i * 900;
      const streams = Math.round(base * (0.85 + seeded(i + 2) * 0.65));
      const gross = money(streams * (0.0032 + seeded(i + 8) * 0.0006));
      const net = money(gross * (0.75 + seeded(i + 11) * 0.15));
      return {
        artistId: a.id,
        artistName: a.name,
        releases: 1 + (i % 3),
        streams,
        grossUsd: gross,
        netUsd: net,
        status: "pending",
      };
    }),
  },
  {
    period: "2026 Q1",
    dateRange: "Jan 1 – Mar 31, 2026",
    lines: mockRosterArtists.map((a, i) => {
      const base = 980 + i * 760;
      const streams = Math.round(base * (0.82 + seeded(i + 4) * 0.7));
      const gross = money(streams * (0.003 + seeded(i + 9) * 0.0005));
      const net = money(gross * (0.72 + seeded(i + 13) * 0.18));
      return {
        artistId: a.id,
        artistName: a.name,
        releases: 1 + ((i + 1) % 3),
        streams,
        grossUsd: gross,
        netUsd: net,
        status: i % 4 === 0 ? "approved" : "paid",
      };
    }),
  },
  {
    period: "2025 Q4",
    dateRange: "Oct 1 – Dec 31, 2025",
    lines: mockRosterArtists.map((a, i) => {
      const base = 760 + i * 640;
      const streams = Math.round(base * (0.78 + seeded(i + 6) * 0.75));
      const gross = money(streams * (0.0029 + seeded(i + 10) * 0.0005));
      const net = money(gross * (0.7 + seeded(i + 15) * 0.2));
      return {
        artistId: a.id,
        artistName: a.name,
        releases: 1 + ((i + 2) % 3),
        streams,
        grossUsd: gross,
        netUsd: net,
        status: "paid",
      };
    }),
  },
];
