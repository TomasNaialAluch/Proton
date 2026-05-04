"use client";

import type { ProtonMix } from "@/types/mix";
import { useIsMaxLg } from "@/lib/hooks/useMediaQuery";
import { usePlayerStore } from "@/lib/store/playerStore";
import { usePathname } from "next/navigation";
import { PlayerAudioProvider } from "./PlayerAudioContext";
import PlayerDashboardMobile from "./PlayerDashboardMobile";
import PlayerExpandedBar from "./PlayerExpandedBar";
import PlayerFab from "./PlayerFab";
import { usePlayerAudioEngine } from "./usePlayerAudioEngine";
import { useYouTubePlayerEngine } from "./useYouTubePlayerEngine";
import YouTubeChoiceModal from "./YouTubeChoiceModal";

function GlobalPlayerLoaded({ mix }: { mix: ProtonMix }) {
  const playbackSource = usePlayerStore((s) => s.playbackSource);
  const playerChrome = usePlayerStore((s) => s.playerChrome);
  const pathname = usePathname();
  const isMaxLg = useIsMaxLg();

  const isYoutube = playbackSource === "youtube";
  const audioEngine = usePlayerAudioEngine(mix, !isYoutube);
  const youtubeEngine = useYouTubePlayerEngine(mix, isYoutube);
  const engine = isYoutube ? youtubeEngine : audioEngine;

  const dashboardMobileUi = pathname.startsWith("/dashboard") && isMaxLg;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      {!isYoutube && (
        <audio ref={audioEngine.audioRef} preload="metadata" className="sr-only" />
      )}
      <PlayerAudioProvider value={engine}>
        {dashboardMobileUi ? (
          <PlayerDashboardMobile />
        ) : playerChrome === "expanded" ? (
          <PlayerExpandedBar />
        ) : (
          <PlayerFab />
        )}
      </PlayerAudioProvider>
    </>
  );
}

export default function GlobalPlayer() {
  const currentMix = usePlayerStore((s) => s.currentMix);
  const playbackSource = usePlayerStore((s) => s.playbackSource);
  const playerChrome = usePlayerStore((s) => s.playerChrome);
  const pathname = usePathname();
  const isMaxLg = useIsMaxLg();
  const dashboardMobileUi = pathname.startsWith("/dashboard") && isMaxLg;

  const surfaceKey = dashboardMobileUi
    ? "dm"
    : playerChrome === "minimized"
      ? "fab"
      : "bar";

  return (
    <>
      <YouTubeChoiceModal />
      {currentMix ? (
        <GlobalPlayerLoaded
          key={`${currentMix.id}-${playbackSource ?? "none"}-${surfaceKey}`}
          mix={currentMix}
        />
      ) : null}
    </>
  );
}
