import type { Contract } from "@/types/contract";

export const mockContracts: Contract[] = [
  {
    id: "c4",
    release: "Tied Inside",
    label: "Outer Space Oasis",
    labelSlug: "outer-space-oasis",
    signedAt: "2026-01-23",
    status: "signed",
    documentUrl: null,
  },
  {
    id: "c3",
    release: "Mind Altered",
    label: "Outer Space Oasis",
    labelSlug: "outer-space-oasis",
    signedAt: "2025-01-01",
    status: "signed",
    documentUrl: null,
  },
  {
    id: "c2",
    release: "Balance",
    label: "Outer Space Oasis",
    labelSlug: "outer-space-oasis",
    signedAt: "2024-06-04",
    status: "signed",
    documentUrl: null,
  },
  {
    id: "c1",
    release: "Beyond Living",
    label: "Toxic Astronaut",
    labelSlug: "toxic-astronaut",
    signedAt: "2023-08-19",
    status: "signed",
    documentUrl: null,
  },
];

export const CONTRACT_LABEL_COLORS: Record<string, string> = {
  "outer-space-oasis": "#A78BFA",
  "toxic-astronaut":   "#34D399",
};
