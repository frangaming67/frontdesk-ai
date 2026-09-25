"use client";

import { useId } from "react";
import { useLanguage } from "./LanguageProvider";
import { Icon } from "@/components/ui/Icon";
import { parseLocale } from "@/lib/i18n/types";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const id = useId();
  return (
    <div className="relative shrink-0">
      <label htmlFor={id} className="sr-only">Language / Idioma</label>
      <select id={id} value={locale} onChange={(event) => setLocale(parseLocale(event.target.value))} className="min-h-11 cursor-pointer appearance-none rounded-xl border border-line bg-white py-2 pl-3 pr-8 text-xs font-medium text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20">
        <option value="en" lang="en">English</option>
        <option value="es" lang="es">Español</option>
      </select>
      <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft" />
    </div>
  );
}
