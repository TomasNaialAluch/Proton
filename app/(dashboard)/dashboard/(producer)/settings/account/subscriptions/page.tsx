import { SettingsHeader, SettingsSection, EmptyState } from "@/components/settings/SettingsShared";

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader title="Subscriptions" subtitle="Manage your plan" />

      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 space-y-3">
        <SettingsSection title="Current Plan">
          <EmptyState message="No active subscriptions." />
        </SettingsSection>
      </main>
    </div>
  );
}
