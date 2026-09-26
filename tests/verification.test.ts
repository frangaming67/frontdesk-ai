import assert from "node:assert/strict";
import { test } from "node:test";
import { VerificationService, VerificationError } from "../lib/verification/service";
import { CONSENT_VERSION, normalizeContact } from "../lib/verification/contact";
import { verificationAvailability } from "../lib/verification/config";
import type { Challenge, VerificationStore } from "../lib/verification/store";
import { providers, type VerificationProviders } from "../lib/verification/providers";
import { GET, POST } from "../app/api/verification/route";
import { NextRequest } from "next/server";

function fixture(available = { email: true, sms: true }) {
  const items = new Map<string, Challenge>();
  let allowed = true;
  let outage = false;
  let lastCode = "";
  let sends = 0;
  let smsApproved = false;
  const store: VerificationStore = {
    async limit() { if (outage) throw new Error("Redis offline"); return allowed; },
    async put(id, item) { items.set(id, structuredClone(item)); },
    async attempt(id, contact, session) { const item = items.get(id); if (!item || item.contactHash !== contact || item.sessionHash !== session || item.attempts >= 5) return null; item.attempts++; return structuredClone(item); },
    async consume(id) { return items.delete(id); },
  };
  const delivery: VerificationProviders = {
    async email(_to, code) { sends++; lastCode = code; },
    async sms() { sends++; return "VE" + "a".repeat(32); },
    async checkSms() { return smsApproved; },
  };
  const service = new VerificationService(store, delivery, "test-secret-which-is-at-least-32-characters", available);
  const send = () => service.send({ contact: "alex@example.com", consent: true, consentVersion: CONSENT_VERSION, locale: "es" }, "session-a", "ip-a");
  return { service, items, send, delivery, get code() { return lastCode; }, get sends() { return sends; }, block() { allowed = false; }, offline() { outage = true; }, approveSms() { smsApproved = true; } };
}
const errorCode = (code: string) => (error: unknown) => error instanceof VerificationError && error.code === code;

