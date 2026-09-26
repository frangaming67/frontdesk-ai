export type ContactChannel = "email" | "sms";

export function normalizeContact(raw: unknown): { channel: ContactChannel; value: string } | null {
  if (typeof raw !== "string" || raw.length > 254) return null;
  const value = raw.trim();
  if (/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(value)) {
    return { channel: "email", value: value.toLowerCase() };
  }
  if (!/^[+\d().\s-]+$/.test(value)) return null;
  let phone = value.replace(/[().\s-]/g, "");
  if (/^\d{10}$/.test(phone)) phone = `+1${phone}`;
  if (/^1\d{10}$/.test(phone)) phone = `+${phone}`;
  // This initial demo supports North American +1 numbers; provider geo rules
  // must also be configured before enabling SMS.
  return /^\+1[2-9]\d{2}[2-9]\d{6}$/.test(phone) ? { channel: "sms", value: phone } : null;
}

export const CONSENT_VERSION = "2026-09-25";
