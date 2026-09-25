"use client";

import { useState, type FormEvent, type RefObject } from "react";
import { Icon } from "@/components/ui/Icon";

export function ChatInput({
  onSend,
  disabled,
  inputRef,
  placeholder = "Ask a question or request a consultation…",
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  placeholder?: string;
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
    <form onSubmit={handleSubmit} className="shrink-0 border-t border-line-soft bg-white px-4 pb-3 pt-4 sm:px-5">
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-paper p-1.5 transition-colors focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/10">
        <label htmlFor="chat-input" className="sr-only">Your message to the demo receptionist</label>
        <input
          id="chat-input"
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={disabled}
          aria-disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="send"
          aria-describedby="chat-input-hint"
          className="min-w-0 flex-1 bg-transparent px-2.5 py-2.5 text-base text-ink outline-none placeholder:text-ink-soft/65 focus-visible:outline-none disabled:opacity-60 sm:text-sm"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal text-white transition-colors hover:bg-teal-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-soft/50"
          aria-label="Send message"
        >
          <Icon name="arrow-right" size={19} />
        </button>
      </div>
      <p id="chat-input-hint" className="mt-2.5 text-center text-[10px] leading-4 text-ink-soft/80 sm:text-[11px]">
        Fictional practice · Use made-up details · No appointments booked
      </p>
    </form>
  );
}
