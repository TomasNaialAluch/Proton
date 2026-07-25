"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import GlobalPlayer from "@/components/player/GlobalPlayer";
import PreviewDockedBar from "@/components/player/preview/PreviewDockedBar";
import { usePlayerStore } from "@/lib/store/playerStore";
import { usePreviewStore } from "@/lib/store/previewStore";

/**
 * Arbitrates the ONE bottom-docked media slot between the preview bar and
 * the global player — they never show at once (see
 * docs/feature-preview-vs-global-player.md section 5). Mounted in
 * `app/layout.tsx` in place of the old direct `<GlobalPlayer />`, which
 * puts it above both the public site and SoundSystem — but preview is a
 * SoundSystem-only capability (short track samples, not a radio session),
 * so it has no business following the producer onto the public Proton
 * Radio pages.
 *
 * Leaving `/dashboard` with a preview still active closes it outright
 * (stops the audio, clears the bar) instead of just hiding it — a preview
 * lasts a minute or two, there's nothing worth resuming it *to* once
 * you've left SoundSystem. If it had paused a show to make room, that show
 * resumes automatically here: crossing out of SoundSystem entirely is a
 * stronger "I'm done previewing" signal than the docked bar's own ✕ (see
 * `ResumeShowModal`), so it doesn't need to ask — same outcome as picking
 * "Yes" there, just without the interruption.
 *
 * Both bars stay mounted at all times and cross-fade via opacity instead of
 * one unmounting the other — a hard swap read as a glitch, and unmounting
 * `GlobalPlayer` mid-preview would tear down its YouTube iframe every time,
 * forcing a full reinit on close. Each bar already guards itself (renders
 * nothing when it has no track/mix), so mounting both is safe even when
 * neither has anything to show.
 *
 * Opacity only, deliberately no `translate`/`transform` here: both bars are
 * `position: fixed` internally, and a `transform` on this wrapper would
 * create a new containing block, silently turning that `fixed` into
 * `absolute`-relative-to-this-div instead of the viewport (pins the bar to
 * wherever this div sits in the document instead of the screen).
 */
export default function PlayerSlot() {
  const pathname = usePathname();
  const inSoundSystem = pathname.startsWith("/dashboard");

  const hasActivePreview = usePreviewStore((s) => s.activePreviewTrack !== null);
  const pausedForPreview = usePreviewStore((s) => s.pausedForPreview);
  const closePreview = usePreviewStore((s) => s.closePreview);

  useEffect(() => {
    if (inSoundSystem || !hasActivePreview) return;
    if (pausedForPreview) usePlayerStore.getState().resume();
    closePreview();
  }, [inSoundSystem, hasActivePreview, pausedForPreview, closePreview]);

  const showPreview = inSoundSystem && hasActivePreview;

  return (
    <>
      <div
        aria-hidden={!showPreview}
        className={`transition-opacity duration-200 ease-in-out ${
          showPreview ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <PreviewDockedBar />
      </div>
      <div
        aria-hidden={showPreview}
        className={`transition-opacity duration-200 ease-in-out ${
          showPreview ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <GlobalPlayer />
      </div>
    </>
  );
}
