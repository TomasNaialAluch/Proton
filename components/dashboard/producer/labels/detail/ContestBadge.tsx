import { Trophy } from "lucide-react";

export default function ContestBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-amber-500/15 text-amber-500">
      <Trophy size={11} />
      {count > 1 ? `${count} active contests` : "Contest open"}
    </span>
  );
}
