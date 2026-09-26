"use client";

import Link from "next/link";
import { branding } from "@/lib/branding";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Brand({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const { t } = useLanguage();
  return (
    <Link href="/" aria-label={t(`${branding.name} home`, `${branding.name} — Inicio`)} className={`inline-flex min-w-0 items-center gap-2.5 ${light ? "text-white" : "text-ink"} ${className}`}>
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${light ? "bg-white/15" : "bg-teal text-white"}`}>
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H9l-4 3V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-[17px] leading-tight font-semibold tracking-[-0.7px] sm:text-[19px]">{branding.name}</span>
    </Link>
  );
}
