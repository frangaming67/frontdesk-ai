"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { Intent } from "@/lib/leads/types";

const STYLES: Record<Intent, string> = {
  HIGH: "bg-teal-tint text-teal-deep",
  MEDIUM: "bg-gold-tint text-gold",
  LOW: "bg-paper text-ink-soft",
};
const LABELS: Record<Intent, [string, string]> = { HIGH: ["High intent", "Interés alto"], MEDIUM: ["Medium intent", "Interés medio"], LOW: ["Low intent", "Interés bajo"] };

export function IntentBadge({ intent }: { intent: Intent }) {
  const { t } = useLanguage();
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[intent]}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {t(...LABELS[intent])}
    </span>
  );
}
