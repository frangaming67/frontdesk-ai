import type { ChatMessage } from "@/lib/leads/types";
import { formatTime } from "@/lib/utils/date";
import { Icon } from "@/components/ui/Icon";

export function ConversationView({ conversation }: { conversation: ChatMessage[] }) {
  return (
    <section aria-labelledby="conversation-title" className="overflow-hidden rounded-[24px] border border-line-soft bg-white">
      <div className="flex items-center gap-3 border-b border-line-soft px-5 py-5 sm:px-7">
        <span className="flex size-10 items-center justify-center rounded-xl bg-teal-tint text-teal"><Icon name="message" size={19} /></span>
        <div>
          <h2 id="conversation-title" className="font-display text-xl text-ink">The conversation</h2>
          <p className="mt-0.5 text-xs text-ink-soft">{conversation.length} messages · Full chat history</p>
        </div>
      </div>
      <div className="space-y-5 p-5 sm:p-7">
        {conversation.length === 0 && <p className="py-5 text-center text-sm text-ink-soft">No conversation was recorded for this inquiry.</p>}
        {conversation.map((message) => (
          <div key={message.id} className={`flex ${message.role === "ai" ? "justify-start" : "justify-end"}`}>
            <div className="max-w-[90%] sm:max-w-[85%]">
              <p className={`mb-1.5 text-[11px] font-medium text-ink-soft ${message.role === "ai" ? "text-left" : "text-right"}`}>{message.role === "ai" ? "AI Receptionist" : "Patient"}</p>
              <div className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "ai" ? "rounded-tl-sm bg-paper text-ink" : "rounded-tr-sm bg-teal text-white"}`}>{message.text}</div>
              <p className={`mt-1.5 text-[11px] text-ink-soft ${message.role === "ai" ? "text-left" : "text-right"}`}>{formatTime(message.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
