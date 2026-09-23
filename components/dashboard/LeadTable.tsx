"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Lead } from "@/lib/leads/types";
import { IntentBadge } from "./IntentBadge";
import { StatusBadge } from "./StatusBadge";
import { formatRelativeDate } from "@/lib/utils/date";

type Filter = "ALL" | "NEW" | "HIGH" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "NEW", label: "New" },
  { id: "HIGH", label: "High intent" },
  { id: "CONTACTED", label: "Contacted" },
  { id: "QUALIFIED", label: "Qualified" },
  { id: "WON", label: "Won" },
  { id: "LOST", label: "Lost" },
];

export function LeadTable({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = useMemo(() => {
    switch (filter) {
      case "ALL":
        return leads;
      case "HIGH":
        return leads.filter((l) => l.intent === "HIGH");
      default:
        return leads.filter((l) => l.status === filter);
    }
  }, [leads, filter]);

  return (
    <div className="rounded-2xl border border-line-soft bg-white">
      <div className="flex flex-wrap gap-1.5 border-b border-line-soft p-3">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              filter === f.id ? "bg-ink text-white" : "text-ink-soft hover:bg-line-soft"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="p-8 text-center text-sm text-ink-soft">No leads match this filter yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line-soft text-xs text-ink-soft">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Treatment</th>
                <th className="px-5 py-3 font-medium">Intent</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-line-soft last:border-0 hover:bg-paper">
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/leads/${lead.id}`} className="font-medium text-ink hover:text-teal-deep">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{lead.treatment}</td>
                  <td className="px-5 py-3">
                    <IntentBadge intent={lead.intent} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{formatRelativeDate(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
