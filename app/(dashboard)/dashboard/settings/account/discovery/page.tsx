import Link from "next/link";
import { SettingsHeader, SettingsSection, ToggleField } from "@/components/settings/SettingsShared";
import { mockAccount } from "@/lib/mock/account";
import { mockArtist } from "@/lib/mock/artist";

export default function DiscoveryModePage() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader
        title="Discovery Mode"
        subtitle="Manage your preferences for Spotify Discovery Mode"
      />

      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 space-y-3">

        <SettingsSection title="Artist Opt Ins">
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-full bg-surface border border-[var(--color-border)]
                flex items-center justify-center text-sm font-bold text-accent shrink-0">
                {mockArtist.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-text-primary">{mockArtist.name}</p>
                <p className="text-xs text-accent mt-0.5">
                  {mockAccount.discoveryMode.optedIn ? "OPTED IN" : "NOT OPTED IN"}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Tracks featuring this artist can be opted into Discovery Mode
                </p>
              </div>
            </div>
            <div className={`relative shrink-0 w-10 h-5 rounded-full ml-4 ${
              mockAccount.discoveryMode.optedIn ? "bg-accent" : "bg-text-secondary/25"
            }`}>
              <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-all ${
                mockAccount.discoveryMode.optedIn ? "left-5" : "left-0.5"
              }`} />
            </div>
          </div>
        </SettingsSection>

        <Link
          href="/dashboard/settings/account/notifications"
          className="block text-sm text-accent hover:opacity-80 transition-opacity px-1"
        >
          Manage Discovery Mode Notifications →
        </Link>

      </main>
    </div>
  );
}
