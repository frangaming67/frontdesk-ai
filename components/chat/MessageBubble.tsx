"use client";

import type { ChatMessage } from "@/lib/leads/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const { locale, t } = useLanguage();
  const isAI = message.role === "ai";
  const time = new Date(message.timestamp).toLocaleTimeString(locale === "es" ? "es-US" : "en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className={`message-enter flex gap-2.5 ${isAI ? "justify-start" : "justify-end"}`}>
      {isAI && (
        <div aria-hidden="true" className="mt-6 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-tint text-[10px] font-semibold text-teal">
          MS
        </div>
      )}
      <div className="max-w-[88%] sm:max-w-[85%]">
        <div className={`mb-1.5 flex items-center gap-2 text-[10px] text-ink-soft/75 ${isAI ? "" : "justify-end"}`}>
          <span className="font-medium">{isAI ? t("Receptionist", "Recepcionista") : t("You", "Tú")}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={message.timestamp}>{time}</time>
        </div>
        <div className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-[1.7] [overflow-wrap:anywhere] ${isAI ? "rounded-tl-sm border border-line-soft bg-white text-ink" : "rounded-tr-sm bg-teal text-white"}`}>
          {message.text}
        </div>
      </div>
    </div>
  );
}