test("real sending stays disabled when the operator address is missing", () => {
  const values: Record<string, string> = {
    CONTACT_VERIFICATION_ENABLED: "true", CONTACT_PRIVACY_REVIEWED: "true",
    LEGAL_OPERATOR_NAME: "Test operator", LEGAL_OPERATOR_COUNTRY: "Argentina",
    LEGAL_OPERATOR_ADDRESS: "", LEGAL_CONTACT_EMAIL: "privacy@example.com",
    UPSTASH_REDIS_REST_URL: "https://redis.example.com", UPSTASH_REDIS_REST_TOKEN: "test-only",
    VERIFICATION_SECRET: "test-only-secret-at-least-32-characters", NEXT_PUBLIC_SITE_URL: "https://example.com",
    RESEND_API_KEY: "test-only", VERIFICATION_EMAIL_FROM: "Test <verify@example.com>",
    TWILIO_ACCOUNT_SID: "test-only", TWILIO_AUTH_TOKEN: "test-only", TWILIO_VERIFY_SERVICE_SID: "test-only",
  };
  const previous = Object.fromEntries(Object.keys(values).map(key => [key, process.env[key]]));
  try {
    Object.assign(process.env, values);
    assert.deepEqual(verificationAvailability(), { email: false, sms: false });
    process.env.LEGAL_OPERATOR_ADDRESS = "Test address (fixture only)";
    assert.deepEqual(verificationAvailability(), { email: true, sms: true });
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test("contact validation normalizes email/+1 numbers and rejects injection and unsupported numbers", () => {
  assert.deepEqual(normalizeContact(" ALEX@Example.com "), { channel: "email", value: "alex@example.com" });
  assert.deepEqual(normalizeContact("(305) 555-0142"), { channel: "sms", value: "+13055550142" });
  for (const value of ["x@y.com\r\nBcc: x@y.com", "<script>@example.com", "+5491123456789", "305555", {}, "1234567890"]) assert.equal(normalizeContact(value), null);
});
test("consent, current notice version and enabled channel are required before sending", async () => {
  const f = fixture();
  for (const consent of [undefined, false, "true"]) await assert.rejects(f.service.send({ contact: "alex@example.com", consent, consentVersion: CONSENT_VERSION }, "s", "ip"), errorCode("consent"));
  await assert.rejects(f.service.send({ contact: "alex@example.com", consent: true, consentVersion: "old" }, "s", "ip"), errorCode("consent"));
  assert.equal(f.sends, 0);
  const disabled = fixture({ email: false, sms: false });
  await assert.rejects(disabled.send(), errorCode("unavailable")); assert.equal(disabled.sends, 0);
});
test("email checks bind contact and session, never expose codes, and consume successful challenges once", async () => {
  const f = fixture(); const result = await f.send();
  assert.match(f.code, /^\d{6}$/);
  assert.equal(JSON.stringify(result).includes(f.code), false);
  const record = JSON.stringify([...f.items.values()]);
  assert.equal(record.includes("alex@example.com"), false); assert.equal(record.includes(`"${f.code}"`), false);
  const check = { challengeId: result.challengeId, contact: "alex@example.com", code: f.code };
  await assert.rejects(f.service.check(check, "another-session", "ip-a"), errorCode("incorrect"));
  await assert.rejects(f.service.check({ ...check, contact: "someone@example.com" }, "session-a", "ip-a"), errorCode("incorrect"));
  const [first, second] = await Promise.allSettled([f.service.check(check, "session-a", "ip-a"), f.service.check(check, "session-a", "ip-a")]);
  assert.equal([first, second].filter(result => result.status === "fulfilled").length, 1);
  await assert.rejects(f.service.check(check, "session-a", "ip-a"), errorCode("incorrect"));
});
test("five wrong attempts exhaust a challenge and expired challenges cannot pass", async () => {
  const f = fixture(); const result = await f.send();
  const wrong = f.code === "000000" ? "000001" : "000000";
  for (let i = 0; i < 5; i++) await assert.rejects(f.service.check({ contact: "alex@example.com", code: wrong, challengeId: result.challengeId }, "session-a", "ip-a"), errorCode("incorrect"));
  await assert.rejects(f.service.check({ contact: "alex@example.com", code: f.code, challengeId: result.challengeId }, "session-a", "ip-a"), errorCode("incorrect"));
  const expired = fixture(); const sent = await expired.send(); expired.items.clear();
  await assert.rejects(expired.service.check({ contact: "alex@example.com", code: expired.code, challengeId: sent.challengeId }, "session-a", "ip-a"), errorCode("incorrect"));
});
test("rate-limit rejection and Redis outages fail closed without delivery", async () => {
  const f = fixture(); f.block(); await assert.rejects(f.send(), errorCode("limited")); assert.equal(f.sends, 0);
  const offline = fixture(); offline.offline(); await assert.rejects(offline.send(), /offline/); assert.equal(offline.sends, 0);
});
test("provider failure leaves no usable challenge", async () => {
  const f = fixture(); f.delivery.email = async () => { throw new Error("provider failed"); };
  await assert.rejects(f.send(), /provider failed/); assert.equal(f.items.size, 0);
});
test("SMS verification requires provider approval and consumes the result", async () => {
  const f = fixture(); const result = await f.service.send({ contact: "+13055550142", consent: true, consentVersion: CONSENT_VERSION }, "session-a", "ip-a");
  const input = { contact: "+13055550142", challengeId: result.challengeId, code: "123456" };
  await assert.rejects(f.service.check(input, "session-a", "ip-a"), errorCode("incorrect"));
  f.approveSms(); assert.equal((await f.service.check(input, "session-a", "ip-a")).verified, true);
  await assert.rejects(f.service.check(input, "session-a", "ip-a"), errorCode("incorrect"));
});
test("unconfigured public API rejects cross-site requests, malformed/large JSON and does not pretend to send", async () => {
  const old = process.env.CONTACT_VERIFICATION_ENABLED; process.env.CONTACT_VERIFICATION_ENABLED = "false";
  try {
    assert.deepEqual(verificationAvailability(), { email: false, sms: false });
    assert.deepEqual(await GET().json(), { email: false, sms: false });
    const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3107";
    const origin = new URL(url).origin;
    const request = (body: string, override = origin) => new NextRequest(`${origin}/api/verification`, { method: "POST", headers: { origin: override, "content-type": "application/json" }, body });
    assert.equal((await POST(request("{}", "https://evil.example"))).status, 403);
    assert.equal((await POST(request("{"))).status, 400);
    assert.equal((await POST(request("null"))).status, 400);
    assert.equal((await POST(request(JSON.stringify({ huge: "x".repeat(3000) })))).status, 413);
    const response = await POST(request(JSON.stringify({ action: "send", contact: "alex@example.com", consent: true })));
    assert.equal(response.status, 503); assert.deepEqual(await response.json(), { error: "unavailable" });
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally { if (old === undefined) delete process.env.CONTACT_VERIFICATION_ENABLED; else process.env.CONTACT_VERIFICATION_ENABLED = old; }
});
test("provider adapters send only transactional details and handle provider status correctly", async () => {
  const originalFetch = globalThis.fetch;
  const calls: { url: string; body: string; headers: Headers }[] = [];
  globalThis.fetch = async (url, init) => { calls.push({ url: String(url), body: String(init?.body), headers: new Headers(init?.headers) }); return Response.json(calls.length === 1 ? { id: "email-id" } : calls.length === 2 ? { sid: "VE" + "a".repeat(32), status: "pending" } : { valid: true, status: "approved" }); };
  try {
    await providers.email("alex@example.com", "123456", "es", "request-id");
    await providers.sms("+13055550142", "es");
    assert.equal(await providers.checkSms("VE" + "a".repeat(32), "123456"), true);
    const email = JSON.parse(calls[0].body); assert.match(email.text, /no confirma una cita/); assert.deepEqual(email.to, ["alex@example.com"]);
    assert.equal(calls[0].headers.get("idempotency-key"), "verify-request-id");
    assert.match(calls[1].body, /RiskCheck=enable/); assert.match(calls[2].url, /VerificationCheck$/);
    assert.equal(calls.some(call => /conversation|treatment/i.test(call.body)), false);
  } finally { globalThis.fetch = originalFetch; }
});
