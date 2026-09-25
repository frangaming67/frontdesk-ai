import assert from "node:assert/strict";
import test from "node:test";
import { DemoAIService } from "../lib/ai/DemoAIService";
import type { ConversationStage, ConversationState } from "../lib/ai/types";
import { findTreatmentByKeyword } from "../lib/knowledge-base/treatments";

const service = new DemoAIService();

function atStage(stage: ConversationStage): ConversationState {
  return { ...service.initialState(), stage };
}

test("handles natural treatment variants without substring matches", () => {
  for (const [phrase, expected] of [
    ["I’m interested in invisible braces", "Invisalign"],
    ["I want whiter teeth", "Teeth Whitening"],
    ["What about a check-up?", "General Dentistry"],
    ["I'd like to replace a tooth", "Dental Implants"],
  ]) {
    const reply = service.respond(service.initialState(), phrase);
    assert.equal(reply.state.treatmentInterest, expected, phrase);
    assert.equal(reply.state.stage, "offer_consult", phrase);
  }
  assert.equal(findTreatmentByKeyword("This sounds fulfilling"), undefined);
  assert.equal(findTreatmentByKeyword("Can you explain the straightener?"), undefined);
});

test("pricing questions always defer to staff without inventing an amount", () => {
  for (const phrase of ["How much?", "Can I get an estimate?", "What's the fee for a consultation?", "Is Invisalign expensive?", "Do implants cost $100?"]) {
    const reply = service.respond(service.initialState(), phrase);
    assert.equal(reply.state.askedPricing, true, phrase);
    assert.equal(reply.state.stage, "offer_consult", phrase);
    assert.match(reply.message, /don't have a verified price or estimate/);
    assert.doesNotMatch(reply.message, /\$|\d/);
  }
});

test("booking requests advance from both discovery and the consultation offer", () => {
  for (const stage of ["exploring", "offer_consult"] as const) {
    for (const phrase of ["I'd like to book a visit", "Can I schedule a cleaning?", "Can I see a dentist?", "Do you have any availability?", "Book Invisalign", "I’d like an appointment", "Can I book a Saturday consultation?", "I'd like to book my first visit"]) {
      const reply = service.respond(atStage(stage), phrase);
      assert.equal(reply.state.stage, "awaiting_name", `${stage}: ${phrase}`);
      assert.match(reply.message, /What's your name/);
      assert.equal(reply.leadReady, false);
    }
  }
});

test("polite declines never count as consent", () => {
  for (const phrase of ["No thanks, please", "No, please don't", "I'm not ready", "Maybe later", "I don't want to book"]) {
    const reply = service.respond(atStage("offer_consult"), phrase);
    assert.equal(reply.state.stage, "exploring", phrase);
    assert.deepEqual(reply.state.draft, {});
  }
  assert.equal(service.respond(atStage("offer_consult"), "Let’s do it").state.stage, "awaiting_name");
});

test("yes with a follow-up question answers it before gathering details", () => {
  const reply = service.respond(atStage("offer_consult"), "Yes, but how much does it cost?");
  assert.equal(reply.state.stage, "offer_consult");
  assert.equal(reply.state.askedPricing, true);
  assert.match(reply.message, /verified price/);
});

test("medical questions hand off to staff at every stage", () => {
  const stages: ConversationStage[] = ["exploring", "offer_consult", "awaiting_name", "awaiting_contact", "awaiting_day", "awaiting_time", "completed"];
  for (const stage of stages) {
    for (const phrase of ["I have a toothache", "I'm in pain", "My email is alex@example.com and I'm in pain", "Am I a candidate for Invisalign?", "Can you diagnose this?", "Is it safe while pregnant?", "What antibiotics should I take?"]) {
      const original = { ...atStage(stage), draft: { name: "Alex" } };
      const reply = service.respond(original, phrase);
      assert.match(reply.message, /dental team needs to evaluate medical questions/);
      assert.deepEqual(reply.state.draft, original.draft);
      assert.equal(reply.state.stage, stage === "exploring" ? "offer_consult" : stage);
      assert.equal(reply.leadReady, false);
    }
  }
});

test("business questions don't overwrite the field being collected", () => {
  for (const stage of ["awaiting_name", "awaiting_contact", "awaiting_day", "awaiting_time"] as const) {
    for (const phrase of ["Are you open Saturday?", "How much does whitening cost?", "Do you take insurance?", "Where's your office?", "What is parking like?"]) {
      const state = { ...atStage(stage), draft: { name: "Alex" } };
      const reply = service.respond(state, phrase);
      assert.equal(reply.state.stage, stage, phrase);
      assert.deepEqual(reply.state.draft, state.draft, phrase);
      assert.equal(reply.leadReady, false);
    }
  }
});

test("captures the name rather than its introduction", () => {
  for (const [phrase, name] of [["My name is María Pérez", "María Pérez"], ["I'm Will Price", "Will Price"], ["Will Smith", "Will Smith"]]) {
    const reply = service.respond(atStage("awaiting_name"), phrase);
    assert.equal(reply.state.draft.name, name);
    assert.equal(reply.state.stage, "awaiting_contact");
  }
});

test("does not accept arbitrary text or incomplete numbers as contact details", () => {
  for (const phrase of ["not-an-email", "hello", "12345", "alex@", "alex@example", "555-0142"]) {
    const reply = service.respond(atStage("awaiting_contact"), phrase);
    assert.equal(reply.state.stage, "awaiting_contact", phrase);
    assert.equal(reply.state.draft.contact, undefined, phrase);
  }
  for (const phrase of ["alex@example.com", "pain@example.com", "+1 (305) 555-0142", "(305) 555-0142", "My email is alex@example.com."]) {
    const reply = service.respond(atStage("awaiting_contact"), phrase);
    assert.equal(reply.state.stage, "awaiting_day", phrase);
    assert.ok(reply.state.draft.contact);
  }
});

test("records a complete request once and does not confirm an appointment", () => {
  let state = service.initialState();
  const messages = ["I'd like to schedule an Invisalign consultation", "My name is Alex Rivera", "alex@example.com", "Saturday", "Afternoon"];
  for (const [index, message] of messages.entries()) {
    const reply = service.respond(state, message);
    state = reply.state;
    assert.equal(reply.leadReady, index === messages.length - 1, message);
    if (reply.leadReady) assert.match(reply.message, /not a confirmed appointment/);
  }
  assert.equal(state.stage, "completed");
  assert.equal(state.treatmentInterest, "Invisalign");
  assert.deepEqual(state.draft, { name: "Alex Rivera", contact: "alex@example.com", day: "Saturday", time: "Afternoon" });
  assert.equal(service.respond(state, "Thank you").leadReady, false);
  assert.match(service.respond(state, "Is my appointment confirmed?").message, /not a confirmed appointment/);
});

test("canceling collection clears an unfinished request", () => {
  const state = { ...atStage("awaiting_day"), draft: { name: "Alex", contact: "alex@example.com" } };
  const reply = service.respond(state, "Cancel my request");
  assert.equal(reply.state.stage, "exploring");
  assert.deepEqual(reply.state.draft, {});
  assert.equal(reply.leadReady, false);
  assert.deepEqual(state.draft, { name: "Alex", contact: "alex@example.com" });
});

test("fallbacks vary and keep unknown topics unclaimed", () => {
  let state = service.initialState();
  const messages = new Set<string>();
  for (let i = 0; i < 3; i += 1) {
    const reply = service.respond(state, "Tell me about something unknown");
    state = reply.state;
    messages.add(reply.message);
    assert.equal(reply.leadReady, false);
  }
  assert.equal(messages.size, 3);
});

test("Spanish conversation captures accented names and preferences without confirming an appointment", () => {
  const spanish = new DemoAIService("es");
  assert.match(spanish.greeting(), /¡Hola!/);
  let state = spanish.initialState();
  const messages = ["Me interesa Invisalign. ¿Cuánto cuesta?", "Sí, solicitar una consulta", "Me llamo María Pérez", "Mi correo es maria@example.com", "Miércoles", "Por la tarde"];
  for (const [index, message] of messages.entries()) {
    const reply = spanish.respond(state, message);
    state = reply.state;
    assert.equal(reply.leadReady, index === messages.length - 1, message);
    if (reply.leadReady) assert.match(reply.message, /No es una cita confirmada/);
  }
  assert.equal(state.stage, "completed");
  assert.equal(state.treatmentInterest, "Invisalign");
  assert.equal(state.askedPricing, true);
  assert.deepEqual(state.draft, { name: "María Pérez", contact: "maria@example.com", day: "Miércoles", time: "Por la tarde" });
  assert.equal(spanish.respond(state, "Gracias").leadReady, false);
});

test("Spanish prices and medical questions preserve the same safety boundaries", () => {
  const spanish = new DemoAIService("es");
  for (const phrase of ["¿Cuánto cuestan los implantes?", "¿Me dan un presupuesto?", "¿Invisalign cuesta $100?", "Cuanto sale una consulta"]) {
    const reply = spanish.respond(spanish.initialState(), phrase);
    assert.match(reply.message, /No tengo un precio ni un presupuesto verificado/);
    assert.doesNotMatch(reply.message, /\$|\d/);
    assert.equal(reply.state.askedPricing, true);
  }
  for (const stage of ["exploring", "offer_consult", "awaiting_name", "awaiting_contact", "awaiting_day", "awaiting_time", "completed"] as const) {
    for (const phrase of ["Me duele una muela", "Tengo una infección", "¿Es seguro si estoy embarazada?", "¿Qué antibiótico tomo?", "Mi correo es alex@example.com y tengo dolor"]) {
      const original = { ...atStage(stage), draft: { name: "María" } };
      const reply = spanish.respond(original, phrase);
      assert.match(reply.message, /equipo dental debe evaluar/);
      assert.deepEqual(reply.state.draft, original.draft);
      assert.equal(reply.leadReady, false);
    }
  }
});

test("Spanish side questions do not overwrite patient details or preferences", () => {
  const spanish = new DemoAIService("es");
  for (const stage of ["awaiting_name", "awaiting_contact", "awaiting_day", "awaiting_time"] as const) {
    for (const phrase of ["¿Abren los sábados?", "Aceptan seguro?", "¿Cuál es su dirección?", "¿Cuánto cuesta el blanqueamiento?", "¿Hay estacionamiento?"]) {
      const original = { ...atStage(stage), draft: { name: "María" } };
      const reply = spanish.respond(original, phrase);
      assert.equal(reply.state.stage, stage, phrase);
      assert.deepEqual(reply.state.draft, original.draft, phrase);
      assert.equal(reply.leadReady, false);
    }
  }
  const insurance = spanish.respond(spanish.initialState(), "¿Aceptan seguro dental?");
  assert.match(insurance.message, /cobertura/);
  assert.doesNotMatch(insurance.message, /preguntas médicas/);
});

test("Spanish declines and cancellation never start or complete a request", () => {
  const spanish = new DemoAIService("es");
  for (const phrase of ["No, gracias", "Ahora no", "Solo estoy mirando", "Más tarde", "No quiero reservar"]) {
    assert.equal(spanish.respond(atStage("offer_consult"), phrase).state.stage, "exploring", phrase);
  }
  assert.equal(spanish.respond(atStage("offer_consult"), "No hay problema").state.stage, "awaiting_name");
  const canceled = spanish.respond({ ...atStage("awaiting_day"), draft: { name: "María", contact: "maria@example.com" } }, "Cancelar mi solicitud");
  assert.equal(canceled.state.stage, "exploring");
  assert.deepEqual(canceled.state.draft, {});
  assert.equal(canceled.leadReady, false);
});

test("switching response language preserves the conversation state and canonical treatment", () => {
  const spanish = new DemoAIService("es");
  let reply = spanish.respond(spanish.initialState(), "Quiero solicitar una consulta por implantes");
  assert.equal(reply.state.treatmentInterest, "Dental Implants");
  reply = service.respond(reply.state, "Soy José López");
  assert.match(reply.message, /Nice to meet you, José/);
  assert.equal(reply.state.draft.name, "José López");
  reply = spanish.respond(reply.state, "Mi correo es dolor@example.com");
  assert.equal(reply.state.stage, "awaiting_day");
  assert.equal(reply.state.draft.contact, "dolor@example.com");
  assert.match(reply.message, /Qué día/);
  assert.equal(reply.state.treatmentInterest, "Dental Implants");
});

test("Spanish treatment accents are optional and unknown facts stay unknown", () => {
  const spanish = new DemoAIService("es");
  assert.equal(spanish.respond(spanish.initialState(), "Me interesa odontologia general").state.treatmentInterest, "General Dentistry");
  assert.equal(spanish.respond(spanish.initialState(), "Me interesan carillas").state.treatmentInterest, "Veneers");
  assert.equal(spanish.respond(spanish.initialState(), "¿Cuánto tarda Invisalign?").state.askedPricing, false);
  let state = spanish.initialState();
  const fallbacks = new Set<string>();
  for (let i = 0; i < 3; i += 1) {
    const reply = spanish.respond(state, "Háblame de algo desconocido");
    state = reply.state;
    fallbacks.add(reply.message);
    assert.equal(reply.leadReady, false);
  }
  assert.equal(fallbacks.size, 3);
});
