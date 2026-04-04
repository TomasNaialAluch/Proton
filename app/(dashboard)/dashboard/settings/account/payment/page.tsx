import { SettingsHeader, SettingsSection, Field, InfoBanner } from "@/components/settings/SettingsShared";
import { mockAccount } from "@/lib/mock/account";

export default function PaymentSettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader title="Payment Settings" subtitle="How would you like to receive your earnings?" />

      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 space-y-3">

        {/* Warning banner — manual vs automatic */}
        {!mockAccount.paymentIsAuto && (
          <InfoBanner variant="warning">
            <p className="font-semibold mb-1">⚠ Your payment method is NOT automatic.</p>
            When you receive your next royalty statement email, click the confirmation
            link inside to request payment.{" "}
            <span className="font-medium">For automatic payments, switch to PayPal.</span>
          </InfoBanner>
        )}

        {/* Current method */}
        <SettingsSection title="Payment Method">
          <Field label="Method"         value={mockAccount.paymentMethod} />
          <Field label="Token"          value={mockAccount.paymentToken} accent />
          <Field label="Wallet address" value={mockAccount.walletAddress} />
        </SettingsSection>

        {/* Options */}
        <SettingsSection title="Available Methods">
          <div className="px-4 py-3 border-t border-[var(--color-border)] flex gap-3">
            <button className="flex-1 py-2.5 rounded-xl bg-accent text-background
              text-sm font-medium hover:opacity-90 transition-opacity">
              Crypto (current)
            </button>
            <button className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)]
              text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)] transition-colors">
              Switch to PayPal
            </button>
          </div>
        </SettingsSection>

        {/* Info */}
        <InfoBanner variant="info">
          Statements and payments are issued when your balance reaches{" "}
          <span className="font-semibold text-text-primary">$100 USD</span>.
          Quarters run every 3 months (Jan–Mar / Apr–Jun / Jul–Sep / Oct–Dec).
        </InfoBanner>

      </main>
    </div>
  );
}
