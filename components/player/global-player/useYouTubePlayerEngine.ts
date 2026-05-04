"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { RefObject } from "react";
import type { ProtonMix } from "@/types/mix";
import {
  loadYoutubeIframeApi,
  type YtPlayerLite,
} from "@/lib/player/loadYoutubeIframeApi";
import {
  readYoutubeVideoQualityPreference,
  writeYoutubeVideoQualityPreference,
} from "@/lib/player/youtubeQualityPreference";
import { sortYoutubeQualityIds } from "@/lib/player/youtubeQualityLabels";
import { usePlayerStore } from "@/lib/store/playerStore";
import type { PlayerAudioApi } from "./PlayerAudioContext";

const VOLUME_STORAGE_KEY = "proton-player-volume";

function readStoredVolume(): number {
  if (typeof window === "undefined") return 1;
  const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
  const v = raw === null ? 1 : parseFloat(raw);
  if (Number.isFinite(v) && v >= 0 && v <= 1) return v;
  return 1;
}

function inactiveYoutubeApi(): PlayerAudioApi {
  const audioRef = { current: null } as RefObject<HTMLAudioElement | null>;
  return {
    audioRef,
    currentTime: 0,
    duration: 0,
    seek: () => {},
    volume: 1,
    setVolume: () => {},
    muted: false,
    toggleMute: () => {},
  };
}

/** Motor YouTube IFrame API; debe usarse solo cuando `playbackSource === 'youtube'`. */
export function useYouTubePlayerEngine(
  mix: ProtonMix,
  active: boolean
): PlayerAudioApi {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayerLite | null>(null);

  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [actualQualityId, setActualQualityId] = useState("unknown");
  const [availableQualityIds, setAvailableQualityIds] = useState<string[]>([]);
  const [preferredQualityId, setPreferredQualityState] = useState("");

  useEffect(() => {
    setVolumeState(readStoredVolume());
    setPreferredQualityState(readYoutubeVideoQualityPreference());
  }, []);

  const applyQualityPreferenceToPlayer = useCallback(
    (p: YtPlayerLite, pref: string) => {
      try {
        if (!pref.trim()) {
          p.setPlaybackQualityRange("small", "highres");
          return;
        }
        p.setPlaybackQualityRange(pref, pref);
      } catch {
        /* ignore */
      }
    },
    []
  );

  const setPreferredQualityId = useCallback(
    (qualityId: string) => {
      const next = qualityId.trim();
      setPreferredQualityState(next);
      writeYoutubeVideoQualityPreference(next);
      const p = playerRef.current;
      if (!p) return;
      applyQualityPreferenceToPlayer(p, next);
    },
    [applyQualityPreferenceToPlayer]
  );

  useEffect(() => {
    if (!active || !mix.youtubeId?.trim()) return;

    let destroyed = false;
    const videoId = mix.youtubeId.trim();

    void loadYoutubeIframeApi().then(() => {
      if (destroyed || !mountRef.current) return;

      const w = window as unknown as {
        YT: {
          Player: new (
            el: HTMLElement,
            opts: Record<string, unknown>
          ) => unknown;
        };
      };

      new w.YT.Player(mountRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin:
            typeof window !== "undefined" ? window.location.origin : undefined,
        },
        events: {
          onReady: (e: { target: YtPlayerLite }) => {
            if (destroyed) return;
            const p = e.target;
            playerRef.current = p;
            try {
              const d = p.getDuration();
              setDuration(Number.isFinite(d) && d > 0 ? d : 0);
              const v0 = readStoredVolume();
              setVolumeState(v0);
              p.setVolume(v0 * 100);
              const pref = readYoutubeVideoQualityPreference();
              setPreferredQualityState(pref);
              if (pref.trim()) {
                applyQualityPreferenceToPlayer(p, pref);
              }
              try {
                setActualQualityId(p.getPlaybackQuality() ?? "unknown");
                setAvailableQualityIds(p.getAvailableQualityLevels() ?? []);
              } catch {
                /* ignore */
              }
              if (usePlayerStore.getState().isPlaying) {
                p.playVideo();
              } else {
                p.pauseVideo();
              }
            } catch {
              /* ignore */
            }
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === 0) usePlayerStore.getState().pause();
          },
        },
      });
    });

    return () => {
      destroyed = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      setCurrentTime(0);
      setDuration(0);
      setActualQualityId("unknown");
      setAvailableQualityIds([]);
    };
  }, [active, applyQualityPreferenceToPlayer, mix.id, mix.youtubeId]);

  useEffect(() => {
    if (!active) return;
    const p = playerRef.current;
    if (!p) return;
    try {
      if (isPlaying) p.playVideo();
      else p.pauseVideo();
    } catch {
      /* ignore */
    }
  }, [active, isPlaying]);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const t = p.getCurrentTime();
        if (Number.isFinite(t)) setCurrentTime(t);
        const d = p.getDuration();
        if (Number.isFinite(d) && d > 0) setDuration(d);
        const q = p.getPlaybackQuality();
        if (typeof q === "string" && q) setActualQualityId(q);
        const levels = p.getAvailableQualityLevels();
        if (Array.isArray(levels) && levels.length > 0) {
          setAvailableQualityIds((prev) => {
            if (
              prev.length === levels.length &&
              prev.every((x, i) => x === levels[i])
            ) {
              return prev;
            }
            return levels;
          });
        }
      } catch {
        /* ignore */
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const p = playerRef.current;
    if (!p) return;
    try {
      p.setVolume(volume * 100);
    } catch {
      /* ignore */
    }
  }, [active, volume]);

  useEffect(() => {
    if (!active) return;
    const p = playerRef.current;
    if (!p) return;
    try {
      if (muted) p.mute();
      else p.unMute();
    } catch {
      /* ignore */
    }
  }, [active, muted]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    if (clamped > 0) setMuted(false);
    setVolumeState(clamped);
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
    } catch {
      /* ignore */
    }
    try {
      playerRef.current?.setVolume(clamped * 100);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const seek = useCallback(
    (seconds: number) => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const d = Number.isFinite(p.getDuration()) ? p.getDuration() : duration;
        const max = d > 0 ? d : seconds;
        const next = Math.min(Math.max(0, seconds), max);
        p.seekTo(next, true);
        setCurrentTime(next);
      } catch {
        /* ignore */
      }
    },
    [duration]
  );

  const dummyAudioRef = useMemo(
    () => ({ current: null }) as RefObject<HTMLAudioElement | null>,
    []
  );

  const sortedAvailableIds = useMemo(
    () => sortYoutubeQualityIds(availableQualityIds),
    [availableQualityIds]
  );

  if (!active || !mix.youtubeId?.trim()) {
    return inactiveYoutubeApi();
  }

  return {
    audioRef: dummyAudioRef,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    muted,
    toggleMute,
    youtubeMountRef: mountRef,
    youtubeQualityControls: {
      preferredQualityId,
      setPreferredQualityId,
      actualQualityId,
      availableQualityIds: sortedAvailableIds,
    },
  };
}
