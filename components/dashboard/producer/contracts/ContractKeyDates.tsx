import { CalendarDays } from "lucide-react";
import type { ContractKeyDate } from "@/types/contract";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Renders the contract's key dates (release, master delivery, exclusivity, etc). */
export default function ContractKeyDates({ dates }: { dates: ContractKeyDate[] }) {
  if (dates.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays size={14} className="text-text-secondary" />
        <h2 className="text-sm font-semibold text-text-primary">Key dates</h2>
      </div>
      <ul className="space-y-2.5">
        {dates.map(({ label, date }) => (
          <li key={label} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-text-secondary">{label}</span>
            <span className="font-medium text-text-primary">{formatDate(date)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
