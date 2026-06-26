import type { ConnectionSuggestion } from "@/types/connection";

/**
 * Two seeded suggestions demonstrate both branches of the flow:
 * conn-1 → the other side hasn't answered yet (accepting shows a "waiting" state).
 * conn-2 → the other side already said yes (accepting matches instantly and opens chat).
 */
export const mockConnectionSuggestions: ConnectionSuggestion[] = [
  {
    id: "conn-1",
    peer: {
      id: "vesna",
      name: "Vesna",
      label: "Toxic Astronaut",
      genres: ["Melodic House & Techno", "Organic House"],
    },
    reason: {
      type: "similar",
      sharedGenres: ["Melodic House & Techno"],
      highlights: [
        "Both of you score consistently high on Synth design across the tracks you've feedbacked",
        "Both lean melodic — strong Main melody / hook scores",
      ],
    },
    status: "pending",
    createdAt: "2026-06-20T09:00:00Z",
    peerAlreadyAccepted: false,
  },
  {
    id: "conn-2",
    peer: {
      id: "kaiser",
      name: "Kaiser",
      label: "Subterra Records",
      genres: ["Techno (Raw / Deep / Hypnotic)", "Minimal / Deep Tech"],
    },
    reason: {
      type: "complementary",
      sharedGenres: ["Minimal / Deep Tech"],
      highlights: [
        "You score strong on Arrangement / structure, Kaiser scores strong on Percussion — a complementary pair",
        "Both active in the deeper, hypnotic end of techno",
      ],
    },
    status: "pending",
    createdAt: "2026-06-17T14:30:00Z",
    peerAlreadyAccepted: true,
  },
];
