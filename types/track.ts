export interface Track {
  id: string;
  title: string;
  artistId: string;
  duration: number;
  genre: string;
  releaseDate: string;
  status: "draft" | "pending" | "published";
  audioUrl: string;
  coverUrl: string;
  streams: number;
}
