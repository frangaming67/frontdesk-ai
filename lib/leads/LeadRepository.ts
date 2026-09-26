import type { Lead, NewLeadInput, LeadStatus } from "./types";

/**
 * Abstraction over lead persistence.
 *
 * The rest of the app (chat flow, dashboard, lead detail) only ever talks to
 * this interface. Today it's backed by LocalLeadRepository (localStorage).
 * Later it can be swapped for a DatabaseLeadRepository without touching any
 * component.
 */
export interface LeadRepository {
  getAll(): Promise<Lead[]>;
  getById(id: string): Promise<Lead | undefined>;
  create(input: NewLeadInput): Promise<Lead>;
  updateStatus(id: string, status: LeadStatus): Promise<Lead | undefined>;
  /** Replace this browser's demo leads with the original fictional examples. */
  resetDemo(): Promise<Lead[]>;
  /** Erase saved demo requests without restoring examples. */
  clearDemo(): Promise<void>;
}
