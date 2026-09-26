"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { treatmentLabel } from "@/lib/i18n/labels";
import { Icon } from "@/components/ui/Icon";
import { practice, treatments } from "@/lib/knowledge-base";
import { branding } from "@/lib/branding";

export function Hero() {
  const { t, locale } = useLanguage();
  return (
    <section className="page-shell pb-10 pt-12 sm:pb-14 sm:pt-20 lg:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-10">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal/15 bg-teal-tint px-3 py-1.5 text-[11px] font-semibold text-teal-deep">
            <span className="size-1.5 shrink-0 rounded-full bg-teal" /> {t("YOUR PRACTICE. ALWAYS WELCOMING.", "TU CLÍNICA. SIEMPRE PRESENTE.")}
          </div>
          <h1 className="text-[clamp(2.8rem,5.6vw,4.75rem)] leading-[1.04] text-ink">
            {t("A warm welcome.", "Una cálida bienvenida.")}<br /><span className="text-teal">{t("Even after hours.", "A cualquier hora.")}</span>
          </h1>
          <p className="mt-6 max-w-[440px] text-base leading-[1.8] text-ink-soft sm:text-[17px]">
            {t(`Turn patient questions into your team's next conversation. ${branding.name} answers, captures interest, and helps people take the first step.`, `Convierte las preguntas de tus pacientes en nuevas conversaciones para tu equipo. ${branding.name} responde, registra su interés y los ayuda a dar el primer paso.`)}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/chat" className="button-primary px-6 py-3.5">{t("Meet your AI receptionist", "Conoce a tu recepcionista IA")} <Icon name="arrow-right" size={17} className="shrink-0" /></Link>
            <a href="#product" className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-medium text-ink hover:text-teal">{t("See how it works", "Mira cómo funciona")} <Icon name="chevron-down" size={15} /></a>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-soft">
            <span className="flex items-center gap-1.5"><Icon name="check" size={14} className="text-teal" /> {t("No sign-up needed", "Sin registro")}</span>
            <span className="flex items-center gap-1.5"><Icon name="check" size={14} className="text-teal" /> {t("Try a real conversation flow", "Prueba una conversación completa")}</span>
          </div>
        </div>
        <div className="hero-orbit relative mx-auto w-full max-w-[525px] px-2 pb-8 pt-7 sm:px-6">
          <div aria-hidden="true" className="absolute inset-x-3 bottom-4 top-10 rounded-[46%] bg-[#E4EDDC] sm:inset-x-0" />
          <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2 px-3 text-[10px] font-medium tracking-wide text-ink-soft">
            <span className="flex items-center gap-1.5"><Icon name="moon" size={13} /> {t("10:47 PM · OFFICE CLOSED", "22:47 · CLÍNICA CERRADA")}</span>
            <span className="flex items-center gap-1.5 text-teal"><span className="size-1.5 rounded-full bg-teal" /> {t("RECEPTIONIST ONLINE", "RECEPCIONISTA EN LÍNEA")}</span>
          </div>
          <div className="hero-preview relative overflow-hidden rounded-[24px] border border-white bg-white">
            <div className="flex items-center gap-3 border-b border-line-soft px-5 py-4">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-teal-deep font-display text-lg text-white">m.</span>
              <div className="flex-1"><p className="text-[13px] font-semibold">{practice.name}</p><p className="mt-0.5 text-[11px] text-ink-soft">{t("Your friendly AI receptionist", "Tu recepcionista virtual")}</p></div>
              <Icon name="sparkles" size={19} className="text-teal" />
            </div>
            <div className="space-y-4 px-5 py-5 text-[13px] leading-relaxed">
              <p className="text-center text-[10px] text-ink-soft">{t("A little curiosity. A new opportunity.", "Una pregunta. Una nueva oportunidad.")}</p>
              <div className="ml-10 rounded-2xl rounded-br-md bg-teal-deep px-4 py-3 text-white">{t("Hi! I'm interested in Invisalign. Do you offer consultations?", "¡Hola! Me interesa Invisalign. ¿Ofrecen consultas?")}</div>
              <div className="mr-8 rounded-2xl rounded-bl-md bg-paper px-4 py-3">{t("Yes! I can help you request a consultation. What's your name?", "¡Sí! Puedo ayudarte a solicitar una consulta. ¿Cómo te llamas?")}</div>
              <div className="flex justify-end"><span className="rounded-2xl rounded-br-md bg-teal-deep px-4 py-2.5 text-white">{t("I'm Alex. Mornings work best.", "Soy Alex. Prefiero por la mañana.")}</span></div>
              <div className="flex items-center gap-2 border-t border-line-soft pt-3 text-[11px] text-ink-soft"><Icon name="shield" size={14} className="shrink-0 text-teal" /> {t("Your team confirms the appointment.", "Tu equipo confirma la cita.")}</div>
            </div>
          </div>
          <div className="relative -mt-1 ml-8 flex items-center gap-3 rounded-2xl border border-line-soft bg-white px-4 py-3 shadow-[0_12px_30px_-14px_#163f3340] sm:ml-16 sm:translate-x-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal"><Icon name="check-circle" size={19} /></span>
            <div className="min-w-0 flex-1"><p className="text-xs font-semibold">{t("A new lead, ready for your team.", "Un nuevo contacto para tu equipo.")}</p><p className="mt-0.5 text-[10px] text-ink-soft">{t("Contact details + full conversation", "Datos de contacto + conversación")}</p></div>
            <span className="rounded-full bg-[#F2F5D8] px-2 py-1 text-[9px] font-semibold text-[#5B652E]">{t("HIGH INTENT", "ALTO INTERÉS")}</span>
          </div>
          <p className="relative mt-4 text-center text-[10px] text-ink-soft">{t("Illustrative flow", "Ejemplo ilustrativo")} · {practice.name} {t("is a fictional practice", "es una clínica ficticia")}</p>
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-4 border-t border-line pt-7 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
        <p className="shrink-0 text-xs text-ink-soft">{t("Made for the questions your patients ask.", "Respuestas a las preguntas de tus pacientes.")}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-medium text-ink/80">
          {treatments.map((treatment) => <span key={treatment.id}>{treatmentLabel(treatment.name, locale)}</span>)}
        </div>
      </div>
    </section>
  );
}
