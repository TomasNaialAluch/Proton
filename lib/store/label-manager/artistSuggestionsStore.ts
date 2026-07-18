import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockArtistSuggestions } from "@/lib/mock/label-manager/artistSuggestions";
import type { LabelArtistSuggestion } from "@/types/labelArtistSuggestion";

interface ArtistSuggestionsState {
  suggestions: LabelArtistSuggestion[];
  dismissSuggestion: (id: string) => void;
  markContacted: (id: string, conversationId: string) => void;
}

export const useArtistSuggestionsStore = create<ArtistSuggestionsState>()(
  persist(
    (set) => ({
      suggestions: mockArtistSuggestions,

      dismissSuggestion: (id) =>
        set((state) => ({
          suggestions: state.suggestions.map((s) =>
            s.id === id ? { ...s, status: "dismissed" } : s
          ),
        })),

      markContacted: (id, conversationId) =>
        set((state) => ({
          suggestions: state.suggestions.map((s) =>
            s.id === id ? { ...s, status: "contacted", conversationId } : s
          ),
        })),
    }),
    { name: "proton-artist-suggestions" }
  )
);
