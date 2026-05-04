"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { ProtonMix } from "@/types/mix";
import { FALLBACK_AUDIO_STREAM_URL } from "@/lib/player/demoAudioUrl";
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

function inactiveAudioApi(
  audioRef: RefObject<HTMLAudioElement | null>
): PlayerAudioApi {
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

/**
 * @param active — si es `false`, el motor no toca el `<audio>` (p. ej. reproducción vía YouTube).
 */
export function usePlayerAudioEngine(
  mix: ProtonMix,
  active: boolean = true
): PlayerAudioApi {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const pause = usePlayerStore((s) => s.pause);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);

  const src = mix.audioUrl ?? FALLBACK_AUDIO_STREAM_URL;

  useEffect(() => {
    if (!active) return;
    setVolumeState(readStoredVolume());
  }, [active]);

  const setVolume = useCallback((v: number) => {
    if (!active) return;
    const clamped = Math.min(1, Math.max(0, v));
    if (clamped > 0) setMuted(false);
    setVolumeState(clamped);
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
    } catch {
      /* ignore */
    }
    const el = audioRef.current;
    if (el) el.volume = clamped;
  }, [active]);

  const toggleMute = useCallback(() => {
    if (!active) return;
    setMuted((m) => !m);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
  }, [active, volume]);

  useEffect(() => {
    if (!active) return;
    const el = audioRef.current;
    if (!el) return;
    el.muted = muted;
  }, [active, muted]);

  useEffect(() => {
    if (!active) return;
    const el = audioRef.current;
    if (!el) return;

    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onLoadedMeta = () => {
      const d = el.duration;
      setDuration(Number.isFinite(d) ? d : 0);
    };
    const onEnded = () => pause();

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("loadedmetadata", onLoadedMeta);
    el.addEventListener("durationchange", onLoadedMeta);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("loadedmetadata", onLoadedMeta);
      el.removeEventListener("durationchange", onLoadedMeta);
      el.removeEventListener("ended", onEnded);
    };
  }, [active, pause]);

  useEffect(() => {
    if (!active) return;
    const el = audioRef.current;
    if (!el) return;
    el.src = src;
    el.load();
    setCurrentTime(0);
    setDuration(0);
  }, [active, mix.id, src]);

  useEffect(() => {
    if (!active) return;
    const el = audioRef.current;
    if (!el) return;

    const tryPlayback = async () => {
      try {
        if (isPlaying) await el.play();
        else el.pause();
      } catch {
        pause();
      }
    };

    void tryPlayback();
  }, [active, isPlaying, pause]);

  useEffect(() => {
    if (!active) return;
    const el = audioRef.current;
    if (!el) return;

    const onCanPlay = () => {
      if (!isPlaying) return;
      void el.play().catch(() => pause());
    };

    el.addEventListener("canplay", onCanPlay);
    return () => el.removeEventListener("canplay", onCanPlay);
  }, [active, mix.id, src, isPlaying, pause]);

  const seek = useCallback(
    (seconds: number) => {
      if (!active) return;
      const el = audioRef.current;
      if (!el) return;
      const d = Number.isFinite(el.duration) ? el.duration : duration;
      const max = Number.isFinite(d) && d > 0 ? d : seconds;
      const next = Math.min(Math.max(0, seconds), max);
      el.currentTime = next;
      setCurrentTime(next);
    },
    [active, duration]
  );

  const api: PlayerAudioApi = {
    audioRef,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    muted,
    toggleMute,
  };

  if (!active) {
    return inactiveAudioApi(audioRef);
  }

  return api;
}
