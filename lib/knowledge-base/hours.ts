// Fictional operating hours for the demo practice.
import type { Locale } from "@/lib/i18n/types";

export interface DayHours {
  day: string;
  label: string;
}

export const hours: DayHours[] = [
  { day: "Monday", label: "8:00 AM – 6:00 PM" },
  { day: "Tuesday", label: "8:00 AM – 6:00 PM" },
  { day: "Wednesday", label: "8:00 AM – 6:00 PM" },
  { day: "Thursday", label: "8:00 AM – 6:00 PM" },
  { day: "Friday", label: "8:00 AM – 6:00 PM" },
  { day: "Saturday", label: "9:00 AM – 1:00 PM" },
  { day: "Sunday", label: "Closed" },
];

export function hoursSummary(locale: Locale = "en"): string {
  if (locale === "es") return "Lunes a viernes, de 8:00 a. m. a 6:00 p. m. Sábados, de 9:00 a. m. a 1:00 p. m. Cerrado los domingos.";
  return "Monday–Friday, 8:00 AM–6:00 PM. Saturday, 9:00 AM–1:00 PM. Closed Sunday.";
}
