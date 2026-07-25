"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  Maximize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useIsMaxLg } from "@/lib/hooks/useMediaQuery";
import { startPlayback } from "@/lib/player/startPlayback";
import { usePlayerStore } from "@/lib/store/playerStore";
import LikeButton from "@/components/public/LikeButton";
import PlayerArtwork from "./PlayerArtwork";
import PlayerQueueButton from "./PlayerQueueButton";
import PlayerSeekBar from "./PlayerSeekBar";
import PlayerVolumeControl from "./PlayerVolumeControl";
import StartMixButton from "./StartMixButton";
import { useDashboardPlayerInsetClass } from "./useDashboardPlayerInsetClass";
import { usePlayerAudio } from "./PlayerAudioContext";
import { useFabYoutubeVideoSize } from "./useFabYoutubeVideoSize";
import { YoutubeResizeCorner } from "./YoutubeResizeCorner";
import PlayerYoutubeNotice from "./PlayerYoutubeNotice";

/**
 * Barra expandida + pantalla completa en un solo componente.
 *
 * El nodo `<div ref={youtubeMountRef}>` (donde vive el iframe del `YT.Player`) se
 * renderiza SIEMPRE en la misma posición del árbol (primer hijo del wrapper fijo,
 * nunca dentro de una rama condicional que se intercambie por otra) — solo cambia
 * su `style` entre el modo barra y pantalla completa. Así React nunca lo desmonta al
 * togglear `playerChrome`, y el vídeo ni se pone en negro ni reinicia (ver riesgo
 * documentado en docs/feature-player-likes-queue-radio.md §7 y §12).
 */
