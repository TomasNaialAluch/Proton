import { SettingsHeader, SettingsSection, Field, ToggleField } from "@/components/settings/SettingsShared";
import { mockAccount } from "@/lib/mock/account";
import { mockArtist } from "@/lib/mock/artist";

export default function NotificationsPage() {
  const n = mockAccount.notifications;

  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader title="Notifications" subtitle="Configure your email notification settings" />

      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 space-y-3">

        <SettingsSection title="General">
          <ToggleField
            label="Proton Newsletter"
            hint="Periodic news & updates from the Proton team."
            enabled={n.newsletter}
          />
        </SettingsSection>

        <SettingsSection title="Promo Pool">
          <Field
            label="Promo Pool Email"
            value={`${n.promoPoolEmail} (Pro Email)`}
            hint="Set a custom email address to receive promo pool notifications."
          />
          <ToggleField
            label="Label Invites"
            hint="Receive instant or aggregated digests of promo label invites."
            enabled={n.labelInvites}
          />
          <ToggleField
            label="New Promos"
            hint="Receive instant or aggregated digests of all new promos."
            enabled={n.newPromos}
          />
        </SettingsSection>

        <SettingsSection title="Discovery Mode">
          <ToggleField
            label="Discovery Mode Invites"
            hint="Receive invites from artists and labels to join Discovery Mode."
            enabled={n.discoveryModeInvites}
          />
          <ToggleField
            label="Discovery Mode Monthly Report"
            hint="Receive monthly reports on eligible and enabled tracks."
            enabled={n.discoveryModeReport}
          />
        </SettingsSection>

        <SettingsSection title="Artist Release Links">
          <div className="px-4 py-3 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Artist</p>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Notify me?</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-text-primary">{mockArtist.name}</p>
              <span className="text-accent text-sm">✓</span>
            </div>
            <Field label="Sent to" value={n.releaseLinksEmail} />
          </div>
        </SettingsSection>

      </main>
    </div>
  );
}
