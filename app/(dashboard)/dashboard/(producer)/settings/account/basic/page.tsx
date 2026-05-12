import { SettingsHeader, SettingsSection, Field } from "@/components/settings/SettingsShared";
import { mockAccount } from "@/lib/mock/account";

export default function BasicInfoPage() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader title="Basic Info" subtitle="Update your account info" />

      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 space-y-3">

        <SettingsSection title="General">
          <Field label="Username"  value={mockAccount.username} />
          <Field label="Password"  value={mockAccount.password} />
          <Field label="Full Name" value={mockAccount.fullName} />
        </SettingsSection>

        <SettingsSection title="Contact Info">
          <p className="px-4 pb-2 text-xs text-text-secondary leading-relaxed">
            For contracts, statements, payments, notifications, and more.
          </p>
          <Field label="Email"          value={mockAccount.email}    hint="Primary email linked to your account" />
          <Field label="PayPal Email"   value="Temporarily disabled" hint="Editing is temporarily disabled while we upgrade our system." disabled />
          <Field label="Pro Email"      value={mockAccount.proEmail} hint="Contracts, statements, payments, and more for your releases" />
          <Field label="Phone Number"   value={mockAccount.phone ?? "Not set"} placeholder={!mockAccount.phone} />
          <Field label="Mailing Address" value={mockAccount.mailingAddress} hint="For contracts & payments" />
          <Field label="Country"        value={mockAccount.country}  hint="Associated with your mailing address" />
        </SettingsSection>

        {/* Danger Zone */}
        <section className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Danger Zone
          </p>
          <button className="w-full flex items-start justify-between px-4 py-4
            border-t border-[var(--color-border)] text-left
            hover:bg-red-500/5 transition-colors">
            <div>
              <p className="text-sm font-medium text-red-400">Delete account</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Schedule your account to be permanently deleted after 14 days.
              </p>
            </div>
          </button>
        </section>

      </main>
    </div>
  );
}
