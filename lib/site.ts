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

export const siteTitle = "FrontDesk AI — Never miss a new patient again";
export const siteDescription =
  "An AI receptionist demo for dental practices. Answer patient questions, qualify interest, and capture consultation requests — day or night.";
