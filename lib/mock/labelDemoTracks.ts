/**
 * Lista compartida para el prototipo de ficha de label.
 * No refleja el catálogo real del sello hasta que exista query en la API.
 */

export type LabelDemoTrack = {
  id: string;
  title: string;
  artistName: string;
  releaseName: string;
  releaseDate: string;
  duration: string;
};

/** Texto corto para banner en UI (inglés, producto público). */
export const LABEL_DEMO_CATALOG_NOTICE =
  "Sample catalog: the same tracks are shown for every label in this prototype.";

export const DEMO_LABEL_TRACKS: LabelDemoTrack[] = [
  {
    id: "demo-1",
    title: "Midnight Run",
    artistName: "Naial",
    releaseName: "Spring Sampler 2026",
    releaseDate: "Apr 2, 2026",
    duration: "6:42",
  },
  {
    id: "demo-2",
    title: "Weightless",
    artistName: "Andy Green",
    releaseName: "Horizons EP",
    releaseDate: "Mar 18, 2026",
    duration: "7:12",
  },
  {
    id: "demo-3",
    title: "Fading Signal",
    artistName: "Henry Saiz",
    releaseName: "Signals LP",
    releaseDate: "Feb 10, 2026",
    duration: "8:00",
  },
  {
    id: "demo-4",
    title: "Open Horizons",
    artistName: "Hernán Cattáneo",
    releaseName: "South Series",
    releaseDate: "Jan 22, 2026",
    duration: "7:45",
  },
  {
    id: "demo-5",
    title: "Pulse of the Earth",
    artistName: "Guy J",
    releaseName: "Earth Tones",
    releaseDate: "Dec 5, 2025",
    duration: "9:10",
  },
];
