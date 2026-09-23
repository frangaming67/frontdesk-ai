import type { ChatMessage } from "@/lib/leads/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isAI = message.role === "ai";
  return (
    <div className={`message-enter flex ${isAI ? "justify-start" : "justify-end"} gap-2.5`}>
      {isAI && (
        <div
          aria-hidden
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal text-[11px] font-semibold text-white"
        >
          AI
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isAI
            ? "rounded-tl-sm bg-white text-ink border border-line-soft"
            : "rounded-tr-sm bg-ink text-white"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
