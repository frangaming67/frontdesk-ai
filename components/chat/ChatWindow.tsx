"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { ContactVerification } from "./ContactVerification";
import { Icon } from "@/components/ui/Icon";
import { DemoAIService } from "@/lib/ai/DemoAIService";
import type { ConversationStage, ConversationState } from "@/lib/ai/types";
import type { ChatMessage, Lead, ContactVerificationRecord } from "@/lib/leads/types";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";
import { detectIntent } from "@/lib/intent/detectIntent";
import { buildIntentSignals } from "@/lib/intent/buildSignals";
import { generateId } from "@/lib/utils/id";
import { practice } from "@/lib/knowledge-base";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { preferenceLabel, treatmentLabel } from "@/lib/i18n/labels";

function greeting(service: DemoAIService): ChatMessage {
  return { id: generateId("msg"), role: "ai", text: service.greeting(), timestamp: new Date().toISOString() };
}

function getStep(stage: ConversationStage) {
  if (stage === "completed") return 3;
  if (stage === "awaiting_day" || stage === "awaiting_time") return 2;
  if (stage === "awaiting_name" || stage === "awaiting_contact") return 1;
  return 0;
}

function replySuggestions(stage: ConversationStage, t: (english: string, spanish: string) => string) {
  switch (stage) {
    case "offer_consult": return [t("Yes, request a consultation", "Sí, solicitar una consulta"), t("Just browsing", "Solo estoy mirando")];
    case "awaiting_day": return [t("Monday", "Lunes"), t("Wednesday", "Miércoles"), t("Friday", "Viernes"), t("Any weekday", "Cualquier día de semana")];
    case "awaiting_time": return [t("Morning", "Mañana"), t("Afternoon", "Por la tarde")];
    case "exploring": return [t("Request a consultation", "Solicitar una consulta")];
    default: return [];
  }
}

