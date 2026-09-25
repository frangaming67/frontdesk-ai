"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { Icon } from "@/components/ui/Icon";
import { demoAIService } from "@/lib/ai/DemoAIService";
import type { ConversationStage, ConversationState } from "@/lib/ai/types";
import type { ChatMessage, Lead } from "@/lib/leads/types";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";
import { detectIntent } from "@/lib/intent/detectIntent";
import { buildIntentSignals } from "@/lib/intent/buildSignals";
import { generateId } from "@/lib/utils/id";
import { practice } from "@/lib/knowledge-base";

const SUGGESTIONS = [
  { label: "Invisalign pricing", message: "I'm interested in Invisalign. How much does it cost?" },
  { label: "Dental implants", message: "Do you offer dental implants?" },
  { label: "Office hours", message: "Are you open Saturday?" },
];

const PLACEHOLDERS: Partial<Record<ConversationStage, string>> = {
  awaiting_name: "Your demo name, e.g. Alex Morgan…",
  awaiting_contact: "Email or phone number with area code…",
  awaiting_day: "Which day works best for you?",
  awaiting_time: "Morning or afternoon?",
};

function greeting(): ChatMessage {
  return { id: generateId("msg"), role: "ai", text: demoAIService.greeting(), timestamp: new Date().toISOString() };
}

function getStep(stage: ConversationStage) {
  if (stage === "completed") return 3;
  if (stage === "awaiting_day" || stage === "awaiting_time") return 2;
  if (stage === "awaiting_name" || stage === "awaiting_contact") return 1;
  return 0;
}

