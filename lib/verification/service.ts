import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { CONSENT_VERSION, normalizeContact } from "./contact";
import type { VerificationStore, Challenge } from "./store";
import type { VerificationProviders } from "./providers";
import type { Locale } from "../i18n/types";

export class VerificationError extends Error {
  constructor(public code: "invalid" | "consent" | "unavailable" | "limited" | "incorrect", public status: number) { super(code); }
}

export class VerificationService {
  constructor(private store: VerificationStore, private providers: VerificationProviders, private secret: string, private available: { email: boolean; sms: boolean }) {}
  private hash(value: string) { return createHmac("sha256", this.secret).update(value).digest("hex"); }
  async send(input: { contact?: unknown; consent?: unknown; consentVersion?: unknown; locale?: unknown }, session: string, ip: string) {
    const contact = normalizeContact(input.contact);
    if (!contact) throw new VerificationError("invalid", 400);
    if (input.consent !== true || input.consentVersion !== CONSENT_VERSION) throw new VerificationError("consent", 400);
    if (!this.available[contact.channel]) throw new VerificationError("unavailable", 503);
    const contactHash = this.hash(`contact:${contact.value}`);
    const sessionHash = this.hash(`session:${session}`);
    const allowed = await this.store.limit([
      { key: `cooldown:${contactHash}`, max: 1, seconds: 60 },
      { key: `contact:${contactHash}`, max: 3, seconds: 3600 },
      { key: `session:${sessionHash}`, max: 5, seconds: 3600 },
      { key: `ip:${this.hash(ip)}`, max: 10, seconds: 3600 },
      { key: "daily", max: 50, seconds: 86400 },
    ]);
    if (!allowed) throw new VerificationError("limited", 429);
    const id = randomUUID();
    const locale: Locale = input.locale === "es" ? "es" : "en";
    const code = String(randomInt(0, 1000000)).padStart(6, "0");
    const challenge: Challenge = { channel: contact.channel, contactHash, sessionHash, attempts: 0, consentVersion: CONSENT_VERSION, consentAt: new Date().toISOString() };
    if (contact.channel === "email") {
      challenge.codeHash = this.hash(`${id}:${code}`);
      // Save before sending. A storage failure must never permit an untracked send.
      await this.store.put(id, challenge);
      try { await this.providers.email(contact.value, code, locale, id); }
      catch (error) { await this.store.consume(id); throw error; }
    } else {
      await this.store.put(id, challenge);
      try { challenge.providerId = await this.providers.sms(contact.value, locale); await this.store.put(id, challenge); }
      catch (error) { await this.store.consume(id); throw error; }
    }
    return { challengeId: id, expiresIn: 600, retryAfter: 60 };
  }
  async check(input: { contact?: unknown; code?: unknown; challengeId?: unknown }, session: string, ip: string) {
    const contact = normalizeContact(input.contact);
    if (!contact || typeof input.code !== "string" || !/^\d{6}$/.test(input.code) || typeof input.challengeId !== "string" || !/^[a-f0-9-]{36}$/.test(input.challengeId)) throw new VerificationError("invalid", 400);
    if (!this.available[contact.channel]) throw new VerificationError("unavailable", 503);
    if (!await this.store.limit([{ key: `checks:${this.hash(ip)}`, max: 60, seconds: 3600 }])) throw new VerificationError("limited", 429);
    const challenge = await this.store.attempt(input.challengeId, this.hash(`contact:${contact.value}`), this.hash(`session:${session}`));
    if (!challenge || challenge.channel !== contact.channel) throw new VerificationError("incorrect", 400);
    const matches = contact.channel === "email"
      ? !!challenge.codeHash && timingSafeEqual(Buffer.from(challenge.codeHash), Buffer.from(this.hash(`${input.challengeId}:${input.code}`)))
      : !!challenge.providerId && await this.providers.checkSms(challenge.providerId, input.code);
    if (!matches || !await this.store.consume(input.challengeId)) throw new VerificationError("incorrect", 400);
    return { verified: true as const, channel: contact.channel, verifiedAt: new Date().toISOString(), consentVersion: challenge.consentVersion };
  }
}
