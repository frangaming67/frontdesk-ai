"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon, type IconName } from "@/components/ui/Icon";

export function ScrollStory() {
  const { t } = useLanguage();
  const section = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    function update() {
      frame = 0;
      if (!section.current || !panel.current) return;
      const rect = section.current.getBoundingClientRect();
      const progress = media.matches ? Math.min(1, Math.max(0, (96 - rect.top) / (rect.height - window.innerHeight))) : 1;
      panel.current.style.setProperty("--journey-progress", String(progress));
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function change() { setAnimated(media.matches); schedule(); }
    change();
    media.addEventListener("change", change);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); media.removeEventListener("change", change); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  const incoming: { icon: IconName; label: string; detail: string }[] = [
    { icon: "message", label: t("A late-night question", "Una pregunta de noche"), detail: t('“Do you offer Invisalign?”', '«¿Ofrecen Invisalign?»') },
    { icon: "clock", label: t("A busy afternoon", "Una tarde ocupada"), detail: t('“What time do you close?”', '«¿A qué hora cierran?»') },
    { icon: "calendar", label: t("Ready for the next step", "Listo para dar el paso"), detail: t('“I’d like a consultation.”', '«Quisiera una consulta.»') },
  ];
  const outgoing = [
    { icon: "sparkles" as const, label: t("A helpful answer", "Una respuesta útil"), detail: t("Based on your practice’s information.", "Basada en la información de tu clínica.") },
    { icon: "users" as const, label: t("A captured contact", "Un contacto registrado"), detail: t("Interest, details, and preferences.", "Interés, datos y preferencias.") },
    { icon: "check-circle" as const, label: t("A clear next step", "El siguiente paso, claro"), detail: t("Your team reviews and confirms.", "Tu equipo revisa y confirma.") },
  ];
  return (
    <section ref={section} className={`journey ${animated ? "journey-animated" : ""}`} aria-labelledby="journey-title">
      <div className="journey-sticky">
        <div className="page-shell mb-8 text-center">
          <p className="eyebrow">{t("A little attention. A bigger opportunity.", "Un poco de atención. Una gran oportunidad.")}</p>
          <h2 id="journey-title" className="mx-auto mt-3 max-w-2xl text-3xl leading-tight sm:text-[44px]">{t("Every conversation opens a door.", "Cada conversación abre una puerta.")}</h2>
          <p className="mt-3 text-sm text-ink-soft">{t("Follow a question from the first hello to your team’s next conversation.", "Sigue una pregunta desde el primer saludo hasta el contacto con tu equipo.")}</p>
        </div>
        <div ref={panel} className="journey-panel" style={{ "--journey-progress": 1 } as CSSProperties}>
          <div className="journey-caption"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#C5D8B7]" />{t("THE FRONTDESK FLOW", "EL RECORRIDO FRONTDESK")}</span><span>{t("Illustrative demo", "Demo ilustrativa")}</span></div>
          <div className="journey-map">
            <svg className="journey-lines" viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true">
              {[48, 160, 272].map(y => <g key={y}><path className="journey-line-base" d={`M 250 ${y} C 355 ${y}, 365 160, 500 160 S 655 ${y}, 750 ${y}`} /><path className="journey-line-active" pathLength="1" d={`M 250 ${y} C 355 ${y}, 365 160, 500 160 S 655 ${y}, 750 ${y}`} /></g>)}
            </svg>
            <ol className="journey-nodes">
              {incoming.map(item => <li key={item.icon} className="journey-node"><Icon name={item.icon} size={19} /><div><h3>{item.label}</h3><p>{item.detail}</p></div></li>)}
            </ol>
            <div className="journey-center"><div className="journey-orbit" aria-hidden="true" /><span className="journey-mark"><Icon name="message" size={35} /></span><p className="mt-5 text-xl font-semibold tracking-tight">FrontDesk <span className="font-normal text-[#C5D8B7]">AI</span></p><p className="mt-2 max-w-36 text-center text-xs leading-5 text-white/75">{t("A warm welcome, at every step.", "Una cálida bienvenida, en cada paso.")}</p></div>
            <ol className="journey-nodes journey-results">
              {outgoing.map((item, index) => <li key={item.icon} className="journey-node" style={{ "--node-index": index } as CSSProperties}><Icon name={item.icon} size={19} /><div><h3>{item.label}</h3><p>{item.detail}</p></div></li>)}
            </ol>
          </div>
          <div className="journey-bottom"><p>{t("Questions answered. Interest captured. Your team in control.", "Preguntas respondidas. Interés registrado. Tu equipo al mando.")}</p><Link href="/chat" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-teal-deep">{t("Try the flow", "Prueba el recorrido")}<Icon name="arrow-right" size={16} /></Link></div>
        </div>
        <p className="journey-scroll-hint mt-5 text-center text-[11px] text-ink-soft" aria-hidden="true">{t("SCROLL TO UNFOLD", "BAJA PARA DESCUBRIR")} <span className="ml-2">↓</span></p>
      </div>
    </section>
  );
}
