"use client";

import { notFound, usePathname } from "next/navigation";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import BackButton from "@/components/dashboard/_shared/BackButton";
import SubmitTrackForm from "@/components/dashboard/producer/labels/SubmitTrackForm";
import LabelDetailHeader from "@/components/dashboard/producer/labels/detail/LabelDetailHeader";
import RecentReleasesStrip from "@/components/dashboard/producer/labels/detail/RecentReleasesStrip";
import ArtistRoster from "@/components/dashboard/producer/labels/detail/ArtistRoster";
import DemoPolicyCard from "@/components/dashboard/producer/labels/detail/DemoPolicyCard";
import ActiveContests from "@/components/dashboard/producer/labels/detail/ActiveContests";
import RemixOpportunities from "@/components/dashboard/producer/labels/detail/RemixOpportunities";
import RequestToConnectForm from "@/components/dashboard/producer/labels/detail/RequestToConnectForm";
import SimilarLabels from "@/components/dashboard/producer/labels/detail/SimilarLabels";
import { mockLabels } from "@/lib/mock/labels";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";

function slugFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/labels\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

export default function LabelProfileClient() {
  const pathname = usePathname();
  const slug = slugFromPath(pathname);
  const label = mockLabels.find((l) => l.slug === slug);
  // Submitting a demo / requesting to connect is a producer action — a
  // label manager (viewing their own label or someone else's) never
  // pitches a label. See docs/README-routing-architecture.md.
  const view = usePrototypeViewStore((s) => s.view);

  if (!slug) notFound();
  if (!label) notFound();

  const canSubmitDemo = label.demoStatus === "open";

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10 flex flex-col gap-6">
      <BackButton fallbackHref="/dashboard/labels" label="Back to Labels" />

      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: label.name },
      ]} />

      <LabelDetailHeader label={label} />

      <RecentReleasesStrip label={label} />

      <ArtistRoster label={label} />

      <ActiveContests label={label} />

      <RemixOpportunities label={label} />

      {/* Demo policy sits directly above the action it describes — reading
          what the label wants right before submitting/reaching out, instead
          of scattered further up the page. */}
      <div className="flex flex-col gap-4">
        <DemoPolicyCard label={label} />

        {view === "producer" && (
          canSubmitDemo ? (
            <SubmitTrackForm
              labelSlug={label.slug}
              labelName={label.name}
              acceptedGenres={label.genres ?? []}
            />
          ) : (
            <RequestToConnectForm label={label} />
          )
        )}
      </div>

      <SimilarLabels label={label} />
    </main>
  );
}
