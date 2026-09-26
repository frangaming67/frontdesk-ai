import { legalIdentityReady } from "../legal/config";

export function verificationAvailability() {
  const common = process.env.CONTACT_VERIFICATION_ENABLED === "true"
    && process.env.CONTACT_PRIVACY_REVIEWED === "true"
    && legalIdentityReady()
    && !!process.env.UPSTASH_REDIS_REST_URL?.startsWith("https://")
    && !!process.env.UPSTASH_REDIS_REST_TOKEN
    && (process.env.VERIFICATION_SECRET?.length ?? 0) >= 32
    && !!process.env.NEXT_PUBLIC_SITE_URL;
  return {
    email: !!(common && process.env.RESEND_API_KEY && process.env.VERIFICATION_EMAIL_FROM),
    sms: !!(common && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID),
  };
}
