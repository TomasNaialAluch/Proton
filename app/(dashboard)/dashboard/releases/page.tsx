"use client";

import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ArtistScopeFilter from "@/components/dashboard/label-manager/ArtistScopeFilter";
import ScopeFilterChips from "@/components/dashboard/label-manager/ScopeFilterChips";
import LabelReleasesPipeline from "@/components/dashboard/label-manager/LabelReleasesPipeline";
import ProducerReleasesPlaceholder from "@/components/dashboard/producer/ProducerReleasesPlaceholder";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";

export default function ReleasesPage() {
  const view = usePrototypeViewStore((s) => s.view);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-4xl lg:px-10">
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Releases" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Releases</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Release pipeline and delivery checklist.
        </p>
      </header>

      {view === "label_manager" && (
        <section className="mb-4">
          <ArtistScopeFilter />
          <div className="mt-3">
            <ScopeFilterChips />
          </div>
        </section>
      )}

      {view !== "label_manager" ? <ProducerReleasesPlaceholder /> : <LabelReleasesPipeline />}
    </main>
  );
}
