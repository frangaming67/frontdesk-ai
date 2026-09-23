import type { AIService } from "./AIService";
import type { ConversationState, AIReply, ConversationStage } from "./types";
import { practice, hoursSummary, findTreatmentByKeyword, findFaqAnswer } from "@/lib/knowledge-base";
import { normalizeText } from "@/lib/knowledge-base/matchKeywords";

const AFFIRMATIVE = /^(yes|yeah|yep|yup|sure|ok(?:ay)?|sounds good|please do|please|correct|go ahead|definitely|of course|let's do it|that works|that would be great|i'd love to|absolutely)\b/i;
const NEGATIVE = /^(no(?:\s+(?:thanks|thank you|please))?|nah|nope|not now|not yet|maybe later|not really|just (?:looking|browsing)|i'm just (?:looking|browsing)|i(?:'m| am) not ready)\b/i;
const CANCEL = /\b(cancel (?:this|my|the) request|stop (?:this|the) request|don't want to (?:book|schedule)|do not want to (?:book|schedule))\b/i;
const BOOKING_REQUEST = /\b(?:book|schedule|arrange|reserve|request|set up|make|get|need|want|would like|i'd like|help me with)\b.{0,45}\b(?:appointment|consultation|consult|visit)\b|\b(?:book|schedule)\b|\b(?:come in|see a dentist|see the dentist|meet the dentist|available appointments?|available slots?|availability|an opening)\b|^(?:appointment|consultation)(?:\s+(?:please|now))?[.!?]*$/i;
const PRICING = /\b(price|prices|pricing|cost|costs|how much|fees?|quote|estimate|charge|charges|expensive|affordable)\b|\$/i;
const HOURS = /\b(hours?|open|close[sd]?|business hours)\b|\b(when|what time).{0,25}\b(office|practice)\b|\bwhat days (?:are you|do you work)\b/i;
const MEDICAL = /\b(pain|painful|toothache|toothaches|hurt|hurts|hurting|ache|aching|swelling|swollen|infection|infected|bleeding|bled|abscess|broken tooth|chipped tooth|cracked tooth|emergency|emergencies|diagnosis|diagnose|diagnosed|diagnostic|symptoms?|medication|medicine|antibiotics?|pregnant|pregnancy|safe|safety|side effects?|recovery|recover|numb|numbness)\b|\b(is (?:it|this|that) normal|am i (?:a candidate|eligible)|which treatment is (?:right|best) for me|do i need (?:a |an )?(?:root canal|filling|crown|implant|extraction|braces)|should i (?:take|stop|remove))\b/i;
const QUESTION = /\?|^(what|when|where|why|how|could|would|do|does|did|is|are|which|tell me|i wonder)\b|^(can|will)\s+(you|i|it|this|that|the|my)\b/i;
const EMAIL = /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+/i;
const PHONE = /\+?\(?\d[\d\s().-]{7,}\d/;
const FALLBACKS = [
  "I can help with Invisalign, implants, veneers, whitening, general dentistry, or office details. What would you like to know?",
  "I don't have that information in this demo. You can ask about a treatment, pricing, insurance, or office hours, or I can help you request a consultation for the team to follow up.",
  "Could you rephrase that, or tell me which treatment interests you? You can also say 'request a consultation' and I'll help you get started.",
];
const MEDICAL_DEFLECTION = "Our dental team needs to evaluate medical questions directly. I can't assess symptoms or recommend treatment here.";
const CONSULT_PROMPT = "Would you like me to help you request a consultation?";

function isNegative(text: string) {
  // 'No problem' is an agreement, whereas 'No, please' is still a decline.
  return !/^no problem\b/i.test(text) && (NEGATIVE.test(text) || CANCEL.test(text));
}

function extractContact(text: string): string | undefined {
  const email = text.match(EMAIL)?.[0];
  if (email) return email;
  const phone = text.match(PHONE)?.[0];
  const digits = phone?.replace(/\D/g, "").length ?? 0;
  return digits >= 10 && digits <= 15 ? phone : undefined;
}

export class DemoAIService implements AIService {
  initialState(): ConversationState {
    return { stage: "exploring", askedPricing: false, questionCount: 0, draft: {} };
  }

  greeting(): string {
    return `Hi! I'm the AI receptionist for ${practice.name}. I can answer questions about our treatments, hours, or help you request a consultation. What can I help you with?`;
  }

  respond(state: ConversationState, userMessageRaw: string): AIReply {
    const userMessage = userMessageRaw.trim();
    const text = normalizeText(userMessage);
    const next: ConversationState = { ...state, draft: { ...state.draft } };

    // Contact details can contain ordinary keywords (e.g. pain@example.com).
    // Explicit contact answers take priority over classification.
    if (next.stage === "awaiting_contact") {
      const contact = extractContact(userMessage);
      const contactAnswer = userMessage.replace(/^(?:(?:my )?(?:email(?: address)?|phone(?: number)?|number)(?: is|:)?|(?:you can )?reach me at|call me(?: at)?)\s+/i, "").replace(/[.!]$/, "");
      if (contact && contactAnswer === contact) {
        return this.handleAwaitingContact(next, userMessage);
      }
    }

    if (MEDICAL.test(text)) {
      const followUp = this.pendingPrompt(next.stage) ?? (next.stage === "completed" ? "Please discuss this with the dental team directly." : CONSULT_PROMPT);
      if (next.stage === "exploring") next.stage = "offer_consult";
      return { message: `${MEDICAL_DEFLECTION} ${followUp}`, state: next, leadReady: false };
    }

    if (next.stage.startsWith("awaiting_")) {
      if (isNegative(text)) {
        next.stage = "exploring";
        next.draft = {};
        return { message: "No problem. I've stopped this request. You can keep asking questions or start a new consultation request whenever you're ready.", state: next, leadReady: false };
      }
      if (next.stage === "awaiting_name" && /^(?:my name is|the name is|i am|i['’]m|it's|it is|this is)\s+/i.test(userMessage)) {
        return this.handleAwaitingName(next, userMessage);
      }

      // Answer side questions without treating them as a name or preference.
      // A plain 'Saturday' or 'morning' must still be accepted as a preference.
      const answer = this.answerQuestion(next, text);
      if (answer || QUESTION.test(text)) {
        next.questionCount += 1;
        return {
          message: `${answer ?? "I don't have that information here, but the team can help when they follow up."} ${this.pendingPrompt(next.stage)}`,
          state: next,
          leadReady: false,
        };
      }
    }

    switch (next.stage) {
      case "exploring":
        return this.handleExploring(next, text);
      case "offer_consult":
        return this.handleOfferConsult(next, text);
      case "awaiting_name":
        return this.handleAwaitingName(next, userMessage);
      case "awaiting_contact":
        return this.handleAwaitingContact(next, userMessage);
      case "awaiting_day":
        if (text.length < 2) return this.repeatPrompt(next);
        next.draft.day = userMessage;
        next.stage = "awaiting_time";
        return this.repeatPrompt(next);
      case "awaiting_time":
        if (text.length < 2) return this.repeatPrompt(next);
        next.draft.time = userMessage;
        next.stage = "completed";
        return {
          message: `I've captured your consultation request and preferred time. This is not a confirmed appointment. A member of the ${practice.name} team will follow up to confirm availability and details.`,
          state: next,
          leadReady: true,
        };
      case "completed":
        return {
          message: this.answerQuestion(next, text) ?? "Your consultation request has already been captured. The team still needs to confirm availability and details; this is not a confirmed appointment.",
          state: next,
          leadReady: false,
        };
    }
  }

  private handleExploring(state: ConversationState, text: string): AIReply {
    state.questionCount += 1;
    const treatment = findTreatmentByKeyword(text);
    if (treatment) state.treatmentInterest = treatment.name;

    if (!isNegative(text) && BOOKING_REQUEST.test(text) && !PRICING.test(text) && !HOURS.test(text)) {
      return this.startRequest(state);
    }

    const answer = this.answerQuestion(state, text, false);
    if (answer) {
      if (PRICING.test(text)) {
        state.stage = "offer_consult";
        return { message: `${answer} ${CONSULT_PROMPT}`, state, leadReady: false };
      }
      return { message: answer, state, leadReady: false };
    }

    if (isNegative(text)) {
      return { message: "No problem. Feel free to ask about treatments, office hours, or a consultation whenever you're ready.", state, leadReady: false };
    }
    if (BOOKING_REQUEST.test(text)) return this.startRequest(state);

    if (treatment) {
      state.stage = "offer_consult";
      return { message: `${treatment.shortDescription} Our team can discuss the details specific to you. ${CONSULT_PROMPT}`, state, leadReady: false };
    }
    if (/^(hi|hello|hey|good (?:morning|afternoon|evening))[!. ]*$/.test(text)) {
      return { message: this.greeting(), state, leadReady: false };
    }
    if (/^(thanks|thank you|thank you so much)[!. ]*$/.test(text)) {
      return { message: "You're welcome! Let me know if you have another question or would like to request a consultation.", state, leadReady: false };
    }
    if (/^(saturday|sunday|weekend)[?!. ]*$/.test(text)) {
      return { message: hoursSummary(), state, leadReady: false };
    }
    return { message: FALLBACKS[(state.questionCount - 1) % FALLBACKS.length], state, leadReady: false };
  }

  private handleOfferConsult(state: ConversationState, text: string): AIReply {
    if (isNegative(text)) {
      state.stage = "exploring";
      return { message: "No problem at all. Let me know if you have another question or would like to request a consultation later.", state, leadReady: false };
    }

    // A 'yes, but how much?' still needs a pricing answer before collecting data.
    const treatment = findTreatmentByKeyword(text);
    if (treatment) state.treatmentInterest = treatment.name;
    if (BOOKING_REQUEST.test(text) && !PRICING.test(text) && !HOURS.test(text)) {
      return this.startRequest(state);
    }
    const answer = this.answerQuestion(state, text, false);
    if (answer) {
      state.questionCount += 1;
      return { message: `${answer} ${CONSULT_PROMPT}`, state, leadReady: false };
    }
    if (AFFIRMATIVE.test(text) || /^no problem\b/.test(text) || BOOKING_REQUEST.test(text)) {
      return this.startRequest(state);
    }
    return this.handleExploring({ ...state, stage: "exploring" }, text);
  }

  /** Only known information is answered; prices and clinical advice stay with staff. */
  private answerQuestion(state: ConversationState, text: string, includeTreatment = true): string | undefined {
    const treatment = findTreatmentByKeyword(text);
    if (PRICING.test(text)) {
      state.askedPricing = true;
      if (treatment) state.treatmentInterest = treatment.name;
      const subject = state.treatmentInterest && state.treatmentInterest !== "General Consultation" ? `${state.treatmentInterest} pricing` : "Pricing";
      return `${subject} depends on your individual treatment plan. I don't have a verified price or estimate to share. Our team can evaluate your needs and provide accurate pricing at a consultation.`;
    }
    if (HOURS.test(text)) return hoursSummary();
    const faq = findFaqAnswer(text);
    // The day preference is not a question about office hours.
    if (faq && (faq.id !== "saturday" || !state.stage.startsWith("awaiting_") || QUESTION.test(text))) return faq.answer;
    if (includeTreatment && treatment) {
      state.treatmentInterest = treatment.name;
      return `${treatment.shortDescription} Our team can discuss the details specific to you.`;
    }
    return undefined;
  }

  private startRequest(state: ConversationState): AIReply {
    state.stage = "awaiting_name";
    state.treatmentInterest ??= "General Consultation";
    return { message: "I'd be happy to help you request a consultation. What's your name?", state, leadReady: false };
  }

  private handleAwaitingName(state: ConversationState, text: string): AIReply {
    const name = text.replace(/^(?:my name is|the name is|i am|i['’]m|it's|it is|this is)\s+/i, "").replace(/[.!]+$/, "").trim();
    if (!/^[\p{L}][\p{L}\p{M}'’. -]{1,79}$/u.test(name) || AFFIRMATIVE.test(normalizeText(name))) {
      return { message: "Could you share your name so I can prepare your consultation request?", state, leadReady: false };
    }
    state.draft.name = name;
    state.stage = "awaiting_contact";
    return { message: `Nice to meet you, ${name.split(/\s+/)[0]}. ${this.pendingPrompt(state.stage)}`, state, leadReady: false };
  }

  private handleAwaitingContact(state: ConversationState, text: string): AIReply {
    const contact = extractContact(text);
    if (!contact) {
      return { message: "Please share an email address (like alex@example.com) or a phone number with an area code so our team can reach you.", state, leadReady: false };
    }
    state.draft.contact = contact;
    state.stage = "awaiting_day";
    return this.repeatPrompt(state);
  }

  private repeatPrompt(state: ConversationState): AIReply {
    return { message: this.pendingPrompt(state.stage) ?? this.greeting(), state, leadReady: false };
  }

  private pendingPrompt(stage: ConversationStage): string | undefined {
    switch (stage) {
      case "awaiting_name": return "What's your name?";
      case "awaiting_contact": return "What's the best phone number or email for our team to reach you?";
      case "awaiting_day": return "What day would generally work best for a consultation?";
      case "awaiting_time": return "Do you generally prefer morning or afternoon?";
      case "offer_consult": return CONSULT_PROMPT;
      default: return undefined;
    }
  }
}

export const demoAIService = new DemoAIService();
