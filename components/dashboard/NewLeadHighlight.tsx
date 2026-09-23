"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lead } from "@/lib/leads/types";
import { IntentBadge } from "./IntentBadge";
import { StatusBadge } from "./StatusBadge";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";

export function NewLeadHighlight({ lead, onUpdated }: { lead: Lead; onUpdated: (lead: Lead) => void }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  async function handleContact() {
    setIsUpdating(true);
    setError("");
    try {
      const updated = await leadRepository.updateStatus(lead.id, "CONTACTED");
      if (updated) onUpdated(updated);
      else setError("This lead is no longer available. Refresh the dashboard to see the latest leads.");
    } catch {
      setError("Could not save this status. Check that browser storage is available, then try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-teal/25 bg-teal-tint/60 p-5 sm:p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-teal-deep">
        <span aria-hidden>🔥</span>
        New lead
      </div>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          <div>
            <p className="text-xs text-ink-soft">Name</p>
            <Link href={`/dashboard/leads/${lead.id}`} className="font-display text-lg text-ink hover:text-teal-deep">
              {lead.name}
            </Link>
          </div>
          <div>
            <p className="text-xs text-ink-soft">Treatment</p>
            <p className="mt-0.5 text-sm text-ink">{lead.treatment}</p>
          </div>
          <div>
            <p className="text-xs text-ink-soft">Intent</p>
            <div className="mt-1">
              <IntentBadge intent={lead.intent} />
            </div>
          </div>
          <div>
            <p className="text-xs text-ink-soft">Preferred time</p>
            <p className="mt-0.5 text-sm text-ink">
              {lead.preferredDay || "—"} {lead.preferredTime ? `· ${lead.preferredTime}` : ""}
            </p>
          </div>
        </div>
        {lead.status === "NEW" || lead.status === "CONSULTATION_REQUESTED" ? (
          <button
            type="button"
            onClick={handleContact}
            disabled={isUpdating}
            className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Marking as contacted…" : "Mark as contacted"}
          </button>
        ) : (
          <StatusBadge status={lead.status} />
        )}
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-coral">{error}</p>}
    </div>
  );
}
