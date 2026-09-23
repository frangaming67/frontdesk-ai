import type { ChatMessage } from "@/lib/leads/types";
import { formatTime } from "@/lib/utils/date";

export function ConversationView({ conversation }: { conversation: ChatMessage[] }) {
  return (
    <div className="space-y-3 rounded-2xl border border-line-soft bg-white p-5">
      {conversation.map((m) => (
        <div key={m.id} className={`flex ${m.role === "ai" ? "justify-start" : "justify-end"}`}>
          <div className="max-w-[85%]">
            <div
              className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "ai"
                  ? "rounded-tl-sm bg-paper text-ink"
                  : "rounded-tr-sm bg-ink text-white"
              }`}
            >
              {m.text}
            </div>
            <p className={`mt-1 text-[11px] text-ink-soft/60 ${m.role === "ai" ? "text-left" : "text-right"}`}>
              {m.role === "ai" ? "AI Receptionist" : "Patient"} · {formatTime(m.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
