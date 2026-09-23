export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5" aria-live="polite" aria-label="AI is typing">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal text-[11px] font-semibold text-white">
        AI
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-line-soft bg-white px-4 py-3">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-soft" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-soft" style={{ animationDelay: "150ms" }} />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-soft" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
