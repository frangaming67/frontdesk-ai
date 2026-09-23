import type { Intent } from "@/lib/leads/types";

const STYLES: Record<Intent, string> = {
  HIGH: "bg-teal text-white",
  MEDIUM: "bg-gold-tint text-gold",
  LOW: "bg-line-soft text-ink-soft",
};

export function IntentBadge({ intent }: { intent: Intent }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[intent]}`}>
      {intent}
    </span>
  );
}
