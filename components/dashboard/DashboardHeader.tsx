"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { Brand } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";

export function DashboardHeader({ backHref, backLabel }: { backHref?: string; backLabel?: string }) {
  const { t } = useLanguage();
  return (
    <header className="border-b border-line-soft bg-white/90">
      <div className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Brand />
        <nav aria-label={t("Main navigation", "Navegación principal")} className="flex flex-wrap items-center gap-1 sm:gap-3">
          <Link href="/chat" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper hover:text-ink">{t("Chat demo", "Demo del chat")}</Link>
          <Link href="/dashboard" aria-current="page" className="rounded-xl bg-teal-tint px-3 py-2.5 text-sm font-semibold text-teal-deep">{t("Dashboard", "Panel")}</Link>
          <LanguageSwitcher />
        </nav>
      </div>
      {backHref && backHref !== "/" && (
        <div className="mx-auto max-w-6xl px-5 pb-4 sm:px-8">
          <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-teal">
            <Icon name="chevron-left" size={15} />{backLabel ?? t("Back", "Volver")}
          </Link>
        </div>
      )}
    </header>
  );
}
