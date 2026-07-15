import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Artist } from "@/types/artist";

type SocialPlatform = keyof Artist["socialLinks"];

interface ArtistProfileState {
  /** The current producer's own editable social links — set in
   *  Settings > Artist Profile, rendered on their own Artist Detail page.
   *  See docs/feature-artist-detail.md. */
  socialLinks: Artist["socialLinks"];
  setSocialLink: (platform: SocialPlatform, value: string) => void;
}

export const useArtistProfileStore = create<ArtistProfileState>()(
  persist(
    (set) => ({
      socialLinks: {},
      setSocialLink: (platform, value) =>
        set((state) => ({
          socialLinks: { ...state.socialLinks, [platform]: value.trim() || undefined },
        })),
    }),
    { name: "proton-artist-profile" }
  )
);
