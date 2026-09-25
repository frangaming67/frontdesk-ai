export function formatRelativeDate(iso: string, locale: "en" | "es" = "en"): string {
  const date = new Date(iso);
  const now = new Date();
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOf(now) - startOf(date)) / 86_400_000);

  if (diffDays === 0) return locale === "es" ? "Hoy" : "Today";
  if (diffDays === 1) return locale === "es" ? "Ayer" : "Yesterday";
  if (diffDays < 7) return locale === "es" ? `Hace ${diffDays} días` : `${diffDays} days ago`;
  return date.toLocaleDateString(locale === "es" ? "es-US" : "en-US", { month: "short", day: "numeric" });
}

export function formatTime(iso: string, locale: "en" | "es" = "en"): string {
  return new Date(iso).toLocaleTimeString(locale === "es" ? "es-US" : "en-US", { hour: "numeric", minute: "2-digit" });
}
