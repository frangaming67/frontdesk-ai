export type Locale = "en" | "es";

export const LANGUAGE_COOKIE = "frontdesk-language";

export function parseLocale(value: string | undefined): Locale {
  return value === "es" ? "es" : "en";
}
