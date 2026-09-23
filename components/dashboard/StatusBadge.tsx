import type { LeadStatus } from "@/lib/leads/types";

const LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  CONSULTATION_REQUESTED: "Consultation requested",
  WON: "Won",
  LOST: "Lost",
};

const STYLES: Record<LeadStatus, string> = {
  NEW: "border border-gold/40 text-gold",
  CONTACTED: "border border-teal/40 text-teal",
  QUALIFIED: "bg-teal-tint text-teal-deep",
  CONSULTATION_REQUESTED: "bg-teal text-white",
  WON: "bg-teal-deep text-white",
  LOST: "border border-line text-ink-soft",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
