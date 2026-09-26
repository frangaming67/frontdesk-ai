import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { verificationAvailability } from "@/lib/verification/config";
import { VerificationError, VerificationService } from "@/lib/verification/service";
import { RedisVerificationStore } from "@/lib/verification/store";
import { providers } from "@/lib/verification/providers";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const cookieName = "fd-verification";

export function GET() { return NextResponse.json(verificationAvailability(), { headers }); }

async function readSmallJson(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json") || !request.body) throw new VerificationError("invalid", 400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 2048) { await reader.cancel(); throw new VerificationError("invalid", 413); }
    chunks.push(value);
  }
  try { const body = JSON.parse(Buffer.concat(chunks).toString("utf8")); if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error(); return body; }
  catch { throw new VerificationError("invalid", 400); }
}

export async function POST(request: NextRequest) {
  try {
    const expectedOrigin = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : new URL(request.url).origin;
    if (request.headers.get("origin") !== expectedOrigin || request.headers.get("sec-fetch-site") === "cross-site") return NextResponse.json({ error: "origin" }, { status: 403, headers });
    const body = await readSmallJson(request);
    if (body.action !== "send" && body.action !== "check") throw new VerificationError("invalid", 400);
    const available = verificationAvailability();
    if (!available.email && !available.sms) throw new VerificationError("unavailable", 503);
    const savedSession = request.cookies.get(cookieName)?.value;
    const validSession = savedSession && /^[a-f0-9-]{36}$/.test(savedSession) ? savedSession : undefined;
    if (body.action === "check" && !validSession) throw new VerificationError("incorrect", 400);
    const session = validSession ?? randomUUID();
    // Vercel overwrites this header at its trusted edge. Other hosts share the
    // fallback bucket until a trusted proxy integration is explicitly configured.
    const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown" : "local";
    const service = new VerificationService(new RedisVerificationStore(), providers, process.env.VERIFICATION_SECRET!, available);
    const result = body.action === "send" ? await service.send(body, session, ip) : await service.check(body, session, ip);
    const response = NextResponse.json(result, { headers });
    response.cookies.set(cookieName, session, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api/verification", maxAge: 1800 });
    return response;
  } catch (error) {
    const known = error instanceof VerificationError;
    return NextResponse.json({ error: known ? error.code : "unavailable" }, { status: known ? error.status : 503, headers: { ...headers, ...(known && error.code === "limited" ? { "Retry-After": "3600" } : {}) } });
  }
}
