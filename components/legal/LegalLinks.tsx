"use client";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function LegalLinks() {
  const { t } = useLanguage();
  return <nav aria-label={t("Legal information", "Información legal")} className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-ink-soft"><Link className="underline-offset-4 hover:underline" href="/privacy">{t("Privacy & data", "Privacidad y datos")}</Link><Link className="underline-offset-4 hover:underline" href="/terms">{t("Demo terms", "Términos de la demo")}</Link><Link className="underline-offset-4 hover:underline" href="/accessibility">{t("Accessibility", "Accesibilidad")}</Link></nav>;
}
