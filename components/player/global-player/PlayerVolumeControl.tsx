"use client";

import PlayerVolumeDesktop from "./PlayerVolumeDesktop";

/**
 * Desktop-only. Mobile dropped its on-screen volume control (see
 * docs/analisis-platform-integracion.md-adjacent player fix note) — phones
 * already have hardware volume buttons, same convention Spotify/Apple Music
 * follow, and the freed slot in the mobile bar/fullscreen player now goes to
 * `StartMixButton` instead, which was previously hidden below `sm:`.
 * @see PlayerVolumeDesktop — hover expande slider en la misma fila; clic icono = mute
 */
export default function PlayerVolumeControl() {
  return <PlayerVolumeDesktop />;
}
