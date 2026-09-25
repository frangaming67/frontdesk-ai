"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { LeadStatus } from "@/lib/leads/types";

export const STATUS_LABELS: Record<LeadStatus, [string, string]> = {
  NEW: ["New", "Nuevo"],
  CONTACTED: ["Contacted", "Contactado"],
  QUALIFIED: ["Qualified", "Calificado"],
  CONSULTATION_REQUESTED: ["Consultation requested", "Consulta solicitada"],
  WON: ["Won", "Convertido"],
  LOST: ["Lost", "Perdido"],
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
  const { t } = useLanguage();
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}>
      {t(...STATUS_LABELS[status])}
    </span>
  );
}