export function ChatWindow() {
  const { locale, t } = useLanguage();
  const aiService = useMemo(() => new DemoAIService(locale), [locale]);
  const aiServiceRef = useRef(aiService);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationState, setConversationState] = useState<ConversationState>(() => aiService.initialState());
  const [isTyping, setIsTyping] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [session, setSession] = useState(0);
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  const [pendingContact, setPendingContact] = useState<string | null>(null);
  const [contactVerification, setContactVerification] = useState<ContactVerificationRecord | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRestartRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<Element | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasUserTyped = useRef(false);
  const sendingRef = useRef(false);
  const mountedRef = useRef(false);
  const step = getStep(conversationState.stage);
  const suggestions = [
    { label: t("Invisalign pricing", "Precio de Invisalign"), message: t("I'm interested in Invisalign. How much does it cost?", "Me interesa Invisalign. ¿Cuánto cuesta?") },
    { label: t("Dental implants", "Implantes dentales"), message: t("Do you offer dental implants?", "¿Ofrecen implantes dentales?") },
    { label: t("Office hours", "Horarios"), message: t("Are you open Saturday?", "¿Abren los sábados?") },
  ];
  const placeholders: Partial<Record<ConversationStage, string>> = {
    awaiting_name: t("Your demo name, e.g. Alex Morgan…", "Tu nombre ficticio, p. ej., Alex Morgan…"),
    awaiting_contact: t("Email or phone number with area code…", "Correo o teléfono con código de área…"),
    awaiting_day: t("Which day works best for you?", "¿Qué día te queda mejor?"),
    awaiting_time: t("Morning or afternoon?", "¿Por la mañana o por la tarde?"),
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    aiServiceRef.current = aiService;
    // Localize the untouched welcome, but never rewrite a started conversation
    // or clear the separate input draft when the language changes.
    setMessages((current) => hasUserTyped.current || current.some((message) => message.role === "user") ? current : [greeting(aiService)]);
  }, [aiService]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reducedMotion ? "instant" : "smooth" });
  }, [messages, isTyping, retryMessage, pendingContact]);

  useEffect(() => {
    if (!isTyping && restoreFocusRef.current) {
      if (document.activeElement === document.body || document.activeElement === restoreFocusRef.current) inputRef.current?.focus();
      restoreFocusRef.current = null;
    }
  }, [isTyping]);

  useEffect(() => {
    if (confirmingRestart) cancelRestartRef.current?.focus();
  }, [confirmingRestart]);

  useEffect(() => {
    if (session > 0) inputRef.current?.focus();
  }, [session]);

  function restart() {
    if (sendingRef.current) return;
    setConfirmingRestart(false);
    hasUserTyped.current = false;
    setMessages([greeting(aiService)]);
    setConversationState(aiService.initialState());
    setSubmittedLead(null);
    setRetryMessage(null);
    setPendingContact(null);
    setContactVerification(undefined);
    setSession((current) => current + 1);
  }

  function requestRestart() {
    if (!submittedLead && messages.some((message) => message.role === "user")) setConfirmingRestart(true);
    else restart();
  }

  function cancelRestart() {
    setConfirmingRestart(false);
    inputRef.current?.focus();
  }

  async function handleSend(text: string, retry = false, contactApproved = false, verification?: ContactVerificationRecord) {
    if (sendingRef.current || submittedLead || confirmingRestart) return;
    if (pendingContact && !contactApproved) return;
    if (conversationState.stage === "awaiting_contact" && !contactApproved) {
      const preview = aiServiceRef.current.respond(conversationState, text);
      if (preview.state.stage === "awaiting_day" && preview.state.draft.contact) {
        setPendingContact(preview.state.draft.contact);
        return;
      }
    }
    if (contactApproved) { setPendingContact(null); setContactVerification(verification); }
    restoreFocusRef.current = document.activeElement;
    sendingRef.current = true;
    setRetryMessage(null);
    const userMessage: ChatMessage = { id: generateId("msg"), role: "user", text, timestamp: new Date().toISOString() };
    const nextMessages = retry ? messages : [...messages, userMessage];
    setMessages(nextMessages);
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 650 + Math.random() * 350));
    // Navigation can happen during the simulated reply delay. Do not create
    // a lead after the conversation has been left or update an unmounted UI.
    if (!mountedRef.current) return;

    try {
      const reply = aiServiceRef.current.respond(conversationState, text);
      const aiMessage: ChatMessage = { id: generateId("msg"), role: "ai", text: reply.message, timestamp: new Date().toISOString() };
      const finalMessages = [...nextMessages, aiMessage];
      if (reply.leadReady) {
        const signals = buildIntentSignals(reply.state);
        const intent = detectIntent(signals);
        const contact = reply.state.draft.contact;
        const lead = await leadRepository.create({
          name: reply.state.draft.name ?? "Unknown",
          email: contact?.includes("@") ? contact : undefined,
          phone: contact && !contact.includes("@") ? contact : undefined,
          treatment: reply.state.treatmentInterest ?? "General Consultation",
          intent,
          preferredDay: reply.state.draft.day,
          preferredTime: reply.state.draft.time,
          conversation: finalMessages,
          contactVerification,
        });
        if (mountedRef.current) setSubmittedLead(lead);
      }
      // Announce completion only after persistence succeeds. Keep the pending
      // question and the user's answer available for a retry on storage failure.
      if (mountedRef.current) {
        setMessages(finalMessages);
        setConversationState(reply.state);
      }
    } catch {
      if (mountedRef.current) setRetryMessage(text);
    } finally {
      sendingRef.current = false;
      if (mountedRef.current) setIsTyping(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line-soft px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal text-sm font-semibold tracking-tight text-white">
            MS
            <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#87B99A]" />
          </div>
          <div className="min-w-0">
            <h2 className="!font-body text-sm font-semibold tracking-tight text-ink sm:text-base">{practice.name}</h2>
            <p className="mt-0.5 text-[11px] text-ink-soft">{t("AI receptionist", "Recepcionista IA")} <span className="mx-1 text-line">/</span> Demo</p>
          </div>
        </div>
        <button type="button" onClick={requestRestart} disabled={isTyping || confirmingRestart} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-ink-soft transition-colors hover:bg-paper hover:text-teal disabled:cursor-wait disabled:opacity-40" aria-label={t("Restart conversation", "Reiniciar conversación")}>
          <Icon name="refresh" size={15} />
          <span className="hidden sm:inline">{t("Restart", "Reiniciar")}</span>
        </button>
      </div>

      <ol aria-label={t("Consultation request progress", "Progreso de la solicitud")} className="grid shrink-0 grid-cols-3 gap-2 border-b border-line-soft bg-white px-4 py-3 sm:px-6 sm:py-4">
        {[t("Explore", "Explorar"), t("Your details", "Tus datos"), t("Preferences", "Preferencias")].map((label, index) => (
          <li key={label} aria-current={step === index ? "step" : undefined} className={`flex items-center gap-1.5 text-[10px] sm:gap-2 sm:text-xs ${step >= index ? "font-medium text-teal" : "text-ink-soft/70"}`}>
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${step > index ? "bg-teal text-white" : step === index ? "bg-teal-tint text-teal ring-1 ring-teal/20" : "bg-paper text-ink-soft/70"}`}>
              {step > index ? <Icon name="check" size={12} /> : index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {confirmingRestart && (
        <section aria-label={t("Confirm conversation restart", "Confirmar reinicio de conversación")} onKeyDown={(event) => { if (event.key === "Escape") cancelRestart(); }} className="shrink-0 border-b border-line bg-teal-tint px-4 py-4 sm:px-6">
          <p className="text-sm font-semibold text-ink">{t("Start a new conversation?", "¿Iniciar una nueva conversación?")}</p>
          <p className="mt-1 text-xs leading-5 text-ink-soft">{t("This conversation will be cleared. Saved demo leads will stay in your dashboard.", "Se borrará esta conversación. Los contactos guardados seguirán en el panel.")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button ref={cancelRestartRef} type="button" onClick={cancelRestart} className="button-secondary !min-h-10 !px-3 !py-2 !text-xs">{t("Keep chatting", "Seguir conversando")}</button>
            <button type="button" onClick={restart} className="button-primary !min-h-10 !px-3 !py-2 !text-xs">{t("Start over", "Volver a empezar")}</button>
          </div>
        </section>
      )}

      {submittedLead ? (
        <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto bg-paper/50 px-5 py-7 text-center sm:px-8 sm:py-9" role="status">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal"><Icon name="check" size={26} /></div>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal">{t("Conversation → captured lead", "Conversación → contacto registrado")}</p>
          <h3 className="mt-2 text-2xl leading-tight text-ink sm:text-3xl">{t("Your demo request is ready.", "Tu solicitud de prueba está lista.")}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">{t("A real front desk would follow up to confirm availability. This is a request, not a confirmed appointment.", "En una clínica real, recepción te contactaría para confirmar la disponibilidad. Esta es una solicitud, no una cita confirmada.")}</p>
          <div className="my-5 w-full max-w-sm rounded-2xl border border-line bg-white px-4 py-3 text-left">
            <p className="text-sm font-semibold text-ink">{submittedLead.name}</p>
            <p className="mt-1 text-xs text-ink-soft">{treatmentLabel(submittedLead.treatment, locale)}</p>
            <p className="mt-2 text-xs font-medium text-teal">{submittedLead.contactVerification ? t("Contact verified · No appointment booked", "Contacto verificado · Sin cita reservada") : t("Fictional contact · No message sent", "Contacto ficticio · No se envió ningún mensaje")}</p>
            <p className="mt-3 flex items-center gap-2 border-t border-line-soft pt-3 text-xs text-ink-soft"><Icon name="calendar" size={14} />{preferenceLabel(submittedLead.preferredDay, locale)} · {preferenceLabel(submittedLead.preferredTime, locale)}</p>
          </div>
          <Link href={`/dashboard/leads/${submittedLead.id}`} className="button-primary w-full max-w-sm justify-center">{t("View captured lead", "Ver contacto registrado")} <Icon name="arrow-right" size={16} /></Link>
          <button type="button" onClick={restart} className="mt-3 min-h-10 text-sm font-medium text-teal underline-offset-4 hover:underline">{t("Start another conversation", "Iniciar otra conversación")}</button>
          <p className="mt-4 max-w-xs text-[11px] leading-5 text-ink-soft/80">{t("Saved in this browser. No request has been sent to a clinic.", "Guardado en este navegador. No se envió ninguna solicitud a una clínica.")}</p>
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain bg-paper/70 px-4 py-5 sm:px-5">
            <div className="space-y-5" role="log" aria-live="polite" aria-relevant="additions text" aria-label={t("Conversation with the demo receptionist", "Conversación con el recepcionista de la demo")}>
              {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
            </div>
            {isTyping && <TypingIndicator />}
            {retryMessage && (
              <div role="alert" className="rounded-xl border border-coral/20 bg-coral-tint px-4 py-3 text-sm leading-6 text-coral">
                {t("We couldn’t finish that step. Your request hasn’t been submitted.", "No pudimos completar este paso. Tu solicitud no se ha guardado.")}
                <button type="button" onClick={() => handleSend(retryMessage, true)} className="ml-1 font-semibold underline underline-offset-4">{t("Try again", "Reintentar")}</button>
              </div>
            )}
            {pendingContact && !confirmingRestart && <ContactVerification contact={pendingContact} onComplete={(contact, verification) => void handleSend(contact, false, true, verification)} onCancel={() => { setPendingContact(null); inputRef.current?.focus(); }} />}
            {!pendingContact && !isTyping && !retryMessage && !confirmingRestart && (
              <div className="pl-[38px]">
                {messages.length === 1 && <p className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-soft/75">{t("Try asking about", "Prueba preguntar por")}</p>}
                <div className="flex flex-wrap gap-2">
                  {(messages.length === 1 ? suggestions : replySuggestions(conversationState.stage, t).map((text) => ({ label: text, message: text }))).map((suggestion) => (
                    <button key={suggestion.label} type="button" onClick={() => handleSend(suggestion.message)} className="min-h-9 rounded-xl border border-teal/20 bg-white px-3 py-2 text-xs font-medium text-teal transition-colors hover:border-teal/50 hover:bg-teal-tint">
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <ChatInput key={session} inputRef={inputRef} onSend={handleSend} onDraftChange={() => { hasUserTyped.current = true; }} disabled={isTyping || confirmingRestart || !!pendingContact} placeholder={pendingContact ? t("Choose how to continue above", "Elige cómo continuar arriba") : placeholders[conversationState.stage]} />
        </>
      )}
    </div>
  );
}
