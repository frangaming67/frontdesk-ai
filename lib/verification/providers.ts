import type { Locale } from "../i18n/types";

export interface VerificationProviders {
  email(to: string, code: string, locale: Locale, id: string): Promise<void>;
  sms(to: string, locale: Locale): Promise<string>;
  checkSms(id: string, code: string): Promise<boolean>;
}

async function twilio(path: string, values: Record<string, string>) {
  const result = await fetch(`https://verify.twilio.com/v2/Services/${encodeURIComponent(process.env.TWILIO_VERIFY_SERVICE_SID!)}/${path}`, {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(10000),
    headers: { Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(values),
  });
  // Never return provider bodies: they can contain phone numbers and account data.
  if (!result.ok) throw new Error("Verification provider unavailable");
  return result.json();
}

export const providers: VerificationProviders = {
  async email(to, code, locale, id) {
    const es = locale === "es";
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `verify-${id}` },
      body: JSON.stringify({
        from: process.env.VERIFICATION_EMAIL_FROM, to: [to],
        subject: es ? "Tu código de FrontDesk AI" : "Your FrontDesk AI code",
        text: es
          ? `Tu código de confirmación es ${code}. Vence en 10 minutos. Solo verifica tu correo para la demo de FrontDesk AI; no confirma una cita ni suscribe a publicidad. Si no lo solicitaste, ignora este mensaje. Contacto: ${process.env.LEGAL_CONTACT_EMAIL}`
          : `Your confirmation code is ${code}. It expires in 10 minutes. It only verifies your email for the FrontDesk AI demo; it does not confirm an appointment or subscribe you to marketing. If you did not request it, ignore this message. Contact: ${process.env.LEGAL_CONTACT_EMAIL}`,
      }),
    });
    if (!result.ok || !(await result.json()).id) throw new Error("Verification provider unavailable");
  },
  async sms(to, locale) {
    const result = await twilio("Verifications", { To: to, Channel: "sms", Locale: locale, RiskCheck: "enable" });
    if (result.status !== "pending" || !/^VE[a-f0-9]{32}$/i.test(result.sid)) throw new Error("Verification provider unavailable");
    return result.sid;
  },
  async checkSms(id, code) {
    const result = await twilio("VerificationCheck", { VerificationSid: id, Code: code });
    return result.status === "approved" && result.valid === true;
  },
};
