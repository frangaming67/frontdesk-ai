"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Brand } from "@/components/ui/Brand";
import { LegalLinks } from "@/components/legal/LegalLinks";
import { practice } from "@/lib/knowledge-base";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-line py-8">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <Brand />
          <nav aria-label={t("Footer navigation", "Navegación al pie")} className="flex flex-wrap gap-6 text-xs text-ink-soft">
            <Link href="/chat" className="hover:text-teal">{t("Try the receptionist", "Probar el recepcionista")}</Link>
            <Link href="/dashboard" className="hover:text-teal">{t("Practice dashboard", "Panel de la clínica")}</Link>
            <Link href="/#questions" className="hover:text-teal">{t("About the demo", "Acerca de la demo")}</Link>
          </nav>
        </div>
        <div className="mt-6"><LegalLinks /></div>
        <div className="mt-7 flex flex-col justify-between gap-3 border-t border-line-soft pt-5 text-[11px] leading-5 text-ink-soft">
          <p>{t("Built for a better first impression.", "Una mejor primera impresión para cada paciente.")}</p>
          <p>{practice.name} {t("is a fictional practice. This product demo captures consultation requests; it does not provide medical advice or confirm appointments.", "es una clínica ficticia. Esta demo registra solicitudes de consulta; no ofrece asesoramiento médico ni confirma citas.")}</p>
        </div>
      </div>
    </footer>
  );
}
