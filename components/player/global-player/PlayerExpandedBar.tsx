"use client";

import { ChevronDown, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useIsMaxLg } from "@/lib/hooks/useMediaQuery";
import { usePlayerStore } from "@/lib/store/playerStore";
import PlayerArtwork from "./PlayerArtwork";
import PlayerSeekBar from "./PlayerSeekBar";
import PlayerVolumeControl from "./PlayerVolumeControl";
import PlayerYouTubeQualityControl from "./PlayerYouTubeQualityControl";
import { useDashboardPlayerInsetClass } from "./useDashboardPlayerInsetClass";
import { usePlayerAudio } from "./PlayerAudioContext";
import { useFabYoutubeVideoSize } from "./useFabYoutubeVideoSize";
import { YoutubeResizeCorner } from "./YoutubeResizeCorner";

export default function PlayerExpandedBar() {
  const dashboardInset = useDashboardPlayerInsetClass();
  const pathname = usePathname();
  const showDashboardClose = pathname.startsWith("/dashboard");
  const { currentMix, isPlaying, toggle, setPlayerChrome, clearPlayer } =
    usePlayerStore();
  const audioApi = usePlayerAudio();

  const isMobile = useIsMaxLg();
  const ytResize = useFabYoutubeVideoSize(
    Boolean(audioApi.youtubeMountRef) && !isMobile,
    "expanded"
  );

  if (!currentMix) return null;

  const artist = currentMix.artist;

  return (
    <div
      className={`fixed bottom-0 right-0 z-50 flex flex-col transition-[left] duration-300 ease-in-out ${dashboardInset}`}
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <PlayerSeekBar />

      {/* Dos mitades iguales + transporte centrado en el ancho total */}
      <div className="relative flex min-h-14 w-full items-center px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-3 pr-2 max-md:pr-[4rem] md:pr-24">
          {audioApi.youtubeMountRef ? (
            <div
              className={`relative shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-black ${
                isMobile ? "h-[52px] w-[92px]" : ""
              }`}
              style={
                isMobile
                  ? undefined
                  : {
                      width: ytResize.videoWidth,
                      height: ytResize.videoHeight,
                    }
              }
            >
              <div
                ref={audioApi.youtubeMountRef}
                className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full"
              />
              {!isMobile && (
                <YoutubeResizeCorner
                  ringOffsetClassName="focus-visible:ring-offset-[var(--color-surface)]"
                  onResizePointerDown={ytResize.onResizePointerDown}
                  onResizePointerMove={ytResize.onResizePointerMove}
                  onResizePointerUp={ytResize.onResizePointerUp}
                  onResizePointerCancel={ytResize.onResizePointerCancel}
                />
              )}
            </div>
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
        </div>

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
            className="p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            aria-label="Next"
          >
            <SkipForward size={18} />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 pl-2 max-md:pl-[4rem] md:pl-24">
          <PlayerYouTubeQualityControl />
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
    </div>
  );
}
