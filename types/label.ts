export interface ProtonLabel {
  id: string;
  name: string;
  slug: string;
  image: { url: string } | null;
  artistCount?: number;
  genres?: string[];
}
