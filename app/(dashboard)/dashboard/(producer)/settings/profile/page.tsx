import { Camera, ChevronLeft, ChevronRight, Mic2, Radio, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { mockArtist } from "@/lib/mock/artist";
import DemoSignOutButton from "@/components/dashboard/DemoSignOutButton";

const connections = [
  { platform: "Spotify",     username: "Naial",  verified: true,  color: "#1DB954" },
  { platform: "Apple Music", username: "Naial",  verified: false, color: "#FC3C44" },
  { platform: "SoundCloud",  username: "Naial",  verified: true,  color: "#FF5500" },
];

export default function ProfileSettingsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-4
        border-b border-[var(--color-border)] bg-background/80 backdrop-blur-md">
        <Link
          href="/dashboard"
          className="size-8 rounded-full flex items-center justify-center
            bg-[var(--color-border)] hover:opacity-80 transition-opacity"
        >
          <ChevronLeft size={16} className="text-text-primary" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-text-primary">Artist Profile</h1>
          <p className="text-xs text-text-secondary">Public — visible to listeners</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pb-24 lg:pb-10 space-y-3 pt-6">

        {/* ── Avatar ── */}
        <section className="flex flex-col items-center gap-3 pb-2">
          <button className="relative group">
            <div
              className="size-24 rounded-full p-[2px]"
              style={{
                background: "linear-gradient(135deg, var(--color-accent) 0%, transparent 100%)",
              }}
            >
              <div className="size-full rounded-full bg-surface flex items-center justify-center">
                <span className="font-display font-bold text-3xl text-accent">
                  {mockArtist.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="absolute inset-[2px] rounded-full bg-black/50 flex items-center justify-center
              opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </button>
          <p className="text-xs text-text-secondary">Tap to change photo</p>
        </section>

        {/* ── Identity ── */}
        <Section title="Identity" icon={<Mic2 size={14} />}>
          <Field label="Artist name" value={mockArtist.name} />
          <Field label="Genres" value={mockArtist.genres.join(", ")} />
          <Field label="Bio" value="No bio yet" placeholder />
        </Section>

        {/* ── Radio Shows ── */}
        <Section title="Radio Shows" icon={<Radio size={14} />}>
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-text-secondary italic">
              No radio shows managed yet.
            </p>
          </div>
        </Section>

        {/* ── Connections ── */}
        <Section title="Links & Connections" icon={<LinkIcon size={14} />}>
          {connections.map(({ platform, username, verified, color }) => (
            <button
              key={platform}
              className="w-full flex items-center gap-3 px-4 py-3
                border-t border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors"
            >
              {/* Platform dot */}
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm text-text-primary">{platform}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {username}
                  {verified && (
                    <span className="ml-1.5 text-accent">· Verified</span>
                  )}
                </p>
              </div>
              <ChevronRight size={14} className="text-text-secondary shrink-0" />
            </button>
          ))}
        </Section>

        <p className="pt-4 text-center text-[11px] text-text-secondary">
          Prototype session only — not connected to a real account.
        </p>
        <DemoSignOutButton />
      </main>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <span className="text-text-secondary">{icon}</span>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  placeholder = false,
}: {
  label: string;
  value: string;
  placeholder?: boolean;
}) {
  return (
    <button className="w-full flex items-center justify-between px-4 py-3
      border-t border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors text-left">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className={`text-sm mt-0.5 truncate ${
          placeholder ? "text-text-secondary italic" : "text-text-primary"
        }`}>
          {value}
        </p>
      </div>
      <ChevronRight size={14} className="text-text-secondary shrink-0 ml-2" />
    </button>
  );
}
