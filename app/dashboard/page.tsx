"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { NewLeadHighlight } from "@/components/dashboard/NewLeadHighlight";
import { LeadTable } from "@/components/dashboard/LeadTable";
import { DemoResetControl } from "@/components/dashboard/DemoResetControl";
import { Icon } from "@/components/ui/Icon";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";
import { practice } from "@/lib/knowledge-base";
import type { Lead } from "@/lib/leads/types";

export default function DashboardPage() {
  const { t } = useLanguage();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [resetVersion, setResetVersion] = useState(0);

  useEffect(() => { leadRepository.getAll().then(setLeads); }, []);

  function handleLeadUpdated(updated: Lead) {
    setLeads((prev) => (prev ? prev.map((lead) => (lead.id === updated.id ? updated : lead)) : prev));
  }

  function handleDemoReset(restored: Lead[]) {
    setLeads(restored);
    setResetVersion((previous) => previous + 1);
  }

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader />
      <main className="mx-auto max-w-6xl space-y-7 px-5 py-8 sm:space-y-8 sm:px-8 sm:py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">{practice.name}</p>
            <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">{t("Your front desk, at a glance.", "Tu recepción, de un vistazo.")}</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">{t("Every conversation has a next step. Here's who's ready for yours.", "Cada conversación tiene un próximo paso. Aquí puedes ver a quién contactar.")}</p>
          </div>
          <Link href="/chat" className="button-secondary shrink-0 self-start sm:self-auto"><Icon name="message" size={17} />{t("Try the patient experience", "Prueba la experiencia del paciente")}</Link>
        </div>

        {leads === null ? (
          <div role="status" className="rounded-[24px] border border-line-soft bg-white p-10 text-center text-sm text-ink-soft">{t("Loading your dashboard…", "Cargando tu panel…")}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <MetricCard label={t("Needs follow-up", "Por contactar")} value={leads.filter((lead) => lead.status === "NEW" || lead.status === "CONSULTATION_REQUESTED").length} description={t("Ready for your team to reach out", "Listos para que tu equipo los contacte")} icon="calendar" emphasized />
              <MetricCard label={t("High intent", "Interés alto")} value={leads.filter((lead) => lead.intent === "HIGH").length} description={t("Showing strong interest in care", "Con gran interés en un tratamiento")} icon="sparkles" />
              <MetricCard label={t("Contacted", "Contactados")} value={leads.filter((lead) => lead.status === "CONTACTED").length} description={t("Marked as contacted by your team", "Marcados como contactados por tu equipo")} icon="check-circle" />
              <MetricCard label={t("Total leads", "Total de contactos")} value={leads.length} description={t("Captured patient inquiries", "Consultas de pacientes registradas")} icon="users" />
            </div>
            {leads.length === 0 ? (
              <section className="rounded-[24px] border border-dashed border-line bg-white px-6 py-14 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-teal-tint text-teal"><Icon name="users" size={23} /></span>
                <h2 className="mt-5 font-display text-2xl text-ink">{t("Your next patient starts here.", "Tu próximo paciente empieza aquí.")}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{t("Try the chat as a patient. When you submit a consultation request, the details and conversation will appear here.", "Prueba el chat como paciente. Al enviar una solicitud de consulta, los datos y la conversación aparecerán aquí.")}</p>
                <Link href="/chat" className="button-primary mt-6">{t("Try the chat demo", "Prueba la demo del chat")} <Icon name="arrow-right" size={16} /></Link>
              </section>
            ) : (
              <>
                <NewLeadHighlight key={`${resetVersion}-${leads[0].id}`} lead={leads[0]} onUpdated={handleLeadUpdated} />
                <LeadTable key={resetVersion} leads={leads} />
              </>
            )}
            <DemoResetControl onReset={handleDemoReset} />
          </>
        )}
      </main>
    </div>
  );
}