export default function PlayerExpandedBar() {
  const dashboardInset = useDashboardPlayerInsetClass();
  const pathname = usePathname();
  const showDashboardClose = pathname.startsWith("/dashboard");
  const { currentMix, isPlaying, toggle, playerChrome, setPlayerChrome, clearPlayer } =
    usePlayerStore();
  const audioApi = usePlayerAudio();
  const isFullscreen = playerChrome === "fullscreen";

  const skipToNext = () => {
    const next = usePlayerStore.getState().advanceQueue();
    if (next) startPlayback(next, { auto: true });
  };

  const isMobile = useIsMaxLg();
  const ytResize = useFabYoutubeVideoSize(
    Boolean(audioApi.youtubeMountRef) && !isMobile,
    "expanded"
  );

  /** Solo `left/top/width/height` en px — la misma técnica que el arrastre de la
   *  esquina (`useFabYoutubeVideoSize`), que ya se sabe que nunca pausa el vídeo.
   *  Evitar `transform`/`aspect-ratio`: fue lo que causaba la pausa al entrar a
   *  pantalla completa (ver nota debajo). */
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!currentMix) return null;

  const artist = currentMix.artist;
  const hasYoutube = Boolean(audioApi.youtubeMountRef);

  const expandedVideoStyle: React.CSSProperties = isMobile
    ? { left: 16, top: 10, width: 92, height: 52 }
    : { left: 16, top: 10, width: ytResize.videoWidth, height: ytResize.videoHeight };

  /** Header (botón cerrar) + footer (seek + título + transporte + iconos) reservados
   *  arriba/abajo del vídeo en pantalla completa. */
  const FS_HEADER_H = 56;
  const FS_FOOTER_H = 260;
  const availW = viewport.w > 0 ? viewport.w * 0.94 : 0;
  const availH = viewport.h > 0 ? Math.max(160, viewport.h - FS_HEADER_H - FS_FOOTER_H) : 0;
  let fsWidth = Math.min(availW, 1040);
  let fsHeight = Math.round((fsWidth * 9) / 16);
  if (fsHeight > availH && availH > 0) {
    fsHeight = availH;
    fsWidth = Math.round((fsHeight * 16) / 9);
  }
  const fullscreenVideoStyle: React.CSSProperties = {
    left: Math.round((viewport.w - fsWidth) / 2),
    top: FS_HEADER_H + Math.round((availH - fsHeight) / 2),
    width: fsWidth,
    height: fsHeight,
    /** Sombra bien pronunciada abajo del video, solo mientras suena: en pausa tapaba
     *  el foco hacia los botones de abajo. Siempre queda el mismo `boxShadow` (solo
     *  cambia el alfa) para que la clase `transition-shadow` pueda animarlo — pasar de
     *  `undefined` a un valor no anima, aparece de golpe. Solo pesa en modo claro
     *  (`--fullscreen-dim` es 0 en oscuro, ver globals.css). */
    boxShadow: `0 60px 90px -18px rgba(0,0,0,${isPlaying ? "var(--fullscreen-dim)" : "0"})`,
  };

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col"
          : `fixed bottom-0 right-0 z-50 flex flex-col transition-[left] duration-300 ease-in-out ${dashboardInset}`
      }
      style={{
        // No backdrop-filter: `position: fixed` + `backdrop-filter` fails to
        // paint (element present/hit-testable but invisible) on some Android
        // GPU drivers — a solid background is the reliable choice here.
        background: isFullscreen ? "var(--color-background)" : "var(--color-surface)",
        borderTop: isFullscreen ? undefined : "1px solid var(--color-border)",
      }}
    >
      {hasYoutube && (
        <div
          key="yt-video-slot"
          className="absolute z-10 overflow-hidden rounded-lg border border-[var(--color-border)] bg-black transition-shadow duration-500 ease-in-out [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full"
          style={isFullscreen ? fullscreenVideoStyle : expandedVideoStyle}
        >
          {/* La API de YouTube REEMPLAZA este div por el <iframe> (no lo envuelve), por
              eso las clases que fuerzan el tamaño del iframe van en el wrapper de arriba
              (el único elemento que sigue existiendo después del reemplazo). */}
          <div ref={audioApi.youtubeMountRef} className="absolute inset-0" />
          {!isFullscreen && !isMobile && (
            <YoutubeResizeCorner
              ringOffsetClassName="focus-visible:ring-offset-[var(--color-surface)]"
              onResizePointerDown={ytResize.onResizePointerDown}
              onResizePointerMove={ytResize.onResizePointerMove}
              onResizePointerUp={ytResize.onResizePointerUp}
              onResizePointerCancel={ytResize.onResizePointerCancel}
            />
          )}
        </div>
      )}

      {isFullscreen ? (
        <>
          <div className="flex justify-end px-4 pt-3">
            <button
              type="button"
              onClick={() => setPlayerChrome("expanded")}
              aria-label="Collapse full-screen player"
              className="rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-primary)]"
            >
              <ChevronDown size={22} />
            </button>
          </div>

          {/* Espacio reservado para el vídeo (posicionado `absolute` arriba) o el hero de artwork. */}
          {hasYoutube ? (
            <div className="flex-1" />
          ) : (
            <div className="flex flex-1 items-center justify-center overflow-hidden px-4">
              <div className="flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-xl bg-white/10">
                {artist.image?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={artist.image.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display text-6xl font-bold text-[var(--color-accent)]">
                    {artist.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-6 pb-8">
            <PlayerSeekBar />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-[var(--color-text-primary)]">
                  {currentMix.title}
                </p>
                <p className="truncate text-sm text-[var(--color-text-secondary)]">
                  {artist.name}
                  {currentMix.genre && ` · ${currentMix.genre}`}
                </p>
              </div>
              <LikeButton mixId={currentMix.id} className="size-9 shrink-0 rounded-full" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="w-28 shrink-0" aria-hidden />
              <div className="flex flex-1 items-center justify-center gap-4">
                <button
                  type="button"
                  className="p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  aria-label="Previous"
                >
                  <SkipBack size={22} />
                </button>
                <button
                  type="button"
                  onClick={toggle}
                  className="flex size-14 items-center justify-center rounded-full transition-colors"
                  style={{ background: "var(--color-accent)" }}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={24} className="text-white" />
                  ) : (
                    <Play size={24} className="text-white" fill="white" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={skipToNext}
                  className="p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  aria-label="Next"
                >
                  <SkipForward size={22} />
                </button>
              </div>
              <div className="flex w-28 shrink-0 origin-right scale-125 items-center justify-end gap-3">
                <StartMixButton
                  mix={currentMix}
                  className="rounded-lg p-2 transition-colors hover:bg-white/5"
                />
                <PlayerQueueButton />
                <PlayerVolumeControl />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <PlayerYoutubeNotice />
          <PlayerSeekBar />

          {/* Dos mitades iguales + transporte centrado en el ancho total */}
          <div className="relative flex min-h-14 w-full items-center px-4 py-2.5">
            {(() => {
              const infoContent = (
                <>
                  {hasYoutube ? (
                    /* Espaciador invisible: el vídeo real está posicionado `absolute` arriba,
                       esto solo reserva el hueco para que el título no quede tapado. */
                    <div
                      aria-hidden
                      className="shrink-0"
                      style={{
                        width: expandedVideoStyle.width,
                        height: expandedVideoStyle.height,
                      }}
                    />
                  ) : (
                    <PlayerArtwork mix={currentMix} size="md" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight text-[var(--color-text-primary)]">
                      {currentMix.title}
                    </p>
                    <p className="truncate text-xs leading-tight text-[var(--color-text-secondary)]">
                      {artist.name}
                      {currentMix.genre && ` · ${currentMix.genre}`}
                    </p>
                  </div>
                </>
              );
              const infoClassName =
                "flex min-w-0 flex-1 items-center gap-3 pr-2 max-md:pr-[4rem] md:pr-24";
              /* Mobile-only: tapping the info block opens the fullscreen "Now
               * Playing" screen directly — same convention as Spotify/Apple
               * Music/YouTube Music's mini players. Desktop already has the
               * dedicated Maximize2 icon further down, so this stays a
               * plain (non-interactive) block there instead of doubling up. */
              return isMobile ? (
                <button
                  type="button"
                  onClick={() => setPlayerChrome("fullscreen")}
                  aria-label="Open full-screen player"
                  className={`${infoClassName} text-left`}
                >
                  {infoContent}
                </button>
              ) : (
                <div className={infoClassName}>{infoContent}</div>
              );
            })()}

            <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                className="p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                aria-label="Previous"
              >
                <SkipBack size={18} />
              </button>

              <button
                type="button"
                onClick={toggle}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                style={{ background: "var(--color-accent)" }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={16} className="text-white" />
                ) : (
                  <Play size={16} className="text-white" fill="white" />
                )}
              </button>

              <button
                type="button"
                onClick={skipToNext}
                className="p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                aria-label="Next"
              >
                <SkipForward size={18} />
              </button>
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-2 pl-2 max-md:pl-[4rem] md:pl-24">
              <button
                type="button"
                onClick={() => setPlayerChrome("fullscreen")}
                aria-label="Expand to full screen"
                className="hidden shrink-0 rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-primary)] sm:flex"
              >
                <Maximize2 size={18} />
              </button>
              <StartMixButton
                mix={currentMix}
                className="flex shrink-0 rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-primary)]"
              />
              <PlayerQueueButton />
              <PlayerVolumeControl />
              <button
                type="button"
                onClick={() => setPlayerChrome("minimized")}
                className="shrink-0 rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-primary)]"
                aria-label="Minimize player"
              >
                <ChevronDown size={20} />
              </button>
              {showDashboardClose && (
                <button
                  type="button"
                  onClick={() => clearPlayer()}
                  className="shrink-0 rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-primary)]"
                  aria-label="Close player"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
