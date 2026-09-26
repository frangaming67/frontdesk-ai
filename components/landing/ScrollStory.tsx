"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon, type IconName } from "@/components/ui/Icon";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ScrollStory() {
  const { t } = useLanguage();
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = track.current;
    const sticky = stage.current;
    if (!element || !sticky) return;

    const desktop = window.matchMedia("(min-width: 900px) and (min-height: 650px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    function update() {
      frame = 0;
      if (!element || !sticky) return;
      const animate = desktop.matches && !reducedMotion.matches;
      element.dataset.animated = String(animate);
      const rect = element.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      // Use the actual sticky travel so every phase finishes before it unpins.
      const travel = Math.max(1, element.offsetHeight - sticky.offsetHeight);
      const progress = animate ? clamp((top - rect.top) / travel) : 1;
      element.style.setProperty("--flow-progress", progress.toFixed(4));
      element.style.setProperty("--flow-expand", clamp(progress / .3).toFixed(4));
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const resize = new ResizeObserver(schedule);
    resize.observe(sticky);
    update();
    desktop.addEventListener("change", schedule);
    reducedMotion.addEventListener("change", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      desktop.removeEventListener("change", schedule);
      reducedMotion.removeEventListener("change", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [t]);

  const incoming: { icon: IconName; label: string; detail: string }[] = [
    { icon: "message", label: t("A late-night question", "Una pregunta de noche"), detail: t('“Do you offer Invisalign?”', '«¿Ofrecen Invisalign?»') },
    { icon: "clock", label: t("A busy afternoon", "Una tarde ocupada"), detail: t('“What time do you close?”', '«¿A qué hora cierran?»') },
    { icon: "calendar", label: t("Ready for the next step", "Listo para dar el paso"), detail: t('“I’d like a consultation.”', '«Quisiera una consulta.»') },
  ];
  const outgoing: { icon: IconName; label: string; detail: string }[] = [
    { icon: "sparkles", label: t("A helpful answer", "Una respuesta útil"), detail: t("Based on your practice’s information.", "Basada en la información de tu clínica.") },
    { icon: "users", label: t("A captured contact", "Un contacto registrado"), detail: t("Interest, details, and preferences.", "Interés, datos y preferencias.") },
    { icon: "check-circle", label: t("A clear next step", "El siguiente paso, claro"), detail: t("Your team reviews and confirms.", "Tu equipo revisa y confirma.") },
  ];
  const steps = [t("A question comes in", "Llega una consulta"), t("FrontDesk connects", "FrontDesk conecta"), t("Your team takes over", "Tu equipo continúa")];

  return (
    <section className="journey" aria-labelledby="journey-title">
      <div className="page-shell journey-heading text-center">
        <p className="eyebrow">{t("A little attention. A bigger opportunity.", "Un poco de atención. Una gran oportunidad.")}</p>
        <h2 id="journey-title" className="mx-auto mt-3 max-w-2xl text-3xl leading-tight sm:text-[44px]">{t("Every conversation opens a door.", "Cada conversación abre una puerta.")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink-soft">{t("From the first hello to a clear next step. Follow the conversation.", "Del primer saludo al siguiente paso. Sigue el recorrido de una conversación.")}</p>
      </div>
      <div ref={track} className="journey-track">
        <div ref={stage} className="journey-sticky">
          <div className="journey-panel">
            <div className="journey-caption">
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#C5D8B7]" />{t("THE FRONTDESK FLOW", "EL RECORRIDO FRONTDESK")}</span>
              <span>{t("Illustrative demo", "Demo ilustrativa")}</span>
            </div>
            <ol className="journey-steps" aria-label={t("Conversation flow", "Recorrido de la conversación")}>
              {steps.map((label, index) => (
                <li key={index} style={{ "--step-index": index } as CSSProperties}>
                  <span className="journey-step-number">0{index + 1}</span><span>{label}</span>
                  <span className="journey-step-track" aria-hidden="true"><span /></span>
                </li>
              ))}
            </ol>
            <div className="journey-map">
              <svg className="journey-lines" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
                {[60, 180, 300].map((y, index) => (
                  <g key={y} style={{ "--node-index": index } as CSSProperties}>
                    <path className="journey-line-base" d={`M 270 ${y} C 385 ${y}, 385 180, 500 180 S 615 ${y}, 730 ${y}`} />
                    <path className="journey-line-active journey-line-in" pathLength="1" d={`M 270 ${y} C 385 ${y}, 385 180, 500 180`} />
                    <path className="journey-line-active journey-line-out" pathLength="1" d={`M 500 180 C 615 180, 615 ${y}, 730 ${y}`} />
                    <circle className="journey-line-port journey-port-in" cx="280" cy={y} r="3" />
                    <circle className="journey-line-port journey-port-out" cx="720" cy={y} r="3" />
                  </g>
                ))}
              </svg>
              <ol className="journey-nodes journey-inputs">
                {incoming.map((item, index) => <li key={item.icon} className="journey-node" style={{ "--node-index": index } as CSSProperties}><span className="journey-node-icon"><Icon name={item.icon} size={19} /></span><div><h3>{item.label}</h3><p>{item.detail}</p></div></li>)}
              </ol>
              <div className="journey-center">
                <div className="journey-orbit" aria-hidden="true" />
                <span className="journey-mark"><Icon name="message" size={35} /></span>
                <p className="journey-brand">FrontDesk <span>AI</span></p>
                <p className="journey-center-detail">{t("A warm welcome, at every step.", "Una cálida bienvenida, en cada paso.")}</p>
                <span className="journey-center-tag"><span />{t("Every conversation, connected", "Cada conversación, conectada")}</span>
              </div>
              <ol className="journey-nodes journey-results">
                {outgoing.map((item, index) => <li key={item.icon} className="journey-node" style={{ "--node-index": index } as CSSProperties}><span className="journey-node-icon"><Icon name={item.icon} size={19} /></span><div><h3>{item.label}</h3><p>{item.detail}</p></div></li>)}
              </ol>
            </div>
            <div className="journey-bottom">
              <p>{t("Questions answered. Interest captured.", "Preguntas respondidas. Interés registrado.")}<br /><span>{t("Your team, always in control.", "Tu equipo, siempre al mando.")}</span></p>
              <Link href="/chat" className="journey-cta">{t("Try the flow", "Prueba el recorrido")}<Icon name="arrow-right" size={16} /></Link>
            </div>
          </div>
          <p className="journey-scroll-hint" aria-hidden="true"><span>{t("SCROLL TO UNFOLD", "BAJA PARA DESCUBRIR")}</span><span className="journey-scroll-line"><span /></span><span>↓</span></p>
        </div>
      </div>
    </section>
  );
}
