"use client";

import { createContext, useContext } from "react";
import type { ReactNode, RefObject } from "react";

export type PlayerAudioApi = {
  audioRef: RefObject<HTMLAudioElement | null>;
  currentTime: number;
  duration: number;
  seek: (seconds: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  muted: boolean;
  toggleMute: () => void;
  /** Solo modo YouTube: montar el iframe del API aquí (FAB / barra). */
  youtubeMountRef?: RefObject<HTMLDivElement | null>;
};

const PlayerAudioContext = createContext<PlayerAudioApi | null>(null);

export function usePlayerAudio(): PlayerAudioApi {
  const ctx = useContext(PlayerAudioContext);
  if (!ctx) {
    throw new Error("usePlayerAudio debe usarse dentro del reproductor global");
  }
  return ctx;
}

export function PlayerAudioProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: PlayerAudioApi;
}) {
  return (
    <PlayerAudioContext.Provider value={value}>{children}</PlayerAudioContext.Provider>
  );
}
