"use client";

import Link from "next/link";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Brand } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { practice } from "@/lib/knowledge-base";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { LegalLinks } from "@/components/legal/LegalLinks";

export function ChatDemoPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line-soft bg-paper/95">
        <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <Brand />
          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageSwitcher />
            <Link href="/dashboard" aria-label={t("Explore the dashboard", "Explorar el panel")} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-teal">
              <span className="hidden md:inline">{t("Explore the dashboard", "Explorar el panel")}</span>
              <span className="hidden sm:inline md:hidden">{t("Dashboard", "Panel")}</span>
              <Icon name="arrow-up-right" size={16} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-7 px-4 py-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-10 xl:gap-24">
        <aside className="flex flex-col justify-center lg:py-7">
          <div className="mb-4 hidden w-fit items-center gap-2 rounded-full border border-teal/15 bg-teal-tint px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            {t("Interactive demo", "Demo interactiva")}
          </div>
          <h1 className="text-[28px] leading-[1.15] tracking-tight text-ink sm:text-3xl lg:text-[52px] xl:text-[58px]">
            {t("A warm welcome.", "Una cálida bienvenida.")}
            <span className="text-teal lg:block"> {t("Every time.", "Siempre.")}</span>
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft lg:mt-5 lg:text-base">
            {t(`Meet the receptionist for ${practice.name}, our fictional demo practice.`, `Conoce al recepcionista de ${practice.name}, nuestra clínica ficticia de demostración.`)}
          </p>

          <div className="mt-9 hidden rounded-2xl border border-line bg-white p-6 lg:block">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Icon name="message" size={18} className="text-teal" />
              {t("Take the patient’s seat", "Ponte en el lugar del paciente")}
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              {t("Ask about a treatment or office hours. Then request a consultation to see how a conversation becomes a lead.", "Pregunta por un tratamiento o los horarios. Luego solicita una consulta para ver cómo una conversación se convierte en un contacto para la clínica.")}
            </p>
            <div className="mt-5 border-t border-line-soft pt-4 text-xs leading-5 text-ink-soft">
              <span className="font-semibold text-teal">{t("A quick tip:", "Un consejo:")}</span> {t("use a made-up name and no health information. At the contact step, choose a fictional example or request a real verification code if sending is enabled.", "usa un nombre inventado y no compartas información de salud. En el paso de contacto, elige un ejemplo ficticio o solicita un código real si el envío está habilitado.")}
            </div>
          </div>

          <div className="mt-8 hidden items-start gap-3 lg:flex">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal">
              <Icon name="arrow-right" size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{t("See both sides of the conversation", "Conoce ambos lados de la conversación")}</p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{t("Once you finish, open the captured lead to see what the front desk receives.", "Cuando termines, abre el contacto registrado para ver qué recibe el equipo de recepción.")}</p>
            </div>
          </div>
          <p className="mt-8 hidden max-w-sm text-xs leading-5 text-ink-soft/80 lg:block">
            {t("This demo answers general questions and collects consultation requests. Medical questions and appointment confirmations stay with the dental team.", "Esta demo responde preguntas generales y registra solicitudes de consulta. Las preguntas médicas y las confirmaciones de citas quedan a cargo del equipo dental.")}
          </p>
        </aside>

        <section aria-label={t("Interactive patient conversation", "Conversación interactiva con el paciente")} className="flex h-[calc(100svh-225px)] min-h-[460px] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_20px_70px_-35px_rgba(20,46,41,0.28)] lg:h-[min(760px,calc(100svh-160px))] lg:min-h-[610px]">
          <ChatWindow />
        </section>
      </main>
      <div className="px-4 pb-6"><p className="mb-3 text-center text-[11px] text-ink-soft">{t("For adults 18+ · No medical advice · In an emergency contact your local emergency service.", "Para mayores de 18 años · Sin asesoramiento médico · En una emergencia contacta al servicio local de emergencias.")}</p><LegalLinks /></div>
    </div>
  );
}
