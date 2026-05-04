export interface ProtonMix {
  id: string;
  title: string;
  date: string;
  youtubeId: string;
  /** Stream HTTP(S) cuando la API lo exponga; si falta se usa demo en desarrollo. */
  audioUrl?: string;
  genre: string;
  duration?: string;
  artist: {
    id: string;
    name: string;
    image: { url: string } | null;
  };
}
