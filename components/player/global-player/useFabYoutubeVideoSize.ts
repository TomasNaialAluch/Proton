"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEYS = {
  fab: "proton-fab-youtube-width",
  expanded: "proton-expanded-youtube-width",
} as const;

export const FAB_YT_MIN_W = 112;
export const FAB_YT_MAX_W = 360;
/** Barra expandida (desktop): un poco más de ancho máximo. */
export const EXPANDED_YT_MAX_W = 480;

const DEFAULT_W = 124;

function clampW(w: number, maxW: number): number {
  return Math.min(maxW, Math.max(FAB_YT_MIN_W, Math.round(w)));
}

function readStoredWidth(key: string, maxW: number): number {
  if (typeof window === "undefined") return DEFAULT_W;
  try {
    const n = parseInt(localStorage.getItem(key) ?? "", 10);
    if (Number.isFinite(n)) return clampW(n, maxW);
  } catch {
    /* ignore */
  }
  return DEFAULT_W;
}

function saveStoredWidth(key: string, w: number, maxW: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, String(clampW(w, maxW)));
  } catch {
    /* ignore */
  }
}

/** Altura 16:9 a partir del ancho del panel de vídeo. */
export function fabYoutubeHeight(width: number): number {
  return Math.round((width * 9) / 16);
}

export type YoutubeVideoPanel = keyof typeof STORAGE_KEYS;

/**
 * Panel de vídeo YouTube redimensionable (FAB o barra expandida).
 * Arrastre desde esquina superior izquierda: hacia arriba-izquierda agranda.
 */
export function useFabYoutubeVideoSize(
  enabled: boolean,
  panel: YoutubeVideoPanel = "fab"
) {
  const storageKey = STORAGE_KEYS[panel];
  const maxW = panel === "expanded" ? EXPANDED_YT_MAX_W : FAB_YT_MAX_W;

  const [width, setWidth] = useState(DEFAULT_W);
  const liveWidthRef = useRef(DEFAULT_W);
  const storageKeyRef = useRef(storageKey);
  const maxWRef = useRef(maxW);
  storageKeyRef.current = storageKey;
  maxWRef.current = maxW;

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startW: number;
  } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const w = readStoredWidth(storageKey, maxW);
    setWidth(w);
    liveWidthRef.current = w;
  }, [enabled, storageKey, maxW]);

  useEffect(() => {
    liveWidthRef.current = width;
  }, [width]);

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startW: liveWidthRef.current,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    []
  );

  const onResizePointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      const delta = -(dx + dy) / 2;
      const nw = clampW(d.startW + delta, maxWRef.current);
      liveWidthRef.current = nw;
      setWidth(nw);
    },
    []
  );

  const onResizePointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      dragRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      saveStoredWidth(
        storageKeyRef.current,
        liveWidthRef.current,
        maxWRef.current
      );
    },
    []
  );

  return {
    videoWidth: width,
    videoHeight: fabYoutubeHeight(width),
    onResizePointerDown,
    onResizePointerMove,
    onResizePointerUp,
    onResizePointerCancel: onResizePointerUp,
  };
}
