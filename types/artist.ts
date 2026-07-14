export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatarUrl: string;
  country: string;
  genres: string[];
  socialLinks: {
    instagram?: string;
    soundcloud?: string;
    spotify?: string;
  };
  /** Opt-in — whether this artist accepts unsolicited collab requests from other producers. */
  openToCollab?: boolean;
  /** Opt-in — whether this artist allows remix requests on their tracks. */
  openToRemix?: boolean;
}
