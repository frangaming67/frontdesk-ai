"use client";

import { useState, FormEvent } from "react";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-line-soft bg-white p-3">
      <label htmlFor="chat-input" className="sr-only">
        Type a message
      </label>
      <input
        id="chat-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Type a message…"
        className="flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 focus-visible:border-teal disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Send message"
      >
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 10h13M11 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}
