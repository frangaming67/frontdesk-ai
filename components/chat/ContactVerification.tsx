"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { CONSENT_VERSION, normalizeContact } from "@/lib/verification/contact";
import type { ContactVerificationRecord } from "@/lib/leads/types";
import { branding } from "@/lib/branding";

export function ContactVerification({ contact, onComplete, onCancel }: { contact: string; onComplete: (contact: string, verification?: ContactVerificationRecord) => void; onCancel: () => void }) {
  const { t, locale } = useLanguage();
  const [available, setAvailable] = useState<{ email: boolean; sms: boolean } | null>(null);
  const [consent, setConsent] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const active = useRef(true);
  const inFlight = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const codeInput = useRef<HTMLInputElement>(null);
  const normalized = normalizeContact(contact);
  const canSend = !!(normalized && available?.[normalized.channel]);
  useEffect(() => {
    active.current = true;
    heading.current?.focus();
    const controller = new AbortController();
    fetch("/api/verification", { signal: controller.signal, cache: "no-store" })
      .then(response => response.ok ? response.json() : { email: false, sms: false })
      .then(result => { if (active.current) setAvailable(result); })
      .catch(() => { if (active.current) setAvailable({ email: false, sms: false }); });
    return () => { active.current = false; controller.abort(); };
  }, []);
  useEffect(() => { if (challengeId) codeInput.current?.focus(); }, [challengeId]);
  useEffect(() => {
    if (!countdown) return;
    const timeout = setTimeout(() => setCountdown(current => Math.max(0, current - 1)), 1000);
    return () => clearTimeout(timeout);
  }, [countdown]);
  async function submit(action: "send" | "check") {
    if (inFlight.current || !normalized || !consent || !canSend) return;
    inFlight.current = true; setBusy(true); setError("");
    try {
      const response = await fetch("/api/verification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, contact: normalized.value, consent, consentVersion: CONSENT_VERSION, locale, challengeId, code }), signal: AbortSignal.timeout(25000) });
      const result = await response.json();
      if (!active.current) return;
      if (!response.ok) { setError(result.error || "unavailable"); if (result.error === "limited") setCountdown(60); return; }
      if (action === "send") { setChallengeId(result.challengeId); setCountdown(result.retryAfter); setCode(""); }
      else if (result.verified === true) { setCode(""); onComplete(normalized.value, { channel: result.channel, verifiedAt: result.verifiedAt, consentVersion: result.consentVersion }); }
    } catch { if (active.current) setError("unavailable"); }
    finally { inFlight.current = false; if (active.current) setBusy(false); }
  }
  return (
    <section className="rounded-2xl border border-teal/20 bg-white p-4 sm:p-5" aria-labelledby="verify-title">
      <p className="eyebrow">{t("Your contact. Your choice.", "Tu contacto. Tú decides.")}</p>
      <h3 id="verify-title" ref={heading} tabIndex={-1} className="mt-2 text-2xl">{t("Confirm it’s really you.", "Confirma que eres tú.")}</h3>
      <p className="mt-2 break-all text-sm font-medium text-teal">{contact}</p>
      <p className="mt-2 text-xs leading-5 text-ink-soft">{t("A code verifies your contact only. It does not book an appointment or send your conversation to a clinic.", "El código solo verifica tu contacto. No reserva una cita ni envía tu conversación a una clínica.")}</p>
      {!available && <p role="status" className="mt-3 text-xs">{t("Checking sending availability…", "Consultando disponibilidad de envíos…")}</p>}
      {available && !canSend && <p role="status" className="mt-3 rounded-xl bg-teal-tint p-3 text-xs leading-5 text-teal-deep">{!normalized ? t("For live verification, use an email or a +1 phone number. You can still try the fictional example below.", "Para verificar, usa un correo o un teléfono +1. Puedes continuar con el ejemplo ficticio.") : t("Real messages are not enabled for this channel yet. Nothing has been sent. Continue with a fictional contact to explore the demo.", "Los mensajes reales todavía no están habilitados para este canal. No se envió nada. Continúa con un contacto ficticio para explorar la demo.")}</p>}
      {canSend && <>
        <label className="mt-4 flex items-start gap-3 text-xs leading-5 text-ink-soft">
          <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} disabled={busy || !!challengeId} className="mt-1 size-4 shrink-0 accent-teal" />
          <span>{t(`I am 18 or older, this contact belongs to me, and I request a verification code from ${branding.name}. No marketing. SMS message/data rates may apply. I have read the`, `Tengo 18 años o más, este contacto es mío y solicito un código de ${branding.name}. Sin publicidad. Pueden aplicarse cargos de SMS/datos. Leí el aviso de`)} <Link href="/privacy" target="_blank" rel="noreferrer" className="text-teal underline">{t("privacy notice", "privacidad")}</Link> {t("and", "y los")} <Link href="/terms" target="_blank" rel="noreferrer" className="text-teal underline">{t("demo terms", "términos de la demo")}</Link>.</span>
        </label>
        {challengeId && <>
          <p role="status" className="mt-3 text-xs leading-5 text-teal">{t("The provider accepted the code request. Check your email (including spam) or SMS. It expires in 10 minutes; delivery may take a moment.", "El proveedor aceptó el envío del código. Revisa tu correo (incluido spam) o SMS. Vence en 10 minutos; puede demorar en llegar.")}</p>
          <form onSubmit={event => { event.preventDefault(); void submit("check"); }} className="mt-4">
            <label htmlFor="verification-code" className="block text-xs font-medium">{t("6-digit code", "Código de 6 dígitos")}</label>
            <div className="mt-2 flex flex-wrap gap-2"><input ref={codeInput} id="verification-code" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required disabled={busy} className="min-w-0 flex-1 rounded-xl border border-line px-3 py-2 tracking-[.25em]" /><button type="submit" disabled={busy || code.length !== 6} className="button-primary">{busy ? t("Checking…", "Verificando…") : t("Confirm code", "Confirmar código")}</button></div>
          </form>
        </>}
        <button type="button" onClick={() => void submit("send")} disabled={!consent || busy || countdown > 0} className={`${challengeId ? "button-secondary" : "button-primary"} mt-3 w-full !text-xs`}>
          {busy && !challengeId ? t("Requesting code…", "Solicitando código…") : countdown > 0 ? t(`Wait ${countdown}s to resend`, `Espera ${countdown}s para reenviar`) : challengeId ? t("Request another code", "Solicitar otro código") : t(`Send a real code by ${normalized?.channel === "email" ? "email" : "SMS"}`, `Enviar código real por ${normalized?.channel === "email" ? "email" : "SMS"}`)}
        </button>
      </>}
      {error && <p role="alert" className="mt-3 text-xs leading-5 text-coral">{error === "incorrect" ? t("That code is incorrect, expired, or already used. You have up to five attempts per request.", "El código es incorrecto, venció o ya se usó. Tienes hasta cinco intentos por solicitud.") : error === "limited" ? t("The sending or attempt limit was reached. Try again later, or continue with fictional details.", "Se alcanzó el límite de envíos o intentos. Reintenta más tarde o continúa con datos ficticios.") : t("Verification is unavailable. We cannot confirm delivery. Try again later or use the fictional example.", "La verificación no está disponible. No podemos confirmar la entrega. Reintenta más tarde o usa el ejemplo ficticio.")}</p>}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-line-soft pt-3">
        <button type="button" disabled={busy} onClick={() => onComplete("alex@example.com")} className="min-h-10 text-xs font-semibold text-teal underline underline-offset-4">{t("Use fictional details instead", "Usar datos ficticios")}</button>
        <button type="button" disabled={busy} onClick={onCancel} className="min-h-10 text-xs text-ink-soft underline underline-offset-4">{t("Edit contact", "Cambiar contacto")}</button>
      </div>
      <p className="mt-1 text-[10px] leading-4 text-ink-soft">{t("The fictional option uses alex@example.com and sends no messages.", "La opción ficticia usa alex@example.com y no envía mensajes.")}</p>
    </section>
  );
}
