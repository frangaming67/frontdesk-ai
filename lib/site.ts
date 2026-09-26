import { branding } from "./branding";

// Vercel supplies the public host at build time; no API keys are needed.
// NEXT_PUBLIC_SITE_URL is an optional override for a custom domain.
export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

  const url = new URL(
    configuredUrl || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")
  );

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a full http:// or https:// URL.");
  }

  return new URL(url.origin);
}

export const siteTitle = `${branding.name} — Demo para consultorios odontológicos`;
export const siteDescription =
  "Demo de un asistente para consultorios odontológicos en Argentina. Explora respuestas y solicitudes de consulta con datos ficticios.";
