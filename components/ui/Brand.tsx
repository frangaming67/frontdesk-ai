"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Brand({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const { t } = useLanguage();
  return (
    <Link href="/" aria-label={t("FrontDesk AI home", "FrontDesk AI — Inicio")} className={`inline-flex shrink-0 items-center gap-2.5 ${light ? "text-white" : "text-ink"} ${className}`}>
      <span className={`flex size-9 items-center justify-center rounded-xl ${light ? "bg-white/15" : "bg-teal text-white"}`}>
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H9l-4 3V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-[19px] font-semibold tracking-[-0.7px]">FrontDesk<span className={`ml-1 text-[13px] font-medium tracking-normal ${light ? "text-[#BCDCAD]" : "text-teal"}`}>AI</span></span>
    </Link>
  );
}
