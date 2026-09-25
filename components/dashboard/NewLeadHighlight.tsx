"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lead } from "@/lib/leads/types";
import { IntentBadge } from "./IntentBadge";
import { StatusBadge } from "./StatusBadge";
import { Icon } from "@/components/ui/Icon";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";
import { formatRelativeDate } from "@/lib/utils/date";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { preferenceLabel, treatmentLabel } from "@/lib/i18n/labels";

export function NewLeadHighlight({ lead, onUpdated }: { lead: Lead; onUpdated: (lead: Lead) => void }) {
  const { t, locale } = useLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  async function handleContact() {
    setIsUpdating(true);
    setError("");
    try {
      const updated = await leadRepository.updateStatus(lead.id, "CONTACTED");
      if (updated) onUpdated(updated);
      else setError("missing");
    } catch {
      setError("save");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <section aria-label={t("Latest lead", "Último contacto")} className="overflow-hidden rounded-[24px] border border-teal/20 bg-teal-tint/70">
      <div className="flex items-center justify-between gap-4 border-b border-teal/10 px-5 py-3.5 sm:px-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-teal-deep">
          <Icon name="sparkles" size={15} /> {t("Latest lead", "Último contacto")}
        </p>
        <span className="text-xs text-ink-soft">{formatRelativeDate(lead.createdAt, locale)}</span>
      </div>
      <div className="flex flex-col justify-between gap-6 p-5 sm:p-6 lg:flex-row lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/dashboard/leads/${lead.id}`} className="break-words font-display text-2xl text-ink hover:text-teal-deep sm:text-3xl">{lead.name}</Link>
            <IntentBadge intent={lead.intent} />
          </div>
          <p className="mt-2 text-sm text-ink-soft">{t("Interested in", "Interés en")} <span className="font-medium text-ink">{treatmentLabel(lead.treatment, locale)}</span></p>
          <p className="mt-3 flex items-start gap-2 text-sm text-ink-soft">
            <Icon name="calendar" size={16} className="mt-0.5 shrink-0 text-teal" />
            {lead.preferredDay || lead.preferredTime
              ? `${t("Prefers", "Prefiere")} ${[lead.preferredDay, lead.preferredTime].filter(Boolean).map((value) => preferenceLabel(value, locale)).join(" · ")}`
              : t("Preferred consultation time not specified", "Sin horario preferido para la consulta")}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link href={`/dashboard/leads/${lead.id}`} className="button-primary">{t("View lead", "Ver contacto")} <Icon name="arrow-right" size={16} /></Link>
          {lead.status === "NEW" || lead.status === "CONSULTATION_REQUESTED" ? (
            <button type="button" onClick={handleContact} disabled={isUpdating} className="button-secondary disabled:cursor-wait disabled:opacity-50">
              <Icon name="check" size={16} />{isUpdating ? t("Saving…", "Guardando…") : t("Mark contacted", "Marcar contactado")}
            </button>
          ) : <StatusBadge status={lead.status} />}
        </div>
      </div>
      {error && <p role="alert" className="px-5 pb-5 text-sm text-coral sm:px-6">{error === "missing" ? t("This lead is no longer available. Refresh the dashboard to see the latest leads.", "Este contacto ya no está disponible. Actualiza el panel para ver los contactos actuales.") : t("Could not save this status. Check that browser storage is available, then try again.", "No se pudo guardar el estado. Comprueba que el almacenamiento del navegador esté disponible e inténtalo de nuevo.")}</p>}
    </section>
  );
}
