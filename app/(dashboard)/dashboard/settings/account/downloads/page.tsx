import { SettingsHeader, SettingsSection, Field, ToggleField } from "@/components/settings/SettingsShared";
import { mockAccount } from "@/lib/mock/account";

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader title="Downloads" subtitle="Manage your preferences for downloading music" />

      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 space-y-3">
        <SettingsSection title="Downloads">
          <ToggleField
            label="Automatic Downloads"
            hint="Auto-download music you rate above the specified score."
            enabled={mockAccount.autoDownload}
          />
          <Field
            label="Preferred Download Format"
            value={mockAccount.downloadFormat}
            hint="Choose your preferred file format for track downloads."
          />
          <Field
            label="Download Location"
            value={mockAccount.downloadLocation}
            hint="Save manual and auto downloads to your computer or cloud account."
          />
        </SettingsSection>
      </main>
    </div>
  );
}
