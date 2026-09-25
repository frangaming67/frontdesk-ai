"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { Brand } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";

export function Header() {
  const { t } = useLanguage();
  return (
    <header className="sticky top-0 z-30 border-b border-line-soft bg-paper/95 backdrop-blur-md">
      <div className="page-shell flex min-h-20 items-center justify-between gap-4">
        <Brand />
        <nav aria-label={t("Main navigation", "Navegación principal")} className="hidden items-center gap-5 text-[13px] font-medium text-ink-soft lg:flex">
          <a href="#product" className="transition-colors hover:text-teal">{t("How it works", "Cómo funciona")}</a>
          <Link href="/dashboard" className="transition-colors hover:text-teal">{t("Explore the dashboard", "Explorar el panel")}</Link>
          <a href="#questions" className="transition-colors hover:text-teal">{t("FAQs", "Preguntas frecuentes")}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/chat" className="button-primary hidden px-4 sm:inline-flex sm:px-5">{t("Try the demo", "Probar la demo")} <Icon name="arrow-up-right" size={16} /></Link>
        </div>
      </div>
    </header>
  );
}
