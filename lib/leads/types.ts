export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CONSULTATION_REQUESTED"
  | "WON"
  | "LOST";

export type Intent = "HIGH" | "MEDIUM" | "LOW";

export interface ContactVerificationRecord {
  channel: "email" | "sms";
  verifiedAt: string;
  consentVersion: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: string; // ISO string
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  treatment: string;
  intent: Intent;
  preferredDay?: string;
  preferredTime?: string;
  status: LeadStatus;
  createdAt: string; // ISO string
  conversation: ChatMessage[];
  // Informational demo metadata, not an authentication credential.
  contactVerification?: ContactVerificationRecord;
}

export type NewLeadInput = Omit<Lead, "id" | "createdAt" | "status"> & {
  status?: LeadStatus;
};
