import type { ProtonTrack } from "@/lib/api/artist";

/** Props que `DashboardContent` pasa a cada widget del tablero. */
export interface DashboardWidgetProps {
  tracks: ProtonTrack[];
  isLoading: boolean;
  /** Top tracks por fecha de release (p. ej. últimos 5). */
  topTracks: ProtonTrack[];
}
