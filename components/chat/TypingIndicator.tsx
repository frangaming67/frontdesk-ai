"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { practice } from "@/lib/knowledge-base/practice";

export function TypingIndicator() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2.5" role="status" aria-label={t("The receptionist is typing", "El recepcionista está escribiendo")}>
      <div aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-tint text-[10px] font-semibold text-teal">{practice.initials}</div>
      <div aria-hidden="true" className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-line-soft bg-white px-4 py-4">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal/60" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal/60" style={{ animationDelay: "150ms" }} />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal/60" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
