import type { AIService } from "./AIService";
import type { ConversationState, AIReply, ConversationStage } from "./types";
import { practice, hoursSummary, findTreatmentByKeyword, findFaqAnswer, treatmentName, treatmentDescription } from "@/lib/knowledge-base";
import { normalizeText } from "@/lib/knowledge-base/matchKeywords";
import type { Locale } from "@/lib/i18n/types";

const AFFIRMATIVE = /^(yes|yeah|yep|yup|sure|ok(?:ay)?|sounds good|please do|please|correct|go ahead|definitely|of course|let's do it|that works|that would be great|i'd love to|absolutely|si|claro|por favor|de acuerdo|adelante|perfecto|me parece bien|dale|por supuesto)\b/i;
const NEGATIVE = /^(no(?:\s+(?:thanks|thank you|please|gracias))?|nah|nope|not now|not yet|maybe later|not really|just (?:looking|browsing)|i'm just (?:looking|browsing)|i(?:'m| am) not ready|ahora no|todavia no|quizas despues|tal vez luego|mas tarde|solo (?:estoy )?(?:mirando|viendo|averiguando))\b/i;
const CANCEL = /\b(cancel (?:this|my|the) request|stop (?:this|the) request|don't want to (?:book|schedule)|do not want to (?:book|schedule)|cancel(?:a|ar|o) (?:esta |mi |la )?(?:solicitud|consulta|cita)|no quiero (?:reservar|agendar|solicitar))\b/i;
const BOOKING_REQUEST = /\b(?:book|schedule|arrange|reserve|request|set up|make|get|need|want|would like|i'd like|help me with|solicitar|solicito|agendar|reservar|quiero|quisiera|necesito|me gustaria|pedir|sacar)\b.{0,45}\b(?:appointment|consultation|consult|visit|cita|consulta|turno|visita)\b|\b(?:book|schedule|agendar|reservar)\b|\b(?:come in|see a dentist|see the dentist|meet the dentist|available appointments?|available slots?|availability|an opening|disponibilidad|ver (?:a |al |a un )?dentista)\b|^(?:appointment|consultation|consulta|cita|turno)(?:\s+(?:please|now|por favor))?[.!?]*$/i;
const PRICING = /\b(price|prices|pricing|cost|costs|how much|fees?|quote|estimate|charge|charges|expensive|affordable|precio|precios|costo|costos|cuesta|cuestan|presupuesto|cotizacion|tarifa|caro|barato)\b|\bcuanto (?:es|sale|vale|cobran)\b|^cuanto[?!. ]*$|\$/i;
const HOURS = /\b(hours?|open|close[sd]?|business hours|horario|horarios|abren|abre|abierto|abiertos|abierta|abiertas|cierran|cierra|cerrado|cerrados)\b|\b(when|what time).{0,25}\b(office|practice)\b|\bwhat days (?:are you|do you work)\b|\bque dias (?:atienden|trabajan)\b/i;
const MEDICAL = /\b(pain|painful|toothache|toothaches|hurt|hurts|hurting|ache|aching|swelling|swollen|infection|infected|bleeding|bled|abscess|broken tooth|chipped tooth|cracked tooth|emergency|emergencies|diagnosis|diagnose|diagnosed|diagnostic|symptoms?|medication|medicine|antibiotics?|pregnant|pregnancy|safe|safety|side effects?|recovery|recover|numb|numbness)\b|\b(is (?:it|this|that) normal|am i (?:a candidate|eligible)|which treatment is (?:right|best) for me|do i need (?:a |an )?(?:root canal|filling|crown|implant|extraction|braces)|should i (?:take|stop|remove))\b/i;
const MEDICAL_ES = /\b(dolor|duele|duelen|hinchazon|hinchado|inflamacion|infeccion|infectado|sangrado|sangra|absceso|urgencia|emergencia|diagnostico|diagnosticar|sintomas?|medicamento|medicacion|antibiotico|antibioticos|embarazo|embarazada|efectos secundarios|recuperacion|anestesia|diente roto|muela rota|es seguro|es normal|soy candidat[oa]|que (?:debo|puedo) tomar|necesito (?:una |un )?(?:endodoncia|extraccion|implante))\b/i;
const QUESTION = /[¿?]|^(what|when|where|why|how|could|would|do|does|did|is|are|which|tell me|i wonder|que|cuando|donde|por que|como|cual|cuales|tienen|aceptan|ofrecen|pueden|puedo)\b|^(can|will)\s+(you|i|it|this|that|the|my)\b/i;
const EMAIL = /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+/i;
const PHONE = /\+?\(?\d[\d\s().-]{7,}\d/;
const FALLBACKS = [
  "I can help with Invisalign, implants, veneers, whitening, general dentistry, or office details. What would you like to know?",
  "I don't have that information in this demo. You can ask about a treatment, pricing, insurance, or office hours, or try a fictional consultation request.",
  "Could you rephrase that, or tell me which treatment interests you? You can also say 'request a consultation' and I'll help you get started.",
];
const FALLBACKS_ES = [
  "Puedo ayudarte con Invisalign, implantes, carillas, blanqueamiento, odontología general o información de la clínica. ¿Qué te gustaría saber?",
  "No tengo esa información en esta demo. Puedes preguntar por tratamientos, precios, seguros u horarios, o probar una solicitud de consulta ficticia.",
  "¿Podrías reformular tu pregunta o decirme qué tratamiento te interesa? También puedes escribir 'solicitar una consulta' para comenzar.",
];
const MEDICAL_DEFLECTION = "Our dental team needs to evaluate medical questions directly. I can't assess symptoms or recommend treatment here. For an emergency, call 911 in the US or your local emergency number; this demo is not monitored.";
const CONSULT_PROMPT = "Would you like me to help you request a consultation?";

function isNegative(text: string) {
  // 'No problem' is an agreement, whereas 'No, please' is still a decline.
  return !/^no (?:problem|hay problema)\b/i.test(text) && (NEGATIVE.test(text) || CANCEL.test(text));
}

function extractContact(text: string): string | undefined {
  const email = text.match(EMAIL)?.[0];
  if (email) return email;
  const phone = text.match(PHONE)?.[0];
  const digits = phone?.replace(/\D/g, "").length ?? 0;
  return digits >= 10 && digits <= 15 ? phone : undefined;
}

export class DemoAIService implements AIService {
  constructor(private readonly locale: Locale = "en") {}

  private t(english: string, spanish: string): string {
    return this.locale === "es" ? spanish : english;
  }

  private get consultPrompt(): string {
    return this.t(CONSULT_PROMPT, "¿Quieres que te ayude a solicitar una consulta?");
  }

  initialState(): ConversationState {
    return { stage: "exploring", askedPricing: false, questionCount: 0, draft: {} };
  }

  greeting(): string {
    return this.t(`Hi! I'm the AI receptionist for ${practice.name}. I can answer questions about our treatments, hours, or help you request a consultation. What can I help you with?`, `¡Hola! Soy el recepcionista virtual de ${practice.name}. Puedo responder preguntas sobre tratamientos, horarios o ayudarte a solicitar una consulta. ¿En qué puedo ayudarte?`);
  }

  respond(state: ConversationState, userMessageRaw: string): AIReply {
    const userMessage = userMessageRaw.trim();
    const text = normalizeText(userMessage);
    const next: ConversationState = { ...state, draft: { ...state.draft } };

    // Contact details can contain ordinary keywords (e.g. pain@example.com).
    // Explicit contact answers take priority over classification.
    if (next.stage === "awaiting_contact") {
      const contact = extractContact(userMessage);
      const contactAnswer = userMessage.replace(/^(?:(?:my )?(?:email(?: address)?|phone(?: number)?|number)(?: is|:)?|(?:you can )?reach me at|call me(?: at)?|(?:mi )?(?:correo(?: electrónico)?|email|teléfono|telefono|número|numero)(?: es|:)?|pueden contactarme en)\s+/i, "").replace(/[.!]$/, "");
      if (contact && contactAnswer === contact) {
        return this.handleAwaitingContact(next, userMessage);
      }
    }

    if (MEDICAL.test(text) || MEDICAL_ES.test(text)) {
      const followUp = this.pendingPrompt(next.stage) ?? (next.stage === "completed" ? this.t("Please discuss this with the dental team directly.", "Consulta esto directamente con el equipo dental.") : this.consultPrompt);
      if (next.stage === "exploring") next.stage = "offer_consult";
      return { message: `${this.t(MEDICAL_DEFLECTION, "El equipo dental debe evaluar las preguntas médicas directamente. No puedo evaluar síntomas ni recomendar tratamientos aquí. En una emergencia, llama al 911 en EE. UU. o al número local; esta demo no está monitoreada.")} ${followUp}`, state: next, leadReady: false };
    }

    if (next.stage.startsWith("awaiting_")) {
      if (isNegative(text)) {
        next.stage = "exploring";
        next.draft = {};
        return { message: this.t("No problem. I've stopped this request. You can keep asking questions or start a new consultation request whenever you're ready.", "No hay problema. Cancelé esta solicitud. Puedes seguir haciendo preguntas o iniciar otra solicitud de consulta cuando quieras."), state: next, leadReady: false };
      }
      if (next.stage === "awaiting_name" && /^(?:my name is|the name is|i am|i['’]m|it's|it is|this is|me llamo|mi nombre es|soy)\s+/i.test(userMessage)) {
        return this.handleAwaitingName(next, userMessage);
      }

      // Answer side questions without treating them as a name or preference.
      // A plain 'Saturday' or 'morning' must still be accepted as a preference.
      const answer = this.answerQuestion(next, text);
      if (answer || QUESTION.test(text)) {
        next.questionCount += 1;
        return {
          message: `${answer ?? this.t("I don't have that information here, but the team can help when they follow up.", "No tengo esa información aquí, pero el equipo puede ayudarte cuando te contacte.")} ${this.pendingPrompt(next.stage)}`,
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
          message: this.t("I've captured your demo consultation request and preferred time in this browser. This is not a confirmed appointment and no request is sent to a clinic. In real use, the dental team would follow up to confirm availability and details.", "Registré tu solicitud de prueba y tu horario preferido en este navegador. No es una cita confirmada y no se envía a una clínica. En un uso real, el equipo dental te contactaría para confirmar la disponibilidad y los detalles."),
          state: next,
          leadReady: true,
        };
      case "completed":
        return {
          message: this.answerQuestion(next, text) ?? this.t("Your demo request has already been captured in this browser. No clinic receives it; this is not a confirmed appointment.", "Tu solicitud de prueba ya está registrada en este navegador. Ninguna clínica la recibe; no es una cita confirmada."),
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
        return { message: `${answer} ${this.consultPrompt}`, state, leadReady: false };
      }
      return { message: answer, state, leadReady: false };
    }

    if (isNegative(text)) {
      return { message: this.t("No problem. Feel free to ask about treatments, office hours, or a consultation whenever you're ready.", "No hay problema. Puedes preguntar por tratamientos, horarios o una consulta cuando quieras."), state, leadReady: false };
    }
    if (BOOKING_REQUEST.test(text)) return this.startRequest(state);

    if (treatment) {
      state.stage = "offer_consult";
      return { message: `${treatmentDescription(treatment, this.locale)} ${this.t("Our team can discuss the details specific to you.", "Nuestro equipo puede explicarte los detalles de tu caso.")} ${this.consultPrompt}`, state, leadReady: false };
    }
    if (/^(hi|hello|hey|hola|buenas|buenos dias|buenas tardes|buenas noches|good (?:morning|afternoon|evening))[!. ]*$/.test(text)) {
      return { message: this.greeting(), state, leadReady: false };
    }
    if (/^(thanks|thank you|thank you so much|gracias|muchas gracias)[!. ]*$/.test(text)) {
      return { message: this.t("You're welcome! Let me know if you have another question or would like to request a consultation.", "¡De nada! Dime si tienes otra pregunta o si quieres solicitar una consulta."), state, leadReady: false };
    }
    if (/^(saturday|sunday|weekend|sabado|sabados|domingo|domingos|fin de semana)[?!. ]*$/.test(text)) {
      return { message: hoursSummary(this.locale), state, leadReady: false };
    }
    return { message: (this.locale === "es" ? FALLBACKS_ES : FALLBACKS)[(state.questionCount - 1) % FALLBACKS.length], state, leadReady: false };
  }

  private handleOfferConsult(state: ConversationState, text: string): AIReply {
    if (isNegative(text)) {
      state.stage = "exploring";
      return { message: this.t("No problem at all. Let me know if you have another question or would like to request a consultation later.", "No hay problema. Dime si tienes otra pregunta o si quieres solicitar una consulta más adelante."), state, leadReady: false };
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
      return { message: `${answer} ${this.consultPrompt}`, state, leadReady: false };
    }
    if (AFFIRMATIVE.test(text) || /^no (?:problem|hay problema)\b/.test(text) || BOOKING_REQUEST.test(text)) {
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
      const subjectEs = state.treatmentInterest && state.treatmentInterest !== "General Consultation" ? `El precio de ${treatmentName(state.treatmentInterest, "es")}` : "El precio";
      return this.t(`${subject} depends on your individual treatment plan. I don't have a verified price or estimate to share. Our team can evaluate your needs and provide accurate pricing at a consultation.`, `${subjectEs} depende de tu plan de tratamiento. No tengo un precio ni un presupuesto verificado para compartir. Nuestro equipo puede evaluar tus necesidades e informarte el precio en una consulta.`);
    }
    if (HOURS.test(text)) return hoursSummary(this.locale);
    const faq = findFaqAnswer(text);
    // The day preference is not a question about office hours.
    if (faq && (faq.id !== "saturday" || !state.stage.startsWith("awaiting_") || QUESTION.test(text))) return this.t(faq.answer, faq.answerEs);
    if (includeTreatment && treatment) {
      state.treatmentInterest = treatment.name;
      return `${treatmentDescription(treatment, this.locale)} ${this.t("Our team can discuss the details specific to you.", "Nuestro equipo puede explicarte los detalles de tu caso.")}`;
    }
    return undefined;
  }

  private startRequest(state: ConversationState): AIReply {
    state.stage = "awaiting_name";
    state.treatmentInterest ??= "General Consultation";
    return { message: this.t("I'd be happy to help you request a consultation. What's your name?", "Con gusto te ayudo a solicitar una consulta. ¿Cómo te llamas?"), state, leadReady: false };
  }

  private handleAwaitingName(state: ConversationState, text: string): AIReply {
    const name = text.replace(/^(?:my name is|the name is|i am|i['’]m|it's|it is|this is|me llamo|mi nombre es|soy)\s+/i, "").replace(/[.!]+$/, "").trim();
    if (!/^[\p{L}][\p{L}\p{M}'’. -]{1,79}$/u.test(name) || AFFIRMATIVE.test(normalizeText(name))) {
      return { message: this.t("Could you share your name so I can prepare your consultation request?", "¿Puedes decirme tu nombre para preparar la solicitud de consulta?"), state, leadReady: false };
    }
    state.draft.name = name;
    state.stage = "awaiting_contact";
    return { message: `${this.t("Nice to meet you", "Mucho gusto")}, ${name.split(/\s+/)[0]}. ${this.pendingPrompt(state.stage)}`, state, leadReady: false };
  }

  private handleAwaitingContact(state: ConversationState, text: string): AIReply {
    const contact = extractContact(text);
    if (!contact) {
      return { message: this.t("Please share a demo email (like alex@example.com) or a phone number with an area code. The next step lets you choose fictional details or optional verification.", "Comparte un correo de prueba (como alex@example.com) o un teléfono con código de área. Después podrás elegir datos ficticios o una verificación opcional."), state, leadReady: false };
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
      case "awaiting_name": return this.t("What's your name?", "¿Cómo te llamas?");
      case "awaiting_contact": return this.t("What email or phone number would you like to use for this demo? You can use alex@example.com. Nothing is sent without your permission in the next step.", "¿Qué correo o teléfono quieres usar en esta demo? Puedes usar alex@example.com. No se envía nada sin tu permiso en el siguiente paso.");
      case "awaiting_day": return this.t("What day would generally work best for a consultation?", "¿Qué día te vendría mejor para una consulta?");
      case "awaiting_time": return this.t("Do you generally prefer morning or afternoon?", "¿Prefieres por la mañana o por la tarde?");
      case "offer_consult": return this.consultPrompt;
      default: return undefined;
    }
  }
}

export const demoAIService = new DemoAIService();
