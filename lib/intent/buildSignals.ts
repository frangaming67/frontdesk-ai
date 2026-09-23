import type { ConversationState } from "@/lib/ai/types";
import type { IntentSignals } from "./detectIntent";

export function buildIntentSignals(state: ConversationState): IntentSignals {
  return {
    mentionedTreatment: Boolean(state.treatmentInterest),
    requestedConsultation: state.stage === "completed",
    providedContact: Boolean(state.draft.contact),
    askedPricing: state.askedPricing,
    askedMultipleQuestions: state.questionCount >= 2,
  };
}
