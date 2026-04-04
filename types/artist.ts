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
}
