"use client";

import Image from "next/image";
import { notFound, usePathname } from "next/navigation";
import { Users } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import SubmitTrackForm from "@/components/dashboard/producer/labels/SubmitTrackForm";
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

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: label.name },
      ]} />

      <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-accent/10 border border-accent/20">
            {label.image?.url ? (
              <Image src={label.image.url} alt={label.name} width={56} height={56} className="object-contain" />
            ) : (
              <span className="text-lg font-bold text-accent">{label.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-text-primary">{label.name}</h1>
            {label.artistCount !== undefined && (
              <p className="flex items-center gap-1 text-xs text-text-secondary mt-0.5">
                <Users size={11} /> {label.artistCount} artists
              </p>
            )}
            {label.genres && label.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {label.genres.map((g) => (
                  <span key={g} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-border)] text-text-secondary">
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {label.description && (
          <p className="mt-4 text-sm text-text-secondary leading-relaxed">{label.description}</p>
        )}
      </div>

      <SubmitTrackForm
        labelSlug={label.slug}
        labelName={label.name}
        acceptedGenres={label.genres ?? []}
      />
    </main>
  );
}
