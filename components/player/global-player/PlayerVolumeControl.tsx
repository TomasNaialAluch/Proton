"use client";

import PlayerVolumeDesktop from "./PlayerVolumeDesktop";
import PlayerVolumeMobile from "./PlayerVolumeMobile";

/**
 * Dos implementaciones según viewport: no comparten estado de UI para evitar conflictos.
 * @see PlayerVolumeMobile — tap y panel encima de la barra
 * @see PlayerVolumeDesktop — hover expande slider en la misma fila; clic icono = mute
 */
export default function PlayerVolumeControl() {
  return (
    <>
      <PlayerVolumeMobile />
      <PlayerVolumeDesktop />
    </>
  );
}
