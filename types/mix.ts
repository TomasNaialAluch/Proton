export interface ProtonMix {
  id: string;
  title: string;
  date: string;
  youtubeId: string;
  genre: string;
  duration?: string;
  artist: {
    id: string;
    name: string;
    image: { url: string } | null;
  };
}
