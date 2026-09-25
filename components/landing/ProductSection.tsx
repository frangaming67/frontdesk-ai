"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon, type IconName } from "@/components/ui/Icon";

const STEPS: { title: [string, string]; copy: [string, string]; icon: IconName }[] = [
  { title: ["A question comes in", "Llega una pregunta"], copy: ["A patient asks about treatments, office hours, or their first visit.", "Un paciente pregunta por tratamientos, horarios o su primera visita."], icon: "message" },
  { title: ["A helpful reply", "Una respuesta útil"], copy: ["Answers come from your practice information. Medical questions stay with your team.", "Responde con la información de tu clínica. Las preguntas médicas quedan a cargo de tu equipo."], icon: "sparkles" },
  { title: ["Interest becomes a lead", "Su interés queda registrado"], copy: ["The receptionist collects a name, contact details, and a preferred time.", "El recepcionista reúne su nombre, datos de contacto y horario preferido."], icon: "users" },
  { title: ["Your team takes it from here", "Tu equipo continúa"], copy: ["Review the conversation, reach out, and confirm the next steps.", "Revisa la conversación, contacta al paciente y confirma los próximos pasos."], icon: "check-circle" },
];

export function ProductSection() {
  const { t } = useLanguage();
  return (
    <section id="product" className="page-shell py-16 sm:py-24">
      <div className="max-w-xl"><p className="eyebrow">{t("Simple by design", "Simple desde el inicio")}</p><h2 className="mt-4 text-3xl leading-tight sm:text-[42px]">{t("From first question", "De la primera pregunta")}<br />{t("to a personal follow-up.", "al seguimiento personal.")}</h2></div>
      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {STEPS.map((step, index) => (
          <li key={step.title[0]}>
            <div className={"relative mb-5 flex items-center " + (index < 3 ? "step-connector" : "")}><span className="relative z-10 flex size-11 items-center justify-center rounded-2xl border border-line bg-white text-teal"><Icon name={step.icon} /></span></div>
            <p className="mb-2 text-[10px] font-semibold tracking-wider text-teal">0{index + 1}</p>
            <h3 className="font-body! text-[15px] font-semibold! tracking-normal!">{t(...step.title)}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{t(...step.copy)}</p>
          </li>
        ))}
      </ol>
      <div className="mt-16 rounded-[28px] border border-line bg-white p-6 sm:mt-20 sm:p-9">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">{t("Take a look around", "Explora la demo")}</p><h3 className="mt-2 text-2xl sm:text-3xl">{t("Two sides. One connected experience.", "Dos perspectivas. Una misma experiencia.")}</h3></div><span className="text-xs text-ink-soft">{t("No account. No setup. Just explore.", "Sin cuenta ni configuración. Solo explora.")}</span></div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/chat" className="group flex items-center gap-4 rounded-2xl bg-teal-tint p-5 transition-colors hover:bg-[#DFEBDD] sm:p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-teal"><Icon name="message" size={23} /></span>
            <div className="flex-1"><p className="text-[10px] font-semibold uppercase tracking-widest text-teal">{t("01 · For the patient", "01 · Para el paciente")}</p><p className="mt-1 text-[15px] font-semibold">{t("Try the receptionist", "Prueba el recepcionista")}</p><p className="mt-1 text-xs leading-5 text-ink-soft">{t("Ask a question. Request a consultation.", "Haz una pregunta. Solicita una consulta.")}</p></div>
            <Icon name="arrow-up-right" className="shrink-0 text-teal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link href="/dashboard" className="group flex items-center gap-4 rounded-2xl border border-line bg-paper p-5 transition-colors hover:bg-teal-tint sm:p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-teal"><Icon name="grid" size={22} /></span>
            <div className="flex-1"><p className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{t("02 · For your team", "02 · Para tu equipo")}</p><p className="mt-1 text-[15px] font-semibold">{t("Explore the dashboard", "Explora el panel")}</p><p className="mt-1 text-xs leading-5 text-ink-soft">{t("Meet your leads. Find your next follow-up.", "Conoce a tus contactos. Organiza el seguimiento.")}</p></div>
            <Icon name="arrow-up-right" className="shrink-0 text-teal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
