import type { Locale } from "./types";
import { treatmentName } from "@/lib/knowledge-base/treatments";

const PREFERENCES: [string, string][] = [
  ["Monday", "Lunes"], ["Tuesday", "Martes"], ["Wednesday", "Miércoles"],
  ["Thursday", "Jueves"], ["Friday", "Viernes"], ["Saturday", "Sábado"],
  ["Sunday", "Domingo"], ["Any weekday", "Cualquier día de semana"],
  ["Morning", "Mañana"], ["Afternoon", "Tarde"],
  ["Morning", "Por la mañana"], ["Afternoon", "Por la tarde"],
];

export function treatmentLabel(value: string, locale: Locale): string {
  return treatmentName(value, locale);
}

// Only translate known options; preserve free-form patient preferences verbatim.
export function preferenceLabel(value: string | undefined, locale: Locale): string {
  if (!value) return locale === "es" ? "Sin preferencia" : "No preference";
  const option = PREFERENCES.find((pair) => pair.some((label) => label.toLocaleLowerCase() === value.toLocaleLowerCase()));
  return option ? option[locale === "es" ? 1 : 0] : value;
}
