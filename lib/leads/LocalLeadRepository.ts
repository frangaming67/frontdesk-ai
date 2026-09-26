import type { LeadRepository } from "./LeadRepository";
import type { Lead, NewLeadInput, LeadStatus } from "./types";
import { generateId } from "@/lib/utils/id";
import { seedLeads } from "@/data/seed-leads";

const STORAGE_KEY = "frontdesk_ai_leads_v1";

function copySeedLeads(): Lead[] {
  return seedLeads.map((lead) => ({
    ...lead,
    conversation: lead.conversation.map((message) => ({ ...message })),
  }));
}

/**
 * localStorage-backed implementation of LeadRepository, for the demo.
 * No component should touch localStorage directly — this is the only
 * place that does. Swapping this for a DatabaseLeadRepository later
 * should not require changing any component.
 */
export class LocalLeadRepository implements LeadRepository {
  private read(): Lead[] {
    if (typeof window === "undefined") return copySeedLeads();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedLeads));
        return copySeedLeads();
      }
      return JSON.parse(raw) as Lead[];
    } catch {
      return copySeedLeads();
    }
  }

  private write(leads: Lead[]): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }

  async getAll(): Promise<Lead[]> {
    return [...this.read()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getById(id: string): Promise<Lead | undefined> {
    return this.read().find((l) => l.id === id);
  }

  async create(input: NewLeadInput): Promise<Lead> {
    const lead: Lead = {
      ...input,
      id: generateId("lead"),
      createdAt: new Date().toISOString(),
      status: input.status ?? "CONSULTATION_REQUESTED",
    };
    const current = this.read();
    this.write([lead, ...current]);
    return lead;
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead | undefined> {
    const current = this.read();
    const idx = current.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;
    current[idx] = { ...current[idx], status };
    this.write(current);
    return current[idx];
  }

  async resetDemo(): Promise<Lead[]> {
    // Write only our own key. A failed write must reject so the dashboard never
    // announces a successful reset when the old demo data is still persisted.
    const leads = copySeedLeads();
    this.write(leads);
    return leads.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async clearDemo(): Promise<void> { this.write([]); }
}

export const leadRepository = new LocalLeadRepository();
