"use client";

const SEGMENTS = Array.from({ length: 10 }, (_, i) => i + 1);

interface ScoreBarProps {
  label: string;
  value: number | undefined;
  /** Omit onChange to render a read-only bar (viewing feedback already given). */
  onChange?: (value: number) => void;
}

export default function ScoreBar({ label, value, onChange }: ScoreBarProps) {
  const readOnly = !onChange;
  const filled = value ?? 0;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm text-text-primary">{label}</span>
        <span className="text-xs font-semibold text-text-secondary tabular-nums">
          {value !== undefined ? `${value}/10` : "—"}
        </span>
      </div>
      <div
        role={readOnly ? undefined : "slider"}
        aria-label={readOnly ? undefined : label}
        aria-valuemin={readOnly ? undefined : 0}
        aria-valuemax={readOnly ? undefined : 10}
        aria-valuenow={readOnly ? undefined : value}
        tabIndex={readOnly ? undefined : 0}
        onKeyDown={
          readOnly
            ? undefined
            : (e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  onChange(Math.min(10, filled + 1));
                } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  onChange(Math.max(0, filled - 1));
                }
              }
        }
        className="flex gap-1"
      >
        {SEGMENTS.map((segment) => {
          const isFilled = segment <= filled;
          return readOnly ? (
            <span
              key={segment}
              className={`h-2.5 flex-1 rounded-sm ${isFilled ? "bg-accent" : "bg-[var(--color-border)]"}`}
            />
          ) : (
            <button
              key={segment}
              type="button"
              onClick={() => onChange(segment)}
              aria-label={`${label}: set ${segment}/10`}
              className={`h-2.5 flex-1 rounded-sm transition-colors cursor-pointer
                ${isFilled ? "bg-accent" : "bg-[var(--color-border)] hover:bg-accent/40"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
