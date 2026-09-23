"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { demoAIService } from "@/lib/ai/DemoAIService";
import type { ConversationState } from "@/lib/ai/types";
import type { ChatMessage, Lead } from "@/lib/leads/types";
import { leadRepository } from "@/lib/leads/LocalLeadRepository";
import { detectIntent } from "@/lib/intent/detectIntent";
import { buildIntentSignals } from "@/lib/intent/buildSignals";
import { generateId } from "@/lib/utils/id";

const SUGGESTIONS = [
  "I'm interested in Invisalign. How much does it cost?",
  "Do you offer dental implants?",
  "Are you open Saturday?",
];

function now() {
  return new Date().toISOString();
}

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationState, setConversationState] = useState<ConversationState>(() =>
    demoAIService.initialState()
  );
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasGreeted = useRef(false);

  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    setMessages([{ id: generateId("msg"), role: "ai", text: demoAIService.greeting(), timestamp: now() }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleSend(text: string) {
    setError(false);
    const userMessage: ChatMessage = { id: generateId("msg"), role: "user", text, timestamp: now() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 650 + Math.random() * 350));

    try {
      const reply = demoAIService.respond(conversationState, text);
      const aiMessage: ChatMessage = { id: generateId("msg"), role: "ai", text: reply.message, timestamp: now() };
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
        setSubmittedLead(lead);
      }
      // Only announce completion after persistence succeeds. On failure the
      // pending question stays active so the user can retry their answer.
      setMessages(finalMessages);
      setConversationState(reply.state);
    } catch {
      setError(true);
    } finally {
      setIsTyping(false);
    }
  }

  if (submittedLead) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-tint text-teal">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="font-display text-xl text-ink">Consultation request submitted</p>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-ink-soft">
            A member of the Miami Smile Dental team will follow up with {submittedLead.name.split(" ")[0]} to confirm the
            consultation. This is a request, not a confirmed appointment.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="mt-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-deep"
        >
          View in dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isTyping && <TypingIndicator />}
        {error && (
          <div role="alert" className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-coral/30 bg-coral-tint px-4 py-2.5 text-[15px] text-coral">
              Something went wrong. Please try again.
            </div>
          </div>
        )}
        {messages.length === 1 && !isTyping && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSend(s)}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-teal hover:text-teal"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
