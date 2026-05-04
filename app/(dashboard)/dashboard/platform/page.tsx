import type { Metadata } from "next";
import { Suspense } from "react";
import PlatformHubClient from "@/components/dashboard/platform/PlatformHubClient";

export const metadata: Metadata = {
  title: "Platform — Proton",
  description:
    "SoundSystem-style overview: Shows, Labels, DJ Mixes, and Account (prototype copy).",
};

export default function PlatformHubPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-16 text-center text-sm text-text-secondary">
          Loading…
        </div>
      }
    >
      <PlatformHubClient />
    </Suspense>
  );
}
