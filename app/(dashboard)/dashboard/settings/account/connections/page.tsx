import { SettingsHeader, SettingsSection } from "@/components/settings/SettingsShared";
import { mockAccount } from "@/lib/mock/account";
import { Plus } from "lucide-react";

export default function ConnectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader
        title="Connections"
        subtitle="Manage external connections to your Proton account"
      />

      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 space-y-3">

        {/* Streaming platforms */}
        <SettingsSection title="Streaming Platforms">
          {mockAccount.connections.map(({ platform, username, connected, color, canAddMore }) => (
            <div
              key={platform}
              className="flex items-center gap-3 px-4 py-3 border-t border-[var(--color-border)]"
            >
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">{platform}</p>
                <p className="text-xs text-text-secondary mt-0.5">{username}</p>
              </div>
              {connected ? (
                <button className="text-xs text-red-400 hover:opacity-80 transition-opacity shrink-0">
                  Disconnect
                </button>
              ) : (
                <button className="text-xs text-accent hover:opacity-80 transition-opacity shrink-0">
                  Connect
                </button>
              )}
            </div>
          ))}

          {/* Add SoundCloud */}
          {mockAccount.connections.find((c) => c.platform === "SoundCloud")?.canAddMore && (
            <button className="w-full flex items-center gap-2 px-4 py-3
              border-t border-[var(--color-border)]
              text-xs text-accent hover:bg-[var(--color-border)] transition-colors">
              <Plus size={12} /> Add SoundCloud Account
            </button>
          )}
        </SettingsSection>

        {/* Cloud Storage */}
        <SettingsSection title="Cloud Storage for Promo Pool">
          {mockAccount.cloudStorage.map(({ service, connected }) => (
            <div
              key={service}
              className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]"
            >
              <p className="text-sm text-text-primary">{service}</p>
              <button className={`text-xs font-medium shrink-0 hover:opacity-80 transition-opacity ${
                connected ? "text-red-400" : "text-accent"
              }`}>
                {connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </SettingsSection>

      </main>
    </div>
  );
}
