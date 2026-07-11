"use client";

import { notFound, usePathname } from "next/navigation";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import SubmitTrackForm from "@/components/dashboard/producer/labels/SubmitTrackForm";
import LabelDetailHeader from "@/components/dashboard/producer/labels/detail/LabelDetailHeader";
import RecentReleasesStrip from "@/components/dashboard/producer/labels/detail/RecentReleasesStrip";
import ArtistRoster from "@/components/dashboard/producer/labels/detail/ArtistRoster";
import DemoPolicyCard from "@/components/dashboard/producer/labels/detail/DemoPolicyCard";
import RequestToConnectForm from "@/components/dashboard/producer/labels/detail/RequestToConnectForm";
import SimilarLabels from "@/components/dashboard/producer/labels/detail/SimilarLabels";
import { mockLabels } from "@/lib/mock/labels";

function slugFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/labels\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

export default function LabelProfileClient() {
  const pathname = usePathname();
  const slug = slugFromPath(pathname);
  const label = mockLabels.find((l) => l.slug === slug);

  if (!slug) notFound();
  if (!label) notFound();

  const canSubmitDemo = label.demoStatus === "open";

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10 flex flex-col gap-6">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: label.name },
      ]} />

      <LabelDetailHeader label={label} />

      <RecentReleasesStrip />

      <ArtistRoster />

      <DemoPolicyCard label={label} />

      {canSubmitDemo ? (
        <SubmitTrackForm
          labelSlug={label.slug}
          labelName={label.name}
          acceptedGenres={label.genres ?? []}
        />
      ) : (
        <RequestToConnectForm labelName={label.name} />
      )}

      <SimilarLabels label={label} />
    </main>
  );
}
