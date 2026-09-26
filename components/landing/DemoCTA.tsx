"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon } from "@/components/ui/Icon";
import { branding } from "@/lib/branding";

const QUESTIONS: { question: [string, string]; answer: [string, string] }[] = [
  { question: ["Does the demo send real messages?", "¿La demo envía mensajes reales?"], answer: ["Only an explicitly requested verification code, when that channel is enabled. If sending is unavailable, the chat tells you and offers a fictional contact instead. Verifying a contact never confirms an appointment or subscribes you to marketing.", "Solo un código de verificación solicitado expresamente, cuando ese canal está habilitado. Si el envío no está disponible, el chat te avisa y ofrece usar un contacto ficticio. Verificar un contacto nunca confirma una cita ni te suscribe a publicidad."] },
  { question: ["Does the receptionist confirm appointments?", "¿El recepcionista confirma citas?"], answer: ["It captures a consultation request and the patient's preferred day and time. Your team follows up to confirm availability. It never promises a confirmed appointment.", "Registra una solicitud de consulta y las preferencias de día y horario del paciente. Tu equipo se comunica para confirmar la disponibilidad. Nunca promete una cita confirmada."] },
  { question: ["What can I try in this demo?", "¿Qué puedo probar en esta demo?"], answer: ["Ask about Invisalign, implants, veneers, whitening, office hours, or insurance. Then request a consultation using fictional contact details and see the new lead in the dashboard.", "Pregunta por Invisalign, implantes, carillas, blanqueamiento, horarios o seguros. Luego solicita una consulta con datos ficticios y encuentra el nuevo contacto en el panel."] },
  { question: ["Where do the demo requests go?", "¿Dónde aparecen las solicitudes?"], answer: ["Requests appear in the dashboard in the same browser you used for the chat. They are demo data, not messages sent to a real clinic. You can restore the original examples with Reset demo leads.", "Las solicitudes aparecen en el panel del mismo navegador donde usaste el chat. Son datos de prueba; no se envían a una clínica real. Puedes recuperar los ejemplos originales con Restablecer demo."] },
];

export function DemoCTA() {
  const { t } = useLanguage();
  return (
    <>
      <section id="questions" className="page-shell pb-16 sm:pb-24">
        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><p className="eyebrow">{t("A few good questions", "Preguntas frecuentes")}</p><h2 className="mt-4 text-3xl sm:text-[38px]">{t("Clear expectations.", "Expectativas claras.")}<br />{t("A better experience.", "Una mejor experiencia.")}</h2><p className="mt-4 text-sm leading-6 text-ink-soft">{t("A simple demo of a more responsive front desk.", "Una demo sencilla de una recepción más atenta.")}</p></div>
          <div className="divide-y divide-line border-y border-line">
            {QUESTIONS.map((item) => <details key={item.question[0]} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-medium [&::-webkit-details-marker]:hidden">{t(...item.question)}<Icon name="plus" size={18} className="shrink-0 text-teal transition-transform group-open:rotate-45" /></summary><p className="pb-6 pr-7 text-sm leading-7 text-ink-soft">{t(...item.answer)}</p></details>)}
          </div>
        </div>
      </section>
      <section className="page-shell pb-14">
        <div className="relative overflow-hidden rounded-[28px] bg-teal-deep px-7 py-12 text-white sm:px-12 sm:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-44 size-[520px] rounded-full border border-white/10" /><div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-28 size-[410px] rounded-full border border-white/10" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div className="max-w-xl"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C2DBB2]">{t("Your next patient is one conversation away", "Tu próximo paciente está a una conversación de distancia")}</p><h2 className="mt-4 text-3xl leading-[1.15] sm:text-[43px]">{t("Give every inquiry", "Dale a cada consulta")}<br />{t("a welcoming first reply.", "una cálida primera respuesta.")}</h2><p className="mt-4 max-w-md text-sm leading-6 text-white/75">{t(`See what the first few minutes with ${branding.name} could feel like for your patients and your team.`, `Descubre cómo serían los primeros minutos con ${branding.name} para tus pacientes y tu equipo.`)}</p></div><div className="shrink-0"><Link href="/chat" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#D3E6B5] px-6 py-3.5 text-sm font-semibold text-teal-deep transition-colors hover:bg-white">{t("Try the live demo", "Prueba la demo")} <Icon name="arrow-right" size={17} /></Link><p className="mt-3 text-xs text-white/65">{t("Free to explore. No sign-up needed.", "Gratis y sin registro.")}</p></div></div>
        </div>
      </section>
    </>
  );
}
