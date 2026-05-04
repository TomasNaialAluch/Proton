"use client";

import { useEffect } from "react";

/** Falsos positivos al inspeccionar el DOM con Cursor: serializa props internas de Next (`params` / `searchParams` como Promise). */
const SYNC_DYNAMIC_APIS = "sync-dynamic-apis";

function stringifyArgs(args: unknown[]): string {
  return args
    .map((a) => {
      if (typeof a === "string") return a;
      if (a instanceof Error) return `${a.message}\n${a.stack ?? ""}`;
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    })
    .join(" ");
}

function isNextSyncDynamicApisNoise(args: unknown[]): boolean {
  return stringifyArgs(args).includes(SYNC_DYNAMIC_APIS);
}

export default function DevInspectorNoiseFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const origError = console.error;
    const origWarn = console.warn;

    console.error = (...args: unknown[]) => {
      if (isNextSyncDynamicApisNoise(args)) return;
      Reflect.apply(origError, console, args);
    };
    console.warn = (...args: unknown[]) => {
      if (isNextSyncDynamicApisNoise(args)) return;
      Reflect.apply(origWarn, console, args);
    };

    return () => {
      console.error = origError;
      console.warn = origWarn;
    };
  }, []);

  return null;
}
