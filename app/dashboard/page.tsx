"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { NewLeadHighlight } from "@/components/dashboard/NewLeadHighlight";
import { LeadTable } from "@/components/dashboard/LeadTable";
import { DemoResetControl } from "@/components/dashboard/DemoResetControl";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";
import type { Lead } from "@/lib/leads/types";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [resetVersion, setResetVersion] = useState(0);

  useEffect(() => {
    leadRepository.getAll().then(setLeads);
  }, []);

  function handleLeadUpdated(updated: Lead) {
    setLeads((prev) => (prev ? prev.map((l) => (l.id === updated.id ? updated : l)) : prev));
  }

  function handleDemoReset(restored: Lead[]) {
    setLeads(restored);
    setResetVersion((previous) => previous + 1);
  }

  if (!leads) {
    return (
      <div className="min-h-screen bg-paper">
        <DashboardHeader />
        <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-ink-soft sm:px-8">Loading dashboard…</div>
      </div>
    );
  }

  const metrics = {
    newLeads: leads.filter((l) => l.status === "NEW").length,
    highIntent: leads.filter((l) => l.intent === "HIGH").length,
    contacted: leads.filter((l) => l.status === "CONTACTED").length,
    consultationRequests: leads.filter((l) => l.status === "CONSULTATION_REQUESTED").length,
  };

  const mostRecent = leads[0];

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader backHref="/" backLabel="Back to landing" />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-8">
        <DemoResetControl onReset={handleDemoReset} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="New leads" value={metrics.newLeads} />
          <MetricCard label="High intent" value={metrics.highIntent} />
          <MetricCard label="Contacted" value={metrics.contacted} />
          <MetricCard label="Consultation requests" value={metrics.consultationRequests} />
        </div>

        {leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-ink-soft">
            No leads yet. Try the chat demo to create one.
          </div>
        ) : (
          <>
            {mostRecent && <NewLeadHighlight lead={mostRecent} onUpdated={handleLeadUpdated} />}
            <div>
              <h2 className="mb-3 font-display text-xl text-ink">Leads</h2>
              <LeadTable key={resetVersion} leads={leads} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
