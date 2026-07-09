import { Send, Headphones, CheckCircle2, XCircle } from "lucide-react";
import type { SubmissionStatus } from "@/types/submission";

const CONFIG: Record<SubmissionStatus, { label: string; icon: typeof Send; classes: string }> = {
  sent:      { label: "Sent",      icon: Send,         classes: "bg-blue-500/10 text-blue-500" },
  listening: { label: "Listening", icon: Headphones,   classes: "bg-amber-500/10 text-amber-500" },
  accepted:  { label: "Accepted",  icon: CheckCircle2, classes: "bg-emerald-500/10 text-emerald-500" },
  passed:    { label: "Passed",    icon: XCircle,       classes: "bg-text-secondary/10 text-text-secondary" },
};

export default function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  const { label, icon: Icon, classes } = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${classes}`}>
      <Icon size={10} />
      {label}
    </span>
  );
}
