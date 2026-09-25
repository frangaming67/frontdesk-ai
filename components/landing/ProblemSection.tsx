"use client";

import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function ProblemSection() {
  const { t } = useLanguage();
  return (
    <section id="problem" className="border-y border-line-soft bg-white py-16 sm:py-20">
      <div className="page-shell grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <p className="eyebrow">{t("The moments in between", "Cuando tu equipo no está disponible")}</p>
          <h2 className="mt-4 text-3xl leading-[1.15] sm:text-[40px]">{t("Your front desk is busy.", "Tu recepción está ocupada.")}<br />{t("Your next patient is waiting.", "Tu próximo paciente espera.")}</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-ink-soft">{t("After closing. During lunch. Between patients. A simple question can become a missed opportunity when nobody is there to answer.", "Al cerrar. Durante el almuerzo. Entre pacientes. Una simple pregunta puede convertirse en una oportunidad perdida cuando nadie puede responder.")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-line-soft bg-paper p-6">
            <span className="mb-5 inline-flex size-10 items-center justify-center rounded-xl border border-line bg-white text-ink-soft"><Icon name="clock" /></span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">{t("A familiar story", "Una historia conocida")}</p>
            <p className="mt-3 font-display text-2xl leading-tight">{t("“Anyone there?”", "“¿Hay alguien?”")}</p>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{t("The message waits. The patient keeps looking. Your team starts tomorrow already catching up.", "El mensaje espera. El paciente sigue buscando. Tu equipo empieza el día siguiente con pendientes.")}</p>
            <div className="mt-6 flex items-center gap-2 text-xs text-ink-soft"><span className="size-1.5 shrink-0 rounded-full bg-coral/60" /> {t("One more unanswered inquiry", "Otra consulta sin respuesta")}</div>
          </div>
          <div className="rounded-3xl border border-teal/15 bg-teal-tint p-6">
            <span className="mb-5 inline-flex size-10 items-center justify-center rounded-xl bg-teal text-white"><Icon name="message" /></span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">{t("With FrontDesk AI", "Con FrontDesk AI")}</p>
            <p className="mt-3 font-display text-2xl leading-tight">{t("“Happy to help.”", "“Con gusto te ayudo.”")}</p>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{t("Their question gets a response. Their interest is captured. Your team knows exactly where to pick up.", "Su pregunta recibe una respuesta. Su interés queda registrado. Tu equipo sabe cómo continuar la conversación.")}</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-teal"><Icon name="check" size={15} className="shrink-0" /> {t("A conversation worth continuing", "Una conversación para continuar")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
