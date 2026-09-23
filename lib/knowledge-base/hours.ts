// Fictional operating hours for the demo practice.

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

export function hoursSummary(): string {
  return "Monday–Friday, 8:00 AM–6:00 PM. Saturday, 9:00 AM–1:00 PM. Closed Sunday.";
}
