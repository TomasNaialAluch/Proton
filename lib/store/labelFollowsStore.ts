import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FollowedLabel {
  slug: string;
  /** When the producer started following — only news dated after this counts as "new". */
  since: string;
}

interface LabelFollowsState {
  following: FollowedLabel[];
  isFollowing: (slug: string) => boolean;
  toggleFollow: (slug: string) => void;
}

/** Seeded as already-followed, same convention as the rest of the mock data —
 *  the "past state" is pre-populated so the notification it drives is visible immediately. */
const SEED_FOLLOWS: FollowedLabel[] = [
  { slug: "sudbeat", since: "2026-06-01T00:00:00Z" },
  { slug: "addictive-music", since: "2026-06-15T00:00:00Z" },
];

export const useLabelFollowsStore = create<LabelFollowsState>()(
  persist(
    (set, get) => ({
      following: SEED_FOLLOWS,

      isFollowing: (slug) => get().following.some((f) => f.slug === slug),

      toggleFollow: (slug) =>
        set((state) => {
          const already = state.following.some((f) => f.slug === slug);
          return {
            following: already
              ? state.following.filter((f) => f.slug !== slug)
              : [...state.following, { slug, since: new Date().toISOString() }],
          };
        }),
    }),
    { name: "proton-label-follows" }
  )
);
