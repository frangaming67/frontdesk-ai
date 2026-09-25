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

export default function LeadDetailPage() {
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
      else setError("This lead is no longer available. Return to the dashboard to see the latest leads.");
    } catch {
      setError("Could not save the status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader backHref="/dashboard" backLabel="All patient inquiries" />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {lead === undefined && <p role="status" className="rounded-[24px] border border-line-soft bg-white p-8 text-sm text-ink-soft">Loading patient inquiry…</p>}
        {lead === null && (
          <div className="rounded-[24px] border border-line-soft bg-white px-6 py-14 text-center">
            <h1 className="font-display text-3xl text-ink">This inquiry isn&apos;t here.</h1>
            <p className="mt-3 text-sm text-ink-soft">It may have been reset, or saved in a different browser.</p>
            <Link href="/dashboard" className="button-primary mt-6">Return to dashboard <Icon name="arrow-right" size={16} /></Link>
          </div>
        )}
        {lead && (
          <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div className="min-w-0">
                <p className="eyebrow">Patient inquiry</p>
                <h1 className="mt-3 break-words font-display text-4xl text-ink sm:text-5xl">{lead.name}</h1>
                <p className="mt-3 text-sm text-ink-soft">Received {formatRelativeDate(lead.createdAt).toLowerCase()} · Interested in {lead.treatment}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2"><IntentBadge intent={lead.intent} /><StatusBadge status={lead.status} /></div>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="space-y-5">
                <section className="rounded-[24px] border border-line-soft bg-white p-6">
                  <h2 className="font-display text-xl text-ink">Contact details</h2>
                  <div className="mt-5 space-y-5">
                    <div>
                      <p className="mb-1.5 text-xs text-ink-soft">Email address</p>
                      {lead.email ? <a href={`mailto:${lead.email}`} className="flex items-start gap-2 text-sm font-medium text-teal hover:underline"><Icon name="mail" size={16} className="mt-0.5 shrink-0" /><span className="break-all">{lead.email}</span></a> : <p className="text-sm text-ink-soft">Not provided</p>}
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs text-ink-soft">Phone number</p>
                      {lead.phone ? <a href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 text-sm font-medium text-teal hover:underline"><Icon name="phone" size={16} />{lead.phone}</a> : <p className="text-sm text-ink-soft">Not provided</p>}
                    </div>
                  </div>
                  {(lead.status === "NEW" || lead.status === "CONSULTATION_REQUESTED") && (
                    <div className="mt-6 border-t border-line-soft pt-5">
                      <button type="button" onClick={markContacted} disabled={isUpdating} className="button-primary w-full disabled:cursor-wait disabled:opacity-50"><Icon name="check" size={16} />{isUpdating ? "Saving…" : "Mark as contacted"}</button>
                      <p className="mt-2 text-center text-xs leading-relaxed text-ink-soft">Update after your team reaches out.</p>
                    </div>
                  )}
                  {error && <p role="alert" className="mt-3 text-sm text-coral">{error}</p>}
                </section>
                <section className="rounded-[24px] border border-line-soft bg-white p-6">
                  <h2 className="font-display text-xl text-ink">Consultation preferences</h2>
                  <dl className="mt-5 space-y-4">
                    <Field label="Treatment" value={lead.treatment} />
                    <Field label="Preferred day" value={lead.preferredDay || "Not specified"} />
                    <Field label="Preferred time" value={lead.preferredTime || "Not specified"} />
                  </dl>
                  <div className="mt-6 flex items-start gap-2 rounded-xl bg-teal-tint p-3 text-xs leading-relaxed text-teal-deep">
                    <Icon name="calendar" size={16} className="mt-0.5 shrink-0" />
                    A request, not a confirmed appointment. Your team confirms availability with the patient.
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
