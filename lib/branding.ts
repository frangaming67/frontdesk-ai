// Public, provisional product identity. Set before building a client deployment.
// These values are bundled into the browser; never put credentials here.
export const branding = {
  name: process.env.NEXT_PUBLIC_PRODUCT_NAME?.trim() || "Asistente Dental",
  defaultLocale: "es" as const,
  country: "Argentina",
  openGraphLocale: "es_AR",
} as const;
