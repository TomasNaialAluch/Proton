import Link from "next/link";
import { ChevronRight, FileText, DollarSign, Pencil } from "lucide-react";
import { SettingsHeader, SettingsSection, EmptyState } from "@/components/settings/SettingsShared";
import { mockArtist } from "@/lib/mock/artist";

export default function ProAccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader title="Pro Access" subtitle="Contracts, artists, labels & shows" />

      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 space-y-3">

        {/* Contracts & Reports — unified in the redesign */}
        <SettingsSection title="Contracts & Reports">
          <div className="px-4 py-3 border-t border-[var(--color-border)] flex gap-3">
            <Link
              href="/dashboard/contracts"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                bg-[var(--color-border)] hover:opacity-80 transition-opacity text-sm font-medium text-text-primary"
            >
              <FileText size={14} /> Contracts
            </Link>
            <Link
              href="/dashboard/royalties"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                bg-accent text-background hover:opacity-90 transition-opacity text-sm font-medium"
            >
              <DollarSign size={14} /> Royalties
            </Link>
          </div>
        </SettingsSection>

        {/* Artists */}
        <SettingsSection title="Artists">
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
            <p className="text-sm text-text-primary">{mockArtist.name}</p>
            <Link
              href="/dashboard/settings/profile"
              className="flex items-center gap-1 text-xs text-accent hover:opacity-80 transition-opacity"
            >
              <Pencil size={12} /> Edit
            </Link>
          </div>
        </SettingsSection>

        {/* Labels */}
        <SettingsSection title="Labels">
          <EmptyState message="You don't manage any labels on Proton." />
        </SettingsSection>

        {/* Shows */}
        <SettingsSection title="Shows">
          <EmptyState message="You don't manage any radio shows." />
          <div className="px-4 pb-4">
            <button className="w-full py-2.5 rounded-xl border border-[var(--color-border)]
              text-sm text-accent font-medium hover:bg-accent/5 transition-colors flex items-center justify-center gap-2">
              <ChevronRight size={14} /> Request access
            </button>
          </div>
        </SettingsSection>

      </main>
    </div>
  );
}
