import type { Intent } from "@/lib/leads/types";

export interface IntentSignals {
  mentionedTreatment: boolean;
  requestedConsultation: boolean;
  providedContact: boolean;
  askedPricing: boolean;
  askedMultipleQuestions: boolean;
}

/**
 * Simple, explainable intent heuristic for the demo.
 *
 * HIGH   — treatment interest + consultation request + contact info captured.
 * MEDIUM — interested and asking questions (pricing, comparisons) but not
 *          ready to book yet.
 * LOW    — general / informational questions only, no booking signal.
 */
export function detectIntent(signals: IntentSignals): Intent {
  if (signals.requestedConsultation && signals.providedContact) {
    return "HIGH";
  }
  if (signals.mentionedTreatment && (signals.askedPricing || signals.askedMultipleQuestions)) {
    return "MEDIUM";
  }
  return "LOW";
}
