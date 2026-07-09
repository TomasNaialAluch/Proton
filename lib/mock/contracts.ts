import type { Contract } from "@/types/contract";

const NO_PLACEMENT = { page: 1, xPct: 0, yPct: 0, widthPct: 0, rotation: 0 };

export const mockContracts: Contract[] = [
  {
    id: "c7",
    release: "JIK / Never Leave",
    label: "Dear Deer Music",
    labelSlug: "dear-deer-music",
    signedAt: "2026-03-05",
    status: "pending_signature",
    documentUrl: "/contracts/dear-deer-licensing-agreement-naial-2026.pdf",
    keyDates: [
      { label: "Agreement date", date: "2026-03-05" },
      { label: "Release deadline (12 months from signing)", date: "2027-03-05" },
      { label: "Term ends", date: "2036-03-05" },
    ],
    signature: null,
    kind: "signable",
  },
  // Real, already-signed contracts from the Proton SoundSystem account — "record" kind,
  // no in-app PDF/signature, just a link out to the real contract page.
  {
    id: "r1",
    release: "Tied Inside",
    label: "Outer Space Oasis",
    labelSlug: "outer-space-oasis",
    signedAt: "2026-01-23",
    status: "signed",
    documentUrl: null,
    keyDates: [{ label: "Release date", date: "2026-03-06" }],
    signature: {
      signedByName: "Tomas Naial Aluch",
      signedAt: "2026-01-23",
      documentHash: "external",
      placement: NO_PLACEMENT,
    },
    kind: "record",
    realContractUrl: "https://soundsystem.protonradio.com/contracts/proton_contract_v7.php?cid=951070&p=dadd4115e8f558a8544b7b848c555701",
  },
  {
    id: "r2",
    release: "Mind Altered",
    label: "Outer Space Oasis",
    labelSlug: "outer-space-oasis",
    signedAt: "2025-01-01",
    status: "signed",
    documentUrl: null,
    keyDates: [{ label: "Release date", date: "2025-03-28" }],
    signature: {
      signedByName: "Tomas Naial Aluch",
      signedAt: "2025-01-01",
      documentHash: "external",
      placement: NO_PLACEMENT,
    },
    kind: "record",
    realContractUrl: "https://soundsystem.protonradio.com/contracts/proton_contract_v7.php?cid=797449&p=c617f159f3d73aac62dd2f0a00ab6ea0",
  },
  {
    id: "r3",
    release: "Balance",
    label: "Outer Space Oasis",
    labelSlug: "outer-space-oasis",
    signedAt: "2024-06-04",
    status: "signed",
    documentUrl: null,
    keyDates: [],
    signature: {
      signedByName: "Tomas Naial Aluch",
      signedAt: "2024-06-04",
      documentHash: "external",
      placement: NO_PLACEMENT,
    },
    kind: "record",
    realContractUrl: "https://soundsystem.protonradio.com/contracts/proton_contract_v7.php?cid=717531&p=3a21c9d96e6f13f785757bcc3c9e4c38",
  },
  {
    id: "r4",
    release: "Beyond Living",
    label: "Toxic Astronaut",
    labelSlug: "toxic-astronaut",
    signedAt: "2023-08-19",
    status: "signed",
    documentUrl: null,
    keyDates: [],
    signature: {
      signedByName: "Tomas Naial Aluch",
      signedAt: "2023-08-19",
      documentHash: "external",
      placement: NO_PLACEMENT,
    },
    kind: "record",
    realContractUrl: "https://soundsystem.protonradio.com/contracts/proton_contract_v7.php?cid=624386&p=082e18675fde0b70f53946b98b659576",
  },
];

export const CONTRACT_LABEL_COLORS: Record<string, string> = {
  "dear-deer-music":   "#EC4899",
  "outer-space-oasis": "#A78BFA",
  "toxic-astronaut":   "#34D399",
};
