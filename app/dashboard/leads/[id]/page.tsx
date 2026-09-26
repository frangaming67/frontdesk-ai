"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { IntentBadge } from "@/components/dashboard/IntentBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConversationView } from "@/components/dashboard/ConversationView";
import { Icon } from "@/components/ui/Icon";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";
import { formatRelativeDate } from "@/lib/utils/date";
import type { Lead } from "@/lib/leads/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { preferenceLabel, treatmentLabel } from "@/lib/i18n/labels";

export default function LeadDetailPage() {
  const { t, locale } = useLanguage();
  const params = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { leadRepository.getById(params.id).then((result) => setLead(result ?? null)); }, [params.id]);

  async function markContacted() {
    if (!lead) return;
    setIsUpdating(true);
    setError("");
    try {
      const updated = await leadRepository.updateStatus(lead.id, "CONTACTED");
      if (updated) setLead(updated);
      else setError("missing");
    } catch {
      setError("save");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader backHref="/dashboard" backLabel={t("All patient inquiries", "Todas las consultas")} />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {lead === undefined && <p role="status" className="rounded-[24px] border border-line-soft bg-white p-8 text-sm text-ink-soft">{t("Loading patient inquiry…", "Cargando consulta del paciente…")}</p>}
        {lead === null && (
          <div className="rounded-[24px] border border-line-soft bg-white px-6 py-14 text-center">
            <h1 className="font-display text-3xl text-ink">{t("This inquiry isn't here.", "Esta consulta no está disponible.")}</h1>
            <p className="mt-3 text-sm text-ink-soft">{t("It may have been reset, or saved in a different browser.", "Es posible que se haya eliminado al restablecer la demo o se haya guardado en otro navegador.")}</p>
            <Link href="/dashboard" className="button-primary mt-6">{t("Return to dashboard", "Volver al panel")} <Icon name="arrow-right" size={16} /></Link>
          </div>
        )}
        {lead && (
          <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div className="min-w-0">
                <p className="eyebrow">{t("Patient inquiry", "Consulta del paciente")}</p>
                <h1 className="mt-3 break-words font-display text-4xl text-ink sm:text-5xl">{lead.name}</h1>
                <p className="mt-3 text-sm text-ink-soft">{t("Received", "Recibido")} {formatRelativeDate(lead.createdAt, locale).toLowerCase()} · {t("Interested in", "Interés en")} {treatmentLabel(lead.treatment, locale)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2"><IntentBadge intent={lead.intent} /><StatusBadge status={lead.status} /></div>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="space-y-5">
                <section className="rounded-[24px] border border-line-soft bg-white p-6">
                  <h2 className="font-display text-xl text-ink">{t("Contact details", "Datos de contacto")}</h2>
                  <p className="mt-3 rounded-xl bg-teal-tint p-3 text-xs leading-5 text-teal-deep">{lead.contactVerification ? t(`Contact verified by ${lead.contactVerification.channel === "email" ? "email" : "SMS"}. This does not confirm an appointment.`, `Contacto verificado por ${lead.contactVerification.channel === "email" ? "email" : "SMS"}. No confirma una cita.`) : t("Demo contact · Not verified", "Contacto de prueba · Sin verificar")}</p>
                  <div className="mt-5 space-y-5">
                    <div>
                      <p className="mb-1.5 text-xs text-ink-soft">{t("Email address", "Correo electrónico")}</p>
                      {lead.email ? <a href={`mailto:${lead.email}`} className="flex items-start gap-2 text-sm font-medium text-teal hover:underline"><Icon name="mail" size={16} className="mt-0.5 shrink-0" /><span className="break-all">{lead.email}</span></a> : <p className="text-sm text-ink-soft">{t("Not provided", "No proporcionado")}</p>}
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs text-ink-soft">{t("Phone number", "Teléfono")}</p>
                      {lead.phone ? <a href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 text-sm font-medium text-teal hover:underline"><Icon name="phone" size={16} />{lead.phone}</a> : <p className="text-sm text-ink-soft">{t("Not provided", "No proporcionado")}</p>}
                    </div>
                  </div>
                  {(lead.status === "NEW" || lead.status === "CONSULTATION_REQUESTED") && (
                    <div className="mt-6 border-t border-line-soft pt-5">
                      <button type="button" onClick={markContacted} disabled={isUpdating} className="button-primary w-full disabled:cursor-wait disabled:opacity-50"><Icon name="check" size={16} />{isUpdating ? t("Saving…", "Guardando…") : t("Mark as contacted", "Marcar como contactado")}</button>
                      <p className="mt-2 text-center text-xs leading-relaxed text-ink-soft">{t("Update after your team reaches out.", "Actualiza después de contactar al paciente.")}</p>
                    </div>
                  )}
                  {error && <p role="alert" className="mt-3 text-sm text-coral">{error === "missing" ? t("This lead is no longer available. Return to the dashboard to see the latest leads.", "Este contacto ya no está disponible. Vuelve al panel para ver los contactos actuales.") : t("Could not save the status. Please try again.", "No se pudo guardar el estado. Inténtalo de nuevo.")}</p>}
                </section>
                <section className="rounded-[24px] border border-line-soft bg-white p-6">
                  <h2 className="font-display text-xl text-ink">{t("Consultation preferences", "Preferencias para la consulta")}</h2>
                  <dl className="mt-5 space-y-4">
                    <Field label={t("Treatment", "Tratamiento")} value={treatmentLabel(lead.treatment, locale)} />
                    <Field label={t("Preferred day", "Día preferido")} value={lead.preferredDay ? preferenceLabel(lead.preferredDay, locale) : t("Not specified", "Sin especificar")} />
                    <Field label={t("Preferred time", "Horario preferido")} value={lead.preferredTime ? preferenceLabel(lead.preferredTime, locale) : t("Not specified", "Sin especificar")} />
                  </dl>
                  <div className="mt-6 flex items-start gap-2 rounded-xl bg-teal-tint p-3 text-xs leading-relaxed text-teal-deep">
                    <Icon name="calendar" size={16} className="mt-0.5 shrink-0" />
                    {t("A request, not a confirmed appointment. Your team confirms availability with the patient.", "Es una solicitud, no una cita confirmada. Tu equipo confirma la disponibilidad con el paciente.")}
                  </div>
                </section>
              </aside>
              <ConversationView conversation={lead.conversation} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-ink-soft">{label}</dt><dd className="mt-1 text-sm font-medium text-ink">{value}</dd></div>;
}
