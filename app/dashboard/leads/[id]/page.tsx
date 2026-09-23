"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { IntentBadge } from "@/components/dashboard/IntentBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConversationView } from "@/components/dashboard/ConversationView";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";
import type { Lead } from "@/lib/leads/types";

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null | undefined>(undefined);

  useEffect(() => {
    leadRepository.getById(params.id).then((l) => setLead(l ?? null));
  }, [params.id]);

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader backHref="/dashboard" backLabel="Back to dashboard" />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        {lead === undefined && <p className="text-sm text-ink-soft">Loading…</p>}
        {lead === null && <p className="text-sm text-ink-soft">Lead not found.</p>}
        {lead && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl text-ink">{lead.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <IntentBadge intent={lead.intent} />
                <StatusBadge status={lead.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-line-soft bg-white p-5 sm:grid-cols-3">
              <Field label="Treatment" value={lead.treatment} />
              <Field label="Email" value={lead.email || "—"} />
              <Field label="Phone" value={lead.phone || "—"} />
              <Field label="Preferred day" value={lead.preferredDay || "—"} />
              <Field label="Preferred time" value={lead.preferredTime || "—"} />
              <Field label="Status" value={lead.status.replace("_", " ").toLowerCase()} capitalize />
            </div>

            <div>
              <h2 className="mb-3 font-display text-lg text-ink">Conversation</h2>
              <ConversationView conversation={lead.conversation} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <p className="text-xs text-ink-soft">{label}</p>
      <p className={`mt-0.5 text-sm text-ink ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}
