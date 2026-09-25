"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Lead, LeadStatus } from "@/lib/leads/types";
import { IntentBadge } from "./IntentBadge";
import { StatusBadge } from "./StatusBadge";
import { Icon } from "@/components/ui/Icon";
import { formatRelativeDate } from "@/lib/utils/date";

const STATUSES: { id: LeadStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "All statuses" },
  { id: "NEW", label: "New" },
  { id: "CONSULTATION_REQUESTED", label: "Consultation requested" },
  { id: "CONTACTED", label: "Contacted" },
  { id: "QUALIFIED", label: "Qualified" },
  { id: "WON", label: "Won" },
  { id: "LOST", label: "Lost" },
];

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
}

export function LeadTable({ leads }: { leads: Lead[] }) {
  const [status, setStatus] = useState<LeadStatus | "ALL">("ALL");
  const [highIntentOnly, setHighIntentOnly] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return leads.filter((lead) =>
      (status === "ALL" || lead.status === status) &&
      (!highIntentOnly || lead.intent === "HIGH") &&
      (!search || [lead.name, lead.email, lead.phone, lead.treatment].filter(Boolean).join(" ").toLowerCase().includes(search))
    );
  }, [leads, status, highIntentOnly, query]);

  const hasFilters = status !== "ALL" || highIntentOnly || query.length > 0;

  function clearFilters() {
    setStatus("ALL");
    setHighIntentOnly(false);
    setQuery("");
  }

  return (
    <section aria-labelledby="leads-title" className="overflow-hidden rounded-[24px] border border-line-soft bg-white">
      <div className="flex flex-col justify-between gap-5 px-5 pt-6 sm:px-6 sm:pt-7 lg:flex-row lg:items-center">
        <div>
          <h2 id="leads-title" className="font-display text-2xl text-ink">Patient inquiries <span className="ml-1 align-middle font-body text-sm text-ink-soft">({leads.length})</span></h2>
          <p className="mt-1 text-sm text-ink-soft">The details your team needs to follow up.</p>
        </div>
        <div className="relative w-full lg:w-80">
          <label htmlFor="lead-search" className="sr-only">Search by name, contact or treatment</label>
          <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input id="lead-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, contact or treatment" className="min-h-11 w-full rounded-xl border border-line bg-paper/60 py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-soft/80 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15" />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-b border-line-soft px-5 pb-5 sm:px-6">
        <label htmlFor="lead-status" className="sr-only">Filter by status</label>
        <div className="relative">
          <select id="lead-status" value={status} onChange={(event) => setStatus(event.target.value as LeadStatus | "ALL")} className="min-h-10 max-w-full appearance-none rounded-xl border border-line bg-white py-2 pl-3 pr-9 text-sm text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15">
            {STATUSES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <Icon name="chevron-down" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        </div>
        <button type="button" aria-pressed={highIntentOnly} onClick={() => setHighIntentOnly((current) => !current)} className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${highIntentOnly ? "border-teal bg-teal-tint text-teal-deep" : "border-line text-ink-soft hover:border-teal hover:text-teal"}`}>
          <Icon name="sparkles" size={15} /> High intent
          {highIntentOnly && <Icon name="check" size={14} />}
        </button>
        {hasFilters && <button type="button" onClick={clearFilters} className="min-h-10 px-2 text-xs font-medium text-ink-soft underline decoration-line underline-offset-4 hover:text-teal">Clear filters</button>}
        <p role="status" className="ml-auto text-xs text-ink-soft">{filtered.length} of {leads.length} leads</p>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <Icon name="search" size={26} className="mx-auto text-teal" />
          <h3 className="mt-4 font-display text-xl text-ink">No matching inquiries.</h3>
          <p className="mt-2 text-sm text-ink-soft">Try a different name, treatment or status.</p>
          <button type="button" onClick={clearFilters} className="button-secondary mt-5">Clear filters</button>
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <table className="w-full table-fixed text-left text-sm">
              <caption className="sr-only">Patient inquiries. Open a patient name to view contact details and their conversation.</caption>
              <thead>
                <tr className="border-b border-line-soft bg-paper/60 text-xs text-ink-soft">
                  <th scope="col" className="w-[28%] px-6 py-3.5 font-medium">Patient</th>
                  <th scope="col" className="w-[16%] px-3 py-3.5 font-medium">Interested in</th>
                  <th scope="col" className="w-[15%] px-3 py-3.5 font-medium">Intent</th>
                  <th scope="col" className="w-[24%] px-3 py-3.5 font-medium">Status</th>
                  <th scope="col" className="w-[13%] px-3 py-3.5 font-medium">Received</th>
                  <th scope="col" className="w-[4%] py-3.5"><span className="sr-only">Details</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="group border-b border-line-soft transition-colors last:border-0 hover:bg-paper/70">
                    <td className="px-6 py-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-xs font-semibold text-teal-deep">{initials(lead.name)}</span>
                        <div className="min-w-0">
                          <Link href={`/dashboard/leads/${lead.id}`} className="break-words font-semibold text-ink hover:text-teal hover:underline">{lead.name}</Link>
                          <p className="mt-1 truncate text-xs text-ink-soft" title={lead.email || lead.phone}>{lead.email || lead.phone || "No contact provided"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5 text-ink-soft">{lead.treatment}</td>
                    <td className="px-3 py-5"><IntentBadge intent={lead.intent} /></td>
                    <td className="px-3 py-5"><StatusBadge status={lead.status} /></td>
                    <td className="px-3 py-5 text-xs text-ink-soft">{formatRelativeDate(lead.createdAt)}</td>
                    <td className="py-5 pr-4">
                      <Link href={`/dashboard/leads/${lead.id}`} aria-label={`View ${lead.name}'s inquiry`} className="inline-flex size-7 items-center justify-center rounded-lg text-ink-soft hover:bg-teal-tint hover:text-teal"><Icon name="chevron-right" size={16} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-line-soft lg:hidden">
            {filtered.map((lead) => (
              <Link key={lead.id} href={`/dashboard/leads/${lead.id}`} className="block px-5 py-5 transition-colors hover:bg-paper sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-xs font-semibold text-teal-deep">{initials(lead.name)}</span>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-ink">{lead.name}</p>
                      <p className="mt-1 text-xs text-ink-soft">{lead.treatment}</p>
                    </div>
                  </div>
                  <Icon name="chevron-right" size={18} className="mt-2 shrink-0 text-ink-soft" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2"><IntentBadge intent={lead.intent} /><StatusBadge status={lead.status} /></div>
                <p className="mt-3 text-xs text-ink-soft">Received {formatRelativeDate(lead.createdAt).toLowerCase()}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