function replySuggestions(stage: ConversationStage) {
  switch (stage) {
    case "offer_consult": return ["Yes, request a consultation", "Just browsing"];
    case "awaiting_day": return ["Monday", "Wednesday", "Friday", "Any weekday"];
    case "awaiting_time": return ["Morning", "Afternoon"];
    case "exploring": return ["Request a consultation"];
    default: return [];
  }
}

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationState, setConversationState] = useState<ConversationState>(() => demoAIService.initialState());
  const [isTyping, setIsTyping] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [session, setSession] = useState(0);
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRestartRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<Element | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasGreeted = useRef(false);
  const sendingRef = useRef(false);
  const mountedRef = useRef(false);
  const step = getStep(conversationState.stage);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    setMessages([greeting()]);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reducedMotion ? "instant" : "smooth" });
  }, [messages, isTyping, retryMessage]);

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
    setMessages([greeting()]);
    setConversationState(demoAIService.initialState());
    setSubmittedLead(null);
    setRetryMessage(null);
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

  async function handleSend(text: string, retry = false) {
    if (sendingRef.current || submittedLead || confirmingRestart) return;
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
      const reply = demoAIService.respond(conversationState, text);
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
            <p className="mt-0.5 text-[11px] text-ink-soft">AI receptionist <span className="mx-1 text-line">/</span> Demo</p>
          </div>
        </div>
        <button type="button" onClick={requestRestart} disabled={isTyping || confirmingRestart} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-ink-soft transition-colors hover:bg-paper hover:text-teal disabled:cursor-wait disabled:opacity-40" aria-label="Restart conversation">
          <Icon name="refresh" size={15} />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>

      <ol aria-label="Consultation request progress" className="grid shrink-0 grid-cols-3 gap-2 border-b border-line-soft bg-white px-4 py-3 sm:px-6 sm:py-4">
        {["Explore", "Your details", "Preferences"].map((label, index) => (
          <li key={label} aria-current={step === index ? "step" : undefined} className={`flex items-center gap-1.5 text-[10px] sm:gap-2 sm:text-xs ${step >= index ? "font-medium text-teal" : "text-ink-soft/70"}`}>
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${step > index ? "bg-teal text-white" : step === index ? "bg-teal-tint text-teal ring-1 ring-teal/20" : "bg-paper text-ink-soft/70"}`}>
              {step > index ? <Icon name="check" size={12} /> : index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {confirmingRestart && (
        <section aria-label="Confirm conversation restart" onKeyDown={(event) => { if (event.key === "Escape") cancelRestart(); }} className="shrink-0 border-b border-line bg-teal-tint px-4 py-4 sm:px-6">
          <p className="text-sm font-semibold text-ink">Start a new conversation?</p>
          <p className="mt-1 text-xs leading-5 text-ink-soft">This conversation will be cleared. Saved demo leads will stay in your dashboard.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button ref={cancelRestartRef} type="button" onClick={cancelRestart} className="button-secondary !min-h-10 !px-3 !py-2 !text-xs">Keep chatting</button>
            <button type="button" onClick={restart} className="button-primary !min-h-10 !px-3 !py-2 !text-xs">Start over</button>
          </div>
        </section>
      )}

      {submittedLead ? (
        <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto bg-paper/50 px-5 py-7 text-center sm:px-8 sm:py-9" role="status">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal"><Icon name="check" size={26} /></div>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal">Conversation → captured lead</p>
          <h3 className="mt-2 text-2xl leading-tight text-ink sm:text-3xl">Your demo request is ready.</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">A real front desk would follow up to confirm availability. This is a request, not a confirmed appointment.</p>
          <div className="my-5 w-full max-w-sm rounded-2xl border border-line bg-white px-4 py-3 text-left">
            <p className="text-sm font-semibold text-ink">{submittedLead.name}</p>
            <p className="mt-1 text-xs text-ink-soft">{submittedLead.treatment}</p>
            <p className="mt-3 flex items-center gap-2 border-t border-line-soft pt-3 text-xs text-ink-soft"><Icon name="calendar" size={14} />{submittedLead.preferredDay} · {submittedLead.preferredTime}</p>
          </div>
          <Link href={`/dashboard/leads/${submittedLead.id}`} className="button-primary w-full max-w-sm justify-center">View captured lead <Icon name="arrow-right" size={16} /></Link>
          <button type="button" onClick={restart} className="mt-3 min-h-10 text-sm font-medium text-teal underline-offset-4 hover:underline">Start another conversation</button>
          <p className="mt-4 max-w-xs text-[11px] leading-5 text-ink-soft/80">Saved in this browser. No request has been sent to a clinic.</p>
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain bg-paper/70 px-4 py-5 sm:px-5">
            <div className="space-y-5" role="log" aria-live="polite" aria-relevant="additions text" aria-label="Conversation with the demo receptionist">
              {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
            </div>
            {isTyping && <TypingIndicator />}
            {retryMessage && (
              <div role="alert" className="rounded-xl border border-coral/20 bg-coral-tint px-4 py-3 text-sm leading-6 text-coral">
                We couldn’t finish that step. Your request hasn’t been submitted.
                <button type="button" onClick={() => handleSend(retryMessage, true)} className="ml-1 font-semibold underline underline-offset-4">Try again</button>
              </div>
            )}
            {!isTyping && !retryMessage && !confirmingRestart && (
              <div className="pl-[38px]">
                {messages.length === 1 && <p className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-soft/75">Try asking about</p>}
                <div className="flex flex-wrap gap-2">
                  {(messages.length === 1 ? SUGGESTIONS : replySuggestions(conversationState.stage).map((text) => ({ label: text, message: text }))).map((suggestion) => (
                    <button key={suggestion.label} type="button" onClick={() => handleSend(suggestion.message)} className="min-h-9 rounded-xl border border-teal/20 bg-white px-3 py-2 text-xs font-medium text-teal transition-colors hover:border-teal/50 hover:bg-teal-tint">
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <ChatInput key={session} inputRef={inputRef} onSend={handleSend} disabled={isTyping || confirmingRestart} placeholder={PLACEHOLDERS[conversationState.stage]} />
        </>
      )}
    </div>
  );
}
