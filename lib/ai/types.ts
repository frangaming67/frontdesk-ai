export type ConversationStage =
  | "exploring"
  | "offer_consult"
  | "awaiting_name"
  | "awaiting_contact"
  | "awaiting_day"
  | "awaiting_time"
  | "completed";

export interface ConversationDraft {
  name?: string;
  contact?: string;
  day?: string;
  time?: string;
}

export interface ConversationState {
  stage: ConversationStage;
  treatmentInterest?: string;
  askedPricing: boolean;
  questionCount: number;
  draft: ConversationDraft;
}

export interface AIReply {
  message: string;
  state: ConversationState;
  /** True on the turn where every field needed to create a lead is complete. */
  leadReady: boolean;
}
