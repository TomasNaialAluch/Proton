import Image from "next/image";
import Link from "next/link";
import type { ProtonLabel } from "@/types/label";

interface LabelCardProps {
  label: ProtonLabel;
  href?: string;
}

export default function LabelCard({ label, href }: LabelCardProps) {
  const inner = (
    <div
      className={`flex flex-col items-center gap-3 p-5 rounded-xl border text-center transition-colors group ${
        href ? "cursor-pointer hover:opacity-95" : "cursor-default"
      }`}
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Logo / placeholder */}
      <div
        className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
        style={{ background: "rgba(26,188,156,0.12)", border: "1px solid rgba(26,188,156,0.2)" }}
      >
        {label.image?.url ? (
          <Image
            src={label.image.url}
            alt={label.name}
            width={64}
            height={64}
            className="object-contain"
          />
        ) : (
          <span
            className="text-lg font-bold"
            style={{ color: "#1ABC9C", fontFamily: "var(--font-display)" }}
          >
            {label.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <div className="flex flex-col gap-0.5">
        <p
          className="text-sm font-semibold leading-tight line-clamp-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          {label.name}
        </p>
        {label.artistCount !== undefined && (
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {label.artistCount} artists
          </p>
        )}
      </div>

      {/* Genres */}
      {label.genres && label.genres.length > 0 && (
        <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
          {label.genres.slice(0, 2).join(" · ")}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-xl">
        {inner}
      </Link>
    );
  }

  return inner;
}
